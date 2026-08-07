---
title: "Feature Specification: Phase 024 - Manual Playbook Bug Remediation"
description: "Fixes the 8 real bugs phase 023's full manual playbook execution surfaced (routing, resource-loading, and authoring-boundary defects), verified via 3 rounds of live re-dispatch against the actual scenarios that first exposed them."
trigger_phrases:
  - "manual playbook bug remediation"
  - "phase 024 sk-design"
  - "MG-004 authoring boundary fix"
  - "sk-design 8 real bugs remediation"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/024-manual-playbook-bug-remediation"
    last_updated_at: "2026-07-07T19:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md after confirming all 12 constituent dispatches PASS across 3 remediation rounds"
    next_safe_action: "Run validate.sh --strict, then commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-playbook-remediation-024"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 024 - Manual Playbook Bug Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 023's first-ever full manual execution of sk-design's `manual_testing_playbook` (56 real dispatches through `cli-opencode`, `openai/gpt-5.5-fast --variant medium`) produced a genuine `NOT READY` release verdict and catalogued 8 real bugs in `023-full-manual-playbook-execution/verdict-matrix.md`'s "Real bugs found" section — routing misses, a skipped ALWAYS-marked resource load, an unenforced excluded-alias rule, a router-precedence loss on a brief-only authoring-boundary scenario, an intake-before-routing violation, a weak-signal transform-verb prompt producing zero skill routing, and a two-scenario advisor-tier loss to `sk-doc`. These were left as "candidates for a scoped follow-up remediation phase, not yet started."

### Purpose

Fix all 8 bugs at their root cause (not just their symptom), then prove each fix via live re-dispatch of the exact scenario that first exposed it — not a unit test or a static read of the changed prose, but the same `cli-opencode` dispatch mechanic phase 023 used. Iterate until every constituent dispatch passes its own scenario file's Pass/Fail Criteria.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix all 8 bugs catalogued in `023-full-manual-playbook-execution/verdict-matrix.md`.
- Re-dispatch and grade the exact scenario(s) each bug traces to, against that scenario's own Pass/Fail Criteria — not a generic bar.
- Iterate fixes across as many rounds as needed per bug until each constituent dispatch reaches a clean PASS (or a documented, accepted imperfection where the scenario's literal criteria is still met).
- Check for and revert any recurrence of the `~/.config/opencode/opencode.json` native `open-design` mutation (a known non-deterministic side effect from `MR-007`/`AI-001`-P6-shaped dispatches, already root-caused and documented in phase 023).

### Out of Scope

- Re-running the full 56-dispatch playbook end-to-end — only the 12 dispatches tied to the 8 catalogued bugs are re-verified.
- New scenario authoring (that was phase 022's scope).
- Any bug or defect not in the original 8-item catalogue, even if newly observed during re-verification (e.g. MG-004 Round 3's residual mode-selection wobble, noted in `implementation-summary.md` Known Limitations, not fixed further since it doesn't trip the scenario's own FAIL clause).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Edit | `PHRASE_INTENT_BOOSTERS` additions (Round 1 + Round 2) for Open Design and weak-signal transform-verb routing |
| `.opencode/skills/sk-design/SKILL.md` | Edit | Mode-vocabulary-guardrail exception, intake-ordering enforcement, anti-hedge-bundling rule (Round 1 + Round 2); version bump |
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Edit | Transform-verb-precedence exception, `context_loading_contract.md` citation-required clause (Round 1 + Round 2); version bump |
| `.opencode/skills/sk-design/design-md-generator/SKILL.md` | Edit | Router-precedence exclusion narrowing (Round 1); ALWAYS #10 / NEVER #6 rewritten for a zero-artifact boundary stop (Round 3); version bump |
| `.opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md` | Edit | Section 5 + Quick Boundary Check rewritten to forbid any partial artifact output, require both boundary docs cited by path in visible response text (Round 3); version bump |
| `.opencode/skills/sk-design/graph-metadata.json` | Edit | `intent_signals` and `derived.trigger_phrases` additions for the Open Design advisor-tier gap |
| `.opencode/skills/sk-design/description.json` | Edit | `keywords`/`trigger_examples` additions matching the graph-metadata sync |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 8 catalogued bugs get a root-cause fix, not a symptom patch | Each fix traces to the specific defect named in `verdict-matrix.md`'s bug list |
| REQ-002 | Every one of the 12 constituent dispatches tied to the 8 bugs is re-dispatched live and graded against its own scenario file's criteria | 12/12 confirmed PASS across the 3 remediation rounds |
| REQ-003 | Any recurrence of the `opencode.json` native `open-design` mutation is checked for and reverted | Confirmed clean (`no mcp key`) after every dispatch round in this phase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Fixes that fail re-verification get a second (or third) targeted attempt, not abandonment | 4 dispatches needed Round 2 (`TV-002-V4`, `SR-001`, `HM-001`, `MG-004`); `MG-004` needed a Round 3 after Round 2's fix targeted the wrong root cause |
| REQ-005 | `verdict-matrix.md` is updated to reflect the post-remediation state | Bug list annotated with fix-round + final verdict per item |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 8 bugs are fixed, **Then** every one of the 12 constituent dispatches (`MR-007`, `AI-001-P6`, `TV-001-V1`, `TV-001-V3`, `TV-003`, `TV-004`, `MG-002`, `MG-003`, `TV-002-V4`, `SR-001`, `HM-001`, `MG-004`) is confirmed PASS via live re-dispatch, not narration or a static prose read.
- **SC-002**: **Given** the remediation completes, **Then** no dispatch in this phase leaves a stray file, a real Open Design project/run, or an `opencode.json` mutation behind uncaught.
- **SC-003**: **Given** `verdict-matrix.md` is re-read after this phase, **Then** its bug list and constituent-dispatch verdicts are internally consistent with the actual fix rounds applied.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A prose-only SKILL.md fix doesn't change live-model behavior (routing weight, tool-call compulsion) | Medium | Confirmed twice this phase — `TV-002-V4` needed a `PHRASE_INTENT_BOOSTERS` scorer-weight fix, not prose; `MG-004` needed a structural rule rewrite (forbid the artifact, not just unlabeled values in it), not a stronger warning |
| Risk | A fix resolves the documented symptom but not the scenario's actual literal criteria | Low-Medium | `SR-001`'s citation-forcing mechanism still doesn't fire reliably even after Round 2 — accepted as-is since the scenario's real grading bar (a genuine tool-call load of the resource) is independently met |
| Dependency | Phase 023's dispatch recipe and grading discipline (raw `tool_use` grep, not narration) | High | Reused verbatim for every re-verification round in this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — all 12 constituent dispatches reached a confirmed PASS; no unresolved fix-attempt remains open.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The two-layer advisor-scoring discovery from this phase (`skill_advisor.py`'s Python `PHRASE_INTENT_BOOSTERS` vs. the live orchestrator's TS-based `graph-metadata.json`/`description.json` scorer) is documented precedent for any future advisor-routing bug — fixing only one layer leaves the other's dispatch path unfixed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- `MG-004`'s Round 2 fix targeted the wrong invariant (partial Origin-labeling) and regressed slightly (worse table coverage) before Round 3 corrected course to the scenario's actual contract (zero-artifact boundary stop). Documented in `implementation-summary.md` as a worked example of re-deriving root cause from re-read scenario criteria rather than iterating on the same fix shape.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 7 files edited across 3 rounds; 12 constituent dispatches re-verified live |
| Risk | 6/25 | Doc/prose + one scorer-weight-table edit only; no runtime logic, no registry schema changes |
| Research | 10/20 | Root-cause tracing across 2 separate advisor-scoring code paths plus a scenario-criteria re-read that reversed an initial fix direction (MG-004) |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Predecessor Phase**: `../023-full-manual-playbook-execution/` (the manual run that surfaced all 8 bugs; `verdict-matrix.md`'s "Real bugs found" section is this phase's entire input)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
