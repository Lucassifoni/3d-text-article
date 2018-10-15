const tp = n => parseInt(n, 10);

export const render = (points, c) => {
  c.fillStyle = 'red';
  points.forEach((point) => {
    c.fillRect(tp(point.x) + 2, tp(point.y), 1, 5);
      c.fillRect(tp(point.x), tp(point.y) + 2, 5, 1);
  });
};
