# Iteration 5 — mimo-v25-pro lineage
**Focus:** Final synthesis gaps and convergence check
**Model:** xiaomi/mimo-v2.5-pro via cli-opencode
**Timestamp:** 2026-06-15T12:44:00Z

---

## Findings

### M21: This lineage's unique contribution is the "cross-runtime transferability" lens

The codex-xhigh lineage focused on extraction + surface ranking. The opus-account2 lineage focused on the governor mechanism + measurement. This mimo-v25-pro lineage uniquely contributed:

1. **The thermostat is already cross-runtime** (M1) — the prior lineages flagged OpenCode/Codex hook reliability as "unverified," but the hook reference documents all three runtimes with smoke tests.
2. **OpenCode's hook is architecturally different** (M2) — system prompt mutation vs. additionalContext injection, which is actually *stronger* for a governor.
3. **The governor is model-specific** (M3) — the 8 rules target Opus's "anxious texture." Non-Anthropic models may need different rules or none at all.
4. **Five new surface types** (M6-M10) — agent prompts, renderPromptPack, post-dispatch-validate, executor-config, and constitutional memories as governor/measurement attachment points.
5. **Measurement is already cross-runtime** (M16-M17) — the deep-loop state JSONL is the universal data source; no runtime-specific log parsing needed.

**Source:** All 20 prior findings (M1-M20)

### M22: The one remaining gap is empirical — does mimo-v2.5-pro respond to fable-5 directives?

This is a question only the model can answer. The governor's 8 rules were designed for Opus's "anxious texture." mimo-v2.5-pro may:
- Not have the same failure mode (rules unnecessary)
- Have a different failure mode (rules need rewording)
- Respond well (rules transfer as-is)

This is not a research gap — it's an implementation gap. The recommendation set should include "empirical validation per model family" as a prerequisite for broad governor deployment.

**Source:** `external/opus-fable-mode-main/governor-block.md:4`, `external/opus-fable-mode-main/fable-mode.md:9-13`

### M23: Convergence assessment — newInfoRatio trend

| Iteration | Focus | newInfoRatio | Status |
|-----------|-------|-------------|--------|
| 1 | Cross-runtime hook architecture | 0.75 | complete |
| 2 | Surface map gaps | 0.80 | complete |
| 3 | Implementation path analysis | 0.70 | complete |
| 4 | Measurement harness portability | 0.65 | complete |
| 5 | Final synthesis gaps | 0.60 | complete |

**Trend:** Descending (0.75 → 0.60). The ratio is still above the 0.05 convergence threshold, meaning each iteration is still producing substantial new information. However, we've hit the max iterations (5) cap.

**Reason for non-convergence:** The research topic is broad (every adjustable surface × optimization), and this lineage focused on a specific angle (cross-runtime transferability). A 6th+ iteration could explore model-specific governor tuning or the executor fail-loud gap in more detail, but the core questions are answered.

### M24: Summary of net-new contributions vs. prior lineages

| Prior lineage claim | mimo-v25-pro correction/supplement |
|---|---|
| "OpenCode/Codex per-turn-hook read-reliability is unverified" | Verified — `skill_advisor_hook.md` documents all 3 runtimes with smoke tests (M1) |
| "The governor-on-hook is the best attachment point" | Split into two: hook for user-facing sessions, executor-config for deep-loop iterations (M10, M12) |
| "~17 constitutional memories" | Exact count: 16 rules + 1 README; 2 are round-1 products (M7) |
| "leak_test.py as measurement" | Standalone `fable_metrics.py` on deep-loop state files is more portable (M19) |
| (not named) | Agent prompts are the subagent injection surface for the governor (M6, M11) |
| (not named) | renderPromptPack is a template-driven behavioral injection point (M8, M13) |
| (not named) | post-dispatch-validate can carry behavioral advisory metrics (M9, M14, M18) |

### M25: Remaining open questions for the owner

1. **Model-specific governor tuning:** Should the governor rules be parameterized per model family (Opus-specific rules vs. generic efficiency rules)?
2. **Behavioral advisory severity:** Should behavioral advisories in post-dispatch-validate be warning-only or eventually promoted to blocking?
3. **Measurement baseline:** Should a `fable_metrics.py` baseline be captured before any governor changes, so the delta is measurable?
4. **Agent prompt modification scope:** Should the governor be added to all 12 agents or just the implementation agents (code, review, context)?

---

## Ruled Out (cumulative)
- Re-recommending round-1's shipped set
- Implementing the governor during research
- Modifying `leak_test.py` directly
- Optional variables in `renderPromptPack`
- Blocking behavioral gates in post-dispatch-validate
- Per-model governor variants in initial release
- Constitutional memories as behavioral surfaces
- Hook-Injected advisor context as governor without modification

## Assessment
- **newInfoRatio:** 0.60 (5 findings, mostly synthesis and gap analysis)
- **Status:** complete
- **Convergence:** NOT converged (ratio above threshold) but max iterations reached
- **Stop reason:** max_iterations
- **Total findings:** 25 (M1-M25)
- **Key questions answered:** 4/5 (the 5th — model-specific response — requires empirical testing)
