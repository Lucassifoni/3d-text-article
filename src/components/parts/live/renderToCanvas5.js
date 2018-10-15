const tp = n => parseInt(n, 10);

const pCb = (points, context, callback) => {
    let d = points[points.length - 1];
    context.moveTo(points[0].x, points[0].y);
    points.forEach((p) => {
        let dx = p.x - d.x;
        let dy = p.y - d.y;
        let t = [-dy, dx];
        let ce = [(p.x + d.x) / 2, (p.y + d.y) / 2];
        callback(t, ce, p, d);
        d = p;
    });
};

export const render = (points, c) => {
  c.strokeStyle = 'blue';
  pCb(points, c, (t, ce, p, d) => {
      c.lineTo(ce[0], ce[1]);
  });
  c.stroke();
  c.closePath();
  c.beginPath();
  c.strokeStyle = 'white';
  pCb(points, c, (t, ce, p, d) => {
      c.lineTo(t[0] + ce[0], t[1] + ce[1]);
  });
  c.stroke();
};
