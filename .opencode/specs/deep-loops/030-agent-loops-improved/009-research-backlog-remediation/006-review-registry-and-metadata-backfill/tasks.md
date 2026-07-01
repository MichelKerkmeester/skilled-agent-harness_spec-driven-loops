---
title: "Tasks: Review Registry and Metadata Backfill"
description: "Task list for review-finding disposition and graph-metadata backfill."
trigger_phrases:
  - "review registry metadata backfill tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/006-review-registry-and-metadata-backfill"
    last_updated_at: "2026-07-01T07:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Review Registry and Metadata Backfill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `007-fan-out-hardening/spec.md` scope, `glm/deep-review-findings-registry.json`'s 9 findings, and `codex/deep-review-findings-registry.json`'s 5 findings (per spec's systemic-gap addition)
- [x] T002 Cross-referenced each of the 14 findings against real current code/docs (not against sibling phases' claims). 12 resolved with direct evidence (file/line read or test re-run), 2 still genuinely active (codex F002, F003) — see implementation-summary.md for the full per-finding evidence table
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Backfilled root `graph-metadata.json` `key_files` — required fixing the underlying generator first (see T006-equivalent below): `deriveKeyFiles()` in `graph-metadata-parser.ts` only extracted file paths mentioned in doc prose, never read the `spec.md` frontmatter `_memory.continuity.key_files` array at all. Added a RED-tested fix (frontmatter key_files now merged in first, given priority) before regenerating
- [x] T004 Backfilled `008-loop-systems-remediation/graph-metadata.json` `key_files` — now lists the 3 real runtime scripts (`fanout-run.cjs`, `fanout-merge.cjs`, `cli-guards.cjs`) ahead of doc filenames
- [x] T005 `last_active_child_id`: left `null` for both root and 008 — 008's own Phase Documentation Map already tracks per-child status explicitly (no single "active" child once all are Complete); no change was safe/meaningful here without inventing a value not actually knowable from source docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Found and fixed the mid-word truncation bug in both reachable code paths: `extractDescription()` (`folder-discovery.ts`, drift-gate-off legacy path) and `derivePacketSynopsis()` (`packet-synopsis.ts`, drift-gate-on path) — added a shared `truncateSynopsisAtWordBoundary()` helper both now call. Regression tests added for both paths (exact-boundary and under-limit pass-through cases)
- [x] T007 Rebuilt (`npm run build`), re-ran `generate-description.js` against the root packet: `description.json` no longer truncates mid-word (was `"...gaps in resilienc"`, now `"...gaps in"` — clean word boundary). Re-ran `backfill-graph-metadata.js` for root and `008-loop-systems-remediation`: both now show real runtime `key_files`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 7 tasks complete; 14 findings dispositioned with evidence (12 resolved, 2 genuinely still active); key_files backfilled for root + 008 (required an underlying generator fix); truncation bug fixed in both code paths and verified against the original live repro case.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source findings: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-004/G-002, F-009/G-006)
<!-- /ANCHOR:cross-refs -->
