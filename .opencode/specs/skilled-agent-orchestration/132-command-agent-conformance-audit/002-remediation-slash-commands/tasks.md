---
title: "Tasks: Phase 2: Remediate Slash Commands & Assets"
description: "Task Format: T### [P?] <FINDING-ID>: <one-line fix> (file:line), grouped P0->P1->P2 with a verification task after each fix and a final validate.sh --strict gate."
trigger_phrases:
  - "remediate slash commands tasks"
  - "cmd findings task list"
  - "002-remediation-slash-commands tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/002-remediation-slash-commands"
    last_updated_at: "2026-07-11T06:54:18Z"
    last_updated_by: "markdown-agent"
    recent_action: "Fixed+verified all 12 findings incl XS-04 checker (self-test PASS)"
    next_safe_action: "006 closeout: recompile deep contracts, then skill-graph regen"
    blockers: []
    key_files:
      - ".opencode/commands/create/assets/create_agent_auto.yaml"
      - ".opencode/commands/create/assets/create_agent_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 2: Remediate Slash Commands & Assets

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] <FINDING-ID>: <one-line fix> (file:line)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Re-confirm all 12 findings (CMD-01,02,03,04,06,07,08,09,10,11; XS-02,04) still reproduce on disk via the grep sweep recorded in plan.md §"Required inventories" (baseline only, no edits) — EVIDENCE: baseline sweep re-run 2026-07-11; all 12 confirmed present. NOTE: CMD-02's live sweep found 12 broken files, not 10 (`create_changelog_confirm.yaml`, `create_feature_catalog_auto.yaml` also carry the singular typo) — same defect class, same file family, fixed alongside the cited 10 (see T005 evidence).
- [x] T002 [P] Re-locate current line numbers for CMD-06 (`deep_research_presentation.txt`, `deep_review_presentation.txt`) and CMD-08 (`deep_research_auto.yaml`, `deep_research_confirm.yaml`, `deep_review_auto.yaml`, `deep_review_confirm.yaml`) — research.md citations have drifted; use spec.md §3/§6 current-disk lines, not the bare research.md citation — EVIDENCE: re-grepped 2026-07-11, confirmed spec.md §3/§6 current-disk lines match disk exactly (CMD-06 39/94/157 research; 43/119/196 review; CMD-08 1217/1037/1283/1111).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P0 - Blockers

- [x] T003 CMD-01: add `runtime_agent_path_resolution: { default: .opencode/agents, claude: .claude/agents }` to the top of 6 speckit workflow YAMLs (`speckit_complete_auto.yaml`, `speckit_complete_confirm.yaml`, `speckit_implement_auto.yaml`, `speckit_implement_confirm.yaml`, `speckit_plan_auto.yaml`, `speckit_plan_confirm.yaml`) — independent, no shared files with any other task — EVIDENCE: block added after `role/purpose/action` header in all 6 files; YAML-parse clean (python yaml.safe_load, 0 failures).
- [x] T004 [P] Verify T003: `grep -rl "runtime_agent_path_resolution" .opencode/commands/speckit/assets/speckit_{complete,implement,plan}_{auto,confirm}.yaml` returns all 6 files — EVIDENCE: confirmed, 6/6 files matched.
- [x] T005 CMD-02: change `default: .opencode/agent` -> `default: .opencode/agents` in the 10 create-family files (`create_agent_auto.yaml:45`, `create_agent_confirm.yaml:46`, `create_skill_auto.yaml:48`, `create_skill_confirm.yaml:48`, `create_readme_auto.yaml:83`, `create_readme_confirm.yaml:78`, `create_changelog_auto.yaml:44`, `create_feature_catalog_confirm.yaml:45`, `create_manual_testing_playbook_auto.yaml:45`, `create_manual_testing_playbook_confirm.yaml:45`) — MUST land before T007 (shares `create_agent_{auto,confirm}.yaml`) — EVIDENCE: fixed all 12 files carrying the live pattern (the cited 10 PLUS `create_changelog_confirm.yaml:44` and `create_feature_catalog_auto.yaml:45`, which the current-disk sweep also found broken — same defect class/file family, not opportunistic scope expansion; noted in T001).
- [x] T006 [P] Verify T005: `grep -rl "default: .opencode/agent$" .opencode/commands/create/assets/` returns 0 hits — EVIDENCE: 0 hits (exit 1); plural form confirmed present in all 12 fixed files plus 2 already-correct siblings (`create_skill_parent_{auto,confirm}.yaml`).
- [x] T007 CMD-03: remove the `agent_availability` block targeting `speckit.md` (`create_agent_auto.yaml:301`, `create_agent_confirm.yaml:334`) and rename `created_via_speckit` -> `created_or_updated` (`create_agent_auto.yaml:311-312`, `create_agent_confirm.yaml:344-345`) — after T005 (same 2 files); MUST land before T009 (shares the same 2 files) — EVIDENCE: `agent_availability` block deleted, matching sibling `create_command_auto.yaml:287-300` distributed-governance pattern; output keys renamed. Shared `runtime_agent_path_resolution` block + its 3 live consumers (`agent_path_local`, output-dir interpolation, `context.md` agent_availability) verified untouched.
- [x] T008 [P] Verify T007: `grep -n "runtime_agent_path\]/speckit.md\|created_via_speckit" .opencode/commands/create/assets/create_agent_auto.yaml .opencode/commands/create/assets/create_agent_confirm.yaml` returns 0 hits — EVIDENCE: 0 hits (exit 1).
- [x] T009 CMD-04: change 6 `agent_file: "[runtime_agent_path]/write.md"` sites to `/markdown.md` (`create_readme_confirm.yaml:587,1131`, `create_readme_auto.yaml:603,1055`, `create_agent_confirm.yaml:595`, `create_agent_auto.yaml:523`) — after T007 (shares `create_agent_*`/`create_readme_*` files); MUST land before T019 (shares `create_readme_*` files) — EVIDENCE: all 6 sites now read `[runtime_agent_path]/markdown.md`.
- [x] T010 [P] Verify T009: `grep -rl "runtime_agent_path\]/write.md" .opencode/commands/create/assets/` returns 0 hits — EVIDENCE: 0 hits (exit 1).

### P1 - Required

- [x] T011 [P] CMD-06: normalize the duplicated executor enum and malformed exec text in `deep_research_presentation.txt` (current disk lines 39,94,157) and `deep_review_presentation.txt` (current disk lines 43,119,196); repair `deep_ai-council_presentation.txt:41,105,143-147` (not drifted). Source-only — do NOT touch `deep/assets/compiled/*.contract.md` here (006 closeout) — EVIDENCE: enum de-duplicated (`native \| cli-opencode \| cli-claude-code` / `active-runtime \| cli-opencode \| cli-claude-code`) at all 6 sites; malformed Q-Exec option B (`` ` exec` ``, ai-council's "one external  round") replaced with the correct cli-opencode invocation text moved from the redundant option D/D-equivalent, which was then deleted, leaving 3 clean lettered options (A/B/C) matching the 3-value enum. Reply-format examples re-checked: none reference the deleted letter, so no downstream breakage.
- [x] T012 [P] Verify T011: `grep -n "cli-opencode \| cli-claude-code \| cli-opencode" .opencode/commands/deep/assets/*_presentation.txt` returns 0 hits; `git status .opencode/commands/deep/assets/compiled/` shows no change — EVIDENCE: 0 hits in the 3 scoped files (deep_research/deep_review/deep_ai-council); `git status --porcelain .opencode/commands/deep/assets/compiled/` empty (byte-identical). NOTE: `deep_model-benchmark_presentation.txt` carries the same duplicate-enum pattern but is NOT one of CMD-06's cited files (not `research`/`review`/`ai-council`) — left untouched per SCOPE LOCK, flagged as a new out-of-scope defect for a future finding.
- [x] T013 [P] CMD-07: rewrite the dead `/design:design-mcp-open-design` referral in 5 design commands (`interface.md:52`, `foundations.md:39`, `motion.md:39`, `audit.md:39`, `md-generator.md:39`) to route through the `sk-design` skill's nested transport mode — independent — EVIDENCE: all 5 files reworded to "Prefer the `sk-design` skill's `design-mcp-open-design` transport mode when..." with an explicit "nested mode ... not an independently dispatchable `/design:*` command" clarifier, confirmed against `sk-design/mode-registry.json`'s `design-mcp-open-design` transport entry (`command: null`, mandatory pairing).
- [x] T014 [P] Verify T013: `grep -rn "/design:design-mcp-open-design" .opencode/commands/design/` returns 0 hits — EVIDENCE: 0 hits (exit 1).
- [x] T015 [P] XS-02: remove/generalize the "Barter"/`z — Global (Shared)/` ancestor-detection logic in `agent_router.md:93-98` and replace `WebSearch`/`AskUserQuestion` frontmatter grants with current supported tool names — independent — EVIDENCE: Base Scan Path section rewritten to structural detection (this file's own ancestor, or an ancestor with 2+ AGENTS.md-bearing children) with no hardcoded workspace name; remaining illustrative "Barter"/"Barter - Copywriter" example strings also generalized for full de-coupling. `allowed-tools` frontmatter reduced to `Read, Write, Edit, Glob, Grep, Bash, WebFetch` (removed `WebSearch`/`AskUserQuestion`, which appear in zero other command frontmatter across the repo — confirmed via a 30+ file allowed-tools grep sweep).
- [x] T016 [P] Verify T015: `grep -n "Barter" .opencode/commands/agent_router.md` returns 0 hits (or only generic-fallback prose remains) — EVIDENCE: 0 hits (exit 1) — full de-coupling, no residual Barter references at all.

### P2 - Optional (confirmed, lower severity)

- [x] T017 CMD-08: reword 4 self-invocation-guard sites + 1 executor-note shorthand from "The cli-opencode skill SKILL.md" to "the `cli-external/cli-opencode` mode's SKILL.md (`.opencode/skills/cli-external/cli-opencode/SKILL.md`)" (`deep_research_auto.yaml:1217`, `deep_research_confirm.yaml:1037`, `deep_review_auto.yaml:1283`, `deep_review_confirm.yaml:1111` — current disk lines; research.md cited 1016/765/1073/840) — MUST land before T023 (shares `deep_review_{auto,confirm}.yaml`) — EVIDENCE: all 4 self-invocation-guard sites reworded. Also reworded the mirrored "cli-opencode SKILL.md §4 ALWAYS rule" shorthand note, which is present symmetrically in ALL 4 files (not just the 1 iter-1 site research.md cited) — fixed all 4 for `:auto`/`:confirm` mirror symmetry per NFR-C02.
- [x] T018 [P] Verify T017: `grep -rn "The cli-opencode skill SKILL.md" .opencode/commands/deep/assets/*.yaml` returns 0 hits — EVIDENCE: 0 hits (exit 1); also 0 hits for the broader `cli-opencode SKILL.md` shorthand pattern.
- [x] T019 CMD-09: replace dead `folder_readme.md` reference with `.opencode/commands/create/readme.md` (`create/readme.md:7` confirms live router name; `create_readme_auto.yaml:37`; `create_readme_confirm.yaml:9,40`) and rename `create_agent_verified` -> `create_readme_verified` (`create_readme_presentation.txt:19`) — after T009 (shares `create_readme_*` files) — EVIDENCE: `folder_readme.md` replaced with `.opencode/commands/create/readme.md` at all 3 sites. `create_agent_verified` renamed at all 4 live sites (`create_readme_presentation.txt:19,138`, `create_readme_auto.yaml:148`, `create_readme_confirm.yaml:133` — 3 more than the single cited line, all within `create_readme_*`, matching REQ-009's directory-wide acceptance grep).
- [x] T020 [P] Verify T019: `grep -rl "folder_readme.md" .opencode/commands/create/` returns 0 hits; `grep -rn "create_agent_verified" .opencode/commands/create/assets/create_readme_*` returns 0 hits — EVIDENCE: both 0 hits (exit 1); `create_readme_verified` confirmed consistent across YAML + presentation.
- [x] T021 [P] CMD-10: add the missing parsed flags to `argument-hint` in `deep/research.md:3`, `deep/review.md:3`, `deep/ai-council.md:4` (exact per-command flag lists in spec.md REQ-010) — independent — EVIDENCE: research.md gained `--spec-folder`, `--no-resource-map`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`; review.md gained `--no-resource-map`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`; ai-council.md gained `--executor-mode`, `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout` — all cross-checked against each presentation's PARSE block flag list.
- [x] T022 [P] Verify T021: manual diff of each `argument-hint` against its presentation.txt PARSE block (no automated flag-extractor exists yet — this gap is exactly what T025/XS-04 addresses long-term) — EVIDENCE: manual diff done for all 3 commands (see T021); all REQ-010-listed flags present post-fix.
- [x] T023 CMD-11: remove the nonexistent `.agents/` runtime directory from `deep_review_auto.yaml` (current disk line 325; research.md cited within 317-326) and `deep_review_confirm.yaml` (current disk line 302; research.md cited within 294-303) — after T017 (shares both files) — EVIDENCE: `.agents/` removed from both files' agent-target discovery lists; only `.claude/agents/`, `.opencode/agents/` remain.
- [x] T024 [P] Verify T023: `grep -n "\.agents/" .opencode/commands/deep/assets/deep_review_auto.yaml .opencode/commands/deep/assets/deep_review_confirm.yaml` returns 0 hits — EVIDENCE: 0 hits (exit 1).
- [x] T025 [P] XS-04: added a standalone referential-integrity checker `.opencode/commands/scripts/validate-command-references.cjs` that resolves runtime-agent filenames (`[runtime_agent_path]/<name>.md` against `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`), literal skill-asset paths (`.opencode/skills/**`), and declared runtime directories across the create/deep/design `_auto`/`_confirm` YAML pairs — skipping templated (`{...}`/glob/`$var`), code-anchored (`file.ts#symbol`), bare-directory, and legitimate `.codex` runtime-mirror tokens so correct parameterized values are never flagged — independent — EVIDENCE: `node .opencode/commands/scripts/validate-command-references.cjs` exits 0 across 40 create/deep/design assets. Designing the checker surfaced + fixed 2 genuine dead create-family refs (`create_agent_{auto,confirm}.yaml` `templates/level_1/{spec,plan}.md` → `templates/examples/level_1/`) that the original finding set had missed.
- [x] T026 [P] Verify T025: the checker exits non-zero on a deliberately re-broken fixture (a reintroduced `speckit.md` agent ref) and exits 0 against the post-fix create/deep/design families, excluding the legitimate `.codex` runtime-mirror references — EVIDENCE: `--self-test` prints "broken fixture flags a violation: PASS (3 found)" and "real tree resolves clean: PASS (0 unresolved)", exit 0; `fixtures/broken-command-refs.yaml` fires exactly 3 violations (agent / skill-asset / runtime-dir) while the `ok_interpolated` and `ok_codex_mirror` decoy lines stay unflagged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T027 Re-render every touched command's `:auto` and `:confirm` workflow (manual read-through; no compiled-contract regen for deep commands — that is phase 006's job) — EVIDENCE: every edited YAML/`.md`/`.txt` file was Read in full context around its edit site before and after each change (per IRON RULE); no compiled-contract regen performed; `deep/assets/compiled/` confirmed untouched (T012, CHK-023).
- [x] T028 Full residual-pattern sweep: re-run every T004/T006/T008/T010/T012/T014/T016/T018/T020/T022/T024/T026 verification grep in one pass and confirm 0 unexpected hits — EVIDENCE: single-pass combined sweep run 2026-07-11 across all 11 fixed-finding grep checks — all returned 0 hits (exit 1); compiled-contract dir clean; `git diff --stat` confirmed scoped to the 35 intended files.
- [x] T029 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/002-remediation-slash-commands --strict` exits 0 — EVIDENCE: exit 0, Summary: Errors: 0 Warnings: 0, RESULT: PASSED (all 38 checks green).
- [x] T030 Update spec.md Status to Complete only after T003-T026 are checked off with evidence and T029 passes; author implementation-summary.md at that time (explicitly NOT in this planning turn) — EVIDENCE: spec.md METADATA Status set to Complete; implementation-summary.md authored.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence (grep output or diff reference) — all 12 findings including XS-04 fixed and verified; the XS-04 checker ships with a `--self-test` proving both exit paths (fixture fails, real tree passes).
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` passes (T029) — see implementation-summary.md.
- [x] `deep/assets/compiled/*.contract.md` and `manifest.jsonl` byte-identical to pre-phase state — `git status --porcelain .opencode/commands/deep/assets/compiled/` empty.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Findings source**: See `../001-conformance-deep-research/research/research.md` §3.1 (Commands), §3.4 (Cross-Surface), §6 (Remediation Routing)
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines) + finding-mapped replacement
- One T### per finding, grouped P0->P1->P2
- [P] reflects genuine file-disjointness; sequential tasks note the shared-file blocker explicitly
-->
