# Iteration 8: Advisor integration — brief vs hardcoded render.ts

## Focus
Angle (f): should the skill-advisor brief read decisions from the new store, or leave `render.ts` hardcoded, or both?

## Actions Taken
- Re-read `render.ts` `renderAdvisorBrief` / fallback / timeout fallback.
- Re-read `skill-advisor-hook.md` fail-open + cadence dedup.
- Re-read `.cursor/rules/skill-routing.md` Cursor CLI dormancy.
- Compared advisor output size (one `Advisor:` line + 3 directive lines) to a decisions digest.

## Findings

### F-B8.1 Today's brief already has two layers; only one is a skill router
[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:103-117,441-476]
[SOURCE: .opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-45]

Layer 1 — **dynamic route:** `Advisor: {freshness}; use {skill} {confidence}/{uncertainty} pass.` Built from the skill graph. Fail-open `{}` if scoring fails.

Layer 2 — **constant directives:** hygiene / governor / proof-over-appearance, appended after `Directives:`. Also used as the entire fallback when there is no recommendation (`renderAdvisorFallbackDirective`). Timeout fallback (`renderAdvisorTimeoutFallback`) currently emits **only** a stale marker — **it drops the three directives** (gap: cold-start timeout loses the thermostat).

Layer 2 does not read constitutional files (iter 1). Layer 1 does not read ADRs.

### F-B8.2 Do not make the advisor MCP-read the decisions store
[SOURCE: .opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-25]
[SOURCE: .cursor/rules/skill-routing.md:16-17]

Advisor already has a kill-switch, 2.5–10s timeouts, and fail-open. Adding `memory_search` inside UserPromptSubmit would (a) reintroduce the MCP round-trip angle (b) forbade, (b) couple skill routing latency to the memory daemon, (c) still miss Cursor CLI if `beforeSubmitPrompt` is dormant. The digest must already be in git-tracked always-on context (iter 3). The brief can **mention** it in one short line (`Advisor: ... | decisions: DECISIONS.md`) without reading the file.

### F-B8.3 Hardcoded capsules stay; optional one-line pointer is the only advisor change
Ranked options:

| Change | Value | Risk |
| --- | --- | --- |
| Keep `HYGIENE_DIRECTIVE` / `GOVERNOR_DIRECTIVE` / `TERMINAL_PROOF_DIRECTIVE` as code | High — works even when AGENTS.md is not in a subagent's context (comment in render.ts:104-105: "even when AGENTS.md is absent from session context") | Low |
| Add a fourth hardcoded line "consult DECISIONS.md" | Medium — reminds models that lack alwaysApply | Low if one line; fights lifecycle dedup if the digest changes often (hash of digest in the line would bust dedup every promotion) |
| Have `renderAdvisorBrief` fs.read DECISIONS.md and inline it | High visibility | **High** token + timeout + Cursor CLI miss + cadence issues |
| Fold the 3 capsules into AGENTS.md and delete Layer 2 | Dedup | **High** for subagents that do not receive AGENTS.md (the exact failure render.ts documents) |

**Recommendation:** Keep hardcoded Layer 2. Do **not** inline the decisions digest in `render.ts`. Rely on always-on file load for the digest. Optionally fix `renderAdvisorTimeoutFallback` to also append Layer 2 (bug/gap, small). Optionally add a **stable** fourth line without a content hash: `Active decisions live in DECISIONS.md (git).` so dedup still treats it as constant.

Skill/advisor **binding** (angle g preview): skill-graph `graph-metadata.json` / trigger phrases remain the router; decisions digest is not a skill. If a standing decision constrains a skill (e.g. native-memory ban), put a one-line "see DECISIONS.md#native-memory" in the skill SKILL.md, not in the advisor renderer.

## Questions Answered
Q-B6 answered: brief does not read the new store; `render.ts` stays disposition-only; always-on file is the decisions surface; optional constant pointer; do not MCP from the hook.

## Ruled Out
- Advisor hook `memory_search` for constitutional or ADR hits every prompt.
- Inlining DECISIONS.md into `additionalContext`.

## Assessment
- newInfoRatio: 0.40
- noveltyJustification: Timeout-fallback drops directives (new gap); subagent-without-AGENTS.md is the load-bearing reason to keep render.ts; digest pointer must be hash-free to coexist with cadence dedup.
- confidence: high.

## Recommended Next Focus
Angle (g): separate-yet-integrated placement and spec/skill binding.
