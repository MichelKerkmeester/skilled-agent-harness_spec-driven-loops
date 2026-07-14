# Deep-Review Iteration 7 Prompt Pack — MAINTAINABILITY

## STATE

STATE SUMMARY (auto-generated):
Iteration: 7 of 10
Dimension: maintainability (focus: doc anchors, narrative repair quality, narrative casualties from sed, deferred items)
Prior Findings: P0=0 P1=8 P2=5 (P1-007, P1-015, P1-016, P1-017, P1-018, P1-019, P1-020, P1-021 + 4 P2 + new P2-009)
Dimension Coverage: [inventory, correctness, security, traceability] (4/5)
Traceability: spec_code=fail | checklist_evidence=fail | skill_agent=mixed | agent_cross_runtime=fail | feature_catalog_code=fail | playbook_capability=mixed
Resource Map Coverage: traceability inventory completed in iter 6.
Coverage Age: 0
Last 2 ratios: 0.1667 -> 0.0769
Stuck count: 0
Provisional Verdict: FAIL hasAdvisories=true

Review Iteration: 7 of 10
Mode: review
Dimension: maintainability
Review Target: track:skilled-agent-orchestration packets 093-098 — maintainability audit
Review Scope Files (this iteration's focus):
  - 098/003-narrative-validation-repair/ (narrative casualties scope)
  - 096-rename-opencode-dirs-to-plural/ (post-rename narrative spec docs)
  - 098 sub-phase implementation-summary.md narratives (consistency, anchor health)
  - .opencode/skills/system-spec-kit/templates/level_*.md (template anchor health)
  - 094 RCAF naturalization claim files in .opencode/skills/sk-doc/assets/templates/
  - cli-opencode/cli-codex/cli-claude-code/cli-gemini SKILL.md (cross-CLI doc consistency)
  - Deferred items inventory across 098/004 (resolver), 098/005 (checklist), 098/007 (P2 sweep)
Prior Findings: P0=0 P1=8 P2=5

## CONTEXT — MAINTAINABILITY PASS

This iteration audits doc maintainability after the bulk-sed in 096 + 098 narrative repair.

**FOCUS-A: Narrative casualties from sed**
- The 096 plural rename did 670k+ token-occurrence sed across 4 phases
- Iter 1 found 098/003 repaired narrative casualties; spot-check that the FIX itself was clean
- Look for: tautological "rename A→A" patterns, broken markdown anchors, dangling cross-refs, accidental section-header mangling

**FOCUS-B: Doc anchor health**
- Spec/plan/tasks/checklist anchors should follow `<!-- ANCHOR:name -->` ... `<!-- /ANCHOR:name -->` pairs
- Spot-check 4-5 spec docs for unbalanced or mismatched anchors

**FOCUS-C: Deferred items hygiene**
- 098/004 deferred resolver containment (P1-005 → P2)
- 098/005 deferred checklist evidence (P1-007 active)
- 098/007 deferred P2-004 (Copilot target-authority)
- Are the deferrals documented in implementation-summary.md `_memory.continuity.blockers` AND surfaced for follow-on?

**FOCUS-D: 094 RCAF naturalization template hygiene**
- sk-doc templates should be self-consistent (RCAF format documented in templates matches what's in playbooks)
- Spot-check sk-doc/assets/templates/ for stale references to old prompt format

**FOCUS-E: Cross-CLI maintainability (cli-opencode, cli-codex, cli-claude-code, cli-gemini)**
- SKILL.md narratives across the 4 CLI orchestrators should be in similar shape
- Look for stale drift between them

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

- Config: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-007.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Tool budget 9 / 12 / 13.
- Review target READ-ONLY. Only write under `099-track-rereview/review/`.

## OUTPUT CONTRACT

Three artifacts: iteration-007.md narrative + state-log JSONL append (`type:iteration`, `dimensions:["maintainability"]`, sessionId 2026-05-07T17:08:57Z, generation 1, lineageMode "new") + iter-007.jsonl delta with `{"type":"finding"}` per finding. All required.
