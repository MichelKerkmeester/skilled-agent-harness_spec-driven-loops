---
title: "Tasks: Devin docs, agents, governance, and closeout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases: ["Devin docs closeout tasks", "Devin agent roster restore tasks"]
importance_tier: normal
contextType: general
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md with 21 unchecked tasks across Setup/Implementation/Verification"
    next_safe_action: "Wait for phases 002-006, then execute T001 onward in order"
    blockers: ["Phases 002-006 must land before T004-T017 describe real, shipped capabilities."]
    key_files: [".opencode/agents/context.md", "AGENTS.md", "CLAUDE.md", "README.md", ".opencode/skills/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Devin docs, agents, governance, and closeout
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
`[ ]` pending; `[x]` completed; `[P]` parallelizable; `[B]` blocked.

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Confirm phases 002-006 have landed by reviewing each phase's `implementation-summary.md` (`../002-deep-loop-executor-support/`, `../003-cli-devin-skill-packet/`, `../004-devin-hook-adapter-layer/`, `../005-devin-model-registry-and-quota/`, `../006-devin-manual-testing-playbook/`)
- [ ] T002 [P] Re-run current-tree evidence: `ls .opencode/agents .claude/agents .codex/agents` to reconfirm the 4 target agent files exist under current names in all 3 runtimes
- [ ] T003 [P] Re-run `rg -n "cli-codex" AGENTS.md CLAUDE.md README.md` as the structural precedent map for where the `cli-devin` restoration should land
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Restore `cli-devin` mention in `.opencode/agents/context.md`, `.claude/agents/context.md`, `.codex/agents/context.toml`
- [ ] T005 Restore `cli-devin` mention in `.opencode/agents/deep-research.md`, `.claude/agents/deep-research.md`, `.codex/agents/deep-research.toml`
- [ ] T006 Restore `cli-devin` mention in `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`
- [ ] T007 Restore `cli-devin` mention in `.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md`, `.codex/agents/deep-improvement.toml`
- [ ] T008 Restore `cli-devin` mode/executor mention in `AGENTS.md` (repo root)
- [ ] T009 Restore `cli-devin` mode/executor mention in `CLAUDE.md` (repo root), edited independently from T008 (verbatim twin, not derived)
- [ ] T010 Restore the `cli-devin` mode entry in `README.md` (repo root), mirroring the live `cli-codex` entry shape
- [ ] T011 Restore the `cli-devin` skill-catalog entry in `.opencode/skills/README.md`
- [ ] T012 [P] Cross-check `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` does not assert a 4-member executor union or `cli-devin`'s absence
- [ ] T013 [P] Cross-check `system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` does not assert `cli-devin`'s absence
- [ ] T014 [P] Cross-check `system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` does not assert `cli-devin`'s absence
- [ ] T015 Confirm `system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts` and `system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts` remain untouched (regression guard, D5 scope exclusion)
- [ ] T016 Confirm `system-spec-kit/constitutional/post-implementation-deep-review.md` remains executor-agnostic and untouched (regression guard, D4 decision)
- [ ] T017 Cross-reference (do not duplicate) phase 005's `check-prompt-quality-card-sync.sh` restoration in this phase's evidence
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T018 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/029-cli-devin-revival --recursive --strict`
- [ ] T019 Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration`
- [ ] T020 Run the final inverse verification `rg -n "cli-devin" .opencode/agents .claude/agents .codex/agents AGENTS.md CLAUDE.md README.md`, expecting nonzero hits
- [ ] T021 Author `implementation-summary.md` with final evidence for T001-T020 and mark this phase's (and the packet's) closeout status
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --recursive --strict` exits 0
- [ ] `parent-skill-check.cjs` exits 0
- [ ] Final inverse `rg` check (T020) shows nonzero `cli-devin` hits in the scoped live agent/governance paths
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Phase parent**: See `../spec.md`
- **Predecessor**: See `../006-devin-manual-testing-playbook/`
<!-- /ANCHOR:cross-refs -->
