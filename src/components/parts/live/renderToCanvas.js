export const render = (instructions, c) => {
  c.beginPath();
  instructions.forEach((instr) => {
    if (instr.type === 'Move') {
      c.moveTo(instr.points[0].x * 6 - 100, instr.points[0].y * 6 - 100);
    }
    if (instr.type === 'Cubic') {
      c.moveTo(instr.points[0].x * 6 - 100, instr.points[0].y * 6 - 100);
      c.bezierCurveTo(instr.points[1].x * 6 - 100, instr.points[1].y * 6 - 100 ,instr.points[2].x * 6 - 100, instr.points[2].y * 6 - 100 ,instr.points[3].x * 6 - 100, instr.points[3].y * 6 - 100);
    }
  });
  c.stroke();
};
