---
title: "Checklist: cli-external-orchestration benchmark naming (032 phase 005.006)"
description: "Blocking SOL verifier contract for the cli-external-orchestration benchmark boundary: explicit empty baseline, authored/generated classification, active path closure, and semantic protection."
trigger_phrases:
  - "cli-external benchmark checklist"
  - "benchmark fixture profile verifier"
  - "cli-external phase 006 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark verifier"
    next_safe_action: "Run the benchmark census checklist"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/benchmark/"
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current benchmark result is .gitkeep only."
---
# Checklist: cli-external-orchestration benchmark naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. The verifier pins candidate and BASE SHAs, records the benchmark path/disposition ledger and hash, captures commands and exit codes, and fails on an unclassified addition, stale authored path, generated-output rewrite, invented artifact, semantic drift, or unexpected mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 005 playbook handoff and the pinned worktree are available before the benchmark census is accepted
- [ ] CHK-002 [P1] Candidate SHA, BASE SHA, benchmark map hash, and `.gitkeep`-only baseline or execution-time inventory are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] The current benchmark tree is explicitly proven to contain only `.gitkeep`, or every new authored candidate has a unique kebab-case map entry
- [ ] CHK-004 [P0] Only filesystem path values changed; benchmark IDs, fixture/profile data, payload/data keys, scores, and generated content did not
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every benchmark descendant has exactly one authored, generated, frozen, exempt, or tool-mandated disposition; no unknown path remains
- [ ] CHK-006 [P0] Active authored benchmark paths and any hub skill/README/index references resolve with no stale source
- [ ] CHK-007 [P0] Generated runs/raw responses/retries, lockfile output, and frozen records were preserved or explicitly dispositioned and were not mechanically renamed
- [ ] CHK-008 [P1] Scenario IDs, fixture/profile data, report/payload keys, model/data keys, and score values match BASE
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] The authored map is bijective, collision-free, reversible, and handed to phase 007 with path-reference evidence
- [ ] CHK-010 [P1] No benchmark artifact was invented to satisfy the rename phase, and no playbook/component/release path was absorbed
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] No generated-artifact trust boundary, executable policy, tool allowlist, or data-key interpretation changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] Evidence identifies the `.gitkeep` baseline, all execution-time classifications, active-reference results, semantic parity, and phase 007 handoff
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Only benchmark-owned paths and active references changed; no implementation-summary scaffold file or scratch directory remains
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when the empty benchmark baseline or complete authored map is evidenced, generated output is protected, active paths resolve, and benchmark semantics match BASE. A zero-candidate result is valid; an unknown artifact is not.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and the final diff contains no unassigned benchmark mutation or generated-output rewrite.
<!-- /ANCHOR:sign-off -->

