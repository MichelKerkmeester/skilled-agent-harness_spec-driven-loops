# Deep Review Report — README Migration Audit (deepseek-flash lineage)

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false (verdict is CONDITIONAL, not PASS)
- **Active findings:** P0=0, P1=5, P2=15 (20 total, F001-F020)
- **Scope:** Every non-worktree README.md (incl. root) plus representative code, audited for staleness after the specs-root topology flip (`specs/` canonical, `.opencode/specs -> ../specs` compat symlink). 10 iterations, 4 dimensions + broadened angles, max-iterations stop policy.
- **Convergence reason:** maxIterationsReached (stopPolicy=max-iterations); convergence telemetry showed declining yield (iterations 5-9 returned 0 new findings each).

## 2. Planning Trigger

**`/speckit:plan` IS required.** Verdict CONDITIONAL with 5 active P1 findings that must be fixed or explicitly deferred before release-readiness. A changelog is not appropriate until P1s are resolved.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": 20,
  "remediationWorkstreams": [
    { "id": "WS-1", "name": "Canonicalize operator-facing README roots", "findings": ["F001", "F018"], "severity": "P1" },
    { "id": "WS-2", "name": "Fix doc-vs-code contradiction (config resolution order)", "findings": ["F002"], "severity": "P1" },
    { "id": "WS-3", "name": "Re-point integrity guard + drift-marker to canonical root", "findings": ["F013", "F017"], "severity": "P1" },
    { "id": "WS-4", "name": "Resolve dual-executor requirement gap", "findings": ["F014"], "severity": "P1" },
    { "id": "WS-5", "name": "Canonicalize remaining pointer/usages and reconcile spec claims", "findings": ["F003","F004","F005","F006","F007","F008","F009","F010","F011","F012","F015","F016","F019","F020"], "severity": "P2" }
  ],
  "specSeed": ["specs/system-speckit/032-relocate-specs-folder/005-readme-migration-audit/spec.md:124 REQ-003 needs an amend or evidence-based acceptance"],
  "planSeed": ["Re-point drift-marker pathspec and add regression test", "Re-point check-no-spec-imports SPECS_ROOT and update bin/README invariant", "Canonicalize system-spec-kit README examples to specs/"],
  "findingClasses": ["doc-topology-staleness", "doc-vs-code-contradiction", "integrity-guard-coverage-gap", "functional-blind-spot", "spec-requirement-gap", "evidence-reproducibility", "cross-reference-drift", "doc-family-inconsistency", "negative-baseline", "historical-vs-live-boundary"],
  "affectedSurfacesSeed": ["system-spec-kit README family", "bin/ guard family", "git-hooks drift-marker family", "spec.md REQ-003", "root README"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### P1 (5)

| ID | Severity | Title | Dimension | Evidence | First/Last |
|----|----------|-------|-----------|----------|-----------|
| F001 | P1 | system-spec-kit README teaches `.opencode/specs` as canonical root | correctness | `.opencode/skills/system-spec-kit/README.md:846` (`| .opencode/specs/ | all spec folders created by Spec Kit |`), also `:128,661-663,701-702,748` | 1/10 |
| F002 | P1 | core/README config resolution order contradicts shipped code | correctness | `.opencode/skills/system-spec-kit/scripts/core/README.md:142` vs `config.ts:321-326` (`['specs', '.opencode/specs']`) | 1/10 |
| F013 | P1 | check-no-spec-imports guard scoped to legacy alias; canonical imports undetected | security | `.opencode/bin/check-no-spec-imports.cjs:26` (`SPECS_ROOT=.opencode/specs`); verified canonical-root import resolves outside `underSpecs()` | 2/10 |
| F014 | P1 | REQ-003 dual-executor requirement unsatisfiable (glm-high failed) | traceability | `spec.md:124` vs `review/orchestration-status.log:3` (glm-high exited 1, terminal/fatal) | 3/10 |
| F017 | P1 | drift-marker git pathspec blind spot post-flip (upgrades F009) | maintainability | `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh:16`; `.opencode/specs` is symlink blob (120000); diff-tree pathspec 0 vs 23 changes | 4/10 |

### P2 (15)

| ID | Severity | Title | Dimension | Evidence | First/Last |
|----|----------|-------|-----------|----------|-----------|
| F003 | P2 | sweep README inverts legacy labels | correctness | `scripts/sweep/README.md:12` | 1/10 |
| F004 | P2 | KPI README teaches args relative to `.opencode/specs/` | correctness | `scripts/kpi/README.md:67` | 1/10 |
| F005 | P2 | MCP README + benchmarks teach spec-doc scope/authority under legacy root | correctness | `mcp-server/README.md:109`, `mcp-server/benchmarks/README.md:3,49-51,68,146-147` | 1/10 |
| F006 | P2 | sk-design-md-generator READMEs teach `--output .opencode/specs/<track>/<packet>/output` | correctness | `sk-design-md-generator/README.md:80,91,156`, `backend/README.md:52,55,58,122,126,130,131` | 1/10 |
| F007 | P2 | sk-create-benchmark shared README points audit trail to legacy root | correctness | `sk-create-benchmark/references/shared/README.md:23` | 1/10 |
| F008 | P2 | bin/lib README teaches authored-program under legacy root | correctness | `bin/lib/README.md:58` | 1/10 |
| F009 | P2 | git-hooks + drift-marker READMEs describe watch logic on legacy root (superseded by F017 P1) | correctness | `scripts/git-hooks/lib/README.md:28,37`, `scripts/git-hooks/README.md:27,108`, `scripts/git-hooks/README.md:3,18` | 1/10 |
| F010 | P2 | root README RELATED DOCUMENTS link uses legacy alias (REQ-001 target) | correctness | `README.md:1303` | 1/10 |
| F011 | P2 | deep-alignment/styles/mcp-hooks/migrations READMEs use legacy packet pointers | correctness | `deep-alignment/assets/conformance-benchmark/README.md:34,66`, `styles/scripts/README.md:112`, `mcp-server/hooks/cursor/README.md:71`, `mcp-server/hooks/devin/README.md:62,63`, `mcp-server/database/migrations/README.md:139` | 1/10 |
| F012 | P2 | command help files teach legacy root (out of strict README.md scope) | correctness | `commands/create/README.txt:160`, `commands/memory/README.txt:323` | 1/10 |
| F015 | P2 | census numbers not exactly reproducible | traceability | `spec.md:78,94,145,155`, `tasks.md:50` (753/742/22 vs measured 870/740/21) | 3/10 |
| F016 | P2 | spec.md cross-ref claim "plan.md names the exact command" unmet | traceability | `spec.md:105` (plan.md has no census command) | 3/10 |
| F018 | P2 | system-spec-kit doc family root inconsistency | maintainability | `system-spec-kit/README.md:846` vs `templates/README.md:69,180,202,237` | 4/10 |
| F019 | P2 | No live README describes `.opencode/specs` as the compat symlink | correctness | repo-wide scan; only `z_archive/.../README.md:11,28` mention alias roots | 5/10 |
| F020 | P2 | 026 prompts README carries live-command legacy usage in closed packet | traceability | `specs/system-speckit/026-.../003-continuity-refactor-gates/prompts/README.md:51` (12 hits) | 6/10 |

## 4. Remediation Workstreams

1. **WS-1 — Canonicalize operator-facing README roots (P1):** F001, F018. Rewrite `system-spec-kit/README.md` usage examples and Project-Level References to `specs/`, note `.opencode/specs` as compat symlink.
2. **WS-2 — Fix doc-vs-code contradiction (P1):** F002. Correct `scripts/core/README.md:142` to "(`specs` before legacy `.opencode/specs`, with legacy read fallback)".
3. **WS-3 — Re-point integrity guard + drift-marker to canonical root (P1):** F013, F017. Change `check-no-spec-imports.cjs` `SPECS_ROOT` and `memory-drift-marker.sh` pathspec to `specs/` (or dual-root), update bin/README invariant, add regression test proving pathspec parity.
4. **WS-4 — Resolve dual-executor requirement gap (P1):** F014. Re-run glm-high lane or amend REQ-003 acceptance with evidence of the terminal failure.
5. **WS-5 — Canonicalize remaining usages + reconcile spec claims (P2):** F003-F012, F015, F016, F019, F020. Batch canonicalization of pointer/usages; add reproducible census command to plan.md; standardize canonical/symlink note.

## 5. Spec Seed

- `spec.md` REQ-003 (line 124): amend acceptance to account for the observed glm-high terminal failure, or re-scope to a single-executor run with documented evidence.
- `spec.md` §3 Files to Change (line 105): add the exact census command or drop the "plan.md names the exact command" claim (F016).
- `spec.md` §3 (lines 78, 94, 145, 155): replace the 22-file census claim with the reproducible command + measured counts (F015).

## 6. Plan Seed

1. Fix `memory-drift-marker.sh:16` pathspec to canonical `specs/`; add a parity regression (`git diff-tree` on both pathspecs must return identical sets). (F017)
2. Fix `check-no-spec-imports.cjs:26` `SPECS_ROOT`; update `bin/README.md:28` invariant text. (F013)
3. Canonicalize `system-spec-kit/README.md` (F001, F018) and the remaining pointer/usages in F003-F012.
4. Correct `scripts/core/README.md:142`. (F002)
5. Re-run the glm-high lineage or amend REQ-003 acceptance with the terminal-failure evidence. (F014)

## 7. Traceability Status

**Core protocols:**
| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | fail | hard | README topology claims contradict shipped layout across F001-F020; guard/drift-marker scoped to legacy root |
| checklist_evidence | notApplicable | hard | No checklist.md (Level 1 packet) |

**Overlay protocols:** all notApplicable (target is a spec-folder; no skill/agent/playbook/feature-catalog surfaces in scope).

**AC_COVERAGE:** exempt (Level 1 folder; no checklist.md).

## 8. Deferred Items

- F012 (command help `README.txt`): outside strict README.md boundary — defer to a follow-up doc-consistency pass.
- F020 (026 prompts README, closed packet): leave historical; migration owner decides whether archived prompt templates should be canonicalized.
- F009 (P2 doc component) is superseded by F017 (P1 functional) but retained for the README-correctness fix list.
- The `specs/**` historical READMEs remain out of scope per spec.md §3.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).*

## 10. Audit Appendix

### Iteration table

| # | Focus | New P0/P1/P2 | Ratio | Status |
|---|-------|--------------|-------|--------|
| 1 | D1 Correctness | 0/2/10 | 1.0 | complete |
| 2 | D2 Security | 0/1/0 | 1.0 | complete |
| 3 | D3 Traceability | 0/1/2 | 1.0 | complete |
| 4 | D4 Maintainability | 0/1/1 | 1.0 | complete |
| 5 | Symlink-correctness baseline | 0/0/1 | 0.0 | complete |
| 6 | Historical classification + root split | 0/0/1 | 0.0 | complete |
| 7 | Hit-file completeness sweep | 0/0/0 | 0.0 | complete |
| 8 | Canonicalization-target feasibility | 0/0/0 | 0.0 | complete |
| 9 | Topology-drift variant scan | 0/0/0 | 0.0 | complete |
| 10 | Adversarial P0/P1 replay | 0/0/0 | 0.0 | complete |

### Convergence signal replay

- Stop reason: `maxIterationsReached` (stopPolicy=max-iterations). Iterations 5-9 returned 0 new findings each (rolling yield at noise floor), confirming the literal-hit surface is saturated; adversarial replay in iteration 10 confirmed no severity changes.
- Dimension coverage: 4/4.
- Convergence score (reducer): 1.0.

### Coverage matrix

- Files reviewed: 21 literal-hit README.md + root README + 6 code/state files + 6 historical classification checks.
- All 21 hit files map to F001-F020 or an explicit ruled-out (durability-leak fixture).

### Ruled-out claims

- Secrets exposure: none (placeholder keys only).
- Deep relative links (cursor/devin hooks): resolve correctly via symlink.
- Root README directory trees: already canonical.
- scripts/config, scripts/graph, scripts READMEs: canonical forms.

### Adversarial self-check

- 5/5 P1 findings re-read at cited evidence; all confirmed (F001 README:846, F002 README:142 vs config.ts:321, F013 SPECS_ROOT:26, F014 REQ-003 vs orchestration log, F017 pathspec asymmetry 0 vs 23).
- No P0 hidden; no P1 downgrade justified; no downgradeTrigger conditions currently satisfied.
