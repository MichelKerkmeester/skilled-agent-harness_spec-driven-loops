---
title: "CLI-002 -- Repository-root dispatch refusal"
description: "This scenario validates that the dispatch hook refuses a dsh run whose working directory is the repository root and accepts the isolated scratch shape for `CLI-002`."
version: 1.0.0.0
---

# CLI-002 -- Repository-root dispatch refusal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CLI-002`.

---

## 1. OVERVIEW

This scenario validates the `no-repo-root-dotenv` refusal and the home isolation rule that backs it. It focuses on the dispatch hook's decision, not on a dsh process.

### Why This Matters

Headless dsh reads API keys from the launch environment, then `<cwd>/.env`, then `$DSH_HOME/.env`. The repository root holds a `.env`, so a run that starts there can load keys outside the environment allowlist. The dispatch hook evaluates the command before any process starts. A refused command is the cheapest proof that the boundary holds.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the dispatch hook refuses both repo-root shapes and accepts the scratch-folder shape with a disposable home.
- Real user request: `Make sure the dispatch hook will not let a DeepSeek Harness run start in the repository root. Show me the rejected command forms and the form that passes, and do not launch dsh.`
- Prompt: `Check that the dispatch hook refuses a DeepSeek Harness command that would start in the repository root. Show me both rejected shapes and the accepted scratch-folder shape, and do not run dsh.`
- Expected execution process: Run the dispatch rule-check suite -> locate the dsh refusal test -> confirm the two `no-repo-root-dotenv` rows assert a refusal -> confirm the complete isolated dispatch asserts no violation -> record the suite counts and exit code.
- Expected signals: The suite exits `0` with 50 passing tests and 0 failures. The `each dsh hard rule refuses its own violating command` test includes two `no-repo-root-dotenv` rows, one with the repo root as the context `cwd` and one with `cd <repo root>` in the command. The `dsh hard rules accept a complete isolated, pipe-fed dispatch` test asserts no violations for the accepted shape.
- Desired user-visible outcome: A clear statement that a repo-root dispatch is refused before launch, with the passing assertion as evidence.
- Pass/fail: PASS if the suite passes and both refusal rows are present and asserted `false`. FAIL if either repo-root shape is accepted, or if the suite reports a failure.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the dispatch rule-check suite from the repository root.
2. Read the test names and the failing-case table in the suite.
3. Confirm the accepted shape and both refused shapes.
4. Record the suite counts and exit code. Do not launch dsh.

### Commands

```bash
node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
grep -n "no-repo-root-dotenv" .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
```

### Recorded Result

- Verdict: `PASS`.
- Observed: the suite exited `0` with 50 tests, 50 pass, 0 fail, 0 skipped.
- The `each dsh hard rule refuses its own violating command` test asserts `false` for both repo-root variants: the full dispatch with no leading `cd` under a repo-root context, and the full dispatch with `cd <repo root> &&` from another context.
- The `dsh hard rules accept a complete isolated, pipe-fed dispatch` test asserts no rule violations for the accepted scratch shape.
- The suite also refuses a `DSH_HOME` inside the checkout, `$PWD`, `$(pwd)` and `$HOME/.dsh`, which closes the adjacent home-isolation gap.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLI-002 | Repository-root dispatch refusal | Prove the hook refuses a repo-root cwd | `Check that the dispatch hook refuses a DeepSeek Harness command that would start in the repository root. Show me both rejected shapes and the accepted scratch-folder shape, and do not run dsh.` | 1. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` -> 2. inspect the `each dsh hard rule refuses its own violating command` test -> 3. inspect the `dsh hard rules accept a complete isolated, pipe-fed dispatch` test | Step 1: exit `0`, 50 pass, 0 fail. Step 2: two `no-repo-root-dotenv` rows assert `false`. Step 3: the complete scratch dispatch asserts no violation | The observed suite transcript with 50 pass and 0 fail, plus the two refusal rows and the accepted-shape assertion in `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | PASS if the suite passes and both refusal rows are present and refused. FAIL if a repo-root shape is accepted or the suite fails | 1. Confirm the suite ran from the repository root and read the exact test names. 2. Check whether a `cd` to a variable bypasses the cwd resolution. 3. Re-read the `no-repo-root-dotenv` implementation before changing a test |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Isolation policy and verdict rules |
| `../../SKILL.md` | The repository-root leak and the scratch-cwd requirement |
| `../../references/cli-reference.md` | Header for the `no-repo-root-dotenv` rule and the dispatch shape |
| `../../hard-rules.json` | `no-repo-root-dotenv` and `dsh-home-isolated` messages |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | `no-repo-root-dotenv` and `dsh-home-isolated` checks |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Accepted shape and both refused repo-root shapes |
| `.dsh/SYNC.md` | The root `.env` warning and the disposable home rule |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CLI-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/repo-root-dispatch-refusal.md`
