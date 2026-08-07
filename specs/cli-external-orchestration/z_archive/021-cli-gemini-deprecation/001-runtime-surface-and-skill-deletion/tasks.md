---
title: "Tasks: Deprecate project .gemini runtime surface"
description: "Executable task list for deleting project .gemini and updating active non-spec references."
trigger_phrases:
  - "gemini deprecation tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/021-cli-gemini-deprecation/001-runtime-surface-and-skill-deletion"
    last_updated_at: "2026-06-05T07:35:35Z"
    last_updated_by: "opencode"
    recent_action: "Completed .gemini deletion"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".gemini/**"
      - "AGENTS.md"
      - "README.md"
      - ".opencode/commands/**"
      - ".opencode/skills/**"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gemini-deprecation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deprecate project .gemini runtime surface

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Resolve deletion semantics and historical spec scope. [EVIDENCE: user clarified "Deleted | historic specs = all specs"]
- [x] T002 Scaffold missing Level 3 packet files. [EVIDENCE: create.sh returned DOC_LEVEL=3 and created spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md, decision-record.md, description.json]
- [x] T003 Persist complete-config.json with bound auto-mode setup values. [EVIDENCE: complete-config.json records executionMode=auto, dispatchMode=single_agent, memoryChoice=skip, selectedLevel=3]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Inventory tracked `.gemini/**` files and active non-spec project `.gemini` references. [EVIDENCE: `git diff --name-only` shows deleted tracked `.gemini/**`; targeted `rg --pcre2` disallowed path scan returned no output]
- [x] T005 Delete tracked `.gemini/**` project runtime files and `.opencode/skills/cli-gemini/**` skill files. [EVIDENCE: `glob .gemini/**` and `glob .opencode/skills/cli-gemini/**` returned no files]
- [x] T006 Update `AGENTS.md`, `README.md`, and maintainer scripts to remove project `.gemini` guidance. [EVIDENCE: edited top-level docs and `scripts/setup-maintainer-filters.sh`; final disallowed path scan clean]
- [x] T007 Update `.opencode/commands/**` command assets and doctor routes/scripts to remove project `.gemini` config and mirror targets. [EVIDENCE: command-surface alignment drift PASS after doctor script fixes]
- [x] T008 Update `.opencode/skills/**` runtime manifests, source files, tests, and active docs that require project `.gemini` paths. [EVIDENCE: runtime/parity tests updated and passing; skills alignment drift PASS]
- [x] T009 Remove active `cli-gemini` skill registrations, catalog rows, and advisor fallback routes. [EVIDENCE: skill graph compiler validates 21 skills; generated graph JSON has no `cli-gemini`; fallback advisor recommendation for `use gemini cli for second opinion` returns `cli-codex`, not `cli-gemini`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run targeted search proving no active project `.gemini` references remain outside specs and documented exceptions. [EVIDENCE: final disallowed `.gemini/(agents|commands|workflows|scripts|skills|specs|changelog|settings.json|GEMINI.md|.utcp_config.json)` scan returned no output]
- [x] T011 Run targeted syntax/unit tests for changed scripts, TypeScript, JSON, and YAML files. [EVIDENCE: SpecKit runtime tests 33/33 pass; deep-loop parity 16 pass/1 skipped; phase workflow 89/89 pass; JSON/TOML/Python/Shell/YAML syntax checks pass]
- [x] T012 Run OpenCode alignment/comment hygiene checks for changed `.opencode` scope. [EVIDENCE: alignment drift PASS for `.opencode/agents`, `.opencode/commands`, `.opencode/skills`; changed-code comment hygiene clean]
- [x] T013 Run strict SpecKit validation for this packet. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation --strict` returned RESULT: PASSED with 0 errors and 0 warnings]
- [x] T014 Update implementation-summary.md, checklist.md, graph metadata, and memory context. [EVIDENCE: `memory_index_scan` completed with 21 indexed, 0 failed, and 11 pending vectors for the active packet plus constitutional context]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence. [EVIDENCE: T001-T014 are checked with evidence]
- [x] No `[B]` blocked tasks remaining. [EVIDENCE: no tasks use `[B]`]
- [x] Targeted active-reference search is clean or only approved exceptions remain. [EVIDENCE: disallowed project path scan returned no output; root `.gemini` refs are absence/user-home exceptions]
- [x] Strict packet validation passes. [EVIDENCE: strict validation RESULT: PASSED]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
