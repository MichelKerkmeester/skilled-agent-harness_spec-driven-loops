---
title: "Implementation Plan: Phase 3: scaffold-mode-packet"
description: "Plan the deep-alignment mode-packet skeleton: SKILL.md shape, mode-registry.json entry, hub-router touchpoints, prompt-pack reuse, directory skeleton, and changelog, modeled directly on the real deep-review packet."
trigger_phrases:
  - "deep-alignment scaffold plan"
  - "alignment mode packet plan"
  - "deep-alignment registry entry plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/003-scaffold-mode-packet"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted scaffold plan citing deep-review precedent"
    next_safe_action: "Await 002 gate approval before execution"
    blockers:
      - "002-architecture-decision not yet approved"
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/skills/system-deep-loop/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-mode-packet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: scaffold-mode-packet

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
| **Language/Stack** | OpenCode skill markdown, JSON registry metadata, TypeScript prompt-pack renderer |
| **Framework** | `system-deep-loop` mode-packet pattern (three-tier discriminator: `workflowMode`/`runtimeLoopType`/`backendKind`) |
| **Storage** | Future `.opencode/skills/system-deep-loop/deep-alignment/` packet directory |
| **Testing** | None in this phase — this is a design-only pass; the future implementation pass runs `parent-skill-check.cjs`-equivalent structural checks |

### Overview
This phase does not touch a single file outside its own spec-folder. It specifies, in enough detail that a future implementation pass needs no further judgment calls, the shape of the `deep-alignment` mode-packet skeleton: the thin-contract SKILL.md, the mode-registry.json entry, the hub-router.json touchpoints, the prompt-pack reuse plan, the directory skeleton, and the changelog entry. Every planned artifact is grounded in the real, currently-shipping `deep-review` mode packet rather than invented from scratch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 002-architecture-decision has locked the new-mode-packet decision, the adapter contract, and the alignment contract.
- [ ] `.opencode/skills/system-deep-loop/deep-review/SKILL.md`, `mode-registry.json`, and `hub-router.json` have been read as the structural precedent.

### Definition of Done
- [ ] The SKILL.md, mode-registry.json, hub-router.json, prompt-pack reuse, directory skeleton, and changelog plans are each specified with cited real-file line references.
- [ ] Every unresolved design item is explicitly flagged as pending 002-architecture-decision, not silently decided here.
- [ ] `validate.sh` passes `--strict` with Errors:0 on this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin mode-packet, peer of `deep-review` under the `system-deep-loop` parent hub. `deep-alignment` reuses the runtime convergence engine and prompt-pack renderer; it does not fork them.

### Key Components (planned, not yet built)

**SKILL.md shape** — modeled on `.opencode/skills/system-deep-loop/deep-review/SKILL.md:1-6`:
- Frontmatter: `name: deep-alignment`, `description` (structured-scoping conformance-review loop), `allowed-tools` (a subset of deep-review's set — read-only by default per the alignment contract's "READ-ONLY default" invariant, with `Task`/`Bash` reserved for the gated remediation pass), `argument-hint` (target/authority/scope plus `:auto`/`:confirm` and non-interactive lane args), `version: 1.0.0.0`.
- Body sections mirroring deep-review's structure: "WHEN TO USE" (structured conformance review across named authorities, NOT general correctness review), a "FORBIDDEN INVOCATION PATTERNS" section stating the mode is invoked exclusively through its future `/deep:alignment` command, and an explicit boundary statement distinguishing it from `parent-skill-check.cjs` (structure) and `deep-review` (general correctness).

**mode-registry.json entry** — modeled on the `"review"` mode block at `.opencode/skills/system-deep-loop/mode-registry.json:55-73`:
- `workflowMode: "alignment"`.
- `runtimeLoopType`: planned default `"review"` (reuse, per the registry's own discriminator note at `.opencode/skills/system-deep-loop/mode-registry.json:5` that this field is "Validated against exactly research|review|council"); final value follows the reuse-boundary resolution (open ADR-010, owned by phase 008).
- `backendKind`: planned default `"runtime-loop-type"` (reuse the runtime engine, not `improvement-host` or `external-adapter`); final value follows the reuse-boundary resolution (open ADR-010, owned by phase 008).
- `packetKind: "workflow"`, `packet: "deep-alignment"`, `command: "/deep:alignment"`, `agent: "deep-alignment"`, `artifactRoot: "alignment/"`.
- `toolSurface`: read-only allowed set for the default (non-remediation) run, per the alignment contract.
- `aliases`: alignment-conformance vocabulary (e.g. "alignment lane", "conformance review", "standard authority check") distinct from deep-review's review-aliases class, to avoid router collision.
- `advisorRouting`: `routingClass: "lexical"`, new `legacyAdvisorId: "deep-alignment"`, `packetSkillName: "deep-alignment"`.

**hub-router.json touchpoints** — modeled on `.opencode/skills/system-deep-loop/hub-router.json:4-24`:
- `routerPolicy.tieBreak` gains an `"alignment"` entry (insertion point: `.opencode/skills/system-deep-loop/hub-router.json:7`).
- `routerSignals.alignment` block added, mirroring the `review` block shape at `.opencode/skills/system-deep-loop/hub-router.json:20-24` (`weight`, `classes: ["alignment-aliases", "hub-identity"]`, `resources: ["deep-alignment/SKILL.md"]`).

**Prompt-pack reuse** — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` renders iteration prompts for research/review/council today; the plan is to pass an alignment-specific section set (lane authority, artifact-class, known-deviation suppression list, verify-first instruction) through the same renderer rather than forking a parallel template file.

**Directory skeleton** — modeled on the real `.opencode/skills/system-deep-loop/deep-review/` tree: `assets/` (mode-specific config/dashboard assets), `references/` (protocol/state/convergence docs), `changelog/` (per-version entries). A `scripts/` directory is deferred until the reuse boundary is resolved (open ADR-010, owned by phase 008) — that resolution decides whether adapters get authority-specific scripts or stay data-only.

**Changelog entry** — `deep-alignment/changelog/v1.0.0.0.md`, plain-H2, no TOC, matching `.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md:1-10`.

### Data Flow
Not applicable to this phase — no runtime data flow is built or changed here. The plan only describes where the future packet's files will live and what shape they take.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase is not a bug fix and touches zero production surfaces; it produces planning documentation only, scoped to `.opencode/specs/system-deep-loop/059-deep-alignment-mode/003-scaffold-mode-packet/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `.opencode/skills/system-deep-loop/deep-review/SKILL.md` in full for the thin-contract shape.
- [ ] Read `.opencode/skills/system-deep-loop/mode-registry.json` (discriminator block plus the `"review"` mode entry) for the registry field shape.
- [ ] Read `.opencode/skills/system-deep-loop/hub-router.json` for router-signal and tie-break shape.
- [ ] Read `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` for the iteration-prompt renderer contract.
- [ ] Confirm 002-architecture-decision's locked decisions before treating any field value in this plan as final.

### Phase 2: Core Implementation (future execution pass — not run in this phase)
- [ ] Author `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` from the shape specified in §3.
- [ ] Add the `"alignment"` entry to `.opencode/skills/system-deep-loop/mode-registry.json`'s `modes[]` array.
- [ ] Add `routerSignals.alignment` and extend `routerPolicy.tieBreak` in `.opencode/skills/system-deep-loop/hub-router.json`.
- [ ] Create the `assets/`, `references/`, `changelog/` directory skeleton under `deep-alignment/`.
- [ ] Author `deep-alignment/changelog/v1.0.0.0.md` following the plain-H2 convention.

### Phase 3: Verification (future execution pass — not run in this phase)
- [ ] Confirm the mode-registry.json drift-guard (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`) still passes after the new entry is added.
- [ ] Confirm `routerSignals` keys stay bidirectionally equal to registry `workflowMode` values, per the existing sk-prompt precedent check.
- [ ] Confirm no adapter, command, or agent file was created — those belong to later phases.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Planning-only | This phase's own spec-folder documents | `validate.sh --strict` |
| Deferred structural | Future SKILL.md/registry/router edits | `parent-skill-check.cjs`-equivalent + `routing-registry-drift-guard.vitest.ts`, run when phase 003's execution pass actually happens |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-architecture-decision | Internal | Pending | The frozen packet shape is unavailable; the loopType/scripts questions additionally track open ADR-010 (phase 008) |
| `.opencode/skills/system-deep-loop/deep-review/` (structural precedent) | Internal | Green | Without it, the scaffold plan would have no grounded shape to model |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` | Internal | Green | Without it, alignment iterations would need a forked prompt renderer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: 002-architecture-decision changes the new-mode-packet decision (e.g. folds alignment into deep-review as a mode instead of a peer packet).
- **Procedure**: Revise this phase's spec.md/plan.md/tasks.md scope and requirements to match the new decision before any execution pass runs; no live files exist yet, so no code rollback is needed.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
