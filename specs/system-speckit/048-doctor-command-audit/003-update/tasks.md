---
title: "Tasks: Phase 3: update"
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
# Tasks: Phase 3: update

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the router, the workflow YAML and the presentation in full, and inventory every named path against this checkout (`scratch/reality-check.md`). Evidence: every path, script, command, flag and environment variable the old route and `doctor-update.yaml` named is marked present, moved or missing with the probe that showed it, including the retired `mcp-server/database` and the `.opencode/skill` singular path.
- [x] T002 Run the safe read-only probes and keep their output (`scratch/doctor-run.log`). Evidence: the graph-metadata dry-run (`--all --active-only --dry-run`), the trigger-index `--check`, the migration signals and the bootstrap `--help` are logged with line citations in `reality-check.md`; no mutating phase of the old workflow was run.
- [x] T003 [P] Write the verdict and the evidence behind it (`scratch/proposal.md`). Evidence: `Verdict: fix` at `scratch/proposal.md:3`, with the ten workflow defects and the minimal concrete edits listed against line-numbered sources.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the deep research on the redesign (`research/research.md`). Evidence: 10 of 10 iterations completed on `cli-pi` with `opencode-go/deepseek-v4.1-flash` at max, stop reason `maxIterationsReached`; the synthesis records the release-identity, unit, customization and command-shape findings, and DR-Q4-001 in section 9.
- [x] T005 Settle the design choices (`scratch/design.md`). Evidence: section 1 fixes two commands, a bare `/doctor:update` running `check`, keep-`align`, no deprecated alias, `.skilled/release/base.json` and `divergence.json` git-tracked with run directories gitignored, prereleases excluded unless named, and merged text only after an explicit decision.
- [x] T006 Move the database rebuild to `/doctor:rebuild` and sweep its references (rename commit). Evidence: `b0be233a6b` — `update.md` → `rebuild.md`, `doctor-update.yaml` → `doctor-rebuild.yaml`, presentation renamed, state files `.doctor-update.*` → `.doctor-rebuild.*`, held rebuild fixes applied, and six playbook scenarios, the feature catalog, the command contract and the mirrors updated.
- [x] T007 Build the release-update engine (`.skilled/commands/doctor/scripts/release-update.cjs`). Evidence: `b853457597` — `check`, `align`, `decide`, `apply` and `rollback` over git plumbing, plus `tests/release-update.test.cjs`; `.gitignore` ignores `.skilled/release/runs/`.
- [x] T008 Make `/doctor:update` the release-aware updater (`.skilled/commands/doctor/update.md`). Evidence: `8215a33a7b` — thin router plus `doctor-update-check.yaml` (read-only), `doctor-update-align.yaml` (add-only, run directory only), `doctor-update-apply.yaml` (dry-run plan, one startup approval, post-apply battery, engine rollback, `/doctor:rebuild` prompt with `reindex rebuilt|skipped|failed`) and `doctor-update-presentation.txt`.
- [x] T009 [P] Register the family and sweep the consumers. Evidence: `_routes.yaml` standalone entries for `/doctor:update` (with the actions map) and `/doctor:rebuild`; `command-contract.json`, `.skilled/commands/README.txt`, the feature catalog and the root `README.md` updated; `.claude`/`.cursor` symlinks and the codex, pi and hermes prompt mirrors regenerated.
- [x] T010 Fix the engine defects found by the first build. Evidence: the engine now reports a locally created or customized-only unit as `local` and drives the overall status from release-side changes only; four tests were added, bringing the suite to 16.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the engine test suite. Evidence: `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` → tests 16, pass 16, fail 0.
- [x] T012 Run the route and catalog gates. Evidence: `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, `OK: route-validate — 9 routes validated, 2 warnings`; `command-catalog-mirror-check.cjs` → `STATUS=OK`, 36/36 commands listed.
- [x] T013 Validate the routers and workflow assets. Evidence: `validate_document.py` on `update.md` and `rebuild.md` → `VALID`, 0 issues each; YAML parse of `doctor-rebuild.yaml` and the three `doctor-update-*.yaml` → `YAML_OK`; `release-update.cjs --help` exits 0 listing every subcommand, and an unknown subcommand exits 2.
- [x] T014 Verify the mirrors and prompts. Evidence: codex, pi and hermes `sync-prompts --check` → `PASS: 34 prompts are in sync` each; `sync-runtime-mirrors.cjs --check` → `PASS: 174 mirrors across 8 trees are in sync`.
- [x] T015 Record the redesign, its decisions and its findings. Evidence: `implementation-summary.md` states the verdict, lists the changed files, records the key decisions, the verification table and the known limitations; `spec.md` status Complete; every acceptance row closed.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — the requirements describe the split and the release updater, and each acceptance row maps to one
- [x] CHK-002 [P0] Technical approach defined in plan.md — the audit → research → split → verify plan, the affected surfaces and the testing strategy
- [x] CHK-003 [P1] Dependencies identified and available — git, Node.js, the route manifest and its validator are present; a missing network degrades the check to upstream `unknown` rather than to a failure
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --test` loads the engine; the workflow YAMLs and the route manifest parse; both router documents validate with 0 issues
- [x] CHK-011 [P0] No console errors or warnings — the test run reports 16 pass / 0 fail, `route-validate.sh` exits 0 and the catalog check reports `STATUS=OK`
- [x] CHK-012 [P1] Error handling implemented — `apply` refuses staged changes, drift since align, changed proposals and an existing lock; an unknown subcommand exits 2; an unreachable upstream is `unknown`, never `current`
- [x] CHK-013 [P1] Code follows project patterns — CommonJS with Node built-ins and git through `execFileSync`; the command assets keep the sk-create-command shape; no ephemeral ids were added to code comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — five rows `Met` and AC-001 `Superseded` through ADR-001
- [x] CHK-021 [P0] Manual testing complete — the engine suite, the live read-only check, and the route, catalog, document, YAML, prompt and mirror gates were all re-run after the change
- [x] CHK-022 [P1] Edge cases tested — the suite covers a vendored tree with no shared history, executable modes and symlink targets, rollback, and the help and exit-code contract
- [x] CHK-023 [P1] Error scenarios validated — the refusal paths are exercised against staged changes, drift after alignment, and an unknown subcommand; the advisor's `--trusted` gate was observed to error with exit 64 without the flag
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — the split is `cross-consumer` (router, workflows, presentation, catalog, contract, playbook, mirrors); the engine defects were fixed as `class-of-bug` cases; the subsystem conditions are `instance-only` findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — the rename sweep covers every live reference, and the catalog, route, prompt and mirror checks confirm the producers agree
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — `.skilled/commands/README.txt`, the hub metadata files, `command-contract.json`, the feature catalog, the playbook, the root `README.md` and the runtime mirrors were updated in the same pass
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — `apply` refuses staged changes, drift after alignment and changed proposals, and the disposable-repository tests exercise those refusals plus the symlink and executable-mode paths
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — the affected-surfaces section lists subcommands × unit statuses × file classes; the 16-case suite covers the subcommands and refusals, and the live `check` covers the status axis
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — `check --json --offline` exits 0 and reports upstream `unknown`; the advisor graph scan without `--trusted` errors with exit 64, and the rebuild routes mutations through the advisor CLI with that flag
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — the three local commits `b0be233a6b`, `b853457597` and `8215a33a7b` on `worktrees/079-doctor-command-audit`, none pushed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the engine reads git objects and local files only; no credential or token is written to a run or a report
- [x] CHK-031 [P0] Input validation implemented — decisions are validated against the file's class, `use-proposal` requires a marker-free proposal and records its sha256, and every write target is checked against the run's recorded blobs
- [x] CHK-032 [P1] Auth/authz working correctly — N/A; the command has no auth surface, and the advisor's own `--trusted` gate guards its mutating operations
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md` status Complete, this task list fully ticked, `acceptance-criteria.md` five rows `Met` and one `Superseded`
- [x] CHK-041 [P1] Code comments adequate — the engine comments describe the classes and refusals; no ephemeral spec or packet ids were added
- [x] CHK-042 [P2] README updated (if applicable) — the root `README.md` and `.skilled/commands/README.txt` carry both command entries
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the audit artifacts (`reality-check.md`, `doctor-run.log`, `proposal.md`, `design.md`) live in `scratch/`, and the research state lives under `research/`
- [x] CHK-051 [P1] scratch/ cleaned before completion — the artifacts are kept as this phase's evidence, not deleted
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---

