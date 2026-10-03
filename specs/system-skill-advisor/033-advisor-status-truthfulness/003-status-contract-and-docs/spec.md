---
title: "Feature Specification: Phase 3: status-contract-and-docs"
description: "The mutating advisor CLI commands' catalog pages never state the --trusted requirement, references/scoring/advisor-scorer.md cites moved line ranges and stale examples, PHRASE_BOOSTS has no bound declared where the map lives, 13 of 14 skills carry routing phrases only in graph-metadata.json, and advisor_status exposes no embedding provider or model-server health."
trigger_phrases:
  - "trusted mutation docs"
  - "advisor scorer references"
  - "phrase boost bound"
  - "embeddings health status"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: status-contract-and-docs

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Five recorded contract gaps let an operator be surprised by behavior the code already enforces or by references that no longer match the code. `skill_graph_scan` refuses an untrusted call with exit 64, but the command's own catalog page never says `--trusted`; the scorer reference cites line ranges that moved and examples whose ids changed; `PHRASE_BOOSTS` is bounded only in the doctor's proposal asset, not where the map lives; routing phrases exist in `graph-metadata.json` for all 14 skills but in `SKILL.md` frontmatter for only one; and `advisor_status` has no embedding provider or model-server health surface at all. This phase states the contracts where the operator reads them.

**Key Decisions**: Document the enforced trusted-mutation gate on every mutating command page; correct references against the code at edit time, including their examples; declare the phrase-boost bound where `PHRASE_BOOSTS` lives and align it with the doctor's `[-1.0, 2.0]`; decide the routing-phrase source after inventorying the readers; add an opt-in, fail-soft embeddings health surface to `advisor_status`.

**Critical Dependencies**: The advisor runtime schema and handler for the embeddings surface; the scoring lane source for the reference corrections; the doctor proposal asset that already declares the phrase range.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/003-status-contract-and-docs` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-router-reach-misroutes |
| **Successor** | None |
| **Handoff Criteria** | Every mutating command page states the trusted gate; scorer references and examples match the code; the phrase bound is declared where the map lives; the routing-phrase source decision is recorded and implemented; the embeddings health surface is implemented, tested and documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Make the advisor's freshness, scan and routing reports match what is on disk specification.

**Scope Boundary**: Operator-facing contracts, references and the status schema. The phase touches documentation, the phrase map's declared bound, the `advisor_status` handler and schema for embeddings health, and the tests that pin them. It does not change scoring behavior or routing vocabulary.

**Dependencies**:
- The advisor runtime build and the CLI shim for any handler or schema change.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` line ranges, which the reference cites and which must be re-measured at edit time.
- The doctor proposal asset `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`, which already declares `phrase_boost_range: "[-1.0, 2.0]"`.
- The embedder registry and model server (`hf-model-server.cjs`) for the health surface's data.

**Deliverables**:
- `--trusted` stated on `advisor-rebuild.md` and `skill-graph-scan.md`, including the exit-64 refusal and the `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` alternative.
- `references/scoring/advisor-scorer.md` corrected line ranges and examples, verified against the current source.
- A declared, checkable phrase-boost bound next to `PHRASE_BOOSTS`, aligned with the doctor's range.
- A recorded routing-phrase source decision, implemented in the readers or the skills.
- An embeddings health surface on `advisor_status`, documented and pinned by tests.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five gaps were recorded by the doctor command audit and re-verified at planning time. First, the trusted-mutation gate is enforced but under-documented where it matters: `node .skilled/bin/skill-advisor.cjs skill_graph_scan --format json` exits 64 with `skill_graph_scan requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`, and while `SKILL.md:304`, `README.md:86,192`, `feature-catalog/cli-surface/skill-advisor-cli.md:26` and `references/runtime/tool-ids-reference.md:93` state the rule, the mutating commands' own pages `feature-catalog/cli-surface/advisor-rebuild.md` and `feature-catalog/cli-surface/skill-graph-scan.md` contain no `--trusted` mention at all. Second, `references/scoring/advisor-scorer.md:91,93` cites moved line ranges and stale examples: `TOKEN_BOOSTS` now starts at `explicit.ts:27` (the cited `:8-90`), `PHRASE_BOOSTS` at `:109` (the cited `:92-186`), the review-plus-write disambiguation is at `:314-316` with its `push` at `:315` (the cited `:295-303`), `chrome devtools` maps to `mcp-tooling` at 1.0 rather than `mcp-chrome-devtools`, and `deep research` maps to `system-deep-loop` at 1.0 while the hyphenated `deep-research` is the 1.3 entry. Third, `PHRASE_BOOSTS` (`explicit.ts:109-240`) declares no bound, schema or validation where it lives; the only declared range is the doctor's proposal asset `doctor-skill-advisor.yaml:288` (`phrase_boost_range: "[-1.0, 2.0]"`) with its validator at `:265`, and the lane itself only clamps at emit (`explicit.ts:311-312,357`). Fourth, frontmatter `trigger_phrases` exist for 1 of 14 skills (`.skilled/skills/system-skill-advisor/SKILL.md`) while all 14 `graph-metadata.json` files carry routing phrases; the readers found so far - `doc-frontmatter.ts`, `metadata-sanitizer.ts` and `ci-skill-root-metadata.cjs:396-425` - parse graph metadata or reference docs, not the skill's own `SKILL.md` frontmatter, so the source of truth must be stated rather than assumed. Fifth, `AdvisorStatusOutputSchema` (`advisor-tool-schemas.ts:319-336`) has no embeddings object; its optional `semanticLaneHealth` (`:204-215`, attached at `:333`) reports the embedder's name, dimension, coverage, dim-mismatch and lane state, but not the provider resolution data (`requestedProvider`, `effectiveProvider`, `fallbackReason`, `dimensionChanged`; `factory.ts:73-76,592-607`) and not the model server's health, whose `/api/health` payload is `state`, `model`, `dim`, `device`, `loadTimeMs`, `loadStartedAt`, `loadProgressAt`, `lastSuccessfulEmbedAt`, `inFlight`, `queueDepth`, `timing`, `error` (`hf-model-server.cjs:838-853`) - not the retired embeddings doctor's expected shape. The CLI manifest narrows the reachable input further: `skill-advisor-cli-manifest.ts:77-86` declares only `workspaceRoot` and `checkArtifactIntegrity` for `advisor_status`, so a live `--json '{"workspaceRoot":"...","includeSemanticHealth":true}'` call and the same call with `debug` both fail with `Unknown parameter(s)` and exit 64 even though the handler's input schema accepts them, which means any new health surface must be declared in the manifest or it cannot be requested at all.

### Purpose
Put each contract where the operator reads it: the trusted gate on the commands that enforce it, correct references beside the code they cite, a declared bound beside the map it bounds, a stated routing-phrase source, and a status surface that tells the truth about embeddings health.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `--trusted` requirement and its exit-64 refusal on every mutating command's feature-catalog page, plus the environment-variable alternative.
- Correct line ranges and examples in `references/scoring/advisor-scorer.md`, re-measured against the current source at edit time.
- A declared phrase-boost bound where `PHRASE_BOOSTS` lives, aligned with the doctor's `[-1.0, 2.0]` range, and a check that states it.
- An inventory of routing-phrase readers, a recorded decision on the source of truth, and the resulting edits to readers or skill frontmatter.
- An embeddings health surface on `advisor_status` covering provider resolution and model-server state, opt-in and fail-soft, with schema, handler, tests and docs.
- Documentation for each changed surface.

### Out of Scope
- Scoring behavior, lane weights and routing vocabulary changes - Phase 2 owns vocabulary and this phase only declares the bound.
- The model server's own behavior, loading, device selection or error handling.
- The retired embeddings doctor route: it was retired in the source audit and is not restored here.
- The trusted-mutation enforcement itself: it works and stays unchanged; only its documentation is fixed.
- The freshness and panel changes from Phase 1.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md` | Modify | State the `--trusted` requirement and the exit-64 refusal |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-graph-scan.md` | Modify | State the `--trusted` requirement and the exit-64 refusal |
| `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md` | Modify | Corrected line ranges and examples for the explicit lane |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Declare the phrase-boost bound beside the map |
| `.skilled/skills/system-skill-advisor/runtime/tests/` (scorer suite) | Modify | Pin the declared bound |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modify | Embeddings health schema on the status output |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modify | Build the embeddings health facts, fail-soft |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts` | Modify | Declare the health option (and the existing semantic option) so the surface is reachable through the CLI |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Modify | Pin the health surface's present and unavailable states |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md` | Modify | Document the health surface and its read cost |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Record the routing-phrase source decision and the health surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every mutating command page (`advisor_rebuild`, `skill_graph_scan`, apply-mode `skill_graph_propagate_enhances` where a page exists) states that the command requires `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` and that an untrusted call is refused with exit 64. |
| REQ-002 | `references/scoring/advisor-scorer.md` cites line ranges that match `explicit.ts` as measured at edit time, and its examples name ids and values that exist in the current maps. |
| REQ-003 | The `PHRASE_BOOSTS` bound is declared where the map lives and is consistent with the doctor's `[-1.0, 2.0]` range; a test or check fails when a value falls outside it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The routing-phrase readers are inventoried and a recorded decision states whether `SKILL.md` frontmatter or `graph-metadata.json` is the source of truth; the readers and the skills are aligned with that decision, and the decision is documented where skill authors read it. |
| REQ-005 | `advisor_status` gains an embeddings health surface covering the provider resolution and the model server, opt-in like the semantic lane health, fail-soft when the provider or server is unavailable, schema-valid, tested, and documented. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator reading the rebuilding or scanning page learns the trusted requirement before hitting the exit-64 refusal.
- **SC-002**: Every line-range and example citation in the scorer reference resolves to the code it names at the time of edit.
- **SC-003**: The phrase-boost bound is visible beside `PHRASE_BOOSTS` and enforced by a check that rejects an out-of-range value.
- **SC-004**: The routing-phrase source of truth is recorded, and the readers or the skills are aligned to it.
- **SC-005**: A live `advisor_status` call with the embeddings health option returns provider and model-server facts, and returns a reported unavailable state when the server is down.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Advisor runtime build | Schema and handler changes stay invisible to the CLI | Build before live verification, as Phase 1 does |
| Dependency | Model server reachable during verification | The health surface cannot be shown populated | Verify both states: reachable and unavailable; the fail-soft path is the contract |
| Risk | The reference correction drifts again as the source moves | The fix is true only at edit time | Cite narrow ranges and re-measure at edit time; note the measurement command in the page |
| Risk | The phrase bound duplicates the doctor's range and diverges later | Two declared bounds with different values | Declare one value, reference the doctor asset in the comment, and pin it with the check |
| Risk | The frontmatter decision changes authoring behavior for 14 skills | Broad documentation churn | Inventory first; keep the change to readers and the decision text unless the inventory proves frontmatter is load-bearing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The embeddings health surface stays opt-in and bounded; it performs no model load and must not delay a plain `advisor_status` call.

### Security
- **NFR-S01**: The health surface reads configuration and server status only; it never returns prompts, vectors or document content, and the model-server probe is a read-only GET with a short timeout.

### Reliability
- **NFR-R01**: An unavailable provider or model server reports an explicit unavailable state; it never fails the status call and never returns a false healthy value.

---

## 8. EDGE CASES

### Data Boundaries
- No embedder configured: provider facts report the disabled or unavailable state with the reason.
- Server reachable but model not loaded: report the server's own state rather than a guessed one.
- A phrase-boost value exactly on the bound: inside, not a violation.

### Error Scenarios
- Model server times out: report unavailable with the error class, not a stack trace.
- Provider resolution throws: report unavailable for that sub-object and keep the rest of the status valid.
- The scorer source moves again before the edit lands: re-measure at edit time; a stale citation fails REQ-002.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 10, LOC: ~300, Systems: advisor runtime, docs, model server probe |
| Risk | 10/25 | Auth: N, API: Y (read-only health probe), Breaking: N (schema-additive) |
| Research | 10/20 | Reader inventory and live health behavior must be observed before deciding |
| Multi-Agent | 4/15 | Workstreams: 2 (docs and runtime can proceed independently) |
| Coordination | 6/15 | Dependencies: 3 (build, model server, doctor range) |
| **Total** | **42/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The health surface becomes a de facto hard dependency of status | M | L | Keep it optional, fail-soft and out of the default call path |
| R-002 | The frontmatter decision is made from a partial reader inventory | M | M | Inventory and record the search commands in the decision before editing |
| R-003 | The phrase check duplicates the map and fails on an intentional value | L | L | Bound matches the doctor's declared range; the check names the allowed interval in its message |

---

## 11. USER STORIES

### US-001: The repair path states its gate (Priority: P0)

**As an** operator repairing stale advisor state, **I want** the rebuilding and scanning pages to state the `--trusted` requirement before the command refuses me, **so that** the repair is one step instead of an exit-code detour.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Embeddings health is visible from the status call (Priority: P1)

**As a** maintainer diagnosing routing, **I want** `advisor_status` to report the embedding provider and model-server state, **so that** I know whether semantic lanes have a working backend without starting a separate investigation.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Should the embeddings health surface live inside `semanticLaneHealth` or as a sibling `embeddings` object? The plan recommends the sibling shape so the health facts are readable without the semantic lane option, and records the choice.
- Should the phrase-boost check live in the existing scorer test suite or as a small script beside the map? The plan picks the suite to keep one runner.
- Should `SKILL.md` frontmatter gain `trigger_phrases` for all 14 skills, or should the decision declare `graph-metadata.json` the only routing source? The reader inventory decides, and the phase records either outcome.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
