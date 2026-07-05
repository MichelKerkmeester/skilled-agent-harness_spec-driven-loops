---
title: "Implementation Summary: Post-Remediation Dual-Model Deep Review"
description: "Build record + cross-model comparison for the dual-model deep review of the v1.11.1.0 deep-improvement skill: MiMo-v2.5-pro + MiniMax-M3, 5 cli-opencode iterations each. Read-only; per-model reports + a combined verdict."
trigger_phrases:
  - "post-remediation deep review summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Dual-pass review + all findings remediated (gpt-5.5, fail-closed gate); suite 359/359 green"
    next_safe_action: "Awaiting commit decision; README count taxonomy left to parallel doc-accuracy track"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "post-remediation-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Post-Remediation Dual-Model Deep Review

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete — dual-pass review + run-to-run comparison + full remediation of the findings (suite 359/359, drift 4/4) |
| **Date** | 2026-06-02 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dual-pass, independent deep review of the v1.11.1.0 remediated `deep-improvement` skill. Two parameterized cli-opencode deep-review loops over `skill:deep-improvement`, both **MiMo-v2.5-pro** (`--variant high`), 5 iterations each: run 1 → `review-mimo-v25pro/`, run 2 → `review-mimo-v25pro-run2/`. Each writes the canonical deep-review packet (config/state/registry/deltas/iterations/dashboard) with extra scrutiny on the remediation files; both are then synthesized into per-pass reports and compared for run-to-run finding stability. (A MiniMax-M3 pass was originally planned as the second reviewer; the operator aborted it after MiMo run 1 and replaced it with a second MiMo pass.)

### Files Changed (this build)
Two read-only review packets under 015 (no source mutation):
- `review-mimo-v25pro/` — MiMo run 1: 5 iters, **0 P0 / 8 P1 / 15 P2**, `review-report.md` (verdict CONDITIONAL).
- `review-mimo-v25pro-run2/` — MiMo run 2: 5 iters, **0 P0 / 2 P1 / 12 P2**, `review-report.md` (verdict CONDITIONAL).

### Run-to-Run Comparison (the cross-pass synthesis)

**Combined verdict: CONDITIONAL — no blocker in either pass (0 P0 ×2); no regression from the v1.11.1.0 remediation.**

**Stable findings — independently flagged by BOTH passes (high-confidence, real):**
| Issue | Location | Run 1 | Run 2 |
|-------|----------|-------|-------|
| Permissive criteria-exec default (runs profile commands when env unset) | `scorer/score-model-variant.cjs:111-120` | P1 | P1 |
| SKILL.md §11 script list incomplete / count mismatch | `SKILL.md:544` | P1 | P1 |
| Greedy grader regex fallback can stitch across JSON objects | `scorer/grader/harness.cjs:211` | P1 | P2 |
| Grader cache stores raw model output by default | `harness.cjs:385-411` | P2 | P2 |
| `criteriaExecAllowed` warn-once weak in batch runs | `score-model-variant.cjs:116` | P2 | P2 |
| d4-ablation duplication vs harness | `d4-ablation.cjs:39/67` | P2 | P2 |
| `modeAScore` rounding behavior | `score-skill-benchmark.cjs:162` | P2 (no-op) | P2 (double-round) |

**Run-1-unique (8):** SKILL.md `1.12.0.0`-without-changelog *(since resolved — the parallel session added `changelog/v1.12.0.0.md` mid-review-window, which is why run 2 did not re-flag it)*; `bundle-gate.cjs:173` gate divergence; grader hardcoded Claude flags; `GRADED_RESPONSE_MAX_CHARS` no rationale; `dispatch-model.cjs` 677-line size + positional arg; `scoring_contract.md` no programmatic validation; `sweep-benchmark.cjs:301` `_dispatch` seam; double-wrapped RegExp.

**Run-2-unique (4):** `harness.cjs:341` grader cache key omits `system_prompt_path` (cross-system-prompt cache-collision risk — newly relevant with `--append-system-prompt`); `harness.cjs:127` `normalizeParsedPayload` conflates dim-stamping with the mismatch confidence-cap; `score-skill-benchmark.cjs:141` `scoreAssetRecall` returns null (asymmetric); `:109` `scoreD2`/`scoreD3` lack metric JSDoc.

**Stability read:** run 2 found ~60% as many findings (14 vs 23), but **both of its P1s overlapped run 1** — the severe issues are stable, the long P2 tail is pass-specific (model run-to-run variance). The two passes converge on the same actionable core: **criteria-exec default + SKILL.md §11 script list + greedy grader regex**, plus run 2's sharp **grader cache-key** catch. Net: the remediation introduced no regression; the residual items are the pre-existing criteria-exec/regex robustness gaps + doc-list sync + a cache-key nuance.

Audit trail: each pass's full packet (config/state/registry/deltas/iterations/dashboard/report).

### Remediation of the findings (follow-on, landed under this phase)

All actionable findings were then fixed (operator directive "fix all with gpt-5.5"). Code fixes were drafted by gpt-5.5-fast (high) in the isolated `wt/0008-deep-review-fixes` worktree (RM-8), reviewed, and integrated to main; docs were done surgically by the operator. **Full suite 359/359 + drift guard 4/4 green on main.** Report: `remediation/gpt5-report.md`.

**Fixed (code):** criteria-exec gate flipped to **fail-closed** (runs only on `DEEP_AGENT_ALLOW_CRITERIA_EXEC=1|true`) in `score-model-variant.cjs`, with `bundle-gate.cjs` routed through the shared `criteriaExecAllowed` (the divergent inline copy removed) and **two gate tests updated** (`remediation.vitest.ts` + `bundle-gate-exec-gate.vitest.ts`) — the one intended behavior change; grader fallback regex made non-greedy/single-object (`harness.cjs`); grader cache key now includes `system_prompt_path` (prevents cross-system-prompt cache collisions); grader raw output **redacted by default**; `normalizeParsedPayload` split; `modeAScore` single-round confirmed; `scoreAssetRecall` return made symmetric; `scoreD2`/`scoreD3` JSDoc'd; `d4-ablation.cjs` shares `clampScore01`/`buildGraderBase`; double-wrapped RegExp simplified; sweep `_dispatch` test-seam documented; claude-only grader constraint commented.

**Fixed (docs):** SKILL.md §11 completed — added the 8 omitted skill-benchmark scripts + `dispatch-model.cjs` + `loop-host.cjs` + a scope note (scorer/lib/tests discovered dynamically). README script counts corrected — skill-benchmark `5 core`→`13`, headline `22`→`30 lane scripts`. §11 and README now agree at **30 lane-level scripts (8/3/13/6 by lane)**.

**Deferred / not-applicable:** `dispatch-model.cjs` 677-line split (gpt-5.5 deferred as higher-risk than a behavior-preserving fix); scoring_contract.md programmatic-validation tooling (P2 idea, larger). `scoring_contract.md:15` "refs may not exist" was a **false positive** (both referenced research docs exist).

> **Correction:** an earlier draft deferred the README count to "the parallel session's doc-accuracy commit." That commit (`1663527f79`) was **system-spec-kit's** work (its `026/.../013` + `014` packets) — it never touched deep-improvement's README/SKILL.md. The README count was unhandled; it is now fixed here.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A parameterized Node driver mirrors the deep-review `auto.yaml` main-loop contract for a single cli-opencode executor (per-iteration fresh-context dispatch → packet write → convergence check). It is run twice (once per model) into separate output dirs, in parallel (distinct providers). Dispatch is `--pure` (MCP-independent) and read-only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Two MiMo passes (run-to-run stability), not one frontier.** The operator originally chose MiMo + MiniMax-M3, then aborted MiniMax and replaced it with a second MiMo pass; two fresh MiMo runs measure finding stability — a stable, real issue should re-surface across independent passes.
- **Read-only, no worktree.** The loop only writes its own `015/review-*/` packet, so RM-8 worktree isolation is unnecessary.
- **`--pure` dispatch.** Keeps each review independent of the flaky code-graph/skill-advisor MCP servers.
- **Per-pass dirs under one phase.** Both reports stay side-by-side for direct comparison.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| MiMo run 1 complete | driver dashboard + state | PASS — 5 iters, 0 P0 / 8 P1 / 15 P2 |
| MiMo run 2 complete | driver dashboard + state | PASS — 5 iters, 0 P0 / 2 P1 / 12 P2 |
| Read-only invariant | review writes confined to `015/`; skill diff is only the external version bump | PASS |
| Per-pass reports | `review-*/review-report.md` present with verdict | PASS — both CONDITIONAL |
| Run-to-run comparison | this doc's comparison table | PASS — both P1s of run 2 overlap run 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Both reviewers are smaller/cheaper models tuned for format/brevity; expect strong structural/consistency findings and shallower deep-logic probing than a frontier reviewer.
- A session gap can interrupt a long loop (as happened to the prior MiMo run); partial packets persist and the report is synthesized from the registry with the gap noted.
<!-- /ANCHOR:limitations -->
