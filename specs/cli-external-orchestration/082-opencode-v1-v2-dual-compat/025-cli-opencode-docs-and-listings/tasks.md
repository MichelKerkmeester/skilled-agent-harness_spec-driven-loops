---
title: "Tasks: Phase 25: cli-opencode-docs-and-listings"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli opencode docs and listings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 25: cli-opencode-docs-and-listings

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

- [x] T001 Take the baselines before any edit (`scratch/baseline/`) Done: the battery unit tests passed 29 of 29; the live battery passed every v1 leg and v2 `skill-visible`, and failed v2 `plugin-active` with every plugin `failed`, a failure this nested worktree shows before any change; `check-gate-inputs.sh` RESULT: PASSED and `actionlint` exit 0; 31 current cli-opencode docs named the retired id on 71 lines.
- [x] T002 [P] Row 9: record the command listings before any change (`scratch/row9-listings-before.txt`, `scratch/row9-row11-v2-nested-listings.txt`) Done: v1 lists the 40 command files, v2 lists 42, the extra two being `init` and `review`.
- [x] T003 [P] Row 9: check the orphaned folder in the main checkout, read-only (`scratch/row9-main-orphan.txt`) Done: `.skilled/commands/deep/assets/compiled/` does not exist there and `git ls-files` lists nothing under it, so nothing is left to delete; the main checkout still shows only its two known edits.
- [x] T004 [P] Row 10: list the live opencode-go models on 1.19.3 (`scratch/row10-v1-models-opencode-go.txt`) Done: `opencode-go/deepseek-v4.1-flash` is listed and `opencode-go/deepseek-v4-flash` is not.
- [x] T005 [P] Row 11: list agents live on both versions (`scratch/row11-v1-agent-list.txt`, `scratch/row9-row11-v2-nested-listings.txt`) Done: both list the same 11 repo agents; 1.19.3's binary scans `{agent,agents}/**/*.md` in each config directory, which are the project `.opencode`, `~/.config/opencode`, `~/.opencode` and `$OPENCODE_CONFIG_DIR`.
- [x] T006 [P] Row 12: read the `--share` definition in the 1.19.3 binary and run it once with no credentials (`scratch/row12-v1-share-source.txt`, `scratch/row12-v1-share-probe.txt`) Done: the option is `hidden` and described `deprecated: session sharing was discontinued`; the run printed `Session sharing has been discontinued` and published nothing.
- [x] T007 [P] Row 31: capture `run --help` from both versions (`scratch/row31-v1-run-help.txt`, `scratch/row31-v2-run-help.txt`) Done: 1.19.3 lists `-u`, `-i` and `--auto` beyond the doc table; 2.0.32 lists `--standalone`, `--server` and `--auto`, with `--log-level` and `--print-logs` as global flags.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Row 9: add the `command-listed` leg for both families (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, its test, `.skilled/command-support/doctor/scripts/README.md`) Done: 36 of 36 tests pass; on main's battery 10 fail, with the built-ins not subtracted C1 fails, and with the walk-up removed C1, C2 and C6 fail (`scratch/mutation/row9-*.txt`). Live in this worktree both legs pass, v2 listing 42 against 40 required (`scratch/battery-live-after-a.txt`).
- [x] T009 Row 10: align every current cli-opencode doc on `opencode-go/deepseek-v4.1-flash` and add `default-model-id.test.cjs`, run in the battery job's unit-test step (`.github/workflows/opencode-dual-version.yml`) Done: one dated coverage note keeps the old id by design; the test passes 3 of 3 and fails against main's docs (`scratch/mutation/row10-m0-old-docs.txt`).
- [x] T010 Row 11: state one agent directory (`references/cli-reference.md`, `references/opencode-tools.md`, `references/agent-delegation.md`) Done: the six runtime-load claims that named `.skilled/agents/` are gone (`scratch/row11-grep-check.txt`).
- [x] T011 Row 12: document `--share` as the deprecated no-op it is and drop it from every dispatch example (`SKILL.md`, `README.md`, `references/*.md`, `assets/prompt-templates.md`, `hard-rules.json`, five `manual-testing-playbook/` files, `.skilled/hooks/dispatch/README.md`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`) Done: no current doc or playbook command passes `--share` or says it publishes; the dispatch rule tests pass 38 of 38 (`scratch/after/dispatch-rule-checks.txt`).
- [x] T012 Row 31: refresh the flag table and the core flag summary (`references/cli-reference.md`, `SKILL.md`) Done: `-u`, `-i`, `--auto` and `--standalone` rows added, `--log-level` and `--print-logs` marked global on 2.0.32, `-p` marked absent on 2.0.32 `run`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Lint the changed workflow and rerun the changed suites (`scratch/after/`)
- [ ] T014 Review the change read-only with Luna until PASS (`scratch/review/`)
- [ ] T015 Validate this folder strict and 082 recursively, each RESULT: PASSED
- [ ] T016 Row 9 and row 10: prove the battery job passes on CI on both families at the pushed main commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
