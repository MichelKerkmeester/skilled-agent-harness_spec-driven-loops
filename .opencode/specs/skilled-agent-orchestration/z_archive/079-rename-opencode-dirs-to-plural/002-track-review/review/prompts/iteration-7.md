# Deep-Review Iteration 7 Prompt Pack — Closure / Saturation

## STATE

Iteration: 7 of 10
Dimension: cross-cutting (closure / saturation pass)
Prior Findings (cumulative): P0=1 P1=10 P2=9 (20 total)
Dimension Coverage: [correctness:complete, security:complete, traceability:complete, maintainability:complete] (4/4)
Coverage Age: 1
Last 3 ratios: 0.31 -> 0.30 -> 0.18 -> 0.07
Convergence Score: 0.93 (saturating)
Provisional Verdict: FAIL (active P0)

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096)

The active set is now stable. P0=1 (P0-001), P1=10, P2=9. P1-005 was downgraded to P2 last iteration after attack-matrix testing showed the malformed-spec_folder path is not exploitable in practice.

Read iteration-001..006 markdown for full adjudication packets.

## SHARED DOCTRINE
`.opencode/skills/sk-code-review/references/review_core.md`

## STATE FILES
- All under `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/`
- Iteration narrative target: `iterations/iteration-007.md`
- Delta target: `deltas/iter-007.jsonl`

## TASK FOR THIS ITERATION (closure / saturation)

This iteration's goal is to confirm we have NOT missed a P0/P1, NOT to re-investigate already-adjudicated findings.

1. **Final missed-surface sweep** — small, targeted:
   - `.github/workflows/` — any CI YAML that references singular `.opencode/(skill|agent|command)/` paths or `sk-deep-*`? If yes, P1.
   - `package.json` (root + `mcp_server/`) — scripts referencing singular paths? If yes, P1.
   - `.gitignore`, `.gitattributes` — entries referencing singular paths that would silently miss new files? If yes, P2.
   - `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` and friends — embedded path checks against singular roots? If yes, P1.
   - Hooks scripts under `.opencode/skills/system-spec-kit/hooks/claude/` — any `.opencode/skill/` literals? If yes, P0/P1 (depending on whether they fire).

2. **Adversarial classification refinement on remaining P1s**:
   - Walk each P1 (P1-002, P1-003, P1-004, P1-006, P1-007, P1-008, P1-009, P1-010, P1-011, P1-012) and challenge: is this REALLY P1 or could it be P2 advisory? Any borderline → re-adjudicate with file:line evidence.
   - Specific challenges:
     - P1-007 (unchecked checklist evidence on completed packets): is the gate truly required? If checklist evidence rule is documentary not load-bearing, downgrade to P2.
     - P1-009 (Codex @review weakens P1 blocking): does this actually weaken the contract at runtime or only in advisory text?
     - P1-010 (096 specs bulk-rewritten plural→plural tautology): is this prose-only or does it break automation?

3. **Resource-map cross-check**:
   - Packet 096 has `resource-map.md`. Open it. Sample 3-5 entries; verify they exist post-rename.
   - Compare resource-map's claimed "touched" entries against actual diff in commit 40dcf80052. Surface any drift as P2 or skip if clean.

4. **Stability check**: if NO new findings AND NO severity changes warrant by closure, set `findingsNew = []` and `newFindingsRatio = 0.0`. The loop manager will then promote STOP if all gates green except the active P0.

5. **Closure narrative**: regardless of new findings, the iteration markdown should include a "Closure Recommendation" section that states whether the loop is ready for synthesis (yes/no, reason).

## CONSTRAINTS

- LEAF. No sub-agents.
- Target 7 tool calls (lower than usual since saturation pass), soft 9, hard 11.
- READ-ONLY review target. Writes confined to 097-track-review/review/.
- JSONL `"type":"iteration"` exactly with `findingDetails` array.
- This is iteration 7 of 10. The loop manager will run at most 1-3 more saturation iterations after this; if you confirm stability, request synthesis in your Closure Recommendation.

## OUTPUT CONTRACT

1. **iteration-007.md**: Dimension(s), Files Reviewed, Findings by Severity (only NEW or CHANGED — do not re-list unchanged active findings), Traceability Checks, Verdict, Closure Recommendation, Next Dimension.

2. **State log iteration record** APPENDED with `findingDetails` for any new/changed findings.

3. **iter-007.jsonl** with iteration record + delta finding records (if any) + classifications (if any) + ruled-out (if any).

`newFindingsRatio` formula: P0=10/P1=5/P2=1, max(calc, 0.50) on new P0; 0.0 if no new findings AND no severity changes.

Begin.
