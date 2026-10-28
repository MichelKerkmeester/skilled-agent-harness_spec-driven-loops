---
id: CQ-007
category: quality_gate
title: 'Envelope round trip keeps both verdicts intact'
description: "This scenario validates the envelope round trip for `CQ-007`. It renders the blocking envelope CQ-002 records and the unverified envelope CQ-006 records, extracts the fields the verify workflow reads, and confirms each gate reaches its own reader decision without losing a field."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
version: 1.1.5.0
---

# CQ-007: Envelope Round Trip Keeps Both Verdicts Intact

This document captures the round-trip contract, execution process, source anchors and metadata for `CQ-007`.

---

## 1. OVERVIEW

This scenario validates the envelope round trip for `CQ-007`. The gate prints one envelope per run, and the verify workflow reads that envelope before it allows a completion claim. This scenario renders the two envelopes the gate produces for a blocking change and for an unverified change, extracts the fields the verify reader consumes, and walks the reader rule in `workflow-verify.md` step 2 over each one.

The round trip is the whole contract between the two workflows. The gate names a gate value, an exit code and the unverified ids. The reader turns those fields into one of three decisions: hand the claim back to quality, prove each unverified id with its own command, or prove the claim when no check read a file as code. A field that survives the render but not the read is the failure this scenario looks for.

### Why This Matters

An envelope nobody reads is decoration. The reader rule is the only place the gate result changes what an author may claim, and its branches send the claim to different places. A reader that treats an unverified id as a pass removes the entire point of exit 4. A reader that skips a field still reading `PENDING_AGENT_JUDGMENT` records a handoff that the agent never finished.

The scenario also pins the precedence the gate applies. A required check that produced no evidence and a blocking finding are different claims, and they exit differently, so the reader must branch on the gate value rather than on the exit code alone.

---

## 2. SCENARIO CONTRACT

Operators confirm that both envelopes carry every field the verify reader consumes, that the blocking envelope sends the claim back to quality, and that the unverified envelope leaves its id open rather than passed.

- Objective: confirm the two envelopes keep their gate, exit, unverified and handoff fields, and state the reader decision each one reaches.
- Real user request: `The quality gate printed an envelope for my change. Tell me what the verify step does with it.`
- Prompt: `Read the quality envelope from my last gate run and tell me what verify does next.`

**Exact prompt**:

```text
Read the quality envelope from my last gate run and tell me what verify does next.
```

- Input: two envelopes, both rendered in temporary git repositories outside the working tree. The blocking envelope carries the gate, the exit code and the blocker that the CQ-002 run records, rendered over a one-label reduction of fixture F01. The round trip reads the gate value, the exit code and the unverified list, and never the finding count, so the count differs from CQ-002 and nothing here depends on it. The unverified envelope is fixture F06 from CQ-006, whose committed config names a required check for a tool that is not installed.

| Envelope | Change | What the reader must find |
| --- | --- | --- |
| blocking, as CQ-002 records it | one Go line comment naming an architecture decision number, joined from fragments at run time | `exit=1`, `p0_blocking=1` and `unverified=none`, so the reader hands the claim back |
| unverified, as CQ-006 records it | one changed Go file beside a required P0 check whose tool is absent | `exit=4`, `p0_blocking=0` and `unverified=absent-tool`, so the id reaches verification open |
| both | one render of `--format envelope` per fixture | `status: advisory`, `verification_handoff: workflow-verify.md` and three fields reading `PENDING_AGENT_JUDGMENT` |

- Expected execution process: the operator reads the reader rule, the exit-code table and the envelope grammar, renders both envelopes, extracts the six fields the reader consumes from each one, and writes down the decision each envelope reaches. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: the blocking envelope exits 1 with `unverified=none`, the unverified envelope exits 4 with `unverified=absent-tool`, and both carry `status: advisory`, the handoff line and three pending judgment fields.
- Desired user-visible outcome: the operator hands the blocking envelope back to quality and carries the unverified id into verification as an open claim, with no field lost between the render and the read.
- Pass/fail: PASS if both envelopes carry every field the reader reads and the two decisions match the reader rule. FAIL if a field is missing, either gate is misread, a pending field is accepted as done, or a pass is recorded for the unverified id.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read the quality envelope from my last gate run and tell me what verify does next.`

### Commands

Run the commands from the repository root in one shell session, so the variables set in step 4 stay defined.

1. `rg -n 'From the quality envelope' .skilled/skills/sk-code/shared/references/workflow-verify.md`
2. `sed -n '/^## 2\. EXIT CODES AND STATES/,/^## 3\. VERDICT SCHEMA/p' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
3. `sed -n '/^## 4\. ENVELOPE GRAMMAR/,/^## 5\. RULE IDS/p' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
4. Render both envelopes and extract the fields the reader consumes.

```bash
LABEL="$(printf '%s-%s' ADR 12)"
node -e '
const assert = require("node:assert/strict");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const label = process.argv[1];
const blocking = buildRepo({
  base: { "README.txt": "fixture\n" },
  change: { "a.go": "package a\n\n// see " + label + "\nfunc A() {}\n" },
});
const unverified = buildRepo({
  base: {
    "app.go": "package a\n\nfunc A() {}\n",
    ".skilled/skills/sk-code/sk-code-quality/repository/quality.json": JSON.stringify({ schemaVersion: 1, checks: [{ id: "absent-tool", argv: ["sk-code-absent-tool", "{files}"], severity: "P0" }] }, null, 2) + "\n",
  },
  change: { "app.go": "package a\n\nfunc A() {}\nfunc B() {}\n" },
});
try {
  const runs = [
    ["blocking", blocking, assertSnapshotUnchanged(blocking, () => blocking.run(["--format", "envelope"]))],
    ["unverified", unverified, assertSnapshotUnchanged(unverified, () => unverified.run(["--format", "envelope"]))],
  ];
  assert.equal(runs[0][2].status, 1);
  assert.match(runs[0][2].stdout, /^checker_outputs: code-quality-run\/v1 gate=\S+ exit=1 p0_blocking=1 /m);
  assert.match(runs[0][2].stdout, / unverified=none /);
  assert.equal(runs[1][2].status, 4);
  assert.match(runs[1][2].stdout, /^checker_outputs: code-quality-run\/v1 gate=UNVERIFIED exit=4 p0_blocking=0 unverified=absent-tool /m);
  for (const [, , run] of runs) {
    assert.match(run.stdout, /^verification_handoff: workflow-verify\.md$/m);
    assert.equal((run.stdout.match(/^.*: PENDING_AGENT_JUDGMENT$/gm) || []).length, 3);
  }
  for (const [name, , run] of runs) {
    for (const line of run.stdout.split("\n")) {
      if (/^(status|checker_outputs|p0_p1_p2_decisions|accepted_deferrals|verification_handoff|remaining_accepted_risk):/.test(line)) console.log(name + " " + line);
    }
    console.log(name + " exit " + run.status);
  }
} finally {
  blocking.cleanup();
  unverified.cleanup();
}
' "$LABEL"
echo "exit $?"
```

5. `for p in references/runner-contract.md ../shared/references/workflow-verify.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints the workflow reference line that reads `checker_outputs` with its `gate` and `unverified` values and reads any field that still says `PENDING_AGENT_JUDGMENT`. Step 2 prints the five gate rows, and the row for exit 1 names the blocking gate. Step 3 prints the envelope keys, including `verification_handoff: workflow-verify.md`. Step 4 prints, for each envelope, the `status` line, the `checker_outputs` line, the three judgment lines, the `verification_handoff` line and an exit line, each prefixed with the envelope name. The blocking block's `checker_outputs` line reads `gate=` followed by the exit-1 gate name from step 2, with `exit=1`, `p0_blocking=1` and `unverified=none`. The unverified block's line reads `gate=UNVERIFIED`, `exit=4`, `p0_blocking=0` and `unverified=absent-tool`. The exit lines read `blocking exit 1` and `unverified exit 4`. The command exits 0. Step 5 prints `OK` for all three paths.

| Envelope | Fields the reader reads | Reader decision |
| --- | --- | --- |
| blocking, as CQ-002 records it | `gate=` the exit-1 name from step 2, `exit=1`, `p0_blocking=1`, `unverified=none` | Hand the claim back to `sk-code-quality`, which is the 3 to 1.5 transition, and run no verification command over the change |
| unverified, as CQ-006 records it | `gate=UNVERIFIED`, `exit=4`, `p0_blocking=0`, `unverified=absent-tool` | Prove `absent-tool` with the verify phase's own command, or report the id open. Never record a pass |
| both | `verification_handoff: workflow-verify.md` | Confirms the verify workflow is the reader for the claim |
| both | three fields reading `PENDING_AGENT_JUDGMENT` | Open work until the acting agent replaces each one |
| both | `status: advisory` | The envelope carries no pass value |

### Evidence

Command transcript from steps 1 to 5, the reader rule line from step 1, the exit-code rows from step 2, the envelope keys from step 3, the seven reader fields and the exit line for each envelope from step 4, and one written sentence per envelope stating its decision. The two sentences make the round trip visible: the blocking envelope hands the claim back and the unverified envelope carries its id forward as an open claim. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: both envelopes carry every field the reader reads, the blocking envelope exits 1 with no unverified id, the unverified envelope exits 4 and names `absent-tool`, both carry `status: advisory`, the handoff line and three pending judgment fields, and the two decisions match the reader rule.
- **Fail**: a reader field is missing from either envelope, either gate is misread, a pending field is accepted as done, or a pass is recorded for the unverified id.

### Failure Triage

1. If a field is missing, compare the rendered keys with step 3. A renamed key leaves the reader silent rather than loud, so a missing line is the failure to look for.
2. If the blocking envelope does not exit 1, the seeded label did not land on a changed line. Read the seed in step 4 and the changed-line rule in `runner-contract.md` section 5.
3. If the unverified envelope lists no id, the configured check is not required. Confirm the row states severity `P0` and states no `required: false`.
4. If a decision is unclear, reread step 1. The rule is one sentence with three branches, and each branch names its own gate value.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [workflow-verify.md](../../../shared/references/workflow-verify.md) §2 | The reader rule this scenario walks over both envelopes |
| [runner-contract.md](../../references/runner-contract.md) §2, §3 and §4 | The gate and exit table, the verdict fields and the envelope grammar |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The renderer that prints both envelopes |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/envelope-round-trip.md`
