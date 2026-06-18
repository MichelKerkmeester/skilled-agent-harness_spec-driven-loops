# Deep Research Strategy — skill-advisor Gap Audit

## Topic

Adversarial completeness audit of the 003-skill-advisor-cli workstream packet set before implementation. Forced 5 iterations, one lens per iteration.

## Done-Definition

Every lens produces findings-or-clean with file:line evidence; final gap register classifies P0/P1/P2; verdict COMPLETE or enumerated gaps.

## Key Questions

- [ ] LENS-1: Coverage cross-check (parity matrix vs phase ownership)
- [ ] LENS-2: Delta/REQ traceability both directions
- [ ] LENS-3: Runtime pairing completeness vs actual adapter/plugin inventory
- [ ] LENS-4: Sequencing/estimates + cross-workstream shared-infra risks
- [ ] LENS-5: Adversarial residual sweep (contradictions, hedges, failure modes)

## Known Context

- All three workstream research records are GO; this audit hunts what the per-system runs could not see.
- Deliberate non-gaps: MCP removal, migration (004+), Gemini hooks (verify documented), checklist.md in planned packets.

## Next Focus

Iteration 1: LENS-1.

## Parameters

- Max iterations: 5 (forced; convergence 0)
- Executor: cli-codex gpt-5.5, xhigh, fast, 1500s/iteration
