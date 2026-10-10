---
title: "Goal: Phase 5: hook-stdin-deadlines"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hook stdin deadlines goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines"
    last_updated_at: "2026-10-10T10:50:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-009-005-hook-stdin-deadlines"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: hook-stdin-deadlines

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make each of the fourteen ESM hook scripts under `.skilled/hooks/` read stdin through the shared 3000 ms deadline reader, so a host that never closes stdin no longer holds a guard and every hook still takes its existing fail-open path.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The existing `readStdin` in `.skilled/hooks/shared/hook-adapter-shared.cjs` is reused through a named import, no second helper file is added, and only that file's header comment changes, not its code. |
| D2 | The default 3000 ms deadline stands at every call site: no hook passes `timeoutMs`, because every wired host timeout is 5 s or more. |
| D3 | Each hook keeps its own `JSON.parse` in its own `try` and its own fail-open exit, so only the way stdin is read changes. The Fable guard becomes `async`, awaits the read inside its existing `try`, and keeps the entry call `main();`. |
| D4 | The readers under `.skilled/skills/system-spec-kit/runtime/hooks/`, including the symlinked Cursor `post-tool-use.mjs` files that point there and that skill's ESM sibling, are another owner's change and are recorded as a follow-up, not touched here. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `rg -n "for await \(const chunk of process\.stdin\)|readFileSync\(0" .skilled/hooks` prints nothing and exits 1, so no script under `.skilled/hooks/` reads stdin without a deadline.
- [ ] From the repository root, `node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs` prints `ℹ tests 18`, `ℹ pass 18` and `ℹ fail 0` and exits 0, which means each of the fourteen hooks, spawned with stdin left open and never written, exits 0 with its fail-open output between 2900 and 8000 ms after spawn, and the three payload tests pass.
- [ ] From the repository root, `F=specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines; B=$(mktemp -d); git archive 00b905bda0 .skilled/hooks | tar -x -C "$B"; node "$F/scratch/probe/compare-inputs.mjs" "$B/.skilled/hooks" "$PWD" && node "$F/scratch/probe/verify-exact-edits.mjs" "$B/.skilled/hooks" .skilled/hooks` prints `diffs=0` and `mismatches=0` and exits 0, so empty, invalid, non-object, null and ignored stdin give the same result as before on all fourteen hooks, including the Fable guard, and no hook changed beyond its reader.
- [ ] From the repository root, `node --test .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.test.mjs .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.test.mjs .skilled/hooks/goal/cursor/goal-cursor.test.mjs .skilled/hooks/goal/devin/goal-devin.test.mjs .opencode/plugins/tests/claude-fable-subagent-guard.test.cjs .skilled/hooks/shared/hook-adapter-shared.test.cjs .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .skilled/hooks/shared/hook-flags.test.cjs && npx --no-install vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs` prints `ℹ pass 78`, `ℹ fail 0` and `Tests  5 passed (5)` and exits 0, so the existing hook suites still pass.
- [ ] From the repository root, `for f in $(rg -l "import \{ readStdin \} from '../../shared/hook-adapter-shared.cjs';" .skilled/hooks --glob '*.mjs') .skilled/hooks/shared/hook-adapter-shared.cjs .skilled/hooks/shared/hook-stdin-deadline.test.mjs; do node --check "$f" || exit 1; done; echo "syntax ok"` prints only `syntax ok`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines --strict` prints `RESULT: PASSED`.
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
| No unbounded stdin reader remains under `.skilled/hooks/` | Done | `rg -n "for await \(const chunk of process\.stdin\)\|readFileSync\(0" .skilled/hooks` printed nothing, exit=1 |
| New deadline test passes 18 of 18 with 14 hook subtests | Done | `node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs` exit=0, `ℹ tests 18`, `ℹ pass 18`, `ℹ fail 0`, 14 passing subtests. Before the hook edits the same file gave `ℹ pass 3`, `ℹ fail 15` |
| Odd-input comparison and exact-edit check both clean | Done | `compare-inputs.mjs` printed `diffs=0`, `verify-exact-edits.mjs` printed `mismatches=0`, both exit 0 |
| Existing hook suites pass 78 node:test and 5 vitest | Done | `ℹ pass 78`, `ℹ fail 0` and `Tests  5 passed (5)`, same as the Phase 1 baselines |
| Syntax check passes on the 16 edited or created JavaScript files | Done | `node --check` loop printed only `syntax ok` |
| Folder validates under `validate.sh --strict` | Done | `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |
| Orchestrator rerun | Done | All six criteria rerun by the orchestrator on 2026-10-10 from the final tree, each passing |

### Deviations and findings

| Item | Note |
|------|------|
| Parent `spec.md` calls the helper a shared ESM helper | This phase reuses the existing CommonJS helper through a named import, as the operator's brief requires. The orchestrator may reword the parent line |
| More unbounded readers exist outside `.skilled/hooks/` | `rg` does not follow symlinks, so `dispatch/cursor/post-tool-use.mjs` and `post-edit-quality/cursor/post-tool-use.mjs` (symlinks into system-spec-kit) still read stdin with `for await`, with 15 matches in total under `.skilled/skills/system-spec-kit/runtime/hooks/`. Recorded as a follow-up in `plan.md` section 6 |
| Contracts read before the first edit | Code: `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`, `references/javascript/style-guide.md`, `references/javascript/quality-standards/overview-modules-and-docs.md` and `assets/checklists/javascript-checklist.md` (module header, `.mjs` needs no strict directive, `*.test.mjs` naming). Markdown: `.skilled/skills/sk-doc/SKILL.md` and `.skilled/skills/sk-doc/sk-create-readme/SKILL.md`. Neither contract asks for a version bump or a changelog entry for `.skilled/hooks/`, which is not a skill packet and carries no version field |
| The REQ-008 search is not empty | `rg -n "timeoutMs" .skilled/hooks --glob '*.mjs'` prints one line, `classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:160`, where a classifier request carries its own `timeoutMs`. The file is tracked, unmodified and identical in `scratch/before/`, so the planned expectation of empty output exits 0 instead of 1. No hook passes `timeoutMs` to `readStdin`: `rg -n "readStdin\([^)]" .skilled/hooks --glob '*.mjs'` printed nothing and exited 1, and `readStdin(` appears on 14 lines outside the test, one per hook. The check needs a narrower pattern, left for the orchestrator |
| `check-placeholders.sh` reports 3 matches | All three are `[REPO_ROOT]` at `plan.md` lines 326, 335 and 346: the array literals `workspace_roots: [REPO_ROOT]` in the test file that `plan.md` quotes verbatim. The tasks expected `PASS`. `plan.md` is outside the builder's write scope, so it was not changed. `validate.sh --strict` is unaffected |
| Baseline moved to git 2026-10-10 | The orchestrator reran criterion 3 against `scratch/before/` (diffs=0, mismatches=0), then against `.skilled/hooks` extracted from commit 00b905bda0, the last commit before this change (same result; the shared files are byte-identical). The 73-file copy of the old hooks left the folder before the commit, and criterion 3 now builds its baseline from git |
<!-- /ANCHOR:log -->
