---
title: "Implementation Summary"
description: "Six human-run EX scenarios (EX-037..EX-042) were authored in the existing manual-testing-playbook feature-file format and wired into the master index, covering checkpoint-v2 round-trip, the .needs-rebuild self-heal, schema v30 post-insert enrichment, index_scan phased-async refinements, the MCP front-proxy reconnect contract, and the sk-git worktree convention. Additive only; every behavioral claim traces to a verified source anchor."
trigger_phrases:
  - "manual testing playbook refresh implementation summary"
  - "EX-037 EX-042 authored and wired"
  - "checkpoint enrichment frontproxy skgit scenarios shipped"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored EX-037..EX-042 playbook scenarios and wired the master index"
    next_safe_action: "None binding; six EX scenarios shipped and wired into the master index"
    blockers: []
    key_files:
      - "manual_testing_playbook/manual_testing_playbook.md"
      - "manual_testing_playbook/05--lifecycle/050-checkpoint-v2-file-snapshot-roundtrip.md"
      - "manual_testing_playbook/04--maintenance/039-post-insert-enrichment-lifecycle-v30.md"
      - "manual_testing_playbook/14--pipeline-architecture/258-front-proxy-reconnect-and-backend-only.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-testing-playbook-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-manual-testing-playbook-update |
| **Completed** | 2026-06-02 — six EX scenarios authored, wired, and validated |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six new human-run `EX-###` scenarios were added to the Spec Kit Memory manual testing playbook, in the existing split-document feature-file format (one feature file per scenario plus a master-index entry in `## 7. EXISTING FEATURES`). The change is additive: no existing scenario, ID, or section was renumbered or rewritten. The new IDs start at `EX-037`, one above the prior maximum `EX-036`.

### Scenarios added

| ID | Title | Feature file | Folder rationale |
|----|-------|--------------|------------------|
| EX-037 | Checkpoint v2 file-snapshot round-trip | `05--lifecycle/050-checkpoint-v2-file-snapshot-roundtrip.md` | Sits with the existing checkpoint block (`EX-015`..`EX-018`) |
| EX-038 | Post-insert enrichment lifecycle (schema v30) | `04--maintenance/039-post-insert-enrichment-lifecycle-v30.md` | Maintenance/index-time behavior |
| EX-039 | index_scan phased-async refinements | `04--maintenance/040-index-scan-phased-async-refinements.md` | Extends `EX-014` (memory_index_scan) |
| EX-040 | MCP front-proxy reconnect / SPECKIT_BACKEND_ONLY / -32002 vs -32001 | `14--pipeline-architecture/258-front-proxy-reconnect-and-backend-only.md` | Runtime/pipeline infrastructure |
| EX-041 | sk-git worktree convention | `16--tooling-and-scripts/300-sk-git-worktree-convention.md` | Tooling/scripts |
| EX-042 | Checkpoint v2 .needs-rebuild self-heal | `05--lifecycle/051-checkpoint-v2-needs-rebuild-self-heal.md` | Checkpoint lifecycle |

### Coverage delivered

- **Checkpoint-v2 (EX-037).** Full-DB `VACUUM INTO` create then restore round-trip; asserts `snapshot_format='v2'` plus `snapshot_path` and `manifest.json`; restore through `reopenActiveDatabase` with the `active_vec` shard; restore-journal crash-safety (`.restore-journal.json`, `swap-pending` → `swap-done`); sandbox-only guard.
- **.needs-rebuild self-heal (EX-042).** Sentinel repaired at boot (`runCheckpointNeedsRebuildRepair`) and during a leased scan (`runCheckpointNeedsRebuildRepairForScan`, after `acquireIndexScanLease`); repair counts and `cleared` flag verified.
- **Enrichment v30 (EX-038).** `post_insert_enrichment_status` lifecycle (`pending`/`partial`/`failed`/`complete`/`deferred`); repair-on-replay (`repairEnrichmentOnReplay`); scan-lease backfill (`repairIncompleteMarkers`); complete/deferred markers left untouched.
- **index_scan refinements (EX-039).** Phased-async (`complete_with_pending_vectors` + `pendingVectors`, lexical-first availability); packet_id move reconciliation (`moveReconciled`); migration-28 active-row uniqueness (`idx_memory_logical_key_active_unique`); response repair counts (`moveReconciled`, `staleDeleted`, orphan-sweep, `checkpointRepair`).
- **Front-proxy (EX-040).** Transparent RSS-recycle via `-32001` `RETRYABLE_RECYCLE_ERROR` (`retryable:true`, LIVE — not removed); `SPECKIT_BACKEND_ONLY=1` skips the server's own stdio transport; `-32002` `PROTOCOL_MISMATCH_ERROR` (`retryable:false`) fails closed to terminal `CLOSED`.
- **sk-git (EX-041).** `wt/{NNNN}-{name}` branch under `.worktrees/{NNNN}-{name}`; 4-digit zero-padded `max(existing NNNN) + 1` counter; no commit/push/merge performed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each scenario was authored only after reading its source anchor(s) directly, so every behavioral claim traces to shipped code. The new feature files mirror the validated `EX-014` (multi-step) and `EX-015` (single-step) shapes: Overview → Scenario Contract → Test Execution (Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage) → Source Files → Source Metadata. The master index was extended with one `### EX-###` entry per scenario directly after `EX-036`.

The accuracy guardrails were honored explicitly: `-32001` is documented as the live retryable-recycle code (not removed); `-32002` is the terminal fail-closed protocol-mismatch code; the README "36-tool" server count was not touched (no tool-count claim was added). The catalog cross-link for each new scenario is intentionally deferred to the sibling phase `002-feature-catalog-update`, which owns the feature-catalog files; the master-index entries link the Feature File so they resolve today.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Additive EX scenarios (EX-037+) over restructuring | The playbook's EX/PHASE/M IDs and `NN--category/` structure are load-bearing across many cross-reference tables; additivity preserves every existing reference. |
| Topic-affinity folder placement | Checkpoint scenarios join `05--lifecycle`, maintenance/index join `04--maintenance`, front-proxy joins `14--pipeline-architecture`, sk-git joins `16--tooling-and-scripts` — matching the playbook's existing organizing principle. |
| Document `-32001` as live retryable-recycle | `-32001` is the live `RETRYABLE_RECYCLE_ERROR` in `launcher-session-proxy.cjs`; stating it was removed would be false and misleading. |
| Feature-File-only master-index links | The catalog files are owned by sibling phase `002-feature-catalog-update`; linking only the Feature File keeps every link resolvable now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet docs authored (spec, plan, tasks, checklist, decision-record, summary) | PASS |
| Six EX feature files created under topic-appropriate `NN--category/` folders | PASS — EX-037/042 in `05--lifecycle/`, EX-038/039 in `04--maintenance/`, EX-040 in `14--pipeline-architecture/`, EX-041 in `16--tooling-and-scripts/` |
| Master index wired with `### EX-037`..`### EX-042` entries | PASS — entries at master-index lines 769, 782, 795, 808, 821, 834 |
| Feature-File links resolve to existing files | PASS — all six targets exist on disk |
| Behavioral claims traced to source anchors | PASS — each Source Metadata cites the file path read (checkpoints.ts, vector-index-schema.ts, enrichment-state.ts, memory-index.ts, launcher-session-proxy.cjs, context-server.ts, sk-git SKILL.md) |
| Accuracy guardrails (`-32001` live, `-32002` fail-closed, "36-tool" untouched) | PASS |
| `validate.sh --strict` on this packet | PASS — Errors: 0 (see Validation note) |
<!-- /ANCHOR:verification -->

### Validation note

`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update --strict` → Errors: 0, Warnings: 0, RESULT: PASSED.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Catalog cross-links deferred.** The new scenarios link only the Feature File in the master index. The matching feature-catalog files and their `> **Catalog:**` links are owned by the sibling phase `002-feature-catalog-update`; until that phase lands, the new EX entries differ from the older entries by not carrying a Catalog link.
2. **Live execution is operator-run.** These are human-run scenarios; this packet authored and structurally verified them but did not execute the destructive checkpoint/restore or front-proxy recycle steps against a live daemon. The destructive scenarios are marked sandbox-only.
3. **Folder spread.** The six scenarios live across four `NN--category/` folders by topic affinity; they are discoverable from the single master-index block but are not co-located on disk.
<!-- /ANCHOR:limitations -->
