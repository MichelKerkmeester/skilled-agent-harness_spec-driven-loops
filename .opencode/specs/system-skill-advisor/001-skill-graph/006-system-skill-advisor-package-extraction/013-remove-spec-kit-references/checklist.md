---
title: "Verification Checklist: Sweep stale advisor refs from spec-kit docs"
description: "Level 2 verification checklist for the 013/009/013 spec-kit stale advisor reference cleanup."
trigger_phrases:
  - "013/009/013 checklist"
  - "spec-kit advisor cleanup verification"
importance_tier: "critical"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references"
    last_updated_at: "2026-05-14T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "Checklist verified"
    next_safe_action: "Commit scoped changes"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Sweep stale advisor refs from spec-kit docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get operator approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - **Evidence**: `spec.md` defines REQ-001 through REQ-007.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
  - **Evidence**: Plan lists baseline grep, bucketing, fixes, validation, and commit phases.
- [x] CHK-003 [P1] Required reads completed.
  - **Evidence**: Read 013/009 handover, 006 ADR-004, 008 D2 summary, 010 metadata, `SKILL.md`, `ARCHITECTURE.md`, feature catalog root, and manual playbook root.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Baseline grep captured.
  - **Evidence**: Required grep returned `BASELINE_HITS_COUNT=208`.
- [x] CHK-011 [P0] Stale live references removed or rewritten.
  - **Evidence**: Final targeted stale-path grep returned 0 whitelisted-doc hits; `BUCKETED_STALE_LIVE=31`.
- [x] CHK-012 [P1] Historical references preserved or annotated.
  - **Evidence**: `BUCKETED_STALE_HISTORICAL=4`; no ambiguous historical refs needed extra annotation.
- [x] CHK-013 [P1] No-longer-relevant entries deleted only when advisor-owned.
  - **Evidence**: Deleted two advisor-owned local playbook entries, one advisor-owned feature catalog entry, and one master row; `ENTRIES_DELETED=4`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Final grep has zero stale live references.
  - **Evidence**: Same grep returned `FINAL_HITS_COUNT=167`; remaining matches are current sibling refs, historical/example refs, or out-of-scope script/test hits.
- [x] CHK-021 [P0] Strict validation passes for this packet.
  - **Evidence**: `validate.sh 013-remove-spec-kit-references --strict` passed.
- [x] CHK-022 [P1] Spec-kit root strict validation was run or explicitly skipped.
  - **Evidence**: Skipped because `.opencode/skills/system-spec-kit/spec.md` is absent.
- [x] CHK-023 [P1] Fixed files were spot-checked.
  - **Evidence**: Spot-checked `ARCHITECTURE.md`, `README.md`, `hook_system.md`, `skill-advisor-hook.md`, and `SET-UP - Skill Advisor.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified.
  - **Evidence**: Stale live references to pre-extraction advisor ownership and duplicate advisor-owned catalog/playbook docs.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed.
  - **Evidence**: Required grep covered `skill[_-]?advisor`, advisor tool ids, and old advisor paths under system-spec-kit docs.
- [x] CHK-FIX-003 [P0] Consumer inventory completed.
  - **Evidence**: Install guide, architecture, README, hook references, catalog, and playbook docs were bucketed.
- [x] CHK-FIX-004 [P1] Matrix axes listed.
  - **Evidence**: Axes were live stale refs, historical refs, current sibling refs, and no-longer-relevant entries.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, tokens, or credentials introduced.
  - **Evidence**: Edits are Markdown docs plus packet JSON metadata only.
- [x] CHK-031 [P1] No path boundary widened.
  - **Evidence**: Retargeted stale paths to sibling docs/plugins; no runtime permissions or source code changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Level 2 packet docs authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` exist.
- [x] CHK-041 [P1] Binding trace completed.
  - **Evidence**: `implementation-summary.md` records all required BINDING fields; final delivery records the post-amend commit SHA.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temporary archives created.
  - **Evidence**: No `.bak` or `.old` files were created.
- [x] CHK-051 [P1] Out-of-scope files remain untouched.
  - **Evidence**: `FILES_OUT_OF_SCOPE=0`; source code and `system-skill-advisor` docs were not modified by this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-14
<!-- /ANCHOR:summary -->
