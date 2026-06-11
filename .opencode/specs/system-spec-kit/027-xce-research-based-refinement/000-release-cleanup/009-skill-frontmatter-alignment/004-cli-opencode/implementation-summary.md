---
title: "Implementation Summary: Phase 4: cli-opencode Frontmatter Alignment"
description: "All 9 cli-opencode reference/asset docs now conform to the canonical contract; first net-new authoring phase executed with the pilot recipe."
trigger_phrases:
  - "cli-opencode frontmatter summary"
  - "cli-opencode authoring complete"
  - "cli doc contract evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/004-cli-opencode"
    last_updated_at: "2026-06-11T09:38:23Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 9 docs conform and smoke passed"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-004-cli-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-cli-opencode |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

cli-opencode's 9 reference/asset docs now carry exactly the canonical frontmatter contract, turning the skill's doc corpus into valid routing signal for the advisor doc harvest. This was the campaign's first pure net-new authoring phase: where the pilot only normalized existing blocks, every cli-opencode doc started at title+description and needed its trigger phrases derived from a full body read.

### Frontmatter authoring

Each doc gained 4-7 distinctive lowercase trigger phrases, an importance tier, and a contextType. Phrases are prefixed with "opencode" where natural ("opencode self-invocation guard", "opencode run flags") so they route to this skill rather than the sibling cli-claude-code and cli-codex executors. Three docs earned tier `important` as formal dispatch-contract/invariant material: `cli_reference.md` (the pinned invocation contract), `integration_patterns.md` (owner of the hard `</dev/null` non-interactive rule and the ADR-001 self-invocation guard), and `destructive_scope_violations.md` (the RM-8 safety playbook whose layers are REQUIRED before deep-loop dispatch).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-opencode/references/agent_delegation.md` | Modified | Authored block; `normal` / `implementation` |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modified | Authored block; `important` / `implementation` |
| `.opencode/skills/cli-opencode/references/context-budget.md` | Modified | Authored block; `normal` / `general` (pointer mirror) |
| `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` | Modified | Authored block; `important` / `implementation` |
| `.opencode/skills/cli-opencode/references/integration_patterns.md` | Modified | Authored block; `important` / `implementation` |
| `.opencode/skills/cli-opencode/references/opencode_tools.md` | Modified | Authored block; `normal` / `general` (capability comparison) |
| `.opencode/skills/cli-opencode/references/permissions-matrix.md` | Modified | Authored block; `normal` / `implementation` |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modified | Authored block; `normal` / `planning` (prompt composition) |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modified | Authored block; `normal` / `implementation` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read-first frontmatter-only in-place edits anchored on each doc's existing description line, verified by the contract checker in coverage mode and a Python local-mode advisor smoke that needs no live daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Tier `important` for three docs, not just the hinted two | The phase brief named `cli_reference.md` and the non-TTY/hang rules doc (`integration_patterns.md` §6). `destructive_scope_violations.md` joined them because its prevention layers are marked REQUIRED before every deep-loop dispatch — that is invariant content, not narrative. `permissions-matrix.md` stayed `normal` as the borderline call: the enforcement contract lives in the TS gate; the doc is schema reference plus examples. |
| `contextType` spread instead of blanket `implementation` | `prompt_quality_card.md` guides pre-dispatch prompt composition (`planning`); `context-budget.md` and `opencode_tools.md` are a pointer mirror and a capability comparison (`general`); the operational references stay `implementation`. |
| Not `temporary` for the dated incident doc | `destructive_scope_violations.md` records a 2026-05-04 incident but is a standing prevention playbook with a read-before-dispatch contract, so the date does not make it scratch content. |
| "opencode"-prefixed phrases | Three sibling cli-* skills share dispatch vocabulary ("agent delegation", "prompt templates"); the prefix keeps doc signals distinctive per the campaign contract. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill cli-opencode --coverage` | PASS — `PASS mode=coverage scope=cli-opencode docs=9 carrying-detailed-block=9 violations=0` |
| Python local-mode smoke ("opencode self-invocation guard", flag on) | PASS — cli-opencode first at 0.95 with `!opencode self-invocation guard(signal)` in the match reason |
| Diff hygiene | PASS with caveat — this phase's hunks are leading-fence-only on all 9 files; `prompt_quality_card.md`, `prompt_templates.md`, and `cli_reference.md` also carry pre-existing uncommitted body hunks from the in-flight 028 branch session, not touched by this phase |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon adopts the doc-trigger flag only after a session cycle, so `matchedDocs` cannot be observed live per phase (tracked as packet 145 T025).
2. **REQ-002 evidence is hunk-scoped, not file-scoped.** Three of the nine files share the working tree with unrelated in-flight 028 branch edits, so "git diff shows only frontmatter hunks" holds for this phase's hunks, not for the whole-file diff.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
