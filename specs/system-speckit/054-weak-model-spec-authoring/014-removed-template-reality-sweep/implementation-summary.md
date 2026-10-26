---
title: "Implementation Summary"
description: "No doc, agent or comment still offers the three deleted add-ons, and every doc that states the add-on set, the validate cadence or the decision-record rule now matches the shipped code."
trigger_phrases:
  - "removed template reality sweep implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/014-removed-template-reality-sweep"
    last_updated_at: "2026-10-26T14:00:00Z"
    last_updated_by: "conductor"
    recent_action: "Fixed every stale mention and reality contradiction from both audits"
    next_safe_action: "Run strict validate, then commit on the worktree branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-014-removed-template-reality-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-recommend-level-quiet`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-removed-template-reality-sweep |
| **Completed** | 2026-10-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--quiet` prints one line. The default report is unchanged. WEAK: Implemented the feature. -->

No README, skill doc, agent or comment still offers the before-after, roadmap or resource-map add-on. Every doc that states the add-on set, the template total, the validate cadence or the decision-record rule now matches the code that ships in system-spec-kit 2.11.0.0.

### Phase 14: removed-template-reality-sweep

Two read-only audits came first. `scratch/audit-mentions.md` found 19 stale lines plus 3 nearby gaps. `scratch/audit-reality.md` found 12 contradictions: 9 caused by the 2.11.0.0 release and 3 older ones that called decision-record required at Level 3.

The fixes went out in five briefs. H1 fixed counts and lists: ten add-ons to seven, 16 passed to 24, 18 kinds to 15, the add-on table, the packet-types tree, the upgrade-legacy comment and the link-guard output. H2 made decision-record optional at Level 3 and fixed the templates tree. H3 fixed the validate cadence in `SKILL.md`, the orchestrate agent and its copies, and the card playbook. H4 fixed ten deep-loop "template" phrasings. H5 fixed the review findings.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`, `feature-catalog/tooling-and-scripts/template-section-fill-guidance.md` | Modified | Seven add-ons, 24 tests |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`, `references/structure/folder-structure.md`, `templates/README.md` | Modified | 15 template kinds, packet-types tree, add-on table |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md`, `tooling-and-scripts/markdown-link-integrity-guard.md` | Modified | Test counts and clean link-guard output |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modified | Comment line only |
| `.skilled/skills/system-spec-kit/references/templates/level-specifications.md`, `references/workflows/quick-reference.md`, `assets/level-decision-matrix.md` | Modified | Decision-record optional at Level 3; templates tree |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh` | Modified | Help text on the L2 to L3 upgrade |
| `.skilled/skills/system-spec-kit/SKILL.md` and its `.hermes` copy | Modified | Validate cadence |
| `.skilled/agents/orchestrate.md`, `.claude/agents/orchestrate.md`, `.codex/agents/orchestrate.toml`, `.pi/agents/orchestrate.md`, `.hermes/skills/agent-orchestrate/SKILL.md` | Modified | Validate once after the last doc write |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, `manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md` | Modified | Section 10 line and the playbook brief |
| `.skilled/skills/system-deep-loop/deep-research/` and `deep-review/` feature catalog and playbook files (6) | Modified | The loop map is a renderer layout, not a template |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--quiet` and the default form, then the suite. All three passed. WEAK: Tested and shipped. -->

The two audits ran first and were saved in `scratch/`. DeepSeek V4.1 Flash max made the fixes through cli-pi, one brief per batch, H1 to H5. The briefs are in `scratch/briefs/` and the reports in `scratch/runs/`. Every run exited 0. H3 also edited `.claude/agents/orchestrate.md`, an authored copy no sync script writes, because the agent mirror check failed until it matched.

A fresh Opus medium agent reviewed the diff in `scratch/review.md`. Its verdict was OK with notes, with 9 findings. H5 and the conductor fixed all nine. The conductor edited the card's section 10 checklist line and two rows in `assets/level-decision-matrix.md`. The final sweep and the guards then ran from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Flag over env var: callers already pass flags. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The /speckit workflows keep their per-step strict gate | It is the workflow's own checkpoint, separate from the card's authoring loop. Each gate carries a deliberate cadence comment, and changing workflow behavior is outside a doc sweep. `SKILL.md` line 61 now says the workflows also run their own strict gate after each doc-writing step |
| Edit `.claude/agents/orchestrate.md` by hand | It is an authored copy that no sync script writes, and the agent mirror check failed until it matched |
| Keep the deep loops' own resource map and its docs | That file still ships; only its "template" wording was wrong |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `--quiet` line count: 1. Default line count: 17. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Final mention and reality sweep over `.skilled .hermes .claude .codex .pi .opencode .devin .cursor README.md` | 10 hits, all judged fine: cli-opencode "TEMPLATE 5" text, `template-structure.js:206` "written add-ons", the `004-valid-level3` fixture prose, and `repo-era.vitest.ts:258`, which says no resource-map template ships |
| Opus medium review, `scratch/review.md` | OK with notes; 9 findings, all fixed |
| `check-markdown-links.cjs` | 0 broken |
| `sync-skills-hermes.cjs --check` | `PASS: 67` |
| `check-card-sync.sh` | `CARD SYNC OK` |
| `check-example-drift.sh` | `EXAMPLE_DRIFT_OK` |
| `check-agent-mirror-sync.cjs --all` | "11 agent(s) checked, all mirrors in sync, OK" |
| `bash -n upgrade-level.sh` | exit 0 |
| `ls templates/addons` | 7 files |
| `rg -n 'the addon' runtime/cli/tests/upgrade-legacy.vitest.ts` | no output, exit 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--quiet` does not hide stderr warnings. Redirect stderr when silence is required. WEAK: No limitations. -->

1. **The trigger index and retrieval fixtures still hold old phrases.** They are generated, so this phase left them alone. CI rebuilds them on push.
<!-- /ANCHOR:limitations -->

---
