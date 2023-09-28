var canvas = document.getElementById("canvas");

// устанавка размеров canvas равными размеру окна браузера
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 25;

// получение контекста отрисовки на canvas
var ctx = canvas.getContext("2d");

// определение параметров фейерверка
var fireworks = [];
var particles = [];

// функция создания нового фейерверка
function createFirework() {
  fireworks.push({
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    yVelocity: -Math.random() * 10 - 5,
    particleCount: 350 + Math.floor(Math.random() * 50),
  });
}

// функция создания частиц для фейерверка
function createParticles(firework) {
  for (var i = 0; i < firework.particleCount; i++) {
    var angle = Math.random() * 2 * Math.PI;
    var speed = Math.random() * 10 + 1;
    particles.push({
      x: firework.x,
      y: firework.y,
      color: firework.color,
      xVelocity: Math.cos(angle) * speed,
      yVelocity: Math.sin(angle) * speed,
      gravity: 2,
      life: 15 + Math.floor(Math.random() * 100),
    });
  }
}

// функция обновления состояния фейерверков
function updateFireworks() {
  // создание нового фейерверка с вероятностью 5%
  if (Math.random() < 0.05) {
    createFirework();
  }

  for (var i = fireworks.length - 1; i >= 0; i--) {
    // обновление положения каждого фейерверка
    fireworks[i].y += fireworks[i].yVelocity;

    // если фейерверк достигает высоты взрыва, создает частицы
    if (fireworks[i].yVelocity <= 0) {
      createParticles(fireworks[i]);
      fireworks.splice(i, 1);
    }
  }
}

// функция обновления состояния частиц 
function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    // обновление положения каждой частицы
    particles[i].x += particles[i].xVelocity;
    particles[i].y += particles[i].yVelocity + particles[i].gravity;

    // уменьшение времени жизни каждой частицы
    particles[i].life--;

    // Удаление частиц, которые вышли за пределы canvas или уже умерли
    if (
      particles[i].x < 0 ||
      particles[i].x > canvas.width ||
      particles[i].y < 0 ||
      particles[i].y > canvas.height ||
      particles[i].life <= 0
    ) {
      particles.splice(i, 1);
    }
  }
}
// отрисовка линий
function drawLine(x1, y1, x2, y2, color, lineWidth) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// функция отрисовки частиц на canvas
function draw() {
  // очищение canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // отрисовка каждой частицы
  for (var i = 0; i < particles.length; i++) {
    drawLine(
      particles[i].x,
      particles[i].y,
      particles[i].x - particles[i].xVelocity,
      particles[i].y - particles[i].yVelocity - particles[i].gravity,
      particles[i].color,
      1
    );
    ctx.fillStyle = particles[i].color;
    ctx.fillRect(particles[i].x, particles[i].y, 2, 2);
  }
}

// запуск циклического процесса движения/видоизменения множества графических примитивов
setInterval(function () {
  updateFireworks();
  updateParticles();
  draw();
}, 30);
