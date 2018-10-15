export const render = (points, c) => {
  c.fillStyle = 'black';
  points.forEach((point) => {
    c.fillRect(point.x, point.y, 2, 2);
  });
};
