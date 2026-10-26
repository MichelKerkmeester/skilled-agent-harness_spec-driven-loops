---
id: CQ-005
category: quality_gate
title: 'Private surface resolves through its quality declaration'
description: "This scenario validates the gate run for `CQ-005`. It builds fixture F15, a sibling skill outside the hub whose own `graph-metadata.json` declares the hub's family, a `surface_detection` block and a `quality.checklists` block under a placeholder folder name, renders the envelope, and confirms the declared checklist is listed under the public label, the surface label appears and no private folder name reaches the envelope."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
  - assets/quality-defaults.json
version: 1.1.4.0
---

# CQ-005: Private Surface Resolves Through Its Quality Declaration

This document captures the run contract, execution process, source anchors and metadata for `CQ-005`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-005`. Fixture F15 is a private surface: a skill that keeps its own standards in its own checkout and mounts beside the hub as a sibling folder. The sibling's own `graph-metadata.json` carries the whole declaration, which is the hub's family, a `surface_detection` block that claims one folder path, and a `quality.checklists` block with one row. The fixture repository holds one changed JavaScript file inside that folder. The sibling folder name is joined from its two parts at run time, so no tracked document writes it.

The runner reaches that block through the router's outside-skill discovery, which walks the siblings of the hub and keeps every skill that declares the hub's family under a different skill id. The row resolves against the folder that declares it and is labelled by that folder, so the envelope prints `hub:<EXAMPLE>/...`, never the private folder name. The hub's own `mode-registry.json` gains no row, because the registry compiler refuses a `quality` row inside it.

The run must list the checklist the surface declares, beside the universal floor, report the surface label in `resolved_surface`, and print the private name in no field of the envelope. The envelope is the form that gets pasted into tracked handoffs, so its redaction rule is as much the point of this scenario as the checklist row is.

### Why This Matters

A private surface is where the containment promise is easiest to break, because the only name the run has for the change is the private one. A gate that leaks that name writes an operator's checkout into the repository, and the envelope is pasted into handoffs by design. A gate that never lists the surface's checklist leaves the operator's own standards unloaded, so the change is judged by the universal floor alone and never against the standards it was written for.

The same run also proves the declaration path. A sibling skill's `quality` block in its own `graph-metadata.json` is the only way a surface outside the hub reaches its own checklist, so a missing block is silent. Nothing fails loudly when the checklist is absent, the file is simply judged by the floor and reads as covered. A row that names a file outside the sibling's own folder is refused with `CHECKLIST_OUTSIDE_SKILL`, and a row or a block that a reader cannot follow is refused with `CHECKLIST_ROW_INVALID`, so a declaration nobody could load reports its fault instead of reading as no declaration at all.

---

## 2. SCENARIO CONTRACT

Operators confirm that the private surface change returns `NO_BLOCKER_FOUND`, that the envelope lists the surface's checklist under its public label, and that the private folder name appears in no envelope field.

- Objective: confirm the gate value, the exit code, the resolved label, the checklist row and the redaction for fixture F15.
- Real user request: `I keep my stack standards in a private skill beside the hub. Run the quality gate on a change inside it and show me the envelope.`
- Prompt: `Run the quality gate on a change in my private surface and show me the envelope.`

**Exact prompt**:

```text
Run the quality gate on a change in my private surface and show me the envelope.
```

- Fixture: F15, built in a temporary fixture hub and a temporary git repository outside the working tree. The fixture hub starts as a copy of the live registry, so it carries every checklist path the live hub declares, and a sibling skill beside it carries the whole declaration in its own `graph-metadata.json`. The hub registry gains no row. The repository holds one untracked `.js` file inside the surface folder, so every line of it counts as changed.

| Fixture part | Content | What the envelope must say |
| --- | --- | --- |
| sibling skill declaration | `graph-metadata.json` in a folder beside the fixture hub, holding `skill_id`, `family` set to the hub id, `surface_detection` with the label `example`, the role `specific` and a path marker on the surface folder, plus one `quality.checklists` row selected by the `.js` extension | `resolved_surface: EXAMPLE` and the row listed as `hub:<EXAMPLE>/outside-checklist.md` |
| stub checklist | the one file the row names, written inside the sibling skill | the row resolves, so the run reports no `CHECKLIST_MISSING` |
| repository change | one `.js` file at the root of the surface folder | `modified_files` names that one changed file, and it sits inside the surface folder |
| private folder name | the sibling folder, joined from its two parts at run time | no envelope field holds it. The row's folder segment prints as `<EXAMPLE>`, the label its surface declares |

- Expected execution process: the operator replays the F15 cases, reads the helper and the case that build the fixture, then builds the same fixture by hand, renders the envelope and reads the fields the table names. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: `gate` is `NO_BLOCKER_FOUND`, `exit_code` is `0`, `resolved_surface` is `["EXAMPLE"]`, `checklists_loaded` holds `hub:<EXAMPLE>/outside-checklist.md`, and the envelope holds no private folder name.
- Desired user-visible outcome: the operator sees the private surface named by its label, sees the checklist its own standards live in, and can paste the envelope into a handoff without carrying the private folder name.
- Pass/fail: PASS if every value in the expected-result table below holds, the private folder name is absent from the envelope, and both snapshot checks pass. FAIL if the label is missing, the checklist row is missing, the private folder name reaches the envelope, or the gate is not `NO_BLOCKER_FOUND`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on a change in my private surface and show me the envelope.`

### Commands

Run the commands from the repository root in one shell session, so the variables set in step 3 stay defined.

1. `node --test --test-reporter=tap --test-name-pattern='^F15' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
2. `sed -n "/^function writeOutsideSkill/,/^}/p; /^test('F15 outside skill/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
3. Build fixture F15 by hand, render the envelope and assert the fields the table names.

```bash
TMP="$(mktemp -d)"
PRIVATE_FOLDER="$(printf '%s-%s' local example)"
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const folder = process.argv[1];
const repo = buildRepo({ change: { "xsrc/run.js": "module.exports = 1;\n" } });
try {
  const skill = path.join(path.dirname(repo.hub), folder);
  fs.mkdirSync(skill, { recursive: true });
  fs.writeFileSync(path.join(skill, "graph-metadata.json"), JSON.stringify({
    schema_version: "1.0",
    skill_id: folder,
    family: path.basename(repo.hub),
    surface_detection: { label: "example", role: "specific", pathMarkers: ["xsrc/"] },
    quality: { checklists: [{ extensions: [".js"], file: "outside-checklist.md" }] },
  }, null, 2) + "\n");
  fs.writeFileSync(path.join(skill, "outside-checklist.md"), "# Fixture checklist\n\nA stand-in for the outside skill checklist.\n");
  const envelopeRun = assertSnapshotUnchanged(repo, () => repo.run(["--format", "envelope"]));
  const jsonRun = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json"]));
  const verdict = jsonRun.verdict;
  const listed = verdict.checklists.find((entry) => entry.file === "hub:" + folder + "/outside-checklist.md");
  assert.equal(envelopeRun.status, 0);
  assert.equal(verdict.gate, "NO_BLOCKER_FOUND");
  assert.deepEqual(verdict.resolved_surface, ["EXAMPLE"]);
  assert.ok(listed, "the outside checklist was never listed");
  assert.match(listed.why, /^EXAMPLE surface, extensions \.js$/);
  assert.deepEqual(listed.files, ["xsrc/run.js"]);
  assert.deepEqual(verdict.errors, []);
  assert.deepEqual(verdict.config.errors, []);
  assert.ok(!envelopeRun.stdout.includes(folder));
  assert.ok(envelopeRun.stdout.includes("hub:<EXAMPLE>/outside-checklist.md"), "the envelope never listed the outside checklist under its label");
  assert.ok(!envelopeRun.stdout.includes("local-"), "the envelope carried a private segment");
  fs.writeFileSync(process.argv[2] + "/envelope.txt", envelopeRun.stdout);
  process.stdout.write(envelopeRun.stdout);
  console.log("gate " + verdict.gate + " exit " + envelopeRun.status);
  console.log("outside checklist row: hub:<EXAMPLE>/outside-checklist.md");
  console.log("private folder name in envelope: absent");
} finally {
  repo.cleanup();
}
' "$PRIVATE_FOLDER" "$TMP"
echo "exit $?"
```

4. `for p in references/runner-contract.md scripts/quality-gate.cjs assets/quality-defaults.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays both F15 cases and prints `# pass 2` then `# fail 0`. Step 2 shows the helper that writes the sibling's `graph-metadata.json` and the positive case's assertions: the checklist is listed, the row's `why` reads `EXAMPLE surface, extensions .js`, the row serves the one changed file, `resolved_surface` reads `EXAMPLE`, and the envelope holds no private folder name. Step 3 prints the envelope, then `gate NO_BLOCKER_FOUND exit 0`, `outside checklist row: hub:<EXAMPLE>/outside-checklist.md` and `private folder name in envelope: absent`, and the command exits 0. Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` | `NO_BLOCKER_FOUND` |
| `exit_code` | `0` |
| `resolved_surface` | `["EXAMPLE"]` |
| `checklists_loaded` | holds `hub:<EXAMPLE>/outside-checklist.md` beside the universal floor |
| `modified_files` | the one changed file inside the surface folder, which holds no private segment |
| the private folder name in the envelope | absent, and the row's folder segment prints as `<EXAMPLE>` |
| `p0_p1_p2_decisions`, `accepted_deferrals`, `remaining_accepted_risk` | `PENDING_AGENT_JUDGMENT` on each |
| `verification_handoff` | `workflow-verify.md` |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the envelope's `modified_files`, `resolved_surface` and `checklists_loaded` lines, the `outside checklist row` line, the `private folder name in envelope: absent` line, and the command's exit 0, which is the result of both snapshot checks. The transcript shows the private folder name inside the test file that step 2 prints, and no tracked document repeats it. Save the transcript and the envelope excerpt under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the gate is `NO_BLOCKER_FOUND`, exit is `0`, the surface reads `EXAMPLE`, the surface checklist is listed as `hub:<EXAMPLE>/outside-checklist.md`, the private folder name is absent from the envelope, and the command exits 0 with both snapshot checks passed.
- **Fail**: any other gate or exit, a missing label, a missing checklist row, a private folder name in any envelope field, or a snapshot check that throws.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see which F15 assertion failed.
2. If `resolved_surface` reads `UNKNOWN`, compare the sibling's `surface_detection.pathMarkers` with the changed file's folder, and confirm the metadata names `family` equal to the hub id under a `skill_id` the hub does not use, because discovery skips a sibling that declares neither. Detection reads the lowercased path, so a marker also matches a longer segment that ends with the same text.
3. If the checklist row is missing, read `config.errors`. `CHECKLIST_OUTSIDE_SKILL` means the row names a file outside the sibling folder. `CHECKLIST_ROW_INVALID` means the row or the block breaks one of the rules the row reader applies, such as a selector kind it cannot follow, a name holding a `..` segment, or a block naming a key other than `checklists`.
4. If the row is listed but serves no file, compare the row's selector with the changed file, because a row is listed only when its own selector matches a file the surface detected.
5. If the private folder name appears in a field, the redaction rule in `runner-contract.md` section 4 drifted. Record the field that carried it and route the defect to the phase that owns the envelope renderer.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | The target-path checklist map and the runner routing this scenario exercises |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The outside-skill row reader, the folder label it builds and the envelope redaction |
| [router-replay-lib.cjs](../../../sk-code-skilled/assets/scripts/router-replay-lib.cjs) | The outside-skill discovery that walks the hub's siblings and reads each declaration |
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The F15 helper and cases this scenario replays, and the outside-row cases that prove both refusals |
| [runner-contract.md](../../references/runner-contract.md) §4 and §6 | The envelope grammar, its private-name rule and the checklist-owner rules for outside rows |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-005
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/private-surface-change.md`
