---
title: "Leaf Route Replay"
description: "Replays each parent hub's stage-two keyword block against the committed gold with zero model calls and judges keep, drop or stop against the prose arm."
trigger_phrases:
  - "leaf route replay"
  - "leaf-route-replay.cjs"
  - "stage-two keyword replay"
  - "router read recount"
version: 2.2.0.1
---

# Leaf Route Replay (leaf-route-replay.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Replays each parent hub's stage-two keyword block against the committed gold with zero model calls and judges keep, drop or stop against the prose arm.

Every parent hub ships a `ROUTER.md` whose `INTENT_SIGNALS` and `RESOURCE_MAP` blocks map a request's intent to the leaf resources the hub loads. `leaf-route-replay.cjs` in `sk-create-skill` runs those blocks over the gold the hubs commit and reports what the keyword arm selects. It never changes a router, a map, a manifest or a playbook. The tie-break arm stays dormant unless `--jev` is switched on.

---

## 2. HOW IT WORKS

With no switch the run makes zero model calls. The script reads each parent hub's `ROUTER.md` and scores every prompt in the 56-row committed gold, one row per committed scenario that carries a prompt and leaf pairs, through the keyword arm. An intent scores its weight once per keyword that hits the lowercased prompt, where `review`, `lcp`, `inp` and `cls` match on word boundaries and every other keyword matches as a substring. The kept intents are those within one point of the top score, and their `RESOURCE_MAP` paths convert to `(workflowMode, leafResourceId)` pairs that score against the gold pairs on precision, recall, F1 and exact match. A prompt no keyword hits counts `unknown` and scores zero, and a path no declared mode or alias resolves counts `unresolvable` and is never dropped. Each hub prints `hub=<id> gold=<g> unscored=<u> unknown=<n> unresolvable=<r> tied=<t> precision=<p> recall=<p> f1=<f> exact=<e>` and one `total gold=<n> scored=<n> tied=<n> mean_f1=<f> exact=<n>` line follows. Two hubs print markers instead of scores: `hub=cli-classifier stage1-only` names the hub that owns no stage-two leaf selection, and `hub=sk-code gold=1 unscored=1 surface slice not replayed` reports sk-code's gold row as unscored and never scored because its stage-two slice is a surface and language overlay this replay does not port.

`--transcripts <dir>` recounts the reads behind the block. The script walks the directory and counts one read per transcript line naming a Read on a `ROUTER.md`, takes the bytes from the paired `tool_result`, and buckets each read by hub and ISO week. It prints `router reads: files=<F> reads=<R> bytes=<B>` then one `router read hub=<id> week=<YYYY-Www> reads=<r> bytes=<b>` line per bucket, and `week=unknown` for a line with no timestamp. Counts and bytes leave the recount and transcript text never does. Without the flag the run prints `router reads: not measured`. `--prose <file>` adds the comparison arm: one line per scenario holding the id and the `workflowMode:leafResourceId` pairs the main AI loaded after reading a `ROUTER.md`, a line that does not fit that grammar is skipped and never guessed. The replay rule fixes coverage first at `10*P >= 9*N`, where `N` counts the rows the keyword arm scored and `P` the rows the prose file covers, and prints `replay verdict: stop (prose arm covers <P> of <N> rows)` below it. Past coverage the keyword arm's mean F1 on the covered rows meets the prose arm's mean F1 on the same rows, `drop` below and `keep` otherwise, and every verdict line ends with `N=<N> P=<P> keyword_f1=<x|n/a> prose_f1=<y|n/a>`. With no `--prose` file the covered set is empty, so the verdict stops on coverage.

`--jev` breaks the ties the replay found, the rows that kept two or more intents, behind its gate, and needs `--out <dir>`. Before any call the run prints `tied: K=<K>`, the `baseline: <union|first>` choice, `margin: 0.10`, `keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(SA-SB) >= M, sign test p < 0.05, flips 10*F <= 3*M` and `instruction: -q "Which intent does this request need?"`. A baseline with fewer than five improvable rows prints `no headroom` and no gate runs. The arm answers every tied row three times in rotated option order and writes every call to `calls.jsonl` before any stop. The column ends in `verdict jev: <keep|kill|stop (<reason>)> K=<K> M=<M> SA=<SA> SB=<SB> W=<W> L=<L> F=<F> p=<p> baseline=<union|first>` followed by the identity fields, and a stopped arm prints `jev: partial_rows=<n>` after its stop line with no verdict. `--report <dir>` writes `report.json` holding the per-hub rows, the totals, the router-read count, the replay verdict and each column verdict that ran. Nothing else is written and no router, map, manifest or playbook is touched.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | Script | Keyword replay, read recount, replay verdict, the tie-break arm and the column verdict |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs` | Script | Playbook scenario parser the replay imports for its gold rows |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | Shared | Frontmatter state and dict-body extraction for `INTENT_SIGNALS` and `RESOURCE_MAP` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs` | Shared | `dualReadLegacyResource` and `compositeKey`, the leaf-pair conversion boundary |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | Unit | Router parsing, the keyword arm, row scoring, the recount, the replay verdict and the gate on a stub binary |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md` | Manual playbook | Runs the zero-call replay and confirms the markers, the not-measured line and the replay stop line |

---

## 4. SOURCE METADATA

- Group: Packet-Authored, Registry-Projected Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `packet-authored-registry-routing/leaf-route-replay.md`

Related references:
- [packet-authored-registry-routing.md](packet-authored-registry-routing.md) - the registry-projected routing contract whose stage-two keyword block this replay scores
