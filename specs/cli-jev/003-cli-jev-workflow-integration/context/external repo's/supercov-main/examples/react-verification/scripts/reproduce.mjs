import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
const example = resolve(import.meta.dirname, '..');
const binary =
  process.env.SUPERCOV_BINARY ??
  resolve(example, '../../target/debug/supercov');
const root = mkdtempSync(resolve(tmpdir(), 'supercov-react-verification-'));
const recorded = resolve(example, 'recorded');
mkdirSync(recorded, { recursive: true });
for (const file of ['package.json', 'vitest.config.ts', 'src', 'tests'])
  cpSync(resolve(example, file), resolve(root, file), { recursive: true });
symlinkSync(
  resolve(example, 'node_modules'),
  resolve(root, 'node_modules'),
  'dir',
);
const original = readFileSync(resolve(root, 'src/Checkout.tsx'), 'utf8');
function execute(command, args, status = 0) {
  const r = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    timeout: 120000,
    maxBuffer: 20 * 1024 * 1024,
  });
  assert.ifError(r.error);
  assert.equal(r.status, status, r.stdout + r.stderr);
  return r.stdout;
}
function cli(args) {
  return execute(binary, args);
}
function query(args) {
  const r = JSON.parse(cli([...args, '--json']));
  assert.equal(r.ok, true);
  return r.data;
}
function save(name, value) {
  writeFileSync(
    resolve(recorded, name),
    typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n',
  );
}
function anchor(text) {
  const i = original.indexOf(text);
  assert.ok(i >= 0, text);
  const lines = original.slice(0, i).split('\n');
  return {
    file: 'src/Checkout.tsx',
    line: lines.length,
    column: Buffer.byteLength(lines.at(-1)) + 1,
    text,
  };
}
try {
  save('before.txt', cli(['--', 'npm', 'run', 'test:before']));
  const before = query(['runs', 'latest']);
  save('before.json', before);
  assert.equal(before.tests, 3);
  assert.equal(before.coverage.lines.percentage, 100);
  save('after.txt', cli(['--', 'npm', 'test']));
  const after = query(['runs', 'latest']);
  assert.equal(after.tests, 7);
  assert.equal(after.measurement.complete, true);
  const map = JSON.parse(readFileSync(after.assertionCoverage.map, 'utf8'));
  const checks = [
    [
      'total',
      'toHaveTextContent(/^25',
      '(quantity * 12.5).toFixed(2)',
      'displays the exact order total',
      'The status text equals 25.00 after whitespace normalization.',
      'For quantity 2 this expression produces 25.00 in the output element. The anchored regular expression checks that rendered text.',
    ],
    [
      'accessible-name',
      'toHaveAccessibleName',
      '`Pay for ${quantity} items`',
      'names the payment action accessibly',
      'The payment button has the exact accessible name Pay for 2 items.',
      'This aria-label template supplies the button accessible name, which the matcher compares with Pay for 2 items.',
    ],
    [
      'disabled',
      'toBeDisabled',
      'quantity === 0 || saving',
      'disables payment for an empty order',
      'The payment button is disabled for quantity zero.',
      'For quantity zero this expression sets the HTML button disabled property, checked by the matcher. This claim does not cover the saving branch.',
    ],
    [
      'error-message',
      'toHaveTextContent(/^Payment',
      "String('Payment failed. Try again.')",
      'explains a failed payment',
      'The alert text equals Payment failed. Try again. after whitespace normalization.',
      'The rejected save sets error. React renders this string inside the alert, whose text the anchored regular expression checks after the alert appears.',
    ],
  ];
  const ids = [];
  for (const [id, matcher, text, name, observes, explanation] of checks) {
    const item = map.assertions.find(
      (a) =>
        a.at.file.endsWith('checkout.strong.test.tsx') &&
        a.at.text.replace(/\s/g, '').includes(matcher),
    );
    assert.ok(item, matcher);
    ids.push(item.id);
    item.observes = [observes];
    item.flows = [
      {
        id,
        basis: null,
        appliesTo: [{ file: item.at.file, name }],
        explanation,
        nodes: [{ id: 'ui-value', at: anchor(text) }],
        edges: [{ from: 'ui-value', to: '$assertion', kind: 'data' }],
        countsAsAsserted: ['ui-value'],
        watch: [],
      },
    ];
  }
  writeFileSync(
    after.assertionCoverage.map,
    JSON.stringify(map, null, 2) + '\n',
  );
  for (const id of ids) {
    const detail = query(['runs', after.run, 'assertion', id]);
    assert.ok(detail.assertion.flows[0].expectedBasis, JSON.stringify(detail));
    map.assertions.find((a) => a.id === id).flows[0].basis =
      detail.assertion.flows[0].expectedBasis;
  }
  writeFileSync(
    after.assertionCoverage.map,
    JSON.stringify(map, null, 2) + '\n',
  );
  const evidence = ids.map(
    (id) => query(['runs', after.run, 'assertion', id]).assertion,
  );
  for (const item of evidence) {
    assert.equal(item.flows[0].eligible, true, JSON.stringify(item));
    assert.equal(
      item.flows[0].nodeCredit[0].status,
      'credited',
      JSON.stringify(item),
    );
  }
  save('ui-assertions.json', evidence);
  save('after.json', query(['runs', after.run]));
  // Deliberate edits test this example; Supercov does not perform mutation testing.
  const mutations = [
    ['wrong-total', 'quantity * 12.5', 'quantity * 125'],
    ['wrong-name', '`Pay for ${quantity} items`', '`Delete ${quantity} items`'],
    [
      'enabled-empty-order',
      'disabled={quantity === 0 || saving}',
      'disabled={false}',
    ],
    ['wrong-error', 'Payment failed. Try again.', 'Payment succeeded.'],
  ];
  const results = [];
  for (const [name, from, to] of mutations) {
    assert.ok(original.includes(from));
    writeFileSync(
      resolve(root, 'src/Checkout.tsx'),
      original.replace(from, to),
    );
    execute('npm', ['run', 'test:before']);
    save(`${name}.txt`, execute('npm', ['test'], 1));
    results.push({ name, weakSuitePassed: true, strongSuiteFailed: true });
  }
  save('result.json', {
    node: process.version,
    recordedAt: new Date().toISOString(),
    before: { tests: 3, lineCoverage: 100 },
    after: { tests: 7, reviewedUiFlows: 4 },
    mutations: results,
  });
  console.log('3 weak tests: 100% lines. Four UI regressions still pass.');
  console.log(
    '7 tests with focused assertions: all four regressions fail; four UI expressions have credited maps.',
  );
  console.log(`Evidence: ${recorded}`);
} finally {
  rmSync(root, { recursive: true, force: true });
}
