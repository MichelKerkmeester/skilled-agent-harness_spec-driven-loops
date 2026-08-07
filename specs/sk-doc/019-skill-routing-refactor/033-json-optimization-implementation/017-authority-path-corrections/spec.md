---
title: "Feature Specification: Authority Path and Contract Corrections"
description: "Correct the dead create-skill authority paths, bring the skill-root metadata contract doc in line with the deliberate H-required-to-optional reversal the implementation already made, and label or exclude the tracked scratch artifact."
trigger_phrases:
  - "create-skill path does not exist"
  - "skill root metadata contract stale"
  - "command-metadata no longer required"
  - "tracked scratch derived block"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/017-authority-path-corrections"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected dead citations and stale contract"
    next_safe_action: "Proceed to phase 019 or 020"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/017-authority-path-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scratch artifact labelled in place (least-destructive); relocate-or-untrack stays an open operator preference"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Authority Path and Contract Corrections

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Three documentation defects survive scrutiny, and one correction of the record belongs with them.

Several packet documents cite an authority path under a `create-skill` directory that does not exist; the live packet is `sk-create-skill`. The citations are therefore unresolvable for anyone following them. The synthesis claimed these paths sit in skill-root metadata and therefore feed advisor scoring — that claim is wrong. They sit in spec-folder metadata, which is an unrelated schema that happens to share a filename, and a search of skill-root metadata returns no occurrences. The finding is real; its routing consequence is nil, and this phase records that correction rather than repeating the error.

The skill-root metadata contract document still states that command metadata is required for every hub root, while the implementing module treats it as optional. This is not drift in the usual sense: the reversal was deliberate and is documented as such in a sibling packet. The implementation is authority and the document is stale, so the document changes.

Finally, a patched derived block sits tracked in a scratch directory, where a reader can mistake it for a live artifact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — correcting the dead `create-skill` citations across the packet's documents and spec-folder metadata; updating the skill-root metadata contract document to match the implemented optional-command-metadata rule; labelling, relocating or untracking the scratch derived block; and recording the schema-conflation correction so the false routing-consequence claim does not propagate.

Out of scope — anything touching skill-root metadata or the advisor scorer, since this phase has established it has no such reach; the regression and its gates (phases 013 and 014); completion claims (015); metadata regeneration (016).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every dead authority citation resolves | A search for the `create-skill` path across the packet returns no occurrences, and each corrected citation points at a path that exists on disk |
| REQ-002 | The contract document matches the implementation | The document's statements about command-metadata requirement agree with the implementing module, and the change references the packet where the reversal was decided so a reader can see it was deliberate |
| REQ-003 | The scratch artifact cannot be mistaken for live | The patched derived block is labelled in place, relocated, or removed from version control — whichever the operator prefers — such that a reader encountering it cannot take it for current state |
| REQ-004 | The schema-conflation correction is recorded | The packet records that spec-folder metadata and skill-root metadata are unrelated schemas sharing a filename, and that the dead paths had no routing consequence, so the corrected claim is durable rather than living only in a review transcript |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

No `create-skill` citation remains anywhere in the packet and every corrected path resolves on disk; the contract document and the implementing module agree about command metadata, with the deciding packet referenced; the scratch artifact is unmistakable for live state; and the schema-conflation correction is written down where a future reader will find it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | A path correction sweep could rewrite citations inside historical evidence, editing the record of what was true at the time | Corrections apply to live authority citations only; evidence blocks and archived captures keep their original text |
| Risk | Editing the contract document could be mistaken for reversing the rule again | REQ-002 requires the change to reference the packet where the reversal was decided, making the direction of authority explicit |
| Dependency | None. This phase is independent of the other five and can run in parallel | — |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

The scratch artifact was labelled in place with a `scratch/README.md` marking it non-live state — the least-destructive of the three options. Whether to additionally relocate it or remove it from version control remains an operator preference and is deliberately left open; the label makes it unmistakable for live state in the meantime.
<!-- /ANCHOR:questions -->
