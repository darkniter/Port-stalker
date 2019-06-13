from flask import render_template, flash, redirect
from app import app
from app import forms


@app.route('/')
@app.route('/index')
def index():
    user = { 'nickname': 'DARKniter' } # выдуманный пользователь
    posts = [ # список выдуманных постов
        {
            'author': { 'nickname': 'John' },
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': { 'nickname': 'Susan' },
            'body': 'The Avengers movie was so cool!'
        }
    ]
    return render_template("index.html",
        title = 'Home',
        user = user,
        posts = posts)


@app.route('/login', methods = ['GET', 'POST'])
def login():
    form = forms.LoginForm()
    return render_template('login.html',
        title = 'Sign In',
        form = form)