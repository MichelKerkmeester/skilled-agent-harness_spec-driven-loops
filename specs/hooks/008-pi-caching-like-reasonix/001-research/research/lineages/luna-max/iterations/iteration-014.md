# Iteration 14: Audit checkpoint and rewind support

## Focus

Verify whether checkpoint/rewind is absent from Pi core, available through packages, and relevant to cache-prefix continuity.

## Findings

- Pi core documents session trees, forks, clones, and branch summarization, but those features navigate conversation history and do not by themselves restore the working tree or pin provider cache state. [SOURCE: https://pi.dev/docs/latest/sessions; https://pi.dev/docs/latest/compaction]
- `pi-rewind` is a verifiable community extension that creates git-based snapshots, supports `/rewind`, and integrates with fork/tree flows. Its package metadata identifies it as an extension with a non-core author, so it fills an ecosystem gap rather than proving native Pi support. [SOURCE: https://pi.dev/packages/pi-rewind]
- Pi's compaction page exposes `session_before_compact` and `session_before_tree`, which a cache-oriented plugin could observe to mark a prefix generation boundary. Restoring files or conversation state remains a separate responsibility and should not be hidden inside a cache optimizer. [SOURCE: https://pi.dev/docs/latest/compaction]
- The lumo checkpoint/rewind proposal is therefore a separate workflow feature. It may affect cache continuity after a rewind, but implementing snapshots is outside the smallest Reasonix-style caching scope. [SOURCE: .opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:23-32; INFERENCE: https://pi.dev/docs/latest/compaction]

## Ruled Out

- Treating Pi's native `/tree` and session branching as filesystem checkpoint/rewind is ruled out.
- Adding git snapshot/restore logic to the first cache-plugin scope is ruled out.

## Dead Ends

- Measuring cache performance through rewind features alone is a dead end; rewind changes history and files but supplies no provider cache usage evidence.

## Questions Remaining

- What cache diagnostics should be retained across compaction or rewind boundaries?
- What performance and invalidation risks remain for an opt-in prefix policy?

## Sources Consulted

- `https://pi.dev/docs/latest/sessions`
- `https://pi.dev/docs/latest/compaction`
- `https://pi.dev/packages/pi-rewind`
- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:23-32`

## Assessment

- newInfoRatio: 0.43
- Novelty justification: Checkpoint/rewind is classified as a separate community workflow with a cache-lifecycle integration point, not a missing cache primitive.
- Confidence: High for the documented package/core boundary; medium for cache effects after restores.

## Reflection

- What worked and why: Session and compaction docs establish the native lifecycle events; the package page establishes the community implementation.
- What did not work and why: No source measures provider cache reuse after a restored session.
- What I would do differently: Treat restore as a benchmark scenario, not as part of plugin architecture.

## Recommended Next Focus

Audit cache observability and compaction invalidation: what Pi and providers report, and what a plugin can safely persist.

