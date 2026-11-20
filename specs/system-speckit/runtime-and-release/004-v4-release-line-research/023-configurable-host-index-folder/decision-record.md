---
title: "Decision Record: Let a host repository name its trigger index folder"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "023-configurable-host-index-folder operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/023-configurable-host-index-folder"
    last_updated_at: "2026-11-19T17:37:46.907Z"
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
# Decision Record: Let a host repository name its trigger index folder

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The alignment scope (18 uncommitted files in worktree 334, base HEAD) is approved. | Not stated. | none | specs/system-speckit/runtime-and-release/004-v4-release-line-research/023-configurable-host-index-folder/spec.md |
| Q002 | cli-codex runs the review lanes and cli-devin runs the critic. | Not stated. | none | specs/system-speckit/runtime-and-release/004-v4-release-line-research/023-configurable-host-index-folder/spec.md |
| Q003 | The host index folder change is re-reviewed now, with no fixes in this run. | Not stated. | none | specs/system-speckit/runtime-and-release/004-v4-release-line-research/023-configurable-host-index-folder/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:8d64c1d1-1bb1-44ed-ae33-ef2ec628f5fc:toolu_01Vid1kSXMi3YJeu5nQ5R68E:0 -->

Question:
```text
Alignment scope
Target: HEAD (branch) in worktree 334, with --base HEAD so the scope is only the uncommitted work
Commits: 0. Files: 18 (all 18 uncommitted or untracked)

Surfaces that fire: S1 code (4 files), S2 skill docs (3), S3 feature catalog (7), S4 playbooks (7), S5 READMEs (8), S6 changelogs (8), S9 commands (1), S11 runtime mirrors (1), S13 env docs (4), S14 spec packets (9), S15 CI parity. Quiet: S7, S8, S10, S12.
Battery rows planned: 53

Approve this scope?
```

Options:
```text
Approve
Cancel
```

Answer:
```text
Approve
```

### Q002
<!-- source: claude:8d64c1d1-1bb1-44ed-ae33-ef2ec628f5fc:toolu_01Vid1kSXMi3YJeu5nQ5R68E:1 -->

Question:
```text
The workflow's lane runner (run-lanes.cjs) supports only cli-pi, cli-opencode and cli-codex executors. It cannot run cli-devin. How should the two executors you named be used?
```

Options:
```text
Codex lanes, Devin critic (Recommended)
Both run every lane
Codex lanes, opencode critic
```

Answer:
```text
Codex lanes, Devin critic (Recommended)
```

### Q003
<!-- source: claude:8d64c1d1-1bb1-44ed-ae33-ef2ec628f5fc:toolu_01LYJNTTFe79BVjQVNRTRGQQ:0 -->

Question:
```text
"Re review" can mean two things for the host index folder change in worktree 334. Which do you want?
```

Options:
```text
Fix, then re-review (Recommended)
Re-review now, no fixes
Fix, then recheck only
```

Answer:
```text
Re-review now, no fixes
```

<!-- /ANCHOR:operator-answers-verbatim -->
