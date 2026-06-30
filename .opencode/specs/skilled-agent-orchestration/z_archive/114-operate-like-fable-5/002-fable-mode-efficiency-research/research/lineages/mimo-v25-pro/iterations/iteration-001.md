# Iteration 1 — mimo-v25-pro lineage
**Focus:** Cross-runtime hook architecture and transferability gaps
**Model:** xiaomi/mimo-v2.5-pro via cli-opencode
**Timestamp:** 2026-06-15T12:32:00Z

---

## Findings

### M1: The thermostat surface is already cross-runtime — the prior lineages under-stated this

The skill-advisor hook system fires on **every user prompt** across all three runtimes:

| Runtime | Hook mechanism | Event | Output shape |
|---------|---------------|-------|--------------|
| Claude Code | `hooks/claude/user-prompt-submit.ts` | `UserPromptSubmit` | `hookSpecificOutput.additionalContext` |
| Codex CLI | `hooks/codex/user-prompt-submit.ts` | `UserPromptSubmit` | `hookSpecificOutput.additionalContext` (stdin JSON canonical) |
| OpenCode | `.opencode/plugins/mk-skill-advisor.js` + bridge `.mjs` | `experimental.chat.system.transform` | Mutates `output.system` |

**Source:** `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:62-68`

The opus-account2 lineage's merged research says "OpenCode/Codex per-turn-hook read-reliability is unverified" — but the hook reference at `skill_advisor_hook.md` documents all three runtimes with smoke tests. The OpenCode path uses a **plugin bridge** that imports the same native `compat/index.js` and falls back to the warm-only CLI daemon. This is not "unverified" — it's documented and tested, just differently wired (system prompt mutation vs. additionalContext injection).

**Implication:** The governor-on-hook recommendation (Tier B #1 in the merged research) is more portable than stated. The attachment point exists across all three runtimes. The question shifts from "does the hook exist?" to "what's the injection format per runtime?"

### M2: OpenCode's hook surface works differently — system prompt mutation, not context injection

Claude Code and Codex inject via `additionalContext` (appended context). OpenCode uses `experimental.chat.system.transform` which **mutates the system prompt**. This is architecturally different:

- Claude/Codex: governor text appears as additional context after the main prompt
- OpenCode: governor text can be woven into the system prompt itself

**Source:** `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:68`

For a fable-5 governor, this means OpenCode could integrate the governor **at the setpoint level** (system prompt) rather than just as a per-turn reminder. This is actually *stronger* than Claude's approach (where CLAUDE.md is the setpoint and reinject.sh is the thermostat), because the system prompt has higher authority than injected context.

**Implication:** Tier B should specify per-runtime injection strategy: system prompt mutation for OpenCode, additionalContext for Claude/Codex.

### M3: The governor-block.md is Opus-specific in its failure model — transferability to non-Anthropic models is an open question

The governor targets "Opus's trained default carries an anxious texture: recursive authenticity/motive auditing, armor-hedging, and a self-audit loop with no natural exit."

**Source:** `external/opus-fable-mode-main/governor-block.md:4`

Non-Anthropic models (mimo-v2.5-pro, GPT-5.5, Kimi, Qwen) may not share this failure mode. The governor's rules about "reason about the problem, not yourself" and "one audit, then done" may be:
- Unnecessary (if the model doesn't have the anxious disposition)
- Counterproductive (if the model needs *more* self-checking, not less)
- Differently effective (the 8 rules may need reweighting per model family)

**Source:** `external/opus-fable-mode-main/fable-mode.md:9-13` — "The anxious disposition is trained into the weights and cannot be deleted by instruction."

**Implication:** The governor should be parameterized per model family. The fable-mode.md's own honesty (G4) says "steers style not capability." For non-Opus models, the governor may need to steer *different* failure modes. This is a gap in the current recommendation set.

### M4: The dead pointer in AGENTS.md is a live staleness bug in the highest-read surface

AGENTS.md references `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` (hyphenated) but the actual file is `skill_advisor_hook.md` (underscored).

**Source:** caught by the opus-account2 lineage, confirmed by grep — the file at `.opencode/skills/system-spec-kit/references/hooks/` contains `skill_advisor_hook.md` and `skill_advisor_hook_validation.md`, no hyphenated variant.

This is the exact class of bug Fable's F6 ("engineer staleness out of artifacts") prescribes fixing: convert the static pointer into a check. The fix is one character (hyphen → underscore) but the principle is to add a CI check or a grep-based assertion.

**Implication:** This should be Tier A (doctrine text) — a concrete example of the staleness pattern, immediately fixable, and a proof-of-concept for the F6 ritual.

### M5: The leak_test.py harness is Claude-Code-specific — porting requires runtime-aware log parsing

`leak_test.py` reads from `~/.claude/projects/` and parses Claude Code JSONL transcripts. It looks for `message.model` fields and `content` arrays with `text`/`tool_use` blocks.

**Source:** `external/opus-fable-mode-main/leak_test.py:56-95`

For cross-runtime measurement:
- **OpenCode** stores session data differently (no `~/.claude/projects/` path)
- **Codex** uses its own transcript format
- The metric definitions (words/msg, tool:text ratio, caveat%, self-opener%) are model-agnostic, but the log-parsing code is Claude-specific

**Implication:** Tier C (measurement) needs a runtime-agnostic adapter layer. The metrics are portable; the data extraction is not. A `leak_test.py` equivalent for OpenCode would need to parse OpenCode's session format.

---

## Ruled Out
- Re-recommending round-1's shipped set (out of scope per spec)
- Implementing the governor (research-only round)

## Assessment
- **newInfoRatio:** 0.75 (5 substantial findings, mostly net-new angles the prior lineages didn't cover)
- **Status:** complete
- **Focus for next iteration:** Surface map gaps — which adjustable surfaces did the prior lineages miss? Focus on agent prompts, constitutional memories, and deep-loop runtime integration points.
