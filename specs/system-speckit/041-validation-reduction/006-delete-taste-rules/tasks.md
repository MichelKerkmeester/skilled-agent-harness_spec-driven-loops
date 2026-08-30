---
title: "Task Breakdown: Rules Nothing Reads"
description: "Measure, establish readers, delete, prove no drift."
trigger_phrases:
  - "delete taste rules tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/006-delete-taste-rules"
    last_updated_at: "2026-08-30T08:15:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Deleted nine advisory rules and every reference to them"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Rules Nothing Reads

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P0] Baseline the pinned 300-packet sample. Evidence: 236 pass, 64 fail.
- [x] T-002 [P0] Measure per-rule behaviour across the sample. Evidence: `LINKS_VALID` and `SCOPE_ADHERENCE` reported inert on 296 of 296 runs; `GOAL_SHAPE` no-op on 294 of 296; `PHASE_LINKS` and `PHASE_PARENT_CONTENT` no-op on 259 of 296; `EVIDENCE_CITED` fired 92 times.
- [x] T-003 [P0] Distinguish "reported nothing" from "did not apply" by reading the rules' actual messages. Evidence: `LINKS_VALID` prints that it is skipped unless `SPECKIT_VALIDATE_LINKS=true`; `SCOPE_ADHERENCE` prints "not active (no change-set provided)".
- [x] T-004 [P0] Search the whole repository per candidate for consumers. Evidence: `AC_COVERAGE` is named in deep review's SKILL.md and completion-criteria.md and in two command assets, so it was removed from the deletion set; the other nine had references only in the registry, their own implementation and tests, and documentation.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Remove nine entries from `validator-registry.json`. Evidence: 45 to 36 entries, diff is 87 deletions and 0 insertions.
- [x] T-102 [P0] Delete eight rule scripts and one node rule, plus three dedicated test files.
- [x] T-103 [P0] Remove the native `PRIORITY_TAGS` implementation, its call site, and `extractMergedVerification`, which had no other caller.
- [x] T-104 [P1] Prune `scripts-registry.json`. Evidence: 27 deletions and 0 insertions after replacing a whole-file rewrite that had reordered keys.
- [x] T-105 [P1] Remove the remediation hints for deleted rules from `progressive-validate.sh`.
- [x] T-106 [P0] Remove or rewire the tests: two `EVIDENCE_CITED` tests in the hardening suite and two suites in the system suite deleted; the orchestrator bridge test moved onto `CONTINUITY_FRESHNESS`, which still ships.
- [x] T-107 [P1] Update the documentation: six sections removed from the rules reference and the remainder renumbered, summary tables pruned, env vars removed, and one playbook whose only subject was a deleted rule removed with its index row.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] Verdicts unchanged. Evidence: 300 of 300 packets verdict-identical, 0 regressions, 0 changes in the other direction.
- [x] T-202 [P0] Test suites green. Evidence: `test:validation` exit 0 with 91, 34 and 87 passing; the four affected vitest suites 33 of 33; the orchestrator bridge 9 of 9.
- [x] T-203 [P0] No reference survives. Evidence: a repo-wide search for the nine names outside `specs/`, changelogs, `node_modules` and `dist` returns nothing.
- [x] T-204 [P1] The node-rule execution path is still reachable. Evidence: three `.ts` rules remain registered.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- Nine rules removed, the corpus unaffected, and nothing left referring to them.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 through REQ-004
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
