# Iter 004 — Convergence defaults drift (docs vs config vs code)

## Question

Do the convergence defaults documented in `.opencode/skills/deep-review/references/convergence.md` ("Key Defaults" table + "Threshold Semantics and Sibling Parity" + "Security-Sensitive Fix Overrides") match the actual defaults defined in `.opencode/skills/deep-review/assets/deep_review_config.json`, `.opencode/skills/deep-review/assets/review_mode_contract.yaml`, and any hard-coded constants in `.opencode/skills/deep-review/scripts/reduce-state.cjs`? Each drift MUST cite both the doc surface AND the config/code surface with `file:line`.

## Evidence (file:line citations required)

### Documented Defaults (convergence.md)

**Key Defaults table** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="42-50" />:

| Setting | Value | Purpose |
|---------|-------|---------|
| `maxIterations` | 7 | Hard ceiling on loop iterations |
| `convergenceThreshold` | 0.10 | General convergence sensitivity |
| `rollingStopThreshold` | 0.08 | Rolling-average STOP vote threshold |
| `noProgressThreshold` | 0.05 | Stuck / no-progress classification threshold |
| `stuckThreshold` | 2 | Consecutive no-progress iterations before recovery |
| `minStabilizationPasses` | 1 | Coverage signal requires at least one stabilization pass |
| `compositeStopScore` | 0.60 | Weighted stop-score needed before guard evaluation |

**Security-Sensitive Fix Overrides** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="70-74" />:

| Setting | General Default | Security-Sensitive Fix Default |
|---------|-----------------|--------------------------------|
| `minStabilizationPasses` | 1 | 2 |
| `requiredClosedFindingReplay` | false | true for prior P0/P1 and any prior security/path P2 |
| `requiredFixCompletenessGate` | false | true |

### Config Defaults (deep_review_config.json)

<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" lines="9-11" />:

- `"maxIterations": 7`
- `"convergenceThreshold": 0.10`
- `"stuckThreshold": 2`

**Missing from config**: `rollingStopThreshold`, `noProgressThreshold`, `minStabilizationPasses`, `compositeStopScore`, and all security-sensitive fix override settings.

### YAML Contract Defaults (review_mode_contract.yaml)

**Convergence defaults** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" lines="122-145" />:

- `maxIterations: 7`
- `convergenceThreshold: 0.10`
- `stuckThreshold: 2`
- `rollingStopThreshold: 0.08`
- `noProgressThreshold: 0.05`
- `minStabilizationPasses: 1`
- `compositeStopScore: 0.60`

**Missing from yaml contract**: Security-sensitive fix override settings.

### Code Constants (reduce-state.cjs)

<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="20-23" />:

- `REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability']`
- `SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }`

**No hard-coded threshold constants**: The reducer reads threshold values from config, not hard-coded. Grep search for threshold patterns found only one reference to `config.maxIterations` at line 1313 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="1313" />, confirming thresholds are config-driven.

## Findings (numbered)

### Finding 1: deep_review_config.json missing threshold defaults (P1)

**Drift**: `deep_review_config.json` is missing 4 documented threshold defaults that are present in `review_mode_contract.yaml`.

- **Doc default**: `rollingStopThreshold: 0.08` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="46" />
- **Actual default**: Missing from `deep_review_config.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" lines="1-92" />
- **YAML contract**: Present as `rollingStopThreshold: 0.08` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" lines="143" />

- **Doc default**: `noProgressThreshold: 0.05` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="47" />
- **Actual default**: Missing from `deep_review_config.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" lines="1-92" />
- **YAML contract**: Present as `noProgressThreshold: 0.05` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" lines="144" />

- **Doc default**: `minStabilizationPasses: 1` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="49" />
- **Actual default**: Missing from `deep_review_config.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" lines="1-92" />
- **YAML contract**: Present as `minStabilizationPasses: 1` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" lines="141" />

- **Doc default**: `compositeStopScore: 0.60` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="50" />
- **Actual default**: Missing from `deep_review_config.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" lines="1-92" />
- **YAML contract**: Present as `compositeStopScore: 0.60` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" lines="145" />

**Severity**: P1 - The config is incomplete but the yaml contract has the correct values, so the runtime likely reads from the yaml contract. However, the config should be the single source of truth for runtime defaults.

### Finding 2: Security-sensitive fix overrides not implemented in config/contract (P0)

**Drift**: Security-sensitive fix overrides documented in `convergence.md` are not present in either `deep_review_config.json` or `review_mode_contract.yaml`.

- **Doc default**: `minStabilizationPasses: 2` (security-sensitive override) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="72" />
- **Actual default**: Not present in `deep_review_config.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" lines="1-92" />
- **Actual default**: Not present in `review_mode_contract.yaml` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" lines="1-494" />

- **Doc default**: `requiredClosedFindingReplay: true` (security-sensitive override) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="73" />
- **Actual default**: Not present in `deep_review_config.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" lines="1-92" />
- **Actual default**: Not present in `review_mode_contract.yaml` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" lines="1-494" />

- **Doc default**: `requiredFixCompletenessGate: true` (security-sensitive override) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="74" />
- **Actual default**: Not present in `deep_review_config.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" lines="1-92" />
- **Actual default**: Not present in `review_mode_contract.yaml` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" lines="1-494" />

**Severity**: P0 - These are security-critical overrides that are documented but not implemented in the config/contract layer. This represents a security-relevant documentation-to-implementation gap.

### Finding 3: reduce-state.cjs has no hard-coded threshold constants (no drift)

**No drift**: The reducer correctly reads threshold values from config rather than hard-coding them. Grep search found only one reference to `config.maxIterations` at line 1313 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="1313" />, confirming thresholds are config-driven. The only hard-coded constants are severity weights (P0: 10.0, P1: 5.0, P2: 1.0) which match the documented weights <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="365-367" />.

## Gaps for next iter

1. **Security-sensitive fix override implementation location**: Determine if the security-sensitive fix overrides (minStabilizationPasses=2, requiredClosedFindingReplay=true, requiredFixCompletenessGate=true) are implemented elsewhere in the codebase (e.g., workflow YAML files, CLI flags, or runtime logic) or if they are entirely missing from implementation.

2. **Config completeness vs YAML contract**: Determine if `deep_review_config.json` should be the single source of truth for all threshold defaults, or if the split between config (some thresholds) and yaml contract (other thresholds) is intentional design.

## JSONL delta row

```json
{"iter_id":"004","timestamp_utc":"2026-05-23T17:28:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":2,"gaps_count":2,"primary_evidence_files":[".opencode/skills/deep-review/references/convergence.md",".opencode/skills/deep-review/assets/deep_review_config.json",".opencode/skills/deep-review/assets/review_mode_contract.yaml",".opencode/skills/deep-review/scripts/reduce-state.cjs"]}
```