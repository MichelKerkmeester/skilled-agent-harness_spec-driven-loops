# Gate A: A Decision For Every Unresolved Signal

AC-003 does not ask that every declared signal resolve. It asks that no unresolved signal sit
unexamined. This document is the answer: one recorded decision per signal that lands outside
RESOLVED, grouped by the mechanism that put it there, with the evidence that identified the
mechanism rather than a guess at it.

Measured at HEAD `fe1ec30fe8` on 2026-09-03, against the vocabulary the five hubs declare today.

---

## What the sweep measured

Same method as the baseline. Declared signals came from two sources per hub, unioned and
de-duplicated by exact string: the `intent_signals` column on that hub's row in
`skill-graph.sqlite`, and `derived.trigger_phrases` in that hub's `graph-metadata.json`.
Cross-hub overlap was checked again and is still zero.

```bash
# denominator, per hub
sqlite3 .opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite \
  "select intent_signals from skill_nodes where id='<hub>';"

# one call per signal
node .opencode/bin/skill-advisor.cjs advisor_recommend \
  --json '{"prompt":"<signal>"}' --format json --timeout-ms 60000
```

The driver wrote one JSON reply and one `.exit` file per signal, so no exit status was read
through a pipe. It ran 389 signals at 12 concurrent. Fifty-one calls came back exit 75,
`socket closed before response`, which is daemon back-pressure rather than a routing answer.
Those fifty-one were cleared and re-run at 4 concurrent. All 389 replies are exit 0 in the
committed capture. Rank is `recommendations[0]`, never a re-sort by `score`.

The raw capture is `gate-a-rerun-2026-09-03.tsv`, and the denominator is
`declared-signals-2026-09-03.tsv`.

### One column the baseline did not have

Each row also carries an engine-direct probe: what the hub's own compiled router decides for
that phrase, called through `014-runtime-engine/lib/compiled-route.cjs` with the resolver's
activation gate bypassed. That separates two failures the bucket alone cannot tell apart. A
signal can fail because its hub never reaches rank one, or because its hub reaches rank one
and then has no mode to send it to. The `engine_bucket` and `engine_targets` columns say
which.

---

## Today's count, and how it moved

| Bucket | 2026-09-02 | 2026-09-03 at HEAD | 2026-09-03 with the sk-doc pin discounted |
|---|---|---|---|
| RESOLVED | 331 | 243 | 339 |
| DEFERRED | 21 | 117 | 21 |
| WRONG_HUB | 15 | 15 | 15 |
| NO_RECOMMENDATION | 13 | 13 | 13 |
| MULTI | 1 | 1 | 1 |
| **Declared total** | **381** | **389** | **389** |

The denominator moved from 381 to 389. Eight signals were added and none was removed, all
eight to sk-doc, all frontmatter-contract vocabulary: `X.Y.Z.W`, `contextType`,
`frontmatter contract`, `frontmatter fields`, `frontmatter template`, `importance_tier`,
`missing frontmatter`, `trigger_phrases`. Each of the eight routes to exactly one mode.

The middle column is what routing does today, and it is 88 signals worse than two days ago.
Every one of those 88 belongs to sk-doc, and none of them is a vocabulary problem. The next
section is that defect. The right-hand column is the same sweep with the defect held aside,
and it is where the fifty decisions below live.

### The set of fifty is unchanged

Discounting the pin, the unresolved set is not merely the same size as the 2026-09-02 capture.
It is the same fifty signals, in the same four buckets, member for member. Compared as
`hub|signal|bucket` triples, `comm` reports nothing on either side.

---

## The defect that moved the number: sk-doc is serving legacy

`sk-doc` no longer serves its compiled router. The repository's own status tool says so:

```
node .opencode/bin/compiled-route-status.cjs --all --pretty
```

```json
{ "hubId": "sk-doc", "servingAuthority": "legacy", "causeCode": "stale-manifest",
  "selectedPolicy": { "generation": 5 },
  "effectivePolicyHash": "60f98f69b2245f6203fd5b0ac5ec02f24b093048ddc62fc3a506048edd53f922",
  "manifestFreshness": { "fresh": false,
    "currentPolicyHash": "d3d026c826aca9612156b705e8f01c569a8589abfc2a149a7fe9194d88bec28a" } }
```

The other four hubs report `compiled-serving` and `fresh`.

**Mechanism.** `resolveRoute` in `014-runtime-engine/lib/resolve.cjs` binds serve-time
identity: the snapshot it routes through must be the exact generation the activation manifest
selected, or it fails safe to legacy. The sk-doc snapshot's inputs include every mode packet's
`SKILL.md`, gathered by `sourceBytes()` in
`009-parent-hub-rollout/007-sk-doc/harness/build-artifacts.cjs`. Commit `756a7fcd4c` edited
`.opencode/skills/sk-doc/sk-create-chart/SKILL.md` without re-pinning
`013-live-activation/activation/sk-doc/manifest.json`, so the hash moved and the pin did not.
That was the first commit after `8a9c5af8a3` to touch a sk-doc routing input, and five later
commits touched the same file again.

**Blast radius.** The advisor still puts sk-doc at rank one for its own vocabulary, so a human
reading the recommendation sees nothing wrong. What is lost is the second stage: no
`compiledRoute` is attached, so no mode is named. Ninety-six sk-doc signals that route to
exactly one mode under the engine-direct probe are served as a bare hub recommendation today.

**This phase does not own the fix.** Re-pinning is a compiled-routing change, and the contract
is that a routing-input edit carries refresh, sync, verify, finalize and canary re-pin in one
commit. The change lands in
`.opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json`,
driven by the sync tooling rather than hand-edited. Recorded here, raised to the parent packet.

---

## The decision table

One row per group. Every group is a distinct mechanism, verified against the file that
implements it. `n` counts the signals sharing that exact mechanism, and the groups sum to 50.

| ID | n | Mechanism, and the evidence for it | Decision |
|---|---|---|---|
| D-01 | 18 | The phrase is a keyword of the hub's `hub-identity` vocabulary class, and that class is named in `routerPolicy.discoveryClasses`. The class carries its own note: hub-level vocabulary that identifies THIS hub, not any one mode, deliberately unreferenced by `routerSignals` so hub-identity-only prompts defer. Read from each hub's `hub-router.json`. | **Correct as declared.** The deferral is the contract working. Keep the vocabulary, since it is what makes the hub reachable at stage one. No fix. |
| D-02 | 1 | `screen examples` is the sole keyword of mcp-tooling's `provider-neutral-design-research` class, also listed in `discoveryClasses`. Its note reserves it for defer between `mcp-refero` and `mcp-mobbin` per the MT-008 and MT-009 scenario contracts, and forbids it as provider-scoring vocabulary. | **Correct as declared.** A phrase naming neither provider must defer. Routing it would break the two scenario contracts. No fix. |
| D-03 | 2 | `sk-code hub` and `language-specific verification commands` defer identically to D-01, but sit in no vocabulary class at all. Their shorter forms `sk-code` and `verification commands` are both in the `hub-identity` class. | **Same as D-01, and tidy the declaration.** Served behaviour is already identical, so this changes nothing a caller sees. Fix: add both keywords to the `hub-identity` class in `.opencode/skills/sk-code/hub-router.json`. |
| D-04 | 2 | A command bridge wins rank one. `create agent` and `model benchmark` are verbatim `intentSignals` entries on the `create:agent` and `deep-model-benchmark` bridges, both hard-coded with `kind: 'command'` in `lib/scorer/projection.ts`. On `create agent` the comparator lifts the bridge at 0.513 above sk-doc at 0.589, which is the rank rule from D2 working rather than a scoring accident. | **Correct as designed.** The command is a real entry point to the same work. No fix. |
| D-05 | 10 | Cross-hub precedence. The owning hub is present but outranked, and the engine-direct probe shows its own router would send the phrase to exactly one mode. Measured owning-hub rank: rank 2 for eight of them, absent from the returned set for `capture browser screenshots` and `codex diff review`, and nothing lower than rank 2. | **Not settleable by one hub.** Each is a boundary between two hubs' vocabularies, which is phase 004's scope. Recorded per signal below. |
| D-06 | 1 | `mcp tool bridge` is outranked by `mcp-code-mode`, and it is also a keyword of mcp-tooling's own `hub-identity` class. Reaching mcp-tooling would therefore defer, so no mode was ever the destination. | **Retire from mcp-tooling, or leave it losing.** `mcp-code-mode` is the tool-bridge layer, so the winner is defensible. Fix, if taken: drop the keyword from `.opencode/skills/mcp-tooling/hub-router.json` and its projection. Cross-hub, so phase 004. |
| D-07 | 1 | `deep-review` returns only `sk-design` at 0.297 and system-deep-loop does not appear. The spaced form `deep review` puts system-deep-loop at rank one on 0.805. The hyphen, not the words, is what loses the match. | **Genuine defect, fix it.** Add the hyphenated form to system-deep-loop's advisor projection in `.opencode/skills/system-deep-loop/graph-metadata.json`. |
| D-08 | 1 | `benchmark a model or prompt framework` goes to `sk-prompt` on 0.873, because the phrase literally contains `prompt framework`, which is sk-prompt's core vocabulary. `deep-model-benchmark` sits at rank 2 on 0.700, so the intended destination is already reachable through D-04's bridge. | **Retire the phrase.** It reads as a description of the mode rather than a trigger for it, and the routable form already works. Fix: remove it from `.opencode/skills/system-deep-loop/graph-metadata.json`. |
| D-09 | 9 | Below the strict gate on confidence. Re-probed with `confidenceThreshold: 0` and `uncertaintyThreshold: 1`, the owning hub is rank one for all nine, and the engine-direct probe routes all nine to exactly one mode. Observed confidence: 0.25 for `dom inspect` and `task list`, 0.61 to 0.65 for `magicpath`, `magicpath ai`, `magicpath canvas`, `dqi score` and `swe-1.7 dispatch`, 0.72 for `ink-on-parchment retint` and `evaluate agent`. The floor is 0.80. | **Both stages already hold the vocabulary. Only its stage-one weight is too thin.** Fix: raise each phrase's weight in its owning hub's `graph-metadata.json`. |
| D-10 | 1 | `lighthouse` is a different mechanism from D-09 and is kept separate for that reason. mcp-tooling clears confidence at 0.82 and fails on uncertainty at 0.42, against a strict threshold of 0.35. | **Same family of fix, different gate.** Raising lexical weight alone will not clear an uncertainty gate. Fix belongs with D-09 in `.opencode/skills/mcp-tooling/graph-metadata.json`, and must be verified against uncertainty rather than confidence. |
| D-11 | 3 | Another hub wins even with both thresholds relaxed. `mcp-magicpath` goes to sk-code at 0.562 against mcp-tooling at 0.324. `improve agent` goes to sk-prompt at 0.147 against system-deep-loop at 0.104. `score agent candidate` goes to sk-prompt at 0.147 and system-deep-loop is absent from the top three. | **Thin weight and cross-hub precedence together.** Raising the owning hub alone may not settle it, so it goes to phase 004 with D-05 rather than being fixed blind. |
| D-12 | 1 | `stable jsonl keys` is a bucket artefact, not an unresolved signal. The compiled route returns `selectionKind: "surfaceBundle"` with one `packetKind: "workflow"` target, `sk-code-quality`, plus one `packetKind: "surface"` evidence packet, `sk-code-opencode`. sk-code's `routerPolicy` defines `surfaceBundle` as exactly that shape. | **The signal resolves. The bucket rule cannot see it.** MULTI counts `targets` length without distinguishing a workflow packet from read-only evidence. Recorded rather than re-bucketed, since redefining a bucket would move the frozen baseline. |

### D-05 and D-11, per signal

| Signal | Owning hub | Reaches instead | Owning hub's own router would route it to |
|---|---|---|---|
| `opencode skill` | sk-doc | sk-code, `sk-code-opencode` | `sk-create-skill` |
| `opencode agent` | sk-doc | sk-code, `sk-code-opencode` | `sk-create-agent` |
| `opencode command` | sk-doc | sk-code, `sk-code-opencode` | `sk-create-command` |
| `doc quality` | sk-doc | sk-code, `sk-code-quality` | `sk-create-quality-control` |
| `document before after review` | sk-doc | sk-code, `sk-code-review` | `sk-create-diff` |
| `pi remote design system` | sk-code | sk-design-md-generator | `sk-code-mobile-cli` |
| `browser debug` | mcp-tooling | sk-code, `sk-code-webflow` | `mcp-chrome-devtools` |
| `capture browser screenshots` | mcp-tooling | sk-code, `sk-code-webflow` | `mcp-chrome-devtools` |
| `codex diff review` | cli-external-orchestration | sk-code, `sk-code-review` | `cli-codex` |
| `severity weighted findings` | system-deep-loop | sk-code, `sk-code-review` | `review` |
| `mcp-magicpath` | mcp-tooling | sk-code | `mcp-magicpath` |
| `improve agent` | system-deep-loop | sk-prompt | `agent-improvement` |
| `score agent candidate` | system-deep-loop | sk-prompt | `agent-improvement` |

The three `opencode *` rows are one collision, not three. Authoring an OpenCode component is
sk-doc's work under the artifact trigger, while `sk-code-opencode` is a read-only surface
evidence packet for editing OpenCode code. The word `opencode` currently decides the hub on
its own.

---

## What each group leaves behind

| Outcome | Groups | Signals |
|---|---|---|
| Correct as it stands, no fix wanted | D-01, D-02, D-04 | 21 |
| Fix identified, owned by this packet's hub layer | D-03, D-07, D-08, D-09, D-10 | 14 |
| Handed to phase 004, cross-hub | D-05, D-06, D-11 | 14 |
| Recorded as a measurement artefact | D-12 | 1 |
| **Total** | | **50** |

Every fix below is a routing-input change. A routing input carries the compiled-routing
refresh, sync, verify, finalize and canary re-pin in one commit, and none of that is this
phase's scope. The rows say where the change lands, not that it has been made.

| Fix | File it lands in | Groups |
|---|---|---|
| Name two hub-identity phrases the router already treats as such | `.opencode/skills/sk-code/hub-router.json` | D-03 |
| Add the hyphenated `deep-review`, retire the prompt-framework phrase | `.opencode/skills/system-deep-loop/graph-metadata.json` | D-07, D-08 |
| Raise stage-one weight for `dqi score` | `.opencode/skills/sk-doc/graph-metadata.json` | D-09 |
| Raise stage-one weight for `ink-on-parchment retint` | `.opencode/skills/sk-code/graph-metadata.json` | D-09 |
| Raise stage-one weight for five phrases, and clear an uncertainty gate for `lighthouse` | `.opencode/skills/mcp-tooling/graph-metadata.json` | D-09, D-10 |
| Raise stage-one weight for `swe-1.7 dispatch` | `.opencode/skills/cli-external-orchestration/graph-metadata.json` | D-09 |
| Raise stage-one weight for `evaluate agent` | `.opencode/skills/system-deep-loop/graph-metadata.json` | D-09 |
| Re-pin the drifted activation manifest | `.opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | The serving defect above, which is separate from the fifty |

---

## What this document does not claim

The fifty decisions describe stage-one and stage-two behaviour at `fe1ec30fe8`. They do not
predict what a fix would score, because a vocabulary change is measured after it ships and not
before.

The engine-direct column bypasses the activation gate on purpose. It answers what a hub's
router would do, never what a caller is served. Where the two disagree, the bucket is what a
caller gets. The stale pin makes them disagree for 96 of sk-doc's 105 signals, and the other
nine fail before the compiled stage is reached at all.

Two mechanisms behind the confidence gate stayed unexamined, because neither changes a
decision. `dom inspect` and `task list` return the owning hub at 0.25 rather than the 0.6 to
0.7 the rest of D-09 shows, which is a suppression rather than thin weight. Chasing which of
the two abstention paths in `lib/scorer/fusion.ts` applied would refine the fix, not the
decision, and both signals land in the same group either way.
