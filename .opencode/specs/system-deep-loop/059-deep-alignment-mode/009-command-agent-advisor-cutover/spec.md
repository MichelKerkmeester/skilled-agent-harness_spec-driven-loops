---
title: "Feature Specification: Phase 9: command-agent-advisor-cutover"
description: "Phase 009 plans the /deep:alignment command and assets, the @deep-alignment leaf agent, the advisor vocab/routing entries (mode-registry.json plus the advisor's projection maps), a behavior benchmark, and the cutover gates (parent-skill-check.cjs STRICT and validate.sh --strict). This is the plan for those artifacts, not the artifacts themselves - the final phase of the 059 packet."
trigger_phrases:
  - "deep-alignment command plan"
  - "deep-alignment leaf agent plan"
  - "deep-alignment advisor routing"
  - "deep-alignment behavior benchmark"
  - "deep-alignment cutover gates"
importance_tier: "normal"
contextType: "general"
status: "planned"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/009-command-agent-advisor-cutover"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 009 command/agent/advisor/cutover spec"
    next_safe_action: "Confirm mode-registry.json discriminator fields for a new alignment entry"
    blockers: []
    key_files:
      - ".opencode/commands/deep/review.md"
      - ".claude/agents/deep-review.md"
      - ".opencode/skills/system-deep-loop/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-009"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether @deep-alignment is one leaf agent covering all lanes or one per adapter authority"
      - "Whether the behavior benchmark reuses deep-review's scenario format or needs a lane-aware variant"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: command-agent-advisor-cutover

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
| **Phase** | 9 of 9 |
| **Predecessor** | 008-iterate-converge-report |
| **Successor** | None - final phase of the 059 packet |
| **Handoff Criteria** | A future executor can build the command, agent, advisor entries, benchmark, and run the cutover gates directly from this plan, once phases 001-008 are actually implemented (not just scaffolded) - this phase names every artifact and gate with real precedent paths. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every prior phase in this packet plans internals (adapters, runtime wiring); none of it is reachable by a user or by the advisor until a command exists to invoke it, a leaf agent exists to execute one iteration, the advisor knows to route alignment requests here, a benchmark proves the mode behaves as intended, and the standard cutover gates confirm the packet is structurally sound before it ships.

### Purpose
Produce an evidence-grounded plan for the `/deep:alignment` command and assets, the `@deep-alignment` leaf agent, the advisor's `mode-registry.json` entry plus its projection-map updates, a behavior benchmark, and the parent-skill-check/validate cutover sequence - each modeled directly on `/deep:review`'s and `@deep-review`'s real, working precedent rather than invented from scratch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Phase Context

This is **Phase 9**, the final phase, of the `system-deep-loop/059-deep-alignment-mode` mode-packet specification.

**Scope Boundary**: Plan only. No command file, no agent file, no `mode-registry.json` edit, no advisor script edit, no benchmark folder, and no `SKILL.md` for the real `deep-alignment` skill ship in this phase. This phase documents the plan for those artifacts.

**Dependencies**: Phase 003 (scaffold-mode-packet) plans the mode-packet skeleton this phase's command/agent point at. Phases 004-008 supply the scoping, adapters, and runtime wiring the command/agent actually invoke once built.

**Deliverables**: A named plan for the `/deep:alignment` command and its auto/confirm assets, the `@deep-alignment` leaf agent contract, the `mode-registry.json` entry and advisor projection-map updates, a behavior benchmark plan, and the exact cutover-gate sequence.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### In Scope
- Plan the `/deep:alignment` command as a thin router mirroring `.opencode/commands/deep/review.md`'s pattern (a single `render-command-contract.cjs --command deep/alignment` dispatch line plus frontmatter), and plan its `:auto`/`:confirm` asset YAMLs mirroring `deep_review_auto.yaml`/`deep_review_confirm.yaml`.
- Plan the `@deep-alignment` leaf agent contract mirroring `.claude/agents/deep-review.md`'s structure: illegal-nesting block, input/scope gates, single-iteration core workflow, per-lane findings classification (instead of per-dimension), write-safety boundary limited to the `alignment/` packet root, and the canonical refusal wording for nested dispatch attempts.
- Plan the `mode-registry.json` entry for a new `workflowMode: "alignment"` (or the name the 002/003 decisions settle on), including its `advisorRouting` block (`routingClass`, `legacyAdvisorId`, `legacyAliases`, `packetSkillName`) per the registry's documented discriminator contract.
- Plan the advisor projection-map updates: `DEEP_ROUTING_MODE_BY_KEY` in `skill_advisor.py` and `DEEP_MODE_BY_CANONICAL` in `aliases.ts`, both checked by the existing drift-guard test.
- Plan a behavior benchmark folder mirroring `deep-review/behavior_benchmark/`'s shape (`behavior_benchmark.md`, `scenarios/`, `baselines/`).
- Plan the cutover-gate sequence: `parent-skill-check.cjs` STRICT plus `validate.sh --strict --recursive` across the full 059 packet, run only after phases 001-008 land as real code, not just specs.

### Out of Scope
- Writing the actual command file, agent file, `mode-registry.json` edit, advisor script edits, benchmark files, or the real `deep-alignment` `SKILL.md` - future implementation work, not this scaffold.
- Running the cutover gates now - they require phases 001-008 to be built first; this phase only names the sequence.
- Resolving the exact `workflowMode` key name - that is a 002/003 decision this phase assumes will land before build.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/alignment.md` (future, not yet created) | Plan only | This phase documents the command plan; no file is created. |
| `.claude/agents/deep-alignment.md` (future, not yet created) | Plan only | This phase documents the agent plan; no file is created. |
| `.opencode/skills/system-deep-loop/mode-registry.json` (future edit target) | Plan only | This phase documents the exact entry shape; no edit happens here. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Plan the `/deep:alignment` command as a thin router matching the existing pattern. | `plan.md` cites `.opencode/commands/deep/review.md` (its single `render-command-contract.cjs` dispatch line and frontmatter shape) as the exact pattern to mirror. |
| REQ-002 | Plan the `@deep-alignment` leaf agent's LEAF-only and write-safety contract. | `plan.md` cites `.claude/agents/deep-review.md` §"ILLEGAL NESTING" and §"STATE MANAGEMENT + WRITE SAFETY" (its File Paths table) as the exact contract shape to mirror, scoped to the `alignment/` packet root instead of `review/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Plan the `mode-registry.json` entry shape for the new mode. | `plan.md` cites `.opencode/skills/system-deep-loop/mode-registry.json`'s documented `discriminator` and `advisorRoutingContract` fields and states the new entry's `workflowMode`, `backendKind`, `packetKind`, and `advisorRouting` block. |
| REQ-004 | Plan the advisor projection-map updates and their drift guard. | `plan.md` names `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`'s `DEEP_ROUTING_MODE_BY_KEY`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`'s `DEEP_MODE_BY_CANONICAL`, and `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` as the three surfaces that must move together. |
| REQ-005 | Plan the behavior benchmark and the cutover-gate sequence. | `plan.md` cites `.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/behavior_benchmark.md` as the benchmark shape to mirror and names `.opencode/commands/doctor/scripts/parent-skill-check.cjs` plus `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict --recursive` as the exact cutover-gate commands. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future implementer can author `/deep:alignment` and `@deep-alignment` directly from this plan without re-deriving the deep-review precedent's structure.
- **SC-002**: A future implementer can wire the advisor entry across all three required surfaces (registry, Python map, TypeScript map) without missing one and failing the drift guard.
- **SC-003**: The cutover-gate sequence is named precisely enough that a future "is this packet done" check has one unambiguous command set to run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-008 must be real code, not just specs, before cutover gates mean anything. | Running `parent-skill-check.cjs --strict` against an unimplemented mode-packet would fail on missing files, not report meaningful drift. | State explicitly in this phase that cutover gates run only after implementation, never against the scaffold itself. |
| Dependency | Advisor drift-guard test (`routing-registry-drift-guard.vitest.ts`) | If the new mode-registry entry and the two projection maps are not updated together, the drift guard fails CI. | Name all three surfaces in one requirement (REQ-004) so a future implementer updates them atomically. |
| Risk | `@deep-alignment`'s per-lane findings model does not map cleanly onto `@deep-review`'s per-dimension findings model. | A naive copy-paste of the deep-review agent contract could leave stale "dimension" language that confuses lane semantics. | Explicitly call out in `plan.md` which sections need lane-aware rewording versus which can be reused verbatim. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `/deep:alignment` command stays a thin dispatch line (matching `/deep:review`'s single-line body) so command-parsing overhead does not grow with mode count.

### Security
- **NFR-S01**: `@deep-alignment`'s write-safety boundary is limited to the resolved `alignment/` packet root, mirroring `@deep-review`'s read-only-review-target guarantee - the agent never writes to code, design, or git artifacts under review.

### Reliability
- **NFR-R01**: The advisor drift-guard test must pass before this phase's cutover gates are considered satisfied; a green `mode-registry.json` update with a red drift guard is not a completed cutover.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A user invokes `/deep:alignment` before phases 001-008 are implemented: the command should surface a clear "mode not yet available" error rather than a confusing runtime failure deep in an unimplemented adapter.

### Error Scenarios
- The advisor scores an alignment-shaped request against `sk-code`/`sk-git`/`sk-design`/`system-spec-kit` instead of `deep-alignment` because the new routing entry has not landed: this is expected pre-cutover behavior, not a bug, and should be named as such in the plan.

### State Transitions
- Not applicable to this phase - no state is mutated by command/agent/registry planning itself.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five distinct artifact plans (command, agent, registry, advisor maps, benchmark) plus the cutover-gate sequence. |
| Risk | 10/25 | Drift-guard coordination risk and per-lane-vs-per-dimension agent-contract translation risk, both named above. |
| Research | 10/20 | Cross-read of `/deep:review`, `@deep-review`, `mode-registry.json`, the advisor projection maps, and the behavior-benchmark precedent. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether `@deep-alignment` is one leaf agent covering all lanes/authorities or one per adapter authority - TBD, resolve once phases 006-008 land as real code and the per-lane dispatch shape is concrete.
- Whether the behavior benchmark reuses deep-review's scenario format as-is or needs a lane-aware variant - TBD.
- Exact `workflowMode` key name for the new mode (`"alignment"` assumed throughout this plan) - depends on the 002/003 decisions, not resolved here.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
