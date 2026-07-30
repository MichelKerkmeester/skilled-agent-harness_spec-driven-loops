---
title: "Feature Specification: Complete the Scaffold-to-Route Journey"
description: "Make init_skill.py auto-run the H/S class gate --fix and write a compiler-valid derived block so a new skill is born complete, generate S-class leaf-manifest.config.json defaults from one shared source, and add one joined test proving scaffold -> generated gate -> advisor ingest -> parent selection -> compiled route (O2 + O9, closing the open 024 journey-proof gap)."
trigger_phrases:
  - "scaffold born complete"
  - "init_skill auto fix class gate"
  - "scaffold to route journey test"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/004-scaffold-journey"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/004-scaffold-journey"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the new joined test's advisor-ingest and parent-selection legs call the TS scorer/DB helpers directly (vitest, unmocked) or shell out through a CLI front door — resolved in plan.md ARCHITECTURE, not pre-empted here"
      - "The exact derived.entities[] content the scaffold should assert (SKILL.md as a 'skill' entity vs a 'reference' entity) — resolved during implementation against ALLOWED_ENTITY_KINDS"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Complete the Scaffold-to-Route Journey

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A skill scaffolded today by `init_skill.py` is not actually complete. Two independent gaps exist, both raised 3/3 across the 029 research lineages:

1. **Born compiler-invalid.** `init_skill.py` writes `graph-metadata.json` with `schema_version: 2` and a `derived` block, but that block only carries `trigger_phrases`, `key_topics`, `source_docs`, `created_at`, `last_updated_at` (standalone at `init_skill.py:287-293`; parent-hub at `init_skill.py:541-558`). `skill_graph_compiler.py`'s schema-version-2 validator (`validate_derived_metadata`, `skill_graph_compiler.py:306-398`) additionally requires non-empty `key_files`, `entities`, and a non-empty `causal_summary` string (`skill_graph_compiler.py:313-320`). A freshly scaffolded root therefore fails advisor-graph compilation on its very first ingest, with no error surfaced at scaffold time — the author only discovers it later, offline, when the compiler runs.
2. **Never generated.** Neither `init_skill()` nor `init_parent_skill()` runs the H/S class gate after scaffolding. Per the class contract (`skill-root-metadata-contract.md` §3-4), `leaf-manifest.json` is required and generated for both H and S, and `leaf-aliases.json` is required and generated for S. `ci-skill-root-metadata.cjs --fix` is the only writer of these files (`ci-skill-root-metadata.cjs:165-261`), but `init_skill.py` never calls it — a new root is left non-conforming until someone runs `--fix` by hand.

A third, lower-leverage gap (O9): the S-class `leaf-manifest.config.json` `init_skill.py` writes (`init_skill.py:295-308`) and the defaults `generate-leaf-manifest.cjs`'s `readStandaloneConfig` falls back to when a field is omitted (`generate-leaf-manifest.cjs:103-135`) are two independently hardcoded copies of the same boilerplate (`packet`, `leafRoots`, `excludeIndexFiles`, `resourceContractVersion`) — the exact "kept equivalent by hand" drift shape the codebase already guards against for the graph-metadata/template pair (`create-journey-proof.test.cjs:43-67`), but not for this pair.

Finally, the existing journey proof stops short. `create-journey-proof.test.cjs` already runs both scaffold kinds through `--fix` and a doctor check (024, `CHK-005`), but it does not touch the advisor-ingest, parent-selection, or compiled-route legs — the 029 research (O2) confirms no test joins scaffold through to a routed selection.

Purpose: make a scaffolded skill compiler-valid and gate-fresh the moment `init_skill.py` returns, single-source the S-class config boilerplate, and add the one joined test that proves the whole pipeline — closing the journey gap before Phase 6 turns on the CI compiler-schema gate that would otherwise fail every newly scaffolded skill on day one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- `sk-doc/sk-create-skill/scripts/init_skill.py` — `init_skill()` and `init_parent_skill()`: auto-run the H/S class gate `--fix` scoped to the newly scaffolded root after all scaffold files are written, and abort the scaffold (non-zero exit, printed cause) if the fix run fails for that root; extend both `derived` block literals with non-empty `key_files`, `entities`, and `causal_summary` values that reference files the scaffold has already written, satisfying `skill_graph_compiler.py`'s schema-version-2 validator on first ingest with no hand-editing.
- `sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` — `readStandaloneConfig()`: single-source the S-class boilerplate defaults so `init_skill.py`'s scaffolded config and this function's own fallback values read from one shared definition instead of two hand-kept-equivalent literals.
- `sk-doc/sk-create-skill/scripts/tests/` — one new joined test proving scaffold -> generated class gate -> advisor ingest -> parent selection -> compiled route, for one S-class and one H-class scaffold, extending the coverage `create-journey-proof.test.cjs` already provides up through the doctor check.
- `sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json` — keep the hand-authoring template's documented defaults in sync with the single-sourced values from the point above (doc-only follow-through, not a new authored contract).

**Out of scope:**
- Naming the canonical `derived` producer among the TS sync writer, the Python compiler, and a shared schema package (O1) — Phase 1's decision record. This phase targets `skill_graph_compiler.py`'s already-enforced schema because that is the consumer a fresh scaffold fails against today; a follow-up alignment pass may be needed once Phase 1 lands.
- Migrating any **existing** skill root's `derived` block to schema-version-2 completeness (Phase 3's fleet migration) — this phase only changes what new scaffolds write.
- Wiring `skill_graph_compiler.py` or the routing-accuracy corpus into CI (O3/O4, Phase 6) — this phase's own tests run locally/on-demand only; Phase 6 depends on this phase shipping first.
- The compiled-routing activation-manifest mint/freshness flow `init_parent_skill()` already runs via `_run_manifest_command` / `compiled-route-manifest.cjs` (`init_skill.py:345-393,619-666`) — unchanged; this phase adds the class-gate `--fix` call alongside it, not in place of it.
- Removing dead/orphan `derived`/`manual` fields (O5, Phase 8), command-metadata ingestion (O7), or intent-signal quality (O6) — separate phases.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Standalone scaffold is gate-fresh on return | After `init_skill()` returns success, `leaf-manifest.json` and `leaf-aliases.json` exist under the new root and are byte-identical to a fresh `ci-skill-root-metadata.cjs` (no `--fix`) recheck — no manual `--fix` step required |
| REQ-002 | Parent-hub scaffold is gate-fresh on return | After `init_parent_skill()` returns success, `leaf-manifest.json` exists under the new hub root and is byte-identical to a fresh recheck, independent of and without changing the existing `--compiled-routing legacy\|ready` mint/freshness behavior |
| REQ-003 | Scaffold `derived` block is compiler-valid | `skill_graph_compiler.py`'s `validate_derived_metadata` returns zero errors for a freshly scaffolded standalone or parent-hub root's `graph-metadata.json`, with `key_files`/`entities[].path` resolving to files the scaffold itself already wrote and `entities[].kind` in `{skill, agent, script, config, reference}` |
| REQ-004 | Fix failure aborts the scaffold, not silently | If the class-gate fix run fails for the new root (e.g. `MANIFEST_REGENERATION_FAILED`), `init_skill()`/`init_parent_skill()` prints the cause and returns `None` (CLI exit 1) rather than leaving a half-generated root reported as success |
| REQ-005 | S-class config defaults are single-sourced | `init_skill.py`'s scaffolded `leaf-manifest.config.json` literal and `generate-leaf-manifest.cjs`'s `readStandaloneConfig` fallback values for `packet`/`leafRoots`/`excludeIndexFiles`/`resourceContractVersion` read from one shared definition; changing a default in one place changes both without a second hand-edit |
| REQ-006 | Joined journey test exists and passes | One new test in `sk-doc/sk-create-skill/scripts/tests/` scaffolds an S-class and an H-class skill, runs the generated class gate, ingests both into an advisor graph, proves at least one prompt resolves to the correct scaffolded skill/hub, and proves the compiled-route mint/freshness path accepts the hub root — all in one pipeline, all passing |
| REQ-007 | Fix run never fails on unrelated fleet violations | The class-gate invocation added to `init_skill.py` scopes its pass/fail signal to the newly scaffolded root only; a pre-existing violation on an unrelated fleet root never fails a scaffold that has nothing to do with it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

A fresh `python3 init_skill.py <name> --path <dir>` (standalone) or `--kind parent` (hub) run leaves the new root with every class-required generated file present and fresh, with zero follow-up `--fix` step; the scaffolded `derived` block passes `skill_graph_compiler.py` validation unmodified; the S-class config default values live in exactly one place; the new joined test passes end-to-end (scaffold -> gate --fix -> advisor ingest -> parent selection -> compiled route) for both an S and an H scaffold; the existing `create-journey-proof.test.cjs`, `skill-root-metadata-contract.test.cjs`, and `leaf-resource-contract.test.cjs` suites stay green; and this phase ships and verifies clean before Phase 6's CI compiler/accuracy gate turns on, so no newly scaffolded skill fails that gate on its first day.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | A naive `ci-skill-root-metadata.cjs --fix` invocation scans the whole `--skills-dir` and could surface an unrelated, pre-existing fleet violation as a scaffold failure | Scope the pass/fail signal to the new root only: use `--format json --fix` and read only the `results[]` entry matching the new `skill_name`, ignoring the aggregate exit code — mirroring how `_run_manifest_command` already parses per-hub JSON rather than trusting a bare exit code (`init_skill.py:354-393`) |
| Risk | `derived.key_files`/`entities[].path` require real, already-existing files; composing the block before those files are written would make a freshly scaffolded root fail its own compiler check | Compose the `derived` block only after every referenced file (`SKILL.md`, and for H the registry/router files) has been written to disk, referencing only paths the scaffold itself already created |
| Risk | This phase must land, verify, and be stable before Phase 6 turns on the CI compiler-schema gate, or every newly scaffolded skill fails CI immediately on day one | Explicit MUST-precede ordering recorded in the parent packet's phase sequence (Phase 6 lists this phase as a hard dependency); this phase's own green test suite is Phase 6's entry condition |
| Risk | The new joined test spans Python (`init_skill.py`), Node (`ci-skill-root-metadata.cjs`), and the advisor's TS ingest/scoring path in one pipeline — more moving parts than any existing create-skill test, raising flake risk | Model the ingest/select legs directly on the already-green `discovery-pipeline-parity.vitest.ts` pattern (`mkdtempSync` + `initDb`/`indexSkillMetadata` + `closeDb`/`rmSync` in try/finally); model the compiled-route leg on the already-used `compiled-route-manifest.cjs` mint/freshness subprocess pattern `init_skill.py` itself already calls |
| Dependency | Phase 1's derived-authority decision (TS sync writer vs Python compiler vs a shared schema package) | This phase targets the schema `skill_graph_compiler.py` already enforces today (the consumer that currently fails); if Phase 1 later names a different canonical schema, a follow-up alignment pass may be needed — not a blocker for this phase's own acceptance |
| Dependency | Phase 3's fleet migration of existing roots to schema-version-2 `derived` completeness | Independent — this phase only changes what NEW scaffolds write; it does not touch any existing root's committed `graph-metadata.json` |
| Dependency | `create-journey-proof.test.cjs`'s existing scaffold-and-stage helpers (`stageDoctorSupport`, `assertShapeMatches`) | The new joined test reuses this file's staging pattern rather than reinventing a parallel one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the new joined test's advisor-ingest and parent-selection legs call the TS scorer/DB helpers directly (vitest, unmocked, alongside `discovery-pipeline-parity.vitest.ts`) or shell out through a CLI front door — resolved in `plan.md` §3 ARCHITECTURE, not pre-empted here.
- The exact `derived.entities[]` content the scaffold should assert (`SKILL.md` as a `"skill"` entity vs a `"reference"` entity) — resolved during implementation against `ALLOWED_ENTITY_KINDS = {"skill", "agent", "script", "config", "reference"}` (`skill_graph_compiler.py:45`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research this phase implements**: `../../029-skill-json-optimization-research/research/research.md` §3 (O2, O9)
- **Contract under study**: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- **Prior journey proof (extended, not replaced)**: `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs`
- **024 checklist item this phase closes**: `../../024-create-journey-gate-fixes/checklist.md` `CHK-005`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `003-derived-regenerator-migration` |
| **Successor** | `005-ci-golden-prompts` |
