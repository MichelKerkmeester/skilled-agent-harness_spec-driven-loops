---
id: OC-008
category: authoring_verification
title: 'Verification alignment routing'
description: "This scenario validates VERIFICATION routing for `OC-008`. It confirms a completion-claim/type-check/alignment-drift prompt loads the alignment-verification-automation reference and the drift-guard scripts README, and it runs the guards those two docs describe so their exit statuses are graded rather than assumed."
expected_surface: SKILLED
expected_intent: VERIFICATION
expected_resources:
  - references/shared/alignment-verification-automation.md
  - assets/scripts/README.md
version: 1.0.2.0
---

# OC-008: Verification alignment routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-008`.

---

## 1. OVERVIEW

This scenario validates `VERIFICATION` routing for `OC-008`. It focuses on confirming that the exact prompt
below classifies as `VERIFICATION` and loads the full 2-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §6's machine-readable router. It then runs the guards that resource set
describes, because a verification scenario that only checks that two documents exist grades the pointer and
not the gate.

### Why This Matters

Per `SKILL.md` §3, alignment drift is a verification gate: four drift guards (`verify_alignment_drift.py`, `verify_stack_folders.py`, `verify-router-sync.cjs` and `verify-doc-claims.cjs`) run through `scripts/run-all-drift-guards.sh` before any completion claim, and the wrapper exits 0 only when every leg passes. A verification prompt mis-routed away from `references/shared/alignment-verification-automation.md` could let a completion claim skip that gate entirely; a verification scenario that never executes a guard could not tell a working gate from a deleted one. The wrapper's pass, warn and fail aggregation is covered by its own test, `scripts/tests/run-all-drift-guards.test.cjs`, which drives stub guards in a throwaway tree and asserts the 0 and 1 exit statuses. The wrapper scans the whole hub, so a failure in a sibling packet's playbook fails it too; this scenario therefore grades the legs this packet owns, the wrapper's own aggregation test, and the failure branches the guards document.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-008` classifies as `VERIFICATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `SKILLED`, intent `VERIFICATION`, and every path in
  `expected_resources`.
- Real user request: `Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.`
- Prompt: `Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.`

**Exact prompt**:
```text
Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.
```

- Expected execution process: the hub detects `SKILLED` (work under `.skilled/`), the `VERIFICATION`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-skilled/`, each one documents
  `VERIFICATION` routing per `SKILL.md` §2 or §6, and steps 5-9 return the exit status each one states.
- Desired user-visible outcome: the bundled workflow cites the routed `VERIFICATION` resources as the
  standards evidence and reports guard results it actually ran, not a mismatched language tier and not an
  assumption that the gate passed.
- Pass/fail: PASS if every listed path exists, the frontmatter surface/intent are `SKILLED`/
  `VERIFICATION`, and every guard step returns the status its Expected entry names; FAIL if any listed path
  is missing, the frontmatter disagrees, or a guard step returns an unexpected status.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/authoring-verification/verification-alignment.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-skilled/SKILL.md | grep -F '"VERIFICATION"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-skilled/SKILL.md | sed -n '/"VERIFICATION": \[/,/\],/p'`
4. `for p in references/shared/alignment-verification-automation.md assets/scripts/README.md; do test -e ".skilled/skills/sk-code/sk-code-skilled/$p" && echo "OK $p" || echo "MISS $p"; done`
5. `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root . --check-router; echo "rc=$?"`
6. `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root . --check-router --fail-on-warn; echo "rc=$?"`
7. `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 1a,1b,2; echo "rc=$?"`
8. `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/run-all-drift-guards.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs; echo "rc=$?"`
9. `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --explain .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs; echo "rc=$?"`

### Expected

Step 1 shows `expected_intent: VERIFICATION` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["VERIFICATION"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["VERIFICATION"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

Step 5 prints `[alignment-drift] PASS`, a `Scanned files` / `Findings` / `Errors` / `Warnings` summary, one
`- ... [WARN] ...` line per advisory finding, then the line `Note: warnings are non-blocking by default. Use
--fail-on-warn to make warnings fail.`, and `rc=0`. Step 6 prints the same findings under an
`[alignment-drift] FAIL` header and `rc=1`, because `--fail-on-warn` turns every advisory finding into a gate
failure that step 5 let through. Step 7 prints `PASS check 1a`, `PASS check 1b`, `PASS check 2`, `router-sync:
3/3 checks passed` and `rc=0`. Step 8 prints a `ℹ tests 37` / `ℹ fail 0` summary and `rc=0`, and takes about
twenty seconds because the git-timeout test waits out a wedged `git check-ignore` on purpose. Step 9 prints a
JSON document whose `status` is `advisory` and whose `exit_code` is `2`, then `rc=2`.

### Evidence

Command transcript from steps 1-9, with the exit status of every guard step; the resolved frontmatter block;
the `RESOURCE_MAP["VERIFICATION"]` excerpt; the warning list step 5 and step 6 both print; the router-sync
PASS lines; the test summary line; the `--explain` JSON.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the frontmatter's `expected_intent` matches
  `VERIFICATION`, and each guard step returns the status its Expected entry names: step 5 `rc=0`, step 6
  `rc=1` while step 5 lists a finding and `rc=0` only when it lists none, step 7 `rc=0` with three PASS
  lines, step 8 `rc=0` with `fail 0`, step 9 `rc=2` with `"status": "advisory"`.
- **Fail**: any listed path is missing, the frontmatter intent disagrees with `VERIFICATION`, a guard step
  returns a status other than the one named above, or step 6 returns `rc=0` while step 5 printed at least
  one `[WARN]` finding.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/shared/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["VERIFICATION"]` excerpt to see
   whether the drift is a stale scenario file or a stale `SKILL.md` map.
3. If step 5 reports a `[WARN]` finding against a file this package owns, fix that file rather than
   relaxing the guard; a warning that survives in a sibling packet's tree belongs to that packet and leaves
   step 5 at `rc=0` by design.
4. If step 6 returns `rc=0`, confirm step 5 printed no `[WARN]` line at all: `--fail-on-warn` fails only on
   findings, so a clean tree is the one legitimate zero.
5. If step 7 prints a FAIL line for check 1b, read the named doc: leg 1b fails on any reference or asset doc
   that no router names, and the allowlist it honours covers only the three shared workflow docs.
6. If step 8 fails a test, run that test file alone with `node --test <file>`; each one builds its own
   throwaway tree, so a failure is a real regression rather than shared state.
7. If step 9 returns a status other than `advisory`, read the `unchecked` field in its JSON: a tool the
   quality gate needs is missing from `PATH`, and the advisory status is how it says so.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §6 | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `VERIFICATION` resource set |
| [SKILL.md](../../SKILL.md) §3 | The alignment-drift-is-a-verification-gate rule this scenario's resources enforce |
| [verify_alignment_drift.py](../../assets/scripts/verify_alignment_drift.py) | Guard steps 5 and 6 run; `--check-router` adds the dead-route leg and `--fail-on-warn` gates the advisory findings |
| [verify-router-sync.cjs](../../assets/scripts/verify-router-sync.cjs) | Guard step 7 runs with `--checks 1a,1b,2` |
| [run-all-drift-guards.sh](../../scripts/run-all-drift-guards.sh) | Single completion-gate entry point over all four guards |
| [scripts/tests/](../../scripts/tests/) | The seven test files step 8 runs, including the wrapper's own pass/warn/fail aggregation test |

---

## 5. SOURCE METADATA

- Group: sk-code-skilled routing
- Playbook ID: OC-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `authoring-verification/verification-alignment.md`
