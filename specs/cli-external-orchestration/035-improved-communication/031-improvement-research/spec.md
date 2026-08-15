---
title: "Phase 031 Communication Projection Improvement Research"
description: "Research concrete and ranked improvements to the shipped communication projection and the sk-communication skill across operator UX, documentation, package architecture, and skill guidance."
trigger_phrases:
  - "communication projection improvement research"
  - "sk-communication improvements"
  - "projection operator UX"
  - "communication package architecture"
  - "communication documentation review"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/031-improvement-research"
    last_updated_at: "2026-08-15T08:26:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed the accurate Phase-030-grounded improvement research"
    next_safe_action: "Open a build phase for the P1 dist/packaging and UX quick wins"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bb1ca027-0786-4a43-afce-4317917d4227"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Architecture: Phase 030 loader, plugin, and wrapper are real and wired. Prior absent and no-op claims were corrected by the canonical run."
      - "A built dist/ is the load prerequisite for both entry points and is absent on fresh checkouts."
      - "The wrapper is not in the packed artifact because there is no bin field and the files list includes only dist and docs."
      - "The config surface is invisible to the skill router and 21 catalog and playbook assets are not surfaced."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 031 Communication Projection Improvement Research

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

This research phase investigates concrete improvements to the shipped communication projection and the `sk-communication` skill. It evaluates operator UX, documentation, package architecture, and the skill itself. Every recommendation must start from the current shipped state rather than an assumed redesign.

**Key decision**: this is a research-only phase. The deliverable is a ranked list of recommendations with rationale and rough effort. Implementation belongs to a later build phase.

**Critical dependency**: the research must inspect the Phase 030 `localProvider` loader at `src/config/local-provider.ts`, the OpenCode plugin and `bin/cli-output-wrapper.mjs` entry points, the package `docs/`, and the skill's `SKILL.md`, `references/`, and `feature-catalog/`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | N/A, no git operations in this research setup |
| **Parent Spec** | `../spec.md` |
| **Phase** | 31 research child |
| **Predecessor** | `030` shipped local-provider implementation |
| **Successor** | A later build phase selected from the ranked recommendations |
| **Handoff Criteria** | Complete. The canonical loop wrote `research/research.md` with 33 findings and `research/resource-map.md` is present. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 030 shipped the `localProvider` loader. The broader communication projection is now available through two entry points, an OpenCode plugin and `bin/cli-output-wrapper.mjs`. The package also includes operator documentation and a dedicated `sk-communication` skill. This phase studies how those shipped surfaces can become easier to enable, understand, extend, and use.

**Scope boundary**: research and recommendation only. This phase does not alter shipped runtime behavior, package wiring, documentation, or skill content.

**Dependencies**:

- The Phase 030 `localProvider` loader at `src/config/local-provider.ts`
- The OpenCode plugin and `bin/cli-output-wrapper.mjs` wiring
- The package provider, transport, and judge design
- The package `docs/` corpus
- The `sk-communication` skill's `SKILL.md`, `references/`, and `feature-catalog/`
- The `/deep:research` loop that will produce the research deliverable

**Deliverables**:

- A grounded assessment of the current shipped state across four axes
- A ranked list of improvement recommendations with rationale and rough effort
- A loop-authored `research/research.md` that records evidence and conclusions
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Research Question

What concrete and ranked improvements should be made to the shipped communication projection and the `sk-communication` skill across operator UX, documentation, package architecture, and skill guidance?

### Grounding: The Real Current Gaps

The research begins with the shipped system and tests improvement opportunities against four axes:

1. **Operator UX**: determine how enablement, local-provider configuration, and activation can become simpler and more discoverable.
2. **Documentation**: assess completeness, structure, onboarding flow, and discoverability across the package `docs/`.
3. **Package architecture**: assess the `localProvider` loader, provider, transport, and judge design, extensibility, and the plugin plus wrapper entry-point wiring.
4. **The sk-communication skill**: assess its `SKILL.md` structure, routing and logic, references, feature catalog, and the guidance it gives a user.

### Purpose

Produce a grounded and ranked recommendation set that identifies what to improve next, why each improvement matters, and the rough effort required. The result must help a later build phase select work without reopening basic discovery.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Evaluate operator enablement, local-provider setup, activation, and discoverability.
- Evaluate package documentation for completeness, organization, onboarding, and discoverability.
- Evaluate the `localProvider` loader and the provider, transport, and judge architecture.
- Evaluate extensibility and the two-entry-point wiring through the OpenCode plugin and CLI wrapper.
- Evaluate the `sk-communication` skill's structure, routing, logic, references, feature catalog, and user guidance.
- Rank recommendations across all four axes with rationale and rough effort.
- Record the canonical deep-research method of 5 iterations using one `cli-opencode` executor, model `opencode-go/deepseek-v4-flash`, and convergence threshold 0.05.

### Out of Scope

- Implementing any recommendation.
- Changing shipped runtime behavior now.
- Modifying the plugin, wrapper, loader, providers, transports, judge, documentation, or skill.
- Authoring `research/research.md` during packet setup.

### Technical Approach

Run a 5-iteration deep-research loop with a convergence threshold of 0.05. Use a single `cli-opencode` executor with the `opencode-go/deepseek-v4-flash` model. Ground every iteration in the current shipped Phase 030 files and write the final synthesis to `research/research.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Research question, scope, grounding, and acceptance contract |
| `plan.md` | Create | Fixed deep-research method and evidence plan |
| `tasks.md` | Create | Planned loop execution and verification tasks |
| `checklist.md` | Create | Level-2 verification contract |
| `research/research.md` | Workflow-generated | Ranked recommendations produced later by the deep-research loop |
| `031-improvement-research/` | Create | Planned Level-2 research packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ground all findings in the shipped state. | Claims cite the loader, both entry points, package docs, and skill assets that exist when the loop runs. |
| REQ-002 | Follow the fixed research method. | The loop runs exactly 5 iterations using `cli-opencode`, `opencode-go/deepseek-v4-flash`, and convergence threshold 0.05. |
| REQ-003 | Evaluate operator UX. | Recommendations cover enablement, local-provider configuration, activation, and discoverability. |
| REQ-004 | Evaluate documentation. | Recommendations cover completeness, structure, onboarding, and discoverability. |
| REQ-005 | Evaluate package architecture. | Recommendations cover the loader, provider, transport, judge, extensibility, and both entry points. |
| REQ-006 | Evaluate the skill. | Recommendations cover `SKILL.md`, routing and logic, references, feature catalog, and user guidance. |
| REQ-007 | Rank the recommendations. | The deliverable provides an ordered list with rationale and rough effort for every recommendation. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Keep the phase research-only. | Only packet docs, metadata, loop state, and loop-authored research are changed by this phase. |
| REQ-009 | Preserve evidence traceability. | Each recommendation identifies the shipped surface and observed issue that justify it. |
| REQ-010 | Produce the canonical deliverable. | The loop writes the final recommendation set to `research/research.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The loop completes all 5 iterations using the fixed executor and model, then stops at `maxIterationsReached`.
- **SC-002**: `research/research.md` evaluates all four axes against the shipped state.
- **SC-003**: The deliverable ranks concrete recommendations and gives rationale plus rough effort for each item.
- **SC-004**: Every recommendation points to current shipped evidence.
- **SC-005**: Phase 031 passes strict validation with `Errors: 0  Warnings: 0` after the research deliverable is present and verified.

### Acceptance Scenarios

1. **Given** the shipped operator flow, **When** the loop evaluates enablement and local-provider setup, **Then** it identifies and ranks ways to reduce setup and discovery friction.
2. **Given** the package docs, **When** the loop evaluates onboarding and structure, **Then** it identifies concrete documentation gaps and improvements.
3. **Given** the loader and runtime architecture, **When** the loop evaluates extensibility, **Then** it ranks architectural improvements without redesigning from assumptions.
4. **Given** the current skill package, **When** the loop evaluates its guidance, **Then** it ranks changes to structure, routing, logic, and user direction.
5. **Given** all 5 iterations, **When** the loop synthesizes the result, **Then** `research/research.md` contains 33 findings and one ranked cross-axis recommendation list with rationale and rough effort.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current shipped implementation and docs | High | Cite current files and distinguish observed facts from proposals |
| Dependency | `cli-opencode` with `opencode-go/deepseek-v4-flash` | High | Fix one executor and model for all 5 iterations |
| Risk | Recommendations drift into implementation | High | Keep code and package changes outside this phase |
| Risk | One axis dominates the synthesis | Medium | Require explicit findings and ranking coverage for all four axes |
| Risk | Suggestions are generic | High | Require a shipped evidence anchor, rationale, and rough effort for each recommendation |
| Risk | The loop stops before its bound | High | Verify all 5 iterations and the `maxIterationsReached` stop reason before synthesis |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The research should distinguish low-effort operator and documentation changes from larger architectural work.
- **NFR-P02**: Rough effort estimates must use a consistent scale across all four axes.

### Security and Privacy

- **NFR-S01**: Recommendations must preserve the shipped privacy and fail-closed boundaries unless evidence supports a safer alternative.
- **NFR-S02**: Research artifacts must contain no credentials, private message content, or protected runtime data.

### Reliability

- **NFR-R01**: Recommendations must account for both the plugin and wrapper entry points so later changes do not create divergent behavior.
- **NFR-R02**: The synthesis must separate confirmed shipped behavior from inferred improvement opportunities.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- The plugin and wrapper expose different operator friction or activation behavior.
- Documentation describes behavior that no longer matches Phase 030.
- A proposed loader simplification weakens provider extensibility.
- A proposed provider abstraction duplicates transport or judge responsibilities.
- Skill routing guidance conflicts with package documentation.
- A recommendation helps expert operators but makes first-time onboarding harder.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Four research axes across runtime, docs, and skill surfaces |
| Risk | 10/25 | Research-only work with later architectural influence |
| Research | 18/20 | Ten forced iterations grounded in the shipped system |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

No open research questions remain for close-out. The outcomes are:

- The valid operator priorities are the `dist/` fresh-checkout trap, a machine-assertable status or check command, and enablement foot-guns.
- The valid documentation priorities are an index, deduplicated enablement guidance, corrected file enumeration, and removal or shipment of the referenced doctor script.
- The valid skill priorities are the README and advisor-denylist correction plus links to the feature catalog and manual testing playbook.
- Architecture conclusions are grounded in the shipped Phase 030 tree in this worktree.

- Investigate concrete, ranked improvements to the shipped communication projection and the sk-communication skill across four axes: operator UX, documentation, package architecture (localProvider loader), and the skill itself, grounded in the current shipped state.
- Investigate concrete, ranked improvements to the shipped communication projection and the sk-communication skill across four axes. (1) OPERATOR UX: making enablement, local-provider config, and activation simpler and more discoverable. (2) DOCUMENTATION: completeness, structure, onboarding, discoverability. (3) PACKAGE ARCHITECTURE: the localProvider loader (src/config/local-provider.ts), the provider/transport/judge design, extensibility, and the two-entry-point plugin plus wrapper wiring. (4) THE SK-COMMUNICATION SKILL itself: its SKILL.md structure, routing and logic, and how it guides a user. Ground every recommendation in the current shipped state (phase 030 localProvider loader, the OpenCode plugin and bin/cli-output-wrapper.mjs, the package docs/, and the skill SKILL.md plus references plus feature-catalog). Deliver a ranked list of improvement recommendations with rationale and rough effort.

### Research Context

Deep-research is complete for this topic. `research/research.md` is the canonical
deliverable and is grounded in the current shipped Phase 030 tree. This worktree
ships `src/config/local-provider.ts`. The canonical run corrected the earlier
loader-absent and entry-point no-op claims.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Generated findings (deep-research, 5 iterations, cli-opencode / opencode-go/deepseek-v4-flash).** Canonical source: `research/research.md`. The run used convergence threshold 0.05, stopped at `maxIterationsReached`, and produced 33 findings grounded in the Phase 030 tree.

Top-ranked improvements (rank / proposal / effort):
1. R-A: Fix fresh-checkout `dist/` breakage with a build hook and document the build step (M)
2. R-B: Make the loader consumable outside the monorepo and ship the example (M)
3. R-C: Ship the wrapper through a `bin` field and `files` include (M)
4. R-D: Re-run the advisor-routing smoke on the native surface with the expectation inverted (S)
5. R-E: Route the `src/config/` surface in SKILL.md routing and `references/package-map.md` (L-M)

Headline findings: the Phase 030 `localProvider` loader, the plugin, and `bin/cli-output-wrapper.mjs` are real and wired. A built `dist/` is the single load prerequisite for both entry points and is absent on fresh checkouts. The packed artifact excludes the wrapper, the example, and operator files. The config surface is invisible to the skill router, and 21 catalog and playbook assets are not surfaced. Full evidence and all 33 findings live in `research/research.md`.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
- **Grounding Phase**: Phase 030 shipped local-provider implementation
