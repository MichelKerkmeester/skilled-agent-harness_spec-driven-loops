'use strict';

// The sentinel block is a file's palette contract: the record is the source, the block is the copy,
// and a copy that drifts by one digit is how a file ships a colour no gate ever measured. Contrast is
// re-derived through the colour-gates port rather than read back from the record's own ratios, and a
// departure is honoured only when the skin, the role and the measured ratio all agree.

const NAME = 'derivation-gates';
const BEGIN = /\/\*\s*DIAGRAM_PALETTE:BEGIN\s+skin=([\w-]+)\s*\*\//g;
const END = /\/\*\s*DIAGRAM_PALETTE:END\s*\*\//g;
const TEXT_ROLES = new Set(['ink', 'muted', 'soft']);
const OFF_GROUND = new Set(['paper-2', 'page']);

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { kind, regions, palette, gates, tally, record, label } = ctx;
    const styles = regions.styles.join('\n');
    const begins = [...styles.matchAll(BEGIN)];
    // A delivery outside the package is not a template, so an absent block is not its defect.
    if (kind !== 'template' && begins.length === 0) return;
    tally(NAME, 1);
    const ends = [...styles.matchAll(END)];
    if (begins.length !== 1 || ends.length !== 1 || ends[0].index < begins[0].index) {
      record(NAME, 'error', label, `the styles carry ${begins.length} palette block(s) and ${ends.length} terminator(s); exactly one sentinel pair must bound the tokens or the block's extent is a guess`);
      return;
    }
    const skin = begins[0][1];
    const body = styles.slice(begins[0].index + begins[0][0].length, ends[0].index);
    const source = palette.skins[skin];
    const groundRole = palette.grounds[skin];
    const roles = new Map();
    for (const m of body.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;]+);/g)) roles.set(m[1], m[2].trim());
    const ground = roles.get(groundRole);
    if (!source || !ground) {
      record(NAME, 'error', label, `the block names skin "${skin}" but the palette carries no ${groundRole} ground to measure it against; the file and the source disagree about which skin it is`);
      return;
    }
    for (const [role, value] of roles) {
      tally(NAME, 1);
      const known = source.roles[role];
      if (!known) record(NAME, 'error', label, `role ${role} is not in the ${skin} skin; a file may not carry a token the source does not define`);
      else if (known.value !== value) record(NAME, 'error', label, `role ${role} is "${value}" where the ${skin} source says "${known.value}"; the block and the source must agree byte for byte or the two drift one edit at a time`);
    }
    const check = (role, value, backdrop, threshold, where) => {
      tally(NAME, 1);
      const ratio = gates.round2(gates.contrast(value, backdrop));
      if (ratio >= threshold) return;
      const excused = (palette.departures || []).some((d) => d.skin === skin && d.role === role && gates.round2(d.measured) === ratio);
      if (excused) return;
      record(NAME, 'error', label, `${role} measures ${ratio.toFixed(2)}:1 ${where} and the gate is ${threshold}:1; a token under its gate is a recorded departure or it does not ship`);
    };
    for (const [role, value] of roles) {
      if (!/^#[0-9a-f]{6}$/i.test(value) || role === groundRole || OFF_GROUND.has(role)) continue;
      if (palette.gates.ungated.includes(role)) continue;
      if (role === 'accent') {
        if (roles.has('ink')) check(role, value, roles.get('ink'), palette.gates.accentAgainstInk, 'against ink');
        check(role, value, ground, palette.gates.markOnPaper, `against the ${groundRole} ground`);
      } else {
        check(role, value, ground, TEXT_ROLES.has(role) ? palette.gates.textOnPaper : palette.gates.markOnPaper, `against the ${groundRole} ground`);
      }
    }
  },
};
