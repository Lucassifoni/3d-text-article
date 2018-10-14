export const render = (instructions) => {
  return instructions.map((instr, i) => {
    if (instr.type === 'Move') return `${i}| move([${instr.points[0].x},${instr.points[0].y}])`;
    if (instr.type === 'Cubic') return `${i}| cubic([${instr.points[0].x},${instr.points[0].y}],[${instr.points[1].x},${instr.points[1].y}],[${instr.points[2].x},${instr.points[2].y}],[${instr.points[3].x},${instr.points[3].y}])`;
  }).join('\n');
};