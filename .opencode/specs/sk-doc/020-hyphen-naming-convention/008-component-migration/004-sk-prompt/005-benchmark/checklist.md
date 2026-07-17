---
title: "Checklist: sk-prompt benchmark artifact names (032 phase 004.005)"
description: "Blocking SOL verifier contract for phase 005 of the sk-prompt kebab-case program: authored benchmark path closure, generated-output disposition, and benchmark semantic parity."
trigger_phrases:
  - "sk-prompt benchmark checklist"
  - "sk-prompt benchmark verifier"
  - "sk-prompt phase 005 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for benchmark path and semantic parity"
    next_safe_action: "Run the checklist against the candidate benchmark rename commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/benchmark/"
      - ".opencode/skills/sk-prompt/prompt-improve/benchmark/"
      - ".opencode/skills/sk-prompt/prompt-models/benchmarks/"
      - ".opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current authored benchmark directory candidates are live_final, router_final, and router_mode_a."
      - "Generated raw-run and archive names must receive explicit dispositions rather than a mechanical rename."
---

# Checklist: sk-prompt benchmark artifact names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. The verifier pins candidate and BASE SHAs, records
the complete benchmark path/disposition ledger and map hash, captures commands and exit codes, and fails on an unknown
path class, stale active source path, generated-output rewrite, or benchmark semantic drift.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase 004 handoff, pinned BASE, and candidate worktree are available and clean at the start of execution
- [ ] CHK-002 [P1] The ledger includes every descendant of root `benchmark/`, prompt-improve `benchmark/`, and prompt-models `benchmarks/`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] `live_final/`, `router_final/`, and `router_mode_a/` map to unique exact kebab-case targets, and any additional authored candidate has an explicit map entry
- [ ] CHK-004 [P0] The diff changes filesystem path values only; benchmark IDs, JSON/YAML/TOML keys, code identifiers, fixture/profile data, and scores are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every benchmark path has exactly one authored, generated, frozen, exempt, or tool-mandated disposition, with no unknown path
- [ ] CHK-006 [P0] Active summaries, reports, skill/README references, harness paths, and storage-guide links resolve to mapped targets with no stale authored source path
- [ ] CHK-007 [P0] `runs/`, `runs-archive/`, raw response names, retry artifacts, and generated payloads are preserved or otherwise dispositioned with evidence; none was mechanically rewritten
- [ ] CHK-008 [P1] Scenario IDs, report payload keys, fixture/profile keys, and score values match the BASE snapshot
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] The authored rename map is bijective, collision-free, reversible, and its map hash is recorded
- [ ] CHK-010 [P1] The final benchmark census contains no in-scope authored snake_case filesystem name outside the recorded exemption set
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] No benchmark path change alters executable policy, tool allowlists, generated artifact trust boundaries, or data-key interpretation
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] The authored/generated ledger, path map, semantic parity evidence, and handoff to phase 006 are linked from the phase evidence
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Only benchmark-owned paths and their active references changed; no scratch directory or implementation-summary scaffold artifact remains
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, authored benchmark paths are kebab-case, generated output has a recorded
disposition, active references resolve, and benchmark IDs, keys, fixtures, profiles, and scores match BASE.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and the final diff contains no
unassigned benchmark mutation or generated-output rewrite.
<!-- /ANCHOR:sign-off -->
