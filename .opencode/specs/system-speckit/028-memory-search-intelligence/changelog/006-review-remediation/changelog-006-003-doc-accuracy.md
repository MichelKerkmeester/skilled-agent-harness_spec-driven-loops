---
title: "Changelog: Doc Accuracy Remediation [006-review-remediation/003-doc-accuracy]"
description: "Chronological changelog for the doc accuracy remediation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-20

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/003-doc-accuracy` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation`

### Summary

This phase executed the parent-dispatched doc-accuracy fixes against committed code. The P1-6 Memory rollup mislabel is corrected and the timeline, before-vs-after and benchmark-status staleness cluster is reconciled to the landed work. Default-off gating no longer reads as no-code-shipped. Three scaffold items overlap phase 004 or a concurrent session and were deferred.

### Added
- A new Section D2 in `timeline.md` narrating the continuation past commit 30.
- Three Code Graph default-off flags added to the `benchmark-status.md` inventory.

### Changed
- `timeline.md` extended the epochs diagram past commit 30, reframed Section E for shipped-behind-flag versus held, corrected the last-code-wave label and repointed the dangling 030 pointer to the per-track changelogs.
- `before-vs-after.md` advanced the intro and CURRENT STATE past commit 30, corrected Section 6 release-cleanup from all-PENDING to all-executed and reconciled the benchmark framing to the criterion-4 run.
- `benchmark-status.md` completed the default-off flag inventory layered on phase 001's criterion-4 text without reverting it.

### Fixed
- P1-6 changelog shipped-vs-Planned mislabel. Rows 009, 011, 017, 018 and 020 in `changelog-001-root.md` were reclassified from Planned to shipped-default-off, each traced to commit `ed53661043`, `5308401d95` or `8f8776e329` plus its child implementation-summary. Rows 008 and 010 stayed as no-code because their own children agree.
- The doc staleness cluster across timeline, before-vs-after and benchmark-status was reconciled to committed code.

### Verification
- Rollup reclassification - DONE, 009/011/017/018/020 corrected and traced to commits, 008 and 010 kept as no-code.
- Narrative refresh - DONE, timeline and before-vs-after advanced past commit 30 to the criterion-4 run and the 030 deletion.
- Inventory completion - DONE for benchmark-status.md with 3 Code Graph flags, ENV_REFERENCE.md deferred to its concurrent owner.
- HVR scan - PASS, 0 em-dashes and 0 semicolons in the added lines.
- Strict validation - exit 0 for this child folder and the 028 root.

### Files Changed
- `001-speckit-memory/changelog/changelog-001-root.md`: reclassified rows 009/011/017/018/020 to shipped-default-off.
- `timeline.md`: extended the epochs diagram, added Section D2, reframed Section E and repointed the 030 pointer.
- `before-vs-after.md`: advanced CURRENT STATE, corrected release-cleanup and benchmark framing.
- `benchmark-status.md`: completed the default-off flag inventory with 3 Code Graph flags.
- `tasks.md` / `checklist.md`: marked executed and verified items, recorded deferrals.
- `implementation-summary.md`: recorded executed scope and deferrals.

### Follow-Ups
- Three cluster items were deferred and route to phase 004 P2 triage. `changelog-028-root.md` verification population, `000-release-cleanup/spec.md` phase-map and zero-hash fingerprint, and the `ENV_REFERENCE.md` 17-flag inventory which is owned by a concurrent session.
- No commit was made. The edits are staged in the working tree only and committing is the dispatcher's decision.
