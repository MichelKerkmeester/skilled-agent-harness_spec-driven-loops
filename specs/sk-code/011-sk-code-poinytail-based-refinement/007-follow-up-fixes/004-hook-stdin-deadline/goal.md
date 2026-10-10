---
title: "Goal: Phase 4: hook-stdin-deadline"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline"
    last_updated_at: "2026-10-10T05:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-004-hook-stdin-deadline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: hook-stdin-deadline

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the shared CommonJS stdin reader one deadline, so a hook returns within it even when its host never closes stdin, and point the three post-edit adapters at that reader.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The deadline lives in the shared helper, and the three post-edit copies of the reader are deleted rather than patched, so every CommonJS adapter under the hooks tree reads stdin through one function. |
| D2 | The default deadline is 3000 ms, passed as the `timeoutMs` option, and the default applies at every call site. |
| D3 | At the deadline the reader resolves with the bytes read so far and does not reject; a stream error still rejects, as the current loop does. |
| D4 | The ESM sibling at `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` stays unchanged and is a named follow-up. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/shared/hook-adapter-shared.test.cjs` prints `ℹ pass 2` and `ℹ fail 0` and exits 0. In the `never-closed` case, `elapsedMs` is between 2950 and 4500, `text` equals what was written, and the child exits with status 0 and no signal. In the `comes back whole` case, `text` equals the value of `input`.
- [ ] `grep -n "async function readStdin" .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs .skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` prints nothing and exits 1.
- [ ] `node --test .skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .skilled/hooks/shared/hook-flags.test.cjs .skilled/plugins/tests/sk-code-post-edit-quality.test.cjs` prints `ℹ pass 66` and `ℹ fail 0` and exits 0.
- [ ] `grep -n "require(" .skilled/hooks/shared/hook-adapter-shared.cjs` prints nothing and exits 1.
- [ ] `bash .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh` prints `Post-edit adapter parse regression fixture passed` and exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline --strict` prints `RESULT: PASSED`.
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
| Hook-adapter test: never-closed stdin resolves at the deadline and the process exits | Done | `pass 2`, `fail 0`; live Claude adapter with stdin held open exits code 0 at 3032 ms (orchestrator rerun) |
| Hook-adapter test: complete input comes back whole | Done | same suite, pass |
| The three post-edit adapters no longer define a stdin reader | Done | grep prints nothing, exit 1 |
| Four existing hook suites pass with 66 of 66 | Done | `tests 66`, `pass 66`, `fail 0` |
| Shell parse test prints its pass line | Done | `Post-edit adapter parse regression fixture passed` |
| Validator prints RESULT: PASSED | Done | `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| The brief said every caller parses with parseJsonFailOpen | Only the five shared-helper adapters do. The three post-edit adapters parse with JSON.parse inside a try block. They keep that parse, so their bad-input handling is unchanged. |
| The reader covers only the CommonJS adapters under the hooks tree | Fourteen ESM or synchronous readers under .skilled/hooks/ and the readers under system-spec-kit runtime/hooks/ keep the unbounded pattern. They are listed in plan.md section 6 as a follow-up. |
<!-- /ANCHOR:log -->
