---
title: "Decision Record: Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-compiled-route-rule-growth operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth"
    last_updated_at: "2026-11-13T16:11:17.314Z"
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
# Decision Record: Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Cap a bundle at four modes in the three registry compilers and add a test that bounds the rule count, instead of replacing the rule list with a closed-form rule. | Not stated. | None | REQ-001, REQ-003, plan.md |
| Q002 | Commit one commit per packet, merge into main, rerun the suites there and push to origin; the worktree was then removed. | Not stated. | None | implementation-summary.md, how-delivered |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01QLXF3ViWs96QexETMvXGJj:0 -->

Question:
```text
The route-growth packet has two possible fixes of very different size, and the plan depends on which one. Today three hub compilers (sk-code, mcp-tooling, sk-design) emit one rule per subset of modes, and the shared policy check rejects a bundle that has no rule. Which fix should I plan?
```

Options:
```text
Cap the subset size (Recommended)
Rule on demand
Cap now, on demand later
```

Answer:
```text
Cap the subset size (Recommended)
```

### Q002
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_016bSmkoBstUvW6nkxAUaAer:0 -->

Question:
```text
Both fixes (the cap on mode subsets and the advisor Node record) are built and verified in worktree 367, with 28 changed paths uncommitted. What should happen to them?
```

Options:
```text
Commit, merge, push (Recommended)
Commit and merge locally
Commit only
Leave uncommitted
```

Answer:
```text
Commit, merge, push (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
