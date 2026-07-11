---
title: "Implementation Plan: Phase 10: adapter-sk-design-live-render"
description: "Built the sk-design live-render deep-alignment adapter implementing the phase-005 discover/standardSource/check contract as a pure-function dispatch wrapper. Every check() call dispatches through design-mcp-open-design in the sense that it only accepts caller-supplied render evidence self-tagged dispatchedThrough:'design-mcp-open-design' (ADR-009 LOCKED, grep-verified zero direct chrome-devtools call sites); check() never renders anything itself, a real disclosed constraint since design-mcp-open-design's own tool surface cannot render an arbitrary external target either."
trigger_phrases:
  - "phase 010 implementation plan"
  - "sk-design live-render adapter plan"
  - "design-mcp-open-design dispatch plan"
  - "chrome-devtools audit adapter plan"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render"
    last_updated_at: "2026-07-11T14:57:13Z"
    last_updated_by: "claude"
    recent_action: "Implemented+dry-ran discover/standardSource/check; all 3 phases done"
    next_safe_action: "Phase 008 resolves module-selection + lane-key gaps (Architecture note)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-010"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Phase 008: module-selection + lane-key resolution for the sk-design authority collision"
    answered_questions:
      - "design_dispatch_boundary.md is a child-agent/small-model envelope schema, not a callable render interface -- check() consumes options.renderResult instead (Architecture section)"
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
- [x] Phase 005's adapter contract shape is available and read in full (`sk_doc_adapter.md`, `sk-doc.cjs`) before this build started.
- [x] `design-mcp-open-design`'s dispatch-boundary contract (`design_dispatch_boundary.md`) re-read; found to be a child-agent/small-model envelope schema, not a render interface — a real finding that reshaped `check()`'s design (Architecture section, adapter spec Section 8).
- [x] `mcp-chrome-devtools`'s own `SKILL.md` re-read (header confirmed: CLI `bdg` + Code Mode MCP orchestrator) so this plan does not accidentally design a parallel direct-call path.

### Definition of Done
- [x] The adapter names `discover()`, `standardSource()`, and `check()` behavior concretely and all three are implemented + live-verified in `sk-design-live-render.cjs`.
- [x] Zero direct `mcp-chrome-devtools` calls anywhere in either new file — `rg -n "mcp-chrome-devtools\|mcp__.*chrome"` returns prose-only matches (adapter spec Section 9; command re-run and pasted in `implementation-summary.md`).
- [x] `checklist.md` items reviewed and checked with evidence or explicitly deferred (CHK-042 README update deferred to phase 009 cutover per its own P2 note).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pluggable adapter over the ADR-003 contract (phase-005 reference shape), with `check()` dispatching a render request through a single, existing transport boundary (`design-mcp-open-design`) rather than calling a rendering tool directly.

### Key Components (as built)
- **`discover()`**: resolves a lane's scope into renderable UI targets. Built as-planned with one honest correction: only two target kinds actually reach it, `url` (full `http(s)://` string) and `componentEntry` (a repo-relative string), not three. A bare leading-slash dev-server route (`/dashboard`) is rejected upstream by `scoping.cjs`'s `validateScope()` (traced live against `cli-guards.cjs`'s `validateNamespaceValue()`) before `discover()` is ever called — a route must be supplied as a full URL instead. No directory/glob expansion in v1 (each `scope.values[i]` is exactly one target) — a deliberate, documented scope-down, not silently dropped functionality. See adapter spec Section 1 and Section 3.
- **`standardSource()`**: loads `sk-design`'s live-audit rubric from `accessibility_performance.md`, `anti_patterns_production.md`, and (per this spec's own In Scope bullet) `ai_fingerprint_tells.md` — real, `fs.readFileSync`-reachable paths, plus the concrete AA-floor thresholds cited verbatim from `accessibility_performance.md:67-76,100`.
- **`check()`**: built as a **pure function over caller-supplied render evidence**, not a renderer. It never calls `design-mcp-open-design` or any MCP tool directly — MCP tools are invoked from an agent's own tool-use loop, not from a spawned Node subprocess, and (a real finding this build surfaced) `design-mcp-open-design`'s actual ~18-tool surface has no tool that renders an arbitrary external URL/route in the first place (full enumeration cross-checked, `tool_surface.md:42-90`). Instead, `check(artifact, rules, options)` requires `options.renderResult` — evidence the ITERATE-state driving agent already obtained by dispatching through `design-mcp-open-design` — and hard-rejects any `renderResult.dispatchedThrough !== 'design-mcp-open-design'` as a P0 finding (ADR-009 enforced at the data level, not by a call this script makes). Findings are tagged `layer: 'live-render'` (matching this plan's original design, distinguishing from phase 006) **and** `producedBy: 'deterministic'|'reasoning-agent'|'unavailable'` (a second field, preserving ADR-008's honesty-about-determinism axis that `layer` alone cannot carry once `layer`'s meaning here is "which adapter," not "how produced" — see adapter spec Section 7's explicit reconciliation of this two-source tension).
- **Accepted-deviation set**: located at `references/adapters/sk_design_live_render_known_deviations.md`, sibling to `sk_design_live_render_adapter.md` — the TBD is now a concrete path. The file itself is **not yet created**: no real live-render run has produced a finding to seed it with (adapter spec Section 6); `loadKnownDeviations()` degrades to `[]` gracefully, live-verified.
- **VERIFY-FIRST re-probe**: built as an evidence-labeling mechanism (`evidenceLabel: 'confirmed'|'inferred'`, keyed on `renderResult.renderedAt` presence/parseability), reusing `evidence_capture.md`'s own vocabulary. The actual freshness guarantee — that a render was performed immediately before this call, not reused — is a caller contract this stateless function cannot mechanically enforce, stated honestly rather than claimed (adapter spec Section 5).

### Data Flow (as built)
A lane resolved to `authority=sk-design, artifactClass=designs` calls this module's `discover(scope)` to enumerate `url`/`componentEntry` targets, then `standardSource('sk-design')` once per lane to load the live rubric + thresholds, then `check(artifact, rules, options)` per target: the caller supplies `options.renderResult` (obtained by dispatching through `design-mcp-open-design` beforehand, in the caller's own agent context) -> `check()` validates the boundary self-report, runs deterministic threshold sub-checks plus reasoning-agent `judgmentFindings` passthrough -> emits `layer`+`producedBy`-tagged findings. Two gaps remain, both correctly owned by phase 008 (not this phase): **(1) module-selection** — nothing in the live lane schema tells phase 008 which adapter *file* to `require()` for a `sk-design` lane, this one or phase 006's; **(2) lane-key** — REQ-005's original question, whether findings merge into phase 006's `sk-design` reducer key or form a peer key. Both are named precisely in adapter spec Section 1, not silently left as the single vaguer note this plan originally carried.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the fix-bug sense - this phase built a net-new adapter and modified no existing runtime behavior (both new files only; nothing outside this phase's scope-lock was touched). Recorded for template completeness:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md` | Owns the live `design-mcp-open-design` transport (`packetKind: "transport"`, "a read-only bridge") | Read-only dispatch target for the adapter's `check()`; not modified | Cited by path above; `.opencode/skills/sk-design/SKILL.md:30` |
| `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` | Owns the live `DESIGN_BOUNDARY_PROOF v1` envelope contract for design dispatch | Read-only contract this adapter's dispatch design must satisfy; not modified | Cited by path above |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` | Owns the live chrome-devtools MCP transport | NOT called directly by this adapter; driven only underneath `design-mcp-open-design` per ADR-009 | Cited by path above for the boundary rule, not as a direct call target |
| `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md`, `anti_patterns_production.md` | Own the live audit rubric for accessibility/performance/anti-slop | Read-only source for the adapter's `standardSource()`; not modified | Cited by path above |

Required inventories:
- Same-class producers: not applicable - confirmed via `ls .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/`, which showed only `sk-doc.cjs` (a different authority) pre-existing before this build; no same-class (sk-design) adapter code to inventory against.
- Consumers of changed symbols: not applicable - no symbols change in this phase; phase 008, the only planned consumer, is not built.
- Matrix axes: dispatch step (discover, standardSource, check) x rubric dimension (accessibility, performance, responsive, anti-slop) = the adapter's built behavior, live-verified per plan.md §4/§5 above.
- Algorithm invariant: no parallel chrome-devtools dispatch path may exist anywhere in this adapter's design - checked by `rg -n "mcp-chrome-devtools\|mcp__.*chrome" <adapter-file>`, **now run against the real built files**: zero direct-call sites confirmed, only prose explanations of why the tool is not called (both `sk_design_live_render_adapter.md` and `sk-design-live-render.cjs`; full output in `implementation-summary.md`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phase 005's adapter contract signature by reading `sk_doc_adapter.md` and `sk-doc.cjs` in full before writing a line of this adapter.
- [x] Re-read `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` — found it is a child-agent/small-model routing-proof envelope schema, not a render interface (the plan's assumption needed correcting, not just confirming — Architecture section, adapter spec Section 8).
- [x] Re-read `accessibility_performance.md` and `anti_patterns_production.md`; v1 rubric confirmed unchanged, thresholds cited verbatim into `THRESHOLDS` in the `.cjs`.

### Phase 2: Core Implementation
- [x] Implemented `discover()` resolving lane scope into `url`/`componentEntry` targets per the Architecture section above. Live-verified: 2 real targets returned from a 4-value input (2 correctly filtered — a leading-slash route and a glob-metachar value).
- [x] Implemented `standardSource()` loading the live-audit rubric sources plus concrete thresholds. Live-verified via CLI `standard-source`.
- [x] Implemented `check()` as a pure-function dispatch wrapper (Architecture section explains why it cannot itself dispatch), emitting `layer: 'live-render'` + `producedBy`-tagged findings. Live-verified across 6 scenarios: no-renderResult, wrong-boundary, dispatch-rejected, auth-blocked, and full measurements+judgmentFindings (7 findings emitted correctly, including one judgment finding correctly dropped for missing evidence).
- [x] Named this adapter's known-deviation/accepted-convention list location (`references/adapters/sk_design_live_render_known_deviations.md`) — not yet seeded, honestly (Architecture section, adapter spec Section 6).
- [x] Wired the VERIFY-FIRST mechanism as an evidence-label (`confirmed`/`inferred`), the mechanically-honest form available to a stateless function — the true "re-render before assertion" guarantee is a documented caller contract, not something this code enforces (adapter spec Section 5).

### Phase 3: Verification
- [x] Dry-ran the adapter against synthetic renderable targets and caller-supplied render evidence (no live `design-mcp-open-design` dispatch exists to test against yet — that transport requires an agent tool-use loop this manual verification pass does not have; the pure-function boundary itself is what was verified, per Architecture section's design).
- [x] Grepped both new files for direct `mcp-chrome-devtools` call sites: zero matches (only prose explaining why it is not called). Full command + output in `implementation-summary.md`.
- [x] Confirmed the adapter returns the documented `render-unavailable` P1 finding (not an error, not a fabricated pass) when `options.renderResult` is omitted — live-verified.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Result |
|-----------|-------|-------|--------|
| Unit | Not built this pass — no `vitest` suite exists for this adapter yet, honestly noted rather than claimed. `discover()`/`check()`/`standardSource()` were instead verified via `node --check` plus 7 live CLI dry-runs (Manual rows below) covering the same logic paths a unit suite would. | vitest planned (matching `system-deep-loop/deep-review/scripts/tests/` convention), not yet authored | Deferred |
| Integration | Adapter output feeding the phase-008 alignment-report reducer | Not runnable — phase 008 does not exist yet (correctly out of this phase's scope) | Deferred to phase 008 |
| Manual | Dispatch-boundary compliance (no parallel chrome-devtools path) | `rg -n "mcp-chrome-devtools\|mcp__.*chrome"` against both built files | PASS — zero direct-call sites |
| Manual | `discover()` target classification (url / componentEntry / filtered leading-slash route / filtered glob) | CLI `discover` with 4 mixed inputs | PASS — 2 kept, 2 correctly filtered |
| Manual | `check()` short-circuits (no-renderResult, wrong-boundary, dispatch-rejected, auth-blocked) | CLI `check --render-result` with 4 synthetic JSON payloads | PASS — 1 correct finding each, correct severity |
| Manual | `check()` deterministic thresholds + judgment passthrough | CLI `check --render-result` with a full measurements+judgmentFindings payload | PASS — 7 findings, thresholds correctly triggered/not-triggered per value, 1 judgment finding correctly dropped for missing evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 adapter contract | Internal | Satisfied — read in full pre-build, shape matched (three methods, CLI dry-run pattern, caller-supplied-evidence discipline reused directly) | N/A, resolved |
| `design-mcp-open-design`'s actual tool surface | Internal | **Resolved differently than planned**: not a dispatch boundary this adapter calls into, but a tool surface `check()` validates caller-supplied evidence *against* (self-reported `dispatchedThrough`). Real capability gap disclosed (no arbitrary-URL render tool exists), not fixed by this phase. | Live-render findings require the ITERATE-state agent to supply `options.renderResult` manually until `design-mcp-open-design` grows this capability or ADR-009 is revisited — both future work, outside this phase. |
| Phase 006's static sk-design adapter (sibling precedent) | Internal | Still not built (confirmed: `scripts/adapters/` holds only `sk-doc.cjs` and this phase's new file) | Module-selection + lane-key gaps (Architecture section) stay open until phase 006 exists and phase 008 reconciles both. |
| Phase 008's reducer shape | Internal | Still not built | Findings this adapter emits are well-formed and self-tagged (`layer`, `producedBy`, `mode`, `authority`) but not yet consumed by any reducer. |
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
