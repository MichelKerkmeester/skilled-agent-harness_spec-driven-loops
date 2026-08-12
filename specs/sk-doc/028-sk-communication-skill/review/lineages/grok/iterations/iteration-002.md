# Iteration 2: D2 Security — privacy ordering, secrets, telemetry

## Focus
Dimension: security. Audit skill-owned surfaces for secret leakage; verify privacy-before-ranking and content-free telemetry claims against package privacy/provider implementation and playbook scenarios.

## Scorecard
- Dimensions covered: security
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.09

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F003**: OpenCode Go retention deadline is dual-sourced, `.opencode/skills/sk-communication/SKILL.md:152`, SKILL hardcodes "before 2026-08-31" while the machine source of truth is `packages/cli-communication-projection/src/providers/presets.ts:48` (`expiresAt = '2026-08-31T23:59:59.000Z'`). Freshness enforcement itself is correct via `assessOpenCodeGoHostedPrivacyFreshness` and privacy router stale-fact denial, but the skill prose date can drift from presets without a cross-check, raising hosted-routing policy staleness risk. Dimension: security. Recommendation: cite the preset/assessor as authoritative and treat the SKILL date as a derived reminder, or generate the reminder from the same constant.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | SKILL.md:148-151 vs router.ts:25-69 | Privacy-before-ranking claim holds |
| checklist_evidence | pending | hard | — | Deferred to D3 |

## Assessment
- New findings ratio: 0.09
- Dimensions addressed: security
- Novelty justification: Confirmed no credential/secret values in skill markdown/json; playbook forbids capturing credentials (`manual-testing-playbook.md:61`); executor uses `credentialReference` only; privacy tests name early-denial and filtered-ranker behaviors. F003 is a policy-source drift advisory, not an active leak.

## Ruled Out
- Secret material in skill docs: `rg` over skill tree for api_key/password/Bearer/token values found only skill-id and narrative "credential references" language (evidence: skill-wide grep).
- Missing privacy-before-ranking tests claimed by playbook: both named tests exist in `test/providers/privacy.test.ts:25` and `:46`.

## Dead Ends
- None.

## Recommended Next Focus
D3 Traceability — REQ-001/002/003 vs shipped skill artifacts; tasks.md evidence rows; feature-catalog and playbook overlays.

Review verdict: PASS
