

---
title: "semantic_shadow Doc/Comment Sync (F3)"
description: "The stale SC-004/SC-005 scenarios, feature-catalog attribution doc, and a stale lane comment now match the verified live semantic_shadow lane (weight 0.05, live:true, shadowOnly:false). The weight was NOT changed."
trigger_phrases:
  - "semantic_shadow doc sync"
  - "F3 lane weight doc fix"
  - "SC-004 SC-005 stale"
  - "semantic-shadow shadowOnly"
  - "lane attribution sync"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation`

### Summary

The stale SC-004 and SC-005 test scenarios, the feature-catalog attribution doc, and a stale code comment in semantic-shadow.ts were synced to match the verified live lane. The live lane runs at weight 0.05 with live:true and fused shadowOnly:false. This was a documentation and comment-only sync; no behavior or weight was changed. The sync clears the SC-004 PARTIAL flag from the 028 run.

### Added

- None.

### Changed

- The SC-004 lane-attribution doc now expects shadowOnly:false for the live semantic_shadow lane.
- The SC-005 ablation doc now treats semantic_shadow as a non-zero ablation lane.
- The feature-catalog 04-attribution doc now matches the live lane behavior.

### Fixed

- The stale comment in lanes/semantic-shadow.ts was rewritten to clarify the raw shadowOnly flag semantics while keeping the weight unchanged.

### Verification

- SC-004 and SC-005 docs match the live lane.
- Lane weight unchanged at 0.05.
- semantic-shadow vitest green.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/004-lane-attribution.md` | Modify | Expect shadowOnly:false for the live semantic_shadow lane |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/005-ablation.md` | Modify | Treat semantic_shadow as a non-zero ablation lane |
| `.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/04-attribution.md` | Modify | Match the live lane behavior |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Modify | Rewrote stale comment to clarify raw shadowOnly flag |

### Follow-Ups

- None. Documentation and comment sync only; no behavior change.
