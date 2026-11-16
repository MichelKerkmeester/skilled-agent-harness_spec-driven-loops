---
title: "Feature Specification: Phase 5: closeout-follow-up-fixes"
description: "The close of the hook library cleanup reported faults it left out of scope. The quality gate hands the workflows README to actionlint, docs cite stale lines and missing markers, and the Pi adapters keep import fallbacks that can never load."
trigger_phrases:
  - "closeout follow up fixes"
  - "phase 5 closeout follow up fixes"
  - "dead pi import fallbacks"
  - "actionlint path filter"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: closeout-follow-up-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/411-hook-library-cleanup` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-hook-readme-fold-and-rewrite |
| **Successor** | None |
| **Handoff Criteria** | Every requirement below has its command output recorded in `implementation-summary.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the hook library cleanup. Phase 4 closed with a list of faults found and left out of scope. The operator chose to fix the ones that change no hook behavior.

**Scope Boundary**: Doc, comment, config and import fixes that change no hook behavior, kill-switch name, concern key or registered command.

**Dependencies**:
- Worktree 424 edits the wrapper-runtime sentence in `coverage-rationale.md` and the shim lines in the session-handover docs. This phase leaves those lines alone.

**Deliverables**:
- The five fixes listed under In Scope, each with its checker output.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The quality gate hands `.github/workflows/README.md` to actionlint, which fails on it. Three docs cite lines that moved, name a pre-commit marker that does not exist or contradict how Codex loads hooks. Two checkers fail on `coverage-rationale.md` and the workflows README. Seven Pi import fallbacks can never load and replace the real error when the main import fails, and two more try a dead path first on every load.

### Purpose
Each finding is fixed at its source, and the checker that found it passes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files .github/workflows/README.md --only actionlint --format json
actionlint  state: RAN_FAIL  exit: 1  argv: ["actionlint", ".github/workflows/README.md"]

$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/hooks/coverage-rationale.md
  line 79: inline 'pipeline.js': path does not exist
  line 93: inline 'lib/classifier-injection-advisory.mjs': path does not exist
  line 101: inline 'shared/git-preflight-advisory.mjs': path does not exist
  line 105: inline 'shared/git-message-gate.mjs': path does not exist
FAIL .skilled/hooks/coverage-rationale.md: references=55 unresolved=4 examples=0 allowed=0

$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/hooks/coverage-rationale.md
FAIL .skilled/hooks/coverage-rationale.md: claims=1 failures=1

$ grep -c HYGIENE_HOOK .skilled/scripts/git-hooks/pre-commit
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Narrow the actionlint path filter to `.github/workflows/*.yml` and `*.yaml` in the config, its generator and its doc example.
- Correct the stale line citations in `job-shape-rules.md`, the `HYGIENE_HOOK` lines in the comment-hygiene playbook and the Codex loading claim in the watchdog plugin comments.
- Fix the four unresolved paths and the key names in `coverage-rationale.md`, and add `readme-check` markers there and in the workflows README.
- Remove the dead Pi import fallbacks, the inverted first tries and the Vitest alias that kept them resolvable, with the tests that pinned them.

### Out of Scope
- `install-codex-hooks.mjs --check` from a linked worktree - the fix changes session-start output, so it needs its own operator decision.
- The OpenCode plugin name prefixes - each file name is the plugin's registered id.
- The wrapper-runtime sentence in `coverage-rationale.md` - worktree 424 edits it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` | Modify | actionlint `paths` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config-discovery.cjs` | Modify | The generated actionlint `paths` |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md` | Modify | The doc example |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | Three line citations |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md` | Modify | The pre-commit marker and the moved check |
| `.opencode/plugins/codex-hooks-watchdog.js` | Modify | Header and catch comments only |
| `.skilled/hooks/coverage-rationale.md` | Modify | Paths, key names and a marker block |
| `.github/workflows/README.md` | Modify | A marker block |
| Pi adapters in `completion-evidence`, `goal`, `subagent-dispatch-guard`, `session-handover`, `cli-dispatch` and `system-skill-advisor` | Modify | One import path each |
| `.skilled/hooks/vitest.config.ts`, `session-handover.test.ts`, `prompt-advisor.vitest.ts` and two advisor docs | Modify | Drop the alias and the dead-path tests and prose |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No hook behavior changes | The hook Vitest suite, the hook `node --test` suite and both sync checks pass with the same counts as before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | actionlint skips the workflows README and still lints workflow files | The gate reports `NOT_APPLICABLE` for the README and `RAN_CLEAN` for `hook-vitest-suites.yml` |
| REQ-003 | Both doc checkers pass on `coverage-rationale.md` and the workflows README | Each prints `SUMMARY files=1 pass=1 fail=0` |
| REQ-004 | The citations and comments match the code | `grep -n 'gate:comment-hygiene'` on the pre-commit finds lines, and each cited line holds the cited text |
| REQ-005 | No Pi adapter keeps a fallback import | The Pi adapter suites pass with the alias removed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The quality gate run on `.github/workflows/README.md` reports actionlint `NOT_APPLICABLE`.
- **SC-002**: `.skilled/hooks/vitest.config.ts` has no `resolve.alias`, and the hook Vitest suite passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Worktree 424 edits nearby lines | A merge conflict | Leave its three named lines alone and put the marker block at the end of the file |
| Risk | A removed fallback was live on some load path | Med | Resolve every specifier from the adapter's real folder before removing it, and run the suites without the alias |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None
<!-- /ANCHOR:questions -->

---
