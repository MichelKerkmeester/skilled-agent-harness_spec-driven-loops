---
title: "Feature Specification: Phase 12: goal-send-and-dedupe"
description: "A parent goal sent in chat still carries the template's author instructions, and the rule for what it may contain is restated in many places that disagree on which text the 4,000 limit caps. system-spec-kit and speckit also keep their own copy of the goal nesting rules. This phase gives the send rule one home in sk-create-goal, removes the instructions from the goal templates and points every duplicate there."
trigger_phrases:
  - "goal chat send rule"
  - "parent goal chat slice"
  - "goal template bloat"
  - "goal nesting dedupe"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: goal-send-and-dedupe

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-cross-surface-references |
| **Successor** | None |
| **Handoff Criteria** | The send rule has one full statement in sk-create-goal, the goal templates carry no author instructions above the log, every system-spec-kit and speckit goal-nesting surface points to `sk-create-goal` or `/create:goal`, and the parent goal measures 3,000 durable characters or fewer. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Create the sk-create-goal sk-doc mode specification. The operator asked for it on 2026-09-26, after phase 011 shipped:

1. "Make clear that a parent goal sent to the user in chat should never contain: Front matter, Dividers, Anchors, unneeded bloat that could make the parent goal not fit in the max 4000 char limit"
2. "Also make sure that the system-speckit command and skill goal logic (regarding nesting in phases) actively references the new .skilled/skills/sk-doc/sk-create-goal skill instead of having seperate duplicate logic"

A fresh Opus 5.5 analyst at xhigh effort scoped the work read-only in `scratch/scope-analysis.md`, from two earlier read-only surveys in the same folder. The orchestrator re-opened at least one citation per decision area and re-ran every baseline count the criteria rely on. All matched. The operator reviewed the scope, set the parent goal and said "okay work on goal", and the phase was then executed.

**Scope Boundary**: The goal send rule, the goal templates' fixed text, and any system-spec-kit, speckit or sk-create-goal text that restates goal authoring or nesting rules. The goal hooks' runtime behavior, the validator's measure, the 4,000 limit itself and every goal file outside this packet stay unchanged.

**Dependencies**:
- Phase 011 shipped and is on origin/main.
- The operator approved this scope on 2026-09-26.
- Open question 1 took the recommended default, because the operator did not choose otherwise.

**Deliverables**:
- `sk-create-goal/references/budget-and-handoff.md` section 4 as the one full send rule, and section 3 as the one full cut order.
- `goal.md.tmpl` and the three sk-create-goal asset templates without author instructions above the log, with the parity test and the golden snapshot updated.
- Pointers to `sk-create-goal` or `/create:goal` from system-spec-kit's `SKILL.md`, its references, the speckit YAMLs, the `create.sh` echo text and `AGENTS.md`.
- The 060 parent goal cut to about 2,943 durable characters and its chat slice resent.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`renderChatSlice()` removes the frontmatter, comments, anchors, dividers and section numbers, but it keeps every line of the template's author instructions. Those instructions are 1,124 of the 3,662 characters 060's parent would send once its 012 row is added. No cut order treats them as cuttable, and the templates require them to stay word for word. The rule for what a goal sent in chat contains is restated across `AGENTS.md`, system-spec-kit's `SKILL.md`, the set-string playbook, the goal template, the resend reminder, five speckit YAMLs and sk-create-goal's own reference. Those copies disagree on whether the 4,000 limit caps the durable slice or the chat slice. system-spec-kit and speckit also carry their own cut order, precedence and amendment rules and a second retrofit recipe, and none of them names `sk-create-goal` or `/create:goal`.

### Purpose
A parent goal sent in chat carries only its directive and fits the 4,000 limit by construction, and every system-spec-kit surface that touches goal nesting points to sk-create-goal instead of restating it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `budget-and-handoff.md` section 4 as the one full send rule, make section 3 the one full cut order with a first cut for legacy author instructions, and delete the stale live figure in section 6.
- Remove the blockquote, the Operator copy section and the criteria introduction from `goal.md.tmpl` and the three asset templates, and add one `GOAL_AUTHORING` pointer comment. The decisions line and the binding Read, Precedence and Stop rules stay, because they direct the agent doing the work.
- Replace every restated send rule, cut order, precedence rule and child-amendment rule in system-spec-kit, speckit and the `/create:goal` workflows with a pointer.
- Name `/create:goal` at every phase-nesting entry point: speckit `:with-phases` and Option D, `phase-definitions.md` Option D, `phase-system.md` and the `create.sh` next steps.
- Correct the four factual divergences: `--phase --with-goal` writes child goals only, one retrofit path, the circular cut-order citation and the stale 3,735 figure.
- Cut 060's parent goal to the new fixed text in the same edit that adds its 012 row, then resend its chat slice.
- Regenerate the golden snapshot and the Hermes mirrors.
- Review remediation the operator asked for after a five-iteration MiMo deep review of this phase ("Fix findings, then playbook"): every finding in `review/review-report.md`, two P1 and nineteen P2. All eight playbook scenarios then run on MiMo, with the verdicts in a new dated benchmark run folder. The operator then widened the scope: every CLI runtime without a native goal command must be proven to work, with opus-high agents leading and MiMo v2.6 Pro, GPT-6 Luna and Grok 4.7 available as their CLI subagents. The live runs found defects in the Hermes goal section, the Pi turn-end nudge, the OpenCode bind and three runtime playbooks, and each is fixed at its source. The same-class sweep for the Pi nudge also covered the completion-evidence extension, whose end-of-turn advisory restarted finished runs.
- Follow-up the operator asked for after the first pass ("FIx all gaps"): correct every claim that the durable slice is injected, name `/create:goal` in the root README, the goal hooks README and the phase checklist, add fix hints to the two validator goal diagnostics, add the implement workflow's `phase-add` line, correct two stale `/spec_kit:plan` names, give `parent-and-nested-goals.md` its overview section, repair the OpenCode goal test's spec path and regenerate the trigger index.
- Closeout the operator approved ("Go", in reply to the recommendation to exempt instruction files): `validate_document.py` skips a file named `AGENTS.md`, the way it skips templates and fixture trees. The file is the framework every runtime here loads at startup, and `~/.claude/CLAUDE.md` links to it, so an overview section added for the validator would load into every Claude Code session in any project.
- The remaining-issue pass the operator asked for ("Fix remaining issues"), with the operator's choice to teach the validator rather than restructure the packets: `validate_document.py` holds a surface packet to its evidence core. A skill whose sections include WHEN THE HUB BUNDLES THIS needs only that section, REFERENCE MAP and SURFACE STANDARDS, so the three sk-code surface packets and their Hermes copies pass unchanged. The same pass adds a `---` divider before each section of `mcp-tooling/SKILL.md` and re-mints its route, corrects the cli-pi playbook's scenario count from 37 to 36, rewords three semicolons out of the review report and refreshes the frozen README manifest for the six directories committed since its last refresh.
- Changelog alignment the operator asked for ("these dont align with sk create changelog"), and entries for the remaining-issue pass, where the operator chose all three: the three create-goal changelogs follow sk-create-changelog's compact and expanded shapes and omission rules. New entries record the last pass: sk-doc v2.2.0.0, which also records the create-goal mode the hub never recorded, mcp-tooling v1.8.0.1 and cli-pi v1.5.11.1. Each skill's version carriers move to the new version, its route is re-minted and its Hermes copy is regenerated.
- The missing changelog links the operator asked for ("add missing links"): 13 skill changelog folders had no link under `.skilled/changelog/`, the four cli ones the report named and nine more a sweep found. Each now has a link named by the tree's rule, and sk-design's single hub link became a folder with a `parent` link and one link per mode, the shape every other hub uses.

### Out of Scope
- A `renderChatSlice()` change that strips legacy instructions from older goals. It waits on the operator's answer to open question 1, and the analyst recommends against it.
- Rewriting older goal files. 227 active goals carry the Operator copy section, and each is cut at its next amendment, as 038/013 decided.
- The four parents already over budget: sk-code/007, sk-design/018, sk-design/019 and sk-git/028. The legacy cut alone would leave all four over, so each needs its owner's cut.
- Parent-goal scaffolding in `create.sh`. It would grow nesting logic inside system-spec-kit, the opposite of ask 2.
- The runtime goal command files `/goal-cursor`, `/goal-opencode` and `/goal-pi`. The runtime fixes land in the plugin, the extension and the hooks behind them.
- The Pi session-start restore. A new Pi session reads the goal brief once from the restore message and once from the first turn's injection, as HEAD already did and the goal hooks README documents.
- A system-spec-kit changelog entry. Its changelog is one narrative file per release, and this change does not open a release.
- Regenerating a `.hermes/skills/` copy whose canonical skill carries another session's uncommitted edits. Those copies are rewritten by their owners' next sync.
- Restructuring the three sk-code surface packets to the workflow-mode sections. sk-code/007 phase 012 left their opening heading unrenamed on purpose, and the operator chose to teach the validator their shape instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` | Modify | Canonical cut order in section 3, canonical send rule in section 4, no live figure in section 6 |
| `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Modify | Remove the author instructions and add the pointer comment |
| `.skilled/skills/sk-doc/sk-create-goal/assets/goal-top-level-template.md`, `goal-phase-parent-template.md`, `goal-phase-child-template.md` | Modify | Same removal inside each template block, and a new "Fixed prose" row |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Regenerate | The rendered goal without the removed text |
| `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modify | Owner line, pointers for the cut order, the send rule and the amendment rule, corrected creation section |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | `:61` admits `/create:goal`, `:160` drops three authoring keywords, `:485` points to the send rule and says the objective slice is injected |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | `:722` points to the cut order and `/create:goal` |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Modify | `packet_goal` pointers, and a `/create:goal` step in `:with-phases` and Option D for plan and complete |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml` | Modify | The resend payload points to the send rule |
| `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md`, `phase-system.md` | Modify | `/create:goal` at Option D and in the phase table |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md`, `templates/template-guide.md`, `README.md` | Modify | A `/create:goal` line and the corrected `--with-goal` fact |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Echo text only: help and next steps |
| `AGENTS.md` | Modify | Three sentences of the send rule, a pointer and the authoring owner |
| `.skilled/hooks/goal/lib/goal-slice.cjs`, `goal-slice.test.cjs` | Modify | The resend reminder keys the send on `packet_budget=ok` |
| `.skilled/skills/sk-doc/sk-create-goal/SKILL.md`, `README.md`, `references/parent-and-nested-goals.md` | Modify | Pointers and version bumps |
| `.skilled/commands/create/assets/create-goal-auto.yaml`, `create-goal-confirm.yaml` | Modify | The four "playbook order" lines point to section 3 |
| `.hermes/skills/*/SKILL.md` | Regenerate | Generated copies whose source is committed or this phase's own. The cli-cursor and deep-review copies followed once their owners committed those sources, so all 71 are in sync |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.2.0.0.md` | Create | The mode's release entry |
| `specs/sk-doc/060-create-goal-mode/goal.md`, `spec.md` | Modify | Parent goal cut and phase-map status |
| `.skilled/hooks/goal/lib/goal-slice.cjs`, `goal-slice.test.cjs` | Modify | Review remediation: linear frontmatter match, one-line resend reminder, missing-path containment, exported `budgetApplies` |
| `.skilled/hooks/goal/bin/goal.cjs`, `goal.test.cjs` | Modify | Review remediation: an unknown leading flag fails, and every failure exits 1 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`, `tests/check-goal.test.cjs`, `tests/fixtures/goal-fixtures.cjs` | Modify | Review remediation: the budget check uses `budgetApplies`, and a fifth check, `frontmatter-fence` |
| `.skilled/hooks/goal/README.md`, `goal-plugin.md`, `lib/goal-core.cjs` | Modify | Review remediation: the stored projection is named the objective slice, and the CLI failure exit is documented. Comment-only in the core |
| `.skilled/commands/create/goal.md`, `assets/create-goal-presentation.txt` | Modify | Review remediation: packet path containment, the data-not-instructions rule and the send gate |
| `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md`, `changelog/v1.0.0.0.md`, `manual-testing-playbook/**` | Modify | Review remediation: frontmatter rule, compact changelog shape, five-check counts and the corrected scenarios |
| `.skilled/skills/sk-doc/benchmark/reports/2026-09-26--manual-testing-playbook--create-goal--review-remediation/` | Create | The MiMo playbook run after the remediation |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, `tests/sync-skills-hermes.test.mjs` | Modify | Relative links in a generated copy resolve from `.hermes/skills/` |
| `.hermes/plugins/repo-guards/__init__.py`, `tests/test_repo_guards.py` | Modify | The goal section binds before its first render, reads the session id from any mapping, injects only the rendered brief and falls back to the core's objective slice |
| `.skilled/hooks/goal/pi/goal-context.ts`, `goal-pi.test.mjs` | Modify | The turn-end nudge waits for the next turn instead of steering the running one |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts`, `runtime/tests/completion-evidence-pi-extension.vitest.ts` | Modify, Create | The completion advisory waits for the next turn instead of restarting a finished run |
| `.opencode/plugins/opencode-goal.js`, `tests/opencode-goal-tool-path.test.cjs` | Modify | A bound packet path and workspace are stored as given, as the shared core stores them |
| `.skilled/skills/cli-external-orchestration/cli-opencode/`, `cli-pi/`, `cli-devin/` goal-hook playbooks, and the cli-hermes playbook, `references/cli-reference.md` and feature catalog | Modify | Each states what its runtime really does, with tracked evidence |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `sk-doc/scripts/tests/test_instruction_file_exclusion.py` | Modify, Create | A file named `AGENTS.md` is skipped as an instruction file, and the test pins the exact-name match |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `shared/assets/template-rules.json`, `sk-doc/scripts/tests/test_surface_packet_sections.py` | Modify, Create | A skill that opens with WHEN THE HUB BUNDLES THIS is held to its evidence core, and the test pins the pass and the named missing section |
| `.skilled/skills/mcp-tooling/SKILL.md`, the serving and authored `activation/mcp-tooling/manifest.json` | Modify, Regenerate | A `---` divider before each H2 section, and the route re-minted from the changed input |
| `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Modify | The stated scenario count matches the 36 scenario files |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerate | The frozen manifest lists the directories committed since its last refresh |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md`, `v1.1.0.0.md`, `v1.2.0.0.md` | Modify | Aligned with sk-create-changelog: compact v1.0 and v1.1, expanded v1.2, exact spec-folder lines, no test or validation counts |
| `.skilled/skills/sk-doc/changelog/v2.2.0.0.md`, and the hub's `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Create, Modify | The hub release for the create-goal mode and both validator changes, every version carrier at 2.2.0.0 |
| `.skilled/skills/mcp-tooling/changelog/v1.8.0.1.md`, and the hub's `SKILL.md`, `README.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Create, Modify | The build entry for the section dividers, every version carrier at 1.8.0.1 |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.11.1.md`, `cli-pi/SKILL.md` | Create, Modify | The build entry for the scenario count, the version at 1.5.11.1 |
| The served and authored route manifests for sk-doc, mcp-tooling and cli-external-orchestration | Regenerate | Re-minted after the version bumps |
| `.skilled/changelog/` links for cli-cursor, cli-devin, cli-hermes, cli-pi, cli-orca, cli-jev and its cli-usage mode, sk-doc create-frontmatter and create-with-human-voice, and the four sk-design modes | Create, Modify | Every skill changelog folder reachable from the tree, and sk-design's link turned into a folder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `budget-and-handoff.md` section 4 is the one full statement of the send rule. It names each removed element (frontmatter, HTML comments including anchors, `---` dividers, heading section numbers and template author instructions), says the 4,000 limit is measured on the durable slice, makes `packet_budget=ok` the send precondition and covers older goals. |
| REQ-002 | `goal.md.tmpl` and the three asset templates carry no author instructions above the log anchor. Their anchors, H2 headings and placeholders are unchanged, and the parity test and the golden snapshot pass. |
| REQ-003 | `budget-and-handoff.md` section 3 is the only full cut order in the repository, and it cites no other document for it. |
| REQ-004 | No system-spec-kit or speckit file restates the chat-slice definition, the cut order, the precedence rule or the child-amendment rule. Each names `sk-create-goal` or `/create:goal` at that point instead. |
| REQ-005 | Every phase-nesting entry point names `/create:goal`: speckit `:with-phases` and Option D in plan and complete, `phase-definitions.md` Option D and the `create.sh` phase next steps. |
| REQ-006 | Every instruction surface that states the send limit says it is measured on the durable slice, and none caps the chat slice as a separate figure. |
| REQ-007 | 060's parent goal binds `012-goal-send-and-dedupe/goal.md`, passes every goal-checker check and measures 3,000 durable characters or fewer. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `create.sh` help, system-spec-kit's `README.md:232`, playbook section 6 and `template-guide.md:187` say that `--phase --with-goal` writes child goals only and that `--level phase-parent --with-goal` writes a parent goal. |
| REQ-009 | One retrofit path is documented, `/create:goal <packet> retrofit`. The inline-renderer recipe is gone from the playbook and `validation-rules.md`, and `SKILL.md:61` admits `/create:goal`. |
| REQ-010 | The HOOKS keywords at system-spec-kit `SKILL.md:160` no longer contain "packet goal", "goal.md" or "nested goal". |
| REQ-011 | `budget-and-handoff.md` carries no live count of a packet goal. |
| REQ-012 | The resend reminder keys the send on `packet_budget=ok` and still names 4000 characters, and the hook tests pass. |
| REQ-013 | The Hermes mirrors are regenerated, and no other `goal.md` in `specs/` changes. |
| REQ-014 | No surface says the durable slice is injected. The root README, the goal hooks README and the phase checklist name `/create:goal` where they describe goal authoring. |
| REQ-015 | `SPECDOC_SUFFICIENCY_005` names the section 3 cut order and `SPECDOC_SUFFICIENCY_006` names `/create:goal <parent> phase-add`, in the compiled validator too. |
| REQ-016 | `speckit-implement.yaml` names `/create:goal phase-add` for an unbound phase, and `create.sh` and `phase-system.md` name `/speckit:plan`. |
| REQ-017 | The trigger index is regenerated from HEAD plus this phase's files, without other sessions' uncommitted work. |
| REQ-018 | `parent-and-nested-goals.md` passes `validate_document.py`, and the OpenCode goal plugin test passes. |
| REQ-019 | Section 2 of `budget-and-handoff.md` states the one budget boundary: the cap applies to a top-level packet and to any phase parent, nested or not, and exempts only a phase child that is not itself a phase parent. Every restatement points there, and `check-goal.cjs` draws the same line as `goal.cjs packet`. |
| REQ-020 | The frontmatter patterns match leading comments in linear time, `check-goal.cjs` flags a bare `---` line before the first heading, and the authoring standards forbid one inside frontmatter. |
| REQ-021 | `goal.cjs` refuses an unknown leading flag with `UNKNOWN_ACTION` and exits 1 on every failure. `resolvePacketDir` judges a missing path by its deepest existing ancestor, and the resend reminder stays on one line. |
| REQ-022 | `/create:goal` accepts only a spec packet directory whose real path stays inside its workspace, and treats packet prose as data, never instructions. |
| REQ-023 | The mode's `contextType` values are enum members, the README points at `changelog/`, `v1.0.0.0.md` has the compact shape, and SCG-007's real user request is natural. |
| REQ-024 | SCG-004 grades the six-step canonical cut order, and SCG-005 seeds the placeholder `/create:goal top-level` copies. |
| REQ-025 | Every line citation into a changed code file lands on the cited code, and the hooks docs name the stored projection the objective slice. |
| REQ-026 | All eight playbook scenarios run with MiMo v2.6 Pro at high thinking, and each verdict, reason and evidence path is recorded in a new dated run folder. |
| REQ-027 | `/create:goal` hands off only after the goal checker passes. A finding left open for any reason, an operator brief included, ends the run with `STATUS=FAIL` and no chat slice. |
| REQ-028 | The goal surface works on every runtime without a native goal command: the OpenCode plugin, the Pi extension and the Cursor, Devin and Hermes hooks each pass their goal test suite and a live run of their goal-hook scenario. |
| REQ-029 | Every relative link in a generated `.hermes/skills/` copy resolves to the canonical file, without regenerating a copy built from another session's uncommitted source. |
| REQ-030 | No Pi extension message sent at the end of a turn starts another turn. A one-shot `pi -p` run with a bound goal exits after its answer. |
| REQ-031 | `validate_document.py` skips a file named exactly `AGENTS.md` with exit 0 and no issues. A file whose name only starts the same way is still validated, and `--no-exclude` still validates `AGENTS.md`. |
| REQ-032 | `validate_document.py` holds a skill whose sections include WHEN THE HUB BUNDLES THIS to that section, REFERENCE MAP and SURFACE STANDARDS, and names whichever of the three is missing. A skill without that section keeps the full required set. |
| REQ-033 | Every document this phase changed or regenerated outside `specs/` reports 0 issues under `validate_document.py`, apart from its by-design skips. The cli-pi playbook states the scenario count its files hold, and the sk-doc script suite passes in full. |
| REQ-034 | The create-goal changelogs follow sk-create-changelog: each takes the compact or expanded shape its change count calls for, carries the exact spec-folder line and holds no test counts, validation results or file inventories. |
| REQ-035 | Each skill the remaining-issue pass changed has a changelog entry next in its version sequence. Every version carrier of that skill matches the entry, its route is fresh and its Hermes copy is in sync. |
| REQ-036 | Every skill changelog folder under `.skilled/skills/` is reachable from a link under `.skilled/changelog/`, each link is named by the tree's rule, and no link is broken. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `goal.cjs packet` on the parent reports `packet_budget=ok` at 3,000 durable characters or fewer, expected 2,943, and `check-goal.cjs` passes every check.
- **SC-002**: The unfilled phase-parent asset template measures 1,623 durable and 1,218 chat characters, down from 3,156 and 2,823.
- **SC-003**: At least 14 system-spec-kit and speckit files name `sk-create-goal` or `/create:goal`, up from 0.
- **SC-004**: `validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 060's parent goal sits at 3,995 of 4,000 once its 012 row is added | High: any second edit fails the budget | Cut to 2,944 by removing the old fixed text, measured with `goal.cjs packet` |
| Risk | `AGENTS.md` loads on every runtime, and `~/.claude/CLAUDE.md` links to it | High | Edit sentences only. Keep "never send its frontmatter anywhere" and the override clause, and read the diff line by line |
| Risk | Older parents keep the old instructions in their chat slices until amended | Medium | The `AGENTS.md` override already outranks their resend wording, and section 4 schedules the cut. Open question 1 |
| Risk | A heading-based strip would delete authored text at `specs/sk-design/018-sk-design-parent-v2/goal.md:57-61` | Medium | No renderer strip in this scope. The legacy cut moves packet-specific sentences into the directive first |
| Risk | The template changes without the snapshot, or an asset drifts from `goal.md.tmpl` | Medium | Order: template, the three assets, the parity tests, then the snapshot with its diff read |
| Risk | Removing "goal.md" from the HOOKS keywords changes routing | Low | Confirmed: the advisor parses only `SKILL.md` frontmatter, and a nested-goal prompt routes to sk-doc at 0.847 after the change |
| Risk | `--level phase-parent --with-goal` scaffolds a placeholder binding row that fails `SPECDOC_SUFFICIENCY_006` | Low | Confirmed in a scratch repo. The help and next steps now send parent goals to `/create:goal`, which fills the row |
| Dependency | Other sessions edit the main checkout | A commit picks up their files | Stage only the files this spec names |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Only one runtime string changes, the resend reminder. The objective slice that bind and injection use stays the same, 906 characters for 060 before and after.

### Security
- **NFR-S01**: No credential, session state or goal state is written. `AGENTS.md` keeps "never send its frontmatter anywhere".

### Reliability
- **NFR-R01**: The resend hash changes only for edited goal files, so the untouched goals raise no resend reminder.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A parent at exactly 4,000 durable characters passes. The chat slice only removes text from the durable slice, so it can never send more.

### Error Scenarios
- A parent report shows `over`: cut the file in the section 3 order and measure again. The chat slice is never truncated to fit.
- An older parent whose author wrote packet text under an Operator copy heading: move that text into the directive before the legacy cut removes the heading.

### State Transitions
- The template change alters new goals only. A filled goal keeps its old text until its next amendment, and its resend hash stays the same until then.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 34 files and 350 changed lines, the analyst's estimate |
| Risk | 12/25 | `AGENTS.md` loads everywhere, a shared template and its snapshot change |
| Research | 8/20 | Scoped by two surveys and one xhigh analysis |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Older parents, answered by default.** Should their chat slices drop the old instructions now, through a `renderChatSlice()` change, or when each parent is next amended? The recommended default holds: at the next amendment, as section 3 step 3 of `budget-and-handoff.md` says. The operator can still ask for the renderer change. A renderer change cannot help the 4,000 limit, which is measured before the projection. It would have to match at least eight wordings, and it would delete the authored lines at `specs/sk-design/018-sk-design-parent-v2/goal.md:57-61`.
<!-- /ANCHOR:questions -->

---
