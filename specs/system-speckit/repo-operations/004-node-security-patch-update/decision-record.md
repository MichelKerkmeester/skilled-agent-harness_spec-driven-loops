---
title: "Decision Record: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-node-security-patch-update operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/repo-operations/004-node-security-patch-update"
    last_updated_at: "2026-11-19T17:48:54.552Z"
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
# Decision Record: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The Node pins move to the newest release on each line (22.23.4, 24.22.2, 26.13.0). | Not stated. | none | tasks.md T001; implementation-summary.md:115 |
| Q002 | The Skilled change also raises the declared Node minimums (engine floors), not only the .nvmrc pin. | Not stated. | none | spec.md REQ-001 |
| Q003 | All three patched Node versions are installed locally with nvm. | Not stated. | none | tasks.md T002 |
| Q004 | The shell's ~/.local/bin/node link is repointed to nvm Node 26.13.0. | Not stated. | none | tasks.md T002 |
| Q005 | All eight old nvm Node versions (v20.19.5, v22.23.1, v24.9.0, v24.19.0, v25.6.1, v26.5.0, v26.8.2, v26.10.0) are uninstalled. | Not stated. | none | implementation-summary.md:119, :145 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01MhdXrtzASU1EroBtXMHHpj:0 -->

Question:
```text
Which Node versions should the pins move to? The notice names 22.23.4, 24.22.1 and 26.12.1. nodejs.org now also lists 24.22.2 and 26.13.0 as the newest releases on those lines.
```

Options:
```text
Notice versions (Recommended)
Newest per line
```

Answer:
```text
Newest per line
```

### Q002
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01MhdXrtzASU1EroBtXMHHpj:1 -->

Question:
```text
How far should the Skilled change go beyond the .nvmrc?
```

Options:
```text
Pin and CI (Recommended)
Also raise minimums
Pin only
```

Answer:
```text
Also raise minimums
```

### Q003
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01XPPc2HWSLFnBXGbVQ7kVf1:0 -->

Question:
```text
Local Node plan, step 1 (install). With nvm: install 22.23.4, 24.22.2 and 26.13.0. Without a patched Node 24, Code Mode will not start once the raised minimum (24.22.1) lands, because the newest Node 24 here is 24.19.0. Undo: nvm uninstall each of the three. Go ahead?
```

Options:
```text
Yes, install all three
Only 24.22.2
No, I install myself
```

Answer:
```text
Yes, install all three
```

### Q004
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01XPPc2HWSLFnBXGbVQ7kVf1:1 -->

Question:
```text
Step 2 (default node). Your shell's node is ~/.local/bin/node, a link to a separate copy at ~/.hermes/node (v26.8.2, unpatched). Should I repoint that link? Undo: ln -sfn ~/.hermes/node/bin/node ~/.local/bin/node.
```

Options:
```text
Point to nvm 26.13.0
Point to Homebrew
Leave the link
```

Answer:
```text
Point to nvm 26.13.0
```

### Q005
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01S2Sjz1YVn16irrfijMTwxE:0 -->

Question:
```text
Which old nvm Node versions should I delete now? Undo for any of them: nvm install the version again and reinstall its global packages.
```

Options:
```text
All eight
Only the six empty ones
Reinstall globals first
Delete nothing
```

Answer:
```text
All eight
```

<!-- /ANCHOR:operator-answers-verbatim -->
