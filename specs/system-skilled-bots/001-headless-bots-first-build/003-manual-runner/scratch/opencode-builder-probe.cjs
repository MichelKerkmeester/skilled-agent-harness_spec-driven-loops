'use strict';
// Builds a read-only OpenCode lineage command with the real deep-loop builder in four scratch
// repositories. The builder resolves the agent through `opencode debug agents --standalone`
// (a private server, no model call) and either returns the command or refuses. No run starts.
// usage: node opencode-builder-probe.cjs
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const W = '/Users/michelkerkmeester/worktrees/public/system-skilled-bots';
const fanout = require(path.join(W, '.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs'));

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-builder-probe-'));
const repos = {
  plain: { 'opencode.json': '{}' },
  mcp: { 'opencode.json': '{"mcp":{"demo":{"type":"local","command":["node","-e","0"],"enabled":true}}}' },
  'agent-override': { 'opencode.json': '{"agent":{"build":{"permission":{"bash":"allow","edit":"allow"}}}}' },
  'default-agent': { 'opencode.json': '{"default_agent":"plan","agent":{"plan":{"permission":{"bash":"allow","edit":"allow"}}}}' },
};
console.log(`builder probe ${new Date().toISOString()}`);
try {
  for (const [name, files] of Object.entries(repos)) {
    const dir = path.join(root, name);
    fs.mkdirSync(dir);
    for (const [file, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, file), text);
    console.log(`--- repo ${name}: ${files['opencode.json']}`);
    let seen = null;
    const realResolve = (input) => {
      const { spawnSync } = require('node:child_process');
      const out = spawnSync(input.command, ['debug', 'agents', '--standalone'], { cwd: input.cwd, env: input.env, encoding: 'utf8', timeout: 60000 });
      seen = JSON.parse(out.stdout);
      return seen;
    };
    try {
      const built = fanout.buildLineageCommand(
        { kind: 'cli-opencode', model: 'opencode-go/deepseek-v4-flash' },
        'probe prompt, never sent',
        'read-only',
        'plan',
        { env: process.env, cwd: dir, directoryRoot: dir, resolveOpencodeAgents: realResolve },
      );
      const agentAt = built.args.indexOf('--agent');
      console.log(`  admitted: --agent ${built.args[agentAt + 1]}; OPENCODE_CONFIG_CONTENT=${built.env.OPENCODE_CONFIG_CONTENT}`);
    } catch (error) {
      console.log(`  refused: ${error.name}: ${error.message}`);
    }
    const build = Array.isArray(seen) ? seen.find((agent) => agent.id === 'build') : null;
    if (build) console.log(`  resolved build rules: ${build.permissions.map((r) => `${r.action}:${r.resource}=${r.effect}`).join(' ')}`);
    console.log(`  gap check: ${fanout.opencodeReadOnlyGap(seen, 'build') ?? 'none, every non-read action ends on a deny'}`);
  }
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
