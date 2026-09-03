---
title: "Iteration 2: Always-loaded memory patterns vs static constitutional files"
trigger_phrases: []
---
# Iteration 2: Always-loaded memory patterns vs static constitutional files

## Focus
Angle (a): What makes Claude Code native memory / `@`-imports and Cursor rules active every turn, versus this repo's constitutional markdown which is retrieved only on search/prime?

## Actions Taken
- Fetched official Claude Code memory docs (`https://code.claude.com/docs/en/memory.md`).
- Fetched official Cursor rules docs (`https://cursor.com/docs/context/rules`).
- Read this repo's `.cursor/rules/skill-routing.md` and `sk-vision.md` (`alwaysApply: true`).
- Read `constitutional/memory-system-spec-kit-only.md` (owner ban on Claude native MEMORY.md).
- Cross-checked AGENTS.md/CLAUDE.md inlining vs constitutional folder.

## Findings

### F-B2.1 Active means "injected into the model context by the runtime, no tool call"
[SOURCE: https://code.claude.com/docs/en/memory.md]
[SOURCE: https://cursor.com/docs/context/rules]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:1373-1403]

Claude Code: `CLAUDE.md` / `CLAUDE.local.md` load at launch (hierarchy walk); `@path` imports expand at launch (do **not** save tokens; max 4 hops). Auto memory `MEMORY.md` loads the first 200 lines or 25KB at the start of every conversation. Path-scoped `.claude/rules/` load only when matching files are in play. Docs are explicit: these are **context, not enforced configuration** — hooks enforce.

Cursor: Project Rules `.cursor/rules/*.mdc` with `alwaysApply: true` are included in every Agent request. `AGENTS.md` at repo root is always-on; nested `AGENTS.md` scopes to that subtree. Rules "when applied, are included at the start of the model context." They do not affect Cursor Tab or Inline Edit.

This repo's constitutional files: injected only when `memory_search`/`memory_index_scan` runs with `includeConstitutional` or on first MCP tool-call prime as **response hints**. They never enter the system prompt by themselves.

**Active vs static = load path, not markdown quality.** The 20 files are well-written rules sitting on a retrieval bus; CC/Cursor rules sit on a prompt-injection bus.

### F-B2.2 This repo already uses the active bus — and banned the Claude native one
[SOURCE: .cursor/rules/skill-routing.md:1-17]
[SOURCE: .cursor/rules/sk-vision.md:1-3]
[SOURCE: .opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md:22-38]
[SOURCE: AGENTS.md:39-41]
[SOURCE: CLAUDE.md:39-41]

`.cursor/rules/skill-routing.md` is `alwaysApply: true` and states Cursor's `beforeSubmitPrompt` advisor delivery is **dormant under the tested CLI build**; the static rule is the complement. Root `AGENTS.md` / `CLAUDE.md` are the large always-on frameworks (they already inline Gate 3, comment hygiene, CLI dispatch, and **link out** to constitutional files for the long form).

Owner directive 2026-05-31: do not write Claude native `~/.claude/**/memory/MEMORY.md` unless explicitly asked. Native auto-memory is the product's always-on decisions store; this repo forbade it to avoid a split brain, then put "always-surface" rules into a search index that is **not** always-on. That substitution is the core design failure Workstream B is correcting.

### F-B2.3 Token budgets on the active bus are strict; constitutional maxTokens:2000 is a search cap, not a prompt cap
[SOURCE: https://code.claude.com/docs/en/memory.md]
[SOURCE: https://cursor.com/docs/context/rules]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/scoring/importance-tiers.ts:33-41]

Claude: target **under 200 lines** per CLAUDE.md; skip files over 4 MiB; MEMORY.md clipped to 200 lines/25KB. Imports do not reduce tokens. Cursor: keep rules under **500 lines**; always-apply should sit far below that because they pay the tax every request. Constitutional `maxTokens: 2000` applies to indexed records at search time, not to every-turn prompt budget. Dumping all 20 rules into AGENTS.md would violate both vendors' always-on budgets (AGENTS.md is already a large framework).

### F-B2.4 Enforcement and memory are orthogonal in both vendor models
[SOURCE: https://code.claude.com/docs/en/memory.md] (CLAUDE.md vs hooks)
[SOURCE: iteration-001.md F-B1.2]

Claude docs: "To block an action regardless of what Claude decides, use a PreToolUse hook." Same split we observed: comment-hygiene checker + Gate 3 classifier vs markdown advice. A replacement decisions system should stay on the advice/context bus; keep hooks as the enforcement bus.

## Questions Answered
Q-B1 answered: active = runtime prompt injection (CLAUDE.md, MEMORY.md first 200/25KB, Cursor `alwaysApply` / root AGENTS.md). Constitutional files are static relative to that bus; they become visible only after an MCP search or first-tool prime hint.

## Dead Ends
- Using `@`-imports to "save tokens" while loading constitutional files from CLAUDE.md — vendor docs say imports still load at launch.
- Reviving Claude native MEMORY.md as the replacement — owner banned it; would re-split the store.

## Ruled Out
- "Make constitutional files active by setting alwaysSurface true" — already true and unused (iter 1).
- "Replace Spec Kit Memory wholesale with Claude native auto-memory" — contradicts `memory-system-spec-kit-only.md` and the 2026-05-31 owner directive.

## Assessment
- newInfoRatio: 0.78
- noveltyJustification: External vendor contracts plus this repo's alwaysApply rules and native-memory ban were not in iter 1; they define the active-vs-static test for the replacement.
- confidence: high on vendor load semantics (official docs); medium on Cursor CLI dormancy (stated in skill-routing.md for the tested CLI build, not re-verified this run).

## Reflection
Vendor docs and local alwaysApply files were the right sources; catalog prose about "always-surface" is marketing for a search feature.

## Recommended Next Focus
Angle (b): best home to surface decisions every turn without an MCP round-trip — git-tracked auto-loaded file vs render.ts injection vs hybrid, given Cursor CLI advisor dormancy and Claude UserPromptSubmit injection.
