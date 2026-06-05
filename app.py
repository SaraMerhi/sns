import re
import json
from flask import Flask, render_template, request, jsonify, session, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.secret_key = "sns-roomify-secret-key"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///roomify.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class User(db.Model):
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
            username="Admin",
            email="admin@roomify.com",
            password="admin123",
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

    email = request.form.get("email")
    password = request.form.get("password")

    if email == "" or password == "":
        return jsonify({"success": False, "message": "Please fill all fields"})

    user = User.query.filter_by(email=email, password=password).first()

    if user:
        session["user_id"] = user.id
        session["username"] = user.username
        role = "Admin" if user.is_admin == 1 else "User"
        return jsonify({"success": True, "role": role})

    return jsonify({"success": False, "message": "Invalid email or password"})


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")

    username = request.form.get("username")
    email = request.form.get("email")
    phone = request.form.get("phone")
    password = request.form.get("password")
    confirm_password = request.form.get("confirm_password")

    if username == "" or email == "" or phone == "" or password == "" or confirm_password == "":
        return jsonify({"success": False, "message": "Please fill all fields"})

    if password != confirm_password:
        return jsonify({"success": False, "message": "Passwords do not match"})

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

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"success": False, "message": "This email already has an account"})

    if not valid_phone(phone):
        return jsonify({"success": False, "message": "Please enter a valid phone number"})

    new_user = User(username=username, email=email, phone=phone, password=password)

    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id
    session["username"] = new_user.username

    return jsonify({
        "success": True,
        "message": "Account created successfully",
        "role": "User"
    })


@app.route("/user-dashboard")
def user_dashboard():
    if "user_id" not in session:
        return redirect("/signin")

    user = User.query.get(session["user_id"])

    if not user:
        session.clear()
        return redirect("/signin")

    rooms = Room.query.filter_by(user_id=user.id).all()

    return render_template(
        "user_dashboard.html",
        username=user.username,
        email=user.email,
        password=user.password,
        rooms=rooms
    )


@app.route("/create-room/<room_name>")
def create_room(room_name):
    if "user_id" not in session:
        return redirect("/signin")

    room_title = room_name.replace("-", " ").title()

    return render_template(
        "create_room.html",
        room_name=room_name,
        room_title=room_title,
        room_data="[]"
    )


@app.route("/room-complete/<room_name>")
def room_complete(room_name):
    if "user_id" not in session:
        return redirect("/signin")

    room_title = room_name.replace("-", " ").title()

    room = Room.query.filter_by(
        room_name=room_name,
        user_id=session["user_id"]
    ).first()

    if not room:
        room = Room(
            room_name=room_name,
            room_title=room_title,
            room_data="[]",
            user_id=session["user_id"]
        )

        db.session.add(room)
        db.session.commit()

    return render_template(
        "room_complete.html",
        room_title=room.room_title,
        room_name=room.room_name,
        room_data=room.room_data or "[]"
    )


@app.route("/save-room-data", methods=["POST"])
def save_room_data():
    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please sign in first"
        })

    data = request.get_json()

    room_name = data.get("room_name")
    room_data = data.get("room_data")

    if not room_name:
        return jsonify({
            "success": False,
            "message": "Room name is missing"
        })

    room_title = room_name.replace("-", " ").title()

    room = Room.query.filter_by(
        room_name=room_name,
        user_id=session["user_id"]
    ).first()

    if not room:
        room = Room(
            room_name=room_name,
            room_title=room_title,
            user_id=session["user_id"]
        )
        db.session.add(room)

    room.room_data = json.dumps(room_data)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Room saved successfully"
    })


@app.route("/saved-rooms")
def saved_rooms():
    if "user_id" not in session:
        return redirect("/signin")

    rooms = Room.query.filter_by(
        user_id=session["user_id"]
    ).all()

    return render_template(
        "saved_rooms.html",
        rooms=rooms
    )
    
@app.route("/get-room-data/<room_name>")
def get_room_data(room_name):
    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please sign in first"
        })

    room = Room.query.filter_by(
        room_name=room_name,
        user_id=session["user_id"]
    ).first()

    if not room or not room.room_data:
        return jsonify({
            "success": True,
            "room_data": []
        })

    return jsonify({
        "success": True,
        "room_data": json.loads(room.room_data)
    })


@app.route("/admin-dashboard")
def admin_dashboard():
    if "user_id" not in session:
        return redirect("/signin")

    admin = User.query.get(session["user_id"])

    if not admin:
        session.clear()
        return redirect("/signin")

    if admin.is_admin != 1:
        return redirect("/user-dashboard")

    users = User.query.filter(User.is_admin != 1).all()

    return render_template(
        "admin_dashboard.html",
        username=admin.username,
        users=users
    )


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


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


with app.app_context():
    db.create_all()
    seed_admin()


if __name__ == "__main__":
    app.run(debug=True)