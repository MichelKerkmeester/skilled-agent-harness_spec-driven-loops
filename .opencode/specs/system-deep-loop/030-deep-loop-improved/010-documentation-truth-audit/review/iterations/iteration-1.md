# Deep Review Iteration 1

## Dimension
Traceability / maintainability documentation-truth audit.

## Files Reviewed
- `README.md:33` TOC entry for Spec Kit section.
- `README.md:208` FEATURES heading for Spec Kit section.
- `README.md:366` Memory Engine full FEATURES subsection baseline.
- `README.md:557` Code Graph full FEATURES subsection baseline.
- `README.md:678` Skill Advisor full FEATURES subsection baseline.
- `README.md:778` Deep Loop full FEATURES subsection baseline.
- `README.md:1230` Goal utility entry.
- `.opencode/plugins/README.md:49` goal plugin contract details.
- `AGENTS.md:1` root framework scope.
- `AGENTS.md:166` completion verification rule.
- `AGENTS.md:396` skill/agent routing scope.
- `AGENTS.md:450` deep-loop quick-reference row.
- `AGENTS_Barter.md:1` Barter framework scope.
- `AGENTS_Barter.md:350` template/validation requirement.
- `AGENTS_Barter.md:409` deep-loop quick-reference rows.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/spec.md:78` pre-decided README fixes.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/spec.md:113` README acceptance requirement.
- `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance/spec.md:69` schema-tolerant fan-out merge scope.
- `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/002-fanout-timeout-override/spec.md:68` lineage timeout override scope.
- `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/008-convergence-threshold-and-forced-depth-flag/spec.md:94` loop-type-aware threshold amendment.
- `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/008-convergence-threshold-and-forced-depth-flag/spec.md:95` stop-policy documentation requirement.
- `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/009-convergence-design-and-hardening/spec.md:72` stall watchdog scope.
- `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/009-convergence-design-and-hardening/spec.md:74` per-lineage cost cap scope.
- `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/010-validate-sh-template-detection/spec.md:67` SCAFFOLD_NEVER_TOUCHED scope.

## Findings by Severity

### P0
None.

### P1

#### P1-001 README still labels the Spec Kit section as Documentation instead of Framework
- Claim: `README.md` still uses the old label in both the TOC and section heading, despite the phase spec requiring the public README to use "Spec Kit Framework".
- Evidence: `README.md:33` contains `[SPEC KIT DOCUMENTATION](#spec-kit-documentation)` and `README.md:208` contains `### 📋 Spec Kit Documentation`; the target spec requires the rename at `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/spec.md:78` and acceptance checks no dangling old anchor references at `spec.md:113`.
- Counterevidence sought: I checked the README top feature table, which already says `Spec Kit Framework` at `README.md:5`, so this is not a repo-wide naming choice.
- Alternative explanation: The old label could have been intentionally narrower, but the active phase spec explicitly names the replacement.
- Final severity: P1, because this is a must-fix acceptance mismatch for the current phase.
- Confidence: 0.98.
- Downgrade trigger: If the phase spec is amended to make the rename optional or to preserve the old anchor intentionally, downgrade to P2.

#### P1-002 Goal plugin is only documented as a Utility command instead of a full FEATURES subsection
- Claim: `README.md` does not give the `mk-goal` plugin equivalent FEATURES-section treatment, even though this phase explicitly requires a full Goal Plugin FEATURES subsection.
- Evidence: the core systems have full FEATURES subsections (`Memory Engine` at `README.md:366`, `Code Graph` at `README.md:557`, `Skill Advisor` at `README.md:678`, `Deep Loop` at `README.md:778`), while Goal appears only under `#### UTILITY` at `README.md:1230-1233`; `.opencode/plugins/README.md:49` contains the richer `mk-goal.js` contract that the root README could surface; the phase spec records the user-confirmed full subsection at `spec.md:31` and requires promotion at `spec.md:78` / `spec.md:135`.
- Counterevidence sought: I checked `.opencode/plugins/README.md` for an existing detailed plugin contract and the root README FEATURES headings for comparable treatment.
- Alternative explanation: Goal could be intentionally command-only in a general README, but the active phase scope explicitly says it should be promoted.
- Final severity: P1, because this is a must-fix acceptance mismatch for the current phase.
- Confidence: 0.95.
- Downgrade trigger: If the phase spec is amended to keep Goal as command-only documentation, downgrade to P2.

### P2
None.

## Traceability Checks
- `spec_code`: PASS. The README findings tie directly to active target requirements in `spec.md:78`, `spec.md:113`, and `spec.md:135`.
- `checklist_evidence`: PASS for current iteration scope. `checklist.md:92` tracks README update evidence as pending, which matches the two active README findings.
- `feature_catalog_code`: PASS. `.opencode/plugins/README.md:49` confirms the Goal plugin has a detailed contract, while root README exposes only a compact Utility entry at `README.md:1230-1233`.
- `AGENTS.md` drift check: PASS/no finding. The root AGENTS file describes universal policy/gates and workflow routing (`AGENTS.md:1`, `AGENTS.md:166`, `AGENTS.md:396`, `AGENTS.md:450`) rather than fan-out timeout defaults, convergence constants, or enumerated validator rules. Search found no stale `0.10`, `--timeout-hours`, `SCAFFOLD_NEVER_TOUCHED`, stall-watchdog, or cost-cap claims in root `AGENTS.md`.
- `AGENTS_Barter.md` drift check: PASS/no finding. The Barter file is also policy/routing oriented (`AGENTS_Barter.md:1`, `AGENTS_Barter.md:350`, `AGENTS_Barter.md:409`) and does not claim the five implementation-level shipped details. Search found no stale flat threshold, fixed timeout, missing validator-rule list, stall-watchdog, or cost-cap claims.

## Verdict
CONDITIONAL. Two P1 README documentation-truth findings are active. No AGENTS.md or AGENTS_Barter.md drift was confirmed in this iteration.

## Next Dimension
Continue under `--stop-policy=max-iterations`; broaden to packet-local historical docs (`before-vs-after.md`, `timeline.md`, changelog rollups) and README cross-links instead of stopping on this dimension.
Review verdict: CONDITIONAL
