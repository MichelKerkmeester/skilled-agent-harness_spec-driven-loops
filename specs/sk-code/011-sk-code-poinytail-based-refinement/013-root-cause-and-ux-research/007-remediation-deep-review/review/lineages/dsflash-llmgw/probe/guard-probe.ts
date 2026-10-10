// Read-only probe: classify commands through the reviewed dispatch classifier.
// No files are written; prints one JSON line per case. The guard's deny rule for an
// ambiguous classification is a single unconditional branch
// (dispatch-preflight-lint.ts: `if (input.inspectionKind === "ambiguous") return true;`),
// and this run's own setup command observed that end-to-end denial live.
// Usage: node --import <tsx loader> guard-probe.ts <repo-root>
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = path.resolve(process.argv[2] ?? '.');

async function main() {
  const audit = await import(pathToFileURL(path.join(repoRoot, '.skilled/hooks/dispatch/lib/dispatch-audit.mjs')).href);

  const cases = [
    ['observed: mkdir with a variable path', 'mkdir -p "$LIN/prompts"'],
    ['control: mkdir with a literal path', 'mkdir -p specs/x/prompts'],
    ['copy preserving permissions from a variable', 'cp -p "$SRC" "$DST"'],
    ['grep recursion over a variable dir', 'grep -r foo "$DIR"'],
    ['plain variable read, no print flag', 'ls "$DIR"'],
    ['variable plus node print flag', 'node -p "$EXPR"'],
    ['real dispatch shape', 'devin -p "task"'],
    ['real dispatch through a variable', '"$CLI" -p task'],
  ];

  for (const [label, command] of cases) {
    const inspection = audit.inspectDispatch(command);
    console.log(JSON.stringify({ label, command, kind: inspection.kind }));
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
