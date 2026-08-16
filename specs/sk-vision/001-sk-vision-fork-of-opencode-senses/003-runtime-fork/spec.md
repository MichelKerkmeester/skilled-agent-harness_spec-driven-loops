---
title: "Feature Specification: sk-vision 003 runtime fork"
description: "Phase parent for copying shipped Senses v0.2.0 into vision-runtime/, rebranding identifiers, building dist/plugin.js, and optional GPU smoke."
trigger_phrases:
  - "sk-vision runtime fork"
  - "sk-vision vision-runtime"
  - "sk-vision rebrand"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Rewrote 003-runtime-fork as lean phase parent over nested children."
    next_safe_action: "Wait for 002-skill-scaffold to close, then implement 001-copy-shipped-files."
    blockers: []
    key_files:
      - "spec.md"
      - "001-copy-shipped-files/spec.md"
      - "002-rebrand-identifiers/spec.md"
      - "003-build-and-tests/spec.md"
      - "004-gpu-smoke/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-003-runtime-fork-parent-20260816"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-vision 003 runtime fork

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | 002-skill-scaffold |
| **Successor** | 004-opencode-adapter |
| **Handoff Criteria** | Nested children Complete. dist/plugin.js exists. Identifier inventory clean except LICENSE Adarsh line. GPU load+status PASS or SKIP. Next implementer target is 004-opencode-adapter/001-plugin-reexport. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill root has no importable JSON-RPC core. 004 and 005 cannot load tools until vision-runtime builds.

### Purpose
Place a rebranded v0.2.0 image pipeline at `.opencode/skills/sk-vision/vision-runtime/` and emit `dist/plugin.js`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Nested child `001-copy-shipped-files/`: locked cp list; `context/` stays read-only
- Nested child `002-rebrand-identifiers/`: longest-token-first rewrite; package name `sk-vision`
- Nested child `003-build-and-tests/`: bun build, tests, rg inventory
- Nested child `004-gpu-smoke/`: JSON-RPC `load` then `status`, or SKIP

### Out of Scope
- Editing `context/`
- Copying `PLAN.md`, dump `opencode.json`, `.github/`
- Host load files `.opencode/plugins/sk-vision.js` and `.pi/extensions/sk-vision.ts`
- Inventing `sk_vision_query`
- npm publish

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's spec.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/src/**` | Create | 001-copy-shipped-files | Copied dump sources |
| `.opencode/skills/sk-vision/vision-runtime/**` | Modify | 002-rebrand-identifiers | Identifier rewrite |
| `.opencode/skills/sk-vision/vision-runtime/dist/plugin.js` | Generate | 003-build-and-tests | Import target for 004 |
| `implementation-summary.md` in 004-gpu-smoke | Modify | 004-gpu-smoke | PASS or SKIP |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-copy-shipped-files/ | Copy locked dump files | Planned |
| 2 | 002-rebrand-identifiers/ | Longest-token-first rewrite | Planned |
| 3 | 003-build-and-tests/ | bun build, tests, rg | Planned |
| 4 | 004-gpu-smoke/ | load then status, or SKIP | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Do not implement from this parent spec. Open the next Planned child's `spec.md` copy pack.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-copy-shipped-files | 002-rebrand-identifiers | Listed dest files exist; context/ unchanged | `test -f`; `git diff --exit-code -- context` |
| 002-rebrand-identifiers | 003-build-and-tests | Package name sk-vision; no sk_vision_query | `rg` proofs |
| 003-build-and-tests | 004-gpu-smoke | dist/plugin.js exists; tests pass | `test -f dist/plugin.js`; `bun test` |
| 004-gpu-smoke | 004-opencode-adapter | PASS load+status or SKIP | Child implementation-summary |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
