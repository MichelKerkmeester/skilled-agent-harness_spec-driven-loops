---
title: "Devin CLI — Prompt Templates"
description: "Six copy-paste prompt templates covering the common cli-devin dispatch shapes: default coding, code review, architectural review, multi-file refactor, agent delegation, and cloud handoff. Plus a Memory Handback epilogue."
---

# Devin CLI — Prompt Templates

Six copy-paste templates. Pick the closest match, fill the placeholders, dispatch.

## 1. OVERVIEW

This file provides copy-paste prompt templates for the most common cli-devin dispatch shapes. Section 2 is the default coding dispatch (SWE-1.6, auto mode). Sections 3-4 cover complex tasks via DeepSeek v4 with fallback notes. Section 5 is multi-file autonomous refactor. Section 6 covers profile-scoped agent-surface delegation. Section 7 is the cloud-handoff initiation template (operator-confirmed only). Section 8 is the Memory Handback epilogue. Section 9 holds usage notes. Pick the closest match, fill the placeholders, dispatch.

---

## 2. Default Coding Dispatch (SWE-1.6, auto mode) — REQUIRES swe-1.6 profile + canonical CLEAR + pre-planning

> **SWE-1.6 prompt-quality contract**: SWE-1.6 is coding-specialized but smaller than the complex-task models — it relies on the calling AI doing structural decomposition upfront. The framework choice (RCAF primary; STAR fallback, BUILD for multi-file refactor) and the mandatory pre-planning contract are OWNED by [`../../sk-prompt-small-model/references/models/swe-1.6.md`](../../sk-prompt-small-model/references/models/swe-1.6.md) (reached via the tier-2 model-override step of the 3-tier precedence rule in SKILL.md §4). Every dispatch with `--model swe-1.6` MUST honor that swe-1.6 profile plus the 3-tier precedence rule (+ CLEAR 5-check) AND include an explicit `<pre-plan>` block before the `<action>` block. The template below is the executor-owned dispatch wrapper around the profile's canonical pre-planned SWE-1.6 prompt shape, using RCAF.

**Step 1 — honor the swe-1.6 profile + 3-tier precedence.** Before writing the `--prompt-file` payload, consult [`../../sk-prompt-small-model/references/models/swe-1.6.md`](../../sk-prompt-small-model/references/models/swe-1.6.md) — the canonical owner of the SWE-1.6 framework choice. The profile sets RCAF primary (the role anchor gives SWE-1.6 immediate framing without burning tokens on situation-setting), STAR fallback for narrative-heavy context-gathering tasks where role framing doesn't fit naturally, and BUILD for well-defined multi-file refactors where scope boundaries dominate — but DO NOT pair BUILD with strict bundle-gate wording (verbose constraint language pushes SWE 1.6 toward defensive output rather than direct code). Run the CLEAR 5-check. If any canonical Tier 3 trigger applies (complexity ≥ 7/10, compliance/policy/privacy/security sensitivity, >1 stakeholder or audience, >1 ambiguous requirement, or the fast-path CLEAR cannot clear its floor), dispatch `@prompt-improver` via the Task tool instead of inline composition.

**Step 2 — compose the prompt with RCAF + explicit pre-planning.** Use this template, filling every placeholder. The framework is RCAF by default (per the profile); swap to STAR or BUILD only if the task clearly fits one of those shapes better.

```
<framework>RCAF</framework>

<role>
Senior implementation engineer working on <stack detected by sk-code, e.g. typescript-react, python-fastapi, go-stdlib>. Your job is to produce code that satisfies the acceptance criteria exactly, staying strictly in scope.
</role>

<context>
Calling AI: <runtime + model>
Spec folder: <path> (pre-approved, skip Gate 3) OR none
Active surface: <stack from sk-code>
Existing files in scope: <list>
Allowed writes: <list of paths SWE-1.6 may touch — scope-creep is a hard fail>
Context budget: Tool results may include markers like `[... truncated 1200 tokens]`. Treat those markers as intentional budget boundaries: do not assume omitted content is absent, do not invent the omitted section, and request narrower evidence if the missing span is required.
</context>

<pre-plan>
Restate the task as 4 things BEFORE writing any code:

1. Expected outputs (exact files, function signatures, return types, behavior)
2. Available inputs / state (existing files, dependencies, repo conventions)
3. Ordered sequence of steps to produce the output (medium density — 3 to 4 steps; dense plans did NOT help in the 003 run):
   a. <step a>
   b. <step b>
   c. <step c>
4. Verification step that proves the work is done: <exact command>

Now execute the plan. Stop after each step and confirm the artifact matches the plan before proceeding to the next step.
</pre-plan>

<action>
<one-line goal — derived from step 1 of the pre-plan>
</action>

<format>
Produce work as follows:
- Code in fenced markdown blocks with file paths in comments
- Inline verification commands at the end that prove acceptance
- Permission mode: auto
- Do not modify files outside <Allowed writes>
- If any pre-plan step proves harder than expected (ambiguous input, surface mismatch, test that won't run), STOP and escalate — do not silently push past the plan
</format>
```

**Step 3 — dispatch.**

```bash
# FRAMEWORK: RCAF
devin --prompt-file /tmp/devin-prompt.md --model swe-1.6 --permission-mode auto -p 2>&1 </dev/null
```

**Why RCAF is the default.** Role-context-action-format produces tighter, more focused SWE 1.6 outputs than situation-task-action-result narrative framing. The role anchor gives SWE 1.6 immediate framing without burning tokens on situation-setting. The result is less prose preamble and more direct code.

**Why medium (not dense) pre-planning.** Dense pre-plans with 4+ steps and full I/O contracts per step do not translate to better output. SWE 1.6 follows the structure but does not gain quality from it. 3-step medium pre-plans hit the sweet spot — enough structure to surface ambiguity early, not so much that the prompt itself becomes the task.

**Why standard (not strict) bundle-gate language.** Verbose constraint language ("smoke-run required", aggressive anti-hallucination wording, multi-layer enforcement clauses) pushes SWE 1.6 toward defensive output: more disclaimers, more "I can't do this in this session" caveats, less direct code. Trust the framework and the pre-plan to do the work; do not pile on imperatives.

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
