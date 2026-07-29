# Iteration 1: Correctness

## Focus

D1 Correctness — verify frozen `rename-map.json` vs live four-hub `mode-registry.json` / packet directories, and hub SKILL routing tables for stale identity strings.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: assets/rename-map.json, sk-code/mode-registry.json, sk-design/mode-registry.json, sk-doc/mode-registry.json, sk-prompt/mode-registry.json, sk-prompt/hub-router.json, sk-prompt/SKILL.md
- New findings: P0=0 P1=1 P2=1
- New findings ratio: 0.55

## Findings

### P1, Required

- **F001**: `sk-prompt/SKILL.md` still publishes pre-rename public keys and packet paths (`prompt-improve` / `prompt-models`, directories `prompt-improve/` / `prompt-models/`) and hardcodes UNKNOWN_FALLBACK load of `prompt-improve/SKILL.md`, while live `mode-registry.json` / `hub-router.json` use `sk-prompt-improve` / `sk-prompt-models` and the old directories are absent on disk. Agents following the hub SKILL table or fallback path will miss the packet. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:22-23] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:43] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:77] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:89] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:106-107] [SOURCE: .opencode/skills/sk-prompt/hub-router.json:5] [SOURCE: .opencode/skills/sk-prompt/mode-registry.json:19]

Adversarial self-check (Hunter/Skeptic/Referee): Hunter argues P0 (broken fallback path). Skeptic notes primary loop uses `entry.packet` from registry (correct) and command/agent paths already point at `sk-prompt-improve`. Referee: **P1** — degraded hub guidance / broken documented fallback, not a registry identity defect.

### P2, Suggestion

- **F002**: Parent problem statement still narrates pre-rename examples (`interface`→`design-interface`, `quality`→`code-quality`) as the motivating defect [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/spec.md:35-37]. Accurate as historical framing; post-closeout readers may confuse it for current state.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | 21/21 map rows match live registries + dirs; hub SKILL prose for sk-prompt diverges (F001) |

## Assessment

Machine identities (registry + directories + deliberate shared-packet exception) are correct. Human-facing hub routing doc for sk-prompt was not fully realigned — highest correctness residual after phase 009.

Review verdict: CONDITIONAL
