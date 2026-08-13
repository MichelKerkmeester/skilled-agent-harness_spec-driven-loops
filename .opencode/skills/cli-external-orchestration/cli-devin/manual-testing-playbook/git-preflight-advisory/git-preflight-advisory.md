---
title: "DV-021 -- Git preflight advisory delivery"
description: "Verify the sk-git preflight advisory fires under a Devin PreToolUse exec payload, stays silent on an ordinary commit, is suppressible, and never blocks the command."
version: 1.0.0.0
---

# DV-021 -- Git preflight advisory delivery

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-021`.

## 1. OVERVIEW

Verify the sk-git preflight advisory reaches a Devin `PreToolUse` `exec` event on a directory-scoped commit that would silently drop an untracked file, and that the advisory never blocks the command.

The advisory is the shared sk-git preflight hook at `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. It reads the 17 `hard_rules:` from `.opencode/skills/sk-git/SKILL.md`, evaluates them against repository state, and emits `hookSpecificOutput.additionalContext` starting with `⚠ sk-git advisory`. It never blocks, fails open, and caps at three advisories per command. Devin registers it directly under `.devin/hooks.v1.json` `PreToolUse` matcher `^exec$`, in the same `DEVIN_PROJECT_DIR` shell envelope its sibling hooks use, with an approval-JSON fallback so a resolution failure still approves.

### Why This Matters

Devin runs shell commands through the `exec` tool. A directory-scoped `git commit --only <dir>` silently excludes untracked files inside the directory and reports success by count. Without the advisory, the operator learns the omission only after the damage. This scenario proves the advisory reaches Devin's context at command time and that a hook error fails open rather than blocking the command.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the sk-git advisory fires on a directory-scoped commit with an untracked file inside, stays silent on an ordinary commit, is suppressible, and fails open — all delivered as Devin `PreToolUse` `exec` `additionalContext` that never blocks.
- Real user request: `Commit the src folder for me` while `src/` holds one modified tracked file and one untracked file.
- Prompt: `As a git safety reviewer, run the sk-git preflight advisory under a Devin PreToolUse exec payload against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, arrives as additionalContext with no denial, is silenced by SKGIT_ADVISORY=0, and that a hook resolution failure fails open. Return the advisory text and a PASS/FAIL verdict.`
- Expected execution process: Confirm the `.devin/hooks.v1.json` registration under `PreToolUse` `^exec$` -> create a scratch repo with a modified tracked file and an untracked file under a subdir -> pipe an `exec` payload for `git commit --only <dir> -m x` through the shared hook -> observe the advisory naming `commit-scope-drops-untracked` -> repeat with `SKGIT_ADVISORY=0` and confirm silence -> run an ordinary clean commit and confirm silence.
- Expected signals: `additionalContext` contains `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`; no denial field; the commit still runs; the suppressed re-run prints nothing; the ordinary commit prints nothing; the registered fallback approves when the hook cannot resolve.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the advisory text and silence evidence.
- Pass/fail: PASS when the advisory names `commit-scope-drops-untracked` AND no denial field is present AND suppression silences it. FAIL if the command is blocked or no advisory appears on the trap shape.

---

## 3. TEST EXECUTION

1. `grep -n "git-preflight-advisory.mjs" .devin/hooks.v1.json` (confirm registration under `PreToolUse` matcher `^exec$`).
2. Build a scratch repo: `repo=$(mktemp -d /tmp/dv-021.XXXXXX) && git -C "$repo" init -q && git -C "$repo" config core.hooksPath "$repo/.no-hooks" && git -C "$repo" config user.email t@example.invalid && git -C "$repo" config user.name T && git -C "$repo" config commit.gpgsign false && mkdir -p "$repo/.opencode/skills/sk-git" && cp .opencode/skills/sk-git/SKILL.md "$repo/.opencode/skills/sk-git/SKILL.md" && mkdir -p "$repo/src" && printf 'seed\n' > "$repo/src/tracked.txt" && git -C "$repo" add src/tracked.txt && git -C "$repo" commit -q -m seed && printf 'mod\n' > "$repo/src/tracked.txt" && printf 'untracked\n' > "$repo/src/untracked.txt"`.
3. Trap payload: `printf '%s' '{"tool_name":"exec","tool_input":{"command":"git commit --only src -m x"},"cwd":"'"$repo"'"}' | node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` — expect advisory JSON naming `commit-scope-drops-untracked`.
4. Suppressed re-run: same payload piped through `SKGIT_ADVISORY=0 node ...` — expect zero stdout.
5. Ordinary clean commit in a clean scratch repo — expect zero stdout.
6. Fail-open check: run the registered envelope with `DEVIN_PROJECT_DIR` unset and a non-repo `cwd` — expect the fallback approval JSON, never a denied command.

|| Feature ID | Exact commands | Expected signal | Verdict |
||---|---|---|---|
|| DV-021 | `.devin/hooks.v1.json` registration check; `exec` trap payload through the shared hook; `SKGIT_ADVISORY=0` re-run; ordinary clean commit; fail-open envelope | Advisory names `commit-scope-drops-untracked` with no denial; suppression and ordinary commit silent; fallback approves on resolution failure | PASS/FAIL/SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
||---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

|| File | Role |
||---|---|
|| `../../../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | The shared stdin hook the Devin `^exec$` matcher invokes |
|| `../../../../../skills/sk-git/SKILL.md` | The 17 `hard_rules:` frontmatter the hook parses |
|| `.devin/hooks.v1.json` | `PreToolUse` matcher `^exec$` registration with `DEVIN_PROJECT_DIR` envelope and approval fallback |
|| `../../../../../skills/sk-git/scripts/hooks/README.md` | Runtime matrix, suppression tiers, fail-open guarantees |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: DV-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `git-preflight-advisory/git-preflight-advisory.md`
