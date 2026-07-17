---
title: "Verification Checklist: command-recipe choreography relocation + validator repair"
description: "Verification Date: 2026-07-14"
trigger_phrases:
  - "choreography relocation checklist"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/006-command-recipe-choreography-relocation"
    last_updated_at: "2026-07-14T21:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored verification checklist"
    next_safe_action: "Run Phase 1, then fill evidence"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Verification Checklist: command-recipe choreography relocation + validator repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` — REQ-001..006 with acceptance criteria. — `spec.md` §4 REQ-001..006
- [x] CHK-002 [P0] Technical approach in `plan.md` + decisions in `decision-record.md`. — `decision-record.md` ADR-001..003
- [x] CHK-003 [P1] Validator's real current state grounded (INVALID/10) before scoping. — grounded `invalid=10` at `stage=metadata` before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Lane C dead wrapper-prose branch + unused `wrapperMarkdown` plumbing removed; equality check retained. — `score-skill-benchmark.cjs` −39 lines; `sameJsonValue` equality kept
- [x] CHK-011 [P0] Validator null-command synthesis fixed at root cause; no unrelated check weakened. — `readNoCommandTokens` token model; Sonnet found no weakening (no P0/P1)
- [x] CHK-012 [P1] No ephemeral artifact markers in code comments — durable WHY only. — Sonnet `grep` across all 5 files: 0 id/path matches
- [x] CHK-013 [P1] Strengthened check is structural, not positional (`order === step_N`) or fuzzy. — `step_N_<name>` structural contract; `drift=0` with 5-vs-6/7 row/step mismatch (Sonnet-empirical)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Full `skill-benchmark.vitest.ts` suite passes — 0 failures. — vitest `57/0` (orchestrator re-run)
- [x] CHK-021 [P0] `node design-command-surface-check.mjs` reports `invalid=0` / STATUS=VALID. — `STATUS=VALID STAGE=complete` `invalid=0 drift=0`
- [x] CHK-022 [P0] Validator negative tests prove each choreography mutation fails. — `design-command-surface-check.test.mjs` `node --test` `7/0`
- [x] CHK-023 [P1] De-masked recipe test loads committed gold; stale-fixture drift now catchable. — Sonnet ran real `scoreCommandRecipe` on simulated drift → `valid:false`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Option C fully executed — dead branch gone, validator repaired + strengthened, fixture/test de-drifted. — 5 files landed; validator `VALID`, vitest `57/0`
- [x] CHK-FIX-002 [P0] Fresh Sonnet review confirms no check was weakened to pass. — Sonnet review over the 5-file `git diff`: all `SOUND`, no P0/P1 findings
- [x] CHK-FIX-007 [P1] Evidence pinned to the fix commits, not a moving range. — evidence cites stable `file:line` anchors + gate results in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced — code/test/fixture edits only. — `git diff` is code/test/fixture only, no credentials or tokens added
- [x] CHK-031 [P1] Sandbox/allowlist posture unchanged. — no config/allowlist/`.utcp` change in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/decision-record synchronized with the delivered work. — `tasks.md` T001-T009 `[x]`; `implementation-summary.md` added
- [x] CHK-041 [P2] Layering debt recorded in `decision-record.md` (ADR-003).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Frozen benchmark run-report artifacts untouched — `git status` on `deep-improvement/benchmark/` clean. — only 5 code/doc files changed; `benchmark/` byte-identical
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

All three phases landed. Wave 1 removed the dead Lane C branch (`56/0`). Wave 2 repaired the validator to `STATUS=VALID` / `invalid=0 drift=0` with a stricter sibling predicate + structural choreography contract (`node --test` `7/0`), and de-drifted the fixture + de-masked the recipe test (vitest `57/0`). A fresh Sonnet review found no P0/P1 and confirmed no check was weakened to pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off is final once `validate.sh --strict` returns Errors 0, the full suite passes, the validator reports `invalid=0`, and the branch is integrated.
<!-- /ANCHOR:sign-off -->
