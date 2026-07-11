---
title: "Feature Specification: Phase 10: adapter-sk-design-live-render"
description: "Phase 010 plans the sk-design live-render deep-alignment adapter: a chrome-devtools-driven audit dimension that renders the target UI and checks it against sk-design's live rubric (accessibility, performance, responsive, anti-slop), dispatched only through the design-mcp-open-design boundary. This is a planning-only pass against the phase-005 adapter contract and ADR-009's LOCKED decision; no adapter code ships here."
trigger_phrases:
  - "deep-alignment sk-design live-render adapter"
  - "chrome-devtools design audit alignment"
  - "design-mcp-open-design dispatch boundary adapter"
  - "live-render accessibility performance audit"
importance_tier: "normal"
contextType: "general"
status: "planned"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 010 live-render adapter spec"
    next_safe_action: "Await 006-008 shapes before execution"
    blockers:
      - "006-adapter-sk-git-and-sk-design not yet executed"
      - "008-iterate-converge-report not yet executed"
    key_files:
      - ".opencode/skills/sk-design/shared/design_dispatch_boundary.md"
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-010"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact chrome-devtools render harness invocation shape through design-mcp-open-design"
      - "Whether live-render findings merge into 006's sk-design lane or form their own peer lane"
    answered_questions:
      - "ADR-009 LOCKED: live-render joins as this peer phase, routed only through design-mcp-open-design"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: adapter-sk-design-live-render

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-11 |
| **Branch** | `system-deep-loop/059-deep-alignment-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 — peer adapter phase; DAG position parallels 006/007, feeding phase 008 (see Phase Context) |
| **Predecessor** | 007-adapter-sk-code (folder-order predecessor only; not a strict DAG dependency) |
| **Successor** | 008-iterate-converge-report consumes this adapter's findings; 009-command-agent-advisor-cutover's gates run after this phase too |
| **Handoff Criteria** | A future executor can begin coding this adapter directly from this plan: the phase-005 `{discover, standardSource, check}` contract signature, the `design-mcp-open-design` dispatch boundary, the chrome-devtools render harness, and the live rubric sources are all named with real paths. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
ADR-004 locked `sk-design`'s v1 adapter (phase 006) to static `DESIGN.md`/token checks only — live-render (chrome-devtools-driven) accessibility/performance/responsive audits were explicitly out of that phase's scope. ADR-009 has now resolved the deferred question: the operator wants that live-render dimension in this program, not indefinitely deferred. Without a named adapter, a lane scoped to a live-render check has no discover/check implementation.

### Purpose
Produce an evidence-grounded plan for a THIRD `sk-design` authority adapter — a peer of phase 006's static adapter — that renders the target UI via `design-mcp-open-design` (chrome-devtools underneath) and audits it against `sk-design`'s live rubric (accessibility, performance, responsive, anti-slop), implementing the phase-005 adapter contract, routed exclusively through the existing dispatch boundary per ADR-009's explicit constraint.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Phase Context

This is **Phase 10** of the `system-deep-loop/059-deep-alignment-mode` mode-packet specification — a peer adapter phase, not a sequential continuation of phase 009. Phase numbers are IDs; the DAG places this phase alongside 006 (static sk-design) and 007 (sk-code): it feeds phase 008's reducer as a third adapter, and phase 009's cutover gates run after this phase too, even though 010's folder number is higher than 009's.

**Scope Boundary**: Plan only. No adapter code, no mode-packet `SKILL.md`, no scripts ship in this phase.

**Dependencies**: The adapter contract shape `{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }` was frozen in phase 002 (ADR-003); phase 005's sk-doc adapter is its reference implementation, whose shape this adapter MUST match identically. Phase 006's static sk-design adapter established the sk-design authority's non-live rule sources this phase does not duplicate. ADR-009 (LOCKED) requires this adapter's `check()` to dispatch exclusively through `design-mcp-open-design` (`.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`, `.opencode/skills/sk-design/shared/design_dispatch_boundary.md`) — never a parallel `chrome-devtools` path.

**Deliverables**: A named plan for this adapter's discover/standardSource/check behavior, the `design-mcp-open-design` dispatch invocation shape, the live rubric sources it checks against, and its known-deviation list location.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### In Scope
- Plan `discover()`: resolve a lane's scope into renderable UI targets (URLs, local dev-server routes, or component entry points) — the SCOPE axis for a live-render lane, distinct from phase 006's static `DESIGN.md`/`tokens.json` paths.
- Plan `standardSource()`: load `sk-design`'s live-audit rubric — `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md`, `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md`, and `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` — the same rubric `sk-design`'s own `audit` mode already applies, but against a rendered surface instead of static source.
- Plan `check()`: dispatch a render request through `design-mcp-open-design` (never a parallel chrome-devtools MCP call), which drives `.opencode/skills/mcp-tooling/mcp-chrome-devtools/` underneath per the dispatch boundary contract, then check the rendered result against the live rubric — accessibility (contrast, focus, ARIA), performance (load/animation), responsive behavior (breakpoint checks), and anti-slop production hardening.
- Document the explicit dispatch-boundary constraint (ADR-009): this adapter never calls `mcp-chrome-devtools` directly; it always routes through `design-mcp-open-design`'s existing read-only bridge.
- Document this adapter's known-deviation / accepted-convention list per the alignment contract's suppression invariant (ADR-005), distinct from phase 006's static-adapter list.
- Document this adapter's VERIFY-FIRST re-probe step (alignment contract invariant 1): a live-render finding is re-probed by re-rendering, not cached from an earlier discover pass.

### Out of Scope
- Implementing the adapter in code - future phase, not this scaffold.
- The sk-doc reference adapter - owned by phase 005.
- The sk-git adapter and the sk-design STATIC adapter - owned by phase 006.
- The sk-code adapter - owned by phase 007.
- Wiring this adapter into the iterate/converge loop - owned by phase 008 (this phase's findings feed that reducer as a peer lane).
- Command, agent, and advisor cutover work - owned by phase 009.
- Any parallel chrome-devtools dispatch path outside `design-mcp-open-design` - explicitly forbidden by ADR-009.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/adapters/sk-design-live-render-adapter.*` (future, not yet created) | Plan only | This phase documents the discover/standardSource/check plan; no file is created. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | This adapter's `check()` dispatches exclusively through `design-mcp-open-design`, never a parallel chrome-devtools path. | `plan.md` cites `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` and `.opencode/skills/sk-design/SKILL.md:30` ("a read-only bridge, always paired with a design-judgment mode that owns the taste") as the required dispatch boundary, and states no direct `mcp-chrome-devtools` call exists in the adapter's design. |
| REQ-002 | Name the live rubric sources with real paths. | `plan.md` cites `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` and `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md` as the `standardSource()` input for the rendered-surface checks. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Define this adapter's known-deviation list location, distinct from phase 006's static adapter. | `plan.md` Architecture section names where this adapter's accepted-convention list lives (authority-local per ADR-005, sibling to but distinct from phase 006's list). |
| REQ-004 | Define this adapter's VERIFY-FIRST re-probe behavior. | `plan.md` states that a live-render finding is re-probed by a fresh render immediately before assertion, never cached from an earlier discover pass. |
| REQ-005 | State how this adapter's findings roll up alongside phase 006's static sk-design findings in phase 008's reducer. | `plan.md` names whether live-render findings merge into 006's `sk-design` lane key or form their own peer lane key (e.g. `sk-design-live-render`), consistent with phase 008's per-lane reducer shape. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future implementer can build this adapter's `discover()`/`standardSource()`/`check()` directly from this plan without re-deriving the dispatch-boundary constraint.
- **SC-002**: The plan proves, by citation, that no parallel chrome-devtools path is designed into this adapter.
- **SC-003**: The plan names a known-deviation list location and a verify-first re-probe step, consistent with phases 005-007's precedent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `design-mcp-open-design`'s dispatch-boundary contract | If the boundary's envelope schema changes, this adapter's `check()` dispatch shape needs revision. | Cite the real, current contract (`design_dispatch_boundary.md`) rather than an assumed shape; re-read at build time. |
| Dependency | Phase 006's static sk-design adapter and phase 008's reducer shape | If either shifts after this phase is authored, this adapter's lane-key plan needs reconciliation. | Treat phase 006's static adapter as the sibling precedent and phase 008's per-lane reducer as canonical; reconcile at build time. |
| Risk | Live-render checks are inherently less deterministic than phase 006's static checks (render timing, environment variance). | Findings could be flaky across runs, undermining convergence. | Every live-render finding is honestly labeled (mirroring ADR-008's layer-tagging discipline) and re-probed by a fresh render before assertion (ADR-005 verify-first), not asserted from a single render pass. |
| Risk | `mcp-chrome-devtools` availability gates this adapter's `check()` entirely. | A lane scoped to live-render cannot run if the underlying transport is unavailable. | The adapter reports a documented "render unavailable" result rather than a silent skip or a false PASS. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A render-and-check pass is bounded per artifact (one page/route per iteration slice), mirroring phase 008's per-iteration tool-call budget discipline, so a single iteration does not attempt to render an entire large lane in one pass.

### Security
- **NFR-S01**: This adapter never writes to the rendered target (read-only alignment contract default); `design-mcp-open-design` is itself documented as "a read-only bridge."

### Reliability
- **NFR-R01**: If a render fails (target unreachable, chrome-devtools transport down), the adapter reports a documented "render unavailable" finding category rather than erroring the whole lane or silently treating it as clean.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Scope resolves to zero renderable targets: adapter returns zero findings with an explicit "empty scope" note, not a silent PASS claim.
- A target that requires authentication to render: adapter reports "render blocked - auth required" as its own finding category rather than guessing credentials.

### Error Scenarios
- `design-mcp-open-design` dispatch envelope rejected (boundary rule violation per `design_dispatch_boundary.md` §5): adapter surfaces the rejection reason verbatim rather than retrying with a bypassed envelope.

### State Transitions
- Not applicable to this phase - the adapter is read-only in v1; no state mutation occurs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | One adapter, one dispatch boundary, four rubric dimensions. |
| Risk | 11/25 | Render non-determinism and transport-availability risk, both mitigated above. |
| Research | 11/20 | Cross-read of `design_dispatch_boundary.md`, `sk-design/SKILL.md`, `mcp-chrome-devtools/SKILL.md`, and `design-audit/references/`. |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Exact chrome-devtools render harness invocation shape through `design-mcp-open-design` (which of its documented dispatch entry points this adapter calls) - TBD, resolve when this phase executes against the real transport.
- Whether live-render findings merge into phase 006's `sk-design` lane key or form their own peer lane key in phase 008's reducer - TBD, resolve alongside phase 008's execution pass.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
