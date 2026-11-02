---
title: "Decision Record: Phase 6: doctor-update-local-state"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-doctor-update-local-state operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/006-doctor-update-local-state"
    last_updated_at: "2026-11-02T12:33:06.265Z"
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
# Decision Record: Phase 6: doctor-update-local-state

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Move the /doctor:update state under the doctor command; replaced by the all-local layout when the follow-up question was rejected. | Not stated. | None | spec.md (Out of Scope) |
| Q002 | Mirror the change into Barter by committing in Skilled first and then re-pinning Barter's skilled/ to that commit. | Barter's skilled/ is a pinned copy of Skilled, so a re-pin is the only path that keeps it exact. | None | T010, T011 |
| Q003 | Keep all /doctor:update state local and uncommitted under .skilled/skills/.state/doctor-update/, so no .skilled/release/ folder ships. | Not stated. | Q001 | REQ-001, REQ-005, spec.md (Purpose) |
| Q004 | Fold the work since the tag into the existing v4.0.1.0 release rather than cutting v4.0.1.9. | No v4.0.1.9 existed, and an earlier commit had already folded later work into v4.0.1.0. | None | .skilled/changelog/skilled/v4.0.1.0.md |
| Q005 | Move the v4.0.1.0 tag now, covering only what is on origin/main; the decision-capture and playbook sessions' unfinished work goes into the next release. | Not stated. | None | .skilled/changelog/skilled/v4.0.1.0.md |
| Q006 | Delete and recreate the v4.0.1.0 tag and GitHub release so the release is dated 2026-11-02, with the old tag and release body backed up first. | A GitHub release's date cannot be edited. | None | .skilled/changelog/skilled/v4.0.1.0.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01BEe4mLzecr5kJ4AcPsjKGW:1 -->

Question:
```text
How should .skilled/release stop bloating .skilled? Today Skilled ships the folder with only a .gitignore in it; /doctor:update writes base.json and divergence.json (meant to be committed) plus runs/ and a lock (local) there.
```

Options:
```text
Create on demand (Recommended)
Move under doctor command
Move into the playbook folder
```

Answer:
```text
Move under doctor command
```

### Q002
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01BEe4mLzecr5kJ4AcPsjKGW:2 -->

Question:
```text
Mirroring into Barter: its skilled/ is a pinned copy of Skilled. How should the change reach it?
```

Options:
```text
Copy the changed files (Recommended)
Commit Skilled, then re-pin
```

Answer:
```text
Commit Skilled, then re-pin
```

### Q003
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01GUeWwkKBExdh5d7JW9D9hc:0 -->

Question:
```text
Which layout should replace the always-present .skilled/release folder? Background: /doctor:update keeps two small records a repo is meant to commit (base.json, divergence.json) and local run state (runs/ with .md evidence, plus a lock). Skilled itself and Barter have never run it, so today the folder only holds a .gitignore.
```

Options:
```text
Create on demand (Recommended)
One file, no folder
All local, nothing committed
Split under doctor
```

Answer:
```text
All local, nothing committed
```

### Q004
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01QFGCkXhUobLT2c9onyRLdT:0 -->

Question:
```text
There is no v4.0.1.9 tag, release or changelog. The latest is v4.0.1.0 (tagged 2026-10-30, 47 commits behind main), and an earlier commit already folded later work into its notes. Is v4.0.1.0 the release you mean?
```

Options:
```text
Yes, v4.0.1.0 (Recommended)
New v4.0.1.9
```

Answer:
```text
Yes, v4.0.1.0 (Recommended)
```

### Q005
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01QFGCkXhUobLT2c9onyRLdT:1 -->

Question:
```text
The decision-capture (043) and conversation-playbook (065) sessions still have uncommitted code and changelog edits in your main checkout (system-spec-kit v2.12.28.0.md, sk-create-manual-testing-playbook v1.0.9.0/v1.1.0.0). A tag made now leaves their unfinished work out. When should the tag move?
```

Options:
```text
Now, origin/main only (Recommended)
Wait for both sessions
```

Answer:
```text
Now, origin/main only (Recommended)
```

### Q006
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01QFGCkXhUobLT2c9onyRLdT:2 -->

Question:
```text
To date the release today I must delete and recreate both the remote tag v4.0.1.0 and its GitHub release (a release's date can't be edited). The old tag (fd0fd4ae58 → commit 642e3c679e) and release name/body are backed up in the scratchpad, so the undo is to recreate them from that backup. Go ahead with the delete and recreate once the notes are pushed?
```

Options:
```text
Yes, delete and recreate (Recommended)
Notes only, no re-tag
```

Answer:
```text
Yes, delete and recreate (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
