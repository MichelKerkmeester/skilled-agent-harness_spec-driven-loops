---
title: "Feature Specification: Remove Routing-Neutral Dead Fields"
description: "Delete confirmed-orphan skill-metadata fields that do not affect routing (description.json extras, sk-code derived-block orphans, causal_summary disposition) and resolve two duplicate-authority fields (routerPolicy.tieBreak, advisorRouting.packetSkillName) found by the 029 skill/advisor JSON optimization research."
trigger_phrases:
  - "remove dead skill metadata fields"
  - "resolve tieBreak duplicate authority"
  - "advisorRouting packetSkillName dedup"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/007-dead-field-deletes"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "causal_summary disposition gated on phase 003's canonical-derived-owner decision"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-dead-field-deletes"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "advisorRouting.packetSkillName: delete the nested duplicate outright, or keep it and document it as an intentional redundant self-check field consumed only by routing-registry-drift-guard.vitest.ts?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Remove Routing-Neutral Dead Fields

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/030-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 029 skill/advisor JSON optimization research found six orphan/duplicate-authority fields inside the skill-root metadata surface, each confirmed (0 code readers outside the JSON file itself, or a second authored copy that only a test reads) by an independent repo-wide grep in this packet: three `description.json` extras with no verified reader (`trigger_examples`, `supported_surfaces`, `opencode_languages`), two `sk-code`-only `graph-metadata.json` derived-block fields absent from both the Python compiler's required-field list and the TypeScript scorer's derived lane (`supported_surfaces`, `peer_resource_categories`), a fleet-wide `derived.causal_summary` field that the Python compiler validates as required-non-empty but the TypeScript `SkillDerivedV2Schema` never defines and the scorer's derived lane never reads, an authored `routerPolicy.tieBreak` ordering that six of seven hub compilers copy verbatim into the runtime router but `sk-doc`'s own compiler silently overrides with a derived order (an inline code comment in `registry-compiler.cjs` admits the authored array has drifted), and a `mode.advisorRouting.packetSkillName` duplicated on every mode entry across the fleet that only a drift-guard test reads — never a production consumer. This packet removes the confirmed-orphan fields, reconciles the two duplicate authorities, and documents the spec-folder-vs-skill-root `generate-description`/`backfill-graph-metadata` script-name collision so the next person does not assume a skill-root regenerator exists where none does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — the routing-neutral half of O5 plus all of O11 from `../../029-skill-json-optimization-research/research/research.md` §3: (1) delete `trigger_examples` from every `description.json` that carries it (`sk-prompt`, `mcp-tooling`, `system-deep-loop`, `sk-code`, `sk-design`, `sk-doc`, `cli-external-orchestration`); (2) delete `supported_surfaces` and `opencode_languages` from `description.json` in the two hubs that carry them (`sk-code`, `sk-doc`); (3) delete `derived.supported_surfaces` and `derived.peer_resource_categories` from `sk-code/graph-metadata.json` (the only root carrying them); (4) resolve `derived.causal_summary` fleet-wide per whatever canonical-derived-owner decision phase 003 records — if the Python-compiler schema stays canonical, downgrade `causal_summary` from a hard-validated field to a documented-optional prose field and note it is not a routing input; if the TypeScript schema becomes canonical, this item folds into the phase-003 migration and this phase only removes the now-superseded Python-side validation gate; (5) reconcile `sk-doc/hub-router.json`'s `routerPolicy.tieBreak` array to match the order `sk-doc`'s own `registry-compiler.cjs` (`bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs`) actually derives (`Object.keys(routerSignals)`), and add a short doc note explaining the derive-not-copy exception; (6) resolve `mode.advisorRouting.packetSkillName` — the value duplicated on every mode entry in every hub's `mode-registry.json` alongside the top-level `mode.packetSkillName` that production code actually reads; (7) add a cross-reference note to `skill-root-metadata-contract.md` documenting that `generate-description.ts`/`backfill-graph-metadata.ts` under `system-spec-kit/scripts/` are spec-folder-only tooling with no skill-root analog.

Out of scope — `graph-metadata.manual.*` (a live-drifted field grok-high rated P0, but its remediation is a schema migration into typed `edges` plus an unknown-key lint, not a plain deletion — a separate follow-up phase); building the skill-root `derived` regenerator or freshness gate (O1, phase 003's job); the TS-vs-Python derived-schema unification itself (O1); wiring compiler/routing-accuracy validation into CI (O4, `006-ci-compiler-accuracy-gates`); intent-signal quality fixes (O6); command-metadata advisor ingestion (O7); the parent-intent projection idea (O8); `leaf-manifest.config.json` defaulting (O9) and denser command-metadata/leaf-alias tests (O10) — Tier 3 items not assigned to this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Delete `description.json` `trigger_examples` fleet-wide | All 7 carrying `description.json` files (`sk-prompt`, `mcp-tooling`, `system-deep-loop`, `sk-code`, `sk-design`, `sk-doc`, `cli-external-orchestration`) no longer contain the key; each file remains valid JSON and still satisfies `parent-skill-check.cjs` check 8a (`name`/`description`/`version`/`keywords` present); a repo-wide grep for `"trigger_examples"` outside `*.py` scaffold code and `init_skill.py`'s own scaffold literal returns zero hits |
| REQ-002 | Delete `description.json` `supported_surfaces` and `opencode_languages` in `sk-code` and `sk-doc` | Both fields removed from `sk-code/description.json` and `sk-doc/description.json`; `parent-skill-check.cjs` 8a/8b still pass for both hubs; a repo-wide grep for `"supported_surfaces"`/`"opencode_languages"` in `*.ts`/`*.js`/`*.cjs`/`*.mjs` outside the two edited JSON files still returns zero non-JSON code readers, confirming nothing regressed |
| REQ-003 | Delete `sk-code/graph-metadata.json` `derived.supported_surfaces` and `derived.peer_resource_categories` | Both keys removed from the `derived` block; `skill_graph_compiler.py`'s `validate_derived_metadata` still passes for `sk-code` (neither field is in its required-field list at line 313, so removal cannot trip that check); `scorer/lanes/derived.ts` behavior is unchanged (it never referenced either key) |
| REQ-004 | Resolve `derived.causal_summary` fleet-wide per the phase-003 canonical-derived-owner decision | If phase 003 keeps the Python-compiler schema canonical: `causal_summary` is re-documented in `skill-root-metadata-contract.md` as descriptive prose, not a routing input, and `skill_graph_compiler.py:318-320`'s required-non-empty check is annotated (not removed) to say so; if phase 003 adopts the TS `SkillDerivedV2Schema` as canonical: this item is a no-op here and folds into phase 003's migration, recorded as such in this phase's `implementation-summary.md`. Either branch is evidence-backed by phase 003's decision record, never assumed |
| REQ-005 | Reconcile `sk-doc/hub-router.json`'s `routerPolicy.tieBreak` with the order its own compiler derives | `hub-router.json:7`'s `tieBreak` array is reordered to exactly match `Object.keys(routerSignals)` as computed by `scoreTieBreakOrder()` in `bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:198-200`; `parent-skill-check.cjs` check 5e (exact-permutation) and 5i (workflow-before-transport ordering) both still pass; a one-line comment is added next to `tieBreak` in `hub-router.json` (or the shared contract doc) noting `sk-doc`'s compiler derives this order and ignores the authored one, so future hand-edits to this array do not assume they change runtime behavior |
| REQ-006 | Resolve the `mode.advisorRouting.packetSkillName` duplicate against the top-level `mode.packetSkillName` | Confirmed via repo-wide grep that every production consumer (`registry-compiler.cjs:97`, `parent-skill-check.cjs:416-439`, `skill-benchmark/d5-connectivity.cjs:221-230`, `executor-delegation.ts:172-173`) reads the top-level `mode.packetSkillName`, never the nested copy, and that `routing-registry-drift-guard.vitest.ts:150-151` is the only reader of `mode.advisorRouting.packetSkillName` (asserting it merely equals `mode.packet`); either the nested key is removed fleet-wide from every hub's `mode-registry.json` with the vitest assertion updated to check `mode.packet === mode.packetSkillName` directly, or it is kept and `mode-registry.json`'s `advisorRoutingContract` doc block gains a one-line note explaining it is an intentional redundant self-check, not a second source of truth — the open question in this spec's frontmatter records which branch is chosen |
| REQ-007 | Document the spec-folder-vs-skill-root script-name collision | `skill-root-metadata-contract.md` (already carrying the schema-separation note at line 32) gains a companion note naming `generate-description.ts`/`backfill-graph-metadata.ts` (`system-spec-kit/scripts/spec-folder/` and `system-spec-kit/scripts/graph/`) as spec-folder-only tooling with no skill-root equivalent today, so `--fix` on `ci-skill-root-metadata.cjs` remains the only skill-root regenerator anyone should reach for |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Every field named in REQ-001 through REQ-003 is removed from its confirmed locations and a repo-wide grep proves zero surviving non-JSON readers; REQ-004's `causal_summary` disposition is recorded against phase 003's actual decision, not assumed; REQ-005's `sk-doc` `tieBreak` array matches its compiler's derived order with the exception documented; REQ-006's duplicate is resolved one way or the other with the choice recorded; REQ-007's doc note exists. `node ci-skill-root-metadata.cjs` and `node parent-skill-check.cjs <hub>` stay green for every touched hub; `python3 skill_graph_compiler.py` validation stays green fleet-wide; `npx vitest run routing-registry-drift-guard.vitest.ts` stays green; the git diff touches only the files named in this spec's scope, nothing else.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | Phase 003's canonical-derived-owner decision (predecessor phase) | REQ-004 branches on the recorded decision instead of assuming one; if phase 003 has not landed when this phase executes, REQ-004 alone is deferred and every other requirement proceeds independently |
| Risk | An undiscovered external consumer of a field marked orphan by this packet's greps | Re-run the exact repo-wide grep commands recorded in `plan.md` §5 immediately before each deletion, not just once during spec authoring; CI (`ci-skill-root-metadata.cjs`, the vitest suites, `skill_graph_compiler.py`) is the final backstop |
| Risk | Reordering `sk-doc`'s `tieBreak` array is read as a behavior change by a future auditor who does not know the compiler ignores its order | The comment added under REQ-005 makes the exception explicit at the point of authoring, not just in this spec |
| Risk | Deleting `mode.advisorRouting.packetSkillName` fleet-wide touches every hub's `mode-registry.json` plus scaffold templates (`init_skill.py`, `parent-skill-description-template.json`-adjacent assets) and the drift-guard test in one change | REQ-006 keeps both resolution branches open and evidence-gated; if the deletion branch is chosen, `parent-skill/parent-skill-graph-metadata-template.json`-style assets and `init_skill.py`'s scaffold are updated in the same commit so newly scaffolded hubs never reintroduce the duplicate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `advisorRouting.packetSkillName` (REQ-006): delete the nested duplicate outright, or keep it documented as an intentional redundant self-check consumed only by `routing-registry-drift-guard.vitest.ts`? Recorded as the frontmatter open question; recommend deletion (it adds authoring burden with zero behavioral payload) but defer to implementation-time confirmation that no scaffold template silently depends on its presence.
- Does phase 003 land before this phase executes? If not, REQ-004 ships as a documented deferral rather than blocking REQ-001/002/003/005/006/007.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program predecessor**: `../../029-skill-json-optimization-research` (source research, findings O5 §65-66 and O11 §81)
- **Contract under study**: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `006-ci-compiler-accuracy-gates` |
| **Successor** | `008-manual-to-edges-migration` |
