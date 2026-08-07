# Iteration 003: Node-Path Strict Validators

## Focus

Default `validate.sh --strict` path after the registry bridge and dist-freshness changes.

## Findings

### GPT-F003 (P1) Default Node validation path still skips strict-only evidence and continuity lint rules

- Evidence: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1014`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1033`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1194`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:268`, `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:312`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:957`.
- Impact: Strict validation can miss `CONTINUITY_FRESHNESS` and `EVIDENCE_MARKER_LINT` unless the shell path is forced.
- Recommendation: Run these checks from the Node orchestrator or continue into shell strict validators after the Node report.

Review verdict: CONDITIONAL
