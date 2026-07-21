---
title: Serving-Snapshot Schema and Compiled-Routing Archive Convention
description: The serving-snapshot.json schema that joins a hub's live compiled-routing state into one artifact, the durable fail-closed compiled-routing/<run-label>/ report-path convention, repo-relative portable provenance, and the active-manifest archive boundary. The D1-D5 scoring contract stays owned by deep-improvement and is linked, not restated.
trigger_phrases:
  - "serving snapshot schema"
  - "serving-snapshot.json fields"
  - "compiled routing report path convention"
  - "compiled routing archive convention"
  - "router-compiled-parity-baseline label"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Serving-Snapshot Schema and Compiled-Routing Archive Convention

A hub's live compiled-routing state is otherwise split across several
single-record files, and a compiled-parity Lane C run otherwise writes only to a
throwaway outputs directory with an absolute checkout path baked in. This
reference fixes three durable conventions that make compiled-routing evidence
survive a run, join into one readable artifact, and stay valid off the machine
that produced it:

1. the **`serving-snapshot.json`** schema — the joined per-hub state artifact;
2. the durable, fail-closed **`compiled-routing/<run-label>/`** report-path
   convention — the sibling of `router-final/`/`live-final/`;
3. **repo-relative portable provenance** replacing the absolute checkout path.

This is a storage-and-schema standard only. The D1-D5 measurement contract,
verdict bands, and the compiled-parity sub-verdict stay owned by
deep-improvement and are linked in section 6, never restated here.

---

## 1. OVERVIEW

The compiled-routing runtime serves each hub from an activation manifest under
`.opencode/bin/lib/compiled-routing/010-live-activation/activation/<hub>/`. That
serving state — the declared authority, the fence epoch, the selected policy,
the flag, and the latest parity result — is spread across separate files with no
single artifact that answers "what is this hub serving right now." The
`serving-snapshot.json` joins them.

Separately, a Lane C compiled-parity run emits the canonical
`skill-benchmark-report.{json,md}` pair carrying a `report.compiledRouting`
block (rendered by the non-frozen `build-report.cjs`). Those pairs need a durable
home beside the hub, the same way `router-final/` and `live-final/` already do
for non-compiled runs — but fail-closed, and stamped with portable provenance.

Two scripts under this packet implement the conventions:

| Script | Role |
| --- | --- |
| [`../../scripts/render-serving-snapshot.cjs`](../../scripts/render-serving-snapshot.cjs) | Capture, render, and validate `serving-snapshot.json` for one hub or all hubs. |
| [`../../scripts/archive-compiled-routing.cjs`](../../scripts/archive-compiled-routing.cjs) | Archive a compiled-parity report pair under the fail-closed `compiled-routing/<run-label>/` convention, gated on the active manifest, with repo-relative provenance. |

Both read only the **active** `010-live-activation` manifest and refuse a
`006-parent-hub-rollout` shadow candidate. Neither ever edits the three frozen
scorer files or the frozen `baseline` label.

---

## 2. THE `serving-snapshot.json` SCHEMA (V1)

One `serving-snapshot.json` per hub joins the live state into a single object.
It carries **exactly** the fields below — the validator rejects a missing
required field and an unexpected extra field alike, so the artifact cannot
quietly grow a field no consumer agreed to.

```json
{
  "schemaVersion": "serving-snapshot/V1",
  "hubId": "sk-code",
  "capturedAt": "2026-07-21T00:00:00.000Z",
  "flag": { "raw": null, "state": "unset", "flagMode": "legacy", "permitsCompiledWhenEligible": false },
  "manifest": {
    "selectedPolicyHash": "1a42e5…",
    "generation": 2,
    "fenceEpoch": 4,
    "servingAuthority": "compiled",
    "shadowOnly": false
  },
  "liveConfigHash": "9e9a56…",
  "freshness": { "state": "fresh", "manifestPresent": true, "manifestStableDuringCapture": true, "engineResolverPresent": true },
  "engineResolverPath": ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs",
  "parityBaseline": { "label": "router-compiled-parity-baseline", "present": false, "reportDigest": null, "capturedAt": null, "verdict": null },
  "realModelLast": null
}
```

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Always `"serving-snapshot/V1"` for this format. |
| `hubId` | The hub the snapshot describes. |
| `capturedAt` | ISO-8601 UTC capture time. |
| `flag` | The benchmark-facing flag classification, single-sourced from the runtime flag classifier (`raw`, `state`, `flagMode`, `permitsCompiledWhenEligible`). |
| `manifest.selectedPolicyHash` | `selectedPolicy.effectivePolicyHash` of the active manifest. |
| `manifest.generation` | `selectedPolicy.generation` of the active manifest. |
| `manifest.fenceEpoch` | `fencingEpoch` from the hub's `fence-state.json`. |
| `manifest.servingAuthority` | The **declared** authority of the manifest (`compiled`/`legacy`) — not the flag-adjusted effective authority, which is captured separately in `flag`. |
| `manifest.shadowOnly` | The manifest's `shadowOnly` flag. |
| `liveConfigHash` | SHA-256 of the active manifest bytes — a stable identity of the config exactly as it serves. |
| `freshness` | Whether the manifest was present and stable across the capture read and whether the promoted engine resolver is present (`state` ∈ `fresh` / `drifted` / `no-manifest`). |
| `engineResolverPath` | **Repo-relative** path to the promoted resolver, so the snapshot resolves on any checkout. |
| `parityBaseline` | Pointer to the archived `router-compiled-parity-baseline` run (present + digest + verdict), or an explicit not-yet-archived state. |
| `realModelLast` | Summary of the most recent archived real-model (live-trace) parity run, or `null` when none has been archived. |

### Pre-activation and no-manifest states

A hub with no active manifest yet does not fabricate one: `freshness.state` is
`no-manifest`, `liveConfigHash` is `null`, and the `manifest` fields report their
absent values. The snapshot still validates — an honest "no active manifest"
reading is a valid snapshot.

### Capture, render, and validate

```bash
# Capture + validate one hub (writes serving-snapshot.{json,md} into <dir>):
node .opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs \
  --hub sk-code --out <dir> --pretty

# Validate a real hub's live snapshot against this schema, no write:
node .opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs --hub sk-code --validate
```

The `.md` view is rendered from the same JSON so the two never drift, exactly as
the Lane C report `.md` is renderer-owned (see the storage guide).

---

## 3. THE `compiled-routing/<run-label>/` REPORT-PATH CONVENTION

A compiled-parity run's report pair is archived under its hub's own benchmark
tree, as a sibling of the existing run-label folders:

```text
<hub>/benchmark/compiled-routing/
├── router-compiled-parity-baseline/     # immutable parity before-anchor
│   ├── skill-benchmark-report.json
│   └── skill-benchmark-report.md
└── router-compiled-parity-final/        # immutable parity after-anchor
    ├── skill-benchmark-report.json
    └── skill-benchmark-report.md
```

| Rule | Behavior |
| --- | --- |
| **Fail-closed on collision** | An existing `<run-label>/` directory — or either half of a prior (possibly partial) report pair — is treated as occupied. The archiver exits non-zero and writes **nothing**; it never overwrites and never leaves a partial directory. Re-minting a label is a deliberate operator decision, out of scope for the convention. |
| **Active-manifest gated** | Every archive reads the active `010-live-activation/activation/<hub>/manifest.json` and re-reads it immediately before committing. A digest change between start and commit aborts the archive rather than attributing a shifted decision. |
| **Shadow-candidate refused** | A `006-parent-hub-rollout` manifest source is refused — it was never live, so archiving it as the serving decision would misattribute state. |
| **`baseline` never repurposed** | The frozen `baseline` label is never written by this convention. New parity evidence is always an additive sibling, conventionally `router-compiled-parity-baseline` / `router-compiled-parity-final`. |

### New label family

`sk-code/benchmark/` already carries `baseline`, `router-baseline`,
`router-final`, and `live-final`; `router-compiled-parity-baseline` /
`router-compiled-parity-final` slot into that same family without colliding with
any existing label. Labels match `^[a-z0-9]+(?:-[a-z0-9]+)*$`, and `baseline` is
explicitly refused.

```bash
node .opencode/skills/sk-doc/create-benchmark/scripts/archive-compiled-routing.cjs \
  --hub sk-code --run-label router-compiled-parity-final \
  --report <lane-c-outputs-dir>/skill-benchmark-report.json
```

---

## 4. REPO-RELATIVE PORTABLE PROVENANCE

A shipped Lane C report serializes `targetSkill.root` as an absolute checkout
path, which is stale the moment the file is read from a different worktree. On
archive, the convention rewrites provenance to a portable form:

- `targetSkill.root` (absolute) is **dropped**; `targetSkill.rootRel`
  (repo-relative) replaces it.
- A `report.provenance` block is added: `rootRel`, `capturedAt`, the active
  `manifestDigest`, the repo-relative `activationManifestRel` and
  `engineResolverPath`, and the `sourceReportDigest`.
- A `report.executionContext` block is added: `executor`, `model` + `variant`,
  `cliVersion`, `traceMode`, `flagState`, `runtimeDigest` (the promoted serving
  closure identity), `manifestDigest`, `scenarioIds`, and `runRevision` — enough
  to prove which subject and which serving generation produced the run.

The non-frozen `build-report.cjs` renders these two blocks into a **Provenance &
execution context** section, present only for archived pairs (a live run report
carries neither block, so its rendered shape is unchanged). An archived pair
therefore contains no absolute checkout path and resolves correctly when copied
to another machine or worktree.

Historical reports are **not** retrofitted — only newly-archived reports gain the
repo-relative form.

---

## 5. THE APPEND-ONLY TRANSITION LOG (OWNED ELSEWHERE)

The append-only per-hub serving-authority transition ledger,
`flip-history.jsonl`, is emitted by the activation drivers and its schema is
owned by the rollback-audit phase, not by this archive convention. This
reference does not write or define it; a `serving-snapshot.json` links the
current serving state, and the ledger carries the full transition history. See
the rollback-audit `flip-history-schema.md` for that format.

---

## 6. RELATED RESOURCES

### Normative contract (owned by deep-improvement — link, do not restate)

- [`scoring-contract.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) — the authoritative D1-D5 computation and verdict bands.
- [`operator-guide.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/operator-guide.md) — how to run Lane C, including the compiled-parity flag.
- [`build-report.cjs`](../../../../system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs) — the renderer that owns `skill-benchmark-report.md` and the `report.compiledRouting` + Provenance blocks.

### Within this packet

- [`skill-benchmark-storage-guide.md`](skill-benchmark-storage-guide.md) — the hub `benchmark/` storage convention this compiled-routing convention extends.
- [`../../scripts/render-serving-snapshot.cjs`](../../scripts/render-serving-snapshot.cjs) — the serving-snapshot capture/render/validate script.
- [`../../scripts/archive-compiled-routing.cjs`](../../scripts/archive-compiled-routing.cjs) — the fail-closed compiled-routing archiver.

---

*End of serving-snapshot schema and compiled-routing archive convention — the normative D1-D5 measurement contract lives in [`scoring-contract.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md), owned by deep-improvement.*
