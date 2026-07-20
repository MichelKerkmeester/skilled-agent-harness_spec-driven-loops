---
title: "Implementation Summary: Shared Evidence Envelopes"
description: "Forward-looking implementation summary for the owned-asset manifest, motionCharacter handoff, and conditional measured Motion section; planned, not implemented."
trigger_phrases:
  - "owned asset manifest"
  - "motion character handoff"
  - "evidence envelopes implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/016-hallmark-adoption/002-evidence-envelopes"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the forward-looking Phase 2 implementation record"
    next_safe_action: "Await Phase 1 (001-surgical-fixes) completion, then begin Phase 2 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/design-md-format.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-summary-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary: Shared Evidence Envelopes

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-evidence-envelopes |
| **Status** | Planned |
| **Level** | 2 |
| **Parent Packet** | `016-hallmark-adoption` |
| **Phase** | 2 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet; this is a specification-only packet. Phase 2 implementation will create three shared evidence envelope contracts: a provider-neutral owned-asset manifest, a semantic `motionCharacter` handoff mapped onto existing timing/easing bands, and a conditional measured Motion section wired through the v3 DESIGN.md pipeline.

### Files Created / Changed

| File or Group | Action | Purpose |
|---|---|---|
| `.opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md` | Will create | Provider-neutral owned-asset manifest schema |
| `.opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md` | Will create | `motionCharacter` semantic enum + band mapping + proof rules |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts` | Will modify | Add conditional measured Motion section fields (wiring point to verify first) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts` | Will modify | Add Motion section types (wiring point to verify first) |
| `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md` | Will modify | Document the conditional measured Motion section (wiring point to verify first) |
| Formatter/prompt + validator (paths confirmed at implementation) | Will modify | Emit/validate the Motion section only when detector evidence is present |
| Tests under `.opencode/skills/sk-design/design-md-generator/backend/tests/` | Will create/modify | Cover conditional wiring end-to-end |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. This summary documents the planned delivery approach: implementation will follow `tasks.md` T001-T012 in order, beginning with verification of the three cited wiring points against current code, then authoring the two shared contract documents, then wiring the conditional Motion section end-to-end, then adding tests and running strict validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| `motionCharacter` maps onto existing timing/easing bands rather than introducing new tokens | Preserves a single source of truth for motion tokens and avoids a competing duration system, consistent with the existing three-bucket by three-easing substrate. |
| Owned-asset manifest is provider-neutral, not Hallmark-specific | Keeps the contract reusable beyond the Hallmark adoption context and avoids coupling sk-design's asset model to one third-party skill. |
| Manifest never references Hallmark (or other third-party) binaries directly | Hallmark ships a manifest, not binaries; this packet mirrors that discipline and adds a hard never-hotlink constraint. |
| Conditional Motion section is detector-evidence-driven, not phrase-triggered | Matches both research syntheses' highest-confidence finding that the `MotionSystem` detector already exists — the gap is output wiring, not detection logic. |
| Clean-room adaptation preferred over verbatim reuse of Hallmark text | Hallmark is MIT-licensed (`external/hallmark/LICENSE`); the manifest schema is clean-room and provider-neutral; a Hallmark MIT notice is added only if text is substantially copied. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Forward-looking and pending; nothing has been executed yet.

| Gate | Status | Evidence |
|---|---|---|
| Wiring-point verification (schema-v3.ts, types.ts, design-md-format.md) | Pending | Not yet run; planned as task T001 |
| Owned-asset manifest schema review (provider-neutral, never-hotlink) | Pending | Not yet run; planned as task T004 |
| `motionCharacter` band-mapping review (no new tokens) | Pending | Not yet run; planned as task T006 |
| Conditional Motion section tests (evidence present / absent) | Pending | Not yet run; planned as task T010 |
| Strict packet validation | Pending | Not yet run; planned as task T011 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Requirement | Actual | Status |
|---|---|---|
| No new motion tokens introduced | Not yet implemented | Pending |
| Manifest never hotlinks/bundles third-party binaries | Not yet implemented | Pending |
| Conditional section adds no unconditional new output | Not yet implemented | Pending |
| No new network/execution surface from manifest fields | Not yet implemented | Pending |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- This is a specification-only packet; no code, schema, or documentation changes have been made yet.
- The three cited sk-design wiring points (`schema-v3.ts:134`, `types.ts:258`, `design-md-format.md:200`) are unverified against current code as of this writing; the files themselves were confirmed to exist (`design-md-generator/backend/scripts/schema-v3.ts`, `design-md-generator/backend/scripts/types.ts`, `design-md-generator/references/design-md-format.md`), but exact line numbers were not checked.
- Depends on Phase 1 (`001-surgical-fixes`), which contains no authored spec files as of this writing and has not been confirmed complete.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

None yet (not started).
<!-- /ANCHOR:deviations -->
