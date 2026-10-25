# Iteration 9: Repository-Local Quality Configuration

## Focus

Angle 9 examines where repository-owned target-path maps, checklists, and artifact-label patterns could live without a sk-code hub fork, and the maintenance and implementation cost of each option. The strategy already marks the broader surface-packet and repo-local configuration question answered; this pass makes the storage choices concrete.

## Actions Taken

1. Read the run config, state log, strategy, registry, and iteration narratives 1 through 8 before researching this angle.
2. Inspected the quality mode's target-path map, hub router and mode registry, private-surface precedent, and the comment checker's artifact-label patterns.
3. Searched the local repository for a quality-specific configuration file pattern. Used repository sources only; no network, implementation, or tests.

## Findings

1. **OBSERVED — sk-code-quality declares its target-path checklist map inside SKILL.md and says that map remains authoritative; the comment checker stores artifact-label violations in a literal VIOLATION_PATTERNS list.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:112] `### Target-Path Checklist Map` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:171] `The target-path checklist map remains authoritative` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:160] `VIOLATION_PATTERNS = [`
2. **DERIVED — The shared hub is a poor place for repository-specific quality settings: its router selects workflow modes and bundles surface packets as read-only evidence, while its registry defines workflow and surface axes. Editing those files for one repository would couple local checklist policy to shared routing and create a hub fork to maintain.** [SOURCE: .skilled/skills/sk-code/hub-router.json:11] `one workflow mode primary plus zero-or-more surface packets as read-only evidence` [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] `packetKind:'surface' entries are read-only domain-evidence packets` [SOURCE: .skilled/skills/sk-code/mode-registry.json:5] `The WORKFLOW axis (sk-code-quality/sk-code-review) is process;`
3. **INFERRED — The lightest no-fork extension is an optional repository-root manifest such as .code-quality.json.** It could map repository-relative target patterns to repository-relative checklist files and add local artifact-label patterns while leaving the built-in map and patterns as defaults. This is a proposal, not a current feature. Its cost is a schema and loader, path and pattern validation, clear merge and failure rules, checks that the quality workflow and comment checker read the same file, plus per-repository maintenance. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:116] `../sk-code-skilled/assets/checklists/skill-authoring.md` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:171] `The target-path checklist map remains authoritative` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:160] `VIOLATION_PATTERNS = [`
4. **DERIVED — A repository-owned surface packet can hold reusable domain checklists, with the local manifest pointing to those files.** The hub can bundle a surface as read-only evidence, but sk-code-quality still treats its own target-path map as authoritative, so automatic selection needs an explicit adapter from target path to packet checklist. This costs more setup than one flat manifest, and fits policies reused across several projects better. [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] `bundled alongside a workflow mode via routerPolicy.outcomes.surfaceBundle` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:171] `The target-path checklist map remains authoritative`
5. **DERIVED — For private or operator-only rules, the private-surface precedent stores standalone local-* skills behind gitignored symlinks to local-skills/ repositories and routes them only through the operator's local advisor.** Such a skill can own private checklist content, but it needs external-repository and symlink setup and does not by itself make sk-code-quality select that checklist by target path. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:69] `gitignored symlinks to` [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:69] `Only the operator's local skill advisor routes them` [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:121] `Two gitignored symlinks` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:171] `The target-path checklist map remains authoritative`

## Questions Answered

The repo-local configuration subquestion is answered at the design level: prefer an optional root manifest for one repository's target patterns, checklist references, and additive artifact-label patterns; point it to a repository-owned surface packet when the checklist should be reused. Use the private local-skill layout only when the rules must stay private and the local routing setup is acceptable. No option is supported by the current quality-mode contract yet.

The strategy's broader configuration question was already checked off before this iteration, so this iteration newly closes no strategy key question. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41] `[x] How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub?` The canonical record therefore carries an empty answeredQuestions array.

## Questions Remaining

- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `[ ] Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?`

The root-manifest behavior, precedence, and validation remain proposed; this research did not implement or exercise a loader.

## Next Focus

Angle 10: establish the non-relaxable quality behaviors and the proof required for a later change through both routing stages, as listed by the remaining strategy question. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?`

## Assessment

- New information ratio: 0.60. This angle adds concrete no-fork storage choices and their costs to the earlier surface-packet answer.
- Status: insight.
- Strategy key questions newly answered: none.
