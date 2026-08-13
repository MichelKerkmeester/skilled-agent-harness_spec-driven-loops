# Iteration 8: Verify pi-cache-optimizer ownership and scope

## Focus

Check whether the named Pi cache optimizer is official, what it actually does, and how much of the proposed plugin already exists.

## Findings

- `pi-cache-optimizer` is a verifiable package whose catalog metadata identifies author `freescheme`; the version/publication fields are volatile across catalog snapshots. The package page does not present it as a Pi core feature or as an official `pi.dev` component. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]
- The package README describes a stable prompt front, optional OpenAI-compatible `prompt_cache_key`, provider-side/best-effort operation, proxy warnings, and footer statistics. Those features overlap materially with the lumo proposal's diagnostics and prefix-stability ideas. [SOURCE: https://github.com/jiangge/pi-cache-optimizer]
- The package's documented behavior still depends on provider support and routing. It cannot force a provider cache hit or provide raw KV persistence, so it is a reference implementation of an extension-layer optimization, not evidence that Pi has a first-party cache engine. [INFERENCE: https://github.com/jiangge/pi-cache-optimizer; https://api-docs.deepseek.com/guides/kv_cache]
- The `lumo.md` label “official pi-cache-optimizer” is not supported by the package metadata reviewed here. The defensible wording is “community Pi package with a verifiable implementation,” subject to source audit and version pinning. [SOURCE: .opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:8-19; https://pi.dev/packages/pi-cache-optimizer]

## Ruled Out

- The assertion that `pi-cache-optimizer` is an official Pi feature is ruled out by the package's listed author and package-level presentation.

## Dead Ends

- Rebuilding the same stable-prefix and footer-stat features without first auditing the existing package would duplicate an available implementation.

## Questions Remaining

- Which claimed Pi feature gaps are real after separating core, extension, and package capabilities?
- What security and maintenance risks would justify a separate plugin rather than adopting or contributing to this package?

## Sources Consulted

- `https://pi.dev/packages/pi-cache-optimizer`
- `https://github.com/jiangge/pi-cache-optimizer`
- `https://api-docs.deepseek.com/guides/kv_cache`
- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:8-19`

## Assessment

- newInfoRatio: 0.61
- Novelty justification: The named package is real and overlaps the proposal, but its ownership and guarantees differ from the local claim source.
- Confidence: High for package identity and documented scope; medium for operational quality until its source and tests are audited.

## Reflection

- What worked and why: Package metadata and repository README jointly answered the existence question and exposed the first-party boundary.
- What did not work and why: Package documentation alone cannot establish production reliability or long-term compatibility.
- What I would do differently: Pin a commit and run the package against representative Pi versions before treating it as a baseline.

## Recommended Next Focus

Map Pi's extension lifecycle and payload hooks to the minimum feasible plugin responsibilities, including what the hooks cannot observe.
