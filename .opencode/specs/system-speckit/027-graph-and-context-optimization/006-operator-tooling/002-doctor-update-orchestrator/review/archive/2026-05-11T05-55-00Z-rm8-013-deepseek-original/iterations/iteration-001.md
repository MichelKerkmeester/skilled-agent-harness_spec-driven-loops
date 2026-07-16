# Iteration 1 — Inventory Pass

**Date**: 2026-05-11
**Focus**: inventory (multi-dimension scoping)
**Status**: complete

---

## Files Reviewed

| Path | Classification | Note |
|------|----------------|------|
| `010-doctor-update-orchestrator/spec.md` | STABLE | Clean phase parent spec, lean trio, PHASE DOCUMENTATION MAP accurate |
| `010-doctor-update-orchestrator/description.json` | STABLE | Correct childTopology, parentChain, keywords |
| `010-doctor-update-orchestrator/graph-metadata.json` | SUSPECT | `last_active_child_id: null` (REQ-P-002 violation); `status: "planned"` vs spec "In Progress" |
| `010-doctor-update-orchestrator/handover.md` | SUSPECT | Title claims "001-initial-doctor-commands" but file is at parent; primarily narrates v3.3 hardening on child 001 |
| `010-doctor-update-orchestrator/resource-map.md` | STABLE | Comprehensive 81-row parent aggregate, 140+ expanded paths, up-to-date |
| `001-initial-doctor-commands/spec.md` | SUSPECT | `packet_pointer` missing `/001-initial-doctor-commands` suffix (reads as parent); Status "Draft" vs impl "COMPLETE"; `completion_pct: 0` |
| `001-initial-doctor-commands/plan.md` | STABLE | Well-structured 5-phase plan + dispatch design |
| `001-initial-doctor-commands/tasks.md` | SUSPECT | All tasks still ⏳ Pending (authoring-time state), contradicting "all 5 phases delivered" claim |
| `001-initial-doctor-commands/checklist.md` | SUSPECT | All 80+ checkboxes unchecked; no verification evidence despite COMPLETE claim |
| `001-initial-doctor-commands/decision-record.md` | STABLE | 10 well-formed ADRs with evidence and cross-references |
| `001-initial-doctor-commands/implementation-summary.md` | SUSPECT | Title "COMPLETE" vs body Metadata "PARTIAL (~30% complete)" — contradictory completion states |
| `001-initial-doctor-commands/resource-map.md` | SUSPECT | All entries show PLANNED status (pre-implementation); not refreshed post-implementation |
| `001-initial-doctor-commands/description.json` | SUSPECT | `specFolder` at parent level (`010-doctor-update-orchestrator`), should include `/001-initial-doctor-commands` |
| `001-initial-doctor-commands/graph-metadata.json` | STABLE | Correct child-level data; `packet_id` correctly includes `/001-initial-doctor-commands` |
| `002-sandbox-testing-playbook/spec.md` | STABLE | Well-formed Level 3 spec, comprehensive REQ/NFR/edge cases |
| `002-sandbox-testing-playbook/plan.md` | STABLE | Clear 5-phase plan with documented dispatch design |
| `002-sandbox-testing-playbook/tasks.md` | STABLE | Well-structured task graph with traceability |
| `002-sandbox-testing-playbook/checklist.md` | SUSPECT | All checkboxes unchecked; no verification evidence (same pattern as 001) |
| `002-sandbox-testing-playbook/decision-record.md` | STABLE | 8 well-formed ADRs with evidence and cross-references |
| `002-sandbox-testing-playbook/implementation-summary.md` | SUSPECT | continuity `completion_pct: 70` vs title "COMPLETE (~95%)"; honest about G3/G4 gaps |
| `002-sandbox-testing-playbook/resource-map.md` | SUSPECT | All entries show PLANNED status; not refreshed post-implementation |
| `002-sandbox-testing-playbook/handover.md` | STABLE | Honest handover, clearly documents blockers (no E2E execution, missing fixtures, no Docker build) |
| `002-sandbox-testing-playbook/description.json` | STABLE | Correct specFolder + parentChain |
| `002-sandbox-testing-playbook/graph-metadata.json` | STABLE | Correct status `in_progress`, comprehensive entity list |

**Summary**: 14 STABLE, 9 SUSPECT, 1 GAP (the missing `001-initial-doctor-commands/handover.md` documented in parent resource-map.md line 110 as intentionally removed)

---

## Implementation Surfaces Identified

Paths surfaced from spec docs that warrant deeper inspection in later iterations:

| Surface | Source | Files |
|---------|--------|-------|
| Doctor command Markdown entrypoints | 001 spec.md, parent resource-map.md | `.opencode/commands/doctor/memory.md`, `causal-graph.md`, `deep-loop.md`, `cocoindex.md`, `update.md` |
| Doctor command YAML assets | 001 spec.md, parent resource-map.md | `.opencode/commands/doctor/assets/doctor_{memory,causal-graph,deep-loop,cocoindex,update}.yaml` |
| MCP launcher/bootstrap | parent handover.md, parent resource-map.md | `.opencode/bin/spec-kit-memory-launcher.cjs`, `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` |
| MCP server routing config | parent resource-map.md | `.mcp.json`, `opencode.json` |
| Migration manifest | 001 spec.md | `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` |
| Playbook scenarios (23 files) | 002 spec.md, parent resource-map.md | `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/DOC-*.md` |
| Sandbox harness (4 scripts) | 002 spec.md, parent resource-map.md | `_sandbox/doctor-commands/harness/{run-all,reset-state,capture-evidence,assert-signals}.sh` |
| Per-scenario wrappers (23 files) | 002 spec.md, parent resource-map.md | `_sandbox/doctor-commands/scenarios/DOC-*.sh` |
| Sandbox container config | 002 spec.md | `_sandbox/doctor-commands/Dockerfile`, `docker-compose.yml` |
| Fixture infrastructure | 002 spec.md | `_sandbox/doctor-commands/fixtures/{manifest.json,fetch-fixtures.sh}` |
| Root playbook | 002 spec.md | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` |
| ai-council artifacts | parent handover.md | `001-initial-doctor-commands/ai-council/` (10 files) |
| Parallel runtime mirrors | (cross-runtime) | `.claude/commands/doctor/`, `.codex/commands/doctor/`, `.gemini/commands/doctor/` (if they exist) |
| 001 dispatch prompts | 001 resource-map.md | `001-initial-doctor-commands/dispatch/*.prompt.md` |
| 002 dispatch prompts + logs | 002 resource-map.md | `002-sandbox-testing-playbook/dispatch/*.{prompt.md,log}` |

---

## Findings by Severity

### P0

(none found during inventory pass — no obvious blockers visible on read)

### P1

#### R1-P1-001: Parent `last_active_child_id` is null

- **File**: `graph-metadata.json:220`
- **Severity**: P1 (correctness — violates REQ-P-002)
- **Evidence**: `derived.last_active_child_id: null`. REQ-P-002 requires this field to match the most recently saved child packet (`001-initial-doctor-commands` or `002-sandbox-testing-playbook`). The 002 handover line 100 claims "last_active_child_id correctly tracks 002" but the field is null.
- **Finding class**: instance-only
- **Recommendation**: Run `generate-context.js` with the 002 spec folder to refresh the field, then verify it points to `002-sandbox-testing-playbook`.

#### R1-P1-002: Parent `graph-metadata.json` status contradicts spec

- **File**: `graph-metadata.json:47`
- **Severity**: P1 (correctness — contradictory status)
- **Evidence**: `derived.status: "planned"` but parent `spec.md:53` says `Status: In Progress` and children show active implementation evidence. This throws off graph-based status queries and dashboard views.
- **Finding class**: instance-only
- **Recommendation**: Set `derived.status` to `"in_progress"` to match spec.md and actual child phase states.

#### R1-P1-003: 001 `implementation-summary.md` has contradictory completion states

- **File**: `001-initial-doctor-commands/implementation-summary.md:2,51`
- **Severity**: P1 (correctness — readers cannot determine true state)
- **Evidence**: Line 2 title: "COMPLETE — all phases A-E delivered". Line 51 Metadata table: "Status: PARTIAL (~30% complete)". Three different statements: title says COMPLETE, body says PARTIAL 30%, continuity `completion_pct` says 99. No single source of truth.
- **Finding class**: instance-only
- **Recommendation**: Reconcile to a single consistent completion state. Based on handover evidence (13 fixes shipped, E2E partially verified, checklist unchecked), recommend "completion_pct: 95 — 13 fixes shipped and structurally validated; Phase 5/7/10 E2E truncated".

#### R1-P1-004: 001 `checklist.md` unchecked despite COMPLETE claim

- **File**: `001-initial-doctor-commands/checklist.md` (all checkboxes)
- **Severity**: P1 (traceability / checklist_evidence gate)
- **Evidence**: Every checkbox from CHK-001 to CHK-806 is `[ ]` unchecked. The implementation-summary and handover claim extensive verification (yaml.safe_load PASS, jq validate PASS, 17/17 contract matrix, full E2E final_status=ok) but none of this evidence is captured in the canonical checklist.
- **Finding class**: class-of-bug (same pattern in 002)
- **Recommendation**: Mark all verified checkboxes with `[x]` and add evidence anchors referencing handover/implementation-summary sections. Unmarked items should remain `[ ]` with deferral notes.

#### R1-P1-005: 001 `description.json` specFolder at parent level, not child

- **File**: `001-initial-doctor-commands/description.json:2`
- **Severity**: P1 (traceability — incorrect spec folder pointer)
- **Evidence**: `specFolder: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator"` should be `".../010-doctor-update-orchestrator/001-initial-doctor-commands"`. The child graph-metadata.json correctly has the child-level `spec_folder` but description.json has the parent-level. This causes spec-folder resolution to land on the parent instead of the child.
- **Finding class**: instance-only
- **Recommendation**: Re-run `generate-context.js` on the 001 child spec folder to regenerate description.json with the correct child-level specFolder.

#### R1-P1-006: 001 `resource-map.md` entries all show PLANNED status

- **File**: `001-initial-doctor-commands/resource-map.md` (throughout)
- **Severity**: P1 (maintainability — stale resource map)
- **Evidence**: All command, config, and meta entries show Status: PLANNED (authoring-time state). Implementation-summary and parent resource-map.md confirm these files exist on disk with Status: OK. Resource map not refreshed after implementation.
- **Finding class**: class-of-bug (same pattern in 002)
- **Recommendation**: Refresh resource map to reflect actual post-implementation state. Replace PLANNED with OK for files confirmed on disk.

#### R1-P1-007: 002 `checklist.md` unchecked — no verification evidence

- **File**: `002-sandbox-testing-playbook/checklist.md` (all checkboxes)
- **Severity**: P1 (traceability — same pattern as 001-child)
- **Evidence**: All checkboxes unchecked (CHK-001 through CHK-SIGN-002). Implementation-summary documents G1-G7 gates with 5/7 green, 30/30 bash -n, dry-run PASS, 25/25 validate_document PASS — but none captured in checklist.
- **Finding class**: class-of-bug (mirrors P1-004)
- **Recommendation**: Mark verified items `[x]` with evidence anchors. In-progress items remain `[ ]` with clear notes.

#### R1-P1-008: 002 `resource-map.md` entries all show PLANNED status

- **File**: `002-sandbox-testing-playbook/resource-map.md` (throughout)
- **Severity**: P1 (maintainability — stale resource map)
- **Evidence**: All scenario, script, and config entries show Status: PLANNED. Implementation-summary confirms all 23 scenarios, 31 sandbox files exist on disk. Resource map not refreshed.
- **Finding class**: class-of-bug (mirrors P1-006)
- **Recommendation**: Refresh resource map to OK status for all confirmed-on-disk files.

### P2

(none identified during inventory — deferred to dimension-specific iterations)

---

## Traceability Checks

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` (requirement → implementation evidence) | partial | 001 REQ-001..008 map to concrete file paths in spec.md §3, but checklist has no evidence links. 002 REQ-001..012 map to playbook paths. |
| `checklist_evidence` (criterion → verification artifact) | not-yet | Both child checklists have zero `[x]` items. Verification evidence exists in handover/implementation-summary but not captured in checklist. |
| `skill_agent` (commands → owning skill) | partial | Doctor commands under `.opencode/commands/doctor/` map to system-spec-kit skill. No @doctor agent detected (not required by spec). |
| `agent_cross_runtime` (4-runtime mirror integrity) | not-yet | Only `.opencode/commands/doctor/` surfaced. `.claude/`, `.codex/`, `.gemini/` mirrors not checked. |
| `feature_catalog_code` (resource-map → actual paths) | not-yet | Parent resource-map claims 140+ paths exist. Cross-check against disk deferred to iteration 8 (maintainability). |
| `playbook_capability` (002 scenarios → 001 surfaces) | partial | Spec cross-references exist (002 spec.md §4 cites 001 REQs), but per-scenario SOURCE FILES section fidelity not yet checked. |

---

## Verdict

**PENDING** — Inventory pass complete. No P0 findings. 8 P1 findings identified requiring correctness/traceability fixes. Dimension coverage: 0/4 (correctness, security, traceability, maintainability all pending deep passes).

---

## Next Dimension

Per strategy §41: **Iteration 2 focuses on correctness** — spec-code alignment, requirement traceability, checklist evidence verification. Will deep-read the 5 doctor command Markdown/YAML implementation surfaces against 001 spec.md REQ-001..008.

---

## SCOPE VIOLATIONS

(none — all reads and writes within allowed review packet paths)
