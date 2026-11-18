---
title: "Tasks: Python Scorer Strip Parity"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "python scorer strip parity tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Python Scorer Strip Parity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`A` is `.skilled/skills/system-skill-advisor/runtime/`. `PH` is this phase folder, `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity/`, and `PH6` is its sibling `006-strip-rule-boundary-edges/`. `POLICY`, `PARITY`, `CAPTURE` and any other `npx vitest` or `node scripts/` command run from `A`. All remaining commands run from the repository root.
- `PY` is `python3 A/tests/python/test_skill_advisor.py`.
- `POLICY` is `npx vitest run tests/legacy/advisor-prompt-policy.vitest.ts`.
- `PARITY` is `npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts`.
- `CAPTURE` is `node scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs --summary`.
- `LOCAL` is the force-local command in `spec.md` Measured Behavior, which runs the CLI's local scorer path on the phase 002 probe.

**Who runs what.** Luna leaves write T004, T005, T007, T013 and T014, one file each, with the literal text from `plan.md` section 3. The conductor runs every other task: the baselines, the red runs, the probe, the build, the ledger capture, the parity runs, comment hygiene, the refutation pass, the summary and strict validation. The ledger is never hand-edited.

Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the marker rule phase 006 shipped (`../006-strip-rule-boundary-edges/implementation-summary.md`). Verify: `rg -n 'Marker rule' PH6/implementation-summary.md` prints one line naming first-marker or last-marker, and `grep -c '^- \[ \] T[0-9]' PH6/tasks.md` prints 0.
- [ ] T002 Re-read the Python entry before editing (`A/scripts/skill_advisor.py`). Verify: `sed -n 4787,4797p A/scripts/skill_advisor.py` shows `def analyze_request`, `if not prompt:`, `return []` and `prompt_lower = prompt.lower()`.
- [ ] T003 Record the baselines (`A/tests/python/`, `A/tests/parity/`). Verify: `PY` exits 0 and prints `Summary: pass=<n>, fail=0`, `PARITY` exits 0 and prints its file and test counts, and `LOCAL` prints `sk-doc` first.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Append the six parity rows in `plan.md` section 3 to the shared fixture, each `expected` copied from the JavaScript lines in `spec.md` Measured Behavior (`A/tests/fixtures/pasted-reply-strip-cases.json`). Verify: `node -e 'const f=require("./A/tests/fixtures/pasted-reply-strip-cases.json");console.log(f.cases.length,new Set(f.cases.map(c=>c.id)).size)'` from the repository root prints `23 23`.
- [ ] T005 [P] Add `test_pasted_reply_strip_parity` and call it in `main` after `test_declared_phrase_specificity()` (`A/tests/python/test_skill_advisor.py`). Verify: `rg -c 'test_pasted_reply_strip_parity' A/tests/python/test_skill_advisor.py` prints 2.
- [ ] T006 Prove the expectations against the native rule, then run the Python test red (`A/tests/legacy/advisor-prompt-policy.vitest.ts`, `A/tests/python/test_skill_advisor.py`). Verify: `POLICY` exits 0 on all 23 rows, and `PY` exits 1 with a `FAIL: STRIP-` line for every fixture id, a failing entry check and no other `FAIL:` line.
- [ ] T007 Port the rule above `def analyze_request` with the marker line T001 named, and add `prompt = strip_leading_pasted_reply(prompt)` after the empty check (`A/scripts/skill_advisor.py`). Verify: `PY` exits 0 and prints `pass=` equal to the T003 count plus 24, and `LOCAL` prints `sk-code` first.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Rebuild, because the capture script scores TypeScript through `dist/` (`A/dist/`). Verify: `npm --prefix A run build` exits 0.
- [ ] T009 Run the parity suites red on the moved pins (`A/tests/parity/`, `A/tests/legacy/advisor-corpus-parity.vitest.ts`). Verify: `PARITY` fails only on ratchet tests whose message names `rr-paste-208` alone and on the count pins at `python-ts-parity.vitest.ts:269` and `:274` and `advisor-corpus-parity.vitest.ts:178` and `:179`. Record each received value. Any other failure stops the phase.
- [ ] T010 Dry-run the ledger capture (`A/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs`). Verify: `CAPTURE` prints `"added":[]`, `"resolved":["rr-paste-208"]` and `"changed":[]`.
- [ ] T011 Write the ledger through the script (`A/tests/parity/fixtures/local-native-approved-divergences.json`). Verify: `CAPTURE` with `--write` added exits 0, `rg -c rr-paste-208 A/tests/parity/fixtures/local-native-approved-divergences.json` prints nothing and exits 1, and `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` exits 0.
- [ ] T012 Check each received count from T009 is one above its pin and the regression list did not change (`A/tests/parity/python-ts-parity.vitest.ts`, `A/tests/legacy/advisor-corpus-parity.vitest.ts`). Verify: the T009 output shows `pythonCorrect` and the preserved count each at pin plus 1 and no new id in the regression list. Otherwise stop and record the rows in `implementation-summary.md`.
- [ ] T013 [P] Set the two pins in `python-ts-parity.vitest.ts` to the T009 values and add one history comment line (`A/tests/parity/python-ts-parity.vitest.ts`). Verify: `npx vitest run tests/parity/python-ts-parity.vitest.ts` exits 0.
- [ ] T014 [P] Set the two pins in `advisor-corpus-parity.vitest.ts` to the T009 values and add one history comment line (`A/tests/legacy/advisor-corpus-parity.vitest.ts`). Verify: `npx vitest run tests/legacy/advisor-corpus-parity.vitest.ts` exits 0.
- [ ] T015 Run every gate this phase touches and confirm refutation finding 6 (`A/tests/`). Verify: `npx vitest run tests/parity` exits 0, `PARITY` exits 0, `npx vitest run tests/handlers/advisor-validate.vitest.ts` exits 0 and `PY` exits 0. The summary cites the strip as the first statement in `analyze_request` and `fusion.ts:1277`.
- [ ] T016 Check comment hygiene in the changed code (`A/scripts/`, `A/tests/`). Verify: `git diff --stat -- A/scripts A/tests` lists this phase's changed files, and `git diff -U0 -- A/scripts A/tests | rg -n '^\+.*(N3|R[0-9]|016-|phase 0|finding)'` prints nothing and exits 1.
- [ ] T017 Run one read-only Luna refutation pass over this phase's diff and check each finding (`implementation-summary.md`, Verification). Verify: `rg -n 'Refutation pass' PH/implementation-summary.md` prints one line with a verdict per finding.
- [ ] T018 Record the files, the marker variant, the parity rows, the moved pins and the ledger summary (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh PH --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `PY` and `npx vitest run tests/parity` both exit 0, and the ledger holds no `rr-paste-208`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Strip rule and fixture**: `../006-strip-rule-boundary-edges/plan.md` section 3
- **Refutation finding 6**: `tmp/p002-briefs/out/last-refute.txt` at the repository root
<!-- /ANCHOR:cross-refs -->

---
