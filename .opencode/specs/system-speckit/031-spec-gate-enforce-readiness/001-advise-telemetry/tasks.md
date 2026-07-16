---
title: "Tasks: Spec-gate advise & would-deny telemetry [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec gate telemetry tasks"
  - "formatSpecGateEvent"
  - "wouldDeny discriminator"
  - "telemetry log line"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-spec-gate-enforce-readiness/001-advise-telemetry"
    last_updated_at: "2026-07-11T11:05:56.873Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level-2 task breakdown (T001-T012)"
    next_safe_action: "Start T001: add wouldDeny to evaluateMutation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/plugins/mk-spec-gate.js"
      - ".opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advise-telemetry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Spec-gate advise & would-deny telemetry

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

- [ ] T001 Add a `wouldDeny` boolean to `evaluateMutation`'s return, computed from deny-capable tool + open, unanswered gate + non-exempt path, independent of the enforce env (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T002 Add exported `formatSpecGateEvent({runtime, sessionID, tool, filePath, decision})` returning the sanitized pipe-delimited payload (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T003 [P] Add a field sanitizer (strip `|`, `\n`, `\r`; clamp length; empty → `-`) used by the formatter (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Generalize `appendWarningLog` so the composed `detail` carries the decision (drop the hardcoded `ADVISE:`; keep ISO timestamp, `[mk-spec-gate]` tag, rotation, fail-open) (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T005 OpenCode `tool.execute.before`: compose `formatSpecGateEvent({runtime:'opencode', ...})` and write via `appendWarningLog` on advise/would-deny; never stdout/stderr (`.opencode/plugins/mk-spec-gate.js`)
- [ ] T006 Claude `spec-gate-enforce.mjs`: resolve `stateDir` via `guardCore.resolveGuardPaths(projectDir)` and write the structured line (runtime `claude`) on advise/would-deny; stop depending on `additionalContext` landing (`.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs`)
- [ ] T007 Confirm both adapters short-circuit on `MK_SPEC_GATE_DISABLED=1` before any log call (`.opencode/plugins/mk-spec-gate.js`, `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add core tests: `formatSpecGateEvent` single-line + sanitization; `wouldDeny` discriminator (write/edit-open-nonexempt = true, bash/exempt/satisfied = false); byte-identical format across runtimes (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T009 Add core tests: disabled writes nothing; one-line parseability for a hostile filePath; rotation still bounded after structured lines (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T010 Run `node --test .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`; confirm the existing 20+ tests still green (`decision`/`detail` backward-compatible)
- [ ] T011 Live smoke: a source-file Write with an open gate produces exactly one parseable line on OpenCode and on Claude; disabled writes nothing
- [ ] T012 Re-run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/031-spec-gate-enforce-readiness/001-advise-telemetry --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `node --test` green (existing + new)
- [ ] One parseable telemetry line per open-gate mutation event on both runtimes; disabled writes nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
