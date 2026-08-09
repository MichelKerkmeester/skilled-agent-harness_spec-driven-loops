# Iteration 3: Cost & Bloat Accounting per Surface (q3)

## Focus

Per-turn vs per-session cost of each injection surface, with source-executed byte measurements (same method as hooks/001), and the Pi visible-repetition economics after the 013 dedup.

## Findings

### F1. Source-executed byte measurements (this lineage, node Buffer.byteLength on live constants)

| Surface | Bytes | Basis |
|---|---|---|
| HYGIENE_DIRECTIVE | 207 | render.ts:106-108 |
| GOVERNOR_DIRECTIVE | 292 | render.ts:113-116 |
| TERMINAL_PROOF_DIRECTIVE | 256 | render.ts:121-123 |
| `\nDirectives:` label | 12 | render.ts:121 |
| **Directives block total (fallback)** | **767** | (001 measured 763 — same order; diff is capture detail) |
| Route head (`Advisor: stale; use cli-pi 0.95/0.20 pass.`) | 42 | (001: 43) |
| **Full brief (head + directives)** | **809** | (001: 806) |
| PI_SUBAGENT_DISPATCH_DIRECTIVE | **554** | prompt-advisor.ts:127-133 — re-measured, exact match with 001 |
| SessionStart context | ~389 | 001 representative capture (session-prime.ts) |
| Gate-3 question | ~521 | 001 capture, only when it actually asks |
| Active-goal brief | up to 4,800 chars | goal-core.cjs DEFAULT_MAX_INJECTION_CHARS=4800; renders only when an active goal record exists (none exists today — `.goal-state/` has README only) |

[SOURCE: render.ts:106-123, prompt-advisor.ts:127-137, goal-core.cjs:49, hooks/001 research.md:46-60]

### F2. Pi visible per-turn economics — the four cases

Pi is the only runtime where all of this is **[MSG]** (visible mid-prompt; injection-contract.md §1). Per turn, before the model call, Pi appends: advisor context (809 B full / 767 B fallback / 42 B dedup-reduced head) + dispatch directive (554 B, never deduped, prompt-advisor.ts:202-205) + goal brief when active.

| Case | Visible bytes/turn | Source |
|---|---|---|
| Turn 1 (head present) | 1,363 (809+554) | matches 001's Pi baseline `N*1,362` |
| Turn 2+ same epoch, head present, dedup ON | **596 (42+554)** | 013 suppression works: prompt-advisor.ts:236-240 |
| Turn 2+, **directives-only fallback** (no head) | **1,321 (767+554)** | dedup `splitPiDirectiveBrief` fails (index ≤ 0) → full delivery every turn |
| Turn 2+, goal active (adds brief) | 596 + up to 4,800 | goal-context.ts:55-63 |

10-turn session math (Pi, visible): all-head turns → 1,363 + 9×596 = **6,727 B** (013 dedup saves ~50.6% vs 13,630 B baseline); but if even 5 of 10 turns hit the directives-only fallback → 5×1,363 + 5×1,321 = **13,420 B** (savings collapse to ~1.5%). The fallback emission rate is the single dominant variable in Pi bloat — and it is outside the dedup's reach by construction.

### F3. Per-session surfaces are cheap by comparison

- Continuity: SessionStart ~389 B once per session + compact recovery on compaction events (rare) — ~0.4 KB/session vs ~6.7-13.4 KB/10 turns of per-turn chain. [SOURCE: injection-contract.md §4, 001 research.md:64]
- Dist-warning brief: OpenCode-only, event-driven before risky Bash — not on Pi, not per-turn. [SOURCE: injection-contract.md §2]
- Gate-3 question: 521 B but edge-triggered — only on mutation-classified prompts, once per session until answered (spec-gate-classify.ts:31-53). Cheapest-by-frequency of all surfaces.
- Active-goal brief: zero cost today (no active goal); bounded 4,800 chars when active; per-turn on Pi [MSG] when active.

### F4. What the never-activated 004 machine would change (context)

Route-only repeat (43 B) + dispatch 554 B = 597 B/turn on Pi repeats, and 43 B/turn on Claude/Codex/Devin/OpenCode repeats — vs today's 806 B on those runtimes ([SYS], invisible to humans but full context occupancy). Modeled 10-turn: 9,626 → 1,715 B (82.2%, shadow-computed only). Prompt caching is explicitly not a lever: cached reads remain context occupancy (002 spec.md). [SOURCE: 004 implementation-summary.md:76-91, 002 spec.md]

## Sources Consulted

- node source-executed measurement of render.ts/prompt-advisor.ts constants (this iteration)
- .opencode/hooks/goal/lib/goal-core.cjs:49, .opencode/hooks/goal/pi/goal-context.ts:55-63
- .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:202-244
- .opencode/hooks/injection-contract.md §1-2, §4
- hooks/001 research.md:46-64; 004 implementation-summary.md:76-91; 002 spec.md

## Assessment

- **newInfoRatio: 0.8** — Re-measured exact constants (F1) and derived the four-case Pi economics table and 10-turn fallback-collapse math (F2), which are new. 554 B/763 B headline figures were pre-known.
- **Confidence:** high — measurements are source-executed; the fallback-collapse math follows directly from code paths verified in iterations 1-2.
- **q3 answered in substance.**

## Reflection

- What worked: executing byte measurement against live source constants instead of trusting 001's numbers — confirmed within 4-6 B.
- What failed: nothing.
- Ruled out: counting continuity/dist-warning briefs as meaningful bloat contributors (they are per-session/event-driven, ~2-3% of the per-turn chain); treating the active-goal brief as a live cost (no active goal record exists).

## Recommended Next Focus

Iteration 4: Behavioral value evidence — what the directives/advisor actually do when present: root-doc duplication (AGENTS.md already carries the full policies; how much of the injected text is redundant with project context), the advisor routing value chain, and whether the Gate-3 question demonstrably changes operator behavior (migration design groundwork for q5).
