---
title: "CO-038 -- Git preflight advisory delivery"
description: "This scenario validates the sk-git preflight advisory delivery under OpenCode for `CO-038`. It focuses on the tool.execute.before plugin surfacing the commit-scope-drops-untracked advisory via the next experimental.chat.system.transform without printing or blocking."
version: 1.3.0.12
---

# CO-038 -- Git preflight advisory delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-038`.

---

## 1. OVERVIEW

This scenario validates the sk-git preflight advisory delivery under OpenCode for `CO-038`. It focuses on the `tool.execute.before` plugin surfacing the `commit-scope-drops-untracked` advisory via the next `experimental.chat.system.transform` without printing to stdout/stderr and without blocking the command.

The advisory is the shared sk-git preflight hook at `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. It reads the 17 `hard_rules:` from `.opencode/skills/sk-git/SKILL.md`, evaluates them against repository state, and emits `⚠ sk-git advisory`. It never blocks, fails open, and caps at three advisories per command. OpenCode plugins must never print (stdout/stderr overlays the TUI prompt line), so `.opencode/plugins/mk-git-preflight-advisory.js` evaluates through the shared cores, buffers at most 20 advisory events, and drains them once into the next `experimental.chat.system.transform` as `output.system` context. The command itself is never delayed or blocked.

### Why This Matters

OpenCode runs shell commands through the `bash` tool. A directory-scoped `git commit --only <dir>` silently excludes untracked files inside the directory and reports success by count. Without the advisory, the operator learns the omission only after the damage. This scenario proves the advisory reaches the agent on the next turn after the command event, with no stdout/stderr and no blocked command.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-038` and confirm the expected signals without contradictory evidence.

- Objective: Verify the sk-git advisory fires on a directory-scoped commit with an untracked file inside, is delivered as next-turn `output.system` context (never stdout/stderr), stays silent on an ordinary commit, is suppressible, and never blocks.
- Real user request: `Commit the src folder for me` while `src/` holds one modified tracked file and one untracked file.
- Prompt: `As a git safety reviewer, run the sk-git preflight advisory under the OpenCode mk-git-preflight-advisory plugin against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, appears in output.system on the next experimental.chat.system.transform with no stdout/stderr and no block, and is silenced by SKGIT_ADVISORY=0. Return the advisory text and a PASS/FAIL verdict.`
- Expected execution process: Confirm the plugin exists under `.opencode/plugins/` -> in-process, import the plugin, fire `tool.execute.before` with a `bash` git trap command against a scratch repo -> fire `experimental.chat.system.transform` and read `output.system` -> observe the `⚠ sk-git advisory` line naming `commit-scope-drops-untracked` -> repeat with `SKGIT_ADVISORY=0` and confirm `output.system` stays empty -> confirm no stdout/stderr was written at any point.
- Expected signals: `output.system` contains `⚠ sk-git advisory` and `[commit-scope-drops-untracked]` after the transform; no `block`/denial; the command call returns; no plugin stdout or stderr; the suppressed run leaves `output.system` empty.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the advisory text and silence evidence.
- Pass/fail: PASS when the advisory names `commit-scope-drops-untracked` AND appears in `output.system` (not stdout/stderr) AND no block AND suppression empties `output.system`. FAIL if the plugin prints, blocks, or no advisory appears on the trap shape.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.opencode/plugins/mk-git-preflight-advisory.js` exists and hooks `tool.execute.before` for `bash`.
3. Create a disposable scratch repo with hooks detached.
4. In-process: import the plugin, fire `tool.execute.before` with the trap command, then fire `experimental.chat.system.transform` and read `output.system`.
5. Repeat with `SKGIT_ADVISORY=0` and confirm `output.system` stays empty.
6. Confirm no stdout/stderr was written during either step.
7. Return a concise user-facing verdict.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CO-038 | Git preflight advisory delivery | Verify the sk-git advisory fires on a directory-scoped commit under the OpenCode plugin, is delivered as next-turn output.system with no stdout/stderr, stays silent on an ordinary commit, is suppressible, and never blocks | `As a git safety reviewer, run the sk-git preflight advisory under the OpenCode mk-git-preflight-advisory plugin against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, appears in output.system on the next experimental.chat.system.transform with no stdout/stderr and no block, and is silenced by SKGIT_ADVISORY=0. Return the advisory text and a PASS/FAIL verdict.` | 1. `bash: ls .opencode/plugins/mk-git-preflight-advisory.js && grep -n "tool.execute.before" .opencode/plugins/mk-git-preflight-advisory.js` -> 2. `bash: repo=$(mktemp -d "/tmp/co-038.XXXXXX") && git -C "$repo" init -q && git -C "$repo" config core.hooksPath "$repo/.no-hooks" && git -C "$repo" config user.email t@example.invalid && git -C "$repo" config user.name T && git -C "$repo" config commit.gpgsign false && mkdir -p "$repo/.opencode/skills/sk-git" && cp .opencode/skills/sk-git/SKILL.md "$repo/.opencode/skills/sk-git/SKILL.md" && mkdir -p "$repo/src" && printf 'seed\n' > "$repo/src/tracked.txt" && git -C "$repo" add src/tracked.txt && git -C "$repo" commit -q -m seed && printf 'mod\n' > "$repo/src/tracked.txt" && printf 'untracked\n' > "$repo/src/untracked.txt"` -> 3. `bash: node --input-type=module -e "import plugin from './.opencode/plugins/mk-git-preflight-advisory.js'; const hooks = await plugin({ directory: '$repo' }); await hooks['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git commit --only src -m x' } }); const output = { system: [] }; await hooks['experimental.chat.system.transform']({}, output); process.stdout.write(JSON.stringify(output));"` -> 4. `bash: node --input-type=module -e "import plugin from './.opencode/plugins/mk-git-preflight-advisory.js'; const hooks = await plugin({ directory: '$repo' }); await hooks['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git commit --only src -m x' } }); const output = { system: [] }; await hooks['experimental.chat.system.transform']({}, output); process.stdout.write(JSON.stringify(output));"` with `SKGIT_ADVISORY=0` | Step 1: plugin file and `tool.execute.before` hook present; Step 3: `output.system` contains `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`, no stdout/stderr, no block; Step 4: `output.system` is empty | Plugin source excerpt, captured `output.system` JSON from Step 3, empty `output.system` from Step 4, terminal transcript | PASS when the advisory names `commit-scope-drops-untracked` AND appears in `output.system` (not stdout/stderr) AND no block AND Step 4 empties `output.system`; FAIL if the plugin prints, blocks, or no advisory appears on the trap shape | Inspect the Step 3 `output.system` for the rule id; if absent, confirm the plugin `directory` resolves to the scratch repo and `findRepoRoot` returns it; if the plugin printed, that is a hard FAIL (plugins must never print) |

### Optional Supplemental Checks

- Repeat Step 3 with `SKGIT_ADVISORY_SKIP=commit-scope-drops-untracked` and confirm the single-rule suppression tier also empties `output.system`.
- Fire `tool.execute.before` with a non-git command and confirm `output.system` stays empty (the `GIT_SHAPE` gate stops before evaluation).

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
||---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| `git-preflight-advisory/git-preflight-advisory.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

|| File | Role |
||---|---|
|| `.opencode/plugins/mk-git-preflight-advisory.js` | The OpenCode plugin: `tool.execute.before` on `bash`, bounded next-turn `experimental.chat.system.transform` delivery, no stdout/stderr |
|| `../../../../../skills/sk-git/scripts/lib/git-rule-checks.mjs` | Shared `GIT_SHAPE`, `GIT_CHECKS` the plugin imports |
|| `../../../../../skills/sk-git/scripts/lib/git-context.mjs` | Shared `createGitContext` the plugin imports |
|| `../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs` | Shared `readHardRules` + `evaluate` the plugin imports |
|| `../../../../../skills/sk-git/SKILL.md` | The 17 `hard_rules:` frontmatter |
|| `../../../../../skills/sk-git/scripts/hooks/README.md` | Runtime matrix, suppression tiers, fail-open guarantees |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: CO-038
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `git-preflight-advisory/git-preflight-advisory.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
