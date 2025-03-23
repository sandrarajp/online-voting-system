from django.shortcuts import render, redirect
from django.views.generic import CreateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from dashboard.models import User
from django.urls import reverse
from landing_page import forms
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.contrib import messages

# Create your views here.
def landing_page(request):
    return render(request, "landing_page/landing_page.html")

class RegisterView(SuccessMessageMixin, CreateView):
    model = User
    template_name = "landing_page/register.html"
    form_class = forms.RegisterUserForm
    success_message = "We have sent an email to %(email)s. Please click the activation link included to verify your email address."

    def get_success_message(self, cleaned_data):
        return self.success_message % dict(
        cleaned_data,
        email=self.object.email,
    )

    def get_success_url(self):
        return reverse('login')

    def form_valid(self, form):
        email = form.cleaned_data['email']
        user = form.save(commit = False)
        user.is_active = False #disables the just registered user account pending confirmation
        user.save()
        current_site = get_current_site(self.request) #Gets the current site
        subject = "Verify your email address"
        email_template_name = "landing_page/verify_email.html"
        context = {
        'domain':current_site.domain,
        'site_name': 'Poller',
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "user": user,
        'token': default_token_generator.make_token(user),
        'protocol': 'http',
        }
        message = render_to_string(email_template_name, context)
        email = EmailMessage(subject, message, to=[email])
        email.send()
        return super().form_valid(form)


def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except:
        user = None
    if user is not None:
        user.is_active = True
        user.save()
        messages.add_message(request, messages.INFO, f'Your email account {user.email} has been successfully verified.')
    else:
        messages.add_message(request, messages.INFO, 'Activation link is invalid.')
    login_url = reverse('login')
    return redirect(login_url)

class ResetUserPasswordView(SuccessMessageMixin, PasswordResetView):
    form_class = forms.ResetUserPasswordForm
    template_name = "landing_page/reset_password.html"
    email_template_name = 'landing_page/reset_password_email.html'
    subject_template_name = 'landing_page/reset_password_subject.txt'
    success_message = "We have received your request. If you have an account you should recieve and email with a link to reset your password shortly."

    def get_success_url(self):
        return reverse('landing_page:forgot_password')

class ResetUserPasswordConfirmView(SuccessMessageMixin, PasswordResetConfirmView):
    form_class = forms.ResetUserPasswordConfirmForm
    template_name = "landing_page/reset_password_confirm.html"
    success_message = 'Your password has been reset successfully.'

    def get_success_url(self):
        return reverse('login')