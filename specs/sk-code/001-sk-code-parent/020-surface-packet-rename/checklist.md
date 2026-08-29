---
title: "Verification Checklist: Phase 20 sk-code surface-packet rename to code- prefix"
description: "Executed Level 2 verification checklist for the sk-code surface-packet rename: code-* identities, live reference repair, strict hub gates, and documented scoped deferrals."
trigger_phrases:
  - "phase 20 checklist"
  - "sk-code rename checklist"
  - "code prefix verification"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/020-surface-packet-rename"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rename executed; verification evidence recorded"
    next_safe_action: "Run gated advisor reindex handoff; handle benchmark-gold rewrite separately"
---
# Verification Checklist: Phase 20 sk-code surface-packet rename to code- prefix

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md defines REQ-001..REQ-007, SC-001..SC-005, risks, edge cases, files to change, and scoped out-of-scope boundaries]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md defines mechanical rename, contract update, reference sweep, guardrails, verification gates, rollback, and deferrals]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: phase 019 handed forward the rename follow-up; phase 020 spec identifies link-checker, parent-skill-check, vocab-sync, advisor reindex handoff, and benchmark-gold rewrite boundaries]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Four sk-code surface folders renamed with history preserved [EVIDENCE: final hub `ls` lists exactly `code-animation`, `code-debug`, `code-implement`, `code-opencode`, `code-quality`, `code-review`, `code-verify`, `code-webflow`, plus unprefixed `benchmark`, `changelog`, `manual_testing_playbook`, and `shared`]
- [x] CHK-011 [P0] Two-axis contract uses the code-* identity [EVIDENCE: `mode-registry.json` and `hub-router.json` parse; parent-skill-check 3c confirms every mode packet resolves to an existing sub-directory, and 5b confirms routerSignals keys match the eight registry workflowMode values]
- [x] CHK-012 [P1] Packet names match renamed folders [EVIDENCE: each renamed packet `SKILL.md` `name:` field updated to its `code-*` folder identity; parent-skill-check strict passed]
- [x] CHK-013 [P1] No double-prefix introduced [EVIDENCE: `grep -rn "code-code-" sk-code` returned 0]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] JSON contract and metadata files parse [EVIDENCE: `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, and `description.json` all parse]
- [x] CHK-021 [P0] sk-code markdown link oracle is clean [EVIDENCE: `check-markdown-links.cjs` reports ZERO sk-code broken links; repo-wide exit=1 is unchanged 40 pre-existing broken links outside sk-code in system-spec-kit database README files]
- [x] CHK-022 [P1] Live stale-reference sweep is empty [EVIDENCE: zero live files under `.opencode` + `.claude` reference `sk-code/{review,webflow,opencode,animation}/` as a path after excluding historical specs, changelog, benchmark, playbook, and archive records]
- [x] CHK-023 [P1] Structural hub gates are green [EVIDENCE: `PARENT_HUB_CHECK_STRICT=1 parent-skill-check` exits 0 with all hard invariants passed and 0 warnings; vocab-sync score 100, driftDetected false, findings [], orphanAliases [], aliasCollisions [], ownershipDrift []]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Internal markdown links repaired [EVIDENCE: workflow-mode and code-webflow packet links formerly pointing through `../webflow/`, `../opencode/`, `../animation/`, and `../review/` now resolve under `code-*`; link checker reports zero sk-code broken links]
- [x] CHK-025 [P0] External live references repaired [EVIDENCE: `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, speckit complete assets, and deep-review prompt pack template all repointed to `code-*`; stale-ref sweep is empty]
- [x] CHK-026 [P1] Metadata path references repaired without semantic refresh [EVIDENCE: `graph-metadata.json` and `description.json` path references parse and point at `code-*`; keyword/topic/derived-token semantics are explicitly deferred]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Rename did not touch secrets or credentials [EVIDENCE: phase touched folder paths, markdown, JSON, YAML assets, and templates only; no env values or credential material are part of the evidence set]
- [x] CHK-031 [P0] Platform and detection names preserved [EVIDENCE: Webflow/OpenCode/Motion.dev names, WEBFLOW/OPENCODE/MOTION_DEV labels, the natural-language utterance "review my webflow animation for jank", and Keywords comment remain intact]
- [x] CHK-032 [P1] Rename is reversible as one mechanical unit [EVIDENCE: rollback plan restores renamed folders plus registry/router/metadata/link-checker/reference edits, then reruns inventory, stale-ref, link-checker, parent-skill-check, and vocab-sync gates]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec.md, plan.md, and tasks.md describe the same rename scope, live reference sweep, verification gates, and scoped deferrals]
- [x] CHK-041 [P1] Implementation summary updated with actual evidence [EVIDENCE: implementation-summary.md status Complete, completion_pct 100, Files Changed table, Verification table, NFR verification, and Deviations-from-Plan table]
- [x] CHK-042 [P2] Advisor metadata semantics refreshed or deferred [EVIDENCE: DEFERRED WITH REASON — REQ-007 keyword/topic/derived-token refresh is owned by the gated advisor reindex handoff; phase 020 repaired dangling paths only]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only true sk-code infrastructure remains unprefixed [EVIDENCE: final directory set leaves `benchmark`, `changelog`, `manual_testing_playbook`, and `shared` unprefixed while all eight sub-skills use `code-*`]
- [x] CHK-051 [P1] Historical and archived records remain untouched by design [EVIDENCE: old-name references remain only in historical 124 phase records 013/014/016 and archive material per the standing leave-historical-records decision]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-05
**Verified By**: Claude Opus

<!-- /ANCHOR:summary -->
