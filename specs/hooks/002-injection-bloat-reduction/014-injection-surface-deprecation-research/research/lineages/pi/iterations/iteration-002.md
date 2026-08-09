# Iteration 2: Activation & Measurement Evidence — Proven vs Unproven

## Focus

Per-surface evidence of behavioral value: the 007 activation matrix (30 cells), 004 shadow receipts, hooks/001 source-executed measurements, and the 013 Pi-local dedup gap. Goal: separate proven surfaces from unproven ones (q2 + q4).

## Findings

### F1. The activation matrix is fully fail-open: 13 applicable cells, 0 live, 0 with evidence

`activation-matrix.json` (007) contains 30 cells (6 runtimes × 5 candidates 002-006): 17 N/A (inapplicable runtime×candidate), 13 `verdict: "emit"`, and **zero** cells with `behavioralEvidence` or `deliveryEvidence` populated. `activationState: "all-candidate-flags-off"`; policy `defaultVerdict: "emit"`, `activationRequires: ["behavioralEvidence","deliveryEvidence"]`. Confirmed by direct JSON read + count. [SOURCE: specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.json]

### F2. Candidate 004 (full-first/route-only) is shadow-only; the full renderer remains the only emitted path

004 implementation summary: `renderAdvisorBrief()` "still returns the legacy full render on every path; shadow observation is side-effect-only". Route-only estimate 43 bytes; modeled 10-turn scenario `9,626 -> 1,715 B` (82.2%) — **shadow computation only**, reproduced in vitest (`SHADOW_REDUCTION observedReceipt=true baselineBytes=9626 shadowBytes=1715 reductionPct=82.2`). The candidate was ranked "bytes high, behavior low; shadow/eval only" in research.md rank 4; Cursor and Pi were explicitly "qualified but not activated" (incomplete runtime delivery/receipt evidence). [SOURCE: specs/hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats/implementation-summary.md:55-91,135]

### F3. hooks/001 measured source-executed bytes (not provider receipts)

- Directives-only fallback `D` = **763 B / 190 E**; route line adds 43 B → 806 B representative advisor payload.
- **Directive component = 94.7%** of the 806 B block; the advisor token cap applies to the route prefix only — directives concatenate after the cap.
- Gate-3 question = **521 B** "when it actually asks"; Pi dispatch directive = **554 B**; representative SessionStart context = **389 B**.
- Baseline model: `N*806 + g*522 + c*389`; Pi baseline `N*1,362 + g*523 + c*389` (Pi ≈ 1,362 B/turn = 806 advisor + 554 dispatch + 2 B). Modeled N=100,g=10,c=2: 86,598 → 8,933 B (89.7%) under the full reduction program.
- Caveat: byte measurements are `ceil(UTF-16/4)` planning estimates, "not provider tokenizer or billing receipts"; real tokens/billing/latency remain open empirical subquestions. [SOURCE: specs/hooks/001-per-prompt-injection-audit/research/research.md:5,13,46-60,64,96]

### F4. The directives-only fallback fires whenever the advisor produces no brief — every such turn is a full 763 B repeat

The maintained Claude adapter (used by Pi via `handleClaudeUserPromptSubmit`) emits `brief ?? renderAdvisorFallbackDirective(renderOptions)` (user-prompt-submit.ts:272). `renderAdvisorBrief` returns null when status ≠ ok, freshness not live/stale, no recommendation passes threshold, or the skill label folds instruction-shaped (render.ts:417-438). In every such turn the fallback (763 B, no advisor head) is delivered — and 013's Pi dedup cannot reduce it because `splitPiDirectiveBrief` requires the `\nDirectives:` separator at index > 0 (prompt-advisor.ts:230-244). This confirms the task context: "the advisor frequently emits a directives-only fallback with no advisor line that the dedup skips." [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:272, render.ts:417-464, prompt-advisor.ts:230-244]

### F5. The three always-on directives have NO activation/behavioral evidence — they are unproven by the program's own standard

The 007 gate's rule is "no evidence, no activation, ever" (spec REQ, 007 spec.md:81). The directives are always-on per-turn emissions that never passed any behavioral negative control; the entire 002 program exists to reduce them, and every reduction mechanism (003/004/006) is shadow-only. Under the program's own evidence standard, the always-on directives and the Pi dispatch directive (554 B, never deduped, prompt-advisor.ts:202-205) are **unproven** — no behavioral-equivalence or delivery evidence exists for any of them.

### F6. What IS proven (evidence-backed smart injections)

- **Gate-3 question (521 B, conditional):** proven by (a) the classifier's tested behavior — `gate-3-classifier.ts` / `classifyIntent` with sanitizer contract and tests; (b) it fires only when a mutation is probable, once per session until answered (edge-triggered, not per-turn); (c) it is the documented Gate-3 HARD BLOCK in AGENTS.md with enforcement via spec-gate [BLOCK] denials — a behavioral control that demonstrably changes action (denies writes). The 005 candidate (Gate suppression) exists to REDUCE its frequency but is itself unactivated — i.e., the surface is proven, the reduction isn't.
- **Skill-advisor route line (43 B, conditional):** proven by (a) threshold behavior (0.8 confidence / 0.35 uncertainty, passes-threshold filter in render.ts:417-426); (b) fail-open design with freshness gating; (c) skill-routing tests and the advisor's own routing value documented in the skill advisor suite. It is cheap (43 B) and per-turn, but unlike the directives it is dynamic content (the actual recommendation).

## Sources Consulted

- 007 activation-matrix.json (all 30 cells counted programmatically)
- 004 implementation-summary.md (lines 55-91, 105-110, 135, 159-162)
- hooks/001 research/research.md (lines 5, 13, 46-64, 96, 133, 166)
- system-skill-advisor/hooks/claude/user-prompt-submit.ts (line 272)
- system-skill-advisor/mcp-server/lib/render.ts (lines 417-475)
- system-skill-advisor/hooks/pi/prompt-advisor.ts (lines 202-244)
- 013 implementation-summary.md (lines 57, 68, 81, 94, 97)

## Assessment

- **newInfoRatio: 0.85** — Headline numbers (0/30 activation, 763 B, 554 B) were seeded from task context, but file-level verification, the 13-vs-17 cell split, the `brief ?? fallback` emission path (F4), and the F6 proven/unproven split are new to this lineage.
- **Confidence:** high on matrix state (direct JSON count), high on fallback emission path (code), medium-high on 001 byte figures (documented as estimates, not provider receipts).
- **q2 and q4 materially advanced**; q4 answered in substance (proven = conditional, edge-triggered, evidence-gated; unproven = always-on constant text with zero activation evidence).

## Reflection

- What worked: counting matrix cells programmatically (13 emit / 17 N/A / 0 evidence) and tracing the fallback call site gave crisp proof.
- What failed: nothing material.
- Ruled out: treating hooks/001 bytes as token billing receipts (they are explicit estimates); treating the 013 dedup as able to cover the directives-only fallback (code-proven impossible).

## Recommended Next Focus

Iteration 3: Cost/bloat accounting per surface (q3) — per-turn repetition economics on Pi (visible [MSG] repetition: advisor brief + dispatch directive + active-goal brief chain), plus where the continuity/dist-warning briefs fire and their costs; also quantify the 013 dedup's actual reduction when the advisor head IS present.
