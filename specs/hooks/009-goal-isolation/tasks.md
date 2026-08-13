---
title: "Tasks: Cross-Runtime Goal Isolation"
description: "Evidence-first task sequence for replacing the global cross-runtime goal singleton with explicit per-session state."
trigger_phrases:
  - "goal isolation tasks"
  - "pi session goal tasks"
  - "cross-runtime goal implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation"
    last_updated_at: "2026-08-10T21:28:22Z"
    last_updated_by: "codex"
    recent_action: "All implementation repairs and content gates passed"
    next_safe_action: "After authorized delivery, rerun default strict validation and close the packet"
    blockers:
      - "Strict completion freshness requires clean packet paths, but the repaired diff must remain uncommitted in this task."
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:e57e8fb72b4e505b217d323458c8821f82dd0d1d910aa92ac863359b89cb1355"
      session_id: "goal-isolation-spec-20260810"
      parent_session_id: null
    completion_pct: 99
    open_questions: []
    answered_questions:
      - "Pi registered commands receive current-session identity."
      - "Cursor's current management prompt is unsupported without a native identity bridge."
      - "Devin goal adapters remain decommissioned."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Safe to run in parallel after dependencies are met |
| `[B]` | Blocked by a named dependency |

Task format: `T### [P?] Description (path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce last-writer-wins replacement with two canary objectives in an isolated state directory (`.opencode/hooks/goal/bin/goal.cjs`)
  - Evidence: first set returned `mutation=created`; second returned `mutation=replaced`; `show` exposed only B; history archived active A.
- [x] T002 Inventory goal state producers, consumers, runtime registrations, and native session-id sources (`.opencode/hooks/goal/`, `.opencode/plugins/mk-goal.js`, runtime configs)
  - Evidence: OpenCode is per-session; Pi/Cursor share `active-goal.json`; Pi/Cursor/Devin lifecycle APIs expose session identity; current Devin goal adapters are absent from tracked source/config.
- [x] T003 Document the proposed composite scope, legacy policy, alternatives, and rollback (`decision-record.md`)
- [x] T004 Create and validate the Level 3 planning packet (`specs/hooks/009-goal-isolation/`)
  - Evidence: strict packet validation exited 0 with zero errors and zero warnings.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add failing two-session, cross-runtime collision, missing-identity, malicious-identity, legacy-only, resume, and fork tests (`.opencode/hooks/goal/lib/goal-core.test.cjs`) [Evidence: negative control produced 7 expected failures; final suite passes]
- [x] T006 Implement a required `GoalScope` resolver and opaque per-session state paths (`.opencode/hooks/goal/lib/goal-core.cjs`) [Evidence: canonical tuple and workspace regressions pass inside the 91/91 integrated suite]
- [x] T007 Thread scope through every lifecycle and diagnostic operation without a singleton fallback (`.opencode/hooks/goal/lib/goal-core.cjs`) [Evidence: full A/B lifecycle matrix passes]
- [x] T008 Preserve atomic writes, directory/file permissions, archives, and current prompt hardening (`.opencode/hooks/goal/lib/goal-core.cjs`) [Evidence: mode, atomic-write, containment, multiprocess serialization, and prompt-hardening tests pass]
- [x] T009 Add legacy singleton detection plus explicit migrate/archive behavior (`.opencode/hooks/goal/lib/goal-core.cjs`, `.opencode/hooks/goal/bin/goal.cjs`) [Evidence: copied-state valid and malformed legacy canaries pass]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### Identity-Aware Management and Adapters

- [x] T010 Probe Pi's native extension command/tool API for current-session management identity (`.opencode/hooks/goal/pi/`, installed Pi type declarations)
  - Evidence: `ExtensionAPI.registerCommand` handlers receive `CommandContext`, whose `sessionManager.getSessionId()` is declared and used by existing Pi extensions.
- [x] T011 Require validated session scope for CLI/native management actions and stable missing-identity errors (`.opencode/hooks/goal/bin/goal.cjs`) [Evidence: CLI tests and missing-identity canaries pass]
- [x] T012 Pass `ctx.sessionManager.getSessionId()` through Pi input, session-start, and turn-end handlers (`.opencode/hooks/goal/pi/goal-context.ts`) [Evidence: Pi adapter suite passes]
- [x] T013 Update `/goal-pi` to use the identity-aware management surface (`.pi/prompts/goal-pi.md`) [Evidence: native and normal-discovery canaries pass]
- [x] T014 [P] Bind Cursor injection to `session_id` with a tested `conversation_id` fallback (`.opencode/hooks/goal/cursor/goal-inject.mjs`) [Evidence: Cursor adapter suite passes]
- [x] T015 [P] Document the unsupported Cursor management limitation without a global fallback (`.cursor/commands/goal-cursor.md`) [Evidence: fail-closed command test passes]
- [x] T016 Remove stale Devin goal-support claims and verify no goal adapter is registered (`.devin/hooks.v1.json`, goal docs and runtime matrices) [Evidence: final configuration probe reports zero Devin goal registrations]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:verification -->
## Phase 3: Verification

- [x] T017 Run focused core and adapter suites; repair all failures at the responsible producer (`.opencode/hooks/goal/**`) [Evidence: final 91/91]
- [x] T018 Run the complete OpenCode `mk-goal` plugin suite as the per-session regression control (`.opencode/plugins/tests/`) [Evidence: Phase 5 passed 119/119; repaired Phase 6 passes 128/128]
- [x] T019 Live-smoke two Pi sessions with distinct canaries (`.pi/extensions/goal-context.ts`) [Evidence: `PI_TWO_SESSION_CANARY=PASS`; commands create no model transcript body]
- [x] T020 Validate runtime configs and compare registrations with tracked adapter files (`.pi/`, `.cursor/hooks.json`, `.devin/hooks.v1.json`) [Evidence: `FINAL_RUNTIME_CONFIG=PASS`]
- [x] T021 Update goal contracts, state docs, commands, capability matrix, playbooks, and feature catalogs (`.opencode/hooks/goal/`, related docs) [Evidence: 16/16 documents validate]
- [x] T022 Scan for unscoped core calls and stale singleton/session-resolution claims (repository-wide focused `rg` checks) [Evidence: `rg` across `.opencode/hooks/goal/` and runtime docs returned zero stale matches]
- [B] T023 Run the authoritative workspace gate and strict packet validation from a clean delivered state. [Evidence: `run-all-drift-guards.sh` is separated from the global backlog; packet alignment is clean; default Phase 6 strict is 0/0, while recursive parent strict exits 2 with 0 errors/1 parent `dirty_tree` warning]
- [x] T024 Reconcile `checklist.md`, implementation evidence, metadata, and final scoped diff (`specs/hooks/009-goal-isolation/`). [Evidence: generated metadata and nonzero content fingerprints pass integrity/drift checks; exact status contains no task residue]
- [B] T025 Harden OpenCode persistence, remove active Devin goal remnants, align all goal manual playbooks, and close Phase 6 (`006-opencode-goal-optimization-and-devin-removal/`). [Evidence: implementation evidence is green at 128/128 OpenCode, 91/91 cross-runtime, 165/8 mirrors, zero goal alignment findings, and clean changed docs; closeout awaits default strict validation from clean packet paths]
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 and P1 requirements have direct evidence.
- [x] Two simultaneous Pi sessions retain different active goals without cross-injection.
- [x] Missing identity and legacy singleton state never select a goal implicitly.
- [x] OpenCode's existing per-session behavior remains green.
- [x] Runtime registrations, tracked files, docs, and tests agree.
- [x] No task-created temporary files remain and unrelated dirty-worktree changes were preserved.
- [ ] Default strict child and recursive parent validation exit 0 after authorized delivery cleans packet paths.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision**: `decision-record.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
