// Validate every packet folder under <sandbox>/specs in parallel and write one
// JSON line per packet: {folder, archived, errors, warnings, failing:[rule...]}.
// Usage: node validate-all.cjs <sandbox> <out.jsonl>
const { execFile } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const [sandbox, outFile] = process.argv.slice(2);
const specsRoot = path.join(sandbox, 'specs');
const VALIDATE = '.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh';
const SKIP = new Set(['memory', 'scratch', 'research', 'review', 'node_modules', '.git', 'context']);

const folders = [];
(function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  if (entries.some((e) => e.isFile() && e.name === 'spec.md')) folders.push(dir);
  for (const e of entries) if (e.isDirectory() && !SKIP.has(e.name)) walk(path.join(dir, e.name));
})(specsRoot);

const out = fs.createWriteStream(outFile);
let next = 0;
let done = 0;
const workers = Math.min(24, Math.ceil(os.cpus().length * 1.5));

function one() {
  if (next >= folders.length) return Promise.resolve();
  const folder = folders[next++];
  const rel = path.relative(sandbox, folder);
  return new Promise((resolve) => {
    execFile('bash', [VALIDATE, rel, '--strict', '--json'], { cwd: sandbox, maxBuffer: 64 << 20, timeout: 300000 }, (err, stdout) => {
      let row;
      try {
        // A phase parent also validates its children and prints one JSON line
        // per folder; the first line is the packet itself.
        const j = JSON.parse(stdout.split('\n').find((l) => l.startsWith('{')));
        row = {
          folder: rel,
          archived: /\/z_(archive|future)\//.test(rel),
          level: j.level,
          errors: j.summary.errors,
          warnings: j.summary.warnings,
          failing: j.entries.filter((e) => e.status === 'error').map((e) => e.rule),
          details: j.entries.filter((e) => e.status === 'error').map((e) => [e.rule, (e.details || []).slice(0, 3).map(String)]),
        };
      } catch (e) {
        row = { folder: rel, unreadable: true, exit: err && err.code, head: String(stdout).slice(0, 200) };
      }
      out.write(JSON.stringify(row) + '\n');
      done += 1;
      if (done % 200 === 0) process.stderr.write(`validated ${done}/${folders.length}\n`);
      resolve();
    });
  }).then(one);
}

Promise.all(Array.from({ length: workers }, one)).then(() => {
  out.end();
  process.stderr.write(`done ${done}/${folders.length}\n`);
});
