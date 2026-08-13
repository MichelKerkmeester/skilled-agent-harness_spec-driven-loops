# Deep Review Report — sk-communication skill + communication-projection package (merged fan-out)

Target: `packages/cli-communication-projection/` + `.opencode/skills/sk-communication/` (branch `skilled/0143-provider-adapters-privacy`)
State folder: `specs/sk-doc/028-sk-communication-skill/review/`
Stop policy: `max-iterations` (no early convergence) · Threshold telemetry: 0.10
Generated: 2026-08-12

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Merged verdict** | **CONDITIONAL** |
| **Merge rule** | strongest-restriction (any lineage active P0 → merged FAIL) |
| **Active P0** | 0 |
| **Active P1** | 2 (F001, F004) |
| **Active P2** | 7 (F002, F003, F005, F006, F007, F008, F009) |
| **hasAdvisories** | true |
| **Total iterations** | 10 (5 per lineage) |
| **Cross-model agreement** | 8 of 9 findings raised independently by BOTH models |

Two independent models each ran a full 5-iteration review and **converged on the same verdict and the same two P1 findings**. No P0 was raised by either lineage, so under strongest-restriction the merged verdict is **CONDITIONAL** — the skill and package are sound in substance (privacy-before-ranking, exact-original fallback, fail-closed on stale facts, content-free telemetry all verified against source in both lineages), but real documentation/traceability drift blocks an unconditional PASS.

The headline P1 (F001) was **independently confirmed a third time** during this synthesis: `package.json` exports 10 subpaths and `./clients` is not among them, yet `SKILL.md:130` and `README.md:61` both advertise `./clients` and both omit the actually-exported `./contracts` and `./versioning`.

This review is observation-only. It does not modify the reviewed code; it emits findings and a remediation plan for `/speckit:plan`.

---

## 2. Fan-out Configuration

| Lineage | Executor | Model | Iterations | Result | Verdict |
|---------|----------|-------|-----------|--------|---------|
| `glm` | cli-cursor | `glm-5.2-max` (GLM 5.2 Max) | 5/5 | succeeded | CONDITIONAL (0 P0 / 2 P1 / 7 P2) |
| `grok` | cli-cursor | `cursor-grok-4.5-high-fast` (Grok 4.5 High, fast) | 5/5 | succeeded | CONDITIONAL (0 P0 / 2 P1 / 6 P2) |

**Execution note (for the record):** GLM 5.2 Max was first dispatched via **cli-devin** and failed all 6 attempts with `salvage_miss` — each `devin -p` single turn exhausted its budget reading the 2155-line workflow contract + references and exited before writing any artifact (it did real review work but never reached the write phase). Re-dispatching the identical model via **cli-cursor**, whose `cursor-agent -p` runs a full agentic loop to completion, produced a complete 5-iteration review. Grok ran on cli-cursor from the start. Both lineages emitted benign future-dated timestamps in their state records (a model quirk; report content is unaffected).

Per-lineage reports: [`lineages/glm/review-report.md`](lineages/glm/review-report.md) · [`lineages/grok/review-report.md`](lineages/grok/review-report.md)

---

## 3. Consolidated Finding Registry

Findings are ranked most-severe first. "Both" = raised independently by both models (high confidence); a single model is named otherwise.

| ID | Sev | Dimension | Finding | Evidence | Raised by |
|----|-----|-----------|---------|----------|-----------|
| F001 | P1 | correctness | Skill advertises non-existent `./clients` package subpath export; bidirectional drift — `./contracts` and `./versioning` ARE exported but unadvertised | SKILL.md:130; README.md:61; package.json exports (10 keys, no `./clients`) — confirmed in synthesis | Both (GLM added bidirectional framing) |
| F004 | P1 | traceability | T005 completion evidence lacks a persisted advisor-run transcript / dated benchmark report | tasks.md:68; benchmark/reports/ has only README | Both |
| F002 | P2 | correctness | `leafRoots` includes a missing `assets/` directory | leaf-manifest.config.json:6; assets/ absent | Both |
| F003 | P2 | security | OpenCode Go retention deadline is hardcoded in SKILL.md and duplicated from the package preset (dual-sourced, drift risk) | SKILL.md:152; presets.ts:48 | Both |
| F005 | P2 | traceability | Placeholder `session_dedup` fingerprints in packet docs | spec.md:23 and siblings | Both |
| F006 | P2 | traceability | COMM-001 catalog cross-ref maps to a privacy feature, not an advisor-routing feature | manual-testing-playbook.md:130 | Both |
| F007 | P2 | maintainability | Benchmark README still contains a scaffold TODO | benchmark/README.md:19 | Both |
| F008 | P2 | traceability | Five catalog features lack manual-playbook scenario coverage | feature-catalog.md (11 features) vs playbook (6 covered) | Both |
| F009 | P2 | maintainability | Sibling-edge drift between SKILL.md §5/§7 and graph-metadata.json siblings | SKILL.md:183-185,211-213; graph-metadata.json:11-25 | GLM only |

**Substance verified holding in both lineages (no findings):** privacy classification/consent runs before cost/quality/latency ranking (`src/privacy/router.ts`); egress consent + no silent local→hosted; credentials are references not values (`src/providers/presets.ts`); fail-closed to original-only on stale/unknown facts; content-free telemetry; all 13 documented public entry points resolve and re-export from their subsystem `index.ts`.

---

## 4. Remediation Plan (route to `/speckit:plan`)

**WS-1 — Public API docs (P1, no deps):** In `SKILL.md:130` and `README.md:61`, drop `./clients` and add `./contracts` + `./versioning` so the advertised subpath list matches `package.json` exports. Keep `src/clients/` only as an internal subsystem path in the routing table. (F001)

**WS-2 — Completion-evidence hygiene (P1, no deps):** Run COMM-001 via `run-manual-playbook-scenario.cjs` and attach the persisted report path to T005 evidence (or rephrase to cite a stored warm-advisor capture). Recompute continuity fingerprints via `generate-context.js`. (F004, F005)

**WS-3 — Scaffold, edge, and coverage advisories (P2):** Drop the unused `assets` leafRoot and regenerate the manifest/aliases; point the SKILL OpenCode Go retention date at the package preset's `expiresAt`; clarify the COMM-001 catalog mapping; replace the benchmark README TODO; document the five automated-only catalog features; reconcile the SKILL.md sibling list with graph-metadata.json. (F002, F003, F006, F007, F008, F009)

Do **not** treat this as a changelog-only PASS while F001/F004 remain active.

---

## 5. Verdict Rationale

- Both lineages independently returned **CONDITIONAL** with **0 active P0**. Strongest-restriction merge preserves CONDITIONAL.
- Both P1 findings were adversarially re-verified inside the GLM lineage (iteration 5) and re-confirmed; F001 was additionally confirmed during this synthesis against the live files.
- 8 of 9 findings were raised by both models independently — an unusually strong corroboration signal that these are real, not model artifacts.
- Every finding is a documentation, config, or traceability defect. None impugn the package's runtime invariants, which both lineages verified against source.

**Next step:** `/speckit:plan` a small remediation packet for WS-1 + WS-2 (the two P1s are ~10-line doc edits plus one evidence capture), with WS-3 as optional advisory cleanup.
