# Review Iteration 009 — Spec-doc honesty

- **Model**: opus-4.8 (claude2)
- **Seat**: r09
- **clean**: False
- **findings**: 4

## Analysis

I now have a comprehensive, evidence-backed picture. Let me summarize my findings.

## Review: Spec-doc honesty + completion claims (155 packet, slice r09/10)

I audited the parent `spec.md`, all three child phase folders (`001`/`002`/`003` spec/plan/tasks/checklist/implementation-summary), the `001/decision-record.md`, and `research/research.md`, cross-checking every load-bearing completion claim against the real committed files.

### What I verified as TRUE (not over-claimed)
- **19/19 tests (5 + 9 + 5)** — ran `vitest`: drift-guard=5, deep-skills=9, deep-council=5 = 19 passed. Per-file breakdown is exactly right (my first grep undercounted; `.each` expands). ✓
- **7 modes carry `advisorRouting`** + `advisorRoutingContract` legend; registry **1.0.0→1.1.0**. ✓
- **Exactly one `graph-metadata.json`** under `deep-loop-workflows`. ✓
- **`--dump-routing-maps`** flag (skill_advisor.py:3729/3780); **`DEEP_MODE_BY_CANONICAL` exported** (aliases.ts:96). ✓
- **§10 at line 1018**, §11 RELATED RESOURCES at 1119. ✓
- **10 benchmark fixtures** (5 modes × public/private). ✓
- **Negative-path exits**: missing dir→2, non-parent→1, reference PASS→0. ✓
- **`validate.sh --strict` green** on parent + all 3 children (0 errors / 0 warnings each). ✓
- **research.md**: "Model A 15/15 unanimous", C-plus, and the 4-class enum (`lexical|alias-fold|metadata|command-bridge`) in exec-rec item 2. ✓
- Registry lexical projection == Python `DEEP_ROUTING_MODE_BY_KEY` (3 keys), confirmed by the doctor 4b dynamic cross-check. ✓

### Defects found

**P1 — "12 invariants" is a fabricated count (actual: 11).** `parent-skill-check.cjs` has exactly 11 distinct check IDs (`1a,1b,1c,2a,3a,3b,3c,3d,3e,4a,4b` — nothing after line 292) and the live run prints **11 PASS** lines + `OK: parent-skill-check — all invariants passed, 0 warnings` (no number). Yet the docs claim "12" in five places. Tellingly, `checklist.md:76` quotes the real output (`"all invariants passed, 0 warnings"` — which has no count) and prepends a fabricated `12 invariants PASS`.

**P1 — ADR-001 amendment NOT propagated to the decision-record's indexed `description`.** The body of `decision-record.md` correctly strikes the dependency rationale (lines 63, 71, 73–75), and `research.md` correction #2 strikes it — but the frontmatter `description` (line 3) still presents the struck reason as a live rationale. The frontmatter description is what `memory_search` surfaces, so the stale rationale is still discoverable. This is exactly the "propagated everywhere?" invariant the review asked about — answer: **no**, one place was missed.

**P2 — child checklist `completion_pct: 95` is stale.** Both `002/checklist.md:23` and `003/checklist.md:23` say `completion_pct: 95` while every P0/P1 item is `[x]` (summaries: 12/12+6/6 and 13/13+5/5) and the parent `spec.md:25` claims `completion_pct: 100` / Status Complete. The epic is committed, so the close-out step the "95" was waiting on is done.

**P2 — `research.md` reconcile residual.** The doc was reconciled "3-class → 4-class" (per CHK-063 / phase-003 summary line 61), and exec-rec item 2 (line 17) does carry the explicit 4-class enum — but line 45 still uses the pre-reconcile "Three cardinalities … `lexical`+folded (the TS 4)" framing. The scoped CHK-063 claim is literally accurate (it points at exec-rec item 2), so this is a residual inconsistency, not an over-claim.

Note: the "3/3 routing-precision scorecard" is a runtime harness output (no committed scorecard artifact); I did not flag it false — the 10 fixtures exist and mode-precision is independently enforced by the parity fixtures, which are green.

===REVIEW-JSON===
{"slice":"spec-doc honesty + completion claims (155)","findings":[{"severity":"P1","path":".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/003-formalize-pattern/implementation-summary.md:59,90","issue":"Claims 'parent-skill-check.cjs (12 invariant checks)' and 'all 12 invariants PASS' but the script has exactly 11 distinct checks (1a,1b,1c,2a,3a,3b,3c,3d,3e,4a,4b) and the live run prints 11 PASS + 'all invariants passed, 0 warnings' (no count). Same '12' over-claim in spec.md:72,89 and checklist.md:76.","fix":"Change '12' to '11' in 003 spec.md:72/89, implementation-summary.md:59/90, checklist.md:76 (CHK-022 evidence) — or drop the count to match the script's actual 'all invariants passed' output.","confidence":"high"},{"severity":"P1","path":".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:3","issue":"ADR-001 amendment not propagated to the frontmatter 'description': it still states '(moving it would create a runtime->system-spec-kit dependency and is a semantic mismatch)' as a live rationale — the exact reason struck by the Amendment (lines 63,71,73-75) and research.md correction #2. This description is the search-indexed summary, so the stale/struck rationale is still surfaced.","fix":"Rewrite the line-3 description to the amended decision: shared/ stays on the execution-vs-synthesis axis only; the dependency rationale was struck because the runtime already depends on system-spec-kit by design.","confidence":"high"},{"severity":"P2","path":".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/002-advisor-routing-drift-guard/checklist.md:23","issue":"completion_pct: 95 while all P0/P1 items are [x] (summary 12/12 + 6/6) and parent spec.md:25 claims completion_pct:100 / Status Complete; epic is committed. Same stale 95 in 003-formalize-pattern/checklist.md:23.","fix":"Bump both child checklists' completion_pct to 100 (close-out commit is done).","confidence":"high"},{"severity":"P2","path":".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/research/research.md:45","issue":"Residual pre-reconcile framing: after the doc was reconciled to the explicit 4-class enum (exec-rec line 17), line 45 still describes 'Three cardinalities' with 'lexical+folded (the TS 4)' rather than the alias-fold class. Not an over-claim (CHK-063 points only at exec-rec item 2, which is accurate) but an internal inconsistency.","fix":"Align line 45's cardinality description with the shipped 4-class enum, or mark it as descriptive of the original framing.","confidence":"med"}],"clean":false}
===END===

## Findings (structured)

```json
[
  {
    "severity": "P1",
    "path": ".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/003-formalize-pattern/implementation-summary.md:59,90",
    "issue": "Claims 'parent-skill-check.cjs (12 invariant checks)' and 'all 12 invariants PASS' but the script has exactly 11 distinct checks (1a,1b,1c,2a,3a,3b,3c,3d,3e,4a,4b) and the live run prints 11 PASS + 'all invariants passed, 0 warnings' (no count). Same '12' over-claim in spec.md:72,89 and checklist.md:76.",
    "fix": "Change '12' to '11' in 003 spec.md:72/89, implementation-summary.md:59/90, checklist.md:76 (CHK-022 evidence) \u2014 or drop the count to match the script's actual 'all invariants passed' output.",
    "confidence": "high"
  },
  {
    "severity": "P1",
    "path": ".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:3",
    "issue": "ADR-001 amendment not propagated to the frontmatter 'description': it still states '(moving it would create a runtime->system-spec-kit dependency and is a semantic mismatch)' as a live rationale \u2014 the exact reason struck by the Amendment (lines 63,71,73-75) and research.md correction #2. This description is the search-indexed summary, so the stale/struck rationale is still surfaced.",
    "fix": "Rewrite the line-3 description to the amended decision: shared/ stays on the execution-vs-synthesis axis only; the dependency rationale was struck because the runtime already depends on system-spec-kit by design.",
    "confidence": "high"
  },
  {
    "severity": "P2",
    "path": ".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/002-advisor-routing-drift-guard/checklist.md:23",
    "issue": "completion_pct: 95 while all P0/P1 items are [x] (summary 12/12 + 6/6) and parent spec.md:25 claims completion_pct:100 / Status Complete; epic is committed. Same stale 95 in 003-formalize-pattern/checklist.md:23.",
    "fix": "Bump both child checklists' completion_pct to 100 (close-out commit is done).",
    "confidence": "high"
  },
  {
    "severity": "P2",
    "path": ".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/research/research.md:45",
    "issue": "Residual pre-reconcile framing: after the doc was reconciled to the explicit 4-class enum (exec-rec line 17), line 45 still describes 'Three cardinalities' with 'lexical+folded (the TS 4)' rather than the alias-fold class. Not an over-claim (CHK-063 points only at exec-rec item 2, which is accurate) but an internal inconsistency.",
    "fix": "Align line 45's cardinality description with the shipped 4-class enum, or mark it as descriptive of the original framing.",
    "confidence": "med"
  }
]
```
