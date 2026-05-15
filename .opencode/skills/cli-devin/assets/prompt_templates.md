---
title: "Devin CLI — Prompt Templates"
description: "Six copy-paste prompt templates covering the common cli-devin dispatch shapes: default coding, code review, architectural review, multi-file refactor, agent delegation, and cloud handoff. Plus a Memory Handback epilogue."
---

# Devin CLI — Prompt Templates

Six copy-paste templates. Pick the closest match, fill the placeholders, dispatch.

---

## 1. OVERVIEW

This file provides copy-paste prompt templates for the most common cli-devin dispatch shapes. Section 2 is the default coding dispatch (SWE-1.6, auto mode). Sections 3-4 cover complex tasks via DeepSeek v4 with fallback notes. Section 5 is multi-file autonomous refactor. Section 6 covers profile-scoped agent-surface delegation. Section 7 is the cloud-handoff initiation template (operator-confirmed only). Section 8 is the Memory Handback epilogue. Section 9 holds usage notes. Pick the closest match, fill the placeholders, dispatch.

---

## 2. Default Coding Dispatch (SWE-1.6, auto mode) — REQUIRES sk-prompt + pre-planning

> **SWE-1.6 prompt-quality contract (v1.0.2.0+)**: SWE-1.6 is coding-specialized but smaller than the complex-task models — it relies on the calling AI doing structural decomposition upfront. Every dispatch with `--model swe-1.6` MUST be composed through `sk-prompt` (one of STAR / RCAF / BUILD frameworks + CLEAR 5-check) AND include an explicit `<pre-plan>` block before the `<task>` block. The template below is the canonical pre-planned SWE-1.6 prompt shape.

**Step 1 — pre-prompt through sk-prompt.** Before writing the `--prompt-file` payload, invoke `sk-prompt` with the raw task description. Pick STAR (Situation / Task / Action / Result) for the typical case, RCAF (Role / Context / Action / Format) for single-file generation, or BUILD (Bounds / User-need / Implementation / Limits / Done-when) for multi-file refactor. Run the CLEAR 5-check. If complexity ≥ 7/10 or compliance/security signals appear, dispatch `@prompt-improver` via the Task tool instead of inline composition.

**Step 2 — compose the prompt with explicit pre-planning.** Use this template, filling every placeholder:

```
<framework>STAR | RCAF | BUILD</framework>

<context>
Calling AI: <runtime + model>
Spec folder: <path> (pre-approved, skip Gate 3) OR none
Active surface: <stack detected by sk-code, e.g. typescript-react, python-fastapi, go-stdlib>
Existing files in scope: <list>
</context>

<pre-plan>
Restate the task as 4 things BEFORE writing any code:

1. Expected outputs (exact files, function signatures, return types, behavior)
2. Available inputs / state (existing files, dependencies, repo conventions)
3. Ordered sequence of steps to produce the output:
   a. <step a>
   b. <step b>
   c. <step c>
4. Verification step that proves the work is done: <exact command>

Now execute the plan. Stop after each step and confirm the artifact matches the plan before proceeding to the next step.
</pre-plan>

<task>
<one-line goal — derived from step 1 of the pre-plan>
</task>

<constraints>
- Permission mode: auto.
- Do not modify files outside <scope>.
- Stop and report if <stop condition>.
- If any pre-plan step proves harder than expected (ambiguous input, surface mismatch, test that won't run), STOP and escalate — do not silently push past the plan.
</constraints>

<output>
- Final file(s): <list>
- Verification result: PASS or FAIL with rationale
- Per-step status: which steps completed cleanly, which were skipped / failed and why
</output>
```

**Step 3 — dispatch.**

```bash
devin --prompt-file /tmp/devin-prompt.md --model swe-1.6 --permission-mode auto -p 2>&1 </dev/null
```

**Why pre-planning matters for SWE-1.6.** Without an explicit pre-plan, SWE-1.6 will start coding on the first interpretation that fits the prompt — which is often not the right one for ambiguous tasks. With the pre-plan block, SWE-1.6 first restates expected outputs / inputs / steps / verification BEFORE writing code, surfacing ambiguity early. This is the difference between SWE-1.6 producing usable output on first try vs needing multiple retries.

**When to escalate off SWE-1.6.** If the pre-planning step itself reveals the task is more complex than "context gathering / tool use / simple-to-medium well-defined" (ambiguous requirements, multi-step reasoning, large refactor scope), the calling AI should switch to `--model deepseek-v4` rather than throwing a longer freeform prompt at SWE-1.6.

---

## 3. Code Review Dispatch (DeepSeek v4 primary for complex review, read-only intent)

```
<context>
Surface: <stack>
Files under review: <list>
Calling AI: <runtime>
</context>

<task>
Review the code at <paths>. Identify findings on these axes:
- Security (OWASP-style)
- Correctness (logic, edge cases)
- Maintainability (naming, structure, dead code)
- Performance (hot paths, allocations)
- Test coverage (gaps, weak assertions)

Output format: P0/P1/P2 finding blocks with:
- Severity (P0/P1/P2)
- Location (file:line)
- Rationale (1-2 sentences)
- Suggested fix (1-3 sentences)

Do NOT modify any files. This is a read-only review.
</task>

<constraints>
- Permission mode: normal. Read-only intent — do not edit.
- Cite file:line for every finding.
- Cap output at 30 findings; if more exist, rank and trim.
</constraints>
```

Dispatch:
```bash
devin --prompt-file /tmp/devin-review.md --model deepseek-v4 --permission-mode auto 2>&1 </dev/null
# Fallback if the review covers a large surface (long files, sprawling diffs):
#   --model kimi-k2.6
# Fallback if the review is agentic / tool-use heavy (e.g. cross-MCP correlation):
#   --model glm-5.1
```

---

## 4. Complex Refactor — Cross-Paradigm (DeepSeek v4 primary; Kimi k2.6 fallback for large context)

```
<context>
The <component A — e.g. Go service> and <component B — e.g. TS client> have drifted on <behavior>.
Files A: <list>
Files B: <list>
Calling AI: <runtime>
</context>

<task>
Reconcile <behavior> across <A> and <B>. The canonical truth is <which side, with rationale>.
- Update <files> to align.
- Update tests on both sides.
- Run: <go test cmd> AND <client test cmd>.
</task>

<constraints>
- Permission mode: normal.
- Touch only the listed files.
- Do not refactor adjacent code.
- Stop if either test suite fails after 3 retry attempts.
</constraints>
```

Dispatch:
```bash
devin --prompt-file /tmp/devin-cross.md --model deepseek-v4 --permission-mode auto 2>&1 </dev/null
# Fallback when the cross-paradigm work needs a large context window
# (e.g. many files on each side or sprawling diffs):
#   --model kimi-k2.6
```

---

## 5. Multi-File Autonomous Refactor (Devin's strength)

```
<context>
Surface: <stack>
Affected area: <directory or pattern>
Calling AI: <runtime>
</context>

<task>
Refactor <area> by <pattern, e.g. "extract retry logic into src/lib/retry.ts">. Apply across all call sites. Keep behavior identical, verified by the test suite.
</task>

<constraints>
- Permission mode: normal.
- Iterate: edit, test, fix, repeat. Stop on third consecutive test failure.
- Do not modify files outside <area>.
- Output: a summary listing files touched, key changes, and test results.
</constraints>

<termination>
Done when:
- All call sites updated.
- Full test suite passes.
- No lint errors introduced.

Blocked when:
- Ambiguity in the refactor target.
- Test suite has a flaky failure unrelated to the refactor.
</termination>
```

Dispatch:
```bash
devin --prompt-file /tmp/devin-refactor.md --model swe-1.6 --permission-mode auto 2>&1 </dev/null
```

---

## 6. Agent-Surface Delegation (using Devin's profile-scoped surfaces)

```
<context>
Calling AI: <runtime>
This dispatch references profile-scoped surfaces installed on the operator's Devin profile.
</context>

<task>
<one-line goal>

Use the `<skill-name>` skill from this profile for the <area> steps.
Honor the `<rule-name>` rule from this profile.
If <condition>, route through the `<mcp-server-name>` MCP server to <action>.
</task>

<constraints>
- Permission mode: normal.
- Honor the profile rules unconditionally.
</constraints>
```

Dispatch:
```bash
devin --prompt-file /tmp/devin-surface.md --model swe-1.6 --permission-mode auto 2>&1 </dev/null
```

---

## 7. Cloud-Handoff Initiation (operator-confirmed)

> **GATE:** Before using this template, verify the 5 checks in `references/cloud_handoff.md` §3. NO inferred consent.

```
<context>
This dispatch will be handed off to a Devin cloud agent after operator confirmation.
Operator confirmed cloud handoff: "<verbatim phrase>" at <timestamp>.
Account provisioning confirmed: <yes>.
Repo-state review confirmed: <yes>.
Permission mode for cloud session: <auto/dangerous — operator-approved>.
Repo state at handoff: branch=<name>, commit=<sha>, dirty=<true/false>.
Calling AI: <runtime>.
</context>

<task>
<one-line goal that justifies a multi-hour cloud session>

Acceptance criteria:
- <criterion 1>
- <criterion 2>
- <criterion 3>

Verification (the cloud agent must run these before reporting DONE):
- <exact command 1>
- <exact command 2>
</task>

<termination>
Cloud agent reports DONE when:
- All acceptance criteria met.
- All verification commands pass.
- A PR is opened against branch <target>.

Cloud agent reports BLOCKED when:
- Ambiguous requirement encountered.
- Security-sensitive change cannot be made safely.
- Verification fails after 3 retry attempts.
</termination>

<return>
On DONE: PR URL + 5-bullet summary + verification log.
On BLOCKED: state of work + the specific ambiguity + recommended next operator action.
</return>
```

Dispatch (operator initiates the handoff inside the TUI; the skill prepares the seed):
```bash
devin --prompt-file /tmp/devin-cloud.md --model swe-1.6 --permission-mode auto
# After launch, operator triggers cloud handoff per Devin's documented in-TUI procedure.
```

---

## 8. Memory Handback Epilogue (append to any of the above)

Append this block before the closing `<constraints>` to make Devin emit a `MEMORY_HANDBACK` section the calling AI can extract for `generate-context.js`:

```
<memory_handback>
After completing (or stopping with progress), emit a clearly delimited MEMORY_HANDBACK section in the output:

BEGIN_MEMORY_HANDBACK
recent_action: <one-line summary of what was done>
next_safe_action: <suggested follow-up the calling AI can take>
blockers: <list or empty>
key_files:
  - <file 1>
  - <file 2>
open_questions: <list or empty>
answered_questions:
  - q: <question>
    a: <answer>
END_MEMORY_HANDBACK
</memory_handback>
```

The calling AI extracts the block between `BEGIN_MEMORY_HANDBACK` and `END_MEMORY_HANDBACK`, builds a JSON payload per the canonical 7-step protocol, scrubs secrets, and dispatches `generate-context.js`. See `system-spec-kit/references/cli/memory_handback.md`.

---

## 9. Notes

- Always use `--prompt-file` for prompts in this file — they exceed practical positional-argument lengths.
- Always append `2>&1 </dev/null` for non-interactive / background dispatches.
- Permission-mode escalations (`dangerous`) require explicit operator approval; record the approval in the dispatch log.
- Cloud handoff (§6) requires the full 5-check gate from `cloud_handoff.md`.
