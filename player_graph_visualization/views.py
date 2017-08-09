from django.shortcuts import render
from django.conf import settings

# Create your views here.
from django.http import HttpResponse
import json
import os

def index(request):
    return render(request, 'home.html')

def data(request):
    new_dict = json.loads(open(os.path.join(settings.BASE_DIR, "afc.json"), "r").read())
    return HttpResponse(json.dumps(new_dict), content_type='application/json')