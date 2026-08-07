---
title: "Verification Checklist: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)"
description: "Verification checklist for the planned router+assets refactor of all five /design:* commands and packet validation."
trigger_phrases:
  - "phase 013 checklist"
  - "design command router split checklist"
  - "design asset refactor verification"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor"
    last_updated_at: "2026-07-06T10:00:05.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all Phase 013 checklist rows with fresh evidence from live command files"
    next_safe_action: "Reuse this checklist once Phases 006-012 settle and implementation is approved"
---
# Verification Checklist: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim phase implementation complete until verified |
| **[P1]** | Required | Must complete or receive explicit approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` with a behavior-preserving, router+assets refactor scope and no new public `/design:*` command [EVIDENCE: `spec.md` § 4 REQ-001..REQ-011; § 3 Out of Scope list.]
  - **Evidence**: `spec.md` § 4 Requirements lists REQ-001 through REQ-011 in full; § 3 Scope's Out of Scope list explicitly excludes adding a sixth mode/command and any `.opencode/commands/design/**` edit in this phase.
- [x] CHK-002 [P0] Technical approach defined in `plan.md` with router/workflow-YAML/presentation-asset ownership boundaries [EVIDENCE: `plan.md` § 3 Architecture Key Components and Content-Inventory Mapping table.]
  - **Evidence**: `plan.md` § 3 Architecture names the four Key Components (thin router, `_auto.yaml`, `_confirm.yaml`, presentation asset) and includes an 11-row Content-Inventory Mapping table tracing every current command section to a planned destination asset.
- [x] CHK-003 [P0] Decision record documents the interview-question design and the auto-vs-confirm default behavior [EVIDENCE: `decision-record.md` ADR-001, ADR-002.]
  - **Evidence**: `decision-record.md` contains ADR-001 (Interview-Question Design) and ADR-002 (Auto vs Confirm Default Behavior), each with Context, Decision, Alternatives Considered, Consequences, a 5/5-PASS Five Checks Evaluation, and an Implementation/rollback note.
- [x] CHK-004 [P1] Dependency on Phases 006-012 being settled is understood and stated before implementation starts [EVIDENCE: `plan.md` § 6 Dependencies and the `spec.md` Phase Navigation forward-reference note.]
  - **Evidence**: `plan.md` § 6 Dependencies names "Phases 006-012 of this parent packet" as "Not yet authored at time of this plan" and states the impact if blocked; `spec.md` Phase Navigation carries an explicit forward-reference note explaining the predecessor-phase link.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The planned router section order matches `Router Contract`, `Owned Assets`, `Mode Routing`, `Execution Targets`, `Presentation Boundary`, `Workflow Summary` for all five modes [EVIDENCE: `spec.md` REQ-001 names the exact six sections; `plan.md` § 4 Phase 2 cites the `speckit/plan.md` reference shape.]
  - **Evidence**: `spec.md` REQ-001's Acceptance Criteria names the six sections verbatim and in order; `plan.md` § 4 Implementation Phases, Phase 2 requires drafting "the thin-router section skeleton per mode, matching `.opencode/commands/speckit/plan.md`'s section order," and both `.opencode/commands/speckit/plan.md` and `assets/speckit_plan_presentation.txt` exist on disk as the cited reference shape.
- [x] CHK-011 [P0] Every current task lane, sibling discriminator, precondition, register dial, choreography step, deliverable field, and handoff grammar line maps to exactly one planned destination asset [EVIDENCE: `plan.md` § 3 Architecture Content-Inventory Mapping table, cross-checked against all five current command files.]
  - **Evidence**: Direct `grep` of section headers across `interface.md`, `foundations.md`, `motion.md`, `audit.md`, `md-generator.md` confirms every section named in the Content-Inventory Mapping table (`USER INTENT`, `INTERNAL BINDING`, task-lane/sibling-discriminator section, `PRECONDITIONS`, `REGISTER`, `INSTRUCTIONS`, `CHOREOGRAPHY`, `EMIT DELIVERABLE`, `PIPELINE & HANDOFF`, `HANDOFF GRAMMAR`, `EXAMPLE`, `TASK PROJECTIONS`) exists verbatim in all five live command files, with no gap.
- [x] CHK-012 [P0] The plan keeps `mode-registry.json`'s five `workflowMode` values and the five public `/design:*` commands unchanged [EVIDENCE: `spec.md` Out of Scope and REQ-007.]
  - **Evidence**: Live `mode-registry.json` read via script confirms exactly 5 modes (`interface`, `foundations`, `motion`, `audit`, `md-generator`); `spec.md` REQ-007 and the Out of Scope list both state no new mode/command is added, and Phase 013 made no edit to `mode-registry.json`.
- [x] CHK-013 [P1] The plan names one uniform default execution-mode rule (no suffix -> auto or confirm) with any per-mode exception justified [EVIDENCE: `decision-record.md` ADR-002.]
  - **Evidence**: ADR-002's Decision states one shared, argument-completeness-based resolution rule applied identically across all five modes, with no per-mode exception; the rejected "per-mode independent default" alternative is scored 5/10 specifically because it would create undocumented inconsistency.
- [x] CHK-014 [P1] `md-generator`'s wider tool surface (`Write`, `Edit`, `Bash`) and the other four modes' read-only surface are named exactly in the plan [EVIDENCE: `spec.md` REQ-009 and `tasks.md` T016.]
  - **Evidence**: Live `grep` of frontmatter across the five command files confirms `interface.md`/`foundations.md`/`motion.md`/`audit.md` declare `allowed-tools: Read, Glob, Grep` and `md-generator.md` declares `Read, Write, Edit, Bash, Glob, Grep`, matching `spec.md` REQ-009's claim exactly.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] A no-drift verification method (structural diff / content-inventory comparison) is defined for the later implementation pass [EVIDENCE: `plan.md` § 5 Testing Strategy and `spec.md` REQ-011.]
  - **Evidence**: `plan.md` § 5 Testing Strategy names "Content-inventory review" and "Structural-diff review" as implementation-phase test types with defined tools (manual reviewer pass against § 3's mapping table; side-by-side comparison of each command file against its planned router + 3 assets); `spec.md` REQ-011 requires this.
- [x] CHK-021 [P0] The plan states how a fully-specified invocation with no suffix behaves (autonomous vs. one-time consolidated prompt) [EVIDENCE: `spec.md` § 8 Edge Cases, Data Boundaries.]
  - **Evidence**: `spec.md` § 8 Edge Cases, Data Boundaries' first bullet states the no-suffix, fully-specified case explicitly; ADR-002 resolves it as "proceeds autonomously without a prompt, exactly as it does today."
- [x] CHK-022 [P1] The plan states how `:auto` behaves when a required input is missing (Auto Fail-Fast Display, not a silent no-op) [EVIDENCE: `spec.md` § 8 Edge Cases and `plan.md` § 3 Architecture Data Flow.]
  - **Evidence**: `spec.md` § 8 Edge Cases second bullet names the Auto Fail-Fast Display routing explicitly; ADR-002's Decision states explicit `:auto` "always... uses the Auto Fail-Fast Display when a required input still cannot be resolved."
- [x] CHK-023 [P1] The plan states how STATUS field ownership is kept single-sourced between the presentation asset (display) and the workflow YAML (execution) [EVIDENCE: `plan.md` § 3 Architecture Key Components.]
  - **Evidence**: `plan.md` § 3 Architecture Key Components states the presentation asset "owns... the STATUS result templates" while the workflow YAML "owns the steps that... return a STATUS line," and the Data Flow paragraph states no display wording is defined inside the workflow YAML.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Each of the five modes has a planned thin router entry in `spec.md`'s Files to Change table [EVIDENCE: `spec.md` § 3 Scope, Files to Change.]
  - **Evidence**: `spec.md` § 3 Scope, Files to Change table lists a "Refactor (planned)" row for each of `interface.md`, `foundations.md`, `motion.md`, `audit.md`, `md-generator.md`.
- [x] CHK-031 [P0] Each of the five modes has a planned `_auto.yaml`, `_confirm.yaml`, and `_presentation.txt` entry [EVIDENCE: `spec.md` § 3 Scope, Files to Change (15 planned asset files total).]
  - **Evidence**: `spec.md` Files to Change table's three per-mode asset rows are each annotated "(one per mode: `interface`, `foundations`, `motion`, `audit`, `md-generator`)", totaling the 15 planned asset files named in SC-001.
- [x] CHK-032 [P1] Task lanes specific to `interface` (`direction`/`directions`/`redesign`/`preflight`/`handoff`/`aesthetic`) are named explicitly as content to preserve [EVIDENCE: `spec.md` REQ-004 and `plan.md` § 3 Architecture Content-Inventory Mapping.]
  - **Evidence**: Live `interface.md` § 3 "INTERFACE TASK LANES" names exactly `direction` (default), `directions`, `redesign`, `preflight`, `handoff`, `aesthetic`; `spec.md` REQ-004 cites this same lane set by name.
- [x] CHK-033 [P1] TASK PROJECTIONS advisory verbs and each mode's negative corpus are mapped to a destination asset without becoming new commands [EVIDENCE: `spec.md` REQ-008 and `tasks.md` T017.]
  - **Evidence**: `spec.md` REQ-008 names `interface`'s (`bolder`/`quieter`/`distill`/`delight`), `foundations`'s (`typeset`/`colorize`), and `audit`'s (`harden`/`polish`) advisory verbs and reaffirms the existing negative corpus; live `interface.md` § "TASK PROJECTIONS" confirms this verb set and its own negative-corpus sentence verbatim.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No planning artifact embeds secrets, credentials, or environment-specific paths beyond existing repository-relative references [EVIDENCE: manual review of all authored docs in this phase.]
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` were read in full; all paths cited are repository-relative (`.opencode/commands/design/**`, `.opencode/skills/sk-design/**`), and no secret or credential value appears in any of the five docs.
- [x] CHK-041 [P0] The plan does not widen or narrow any command's `allowed-tools` boundary beyond what is named in `spec.md` REQ-009 [EVIDENCE: `plan.md` § 2 Quality Gates and `tasks.md` T016.]
  - **Evidence**: `plan.md` § 2 Quality Gates Definition of Done and `tasks.md` T016 both require the router plan to name `md-generator`'s exact six-tool surface and the other four modes' three-tool surface unchanged; no plan section proposes widening or narrowing either surface.
- [x] CHK-042 [P1] The plan's `:auto`/`:confirm` addition does not introduce a path where a required input can be silently guessed [EVIDENCE: `spec.md` NFR-R02 and § 8 Edge Cases.]
  - **Evidence**: `spec.md` NFR-R02 states the split "must not introduce a state where a command can silently proceed on a guessed target, axis, component-state, or URL"; § 8 Edge Cases and ADR-002 route every incomplete case to either the consolidated prompt or the Auto Fail-Fast Display, never a silent guess.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` stay synchronized (consistent requirement IDs, task IDs, and check IDs) [EVIDENCE: cross-reference read of all five docs.]
  - **Evidence**: Cross-reference read confirms `spec.md` REQ-001..REQ-011/SC-001..SC-005, `tasks.md` T001..T022, and `checklist.md` CHK-001..CHK-142 cite each other consistently with no orphaned or dangling ID.
- [x] CHK-051 [P0] `description.json` and `graph-metadata.json` exist in the Phase 013 root [EVIDENCE: both files present at `.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/`, generated by `generate-context.js`.]
  - **Evidence**: `ls` confirms both `description.json` and `graph-metadata.json` are present at the phase root; both were regenerated by the scoped metadata scripts as the final step of this verification pass.
- [x] CHK-052 [P1] Status is recorded as "Planned / Not Started" everywhere in this packet; no doc claims implementation occurred [EVIDENCE: `spec.md` § 1 Metadata Status field and consistency across `plan.md`/`tasks.md`/`checklist.md`.]
  - **Evidence**: `spec.md` § 1 Metadata Status field still reads "Planned / Not Started" (unchanged by this verification pass, by design); `decision-record.md` ADR statuses read "Accepted (planning-only; router+assets refactor not yet implemented)"; no doc in this packet claims the `.opencode/commands/design/**` router+assets refactor was implemented.
- [x] CHK-053 [P1] No standard spec artifact includes a Table of Contents section [EVIDENCE: `validate.sh --strict` `TOC_POLICY` check.]
  - **Evidence**: `validate.sh --strict` output for this phase folder returned `+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Packet authoring writes only inside `.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/` [EVIDENCE: `git status --short -- .opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor`.]
  - **Evidence**: Scoped `git status --short` for this phase folder shows only this phase's own files (as part of the broader untracked `009-sk-design-claude-parity/` packet tree); no write lands outside it.
- [x] CHK-061 [P0] No `.opencode/commands/design/**`, `.opencode/skills/sk-design/**`, or `.opencode/skills/sk-doc/**` file is edited during packet authoring [EVIDENCE: `git status --short -- .opencode/commands/design .opencode/skills/sk-design .opencode/skills/sk-doc` returns no output attributable to this phase.]
  - **Evidence**: Scoped `git status --short` shows zero changed paths under `.opencode/commands/design`; the modified files under `.opencode/skills/sk-design` are pre-existing changes from Phases 001-006 of this same packet (dated before this phase's authoring pass), not from Phase 013.
- [x] CHK-062 [P1] No stray or scratch artifacts remain under the changed paths [EVIDENCE: `git status --short` review before claiming any completion.]
  - **Evidence**: Directory listing of this phase folder contains only the eight expected files (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`); no scratch file present.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-06 — verification pass against the packet's own planning content, cross-checked against the five live `.opencode/commands/design/*.md` files and `mode-registry.json`.
**Verified By**: claude-sonnet-5.
**Gate Status**: CLOSED for this planning phase's own deliverable. All P0/P1 items above are verified with fresh evidence against real files. This closes ONLY the Phase 013 planning packet; the described `/design:*` router+assets refactor itself remains unimplemented and gated on Phases 006-012 settling plus a separate operator-approved implementation pass (see `spec.md` Out of Scope and `decision-record.md` Implementation notes).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision is documented in `decision-record.md` [EVIDENCE: ADR-001, ADR-002.]
  - **Evidence**: Both ADRs present with full Context/Decision/Alternatives/Consequences/Five Checks/Implementation sections.
- [x] CHK-101 [P1] Alternatives include a single monolithic router, always-confirm, always-auto, and per-mode-split default options [EVIDENCE: `decision-record.md` Alternatives Considered tables.]
  - **Evidence**: ADR-001's Alternatives table includes "richer invented interview," "no consolidation," and "one universal prompt"; ADR-002's Alternatives table includes "always `:confirm`," "always `:auto`," and "per-mode independent default" — covering the required alternative shapes.
- [x] CHK-102 [P1] Rejection rationale is documented for any alternative that reintroduces mixed routing/presentation content [EVIDENCE: `decision-record.md` Alternatives table Cons column.]
  - **Evidence**: Each rejected alternative's Cons column names a concrete behavior-preservation or consistency cost (e.g., "breaks today's zero-prompt behavior," "creates five independently-reasoned defaults").
- [ ] CHK-103 [P2] Migration path is documented if an existing design-command asset surface already exists. Deferred: no `.opencode/commands/design/assets/` directory predates this phase, so there is nothing to migrate from.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] The plan avoids requiring all three owned assets to load before mode resolution [EVIDENCE: `spec.md` NFR-P01 and `plan.md` § 3 Architecture Data Flow.]
  - **Evidence**: `plan.md` § 3 Architecture Data Flow states "No workflow step is defined inside the router... only the selected workflow YAML and the presentation asset are read per invocation" (per NFR-P01).
- [x] CHK-111 [P1] The `:auto` path resolves setup from `$ARGUMENTS` and documented defaults before any targeted ask [EVIDENCE: `spec.md` NFR-P02 and the per-mode Auto Resolution Table plan in `tasks.md` T010.]
  - **Evidence**: `spec.md` NFR-P02 and `tasks.md` T010 both require the auto-resolution table naming Tier 2 targeted-ask fields, consistent with ADR-002's completeness-first resolution rule.
- [ ] CHK-112 [P2] Performance benchmark is documented if a runtime asset-loading mechanism is added. Deferred: this phase is documentation-only; no runtime loading mechanism is implemented, so there is no runtime path to benchmark yet.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure is documented in `plan.md` [EVIDENCE: `plan.md` § 7 Rollback Plan and Enhanced Rollback.]
  - **Evidence**: `plan.md` § 7 Rollback Plan and the L2 Enhanced Rollback section both define trigger, procedure, pre-deployment checklist, and data-reversal notes.
- [x] CHK-121 [P0] Implementation boundary is confirmed before any future router/asset write [EVIDENCE: `plan.md` § 2 Quality Gates Definition of Ready and Pre-deployment Checklist.]
  - **Evidence**: `plan.md` § 2 Quality Gates Definition of Ready and the Enhanced Rollback Pre-deployment Checklist both restate the `.opencode/commands/design/**`-only implementation boundary.
- [x] CHK-122 [P1] Handoff notes identify the remaining implementation work and its gating dependency [EVIDENCE: `spec.md` and this checklist's continuity frontmatter both point to Phases 006-012 settling as the implementation gate.]
  - **Evidence**: `spec.md` Phase Navigation and Risks & Dependencies, plus this checklist's `_memory.continuity.next_safe_action`, all name Phases 006-012 settling plus operator approval as the gate before implementation begins.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] The plan conforms to `sk-doc`'s `command_template.md` § "Presentation / Router Split (Command Families)" contract [EVIDENCE: `plan.md` § 1 Summary Technical Context and § 3 Architecture.]
  - **Evidence**: `plan.md` § 1 Summary Technical Context cites the exact contract name; § 3 Architecture's Pattern and Key Components mirror that contract's router+assets shape.
- [x] CHK-131 [P1] The plan's section order and Auto Resolution Table shape are traceable to `.opencode/commands/speckit/plan.md` + `speckit_plan_presentation.txt` [EVIDENCE: `tasks.md` T003 and `plan.md` § 6 Dependencies.]
  - **Evidence**: Both reference files exist on disk (`.opencode/commands/speckit/plan.md`, `.opencode/commands/speckit/assets/speckit_plan_presentation.txt`); `tasks.md` T003 and `plan.md` § 6 Dependencies both cite them as the concrete reference shape.
- [x] CHK-132 [P1] No planning artifact copies long-form content verbatim from an unrelated command family without adapting it to the `/design:*` domain [EVIDENCE: manual reviewer pass comparing drafted section language against the design-specific content-inventory mapping.]
  - **Evidence**: `plan.md`'s Content-Inventory Mapping and `decision-record.md`'s ADRs reference `/design:*`-specific sections, dials, and lanes (e.g., register posture, task lanes, `md-generator`'s tool surface) rather than reusing `speckit`-domain language verbatim.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents remain synchronized after authoring [EVIDENCE: strict validation returns `Errors: 0` (warnings limited to the accepted `CONTINUITY_FRESHNESS` uncommitted-changes case).]
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-root> --strict` returned `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` (exit code 0), both before and after this verification pass's edits.
- [x] CHK-141 [P1] Metadata remains discoverable through `description.json` and `graph-metadata.json` [EVIDENCE: both files exist and were generated after the final content edit pass.]
  - **Evidence**: `description.json` and `graph-metadata.json` were regenerated via the scoped metadata scripts as the last step of this pass, after all content edits above.
- [ ] CHK-142 [P2] Knowledge transfer notes are added if this plan changes maintainer workflow beyond the `/design:*` command family. Deferred: no maintainer-facing workflow beyond this packet's own docs and the later `/design:*` implementation is affected.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Pending | - |
| Implementer | Phase owner | Pending; planning only in this phase | - |
| Reviewer | Behavior-preservation reviewer | Pending; required before implementation begins | - |

**Note**: This verification pass (claude-sonnet-5, 2026-07-06) closes the AI-verifiable evidence rows above (CHK-001 through CHK-141 excluding documented P2 deferrals). It does not substitute for the human `User`/`Reviewer` sign-off named here, which remains a precondition for starting the actual `/design:*` implementation pass.
<!-- /ANCHOR:sign-off -->
