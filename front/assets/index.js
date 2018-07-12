const select = document.getElementById('selectNum');
const btn = document.getElementById('submit');
const canvas = document.getElementById('chart');
const context = canvas.getContext('2d');
let BALL_RADIUS = 5;

let selectVal = '1';
let interval = 10;
let isRequesting = false;
const request = new XMLHttpRequest();
let data = [];
const fillStyle = {
    0: '#fec303',
    1: '#f8571d',
    2: '#4fb6e5',
    3: '#f786b8'
}
request.onreadystatechange = () => {
    if (request.readyState === 4) {
        // loaded
        if (request.status === 200) {
            const res = JSON.parse(request.response);
            data = data.concat(res.data);
            isRequesting = false;
        } else {
            alert('error');
        }
    }
};
select.addEventListener('change', function(e) {
    selectVal = e.target.value;
}, false);

btn.addEventListener('click', function() {
    if (isRequesting) return;
    request.open('GET', `/api/ticket/buy?num=${selectVal}`);
    request.send(null);
    isRequesting = true;
});

function draw() {
    data.forEach((item) => {
        const ball = new Sprite('ball', {
            BALL_FILL_STYLE: fillStyle[item.area],
            BALL_STROKE_STYLE: 'rgb(0,0,0,0.4)',
            paint: function(sprite, context) {
                context.save();
                context.beginPath();
                context.fillStyle = this.BALL_FILL_STYLE;
                context.strokeStyle = this.BALL_STROKE_STYLE;
                context.beginPath();
                context.arc(ball.left + sprite.width / 2, ball.top + sprite.height / 2,
                    BALL_RADIUS, 0, Math.PI*2, false);
       
                context.clip();
                context.fill();
                context.stroke();
                context.restore();
            }
        });
        ball.left = item.x;
        ball.top = item.y;
        ball.width = BALL_RADIUS * 2;
        ball.height = BALL_RADIUS * 2;
        ball.paint(context);
    });
}

function animate() {
    context.clearRect(0,0,canvas.width,canvas.height);
    interval = parseInt((data[0] && data[0].interval), 10) || 10;
    BALL_RADIUS = interval / 2;
    drawGrid('lightgray', interval, interval);
    draw();
    window.requestAnimationFrame(animate);
}

context.lineWidth = 2;

window.requestAnimationFrame(animate);
