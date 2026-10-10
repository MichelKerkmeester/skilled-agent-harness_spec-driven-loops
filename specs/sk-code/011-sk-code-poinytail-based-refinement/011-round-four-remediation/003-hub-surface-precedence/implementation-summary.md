---
title: "Implementation Summary"
description: "A prompt that names two sk-code surfaces now lists them in the documented detection precedence, so the Obsidian packet comes before the Webflow packet."
trigger_phrases:
  - "hub surface precedence implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence"
    last_updated_at: "2026-10-10T17:45:00Z"
    last_updated_by: "sonnet-verifier"
    recent_action: "Verified every criterion, no defects"
    next_safe_action: "Commit in folder order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hub-surface-precedence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-hub-surface-precedence |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A prompt that names two code surfaces now gets the packets in the hub's documented detection precedence, OpenCode then Obsidian then Webflow. Before this phase, `obsidian plugin webflow implementation` listed the Webflow packet first, even though an Obsidian plugin outranks Webflow everywhere else in the hub.

### Phase 3: hub-surface-precedence

The router keeps every mode within the ambiguity delta and sorts the kept set by `routerPolicy.tieBreak`. The hub list put Webflow ahead of OpenCode and Obsidian, so any two-surface tie came out in the wrong order. The list now reads quality, review, opencode, obsidian, webflow, which is the precedence in `shared/references/stack-detection.md` section 2. No shared router code changed, so the fix touches only this hub.

A new canary case pins the implementation phrasing beside the existing review-phrased case, and a sentence in the hub `SKILL.md` says why the list reads that way. The hub moves to release 2.2.6.0 with a changelog entry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/hub-router.json` | Modified | `tieBreak` reordered to opencode, obsidian, webflow and version 2.2.6.0 |
| `.skilled/skills/sk-code/mode-registry.json` | Modified | Version 2.2.6.0 |
| `.skilled/skills/sk-code/description.json` | Modified | Version 2.2.6.0 |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Version 2.2.6.0 and the one-sentence ordering rule |
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Version 2.2.6.0 |
| `.skilled/skills/sk-code/README.md` | Modified | Version 2.2.6.0 |
| `.skilled/skills/sk-code/changelog/v2.2.6.0.md` | Created | Hub release entry |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Case `surface-collision-obsidian-over-webflow-implementation` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Byte copy of the live fixture |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash built the twelve units one at a time from the dispatch file, and each unit's own check passed. The canary case went in first, then a negative control ran it against the unedited list and it failed (`cases 13 failures 1`), then the reorder made it pass. A Sonnet verifier then reran every task and goal criterion and read the full diff of the nine owned paths.

Four items are left to the orchestrator because they are shared generators or re-mints: the compiled sk-code manifest re-mint (T024), its archive copy (T025), the Hermes skill copy generator (T026) and the trigger-index rebuild (T027). Nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the hub data line, not shared router code | `.skilled/bin/lib/` serves seven hubs, and the dry run showed the data line alone fixes the order |
| Reorder every surface, not only swap Obsidian and Webflow | The documented precedence is one total order, and a partial swap would leave `webflow opencode` listing Webflow first |
| State the rule in `SKILL.md`, not in a new `hub-router.json` key | A new `routerPolicy` key is an unchecked schema change for the compiler and the doctor rules |
| Run the negative control before the reorder | It proves the new canary case can fail, so a pass means something |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal 1, `probe-route.cjs "obsidian plugin webflow implementation"` (exit 0) | PASS: `route orderedBundle sk-code-obsidian,sk-code-webflow`. Before the change it printed `sk-code-webflow,sk-code-obsidian` |
| Goal 2, `canary-assert.cjs` (exit 0) and `cmp` of the two fixture copies (exit 0) | PASS: `OK surface-collision-obsidian-over-webflow-implementation route orderedBundle sk-code-obsidian,sk-code-webflow`, `cases 13 failures 0`, `cmp` printed nothing. Negative control before the reorder: `cases 13 failures 1` |
| Goal 3, `all-canaries.cjs` filtered for FAIL lines | PASS: `001-sk-code cases 13 failures 0` (was 12), `all hubs failures 1` as at baseline, the filtered grep printed nothing (exit 1). The one failure is the baseline `004-cli-external-orchestration jev-transport-single` |
| Goal 4, six carriers at 2.2.6.0 and a valid changelog | PASS: `grep -l ... \| wc -l` printed 6, the changelog printed `VALID` and `Total issues: 0` with 0 voice hard blockers, `SKILL.md` kept 0 issues and 36 hard blockers |
| Goal 5, `compiled-route-guard.cjs` fresh and front door serving `sk-code-obsidian` | PASS after the orchestrator's re-mint (T024, T025): the guard prints `sk-code fresh` (exit 0) and the front door prints `"workflowMode":"sk-code-obsidian"`. Before it, the guard printed `sk-code stale-manifest` |
| Goal 6, `validate.sh --strict` on this folder | PASS: `RESULT: PASSED` |
| Surface pairs (T029) | PASS: `obsidian opencode` and `webflow opencode` list opencode first, `opencode webflow obsidian` lists `sk-code-opencode,sk-code-obsidian,sk-code-webflow`. Before the change three of the four listed Webflow ahead of a higher surface |
| Guards (T032) | `verify_router_sync` 5/5, `verify_doc_claims` 4/4, leaf manifest `OK (59ea33fd...)`, doctor 5e, 5i and 13c PASS. `parent-skill-check` exits FAIL on rule 13d for `sk-code-quality/SKILL.md` (claims 1.2.0.0, newest changelog v1.1.1.0), which is sibling child 004's build in progress, not this phase |
| Advisor battery (T033) | PASS: `positives 13/17 negatives-false-positive 2/5`, byte-identical to the baseline |
| Hermes copies, check form (T036) | `DRIFT sk-code` as expected before the generator runs, plus `sk-code-quality` and `sk-code-review` from sibling builds |
| Scope (T039) | PASS: nine lines, all in the Files to Change list |
| Review of the full diff | No defects. `fix-units.json` is `[]` |

**Orchestrator steps, 2026-10-10.** The Hermes generator wrote 6 of 70 copies, and `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`. The sk-code manifest was re-minted and copied over its archive copy (`cmp` exit 0), and `compiled-route-guard.cjs` prints `sk-code fresh` and `All hubs fresh or excused`. The trigger index was rebuilt, and its `--check` exits 0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The archived `compiled/route-gold.typed.json` is not updated.** Earlier rounds added canary cases without rebuilding it, and router-sync check 3 only reads its destinations.
2. **The `004-cli-external-orchestration jev-transport-single` canary still fails.** It failed at baseline and is not an sk-code file.
<!-- /ANCHOR:limitations -->

---
