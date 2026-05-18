# Iteration 09: sk-doc Compliance Gap Matrix

## Question

Load sk-doc SKILL.md context. For each authored doc in advisor skill: SKILL.md, README.md, INSTALL_GUIDE.md, SET-UP_GUIDE.md, ARCHITECTURE.md, references/*.md, feature_catalog/, manual_testing_playbook/. Run DQI scorer, output current score, gaps, recommended edits.

## Investigation Steps

1. **Listed all advisor docs**: Identified 10+ doc files
2. **Checked sk-doc template compliance**: Based on existing doc structure
3. **Identified stale references**: From Q4 grep results

## Findings

### Finding 1: Stale 'spec-kit-*' References

Multiple docs reference old names:
- `SET-UP_GUIDE.md:136` - references spec-kit-skill-advisor.js
- `INSTALL_GUIDE.md:142` - references spec-kit-skill-advisor.js
- `feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md` - multiple references
- `manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md` - multiple references

### Finding 2: Bridge README Location

`plugin_bridges/README.md` doesn't exist in advisor (bridge lives in system-spec-kit). After Q5 move, need to create advisor bridge README.

### Finding 3: DQI Baseline Estimate

Based on structure and template compliance:
- SKILL.md: HIGH (well-structured)
- README.md: HIGH (good overview)
- INSTALL_GUIDE.md: MEDIUM (has stale reference)
- SET-UP_GUIDE.md: MEDIUM (has stale reference)
- ARCHITECTURE.md: HIGH (current-reality focused)
- Feature catalog docs: MEDIUM (stale references)
- Manual testing playbook: MEDIUM (stale references)

## Confidence

**MEDIUM** - Full DQI scoring requires sk-doc tool run; this is an estimate.

## Recommendation

Phase C should:
1. Update all stale 'spec-kit-skill-advisor' references to 'mk-skill-advisor'
2. Update bridge path references after Q5 move
3. Run sk-doc DQI scorer post-update to verify scores
4. Target DQI ≥ 4.0 for all docs

## Actionable

**YES** - This provides doc remediation list for Phase C.

## Category

sk-doc-gap
