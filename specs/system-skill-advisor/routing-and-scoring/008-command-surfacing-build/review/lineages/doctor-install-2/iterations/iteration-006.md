# Review Iteration 6 — final consistency pass

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-2-1794570021136-noekp0`, generation 1, lineageMode new.
- Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/doctor-install-2`.
- Dimension: all four, consistency and convergence. Budget profile: adjudicate.
- Operator review focus: pass two of the command-surfacing review. This iteration re-read every cited finding line and the state that synthesis will use, checked the five active P2 findings for contradiction, and confirmed that no pass-one fix in the area has regressed. It addressed the final docs/code consistency part of the focus. No holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:104` (exit-3 branch, DR2-P2-004)
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:133-148` (wrapper matcher, DR2-P2-005)
- `.skilled/commands/doctor/setup.md:82` (hook-health repair, DR2-P2-006)
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:651` (A10 expected count, DR2-P2-007)
- `.skilled/commands/doctor/_routes.yaml:536` (backup path contract, DR2-P2-008)
- `deep-review-findings-registry.json`, `deep-review-state.jsonl`, `deep-review-strategy.md` (lineage state, read-only)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

The five active P2 findings from iterations 1 to 5 stand as recorded; no re-read contradicts one, and no finding was promoted or closed.

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | pass | The reviewed fixes and the five findings stay inside the parent spec's command-surfacing scope; the phase-007 open item is pass-one and not re-reported. |
| checklist_evidence | core | notApplicable | The parent has no `acceptance-criteria.md`; the phase children own theirs. |
| skill_agent | overlay | notApplicable | No skill or agent definition in this area. |
| agent_cross_runtime | overlay | pass | The four hook runtimes are wired in this checkout; the install route names the six manifest runtimes and dsh is explicitly not offered. |
| feature_catalog_code | overlay | notApplicable | The advisor feature catalog does not describe the doctor routes. |
| playbook_capability | overlay | notApplicable | No playbook file in this area. |

## Integration Evidence

- All five cited lines were re-read from the working tree; each still carries the text the finding describes.
- The owning test files passed: `agents-md-embed.test.cjs` 43/43, `agents-md-check.test.cjs` 44/44, `hook-wiring-check.test.cjs` plus `codex-hook-approval-check.test.cjs` 13/13, and the three contract files 33/33.
- The convergence vote is 0.70 (rolling 0.20 fails the 0.08 floor, MAD 0.37 passes the latest 0.00, dimension coverage 1.00 passes), with no active P0 or P1 and no search debt.
- No review target, config, registry, dashboard, command, skill or agent file was modified by this lineage outside its own directory.

## Edge Cases

- The graph convergence script would write outside this lineage, so it was not run; the lineage records the graph as unavailable and uses the inline composite vote, as pass one did. This is a review-state limitation, not a finding.
- The pass-one report's deferred item about sandboxed runtime reach for DR1-P1-001 remains deferred and is not re-reported.
- Holdout hygiene is not applicable to this area; no holdout file was opened and no count was taken from one.

## Confirmed-Clean Surfaces

- Every pass-one doctor-install fix holds: DR1-P1-001, DR4-P1-001, DR4-P2-001, DR1-P2-003, DR1-P2-001, DR1-P2-002, DR3-P2-001, DR5-P2-003, DR3-P2-004, DR5-P2-001, DR5-P2-002, DR3-P2-002, DR3-P2-003, DR2-P2-001, DR2-P2-002, DR2-P2-003 and Q3 (with the DR2-P2-006 repair-text exception).
- The five new findings are all P2 and all in the changed or directly describing surfaces; none is a regression of a fix that holds.
- The iteration final lines, strategy counts and registry counts agree: five open P2, zero P0, zero P1, zero resolved.

## Ruled Out

- **A pass-one fix regressed** -- ruled out: each fix was re-read and its owning test file passed in this lineage.
- **A new P0 or P1 exists in the area** -- ruled out: the five findings are documentation, diagnostic-count or diagnostic-matcher defects with no write-path or security consequence.
- **The five findings contradict each other** -- ruled out: they name five separate surfaces (exit-3 route text, hook matcher, setup health repair, A10 count, embed backup path).
- **Holdout text was read** -- ruled out: no holdout file was opened in this lineage.

## Next Focus

- Dimension: none; the loop converges here.
- Focus area: synthesis of the five P2 findings into the lineage report.
- Reason: all four dimensions have coverage, the last two ratios are 0.40 and 0.00, and the composite vote clears 0.60.
- Rotation status: complete.
- Blocked/productive carry-forward: none.
- Required evidence: the synthesis report, the closeout events and the release-readiness state.

Review verdict: PASS
