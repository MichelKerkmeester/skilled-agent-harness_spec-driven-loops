# Research Synthesis — Fable-5 efficiency (round 2, merged)

**Spec folder:** `144-operate-like-fable-5/002-fable-mode-efficiency-research` · research-only.
**Lineages merged:** 2 — `codex-xhigh` (cli-codex `gpt-5.5` xhigh/fast, 6/10 iters, converged, newInfoRatio 0.92→0.04) + `opus-account2` (cli-claude-code `claude-opus-4-8` on account2, 5/5 iters, newInfoRatio 0.95→0.15). Models verified directly from each lineage's `deep-research-config.json` (the `fanout-attribution.md` shows "unknown" — a merge-cosmetic gap, not a model gap). 30 consolidated findings in `deep-research-findings-registry.json`.
**Provenance caveat:** the codex lineage ran **in-seat on gpt-5.5** (the `cli-codex` self-invocation guard forbids nested codex dispatch), so it did not re-dispatch per iteration — content-complete, process-degraded. Not a silent gpt-5 fallback (model confirmed). Full per-lineage detail: `research/lineages/{codex-xhigh,opus-account2,kimi-k2p7,mimo-v25-pro,deepseek-v4-pro}/research.md`.

> **Round-3/4 update (now 6 lineages).** Three small models were added via `cli-opencode`, each ×5: `kimi-for-coding/k2p7`, `xiaomi/mimo-v2.5-pro`, `deepseek/deepseek-v4-pro` (models smoke-verified live before launch); then a second independent `claude-opus-4-8`/account2 lineage (`opus-account2-r4`, 5/5) as a reproducibility check — see §8 and §8.7. `deepseek` converged (0.95→0.06, 5/5); `mimo` ran 5/5 (25 findings, M1–M25); `kimi` wedged after a clean 4 iterations (alive but ~0 CPU / no writes for ~77 min — a known small-model hang) and was operator-killed, contributing its 4 iterations + a registry. The small models emit **non-canonical artifacts** (mimo/deepseek wrote `research.md` but no `deep-research-findings-registry.json`; kimi wrote a differently-named/schema'd registry), so `fanout-merge` consolidated the conformant registries (codex + both opus runs = 35 findings) — the three small-model lineages were **integrated by hand** from their `research.md`/iterations. They **strengthened the land-first cluster to a 6-lineage signal** and added three analytical lenses plus one adjudicated conflict — see **§8** and **§8.7**.

---

## 1. Headline (strong cross-lineage convergence)

Both models, run independently, reached the **same conclusion**: round 2 should **not** add another large doctrine block (round 1 already landed the doctrine in the highest-read text surfaces). The new leverage is **mechanism + measurement**, and both lineages independently ranked the **same land-first cluster**:

1. **Ride the already-live `UserPromptSubmit` hook with a compact fable-5 governor** (the "thermostat" the opus repo invented — we already have it firing every turn).
2. **A `leak_test`-style behavioral metric** (tool:text ratio, result-opener %, unsolicited-caveat %, words/msg) as a `/doctor` or `deep:*-benchmark` surface — so "fable-5 efficiency" becomes *measured*, not asserted.
3. **Fix the executor fail-loud / model-mismatch gap** (the carried round-1 SIGKILL/silent-gpt-5 defect) — both lineages flag it as not-optional, because it protects the core fable rule that artifact claims must not lie.

Per the opus source's own honesty (G4): these steer **style + persistence (efficiency)**, not capability. The capability lever is task-structure + multi-LLM orchestration. The spec asked for *efficiency* — which is exactly what these buy: less token burn (tool:text 1.41→3.91), less context decay (the hook defeats setpoint decay), more result-first output. [SOURCE: external/opus-fable-mode-main/README.md:6-21]

---

## 2. EXTRACT — net-new fable-5 logic (Pillar 1)

Deduped against `external/Fable5.md` and round-1's shipped set (Operating Discipline subsection, the 2 constitutional rules, the `main-branch-direct-push.md` fold, the sk-code line).

**From `fable-mode-main/` (engineering method), F1–F15** [SOURCE: external/fable-mode-main/fable-mode-profile.md:21-31,58-461]**:** mutation-as-epistemology / claim-falsifier (F1); verification ladder with pre-named blind spots (F2); adversarial-review-at-scale + forced `claim/verdict/evidence` schema (F3); scar-tissue ledger — blast-site + next-bite + load-bearing-vs-defensive (F4); cold-successor handoff protocol — carry only non-derivable, numbered read-order (F5); engineer-staleness-out — counts→greps, lists→table-walking tests (F6); fail-closed-by-construction — structural not disciplinary invariants (F7); decision-economy — named seam not bare TODO, never a dead control (F8); brief-as-sovereign — deviate from the letter only with a recorded argument (F9); two-register voice + lexicon (F10); multi-agent house rules — LEAF disjoint-scope, typed status enum, two-stage review, orchestrator-verifies-personally (F11); reproduce-before-fix + suspect-yourself-first (F12); measurement-integrity — an untrustworthy number is a bug even when green (F13); ration live/destructive actions (F14); worst-first triage (F15).

**From `opus-fable-mode-main/` (governor + persistence + measurement), G1–G9:** Opus recursion-control governor — "reason about the problem and the person, never about yourself"; audit-depth-limit 1; `// DECISION:` to close open questions; outcome over visible process (G1); the **three-layer setpoint→thermostat→measurement** architecture, and the **subagent-blind** caveat (the hook does NOT fire for subagents — inject into agent briefs separately) (G2); the `leak_test.py` metric set (G3); prompt-vs-weights honesty (G4); the quantified Fable signature — words 47→18, tool:text 1.41→3.91 (G5); the extended-thinking caption test (G6); reject-wrong-framings (G7); the "beautiful dead end" / govern-the-governor guardrail (G8); anti-recursion self-check + mechanics (toggle, timeout, activation) (G9).

**Inherited guardrail (must adopt with any technique):** "emulate the strengths, not the costs… scale rigor to blast radius… not a license to spawn fleets for a one-liner." Fable's own named costs: turn-boundary verbosity, a 1,323-line decision log, process outweighing small changes, autonomy outrunning operator tolerance.

---

## 3. SURFACE MAP — adjustable surfaces × read-reliability (Pillar 2, repo-verified)

| Surface | Read-reliability | Decay | Subagent-visible | Fable-5 fit |
|---|---|---|---|---|
| `UserPromptSubmit` hook reminder (thermostat) | **Highest (Claude); runtime-dep OpenCode/Codex** | **No** | **No (main-session only)** | Best match — already carries a constitutional reminder = proven ride-along |
| AGENTS.md / CLAUDE.md §1-7 (setpoint) | High (all runtimes) | **Yes** | partial | byte-synced twins, ~76-line headroom; pair any doc governor with the thermostat |
| Constitutional memories (16 + README) | Med-High when triggered | partial | via memory_search | durable auto-surface home for 1-2 rule-level deltas |
| Agent prompts (12 agents, 3 mirrors) | High (that agent) | low | **Yes — the only subagent surface** | mirror-drift risk; the route to govern subagents |
| Skills (sk-code, sk-prompt, sk-doc, sk-git, deep-loop-workflows, system-spec-kit, system-skill-advisor) | Low-Med (conditional) | n/a | when invoked | point-of-use ritual home (mutation check, ladder) |
| Commands (deep/*, speckit/*, memory/*) | High when invoked | n/a | n/a | governs one workflow when run |
| deep-loop runtime / executor-config / renderPromptPack / post-dispatch-validate | executable (every dispatch) | n/a | applies to all | where Tier-B/C become **enforced**, not advisory |
| skill-advisor scoring/triggers | indirect | n/a | affects what surfaces | leverage on read-reliability itself |

**Verified staleness find (opus):** AGENTS.md cites `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` — **the file does not exist** (a dead pointer in the most-read surface; the actual file is `skill_advisor_hook.md`). This is exactly the rot F6 says to convert into a check.

---

## 4. CONSOLIDATED ranked recommendation map (Pillar 3) — see `recommendations.md`

The two lineages' rankings are merged, deduped, and tiered in **`002/recommendations.md`** (the sign-off deliverable). Both independently put the governor-on-hook / measurement / executor-fail-loud cluster at the top, which raises confidence in the land-first set.

---

## 5. Carried round-1 follow-ups — re-assessed (both lineages, grep-confirmed still open)

- **Machine-checkable evidence contract — STILL OPEN.** Grep for its named fields (`claim_class`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified`) across `deep-loop-runtime` + `system-spec-kit/references` → zero hits. The attachment point exists (`post-dispatch-validate` / `agent-io-contract.md`); the schema does not. → a dedicated packet (high leverage, high cost — structural).
- **codex SIGKILL / silent gpt-5 fallback — STILL OPEN structurally.** No model-mismatch / fail-loud / SIGKILL handling in the runtime (only generic env fallback + "corrupt lines silently dropped"). This round mitigated it operationally (pre-flight smoke + verify-model-in-logs), not in code. → fix in the executor audit: compare requested vs actual model, emit `error`/`blocked_stop` rather than silently substitute.

---

## 6. Eliminated alternatives (negative knowledge)

Re-recommending round-1's shipped set (out of scope); slash-command-only fable mode (session-local, not persistent); prompt-text-as-capability-upgrade (steers style, not the weights — G4); AGENTS-only governor (setpoint decays without the thermostat); verbatim `governor-block.md` paste (bloats the near-budget twin); porting `leak_test.py` as-is (Claude-id/`~/.claude` specific — needs runtime-aware bucketing); importing Fable's em-dash / decision-log-bloat (its own failure modes); hand-editing the 3 agent mirrors without a sync mechanism (drift).

---

## 7. Open questions for the owner (resolve at implementation, not now)

1. Measurement delivery: `/doctor fable-mode` (diagnostic) vs a `/deep:*-benchmark` lane (fixture-scored)?
2. OpenCode/Codex per-turn-hook read-reliability is unverified (only the Claude hook wiring was opened) — confirm before relying on the thermostat cross-runtime.
3. The two dedicated-packet items (evidence contract, executor fail-loud) are structural TypeScript work — schedule as their own packets, not surgical drops.
4. Tier-A budget: any AGENTS.md doctrine-spine line must keep the byte-synced twins under ~500 lines.

---

## 8. Round-3 small-model cross-validation (kimi + mimo + deepseek)

Three cheap models, run blind to each other and to the round-2 lineages' final ranking, were used to **stress-test** round 2 — not to extend the doctrine. Net effect: the land-first cluster got *stronger*, and three new analytical lenses + concrete new surfaces emerged.

### 8.1 Convergence strengthened to a 6-lineage signal
The same top cluster recurs independently across all conformant lineages:

| Recommendation | codex | opus | deepseek | mimo | kimi | Strength |
|---|---|---|---|---|---|---|
| Governor capsule on the live per-turn hook | #1 | #1 | #2 | ✓ (B1/M6) | ✓ (B) | **6/6 STRONG** |
| Mutation-check / claim-falsifier into sk-code | #4 | #2 | #4 | ✓ | ✓ (F001) | **6/6 STRONG** |
| `leak_test`-style behavioral measurement | #2 | #7 | #3 | ✓ (C1) | ✓ | **6/6 STRONG** |
| Executor fail-loud / model-mismatch | #3 | #12 | **#1** | — | — | 4/6 (flag) |

*The 5-column table is the round-2/3 snapshot; `opus-account2-r4` (§8.7) reproduced `opus-account2`'s #1–#3, so each top row is **6/6** and executor fail-loud is flagged by codex + opus×2 + deepseek = **4/6**.*

### 8.2 New analytical lenses (net-new, from the small models)
- **Portability taxonomy (deepseek):** every F/G technique tagged **model-agnostic (~60%) / Anthropic-specific (~25%) / executor-portable (~15%)**. The governor's rules 1–2 (anti-anxiety) are Anthropic-specific; rules 3–8 are portable. → the capsule should ship a **generic** efficiency core, with model-family specialization as a later, parameterized layer (mimo M3 agrees).
- **B-structural vs B-advisory (deepseek):** mechanisms split into *structural* (code in `deep-loop-runtime` — enforced, cross-runtime, subagent-visible) vs *advisory* (text on read surfaces — decays, subagent-blind). This **resequences implementation: structural enforcement first** (fail-loud provenance + subagent injection channel), advisory text second.
- **Efficiency-core vs correctness-core (deepseek):** isolates the subset that buys *efficiency* (F10 two-register voice, G1 rules 6–8 outcome-over-process, G5 signature, F8 decision-economy) from the *correctness* subset (F1/F2/F3/F7/F11/F12/F13/F15). The spec asked for **efficiency** → the efficiency core is the round-2/3 lever; the correctness core is a follow-on (partly covered by round 1).

### 8.3 New surfaces named (mimo + deepseek)
Beyond round-2's surface map: **`renderPromptPack`** (template-driven injection into every deep-loop iteration — the subagent governor channel), **`post-dispatch-validate`** (host for non-blocking behavioral advisories), an optional **`governor` field on `executorConfigSchema`** (per-lineage/per-model governor), and the **deep-loop state JSONL** as an already-universal, runtime-agnostic data source for behavioral measurement — making a standalone **`fable_metrics.py`** (reads state JSONL + iteration markdown) more portable than porting `leak_test.py` (which is hard-wired to `~/.claude/projects/`).

### 8.4 Conflict adjudicated — and it validates the dead-pointer fix
mimo claimed the per-turn hook works across all three runtimes; deepseek claimed **OpenCode has no per-turn hook (session-start only)**. Adjudication against [SOURCE: .opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:65-67]: **mimo is correct** — the hook is wired for Claude + Codex (`UserPromptSubmit`→`additionalContext`, per-turn) **and** OpenCode (`experimental.chat.system.transform` mutates the system prompt per chat request, not session-start-only). **Root cause of deepseek's error:** it searched for the dead pointer name `skill-advisor-hook.md` (hyphen), found nothing, and inferred "no hook"; mimo read the real `skill_advisor_hook.md` (underscore). **The dead AGENTS.md pointer literally caused a research lineage to reach a false load-bearing conclusion** — upgrading "fix the dead pointer" from cosmetic to load-bearing (the F6 staleness pattern, demonstrated). *Residual open question:* the exact per-turn-vs-cached semantics of the OpenCode `chat.system.transform` should be confirmed at implementation; the load-bearing claim (a rideable injection surface exists on all three runtimes) holds.

### 8.5 Corrections to round-2 facts
- "~17 constitutional memories" → **exactly 16 rules + 1 README** (2 of the 16 are round-1 products).
- Measurement delivery: prefer a **standalone `fable_metrics.py`** over adapting `leak_test.py` (Claude-path-coupled).

### 8.6 Honest limits of round 3
The small models did **not** find net-new fable-5 *doctrine* beyond round 2 (the EXTRACT set F1–F15 / G1–G9 is stable — they re-derived it, confirming completeness). Their value was **cross-validation + analysis lenses + new surfaces**, not new source material. kimi's contribution is partial (4 iters, no synthesis). The convergence table counts a lineage as backing a rec when its `research.md`/registry ranks or names it; small-model rankings are coarser than codex/opus.

### 8.7 Round-4 — second opus pass (reproducibility + sharper specifics)
A second independent `claude-opus-4-8`/account2 lineage (`opus-account2-r4`, 5/5, newInfoRatio 0.95→0.14) was run blind from `spec.md`. **Reproducibility result: it re-derived round-2 opus's *identical* F1–F15 / G1–G9 extraction and the same #1–#3 ranking** (governor-on-hook / mutation-check / recursion-control) — a strong stability signal (same model + same inputs → same structure); the merge attributes the shared finding IDs to both opus runs. Net-new *sharper* specifics it contributed:
- **Exact dead-pointer locus:** `AGENTS.md:217` cites `references/hooks/skill-advisor-hook.md` (hyphens); the real files are `skill_advisor_hook.md` (+ `_validation.md`) (underscores) — a naming-drift, *the doc exists*. Fix = one-character-class edit + a pointer-resolution grep-test. This is the **third lineage** to flag it (mimo, deepseek-via-its-own-error, opus-r4).
- **Governor sizing answer:** `reinject.sh:16-18` distills the entire 8-rule governor to a **single ~90-word paragraph** — proving the rec-#1 capsule fits one dense paragraph (not 13 lines), defeating the "it'll bloat the near-budget twin" objection.
- **Fail-loud is one comparison away:** `executor-audit.ts:485` already records the actual model and itself escalates SIGTERM→SIGKILL (`654`,`688`); the only gap is a requested-vs-actual diff + fail-loud — making the executor-provenance rec a small, concrete change, not open-ended (corroborates deepseek's structural-#1 framing).
- **Empirical thermostat proof:** the `UserPromptSubmit` hook fired on the research session itself carrying a constitutional reminder — the ride-along is demonstrated, not hypothetical.

Merge state: **6 lineages, 35 consolidated findings** (codex + both opus runs conformant in the auto-merged registry; the 3 small models integrated by hand).

---

<!-- ANCHOR:references -->
## 9. References
- `external/fable-mode-main/{fable-mode-profile.md, fable-mode.md, README.md}`; `external/opus-fable-mode-main/{governor-block.md, fable-mode.md, reinject.sh, leak_test.py, README.md}`; `external/Fable5.md`.
- Round-1: `149/001-initial-refinement/{implementation-summary.md, changelog.md, before-vs-after.md}`.
- Per-lineage: `research/lineages/{codex-xhigh,opus-account2,mimo-v25-pro,deepseek-v4-pro}/research.md` (round-3 small models wrote `research.md`); `research/lineages/kimi-k2p7/{findings-registry.json,iterations/}` (no synthesis — wedged/killed); merged registry `research/deep-research-findings-registry.json` (codex+opus conformant set); attribution `research/fanout-attribution.md`.
<!-- /ANCHOR:references -->
