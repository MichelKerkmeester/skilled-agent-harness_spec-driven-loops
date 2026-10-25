# Iteration 6: Quality and Review Boundary

## Focus

Angle 6 of 10 compares the author-side quality checklist and the review-mode checklist, then traces their relationship through the shared CODE_QUALITY resource map and the hub tie-break order. The strategy’s open question combines this boundary with the handoff to verification, debugging, and review. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:40] `How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit?`

## Actions Taken

1. Read the run identity, frozen angle order, strategy questions, and prior iteration narratives 1–5.
2. Read the quality-mode checklist and workflow contract, the review-mode boundary and its code-quality checklist, the shared ROUTER resource map, and hub-router policy.
3. Kept the inspected sources read-only. No network access, checker, or test was used.

## Findings

1. **OBSERVED — The modes own different lifecycle outputs.** The quality mode runs after implementation and before verification, owns the author-side quality gate, and may fix scoped gate failures. The review mode is explicitly findings-first and review-only; the quality mode directs formal review reports to it. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:15] `runs after the surface skill (sk-code-skilled) implements changes and before the surface's verification workflow or done-claim` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:43] `owns the quality gate, not implementation planning, debugging, verification evidence, or formal review reporting` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:33] `Review-only pass: findings-first output with no code edits` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:43] `Author-side quality gates before review; use sk-code-quality`

2. **DERIVED — The checklists overlap by design, with a baseline-and-overlay relationship.** The quality checklist validates implementation style and explicitly says to use the review mode as the formal-review baseline while carrying the checklist as a web overlay. The review checklist covers non-security defects with production impact and prioritizes silent-failure and data-corruption risks over style. So the checklists should not be treated as mutually exclusive: the author gate owns scoped corrections, while review owns findings and can use surface-specific quality guidance as overlay evidence. [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:20] `Validate code against style standards before claiming implementation is complete` [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:40] `use this checklist as the web overlay` [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:25] `systematic pass for non-security defects` [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:33] `silent-failure and data-corruption risks above stylistic concerns`

3. **DERIVED — Mode priority and resource loading are separate routing controls.** The hub selects the workflow mode; the second-stage ROUTER maps intent to resources. Its CODE_QUALITY set includes shared and language checklists as well as the review checklist. Separately, the hub configuration lists sk-code-quality before sk-code-review in tieBreak and defines ordered bundles for clearly separate intents. The shared resource set therefore does not erase the modes’ lifecycle boundary; the configured ordering gives quality precedence when the router needs a tie-break, while distinct intents can remain an ordered bundle. [SOURCE: .skilled/skills/sk-code/SKILL.md:54] `hub then picks the mode. Stage two lives in root ROUTER.md` [SOURCE: .skilled/skills/sk-code/ROUTER.md:280] `"CODE_QUALITY": [` [SOURCE: .skilled/skills/sk-code/ROUTER.md:281] `shared/references/universal/code-quality-standards.md` [SOURCE: .skilled/skills/sk-code/ROUTER.md:292] `sk-code-review/assets/code-quality-checklist.md` [SOURCE: .skilled/skills/sk-code/hub-router.json:7] `"tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-ci", "sk-code-skilled"]` [SOURCE: .skilled/skills/sk-code/hub-router.json:10] `"orderedBundle": "clearly separate code intents route to an ordered workflow-mode list"`

## Questions Answered

How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit?

**DERIVED:** Together with iteration 5’s handoff analysis, the answer is: quality performs post-implementation author checks and scoped corrections; debugging handles unclear failing symptoms; verification collects final non-mutating evidence; review handles findings-first review output. The generic review checklist is its baseline, and surface-specific quality guidance can overlay it. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/iterations/iteration-005.md:28] `The verify/debug handoff portion is supported; the quality-versus-review checklist boundary remains open for Angle 6.` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:186] `hand to the surface's debugging workflow` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:187] `hand to the surface's verification workflow` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:199] `If the requested output is a review report, use sk-code-review`

## Questions Remaining

- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41] `How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality`
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `Which behaviors may no recommendation relax`

## Next Focus

Angle 7 of 10: surface packets. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:164] `7 | Surface packets`

## Assessment

- New information ratio: 0.60, a qualitative estimate based on the newly inspected checklist boundary and routing relationship.
- The handoff-plus-checklist strategy question is answered; no checker or test was run.
