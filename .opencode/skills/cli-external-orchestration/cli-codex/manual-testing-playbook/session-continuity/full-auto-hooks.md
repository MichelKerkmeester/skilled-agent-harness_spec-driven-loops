---
title: "CX-016 -- approval policy + native hook integration"
description: "This scenario validates the current approval-policy form plus native Codex hooks for `CX-016`, confirming SessionStart and UserPromptSubmit advisor injection."
version: 1.4.0.9
---

# CX-016 -- approval policy + native hook integration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-016`.

---

## 1. OVERVIEW

This scenario validates native Codex hook integration for `CX-016` with the current `hooks` feature and an explicit headless approval policy. It confirms `codex --enable hooks` (or `[features].hooks = true` in config) runs the documented Spec Kit Memory hooks at `SessionStart` and `UserPromptSubmit`, while the write-bearing dispatch runs through an authorized child.

### Why This Matters

`references/hook-contract.md` documents the native-hook surface (Codex CLI 0.122.0+) and Spec Kit Memory's wiring at `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/{session-start,user-prompt-submit}.js`. If the hooks fail to load, every session in this skill loses startup context and the Skill Advisor brief - a major regression for the AGENTS.md Gate 2 routing surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-016` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex --enable hooks` plus `-c approval_policy=never --sandbox workspace-write` runs the Spec Kit Memory hooks at SessionStart and UserPromptSubmit and that the advisor brief is injected.
- Real user request: `Confirm Codex's native hooks are wired into Spec Kit Memory and the skill advisor still surfaces.`
- RCAF Prompt: `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator validating Codex hook parity, FIRST verify ~/.codex/hooks.json contains entries for SessionStart and UserPromptSubmit pointing at .opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/{session-start,user-prompt-submit}.js, THEN dispatch AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 codex --enable hooks -c approval_policy=never --sandbox workspace-write exec "Implement a tiny TypeScript hook smoke test in /tmp/cli-codex-playbook-cx016/hook.ts" with --model gpt-5.6-luna -c service_tier="fast". Verify the hook stdout contract is satisfied (session-start emits {} or hookSpecificOutput.additionalContext; user-prompt-submit emits an Advisor: brief). Return a verdict naming the hook script paths and confirming the advisor brief surfaced.`
- Expected execution process: Operator inspects `~/.codex/hooks.json` and reconciles it separately if needed -> runs the documented manual smoke checks from `hook-contract.md` §6 -> routes the write-bearing dispatch through production fanout or the authorized child command -> captures stdout -> verifies the hook scripts are reachable.
- Expected signals: `~/.codex/hooks.json` lists both hooks at the documented paths. Manual smoke checks emit `{}` or `hookSpecificOutput.additionalContext` for SessionStart and an `Advisor:`-prefixed brief for UserPromptSubmit. The child-authorized `codex --enable hooks -c approval_policy=never --sandbox workspace-write exec` exits 0. The test file is written.
- Desired user-visible outcome: Evidence that Spec Kit Memory's startup context and skill-advisor brief are wired into Codex via the documented hook contract.
- Pass/fail: PASS if the operator-side hooks.json lists both entries at the documented paths, both manual smoke checks succeed, and the child-authorized hook-enabled dispatch exits 0. FAIL if hooks.json is missing entries, smoke checks fail, or dispatch errors out.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Inspect `~/.codex/hooks.json` and confirm both hook entries are present.
2. Run the documented manual smoke checks from `hook-contract.md` §6 for SessionStart and UserPromptSubmit.
3. Dispatch the write-bearing test through production fanout or the authorized child command with `codex --enable hooks -c approval_policy=never --sandbox workspace-write exec`.
4. Verify exit 0 and the test file is written.
5. Return a verdict naming the hook paths and confirming the advisor brief surfaced.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-016 | approval policy + native hook integration | Verify Spec Kit Memory hooks fire under the current approval policy and inject the advisor brief | `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator validating Codex hook parity, FIRST verify ~/.codex/hooks.json contains entries for SessionStart and UserPromptSubmit pointing at .opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/{session-start,user-prompt-submit}.js, THEN route the write-bearing dispatch through an authorized child with AI_SESSION_CHILD=1 and MK_SPEC_GATE_ENFORCE=0 using codex --enable hooks -c approval_policy=never --sandbox workspace-write exec "Implement a tiny TypeScript hook smoke test in /tmp/cli-codex-playbook-cx016/hook.ts" with --model gpt-5.6-luna -c service_tier="fast". Verify the hook stdout contract is satisfied (session-start emits {} or hookSpecificOutput.additionalContext; user-prompt-submit emits an Advisor: brief). Return a verdict naming the hook script paths and confirming the advisor brief surfaced.` | 1. `bash: cat ~/.codex/hooks.json \| jq '.hooks.SessionStart, .hooks.UserPromptSubmit' > /tmp/cli-codex-cx016-hooks.json` -> 2. `bash: printf '%s\n' '{"session_id":"cx016","hook_event_name":"SessionStart","source":"startup","cwd":"'"$PWD"'","model":"gpt-5.6-luna","permission_mode":"default"}' \| node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/session-start.js > /tmp/cli-codex-cx016-session-start.json 2>&1` -> 3. `bash: printf '%s\n' '{"prompt":"implement TypeScript hook smoke test","cwd":"'"$PWD"'"}' \| node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/user-prompt-submit.js > /tmp/cli-codex-cx016-prompt-submit.json 2>&1` -> 4. `bash: rm -rf /tmp/cli-codex-playbook-cx016 && mkdir -p /tmp/cli-codex-playbook-cx016 && AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 codex --enable hooks -c approval_policy=never --sandbox workspace-write exec --model gpt-5.6-luna -c model_reasoning_effort="high" -c service_tier="fast" "Spec folder: /tmp/cli-codex-playbook-cx016 (pre-approved, skip Gate 3). Implement a tiny TypeScript hook smoke test in /tmp/cli-codex-playbook-cx016/hook.ts: a function that returns { ok: true } when called." > /tmp/cli-codex-cx016-stdout.txt 2>&1` -> 5. `bash: ls /tmp/cli-codex-playbook-cx016/hook.ts && cat /tmp/cli-codex-playbook-cx016/hook.ts && grep -i "advisor" /tmp/cli-codex-cx016-prompt-submit.json` | Step 1: hooks.json includes SessionStart and UserPromptSubmit pointing at the documented paths; Step 2: stdout is `{}` or contains `hookSpecificOutput.additionalContext`; Step 3: stdout contains `Advisor:` prefix; Step 4: exit 0; Step 5: hook.ts exists with `{ ok: true }` body AND the prompt-submit smoke output contained `Advisor:` | hooks.json snapshot, both smoke-check stdouts, captured Codex stdout, generated hook.ts file, dispatched command line, exit code | PASS if hooks.json has both entries at the documented paths AND both smoke checks emit the documented output AND the codex dispatch exits 0 with a generated hook.ts; FAIL if hooks.json missing entries, smoke checks emit empty/error output, or dispatch fails | (1) Re-read `references/hook-contract.md` §6 Manual Smoke Checks; (2) confirm Codex CLI is at version >= 0.122.0 (`codex --version`); (3) verify `[features].hooks = true` in `~/.codex/config.toml`; (4) inspect smoke-check stderr for missing-script errors |

### Optional Supplemental Checks

- Run a third smoke check with `source: "resume"` for SessionStart and confirm the hook handles all three documented `source` values (startup, resume, clear).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/hook-contract.md` (§1 Activation, §2 Registration, §6 Spec Kit Memory Wiring) | Authoritative hook contract |
| `../../references/cli-reference.md` (§4 Approval Mode Values) | Documents the current approval policy and headless `never` form |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/hook-contract.md` | Native hook contract documentation |
| `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/session-start.js` | Spec Kit Memory SessionStart hook |
| `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/user-prompt-submit.js` | Spec Kit Memory UserPromptSubmit hook |
| `~/.codex/hooks.json` | Operator-side hook registration |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CX-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/full-auto-hooks.md`
