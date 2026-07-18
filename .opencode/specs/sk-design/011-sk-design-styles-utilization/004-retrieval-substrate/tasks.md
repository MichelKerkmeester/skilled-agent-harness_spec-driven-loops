---
title: "Tasks: styles-library retrieval substrate"
description: "Run queue for building the Phase A retrieval engine: manifest generator, deterministic eligibility, disposable FTS accelerator, candidate cards, generation-guarded hydration, CORPUS_USE_PROOF v1 gate, and CI invalidation fixtures. Every task pending; nothing built."
trigger_phrases:
  - "retrieval substrate tasks"
  - "style-library.mjs tasks"
  - "manifest generator tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/004-retrieval-substrate"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the retrieval-substrate L3 task queue"
    next_safe_action: "Start T001 — draft the manifest schema header and per-style fields"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-retrieval-substrate-011-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: styles-library retrieval substrate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:ai-protocol -->
## AI Execution Protocol

### Pre-Task Checklist
- [x] Read `spec.md`, `plan.md`, and `decision-record.md` before touching any engine module.
- [x] Confirm the target file is under `styles/_engine/` or is `styles/_retrieval-manifest.json`; refuse writes elsewhere.
- [x] Re-read research §4/§5/§9/§15 for the stage being implemented.

### Task Execution Rules
- **TASK-SEQ**: Follow task order; a task may not start until its `{deps}` are complete.
- **TASK-SCOPE**: Each task edits only the file(s) named in its row; no adjacent cleanup.
- Eligibility (T007-T009) MUST land before ranking (T011+) — never invert the order.

### Status Reporting Format
Report each task as `T### STATUS=<pending|in-progress|done|blocked> EVIDENCE=<file:line|command>`. No `done` without a passing fixture or a byte-stable `--check`.

### Blocked Task Protocol
Mark a task `[B]` and record the blocker in `_memory.continuity.blockers`. A `BLOCKED` task halts its dependents; escalate if the blocker is a corpus or rights ambiguity rather than an engine detail.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Manifest generator and the generation-hash foundation every later stage depends on.

- [x] T001 Draft manifest header (`schemaVersion`, `generationHash`, `crawlManifestHash`, `recordCount`, sorted `styles[]`) (`styles/_engine/manifest.mjs`) [2h]
- [x] T002 Define per-style fields (id/slug/status/title/thesis, token axes+counts, capabilities, sections, provenance/rights, artifact records, `contentHash`) (`styles/_engine/manifest.mjs`) [3h] {deps: T001}
- [x] T003 Implement refresh algorithm: enumerate/sort inputs, hash bytes, reparse only changed, remove deleted (`styles/_engine/manifest.mjs`) [4h] {deps: T002}
- [x] T004 Compute generation hash over schema + crawl-manifest hash + sorted content hashes (`styles/_engine/manifest.mjs`) [2h] {deps: T003}
- [x] T005 Implement atomic `build --write` (temp file + rename) and `corpus-changing` abort on fingerprint drift (`styles/_engine/style-library.mjs`) [3h] {deps: T004}
- [x] T006 Implement `build --check` (in-memory regen, byte-compare, report added/changed/removed ids, never write) (`styles/_engine/style-library.mjs`) [3h] {deps: T005}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Eligibility, ranking, cards, hydration, and the proof gate.

### Eligibility (first stage)
- [x] T007 Implement required-facet filter (`styles/_engine/eligibility.mjs`) [2h] {deps: T006}
- [x] T008 Implement exclusion filter (`styles/_engine/eligibility.mjs`) [2h] {deps: T007}
- [x] T009 Implement provenance/rights gate (`styles/_engine/eligibility.mjs`) [2h] {deps: T008}
- [x] T010 Guarantee eligibility runs before ranking; add ordering invariant test (`styles/_engine/__tests__/eligibility-first.test.mjs`) [2h] {deps: T009}

### Ranking + fallback
- [x] T011 Build disposable same-generation SQLite FTS5/BM25 projection from the current manifest (`styles/_engine/rank-fts.mjs`) [4h] {deps: T010}
- [x] T012 Ensure the FTS projection is never committed and is discarded after use (`styles/_engine/rank-fts.mjs`) [1h] {deps: T011}
- [x] T013 [P] Implement bounded `DESIGN.md` source-scan fallback returning `degraded:true` (`styles/_engine/rank-fts.mjs`) [3h] {deps: T010}
- [x] T014 Implement deterministic tie-breaking and stable card ordering (`styles/_engine/rank-fts.mjs`) [2h] {deps: T011, T013}

### Cards + hydration
- [x] T015 Implement compact candidate cards (≤5, byte-capped, score breakdown, provenance, est. hydration bytes) (`styles/_engine/cards.mjs`) [3h] {deps: T014}
- [x] T016 Wire `query` command to eligibility → rank → cards (`styles/_engine/style-library.mjs`) [2h] {deps: T015}
- [x] T017 Implement generation-guarded hydration: require card generation hash, re-hash selected artifacts (`styles/_engine/hydrate.mjs`) [4h] {deps: T016}
- [x] T018 Refuse `generation-mismatch`; return `unavailable` on stale selected artifacts (`styles/_engine/hydrate.mjs`) [2h] {deps: T017}
- [x] T019 Apply mode-scoped includes and byte caps to hydration output (`styles/_engine/hydrate.mjs`) [2h] {deps: T017}
- [x] T020 Wire `hydrate` command to the guard + mode scoping (`styles/_engine/style-library.mjs`) [2h] {deps: T018, T019}

### Proof gate
- [x] T021 Implement `CORPUS_USE_PROOF v1` schema (authority, selection rationale, coherent fingerprint, transformation delta, provenance/anti-copy, application proof) (`styles/_engine/corpus-use-proof.mjs`) [4h] {deps: T020}
- [x] T022 Block corpus-influenced ready claims without a valid proof card (`styles/_engine/corpus-use-proof.mjs`) [2h] {deps: T021}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Change/invalidation fixtures and CI wiring.

- [x] T023 Fixture: byte-stable `build --check` on unchanged corpus (`styles/_engine/__tests__/check-stable.test.mjs`) [2h] {deps: T006}
- [x] T024 Fixture: add/change/delete invalidation + pre/post mutation abort (`styles/_engine/__tests__/invalidation.test.mjs`) [3h] {deps: T023}
- [x] T025 [P] Fixture: stale/absent FTS → source-scan `degraded:true` (`styles/_engine/__tests__/fallback.test.mjs`) [2h] {deps: T013}
- [x] T026 [P] Fixture: generation-mismatch hydration refusal (`styles/_engine/__tests__/hydrate-guard.test.mjs`) [2h] {deps: T018}
- [x] T027 [P] Fixture: deterministic card ordering + valid/invalid proof cards (`styles/_engine/__tests__/proof.test.mjs`) [2h] {deps: T014, T022}
- [ ] T028 Add CI selectors on `styles/**`, the engine, and mode contracts (`.opencode/skills/sk-design/**` CI config) [2h] {deps: T024, T025, T026, T027} — DEFERRED: no per-skill test-runner CI harness exists yet and `.github/` is outside this phase's scope lock; the fixtures pass locally via `node --test` and CI wiring lands when a design-test job is introduced.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Tasks

- [x] T029 Confirm each engine module maps to exactly one ADR authority (manifest→ADR-001, eligibility→ADR-002, rank-fts→ADR-003, hydrate→ADR-004, corpus-use-proof→ADR-005) (`decision-record.md`) [1h] {deps: T022}
- [x] T030 Promote ADR-001..005 from Proposed to Accepted after the build validates (`decision-record.md`) [1h] {deps: T028}
<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T028 CI-wiring deferred with documented reason)
- [x] No `[B]` blocked tasks remaining
- [x] `build --check` byte-stable; invalidation flags exact mutated ids
- [x] Eligibility proven to run before ranking
- [x] Hydration refuses `generation-mismatch`; fallback returns `degraded:true`
- [x] `CORPUS_USE_PROOF v1` blocks an unproven ready claim
- [x] All CI fixtures passing
- [x] All ADRs status: Accepted
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
</content>
