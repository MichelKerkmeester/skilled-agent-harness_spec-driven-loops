# Review Iteration 018

## Dimension

Security: final fail-open and hostile-input replay.

## Files Reviewed

- `.opencode/plugins/lib/opencode-message-identity.js:37-45,149-207`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:153-168`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:229-240`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:176-209`
- `.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.schema.json:76-140`
- `.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.json:1-80`

## Findings by Severity

### P1

- **F001 carried forward.** Fail-open activation is not a substitute for correct evidence classification; a false positive can move an unknown lane into the “passing delivery” input.
- **F002 carried forward.** Separator-bearing identity input remains capable of merging delivery state if the dedup flag is enabled.

### P2

- **F003 carried forward.** Parent metadata drift is not a runtime security issue, but it weakens operator visibility of the completed safety gate.
- **F004 carried forward.** Gate-3 has an analogous hostile component input with lower current blast radius because its suppressing branch is not activated.

## Traceability Checks

- `spec_code`: partial — current flags remain off and matrix fail-open behavior passes, but pre-activation safety evidence is incomplete.
- `checklist_evidence`: partial — ambiguous status controls exist, while malformed composite input controls do not.
- `skill_agent`: not applicable to this spec-folder target.

## Next Dimension

Traceability: final synthesis ledger, coverage, and open search debt.

Review verdict: CONDITIONAL
