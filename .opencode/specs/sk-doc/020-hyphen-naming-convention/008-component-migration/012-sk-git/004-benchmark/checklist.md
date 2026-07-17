---
title: "Checklist: sk-git benchmark (032 phase 008/012/004)"
description: "Blocking SOL verification contract for the sk-git benchmark profile-directory and artifact path phase."
trigger_phrases:
  - "sk-git benchmark checklist"
  - "032 benchmark profile verification"
  - "benchmark evidence parity acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for the benchmark phase"
    next_safe_action: "Run the checklist against the candidate benchmark rename commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/benchmark/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-git benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. The verifier pins the candidate SHA, BASE SHA, and benchmark-map hash, records commands, exit codes, profile/report discovery counts, parity results, and dispositions, and fails on zero reports or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The pinned worktree is clean, scoped to sk-git, and the candidate report records BASE SHA and the benchmark-map hash.
- [ ] CHK-002 [P0] The inventory contains two profile directories, four report files, all discovered path values, and explicit fixture/storage-guide dispositions.
- [ ] CHK-003 [P1] References, assets, manual-playbook, feature-catalog, changelog, and sibling-surface boundaries are recorded as excluded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Each profile/artifact rename follows the semantic map; no blind substitution or ambiguous target is accepted.
- [ ] CHK-005 [P0] Report keys, schemas, scenario IDs, scores, model labels, fixture/storage semantics, modes, symlinks, and non-path values are unchanged.
- [ ] CHK-006 [P1] No code identifier, tool-mandated name, or sibling-surface file changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Both live_glm_5.2_high and live_kimi_2.7 have exactly one rename or baseline no-op disposition; no source and target coexist.
- [ ] CHK-008 [P0] Both target profiles contain skill-benchmark-report.json and skill-benchmark-report.md, with zero missing or duplicate reports.
- [ ] CHK-009 [P0] Every discovered benchmark path value resolves and no active pointer retains either source profile path.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] The consumer inventory covers report JSON/Markdown paths, profile registries, loader/storage guidance, SKILL.md, README.md, and any fixture pointer discovered at BASE.
- [ ] CHK-011 [P1] Empty fixture and storage-guide categories are evidenced as empty, or every discovered entry is dispositioned in the map.
- [ ] CHK-012 [P1] The candidate diff is path-scoped to benchmark paths and listed consumers; no sibling phase surface is included.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P2] No secret, access policy, benchmark command, or executable behavior changed beyond path-valued references.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] spec.md, plan.md, tasks.md, and the candidate evidence report agree on the profile/report map and evidence-parity rules.
- [ ] CHK-015 [P2] The phase outcome is linked from the parent map and the 032 convention remains the only naming-policy source.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] The benchmark directory rename and pointer rewrite land in a dependency-closed, path-scoped commit on the pinned worktree branch.
- [ ] CHK-017 [P1] No implementation-summary.md or scratch/ remains in this leaf.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when all P0 checks pass, both profiles and four reports remain discoverable, evidence parity is clean, every target resolves, and no unexpected tracked mutation remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the benchmark map, report discovery, evidence parity, path closure, exemption boundary, and clean path-scoped diff.
<!-- /ANCHOR:sign-off -->
