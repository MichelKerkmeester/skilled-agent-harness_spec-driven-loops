# Deep-Review Iteration 8 Prompt Pack — Final Saturation

## STATE

Iteration: 8 of 10
Dimension: cross-cutting (final saturation; ready for synthesis)
Prior Findings (cumulative): P0=1 P1=11 P2=9 (21 total)
Dimension Coverage: [correctness:complete, security:complete, traceability:complete, maintainability:complete] (4/4)
Coverage Age: 2
Last 3 ratios: 0.30 -> 0.18 -> 0.07 -> 0.07
Convergence Score: 0.93 (saturated)
Provisional Verdict: FAIL (active P0)
Stuck count: 0 (iter-7 added P1-013, so still progressing slightly)

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096)

NEW from iter-7: P1-013 — Smart-router validation scans the REMOVED singular skill root and exits clean. This is a meta-bug: the rename verification gate itself was checking the now-empty singular path, so validation passes vacuously. Treat as established active P1.

## SHARED DOCTRINE
`.opencode/skills/sk-code-review/references/review_core.md`

## STATE FILES
- All under `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/`
- Iteration narrative target: `iterations/iteration-008.md`
- Delta target: `deltas/iter-008.jsonl`

## TASK FOR THIS ITERATION (final saturation)

This iteration is intended to be the final productive iteration before synthesis. Iter-9 and iter-10 will only run if iter-8 surfaces material new findings; otherwise the loop manager proceeds to synthesis.

1. **Final missed-surface sweep** — extremely targeted; do NOT re-investigate adjudicated findings:
   - `.github/workflows/*.yml` and `.github/workflows/*.yaml` — singular-path or sk-deep-* references in CI?
   - Top-level `package.json` and `mcp_server/package.json` — scripts/main/exports referencing singular paths?
   - `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` and the `is_phase_parent` shell helper — embedded singular-root literal checks?
   - `.opencode/skills/system-spec-kit/hooks/claude/*.js` (note: per memory the hooks live under `system-spec-kit/hooks/claude/`) — singular `.opencode/skill/` literals?
   - `audit_descriptions.py`, `skill_advisor.py` — verify the source actually uses plural paths in regex/dict/f-strings (they were claimed patched in 096 commit message; spot-check).
   - Any `.codex/agents/*.toml`, `.gemini/agents/*.md` for the leaf agents — confirm they aren't another mirror with sk-deep-* drift.

2. **No re-investigation** of:
   - dist drift in code_graph (closed by P0-001 + P2-002 + P2-008)
   - command YAML sk-deep-* drift (closed by P1-002 + P1-012)
   - OpenCode/Codex agent mirrors (closed by P1-008 + P1-009)
   - resolver / hook precedence / 096 validate.sh / checklist evidence (closed)

3. **Emit Closure Recommendation** clearly stating: ready for synthesis OR needs iter-9 (with reason).

4. **Stability test**: if the iter finds nothing new and no severity changes warrant, set findingsCount=21 unchanged, findingsNew=[], newFindingsRatio=0.0. The loop manager will then promote to synthesis.

## CONSTRAINTS

- LEAF. No sub-agents.
- Target 6-7 tool calls total (this is the most narrowly-scoped iteration).
- READ-ONLY review target. Writes confined to 097-track-review/review/.
- JSONL `"type":"iteration"` exactly with `findingDetails` for any NEW or CHANGED findings.
- Update strategy §12 NEXT FOCUS to either: "Iter-9: targeted re-pass on [X]" if new findings need confirmation, OR "Synthesis: loop is converged; verdict FAIL pending P0-001 remediation".

## OUTPUT CONTRACT

1. **iteration-008.md**: Files Reviewed, Findings by Severity (only NEW/CHANGED), Verdict, Closure Recommendation, Next Dimension/Status.

2. **State log iteration record** APPENDED. If no new/changed findings, the iteration record still must be appended with findingDetails=[] and newFindingsRatio=0.0.

3. **iter-008.jsonl** — matching iteration record + finding records (if any) + classifications (if any) + ruled-out (if any).

`newFindingsRatio` formula: P0=10/P1=5/P2=1; max(calc, 0.50) on new P0; 0.0 if no new findings AND no severity changes.

Begin.
