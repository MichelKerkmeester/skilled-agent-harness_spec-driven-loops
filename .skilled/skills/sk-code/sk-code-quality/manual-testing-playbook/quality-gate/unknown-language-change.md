---
id: CQ-003
category: quality_gate
title: 'A change with no checkable file reports nothing checked'
description: "This scenario validates the gate run for `CQ-003`. It replays fixture F05, a change that holds one language with no comment family and one binary file, and confirms the gate reports `NOTHING_CHECKED` with each file listed as unchecked rather than clean."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
  - assets/comment-syntax.json
version: 1.1.3.0
---

# CQ-003: A Change With No Checkable File Reports Nothing Checked

This document captures the run contract, execution process, source anchors and metadata for `CQ-003`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-003`. Fixture F05 seeds two files. `main.zig` is a language the comment table does not list, so it has no comment family and no language check reads it. `blob.js` is a `.js` name whose first bytes hold a NUL byte, so it is binary and no language check reads it either. Both files are still readable, so the conflict, secret and debug sensors scan them. Neither file counts as checked, and the run reports `NOTHING_CHECKED` with exit 2.

### Why This Matters

`NOTHING_CHECKED` is the state that separates "no blocker" from "no evidence". An author who reads exit 2 as a pass claims a gate that never ran, which is the exact failure the honest gate exists to prevent. This scenario pins the unchecked reasons, so a reader learns which file fell out of scope and why, and it pins the rule that a sensors-only scan never counts a file as checked.

---

## 2. SCENARIO CONTRACT

Operators confirm that a change with no checkable file returns `NOTHING_CHECKED`, that both files are listed as unchecked with their reason, and that nothing in the run reads as clean.

- Objective: confirm the gate value, the exit code, the empty finding list and the two unchecked rows for fixture F05.
- Real user request: `I added a Zig file and a small binary blob to a JavaScript repository. Tell me whether the quality gate passed.`
- Prompt: `Run the quality gate on this change and tell me whether it passed.`

**Exact prompt**:

```text
Run the quality gate on this change and tell me whether it passed.
```

- Fixture: F05, built in a temporary git repository outside the working tree.

| File | Seeded content | What the gate must say |
| --- | --- | --- |
| `main.zig` | a Zig source line, a language the comment table does not list | unchecked, reason `no comment family` |
| `blob.js` | a `.js` name whose first bytes hold a NUL byte | unchecked, reason `binary` |

- Expected execution process: the operator builds F05 in a temporary repository, runs `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --worktree --format json` inside that repository, and reads `gate`, `exit_code` and `coverage`. The snapshot of the fixture folder is compared before and after the run, and the run must leave it unchanged.
- Expected signals: `gate` is `NOTHING_CHECKED`, `exit_code` is `2`, `findings` is empty, `coverage.files_checked` is `0` and `coverage.unchecked` holds the two rows in file order.
- Desired user-visible outcome: the answer names the two files and their reasons and never says the gate passed. The author either drops the change from the claim or adds a checkable file to it.
- Pass/fail: PASS if every value in the expected-result table below holds, the two unchecked rows carry the reasons shown, and the fixture snapshot is unchanged. FAIL if the gate reads `NO_BLOCKER_FOUND`, if a file is missing from `coverage.unchecked`, or if any part of the run reads as clean.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on this change and tell me whether it passed.`

### Commands

1. `node --test --test-reporter=tap --test-name-pattern='^F05' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
2. `sed -n "/^test('F05/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
3. `for p in references/runner-contract.md scripts/quality-gate.cjs assets/comment-syntax.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays F05 and prints `# pass 1` then `# fail 0`. Step 2 shows the Zig line, the binary blob and the `withRepo` call that keeps the fixture in a temporary repository. Step 3 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` | `NOTHING_CHECKED` |
| `exit_code` | `2` |
| `findings` | `[]` |
| `coverage.files_checked` | `0` |
| `coverage.unchecked` | `[{ file: "blob.js", reason: "binary" }, { file: "main.zig", reason: "no comment family" }]` |
| `summary.p0_blocking` | `0` |
| fixture snapshot after the run | unchanged |

### Evidence

Command transcript from steps 1 to 3, the frontmatter block with `expected_intent: QUALITY`, the `coverage` excerpt and the gate line. Save the transcript under the dated run label the playbook names. The transcript must not contain a passing claim.

### Pass / Fail

- **Pass**: the gate is `NOTHING_CHECKED`, exit is `2`, no finding exists, both files are listed with the reasons shown, and the fixture snapshot is unchanged.
- **Fail**: any other gate or exit, a missing or differently reasoned unchecked row, a non-empty finding list, or any wording that calls the run clean.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see the assertion that failed.
2. If `main.zig` is missing from `coverage.unchecked`, read the `languages` block of `assets/comment-syntax.json` to confirm the extension is still absent. A newly declared extension moves the file into scope and changes the expected gate.
3. If `blob.js` reads `no comment family` instead of `binary`, the size and NUL checks ran after the language lookup in the wrong order. Record the row as found and route the defect to the phase that owns the runner.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | Surface routing that leaves a foreign change on the universal floor |
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The F05 case this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §2 and §3 | The `NOTHING_CHECKED` gate value and the `coverage.unchecked` reasons |
| [comment-syntax.json](../../assets/comment-syntax.json) | The language and extension table that decides whether a comment family exists |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/unknown-language-change.md`
