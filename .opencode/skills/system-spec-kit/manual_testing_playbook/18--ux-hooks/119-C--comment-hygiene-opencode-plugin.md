---
title: "119-C -- Comment Hygiene — OpenCode Plugin Injection + Pre-Commit Gate"
description: "This scenario validates comment hygiene enforcement for OpenCode sessions in `119-C`. OpenCode has no write-time hook (ADR-001). Enforcement relies on the comment hygiene rule injected via the spec-kit skill-advisor plugin at session start, backed by the git pre-commit gate as the blocking backstop."
---

# 119-C -- Comment Hygiene — OpenCode Plugin Injection + Pre-Commit Gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `119-C`.

---

## 1. OVERVIEW

This scenario validates comment hygiene enforcement for OpenCode sessions in `119-C`. It focuses on confirming that the spec-kit plugin injects the comment hygiene rule into the OpenCode session context at session start, and that the git pre-commit gate blocks any violation the model still produces.

### Why This Matters

OpenCode has no `tool:write`, `file:write`, or `PostToolUse` hook (ADR-001). Without the plugin injection, OpenCode sessions operate with no awareness of the hygiene rule. The pre-commit gate is the mandatory floor, but confirming the plugin injection is the only way to know whether the rule reaches the model before it writes. Run `119-A` first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `119-C` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that the spec-kit plugin injects the comment hygiene rule into the OpenCode session context, and that no forbidden comment reaches a committed state — either because the model respected the injection or because the pre-commit gate blocked it.
- Real user request: `Use OpenCode to add a comment explaining the lease cleanup motivation in violation.ts, then try to commit it.`
- Prompt: `In /tmp/hygiene-sandbox/violation.ts, add a comment on line 1 explaining why the lease cleanup path runs unconditionally. The comment must state the reasoning without referencing any spec or requirement document.`
- Expected execution process: OpenCode session starts; plugin injects the AGENTS.md comment hygiene rule into context; model either writes a clean comment (rule respected) or writes a forbidden comment; operator stages and attempts commit; pre-commit gate fires and blocks if a violation exists.
- Expected signals: Either (a) OpenCode produces a clean durable-WHY comment and checker exits 0, OR (b) checker exits 1 and `git commit` outputs `BLOCKED: ... ephemeral-artifact pointers`.
- Desired user-visible outcome: No forbidden comment reaches a committed state — verified by `git log`.
- Pass/fail: PASS if no forbidden comment appears in `git log`; FAIL if a forbidden comment commits without interception.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: ask OpenCode to comment on lease cleanup motivation, then observe commit behavior.
2. Confirm the pre-commit gate is installed and the plugin folder exists before dispatching.
3. Execute the OpenCode dispatch and record the written file content.
4. Run the checker and stage/commit to confirm gate behavior.
5. Return a verdict based on whether any forbidden comment reached `git log`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 119-C | OpenCode plugin + pre-commit | Verify plugin injects hygiene rule and pre-commit blocks any slipthrough | `In /tmp/hygiene-sandbox/violation.ts, add a comment on line 1 explaining why the lease cleanup path runs unconditionally. The comment must state the reasoning without referencing any spec or requirement document.` | 1. `ls -la .git/hooks/pre-commit && grep HYGIENE_HOOK .opencode/scripts/git-hooks/pre-commit` -> 2. `opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" "In /tmp/hygiene-sandbox/violation.ts, add a comment on line 1 explaining why the lease cleanup path runs unconditionally without referencing any spec or requirement." 2>&1 \| tee /tmp/opencode-119C.log` -> 3. `cat /tmp/hygiene-sandbox/violation.ts` -> 4. `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh /tmp/hygiene-sandbox/violation.ts; echo "Checker:$?"` -> 5. `git add /tmp/hygiene-sandbox/violation.ts && git commit -m "test-119C" 2>&1; echo "Commit:$?"` -> 6. `git log --oneline -3` | Step 1: pre-commit linked + HYGIENE_HOOK present; Step 3: comment is a clean WHY statement OR contains a forbidden ref; Step 4: EXIT:0 (model self-corrected) or EXIT:1 (violation); Step 5: commit allowed (EXIT:0) or BLOCKED message (EXIT:1); Step 6: no forbidden comment in log | `/tmp/opencode-119C.log`; `cat violation.ts`; checker exit code; `git commit` output; `git log --oneline -3` | PASS if `git log` shows no forbidden comment in the committed file; FAIL if a forbidden comment (`// REQ-`, `// ADR-`, `// 026/`) appears in `git log` | If pre-commit not linked: run `bash .opencode/hooks/install-hooks.sh`; if plugin not injecting rule: run `opencode run ... "List your comment rules" 2>&1 \| grep -i hygiene`; if bypass var set: `echo $SPECKIT_SKIP_COMMENT_HYGIENE` must be empty |

### Optional Supplemental Checks

**Plugin injection verification**: dispatch `opencode run ... "List any rules about code comments from your system context"` and grep the output for "Comment Hygiene" or "ephemeral" to confirm the plugin injected the rule.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../../specs/skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer/decision-record.md` | ADR-001 — documents the OpenCode write-time hook gap |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/hooks/pre-commit` | Primary enforcement anchor for OpenCode sessions |
| `.opencode/scripts/git-hooks/pre-commit` | Symlink target — integrates hygiene gate with doc-model-ref check |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Shared checker called by the pre-commit gate |

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 119-C
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/119-C--comment-hygiene-opencode-plugin.md`
- audited_post_018: true
