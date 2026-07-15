---
round: 1
seat: "seat-003"
executor: "cli-opencode"
lens: "Pragmatic"
vantage: "opencode-go/deepseek-v4-pro max"
status: "ok"
timestamp: "2026-05-24T10:06:00Z"
simulated: false
confidence: 88
---

# Seat 003: Preservation and Regression Pragmatist

## Proposed Plan

**ACCEPT AS-IS**. The work is scope-safe, well-validated, and preserves backward compatibility. No link breakage risk, no runtime behavior changed, no overreach into implementation territory. The validation battery is comprehensive (19 files extracted, 16 references validated, skill/readme validated, quick_validate passed, stale paths checked, link resolver passed, strict spec validation passed). Two minor advisory notes for future maintenance.

## Reasoning

1. **Scope safety confirmed**: I verified against spec.md §3 (Out of Scope) that no runtime files were changed. The checklist confirms: "No runtime behavior changed. No schema, script, command, handler, parser, or database implementation changed." Changed surfaces are exclusively markdown documentation and packet spec files.

2. **Link breakage mitigated**: Every old root kebab-case path has a corresponding compatibility stub. I verified the mapping for all 8 pairs:
   - `tool-surface` → `runtime/tool_surface.md` ✓
   - `readiness-and-scope-fingerprint` → `readiness/readiness_and_scope_fingerprint.md` ✓
   - `code-graph-readiness-check` → `readiness/code_graph_readiness_check.md` ✓
   - `ccc-bridge-integration` → `integrations/ccc_bridge_integration.md` ✓
   - `database-path-policy` → `config/database_path_policy.md` ✓
   - `naming-conventions` → `runtime/naming_conventions.md` ✓
   - `ownership-boundary` → `runtime/ownership_boundary.md` ✓
   - `launcher-lease` → `runtime/launcher_lease.md` ✓

3. **Cross-reference integrity**: Spot-checked relative links within canonical files. `tool_surface.md` §5 links to `../readiness/readiness_and_scope_fingerprint.md` (correct: up from `runtime/` to `readiness/`). `readiness_and_scope_fingerprint.md` §6 links to `code_graph_readiness_check.md` (correct: same directory) and `../runtime/tool_surface.md` (correct: up to `runtime/`).

4. **Validation completeness**: 22 P0 items all verified, 22 P1 items all verified. The validation covers structural extraction, blocking reference validation, skill validation, readme validation, package-level quick validation, stale-path grepping, H2 numbering, markdown link resolution, and strict spec validation. This is a thorough battery for a docs-only change.

5. **Validation gap (minor)**: The evidence doesn't include a positive assertion check like "for every canonical path in RESOURCE_MAP, verify the file exists." However, three tools independently confirm file existence: `extract_structure.py` (ran on all 19 files and passed), `validate_document.py` (ran on all 16 reference files and passed), and `quick_validate.py` (ran on the skill package and returned valid). These collectively verify that canonical files exist and are well-formed.

6. **Decision record quality**: ADR-001 and ADR-002 are well-structured with alternatives tables, five-checks evaluation, and implementation/rollback procedures. The decisions (foldered canonical refs + stubs; canonical-only router) are defensible and well-documented.

## Risks & Trade-offs

- **Risk**: A future maintainer edits a stub instead of the canonical file. Severity: LOW. Mitigation: stubs are clearly labeled as compatibility pointers; RESOURCE_MAP targets canonical only; README/ARCHITECTURE link to canonical.
- **Risk**: The router pseudocode `_guard_in_skill()` is documentation, not runtime code. Severity: LOW. Mitigation: agents reading SKILL.md are expected to follow the contract; the guard pattern is simple enough to implement correctly.
- **Trade-off**: Adding `_guard_resource_map()` check to pseudocode would close the enforcement gap but adds complexity to what is intentionally a documentation contract.

## Assumptions and Evidence Gaps

- **Assumption**: `quick_validate.py` validates reference file existence as part of its package check. Supported by: the tool returned `"valid": true` on the entire skill.
- **Gap**: No automated CI check preventing future RESOURCE_MAP entries from being root stub paths. Severity: LOW — would be caught in PR review.

## Alternative Challenged

**Alternative**: "Require an automated CI lint for RESOURCE_MAP values." This would close the enforcement gap but is overkill for a documentation-only change where the existing contract (documented anti-pattern + PR review) provides adequate protection.

## Confidence

**88/100**: The evidence of correctness and scope safety is overwhelming. Deducted 12 points for two minor concerns: (a) the RESOURCE_MAP enforcement gap is a maintenance surface with no automated guard, and (b) not all 8 canonical files were read line-by-line (trusted validators for 6 of 8). Both concerns are low-severity.

## Scoring (Self)

| Dimension | Score | Notes |
|-----------|-------|-------|
| Correctness | 27/30 | All requirements met |
| Completeness | 18/20 | Thorough validation; minor gap noted |
| Elegance | 14/15 | Clean stub pattern, well-organized |
| Robustness | 18/20 | Link breakage fully mitigated |
| Integration | 15/15 | Seamless fit with existing patterns |
| **Total** | **92/100** | |
