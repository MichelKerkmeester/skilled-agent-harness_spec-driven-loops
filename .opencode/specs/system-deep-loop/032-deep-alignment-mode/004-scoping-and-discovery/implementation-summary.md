---
title: "Implementation Summary: Phase 4 scoping-and-discovery"
description: "The scoping decision tree, lane resolution, --lane-config parsing, and discover(scope)->artifacts contract, built and manually verified: 3 reference docs plus scripts/scoping.cjs, with real interactive/non-interactive lane-tuple parity evidence."
trigger_phrases:
  - "deep-alignment scoping summary"
  - "phase 004 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/004-scoping-and-discovery"
    last_updated_at: "2026-07-11T14:19:08Z"
    last_updated_by: "claude"
    recent_action: "Independently re-ran the full verification matrix; found phase 005 undisclosed here"
    next_safe_action: "Verify phase 005's complete claim, then begin phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scoping-and-discovery"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-scoping-and-discovery |
| **Status** | In Progress — see Known Limitations for the one deferred follow-up |
| **Completed** | 2026-07-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase built the SCOPE-state engine for `deep-alignment`: the three-axis scoping decision tree, lane resolution (both the interactive path and the non-interactive `--lane-config` path), and the `discover(scope)->artifacts` contract every future authority adapter (phases 005-007) implements identically.

### Scoping Protocol (`references/scoping_protocol.md`)

Documents the ARTIFACT-CLASS x AUTHORITY x SCOPE decision tree: the four artifact classes (`docs`, `code`, `designs`, `git-history`), the four v1 authorities (`sk-doc`, `sk-git`, `sk-design`, `sk-code`) with their per-authority artifact-class validity, the three scope shapes (`paths`, `globs`, `branchRange`), the lane-resolution algorithm (one tree walk expands to one lane per selected authority), the canonical internal lane-tuple representation both paths share, and the ADR-011 fallback rule between the interactive and non-interactive paths.

### Discover Contract (`references/discover_contract.md`)

Documents the `discover(scope) -> artifacts` half of ADR-003's adapter contract: the one-parameter signature, the input shape (a resolved lane's already-validated `scope`), and the output shape (an artifact corpus plus `FILE`-kind coverage-graph seed nodes). Cites the real, current shape of `runtime/scripts/upsert.cjs`'s node-construction logic and `runtime/lib/coverage-graph/coverage-graph-db.ts`'s `CoverageNode`/`NodeKind` types by exact line span, including a worked `upsert.cjs` seeding invocation.

### Lane-Config Schema (`references/lane_config_schema.md`)

Documents the concrete `--lane-config <file.json>` JSON shape ADR-011 left open: a bare top-level array of `{authority, artifactClass, scope}` objects (no envelope or version wrapper), the authority-to-artifact-class validity table, the three `scope` sub-shapes, an informative formal JSON Schema restating the same rules, a worked multi-authority example, and the fail-closed error contract.

### Lane Resolution Script (`scripts/scoping.cjs`)

A real CommonJS module implementing both paths against one shared validation core:

- `validateLane()` / `validateScope()` — the single choke point both paths call; enforces the authority registry, artifact-class validity, and (via `runtime/scripts/lib/cli-guards.cjs`'s `validateNamespaceValue()`) repo-root containment for `paths`/`globs` scope values.
- `resolveLanesFromConfig(config)` — validates a parsed `--lane-config` array into lane tuples.
- `resolveLanesFromSelections(selections)` — validates the interactive path's tree-walk output (`{artifactClass, authorities[], scope}[]`) into the same lane-tuple shape.
- `parseLaneConfigFile(filePath)` — reads and JSON-parses a `--lane-config` file (or `-` for stdin, mirroring `upsert.cjs`'s own stdin convention), then resolves it.
- A CLI entrypoint (`--lane-config <file.json|-> [--json]`) matching this repo's dual CLI/importable script convention (`require.main === module`, `module.exports`), reusing `runtime/scripts/lib/cli-guards.cjs`'s `classifyExitCode()` for exit-code classification (`3` on any input-validation failure, matching `upsert.cjs`'s own convention).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md` | Create | Three-axis decision tree + lane-resolution algorithm |
| `.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md` | Create | `discover(scope)->artifacts` contract, cited against real `upsert.cjs`/`coverage-graph-db.ts` shapes |
| `.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md` | Create | `--lane-config` JSON schema (ADR-011 config-file-only) |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | Create | Lane resolution (both paths) + `--lane-config` parsing, real working CommonJS module |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read `002-architecture-decision/decision-record.md` in full (all 12 ADRs) to ground the contract exactly as locked, `deep-review`'s `upsert.cjs` for the real coverage-graph seeding shape, `coverage-graph-db.ts` for the exact `CoverageNode`/`NodeKind` types, and several sibling mode-local scripts (`deep-review/scripts/reduce-state.cjs`, `deep-ai-council/scripts/orchestrate-session.cjs`, `runtime/scripts/verify-iteration.cjs`, `runtime/scripts/lib/cli-guards.cjs`) to confirm this repo's CommonJS script conventions — including the precedent that mode-local scripts do reach into shared `runtime/scripts/lib/*.cjs` helpers rather than re-implementing them, which is why `scoping.cjs` reuses `cli-guards.cjs`'s `validateNamespaceValue()`/`classifyExitCode()` instead of duplicating path-traversal and exit-code logic.

Wrote the three reference docs first (decision tree, contract, schema), then `scripts/scoping.cjs` against exactly what those docs specify, then manually verified the script end-to-end: CLI invocations against real fixture files (in the scratch directory, not inside `deep-alignment/`) and direct `node -e` module-level calls exercising every exported function.

A self-review pass caught a real comment-hygiene violation before this phase was reported done: the first draft of `scripts/scoping.cjs` embedded ADR and NFR id labels directly in code comments (e.g. "ADR-011: config-file only..."). This repo's comment-hygiene rule forbids ephemeral spec-artifact ids in code comments — they rot as specs get renamed or renumbered. Every flagged comment was rewritten to state the durable WHY inline instead of pointing at an id; re-verified clean by re-grepping the file and re-running the full CLI/module smoke-test suite afterward (all still passed).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `--lane-config` top-level shape is a bare JSON array, not an envelope object with a version field | ADR-011's own reasoning for a file over an inline flag is that the file itself is versionable/diffable/reviewable as a tracked file — a property git already gives it. An internal `schemaVersion` field would be unrequested "for flexibility" structure with no current consumer; simpler matches ADR-011's literal wording ("an array of {authority, artifactClass, scope} objects") most directly. |
| v1 authority-to-artifact-class registry is 1:1, implemented as an extensible map | Matches ADR-004's authority sequencing (each v1 authority owns exactly one artifact-class domain) while keeping the map's shape ready for a future authority to cover more than one class, per ADR-012's registration governance, with zero shape change required. |
| Interactive path is a pure function (`resolveLanesFromSelections`) over structured `{artifactClass, authorities[], scope}` input, not a readline/terminal prompt loop | `deep-alignment`'s `SKILL.md` states the mode is invoked exclusively through `/deep:alignment`'s command workflow — the operator's answers arrive as natural conversation the dispatched agent collects, not terminal input this script would read directly. Building a readline UI here would duplicate a UI surface the command/agent layer already owns, and was not part of the four named deliverables. |
| `scoping.cjs` reuses `runtime/scripts/lib/cli-guards.cjs`'s `validateNamespaceValue()` for NFR-S01 path-traversal validation rather than reimplementing it | Real precedent exists (`deep-review/scripts/reduce-state.cjs` and others already reach into shared `runtime/lib`/`runtime/scripts/lib` helpers from mode-local scripts); duplicating security-sensitive path logic would risk the two copies drifting. |
| No Vitest suite added in this pass | The four named Create targets in `spec.md` §3 are three reference docs and one script — not a test file. Adding one would be a fifth file, outside the explicit scope lock for this pass. Manual CLI + module-level verification was performed instead and is documented below with real command output. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check scripts/scoping.cjs` | PASS — no syntax errors |
| CLI `--help` | PASS — prints usage, exit 0 |
| CLI `--lane-config <valid-3-lane-fixture>` (text and `--json`) | PASS — resolves exactly 3 lanes (`sk-code`/`code`, `sk-git`/`git-history`, `sk-design`/`designs`), exit 0 |
| CLI `--lane-config <empty-array-fixture>` | PASS — resolves 0 lanes (`{"status":"ok","lanes":[]}`), exit 0, not an error |
| CLI `--lane-config <unknown-authority-fixture>` | PASS — exits 3, names the bad value and the full registered set |
| CLI `--lane-config <unsupported-artifactClass-fixture>` (`sk-git` + `docs`) | PASS — exits 3, names both values and the authority's actual supported class |
| CLI `--lane-config <path-traversal-fixture>` (`../../etc/passwd`) | PASS — exits 3, rejected by `validateNamespaceValue()`'s `..`-segment check |
| CLI with no `--lane-config` flag | PASS — exits 3, names `--lane-config` as required, points to the interactive fallback |
| CLI `--lane-config <missing-file>` | PASS — exits 3, names the resolved path and the ENOENT error |
| CLI `--lane-config -` (stdin) | PASS — resolves the same 3 lanes as the file form, exit 0 |
| `resolveLanesFromSelections()` vs `resolveLanesFromConfig()` for equivalent 3-lane input | PASS — `JSON.stringify()` output byte-identical between the two paths |
| `resolveLanesFromSelections([{artifactClass:"docs", authorities:["sk-doc","sk-git"], scope:{...}}])` | PASS — correctly rejects the `sk-git`/`docs` combination inside a multi-authority selection, naming both values |
| `resolveLanesFromSelections([])` / `resolveLanesFromConfig([])` | PASS — both resolve cleanly to `[]`, no error |
| `validate.sh 004-scoping-and-discovery --strict` | PASS — Errors: 0, Warnings: 0 (fixed 2 real findings first: 7 frontmatter_memory_block violations from over-long/narrative continuity fields, and a spec.md/implementation-summary.md Status cross-doc mismatch caused by the word "complete" appearing inside a Status-cell aside) |
| **Independent re-verification (separate review pass)** | **PASS** — `node --check`, `require()`, and the full 11-case CLI matrix above (a superset of the 9 originally listed, adding a malformed-JSON case) were re-run from scratch against fresh fixtures and matched every claim in this table |
| Independent re-run: `resolveLanesFromSelections()` vs `resolveLanesFromConfig()` parity | PASS — re-confirmed byte-identical `JSON.stringify()` output for an equivalent 3-lane input, plus multi-authority-mixed-class rejection, empty-input, and non-array-root cases |
| Independent live cross-phase pipeline test | PASS — fed a real `resolveLanesFromConfig()` lane's `scope` directly into `scripts/adapters/sk-doc.cjs`'s `discover(scope)` (the phase 005 adapter, built concurrently — see Known Limitations item 2). Returned the documented `{artifacts, nodes}` shape end to end with `FILE`-kind nodes, against real files on disk |
| Independent re-run: `validate.sh 004-scoping-and-discovery --strict` | PASS — Errors: 0, Warnings: 0, confirmed independently |
| Independent citation check: `discover_contract.md` §4.2's `upsert.cjs`/`coverage-graph-db.ts` line-span citations | PASS — `upsert.cjs:204` (`kind = String(...)`.toUpperCase()), `:214` (`name = n.name \|\| n.label \|\| n.id`), `:103` (`parseSeedOptions`), `:175-196` (empty-payload rejection), and `coverage-graph-db.ts:22`/`:34` (`FILE` in `ReviewNodeKind`/`ContextNodeKind`) all verified to cite the exact real lines |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No committed Vitest suite for `scripts/scoping.cjs` yet.** This phase's scope names four files — three reference docs and one script — not a test file. All verification above is real but manual (CLI invocations and `node -e` module calls against real fixtures), not a checked-in regression test. A future pass adding `scripts/scoping.test.cjs` (mirroring `deep-research/scripts/reduce-state-sparkline.test.cjs`'s sibling-file convention) is a reasonable, non-blocking follow-up.
2. **T010 (cross-phase `discover()` signature diff) is partially, not fully, complete.** Corrected during independent re-verification: phase 005 (sk-doc adapter) now exists on disk and self-reports complete, built concurrently during this phase's own session window — its `scripts/adapters/sk-doc.cjs` was live cross-checked in this review pass and confirmed to take exactly one `scope` parameter with zero authority-specific parameters, matching `discover_contract.md` §2 exactly. Full closure per §6's own wording ("in phase 005 through phase 010 alike") still needs phases 006/007/010, which do not exist yet — T010 stays `[B]` in `tasks.md` for that reason, not because zero adapters exist to check against.
3. **The v1 authority registry is 1:1 (one authority per artifact-class) by design, not by contract limitation.** `AUTHORITY_ARTIFACT_CLASSES` in `scripts/scoping.cjs` supports an authority covering more than one class, or a class covered by more than one authority, whenever a future authority actually needs that — v1 simply has no such case yet.
4. **`lane_config_schema.md` §6's informative JSON Schema over-claims strictness.** It declares `"additionalProperties": false` for lane objects and each `scope` shape, but `scoping.cjs`'s hand-rolled `validateLane()`/`validateScope()` never check for or reject extra keys — they destructure only the known fields, so an unrecognized property is silently dropped from the normalized lane rather than causing a validation error. Confirmed by direct test: a lane object with an extra `"unexpected-field"` key resolves successfully, minus that key, instead of throwing. Low practical impact (no documented caller adds unknown keys), but the schema doc's specific claim is not literally true of the implementation as built.
5. **Phase 005's own files sit undisclosed inside this phase's scope-locked directories.** `scripts/adapters/sk-doc.cjs`, `references/adapters/sk_doc_adapter.md`, and `references/adapters/sk_doc_known_deviations.md` (phase 005's own declared Files to Change) were created between 15:58 and 16:01 on 2026-07-11 — inside this phase's own final ~12-minute build window (this phase's `scoping.cjs` was last saved 16:02:40) — but are not named anywhere in this phase's `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, or this file. This makes `plan.md`'s Rollback Plan claim ("this phase creates four files... no other production surface was touched") an inaccurate description of the current state of `deep-alignment/references/` and `deep-alignment/scripts/` — those directories hold seven files, not four, by the time this phase's own build finished. The rollback mechanics themselves are unaffected (deleting this phase's 4 named files does not touch phase 005's 3 files), but the "no other production surface" framing should not be read as literally true of the shared directory.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
