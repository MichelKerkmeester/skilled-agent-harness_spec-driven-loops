---
id: CQ-010
category: quality_gate
title: 'A checklist row fault stays scoped to the files its declaration reaches'
description: "This scenario validates the gate run for `CQ-010`. It builds a temporary repository with a private sibling skill whose declaration holds one valid checklist row and one malformed row, then runs the gate twice. A change its surface reaches reads ERROR with the fault in `config.errors`, and a change it does not reach reads NO_BLOCKER_FOUND with the same fault in `config.warnings`."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - references/quality-config.md
  - scripts/quality-gate.cjs
version: 1.1.3.0
---

# CQ-010: A Checklist Row Fault Stays Scoped To The Files Its Declaration Reaches

This document captures the run contract, execution process, source anchors and metadata for `CQ-010`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-010`. A skill outside the hub declares its own surface and its own `quality.checklists` rows in its `graph-metadata.json`. The fixture declares two rows: one well formed, and one that names a file but no selector, so no file could ever match it. The runner reads each declared row before it uses it, reports a row it cannot follow with `CHECKLIST_ROW_INVALID`, and never reads the file such a row names.

The scenario runs the gate over two changes against that one declaration. The first change sits inside the declaring skill's surface. The second sits outside it. The runner contract says a fault on a declaration that applies to the change makes the gate `ERROR` with exit 3, and the same fault on a declaration that reaches no file in scope goes to `config.warnings` and changes no gate.

### Why This Matters

A broken row in a shared hub must not stop every repository that mounts the hub, and it must not be silent either. If a fault always gated, one author's typo in a private skill would block unrelated work. If a fault never gated, a change the skill does govern would be reviewed without the checklist its author meant, and the run would still read clean.

The scope rule is the whole difference between those two outcomes, so the scenario holds everything else fixed. The declaration, the row, the repository and the runner are identical across the two runs, and only the changed file differs. The valid row beside the bad one proves the fault is reported by name and does not take the rest of the declaration down with it.

---

## 2. SCENARIO CONTRACT

Operators confirm that the malformed row gates a change its surface reaches, that the same row only warns for a change its surface does not reach, that the valid row still resolves in the gating run, and that the run is otherwise unchanged.

- Objective: confirm the gate, the exit code, the error and warning lists with their codes, and the valid row's listing for each of the two changes.
- Real user request: `A private skill beside our hub ships a checklist declaration with a typo in one row. Run the quality gate on my change and tell me whether that typo matters.`
- Prompt: `Run the quality gate on my change and tell me whether the broken checklist row in the private skill matters for it.`

**Exact prompt**:

```text
Run the quality gate on my change and tell me whether the broken checklist row in the private skill matters for it.
```

- Fixture: two temporary git repositories outside the working tree, each built from the fixture builder the runner suite uses, with a private sibling skill beside the fixture hub. The skill's `graph-metadata.json` declares the hub's family, a `surface_detection` block with the path marker `xsrc/`, and a `quality` block of two rows. Repository A changes `xsrc/run.js`, inside the surface. Repository B changes `ysrc/run.js`, outside it.

| Fixture part | Content | What the run must say |
| --- | --- | --- |
| valid row | `extensions` `.js`, `file` `outside-checklist.md`, with the file present | listed for `xsrc/run.js` in repository A, and never listed in repository B |
| malformed row | `file` `no-selector.md` and no selector | `CHECKLIST_ROW_INVALID`, naming the skill label, the row index and `names no selector` |
| repository A change | `xsrc/run.js`, a file the surface reaches | the fault is in `config.errors` and the gate is `ERROR` |
| repository B change | `ysrc/run.js`, a file no surface reaches | the fault is in `config.warnings` and the gate is `NO_BLOCKER_FOUND` |

- Expected execution process: the operator replays the scoped-fault cases from the runner suite, then builds both repositories by hand, runs the gate in JSON and, for repository B, in text form, and reads the fields the table names. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: repository A reads `gate` `ERROR`, exit `3`, `config.errors` holding one `CHECKLIST_ROW_INVALID` and `config.warnings` empty, with the valid row still listed for `xsrc/run.js`. Repository B reads `gate` `NO_BLOCKER_FOUND`, exit `0`, `config.errors` empty and `config.warnings` holding the same one code with a repair string, and the text form prints a `warning CHECKLIST_ROW_INVALID:` line.
- Desired user-visible outcome: the author of the private skill sees the typo named with its row index in both runs, and only the change the skill governs is held up by it.
- Pass/fail: PASS if every value in the expected-result table below holds, the command exits 0 and every snapshot check passes. FAIL if repository B gates, repository A reads clean, the fault is missing from both lists or sits in both, or the valid row stops listing in repository A.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on my change and tell me whether the broken checklist row in the private skill matters for it.`

### Commands

Run the commands from the repository root in one shell session, so the variables set in step 3 stay defined.

1. `node --test --test-reporter=tap --test-name-pattern='^outside skill fault' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
2. `sed -n "/^test('outside skill fault: a malformed row whose surface/,/^}));/p; /^test('outside skill fault: the same malformed row/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
3. Build both repositories by hand, run the gate over each and assert the fields.

```bash
PRIVATE_FOLDER="$(printf '%s-%s' local example)"
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const folder = process.argv[1];
function declare(repo) {
  const skill = path.join(path.dirname(repo.hub), folder);
  fs.mkdirSync(skill, { recursive: true });
  fs.writeFileSync(path.join(skill, "graph-metadata.json"), JSON.stringify({
    schema_version: "1.0",
    skill_id: folder,
    family: path.basename(repo.hub),
    surface_detection: { label: "example", role: "specific", pathMarkers: ["xsrc/"] },
    quality: { checklists: [{ extensions: [".js"], file: "outside-checklist.md" }, { file: "no-selector.md" }] },
  }, null, 2) + "\n");
  fs.writeFileSync(path.join(skill, "outside-checklist.md"), "# Fixture checklist\n\nA stand-in for the outside skill checklist.\n");
}
const reached = buildRepo({ change: { "xsrc/run.js": "module.exports = 1;\n" } });
const unreached = buildRepo({ change: { "ysrc/run.js": "module.exports = 1;\n" } });
try {
  declare(reached);
  declare(unreached);
  const a = assertSnapshotUnchanged(reached, () => reached.run(["--format", "json"]));
  assert.equal(a.status, 3);
  assert.equal(a.verdict.gate, "ERROR");
  assert.deepEqual(a.verdict.config.errors.map((entry) => entry.code), ["CHECKLIST_ROW_INVALID"]);
  assert.match(a.verdict.config.errors[0].message, /^EXAMPLE quality\.checklists\[1\] names no selector/);
  assert.deepEqual(a.verdict.config.warnings, []);
  const listed = a.verdict.checklists.find((entry) => entry.file === "hub:" + folder + "/outside-checklist.md");
  assert.ok(listed, "the valid row stopped listing");
  assert.deepEqual(listed.files, ["xsrc/run.js"]);
  console.log("reached gate " + a.verdict.gate + " exit " + a.status);
  console.log("errors " + a.verdict.config.errors.map((entry) => entry.code).join(","));
  console.log("warnings " + a.verdict.config.warnings.length);
  console.log("valid row still listed for xsrc/run.js");
  const b = assertSnapshotUnchanged(unreached, () => ({ json: unreached.run(["--format", "json"]), text: unreached.run(["--format", "text"]) }));
  assert.equal(b.json.status, 0);
  assert.equal(b.json.verdict.gate, "NO_BLOCKER_FOUND");
  assert.deepEqual(b.json.verdict.config.errors, []);
  assert.deepEqual(b.json.verdict.config.warnings.map((entry) => entry.code), ["CHECKLIST_ROW_INVALID"]);
  assert.match(b.json.verdict.config.warnings[0].message, /^EXAMPLE quality\.checklists\[1\] names no selector/);
  assert.equal(typeof b.json.verdict.config.warnings[0].repair, "string");
  assert.match(b.text.stdout, /^warning CHECKLIST_ROW_INVALID: EXAMPLE quality\.checklists\[1\] names no selector/m);
  console.log("unreached gate " + b.json.verdict.gate + " exit " + b.json.status);
  console.log("errors " + b.json.verdict.config.errors.length);
  console.log("warnings " + b.json.verdict.config.warnings.map((entry) => entry.code).join(","));
  console.log("repair " + b.json.verdict.config.warnings[0].repair);
} finally {
  reached.cleanup();
  unreached.cleanup();
}
' "$PRIVATE_FOLDER"
echo "exit $?"
```

4. `for p in references/runner-contract.md references/quality-config.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays the scoped-fault cases and prints `# pass 4` then `# fail 0`. Step 2 shows the two cases that differ only in the changed file: the first asserts exit 0, an empty `config.errors` and one warning, and the second asserts exit 3, one error and an empty `config.warnings`. Step 3 prints `reached gate ERROR exit 3`, `errors CHECKLIST_ROW_INVALID`, `warnings 0` and the valid-row line, then `unreached gate NO_BLOCKER_FOUND exit 0`, `errors 0`, `warnings CHECKLIST_ROW_INVALID` and the repair line, and the command exits 0. Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| repository A `gate` | `ERROR` |
| repository A `exit_code` | `3` |
| repository A `config.errors` | one entry, code `CHECKLIST_ROW_INVALID`, message starting `EXAMPLE quality.checklists[1] names no selector` |
| repository A `config.warnings` | empty |
| repository A valid row | listed as `hub:<private folder>/outside-checklist.md` for `xsrc/run.js` |
| repository B `gate` | `NO_BLOCKER_FOUND` |
| repository B `exit_code` | `0` |
| repository B `config.errors` | empty |
| repository B `config.warnings` | one entry, code `CHECKLIST_ROW_INVALID`, the same message, a non-empty `repair` |
| repository B text form | a `warning CHECKLIST_ROW_INVALID:` line |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the `config.errors` and `config.warnings` entries quoted for each repository with their codes and messages, both gate and exit lines, the valid row's listing for repository A, the text-form warning line for repository B, and the command's exit 0, which is the result of every snapshot check and assertion. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: repository A is `ERROR` with exit `3`, the fault is in its `config.errors` and not in its warnings, and the valid row still lists for `xsrc/run.js`. Repository B is `NO_BLOCKER_FOUND` with exit `0`, the same fault is in its `config.warnings` with a repair string and not in its errors, and the command exits 0 with every snapshot check passed.
- **Fail**: repository B is gated, repository A reads clean, the fault appears in neither list or in both, the valid row stops listing in repository A, the warning has no repair string, or a snapshot check throws.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see which scoped-fault case failed.
2. If repository A reads `NO_BLOCKER_FOUND` with a warning, the changed file did not resolve to the declared surface. Check that the path marker `xsrc/` is a path segment of the file and that the skill's `family` equals the fixture hub folder name, because a skill that declares another family is never read.
3. If neither list holds the fault, the declaration was not read. Confirm the skill folder is a sibling of the fixture hub and its `graph-metadata.json` parses.
4. If the gate is `ERROR` with code `CHECKLIST_MISSING`, a valid row's file is absent. The fixture must write `outside-checklist.md` beside the metadata file.
5. A fault on a checklist row in the repository's own `.sk-code/quality.json` is a different case. That config is validated as a whole, so a bad row there is a config error for the run and never a scoped warning.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
| --- | --- |
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
| --- | --- |
| [SKILL.md](../../SKILL.md) §3 | The gate workflow line that reads an `ERROR` run as no verdict rather than a pass |
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The scoped-fault cases this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §6 | The row rules, the fault codes and the rule that sends an unreached fault to `config.warnings` |
| [runner-contract.md](../../references/runner-contract.md) §3 | The `config` field of the envelope: `errors` and `warnings` |
| [quality-config.md](../../references/quality-config.md) §3 | The `checklists` row schema the fixture's valid row follows |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/scoped-checklist-faults.md`
