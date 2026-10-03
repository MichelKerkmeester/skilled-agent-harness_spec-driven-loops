---
title: "Tasks: Bring skill and agent descriptions back under the description budget"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Bring skill and agent descriptions back under the description budget

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the baseline audit and save it: `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"`, expecting 62 items (14 skills, 36 commands, 12 agent names), total 6,851, headroom -1,251, seven OVER-SOFT, zero HARD-FAIL, exit 0 (`scratch/audit-baseline.txt`) Evidence: 62 items, total 6851, headroom -1251, 7 OVER-SOFT, 0 HARD-FAIL, exit 0 (`scratch/audit-baseline.txt`).
- [x] T002 [P] Snapshot the seven OVER-SOFT descriptions with their file paths, exact text and measured lengths so each trim can be diffed against its original (`scratch/descriptions-before.md`) Evidence: `scratch/descriptions-before.md` holds path, text and length before and after for all eight files.
- [x] T003 [P] Capture the routing baseline: `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json`, then one representative prompt per trimmed item through `advisor_recommend`, for example `code review and stack verification` for `sk-code`, `design a chart for this dashboard` for the `design` agent, `create a spec folder for this feature` for `system-spec-kit` and `write a skill readme` for `sk-doc` (`scratch/advisor-before.json`) Evidence: advisor_status live (generation 9); 8 prompts captured, all exit 0 (`scratch/advisor-before.json`).
- [x] T004 [P] Read the trim rules at `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:262` and write the per-item floor rule and the stage-2 stop rule into the plan's working notes (`scratch/trim-plan.md`) Evidence: rules and stop rule recorded in `scratch/trim-plan.md`.
- [x] T005 [P] Baseline every gate and record exit codes: the six `sync-*.cjs --check` runs, `sync-runtime-mirrors.cjs --check`, `command-catalog-mirror-check.cjs`, `compiled-route-guard.cjs`, `route-validate.sh` and the packet validator (`scratch/gates-baseline.txt`) Evidence: six sync checks, runtime mirrors, catalog check, route guard and route-validate all exit 0 at baseline (`scratch/gates-baseline.txt`); the packet validator was not run at baseline because the docs were still template-filled.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Trim `sk-code` from 405 to at or under 130 characters, using the plan's candidate or a re-measured equivalent that keeps code, quality and review modes, surface packets, implement/debug/verify and stack knowledge (`.skilled/skills/sk-code/SKILL.md:3`) Evidence: 405 to 127.
- [x] T007 Trim the `design` agent from 267 to at or under 130 characters in both authored copies in one edit, keeping the two description lines byte-equal and keeping design, sk-design, values, Style Reference, charts and diagrams and LEAF (`.skilled/agents/design.md:3`, `.claude/agents/design.md:3`) Evidence: 267 to 127 in both files, byte-equal lines.
- [x] T008 [P] Trim `cli-classifier` from 155 to at or under 130 characters, keeping classifier, cli-jev, cli-deem, the hosted and local distinction, transport and mode-registry.json (`.skilled/skills/cli-classifier/SKILL.md:3`) Evidence: 155 to 126.
- [x] T009 [P] Trim `cli-external-orchestration` from 149 to at or under 130 characters, keeping external CLI dispatch, seven workflow modes, mode-registry.json and workflowMode (`.skilled/skills/cli-external-orchestration/SKILL.md:3`) Evidence: 149 to 124.
- [x] T010 [P] Trim `system-spec-kit` from 147 to at or under 130 characters, keeping spec-folder workflow, context preservation, Levels 1-3+, validation, trigger-index, ripgrep retrieval and the required-for-file-changes clause (`.skilled/skills/system-spec-kit/SKILL.md:3`) Evidence: 147 to 130.
- [x] T011 [P] Trim `sk-doc` from 144 to at or under 130 characters, keeping documentation and the authoring hub list (`.skilled/skills/sk-doc/SKILL.md:3`) Evidence: 144 to 128.
- [x] T012 [P] Trim `sk-design` from 135 to at or under 130 characters, keeping design parent hub, one design identity, the owning mode and sk-design-fundamentals (`.skilled/skills/sk-design/SKILL.md:3`) Evidence: 135 to 119.
- [x] T013 Verify stage 1: rerun the audit and confirm no OVER-SOFT item; run `python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/<name>` for each trimmed skill and confirm no description warning; run `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/agents/design.md --type agent --blocking-only` and the same for the `.claude` copy (`scratch/stage1-check.txt`) Evidence: audit total 6330, no OVER-SOFT; quick_validate "Skill is valid!" exit 0 for all six skills; validate_document VALID for both agent files, one pre-existing section-numbering warning (`scratch/stage1-check.txt`).
- [x] T014 Run the stage-2 pass: examine the remaining descriptions largest first, cut only DROP-class content, stop each item at its KEEP floor, and re-run the audit after each batch until the total is at or under 5,600 or every item sits at its floor; record each item examined and its disposition (`.skilled/skills/*/SKILL.md`, `.skilled/commands/**/*.md`, `.skilled/agents/*.md`, `.claude/agents/*.md`, `scratch/trim-plan.md`) SUPERSEDED by the operator ceiling decision: after seeing total 6,330, residual 730 at 5,600 and per-item targets summing to 7,340, the operator raised the ceiling to 6,400 and ruled out further trimming. The audit now reads 6,330 under 6,400 with no WARN.
- [x] T015 Regenerate the runtime copies of every changed description and run each checker: `sync-agents-pi.cjs`, `sync-agents.cjs`, `sync-skills-hermes.cjs`, `sync-prompts-pi.cjs`, `sync-prompts.cjs`, `sync-prompts-hermes.cjs`, then `sync-runtime-mirrors.cjs --check` (`.pi/agents`, `.pi/prompts`, `.codex/agents`, `.codex/prompts`, `.hermes/skills`, `.hermes/prompts`) Evidence: sync wrote Pi agents 1, Codex agents 1, Hermes skills 7, prompts 0; every `--check` exits 0 (`scratch/doctor-gates-after.txt`).
- [x] T016 Refresh the hand-kept command descriptions for any trimmed command a hub mirrors, then rerun `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` and confirm `STATUS=OK` (`.skilled/skills/sk-doc/command-metadata.json`, `.skilled/skills/sk-design/command-metadata.json`, `.skilled/skills/system-deep-loop/command-metadata.json`) Evidence: no command description was trimmed, so no hub metadata entry needed a refresh; `command-catalog-mirror-check.cjs` exit 0, STATUS=OK.
- [x] T017 Reword the audit's stated purpose so the counted surface is explicit, including the two runtime-exclusive commands, and add the matching sentence to the budget section of the reference doc (`.skilled/commands/doctor/scripts/audit_descriptions.py`, `.skilled/commands/doctor/assets/doctor-skill-budget.yaml:5`, `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:262`) Evidence: audit docstring, `doctor-skill-budget.yaml` purpose and invariant, and a "What the audit counts" paragraph in `frontmatter-templates.md`.
- [x] T018 Replace `/doctor skill-budget :auto` with `/doctor:speckit skill-budget` in both sk-doc references, then sweep for the rejected form: `rg -n "doctor skill-budget :auto" .skilled` must return no match (`.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:302`, `.skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md:67`) Evidence: `rg -n "doctor skill-budget :auto" .skilled` returns 0 matches; both sk-doc files carry `/doctor:speckit skill-budget`.
- [x] T019 Re-measure and reroute: rerun the audit into `scratch/audit-after.txt`, rerun every representative prompt into `scratch/advisor-after.json`, and build the before-and-after top-skill table (`scratch/routing-diff.md`) Evidence: `scratch/audit-after.txt`, `scratch/advisor-after.json`, `scratch/routing-diff.md`: 8 of 8 prompts keep their top skill.
- [x] T020 Re-run the doctor gates after the workflow and script edits: `bash .skilled/commands/doctor/scripts/route-validate.sh` and `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"`, both exit 0 (`scratch/doctor-gates-after.txt`) Evidence: route-validate exit 0 (9 routes, 2 warnings, same as baseline); audit exit 0.
- [x] T021 Confirm scope with `git status --short` and `git diff --stat`: only the intended description lines, the wording edits and the regenerated mirrors appear, and no `goal-opencode.md` or `vision.md` exists under `.claude/commands` Evidence: this packet's diff is one description line in each of 8 authored files and 9 generated mirrors, plus the audit script, its workflow yaml, the quick_validate docstring and two sk-doc references; other modified files belong to concurrent packets; no `goal-opencode.md` or `vision.md` under `.claude/commands`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Final audit: `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"` reports zero OVER-SOFT, zero HARD-FAIL and a project total at or under 5,600, or the measured total with the items at their floor and the residual recorded Evidence: zero OVER-SOFT, zero HARD-FAIL, total 6330, residual 730 over 5,600, recorded in implementation-summary.md.
- [x] T023 Per-file validation: `python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/<name>` for every trimmed skill with no description warning, and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file> --type agent` or `--type command` for every trimmed agent and command file Evidence: quick_validate exit 0 for six skills, validate_document VALID for both agent files; no command file was trimmed.
- [x] T024 Routing check: every representative prompt returns the same top skill as its baseline, or the difference is recorded with both runs and the trimmed description restored Evidence: same top skill for all 8 prompts (`scratch/routing-diff.md`).
- [B] T025 Provenance check: `node .skilled/bin/compiled-route-guard.cjs` exits 0 with every hub fresh or excused, every mirror `--check` exits 0, and `command-catalog-mirror-check.cjs` reports `STATUS=OK` BLOCKED until commit: mirrors exit 0 and catalog STATUS=OK, but `compiled-route-guard.cjs` exits 1 with five hubs stale-manifest because their SKILL.md changed; the pre-commit hook re-mints and stages those manifests (`.skilled/scripts/git-hooks/pre-commit`, compiled-routing auto re-mint).
- [x] T026 Packet validation: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/063-description-budget --strict` prints `RESULT: PASSED` Evidence: see implementation-summary.md Verification.
- [x] T027 Fill `implementation-summary.md` with the measured totals, the routing table, the files changed, the decisions, and the Known Limitations entry carrying the per-item-targets arithmetic when the ceiling was not reached (`implementation-summary.md`) Evidence: implementation-summary.md filled.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (one remains: T025, clears at commit)
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
