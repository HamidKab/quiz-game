import json
import os
from django.http import JsonResponse
from django.conf import settings

DATA_DIR = os.path.join(settings.BASE_DIR, 'data')  # backend/data/

def _load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def questions_list(request):
    data = _load_json('questions.json')
    return JsonResponse(data, safe=False)

def categories_list(request):
    data = _load_json('categories.json')
    return JsonResponse(data, safe=False)