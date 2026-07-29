---
title: "PI-020 -- Git preflight advisory delivery"
description: "This scenario validates the sk-git preflight advisory delivery under Pi for `PI-020`. It focuses on the tool_call extension surfacing the commit-scope-drops-untracked advisory as a warning reason without blocking the command."
version: 1.0.0.1
---

# PI-020 -- Git preflight advisory delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-020`.

---

## 1. OVERVIEW

This scenario validates the sk-git preflight advisory delivery under Pi for `PI-020`. It focuses on the `tool_call` extension surfacing the `commit-scope-drops-untracked` advisory as a warning `reason` without blocking the command.

The advisory is the shared sk-git preflight hook at `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. It reads the 17 `hard_rules:` from `.opencode/skills/sk-git/SKILL.md`, evaluates them against repository state, and emits `⚠ sk-git advisory`. It never blocks, fails open, and caps at three advisories per command. Pi does not call the shared hook over stdin; `.pi/extensions/git-preflight-advisory.ts` registers `pi.on("tool_call")` on `bash`, dynamic-imports the three shared `.mjs` modules by relative path, evaluates through the shared cores, and returns the advisory as `{ reason }` with no `block: true`. Any import or evaluation error is caught and returns `undefined` (fail open).

### Why This Matters

Pi runs shell commands through the `bash` tool event. A directory-scoped `git commit --only <dir>` silently excludes untracked files inside the directory and reports success by count. Without the advisory, the operator learns the omission only after the damage. This scenario proves the advisory reaches Pi as a warning reason at command time and that an extension error fails open rather than blocking the command.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `PI-020` and confirm the expected signals without contradictory evidence.

- Objective: Verify the sk-git advisory fires on a directory-scoped commit with an untracked file inside, is returned as a warning `reason` (never `block: true`), stays silent on an ordinary commit, is suppressible, and fails open.
- Real user request: `Commit the src folder for me` while `src/` holds one modified tracked file and one untracked file.
- Prompt: `As a git safety reviewer, run the sk-git preflight advisory under the Pi git-preflight-advisory extension against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, is returned as a reason with no block: true, is silenced by SKGIT_ADVISORY=0, and that an extension error returns undefined. Return the advisory text and a PASS/FAIL verdict.`
- Expected execution process: Confirm the extension exists under `.pi/extensions/` -> in-process, import the extension, register its `tool_call` handler, invoke it with a `bash` git trap command against a scratch repo -> observe the returned `{ reason }` naming `commit-scope-drops-untracked` -> repeat with `SKGIT_ADVISORY=0` and confirm `undefined` -> run an ordinary clean commit and confirm `undefined`.
- Expected signals: the handler returns `{ reason: "⚠ sk-git advisory ... [commit-scope-drops-untracked] ..." }` with no `block` property; the suppressed run returns `undefined`; the ordinary commit returns `undefined`; an import/evaluation error returns `undefined`.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the advisory text and silence evidence.
- Pass/fail: PASS when the advisory names `commit-scope-drops-untracked` AND the return has no `block: true` AND suppression returns `undefined`. FAIL if the handler blocks or no advisory appears on the trap shape.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.pi/extensions/git-preflight-advisory.ts` exists and registers `pi.on("tool_call")` on `bash`.
3. Create a disposable scratch repo with hooks detached.
4. In-process: import the extension, capture its `tool_call` handler, invoke it with the trap command against the scratch repo.
5. Repeat with `SKGIT_ADVISORY=0` and confirm `undefined`.
6. Run an ordinary clean commit and confirm `undefined`.
7. Return a concise user-facing verdict.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| PI-020 | Git preflight advisory delivery | Verify the sk-git advisory fires on a directory-scoped commit under the Pi extension, is returned as a warning reason with no block, stays silent on an ordinary commit, is suppressible, and fails open | `As a git safety reviewer, run the sk-git preflight advisory under the Pi git-preflight-advisory extension against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, is returned as a reason with no block: true, is silenced by SKGIT_ADVISORY=0, and that an extension error returns undefined. Return the advisory text and a PASS/FAIL verdict.` | 1. `bash: ls .pi/extensions/git-preflight-advisory.ts && grep -n "tool_call" .pi/extensions/git-preflight-advisory.ts` -> 2. `bash: repo=$(mktemp -d "/tmp/pi-020.XXXXXX") && git -C "$repo" init -q && git -C "$repo" config core.hooksPath "$repo/.no-hooks" && git -C "$repo" config user.email t@example.invalid && git -C "$repo" config user.name T && git -C "$repo" config commit.gpgsign false && mkdir -p "$repo/.opencode/skills/sk-git" && cp .opencode/skills/sk-git/SKILL.md "$repo/.opencode/skills/sk-git/SKILL.md" && mkdir -p "$repo/src" && printf 'seed\n' > "$repo/src/tracked.txt" && git -C "$repo" add src/tracked.txt && git -C "$repo" commit -q -m seed && printf 'mod\n' > "$repo/src/tracked.txt" && printf 'untracked\n' > "$repo/src/untracked.txt"` -> 3. `bash: node --no-warnings --input-type=module -e "import extension from './.pi/extensions/git-preflight-advisory.ts'; let handler; extension({ on: (_n, fn) => { handler = fn; } }); const r = await handler({ toolName: 'bash', input: { command: 'git commit --only src -m x' } }, { cwd: '$repo' }); process.stdout.write(JSON.stringify(r));"` -> 4. same as Step 3 with `SKGIT_ADVISORY=0` | Step 1: extension file and `tool_call` registration present; Step 3: returned JSON has `reason` containing `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`, no `block` property; Step 4: returns `undefined` | Extension source excerpt, captured return JSON from Step 3, `undefined` from Step 4, terminal transcript | PASS when the advisory names `commit-scope-drops-untracked` AND the return has no `block: true` AND Step 4 returns `undefined`; FAIL if the handler blocks or no advisory appears on the trap shape | Inspect the Step 3 return for the rule id; if absent, confirm the extension's relative import paths resolve and `ctx.cwd` points at the scratch repo; if the handler throws instead of returning `undefined`, the fail-open catch is broken |

### Optional Supplemental Checks

- Repeat Step 3 with `SKGIT_ADVISORY_SKIP=commit-scope-drops-untracked` and confirm the single-rule suppression tier also returns `undefined`.
- Invoke the handler with a non-git command and confirm it returns `undefined` (the `GIT_SHAPE` gate stops before evaluation).

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
|| `.pi/extensions/git-preflight-advisory.ts` | The Pi extension: `tool_call` on `bash`, warning returned as `{ reason }`, fail-open catch returns `undefined` |
|| `../../../../../skills/sk-git/scripts/lib/git-rule-checks.mjs` | Shared `GIT_SHAPE`, `GIT_CHECKS` the extension dynamic-imports |
|| `../../../../../skills/sk-git/scripts/lib/git-context.mjs` | Shared `createGitContext` the extension dynamic-imports |
|| `../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs` | Shared `readHardRules` + `evaluate` the extension dynamic-imports |
|| `../../../../../skills/sk-git/SKILL.md` | The 17 `hard_rules:` frontmatter |
|| `../../../../../skills/sk-git/scripts/hooks/README.md` | Runtime matrix, suppression tiers, fail-open guarantees |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: PI-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `git-preflight-advisory/git-preflight-advisory.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
