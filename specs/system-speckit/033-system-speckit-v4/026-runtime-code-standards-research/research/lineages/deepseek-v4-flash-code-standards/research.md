# Deep Research Synthesis — system-spec-kit Code Standards Deviation Inventory

**Lineage:** deepseek-v4-flash-code-standards
**Session:** fanout-deepseek-v4-flash-code-standards-1788681805423-i4djf6
**Generation:** 1 | **Loop type:** research | **Iterations:** 10 (max-iterations reached)
**Stop reason:** `maxIterationsReached`

---

## 1. Background

This is a read-only, evidence-based audit of `.opencode/skills/system-spec-kit/shared/**` and `.opencode/skills/system-spec-kit/runtime/**` (excluding `node_modules/` and `dist/`) against this repo's code standards. The audit covers 529 `.ts`, 42 `.cjs`, 46 `.mjs`, 78 `.sh`, 2 `.py`, and 103 `.json` files in scope. The controlling standards are the universal P0/P1/P2 model (`shared/references/universal/code-quality-standards.md`), the TypeScript and Shell standards under `sk-code-opencode/references/`, and the shared code-organization conventions.

## 2. Research Topics / Angles

The audit rotated one focus angle per iteration across 10 iterations, with angles 1 and 2 repeated on deeper sub-surfaces:

1. Header / section-banner conformance (Iterations 1, 9)
2. Helpers duplicating `@spec-kit/shared` or `runtime/lib` exports (Iterations 2, 10)
3. Error handling and the 0/1/2/3 exit-code contract (Iteration 3)
4. Module-boundary integrity (Iteration 4)
5. Dead/retired code (Iteration 5)
6. Naming and structure (Iteration 6)
7. Coverage gaps per public surface (Iteration 7)
8. Shell hygiene (Iteration 8)

## 3. Key Questions

1. Header/section-banner conformance
2. Helper duplication vs `@spec-kit/shared`
3. Error-handling and exit-code contract
4. Module-boundary integrity
5. Dead or retired code
6. Naming and structure consistency
7. Coverage gaps per public surface
8. Shell hygiene

All eight resolved (see Eliminated Alternatives and Findings).

## 4. Summary of Findings

18 citations across 10 iterations, split by severity:

- **P1 (7):** F1.1, F2.1, F3.1, F5.1, F7.1, F7.2, F9.1, F10.1
- **P2 (11):** F1.2, F2.2, F4.3, F5.2, F5.3, F6.1, F6.2, F8.1, F8.2, F9.2, F10.3

The audit also established four *conforming* baselines (not findings): TS module-header coverage is clean across `shared/`, `runtime/lib`, `runtime/cli`, `runtime/api`, `runtime/hooks`; module boundaries hold (no dist/lib/cli/shared→runtime break); shell strict-mode and quoting are clean across non-test `runtime/cli`; and the `api/` barrel is a well-guarded re-export layer.

## 5. Findings (by angle)

### Angle 1 — Header / section-banner conformance

- **F1.1 [P1]** Shell header-tag divergence: `runtime/cli/rules/*.sh` uses `# RULE:` (27/78 scripts) instead of the documented `# COMPONENT:`/`# SPECKIT:` — `runtime/cli/rules/check-files.sh:3`. Standard: `sk-code-opencode/references/shell/style-guide/overview-structure-and-naming.md` §2 File Header. **Fix: judgment-required** — adopt `# COMPONENT:` uniformly or document `# RULE:` as a sanctioned rule-family tag.
- **F1.2 [P2]** `# SPEC-KIT:` hyphen variant — `runtime/cli/spec/recommend-level.sh:3` vs documented `# SPECKIT:`. Standard: same §2. **Fix: mechanical** — normalize to `# SPECKIT:`.
- **F9.2 [P2]** Cross-language header-tag vocabulary is not uniform (`# SCRIPT:` in `runtime/cli/retrieval/generate-trigger-index.mjs:3` etc. is not in either documented standard). **Fix: judgment-required** — document `# SCRIPT:` for `.mjs` or align.

### Angle 2 — Helper duplication vs `@spec-kit/shared`

- **F2.1 [P1]** Parallel frontmatter parser — `runtime/cli/lib/frontmatter-migration.ts:386,473,606` (`detectFrontmatter`, `parseFrontmatterSections`, `parseSectionValue`) does not reuse `@spec-kit/shared/frontmatter/parse-frontmatter`. Standard: `shared/code-organization/imports-and-exports.md` §1. **Fix: judgment-required** — delegate the fence split to the shared parser, keep only the migration-specific classifier.
- **F2.2 [P2]** Redundant barrel — `runtime/cli/utils/memory-frontmatter.ts` re-exports `../lib/memory-frontmatter.js`. Standard: `imports-and-exports.md` §3. **Fix: mechanical** — one import path.
- **F10.1 [P1]** Four distinct `findRepoRoot` implementations coexist — `runtime/cli/retrieval/generate-trigger-index.mjs:80`, `runtime/cli/retrieval/retrofit-convention.mjs:1055`, `runtime/hooks/lib/workspace/repo-root.mjs`, `runtime/cli/codex/generate-command-routers.cjs`. Standard: `universal/code-quality-standards.md` §7 rung 4. **Fix: judgment-required** — surface repo-root resolution once and reuse it (drift risk on a security-adjacent primitive).
- **F10.3 [P2]** `runtime/cli/retrieval/rg-wrapper.mjs:194,328` selects root per-call/flag, compounding F10.1. **Fix: judgment-required**.

### Angle 3 — Error handling / exit-code contract

- **F3.1 [P1]** Swallowed top-level rejection — `runtime/hooks/cursor/completion-evidence-response.mjs:65` (`main().catch(() => {})`). Standard: `universal/code-quality-standards.md` §3 P0#4. **Fix: judgment-required** — log and/or propagate.
- **F3.2 [P2]** Off-contract exit codes 20/26/64 — `runtime/cli/doctor.sh:43,51,69`, `runtime/cli/validate-command-tree-parity.sh:34`. Standard: `shell/quality-standards/validation-security-and-shellcheck.md` §3. **Fix: mechanical** — map onto documented range or document.
- (Note) `try {…} catch {}` guards in `runtime/hooks/{claude,codex,devin}/completion-evidence-stop.cjs` are deliberate default-off; P2, not a finding.

### Angle 4 — Module-boundary integrity

- **F4.3 [P2]** The boundary is a test/prose guard (`runtime/lib/MODULE-MAP.md` + `runtime/cli/tests/import-policy-rules.vitest.ts`), not a tool-enforced package boundary. **Fix: mechanical** — extend the import-policy test or add `no-restricted-imports`/dependency-cruiser rules.
- **(no live break)** Confirmed conforming: no `cli→dist`, `lib→cli`, or `shared→runtime` import.

### Angle 5 — Dead / retired code

- **F5.1 [P1]** Unimported module — `shared/ipc/socket-server.ts:525,530-531`; only reference is a comment at `shared/review-research-paths.cjs:262`. **Fix: judgment-required** — confirm cross-package consumer or remove.
- **F5.2 [P2]** Dead barrel — `runtime/cli/lib/embeddings.ts:9` has no in-package consumer (shared embeddings layer is live). **Fix: mechanical**.
- **F5.3 [P2]** Feature-catalog pointer in comment `shared/embeddings.ts:3` only allowed via `// hygiene-ok`. **Fix: mechanical** — replace with durable WHY.
- **(no residue)** The embedding/model-server subsystem is live, not retired `sqlite/embeddings/MCP-memory` residue.

### Angle 6 — Naming / structure

- **F6.1 [P2]** Mixed snake/camel keys in one object — `runtime/cli/lib/frontmatter-migration.ts:1303-1314` (`trigger_phrases`/`importance_tier` vs `contextType`). Standard: `typescript/style-guide/overview-strict-and-naming.md` §5. **Fix: judgment-required** — map internally or extend the snake_case exception to frontmatter-key mirrors.
- **F6.2 [P2]** `test-*.js/.cjs/.mjs` naming (~20 files in `runtime/cli/tests/`) absent from the documented conventions table. Standard: `shared/code-organization/directory-and-test-conventions.md` §3. **Fix: mechanical** — rename or document.
- **(conforming)** No `I`-prefixed interfaces beyond `IEmbeddingProvider`/`IVectorStore`.

### Angle 7 — Coverage gaps

- **F7.1 [P1]** `runtime/cli/spec/quality-audit.sh` — 0 test references; public entry point with no happy-path/edge test. Standard: `universal/code-quality-standards.md` §4 P1#2. **Fix: judgment-required**.
- **F7.2 [P1]** `runtime/cli/spec/calculate-completeness.sh` — 0 test references. **Fix: judgment-required**.
- **(baseline)** `validate.sh` is well covered (109 references); `deploy-mcp.sh`/`quality-kpi.sh` are side-effect-bound or internal (documented deferral, P2).

### Angle 8 — Shell hygiene

- **F8.1 [P2]** `eval "$(get_feature_paths)"` — `runtime/cli/setup/check-prerequisites.sh:74`. Standard: `shell/quality-standards/validation-security-and-shellcheck.md` §5. **Fix: judgment-required** — replace with `read`/`mapfile`/`source` of a value.
- **F8.2 [P2]** `cd` without `|| exit` (SC2164) — `runtime/cli/spec/archive.sh:299`, `runtime/cli/spec/create.sh:894`, `runtime/cli/setup/rebuild-native-modules.sh:23` (safe under `set -e`). **Fix: mechanical**.
- **(conforming)** All non-test `runtime/cli/**/*.sh` have `set -euo pipefail`; no unquoted command-position `$var` (SC2086); no single-bracket unquoted tests.

## 6. Non-Goals Confirmed

No code was edited. No sk-code or other skills' code was audited. No abstraction beyond a cited standard was proposed; every finding cites a code location and a standard clause. The repo's own tooling (validate.sh, generate-context.js, git) was not run; findings are produced by reading source.

## 7-11. (Sections 7-11 folded into Findings, Eliminated Alternatives, and Divergence Map below.)

## 12. Eliminated Alternatives

These directions were investigated and excluded, not flagged:

- The `# RULE:` shell header tag is a style deviation, not a P0 correctness break (Iteration 1).
- `runtime/cli/utils/path-utils.ts` re-exporting `@spec-kit/shared/utils/path-containment` is correct reuse, not a violation (Iteration 2).
- The `try {…} catch {}` feature-flag guards in `runtime/hooks/{claude,codex,devin}/completion-evidence-stop.cjs` are deliberate default-off, not silent failures (Iteration 3).
- The embedding/model-server subsystem is live, not retired `sqlite/embeddings/MCP-memory` residue (Iteration 5).
- The `.vitest.ts`/`.test.ts` mix is conforming — both are live Vitest conventions; the real discrepancy is the reverse (`test-*.js` prefix files) (Iteration 6).
- The three `cd` sites are style-only under `set -e`, not P0 (Iteration 8).

## 13. Divergence Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: TS header/banner census, module-boundary scan, strict-mode/quoting baseline
- Remaining frontier: repo-root resolver behavioral divergence (needs a crafted-tree test); ShellCheck ground truth (needs shellcheck); `shared/ipc/socket-server.ts` cross-package consumer (needs `system-skill-advisor` check)

## 14-16. References

- Standards: `sk-code-opencode/references/shell/style-guide/overview-structure-and-naming.md` §2; `sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md` §2,§3,§5,§7; `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §2,§5; `sk-code-opencode/references/shared/code-organization/imports-and-exports.md` §1,§3; `sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md` §3; `shared/references/universal/code-quality-standards.md` §3 P0#4,§4 P1#2,§7.
- Source: every finding cites its code path and line in `iterations/iteration-NNN.md`; the full trail is in `deltas/iter-NNN.jsonl` and `deep-research-state.jsonl`.

## Convergence Report

- **Stop reason:** `maxIterationsReached`
- **Total iterations:** 10
- **Questions answered:** 8 / 8 (all eight angles resolved; no open questions remain)
- **Remaining questions:** 0
- **Last 3 iteration summaries:** run 8: Angle 8 shell hygiene (0.55) | run 9: Angle 1 repeat (0.6) | run 10: Angle 2 repeat (0.6)
- **Convergence threshold:** 3 (telemetry only under `max-iterations` stop policy)
- **Divergence summary:** no divergent pivots recorded; saturated TS header/banner and module-boundary directions; remaining frontier as listed in §13.

*Status: loop complete at max iterations. No further iterations scheduled.*
