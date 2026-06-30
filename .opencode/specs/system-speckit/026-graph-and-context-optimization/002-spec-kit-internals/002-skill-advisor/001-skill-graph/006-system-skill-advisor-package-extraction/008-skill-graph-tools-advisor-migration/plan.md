---
title: "Implementation Plan: Move skill_graph_* tools to advisor ownership"
description: "Three-phase Level 3 plan for registering skill_graph_* on system_skill_advisor, cutting over consumers, and removing spec_kit_memory ownership."
trigger_phrases:
  - "skill graph advisor move plan"
  - "013/009/008 plan"
  - "skill_graph proxy cleanup"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/008-skill-graph-tools-advisor-migration"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Packet scaffolded by cli-codex"
    next_safe_action: "Implement Phase 1 inventory"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Move skill_graph_* tools to advisor ownership

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js MCP servers |
| **Servers** | `spec_kit_memory`, `system_skill_advisor`, `system_code_graph` consumers |
| **Testing** | Vitest, MCP smoke probes, grep inventories, strict spec validation |
| **Runtime Matrix** | OpenCode, Codex, Claude, Gemini |

### Overview

The move repeats the successful 004 to 005 to 006 shape at smaller scope: first make the advisor server expose the target tools, then give old callers a one-window proxy, then retarget consumers, then remove the memory-side bridge and descriptors after evidence is clean.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Baseline grep inventory captured for live old-server callers and plain `skill_graph_*` references.
- [ ] Handler dependency inventory captured for imports currently used by `handlers/skill-graph/*.ts`.
- [ ] Baseline `system-skill-advisor/mcp_server` Vitest pass count captured.
- [ ] Parent ADR-001, 005 ADR-003, 006 ADR-003/004, and 007 Option A deferral reviewed.

### Definition of Done

- [ ] `system_skill_advisor` registers all four `skill_graph_*` tools.
- [ ] Memory-side proxy exists only during the cutover window and is then removed.
- [ ] Consumer inventory shows zero live `mcp__mk_spec_memory__skill_graph_` callers.
- [ ] Four-runtime smoke matrix is recorded.
- [ ] Strict validation passes for packet 008, parent 013/009, and grandparent 013.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Target Ownership

| Layer | Current Owner | Target Owner | Notes |
|-------|---------------|--------------|-------|
| Public tool ids | `spec_kit_memory` | `system_skill_advisor` | Tool ids stay `skill_graph_*`; server prefix changes. |
| Tool descriptors/schemas | system-spec-kit MCP | system-skill-advisor MCP | Memory copy exists only as temporary proxy descriptors. |
| Handlers | `system-spec-kit/mcp_server/handlers/skill-graph/` | `system-skill-advisor/mcp_server/handlers/` | Move logic or extract neutral helpers only when dependency direction stays clean. |
| Live callers | Mixed plain ids and memory-prefixed allowed-tools | Advisor-prefixed MCP calls | `mcp__system_skill_advisor__skill_graph_*` is primary after cutover. |
| Historical specs | Existing packet docs | Historical only | Do not rewrite unrelated historical packets unless they are live instructions. |

### Consumer Inventory Baseline

The scaffold-time targeted inventory found 29 matches across 6 files in named consumer families:

| Consumer Family | Files | Baseline Matches | Cutover Action |
|-----------------|-------|------------------|----------------|
| Doctor route metadata | `.opencode/commands/doctor.md`, `.opencode/commands/doctor/update.md`, `.opencode/commands/doctor/_routes.yaml` | 12 | Replace allowed-tool prefixes with `mcp__system_skill_advisor__skill_graph_*`. |
| Doctor YAMLs | `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml`, `.opencode/commands/doctor/assets/doctor_update.yaml` | 4 | Retarget probes and status checks to advisor-owned tools. |
| Install guide | `.opencode/install_guides/SET-UP - Skill Advisor.md` | 13 | Update owner, DB wording, and command examples. |
| System-code-graph | To be re-grepped in Phase 1 | TBD | Retarget readiness reports that need skill graph status/query. |
| Hook wrappers | To be re-grepped in Phase 1 | TBD | Retarget runtime wrappers and prompt-time references. |
| Plugin bridges and catalogs | To be re-grepped in Phase 1 | TBD | Retarget bridge calls and user-facing docs. |

### Dependency Rule

Advisor owns the MCP boundary and handler entrypoints. If a handler needs code that currently lives under system-spec-kit, either move the helper into system-skill-advisor or extract a neutral shared helper only when the dependency direction is explicit and tested. Do not leave system-skill-advisor importing private memory-server handler files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 (SETUP)

- Inventory all live callers of `mcp__mk_spec_memory__skill_graph_*` and plain `skill_graph_*` across live code, hooks, commands, plugin bridges, guides, catalogs, and playbooks.
- Inventory existing handler dependencies for `scan`, `query`, `status`, and `validate`.
- Capture baseline `system-skill-advisor/mcp_server` Vitest pass count.
- Capture existing `spec_kit_memory` registration points: `tools/index.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/skill-graph-tools.ts`, handler tests, and context-server tests.

### Phase 2 (IMPLEMENTATION)

- **Cluster A - Advisor registration**: register descriptors, schemas, handlers, and tests on `system_skill_advisor`.
- **Cluster B - Memory proxy**: add one-window `spec_kit_memory` proxy that forwards to `system_skill_advisor`, logs deprecation once, and times out after 10 seconds.
- **Cluster C - Consumer cutover**: retarget consumers in risk order: system-code-graph, hooks, plugins, doctor YAMLs/commands, install guides, architecture docs, feature catalogs, and playbooks.
- **Cluster D - Deprecation removal**: after final grep proves zero direct old-server callers and operator confirms removal, delete memory-side proxy, descriptors, schemas, and stale primary handlers.

### Phase 3 (VERIFICATION)

- Run package-local advisor Vitest.
- Run targeted memory MCP tests that prove `skill_graph_*` no longer registers after cleanup.
- Run system-code-graph readiness smoke and hook wrapper smoke.
- Run OpenCode, Codex, Claude, and Gemini smoke matrix for `mcp__system_skill_advisor__skill_graph_*`.
- Run `doctor:update` or the closest non-destructive doctor smoke that exercises skill graph probes.
- Run final grep: no live `mcp__mk_spec_memory__skill_graph_` hits outside historical specs.
- Run strict validation for packet 008, parent 013/009, and grandparent 013.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor-local handler output and schema validation | Vitest |
| Integration | MCP server registration and dispatch | Advisor server tests, live MCP probes |
| Proxy | Old-server forwarding, once-only deprecation log, timeout path | Targeted memory MCP Vitest |
| Consumer | Doctor, hooks, plugin bridges, system-code-graph readiness | Targeted smoke commands |
| Runtime | OpenCode, Codex, Claude, Gemini tool visibility/callability | Runtime MCP listing or direct tool call |
| Documentation | Ownership claims and old-server grep | `rg`, strict validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 004 standalone advisor MCP | Internal | Shipped | Without it, target server cannot own tools. |
| Child 005 proxy pattern | Internal | Shipped | Proxy behavior would need a fresh decision. |
| Child 006 cleanup policy | Internal | Shipped | Stale docs/proxy removal would lack precedent. |
| Child 007 DB rename | Internal | Shipped | DB ownership language stays ambiguous without it. |
| Runtime MCP configs | Operational | Present but smoke required | Four-runtime matrix cannot pass if configs drift. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Cluster | Rollback Path | Verification After Rollback |
|---------|---------------|-----------------------------|
| Cluster A - Advisor registration | Revert advisor descriptors, schemas, handlers, and tests. | `system_skill_advisor` no longer lists `skill_graph_*`; advisor baseline tests return to prior count. |
| Cluster B - Memory proxy | Remove proxy descriptors and dispatch code if forwarding destabilizes memory MCP. | `spec_kit_memory` starts and existing pre-change `skill_graph_*` ownership remains. |
| Cluster C - Consumer cutover | Revert consumer retarget edits as one batch per consumer family. | Grep shows callers back at prior server prefix; runtime smoke uses memory server again. |
| Cluster D - Deprecation removal | Re-register descriptors, schemas, and proxy in `spec_kit_memory`. | Old-server calls resolve through proxy while root cause is fixed. |
| Docs sweep | Revert doc-only ownership wording if target topology is rolled back. | Install guides and catalogs match the active runtime state. |

Rollback must preserve tool-id stability. The emergency rollback changes server ownership back or restores the proxy; it must not rename `skill_graph_*`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | Required reads and baseline grep | All implementation clusters |
| Cluster A | Handler dependency inventory | Proxy, consumer cutover, runtime smoke |
| Cluster B | Cluster A callable advisor tools | Consumer cutover safety |
| Cluster C | Proxy active and new server callable | Cluster D removal |
| Cluster D | Zero-caller grep and operator confirmation | Completion claim |
| Phase 3: Verification | Clusters A-D | Strict validation and handoff |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:phase-deps -->
Phase dependencies mirror the L2 table: inventory blocks all clusters, advisor registration enables proxy behavior, proxy safety enables consumer cutover, and zero-caller evidence enables removal.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup inventory | Medium | 1-2 hours |
| Advisor registration | Medium | 1-2 hours |
| Proxy and tests | Medium | 1 hour |
| Consumer cutover | High | 2-3 hours |
| Cleanup and verification | High | 1-2 hours |
| Documentation updates | Medium | 1 hour |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:effort -->
Estimated total effort is 7-11 hours, with the highest uncertainty in consumer cutover and runtime smoke.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

Rollback trigger is any P0 failure that cannot be resolved inside the implementation packet: advisor server fails to start after registration, proxy breaks memory MCP startup, hidden callers remain after cutover, or runtime smoke proves the new server prefix is unavailable.

The safest rollback order is reverse cluster order: restore memory-side proxy/descriptors, revert consumer retargets, remove advisor registration if needed, then rerun memory MCP and advisor MCP smoke checks.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
Enhanced rollback restores the memory-side proxy first, then reverts consumer retarget batches, then removes advisor registration only if target-server startup is the failure source.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 1 inventory
  -> Cluster A advisor registration
  -> Cluster B memory proxy
  -> Cluster C consumer cutover
  -> Cluster D proxy removal
  -> Phase 3 verification
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Inventory | Required reads | Baseline callers and imports | All clusters |
| Advisor registration | Handler dependency map | New primary server tools | Proxy and runtime smoke |
| Memory proxy | Advisor callability | Compatibility window | Consumer cutover |
| Consumer cutover | Proxy safety | New server-prefixed callers | Proxy removal |
| Proxy removal | Zero-caller grep and confirmation | Single-owner topology | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Capture complete live caller inventory.
2. Register and test advisor-owned `skill_graph_*` tools.
3. Add the memory-side proxy.
4. Retarget session-critical consumers before documentation surfaces.
5. Remove memory-side ownership only after zero-caller evidence.
6. Run full runtime, package, grep, and strict-validation matrix.

**Total Critical Path**: 7-11 hours estimated.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup inventory | Baseline grep, imports, and tests recorded | Phase 1 |
| M2 | Advisor primary owner | New server lists and dispatches all four tools | Cluster A |
| M3 | Compatibility window | Memory proxy forwards and logs deprecation once | Cluster B |
| M4 | Consumers moved | Final live callers use `system_skill_advisor` prefix | Cluster C |
| M5 | Release ready | Proxy removed and validation matrix recorded | Phase 3 |
<!-- /ANCHOR:milestones -->
