---
title: "Implementation Summary: Skill Benchmark Reducers and Projections"
description: "The additive-dark Skill Benchmark ledger now folds through the shared Deep Improvement base into deterministic scenario, evidence, ranking, and mode-status projections."
trigger_phrases:
  - "skill benchmark reducer implementation"
  - "skill benchmark projection contract"
  - "skill benchmark deterministic replay"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-23T13:54:26Z"
    last_updated_by: "codex"
    recent_action: "Made duplicate event conflict classification explicit"
    next_safe_action: "Consume the frozen projection contract from the sealed-artifact sibling"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-reducers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-reducers-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Common events delegate through the frozen deep-improvement-common reducer surface"
      - "Skill events add three namespaced projection families without widening common state"
      - "Raw score observations remain separate from typed normalized rankings"
      - "Hard vetoes dominate weighted aggregates and promotion eligibility"
      - "Replay ordering tracks each stream independently and binds every checkpoint tail"
      - "Same event identities with different canonical bytes raise the named duplicate-event-conflict"
      - "Scenario evidence references are filtered by owning scope before lookup"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-reducers-and-projections |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; legacy Skill Benchmark execution remains unchanged and authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The landed Skill Benchmark event union now replays through one composite reducer. Shared events delegate to `DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH.reducerSurface` and remain under an unchanged `common` projection. Only `skill_benchmark.*` events write the three sibling projection families:

1. **Iteration and convergence** tracks treatment assignments, scenario lifecycle, discovery, load, invocation, trajectory, outcome, raw-score and gold coverage, compatibility, per-stream tails, explicit blockers, hard vetoes, collection completion, scoring completion, and certificate readiness.
2. **Artifact and evidence index** keeps content-addressed design, task, environment, executor, registry, tool, permission, dependency, workload, gold, trajectory, outcome, compatibility, security, raw-observation, and normalized-score references. Raw measurements and derived rankings remain separate arrays.
3. **Per-mode status** derives collection, scoring, compatibility, certificate, blocked, withheld, issued, expired, closed, incomplete, and aborted states from typed events and projection health.

Rankings derive only from the typed common `evaluation_normalized` event. A raw `score_observed` event retains evaluator axes, costs, coverage, gold policy, and the fixed `backend:deep-improvement-score` reference, but cannot create a ranking. Promotion flags require both a typed normalized score and the shared promotion projection. Gold, compatibility, negative-transfer, security, canary, and shared-common vetoes keep rankings ineligible even when the weighted aggregate is `1`.

Replay validates the real landed union registry, canonicalizes caller array order, enforces contiguous sequence baselines independently for every stream, checks the prior-event hash for each stream, and handles byte-identical duplicate events idempotently. Reusing one event identity with different canonical bytes raises the named `duplicate-event-conflict`, while distinct sequence regressions remain `event-order-invalid`. Gaps, phantom producer references, unsupported events, impossible transitions, and forged checkpoint tails also remain fail-closed. Checkpoints bind the complete projection digest to every stream frontier, not one global tail.

Scenario-local producer references are ownership checked before lookup. Outcome, gold, lifecycle, discovery, invocation, milestone, trajectory, compatibility, and security references must resolve inside the referencing scenario, assignment, and execution; score inputs additionally bind the observation identity. The referential audit also binds negative-transfer outcome pairs to their respective assignments, design references to the same benchmark design, and certificate expiry to the same certificate identity. Run-level certificate evidence remains intentionally aggregate across scenarios.

All public projections and comparison views are canonical clones and recursively frozen. The complete shadow-only legacy view embeds the full common legacy projection and the full Skill Benchmark comparison fields; it does not compare a scalar subset.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/skill-benchmark-reducers/skill-benchmark-projection-types.ts` | Created | Closed composite projection, replay, checkpoint, artifact, score, and status types |
| `runtime/lib/skill-benchmark-reducers/skill-benchmark-projection-schema.ts` | Created | Closed field-kind validation, cross-projection referential integrity, and immutable cloning |
| `runtime/lib/skill-benchmark-reducers/skill-benchmark-reducer.ts` | Created | Common delegation, namespaced folds, per-stream replay integrity, veto precedence, rankings, and legacy projection |
| `runtime/lib/skill-benchmark-reducers/index.ts` | Created | Stable `SKILL_BENCHMARK_*` and mode-renamed reducer exports |
| `runtime/tests/unit/skill-benchmark-reducers.vitest.ts` | Created | Real typed-event determinism, duplicate-conflict, idempotency, ordering, gap, phantom-source, tail, unknown-event, score-separation, veto, surface, and parity probes |
| Leaf packet docs | Updated | Completion state, evidence, verification, and generated metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reducer is additive-dark and pure. It performs no filesystem, network, clock, randomness, logging, sealing, certificate construction, authority cutover, or legacy mutation. Verification used the project-pinned Vitest and TypeScript toolchain, purity and comment-hygiene scans, strict packet validation, generated metadata refresh, and a path-filtered status audit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Nest the frozen common projection under `common` | Shared field ownership and replay guarantees remain single-sourced; the Skill Benchmark extension does not widen the base |
| Delegate verified common events through the common reducer surface | Shared event transitions keep the same schema, referential, immutability, and status guarantees as the base |
| Track one source frontier per stream | Independent streams can begin at sequence one without false gaps, while gaps and regressions remain fail-closed |
| Classify event-identity byte conflicts before generic order failures | The named corruption signal stays distinct from a separate event arriving behind a stream frontier |
| Filter referential candidates by owning scope before accepting them | A real event from another scenario must not satisfy a scenario-local outcome, gold, or lifecycle dependency |
| Keep raw measurements and normalized rankings separate | Re-scoring remains auditable and policy changes cannot erase evaluator evidence |
| Derive rankings only from `evaluation_normalized` | Raw score observations cannot silently become a promotion or ranking decision |
| Apply hard vetoes after aggregation | A high weighted score cannot clear gold, compatibility, security, negative-transfer, canary, or shared-common failures |
| Embed the complete common legacy view | Shadow parity compares the full canonical contract rather than a hand-picked scalar subset |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 19 tests |
| Determinism and reordered input | PASS: repeated and reversed caller arrays produce byte-identical frozen results and integrity digests |
| Per-stream ordering | PASS: a missing event returns `cursor-gap`; a distinct event behind that stream's checkpoint tail returns `event-order-invalid` |
| Referential and tail integrity | PASS: phantom and cross-scenario score sources throw `referential-integrity`; the same-scenario positive control projects; a forged stream frontier returns `checkpoint-digest-mismatch` |
| Referential ownership audit | PASS: scenario lifecycle/evidence refs are scoped by scenario, assignment, and execution; score refs also bind observation; negative-transfer pairs, design refs, and certificate expiry bind their owning identities |
| Version and duplicate branches | PASS: all four expected-version mismatches return their typed `rebuild_required` reason; same-id/different-bytes raises `duplicate-event-conflict`; same-id/same-bytes is idempotent |
| Unknown extension event | PASS: the real fold rejects an unregistered event with `event-schema-invalid` |
| Score separation and veto precedence | PASS: raw measurements contain no aggregate/rank; normalized ranking derives from the typed common score event; a perfect aggregate remains blocked by incompatibility |
| Mode contract | PASS: a real `VerifiedLedgerEvent` produces the same canonical state through `reduceSkillBenchmarkVerifiedEvent` and the full-fold oracle |
| Complete legacy parity | PASS: the full frozen legacy structure embeds the complete common legacy projection |
| Real substrate | PASS: `substrateImportsReal: true`; the module imports the landed Skill Benchmark ledger schema, real event registry/codec, common projection types, common fold branch, and common reducer surface |
| Runtime TypeScript project | Scoped PASS: whole-runtime TypeScript reaches unrelated `model-benchmark-reducers` errors after suppressing the TypeScript 6 deprecation gate; own-module and own-test error lines 0 |
| Purity and comment hygiene | PASS: no filesystem, network, clock, randomness, logging, or ephemeral artifact-label comments in the new module |
| Strict spec validation | PASS: exit 0, 0 errors, 0 warnings after description and graph-metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No sealed artifact construction.** Certificate events update diagnostic status only. The next sibling owns sealed certificate material.
2. **No authority cutover.** The module is a shadow-only read model and changes no mode gate, legacy writer, promotion authority, or rollback path.
3. **No report rendering.** The projection exposes typed data and canonical comparison views only; presentation remains outside this reducer leaf.
4. **No cross-run aggregation.** One projection is bound to one run and lineage identity. Fleet-level benchmark aggregation remains a separate consumer.
<!-- /ANCHOR:limitations -->
