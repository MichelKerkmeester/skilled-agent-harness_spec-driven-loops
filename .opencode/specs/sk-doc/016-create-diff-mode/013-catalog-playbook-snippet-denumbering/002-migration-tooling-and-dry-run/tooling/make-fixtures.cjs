// Builds a synthetic fixture tree under scratch/fixtures/ to test denumber-snippets.cjs.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, 'fixtures');
fs.rmSync(ROOT, { recursive: true, force: true });
const W = (rel, content) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

// ---- happy-path tree: feature_catalog with edge cases ----
W('happy/feature_catalog/feature_catalog.md', [
  '# Test Catalog',
  '',
  '- [foo](01--alpha/001-foo.md) — plain link',
  '- [foo-bar](./01--alpha/002-foo-bar.md#section) — ./ prefix + #anchor + substring-of-foo',
  '- [baz](02--beta/003-baz.md) — other category',
  '',
  'Code-fence link (must still rewrite):',
  '```',
  'see 01--alpha/001-foo.md',
  '```',
  '',
  'A Feature ID mention M-219 and EX-001 must NOT change.',
  ''
].join('\n'));

W('happy/feature_catalog/01--alpha/001-foo.md', [
  '# Foo (M-219)',
  '',
  'Feature ID `M-219` must NOT change (no .md, letter prefix).',
  '',
  '## 4. SOURCE METADATA',
  '- Feature file path: `01--alpha/001-foo.md`',
  '',
  'Related references:',
  '- [002-foo-bar.md](002-foo-bar.md) — same-dir neighbor (bare basename)',
  ''
].join('\n'));

W('happy/feature_catalog/01--alpha/002-foo-bar.md', [
  '# Foo Bar',
  '',
  '## 4. SOURCE METADATA',
  '- Feature file path: `01--alpha/002-foo-bar.md`',
  '',
  'Related references:',
  '- [001-foo.md](001-foo.md) — neighbor',
  ''
].join('\n'));

W('happy/feature_catalog/02--beta/003-baz.md', [
  '# Baz',
  '',
  '## 4. SOURCE METADATA',
  '- Feature file path: `02--beta/003-baz.md`',
  ''
].join('\n'));

// external referrer (outside the tree) that links into it
W('happy/external-referrer.md', [
  '# Some changelog',
  '',
  'Implemented the foo scenario, see [foo](01--alpha/001-foo.md) and [baz](../happy/feature_catalog/02--beta/003-baz.md).',
  ''
].join('\n'));

// ---- collision tree: two numbered files reduce to the same slug ----
W('collide/manual_testing_playbook/manual_testing_playbook.md', '# Root\n- [dupA](16--x/010-dup.md)\n- [dupB](16--x/011-dup.md)\n');
W('collide/manual_testing_playbook/16--x/010-dup.md', '# Dup A (M-001)\n- Feature file path: `16--x/010-dup.md`\n');
W('collide/manual_testing_playbook/16--x/011-dup.md', '# Dup B (M-002)\n- Feature file path: `16--x/011-dup.md`\n');

console.log('fixtures built under', ROOT);
console.log('happy tree:', path.join(ROOT, 'happy/feature_catalog'));
console.log('collision tree:', path.join(ROOT, 'collide/manual_testing_playbook'));
