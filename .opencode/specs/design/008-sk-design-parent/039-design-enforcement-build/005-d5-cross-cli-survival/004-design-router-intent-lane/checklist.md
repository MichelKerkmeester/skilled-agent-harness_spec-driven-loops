---
title: "Verification Checklist: DESIGN router intent lane in all 3 CLI dictionaries"
description: "Priority-classified verification checklist for the additive DESIGN intent lane (INTENT_SIGNALS-only) across the three cli-* provider dictionaries, covering reconciliation with the hub-router vocabulary, signal presence, the no-RESOURCE_MAP guard-safe resolution, parity, fix-completeness, and the no-regression contract (existing routes unchanged, GLM WIP unchanged, hubRoute 13/5/0)."
trigger_phrases:
  - "design router intent lane checklist"
  - "DESIGN lane verification"
  - "cross-cli design routing checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/004-design-router-intent-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all P0/P1/P2 checks; recompute counts; set date 2026-06-29"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r4-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: DESIGN router intent lane in all 3 CLI dictionaries

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Source of truth read; research item located
  - **Evidence**: phase `spec.md` + `research.md` §8 (D5-R4 row) read before authoring
- [x] CHK-002 [P0] Exact target confirmed = cli-* provider dictionaries (`INTENT_SIGNALS`)
  - **Evidence**: `INTENT_SIGNALS` in cli-codex/cli-claude-code/cli-opencode SKILL.md; NOT `hub-router.json`, NOT `router-replay.cjs`
- [x] CHK-003 [P1] Precondition resolved: no `RESOURCE_MAP` target (INTENT_SIGNALS-only)
  - **Evidence**: the router same-skill guard rejects cross-skill paths and non-`.md`, and no skill-local design `.md` exists; resolution recorded in spec RISKS + plan §6
- [x] CHK-004 [P1] Baseline captured before any edit
  - **Evidence**: existing intents/resources per dictionary, hubRoute 13/5/0

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `DESIGN` added to `INTENT_SIGNALS` (weight 4) in all three cli-*
  - **Evidence**: one new `DESIGN` key per dictionary — cli-codex line 112, cli-claude-code line 113, cli-opencode line 127; `weight: 4` each
- [x] CHK-011 [P0] No `DESIGN` key in any `RESOURCE_MAP` (guard-safe)
  - **Evidence**: `RESOURCE_MAP` unchanged in all three; the apparent `RESOURCE_MAP[DESIGN]=1` was a grep false-match on the explanatory WHY comment, not a real entry; no cross-skill `sk-design/...` path
- [x] CHK-012 [P1] Every `DESIGN` keyword traces to a hub-router vocabulary alias or hub-identity token
  - **Evidence**: each keyword (sk-design, interface/frontend/visual design, foundations, tokens, motion, micro-interactions, audit, ui critique, extract design system, generate design.md) maps to a hub vocabulary alias or hub-identity token; no net-new design vocabulary
- [x] CHK-013 [P1] Lane composes with the always-fires D5-R1 Design Standards Loading rule
  - **Evidence**: a WHY comment in each cli-* states "DESIGN is an intent signal only; the durable sk-design loading contract lives in the always-fires Design Standards Loading rule + the dispatch manifest"; no contradictory load instruction
- [x] CHK-014 [P1] Keyword sets parallel/identical across the three siblings
  - **Evidence**: cross-sibling diff of the `DESIGN` keyword set is empty (byte-identical)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Static read: design intent is a recognized weighted `INTENT_SIGNALS` signal in all three cli-*
  - **Evidence**: `grep -c` for the `DESIGN` `INTENT_SIGNALS` key returns 1 in each cli-* with `weight: 4`
- [x] CHK-021 [P0] No `RESOURCE_MAP["DESIGN"]` target (no dangling cross-skill load)
  - **Evidence**: design resource is reached via the D5-R1 ALWAYS rule + the D5-R3 dispatch manifest, not a `RESOURCE_MAP` target; `RESOURCE_MAP` has no `DESIGN` key
- [x] CHK-022 [P1] Negative control: existing-route prompts still select their prior intents
  - **Evidence**: existing routes byte-identical; the `DESIGN` keywords are design-specific and weight-equal, so no false `DESIGN` selection on existing-route prompts
- [x] CHK-023 [P1] Parity holds across all three siblings
  - **Evidence**: the lane is present in every sibling with an identical keyword set; a single-sibling configuration would fail parity

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All `spec.md` acceptance criteria met
  - **Evidence**: SC-001 (weighted `DESIGN` key, no `RESOURCE_MAP` key, hub-traceable keywords) + SC-002 (existing routes + GLM WIP byte-identical, hubRoute 13/5/0) verified
- [x] CHK-031 [P1] No partial implementation
  - **Evidence**: lane present in all three siblings (not a subset); INTENT_SIGNALS updated in each
- [x] CHK-032 [P1] Precondition resolved, not silently worked around
  - **Evidence**: no silent cross-skill `RESOURCE_MAP` fallback; the INTENT_SIGNALS-only resolution is recorded as a sanctioned deviation in spec RISKS + plan §6

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Existing routes byte-identical to baseline
  - **Evidence**: the prior intents/resources unchanged in all three cli-*; only the `DESIGN` key was added
- [x] CHK-041 [P0] Concurrent GLM WIP byte-identical
  - **Evidence**: the GLM-5.2 WIP in `cli-opencode/SKILL.md` is byte-identical before/after; codex touched only the `DESIGN` key
- [x] CHK-042 [P0] hubRoute scorer stays 13 pass / 5 known-gap / 0 regression
  - **Evidence**: sk-design `hubRoute` scorer re-run unchanged; a cli-* `INTENT_SIGNALS` change does not touch the sk-design hub corpus
- [x] CHK-043 [P1] Additive-only scope honored
  - **Evidence**: no edits to `hub-router.json`, `router-replay.cjs`, or `cli_reference.md`; only `DESIGN` `INTENT_SIGNALS` keys added (3 files)

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks/implementation-summary synchronized
  - **Evidence**: all docs reflect the final INTENT_SIGNALS-only lane, the no-`RESOURCE_MAP` resolution, and the verification results
- [x] CHK-051 [P1] Evergreen: lane carries no ephemeral IDs/paths
  - **Evidence**: diff scan finds no spec/packet/phase/finding IDs and no `specs/` paths in the lane or the WHY comment

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Temp files in scratch/ only
  - **Evidence**: no temp files created outside scratch/
- [x] CHK-061 [P2] scratch/ cleaned before completion
  - **Evidence**: no scratch artifacts created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (orchestrator-confirmed grep evidence)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Fix-completeness section guards against partial / single-sibling implementation
Status complete: all items verified with build-time evidence (static grep)
-->
</content>
