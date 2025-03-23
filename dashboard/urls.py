from django.urls import path
from dashboard import views

app_name = "dashboard"
urlpatterns = [
    path("", views.Dashboard.as_view(), name="dashboard"),
    path("overview/<int:id>", views.Dashboard.as_view()),
    path("overview/<int:id>/edit", views.Dashboard.as_view()),
    path("overview/<int:id>/ballot", views.Dashboard.as_view()),
    path("overview/<int:id>/voters", views.Dashboard.as_view()),
    path("overview/<int:id>/launch", views.Dashboard.as_view()),
    path("overview/<int:id>/results", views.Dashboard.as_view()),
    path("api/create-ballot/", views.CreateBallotAPIView.as_view()),
    path("api/list-ballots/", views.ListBallotsAPIView.as_view()),
    path("api/add-question/", views.AddQuestionAPIView.as_view()),
    path("api/add-option/", views.AddOptionAPIView.as_view()),
    path("api/view-ballot/<int:id>", views.ViewBallotAPIView.as_view()),
    path("api/delete-option/<int:id>", views.DeleteOptionAPIView.as_view()),
    path("api/delete-question/<int:id>", views.DeleteQuestionAPIView.as_view()),
    path("api/edit-option/<int:id>", views.EditOptionAPIView.as_view()),
    path("api/edit-question/<int:id>", views.EditQuestionAPIView.as_view()),
    path("api/edit-ballot/<int:id>", views.EditBallotAPIView.as_view()),
    path("api/delete-ballot/<int:id>", views.DeleteBallotAPIView.as_view()),
    path("api/add-voter/", views.AddVoterAPIView.as_view()),
    path("api/import-voters/", views.ImportVotersAPIView.as_view()),
    path("api/delete-voter/<int:id>", views.DeleteVoterAPIView.as_view()),
    path("api/delete-all-voters/<int:id>", views.DeleteAllVotersAPIView.as_view()),
    path("api/launch-ballot/<int:id>", views.LaunchAPIView.as_view()),
    path("api/vote/<int:id>", views.VoteAPIView.as_view()),
    path("api/login-voter/<int:id>", views.LoginVoterAPIView.as_view()),
    path("api/ballot-data/<int:id>", views.BallotDataAPIView.as_view()),
    path("api/close-ballot/<int:id>", views.CloseBallotAPIView.as_view()),
    path("api/logout/", views.LogoutAPIView.as_view()),
]