---
title: "Feature Specification: 013 Doctor Update Orchestrator"
description: "Add 4 isolated /doctor:* commands for the uncovered subsystems (memory, causal-graph, deep-loop, cocoindex) plus a unified /doctor:update orchestrator that rebuilds every spec-kit database in dependency-safe order with snapshot+rollback. Closes the gap for users at older versions (e.g., 3.3.0.0) who need a one-shot path to align all databases with their current codebase."
trigger_phrases:
  - "013-doctor-update-orchestrator"
  - "doctor update command"
  - "spec kit version migration"
  - "rebuild all databases"
  - "doctor memory"
  - "doctor causal-graph"
  - "doctor deep-loop"
  - "doctor cocoindex"
  - "cross-subsystem health dashboard"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands"
    last_updated_at: "2026-05-09T11:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec for 4 isolated doctor commands + unified /doctor:update orchestrator"
    next_safe_action: "Author packet docs"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/code-graph.md"
      - ".opencode/commands/doctor/skill-advisor.md"
      - ".opencode/commands/doctor/assets/doctor_code-graph.yaml"
      - ".opencode/skills/system-spec-kit/mcp_server/database/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-doctor-update-orchestrator"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "memory_index_scan(incremental=false) transaction granularity — per-batch commits or single tx? Affects council Q3+Q6 cancel-safety contract."
      - "Should /doctor:update use one tier-aware interactive mode? (Mode reduction later made this authoritative.)"
    answered_questions:
      - "Spec location: new child 013-... inside 026 (user choice)"
      - "Scope: both unified /doctor:update + 4 isolated /doctor:* commands (user choice)"
      - "Council lens anchor: operational safety / blast radius (user choice)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 013 Doctor Update Orchestrator

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Superseded By** | ../003-router-phase/ and ../005-cutover-phase/ (router consolidation + cutover, 2026-05-11) |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-causal-graph-channel-routing |
| **Successor** | None |
| **Handoff Criteria** | All 5 new doctor commands pass `validate_document.py --type command` and exhibit clean YAML loads. `/doctor:update` end-to-end smoke test on this repo detects 2 stale subsystems (causal-edges <60%, deep-loop-graph empty) and offers remediation. Concurrent dispatch refused via flock. Strict spec-folder validate exits 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 13 of the 026 graph-and-context-optimization wrapper. The 010-graph-impact and 011-cocoindex-daemon and 012-causal-graph wrappers added the underlying systems (causal trust display, daemon resilience, channel routing); this phase exposes them as doctor commands so users can rebuild + maintain them via the standard `/doctor:*` surface. Closes the gap left by v3.4.1.0 which shipped the doctor pattern for `code-graph`, `skill-advisor`, `skill-budget`, `mcp_install`, and `mcp_debug` but not the four other databases.

**Scope Boundary**: Author 5 new commands (4 isolated + 1 unified orchestrator) + 10 YAML assets (8 doctor commands + 2 MCP variants) + 1 migration manifest + (optional) per-version migration scripts. Does NOT modify any MCP server code beyond surfacing existing tools through the new commands.

**Dependencies**:
- Existing `/doctor code-graph` Markdown + YAML pattern (precedent for shape)
- Existing MCP tools (no new tools): `memory_index_scan`, `memory_health`, `memory_causal_stats`, `memory_causal_link`, `memory_drift_why`, `deep_loop_graph_status`, `deep_loop_graph_query`, `deep_loop_graph_upsert`, `deep_loop_graph_convergence`, `ccc_status`, `ccc_reindex`, `ccc_feedback`, `code_graph_scan`, `code_graph_status`, `skill_graph_scan`, `advisor_status`, `advisor_rebuild`, `eval_run_ablation`, `session_health`
- Existing canonical-path validator pattern (per `doctor_skill-advisor.yaml:49-70`)

**Deliverables**:
- 4 isolated doctor commands: `/doctor memory`, `/doctor causal-graph`, `/doctor deep-loop`, `/doctor cocoindex`
- 1 unified orchestrator: `/doctor:update` with tier-aware prompts
- 1 migration manifest (`migration-manifest.json`) for users skipping versions
- 10 YAML asset files (8 doctor commands + 2 MCP variants)
- Cross-subsystem health dashboard (rendered by orchestrator Step 4)
- State-log file format (`.doctor-update.last-run.json`) for run audit trail
- Tests: command-doc validation + YAML loads + end-to-end smoke (auto/confirm/concurrent/SIGINT) + migration gap detection

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A user at spec-kit `v3.3.0.0` (or any version older than `v3.4.1.0`) has 6+ databases that drift out of alignment with their codebase: `context-index.sqlite` (memory FTS+vector, 134M+362M), `code-graph.sqlite` (51M structural index), `skill-graph.sqlite` (148K), `deep-loop-graph.sqlite` (84K coverage graphs), `speckit-eval.db` (16M ablation results), and `causal_edges` table (in context-index, lazy-init).

To bring them all in sync today, the user must:
1. Know the dependency DAG (code-graph → memory → causal → skill-graph → advisor)
2. Manually invoke each subsystem's MCP tools or scripts (`code_graph_scan`, `memory_index_scan`, `memory_causal_link`, `skill_graph_scan`, `advisor_rebuild`, `deep_loop_graph_upsert`, `ccc_reindex`)
3. Detect partial failures and restore from manual backups (no automatic snapshot+rollback)
4. Avoid concurrent dispatch (no lock primitive)
5. Manage version-skip migrations themselves (3.3.0.0 retired `memory/*.md` files, 3.4.0.0 added `graph-metadata.json` to every spec folder, 3.4.1.0 added doctor commands and tree-sitter parser recovery)

There is **no** unified entry point, **no** cross-subsystem health dashboard, and **no** snapshot+rollback orchestration. Four subsystems have **no** `/doctor:*` coverage at all (memory, causal-graph, deep-loop, cocoindex).

### Purpose

Ship a one-shot doctor surface that:
1. **Closes coverage gaps** — author 4 isolated `/doctor:*` commands matching the existing pattern.
2. **Adds unified orchestration** — `/doctor:update` chains rebuilds in dependency-safe order with snapshot, gold-battery validation, and rollback.
3. **Adds version migration** — `migration-manifest.json` lets users skipping multiple versions safely upgrade to current schema.
4. **Honors operational safety** (council anchor lens) — flock-based concurrent dispatch protection, `VACUUM INTO` snapshots, graceful SIGINT cancellation, MCP-client-activity probe, tier-aware tier-aware interactive mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **5 new commands** under `Public/.opencode/commands/doctor/`:
  - `memory.md`, `causal-graph.md`, `deep-loop.md`, `cocoindex.md` (4 isolated)
  - `update.md` (unified orchestrator)
- **10 YAML assets** under `Public/.opencode/commands/doctor/assets/`:
  - one bare YAML each for memory, causal-graph, deep-loop, and cocoindex
  - one bare YAML for the update orchestrator
- **Migration manifest** at `Public/.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json`
- **Optional migration scripts** at `mcp_server/scripts/migrations/` for the 3.3.0.0 → 3.4.1.0 chain
- **State-log format** at `database/.doctor-update.last-run.json` for run audit trail
- **Cross-subsystem health dashboard** rendered as part of `/doctor:update` Step 4
- **013 packet docs** (this folder): spec, plan, tasks, checklist, resource-map, decision-record, description.json, graph-metadata.json
- **Verification**: G1-G9 gates per plan.md §5

### Out of Scope

- **MCP-server-level write-path lock check** — global lock awareness for all MCP write tools; defer to follow-on packet
- **`/doctor:update` daemon mode** — long-lived watch-and-rebuild semantics; defer
- **Auto version detection from MCP server** — manifest reads user-declared version only
- **GUI / web dashboard** — text dashboard only
- **Backporting doctor commands to v3.3.0.0** — users at older version must upgrade then run `--migrate`
- **Eval-driven optimization** — `eval_run_ablation` invoked for measurement only; auto-tuning out of scope
- **Mirror sync to Barter clone** — canonical Public deliverable; clone via existing one-way mirror

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/memory.md` | Create | `/doctor memory` Markdown entrypoint |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Create | one single-mode YAML asset |
| `.opencode/commands/doctor/causal-graph.md` | Create | `/doctor causal-graph` Markdown entrypoint |
| `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` | Create | one single-mode YAML asset |
| `.opencode/commands/doctor/deep-loop.md` | Create | `/doctor deep-loop` Markdown entrypoint |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Create | one single-mode YAML asset |
| `.opencode/commands/doctor/cocoindex.md` | Create | `/doctor cocoindex` Markdown entrypoint |
| `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` | Create | one single-mode YAML asset |
| `.opencode/commands/doctor/update.md` | Create | `/doctor:update` orchestrator Markdown entrypoint |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Create | one single-mode YAML asset |
| `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` | Create | Per-version deprecations + migration script declarations |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/*.{py,sh,ts}` | Create (optional) | Per-version migration scripts |
| `.opencode/specs/system-spec-kit/026-.../013-doctor-update-orchestrator/{spec,plan,tasks,checklist,resource-map,decision-record,implementation-summary}.md` | Create | Level 2 packet docs |
| `.opencode/specs/system-spec-kit/026-.../013-doctor-update-orchestrator/{description,graph-metadata}.json` | Create (auto) | Via `generate-context.js` |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json` | Modify | Update `derived.last_active_child_id` → `013-doctor-update-orchestrator` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 new command Markdown files pass `validate_document.py --type command` with `valid: true, total_issues: 0` | Per-file validation exit 0 |
| REQ-002 | All 10 YAML asset files load cleanly via the canonical-path validator pattern (per `doctor_skill-advisor.yaml:49-70`) | Schema load + `realpath` validation exit 0 |
| REQ-003 | Strict spec-folder validate on 013 packet exits 0 | `validate.sh 013-... --strict` exit 0 |
| REQ-004 | `/doctor:update` orchestrator implements all 10 lines of the council spec | Per-line evidence in tasks.md + decision-record.md |
| REQ-005 | flock primitive at `database/.doctor-update.flock` refuses concurrent dispatch with helpful holding-PID message | G6 smoke test passes |
| REQ-006 | `VACUUM INTO` snapshot mechanism captures every `*.sqlite` before any mutation before mutation | G7 smoke test passes (snapshot file count = sqlite file count post-mutation) |
| REQ-007 | Cross-subsystem health dashboard renders all 7 subsystems (code-graph, context-index, causal-edges, skill-graph, advisor, deep-loop, cocoindex, eval) with status + age + recommended action | G9 smoke test passes; dashboard text matches expected shape |
| REQ-008 | Migration manifest exists and declares the 3.3.0.0 → 3.4.1.0 chain | File exists at expected path; per-version blocks for 3.3.0.0, 3.4.0.0, 3.4.1.0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | `decision-record.md` captures all 7 council questions as ADRs with chosen answer + rationale | 7 ADR sections present |
| REQ-011 | SIGINT cancellation safety — graceful tx-commit + snapshot-restore before mutation | G7 smoke test: SIGINT mid-rebuild produces exit 130 + snapshot restored |
| REQ-012 | One auto-retry with 5-sec backoff on step failure before rollback | YAML asset includes retry block; G5 smoke test verifies |
| REQ-013 | Tier-aware interactive mode (no suffix) — short steps auto, medium combined-prompt, long-pole explicit-prompt-with-ETA | YAML asset routing logic; manual UX inspection |
| REQ-014 | `--force`, `--no-snapshot`, `--cleanup-legacy`, `--migrate`, `--keep-snapshots` flags wired into Markdown setup phase | Markdown file lists each flag with purpose; YAML routes each to appropriate behavior |
| REQ-015 | State-log JSON written at completion (success or failure) — schema documented | `.doctor-update.last-run.json` schema in resource-map.md or decision-record.md |
| REQ-016 | `memory_index_scan` transaction model documented in `decision-record.md` ADR | ADR cites `handlers/memory-index.ts:handleMemoryIndexScan` line range with finding |
| REQ-017 | Gold-battery validation per subsystem post-rebuild — regression auto-rolls back in single interactive command | Each single-mode YAML includes post-verify behavior for mutating phases; orchestrator chains them |

### P2 - Nice-to-have (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Per-version migration scripts authored under `mcp_server/scripts/migrations/` for the full 3.3.0.0 → 3.4.1.0 chain | Scripts exist + idempotent; OR `decision-record.md` documents incremental authoring path |
| REQ-021 | External GPT-5.5 high second-opinion dispatch via `cli-codex` on the 7 council questions before final command authoring | `decision-record.md` cites the dispatch + key divergences from internal council; OR documents waiver |
| REQ-022 | Auto-cleanup of snapshots > 30 days unless `--keep-snapshots` | Cleanup logic in YAML; manual smoke OK |
| REQ-023 | Disk-free preflight check — refuse if disk free < 2× DB total | YAML asset includes preflight; smoke test verifies |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 command Markdown files exist + pass `validate_document.py --type command`.
- **SC-002**: All 10 YAML asset files exist + load cleanly + canonical-path-validate.
- **SC-003**: `/doctor:update --no-snapshot` smoke test on this repo: detects 2 stale subsystems (causal <60%, deep-loop empty), exits 0, prints dashboard.
- **SC-004**: Concurrent `/doctor:update` invocations: second refused with helpful holding-PID message.
- **SC-005**: SIGINT mid-rebuild: graceful exit 130 + snapshot restored + state log written.
- **SC-006**: Migration manifest exists at expected path + declares 3.3.0.0 → 3.4.1.0 chain.
- **SC-007**: `decision-record.md` captures 7 council ADRs + tx-model finding.
- **SC-008**: Strict spec-folder validate on 013 packet exits 0.
- **SC-009**: Cross-subsystem dashboard renders all 7 subsystems correctly.
- **SC-010**: `_memory.continuity.completion_pct` reaches 100 in `implementation-summary.md` only after all P0/P1 items marked.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `memory_index_scan` tx granularity unknown | Cancel-safety contract under-specified | REQ-016 makes it a Phase A.1 task; default plan assumes per-batch |
| Risk | MCP server lock contention with active client sessions | Concurrent rebuild can corrupt WAL | flock + connection probe + warn-and-prompt |
| Risk | Snapshot disk usage (~600 MB context-index alone) | Disk-free exhaustion mid-snapshot | Preflight refuse if disk < 2× DB total |
| Risk | Concurrent dispatch from N parallel Claude sessions | Memory caveat says user runs N parallel by default | OS-level flock + PID-file fallback; refuse with holding-PID message |
| Risk | SIGINT mid-rebuild | WAL inconsistency | Graceful cancel — set flag → finish in-flight tx → snapshot-restore |
| Risk | `cli-opencode`/`cli-codex` could land mid-rebuild | External dispatch ignores doctor lock | Out of scope for 013; track in follow-on packet |
| Risk | `generate-context.js` regenerates parent graph-metadata.json and drops manual fields | Parent metadata loses `parent_id`, `manual.depends_on` | Restore manual fields after every save (memory rule) |
| Risk | Auto-branch from `create.sh` against memory rule | Diverges from main | After scaffold, switch back to main and delete packet branch |
| Dependency | Existing `/doctor code-graph` shape | Source of truth for command pattern | Read fully before authoring any new command; reuse YAML structure |
| Dependency | MCP tool stability | All 18+ MCP tools called by orchestrator | Pin to `v3.4.1.0` MCP server contract |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Operational Safety (council anchor)

- **NFR-OS01**: No mutation without snapshot before mutation (REQ-006).
- **NFR-OS02**: No concurrent dispatch (REQ-005).
- **NFR-OS03**: No silent partial-failure — auto-retry-then-rollback OR confirm-prompt (REQ-012).
- **NFR-OS04**: SIGINT graceful (REQ-011).

### Idempotency

- **NFR-I01**: Re-running `/doctor:update` on a fresh repo is a no-op (status check only).
- **NFR-I02**: Re-running after partial failure resumes from checkpoint OR restores from snapshot — never half-done state.
- **NFR-I03**: Migration manifest scripts are idempotent — re-running produces same final state.

### UX

- **NFR-UX01**: Tier-aware prompts — short steps auto, medium combined, long-pole explicit (REQ-013).
- **NFR-UX02**: Progress logged with timestamps; long-pole shows ETA.
- **NFR-UX03**: Error messages include the holding PID for flock contention; never silent failure.

### Reuse

- **NFR-R01**: All 5 commands follow the canonical `/doctor code-graph` shape (Markdown entrypoint + Execution Protocol + Constraints + Unified Setup Phase + single-mode YAML).
- **NFR-R02**: Canonical-path validator pattern reused for all mutation boundaries.
- **NFR-R03**: No new MCP server code — all MCP tools already exist; this packet exposes them through commands.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### File System

- **Disk near full** — preflight check refuses if free < 2× DB total. Document the threshold and user override (`--no-snapshot`).
- **Snapshot path collision** — versioned filename embeds version + ISO timestamp. Worst case: same-second invocations collide; mitigate via subsecond suffix or refuse.
- **Stale snapshot cleanup** — auto-remove > 30 days unless `--keep-snapshots`. Cleanup runs at orchestrator end, not start, so a failed run can still be debugged.

### Concurrency

- **flock unavailable** — fallback to PID-file with stale-detection (PID dead OR timestamp > 2h). Document the behavior in YAML asset.
- **MCP-client active** — warn + prompt; `--force` overrides. Brief connection probe via `pragma database_list` or equivalent.
- **Two `/doctor:update` invocations land in the same second** — flock acquisition is atomic; second invocation gets the lock-held error path.

### Cancellation

- **SIGINT during snapshot phase** — abort snapshot cleanly (no partial snapshot files left behind). Exit 130 fast.
- **SIGINT during rebuild** — graceful cancel — set flag → wait for current SQLite tx commit/abort (~30 sec settle) → restore snapshot of in-flight DB.
- **SIGKILL** — non-recoverable. State log not written. Next run detects orphaned flock and offers to clean up.

### Migration

- **Version skip > 1 minor** — auto-trigger `migration-manifest` Phase 0; refuse if manifest gap.
- **Unknown version** — refuse with helpful "no migration path declared from <version>" error.
- **Same version** — skip migration phase entirely; proceed to rebuild.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 5 new commands × ~3 files each ≈ 26 files; 1 manifest; doc+yaml authoring is the bulk |
| Risk | 13/25 | Council anchor was operational safety; tx-model unknown is biggest unmitigated risk |
| Research | 10/20 | Council 3-round deliberation done; per-tool MCP semantics need verification mid-implementation |
| **Total** | **41/70** | **Level 2** (above L1 baseline due to cross-subsystem orchestration + safety surface) |

### Notes

- Higher scope than 002 or 003 (5 commands vs 4 skill optimizations); lower per-file complexity (no LOC-reduction work).
- Risk concentrated in the orchestrator (Phase C); isolated commands are mostly templated from `/doctor code-graph`.
- Level 3 not chosen because no new MCP server code, no schema migrations beyond manifest declarations, no new architecture.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(All resolved at intake or deferred to implementation — kept for audit trail.)

- **Q-A** *(answered 2026-05-09)*: Spec location? **Answer**: New child 013-doctor-update-orchestrator/ inside 026 (user choice).
- **Q-B** *(answered 2026-05-09)*: Scope — unified, isolated, or both? **Answer**: Both (4 isolated + 1 unified orchestrator) (user choice).
- **Q-C** *(answered 2026-05-09)*: Council lens? **Answer**: Operational safety / blast radius (user choice).
- **Q-D** *(deferred to Phase A.1)*: `memory_index_scan` tx granularity? **Action**: Implementer reads `handlers/memory-index.ts:handleMemoryIndexScan` and records finding as ADR-001 in `decision-record.md`.
- **Q-E** *(deferred to optional REQ-021)*: External GPT-5.5 high dispatch? **Action**: Optional `cli-codex` second-opinion on the 7 council questions; document waiver in decision-record.md if skipped.
<!-- /ANCHOR:questions -->

---

<!--
CORE + L2 SPEC (~280 lines)
- 5 new doctor commands (4 isolated + 1 unified orchestrator)
- 10 YAML assets matching canonical /doctor code-graph pattern
- Migration manifest for 3.3.0.0 → 3.4.1.0 chain
- Council anchor: operational safety; 7 ADRs in decision-record.md
- Implementation: doc + command-yaml + manifest; no new MCP server code
-->

---

## Consolidation (2026-05-16, packet 107 W2.6 / M7)

Packet 013/002-sandbox-testing-playbook absorbed into 013/001-doctor-commands per resource-map.md §3.3 M7. Both were superseded by 013/004 + 013/005 (router + cutover phases). Source archived to z_archive/wave-2-merges/.
