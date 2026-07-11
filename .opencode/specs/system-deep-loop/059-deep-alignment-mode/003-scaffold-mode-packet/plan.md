---
title: "Implementation Plan: Phase 3: scaffold-mode-packet"
description: "Deep-alignment mode-packet skeleton built and independently re-verified against this plan's §3 shape. SKILL.md, mode-registry.json entry, hub-router.json touchpoints, directory skeleton, and changelog all confirmed on disk and correct. One gap: the advisor routing-registry drift guard fails because deep-alignment is not wired into aliases.ts / skill_advisor.py."
trigger_phrases:
  - "deep-alignment scaffold plan"
  - "alignment mode packet plan"
  - "deep-alignment registry entry plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/003-scaffold-mode-packet"
    last_updated_at: "2026-07-11T12:57:42Z"
    last_updated_by: "claude"
    recent_action: "Re-verified Phase 1/2/3; drift-guard test fails 5/7 subtests"
    next_safe_action: "Update advisor projection maps, rerun drift guard"
    blockers:
      - "routing-registry-drift-guard.vitest.ts fails 5/7 -- see spec.md blockers for full evidence"
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/skills/system-deep-loop/hub-router.json"
      - ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-mode-packet"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Whether wiring the advisor's TS/Python projection maps is this phase's own T011 responsibility or phase 009's advisor-cutover scope"
    answered_questions:
      - "SKILL.md / mode-registry.json / hub-router.json / directory skeleton / changelog all confirmed built and shape-correct by independent re-verification (2026-07-11)"
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
| **Testing** | `validate.sh --strict` on this phase folder: PASS, Errors:0. `routing-registry-drift-guard.vitest.ts` run directly (2026-07-11): 5 of 7 sub-tests FAIL -- see §2 Definition of Done and spec.md blockers |

### Overview
This phase specified, and — now that 002-architecture-decision is Accepted and operator-approved (2026-07-11) — created, the `deep-alignment` mode-packet skeleton: the thin-contract SKILL.md, the mode-registry.json entry, the hub-router.json touchpoints, the directory skeleton, and the changelog entry. Every artifact is grounded in the real, currently-shipping `deep-review` mode packet rather than invented from scratch. **Independent re-verification (2026-07-11) confirms Phase 2 executed**: every file this section lists exists on disk and matches the shape below. One gap: Phase 3's own drift-guard check (T011) fails because the advisor's TS/Python projection maps were never updated to match the new registry entry.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 002-architecture-decision has locked the new-mode-packet decision, the adapter contract, and the alignment contract — Accepted, operator-approved 2026-07-11 (ADR-001, ADR-003, ADR-005).
- [x] `.opencode/skills/system-deep-loop/deep-review/SKILL.md`, `mode-registry.json`, and `hub-router.json` have been read as the structural precedent. (Confirmed by the shape match between deep-alignment's real artifacts and this section's §3 model.)

### Definition of Done
- [x] The SKILL.md, mode-registry.json, hub-router.json, directory skeleton, and changelog plans are each specified with cited real-file line references, AND the real artifacts now exist matching that shape (confirmed by independent re-verification, 2026-07-11).
- [x] Every unresolved design item is explicitly flagged as pending 002-architecture-decision or phase 008/009, not silently decided here -- with one exception surfaced by re-verification: the `routingClass: "lexical"` value was asserted without flagging that it requires advisor-map wiring (phase 009 territory per this doc's own Out-of-Scope in spec.md). See spec.md Open Questions.
- [x] `validate.sh` passes `--strict` with Errors:0 on this phase folder. (Confirmed 2026-07-11, both before and after this re-verification pass's doc updates.)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin mode-packet, peer of `deep-review` under the `system-deep-loop` parent hub. `deep-alignment` reuses the runtime convergence engine and prompt-pack renderer; it does not fork them.

### Key Components (built and independently re-verified 2026-07-11)

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

Not applicable. This phase is not a bug fix. It planned, and (now that the 002 gate is open) created, the `deep-alignment` mode-packet skeleton plus the `mode-registry.json`/`hub-router.json` entries — see §4 Phase 2. Independent re-verification (2026-07-11) confirms that execution happened and matches the planned shape, with one gap: the routing-registry drift guard fails (§4 Phase 3, T011).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `.opencode/skills/system-deep-loop/deep-review/SKILL.md` in full for the thin-contract shape.
- [x] Read `.opencode/skills/system-deep-loop/mode-registry.json` (discriminator block plus the `"review"` mode entry) for the registry field shape.
- [x] Read `.opencode/skills/system-deep-loop/hub-router.json` for router-signal and tie-break shape.
- [x] Read `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` for the iteration-prompt renderer contract.
- [x] Confirm 002-architecture-decision's locked decisions before treating any field value in this plan as final.

### Phase 2: Core Implementation (executed and independently re-verified 2026-07-11)
- [x] Author `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` from the shape specified in §3. (Confirmed on disk, matches shape.)
- [x] Add the `"alignment"` entry to `.opencode/skills/system-deep-loop/mode-registry.json`'s `modes[]` array. (Confirmed: valid JSON, all fields present.)
- [x] Add `routerSignals.alignment` and extend `routerPolicy.tieBreak` in `.opencode/skills/system-deep-loop/hub-router.json`. (Confirmed: valid JSON, keys match registry.)
- [x] Create the `assets/`, `references/`, `changelog/` directory skeleton under `deep-alignment/`. (Confirmed on disk.)
- [x] Author `deep-alignment/changelog/v1.0.0.0.md` following the plain-H2 convention. (Confirmed on disk.)

### Phase 3: Verification (independently re-verified 2026-07-11 — T011 found failing)
- [B] Confirm the mode-registry.json drift-guard (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`) still passes after the new entry is added. (RUN 2026-07-11: 5 of 7 sub-tests FAIL -- deep-alignment missing from aliases.ts/skill_advisor.py projection maps. Blocked pending map wiring or a routingClass downgrade decision.)
- [x] Confirm `routerSignals` keys stay bidirectionally equal to registry `workflowMode` values, per the existing sk-prompt precedent check. (Confirmed by direct computation: both 8-entry sets match.)
- [x] Confirm no adapter, command, or agent file was created — those belong to later phases. (Confirmed: no `/deep:alignment` command or `deep-alignment` agent file exists anywhere.)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Result (2026-07-11) |
|-----------|-------|-------|----------------------|
| Spec-folder docs | This phase's own spec-folder documents | `validate.sh --strict` | PASS, Errors:0 |
| Structural | Live SKILL.md/registry/router edits | `routing-registry-drift-guard.vitest.ts` | FAIL -- 5 of 7 sub-tests, deep-alignment missing from aliases.ts/skill_advisor.py projection maps |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-architecture-decision | Internal | Accepted (operator-approved 2026-07-11) | Frozen packet shape now available; the loopType/scripts field *values* still track the separately-open ADR-010 (owned by phase 008) |
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
