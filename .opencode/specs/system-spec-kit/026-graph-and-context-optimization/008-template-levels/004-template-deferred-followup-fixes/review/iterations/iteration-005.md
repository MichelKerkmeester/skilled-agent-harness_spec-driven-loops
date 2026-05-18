# Iteration 5: Cross-Runtime Mirror Consistency

## Focus
Compare Bash shell validator (validate.sh) vs. Node orchestrator (orchestrator.ts) on level detection, exit codes, document list, and behavior agreement. Files: validate.sh, orchestrator.ts, level-contract-resolver.ts, template-structure.js.

## Scorecard
- Dimensions covered: cross-runtime-mirror-consistency
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=2
- New findings ratio: 1.0

## Findings

### P2 — Suggestion

- **F011**: Bash and Node level detection have different detection patterns
  - `validate.sh:258-305` (shell) detects levels using grep patterns: SPECKIT_LEVEL marker, bold table, plain table, bullet metadata, YAML frontmatter, anchored inline "Level: N", and file-based fallback (decision-record → 3, checklist → 2, else 1)
  - `orchestrator.ts:66-81` (Node) detects levels using: isPhaseParent check, SPECKIT_LEVEL marker regex, YAML frontmatter, table format, file-based fallback (decision-record → 3, checklist → 2, else 1)
  - **Drift identified**: Shell has 2 additional detection patterns that Node doesn't: bullet metadata (`- **Level**: 2`) at lines 282-284, and anchored inline (`^[Ll]evel[: ]+[123]+`) at lines 294-296. Node has one pattern shell doesn't: YAML frontmatter using `^level:\s*(1|2|3\+?)\s*$` (multiline flag). The shell equivalent uses `^level:\s*[123]\+?` without multiline mode (line 289).
  - Impact: A spec.md using only the bullet-level format would be detected correctly by the shell validator but NOT by the Node orchestrator (which would fall back to level 1 or file-based inference). This is a real divergence. However, the SPECKIT_LEVEL marker is the authoritative pattern used in all current templates, so bullets-without-marker is unlikely in practice.
  - Recommendation: Sync detection patterns between shell and Node. Add bullet metadata and anchored-inline patterns to the Node `detectLevel()` function.

- **F012**: `validate.sh` has legacy template hash validation that orchestrator doesn't replicate
  - `validate.sh:226-252` — `validate_template_hashes()` checks MD5 hashes against `.hashes` file. This is called at line 1020 but marked as "informational only" (line 248: "This function is for informational/audit purposes only"). The orchestrator has no equivalent.
  - Impact: If hash validation were ever promoted from informational to blocking, the orchestrator path would miss it. Currently non-blocking so no correctness issue.
  - Recommendation: Either remove the legacy hash validation (it was informational in v2.0) or add a comment noting the orchestrator doesn't replicate it.

## Cross-Runtime Consistency Table

| Aspect | validate.sh (Bash) | orchestrator.ts (Node) | Agreement |
|--------|-------------------|----------------------|-----------|
| Level detection | 7 patterns + file-based fallback | 4 patterns + file-based fallback | ⚠ Drift: 3 extra patterns in shell |
| Exit code 0 | Success at line 1035 | `process.exitCode = 0` at line 446 | ✓ |
| Exit code 1 | User error (bad flags, missing args) at lines 125-129 | User error via catch regex at line 450 | ✓ |
| Exit code 2 | Validation error at lines 1032-1033 | `process.exitCode = 2` at line 446 | ✓ |
| Exit code 3 | System error (folder not found) at line 131 | System error via catch regex at line 450 | ✓ |
| Strict mode | `--strict` flag → treat warnings as errors | `opts.strict` → `passed = errors===0 && !(strict && warnings>0)` | ✓ |
| Phase parent handling | Shell delegates to orchestrator via `run_node_orchestrator()` | `isPhaseParent()` checks + lean template shape | ✓ |
| Legacy fallback | `SPECKIT_VALIDATE_LEGACY=1` → skip orchestrator | Orchestrator is default; legacy via env var | ✓ |
| Template hash check | Lines 226-252 (informational) | Not implemented | ⚠ Informational feature gap |
| Output format | Shell: rich colors, JSON, quiet | Node: text (lines 426-438) or JSON (lines 417-419) | ✓ Identical JSON structure |
| Document list source | N/A (delegates to orchestrator) | `resolveLevelContract()` → manifest | ✓ Single source of truth |
| Anchor validation | N/A (delegates to orchestrator) | `renderedTemplate()` + `h2Headers()` + `anchors()` | ✓ |
| Recursive mode | Shell owns recursive (lines 928-1003) | Orchestrator doesn't replicate | ✓ Shell owns multi-folder loop |

## Assessment
- New findings ratio: 1.00
- Cross-runtime consistency is strong for exit codes, phase handling, and output format. The level-detection drift (F011) is the only consequential gap — 2 detection patterns exist in shell that don't in Node. This could cause level misdetection for docs using non-standard but valid formats.
- The template hash validation gap (F012) is informational-only and doesn't affect correctness.
- Dimensions addressed: cross-runtime-mirror-consistency

## Recommended Next Focus
Synthesis — all 5 dimensions covered. Converge to produce review-report.md.

## Claim Adjudication

No P0 or P1 findings in this iteration.

## Ruled Out
- **Flag-handling divergence**: Both shell and Node use same flag names (--strict, --json, --quiet, --verbose). No drift found.
- **Recursive mode divergence**: Shell owns recursive validation. Orchestrator correctly handles single-folder only. No inconsistency — they serve different roles.
