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
| Q003 | Barter item 6 is decided by the goal of best UX and the easiest out-of-the-box install. | Not stated. | none | specs/system-skilled-doctor/005-barter-upstream-fixes/spec.md |
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

### Q003
<!-- source: claude:ad877c77-8e90-4f3c-a6e3-9273cfd24365:toolu_016RSKYqQJSAJg9GP6K8zVUQ:0 -->

Question:
```text
Barter's item 6 asks Pi extension entries to catch a failed adapter load and print one line instead of a stack trace. A fail-soft entry would not have helped their incident. In a linked project .pi is linked whole from the Skilled checkout, and in a vendored tree entries and adapters ship together, so a stale tree has stale entries too. Item 5, now ported and proven (21 broken entries on Skilled's own old symlink tree, 22/22 ok today), already names the fix. What should Skilled do for item 6?
```

Options:
```text
Decline (Recommended)
Fail-soft adapters
Fail-soft entries
```

Answer:
```text
we want best UX, easiest install out of box
```

<!-- /ANCHOR:operator-answers-verbatim -->
