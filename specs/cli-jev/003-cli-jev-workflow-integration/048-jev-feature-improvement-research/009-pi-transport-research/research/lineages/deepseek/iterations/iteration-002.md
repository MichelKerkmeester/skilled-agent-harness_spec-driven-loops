---
title: "Iteration 2: How to raise its accuracy or lower its cost"
trigger_phrases: []
---
# Iteration 2: How to raise its accuracy or lower its cost

## Focus

The accuracy and cost levers the recorded evidence supports: rotation and call-count policy, per-rotation
agreement, margin-gated escalation, the model catalog's price alternatives, token economics, wall-time
parallelism, input-shape symmetry, and sampling control.

## Actions Taken

- Simulated alternative call policies on the recorded 333-call Pi side against the CLI 3-order mean:
  1-call (order 0), fixed 2-call, early stop when the first two orders agree, and margin-gated
  escalation to the CLI.
- Recomputed agreement per rotation, same-rotation and against the CLI mean.
- Extracted the classifier model catalog prices from the installed Pi package for every model the 037
  census saw available, and converted the recorded `cost_per_100` into an implied token count.
- Read the installed Pi docs for the classify surfaces, parallelism and cost accounting.

## Findings

1. The three rotations are load-bearing for the verdict. Against the CLI 3-order mean, 1 call (order 0)
   agrees on 103/111 = 92.8 percent and a fixed 2-call mean on 105/111 = 94.6 percent; only the current
   3-call mean reaches 106/111 = 95.5. Any rotation cut flips the keep rule to `keep-cli`
   [SOURCE: recomputed from
   specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/calls.jsonl
   and specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl].

2. Early stop does not buy the reduction it looks like it should. Orders 0 and 1 pick the same top key
   on 105 of 111 rows, so an early-stop policy spends 228 calls instead of 333 (a 31.5 percent cut) but
   lands at the same 105/111 = 94.6 percent as the fixed 2-call policy: the saved third call is exactly
   the call that carries the lost row. The 3rd rotation is the price of the verdict
   [SOURCE: both calls.jsonl files, recomputed].

3. Rotation position effects are substantial and not one-sided: same-rotation agreement is 106/111 =
   95.5 percent at order 0, 104/111 = 93.7 percent at order 1 and 107/111 = 96.4 percent at order 2;
   per-order agreement over all 333 pairs is 317/333 = 95.2 percent. The option position a row is
   presented in moves individual answers on both sides (9 Pi rows and 12 CLI rows split across orders,
   iteration 1 finding 6) [SOURCE: both calls.jsonl files, recomputed].

4. A margin-gated escalation is the one policy that raises agreement on this evidence. Deferring the
   rows whose Pi top-2 mean margin is under 0.10 (7 rows) to the CLI gives 110/111 = 99.1 percent
   agreement while Pi still answers 104/111 rows; a 0.05 gate defers 2 rows and gives 96.4 percent. All
   five recorded disagreements sit inside the 12 rows with a sub-0.10 margin on either side, so the gate
   and the error pool coincide [SOURCE: both calls.jsonl files, recomputed; margin rule at iteration 1
   finding 3].

5. Cost-side, the transport already runs the cheapest measured arm the catalog offers in its cluster:
   `openrouter` `typesafe/jev-1.13` is priced at $0.042 per 1M input tokens with $0 output in the
   installed catalog, and the alternatives the 037 census saw available are `respan/span-01` at $0.02,
   `respan/span-01-lite` and `respan/span-01-lite:free` at $0, `upstage/solar-decide` at $0.05 and
   `jaredpalmer/kev-4b` and `~typesafe/jev-latest` at $0.042
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/chunks/chunk-3YAHQSW6.js,
   catalog `cost` fields; availability per
   037-pi-native-classifier-transport/scratch/live-run.stdout.txt census lines]
   [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/verify/session-evidence.md context
   paragraph listing the seven available models].

6. At $0.042 per 1M input tokens, the recorded `cost_per_100 = 0.0022399` implies about 533 input
   tokens per call and about $0.0075 for the whole 333-call replay. The cost is real but tiny; cutting
   it to zero with the free `respan/span-01-lite:free` would save under a cent per replay today, and
   that arm has no keep-rule measurement behind it
   [SOURCE: cost arithmetic over
   specs/.../037-pi-native-classifier-transport/scratch/live-run/report.json `cost_per_100`]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:616-618].

7. The dominant cost is wall time, not dollars. The run took about 1 min 29 s for 333 sequential calls
   with Pi at mean 260 ms; Pi's codemode surface runs up to four classifier calls at a time per script
   ("at most four at a time per script"), so a batch replay routed through codemode could cut wall time
   roughly 4x. The SDK path the scorer and the transport use today is sequential and does not get that
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/cli.md:178]
   [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/live-run.stdout.txt].

8. The two sides are not input-symmetric, and the asymmetry is testable. The CLI receives the raw prompt
   on stdin (`input: job.prompt`), while Pi receives `state: { request: prompt }`; the recorded
   `state_sha12` proves what Pi sent, and nothing proves the wrapper is the best shape
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:278-284]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:482-489]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:776].

9. There is no documented sampling control to steady the rotation splits: `classify()` is called with a
   signal option only, and the three documented surfaces (`models.classify(model, { state, questions })`,
   `ctx.modelRegistry.classify()` and the SDK) expose no temperature or seed. Variance is managed only
   by averaging rotations, which is another reason the 3-call mean is the current best arm
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md:113-136]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:716-726].

10. Two of the five disagreements are metric artifacts rather than model disagreement (`rr-iter3-127`
    crossed means with identical order picks; `rr-iter3-125` exact CLI tie settled by option order), so
    part of any "accuracy" lift can come from repairing the comparison rule rather than the model; that
    belongs to the measurement question and is carried to iteration 3 as a distinction between fair
    metric repair and model behavior change [SOURCE: iteration 1 findings 4 and 5].

11. Direct TypeSafe `jev-latest` reports tokens with no catalog cost ("models without one, such as
    TypeSafe's direct `jev-latest`, report tokens at no cost"), but it needs `TYPESAFE_API_KEY`, which
    the 037 census found absent; `opencode/jev-1.13-free` at $0 needs an OpenCode Zen credential while
    the installed OpenCode credential is Go, not Zen
    [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md:106-112]
    [SOURCE: specs/.../037-pi-native-classifier-transport/spec.md problem statement].

## Ruled Out

- "Cut to one call per row to save two thirds of the cost": order-0-only agreement is 92.8 percent,
  under the 95 bound; the policy is disqualified on the recorded run, not on principle.
- "Early-stop when the first two orders agree": measured at 94.6 percent agreement; it saves 105 calls
  but loses the verdict, so it is a wall-time optimization that cannot be used alone.
- "A cheaper model arm is a free win": none of the cheaper or free models has any keep-rule run; the
  verdict's scope statement explicitly reruns the rule for a new identity.
- "Cost reduction matters in dollars here": a full replay costs ~$0.0075; the lever with real substance
  is latency and call count, so prioritize agreement-safe call policies over price shopping.

## Next Focus

Iteration 3 — Q3: how to make the measurement more trustworthy (recorded-vs-fresh asymmetry, metric
artifacts, missing usage records, missing backend/version fields, single-run variance, and what a
label-free agreement test can and cannot prove).

## Sources

- `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/{calls.jsonl,report.json,live-run.stdout.txt}`
- `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/{models.md,cli.md}`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/chunks/chunk-3YAHQSW6.js` (catalog `cost` fields)
