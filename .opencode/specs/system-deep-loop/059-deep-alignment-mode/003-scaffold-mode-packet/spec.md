---
title: "Feature Specification: Phase 3: scaffold-mode-packet"
description: "Plan the deep-alignment mode-packet skeleton — thin-contract SKILL.md, mode-registry.json entry, hub-router touchpoints, prompt-pack reuse, directory skeleton, and changelog — so a later implementation pass has zero open design questions."
trigger_phrases:
  - "deep-alignment scaffold"
  - "alignment mode packet skeleton"
  - "deep-alignment SKILL.md plan"
  - "alignment mode-registry entry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/003-scaffold-mode-packet"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored scaffold plan for deep-alignment packet skeleton"
    next_safe_action: "Await 002 gate approval before any execution"
    blockers:
      - "002-architecture-decision not yet approved"
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/skills/system-deep-loop/hub-router.json"
      - ".opencode/skills/system-deep-loop/deep-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-mode-packet"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact runtimeLoopType/backendKind values for the mode-registry entry (follow the reuse-boundary resolution, open ADR-010, owned by phase 008)"
      - "Whether deep-alignment gets its own scripts/ dir or fully reuses runtime/scripts/*.cjs (open ADR-010, resolved by phase 008)"
    answered_questions: []
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: scaffold-mode-packet

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-11 |
| **Branch** | `deep-alignment/003-scaffold-mode-packet` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | 002-architecture-decision |
| **Successor** | 004-scoping-and-discovery |
| **Handoff Criteria** | A future implementation pass can create the `deep-alignment` mode-packet skeleton (SKILL.md, mode-registry.json entry, hub-router touchpoints, directory skeleton, changelog) from this plan alone, with no additional design decisions beyond what 002-architecture-decision already locked. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the `deep-alignment` deep-loop mode specification (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/`).

**Scope Boundary**: planning only. This phase produces the design for the mode-packet skeleton; it does not create `.opencode/skills/system-deep-loop/deep-alignment/`, does not edit the live `.opencode/skills/system-deep-loop/mode-registry.json` or `hub-router.json`, and does not write any SKILL.md, script, or command file.

**Dependencies**:
- Phase 002 must lock the new-mode-packet decision, the pluggable adapter contract, the alignment contract, and the state machine before this scaffold plan can be executed for real.
- The existing `deep-review` mode packet (`.opencode/skills/system-deep-loop/deep-review/`) is the structural precedent this scaffold models directly, because deep-alignment is designed as a peer mode-packet under `system-deep-loop` that maximally reuses the review/runtime engine.
- The runtime engine (`.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `upsert.cjs`) and the prompt-pack renderer (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts`) are reused, not rebuilt.

**Deliverables**:
- A specified shape for the future `deep-alignment/SKILL.md` thin mode contract.
- A specified shape for the future `mode-registry.json` "alignment" mode entry.
- A specified list of `hub-router.json` touchpoints needed to route alignment-intent requests.
- A specified reuse plan for the prompt-pack iteration template.
- A specified directory skeleton and changelog entry plan.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No scaffold plan exists yet for the `deep-alignment` mode-packet skeleton. Before the scoping/discovery engine (phase 004) or the sk-doc reference adapter (phase 005) can be built, someone has to specify the thin-contract SKILL.md shape, the mode-registry.json entry, the hub-router.json touchpoints, the prompt-pack reuse plan, the directory skeleton, and the changelog entry — grounded in the real deep-review precedent, not invented from scratch.

### Purpose
Produce a build-ready scaffold plan so a later implementation pass can create the `deep-alignment` mode-packet skeleton with zero open design questions beyond what 002-architecture-decision already resolved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Plan the future `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` thin-contract shape, modeled on `.opencode/skills/system-deep-loop/deep-review/SKILL.md:1-6` (frontmatter: name/description/allowed-tools/argument-hint/version) and its "FORBIDDEN INVOCATION PATTERNS" section discipline.
- Plan the future `.opencode/skills/system-deep-loop/mode-registry.json` new mode entry (`workflowMode: "alignment"`), modeled on the existing `"review"` mode entry at `.opencode/skills/system-deep-loop/mode-registry.json:55-73`.
- Plan the future `.opencode/skills/system-deep-loop/hub-router.json` touchpoints: a new `routerSignals.alignment` block (modeled on `.opencode/skills/system-deep-loop/hub-router.json:20-24`) and a `tieBreak` array insertion (modeled on `.opencode/skills/system-deep-loop/hub-router.json:7`).
- Plan reuse of the existing prompt-pack iteration template (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts`) for alignment iterations, including where lane-specific (authority/artifact-class) prompt sections attach.
- Plan the future directory skeleton for `deep-alignment/`, modeled on the real `.opencode/skills/system-deep-loop/deep-review/` tree (`assets/`, `references/`, `changelog/`, `behavior_benchmark/`).
- Plan the future `deep-alignment/changelog/v1.0.0.0.md` entry, matching the plain-H2, no-TOC convention already used at `.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md:1-10`.

### Out of Scope
- Actually creating `.opencode/skills/system-deep-loop/deep-alignment/` or any file inside it — a future implementation pass owns that.
- Editing the live `.opencode/skills/system-deep-loop/mode-registry.json` or `.opencode/skills/system-deep-loop/hub-router.json` — those edits belong to the future implementation pass, gated behind 002 approval.
- Resolving the exact reuse boundary between deep-alignment and the deep-review runtime (shared scripts vs forked) — carried as an open question into 002-architecture-decision; this phase only plans around whatever 002 decides.
- Any per-authority adapter implementation (`discover`/`standardSource`/`check`) — phases 005 (sk-doc), 006 (sk-git/sk-design), and 007 (sk-code) own those.
- The scoping question, lane resolution, or non-interactive arg form — phase 004 owns those.
- Command/agent/advisor cutover (`/deep:alignment`, `@deep-alignment`) — phase 009 owns that.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Create (future) | Thin mode contract, deferred to the implementation pass this phase plans for |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Modify (future) | Add the `"alignment"` mode entry, deferred to the implementation pass |
| `.opencode/skills/system-deep-loop/hub-router.json` | Modify (future) | Add `routerSignals.alignment` and extend `tieBreak`, deferred to the implementation pass |
| `.opencode/skills/system-deep-loop/deep-alignment/assets/`, `references/`, `changelog/` | Create (future) | Directory skeleton, deferred to the implementation pass |
| `.opencode/skills/system-deep-loop/deep-alignment/changelog/v1.0.0.0.md` | Create (future) | Initial changelog entry, deferred to the implementation pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The future SKILL.md contract plan enumerates every frontmatter field and structural section deep-review's real SKILL.md carries. | `plan.md` §3 lists `name`, `description`, `allowed-tools`, `argument-hint`, `version` frontmatter fields and the "WHEN TO USE" / "FORBIDDEN INVOCATION PATTERNS" sections, each mapped against `.opencode/skills/system-deep-loop/deep-review/SKILL.md`. |
| REQ-002 | The future mode-registry.json entry plan captures every required per-mode field from the registry's own discriminator contract. | `plan.md` §3 lists `workflowMode`, `runtimeLoopType`, `backendKind`, `packetKind`, `toolSurface`, `packet`, `command`, `agent`, `artifactRoot`, `aliases`, and `advisorRouting`, with `runtimeLoopType`/`backendKind` explicitly marked as following the reuse-boundary resolution (open ADR-010, owned by phase 008) rather than asserted as final. |
| REQ-003 | The directory skeleton plan enumerates every top-level subdirectory phases 004-008 need before they can add content. | `plan.md` §3 lists `assets/`, `references/`, `changelog/`, and states that a `scripts/` directory is deferred pending the reuse-boundary decision (open ADR-010, phase 008). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The hub-router.json touchpoint plan names the exact JSON keys a future edit must add. | `plan.md` §3 names `routerSignals.alignment` and the `routerPolicy.tieBreak` array insertion point, citing real line numbers in the current file. |
| REQ-005 | The changelog entry plan follows the plain-H2, no-TOC convention already used by sibling deep-loop changelogs. | `plan.md` §3 cites `.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md` as the shape to follow. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tasks.md`'s Phase 2 task list, if executed by a future implementation pass, is sufficient to create the mode-packet skeleton without further design decisions beyond 002's resolutions.
- **SC-002**: No file under `.opencode/skills/system-deep-loop/deep-alignment/` exists, and `.opencode/skills/system-deep-loop/mode-registry.json` / `hub-router.json` remain unmodified, at the close of this phase.
- **SC-003**: Every open design item (reuse boundary, exact registry field values, scripts/ directory question) is explicitly flagged as pending its owning decision (the 002 gate approval, or open ADR-010 owned by phase 008) rather than asserted as decided.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002-architecture-decision not yet approved | Mode-registry field values (`runtimeLoopType`, `backendKind`) cannot be finalized | Plan both as TBD defaulting to reuse; cite the reuse-boundary open question (ADR-010, phase 008) explicitly |
| Dependency | `runtime/scripts/convergence.cjs` validates `runtimeLoopType` against exactly `research\|review\|council` (per `.opencode/skills/system-deep-loop/mode-registry.json:5`) | A brand-new `"alignment"` enum value would require a convergence.cjs change, which is out of scope for a thin-specialization mode | Default plan reuses `runtimeLoopType: "review"`, consistent with the "maximally reuse the review/runtime engine" design decision |
| Risk | Scaffold drifts from deep-review's real shape, making later adapters harder to write | Adapter phases (005-007) inherit design debt | Model every planned artifact directly on deep-review's real files, cited by path |
| Risk | Planning phase accidentally creates live files | Violates the scaffold-only mandate for this phase | Restrict this phase strictly to `.opencode/specs/system-deep-loop/059-deep-alignment-mode/003-scaffold-mode-packet/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact `runtimeLoopType`/`backendKind` values for the mode-registry entry — follow the reuse-boundary resolution recorded as open ADR-010 in 002-architecture-decision and owned by phase 008; the plan's default is reuse (`runtimeLoopType: "review"`).
- Whether `deep-alignment` gets its own `scripts/` directory or fully reuses `runtime/scripts/*.cjs` — recorded as open ADR-010 in 002-architecture-decision; resolved by 008-iterate-converge-report.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
