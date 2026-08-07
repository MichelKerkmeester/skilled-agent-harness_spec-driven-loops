# Deep Research Strategy - gpt-gap Lineage

## Research Topic

Adversarial completeness audit of the `001-spec-memory-cli` workstream packet set before implementation. The audit subject is the packet documentation; repository source files are the evidence base.

## Known Context

- Parent gap-audit strategy requires five forced iterations, one lens per iteration.
- The canonical feasibility record already says the workstream is GO with zero unknowns in the research phase; this audit is looking for omissions before implementation starts.
- Deliberate non-gaps: MCP removal as a program non-goal, reference migration as a future 004+ packet, Gemini hooks if explicitly documented as excluded, and missing `checklist.md` in planned-state implementation phase packets.
- Resource map is not present for the gap-audit parent; resource-map emission is disabled for this lineage.

## Key Questions

- [x] LENS-1: Coverage cross-check. Does every tool, daemon service, and MCP affordance have exactly one owner across the three implementation phases?
- [x] LENS-2: Delta and requirement traceability. Does every research design delta map to a concrete phase requirement or task, and does every phase requirement trace back to evidence?
- [x] LENS-3: Runtime pairing completeness. Does phase 3 name every actual adapter/plugin/config surface that must change, including explicit Gemini exclusion?
- [x] LENS-4: Sequencing, estimates, dependencies, and shared infrastructure. Do the handoff chain and estimates hold, and are cross-workstream risks visible?
- [x] LENS-5: Adversarial residual sweep. Are there contradictions, unsupported settled claims, missing failure modes, or day-one implementer traps?

## Answered Questions

- LENS-1: Phase 1 owns the 37-tool CLI and MCP-affordance ports; phase 2 owns parity/hardening; phase 3 owns runtime adoption. One P2 ambiguity remains around Gemini scope.
- LENS-2: D1-D7 and DD-001 are owned by phase 1 or phase 2. OpenCode plugin traceability is valid. Gemini remains the only runtime item without clean traceability.
- LENS-3: Two P1 gaps found in phase 3: Codex live hook registration mismatch and undocumented/contradictory Gemini scope.
- LENS-4: Spec-memory sequencing and 10-13d arithmetic hold. Cross-workstream socket collision is not an active spec-memory blocker, but sibling shims should inherit per-service short socket defaults.
- LENS-5: No P0 implementation blocker found; final register is 2 P1 gaps plus P2 notes.

## What Worked

- Phase maps and child requirements are clear enough to prove phase 1/2 ownership.
- Live runtime config inspection exposed the phase-3 risks that document-only review would miss.
- Shared launcher evidence reduced several suspected failure modes to P2 watch items.

## What Failed

- Phase 3's broad runtime labels do not enumerate live-vs-template config files.
- Gemini appears in phase 3 while the program-level runtime pairing rule omits it.

## Exhausted Approaches

- Treating MCP removal, reference migration, planned-state checklist absence, or the missing OpenCode spec-memory plugin as gaps. Those are either explicit non-goals or already owned by phase 3.

## Ruled-Out Directions

- Reopening CLI-core feasibility.
- Counting sibling code-index/skill-advisor shim gaps as spec-memory blockers.

## Active Risks

- CLI executor is recorded as `cli-codex`, but this runtime cannot safely spawn Codex from Codex. The lineage therefore executes in-process and records the executor as metadata.
- Phase 3 planning can miss live Codex hook wiring unless `.codex/hooks.json` is explicitly named.
- Phase 3 planning can accidentally scope Gemini unless the exclusion is documented or promoted to a real requirement.

## Next Focus

Synthesis complete. Next safe action: fix phase-3 planning docs/tasks for Codex hook registration and Gemini exclusion/scope before runtime-integration implementation.

## Non-Goals

- Do not implement or patch the CLI.
- Do not mutate packet files outside this lineage artifact directory.
- Do not relitigate documented non-gaps.

## Stop Conditions

- Stop after five iterations.
- Stop earlier only if all five lens questions are answered with evidence, which is structurally impossible before iteration 5 under the one-lens-per-iteration charter.
