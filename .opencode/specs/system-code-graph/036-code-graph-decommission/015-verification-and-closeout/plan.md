---
title: "Implementation Plan: Phase 15: verification-and-closeout"
description: "Prove the decommission landed: a hidden-inclusive no-ignore sweep of the live surface, green suites against a captured baseline, clean runtime starts, a rebuilt advisor, and reconciled completion metadata. The full-suite run was still in flight at authoring time with 3 accounted-for failures (2 pre-existing unrelated, 1 timeout artifact that passes in isolation)."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/015-verification-and-closeout"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-015-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: verification-and-closeout

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Shell (sweeps), TypeScript (suites), process checks |
| **Framework** | spec-kit, skill-advisor, deep-loop, plugins, commands |
| **Storage** | None |
| **Testing** | `rg --hidden --no-ignore` sweep, vitest, typecheck, mcp-route-guard |

### Overview
Verification and metadata reconciliation for the entire decommission. A `--hidden --no-ignore` live-surface sweep confirmed no unintended reference survives (residual 50 hits, all string literals in fixtures/corpora/manifests). Spec-kit typecheck passed with 0 errors, 418 tests green across changed spec-kit files, mcp-route-guard 16/16, no daemon process or socket, 0 tracked files under the old skill path. The full-suite run was still in flight at authoring time with 3 accounted-for failures (2 pre-existing unrelated, 1 timeout artifact that passes in isolation).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — full-suite run still in flight at authoring time
- [x] Tests passing (if applicable) — spec-kit typecheck 0 errors, 418 tests green, mcp-route-guard 16/16
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-based closeout: sweeps that cannot silently skip files, suites reported as deltas, and runtime start checks.

### Key Components
- **Live-surface sweep**: `rg --hidden --no-ignore` with archival exclusions
- **Suite deltas**: spec-kit typecheck, 418 tests, mcp-route-guard 16/16
- **Runtime checks**: no daemon process, no socket, 0 tracked files, clean configs
- **Advisor rebuild**: confirmed the removed skill is unroutable
- **Metadata reconciliation**: completion metadata across packet documents

### Data Flow
Each check produces recorded evidence rather than assertion. The sweep uses both `--hidden` and `--no-ignore` so it cannot skip the dot-prefixed config files that matter most.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a fix_bug finding. This phase is verification and metadata reconciliation, not a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Live surface | May carry unintended references | Swept | 50 residual hits, all string literals in fixtures/corpora/manifests; no live imports |
| Runtime configs | May still register the server | Swept | No `mk_code_index` in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.pi/mcp.json` |
| Process / socket | Daemon may still run | Checked | No `mk-code-index` process; no `/tmp/mk-code-index` socket |
| Git index | Directory may still be tracked | Checked | 0 tracked files under the old skill path |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed all prior phases complete
- [x] Confirmed the pre-work baseline was captured before phase 003 began

### Phase 2: Core Implementation
- [x] Ran `rg --hidden --no-ignore` live-surface sweep with archival exclusions (50 residual hits, all string literals)
- [x] Ran spec-kit typecheck (0 errors)
- [x] Ran spec-kit test suite (418 tests green across changed files)
- [x] Ran mcp-route-guard (16/16 assertions pass)
- [x] Confirmed no `mk-code-index` process and no `/tmp/mk-code-index` socket
- [x] Confirmed 0 tracked files under the old skill path
- [x] Confirmed no `mk_code_index` in all four runtime configs
- [x] Rebuilt advisor and confirmed the removed skill is unroutable

### Phase 3: Verification
- [x] Live-surface sweep uses `--hidden --no-ignore` (REQ-001)
- [x] Only intended references survive (REQ-002: tombstone + archival paths)
- [x] Results reported as deltas (REQ-003: before/after numbers recorded)
- [ ] Full-suite run complete — still in flight at authoring time; 3 accounted-for failures (2 pre-existing unrelated, 1 timeout artifact that passes in isolation)
- [x] Completion metadata reconciled across packet documents
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Live-surface sweep | `rg --hidden --no-ignore` |
| Unit | spec-kit suite | vitest (418 green) |
| Typecheck | spec-kit | `tsc` (0 errors) |
| Integration | mcp-route-guard | route-guard harness (16/16) |
| Manual | Process / socket / tree / config | process check, filesystem, `git ls-files`, `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| All prior phases | Internal | Green | Verification cannot run until all phases complete |
| Pre-work baseline | Internal | Green | Captured before phase 003; enables delta reporting |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable. This phase produces verification evidence only; no runtime change to revert.
- **Procedure**: If a defect is found, it routes back to the owning phase per the scope boundary in spec.md.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
