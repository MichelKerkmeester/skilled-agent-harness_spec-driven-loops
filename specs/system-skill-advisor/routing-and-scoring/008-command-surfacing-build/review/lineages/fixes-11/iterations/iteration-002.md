# Review Iteration 002 — fixes-11

**Lineage:** `fixes-11` (detached fan-out, review pass eleven)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/fixes-11`
**Session:** `fanout-fixes-11-1794851543294-mlt3r6`

## Dispatcher

- **Operator review focus (bound):** review pass eleven, area `fixes`, per `review/review-brief-11.txt`. This iteration traced the focus to its packet evidence: REQ-006 (`039-main-sk-doc-routing-repair/spec.md:134`), AC-006 (`acceptance-criteria.md:59`) and T010/T011 (`tasks.md:60-61`) for the single-quote guard and the doctor runtime naming, and compared each claim with the assertions that actually run.
- **Dimension this iteration:** traceability.
- **Dimensions planned:** correctness (done), traceability, security, maintainability.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | traceability |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | traceability |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | traceability |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | traceability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | traceability |
| `039-main-sk-doc-routing-repair/spec.md`, `acceptance-criteria.md`, `tasks.md`, `implementation-summary.md` (context evidence) | traceability |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `FIX11-P1-001` from iteration 1 remains active; the traceability evidence below widens its record but does not change it.

### P2 Findings

1. **The doctor contract test no longer checks the workflow its title claims** -- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:238` -- The test is titled "the presentation and the workflow name the accepted runtimes instead of a count", but its body reads only `PRESENTATION` and `symlink-manifest.json` (`test:241-243`). The diff removed the only workflow assertion (`assert.match(WORKFLOW.inputs.runtimes, /DSH is not offered/)`), so `WORKFLOW` is now used elsewhere in the file but never for the runtime list. REQ-006 (`spec.md:134`) names the presentation, workflow and contract test as one agreeing set; only two of the three are checked.
Case: remove `dsh` from the runtime list in the `Ask` step at `doctor-install.yaml:58` (or from `inputs.runtimes` at `doctor-install.yaml:46`) and run `doctor-install-contract.test.cjs`; it stays green because no assertion reads `WORKFLOW.inputs.runtimes` or `WORKFLOW.execution.steps` for a runtime name.
Finding class: traceability (test title and requirement claim more coverage than the assertions provide).
Scope proof: `doctor-install-contract.test.cjs` is a reviewed scope file; `WORKFLOW` is loaded at `test:31`; the removed assertion is visible in `git -c core.fsmonitor=false diff 6d50afe6f39 2f3f893c153 -- .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs`; the workflow sentences are at `doctor-install.yaml:46` and `:58`.
Affected surface hints: the `/doctor:install` contract test, `doctor-install.yaml` `inputs.runtimes` and the `Ask` step, and any future edit that changes the runtime set.

2. **AC-006's verification instance is narrower than REQ-006, so a quoted or-list passes the acceptance row** -- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/acceptance-criteria.md:59` -- REQ-006 (`spec.md:134`) states that "a single-quoted command name reads like a plain one before its refusal or question lead"; AC-006's given names only `do not run '/create:readme' yet`, a single command with no list. The acceptance row is `Met` on that instance, while the list form fails (iteration 1, `FIX11-P1-001`). The packet therefore records the requirement as closed without exercising the shape that still breaks.
Case: add the prompt `do not run '/create:agent' or '/create:readme'` to the guards case set; `commandOnlyMentioned(prompt, '/create:readme')` is `false` (iteration 1 evidence), yet AC-006's Given/When/Then at `acceptance-criteria.md:59` names no such input, so the `Met` row is unchanged.
Finding class: traceability (acceptance evidence narrower than the requirement it closes).
Scope proof: `039-main-sk-doc-routing-repair/spec.md` and `acceptance-criteria.md` are the packet documents the review target owns; the code and test evidence is in the reviewed `command-attach.ts:427` and `command-attach-guards.vitest.ts:172-184`.
Affected surface hints: REQ-006, AC-006, T010 evidence at `tasks.md:60`, and the review-report verdict for the quote fix.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `039-main-sk-doc-routing-repair/spec.md:134` (REQ-006) is implemented for the single-command shape (`command-attach.ts:427`, tests at `command-attach-guards.vitest.ts:178-181`) and not for the quoted or-list shape. The doctor half holds: `doctor-install-presentation.txt:78`, `doctor-install.yaml:58`, `.skilled/commands/doctor/assets/symlink-manifest.json` and `symlink-engine.cjs:435-438` all carry the same eight runtimes. |
| `checklist_evidence` | partial | `tasks.md:60` (T010) and `:61` (T011) carry observed evidence, and `acceptance-criteria.md:59` (AC-006) is `Met`; the AC's given is narrower than REQ-006, so the closure evidence does not cover the failing list shape. |

## Integration Evidence

- **Packet → code → test:** `spec.md:134` → `command-attach.ts:427` → `command-attach-guards.vitest.ts:178-181`. The single-command chain is complete; the or-list chain is absent (finding 1 of iteration 1).
- **Manifest → engine → docs:** `.skilled/commands/doctor/assets/symlink-manifest.json` (eight runtime keys) → `symlink-engine.cjs:435-438` (unknown name refused) → `doctor-install-presentation.txt:78` and `doctor-install.yaml:58` (eight names) → `doctor-install-contract.test.cjs:241-243` (list derived from the manifest). Membership agrees at every link.
- **Contract test surface:** `doctor-install-contract.test.cjs:31` loads `WORKFLOW`, and `:144`, `:148`, `:226`, `:254`, `:264`, `:269` use it for commands, step names and variables — never for the runtime list. This is the exact gap in `FIX11-P2-001`.
- **Implementation record:** `implementation-summary.md:62` describes the quote change as "a single quote that opens a command name is dropped before the lead reading", which matches the code; it makes no claim about or-lists, so it is not contradicted.

## Edge Cases

- **AC instance vs requirement breadth.** The acceptance criterion is not false; it is scoped to one input. The finding is that the packet's closure evidence does not represent the requirement's general claim.
- **Test title as documentation.** `doctor-install-contract.test.cjs:238` is the only place that promises workflow coverage; a reader auditing the contract test would believe the workflow list is guarded.
- **Overlay protocols.** `skill_agent` and `agent_cross_runtime` were not run: no agent definition or runtime mirror changed in this scope, so they are outside the reviewed surface rather than unverified evidence.

## Confirmed-Clean Surfaces

- The doctor router (`install.md:37`), the symlink router (`symlink.md:57`), the symlink workflow assets and the install presentation all list the same eight runtimes; no ninth runtime appears in any doctor asset.
- No stale `DSH is not offered` or `outside the seven/eight/nine` text remains in the doctor assets; the only surviving match for those patterns is the test's own negative assertion.
- The packet's `tasks.md:60-61` evidence matches what was observed: three single-command quote cases gate the fold, and the doctor tests were reported at 1266/0 with the contract at 17/17.

## Ruled Out

- **Stale compiled advisor build** — `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js:369-378` carries the new fold; source and shipped build agree.
- **Manifest membership drift** — the manifest, engine check, both doctor docs and the contract test agree on the eight names.
- **Unbacked implementation summary** — `implementation-summary.md:62` describes only the behaviour the code has; the missing or-list handling is not claimed there.

## Next Focus

- **Dimension:** security.
- **Focus area:** whether the mention guard can be evaded by quote placement to make the advisor offer or deliver a command the prompt refused, and whether the doctor install's printed writing commands can carry operator input beyond the values it validated.
- **Reason:** the guard's purpose is to keep a mutating command from being offered on a refusal; iteration 1 found one reachable evasion, so the adversarial pass should map the family rather than add a second instance of it.
- **Rotation status:** correctness and traceability reviewed; security next, maintainability last.
- **Blocked/productive carry-forward:** traceability is productive (two P2s, both with a concrete mutation that keeps tests green); no approach is blocked.
- **Required evidence:** compiled-module runs over quote/lead permutations (brace, quote, apostrophe, list joins), and the presentation's printed-command invariants at `doctor-install-presentation.txt:5` and `:139`.

**Stop decision after iteration 1:** CONTINUE; `stopReason` none; `blockedBy` empty; the coverage gate names `security`, `traceability` and `maintainability` as the missing dimensions at that point, and `traceability` is now covered.

Review verdict: CONDITIONAL
