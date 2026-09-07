# Iteration 3 — the two-vocabulary contract — gpt-5.6-luna

## Focus

Join the stage-2 machine-readable `ROUTER.md` vocabulary to each hub's stage-1 `graph-metadata.json` intent signals. Define an invariant that checks meaningful multi-word declarations while leaving bare common words as stage-2-only local vocabulary.

### What was read

- The four contract files for all six hubs were retained from iteration 2, with particular attention to each `ROUTER.md` `INTENT_SIGNALS` block and each graph metadata `intent_signals` array.
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:1-18,37-66,74-118` for the documented stage-1/stage-2 distinction, phrase extraction, advisor probe, and wrong-hub/no-reach classification.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223` for the fields actually projected into the scorer.
- `.opencode/skills/sk-code/mode-registry.json:5-14,22-59` for the `routingClass: metadata` contract in a nested hub.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/text.ts:19-34,64-74` for canonical normalization and phrase/token semantics.

### What was measured

Using the checker’s declaration filter (the first `INTENT_SIGNALS` block, quoted strings, phrases containing a space, and structural filters), a read-only join against each hub's top-level graph `intent_signals` returned:

```text
hub                         declared  stage1Exact  stage1Normalized
sk-design                         77           54                54
sk-doc                           169           46                46
sk-code                           41            6                 6
mcp-tooling                       76           53                53
system-deep-loop                  25            3                 4
cli-external-orchestration        51           17                17
```

Representative missing stage-1 counterparts were `font size`, `design review`, `critique this`, and `review this screen` for `sk-design`; `documentation quality`, `review the documentation`, `review bar`, and `pass review` for `sk-doc`; `stack trace`, `console error`, and `unit test` for `sk-code`; `create note` and `performance trace` for `mcp-tooling`; `iterative investigation`, `review request`, and `review loop` for `system-deep-loop`; and `full plugin and memory stack`, `spec kit runtime`, and `codex diff review` for `cli-external-orchestration`.

The checker source itself states that the two vocabularies are not meant to match, skips single words, probes multi-word phrases, and classifies a different hub as `wrong-hub` while treating no above-threshold result as `no-reach` information.

### Findings

1. The current design has a real two-vocabulary contract: stage 2 declares mode/leaf keywords, while stage 1 chooses the hub from graph metadata. The checker explicitly warns that diffing the arrays would report design differences rather than defects, and its extraction intentionally filters to multi-word phrases. This is the correct basis for a reach invariant; comparing every string or flagging one-word common vocabulary would be noisy and semantically wrong. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:7-18,37-51`]
2. The six-hub join shows substantial phrase coverage gaps before any runtime scoring occurs: exact stage-1 coverage is 54/77 for `sk-design`, 46/169 for `sk-doc`, 6/41 for `sk-code`, 53/76 for `mcp-tooling`, 3/25 for `system-deep-loop`, and 17/51 for `cli-external-orchestration`. Canonical normalization changes only the deep-loop count in this sample, so the gap is mostly missing stage-1 ownership data, not punctuation or hyphen normalization. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:37-51`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223`]
3. The source of the “router advertises but nobody reaches it” failure is now concrete: `ROUTER.md` declarations are consumed by a hub-local second stage, while the advisor projection loads graph metadata intent signals and does not import the router's `INTENT_SIGNALS`. A phrase such as `what should this look like` can be present in a description and router declaration yet remain unreachable until it is present in graph metadata intent signals, as the supplied worker measurement records. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223`; worker prompt `specs/system-skill-advisor/024-routing-perfection-research/research/dispatch-prompt.md`]
4. The safe invariant is owner-local and two-tier: for every declared stage-2 phrase with at least one space, its canonical form must have either (a) an exact/canonical owner entry in that hub's graph metadata intent signals or (b) an explicit generated stage-1 authorization record; then the dynamic probe must reach that owner at the configured confidence bar. A single-word router keyword is exempt from this invariant because it is a local mode selector whose failure is length/ambiguity telemetry, not proof of missing hub ownership. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:37-66,74-118`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/text.ts:29-34,64-74`]
5. The dynamic checker already has the correct failure taxonomy: `wrong-hub` is an actionable defect because another above-threshold recommendation owns the phrase, while `no-reach` is informational because short/underspecified phrases can fail before vocabulary is consulted. The missing piece is a static/generated ownership check that catches the stage-1 absence earlier and makes the reason explicit. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:80-118`]

### Recommendations

1. [implementable today] Add a static CI report using the existing multi-word extraction rule: `router phrase -> declared owner -> canonical graph intent signal`, with an explicit `stage1_authorized` exception for generated records. Keep one-word declarations out of the hard-failure set; report them only as stage-2 telemetry.
2. [needs a scorer change] Make the generated owner authorization a first-class projection field consumed by the explicit lane. This gives the scorer a bounded, provenance-bearing phrase anchor without unioning all router prose or changing the confidence threshold.
3. [implementable today] Run the dynamic probe after the static join and retain the existing taxonomy: fail `wrong-hub`, report `no-reach`, and include the top recommendations/confidences for diagnosis.
4. [implementable today] Use canonical normalization only for equivalent formatting variants; do not use fuzzy similarity to turn a missing phrase into a route. Fuzzy matching would blur ownership and recreate the collision seam from iteration 2.

### What this iteration could not settle

It did not inspect compiled-route membership or the checker’s build integration, and it did not decide whether the generated authorization should be stored directly in graph metadata or in a separate projection artifact. Those questions are reserved for iterations 4 and 5.

## Sources Consulted

All six hub contract quartets, the router reach checker, scorer projection/text utilities, the nested mode registry contract, the worker prompt, and the read-only exact/canonical coverage join.

## Assessment

Question 3 is answered: the invariant must operate on multi-word stage-2 phrases, require owner-local stage-1 authorization, then separately probe dynamic reach. Bare one-word common vocabulary is skipped; `wrong-hub` fails and `no-reach` remains telemetry. The primary fix is synchronizing an existing router declaration into an authoritative stage-1 projection, not comparing or globally unioning the two vocabularies.

## Reflection

The coverage table shows why the symptom feels fleet-wide: many router phrases are perfectly valid at stage 2 but have no stage-1 counterpart. Exact-versus-canonical counts show that normalization is a small seam relative to ownership data. Iteration 4 should now isolate the independent compiled-route boundary so the final recommendation does not conflate routing vocabulary with runtime compilation.

## Recommended Next Focus

Iteration 4: compiled routing — inspect the five compiled hubs versus legacy `sk-design`, trace the guard/registration boundary, and separate compiler rollout costs from scorer vocabulary repair.

