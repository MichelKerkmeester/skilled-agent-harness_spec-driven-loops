---
title: "Tasks: Skill embedding cache and cosine-similarity lane wiring"
description: "Phased task list for the embedding-cache + cosine-lane shadow implementation."
trigger_phrases:
  - "skill embedding tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded tasks.md"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Skill embedding cache and cosine-similarity lane wiring

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

- [ ] T001 Read `skill-graph-db.ts` schema migration pattern.
- [ ] T002 Read `factory.ts:resolveProvider()` and confirm `.embed()` return shape.
- [ ] T003 Read `lane-registry.ts` and identify how to register a new lane shadow-only.
- [ ] T004 Read `scorer/lanes/semantic-shadow.ts` and `scorer/fusion.ts` to understand the current shadow weighting.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Apply schema migration (column or sibling table) to `skill-graph.sqlite` setup code.
- [ ] T011 Add content-hash skip logic: re-embed only when SKILL.md content hash changes.
- [ ] T012 Wire scan-time embed call through `factory.ts:resolveProvider().embed(...)` in the skill-graph scan path.
- [ ] T013 Add prompt-embedding call in `advisor-recommend.ts` (once per recommend invocation).
- [ ] T014 Create `scorer/lanes/semantic-cosine.ts` with real cosine math producing `LaneMatch[]`.
- [ ] T015 Register the lane in `lane-registry.ts` shadow-only (live: false OR weight: 0).
- [ ] T016 Wire the lane into `fusion.ts` so its matches are collected but do not affect live scoring.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 Add Vitest tests for the new schema column persistence and content-hash skip.
- [ ] T021 Add Vitest tests for the cosine lane math against fixture vectors.
- [ ] T022 Add Vitest snapshot test that recommend output for a fixture prompt is byte-identical to pre-change.
- [ ] T023 Run `npm run typecheck` from `mcp_server/`.
- [ ] T024 Run `npm exec -- vitest run skill_advisor` and confirm all pass.
- [ ] T025 Run `npx tsc --build` in `system-spec-kit/` to rebuild dist.
- [ ] T026 Run strict spec validation on this packet.
- [ ] T027 Run strict spec validation on the parent 015 phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All Phase 1-3 tasks marked `[x]`.
- [ ] No `[B]` blockers remain.
- [ ] Strict validation passes for this packet and 015 parent.
- [ ] Recommend behavior unchanged for fixture prompts (snapshot test green).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `002-semantic-routing-lane`
- Sibling phase: `002-ablation-sweep-and-promote` (depends on this packet shipping)
- Source files: `skill_advisor/lib/scorer/lane-registry.ts`, `scorer/lanes/semantic-shadow.ts`, `scorer/fusion.ts`, `shared/embeddings/factory.ts`
<!-- /ANCHOR:cross-refs -->
