FROM python:3.8-alpine

WORKDIR /app

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt

COPY . .

# ENV FLASK_APP microblog.py
# ENV FLASK_RUN_PORT 8000
# ENV FLASK_RUN_HOST 0.0.0.0

EXPOSE 5000
ENTRYPOINT ["venv/bin/python", "-m", "flask", "run","--host=0.0.0.0"]