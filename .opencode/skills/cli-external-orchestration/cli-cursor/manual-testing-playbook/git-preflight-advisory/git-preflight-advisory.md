---
title: "CU-026 -- Git preflight advisory delivery"
description: "This scenario validates the sk-git preflight advisory delivery under Cursor for `CU-026`. It uses the direct `Shell` matcher registration in `.cursor/hooks.json` and the shared hook's Cursor payload contract."
version: 1.0.0.1
---

# CU-026 -- Git preflight advisory delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-026`.

---

## 1. OVERVIEW

This scenario validates the sk-git preflight advisory delivery under Cursor for `CU-026`. It focuses on the `preToolUse` `Shell` matcher invoking the shared hook directly and surfacing the `commit-scope-drops-untracked` advisory without blocking the command.

The shared sk-git preflight hook at `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` reads the `hard_rules:` from `.opencode/skills/sk-git/SKILL.md`, evaluates them against repository state, and emits `hookSpecificOutput.additionalContext` starting with `⚠ sk-git advisory`. `.cursor/hooks.json` invokes that shared hook directly for the `Shell` matcher. The hook accepts `tool_name: "Shell"`, reads `tool_input.command`, and resolves the project from `workspace_roots[0]`; it advises, fails open, and never blocks.

### Why This Matters

Cursor runs shell commands through the `Shell` tool event. A directory-scoped `git commit --only <dir>` silently excludes untracked files inside the directory and reports success by count. Without the advisory, the operator learns the omission only after the damage. This scenario proves the direct hook registration forwards the advisory into Cursor's context at command time and never blocks the command.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-026` and confirm the expected signals without contradictory evidence.

- Objective: Verify the sk-git advisory fires on a directory-scoped commit with an untracked file inside, stays silent on an ordinary commit, and is suppressible — all delivered through the Cursor `preToolUse` `Shell` matcher as `additionalContext` that never blocks.
- Real user request: `Commit the src folder for me` while `src/` holds one modified tracked file and one untracked file.
- Prompt: `As a git safety reviewer, run the sk-git preflight advisory under a Cursor preToolUse Shell payload against a directory-scoped commit that would silently drop an untracked file. Verify the direct hook registration returns the advisory naming commit-scope-drops-untracked as additionalContext with no denial, and that SKGIT_ADVISORY=0 silences it. Return the advisory text and a PASS/FAIL verdict.`
- Expected execution process: Create a scratch repo with a modified tracked file and an untracked file under a subdir -> write a `Shell` payload with `workspace_roots[0]` set to the scratch repo -> invoke the shared hook configured by `.cursor/hooks.json` -> observe the `⚠ sk-git advisory` line naming `commit-scope-drops-untracked` -> repeat with `SKGIT_ADVISORY=0` and confirm silence -> run an ordinary command and confirm silence.
- Expected signals: the direct hook's stdout is JSON with `hookSpecificOutput.additionalContext` containing `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`; no denial field; the command remains advisory-only; the suppressed re-run prints nothing; the ordinary command prints nothing.
- Desired user-visible outcome: A concise PASS verdict with the advisory text and silence evidence.
- Pass/fail: PASS when the advisory names `commit-scope-drops-untracked` AND no denial field is present AND suppression silences it. FAIL if the command is blocked or no advisory appears on the trap shape.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.cursor/hooks.json` invokes `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` under `preToolUse` matcher `Shell`.
3. Create a disposable scratch repo with hooks detached.
4. Write the `Shell` trap payload with `workspace_roots[0]` pointing at the scratch repo and invoke the shared hook directly.
5. Repeat with `SKGIT_ADVISORY=0` and confirm silence.
6. Run an ordinary clean commit and confirm silence.
7. Return a concise user-facing verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-026 | Git preflight advisory delivery | Verify the sk-git advisory fires on a directory-scoped commit under the direct Cursor Shell hook, stays silent on an ordinary command, and is suppressible | `As a git safety reviewer, run the sk-git preflight advisory under a Cursor preToolUse Shell payload against a directory-scoped commit that would silently drop an untracked file. Verify the direct hook registration returns the advisory naming commit-scope-drops-untracked as additionalContext with no denial, and that SKGIT_ADVISORY=0 silences it. Return the advisory text and a PASS/FAIL verdict.` | 1. `rg -n -e 'git-preflight-advisory.mjs' -e '"matcher": "Shell"' .cursor/hooks.json` -> 2. Create a scratch repo, copy `.opencode/skills/sk-git/SKILL.md`, and prepare a JSON payload with `tool_name: "Shell"`, `tool_input.command`, and `workspace_roots[0]` -> 3. `printf '%s' "$payload" > /private/tmp/cu-026-payload.json; node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs < /private/tmp/cu-026-payload.json` -> 4. Repeat Step 3 with `SKGIT_ADVISORY=0` -> 5. Repeat with `git status --short` | Step 1: direct registration under `preToolUse` matcher `Shell`; Step 3: JSON `hookSpecificOutput.additionalContext` contains `⚠ sk-git advisory` and `[commit-scope-drops-untracked]`, with no denial field; Steps 4-5: zero stdout | `.cursor/hooks.json` excerpt, payload, shared-hook JSON, suppression and ordinary-command silence, terminal transcript | PASS when the advisory names `commit-scope-drops-untracked`, no denial field is present, and suppression is silent; FAIL if the command is blocked or no advisory appears on the trap shape | Inspect the direct hook JSON; if absent, confirm `tool_name: "Shell"`, `workspace_roots[0]`, the scratch repo's `.opencode/skills/sk-git/SKILL.md`, and the `Shell` matcher registration |

### Optional Supplemental Checks

- Repeat Step 3 with `SKGIT_ADVISORY_SKIP=commit-scope-drops-untracked` and confirm the single-rule suppression tier also silences the advisory.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `git-preflight-advisory/git-preflight-advisory.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.cursor/hooks.json` | `preToolUse` matcher `Shell` registration invoking the shared hook directly |
| `../../../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | The shared stdin hook that reads the Cursor `Shell` payload |
| `../../../../../skills/sk-git/SKILL.md` | The `hard_rules:` frontmatter the hook parses |
| `../../../../../skills/sk-git/scripts/hooks/README.md` | Runtime matrix, suppression tiers, fail-open guarantees |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: CU-026
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `git-preflight-advisory/git-preflight-advisory.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
