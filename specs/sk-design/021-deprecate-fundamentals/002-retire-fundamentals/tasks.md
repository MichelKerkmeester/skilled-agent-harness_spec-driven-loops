---
title: "Tasks: Phase 2: retire-fundamentals"
description: "Ordered deletion, hub rebuild, link repoint and verification tasks for retiring the sk-design fundamentals mode."
trigger_phrases:
  - "retire fundamentals tasks"
  - "sk-design hub rebuild tasks"
  - "phase 2 routing checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: retire-fundamentals

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

**Variables**: `H` is `.skilled/skills/sk-design`. `R` is `.skilled/skills/sk-code/sk-code-frontend/references`. `C` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design`. `P` is `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the baseline routing in the phase spec (`$P/spec.md`). Verify: the Measured Behavior block quotes `compiled-route --hub sk-design` routing a padding prompt to the single fundamentals mode and the advisor answering it at 0.65.
- [x] T002 Confirm phase 1 shipped the replacement references (`$R`). Verify: `ls $R/web-visual-values.md $R/web-visual-hierarchy.md $R/web-motion-and-interaction.md` lists three files.
- [x] T003 Inventory every live reference to the retired path (`.skilled` and `README.md`). Verify: `rg -l 'sk-design-fundamentals' .skilled README.md` lists the live documents to repoint plus the changelog and benchmark records that keep the historical name.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Delete the fundamentals folder (`$H/sk-design-fundamentals/`). Verify: `ls $H/sk-design-fundamentals` reports no such file and `git status` records the deletion.
- [x] T005 Drop the retired mode from the registry and the hub router (`$H/mode-registry.json` and `$H/hub-router.json`). Verify: `rg -n '"defaultMode": null' $H/hub-router.json` prints one line and `rg -n 'design-decisions|design-review' $H/hub-router.json` prints no line.
- [x] T006 Remove the VALUES and REVIEW intents and state three modes (`$H/ROUTER.md` and `$H/SKILL.md`). Verify: `rg -n 'VALUES|REVIEW' $H/ROUTER.md` prints no line and `rg -n 'The three modes are' $H/SKILL.md` prints one line.
- [x] T007 Update the hub metadata (`$H/description.json`, `$H/command-metadata.json` and `$H/graph-metadata.json`). Verify: `generate-router-intent-signals --check sk-design` prints orphans=0 missing=0 PASSED and the intent signal count reads 111 down from 219.
- [x] T008 Regenerate the leaf manifest (`$H/leaf-manifest.json`). Verify: `parent-skill-check` leg 10b reports the leaf manifest byte-identical.
- [x] T009 Repoint the design agent decide path (`.skilled/agents/design.md` and `.claude/agents/design.md`). Verify: `rg -n 'sk-code-frontend' .skilled/agents/design.md` prints the decide path lines.
- [x] T010 Regenerate the codex, pi and hermes mirrors (`.codex/agents/design.toml`, `.pi/agents/design.md` and `.hermes/skills/agent-design/SKILL.md`). Verify: `sync-agents`, `sync-agents-pi` and `sync-skills-hermes` each pass their `--check` run.
- [x] T011 Repoint the Figma skill and its three code scenarios (`.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` and `manual-testing-playbook/figma-to-code/`). Verify: `rg -n 'sk-code-frontend'` over the skill and the three scenarios prints the handoff lines and `rg -n 'sk-design-fundamentals'` prints no line.
- [x] T012 Repoint the remaining documents (`$H/sk-design-md-generator/references/design-knowledge/numeric-design-laws.md`, `README.md`, `$H/benchmark/README.md` and `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`). Verify: `rg -n 'sk-design-fundamentals'` over those files prints no line.
- [x] T013 Repoint the two hub playbook prompts (`$H/manual-testing-playbook/resource-loading/assets-only.md` and `$H/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md`). Verify: `rg -n 'fundamentals'` over both files prints no line.
- [x] T014 Drop the VALUES and REVIEW owners from the compiler (`$C/lib/registry-compiler.cjs`). Verify: `rg -n 'VALUES|REVIEW' $C/lib/registry-compiler.cjs` prints no line.
- [x] T015 Rewrite the sk-design canaries (`$C/fixtures/canary-cases.v1.json`). Verify: `rg -n 'out-of-domain-defer' $C/fixtures/canary-cases.v1.json` prints the case and no fundamentals case remains.
- [x] T016 Set both versions and write their changelogs (`$H/SKILL.md`, `$H/changelog/v3.0.0.0.md`, `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` and `.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.2.0.md`). Verify: `rg -n 'version: 3.0.0.0' $H/SKILL.md` and `rg -n 'version: 1.2.2.0' .skilled/skills/mcp-tooling/mcp-figma/SKILL.md` each print one line and both changelog files exist.
- [x] T017 Update the sk-doc examples that count design modes (`.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md` and `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md`). Verify: `rg -n 'three workflow modes'` prints one line in each file.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T018 Run the hub invariant check on all three affected hubs (sk-design, sk-code and mcp-tooling). Verify: each prints `OK: parent-skill-check` with all hard invariants passed and 0 warnings at exit 0, with sk-design leg 6b at three modes, leg 10b byte-identical and leg 13a at version 3.0.0.0.
- [x] T019 Replay stage one against the advisor. Verify: padding resolves to sk-code 0.63, type scale to 0.88, palette to 0.88, `why does this screen look wrong` to 0.90, dropdown animation to 0.82, `looks amateur` to 0.90 and `focus outline removed` to 0.93, and chart resolves to sk-design 0.89, flowchart to 0.82 and extract tokens to 0.95.
- [x] T020 Replay stage two against both hubs. Verify: all eight value, review and motion prompts route to `sk-code-frontend` and the vitest prompt still routes to `sk-code-skilled`, while chart routes to `sk-design-chart`, extract to `sk-design-md-generator` and the no-signal prompt defers.
- [x] T021 Check the compiled-route chain. Verify: `compiled-route-sync --check` reports all 55 served copies match their authored files, `--verify` reports the move simulation resolves all 7 hubs and `compiled-route-status --all` reports every hub compiled-serving.
- [x] T022 Run the router vocabulary reach check across all 7 hubs. Verify: RESULT PASSED with wrong-hub=0 outranked=0 no-reach=0, sk-code declared phrases at 172 from 94 and sk-design at 84 from 120.
- [x] T023 Check the generated intent signals for both hubs. Verify: `generate-router-intent-signals --check sk-code` and `--check sk-design` each print orphans=0 missing=0 PASSED.
- [x] T024 Check every markdown link in the repository. Verify: `check-markdown-links` prints 0 broken markdown links across 14494 links.
- [x] T025 Regenerate and check the runtime mirrors. Verify: `sync-agents`, `sync-agents-pi` and `sync-skills-hermes` report PASS on `--check`, `runtime-mirrors --check` reports PASS for 213 mirrors and no runtime holds an `sk-design-fundamentals` copy.
- [x] T026 Run the sk-doc README tests. Verify: `test_readme_manifest.py` and `test_readme_verdict_parity.py` exit 0 after the three deleted directories and README rows leave their fixtures.
- [x] T027 Run the shared binary test suite. Verify: `.skilled/bin/tests` reports 14/14 at exit 0, identical to main.
- [x] T028 Validate the changelogs. Verify: `validate_document.py` reports VALID 0 issues on the five changelogs written across the three phases.
- [x] T029 Run the advisor regression suite. Verify: the worktree reports 42/42 cases pass with top-1 1.0 against a main baseline of 39/42 and top-1 0.9189.
- [x] T030 Run the packet gate. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals --strict` prints RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The packet gate prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: REQ-001 to REQ-010 cover the deletion, the three-mode hub, the agent path, the repoints, the compiled routing, the versions and the link and mirror checks.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: the architecture section names the hub files, the design agent, the compiler and the served copies.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: phase 1 shipped `web-visual-values.md`, `web-visual-hierarchy.md`, `web-motion-and-interaction.md` and `assets/tokens.css`, and every gate tool ran.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Documents pass lint and format checks. Evidence: `validate_document.py` reports VALID 0 issues on the five changelogs and the document validator accepts the edited hub files.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the change edits Markdown, JSON and one CommonJS compiler, and every gate prints no error.
- [x] CHK-012 [P1] Error handling implemented. Evidence: no new executable path is added. The failure path is a stale link or a stale route, and the link check and the canary replay catch both.
- [x] CHK-013 [P1] Documents follow project patterns. Evidence: the hub keeps its existing registry, router and metadata shape and `parent-skill-check` accepts all three hubs.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` records every row as Met with a command from the final gate run.
- [x] CHK-021 [P0] Manual testing complete. Evidence: `compiled-route` replays both stages and `compiled-route-status --all` reports every hub compiled-serving.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the `out-of-domain-defer` canary defers with no target and the ambiguous canvas case returns an ordered bundle.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: `check-markdown-links` reports 0 broken links across 14494 links and `compiled-route-sync --check` reports all 55 served copies match.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The reported gap is a class-of-bug: one mode kept a registered owner for guidance that had already moved to another hub.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the baseline records the padding prompt routing to the single fundamentals mode and the advisor answering through sk-design at 0.65.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `plan.md` lists the hub files, the five agent copies, ten repointed documents and the two compiled-routing files.
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction cases are not applicable. Evidence: the change adds no executable parsing or security path.
- [x] CHK-FIX-005 [P1] Matrix axes and row counts are listed. Evidence: stage one replays ten prompts and stage two replays eight value, review and motion prompts plus three sk-design prompts.
- [x] CHK-FIX-006 [P1] Hostile environment variant is not applicable. Evidence: the replay runs on the refreshed advisor cache and no test reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the baseline commit `10474a9567` recorded in `001-frontend-upgrade/scratch/facts.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the change edits Markdown, JSON and one routing compiler.
- [x] CHK-031 [P0] Input validation is not applicable. Evidence: no untrusted input is parsed by the edited files.
- [x] CHK-032 [P1] Auth and authz are not applicable. Evidence: the change adds no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized. Evidence: all three name the deletion, the three-mode hub, the agent path and the compiled-routing change.
- [x] CHK-041 [P1] Code comments are adequate. Evidence: the validator comment-hygiene rule finds no ephemeral marker.
- [x] CHK-042 [P2] README updated. Evidence: the root `README.md` describes sk-design as a parent hub for three modes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Evidence: this packet's `scratch/` holds only `.gitkeep` and the shared evidence file sits at `001-frontend-upgrade/scratch/facts.md`.
- [x] CHK-051 [P1] `scratch/` holds no stray output. Evidence: no file was added to the phase 2 scratch folder.
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
