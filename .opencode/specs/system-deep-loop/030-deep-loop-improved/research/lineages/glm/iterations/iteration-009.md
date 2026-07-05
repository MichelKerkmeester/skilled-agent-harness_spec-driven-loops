# Iteration 009 — Re-verify: ADR Sub-Phase Governance Gaps (Round-1 F-008)

**Focus:** 003-deep-loop-workflows ADR-titled sub-phases missing decision-record.md; checklist.md absence.
**Angle:** Enumerate every 003 child for the two governance docs.

## Findings

**003-deep-loop-workflows has 12 child folders** (001-012) plus a `scratch/`.

**decision-record.md presence:** Only **1 of 12** children has it:
- `002-convergence-profile-unification-adr/decision-record.md` — PRESENT
- `003-cross-mode-anti-convergence-adr/` — **MISSING** (despite `-adr` in the name)
- `005-anchor-ownership-conflict-adr/` — **MISSING** (despite `-adr` in the name)

So 2 of the 3 `-adr`-named sub-phases lack the very document their name implies.

**checklist.md presence:** **0 of 12** children have checklist.md. None. A Complete-status phase with Level-2+ complexity should have checklists per the spec-kit Level rules, but every child is at "Draft" in the parent map and has no checklist.

**Verdict: STILL LIVE — both sub-items confirmed.** 009/007-parent-scaffold-and-governance-docs (Tier 1) covers this but doesn't exist as a folder. Round-1's recommendation (validate.sh rule for `*-adr/` folders) was never implemented.

## Evidence
[SOURCE: find 003-deep-loop-workflows -name "decision-record.md" → only 002]
[SOURCE: find 003-deep-loop-workflows -name "checklist.md" → empty]
[SOURCE: 003-deep-loop-workflows/spec.md:45 — parent Status: Complete]

## newInfoRatio: 0.55 (re-confirmed; no change since round 1)
