from flask import Flask, render_template

app = Flask(__name__)

## Flask에서는 URL 바인딩에 Route() 레코레이터 사용
## @app.route('/경로') 쓸 때 URL 경로는 반드시 슬래시로 시작
@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/index')
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)