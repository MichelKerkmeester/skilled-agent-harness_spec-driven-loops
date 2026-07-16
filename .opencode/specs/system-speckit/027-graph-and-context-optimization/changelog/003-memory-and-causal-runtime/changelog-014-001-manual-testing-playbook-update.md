---
title: "014/001 Manual Testing Playbook Update"
description: "Six human-run manual testing scenarios were added and wired into the Spec Kit Memory playbook for checkpoint v2, enrichment v30, index_scan refinements, front-proxy behavior and sk-git worktrees."
trigger_phrases:
  - "manual testing playbook EX-037 EX-042"
  - "checkpoint enrichment front proxy sk-git scenarios"
  - "014 001 playbook update changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh`

### Summary

Added six human-run `EX-###` scenarios to the Spec Kit Memory manual testing playbook. The update is additive and keeps the existing split-document format: one feature file per scenario plus a master index entry. New IDs run from `EX-037` through `EX-042`, directly after the prior maximum `EX-036`.

The scenarios cover checkpoint v2 round trips, the `.needs-rebuild` self-heal path, schema v30 enrichment markers, `index_scan` phased async behavior, front-proxy reconnect behavior and the sk-git worktree convention.

### Added

- Six new playbook feature files: `EX-037` checkpoint v2 round trip, `EX-038` enrichment v30 lifecycle, `EX-039` `index_scan` refinements, `EX-040` front-proxy reconnect, `EX-041` sk-git worktrees and `EX-042` `.needs-rebuild` self-heal.
- Master index entries for `EX-037` through `EX-042` under `manual_testing_playbook/manual_testing_playbook.md`.
- Source metadata for each scenario so operators can trace behavioral claims to code anchors.

### Changed

- Extended the manual testing playbook without renumbering existing scenarios or changing existing IDs.
- Placed new scenarios in topic-specific folders: lifecycle, maintenance, pipeline architecture and tooling.
- Kept destructive checkpoint and restore instructions scoped to disposable sandboxes.

### Fixed

- Closed the playbook discoverability gap for shipped 013 roadmap behavior and the sk-git worktree convention.
- Clarified that `-32001` remains the live retryable recycle signal and `-32002` is the terminal protocol mismatch signal.

### Verification

| Check | Result |
|-------|--------|
| Packet docs | PASS - spec, plan, tasks, checklist, decision record and implementation summary authored |
| Scenario files | PASS - six feature files exist under topic-specific folders |
| Master index | PASS - `EX-037` through `EX-042` entries link to the new feature files |
| Source anchors | PASS - behavioral claims cite checkpoint, enrichment, memory index, launcher proxy, context server and sk-git sources |
| Strict validation | PASS - packet records `validate.sh --strict` with 0 errors and 0 warnings |
| Live execution | Not run - scenarios are human-run, with destructive flows marked sandbox-only |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | Added master index entries for `EX-037` through `EX-042` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md` | Added | Checkpoint v2 snapshot and restore round-trip scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/post-insert-enrichment-lifecycle-v30.md` | Added | Schema v30 enrichment marker lifecycle scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/index-scan-phased-async-refinements.md` | Added | `index_scan` phased async and repair-count scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md` | Added | Front-proxy reconnect, backend-only mode and error-code scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/sk-git-worktree-convention.md` | Added | sk-git worktree convention scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-needs-rebuild-self-heal.md` | Added | `.needs-rebuild` self-heal scenario |

### Follow-Ups

- Deep review later flagged playbook executability issues around `EX-037` unsupported `includeEmbeddings`, the scratch-copy restore wording and `EX-039` move-reconciliation scope. Track those in the follow-up remediation packet.
- Catalog cross-links were deferred to sibling phase 002 and are not part of this phase.
