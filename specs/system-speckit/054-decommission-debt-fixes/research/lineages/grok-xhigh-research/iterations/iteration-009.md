# Iteration 9: Gates that can pass while lying

## Focus
Angle 7. Freshness stamps, generated metadata, routing, and `validate.sh` after the decommission.

## Findings

### F-I9-001 — CONTINUITY_FRESHNESS is off by default and treats skip as pass. CONFIRMED. P1
The CLI entry returns `status: pass` / `not_opted_in` unless `SPECKIT_COMPLETION_FRESHNESS` is set. [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:88-93] [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:542-544]
When opted in, a completion claim with no `session_dedup.fingerprint`, or only the zero placeholder, also returns pass (`missing_fingerprint`, `zero_fingerprint`). [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:305-319]
A stale fingerprint is a warning unless `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` is set. [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:338-340]
`validate.sh --strict` does not promote warnings to errors. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:928-933]
After decommission, packets can claim complete with no continuity fingerprint and still get RESULT: PASSED.
Smallest fix: missing/zero fingerprint should be warn (or fail under the existing enforce flag), not pass.

### F-I9-002 — validate.sh continues on a freshness-check infrastructure failure. CONFIRMED. P1
If the compiled orchestrator exists and the freshness helper returns 69, validate.sh exits 3. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:281-285]
If the helper returns any other non-zero, it prints a WARNING and uses the compiled JS anyway. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:286-288]
If `dist-freshness.cjs` is missing, there is no check at all. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:277]
A broken or absent freshness helper plus a stale `dist/` is the same class as F-I2-003 / F-I6-001: leftover compiled cognitive modules keep tests and validation green.
Smallest fix: treat helper failure as exit 3, same as stale.

### F-I9-003 — `--strict` no longer means "warnings fail". CONFIRMED. P2
The orchestrator now says strict selects which rules run, and a warning is advice. `passed` is `errors === 0`. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:928-933]
This is documented in CLAUDE.md. It is still a lying-gate risk for anyone who still reads `--strict` as the old meaning, especially combined with F-I9-001 warn-on-stale.
Smallest fix: none in code if the contract is intentional. Call it out in 054 so debt fixes do not "prove" completion with warnings.

### F-I9-004 — Generated-metadata integrity can be grandfathered into report mode. CONFIRMED. P2
`SPECKIT_GENERATED_METADATA_GRANDFATHER` defaults off; when set, the integrity rule is report-mode. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/config/capability-flags.ts:62-86]
`derived.status: complete` is checked against `completion_pct` and open tasks, but only when `implementation-summary.md` exists. Lean phase parents skip that check. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts:230-264]
A 054 packet that still has open T009-T012 should fail this if status is complete. INFERRED until 054 `graph-metadata.json` is read.
Smallest fix: do not set the grandfather env in CI. Confirm 054 derived.status.

### F-I9-005 — The routing-registry CI path still names skill-advisor `mcp-server`, which is the preserved daemon. CONFIRMED. P2 (negative)
`.github/workflows/routing-registry-drift.yml` watches and runs inside `.opencode/skills/system-skill-advisor/mcp-server`. That is D5, not spec-kit runtime identity residue.
The spec-kit CI comments in F-I4-003 are the ones that still say "mcp-server package" for the validator.
Smallest fix: none on the advisor workflow.

## Sources Consulted
- .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:88-93,305-340,542-544
- .opencode/skills/system-spec-kit/scripts/spec/validate.sh:277-288
- .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:928-933
- .opencode/skills/system-spec-kit/runtime/lib/config/capability-flags.ts:62-86
- .opencode/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts:230-264
- .github/workflows/routing-registry-drift.yml (advisor mcp-server; negative)

## Assessment
- newInfoRatio: 0.70
- Novelty justification: skip-as-pass freshness, validate.sh helper-failure continue, grandfather flag. Strict-warning contract is known but now tied to decommission completion claims.
- Confidence: high on 001-003.

## Reflection
- Worked: read the freshness CLI entry and the validate.sh freshness branch, not the CLAUDE.md summary.
- Failed: routing-guard grep across all of system-spec-kit (broken mcp-server/node_modules path).
- Ruled out: advisor routing-registry CI as rename residue.

## Dead Ends
- system-spec-kit-wide routing-guard grep (tool error on leftover mcp-server/node_modules).

## Recommended Next Focus
The leftover `.opencode/skills/system-spec-kit/mcp-server` path that broke workspace greps, then runtime mirrors under `.claude` `.codex` `.cursor` `.devin` `.pi`.
