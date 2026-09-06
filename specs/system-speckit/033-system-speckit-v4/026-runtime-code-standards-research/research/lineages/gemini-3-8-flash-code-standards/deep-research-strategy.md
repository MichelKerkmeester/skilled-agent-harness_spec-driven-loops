---
title: Deep Research Strategy - Code Standards Audit
description: Lineage-local strategy for the read-only system-spec-kit code-standards audit. 2 iterations planned over previously unopened surfaces.
trigger_phrases:
  - "system-spec-kit code standards audit"
  - "sk-code deviation inventory"
importance_tier: planning
contextType: planning
version: 1.14.0.0
---

# Deep Research Strategy - Code Standards Audit (gemini-3-8-flash-code-standards)

## 1. OVERVIEW

Read-only, evidence-based audit of `.opencode/skills/system-spec-kit/shared/**` and `.opencode/skills/system-spec-kit/runtime/**` (excluding node_modules/ and dist/) against this repo's code standards (sk-code-opencode, sk-code-quality, universal code-quality-standards). Focus is on surfaces never opened by the prior lane:
- Iteration 1: `runtime/lib` (validation, graph, description, continuity, parsing) and `runtime/api` against the TypeScript style guide and universal quality standards (error handling, boundaries, dead exports, naming, coverage floor).
- Iteration 2: `runtime/hooks` (claude, codex, cursor, devin, lib), `.cjs` and `.mjs` scripts under `runtime/cli` outside retrieval, and `shared/**` beyond frontmatter and path containment.

Output is a citation-complete deviation inventory feeding a remediation packet. No edits. No auditing sk-code or other skills' code.

## 2. TOPIC

Read-only, evidence-based audit of system-spec-kit code against this repo's code standards. Unopened surfaces pass over 2 iterations.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q2: runtime/hooks, runtime/cli (.cjs/.mjs), and shared/** audit: Do hook implementations, cli scripts, and shared utilities satisfy hook conventions, error reporting, exit codes, and code-quality standards without dead code or swallowed rejections?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No code edits; audit only.
- No auditing sk-code or other skills' code.
- No proposing abstractions beyond a cited standard; no asserting unstated intent.
- No verifying the repo's own tooling (validate.sh, generate-context.js) during this lineage; findings are produced by reading source.
- Do not re-report already fixed items (RULE, SPEC-KIT, SCRIPT shell headers, memory-frontmatter.ts barrel, completion-evidence-response.mjs catch, frontmatter-migration duplication, embeddings catalog comment, missing tests for quality-audit.sh/calculate-completeness.sh, four findRepoRoot implementations, doctor.sh exit codes, test-* legacy names, three cd sites).

---

## 5. STOP CONDITIONS
- Fixed 2-iteration cap reached (`maxIterations=2`, stopPolicy `max-iterations`).
- Terminal synthesis record carries `stopReason: maxIterationsReached`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1: runtime/lib and runtime/api audit (Iteration 1) — identified 6 P1 deviations (seam bypass in `graph-refresh.ts`, reverse layering in `orchestrator.ts`/`spec-doc-structure.ts`, duplicate frontmatter regexes in `thin-continuity-record.ts` and `packet-synopsis.ts`, stderr CLI stream in `spec-doc-structure.ts`, swallowed integrity exceptions in `generated-metadata-integrity.ts`, and missing `api/` package test suite) and 2 P2 deviations (header box width / section dividers and mixed casing in description schema).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Tracing cross-layer imports from `api` and `lib` to `handlers` and `cli` revealed multiple boundary inversions and duplicate parsing that isolated file reviews missed.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- TypeScript type-checking scan for `: any` yielded zero results — type-safety was strictly maintained across `runtime/lib`.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES
- Looking for loose `: any` types in `runtime/lib` (surface is strictly typed).
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `runtime/lib/discovery/spec-document-finder.ts` handler dependency was confirmed as an authorized seam, not a violation.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 11. DIVERGENCE FRONTIER
- `runtime/hooks` (claude, codex, cursor, devin, lib), `.cjs` and `.mjs` scripts under `runtime/cli` outside retrieval, and `shared/**` beyond frontmatter and path containment.
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Iteration 2: runtime/hooks (claude, codex, cursor, devin, lib) and the .cjs and .mjs scripts under runtime/cli outside retrieval, plus shared/** beyond frontmatter and path containment, against the same standards and the hook conventions.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
