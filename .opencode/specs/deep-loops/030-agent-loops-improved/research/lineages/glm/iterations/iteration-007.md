# Iteration 007 — Re-verify: Migration Residue 123-/156- Packet References (Round-1 F-011)

**Focus:** Old packet-number references in LIVE (non-archived) spec files.
**Angle:** Separate live navigation fields from historical archived content.

## Findings

**`123-agent-loops-improved` references in LIVE spec.md files (7 phase parents):**
- `001-reference-research/spec.md` (4 hits)
- `002-deep-loop-runtime/spec.md` (4 hits)
- `003-deep-loop-workflows/spec.md` (2 hits)
- `004-system-spec-kit/spec.md` (1 hit)
- `005-skill-interconnection/spec.md` (1 hit)
- `006-ux-observability-automation/spec.md` (1 hit)
- `007-testing/spec.md` (1 hit)
- Plus `008-loop-systems-remediation/handover.md` (2 hits)
- Plus changelog/*-root.md files (historical commit scope — acceptable but noisy)

These are in **live navigation fields** (Parent Spec, Successor, Parent Packet, prose), NOT historical annotations. The packet was migrated to `030-agent-loops-improved` but a global find-replace was never completed.

**`156-agent-loops-improved` references in LIVE files:**
- `spec.md:8` trigger_phrases → `"156 agent loops"`
- `graph-metadata.json:27` trigger_phrases → `"156 agent loops"`
- The native lock packet_id (iteration 006)

**Verdict: STILL LIVE.** 009/005-packet-identity-cleanup was scaffolded (Tier 1) for this but **does not exist as a folder**.

**Orphaned old-path review-report.md:** Round 1 cited an orphaned file at the old `123-` path. A direct check shows `specs/skilled-agent-orchestration/123-agent-loops-improved/` and `.../156-agent-loops-improved/` **do NOT exist** — so that specific orphan was either cleaned up or was inside the archived research tree only. This sub-item appears resolved.

## Evidence
[SOURCE: 7 phase-parent spec.md files — rg -c "123-agent-loops-improved"]
[SOURCE: spec.md:8, graph-metadata.json:27 — "156 agent loops"]
[SOURCE: 009/005 folder absent — ls 009-research-backlog-remediation/]

## newInfoRatio: 0.6 (confirmed live; one sub-item — orphaned review-report — appears resolved)
