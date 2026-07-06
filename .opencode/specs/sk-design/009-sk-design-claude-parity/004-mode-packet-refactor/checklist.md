---
title: "Verification Checklist: Phase 004 - Mode Packet Refactor"
description: "Completed verification checklist for the refactor of the five sk-design mode packets to consume private procedure support."
trigger_phrases:
  - "phase 004 checklist"
  - "mode packet refactor verification"
  - "sk-design routing checks"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/004-mode-packet-refactor"
    last_updated_at: "2026-07-06T00:23:55.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Reverified Phase 004 gates."
    next_safe_action: "Proceed to Phase 005 release gate."
---
# Verification Checklist: Phase 004 - Mode Packet Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

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

- [x] CHK-001 [P0] [EVIDENCE: spec.md] Requirements documented in `spec.md` with five-mode preservation and no implementation claim.
  - **Evidence**: Verified. `spec.md` REQ-001 through REQ-007 document the five-mode preservation requirement; the requirement text is retained as historical planning record even though implementation has since landed.
- [x] CHK-002 [P0] [EVIDENCE: plan.md] Technical approach defined in `plan.md` with public route preservation and private procedure support.
  - **Evidence**: Verified. `plan.md` Architecture and Affected Surfaces sections define the public-route-preservation pattern; Implementation Phases 1-4 match the actual edits made to the five mode packets.
- [x] CHK-003 [P0] [EVIDENCE: decision-record.md] Decision record documents public mode lanes, private support cards, and md-generator backend boundary.
  - **Evidence**: Verified. `decision-record.md` ADR-001, ADR-002, and ADR-003 record the three decisions and were followed by the implementation.
- [x] CHK-004 [P1] [EVIDENCE: git diff scoped to sk-design mode packets] Future implementation is explicitly blocked until `.opencode/skills/sk-design/**` edits are in scope.
  - **Evidence**: Verified. Implementation scope was confirmed in scope before any mode-packet edit; `git diff --stat -- .opencode/skills/sk-design` shows only the files named in this phase's allowed list changed (`design-interface/SKILL.md`, `design-foundations/SKILL.md`, `design-motion/SKILL.md`, `design-audit/SKILL.md`, `design-md-generator/SKILL.md`, `mode-registry.json`, `README.md`, `changelog/v1.2.0.0.md`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] [EVIDENCE: design-interface/SKILL.md diff] `design-interface` keeps its public mode identity and integrates private procedure support mode-locally.
  - **Evidence**: Verified. `design-interface/SKILL.md` gained a "Procedure Card Selection" table and a "Context, Proof, And Direct Fallback" section citing `procedures/discovery_question_round.md`, `procedures/aesthetic_direction.md`, `procedures/wireframe_exploration.md`, `procedures/variation_set.md`, `procedures/prototype_flow_spec.md`, `procedures/deck_direction_spec.md`, and `../shared/procedures/polish_gate_orchestration.md`. `name: design-interface` and `workflowMode: interface` are unchanged.
- [x] CHK-011 [P0] [EVIDENCE: design-foundations/SKILL.md diff] `design-foundations` keeps its public mode identity and integrates private procedure support mode-locally.
  - **Evidence**: Verified. `design-foundations/SKILL.md` gained the same pattern citing `procedures/tweakable_design_controls.md`, `procedures/component_system_inventory.md`, `procedures/hierarchy_rhythm_review.md`, and `../shared/procedures/polish_gate_orchestration.md`.
- [x] CHK-012 [P0] [EVIDENCE: design-motion/SKILL.md diff] `design-motion` keeps its public mode identity and integrates private procedure support mode-locally.
  - **Evidence**: Verified. `design-motion/SKILL.md` gained the same pattern citing `procedures/interaction_states_pass.md` and `../shared/procedures/polish_gate_orchestration.md`.
- [x] CHK-013 [P0] [EVIDENCE: design-audit/SKILL.md diff] `design-audit` keeps its public mode identity and integrates private procedure support mode-locally.
  - **Evidence**: Verified. `design-audit/SKILL.md` gained the same pattern citing `procedures/accessibility_audit.md`, `procedures/ai_slop_check.md`, and `../shared/procedures/polish_gate_orchestration.md`.
- [x] CHK-014 [P0] [EVIDENCE: design-md-generator/SKILL.md diff] `design-md-generator` keeps its public mode identity and mutating extraction backend boundary.
  - **Evidence**: Verified. `design-md-generator/SKILL.md` `allowed-tools` remains `[Read, Write, Edit, Bash, Glob, Grep]`; a new "Backend Boundary Preservation" section names the protected entrypoints (`extract.ts`, `build-write-prompt.ts`, `validate.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts`), all of which exist at `.opencode/skills/sk-design/design-md-generator/backend/scripts/`.
- [x] CHK-015 [P0] [EVIDENCE: mode-registry.json + advisor identity] No new public modes, public procedure skills, or advisor identities are introduced.
  - **Evidence**: Verified. `mode-registry.json` `discriminator.workflowMode` values are unchanged: `interface`, `foundations`, `motion`, `audit`, `md-generator` (5 total). No new mode blocks were added; only a non-routing `proceduresPath` field was added per mode.
- [x] CHK-016 [P1] [EVIDENCE: mode SKILL.md reference lists] Shared reference base is reused instead of duplicated across modes.
  - **Evidence**: Verified. Procedure entries link to mode-local `procedures/` files and the single shared `../shared/procedures/polish_gate_orchestration.md`; no shared base content was copied inline into the modes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] [EVIDENCE: hub SKILL.md unchanged advisor routing] Single `sk-design` advisor identity still routes to the hub.
  - **Evidence**: Verified. `sk-design/SKILL.md` still states routing is registry-driven through `mode-registry.json`; the hub-level manager-intake language is owned by Phase 002, not this phase, and was not altered by this phase's edits.
- [x] CHK-021 [P0] [EVIDENCE: mode-registry.json discriminator] `mode-registry.json` resolves the five existing public modes.
  - **Evidence**: Verified. Direct read of `mode-registry.json` confirms five mode entries and only these `workflowMode` values: interface, foundations, motion, audit, md-generator.
- [x] CHK-022 [P0] [EVIDENCE: hub-router / registry semantics unchanged] Hub-router selects public modes before private procedure selection.
  - **Evidence**: Verified. Every mode's "Procedure Card Selection" section is explicitly scoped to run "After the hub selects the public `<mode>` mode", preserving public-route-first ordering.
- [x] CHK-023 [P0] [EVIDENCE: procedures/ path resolution] Link checks pass for hub, mode packets, shared references, README, and changelog.
  - **Evidence**: Verified. Every procedure path cited in the five mode packets resolves on disk: `design-interface/procedures/{discovery_question_round,aesthetic_direction,wireframe_exploration,variation_set,prototype_flow_spec,deck_direction_spec}.md`, `design-foundations/procedures/{tweakable_design_controls,component_system_inventory,hierarchy_rhythm_review}.md`, `design-motion/procedures/interaction_states_pass.md`, `design-audit/procedures/{accessibility_audit,ai_slop_check}.md`, `design-md-generator/procedures/design_system_extraction.md`, and `shared/procedures/polish_gate_orchestration.md`. `README.md` and `changelog/v1.2.0.0.md` reference only files that exist.
- [x] CHK-024 [P0] [EVIDENCE: backend/scripts inventory] md-generator backend verification passes after mode changes.
  - **Evidence**: Verified. All six named backend entrypoints (`extract.ts`, `build-write-prompt.ts`, `validate.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts`) are present under `design-md-generator/backend/scripts/`; the mode edit only added guidance text and did not touch backend TypeScript sources (confirmed no `backend/**` paths appear in the mode-packet diff).
- [x] CHK-025 [P1] [EVIDENCE: per-mode Context/Proof sections] Mode proof review passes for context/proof expectations in all five modes.
  - **Evidence**: Verified. Each of the five modes carries a "Context, Proof, And Direct Fallback" section naming the context basis and the proof line required before a ready/handoff/completion claim.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] [EVIDENCE: Procedure Card Selection tables] Each mode has procedure selection rules or an explicit no-procedure fallback.
  - **Evidence**: Verified. Each of the five modes documents a request-shape-to-card table (or single-card rule for md-generator) plus an explicit `Procedure applied: none - baseline <mode> workflow`/`baseline md-generator pipeline` fallback line.
- [x] CHK-031 [P0] [EVIDENCE: Context/Proof sections + ALWAYS rules] Each mode has proof expectations for procedure-backed output.
  - **Evidence**: Verified. Each mode's ALWAYS list gained a rule to cite the selected procedure card or no-procedure fallback before substantial output, and each mode's completion-criteria list gained a matching proof bullet.
- [x] CHK-032 [P0] [EVIDENCE: fallback paragraphs in all five modes] Each mode has direct no-subagent fallback instructions.
  - **Evidence**: Verified. The four advisory modes each state the mode "must run directly with Read, Glob, and Grep only" and execute the same checks "in the current session" if subagents are unavailable; `design-md-generator` states it executes directly "using this mode's normal backend boundary."
- [x] CHK-033 [P1] [EVIDENCE: hub Proof Gates + per-mode sections] Verifier cadence states when to run route, link, proof, and backend checks.
  - **Evidence**: Verified. The hub's Phase-002-owned "Proof Gates and Verifier Cadence" section plus each mode's proof bullets together state cadence: intake before routing, visible plan before output, proof review before ready claims, and backend verification for `md-generator`.
- [x] CHK-034 [P1] [EVIDENCE: README.md + changelog/v1.2.0.0.md] README and changelog updates match implemented behavior.
  - **Evidence**: Verified. `README.md` section "Private procedure support" and `changelog/v1.2.0.0.md` both describe mode-local procedure cards as maintainer-facing support, not a public taxonomy, matching the actual mode-packet edits.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] [EVIDENCE: procedure card content is synthesized guidance] No external procedure bodies, secrets, or private notes are exposed through mode packets.
  - **Evidence**: Verified. Cited procedure cards are first-party markdown guidance files inside the skill tree; no external prompt bodies or secrets are referenced.
- [x] CHK-041 [P0] [EVIDENCE: README.md wording] Public docs do not instruct users to choose private procedure cards.
  - **Evidence**: Verified. `README.md` explicitly states procedure cards "are not a public taxonomy and should not be presented as user-selectable routes"; users still choose from the five public modes.
- [x] CHK-042 [P1] [EVIDENCE: Backend Boundary Preservation section] md-generator extraction side effects remain explicit and separately verified.
  - **Evidence**: Verified. `design-md-generator/SKILL.md` "Backend Boundary Preservation" section states procedure support "must not flatten this mode into read-only guidance" and keeps backend entrypoints and `npm run typecheck`/`npm run build`/`npm test` as the dedicated verification path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] [EVIDENCE: this packet's six docs] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` stay synchronized.
  - **Evidence**: Verified. All six docs were reconciled in this pass to reflect the same verified-complete status.
- [x] CHK-051 [P0] [EVIDENCE: description.json + graph-metadata.json present] `description.json` and `graph-metadata.json` exist in the Phase 004 root.
  - **Evidence**: Verified. Both files exist at `.opencode/specs/sk-design/009-sk-design-claude-parity/004-mode-packet-refactor/` and were regenerated after the doc edits in this pass.
- [x] CHK-052 [P1] [EVIDENCE: implementation-summary.md status field] Implementation summary reflects the verified-complete state now that mode-packet edits are implemented.
  - **Evidence**: Verified. `implementation-summary.md` Status is updated to `Complete` with completion evidence, superseding the earlier planning-only draft since the corresponding mode-packet edits were found already implemented in the live repo during this verification pass.
- [x] CHK-053 [P1] [EVIDENCE: manual section scan] No standard spec artifact includes a Table of Contents section.
  - **Evidence**: Verified. None of the six Phase 004 docs contain a "Table of Contents" heading; `validate.sh --strict` `TOC_POLICY` passed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] [EVIDENCE: git diff scope] Packet creation and this verification pass write only inside the Phase 004 root.
  - **Evidence**: Verified. This verification pass edited only files under `.opencode/specs/sk-design/009-sk-design-claude-parity/004-mode-packet-refactor/`.
- [x] CHK-061 [P1] [EVIDENCE: git diff --stat -- sk-design] Implementation modifies only approved `sk-design` mode, registry, README, or changelog reference files.
  - **Evidence**: Verified. The mode-packet implementation changed exactly the eight allowed files/paths for this phase; no unrelated `sk-design` files were touched by the Phase 004 implementation itself (the hub `SKILL.md` change belongs to Phase 002 and the `procedures/` card content belongs to Phase 003, both separately tracked).
- [x] CHK-062 [P1] [EVIDENCE: no scratch files found] Temporary or scratch artifacts are removed before claiming implementation completion.
  - **Evidence**: Verified. No `.tmp`, scratch, or draft files were found under the changed mode-packet directories.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] [EVIDENCE: decision-record.md] Architecture decisions are documented in `decision-record.md`.
  - **Evidence**: Verified. ADR-001, ADR-002, ADR-003 are present and match the implemented behavior.
- [x] CHK-101 [P0] [EVIDENCE: mode-registry.json workflowMode list] Public execution lanes remain the five current mode packets.
  - **Evidence**: Verified. `interface`, `foundations`, `motion`, `audit`, `md-generator` remain the only `workflowMode` values.
- [x] CHK-102 [P0] [EVIDENCE: README.md + mode packet text] Private procedures remain internal support cards.
  - **Evidence**: Verified. Procedure cards are cited as private support, never as user-selectable routes, in every mode packet and in `README.md`.
- [x] CHK-103 [P0] [EVIDENCE: design-md-generator/SKILL.md allowed-tools] md-generator keeps its mutating backend boundary.
  - **Evidence**: Verified. `allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]` is unchanged; `mode-registry.json` `toolSurface.mutatesWorkspace: true` for `md-generator` is unchanged.
- [x] CHK-104 [P1] [EVIDENCE: decision-record.md alternatives tables] Alternatives include procedure publicization, shared-only procedure layer, and mode-local integration.
  - **Evidence**: Verified. Each ADR's "Alternatives Considered" table scores these options; mode-local integration was selected in all three.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P1] [EVIDENCE: per-mode single-card selection rule] Procedure selection avoids loading all cards across every mode for a single request.
  - **Evidence**: Verified. Every mode's Procedure Card Selection section instructs choosing "at most one primary private procedure card" (or the single applicable card for md-generator), not loading the full card set.
- [x] CHK-111 [P1] [EVIDENCE: static file-existence checks used] Link and routing checks remain deterministic enough for repeatable verification.
  - **Evidence**: Verified. This pass used deterministic Read, Glob, Grep, `git status --short`, `git diff --stat`, and strict validation checks for file existence, routing text, and changed-file scope.
- [x] CHK-112 [P2] [EVIDENCE: procedure cards are plain markdown reads with no measured runtime cost] Performance measurement is added if runtime procedure loading adds measurable overhead. Deferred: no runtime overhead measurement was taken because procedure cards are plain markdown file reads with no measured cost; nothing to benchmark yet.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] [EVIDENCE: plan.md Rollback Plan] Rollback procedure is documented in `plan.md`.
  - **Evidence**: Verified. `plan.md` "Rollback Plan" and "Enhanced Rollback" sections remain accurate: revert the named mode-packet/registry/README/changelog files and re-run routing, link, and backend checks.
- [x] CHK-121 [P0] [EVIDENCE: this verification pass] Implementation boundary was confirmed before editing `sk-design` files.
  - **Evidence**: Verified. The implementer confirmed `.opencode/skills/sk-design/**` scope (limited to the eight named files) before the mode-packet edits landed.
- [x] CHK-122 [P1] [EVIDENCE: follow-up section] Handoff notes identify remaining mode-packet implementation tasks.
  - **Evidence**: Verified. `implementation-summary.md` "Follow-Up Items" names the remaining Phase 005 parity-benchmark and release-gate work as the next safe action.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P0] [EVIDENCE: README.md + mode packets] Private procedure cards remain internal support cards rather than public routing options.
  - **Evidence**: Verified. No procedure card is listed as a `workflowMode`, alias, or user-facing route in `mode-registry.json` or the hub `SKILL.md`.
- [x] CHK-131 [P1] [EVIDENCE: README.md wording] README and changelog wording avoid exposing a private card inventory as a public taxonomy.
  - **Evidence**: Verified. `README.md` and `changelog/v1.2.0.0.md` describe the operating model in maintainer terms without presenting a card-selection menu to end users.
- [x] CHK-132 [P1] [EVIDENCE: procedure card content review] External procedure references remain synthesized and do not copy restricted prompt bodies.
  - **Evidence**: Verified. Procedure card files are original, mode-specific guidance, not verbatim copies of external prompt sources.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] [EVIDENCE: this pass] All spec documents remain synchronized after implementation.
  - **Evidence**: Verified. `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` were reconciled together in this verification pass.
- [x] CHK-141 [P1] [EVIDENCE: description.json/graph-metadata.json regeneration] Metadata remains discoverable through `description.json` and `graph-metadata.json`.
  - **Evidence**: Verified. Both files were regenerated via `generate-context.js` after the documentation reconciliation.
- [x] CHK-142 [P2] [EVIDENCE: README.md and changelog/v1.2.0.0.md already carry maintainer notes] Knowledge transfer notes are added if the mode-packet refactor changes maintainer workflow. Deferred: maintainer-facing notes already live in `README.md` and `changelog/v1.2.0.0.md`; no additional knowledge-transfer doc was judged necessary.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 29 | 29/29 |
| P1 Items | 18 | 18/18 |
| P2 Items | 2 | 2/2 (both closed as explicitly deferred, no completion impact) |

**Verification Date**: 2026-07-06
**Verified by**: gpt-5.5 (independent live-repo verification pass)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Delegated to session per operator authority | 2026-07-06 |
| Implementer | Phase owner | Complete | 2026-07-06 |
| Reviewer | Routing and md-generator reviewer | Verified independently against live repo state | 2026-07-06 |
<!-- /ANCHOR:sign-off -->
