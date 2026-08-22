# Ceremony behavioral deltas

These route-gold differences are recorded without changing their pinned expectations.

| Child | Case | Prompt | Pinned expectation | Current actual |
| --- | --- | --- | --- | --- |
| `001-sk-code` | `ambiguous-leaf` | `quality review` | `clarify` | `route` / `orderedBundle` / `sk-code-quality`, `sk-code-review` |
| `005-sk-prompt` | `ordered-bundle-explicit-both` | `run prompt-improve then prompt-models` | `route` / `orderedBundle` / `sk-prompt-improve`, `sk-prompt-models` | `route` / `single` / `sk-prompt-models` |
| `006-sk-design` | `single-foundations` | `oklch palette color system` | `route` / `single` / `foundations` | `route` / `single` / `sk-design-interface` |
| `006-sk-design` | `single-motion` | `motion strategy choreography` | `route` / `single` / `motion` | `route` / `single` / `sk-design-interface` |
| `006-sk-design` | `single-audit` | `design audit quality score` | `route` / `single` / `audit` | `route` / `single` / `sk-design-interface` |
| `006-sk-design` | `ui-build-authored-bundle` | `ui build design tokens` | `route` / `orderedBundle` / `sk-design-interface`, `foundations` | `route` / `single` / `sk-design-interface` |
| `006-sk-design` | `interface-motion-separate-bundle` | `interface design plus motion design choreography` | `route` / `single` / `motion` | `route` / `single` / `sk-design-interface` |
| `006-sk-design` | `one-turn-clarify` | `visual design motion design` | `clarify` | `route` / `single` / `sk-design-interface` |
| `006-sk-design` | `zero-signal-defer` | `orchard inventory` | `defer` / `no-match` | `route` / `single` / `sk-design-interface` |
| `007-sk-doc` | `ordered-create-then-quality` | `create skill and validate documentation quality` | `route` / `orderedBundle` / `sk-create-quality-control`, `sk-create-skill` | `route` / `orderedBundle` / `sk-create-skill`, `sk-create-quality-control` |
| `001-sk-code` | validator probe (surface-only) | `webflow animation` | `defer` / `no-match` | `route` / `single` / `sk-code-webflow` (role `evidence`, `mutatesWorkspace: false`, authority `WithheldUntilVerify`) |

## Adjudication (2026-07-30)

All rows above were adjudicated against the live authored routing inputs before re-pinning:

- **ACCEPT** `001-sk-code` `ambiguous-leaf`: the authored `routerPolicy.tieBreak` now orders `sk-code-quality` before `sk-code-review`; the ordered bundle is compiled directly from that authored rule.
- **ACCEPT** `001-sk-code` surface-only probe: the hub's densified vocabulary now matches `webflow animation` to the `sk-code-webflow` evidence surface. The probe's invariant — a surface-only signal must never receive actor authority — still holds (role `evidence`, non-mutating, authority withheld), so the probe was repointed at that invariant rather than the incidental `defer`.
- **RESOLVED (not behavioral)** `005-sk-prompt` `ordered-bundle-explicit-both`: the pinned prompt used pre-rename mode tokens; with current names the original ordered-bundle expectation passes unchanged.
- **ACCEPT** `006-sk-design` ×7: the hub's authored consolidation merged foundations/motion/audit into `sk-design-interface` and set `defaultMode: sk-design-interface` (verified in the live `hub-router.json`). Constraint-driven defer/reject cases still pass untouched — only signal-based routing collapsed into the authored default.
- **ACCEPT** `007-sk-doc` `ordered-create-then-quality`: order follows the authored rule (create, then quality).

## Structural repairs surfaced by the re-baseline

- `001-sk-code` validator vs router inconsistency: the committed router deliberately bypasses the certificate-gated selective controller (its header documents that the controller made the hub under-route relative to legacy), but the committed validator still demanded certificate-driven abstention and calibration traces — a pair that could never pass together. The certificate gate was repointed at the truthful invariants of the authored design: certificate handles are inert (identical decision across valid/stale/mismatched/absent certificates) and advisor evidence is non-authoritative (a max-confidence live advisor leaves the decision identical to the unadvised one).
- `001-sk-code` `lib/policy-card.cjs`: the document-only replay hard-coded `surfaceBundle` for every matched composition rule while the compiled policy carries per-rule kinds; it now emits the rule's own kind, restoring document/machine parity for ordered bundles.
- `006-sk-design` falsifiers: emptying `bundleRules` is no longer a compile error because the authored router legitimately carries none — the falsifier now plants a rule referencing an unregistered mode; two probes still referenced pre-rename mode ids (`interface`, `foundations`).

## Adjudication (2026-08-22) — sk-design hub dissolution (7→6 re-activation)

The `sk-design` hub was dissolved from the skill tree after the fleet-freshness ceremony above (`.opencode/skills/sk-design/` has zero files in HEAD; design work now lives as the standalone `sk-design-md-generator` tool plus the mcp-figma transport). The compiled-routing engine, still encoding a 7-hub topology, went fully red (all hubs stale; `mcp-tooling` + `sk-design` `compile-error` on the missing sk-design source). This ceremony migrated the topology to the 6 surviving hubs and re-minted them.

- **REMOVE** `006-sk-design` (all 7 rollout-canary rows above are retired): the hub no longer exists, so its compiled contract is deleted, not re-baselined. Dropped from every lockstep site (`HUB_CHILD`, `DEFAULT_ON_HUBS` ×2 copies, `compiled-route-sync`/`compiled-route-guard` `HUBS`, advisor `COMPILED_ROUTING_HUBS`/`DEFAULT_ON_HUBS` + dist, cutover-controller order).
- **ACCEPT (zero behavioral delta)** `003-mcp-tooling`: the transport-axis cross-hub judgment pairing targeted `sk-design`/`sk-design-md-generator`, but that pairing was already inert (contributed no composition rule or destination — see `registry-compiler.cjs`) and its target is a standalone skill with no hub `mode-registry.json` for the compiler to consume. The `crossHubPairing` map was emptied and the harness judgment inputs dropped. Every mcp-tooling route-gold row is byte-identical to HEAD — only the provenance hash moved.
- **MECHANICAL re-pin** `sk-code`, `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`, `sk-prompt`, `sk-doc`: activation manifests refreshed to current compiled identities via the shipped `refresh` verb; canary `AUTHORED_SOURCE_DIGESTS`/`AUTHORED_DIGESTS` re-pinned where source bytes drifted (`system-deep-loop` SKILL.md; `sk-prompt` improve+models SKILL.md; `sk-doc` SKILL.md + `packets/sk-create-diff/SKILL.md`). Byte-identical recompile holds for all six; no scorer (`PROTECTED_DIGESTS`) pin was touched.
- **Behavioral proof**: a per-scenario HEAD-vs-regenerated diff of every `route-gold.typed.json` (action / selectionKind / targets / intents / resources) shows **zero** behavioral delta across all six survivors — the re-mint refreshed provenance only. Fleet resolves 6/6, guard exit 0, whole node gate 794 pass / 0 fail.
