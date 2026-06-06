---
title: "Phase 001 Tasks: Prerequisites & Baseline"
description: "Checkbox tasks for installing git-filter-repo and capturing the pre-rewrite baseline."
trigger_phrases:
  - "112-prerequisites-and-baseline tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/001-prerequisites-and-baseline"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 001 tasks"
    next_safe_action: "Execute Setup then Implementation tasks"
    blockers: []
    key_files:
      - "tasks.md"
      - "evidence/tooling-pins.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-tasks-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 001 — Prerequisites & Baseline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P0/P1/P2] Description (file or command)` — P0 = blocker, P1 = required, P2 = optional. Mark `[x]` when complete with brief evidence inline.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-001 [P0] Verify or install `git-filter-repo` (`brew install git-filter-repo`)
- [ ] T-002 [P0] Record `git filter-repo --version` for tooling-pins
- [ ] T-003 [P0] Record `devin --version`, `git --version`, `python3 --version`, `bash --version`, `node --version`, `sw_vers -productVersion`
- [ ] T-004 [P1] Confirm `sequential_thinking` MCP server is registered (referenced in `opencode.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-010 [P0] Verify `git config --get commit.gpgsign` is empty or false; same for `tag.gpgsign`
- [ ] T-011 [P0] `mkdir -p evidence/`
- [ ] T-012 [P0] `git bundle create evidence/pre-rewrite.bundle --all`
- [ ] T-013 [P0] `git bundle verify evidence/pre-rewrite.bundle` exits 0
- [ ] T-014 [P0] `shasum -a 256 evidence/pre-rewrite.bundle` — record into tooling-pins
- [ ] T-015 [P0] `git log --pretty=format:'%H %s' > evidence/baseline-log.txt`
- [ ] T-016 [P0] `wc -l evidence/baseline-log.txt` — record actual count into tooling-pins
- [ ] T-017 [P0] `git rev-list --count --all` — record into tooling-pins
- [ ] T-018 [P0] Write `evidence/tooling-pins.json` with captured_at, host, tools, gpg_signing, baseline
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-020 [P0] `jq . evidence/tooling-pins.json` exits 0 (valid JSON)
- [ ] T-021 [P0] Re-run `shasum -a 256 evidence/pre-rewrite.bundle` and confirm matches the value stored in tooling-pins
- [ ] T-022 [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ./001-prerequisites-and-baseline --strict` exits 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- All 5 quality gates in plan.md pass
- `implementation-summary.md` updated with actual HEAD count, bundle size, time taken
- Parent `graph-metadata.json` `derived.last_active_child_id` advanced from `001-…` to `002-…`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Next phase: `../002-commit-standards-definition/`
<!-- /ANCHOR:cross-refs -->
