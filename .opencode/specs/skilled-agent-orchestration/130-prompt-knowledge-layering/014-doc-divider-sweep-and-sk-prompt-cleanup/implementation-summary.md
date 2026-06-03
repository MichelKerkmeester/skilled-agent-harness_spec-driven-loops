---
title: "Implementation Summary: doc-divider-sweep-and-sk-prompt-cleanup"
description: "Section dividers added across the 5 cli skills' reference/asset docs, and stale card references scrubbed from sk-prompt SKILL.md, verified deterministically and by an adversarial workflow."
trigger_phrases:
  - "divider sweep summary"
  - "sk-prompt card scrub summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/014-doc-divider-sweep-and-sk-prompt-cleanup"
    last_updated_at: "2026-06-03T12:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Dividers applied + verified; sk-prompt scrubbed; changelogs written"
    next_safe_action: "Commit phase 014 (file-precise, exclude 3 entangled + WIP)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/cli-opencode/references/agent_delegation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
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
| **Spec Folder** | 014-doc-divider-sweep-and-sk-prompt-cleanup |
| **Completed** | 2026-06-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli skill docs now match the sk-doc templates' section-divider rule, and `sk-prompt/SKILL.md`
no longer points at a card that moved skills two phases ago. Both were drift that made the docs
read worse and, in the sk-prompt case, left a broken link in the skill body.

### Section dividers across the cli docs

You can now read any cli reference or asset doc with clean `---` breaks between its numbered
sections, the way the sk-doc reference and asset templates prescribe. 22 docs across the 5 cli
skills were missing one or more dividers (188 between-section gaps), and a handful of reference docs
were also missing the leading divider before section 1. The sweep added the missing dividers and
nothing else.

### sk-prompt card references removed

`sk-prompt/SKILL.md` is link-clean again. The phase-013 relocation moved
`cli_prompt_quality_card.md` to the model-craft hub but left four references behind: a prose
mention, a Core-References link that now 404s, a whole FAST-PATH ASSET section, and a resource-list
entry. All four are gone, the following sections renumbered, and the router pseudocode (which was
already correct) was left untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 22 `cli-*/{references,assets}/*.md` | Modified | Added missing section dividers (blank/`---` only) |
| 5 `cli-*/SKILL.md` | Modified | Version bumps |
| 5 `cli-*/changelog/v*.md` | Created | Per-skill divider-sweep changelogs |
| `sk-prompt/SKILL.md` | Modified | Scrubbed 4 stale card refs; renumbered §8/§9; version 2.1.1.0 |
| `sk-prompt/changelog/v2.1.1.0.md` | Created | Card-reference scrub changelog |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fence-aware deterministic Python fixer inserted the dividers after a dry-run audit of all 188
insertion points. A content-skeleton diff (strip blank and `---` lines, then diff against HEAD)
proved no content line changed. An adversarial 5-agent workflow audited divider placement, caught a
real blind spot in the first scout (two H2s in `agent_delegation.md` whose only nearby `---` sat
mid-content), the fixer was tightened to require the divider immediately before each heading, and a
corrected 5-agent workflow then confirmed PASS on all 5 skills.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deterministic fixer plus adversarial workflow, not agents editing files | A pure `---` insertion is safest done by a fence-aware script. The workflow earns its place as independent verification, and it found a real bug. |
| Only add dividers, never remove or relocate | The complaint was missing dividers. Pre-existing extra dividers (asset leading `---`, an in-body `---` in agent_delegation.md) stay untouched and are reported, not changed. |
| Defer 3 entangled reference docs | `cli-devin/cli_reference.md`, `cli-devin/quota-fallback.md` and `cli-opencode/cli_reference.md` carried unrelated uncommitted content edits. Bundling them would mix scopes. |
| Per-doc-type leading divider | Reference docs carry a `---` before section 1, asset docs do not. The two sk-doc templates differ here, so the rule is applied per type. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict divider re-scout (5 cli skills) | PASS, +0 dividers needed |
| Content-skeleton diff vs HEAD | PASS, byte-identical on every non-blank, non-divider line for the 22 swept files |
| Adversarial divider workflow (corrected rule) | PASS, all 5 skills, checker_all_zero true |
| sk-prompt card-reference grep | PASS, 0 refs in SKILL.md, sections renumber 1-9 |
| `validate.sh --recursive --strict` (130 parent) | PASS, 0 errors 0 warnings |
| card-sync guard | PASS, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **3 reference docs deferred.** `cli-devin/references/cli_reference.md`, `cli-devin/references/quota-fallback.md` and `cli-opencode/references/cli_reference.md` keep their dividers in the working tree but are not committed here, pending owner review of the unrelated content edits they carry.
2. **6 asset docs have an extra leading `---`.** `prompt_templates.md` in all 5 skills and `cli-devin/assets/deep-loop-iter-template.md` carry a `---` before section 1 that the asset template omits. This sweep only adds missing dividers, so these are reported for optional cleanup, not changed.
3. **sk-prompt manual-testing-playbook** still has dangling paths to the moved card. Reported as a follow-up, outside this phase's scope.
<!-- /ANCHOR:limitations -->
