---
title: "VIB-HR-002 -- Hard-rule sidecar integrity"
description: "This scenario validates that the Vibe hard-rule sidecar parses and still carries the six fail-closed rule ids at error severity."
version: 1.0.0.0
---

# VIB-HR-002 -- Hard-rule sidecar integrity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-HR-002`.

---

## 1. OVERVIEW

This scenario validates the sidecar the dispatch preflight reads. It focuses on the file's shape: six rules, the expected ids and a blocking severity on every one.

### Why This Matters

The preflight reads `hard-rules.json` beside the skill, not a copy. A malformed file or a renamed id silently changes what the gate enforces, and a rule downgraded from `error` stops blocking while the dispatch still looks guarded. The suite in `VIB-HR-001` catches a missing check; this scenario catches a sidecar that no longer states the contract the suite is written against.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the sidecar parses and carries the six rule ids at `error` severity.
- Real user request: `Check that the Vibe hard-rule sidecar still parses and still carries the six fail-closed rules at blocking severity.`
- Prompt: `Read the Vibe hard-rule sidecar, print its rule count, its ids and its severities, and stop if any rule is missing or no longer blocking.`
- Expected execution process: Read the sidecar with `node` -> print the count, the ids and the distinct severities -> compare with the six ids the skill names.
- Expected signals: The command exits `0`. `count=6`. The ids are `print-mode-only`, `isolated-vibe-home`, `output-dir-required`, `vibe-closed-roster`, `no-repo-root-cwd` and `stdin-redirect-required`. `severities=error`.
- Evidence: The command transcript with the count, the id list and the severity list.
- Desired user-visible outcome: A clear statement that the sidecar parses and still states all six rules as blocking.
- Pass/fail: PASS if the count is `6`, all six ids are present and every severity is `error`. FAIL if the file does not parse, an id is missing or renamed, the count differs, or any severity is not `error`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the reader from the repository root.
2. Compare the printed ids with the six names in [SKILL.md](../../SKILL.md) section 4.
3. Read the distinct severity list.
4. Read the exit code.

### Commands

```bash
node -e 'const r=require("./.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json"); console.log("count="+r.length); console.log("ids="+r.map(x=>x.id).join(",")); console.log("severities="+[...new Set(r.map(x=>x.severity))].join(","));'
```

### Recorded Result

- Verdict: `PASS`.
- Date: 2026-11-14.
- Observed: the command exited `0` and printed `count=6`.
- Observed: `ids=print-mode-only,isolated-vibe-home,output-dir-required,vibe-closed-roster,no-repo-root-cwd,stdin-redirect-required`.
- Observed: `severities=error`.
- Note: the sidecar is read by the preflight and by the suite; this scenario checks the file, and `VIB-HR-001` checks that each id has an implemented check.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HR-002 | Hard-rule sidecar integrity | Prove the sidecar parses with six blocking rules | `Read the Vibe hard-rule sidecar, print its rule count, its ids and its severities, and stop if any rule is missing or no longer blocking.` | 1. `node -e '...'` reads `hard-rules.json` and prints the count, ids and severities -> 2. compare the ids with the six in `SKILL.md` -> 3. read the exit code | Step 1: exit `0`, `count=6`, the six ids, `severities=error` | The command transcript with the count, the id list and the severity list | PASS if the count is `6`, all six ids are present and every severity is `error`. FAIL otherwise | 1. Read the parse error when the file does not load. 2. Compare the id list with `SKILL.md` section 4. 3. Confirm no rule was downgraded from `error` |

### Failure Triage

1. If the file does not parse, read the thrown error and repair the JSON syntax.
2. If an id is missing or renamed, compare the list with the six names in [SKILL.md](../../SKILL.md) section 4 and with the checks the suite names.
3. If a severity is not `error`, treat the rule as non-blocking and restore the severity before any dispatch.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and the hard-rule boundary |
| [SKILL.md](../../SKILL.md) | The six rule ids and the fail-closed policy |
| [hard-rules.json](../../hard-rules.json) | The sidecar this scenario reads |
| [cli-reference.md](../../references/cli-reference.md) | The flags each rule constrains |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json` | The sidecar under test |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | The evaluator that reads the sidecar and implements each check |

---

## 5. SOURCE METADATA

- Group: Hard Rules
- Playbook ID: VIB-HR-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hard-rules/hard-rule-sidecar-integrity.md`
