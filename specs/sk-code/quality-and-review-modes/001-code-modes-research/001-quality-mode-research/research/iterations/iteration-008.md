# Iteration 8: User-Authored Modes and Quality Integration

## Focus

Angle 8 asks how a user-authored workflow or surface mode should interact with sk-code-quality and which of the eleven integration rows carries its resources. The frozen angle list names this focus as “User-authored modes.” [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:178] `8 | User-authored modes`

## Actions Taken

1. Read the run config, state log, strategy and prior iteration records before selecting this angle.
2. Compared the workflow-versus-surface packet criteria with all eleven hub-integration rows and their gate coverage.
3. Traced the sk-code registry and router to the quality mode’s phase sequence and target-path checklist selection.
4. Cross-checked the hub-routing rule for routing-class exceptions and the required two-stage replay.

Only local repository sources were used. No implementation, test or network action was taken.

## Findings

1. **OBSERVED:** A user-authored packet is a workflow when it changes the assistant’s process, lifecycle or order of work. It is a surface when it contributes read-only domain evidence to an existing workflow. The sk-code registry follows this split: quality is a workflow and SKILLED/CI are surfaces. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:182] `new capability changes the process the assistant follows` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:195] `It is read-only reference material for a domain, stack, platform, or runtime.` [SOURCE: .skilled/skills/sk-code/mode-registry.json:5] `The WORKFLOW axis (sk-code-quality/sk-code-review) is process; the SURFACE axis (sk-code-ci/sk-code-skilled) is read-only domain evidence.`

2. **OBSERVED:** sk-code-quality already runs at Phase 1.5, after implementation and before debugging and verification. Its workflow loads a target-path checklist, applies P0/P1/P2 checks and hands broader behavior design back to the surface skill. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:75] `Phase 1.5 Code Quality Gate runs here` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:181] `load the target-path checklist` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:185] `hand back to the surface skill`

3. **DERIVED:** An evidence-only user mode should attach to sk-code-quality as a read-only surface while quality remains the acting workflow. The sk-code router defines surfaceBundle as one primary workflow plus read-only surface evidence. In the eleven-row integration matrix, row 4 carries the mode’s stage-two intent and resource map. Rows 1–3 register and route the mode, while rows 6–11 cover the applicable advisor, human, doctor, manifest, projection and command surfaces. No one row completes integration because every surface that applies to the mode’s routing class must carry it. [SOURCE: .skilled/skills/sk-code/hub-router.json:11] `one workflow mode primary plus zero-or-more surface packets as read-only evidence` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:217] `A mode is integrated when every surface that applies to its class carries it.` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:226] `The mode is selected but loads no leaves.`

4. **INFERRED:** The current quality contract does not establish automatic loading of an arbitrary user-mode-owned quality checklist. It maps .skilled/skills/ targets to the generic skill-authoring checklist, then selects by target path and calls that map authoritative. Therefore, registering or bundling a surface does not by itself prove that the quality gate consumes its custom checklist. A user-authored fixture routed through both stages would confirm the missing lookup behavior or show an existing path. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:116] `../sk-code-skilled/assets/checklists/skill-authoring.md` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:167] `get_routing_key() from target path` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:171] `The target-path checklist map remains authoritative.` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:255] `compiled-route.cjs --hub <hub> --prompt`

## Questions Answered

The Angle 8 sub-question is answered: a workflow mode owns process changes and should place the quality gate in its lifecycle; a surface mode contributes read-only evidence. Row 4 is the direct runtime resource link, while the other applicable rows establish discoverability and reachability. This extends the surface-packet answer already recorded in iteration 7; no unchecked strategy key question is newly answered. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/iterations/iteration-007.md:23] `How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality` [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41] `How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality`

## Questions Remaining

- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `Which behaviors may no recommendation relax`

## Next Focus

Angle 9: repo-local configuration, following the frozen order. The non-relaxable floors and two-stage proof question remain open for the later floors-and-proof angle. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:179] `9 | Repo-local configuration`

## Ruled Out

- No implementation or quality-checklist authoring was attempted because this is a research iteration.
- No network research was attempted because the strategy lists network fetching as a non-goal.

## Dead Ends

None identified.

## Edge Cases

- Ambiguous input: the dispatch names both workflow and surface modes; the existing packet contract distinguishes them by process versus evidence.
- Contradictory evidence: none found in the inspected sources.
- Missing dependencies: none.
- Partial success: automatic discovery of a user-mode-owned checklist remains inferred and needs a user-authored fixture replay.

## Assessment

- New information ratio: 0.60. This iteration adds the exact integration-row mapping and separates hub resource routing from quality’s target-path checklist selection, extending iteration 7’s broader surface-packet finding.
- Status: insight.
- Strategy key questions newly answered: none.

## Reflection

The workflow/surface distinction identifies who acts, and row 4 identifies how a surface’s resources enter the hub route. The quality gate still has its own target-path checklist contract, so the two routing surfaces need a fixture replay before custom checklist selection can be treated as supported.

## Sources Consulted

- [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:182] `new capability changes the process the assistant follows`
- [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:226] `The mode is selected but loads no leaves.`
- [SOURCE: .skilled/repo-rules/skill-hub-routing.md:54] `routing runs in two stages`
- [SOURCE: .skilled/skills/sk-code/hub-router.json:11] `one workflow mode primary plus zero-or-more surface packets as read-only evidence`
- [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:171] `The target-path checklist map remains authoritative.`
