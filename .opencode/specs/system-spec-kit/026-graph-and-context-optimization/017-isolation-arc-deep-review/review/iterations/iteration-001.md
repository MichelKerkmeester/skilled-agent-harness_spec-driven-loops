# Iteration 001: Research Output + Phase 1 Skill-Advisor Isolation

**Date**: 2026-05-15T12:46:00Z
**Commits**: 6fd5934f6, ff526411f
**Focus**: Per-commit review of research foundation and Phase 1 pilot implementation
**Findings Count**: 2 (P1: 1, P2: 1)

---

## Commit 6fd5934f6: docs(026/015) - Deep-Research Output

### Scope
- Created packet 015-extracted-skills-isolation with research artifacts
- 10 files, 1379 insertions (research.md, 6 iterations, config, state, strategy)
- 10-iter deep-research via cli-opencode + deepseek-v4-pro

### Claims Verification

**Claim 1**: system-skill-advisor has ZERO TypeScript imports in spec-kit source
- **Evidence**: research.md §1.2 states "ZERO direct TS imports"
- **Verification**: `grep -rEln "^import.*system-skill-advisor" .opencode/skills/system-spec-kit/mcp_server/ --include="*.ts"` would confirm
- **Status**: PLAUSIBLE - research methodology appears sound (grep-based discovery)

**Claim 2**: system-code-graph has 14 files × 28 sites of imports
- **Evidence**: research.md §1.1 provides detailed table with file:line citations
- **Verification**: Table shows specific files and line numbers
- **Status**: WELL-SUPPORTED - detailed mapping with line numbers

**Claim 3**: Recommended Strategy C (Hybrid) at 31h
- **Evidence**: research.md §2 strategy evaluation table, §3 recommendation
- **Status**: REASONABLE - trade-off analysis provided with risk register

### Findings

**P2-FINDING-001**: Research methodology not independently verified
- **Dimension**: Correctness
- **File**: `.opencode/specs/.../015-extracted-skills-isolation/research/research.md`
- **Evidence**: Research relies on grep patterns; no independent audit of import map accuracy
- **Recommendation**: Defer verification to Phase 1 implementation (which would fail if research was wrong). Since Phase 1 succeeded (see commit ff526411f), research was likely correct.

---

## Commit ff526411f: refactor(026/016) - Phase 1 Skill-Advisor Isolation

### Scope
- Removed system-skill-advisor from spec-kit tsconfig.json include
- Removed skill-advisor from vitest.config.ts and vitest.stress.config.ts
- Moved 11 files to system-skill-advisor (4 feature_catalog, 3 playbook, 1 test, 3 stress)
- Created 016 packet with spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md

### Claims Verification

**Claim 1**: tsconfig.json has zero system-skill-advisor references
- **Evidence**: Commit message states "4 lines removed, 0 broken"
- **Verification**: Check actual diff
- **Status**: NEEDS VERIFICATION - will verify in next iteration

**Claim 2**: tsc --noEmit passes with no new errors
- **Evidence**: Commit message: "pre-existing-errors-only (no new errors from this work)"
- **Status**: PLAUSIBLE - if skill-advisor had zero imports, removal should not break compilation

**Claim 3**: Residue grep returns 0 hits
- **Evidence**: Commit message: "residue grep: 0 hits for `system-skill-advisor` in spec-kit configs"
- **Status**: NEEDS VERIFICATION - will verify in next iteration

### Findings

**P1-FINDING-001**: Verification claims not independently audited
- **Dimension**: Correctness
- **File**: `.opencode/specs/.../016-skill-advisor-isolation-phase1/spec.md`
- **Lines**: REQ-001 through REQ-010
- **Evidence**: Spec claims acceptance criteria met (tsc passes, vitest passes, residue grep returns 0) but no verification artifacts (CI logs, test output screenshots) provided in commit
- **Recommendation**: Verify claims by running:
  ```bash
  cd .opencode/skills/system-spec-kit/mcp_server
  grep "system-skill-advisor" tsconfig.json vitest.config.ts vitest.stress.config.ts
  npx tsc --noEmit
  ```
  If verification fails, this becomes a P0 finding.

**P2-FINDING-002**: 016 packet strict-validate fails with template-anchor errors
- **Dimension**: Maintainability
- **File**: Commit message for ff526411f
- **Evidence**: "Strict-validate fails 2 errors (template-anchor shape) — informational, not functional"
- **Recommendation**: This is a known pattern (same as deep-review, deep-research packets). Accept as informational but track for template cleanup in future work.

---

## Traceability Check

**Spec-doc continuity**: 015 research → 016 implementation
- 016 spec.md §3 explicitly references 015 research.md §3 Recommendation, §4 Packet 1
- 016 implementation-summary.md should cite 015 research
- **Status**: APPEARS CONSISTENT - explicit parent-child relationship documented

---

## Security Assessment

**No security-relevant changes** in these commits:
- Commit 6fd5934f6: Documentation only
- Commit ff526411f: Build config changes + file moves (no code changes)
- **Status**: PASS - no attack surface introduced

---

## Maintainability Assessment

**Positive signals**:
- Clear commit messages with detailed scope
- Packet documentation (spec.md, plan.md, tasks.md) created
- Verification steps documented in spec

**Concerns**:
- No independent verification of claims (see P1-FINDING-001)
- Template-anchor validation errors (P2-FINDING-002) suggest documentation debt

---

## Next Steps

Iteration-002 will:
1. Verify P1-FINDING-001 by running actual verification commands
2. Review commits 276c1a930 (docs/readme) and 125976a9a (Phase 2+3 hybrid)
3. Begin architectural adversarial pass on Phase 2+3 changes
