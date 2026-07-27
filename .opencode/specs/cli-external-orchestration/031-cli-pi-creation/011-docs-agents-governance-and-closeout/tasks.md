---
title: "Tasks: Pi docs, agents, governance, and closeout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-pi closeout tasks"
  - "pi governance tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/011-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-27T05:34:01Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md with 20 unchecked tasks across Setup/Implementation/Verification"
    next_safe_action: "Wait for phases 001-010, then execute T001 onward in order"
    blockers: ["Phases 001-010 must land before T005-T017 describe real, shipped capabilities."]
    key_files: [".opencode/skills/cli-external-orchestration/README.md", "README.md", ".opencode/skills/README.md", ".opencode/agents/deep-improvement.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi docs, agents, governance, and closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 001-010 have landed by reviewing each phase's `implementation-summary.md` (`../001-pi-contract-pin/`, `../002-deep-loop-executor-support/`, `../003-cli-pi-skill-packet/`, `../004-pi-skill-discovery-bridge/`, `../005-pi-command-layer/`, `../006-pi-agent-bridge/`, `../007-pi-mcp-host-integration/`, `../008-pi-hook-extension-layer/`, `../009-pi-model-registry-and-routing/`, `../010-pi-manual-testing-playbook/`)
- [ ] T002 [P] Re-run `rg -l 'cli-opencode|cli-claude-code|cli-codex|cli-cursor|cli-devin'` over `.opencode/skills/cli-external-orchestration/README.md`, `README.md`, `.opencode/skills/README.md`, `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `AGENTS.md`, `CLAUDE.md` to reconfirm the touch-list and each surface's current symmetry tier (5-of-5 / 4-of-5 / 2-of-5) against this spec's planning-time snapshot
- [ ] T003 [P] Cross-check `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs`'s `KNOWN_EXECUTORS` set and phase 002/009's `implementation-summary.md` to determine whether `deep-improvement.md` may claim `cli-pi` as a benchmarkable dispatch executor
- [ ] T004 Decide the devin-backfill question: does this phase also add the missing `cli-devin` mention to the hub's own `README.md`, root `README.md`, and `.opencode/skills/README.md` while adding `cli-pi`, or strictly scope-lock to pi-only additions? Record the decision and its rationale here before T005 onward
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `cli-pi` to the hub's own `.opencode/skills/cli-external-orchestration/README.md`: frontmatter `description`/`trigger_phrases`/`version`, the "N workflow modes" tagline, AT A GLANCE table, OVERVIEW bullet list + routing-policy sentence, QUICK START example -- applying T004's devin-backfill decision
- [ ] T006 Add `cli-pi` to root `README.md`'s CROSS-AI CLI section (~L919-926, L957) and the skills-catalog table row (~L1287) -- applying T004's decision
- [ ] T007 Add `cli-pi` to `.opencode/skills/README.md`'s `cli-external-orchestration` catalog row (~L49) -- applying T004's decision
- [ ] T008 [P] [B: gated on T003] Conditionally add `pi` to `.opencode/agents/deep-improvement.md` + `.claude/agents/deep-improvement.md`'s Lane-B lane-awareness paragraph, only if T003 confirmed live `dispatch-model.cjs` support -- otherwise mark this task explicitly skipped with the T003 evidence cited, not silently omitted
- [ ] T009 [P] Confirm `AGENTS.md`/`CLAUDE.md` still carry zero per-CLI enumeration for any of the 5 existing siblings (generic `cli-X` pattern only) -- no edit needed if confirmed; re-open T009 if this has changed since planning time
- [ ] T010 Reconcile completion metadata across all 11 phases via `grep "Status" ../00{1..9}-*/spec.md ../010-*/spec.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 [P] Cross-check `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` does not assert a stale executor union that excludes `cli-pi`
- [ ] T012 [P] Cross-check `system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` does not assert `cli-pi`'s absence
- [ ] T013 Confirm `system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts` and its `runtime-parity.vitest.ts` remain untouched (regression guard, same D5-shaped scope exclusion as 029)
- [ ] T014 Confirm `system-spec-kit/constitutional/post-implementation-deep-review.md` remains executor-agnostic and untouched (regression guard, same D4-shaped decision as 029)
- [ ] T015 Grep sweep: `rg -n "cli-pi"` across every T005-T008-identified surface confirms `cli-pi` present exactly where T004's recorded decision says it should be, and absent where it deliberately was not extended
- [ ] T016 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/031-cli-pi-creation --recursive --strict`
- [ ] T017 Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration`
- [ ] T018 Author `implementation-summary.md` with final evidence for T001-T017 and mark this phase's (and the packet's) closeout status
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T008 may resolve to explicitly-skipped-with-evidence rather than `[x]` if T003 finds pi unsupported by `dispatch-model.cjs` -- that is a valid, documented completion state, not a blocker)
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --recursive --strict` exits with `Errors: 0`
- [ ] `parent-skill-check.cjs` exits 0
- [ ] T015's grep sweep confirms `cli-pi` present exactly where T004's decision specifies
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Phase parent**: See `../spec.md`
- **Predecessor**: See `../010-pi-manual-testing-playbook/`
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
- `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/tasks.md`, `../../030-cli-cursor-creation/007-docs-agents-governance-and-closeout/tasks.md` (sibling closeout precedents)
