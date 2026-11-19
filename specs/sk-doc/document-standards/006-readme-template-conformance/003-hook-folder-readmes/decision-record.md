---
title: "Decision Record: Phase 3: hook-folder-readmes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "003-hook-folder-readmes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes"
    last_updated_at: "2026-11-19T17:37:01.750Z"
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
# Decision Record: Phase 3: hook-folder-readmes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | A switched worker is authorized to fix the 14 confirmed env-secret-guard README errors. | Not stated. | none | specs/sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes/spec.md |
| Q002 | Another switched worker adds expected results to the env-secret-guard README VALIDATION block for AC-007. | Not stated. | none | specs/sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:c2acc245-beab-494e-a0b1-b175e8447b75:toolu_01R9uV61iVhh9WezpLjzHU8w:0 -->

Question:
```text
The env-secret-guard README has 14 confirmed factual errors (15 replacement pairs: wrong Vibe matcher list, a deleted .cursorignore row, a missing vibe/ tree entry, the 40-file discovery limit, exit code 1 meaning, log line contents). The guard refuses agent writes in its own folder (env-secret-guard.cjs:819-820 says a person can). How should the fixes land?
```

Options:
```text
I run it myself (Recommended)
Authorize a switched worker
Leave it unchanged
```

Answer:
```text
Authorize a switched worker
```

### Q002
<!-- source: claude:c2acc245-beab-494e-a0b1-b175e8447b75:toolu_01WE6ZAq6vAXbEu22jREEJ3f:0 -->

Question:
```text
One more env-secret-guard README fix is needed: its VALIDATION block of six commands states no expected result, which phase 003's AC-007 requires. I ran all six: the four suites report fail 0 and both sync checks print PASS. The fix is one inserted sentence. Your earlier yes covered one guard-off session for the first 15 pairs only. How should this one land?
```

Options:
```text
Another switched worker (Recommended)
I run it myself
Leave AC-007 open for it
```

Answer:
```text
Another switched worker (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
