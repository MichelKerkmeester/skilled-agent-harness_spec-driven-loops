// Builds the cli-pi command through the deep-loop fan-out builder and runs it
// once in the given working directory, so a live run exercises the exact argv a
// deep-loop child gets. Prints the argv with the prompt elided, the exit code
// and the reply; never prints the environment.
// Usage: node pi-builder-smoke.cjs <fanout-run.cjs> <cwd> <out.json> [agentDir]
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

const [fanoutPath, cwd, outFile, agentDir] = process.argv.slice(2);
const { buildLineageCommand } = require(fanoutPath);

const env = { ...process.env, PI_BLACKHOLE_PASSIVE: 'true', AI_SESSION_CHILD: '1', SYSTEM_SPEC_GATE_ENFORCE: '0' };
if (agentDir) env.PI_CODING_AGENT_DIR = agentDir;

const prompt = 'Reply with exactly PI-OK and nothing else. Do not use any tool.';
const lineage = { kind: 'cli-pi', model: 'deepseek-v4.1-flash', reasoningEffort: 'max' };
// workspace-write is the sandbox a writing deep-loop leaf runs under, and the
// one that keeps auto-discovered extensions on.
const built = buildLineageCommand(lineage, prompt, 'workspace-write', 'default', { env });

const result = spawnSync(built.command, built.args, {
  cwd, env, input: built.input ?? '', encoding: 'utf8', timeout: 240000, maxBuffer: 16 * 1024 * 1024,
});

const summary = {
  cwd,
  agentDirOverlay: Boolean(agentDir),
  argv: [built.command, ...built.args.map((a, i) => (built.promptArgIndexes?.includes(i) ? '<prompt>' : a))],
  exit: result.status,
  signal: result.signal,
  replyTail: (result.stdout || '').trim().split('\n').slice(-1)[0] || '',
  hasPiOk: /(^|\n)PI-OK\s*$/.test((result.stdout || '').trim()),
  stderrHead: (result.stderr || '').slice(0, 400),
};
fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
