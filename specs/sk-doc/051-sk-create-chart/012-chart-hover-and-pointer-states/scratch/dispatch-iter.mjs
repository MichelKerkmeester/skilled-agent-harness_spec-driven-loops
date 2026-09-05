import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runAuditedExecutorCommand } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts';
import { resolveSandboxMode, resolveClaudePermissionMode } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts';
import { snapshotOutOfScopeDirtyPaths, enforceWriteContainment } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts';
const require = createRequire(import.meta.url);
const { buildLineageCommand } = require('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs');

const iter = process.argv[2];
const kind = 'cli-pi';
const model = 'glm-5.3-flash';
const timeoutSeconds = 3600;
const sandboxMode = 'workspace-write';
const lineage = { kind, model, sandboxMode };
const resolvedSandbox = resolveSandboxMode(sandboxMode);
const resolvedPermission = resolveClaudePermissionMode(sandboxMode);
const repoRoot = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const artifactDir = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/research';
const stateLogPath = artifactDir + '/deep-research-state.jsonl';
const promptBody = readFileSync(artifactDir + '/prompts/iteration-' + iter + '.md', 'utf8');
const { command, args, input } = buildLineageCommand(lineage, promptBody, resolvedSandbox, resolvedPermission, { env: process.env, cwd: repoRoot });
console.error('[dispatch] ' + command + ' --model ' + args[args.indexOf('--model')+1] + ' --thinking ' + args[args.indexOf('--thinking')+1]);
const executor = { kind, model, configDir: null, reasoningEffort: null, serviceTier: null, sandboxMode, timeoutSeconds, governor: null };
const dispatchId = 'research-i' + iter + '-g1';
const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot, artifactDir });
const dispatchExit = runAuditedExecutorCommand({
  command, args, cwd: repoRoot, timeoutSeconds, stateLogPath, executor,
  iteration: Number(iter), input, receiptDir: artifactDir + '/dispatch-receipts', dispatchId,
});
const containment = enforceWriteContainment({ repoRoot, artifactDir, preDispatchDirtyPaths, stateLogPath, iteration: Number(iter), label: dispatchId });
if (containment.violations.length > 0) {
  console.error('write-containment violation: ' + containment.violations.map(v=>v.path).join(', '));
  process.exit(1);
}
process.exit(dispatchExit);
