# Iteration 19: Cross-Command Composition

## Focus
Join independent creation templates into a coherent design-to-proof lifecycle.

## Findings
1. **Lifecycle order is conditional, not mandatory:** `design-reference (source evidence) -> design (direction) -> foundations (static system) -> motion (temporal behavior) -> sk-code build -> audit (evidence/remediation)`. Start at the smallest command matching the user job; do not force the whole chain.
2. **No nested public commands:** a command may load ordered `sk-design` modes or hand off an accepted envelope, but must not invoke another `/interface:*` command and restart intake. `/interface:design` uses the foundations build bundle directly when required. This prevents recursion and duplicate authority.
3. **Continuity object:** pass `{briefId, artifactVersion, acceptedDecisions, preservedConstraints, groundingRecord, unresolvedDecisions, proofStatus, evidenceRefs, nextRecommendedMode}`. Downstream stages append versioned deltas; they do not overwrite accepted upstream decisions without a visible amendment.
4. **Composition triggers:** design-reference feeds evidence when recreating/adapting a live system; foundations is extracted from design when implementation needs tokens/static rules; motion is invoked only for temporal states; audit follows a runnable artifact or explicitly operates at a static evidence ceiling. Any stage can terminate with a usable advisory artifact.
5. **Conflict protocol:** when downstream evidence contradicts accepted direction, stop the affected branch, report `accepted claim vs observed fact`, propose the smallest amendment, and resume only after acceptance. Audit cannot silently redesign; build constraints cannot silently erase signature decisions.

## Example Paths
| User job | Minimal path |
|---|---|
| new product interface | design -> foundations bundle -> sk-code -> audit |
| existing UI motion polish | motion -> sk-code -> targeted audit |
| reconstruct site style guide | design-reference only |
| fix contrast/responsive defects | audit -> foundations remediation -> sk-code -> re-test |
| apply extracted language to a new surface | design-reference -> design -> foundations -> sk-code |

## Ruled Out
- Commands invoking commands.
- Mandatory full-pipeline execution.
- Silent downstream amendment of accepted decisions.

## Assessment
- New information ratio: 0.37
- Novelty justification: Defines conditional composition, a versioned continuity object, minimal paths, and a cross-stage contradiction protocol.

## Recommended Next Focus
Run a final convergence pass: consolidate recommendations, remaining risks, implementation order, and acceptance gates before synthesis.
