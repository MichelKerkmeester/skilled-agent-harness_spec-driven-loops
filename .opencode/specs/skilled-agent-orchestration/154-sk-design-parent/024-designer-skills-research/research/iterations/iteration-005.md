# Iteration 5: Interaction-Design Inventory Confirmation

## Focus

Confirm the `interaction-design` root/plugin README skill-count mismatch using the filesystem as source of truth, then decide whether the hidden skill changes the current `sk-design` adoption backlog.

## Actions Taken

- Compared the root corpus README, which lists `interaction-design` as 16 skills, against the plugin README, which declares 15 skills. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:73] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/README.md:3]
- Ran a filesystem inventory over `interaction-design/skills/*/SKILL.md`; the command returned 16 skill files, including the README-omitted `interfaces-that-feel/SKILL.md`. [SOURCE: command `rg --files .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills | sort`]
- Re-read `interfaces-that-feel` and the prior interaction pass to avoid re-opening already-covered material. Iteration 2 already classified the hidden skill as real, in-scope taste craft around felt state, copy, timing, and motion. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research/research/iterations/iteration-002.md:17] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research/research/iterations/iteration-002.md:77]
- Checked the relevant `sk-design` targets: interface copy already bans weak status/error copy, the UX quality floor already covers loading/forms feedback, and motion already owns purpose, timing, and reduced-motion constraints. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:57] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:51] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:35]

## Findings

### 1. The count mismatch is confirmed and closed

The root README's 16-skill claim is correct. The plugin README's 15-skill count is stale or incomplete, because it omits `interfaces-that-feel`; the filesystem inventory contains 16 `SKILL.md` files, and `interfaces-that-feel/SKILL.md` is a real skill file with its own frontmatter. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:73] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/README.md:3] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:1]

Coverage impact: `interaction-design` can now be treated as skill-inventory covered. Iteration 2 already deep-read all 16 filesystem skills and did not rely solely on the plugin README list. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research/research/iterations/iteration-002.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research/research/iterations/iteration-002.md:9]

### 2. `interfaces-that-feel` strengthens the existing interface backlog; it does not justify a new mode

The skill's strongest adoptable technique is state-first translation: name the user's felt state, map it to behavioral properties, then express it through easing, delay, copy tone, color, spacing, or duration. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:17] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:23]

Correct home: `design-interface/references/design-process/copy_and_mock_data.md`, near the status/error copy rules. The surgical build edit remains the iteration 2 backlog item: add a compact "Copy by interaction state" table for loading, empty, user error, system error, success, and onboarding. This fills a positive guidance gap because current copy guidance bans "Oops!", exclamation-heavy status copy, and unstable action names, but it does not yet give a positive state-voice matrix. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:57] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:60] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:33]

### 3. Motion material is supporting evidence, not a separate adoption lane

`interfaces-that-feel` contains useful timing and easing language, but current `design-motion` already owns motion budget, feedback/transition/delight layers, timing ranges, and the rule that unsupported motion should be removed. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:44] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:37] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:46]

Ruled out: creating a new "emotional design", "interaction feel", or "delight" mode. That would duplicate interface and motion responsibilities and pull `sk-design` toward a looser taste theory workflow. Keep the build-phase edit observable: state voice, state acknowledgement, and recovery/success/loading copy.

### 4. The hidden skill reinforces the existing scope guard

The skill's reference-aesthetic examples and emotional vocabulary are useful inspiration, but should not be imported as a broad lifecycle or brand-strategy capability. The in-scope portion is build-facing craft: copy tone by state, emotional timing, and checking whether the state is acknowledged. The out-of-scope portion is turning this into research, brand strategy, or a general emotional-design methodology. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:52] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:61]

## Questions Answered

- Resolved the carried-forward mismatch: the filesystem has 16 `interaction-design` skills; the plugin README lists 15 and omits `interfaces-that-feel`.
- Q1 partial: `interfaces-that-feel` is genuinely adoptable as build/visual craft, but only in its state-voice and interaction-feel primitives.
- Q2 partial: the correct home is `design-interface/references/design-process/copy_and_mock_data.md`; motion references remain supporting context.
- Q3 partial: rule out a new emotional-design mode, reference-aesthetic import, or lifecycle strategy expansion.
- Q4 partial: keep the existing backlog item from iteration 2, now with the mismatch closed as confirmed coverage evidence.

## Questions Remaining

- Which individual `visual-critique` skills contain concrete rubric language stronger than audit's current critique/hardening references?
- Which `design-systems` skills are practical system-craft versus lifecycle governance, and where do they map without bloating foundations?
- Does the expanded interface flow-floor section remain compact enough after the eventual build edit, or does it need a split then?
- Does the remaining corpus outside `interaction-design` and the read `ui-design` slice contain any high-leverage, build-facing checks not already captured in the backlog?

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/README.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research/research/iterations/iteration-002.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md`
- `.opencode/skills/sk-design/design-motion/references/motion_strategy.md`
- Command: `rg --files .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills | sort`

## Assessment

`newInfoRatio`: 0.32.

Novelty is moderate-low because iteration 2 had already identified and classified `interfaces-that-feel`; this pass contributes the missing filesystem confirmation needed to close the carried-forward coverage gap and avoid a false "plugin covered" claim based on the stale plugin README.

## Next Focus

Deep-read `visual-critique` for audit-rubric language stronger than the current `design-audit/references/critique_hardening.md` and `anti_patterns_production.md`, while ruling out broad critique-session or stakeholder-process material.
