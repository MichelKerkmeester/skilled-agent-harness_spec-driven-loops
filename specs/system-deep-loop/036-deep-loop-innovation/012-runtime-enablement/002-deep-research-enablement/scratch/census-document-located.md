# The census document exists, and the classification path is buildable

## The near-miss

The classifier refuses census bytes whose sha256 does not equal
`FROZEN_CENSUS_CONTRACT.stateBackendCensusSha256`. Nothing in the runtime supplies those bytes
outside a fixtures module, and no census document lives anywhere under `runtime/`. The obvious
conclusion was that the document had never been produced and the pin was aspirational — which
would have made the classification manifest, and therefore the whole certificate, unbuildable.

That conclusion was wrong. Hashing every candidate in the baseline-census packet:

    e35a707bc969f075e1e4fb0558a9b211f48c526a47d7d0a121e8712d54bb9441
      specs/.../001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/
      state-backend-census.json

An exact match to the pin. The document is committed; it simply lives in the spec packet that
produced it rather than beside the code that consumes it, so every search scoped to the runtime
missed it.

Worth recording as a location fact: a consumer that verifies a pinned digest but ships no
pointer to the artifact makes "does this exist?" a much harder question than it should be.

## What the census gives us

46 rows, each carrying a `resolvedPath` templated on `{spec_folder}`. The deep-research rows:

| Row | Resolved path |
|---|---|
| `research-config` | `{spec_folder}/research/deep-research-config.json` |
| `research-state` | `{spec_folder}/research/deep-research-state.jsonl` |
| `research-deltas` | `{spec_folder}/research/deltas/iter-NNN.jsonl` |
| `research-projections` | `{spec_folder}/research/{findings-registry.json,dashboard.md,research.md,resource-map.md}` |
| `research-strategy-inbox` | `{spec_folder}/research/{strategy.md,inbox.jsonl}` |
| `research-controls` | `{spec_folder}/research/{.deep-research.lock,.deep-research-pause}` |
| `research-workdirs` | `{spec_folder}/research/{iterations,prompts,logs,lineages,dispatch-receipts}/` |

## Why this resolves the false blocker properly

The control row that vetoed the drill resolves to a lock file and a pause file. It is live when
one of those exists — that is, when a run is actually holding or paused. On a quiescent system
neither exists, the row observes `isPresent: false`, and `decideRow` has no reason to veto.

That is what "must drain before reclassification" means in practice, and it confirms the earlier
correction from the other direction: the block was never a property of deep-research, it was the
consequence of asserting a policy where an observation belongs.

## The remaining piece is now well defined

An observer that, for each of the 46 census rows, resolves its `resolvedPath` against the real
spec folder and emits a `ClassificationEvidence` record describing what is actually there.
`createClassificationManifest` then derives every disposition through `decideRow`.

The classifier is fail-closed by design: a row with no evidence is classified `BLOCK` with
reason `MISSING_EVIDENCE` and the rationale "Required safety evidence is missing; the row vetoes
cutover." So the observer cannot be partial. Any row it declines to observe becomes a veto,
which is the correct default and also means there is no shortcut in which observing fewer rows
yields a cleaner result.
