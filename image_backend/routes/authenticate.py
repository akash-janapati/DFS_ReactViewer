# from flask import Blueprint, jsonify, request, current_app
# # from models.user import User
# from datetime import datetime, timedelta
# from flask_mail import Message
# from utilities.minio_utilities import create_bucket
# import jwt
# from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity



# auth_routes = Blueprint('auth', __name__)
# # mail = current_app.mail

# @auth_routes.route('/register', methods=['POST'])
# def register_user():
#     data = request.json

#     # Check if all required fields are provided
#     if 'username' not in data or 'email' not in data or 'password' not in data or 'fname' not in data or 'lname' not in data or 'affiliation' not in data:
#         return jsonify({'message': 'Incomplete data. Please provide all required fields.'}), 400



#     # Check if the username already exists
#     existing_user = User.objects(username=data['username']).first()
#     if existing_user:
#         return jsonify({'message': 'Username already exists. Please choose a different username.'}), 400
    

#     # Check if the email is already registered
#     existing_email = User.objects(email=data['email']).first()
#     if existing_email:
#         return jsonify({'message': 'Email is already registered. Please use a different email.'}), 400

#     new_user = User(
#         username=data['username'],
#         email=data['email'],
#         fname=data['fname'],
#         lname=data['lname'],
#         affiliation=data['affiliation'],
#         created_at=datetime.utcnow()
#     )

#     new_user.set_password(data['password'])  # Hash the password
#     new_user.save()

#     # Create a bucket for the user
#     bucket_name = data['username']
#     status, message = create_bucket(bucket_name)
#     if status == -1:
#         return jsonify({'message': message}), 400
    
    
#     return jsonify({'message': 'User registered successfully'}), 200

# @auth_routes.route('/login', methods=['POST'])
# def login_user():
#     data = request.json
#     data = request.json
#     username = data.get('username')
#     email = data.get('email')
#     password = data.get('password')

#     user = User.objects(username=username).first() if username else User.objects(email=email).first()

#     if not user:
#         return jsonify({'message': 'User does not exist'}), 400

#     if user and user.check_password(password):
#         # Generate a JWT token
#         jwt_token = create_access_token(identity=str(username), expires_delta=timedelta(days=10))
#         return jsonify({'message': 'Login successful', 'token': jwt_token}), 200
#     else:
#         return jsonify({'message': 'Invalid credentials'}), 400

    
# # from flask import jsonify, request
# # import secrets

# # Assuming the User model is imported

# # @auth_routes.route('/forgot_password', methods=['POST'])
# # def forgot_password():
# #     email = request.json.get('email')

# #     user = User.objects(email=email).first()
# #     if user:
# #         # Generate a password reset token
# #         reset_token = secrets.token_urlsafe(20)
# #         user.reset_token = reset_token
# #         user.save()

# #         # Send email with a link containing the token for password reset
# #         # This step involves sending an email to the user's email address with a link that includes the reset_token
# #         # For demonstration purposes, we're using a simple message here
# #         email_content = f"Click on this link to reset your password: example.com/reset_password?token={reset_token}"

# #         # send email
# #         msg = Message('Password Reset Request',sender="sai.janapati@students.iiit.ac.in", recipients=[email])
# #         msg.body = email_content
# #         mail.send(msg)

# #         return jsonify({'message': 'Password reset link sent to your email'}), 200
# #     else:
# #         return jsonify({'message': 'No user found with that email'}), 400


# # @auth_routes.route('/reset_password', methods=['POST'])
# # def reset_password():
# #     reset_token = request.json.get('token')
# #     new_password = request.json.get('new_password')

# #     user = User.objects(reset_token=reset_token).first()
# #     if user:
# #         user.set_password(new_password)  # Set the new password
# #         user.reset_token = None  # Clear the reset token after password reset
# #         user.save()
# #         return jsonify({'message': 'Password reset successfully'}), 200
# #     else:
# #         return jsonify({'message': 'Invalid or expired token for password reset'}), 400
