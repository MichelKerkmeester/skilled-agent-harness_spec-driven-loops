# Iteration 030 — NEW: Remediation Phase Priority Ordering (Concrete 009/008 or New Phase Design)

**Focus:** What should the consolidated remediation contain, in priority order?
**Angle:** Risk/priority evaluation for closing comment-hygiene + registry-staleness + graph-metadata drift together.

## Findings

009's current 10-child plan is correctly tiered (0=tooling, 1=drift, 2=infra) but **execution stalled after 001**. Round 2's evidence re-prioritizes based on what's STILL LIVE and highest-blast:

**Tier 0 (blocks correctness of all downstream trust) — DO FIRST:**
1. **009/002 timeout override** — CRITICAL, still live (iter 011). Without it, no 30+ iteration run can complete. Highest leverage.
2. **009/003 comment-hygiene + salvage naming** — constitutional violation (iter 001) + root-cause one-liner fix (iter 012). Cheap, high-signal. The salvage fix also unblocks the codex registry accuracy (iter 021).
3. **Registry disposition step (new)** — systemic gap (iter 025). Add `step_review_registry_disposition` to review synthesis + a `reconstructResearchRegistryFromState` (iter 029). This is NEW scope not in 009's current plan — recommend adding as 009/003b or a new child.

**Tier 1 (drift closure — bundle via Root Cause A, iter 028):**
4. **009/004 phase-doc-map + completion_pct sync** — one `speckit:complete` post-hook fixes 40 rows + 143 files (iter 002,003).
5. **009/005 packet-identity cleanup** — 123-/156- refs + native lock removal (iter 006,007).
6. **009/006 registry backfill + graph-metadata** — disposition backfill + key_files aggregation + last_active_child_id + truncation fix (Root Cause B, iter 023,027).
7. **009/007 parent scaffold + governance** — 008/001 template finalization + ADR decision-records + checklists (iter 008,009,022).

**Tier 2 (prevention — Root Cause C + design):**
8. **009/008 stop-policy first-class flag + convergence floor** — surface `--stop-policy` in command help + unconditional minIterations (iter 015,016).
9. **009/009 sliding-window convergence design** (iter 017).
10. **009/010 validate.sh template-detection** (Root Cause C, iter 008,022).

**Key re-prioritization vs 009's current plan:** the registry-disposition step (iter 025) and research-reconstruct symmetry (iter 029) are NOT in 009's plan and should be added to Tier 0.

## Evidence
[SOURCE: iter 011,001,012,025,029 — Tier 0 live items]
[SOURCE: 009/spec.md:113-124 — current 10-child plan lacks registry-disposition step]

## newInfoRatio: 0.9 (concrete re-prioritized remediation with 2 new scope items)
