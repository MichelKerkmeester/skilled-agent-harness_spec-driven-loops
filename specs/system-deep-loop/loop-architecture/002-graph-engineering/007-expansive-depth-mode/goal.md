---
title: "Goal: Expansive-depth sub-mode for deep-research and deep-review"
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
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode"
    last_updated_at: "2026-11-17T20:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Amended D2 and the objective: flag-scoped, per operator decision"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-17-expansive-depth-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Expansive-depth sub-mode for deep-research and deep-review

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Ship the completed-run extension, the defect fixes and an opt-in expansive-depth sub-mode for deep-research and deep-review, documented and aligned, while default runs change only through the named defect fixes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Build order: 001 merges first; 005 before 004; 012 before 010 and 011; 010 after 004-007; 011 after 003, 004 and 008-010; 014 last. |
| D2 | `--depth-mode=expansive` is opt-in: without the flag it adds nothing to a run. Default runs change only where a phase's spec names the defect fix, and each such change carries a test. |
| D3 | No new mode-registry entry, no change to the gateway upcast beyond phase 006's accepted decision, and `wave_orchestration` stays reference-only. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-completed-run-extension | `001-completed-run-extension/goal.md` |
| 002-research-claude-config-dir | `002-research-claude-config-dir/goal.md` |
| 003-review-min-iterations-floor | `003-review-min-iterations-floor/goal.md` |
| 004-focus-hijack-fix | `004-focus-hijack-fix/goal.md` |
| 005-prompt-pack-contract-alignment | `005-prompt-pack-contract-alignment/goal.md` |
| 006-state-log-leaf-fields | `006-state-log-leaf-fields/goal.md` |
| 007-source-diversity-quality-class | `007-source-diversity-quality-class/goal.md` |
| 008-review-dimension-coverage | `008-review-dimension-coverage/goal.md` |
| 009-fanout-review-coverage-merge | `009-fanout-review-coverage-merge/goal.md` |
| 010-research-frontier-mode | `010-research-frontier-mode/goal.md` |
| 011-review-frontier-mode | `011-review-frontier-mode/goal.md` |
| 012-pivot-hygiene | `012-pivot-hygiene/goal.md` |
| 013-no-redispatch-landed-iteration | `013-no-redispatch-landed-iteration/goal.md` |
| 014-docs-playbooks-alignment | `014-docs-playbooks-alignment/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -c '^- \[ \]' 0*/goal.md` run in this folder prints nothing, so every completion criterion in all 14 phase goals is checked.
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` prints `RESULT: PASSED` for this folder and for each of its 14 phase folders.
- [ ] `rg -c '\| Unmet \|' 0*/acceptance-criteria.md` run in this folder prints nothing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict --recursive` prints `RESULT: PASSED` for all 15 folders.
- [ ] After phase 014 lands, `npx vitest run` in `.skilled/skills/system-deep-loop/runtime` prints no failure that is absent from the runtime suite baseline in this goal's log.
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
| Research (generations 1 and 2) | Done | `research/research.md` is the canonical synthesis |
| Phase goals 001-014 authored | Done | 2026-11-17, one `goal.md` per phase folder, bound above |
| Runtime suite baseline | Done | 2026-11-17 on `main` at `c9d8ff4` (dirty only outside `system-deep-loop`): `npx vitest run` in `.skilled/skills/system-deep-loop/runtime` exit 0, 185 files passed, 3095 tests passed, 9 skipped, **0 failed**. So any failure after a phase is new. `check-ledger-stem-producers.cjs`, `check-projection-coverage.cjs` and `check-contract-drift.cjs` exit 0. The three `system-spec-kit` suites 001 names (`deep-review-contract-parity`, `deep-review-reducer-schema`, `deep-review-auto-restart-contract`) pass 17 of 17. Copy in `001-completed-run-extension/scratch/baseline.txt` |
| Step-0 probes | Done | 2026-11-17, one-turn reply-only probes, model pinned, stdin closed. Pi `llmgateway/deepseek-v4.1-flash-1017 --thinking max`: `OK` in 5 s. OpenCode 2.3.0 `opencode-go/deepseek-v4.1-flash#max`: `OK` in 11 s, no 429. Vibe 3.1.2 `deepseek-flash`: `OK` in 3 s, `export.json` `0`/`finished`. OpenCode `probe-worktree-confinement.cjs --root-line --set-pwd`: exit 0, 5 tool paths, 0 outside |
| Implementation | Pending | No phase started |

### Deviations and findings

| Item | Note |
|------|------|
| Parent scope text | Resolved 2026-11-17: `spec.md` §3 now puts the build of phases 001-014 in scope. The generated findings block in `spec.md` still shows pre-decision text until the next deep-research synthesis rewrites it from `research/research.md`. |
| D1 amendment 2026-11-17 | Build order changed per the plan review's X-4: 005 before 004, 012 before 010 and 011, 003 and 004 before 011. Operator decision: 001 merges first, and each phase writes its own playbook scenarios. Resend the chat slice. |
| D2 conflict | Resolved 2026-11-17. D2 and the objective said default runs behave as before, while phases 003-008 change default-path behavior on purpose as defect fixes. The operator chose "Flag-scoped", recorded in the D2 amendment row below. |
| D2 amendment 2026-11-17 | Operator decision "Flag-scoped": D2 now scopes the opt-in guarantee to `--depth-mode=expansive`, and default runs change only where a phase's spec names the defect fix, each with a test. The objective's closing clause changed to match. Resend the chat slice. |
| Child goal sources | Only 001, 010 and 011 have `acceptance-criteria.md`; the other child goals take their criteria from the REQ table in their `spec.md`. |
| Template order | `create.sh --with-goal` renders the template marker above the title, unlike `goal.md.tmpl`. All 15 goals here follow `goal.md.tmpl`. |
| Vibe write probe 2026-11-17 | A throwaway detached worktree took two file writes (one at its root, one under `specs/`) from a `tmp/` run folder with `--add-dir`, `export.json` `0`/`finished`, both with and without `--auto-approve`. Both exports report `enable_auto_approve: true`, so print mode approves writes without the flag. A run with approval off was never observed. Vibe has no confinement, and Pi's is UNKNOWN, so every dispatch on every lane diffs `git -C <main> status --porcelain` before and after. |
| Packet not committed | The latest packet docs (81 modified, 14 untracked paths) are not in `HEAD`, so a worktree cut from `HEAD` carries stale or missing phase docs. The packet folder needs a commit before the first worktree. |
<!-- /ANCHOR:log -->
