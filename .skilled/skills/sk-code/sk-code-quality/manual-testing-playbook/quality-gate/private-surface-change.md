---
id: CQ-005
category: quality_gate
title: 'Private surface resolves through its quality declaration'
description: "This scenario validates the gate run for `CQ-005`. It builds fixture F15, a fixture hub whose private surface carries a `surface_detection` block and a `quality` block under a placeholder name, renders the envelope, and confirms the declared checklist is listed, the surface label appears and no private name reaches the envelope."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
  - assets/quality-defaults.json
version: 1.1.3.0
---

# CQ-005: Private Surface Resolves Through Its Quality Declaration

This document captures the run contract, execution process, source anchors and metadata for `CQ-005`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-005`. Fixture F15 is a private surface: a skill that keeps its own standards in its own checkout and mounts beside the hub. The fixture hub carries one registry row for that surface, with a `surface_detection` block and one `quality` row, and the fixture repository holds one changed JavaScript file inside the surface folder. The surface name is joined from its two parts at run time, so no tracked document writes it.

The run must list the checklist the surface declares, beside the universal floor, report the surface label in `resolved_surface`, and print the private name in no field of the envelope. The envelope is the form that gets pasted into tracked handoffs, so its redaction rule is as much the point of this scenario as the checklist row is.

### Why This Matters

A private surface is where the containment promise is easiest to break, because the only name the run has for the change is the private one. A gate that leaks that name writes an operator's checkout into the repository, and the envelope is pasted into handoffs by design. A gate that never lists the surface's checklist leaves the operator's own standards unloaded, so the change is judged by the universal floor alone and never against the standards it was written for.

The same run also proves the declaration path. A hub row that carries `quality` is the only way a surface outside the hub reaches its own checklist, so a missing row is silent. Nothing fails loudly when the checklist is absent, the file is simply judged by the floor and reads as covered.

---

## 2. SCENARIO CONTRACT

Operators confirm that the private surface change returns `NO_BLOCKER_FOUND`, that the envelope lists the surface's checklist and its label, and that the private name appears in no envelope field.

- Objective: confirm the gate value, the exit code, the resolved label, the checklist row and the redaction for fixture F15.
- Real user request: `I keep my stack standards in a private skill beside the hub. Run the quality gate on a change inside it and show me the envelope.`
- Prompt: `Run the quality gate on a change in my private surface and show me the envelope.`

**Exact prompt**:

```text
Run the quality gate on a change in my private surface and show me the envelope.
```

- Fixture: F15, built in a temporary fixture hub and a temporary git repository outside the working tree. The fixture hub starts as a copy of the live registry, so it carries every checklist path the live hub declares, then gains one row for the private surface and one stub checklist. The repository holds one untracked `.js` file inside the surface folder, so every line of it counts as changed.

| Fixture part | Content | What the envelope must say |
| --- | --- | --- |
| registry row | `surfaceDetection` with the label `example`, the role `specific` and a path marker on the surface folder, plus one `quality.checklists` row with a `paths` selector on that folder | `resolved_surface: EXAMPLE` and the stub checklist in `checklists_loaded` |
| stub checklist | one file the row names, written inside the fixture hub | the row resolves, so the run reports no `CHECKLIST_MISSING` |
| repository change | one `.js` file in the surface folder | `modified_files` names the file with the private segment redacted |
| private name | the surface id, joined from its two parts at run time | no envelope field holds it |

- Expected execution process: the operator replays the F15 case, reads the fixture block that case builds, then builds the same fixture by hand, renders the envelope and reads the fields the table names. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: `gate` is `NO_BLOCKER_FOUND`, `exit_code` is `0`, `resolved_surface` is `["EXAMPLE"]`, `checklists_loaded` holds the stub checklist, and the envelope holds no private name.
- Desired user-visible outcome: the operator sees the private surface named by its label, sees the checklist its own standards live in, and can paste the envelope into a handoff without carrying the private name.
- Pass/fail: PASS if every value in the expected-result table below holds, the private name is absent from the envelope, and both snapshot checks pass. FAIL if the label is missing, the checklist row is missing, the private name reaches the envelope, or the gate is not `NO_BLOCKER_FOUND`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on a change in my private surface and show me the envelope.`

### Commands

Run the commands from the repository root in one shell session, so the variables set in step 3 stay defined.

1. `node --test --test-reporter=tap --test-name-pattern='^F15' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
2. `sed -n "/^test('F15/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
3. Build fixture F15 by hand, render the envelope and assert its four fields.

```bash
TMP="$(mktemp -d)"
PRIVATE_SKILL="$(printf '%s-%s' local example)"
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const skill = process.argv[1];
const repo = buildRepo({ change: { [skill + "/run.js"]: "module.exports = 1;\n" } });
try {
  const registryPath = path.join(repo.hub, "mode-registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  registry.modes.push({
    workflowMode: skill,
    surfaceDetection: { label: "example", role: "specific", pathMarkers: [skill + "/"] },
    quality: { checklists: [{ paths: [skill + "/**"], file: "example-checklist.md" }] },
  });
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  fs.writeFileSync(path.join(repo.hub, "example-checklist.md"), "# Fixture checklist\n");
  const envelopeRun = assertSnapshotUnchanged(repo, () => repo.run(["--format", "envelope"]));
  const jsonRun = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json"]));
  const verdict = jsonRun.verdict;
  assert.equal(envelopeRun.status, 0);
  assert.equal(verdict.gate, "NO_BLOCKER_FOUND");
  assert.deepEqual(verdict.resolved_surface, ["EXAMPLE"]);
  assert.ok(verdict.checklists.some((entry) => entry.file === "hub:sk-code/example-checklist.md"));
  assert.ok(!envelopeRun.stdout.includes(skill));
  fs.writeFileSync(process.argv[2] + "/envelope.txt", envelopeRun.stdout);
  process.stdout.write(envelopeRun.stdout);
  console.log("gate " + verdict.gate + " exit " + envelopeRun.status);
  console.log("private name in envelope: absent");
} finally {
  repo.cleanup();
}
' "$PRIVATE_SKILL" "$TMP"
echo "exit $?"
```

4. `for p in references/runner-contract.md scripts/quality-gate.cjs assets/quality-defaults.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays F15 and prints `# pass 1` then `# fail 0`. Step 2 shows the registry row the case writes, the stub checklist and its three assertions: the checklist is listed, the label is `EXAMPLE`, and the envelope holds no private name. Step 3 prints the envelope, then `gate NO_BLOCKER_FOUND exit 0` and `private name in envelope: absent`, and the command exits 0. Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` | `NO_BLOCKER_FOUND` |
| `exit_code` | `0` |
| `resolved_surface` | `["EXAMPLE"]` |
| `checklists_loaded` | holds `hub:sk-code/example-checklist.md` beside the universal floor |
| `modified_files` | the changed file, with its private segment printed as `<PRIVATE>` |
| the private name in the envelope | absent |
| `p0_p1_p2_decisions`, `accepted_deferrals`, `remaining_accepted_risk` | `PENDING_AGENT_JUDGMENT` on each |
| `verification_handoff` | `workflow-verify.md` |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the envelope's `modified_files`, `resolved_surface` and `checklists_loaded` lines, the `private name in envelope: absent` line, and the command's exit 0, which is the result of both snapshot checks. The transcript shows the private name inside the fixture block that step 2 prints, and no tracked document repeats it. Save the transcript and the envelope excerpt under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the gate is `NO_BLOCKER_FOUND`, exit is `0`, the surface reads `EXAMPLE`, the surface checklist is listed, the private name is absent from the envelope, and the command exits 0 with both snapshot checks passed.
- **Fail**: any other gate or exit, a missing label, a missing checklist row, a private name in any envelope field, or a snapshot check that throws.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see which of the three F15 assertions failed.
2. If `resolved_surface` reads `UNKNOWN`, compare the registry row's `pathMarkers` with the changed file's folder. Detection reads the lowercased path, so a marker also matches a longer segment that ends with the same text.
3. If the checklist row is missing, compare the row's `paths` selector with the changed file. A selector that names only the surface folder does not reach a file below it unless the glob ends in `**`.
4. If the private name appears in a field, the redaction rule in `runner-contract.md` section 4 drifted. Record the field that carried it and route the defect to the phase that owns the envelope renderer.

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
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The F15 case this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §4 and §6 | The envelope grammar, its private-name rule and the checklist-owner rule |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-005
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/private-surface-change.md`
