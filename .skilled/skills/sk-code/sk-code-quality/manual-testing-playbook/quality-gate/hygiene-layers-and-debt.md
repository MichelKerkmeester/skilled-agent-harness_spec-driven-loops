---
id: CQ-017
category: quality_gate
title: 'An unblocked hygiene layer leaves a touched-file label as debt'
description: "This scenario validates the hygiene enforcement layers for `CQ-017`. It builds the same change twice, once with a pre-commit hook that names the checker and once with no hook, and confirms the `layers` field, the severity and origin of the one finding, and the two summaries that decide whether it blocks."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
  - scripts/check-comment-hygiene.sh
catalog_applicable: true
version: 1.0.0.0
---

# CQ-017: An Unblocked Hygiene Layer Leaves A Touched-File Label As Debt

This document captures the layer rule, execution process, source anchors and metadata for `CQ-017`.

---

## 1. OVERVIEW

This scenario validates the enforcement-layer rule for `CQ-017`. The runner probes three layers on every run and reports each one in `layers` as `present`, `absent`, `untrusted`, `broken` or `unknown`. The pre-commit probe reads the hook folder git resolves, strips shell comments, looks for a path ending in `check-comment-hygiene.sh`, and reads `present` only when the hook is executable and the checker it names is a runnable file.

That field decides one finding's severity. A hygiene finding on a changed line always blocks. A hygiene finding on an unchanged line of a touched file is debt the change did not write, so it reads P1 and lands in `summary.touched_file_debt` — unless the pre-commit or CI layer reads `present`, because that layer scans whole files and would fail the commit anyway. Then the finding blocks as P0, and its reason names the layer.

The scenario holds the file, the comment and the change fixed and moves only the hook, so the two runs differ in nothing else. A change to the probe, or to that rule, shows up as a changed verdict rather than as a silent widening of what blocks.

### Why This Matters

The rule is the difference between blaming an author for a comment the change never touched and letting a whole-file gate pass a line it would reject at commit time. Both mistakes are expensive. A gate that blocks on untouched debt teaches authors to route around it, and a gate that ignores the layer promises a commit that the hook will refuse minutes later. Because the sampled fixtures of this playbook read every layer `absent`, nothing else in the corpus can see this rule at all.

---

## 2. SCENARIO CONTRACT

Operators confirm that a wired pre-commit hook reads `present` and turns the touched-file label into a blocking P0, and that the same change with no hook reads `absent` and leaves the label as P1 debt.

- Objective: confirm the `layers` field, the finding's severity, origin and reason, and the two summaries for the wired and the bare fixture.
- Real user request: `My change touches a file whose older comment carries an architecture number. Does the quality gate hold me responsible for it?`
- Prompt: `Run the quality gate on my change and tell me whether the older comment in that file blocks me.`

**Exact prompt**:

```text
Run the quality gate on my change and tell me whether the older comment in that file blocks me.
```

- Fixture: two temporary git repositories outside the working tree, built from the fixture builder the runner suite uses. Both commit a file whose first line carries a labelled comment, then change a later line, so the label sits on an unchanged line of a touched file. One repository also carries a pre-commit hook naming the checker, with a runnable stand-in at the path the hook names; the other carries no hook.

| Fixture part | Content | What the run must say |
| --- | --- | --- |
| the file | one labelled comment on line 1, then an added line | one `hygiene` finding with origin `touched-file` on line 1 |
| hook, wired fixture | `<fixture>/.git/hooks/pre-commit`, executable, running the checker the fixture also writes and marks executable | `layers.pre_commit_hygiene` reads `present` |
| hook, bare fixture | none | `layers.pre_commit_hygiene` reads `absent` |
| wired finding | the same finding after the layer rule | severity `P0`, blocking, reason ending `blocking because the pre-commit hook scans whole files` |
| bare finding | the same finding after the layer rule | severity `P1`, not blocking, `summary.touched_file_debt` `1` |

- Expected execution process: the operator reads the exit-code table, the check-state table and the layer rule in the runner contract, builds both repositories, runs the gate in both and reads the `layers` field, the finding and the two summaries. The wired fixture is also rendered in text form, where the same three layer states print on one line. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: the wired run reads `layers=pc:present,ci:absent,pe:absent`, exits `1`, carries one P0 blocking finding with origin `touched-file`, and reads `p0_blocking=1 touched_file_debt=0`. The bare run reads `layers=pc:absent,ci:absent,pe:absent`, exits `0`, carries one P1 non-blocking finding, and reads `p0_blocking=0 touched_file_debt=1`. The text form prints `layers: pre-commit present, ci absent, post-edit absent`.
- Desired user-visible outcome: the author learns whether the commit will be refused, and the older comment is either fixed or reported as debt rather than as a blocker the change caused.
- Pass/fail: PASS if every value in the expected-result table below holds and both snapshot checks pass. FAIL if either layer state differs, the wired finding does not block, the bare finding blocks, or the summaries disagree with the findings.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on my change and tell me whether the older comment in that file blocks me.`

### Commands

Run the commands from the repository root.

1. `sed -n '/^## 2\. EXIT CODES AND STATES/,/^## 3\. VERDICT SCHEMA/p' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
2. Build both fixtures, run the gate on each and read the layers, the finding and the summaries.

```bash
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const LABEL = ["ADR", "12"].join("-");
const CHECKER = ".skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh";
const HOOK = "#!/bin/sh\nexec \"$(git rev-parse --show-toplevel)/" + CHECKER + "\" --json -- \"$@\"\n";
const base = { "app.js": "// see " + LABEL + "\nexport const a = 1;\n" };
const change = { "app.js": "// see " + LABEL + "\nexport const a = 1;\nexport const b = 2;\n" };

// The layer probe reads the hook text and the execute bit of the checker it names, so a
// stand-in script at that path is enough to make the layer read present.
function wire(repo) {
  fs.mkdirSync(path.dirname(path.join(repo.root, CHECKER)), { recursive: true });
  fs.writeFileSync(path.join(repo.root, CHECKER), "#!/bin/sh\nexit 0\n", { mode: 0o755 });
  fs.writeFileSync(path.join(repo.root, ".git", "hooks", "pre-commit"), HOOK, { mode: 0o755 });
}
const wired = buildRepo({ base, change });
const bare = buildRepo({ base, change });
try {
  wire(wired);
  for (const [name, repo] of [["wired", wired], ["bare", bare]]) {
    const run = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json"]));
    const verdict = run.verdict;
    const finding = verdict.findings.find((entry) => entry.rule === "hygiene.adr");
    console.log(name + " layers=pc:" + verdict.layers.pre_commit_hygiene + ",ci:" + verdict.layers.ci_hygiene + ",pe:" + verdict.layers.post_edit
      + " exit=" + run.status);
    console.log("  " + finding.severity + " " + finding.origin + " blocking=" + finding.blocking + " " + finding.reason);
    console.log("  p0_blocking=" + verdict.summary.p0_blocking + " touched_file_debt=" + verdict.summary.touched_file_debt);
  }
  const text = assertSnapshotUnchanged(wired, () => wired.run(["--format", "text"]));
  console.log("text " + text.stdout.split("\n").find((line) => line.startsWith("layers: ")));
} finally {
  wired.cleanup(); bare.cleanup();
}
'
```

3. `for p in references/runner-contract.md scripts/quality-gate.cjs scripts/check-comment-hygiene.sh; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints the five gate rows, the ten check states and the five layer states, and the rule that a touched-file hygiene finding blocks only when the pre-commit or CI layer is `present`. Step 2 prints one block per repository, then the text-form layer line:

```text
wired layers=pc:present,ci:absent,pe:absent exit=1
  P0 touched-file blocking=true ADR reference, blocking because the pre-commit hook scans whole files
  p0_blocking=1 touched_file_debt=0
bare layers=pc:absent,ci:absent,pe:absent exit=0
  P1 touched-file blocking=false ADR reference
  p0_blocking=0 touched_file_debt=1
text layers: pre-commit present, ci absent, post-edit absent
```

Step 3 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| wired `layers.pre_commit_hygiene` | `present` |
| wired exit | `1`, the blocking value in the runner contract gate table |
| wired finding | severity `P0`, origin `touched-file`, blocking, reason ending `blocking because the pre-commit hook scans whole files` |
| wired `summary` | `p0_blocking=1` and `touched_file_debt=0` |
| bare `layers.pre_commit_hygiene` | `absent` |
| bare exit | `0` |
| bare finding | severity `P1`, origin `touched-file`, not blocking |
| bare `summary` | `p0_blocking=0` and `touched_file_debt=1` |
| both, `ci_hygiene` and `post_edit` | `absent` |
| text form | `layers: pre-commit present, ci absent, post-edit absent` |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 3, the frontmatter block with `expected_intent: QUALITY`, the two layer lines, both findings quoted with severity, origin and reason, the two summary lines, the text-form layer line and the three `OK` lines. Save the transcript under the dated run label the playbook names. Never paste the seeded label into a tracked document; the run folder holds the transcript.

### Pass / Fail

- **Pass**: the wired run reads `present`, exits `1` and blocks the touched-file finding with the layer named in its reason; the bare run reads `absent`, exits `0` and counts the same finding as `touched_file_debt`; both snapshot checks pass.
- **Fail**: either layer state differs, the wired finding does not block, the bare finding blocks, a summary disagrees with its findings, or a snapshot check throws.

### Failure Triage

1. If the wired layer reads `absent`, the hook text holds no path ending in `check-comment-hygiene.sh` after shell comments are stripped. A hook that only mentions the checker in a comment reads `absent` on purpose.
2. If the wired layer reads `broken`, the hook is not executable or the checker path it names is not a runnable regular file. Confirm both under the fixture root before reading the finding.
3. If `ci_hygiene` reads `present`, the fixture carries a workflow naming the checker. The gate reads `.github/workflows/*.yml` and `*.yaml`, and either layer lends the same whole-file authority.
4. If the bare finding still blocks, the label sat on a changed line rather than an unchanged one. Compare the seeded base and change: the label must be committed before the change.
5. If a run reads `NOTHING_CHECKED`, the changed file had no checkable language. `app.js` is checked, so read `coverage.unchecked` for the file the run actually saw.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`rule-overrides-and-hygiene-policy.md`](../../../feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md) | The feature catalog entry for the hygiene policy, its layers and the disabled-rule list |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [runner-contract.md](../../references/runner-contract.md) §2 | The layer states, the check states and the gate table |
| [runner-contract.md](../../references/runner-contract.md) §5 | The touched-file rule this scenario exercises |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The three layer probes and the rule that reads them |
| [check-comment-hygiene.sh](../../scripts/check-comment-hygiene.sh) | The checker a hook names to make the pre-commit layer `present` |
| [SKILL.md](../../SKILL.md) §3 | The three enforcement layers and the citation rule for `layers` |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-017
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/hygiene-layers-and-debt.md`
