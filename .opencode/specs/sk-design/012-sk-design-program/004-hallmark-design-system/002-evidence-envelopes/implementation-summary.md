---
title: "Implementation Summary: Shared Evidence Envelopes"
description: "Implementation record for the owned-asset manifest, motionCharacter handoff, and conditional measured Motion section."
trigger_phrases:
  - "owned asset manifest"
  - "motion character handoff"
  - "evidence envelopes implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes"
    last_updated_at: "2026-07-22T18:24:07Z"

    last_updated_by: "implementation-agent"
    recent_action: "Implemented and verified the shared evidence envelopes"
    next_safe_action: "None; packet implementation and verification are complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md"
      - ".opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md"
      - ".opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-summary-session"
      parent_session_id: null
    completion_pct: 100
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
| **Status** | Complete |
| **Level** | 2 |
| **Parent Packet** | `012-sk-design-program/004-hallmark-design-system` |
| **Phase** | 2 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 2 delivered three shared evidence envelopes. The owned-asset manifest is provider-neutral, records source/rights/dimensions/role/crop/aspect/checksum/fallback evidence, and prohibits hotlinking or bundling Hallmark and other unverified third-party binaries. The `motionCharacter` handoff maps `quiet`, `snappy`, `elastic`, and `static-first` onto the existing Motion timing/easing bands while requiring interruption, reversal, async rollback, and reduced-motion proof. The v3 generator now emits a deterministic measured Motion section only when the existing detector supplies a non-empty `durationScale`; validation rejects altered measured values and sections without detector evidence.

### Files Created / Changed

| File or Group | Action | Purpose |
|---|---|---|
| `.opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md` | Created | Provider-neutral asset evidence, validation, provenance, and never-hotlink contract |
| `.opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md` | Created | Semantic enum, existing-band mapping, interruption/reversal/async proof, and authority boundary |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts` | Modified | Added the conditional `motion` section/emitter and hard validation policies |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts` | Modified | Added measured duration, timing-function, keyframe, and section types without changing the detector |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts` | Modified | Added deterministic measured Motion rendering with safe Markdown cells |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts` | Existing path consumed | Schema-driven pre-rendering now includes Motion automatically when detector evidence is active |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts` | Modified | Rejects altered measured Motion output and any Motion section without detector evidence |
| `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md` | Modified | Added numbered conditional Motion section and presence rule |
| Generator tests | Modified | Added schema, formatter, prompt, and validator coverage; suite grew from 167 to 171 passing tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation first verified the stale citations against live code and confirmed Phase 1 completion. It read only the two research syntheses for Hallmark grounding; the unavailable raw clone was not consulted. The Motion section was added as a deterministic schema emitter, so `build-write-prompt.ts` receives it through the existing locked pre-rendered path without a new phrase trigger or parallel formatter. `validate.ts` uses the same schema capability and compares the rendered section with the measured projection, keeping the detector and corpus behavior unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| `motionCharacter` maps onto existing timing/easing bands rather than introducing new tokens | Preserves Motion's existing 100-150/200-300/300-500/500-800ms bands and easing/material authority instead of creating multipliers or theme tokens. |
| Owned-asset manifest is provider-neutral, not Hallmark-specific | Keeps the contract reusable beyond the Hallmark adoption context and avoids coupling sk-design's asset model to one third-party skill. |
| Manifest never references Hallmark (or other third-party) binaries directly | Hallmark ships a manifest, not binaries; this packet mirrors that discipline and adds a hard never-hotlink constraint. |
| Conditional Motion section is detector-evidence-driven, not phrase-triggered | Matches both research syntheses' highest-confidence finding that the `MotionSystem` detector already exists — the gap is output wiring, not detection logic. |
| Clean-room adaptation preferred over verbatim reuse of Hallmark text | Hallmark is MIT-licensed (`external/hallmark/LICENSE`); the manifest schema is clean-room and provider-neutral; a Hallmark MIT notice is added only if text is substantially copied. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|---|---|---|
| Wiring-point verification | Pass | Motion capability at `schema-v3.ts:146`, durationScale gate at line 490, `MotionSystem` at `types.ts:260` before edits; no prior Motion format section |
| TypeScript build | Pass | `npm run build`: `tsc -p tsconfig.build.json`, exit 0 |
| Focused generator tests | Pass | 4 files passed, 36 tests passed after initial wiring |
| Full generator tests | Pass | 19 files passed, 171 tests passed; baseline was 19 files and 167 tests |
| Conditional Motion behavior | Pass | Evidence-present emission and exact-value validation; phrase-only omission and unexpected-section rejection |
| Contract and licensing review | Pass | Provider-neutral manifest, no new motion tokens, independent wording, no raw clone access or substantial copied expression |
| Strict packet validation | Pass | Exit 0; `Summary: Errors: 0 Warnings: 0`; `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Requirement | Actual | Status |
|---|---|---|
| No new motion tokens introduced | Semantic values reference existing bands and easing/material rules only | Pass |
| Manifest never hotlinks/bundles third-party binaries | Explicit hard prohibition plus owner-controlled-source validation | Pass |
| Conditional section adds no unconditional new output | Existing `durationScale.length > 0` capability gate controls schema, prompt, formatter, and validator | Pass |
| No new network/execution surface from manifest fields | Contract is evidence-only and prohibits auto-fetch or execution | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The measured Motion section reports captured duration bands, timing functions, keyframes, and reduced-motion-query presence. It intentionally does not infer semantic `motionCharacter`.
- Verification covers TypeScript compilation and the package's unit/integration-style Vitest suite. It does not run a live Playwright extraction against an external site.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

No scope deviation. Package dependencies were absent in the isolated worktree, so the checked-in lockfile was restored with `npm ci --ignore-scripts` before capturing the green baseline; no package manifest or lockfile content was changed.
<!-- /ANCHOR:deviations -->
