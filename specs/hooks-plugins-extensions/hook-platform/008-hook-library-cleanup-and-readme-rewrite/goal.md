---
title: "Goal: Hook library cleanup, literal names and README rewrite"
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
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite"
    last_updated_at: "2026-11-15T15:27:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-hook-library-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Hook library cleanup, literal names and README rewrite

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A reader of `.skilled/hooks/` finds only live files, can tell from a name which feature a folder or file belongs to and can read any hook README in one pass.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Kill-switch names and concern keys stay as they are, so operator config keeps working. |
| D2 | No phase changes what a hook does when it fires. Amended 2026-11-16 by the operator: phase 6 lets the Codex check run in a worktree, and Pi and DSH show it only on failure. |
| D3 | Historical spec documents and changelogs keep the old paths they were written with. |
| D4 | Phases run in order, and each passes `validate.sh` on its own before the next begins. |
| D5 | The Pi legacy import fallbacks, their Vitest alias and mismatched OpenCode plugin prefixes are reported at close, not fixed. Amended 2026-11-16 by the operator: phases 5 and 6 fix the first two, and the prefixes stay. |
| D6 | Nothing is committed, merged or pushed until the operator asks. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-dead-hook-file-removal | `001-dead-hook-file-removal/goal.md` |
| 002-codex-hook-check-merge | `002-codex-hook-check-merge/goal.md` |
| 003-literal-hook-renames | `003-literal-hook-renames/goal.md` |
| 004-hook-readme-fold-and-rewrite | `004-hook-readme-fold-and-rewrite/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `ls -d` on `git`, `codex-watchdog`, `hook-install`, `dispatch`, `task-dispatch` and `completion` under `.skilled/hooks/` reports all six as missing, and `git ls-files .skilled/hooks/shared/hook-flags.ts` prints nothing
- [ ] `ls -d .skilled/hooks/codex-global-hooks-check` exits 0
- [ ] `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` each print PASS
- [ ] The hook Vitest tree and the OpenCode plugin tests report 0 failed, and the hook `node --test` suites fail only the `hook-stdin-deadline.test.mjs` case that failed before the first edit
- [ ] For every `README.md` under `.skilled/hooks/`, `.skilled/skills/sk-doc/shared/scripts/validate_document.py` prints `VALID` and `hvr_scan.py` reports `hard blockers: 0`
- [ ] `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED` for the parent and all seven children
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Parent goal authored | Done | `/create:goal` phase-parent run on 2026-11-15, four binding rows matched to four folders on disk by name |
| Four child phases | Pending | Each phase's own goal tracks its progress |
| merge origin/main into the worktree branch | done | 1a8ee2e5087; node --test 1888/1888, 105 READMEs pass, recursive strict PASSED; T021 still waits on the operator |
| operator fixed env-secret-guard README; packet closed | done | T021 closed, all four phases Complete, check-gate-inputs PASSED, README.md:1166 fixed |
| phase 6 codex check and advisory fixes | done | installer 20/20, hook node 1892/1892, hook vitest 506/506, spec-kit 1485 and 4075 pass without the alias, recursive strict PASSED |
| phases 5-7 bound; packet now seven phases, all Complete | done | phase 7 closed both deep review runs (gen 2 gates all pass); audit tests 133/133, hook vitest 509/509, hook node 1898/1898 |

### Deviations and findings

| Item | Note |
|------|------|
| No parent acceptance criteria | The phase parent holds only `spec.md`, so the criteria come from its Purpose, Scope, Handoff Criteria and Phase Documentation Map |
| Phases 5, 6 and 7 added after close | The operator chose each fix in a question on 2026-11-16. None of the three has a child goal, so the binding table lists phases 1 to 4 only; each later phase's `spec.md` carries its requirements |
<!-- /ANCHOR:log -->
