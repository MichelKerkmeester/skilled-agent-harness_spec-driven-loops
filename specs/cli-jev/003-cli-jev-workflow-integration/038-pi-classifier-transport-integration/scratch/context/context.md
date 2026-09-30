# Phase 038 context: wiring Pi's classifier runtime in (session record, 2026-09-30)

## Operator request and decision

- After phase 037 printed `adopt`, the session asked what should follow. Options were a same-day rerun first, planning the integration, or stopping. The operator chose "Plan the integration": "Open a new phase that adds Pi as a cli-classifier transport and documents it in cli-pi. Take the adopt verdict as it stands."
- The operator also approved landing 036 and 037 on main. Main and origin/main are at `2748c84f14`.

## What 037 measured (read from its records)

- `037-pi-native-classifier-transport/scratch/live-run.stdout.txt`: `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022`.
- Scope of that verdict (037 `implementation-summary.md` Known Limitations): only the `choice` question type, only Pi 0.99.1 on `openrouter` `typesafe/jev-1.13` against the CLI's `official` `jev-1.13.0`. Agreement cleared the 95 bar by one row, and the five disagreements were near ties. CLI latency was the recorded 019 run, not a same-day pair.
- The scorer that measured it: `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`. It already holds working Pi code: resolving Pi's package (`resolvePiPackage`), `ModelRuntime.create()`, `getModelOfType('classifier', 'openrouter', 'typesafe/jev-1.13')`, building a `choice` question (`toClassifierContext`) and mapping Pi's answer back to a CLI-shaped probability map (`probabilitiesFrom`). A transport could reuse or move these.

## Pi facts (checked for 037, still true for Pi 0.99.1)

- Classifier question types: `choice`, `bool` and `score` (`docs/models.md:103-136` in `~/.local/lib/node_modules/@earendil-works/pi-coding-agent`). Request shape `classify(model, { state, questions: { <name>: { type, instructions, criteria } } }, options)`.
- Reachable three ways: codemode scripts (`"defaultTools": ["+codemode"]`, `models.classify()`), extensions (`ctx.modelRegistry.classify()`), and the SDK (`ModelRuntime`, exported from the package root).
- Credentials stay in Pi's own store. 7 classifier models are available through `openrouter` today. OpenCode Zen Jev is not (our OpenCode key is Go).

## Jev today (read in this session)

- `jev` question types: `noul` (a yes/no probability, which the `vercel` provider rewrites to `boolean`, `cli-jev/SKILL.md:190`), `choice` and `score` (`cli-jev/SKILL.md:163`). Pinned `jev 0.6.2` (`cli-jev/SKILL.md:97`). Prerequisite detection is `command -v jev` then `jev auth status` (`cli-jev/SKILL.md:92-101`).
- 21 script files spawn `jev` directly (a grep for the `jev` binary name and `'choice', '--provider'`, excluding tests, dist and docs). By owner:
  - cli-classifier: `benchmark/injection-screen/score-injection-screen.mjs` (noul), `benchmark/pi-transport/score-pi-transport.mjs` (choice)
  - sk-communication: `benchmark/reply-harness/judge-agreement.mjs` (score)
  - sk-doc: `shared/scripts/cite-drift-scan.mjs` (noul), `sk-create-skill/scripts/leaf-route-replay.cjs` (choice), `sk-create-skill/scripts/score-clarify-default.cjs` (choice), `sk-create-with-human-voice/scripts/hvr_reader_lens.py`
  - system-deep-loop: `deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` (choice), `deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` (noul), `deep-review/scripts/score-residue-flagger.cjs` (noul), `runtime/scripts/score-fanout-pairs.cjs` (noul), `runtime/scripts/score-severity-replay.cjs` (choice, noul), `runtime/scripts/score-stop-hint.cjs`, `runtime/scripts/score-stop-rater.cjs` (score)
  - system-skill-advisor: `runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` (choice, noul), `runtime/scripts/routing-accuracy/score-suggested-order.mjs` (choice)
  - system-spec-kit: `runtime/cli/evals/score-alignment-suggestion.ts` (choice), `runtime/cli/retrieval/score-track-narrowing.mjs` (choice), `runtime/scripts/completion-claim-audit/score-completion-claims.mjs` (noul), `runtime/scripts/debug-next-check/score-debug-next-check.mjs` (choice)
- The system-deep-loop, system-skill-advisor and system-spec-kit runtime trees are owned by another session's align packets. This packet leaves them alone (the rule 036 followed).
- `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` never mentions classifiers (a grep for `classif` finds nothing).
- `.skilled/skills/cli-classifier/` holds `cli-jev/` (the jev packet), `cli-deem/`, `shared/` (a README only) and the benchmark, catalog and playbook folders.

## Proposed frame (the spec may refine; mark anything not above as proposed)

- One shared transport module in cli-classifier (proposed `cli-classifier/shared/scripts/`), answering `choice` through Pi's SDK with the same result shape the jev CLI's JSON gives callers. The jev CLI stays the default. Pi is chosen only by an explicit switch or environment value (name proposed), so with it unset behavior is today's.
- Only `choice` is adopted, because 037 measured only `choice`. `bool` (for `noul`) and `score` stay on the CLI until each has its own measured run under the same keep rule. Whether the 037 scorer can be extended for them, and which recorded baselines exist, is UNKNOWN until the design reads the recorded runs.
- Callers: only callers in skills this packet may edit (cli-classifier, sk-doc, sk-communication) are candidates to opt in, and only `choice` callers. The runtime-tree callers get a recorded follow-up, not an edit.
- Docs through sk-doc: `cli-jev` gains the Pi route next to the CLI route. `cli-pi/SKILL.md` gains a short classifier section: how a Pi worker calls `models.classify()` from a codemode script or an extension, that credentials stay in Pi's store, and that a classifier answer is evidence, never permission (the Transport Guard in `cli-jev/SKILL.md`).
- A fall-back rule: when Pi is chosen but its gate fails (no Pi, no classifier model, missing credential), the transport prints one skip line and falls back to the CLI or stops, as the spec decides. Never a silent switch.
- Tests stub both backends. No live call is needed to build. One small live smoke call on the operator's yes is optional.
