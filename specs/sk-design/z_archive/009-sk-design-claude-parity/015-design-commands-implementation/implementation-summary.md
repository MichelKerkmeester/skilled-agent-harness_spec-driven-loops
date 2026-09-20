---
title: "Implementation Summary"
description: "All five /design:* commands are now thin routers with owned auto/confirm/presentation assets, executing Phase 013's plan with explicit procedure-card triggers instead of a black-box 'apply the mode' step."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 015 implementation summary"
  - "design commands implementation summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/015-design-commands-implementation"
    last_updated_at: "2026-07-06T20:25:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all 30 tasks and 25 checklist items done"
    next_safe_action: "Run validate.sh --strict for final confirmation, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/commands/design/interface.md"
      - ".opencode/commands/design/assets/design_interface_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-commands-impl-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-design-commands-implementation |
| **Completed** | 2026-07-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All five `/design:*` commands (`interface`, `foundations`, `motion`, `audit`, `md-generator`) are no longer flat, single-file commands. Each is now a thin router plus three owned assets — the same router+assets pattern `speckit`, `create`, and `deep` already use — executing the plan Phase 013 designed but never built. More importantly, each command's workflow now names the actual procedure the mode will run, instead of a black-box "apply the mode and see what happens" step.

### Thin Routers

Each `.opencode/commands/design/<mode>.md` now has exactly six sections — Router Contract, Owned Assets, Mode Routing, Execution Targets, Presentation Boundary, Workflow Summary — plus the mode-specific routing content (task lanes, sibling-discriminator table, precondition gate conditions, register dial names) carried over unchanged. No router contains a startup prompt, a dashboard template, or a result template; those live only in the presentation asset.

### `:auto` / `:confirm` Interaction Parity

Every mode now supports `:auto` and `:confirm` suffixes under one shared rule: if `$ARGUMENTS` already supplies the mode's required input, no suffix runs autonomously with zero prompts (exactly like today); if input is missing, no suffix falls back to a single consolidated setup prompt instead of the old scattered per-precondition Ask-first sequence. Explicit `:auto` always resolves via the presentation asset's Auto Resolution Table or fails fast; explicit `:confirm` always shows the prompt once, even on a fully-specified invocation.

### Procedure-Card-Aware Workflows (the actual fix)

The first pass at this phase built workflow YAML that just said "load the mode's SKILL.md and follow it" — accurate, but it hid the one thing worth seeing: which procedure actually runs. Every mode's `SKILL.md` already documents a "Procedure Card Selection" trigger table (request shape -> private procedure card), the exact same skill-triggering model the external Claude Design reference uses ("invoke `frontend-aesthetic-direction` when no brand exists," etc.) — `design-interface`'s cards trace back 1:1 to the external skill set (`discovery_question_round.md` from `discovery-questions.md`, `aesthetic_direction.md` from `frontend-aesthetic-direction.md`, and so on across all 14). The command's workflow YAML now inlines each mode's actual trigger table and names its real core workflow (interface's Two-Pass Process, foundations' Static-System Workflow, motion's Motion Design Workflow, audit's 5-dimension Audit Workflow, md-generator's EXTRACT/WRITE/VALIDATE/REPORT pipeline) instead of treating "apply the mode" as an opaque box.

### md-generator's Real Backend

`md-generator` is the one mutating mode, and its workflow YAML now names the actual TypeScript entrypoints (`extract.ts`, `build-write-prompt.ts`, `validate.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts`) and its existing `guided-run.ts` orchestrator — the same backend fixed for 8 P1 security/correctness defects in the prior review-remediation phase (014) — rather than a generic "apply the mode" placeholder.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/design/interface.md` | Rewritten | Thin router |
| `.opencode/commands/design/foundations.md` | Rewritten | Thin router |
| `.opencode/commands/design/motion.md` | Rewritten | Thin router |
| `.opencode/commands/design/audit.md` | Rewritten | Thin router |
| `.opencode/commands/design/md-generator.md` | Rewritten | Thin router (Write/Edit/Bash tool surface unchanged) |
| `.opencode/commands/design/assets/design_<mode>_auto.yaml` (x5) | Created | Autonomous workflow, procedure-card trigger table inlined |
| `.opencode/commands/design/assets/design_<mode>_confirm.yaml` (x5) | Created | Interactive workflow, same trigger table |
| `.opencode/commands/design/assets/design_<mode>_presentation.txt` (x5) | Created | Consolidated prompt, auto-resolution table, STATUS templates, next-step suggestions |
| `../013-design-commands-asset-refactor/implementation-summary.md` | Updated | Cross-referenced to this phase as the executed implementation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`interface` was built first as the reference shape (it has the most procedure cards and the only task-lane menu), then the same shape was adapted for the other four modes. Partway through, a user correction caught that the first version's workflow YAML was too shallow — it said "apply the mode" without naming what that actually triggers. Rather than leaving `foundations` and `motion` in the shallow shape while building `audit` and `md-generator` richer, all three already-built modes were revised in place to add the same explicit procedure-card-trigger step before moving on, so all five modes ended up structurally identical. Verification was a targeted structural diff (via `git show HEAD:<original>` against the combined router+assets) confirming every sibling-discriminator bullet, deliverable field, handoff target, register dial, task-projection verb, and example usage survived the split, plus a YAML syntax check on all 10 workflow files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build `interface` first, then adapt its shape to the other four | It has the most procedure cards (6) and the only task-lane menu, so its shape generalizes downward cleanly |
| Name each mode's actual procedure-card trigger table in the workflow YAML, not just "follow the mode's SKILL.md" | A user correction identified that the initial shallow version hid the one thing worth seeing — which procedure actually fires. The mode packets already document this table; the command layer's job is to surface it, not duplicate the deeper procedural content that already lives one layer down |
| Keep workflow YAML proportional to what a single-mode command needs, not `speckit:plan`'s multi-step scale | `speckit:plan`'s ~760-line workflow YAML is calibrated for spec-kit's own gated planning process; the design commands delegate their real depth to the mode packets' own SKILL.md + procedure cards, so the command's job is orchestration, not re-implementation |
| Downgrade this phase folder from Level 3 to Level 2 partway through | The content is execution of an already-decided plan (Phase 013 made the ADR-level calls); it has no new architecture decisions of its own, so the Level 3 template's decision-record/AI-protocol/governance requirements didn't fit and `validate.sh --strict` correctly flagged the mismatch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Structural diff (sibling-discriminator bullets, deliverable fields, NEXT_OPTIONS, Cannot-run/Escalate/Route-instead conditions, register dials, task-projection verbs, EXAMPLE usage) across all 5 modes | PASS, every item traced from `git show HEAD:<original>` to the new router+assets |
| Frontmatter diff (`description`/`argument-hint`/`allowed-tools`) | PASS, `description`/`allowed-tools` identical; `argument-hint` extended as a strict superset |
| YAML syntax check on all 10 workflow files (`python3 -c "import yaml; yaml.safe_load(...)"`) | PASS, 0 parse errors |
| `git status` boundary check | PASS, only `.opencode/commands/design/**` touched by this phase; `sk-design`/`sk-doc` dirty state is pre-existing concurrent-session activity, not from this phase |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | PASS after downgrading the folder to Level 2 (see Key Decisions) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This phase did not re-verify Phase 013's own ADR-001/ADR-002 content against the live mode SKILL.md files beyond the Procedure Card Selection tables.** The auto/confirm default rule and consolidated-prompt design were taken from Phase 013's already-accepted decision record; this phase executed them, it did not re-derive them.
2. **No live invocation test.** The router+assets split was verified structurally (content preserved, YAML parses, sections present) but no `/design:<mode>` invocation was actually run end-to-end in this session to confirm runtime behavior matches the documented contract.
3. **`description.json`/`graph-metadata.json` for this phase folder were generated via the scoped single-folder backfill scripts, not the full memory-save workflow** — consistent with how Phase 014 handled the same requirement.
<!-- /ANCHOR:limitations -->
