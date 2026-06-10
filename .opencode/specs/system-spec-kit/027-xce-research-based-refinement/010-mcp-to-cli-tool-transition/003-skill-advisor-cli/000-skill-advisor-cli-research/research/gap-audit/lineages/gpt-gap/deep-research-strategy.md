# Deep Research Strategy - gpt-gap Lineage

## Research Topic

Adversarial completeness audit of the `003-skill-advisor-cli` workstream packet set before implementation starts.

## Known Context

- Parent gap-audit config defines five forced lenses, one per iteration.
- Feasibility research verdict is GO: additive generated 9-tool Node CLI, `skill_advisor.py` reconciled as a legacy facade, warm-only hook policy, D1-D8 implementation deltas.
- Program pairing requires Claude Code, Codex, and Devin hooks plus OpenCode plugin integration; Gemini implementation is deliberately excluded but must be documented as such.
- `resource-map.md` was not present for this lineage; coverage gate skipped.

## Key Questions

- [x] LENS-1: Coverage cross-check, parity matrix vs phase ownership
- [x] LENS-2: Delta and requirement traceability both directions
- [x] LENS-3: Runtime pairing completeness vs actual adapter/plugin/config inventory
- [x] LENS-4: Sequencing, dependencies, estimates, and shared infrastructure
- [x] LENS-5: Adversarial residual sweep

## Answered Questions

- LENS-1: All nine tools are phase-owned, but some daemon-service semantics are not named as requirements/tasks.
- LENS-2: D1-D8 mostly trace, but D7's research acceptance omits Devin while phase 3 requires all four runtime configs.
- LENS-3: Phase 3 needs an explicit file inventory and an explicit Gemini exclusion note.
- LENS-4: Handoff chain is coherent; cross-daemon launcher/socket/model-server stress should be added as a P1 verification row.
- LENS-5: Phase-3 latency acceptance conflates cache-hit p95 with transport-down CLI demonstration unless warm/cache preconditions are specified.

## What Worked

- Using the completed feasibility synthesis as the delta authority made D1-D8 traceable quickly.
- Checking active runtime config files prevented a stale conclusion from the feasibility research, especially for Devin.
- Comparing the three launcher families separated documented root config isolation from missing cross-daemon stress acceptance.

## What Failed

- Broad repository grep produced many historical packets; targeted reads of active packet docs and active runtime files produced cleaner evidence.
- The current lineage could not perform live process-table stress because the task is read-only outside the artifact directory.

## Exhausted Approaches

- Treating planned phase placeholder "Files to Change" rows as automatic gaps.
- Reporting MCP removal, reference migration, Gemini implementation, or planned-phase checklist absence as gaps.

## Ruled-Out Directions

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Mark the workstream NO-GO | No P0 was found; gaps are pre-implementation cleanup items. | file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/spec.md:100 |
| Require Gemini CLI fallback implementation | Operator explicitly excluded Gemini from required implementation scope. | file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/gap-audit/deep-research-strategy.md:22 |
| Treat phase placeholder surfaces as blockers | Planned docs state expansion happens at speckit:plan time. | file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/plan.md:84 |

## Next Focus

Synthesis complete. Recommended follow-up is to patch phase packet docs before opening `001-cli-core`.

## Non-Goals

- Do not implement the CLI.
- Do not modify packet docs outside this lineage artifact directory.
- Do not require MCP removal or reference migration.
- Do not require Gemini implementation.

## Stop Conditions

- Stop after five forced lens iterations.
- Stop early only if a P0 makes further audit unhelpful.
- Final output must be a gap register verdict.
