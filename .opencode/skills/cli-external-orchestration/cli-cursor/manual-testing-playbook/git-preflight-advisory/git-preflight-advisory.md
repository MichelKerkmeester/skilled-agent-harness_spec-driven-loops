---
title: "CU-026 -- Git preflight advisory delivery"
description: "This scenario validates the sk-git preflight advisory delivery under Cursor for `CU-026`. It focuses on the preToolUse Shell proxy surfacing the commit-scope-drops-untracked advisory without blocking the command."
version: 1.0.0.1
---

# CU-026 -- Git preflight advisory delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-026`.

---

## 1. OVERVIEW

This scenario validates the sk-git preflight advisory delivery under Cursor for `CU-026`. It focuses on the `preToolUse` `Shell` proxy surfacing the `commit-scope-drops-untracked` advisory without blocking the command.

The advisory is the shared sk-git preflight hook at `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. It reads the 17 `hard_rules:` from `.opencode/skills/sk-git/SKILL.md`, evaluates them against repository state, and emits `hookSpecificOutput.additionalContext` starting with `⚠ sk-git advisory`. It never blocks, fails open, and caps at three advisories per command. Cursor does not call the shared hook directly; `.cursor/hooks/git-preflight-advisory.mjs` is a thin proxy that maps the Cursor `Shell` payload onto the shared hook's expected stdin JSON and forwards the shared hook's stdout verbatim.

### Why This Matters

Cursor runs shell commands through the `Shell` tool event. A directory-scoped `git commit --only <dir>` silently excludes untracked files inside the directory and reports success by count. Without the advisory, the operator learns the omission only after the damage. This scenario proves the proxy forwards the advisory into Cursor's context at command time and never blocks the command.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-026` and confirm the expected signals without contradictory evidence.

- Objective: Verify the sk-git advisory fires on a directory-scoped commit with an untracked file inside, stays silent on an ordinary commit, and is suppressible — all delivered through the Cursor `preToolUse` `Shell` proxy as `additionalContext` that never blocks.
- Real user request: `Commit the src folder for me` while `src/` holds one modified tracked file and one untracked file.
- Prompt: `As a git safety reviewer, run the sk-git preflight advisory under a Cursor preToolUse Shell payload against a directory-scoped commit that would silently drop an untracked file. Verify the proxy forwards the advisory naming commit-scope-drops-untracked as additionalContext with no denial, and that SKGIT_ADVISORY=0 silences it. Return the advisory text and a PASS/FAIL verdict.`
- Expected execution process: Create a scratch repo with a modified tracked file and an untracked file under a subdir -> pipe a `Shell` payload for `git commit --only <dir> -m x` through the Cursor proxy -> observe the `⚠ sk-git advisory` line naming `commit-scope-drops-untracked` forwarded verbatim -> repeat with `SKGIT_ADVISORY=0` and confirm silence -> run an ordinary clean commit and confirm silence.
- Expected signals: the proxy's stdout is the shared hook's `additionalContext` JSON verbatim, containing `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`; no denial field; the commit still runs; the suppressed re-run prints nothing; the ordinary commit prints nothing.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the advisory text and silence evidence.
- Pass/fail: PASS when the advisory names `commit-scope-drops-untracked` AND no denial field is present AND suppression silences it. FAIL if the command is blocked or no advisory appears on the trap shape.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.cursor/hooks.json` registers `.cursor/hooks/git-preflight-advisory.mjs` under `preToolUse` matcher `Shell`.
3. Create a disposable scratch repo with hooks detached.
4. Pipe the `Shell` trap payload through the Cursor proxy and capture the forwarded advisory.
5. Repeat with `SKGIT_ADVISORY=0` and confirm silence.
6. Run an ordinary clean commit and confirm silence.
7. Return a concise user-facing verdict.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CU-026 | Git preflight advisory delivery | Verify the sk-git advisory fires on a directory-scoped commit under Cursor preToolUse Shell, stays silent on an ordinary commit, and is suppressible | `As a git safety reviewer, run the sk-git preflight advisory under a Cursor preToolUse Shell payload against a directory-scoped commit that would silently drop an untracked file. Verify the proxy forwards the advisory naming commit-scope-drops-untracked as additionalContext with no denial, and that SKGIT_ADVISORY=0 silences it. Return the advisory text and a PASS/FAIL verdict.` | 1. `bash: grep -n "git-preflight-advisory.mjs" .cursor/hooks.json` (confirm registration under preToolUse Shell) -> 2. `bash: repo=$(mktemp -d "/tmp/cu-026.XXXXXX") && git -C "$repo" init -q && git -C "$repo" config core.hooksPath "$repo/.no-hooks" && git -C "$repo" config user.email t@example.invalid && git -C "$repo" config user.name T && git -C "$repo" config commit.gpgsign false && mkdir -p "$repo/.opencode/skills/sk-git" && cp .opencode/skills/sk-git/SKILL.md "$repo/.opencode/skills/sk-git/SKILL.md" && mkdir -p "$repo/src" && printf 'seed\n' > "$repo/src/tracked.txt" && git -C "$repo" add src/tracked.txt && git -C "$repo" commit -q -m seed && printf 'mod\n' > "$repo/src/tracked.txt" && printf 'untracked\n' > "$repo/src/untracked.txt"` -> 3. `bash: printf '%s' '{"tool_name":"Shell","tool_input":{"command":"git commit --only src -m x"},"workspace_roots":["'"$repo"'"]}' \| node .cursor/hooks/git-preflight-advisory.mjs` -> 4. `bash: printf '%s' '{"tool_name":"Shell","tool_input":{"command":"git commit --only src -m x"},"workspace_roots":["'"$repo"'"]}' \| SKGIT_ADVISORY=0 node .cursor/hooks/git-preflight-advisory.mjs` | Step 1: registration line present under `preToolUse` matcher `Shell`; Step 3: proxy stdout is the shared hook JSON with `hookSpecificOutput.additionalContext` containing `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`, no denial field; Step 4: zero stdout | `.cursor/hooks.json` excerpt, captured proxy JSON, silence confirmation, terminal transcript | PASS when the advisory names `commit-scope-drops-untracked` AND no denial field is present AND Step 4 prints nothing; FAIL if the command is blocked or no advisory appears on the trap shape | Inspect the Step 3 JSON for the rule id; if absent, confirm the proxy resolves the shared hook path and the payload `workspace_roots[0]` points at the scratch repo; confirm the proxy is registered for the `Shell` matcher |

### Optional Supplemental Checks

- Repeat Step 3 with `SKGIT_ADVISORY_SKIP=commit-scope-drops-untracked` and confirm the single-rule suppression tier also silences the advisory.

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
|| `.cursor/hooks/git-preflight-advisory.mjs` | The Cursor `Shell` proxy that maps onto the shared hook and forwards stdout verbatim |
|| `../../../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | The shared stdin hook the proxy spawns |
|| `../../../../../skills/sk-git/SKILL.md` | The 17 `hard_rules:` frontmatter the hook parses |
|| `.cursor/hooks.json` | `preToolUse` matcher `Shell` registration of the proxy |
|| `../../../../../skills/sk-git/scripts/hooks/README.md` | Runtime matrix, suppression tiers, fail-open guarantees |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: CU-026
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `git-preflight-advisory/git-preflight-advisory.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
