---
title: "Implementation Plan: Phase 23: epic-review-doc-fixes"
description: "Correct the false README sentence, document the dialog guard and the title carry, add the operator-run hop scenario, save the suite evidence and supersede the one reversed criterion."
trigger_phrases:
  - "epic review doc fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 23: epic-review-doc-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, with one JSDoc comment in CommonJS |
| **Framework** | sk-doc's playbook and feature catalog formats |
| **Storage** | The skill and command documents and the packet documents of children 001, 002, 003, 005, 007 and 011 |
| **Testing** | sk-doc's playbook and catalog validators, the runtime mirror check, strict spec validation and three saved suite runs |

### Overview
Every change is text except one comment line. The false spawn-failure sentence is corrected. The catalog gains one sentence on the dialog guard and one on the generated title carry. The Claude playbook gains one operator-run scenario that walks a real hop through the guard, the packet goal fallback and the title carry. The JSDoc names `generatedName`, and two lines of the child 001 summary gain dated notes. Three suites run on the final tree and their output is saved under `scratch/`. Seven acceptance rows gain a dated note that names a saved file, and 002 AC-003 is superseded through ADR-001 because phase 021 reverses its rule.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phases 020, 021 and 022 are Complete and their fix commits are in the tree

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The four sk-doc checks and the mirror check exit 0
- [ ] The three suite runs are saved under `scratch/`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation catch-up after code, one shared child for every document finding.

### Key Components
- **The Claude adapter README (`claude/README.md:27`)**: the `stop-arm.mjs` row. One sentence changes.
- **The feature catalog entry (`feature-catalog/context-preservation/session-relaunch-loop.md`)**: the Nudge Prepare And Arm section and the Killer And Wrapper section. One sentence each.
- **The Claude playbook (`manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`)**: one new scenario after HS-8 in the Hand-Over State Checks section.
- **The core JSDoc (`lib/relaunch-core.cjs:800`)**: the `@returns` shape.
- **The child 001 summary (`001-sender-dialog-after-prepare/implementation-summary.md:129` and `:131`)**: two dated notes.
- **The seven acceptance rows and `002-packet-goal-fallback/decision-record.md`**: the evidence notes and ADR-001.

### The operator-run scenario, HS-9
The scenario is written for a person, not for a suite. Its heading and its first line say operator-run, so no reader takes it for a committed test.

1. Start a wrapper from the current tree with a low threshold in a throwaway checkout, and bind an unfinished packet whose `goal.md` is within budget. Leave the session with no goal of its own.
2. Run a short task until the nudge, run `prepare`, then call `AskUserQuestion` in the same turn. The guard must deny, and the reason must name the note and `cancel`.
3. End the turn. Stop must arm the record, and `relaunch.log` must show the arm and a live killer lock.
4. Read the receiver's command line with `ps -o command= -p <pid>`. It must start on `/goal <slice>` from the note's packet, which is the packet goal fallback.
5. Repeat in a second session that has no launch name and no `/rename`, so its only title is the generated one. After the hop, the receiver's command line must carry `--name "<generated title> (2)"`.
6. Keep `relaunch.log`, both command lines, `session-relaunch.cjs history --last 3` and the note frontmatter as evidence.

PASS when the denial, the `/goal` start and the `--name` carry all appear. FAIL when the dialog opens, the receiver starts with no goal prompt, or the receiver has a fresh generated title with no hop number. The app title and the command line are recorded separately, because whether the app title follows `--name` is unconfirmed in the packet's research.

### Catalog placement
- **Nudge Prepare And Arm**: one sentence after the Stop paragraph, naming the `AskUserQuestion` guard, both armable states, the note in the refusal and the `cancel` command.
- **Killer And Wrapper**: one sentence after the launch-argument paragraph, naming the generated title that `prepare` records when there is no renamed title and no launch name, and the `--name "<title> (<hop>)"` the wrapper passes.

### Data Flow
Each new sentence is written from the code and tests as they stand after phases 020 to 022, read again at build time, so the files and line numbers it names are the ones on that tree. Each acceptance note names a file saved on that same tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The 2026-11-14 whole-epic review findings F3, F5, F6 and F7 are CONFIRMED against the tree at `fa6a56f0fc`. F3 is the false sentence at `claude/README.md:27`. F5 is the empty search over the catalog and the playbook. F6 is the JSDoc at `lib/relaunch-core.cjs:800` and the two summary lines. F7 is the seven rows with no saved run.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claude/README.md` stop-arm row | Says a spawn failure leaves the record pending | update | The old sentence returns no match |
| Feature catalog entry | Names neither the guard nor the title carry | update | `rg -c 'AskUserQuestion'` and `rg -c 'generatedName'` each print 1 or more |
| Claude playbook | Has no scenario for either behavior | update | `rg -c 'operator-run'` and `rg -c 'AskUserQuestion'` each print 1 or more |
| `relaunch-core.cjs:800` JSDoc | Omits `generatedName` | update | The old return shape returns no match |
| Child 001 summary lines 129 and 131 | Both stale after phases 005 and 020 | update | Dated notes name the phase and the test |
| Seven acceptance rows | Met on unsaved evidence | update | Each row names a saved file under `scratch/` |
| 002 AC-003 | Met under a rule phase 021 reverses | supersede | The row is `Superseded` and ADR-001 exists |
| Adapter behavior and tests | Owned by phases 020 to 022 | unchanged | `git show --stat FIX` lists no test and no adapter change |
| The Pi and OpenCode playbook | Runs the shared wrapper suite | unchanged | Out of Scope in `spec.md` |
| `system-spec-kit/graph-metadata.json` | Trigger phrases for the skill | unchanged | `git diff --quiet HEAD -- .skilled/skills/system-spec-kit/graph-metadata.json` exits 0 |

Required inventories:
- Same-class producers: `rg -n 'AskUserQuestion' .skilled/hooks/session-relaunch` lists the guard, its binding and its tests. `rg -n 'generatedName' .skilled/hooks/session-relaunch` lists the settings reader, the resolver and the CLI. The catalog and the playbook are the two documents that name neither.
- Consumers of changed symbols: N/A, documents and one comment.
- Matrix axes: the behavior (dialog guard, packet goal fallback, generated title carry) crossed with the document (catalog, playbook). The catalog names all three in two sections, and the playbook checks all three in one scenario.
- Algorithm invariant: N/A, documents only. Every new sentence names a source line, a test or a saved run.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phases 020 to 022 landed, saves a validator baseline, starts the three suite runs and saves them, and re-reads the lines each document will cite. Implementation corrects the README sentence, the catalog, the playbook and the JSDoc, writes the two summary notes and the seven acceptance notes, and adds ADR-001. Verification runs the sk-doc checks, the mirror check, strict validation on every edited folder and the recursive run, and checks each new sentence against the line or test it names.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. No code behavior changes | Not applicable |
| Integration | The playbook and catalog packages, the operator contract, the catalog fixtures and the runtime mirrors | `validate-playbook-package.cjs`, `validate_catalog_package.py`, `test_validator_fixtures.py`, `sync-runtime-mirrors.cjs --check` |
| Evidence | The three suites the seven rows ask for, run once on the final tree | `node --test`, `npx vitest` |
| Manual | A read of each new sentence against the line or test it names | Not automated |

Each validator runs once before the first edit as a baseline, saved under `scratch/`, so a failure that predates this phase is told apart from one it causes. The three suite runs also happen before the document edits, so the saved evidence is from the final code tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 020, 021 and 022 Complete | Internal | Planned | The saved runs would not cover the guard, the large-log read or the notices |
| sk-doc's playbook and catalog validators | Internal | Green | The edits could not be checked against the formats CI enforces |
| `sync-runtime-mirrors.cjs` | Internal | Green | The handoff document edit could leave a mirror stale. This child edits no command document |
| `repair-derived.cjs` | Internal | Green | Each edited closed child keeps a stale source fingerprint |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator fails because of an edit of this phase, a new sentence is found wrong, or an acceptance note names a run that does not prove its row.
- **Procedure**: revert the fix commit. No code behavior depends on these documents, and the one comment line changes no behavior.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 020, 021 and 022 Complete | Implementation |
| Implementation | The validator baselines, the saved suite runs and the re-read lines | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
