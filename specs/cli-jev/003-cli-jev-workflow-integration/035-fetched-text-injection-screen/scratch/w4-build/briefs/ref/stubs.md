# Stub binaries for T (read only)

`makeStubs()` in T: `const bin = tempDir('bin')`, write the two files below into it with `fs.writeFileSync(file, text, { mode: 0o755 })`, return `bin`. Both are CommonJS scripts (the temp folder has no package.json). Store each script as one constant in T (`JEV_STUB`, `DEEM_STUB`) written as a `String.raw` template literal, so every `\n` stays a backslash and an `n` in the written file. Copy the lines exactly; write the text plus a final newline.

`stubLog(bin, name)`: the lines of `path.join(bin, name + '.log')` without the trailing empty one, each `JSON.parse`d; `[]` when the file does not exist.

## jev (file name `jev`)

```js
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
fs.appendFileSync(path.join(__dirname, 'jev.log'), JSON.stringify(args) + '\n');
const env = process.env;
if (args[0] === '--version') {
  process.stdout.write((env.STUB_JEV_VERSION || 'jev 0.6.2') + '\n');
  process.exit(0);
}
if (args[0] === 'auth' && args[1] === 'status') process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
if (args[0] === 'auth' && args[1] === 'test') {
  process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  process.exit(Number(env.STUB_AUTH_TEST_EXIT || 0));
}
if (args[0] === 'noul') {
  const input = fs.readFileSync(0, 'utf8');
  if (env.STUB_NOUL_EXIT) process.exit(Number(env.STUB_NOUL_EXIT));
  if (env.STUB_NOUL_EMPTY === '1') {
    process.stdout.write('{"answers":{"answer":{}}}\n');
    process.exit(0);
  }
  const noul = input.includes('PLANTED-DIRECTIVE') ? 0.9 : 0.1;
  process.stdout.write(JSON.stringify({ answers: { answer: { noul } } }) + '\n');
  process.exit(0);
}
process.exit(2);
```

## cli-deem (file name `cli-deem`)

```js
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
fs.appendFileSync(path.join(__dirname, 'cli-deem.log'), JSON.stringify(args) + '\n');
const env = process.env;
if (args[0] === 'health') {
  const countFile = path.join(__dirname, 'health.count');
  const n = fs.existsSync(countFile) ? Number(fs.readFileSync(countFile, 'utf8')) : 0;
  fs.writeFileSync(countFile, String(n + 1));
  const commits = (env.STUB_MODEL_COMMITS || 'aaa').split(',');
  const modelCommit = commits[Math.min(n, commits.length - 1)];
  const backend = env.STUB_DEEM_BACKEND || 'torch';
  if (backend === 'stub') {
    process.stderr.write('{"ok":false,"error":"refused backend: stub"}\n');
    process.exit(3);
  }
  process.stdout.write(JSON.stringify({ ok: true, backend, model: 'deem-0.8-v1', model_commit: modelCommit, source_commit: 'bbb' }) + '\n');
  process.exit(0);
}
if (args[0] === 'noul') {
  const input = fs.readFileSync(0, 'utf8');
  if (env.STUB_NOUL_EXIT) process.exit(Number(env.STUB_NOUL_EXIT));
  if (env.STUB_NOUL_EMPTY === '1') {
    process.stdout.write('{"answers":{"answer":{}}}\n');
    process.exit(0);
  }
  const noul = input.includes('PLANTED-DIRECTIVE') ? 0.9 : 0.1;
  process.stdout.write(JSON.stringify({ answers: { answer: { noul } } }) + '\n');
  process.exit(0);
}
process.exit(2);
```
