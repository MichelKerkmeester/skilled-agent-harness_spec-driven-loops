---
title: "Tasks: Repo-Wide validate.sh Remediation Sweep"
description: "Task ledger for the triage-then-fix swarm across 41 non-028, non-030 packet roots."
trigger_phrases:
  - "repo wide remediation sweep tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/050-validate-sh-dist-freshness-and-repo-remediation/002-repo-wide-remediation-sweep"
    last_updated_at: "2026-07-04T17:11:53.344Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed triage, fix wave, and bucket-3 report"
    next_safe_action: "No implementation action remaining"
    blockers: []
    key_files:
      - ".opencode/specs/ai-systems/002-skill-port-quality-audit"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-030-dist-freshness-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Repo-Wide validate.sh Remediation Sweep

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

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

Triage wave.

- [x] T001 Enumerate the 41 in-scope packet roots (43 total minus `system-speckit/028-*` minus `deep-loops/030-agent-loops-improved`; discovered and excluded `system-speckit/029-memory-search-intelligence/000-release-cleanup/015-manual-playbook-execution-sweep` mid-sweep as a live concurrent session).
- [x] T002 Run a mechanical (script-based, not LLM-dispatch) triage classifying every failing folder into bucket 1 (mechanical), bucket 2 (grounded content), bucket 3 (no reliable grounding). Evidence: `triage_phase_c.py`, 165 folders classified.
- [x] T003 Aggregate triage results into bucket 1 / 2 / 3 lists. Evidence: 106 bucket-1, 7 bucket-2, 52 bucket-3 (+2 from a separately-run `design/008-sk-design-parent` due to its size).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Fix wave.

- [x] T004 Fix all bucket-1 folders via scripted metadata regen and Spec Folder field correction (no LLM dispatch needed -- fully deterministic).
- [x] T004b Dispatch fix wave for the 7 bucket-2 folders via 3 parallel `cli-opencode` dispatches (`118-frontmatter-versioning`'s 5 leaves, `anobel.com/003-slider-refactor`, `barter/002-text-wrap-balance-react-native`).
- [x] T005 Independently re-verify each fixed packet root with `validate.sh --strict --recursive` -- never trusted dispatch self-reports. Evidence: all 3 dispatches confirmed via real re-runs; bucket 1/2 both at 0 remaining items on re-triage.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Report and final sweep.

- [x] T006 Compile the bucket-3 list and write the grandfather-mechanism recommendation. Evidence: `implementation-summary.md` Known Limitations section.
- [x] T007 Run a final full sweep confirming only bucket-3 folders remain failing; author implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed (`validate.sh --strict` exits 0 for this folder).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
