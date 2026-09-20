---
title: "Implementation Plan: Phase 4: scoping-and-discovery"
description: "The ARTIFACT-CLASS x AUTHORITY x SCOPE decision tree, N-lane resolution, the non-interactive arg form, and the authority-agnostic discover(scope)->artifacts contract -- specified and built, with real interactive/non-interactive parity evidence."
trigger_phrases:
  - "deep-alignment scoping plan"
  - "alignment lane resolution plan"
  - "alignment discover contract plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/004-scoping-and-discovery"
    last_updated_at: "2026-07-11T14:19:08Z"
    last_updated_by: "claude"
    recent_action: "Independently re-ran the full CLI matrix and validate.sh --strict, all matched"
    next_safe_action: "Verify phase 005's complete claim, then begin phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scoping-and-discovery"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "003-scaffold-mode-packet's directory skeleton confirmed on disk before this phase's files were added: assets/, references/, changelog/, behavior_benchmark/ all present under deep-alignment/"
      - "002-architecture-decision confirmed Accepted (all 12 ADRs) before this phase's discover() half was finalized"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: scoping-and-discovery

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill markdown (interactive question protocol), CommonJS scripts (non-interactive arg parsing) |
| **Framework** | `system-deep-loop` runtime state machine (INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> optional REMEDIATE) |
| **Storage** | `deep-alignment/references/scoping_protocol.md`, `discover_contract.md`, `lane_config_schema.md`, and `deep-alignment/scripts/scoping.cjs` — all built |
| **Testing** | `validate.sh --strict` on this phase folder's docs; manual CLI + `require()`-level module verification of `scoping.cjs` (documented in `implementation-summary.md`). No committed Vitest suite yet — see Known Limitations. |

### Overview
This phase specifies AND builds the SCOPE state and the input half of the DISCOVER state for `deep-alignment`. It designs and implements a structured three-axis decision tree (ARTIFACT-CLASS, AUTHORITY, SCOPE) that resolves to N alignment lanes, a non-interactive argument form that produces the same lane shape for headless/cron runs, and an authority-agnostic `discover(scope)->artifacts` contract every adapter phase (005-007) implements identically. Both the interactive-path resolver and the `--lane-config` parser funnel through one shared validation core in `scripts/scoping.cjs`, verified by direct comparison to produce byte-identical lane tuples for equivalent input.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 003-scaffold-mode-packet's directory-skeleton is available — confirmed on disk (`assets/`, `references/`, `changelog/`, `behavior_benchmark/` under `deep-alignment/`) before this phase's files were added.
- [x] The locked pluggable adapter contract (`{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }`) was re-read from 002-architecture-decision (all 12 ADRs, Accepted) before drafting the `discover()` half.

### Definition of Done
- [x] The three-axis decision tree, lane-resolution algorithm, non-interactive arg form, and `discover()` contract are each specified with no adapter-specific logic leaking into the contract — see `references/scoping_protocol.md`, `references/discover_contract.md`.
- [x] The `--lane-config <file.json>` schema (ADR-011 LOCKED to config-file-only) is designed alongside the interactive tree, with both paths resolving to the same internal lane-tuple representation — see `references/lane_config_schema.md`; parity confirmed by a real `JSON.stringify` equality test in `implementation-summary.md`.
- [ ] `validate.sh` passes `--strict` with Errors:0 on this phase folder — run after this documentation pass; see `implementation-summary.md` Verification for the actual result.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Structured decision tree feeding a lane-resolution function, which feeds N calls to an authority-agnostic `discover()` contract. No free-text scoping is planned — the design brief explicitly locks a decision tree over free text because ambiguous scoping would make lane resolution non-reproducible for cron runs.

### Key Components (built and manually verified 2026-07-11)

**Scoping decision tree** (`references/scoping_protocol.md`):
1. **ARTIFACT-CLASS** — one of `docs`, `code`, `designs`, `git-history`. Determines which authorities are even offered next (e.g. `git-history` only offers `sk-git`).
2. **AUTHORITY** — one or more of `sk-doc`, `sk-git`, `sk-design`, `sk-code`, presented as a multi-select so a single run can combine authorities (the operator precedent: "sk-code and sk-git and/or sk-design" in one pass). The set is explicitly extensible — new authorities register without changing the tree's shape, only its offered options. Built as an `AUTHORITY_ARTIFACT_CLASSES` map in `scripts/scoping.cjs`; v1 registers each authority against exactly one artifact-class (1:1), while the map's shape supports many-to-many for a later authority.

**Lane resolution**: the tree's answers cross-product into N lanes, one per `(authority, artifact-class, scope)` combination the operator actually selected — not a full cross-product of every possible combination. Each lane is an independent unit for DISCOVER and ITERATE. Implemented as `resolveLanesFromSelections()` in `scripts/scoping.cjs`, verified against a real 3-lane, 3-authority selections input.

**Non-interactive arg form (ADR-011, LOCKED: config-file-only)**: lanes are passed via a single `--lane-config <file.json>` flag — a bare JSON array of `{authority, artifactClass, scope}` objects, one per lane, validated against the same three-axis rules the interactive tree enforces — that resolves to the identical internal lane-tuple representation the interactive path produces. Not repeated `--lane` flags, not an inline `--lanes` JSON-array flag: ADR-011 rejected both in favor of a versionable, reviewable file, since headless/cron is the primary use case. When `--lane-config` is present, the interactive question is skipped entirely; when absent, the interactive question is the only path. The two never run together and neither is silently skipped when required. Implemented as `resolveLanesFromConfig()` / `parseLaneConfigFile()` plus a CLI entrypoint in `scripts/scoping.cjs`.

**`discover(scope) -> artifacts` contract** (`references/discover_contract.md`):
- **Input**: one resolved lane's `scope` value (paths/globs/branch-range), already validated against the repo root.
- **Output**: a corpus of artifact references (file paths or path+ref pairs for git-history scopes) plus seed FILE nodes, in the shape the coverage graph's `upsert.cjs` (`.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs`) already consumes for deep-review — cited precisely by line span (`upsert.cjs:204-238`, `coverage-graph-db.ts:19-93`) in `references/discover_contract.md` §4.2, not an assumed shape.
- **Guarantee**: the contract signature carries no authority-specific parameters or branching; an adapter registering a fifth authority implements the same three-function shape without any engine change.

### Data Flow
Operator (or cron config) -> SCOPE state (interactive question OR non-interactive args) -> lane list -> DISCOVER state calls `adapter[authority].discover(lane.scope)` once per lane -> artifact corpus + seed FILE nodes -> coverage graph (`upsert.cjs`) -> ITERATE state (phase 008).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase is not a bug fix. It produces the SCOPE-state engine — three reference docs and one script — scoped entirely to `.opencode/skills/system-deep-loop/deep-alignment/references/` and `.opencode/skills/system-deep-loop/deep-alignment/scripts/`, plus this spec folder's own docs. No other production surface was touched (mode-registry.json, hub-router.json, SKILL.md, and every sibling phase folder are explicitly out of this phase's scope lock).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read 003-scaffold-mode-packet's plan.md for the directory-skeleton shape this phase's files live in.
- [x] Re-read the locked pluggable adapter contract from 002-architecture-decision (all 12 ADRs, Accepted).
- [x] Read `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` for the coverage-graph seeding shape `discover()` output must match.

### Phase 2: Core Implementation (executed 2026-07-11)
- [x] Author `deep-alignment/references/scoping_protocol.md` with the three-axis decision tree and lane-resolution algorithm.
- [x] Author `deep-alignment/references/discover_contract.md` with the authority-agnostic `discover(scope)->artifacts` signature and output shape.
- [x] Implement the lane-resolution script (interactive path) — `resolveLanesFromSelections()` in `scripts/scoping.cjs`.
- [x] Design the `--lane-config` JSON schema (per ADR-011's LOCKED config-file-only decision) and implement the non-interactive parser — `references/lane_config_schema.md`, `resolveLanesFromConfig()`/`parseLaneConfigFile()` in `scripts/scoping.cjs`, converging on the same internal lane-tuple representation as the interactive path.

### Phase 3: Verification (executed 2026-07-11)
- [x] Confirm a multi-authority single-run scoping session resolves N independent lanes with no cross-authority coupling. **Evidence**: a real `--lane-config` run and an equivalent `resolveLanesFromSelections()` call each resolved 3 independent lanes (`sk-code`/`code`, `sk-git`/`git-history`, `sk-design`/`designs`).
- [x] Confirm the non-interactive arg parser and the interactive question produce byte-identical lane tuples for an equivalent scope. **Evidence**: `JSON.stringify(resolveLanesFromSelections(selections)) === JSON.stringify(resolveLanesFromConfig(config))` evaluated `true` for the equivalent 3-lane input (see `implementation-summary.md`).
- [ ] Confirm the `discover()` contract carries no authority-specific parameters, verified by diffing the planned signature against every adapter phase's stated usage. **Deferred**: no adapter phase (005-007) exists yet to diff against. `references/discover_contract.md` §2 confirms by inspection that the signature itself carries zero authority-specific parameters; the cross-phase diff is a phase-005+-time check, not one this phase can perform in isolation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Result |
|-----------|-------|-------|--------|
| Planning + doc | This phase's own spec-folder documents | `validate.sh --strict` | See `implementation-summary.md` Verification |
| Manual functional | `scripts/scoping.cjs` CLI (`--help`, valid/empty/malformed configs, missing file, stdin `-`) | Direct `node` invocation | PASS — all 9 CLI cases behaved as documented, see `implementation-summary.md` |
| Manual integration | Interactive-path vs non-interactive-path lane-tuple equivalence | `node -e` module-level comparison | PASS — byte-identical `JSON.stringify` output for equivalent 3-lane input |
| Deferred unit | `scripts/scoping.cjs`'s exported functions as a committed regression suite | Vitest | Not yet built — this phase's scope names 4 files (3 docs + 1 script), not a test file; adding Vitest coverage is a follow-up, not a blocker for phase 005 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-scaffold-mode-packet | Internal | Complete (directory skeleton confirmed on disk) | N/A — dependency satisfied |
| 002-architecture-decision (adapter contract freeze, ADR-003; lane-arg schema, ADR-011) | Internal | Accepted (all 12 ADRs, operator-approved 2026-07-11) | N/A — dependency satisfied; `discover()` contract and `--lane-config` schema both built against the final, locked decisions |
| `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Internal | Green | Without it, the discovered-artifact seeding plan would have no real target shape to match — now cited precisely by line span |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: 002-architecture-decision changes the adapter contract shape or drops the multi-authority-per-run requirement.
- **Procedure**: Revise this phase's spec.md/plan.md/tasks.md/checklist.md to match the new contract, then delete or rewrite the four built files (`references/scoping_protocol.md`, `references/discover_contract.md`, `references/lane_config_schema.md`, `scripts/scoping.cjs`) to match. Deleting exactly those four files does not touch phase 005's own three files (`references/adapters/sk_doc_adapter.md`, `references/adapters/sk_doc_known_deviations.md`, `scripts/adapters/sk-doc.cjs`), which now live in the same `deep-alignment/references/` and `deep-alignment/scripts/` directories — phase 005 was built concurrently during this phase's session and exists on disk (see `implementation-summary.md` Known Limitations item 5). A contract-shape change would still require revising phase 005's `discover()` in step with this phase's own rollback, since phase 005 already depends on the exact shape this phase locks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
003 (Scaffold) ──────► 004 (Scoping + Discovery) ──────► 005 (sk-doc adapter)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 003-scaffold-mode-packet | 002-architecture-decision | 004 |
| 004-scoping-and-discovery | 003-scaffold-mode-packet | 005, 006, 007 |
| 005-adapter-sk-doc | 004-scoping-and-discovery | 008 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort | Actual |
|-------|------------|------------------|--------|
| Setup | Low | Read three existing files | Matched estimate |
| Core Implementation | Medium | Two reference docs plus a lane-resolution script | Matched estimate — 3 reference docs (scoping_protocol, discover_contract, lane_config_schema) plus scoping.cjs |
| Verification | Low | Manual comparison run, no new infra | Matched estimate — CLI + module-level manual verification, no Vitest infra added |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] N/A — this phase ships reference documentation and a lane-resolution script, not a deployed service.

### Rollback Procedure
1. This phase creates four files, all scoped under `deep-alignment/references/` and `deep-alignment/scripts/`. Rollback is `git revert`/`git rm` on exactly those four paths plus this spec folder's docs. Correction from independent re-verification: those two directories are not exclusively this phase's — phase 005's own three files (`references/adapters/sk_doc_adapter.md`, `references/adapters/sk_doc_known_deviations.md`, `scripts/adapters/sk-doc.cjs`) were built concurrently during this phase's own session and live in the same directories. Rolling back exactly this phase's four named paths still leaves phase 005's three files untouched and correct — but "no other production surface was touched" should not be read as a description of the current directory contents.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
