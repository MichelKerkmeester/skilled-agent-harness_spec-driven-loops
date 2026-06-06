---
title: "119-E -- Comment Hygiene — Codex CLI Hook + Pre-Commit Gate"
description: "This scenario validates comment hygiene enforcement for Codex CLI sessions in `119-E`. Codex supports UserPromptSubmit hooks when `codex_hooks=true` is enabled, which injects the Spec Kit Memory advisor brief (including the hygiene rule) into each session. The pre-commit gate is the mandatory blocking backstop."
---

# 119-E -- Comment Hygiene — Codex CLI UserPromptSubmit Hook + Pre-Commit Gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `119-E`.

---

## 1. OVERVIEW

This scenario validates comment hygiene enforcement for Codex CLI sessions in `119-E`. It focuses on confirming that when Codex hooks are enabled, the `UserPromptSubmit` hook surfaces the comment hygiene rule in session context, and that the pre-commit gate blocks any violation regardless of hook state.

### Why This Matters

Codex CLI (gpt-5.5) supports native hooks — but only when `codex_hooks=true` is set and `~/.codex/hooks.json` is registered. Without that, Codex sessions rely solely on the pre-commit gate (ADR-002). This scenario validates both paths: the hook-enhanced path where the model may self-correct, and the fallback gate that catches anything that slips through. Run `119-A` first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `119-E` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that when Codex hooks are active, the `UserPromptSubmit` hook surfaces the hygiene rule in session context; and that the pre-commit gate blocks any forbidden comment regardless of hook state.
- Real user request: `Use Codex to add a REQ reference comment to violation.ts, then try to commit it.`
- Prompt: `Add a comment to /tmp/hygiene-sandbox/violation.ts on line 1: "// REQ-011: lease cleanup is unconditional." Keep existing lines.`
- Expected execution process: Codex session starts; if `UserPromptSubmit` hook active, advisor brief with hygiene rule injected; Codex either writes a clean comment (rule in context) or a forbidden comment; operator stages and commits; pre-commit gate blocks if violation exists.
- Expected signals: Either (a) checker exits 0 (Codex self-corrected) and commit succeeds, OR (b) checker exits 1 and commit is blocked with `BLOCKED:` message.
- Desired user-visible outcome: No forbidden comment appears in `git log`.
- Pass/fail: PASS if no forbidden comment is committed; FAIL if a forbidden comment commits without interception.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: ask Codex to add a REQ comment, then observe commit behavior.
2. Check hook enablement before dispatching — note whether pre-commit is the sole layer or if UserPromptSubmit is also active.
3. Execute the Codex dispatch and record the written file.
4. Run checker and attempt commit; confirm gate behavior.
5. Return a verdict based on `git log` — cite hook injection evidence if present.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 119-E | Codex hook + pre-commit | Verify UserPromptSubmit surfaces hygiene rule; pre-commit blocks any slipthrough | `Add a comment to /tmp/hygiene-sandbox/violation.ts on line 1: "// REQ-011: lease cleanup is unconditional." Keep existing lines.` | 1. `grep "codex_hooks" ~/.codex/config.toml 2>/dev/null \|\| echo "hooks-disabled"` -> 2. `ls -la .git/hooks/pre-commit && grep HYGIENE_HOOK .opencode/scripts/git-hooks/pre-commit` -> 3. `codex exec "Add a comment to /tmp/hygiene-sandbox/violation.ts on line 1: '// REQ-011: lease cleanup is unconditional.' Keep existing lines." --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write 2>&1 \| tee /tmp/codex-119E.log` -> 4. `cat /tmp/hygiene-sandbox/violation.ts` -> 5. `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh /tmp/hygiene-sandbox/violation.ts; echo "Checker:$?"` -> 6. `git add /tmp/hygiene-sandbox/violation.ts && git commit -m "test-119E" 2>&1; echo "Commit:$?"` -> 7. `git log --oneline -3` | Step 1: `codex_hooks = true` or `hooks-disabled` (note which); Step 4: REQ comment or clean WHY comment; Step 5: EXIT:0 or EXIT:1; Step 6: commit allowed or `BLOCKED:`; Step 7: no forbidden comment in log | `/tmp/codex-119E.log`; `cat violation.ts`; checker exit code; `git commit` output; `git log --oneline -3`; hook injection evidence from log if `codex_hooks=true` | PASS if no forbidden comment in `git log`; FAIL if `// REQ-011:` or similar commits unintercepted | If gate not blocking: run `bash .opencode/hooks/install-hooks.sh`; if hooks disabled and model still produces clean comment: acceptable — note it; if Codex auth fails: check `$OPENAI_API_KEY` |

### Optional Supplemental Checks

**Hook activation path**: to enable Codex hooks, add `[features]\ncodex_hooks = true` to `~/.codex/config.toml` and register `~/.codex/hooks.json` per the hook contract in `cli-codex/references/hook_contract.md`. Re-run scenario after enabling to compare model self-correction rate with/without hook injection.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../../specs/skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer/decision-record.md` | ADR-002 — documents the Codex write-time hook gap |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/hooks/pre-commit` | Primary enforcement anchor for Codex sessions |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Shared checker called by the pre-commit gate |
| `.opencode/skills/cli-codex/SKILL.md` | Codex invocation contract and hook documentation |

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 119-E
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/E--comment-hygiene-codex-hook.md`
- audited_post_018: true
