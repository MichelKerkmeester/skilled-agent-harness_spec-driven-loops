# Iteration 1: sk-code setup precedent

## Focus

Read the sk-code adaptation guidance, `/doctor:sk-code` router, setup workflow, checker, and the related 026 and 029 packet records before examining sk-git.

## Actions Taken

- Read `.skilled/commands/doctor/sk-code.md`, the sk-code setup YAML, its presentation contract, and `sk-code-setup-check.cjs`.
- Read the sk-code README adaptation and verification sections.
- Read the 026 external-user-guide spec and the 029 doctor-setup spec and implementation summary.
- Read the deep-research initialization YAML to identify the bounded spec-anchoring branch.

## Findings

1. `/doctor:sk-code` is a thin router with one default target, `setup`; its command doc routes presentation and workflow assets while the YAML owns execution behavior. [SOURCE: .skilled/commands/doctor/sk-code.md:8-16,29-50]
2. The setup workflow is explicitly read-only: it forbids all write targets and requires repair commands to be reported for the operator to run. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:12-28,46-52]
3. The eight-leg battery checks provisioning, parent structure, metadata, route guard and sync, drift, derived freshness, and a parsed route decision; it reports PASS/FAIL/SKIP and repair text without applying repairs. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:48-52; .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:97-149,252-310]
4. The adaptation guide and diagnostic have separate jobs: the README block tells users how to add or remove surfaces and what to keep, while `/doctor:sk-code setup` checks the resulting tree and names repairs. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:71-79; .skilled/skills/sk-code/README.md:116-122; specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:36-50]

## Questions Answered

- What does the sk-code adaptation guide and `/doctor:sk-code setup` check, and how do those responsibilities divide?

## Questions Remaining

- Which sk-git policy inputs are repository-customizable, where are they set, and what behavior depends on them?
- How do worktree naming/provisioning, Commit-Id allocation, hook trust, global hooks, and preflight advice interact?
- What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report?
- Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected?

## Dead Ends

- Rejected a doctor action that applies repairs: the precedent's diagnostic boundary explicitly requires reporting a repair command and leaves it to the operator. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28]

## SCOPE VIOLATIONS

- scope_violation: the generic init branch would edit the existing packet `spec.md` and append research context outside this lineage; that branch was skipped under the supplied write boundary. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:477-508]

## Sources Consulted

- `.skilled/commands/doctor/sk-code.md:8-61`
- `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:12-60`
- `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt:1-58`
- `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:7-20,97-149,252-311`
- `.skilled/skills/sk-code/README.md:116-122`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:71-79`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:36-50`
- `.skilled/commands/deep/assets/deep-research-auto.yaml:477-508`
- `specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/steer.md` (checked before iteration; absent)

## Assessment

- newInfoRatio: 1.0
- Novelty: all four findings establish the precedent and setup-versus-guide boundary for this lineage.
- Confidence: high; the command, YAML, checker, and implementation packet agree.

## Reflection

The implementation packets explain why a read-only battery accompanies a human adaptation guide. The useful pattern is a check-only battery with leg-specific repair instructions. No source ambiguity blocked this iteration.

## Recommended Next Focus

Map repository-specific sk-git policy in `SKILL.md`, `hard-rules.json`, commit-message templates and rules, and the remote branch allowlist.
