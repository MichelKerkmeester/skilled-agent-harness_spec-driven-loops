# Injection-Surface Deprecation Research

**Spec packet:** hooks/002-injection-bloat-reduction/014-injection-surface-deprecation-research · **Executor:** cli-pi (deepseek-v4-flash) · **Stop reason:** converged (composite 0.70 > 0.60; MAD + entropy signals; all legal-stop gates passed) · **Iterations:** 9 (of max 10) · **Lineage:** fanout-pi-1786264236566-r99u1v

---

## 1. Executive Summary

The repo should **not** deprecate its injection surfaces wholesale, nor reduce to "only the two proven smart injections." The evidence supports a three-tier disposition: **keep** the two proven smart injections (Gate-3 question, advisor route line), **keep** the opt-in/event-driven briefs (active-goal, continuity, dist-warning — all near-zero cost), and **redesign** — not flat-deprecate — the always-on constant per-turn text (the three directives, 767 B/turn; the Pi dispatch directive, 554 B/turn). The single highest-leverage defect is the **directives-only fallback** (767 B, emitted whenever the advisor yields no brief) that the 013 Pi dedup structurally cannot reduce: extending the dedup to the headless case is the smallest, safest, highest-ratio migration step. The never-activated full-first/route-only machine (004) is the correct migration destination for the directives on the four `[SYS]` runtimes, gated by the 007 evidence gate the program itself mandates.

---

## 2. Problem & Purpose

`hooks/001` measured the always-on directives at ~763-767 B (~190 E) ≈ 94.7% of the per-turn advisor payload, growing linearly with turns. `hooks/002` built a full-first/route-only-repeats dedup machine that is shadow-only with **0 of 30 activation-matrix cells live** (13 applicable, all `emit`, zero evidence fields). The Pi-local 013 dedup only partly helped because the advisor frequently emits a directives-only fallback (no advisor line) that the dedup skips. This research answers: which surfaces should be kept, deprecated, or redesigned, with a concrete migration path.

---

## 3. Method

Nine evidence iterations over the repository: full injection inventory with file:line citations (iter 1); activation-matrix and measurement-receipt verification, programmatic cell counts (iter 2); source-executed byte measurements and Pi per-turn economics (iter 3); behavioral-value analysis including the 037 gate-noise packet and live gate-state files (iter 4); disposition synthesis (iter 5); end-to-end verification pass (iter 6); end-state projections (iter 7); surface closure including a drift finding (iter 8); and a final numerical cross-check where the Gate-3 question measured **exactly 521 B** against 001's capture (iter 9). All load-bearing figures trace to source-executed measurements.

---

## 4. Key Findings by Question

### Q1 — Inventory (answered, iter 1)

Nine candidate surfaces across six runtimes, verified against `.opencode/hooks/injection-contract.md` and the code: (1) advisor brief = route line + three constant directives (render.ts:444-452); (2) directives-only fallback (render.ts:459-464); (3) advisor timeout fallback; (4) Pi subagent-dispatch directive 554 B (prompt-advisor.ts:127-133); (5) Gate-3 question (spec-gate-classify.ts:14-59); (6) active-goal brief (goal-context.ts:55-86); (7) SessionStart continuity brief (session-start-context.ts:33); (8) post-compaction recovery (session-compact-context.ts); (9) dist-warning brief (OpenCode only). Tool-time [BLOCK]/[LOG] injections (spec-gate enforcement, dispatch lint, route guard, post-edit quality, task-dispatch guard, sentinels) are event-driven, ruled out of the deprecation set. Pi per-turn [MSG] transform handlers are exhaustively just three: prompt-advisor, spec-gate-classify, goal-context (iter 6 F2, iter 8).

### Q2 — Activation/evidence (answered, iter 2)

`activation-matrix.json`: 30 cells = 17 N/A + 13 `emit`; **zero cells carry behavioral or delivery evidence**; `activationState: "all-candidate-flags-off"`. 004's route-only (43 B) is shadow-only — the full renderer is the only emitted path; its modeled 10-turn reduction (9,626 → 1,715 B, −82.2%) is receipt-reproduced in vitest. hooks/001's byte figures are source-executed estimates, explicitly not provider receipts.

### Q3 — Cost/bloat (answered, iter 3)

Pi visible per-turn chain (the only runtime where injections are human-visible [MSG]): 1,363 B first turn (809 advisor + 554 dispatch); 596 B dedup-working repeat (42 head + 554 dispatch); **1,321 B unreducible fallback repeat (767 + 554)**; + goal brief up to 4,800 B when an active goal exists (none today). 10-turn totals: 6,727 B (all-head) to 13,420 B (half fallback). Per-session surfaces (continuity ~389 B, dist-warning) are minor by comparison.

### Q4 — Proven vs unproven (answered, iter 2)

**Proven** = conditional, edge-triggered, evidence-gated: Gate-3 question (521 B; fires only on probable mutation, once per session; backed by [BLOCK] denial authority; live gate-state files; its per-turn noise defect is fixed in 037 — checklist fully green, fix in code: `shouldSuppressGate3Delivery` at spec-gate-core.mjs:343-358, path-answer grammar at :117-120) and the advisor route line (42 B, dynamic, in-vivo routing evidence — this lineage itself executed the deep-research skill because of it). **Unproven** = always-on constant text with zero activation evidence: the three directives and the Pi dispatch directive. The directives are not verbatim duplicates of AGENTS.md (governor/proof texts have zero hits in the root doc) but are designed as restatements of root-doc policy (AGENTS.md:417-419) — their marginal value above the always-loaded root doc is asserted, never demonstrated (iter 4 F1).

### Q5 — Disposition & migration (answered, iter 5, refined iters 6-8)

See §5-7 below.

---

## 5. Recommendations (per surface)

| # | Surface | Bytes | Verdict | Evidence basis |
|---|---|---|---|---|
| 1 | Gate-3 question | 521 (when asked) | **KEEP** — 037 fix already shipped in source | denial authority, live gate state, conditional trigger |
| 2 | Advisor route line | 42/turn | **KEEP** | in-vivo routing; 12-hub backbone; cheapest surface |
| 3 | Active-goal brief | ≤4,800 when active | **KEEP** (opt-in; zero cost today) | steering value; no active goal exists |
| 4 | Continuity briefs | ~389/session | **KEEP** | purpose-built for context loss; per-session only |
| 5 | Dist-warning brief | small | **KEEP** (OpenCode-only, event-driven) | stale-dist guard |
| 6 | Three directives | 767/turn | **REDESIGN** → once-per-session full + route-only repeats (activate 004 via 007 evidence gate) | 0/13 evidence cells; 94.7% of payload; AGENTS.md always loaded on Pi |
| 7 | Pi dispatch directive | 554/turn | **KEEP** — compact (006 prototype, ~116 B) only after the five-semantics proof | Pi-critical (013 decision record); naive compacts eliminated in 006 |
| 8 | Directives-only fallback | 767/turn | **REDESIGN** → 013 dedup must cover the headless case | currently skipped by `splitPiDirectiveBrief`; dominates the Pi worst case |

**Answer to the topic question:** the three always-on directives are the one surface that should be demoted from per-turn constants — but via the already-built dedup machine (redesign), not bare deprecation, because they exist to cover AGENTS.md absence on hook runtimes and the advisor-failure path. The Pi dispatch directive should be kept (Pi-critical). Active-goal/continuity/dist-warning briefs are not bloat — they are opt-in/event-driven. The "keep only the two smart injections" framing is too aggressive: the true bloat is **constant-text repetition**, not injection count.

---

## 6. Migration Path

1. **Extend the 013 dedup to the headless fallback** (`prompt-advisor.ts:230-283`): store and compare the directive block string even when `splitPiDirectiveBrief` finds no head; suppress on confirmed-session identical repeat within the epoch; all existing guardrails (fail-open, kill-switch, lifecycle re-delivery) already apply. Expected: Pi fallback turns drop 1,321 → 554 B; closes the "savings collapse" case. Feasibility verified in iter 6 F3.
2. **Verify 037 live** (gate-question noise fix is in source; checklist green) — completes the Gate-3 keep.
3. **Activate candidate 004 through the 007 evidence gate** on the four eligible runtimes (Claude/Codex/Devin/OpenCode): run the behavioral negative controls (long-context, advisor failure, no-match, comment-writing, completion-proof, advisory Gate, invalid-answer, child-session, resume, compaction), then flip matrix cells with receipts. Effect: 806 → 43 B on repeats (−82.2% modeled 10-turn). This is the redesign-as-activation step — never activate on byte savings alone (007 REQ).
4. **Pi directive delivery:** migrate Pi to epoch-based full-first + repeat suppression across both advisor shapes (head + fallback), and evaluate 006's compact dispatch directive against its five-semantics test map (native default, current-turn override, preload, anti-signal, child exclusion); keep the 554 B full text as the unconditional advisor-failure fallback.
5. **Single-source the directive block:** the OpenCode bridge's local fallback mirror emits only TWO directives (missing proof-over-appearance, bridge.mjs:368-373) — fix by routing through the canonical renderer (drift found iter 8 F4).
6. **Re-measure after each step** (002's measurement-first mandate) against 001's model; rollback per 007 (disable flag, clear delivery state, full baseline emission).

**End-state targets (10-turn):** four runtimes 8,060 → 1,193 B (−85.2%); Pi 13,630 → 2,347-6,855 B depending on fallback rate and compact-dispatch approval (floor 596 B/turn; 158 B/turn with proven compact).

---

## 7. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Flat removal of the three directives with no replacement | Breaks the AGENTS.md-absent case on hook runtimes and the Pi advisor-failure guardrail path; guardrail-preservation is a hard program constraint | render.ts:106 design comment; 004/007 fail-open policy | 5 |
| Deprecating the Gate-3 question or advisor route line | Both have the strongest behavioral evidence in the inventory; the noise defect of the question is already fixed (037) | 037 checklist green; spec-gate-core.mjs:343-358 | 4-6 |
| Naive 130-177 B compact of the Pi dispatch directive | Omits/unproves the five semantics (native default, current-turn override, preload, anti-signal, child exclusion) | 006 spec.md:62 (research.md Eliminated Alternatives) | 5 |
| Deprecating tool-time [BLOCK]/[LOG] injections (post-edit quality, dispatch guards, route guard, sentinels) | Event-driven, not per-turn; outside the topic's candidate list | injection-contract.md §3-4 | 1 |
| Treating hooks/001 byte counts as provider token/billing receipts | Explicitly documented as `ceil(UTF-16/4)` planning estimates | hooks/001 research.md:13 | 2 |
| Treating the 013 dedup as able to cover the directives-only fallback | Code-proven impossible: `splitPiDirectiveBrief` requires a head before `\nDirectives:` | prompt-advisor.ts:230-244 | 1-3 |

## 7A. Divergence Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none (single lineage, default convergence mode)
- Remaining frontier: none recorded

---

## 8. Open Questions (residual gaps)

1. **Provider token/billing receipts** — all byte figures are repository estimates; real tokenizer/billing/latency effects unmeasured (001 research.md:13,166).
2. **Fallback emission rate** — no telemetry counts how often the advisor yields no brief; the entire Pi cost spread (6.7 vs 13.4 KB/10 turns) pivots on this rate. `observeAdvisorPolicy`/shadow log already exposes a counting receipt.
3. **Behavioral equivalence of suppression** — the 007 negative-control suite has never run (0/13 evidence cells); 004 activation must not proceed without it.
4. **Cursor/Devin delivery verification** — Cursor's observed prompt lane measured zero; Devin's PostToolUse stdout handling unverified (001); Cursor/Pi "qualified but not activated" (004).
5. **Active-goal frequency** — no active goal exists today; per-turn necessity of the Pi goal brief when active is untested.
6. **SessionStart context composition** — 389 B rests on 001's representative capture; session-prime.ts emits composed templates whose shape varies by lifecycle (iter 9 F2).

---

## 9. Convergence Report

- **Stop reason:** `converged` — legal-stop gates passed.
- **Total iterations:** 9 (of max 10).
- **Signals (iter 9):** Rolling Avg (last 3: 0.35) → CONTINUE; MAD Noise Floor (latest 0.20 ≤ floor 0.222) → STOP; Question Entropy (5/5 = 1.00) → STOP. Composite stop score = 0.70 > 0.60.
- **Gates:** Convergence ✓ (MAD low-novelty holds); Coverage ✓ (5/5 evidence-backed); Quality ✓ (source diversity: 15+ distinct sources across 5 spec packets + live hook code + live state files; focus alignment: every iteration traced to q1-q5; no single-weak-source dominance); Graph gate N/A (no graphEvents).
- **Ratio trend:** 1.0 → 0.85 → 0.8 → 0.8 → 0.75 → 0.35 → 0.6 → 0.25 → 0.2 (declining to noise floor).
- **Stuck count:** 0. **Questions answered:** 5/5.

---

## 10. References

- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` (directives, renderer, fallbacks)
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` (Pi adapter, dispatch directive, 013 dedup)
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` (fallback call site, line 272)
- `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` (OpenCode bridge, 2-of-3 directive mirror drift)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` (Gate-3 question 521 B, suppression fix)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts`, `session-start-context.ts`, `session-compact-context.ts`, `session-stop-context.ts`
- `.opencode/hooks/goal/pi/goal-context.ts`, `.opencode/hooks/goal/lib/goal-core.cjs`
- `.opencode/hooks/injection-contract.md` (canonical injection inventory)
- `specs/hooks/001-per-prompt-injection-audit/research/research.md` (measurement receipts)
- `specs/hooks/002-injection-bloat-reduction/{spec.md, 004-full-first-route-only-repeats/implementation-summary.md, 006-pi-dispatch-and-compaction/spec.md, 007-guardrail-controls-and-activation/{spec.md, activation-matrix.json}, 013-pi-local-directive-dedup/{spec.md, implementation-summary.md}}`
- `specs/cli-external-orchestration/037-spec-gate-question-noise/{spec.md, checklist.md}`
- `AGENTS.md` (lines 58, 417-419); `.opencode/skills/.spec-gate-state/` (live gate state + warnings log)
- Iteration files 001-009 under `iterations/` (this lineage)
