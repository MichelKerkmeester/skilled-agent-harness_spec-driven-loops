# Deep Research Strategy — ai-output-opus lineage

**Topic:** Improve AI output quality when prompted through slash-commands (`--command`)
versus natural conversation. Build on `grounding-evidence.md` (verified live cross-model
test this session).

**Executor:** cli-claude-code model=opus · **Lineage:** ai-output-opus

---

## Research Charter

### Non-Goals
- Re-running the live `opencode run --command` matrix from inside this research session.
  The grounding evidence already captured a verified live run (DeepSeek/Kimi/MiMo this
  session); the deep-research SKILL forbids invoking a CLI from within itself and we will
  not burn external small-model quota to reconfirm an already-verified observation. Live
  repro is treated as DONE per `grounding-evidence.md`; new live runs are out of scope.
- Implementing the command-contract fixes (research reports findings only; implementation
  is a separate follow-up packet).
- Re-benchmarking per-model prompt frameworks (the `sk-prompt-small-model` profiles already
  hold the empirical framework data; we consume, not re-measure).

### Stop Conditions
- All 5 open problems from `grounding-evidence.md` have an evidence-backed answer with a
  concrete contract recommendation, OR
- newInfoRatio falls below convergenceThreshold (0.05) across an iteration, OR
- maxIterations (5) reached.

---

## Known Context

`resource-map.md` not present; skipping coverage gate.

Verified inputs read at init (file-anchored):
- `grounding-evidence.md` — verified live cross-model observations (the seed).
- `.opencode/commands/memory/search.md` — command router contract (§2 execution order,
  §3 startup routing, §4 retrieval MUST-emit envelope, §6 hard rules).
- `.opencode/commands/memory/assets/search_presentation.txt` — presentation contract
  (§1 startup-question policy FIRST, §2 retrieval display, field-mapping table).
- `.opencode/skills/cli-opencode/SKILL.md:269` — `--command` dispatch mechanics
  (`$ARGUMENTS` substitution; `"$@"` expansion inside `` !`…` `` injections).
- `sk-prompt-small-model/references/models/{deepseek-v4-pro,kimi-k2.7-code,mimo-v2.5-pro}.md`
  — per-model framework fit (RCAF / COSTAR / COSTAR) and instruction-following profiles.

---

## Key Questions (the 5 open problems)

- KQ1: **Command-argument robustness across models** — why do Kimi/MiMo drop to the startup
  question under `--command` when DeepSeek doesn't? Injection point, "ask when empty"
  instruction, or instruction-following? Design a contract that survives weaker models.
- KQ2: **`--command` vs direct-prompt vs natural conversation** — when should a command be a
  deterministic renderer (no model latitude) vs a model-driven flow? Quantify the
  variance/quality tradeoff across the three surfaces.
- KQ3: **Startup-question fallback hazard** — should commands distinguish "invoked with args"
  from "invoked bare" structurally rather than by `$ARGUMENTS`-emptiness heuristics?
- KQ4: **Which output fields the contract should mandate** so conversational answers are
  comparable and trustworthy (DeepSeek showed confidence 0.36; Kimi showed similarity 0.68
  for the same row).
- KQ5: **Per-model prompt-framework fit** (DeepSeek/Kimi/MiMo) for command-style vs
  conversational tasks — does the right framework reduce the command-adherence gap?

## Answered Questions
- KQ1 (iter 1): adherence gap = salience-driven conditional misfire, not broken injection.
- KQ2 (iter 2): deterministic renderer vs model-driven tradeoff characterized.
- KQ3 (iter 3): four-layer structural arg-presence contract designed.
- KQ4 (iter 4): mandate similarity 0–1/2dp + core fields on all surfaces.
- KQ5 (iter 5): framework fit is secondary; COSTAR register is the shared intersection.

## What Worked
- Reading the actual command + presentation contracts alongside the verified live evidence
  to root-cause the adherence gap (vs theorizing).
- Separating the three layers (control flow / salience / framing) so each open problem
  mapped to a distinct, non-overlapping fix.

## What Failed
- (none — no failed approaches; charter scoped out live re-runs deliberately)

## Exhausted Approaches
- $ARGUMENTS-injection-broken hypothesis; raw slash-text probe; strengthen-wording-only;
  per-model metric latitude; one global framework for all commands.

## Ruled-Out Directions
- See research.md "Ruled-out directions (negative knowledge)" — 8 directions refuted.

## Next Focus
- DONE — converged at iteration 5 (all 5 KQs answered + max_iterations). Synthesis in
  research.md. Follow-up (separate packet): implement P0 contract changes 1, 2, 4.
