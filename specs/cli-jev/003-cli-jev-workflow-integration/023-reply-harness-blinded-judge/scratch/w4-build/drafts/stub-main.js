// Test double for the cli-deem and jev binaries: it logs one line per call and answers from a table.
function stubMain() {
  const fs = require('node:fs');
  const path = require('node:path');
  const { createHash } = require('node:crypto');
  const name = path.basename(process.argv[1]);
  const args = process.argv.slice(2);
  const env = process.env;
  const scoring = args[0] === 'score';
  const stdin = scoring ? fs.readFileSync(0, 'utf8') : '';
  const key = scoring ? `${createHash('sha256').update(stdin).digest('hex')}|${args[args.indexOf('-q') + 1]}` : '';
  const prior = env.STUB_LOG && fs.existsSync(env.STUB_LOG) ? fs.readFileSync(env.STUB_LOG, 'utf8').split('\n') : [];
  const rerun = prior.filter((line) => scoring && line.split('\t')[0] === name && line.split('\t')[2] === key).length;
  if (env.STUB_LOG) fs.appendFileSync(env.STUB_LOG, `${name}\t${args.join(' ')}\t${key}\n`);
  if (name === 'cli-deem' && args[0] === 'health') {
    if (env.STUB_HEALTH === 'stub') {
      process.stderr.write('{"ok":false,"error":"refused backend: ensemble:stub"}\n');
      process.exit(3);
    }
    process.stdout.write('{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"stubmodel","source_commit":"stubsource"}\n');
  } else if (name === 'jev' && args[0] === '--version') {
    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  } else if (scoring) {
    if (env.STUB_SCORE_EXIT) process.exit(Number(env.STUB_SCORE_EXIT));
    const table = env.STUB_ANSWERS ? JSON.parse(fs.readFileSync(env.STUB_ANSWERS, 'utf8')) : {};
    const entry = table[key];
    const position = Array.isArray(entry) ? entry[rerun % entry.length] : (entry ?? 0);
    process.stdout.write(`${JSON.stringify({ model: 'deem-0.8-v1', answers: { answer: { score: position } } })}\n`);
  } else {
    process.exit(2);
  }
}
