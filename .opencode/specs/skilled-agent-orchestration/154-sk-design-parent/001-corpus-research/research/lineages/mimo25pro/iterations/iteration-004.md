# Iteration 4: Onboarding & Backward Compatibility

## Focus
Per-child onboarding implications, especially the rename of sk-design-interface and the relationship with sk-design-md-generator.

## Actions Taken
1. Read full sk-design-interface SKILL.md (214 lines) for complete reference inventory
2. Read sk-design-md-generator SKILL.md boundary definitions
3. Analyzed refactoring scope for each existing skill

## Findings

### Existing Skill #1: sk-design-interface → sk-design-visual

**Current state**: 214-line SKILL.md with:
- 4-step design process (Ground → Brainstorm → Critique → Build)
- Smart routing (design intent detection)
- 8 references (design_principles.md, ux_quality_reference.md, variation_diversity.md, real_ui_loop.md, design_inventory.md, design_references_mcp.md, mobbin_tools.md, refero_tools.md)
- Feature catalog and manual testing playbook
- Integration points with sk-code, sk-code-review, mcp-chrome-devtools, mcp-figma

**Refactoring scope**:
1. **Rename**: `sk-design-interface` → `sk-design-visual` (directory + SKILL.md name field + all internal references)
2. **Expand**: Fold in corpus content from taste-skill.md:
   - Three-dial system (DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY)
   - Brief inference protocol (Section 0 of taste-skill.md)
   - Design system mapping (Section 2 of taste-skill.md)
   - Anti-default discipline (Section 4 of taste-skill.md)
   - AI tells catalog (Section 9 of taste-skill.md)
3. **Extract**: Move color-specific content to sk-design-color references
4. **Extract**: Move layout-specific content to sk-design-layout references
5. **Extract**: Move motion-specific content to sk-design-motion references
6. **Preserve**: All existing references stay (they're already well-organized)
7. **Update**: Integration points section to reference sibling sub-skills

**Backward compatibility risk**: MEDIUM
- The skill name changes (sk-design-interface → sk-design-visual)
- Any AGENTS.md, SKILL.md, or command that references `sk-design-interface` by name needs updating
- The advisor skill-graph needs rebuilding
- Mitigation: Keep `sk-design-interface` as a compatibility alias that redirects to `sk-design-visual`

**Onboarding effort**: ~2-3 days
- Day 1: Rename directory, update SKILL.md frontmatter, update all internal references
- Day 2: Fold in taste-skill.md content, extract domain-specific content to siblings
- Day 3: Update integration points, rebuild advisor, test routing

### Existing Skill #2: sk-design-md-generator

**Current state**: 429-line SKILL.md with:
- Three-phase pipeline (extract → write → validate)
- Playwright crawler for CSS extraction
- DESIGN.md v3 Style Reference format
- tokens.json output
- Visual validation reports

**Relationship to family**: This skill is the **extraction and format-fidelity engine**. It captures what already exists. It does NOT invent design direction.

**Refactoring scope**: MINIMAL
1. **No rename needed** — `sk-design-md-generator` fits the naming convention
2. **Update**: Add `sk-design` family relationship in SKILL.md
3. **Update**: Reference `sk-design-color` as the consumer of extracted tokens
4. **Preserve**: All existing functionality stays intact

**Backward compatibility risk**: LOW
- No name change
- No functional change
- Just adds family context

**Onboarding effort**: ~0.5 days
- Update SKILL.md description to mention sk-design family
- Add cross-reference to sk-design-color

### New Sub-Skills: Onboarding Implications

#### sk-design-color (NEW)
**Onboarding effort**: ~1-2 days
- Create directory structure (.opencode/skills/sk-design-color/)
- Write SKILL.md (pull from colorize.md + oklch-skill.md)
- Create references/ with color strategy, OKLCH reference, palette templates
- Integrate with sk-design-md-generator token extraction
- Advisor integration

#### sk-design-motion (NEW)
**Onboarding effort**: ~2-3 days
- Create directory structure
- Write SKILL.md (pull from animate.md + 12-principles-of-animation.md)
- Create references/ with motion principles, GSAP patterns, CSS animation reference
- Pull GSAP skeletons from taste-skill.md Section 5
- Advisor integration

#### sk-design-layout (NEW)
**Onboarding effort**: ~1-2 days
- Create directory structure
- Write SKILL.md (pull from layout.md)
- Integrate apple-bento-grid-main as a reference system
- Pull layout discipline from taste-skill.md Section 4.7
- Advisor integration

#### sk-design-a11y (NEW)
**Onboarding effort**: ~1-2 days
- Create directory structure
- Write SKILL.md (pull from fixing-accessibility.md + audit.md + harden.md)
- Create references/ with WCAG rules, audit checklists, hardening patterns
- Advisor integration

#### sk-design-interaction (NEW)
**Onboarding effort**: ~2-3 days
- Create directory structure
- Write SKILL.md (pull from interaction-design.md + delight.md)
- Create references/ with state machine patterns, gesture patterns, cognitive laws
- Integrate designer-skills-main interaction-design content
- Advisor integration

### Parent: sk-design (NEW)
**Onboarding effort**: ~1 day
- Create directory structure
- Write SKILL.md (thin router + shared principles)
- Create references/ with design-principles/ (from sk-design-interface) and conventions/
- Advisor integration

### Total Onboarding Effort

| Sub-skill | Effort | Type |
|---|---|---|
| sk-design (parent) | 1 day | NEW |
| sk-design-visual | 2-3 days | RENAME + EXPAND |
| sk-design-color | 1-2 days | NEW |
| sk-design-motion | 2-3 days | NEW |
| sk-design-layout | 1-2 days | NEW |
| sk-design-a11y | 1-2 days | NEW |
| sk-design-interaction | 2-3 days | NEW |
| sk-design-md-generator | 0.5 days | UPDATE ONLY |
| **Total** | **10-16 days** | |

### Backward Compatibility Strategy

1. **Compatibility aliases**: Keep `sk-design-interface` as a thin redirect to `sk-design-visual` for 28 days (migration window)
2. **Advisor rebuild**: Run `mk_skill_advisor_skill_graph_scan` after all changes
3. **Reference updates**: Update any spec folders, commands, or agents that reference `sk-design-interface` by name
4. **Deprecation notices**: Add deprecation notice to old skill directory

## Questions Answered
- How does sk-design-interface fold in? → Rename to sk-design-visual, expand with corpus, extract domain content
- How does sk-design-md-generator fold in? → Minimal update, stays as-is
- What's the total onboarding effort? → 10-16 days
- What's the backward compat strategy? → Compatibility aliases + advisor rebuild + reference updates

## Questions Remaining
- Should the compatibility alias be a full SKILL.md or just a redirect?
- How to handle the designer-skills-main cognitive laws?
- What's the parent router's exact logic?

## Next Focus
Analyze the designer-skills-main 9-plugin model in more detail to identify which of its 97 skills should be absorbed into the 6 sub-skills vs. dropped.
