---
title: "Tasks: Comprehensive Skills and MCP Server Bug Fix"
description: "Task breakdown for the analysis, implementation, verification and cleanup of 63+ bugs across 9 skills, 5 MCP servers and 25+ library files."
trigger_phrases:
  - "comprehensive skills bug fix tasks"
  - "mcp server bug fix task breakdown"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Comprehensive Skills and MCP Server Bug Fix

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

> Per-task state was not recorded at the time, so every task below is listed pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Analysis (15 Parallel Agents)

- [ ] T001 Analyze system-memory SKILL.md documentation
- [ ] T002 Analyze semantic-memory.js
- [ ] T003 Analyze core libs (embeddings, vector-index, hybrid-search)
- [ ] T004 Analyze scoring libs (scoring, tiers, composite)
- [ ] T005 Analyze integration libs (trigger, parser, config, checkpoints)
- [ ] T006 Analyze the system-spec-kit, mcp-leann, mcp-code-context and mcp-code-mode SKILL.md files
- [ ] T007 Analyze cross-skill consistency, MCP configuration, AGENTS.md alignment and security
- [ ] T008 Analyze the workflow skills (sk-doc, workflows-code, sk-git, mcp-chrome-devtools)
- [ ] T009 Compile the bug report across logic, integration, configuration, documentation, error handling, security, performance and consistency categories
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fix Implementation (15 Parallel Agents)

- [ ] T010 Fix path validation, JSON parsing and error handlers in semantic-memory.js
- [ ] T011 Fix null checks, buffer handling and validation in vector-index.js
- [ ] T012 Fix useDecay forwarding, result shape and FTS5 escaping in hybrid-search.js
- [ ] T013 Fix constitutional tier, score overflow and Infinity handling in the scoring libs
- [ ] T014 Fix error handling and race conditions in checkpoints.js
- [ ] T015 Fix JSONC support, null handling and path validation in config-loader.js
- [ ] T016 Fix regex pre-compilation and the token count bug in the trigger libs
- [ ] T017 Add sensitive file patterns to `.gitignore` and fix the trailing comma in `opencode.json`
- [ ] T018 Fix gate references, MCP syntax and missing sections in system-memory/SKILL.md
- [ ] T019 Fix tool names and examples in mcp-leann/SKILL.md
- [ ] T020 Fix limitations and troubleshooting in mcp-code-context/SKILL.md
- [ ] T021 Fix the duplicate line and context parameter in mcp-code-mode/SKILL.md
- [ ] T022 Fix gate alignment in system-spec-kit/SKILL.md
- [ ] T023 Fix broken anchors and phase transitions in workflows-code/SKILL.md
- [ ] T024 Fix missing tools and error handling in sk-git/SKILL.md and mcp-chrome-devtools/SKILL.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (10 Parallel Agents)

- [ ] T025 Verify all semantic-memory.js fixes
- [ ] T026 Verify the vector-index.js and hybrid-search.js fixes
- [ ] T027 Verify the scoring lib fixes
- [ ] T028 Verify the integration lib fixes
- [ ] T029 Verify the system-memory SKILL.md and README
- [ ] T030 Verify the mcp-leann and mcp-code-context SKILL.md files
- [ ] T031 Verify the mcp-code-mode and system-spec-kit SKILL.md files
- [ ] T032 Verify the workflow skill files
- [ ] T033 Verify the config files (`.gitignore`, `opencode.json`)
- [ ] T034 Run the cross-file consistency check
- [ ] T035 Confirm syntax validity, correct application, no regressions and no new issues
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Cleanup

- [ ] T036 Fix the old MCP syntax in `system-memory/references/troubleshooting.md`
- [ ] T037 Fix the short tool names in `mcp-leann/references/tool_catalog.md`
- [ ] T038 Fix the function call syntax in `mcp-code-context/assets/usage_examples.md`
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
