# Iteration 4 Research Prompt

## Focus

Compare the current local-tokenize -> provider rewrite -> local-restore architecture with structured/templated rendering, semantic diffing, and a hybrid slot-based design using the package's event, assembly, render, runtime, and client contracts.

## Questions

1. What structured data and ownership boundaries already exist for a deterministic renderer?
2. Which use cases can be rendered safely from event kinds, lifecycle, payload references, and local metadata, and where is arbitrary prose still unavoidable?
3. How should a hybrid preserve exact values, hashes, original visibility, presentation tiers, and fail-closed behavior?

## Required evidence

- Cite exact source lines for event/assembly structure, canonical byte references, rendering modes, client ownership, runtime capability fail-closed behavior, and semantic/Markdown checks.
- State confirmed architecture facts separately from proposed structured, template, semantic-diff, and hybrid designs.
- Identify the strongest tradeoff: readability and model burden versus implementation scope, privacy surface, and exact fallback safety.

## Boundaries

Do not modify package or skill sources. Preserve the canonical event stream, exact-original bytes, privacy-before-ranking, and full-projection/safe-native separation.
