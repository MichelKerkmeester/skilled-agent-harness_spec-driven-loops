// Read-only probe: compare the Pi guard's classifier (inspectDispatch, no wrapper
// unwrap) with the rule engine's resolver (resolveDispatchPacket, unwraps shell/exec
// wrappers) on the same commands. Writes nothing.
// Usage: node --import <tsx loader> wrapper-probe.ts <repo-root>
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = path.resolve(process.argv[2] ?? '.');

async function main() {
  const audit = await import(pathToFileURL(path.join(repoRoot, '.skilled/hooks/dispatch/lib/dispatch-audit.mjs')).href);

  const cases = [
    ['bash -c wrapper', `bash -c 'devin -p task'`],
    ['sh -c wrapper', `sh -c 'opencode run task'`],
    ['zsh -c wrapper', `zsh -c 'codex exec task'`],
    ['perl exec wrapper', `perl -e 'alarm 5; exec @ARGV' -- devin -p task`],
    ['timeout wrapper', `timeout 5 devin -p task`],
    ['env wrapper', `env devin -p task`],
    ['eval builtin', `eval 'devin -p task'`],
    ['direct baseline', `devin -p task`],
  ];

  for (const [label, command] of cases) {
    const inspection = audit.inspectDispatch(command);
    const packet = audit.resolveDispatchPacket(command);
    console.log(JSON.stringify({
      label,
      inspectionKind: inspection.kind,
      guardAllows: inspection.kind === 'none',
      ruleEngineSkill: packet ? packet.skill : null,
    }));
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
