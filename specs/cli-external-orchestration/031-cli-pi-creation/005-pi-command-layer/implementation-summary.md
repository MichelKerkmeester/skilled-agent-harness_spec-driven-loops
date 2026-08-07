---
title: "Implementation Summary: Pi command layer"
description: "Design-verified flattening of 36 invokable .opencode/commands/*.md files into a collision-free Pi prompt-template naming convention, plus a 5-pattern $ARGUMENTS translation table, re-derived live with zero drift."
trigger_phrases:
  - "pi command layer summary"
  - "pi prompt templates implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer"
    last_updated_at: "2026-07-27T10:01:30Z"
    last_updated_by: "claude-code"
    recent_action: "Design re-verified live, zero drift; phase complete"
    next_safe_action: "Commit phase 005; start phase 006"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Where the persisted doctrine file eventually lives in cli-pi/references/ - filename TBD"]
    answered_questions: ["36 flattened names re-derived live at closeout, zero collisions, zero drift from the authored worklist"]
---
# Implementation Summary: Pi command layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-pi-command-layer |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase answers a question 029 (Devin) and 030 (Cursor) never had to ask: how do this repo's 36 invokable slash commands, organized as nested Markdown under 8 groups with Claude Code's colon-namespace convention, port into Pi's flat, non-recursive `.pi/prompts/*.md` prompt-template format? The design work — a collision-free flattening convention, a 5-pattern argument-translation table, and a frontmatter-key disposition table — was already substantively drafted during the packet's initial scaffolding pass. This phase's job was closeout: re-verify every claim against the live repo tree instead of trusting the authoring-time snapshot, and record real evidence in place of the doc's own placeholder self-assessment.

### Flattening convention, re-verified live

`grep -rl "^argument-hint:" .opencode/commands --include="*.md" | wc -l` still returns 36 (out of 49 total `.md` files under `.opencode/commands/`), matching the authoring-time count exactly. I re-derived all 36 flattened `<group>-<name>.md` names directly from the live file list using the stated convention and diffed the result against `plan.md`'s worklist: zero drift, zero collisions (`sort -u | wc -l` returns 36).

### Translation table and frontmatter disposition

Unchanged from authoring: the 5-pattern `$ARGUMENTS` → `$1`/`$2`/`$@`/`${1:-default}` table and the frontmatter-key disposition table (`allowed-tools`, `argument-hint`, `skill`, `title`/`version`, `description`) needed no revision — they were derived from the commands' own frontmatter and argument-hint grammar, which has not changed since authoring.

### Files Changed

No repository files were changed by this phase. It is planning-only (Hard Constraints, packet-wide): no `.pi/prompts/*.md` file was created, and no `pi` command was run.

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Closed out phase 005: status, evidence, and the live re-derivation recorded; stale dependency-status rows refreshed (phases 001/003/004 are now Complete, not "Planned / not started") |
| `implementation-summary.md` | Created | This document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The flattening convention, translation table, and 36-row worklist were already drafted during the packet's initial authoring pass. This phase's own job was verification and closeout, not fresh design, so no LUNA dispatch was used: there is no code diff to implement, only a documentation set to re-verify against the live repo tree. I ran the re-derivation myself directly (`find`/`grep`/a shell one-liner applying the naming rule), confirmed zero drift, and updated the docs' stale dependency-status claims (several rows still said "Planned / not started" for phases that had since landed). No GLM-5.2 review dispatch either, for the same reason as phase 004: no code diff exists for an independent reviewer to check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Default translation rule: `$ARGUMENTS` → `$@` for every command except the few matching a single-positional or sub-action-enum pattern | Behavior-preserving — the router's own existing flag-parsing prose keeps working against the substituted string unchanged, avoiding the `${1:-default}` presence-vs-value ambiguity risk named in spec.md §6 |
| Drop `allowed-tools`, `skill`, `title`, `version` from the ported frontmatter; keep `description` defensively | None of the 4 dropped keys have a confirmed Pi frontmatter analog; `description` is harmless to keep even if Pi's loader ignores it, and confirming that tolerance is cheaper than guessing wrong in either direction |
| Re-derive the worklist live rather than trust the authoring-time snapshot at closeout | The repo tree can drift between authoring and execution; a stale, unverified worklist handed to phase 006 would silently carry forward any collision or count mismatch introduced since |
| Skip a GLM-5.2 review dispatch for this phase | Same reasoning as phase 004 — no code diff exists, only a documentation re-verification, so there is nothing for an independent code reviewer to check beyond what is recorded here |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `find .opencode/commands -name "*.md" \| wc -l` | PASS — 49, matches authoring-time count |
| `grep -rl "^argument-hint:" .opencode/commands --include="*.md" \| wc -l` | PASS — 36, matches authoring-time count, zero drift |
| Live re-derivation of all 36 flattened names vs. `plan.md`'s worklist | PASS — `sort -u \| wc -l` returns 36, zero collisions, exact match to the worklist |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No `.pi/prompts/*.md` file has actually been created, and no `pi` command has run against this design.** This phase is planning-only by its own Hard Constraints. A future execution pass must apply the worklist mechanically and live-test dispatch, deferred pending phase 001's provider-credential blocker clearing.
2. **The 14 Task-dependent ported commands (all 8 `deep/*`, `memory/save`, `prompt/improve`, all 4 `speckit/*`) will register as flattened `/name` prompts but stay functionally inert for subagent dispatch until phase 006 lands the third-party `pi-subagents` package.** This is a named, accepted sequencing gap, not an oversight.
3. **The persisted doctrine file's exact location under `cli-pi/references/` remains an open question** (spec.md §7) — `cli-pi/references/` itself now exists (phase 003 landed it), but the specific filename is not yet decided.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
