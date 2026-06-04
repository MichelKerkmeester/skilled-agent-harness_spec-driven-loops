# Iteration 001 - Correctness: code-reference traceability

## State Read

- Read `deep-review-config.json`.
- Read `deep-review-state.jsonl`.
- Read `deep-review-strategy.md`.

## Review Actions

1. Read the target spec to confirm this slice audits catalog-to-code traceability and playbook coverage.
2. Read the code-reference catalog entry and scenarios 135/136.
3. Recomputed current annotation coverage across non-test TypeScript files under `mcp_server/` and `shared/`.
4. Ran the documented annotation-name validity comparison.
5. Spot-checked the scenario-135 example features.

## Findings

### DR-CAT-P1-001 - Feature catalog code-reference coverage is materially stale

Severity: P1  
Category: catalog-code-traceability  
Finding class: stale-measured-coverage  
Content hash: `728a57fbb9e3ec4b`

The catalog entry claims measured audit coverage at HEAD is approximately 69%, with `192` of `280` non-test TypeScript files under `mcp_server/` and `shared/` annotated. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md:26]

The current sweep found `990` non-test `.ts` files under those same roots and only `195` files with `// Feature catalog:` comments, or `19.70%`. A representative unannotated public API file is `mcp_server/api/search.ts`, which has a module header and public API comments but no feature-catalog annotation in its header block. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/api/search.ts:1]

Impact: an operator relying on item 214 will believe most audited TypeScript files are traceable when the current tree has hundreds of unannotated source files. That directly undermines the slice requirement to flag unbacked or unverified entries.

Concrete fix: refresh the measured denominator/numerator with a committed counting rule, classify exemptions, and update the catalog entry so it distinguishes "all non-test TypeScript files" from any intentionally audited subset.

### DR-CAT-P2-002 - Scenario 135 under-samples the documented code-reference scope

Severity: P2  
Category: playbook-capability  
Finding class: scope-under-sampling  
Content hash: `2973966acd9bee44`

The catalog claim explicitly covers `mcp_server/` and `shared/`. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md:26]

Scenario 135 tells the operator to run each feature grep only under `.opencode/skills/system-spec-kit/mcp_server/`. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/231-grep-traceability-for-feature-catalog-code-references.md:38]

This misses real annotated shared files such as `shared/embeddings.ts`. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings.ts:4]

Impact: the scenario can pass while failing to validate the `shared/` half of the catalog claim.

Concrete fix: either broaden the scenario command to include both roots or explicitly state that scenario 135 only validates a handler/lib sample and that scenario 136 owns full annotation-name coverage.

## Non-Finding Evidence

- Annotation-name validity currently passes for the sampled roots: 126 unique annotations, 238 H3 headings, 0 invalid annotations.
- The three scenario-135 example features returned multi-layer hits in the current tree.

## Iteration Delta

P0: 0  
P1: 1  
P2: 1  
New findings ratio: 0.42

Review verdict: CONDITIONAL
