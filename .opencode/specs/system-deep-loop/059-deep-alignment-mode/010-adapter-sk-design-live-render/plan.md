---
title: "Implementation Plan: Phase 10: adapter-sk-design-live-render"
description: "Plan the sk-design live-render deep-alignment adapter, implementing the phase-005 discover/standardSource/check contract. The approach is dispatch-boundary-first: every render dispatches through design-mcp-open-design, never a parallel chrome-devtools path, per ADR-009's LOCKED constraint."
trigger_phrases:
  - "phase 010 implementation plan"
  - "sk-design live-render adapter plan"
  - "design-mcp-open-design dispatch plan"
  - "chrome-devtools audit adapter plan"
importance_tier: "normal"
contextType: "general"
status: "planned"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 010 live-render adapter plan"
    next_safe_action: "Confirm dispatch boundary contract before wiring"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render/spec.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-010"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: adapter-sk-design-live-render

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | TypeScript/CJS adapter shell (matching `system-deep-loop/runtime/scripts/*.cjs`), dispatching to `design-mcp-open-design`'s `od` CLI/stdio MCP surface for the render step |
| **Framework** | `deep-alignment` mode-packet (planned, not yet scaffolded) over the `system-deep-loop` runtime; render transport is `sk-design/design-mcp-open-design` (packetKind `transport`), which drives `mcp-tooling/mcp-chrome-devtools` underneath |
| **Storage** | None in this phase - the adapter reads a rendered surface and reference files and writes no state of its own (loop state lives in the bound spec folder's `alignment/` subdir, owned by phase 008) |
| **Testing** | None runnable in this phase - future adapter unit tests plan named for whichever phase actually implements the code |

### Overview
This phase plans, not builds, a third `deep-alignment` authority adapter for `sk-design`, peer to phase 006's static adapter: a live-render dimension that dispatches a render request through `design-mcp-open-design` (never directly to `mcp-chrome-devtools`) and checks the rendered result against `sk-design`'s live audit rubric. The plan is dispatch-boundary-first: every design decision below is checked against ADR-009's explicit constraint before anything else.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 005's adapter contract shape is available (or the design-brief-locked contract is used as fallback).
- [ ] `design-mcp-open-design`'s dispatch-boundary contract (`design_dispatch_boundary.md`) is re-read and confirmed current.
- [ ] `mcp-chrome-devtools`'s own `SKILL.md` is re-read so this plan does not accidentally design a parallel direct-call path.

### Definition of Done
- [ ] The adapter plan names `discover()`, `standardSource()`, and `check()` behavior concretely enough to code from.
- [ ] Every `check()` design point routes through `design-mcp-open-design`, with zero direct `mcp-chrome-devtools` calls named anywhere in the plan.
- [ ] `checklist.md` items are reviewed and either checked with evidence or explicitly deferred.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pluggable adapter over the ADR-003 contract (phase-005 reference shape), with `check()` dispatching a render request through a single, existing transport boundary (`design-mcp-open-design`) rather than calling a rendering tool directly.

### Key Components
- **`discover()`**: resolves a lane's scope into renderable UI targets — a URL, a local dev-server route, or a component entry point — distinct from phase 006's static `DESIGN.md`/`tokens.json` artifact paths. Output is a list of target references, not file paths, since the artifact being checked is a rendered state, not a static file.
- **`standardSource()`**: loads `sk-design`'s live-audit rubric from `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` (contrast, focus, ARIA, load/animation performance, responsive breakpoints) and `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md` (anti-slop, production hardening) — the same rubric sources `sk-design`'s own `audit` mode already cites, reused rather than forked.
- **`check()`**: dispatches a render request through `design-mcp-open-design` (`.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`), which drives `.opencode/skills/mcp-tooling/mcp-chrome-devtools/` underneath per the dispatch-boundary contract (`.opencode/skills/sk-design/shared/design_dispatch_boundary.md`) — the adapter's design never names a direct `mcp-chrome-devtools` call. Once rendered, the adapter checks the result against the `standardSource()` rubric and emits findings tagged `layer: live-render` (mirroring ADR-008's honest layer-tagging discipline for sk-code, applied here to distinguish live-render findings from phase 006's static findings).
- **Accepted-deviation set**: an authority-local list distinct from phase 006's static-adapter list (location TBD at build time, sibling file per ADR-005's per-authority suppression-list pattern), since live-render conventions (for example, an intentionally slow-loading hero animation) differ from static DESIGN.md/token conventions.
- **VERIFY-FIRST re-probe**: a live-render finding is re-probed by a fresh render immediately before assertion (ADR-005 invariant 1) — never cached from an earlier discover-time render, since render state can change between passes.

### Data Flow
A lane resolved to `authority=sk-design, mode=live-render` (or however phase 004's scoping tree names this variant — a REQ-005-level open question resolved when phase 004 and this phase reconcile) calls `discover(scope)` to enumerate renderable targets, then `standardSource(authority)` once per lane to load the live rubric, then `check(artifact, rules)` per target: dispatch through `design-mcp-open-design` -> render completes -> check rendered result against rubric -> emit layer-tagged findings. Findings flow into the phase-008 alignment-report reducer, either merged into phase 006's `sk-design` lane key or as their own peer lane key (REQ-005, open until phase 008 reconciliation).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the fix-bug sense - this phase plans a net-new adapter and modifies no existing runtime behavior. Recorded for template completeness:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md` | Owns the live `design-mcp-open-design` transport (`packetKind: "transport"`, "a read-only bridge") | Read-only dispatch target for the adapter's `check()`; not modified | Cited by path above; `.opencode/skills/sk-design/SKILL.md:30` |
| `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` | Owns the live `DESIGN_BOUNDARY_PROOF v1` envelope contract for design dispatch | Read-only contract this adapter's dispatch design must satisfy; not modified | Cited by path above |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` | Owns the live chrome-devtools MCP transport | NOT called directly by this adapter; driven only underneath `design-mcp-open-design` per ADR-009 | Cited by path above for the boundary rule, not as a direct call target |
| `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md`, `anti_patterns_production.md` | Own the live audit rubric for accessibility/performance/anti-slop | Read-only source for the adapter's `standardSource()`; not modified | Cited by path above |

Required inventories:
- Same-class producers: not applicable - no existing adapter code exists yet to inventory against.
- Consumers of changed symbols: not applicable - no symbols change in this phase.
- Matrix axes: dispatch step (discover, standardSource, check) x rubric dimension (accessibility, performance, responsive, anti-slop) = the adapter's planned behavior, named above.
- Algorithm invariant: no parallel chrome-devtools dispatch path may exist anywhere in this adapter's design - checked by `rg -n "mcp-chrome-devtools\|mcp__.*chrome" <adapter-file>` returning zero direct-call sites once the adapter is built.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 005's adapter contract signature is available (or use the design-brief-locked contract).
- [ ] Re-read `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` and confirm the envelope schema has not changed since this plan was authored.
- [ ] Re-read `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` and `anti_patterns_production.md` and confirm the v1 live rubric is unchanged.

### Phase 2: Core Implementation (future execution pass — not run in this phase)
- [ ] Implement `discover()` resolving lane scope into renderable UI targets per the Architecture section above.
- [ ] Implement `standardSource()` loading the live-audit rubric sources.
- [ ] Implement `check()` dispatching through `design-mcp-open-design` only, checking the rendered result against the rubric, emitting `layer: live-render`-tagged findings.
- [ ] Author this adapter's known-deviation/accepted-convention list, distinct from phase 006's static-adapter list.
- [ ] Wire the VERIFY-FIRST re-probe: re-render immediately before a finding is asserted, never reused from an earlier render.

### Phase 3: Verification (future execution pass — not run in this phase)
- [ ] Dry-run the adapter against a real renderable target through the dispatch boundary and confirm the render completes.
- [ ] Grep the built adapter for any direct `mcp-chrome-devtools` call site and confirm zero matches (dispatch-boundary compliance check).
- [ ] Confirm the adapter returns the documented "render unavailable" result rather than erroring when the transport is down.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `discover()`/`check()` dispatch-envelope construction | vitest (matching `system-deep-loop/deep-review/scripts/tests/` convention) |
| Integration | Adapter output feeding the phase-008 alignment-report reducer | Manual dry-run against a real renderable target |
| Manual | Dispatch-boundary compliance (no parallel chrome-devtools path) | `rg -n "mcp-chrome-devtools\|mcp__.*chrome"` against the built adapter file, expect zero direct-call sites |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 adapter contract | Internal | Planned in parallel | If the signature shifts, this adapter plan needs reconciliation before build; low risk since the contract is design-brief-locked. |
| `design-mcp-open-design` dispatch boundary | Internal | Stable, live | If the envelope schema changes, `check()`'s dispatch construction must be re-synced. |
| Phase 006's static sk-design adapter (sibling precedent) | Internal | Planned in parallel | If phase 006's lane-key naming shifts, REQ-005's lane-merge-vs-peer-lane decision needs reconciliation. |
| Phase 008's reducer shape | Internal | Planned in parallel | Findings cannot be finalized until phase 008's per-lane key convention lands. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future build finds the phase-005 adapter contract incompatible, `design-mcp-open-design`'s dispatch envelope has materially changed shape, or the render transport proves unreliable enough to undermine convergence.
- **Procedure**: Re-open this phase's plan, re-cite the current dispatch-boundary contract, and update `spec.md`/`plan.md` before resuming implementation; do not silently code a parallel chrome-devtools path to work around a boundary problem.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
005 (sk-doc reference) ──┬──► 006 (sk-git + sk-design static) ──┐
                          ├──► 007 (sk-code)                     ├──► 008 (iterate/converge/report) ──► 009 (cutover)
                          └──► 010 (sk-design live-render) ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 005 contract available | Core |
| Core | Setup, `design-mcp-open-design` boundary confirmed | Verify |
| Verify | Core | Phase 008 (iterate/converge/report wiring); phase 009's cutover gates also wait on this phase |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Re-read 3 reference/transport sources |
| Core Implementation | Medium | One adapter, one dispatch boundary, four rubric dimensions |
| Verification | Low | Dry-run against a real target plus a grep-based boundary-compliance check |
| **Total** | | **Medium (bounded by one well-sourced adapter and one existing transport boundary)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migrations - adapter is read-only in v1.
- [ ] Dispatch-boundary compliance grep passes (zero direct chrome-devtools call sites) before first `check()` run ships.

### Rollback Procedure
1. Disable this lane's resolution (a lane scoped to `sk-design` live-render simply cannot run) rather than shipping a `check()` with a parallel dispatch path.
2. Revert the adapter code via normal version control.
3. Re-verify against the dry-run cases in Testing Strategy before re-enabling.
4. No user-facing notification needed - this is an internal deep-loop mode, not a shipped user surface, in v1.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
