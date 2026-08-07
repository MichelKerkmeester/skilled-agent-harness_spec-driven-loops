# Iteration 003 — Re-verify: Stale completion_pct:0 Drift (Round-1 F-003)

**Focus:** Quantify the completion_pct:0 drift; spec-vs-code contradiction in a single child.
**Angle:** Count + a concrete 3-way contradiction example.

## Findings

**Count:** `rg -l "completion_pct: 0"` across `*.md` in the packet returns **143 files**. Round 1 said "50+"; the actual live figure is 143 — substantially wider than round 1's estimate.

**Concrete 3-way contradiction (002/001-atomic-state-serialize-diff):**
- `spec.md:24` → `completion_pct: 0`
- `implementation-summary.md:22` → `completion_pct: 100`
- Parent phase-map → "Draft"

So one child claims 0% in its own spec frontmatter, 100% in its impl-summary, and "Draft" in the parent map. This is the canonical drift signature.

**Root-cause hypothesis (to deepen in later iterations):** spec.md frontmatter is scaffold-authored at creation and never re-synced when implementation completes; implementation-summary.md is the only file the author finalizes. There is no `step_completion_pct_sync`.

## Evidence
[SOURCE: 143-file count via rg "completion_pct: 0"]
[SOURCE: 002-deep-loop-runtime/001-atomic-state-serialize-diff/spec.md:24]
[SOURCE: 002-deep-loop-runtime/001-atomic-state-serialize-diff/implementation-summary.md:22]

## newInfoRatio: 0.7 (higher count than round 1 + localized 3-way contradiction in one child)
