---
title: "Implementation Summary: mk-deep-loop-guard Orchestrate Loop-Detection Hardening"
description: "5-iteration dual-model research (3 GPT-5.5-fast/high + 2 GLM-5.2/max) on extending mk-deep-loop-guard.js to mechanically detect loop-like repeated orchestrate-to-command-owned-loop-executor dispatches. Both lineages independently converged on session-scoped state + an iteration-aware heuristic. Surfaced and independently re-verified a load-bearing fact: orchestrate's Task dispatches always set subagent_type='general', so real identity must come from prompt-text parsing."
trigger_phrases:
  - "implementation"
  - "summary"
  - "mk-deep-loop-guard hardening"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/003-guard-and-enforcement/002-mk-deep-loop-guard-hardening"
    last_updated_at: "2026-07-01T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Research complete and synthesized; awaiting operator decision"
    next_safe_action: "Operator picks Option A/B; open a new phase to implement"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-016-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Both lineages recommend Option B (external state + iteration-aware counting) with Option A (in-process counter) as a viable lower-blast-radius first step."
---
# Implementation Summary: mk-deep-loop-guard Orchestrate Loop-Detection Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-mk-deep-loop-guard-hardening |
| **Completed** | 2026-07-01 |
| **Level** | 1 (research-only) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing shipped this phase — it's research grounding a future implementation. Two independent fan-out lineages (`cli-opencode openai/gpt-5.5-fast` high + `cli-opencode zai-coding-plan/glm-5.2` max) investigated whether `.opencode/plugins/mk-deep-loop-guard.js` (currently a single-dispatch mode-mismatch detector) can be extended to mechanically catch repeated/loop-like `orchestrate`-to-loop-executor dispatches, addressing phase 012's measured GPT-5.5 enforcement inconsistency (refused one direct `deep-research` dispatch, allowed an identical direct `deep-review` dispatch).

### Convergent Findings (both lineages independently agree)

1. **Session-scoped state is available and precedented.** `tool.execute.before` exposes `sessionID`/`callID` on every call. Three sibling plugins (`mk-spec-memory.js`, `mk-code-graph.js`, `mk-skill-advisor.js`) already use in-process closure-scoped `Map`s; `mk-goal.js` uses external per-session JSON state at `.opencode/skills/.goal-state/{hex(sessionID)}.json`. Both mechanisms are real, working precedent — no OpenCode core changes needed.
2. **The "exactly one bounded hand-off" contract is stated in 4 independent living docs** (`cli-opencode/SKILL.md`, `references/agent_delegation.md`, `orchestrate.md`, `deep-review.md`) but is currently *wording only* — nothing mechanically enforces it.
3. **A naive repeat-count would false-positive on legitimate command-driven loop iterations** (a `/deep:review` YAML dispatching `@deep-review` N times is not the same as `orchestrate` re-implementing a loop). Both lineages independently recommend an "iteration-state heuristic" — skip counting when the prompt carries markers like `Iteration: N of M` / `STATE SUMMARY`, since those indicate the parent command already owns the loop.
4. **Recommended threshold**: 1st same-executor hand-off = silent allow, 2nd = warn (accommodates a legitimate retry), 3rd+ = warn (default) or block (`MK_DEEP_LOOP_GUARD_REJECT_LOOP=1`, an opt-in new env var separate from the existing `MK_DEEP_LOOP_GUARD_REJECT`).

### One Load-Bearing Divergence, Independently Resolved

GLM's research made a stronger, more specific claim than GPT's: **`subagent_type` is always the literal string `"general"`** for every agent `orchestrate` dispatches, evidenced by `orchestrate.md`'s own Priority table (every row) and its dispatch template ("`Subagent Type: "general"` (ALL dispatches use `"general"`)"). GPT's research treated `subagent_type` as a secondary/fallback signal rather than stating it's *always* uninformative.

**Independently re-verified this claim myself** (not trusted from research alone) by reading `orchestrate.md`'s Priority table and dispatch-template sections directly: **confirmed true.** This has a real consequence beyond phase 016's scope: `mk-deep-loop-guard.js`'s *existing*, already-shipped mode-mismatch check does `registry.get(args.subagent_type)`, and the registry Map is keyed by real agent names (`deep-review`, `ai-council`, etc. — confirmed via direct read of `loadRegistryAgents()`). Since real `orchestrate`-routed Task dispatches send `subagent_type: "general"`, `registry.get("general")` returns `undefined`, and the existing guard's mode-mismatch check **silently no-ops for the exact real-world dispatch path it was built to guard.** My own earlier live verification of that guard (phase 011) used a non-representative test harness that set `subagent_type` directly to the real agent name, which does not match how `orchestrate` actually dispatches — so that earlier "PASS" evidence does not cover real usage. This is flagged as a separate, real finding for the eventual implementation phase to address (both proposed designs already require prompt-text parsing, which happens to fix this too).

### Design Option A: In-Process Counter (both lineages, as the lightweight variant)
Closure-scoped `Map<sessionID, Map<executorType, count>>`. Parse prompt for loop-executor identity (via `Agent:`/`Deep Route:` text, not `subagent_type`). Skip counting when iteration-state markers are present. ~40 lines added. Lower complexity, weaker persistence (lost on process restart), lower audit trail.

### Design Option B: External State + Iteration-Aware Counting (both lineages' primary recommendation)
Follow the `mk-goal.js` pattern: persist per-session dispatch log to a new `.opencode/skills/.loop-guard-state/{hex(sessionID)}.json`, each record tagged `commandDriven: true/false` via the iteration-state heuristic, counting only non-command-driven dispatches. ~80 lines. Higher complexity, but lower false-positive risk, survives resume/fork, full audit trail.

### Design Option C: Prompt-Shape Companion Guard (GPT only, complementary)
Require `execution=single_iteration` and the correct `source_of_truth` on any Deep Route header targeting a loop executor; warn/block on `execution=loop|session`. Catches malformed-intent on the *first* dispatch, before any repeat-count logic runs. Recommended as a pairing with A or B, not a replacement.

### Files Read (no files modified — this phase is research-only)

Both lineages' `research/lineages/{gpt-fast-high,glm-max}/research.md`, plus direct verification reads of `.opencode/agents/orchestrate.md`, `.opencode/plugins/mk-deep-loop-guard.js`, and `.opencode/skills/deep-loop-workflows/mode-registry.json`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Launched both lineages in parallel via `fanout-run.cjs --loop-type research` with an explicit `--research-topic` covering 4 concrete questions (SDK session-state capability, mechanical definition of "loop-like", current dispatch-contract grounding, phase 012 evidence). Both completed cleanly (`status: fulfilled`, exit 0) — `gpt-fast-high` in ~13 minutes, `glm-max` in ~11 minutes.

Rather than accepting either synthesis at face value, cross-checked them against each other first: both independently reached the same core design (session-scoped state + iteration-aware heuristic), which is itself a form of validation. Where GLM made an additional, more specific claim GPT didn't (`subagent_type` always `"general"`), treated it as a hypothesis requiring direct verification rather than either trusting it because one model said so or discounting it because the other model didn't corroborate it. Confirmed it directly against `orchestrate.md`'s real content, which also surfaced a real, previously-unknown gap in phase 011's already-shipped guard.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Independently re-verified GLM's `subagent_type="general"` claim before trusting it | It was the single most consequential, load-bearing, and specific claim in either research output — exactly the kind of claim that should be checked directly rather than trusted because an AI said so, per this session's established verification discipline. |
| Did not silently discount GLM's claim just because GPT's research didn't state it as strongly | GPT's research didn't contradict the claim, it just treated `subagent_type` as secondary rather than always-uninformative — the two are compatible, not conflicting. |
| Flagged the phase-011 guard gap as a separate finding rather than silently expanding this phase's scope to fix it | This phase's charter is research on loop-detection specifically; the mode-mismatch guard gap is a distinct, real defect that deserves its own decision and fix, not a scope-creep patch bundled into a research summary. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both fan-out lineages complete | PASS — `status: fulfilled`, exit 0 both |
| `research.md` present for both lineages with file:line evidence | PASS |
| Cross-lineage convergence check | PASS — both independently reached the same core design |
| Independent re-verification of the load-bearing `subagent_type="general"` claim | PASS — confirmed true via direct read of `orchestrate.md` |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No implementation yet.** This phase produces design options, not code. A future phase must pick one and write a real spec/plan.
2. **The phase-011 guard gap (subagent_type="general" making the existing mode-mismatch check a no-op for real orchestrate dispatches) is flagged, not fixed here** — it needs its own decision on urgency/scope (is it worth a standalone hotfix phase, or folded into whichever phase implements this hardening, since both require the same prompt-text-parsing fix).
3. **`prompt-improver` has no entry in `mode-registry.json`** (both lineages independently noted this) — the eventual implementation needs a static fallback identity set for it, or an addition to the registry.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

Open a new phase (`017`) once the operator picks a direction:
1. **Recommended**: Implement Option B (external state + iteration-aware counting) directly, since both lineages independently converged on it as the primary recommendation and it has the lowest false-positive risk.
2. **Lower blast-radius alternative**: Implement Option A first (in-process counter), collect real telemetry, then upgrade to Option B once the iteration-state heuristic is validated against real session traffic.
3. **Either way**: pair with Option C (prompt-shape companion guard) for immediate malformed-intent detection, and fix the flagged `subagent_type="general"` gap in the existing mode-mismatch check as part of the same prompt-parsing work (it's the same underlying fix).
4. Decide whether the phase-011 guard gap warrants an interim standalone note/hotfix before phase 017 lands, given it means the shipped mode-mismatch detector currently doesn't fire on real `orchestrate`-routed dispatches.
<!-- /ANCHOR:followup -->
