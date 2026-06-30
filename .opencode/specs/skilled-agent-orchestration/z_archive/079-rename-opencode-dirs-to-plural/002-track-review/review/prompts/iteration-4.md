# Deep-Review Iteration 4 Prompt Pack

## STATE

Iteration: 4 of 10
Dimension: traceability (deep pass)
Prior Findings (cumulative): P0=1 P1=5 P2=4 (10 total)
Dimension Coverage: [correctness:complete, security:complete] (2/4)
Coverage Age: 0
Last 2 ratios: 0.50 -> 0.31
Stuck count: 0
Provisional Verdict: FAIL (active P0)
Convergence Score: 0.69 (rising)

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096)

Active findings carried forward (DO NOT re-investigate; only adjudicate severity if new evidence demands):
- P0-001 (was P1-001): dist code-graph globs stale; live runtime impact confirmed
- P1-002: Command YAML reads non-existent sk-deep-* skill paths
- P1-003: skill_advisor.py source still writes .opencode/skill/.advisor-state
- P1-004: Packet 096 validate.sh fails on parent + 004-symlinks doc sufficiency
- P1-005: Deep-loop artifact resolver accepts malformed spec_folder values (resource-map redirect risk)
- P1-006: Claude Stop hook env-selected autosave runs before canonical path resolution
- P2-001..004: doc drift, dist test fixtures, additional setup helpers, unimplemented Copilot guard

Read `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md` for full adjudication packets.

## SHARED DOCTRINE

`.opencode/skills/sk-code-review/references/review_core.md`

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-strategy.md`
- Iteration narrative target: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-004.md`
- Delta target: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deltas/iter-004.jsonl`

## TASK FOR THIS ITERATION (D3 Traceability)

Per strategy §12 NEXT FOCUS:

1. **Prompt-equality contract audit across the 16 RCAF naturalized playbooks** (packet 094 scope):
   - Find the canonical prompt-equality requirement text (likely in `.opencode/skills/sk-doc/...` snippet template, or in the per-playbook spec). What does the contract claim?
   - List all 16 manual_testing_playbook directories under `.opencode/skills/`. For each, sample 2-3 scenarios and check whether the canonical "Prompt:" field matches the SKILL.md or upstream source-of-truth where the contract claims equality. Per memory: "Final RCAF retention: 112/720 = 15% globally" — meaning ~85% of prompts are naturalized; for the RCAF-retained ones (orchestrator-as-actor scenarios), the equality contract is preserved literally.
   - Surface any playbook where (a) RCAF was naturalized but the contract still demanded literal equality, OR (b) the contract was relaxed but a downstream test/script still asserts equality.
2. **Spec/checklist evidence for packets 093-096**:
   - For each packet's spec.md/checklist.md, do the claims still match the shipped artifacts? Sample 1-2 claims per packet and verify.
   - 094 has decision-record.md — check at least one ADR for current accuracy.
3. **Cross-runtime mirror parity for leaf agents**:
   - Compare `deep-review`, `deep-research`, `code`, `review`, `context` agent definitions across `.claude/agents/`, `.opencode/agents/`, `.codex/agents/`, `.gemini/agents/`. The body/role/tool surface should match (modulo runtime-specific frontmatter). Look for divergence introduced by the rename.
4. **Command YAML write-authority claims**: 
   - The deep-review YAML claims `workflow-resolved spec_folder is the only legal write authority`. Verify the resolver matches that claim. P1-005 already showed the resolver accepts malformed values — escalate to P0 only if this is reachable from a hostile but plausible config.
5. **Resource-map traceability**:
   - 096 has `resource-map.md` (visible in earlier ls). Sample its target_files and confirm they exist post-rename.

## CONSTRAINTS

- LEAF. No sub-agents.
- Target 9 tool calls, soft 12, hard 13.
- READ-ONLY review target. Writes confined to 097-track-review/review/{iterations,deltas,deep-review-state.jsonl,deep-review-strategy.md}.
- JSONL `"type":"iteration"` exactly.
- Include `findingDetails` array.
- Mark D3 Traceability `[x]` in §3 if pass converges. Update §12 NEXT FOCUS for iter-5 (D4 Maintainability: doc anchors, dead refs, narrative spec doc casualties from sed).

## OUTPUT CONTRACT

1. **iteration-004.md** with sections: Dimension, Files Reviewed, Findings by Severity (P0/P1/P2 + claim-adjudication packets for new findings), Traceability Checks (per protocol), Verdict, Next Dimension.

2. **State log iteration record** APPENDED:

```json
{"type":"iteration","iteration":4,"mode":"review","run":"run-4","status":"complete","focus":"traceability","dimensions":["traceability"],"filesReviewed":["..."],"findingsCount":<cumulative>,"findingsSummary":{"P0":<cum>,"P1":<cum>,"P2":<cum>},"findingsNew":[/*ids new this iter*/],"findingDetails":[/*all touched this iter*/],"traceabilityChecks":{"summary":{...},"results":[...]},"newFindingsRatio":<0..1>,"sessionId":"2026-05-07T14:46:56Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

3. **iter-004.jsonl** — matching iteration record + finding records + classifications + ruled-out directions.

`newFindingsRatio` formula: severity-weighted findings new this iter / cumulative findings touched, P0=10 / P1=5 / P2=1, `max(calc, 0.50)` if any new P0. 0.0 if no new findings.

Begin.
