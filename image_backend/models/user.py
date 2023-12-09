from mongoengine import Document, StringField, DateTimeField, IntField, ListField
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User(Document):
    username = StringField(required=True, max_length=50)
    email = StringField(required=True, max_length=50)
    fname = StringField(required=True, max_length=50)
    lname = StringField(required=True, max_length=50)
    affiliation = StringField(required=True, max_length=50)
    password = StringField(required=True)
    created_at = DateTimeField()
    updated_at = DateTimeField()
    number_of_projects = IntField(default=0)
    project_names = ListField(StringField(max_length=50))
    reset_token = StringField()
    meta = {'collection': 'users'}

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Function to check the hashed password
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


    # "fname": "Akash",
    # "lname": "Singh",
    # "email": "akash.singh@gmail.com",
    # "username": "akash",
    # "affiliation": "IIT Bomabay",
    # "password": "Akash@11"