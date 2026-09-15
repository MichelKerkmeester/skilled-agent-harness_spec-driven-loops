---
title: "HERMES-027 -- Session-start advisories reach the session prompt"
description: "Confirm the repo's session-start guards (worktree, dist freshness, git hooks, primary reconcile) run at Hermes session start and their warnings reach the session prompt as one bounded section, for `HERMES-027`."
version: 1.0.0.0
---

# HERMES-027 -- Session-start advisories reach the session prompt

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-027`.

---

## 1. OVERVIEW

The `repo-guards` plugin renders a fourth prompt section, `repo-guards-session-advisories`, by running the four session-start guard scripts the other runtimes wire into their session-start chains (each with its own interpreter, since the dist checker is a Python program behind a `.sh` name) and joining whatever warning each wrote to stderr or stdout, trimmed under Hermes's 4000-character section cap.

### Why This Matters

These guards exist to say, before the first turn, that the session is on a shared checkout, that a build surface is stale, that a git hook is missing or that the primary checkout could not reconcile. A session that never hears them starts blind.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-027` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the session-start advisories section is rendered at session start and the session can quote a guard line from it.
- Real user request: `Does Hermes get the same session-start warnings as Claude and Pi?`
- Prompt: `Your system prompt carries a section of session-start advisories from repo guards. Quote the first advisory line verbatim (the one beginning with 'worktree-guard:'), or reply NO_ADVISORIES.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; stdout quotes a line beginning `worktree-guard: [worktree-guard] This top-level session is running on the shared ...` (on a shared checkout) or another guard's line; `~/.hermes/logs/agent.log` shows `Session plugin prompt section: id=repo-guards-session-advisories ... chars=<n>` with n under 4000 and no `exceeded max_chars`; `session_id:` on stderr.
- Evidence: stdout, exit code, elapsed seconds, the stderr session id, the log's section line.
- Desired user-visible outcome: a concise verdict naming the guard line the session saw.
- Pass/fail: PASS when a guard line is quoted and the section is logged under the cap; FAIL on `NO_ADVISORIES` while a guard would warn on this checkout, on bash parse noise in the section, or on a skipped section; SKIP only when every guard is legitimately silent (record `hermes` run from an isolated worktree with fresh dist and installed hooks) or on a named blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 1 --run-budget 90 \
  -q "Your system prompt carries a section of session-start advisories from repo guards. Quote the first advisory line verbatim (the one beginning with 'worktree-guard:'), or reply NO_ADVISORIES." </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
grep "repo-guards-session-advisories" ~/.hermes/logs/agent.log | tail -1
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-027 | Session-start advisories reach the session prompt | Confirm the session-start advisories section is rendered at session start and the session can quote a guard line from it | `Your system prompt carries a section of session-start advisories from repo guards. Quote the first advisory line verbatim (the one beginning with 'worktree-guard:'), or reply NO_ADVISORIES.` | the `hermes chat` dispatch in §3, then the log grep | Exit `0`; a guard line quoted; the section logged under 4000 chars | stdout, exit code, elapsed seconds, session id, log line | PASS on a quoted guard line and a logged section; FAIL on `NO_ADVISORIES` on a shared checkout, parse noise, or a skipped section | Harness: plugin not loaded. Dependency: provider missing. Adapter: a guard's interpreter is wrong (parse noise) or the section exceeded the cap |

### Recorded Result

**Executed 2026-09-15**: exit 0 after 21 s, stdout quoted `worktree-guard: [worktree-guard] This top-level session is running on the shared 'skilled/v4.0.0.0' checkout ...`, section logged at 572 characters, session `20260915_080054_2ae5e2`. Before the interpreter fix the section carried about 700 characters of bash parse errors from the dist checker; the pi collector had the same defect and was corrected in the same pass. The primary-reconcile guard reported `SKIP: uncommitted tracked changes` on this dirty tree.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/session-start-advisories-section.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.opencode/hooks/git-worktree-guard/devin/worktree-guard.sh` | One of the four guards the section runs |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-027
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/session-start-advisories-section.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
