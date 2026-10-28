---
id: CQ-013
category: quality_gate
title: 'A hard-floor rule cannot be overridden or disabled'
description: "This scenario validates the gate run for `CQ-013`. It builds a repository whose style document tries to drop input validation and whose config tries to disable a secret rule, then reads the linter, the resolver and the gate. The linter exits 1, the resolver marks the checklist refused with no rows, and the gate stops with CONFIG_INVALID, exit 3, for the style document and again for the config."
expected_intent: QUALITY
expected_resources:
  - references/quality-config.md
  - references/runner-contract.md
  - scripts/quality-gate.cjs
version: 1.0.1.0
---

# CQ-013: A Hard-Floor Rule Cannot Be Overridden Or Disabled

This document captures the run contract, execution process, source anchors and metadata for `CQ-013`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-013`. A repository can drop or replace most rules, but the shared contract fixes a hard floor: secrets, conflict markers, parse failures, input validation, silent failures, initialization safety, resource cleanup and accessibility. A repository has two ways to ask for a change, and both must refuse a floor rule. A `## Rule overrides` row in a checklist is checked by the shared linter, read by the resolver and checked again when the gate loads the checklist. A `commentHygiene.disableRules` id is checked when the gate loads the config.

The scenario builds a repository that tries both, and reads the refusal at each seat.

### Why This Matters

If a repository could write "none" next to input validation or disable the secret rule, the gate's promise that a clean run says something about safety would be gone. The floor is the part of the contract that stays the same everywhere, so the refusal has to be loud and early. The linter refuses the row with its line number. The resolver refuses the whole checklist rather than half-applying it. The gate stops on the refused checklist and on the config before any check runs. A refusal that applied the other rows of the same section, or that only warned, would leave a repository believing a floor rule was off.

---

## 2. SCENARIO CONTRACT

Operators confirm that the linter exits 1 on the floor row, that the resolver reports the checklist as refused with no usable rows, that a gate run over the refused checklist stops with `CONFIG_INVALID` and exit 3, and that a fixed hygiene id in `disableRules` stops the gate the same way.

- Objective: confirm the linter's refusal and exit code, the resolver's `refused` flag and row count, and the gate's `ERROR` verdict, error code and exit code for the refused checklist and for the fixed hygiene id.
- Real user request: `Our style document says input validation is off and our config disables the private key rule. Check that the quality gate does not let us.`
- Prompt: `Check that the quality gate refuses a style document that turns input validation off and a config that disables the private key rule.`

**Exact prompt**:

```text
Check that the quality gate refuses a style document that turns input validation off and a config that disables the private key rule.
```

- Fixture: a scratch folder outside the repository, with no git history, built by the commands below. It holds one handler file, a quality config that names a style document as a checklist, and the style document with one row, `floor.input-validation` set to `none`. A later step adds `commentHygiene.disableRules` set to `["secret.private-key"]`.

| Fixture part | Content | What the run must say |
| --- | --- | --- |
| style document row | `floor.input-validation` set to `none` | the linter prints the refusal for line 9 and exits 1 |
| resolver view | the same checklist, declared by the config | `refused true`, zero rows, one error on line 9 |
| gate with the row alone | the code in the handler file | `ERROR`, exit 3, one `CONFIG_INVALID` error that names the style document and line 9 |
| config with a fixed id | `commentHygiene.disableRules` set to `["secret.private-key"]` | `ERROR`, exit 3, one `CONFIG_INVALID` error naming `commentHygiene.disableRules[0]` |

- Expected execution process: the operator builds the fixture, runs the linter, asks the resolver, runs the gate, adds the fixed id to the config and runs the gate again. Every run reads files and writes none beyond the one config edit in the scratch folder.
- Expected signals: the linter exits 1 with a message that names `floor.input-validation` and the hard floor. The resolver prints `refused true rows 0` and the same message. The first gate run prints `gate ERROR`, a `CONFIG_INVALID` line that says the style document has a refused section, and exits 3. The second prints `gate ERROR` and a `CONFIG_INVALID` line that says `secret.private-key` is fixed by the shared contract, and exits 3.
- Desired user-visible outcome: the repository sees each refusal at the place it wrote the request, with the rule named, and no floor rule is switched off.
- Pass/fail: PASS if every value in the expected-result table below holds. FAIL if the linter accepts the row, the resolver lists the row as applied, either gate run exits 0, or the gate runs its checks over a checklist or a config it should have refused.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check that the quality gate refuses a style document that turns input validation off and a config that disables the private key rule.`

### Commands

Run the commands from the repository root in one shell session, so the variables stay defined.

1. Build the fixture and set `HUB`.

```bash
HUB="$PWD/.skilled/skills/sk-code"
SCRATCH="$(mktemp -d)"
mkdir -p "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository" "$SCRATCH/docs" "$SCRATCH/src"
cat > "$SCRATCH/src/download.js" <<'JS'
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', 'files');

function download(request, response) {
  const target = path.join(ROOT, request.query.name);
  response.end(fs.readFileSync(target));
}

module.exports = { download };
JS
cat > "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository/quality.json" <<'JSON'
{
  "schemaVersion": 1,
  "checklists": [{ "file": "docs/code-style.md", "extensions": [".js"] }]
}
JSON
cat > "$SCRATCH/docs/code-style.md" <<'MD'
# Code style

Handlers in this repository trust their callers.

## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `floor.input-validation` | none | Our callers always send clean input |
MD
```

2. Run the linter over the style document.

```bash
node "$HUB/shared/scripts/check-rule-overrides.cjs" "$SCRATCH/docs/code-style.md"
echo "linter exit $?"
```

3. Ask the resolver about the style document, then run the gate with the row alone and read its errors.

```bash
cd "$SCRATCH" && node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain src/download.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const c=j.checklists.find(x=>x.file==="docs/code-style.md");console.log("refused "+c.overrides.refused+" rows "+c.overrides.rows.length);for(const e of c.overrides.errors)console.log("line "+e.line+": "+e.message)})'
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/download.js 2> /dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("gate "+j.gate);for(const e of j.config.errors)console.log(e.code+" "+e.message)})'
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/download.js > /dev/null 2>&1; echo "gate exit $?"
```

4. Add the fixed hygiene id to the config and run the gate again.

```bash
node -e 'const fs=require("fs");const c=JSON.parse(fs.readFileSync(".skilled/skills/sk-code/sk-code-quality/repository/quality.json","utf8"));c.commentHygiene={disableRules:["secret.private-key"]};fs.writeFileSync(".skilled/skills/sk-code/sk-code-quality/repository/quality.json",JSON.stringify(c,null,2)+"\n")'
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/download.js 2> /dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("gate "+j.gate);for(const e of j.config.errors)console.log(e.code+" "+e.field+": "+e.message)})'
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/download.js > /dev/null 2>&1; echo "gate exit $?"
cd - > /dev/null && rm -rf "$SCRATCH"
```

5. `for p in references/quality-config.md references/runner-contract.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 prints the refusal, with the scratch folder in place of `<scratch>`, then the exit line:

```text
<scratch>/docs/code-style.md:9: `floor.input-validation` is on the hard floor (Input validation: every external input is validated at the boundary) and cannot be overridden
FAIL <scratch>/docs/code-style.md: 1 refused
linter exit 1
```

Step 3 prints `refused true rows 0`, then `line 9:` with the same message, and then:

```text
gate ERROR
CONFIG_INVALID docs/code-style.md has a refused ## Rule overrides section, so none of its rows apply: line 9: `floor.input-validation` is on the hard floor (Input validation: every external input is validated at the boundary) and cannot be overridden
gate exit 3
```

Step 4 prints:

```text
gate ERROR
CONFIG_INVALID commentHygiene.disableRules[0]: commentHygiene.disableRules[0]: "secret.private-key" is fixed by the shared rule-override contract (rule-overrides.json) and cannot be disabled
gate exit 3
```

Step 5 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| linter, exit code | `1`, and the message names `floor.input-validation` at line 9 |
| resolver, style document | `refused true`, zero rows, one error on line 9 |
| gate with the row alone, `gate` | `ERROR`, with one `CONFIG_INVALID` error naming the style document |
| gate with the row alone, exit code | `3` |
| gate with the fixed id, `gate` | `ERROR` |
| gate with the fixed id, exit code | `3` |
| gate with the fixed id, error | `CONFIG_INVALID` on `commentHygiene.disableRules[0]` |

### Evidence

Command transcript from steps 1 to 5, the frontmatter block with `expected_intent: QUALITY`, the linter output and exit line, the resolver's lines, both gate verdicts and exit lines and the `CONFIG_INVALID` lines quoted. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the linter exits 1 with the floor message, the resolver reports the checklist as refused with zero rows, both gate runs read `ERROR` with `CONFIG_INVALID` and exit 3.
- **Fail**: the linter exits 0, the resolver lists the `none` row as applied, the first gate run exits 0 or applies the row in any form, or the second run starts its checks over a config that names a fixed id.

### Failure Triage

1. If the linter exits 0, the row did not parse as a table. Check that the heading reads `## Rule overrides` and that the row has three cells.
2. If the resolver prints `refused false`, the config does not name the style document. Check `checklists[]` in the quality config and the extension of the file you asked about.
3. If the second gate run is not `CONFIG_INVALID`, read `config.errors`. A JSON parse fault stops the run first and hides the id check.
4. A refused checklist applies none of its rows, so a valid row beside the floor row is also not applied. Remove the floor row, and the section applies again.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
| --- | --- |
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
| --- | --- |
| [rule-overrides.md](../../../shared/references/universal/rule-overrides.md) §4 and §8 | The hard floor and the linter's exit codes |
| [rule-overrides.json](../../../shared/references/universal/rule-overrides.json) | The machine-readable floor the linter and the config check read |
| [check-rule-overrides.cjs](../../../shared/scripts/check-rule-overrides.cjs) | The linter that refuses the row |
| [quality-config.md](../../references/quality-config.md) §3 and §7 | The `disableRules` key and the `CONFIG_INVALID` code |
| [runner-contract.md](../../references/runner-contract.md) §3 | The explain output, its `overrides` field and the run's `CONFIG_INVALID` for a refused section |
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The runner cases for the key and the explain output |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-013
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/floor-override-refused.md`
