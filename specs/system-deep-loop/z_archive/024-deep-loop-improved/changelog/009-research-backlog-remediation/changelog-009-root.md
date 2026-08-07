---
title: "Changelog: Research Backlog Remediation [009-research-backlog-remediation/root]"
description: "Chronological changelog for the Research Backlog Remediation spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/009-research-backlog-remediation` (Level 2, phase parent)

### Summary

Phase 009 implemented the prioritized backlog a deep-research fan-out produced against the packet itself, then a deeper forced-depth generation-2 pass found two more critical bugs in the research runtime's own completion and hang-handling logic. All 11 children shipped: 3 tooling bug fixes, 4 claimed-versus-actual drift closures, 3 infrastructure and design hardening items and a final pair of production-observed fixes for synthesis integrity and orchestrator hangs.

### Before vs After

**Before**

The fan-out merge tool silently dropped a lineage's findings on a schema mismatch, the per-lineage timeout ceiling had no operator override, ephemeral finding-id markers sat in source comments and a salvage placeholder used unpadded filenames. Six phase-parents showed every child as Draft despite real completion, 40 grandchild files carried a stale zero completion percentage, several folders still referenced the packet's old pre-migration name, an abandoned lineage held a dead lock, 14 review findings sat undispositioned, graph-metadata omitted real runtime surfaces a folder's own frontmatter already named, the description generator cut text off mid-word, one phase-parent's own governance docs were still raw templates and two ADR sub-phases had no decision-record. A convergence-threshold default disagreed across loop types, the working but undocumented forced-depth flag had no documentation, no detector caught a Complete folder with untouched scaffold docs, a lineage could narrate synthesis complete without ever writing its output and the fan-out orchestrator could hang indefinitely after a lineage's subprocess had already exited.

**After**

The merge tool now tolerates known schema aliases and warns instead of silently dropping findings, the timeout ceiling has a documented override, comment-hygiene markers are gone with a new lint rule to catch recurrence and salvage filenames are correctly padded. Every phase-map row and every completion percentage now matches real state, every live old-name reference points at the current packet path, the dead lock is removed with its lineage archived, all 14 review findings carry an explicit evidence-backed disposition, graph-metadata reflects real runtime surfaces packet-wide, the description generator no longer truncates mid-word, phase 008's own governance docs are real aggregates and both missing ADR decision-records are authored from each phase's actual shipped content. The convergence-threshold default is now loop-type-aware, the forced-depth flag is documented on both consumer commands, a new validate.sh rule catches untouched-scaffold drift automatically, a real synthesis-completion invariant gates the completion event and a genuinely new post-exit watchdog stops the orchestrator from hanging after a lineage's subprocess has already exited.

**Impact**

The research-and-remediation loop closed on itself. The very tooling that produced the backlog had its own bugs fixed first, so the drift-closure and hardening work that followed could be trusted, and the phase ended by fixing the two most severe bugs this whole effort surfaced in its own runtime, both directly observed in production during this same session.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-fanout-merge-schema-tolerance` | Complete | Added schema-tolerant normalization to the fan-out merge script so a registry using a non-canonical key is coerced and logged instead of silently dropped. |
| `002-fanout-timeout-override` | Complete | Added an optional per-lineage timeout-hours override, replacing the hardcoded four-hour ceiling while preserving the existing formula. |
| `003-runtime-hygiene-fixes` | Complete | Removed 15 ephemeral comment markers, added a lint rule to catch recurrence, fixed a salvage-filename zero-padding bug and traced a suspected registry bug to its real cause. |
| `004-phase-doc-map-and-completion-pct-sync` | Complete | Built a reusable sync script and backfilled 40 stale phase-map rows and 40 stale completion-percentage fields against real source state. |
| `005-packet-identity-cleanup` | Complete | Fixed every live reference to the packet's old pre-migration name, left every historical reference untouched and archived an abandoned lineage's dead lock. |
| `006-review-registry-and-metadata-backfill` | Complete | Dispositioned all 14 review findings with real evidence, fixed a real graph-metadata generator bug and fixed the description generator's mid-word truncation. |
| `007-parent-scaffold-and-governance-docs` | Complete | Replaced phase 008's own raw template docs with real aggregates and authored both missing ADR decision-records from each phase's real shipped content. |
| `008-convergence-threshold-and-forced-depth-flag` | Complete | Corrected the convergence-threshold default to be loop-type-aware instead of a flat value change, and documented the forced-depth stop-policy flag. |
| `009-convergence-design-and-hardening` | Complete | Recorded a deferral decision for a sliding-window convergence mode and shipped stall-alerting and per-lineage cost-cap hardening. |
| `010-validate-sh-template-detection` | Complete | Added a validate.sh rule that catches a Complete folder with untouched scaffold docs, confirmed against a real live instance it found. |
| `011-synthesis-integrity-and-orchestrator-watchdog` | Complete | Added a real synthesis-completion invariant and a genuinely new post-exit orchestrator watchdog, fixing the two most severe bugs this remediation phase surfaced in its own runtime. |

### Added

- `sync-phase-map-status.ts`, `reconstructResearchRegistryFromState()`, the `COMMENT_HYGIENE_MARKER` and `SCAFFOLD_NEVER_TOUCHED` validate.sh rules, the fan-out stall watchdog and per-lineage budget cap, the post-exit orchestrator watchdog and the synthesis-completion invariant in both workflow YAMLs.

### Changed

- The fan-out merge tool, the per-lineage timeout ceiling, the convergence-threshold fallback, graph-metadata key_files derivation and the description generator's truncation behavior.

### Fixed

- Silent finding loss on schema mismatch, comment-hygiene markers, a salvage-filename padding bug, stale phase-map and completion-percentage drift across 002 through 007, stale old-name references, a dead abandoned lock, 12 of 14 undispositioned review findings, a real graph-metadata generator bug, mid-word description truncation, phase 008's own template scaffolds, a cross-sibling convergence-threshold default mismatch, a false synthesis-completion narration bug and an indefinite orchestrator hang.

### Verification

- Every child independently re-verified against real repo state rather than accepted on a dispatch's self-report, including two dispatches whose background processes were interrupted before delivering their final structured report.
- `validate.sh --recursive` on the root packet, PASSED with 0 errors across all 10 top-level folders after every child shipped.
- The `deep-loop-runtime` Vitest suite ended this phase at 570 of 572, up from a documented pre-phase baseline, with the 2 remaining failures confirmed pre-existing and unrelated throughout.

### Files Changed

_See each leaf changelog in this directory for full file-level detail._

### Follow-Ups

- 2 review findings remain genuinely active (session-id reuse into review-init bindings, leaf-agent naming and scope mismatch in the fan-out prompt).
- The sliding-window convergence mode is a documented, evidence-backed follow-up, not shipped in this phase.
- The default validate.sh invocation path does not read the shell rule registry at all, so both new rules added in this phase only run through explicit `SPECKIT_RULES` invocation, a real architectural gap worth its own follow-up phase.
- Dozens of leaf children across phases 002 through 007 still carry genuine scaffold markers in their own plan.md or tasks.md, a known, deliberately deferred Tier 3 item this phase's own new detector surfaces but does not fix.
