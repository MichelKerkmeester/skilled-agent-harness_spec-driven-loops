'use strict';

// The skill says one thing about itself in several places, and each place is a locus that can
// drift. This holds the loci that already drifted once: the version fields, the ownership
// sentence, and the accessibility contract stated once rather than three times.
const VERSION = /^version:\s*(\d+)\.(\d+)\.(\d+)\.(\d+)\s*$/m;
const SKIP = /(^|\/)(changelog|feature-catalog|manual-testing-playbook|node_modules)(\/|$)/;

function markdownUnder(fs, path, root, dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP.test(path.relative(root, full))) markdownUnder(fs, path, root, full, acc);
    } else if (entry.name.endsWith('.md')) {
      acc.push(full);
    }
  }
  return acc;
}

module.exports = {
  name: 'metadata',
  scope: 'corpus',
  run(ctx) {
    const { fs, path, root, tally, record } = ctx;
    const skill = path.join(root, 'SKILL.md');
    const text = fs.readFileSync(skill, 'utf8');
    tally('metadata', 3);
    const anchor = VERSION.exec(text);
    if (!anchor) {
      record('metadata', 'error', 'SKILL.md', 'no four-part version field; the skill has no anchor for its documents to inherit from');
      return;
    }
    if (!/sk-design hub/.test(text)) {
      record('metadata', 'error', 'SKILL.md', 'the packet does not say it belongs to the sk-design hub, which is the registry that carries it');
    }
    const statements = (text.match(/aria-labelledby/g) || []).length;
    if (statements !== 1) {
      record('metadata', 'error', 'SKILL.md', `the accessible-SVG contract is stated ${statements} times; one canonical statement with cross-references is the rule, because copies are where the last contradiction lived`);
    }
    // Every in-scope document inherits the anchor's major.minor; its patch is its own.
    for (const doc of markdownUnder(fs, path, root, root, [])) {
      const m = VERSION.exec(fs.readFileSync(doc, 'utf8'));
      if (!m) continue;
      tally('metadata', 1);
      if (m[1] !== anchor[1] || m[2] !== anchor[2]) {
        record('metadata', 'error', path.relative(root, doc), `version ${m[1]}.${m[2]}.${m[3]}.${m[4]} is outside the anchor's ${anchor[1]}.${anchor[2]} era; the standard's apply pass re-derives it`);
      }
    }
  },
};
