---
title: "Tasks: Seed cosine embeddings into the sweep test"
description: "Helper, wire-in, re-run, recommendation."
trigger_phrases:
  - "corpus seeded sweep tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-seeded-corpus-evaluation-sweep"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Seed cosine embeddings into the sweep test

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Read 015/003 sweep test to find `createFixtureProjection` + `loadSkillEmbeddings` call sites.
- [ ] T002 Confirm `createEmbeddingsProvider()` + `embedDocument()` API.
- [ ] T003 Inventory cache directory pattern (use `tests/scorer/fixtures/.embeddings-cache/` or similar).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Author `tests/scorer/fixtures/seed-skill-embeddings.ts` helper (cache-aware async embedder).
- [ ] T011 Add `.gitignore` entry for the cache dir/file.
- [ ] T012 Wire `seedSkillEmbeddings(...)` into `lane-weight-sweep.vitest.ts` `beforeAll`.
- [ ] T013 Spy/inject `loadSkillEmbeddings` to return the seeded map during the sweep.
- [ ] T014 Run the sweep; emit fresh markdown report at `004-corpus-seeded-sweep/research/sweep-results.md`.
- [ ] T015 Author the recommendation in `implementation-summary.md` with cited numbers.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 Run `npm run typecheck` from `mcp_server/`.
- [ ] T021 Run `npm exec -- vitest run skill_advisor`; confirm only the pre-existing plugin-bridge baseline still fails.
- [ ] T022 Confirm sweep variance per REQ-004 (or document provider-unavailable skip).
- [ ] T023 Run `npx tsc --build` in `system-spec-kit/`.
- [ ] T024 Strict spec validate this packet.
- [ ] T025 Strict spec validate parent 015 packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All Phase 1-3 tasks `[x]`.
- [ ] No `[B]` blockers.
- [ ] Real recommendation grounded in numbers (not handwave).
- [ ] Strict validation green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `002-semantic-routing-lane`
- Sibling phases: `001-embed-cache-and-cosine-wiring`, `002-ablation-sweep-and-promote`, `003-weight-sweep-harness`
- Source files: `skill_advisor/lib/scorer/lanes/semantic-shadow.ts` (loadSkillEmbeddings call site), `tests/scorer/lane-weight-sweep.vitest.ts`, `tests/scorer/fixtures/intent-prompt-corpus.ts`
<!-- /ANCHOR:cross-refs -->
