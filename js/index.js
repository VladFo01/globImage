import { spline } from 'https://cdn.skypack.dev/@georgedoescode/spline@1.0.1';
import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise@2.4.0';

const path = document.querySelector('path');

let tension = 1;

//меняем резкость с помощью инпутов прогресса
document.getElementById('tension').oninput = function onchangeTensionWidth () {
  tension = document.getElementById('tension').value;
}

//создаем свои кастомные свойства

const root = document.documentElement;

//создаем главныe точек

const createPoints = num => {
  const points = [];
  
  //задаем сколько нам нужно точек
  const numPoints = num;

  //равномерно расприделяем точки по колу
  const angleStep = (Math.PI * 2) / numPoints;

  //устанавливаем радиус круга
  const rad = 75;

  for (let i = 1; i <=numPoints; i++) {

    //координаты х и у для каждой точки
    const phi = i * angleStep;

    const x = 100 + Math.cos(phi) * rad;
    const y = 100 + Math.sin(phi) * rad;

    points.push({
      x: x,
      y: y,
      originX: x,
      originY: y,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000,
    });
  }

  return points;
}

let num = 7;

let points = createPoints(num);

document.getElementById('points').oninput = function onchangePointsWidth () {
  num = document.getElementById('points').value;
  points = createPoints(num);
}

const simplex = new SimplexNoise();

//насколько быстро будет меняться анимация
let noiseStep = 0.005;

let hueStep = 0.005 / 6;

let hueNoiseOffset = 0;

(function animate() {
  // generate a smooth continuous curve based on points, using Bezier curves. spline() will return an SVG path-data string.
  // The arguments are (points, tension, close). Play with tension and check out the effect!
  path.setAttribute('d', spline(points, tension, true));

  requestAnimationFrame(animate);

  //для каждой точки
  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
    const nY = noise(point.noiseOffsetY, point.noiseOffsetY);

    // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
    const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
    const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

    //обновляем координаты
    point.x = x;
    point.y = y;

    point.noiseOffsetX += noiseStep;
    point.noiseOffsetY += noiseStep;

    // we want the hue to move a little slower than the rest of the shape
    hueNoiseOffset += hueStep;

    const hueNoise = noise(hueNoiseOffset, hueNoiseOffset);

    const hue = map(hueNoise, -1, 1, 0, 360);

    root.style.setProperty('--startColor',`hsl(${hue}, 100%, 75%)`);
    root.style.setProperty('--stopColor', `hsl(${hue + 60}, 100%, 75%)`);
    document.body.style.background = `hsl(${hue + 60}, 75%, 5%)`;
  }
})();

//задаем число от 1 диапазона к другому
function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

function noise(x, y) {
  // return a value at {x point in time} {y point in time}
  return simplex.noise2D(x, y);
}

path.addEventListener('click', () => {
  noiseStep += 0.005;
});
path.addEventListener('mouseleave', () => {
  noiseStep = 0.005;
});