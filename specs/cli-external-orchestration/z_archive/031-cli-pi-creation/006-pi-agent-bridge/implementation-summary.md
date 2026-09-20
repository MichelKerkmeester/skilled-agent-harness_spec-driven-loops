---
title: "Implementation Summary: Pi agent bridge"
description: "Design-verified translation plan mapping all 13 real .claude/agents/*.md files onto the third-party pi-subagents schema, a 4-tier translation order, and a 5-behavior disposition table, re-derived live with zero drift."
trigger_phrases:
  - "pi agent bridge summary"
  - "pi-subagents translation implementation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/006-pi-agent-bridge"
    last_updated_at: "2026-07-27T10:08:00Z"
    last_updated_by: "claude-code"
    recent_action: "Design re-verified live, zero drift; planning phase complete"
    next_safe_action: "Commit phase 006; start phase 007"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Does pi-subagents support nested subagent-of-subagent dispatch, needed for Tier 4 (ai-council, orchestrate)? - routed to a future execution phase"]
    answered_questions: ["13-agent count and tools:-scoped 11/13 MCP-dependency tally re-verified live at closeout, zero drift"]
---
# Implementation Summary: Pi agent bridge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-pi-agent-bridge |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase plans how this repo's 13 real `.claude/agents/*.md` role files translate onto Pi's own multi-agent surface — which, unlike Pi's native `SKILL.md` support, exists only through a third-party community package, `pi-subagents`. The design work — a per-agent inventory tiered by MCP-dependency and cross-agent-dispatch coupling, a 17-field frontmatter mapping table, and a 5-behavior disposition table for Claude-only runtime conventions with no confirmed Pi equivalent — was already substantively drafted during the packet's initial scaffolding pass. This phase's job was closeout: re-verify every count against the live repo tree, refresh dependency-status rows that had gone stale as earlier phases landed, and record honest evidence in place of placeholder self-assessment.

### Agent inventory and MCP-dependency tally, re-verified live

`find .claude/agents -name '*.md' | wc -l` still returns 13, matching the authoring-time snapshot exactly. Re-checking the MCP-dependency tally surfaced a real methodology nuance worth recording: a naive whole-file `grep -l 'mcp__' .claude/agents/*.md` returns 12 of 13 (only `prompt-improver.md` has zero occurrences), which looks like a drift from `plan.md`'s stated "11 of 13." Scoping the grep to only the `tools:` frontmatter line (the field that actually grants capability, matching `plan.md`'s own stated citation method) resolves the apparent discrepancy: `deep-improvement.md` mentions `mcp__mk_spec_memory__*`/`mcp__mk_code_index__*` in a body-prose fallback-guidance paragraph but carries no MCP tool in its `tools:` frontmatter. `plan.md`'s tools:-scoped 11/13 figure is the correct one for translation purposes — the frontmatter is what actually gets ported, not incidental prose mentions.

### Frontmatter mapping and disposition tables

Unchanged from authoring: the 17-field Claude-to-`pi-subagents` mapping table and the 5-behavior Claude-only-runtime-convention disposition table needed no revision — they were derived from the agents' own real frontmatter and `pi-subagents`' documented schema (live-fetched 2026-07-27), neither of which has changed since authoring.

### Files Changed

No repository files were changed by this phase. It is planning-only (Hard Constraints, packet-wide): `.claude/agents/*.md` stayed read-only, no `pi-subagents` package was installed, and no file was created under `.pi/`.

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Closed out phase 006: status, evidence, and the live re-derivation recorded; stale dependency-status rows refreshed (phases 001/004 are now Complete, not "Planned"); `tasks.md`'s future-execution-phase tasks (T001, T003-T010) marked `[B]` with an explicit deferred reason instead of a bare, unexplained `[ ]` |
| `implementation-summary.md` | Created | This document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The per-agent inventory, frontmatter mapping table, tier assignment, and behavior-disposition table were already drafted during the packet's initial authoring pass. This phase's own job was verification and closeout, not fresh design, so no LUNA dispatch was used: there is no code diff to implement, only a documentation set to re-verify against the live repo tree and a real methodology nuance (whole-file grep vs. tools:-frontmatter-scoped grep) to resolve. I ran the re-derivation myself directly and reconciled the apparent MCP-count discrepancy rather than picking a number without checking. No GLM-5.2 review dispatch either, for the same reason as phases 004 and 005: no code diff exists for an independent reviewer to check. I deliberately did NOT run `pi install npm:pi-subagents` or write any `.pi/agents/**/*.md` file — that is explicitly out of this phase's own scope (spec.md's Hard Constraint), reserved for a future execution phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep this phase strictly planning-only; do not install `pi-subagents` or write any `.pi/agents/**/*.md` file | The phase's own spec.md names this as a Hard Constraint (Out of Scope), not a soft preference — installing third-party software and writing runtime config belongs to a later, explicitly-approved execution phase, matching phase 004/005's own planning-only discipline |
| Mark `tasks.md`'s T001, T003-T010 as `[B]` blocked-deferred rather than leaving them `[ ]` pending or force-completing them | These tasks literally describe the future execution phase's own steps (install, translate, verify parse). Leaving them unchecked without explanation reads as stalled work; force-completing them would mean fabricating an install that never happened. `[B]` with an explicit `[DEFERRED: ...]` reason states the truth: out of scope by design |
| Resolve the MCP-dependency count via the `tools:`-frontmatter-scoped grep, not the whole-file grep | The frontmatter `tools:` line is what actually grants capability at translation time; a bare-substring whole-file grep counts incidental body-prose mentions (like `deep-improvement.md`'s fallback-guidance paragraph) that carry no translation consequence |
| Refresh the dependency-status table's stale "Planned" rows for phases 001 and 004 | Both phases landed since this phase was originally authored; an execution phase reading this plan later needs accurate upstream status, not a snapshot frozen at authoring time |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `find .claude/agents -name '*.md' \| wc -l` | PASS — 13, matches authoring-time count, zero drift |
| MCP-dependency tally, `tools:`-frontmatter-scoped | PASS — 11/13, `deep-improvement` and `prompt-improver` the two exceptions, matches `plan.md` exactly; whole-file grep's apparent 12/13 reconciled as a body-prose false positive |
| Tier split (2+5+4+2=13) | PASS — re-verified against the live inventory, matches `plan.md`'s tier table |
| `.claude/agents/` and `.pi/` untouched | PASS — `git status --porcelain` on both paths returns nothing |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No `pi-subagents` package has actually been installed, and no `.pi/agents/**/*.md` file has been created.** This phase is planning-only by its own Hard Constraint. A future execution phase must install the package and translate the 13 agents in tier order, per `plan.md` §4.
2. **The Tier 4 agents (`ai-council`, `orchestrate`) stay blocked on an unresolved open question** — whether `pi-subagents` supports nested subagent-of-subagent dispatch at all. If unsupported, a future execution phase must document a capability loss rather than force a literal translation.
3. **11 of 13 agents lose their MCP capability in translation until phase 007 (`pi-mcp-host-integration`) resolves stdio-transport support.** Already flagged per-agent in the inventory table as "capability blocked pending phase 007," not silently dropped.
4. **`model:`/`thinking:` field values are deliberately unset**, deferred to phase 009 (`pi-model-registry-and-routing`), consistent with the precedented lesson that a competitor CLI's model/effort syntax must be live-confirmed, never assumed.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
