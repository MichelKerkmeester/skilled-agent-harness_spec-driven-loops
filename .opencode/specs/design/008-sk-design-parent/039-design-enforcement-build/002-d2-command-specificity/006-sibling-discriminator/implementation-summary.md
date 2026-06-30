---
title: "Implementation Summary: D2-R6 — Sibling discriminator + deferToHubWhen for /design:*"
description: "Every /design:* command now declares a per-pair sibling discriminator in the metadata SSOT, mirrored into a WHEN TO USE THIS, NOT A SIBLING wrapper section and reconciled against deferToHubWhen, next, and the registry workflowModes by the surface checker."
trigger_phrases:
  - "d2-r6 sibling discriminator implementation summary"
  - "design command discriminator delivered"
  - "deferToHubWhen sibling discriminator summary"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/006-sibling-discriminator"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level 2 impl doc for the sibling discriminator and surface-check gate"
    next_safe_action: "Run D2-R7 preconditions-and-failure-modes phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r6-sibling-discriminator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-sibling-discriminator |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each `/design:*` command now tells a caller, per sibling, when to pick it over the other four commands and when to defer to the `sk-design` hub. Before this phase the command layer carried no discriminator (`commands/design/interface.md:13`), so the choice between the five design commands and the deferral to the hub were both undocumented and unenforced. The discriminator is now a first-class, per-pair contract in the `command-metadata.json` SSOT, mirrored into each wrapper body and reconciled against the existing `deferToHubWhen` and `next` fields and the registry `workflowModes` by the surface checker.

### The discriminator per command

Every one of the five `command-metadata.json` records gained a `discriminator{whenToUse, preferSiblingWhen[]{sibling, when}, pairWithHubWhen, sequence{typicallyBefore, typicallyAfter}}` block. The defining invariant is that each record's `preferSiblingWhen` covers **exactly the other four** `/design:*` commands — never self, each sibling a registry `workflowMode` — so the full per-pair matrix is present and the hub binding is fixed:

| Command (`whenToUse`) | preferSiblingWhen set | `pairWithHubWhen` |
|---|---|---|
| `/design:audit` | foundations, interface, md-generator, motion | == `deferToHubWhen` |
| `/design:foundations` | audit, interface, md-generator, motion | == `deferToHubWhen` |
| `/design:interface` | audit, foundations, md-generator, motion | == `deferToHubWhen` |
| `/design:md-generator` | audit, foundations, interface, motion | == `deferToHubWhen` |
| `/design:motion` | audit, foundations, interface, md-generator | == `deferToHubWhen` |

`pairWithHubWhen` is byte-equal to each record's existing top-level `deferToHubWhen` (one authored source, copied once), and `sequence.typicallyBefore ⊆ next` so the ordering hint cannot point outside the declared successor set.

### The WHEN TO USE THIS, NOT A SIBLING wrapper sections

Each of the five wrappers gained an anchor-delimited `## WHEN TO USE THIS, NOT A SIBLING` body section (the `sibling-discriminator` anchor pair is the deterministic extraction handle the checker keys on). The section names its `whenToUse` line, one "Prefer `/design:<sibling>` when …" line per sibling (four total), and a "Defer to the `sk-design` hub when …" line. Wrapper frontmatter (`description`, `argument-hint`, `aliases`, `allowed-tools`) and the prior D2 `EMIT DELIVERABLE` / `EXAMPLE` sections were left untouched, so the earlier D2 parity holds.

### The surface-check extension

`design-command-surface-check.mjs` was extended additively. Stage 1 added `discriminator` to the required fields with sub-shape validation (non-empty-string `whenToUse` / `pairWithHubWhen`, non-empty `preferSiblingWhen[]` of `{sibling, when}`) plus reconciliation: `pairWithHubWhen === deferToHubWhen`, each `preferSiblingWhen[].sibling` a `/design:*` registry mode and never self, the sibling set equal to exactly the other four commands, and the sequence rule (`typicallyBefore ⊆ next`, no self-reference, every entry a real command). Stage 2 added a body-presence channel that extracts each wrapper's sibling-discriminator section and confirms all four sibling tokens plus a hub line are present; wording is not diffed and the channel folds into the single `drift` total under `kind=discriminator`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added `discriminator` block to all five records, preserving outputContract + examples + every prior field |
| `.opencode/commands/design/audit.md` | Modified | Appended WHEN TO USE THIS, NOT A SIBLING (four siblings + hub line) |
| `.opencode/commands/design/foundations.md` | Modified | Same projected section for `foundations` |
| `.opencode/commands/design/interface.md` | Modified | Same projected section for `interface` |
| `.opencode/commands/design/md-generator.md` | Modified | Same projected section for `md-generator` |
| `.opencode/commands/design/motion.md` | Modified | Same projected section for `motion` |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Additive Stage 1 shape + reconciliation, Stage 2 body-presence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) edited the seven scope-locked files; `mode-registry.json` was read-only and verified byte-unchanged. The orchestrator then verified acceptance independently. `node design-command-surface-check.mjs` returns `STATUS=PASS`, `invalid=0`, `drift=0` — the new discriminator shape, the reconciliation (`pairWithHubWhen == deferToHubWhen`, sibling set = the other four, `typicallyBefore ⊆ next`), the body-presence check across the five wrappers, and the prior frontmatter / outputContract / examples parity all pass. A synthetic break — a `preferSiblingWhen[0].sibling` set to the record's own command — flips the checker to `STATUS=INVALID` with `discriminator.preferSiblingWhen must cover exactly [the other four]` and `sibling must be one of [the registry modes]`; restoring returns `invalid=0 drift=0`, proving the gate bites. `command-metadata.json` is valid JSON, `node --check` on the checker exits 0, all prior D2 surfaces (outputContract + examples = 5, EMIT DELIVERABLE + EXAMPLE 5/5, allowed-tools 5/5) are preserved, and the evergreen grep is clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Required the sibling set to equal exactly the other four commands | Gives full per-pair "right sibling" coverage on the named targets without a sentence-by-sentence wording gate; a dropped, duplicated, or self sibling fails Stage 1 |
| Bound `pairWithHubWhen` byte-equal to `deferToHubWhen` | Keeps one authored hub-defer source; the discriminator copy cannot silently diverge from the routing field |
| Constrained `sequence.typicallyBefore ⊆ next` | The ordering hint can only point at declared successors, so the sequence and the routing graph stay consistent |
| Mirrored the discriminator into a wrapper body section, not frontmatter | Keeps the prior D2 frontmatter byte-stable while giving the wrapper a checkable, per-pair surface |
| Matched the body-presence check on sibling tokens + a hub line only | Avoids enforcing prose, so the check stays robust to editorial wording while proving the section is present and complete |
| Deferred literal router-replay fixtures to D3 | The named targets are not a gold-corpus harness; per-pair coverage is realized deterministically here, and the fixture follow-on is flagged for the D3 routing build |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS (STATUS=PASS, invalid=0, drift=0) |
| `node --check design-command-surface-check.mjs` | PASS (exit 0) |
| `command-metadata.json` valid JSON, five `discriminator` blocks | PASS |
| Synthetic break: `preferSiblingWhen[0].sibling` = own command | PASS (STATUS=INVALID, "must cover exactly [the other four]" + "sibling must be one of [the registry modes]"); reverted to invalid=0 drift=0 |
| `pairWithHubWhen === deferToHubWhen` per record | PASS (all five reconcile) |
| `preferSiblingWhen` = exactly the other four; siblings ∈ registry modes | PASS (all five records) |
| `sequence.typicallyBefore ⊆ next`, no self-reference | PASS (all five records) |
| WHEN TO USE THIS, NOT A SIBLING section present + 4 siblings + hub line in five wrappers | PASS (e.g. interface.md:17-26) |
| Prior D2 parity preserved (outputContract+examples=5, EMIT DELIVERABLE+EXAMPLE 5/5, allowed-tools 5/5, frontmatter drift=0) | PASS |
| `mode-registry.json` byte-unchanged | PASS (`git diff` empty) |
| Evergreen (no spec/packet/phase IDs in the seven files) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Discriminator wording is advisory.** The checker proves the lines exist and reconcile (sibling set, hub binding, sequence subset, body presence), never that they read well; the `whenToUse` / `preferSiblingWhen` phrasing can be tuned later without changing the gate.
2. **Per-pair router-replay is a flagged D3 follow-on.** This phase gates per-pair choice deterministically on the named targets (sibling-set-equals-other-four + hub binding). Literal router-replay fixtures over named-intent inputs belong to dimension D3 and its own phases, not these named targets.
3. **Generated metadata is regenerated downstream.** `description.json` and `graph-metadata.json` are owned by the generation step; `validate.sh --strict` reports the expected `GENERATED_METADATA` residual after this doc edit, and the orchestrator regenerates them rather than hand-editing.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Per-command discriminator{whenToUse,preferSiblingWhen,pairWithHubWhen,sequence} + WHEN TO USE THIS, NOT A SIBLING section + additive surface-check gate
- Surface-check PASS (invalid=0 drift=0); self-sibling synthetic break proves the gate bites; prior D2 parity preserved; mode-registry untouched
-->
