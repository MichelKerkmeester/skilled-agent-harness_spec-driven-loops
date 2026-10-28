---
id: CQ-021
category: quality_gate
title: 'Two checklists at one level that disagree leave the rule unverified'
description: "This scenario validates the same-level rule-conflict path for `CQ-021`. It commits a repository config naming two checklists that answer one rule differently for the same file, then reads `rule_conflicts`, the unverified list, the accepted rows and the envelope entry the conflict adds."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - references/quality-config.md
catalog_applicable: true
version: 1.0.0.0
---

# CQ-021: Two Checklists At One Level That Disagree Leave The Rule Unverified

This document captures the rule-conflict path, execution process, source anchors and metadata for `CQ-021`.

---

## 1. OVERVIEW

This scenario validates the same-level rule-conflict path for `CQ-021`. Precedence is decided per file and per rule. Each checklist takes the highest level of the seats that list it for a file, and the highest level wins. Two rows at that level that give the same action and text agree and both apply. Two rows that differ are listed in `rule_conflicts`, neither applies, and the rule id joins `summary.unverified`, so the gate reads `UNVERIFIED` with exit `4` unless an error or a blocker outranks it. The envelope also carries an `override-conflict` entry naming the rule and both checklists.

The fixture puts both checklists at one level, because a repository config can declare both. One drops the documentation rule and the other replaces it with its own sentence, and one of them also carries a row that does not conflict, so the run shows an applied row beside the refused pair.

### Why This Matters

A conflict is the one case the precedence table cannot settle, and the runner's answer is to keep the default and make the rule an open claim rather than to pick a side. That is a deliberate choice with two failure directions. A runner that picked the first checklist would silently apply half of a rule set its author never agreed to; a runner that applied both would leave a contradiction for the agent to resolve later. The third failure is quieter: a row that conflicts must not keep serving files in its `files` list, because a caller reading `rule_overrides` alone would see a row that applies to nothing.

---

## 2. SCENARIO CONTRACT

Operators confirm that the run reads the gate and exit a conflict produces, that both checklists are named in `rule_conflicts`, that neither conflicting row serves the file, and that the envelope carries the conflict beside the row that did apply.

- Objective: confirm `rule_conflicts`, `summary.unverified`, the `files` list of each `rule_overrides` row, and the envelope's `override-conflict` entry.
- Real user request: `Two house checklists in our repository disagree about doc comments. Run the quality gate and tell me which one wins.`
- Prompt: `Run the quality gate where two checklists in our config disagree on one rule and tell me what it decides.`

**Exact prompt**:

```text
Run the quality gate where two checklists in our config disagree on one rule and tell me what it decides.
```

- Fixture: one temporary git repository outside the working tree whose committed quality config declares two checklists, both selected by the `.js` extension, so both reach the same file.

| Checklist | Its `## Rule overrides` rows | What the run must say |
| --- | --- | --- |
| `<fixture>/docs/house-a.md` | the documentation rule set to `none`, and the hygiene issue rule set to `none` | listed as an override for the hygiene rule, and set aside for the documentation rule |
| `<fixture>/docs/house-b.md` | the documentation rule set to `replace: <one sentence>` | set aside for the documentation rule |
| the conflict | one rule, two actions, one file | `rule_conflicts` names `floor.documentation` with both files and the scoped file, and `summary.unverified` holds the rule id |

- Expected execution process: the operator reads the precedence rule and the envelope grammar, builds the repository, runs the gate in JSON and in envelope form, and reads `rule_conflicts`, `rule_overrides` and the decisions line. The operator then asks the resolver for the same file, which lists the same conflict. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: `gate=UNVERIFIED` with exit `4`; `summary.unverified` holding `floor.documentation`; one conflict row naming both checklists and the one scoped file; the two conflicting rows carrying an empty `files` list while the hygiene row lists the scoped file; and an envelope decisions line holding the applied override, then the `override-conflict` entry, then the marker.
- Desired user-visible outcome: the author sees which rule the repository has not decided, fixes one of the two rows, and never gets a verdict that silently honoured one checklist over the other.
- Pass/fail: PASS if every value in the expected-result table below holds and every snapshot check passes. FAIL if the conflict is missing from either form, a conflicting row serves the file, the gate reads clean, or a snapshot check throws.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate where two checklists in our config disagree on one rule and tell me what it decides.`

### Commands

Run the commands from the repository root.

1. `sed -n '/^## 3\. VERDICT SCHEMA/,/^## 4\. ENVELOPE GRAMMAR/p' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
2. `sed -n '/^## 2\. THE SECTION AND ITS ROWS/,/^## 3\./p' .skilled/skills/sk-code/shared/references/universal/rule-overrides.md`
3. Build the repository, run both forms and read the conflict, the rows and the decisions line.

```bash
node -e '
const assert = require("node:assert/strict");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const CONFIG = ".skilled/skills/sk-code/sk-code-quality/repository/quality.json";
const A = "# House A\n\n## Rule overrides\n\n| Rule | Action | Reason |\n| --- | --- | --- |\n"
  + "| `floor.documentation` | none | This team keeps no doc comments |\n"
  + "| `hygiene.issue` | none | Tracker references are normal here |\n";
const B = "# House B\n\n## Rule overrides\n\n| Rule | Action | Reason |\n| --- | --- | --- |\n"
  + "| `floor.documentation` | replace: every function carries a one-line purpose comment | This team requires one |\n";

// Two checklists the same repository config declares sit at one precedence level, so a rule they
// answer differently keeps its default and becomes an open claim.
const repo = buildRepo({
  base: {
    [CONFIG]: JSON.stringify({ schemaVersion: 1, checklists: [
      { file: "docs/house-a.md", extensions: [".js"], why: "house A" },
      { file: "docs/house-b.md", extensions: [".js"], why: "house B" },
    ] }, null, 2) + "\n",
    "docs/house-a.md": A,
    "docs/house-b.md": B,
  },
  change: { "src/app.js": "export const a = 1;\n" },
});
try {
  const run = assertSnapshotUnchanged(repo, () => ({ json: repo.run(["--format", "json"]), envelope: repo.run(["--format", "envelope"]) }));
  const verdict = run.json.verdict;
  assert.equal(verdict.gate, "UNVERIFIED");
  console.log("gate=" + verdict.gate + " exit=" + run.json.status + " unverified=" + verdict.summary.unverified.join(","));
  for (const entry of verdict.rule_conflicts) {
    console.log("conflict=" + entry.id + " files=" + entry.files.join(",") + " scope=" + entry.scope.join(","));
  }
  for (const entry of verdict.rule_overrides) {
    console.log("override=" + entry.id + " " + entry.action + " from " + entry.file + " applies-to=" + (entry.files.join(",") || "none"));
  }
  console.log(run.envelope.stdout.split("\n").find((line) => line.startsWith("p0_p1_p2_decisions:")));
  const explain = assertSnapshotUnchanged(repo, () => repo.run(["--explain", "src/app.js"]));
  console.log("explain exit=" + explain.status + " conflicts=" + explain.verdict.rule_conflicts.map((entry) => entry.id).join(","));
} finally { repo.cleanup(); }
'
```

4. `for p in references/runner-contract.md references/quality-config.md ../shared/references/universal/rule-overrides.md; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints `rule_overrides`, `rule_conflicts` and the precedence paragraph. Step 2 prints the section format, the three columns and the `replace:` action. Step 3 prints:

```text
gate=UNVERIFIED exit=4 unverified=floor.documentation
conflict=floor.documentation files=docs/house-a.md,docs/house-b.md scope=src/app.js
override=floor.documentation none from docs/house-a.md applies-to=none
override=hygiene.issue none from docs/house-a.md applies-to=src/app.js
override=floor.documentation replace from docs/house-b.md applies-to=none
p0_p1_p2_decisions: override hygiene.issue none from docs/house-a.md, override-conflict floor.documentation docs/house-a.md docs/house-b.md, PENDING_AGENT_JUDGMENT
explain exit=2 conflicts=floor.documentation
```

Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` and exit | `UNVERIFIED` and `4` |
| `summary.unverified` | `floor.documentation` |
| `rule_conflicts` | one row for `floor.documentation`, `files` both checklists, `scope` the one scoped file |
| conflicting rows | each reads `applies-to=none` |
| non-conflicting row | the `hygiene.issue` row from the A checklist, with the one scoped file in its `files` list |
| envelope decisions line | the applied override, then `override-conflict floor.documentation docs/house-a.md docs/house-b.md`, then the marker |
| `--explain` | exit `2`, `rule_conflicts` naming `floor.documentation` |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the gate line, the conflict row, the three override rows, the decisions line, the explain line and the three `OK` lines. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the run reads `UNVERIFIED` with the rule id in `summary.unverified`, one conflict names both checklists and the scoped file, both conflicting rows serve no file, the applied row serves the scoped file, and the envelope carries the `override-conflict` entry.
- **Fail**: the gate reads clean, the conflict is missing from the verdict or the explanation, a conflicting row serves the file, or a snapshot check throws.

### Failure Triage

1. If no conflict is reported, the two rows did not reach the same level. A row a surface declares in `mode-registry.json` or in an outside skill's metadata ranks above a repository checklist, so only two repository-level rows conflict.
2. If `rule_conflicts` is empty and `config.errors` holds `CONFIG_INVALID`, one section was refused, and a refused section takes no part in a conflict. Read the message for the line and the reason.
3. If a conflicting row still lists the file in `files`, the precedence pass applied it before the conflict was noticed. Record the row as found and route the defect to the phase that owns the override pass.
4. If the envelope carries the conflict but not the applied row, the applied row was not accepted. Confirm the hygiene row sits in a checklist the run loaded and is not refused.
5. If the explanation reports no conflict while the run does, the named file differs from the scoped file. The explanation resolves only the paths it is given.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`rule-overrides-and-hygiene-policy.md`](../../../feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md) | The feature catalog entry that names the same-level conflict and `rule_overrides` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [runner-contract.md](../../references/runner-contract.md) §3 | The `rule_overrides`, `rule_conflicts` and explain fields, and the precedence rule |
| [runner-contract.md](../../references/runner-contract.md) §4 | The `override-conflict` entry in the decisions line |
| [rule-overrides.md](../../../shared/references/universal/rule-overrides.md) §2 | The section format, the actions and the refused rows |
| [quality-config.md](../../references/quality-config.md) §3 | The `checklists[]` rows the fixture declares |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The override pass that records the conflict |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-021
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/rule-override-conflict.md`
