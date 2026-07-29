---
title: "Feature Specification: Ingest command-metadata.json into Command Routing"
description: "Derive both the TS COMMAND_BRIDGES array (projection.ts) and the Python COMMAND_BRIDGES dict (skill_advisor.py) from the fleet's 7 command-metadata.json files instead of two hand-maintained, already-drifted authorities; add a drift-guard asserting all three sources agree, plus denser command-metadata/leaf-aliases e2e tests. High-blast: live routing rewire on the advisor's hottest file, shipped shadow-mode-first with a documented rollback."
trigger_phrases:
  - "ingest command-metadata into routing"
  - "command bridges drift guard"
  - "derive command bridges from json"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 006 (skill_graph_compiler.py + score-routing-corpus.py wired into routing-registry-drift.yml) so this phase's drift-guard and corpus-gate run in CI, not only locally"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/011-command-metadata-ingestion"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should system-spec-kit's missing command-metadata.json (the reason /speckit:*, /memory:save bridges have no JSON source today) be backfilled as a prerequisite of this phase, or documented as a residual allow-list and deferred to a fast-follow?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Ingest command-metadata.json into Command Routing

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Command routing today has **three independent authorities that already disagree in count and in granularity**, confirmed by direct read against the live tree:

- **TS `COMMAND_BRIDGES`** — `mcp-server/lib/scorer/projection.ts:58-149`, 6 hand-authored `SkillProjection` entries, coarse (a single collapsed `command-spec-kit` bridge covers the whole `/speckit:*` family).
- **Python `COMMAND_BRIDGES`** — `mcp-server/scripts/skill_advisor.py:2004-2095`, 16 hand-authored dict entries, fine-grained (per-subcommand `/speckit:*` bridges plus a deprecated legacy catch-all), with its own `COMMAND_BRIDGE_OWNER_NORMALIZATION` map at `skill_advisor.py:2097-2108`. The file's own comment at `skill_advisor.py:2006-2014` records that the TS-style collapsed bridge was already a routing bug once (`/deep:research` losing its owning-skill signal to the generic `command-spec-kit` bridge) — the two surfaces have drifted since that fix and nothing keeps them in sync.
- **`command-metadata.json`** — 7 per-hub files (`sk-doc` 11, `system-deep-loop` 8, `sk-design` 2, `sk-prompt` 1, `cli-external-orchestration`/`mcp-tooling`/`sk-code` 0 each), 22 entries total, schema-gated by the fleet's `ci-skill-root-metadata.cjs` (`command-metadata-schema.cjs`) but read only by choreography/authoring tooling — never by the advisor's routing path.

No drift-guard ties any of the three together: `routing-registry-drift.yml` asserts `mode-registry.json` freshness, not `command-metadata.json` (per 029 research O7 evidence). The existing command-side tests (`command-binding-existence.vitest.ts`, `command-bridge-resolution-guard.vitest.ts`) check that bridge ids resolve to a live `.opencode/commands/` file — they do not prove any prompt actually routes to the right skill, and there is no dedicated `command-metadata`/`leaf-aliases` e2e suite comparable in depth to the registry/router coverage (029 research O10).

Purpose: make `command-metadata.json` the single source of truth for command routing. Derive both the TS and Python `COMMAND_BRIDGES` from it, add one drift-guard that fails loud the moment any of the three sources disagrees again, and close the e2e coverage gap — while treating `projection.ts` as the hottest, most concurrently-used file in the advisor and shipping the cutover shadow-mode-first per the program parent's REQ-006 guarded-rollout rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — a canonical command-bridge projection derived from all `command-metadata.json` files fleet-wide; regenerating `mcp-server/lib/scorer/projection.ts`'s `COMMAND_BRIDGES` array from that projection inside a clearly delimited GENERATED block (mirroring the existing `DEEP_ROUTING_PROJECTION` pattern in `mcp-server/lib/scorer/aliases.ts:21-71`); regenerating `mcp-server/scripts/skill_advisor.py`'s `COMMAND_BRIDGES` dict from the same projection via new `--emit-command-bridges`/`--check-command-bridges`/`--dump-command-bridges` CLI flags mirroring the script's existing `--emit-routing-projection`/`--check-routing-projection`/`--dump-routing-maps` flags; one new drift-guard vitest asserting the JSON-derived set, the generated TS ids, and the generated Python ids all agree; denser `command-metadata`/`leaf-aliases` e2e tests (one routing assertion per JSON-declared command, plus equivalent leaf-aliases coverage); and a documented, file-committed allow-list for any hand-authored bridge not yet backed by a `command-metadata.json` entry (today: `/speckit:*` and `/memory:save`, because `system-spec-kit` has no `command-metadata.json` of its own).

Out of scope — authoring a `command-metadata.json` for `system-spec-kit` itself (a separate hub's H-class metadata gap, tracked as this phase's open question / fast-follow, not silently absorbed here); redesigning the advisor scorer's ranking math; changing the `command-metadata.json` core schema (`command-metadata-schema.cjs`); touching the choreography-consumption use of `command-metadata.json` that already exists (command-authoring tooling reads `choreography[]` today and is unaffected — this phase only adds an advisor-routing consumer, per the sol-high/glm-high disagreement noted in Risks); any phase-1 `derived`-block work (unrelated field).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A canonical command-bridge projection is derived from every `command-metadata.json` file | A single derivation reads all fleet `command-metadata.json` files (22 entries / 7 hubs today) plus the documented residual allow-list; every projection entry traces to exactly one source `file:line`; the projection's entry count equals `sum(entries per file) + allow-list size` |
| REQ-002 | TS `COMMAND_BRIDGES` is generated, not hand-authored | `projection.ts`'s `COMMAND_BRIDGES` becomes a `// BEGIN/END GENERATED COMMAND BRIDGES` block populated from the projection; the 6 hand-authored entries are removed from source; `--check-command-bridges` reports the TS block "fresh" with zero diff |
| REQ-003 | Python `COMMAND_BRIDGES` is generated without losing existing per-subcommand granularity | `skill_advisor.py`'s `COMMAND_BRIDGES` dict and `COMMAND_BRIDGE_OWNER_NORMALIZATION` map are replaced by an equivalent generated block; every currently-distinct per-subcommand `/speckit:*` bridge (plan/complete/implement/deep-research/deep-review/resume) still resolves to its own distinct owning skill after generation — none collapse back to the deprecated generic `command-spec-kit` bridge |
| REQ-004 | One drift-guard asserts 3-way agreement | A new vitest file asserts `(JSON-derived ids ∪ allow-list) == generated TS COMMAND_BRIDGES ids == generated Python COMMAND_BRIDGES ids`; on any mismatch it fails naming the specific missing/extra ids, not just a boolean |
| REQ-005 | Command-metadata and leaf-aliases e2e coverage moves from thin to dense | Every one of the 22 JSON-declared `command-metadata.json` entries has at least one e2e test asserting a representative prompt resolves to its declared `ownerMode`; leaf-aliases resolution gets equivalent per-entry e2e coverage; the command/leaf-alias vitest file count grows beyond the current 2 (`command-binding-existence.vitest.ts`, `command-bridge-resolution-guard.vitest.ts`) |
| REQ-006 | The live cutover is shadow-mode-first and corpus-gated | Generated TS/Python `COMMAND_BRIDGES` run in shadow (dumped and diffed against the pre-change hand-authored dumps) before any live cutover commit; `score-routing-corpus.py` shows zero regression against the pinned corpus hash before and after generation; the shadow-mode landing and the live cutover are two separate, independently revertible commits, per the program parent's REQ-006 guarded-rollout rule |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

`COMMAND_BRIDGES` in both `projection.ts` and `skill_advisor.py` are generated from `command-metadata.json` (plus the documented allow-list) inside clearly delimited GENERATED blocks; the new drift-guard passes clean on the post-generation tree and fails loud with named ids when any source is edited without regenerating the others; command-metadata and leaf-aliases carry per-entry e2e routing assertions; the pinned routing-accuracy corpus shows zero regression across the cutover; the shadow-mode landing and live cutover are separate commits so the cutover alone is one-command revertible; `validate.sh <folder> --strict` reports Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | `projection.ts` is the advisor's hottest, most concurrently-routed file — an in-place edit risks a live routing regression mid-session for other work | Ship shadow-mode-first: generate and diff before cutting the live array over; cutover lands as its own separate, independently revertible commit (REQ-006) |
| Risk | The Python surface is already fine-grained (per-subcommand `/speckit:*` bridges, fixed once before per `skill_advisor.py:2006-2014`'s own comment) while TS is coarse; a naive 1:1 JSON-entry-to-bridge-id generator could re-collapse the already-fixed per-subcommand routing | Generator supports 1-to-many command→bridge-id expansion and preserves `COMMAND_BRIDGE_OWNER_NORMALIZATION`; REQ-003 explicitly requires zero granularity loss, verified via the corpus gate before cutover |
| Risk | `command-metadata.json` does not yet cover every hand-authored bridge — `system-spec-kit` has no `command-metadata.json`, so `/speckit:*` and `/memory:save` (7 of today's 16 Python entries) have no JSON source | Documented, file-committed allow-list covers the residual explicitly; the drift-guard checks against `JSON ∪ allow-list`, so it never silently accepts a *new* undocumented hand-authored bridge, only the two already-known ones |
| Risk | sol-high and glm-high disagree on whether O7 is a real gap: sol-high treats `command-metadata.json` as legitimately consumed already (by choreography/authoring tooling), glm-high frames it as "gated but not consumed" (029 research §4) | Both are true for different consumers — this phase adds an advisor-**routing** consumer without touching the existing choreography-consumption path; scope section states this explicitly so the phase is not mis-read as "fixing" a non-gap |
| Risk | Routing-accuracy baseline numbers are version-sensitive (029 research §4 warning) | Every corpus comparison in this phase pins the exact corpus hash captured in Phase 1; no bare, unpinned accuracy percentage is quoted |
| Dependency | 006 (`skill_graph_compiler.py` + `score-routing-corpus.py` wired into `routing-registry-drift.yml`) | This phase's drift-guard and corpus-gate need that CI wiring in place to run in CI rather than only locally; blocked until 006 lands |
| Dependency | The 12 fleet `command-metadata.json` files and their fleet gate (`ci-skill-root-metadata.cjs` / `command-metadata-schema.cjs`) | Structural/schema validity of the source data is assumed, not re-validated by this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `system-spec-kit`'s missing `command-metadata.json` be authored as a prerequisite of this phase, or does the documented allow-list residual (REQ-001/REQ-004) stand as the shipped answer, with the backfill tracked as a separate fast-follow against `system-spec-kit`'s own H-class metadata gap? This phase defaults to the allow-list approach so the routing-rewire blast radius stays isolated to `projection.ts`/`skill_advisor.py`, but the parent program owner should confirm before Phase 2 starts.
- Does closing the O10 e2e gap for `command-metadata`/`leaf-aliases` reveal any additional live routing miss (in the spirit of grok-high's parent-hub scaffold-prompt finding in 029 research §1)? Not knowable until the new e2e tests are written in Phase 2 — if one surfaces, it is reported as a finding, not silently fixed inside this phase's stated scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research this program implements**: `../../029-skill-json-optimization-research/research/research.md` §3 O7 (`scorer/projection.ts:58-145`; `routing-registry-drift.yml`), O10 (thin `command-metadata`/`leaf-aliases` e2e coverage), §4 (O7 sol-high/glm-high disagreement)
- **Program parent**: `../spec.md` (REQ-003 blast-radius ordering, REQ-004 corpus-gate, REQ-006 guarded-rollout rule)
- **Contract under study**: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md` (`command-metadata.json` H-class requirement)
- **Existing precedent mirrored by this phase**: `mcp-server/lib/scorer/aliases.ts:21-71` (GENERATED block pattern) and `mcp-server/tests/routing-registry-drift-guard.vitest.ts` (drift-guard pattern)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `010-parent-intent-projection-spike` |
| **Successor** | `012-integration-verification-rollout` |
