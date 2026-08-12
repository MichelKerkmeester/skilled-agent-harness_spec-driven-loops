---
title: "Tasks: Grok 4.6 Support for cli-cursor & cli-devin"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "grok 4.6"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Grok 4.6 Support for cli-cursor & cli-devin

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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
## Phase 1: Live Verification

- [x] T001 Inventory every Grok 4.5 mention repo-wide, partition live-surface vs. historical
- [x] T002 `cursor-agent --list-models` — confirm the Grok 4.6 family and enumerate all ids
- [x] T003 `devin models list` — confirm the Grok 4.6 family and enumerate all uids
- [x] T004 Resolve the tier-width fork with the operator (full 4.6 vs. 4.5-parity subset)
- [x] T005 [P] Dispatch-test `cursor-grok-4.6-high` and `-xhigh` from a trusted scratch workspace
- [x] T006 [P] Dispatch-test `grok-4-6-high` and `-xhigh` through `devin -p`
- [x] T007 Re-test the `cursor-grok-4.6[effort=high]` bracket rejection
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Runtime Swap (`.opencode/skills/system-deep-loop/runtime/`)

- [x] T008 `lib/deep-loop/executor-config.ts` — swap `CURSOR_SUPPORTED_MODELS` (6→8 ids), update doc comment with confirmation date
- [x] T009 `lib/deep-loop/executor-config.ts` — swap `DEVIN_SUPPORTED_MODELS` Grok uids (3→4), update doc comment
- [x] T010 `scripts/fanout-run.cjs` — swap `CURSOR_ALLOWED_MODELS` mirror
- [x] T011 `scripts/fanout-run.cjs` — swap `DEVIN_ALLOWED_MODELS` mirror
- [x] T012 `tests/unit/executor-config.vitest.ts` — update the 12-id Cursor allowlist assertion
- [x] T013 `tests/unit/fanout-run.vitest.ts` — update allowed/rejected model fixtures (Cursor + Devin)
- [x] T014 `npm test -- executor-config.vitest.ts fanout-run.vitest.ts` in `system-deep-loop/runtime` — targeted suite green (188 tests, every file this packet touched)
- [x] T015 `npm run typecheck` in `system-deep-loop/runtime` — clean
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Documentation Sweep — cli-cursor

- [x] T016 [P] `SKILL.md` — activation triggers, dispatch table, model selection, RULES §4
- [x] T017 [P] `README.md` — guard-rail table, troubleshooting, FAQ x2
- [x] T018 [P] `references/providers-and-models.md` — allowlist table (12 rows), effort table, migration note, enforcement pointer
- [x] T019 [P] `references/cli-reference.md` — §5 model table, reasoning-effort section, selection strategy
- [x] T020 [P] `references/integration-patterns.md` — decision matrix, example commands x2
- [x] T021 [P] `references/agent-delegation.md` — task-type routing table
- [x] T022 [P] `assets/prompt-templates.md` — flag reference
- [x] T023 [P] `assets/prompt-quality-card.md` — dispatch-mechanics addendum
- [x] T024 [P] `manual-testing-playbook/manual-testing-playbook.md` — precondition 7
- [x] T025 Version-field bump on every file touched above
<!-- /ANCHOR:phase-3 -->

---

## Phase 3b: Documentation Sweep — cli-devin

- [x] T026 [P] `SKILL.md` — activation triggers, dispatch table, model selection, RULES §4
- [x] T027 [P] `README.md` — delegation-layer table, FAQ
- [x] T028 [P] `references/providers-and-models.md` — roster table (adds xhigh row), migration note
- [x] T029 [P] `references/cli-reference.md` — flag table, curated-roster line, examples x5, env-var example
- [x] T030 Version-field bump on every file touched above

## Phase 3c: Cross-Reference Sweep

- [x] T031 [P] `cli-pi/references/pi-tools.md` — example id + version bump
- [x] T032 [P] `shared/references/smart-routing.md` — roster mention + DEVIN routing keyword + version bump
- [x] T033 [P] `sk-prompt/sk-prompt-models/references/models/_index.md` — out-of-scope id example + version bump
- [x] T034 `feature-catalog.md` — checked, confirmed clean (no action needed)
- [x] T035 All 6 sibling manual-testing playbooks under `cli-external-orchestration/` — checked, only cli-cursor's had a mention (already fixed in T024)

## Phase 3d: Changelogs

- [x] T036 [P] `cli-cursor/changelog/v1.3.0.0.md` — new entry (additive)
- [x] T037 [P] `cli-devin/changelog/v1.3.0.0.md` — new entry (additive)

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [x] T038 Repo-wide `rg -rniE "grok[ _-]?4\.5|grok-4-5|grok45" .opencode/` — confirm only historical/intentional mentions remain
- [x] T039 Re-run targeted `npm test` (the two changed test files) + `npm run typecheck` from the final edited state — both green
- [x] T040 Author this spec folder (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [B] T041 `validate.sh specs/cli-external-orchestration/036-grok-4.6-support --strict` — blocked by a pre-existing broken dependency install in `system-spec-kit/mcp-server/node_modules` (missing `zod`/`better-sqlite3`, unrelated to this packet); manual structural check substituted (all 6 Level-3 docs present, `SPECKIT_LEVEL: 3` + frontmatter confirmed, both metadata JSON files valid)
<!-- /ANCHOR:phase-4 -->

---

## Phase 5: Correction (operator follow-up, after Phase 4)

- [x] T042 Operator: "make sure grok 4.5 is also still in the roster btw" — re-scope from retire-and-replace to additive
- [x] T043 Operator: "sort the models alphabetically in any table or roster layout in the files" — re-scope every touched roster to alphabetical order
- [x] T044 [P] `executor-config.ts` — re-add 6 `cursor-grok-4.5-*` ids + 3 `grok-4-5-*` uids alongside the 4.6 additions, resort both arrays alphabetically, update doc comments
- [x] T045 [P] `fanout-run.cjs` — mirror the same re-addition and resort
- [x] T046 [P] `executor-config.vitest.ts` — update the 18-id Cursor allowlist assertion (both Grok versions)
- [x] T047 [P] `fanout-run.vitest.ts` — update allowed model fixtures for both adapters to cover both Grok versions
- [x] T048 Re-run targeted `npm test` (executor-config.vitest.ts + fanout-run.vitest.ts) + `npm run typecheck` — 188/188 green, clean (one unrelated flaky timing test on first run, confirmed pass on rerun)
- [x] T049 Live re-verify `cursor-grok-4.5-high` and `grok-4-5-high` via real dispatch — both returned a live model response
- [x] T050 Re-verify the `cursor-grok-4.6[effort=high]` bracket rejection still holds — confirmed, `Cannot use this model`, exit 1
- [x] T051 [P] cli-cursor: 9 docs revised — allowlist counts 12→18, roster tables alphabetized, both Grok versions covered
- [x] T052 [P] cli-devin: 4 docs revised — curated-family enumeration alphabetized (DeepSeek, GLM-5.2, Grok 4.5, Grok 4.6, SWE-1.7), both Grok versions covered
- [x] T053 [P] Cross-reference docs (cli-pi, shared/smart-routing, sk-prompt-models) revised — both Grok versions covered where a family is enumerated
- [x] T054 [P] `cli-cursor/changelog/v1.3.0.0.md` and `cli-devin/changelog/v1.3.0.0.md` rewritten in place (still uncommitted from Phase 3d) to describe an addition, not a swap
- [x] T055 Repo-wide grep re-sweep confirming no live-surface doc claims a 12-id/curated-4-uid-only allowlist or implies 4.5 was retired
- [x] T056 `spec.md`, `plan.md`, `tasks.md` (this file), `checklist.md`, `decision-record.md` (ADR-002 added) revised to the corrected final scope

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks resolved (`[x]` complete or `[B]` blocked-with-substitute, none `[ ]` pending)
- [B] T041 (`validate.sh --strict`) is blocked by a pre-existing, unrelated broken dependency install in `mcp-server/node_modules`; a manual structural equivalent was substituted (see T041)
- [x] Live dispatch verified for every new model id before it landed in an allowlist
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
