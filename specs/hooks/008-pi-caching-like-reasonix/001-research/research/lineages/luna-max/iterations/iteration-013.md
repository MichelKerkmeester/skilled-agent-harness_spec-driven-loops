# Iteration 13: Audit plan-mode availability

## Focus

Determine whether Pi's plan-mode gap is real, whether packages already fill it, and whether it should affect a cache-plugin design.

## Findings

- Pi's official usage page says plan mode is intentionally absent from core. This validates the narrow claim that Pi core does not provide a built-in plan-mode gate. [SOURCE: https://pi.dev/docs/latest/usage]
- Pi's package catalog contains independently installable plan-mode extensions, including `@pandi-coding-agent/plan` and `@narumitw/pi-plan-mode`. These packages demonstrate ecosystem coverage but do not turn plan mode into a first-party core capability. [SOURCE: https://pi.dev/packages/%40pandi-coding-agent/plan; https://pi.dev/packages/%40narumitw/pi-plan-mode]
- The package documentation emphasizes that third-party packages execute code and should be reviewed. A cache plugin should not bundle a plan-mode implementation merely to match another agent's workflow; it should use Pi's documented extension hooks and leave planning orthogonal. [SOURCE: https://pi.dev/packages/%40pandi-coding-agent/plan]
- The lumo plan-mode gap is accurate only when scoped to Pi core, and it is irrelevant to a provider-cache plugin unless the plugin also claims to enforce read-only research or implementation gates. [SOURCE: .opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:23-32; INFERENCE: https://pi.dev/docs/latest/usage]

## Ruled Out

- Describing plan mode as unavailable in the Pi ecosystem is ruled out; it is available through packages even though it is not core.
- Making plan mode a dependency of the caching plugin is ruled out.

## Dead Ends

- Using plan-mode package features as evidence of prompt-cache behavior is a category error; the package controls tool permissions and workflow, not provider caching.

## Questions Remaining

- Does Pi core have checkpoint/rewind support, or only session branching and package extensions?
- Which feature-gap claims should be marked “core gap, ecosystem covered” in the synthesis?

## Sources Consulted

- `https://pi.dev/docs/latest/usage`
- `https://pi.dev/packages/%40pandi-coding-agent/plan`
- `https://pi.dev/packages/%40narumitw/pi-plan-mode`
- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:23-32`

## Assessment

- newInfoRatio: 0.46
- Novelty justification: The plan-mode claim is split into a true core gap and a filled ecosystem capability, removing it from the cache-plugin scope.
- Confidence: High for core status and package existence; medium for package maintenance and safety beyond their catalog metadata.

## Reflection

- What worked and why: Official usage plus package catalog pages provide the needed core-versus-package distinction.
- What did not work and why: No cache-specific behavior is exposed by plan-mode packages.
- What I would do differently: Keep workflow gaps in a separate package decision rather than bundling them into cache infrastructure.

## Recommended Next Focus

Audit checkpoint and rewind support, including native session branching and community extensions, then assess whether it affects cache-prefix continuity.

