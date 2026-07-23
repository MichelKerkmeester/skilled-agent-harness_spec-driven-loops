# Iteration 5: Contrarian Steelman — Is Auto-Default Actually Fine? (Where Run 1's Flip-4 Is Wrong)

**Thread:** 12 (contrarian pass) | **Lineage:** glm-max | **Focus:** Q5
**Run:** 5 of 5 (final) | **Status:** complete | **Timestamp:** 2026-07-17T19:05:00Z

## Focus

The divergent agenda's final thread: argue the STRONGEST case that "auto-default is fine" and Run 1's flip-4 is wrong, then identify exactly where it survives and where it concedes. A dishonest steelman ("keep all five, defaults never hurt") is useless; this iteration builds the *strongest falsifiable* contrarian position and reports honestly what it overturns.

## Findings

### F5.1 — The strongest steelman is NOT "keep all five." It is: a default is justified when it is *self-correcting* OR *genuinely catch-all* — and Run 1 flipped one hub (cli) that satisfies the first condition.

The honest contrarian principle, refined from iter 4 (detection-defaulted) and iter 3 (hub-identity-on-default):

> **A named `defaultMode` is fine when at least one holds: (a) the default is environmentally determined / self-correcting — wrong contexts resolve themselves without a user turn; OR (b) the default is the genuine catch-all scoring anchor that earns its keep on both jobs (safe lean + anchor) — Run 1's sk-prompt test.**

Under this principle:
- **sk-prompt** — KEEP (condition b; Run 1 already correct).
- **cli-external-orchestration** — Run 1 said FLIP to null. The steelman says **NO: cli satisfies condition (a).** Its best default is "the executor of the runtime you're currently inside" — that is environmentally determined (the runtime is the process) and self-correcting (in opencode → cli-opencode; in claude → cli-claude-code; no user override needed for the common case). Run 1 itself called cli's default "runtime-dependent (unrepresentable as a static default)" and concluded null. The contrarian inversion: *because* the right default is a function of a detectable environment, the fix is not to remove the default but to make it self-correcting — `defaultMode: null` + a runtime-detection block (iter 4 F4.1). Nulling it throws away cli's one genuine signal. **This is the one flip the steelman overturns: cli should be detection-defaulted, not pure-defer.**

### F5.2 — The three remaining flips (system-deep-loop, mcp-tooling, sk-design) SURVIVE the steelman — but only as *unfalsified-directional*, not *proven*.

The steelman concedes these three because none satisfies condition (a) or (b):
- **system-deep-loop**: no environmental signal (research-vs-review is intent); metadata already dead (Run 1). The default serves no anchor job. Concede null.
- **mcp-tooling**: no environmental signal (which tool the user wants is intent); already defer-with-suggestion in behavior. Concede null.
- **sk-design**: no environmental signal for its 5 judgment modes (iter 2 F2.2); carries the live over-emission bug. Concede null — BUT flag it as the hub most likely to *gain* a detection signal later (a present URL → md-generator), at which point it could move to detection-defaulted.

**The honest limitation the steelman exposes:** Run 1 routed around building a zero-signal corpus ("no corpus of real zero-signal traffic exists; the recommendation deliberately routes around needing one"). That makes the three nulls **unfalsifiable in the over-deferring direction**: if name-only/generic requests are common, the flips trade one rare mis-route for many common one-turn deferrals, and *nothing in Run 1's method measures that tradeoff*. The benchmark is blind to keep-vs-null (Run 1's own finding: indistinguishable on a zero-signal request). So the three flips are *directionally* right (truth-reconciliation) but *empirically unvalidated* (they could be net-negative if over-deferring friction is high). The steelman does not overturn them — it downgrades their confidence from "settled" to "directional-pending-measurement."

### F5.3 — The real target of the contrarian pass is Run 1's *encoding*, not its verdict: Run 1 proposed a uniform "third archetype," but the evidence demands a *falsifiable decision rule with four shapes*, not three.

Run 1's encoding: add one "defer-routed keyword hub" archetype. The contrarian evidence (iters 2–4) shows the design space is larger and the rule must be falsifiable:

| Shape | Condition (falsifiable) | Example |
|---|---|---|
| keyword-with-default | one mode is the genuine catch-all anchor (condition b) | sk-prompt |
| detection-defaulted | default resolvable from environment (condition a) | **cli-external-orchestration** (Run 1 missed this) |
| detection-routed (surface) | axis signal is environmental | sk-code (surface axis) |
| pure-defer (null + card) | no environmental signal AND no catch-all | deep-loop, mcp-tooling, sk-design |

Run 1's "third archetype" collapses detection-defaulted into pure-defer, which is exactly the error F4.1 found: it forces cli into the pure-defer bucket when cli has a usable environmental signal. The contrarian's constructive contribution is this four-shape rule, where each shape is nominated by a *testable condition* (is there an environmental signal for this axis?), not by imitation of a neighbour.

### F5.4 — What would falsify the flips (the steelman's exit criterion).

The contrarian pass must name its own falsifier or it is rhetoric:
1. **cli falsifier:** if runtime detection is unreliable across the supported runtimes, cli falls back to pure-defer (null). Detection-defaulted is conditional on a robust env signal — falsifiable by a runtime-detection test.
2. **three pure-defer falsifier:** a zero-signal traffic corpus showing name-only/generic requests are >X% of traffic AND deferring causes measurable re-asks. Run 1 explicitly lacks this corpus, so the flips are *not yet falsified* but *are falsifiable* — which is the honest epistemic state.
3. **sk-prompt keep falsifier:** if a fresh route-gold corpus showed prompt-improve is no longer the dominant case, the keep would flip. Run 1's keep rests on same-day receipts, so it stands today but is not permanent.

## Sources Consulted

- Accumulated: `iteration-001.md` (advisor coupling), `iteration-002.md` (per-axis archetype, sk-design not detectable), `iteration-003.md` (hub-identity-on-default canon, anti-patterns), `iteration-004.md` (cli detection-defaulted, detection on default axis).
- `file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run1-archive/research.md` (Run 1 verdict + "deliberately routes around needing a corpus" + benchmark-blind finding).

## Assessment

- **newInfoRatio: 0.65** — Lower novelty by design (this is the adversarial-synthesis thread, mostly re-deriving the boundary from accumulated evidence), but it produces the load-bearing constructive output: the falsifiable four-shape decision rule and the one real disagreement (cli = detection-defaulted, not null). It also honest-downgrades the three nulls' confidence from "settled" to "directional-pending-measurement."
- **Novelty justification:** The four-shape rule and the cli-disagreement are net-new (iters 2–4 built the parts; this assembles them into a falsifiable whole and recovers cli). The confidence-downgrade framing is the epistemic contribution Run 1 lacked.
- **Confidence:** 0.80 on the *structure* (four-shape rule is well-grounded in iters 1–4); 0.55 on the *cli disagreement winning* (it depends on runtime-detection being robustly implementable, which is plausible but unverified here). The three-null downgrade is 0.85 (it's a direct consequence of Run 1's own no-corpus stance).

## Reflection

- **What worked:** Building a *falsifiable* steelman rather than a categorical one — naming the conditions (a)/(b) and the exit criteria turned the contrarian pass from rhetoric into a constructive refinement (the four-shape rule). Recovering cli as detection-defaulted is the single highest-value divergence from Run 1.
- **What failed / ruled out:** Ruled out: "keep all five defaults" (categorical steelman) — unsupported; three of the five genuinely fail both conditions. Ruled out: "the flips are proven" — they are directional-pending-measurement, by Run 1's own no-corpus method.
- **Carried-forward to synthesis:** The four-shape decision rule is the encoding deliverable. The 1+3 split (cli detection-defaulted; three pure-defer) is the per-hub verdict delta vs Run 1. The over-deferring confidence-downgrade is the honest scope note.

## Recommended Next Focus

**→ Synthesis.** All 5 iterations complete; max-iterations reached. Compile `research.md`: the four-shape decision rule, the per-hub verdict table (Run 1 baseline + glm-max delta: cli recovered as detection-defaulted; three nulls confirmed-but-downgraded), the encoding recommendation (four shapes, not three; menu-vs-scorer split; drift-as-gate; single-mode threshold), and the honest scope (flips are directional-pending-measurement, not proven).
