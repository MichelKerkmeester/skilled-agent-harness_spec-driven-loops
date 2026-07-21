---
title: "Feature Specification: Durable Archiving & Serving-Snapshot"
description: "Plan the durable <hub>/benchmark/compiled-routing/<run-label>/ report-path convention (fail-closed on an existing label), a serving-snapshot.json schema plus renderer under create-benchmark, repo-relative portable provenance, and an append-only flip-history.jsonl — archived only against the active 010 serving manifests, never a 006 shadow candidate, and never repurposing the frozen baseline label."
trigger_phrases:
  - "durable archiving serving snapshot"
  - "compiled routing report path convention"
  - "serving snapshot schema renderer"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Durable Archiving & Serving-Snapshot

## EXECUTIVE SUMMARY

Compiled-routing evidence today has no durable home and no joined view. Lane C's live executor writes only to whatever `--outputs-dir` the caller passes (`run-skill-benchmark.cjs:295-298`); a LUNA real-model run either pollutes the parity directory or vanishes once its temp output is discarded (`CF-ARC-1`). Per-hub activation state is split across seven separate JSON files under `010-live-activation/activation/<hub>/` (confirmed this session: `manifest.json`, `manifest.prior.json`, `manifest.candidate.json`, `manifest.serving-prior.json`, `fence-state.json`, `activation-record.json`, `serving-flip-record.json`) with no single joined artifact (`CF-ARC-2`). And shipped reports already serialize a stale absolute worktree path — `sk-code/benchmark/router-final/skill-benchmark-report.json:7-10` points at a checkout path that no longer matches where the file actually lives, a live demonstration of the exact staleness `CF-ARC-3` describes (CONFIRMED, `verification-v1.md` §2).

This phase plans a durable report-path convention (`<hub>/benchmark/compiled-routing/<run-label>/`, fail-closed on an existing label), a `serving-snapshot.json` schema joining manifest + fence + flag + freshness + parity into one artifact plus a renderer under `sk-doc:create-benchmark`, repo-relative portable provenance replacing the absolute-path fields, and an append-only `flip-history.jsonl`. Every archive is generated against the **active** `010-live-activation/activation/<hub>/manifest.json`, never a `006-parent-hub-rollout` shadow candidate, and the existing frozen `baseline` label is never repurposed — new immutable siblings follow the same naming family already in use (`sk-code/benchmark/` already contains `baseline`, `router-baseline`, `router-final`, `live-final`, confirming `router-compiled-parity-baseline`/`router-compiled-parity-final` fits the existing convention without colliding with it).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Implemented |
| **Created** | 2026-07-20 |
| **Branch** | `sk-doc/0089-default-routing-cutover` |
| **Phase** | 007-durable-archiving-and-serving-snapshot (015 child; contributes to the P3 coverage-closure join gate ahead of P4) |
| **Depends on** | `../002-runtime-promotion-and-status-foundation/` (durable status-probe fields), `../004-benchmark-compiled-lane-c/` (the `compiledRoute` parity JSON this packet archives) |
| **Consumed research** | `../001-research/synthesis-v1.md` §2.5 (`CF-ARC-1..5`), `../001-research/review-v1.md` §4 row `007-durable-archiving-and-serving-snapshot` |
| **Blast radius** | Documentation + non-frozen orchestrator/renderer additions — new archive directories and a `report.compiledRouting` render block; the frozen scorer trio is never touched, and archiving is additive (never overwrites an existing run-label) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Confirmed Current State

`run-skill-benchmark.cjs:295-298` writes reports only to the caller-supplied `--outputs-dir`; there is no named, durable, fail-closed convention analogous to the existing `router-final/`/`live-final/` directories a hub already uses for its non-compiled benchmark history (confirmed via direct listing: `sk-code/benchmark/` contains `full`, `d4r-live`, `live-final`, `router-final`, `baseline`, `live`, `fixtures`, `live-remediated`, `after`, `router-baseline`, `live-mode-b` — an established multi-label archive pattern with no compiled-routing sibling yet). `010-live-activation/activation/<hub>/` holds seven distinct JSON files per hub (confirmed via listing) with no single artifact joining `servingAuthority`, `fencingEpoch`, the flag state, and the last parity result. `sk-code/benchmark/router-final/skill-benchmark-report.json:7-10` currently serializes an absolute `root` field pointing at the primary checkout, even though the file being read lives inside `.worktrees/0089-sk-doc-default-routing-cutover/...` — CONFIRMED live proof of `CF-ARC-3`'s staleness claim (`verification-v1.md` §2).

`build-report.cjs` (`system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs`) is the existing non-frozen renderer that owns report JSON→Markdown rendering — the correct, safe extension point for a `report.compiledRouting` block (`CF-ARC-4`, `CF-BM-6`), consistent with the frozen-file boundary already established for `CF-BM-4` in `../001-research/verification-v1.md` §3.1.

### Problem Statement

Compiled-routing evidence is neither durable, joined, portable, nor safely archived: a run can silently overwrite or vanish, no single artifact answers "what is this hub's compiled-routing state right now," reports carry a stale absolute path the moment they are copied anywhere else, and nothing stops a future archive run from being generated against a `006` shadow candidate instead of the actually-serving `010` manifest — which would archive a decision that was never live.

### Purpose

Define a durable, fail-closed report-path convention and a joined `serving-snapshot.json` artifact with a renderer, replace absolute-path provenance with repo-relative portable provenance, add an append-only transition log, and hard-gate every archive against the active serving manifest — so compiled-routing evidence survives a run, joins into one readable snapshot, stays valid outside the machine that produced it, and can never silently attribute a shadow candidate's state to production.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The durable report-path convention: `<hub>/benchmark/compiled-routing/<run-label>/{skill-benchmark-report.json,skill-benchmark-report.md}`, fail-closed (non-zero exit, no partial write) when the target run-label directory or report pair already exists (`CF-ARC-1`).
- The `serving-snapshot.json` schema — `{hubId, capturedAt, flag, manifest: {selectedPolicyHash, generation, fenceEpoch, servingAuthority, shadowOnly}, liveConfigHash, freshness, engineResolverPath, parityBaseline, realModelLast}` — plus a renderer under `sk-doc:create-benchmark` (`CF-ARC-2`).
- Embedding compiled-routing parity in the canonical Lane C report pair via `report.compiledRouting`, rendered by the existing non-frozen `build-report.cjs`; archiving it as immutable `router-compiled-parity-baseline`/`router-compiled-parity-final` siblings, following the existing `sk-code/benchmark/` naming family (`CF-ARC-4`).
- Hard-gating every archive against the **active** `010-live-activation/activation/<hub>/manifest.json`; a mid-run change in the referenced manifest's digest aborts the archive rather than silently completing it (`CF-ARC-4`).
- Repo-relative portable provenance (`rootRel` + immutable source/input digests) replacing the absolute worktree-root path currently serialized (`CF-ARC-3`).
- An append-only `flip-history.jsonl` per hub recording every serving-authority transition (`CF-ARC-5`).
- Persisting a full execution-context block (executor, exact model + variant, CLI version, flag state, runtime digest, manifest digest, scenario IDs, run revision) on every archived artifact (`CF-ARC-5`).
- Updating all seven hub `benchmark/README.md` index files with the new convention.

### Out of Scope

- The `compiled-routing-parity.cjs` harness itself and its verdict sub-state — owned by `../004-benchmark-compiled-lane-c/`; this packet consumes its output read-only and archives it.
- Editing any of the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) — [why] hard constraint restated at every gate in this program; a required scorer edit is a migration failure, never a license to edit it.
- Editing or repurposing the existing frozen `baseline` label under any hub's `benchmark/` tree — [why] `CF-ARC-4` explicitly forbids repurposing it; new labels are additive siblings.
- Archiving against a `006-parent-hub-rollout` shadow candidate manifest — [why] that manifest was never live; archiving it as if it were the serving decision would misattribute state.
- Any live routing, router, engine, or activation-manifest mutation — [why] this packet only reads and archives; `../010-rollback-audit-and-non-hub-policy/` owns activation-manifest mutation mechanics.
- The P4 hub-by-hub cutover itself — owned by `../011-activation-cutover-p4/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `<hub>/benchmark/compiled-routing/<run-label>/{skill-benchmark-report.json,skill-benchmark-report.md}` (convention, all 7 hubs) | Create (convention) | Durable report-path convention; fail-closed on an existing label |
| `<hub>/benchmark/README.md` (7 hubs) | Modify | Add the compiled-routing index row/convention |
| `sk-doc/create-benchmark/references/skill-benchmark/serving-snapshot-schema.md` (planned name) | Create | Canonical `serving-snapshot.json` schema documentation |
| `sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs` (planned name) | Create | Renderer under `create-benchmark`, producing the human-readable snapshot view |
| `system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | Modify | Add the `report.compiledRouting` JSON→Markdown render block (non-frozen orchestrator) |
| `sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md` | Modify | Document repo-relative `rootRel` provenance and the new `router-compiled-parity-baseline`/`-final` labels |
| `<hub>/benchmark/compiled-routing/flip-history.jsonl` (per hub, all 7) | Deferred | Append-only transition log — ownership moved to `../010-rollback-audit-and-non-hub-policy/`, which ships the ledger + drivers; see REQ-006 |

> Implemented: the fail-closed report-path convention (`scripts/archive-compiled-routing.cjs`), the `serving-snapshot.json` schema + renderer (`scripts/render-serving-snapshot.cjs` + `serving-snapshot-schema.md`), the `report.compiledRouting` + Provenance render blocks in the non-frozen `build-report.cjs`, repo-relative provenance, and the 7 hub `benchmark/README.md` updates all shipped and were verified. The `flip-history.jsonl` row (REQ-006) is owned by `../010-rollback-audit-and-non-hub-policy/` and is not re-implemented here.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ship the durable report-path convention as the sibling of `router-final/`/`live-final/`. | `<hub>/benchmark/compiled-routing/<run-label>/{skill-benchmark-report.json,skill-benchmark-report.md}` is defined and documented per hub; a run targeting an already-existing `<run-label>` directory or report pair fails closed (non-zero exit, no partial write, no silent overwrite). |
| REQ-002 | Define and ship the `serving-snapshot.json` schema plus a renderer. | The schema carries exactly `{hubId, capturedAt, flag, manifest: {selectedPolicyHash, generation, fenceEpoch, servingAuthority, shadowOnly}, liveConfigHash, freshness, engineResolverPath, parityBaseline, realModelLast}`; a renderer under `sk-doc:create-benchmark` produces a human-readable view from the same JSON. |
| REQ-003 | Embed compiled-routing parity in the canonical Lane C report pair; never repurpose `baseline`. | `report.compiledRouting` is rendered via the existing non-frozen `build-report.cjs`; archived copies use new, immutable `router-compiled-parity-baseline`/`router-compiled-parity-final` siblings; the existing `baseline` directory/label under any hub is never written to by this packet. |
| REQ-004 | Archive only against the active serving manifest. | Every archive step reads `010-live-activation/activation/<hub>/manifest.json` (never a `006-parent-hub-rollout` shadow candidate); if the referenced manifest's digest changes between snapshot-start and archive-commit, the run aborts rather than completing with mismatched state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Replace absolute-path provenance with repo-relative portable provenance. | Every new/archived report carries a `rootRel` field (repo-relative) plus immutable source/input digests instead of (or alongside, during transition) the absolute `root` field; provenance validation accepts the relative form. |
| REQ-006 | Ship an append-only `flip-history.jsonl` per hub. | Every serving-authority transition is appended, never overwritten; the file is readable as newline-delimited JSON and its entry count only grows across runs. |
| REQ-007 | Persist a full execution-context block on every archived artifact. | Each archived report/snapshot records executor, exact model + variant, CLI version, flag state, runtime digest, manifest digest, scenario IDs, and run revision — enough to prove which subject and which serving generation produced it. |
| REQ-008 | Update all 7 hub `benchmark/README.md` index files. | Each hub's `benchmark/README.md` gains a row documenting the `compiled-routing/<run-label>/` convention alongside its existing archive-directory rows. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A run targeting an existing `<run-label>` fails closed with no partial write and no silent overwrite.
- **SC-002**: `serving-snapshot.json` joins manifest + fence + flag + freshness + parity into exactly one artifact per hub, with a renderer producing a readable view from the same source.
- **SC-003**: The existing `baseline` label is never written to by this packet; compiled-routing parity lives in its own immutable sibling labels.
- **SC-004**: Every archive is traceable to the active `010` manifest at capture time; a mid-run manifest-digest change aborts rather than silently completing.
- **SC-005**: A report or snapshot copied outside the machine that produced it remains valid (no absolute-path dependency) via `rootRel` + digests.
- **SC-006**: `flip-history.jsonl` entry count only grows; no historical transition is ever overwritten.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../002-runtime-promotion-and-status-foundation/` (durable status-probe fields) | `serving-snapshot.json`'s `freshness`/`engineResolverPath` fields need a stable source | Sequence snapshot-schema authoring after 002's promotion lands |
| Dependency | `../004-benchmark-compiled-lane-c/` (`compiledRoute` parity JSON) | Nothing to archive under `report.compiledRouting` without it | This packet's REQ-003 consumes 004's output read-only; no independent parity computation is introduced here |
| Risk | Archiving against a `006` shadow candidate by mistake | Would misattribute a never-live decision as the serving state | REQ-004 hard-gates the manifest source and aborts on drift |
| Risk | A future run repurposes the frozen `baseline` label for convenience | Breaks the existing baseline's meaning across every consumer that reads it | REQ-003 states the prohibition explicitly; new labels are always additive siblings, never in-place renames |
| Risk | Fail-closed convention rejected as too strict during real operation | Operators may want to intentionally re-run a label | The convention is fail-closed by default; an explicit, separate re-mint path (if ever needed) is out of scope here and would be its own decision |
| Risk | `flip-history.jsonl` grows unbounded over the program's lifetime | Storage growth, though append-only JSONL is small per entry | Out of scope to add retention/rotation here; flagged as a future operational concern, not a blocker |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Durability
- **NFR-D01**: A report-path convention write either fully succeeds or fully fails; no partial `<run-label>/` directory is left behind on a fail-closed abort.
- **NFR-D02**: `flip-history.jsonl` is append-only; no code path in this packet's scope opens it for truncation or in-place rewrite.

### Portability
- **NFR-P01**: Every new archived artifact resolves correctly when copied to a different machine or worktree path, via `rootRel` + digests rather than an absolute path.

### Traceability
- **NFR-T01**: Every archived artifact's execution-context block is sufficient to reproduce which model/variant/executor/manifest generation produced it, without consulting external state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Fail-closed convention
- Target `<run-label>` directory exists but is empty: still treated as existing — fail closed, never silently adopted.
- Target `<run-label>` directory exists with a partial/corrupt prior write (e.g., only the `.json` half of the pair): fail closed; manual cleanup is an operator decision, not an automatic overwrite.

### Manifest source integrity
- The active `010` manifest is mid-flip when a snapshot starts: the snapshot captures a consistent single read; if the manifest changes again before archive-commit, the run aborts (REQ-004).
- No `010` manifest exists yet for a hub (pre-activation): snapshot reports an explicit "no active manifest" state rather than fabricating one.

### Provenance transition
- An older report still carries only the absolute `root` field: this packet does not retroactively rewrite historical reports; only newly-archived reports gain `rootRel`.

### Append-only integrity
- A crash mid-append to `flip-history.jsonl`: the last line may be incomplete; readers must tolerate a trailing partial line without treating the whole file as corrupt.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | A path convention, a schema + renderer, one orchestrator render-block addition, provenance rework, and 7 README updates |
| Risk | 11/25 | Additive and reversible, but archiving the wrong manifest or repurposing `baseline` would be a real correctness/trust failure if the gates were skipped |
| Research | 8/20 | Mechanism is fully specified in `synthesis-v1.md` §2.5; residual work is schema/renderer authoring detail |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `serving-snapshot.json` be captured on every Lane C run, or only at explicit archive points (e.g., a P4 per-hub cutover step)? `synthesis-v1.md` §2.5 mentions "optionally a session-start `mk-compiled-routing-snapshot.js` plugin" without settling the trigger.
- Exact renderer output location under `create-benchmark` (script name and whether it emits Markdown, JSON-to-JSON normalization, or both) — this packet names the schema and the render obligation; the concrete script path is a build-time detail.
- Retention policy for `flip-history.jsonl` (append-only forever vs. a future rotation/archival step) is explicitly out of scope here and flagged as a follow-on operational question.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Upstream research**: `../001-research/synthesis-v1.md` §2.5 (`CF-ARC-1..5`), `../001-research/review-v1.md` §4 (row `007-durable-archiving-and-serving-snapshot`)
- **Dependencies**: `../002-runtime-promotion-and-status-foundation/`, `../004-benchmark-compiled-lane-c/`
- **Master plan (phase map + shared gate model)**: `../spec.md`
- **Storage conventions**: `.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md`
