---
title: "Goal: Research recommendations"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Research recommendations

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build, verify and ship all 16 research recommendations to main through parallel CLI lanes, each phase meeting its own goal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Builders and reviewers: DeepSeek V4.1 Flash max through cli-pi on `opencode-go`, `llmgateway` and `cline-pass`, and cli-devin, plus Luna max fast through cli-codex |
| D2 | W1 001 002 004 005 008 014 and W2 006 007 010 016 shipped in order. The rest run as parallel lanes that never write one file at once. Lane A, upgrade-legacy: 011, 012, 015, then 009's function. Lane B, the healer: 015's modes, then 003's comment. Lanes C to E: 013, 009's doctor files, 003's test |
| D3 | A DeepSeek brief carries one task. Every brief opens with the child-dispatch preamble and an inline persona, and ends with its allowed write set |
| D4 | A fresh DeepSeek on the other route reviews each phase read-only, and a fresh Opus high gives the final review. A finding is applied only once confirmed in the code, for at most two rounds |
| D5 | This session only orchestrates. Haiku 5.5 xhigh workers run gates and closeouts and save raw command output to files. Only that output is evidence, never a worker's summary |
| D6 | Each phase commits only its own files. Phases sharing a file ship as one commit naming each part. A closed phase pushes to main as a fast-forward, and CI must pass before the next push |
| D7 | A failing route switches to the other route. Three failed fixes on one symptom park that phase with its blocker logged. Phases that do not depend on it continue |
| D8 | Nesting in the anchor check ships as a warning after 001 and becomes an error only after 011 has un-nested the corpus |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| SH-01 | `001-spec-template-anchor-nesting/goal.md` |
| SH-02 | `002-phase-scaffold-graph-metadata/goal.md` |
| SH-03 | `003-archive-path-follow-ups/goal.md` |
| SH-04 | `004-trigger-index-rebuild-hardening/goal.md` |
| SH-05 | `005-healer-phrase-seeding/goal.md` |
| SH-06 | `006-evidence-gated-provenance/goal.md` |
| SH-07 | `007-ci-rule-set-comparison/goal.md` |
| SH-09 | `008-legacy-era-report/goal.md` |
| SH-08 | `009-doctor-update-compatibility/goal.md` |
| SH-10 | `010-upgrade-reversibility/goal.md` |
| SH-11 | `011-anchor-repair-mode/goal.md` |
| SH-12 | `012-fold-one-off-repairs/goal.md` |
| SH-13 | `013-anchor-contract-alignment/goal.md` |
| SH-14 | `014-gate-3-menu-parity/goal.md` |
| SH-15 | `015-lane-rules-as-heal-modes/goal.md` |
| SH-16 | `016-phrase-cleanup-hardening/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All 16 child spec.md files read Status Complete, and every acceptance row is Met or waived by a decision record
- [ ] `validate.sh` on this packet with `--recursive --strict` prints `RESULT: PASSED`
- [ ] `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` shows no failure beyond the baseline taken before wave 1
- [ ] `check-goal.cjs` exits 0 for this packet and for each of the 16 children
- [ ] CI on the final main commit reports every check as success, except Trigger Index Rebuild's own-commit skip
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
| Parent and 16 children scaffolded | Done | `validate.sh` on the parent printed `RESULT: PASSED` with one warning |
| Child planning docs and goals | Done | Written by Haiku 4.5 agents, reviewed by DeepSeek v4.1 Flash, fixes verified against the code |
| Operator decisions | Done | Ten choices decided on 2026-10-08 after a fresh Opus recommendation, D2 and D4 amended |
| Lane routes smoke-tested | Done | `llmgateway/deepseek-v4.1-flash`, `opencode-go/deepseek-v4.1-flash` and `gpt-6-luna` max fast each replied PONG on 2026-10-08 |
| Test baseline | Done | `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` at `c85ec7f8803` exits 0: vitest 161 files passed, 3 skipped, 1,639 tests passed, 19 skipped, legacy and validation suites all passed |
| Wave 1 build | Done | 001, 002, 004, 005, 008, 014 Complete; 004 closed on a live run of the rebuild workflow. Final gates: CLI test 1,648 passed, 0 failed (baseline 1,639); `check` rc 0; hook tests 0 failed; each phase `validate.sh --strict` PASSED and `check-goal.cjs` 5/5 |
| Wave 1 ship | Done | Pushed to `main` as a fast-forward (`73be1380b6`, `c65147fca3`); the rebuild job lost a staged push race and recovered as `08af7d089e`; CI on `08af7d089e`: 11 workflows success, Trigger Index Rebuild skipped by its own guard |
| Wave 2 build | Done | 006 (opencode-go), 007 (llmgateway), 010 and 016 (Luna) Complete. Final gates after 010's second review round: CLI test 1,685 passed, 0 failed (baseline 1,639); `check` and typecheck rc 0; hook tests 184 run, 0 failed; each phase `validate.sh --strict` PASSED and `check-goal.cjs` 5/5 |
| Wave 2 ship | Done | Pushed as a fast-forward (`3872d55aab`). Spec-Kit Check failed on it: a doctor test pinned 12 hook gates and 016 registered a 13th. Fixed in `3000be113c`; CI on `3000be113c`: 12 workflows success. A dispatched freshness sweep (run 37783711329) loaded the stored baseline live for 007 |
| Wave 3 | Superseded | Luna built 011's repair mode (brief 1). Its second brief was stopped before any write when the operator moved the build to DeepSeek |
| Amendment: DeepSeek only, parallel lanes | On 2026-10-08 the operator said: "Skip luna, use deepseke only max parallization". D1, D2, D4, D6 and D7 were rewritten, and the remaining phases run as lanes. The operator then said: "Use haiku 5.5 xhigh for things you would do yourself", "You do omly orchestration" and "Final review will be done by fresh opus high", so D4 and D5 were rewritten. Later the operator said: "Cli devin also has deepseek so you can spread it through pi opencodw go and devin" and approved Devin's dangerous permission mode for this build, so D1 names cli-devin. Phases 011, 012, 015, 009 and 003 edit the same two files, so D6 lets them ship as one commit. On 2026-10-09 Devin's daily quota ran out and opencode-go stayed capped, and the operator said: "Clime provider", so D1 adds pi's `cline-pass` provider, which a tool-call probe confirmed. The operator then said: "Continue with luna max fast cli codex and deepseek flash 41 max clinpi cline provider", so D1 brings Luna back through cli-codex |
| Lanes build | Done | 003, 009, 011, 012, 013 and 015 are built, reviewed and Complete, and the corpus is un-nested (4,642 packets, zero nested), so nesting is now an error. The final gate is tree5, with CLI test 1,775 passed and 0 failed (baseline 1,639) and root-test rc 0, and the reviews ran on DeepSeek or Luna per phase, a fresh Opus high final review, and an Opus sk-code-opencode and overengineering review whose 8 P2 fixes are all applied. |
| Lanes ship | Done | Pushed to main in two runs ending at 6eaad63719. CI on 6eaad63719 is 11 of 11 success, after 2a45fe1b7c built the spec-kit runtime before the doctor suites. The final gates rerun on 2026-10-09 gave validate --recursive --strict RESULT: PASSED for all 17 folders, check-goal 17 of 17, all 16 children Complete and every acceptance row Met. The bot's index commit 4d16754ad3 shows Trigger Index Rebuild as skipped, which its workflow does on its own commits by design. |
| Amendment: criterion 5 | Done | On 2026-10-09 the operator chose "Allow the designed skip". Every authored commit changes the trigger index, so the rebuild pushes a bot commit, and the rebuild run on that commit always skips. Criterion 5 now accepts that one skip. Main at d933985159 shows 11 checks success and the designed skip, and the authored commit 231201b32a shows all 10 of its runs success. |

### Deviations and findings

| Item | Note |
|------|------|
| Route failure | 005's last brief hit an llmgateway API error ("reasoning_content in thinking mode must be passed back"); it reran on opencode-go per D7 |
| Orchestrator-found defect | 005's relative `.mjs` import broke the compiled `dist/` build; fixed with a declaration file and a package export, the existing pattern for `repo-root.mjs` |
| Review-driven fixes | 001 one P1, 004 four (round 2 clean), 005 one P1, 008 one P0 and two P2, 014 one P1; 002's two P2 not applied, reasons in its summary |
| Follow-ups outside wave 1 | Three Gate 3 menu copies outside 014's frozen list lack "in the same track" (`speckit-implement.yaml:52`, `worked-examples.md:60`, `trigger-config.md:134`); `scaffold-debug-delegation.sh` writes single-token trigger phrases |
| Wave 2 review fixes | 016 one P0 (packet-type kinds keyed by filename); 010 four findings in each of two rounds; all fixed by their builders |
| Orchestrator code fix | 010's dry-run preview wrote through nested symlinks because `fs.cpSync` keeps them as links; Luna's sandbox masked the failure and review rounds were spent, so the orchestrator added the link materialization itself |
| Gate set widened | The doctor script suites (`run-all.sh`) were not in the orchestrator's local gate set, so the pinned gate count reached main; they now run before every push |
| Scope widened to the build | On 2026-10-08 the operator asked for all 16 phases to be built autonomously, so the objective, decisions and criteria now cover the build. The planning record stays in the progress rows |
<!-- /ANCHOR:log -->
