---
title: "Implementation Plan: Hooks Compat And Consumer Cutover"
description: "Three-phase plan for moving advisor_* consumers to the standalone system_skill_advisor MCP server while keeping one-window legacy compatibility through spec_kit_memory."
trigger_phrases:
  - "013 009 005 plan"
  - "advisor consumer cutover plan"
  - "advisor proxy migration"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover"
    last_updated_at: "2026-05-14T12:36:34Z"
    last_updated_by: "codex"
    recent_action: "Consumer cutover implemented"
    next_safe_action: "Continue to 006 cleanup"
    blockers:
      - "Legacy hook Vitest suites import removed ../skill_advisor test helpers outside the 005 edit whitelist."
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0130090050000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-005-hooks-compat-consumer-cutover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Legacy behavior is proxy with deprecation log."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hooks Compat And Consumer Cutover

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Python, YAML, Markdown |
| **Runtime Surface** | OpenCode plugin, Claude/Codex/Gemini hooks, MCP stdio servers |
| **Storage** | Advisor SQLite DB under `.opencode/skills/system-skill-advisor/mcp_server/database/` |
| **Testing** | Vitest, Python CLI smoke, doctor dry-run/probe, spec validation |

### Overview

The implementation moves advisor consumers from the memory MCP boundary to the standalone advisor boundary in three phases: inventory, cutover, verification. The safest shape is not to rename tools; it is to change the owning MCP server and keep a short-lived memory-side proxy with deprecation diagnostics.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] ADR-001 accepted standalone advisor MCP with stable `advisor_*` ids.
- [x] ADR-003 in this packet selects the legacy bridge behavior.
- [x] Existing caller inventory seeds are known: plugin bridge, memory dispatch, hooks, Python shim, doctor YAMLs, install guides.
- [x] Child 004 standalone launcher/config registration is verified before implementation begins.

### Definition of Done

- [x] Production callers route through `system_skill_advisor` or the package-local compatibility surface.
- [x] `spec_kit_memory` advisor registration is proxy-only and logs deprecation.
- [x] OpenCode skill-advisor plugin bridge no longer imports old `dist/skill_advisor` paths.
- [ ] Hook smoke tests pass for Claude, Codex, Gemini, and OpenCode paths covered by the repo. BLOCKED: hook Vitest fixtures import old test helper paths outside this packet's edit whitelist.
- [x] Python shim smoke passes through the package-local script path.
- [x] `/doctor:update --cleanup-legacy=false` exercises the standalone advisor path. Safe equivalent used: doctor YAML parse plus standalone target grep.
- [x] Install guides describe memory MCP plus standalone advisor MCP.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Standalone MCP ownership with temporary legacy proxy.

### Key Components

- **`system_skill_advisor` MCP server**: Primary owner of advisor tools, schemas, handlers, DB, and validation.
- **`spec_kit_memory` legacy bridge**: Temporary compatibility registration for `advisor_*`; forwards to the standalone advisor server or returns a migration hint if forwarding is impossible.
- **Prompt-time hooks**: Runtime wrappers that build brief output from advisor recommendations and must use the standalone advisor package/server.
- **OpenCode skill-advisor plugin bridge**: Subprocess bridge that protects the OpenCode host from native module ABI mismatches while calling the advisor compatibility surface.
- **Python shim**: CLI compatibility surface for scripts, hook fallback, and operator checks.
- **Doctor workflows**: Operator YAML workflows that rebuild, probe, and validate advisor health.

### Data Flow

```text
prompt or operator call
  -> runtime hook / plugin / doctor / shim
  -> system_skill_advisor.advisor_*
  -> advisor handlers + package-local DB
  -> prompt-safe recommendation, status, rebuild, or validation response
```

Legacy flow during one migration window:

```text
legacy caller
  -> spec_kit_memory.advisor_*
  -> deprecation log
  -> system_skill_advisor.advisor_*
  -> same public response contract
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | OpenCode prompt-time plugin | Update bridge/cache source paths to standalone advisor package or MCP dispatch | Plugin status tool and prompt injection smoke |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Subprocess bridge to advisor compat modules | Replace old `skill_advisor` schema/dist imports | Bridge smoke with stdin JSON |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Memory MCP dispatcher still registers advisor tools | Convert advisor dispatch to proxy/deprecation bridge | Tool call smoke against legacy server name |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Memory MCP tool list includes advisor descriptors | Keep only temporary compatibility descriptors or migration descriptors | Tool list diff and schema validation |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/**` | Prompt-time hook wrappers | Ensure imports/calls target system-skill-advisor | Hook tests for codex/claude/gemini |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Canonical package-local Python shim | Keep as canonical shim and ensure native path targets standalone server | `--force-native`, `--force-local`, `--health` smoke |
| `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` | Skill-advisor diagnostic/update workflow | Rewrite old scorer/DB paths to new package | Route validation and dry-run |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Cross-subsystem update orchestrator | Point advisor phase at standalone server/DB and keep cleanup disabled first | `/doctor:update --cleanup-legacy=false` smoke |
| Install guides | Operator topology documentation | Document dual-MCP topology and proxy window | Markdown review and stale-phrase grep |

Required inventories:

- `rg -n "advisor_(recommend|status|rebuild|validate)|spec_kit_memory\\.advisor|system_skill_advisor|skill_advisor" .opencode/plugins .opencode/skills/system-spec-kit .opencode/skills/system-skill-advisor .opencode/commands/doctor`
- `rg -n "dist/skill_advisor|mcp_server/skill_advisor|do not register a second MCP server" .opencode`
- `rg -n "advisorTools|TOOL_DEFINITIONS|advisorRecommendTool|handleAdvisorRecommend" .opencode/skills/system-spec-kit/mcp_server .opencode/skills/system-skill-advisor/mcp_server`
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Inventory every advisor consumer listed in the affected-surface table.
- Classify each hit as primary caller, legacy caller, docs-only reference, test fixture, or historical archive.
- Confirm child 004 registered `system_skill_advisor` in active runtime configs.
- Decide final proxy mechanics from ADR-003: proxy with deprecation log for one minor version.
- Back up affected files before edits using the repo's normal non-git destructive-safety approach.

### Phase 2: Implementation

- Update OpenCode plugin and bridge paths so primary calls go to standalone advisor package/server.
- Update memory MCP advisor registration into a proxy/deprecation layer, not primary handler ownership.
- Update hook imports/calls for Claude, Codex, Gemini, and OpenCode paths.
- Update Python legacy wrapper path if `.opencode/skills/system-spec-kit/scripts/skill_advisor.py` exists or is required for compatibility.
- Update doctor skill-advisor and doctor:update workflow assets to target standalone server/package and DB.
- Update install guides to explain dual MCP topology, stable ids, and deprecation window.

### Phase 3: Verification

- Run `/doctor:update --cleanup-legacy=false` or the closest non-mutating/dry-run equivalent first.
- Smoke the OpenCode skill-advisor plugin bridge with stdin JSON and verify standalone advisor response.
- Smoke Python shim native and local fallback paths.
- Run hook tests for Codex, Claude, Gemini, and OpenCode plugin surfaces present in the repo.
- Grep stale old-path claims and confirm remaining hits are legacy proxy, tests, archives, or child 006 cleanup targets.
- Run strict spec validation for this 005 packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static inventory | Old server names, old source paths, stale install claims | `rg` |
| Type/build | System Spec Kit MCP plus system-skill-advisor package boundary | `npm --prefix ... run typecheck`, `npm --prefix ... run build` |
| Plugin smoke | `.opencode/plugins/spec-kit-skill-advisor.js` and bridge subprocess | Vitest plugin tests, direct node bridge stdin smoke |
| Hook smoke | Claude, Codex, Gemini prompt-time hook wrappers | Existing hook Vitest suites |
| Python smoke | Package-local `skill_advisor.py` native and fallback modes | `python3 .../skill_advisor.py --force-native`, `--force-local`, `--health` |
| Doctor smoke | Skill-advisor doctor and update orchestrator | Route validation plus `/doctor:update --cleanup-legacy=false` |
| Documentation | Dual-MCP topology, no stale single-server claim | Markdown review and stale-phrase grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 ADR-001 | Internal decision | Accepted | No cutover if standalone shape changes. |
| Child 003 source move | Internal implementation | Required | Consumer paths cannot point to package-local handlers if package is incomplete. |
| Child 004 standalone launcher/configs | Internal implementation | Required | Primary MCP target does not exist for consumers. |
| Child 006 cleanup | Follow-on packet | Planned | Temporary proxy remains until cleanup packet removes it. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Prompt-time hooks fail across active runtimes, `system_skill_advisor` cannot start, or legacy proxy creates memory MCP instability.
- **Procedure**: Revert the 005 implementation patch only, leaving child 003 package and child 004 launcher/configs intact. Restore previous hook/plugin/shim/doctor references, then run the same smoke tests to verify old routing is back.
- **Data Reversal**: None. This packet should not migrate data or mutate advisor scoring state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist

- [ ] Confirm child 004 standalone advisor server is runnable.
- [ ] Confirm affected files are backed up or recoverable from the local diff.
- [ ] Confirm no data migration is part of this packet.

### Rollback Procedure

1. Revert only the 005 implementation patch.
2. Restore previous hook, plugin, shim, doctor, and install-guide references.
3. Re-run plugin, hook, shim, and doctor smoke checks against the restored path.
4. Leave child 003 package and child 004 launcher/config files in place.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1: Setup
  -> Phase 2: Implementation
  -> Phase 3: Verification
  -> Child 006: Deprecation removal
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Children 001, 003, 004 | Implementation |
| Implementation | Setup inventory and ADR-003 proxy choice | Verification |
| Verification | Implementation | Child 006 cleanup |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Implementation | High | 4-8 hours |
| Verification | High | 2-4 hours |
| **Total** |  | **7-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
001 ADR accepted
       |
003 source moved + DB local
       |
004 standalone MCP registered
       |
005 consumer cutover
       |
006 proxy removal
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Standalone advisor server | Child 004 | `system_skill_advisor.advisor_*` | Consumer cutover |
| Memory proxy | Standalone advisor server | Deprecated `spec_kit_memory.advisor_*` compatibility | Child 006 cleanup evidence |
| Plugin bridge | Package compat or MCP dispatch | OpenCode prompt-time brief | Plugin smoke |
| Doctor update | Standalone advisor DB/server | Health validation path | Cleanup readiness |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory and classify consumers** - 1 hour - CRITICAL
2. **Update bridge/proxy paths** - 3 hours - CRITICAL
3. **Update hooks, shim, doctor, docs** - 3 hours - CRITICAL
4. **Run smoke and stale-reference checks** - 2 hours - CRITICAL

**Total Critical Path**: 9 hours

**Parallel Opportunities**:

- Install-guide edits can happen after topology wording is locked.
- Hook test repair can run beside plugin bridge smoke after implementation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Inventory Complete | Every `advisor_*` hit classified with action or no-op rationale. |
| M2 Cutover Patch Ready | Primary consumers target standalone advisor; memory side is proxy-only. |
| M3 Verification Green | Bridge, hook, shim, doctor, docs, and strict spec checks pass. |
| M4 Cleanup Handoff | Child 006 has explicit list of proxy/stale references to remove. |
<!-- /ANCHOR:milestones -->
