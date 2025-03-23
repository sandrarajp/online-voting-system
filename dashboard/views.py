from os import stat
from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from dashboard import serializers
from dashboard import models
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import logout
from django.http import Http404

class Dashboard(LoginRequiredMixin, View):
    def get(self, request, id=None):
        if id != None:
            try:
                ballot = models.Ballot.objects.get(id=id, creator=self.request.user)
            except:
                raise Http404()
        return render(request, "dashboard/index.html")

class ElectionView(View):
    def get(self, request, id):
        try:
            ballot = models.Ballot.objects.get(id=id)
        except:
            raise Http404()
        if ballot.status == "running" or ballot.status == "completed":
            return render(request, "dashboard/index.html")
        raise Http404()

class ElectionResultsView(View):
    def get(self, request, id):
        try:
            ballot = models.Ballot.objects.get(id=id)
        except:
            raise Http404()
        if ballot.status == "completed":
            return render(request, "dashboard/index.html")
        raise Http404()

class CreateBallotAPIView(CreateAPIView):
    """This API View creates a new ballot"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    serializer_class = serializers.BallotSerializer

    def perform_create(self, serializer):
        serializer.save(creator = self.request.user)

class ListBallotsAPIView(ListAPIView):
    """This API View lists all the ballots created by the current logged in user"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    serializer_class = serializers.BallotSerializer

    def get_queryset(self):
        return models.Ballot.objects.filter(creator=self.request.user)

    def list(self, request, *args, **kwargs):
        response =  super().list(request, *args, **kwargs)
        user = models.User.objects.get(email=self.request.user)
        user_fullname = f"{user.firstname} {user.lastname}"
        response.set_cookie("User", user_fullname)
        return response

class AddQuestionAPIView(CreateAPIView):
    """This API View adds a question to an already created ballot"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    queryset = models.Question.objects.all()
    serializer_class = serializers.QuestionSerializer

class AddOptionAPIView(CreateAPIView):
    """This API View adds an option to a question"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    queryset = models.Option.objects.all()
    serializer_class = serializers.OptionSerializer

class ViewBallotAPIView(RetrieveAPIView):
    """This API View displays a ballot and the corresponding questions, options and voters under it"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    lookup_field = "id"
    serializer_class = serializers.ViewBallotSerializer

    def get_queryset(self):
        return models.Ballot.objects.filter(creator=self.request.user)

class DeleteOptionAPIView(DestroyAPIView):
    """This API View deletes an option"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    queryset = models.Option.objects.all()
    lookup_field = "id"
    serializer_class = serializers.OptionSerializer

class DeleteQuestionAPIView(DestroyAPIView):
    """This API View deletes a question"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    queryset = models.Question.objects.all()
    lookup_field = "id"
    serializer_class = serializers.OptionSerializer

class EditOptionAPIView(UpdateAPIView):
    """This API View updates the specified option"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    queryset = models.Option.objects.all()
    lookup_field = "id"
    serializer_class = serializers.OptionSerializer  

class EditQuestionAPIView(UpdateAPIView):
    """This API View updates the specified option"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    queryset = models.Question.objects.all()
    lookup_field = "id"
    serializer_class = serializers.QuestionSerializer  

class EditBallotAPIView(UpdateAPIView):
    """This API View updates a ballot"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    lookup_field = "id"
    serializer_class = serializers.BallotSerializer
    
    def get_queryset(self):
        return models.Ballot.objects.filter(creator=self.request.user)

class DeleteBallotAPIView(DestroyAPIView):
    """This API View deletes a ballot"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    lookup_field = "id"
    serializer_class = serializers.BallotSerializer
    
    def get_queryset(self):
        return models.Ballot.objects.filter(creator=self.request.user)

class AddVoterAPIView(CreateAPIView):
    """This API View creates new voters"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    queryset = models.Voter.objects.all()
    serializer_class = serializers.VoterSerializer

import csv
class ImportVotersAPIView(APIView):
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    serializer_class = serializers.ImportVotersSerializer
    def post(self, request):
        serializer = serializers.ImportVotersSerializer(data=request.data)
        if serializer.is_valid():
            csv_file = request.FILES["csv_file"]
            if not csv_file.name.endswith(".csv"):
                return Response("File is not CSV type", status=status.HTTP_400_BAD_REQUEST)
            if csv_file.multiple_chunks():
                return Response("File is too large", status=status.HTTP_400_BAD_REQUEST)
            ballot_id = request.data["ballot_id"]
            file_data_list = csv_file.read().decode("utf-8").split("\r\n")
            print(file_data_list)
            print(ballot_id)
            try:
                ballot = models.Ballot.objects.get(id=ballot_id, creator=self.request.user)
            except:
                return Response("Ballot does not exist", status=status.HTTP_404_NOT_FOUND)
            if ballot.status != "building":
                return Response("Ballot is not in the building stage", status=status.HTTP_400_BAD_REQUEST)
            try:
                models.Voter.objects.filter(ballot=ballot_id).delete()
                for index, row in enumerate(file_data_list):
                    if row == "":
                        continue
                    if index == 0: 
                        continue
                    fullname, email = row.split(",")
                    print(fullname, email)
                    voter = models.Voter(fullname=fullname, email=email, ballot=ballot)
                    voter.save()
            except:
                return Response("An error occured while processing csv file", status=status.HTTP_400_BAD_REQUEST)
            return Response("Created successfully")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteVoterAPIView(DestroyAPIView):
    """This API View deletes a single voter"""
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    queryset = models.Voter.objects.all()
    lookup_field = "id"
    serializer_class = serializers.VoterSerializer

class DeleteAllVotersAPIView(APIView):
    def delete(self, request, id):
        try:
            ballot = models.Ballot.objects.get(id=id, creator=self.request.user)
        except:
            return Response("Ballot does not exist", status=status.HTTP_404_NOT_FOUND)

        if ballot.status != "building":
            return Response("Ballot is not in the building stage", status=status.HTTP_400_BAD_REQUEST)
        models.Voter.objects.filter(ballot=id).delete()
        return Response('Deleted successfully')

from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage, get_connection

class LaunchAPIView(APIView):
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    def get(self, request, id):
        try:
            ballot = models.Ballot.objects.get(id=id)
        except: 
            return Response("Ballot does not exist.", status=status.HTTP_404_NOT_FOUND)
        if ballot.creator != self.request.user:
            return Response("You are not authorized to launch this ballot.", status=status.HTTP_401_UNAUTHORIZED)
        if ballot.status == "running":
            return Response("Ballot is already running.", status=status.HTTP_400_BAD_REQUEST)
        if ballot.status == "completed":
            return Response("Ballot is already completed.", status=status.HTTP_400_BAD_REQUEST)
        voters_email_list = list(models.Voter.objects.filter(ballot=ballot))

        connection = get_connection()
        connection.open()

        current_site = get_current_site(self.request)
        subject = f"{ballot.title}"

        for voter in voters_email_list:
            context = {
                "domain": current_site.domain,
                "site_name": "Poller",
                "protocol": "http",
                "ballot_title": ballot.title,
                "ballot_id": ballot.id,
                "voter": voter
            }
            message = get_template('dashboard/launch_election_email.html').render(context)
            email = EmailMessage( subject, message, to=[voter.email])
            email.content_subtype ="html" # Main content is now text/html
            email.send()

        connection.close()

        ballot.status = "running"
        ballot.save()
        return Response("Election has been launched successfully")

class CloseBallotAPIView(APIView):
    def get(self, request, id):
        try:
            ballot = models.Ballot.objects.get(id=id, creator=self.request.user)
        except:
            return Response("Invalid ballot id", status=status.HTTP_404_NOT_FOUND)
        if ballot.status != "running":
            return Response("Ballot is not running", status=status.HTTP_400_BAD_REQUEST)

        voters_email_list = list(models.Voter.objects.filter(ballot=ballot))

        connection = get_connection()
        connection.open()

        current_site = get_current_site(self.request)
        subject = f"{ballot.title}"

        for voter in voters_email_list:
            context = {
                "domain": current_site.domain,
                "site_name": "Poller",
                "protocol": "http",
                "ballot_title": ballot.title,
                "ballot_id": ballot.id,
                "voter": voter
            }
            message = get_template('dashboard/close_election_email.html').render(context)
            email = EmailMessage( subject, message, to=[voter.email])
            email.content_subtype ="html" # Main content is now text/html
            email.send()

        connection.close()

        ballot.status = "completed"
        ballot.save()
        return Response("Closed successfully")

class LoginVoterAPIView(APIView):
    def post(self, request, id):
        voter_id = request.data["voter_id"]
        try:
            voter = models.Voter.objects.get(voter_id=voter_id)
        except:
            return Response("Invalid voter id", status=status.HTTP_404_NOT_FOUND)
        if voter.ballot.id != id:
            return Response("You are not allowed to participate in this ballot", status=status.HTTP_400_BAD_REQUEST)
        ballot = models.Ballot.objects.get(id=id)
        if ballot.status == "building":
            return Response("Ballot isn't live yet", status=status.HTTP_400_BAD_REQUEST)
        if voter.has_voted == True:
            return Response("You have already voted in this election", status=status.HTTP_400_BAD_REQUEST)
        return Response({"Voter Id is valid"})

class VoteAPIView(APIView):
    def post(self, request, id):
        data = request.data
        voter_id = data["voter_id"]
        votes = data["votes"]
        try:
            voter = models.Voter.objects.get(voter_id = voter_id)
        except:
            return Response("Invaid voter id", status=status.HTTP_400_BAD_REQUEST)

        try:
            ballot = models.Ballot.objects.get(id=id)
        except:
            return Response("Ballot does not exist", status=status.HTTP_404_NOT_FOUND)

        if ballot.status != "running":
            return Response("Ballot is not running.", status=status.HTTP_400_BAD_REQUEST)
        print(voter.ballot.id, ballot.id)
        if voter.ballot.id != ballot.id:
            return Response("You are not allowed to participate in this ballot", status=status.HTTP_400_BAD_REQUEST)
        if voter.has_voted == True:
            return Response("You have already voted in this election", status=status.HTTP_400_BAD_REQUEST)
        print("votes", votes)
        for vote in votes:
            option_id = vote["option_id"]
            print(option_id)
            option = models.Option.objects.get(id=option_id)
            number_of_votes = option.number_of_votes
            option.number_of_votes = number_of_votes + 1
            option.save()
        voter.has_voted = True
        voter.save()
        return Response("Voted successfully")

class BallotDataAPIView(RetrieveAPIView):
    """This API View displays a ballot and the corresponding questions and options under it"""
    queryset = models.Ballot.objects.all()
    lookup_field = "id"
    serializer_class = serializers.BallotDataSerializer

class LogoutAPIView(APIView):
    authentication_classes = [SessionAuthentication,]
    permission_classes = [IsAuthenticated,]
    def get(self, request):
        if not self.request.user.is_authenticated:
            return Response({"detail": "User isn't currently logged in."}, status=400)
        logout(request)
        response = Response({"detail": "User logged out successfully."})
        response.delete_cookie("User")
        return response
