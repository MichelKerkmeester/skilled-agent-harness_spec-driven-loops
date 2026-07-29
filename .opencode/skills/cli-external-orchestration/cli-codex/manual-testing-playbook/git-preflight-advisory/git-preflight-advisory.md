---
title: "CX-029 -- Git preflight advisory delivery"
description: "This scenario validates the sk-git preflight advisory delivery under Codex for `CX-029`. It focuses on the PreToolUse exec hook surfacing the commit-scope-drops-untracked advisory without blocking the command."
version: 1.4.0.18
---

# CX-029 -- Git preflight advisory delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-029`.

---

## 1. OVERVIEW

This scenario validates the sk-git preflight advisory delivery under Codex for `CX-029`. It focuses on the `PreToolUse` `exec` hook surfacing the `commit-scope-drops-untracked` advisory without blocking the command.

The advisory is the shared sk-git preflight hook at `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. It reads the 17 `hard_rules:` from `.opencode/skills/sk-git/SKILL.md`, evaluates them against repository state, and emits `hookSpecificOutput.additionalContext` starting with `⚠ sk-git advisory`. It never blocks, fails open, and caps at three advisories per command.

### Why This Matters

Codex runs shell commands through the `exec` tool. A directory-scoped `git commit --only <dir>` silently excludes untracked files inside the directory and reports success by count. Without the advisory, the operator learns the omission only after the damage. This scenario proves the advisory reaches Codex's context at command time, served by the same hook Claude uses, and never blocks the command.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-029` and confirm the expected signals without contradictory evidence.

- Objective: Verify the sk-git advisory fires on a directory-scoped commit with an untracked file inside, stays silent on an ordinary commit, and is suppressible — all delivered as Codex `PreToolUse` `exec` `additionalContext` that never blocks.
- Real user request: `Commit the src folder for me` while `src/` holds one modified tracked file and one untracked file.
- Prompt: `As a git safety reviewer, run the sk-git preflight advisory under a Codex PreToolUse exec payload against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, arrives as additionalContext with no denial, and is silenced by SKGIT_ADVISORY=0. Return the advisory text and a PASS/FAIL verdict.`
- Expected execution process: Create a scratch repo with a modified tracked file and an untracked file under a subdir -> pipe an `exec` payload for `git commit --only <dir> -m x` (with payload `cwd`) through the shared hook -> observe the `⚠ sk-git advisory` line naming `commit-scope-drops-untracked` -> repeat with `SKGIT_ADVISORY=0` and confirm silence -> run an ordinary clean commit and confirm silence.
- Expected signals: `additionalContext` contains `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`; no denial field; the commit still runs; the suppressed re-run prints nothing; the ordinary commit prints nothing.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the advisory text and silence evidence.
- Pass/fail: PASS when the advisory names `commit-scope-drops-untracked` AND no denial field is present AND suppression silences it. FAIL if the command is blocked or no advisory appears on the trap shape.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.codex/hooks.json` registers the shared hook under `PreToolUse` matcher `exec`.
3. Create a disposable scratch repo with hooks detached.
4. Pipe the `exec` trap payload through the shared hook and capture the advisory.
5. Repeat with `SKGIT_ADVISORY=0` and confirm silence.
6. Run an ordinary clean commit and confirm silence.
7. Return a concise user-facing verdict.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CX-029 | Git preflight advisory delivery | Verify the sk-git advisory fires on a directory-scoped commit under Codex PreToolUse exec, stays silent on an ordinary commit, and is suppressible | `As a git safety reviewer, run the sk-git preflight advisory under a Codex PreToolUse exec payload against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, arrives as additionalContext with no denial, and is silenced by SKGIT_ADVISORY=0. Return the advisory text and a PASS/FAIL verdict.` | 1. `bash: grep -n "git-preflight-advisory.mjs" .codex/hooks.json` (confirm registration under PreToolUse exec) -> 2. `bash: repo=$(mktemp -d "/tmp/cx-029.XXXXXX") && git -C "$repo" init -q && git -C "$repo" config core.hooksPath "$repo/.no-hooks" && git -C "$repo" config user.email t@example.invalid && git -C "$repo" config user.name T && git -C "$repo" config commit.gpgsign false && mkdir -p "$repo/.opencode/skills/sk-git" && cp .opencode/skills/sk-git/SKILL.md "$repo/.opencode/skills/sk-git/SKILL.md" && mkdir -p "$repo/src" && printf 'seed\n' > "$repo/src/tracked.txt" && git -C "$repo" add src/tracked.txt && git -C "$repo" commit -q -m seed && printf 'mod\n' > "$repo/src/tracked.txt" && printf 'untracked\n' > "$repo/src/untracked.txt"` -> 3. `bash: printf '%s' '{"tool_name":"exec","tool_input":{"command":"git commit --only src -m x"},"cwd":"'"$repo"'"}' \| node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` -> 4. `bash: printf '%s' '{"tool_name":"exec","tool_input":{"command":"git commit --only src -m x"},"cwd":"'"$repo"'"}' \| SKGIT_ADVISORY=0 node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Step 1: registration line present under `PreToolUse` matcher `exec`; Step 3: JSON `hookSpecificOutput.additionalContext` contains `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`, no denial field; Step 4: zero stdout | `.codex/hooks.json` excerpt, captured advisory JSON, silence confirmation, terminal transcript | PASS when the advisory names `commit-scope-drops-untracked` AND no denial field is present AND Step 4 prints nothing; FAIL if the command is blocked or no advisory appears on the trap shape | Inspect the Step 3 JSON for the rule id; if absent, confirm the payload uses `tool_name: exec` with a `cwd` pointing at the scratch repo; confirm the hook is registered for the `exec` matcher |

### Optional Supplemental Checks

- Repeat Step 3 with `SKGIT_ADVISORY_SKIP=commit-scope-drops-untracked` and confirm the single-rule suppression tier also silences the advisory.
- Repeat Step 3 with a `Bash` payload and confirm the same advisory fires, proving the shared hook serves both runtime dialects.

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
|| `../../../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | The shared stdin hook the Codex `exec` matcher invokes |
|| `../../../../../skills/sk-git/SKILL.md` | The 17 `hard_rules:` frontmatter the hook parses |
|| `.codex/hooks.json` | `PreToolUse` matcher `exec` registration of the shared hook |
|| `../../../../../skills/sk-git/scripts/hooks/README.md` | Runtime matrix, suppression tiers, fail-open guarantees |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: CX-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `git-preflight-advisory/git-preflight-advisory.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
