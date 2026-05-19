---
title: "Verification Checklist: 013 Doctor Update Orchestrator"
description: "P0/P1/P2 verification gates for 5 doctor commands + orchestrator + migration manifest. Council operational-safety lens drives the check selection."
trigger_phrases:
  - "013 checklist"
  - "doctor update verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set"
    last_updated_at: "2026-05-09T11:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist"
    next_safe_action: "Author resource-map.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-doctor-update-orchestrator"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 013 Doctor Update Orchestrator

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence anchors**: `scratch/dispatch-logs/`, `scratch/smoke-tests/`, `decision-record.md` ADRs.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All 5 spec docs authored (spec.md, plan.md, tasks.md, checklist.md, resource-map.md, decision-record.md) — see implementation-summary.md §What Was Built (this session)
- [ ] CHK-002 [P0] User-locked answers captured: location (013 inside 026), scope (both unified+isolated), council lens (op safety)
- [ ] CHK-003 [P0] `/doctor:code-graph.md` + single YAML asset fully read (canonical pattern source)
- [x] CHK-004 [P0] Multi-AI Council 10-line spec captured in `decision-record.md` ADR-002..ADR-008 (one ADR per council question) — see implementation-summary.md frontmatter answered_questions
- [x] CHK-005 [P0] `memory_index_scan` tx model verified + recorded in ADR-001 (REQ-016) — see implementation-summary.md §Phase A.1 — TX-Model Verification (COMPLETE)
- [ ] CHK-006 [P1] cli-opencode availability confirmed if Phase B parallelization pursued
- [ ] CHK-007 [P0] Current branch is `main`; no auto-branch lingering
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:cross-cutting -->
## Cross-Cutting Gates (apply to all 5 new commands)

- [ ] CHK-010 [P0] All 5 Markdown entrypoints pass `validate_document.py --type command` (REQ-001)
- [ ] CHK-011 [P0] All 10 YAML assets load + canonical-path-validate (REQ-002)
- [ ] CHK-012 [P0] All 5 commands follow canonical `/doctor:code-graph` shape (frontmatter + Execution Protocol + Constraints + Unified Setup Phase + Reference Sections)
- [ ] CHK-013 [P0] single interactive routing implemented per command
- [ ] CHK-014 [P0] Canonical-path validator pattern reused for every mutation boundary
- [ ] CHK-015 [P0] Pre-mutation snapshot in every mutating phase (REQ-006)
- [ ] CHK-016 [P0] Post-rebuild gold-battery validation in every mutating phase (REQ-017)
- [ ] CHK-017 [P0] Rollback on regression with operator-visible recovery prompt (REQ-017)
- [ ] CHK-018 [P0] Strict spec-folder validate on 013 packet exits 0 (REQ-003)
<!-- /ANCHOR:cross-cutting -->

---

<!-- ANCHOR:doctor-memory -->
## /doctor:memory (Track B1)

- [x] CHK-100 [P0] `commands/doctor/memory.md` exists + valid — see implementation-summary.md §Track B1 — Reference Template
- [x] CHK-101 [P0] 1 YAML asset exists — see implementation-summary.md §Track B1 — Reference Template
- [ ] CHK-102 [P0] Long-pole ETA prompt (5-15 min) in mutation phase before rebuild
- [ ] CHK-103 [P0] Snapshot covers both context-index.sqlite AND voyage embeddings DB
- [ ] CHK-104 [P0] Gold-battery: 5 representative `memory_search()` queries return results within Recall@20 baseline
- [ ] CHK-105 [P1] status check is read-only; mutation phases trigger rebuild only after prompt
- [ ] CHK-106 [P1] Allowed-tools whitelist matches spec.md per-command spec (no widening)
<!-- /ANCHOR:doctor-memory -->

---

<!-- ANCHOR:doctor-causal-graph -->
## /doctor:causal-graph (Track B2)

- [ ] CHK-200 [P0] `commands/doctor/causal-graph.md` exists + valid
- [ ] CHK-201 [P0] single YAML asset exist
- [ ] CHK-202 [P0] Mutation boundary: add-only edges; never deletes existing edges
- [ ] CHK-203 [P0] Auto-link confidence threshold ≥ 0.7 enforced in YAML
- [ ] CHK-204 [P0] Coverage target ≥ 60% (CHK-065 from prior packet) in gold-battery
- [ ] CHK-205 [P0] Snapshot of host context-index.sqlite before any link mutation
- [ ] CHK-206 [P1] status check is read-only; causal linking only runs after prompt
<!-- /ANCHOR:doctor-causal-graph -->

---

<!-- ANCHOR:doctor-deep-loop -->
## /doctor:deep-loop (Track B3)

- [ ] CHK-300 [P0] `commands/doctor/deep-loop.md` exists + valid
- [ ] CHK-301 [P0] single YAML asset exist
- [ ] CHK-302 [P0] Detects empty graph + stale graph + orphan nodes
- [ ] CHK-303 [P0] Lazy-init from iteration folders if research/review packets exist
- [ ] CHK-304 [P0] Gold-battery: convergence signal returns non-empty for any packet with ≥3 iterations
- [ ] CHK-305 [P1] status check is read-only; graph rebuild runs only after prompt
<!-- /ANCHOR:doctor-deep-loop -->

---

<!-- ANCHOR:doctor-cocoindex -->
## /doctor:cocoindex (Track B4)

- [ ] CHK-400 [P0] `commands/doctor/cocoindex.md` exists + valid
- [ ] CHK-401 [P0] single YAML asset exist
- [ ] CHK-402 [P0] Refuses if CocoIndex daemon unhealthy
- [ ] CHK-403 [P0] mutation phase triggers idempotent daemon restart per 3.4.1.0 fix
- [ ] CHK-404 [P0] Gold-battery: 3 representative semantic queries return ≥ 5 results post-rebuild
- [ ] CHK-405 [P1] status check is read-only; reindex runs only after prompt
<!-- /ANCHOR:doctor-cocoindex -->

---

<!-- ANCHOR:doctor-update -->
## /doctor:update (Track C — orchestrator, council 10-line spec)

- [ ] CHK-500 [P0] `commands/doctor/update.md` exists + valid + describes all 10 council lines
- [ ] CHK-501 [P0] 1 YAML asset exists (`doctor_update.yaml`)
- [ ] CHK-502 [P0] Phase 1: flock at `database/.doctor-update.flock` acquired (REQ-005)
- [ ] CHK-503 [P0] Phase 2: MCP-client-activity probe with warn-and-prompt; `--force` overrides (REQ-014)
- [ ] CHK-504 [P0] Phase 3: VACUUM INTO snapshot for every `*.sqlite` (REQ-006)
- [ ] CHK-505 [P0] Phase 3: disk-free preflight refuses if free < 2× DB total (REQ-023)
- [ ] CHK-506 [P0] Phase 4: cross-subsystem dashboard renders all 7 subsystems (REQ-007)
- [ ] CHK-507 [P0] Phase 5: `--migrate` runs migration-manifest Phase 0; refuses on manifest gap (REQ-008)
- [ ] CHK-508 [P0] Phase 6: dependency-ordered execution with tier-aware prompts (REQ-013)
- [ ] CHK-509 [P0] Phase 7: one-retry-then-rollback partial-failure recovery (REQ-012)
- [ ] CHK-510 [P0] Phase 8: SIGINT graceful cancel + snapshot-restore (REQ-011)
- [ ] CHK-511 [P0] Phase 9: post-run gold-battery; rollback on regression (REQ-017)
- [ ] CHK-512 [P0] Phase 10: state-log JSON written + flock released (REQ-015)
- [ ] CHK-513 [P1] Snapshot auto-cleanup > 30 days unless `--keep-snapshots` (REQ-022)
- [ ] CHK-514 [P1] All 5 flags wired: `--force`, `--no-snapshot`, `--cleanup-legacy`, `--migrate`, `--keep-snapshots`
- [ ] CHK-515 [P1] Stale-PID detection if flock unavailable (PID-file fallback)
<!-- /ANCHOR:doctor-update -->

---

<!-- ANCHOR:migration-manifest -->
## Migration Manifest (Phase D)

- [ ] CHK-600 [P0] `mcp_server/database/migration-manifest.json` exists at expected path (REQ-008)
- [ ] CHK-601 [P0] Manifest declares 3.3.0.0 block (deprecated files + schema migrations + post-state)
- [ ] CHK-602 [P0] Manifest declares 3.4.0.0 block (memory/*.md retired, graph-metadata.json added)
- [ ] CHK-603 [P0] Manifest declares 3.4.1.0 block (doctor commands + tree-sitter recovery)
- [ ] CHK-604 [P1] Manifest gap detection refuses unknown source version with helpful message
- [ ] CHK-605 [P2] Per-version migration scripts authored under `mcp_server/scripts/migrations/` (REQ-020)
<!-- /ANCHOR:migration-manifest -->

---

<!-- ANCHOR:smoke-tests -->
## Smoke Tests (Phase E G1-G9)

- [ ] CHK-700 [P0] G1: `validate_document.py --type command` per new `*.md` exit 0 (5 files)
- [ ] CHK-701 [P0] G2: YAML canonical-path validator per asset exit 0 (10 files)
- [ ] CHK-702 [P0] G3: `validate.sh 013-... --strict` exit 0
- [ ] CHK-703 [P0] G4: `/doctor:update --no-snapshot` smoke detects 2 stale subsystems on this repo (causal + deep-loop)
- [ ] CHK-704 [P1] G5: `/doctor:update` interactive UX with forced-failure injection works
- [ ] CHK-705 [P0] G6: Concurrent dispatch refusal — second invocation refused with holding-PID
- [ ] CHK-706 [P0] G7: SIGINT cancellation — exit 130 + snapshot restored + state log written
- [ ] CHK-707 [P1] G8: Migration gap detection — synthetic unknown version refused
- [ ] CHK-708 [P0] G9: Cross-subsystem dashboard renders all 7 subsystems
<!-- /ANCHOR:smoke-tests -->

---

<!-- ANCHOR:close -->
## Close

- [ ] CHK-800 [P0] `implementation-summary.md` authored with evidence per REQ; `_memory.continuity.completion_pct: 100`
- [ ] CHK-801 [P0] `_memory.continuity` blocks updated across all packet docs
- [ ] CHK-802 [P0] `decision-record.md` captures 7 council ADRs + tx-model ADR-001
- [ ] CHK-803 [P0] `/memory:save` run; POST-SAVE QUALITY REVIEW HIGH issues addressed
- [ ] CHK-804 [P1] Phase parent `026/graph-metadata.json` `derived.last_active_child_id` updated; manual fields restored
- [ ] CHK-805 [P1] No autobranch lingering (`git branch | grep 013-` returns nothing)
- [ ] CHK-806 [P2] External GPT-5.5 high second-opinion dispatched (REQ-021); OR waiver in decision-record.md
<!-- /ANCHOR:close -->

---

<!--
CHECKLIST + L2 (~165 lines)
- 80+ checkpoints across pre-impl / cross-cutting / 5 per-command blocks / migration / smoke / close
- Council 10-line spec covered by CHK-502..CHK-512 (one per phase)
- Evidence anchors: scratch/dispatch-logs/, scratch/smoke-tests/, decision-record.md
-->
