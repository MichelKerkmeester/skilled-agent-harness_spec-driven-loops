---
title: "Implementation Summary: Cursor agents/skills/rules parity"
description: "Added static Cursor skill-routing rules and documented the dormant beforeSubmitPrompt adapter plus Cursor's non-applicable agent and command categories."
trigger_phrases:
  - "cursor agents skills rules parity summary"
  - "cursor static skill routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/014-cursor-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented static rules and parity findings."
    next_safe_action: "Review scoped uncommitted diff."
    blockers: []
    key_files: [".cursor/rules/skill-routing.md", "cli-cursor/SKILL.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "beforeSubmitPrompt is designed to call the shared skill-advisor brief builder, but the installed Cursor CLI does not deliver the event."
      - "Cursor CLI exposes neither custom-agent loading nor a dedicated command-file system."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-cursor-agents-skills-rules-parity |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.cursor/rules/skill-routing.md` is a new always-on static Cursor rule. It points code, design, documentation/spec, Git, prompt-engineering, deep-loop, and Cursor-delegation work to the corresponding top-level `.opencode/skills/*/SKILL.md` packet. It is intentionally a compact routing index, not a second `AGENTS.md`.

`cli-cursor/SKILL.md` now records three resolved boundaries: the `beforeSubmitPrompt` adapter is designed to call the shared skill-advisor brief builder but is dormant under the tested CLI; Cursor **does** load custom subagents from `.cursor/agents/*.md` and additionally auto-imports Claude-format `.claude/agents/*.md` (correcting an earlier wrong claim in this same phase); and Cursor has no dedicated command-file-system concept.

`tasks.md` and `checklist.md` now contain evidence for the source read, static rule, parity decisions, sibling comparison, and validation gates.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The source-read gate was satisfied before the rule file was created. `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:5-14` marks `beforeSubmitPrompt` as registered but delivery-unconfirmed; `:45-51` passes the prompt to `runClaudeHookAdapter('user-prompt-submit.js', ...)` and normalizes the response. The supplied live marker re-probe against `cursor-agent 2026.07.23-e383d2b` confirmed that the event still did not fire; the repository's hook-contract record preserves that result at `references/hook-contract.md:106`.

`cursor-agent generate-rule --help` was checked. It exposes an interactive generator and does not establish a required repository frontmatter convention, so the new rule uses plain Markdown with the explicit `alwaysApply: true` frontmatter requested by the phase. The rule content carries static packet pointers only; it does not reproduce a dynamic advisor brief or hook envelope.

The sibling Devin phase was read before documenting the parallel command non-applicability decision. No hook configuration or adapter source was modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use one static `.cursor/rules/skill-routing.md` file | The directory was empty, and a single compact index covers the requested skill families without duplicating repository governance. |
| Treat the dynamic advisor path as dormant | The adapter is wired for the shared builder, but the installed CLI's live `beforeSubmitPrompt` delivery is absent. Static rules are therefore a complement, not a substitute claim for dynamic classification. |
| CORRECTED -- mirror all 13 agents instead of recording a non-concept | The earlier "no custom-agent concept" call was inferred from a missing `--help` flag, but profiles are discovered by file convention. Cursor loads `.cursor/agents/*.md` and auto-imports `.claude/agents/*.md`; both confirmed live. |
| Record commands as a non-concept | `cursor-agent --help` has no `commands` command or dedicated command-file system, matching the Devin-side parity decision. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook source read | PASS: `user-prompt-submit.ts:5-14` and `:45-51` were read before `.cursor/rules/skill-routing.md` was created. |
| Dynamic delivery finding | PASS: the supplied live marker re-probe found no `beforeSubmitPrompt` delivery; `hook-contract.md:106` records the result. |
| Rule generator/help surface | PASS: `cursor-agent generate-rule --help` checked; interactive generator only, with no required frontmatter convention established. |
| Cursor agent roster | PASS: live roster probe lists all 13 repo agents with no duplicate entries; a real `prompt-improver` dispatch returned content derived from the mirrored agent body. |
| Cursor CLI parity boundaries | PASS: no dedicated command-file-system/`commands` concept. (The earlier companion claim about custom agents is corrected above.) |
| Static rule content | PASS: `.cursor/rules/skill-routing.md` is non-empty and contains only repository-relative routing pointers. |
| Non-overlap check | PASS: the adapter transports the current prompt to the shared advisor builder; the rule supplies static packet pointers. No dynamic brief text or hook response envelope is copied into the rule. |
| Hook immutability | PASS: `git diff --stat -- .cursor/hooks.json` produced no output. |
| Phase validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/030-cli-cursor-creation/014-cursor-agents-skills-rules-parity --strict` reports `Errors: 0  Warnings: 0` and `RESULT: PASSED`. |
| Parent validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/030-cli-cursor-creation --recursive --strict` reports `Errors: 0  Warnings: 0` and `RESULT: PASSED`. |
| Comment hygiene | NOT APPLICABLE: the Python-backed checker exits 2 for the changed Markdown files; no code files were changed, and the phase validator's `COMMENT_HYGIENE_MARKER` check passed. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Cursor still does not receive a dynamic per-turn skill-advisor-equivalent brief because `beforeSubmitPrompt` is dormant under the tested CLI build. The static rule reduces that gap for session-start context but cannot classify each new prompt.
2. No custom Cursor agent-profile loader or command-file system was added; both are explicitly outside the CLI's supported concepts.
3. The installed `generate-rule` command is interactive. The committed rule is therefore authored as plain Markdown with explicit always-on frontmatter rather than relying on an undocumented generator output format.
<!-- /ANCHOR:limitations -->
