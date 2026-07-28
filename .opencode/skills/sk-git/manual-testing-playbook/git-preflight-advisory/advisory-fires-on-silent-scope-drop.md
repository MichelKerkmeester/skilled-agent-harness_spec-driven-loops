---
title: "GIT-042 -- Advisory fires on silent scope drop"
description: "This scenario validates the sk-git preflight advisory for `GIT-042`. It focuses on the advisory firing when a directory-scoped commit would silently exclude untracked files, staying silent on an ordinary commit, and being suppressible."
version: 1.1.0.8
---

# GIT-042 -- Advisory fires on silent scope drop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-042`.

---

## 1. OVERVIEW

This scenario validates the sk-git preflight advisory for `GIT-042`. It focuses on the advisory firing when a directory-scoped commit would silently exclude untracked files, staying silent on an ordinary commit, and being suppressible.

### Why This Matters

A `git commit --only <dir>` reports success with a file count while omitting untracked files inside that directory. Naming an untracked file directly errors; naming its directory does not. The omission is invisible because the report gives a count rather than a file list. This is the most damaging shape in the packet's incident list and the only one with no prior rule. The `commit-scope-drops-untracked` check is the rule that closes it, and this scenario proves the advisory reaches the operator at command time without ever blocking the command.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-042` and confirm the expected signals without contradictory evidence.

- Objective: the preflight advisory fires when a directory-scoped commit would silently exclude untracked files, stays silent on an ordinary commit, and is suppressible.
- Real user request: `Commit the src folder for me` while `src/` holds one modified tracked file and one untracked file.
- Prompt: `As a git safety reviewer, run the sk-git preflight advisory against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, the command still runs, and suppression silences it. Return the advisory text and a PASS/FAIL verdict.`
- Expected execution process: Create a scratch repo with a modified tracked file and an untracked file under a subdir -> pipe a `Bash` payload for `git commit --only <dir> -m x` through the shared hook -> observe the `⚠ sk-git advisory` line naming `commit-scope-drops-untracked` -> repeat with `SKGIT_ADVISORY=0` and confirm silence -> run an ordinary clean commit and confirm silence.
- Expected signals: advisory text contains the rule id `commit-scope-drops-untracked`; the advisory is `additionalContext` only (no denial); the commit itself still runs (advisory never blocks); the suppressed re-run prints nothing; the ordinary commit prints nothing.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the advisory text and the silence evidence.
- Pass/fail: PASS when the advisory names `commit-scope-drops-untracked` AND the command still executed AND the suppressed re-run prints nothing. FAIL if the command is blocked, or no advisory appears on the trap shape.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Create a disposable scratch repository with hooks detached so the advisory is the only voice.
3. Pipe the trap payload through the shared hook and capture the advisory.
4. Repeat with `SKGIT_ADVISORY=0` and confirm silence.
5. Run an ordinary clean commit and confirm silence.
6. Return a concise user-facing verdict with the advisory text.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| GIT-042 | Advisory fires on silent scope drop | the preflight advisory fires when a directory-scoped commit would silently exclude untracked files, stays silent on an ordinary commit, and is suppressible | `As a git safety reviewer, run the sk-git preflight advisory against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, the command still runs, and suppression silences it. Return the advisory text and a PASS/FAIL verdict.` | 1. `bash: repo=$(mktemp -d "/tmp/sk-git-git042.XXXXXX") && git -C "$repo" init -q && git -C "$repo" config core.hooksPath "$repo/.no-hooks" && git -C "$repo" config user.email "t@example.invalid" && git -C "$repo" config user.name T && git -C "$repo" config commit.gpgsign false && mkdir -p "$repo/src" && cp .opencode/skills/sk-git/SKILL.md "$repo/.opencode/skills/sk-git/SKILL.md" 2>/dev/null || mkdir -p "$repo/.opencode/skills/sk-git" && cp .opencode/skills/sk-git/SKILL.md "$repo/.opencode/skills/sk-git/SKILL.md" && printf 'tracked seed\n' > "$repo/src/tracked.txt" && git -C "$repo" add src/tracked.txt && git -C "$repo" commit -q -m seed && printf 'tracked modified\n' > "$repo/src/tracked.txt" && printf 'untracked\n' > "$repo/src/untracked.txt"` -> 2. `bash: printf '%s' '{"tool_name":"Bash","tool_input":{"command":"git commit --only src -m x"},"cwd":"'"$repo"'"}' \| node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` -> 3. `bash: printf '%s' '{"tool_name":"Bash","tool_input":{"command":"git commit --only src -m x"},"cwd":"'"$repo"'"}' \| SKGIT_ADVISORY=0 node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` -> 4. `bash: clean=$(mktemp -d "/tmp/sk-git-git042-clean.XXXXXX") && git -C "$clean" init -q && git -C "$clean" config core.hooksPath "$clean/.no-hooks" && git -C "$clean" config user.email t@example.invalid && git -C "$clean" config user.name T && git -C "$clean" config commit.gpgsign false && printf 'seed\n' > "$clean/a.txt" && git -C "$clean" add a.txt && git -C "$clean" commit -q -m seed && printf 'change\n' >> "$clean/a.txt" && git -C "$clean" add a.txt && printf '%s' '{"tool_name":"Bash","tool_input":{"command":"git commit -m x"},"cwd":"'"$clean"'"}' \| node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Step 1: scratch repo built with `src/tracked.txt` modified and `src/untracked.txt` present; Step 2: stdout is JSON with `hookSpecificOutput.additionalContext` containing `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`, no denial field; Step 3: zero stdout; Step 4: zero stdout | Captured advisory JSON from Step 2, silence confirmation from Steps 3 and 4, terminal transcript | PASS when the advisory names `commit-scope-drops-untracked` AND no denial field is present AND Step 3 prints nothing AND Step 4 prints nothing; FAIL if the command is blocked (a denial/exit-non-zero field appears), no advisory appears on the trap shape, or suppression fails | Inspect the Step 2 JSON for the rule id first; if absent, confirm `src/untracked.txt` exists and the payload `cwd` points at the scratch repo; if suppression fails, confirm `SKGIT_ADVISORY=0` was set on the hook process |

### Optional Supplemental Checks

- Repeat Step 2 with `SKGIT_ADVISORY_SKIP=commit-scope-drops-untracked` and confirm the single-rule suppression tier also silences the advisory.
- Repeat Step 2 with an `exec` payload (`{"tool_name":"exec",...}`) and confirm the same advisory fires, proving the shared hook serves both runtime dialects.

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
||---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| `git-preflight-advisory/advisory-fires-on-silent-scope-drop.md` | Canonical per-feature execution contract |

### Implementation Anchors

|| File | Role |
||---|---|
|| `../../scripts/hooks/git-preflight-advisory.mjs` | The shared stdin hook that evaluates `Bash` and `exec` payloads and emits `additionalContext` |
|| `../../scripts/lib/git-rule-checks.mjs` | The `commit-scope-drops-untracked` check and the `GIT_SHAPE` gate |
|| `../../scripts/lib/git-context.mjs` | The lazy repository-state collector the check reads |
|| `../../SKILL.md` | The 17 `hard_rules:` frontmatter the hook parses |
|| `../../scripts/hooks/README.md` | Runtime matrix, suppression tiers, and fail-open guarantees |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: GIT-042
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `git-preflight-advisory/advisory-fires-on-silent-scope-drop.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
