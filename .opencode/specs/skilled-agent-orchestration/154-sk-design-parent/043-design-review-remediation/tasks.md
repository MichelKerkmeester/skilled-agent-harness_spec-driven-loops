---
title: "Tasks: design-review remediation (042 findings)"
description: "Task breakdown for the 14-finding remediation: setup/scoping, per-finding implementation, and verification with invariant re-confirmation."
trigger_phrases:
  - "043-design-review-remediation tasks"
  - "design review remediation tasks"
  - "sk-design findings remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/043-design-review-remediation"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark all remediation tasks complete with verification evidence"
    next_safe_action: "Run validate.sh --strict and reconcile completion metadata"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-043-design-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All tasks closed and verified"
      - "No blocked tasks remaining"
---
# Tasks: design-review remediation (042 findings)

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Enumerate the 14 findings from the 042 review with priority and target file (042-design-work-deep-review/review/review-report.md)
- [x] T002 [P] Confirm each finding file path exists and is in scope (spec.md Files to Change)
- [x] T003 [P] Identify the verification command per fix (plan.md Testing Strategy)
- [x] T004 Inventory affected surfaces and consumers for changed helpers (plan.md Affected Surfaces)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P1] Rewrite `parseGuidedRunArgs` to skip value flags + values and boolean flags; reject missing/`--` values, F-01 (guided-run.ts)
- [x] T011 Add preflight + run command timeouts; surface SIGTERM/error/null-status as failure, F-02 (guided-run.ts)
- [x] T012 Add `unsafeOutputPathReason` for `--output` inside backend/skill root, F-03 (guided-run.ts)
- [x] T013 Denylist state-changing CTA intents in `triggerModals`, F-04 (crawl.ts)
- [x] T014 Make `dismissCookieBanners` consent-safe via known selectors, F-05 (crawl.ts)
- [x] T015 Extend `isCaptchaPage` provider coverage, F-06 (crawl.ts)
- [x] T016 Normalize `--extra-urls` like the primary URL, F-07 (extract.ts)
- [x] T017 [P] De-duplicate section-header comments where clean, F-08 (crawl.ts, extract.ts)
- [x] T018 Tighten proof_check READY `**` branch to a verdict/result/checkbox anchor, F-09 (proof_check.py)
- [x] T019 Add advisory-signals line to the human report, F-10 (score-skill-benchmark.cjs)
- [x] T020 Extract shared `md_table.py` and rewire 7 gate scripts via `__file__`-relative imports, F-11 (shared/scripts/md_table.py + gate scripts)
- [x] T021 Narrow OpenCode design agent to `webfetch:deny` for parity, F-12 (.opencode/agents/design.md)
- [x] T022 Clarify `mode-registry.json` prose; no behavioral change, F-13 refuted (mode-registry.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Type-check md-generator backend, tsc 0 errors (guided-run.ts, crawl.ts, extract.ts)
- [x] T031 Probe parser positive + missing-value cases (guided-run.ts)
- [x] T032 py_compile all 7 gate scripts + md_table.py; confirm imports resolve from a foreign cwd
- [x] T033 Confirm gates still bite: numeric_law_check (exit 1), naming_doc_check (exit 0), proof_check lanes
- [x] T034 `node --check` the benchmark scorer; confirm hubRoute 34/29/5/0 unchanged
- [x] T035 Re-confirm standing invariants: surface-check PASS drift=0, evergreen 0 leaks
- [x] T036 Author packet docs and run validate.sh `--strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All actionable findings landed and orchestrator-verified
- [x] All standing invariants re-confirmed holding
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
