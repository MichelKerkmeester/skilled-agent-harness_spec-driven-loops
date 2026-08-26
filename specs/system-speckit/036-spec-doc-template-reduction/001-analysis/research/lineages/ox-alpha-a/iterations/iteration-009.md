# Iteration 009 — Re-verification of weakest claims against committed ground truth

**Focus:** Harden the two simulation-derived or partially-inferred findings using the committed golden snapshot baseline (no simulation needed — the baseline IS rendered truth).

## Findings

### F-V1.1 — Comment leakage UPGRADED to baseline-proven [VERIFIED]
The committed snapshot file `scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` contains **11 `SELF-CHECK:` blocks** and multiple "CORE TEMPLATE (~N lines)" instructional comments (e.g., lines 174, 305, 346, 450, 598-602, 886). Since snapshots are captured from actual `renderInlineGates` output, this proves the real renderer ships these comments into every scaffolded packet — independent of my simulator's approximations. F-D1.1's per-template byte shares remain indicative; the ~15.5% order of magnitude is corroborated.

### F-V1.2 — _memory duplication at render level confirmed: 22 packet_pointer copies in baseline [VERIFIED]
Same snap file contains 22 `packet_pointer:` occurrences / 22 `template-author` continuity blocks across the level×doc renders — direct proof that L2/L3/L3+ packets receive near-identical `_memory` frontmatter in spec/plan/tasks/checklist/impl-summary (+decision-record) renders. F-C1.1's counts hold at the artifact level.

### F-V1.3 — Residual UNKNOWN narrowed but not eliminated
Whether full `generate-context.js` saves rewrite `_memory` blocks in ALL docs or only implementation-summary remains unverified in-session (write path behind workflow.ts frontmatter-editor chain; tracing it fully exceeded this lineage's read budget). Impact on recommendations: NONE changes direction — R4 already mandates validator-first sequencing and a targeted implementation-planning check. Explicitly carried as UNKNOWN for the implementation phase.

## Ruled out this iteration
- Ruled OUT: doubt about leakage being simulator artifact — baseline-proven now.

## Dead ends hit
- No compiled dist copy of inline-gate-renderer found to run directly; unnecessary after V1.1/V1.2 baseline proofs.
