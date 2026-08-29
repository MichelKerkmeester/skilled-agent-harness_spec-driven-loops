# Iteration 2: D2 Security — privacy ordering, egress, telemetry, secrets

## Focus
Dimension: security. Independent audit of SKILL.md ALWAYS/NEVER/ESCALATE rules against `packages/cli-communication-projection/src/privacy/router.ts` and `src/providers/{executor,presets}.ts`. Verify: (1) privacy classification + egress consent run before any ranking; (2) no silent local-to-hosted egress; (3) unknown/stale facts fail closed; (4) credentials are references, never values; (5) telemetry is content-free; (6) no secret material in skill docs.

## Scorecard
- Dimensions covered: security
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.09

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F003**: OpenCode Go retention deadline is dual-sourced between skill prose and package code. `.opencode/skills/sk-communication/SKILL.md:152`, the ALWAYS rule states "Revalidate OpenCode Go retention and training facts before 2026-08-31 and again at every release". `packages/cli-communication-projection/src/providers/presets.ts:48` hardcodes `const expiresAt = '2026-08-31T23:59:59.000Z'` for the same fact. The deadline is duplicated across the skill doc and the package, so a future update to one source can leave the other stale. The skill's own ESCALATE rule ("A capability, retention, residency, or protocol-major fact is unknown or stale — fail closed") is correctly enforced by `router.ts:165,206-215` (`hasFreshTerms`, `PRIVACY_FACT_UNKNOWN`, `PRIVACY_FACT_STALE`), but the skill doc's static date is itself a stale-fact risk if the package updates the preset. Dimension: security. Recommendation: replace the hardcoded date in SKILL.md:152 with a pointer to the package's presets/assessor as the source of truth ("Revalidate OpenCode Go retention and training facts before the package preset's `expiresAt` and again at every release").

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | SKILL.md:148-152 vs router.ts:26-125, presets.ts:44-84 | Privacy-before-ranking, egress consent, fail-closed, credential-references claims all hold; F003 dual-source date |

## Assessment
- New findings ratio: 0.09
- Dimensions addressed: security
- Novelty justification: Security dimension is largely clean. Verified four load-bearing invariants against code:
  1. **Privacy-before-ranking holds**: `selectPrivacyRoute` (router.ts:26-125) runs `evaluateRecord` per candidate to populate `eligible[]` (router.ts:39-57), and only after the eligible set is built does it call `ranker(eligible)` (router.ts:64). Classification and consent precede ranking. SKILL.md:148 claim TRUE.
  2. **No silent local-to-hosted egress**: router.ts:157 denies hosted providers when `!input.policy.egressConsent` with `EGRESS_NOT_CONSENTED`. SKILL.md:157 NEVER claim TRUE.
  3. **Unknown/stale facts fail closed**: router.ts:206 denies `PRIVACY_FACT_UNKNOWN` for undefined/unknown facts; router.ts:210-215 denies `PRIVACY_FACT_STALE` for expired facts; router.ts:165 denies `TERMS_STALE` for stale terms. SKILL.md:152,164 ESCALATE claims TRUE.
  4. **Credentials are references, never values**: presets.ts:27 types `credentialReference` as `env: | keychain: | managed:`; presets.ts:61 passes the reference through; presets.ts:161 uses `'none:local'` for local. No credential values stored. SKILL.md:151 and package-map.md:52 claims TRUE.
  5. **Telemetry content-free**: feature-catalog/evaluation-and-observability/content-free-observability.md:28,42 describes allowlisted aggregate fields, synthetic secret/personal-data canaries, and redaction. SKILL.md:151 claim TRUE (not re-verified against observability source this iteration; deferred to maintainability breadth).
  6. **No secret material in skill docs**: `rg` over the skill tree for `api_key|password|secret|Bearer <token>|token=` found only narrative "credential references" / "secret canaries" prose, no real secret values.

## Ruled Out
- Secret material in skill docs: `rg` over skill tree for api_key/password/Bearer/token values found only skill-id and narrative "credential references" / "secret canaries" language (evidence: skill-wide grep).
- Privacy-before-ranking violation: router.ts:39-64 evaluates privacy before ranking; claim holds.
- Missing egress-consent gate: router.ts:157 enforces it; claim holds.

## Dead Ends
- None this iteration.

## Recommended Next Focus
D3 Traceability — spec_code cross-reference (REQ-001/002/003 vs skill files), checklist_evidence (tasks.md checked rows), feature_catalog_code (catalog vs package paths), playbook_capability (playbook scenarios vs executable reality).

Review verdict: PASS
