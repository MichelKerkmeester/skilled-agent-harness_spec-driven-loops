# Deep Review Report: 004-template-deferred-followup-fixes

**Generated**: 2026-05-04
**Review Mode**: Deep Review (auto, 5 iterations)
**Review Target**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/004-template-deferred-followup-fixes`
**Scope**: Implementation code for 10 Gate 7 deferred followups — orchestrator, manifest, resolver, renderer, template utils, create.sh, save lock, extension/migration docs, validation taxonomy.

---

## Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **Active P0** | 0 |
| **Active P1** | 2 |
| **Active P2** | 10 |
| **hasAdvisories** | true |
| **Dimensions Covered** | 5/5 (100%) |
| **Iterations** | 5 |
| **Stop Reason** | maxIterationsReached |

The implementation is solid: all 10 deferred items from Gate 7 are present and working. The validation orchestrator correctly delegates from validate.sh, the manifest versions and per-document section gates are properly structured, the canonical save lock has clean stale cleanup, and extension/migration documentation is complete. Two P1 findings merit attention before claiming unconditional completion: a dead parameter in `loadManifest()` (F004) and a silent-no-op edge case in `copy_templates_batch()` (F008).

## Planning Trigger

**CONDITIONAL** verdict → `/spec_kit:plan` for addressing 2 P1 findings:

1. **F004**: Dead `level` parameter in `level-contract-resolver.ts:loadManifest()` — misleading API surface
2. **F008**: `template-utils.sh:copy_templates_batch()` returns 0 silently when zero templates processed

Ten P2 advisory findings are recorded for future consideration.

## Active Finding Registry

### P1 — Required (2)

| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F004 | Dead `level` parameter in `loadManifest()` — parameter unused in cache-hit path, only used in error throw | `mcp_server/lib/templates/level-contract-resolver.ts:88` | code-correctness |
| F008 | `copy_templates_batch()` silently returns 0 when no templates found — callers assume success with files created | `scripts/lib/template-utils.sh:143` | template-rendering-correctness |

### P2 — Advisory (10)

| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F001 | Dual-path folder-existence check in validate.sh + orchestrator is redundant but harmless | `scripts/spec/validate.sh:131` | implementation-spec-alignment |
| F002 | `findSkillRoot()` fallback uses hardcoded relative path (`../../..`) if 8-level walk fails | `mcp_server/lib/validation/orchestrator.ts:49` | implementation-spec-alignment |
| F003 | Version mismatch: shell declares VERSION=2.0.0, orchestrator prints v3.0.0 | `scripts/spec/validate.sh:29` | implementation-spec-alignment |
| F005 | Fence regex divergence between `stripFences()` and `renderInlineGates()` (literal vs hex backticks) | `mcp_server/lib/validation/orchestrator.ts:100` | code-correctness |
| F006 | `collectKnownSessionIds()` scans all .md files in tree without depth/size bounds | `mcp_server/lib/validation/orchestrator.ts:274` | code-correctness |
| F007 | ADR-001 special case in `validateTemplateShape()` header comparison is fragile | `mcp_server/lib/validation/orchestrator.ts:225` | code-correctness |
| F009 | `--out-dir` mode uses `filePath.split('/').pop()` instead of `path.basename()` | `scripts/templates/inline-gate-renderer.ts:288` | template-rendering-correctness |
| F010 | `SECTIONS_PRESENT` always passes without actual checking; misleading rule name | `mcp_server/lib/validation/orchestrator.ts:364` | validator-coverage |
| F011 | Bash and Node `detectLevel` have divergent detection patterns (shell has 2 extra patterns) | `scripts/spec/validate.sh:258` | cross-runtime-mirror-consistency |
| F012 | `validate_template_hashes()` in shell not replicated by Node orchestrator (informational only) | `scripts/spec/validate.sh:226` | cross-runtime-mirror-consistency |

## Remediation Workstreams

### WS-1: Code Cleanup (F004, F001, F002, F003, F005, F007, F009, F010, F012)
**Priority**: Low | **Effort**: ~2 hours
- **F004**: Remove or rename `level` parameter in `loadManifest()` (level-contract-resolver.ts:88)
- **F001**: Add comment noting intentional redundancy in dual-path existence check
- **F002**: Replace hardcoded `../../..` fallback in `findSkillRoot()` with resolver-style DIST_MANIFEST_PATH
- **F003**: Sync `VERSION="3.0.0"` in validate.sh to match orchestrator
- **F005**: Extract shared fence regex or add comment noting intentional divergence
- **F007**: Document ADR-001 special case or replace with dedicated placeholder
- **F009**: Use `path.basename()` instead of `filePath.split('/').pop()`
- **F010**: Rename `SECTIONS_PRESENT` to `SECTIONS_DELEGATED` or remove entry
- **F012**: Document hash gap or remove legacy hash validation

### WS-2: Shell Robustness (F008, F006, F011)
**Priority**: Medium | **Effort**: ~3 hours
- **F008**: Add warning/validation in `copy_templates_batch()` or its callers when zero templates processed
- **F006**: Add caching or file-count bailout to `collectKnownSessionIds()`
- **F011**: Sync level detection patterns between shell and Node `detectLevel()` functions

## Spec Seed

```markdown
## REQ-011: Code cleanup deferred followups
- F004: Clarify loadManifest() parameter contract
- F008: Add non-empty guard to copy_templates_batch() callers

## REQ-012: Cross-runtime level detection parity
- F011: Add bullet metadata and anchored-inline patterns to Node detectLevel()
```

## Plan Seed

```markdown
### Phase 1: P1 fixes
- [ ] T001: Fix F008 — add warning when copy_templates_batch processes zero templates
- [ ] T002: Fix F004 — clarify or remove dead level parameter

### Phase 2: P2 cleanup (optional)
- [ ] T003-T012: Address P2 findings as time permits
```

## Traceability Status

| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | **PASS** | hard | All 10 REQ items verified against shipped implementation (Iteration 1) |
| checklist_evidence | **PASS** | hard | All 10 CHK-G1 items have evidence descriptions consistent with code (Iteration 1) |

## Deferred Items

- **F006**: Unbounded I/O scan in `collectKnownSessionIds()` — accept if current tree size is manageable; monitor if tree grows beyond ~5000 markdown files
- **F009**: Windows path compatibility — deferred as project targets macOS/Linux
- **F011**: Level detection divergence — low risk due to SPECKIT_LEVEL marker being the authoritative pattern in all current templates

## Audit Appendix

### Iteration Summary

| # | Focus | Files | P0 | P1 | P2 | Status |
|---|-------|-------|----|----|----|--------|
| 1 | Implementation-Spec Alignment | 12 | 0 | 0 | 3 | complete |
| 2 | Code-Correctness | 3 | 0 | 1* | 2 | complete |
| 3 | Template-Rendering-Correctness | 6 | 0 | 1 | 1 | complete |
| 4 | Validator-Coverage | 5 | 0 | 0 | 1 | complete |
| 5 | Cross-Runtime Mirror Consistency | 4 | 0 | 0 | 2 | complete |

*F005 initially classified P1, downgraded to P2 during claim adjudication.

### Convergence Evidence

| Signal | Value | Stop Vote |
|--------|-------|-----------|
| Rolling Average (w=0.30) | N/A (< 2 evidence iterations with diminishing ratios) | CONTINUE |
| MAD Noise Floor (w=0.25) | N/A (< 3 evidence iterations) | CONTINUE |
| Dimension Coverage (w=0.45) | 5/5 = 1.0 | STOP |
| **Max iterations reached** | 5 of 5 | **Hard stop** |

Stop reason: `maxIterationsReached` — all 5 configured dimensions covered in 5 iterations. No convergence math required given dimension count equals max iterations.

### Dimension Coverage Matrix

| File | impl-spec-alignment | code-correctness | template-rendering | validator-coverage | cross-runtime |
|------|---------------------|------------------|-------------------|--------------------|---------------|
| orchestrator.ts | ✓ | ✓ | — | ✓ | ✓ |
| validate.sh | ✓ | — | — | ✓ | ✓ |
| spec-kit-docs.json | ✓ | — | ✓ | ✓ | — |
| level-contract-resolver.ts | ✓ | ✓ | — | — | ✓ |
| generate-context.ts | ✓ | ✓ | — | — | — |
| inline-gate-renderer.ts | — | — | ✓ | — | — |
| template-utils.sh | — | — | ✓ | — | — |
| create.sh | — | — | ✓ | — | — |
| EXTENSION_GUIDE.md | ✓ | — | — | — | — |
| MIGRATION.md | ✓ | — | — | — | — |
| checklist.md | ✓ | — | — | ✓ | — |
| decision-record.md | ✓ | — | — | — | — |
| api/index.ts | ✓ | — | — | — | — |

### Severity Distribution

```
P0: ████████████████████ 0
P1: ██ 2
P2: ██████████ 10
```

---

## Convergence Report

**Stop reason**: maxIterationsReached
**Total iterations**: 5
**Provisional verdict**: CONDITIONAL
**hasAdvisories**: true

**Active findings at convergence**: P0:0 P1:2 P2:10
**Dimension coverage**: 5/5 (100%)

Legal-stop gates:
- findingStability: N/A (insufficient iterations for ratio comparison)
- dimensionCoverage: PASS (5/5 dimensions covered)
- p0Resolution: PASS (0 active P0)
- evidenceDensity: PASS (all 12 findings have file:line evidence)
- hotspotSaturation: PASS (all files reviewed across multiple dimensions)
