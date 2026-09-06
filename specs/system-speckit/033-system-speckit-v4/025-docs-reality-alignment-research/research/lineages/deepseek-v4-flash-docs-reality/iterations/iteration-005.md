# Iteration 5: Shipped features with no catalog/playbook entry (F5)

## Focus

Hold focus F5: diff the shipped runtime rule-engine surface and cli subcommands against the catalog/playbook inventory. This pass compared the rule-file table in `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` against the actual 39-rule registry and the on-disk `runtime/cli/rules/` script set.

## Findings

### F5-01 — Rule-engine catalog file table lists a non-registered rule and omits many registered rules (P2 cosmetic-to-misleading)

**Doc claim (quoted):** `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:79` — "`.opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh` | Validation rule | Rule script discovered and executed by the orchestrator for link validation." The surrounding table (`:70-82`) presents the rule-file inventory as the orchestrator's registered rule set.

**Actual behavior:** `check-links.sh` is **not** a registered validator rule. `runtime/cli/lib/validator-registry.json` (39 rules) has no rule whose `rule_id`/`script_path` resolves to `check-links.sh` (verified by a script that matches `/link|pointer/i` over the registry). `runtime/lib/validation/orchestrator.ts` has no reference to `check-links` (grep empty), so the orchestrator does not discover it. `check-links.sh` is a standalone wikilink checker (validated by `markdown-link-integrity-guard.md:21`), not an orchestrator rule. Conversely, the table **omits** several real registered rule scripts: `check-ac-closure.sh`, `check-ac-coverage.sh`, `check-canonical-save.sh`, `check-comment-hygiene.sh`, `check-description-shape.sh`, `check-graph-metadata*.sh`, `check-grep-convention.sh`, `check-improvement-artifacts.sh`, `check-metadata-disk-consistency.sh`, `check-scaffold-never-touched.sh`, `check-status-cross-doc-consistency.sh`.

- Doc: [SOURCE: feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:79]
- Actual: [SOURCE: runtime/cli/lib/validator-registry.json]; [SOURCE: runtime/lib/validation/orchestrator.ts] (no check-links reference); [SOURCE: feature-catalog/tooling-and-scripts/markdown-link-integrity-guard.md:21]
- Severity: P2
- One-line fix: drop the `check-links.sh` row from the rule table (it is a standalone wikilink checker at `runtime/cli/check-links.sh`), and add the missing registered rule scripts; or point the table at `runtime/cli/lib/validator-registry.json` as the authoritative inventory.

## Sources Consulted

- feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:70-95
- feature-catalog/tooling-and-scripts/markdown-link-integrity-guard.md:19-76
- runtime/cli/lib/validator-registry.json (39 rules, script_paths)
- runtime/lib/validation/orchestrator.ts (rule dispatch, native rule set)
- runtime/cli/rules/ (dir listing); runtime/cli/check-links.sh; runtime/cli/check-markdown-links.cjs
- references/validation/validation-rules.md:44-104 (rule summary table is explicit that it is partial)

## Assessment

- newInfoRatio: 0.75
- Novelty justification: F5-01 is a new rule-engine inventory finding, but it overlaps the earlier rule-name/layout scan (iteration 3, "no phantom rule ids") in surface, so novelty is moderated; it refines that earlier "clean" verdict into one concrete discrepancy.
- Confidence notes: Confirmed by matching the registry's `script_path` set against the table and confirming no orchestrator reference to `check-links`. The "omitted rules" half is verified by comparing the registry script_path list against the table rows.

## Reflection

- What worked: the registry is the single source of truth for what the orchestrator runs, so diffing the catalog file table against it is decisive and read-only.
- What failed: exhaustive "no doc entry" proof is expensive; the concrete, citable discrepancy (one ghost rule + several omitted) is the defensible F5 yield.
- Ruled out: was not able to find a major shipped CLI subcommand with zero documentation — the retrieval scripts and the rule scripts are each referenced somewhere. Doc gaps are in inventory completeness, not total absence.

## Recommended Next Focus

[F6] contradictions between the docs themselves — the queue includes the embedder-pluggability scope-note vs "consumers index prose" contradiction and the memory-handback cli-* family mis-enumeration.
