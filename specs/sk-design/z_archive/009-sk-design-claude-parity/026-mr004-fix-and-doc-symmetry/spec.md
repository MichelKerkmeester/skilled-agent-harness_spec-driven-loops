---
title: "Feature Specification: Phase 026 - MR-004 Fix and Doc Symmetry"
description: "Closes out every remaining item from the post-024 fresh audit: fixes MR-004's live-daemon advisor conflict and AI-004's pre-existing negation-matching bug, applies the two declined-but-deferred doc-symmetry findings, and aligns sk-design's version numbers with a changelog entry."
trigger_phrases:
  - "phase 026 sk-design"
  - "MR-004 advisor fix"
  - "design review negation bug"
  - "sk-design version alignment"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/026-mr004-fix-and-doc-symmetry"
    last_updated_at: "2026-07-08T03:36:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md after confirming MR-004 fix via standalone probe and live dispatch"
    next_safe_action: "Run validate.sh --strict, then commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mr004-fix-doc-symmetry-026"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 026 - MR-004 Fix and Doc Symmetry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 025 closed `PB-002` but left four items explicitly open or deferred: `MR-004`'s newly-discovered live-daemon-path advisor conflict (out of that phase's scope), a pre-existing `skill_advisor.py` negation-matching bug affecting `AI-004`'s standalone probe, and two "fix-now, improvement" findings from the fresh audit the operator declined to bundle into phase 025's narrower scope (parent version-number alignment, and the transform-verb-precedence doc-symmetry gap for `excludedAliases.audit`).

### Purpose

Close every remaining open or deferred item from the post-024 fresh audit in one pass: fix `MR-004` at the same `graph-metadata.json` layer that closed `PB-002`, fix `AI-004`'s negation bug by removing the offending bare keyword, apply the two declined doc-symmetry findings, and align sk-design's four version-bearing files with a changelog entry documenting the net change since v1.2.0.0.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix `MR-004`'s live-daemon-path advisor conflict (`sk-code` winning over `sk-design`) via `graph-metadata.json` `intent_signals` additions, verified via standalone probe (repeatable, unpolluted) and a live re-dispatch.
- Fix `skill_advisor.py`'s pre-existing negation-matching bug (`AI-004`'s "not a... design review" misroute) by removing the offending bare `design-review` keyword from `sk-design/SKILL.md`'s Keywords comment, verified as fixed with zero regression on a legitimate design-review prompt.
- Apply the transform-verb-precedence doc-symmetry fix: a new `harden`/`polish` exception clause in `SKILL.md`'s `audit` guardrail bullet, mirroring the existing `foundations` exception.
- Apply the `taskProjections`-vs-`excludedAliases` layering doc note in `mode-registry.json`'s `transformVerbRouting.note`.
- Align `SKILL.md`, `description.json`, `mode-registry.json`, and `hub-router.json` to the same version number (1.4.3.0) and author a changelog entry covering the net cumulative change since v1.2.0.0.
- Update `verdict-matrix.md` to close out the fresh audit's remaining items.

### Out of Scope

- The newly-discovered `audit`-mode `Bash`-usage tool-surface deviation (2 non-mutating `node -e` calls during `MR-004`'s live-dispatch re-verification, despite `audit`'s registry entry forbidding `Bash`) — a genuinely new finding from this phase's own verification work, flagged in `verdict-matrix.md`, not fixed here (would need its own investigation into whether the deviation is the model's own initiative or a resource citing `Bash` usage as acceptable for contrast-ratio math).
- `PB-006`, `PB-007`, `FR-001`'s behavioral-variance PARTIALs — still judged accept-as-is by the fresh audit, not re-touched.
- Any full playbook re-run to move the Tier-3 release verdict from `NOT READY` — a separate, larger future effort.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/graph-metadata.json` | Edit | `intent_signals` += `"design slop"`, `"anti-slop UI audit"`, `"contrast and keyboard focus"` (MR-004 fix) |
| `.opencode/skills/sk-design/SKILL.md` | Edit | Remove bare `design-review` keyword (AI-004 fix); add `harden`/`polish` transform-verb-precedence exception to the `audit` guardrail bullet; version bump 1.4.2.0 → 1.4.3.0 |
| `.opencode/skills/sk-design/mode-registry.json` | Edit | `transformVerbRouting.note` extended with the `taskProjections`-vs-`excludedAliases` layering clarification; version bump 1.4.0.0 → 1.4.3.0 |
| `.opencode/skills/sk-design/hub-router.json` | Edit | Version bump 1.4.0.0 → 1.4.3.0 (alignment only, no content change) |
| `.opencode/skills/sk-design/description.json` | Edit | Version bump 1.4.2.0 → 1.4.3.0 |
| `.opencode/skills/sk-design/changelog/v1.4.3.0.md` | Create | Net-cumulative changelog entry covering v1.3.0.0 through v1.4.3.0 |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/verdict-matrix.md` | Edit | Close out the fresh audit's remaining items; add the new `audit`-mode `Bash`-usage finding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `MR-004`'s advisor conflict is fixed and verified on the literal, unpolluted scenario prompt | `sk-design` top-1 ≥ 0.80, decisive margin, stable across repeated calls |
| REQ-002 | `AI-004`'s negation-matching bug is fixed with zero regression on legitimate design-review prompts | `AI-004`'s prompt resolves `sk-code`; a genuine "design review" prompt still resolves `sk-design` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both declined fix-now findings from the fresh audit are applied | Doc-symmetry exception added; layering note added |
| REQ-004 | Version numbers aligned across all 4 version-bearing sk-design files | All read the same version; changelog entry exists for it |
| REQ-005 | The new `Bash`-usage finding discovered during this phase's own verification is surfaced, not silently absorbed | Documented in `verdict-matrix.md` with evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the `MR-004` fix is applied, **Then** the standalone probe on the exact scenario prompt decisively and repeatably favors `sk-design`.
- **SC-002**: **Given** the `AI-004` fix is applied, **Then** its negation-clause prompt resolves `sk-code` and a legitimate design-review prompt still resolves `sk-design`.
- **SC-003**: **Given** all fixes land, **Then** `verdict-matrix.md`'s fresh-audit section shows every item closed except the one new finding this phase itself surfaced.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The live dispatch's own internal advisor tool call can get polluted by the dispatch-recipe's addendum text, producing a confounded verification result unrelated to the fix itself | Confirmed | Documented explicitly for `MR-004`; the standalone probe on the unpolluted literal prompt is the more reliable signal and is what was used to confirm the fix works |
| Risk | Removing a keyword from `SKILL.md`'s corpus could reduce legitimate routing signal | Low | `design-review` was redundant with 4 more specific existing keywords (`design-quality-audit`, `design-qa`, `audit-the-design`, `review-the-ui`); regression-tested a legitimate design-review prompt post-fix |
| Dependency | The skill-advisor daemon's live file-watcher (confirmed in phase 025) | High | Both `graph-metadata.json` and `SKILL.md` edits were picked up live without a restart, consistent with phase 025's finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the newly-found `audit`-mode `Bash`-usage deviation needs a scoped fix (tightening the mode's registry-vs-behavior contract) or is acceptable model-initiative computation — not decided in this phase.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: This phase's `MR-004` fix reused the exact `graph-metadata.json` intent_signals mechanism phase 025 discovered for `PB-002` — confirming that fix pattern as the durable, reusable approach for sk-design advisor-routing gaps against the native daemon backend specifically.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- A live dispatch's own internal tool-call construction is not fully controllable by the dispatch recipe's addendum wording; this phase treats standalone-probe verification on the literal prompt as authoritative when the live-dispatch check is confounded, rather than blocking on a clean live-dispatch result that may not be reliably reproducible.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 7 files edited; one scenario fix, one pre-existing bug fix, 2 doc-symmetry fixes, version alignment |
| Risk | 4/25 | JSON metadata + one keyword removal + prose additions; no runtime logic touched |
| Research | 6/20 | Reused an established fix pattern (graph-metadata.json intent_signals) rather than discovering a new mechanism |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Predecessor Phase**: `../025-pb002-advisor-and-audit-bundle-fix/` (established the `graph-metadata.json` fix pattern this phase reuses for MR-004)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
