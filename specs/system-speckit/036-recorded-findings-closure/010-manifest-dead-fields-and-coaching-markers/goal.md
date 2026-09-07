---
title: "Goal: Manifest Dead Fields And Coaching Markers"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "manifest dead fields goal"
  - "scaffold coaching marker removal"
  - "creation trigger field cleanup"
  - "extension guide truthful description"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/010-manifest-dead-fields-and-coaching-markers"
    last_updated_at: "2026-09-07T17:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-010-manifest-dead-fields-and-coaching-markers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Manifest Dead Fields And Coaching Markers

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the two unread creationTrigger and absenceBehavior fields from every documents[] entry in spec-kit-docs.json and the two unread SCAFFOLD_VALIDATION_COUNTS and SCAFFOLD_AI_PROTOCOL_MARKERS blocks create.sh appends, then update EXTENSION-GUIDE.md and README.md so they describe the manifest as it now is.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Removal is the disposition for both dead fields and both dead markers, not wiring a reader, since no rationale in the source findings suggests a reader is worth building |
| D2 | 035 child 010's D1 (the levels rows are the manifest's authority, the documents index is descriptive) is acted on here, not reopened |
| D3 | The manifest edit and the create.sh edit land in the same commit, so no half-migrated state ships where one is edited and not the other |
| D4 | EXTENSION-GUIDE.md's maintainer checklist is edited in the same change as the field removal, so a future maintainer is never instructed to re-add a dead field |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] creationTrigger and absenceBehavior are absent from all 16 documents[] entries in spec-kit-docs.json
- [ ] The SCAFFOLD_VALIDATION_COUNTS and SCAFFOLD_AI_PROTOCOL_MARKERS blocks are absent from create.sh
- [ ] EXTENSION-GUIDE.md no longer instructs a maintainer to set either removed field
- [ ] scaffold-golden-snapshots.vitest.ts, template-version-parity.vitest.ts and level-contract-resolver.vitest.ts all pass
- [ ] A repo-wide grep for the four removed names returns no hit outside git history
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet opened | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md and this goal.md authored from the F2-08 and f-iter002-003 census and the current spec-kit-docs.json/create.sh content |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
