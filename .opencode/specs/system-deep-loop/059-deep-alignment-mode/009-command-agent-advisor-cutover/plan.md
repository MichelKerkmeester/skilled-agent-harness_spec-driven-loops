---
title: "Implementation Plan: Phase 9: command-agent-advisor-cutover"
description: "Plan the /deep:alignment command and assets, the @deep-alignment leaf agent, the mode-registry.json entry plus advisor projection-map updates, a behavior benchmark, and the parent-skill-check/validate cutover-gate sequence - each modeled on the real, working /deep:review and @deep-review precedent."
trigger_phrases:
  - "phase 009 implementation plan"
  - "deep-alignment command agent plan"
  - "advisor routing plan"
  - "cutover gate sequence"
importance_tier: "normal"
contextType: "general"
status: "planned"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/009-command-agent-advisor-cutover"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 009 command/agent/advisor/cutover implementation plan"
    next_safe_action: "Await phases 001-008 implementation before running cutover gates"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/009-command-agent-advisor-cutover/spec.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/009-command-agent-advisor-cutover/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: command-agent-advisor-cutover

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
| **Language/Stack** | Markdown command/agent files, JSON registry, Python + TypeScript advisor maps, YAML workflow assets, Node/vitest for the drift-guard test |
| **Framework** | `deep-alignment` mode-packet (planned, not yet scaffolded) surfaced through the `system-deep-loop` hub's command/agent/advisor surfaces |
| **Storage** | None new in this phase - the registry and advisor maps are existing files this phase plans an entry into |
| **Testing** | None runnable in this phase - the drift-guard test (`routing-registry-drift-guard.vitest.ts`) and the cutover gates are planned build-out work |

### Overview
This phase plans, not builds, the five outward-facing artifacts that make `deep-alignment` reachable: the command, the leaf agent, the advisor routing entry (three coordinated surfaces), a behavior benchmark, and the final cutover-gate sequence. Every artifact is modeled directly on `/deep:review` and `@deep-review`'s real, working shape rather than invented, so the translation work in a future build phase is mechanical, not exploratory.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003's mode-packet skeleton plan (out of this agent's scope) names where the command and agent files will physically live.
- [ ] Phases 006-008's adapter and runtime-wiring plans are available so the agent contract's per-lane findings shape is concrete.
- [ ] `/deep:review` and `@deep-review`'s current shape is confirmed unchanged since this plan was authored.

### Definition of Done
- [ ] All five artifact plans (command, agent, registry entry, advisor maps, benchmark) are concrete enough to code from.
- [ ] The cutover-gate sequence is named precisely, with an explicit "only after phases 001-008 are real code" precondition.
- [ ] `checklist.md` items are reviewed and either checked with evidence or explicitly deferred.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin-router command plus LEAF-only iteration agent plus registry-driven advisor routing, mirroring the existing `/deep:review` / `@deep-review` / `mode-registry.json` triad exactly.

### Key Components
- **`/deep:alignment` command**: a thin router file at `.opencode/commands/deep/alignment.md`, mirroring `.opencode/commands/deep/review.md`'s single-line body (`!`node .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs --command deep/alignment -- '$ARGUMENTS'``) and frontmatter shape (`description`, `argument-hint`, `allowed-tools`). Its `:auto`/`:confirm` asset YAMLs mirror `.opencode/commands/deep/assets/deep_review_auto.yaml` / `deep_review_confirm.yaml`, adapted for the SCOPE phase's structured lane-resolution question (a first-class entry phase deep-review lacks, per the design brief).
- **`@deep-alignment` leaf agent**: a new file at `.claude/agents/deep-alignment.md`, mirroring `.claude/agents/deep-review.md` section-by-section: §"0. ILLEGAL NESTING" (LEAF-only, canonical refusal wording) reused verbatim in spirit; §"0b. INPUT + SCOPE GATES" adapted to require the resolved lane list instead of a single review target; §"1. CORE WORKFLOW" adapted so "DETERMINE FOCUS" selects the next lane/artifact slice per phase 008's corpus-partitioning plan instead of a review dimension; §"3. REVIEW CONTRACT" replaced with an alignment contract citing the per-authority adapter `standardSource()` instead of `review_core.md`; §"4. STATE MANAGEMENT + WRITE SAFETY" File Paths table rebuilt against `alignment/` paths (state log, findings registry, strategy, iteration files, pause sentinel) instead of `review/` paths.
- **`mode-registry.json` entry**: a new object in the `modes` array per `.opencode/skills/system-deep-loop/mode-registry.json`'s documented `discriminator` (`workflowMode`, `runtimeLoopType`, `backendKind`) and `advisorRoutingContract` (`routingClass`, `legacyAdvisorId`, `legacyAliases`, `packetSkillName`) fields, with `runtimeLoopType` set per whichever option phase 008's convergence decision lands on (either `"alignment"` if the enum is extended, or `null`/`"review"` if reused).
- **Advisor projection-map updates**: add the new mode to `DEEP_ROUTING_MODE_BY_KEY` in `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` and to `DEEP_MODE_BY_CANONICAL` in `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`, keeping both in sync with the new registry entry per the registry's own documented invariant ("the advisor keeps hardcoded projection maps... in sync with this registry's advisorRouting projection... a CI drift-guard asserts maps == registry projection"). Verify with `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`.
- **Behavior benchmark**: a new `deep-alignment/behavior_benchmark/` folder mirroring `.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/`'s shape (`behavior_benchmark.md`, `scenarios/`, `baselines/`), with scenarios covering at minimum: a clean corpus (expect PASS/converge quickly), a corpus with real conventional-commit violations (expect the sk-git lane to FAIL with cited evidence), and a known-deviation-suppressed corpus (expect no false-positive findings).
- **Cutover gates**: run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs` in STRICT mode against the real `deep-alignment` skill directory once phase 003's skeleton is built out, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/059-deep-alignment-mode --recursive --strict` across the full packet.

### Data Flow
A user or the advisor invokes `/deep:alignment`, the command dispatches to the SCOPE phase (structured lane-resolution question or non-interactive lane args), the loop (phase 008's wiring) drives iterations by dispatching `@deep-alignment` once per iteration, findings roll up through the per-lane reducer, and the command reports the converged `alignment-report.md`. The advisor's registry entry and projection maps make this reachable by natural-language routing in addition to explicit `/deep:alignment` invocation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the fix-bug sense - this phase plans five net-new outward-facing artifacts and modifies no existing runtime behavior yet. Recorded for template completeness:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/commands/deep/review.md` | Owns the live thin-router pattern for deep-loop commands | Read-only precedent for the new command; not modified | Cited by path above |
| `.claude/agents/deep-review.md` | Owns the live LEAF-agent contract pattern | Read-only precedent for the new agent; not modified | Cited by path above |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Owns the live three-tier discriminator for all deep-loop modes | Read-only analysis in this phase; a future phase adds a new `modes[]` entry | Discriminator/advisorRoutingContract fields cited above |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`, `mcp_server/lib/scorer/aliases.ts` | Own the live advisor routing projection maps | Read-only analysis in this phase; a future phase adds entries to both, kept in sync by the existing drift-guard | Cited by path above |

Required inventories:
- Same-class producers: `rg -n '"workflowMode":' .opencode/skills/system-deep-loop/mode-registry.json` enumerates every existing mode entry as the pattern set the new entry must match.
- Consumers of changed symbols: not applicable - no symbols change in this phase.
- Matrix axes: artifact (command, agent, registry entry, advisor maps x2, benchmark) x precedent source (deep-review's matching artifact) = 6 rows, all named above.
- Algorithm invariant: not applicable - no parser/resolver/security code ships in this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 003's mode-packet skeleton plan names the command/agent file locations.
- [ ] Re-read `.opencode/commands/deep/review.md` and `.claude/agents/deep-review.md` for currency.
- [ ] Re-read `.opencode/skills/system-deep-loop/mode-registry.json`'s discriminator/advisorRoutingContract documentation for currency.

### Phase 2: Core Implementation
- [ ] Author `/deep:alignment` command and its `:auto`/`:confirm` asset YAMLs, once phase 003's skeleton exists.
- [ ] Author `@deep-alignment` leaf agent, translating the per-dimension deep-review contract to the per-lane alignment contract per the Architecture section above.
- [ ] Add the `mode-registry.json` entry.
- [ ] Add the advisor projection-map entries and confirm the drift-guard test passes.
- [ ] Author the behavior benchmark folder and its three minimum scenarios.

### Phase 3: Verification
- [ ] Run `parent-skill-check.cjs` in STRICT mode against the real `deep-alignment` skill directory.
- [ ] Run `validate.sh .opencode/specs/system-deep-loop/059-deep-alignment-mode --recursive --strict` across the full packet.
- [ ] Run the behavior benchmark and confirm all three minimum scenarios behave as expected.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor projection-map sync | `routing-registry-drift-guard.vitest.ts` |
| Integration | Command -> loop -> agent -> reducer -> report end-to-end | Manual dry-run once phases 001-008 are implemented |
| Manual | Behavior benchmark scenario correctness | `.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/behavior_benchmark.md`-pattern scenario execution |
| Gate | Structural packet health | `parent-skill-check.cjs --strict`, `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 mode-packet skeleton | Internal, sibling phase (out of this agent's scope) | Not yet built | Command/agent files have no confirmed home until this lands. |
| Phases 006-008 adapters + runtime wiring (this agent's own prior work) | Internal | Planned, not yet built | The agent's per-lane findings contract cannot be finalized in code until these are real. |
| Advisor drift-guard test | Internal CI gate | Existing, live | If the new registry entry and both projection maps are not added together, this test fails and blocks cutover. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The drift-guard test fails after adding the new mode, or `parent-skill-check.cjs --strict` / `validate.sh --strict --recursive` fail against the real implementation.
- **Procedure**: Revert the registry entry and advisor-map edits together (never partially, to avoid a persistent drift-guard failure for other modes), fix the failing gate, and re-run the full cutover sequence before re-attempting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (n/a) ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 skeleton location confirmed | Core |
| Core | Setup, phases 006-008 real implementation | Verify |
| Verify | Core | Packet-level completion (all 9 phases done) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Re-read 3 precedent surfaces |
| Core Implementation | High | Five artifacts, one of them (the agent) a substantial per-lane translation of an existing contract |
| Verification | Medium | Two structural gates plus a three-scenario benchmark run |
| **Total** | | **High (this is the packet's final, integration-heavy phase)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phases 001-008 confirmed real (not scaffold-only) before running cutover gates.
- [ ] Advisor drift-guard test green in isolation before the full packet gate runs.

### Rollback Procedure
1. If cutover gates fail, do not partially land the advisor entry (registry-only or maps-only) - revert the full set together.
2. Revert command/agent files via normal version control if the end-to-end dry-run surfaces a contract mismatch.
3. Re-verify against the Testing Strategy table before re-attempting cutover.
4. Notify via the packet's changelog entry once cutover succeeds, not before.

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
