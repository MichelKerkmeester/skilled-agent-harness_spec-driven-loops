'use strict';

// The sentinel block is a file's palette contract: the record is the source, the block is the copy,
// and a copy that drifts by one digit is how a file ships a colour no gate ever measured. Contrast is
// re-derived through the colour-gates port rather than read back from the record's own ratios, and a
// departure is honoured only when the skin, the role and the measured ratio all agree.
//
// A themed copy excepts itself from that contract on purpose: its marker carries system=design-md and
// its values belong to a reference rather than to the record, so it is held to provenance and gates
// instead of bytes. Without that branch the only safe way to check a themed delivery is not to check
// it, which is how client colours end up shipping unmeasured.

const NAME = 'derivation-gates';
const BEGIN = /\/\*\s*DIAGRAM_PALETTE:BEGIN\s+skin=([\w-]+)(?:\s+system=([\w-]+))?\s*\*\//g;
const END = /\/\*\s*DIAGRAM_PALETTE:END\s*\*\//g;
const TEXT_ROLES = new Set(['ink', 'muted', 'soft']);
const OFF_GROUND = new Set(['paper-2', 'page']);
const THEMED_SYSTEM = 'design-md';
// The comment the theming applicator writes directly beneath a themed begin marker: the reference's
// path, the hash of the reference file, and the generator that measured it. A themed block that
// cannot say where its values came from is a palette nobody can re-derive.
const PROVENANCE = /^\/\*\s*DESIGN\.md provenance:\s*path=(\S.*?)\s+sha256=([0-9a-f]{64})\s+generator=([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)\s*\*\/$/i;

// Provenance sits on the line directly beneath the marker, so only that line is read: a comment
// anywhere else in the block would vouch for values it does not stand next to.
function provenanceBelow(body) {
  const lines = body.split(/\r?\n/);
  if ((lines[0] || '').trim() !== '') return null;
  const match = PROVENANCE.exec((lines[1] || '').trim());
  return match && match[1].trim() ? match : null;
}

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { kind, regions, palette, gates, tally, record, label } = ctx;
    const styles = regions.styles.join('\n');
    const begins = [...styles.matchAll(BEGIN)];
    // Only a starter must carry a block: it is what a new diagram is copied from. A worked form
    // and a delivery outside the package keep whichever tokens they draw with.
    if (kind !== 'starter' && begins.length === 0) return;
    tally(NAME, 1);
    const ends = [...styles.matchAll(END)];
    if (begins.length !== 1 || ends.length !== 1 || ends[0].index < begins[0].index) {
      record(NAME, 'error', label, `the styles carry ${begins.length} palette block(s) and ${ends.length} terminator(s); exactly one sentinel pair must bound the tokens or the block's extent is a guess`);
      return;
    }
    const skin = begins[0][1];
    const themed = begins[0][2] === THEMED_SYSTEM;
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
    // A themed block is a client's palette by construction, so byte equality is the one rule it must
    // not obey: its values are meant to differ. What it owes instead is provenance, and every gate
    // below still measures whatever values it does carry.
    if (themed) {
      tally(NAME, 1);
      if (!provenanceBelow(body)) {
        record(NAME, 'error', label, 'the block is marked system=design-md and carries no well-formed DESIGN.md provenance comment directly beneath its begin marker; a themed delivery has to name the reference path and a 64-character sha256 for it, or nothing can tell which reference its values were measured against');
      }
    }
    for (const [role, value] of roles) {
      tally(NAME, 1);
      const known = source.roles[role];
      if (!known) record(NAME, 'error', label, `role ${role} is not in the ${skin} skin; a file may not carry a token the source does not define`);
      else if (!themed && known.value !== value) record(NAME, 'error', label, `role ${role} is "${value}" where the ${skin} source says "${known.value}"; the block and the source must agree byte for byte or the two drift one edit at a time`);
    }
    const check = (role, value, backdrop, threshold, where, gateName) => {
      tally(NAME, 1);
      const ratio = gates.round2(gates.contrast(value, backdrop));
      if (ratio >= threshold) return;
      const excused = (palette.departures || []).some((d) => d.skin === skin && d.role === role && gates.round2(d.measured) === ratio);
      if (excused) return;
      const gate = gateName ? `the ${gateName} gate is ${threshold}:1` : `the gate is ${threshold}:1`;
      record(NAME, 'error', label, `${role} measures ${ratio.toFixed(2)}:1 ${where} and ${gate}; a token under its gate is a recorded departure or it does not ship`);
    };
    for (const [role, value] of roles) {
      if (!/^#[0-9a-f]{6}$/i.test(value) || role === groundRole || OFF_GROUND.has(role)) continue;
      if (palette.gates.ungated.includes(role)) continue;
      if (role === 'accent') {
        if (roles.has('ink')) check(role, value, roles.get('ink'), palette.gates.accentAgainstInk, 'against ink', themed ? 'accentAgainstInk' : null);
        check(role, value, ground, palette.gates.markOnPaper, `against the ${groundRole} ground`, themed ? 'markOnPaper' : null);
        // The accent is the block's one filled focal mark, so it is the role a label can sit on. A
        // themed accent therefore also has to read as text against its own ground; a stock block
        // keeps the mark gate alone, since its accent is the record's own kept-by-decision value.
        if (themed) check(role, value, ground, palette.gates.textOnMark, `against the ${groundRole} ground as a mark that carries a label`, 'textOnMark');
      } else {
        const textRole = TEXT_ROLES.has(role);
        check(role, value, ground, textRole ? palette.gates.textOnPaper : palette.gates.markOnPaper, `against the ${groundRole} ground`, themed ? (textRole ? 'textOnPaper' : 'markOnPaper') : null);
      }
    }
  },
};
