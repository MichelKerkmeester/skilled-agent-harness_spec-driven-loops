---
title: "Feature Specification: Python Scorer Strip Parity"
description: "The Python local scorer, which the CLI falls back to when the daemon is unreachable, scores a pasted earlier reply in full and routes on its skill names. This phase ports the final strip rule into the Python scorer's entry, proves parity from the shared case fixture and lets the rr-paste-208 divergence resolve."
trigger_phrases:
  - "python scorer strip parity"
  - "phase 7 python scorer strip parity"
  - "python local scorer pasted reply"
  - "rr-paste-208 divergence"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Python Scorer Strip Parity

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/474-advisor-pasted-context-and-crash-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 13 |
| **Predecessor** | 006-strip-rule-boundary-edges |
| **Successor** | 008-handler-scored-prompt-consumers |
| **Handoff Criteria** | The TypeScript and Python strip tests read one fixture and both pass, the `rr-paste-208` ledger entry is gone through the capture script, and `npx vitest run tests/parity` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the pi-context-decisions refinement packet. It closes Known Limitation 1 of `../002-pasted-context-stripping/implementation-summary.md` and refutation finding 6 in `tmp/p002-briefs/out/last-refute.txt` at the repository root.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

**Scope Boundary**: One Python function at the entry of `analyze_request`, one Python test, six parity rows in the phase 006 fixture, and the ledger and parity pins that move as a result. The TypeScript rule does not change.

**Dependencies**:
- Phase 006's final rule in `runtime/lib/prompt-policy.ts` and its fixture `runtime/tests/fixtures/pasted-reply-strip-cases.json`. The marker rule 006 records in its `implementation-summary.md` decides which Python marker variant lands.

**Deliverables**:
- `strip_leading_pasted_reply` in `runtime/scripts/skill_advisor.py`, called first in `analyze_request`.
- A Python test that reads the shared fixture.
- A ledger without `rr-paste-208`, written by its capture script.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When the daemon is unreachable, `advisor_recommend` falls back to the Python scorer. The chain is `runLocalScorer` (`runtime/skill-advisor-cli.ts:1456-1476`, called at `:1577`), then `runAdvisorSubprocess`, which spawns `skill_advisor.py --threshold <c> --uncertainty <u> --stdin` with the force-local variable set (`runtime/lib/subprocess.ts:352-356`, `runtime/skill-advisor-cli.ts:1461`). Python's `main` then skips the native probe (`runtime/scripts/skill_advisor.py:762-768`) and calls `analyze_prompt` (`:5536-5542`), which calls `analyze_request` (`:5257`). `analyze_request` lowercases and scores the raw prompt (`:4796`) with no strip, so a pasted reply's skill names steer the route. The divergence ledger records this for `rr-paste-208` (`runtime/tests/parity/fixtures/local-native-approved-divergences.json:756-764`). Validation sends raw corpus rows to Python at `runtime/handlers/advisor-validate.ts:414` and to the native scorer at `:460`, and only the native side strips.

### Purpose
The Python scorer drops the same pasted reply the native scorer drops, for every input in one shared fixture.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 from the repository root. `parity-rows.json`, `js-reference.cjs`, `naive-port.py`, `proposed-port.py` and `python-regime-probe.sh` are in this phase's `scratch/` folder. `js-reference.cjs` runs the shipped rule's scratch copy `tmp/p002-briefs/rule.cjs`.

```text
$ printf '%s' "Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code" \
    | SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --threshold 0.8 --uncertainty 0.35 --stdin 2>/dev/null \
    | python3 -c 'import json,sys; print([r["skill"] for r in json.load(sys.stdin)][:3])'
['sk-doc', 'sk-git', 'sk-code']

$ bash scratch/python-regime-probe.sh
raw probe       [('sk-doc', 0.95), ('sk-git', 0.95), ('sk-code', 0.95)]
stripped probe  [('sk-code', 0.95), ('command-speckit-save', 0.93), ('system-spec-kit', 0.82)]

$ node scratch/js-reference.cjs scratch/parity-rows.json && python3 scratch/naive-port.py scratch/parity-rows.json
js    js-space-nbsp               "fix the failing parser test"
js    js-space-info-separator     "\u001cYou said: run the tests. Task: fix the failing parser test"
js    js-space-bom                "fix the failing parser test"
js    ascii-case-fold             "You \u017faid: run the tests. Task: fix the failing parser test"
js    js-trim-trailing-separator  "fix the failing parser test\u001c"
js    js-space-nel                "You\u0085said: run the tests. Task: fix the failing parser test"
py    js-space-nbsp               "fix the failing parser test"
py    js-space-info-separator     "fix the failing parser test"
py    js-space-bom                "\ufeffYou said: run the tests. Task: fix the failing parser test"
py    ascii-case-fold             "fix the failing parser test"
py    js-trim-trailing-separator  "fix the failing parser test"
py    js-space-nel                "fix the failing parser test"

$ python3 scratch/proposed-port.py scratch/parity-rows.json   # first-marker, then last-marker
port  js-space-nbsp               "fix the failing parser test" "fix the failing parser test"
port  js-space-info-separator     "\u001cYou said: run the tests. Task: fix the failing parser test" "\u001cYou said: run the tests. Task: fix the failing parser test"
port  js-space-bom                "fix the failing parser test" "fix the failing parser test"
port  ascii-case-fold             "You \u017faid: run the tests. Task: fix the failing parser test" "You \u017faid: run the tests. Task: fix the failing parser test"
port  js-trim-trailing-separator  "fix the failing parser test\u001c" "fix the failing parser test\u001c"
port  js-space-nel                "You\u0085said: run the tests. Task: fix the failing parser test" "You\u0085said: run the tests. Task: fix the failing parser test"

$ npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts   # from runtime/
 Test Files  9 passed (9)
      Tests  65 passed (65)

$ python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py
Summary: pass=89, fail=0
```

The CLI's own local path routes the probe `sk-doc` first today. Stripped first, the same scorer routes `sk-code`. A direct Python copy of the rule differs from JavaScript on five of six parity rows. The planned port matches JavaScript on all six.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `strip_leading_pasted_reply` to `runtime/scripts/skill_advisor.py`, ported from phase 006's final rule with JavaScript's whitespace set and ASCII-only case folding, and call it first in `analyze_request` (`:4787`).
- Append six parity rows to the shared fixture, one per known regex difference.
- Add `test_pasted_reply_strip_parity` to `runtime/tests/python/test_skill_advisor.py`, register it in `main` (`:2530-2545`) and read the shared fixture.
- Recapture the divergence ledger with `runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` so `rr-paste-208` leaves it.
- Move the Python-reference pins that the port moves, with a comment line that names the cause.

### Out of Scope
- The TypeScript rule - phase 006 owns it, and this phase only reads its output.
- `degradedRecommendations(recommendations, prompt)` reading the raw prompt for typed commands (`runtime/skill-advisor-cli.ts:1585`, `:1498`) - the same class as refutation finding 4, which phase 008 owns. See Open Questions.
- A separate strip inside `analyze_prompt`, `analyze_batch` or the validate handler - all reach `analyze_request`, so one call covers them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/scripts/skill_advisor.py` | Modify | The whitespace set, the two compiled regexes and `strip_leading_pasted_reply`, placed before `analyze_request`, and one call after its empty check at `:4793-4794`. Amended at build: `analyze_batch` trims with the same JavaScript set, because the refutation pass showed `str.strip()` exposing a U+001C-led pasted reply |
| `runtime/tests/python/test_skill_advisor.py` | Modify | `test_pasted_reply_strip_parity` and its line in `main`, plus two batch-trim assertions added at build |
| `runtime/tests/fixtures/pasted-reply-strip-cases.json` | Modify | Append the six parity rows |
| `runtime/tests/fixtures/README.md` | Modify (amended at build) | The fixture's key-files row names the Python reader too |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Recaptured by its capture script with `--write`. `rr-paste-208` leaves it |
| `runtime/tests/parity/python-ts-parity.vitest.ts` | Modify, only if the pins move | `pythonCorrect` at `:269` and `tsAlsoCorrect` at `:274`, plus one comment line. INFERRED: 113 to 114 and 108 to 109 |
| `runtime/tests/legacy/advisor-corpus-parity.vitest.ts` | Modify, only if the pins move | `pythonCorrect` at `:178` and `hookPreservedPythonCorrect` at `:179`, plus one comment line. INFERRED: 117 to 118 and 112 to 113 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Python strips what TypeScript strips, for every fixture row | `python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` exits 0 and prints a PASS line for every fixture id, and `npx vitest run tests/legacy/advisor-prompt-policy.vitest.ts` from `runtime/` exits 0 on the same fixture |
| REQ-002 | The CLI's local path routes the probe like the daemon | The force-local command in Measured Behavior prints `sk-code` first |
| REQ-003 | `rr-paste-208` leaves the ledger through its capture script | The capture dry run prints `"added":[]`, `"resolved":["rr-paste-208"]` and `"changed":[]`, and after `--write` `rg -c rr-paste-208 .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` from the repository root prints nothing and exits 1 |
| REQ-004 | The parity suites pass | `npx vitest run tests/parity` from `runtime/` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Validation compares the same text on both sides | The conductor reads `analyze_request`'s first call and `runtime/lib/scorer/fusion.ts:1277`, and `npx vitest run tests/handlers/advisor-validate.vitest.ts` from `runtime/` exits 0 |
| REQ-006 | Each moved pin moves up, not down, with an unchanged regression list | The diff of each parity test raises its two counts by one and leaves `ACCEPTED_PARITY_REGRESSION_IDS` unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Python test fails before the port, because `strip_leading_pasted_reply` does not exist, and passes after it on all 23 fixture rows.
- **SC-002**: `git diff --stat` for this phase lists only the files in Files to Change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 has not picked its marker rule yet | The Python marker variant is unknown until 006 closes | `plan.md` carries both variants. The conductor pastes the one 006's summary names |
| Risk | Python and JavaScript regex semantics differ on Unicode whitespace, case folding and trimming | High for parity, Low for routing | The port spells out JavaScript's whitespace set, uses `re.ASCII` with `re.IGNORECASE` and trims with that set. Six fixture rows fail a port that misses any of these |
| Risk | Other Python-reference pins move | Med | The capture dry run and the two parity suites name every moved row before any pin changes. A pin moves only up, with the regression list unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `degradedRecommendations` keeps a command row's fields when the raw prompt holds its bare command (`runtime/skill-advisor-cli.ts:1498`), and the fallback passes it the raw prompt (`:1585`). A command inside a pasted reply can still attach on the degraded path. Recommended default: add this call site to phase 008 by amendment, since 008 already owns raw-prompt consumers.
- `runtime/tests/fixtures/README.md` names each shared fixture's readers. Recommended default: if phase 006 adds the fixture's row, this phase adds the Python reader to it by amendment.
- The two pin moves are INFERRED from the stripped probe routing `sk-code` in the parity regime. The `advisor-corpus-parity` suite reads a live graph, so its move is measured after the port, not predicted. Recommended default: move a pin only to the value the suite reports, and only upward.
<!-- /ANCHOR:questions -->

---
