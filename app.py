import json
from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    session,
    redirect,
    url_for,
    flash,
)
from flask_sqlalchemy import SQLAlchemy
from flask_login import (
    LoginManager,
    UserMixin,
    login_required,
    login_user,
    logout_user,
    current_user,
)
from werkzeug.security import generate_password_hash, check_password_hash
from utils import valid_email, valid_password, valid_phone
from datetime import datetime

app = Flask(__name__)
app.secret_key = "sns-roomify-secret-key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///roomify.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy()
login_manager = LoginManager()


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
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)
    is_read = db.Column(db.Integer, default=0, nullable=False)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = "signin"


def seed_admin():
    """Create a default admin user if one doesn't exist"""
    admin_exists = User.query.filter_by(is_admin=1).first()
    if not admin_exists:
        admin = User(
            username="admin",
            email="admin@roomify.com",
            password=generate_password_hash("admin123"),
            phone="+1234567890",
            is_admin=1,
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

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        login_user(user)
        session["user_id"] = user.id
        session["username"] = user.username
        session["is_admin"] = user.is_admin

        redirect_url = (
            "/admin-dashboard" if int(user.is_admin) == 1 else "/user-dashboard"
        )
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

        if (
            username == ""
            or email == ""
            or phone == ""
            or password == ""
            or confirm_password == ""
        ):
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
            new_user = User(
                username=username,
                email=email,
                phone=phone,
                password=generate_password_hash(password),
            )
            db.session.add(new_user)
            db.session.commit()
            session["user_id"] = new_user.id
            session["username"] = new_user.username
            return redirect("/user-dashboard")

    return render_template("signup.html", error_message=error_message)


@app.route("/profile")
@login_required
def profile():
    return render_template("profile.html", user=current_user, active_page="profile")


@app.route("/user-dashboard")
@login_required
def user_dashboard():
    return render_template(
        "user_dashboard.html", user=current_user, active_page="user_dashboard"
    )


@app.route("/new-room/<room_type>")
@login_required
def new_room(room_type):
    room_title = room_type.replace("-", " ").title()

    return render_template(
        "create_room.html", room_id=0, room_name=room_type, room_title=room_title
    )


@app.route("/edit-room/<int:room_id>")
@login_required
def edit_room(room_id):
    room = Room.query.filter_by(
        id=room_id, user_id=current_user.id).first_or_404()

    return render_template(
        "create_room.html",
        room_id=room.id,
        room_name=room.room_name,
        room_title=room.room_title,
    )


@app.route("/room-complete/<int:room_id>")
@login_required
def room_complete(room_id):
    room = Room.query.filter_by(
        id=room_id, user_id=current_user.id).first_or_404()

    return render_template(
        "room_complete.html",
        room_title=room.room_title,
        room_name=room.room_name,
        room_data=room.room_data or "[]",
    )


@app.route("/save-room-data", methods=["POST"])
@login_required
def save_room_data():
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
            user_id=current_user.id,
        )
        db.session.add(room)
    else:
        room = Room.query.filter_by(
            id=room_id, user_id=current_user.id).first()

        if not room:
            return jsonify({"success": False, "message": "Room not found"})

        if room_title:
            room.room_title = room_title
        room.room_data = json.dumps(room_data)

    db.session.commit()

    return jsonify(
        {"success": True, "message": "Room saved successfully", "room_id": room.id}
    )


@app.route("/delete-room/<int:room_id>", methods=["POST"])
@login_required
def delete_room(room_id):
    room = Room.query.filter_by(
        id=room_id, user_id=current_user.id).first_or_404()

    room_title = room.room_title
    db.session.delete(room)
    db.session.commit()
    flash(f"Room '{room_title}' deleted successfully", "success")

    return redirect(url_for("saved_rooms"))


@app.route("/saved-rooms")
@login_required
def saved_rooms():
    rooms = Room.query.filter_by(user_id=current_user.id).all()

    return render_template(
        "saved_rooms.html", user=current_user, rooms=rooms, active_page="saved_rooms"
    )


@app.route("/get-room-data/<int:room_id>")
@login_required
def get_room_data(room_id):
    room = Room.query.filter_by(id=room_id, user_id=current_user.id).first()

    if not room:
        return jsonify({"success": False, "message": "Room not found"})

    return jsonify({"success": True, "room_data": json.loads(room.room_data or "[]")})


@app.route("/admin-dashboard")
@app.route("/admin-users")
@login_required
def admin_dashboard():
    if int(current_user.is_admin) != 1:
        flash("Access denied", "error")
        return redirect(url_for("user_dashboard"))

    users = User.query.filter(User.is_admin != 1).all()

    return render_template(
        "admin_dashboard.html",
        user=current_user,
        users=users,
        active_page="admin_users",
    )


@app.route("/admin-user-rooms/<int:user_id>")
@login_required
def admin_user_rooms(user_id):
    if int(current_user.is_admin) != 1:
        flash("Access denied", "error")
        return redirect(url_for("user_dashboard"))

    user = User.query.get_or_404(user_id)
    rooms = Room.query.filter_by(user_id=user_id).all()

    return render_template(
        "admin_user_rooms.html",
        user=current_user,
        target_user=user,
        rooms=rooms,
        active_page="admin_users",
    )


@app.route("/admin-view-room/<int:room_id>")
@login_required
def admin_view_room(room_id):
    if int(current_user.is_admin) != 1:
        flash("Access denied", "error")
        return redirect(url_for("user_dashboard"))

    room = Room.query.get_or_404(room_id)

    return render_template(
        "admin_view_room.html",
        room_id=room.id,
        room_name=room.room_name,
        room_title=room.room_title,
        user_id=room.user_id,
    )


@app.route("/get-room-data-admin/<int:room_id>")
@login_required
def get_room_data_admin(room_id):
    if int(current_user.is_admin) != 1:
        return jsonify({"success": False, "message": "Access denied"})

    room = Room.query.get(room_id)

    if not room:
        return jsonify({"success": False, "message": "Room not found"})

    return jsonify({"success": True, "room_data": json.loads(room.room_data or "[]")})


@app.route("/admin-contact-messages")
@login_required
def admin_contact_messages():

    messages = ContactUs.query.order_by(ContactUs.created_at.desc()).all()
    total_messages = len(messages)
    read_messages = len([m for m in messages if m.is_read == 1])
    unread_messages = len([m for m in messages if m.is_read == 0])

    return render_template(
        "admin_contact_messages.html",
        user=current_user,
        messages=messages,
        total_messages=total_messages,
        read_messages=read_messages,
        unread_messages=unread_messages,
        current_page=1,
        messages_per_page=10,
        active_page="admin_contact_messages",
    )


@app.route("/admin-mark-message-read/<int:message_id>", methods=["POST"])
@login_required
def admin_mark_message_read(message_id):
    if int(current_user.is_admin) != 1:
        flash("Access denied", "error")
        return redirect(url_for("admin_dashboard"))

    message = ContactUs.query.get(message_id)
    if message:
        message.is_read = 1
        db.session.commit()
        flash("Message marked as read", "success")
        return redirect(url_for("admin_contact_messages"))

    flash("Message not found", "error")
    return redirect(url_for("admin_contact_messages"))


@app.route("/admin-delete-message/<int:message_id>", methods=["POST"])
@login_required
def admin_delete_message(message_id):
    if int(current_user.is_admin) != 1:
        flash("Access denied", "error")
        return redirect(url_for("user_dashboard"))

    message = ContactUs.query.get(message_id)
    if message:
        db.session.delete(message)
        db.session.commit()
        flash("Message deleted successfully", "success")

    return redirect(url_for("admin_contact_messages"))


@app.route("/delete-user/<int:user_id>", methods=["POST"])
@login_required
def delete_user(user_id):
    if int(current_user.is_admin) != 1:
        flash("Access denied", "error")
        return redirect(url_for("user_dashboard"))

    user = User.query.get_or_404(user_id)
    username = user.username
    db.session.delete(user)
    db.session.commit()
    flash(f"User {username} deleted successfully", "success")

    return redirect(url_for("admin_dashboard"))


@app.route("/update-profile", methods=["POST"])
@login_required
def update_profile():
    user = User.query.get(current_user.id)

    username = request.form.get("username")
    email = request.form.get("email")
    phone = request.form.get("phone")

    if username == "" or email == "" or phone == "":
        flash("Please fill all fields", "error")
        return redirect(url_for("profile"))

    if not valid_email(email):
        flash("Email must end with @gmail.com or @usal.edu.lb", "error")
        return redirect(url_for("profile"))

    if not valid_phone(phone):
        flash("Please enter a valid phone number", "error")
        return redirect(url_for("profile"))

    existing_user = User.query.filter(
        User.email == email, User.id != user.id).first()

    if existing_user:
        flash("This email already has an account", "error")
        return redirect(url_for("profile"))

    user.username = username
    user.email = email
    user.phone = phone

    db.session.add(user)
    db.session.commit()

    session["username"] = username
    flash("Profile updated successfully", "success")
    return redirect(url_for("profile"))


@app.route("/reset-password", methods=["POST"])
@login_required
def reset_password():
    user = User.query.get(current_user.id)

    new_password = request.form.get("new_password")
    confirm_password = request.form.get("confirm_password")

    if not new_password or not confirm_password:
        flash("Please fill all password fields", "error")
        return redirect(url_for("profile"))

    if new_password != confirm_password:
        flash("Passwords do not match", "error")
        return redirect(url_for("profile"))

    if not valid_password(new_password):
        flash(
            "Password must be more than 7 characters and contain letters and numbers",
            "error",
        )
        return redirect(url_for("profile"))

    user.password = generate_password_hash(new_password)
    db.session.commit()

    flash("Password reset successfully", "success")
    return redirect(url_for("profile"))


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/submit-contact", methods=["POST"])
def submit_contact():
    name = request.form.get("name")
    email = request.form.get("email")
    subject = request.form.get("subject")
    message = request.form.get("message")

    if not name or not email or not subject or not message:
        flash("Please fill all fields", "error")
        return redirect(url_for("contact"))

    if not valid_email(email):
        flash("Email must end with @gmail.com or @usal.edu.lb", "error")
        return redirect(url_for("contact"))

    contact_us = ContactUs(name=name, email=email,
                           subject=subject, message=message)
    db.session.add(contact_us)
    db.session.commit()

    flash("Thanks! Your message is sent.", "success")
    return redirect(url_for("contact"))


@app.route("/logout")
@login_required
def logout():
    logout_user()
    session.clear()
    return redirect(url_for("home"))


with app.app_context():
    db.create_all()
    seed_admin()


if __name__ == "__main__":
    app.run(debug=True)
