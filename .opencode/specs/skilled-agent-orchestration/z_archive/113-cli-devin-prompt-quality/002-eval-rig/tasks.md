---
title: "Tasks: Eval Rig"
description: "Numbered tasks for building fixtures + grader + cache + deterministic checks + dry-run gate"
trigger_phrases:
  - "113/002 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality/002-eval-rig"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded tasks.md"
    next_safe_action: "Read council-report.md after 001 ratifies"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114022"
      session_id: "114-002-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Eval Rig

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [B] T001 BLOCKED on 001-council-design completion — wait for council-report.md ratification
- [ ] T002 Read `../001-council-design/ai-council/council-report.md` and extract: rubric (5 dims + weights), fixture catalog, grader model choice, budget envelope
- [ ] T003 Create directories: `fixtures/`, `grader/`, `cache/det/`, `cache/grader/`, `scripts/deterministic/`, `scripts/dry-run-fixtures/`
- [ ] T004 Initialize `cache/index.jsonl` as empty file
- [ ] T005 Decide gitignore policy for blob files (size-based; ask operator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 [P] Materialize fixture files: one `fixtures/fix-NNN-*.json` per council catalog entry; each with task description, scope, acceptance criteria, known-real allowlist, `grounded_in` citation
- [ ] T011 [P] Author `scripts/deterministic/bundle-gate.cjs` — 3-layer check (imports grep + exports grep + smoke-run validation_commands)
- [ ] T012 [P] Author `scripts/deterministic/cwd-check.cjs` — regex paths against fixture stated CWD
- [ ] T013 [P] Author `scripts/deterministic/preplanning-regex.cjs` — block presence + step ordering check
- [ ] T014 [P] Author `scripts/deterministic/hallucination-flag.cjs` — allowlist gate
- [ ] T015 Author `grader/harness.cjs` — dispatch grader CLI per council choice; parse JSON; rubric-shape output
- [ ] T016 [P] Add dual-grader mode to `grader/harness.cjs` — median + dispute detection (>0.15 delta flagged)
- [ ] T017 Author cache layer: key derivation, atomic temp+rename writes, mkdir lock with 5min TTL
- [ ] T018 Author `scripts/cache-reconstruct.cjs` — rebuild `cache/index.jsonl` from blob files
- [ ] T019 Author canned outputs: `scripts/dry-run-fixtures/{passing,failing,parse-error}.canned.md` with known expected scores
- [ ] T020 Author `scripts/dry-run.cjs` — orchestrates --test-cache, --test-deterministic, --test-grader-stub, full e2e
- [ ] T021 Add `.gitignore` rule for cache blobs if council decides size-based exclusion
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run `scripts/dry-run.cjs --test-cache` (REQ-003): 100 concurrent entries, no torn writes
- [ ] T031 Run `scripts/dry-run.cjs --test-deterministic` (REQ-004): all 4 scripts return expected scores
- [ ] T032 Run `scripts/dry-run.cjs --test-grader-stub`: harness parses canned grader response correctly
- [ ] T033 Run full `scripts/dry-run.cjs` end-to-end (REQ-005): exit 0
- [ ] T034 Verify REQ-006: `grep -rn 'cli-devin\|devin --\|swe-1.6' 002-eval-rig/scripts/` returns no matches
- [ ] T035 Verify REQ-001: fixture count matches council ratified N
- [ ] T036 Verify REQ-002: `node grader/harness.cjs fixtures/fix-001-*.json scripts/dry-run-fixtures/passing.canned.md` returns valid rubric JSON
- [ ] T037 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 002-eval-rig --strict` — exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 verification tasks pass (T030..T036)
- [ ] strict-validate exit 0 (T037)
- [ ] Operator sign-off on rig (REQ-005 + dry-run green)
- [ ] 003-eval-loop can require() / shell-call rig artifacts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `../spec.md`
- **Upstream**: `../001-council-design/ai-council/council-report.md`
- **Downstream**: `../003-eval-loop/`
<!-- /ANCHOR:cross-refs -->
