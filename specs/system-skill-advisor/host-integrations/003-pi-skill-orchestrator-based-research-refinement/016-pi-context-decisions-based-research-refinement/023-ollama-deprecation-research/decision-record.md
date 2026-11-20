---
title: "Decision Record: Phase 23: ollama-deprecation-research"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "023-ollama-deprecation-research operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/023-ollama-deprecation-research"
    last_updated_at: "2026-11-20T19:55:46.578Z"
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
# Decision Record: Phase 23: ollama-deprecation-research

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Each deep-research iteration runs as claude2 launched directly, keeping the workflow's prompt, gateway, verify step and reducer. | The operator asked for claude2, and the workflow's dispatch script refuses a Claude launch from inside a Claude session. | None | tasks.md T003, implementation-summary.md Key Decisions |
| Q002 | All 23 released changelog entries that mention the lane are rewritten, so the residue check covers changelog folders too. | Not stated. | None | research.md 5.5 and 5.6 item 1 |
| Q003 | Shadow weights stay at 0.95 after the lane goes; no lane is renormalized. | Not stated. | None | research.md 5.6 item 2 |
| Q004 | The five-lane files are renamed to a name without a lane count, and the prose follows. | Not stated. | None | research.md 4.6 and 5.6 item 3 |
| Q005 | The orphan sweeper keeps its Ollama-preserve guard, with an exact-path allowlist row in the residue check. | Not stated. | None | research.md 4.6 and 5.6 item 4 |
| Q006 | The cleanup asks on every run before removing the pulled nomic-embed-text model and does not remember the answer. | Not stated. | None | research.md 5.4 and 5.6 item 5 |
| Q007 | shared/chunking.ts and shared/utils/retry.ts are deleted with the embeddings package, with their tests. | Not stated. | None | research.md 3.7 and 5.6 item 6 |
| Q008 | Existing advisor databases are discarded and rescanned by raising SCHEMA_VERSION, and .bak and .corrupt copies are deleted. | Not stated. | None | research.md 5.3 and 5.6 item 7 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0159PM8X9RJiR1q5oCYY8Hjg:0 -->

Question:
```text
The deep-research workflow refuses to launch Claude from inside a Claude session. Its recursion guard sees `claude` among the parent processes, so iteration 1 on claude2 was refused (exit 3, recorded as a dispatch failure). How should the 5 iterations run?
```

Options:
```text
claude2 directly (Recommended)
Native on this account
Run it from a plain terminal
```

Answer:
```text
claude2 directly (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01FzHXq9DJ8VPQZzPn11SLof:0 -->

Question:
```text
Released changelogs: 23 changelog files mention the Ollama lane. What should the residue check do with them?
```

Options:
```text
Exclude folders (Recommended)
Rewrite all 23
```

Answer:
```text
Rewrite all 23
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01FzHXq9DJ8VPQZzPn11SLof:1 -->

Question:
```text
Lane weights: removing the semantic lane drops its 0.05 share of the shadow weights, leaving 0.95 total. Live weights are already 0.95. What should happen to the other four lanes?
```

Options:
```text
Leave at 0.95 (Recommended)
Renormalize to 1.0
```

Answer:
```text
Leave at 0.95 (Recommended)
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01FzHXq9DJ8VPQZzPn11SLof:2 -->

Question:
```text
Three files are named after the "five-lane" fusion, and 45 files say five-lane or 5-lane. What happens to those names after the lane goes?
```

Options:
```text
Rename, no count (Recommended)
Rename to four-lane
Keep the names
```

Answer:
```text
Rename, no count (Recommended)
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01FzHXq9DJ8VPQZzPn11SLof:3 -->

Question:
```text
The orphan-process sweeper has a guard (orphan-mcp-sweeper.sh, line 491) that stops it killing Ollama processes. Keep it?
```

Options:
```text
Keep with allowlist (Recommended)
Remove the guard
```

Answer:
```text
Keep with allowlist (Recommended)
```

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_015kyAuKG2EKvCFVx9iX3Ca1:0 -->

Question:
```text
During cleanup on a user's machine, the Ollama store holds `nomic-embed-text:v1.5`, but nothing records whether Skilled pulled it or the user did. What should `/doctor:update apply` do?
```

Options:
```text
Ask every run (Recommended)
Remove without asking
Only print the command
```

Answer:
```text
Ask every run (Recommended)
```

### Q007
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_015kyAuKG2EKvCFVx9iX3Ca1:1 -->

Question:
```text
`shared/chunking.ts` and `shared/utils/retry.ts` have no importer left once the embeddings package goes, only tests. What happens to them?
```

Options:
```text
Delete with package (Recommended)
Keep them
```

Answer:
```text
Delete with package (Recommended)
```

### Q008
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_015kyAuKG2EKvCFVx9iX3Ca1:2 -->

Question:
```text
Existing advisor databases on users' machines still hold the vector tables and the old embedding columns. How are they cleaned?
```

Options:
```text
Discard and rescan (Recommended)
Drop tables in place
```

Answer:
```text
Discard and rescan (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
