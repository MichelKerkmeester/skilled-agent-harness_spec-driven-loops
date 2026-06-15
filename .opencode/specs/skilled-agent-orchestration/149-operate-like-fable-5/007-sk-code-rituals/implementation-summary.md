---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/007-sk-code-rituals"
    last_updated_at: "2026-06-15T14:06:39Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-sk-code-rituals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-sk-code-rituals |
| **Status** | PLANNED |
| **Completed** | Not yet - planning only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Pending implementation - see `plan.md` / `tasks.md`. This phase is PLANNED, not built. Target files: `.opencode/skills/sk-code/SKILL.md` (verification section: add the mutation-check / claim-falsifier ritual, the unit -> in-memory -> on-server -> live ladder with each rung's blind spot named, and the decision-economy + fail-closed-by-construction doctrine), and optionally `.opencode/skills/system-spec-kit/constitutional/decision-economy.md` and `.opencode/skills/system-spec-kit/constitutional/fail-closed-by-construction.md` (plus `.opencode/skills/system-spec-kit/constitutional/README.md`) if the owner promotes the doctrine to always-surfacing rules (OQ-1).

### Planned: Mutation-check / claim-falsifier ritual (rec B4)

Once built, the `sk-code` verification guidance will tell you to break the production code after a green run and confirm the test fails, so a green is treated as evidence only after it has bitten. It distinguishes true-RED (the assertion fails against correct intent) from compile-RED (the suite never compiled or ran), which is the cheapest place to kill the most expensive failure class: a green-but-vacuous test.

### Planned: Verification ladder with named blind spots (rec B5)

The guidance will add a unit -> in-memory -> on-server -> live ladder, naming what each rung leaves unproven, so you stop claiming "works" at the rung that never exercised the failing path.

### Planned: Decision-economy + fail-closed-by-construction doctrine (rec #11 / B5)

The guidance will replace bare `TODO`s with named seams that carry a closing condition, forbid dead controls, and prefer structural invariants over disciplinary reminders.

### Files Changed (planned)

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/SKILL.md` | Modify (planned) | Add the three verification rituals to the verification section without touching smart-router routing |
| `.opencode/skills/system-spec-kit/constitutional/decision-economy.md` | Create (planned, optional) | Standalone always-surfacing rule, only if OQ-1 promotes it |
| `.opencode/skills/system-spec-kit/constitutional/fail-closed-by-construction.md` | Create (planned, optional) | Standalone always-surfacing rule, only if OQ-1 promotes it |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Pending implementation. The planned rollout is additive and confined to one read surface, so it ships as a single reviewable diff with `git revert` as the rollback. Delivery will lean on grep assertions for the required ritual phrases, `git diff` confinement to prove the smart router did not regress, and the spec-folder validator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Land the rituals as advisory text in `sk-code`, not as enforced runtime code | The research classes B4/B5 as advisory and point-of-use; this is the cheapest high-leverage spot (6/6 convergence on mutation-check) and avoids the cost of structural enforcement that other phases own |
| Confine edits to the verification section only | Touching the smart router in the same file risks a routing regression across every stack, so we keep §2 byte-untouched and prove it with the diff |
| Keep generic ladder rung names with a one-line surface mapping | One ladder is easier to read than per-surface ladders; WEBFLOW's live rung maps to browser-console evidence, OPENCODE's to running suites (OQ-2) |
| Make the standalone constitutional rules optional, gated on OQ-1 | The doctrine earns always-surfacing status only if it needs to reach beyond code work; defaulting to `sk-code`-only keeps the constitutional set lean |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

Pending - gates defined in `checklist.md`; will run `validate.sh` and the relevant `vitest` suites.

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | PLANNED - will run at implementation |
| `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <snippet>` | PLANNED - will run on any added snippet |
| grep for required ritual phrases in `sk-code/SKILL.md` (REQ-001/002/004) | PLANNED |
| smart-router routing unchanged + relevant `vitest` suites | PLANNED - `git diff` confinement + `vitest` where the skill has runnable suites |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Advisory, not enforced.** These rituals live as text on a read surface, so they decay if not periodically re-read; structural enforcement (recs B1/B3/B6) is owned by other phases/packets and is out of scope here.
2. **Subagent reach.** The `sk-code` text is read when the skill is invoked; it does not auto-inject into subagent prompts (that channel is rec B3). Subagents see it only when they load the skill.
3. **Planned, not built.** Status is PLANNED; all checks above run at implementation time.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

