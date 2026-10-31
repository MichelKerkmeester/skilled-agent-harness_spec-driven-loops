---
title: "Iteration 5: What default-on would need, its cost, and the measured risk register"
trigger_phrases: []
---
# Iteration 5: What default-on would need, its cost, and the measured risk register

## Focus

Q5: turn the measured judgment on by default — the missing seam, the reader, the amendments, the cost
model on the recorded calls, and the risk rates the fixture already quantifies.

## Actions Taken

- Read the normalization boundary (`compiledRoute`), the front door's fallback envelope, the hub routing
  directive, and the 020 scope rows that own the seam decision.
- Built the risk register from the recorded run: served-suggestion precision, stable-wrong rate,
  abstention precision/recall, cross-order instability.
- Recomputed the cost model per clarify from `calls.jsonl` and the scorer's payload estimate.

## Findings

1. **A served default has no seam, and the 020 record says so.** `compiledRoute` returns
   `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}` and drops
   `clarify.alternatives` and the question; the front door prints exactly that normalized JSON. So a hub
   that receives `clarify` today gets no alternatives to annotate, and no caller could carry a
   suggestion without a contract change. The spec names the gap and parks the fix outside the phase.
   [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108]
   [SOURCE: .skilled/bin/compiled-route.cjs:51]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:72]

2. **The reader does not exist.** Every hub directive today says only "clarify/defer (disambiguate)"; the
   handoff criteria state `A keep serves nothing`: a served default needs the front door's output
   contract changed, a later phase and the operator's call — and the 047 rules add that no Jev arm joins
   a default path. Default-on is therefore a new phase with a named reader, an amendment to the
   scope-drops of 020, and the operator's yes, not a configuration flag.
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:99-103]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:166]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/goal.md:52]

3. **Determinism is a first-class integration cost.** The arm re-samples three fresh calls with no answer
   cache, and the recorded run shows invocation variability on 10 of 54 rows (18.5 percent cross-order
   splits). A suggestion rendered live may flip between two runs on those rows unless answers are cached
   by identity; a cache then has to carry the very identity the keep rule pins (`jev_version=0.6.2`,
   `provider=official`, `model=jev-1.13.0`) plus the option-set digest, or it will outlive its verdict.
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:44-54]
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/report.json]

4. **The route stays deterministic; only the annotation may not.** The compiled decision itself is
   policy-determined and fails safe to the legacy sentinel on any error, which is why the honest place
   for a suggestion is *alongside* the clarify action as advisory text, never as a replacement for the
   action or its alternatives. That framing also bounds the blast radius: a suggestion can be wrong
   without the routing contract being wrong. [SOURCE: .skilled/bin/compiled-route.cjs:39-51]

5. **The cost model is small in tokens and visible in latency.** ~119 tokens and 332 ms per call (p95
   380 ms): a clarify at three calls is about 357 input tokens and one second; an early stop brings it to
   ~2.2 calls and ~0.72 s. At the committed-prompt clarify rate (3 in 361 prompts, of which 2 carry mode
   alternatives) the token cost per session is negligible; the cost that matters is adding a synchronous
   second and a network dependency to a local, hermetic path. No dollar figure is printed by the scorer
   by design. [SOURCE: ~/.skilled/.labels/runs/047-020-jev.stdout.txt]
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

6. **The payload class changes at clarify time.** The measured payload was committed canary, playbook and
   routing-corpus prompts plus mode descriptions; live, the prompt is the user's own text. The 020 risk
   table already names this: transcript text is the operator's conversation, and sending it needs a
   payload-acceptance and redaction gate before any arm runs; Jev must receive no key (REQ-004).
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:199]
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:54]

7. **Measured risk register, from the only quantified corpus.** Served suggestions: Jev names a mode on
   42 of 54 rows, is right on 16 (38.1 percent) and wrong on 26; 19 of the 26 wrong suggestions are
   unanimous across all three rotations (stable-wrong, 45.2 percent of served). Abstention is precise
   but rare: 12 of 12 none-picks right, recall 35 percent. And the suggestion set is worse than asking:
   always answering `none_of_these` scores 34/54 against Jev's 28/54 on the same labels. Per hub the
   spread is extreme (sk-doc 9/13, sk-design 2/11).
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

8. **Integration tiers, cheapest first.**
   - **T0 (no model, no seam):** ship the trust fixes — digests in `report.json`, the zero-call
     clarify-action premise check — and run `--transcripts` to get the production clarify rate before
     anyone argues about value.
   - **T1 (shadow):** compute the suggestion at clarify time (or replay it offline), log it locally and
     never show it; the user's actual pick then becomes a free, real label. This is the highest-value
     next step because it fixes the label problem at its root (real rows, real choices) at zero visible
     risk — subject to a consent/log policy for prompt text.
   - **T2 (gated annotation):** show "suggested: X" only under a per-hub allowlist and the strongest
     available gate — unanimous mode pick, `sk-doc`-class hub — never for sk-design on this evidence. No
     probability gate exists to add (calibration is flat).
   - **T3 (model decides the clarify):** remains excluded; the router is deterministic and the 020 scope
     row keeps it that way.
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:99-103]
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

9. **If default-on is ever built, the honest bar changes.** A suggestion shown to a user competes with
   "just ask the question", not with the tie-break order — so the next keep must be measured against the
   strongest simple policy (always-ask / always-none) on real rows, or the feature ships on a threshold
   the user's experience does not share. On the present fixture that bar fails by six rows.
   [SOURCE: ~/.skilled/.labels/020-rows.jsonl]

## Ruled Out

- "Default-on is a switch flip": the alternatives never reach a caller, no reader is named, and the
  phase's own handoff says a keep serves nothing.
- "The measured keep is enough to show the suggestion": on the only quantified corpus 61.9 percent of
  served suggestions are wrong and the suggestion set loses to always-abstain.
- "Put the model inside the router": the compiled decision is deterministic and fails safe; the 020
  scope row excludes replacing it, and the suggestion can live beside the action instead.

## Next Focus

Synthesis — rank the recommendations across all five questions and assemble `research.md` with the
terminal `maxIterationsReached` stop reason.

## Sources

- `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/goal.md`
- `~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl`, `report.json`
- `~/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
