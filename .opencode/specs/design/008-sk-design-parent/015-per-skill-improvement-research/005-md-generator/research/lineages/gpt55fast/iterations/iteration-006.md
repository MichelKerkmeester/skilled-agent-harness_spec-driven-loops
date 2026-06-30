# Iteration 6: Prioritization And Do-Not List

## Focus

Synthesize priorities and explicitly rule out attractive but harmful expansion paths.

## Findings

- The workflow reference already encodes the extract/write/validate phases and says each phase must complete before the next [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:39-71]. Any wrapper should make that easier, not hide or bypass it.
- Troubleshooting repeatedly says to escalate rather than fabricate when crawl, dark-mode, or validation failures occur [SOURCE: .opencode/skills/sk-design/design-md-generator/references/troubleshooting.md:41-63]. UX improvements must preserve that refusal posture.
- The quality checklist says v3 value-bearing sections are deterministic, prose must be named and honest, and `validate.ts` gates both values and claims [SOURCE: .opencode/skills/sk-design/design-md-generator/references/quality_checklist.md:23-30].
- The external Stitch corpus is a useful contrast because it author-generates DESIGN.md from a brief [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:17-25], but the md-generator boundary explicitly routes that out of scope [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md:86-99].
- Prior synthesis rejected bulk corpus import, second backend, forward authoring, and taxonomy changes [SOURCE: .opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:158-176].

## Final Priority Stack

1. Restore backend setup viability and package manifest consistency.
2. Expand routing aliases and benchmark fixtures for non-extract md-generator intents.
3. Add preflight/guided run wrapper while keeping phase boundaries.
4. Split playbook into smoke and release lanes and align schema probes.
5. Add one non-SaaS exemplar.

## Do-Not List

- Do not add forward authoring to md-generator.
- Do not add a second crawler/backend.
- Do not duplicate existing format, taxonomy, boundary, or quality references.
- Do not bulk-import the external corpus.
- Do not weaken `tokens.json` fidelity for UX convenience.
- Do not flatten md-generator behavior into the parent hub.

## What Was Tried And Failed

- Tried to find a higher-value reference/asset addition than operational UX. Existing docs already cover the core fidelity and boundary surfaces.
- Tried to make a legal stop earlier, but routing/setup/example sources were needed for coverage.

## Assessment

- newInfoRatio: 0.06
- Novelty: low. This iteration primarily synthesized already-gathered evidence.
- Stop decision: converged. All key questions answered and quality guards pass.
