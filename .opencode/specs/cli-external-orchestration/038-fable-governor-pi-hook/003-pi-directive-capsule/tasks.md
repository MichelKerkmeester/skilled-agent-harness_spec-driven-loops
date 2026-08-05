---
title: "Tasks: Pi Directive Capsule Layer"
description: "Injection site, directive append, tests, verification."
trigger_phrases:
  - "pi directive capsule tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Tasks authored"
    next_safe_action: "T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi Directive Capsule Layer

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Decide injection site (inline prompt-advisor.ts vs sibling extension) with code-review justification
  - [evidence: inline chosen over sibling extension — deterministic transform ordering after advisor context (`prompt-advisor.ts:16-17` comment); research approved both]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the directive constant + unconditional nonblank append (pi input transform)
  - [evidence: `PI_SUBAGENT_DISPATCH_DIRECTIVE` constant + append in `pi.on("input")`; nonblank guard `if (!event.text.trim()) return`; wording = semantic match to synthesis Layer 1 (markdown backticks normalized, examples retained)]
- [x] T003 Add tests: pi output contains directive; shared render unchanged; empty-context path covered
  - [evidence: `prompt-advisor.vitest.ts` (new) — 3 tests: directive present on nonblank, blank input untouched, shared renderer pi-agnostic; `npx vitest run tests/hooks/prompt-advisor.vitest.ts` 3/3 pass]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run vitest; headless pi -p smoke run (exit 0)
  - [evidence: `npx vitest` focused green; headless `pi -p --model deepseek/deepseek-v4-flash` smoke exit 0 (codex could not run it — no env key; parent verified)]
- [x] T005 Run validate.sh --strict on this folder
  - [evidence: `validate.sh --strict` on this folder — PASSED (Errors: 0, Warnings: 0)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`
  - [evidence: `grep -c "\[x\]" tasks.md` matches task count; completion verified via `validate.sh --strict`]
- [x] validate.sh --strict exits 0
  - [evidence: `bash validate.sh <folder> --strict` — RESULT: PASSED, 0 errors 0 warnings]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
