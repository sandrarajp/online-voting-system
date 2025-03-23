from dataclasses import fields
from rest_framework import serializers
from dashboard.models import Ballot, Question, Option, Voter
from django.utils import timezone


class BallotSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=100)

    class Meta:
        model = Ballot
        fields = ["id", "title", "status", "date_created"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"

class VoterSerializer(serializers.ModelSerializer):
    voter_id = serializers.CharField(read_only=True)
    has_voted = serializers.BooleanField(read_only=True)
    class Meta:
        model = Voter
        fields = ["id", "fullname", "email", "ballot", "voter_id", "has_voted"]

class OptionSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, default="images/default-option-img.png")
    class Meta:
        model = Option
        fields = ["id", "title", "image", "question", "number_of_votes"]

class QuestionOptionsSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()
    class Meta:
        model = Question
        fields = ["id", "title", "description", "date_created", "options"]
    def get_options(self, obj):
        options_queryset = Option.objects.filter(question=obj.id)
        serializer =  OptionSerializer(options_queryset, many=True)
        return serializer.data

class ViewBallotSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    voters = serializers.SerializerMethodField()
    class Meta:
        model = Ballot
        fields = ["id", "title", "status", "date_created", "questions", "voters"]

    def get_questions(self, obj):
        questions_queryset = Question.objects.filter(ballot=obj.id)
        serializer = QuestionOptionsSerializer(questions_queryset, many=True)
        return serializer.data

    def get_voters(self, obj):
        voters_queryset = Voter.objects.filter(ballot=obj.id)
        serializer = VoterSerializer(voters_queryset, many=True)
        return serializer.data


class BallotDataSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    class Meta:
        model = Ballot
        fields = ["id", "title", "status", "questions"]

    def get_questions(self, obj):
        questions_queryset = Question.objects.filter(ballot=obj.id)
        serializer = QuestionOptionsSerializer(questions_queryset, many=True)
        return serializer.data

class ImportVotersSerializer(serializers.Serializer):
    csv_file = serializers.FileField(required=True)
    ballot_id = serializers.SlugRelatedField(slug_field="id", queryset=Ballot.objects.all(), required=True)
