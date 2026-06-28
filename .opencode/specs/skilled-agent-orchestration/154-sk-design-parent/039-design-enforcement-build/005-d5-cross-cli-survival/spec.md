---
title: "D5 — Cross-CLI Survival Guarantee"
description: "Make the design contract survive CLI dispatch into codex/claude-code/opencode children — one phase per recommendation, D5-R1..R8."
trigger_phrases:
  - "d5 cross-cli survival build"
  - "design dispatch contract phases"
  - "cli design standards backlog"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
# D5 — Cross-CLI Survival Guarantee

## 1. PURPOSE
Guarantee that design judgment survives the CLI dispatch boundary, where a child cannot reach back into the parent's skills. Clone a `Design Standards Loading` ALWAYS rule as the exact twin of the existing code-standards rule into every cli-*, so it fires regardless of router phrasing. Add a `DESIGN_DISPATCH_MANIFEST` modeled on the proven Gate-3 spec-folder pass-through: present + pre-approved, or ASK before launch. Ship the contract payload-INLINE as a skill-local copied reference, because codex/claude-code children cannot resolve `.opencode/skills` paths. Close the loop with a child-resident transport demand-back plus parent-side digest re-validation that fails closed when Open Design was used but no result returns.

## 2. RECOMMENDATIONS (one phase each)
| Phase folder | ID | Title | Sev | Class |
|--------------|----|-------|-----|-------|
| `001-design-standards-always-rule` | D5-R1 | `Design Standards Loading` ALWAYS baseline rule (twin of code-standards) in all 3 cli-* | P0 | enforceable |
| `002-transport-result-revalidation` | D5-R2 | `OPEN_DESIGN_TRANSPORT_RESULT v1` demand-back + parent-side fail-closed re-validation | P0 | hybrid |
| `003-design-dispatch-manifest` | D5-R3 | `DESIGN_DISPATCH_MANIFEST v1` schema + Gate-3 present-or-ASK pass-through | P1 | enforceable |
| `004-design-router-intent-lane` | D5-R4 | `DESIGN` router intent lane in all 3 CLI dictionaries → skill-local contract | P1 | enforceable |
| `005-transport-assertion-pairing` | D5-R5 | `OPEN_DESIGN_TRANSPORT_ASSERTION v1` child-resident pairing rule | P1 | enforceable |
| `006-reject-register-unknown` | D5-R6 | Reject `register=unknown` at dispatch; hoist compact manifest to per-skill contract + parity | P1 | hybrid |
| `007-token-lint-route-replay-fixtures` | D5-R7 | Static token lint + router-replay + prompt-replay + negative-control fixtures | P1 | enforceable |
| `008-agent-io-advisory-only` | D5-R8 | Treat Agent I/O as advisory-only; never read its absence as proof | P2 | hybrid |

## 3. ENFORCEMENT CEILING — the honest "1000%"
**Enforceable across the CLI boundary:** presence of the `DESIGN_DISPATCH_MANIFEST` and transport assertion/result blocks via static token lint; router-lane firing on a fixed local corpus (the router is deterministic — lowercases, boundary-matches, scores, loads `RESOURCE_MAP[intent]`); payload-INLINE presence (the contract ships as a skill-local copied reference, not a cross-skill path the child cannot resolve); and parent-side re-validation rejecting mismatched digests or a mutating Open Design call absent from `toolsCalled`, failing closed when a multi-turn build wrote files without a matching result. **Advisory:** the child model's application quality and taste once the gate is satisfied, plus semantic classification of novel design phrasing beyond the fixture corpus. **The path-resolvability ceiling:** codex/claude-code children cannot resolve `.opencode/skills` paths, so the only enforceable guarantee is inline payload + returned-artifact re-validation; a text-only cli-claude-code child with no structured tool stream degrades digest matching to advisory.

## 4. SEQUENCING
P0 first, in order: **D5-R1** (`Design Standards Loading` ALWAYS rule — the deterministic safety net that fires independent of phrasing) and **D5-R2** (transport-result demand-back + parent-side fail-closed re-validation — the returned-artifact guarantee). These two are the enforceable spine; manifest schema, router lane, child assertion, register rejection, and fixtures layer on top. **FLAGGED COVERAGE GAP:** research iters 046–050 never exercised the `sk-prompt-small-model` per-model profiles or the `AGENTS.md` carry path — whether small-model children honor the inlined manifest, and whether Open Design routes via `DESIGN`→transport vs a compound `DESIGN_TRANSPORT` intent, remain untested. Add a small-model + `AGENTS.md` carry coverage phase (or an explicit note folded into D5-R3/D5-R7) at execution.

## 5. RELATED
- Source: [[037-design-routing-and-integration-research]] research.md §8
