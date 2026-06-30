# Deep-Review Iteration 5 Prompt Pack — TRACEABILITY

## STATE

STATE SUMMARY (auto-generated):
Iteration: 5 of 10
Dimension: traceability (focus: smart-router validator, advisor state path, sk-deep dead refs, agent cross-runtime mirror parity)
Prior Findings: P0=0 P1=6 P2=4 (P1-007, P1-015, P1-016, P1-017, P1-018, P1-019)
Dimension Coverage: [inventory, correctness, security] (3/5)
Traceability: spec_code=fail | checklist_evidence=fail | skill_agent=pass | agent_cross_runtime=fail | feature_catalog_code=fail | playbook_capability=mixed
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: 0.2222 -> 0.1
Stuck count: 0
Provisional Verdict: FAIL hasAdvisories=true

Review Iteration: 5 of 10
Mode: review
Dimension: traceability
Review Target: track:skilled-agent-orchestration packets 093-098 — traceability audit
Review Scope Files (this iteration's focus):
  - .opencode/skills/system-spec-kit/scripts/check-smart-router.sh (validator coverage)
  - .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py (path bindings)
  - .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/audit_descriptions.py
  - .opencode/agents/, .codex/agents/, .gemini/agents/, .claude/agents/ (4-runtime mirror parity)
  - .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/
  - sk-deep-* dead reference sweep across .opencode/{commands,agents}/, runtime mirrors
  - Cross-references between SKILL.md → agents/ → commands/ chains
Prior Findings: P0=0 P1=6 P2=4

## CONTEXT — TRACEABILITY PASS

This iteration audits traceability protocols.

**FOCUS-A: smart-router validator (P1-013 RESOLVED in iter 1)**
- Confirm `check-smart-router.sh` actually scans `.opencode/skills` (16 plural skills) — was vacuous (0) before 098/003
- Verify it FAILS on zero-coverage (exit code, not warning)

**FOCUS-B: advisor state path (P1-014 RESOLVED in iter 1)**
- Confirm `audit_descriptions.py`, `skill_advisor.py` use plural roots
- Confirm `.opencode/skill/` directory has been DELETED (not just superseded)
- Spot-check generation.ts/.js advisor state writer

**FOCUS-C: sk-deep-* dead refs (P1-002, P1-008, P1-011, P1-012 claimed RESOLVED)**
- Run a fresh `rg "sk-deep-(review|research)"` across `.opencode/{commands,agents,specs/system-spec-kit}/` and `.{codex,gemini,claude}/agents/`
- Distinguish actionable references (live paths, agent body refs) from canonical IDs / aliases / corpus data

**FOCUS-D: 4-runtime mirror parity**
- For 5+ agents (e.g. @code, @debug, @review, @orchestrate, @deep-review), confirm `.opencode/agents/<name>.md` ↔ `.claude/agents/<name>.md` ↔ `.gemini/agents/<name>.md` ↔ `.codex/agents/<name>.toml` are body-aligned (allow runtime-specific frontmatter only)

**FOCUS-E: cross-references after 096 plural rename**
- Check that 094 RCAF naturalization references resolve correctly post-rename
- Spot-check 5+ install_guides for stale `.opencode/skill/` (singular) hits

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
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-005.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Tool budget 9 / 12 / 13.
- Review target READ-ONLY. Only write under `099-track-rereview/review/`.

## OUTPUT CONTRACT

Three artifacts: iteration-005.md narrative + state-log JSONL append (`type:iteration`, `dimensions:["traceability"]`, sessionId 2026-05-07T17:08:57Z, generation 1, lineageMode "new") + iter-005.jsonl delta with `{"type":"finding"}` per finding. All required.
