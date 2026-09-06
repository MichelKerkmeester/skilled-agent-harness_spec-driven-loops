---
title: Deep Research Strategy - Code Standards Audit
description: Lineage-local strategy for the read-only system-spec-kit code-standards audit. 10 iterations completed, one focus angle each, angles 1 and 2 repeated.
trigger_phrases:
  - "system-spec-kit code standards audit"
  - "sk-code deviation inventory"
importance_tier: planning
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Code Standards Audit (deepseek-v4-flash-code-standards)

## 1. OVERVIEW

Read-only, evidence-based audit of `.opencode/skills/system-spec-kit/shared/**` and `.opencode/skills/system-spec-kit/runtime/**` (excluding node_modules/ and dist/) against this repo's code standards (sk-code-opencode, sk-code-quality, universal code-quality-standards). Output is a citation-complete deviation inventory feeding a remediation packet. No edits. No auditing sk-code or other skills' code.

## 2. TOPIC

Read-only, evidence-based audit of system-spec-kit code against this repo's code standards. One focus angle per iteration, rotating angles 1-8 over 10 iterations.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Do shared/ and runtime/ source files conform to the mandated module-header and numbered-section-banner conventions?
- [x] Q2: Do runtime/cli and runtime/lib helpers reimplement functionality @spec-kit/shared already exports?
- [x] Q3: Do CLI entry points and error paths honor the 0/1/2/3 exit-code contract and avoid swallowed exceptions?
- [x] Q4: Do module boundaries hold (cli not importing dist paths, lib not importing cli, shared not depending on runtime)?
- [x] Q5: Is there dead or retired code (unimported exports, retired sqlite/embeddings/MCP-memory residue)?
- [x] Q6: Do naming conventions hold (snake_case only where documented, consistent test suffixes, sequential section banners)?
- [x] Q7: Does every public CLI surface/rule carry a happy-path plus one edge-case test?
- [x] Q8: Do shell scripts satisfy strict-mode, variable-quoting, and portability hygiene?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No code edits; audit only.
- No auditing sk-code or other skills' code.
- No proposing abstractions beyond a cited standard; no asserting unstated intent.
- No verifying the repo's own tooling (validate.sh, generate-context.js) during this lineage; findings are produced by reading source.

---

## 5. STOP CONDITIONS
- Fixed 10-iteration cap reached (`maxIterations=10`, stopPolicy `max-iterations`).
- Terminal synthesis record carries `stopReason: maxIterationsReached`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1: header/section-banner conformance (Iterations 1, 9) — TS conforming; shell `RULE:`/`SPEC-KIT:`/`# SCRIPT:` tag divergence; hardcoded absolute paths.
- [x] Q2: helper duplication vs @spec-kit/shared (Iterations 2, 10) — parallel frontmatter parser; redundant barrel; 4x `findRepoRoot`.
- [x] Q3: error-handling and exit-code contract (Iteration 3) — swallowed `main().catch`; 20/26/64 exit codes; try/catch feature-flag guards.
- [x] Q4: module-boundary integrity (Iteration 4) — no live break; boundary is test/prose guard (P2 hardening).
- [x] Q5: dead or retired code (Iteration 5) — unimported `socket-server.ts`; dead `lib/embeddings.ts` barrel.
- [x] Q6: naming and structure consistency (Iteration 6) — mixed snake/camel frontmatter object; `test-*.js` non-convention naming.
- [x] Q7: coverage gaps per public surface (Iteration 7) — `quality-audit.sh`, `calculate-completeness.sh` have no test reference.
- [x] Q8: shell hygiene (Iteration 8) — `eval` of command substitution; three SC2164 `cd` sites; strict-mode baseline conforming.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Distribution scans (header-tag census, exit-code census, test-reference census) produced exact counts instead of anecdote (Iterations 1, 3, 7).
- Negative results reported honestly, not inflated to findings: TS module-header coverage is clean; module boundaries hold; strict-mode and quoting baseline is clean (Iterations 1, 4, 8).
- Definition-level grep for `findRepoRoot` exposed a 4-way duplication that a per-file read hides (Iteration 10).
- Re-reading the "headerless" `.mjs` files corrected a TS-specific `MODULE:`-grep false negative (Iteration 9).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The `MODULE:`-only header grep produced false negatives for `.mjs`/`.cjs` files that use `# SCRIPT:`/`# COMPONENT:` headers — a tag-agnostic scan is needed for mixed-language dirs (Iteration 9).
- The ".vitest.ts vs .test.ts mixed suffix" hypothesis was wrong — both are live vitest conventions; the real discrepancy was the opposite (`test-*.js` prefix files) (Iteration 6).
- The "retired sqlite/embeddings/MCP-memory residue" presumption did not hold — the embedding/model-server subsystem is still live at `shared/` and via runtime tests (Iteration 5).
- Name-grep coverage census can miss indirect coverage; findings state "no focused test", not "definitely uncovered at runtime" (Iteration 7).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- **Whole-file banner scans for TS — PRODUCTIVE (iterations 1, 9):** confirm and move on; header diff is an angle that is exhausted for TS (`shared/`, `runtime/lib`, `runtime/cli`, `runtime/api`, `runtime/hooks`). Remaining work is only the shell tag-divergence remediation, not more scanning.
- **`MODULE:`-specific grep — BLOCKED (iteration 9):** not usable for `.mjs`/`.cjs` (use tag-agnostic scan instead).
- **"Retired residue" probe — BLOCKED (iteration 5):** embeddings subsystem is live; do not re-assume it is dead code.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treating the `# RULE:` header tag as a P0 correctness break — it is an authoring-contract/style deviation (Iteration 1).
- Treating the `path-containment` re-export in `runtime/cli/utils/path-utils.ts` as a violation — it is correct reuse (Iteration 2).
- Treating the `try {…} catch {}` feature-flag guards in `runtime/hooks/{claude,codex,devin}/completion-evidence-stop.cjs` as P0 — deliberate default-off guards (Iteration 3).
- Treating the embedding/model-server subsystem as "retired residue" — it is live (Iteration 5).
- Treating the `.vitest.ts`/`.test.ts` mix as a deviation — both are live vitest conventions (Iteration 6).
- Flagging the three `cd` sites as P0 — covered by `set -e`, so style-only (Iteration 8).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: header/banner census (TS), module-boundary scan, strict-mode/quoting baseline
- Pivot lineage: none yet
- Remaining frontier: single-executor lineage; no divergent pivots recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Repo-root resolver behavioral divergence not proven; would require running each resolver on a crafted tree.
- ShellCheck ground truth for `runtime/cli` not run (repo tooling out of scope for this lineage).
- Whether `shared/ipc/socket-server.ts` is consumed by the `system-skill-advisor` MCP server (outside the audited package) is unresolved.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Loop complete (max-iterations reached). No further iterations scheduled. Synthesize the deviation inventory into `research.md` and the convergence report.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot
- **Scope code paths:** `.opencode/skills/system-spec-kit/shared/**`; `.opencode/skills/system-spec-kit/runtime/**` excluding `node_modules/` and `dist/`.
- **File inventory (audit-visible):** 529 `.ts`, 42 `.cjs`, 46 `.mjs`, 78 `.sh`, 2 `.py`, 103 `.json` in scope.
- **Standards in force:** TS module-header (67-char box, `// MODULE:`), numbered section dividers, TS naming; Shell shebang + `# COMPONENT:`/`# SPECKIT:` header + `set -euo pipefail`; universal P0 (no silent failures, no commented-out code, no ephemeral-artifact pointers), P1 (test coverage happy-path + edge, error message quality).
- **Existing boundary contract:** `runtime/lib/MODULE-MAP.md`; `runtime/cli/tests/import-policy-rules.vitest.ts`.
- **resource-map.md:** not present at init; coverage gate skipped.
- **Reuse candidates:** `@spec-kit/shared/frontmatter/parse-frontmatter`, `@spec-kit/shared/utils/path-containment`, `@spec-kit/shared/utils/path-security`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 3 (telemetry only under max-iterations stopPolicy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-09-06T08:03:34.186Z
- Directed write surface: `specs/system-speckit/033-system-speckit-v4/026-runtime-code-standards-research/research/lineages/deepseek-v4-flash-code-standards`
