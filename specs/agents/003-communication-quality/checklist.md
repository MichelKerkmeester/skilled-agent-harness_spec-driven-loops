---
title: "Verification Checklist: AGENTS.md Communication Quality Section"
description: "Verification Date: 2026-08-07"
trigger_phrases:
  - "verification"
  - "checklist"
  - "communication quality"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/003-communication-quality"
    last_updated_at: "2026-08-07T08:44:03Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all P0/P1 items with evidence"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".codex/AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: AGENTS.md Communication Quality Section

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md:95` REQ-001..005 present with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `plan.md:73` two-homes pattern + 3 phases]
- [x] CHK-003 [P1] Source analyzed; net-new vs already-covered separated [evidence: `spec.md:56` records .codex already covered ~70% of source]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Root COMMUNICATION QUALITY section present, 3 subsections (REQ-001) [evidence: `AGENTS.md:464` header `## 8. COMMUNICATION QUALITY`]
- [x] CHK-011 [P1] Each new bullet net-new vs §1 or explicit cross-link (REQ-003) [evidence: absent from `AGENTS.md:50` `AGENTS.md:80` `AGENTS.md:115`]
- [x] CHK-012 [P1] House style matched [evidence: uses `- **Term** — explanation.` bullets + blockquote intro like §1/§4]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Section headers sequential 1..10 after renumber (REQ-002) [evidence: `grep -nE '^## [0-9]+\.' AGENTS.md` returns 1..10 in order]
- [x] CHK-021 [P0] No in-doc cross-ref points at wrong section (REQ-002) [evidence: sole §8 hit is external ref at `AGENTS.md:159` `quick-reference.md`]
- [x] CHK-022 [P1] No-duplication / no-contradiction read vs §1 and .codex [evidence: `.codex/AGENTS.md` headers 1..12 intact; complement-not-restate]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Net-new inventory complete vs BOTH AGENTS.md files [evidence: each §8 bullet checked in `AGENTS.md` and `.codex/AGENTS.md`, or marked cross-link]
- [x] CHK-FIX-002 [P0] Renumber consumer inventory complete [evidence: `grep -nE '(Section )(8|9|10)' AGENTS.md` only external-file ref matched]
- [x] CHK-FIX-003 [P1] Reconciliation contradiction check complete [evidence: `.codex` imported SVO/atomic but not `keep it short` vs its rhythm rule]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials in the added prose [evidence: `git diff AGENTS.md` is instruction text only; no tokens/keys]
- [x] CHK-031 [P0] No ephemeral artifact ids in instruction prose (NFR-M02) [evidence: validator `COMMENT_HYGIENE_MARKER` passes]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/implementation-summary synchronized [evidence: all five docs describe same §8 + `.codex` reconciliation]
- [x] CHK-041 [P1] Packet metadata generated [evidence: `description.json` + `graph-metadata.json` created by `generate-description.js`]
- [x] CHK-042 [P2] .codex/AGENTS.md reconciled without contradiction (REQ-004) [evidence: 4 additive edits in `.codex/AGENTS.md`; no rule contradicts §8]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside scratch/ [evidence: `git status` shows only `AGENTS.md`, `.codex/AGENTS.md`, packet docs]
- [x] CHK-051 [P1] Packet path + naming ok [evidence: validator `FOLDER_NAMING` passes for `003-communication-quality`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-08-07
**Verified By**: AI Assistant (Claude)
<!-- /ANCHOR:summary -->
