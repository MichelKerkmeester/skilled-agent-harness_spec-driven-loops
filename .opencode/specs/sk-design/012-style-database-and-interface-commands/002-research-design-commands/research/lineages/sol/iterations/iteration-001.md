# Iteration 1: Router Versus Creation Baseline

## Focus
Establish whether the problem is missing mode routing, missing workflow choreography, or missing user-facing creation scaffolding.

## Actions Taken
1. Read all five current command wrappers.
2. Searched their owned presentation and auto/confirm YAML assets for brief, grounding, build, output, and handoff behavior.
3. Compared the command surface with the phase specification's claimed creation gap.

## Findings
1. The wrappers are intentionally routing-centric: each names one user job, pins one `sk-design` mode, supplies sibling discriminators and preconditions, resolves `:auto|:confirm`, and delegates execution to assets. They do not themselves turn an underspecified design ask into a structured creative brief or show the user the creation sequence. [SOURCE: .opencode/commands/design/interface.md:9-17] [SOURCE: .opencode/commands/design/audit.md:9-17] [SOURCE: .opencode/commands/design/foundations.md:9-17] [SOURCE: .opencode/commands/design/motion.md:9-17] [SOURCE: .opencode/commands/design/md-generator.md:9-17]
2. The deeper assets are not empty routers. Interface already selects procedure cards, resolves register/dials, and runs a ground -> token-system -> anti-default critique -> build -> self-critique sequence; foundations and md-generator similarly carry real mode workflows. The defect is therefore discoverability and prompt-entry usefulness, not total absence of internal choreography. [SOURCE: .opencode/commands/design/assets/design-interface-auto.yaml:51-101] [SOURCE: .opencode/commands/design/assets/design-foundations-auto.yaml:40-79] [SOURCE: .opencode/commands/design/assets/design-md-generator-auto.yaml:39-73]
3. Presentation assets ask only the minimum routing inputs and describe a returned artifact. They do not gather a robust brief, request or discover exemplars, expose ambiguity/default handling, or preview the scaffolded creation stages. [SOURCE: .opencode/commands/design/assets/design-interface-presentation.txt:13-31] [SOURCE: .opencode/commands/design/assets/design-interface-presentation.txt:83-91]
4. A rewrite should preserve thin command ownership boundaries but make the command prompt a creation-template entrypoint: normalize a brief, ground references, select a mode-owned procedure, execute, critique/verify, and hand off. The command should orchestrate inputs and outputs; `sk-design` remains the source of taste and domain rules. [INFERENCE: based on findings 1-3]

## Questions Answered
- The failure is not broken routing; it is a hidden-capability and weak-intake problem at the user-facing command boundary.

## Questions Remaining
- Which external template structures best solve intake and exemplar grounding?
- Should all five modes remain standalone commands under `/interface`?

## Ruled Out
- Rebuilding by deleting the owned YAML workflows: this would discard existing mode choreography rather than expose and strengthen it.

## Dead Ends
- Treating every current command as containing no generative logic at all; that is inaccurate once owned assets are included.

## Assessment
- New information ratio: 1.0
- Novelty justification: First evidence pass; all four findings establish the packet's baseline model.

## Reflection
- What worked: reading wrappers and assets together prevented a false thin-router diagnosis.
- What failed: wrapper-only analysis understated existing choreography.
- Next adjustment: inspect the exact brief and presentation gaps across all five asset pairs.

## Recommended Next Focus
Audit the five presentation contracts and auto/confirm setup schemas to derive a shared creation-brief contract and identify command-specific missing fields.
