---
title: "Feature Specification: Spec-Kit Template & Context Optimizations"
description: "Implement the six verified/multi-lineage optimization opportunities from the 033 deep-research packet: research-template level-gating, template source consolidation, a rendered-view read guard, AC-coverage activation, a scope-adherence validator, and a memory_search token budget."
trigger_phrases:
  - "spec template context optimizations"
  - "implement 033 research recommendations"
  - "research template gating"
  - "ac coverage default on"
  - "scope adherence validator"
  - "memory search token budget"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-template-context-optimizations"
    last_updated_at: "2026-08-12T20:29:59Z"
    last_updated_by: "claude-code"
    recent_action: "Added before/after comparison and packet changelog; packet complete"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/033-spec-templates-and-context-reducer/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-034-optimizations"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "REQ-005 scope-rule changed-files contract (MK_SCOPE_BASE) not yet formally defined"
    answered_questions:
      - "deep-research does not consume research.md.tmpl (workflow-owned); Phase 1 savings are authoring-only"
      - "AC_COVERAGE implemented as default-on advisory (non-blocking), not a hard warn"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Spec-Kit Template & Context Optimizations

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (uncommitted) — all four phases implemented; deep-review findings remediated; QA checklist verified; awaiting commit go-ahead |
| **Created** | 2026-08-12 |
| **Branch** | `system-spec-kit/0146-speckit-template-optimizations` |
| **Parent Packet** | system-speckit |
| **Predecessor** | `033-spec-templates-and-context-reducer` (research) |
| **Successor** | None |
| **Handoff Criteria** | Each of the four implementation phases lands with passing tests and a clean regression gate; every change classified against the 033 refutation list so nothing reinvents shipped machinery |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 033 deep-research packet (10 iterations, 4 lineages, 3 model families) tested two external agent-engineering concepts against system-speckit and found that **most patterns already ship** — but six genuine gaps survived adversarial, multi-model prior-art filtering. The top three are independently re-verified. Left unaddressed, each is a small but real cost: authoring agents read an ungated 944-line research template at every level; a machine-checked plan-adherence gate sits dormant; scope discipline is prose-only (a research lineage literally wandered out of scope during 033); and `memory_search` can flood context because it lacks the token budget its sibling already enforces.

This packet implements those six opportunities. It deliberately does NOT act on the ideas the research refuted (porting a findings reducer, adding a memory_context budget, building a fresh-evaluator/handoff framework, etc.) — those already exist or are category errors, and reimplementing them is the wrong-abstraction trap the research warns against.

### Purpose

Ship the six verified/multi-lineage improvements as four independently-shippable implementation phases, each with its own tests and regression gate, reducing context/token load and making plan-adherence machine-enforced without reinventing existing systems.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Templates** — level-gate `research.md.tmpl`; consolidate cross-level duplication in the four multi-level templates; add a rendered-view read path + authoring guard.
- **Validation / doc-logic** — promote the dormant `AC_COVERAGE` rule to default-on (advisory, non-blocking); add a `check-scope-adherence.sh` rule.
- **Context / memory** — apply the existing `enforceTokenBudget` helper at the end of `handleMemorySearch`.
- Renderer snapshot tests, validation-rule tests, and MCP handler tests for the above.

### Out of Scope

- Every idea on the 033 refutation list: porting `reduce_findings()`; adding a token budget to `memory_context` (already enforced); new Default-FAIL / fresh-evaluator / progress-handoff frameworks; Gate-3-as-reducer; GraphRAG / Kimi subagent split; claim-level memory dedup (deferred, conditional on a duplicate-rate measurement).
- Cutting raw template LOC as a goal in itself (the render already collapses core docs ~80–85%).
- Any runtime behavior change to deep-research, deep-loop reducers, or the findings-registry.

### Files to Change

- `.opencode/skills/system-spec-kit/templates/manifest/{research,spec,plan,tasks,implementation-summary,checklist}.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json`
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts` (+ snapshot tests)
- `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh`, `references/validation/validation-rules.md`, `scripts/spec/check-completion.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh` (new) + `scripts/spec/validate.sh` wiring
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts` (+ tests)
- `.opencode/skills/system-spec-kit/references/templates/template-guide.md`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Level-gate `research.md.tmpl` (Phase 1) | Rendered L1 output is materially smaller than the pre-gating full render (944 lines at every level; achieved: L1 = 175 lines) while L3/3+/phase stay byte-identical; renderer snapshot tests pass; the `research.md` documents entry in `spec-kit-docs.json` carries `owner`/`creationTrigger`/`absenceBehavior` |
| REQ-002 | Consolidate cross-level template duplication (Phase 2) | The four multi-level templates use one shared core + per-level gated addenda; **rendered output per level is byte-identical to pre-change** (renderer snapshot proof); template source shrinks materially |
| REQ-004 | Promote `AC_COVERAGE` to default-on (Phase 3) | Rule runs by default as a non-blocking advisory (surfaces an INFO-level message on under-coverage; `RULE_STATUS` stays `pass`) with the manual-infeasible escape hatch intact; a known-under-covered packet surfaces the advisory message but never errors or hard-fails; existing packets do not hard-fail under `--strict` |
| REQ-006 | Enforce a token budget in `memory_search` (Phase 4) | `handleMemorySearch` applies the shared `enforceTokenBudget` / `getTokenBudget('memory_search')`; a test proves oversized results are truncated lowest-score-first with enforcement metadata |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Rendered-view read guard + helper (Phase 2) | A documented `inline-gate-renderer --level N --stdout` (or equivalent) read path exists; an authoring-checklist item points agents to it instead of raw `.tmpl` |
| REQ-005 | Add `check-scope-adherence.sh` (Phase 3) | A new warn-severity rule verifies changed-file paths fall within the plan/spec declared scope; wired into `validate.sh`'s rule loop; passes on an in-scope fixture, warns on an out-of-scope fixture |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All four phases implemented, each with passing focused tests and a clean re-run of the authoritative workspace gate (`validate.sh --strict` + the mcp-server / renderer test suites as applicable).
- Regression baseline captured before each phase and the whole gate re-run after — reported as a delta, not a claim.
- Rendered template output verified byte-identical where "no behavior change" is claimed (REQ-002).
- No change touches any refuted surface (§3 Out of Scope); scoped diff contains no residue.
- Every completion claim carries observed command evidence (exit code / grep / diff).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **REQ-001 real savings unconfirmed** — the deep-research workflow may consume its own synthesis shape, not spec-kit's `research.md.tmpl`. Confirm the consumer before restructuring (see §10). If it is workflow-owned, the saving accrues to authoring agents only.
- **REQ-004 strictness regression** — RESOLVED by keeping AC_COVERAGE advisory (non-blocking; `RULE_STATUS` stays `pass`): default-on does not change `--strict` outcomes for existing packets; the manual-infeasible escape hatch remains.
- **REQ-002 silent divergence** — a bad consolidation could change rendered output; mitigated by the byte-identical snapshot gate.
- **REQ-005 changed-files contract** — the scope rule needs a reliable source of "what changed" (git diff at completion); contract design required before implementation.
- **Dependencies** — the 033 research report (evidence source); the inline-gate renderer + its snapshot tests; the mcp-server test harness; `validate.sh` rule-loader conventions.
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- REQ-006 must not regress search recall — measure candidate volume before capping; the budget truncates only past the cap.
- Renderer changes must not increase scaffolding time measurably (snapshot the render duration).

### Security

- No new external calls or credential surfaces; all changes are local template/validation/handler edits.

### Reliability

- Each validation-rule change preserves fail-closed behavior on missing inputs; the scope rule warns (never silently passes) when the changed-file source is unavailable.

---

## L2: EDGE CASES

### Data Boundaries

- `research.md.tmpl` at `phase` level and `3+` must still render correctly after gating (not just L1–L3).
- AC_COVERAGE with zero acceptance criteria must not divide-by-zero; empty scope in the scope rule must warn, not crash.

### Error Scenarios

- Missing renderer or malformed gate markers → fail closed (existing `template-utils.sh` behavior preserved).
- `memory_search` with results already under budget → no-op, no truncation metadata noise.

### State Transitions

- Each phase is independently revertible; no phase depends on a later phase's artifacts.

---

## L2: COMPLEXITY ASSESSMENT

Four surfaces (template renderer, template source, validation framework, MCP search handler), each with its own test suite and regression gate. Individually the recs are small-to-medium; collectively they touch enough architecture (renderer contract, validation rule-loader, MCP handler) to warrant a decision record. Planning-stage Level 2; the final level firms up as implementation LOC lands. Not phase-folder scale — the recs are loosely coupled and tracked as phases within this plan.

---

## L2: BEFORE VS AFTER

Concrete impact of the shipped optimizations (all template renders proven byte-identical where output must not change):

| Surface | Before | After |
|---------|--------|-------|
| `research.md.tmpl` | Single 944-line doc rendered in full at every level | Level-gated — L1 renders ~175 lines; L3/3+/phase render the full doc byte-identical |
| `spec` / `plan` / `tasks` / `implementation-summary` templates | Four embedded full copies per template (~2,931 source lines) | One shared core + per-level gated addenda (~1,314 lines, −55%); every level renders byte-identical |
| Template read path | Agents read the raw ungated `.md.tmpl` (the full wall) | `template-guide.md` directs agents to the rendered, level-appropriate view |
| `AC_COVERAGE` rule | Implemented but disabled by default (dormant gate) | Default-on advisory (INFO, non-blocking; `RULE_STATUS` stays `pass`) |
| Scope discipline | Prose-only convention (a 033 research lineage wandered out of scope) | `check-scope-adherence.sh` advisory rule — opt-in change-set, packet docs always in-scope |
| `memory_search` response size | Unbounded — a large result set could flood the caller's context | Token budget enforced (lowest-score dropped first), mirroring `memory_context`; feedback telemetry counts only returned results |
| Registry rule count / docs | AC_COVERAGE documented off; scope vars undocumented; counts 45/37/36 | Docs reconciled to the new behavior; registry count aligned to 46 across references |

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

1. **Phase 1 consumer** — Does the deep-research workflow read spec-kit's `research.md.tmpl`, or only its own 17-section synthesis shape? Determines the real token savings and whether REQ-001 is authoring-only. Resolve before implementing Phase 1.
2. **REQ-004 grace window** — RESOLVED: AC_COVERAGE was kept advisory (info-level, non-blocking), so default-on causes no `--strict` regression and no staged info→warn rollout is required; the manual-infeasible escape hatch remains available.
3. **REQ-005 changed-files source** — Confirm the canonical "what changed" input (git diff at completion vs task-row declared paths) before building the scope rule.
<!-- /ANCHOR:questions -->
