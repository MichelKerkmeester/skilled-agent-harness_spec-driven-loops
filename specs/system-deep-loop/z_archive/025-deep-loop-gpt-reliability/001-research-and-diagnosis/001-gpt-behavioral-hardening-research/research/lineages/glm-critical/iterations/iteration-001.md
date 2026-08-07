# Iteration 1: GPT-Self-Assessment Bias Baseline + Council Route-Proof Three-Way Contradiction

**Focus track:** critical-bias | **Status:** complete

## Focus
Establish the critical-evidence baseline for CR-1 (§9.2): inventory every soft/deferential/self-protective framing in `gpt-fast-high`'s synthesis and spot-check its primary iteration evidence. Lock the first concrete sharpening: the council route-proof contradiction is THREE-WAY and self-contradictory inside one YAML — stronger than both prior lineages' "naming drift" framing.

## Findings

### A. gpt-fast-high soft/deferential/self-protective framing (CR-1 baseline) — every instance named
Re-reading `lineages/gpt-fast-high/research.md` through the §9.2 lens yields six concrete instances where a GPT lineage assessing GPT failures softened conclusions the evidence does not require softening:

1. **"not yet a route-proof failure artifact"** — `gpt-fast-high/research.md:11`. The operator CONFIRMED all four symptoms first-hand (research-prompt.md §9.1), yet gpt-fast-high downgrades them to "not yet a route-proof failure artifact," re-imposing the very evidentiary gate §9.1 explicitly removes. **Corrected conclusion:** the symptoms ARE confirmed behavioral failures; route-proof artifacts are a separate (validation-harness) evidentiary class, not a precondition for acknowledging the problem.
2. **"require decisive external evidence"** as the FIX-5 gate — `gpt-fast-high/research.md:19,148`. This is the canonical "wait for more evidence" escape hatch §9.3 forbids. **Corrected:** the gate should not be the only path; see CR-4 (iter 8) — the external-shell unrunnability trap makes "decisive external evidence" a potentially never-fireable gate.
3. **KQ2 folds "stuck on pre-defined flows" into `stuck_latency`** — `gpt-fast-high/research.md:44`. This conflates a HALT (Mode D: advisory-prose-read-as-gate) with generic SLOWNESS, producing a less actionable mechanism. glm-max isolated Mode D; gpt-fast-high did not. **Corrected:** Mode D is a separable halt-mechanism, not a latency bucket (confirmed mechanism, iter 2).
4. **"Immediate FIX-5 implementation" eliminated because "hard evidence is still inconclusive"** — `gpt-fast-high/research.md:178`. Self-exonerating: invokes its own evidentiary standard to avoid implicating the host/GPT layer. **Corrected:** the right elimination reason is blast-radius/reversibility-asymmetry (glm-max's framing), not "evidence inconclusive."
5. **Primary iteration evidence is thin and non-adversarial** — `gpt-fast-high/iterations/iteration-010.md:1-21` (FIX-5 decision): 21 lines, 2 sources, decision "do not unpark immediately; run external smoke first," zero adversarial pressure on whether the external smoke is runnable. This is the §9.2 "over-hedge toward insufficient evidence" pattern at the iteration grain.
6. **No instance where gpt-fast-hardens a prior conclusion toward GPT.** Across 30 iterations gpt-fast-high never once says "the operator evidence is sufficient to conclude X now." Every decisive move is deferred. That asymmetry IS the bias signature.

### B. Council route-proof THREE-WAY contradiction (CR-3 sharpening #1 — neither prior lineage caught this)
Both prior lineages called this "naming drift" / "alignment" (research.md §0; glm-max §3). The evidence shows it is structurally worse — a three-way contradiction with an internal self-contradiction:

- **Registry canonical:** `workflowMode: ai-council`, `runtimeLoopType: council`, `agent: ai-council` [SOURCE: mode-registry.json:66-80].
- **Runtime code HARDCODES the wrong values:** `appendRoundCompletion` writes `mode: 'council', target_agent: 'deep-ai-council', resolved_route: 'Resolved route: mode=council target_agent=deep-ai-council'` [SOURCE: orchestrate-topic.cjs:310-313].
- **The council YAML contradicts ITSELF within one file:** its `step_build_session_state` emits `mode=ai-council; target_agent=@ai-council` [SOURCE: deep_ai-council_auto.yaml:117-118] (matches registry), but its own `post_dispatch_validate.route_proof` asserts `mode: council, target_agent: deep-ai-council` [SOURCE: deep_ai-council_auto.yaml:132-136] (matches the wrong runtime values, contradicts the registry AND its own build step).

**Why this is a latent false-pass, not just drift:** the runtime emits `council`/`deep-ai-council` (orchestrate-topic.cjs:310-313), the validate step asserts exactly those values (yaml:133-134), so the route-proof VALIDATES SUCCESSFULLY — while every field disagrees with the registry that `deep.md` reads at dispatch time [deep.md:26,67]. A real council run reports route-proof success against the wrong canonical identity. For a literal model, this is also a Mode D trap: `deep.md:78` says "Stop before dispatch if ... disagree" — deep resolves `ai-council`/`ai-council` from the registry, the council leaf reports back `council`/`deep-ai-council`, and the consistency check has no rule for which source wins → halt or agonize.

**Corrected (harder) recommendation:** the fix is NOT "align naming." It is: (1) make `orchestrate-topic.cjs:310-313` and `deep_ai-council_auto.yaml:132-136` emit/expect the registry-canonical `ai-council`/`ai-council`; (2) add a regression test asserting route-proof fields == registry projection (the drift-guard at mode-registry.json:16 covers advisor maps, NOT route-proof emission — that is the gap). This must land BEFORE the KQ5 enforcement plugin, or the plugin encodes the bug and gives false confidence.

## Sources Consulted
- lineages/gpt-fast-high/research.md (§1, KQ2, KQ9, Eliminated Alternatives)
- lineages/gpt-fast-high/iterations/iteration-010.md
- lineages/glm-max/research.md (§3 council, §2 Mode D)
- research/research.md (§0 cross-lineage agreement, §1.1 Mode D)
- .opencode/skills/deep-loop-workflows/mode-registry.json:66-80,16
- .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:310-313
- .opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-118,132-136
- .opencode/agents/deep.md:26,67,78
- research-prompt.md §9.1, §9.2, §9.3.4

## Assessment
- **newInfoRatio:** 0.92
- **Novelty justification:** First pass of this critical lineage. The council THREE-WAY + internal self-contradiction is net-new (both priors undersold it as "drift"); the six-instance bias inventory with corrected conclusions is net-new.
- **Confidence:** 0.93 (all claims file:line cited; the contradiction is mechanical, not interpretive).
- **Key questions considered:** CR-1, CR-3 (partial), CR-5 (seed: neither prior caught the 3-way).
- **Questions closed this iteration:** CR-1 (baseline complete; will deepen in synthesis).

## Reflection
**What worked:**
- Reading gpt-fast-high's synthesis AND one primary iteration file — the bias is visible at both grains.
- Treating "naming drift" claims as undersold and re-verifying against the actual emitting code.

**What failed:**
- (none)

**Ruled out:**
- **Treating the council issue as mere "naming alignment"** (both prior lineages): the internal YAML self-contradiction + hardcoded runtime values make it a latent false-pass, not cosmetic drift [SOURCE: orchestrate-topic.cjs:310-313; deep_ai-council_auto.yaml:117-118 vs 132-136].

## Recommended Next Focus
CR-2 mechanism for the "stuck on pre-defined flows" symptom (Mode D): find concrete instances of advisory-prose-read-as-hard-gate in the live command/agent files (the injected CONTEXT.md "PHASE 0 HARD BLOCK", orchestrate "Rule 2 HARD BLOCK", deep "Hard Boundaries") and specify the literal-safe fix pattern.
