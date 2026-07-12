---
title: "standardSource(authority)"
description: "The second adapter method: resolve where a named authority's own creation standard lives, plus its loaded known-deviation list."
trigger_phrases:
  - "standardSource authority"
  - "adapter standard source method"
  - "authority creation standard paths"
  - "validators templates rules"
  - "load known deviations"
version: 1.0.0.0
---

# standardSource(authority)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The second adapter method: resolve where a named authority's own creation standard lives, plus its loaded known-deviation list.

`standardSource()` answers "whose standard, and where is it," separately from "find the artifacts" (`discover`) and "check the artifact" (`check`). This separation is what lets the loop stay authority-agnostic: it asks each adapter for its own standard rather than carrying a per-authority branch itself.

## 2. HOW IT WORKS

`standardSource(authority) -> { ...rules, knownDeviations }` returns the concrete, real paths of the authority's own creation standard — its validators, standards docs, and templates — plus that authority's loaded known-deviation list. It reads only the standard, never the artifacts under review. Each adapter rejects any authority name that is not its own with an explicit error, so a mis-wired call fails loudly rather than silently checking against the wrong standard.

The returned shape is authority-specific because standards differ: sk-doc returns its two validator paths (`validate_document.py`, `extract_structure.py`), template dirs, and `core_standards.md`; sk-git returns its commit-grammar/branch-naming rule anchors in `SKILL.md` and the enforcement hook path; sk-design returns its structural-format, token-vocabulary, and audit-rubric doc paths and a `determinism: 'hybrid'` tag; sk-code returns its surface router, per-surface validators, an `excludedFromCheck` record for the tree-mutating minifier, and its reference dirs. Every one also carries `knownDeviations`, loaded from that authority's `sk_*_known_deviations.md` fenced JSON block.

**Difference from deep-review:** deep-review has no `standardSource` analog because it has no external standard to point at — its "standard" is the review-dimension contract baked into its own assets, not another skill's creation rules. `standardSource` is the method that operationalizes deep-alignment's defining boundary: every check is grounded in a specific, named authority's own documented templates and validators, resolved live rather than reimplemented.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/adapters/sk-doc.cjs` | Adapter | `standardSource('sk-doc')` returns validator paths, template dirs, `core_standards.md`, and loaded deviations. |
| `scripts/adapters/sk-git.cjs` | Adapter | Returns the `SKILL.md` rule anchors, the `commit-msg` hook path, and the exempt-subject prefixes. |
| `scripts/adapters/sk-design.cjs` | Adapter | Returns the structural-format/token/audit doc paths and the `hybrid`/`static-only-v1` tags. |
| `scripts/adapters/sk-code.cjs` | Adapter | Returns the surface router, per-surface validators, `excludedFromCheck`, and reference dirs. |
| `references/discover_contract.md` | Reference | Names `standardSource` as the second method of the ADR-003 three-method contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| Each `scripts/adapters/*.cjs` CLI `standard-source` subcommand | Manual dry-run | Prints an adapter's real `standardSource()` output for inspection. |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc/` | Spec phase | The reference adapter's `standardSource` acceptance criteria (ADR-003). |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/` | Spec phase | ADR-003 (the three-method contract) and ADR-005 (known-deviation list requirement). |

---

## 4. SOURCE METADATA

- Group: Adapter contract
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `adapter-contract/standard-source.md`
- Primary sources: `scripts/adapters/sk-doc.cjs`, `scripts/adapters/sk-git.cjs`, `scripts/adapters/sk-code.cjs`
Related references:
- [discover.md](discover.md) — discover(scope)
- [check.md](check.md) — check(artifact, rules)
- [../alignment-contract/known-deviation-suppression.md](../alignment_contract/known_deviation_suppression.md) — Known-deviation suppression
