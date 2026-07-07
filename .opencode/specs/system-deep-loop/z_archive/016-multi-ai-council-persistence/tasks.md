---
title: "Tasks: Multi-AI Council Persistence"
description: "Task ledger for packet 089: Phase 1 spec authoring + Phase 2A helper/schema/fixtures + Phase 2B agent §17 + 4-runtime mirror + Phase 2C validator hardening + parity test."
trigger_phrases:
  - "multi-ai-council persistence tasks"
  - "packet 089 tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/016-multi-ai-council-persistence"
    last_updated_at: "2026-05-06T16:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md ledger across 4 sub-phases"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:ab85e4a4722853475979f773a666fffba3f47fe7b1bf81f41a37879fc3ed8f27"
      session_id: "tasks-089-author"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---

# Tasks: Multi-AI Council Persistence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Spec authoring + design lock-in.

- [x] T001 Create folder + description.json (via create.sh)
- [x] T002 Move folder under skilled-agent-orchestration/
- [x] T003 Author spec.md (Level 3, canonical template anchors)
- [x] T004 Author plan.md (canonical template anchors with L2/L3 add-ons)
- [x] T005 Author tasks.md (this file)
- [x] T006 Author checklist.md (CHK-XXX [P*] format)
- [x] T007 Author decision-record.md (4 ADRs)
- [x] T008 Author implementation-summary.md placeholder (canonical anchors)
- [x] T009 Strict validation passes on packet 089
- [x] T010 Phase 1 complete; proceed to Phase 2A
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 2A — Helper + schema + fixtures

- [x] T201 Create directory `.opencode/skills/system-spec-kit/scripts/multi-ai-council/`
- [x] T202 Author `persist-artifacts.cjs` (Node CJS, parser/renderer/builder/state-line exports + CLI)
- [x] T203 Author `references/multi-ai-council/output-schema.md` (markdown contract)
- [x] T204 [P] Author 3 fixtures under `scripts/tests/fixtures/multi-ai-council/` (full / minimal / missing-required)
- [x] T205 Author `scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` (4 cases)
- [x] T206 Verify helper invocation via stdin and `--input-file`
- [x] T207 Verify exit codes 0/1/2
- [x] T208 Verify idempotent re-run on same input
- [x] T209 Run helper test (vitest or codex-side fallback)
- [x] T210 Phase 2A strict validation pass

### Phase 2B — Agent body §17 + 4-runtime mirror sync

- [x] T211 Update `.opencode/agents/multi-ai-council.md` §8 to cross-link `output-schema.md`
- [x] T212 Add §17 Caller Persistence Protocol to `.opencode/agents/multi-ai-council.md`
- [x] T213 [P] Mirror §8 + §17 to `.claude/agents/multi-ai-council.md`
- [x] T214 [P] Mirror to `.gemini/agents/multi-ai-council.md`
- [x] T215 [P] Mirror to `.codex/agents/multi-ai-council.toml`
- [x] T216 Verify all 4 runtimes have identical normalized §-headers
- [x] T217 Verify §16 SUMMARY ASCII box stays as closing section
- [x] T218 Verify agent permission block unchanged across all 4 runtimes
- [x] T219 Phase 2B strict validation pass
- [x] T220 Phase 2B complete

### Phase 2C — Validator hardening + mirror parity test

- [x] T221 Replace `multi-ai-council-validator.vitest.ts` partial-layout assertions with synthetic spec folder + `validate.sh --strict`
- [x] T222 Confirm arbitrary `ai-council/` internals do not break strict validation
- [x] T223 Author `scripts/tests/multi-ai-council-mirror-parity.vitest.ts`
- [x] T224 Implement normalized comparison (strip frontmatter + runtime-specific bits)
- [x] T225 Verify parity test passes with all 4 runtimes in lockstep
- [x] T226 Verify parity test fails with clear diff when one mirror drifts (manual smoke test)
- [x] T227 Run both vitest tests (codex-side fallback if local vitest broken)
- [x] T228 Phase 2C strict validation pass
- [x] T229 Phase 2C complete
- [x] T230 Update implementation-summary.md with end-to-end evidence
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Final wrap.

- [ ] T301 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet-089> --strict` (exit 0)
- [ ] T302 Generate nested changelog via `nested-changelog.js`
- [ ] T303 Run `/memory:save` via generate-context.js
- [ ] T304 Verify all P0 + P1 checklist items complete with evidence
- [ ] T305 Commit packet 089 (one or more commits as desired)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [P0] All Phase 2A tasks (T201-T210) marked [x] with evidence
- [P0] All Phase 2B tasks (T211-T220) marked [x] with 4-runtime parity verified
- [P0] All Phase 2C tasks (T221-T230) marked [x] with vitest evidence
- [P0] Strict validation exit 0 on packet 089
- [P0] All 8 SC-001..SC-008 success criteria evidenced in implementation-summary.md
- [P1] Phase 3 wrap (T301-T305) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (3-sub-phase rollout)
- **Decision Record**: See `decision-record.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md` (post-implementation)
- **Predecessor packet**: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/research.md` §7 (concrete scope source)
<!-- /ANCHOR:cross-refs -->
