# Iteration 018: Final Evidence Sweep — Verifying No Remaining Gaps

## Focus
- Scope: Final sweep for additional drift patterns, ephemeral markers, or structural issues not yet covered
- Question: Are there any remaining issues beyond F-001 through F-017?

## Findings

### F-018: Two minor additional findings + confirmation that the 17 major findings are comprehensive

**Severity: Low-Medium (minor additions to the comprehensive set)**

**Minor-1: Root spec.md `key_files: []` while phase children list 5+ files each**

The root spec.md continuity frontmatter has `key_files: []` (empty array). Every phase child (002-007) lists 2-5 real implementation files in their key_files. The root should aggregate at least the most critical cross-phase files.

[SOURCE: `spec.md:19`]

This is a facet of F-009 (graph-metadata key_files omissions) but specifically calls out the spec.md frontmatter as the upstream source.

**Minor-2: 008 parent spec.md has "Level: 1 (phase parent)" but should be Level 2**

The 008 parent spec.md says `| **Level** | 1 (phase parent) |` at line 42, but it has 7 child sub-phases (001-007), each with their own spec.md. A phase parent with children is Level 2 by the spec-kit convention. The "(phase parent)" annotation is non-standard.

[SOURCE: `008-loop-systems-remediation/spec.md:42`]

**008/007-fan-out-hardening verification (positive):**

The fan-out hardening child phase DID ship with verification evidence:
- `implementation-summary.md`: `completion_pct: 100`, `last_updated_by: "glm-fanout-review"`
- `answered_questions`: "salvage.failed > 0 now always rejects and retries; --dangerously-skip-permissions is opt-in via sandboxMode: danger-full-access"
- `key_files`: lists fanout-run.cjs and fanout-merge.cjs

[SOURCE: `008-loop-systems-remediation/007-fan-out-hardening/implementation-summary.md:1-35`]

This confirms the fan-out hardening fixes shipped. The gap (F-004) is that the review registries were never updated to reflect this — not that the fixes are missing.

**Comprehensiveness check:**

All known leads from the research topic have been verified, deepened, and supplemented:
- ✅ Comment-hygiene violations (F-002: 6 markers across 2 files, fully catalogued)
- ✅ Phase Doc Map Draft status (F-001: 40 rows across 6 phases, quantified)
- ✅ Stale completion_pct:0 (F-003: 50+ files, pattern identified)
- ✅ Review lineage CONDITIONAL + stale registries (F-004: 9 unset findings, 0 codex findings)
- ✅ P1-007 key_files omission (F-009: deepened with 3 metadata failures)
- ✅ Abandoned native lineage + stale lock (F-007: >21h stale, old path)
- ✅ Orphaned review-report.md (F-011: confirmed at old path)
- ✅ Weak-evidence phases (F-010: 3 phases without test evidence)
- ✅ Empty scaffolds (F-010, F-015: template-default docs under Complete)
- ✅ ADR phases missing docs (F-008: 2 of 3 ADR phases)
- ✅ Fan-out convergence threading (F-005: correct when explicit, default mismatch)
- ✅ computeLineageTimeoutMs cap (F-006: mathematically impossible for 35-iter loops)

NEW findings beyond known leads:
- F-011: 14 old-packet-number references across 7 files
- F-012: 100 codex iteration files (50 real + 50 placeholders)
- F-013: Denominator-drag convergence analysis + fan-out native default mismatch
- F-014: Codex stopPolicy=max-iterations (by design) + zero-finding registry root cause
- F-016: 4 new safety/observability hardening recommendations
- F-017: 6 missing validate.sh checks

## Novelty Justification
newInfoRatio is low (~0.03) — this iteration adds 2 minor findings and confirms comprehensiveness. The research has exhausted the major discovery surface. Further iterations would produce <0.01 newInfoRatio.

## What Was Tried and Failed
- Searched for additional ephemeral markers in deeper YAML files (none found beyond F-002)
- Checked external/ directory (contains reference codebases, not issues)

## Ruled-Out Directions
- Further iteration is unlikely to produce significant new findings (convergence approaching)
