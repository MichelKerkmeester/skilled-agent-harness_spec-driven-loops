---
title: "Implementation Plan: Phase 006/002-claudian — Claudian reference-docs deep research"
description: "Retrospective plan for the completed 4-iteration GLM-5.2/cli-devin deep-research run into the Claudian plugin, reduced into a prioritized synthesis.md edit plan."
trigger_phrases:
  - "006 claudian research plan"
  - "claudian deep research plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored retrospective plan for the completed research run"
    next_safe_action: "Hand synthesis.md to phase 009 apply pass"
    blockers: []
    key_files:
      - "spec.md"
      - "synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-002-claudian"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 006/002-claudian — Claudian reference-docs deep research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `/deep:research` loop (system-deep-loop), no code changes |
| **Framework** | GLM-5.2 High via cli-devin, 4 iterations, early convergence allowed |
| **Storage** | `research/` — state ledger, iterations, resource map |
| **Testing** | Per-iteration evidence + `validate.sh` on this phase |

### Overview
Ran a single-track, 4-iteration deep-research loop into the Claudian plugin (cloned `YishenTu/claudian` v2.2.4 repository and the installed compiled `main.js` v2.2.4) to confirm the mcp.json lifecycle, the settings file path, and the remaining config-schema `VERIFY` flags, then reduced the loop's findings into a fresh-reviewer prioritized edit table in `synthesis.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Seed sources identified: cloned `YishenTu/claudian` v2.2.4 repo, installed `main.js` v2.2.4
- [ ] Research sub-questions enumerated (mcp.json lifecycle, settings path, provider setup, MCP wiring)

### Definition of Done
- [ ] 4 iterations completed with cited findings
- [ ] `research.md` confirms both P0 factual errors (mcp.json write-vs-delete; settings path)
- [ ] `synthesis.md` ranks findings into a P0/P1/P2 edit table naming the exact correction targets
- [ ] `validate.sh` on this phase passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-track iterative evidence loop (deep-research state machine) followed by a fresh-reviewer reduction pass that cross-checks the loop's findings against the live shipped docs.

### Key Components
- **Init**: seed the cloned plugin repo and installed `main.js` v2.2.4; enumerate the VERIFY-flagged unknowns.
- **Iteration loop**: 4 GLM-5.2/cli-devin iterations, each appending to `research/research.md` and the iteration/resource-map artifacts.
- **Synthesis**: a fresh-reviewer pass reads the finished research plus the live shipped docs and writes `synthesis.md`'s prioritized edit table.

### Data Flow
Cloned repo + installed `main.js` → per-iteration findings (`research/research.md`) → fresh-reviewer cross-check against shipped docs → `synthesis.md` → handoff to phase 009.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Seed the cloned `YishenTu/claudian` v2.2.4 repository and the installed `main.js` v2.2.4
- [ ] Enumerate the research sub-questions (mcp.json lifecycle, settings path, provider setup, MCP wiring)

### Phase 2: Core Implementation
- [ ] Run the 4-iteration GLM-5.2/cli-devin loop against the seeded sources
- [ ] Confirm the mcp.json lifecycle and the current settings-file path

### Phase 3: Verification
- [ ] Fresh-reviewer synthesis: cross-check `research.md` against the live shipped docs and feature-catalog entry
- [ ] Write the prioritized P0/P1/P2 edit table in `synthesis.md`
- [ ] `validate.sh` this phase; refresh continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | 4 iterations recorded, early convergence allowed | deep-research state ledger |
| Coverage | mcp.json lifecycle + settings path resolved with citations | manual review of `research.md` |
| Doc | `synthesis.md` structure + citations | `validate.sh`, manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin (GLM-5.2 High) | External | Green | Loop cannot run without it |
| `/deep:research` loop | Internal | Green | Fall back to manual iteration only if broken |
| Installed `main.js` v2.2.4 | Internal (vault) | Green | Version drift invalidates confirmed schemas |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: research inconclusive, or a confirmed schema later proves wrong against a newer plugin version.
- **Procedure**: research artifacts are additive and phase-local — discard `research/` state if re-running; `synthesis.md` remains a recommendation only until phase 009 applies it, so no shipped state needs reverting.
<!-- /ANCHOR:rollback -->
