# Deep-Review Iteration 6 Prompt Pack — TRACEABILITY (resource map / cross-CLI memory_handback)

## STATE

STATE SUMMARY (auto-generated):
Iteration: 6 of 10
Dimension: traceability (focus: resource-map cross-check, memory_handback.md cross-CLI references, install_guides drift)
Prior Findings: P0=0 P1=8 P2=4 (P1-007, P1-015, P1-016, P1-017, P1-018, P1-019, P1-020, P1-021)
Dimension Coverage: [inventory, correctness, security, traceability(partial)] (3/5)
Traceability: spec_code=fail | checklist_evidence=fail | skill_agent=mixed | agent_cross_runtime=fail | feature_catalog_code=fail | playbook_capability=mixed
Resource Map Coverage: resource-map.md not present; build inventory from 098 sub-phase implementation-summary.md target_files claims.
Coverage Age: 0
Last 2 ratios: 0.1 -> 0.1667
Stuck count: 0
Provisional Verdict: FAIL hasAdvisories=true

Review Iteration: 6 of 10
Mode: review
Dimension: traceability (resource-map cross-check)
Review Target: track:skilled-agent-orchestration packets 093-098 — implementation-summary target_files vs reality
Review Scope Files (this iteration's focus):
  - .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-007/implementation-summary.md (target_files lists)
  - cross-CLI memory_handback.md references (find via rg)
  - .opencode/install_guides/ (P2-007 surface, sk-deep dead refs sweep)
  - .opencode/specs/system-spec-kit/ (legacy sk-deep references in spec docs)
  - playbook-prompt files referenced by sk-doc templates (RCAF cross-references)
Prior Findings: P0=0 P1=8 P2=4

## CONTEXT — RESOURCE-MAP CROSS-CHECK PASS

Iter 5 audited the validator/advisor surfaces. This iteration cross-checks each 098 sub-phase's
claimed target_files against the actual file state.

**FOCUS-A: 098 sub-phase target_files traceability**
For each of 098/001-007:
1. Read implementation-summary.md target_files section
2. Spot-check 2-3 entries: does the file exist? Does the cited line/range still match the claim?
3. Note any target file that is missing, moved, or whose claimed change is not present at the cited location

**FOCUS-B: memory_handback.md cross-CLI references (advisory follow-on from 098/003)**
The 098/003 narrative validation repair surfaced "memory_handback.md cross-CLI references" as
advisory follow-on. Run `rg "memory_handback"` and confirm:
- All references resolve to a real file
- No cross-CLI runtime drift (.opencode vs .codex vs .gemini vs .claude)

**FOCUS-C: install_guides drift (P2-007 RESOLVED claim)**
Run `rg "(\.opencode/skill/|sk-deep-(review|research))" .opencode/install_guides/`
- Confirm zero hits, OR list exact stale references

**FOCUS-D: playbook → SKILL.md cross-references (097 P1-018 territory)**
Spot-check that sk-code-review and sk-git playbooks are actually linked from their owning SKILL.md
(complement to iter 3's P1-018 finding).

**FOCUS-E: build a resource-map outline**
Since `--no-resource-map` is NOT set, the synthesis phase will emit resource-map.md from converged
deltas. This iteration should output a structured `traceability-check` delta record summarizing the
target_files universe across 098 sub-phases so the resource-map can be assembled.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## VERDICTS

`FAIL | CONDITIONAL | PASS`.

## CLAIM ADJUDICATION

Every new P0/P1: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-006.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-006.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Tool budget 9 / 12 / 13.
- Review target READ-ONLY. Only write under `099-track-rereview/review/`.

## OUTPUT CONTRACT

Three artifacts: iteration-006.md narrative + state-log JSONL append (`type:iteration`, `dimensions:["traceability"]`, sessionId 2026-05-07T17:08:57Z, generation 1, lineageMode "new") + iter-006.jsonl delta with `{"type":"finding"}` and `{"type":"traceability-check"}` records as appropriate. All required.
