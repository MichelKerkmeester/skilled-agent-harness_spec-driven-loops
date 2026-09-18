---
title: "Iteration 3: What Admission Needs Beyond the Check — Frozen Tables, Manifest Re-Mint, Guard Freshness"
trigger_phrases: []
---

# Iteration 3: What Admission Needs Beyond the Check — Frozen Tables, Manifest Re-Mint, Guard Freshness

## Focus

Q3 — inventory everything a new parent hub needs beyond a passing parity check: the frozen
`HUB_CHILD` / `DEFAULT_ON_HUBS` tables, the activation-manifest re-mint, and `compiled-route-guard.cjs`
freshness. Also resolve the live doc-vs-code topology drift found in Iteration 2.

## Findings

### F3.1 — Five independent hardcoded hub lists must change; none is derived

An eighth hub must be added to **five** frozen surfaces, not two:

| Surface | Live location | Current cohort |
|---|---|---|
| `HUB_CHILD` (hub → shadow-child path) | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:30-36` | 5 |
| `DEFAULT_ON_HUBS` (flag-unset cohort) | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:34-40` | 5 |
| `HUBS` (guard) | `.skilled/bin/compiled-route-guard.cjs:45-51` | 5 |
| `HUBS` (closure promotion tool) | `.skilled/bin/compiled-route-sync.cjs:54-60` | 5 |
| `hubs[]` + `files[]` inventory | `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:4-12` | 5 |

Each is hardcoded; the architecture reference states `HUB_CHILD` and `DEFAULT_ON_HUBS` are "hardcoded,
frozen tables owned by the runtime-engine phase, not derived from any manifest or scaffold output",
and that a hub absent from `HUB_CHILD` "always falls back to legacy, by construction". `loadHubEngine`
throws `unknown hub` for anything else. The guard list is also the source the pre-commit re-mint hook
reads (`BLOCKED [gate:route-remint]: could not read the hub list from compiled-route-guard.cjs`), so
omitting a surface quietly disables automation for the new hub rather than failing loudly.

[SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:30-36,58-59`]
[SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:34-40`]
[SOURCE: `.skilled/bin/compiled-route-guard.cjs:45-51,323`]
[SOURCE: `.skilled/bin/compiled-route-sync.cjs:54-60`]
[SOURCE: `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:74-83`]

### F3.2 — Manifest re-mint: `mint` is inert, `refresh` preserves authority, and nothing flips authority automatically

- `mintCanonicalManifest` creates a generation-1 manifest **only if absent**, with
  `servingAuthority: 'legacy'` and `shadowOnly: true` — inert onboarding evidence, exactly as the
  architecture reference describes the `--compiled-routing ready` boundary.
- `refreshCanonicalManifest` recompiles inputs one generation ahead, overwrites atomically (temp
  sibling + rename) and **preserves `servingAuthority`/`shadowOnly` untouched**.
- `checkCanonicalManifestFreshness` compares `selectedPolicy.{generation, effectivePolicyHash}`
  against the hub's current compiled snapshot; verdicts `fresh` / `stale-manifest` plus
  `missing-manifest`, `invalid-manifest`, `compile-error`, `unsafe-path`, `invalid-input`.
- The freshness comparison **must** prefer the graduated hub's own shadow-child snapshot
  (`shadowChildPolicyFor` → `loadHubEngine(hubId).snapshot.policy`) over the generic compiler,
  because the generic compiler throws on real packet kinds or yields a different hash — "refreshing
  through it can never produce a manifest the resolver's serve-time identity binding will accept."
- **The `servingAuthority: "compiled"` flip has no CLI.** Mint writes `legacy`; refresh preserves
  whatever is on disk. The final admission switch is a manual manifest edit (or an external ceremony),
  so a build phase must include an explicit, reviewable flip step and a test that it took.

[SOURCE: `.skilled/bin/lib/compiled-route-manifest.cjs:611-648` (inert mint), `:700-745` (refresh preserves), `:496-512` (shadow-child snapshot preference), `:515-568` (freshness compare / causeCodes)]
[SOURCE: `compiled-routing-architecture.md:87-105` — `ready` mints `servingAuthority: legacy`, `shadowOnly: true`]

### F3.3 — Freshness already has three enforcement moments; admission must slot into all three

1. **Pre-commit auto re-mint** — measured trigger: a staged `SKILL.md` at the hub root or in any
   nested mode stales the hub and the hook re-mints, copies the authored manifest copy, and stages
   both; `ROUTER.md`, references, README and assets do not trigger. A hub with staged and unstaged
   routing inputs at once is refused; a failed mint blocks and points at
   `compiled-route-manifest.cjs refresh --hub <hub>`.
2. **Guard** — `compiled-route-guard.cjs` reports `stale-manifest` (hub is serving legacy right now)
   and `authored-drift` (promoted runtime manifest differs from its authored copy; a rebuild would
   revert it), with narrow expiring exemptions allowed only for `inputs-do-not-compile`.
3. **Request-time probe** — `compiled-route-status.cjs` emits `manifestFreshness` and `causeCode`
   (`compiled-serving`, `stale-manifest`, `identity-mismatch`, `flag-off`, `legacy-authority`,
   `missing-manifest`, `engine-throw`), the live-gate counterpart to the Lane C verdict.

[SOURCE: `.opencode/scripts/git-hooks/pre-commit:281-468`; identical tracked file at `.skilled/scripts/git-hooks/pre-commit`]
[SOURCE: `git show a1faf0914a --format=%B` — measured trigger set, staged+unstaged refusal, pre-push backstop]
[SOURCE: `.skilled/bin/compiled-route-guard.cjs:98-118,150-166`]
[SOURCE: `.skilled/bin/compiled-route-status.cjs:9-18,72-90,217-267`]

### F3.4 — The promoted closure is built by tracing, and a new hub must join the trace

`compiled-route-sync.cjs` "does not hand-enumerate the closure": it instruments `require` resolution
and file reads, drives the authored resolver across every hub with the flag forced on, and copies
exactly the files the serving path touches into `.skilled/bin/lib/compiled-routing`, keeping relative
locations so dependencies still resolve. `--verify` re-traces the promoted closure and asserts no
path reads under `specs/` while every hub still resolves. The committed
`serving-closure.manifest.json` (48 files) is the inventory of the promoted closure read by the
eligible-hub check the retired harness used. A new hub whose shadow child is not reachable by the
traced serving path will not be promoted — and the sync `HUBS` list is what drives the trace.

[SOURCE: `.skilled/bin/compiled-route-sync.cjs:5-40` (design), `:54-60` (HUBS), `--verify` mode description)]
[SOURCE: `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:1-12` (hubs + generatedFrom)]
[SOURCE: `compiled-routing-parity.cjs:149-175` (`loadEligibleHubs` reads that manifest) at `b45ea54cea3^`]

### F3.5 — Topology history explains the doc/code drift: the cohort was 7, then 6, then 5

- `git log` for the resolver shows `feat(compiled-routing): enable compiled routing by default for
  all 7 hubs (015)` and later `fix(compiled-routing): migrate topology 7->6 after sk-design hub
  dissolution` — sk-design was dissolved (`023-sk-design-dissolution-routing-reactivation`).
- The sk-prompt retirement commit `8da89c0594e` removed that hub from exactly the surfaces above:
  `compiled-route-guard.cjs` (−1), `compiled-route-sync.cjs` (−1), `compiled-route.cjs` (−1),
  `resolve.cjs` (−1), `serving-closure.manifest.json` (±10), the shadow child, the activation
  manifest and fence-state. That is the inverse of an admission change and is the best field
  checklist available for building one.
- `compiled-route-layout.cjs` still ships a `current` layout (`009-parent-hub-rollout` /
  `014-runtime-engine` / `013-live-activation`) and a `legacy` one (`006` / `011` / `010`), which
  explains the architecture reference's `011-runtime-engine`/`006-parent-hub-rollout` paths. Its
  five-hub table lists five rows while the prose still says "seven parent hubs" — stale since the
  dissolution, and worth correcting before any new hub reads that reference.

[SOURCE: `git log --all --oneline -S "'sk-design'" -- '*bin/lib/compiled-routing/*runtime-engine/lib/resolve.cjs'` — 7→6 commits]
[SOURCE: `git show 8da89c0594e --stat` — sk-prompt retirement surface list]
[SOURCE: `.skilled/bin/lib/compiled-route-layout.cjs:30-44` (two layouts)]
[SOURCE: `compiled-routing-architecture.md:34-46` (seven-hub prose vs five-row table)]

### F3.6 — The post-retirement manual check was already performed once — by hand

Every admitted hub carries a `benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/`
report. The `sk-prompt` one documents the procedure used after the harness was gone: enumerate the
playbook scenarios, run the compiled side through `resolve.cjs` (flag unset, default-on cohort) and
the legacy side through `router-replay.cjs`, diff `targets[].workflowMode` against legacy intents and
the scenario's own gold — producing `5/5 pass, 0 drift` and explicitly recording that
`DEFAULT_ON_HUBS` held 7 hubs at that time. Two things follow: the manual substitute is feasible and
was trusted for an admission-style decision, and it is per-hub, agent-driven, and leaves no reusable
tool behind — exactly the gap this phase exists to close.

[SOURCE: `.skilled/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json` — meta.method, summary.pass=5, summary.compiled_vs_legacy_drift_count=0, summary.frozen_scorer_sha256_check]

### F3.7 — What Q3 adds to the spec's list

The spec's Q3 named three things (frozen tables, manifest re-mint, guard freshness). Evidence adds:
two more frozen hub lists (guard and sync) plus the serving-closure inventory (F3.1/F3.4); an
authority-flip step with **no owning tool** (F3.2); and a doc that still promises seven hubs and
legacy-layout paths (F3.5).

[SOURCE: `spec.md:75` — Q3 scope]

## Ruled-Out Directions

- **Treating the architecture reference as current topology** — its paths and hub count are the
  legacy layout and pre-dissolution cohort; using it as an admission checklist would target tables
  and paths that no longer serve. Ruled out by F3.5.
- **Assuming `mint` can admit a hub** — `mint` writes `servingAuthority: legacy` and refuses to
  overwrite; admission needs an explicit authority flip plus `refresh` against the shadow-child
  snapshot. Ruled out by F3.2.

## Open Threads Carried Forward

- Iteration 4 prices Path A (restore), Path B (new gold checker), Path C (keep closed) against the
  measured contract, the corpus sizes, the manual precedent, and this machinery inventory.

## Quality Note

All surfaces cited are live files in this checkout; topology history is cited from commit objects.
No writes outside the lineage.
