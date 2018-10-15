const pointOn2dBezierCurve = function(p1, p2, p3, p4, mu) {
    let mum1,mum13,mu3;
    let p = {x : 0, y : 0};

    mum1 = 1 - mu;
    mum13 = mum1 * mum1 * mum1;
    mu3 = mu * mu * mu;

    p.x = mum13*p1.x + 3*mu*mum1*mum1*p2.x + 3*mu*mu*mum1*p3.x + mu3*p4.x;
    p.y = mum13*p1.y + 3*mu*mum1*mum1*p2.y + 3*mu*mu*mum1*p3.y + mu3*p4.y;

    return p;
};

export const bezierInstructionToLines = function(bezierInstr, steps = 10) {
    let step = 1 / steps;
    let start, end;
    const out = [];
    for (let i = 0; i < 1; i += step) {
        let start = i === 0 ? bezierInstr.points[0] : end;
        end = pointOn2dBezierCurve(...bezierInstr.points, i);
        out.push({ type: 'Line', points: [start, end] });
    }
    return out;
};
