# Iteration 5: Correctness follow-up — hub SKILL residual inventory

## Focus

Broaden correctness beyond registry parity: inventory remaining pre-rename path strings inside live hub/packet SKILL docs (sk-prompt family), distinct from F001 hub table.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: sk-prompt/SKILL.md, sk-prompt/sk-prompt-models/SKILL.md, sk-prompt/shared/references/smart-routing.md
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 0.12

## Findings

### P2, Suggestion

- **F010**: Inside `sk-prompt-models/SKILL.md`, canonical-source prose still cites hub-relative `prompt-models/assets/model-profiles.json` while the packet directory is `sk-prompt-models/` (local `./assets/` links are correct). Agents copying the prose path from the hub root will miss the file. [SOURCE: .opencode/skills/sk-prompt/sk-prompt-models/SKILL.md:212] [SOURCE: .opencode/skills/sk-prompt/sk-prompt-models/SKILL.md:229] [SOURCE: .opencode/skills/sk-prompt/sk-prompt-models/SKILL.md:267]

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | shared/smart-routing.md already uses sk-prompt-* resource paths; hub SKILL still stale (F001) |

## Assessment

F001 remains the primary correctness residual; F010 is a nested packet prose echo of the same incomplete rename.

Review verdict: PASS
