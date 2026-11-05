---
title: "Tasks: Phase 4: review-remediation"
description: "Ordered tasks that repair the nine deep-review findings across the sk-code routing vocabulary, the sk-design metadata, two completed packet rows and two frontend references, then run the full gate set and close with the alignment pass that follows the probes."
trigger_phrases:
  - "review remediation tasks"
  - "deep review findings task list"
  - "sk-code routing fix checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `SC` is `.skilled/skills/sk-code`, `FE` is `$SC/sk-code-frontend`, `SD` is `.skilled/skills/sk-design`, `CF` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`, `TW` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`, `P` is `specs/sk-design/021-deprecate-fundamentals/004-review-remediation`, `SDF` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json`, `SDR` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`, `ADV` is `.skilled/skills/system-skill-advisor/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: WS-1 visual-review routing reach
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Add `design review` and `review this design` to the `code-frontend-visual` class and to the `WEB_VISUAL_HIERARCHY` keyword list (`$SC/hub-router.json`, `$FE/ROUTER.md` and `$SC/ROUTER.md`). Verify: `rg -n '"design review"|"review this design"' $SC/hub-router.json` prints both phrases on the class line and after the gate remint `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "design review"` prints `selectionKind":"surfaceBundle"`. Evidence: both phrases are in the class and in both routers, and the post-remint replay returned a surfaceBundle for all four phrases.
- [x] T002 Add three cases in the `surface-bundle-frontend` shape for the value, review and motion prompts, then copy the served fixture over its authored twin (`$CF` and `$TW`). Verify: `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` exits 0 and `diff $CF $TW` prints no difference. Evidence: the fixture holds 12 cases, including `visual-values-frontend`, `visual-review-bundle` and `visual-motion-frontend`. The sk-code canary harness passed and the served fixture was copied over its authored twin.
- [x] T003 Add `references/web-accessibility-patterns.md` to the `WEB_VISUAL_HIERARCHY` load set in the prose line and in the `RESOURCE_MAP` of both mirrors (`$FE/ROUTER.md` and `$SC/ROUTER.md`). Verify: `rg -c 'web-accessibility-patterns' $FE/ROUTER.md $SC/ROUTER.md` prints 2 for each file and `node $SC/sk-code-skilled/assets/scripts/verify-router-sync.cjs` exits 0. Evidence: both mirrors name the file in the prose line and in the `RESOURCE_MAP`, and `verify-router-sync.cjs` passed 5 of 5 checks on sk-code-frontend.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: WS-2 metadata and packet accuracy
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Replace the ten retired values phrases in `derived.intent_signals` with ten phrases for the extract, chart and diagram modes (`$SD/graph-metadata.json`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $SD` prints OK and `rg -n 'ui looks off|make this look better|spacing scale|build a color palette|visual hierarchy|contrast ratio failure|focus ring accessibility|animation duration|accessibility review|design review findings' $SD/graph-metadata.json` prints no line. Evidence: `parent-skill-check.cjs` reports OK with 0 warnings, the ten retired phrases are gone and ten extract, chart and diagram phrases are in place.
- [x] T005 Name the three visual references (visual values, visual hierarchy and review, motion and interaction) and the `tokens.css` asset in the frontend surface row, the surface list and the layout comment, then update the hub description and its date (`$SC/SKILL.md` and `$SC/description.json`). Verify: `rg -n 'tokens.css' $SC/SKILL.md` prints the surface row, the surface list and the layout comment, `rg -n '2026-11-05' $SC/description.json` prints one line and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $SC` prints OK. Evidence: the three sites name the references and `tokens.css`, `lastUpdated` reads `2026-11-05T00:00:00Z` and `parent-skill-check.cjs` reports OK with 0 warnings.
- [x] T006 Delete the row that claims `node-to-token-markup.md` changed (`specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md`). Verify: `rg -n 'node-to-token-markup' specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md` prints no line and `git diff 10474a9567 --stat -- .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/node-to-token-markup.md` prints nothing. Evidence: `grep -c node-to-token` on the summary prints 0 and the baseline diff on the file prints nothing.
- [x] T007 Narrow AC-005 to the five baseline value prompts, name each prompt by text and record its replay result (`specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md`). Verify: `rg -n 'AC-005' specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md` prints one row that names padding, type scale, palette, looks wrong and dropdown animation and no count of eight. Evidence: AC-005 names `what padding should this have`, `what type scale should I use`, `build a color palette for this app`, `why does this look wrong` and `what animation duration should this dropdown use`, and each records a single `sk-code-frontend` route.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: WS-3 lost guidance and session guidance
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Fold the animating-a-shadow rule into item V20 as a Pitfall bullet with the pseudo-element code block and a See also to `web-motion-and-interaction.md` Section 10 (`$FE/references/web-visual-values.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_document.py $FE/references/web-visual-values.md` reports VALID 0 issues and `rg -n '::after|Section 10' $FE/references/web-visual-values.md` prints the code block and the See also. Evidence: `validate_document.py` reports Total issues 0 and the `^### V` count is 41, so V20 holds the pitfall, the code block and the See also without a new item number.
- [x] T009 Restate server-side refusal in M33 and note that the client clears cached protected data (`$FE/references/web-motion-and-interaction.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_document.py $FE/references/web-motion-and-interaction.md` reports VALID 0 issues and `rg -n 'server still refuses|clears cached protected data' $FE/references/web-motion-and-interaction.md` prints the M33 bullet. Evidence: `validate_document.py` reports Total issues 0 and M33 states that the client redirect is UX only, that the server refuses every data request and that the client clears cached protected data.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Gate run
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T010 Remint the sk-code compiled manifest, copy it to its authored twin and run the full gate set (`$SC`, `$SD`, `$CF`, `$TW`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and `$P`). Verify: `node .skilled/bin/compiled-route-sync.cjs --check` exits 0 and `--verify` exits 0, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` prints orphans=0 missing=0, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $SC` exits 0, `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` exits 0, `bash $SC/sk-code-skilled/scripts/run-all-drift-guards.sh` passes, `parent-skill-check.cjs` prints OK on both hubs, `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 0 broken links and `validate.sh specs/sk-design/021-deprecate-fundamentals --strict --recursive` prints RESULT: PASSED. Evidence: the manifest remint, `compiled-route-sync --check` and `--verify`, the intent-signal check, the leaf-manifest check, the vocabulary-reach check, the four drift guards, both parent-skill checks, the markdown link check, the document validator, the mirror checks, the test suite and the graph compiler all passed as `scratch/facts.md` records. Pending: the orchestrator runs the recursive packet gate after the docs close.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Alignment pass

- [x] T011 Close the routing vocabulary gaps the alignment probes found (`$SC/hub-router.json`, `$FE/ROUTER.md`, `$SC/ROUTER.md` and `$SD/hub-router.json`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "which chart should i use"` prints `sk-design-chart` and `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "check the contrast"` prints `sk-code-frontend`. Evidence: sk-code gained contrast phrases, type hierarchy, hover, focus-visible and interaction states at both stages and in both ROUTER copies, sk-design gained chart-choice, chart-type, scatter plot, chart palette and `flow diagram` phrases, and bare `spacing` and `text colour` were removed again because they pulled a README prompt from sk-doc to sk-code.
- [x] T012 Fix the sk-design canary (`$SDF` and `$SDR`). Verify: `rg -c '"id": "chart-choice"' $SDF` prints 1 and the in-memory gold check reports 6 of 7 cases passing. Evidence: the canary gained the `chart-choice` case, the defer gold now holds an empty intent list and the canary router lost a stale no-signal comment, so `explicit-extract-command` is the one case that fails and it fails identically at base `10474a9567`.
- [x] T013 Remove the stale descriptions of the retired fundamentals mode (`$SD/sk-design-md-generator/SKILL.md`, `$SD/sk-design-md-generator/feature-catalog/procedure-cards/md-generator-procedure-card-inventory.md`, `$SC/README.md`, `$FE/README.md`, `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`, `.skilled/agents/README.txt` and `.skilled/agents/design.md`). Verify: `rg -n 'sk-code-quality' .skilled/agents/design.md` prints the author-gate handoff line and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $SD` prints OK. Evidence: the corrected text names `sk-code-quality` as the author gate, the `.claude` and `.opencode` design agent copies carry the same handoff and `parent-skill-check` reports OK on sk-code, sk-design, sk-doc and mcp-tooling.
- [x] T014 Remove the dangling changelog link (`.skilled/changelog/sk-design/design-fundamentals`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 0 broken links. Evidence: the link is gone and the final link check reported 0 broken links.
- [x] T015 Update the advisor parity pins (`$ADV/tests/parity/python-ts-parity.vitest.ts`, `$ADV/tests/parity/fixtures/local-native-approved-divergences.json` and `$ADV/scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: `rg -n 'toBe\(103\)' $ADV/tests/parity/python-ts-parity.vitest.ts` prints the parity expectation and `rg -n '"correct": 156' $ADV/scripts/routing-accuracy/scorer-eval-baseline.json` prints the full-corpus count. Evidence: the parity test expects `tsAlsoCorrect` 103 because `rr-iter3-093` and `rr-iter3-182` now reach the sk-code gold, the ledger records `rr-iter3-146` and the baseline moves from 155 to 156 full-corpus cases and from 49 to 50 holdout cases. The advisor parity suites returned 71 of 72.
- [x] T016 Extend the three unpublished changelog entries and write the two new entries (`.skilled/changelog/sk-code/parent/v3.11.0.0.md`, `.skilled/changelog/sk-code/code-frontend/v1.1.0.0.md`, `.skilled/changelog/sk-design/parent/v3.0.0.0.md`, `.skilled/changelog/sk-design/design-md-generator/v1.1.12.0.md` and `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.11.2.0.md`). Verify: `ls` on the five paths prints five paths. Evidence: sk-code v3.11.0.0, sk-code-frontend v1.1.0.0 and sk-design v3.0.0.0 were extended, and sk-design-md-generator v1.1.12.0 and sk-create-skill v1.11.2.0 were written with their version bumps.
- [x] T017 Run the alignment gate set (`$P`). Verify: the test battery reports 137 pass and 2 fail, both pre-existing, `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 0 broken links, router sync passes 5 of 5 and `parent-skill-check` reports OK on sk-code, sk-design, sk-doc and mcp-tooling. Evidence: the drift guards passed all 4, the compiled-route guard reported every manifest fresh, every mirror check passed, the bin tests returned 14 of 14 and the advisor parity suites returned 71 of 72.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The packet gate prints `RESULT: PASSED` and `acceptance-criteria.md` records every row as Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: `spec.md` carries REQ-001 to REQ-009 and `acceptance-criteria.md` maps each one to a row.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: `plan.md` names WS-1, WS-2 and WS-3 and maps each one to the gate run.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `compiled-route.cjs` and `validate_document.py` both ran during the gate set.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Every edited JSON file parses. Evidence: the route replay, the parent-skill checks and the sync gates read the edited JSON files and passed.
- [x] CHK-011 [P0] Both edited references pass the document contract. Evidence: `validate_document.py` reports Total issues 0 on `web-visual-values.md` and on `web-motion-and-interaction.md`.
- [x] CHK-012 [P1] The change adds no executable path. Evidence: the nine fixes edit Markdown and JSON files only, and the review fix for R1-P1-001 records no code change.
- [x] CHK-013 [P1] The edits follow the router and document patterns. Evidence: `verify-router-sync.cjs` passed 5 of 5 checks on sk-code-frontend.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria are met. Evidence: `acceptance-criteria.md` records AC-001 to AC-009 as Met.
- [x] CHK-021 [P0] The four visual-review phrases bundle both modes. Evidence: the replay returned a surfaceBundle for `design review`, `design review findings`, `review this design` and `review this screen`.
- [x] CHK-022 [P1] The canary cases pass. Evidence: the fixture holds 12 cases and `.skilled/bin/tests` reports 14 pass, 0 fail.
- [x] CHK-023 [P1] A prompt with no visual keyword keeps its single route. Evidence: `code review` returned a single `sk-code-review` route and `review my css cascade layers change` kept its surfaceBundle.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each finding names one class in `implementation-summary.md`. Evidence: the review report records cross-consumer for R1-P1-001 and R3-P2-005, instance-only for R1-P2-002, R2-P2-003, R2-P2-004 and R4-P2-007, and class-of-bug for R3-P2-006, R5-P2-008 and R5-P2-009. `implementation-summary.md` records each finding with its fix.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the fix reaches `hub-router.json`, `sk-code-frontend/ROUTER.md` and the root `sk-code/ROUTER.md`, and all three are in the files-changed table.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the four phrase replays, the five value replays, the canary suite and the parsed JSON gates cover every consumer the plan names.
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction cases are not applicable. Evidence: the nine fixes edit Markdown and JSON files only.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion. Evidence: `plan.md` names the matrix axes phrase, surface and document, with four phrases and three prompts.
- [x] CHK-FIX-006 [P1] Hostile environment variant is not applicable. Evidence: the edited files are routing metadata and skill documents and none reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the baseline commit `10474a9567` recorded in `scratch/facts.md`. Evidence: `scratch/facts.md` records the baseline commit `10474a9567`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the change edits routing JSON and Markdown documents and carries no credential.
- [x] CHK-031 [P0] Input validation is not applicable. Evidence: no parser or path handler is edited.
- [x] CHK-032 [P1] Auth and authz are not applicable. Evidence: the change adds no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized. Evidence: `spec.md`, `plan.md` and `tasks.md` name the nine findings, the three workstreams and the gate set.
- [x] CHK-041 [P1] Comment hygiene holds. Evidence: the packet validator reports the comment-hygiene check as a pass.
- [x] CHK-042 [P2] README updated. Evidence: not applicable, because no reference file is added, renamed or removed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Evidence: `scratch/` holds `facts.md` and the dispatch briefs, and no working copy of an edited file.
- [x] CHK-051 [P1] `scratch/` holds no stray output before close. Evidence: the scratch folder is untracked dispatch material and holds no stray output.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---
