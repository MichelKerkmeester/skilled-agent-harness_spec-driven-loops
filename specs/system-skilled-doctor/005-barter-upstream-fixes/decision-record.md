---
title: "Decision Record: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-barter-upstream-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/005-barter-upstream-fixes"
    last_updated_at: "2026-11-18T16:32:38.141Z"
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
# Decision Record: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Run the live register_manual check for clickup_official, mobbin and refero now, so AC-007 can close. | Not stated. | None | AC-007, REQ-001, acceptance-criteria.md |
| Q002 | Create .github/workflows/pi-entry-checks.yml through the doctor:ci scaffold route. | Not stated. | None | REQ-011, AC-013, .github/workflows/pi-entry-checks.yml |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:03b1b996-30d7-4175-994a-d90c49d7402d:toolu_01Kch1dg3Apb3RKirR7CqmEH:0 -->

Question:
```text
AC-007's last half: on Ready, I call Code Mode's register_manual in this session for clickup_official, mobbin and refero, one at a time. Each one either connects silently from a cached token or opens a sign-in tab in your browser, which you approve within about a minute. If you choose later, the packet stays open on AC-007.
```

Options:
```text
Ready (Recommended)
Later
```

Answer:
```text
Ready (Recommended)
```

### Q002
<!-- source: claude:03b1b996-30d7-4175-994a-d90c49d7402d:toolu_01Kch1dg3Apb3RKirR7CqmEH:1 -->

Question:
```text
/doctor:ci scaffold asks before it creates a workflow. Create .github/workflows/pi-entry-checks.yml? It runs on any push or pull request touching .pi/, tsconfig.pi.json, the hooks or a Pi adapter. It provisions the trees, runs the spec-kit tsc on tsconfig.pi.json and runs hook-wiring-check. It sits under the SKILLED_CI_TESTS switch, with a 10 minute timeout and read-only permissions. On a clean clone both commands exit 0 after provisioning, and without provisioning the wiring check exits 1 naming the missing build. Undo: delete the file.
```

Options:
```text
Create it (Recommended)
Don't create
```

Answer:
```text
Create it (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
