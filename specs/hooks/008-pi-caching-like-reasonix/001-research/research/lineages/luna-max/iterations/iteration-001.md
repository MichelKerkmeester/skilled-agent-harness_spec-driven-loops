# Iteration 1: Establish the lumo.md claim ledger

## Focus

Inventory the quantitative and architectural assertions in `lumo.md`, then classify each as project-documented, independently supported, or unresolved.

## Findings

- `lumo.md` makes two separate Reasonix claims: a reported approximately 99.8% prompt-cache hit rate and a reported cost change from roughly $61 to $12. The same local source also describes stable prefixes, repository/docs context, and intermediate reasoning as the cached material. [SOURCE: .opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:1-5]
- The Reasonix README documents a concrete one-day user report of 435M input tokens, 99.82% cache hit, and approximately $12 rather than $61. That verifies that the numbers are published by the project, not that the report is independently reproducible. [SOURCE: https://github.com/esengine/deepseek-reasonix]
- Reasonix's architecture documentation narrows the implementation claim: it is DeepSeek-specific, depends on exact byte-stable prefixes, and uses immutable prefix material plus an append-only log and volatile scratch. This conflicts with treating Reasonix as a provider-neutral cache abstraction. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md]
- The Pi package page for `pi-cache-optimizer` shows a real community package, but identifies `freescheme` as its author and does not identify it as a Pi first-party feature. Its README describes provider-side, best-effort cache optimization rather than a local KV-cache implementation. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]

## Ruled Out

- The claim that Reasonix's published metrics are already an independent benchmark is ruled out; the available evidence is a project README report without request traces, model configuration, or a reproducible baseline.

## Dead Ends

- Search-result snippets alone cannot establish cache semantics or first-party ownership; they were retained only as discovery pointers.

## Questions Remaining

- Are the reported hit rate and cost reduction arithmetically and operationally reproducible from provider telemetry?
- Which portions of Pi's current provider and extension surface already cover the proposed plugin?

## Sources Consulted

- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:1-19`
- `https://github.com/esengine/deepseek-reasonix`
- `https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md`
- `https://pi.dev/packages/pi-cache-optimizer`

## Assessment

- newInfoRatio: 0.94
- Novelty justification: First evidence pass; it separates local claims from project-published evidence and identifies the provider-specific scope boundary.
- Confidence: High for source classification; low for the truth of the self-reported production metrics.

## Reflection

- What worked and why: Reading the local claim source beside primary project documentation exposed which statements were quotations of project claims versus general conclusions.
- What did not work and why: No independent request log or billing export is published with the Reasonix report.
- What I would do differently: Obtain provider-side token counters before attempting to reproduce the cost number.

## Recommended Next Focus

Reasonix's cache invariants: exact-prefix construction, append-only history, and what those invariants imply for a Pi plugin.
