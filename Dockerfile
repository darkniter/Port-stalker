FROM python:3.7-alpine

WORKDIR /app

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt

COPY . .

# ENV FLASK_APP microblog.py

EXPOSE 5000
ENTRYPOINT ["venv/bin/python", "-m", "flask", "run"]