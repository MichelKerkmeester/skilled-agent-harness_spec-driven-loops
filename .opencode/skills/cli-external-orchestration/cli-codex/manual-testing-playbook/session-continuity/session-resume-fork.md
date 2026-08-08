---
title: "CX-017 -- session resume / fork"
description: "This scenario validates codex resume and codex fork for `CX-017`. It focuses on confirming a multi-turn session can be resumed and that fork creates a divergent branch."
version: 1.4.0.9
---

# CX-017 -- session resume / fork

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-017`.

---

## 1. OVERVIEW

This scenario validates session resume and fork for `CX-017`. It focuses on confirming `codex exec` produces a session ID that can be resumed via `codex resume <session-id>` (or `--session-id`) and that `codex fork <session-id>` creates a divergent branch with full prior context.

### Why This Matters

`references/cli-reference.md` §11 + `references/codex-tools.md` §2 (Session Management) document `resume`/`fork` as the unique multi-turn continuity surface in Codex. They are the alternative to re-providing context via `@file` references. Validating that the surfaces actually preserve prior reasoning is essential for any long-running implementation task.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-017` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec` emits a session ID, `codex exec resume <session-id>` continues the session with full prior context, and the optional TTY-only `codex fork <session-id>` path creates a divergent branch.
- Real user request: `Run a 2-step Codex task as one session, then fork it so I can try an alternative approach.`
- RCAF Prompt: `Spec folder: /tmp/cli-codex-playbook-cx017 (pre-approved, skip Gate 3). As a cross-AI orchestrator running a multi-turn task, route every write-bearing dispatch through the production fanout or an authorized child with AI_SESSION_CHILD=1 and MK_SPEC_GATE_ENFORCE=0. Dispatch codex exec --model gpt-5.6-luna --sandbox workspace-write -c model_reasoning_effort="high" -c service_tier="fast" with a 2-step plan: Step 1 sketch a TypeScript User type and write user.ts. Capture the session UUID from Codex's verbose header (regex 'session id: [a-f0-9-]+'). Then dispatch codex exec resume <UUID> "Step 2: implement validate(user) for the type from Step 1." (no --sandbox flag — codex exec resume does not accept it; redirect stdin from /dev/null). If a TTY is available, run the separate interactive `codex fork <UUID>` flow and capture its distinct branch session; otherwise record that fork sub-check as SKIP. Return a verdict naming the resume UUID and, when available, the fork UUID.`
- Expected execution process: Operator dispatches Step 1 through an authorized child -> captures the session ID from Codex stdout -> dispatches the headless Step 2 as `codex exec resume <id>` through an authorized child -> verifies Step 2 references the User type from Step 1 -> if stdin is a TTY, runs the separate interactive `codex fork <id>` flow and confirms its branch identity; otherwise records the fork sub-check as SKIP.
- Expected signals: Step 1 stdout includes a session ID (or operator captures it from the raw log). Headless Step 2 with the positional resume ID exits 0 and references the Step 1 `User` type. In a TTY, `codex fork <id>` creates a distinct branch; without a TTY, the fork sub-check is SKIP. Step 1 state is preserved across the resume.
- Desired user-visible outcome: A working multi-turn task plus a forked session ID the operator can use to explore an alternative implementation.
- Pass/fail: PASS if Step 1 emits a session ID, headless Step 2 references the Step 1 type and exits 0, and the TTY fork sub-check either emits a distinct ID or is recorded as SKIP when stdin is not a terminal. FAIL if the resume ID is missing, Step 2 has no Step 1 context, or a TTY fork reuses the original ID.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create the workspace temp dir.
2. Dispatch Step 1 with explicit "announce the session ID" instruction.
3. Extract the session ID from Step 1 stdout (regex for a UUID-like string or session-id label).
4. Dispatch Step 2 with `codex exec resume <id>` through an authorized child and verify the User type is referenced.
5. Only when stdin is a TTY, run the separate interactive `codex fork <id>` flow and confirm its branch ID differs from the original; otherwise record SKIP for this sub-check.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-017 | session resume / fork | Verify session resume continues prior context and fork creates a distinct branch when a TTY is available | `Spec folder: /tmp/cli-codex-playbook-cx017 (pre-approved, skip Gate 3). As a cross-AI orchestrator running a multi-turn task, route every write-bearing dispatch through the production fanout or an authorized child with AI_SESSION_CHILD=1 and MK_SPEC_GATE_ENFORCE=0. Dispatch codex exec --model gpt-5.6-luna --sandbox workspace-write -c model_reasoning_effort="high" -c service_tier="fast" with a 2-step plan: Step 1 sketch a TypeScript User type and write user.ts. Capture the session UUID from Codex's verbose header (regex 'session id: [a-f0-9-]+'). Then dispatch codex exec resume <UUID> "Step 2: implement validate(user) for the type from Step 1." (no --sandbox flag — codex exec resume does not accept it; redirect stdin from /dev/null). If a TTY is available, run the separate interactive `codex fork <UUID>` flow and capture its distinct branch session; otherwise record that fork sub-check as SKIP. Return a verdict naming the resume UUID and, when available, the fork UUID.` | 1. `bash: rm -rf /tmp/cli-codex-playbook-cx017 && mkdir -p /tmp/cli-codex-playbook-cx017` -> 2. `AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 codex exec --model gpt-5.6-luna -c model_reasoning_effort="high" -c service_tier="fast" --sandbox workspace-write "Spec folder: /tmp/cli-codex-playbook-cx017 (pre-approved, skip Gate 3). Begin a 2-step plan in /tmp/cli-codex-playbook-cx017/: Step 1 sketch a TypeScript User type with id, email, createdAt fields and write it to user.ts. Stop after Step 1." < /dev/null > /tmp/cli-codex-cx017-step1.txt 2>&1` -> 3. `bash: SESSION_ID=$(grep -oE 'session id: [a-f0-9-]+' /tmp/cli-codex-cx017-step1.txt \| head -1 \| awk '{print $3}'); test -n "$SESSION_ID"; printf 'STEP 1 SESSION_ID: %s\n' "$SESSION_ID" > /tmp/cli-codex-cx017-ids.txt` -> 4. `AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 codex exec resume "$SESSION_ID" --model gpt-5.6-luna -c model_reasoning_effort="high" -c service_tier="fast" "Spec folder: /tmp/cli-codex-playbook-cx017 (pre-approved, skip Gate 3). Step 2: implement validate(user: User): boolean for the type from Step 1 and write it to /tmp/cli-codex-playbook-cx017/validate.ts." < /dev/null > /tmp/cli-codex-cx017-step2.txt 2>&1` -> 5. `bash: if test -t 0; then codex fork "$SESSION_ID"; else printf 'SKIP: codex fork requires a TTY\n' >> /tmp/cli-codex-cx017-ids.txt; fi` | Step 1: temp dir exists; Step 2: exit 0, codex emits `session id: <uuid>` in verbose header; Step 3: SESSION_ID extracted (UUID format, non-empty); Step 4: exit 0, stdout references the `User` type from Step 1, validate.ts exists; Step 5: TTY fork creates a distinct branch ID, or records the documented SKIP when stdin is not a terminal | Step 1 stdout, Step 2 stdout, fork terminal output or IDs file, generated user.ts and validate.ts files, exit codes for the two headless dispatches | PASS if Step 1 emits a session UUID, Step 2 references the User type and exits 0, and the TTY fork emits a distinct UUID or the non-TTY sub-check is recorded as SKIP; FAIL if the resume UUID is missing, Step 2 lacks Step 1 context, or a TTY fork reuses SESSION_ID | (1) Confirm `codex exec resume` is supported; (2) re-run with `2>&1 \| tee` for stderr; (3) `codex exec resume` does NOT accept `--sandbox` flag — drop it; (4) all headless calls require `< /dev/null`; (5) capture the session id from raw Step 1 stdout, not machine-local state |

### Optional Supplemental Checks

- Open a TUI session with `codex` (no exec) and confirm the session picker lists the session created in Step 1.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` (§11 Session Management) | Authoritative session-management reference |
| `../../references/codex-tools.md` (§2 Session Management) | Documents resume/fork capabilities |
| `../../references/integration-patterns.md` (§11 Session Continuity) | Multi-turn workflow patterns |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | §11 Session Subcommands + Scripted Session Resume |
| `../../references/codex-tools.md` | §2 Unique Capabilities - Session Management |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CX-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/session-resume-fork.md`
