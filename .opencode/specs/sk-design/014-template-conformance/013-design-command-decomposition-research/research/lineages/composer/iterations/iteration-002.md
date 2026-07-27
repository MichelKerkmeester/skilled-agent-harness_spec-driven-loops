# Iteration 2: Non-co-occurring Intents as Seam Candidates

## Focus
Test whether zero shared RESOURCE_MAP paths imply command seams.

## Findings
1. **118 intent pairs have zero shared resources** (e.g. REAL_WORLD_REFERENCE || VISUAL_SYSTEM). [SOURCE: programmatic pairwise scan of SKILL.md RESOURCE_MAP]
2. **Non-co-occurrence is conditional loading**, not separable jobs. Sequential phases of one direction job still union multiple intents. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:174-180]

## Ruled Out
- Any disjoint RESOURCE_MAP pair as a command seam without job-boundary evidence.

## Assessment
- newInfoRatio: 0.85
