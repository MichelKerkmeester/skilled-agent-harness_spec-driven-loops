# Deep Research Strategy: sk-design motion improvement

## Topic

Investigate how to improve the `sk-design` motion packet, concretely present as `.opencode/skills/sk-design/design-motion`, for efficiency, usefulness, UX, tooling, references, assets, and routing.

## Known Context

- The user named `.opencode/skills/sk-design/motion`; the live hub registry maps `workflowMode: motion` to packet `design-motion` [SOURCE: .opencode/skills/sk-design/mode-registry.json:40-49].
- The hub is the single advisor-routable design identity and routes by `workflowMode` through `mode-registry.json` [SOURCE: .opencode/skills/sk-design/SKILL.md:39-56].
- The motion packet owns temporal interaction design, `motion/react`, `AnimatePresence`, micro-interactions, performance-sensitive choices, and reduced motion [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:13-16].
- Prior 009 research recommended the motion restraint gate and three assets, and phase 012 implemented those exact files [SOURCE: .opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:84-97] [SOURCE: .opencode/specs/design/008-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:64-69].
- `resource-map.md` was not present at the spec root at init; coverage was built from direct file reads and the lineage-local `resource-map.md` emitted by synthesis.
- The local 014 benchmark artifact available in this workspace is for `design-interface`, not `design-motion`; it reports aggregate 70/100 and D5 100/100 [SOURCE: .opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:1-6] [SOURCE: .opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:16-21]. The user-supplied "motion equals 100 of 100" claim is treated as an unverified input because no motion benchmark artifact was present locally.

## Key Questions

1. Which motion improvements remain after the 009 recommendations were implemented?
2. Are there resource-loading, router, or benchmark gaps that reduce efficiency?
3. Does the manual testing playbook validate the right routing and output behavior?
4. Which external corpus ideas still add usefulness without bloating the packet?
5. What should be explicitly avoided because it duplicates completed work or violates the skill boundary?

## What Worked

- Starting from current packet inventory avoided re-proposing completed 009 work.
- Comparing SKILL router prose to pseudocode exposed a concrete efficiency issue.
- Reading manual testing playbook frontmatter exposed expected-resource drift.
- External corpus reads provided specific, bounded advanced-craft candidates.

## What Failed

- Looking for a local motion routing-benchmark artifact under 014 found only a `design-interface` report.
- Treating the user path `.opencode/skills/sk-design/motion` literally did not match the current nested packet layout.

## Exhausted Approaches

- Re-proposing the motion restraint gate and three cards.
- Bulk importing motion corpus content.
- Treating motion-performance release scoring as a motion-mode responsibility.
- Broad trigger keyword expansion without evidence of a motion routing failure.

## Next Focus

Complete. Findings are synthesized in `research.md`.

## Active Risks

- The benchmark statement "motion equals 100 of 100" could refer to an artifact not present in this workspace. The recommendations therefore avoid depending on it as confirmed evidence.
- The deep-research skill normally saves continuity outside the artifact packet. This lineage did not run phase_save because the user explicitly restricted writes to the lineage directory.

## Non-Goals

- No implementation changes to `.opencode/skills/sk-design/design-motion`.
- No edits outside the supplied lineage artifact directory.
- No new skill or mode taxonomy.
- No live CLI fan-out or self-dispatch.

## Stop Conditions

- Stop when all five key questions have evidence-backed answers.
- Stop when newInfoRatio drops below 0.05 and source diversity is sufficient.
- Stop at 10 iterations if convergence has not happened earlier.

## Convergence

Stopped after iteration 6 with `newInfoRatio = 0.04`, all key questions answered, and quality guards passing.
