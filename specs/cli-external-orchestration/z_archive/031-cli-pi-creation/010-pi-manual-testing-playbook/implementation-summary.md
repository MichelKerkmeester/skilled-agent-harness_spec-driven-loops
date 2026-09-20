---
title: "Implementation Summary: Pi manual-testing playbook (planning)"
description: "Scenario Coverage Plan re-verified against phases 001-009's real landed facts (exit-code semantics, stdio-transport docs update, type-confirmed 32-event lifecycle set, 7-model roster); the actual playbook files stay unauthored, deferred to a future execution phase per this phase's own Hard Constraint."
trigger_phrases:
  - "pi manual testing playbook summary"
  - "cli-pi playbook planning status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/010-pi-manual-testing-playbook"
    last_updated_at: "2026-07-27T11:36:00Z"
    last_updated_by: "claude-code"
    recent_action: "Coverage plan re-verified against phases 001-009's real facts; phase complete for its own scope"
    next_safe_action: "Commit phase 010; start phase 011"
    blockers: ["The actual playbook files remain unauthored - out of this planning phase's own scope, deferred to a future execution phase"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-planning"
      parent_session_id: null
    completion_pct: 90
    open_questions: ["Pi's actual self-invocation-guard signal remains unresolved - not surfaced by phase 001"]
    answered_questions: ["Real repo counts re-verified live: 13 agents, 36 invokable commands, 5 native MCP servers - zero drift from this phase's authoring-time figures"]
---
# Implementation Summary: Pi manual-testing playbook (planning)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-pi-manual-testing-playbook |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase plans an 8-category, 19-scenario (`PI-001`..`PI-019`) manual-testing playbook for `cli-pi`, mirroring the sk-doc `create-manual-testing-playbook` conventions already proven by `cli-codex`/`cli-cursor`/`cli-devin`. Its own spec.md puts actually authoring the playbook files out of scope for this planning phase — the same Hard Constraint as phases 004/005/006/008/010's own predecessors in this packet. This closeout's job was to re-verify the plan against real, now-landed facts from phases 001-009, since all 9 had reached at least a Blocked-with-real-findings state by the time this phase closed.

### Coverage plan upgraded from routed-UNKNOWN to real findings

Four rows in the Scenario Coverage Plan (`spec.md` §9) originally routed an open question to a predecessor phase with no resolution available at authoring time. All four now cite real evidence:
- `PI-002` (headless exit-code semantics): phase 001 confirmed the exit code is genuinely unreliable on failure (0 then 1 across identical runs) — worse than the `cursor-agent` precedent this packet already knew about.
- `PI-011` (stdio MCP transport): phase 007's live docs re-fetch found stdio IS now documented (a material update since this phase's authoring), narrowing but not resolving the question — phase 007 itself stayed Blocked since installing the package was out of its own scope.
- `PI-015` (extension lifecycle events): phase 008's direct read of the installed package's `types.d.ts` found the real 32-event set, including block-capable `tool_call` — TYPE-CONFIRMED, a materially stronger evidence class than an assumed list, still short of a live-session capture.
- `PI-017`/`PI-018` (model dispatch): phase 009 landed the real, operator-confirmed 7-model roster in a fail-closed allowlist with no `"auto"` default.

### Real repo counts re-verified, zero drift

`find .claude/agents -name '*.md' | wc -l` (13), `grep -rl "^argument-hint:" .opencode/commands | wc -l` (36), and `.mcp.json`'s native server list (5) were all re-run live during this closeout and match the figures this phase's Scenario Coverage Plan already assumed — no correction needed there.

### Files Changed

No repository files outside this phase's own spec folder were touched. No playbook file was authored, and `cli-pi/SKILL.md` was not edited.

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | §9 rows for `PI-002`/`PI-011`/`PI-015`/`PI-017` upgraded with real phase 001/007/008/009 findings; dependency table and Open Questions section refreshed |
| `plan.md` | Modified | Definition of Ready/Done checked off where achievable; dependency table refreshed |
| `tasks.md`, `checklist.md` | Modified | This-phase items marked `[x]` with evidence; every future-authoring item marked `[B]` with an explicit deferred reason |
| `implementation-summary.md` | Created | This document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

No LUNA or GLM-5.2 dispatch was used: there is no code diff, and this phase's own Hard Constraint forbids the one action (authoring the actual playbook files) that would produce one. I re-verified the real repo counts directly and cross-referenced each of phases 001/007/008/009's own implementation-summary.md files to ground the Scenario Coverage Plan's updated rows in their real findings rather than leaving them as stale, authoring-time UNKNOWNs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not author the actual playbook files, even though phases 001-009 have now landed enough facts to make a credible attempt | `spec.md`'s Out of Scope section states this as a Hard Constraint for THIS phase; the future authoring pass is explicitly a separate, later action per the phase's own design |
| Upgrade the 4 stale "UNKNOWN, routed to phase X" rows with the real findings those phases produced | Leaving them as authoring-time UNKNOWNs when the answers are now available would understate how much this phase's own Scenario Coverage Plan can already be grounded in real evidence |
| Set Status to "Complete" for this phase's own planning-only scope | Every this-phase-scoped item (docs authored, precedents read, counts verified, coverage plan re-checked against 9 landed predecessor phases) is genuinely done; only the future-authoring-pass items remain open, and those are explicitly out of this phase's own scope by design |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `find .claude/agents -name '*.md' \| wc -l` | PASS — 13, matches this phase's existing figure |
| `grep -rl "^argument-hint:" .opencode/commands \| wc -l` | PASS — 36, matches this phase's existing figure |
| `.mcp.json` native server count | PASS — 5, matches this phase's existing figure |
| Secret-shaped-value grep across this phase's own docs | PASS — 2 hits, both benign NFR prose (one names a hypothetical env-var, not a value) |
| Changelog/version-history heading grep | PASS — 0 matches |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No playbook file exists yet.** The root `manual-testing-playbook.md` and all 19 `PI-NNN` scenario files remain unauthored; this phase produced only the plan those files will be built against.
2. **Pi's self-invocation-guard signal remains unresolved.** Phase 001 did not surface it; a future execution phase (or a later live-verification pass) must determine it before `PI-NNN` scenarios referencing the guard can be authored with real evidence.
3. **`PI-011`'s stdio-transport question and `PI-015`'s lifecycle-event set are narrowed but not live-session-confirmed.** Both phases 007 and 008 upgraded the evidence class (docs re-fetch, type-file read) but neither ran an actual `pi` session — the future authoring pass's own live-execution items still need a real dispatch to close.
4. **Whether a Pi-unique playbook category (no sibling analog) is warranted stays an open question**, per `spec.md` §10 — none of phases 001-009 (all planning-scope, no live session) surfaced a clear candidate.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
