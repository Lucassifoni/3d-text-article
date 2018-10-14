export const render = (instructions, c) => {
  c.beginPath();
  instructions.forEach((instr) => {
    if (instr.type === 'Move') {
      c.moveTo(instr.points[0].x, instr.points[0].y);
    }
    if (instr.type === 'Cubic') {
      c.moveTo(instr.points[0].x, instr.points[0].y);
      c.bezierCurveTo(instr.points[1].x, instr.points[1].y,instr.points[2].x, instr.points[2].y,instr.points[3].x, instr.points[3].y);
    }
    if (instr.type === 'Line' || instr.type === 'HLine' || instr.type === 'VLine') {
      c.moveTo(instr.points[0].x, instr.points[0].y);
      c.lineTo(instr.points[1].x, instr.points[1].y); 
    }
  });
  c.stroke();
};