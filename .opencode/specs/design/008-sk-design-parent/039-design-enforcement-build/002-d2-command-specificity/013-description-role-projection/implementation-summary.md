---
title: "Implementation Summary: D2-R13 — Description role projection (hub-keyword, not auto-trigger)"
description: "Every command-metadata.json record now carries descriptionRole (hub-keyword-projection), autoTriggerEligible:false (strict boolean), and a grounded hubKeywordProjection of its description; each description is held to the grammar <role/output clause>. sk-design <ownerMode> mode.; the five wrapper frontmatter descriptions stay in lockstep so the frontmatter↔metadata drift channel is 0; and design-command-surface-check.mjs gained five Stage-1 rules enforcing the role token, strict-false, grounded projection, and the grammar suffix — final D2 phase, STATUS=PASS invalid=0 drift=0."
trigger_phrases:
  - "d2-r13 description role summary"
  - "design description hub-keyword projection summary"
  - "auto-trigger eligible false command summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/013-description-role-projection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added 3 role fields + grammar + lockstep parity; checker PASS invalid=0 drift=0; 7 files"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r13-description-role-projection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Descriptions are a hub-keyword projection (autoTriggerEligible:false), not a per-command auto-trigger"
      - "The grammar suffix sk-design <ownerMode> mode. binds every description back to the parent + mode"
      - "The four routing lanes are realized deterministically on the named targets; a live NL replay corpus is D3"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-description-role-projection |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Enforcement class** | hybrid (metadata SSOT + deterministic surface gate) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A command `description` used to be treated as if it were auto-trigger text for that one command, even though natural-language prompts collapse to the `sk-design` hub instead of auto-selecting a `/design:*` command. Nothing declared what a description was *for*. Now every description has a declared, machine-enforced role: it is a hub-keyword projection, never a per-command auto-trigger, and its grammar binds it back to the parent skill and its mode. This is the final D2 phase — the design command surface now declares and machine-enforces the full reconciled field set per command. This is a deterministic command-surface contract, not a taste claim.

### Three role-projection fields on every command record

`command-metadata.json` gained three fields on all five records. `descriptionRole` is the fixed-vocabulary token `"hub-keyword-projection"` — the description is a keyword surface the hub routes on, not a per-command auto-trigger. `autoTriggerEligible` is the strict boolean `false`, encoding "natural language collapses to the hub, the command is not auto-triggered." `hubKeywordProjection` is a non-empty array of the description keywords the hub projects to select a mode, and every token is a literal substring of that record's own `description`, so the projection is grounded in real description text, never invented. Every prior D2 field on each record is preserved.

### The description grammar, formalized and held in lockstep

Each `description` was tightened to one grammar: `<succinct role/output clause>. sk-design <ownerMode> mode.` The leading clause is the keyword surface `hubKeywordProjection` draws from; the trailing `sk-design <ownerMode> mode.` suffix binds the description back to the parent skill and the record's own `ownerMode`, so any generated or pinned description resolves to the parent plus its mode. Because the `description` already lives in both the wrapper frontmatter and the metadata, each tightening was applied to **both** surfaces in lockstep, keeping the existing frontmatter↔metadata `description` drift channel at `0`.

### Extended gate in `design-command-surface-check.mjs`

The checker was extended additively with five Stage-1 rules: `descriptionRole` is a non-empty string in the role allow-set; `autoTriggerEligible` is strictly the boolean `false`; `hubKeywordProjection` is a non-empty string array; every `hubKeywordProjection` token is a case-insensitive substring of the record's `description` (grounding); and each `description` ends with `sk-design ${ownerMode} mode.` (grammar suffix). The existing `description` frontmatter↔metadata drift check is preserved unchanged, so the three metadata-only fields add no new drift channel.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added `descriptionRole` + `autoTriggerEligible: false` + grounded `hubKeywordProjection` to all five records; tightened each `description` to the grammar; preserved every prior field |
| `.opencode/commands/design/audit.md` | Modified | Updated frontmatter `description` in lockstep with metadata (drift=0); everything else preserved |
| `.opencode/commands/design/foundations.md` | Modified | Updated frontmatter `description` in lockstep with metadata; everything else preserved |
| `.opencode/commands/design/interface.md` | Modified | Updated frontmatter `description` in lockstep with metadata; everything else preserved |
| `.opencode/commands/design/md-generator.md` | Modified | Updated frontmatter `description` in lockstep with metadata; everything else preserved |
| `.opencode/commands/design/motion.md` | Modified | Updated frontmatter `description` in lockstep with metadata; everything else preserved |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Added five additive Stage-1 rules (role token, strict-false, grounded projection, grammar suffix); preserved the existing description frontmatter↔metadata drift check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran SSOT-first: the three role fields and the grammar-tightened descriptions landed in `command-metadata.json` before the checker rules, and each description change was mirrored into its wrapper frontmatter in the same pass so the existing parity gate never tripped. The three new fields were kept metadata-only by contract — they are never projected into frontmatter, so they add no new drift channel — and `autoTriggerEligible` was pinned strictly `false` so the "NL collapses to the hub" finding is gated, not merely documented.

The implementer (cli-codex gpt-5.5 xhigh fast) edited exactly seven scope-locked files and the orchestrator verified acceptance independently. `node design-command-surface-check.mjs` returns `STATUS=PASS invalid=0 drift=0` (exit 0) with the three new fields and the description parity all green, and the descriptions end with `sk-design <mode> mode.` 5/5. The gate was confirmed to bite with a synthetic break — flipping one record's `autoTriggerEligible` to `true` flips the checker to `STATUS=INVALID` "autoTriggerEligible must be the boolean false" (`invalid=1`) — and restoring returns it to `invalid=0 drift=0`. `command-metadata.json` parses as valid JSON, `node --check` passes on the checker, and the prior D2 channels stay clean (description parity preserved, no regression). Every change is additive; scope held to exactly seven files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Project each command's role into one description grammar | The leading clause is the hub-keyword surface and the suffix binds to the parent skill + mode; one grammar keeps the descriptions legible and makes the role machine-checkable instead of implied |
| Pin `autoTriggerEligible` to a strict boolean `false` and gate it | A description does not auto-select its command; NL collapses to the hub. Enforcing strict `false` keeps that promise machine-checked, so no record can ship `autoTriggerEligible:true` past the gate |
| Ground `hubKeywordProjection` in the real description | Every keyword the hub routes on must already be in the description; the substring rule rejects invented routing keywords at the source |
| Keep the three fields metadata-only | Projecting any of them into frontmatter would add a new drift channel; keeping them metadata-only leaves the existing `description` parity as the single description drift channel |
| Tighten descriptions on both surfaces in lockstep | The `description` lives in both the frontmatter and the metadata; editing one alone would trip the prior D2 drift gate, so each tightening was applied to both, drift stays 0 |
| Realize the spec's "4-lane replay" deterministically on the named targets | The named targets are not a router-replay harness; the four lanes map to autoTriggerEligible / hubKeywordProjection / ownerMode→workflowMode / grammar suffix, and a live NL replay corpus is flagged as D3 follow-on |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS `STATUS=PASS invalid=0 drift=0` (exit 0); the three new fields + description parity green |
| Role fields present | all 5 records carry `descriptionRole`, `autoTriggerEligible`, `hubKeywordProjection` (records=5) |
| Fixed vocabulary + strict boolean | every `descriptionRole` is `"hub-keyword-projection"`; every `autoTriggerEligible` is the boolean `false` (typeof boolean) |
| Grounding | every `hubKeywordProjection` token is a case-insensitive substring of its record's `description` |
| Grammar suffix | every `description` ends with `sk-design <ownerMode> mode.` (5/5, ownerMode-matched) |
| No-regression (description parity) | frontmatter `description` == metadata `description`; `description` drift channel stays 0 |
| Prior D2 channels | argument-hint / allowed-tools / discriminator / preconditions / example / emit-deliverable / taskProjections stay `drift=0` |
| Synthetic break (orchestrator-verified) | `autoTriggerEligible` flipped to `true` → `STATUS=INVALID` "autoTriggerEligible must be the boolean false" (`invalid=1`); restore → `invalid=0 drift=0` |
| `node --check` on checker | PASS (valid ESM) |
| `command-metadata.json` JSON parse | PASS (5 records) |
| Non-mutation | `mode-registry.json` byte-unchanged; evergreen clean |
| Scope | exactly 7 files changed (metadata, 5 wrappers, checker) |

### Test Coverage Summary

| Surface | Channel | Status |
|---------|---------|--------|
| `descriptionRole` role token + `autoTriggerEligible` strict-false | Stage 1 rules 1–2 | PASS |
| `hubKeywordProjection` shape + grounding | Stage 1 rules 3–4 | PASS |
| `description` grammar suffix (`sk-design <ownerMode> mode.`) | Stage 1 rule 5 | PASS |
| Frontmatter↔metadata description parity (no new drift channel) | existing drift check | PASS, intact |
| Prior D2 (argumentHint/SSOT/examples/contract/discriminator/preconditions/taskProjections) | full run | PASS, intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Residual generated-metadata errors are expected.** Strict `validate.sh` reports `GENERATED_METADATA_INTEGRITY` violations because `description.json` still records `level "1"` and the stored `graph-metadata.json` source fingerprint predates this Level 2 upgrade; the orchestrator regenerates `description.json` and `graph-metadata.json` via `generate-context.js`. They are not hand-written here.
2. **The role is enforced for shape, not for routing taste.** The checker proves each description is grounded, carries the role token, is not auto-trigger-eligible, and ends with the grammar suffix. It does not judge whether a given `hubKeywordProjection` is the semantically ideal keyword set; the keywords are grounded substrings of authored descriptions, a deterministic command-surface contract, not a design-taste claim.
3. **The "4-lane replay" is realized deterministically, not as a live NL corpus.** The four lanes are mapped onto the named targets (`autoTriggerEligible`, `hubKeywordProjection`, `ownerMode→workflowMode`, grammar suffix). A live natural-language routing-replay / gold-corpus harness is separate D3 work.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Post-implementation: descriptionRole + autoTriggerEligible:false + hubKeywordProjection (metadata-only) + description grammar (<role/output clause>. sk-design <ownerMode> mode.) + five Stage-1 checker rules; frontmatter description parity stays 0
- Strictly additive; mode-registry untouched; all prior D2 additions preserved; final surface-check invalid=0 drift=0
- Final D2 phase: the design command surface declares + machine-enforces the full reconciled per-command field set
-->
