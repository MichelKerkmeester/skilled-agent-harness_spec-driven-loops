---
title: "Implementation Plan: 001 State Directory Containment"
description: "Route the advisor state writers through the already-anchored resolver, prove containment with a boundary test, and remove the existing strays. The resolver itself needed no change; the leak was consumer-side."
trigger_phrases:
  - "advisor-018-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/017-advisor-audit-and-state-containment/001-state-directory-containment"
    last_updated_at: "2026-08-15T13:30:28Z"
    last_updated_by: "claude-code"
    recent_action: "Advisor consumer routing fixed and verified"
    next_safe_action: "Close 001; 002 surface-audit remains"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 001 State Directory Containment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM), Node |
| **Framework** | OpenCode advisor MCP server + Claude hook |
| **Storage** | JSON generation counter + SQLite skill-graph under the repo-root `.opencode/` |
| **Testing** | Vitest, plus the new boundary regression test |

### Overview

The shared resolver `findAdvisorWorkspaceRoot` already anchored structurally; the leak was that the advisor's consumers passed a raw cwd instead of routing through it. Route each consumer through the resolver, add a boundary regression test, remove the existing strays. No new resolver and no repo-wide writer conversion were needed — the other named writers were already anchored or gone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every claim re-verified against the advisor tree
- [x] Open question in `spec.md` resolved (anchor = sentinel walk-up)

### Definition of Done
- [x] All checklist items carry evidence
- [x] `validate.sh --strict` exits clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Reproduce first, anchor at the chokepoints, prove each step. The two path chokepoints (generation counter, skill-graph DB dir) re-anchor any caller's root, so fixing them plus the hook entry closes every leak regardless of the caller.

### Key Components

- **Resolver**: `findAdvisorWorkspaceRoot` — sentinel walk-up + `hoistAboveOpencodeTree` fallback (unchanged).
- **Consumers**: hook `workspaceRootFor`, generation path, DB dir, scan, daemon fallback, schema twin — all routed through the resolver.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm
- [x] Re-verified every writer at its cited line; dropped the ones already anchored or gone

### Phase 2: Anchor
- [x] Routed the six advisor consumers through `findAdvisorWorkspaceRoot`; realigned the schema twin; added the boundary test

### Phase 3: Convert
- [x] No further conversion needed — non-advisor writers already anchor via `findRepoRoot`

### Phase 4: Clean
- [x] Removed the three advisor strays under `specs/`; the `.gitignore` backstop is retired as obsolete (structural resolver prevents recurrence)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Spec conformance | `validate.sh --strict` |
| Behavioural | The change actually holds | `state-containment.vitest.ts`, generation stress |
| Regression | The defect cannot return | A boundary test, not an enumeration |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `findAdvisorWorkspaceRoot` resolver | Internal | Green | No anchor to route through |
| Advisor tree stability | External | Shared tree | Findings may go stale mid-phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a change breaks a consumer that the evidence did not surface.
- **Procedure**: revert the single file; each edit is independent and routes through one shared resolver, so blast radius stays one item.
<!-- /ANCHOR:rollback -->
