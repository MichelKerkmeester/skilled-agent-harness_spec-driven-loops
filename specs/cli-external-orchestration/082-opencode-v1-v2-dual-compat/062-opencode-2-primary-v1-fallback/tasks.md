---
title: "Tasks: Phase 62: opencode-2-primary-v1-fallback"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode 2 primary v1 fallback tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 62: opencode-2-primary-v1-fallback

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the existing per-directory resolver in the fan-out runtime and cli-opencode's documented one-line resolver, plus the dual-dispatch suite, so the current PATH order and the tests that pin it are known before any change (`.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`, cli-opencode's documented resolver, `opencode-dual-dispatch.vitest.ts`)
- [x] T002 Scaffold this phase's four docs from the templates, with the level, the priority, the branch, the phase number and the review fields in place before any writing brief goes out (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Change both resolvers so the first `opencode2` anywhere on PATH wins, the first `opencode` is the fallback only when no `opencode2` exists, and `OPENCODE_BIN` still overrides both (`.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`, cli-opencode's documented one-line resolver)
- [x] T004 Replace the PATH-order test with "prefers opencode2 on a later PATH directory over opencode on an earlier one", and add "falls back to the first opencode on PATH when no opencode2 exists" and "OPENCODE_BIN overrides an opencode2 elsewhere on PATH". The old loop returned the v1 `opencode` for the new fixture, which is the negative control (`opencode-dual-dispatch.vitest.ts`)
- [x] T005 Add the shared `tests/_support/hermetic-opencode-path.ts` setup, which removes host `opencode2` directories from PATH and deletes `OPENCODE_BIN`, and wire it into both vitest projects. A host install otherwise shadows the v1 stubs the suites put first: 53 tests failed in the fan-out suites and 32 in a full run on this host before the fix (`tests/_support/hermetic-opencode-path.ts`, `.skilled/skills/system-deep-loop/vitest.config.ts`, `system-spec-kit/runtime/vitest.config.ts`)
- [x] T006 Reorder every listed page to OpenCode 2 first, with OpenCode 1 labelled the fallback for users who have not updated and no removal date: cli-opencode's SKILL.md, README.md, references/install-and-versions.md, cli-reference.md and providers-and-models.md; assets/prompt-templates.md, prompt-quality-card.md and the manual-testing-playbook overview (`.skilled/skills/cli-external-orchestration/cli-opencode/`, `.skilled/skills/cli-external-orchestration/cli-opencode/references/manual-testing-playbook.md`)
- [x] T007 [P] Reorder the opencode-setup.sh usage text so OpenCode 2 is recommended first, leaving the shell logic unchanged, and reorder `.opencode/plugins/README.md`, `.skilled/CROSS-CLI.md` and the root README.md (`.skilled/skills/cli-external-orchestration/cli-opencode/opencode-setup.sh`, `.opencode/plugins/README.md`, `.skilled/CROSS-CLI.md`, `README.md`)
- [x] T008 [P] Reorder the feature-catalog opencode-dual-version-dispatch doc, the runtime scripts README and the cli-opencode changelog v1.5.0.0, then regenerate the Hermes mirror (`.skilled/feature-catalog/opencode-dual-version-dispatch.md`, `.skilled/skills/system-deep-loop/runtime/scripts/README.md`, `.skilled/skills/cli-external-orchestration/cli-opencode/changelog.md`, the Hermes mirror)
- [x] T009 Fix one setup-file path segment in `system-spec-kit/runtime/vitest.config.ts` by hand after the writers' edit (`system-spec-kit/runtime/vitest.config.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the live proof on both versions and save it in `scratch/live/`: with both installed, the resolver returns `opencode2` v2 and an unpinned fan-out cli-opencode dispatch ran `opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max`, exit 0, reply OK; with v2 hidden from PATH, the resolver returns `opencode` v1 and an unpinned dispatch ran `opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max`, exit 0, reply OK (`scratch/live/`)
- [x] T011 Run separate read-only DeepSeek review sessions over the change and check every finding before delivery (`scratch/live/`, the resolver and doc set)
- [x] T012 Rerun the suites and the playbook from the orchestrator: plugins 533 of 533; battery, config-shape and cli-opencode script tests 85 of 85; cli-opencode playbook PASS with 72 scenarios and 0 violations; deep-loop full suite 2806 passed and 8 skipped of 2814; the combined spec-kit config runs 35 deep-loop tests green (the test suites and the cli-opencode playbook)
- [ ] T-push Commit and push to main (the resolver, tests, docs and this packet)
- [ ] T-CI Confirm CI is green on the pushed commit (the pushed commit)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, the push and CI tasks included
- [ ] No `[B]` blocked tasks remaining
- [x] Review done: separate read-only DeepSeek sessions reviewed the change
- [x] Manual verification passed: both live dispatches exit 0 and reply OK, the resolver returns v2 with both installed and v1 with v2 hidden, and the suites plus the playbook pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Live proof**: See `scratch/live/resolve-both-installed.json`, `scratch/live/resolve-v2-hidden.json`, `scratch/live/fanout-unpinned-both-installed.txt` and `scratch/live/fanout-unpinned-v2-hidden.txt`
- **The previous phase**: See `../061-v4-0-0-13-changelog-trim-and-simplify/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
