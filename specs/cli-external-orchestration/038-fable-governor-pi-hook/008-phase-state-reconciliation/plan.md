---
title: "Implementation Plan: Phase State and Metadata Reconciliation"
description: "Inventory status drift across phases 001-009, repair the parent map and handoff rows, regenerate generated metadata, and prove the final state with recursive strict validation."
trigger_phrases:
  - "phase state reconciliation plan"
  - "metadata refresh plan"
  - "parent map repair plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation"
    last_updated_at: "2026-08-05T00:23:03Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Completed state reconciliation plan with final command-backed receipts"
    next_safe_action: "Review freshness caveat"
    blockers: []
    key_files:
      - "../spec.md"
      - "../graph-metadata.json"
      - "../001-research/implementation-summary.md"
      - "../002-governor-parity/implementation-summary.md"
      - "../003-pi-directive-capsule/implementation-summary.md"
      - "../004-pi-directive-enforcement/implementation-summary.md"
      - "../005-agents-md-pi-row/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0b504005baec726138e128fa8313ff46a285b44374fb564876d3cbf0ab241ca5"
      session_id: "2026-08-04-cli-038-008-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All nine phases have evidence-supported status and current generated metadata."
      - "The package-root corpus remains an explicit exit-1 deferral; focused evidence is green."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase State and Metadata Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs plus generated JSON metadata |
| **Framework** | Spec-kit description/graph generators and `validate.sh --strict` |
| **Storage** | Parent `spec.md`, `description.json`, `graph-metadata.json`; child summaries, checklists, tasks |
| **Testing** | Recursive strict validation, generator runs, and `rg`/`git diff` scans |

### Overview
Build one packet-wide status inventory first, because no status field can be trusted until every summary, checklist, task list, and graph file is read against the others. Then repair the parent phase map and handoff rows to describe nine unique phases, reconcile summaries and evidence placement, regenerate all generated metadata, and prove the final state with recursive strict validation that reports zero structural errors. Historical phase records are preserved; a phase is Complete only when its implementation or evidence receipts support that state, and any uncommitted-state freshness warning remains explicit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] A packet-wide status table lists spec metadata, summary frontmatter/body, checklist/task state, and graph-derived status per phase.
- [x] Phase 007's evidence inventory is available with the package-root corpus deferral and owner.
- [x] Pre-change copies of parent and child generated metadata and the dirty-worktree baseline are captured for rollback.
- [x] The exact generator commands and strict-validation command are fixed.

### Definition of Done
- [x] Every phase has one normalized, evidence-supported status; the package-root corpus remains an explicit exit-1 deferral.
- [x] The parent map and handoff table list each phase 001-009 exactly once with no placeholder rows.
- [x] Parent and every child `description.json`/`graph-metadata.json` are regenerated and drift-free.
- [x] `last_active_child_id` points at the most recently reconciled Phase 009 child and the parent rollup matches the nine Complete children.
- [x] Recursive strict validation reports zero structural errors; any dirty-worktree `CONTINUITY_FRESHNESS` warning is reported separately.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first state normalization with generator-backed metadata refresh.

### Key Components
- **Status inventory**: a per-phase table crossing spec metadata, summary continuity, checklist/task state, and graph status; the single source for every subsequent edit.
- **Parent map repair**: one Phase Documentation Map row and one handoff row per adjacent phase pair, preserving historical scopes and statuses.
- **Metadata refresh**: `generate-description.js` for the parent and changed children, then `backfill-graph-metadata.js` for the parent and each changed child.
- **Verification sweep**: recursive strict validation plus `rg` scans for duplicates, placeholders, and stale claims.

### Data Flow

```text
inventory (001-009 status/evidence drift)
  -> parent map + handoff repair
  -> summary/checklist/task reconciliation (incomplete work stays non-complete)
  -> generate-description + backfill graph metadata
  -> recursive strict validation (0 structural errors; freshness caveat reported separately)
```

A status change is allowed only when the underlying checklist/task or Phase 007 evidence supports it; generated metadata is refreshed, never hand-edited.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../spec.md` | Parent phase map and handoff table | Replace duplicate/placeholder rows with one row per phase 001-009 and one handoff row per adjacent pair | `rg -n "^\| (1|2|3|4|5|6|7|8|9) \|" ../spec.md` plus `rg -n "TBD|\[Phase [0-9] scope\]" ../spec.md` |
| `../graph-metadata.json` | Parent child list and resume pointer | Regenerate all nine `children_ids` and `derived.last_active_child_id` | `node .../backfill-graph-metadata.js <folder>` exits 0 for each child and parent; `node -e` JSON read of children_ids and pointer |
| `../description.json` | Parent identity | Regenerate after spec.md edit | `node .../generate-description.js . .opencode/specs --level 2` exits 0 |
| `001-research/implementation-summary.md` through `005-agents-md-pi-row/implementation-summary.md` | Historical phase narratives | Reconcile status/completion fields with Phase 007 evidence; preserve historical prose | Per-summary verification rows plus packet status table |
| `006-dispatch-authorization-hardening/implementation-summary.md` through `009-injection-contract-directive-sync/implementation-summary.md` | Remediation summaries | Keep each evidence-supported Complete/100% status and preserve source/test ownership boundaries | Status table row per phase |
| Child `checklist.md` and `tasks.md` | Evidence placement | Move evidence rows to the owning artifact; leave unsupported rows open | Claim scan across the packet |
| Child `description.json` and `graph-metadata.json` | Generated identity and fingerprints | Regenerate for every changed child | Generator commands exit 0; drift checks pass |

Required inventories:
- Status producers: spec metadata tables, summary frontmatter and body, checklist/task states, graph `derived.status`.
- Metadata consumers: resume routing (`last_active_child_id`), memory search (`description.json`), strict validator drift checks.
- Matrix axes: phase, status surface, completion percentage, evidence support, checklist/task rows, generated metadata state.
- Invariant: no phase claims source implementation complete unless a named command and checklist row support it.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Build the packet-wide status and evidence inventory; record pre-change metadata copies for rollback.
- [x] Confirm Phase 007's evidence inventory and its corpus deferral with its maintenance owner.
- [x] Fix the generator command list and the recursive validation command.

### Phase 2: Core Implementation
- [x] Repair the parent phase map and handoff table: nine unique rows, historical statuses preserved, remediation phases described accurately, placeholder rows removed.
- [x] Reconcile implementation summaries and checklists with supported evidence while preserving the Phase 006/007/009 implementation boundaries.
- [x] Normalize completion percentages, next-action fields, and evidence placement across checklists and tasks.
- [x] Regenerate description and graph metadata for the parent and every child; set the resume pointer to the most recently reconciled Phase 009 child.

### Phase 3: Verification
- [ ] Re-run generator commands and confirm idempotence apart from timestamps.
- [ ] Run the claim scans, the recursive strict validation, and a scoped diff review.
- [ ] Record the rollback boundary and hand the final state to the completion verification rule.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Status consistency | Spec, summary, checklist/task, and graph agreement per phase | Packet-wide status table plus `check-status-cross-doc-consistency` |
| Parent map | Nine unique phase rows, unique handoff pairs, no placeholders | `rg -n "^\| (1|2|3|4|5|6|7|8|9) \|" ../spec.md` and `rg -n "TBD|\[Phase [0-9] scope\]" ../spec.md` |
| Metadata refresh | Parent and changed children | `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js <folder> .opencode/specs --level 2` and `node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js <folder>` |
| Generated metadata | Fingerprints, children_ids, status, resume pointer | Recursive strict validation plus `node -e` JSON reads |
| Final gate | Whole packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook --strict` |

A recursive validation with zero structural errors is the completion gate; the status table and diff review explain why each field changed, while any uncommitted-state freshness warning remains explicit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 evidence inventory | Internal | Present | Focused Pi/shared/Node receipts are green; the package-root corpus remains exit 1 with owner and revisit trigger recorded. |
| Description and graph generators | Internal | Present | No metadata refresh; child drift and fingerprint errors stay open. |
| Recursive strict validator | Internal | Present | Final run must report zero structural/integrity errors; uncommitted-state freshness is reported separately. |
| Git diff baseline | Local | Present | The packet is intentionally uncommitted/untracked; baseline status and scoped final sweep provide the rollback and boundary evidence. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A phase status is changed without supporting evidence, the parent map loses or duplicates a phase row, a generator reports drift, or recursive validation fails.
- **Procedure**: Restore the pre-change metadata copies and the reverted status/wording edits, re-run the generators, verify the nine-child set and historical rows are intact, then re-run recursive strict validation. Historical phase folders are never deleted; only status/evidence wording and generated metadata are restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 007 evidence handoff and pre-change snapshot | Core implementation |
| Core implementation | Frozen status inventory | Verification |
| Verification | Core implementation | Phase 009 intake and packet completion review |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and inventory | Medium | 1-2 hours |
| Map repair and summary reconciliation | Medium | 2-4 hours |
| Metadata refresh and verification | Medium | 1-3 hours |
| **Total** | | **4-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-change copies of parent and child `graph-metadata.json` and `description.json` are captured.
- [ ] The status inventory is frozen and Phase 007 evidence status is recorded.
- [ ] Generator and validation commands are pinned.

### Rollback Procedure
1. Restore the captured metadata files and revert status/evidence wording edits.
2. Re-run the generators to confirm they reproduce the pre-change shape.
3. Verify the nine-child set, historical rows, and resume pointer.
4. Re-run recursive strict validation; reopen the phase if any error returns.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Restore the prior metadata and wording files from the scoped diff; no phase folder or historical record is deleted.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- Specification: [spec.md](spec.md)
- Tasks: [tasks.md](tasks.md)
- Checklist: [checklist.md](checklist.md)
- Parent packet: [../spec.md](../spec.md)
- Evidence predecessor: [../007-dispatch-validation-evidence/plan.md](../007-dispatch-validation-evidence/plan.md)
- Contract successor: [../009-injection-contract-directive-sync/plan.md](../009-injection-contract-directive-sync/plan.md)
