from flask import Flask, render_template, request, redirect, url_for, session, flash
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from datetime import datetime
import os

app = Flask(__name__)

app.secret_key = "localfix-secret-key"

# --------------------------------
# MONGODB CONNECTION
# --------------------------------

MONGO_URI = "mongodb+srv://souravsharma7718_db_user:Dy2Z9ZJzYtkwWECR@cluster0.ljpb4nn.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URI)

db = client["local_service"]

users = db["users"]
providers = db["providers"]
bookings = db["bookings"]

# --------------------------------
# SAMPLE SERVICE PROVIDERS
# --------------------------------

def add_sample_providers():

    if providers.count_documents({}) == 0:

        sample_providers = [

            {
                "name": "Rahul Electronics",
                "service": "Computer Repair",
                "location": "Jalpaiguri",
                "price": 300,
                "rating": 4.8,
                "phone": "9876543210",
                "description": "Laptop, desktop and software repair services."
            },

            {
                "name": "Amit Plumbing Services",
                "service": "Plumber",
                "location": "Jalpaiguri",
                "price": 250,
                "rating": 4.6,
                "phone": "9876543211",
                "description": "Home plumbing, pipe repair and installation."
            },

            {
                "name": "Priya Study Point",
                "service": "Tutor",
                "location": "Jalpaiguri",
                "price": 400,
                "rating": 4.9,
                "phone": "9876543212",
                "description": "Personal tutoring for school students."
            },

            {
                "name": "Raj Auto Care",
                "service": "Mechanic",
                "location": "Jalpaiguri",
                "price": 350,
                "rating": 4.7,
                "phone": "9876543213",
                "description": "Two-wheeler and car servicing and repairs."
            },

            {
                "name": "SparkPro Electric",
                "service": "Electrician",
                "location": "Jalpaiguri",
                "price": 300,
                "rating": 4.8,
                "phone": "9876543214",
                "description": "Home electrical repair and installation."
            },

            {
                "name": "CleanNest Services",
                "service": "Cleaner",
                "location": "Jalpaiguri",
                "price": 500,
                "rating": 4.5,
                "phone": "9876543215",
                "description": "Professional home and office cleaning."
            }

        ]

        providers.insert_many(sample_providers)


add_sample_providers()

# --------------------------------
# HOME
# --------------------------------

@app.route("/")
def home():

    return render_template("index.html")

# --------------------------------
# REGISTER
# --------------------------------

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        name = request.form["name"]
        email = request.form["email"].lower()
        password = request.form["password"]

        existing_user = users.find_one({
            "email": email
        })

        if existing_user:

            flash(
                "An account with this email already exists.",
                "error"
            )

            return redirect(url_for("register"))

        hashed_password = generate_password_hash(password)

        users.insert_one({

            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "user"

        })

        flash(
            "Account created successfully!",
            "success"
        )

        return redirect(url_for("login"))

    return render_template("register.html")

# --------------------------------
# LOGIN
# --------------------------------

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"].lower()
        password = request.form["password"]

        user = users.find_one({
            "email": email
        })

        if user and check_password_hash(
            user["password"],
            password
        ):

            session["user_id"] = str(user["_id"])

            session["user_name"] = user["name"]

            session["role"] = user.get(
                "role",
                "user"
            )

            return redirect(
                url_for("providers_page")
            )

        flash(
            "Invalid email or password.",
            "error"
        )

    return render_template("login.html")


# --------------------------------
# LOGOUT
# --------------------------------

@app.route("/logout")
def logout():

    session.clear()

    return redirect(
        url_for("home")
    )

# --------------------------------
# PROVIDERS
# --------------------------------

@app.route("/providers")
def providers_page():

    if "user_id" not in session:

        return redirect(
            url_for("login")
        )

    search = request.args.get(
        "search",
        ""
    )

    category = request.args.get(
        "category",
        ""
    )

    query = {}

    # Search
    if search:

        query["$or"] = [

            {
                "name": {
                    "$regex": search,
                    "$options": "i"
                }
            },

            {
                "service": {
                    "$regex": search,
                    "$options": "i"
                }
            },

            {
                "location": {
                    "$regex": search,
                    "$options": "i"
                }
            }

        ]

    # Category filter
    if category:

        query["service"] = category

    provider_list = list(
        providers.find(query)
    )

    return render_template(
        "providers.html",
        providers=provider_list,
        search=search,
        category=category
    )


# --------------------------------
# PROVIDER PROFILE
# --------------------------------

@app.route("/provider/<provider_id>")
def provider(provider_id):

    if "user_id" not in session:

        return redirect(
            url_for("login")
        )

    provider_data = providers.find_one({
        "_id": ObjectId(provider_id)
    })

    if not provider_data:

        flash(
            "Provider not found.",
            "error"
        )

        return redirect(
            url_for("providers_page")
        )

    return render_template(
        "provider.html",
        provider=provider_data
    )


# --------------------------------
# BOOK SERVICE
# --------------------------------

@app.route(
    "/book/<provider_id>",
    methods=["GET", "POST"]
)
def book(provider_id):

    if "user_id" not in session:

        return redirect(
            url_for("login")
        )

    provider_data = providers.find_one({
        "_id": ObjectId(provider_id)
    })

    if not provider_data:

        flash(
            "Provider not found.",
            "error"
        )

        return redirect(
            url_for("providers_page")
        )

    if request.method == "POST":

        booking = {

            "user_id": session["user_id"],

            "user_name": session["user_name"],

            "provider_id": str(
                provider_data["_id"]
            ),

            "provider_name":
                provider_data["name"],

            "service":
                provider_data["service"],

            "date":
                request.form["date"],

            "time":
                request.form["time"],

            "address":
                request.form["address"],

            "note":
                request.form["note"],

            "status":
                "Pending",

            "created_at":
                datetime.now()

        }

        bookings.insert_one(
            booking
        )

        flash(
            "Booking request sent successfully!",
            "success"
        )

        return redirect(
            url_for("my_bookings")
        )

    return render_template(
        "book.html",
        provider=provider_data
    )


# --------------------------------
# MY BOOKINGS
# --------------------------------

@app.route("/bookings")
def my_bookings():

    if "user_id" not in session:

        return redirect(
            url_for("login")
        )

    user_bookings = list(

        bookings.find({

            "user_id":
                session["user_id"]

        }).sort(
            "created_at",
            -1
        )

    )

    return render_template(
        "bookings.html",
        bookings=user_bookings
    )


# =================================
# ADMIN
# =================================


# --------------------------------
# ADMIN LOGIN
# --------------------------------

@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():

    if request.method == "POST":

        username = request.form["username"]

        password = request.form["password"]

        if (
            username == "admin"
            and password == "admin123"
        ):

            session.clear()

            session["role"] = "admin"

            session["user_name"] = "Administrator"

            return redirect(
                url_for("admin_dashboard")
            )

        flash(
            "Invalid admin credentials.",
            "error"
        )

    return render_template(
        "admin/login.html"
    )
# --------------------------------
# ADMIN DASHBOARD
# --------------------------------

@app.route("/admin")
def admin_dashboard():

    if session.get("role") != "admin":

        return redirect(
            url_for("admin_login")
        )

    provider_list = list(
        providers.find()
    )

    booking_list = list(

        bookings.find().sort(
            "created_at",
            -1
        )

    )

    return render_template(

        "admin/dashboard.html",

        providers=provider_list,

        bookings=booking_list

    )


# --------------------------------
# ADD PROVIDER
# --------------------------------

@app.route(
    "/admin/add-provider",
    methods=["POST"]
)
def add_provider():

    if session.get("role") != "admin":

        return redirect(
            url_for("admin_login")
        )

    provider = {

        "name":
            request.form["name"],

        "service":
            request.form["service"],

        "location":
            request.form["location"],

        "price":
            int(request.form["price"]),

        "rating":
            5.0,

        "phone":
            request.form["phone"],

        "description":
            request.form["description"]

    }
    providers.insert_one(
        provider
    )
    flash(
        "Provider added successfully!",
        "success"
    )

    return redirect(
        url_for("admin_dashboard")
    )


# --------------------------------
# DELETE PROVIDER
# --------------------------------

@app.route(
    "/admin/delete-provider/<provider_id>"
)
def delete_provider(provider_id):

    if session.get("role") != "admin":

        return redirect(
            url_for("admin_login")
        )

    providers.delete_one({

        "_id":
            ObjectId(provider_id)

    })

    return redirect(
        url_for("admin_dashboard")
    )


# --------------------------------
# CHANGE BOOKING STATUS
# --------------------------------

@app.route(
    "/admin/booking/<booking_id>/<status>"
)
def change_booking_status(
    booking_id,
    status
):

    if session.get("role") != "admin":

        return redirect(
            url_for("admin_login")
        )

    allowed_statuses = [

        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled"

    ]

    if status not in allowed_statuses:

        return redirect(
            url_for("admin_dashboard")
        )

    bookings.update_one(

        {
            "_id":
                ObjectId(booking_id)
        },

        {
            "$set":
                {
                    "status":
                        status
                }
        }

    )

    return redirect(
        url_for("admin_dashboard")
    )

# --------------------------------
# RUN APPLICATION
# --------------------------------

if __name__ == "__main__":

    app.run(
        debug=True
    )
