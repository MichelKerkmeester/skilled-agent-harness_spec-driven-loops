---
title: "Changelog: Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm [054-weak-model-spec-authoring/root]"
description: "Chronological changelog for the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm spec root."
trigger_phrases:
  - "weak model spec authoring changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring` (a phased packet whose phases are Level 1 to 3)

### Summary

A weak model can now author a filled spec packet from the system-spec-kit templates: an unfilled value token fails strict validation after Draft, every core section says how to fill it, a short card is the first read, and the examples no longer teach the old defects. The packet measured the result on a frozen Level 3 task with three runs per set. Leftover hints fell and every run passed strict validation. Parent criterion 5 failed on the first three final sets, when runs deleted optional or required `tasks.md` sections, and passed on the fourth set after the `tasks.md` fill notes were corrected.

Later phases built on that result. A deep review fixed the gaps it found, and a speed study ranked where authoring and upkeep time goes and shipped the safe changes. Three unused add-on templates were removed and the docs swept for stale mentions. The worked examples now use one neutral feature, the scaffold lost the sample rows that models kept as filler, and the spec template gained a Measured Behavior block. A strict validate on a Draft packet now repairs derived metadata itself. The benchmark was redesigned and rerun on fair terms: packets from the 054 tree beat the tree before it on the blind total in all 8 rounds, and the only REAL speed result is the upkeep output-token saving. Two follow-up fixes closed the two follow-ups the closeout named.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-template-drift-census-and-baseline` | Complete | Verified defect ledger and the first authoring baseline |
| `002-template-and-example-defect-repair` | Complete | Example descriptions, checklist and style guide repaired by exact text swaps |
| `003-versioned-placeholder-gate` | Complete | Unfilled value tokens fail after Draft for v2.3 docs only |
| `004-template-section-fill-guidance` | Complete | A fill line with a good and a weak example in every section, and the example drift guard |
| `005-weak-model-authoring-card` | Complete | The authoring card, the router change and the card sync guard |
| `006-speckit-command-and-agent-alignment` | Complete | Commands and agents point at the card, the token and the guards |
| `007-playbook-catalog-readme-alignment` | Complete | Eight scenarios, four catalog leaves and the doc edits |
| `008-playbook-run-in-worktree` | Complete | All eight scenarios passed on a disposable worktree |
| `009-authoring-benchmark-and-closeout` | Complete | Benchmark runs, report and close-out records, with criterion 5 passing on the fourth final set |
| `010-deep-review-finding-fixes` | Complete | The nine P1 findings and the reproducing P2 findings from the deep review fixed for v2.3 docs, including the required-anchor check |
| `011-authoring-speed-research` | Complete | Twelve speed changes ranked by time saved against quality risk, three of them safe to build now |
| `012-authoring-speed-fixes-and-alignment` | Complete | The source-tag scanner skips git's file-system monitor, the card gives one answer for long plans and the docs match the shipped behavior |
| `013-addon-removal-and-speed-refinements` | Complete | Seven add-on templates instead of ten, one quiet validate run on the card and a repair hint that leads with the fix |
| `014-removed-template-reality-sweep` | Complete | No doc or agent still offers the deleted add-ons, and the docs that state the add-on set, validate cadence or decision-record rule match the code |
| `015-template-example-neutralization` | Complete | The speed benchmark's own task is gone from the fill notes and the card, and every worked example uses one neutral feature |
| `016-scaffold-filler-section-trim` | Complete | The sample rows that weak models kept as filler are removed or replaced with tokens, and Fix Completeness is optional |
| `017-measured-behavior-and-draft-metadata` | Complete | A Measured Behavior block with a warning-only rule for new specs, and a strict validate on a Draft packet repairs derived metadata itself |
| `018-benchmark-redesign-and-remeasure` | Complete | The old packets rescored and the speed loop rerun on a task no template names, with one REAL or INCONCLUSIVE verdict per comparison |
| `019-follow-up-fixes` | Complete | The goal-file manifest check runs with fsmonitor off and the speed loop rebuilds a dirty sandbox before the next round |

### Added

- The v2.3 value-token gate: a doc stamped v2.3 warns on an unfilled token while the spec is Draft and errors at any other status, and older docs keep their verdict.
- A fill line with a good and a weak example in every core and addon template section.
- A short authoring card that the four authoring intents load instead of the long template guide.
- Two guards, `check-example-drift.sh` and `check-card-sync.sh`.
- Eight playbook scenarios and four catalog leaves, run on a disposable worktree with eight passes.
- A benchmark report of the before and after for five metrics. The first three final sets failed criterion 5, and the fourth passed.
- A repair-hint test and one line on id numbering in the spec and acceptance-criteria templates (013).
- A `measured-behavior` anchor in the spec template and the `MEASURED_BEHAVIOR` warning rule for v2.4 specs, which brings the registry to 42 rules (017).
- Draft auto-repair in the validate CLI entry. A `--strict` run on a Draft packet whose only errors are derived metadata runs `repair-derived.cjs --apply` once and validates again, and `SPECKIT_DRAFT_AUTO_REPAIR=0` turns it off (017).
- A rescore script, a second benchmark task behind a leak gate and a paired output-token verdict for the speed loop (018).
- A between-round sandbox rebuild in the speed loop (019).

### Changed

- The speckit commands, the doctor entries and the doc-authoring agents name the new gate, the card and the guards.
- The playbook, catalog and READMEs describe the new authoring path.
- The parent executor and commit lines now state one local commit per phase and a Claude Code conductor.
- The spec kit ships seven add-on templates instead of ten. The before-after, roadmap and resource-map add-ons are removed, and the deep loops still write their own resource map (013).
- The card runs one quiet validate and stops after three rounds, and the validator's repair hint leads with the command that fixes the packet (013).
- Counts, lists and the decision-record rule across the docs, the orchestrate agent copies and the deep-loop catalog match the shipped code (014).
- Every fill-note example and the card's worked examples use one neutral feature, `scripts/rotate-logs.sh --keep <n>` (015).
- The scaffold drops the effort and second rollback sections, uses token rows for the phase-deps, edge-case, sign-off and DoD samples, and treats Fix Completeness as optional (016).
- The spec, plan, tasks, implementation-summary and acceptance-criteria templates are stamped v2.4, and the child validate runs of the repair and audit tools keep the repair switch off (017).

### Fixed

- 18 example descriptions, stale checklist lines, a dead hash file and the write-recipe move destination.
- The repo era report no longer counts v2.2 stamps as pre-v4.
- The goal-file manifest check turns fsmonitor off on both git calls, after one call held a full CLI suite run for 853 seconds (019).
- The speed loop no longer drops a variant for the rest of a run when one sandbox is dirtied, because it rebuilds the sandbox and keeps it only when the head and the leak check hold (019).

### Verification

- Recursive strict validation of the packet: RESULT: PASSED
- Parent criteria: C1 to C7 PASS (C5 after three failed final sets)
- Census over 4688 folders: 4496 PASS and 192 FAIL before and after, 0 differing rows
- Playbook run: 8 scenarios, 8 PASS
- Strict and six-rule censuses over 4,757 folders after phases 015 to 017: no row changed
- Redesigned benchmark: 29 valid packets over 8 rounds, with now054 ahead of pre054 on the blind total in all 8 rounds. The upkeep output-token saving is the only REAL speed result and every seconds verdict is INCONCLUSIVE
- Benchmark: four final sets. Criterion 5 passed on the fourth with counted missing_anchors 0 against 0 and leftover_hints at most 1 against 1. The first set had a missing_anchors maximum of 6 against 0

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/templates/` | Modified | Value tokens, fill lines and aligned examples |
| `.skilled/skills/system-spec-kit/runtime/` | Modified | Gate, guards and tests |
| `.skilled/skills/system-spec-kit/references/` | Modified | Authoring card and corrected references |
| `.skilled/skills/system-spec-kit/benchmark/reports/` | Created | Playbook run report and benchmark report |
| `.skilled/changelog/system-spec-kit/v2.9.0.0.md` | Created | Global changelog entry |
| `.skilled/changelog/system-spec-kit/v2.11.0.0.md`, `v2.12.0.0.md` | Created | Global changelog entries for the add-on removal and the Measured Behavior release |

### Follow-Ups

- Strict validation does not enforce required anchors. That is an open follow-up and is not fixed here. Parent criterion 5 passed on the second fresh set after three failed final sets, so the packet reads Complete.
- Update 2026-10-25: phase 010 adds the required-anchor check for v2.3 docs, and with phases 010 to 012 closed the packet is Complete. The phase 010 to 012 entries are `changelog-054-010-deep-review-finding-fixes.md`, `changelog-054-011-authoring-speed-research.md` and `changelog-054-012-authoring-speed-fixes-and-alignment.md`.
- Update 2026-10-26: phase 019 closed the two follow-ups the closeout named, the slow goal-file manifest check and the dropped speed-loop variant. One P2 stays open there, since a failed `prepare.sh` can leave a half-built sandbox directory that the sandbox map never names.
- Three runs per side cannot support a significance claim. The redesigned benchmark has 29 valid packets and still reads most speed comparisons as INCONCLUSIVE.
