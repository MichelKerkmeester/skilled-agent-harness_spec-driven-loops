---
title: "Decision Record: Phase 14: fix-deep-review-findings"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "014-fix-deep-review-findings operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings"
    last_updated_at: "2026-11-24T06:13:54.198Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 14: fix-deep-review-findings

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Close the stage-one routing leak by fixing the shared advisor scorer rather than superseding AC-018 and AC-020. | Not stated. | None | REQ-018, REQ-020, AC-018, AC-020, goal criterion 5, spec.md scope |
| Q002 | Run a follow-up deep review of the hub epic after the 014 commit, with the ClickUp report folder and the changed scorer files added to its scope. | Not stated. | None | implementation-summary.md, parent spec.md |
| Q003 | Ship the anchored scorer fix and re-baseline the ratchet's `unknown_count` from 13 to 14. | The one moved corpus row was already wrong and now abstains, and no correct answer changed. | None | spec.md scope, plan.md lane S, advisor changelog 2.0.2.0 |
| Q004 | Keep investigating after the first gate moved four pinned slices, then land the narrower anchor (variant E) and re-pin the command slice, one doctor row and three divergence-ledger rows. | Each remaining move went toward the expected answer, or ranked the exact command a prompt names above a hub it reached on one shared word. | Q003 for the gate's shape | spec.md scope, plan.md lane S, implementation-summary.md |
| Q005 | Merge the four DeepSeek lineages of the follow-up review with the missing stop gates stated, check each P1 against source, and open a phase-015 fix packet for the confirmed ones. | A rerun would also return CONDITIONAL, because the findings stand. | None | `../review/review-report.md` |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:9ff3994f-42c1-4391-b8aa-2aa64bef91c3:toolu_016K4fT7KCW586hhEZu44gCT:0 -->

Question:
```text
Packet 014's routing fix is half-closed. The hub's front door (stage two) now defers on all 18 out-of-domain test prompts. But the skill advisor (stage one) still returns mcp-browser-use at 0.8 or above on 8 of them. Six sit exactly on the advisor's 0.82 confidence floor (raw scores 0.08 to 0.18, the same floor sk-code gets on these prompts). Two come from a bare `har` token in the shared scorer. Acceptance rows AC-018 and AC-020 and goal criterion 5 require stage one to clear, so 014 cannot close as written. How should it close? Either way, Known Limitations will record one real playbook request (PB-04) that the advisor misses while the front door routes it correctly. None of the aliases lane D removed occur in that prompt.
```

Options:
```text
Supersede, follow-up (Recommended)
Widen scope: fix scorer
Leave unmet, keep open
```

Answer:
```text
Widen scope: fix scorer
```

### Q002
<!-- source: claude:9ff3994f-42c1-4391-b8aa-2aa64bef91c3:toolu_016K4fT7KCW586hhEZu44gCT:2 -->

Question:
```text
Run a follow-up deep review of the hub epic after this closes? Its scope list must add the 2026-11-22 ClickUp report folder to pass the scope gate.
```

Options:
```text
Not now (Recommended)
Run it after the commit
```

Answer:
```text
Run it after the commit
```

### Q003
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:scorer-fix:0 -->

Question (condensed from the text asked):
```text
The scorer fix clears all 8 stage-one out-of-domain failures, but unknown_count moves 13 to 14 on one already-wrong row (rr-iter3-069), and the ratchet and parity test fail on it. How should the scorer change land?
```

Options:
```text
Ship C+B+R, re-baseline (Recommended)
Ship B+R only, no floor gate
Keep investigating
```

Answer:
```text
Ship C+B+R, re-baseline (Recommended)
```

### Q004
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:scorer-scope:0 -->

Question (condensed from the text asked):
```text
The full advisor suite shows the floor gate moves four pinned slices: the divergence ledger, the command routing slice, and three doctor rows, one a real loss. How should it land? Then: variant E, a narrower anchor, keeps every browser fix and recovers the losses, leaving ledger, command-slice and one doctor-row re-pins. Should E land with these re-pins?
```

Options:
```text
Ship gate, re-pin all (Recommended) / Ship har + trace only / Keep investigating
Land E, re-pin all (Recommended) / Land E, keep doctor pin / Revert to har + trace only
```

Answer:
```text
Keep investigating
Land E, re-pin all (Recommended)
```

### Q005
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:review-run:0 -->

Question (condensed from the text asked):
```text
The follow-up deep review ran on four DeepSeek lineages. Each reached CONDITIONAL with no P0, but none ran the terminal-gates step, so the runner failed all four. How should I proceed?
```

Options:
```text
Merge, verify, then fix (Recommended)
Rerun on Luna xhigh fast
Merge and stop here
```

Answer:
```text
Merge, verify, then fix (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
