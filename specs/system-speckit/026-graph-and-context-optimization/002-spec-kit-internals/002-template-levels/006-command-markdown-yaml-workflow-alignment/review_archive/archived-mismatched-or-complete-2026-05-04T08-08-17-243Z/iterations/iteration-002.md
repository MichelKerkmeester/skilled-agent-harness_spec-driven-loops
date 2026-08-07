# Iteration 2: template-rendering-correctness → correctness plus maintainability

## Dispatcher
- Budget profile: scan
- Focus: Level 3 rendered AI protocol coverage in target packet.

## Files Reviewed
- `007-marker-validation-unused-scaffold/plan.md`
- `007-marker-validation-unused-scaffold/tasks.md`
- `.opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh`

## Findings - New

### P0 Findings
- None.

### P1 Findings
1. **F003 Level 3 AI protocol coverage is hidden in marker comments instead of executable review sections** -- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:279` -- The target plan only lists `AI EXECUTION`, `Pre-Task Checklist`, `Execution Rules`, `Status Reporting Format`, and `Blocked Task Protocol` inside an HTML marker block rather than actual reviewer-readable protocol sections. The validator rule searches those phrases, including plan/task content, so marker-only content can look like coverage while providing no executable instructions. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:279`; CONTEXT: `.opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:58`]
   - Finding class: matrix/evidence
   - Scope proof: Reviewed target plan/tasks and validator AI protocol rule expectations.
   - Affected surface hints: plan.md, tasks.md, AI_PROTOCOL validation
   ```json
   {"findingId":"F003","claim":"The target's Level 3 AI protocol markers do not provide actual protocol sections despite satisfying phrase-based discovery.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:279",".opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:58"],"counterevidenceSought":"Read target tasks.md for real AI Execution Protocol sections and compared with compliant fixture section structure.","alternativeExplanation":"The marker block may be intentionally appended to satisfy scaffold-validation counters, but that does not make it usable protocol documentation.","finalSeverity":"P1","confidence":0.84,"downgradeTrigger":"Downgrade if validators explicitly ignore marker comments or real AI protocol sections are rendered in target tasks/plan."}
   ```

### P2 Findings
- None.

## Traceability Checks
- `checklist_evidence`: partial; checklist is unchecked, so no checked overclaim exists, but no completion evidence exists either.

## Integration Evidence
- Validator context: `.opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh` was used only to interpret target marker evidence.

## Edge Cases
- Marker content may be a generated scaffold-validation hack; severity kept at P1 because the active target is not archived as a fixture.

## Confirmed-Clean Surfaces
- No runtime mirror surface applies to this target.

## Ruled Out
- No source-code correctness issue was recorded because no implementation path is named by target docs.

## Next Focus
- dimension: validator-coverage
- focus area: strict validation replay for target packet
- reason: marker/template evidence should be checked against the live validator outcome
- rotation status: correctness and maintainability touched; traceability follow-up required
- blocked/productive carry-forward: direct target reads and validator-context reads productive
- required evidence: strict validate output plus cited target lines
