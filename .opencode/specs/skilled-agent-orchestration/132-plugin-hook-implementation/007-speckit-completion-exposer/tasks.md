---
title: "Tasks: Spec-Kit Completion-State Exposer (tool.register)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "completion state tasks"
  - "tool.register tasks"
  - "completion-state core tasks"
  - "mk-speckit-completion"
  - "cli shim parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/007-speckit-completion-exposer"
    last_updated_at: "2026-07-11T08:51:12.807Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 task breakdown across Setup, Implementation, and Verification"
    next_safe_action: "Author checklist.md verification items"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs"
      - ".opencode/plugins/mk-speckit-completion.js"
      - ".opencode/bin/speckit-completion.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-speckit-completion-exposer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Spec-Kit Completion-State Exposer (tool.register)

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

- [ ] T001 Confirm the cjs-import and tool-register exemplars: `mk-deep-loop-guard.js:28` (import core as ESM default), `mk-goal.js:16` (import `tool`), `mk-goal.js:2933` (tool block), README default-export rule (`plugins/README.md:26-28`)
- [ ] T002 Confirm both script contracts: `check-completion.sh` JSON keys (`:298-312`) and exit codes (0/1/2 at `:433,450,452`), `calculate-completeness.sh` JSON keys (`:471-473`) and exit 0 (`:584`)
- [ ] T003 [P] Select a real Level-2 packet fixture with `checklist.md` for the first test (any `.opencode/specs/**/` with a checklist)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the shared core `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs`: resolve the folder, infer level from canonical-doc presence (checklist to at least 2, decision-record to at least 3), and bound `execFileSync` with `{cwd: projectDir, timeout: 5000, maxBuffer}`
- [ ] T005 Implement the `check-completion.sh` exit-1 catch: try/catch the `execFileSync` throw and parse `err.stdout` for the JSON (the load-bearing gotcha)
- [ ] T006 Implement fail-open merge: any script or parse failure sets that section to `{status:'unavailable', error}`; the function never throws; return `{specFolder, level, filesPresent, checklist, placeholders, generatedAt}`
- [ ] T007 Create the OpenCode adapter `.opencode/plugins/mk-speckit-completion.js`: default-export-only factory returning `{ tool: { mk_speckit_completion: tool({ description, args:{ specFolder, strict }, async execute(args, ctx){ return core.computeCompletionState({...args, projectDir: ctx?.directory||process.cwd()}) } }) } }`; no event/before/after hooks; hang any test surface on `Plugin.__test`
- [ ] T008 Create the optional CLI shim `.opencode/bin/speckit-completion.cjs` over the same core; map argv to core input and print the merged JSON to stdout (Claude/Bash parity)
- [ ] T009 Add a section 3 entrypoint row for `mk-speckit-completion.js` in `.opencode/plugins/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Write the vitest core spec `completion-state.test.mjs`: real Level-2 packet asserts `result.checklist.status` and `result.placeholders.overall_completion` present; nonexistent folder asserts `result.checklist.status === 'unavailable'` and no throw
- [ ] T011 Smoke-load the plugin from the project root and a symlinked workspace to prove default-export-only loading
- [ ] T012 Grep the plugin for `console.*` and named exports; both must be zero
- [ ] T013 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict` and resolve to Errors: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Vitest parse and fail-open specs pass; plugin smoke-loads without being dropped
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
</content>
