# Review Iteration 014

## Dimension

Security: activation boundary and fail-open behavior under unknown or ambiguous evidence.

## Files Reviewed

- `.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.json:1-80`
- `.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.schema.json:76-140`
- `.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/implementation-summary.md:62-80,133-150`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:229-240`
- `.opencode/plugins/mk-skill-advisor.js:640-653`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:153-168`

## Findings by Severity

### P1

- **F001 carried forward.** The matrix is fail-open and all flags are off, which contains current runtime impact, but future evidence ingestion can still treat the identity-derived observation as a passing delivery signal.
- **F002 carried forward.** The dedup flag is off by default, but its activation evidence must include the separator collision class before it can be considered safe.

### P2

- **F003 carried forward.** The matrix’s correct `all-candidate-flags-off` state is not reflected in the parent phase row.
- **F004 carried forward.** The Gate-3 candidate is shadow-only today, but its schema/key boundary still needs a negative control before activation.

## Traceability Checks

- `spec_code`: partial — fail-open activation is correct, while evidence eligibility has the identified gaps.
- `checklist_evidence`: partial — unknown/ambiguous matrix controls pass, but not these specific malformed inputs.
- `playbook_capability`: not applicable — no playbook capability is declared.

## Next Dimension

Traceability: checklist closure, source status, and synthesis inputs.

Review verdict: CONDITIONAL
