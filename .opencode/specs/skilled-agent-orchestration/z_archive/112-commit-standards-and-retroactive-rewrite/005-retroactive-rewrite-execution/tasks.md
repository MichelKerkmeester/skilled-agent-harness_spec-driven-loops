---
title: "Phase 005 Tasks: Retroactive Rewrite Execution"
description: "Checkbox tasks for running the cli-devin loop, synthesizing the mapping, applying via git filter-repo, and verifying."
trigger_phrases:
  - "112-retroactive-rewrite-execution tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/005-retroactive-rewrite-execution"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 005 tasks"
    next_safe_action: "Run preflight checks"
    blockers:
      - "Phases 001 through 004 must close first"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-tasks-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 005 — Retroactive Rewrite Execution

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P0/P1/P2] Description` — P0 = blocker, P1 = required, P2 = optional. Mark `[x]` with brief evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Preflight
- [ ] T-001 [P0] `git bundle verify ../001-prerequisites-and-baseline/evidence/pre-rewrite.bundle` exits 0
- [ ] T-002 [P0] `git filter-repo --version` matches tooling-pins
- [ ] T-003 [P0] `devin --version` matches tooling-pins
- [ ] T-004 [P0] `git rev-list --count HEAD` == 2,795 or recapture baseline
- [ ] T-005 [P0] `.opencode/skills/cli-devin/assets/agent-config-commit-rewrite-iter.json` exists
- [ ] T-006 [P0] `commit-standards.md` + `derivation-heuristics.md` exist in `../002-commit-standards-definition/`
- [ ] T-007 [P0] `git config --get commit.gpgsign` still empty or false

### Backup
- [ ] T-010 [P0] `git branch backup/pre-rewrite-$(date +%Y%m%d) HEAD`
- [ ] T-011 [P0] `git log -1 backup/pre-rewrite-*` matches current HEAD

### Initialize loop state
- [ ] T-020 [P0] Concrete `commit-rewrite-config.json` (sessionId, batchSize=50, totalCommits=2795, maxIterations=60)
- [ ] T-021 [P0] Initialize `commit-rewrite-state.jsonl` with init record
- [ ] T-022 [P0] Initialize `commit-rewrite-strategy.md` from template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### 56-iter loop
- [ ] T-030 [P0] For each N in 1..56: compute batch range, render iter prompt, dispatch cli-devin
- [ ] T-031 [P0] Per iter: confirm `rewrites/iteration-NNN.md` exists with required headings
- [ ] T-032 [P0] Per iter: confirm JSONL row appended to state.jsonl
- [ ] T-033 [P1] Per iter: update strategy.md
- [ ] T-034 [P0] Per iter: convergence check via legalStop gate

### Synthesis
- [ ] T-040 [P0] Dispatch synthesis prompt; produces `mapping.jsonl`
- [ ] T-041 [P0] `wc -l mapping.jsonl` == 2,795
- [ ] T-042 [P0] `grep -c needs_human_review mapping.jsonl` == 0 (or operator-cleared)

### Adversarial sample
- [ ] T-050 [P0] `shuf -n 140 < <(git rev-list HEAD) > sample-140.txt`
- [ ] T-051 [P0] Hand-check each sampled commit's mapping against commit-standards
- [ ] T-052 [P0] Record pass rate in `verification-report.md`; halt if below 95%

### Apply
- [ ] T-060 [P0] Copy callback: `cp ../004-cli-devin-rewrite-prompts/templates/callbacks/apply-mapping.py callbacks/apply-mapping.py`
- [ ] T-061 [P0] Pinned invocation (no --prune-empty=always): `git filter-repo --message-callback "$(cat callbacks/apply-mapping.py)"`
- [ ] T-062 [P0] Confirm exit 0 and record output in verification-report
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-070 [P0] `git rev-list --count HEAD` matches baseline (or baseline-equivalent if drifted)
- [ ] T-071 [P0] `git log --merges --pretty=%H | wc -l` == 24
- [ ] T-072 [P0] Manually inspect `git log --pretty=format:'%s' | head -50` — no packet-ID leakage
- [ ] T-073 [P0] `git bundle verify ../001-…/evidence/pre-rewrite.bundle` still passes
- [ ] T-074 [P0] Write `verification-report.md` with all gate results
- [ ] T-075 [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ./005-retroactive-rewrite-execution --strict` exits 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- All 8 quality gates in plan.md pass
- `implementation-summary.md` updated with final stats (commits-rewritten count, avg subject-length change, time taken)
- Parent `graph-metadata.json` `derived.status` → `completed`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessor: `../004-cli-devin-rewrite-prompts/`
- Inputs: `../001-…/evidence/`, `../002-…/commit-standards.md`, `../004-…/templates/`
<!-- /ANCHOR:cross-refs -->
