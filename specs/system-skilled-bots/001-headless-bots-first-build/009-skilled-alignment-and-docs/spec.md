---
title: "Feature Specification: Phase 9: skilled-alignment-and-docs"
description: "Bring system-skilled-bots to sk-code and sk-doc alignment: code-folder READMEs, a feature catalog, runtime playbook scenarios, a Devin alignment run and a fresh Opus logic review."
trigger_phrases:
  - "skilled alignment and docs"
  - "phase 9 skilled alignment and docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: skilled-alignment-and-docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-23 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-hub-wiring |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance row Met, the Devin alignment findings triaged and the Opus review findings verified or refuted |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the sk-code and sk-doc alignment of system-skilled-bots: code-folder READMEs, manual testing playbook, feature catalog, Devin alignment run and a fresh Opus logic review specification.

**Scope Boundary**: documentation and alignment of the code phases 001 to 008 already built. Code changes are limited to verified review findings and sk-code alignment fixes.

**Dependencies**:
- Phases 001 to 008 committed on branch `system-skilled-bots` (`f4c318d856a`).
- The `devin` lane preset in `.skilled/commands/assets/local-skilled-alignment/executors.json`.

**Deliverables**:
- Six code-folder READMEs, a feature catalog and runtime playbook scenarios.
- A `/local-skilled-alignment --lanes devin` report with its findings triaged.
- A fresh Opus xhigh logic review with each finding verified before any fix.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The bots skill ships about 10,700 lines of runtime code with no code-folder README in any of its code folders, no feature catalog, and a manual testing playbook that covers hub routing only. A developer cannot orient in `runtime/lib` before editing it, and an operator has no scenario that exercises a real run, schedule or status path. The epic's logic has also never been reviewed by a model that did not build it.

### Purpose
The skill meets the sk-doc package shape and sk-code standards, and an independent review and a cross-surface alignment run both report no open defect that is not fixed or recorded.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ for d in runtime runtime/lib runtime/tests runtime/tests/fixtures scripts scripts/fixtures; do test -f $S/$d/README.md && echo "present $d" || echo "missing $d/README.md"; done; ls $S/feature-catalog; ls $S/manual-testing-playbook
missing runtime/README.md
missing runtime/lib/README.md
missing runtime/tests/README.md
missing runtime/tests/fixtures/README.md
missing scripts/README.md
missing scripts/fixtures/README.md
ls: .skilled/skills/system-skilled-bots/feature-catalog: No such file or directory
hub-routing
manual-testing-playbook.md
(S=.skilled/skills/system-skilled-bots)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add code-folder READMEs to `runtime/`, `runtime/lib/`, `runtime/tests/`, `runtime/tests/fixtures/`, `scripts/` and `scripts/fixtures/` through `/create:readme`.
- Add a `feature-catalog/` to the skill root through `/create:feature-catalog`, one entry per shipped runtime capability.
- Add runtime scenario categories to `manual-testing-playbook/` through `/create:manual-testing-playbook`, covering author, run, schedule, request and status paths.
- Run `/local-skilled-alignment` with `--lanes devin` (cli-devin, DeepSeek V4.1 Flash max) over the skill, and fix or record every finding.
- Dispatch a fresh Opus xhigh review over all runtime logic, verify each finding, and fix the confirmed ones with a test.
- Fix the verified alignment findings in the surfaces the epic changed outside the skill: the system-deep-loop read-only executor docs, the cli-external-orchestration OpenCode catalog entry, the Vibe EC-007 scenario, the root `README.md`, `.skilled/skills/README.txt`, `.skilled/commands/README.txt`, the `/bots:*` command assets, `.env.example` and the hook-flag and env references, and the regenerated skill graph. The root release notes `v4.2.0.0.md` are deferred by operator decision on 2026-11-23 ("Were not releasing yet").

### Out of Scope
- The Tuesday weekday probe and the closure of phases 002, 006 and 008 - they wait on the 2026-11-24 launchd fire, tracked by the parent.
- READMEs for `commands/bots/assets/`, `assets/` and `.skilled/bin/` - they hold workflow YAML, a template and a shared bin folder, not skill code.
- New features or refactors not demanded by a verified finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/README.md` and `lib/`, `tests/`, `tests/fixtures/` READMEs | Create | Code-folder orientation |
| `.skilled/skills/system-skilled-bots/scripts/README.md`, `scripts/fixtures/README.md` | Create | Code-folder orientation for the bot checker |
| `.skilled/skills/system-skilled-bots/feature-catalog/**` | Create | Feature catalog root and entries |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/**` | Create/Modify | Runtime scenario categories and root index |
| `.skilled/skills/system-skilled-bots/runtime/lib/*.ts`, `runtime/tests/*` | Modify | Only for verified review or alignment findings |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` (renamed from `bot-template.md`) and its references | Rename/Modify | The BOT.md template is machine-parsed, so it leaves the skill-doc frontmatter and document gates |
| `.skilled/skills/system-deep-loop/**` read-only executor docs, `SKILL.md`, `changelog/` | Modify/Create | Docs still describe the cli-opencode read-only refusal this epic removed |
| `.skilled/skills/cli-external-orchestration/feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md`, `cli-mistral-vibe/manual-testing-playbook/stress/sandbox-permission.md` | Modify | Same pre-epic read-only wording |
| `README.md`, `.skilled/skills/README.txt`, `.skilled/commands/README.txt`, `.skilled/commands/bots/assets/*` | Modify | Counts, the Bots command group and literal alignment fixes |
| `.env.example`, `.skilled/hooks/hook-flags.env.example`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | The bots enqueue kill switch |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Deferred | Release notes for the bots hub and the read-only executor change. Deferred by operator decision ("Were not releasing yet"), so the file stays untouched |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | Compiled graph is missing the bots hub |
| `.skilled/skills/system-skilled-bots/hub-router.json`, `ROUTER.md`, `graph-metadata.json`, the three mode `ROUTER.md` files | Modify | Named-bot routing vocabulary, ordered keywords and the stage-one intent pins |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/011-system-skilled-bots/**` and its authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/011-system-skilled-bots/**` | Modify/Regenerate | The hub-local ordered-keyword engine, canary gold and the compiled policy |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/{system-skilled-bots,cli-external-orchestration}/manifest.json` and their `specs/sk-doc/.../013-live-activation` mirrors | Regenerate | Live manifests refreshed after the bots policy and the cli-mistral-vibe doc edits changed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`, `command-bridges.generated.json`, `routing-accuracy/command-routing-baseline.json`, `runtime/lib/command-attach.ts`, `runtime/lib/scorer/projection.ts`, `specs/sk-doc/.../shared/frozen-scorer-pins.json` | Modify/Regenerate | Activate the four `/bots:*` bridges. The bridge regeneration rewrote `projection.ts`, so the scorer pins were re-frozen |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `runtime/tests/python/test_skill_advisor.py` | Modify | The Python advisor screened structural ids with the free-text filter and dropped `command-bots-run` |
| `.skilled/commands/deep/research.md`, `review.md`, `assets/deep-research-presentation.txt`, `assets/deep-review-presentation.txt`, `assets/deep-research.yaml`, `assets/deep-review.yaml`, `assets/compiled/*.contract.markdown` | Modify/Regenerate | The command contracts still said cli-opencode refuses read-only. Contracts recompiled |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md`, `README.md` | Modify | A read-only Vibe lineage gets only the read tools, not "no confinement" |
| `.skilled/skills/system-skilled-bots/bots-*/README.md`, `bots-*/references/*.md`, `bots-author/SKILL.md` | Modify | Strict packaging: `When to Use` headings, RELATED as the last section, a shorter description |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`, `.github/actions/setup/action.yml` | Modify | A new worktree and the CI cache both need the bots `runtime/` dependencies |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerate | The README durable manifest gains the twelve new bots code folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the six code folders listed in scope holds a README that `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` accepts. |
| REQ-002 | Every Opus review finding is recorded as confirmed or refuted with evidence, and each confirmed P0 or P1 is fixed with a test that failed before the fix. |
| REQ-003 | The runtime suite (`npx vitest run --no-coverage`) and `npm run typecheck` pass after every code change, with the baseline and the delta reported. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `feature-catalog/` exists and passes the sk-create-feature-catalog validator the command names. |
| REQ-005 | The playbook gains runtime categories that pass the sk-create-manual-testing-playbook validator, and `node .skilled/bin/compiled-route-admission.cjs --hub system-skilled-bots` still reports no drift. |
| REQ-006 | A `/local-skilled-alignment` run completes over the skill, and each of its findings is fixed or recorded with a reason. Amended 2026-11-23: the `devin` lanes failed on an exhausted daily quota and on read-only permission mode rejecting every shell call, so the operator switched the run to `--lanes vibe-deepseek` (DeepSeek Flash, thinking max). |
| REQ-007 | The definition checker fails every bot the runner's posture check would refuse before dispatch, and the shipped template names a runtime that passes both. Added 2026-11-24 at the operator's request, after the template's `native` default passed the checker and was refused at run time. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The measured-behavior loop above prints `present` for all six folders and `ls feature-catalog` lists a root index.
- **SC-002**: The alignment report and the review file both exist under this packet's `scratch/`, with no open P0 or P1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `devin` binary and DeepSeek quota | The alignment lanes fail | Record the failed lane as the finding and ask the operator before switching preset |
| Risk | New playbook scenario frontmatter is read as routing gold | Med | Run the admission check after the playbook lands |
| Risk | The alignment scope is a git diff, so uncommitted docs are invisible to it | High | Commit locally before the run, push only after a yes |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: the packet adds documentation and fixes defects. It runs no service and sets no new limit.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a review that returns no finding is recorded as such, with what it checked.
- Maximum input: an alignment run over the whole skill dispatches four lanes of up to an hour each.
- Failure path: a Devin lane that fails writes its error file, and the run reports it as a lane failure, not as clean.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 30 new doc files, code edits bounded by findings |
| Risk | 8/25 | Docs are additive; code fixes are test-gated |
| Research | 10/20 | Two external reviews to verify |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None.
<!-- /ANCHOR:questions -->

---


