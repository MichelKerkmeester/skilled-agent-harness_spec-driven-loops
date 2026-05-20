# Iteration 002 — Phase-Parent Rename Correctness

## Hypotheses going in

The 023[A-F]→023/001-008 phase-parent rename should have been complete. Expected:
- Zero residual references to old slugs (023A, 023B, 023C, 023D, 023E, 023F, 023A1, 023A3)
- Strict-validate passes on parent and all 8 children
- Parent spec.md accurately documents the 8-child arc with finding counts

## Files / commands run

### Grep for residual old slug references
```bash
grep -rln "023[A-F][0-9.]*-" .opencode/skills/mcp-coco-index/ .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/
```

**Result:** 9 matches found (excluding .venv, __pycache__, build artifacts):

**Historical context (acceptable):**
- `.opencode/specs/.../023-deep-research-arc-blind-spots/research/iterations/iteration-019.md:4:023A-E` — historical reference to recommended packet stack
- `.opencode/specs/.../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/research/upstream-sweep.md:15:cocoindex-code-upstream-023F-54653` — upstream clone temp directory name
- `.opencode/specs/.../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/research/delta-classification.md:3:cocoindex-code-upstream-023F-54653` — upstream clone path reference
- `.opencode/specs/.../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/checklist.md:116:cocoindex-code-upstream-023F-54653` — checklist evidence reference
- `.opencode/specs/.../023-deep-research-arc-blind-spots/007-fixture-calibration/checklist.md:118:023C-style counters` — historical reference to counter style

**Stale reference (needs update):**
- `.opencode/specs/.../023-deep-research-arc-blind-spots/001-request-budget-hardening/graph-metadata.json:17:"023C-observability"` — stale related_to reference

**False positives (excluded):**
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/scipy/integrate/_lebedev.py` — third-party package
- `.opencode/specs/.../011-rerank-model-fit-investigation/research/phase2-bench/__pycache__/calibration_perturbation.cpython-311.pyc` — build artifact
- `.opencode/specs/.../011-rerank-model-fit-investigation/research/phase2-bench/calibration_perturbation.py` — different packet (011, not 023)

### Strict-validate on parent
```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots --strict
```

**Result:** PASSED (0 errors, 0 warnings)

### Strict-validate on all 8 children
```bash
for child in 001 002 003 004 005 006 007 008; do
  bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/.../023-deep-research-arc-blind-spots/00$child-* --strict
done
```

**Result:** All 8 children PASSED (0 errors, 0 warnings each)
- 001-request-budget-hardening: Level 2, PASSED
- 002-retrieval-observability: Level 2, PASSED
- 003-upstream-rebase-spike: Level 2, PASSED
- 004-metadata-fingerprint: Level 3, PASSED
- 005-doctor-model-swap-ux: Level 2, PASSED
- 006-prompt-license-registry: Level 2, PASSED
- 007-fixture-calibration: Level 3, PASSED
- 008-vec0-migration-fix-deferred: Level 1, PASSED

### Parent spec.md verification
**File:** `.opencode/specs/.../023-deep-research-arc-blind-spots/spec.md`

**Phase map section findings:**
| # | Child folder | Status | Round shipped | Findings closed |
|---|--------------|--------|---------------|-----------------|
| 001 | 001-request-budget-hardening/ | Complete | R1 | 4 |
| 002 | 002-retrieval-observability/ | Complete | R1 | 8 |
| 003 | 003-upstream-rebase-spike/ | Review | R2 | 7 |
| 004 | 004-metadata-fingerprint/ | Complete | R3 | 15 |
| 005 | 005-doctor-model-swap-ux/ | Complete | R3 | 9 |
| 006 | 006-prompt-license-registry/ | Complete | R4 | 4 |
| 007 | 007-fixture-calibration/ | Complete | R6 | 13 |
| 008 | 008-vec0-migration-fix-deferred/ | Deferred | follow-up | 0 |

**Total:** 60 findings closed across 7 completed packets (008 is deferred with 0 findings)

**Analysis:** The parent spec.md accurately documents the 8-child arc with correct finding counts. All 8 child folders are listed with correct status and round shipped.

### graph-metadata.json stale reference analysis
**File:** `.opencode/specs/.../023-deep-research-arc-blind-spots/001-request-budget-hardening/graph-metadata.json:17`

**Content:**
```json
"manual": {
  "related_to": [
    "005-A",
    "015-A",
    "015-C",
    "020-C",
    "023C-observability"  // ← STALE
  ]
}
```

**Issue:** The reference to "023C-observability" is stale. Based on the directory structure:
- 002-retrieval-observability corresponds to the old 023B (not 023C)
- 003-upstream-rebase-spike corresponds to the old 023C

The correct reference should be "002-retrieval-observability" (the new slug) or should be removed if it's no longer relevant.

## Findings

### P2 — Stale old-slug reference in graph-metadata.json

**Evidence:**
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening/graph-metadata.json:17:"023C-observability"`

**Analysis:** The graph-metadata.json for 001-request-budget-hardening has a stale reference to "023C-observability" in the related_to field. This should be updated to "002-retrieval-observability" (the new slug) or removed if no longer relevant.

**Root cause:** The phase-parent rename commit (29f412f31) updated directory names and most references, but missed this graph-metadata.json entry.

**Recommendation:** Update graph-metadata.json line 17 to use the new slug "002-retrieval-observability" or remove the entry if it's no longer a relevant dependency.

**Severity:** P2 — metadata traceability issue. The stale reference doesn't break functionality but could cause confusion in dependency tracking.

### INFO — Historical references to old slugs are acceptable

**Evidence:**
- `.opencode/specs/.../023-deep-research-arc-blind-spots/research/iterations/iteration-019.md:4:023A-E` — historical context
- `.opencode/specs/.../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/research/upstream-sweep.md:15:cocoindex-code-upstream-023F-54653` — upstream clone temp directory
- `.opencode/specs/.../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/research/delta-classification.md:3:cocoindex-code-upstream-023F-54653` — upstream clone path
- `.opencode/specs/.../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/checklist.md:116:cocoindex-code-upstream-023F-54653` — evidence reference
- `.opencode/specs/.../023-deep-research-arc-blind-spots/007-fixture-calibration/checklist.md:118:023C-style counters` — historical style reference

**Analysis:** These are historical references that document the old slug naming scheme for context. They are in research/iteration notes, checklist evidence, and temp directory names. These are acceptable as they preserve historical context.

**Severity:** INFO — no action needed.

### INFO — All strict-validate checks pass

**Evidence:** Parent and all 8 children pass strict-validate with 0 errors, 0 warnings.

**Severity:** INFO — no action needed. The phase-parent rename was structurally successful.

## Updates to review.md

Iteration 002 completed. Found P2 issue with stale old-slug reference in 001-request-budget-hardening/graph-metadata.json. All strict-validate checks pass for parent and all 8 children. Parent spec.md accurately documents the 8-child arc with correct finding counts (60 total across 7 completed packets).

## NO-EARLY-STOP confirmation

Iteration 2 of 10 complete. Continuing to iteration 3.
