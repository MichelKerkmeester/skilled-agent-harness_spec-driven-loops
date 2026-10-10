---
title: "Implementation Plan: Phase 3: codex-mirror-gate"
description: "Add the Codex mirror to the agent-mirror checker's path pattern and orphan check, and to both pre-commit hook filters, with three Vitest regression cases."
trigger_phrases:
  - "codex mirror gate plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: codex-mirror-gate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS for the checker and its library, Bash for the pre-commit hooks |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest 4.1.11 for `check-agent-mirror-sync.vitest.ts`, plus shell checks over the checker and the hooks |

### Overview
The change widens one pattern in three places. The checker's path pattern and the two hook filters gain `codex`, and the checker's orphan check gains the Codex mirror path beside the Claude one. Three Vitest cases copy the checker into a temporary tree, the way the existing cases do, and cover the Codex path, Codex drift and a Codex orphan. The shared library needs no change, because its runtime list already includes Codex.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One gate with one checker, one verifier library and two hook filters. The checker decides which changed paths name an agent, and the library decides whether each runtime mirror matches the canonical.

### Key Components
- **Path pattern** (`check-agent-mirror-sync.cjs`, line 32): decides which changed paths name an agent. Gains `codex`.
- **Orphan check** (`check-agent-mirror-sync.cjs`, lines 82 to 88): when the canonical `.opencode/agents/<name>.md` is absent, lists the runtime mirrors that remain. Gains `.codex/agents/<name>.toml`.
- **Runtime list** (`lib/mirror-sync-verify.cjs`, lines 18 to 22): already lists Codex as an optional `toml` mirror, and its body normalizer already rewrites `.codex/agents/*.toml` paths (line 112). Read only in this phase.
- **Hook filters** (`.skilled/hooks/git/pre-commit` line 87, `.skilled/scripts/git-hooks/pre-commit` line 170): decide which staged paths reach the checker. Each gains `codex`.

### Data Flow
A staged path that matches `^\.(opencode|skilled|claude|codex)/agents/` is passed to the checker. Canonical edits arrive as `.skilled/agents/<name>.md`, because `.opencode/agents` is a symlink to that directory. The checker takes the file name without its extension as the agent name. When `.opencode/agents/<name>.md` exists, the library compares the canonical body with each mirror, and a Codex mirror that is absent counts as not shipped. When the canonical is absent, the orphan check reports each Claude or Codex mirror that remains as drift, and the checker exits 1.

### Decisions
- **One explicit Codex entry in the orphan list.** The orphan list is a literal of two paths, and a third literal line is the smallest change that matches the Claude behavior. Deriving the list from `RUNTIME_MIRRORS` would touch the library's exports for one entry, so it waits for a fourth runtime.

### Known gap, not fixed here
`.pi/agents/` has the same gap, and this was measured. `.pi/agents/` holds twelve tracked mirror files. Running `node <checker> .pi/agents/code.md` prints `no agent files to check` and exits 0. `AGENT_PATH_RE` has no `pi`, neither hook filter has `pi`, and `RUNTIME_MIRRORS` has no `pi`, so no check reads that folder. `.cursor/agents/`, `.devin/agents/` and `.hermes/agents/` also exist and are absent from all three lists. Closing the gap needs a decision on which of these folders are repo-managed mirrors, so it is left for a separate phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Regression first.** The three Vitest cases are written before any checker or hook edit, and the first run must show them failing. After the checker edit, the same file must show six passing cases.
- **Vitest run.** From the deep-improvement `scripts/` directory, run `../../../system-spec-kit/node_modules/.bin/vitest run shared/tests/check-agent-mirror-sync.vitest.ts`. Each case copies the checker and the library into a temporary tree and removes that tree when it finishes, so the repository's own agents are not read as fixtures. Vitest may write a results cache under `scripts/node_modules/`, which `.gitignore` excludes at line 50.
- **Shell checks.** The checker on the Codex path, `--all`, the `.pi/agents/` probe, a `grep` of both hook filters, `bash -n` on both hooks, and `diff` of the checker and the library against the pre-edit copies.
- **Orphan proof is test-only.** The repository has no orphan Codex mirror, and creating one would write into the tree. The Vitest orphan case is the only proof of REQ-002.
- **Not covered here.** No hook-level test runs the pre-commit path end to end. The pre-commit test file is outside the Files to Change table, so this is a proposed follow-up.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `system-deep-loop/node_modules/@spec-kit/shared`, required by the checker and the library. Present in this worktree.
- `system-spec-kit/node_modules/.bin/vitest` (4.1.11), the test runner. It is not on PATH. It was not run during planning, so its baseline is unknown until the builder's Phase 1 runs it.
- The global hook link described in the Risks table. A commit made in this worktree runs the main checkout's copy of the second hook.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each of the five files has a pre-edit copy in `scratch/before/`, saved by task T001. To roll back, copy each copy back to its original path with `cp`. The Vitest copy restores the original three cases and removes the Codex cases. No git command is needed.
<!-- /ANCHOR:rollback -->

---
