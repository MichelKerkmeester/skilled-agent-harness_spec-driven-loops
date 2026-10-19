// Classify and evaluate one OpenCode 1 and three OpenCode 2 commands through the shared dispatch inspector.
// The evaluator resolves each binary's major from its `--version` output, as the live hooks do.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectDispatch } from '../../../../../../.skilled/hooks/dispatch/lib/dispatch-audit.mjs';
import { evaluate, readHardRules } from '../../../../../../.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../../..');
const rules = readHardRules(path.join(root, '.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md'));

const cases = [
  ['v2 clean', 'opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash#max --format json "say hi" </dev/null'],
  ['v2 no model, no stdin', 'opencode2 run --standalone --format json "say hi"'],
  ['v2 slash prompt', 'opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash#max "/deep:review x" </dev/null'],
  ['v1 bare agent general', 'opencode run --agent general --model llmgateway/deepseek-v4.1-flash --format json "say hi" </dev/null'],
];

console.log(`rules loaded: ${rules.length}`);
for (const [label, command] of cases) {
  const inspected = inspectDispatch(command);
  const violated = evaluate(command, rules).map((rule) => rule.id);
  console.log(JSON.stringify({ label, kind: inspected.kind, executor: inspected.skill ?? inspected.executor ?? null, violated }));
}
