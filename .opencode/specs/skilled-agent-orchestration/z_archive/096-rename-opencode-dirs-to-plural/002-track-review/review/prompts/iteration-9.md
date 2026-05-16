# Deep-Review Iteration 9 Prompt Pack — Narrow Re-pass on Python Support Tools

## STATE

Iteration: 9 of 10
Dimension: cross-cutting (narrow Python support-tool re-pass)
Prior Findings (cumulative): P0=1 P1=12 P2=9 (22 total)
Dimension Coverage: [correctness:complete, security:complete, traceability:complete, maintainability:complete] (4/4)
Coverage Age: 3
Last 4 ratios: 0.18 -> 0.07 -> 0.07 -> 0.06
Convergence Score: 0.94 (saturated)
Provisional Verdict: FAIL (active P0)

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096)

NEW from iter-8: P1-014 — Python doctor/advisor support scripts still resolve singular OpenCode roots. The 096 commit message claimed `skill_advisor.py` and `audit_descriptions.py` were patched, but iter-8 surfaced retained singular path defaults.

## SHARED DOCTRINE
`.opencode/skills/sk-code-review/references/review_core.md`

## STATE FILES
- All under `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/`
- Iteration narrative target: `iterations/iteration-009.md`
- Delta target: `deltas/iter-009.jsonl`

## TASK FOR THIS ITERATION (narrow Python support-tool re-pass)

Per iter-8 closure recommendation:

1. **Confirm and bound P1-014**:
   - Re-read `audit_descriptions.py` and `skill_advisor.py` (find their actual paths — likely under `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/` or `.opencode/skills/system-spec-kit/scripts/`).
   - Quote the exact lines that retain singular defaults vs the lines that were patched to plural.
   - Determine whether singular defaults are reachable at runtime (e.g., default-arg fallbacks, dict keys checked when env override is absent).
   - If reachable AND used in production, ESCALATE TO P0. Otherwise keep P1.

2. **Zero-coverage guard re-pass** (per iter-8 recommendation):
   - Look for any "validation passes when nothing matches" pattern in scripts that scan singular paths. P1-013 was one example; check whether the family extends.
   - Search for `find` / `glob` / `os.walk` / `glob.glob` patterns that use the literal `.opencode/skill` (singular) and would silently succeed (zero matches) post-rename.

3. **NO broad re-investigation** of:
   - dist drift, command YAML sk-deep-* drift, agent mirrors, resolver/hook precedence, 096 validate.sh, checklist evidence — all closed.

4. **Stability test**: if no new findings AND no severity changes, set findingsCount=22 unchanged, findingsNew=[], newFindingsRatio=0.0. Recommend synthesis.

5. **Update strategy** §12 NEXT FOCUS: either "Iter-10: confirm-only saturation" (if anything new lands) OR "Synthesis: loop is converged with verdict FAIL pending P0-001 remediation" (if iter-9 is clean).

## CONSTRAINTS

- LEAF. No sub-agents.
- Target 5-7 tool calls (narrowest iteration yet).
- READ-ONLY review target. Writes confined to 097-track-review/review/.
- JSONL `"type":"iteration"` exactly with `findingDetails` for any NEW or CHANGED findings.

## OUTPUT CONTRACT

1. **iteration-009.md**: Files Reviewed (just the 2-3 Python tools), Findings (only NEW/CHANGED), Verdict, Closure Recommendation, Next Status.

2. **State log iteration record** APPENDED.

3. **iter-009.jsonl** matching record + delta.

`newFindingsRatio` formula unchanged.

Begin.
