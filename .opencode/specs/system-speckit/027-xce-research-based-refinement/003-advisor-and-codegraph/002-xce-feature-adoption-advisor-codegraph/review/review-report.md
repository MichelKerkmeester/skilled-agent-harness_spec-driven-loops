# Deep Review Report — 145 XCE Feature Adoption (Advisor + Code-Graph)

Review target: `system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph` (all 9 implemented child phases / 10 transfers)
Mode: autonomous fan-out (`/deep:start-review-loop`), 3× gpt-5.5-fast-high lineages, 6 iterations each (18 total), strongest-restriction merge.

---

## 1. Executive Summary

**Verdict: CONDITIONAL** | P0: 0 · P1: 3 · P2: 0

Three independent gpt-5.5-fast-high lineages audited the 145 advisor + code-graph adoption across correctness, security, traceability, and maintainability. No P0 blockers. Three P1 findings, all converged across lineages, none about behavioral defects in the shipped guardrails (shadow/default-off discipline held). Findings cluster on **integration completeness + parent-doc traceability**.

---

## 2. Findings (P1 — Required)

- **P1-1 · correctness · `lib/scorer/fusion.ts`** — The advisor packed-BM25 shadow lane (phase 003) is defined but **never consumed by production fusion**. By design it is shadow/default-off (promotion is a separate phase), but the review flags that the shadow path may not be exercised at all (dead path) rather than recorded-in-shadow. Adjudication needed: confirm the shadow lane is actually invoked + recorded in a shadow/eval path, or wire it so it is, or document it explicitly as inert-until-promotion infra.
- **P1-2 · security · `system-code-graph/.../tool-schemas.ts`** — `code_graph_query.includeTrace` (phase 008) is honored by the handler but **rejected by the published tool schema**, so any caller passing it gets a schema-validation error. The 008 lane flagged this (tool-schemas.ts was outside its write scope). Fix: add `includeTrace` to the `code_graph_query` input schema (the shared registry → auto-exposes via MCP + CLI).
- **P1-3 · traceability · `145/spec.md`** — The 145 parent packet still presents scaffold-only / Planned status while all 9 child phases are implemented + committed. Same parent-doc-drift class the 027 review caught. Fix: reconcile the 145 parent spec.md phase map (children → Complete) + description.json/graph-metadata derived status.

---

## 3. Convergence & Attribution

| Lineage | Executor | Iterations | Verdict |
|---------|----------|-----------|---------|
| gpt-1 | cli-opencode / gpt-5.5-fast-high | 6 | CONDITIONAL (3 P1) |
| gpt-2 | cli-opencode / gpt-5.5-fast-high | 6 | CONDITIONAL (2 P1 + 1 P2) |
| gpt-3 | cli-opencode / gpt-5.5-fast-high | 6 | CONDITIONAL (3 P1) |

Merge policy: strongest-restriction (no lineage P0 → merged not-FAIL; P1s present → CONDITIONAL). Per the /goal, a fresh Fable 5 agent reviews this synthesis + double-checks the findings before remediation.

## 4. Verdict & Next Steps

**CONDITIONAL** — release-ready after remediating P1-1/2/3 (all bounded: a shadow-wiring/doc decision, a one-line schema addition, and a parent-doc reconciliation). No code-behavior regressions; guardrails (shadow/default-off, behavior-preservation) verified intact across the phases.
