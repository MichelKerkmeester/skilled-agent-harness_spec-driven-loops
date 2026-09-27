# Deep Review — Iteration 1 (correctness)

Run: run-001 · Session: 2026-09-26T17:35:08Z · Generation 1 · Lineage: new
Target: skill:sk-create-goal (.skilled/skills/sk-doc/sk-create-goal) plus every cross-repo surface that names it
Agent definition loaded: `.skilled/agents/deep-review.md` (agent_definition_loaded: true)

## Dimension

correctness — every behavioral claim the mode makes checked against what the code does.

Focus areas for this iteration:

1. `SKILL.md`, the three references and the three asset templates against `scripts/check-goal.cjs`, `.skilled/hooks/goal/lib/goal-slice.cjs` and `.skilled/hooks/goal/bin/goal.cjs`.
2. Re-measurement of the fixed costs in `references/budget-and-handoff.md` section 6 (1,624 / 1,004 / 956 durable characters).
3. The six `/create:goal` operations (top-level, phase-parent, child, retrofit, phase-add, amend) across `goal.md`, `create-goal-auto.yaml`, `create-goal-confirm.yaml`, `create-goal-presentation.txt`.
4. The send rule: 4,000 measured on the durable slice, chat slice deletion-only, send only at `packet_budget=ok`.

Commands run (read-only): `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --help`, `node .skilled/hooks/goal/bin/goal.cjs --help`, in-memory `node -e` measurements through the shared `goal-slice.cjs` module, `rg`/`awk` line-range dumps. No scratch packet was created and no file outside the review packet was written.

## Files Reviewed

Claim surfaces (read in full):
- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:1`
- `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:1`
- `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:1`
- `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:1`
- `.skilled/skills/sk-doc/sk-create-goal/assets/goal-top-level-template.md:32`
- `.skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-parent-template.md:33`
- `.skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-child-template.md:34`
- `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:1`
- `.skilled/commands/create/goal.md:1`
- `.skilled/commands/create/assets/create-goal-auto.yaml:1`
- `.skilled/commands/create/assets/create-goal-confirm.yaml:1`
- `.skilled/commands/create/assets/create-goal-presentation.txt:1`

Implementations (read in full):
- `.skilled/hooks/goal/lib/goal-slice.cjs:1`
- `.skilled/hooks/goal/bin/goal.cjs:1`
- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:1`

Cross-surface claim scans (targeted):
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24`, `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:28`, `.skilled/commands/speckit/assets/speckit-plan.yaml:189`, `speckit-implement.yaml:154`, `speckit-complete.yaml:247`, `speckit-resume-auto.yaml:47`, `speckit-resume-confirm.yaml:47`, `.skilled/hooks/goal/README.md:75`, `.skilled/hooks/goal/goal-plugin.md:153`, `.cursor/commands/goal-cursor.md:10`, `AGENTS.md:187`, `README.md:874`, `.skilled/skills/sk-doc/sk-create-goal/README.md:92`.

## Confirmed Claims (no finding)

- **Fixed costs, budget-and-handoff.md section 6 — CONFIRMED by measurement.** `extractDurableSlice` (the same module `goal.cjs packet` uses) run in memory over each unfilled template block gives top-level **1,004**, phase parent **1,624**, phase child **956** durable characters — exact match with the claimed figures. Measurement, not inference: the shared module was executed on the blocks; no scratch packet was written (that would write outside the review packet).
- **Send-rule invariant — CONFIRMED in code.** `renderChatSlice` (goal-slice.cjs:73-80) is a deletion-only projection of `extractDurableSlice` output (goal-slice.cjs:59-63, comments and anchors counted); `budgetState` (goal-slice.cjs:384-387) returns `ok` at exactly 4,000, matching "A count of 4,000 is within budget". Every restatement scanned (AGENTS.md:187, goal-set-string-playbook.md:28/65, speckit plan/implement/complete/resume payloads) agrees: measure on the durable slice, send only at `packet_budget=ok`. No in-scope surface states otherwise except the presentation gap in R1-P2-004.
- **Citation line ranges — CONFIRMED.** Manifest 24-28 = `goalDurableBudget`; goal.cjs 203-216 = `runPacket` output; goal-slice.cjs 52-63 / 73-80 / 107-119 / 268-285 / 380-387 all land on the cited functions; goal hooks README 75-84; goal-plugin 155-170; `.cursor/commands/goal-cursor.md` 10 and 14-19. One exception: R1-P2-005.
- **Six operations — CONFIRMED defined, reachable and consistent.** `top-level`, `phase-parent`, `child`, `retrofit`, `phase-add`, `amend` appear identically in `goal.md` (argument-hint, input gate item 4, section 3), both workflow YAMLs (`input_contract`, `field_handling.operation.validation`, `step_pick_operation`), and the presentation contract (sections 3 and 5). Each maps to a named workflow in `parent-and-nested-goals.md` sections 2-6, and the retrofit/amend semantics agree word-for-word across the files.
- **Tooling-claim sanity.** `check-goal.cjs` resolves its `goal-slice.cjs` require and default workspace root correctly (scripts/../../../../../ = repo root); its four checks (missing-binding-row, placeholder, criteria-count, parent-budget) match what `scripts/README.md`-referenced surfaces claim about the checker.

## Findings by Severity

### P0 (Critical)

None.

### P1 (Major)

#### R1-P1-001 — "Phase children are exempt from the 4,000 cap" contradicts `budgetApplies()`; nested phase parents and phase-level children are measured

- **File:** `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:33` (also `SKILL.md:108`, `assets/goal-phase-child-template.md:25`, `sk-create-goal/README.md:92`, `goal-set-string-playbook.md:65`, `spec-kit-docs.json:26`, speckit-plan/implement/complete.yaml budget strings)
- **Evidence:** budget-and-handoff.md:33 — "Phase children are exempt from the cap, so their packet report has `packet_budget=unknown`." Against `goal-slice.cjs:380-382`:
  `function budgetApplies(packetAbsolute) { return !isPhaseChild(packetAbsolute) || isPhaseParentFolder(packetAbsolute) || declaresPhaseLevel(packetAbsolute); }`
  and the module's own comment (goal-slice.cjs ~292-296): "no budget applies to it **unless it is itself a phase parent**" and "The validator budgets every folder it resolves to the phase level, **even one nested inside another packet**, and exempts only the other phase children."
- **Impact:** For a phase child that is itself a phase parent, or whose spec.md declares the phase level, `goal.cjs packet` applies the budget and reports `ok`/`over`, while every citing surface promises exemption and `packet_budget=unknown`. A doc-faithful author never trims such a goal; the checker passes it (R1-P2-002); the send rule (budget-and-handoff.md:54) then refuses the only send path. The contradiction is observable in the packet report the same doc tells the reader to trust.
- **Fix:** Replace the first sentence of budget-and-handoff.md:33 with: "A phase child is exempt from the cap only when it is not itself a phase parent and its spec.md does not declare the phase level; those are measured like any parent and report `ok` or `over`. An exempt child's packet report has `packet_budget=unknown`." Mirror the boundary at SKILL.md:108, goal-phase-child-template.md:25, sk-create-goal/README.md:92, goal-set-string-playbook.md:65 and the three speckit budget strings.
- **findingClass:** doc_code_contradiction

**CLAIM ADJUDICATION (R1-P1-001)**
- **claim:** Phase-child goals are exempt from the 4,000-character durable budget and their packet report always shows `packet_budget=unknown`.
- **evidenceRefs:** `.skilled/hooks/goal/lib/goal-slice.cjs:297`, `:380`, `:384`; `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:33`; `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:339`.
- **counterevidenceSought:** Searched for a structure guarantee that no phase child can itself be a phase parent or declare a phase level. Found the opposite: the goal-slice comment states the validator budgets "every folder it resolves to the phase level, even one nested inside another packet". Also checked whether `budgetApplies()` short-circuits before the phase-parent tests; it does not (`||` makes the exemption conditional).
- **alternativeExplanation:** The surfaces use "phase children" as shorthand for pure leaf children, with nested parents covered by the "phase parent" clause. Rejected: the sentences assert the resulting report state ("has `packet_budget=unknown`"), which is observably wrong for a nested parent, and the child template states the exemption absolutely.
- **finalSeverity:** P1 (not P0: the packet report and the send gate still stop a bad goal from being sent; the defect misleads authoring and the checker, not the release gate).
- **confidence:** 0.85 on the code reading; the claim is falsified for any reachable nested-parent or phase-level child.
- **downgradeTrigger:** Downgrade to P2 if the packet-structure rules forbid any phase child from carrying its own phase children and from declaring a phase level, i.e. the `isPhaseParentFolder || declaresPhaseLevel` branch is unreachable in this repository.

### P2 (Minor)

#### R1-P2-002 — `check-goal.cjs` skips the parent-budget check for every phase child, diverging from `goal.cjs` on nested phase parents
- **File:** `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:339`
- **Evidence:** `if (context.isPhaseChild) return [];` where `isPhaseChildFolder` (line 76) tests only "parent directory contains spec.md", versus `goal-slice.cjs:380-382` which additionally budgets phase parents and phase-level children. Same packet → `check-goal` reports `parent-budget PASS`, `goal.cjs packet` reports `packet_budget=over`.
- **Impact:** SKILL.md:110 tells authors to run and trust the checker; on the nested case it reports a clean budget for a goal the packet report rejects, and budget-and-handoff.md:66 presents the three tools as measuring the same thing.
- **Fix:** In `evaluateParentBudget`, skip only when the packet is a phase child AND not a phase parent folder AND does not declare the phase level (mirror `budgetApplies()`).
- **findingClass:** tool_divergence

#### R1-P2-003 — `goal.cjs` routes unrecognized tokens (including flags like `--help`) into the `set` action, and `FAIL` exits 0
- **File:** `.skilled/hooks/goal/bin/goal.cjs:388` (and the default branch at :426-431)
- **Evidence:** `const normalizedAction = core.ACTIONS.includes(action) ? action : 'set';`; default branch calls `runSet(parsedScope.argv, ...)`. Observed: `node .skilled/hooks/goal/bin/goal.cjs --help` → `STATUS=FAIL ACTION=set ERROR="Session identity is required" code=MISSING_SESSION_ID`. `printFail()` sets no exit code and `main()` sets none, so failures exit 0.
- **Impact:** With a live session identity, a mistyped action or a help request silently replaces the session objective with the raw token text; scripts cannot detect failure from exit status. Also weakens SKILL.md:158, which introduces `goal.cjs` only as a printer of slices "without binding a session" while the same binary mutates session state on bare text.
- **Fix:** Refuse flag-shaped tokens (`-` prefix) with `UNKNOWN_ACTION` in the default branch instead of falling through to `set`; consider requiring the explicit `set` action for objective replacement; set `process.exitCode = 1` in `printFail()`.
- **findingClass:** state_mutation_footgun

#### R1-P2-004 — Presentation contract renders the `/4000` measurement for exempt children and its handoff wording omits the `packet_budget=ok` send gate
- **File:** `.skilled/commands/create/assets/create-goal-presentation.txt:108` (and :111, :127)
- **Evidence:** Line 108 renders `Measured : durable {chars}/4000 chars · packet_budget={state}` for every operation, including `child` (state `unknown`); lines 111 and 127 say "set or resend it" / "Give the printed chat slice to your runtime's goal hook to set or resend the objective" with no condition. The canonical rule (budget-and-handoff.md:54) sends the `chat_slice` "only when the same report shows `packet_budget=ok`".
- **Impact:** The operator-facing surface is where the send gate should be restated at handoff; without it the workflow can render a slice alongside `packet_budget=over`/`unknown` (over-budget escalation path, child operations) and the wording invites handing it over anyway. The hardcoded `/4000` denominator also misstates the cap for exempt children.
- **Fix:** Render the denominator only when the report measures the packet (`durable {chars} chars · packet_budget={state}`), and append to lines 111 and 127: "send it only when the report shows `packet_budget=ok`; cut the file first when it is over."
- **findingClass:** contract_inconsistency

#### R1-P2-005 — budget-and-handoff.md Devin row cites goal-plugin line 170, which documents the shared CLI, not Devin wiring
- **File:** `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:87`
- **Evidence:** The row cites "(goal plugin, lines 158 and 170)". `goal-plugin.md:158` is the Devin row of the support matrix; `goal-plugin.md:170` is the shared-CLI action-envelope paragraph and says nothing about Devin. The "no Devin prompt-command surface" evidence is line 158 plus the command-surface table at 162-168 (OpenCode, Cursor, Pi only).
- **Impact:** One of two cited lines does not support the claim; a reader verifying the runtime matrix lands on unrelated text. The claim itself is supported by line 158.
- **Fix:** Change "goal plugin, lines 158 and 170" to "goal plugin, lines 158 and 162 to 168".
- **findingClass:** citation_mismatch

## Traceability Checks

| Protocol | Level | Status | Note |
|----------|-------|--------|------|
| spec_code | core | deferred | 012 REQs not compared; correctness iteration ran claim-vs-code checks only |
| checklist_evidence | core | deferred | acceptance-criteria rows left for D3 |
| skill_agent | overlay | not_run | D3 |
| agent_cross_runtime | overlay | not_run | D3 |
| feature_catalog_code | overlay | not_run | D3 |
| playbook_capability | overlay | not_run | D3 (playbook scenario runnability not yet exercised) |

Quality gates: **evidence** — every finding carries a quoted line or command output; **scope** — 26 of 89 scope files opened plus targeted `rg` scans across the remaining cross-repo surfaces; **coverage** — all four iteration focus areas examined.

## Search Depth (v2)

scopeClass=complex, enforcement=strict. Nine search-ledger rows: three `ruled_out` (fixed-cost drift, six-operation gap, chat-slice leak; plus one citation-range sweep) and five `finding`-linked rows matching the five findings above. Graph coverage `unavailable_blocked` (no resource map in this packet); discovery by direct read, exact search and command execution.

## SCOPE VIOLATIONS

None. No path outside the review packet was created, modified or deleted; the reviewed target was treated as read-only. Per the run's state-recording override, `append-mode-event.cjs` was not invoked and `deep-review-state.jsonl` was not written directly; the orchestrator records the iteration from the first line of `deltas/iter-001.jsonl`.

## Verdict

**CONDITIONAL** — 1 P1 (R1-P1-001), 4 P2 (R1-P2-002..005), 0 P0. New findings ratio 1.0 (first iteration, no priors). The P1 is a claim-versus-code contradiction on the budget exemption boundary with exact replacement text proposed; it is adjudicated above and carries a downgrade trigger.

## Next Dimension

security (D2). Suggested focus: path handling and untrusted-content surfaces in `goal-slice.cjs` (`resolvePacketDir` symlink containment, `FRONTMATTER_PATTERN` fail-closed behavior, `renderResendReminderText` injection of `recordCommand`), `check-goal.cjs` corpus walk (`walkGoalFiles` symlink/readdir behavior, `TEMPLATE_BLOCK` regex on asset files read at module load), and the kill-switch/`OPENCODE_GOAL_RUNTIME_LABEL` environment paths in `goal.cjs` and `goal-core.cjs` — plus whether a crafted `goal.md` (hostile frontmatter, enormous anchors, CRLF/invalid UTF-8) can escape the documented `GOAL_NOT_UTF8` / fail-closed behavior.

Review verdict: CONDITIONAL