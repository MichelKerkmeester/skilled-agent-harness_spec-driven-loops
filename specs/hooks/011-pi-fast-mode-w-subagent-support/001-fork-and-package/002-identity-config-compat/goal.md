---
title: "Goal: Identity and Config Compatibility"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/002-identity-config-compat"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-leaf-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Identity and Config Compatibility

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the fork its own package identity and config path while keeping the `{ enabled, targets }` schema, carrying an existing `pi-openai-fast-mode` config forward without data loss, writing state atomically and guarding the payload hook so it never stamps a tier on an unsupported, different-model or already-tiered request.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Project-local config keeps the upstream path selection (`selectConfigPath` unchanged), even when the project file does not exist yet. |
| D2 | The payload hook stays replace-style: it returns a cloned `{ ...payload, service_tier }` or `undefined` and never mutates the payload in place. |
| D3 | The model gate stays config-driven. No hardcoded model regex and no copy of the `pi-gpt-fast-mode` schema. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `src/types.ts` exports `PACKAGE_NAME` set to `pi-fast-mode-w-subagent-support` and a `LEGACY_PACKAGE_NAME` constant, and `package.json` carries the new name
- [x] The test "migrates a legacy user config once and leaves the legacy file untouched" passes
- [x] The tests "preserves an explicit empty target opt-out through load and save" and "falls back to a safe default for malformed config JSON" pass
- [x] `saveConfigToPath` writes through a temporary file followed by a rename
- [x] The tests "does not stamp a different model" and "does not stamp an unsupported model" pass, and a non-record payload returns `undefined`
- [x] `npm run typecheck` exits 0 and `npm test` exits 0 with 57 tests passed across 4 files
- [x] `.pi/settings.json` is unchanged by this phase
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
| Identity constants and package name | Done (2026-08-16) | `tasks.md` T203 |
| Migration, atomic write and malformed fallback | Done | `tasks.md` T204, T205; `implementation-summary.md` Verification rows Migration, Empty-target opt-out, Malformed fallback |
| Payload guards | Done | `tasks.md` T206; `implementation-summary.md` Verification row Payload guards |
| Typecheck and suite | Done | `tasks.md` T207 (tsc exit 0; 57 passed, up from 50) |
| Scope boundary | Done | `tasks.md` T208; `implementation-summary.md` Scope boundary row |

### Deviations and findings

| Item | Note |
|------|------|
| Guard test file | `plan.md` names `tests/payload.test.ts`; the guard cases were added to `tests/payload-status.test.ts` instead (`implementation-summary.md` Known Limitations 2) |
| Torn-write test | `spec.md` scope lists a torn-write recovery test. The recorded evidence shows the temp-plus-rename write (T205) and the malformed-JSON test, but no test named for a torn write |
<!-- /ANCHOR:log -->
