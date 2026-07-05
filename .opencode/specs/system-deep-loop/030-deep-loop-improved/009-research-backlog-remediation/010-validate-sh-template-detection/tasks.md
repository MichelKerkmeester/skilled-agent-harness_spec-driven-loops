---
title: "Tasks: Validate.sh Template-Scaffold Detection"
description: "Task list for the SCAFFOLD_NEVER_TOUCHED validate.sh rule."
trigger_phrases:
  - "validate.sh template detection tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/010-validate-sh-template-detection"
    last_updated_at: "2026-07-01T08:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Validate.sh Template-Scaffold Detection

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `check-comment-hygiene.sh` (the standalone-rule pattern from child 003) as the structural reference instead of `PLACEHOLDER_FILLED` (which is a Node-orchestrator-internal check, not a standalone registry rule) — correctly matched the actually-relevant pattern
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Implemented `check-scaffold-never-touched.sh`: checks `plan.md`/`tasks.md`/`implementation-summary.md`/`checklist.md` for title `[template:`, `packet_pointer: "scaffold/`, or `last_updated_by: "template-author"`, flagged only when the folder's own `spec.md` status is Complete-prefixed. Correctly avoids false-positiving on non-Complete folders (verified against an existing Review-status fixture that still legitimately has `[template:...]` markers)
- [x] T003 Registered in `validator-registry.json` alongside `COMMENT_HYGIENE_MARKER` — no `validate.sh` edit needed this time, since the `SPECKIT_RULES` routing fix from child 003 already generically covers new standalone rules
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Fixture `072-scaffold-never-touched-violation` added: scaffold-signature + Complete claim → fails, independently re-confirmed
- [x] T005 Fixture `073-scaffold-never-touched-clean` added: genuinely complete folder → passes, independently re-confirmed
- [x] T006 Ran the full extended validation harness, independently re-run: **112/112 pass**, zero regressions to any existing rule
- [x] T007 Ran the new rule against `008-loop-systems-remediation` (parent-level docs), independently re-confirmed: **passes** (this orchestrating session's earlier fix of 008's own plan.md/tasks.md/implementation-summary.md, done just before this dispatch, is exactly what makes this pass). **New finding from this same check**: one of 008's own 7 children, `003-model-benchmark-reducer-ledger`, still has genuine scaffold markers in all 3 of its own docs — confirmed real, evidence-based proof the new detector works, correctly out of scope to fix in this phase (same class as the many other pre-existing, deliberately-deferred instances across phases 002-007)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 7 tasks complete; new rule catches the exact drift class from F-010, verified against both synthetic fixtures and a real newly-discovered live instance (008's own child 003); no regressions to existing rules. **Important caveat discovered and documented**: the rule is only reachable via `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` (or `SPECKIT_VALIDATE_LEGACY=1`) — the default Node-orchestrator validate.sh path does not dynamically read the shell rule registry at all, so this new rule (and `COMMENT_HYGIENE_MARKER` from child 003) is invisible to the vast majority of real invocations. This is a pre-existing architectural gap, not something introduced by this child, and fixing it (porting registry rules into the Node orchestrator, or making the orchestrator dynamically discover them) is a separate, larger undertaking outside this phase's scope.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source finding: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-010), §5#18
<!-- /ANCHOR:cross-refs -->
