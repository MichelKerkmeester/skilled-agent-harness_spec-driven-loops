---
title: "Implementation Plan: Validate advisor extraction and remove deprecated bridge"
description: "Three-phase plan for inventory, cleanup, and final validation of the standalone system_skill_advisor extraction."
trigger_phrases:
  - "013/009/006 plan"
  - "advisor extraction validation plan"
  - "system_skill_advisor cleanup plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/006-clean-validation-and-remove-deprecated-code"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Validation cleanup landed; P0 tests blocked"
    next_safe_action: "Fix system-skill-advisor package-local Vitest/path failures, then rerun final matrix"
    blockers:
      - "Package-local system-skill-advisor Vitest failed: 153 passed / 71 failed / 38 files."
      - "Hook smoke failed one settings-driven suite because expected Claude settings file is absent."
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0130090060000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-006-validation-cleanup"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Cleanup order: validate first, remove proxy second, rerun full matrix third."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Validate Advisor Extraction and Remove Deprecated Bridge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server, Node launcher, Python shim, shell hooks |
| **Framework** | MCP tool handlers with Vitest and Python parity tests |
| **Storage** | SQLite `skill-graph.sqlite` under `system-skill-advisor/mcp_server/database/` |
| **Testing** | Package-local Vitest, Python parity, hook smoke, runtime MCP probes, grep inventories |

### Overview

This packet finishes the extraction by proving the new advisor package owns its runtime and test surface before deleting compatibility debt. The work starts with evidence collection, removes only the bridge and stale live references once callers are clean, then runs the full cross-runtime matrix that supports a completion claim.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Children 003, 004, and 005 have landed or their required deliverables are present in the worktree.
- [ ] Runtime config inventory identifies OpenCode, Codex, Claude, and Gemini MCP config files.
- [ ] Initial grep inventory captures old `mcp_server/skill_advisor/` references and second-server warnings.
- [ ] Operator confirmation is available for ADR-003 bridge removal when zero-caller evidence is ready.

### Definition of Done

- [ ] REQ-001 through REQ-005 pass without deferral.
- [ ] REQ-006 through REQ-008 pass or have explicit user-approved deferral.
- [ ] REQ-009 is recorded as pass or documented as a P2 deferral.
- [ ] `spec_kit_memory` no longer exposes advisor proxy tool ids.
- [ ] Strict spec validation for this packet exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Standalone MCP ownership with compatibility bridge removal.

### Key Components

- **`system_skill_advisor` MCP server**: final owner of `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`.
- **`spec_kit_memory` MCP server**: memory-only server after cleanup; no advisor proxy tools remain.
- **Runtime MCP configs**: OpenCode, Codex, Claude, and Gemini each launch both servers.
- **Advisor DB resolver**: owns default SQLite path under `system-skill-advisor/mcp_server/database/`.
- **Hooks and Python shim**: consumer surfaces that must call the standalone advisor server after child 005.
- **Install guides and skill docs**: operator-facing topology documentation.

### Data Flow

Advisor requests enter through runtime MCP clients and route to `system_skill_advisor`. The advisor server reads its package-local skill graph database and returns `advisor_*` tool responses. `spec_kit_memory` continues serving memory tools only and does not proxy advisor calls after this packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/mcp_server` | Standalone advisor package | Validate package-local test discovery and DB path ownership | Vitest pass, DB cold-start evidence |
| `system-spec-kit/mcp_server` | Memory MCP and temporary bridge host | Remove advisor proxy registrations and imports | Tool-schema inspection, grep for `advisor_` dispatch paths |
| Runtime configs | MCP server launcher registry | Confirm both servers are registered | Four-config inspection and live runtime probes |
| Hook wrappers | Runtime caller bridge | Verify calls target standalone server | Hook smoke tests |
| Python shim | CLI/parity caller surface | Validate moved imports and behavior | Python parity test pass |
| Skill docs and install guides | Operator instructions | Remove old-path references and invalid warnings | Grep inventory plus manual review |

Required inventories:

- `rg -n 'mcp_server/skill_advisor/' .opencode --glob '*.md' --glob '*.ts' --glob '*.js' --glob '*.json' --glob '*.py' --glob '*.sh'`
- `rg -n 'DO NOT register a second MCP server|second MCP server|spec_kit_memory\\.advisor_|advisor_recommend|advisor_rebuild|advisor_status|advisor_validate' .opencode`
- Runtime matrix rows: OpenCode, Codex, Claude, Gemini.
- Probe matrix rows: config presence, launcher start, `advisor_recommend`, DB path, install-doc review.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Inventory residual old-path references and classify each as live, historical, or false-positive.
- [ ] Build package-local Vitest discovery from `system-skill-advisor/mcp_server/`.
- [ ] Capture pre-removal baseline: Vitest pass count, Python parity status, hook smoke status, and grep hit list.
- [ ] Inspect four runtime MCP configs for `spec_kit_memory` and `system_skill_advisor`.

### Phase 2: Implementation

- [ ] Remove the `spec_kit_memory` advisor proxy once ADR-003 zero-caller evidence and operator confirmation are present.
- [ ] Remove bridge deprecation hints and fail-fast messages tied to the retired old surface.
- [ ] Clean stale live doc references to `mcp_server/skill_advisor/`.
- [ ] Remove invalid "DO NOT register a second MCP server" warnings from live operator docs.
- [ ] Rerun focused tests after each removal cluster before moving to the next cluster.

### Phase 3: Verification

- [ ] Run full package-local Vitest from `system-skill-advisor/mcp_server/`.
- [ ] Run Python parity tests against the moved shim.
- [ ] Run hook smoke tests.
- [ ] Validate all four runtime configs and run `advisor_recommend` live probes.
- [ ] Verify DB default path under the new package across cold-start runs.
- [ ] Review both skill install guides for final topology accuracy.
- [ ] Inspect final MCP tool schemas to confirm old `spec_kit_memory.advisor_*` ids are absent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor handlers, schemas, scorer lanes, DB resolver | Package-local Vitest |
| Parity | Python shim behavior against moved package | Python test runner used by the shim |
| Integration | Runtime MCP config and launcher behavior | Runtime-specific MCP inspection and live probes |
| Smoke | Hooks and wrappers after cutover | Hook smoke scripts |
| Static | Old path, proxy ids, invalid warnings | `rg`, JSON/TOML/config inspection |
| Documentation | Install guide and skill doc accuracy | Manual review with grep evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ADR-001 | Internal decision | Accepted | Defines standalone MCP, stable `advisor_*` ids, and temporary bridge window. |
| Child 003 | Internal packet | Expected complete | Provides moved source, DB resolver, and package-local configs. |
| Child 004 | Internal packet | Required before execution | Provides launcher and four-runtime MCP config entries. |
| Child 005 | Internal packet | Required before execution | Provides consumer cutover and temporary bridge behavior to remove. |
| Operator confirmation | Manual gate | Required for ADR-003 | Blocks proxy removal even when grep evidence is clean. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any runtime loses `advisor_recommend`, package-local tests fail after cleanup, or a live caller still targets `spec_kit_memory.advisor_*`.
- **Procedure**: Revert the cleanup cluster that removed the proxy or stale reference, restore the last passing runtime config state, rerun the focused failing probe, and keep the bridge until caller evidence is clean.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Implementation) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 003-005 deliverables | Implementation |
| Implementation | Setup inventory, zero-caller evidence, operator confirmation | Verification |
| Verification | Cleanup applied | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Implementation | Medium | 2-4 hours |
| Verification | High | 2-3 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-cleanup Checklist

- [ ] Baseline tests captured.
- [ ] Runtime config state captured.
- [ ] Old-path grep inventory saved in implementation summary.
- [ ] Operator confirms bridge removal after zero-caller evidence.

### Rollback Procedure

1. Restore the removed proxy cluster if a hidden caller is found.
2. Restore any deprecation hint only if it points to the standalone server and does not revive old-path instructions.
3. Rerun package-local Vitest and the failing runtime probe.
4. Record the rollback in `implementation-summary.md`.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: No database migration is expected. DB path validation must not delete package-local SQLite data.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
ADR-001
  |
  v
Child 003 source move -> Child 004 launcher/configs -> Child 005 consumer cutover
                                                        |
                                                        v
                                             006 setup inventory
                                                        |
                                                        v
                                      bridge/doc cleanup + final matrix
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Package-local tests | Child 003 | New-folder validation evidence | Cleanup confidence |
| Runtime configs | Child 004 | Four-runtime config evidence | Live probes |
| Consumer cutover | Child 005 | Zero-caller evidence | Proxy removal |
| Proxy cleanup | Zero callers, operator confirmation | Memory-only `spec_kit_memory` | Final schema inspection |
| Doc cleanup | Old-path inventory | Accurate install docs | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Residual reference and caller inventory** - 30-45 minutes - CRITICAL
2. **Package-local Vitest and runtime config baseline** - 45-60 minutes - CRITICAL
3. **Proxy and stale-doc cleanup** - 90-180 minutes - CRITICAL
4. **Full cross-runtime smoke matrix** - 90-120 minutes - CRITICAL

**Total Critical Path**: 4-7 hours.

**Parallel Opportunities**:

- Install-guide review can run alongside runtime config inspection.
- Python parity and hook smoke can run after package-local tests pass.
- Final grep inventory can run alongside JSON/config schema checks.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Baseline captured | Initial tests and grep inventory recorded. |
| M2 Cleanup applied | Proxy, deprecation hints, and stale live docs removed. |
| M3 Runtime verified | Four runtime probes pass against `system_skill_advisor`. |
| M4 Completion ready | Checklist and implementation summary contain evidence. |
<!-- /ANCHOR:milestones -->
