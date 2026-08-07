# Deep Review Iteration 004

## Dispatcher
- Route: `mode=review`, `target_agent=deep-review`, single YAML-owned LEAF iteration
- Focus: maintainability across ownership, schema reuse, generated-metadata conventions, and change amplification in phases 004-010
- Budget profile: `verify` (graphless direct-read and exact-search fallback)

## Files Reviewed
- Phase 004-010 `spec.md`, `plan.md`, `tasks.md`, and selected checklist/graph metadata evidence
- Existing `.opencode/skills/sk-design/design-foundations/SKILL.md`, `design-motion/SKILL.md`, and `design-mcp-open-design/SKILL.md`
- Parent strategy/state plus iterations 001-003 for carried-finding durability

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Two implementation packets classify existing mode and transport surfaces as new creations** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/spec.md:99-104` -- Phase 009 marks the existing `design-foundations/**` and `design-motion/**` surfaces as `Create (proposed)` in both its spec and affected-surface plan, while both mode contracts already exist. Phase 010 likewise marks the existing transport directory as `Create (proposed)` even though its plan correctly says `Add`. An implementer following the owning specs can scaffold over established contracts instead of extending them, obscuring current ownership and multiplying reconciliation work across three consumers. [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/spec.md:99-104`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/plan.md:97-105`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/spec.md:83-88`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/plan.md:91-97`] [SOURCE: `.opencode/skills/sk-design/design-foundations/SKILL.md:1-15`] [SOURCE: `.opencode/skills/sk-design/design-motion/SKILL.md:1-15`] [SOURCE: `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1-18`]
   - Finding class: matrix/evidence
   - Scope proof: Exact change-type searches covered phase-004-010 specs/plans/tasks; phase 008 consistently says `Modify`, phase 010's plan says `Add`, but phase 009's spec/plan and phase 010's spec retain creation semantics for three existing runtime surfaces.
   - Affected surface hints: `design-foundations contract`, `design-motion contract`, `Open Design transport`, `phase implementation routing`
   - Recommendation: Reclassify the three existing surfaces as modifications/additions and identify the additive files or seams so implementation preserves their established contracts.

```json
{"type":"claim-adjudication","findingId":"SOL-A-I004-P1-001","claim":"The phase-009 and phase-010 owning specs classify three existing runtime surfaces as creations, permitting implementation to replace or independently scaffold contracts that must instead be extended.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/spec.md:99-104",".opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/plan.md:97-105",".opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/spec.md:83-88",".opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/plan.md:91-97",".opencode/skills/sk-design/design-foundations/SKILL.md:1-15",".opencode/skills/sk-design/design-motion/SKILL.md:1-15",".opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1-18"],"counterevidenceSought":"Reviewed each packet's affected-surface plan, implementation wording, current mode/transport contracts, and phase-008 modification convention for evidence that Create meant additive files only.","alternativeExplanation":"Phase 009 later says proposed additions under the existing directories and phase 010's plan correctly says Add, reducing destructive intent; the owning spec/plan action labels nevertheless remain contradictory and phase 009 never names the additive file boundary.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"Downgrade to P2 if the implementation dispatcher is proven to ignore change-type labels and an authoritative affected-file manifest identifies additive files while preserving each existing contract."}
```

### P2 Findings
None.

### Authoritative Carried Findings
- `SOL-A-I001-P1-001` remains active: completed research phases retain stale pre-run continuity state.
- `SOL-A-I002-P1-001` remains active: hydration lacks a contracted filesystem-containment boundary.
- `SOL-A-I002-P1-002` remains active: the STUDY envelope does not neutralize untrusted instructions.
- `SOL-A-I003-P1-001` remains active: canonical parent surfaces omit the implementation-phase dependency graph.

## Traceability Checks
- `ownership_drift`: partial — phase ownership is named, but phase 009/010 action labels contradict three existing integration surfaces.
- `schema_duplication`: pass — phase 007 owns the shared field set; phases 008/009 reference it, and phase-010 T001 explicitly reuses the seam.
- `change_amplification`: partial — incorrect creation semantics span foundations, motion, and transport, requiring reconciliation across three consumers.

## Integration Evidence
- `.opencode/skills/sk-design/design-foundations/SKILL.md:1-15` and `.opencode/skills/sk-design/design-motion/SKILL.md:1-15` prove both phase-009 targets are established mode contracts.
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1-18` proves phase 010 targets an established transport packet.
- Phase 007/008/009/010 plans consistently place shared proof fields under the phase-007 seam; phase-010 tasks explicitly require seam reuse.

## Edge Cases
- Structural and semantic graph analysis were unavailable after the MCP timeout; direct reads and exact searches supplied graphless evidence.
- All implementation phases remain planned; the new finding concerns unsafe change classification, not an already-destructive edit.
- Phase-010 plan wording is counterevidence and prevented blocker classification; phase-009's repeated creation label leaves the class active at P1.
- The reducer registry contains summary placeholders, but the four narrative IDs remain authoritative and are preserved in state without placeholder IDs.

## Confirmed-Clean Surfaces
- Phase 005 establishes a single schema authority with drift tests rather than parallel consumer definitions.
- Phase 007 assigns common proof/handoff field ownership once, and phases 008/009 require reference/reuse rather than copied envelopes.
- Generated retrieval metadata in phase 004 has byte-stable output, check mode, generation hashing, and no volatile timestamp convention.

## Ruled Out
- Parallel shared-envelope schemas: ruled out by phase-007 single ownership plus explicit phase-008/009 reference and phase-010 reuse requirements.
- Unowned generated metadata: ruled out for phase 004; the manifest generator, check command, generation hash, and committed artifact are named.
- Existing runtime absence: ruled out for foundations, motion, and Open Design transport by direct reads of their current `SKILL.md` contracts.

## Next Focus
- dimension: cross-dimension stabilization
- focus area: adversarial replay of all active P1 claim packets and cumulative-state durability
- reason: all four configured dimensions now have coverage; convergence requires stabilization without reducer placeholder substitution
- rotation status: maintainability complete; rotate to stabilization
- blocked/productive carry-forward: do not retry exhausted correctness/security/traceability inventories; direct claim-specific rereads remain productive
- required evidence: all five active P1 evidence anchors, counterevidence, canonical IDs, and reducer-safe finding details

Review verdict: CONDITIONAL
