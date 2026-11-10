# Iteration 001

## Focus
Compare Ponytail's global smallest-change doctrine and activation model with the current two-axis sk-code hub.

## Actions Taken
- Read the lineage config, state projection, and strategy before research.
- Compared Ponytail's main skill and intensity command with sk-code's hub contract, registry policy, shared standards, and phase transition.
- Checked the archived refinement to distinguish an existing adoption from a repeated recommendation.

## Findings
1. **ALREADY-ADOPTED** — Ponytail's six-rung smallest-complete-change ladder is already in the shared sk-code standards, and implementation enters it after surface and intent routing. Do not add another hub-level ladder. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:25-33] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-53] [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:97] [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:45-54]
2. **ALREADY-ADOPTED (retained rejection)** — Preserve sk-code's single advisor identity with separate workflow and surface axes; reject Ponytail's session-global intensity switch because it would flatten routing, and the earlier refinement already rejected that state machine. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15-17] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail.md:2-5] [SOURCE: .skilled/skills/sk-code/SKILL.md:15-17] [SOURCE: .skilled/skills/sk-code/SKILL.md:52-71] [SOURCE: .skilled/skills/sk-code/hub-router.json:4-18] [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:74-84]

## Questions Answered
- Which Ponytail 5.1.0 mechanisms complement sk-code's current two-axis hub routing and shared prompt contracts without duplicating them?

## Questions Remaining
- Which Ponytail design restraint, quality, and review checks are genuinely missing from sk-code's nested code-quality and code-review modes?
- Which Ponytail hook, state, and cross-runtime portability mechanisms can improve sk-code surfaces without violating its read-first, scope, and verification floors?
- What do Ponytail's benchmark and correctness gates measure, and where could sk-code's benchmark and advisor tooling gain decision-useful evidence?
- Which older Ponytail recommendations are already adopted, lost, or still new in current sk-code, and which source-inspired additions should be rejected?

## Sources Consulted
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail.md
- .skilled/skills/sk-code/SKILL.md
- .skilled/skills/sk-code/hub-router.json
- .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md
- .skilled/skills/sk-code/shared/references/phase-detection.md
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md

## Assessment
Two findings, both reconfirming prior adoption or a prior rejection. newInfoRatio = 0.00 (0 fully new, 0 partially new, 2 redundant).

## Reflection
The exact integration point is already present: the ladder consumes surface and intent rather than competing with the hub router. Keeping the router's two axes intact avoids duplicated decisions and preserves the current advisor boundary.

## Recommended Next Focus
Inspect Ponytail's quality and review skills against sk-code-quality and sk-code-review, with special attention to prior checklist rows and current severity floors.

## SCOPE VIOLATIONS
- YAML spec writeback to the parent spec.md and resource-map output would leave the authorized lineage, so both were deferred under the write boundary; no external file was created or changed.

## Runtime Contract Note
- The iteration record input and delta each carry findingsCount = 2, but the gateway-owned state projection drops that field. The current legacy projection lists the iteration, ratio, status and ruled-out reference without the count.
- This is an implementation contract mismatch: the projection builder says lossy fields such as findingsCount are omitted rather than fabricated, and the iteration-completed event schema has no findingsCount field. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:78-83] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:230-236]
- Resolution: keep the exact count in the lineage record input and delta, preserve the gateway-owned state projection, and report this persistence limit in synthesis. Do not write the projection directly.
