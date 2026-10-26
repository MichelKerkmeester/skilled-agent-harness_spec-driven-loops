---
title: "Goal: Phase 21: ci-gate-regressions"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ci gate regressions goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions"
    last_updated_at: "2026-10-26T23:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Closed out: every completion criterion holds"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-021-ci-gate-regressions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 21: ci-gate-regressions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the two CI gates that fail on main pass for the right reason, and fix the in-range findings from the same audit run.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Fix each gate at its producer: the changed-packet selection loop for X1, the system-spec-kit intent signals for X2. No gate is loosened or ledgered. |
| D2 | Scratch stays unvalidated, as the repo convention says; the benchmark packets keep their sandbox metadata. |
| D3 | DeepSeek V4.1 Flash 1017 through cli-pi makes each literal fix from one short brief, and Opus makes each judgment fix. |
| D4 | No full test suite: each fix runs the targeted checks its gate or finding names. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `ci-rule-set-comparison.vitest.ts` prints `Tests 17 passed (17)`, and its scratch-copy test fails against the old workflow
- [x] `local-native-divergence-ratchet.vitest.ts` from `system-skill-advisor/runtime` prints `Tests 9 passed (9)`
- [x] `skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none`
- [x] `sync-skills-hermes.cjs --check` prints `PASS: 67` with system-spec-kit at 2.12.2.0
- [x] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| X1 changed-packet validation | Done | Replay over `b51a341a07^2..b51a341a07`: 111 graded with 104 under `scratch/` before, 7 and 0 after; comparison tests 17/17 |
| X2 Routing Registry Drift | Done | Divergence ratchet 9/9, drift and parity 21/21, freshness `--strict` rc 0 |
| In-range fixes B-01, B-03 to B-05, A-1, X6, X7 | Done | Card `Total issues: 0`, `CARD SYNC OK`, ESLint 244 with 0 in `dist/`, four cli-pi runs `exit=0` |
| Close gates | Done | v2.12.2.0, Hermes `PASS: 67`, recursive strict validate on packet 054 |

### Deviations and findings

| Item | Note |
|------|------|
| Parity count | The conductor reported parity 60/60; the closeout could not map that count to one suite, so it records the counts it observed per suite instead |
| rr-iter3-168 margin | The conductor reported 0.004; the closeout probe printed 0.5744 against 0.5665 (0.0079) |
| X6 brief verify | `rg "_authoring"` also matches the YAML key `cross_skill_authoring_load`; the closeout used the narrower `checklists/[^ ]*_authoring` pattern |
<!-- /ANCHOR:log -->
