---
title: "Verification Checklist: Phase 024 - Manual Playbook Bug Remediation"
description: "Verification Date: 2026-07-07 - all checklist items verified with evidence"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 024 checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/024-manual-playbook-bug-remediation"
    last_updated_at: "2026-07-07T19:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Filled in evidence for all checklist items"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict, commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-playbook-remediation-024"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 024 - Manual Playbook Bug Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Read `023-full-manual-playbook-execution/verdict-matrix.md`'s full "Real bugs found" section as the authoritative, complete bug list before starting any fix (verified)
- [x] CHK-002 [P1] Re-confirmed each bug's root cause against the real source files, not the verdict-matrix summary alone, before writing a fix (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every fix targets a specific, named defect from the bug list — no speculative or unrelated edits made under this phase (verified)
- [x] CHK-011 [P1] `MG-004`'s Round 2 fix, once proven to target the wrong invariant, was corrected in Round 3 by re-deriving root cause from the scenario's own criteria rather than iterating on the same fix shape (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 12 constituent dispatches re-verified via live `cli-opencode` dispatch, not narration or a static prose read (verified)
- [x] CHK-021 [P0] Every verdict graded by grepping raw `tool_use` JSONL inputs against that scenario's own Pass/Fail Criteria, never a generic bar (verified)
- [x] CHK-022 [P0] Round 1 re-verification: 8/12 PASS (`MR-007`, `AI-001-P6`, `TV-001-V1`, `TV-001-V3`, `TV-003`, `TV-004`, `MG-002`, `MG-003`); 4/12 still failing (verified)
- [x] CHK-023 [P0] Round 2 re-verification: 3/4 of the remaining PASS (`TV-002-V4`, `SR-001`, `HM-001`); `MG-004` still FAIL and, on inspection, worse than Round 1 on table-labeling coverage (verified)
- [x] CHK-024 [P0] Round 3 re-verification: `MG-004` PASS — zero Tokens-table content, both boundary docs cited by path in the response text, explicit out-of-scope statement + URL-ask, no fabrication tool call (verified)
- [x] CHK-025 [P1] `~/.config/opencode/opencode.json` checked for the known non-deterministic `open-design` native-entry mutation after every dispatch round in this phase — clean (no `mcp` key) throughout (verified)
- [x] CHK-026 [P1] `git status --porcelain` reviewed after the final re-dispatch round to confirm no stray file was left behind — byte-identical before/after, no new `/tmp/skd-MG004/` or repo-root artifacts (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-P0-001 [P0] Bug 1 (Open Design advisor misroute, `MR-007`/`AI-001`-P6): fixed via `skill_advisor.py` `PHRASE_INTENT_BOOSTERS` + `graph-metadata.json`/`description.json` sync — both scoring layers addressed (verified)
- [x] CHK-P0-002 [P0] Bug 2 (interface/foundations routing-precedence conflict, `TV-001`-V3/`TV-003`): fixed via mirrored transform-verb-precedence exception in both `sk-design/SKILL.md` and `design-interface/SKILL.md` (verified)
- [x] CHK-P0-003 [P0] Bug 3 (interface skips ALWAYS-marked resource, `SR-001`): fixed via citation-required clause on `context_loading_contract.md`'s Resource Loading Levels row; scenario's literal criteria (tool-call load confirmed) now met, though the specific citation phrasing remains imperfect — accepted, does not trip the FAIL clause (verified)
- [x] CHK-P0-004 [P0] Bug 4 (`typeset`/`colorize` excluded-alias rule unenforced, `TV-004`): fixed via mode-vocabulary-guardrail exception in `sk-design/SKILL.md` (verified)
- [x] CHK-P0-005 [P0] Bug 5 (md-generator router-precedence loss on brief-only request, `MG-004`): fixed via a 3-round correction — Round 1 narrowed router-precedence exclusions (mode now resolves), Round 3 rewrote the authoring-boundary contract itself (zero-artifact stop, mandatory citation) after Round 2's label-based fix proved to target the wrong invariant (verified)
- [x] CHK-P0-006 [P0] Bug 6 (hub manager violates intake-before-routing, `HM-001`): fixed via "No hedge-everything bundling" rule in `sk-design/SKILL.md`; re-verification confirmed genuine 5-field intake plus one focused narrowing question, no mode bundle declared (verified)
- [x] CHK-P0-007 [P0] Bug 7 (weak-signal transform-verb produces zero routing, `TV-002`-V4): fixed via 6 additional `PHRASE_INTENT_BOOSTERS` entries; re-verification confirmed advisor confidence 0.68->0.95 and correct routing to `sk-design`->`design-audit` (verified)
- [x] CHK-P0-008 [P0] Bug 8 (`MG-002`/`MG-003` advisor-tier loses to `sk-doc`): fixed by the same `MG-004`-adjacent `design-md-generator/SKILL.md` + graph-metadata sync; both re-verified PASS in Round 1, no further work needed (verified)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No tool-surface or permission change in this phase — all edits are SKILL.md prose, one Python scorer-weight dict, and JSON metadata sync; `MG-004`'s fix specifically tightens a boundary that PREVENTS an unwanted write, it does not add write capability (verified)
- [x] CHK-031 [P1] Confirmed no dispatch in this phase's 3 rounds left a real Open Design project/run or an out-of-repo mutation behind uncaught, per the user's standing directive on the `opencode.json` native-entry issue (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the actual 3-round remediation delivered (verified)
- [x] CHK-041 [P1] `023-full-manual-playbook-execution/verdict-matrix.md` updated with final per-bug verdicts and fix-round references (verified)
- [x] CHK-042 [P2] Known Limitations honestly documents `MG-004`'s residual mode-selection wobble (intermediate narration briefly named `foundations` before the model loaded and deferred to `design-md-generator`'s boundary logic) as a non-blocking fragility, not silently omitted (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain` scoped to the 7 changed files reviewed before commit to confirm only this phase's intended edits are staged, no unrelated concurrent-session files mixed in (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-07
<!-- /ANCHOR:summary -->
