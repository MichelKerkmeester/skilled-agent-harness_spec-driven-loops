---
title: "Goal: Phase 7: spec-kit-hook-deadlines"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines"
    last_updated_at: "2026-10-10T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-010-007-spec-kit-hook-deadlines"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: spec-kit-hook-deadlines

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every stdin reader under `.skilled/skills/system-spec-kit/runtime/hooks/` settle at a 3000 ms deadline through the skill's own shared readers, so a host that never closes stdin no longer holds a spec-kit hook and every hook still gives its existing fail-open answer.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The plain `.mjs` and `.cjs` hooks read through `runtime/hooks/lib/hook-adapter-shared.mjs`, and the compiled TypeScript hooks read through the new `runtime/hooks/shared-stdin.ts`, because the `.mjs` file is not part of the TypeScript build and is absent from `dist/`. Nothing imports the `.skilled/hooks/shared/` reader. |
| D2 | The deadline is 3000 ms for every entry, and the compiled reader keeps each caller's 1 MB byte cap. |
| D3 | The four `.cjs` hooks keep a local `readStdin` that loads the shared reader with `await import('../lib/hook-adapter-shared.mjs')`. |
| D4 | `runtime/hooks/claude/user-prompt-submit.ts` stays unchanged and is recorded as a follow-up, because its suite runs the `.ts` source directly and it cannot import a sibling module. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n "for await \(const chunk of process\.stdin\)|readFileSync\(0" .skilled/skills/system-spec-kit/runtime/hooks --glob '!**/dist/**' --glob '!**/node_modules/**'` prints nothing and exits 1.
- [ ] `cd .skilled/skills/system-spec-kit/runtime && node --check hooks/lib/hook-adapter-shared.mjs && node --check hooks/claude/completion-evidence-stop.cjs && node --check hooks/codex/completion-evidence-stop.cjs && node --check hooks/devin/completion-evidence-stop.cjs && node --check hooks/devin/post-compaction.cjs && node --check hooks/cursor/post-tool-use.mjs && node --check hooks/cursor/spec-gate-prebind.mjs && node --check hooks/cursor/completion-evidence-response.mjs && node --check hooks/devin/permission-request-policy.mjs && npm run typecheck && ../node_modules/.bin/eslint hooks/shared-stdin.ts hooks/claude/shared.ts hooks/codex/shared.ts hooks/cursor/shared.ts hooks/devin/shared.ts hooks/claude/directive-lifecycle-boundary.ts hooks/claude/compact-inject.ts && npm run build && node cli/lib/dist-freshness.cjs check-all` prints `All watched dist outputs are fresh.` and exits 0.
- [ ] `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` prints `ℹ tests 37`, `ℹ pass 37` and `ℹ fail 0` and exits 0.
- [ ] `cd .skilled/skills/system-spec-kit/runtime && npx --no-install vitest run tests/hook-*.vitest.ts tests/hooks-*.vitest.ts tests/user-prompt-submit-shim.vitest.ts tests/directive-lifecycle-*.vitest.ts tests/edge-cases.vitest.ts tests/completion-evidence-sentinel.vitest.ts && node --test tests/hooks/*.test.mjs` prints `Tests  290 passed (290)`, `ℹ pass 181` and `ℹ fail 0` and exits 0.
- [ ] `rg -n "(from |import\(|require\()'[^']*hook-adapter-shared\.cjs'" .skilled/skills/system-spec-kit/runtime/hooks` prints nothing and exits 1.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines --strict` prints `RESULT: PASSED`.
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
| No unbounded reader is left: the reader search prints nothing and exits 1 | Done | Verifier: rg printed no lines, exit=1 (15 matches in the pre-edit copy) |
| Edited files parse, type-check, lint and build, and `dist/` is fresh | Done | Verifier: ten `node --check`, typecheck, eslint and build all exit 0; `All watched dist outputs are fresh.` |
| The deadline test prints `ℹ tests 37`, `ℹ pass 37`, `ℹ fail 0` | Done | Verifier: exit 0, 37/37/0 (before the edits 7 pass, 30 fail) |
| The existing hook suites print `Tests  290 passed (290)` and `ℹ pass 181`, `ℹ fail 0` | Done | Verifier: 16 files and 290 tests passed; node:test 184 tests, 181 pass, 0 fail, 3 skipped, exit 0 |
| No hook imports the `.skilled/hooks` stdin reader | Done | Verifier: rg printed no lines, exit=1 |
| `validate.sh --strict` prints `RESULT: PASSED` | Done | Verifier: Errors 0, `RESULT: PASSED` |
| Exact-edit check and review defects | Done | Four review fixes applied (T066 to T069); `build-units.py verify` reports `files=21 mismatches=2`, naming only the README (FIX-2) and the changelog (FIX-3, FIX-4), both deliberate; all six criteria rerun and passing |

### Contracts read

Verifier read the routing headers of `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`, `.skilled/skills/sk-doc/SKILL.md` and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` for T010.

### Deviations and findings

| Item | Note |
|------|------|
| `claude/user-prompt-submit.ts` | A sixteenth unbounded reader (`readSync(0)` at lines 81-95) that the brief's search does not match. Left for a follow-up, as `plan.md` section 6 explains |
<!-- /ANCHOR:log -->
