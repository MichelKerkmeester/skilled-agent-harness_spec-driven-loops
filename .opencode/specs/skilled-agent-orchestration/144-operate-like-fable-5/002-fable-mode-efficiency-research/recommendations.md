---
title: "Fable-5 Efficiency — Ranked Surface×Delta Recommendations (6-lineage, sign-off)"
description: "The ranked, tiered (A doctrine / B mechanism / C measurement), deduped-vs-round-1 recommendation map for moving the framework toward fable-5 efficiency, consolidated across 6 research lineages. Research-only — awaiting owner sign-off."
trigger_phrases:
  - "fable-5 recommendations"
  - "149 recommendations map"
  - "fable mode efficiency recommendations"
importance_tier: "important"
contextType: "implementation"
---

# Fable-5 Efficiency — Recommendations (sign-off deliverable)

**Status:** RESEARCH-ONLY — recommend, do not edit any framework surface. **Awaiting owner sign-off** before any implementation.
**Provenance:** 6 research lineages — `codex-xhigh` (gpt-5.5 xhigh), `opus-account2` + `opus-account2-r4` (claude-opus-4-8 ×2, the second a reproducibility pass that re-derived the same ranking), `deepseek-v4-pro`, `mimo-v25-pro`, `kimi-k2p7` (partial). Detail + convergence: `research/research.md` (§1, §8, §8.7). Dedup baseline: round 1 (`001-initial-refinement/`).
**Scoring:** `Score ≈ Leverage / (Cost + Blast)`, each 1–5 (ordering aid, not precision). **Conv** = lineages backing it. **Class:** *structural* = enforced code in `deep-loop-runtime` (survives, subagent-visible); *advisory* = text on a read surface (decays, subagent-blind). **Port** = portability (agnostic / Anthropic-specific / executor-portable).

> **The one-line thesis (6/6 agreement; the 2nd opus run reproduced the 1st):** round 1 already landed the *doctrine* in the highest-read text. Round 2+3's leverage is **mechanism + measurement**, sequenced **structural-first**: make provenance honest, open the subagent governor channel, ride the live per-turn hook with a compact generic governor, and *measure* the change — so "fable-5 efficiency" becomes verified, not asserted. Per the source's own honesty (G4): this steers **efficiency** (token burn, context decay, result-first output), not capability.

---

## Tier A — doctrine text into hot surfaces (cheap, durable, low-blast)

| # | Recommendation | Surface (file) | Lev | Cost | Blast | Score | Conv | Dedup | Port |
|---|----------------|----------------|----:|-----:|------:|------:|------|-------|------|
| A1 | **Fix the dead AGENTS.md hook pointer** — `AGENTS.md:217` cites `references/hooks/skill-advisor-hook.md` (hyphens); the real file is `skill_advisor_hook.md` (underscores). One-character-class edit + a pointer-resolution grep-test (the F6 "rot → fail-loud check" worked example). **Load-bearing:** this exact pointer made the deepseek lineage falsely conclude "OpenCode has no per-turn hook." | `AGENTS.md:217` (+ a check) | 4 | 1 | 1 | **2.0** | 4/6 (3 lineages flag) | net-new | agnostic |
| A2 | **Efficiency doctrine-spine** — ~10 lines in `AGENTS.md` §1: the root conviction (*spend lavishly where confirmation is cheapest to skip*), the two-register voice, and letter-vs-intent. Pair with B2 so it doesn't decay. Fits the ~76-line headroom under the ~500-line twin budget. | `AGENTS.md`/`CLAUDE.md` §1 | 3 | 1 | 2 | **1.0** | 4/5 | net-new (NOT a round-1 restate) | agnostic |
| A3 | **Scar-tissue + cold-successor handoff discipline** — traps ledger (blast-site + activation + load-bearing-vs-defensive) and numbered cold-read order. | `handover.md` + `_memory.continuity` templates | 3 | 2 | 1 | **1.0** | 4/5 | net-new | agnostic |

## Tier B — mechanisms (the efficiency core)

| # | Recommendation | Surface (file) | Class | Lev | Cost | Blast | Score | Conv | Dedup | Port |
|---|----------------|----------------|-------|----:|-----:|------:|------:|------|-------|------|
| ★B1 | **Fail-loud executor provenance** — `executor-audit.ts:485` already records the actual model; add a requested-vs-actual diff and emit `error`/`blocked_stop` on mismatch/crash instead of silently substituting. **One comparison away.** Protects the rule that artifact claims must not lie. | `executor-audit` + `fallback-router` (deep-loop-runtime) | **structural** | 5 | 3 | 3 | 0.83 | 4/6 flag (deepseek **#1**) | = round-1 follow-up | agnostic |
| B2 | **Compact fable-5 governor capsule on the live per-turn hook** — 4 generic rules (below) as a **single ~90-word paragraph** (`reinject.sh:16-18` proves the whole 8-rule governor fits one paragraph — no twin bloat). Ride the firing skill-advisor hook (Claude/Codex `additionalContext`; OpenCode `chat.system.transform`). Start generic; specialize per model-family later. | skill-advisor `user-prompt-submit` reminder | advisory | 5 | 1 | 2 | **1.67** | **6/6 STRONG** | net-new | executor-portable |
| ★B3 | **Inject the governor into agent prompts / `renderPromptPack`** — the only subagent-visible channel (the hook is subagent-blind). | agent prompts + `renderPromptPack` | **structural** | 5 | 3 | 3 | 0.83 | 3/5 | net-new (needs mirror-sync) | executor-portable |
| B4 | **Mutation-check / claim-falsifier discipline** — after green, break the code to confirm the test bites; true-RED vs compile-RED; hunt vacuous green. | `sk-code` verification (+ optional rule) | advisory | 5 | 2 | 1 | **1.67** | **6/6 STRONG** | net-new | agnostic |
| B5 | **Verification-ladder + decision-economy + fail-closed** — named blind spots per rung; named seam not bare TODO; structural not disciplinary invariants. | `sk-code` (+ deep-review) | advisory | 3 | 1 | 1 | **1.5** | 3/5 | partial | agnostic |
| B6 | **Optional `governor` field on `executorConfigSchema`** — per-lineage/per-model governor for deep-loop runs. | `executor-config.ts` | structural | 4 | 3 | 3 | 0.67 | 2/5 (mimo) | net-new | executor-portable |

## Tier C — measurement (make efficiency measured, not asserted)

| # | Recommendation | Surface (file) | Lev | Cost | Blast | Score | Conv | Dedup | Port |
|---|----------------|----------------|----:|-----:|------:|------:|------|-------|------|
| C1 | **Standalone `fable_metrics.py`** — reads deep-loop state JSONL + iteration markdown; computes tool:text ratio, median words/msg, self-opener %, unsolicited-caveat %, evidence-backed-completion ratio. Runtime/model-agnostic (vs `leak_test.py`, hard-wired to `~/.claude/projects/`). | new script + `/doctor` or `deep:*-benchmark` route | 4 | 3 | 1 | **1.0** | **6/6 STRONG** | net-new | executor-portable |
| C2 | **Non-blocking behavioral advisories** in `post-dispatch-validate` — warn on low tool:text, self-openers, high caveat density. Advisory until baselines exist. | `post-dispatch-validate.ts` | 3 | 3 | 2 | 0.6 | 2/5 (mimo) | net-new | executor-portable |

## Dedicated packets (structural TypeScript — not surgical drops)

- **P1 — Machine-checkable evidence contract.** Forced `claim_class` / `would_confirm` / `gate_delta` / `scope_state` / `child_result_verified` schema at `post-dispatch-validate` / agent-I/O. **Still open** (grep: zero hits across `deep-loop-runtime` + `system-spec-kit/references`). High leverage, high cost. *(= round-1 carried follow-up.)*
- **P2 — = B1.** The codex SIGKILL / silent-gpt-5 fallback is the same defect as B1; `fallback-router.ts:32-39` handles only quota-pool exhaustion, not model substitution. Schedule B1 as its own hardening packet.

---

## Land-first shortlist (highest leverage ÷ blast; ordered)

1. **A1 — fix the dead pointer** (trivial, now proven load-bearing).
2. **C1 — capture a behavioral baseline** *before* any governor change, so movement is provable.
3. **B2 — governor capsule on the hook** (generic rules) — 6/6, cheapest high-leverage behavioral lever.
4. **B4 — mutation-check into sk-code** — 6/6.
5. **B1 — fail-loud executor provenance** (structural; protects "claims don't lie").

## Implementation sequence (structural-first, per deepseek; adopted)

1. **Baseline** (C1) — measure current tool:text / words / openers from existing deep-loop state files.
2. **Structural enforcement** (B1 fail-loud + B3 subagent channel) — make provenance honest; open the governor channel.
3. **Governor capsule** (B2) for main-session agents (B3 covers subagents). Generic rules first.
4. **Re-measure** (C1) — confirm the needle moved before going further.
5. **Rituals + doctrine** (B4/B5, A1/A2/A3) — point-of-use and durable text.
6. **Dedicated packets** (P1 evidence contract; B1/P2 if not already shipped in step 2).

## Governor capsule — 4 portable rules (concrete, B2)

1. **Reason about the problem, not yourself.** Drop self-referential thought; return to the task.
2. **Outcome over visible process.** Open with the result/object ("Done.", "The page now…"), not "I'll"/"Let me"; batch tool calls; report at natural checkpoints.
3. **Commit and move.** Reversible decisions are cheap — make them, mark `// DECISION:`, proceed; reserve `[UNCERTAIN:]` for real irreducible uncertainty.
4. **Minimum honest qualifier.** Hedge only when the caveat changes what the reader should do — once, fewest words.

*(Inherits the source guardrail: emulate strengths not costs; scale rigor to blast radius; not a license to spawn fleets for a one-liner.)*

## Eliminated alternatives (negative knowledge)

Re-recommending round-1's shipped set (out of scope); verbatim `governor-block.md` paste (bloats the near-budget twin); porting `leak_test.py` as-is (Claude-path-coupled); "OpenCode has no per-turn hook" (**refuted** — `chat.system.transform`); AGENTS-only governor (setpoint decays without the thermostat); hand-editing the 3 agent mirrors without a sync mechanism; treating all governor rules as equally portable (rules 1–2 are Anthropic-specific); blocking behavioral gates before baselines exist.

## Open questions for the owner (resolve at implementation)

1. Governor rules **generic** vs **model-family-specific** — recommendation: ship generic, specialize later.
2. OpenCode `chat.system.transform` **per-turn vs cached** semantics — confirm before relying on it as a true thermostat cross-runtime (the *existence* of a rideable surface on all 3 runtimes is settled).
3. Measurement delivery: `/doctor fable-mode` (diagnostic) vs a `deep:*-benchmark` lane (fixture-scored).
4. Behavioral advisories: keep **advisory**, or later promote to **blocking**?
5. P1 (evidence contract) and B1 (fail-loud) are structural — schedule as their own packets, owner-directed.

---

**NEXT STEP: owner review.** No framework surface has been edited. On your sign-off, each item can be picked up item-by-item as a gated implementation packet (Tier A/B/C or the dedicated packets above).
