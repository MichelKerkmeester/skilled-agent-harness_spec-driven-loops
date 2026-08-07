---
title: "Verification Checklist: Phase 003 - Private Procedure Card Layer"
description: "Verification checklist for the implemented private procedure-card layer and packet validation."
trigger_phrases:
  - "phase 003 checklist"
  - "procedure-card verification"
  - "source adaptation review"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/003-private-procedure-card-layer"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Revalidated Phase 003 checklist"
    next_safe_action: "Use checklist for Phase 004 handoff"
---
# Verification Checklist: Phase 003 - Private Procedure Card Layer

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

- [x] CHK-001 [P0] [EVIDENCE: spec.md REQ-001..REQ-010 and the Out of Scope list explicitly reject c...] Requirements documented in `spec.md` with private-card scope and no public fourteen-skill mirror. Evidence: `spec.md` REQ-001..REQ-010 and the Out of Scope list explicitly reject creating fourteen public OpenCode skills.
- [x] CHK-002 [P0] [EVIDENCE: plan.md ARCHITECTURE section names mode-local inventories plus one sha...] Technical approach defined in `plan.md` with mode-local default and shared-procedure exception rules. Evidence: `plan.md` ARCHITECTURE section names mode-local inventories plus one shared orchestration bucket.
- [x] CHK-003 [P0] [EVIDENCE: decision-record.md ADR-001 decision and alternatives table.] Decision record documents private mode-local cards over public external-procedure skills. Evidence: `decision-record.md` ADR-001 decision and alternatives table.
- [x] CHK-004 [P1] [EVIDENCE: plan.md DEPENDENCIES section; Phase 002 is closed per verified groundi...] Dependencies on Phase 002 and external source identifiers are understood before implementation starts. Evidence: `plan.md` DEPENDENCIES section; Phase 002 is closed per verified grounding facts; all 14 files under `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/*.md` were read and cited.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] [EVIDENCE: .opencode/skills/sk-design/shared/procedure_card_schema.md Required Fi...] Procedure-card schema includes purpose, trigger, owning mode, source reference, output contract, proof gate, and privacy rule. Evidence: `.opencode/skills/sk-design/shared/procedure_card_schema.md` Required Fields table lists all seven fields in order.
- [x] CHK-011 [P0] [EVIDENCE: 13 mode-local cards plus 1 shared card = 14 cards; each card's Source...] Every external procedure theme maps to one current mode or a justified shared orchestration card. Evidence: 13 mode-local cards plus 1 shared card = 14 cards; each card's `Source reference` field matches one of the 14 filenames under `external/claude/skills/` (verified by direct comparison, no duplicates or gaps).
- [x] CHK-012 [P0] [EVIDENCE: procedure_card_schema.md Selection Rules #1-2 state the hub picks the...] Routing occurs after the existing public `sk-design` hub and mode selection. Evidence: `procedure_card_schema.md` Selection Rules #1-2 state the hub picks the mode first through `mode-registry.json`, then the mode evaluates its own card inventory.
- [x] CHK-013 [P0] [EVIDENCE: mode-registry.json still declares exactly 5 workflowMode values (inter...] No new public OpenCode skills are created for the fourteen source procedures. Evidence: `mode-registry.json` still declares exactly 5 `workflowMode` values (interface, foundations, motion, audit, md-generator) with unchanged `toolSurface` values; exactly one `graph-metadata.json` exists under `.opencode/skills/sk-design/`.
- [x] CHK-014 [P1] [EVIDENCE: procedure_card_schema.md Selection Rules #3-6 (mode-local exact trigge...] Routing conflict rules define precedence and parent hub fallback. Evidence: `procedure_card_schema.md` Selection Rules #3-6 (mode-local exact trigger beats shared card, narrower output contract wins, no-match fallback to existing `SKILL.md` behavior).
- [x] CHK-015 [P1] [EVIDENCE: shared/procedures/polish_gate_orchestration.md names design-audit as o...] Shared cards have a cross-mode rationale and owner. Evidence: `shared/procedures/polish_gate_orchestration.md` names `design-audit` as owning reviewer and documents a Placement Rationale spanning four modes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] [EVIDENCE: grep "Source reference" across all 14 card files returned one filename...] Every card has a safe source citation or explicit no-source rationale. Evidence: `rg -n '^\| Source reference \|'` across the 14 card files returned exactly one filename-only citation per card.
- [x] CHK-021 [P0] [EVIDENCE: normalized grep comparison found no 15-word source/card overlap.] No card includes long-form copied external prompt text. Evidence: normalized source/card 15-word comparison through `grep -Fxf` returned no matches and printed `no_15_word_verbatim_runs=true`.
- [x] CHK-022 [P0] [EVIDENCE: manual comparison of shared/procedures/polish_gate_orchestration.md ag...] Cards synthesize external procedure intent into OpenCode-native language. Evidence: manual comparison of `shared/procedures/polish_gate_orchestration.md` against source `polish-pass.md` shows a rewritten structure (Purpose/Trigger/Output contract/Proof gate/Procedure) rather than copied phrasing.
- [x] CHK-023 [P1] [EVIDENCE: procedure_card_schema.md Source Adaptation Rules #5 requires comparing...] Reviewer checks compare procedure intent, not exact source wording. Evidence: `procedure_card_schema.md` Source Adaptation Rules #5 requires comparing purpose, trigger, output contract, and proof gate against the source theme.
- [x] CHK-024 [P1] [EVIDENCE: every citation is a bare filename (e.g. polish-pass.md); no card conta...] Source references are sufficient for audit without exposing restricted content. Evidence: every citation is a bare filename (e.g. `polish-pass.md`); no card contains source prose.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] [EVIDENCE: grep "| Output contract |" matched all 14 card files.] Each card declares an output contract. Evidence: `grep "| Output contract |"` matched all 14 card files.
- [x] CHK-031 [P0] [EVIDENCE: grep "| Proof gate |" matched all 14 card files.] Each card declares a proof gate tied to mode behavior. Evidence: `grep "| Proof gate |"` matched all 14 card files.
- [x] CHK-032 [P1] [EVIDENCE: tasks.md T002 maps the 14 cards across discovery, aesthetic direction,...] Procedure categories have evidence expectations for discovery, direction, prototype, extraction, review, and polish themes. Evidence: `tasks.md` T002 maps the 14 cards across discovery, aesthetic direction, wireframe/deck/prototype/variation, extraction, component inventory, accessibility/AI-slop/hierarchy/interaction, and polish orchestration.
- [x] CHK-033 [P1] [EVIDENCE: implementation-summary.md Verification table separates packet-level sp...] Verification evidence distinguishes current packet validation from future card implementation evidence. Evidence: `implementation-summary.md` Verification table separates packet-level spec validation from card-file existence and content checks.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] [EVIDENCE: manual review of all 14 card files found only synthesized guidance, so...] No hardcoded secrets or private external notes appear in cards. Evidence: manual review of all 14 card files found only synthesized guidance, source filenames, and mode-facing procedure text.
- [x] CHK-041 [P0] [EVIDENCE: mode-registry.json and .opencode/skills/sk-design/SKILL.md (Phase 002...] Public `sk-design` docs do not expose the private card inventory as a new skill taxonomy. Evidence: `mode-registry.json` and `.opencode/skills/sk-design/SKILL.md` (Phase 002 scope) surface only the five existing public modes; procedure cards live under private `procedures/` folders that are not registered as public skills or modes.
- [x] CHK-042 [P1] [EVIDENCE: shared/procedures/polish_gate_orchestration.md cites polish-pass.md by...] Shared procedure cards do not leak source text through shared descriptions. Evidence: `shared/procedures/polish_gate_orchestration.md` cites `polish-pass.md` by filename only, with no excerpted source text.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] [EVIDENCE: strict validation returned Errors: 0, Warnings: 0 after synchronized updates.] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` stay synchronized. Evidence: this verification pass updated task, checklist, decision, and implementation-summary evidence, then strict validation returned `Errors: 0, Warnings: 0`.
- [x] CHK-051 [P0] [EVIDENCE: both files are present at .opencode/specs/sk-design/009-sk-design-claude-...] `description.json` and `graph-metadata.json` exist in the Phase 003 root. Evidence: both files are present at `.opencode/specs/sk-design/009-sk-design-claude-parity/003-private-procedure-card-layer/` and were regenerated after this reconciliation.
- [x] CHK-052 [P1] [EVIDENCE: implementation-summary.md records Complete / 100% plus live validation exit code 0.] Implementation summary reflects actual status once procedure cards are implemented. Evidence: `implementation-summary.md` records `Complete / 100%`, the 14-card inventory, live verification checks, and strict validation exit code 0.
- [x] CHK-053 [P1] [EVIDENCE: validate.sh --strict TOC_POLICY check passed with no TOC headings foun...] No standard spec artifact includes a Table of Contents section. Evidence: `validate.sh --strict` `TOC_POLICY` check passed with no TOC headings found.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] [EVIDENCE: scoped git status shows Phase 003 docs plus approved procedure-card paths; mode registry/router/SKILL status check returned no output.] Implementation writes only inside the approved allow-list. Evidence: scoped `git status --short` shows Phase 003 docs plus approved procedure-card paths; a separate `git status --short -- mode-registry.json hub-router.json design-*/SKILL.md` returned no output, and the root `sk-design/SKILL.md` dirty state is the accepted pre-existing Phase 002 change from the user grounding facts.
- [x] CHK-061 [P1] [EVIDENCE: 13 of 14 cards are mode-local; the one shared card documents a four-mo...] Future implementation keeps cards mode-local unless shared orchestration is justified. Evidence: 13 of 14 cards are mode-local; the one shared card documents a four-mode placement rationale.
- [x] CHK-062 [P1] [EVIDENCE: git status --short shows no stray or scratch files under the changed p...] Temporary or scratch artifacts are removed before claiming implementation completion. Evidence: `git status --short` shows no stray or scratch files under the changed paths.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | 19/19 |
| P1 Items | 14 | 14/14 |
| P2 Items | 3 | 3/3 (CHK-103, CHK-112, CHK-142 closed via documented deferral) |

**Verification Date**: 2026-07-06
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] [EVIDENCE: ADR-001.] Architecture decision is documented in `decision-record.md`. Evidence: ADR-001.
- [x] CHK-101 [P1] [EVIDENCE: decision-record.md Alternatives Considered table lists all three plus...] Alternatives include public fourteen-skill mirror, shared global library, and private mode-local cards. Evidence: `decision-record.md` Alternatives Considered table lists all three plus an inline-guidance option.
- [x] CHK-102 [P1] [EVIDENCE: decision-record.md Alternatives table Cons column for "Public fourteen...] Rejection rationale is documented for public taxonomy expansion. Evidence: `decision-record.md` Alternatives table Cons column for "Public fourteen-skill mirror": fragments public taxonomy, exposes implementation details, increases copying risk.
- [x] CHK-103 [P2] [EVIDENCE: no pre-existing private procedure surface predates this phase, so ther...] Migration path is documented if an existing private procedure surface already exists. Deferred: no pre-existing private procedure surface predates this phase, so there is nothing to migrate from.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] [EVIDENCE: procedure_card_schema.md Selection Rule #2 restricts evaluation to the...] Card selection avoids loading all cards for a single mode request. Evidence: `procedure_card_schema.md` Selection Rule #2 restricts evaluation to the selected mode's own `procedures/` folder plus in-scope shared cards.
- [x] CHK-111 [P1] [EVIDENCE: Selection Rules #3-4 give exact-trigger and narrower-output-contract p...] Routing remains deterministic when mode and trigger are known. Evidence: Selection Rules #3-4 give exact-trigger and narrower-output-contract precedence.
- [x] CHK-112 [P2] [EVIDENCE: this phase is documentation-only; no runtime card-loading mechanism wa...] Performance benchmark is documented if runtime card loading is added. Deferred: this phase is documentation-only; no runtime card-loading mechanism was implemented, so there is no runtime path to benchmark yet.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] [EVIDENCE: plan.md ROLLBACK PLAN and ENHANCED ROLLBACK sections.] Rollback procedure is documented in `plan.md`. Evidence: `plan.md` ROLLBACK PLAN and ENHANCED ROLLBACK sections.
- [x] CHK-121 [P0] [EVIDENCE: plan.md Definition of Ready and Pre-deployment Checklist confirm the a...] Implementation boundary is confirmed before editing future card locations. Evidence: `plan.md` Definition of Ready and Pre-deployment Checklist confirm the approved write scope before authoring.
- [x] CHK-122 [P1] [EVIDENCE: spec.md and implementation-summary.md continuity frontmatter both poin...] Handoff notes identify remaining implementation tasks. Evidence: `spec.md` and `implementation-summary.md` continuity frontmatter both point to Phase 004 for mode-packet routing integration.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] [EVIDENCE: procedure_card_schema.md Source Adaptation Rules #1-4.] Source-adaptation rules reduce copying risk. Evidence: `procedure_card_schema.md` Source Adaptation Rules #1-4.
- [x] CHK-131 [P1] [EVIDENCE: filename-only citations map one-to-one to the 14 files under external/...] Source citations are sufficient for review. Evidence: filename-only citations map one-to-one to the 14 files under `external/claude/skills/`.
- [x] CHK-132 [P1] [EVIDENCE: normalized grep comparison printed no_15_word_verbatim_runs=true.] Private cards do not expose external prompt bodies. Evidence: normalized 15-word source/card comparison through `grep -Fxf` printed `no_15_word_verbatim_runs=true`.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] [EVIDENCE: strict validation returned Errors: 0, Warnings: 0 after the evidence refresh.] All spec documents remain synchronized after implementation. Evidence: task/checklist/decision/summary evidence was refreshed from live checks, then strict validation returned `Errors: 0, Warnings: 0`.
- [x] CHK-141 [P1] [EVIDENCE: both files exist and were regenerated after the final content edit pass.] Metadata remains discoverable through `description.json` and `graph-metadata.json`. Evidence: both files exist and were regenerated after the final content edit pass.
- [x] CHK-142 [P2] [EVIDENCE: no maintainer-facing workflow beyond this packet's own docs changed; t...] Knowledge transfer notes are added if the implementation changes maintainer workflow. Deferred: no maintainer-facing workflow beyond this packet's own docs changed; the schema and card inventory are self-documenting.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Delegated to this session per verified grounding facts | 2026-07-06 |
| Implementer | Phase owner | Approved | 2026-07-06 |
| Reviewer | Source-adaptation reviewer | Approved via independent verification pass | 2026-07-06 |
<!-- /ANCHOR:sign-off -->
