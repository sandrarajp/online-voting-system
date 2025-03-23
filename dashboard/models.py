import email
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email,  firstname, lastname, password):
        if not email:
            return ValueError("User must have a valid email address")
        if not firstname:
            return ValueError("User must have a firstname")
        if not lastname:
            return ValueError("User must have a lastname")
        if not password:
            return ValueError("User must have a password")

        user = self.model(email=self.normalize_email(email), firstname=firstname, password=password)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, firstname, lastname, password):
        if not email:
            return ValueError("User must have a valid email address")
        if not firstname:
            return ValueError("User must have a firstname")
        if not lastname:
            return ValueError("User must have a lastname")
        if not password:
            return ValueError("User must have a password")

        user = self.create_user(email, firstname, lastname, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    lastname = models.CharField(max_length=50)
    firstname = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["firstname", "lastname"]

    def __str__(self):
        return self.email

from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.utils import timezone

class Ballot(models.Model):
    STATUS_CHOICES = (
        ("building", "building"),
        ("running", "running"),
        ("completed", "completed")
    )

    title = models.CharField(max_length=100)
    status = models.CharField(max_length=30, default="building", choices=STATUS_CHOICES)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)    

    def __str__(self):
        return self.title

class Question(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    ballot = models.ForeignKey(Ballot, on_delete=models.CASCADE, related_name="questions")
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Option(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to="images/", default="images/default-option-img.png")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    number_of_votes = models.IntegerField(default=0)

    def __str__(self):
        return self.title

import random

class Voter(models.Model):
    def create_new_voter_id():
        not_unique = True
        while not_unique:
            unique_ref = random.randint(1000000000, 9999999999)
            if not Voter.objects.filter(voter_id=unique_ref):
                not_unique = False
        return str(unique_ref)

    fullname = models.CharField(max_length=100)
    email = models.EmailField()
    ballot = models.ForeignKey(Ballot, on_delete=models.CASCADE)
    voter_id = models.CharField(
        max_length = 10,
        blank=False,
        editable=False,
        unique=True,
        default=create_new_voter_id
    )
    has_voted = models.BooleanField(default=False)

    def __str__(self):
        return self.voter_id

class Participation(models.Model):
    voter = models.ForeignKey(Voter, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE)
    ballot = models.ForeignKey(Ballot, null=True, on_delete=models.CASCADE)
