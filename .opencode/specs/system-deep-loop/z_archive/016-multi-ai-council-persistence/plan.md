---
title: "Implementation Plan: Multi-AI Council Persistence"
description: "Three-phase rollout: scaffold helper + schema + fixtures (Phase 2A), agent body §17 + 4-runtime mirror sync (Phase 2B), validator hardening + parity test (Phase 2C). Sequenced so the helper is standalone-usable from Phase 2A regardless of whether downstream wiring lands."
trigger_phrases:
  - "multi-ai-council persistence plan"
  - "packet 089 plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/016-multi-ai-council-persistence"
    last_updated_at: "2026-05-06T16:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 3 plan.md with 3-sub-phase rollout"
    next_safe_action: "Author tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs"
      - ".opencode/agents/multi-ai-council.md"
    session_dedup:
      fingerprint: "sha256:3987a10453e45b0fbe2cfb0d9c283080d3cc1d8e730bec8452a0150856dbb60c"
      session_id: "plan-089-author"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Multi-AI Council Persistence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three implementation sub-phases in a single Level 3 packet:

1. **Phase 2A — Helper + schema + fixtures** (the standalone-usable foundation)
   Author `persist-artifacts.cjs`, 3 fixtures, helper vitest, output-schema.md.
2. **Phase 2B — Agent body §17 + 4-runtime mirror sync**
   Update `.opencode/agents/multi-ai-council.md` §8 cross-link + add §17. Mirror to `.claude`, `.gemini`, `.codex`.
3. **Phase 2C — Validator hardening + mirror parity test**
   Replace existing `multi-ai-council-validator.vitest.ts` partial-layout coverage with synthetic full validation. Add `multi-ai-council-mirror-parity.vitest.ts`.

Sequencing rationale (per packet-080 round-2 ADD-6): Phase 2A delivers value even if 2B/2C lag, because the helper is standalone-usable (callers can run it manually from any caller pattern).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold | Blocking | Evidence |
|------|-----------|----------|----------|
| Pre-Implementation | spec/plan/tasks/checklist exist; predecessor packet 080 confirmed shipped | Yes | `validate.sh --strict` exit 0 on packet 089 |
| Mid-Implementation | Phase 2A artifacts present + helper vitest passes | No (warning) | tasks.md updated; helper test green |
| Post-Implementation | All P0 checklist items verified; parity test green; strict validation exit 0 | Yes | implementation-summary.md cites commit SHAs and test outputs |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Lightweight helper + shared schema + 4-runtime mirror discipline. Mirrors deep-research/deep-review reducer pattern (Node CJS) without inheriting their heavier state machinery (no findings registry, no dashboard, no graph events, no convergence math — council helper is parse-and-write only).

### Key Components

- **`persist-artifacts.cjs`** (~150-300 LOC): single-file Node CJS module exporting parser + renderer + builder + state-line writer. CLI delegates to those exports.
- **`output-schema.md`** (~100-200 LOC): markdown source of truth for §8 OUTPUT FORMAT. Defines requiredness matrix, heading aliases, seat fallback, optional-section policy.
- **3 vitest fixtures**: full / minimal / missing-required council outputs.
- **`multi-ai-council-persist-artifacts.vitest.ts`** (~150-300 LOC): 4-case fixture-driven test.
- **Agent body §17** (~30-50 LOC × 4 runtimes): normative caller persistence protocol.
- **`multi-ai-council-mirror-parity.vitest.ts`** (~80-150 LOC): normalized 4-runtime comparison.

### Data Flow

```
Council dispatch (returns plan-only chat output)
   |
   v
Caller invokes: node persist-artifacts.cjs <packet> --input-file report.md
   |
   v
Parser reads markdown, validates §8 strict-required sections
   |
   v
   +-- if missing strict-required: exit 1 (no writes)
   |
   v
Builder creates ai-council/ tree (config, strategy, state.jsonl, seats/, deliberations/, council-report.md)
   |
   v
State-line writer appends round events to state.jsonl
   |
   v
Exit 0 (success) or 2 (partial-write recovery)
```

Both agent body §8 and helper parser cite `output-schema.md` as the authority. Schema changes require lockstep updates to both.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 2A — Helper + schema + fixtures

Tasks T201-T210. Build the standalone-usable foundation:

- T201 Create `scripts/multi-ai-council/` directory.
- T202 Author `persist-artifacts.cjs` (parser + renderer + builder + state-line + CLI).
- T203 Author `references/multi-ai-council/output-schema.md`.
- T204 Author 3 fixtures under `scripts/tests/fixtures/multi-ai-council/`.
- T205 Author `scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` (4 cases).
- T206 Verify helper invokes correctly via stdin and `--input-file` paths.
- T207 Verify exit codes: 0 success, 1 strict-required missing, 2 partial-write.
- T208 Verify idempotent re-run on same input.
- T209 Run helper test (codex-side fallback if local vitest broken).
- T210 Phase 2A strict validation pass.

### Phase 2B — Agent body §17 + 4-runtime mirror sync

Tasks T211-T220. Land normative caller protocol:

- T211 Update `.opencode/agents/multi-ai-council.md` §8 to cross-link `output-schema.md`.
- T212 Add §17 Caller Persistence Protocol to `.opencode/agents/multi-ai-council.md`.
- T213 Mirror §8 + §17 to `.claude/agents/multi-ai-council.md`.
- T214 Mirror to `.gemini/agents/multi-ai-council.md`.
- T215 Mirror to `.codex/agents/multi-ai-council.toml`.
- T216 Verify all 4 runtimes have identical normalized §-headers.
- T217 Verify §16 SUMMARY ASCII box stays as the closing section.
- T218 Verify agent permission block unchanged across all 4 runtimes.
- T219 Phase 2B strict validation pass.
- T220 Commit Phase 2B.

### Phase 2C — Validator hardening + mirror parity test

Tasks T221-T230. Tighten regression coverage:

- T221 Replace `multi-ai-council-validator.vitest.ts` partial-layout assertions with synthetic spec folder running `validate.sh --strict`.
- T222 Confirm arbitrary `ai-council/` internals do not break strict validation.
- T223 Author `multi-ai-council-mirror-parity.vitest.ts`.
- T224 Implement normalized comparison (strip frontmatter + runtime-specific bits, compare §-headers and body).
- T225 Verify parity test passes when all 4 runtimes are in lockstep.
- T226 Verify parity test fails (with clear diff) when one mirror drifts.
- T227 Run both vitest tests (codex-side fallback if local vitest broken).
- T228 Phase 2C strict validation pass.
- T229 Commit Phase 2C.
- T230 Update implementation-summary.md with end-to-end evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Unit / vitest
- Helper test (4 cases): full → write all artifacts; minimal → composition fallback works; missing-required → exit 1 no writes; parser-export → returns missing-section list without filesystem touch.
- Validator regression test (replace existing): synthetic spec folder + `validate.sh --strict` confirms `ai-council/` arbitrary internals pass.
- Mirror parity test: normalized 4-runtime comparison passes; intentional drift fails with clear diff.

### Integration / live dispatch
- Smoke test: run helper on packet-080's existing `ai-council/council-report.md`. Confirm artifacts match prior hand-written state.

### Regression
- Existing strict validation suite must still pass on packets without `ai-council/` (no behavior change).
- All 4-runtime agent mirrors stay in lockstep (manual diff + parity test).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Predecessor packet 080 (shipped): provides `.opencode/agents/multi-ai-council.md` §12-§16 + references/multi-ai-council/ + ai-council/ smoke-test artifacts.
- Existing scripts/ folder convention (matches deep-research/deep-review reducer locations).
- Existing vitest config (system-spec-kit/scripts).
- 4-runtime mirror convention (per memory `feedback_new_agent_mirror_all_runtimes`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a regression is detected:

1. **Revert helper-only**: `git revert` the Phase 2A commit. Helper file deleted; output-schema.md deleted; fixtures deleted; helper test deleted. Agent body and validator regression unaffected.
2. **Revert §17-only**: `git revert` the Phase 2B commit. Agent body and 4 mirrors restored to packet-080 state. Helper still works standalone.
3. **Revert validator/parity-only**: `git revert` the Phase 2C commit. Validator regression test reverts to packet-080 state. Helper and §17 unaffected.

No database / production state touched. All revert paths are git-level. ai-council/ artifacts produced by the helper during testing remain on disk (free-form subfolder; harmless to validator).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 2A → Phase 2B: helper + schema must exist before §17 can cross-link them.
- Phase 2B → Phase 2C: 4-runtime mirrors must exist before parity test can validate them.
- Phase 2C has no external dependencies once 2B lands.

Each phase commits separately so rollback granularity is preserved.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort | Wall-clock |
|-------|--------|------------|
| Phase 2A (helper + schema + fixtures) | L | ~2-3h authoring + verification |
| Phase 2B (agent §17 + 4-runtime mirror) | M | ~1-2h structural editing |
| Phase 2C (validator + parity test) | M | ~1-2h test authoring |
| **Total** | **L** | **~4-7h end-to-end** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Per-file granularity:

- **Helper alone**: `rm -f .opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`. Removes it without affecting tests (vitest will fail importing it; revert vitest if needed).
- **Schema alone**: `rm -f .opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`. Agent §8 cross-link will dangle; revert §8 edit too.
- **Single-runtime mirror alone**: revert that runtime's agent file. Parity test will fail until restored.
- **Parity test alone**: `rm -f .opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-mirror-parity.vitest.ts`. No other component depends on it.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
spec.md -> plan.md -> tasks.md -> checklist.md
                                     |
                                     v
                       [Phase 2A: helper + schema + fixtures]
                                     |
                                     v
                       [Phase 2B: agent §17 + 4-runtime mirror]
                                     |
                                     v
                       [Phase 2C: validator + parity test]
                                     |
                                     v
                       implementation-summary.md
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Phase 2A T201-T210 (helper + schema + fixtures + helper test)
2. Phase 2B T211-T220 (agent §17 + 4-runtime mirror)
3. Phase 2C T221-T230 (validator hardening + parity test)
4. Final strict validation on packet 089
5. Memory save + commit

Phase 2A blocks 2B (cross-link target). Phase 2B blocks 2C (parity comparison target). No phase is parallelizable across this packet.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Trigger | Evidence |
|-----------|---------|----------|
| M1: Spec locked | All Phase 1 docs validate strict | `validate.sh --strict` exit 0 |
| M2: Helper standalone-usable | persist-artifacts.cjs + output-schema.md + fixtures + test in place | helper invokable via stdin/file; test green |
| M3: 4-runtime parity | All 4 mirrors carry §8 cross-link + §17 in identical normalized form | parity vitest passes |
| M4: Validator regression-proof | Synthetic spec validation passes; arbitrary `ai-council/` internals tolerated | hardened vitest passes |
| M5: Packet 089 complete | implementation-summary.md updated; final strict validation exit 0 | commit SHA + test output |
<!-- /ANCHOR:milestones -->
