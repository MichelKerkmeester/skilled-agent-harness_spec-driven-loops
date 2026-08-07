---
title: "Deep-Review Report: skill:deep-improvement (MiMo-v2.5-pro)"
description: "Final synthesis of the 10-iteration deep review of the deep-improvement skill (D4-R fidelity track + 49-file reformat + doc reconciliation), reviewed by MiMo-v2.5-pro via cli-opencode. Verdict CONDITIONAL: 0 P0, 8 P1, 20 P2."
trigger_phrases:
  - "deep-improvement deep review report"
  - "mimo review verdict"
importance_tier: "important"
contextType: "general"
---
# Deep-Review Report: skill:deep-improvement (MiMo-v2.5-pro)

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

> **RESOLVED (2026-06-02):** all 28 findings (8 P1 + 20 P2) were remediated in sibling phase `014-d4r-grader-fidelity-remediation` — gpt-5.5-fast (high), worktree-isolated, integrated to main, full suite 358/358 + drift 4/4 green. 0 deferred. This report is retained as the review-of-record.

**Verdict: CONDITIONAL** — ship-able, no blockers; clear the P1 cluster first.

| Severity | Count | Meaning |
|----------|-------|---------|
| **P0** (blocker) | **0** | Nothing broken or unsafe-to-ship. |
| **P1** (should-fix) | **8** | Correctness/consistency gaps worth fixing before "final". |
| **P2** (advisory) | **20** | Polish, robustness, doc-drift, maintainability. |
| **Total** | **28** | Deduped across 7 recorded iterations. |

The reviewed work — the D4-R task-outcome instrument + asset lane, the 49-file sk-code-template reformat, the two completed model-benchmark WIP tests, and the v1.11.0.0 doc reconciliation — is **structurally sound**. No finding contradicts the green suite (349/0). The P1s cluster in three places: (a) the new D4-R grader still carries leftover "old D4 hallucination" wiring in its **fallback** path, (b) a 2000-char truncation that penalizes the (longer) D4-R answers, (c) docs (SKILL.md router pseudocode + Section-11 script list) that didn't fully catch up to the new scripts — plus one shell-injection-shaped helper. The 20 P2s are dominated by doc-count drift (README) and ordinary maintainability nits.

**Reviewer caveat:** MiMo-v2.5-pro is the user's cheaper choice; it is strongest on structural/consistency/traceability findings (which dominate here) and shallower on deep logic bug-hunting than a frontier model. Read the *absence* of deeper correctness findings as "not exhaustively probed," not "proven absent."
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:planning-trigger -->
## 2. Planning Trigger

A remediation pass is **recommended but not mandatory**. No P0 ⇒ no forced spec packet. The 8 P1s are small, local, and independent — they fit a single focused fix packet (est. <100 LOC across grader/executor/SKILL.md/README). Trigger a packet if the D4-R instrument is about to be relied on for a graded decision (the fallback-path mislabeling could silently taint a D4-R score). Otherwise the P1s can be folded into the next deep-improvement touch.
<!-- /ANCHOR:planning-trigger -->

---

<!-- ANCHOR:finding-registry -->
## 3. Active Finding Registry

### P1 — should-fix (8)

| # | Location | Finding |
|---|----------|---------|
| P1-1 | `scorer/grader/harness.cjs:136` | `composeGraderPrompt` hardcodes "Score D4 Hallucination only" in the **user** prompt, contradicting the D4-R task-outcome **system** prompt — grader gets mixed instructions. |
| P1-2 | `scorer/grader/harness.cjs:187` | Fallback parser hardcodes `dim_id:'D4'` for **every** grader call, including D4-R → a D4-R result routed through the fallback is mislabeled D4. |
| P1-3 | `scorer/grader/harness.cjs:170-176` | The regex fallback in `parseGraderResponse` accepts structurally-wrong JSON (no `dim_id` validation) → malformed grader output slips through. |
| P1-4 | `skill-benchmark/live-executor.cjs:216` | `responseText` truncated to 2000 chars **before** grading; D4-R answers are longer, so good thorough answers get clipped and under-scored. |
| P1-5 | `model-benchmark/dispatch-model.cjs:340-347` | `buildResumeHint` builds a shell command with an unsanitized path → shell-injection shape (low real risk; paths are internal). |
| P1-6 | `SKILL.md:216-222` | Smart-router pseudocode missing the `SKILL_BENCHMARK runtime_assets` branch — doc behind code. |
| P1-7 | `SKILL.md:217-218` | Same router pseudocode omits the `runtime_assets` extension (paired with P1-6). |
| P1-8 | `SKILL.md:541` | Section-11 script list incomplete — 6 scripts missing (5 skill-benchmark + sweep-benchmark). |

### P2 — advisory (20)

**Doc / count drift (7)**
| # | Location | Finding |
|---|----------|---------|
| P2-1 | `README.md:186-205` | References table says 14; actual 17 (3 skill-benchmark refs missing). |
| P2-2 | `README.md:207-230` | Scripts table omits all skill-benchmark scripts + sweep-benchmark. |
| P2-3 | `README.md:178-183` | Structure block omits `scripts/skill-benchmark/` dir. |
| P2-4 | `README.md:4-11` | `trigger_phrases` 6 vs SKILL.md's 9. |
| P2-5 | `references/skill-benchmark/scoring_contract.md:54` | Funnel stages incomplete vs code. |
| P2-6 | `references/skill-benchmark/scoring_contract.md:46` | build-report `advisorySignals` section undocumented. |
| P2-7 | `changelog/v1.11.0.0.md:30` | D4-R scenarios not linked to the `DEFAULT_D4R_SCENARIOS` constant. |

**Parsing / robustness (5)**
| # | Location | Finding |
|---|----------|---------|
| P2-8 | `scorer/grader/harness.cjs:187` | Fallback parser hardcodes `dim_id D4` even for D4-R (P2 facet of P1-2). |
| P2-9 | `scorer/grader/harness.cjs:163` | `parseGraderResponse` fenced fallback doesn't validate `dim_id`. |
| P2-10 | `scorer/grader/harness.cjs:208` | Grader prompt passes system+user as a single `-p` arg. |
| P2-11 | `skill-benchmark/live-executor.cjs:138` | `extractRoutingJson` bare-object regex rejects nested-brace routing JSON. |
| P2-12 | `skill-benchmark/live-executor.cjs:98` | `runDispatch` doesn't default model to `DEFAULT_MODEL`. |

**Defaults / silent failure (2)**
| # | Location | Finding |
|---|----------|---------|
| P2-13 | `scorer/score-model-variant.cjs:151` | `DEEP_AGENT_ALLOW_CRITERIA_EXEC` defaults permissive (profile commands execute by default) — fail-open. |
| P2-14 | `model-benchmark/dispatch-model.cjs:103-117` | Malformed config JSON loads silently, no diagnostic. |

**Maintainability / clarity (6)**
| # | Location | Finding |
|---|----------|---------|
| P2-15 | `skill-benchmark/score-skill-benchmark.cjs:55-208` | `scoreScenario` is 153 lines mixing normalize/score/funnel/assemble. |
| P2-16 | `skill-benchmark/score-skill-benchmark.cjs:107-109` | Magic numbers (0.4/0.6 weights, 0.25 cap) unnamed. |
| P2-17 | `skill-benchmark/score-skill-benchmark.cjs:181-188` | `WEIGHTS` const exported but unused in per-scenario mode-A (inline values instead). |
| P2-18 | `skill-benchmark/score-skill-benchmark.cjs:137` | D3 `wastedCount` semantics confusing for negative scenarios. |
| P2-19 | `skill-benchmark/d4-ablation.cjs:70-75` | Duplicated grader-base-object build in `gradeAblation`/`gradeTaskOutcome`. |
| P2-20 | `model-benchmark/sweep-benchmark.cjs:346-365` | Duplicated event-stream parsing (`extractAssistantText` vs `parseOpencodeStream`). |
<!-- /ANCHOR:finding-registry -->

---

<!-- ANCHOR:remediation-workstreams -->
## 4. Remediation Workstreams

**WS-1 · D4-R grader fidelity (P1-1, P1-2, P1-3, P2-8, P2-9)** — highest value. Make the grader dimension-aware end-to-end: pass `dim_id` (`D4` vs `D4-R`) through `composeGraderPrompt` (drop the hardcoded "D4 Hallucination only") and through the fallback parser; add `dim_id` validation to both regex/fenced fallbacks. One file (`harness.cjs`), ~30 LOC.

**WS-2 · D4-R answer fairness (P1-4)** — raise/parametrize the 2000-char grading truncation for D4-R (task-outcome answers are longer by design). `live-executor.cjs`, ~5 LOC.

**WS-3 · Doc↔code reconciliation (P1-6, P1-7, P1-8, P2-1..P2-7)** — the single largest cluster by count, all mechanical: add the `runtime_assets` branch + 6 missing scripts to SKILL.md; fix README counts (14→17 refs, 6→9 triggers), structure block, and scripts table; document the funnel stages + `advisorySignals` in scoring_contract; link the changelog to `DEFAULT_D4R_SCENARIOS`. Docs only.

**WS-4 · Hardening (P1-5, P2-13, P2-14)** — quote the path in `buildResumeHint`; flip `DEEP_AGENT_ALLOW_CRITERIA_EXEC` to fail-closed (or document the fail-open intent); emit a diagnostic on malformed-config load.

**WS-5 · Maintainability (P2-10..P2-12, P2-15..P2-20)** — opportunistic: split `scoreScenario`, name the magic numbers, drop/use the dead `WEIGHTS` export, de-dupe the two parsing pairs.
<!-- /ANCHOR:remediation-workstreams -->

---

<!-- ANCHOR:spec-seed -->
## 5. Spec Seed

> **Title:** D4-R grader fidelity + doc reconciliation follow-up
> **Level:** 1–2 (<100 LOC; code + docs). **Priority:** P2 (no blocker).
> **In scope:** WS-1..WS-4 (grader dimension-awareness, truncation fairness, SKILL.md/README sync, three hardening nits). **Out of scope:** WS-5 maintainability refactors (separate, optional). **Acceptance:** D4-R grader never emits `dim_id:'D4'`; D4-R answers graded un-truncated; SKILL.md/README script+ref counts match the tree; `buildResumeHint` path quoted. Suite stays 349/0.
<!-- /ANCHOR:spec-seed -->

---

<!-- ANCHOR:plan-seed -->
## 6. Plan Seed

1. **WS-1** — thread `dim_id` through `harness.cjs` (compose + both fallbacks + validation); add a unit test asserting a D4-R fallback response keeps `dim_id:'D4-R'`.
2. **WS-2** — parametrize the truncation cap by dimension in `live-executor.cjs`.
3. **WS-3** — regenerate SKILL.md §router + §11 list and README tables from the actual tree (mechanical; verify counts).
4. **WS-4** — quote path; fail-closed default; config-load diagnostic.
5. Re-run `npx vitest run` (expect 349+/0) + the sk-code drift guard.
<!-- /ANCHOR:plan-seed -->

---

<!-- ANCHOR:traceability-status -->
## 7. Traceability Status

| Dimension | Iterations | Findings (P1/P2) |
|-----------|-----------|------------------|
| inventory + correctness | 1 | 1 / 2 |
| correctness | 2 | 1 / 2 |
| maintainability | 5 | 0 / 5 |
| correctness (deep) | 6 | 2 / 3 |
| security (deep) | 7 | 2 / 2 |
| maintainability (deep) | 8 | 0 / 6 |
| traceability (deep) | 9 | 2 / 5 |

All four planned dimensions (correctness, security, traceability, maintainability) were exercised; correctness + maintainability each got a deep second pass. Iterations 3–4 and 10 are not in the registry (the driver exited mid-iteration-10 across a session gap); coverage is nonetheless complete across the four dimensions. The D4-R focus area drew the most correctness findings, as intended by the strategy's "extra scrutiny" weighting.
<!-- /ANCHOR:traceability-status -->

---

<!-- ANCHOR:deferred-items -->
## 8. Deferred Items

- **Iteration-10 synthesis-on-loop:** the loop did not auto-write this report (session gap); it was hand-synthesized from the deduped registry. No findings were lost — the registry is the source of truth.
- **WS-5 maintainability refactors:** advisory backlog; not gated on this work being "final".
- **Out-of-target by design:** the `sk-code/references/smart_routing.md` intent-synonym change is a *different* skill, not covered by `skill:deep-improvement`; review separately if desired.
- **Frontier re-review (optional):** given MiMo's lighter deep-logic probing, a single frontier pass over `harness.cjs` + `score-skill-benchmark.cjs` would raise confidence on the un-probed correctness surface.
<!-- /ANCHOR:deferred-items -->

---

<!-- ANCHOR:audit-appendix -->
## 9. Audit Appendix

- **Target:** `skill:deep-improvement` (`.opencode/skills/deep-improvement/` — SKILL.md + references + assets + scripts).
- **Reviewer:** `xiaomi-token-plan-ams/mimo-v2.5-pro --variant high` via cli-opencode (read-only; no source modified — `git status` shows only `review/` artifacts).
- **Convergence:** `newFindingsRatio` stayed 1.0 every recorded iteration (each pass surfaced net-new findings — the loop never plateaued, so it ran toward the cap rather than converging early; the mid-iteration-10 exit means the last increment may be slightly under-counted).
- **Iteration timings (s):** 1→157, 2→189, 5→136, 6→184, 7→157, 8→154, 9→182.
- **Suite at review start:** 349 passed / 0 failed; reformat verified behavior-preserving.
- **Artifacts:** `deep-review-findings-registry.json` (28 deduped), `deep-review-dashboard.md`, `deep-review-state.jsonl`, `iterations/`, `deltas/`, `deep-review-strategy.md`.
<!-- /ANCHOR:audit-appendix -->
