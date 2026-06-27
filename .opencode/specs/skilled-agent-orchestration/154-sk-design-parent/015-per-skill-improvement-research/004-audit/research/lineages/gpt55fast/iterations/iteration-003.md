# Iteration 003 - Router Replay and Parseable Defects

## Focus

Test whether the parseable `INTENT_SIGNALS` and `RESOURCE_MAP` block routes representative audit prompts to the right resources.

## Replay Results

| Prompt class | Intents | Resources | Observation |
| --- | --- | --- | --- |
| Full audit score | `AUDIT_CONTRACT` | `corpus_map`, `audit_contract`, `audit_report_template` | correct core route |
| AI-generated surface | `ANTI_PATTERNS_PRODUCTION` | `corpus_map`, `anti_patterns_production`, `ai_fingerprint_tells` | correct focused route |
| A11y/performance | `ACCESSIBILITY_PERFORMANCE` | `corpus_map`, `accessibility_performance`, `a11y_quick_fixes` | correct focused route |
| Bolder after audit | `AUDIT_CONTRACT`, `TRANSFORM_REMEDIATION` | `corpus_map`, `audit_contract`, `audit_report_template`, `transform_remediation` | correct multi-intent route |
| Screenshot-only evidence | `EVIDENCE_CAPTURE` | `corpus_map`, `evidence_capture` | correct focused route |

## Defects Found

1. The pseudocode loop reads `for keyword, weight in cfg["keywords"]:` even though `keywords` is a list of strings. If executed literally, it is not valid for variable-length keyword strings and ignores the configured `weight`. It should iterate `for keyword in cfg["keywords"]:` and add `cfg["weight"]`.
2. Loading levels say `../shared/register.md` is ALWAYS needed, but the parseable `RESOURCE_MAP` and router replay outputs never include the shared register. This matters because full audit scoring and transform remediation depend on the Brand-vs-Product register.
3. `_guard_in_skill()` enforces paths under `SKILL_ROOT`, so a naive addition of `../shared/register.md` to `RESOURCE_MAP` would be rejected unless the router gets a deliberate parent-shared exception or a local route to a shared-card proxy.

## Delta

- New information ratio: 0.58.
- Q3 answered; Q5 partly answered.

## Next

Review a11y/performance handoff and implementation-boundary artifacts.
