---
title: "Tasks: Documentation-Drift Review vs Session Changes"
description: "Task breakdown for the read-only documentation-drift review: setup ground truth, run partitioned review passes, verify and synthesize findings."
trigger_phrases:
  - "documentation drift review tasks"
  - "drift review tasks"
  - "review pass tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/015-docs-drift-review"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Recorded Phase 1-3 tasks for the partitioned drift review"
    next_safe_action: "Owner triages findings into a docs-remediation packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "docs-drift-review-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Documentation-Drift Review vs Session Changes

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `origin/main` HEAD = `75cfec1700` and enumerate the session commit range (`git log`)
- [x] T002 Establish code ground truth for the 7 change-areas: 37 MCP tools, single `MANIFESTS` entry, `CLOUD_CANONICAL` retention, MMR presence, owner-lease path, flag-doc renumbering
- [x] T003 Create the review packet skeleton (`spec.md`, `description.json`, `graph-metadata.json`, `review/`)
- [x] T004 Pre-filter `feature_catalog/**` and `manual_testing_playbook/**` by topical grep; compose 10 bounded review briefs (`/tmp/docs-drift-review/brief-*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Pass 01 root README; Pass 02 system-spec-kit README+SKILL; Pass 03 system-skill-advisor README+SKILL
- [x] T006 [P] Pass 04 system-code-graph README+SKILL; Pass 05 cli-* + skills index; Pass 06 deep/mcp/sk skills
- [x] T007 [P] Pass 07 MCP server READMEs + ENV_REFERENCE; Pass 08 feature_catalog embedder/flag files
- [x] T008 [P] Pass 09 feature_catalog master + governance + mutation; Pass 10 manual_testing_playbook targeted
- [x] T009 Dispatch all passes via `cli-opencode gpt-5.5-fast high` (`AI_SESSION_CHILD=1`, `</dev/null`, 2-3 concurrent)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Adversarially verify EVERY candidate finding against `origin/main` code; reject false positives
- [x] T011 Record the false-positive class (mk-spec-memory MMR/cloud over-application) so remediators do not "fix" accurate docs
- [x] T012 Write `review/review-report.md`: verdict, P0/P1/P2 counts, grouped findings, no-drift list, coverage gaps
- [x] T013 Run `validate.sh <folder> --strict`; reconcile this packet's completion metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `review/review-report.md` exists; reviewed docs untouched
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
