# Iteration 001 — sk-doc hub routing surface

## Focus

Map the current `sk-doc` hub routing surface and establish whether `mode-registry.json` aliases lack literal, mode-local `hub-router.json` vocabulary counterparts.

## Actions Taken

1. Loaded the `sk-doc` hub contract and inspected the hub router's `routerSignals` and `vocabularyClasses`.
2. Inspected every `mode-registry.json` mode, alias array, packet binding, and command binding.
3. Ran an exact, case-sensitive mode-local comparison: for each registry mode, collect the keywords from its routed `*-aliases` class and subtract them from that mode's registry aliases.
4. Checked the repository inventory and tracked-file list for `.opencode/skills/sk-doc/command-metadata.json`, then triangulated the result against the hub's declared layout and sibling routing packets 007 and 008.

## Findings

### F1 — The expected ~34 alias-coverage gap is absent in the current tree

The exact comparison found **113 registry aliases, 113 corresponding mode-local vocabulary keywords, and 0 literal gaps**. The concrete alias-coverage gap list is therefore:

```json
[]
```

The per-mode counts are:

| Workflow mode | Registry aliases | Routed alias-class keywords | Literal gaps |
|---|---:|---:|---:|
| create-skill | 5 | 5 | 0 |
| create-skill-parent | 4 | 4 | 0 |
| create-readme | 9 | 9 | 0 |
| create-agent | 11 | 11 | 0 |
| create-command | 10 | 10 | 0 |
| create-feature-catalog | 7 | 7 | 0 |
| create-manual-testing-playbook | 7 | 7 | 0 |
| create-benchmark | 26 | 26 | 0 |
| create-flowchart | 8 | 8 | 0 |
| create-changelog | 10 | 10 | 0 |
| create-diff | 4 | 4 | 0 |
| create-quality-control | 12 | 12 | 0 |
| **Total** | **113** | **113** | **0** |

The hub binds every workflow mode to one mode-specific alias class plus a shared action class, and the visible class keyword arrays mirror the registry alias arrays exactly. [SOURCE: .opencode/skills/sk-doc/hub-router.json:22] [SOURCE: .opencode/skills/sk-doc/hub-router.json:36] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:16]

This is also the documented contract: packet trigger lines are the source, while `mode-registry.json` and `hub-router.json` are synchronized projections. [SOURCE: .opencode/skills/sk-doc/SKILL.md:48]

**Implication for Q1:** missing literal alias projection cannot explain the reported ~19% exact-resource recall on the current source snapshot. The scorer may still ignore or transform aliases incorrectly, or the benchmark may have used a different/stale snapshot, but those are scorer/provenance questions—not a present-day 34-alias config gap.

### F2 — `sk-doc/command-metadata.json` is not part of the current hub surface

The requested path `.opencode/skills/sk-doc/command-metadata.json` does not exist, is not tracked, and was not found anywhere under the active `sk-doc` skill. The hub routing pseudocode names only `mode-registry.json` and `hub-router.json`, and the declared layout likewise contains no `command-metadata.json`. [SOURCE: .opencode/skills/sk-doc/SKILL.md:55] [SOURCE: .opencode/skills/sk-doc/SKILL.md:107]

An active `.opencode/skills/sk-design/command-metadata.json` does exist, which suggests the iteration prompt likely projected a `sk-design` surface onto `sk-doc`. This is a provenance/configuration mismatch worth carrying into the scorer pass; no missing file was created because researched paths are read-only and the current `sk-doc` contract does not require it.

### F3 — Prior packet evidence corroborates zero vocabulary drift

Sibling packet 007 records the three-surface synchronization rule and reports `parent-hub-vocab-sync` at score 100 with zero orphan aliases and zero collisions. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/007-hub-intent-keyword-coverage/implementation-summary.md:55] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/007-hub-intent-keyword-coverage/implementation-summary.md:76]

Sibling packet 008 records a later alias swap mirrored into the registry and hub router, again with zero orphans. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/008-create-benchmark-routing/implementation-summary.md:40] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/008-create-benchmark-routing/implementation-summary.md:79]

This historical evidence agrees with the direct 113/113 comparison. It also rules out a transient drift left behind by the most recent benchmark-routing correction.

### Ruled-Out Direction

- **Enumerating ~34 current registry-to-vocabulary omissions:** ruled out. The exact omission set is empty. Repeating the comparison without a different source snapshot or scorer-derived normalization would not add information.

## Questions Answered

- **Q1 (source-config premise):** No. The current `mode-registry.json` has zero aliases lacking literal counterparts in the routed `hub-router.json` alias class. That alleged config gap cannot directly explain the low exact-resource recall.
- **Q1 (scorer branch):** Not yet fully answered. Whether `router-replay.cjs` projects, normalizes, or discards these fully present aliases remains for the scorer-focused iteration.

## Questions Remaining

- Does `router-replay.cjs` consume the current 113 aliases, a reduced projection, or a stale benchmark snapshot?
- What produced the expected "~34" figure, and does it refer to a different comparison such as command aliases, gold resources, or normalized tokens rather than literal registry-vocabulary equality?
- Q2 through Q5 remain open, including template path-root guidance, scorer dimensions, guard behavior beyond already-demonstrated drift equality, and the prioritized fix list.

## Next Focus

Inspect `router-replay.cjs` end-to-end—especially `projectHubRouter`, `buildRegistryIndex`, and `buildHubRouteTelemetry`—and locate the benchmark input snapshot that produced the 20/100 result. Reconcile its alias projection and resource-root semantics against the current 113/113 source equality before attributing recall loss to configuration.
