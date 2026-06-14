# Deep Review Report — 011 Command Presentation / Workflow Separation

Review target: `system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation` (4 command families: memory, speckit, create, doctor — presentation/router separation, shipped in commits 059284c35b / 1ffc9d12cd / 6d51b894b9 / 1e8715c5e2).
Mode: autonomous fan-out (`/deep:start-review-loop` via `fanout-run.cjs`), 3× cli-opencode `gpt-5.5-fast --variant high` lineages, strongest-restriction merge.

---

## 1. Executive Summary

**Verdict: CONDITIONAL** | P0: 0 · P1: 3 · P2: 0

Three independent gpt-5.5-fast-high lineages (gpt-1: 4 iterations / 4 dimensions covered; gpt-2 and gpt-3: 12 iterations each, `maxIterationsReached`, 4/4 dimensions) audited the 011 command-presentation/router separation across correctness, traceability, completeness, and maintainability. No P0 blockers; all three lineages independently returned CONDITIONAL. The shipped router rewires and presentation-asset extraction held — the findings cluster entirely on **parent-doc traceability and spec-prose precision** (the same class the 027 and 145 reviews surfaced), not on command-behavior defects.

---

## 2. Findings (P1 — Required)

- **P1-1 · traceability · `011/spec.md`** — The phase-parent `spec.md` still reports `Status: Planned`, `completion_pct: 0`, and `recent_action: "Scaffold phase-parent and family leaves; no implementation"` even though all four family parents (memory, speckit, create, doctor) are implemented and committed. Parent-doc drift. **Fix:** reconcile the parent `spec.md` status (→ Complete), continuity block (`completion_pct`, `recent_action`, `next_safe_action`), and the Phase Documentation Map statuses (Planned → Complete) + refresh `description.json`/`graph-metadata.json` derived status.
- **P1-2 · traceability · `011/spec.md`** — The Purpose/Scope prose promises that *each* command file becomes "a thin router to **two** explicit assets: the existing owned workflow file and a dedicated Markdown presentation file." The memory family legitimately has only a presentation asset: `commands/memory/{save,search,learn,manage}.md` explicitly document "_No memory workflow YAML exists in this checkout — Missing upstream asset_" and deliberately keep workflow routing inline (creating a workflow YAML was out of scope). The speckit family, by contrast, has full `*_auto.yaml`/`*_confirm.yaml` workflow assets + presentation. **Fix:** refine the parent `spec.md` Purpose/Scope to acknowledge families that route to presentation-only with a documented missing-upstream workflow placeholder (memory case), rather than claiming universal two-asset separation. Implementation is correct; the spec prose overstates it.
- **P1-3 · maintainability · `011/spec.md:128`** — Phase-transition instructions reference the stale `/spec_kit:resume` command spelling; the live command is `/speckit:resume` (`commands/speckit/resume.md`; the `commands/spec_kit/` → `commands/speckit/` rename landed in 576624ada8). **Fix:** correct the spelling to `/speckit:resume`.

---

## 3. Convergence & Attribution

| Lineage | Executor | Iterations | Dimensions | Verdict |
|---------|----------|-----------|------------|---------|
| gpt-1 | cli-opencode / gpt-5.5-fast-high | 4 | 4/4 | CONDITIONAL (P1 ×3) |
| gpt-2 | cli-opencode / gpt-5.5-fast-high | 12 (maxIter) | 4/4 | CONDITIONAL (P1) |
| gpt-3 | cli-opencode / gpt-5.5-fast-high | 12 (maxIter) | 4/4 | CONDITIONAL (P1) |

Merge policy: strongest-restriction (no lineage P0 → merged not-FAIL; P1s present → CONDITIONAL). Deduped to 3 unique active P1 findings across lineages.

Per the /goal, a fresh Fable 5 agent reviews this synthesis + double-checks the findings (adjudicate confirm/refute, scan for missed findings, verify the router rewires preserved behavior and the memory search-UX goal was met) before remediation.

## 4. Verdict & Next Steps

**CONDITIONAL** — release-ready after remediating P1-1/2/3, all three bounded to `011/spec.md` doc edits (status reconciliation, scope-prose precision, one command-spelling fix). No code-behavior regressions; the presentation/router separation guardrails verified intact across all four families.
