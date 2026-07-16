---
title: "Implementation Plan: Phase 13: absorb-028-004-review-remediation-closeout"
description: "Documentation reconciliation pass: tracker absorption pointers, 91-item P2 mapping, ledger completeness sweep, parent status refresh, tooling-finding records, and the final recursive program validation."
trigger_phrases:
  - "review remediation closeout plan"
  - "absorbed tracker pointers plan"
  - "p2 triage mapping plan"
  - "program closeout validation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/013-absorb-028-004-review-remediation-closeout"
    last_updated_at: "2026-07-04T17:51:12.876Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored phase planning docs (spec, plan, tasks, checklist)"
    next_safe_action: "Execute LAST in program order, after phase 012 closes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-013-closeout-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: absorb-028-004-review-remediation-closeout

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs + JSON graph metadata (no application code) |
| **Framework** | system-spec-kit templates v2.2; spec-kit generators for derived metadata |
| **Storage** | Spec folders under `.opencode/specs/system-speckit/029-memory-search-intelligence/`; memory index via scoped `memory_index_scan` |
| **Testing** | `validate.sh --strict` (per folder + parent recursive), `check-placeholders.sh`, JSON parse checks, grep pointer audits |

### Overview
This phase is a documentation reconciliation pass, not a code change. It walks three absorbed trackers and three parent rollups, replaces stale open-state rows with verify-first-then-close disposition pointers into this program's phases (the 028/006/002 items are already fixed in code per plan-review SYSTEMIC #1), completes two mapping tables (the reconstructed 91-item P2 triage — the frozen per-item source is unrecoverable — and the finding-level findings-ledger completeness sweep), records three tooling findings with repro, and finishes with the program-wide strict validation, a scoped index scan, and the closeout memory save.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md sections 2-3)
- [ ] Phases 001-012 final statuses read from their child folders (mapping claims depend on them)
- [ ] Target tracker docs re-read at execution time and `git status` checked for concurrent edits

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-008 with evidence)
- [ ] Recursive strict validation green: 016 parent + 13 children exit 0
- [ ] Docs updated (spec/plan/tasks/checklist synchronized; mapping tables complete; closeout save indexed)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Tracker-absorption and completeness-audit pass over documentation surfaces (single-writer, row-scoped edits; generator-owned JSON regenerated, never hand-edited).

### Key Components
- **Absorbed trackers**: `028/006/002-memory-schema-and-concurrency/` (three pending items), `028/006/004-p2-triage/` (91-item decision layer), `028/014/001-findings-remediation/tasks.md` (Group-A rows + open Phase-2 appendix and deferred rows).
- **Parent rollups**: `028/006/spec.md` + its `graph-metadata.json`, the 028 packet-parent `spec.md` + `graph-metadata.json`, and the 016 program-parent `spec.md` + `graph-metadata.json`.
- **Mapping tables**: the reconstructed per-item P2 table (lives in 028/006/004; frozen source unrecoverable) and the finding-level findings-ledger completeness table (lives in this phase's `tasks.md`).
- **Evidence corpus (read-only)**: `../research/phase-decomposition.md` (authoritative finding-to-phase map), `../research/deep-dive-report.md` §6, `../research/findings-ledger.md`.

### Data Flow
Ledger + report + phase-decomposition map → per-row dispositions → tracker pointer edits and mapping tables → parent spec status rows → regenerated graph metadata → recursive validation → scoped index scan → closeout memory save.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase edits spec docs, not code, so the addendum inventories documentation surfaces. Every surface below is a consumer of tracker status; the invariant is one disposition per row, one status story across all surfaces.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `028/006/002-memory-schema-and-concurrency/` (spec/tasks/impl-summary) | Pending remediation contract for P1-2/P1-4/P1-5 (already fixed in code per SYSTEMIC #1) | Update: verify-first-then-close pointers → phases 008/009 (run migration for P1-2; add tests for P1-4/P1-5; NOT re-fixes) | `rg -n 'P1-2\|P1-4\|P1-5\|absorbed' <folder>` shows verify-first pointer lines; no unowned pending claim |
| `028/006/004-p2-triage/` (spec/tasks/impl-summary) | Lens-grouped 91-item P2 triage, per-item map PENDING; frozen source unrecoverable + inherited dead `../../archive/review-report.md` pointer | Update: reconstruct per-item list (ledger + G1-G15), repath dead pointer, complete mapping + close tasks | Reconstructed count reconciled to the "91" headline; `rg -n 'PENDING'` returns no unresolved triage rows |
| `028/006/spec.md` phase map | Reports 002/004 as "PENDING, scaffold only" | Update: absorbed/closed rows with pointers + re-review disposition | `rg -n 'PENDING, scaffold only' 028/006/spec.md` empty after edit |
| `028/006/graph-metadata.json`, `description.json` | Generator-owned derived status | Regenerate via spec-kit generators | `node -e 'JSON.parse(...)'` exit 0; derived status matches spec.md |
| 028 packet-parent `spec.md` + `graph-metadata.json` | Phase-map row for 006 drives packet 028 blocker status | Update row + regenerate | Row text matches 006 parent state; JSON parses |
| `028/014/001-findings-remediation/tasks.md` | Ex-031 tracker: Group-A queued; ~14 open/deferred rows | Update: Group-A absorbed → phase 007; sweep dispositions on open rows | `rg -n 'T-0211\|T-0212\|REQ-214'` shows absorbed pointers; each open row has one disposition |
| 016 program-parent `spec.md` + `graph-metadata.json` | Program phase map and continuity | Update final statuses + regenerate | Phase-map statuses match child folders; JSON parses |
| This phase's `tasks.md` mapping table | Ledger completeness audit surface | Update: fill dispositions during execution | Zero rows left Pending at completion |

Required inventories:
- Stale open-state strings: `rg -n 'PENDING, scaffold only|queued for next fix-dispatch round' .opencode/specs/system-speckit/029-memory-search-intelligence/003-review-remediation .opencode/specs/system-speckit/029-memory-search-intelligence/000-release-cleanup/015-manual-playbook-execution-sweep` — must return zero hits after the pass.
- Absorbed-row consumers: `rg -n 'T-0211|T-0212|REQ-214|P1-2|P1-4|P1-5' .opencode/specs/system-speckit/029-memory-search-intelligence --glob '*.md'` — every hit outside frozen archives carries or cites a disposition.
- Matrix axes: tracker (3) × row class (absorbed / open-swept / frozen-done) × status surface (child doc, parent map, graph metadata) — each cell either edited or explicitly not-a-consumer.
- Invariant: a tracker row never has two dispositions, and no status surface tells a different story than the child doc that owns the row.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read final statuses of program phases 001-012 from their child folders (gate for covered-by claims)
- [ ] Re-read the three tracker folders and check `git status` on every target file (concurrent-session guard)
- [ ] Capture the baseline: `validate.sh --strict` on the 016 parent and the three tracker folders before any edit

### Phase 2: Core Implementation
- [ ] Absorption pointers: 006/002 rows → phases 008/009; ex-031 Group-A rows → phase 007
- [ ] Mapping tables: complete the 91-item P2 table in 006/004; fill the ledger completeness table in this phase's tasks.md; sweep 014's open rows
- [ ] Status reconciliation: 028/006 parent, 028 packet parent, 016 program parent — spec rows edited, JSON regenerated; record the three tooling findings (create.sh, upgrade-level.sh, generate-description.js `--level`) with repro and routing

### Phase 3: Verification
- [ ] Grep audits pass: no stale open-state strings; every absorbed row carries exactly one disposition
- [ ] Final program validation: `validate.sh --strict` exit 0 on 016 parent + all 13 children; scoped `memory_index_scan`
- [ ] Closeout: `/memory:save` recorded against the program parent; checklist.md fully verified
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Every edited spec folder + final recursive run over 016 parent and 13 children | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
| Placeholder audit | Edited tracker docs and this phase's four docs | `check-placeholders.sh`; `rg` for stale open-state strings |
| Metadata integrity | Regenerated graph-metadata.json / description.json for 006, 028, 016 parents | JSON parse via node; derived-status cross-check against spec.md rows |
| Completeness audit | Reconstructed 91-item P2 table and finding-level ledger mapping table | Count reconciliation against the "91" headline (frozen per-item source unrecoverable — reconstruct from ledger + G1-G15) and the finding-level table covering all 13 pre-enumerated silent drops |
| Index visibility | Edited folders visible to memory search | Scoped `memory_index_scan({ specFolder })` + a follow-up scoped search |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-012 final statuses | Internal | Yellow until program execution reaches this phase | Mapping dispositions cannot claim coverage; phase must wait (it runs LAST by design) |
| Spec-kit generators (generate-context.js, graph-metadata backfill) | Internal | Green | Parent metadata would need manual derivation — not allowed; halt and fix tooling first |
| Memory MCP surface (index scan, memory save) | Internal | Green after phase 011 | Closeout save deferred; document CLI fallback (`node .opencode/bin/spec-memory.cjs`) evidence instead |
| Operator answers (re-review disposition; tooling-fix owner) | External | Yellow | Record the open question verbatim in the tracker instead of guessing; do not block pointer edits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A tracker edit misstates a disposition, clobbers a concurrent session's row, or a regenerated metadata file derives the wrong status.
- **Procedure**: All changes are text/JSON under git — `git checkout -- <file>` (or revert the closeout commit) restores any surface; regenerate graph metadata after restoring spec text; re-run the scoped `memory_index_scan` so the index reflects the restored docs. No database migration or code path is touched by this phase, so no checkpoint is required.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: statuses + git guard + baseline) ──► Phase 2 (Core: pointers, tables, records) ──► Phase 3 (Verify: audits, validation, save)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Program phases 001-012 executed (this phase runs LAST) | Core |
| Core | Setup (statuses read, baseline captured) | Verify |
| Verify | Core (all edits landed) | Program completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour (status reads, git guard, baseline validation) |
| Core Implementation | Medium | 3-5 hours (91-item table and ledger sweep dominate) |
| Verification | Low-Medium | 1-2 hours (grep audits, 14-folder validation, index scan, save) |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `git status` clean (or collisions reconciled) on every target tracker file before editing
- [ ] Baseline validation exit codes captured in scratch/ before the first edit
- [ ] Confirmed no database migration or code path is touched (docs + generated JSON only)

### Rollback Procedure
1. Restore affected docs: `git checkout -- <file>` per surface, or revert the closeout commit as a unit
2. Regenerate graph-metadata.json / description.json for any restored spec.md so derived fields match again
3. Re-run `validate.sh --strict` on restored folders and compare against the recorded baseline
4. Re-run the scoped `memory_index_scan` so the memory index reflects the restored docs

### Data Reversal
- No persistent data store is mutated beyond the memory index, which re-derives from the docs on the next scoped scan — restoring the docs and rescanning fully reverses the closeout.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
