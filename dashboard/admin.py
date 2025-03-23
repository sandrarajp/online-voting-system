from django.contrib import admin
from dashboard.models import User, Ballot, Question, Option, Voter, Participation

# Register your models here.
admin.site.register(User)
admin.site.register(Ballot)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(Voter)
admin.site.register(Participation)