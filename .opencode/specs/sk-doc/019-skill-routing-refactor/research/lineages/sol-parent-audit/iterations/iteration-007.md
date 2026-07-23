# Iteration 007 — Exhaustive stale-token and path scan

## Focus

Scan all six parent surfaces for old identities, renamed slugs, obsolete counts, path spelling drift, and contradictory rollout claims.

## Findings

1. **P1 — the routing reference contains mutually exclusive fleet-state claims.** It says all seven hubs ship `smart-routing.md` and manifests, but the diagram, per-artifact summary, and quick table still say only `sk-code` and `sk-doc`, including “populated 2/7” and sk-doc-only guard activation. The live tree has both artifacts for all seven. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:20] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:48] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:182] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:199]
2. **P1 — `routing-before-after.md` uses two nonexistent underscore paths.** Both references name `shared/references/smart_routing.md`; the live file on every hub is `shared/references/smart-routing.md`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:84] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:129] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:128]
3. **P2 — old parent and child names are confined to the intentional rename ledger.** No old identity appears in the current parent spec or routing references; those hits in `context-index.md` are provenance, not stale references. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:9] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:21]

## Ruled Out

- Historical old→new rows were not classified as defects.
- The direct 21-child count and Group E/F nested counts remain accurate. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:44]

## Sources Consulted

- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:182]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:84]

## Assessment

- New information ratio: 0.64
- Novelty: confirmed the stale tokens are concentrated in two supporting references.

## Reflection

Separating intentional history from live-contract prose avoided false positives.

## Recommended Next Focus

Lifecycle status-authority reconciliation.
