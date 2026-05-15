# Checklist

## Scope

- [x] No tool-id, server-id, or skill-id rename.
- [x] No branch creation.
- [x] No force push or `--no-verify`.
- [x] No review-10iter artifact edits by this packet.
- [x] Plugin bridge retained only as a process-boundary gateway.

## Import Isolation

- [x] Required `system-skill-advisor` import grep returns zero.
- [x] Broader advisor source import grep returns zero source imports in spec-kit; plugin gateway imports remain.
- [x] Spec-kit hook files no longer import advisor source.
- [x] Spec-kit schemas no longer import advisor schemas.
- [x] Neutral seams decommissioned or localized.

## Migrations

- [x] Hooks moved: 4.
- [x] Requested skill-graph tests moved: 4.
- [x] Requested stress tests moved: 4.
- [x] Additional stranded advisor tests/stress moved as needed for full import isolation.

## Verification

- [x] Advisor typecheck passes.
- [x] Spec-kit typecheck passes.
- [x] Advisor build passes.
- [x] Spec-kit build passes.
- [x] Advisor moved unit tests pass.
- [x] Advisor stress smoke passes.
- [x] Spec-kit targeted tests pass.
- [x] Hook smoke passes.
- [x] MCP list reports 6/6 connected.
- [ ] Full advisor `npm test` passes.
- [ ] Full spec-kit `npm test` passes.
- [ ] Strict validate 019 passes.
- [ ] Strict validate parent passes.
- [ ] Commit pushed.
