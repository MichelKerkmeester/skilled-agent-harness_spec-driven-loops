---
title: "Tasks: sk-git Review Remediation Round 2"
description: "Task queue for the six review-remediation fixes: AGENTS.md Git Workspace Safety, allocator mktemp/exhaustion hardening, catalog↔references contract reconciliation, SKILL.md NEVER refusals, and the cross-skill sk-doc validator hyphen fix."
trigger_phrases:
  - "sk-git review remediation tasks"
  - "git workspace safety tasks"
  - "allocator hardening tasks"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/006-git-review-remediation"
    last_updated_at: "2026-07-14T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks executed and independently verified"
    next_safe_action: "Scoped commit + push; reconcile concurrent sk-git renumber before WS2"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-review-remediation-r2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git Review Remediation Round 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (artifact)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm all six target files clean (no concurrent dirty edits) and gather exact fix locations — `git status` clean for all 6; locations captured in `spec.md` §2
- [x] T002 Scaffold packet with per-concern checklist verifier contracts — `spec.md`/`plan.md`/`tasks.md`/`checklist.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Governance + allocator (Units A, B)

- [x] T010 [P] AGENTS.md Git Workspace Safety subsection (5 rules) + quick-ref row (REQ-001) — `AGENTS.md:318`, `AGENTS.md:463`
- [x] T011 [P] Test-harness `${TMP:?}` guard + empty-TMP regression (REQ-003) — `cd "${TMP:?mktemp -d failed}"`, `expect_rc` regression
- [x] T012 [P] Allocator `next_number` fails silently at `>= 9999` + boundary tests (REQ-002) — `next_number` rc=1 at 9999; `PASS=47 FAIL=0`

### Contracts + validator (Units C, D)

- [x] T020 [P] Reconcile CI/CD routing to `gh` CLI across 4 spots (REQ-004) — `references/github-mcp-integration.md`, both catalog files, `quick-reference.md` (removed non-existent MCP tools)
- [x] T021 [P] Reconcile failing-test-gate override wording (REQ-004) — `finish-workflows.md` lines 45+89 add `unless the user explicitly overrides`
- [x] T022 [P] SKILL.md NEVER refusals `#9` (`--no-verify`) + `#10` (amend-published) (REQ-005) — `SKILL.md`; #1/#5 already cover force-push/secrets
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-2b -->
### Cross-skill validator

- [x] T030 [P] `detect_document_type` hyphen + underscore matching for playbook/catalog dirs (REQ-006) — `PLAYBOOK_DIR_NAMES`/`CATALOG_DIR_NAMES`
- [x] T031 [P] CLI `--type` exposes `playbook`/`playbook_feature`/`feature_catalog` (REQ-006) — `--help` lists all three
<!-- /ANCHOR:phase-2b -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Re-run allocator harness (REQ-002/003) — `worktree-naming tests: PASS=47 FAIL=0`
- [x] T041 Run validator on hyphen catalog + playbook leaves + README (REQ-006) — `feature_catalog`, `playbook_feature`, `readme` (0 issues, no regression)
- [x] T042 Regenerate `description.json`/`graph-metadata.json`; `validate.sh --strict` Errors 0 — metadata integrity + drift pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] AGENTS.md carries the Git Workspace Safety guidance; quick-ref row points at it — `AGENTS.md:318` + `AGENTS.md:463`
- [x] Allocator harness green (`FAIL=0`) with the mktemp guard + exhaustion boundary tests
- [x] The three contract conflicts read consistently; the four NEVER refusals back the README claim — CI/CD → `gh`; NEVER `#1/#5/#9/#10`
- [x] The sk-doc validator classifies hyphen-named leaves + exposes them via `--type`; no regression
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source review**: `../005-readme-enrichment-and-hyphen-naming/`
<!-- /ANCHOR:cross-refs -->
