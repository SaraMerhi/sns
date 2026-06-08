import re
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

app.secret_key = "sns-roomify-secret-key"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///roomify.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "signin"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for("signin"))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    is_admin = db.Column(db.Integer, default=0, nullable=False)


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(100), nullable=False)
    room_title = db.Column(db.String(100), nullable=False)
    room_data = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    
class ContactUs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    is_read = db.Column(db.Integer, default=0, nullable=False)


def valid_email(email):
    return email.endswith("@gmail.com") or email.endswith("@usal.edu.lb")


def valid_password(password):
    has_letter = re.search(r"[A-Za-z]", password)
    has_number = re.search(r"[0-9]", password)
    return len(password) > 7 and has_letter and has_number


def valid_phone(phone):
    return bool(re.fullmatch(r"\+?[0-9]{7,15}", phone))


def seed_admin():
    """Create a default admin user if one doesn't exist"""
    admin_exists = User.query.filter_by(is_admin=1).first()
    if not admin_exists:
        admin = User(
            username="admin",
            email="admin@roomify.com",
            password=generate_password_hash("admin123"),
            phone="+1234567890",
            is_admin=1
        )
        db.session.add(admin)
        db.session.commit()
        print("Admin user created: admin@roomify.com / admin123")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/signin", methods=["GET", "POST"])
def signin():
    if request.method == "GET":
        return render_template("signin.html")

    username = request.form.get("username")
    password = request.form.get("password")

    if username == "" or password == "":
        message = "Please fill all fields"
        return render_template("signin.html", error_message=message)

    # Assuming login_user sets session correctly, need to ensure is_admin is there
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        logout_user()
        session.clear()
        login_user(user)
        session["user_id"] = user.id
        session["username"] = user.username
        session["is_admin"] = user.is_admin

        # Redirect to the URL directly for standard synchronous form submission
        redirect_url = "/admin-dashboard" if int(user.is_admin) == 1 else "/user-dashboard"
        return redirect(redirect_url)

    message = "Invalid username or password"
    return render_template("signin.html", error_message=message)


@app.route("/signup", methods=["GET", "POST"])
def signup():
    error_message = None

    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        phone = request.form.get("phone")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if username == "" or email == "" or phone == "" or password == "" or confirm_password == "":
            error_message = "Please fill all fields"
        elif password != confirm_password:
            error_message = "Passwords do not match"
        elif not valid_email(email):
            error_message = "Email must end with @gmail.com or @usal.edu.lb"
        elif not valid_password(password):
            error_message = "Password must be more than 7 characters and contain letters and numbers"
        elif User.query.filter_by(email=email).first():
            error_message = "This email already has an account"
        elif not valid_phone(phone):
            error_message = "Please enter a valid phone number"
        else:
            # All validations passed, create user
            new_user = User(username=username, email=email,
                            phone=phone, password=generate_password_hash(password))
            db.session.add(new_user)
            db.session.commit()
            session["user_id"] = new_user.id
            session["username"] = new_user.username
            return redirect("/user-dashboard")

    return render_template("signup.html", error_message=error_message)


@login_required
@app.route("/profile")
def profile():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/signin")

    user = User.query.get(user_id)

    if not user:
        session.clear()
        return redirect("/signin")

    return render_template(
        "profile.html",
        user=user,
        active_page='profile'
    )

@login_required
@app.route("/user-dashboard")
def user_dashboard():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/signin")

    user = User.query.get(user_id)

    if not user:
        session.clear()
        return redirect("/signin")

    if int(user.is_admin) == 1:
        return redirect("/admin-dashboard")

    rooms = Room.query.filter_by(user_id=user.id).all()

    return render_template(
        "user_dashboard.html",
        user=user,
        rooms=rooms,
        active_page='user_dashboard'
    )

@login_required
@app.route("/new-room/<room_type>")
def new_room(room_type):
    if "user_id" not in session:
        return redirect("/signin")

    room_title = room_type.replace("-", " ").title()
    
    return render_template(
        "create_room.html",
        room_id=0,
        room_name=room_type,
        room_title=room_title,
        is_admin=session.get("is_admin")
    )

@login_required
@app.route("/edit-room/<int:room_id>")
def edit_room(room_id):
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/signin")

    room = Room.query.filter_by(id=room_id, user_id=user_id).first_or_404()

    return render_template(
        "create_room.html",
        room_id=room.id,
        room_name=room.room_name,
        room_title=room.room_title,
        is_admin=session.get("is_admin")
    )

@login_required
@app.route("/room-complete/<int:room_id>")
def room_complete(room_id):
    if "user_id" not in session:
        return redirect("/signin")

    room = Room.query.filter_by(id=room_id, user_id=session["user_id"]).first_or_404()

    return render_template(
        "room_complete.html",
        room_title=room.room_title,
        room_name=room.room_name,
        room_data=room.room_data or "[]"
    )

@login_required
@app.route("/save-room-data", methods=["POST"])
def save_room_data():
    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please sign in first"
        })

    data = request.get_json()

    room_id = data.get("room_id")
    room_data = data.get("room_data")
    room_title = data.get("room_title")

    if room_id == 0:
        # Create new room
        room_name = data.get("room_name", "bedroom")
        room = Room(
            room_name=room_name,
            room_title=room_title or room_name.replace("-", " ").title(),
            room_data=json.dumps(room_data),
            user_id=session["user_id"]
        )
        db.session.add(room)
    else:
        room = Room.query.filter_by(
            id=room_id,
            user_id=session["user_id"]
        ).first()

        if not room:
            return jsonify({
                "success": False,
                "message": "Room not found"
            })

        if room_title:
            room.room_title = room_title
        room.room_data = json.dumps(room_data)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Room saved successfully",
        "room_id": room.id
    })


@login_required
@app.route("/delete-room/<int:room_id>", methods=["POST"])
def delete_room(room_id):
    if "user_id" not in session:
        return redirect("/signin")

    room = Room.query.filter_by(
        id=room_id,
        user_id=session["user_id"]
    ).first_or_404()

    db.session.delete(room)
    db.session.commit()

    return redirect("/saved-rooms")


@login_required
@app.route("/saved-rooms")
def saved_rooms():
    if "user_id" not in session:
        return redirect("/signin")

    rooms = Room.query.filter_by(
        user_id=session["user_id"]
    ).all()

    return render_template(
        "saved_rooms.html",
        rooms=rooms,
        active_page='saved_rooms'
    )

@login_required
@app.route("/get-room-data/<int:room_id>")
def get_room_data(room_id):
    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please sign in first"
        })

    room = Room.query.filter_by(
        id=room_id,
        user_id=session["user_id"]
    ).first()

    if not room:
        return jsonify({
            "success": False,
            "message": "Room not found"
        })

    return jsonify({
        "success": True,
        "room_data": json.loads(room.room_data or "[]")
    })

@login_required
@app.route("/admin-view-user-rooms/<int:user_id>")
def admin_view_user_rooms(user_id):
    user_id_session = session.get("user_id")
    if not user_id_session:
        return jsonify({"success": False, "message": "Please sign in first"}), 401

    admin = User.query.get(user_id_session)
    if not admin or admin.is_admin != 1:
        return jsonify({"success": False, "message": "Access denied"}), 403

    user = User.query.get_or_404(user_id)
    rooms = Room.query.filter_by(user_id=user.id).all()

    if not rooms:
        return jsonify({
            "success": False,
            "message": f"User {user.username} has no saved rooms yet."
        })

    # If rooms exist, we can either return JSON or render a template.
    # The user asked to "view", so maybe a redirect to a view or return data.
    # Let's return JSON for now to handle the "no rooms" toast logic easily.
    rooms_data = [{
        "id": room.id,
        "room_name": room.room_name,
        "room_title": room.room_title
    } for room in rooms]

    return jsonify({
        "success": True,
        "rooms": rooms_data
    })

@login_required
@app.route("/admin-dashboard")
def admin_dashboard():
    user_id = session.get("user_id")
    admin = User.query.get(user_id) if user_id else None

    if not admin:
        session.clear()
        return redirect("/signin")

    if int(admin.is_admin) != 1:
        return redirect("/user-dashboard")

    users = User.query.filter(User.is_admin != 1).all()

    return render_template(
        "admin_dashboard.html",
        username=admin.username,
        users=users,
        active_page='admin_dashboard'
    )

@login_required
@app.route("/admin-users")
def admin_users():
    user_id = session.get("user_id")
    admin = User.query.get(user_id) if user_id else None

    if not admin or admin.is_admin != 1:
        return redirect("/signin")

    users = User.query.filter(User.is_admin != 1).all()

    return render_template(
        "admin_dashboard.html",
        username=admin.username,
        users=users,
        active_page='admin_dashboard'
    )

@login_required
@app.route("/admin-contact-messages")
def admin_contact_messages():
    user_id = session.get("user_id")
    admin = User.query.get(user_id) if user_id else None

    if not admin or admin.is_admin != 1:
        return redirect("/signin")

    messages = ContactUs.query.order_by(ContactUs.created_at.desc()).all()
    total_messages = len(messages)
    read_messages = len([m for m in messages if m.is_read == 1])
    unread_messages = len([m for m in messages if m.is_read == 0])

    return render_template(
        "admin_contact_messages.html",
        username=admin.username,
        messages=messages,
        total_messages=total_messages,
        read_messages=read_messages,
        unread_messages=unread_messages,
        current_page=1,
        messages_per_page=10,
        active_page='admin_contact_messages'
    )

@login_required
@app.route("/admin-mark-message-read/<int:message_id>", methods=["POST"])
def admin_mark_message_read(message_id):
    if "user_id" not in session:
        return jsonify({"success": False}), 401

    admin = User.query.get(session["user_id"])

    if not admin or admin.is_admin != 1:
        return jsonify({"success": False}), 401

    message = ContactUs.query.get(message_id)

    if message:
        message.is_read = 1
        db.session.commit()
        return jsonify({"success": True})

    return jsonify({"success": False}), 404

@login_required
@app.route("/admin-delete-message/<int:message_id>", methods=["POST"])
def admin_delete_message(message_id):
    if "user_id" not in session:
        return redirect("/signin")

    admin = User.query.get(session["user_id"])

    if not admin or admin.is_admin != 1:
        return redirect("/signin")

    message = ContactUs.query.get(message_id)

    if message:
        db.session.delete(message)
        db.session.commit()

    return redirect("/admin-contact-messages")

@login_required
@app.route("/delete-user/<int:user_id>", methods=["POST"])
def delete_user(user_id):
    if "user_id" not in session:
        return redirect("/signin")

    admin = User.query.get(session["user_id"])

    if not admin:
        session.clear()
        return redirect("/signin")

    if admin.is_admin != 1:
        return redirect("/user-dashboard")

    user = User.query.get_or_404(user_id)

    if user.is_admin == 1:
        return redirect("/admin-dashboard")

    db.session.delete(user)
    db.session.commit()

    return redirect("/admin-dashboard")

@login_required
@app.route("/update-profile", methods=["POST"])
def update_profile():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Please sign in first"})

    user = User.query.get(session["user_id"])

    if not user:
        session.clear()
        return jsonify({"success": False, "message": "User not found"})

    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")

    if username == "" or email == "" or password == "":
        return jsonify({"success": False, "message": "Please fill all fields"})

    if not valid_email(email):
        return jsonify({
            "success": False,
            "message": "Email must end with @gmail.com or @usal.edu.lb"
        })

    if not valid_password(password):
        return jsonify({
            "success": False,
            "message": "Password must be more than 7 characters and contain letters and numbers"
        })

    existing_user = User.query.filter(
        User.email == email,
        User.id != user.id
    ).first()

    if existing_user:
        return jsonify({"success": False, "message": "This email already has an account"})

    user.username = username
    user.email = email
    user.password = password

    db.session.commit()

    session["username"] = username

    return jsonify({
        "success": True,
        "message": "Profile updated successfully"
    })


@login_required
@app.route("/logout")
def logout():
    logout_user()
    session.clear()
    return redirect("/")


@app.route("/contact")
def contact():
    return render_template("contact.html", success_message=None, error_message=None)


@app.route("/submit-contact", methods=["POST"])
def submit_contact():
    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")

    if not name or not email or not message:
        error_message = "Please fill all fields"
        return render_template("contact.html", error_message=error_message, success_message=None)

    if not valid_email(email):
        error_message = "Email must end with @gmail.com or @usal.edu.lb"
        return render_template("contact.html", error_message=error_message, success_message=None)

    contact_us = ContactUs(name=name, email=email, message=message)
    db.session.add(contact_us)
    db.session.commit()

    success_message = "Thanks! Your message is sent. Redirecting to home..."
    return render_template("contact.html", success_message=success_message, error_message=None)


with app.app_context():
    db.create_all()
    seed_admin()


if __name__ == "__main__":
    app.run(debug=True)
