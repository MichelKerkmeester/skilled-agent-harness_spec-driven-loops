# Cross-phase handoff: work the plan review found unowned

Written 2026-11-17 while applying the Fable 5.2 plan review (`fable-5-2-plan-review.md`) to phases 010, 011 and 014. Those three phases were edited directly. Phases 001-009, 012 and 013 were being edited by other agents at the same time, so nothing in their folders was touched. This file lists what each of those phases has to add so the unowned work in X-6 has an owner.

Shorthand: `S` = `.skilled/skills/system-deep-loop`, `C` = `.skilled/commands/deep/assets`.

---

## 1. Operator decision that binds every phase

On 2026-11-17 the operator decided that **each implementation phase writes its own manual testing playbook scenarios** through `/create:manual-testing-playbook system-deep-loop update --path <playbook dir>`. Phase 014 no longer writes scenarios. It checks that each row below has one, updates the feature catalogs and runs the two alignment checks.

Each phase below needs one task: "Write the scenario for this phase's user-visible behavior through `/create:manual-testing-playbook` into the category named here. Verify: the command completes and `rg -l` for the flag or behavior prints a file in that category."

| Phase | Behavior the scenario exercises | Playbook category |
|-------|---------------------------------|-------------------|
| 001 | `--extend=N` on a completed run | `S/deep-research/manual-testing-playbook/entry-points-and-modes/`, `S/deep-review/manual-testing-playbook/entry-points-and-modes/` |
| 002 | Research on `cli-claude-code` honors the configured Claude config dir | `S/runtime/manual-testing-playbook/executor/` |
| 003 | A review run never stops before `minIterations` | `S/deep-review/manual-testing-playbook/convergence-and-recovery/` |
| 004 | Next Focus ignores answered free text; review picks an uncovered dimension | `iteration-execution-and-state-discipline/` in both loop playbooks |
| 005 | The research prompt pack allows `research/research.md` and uses `Recommended Next Focus` | `S/runtime/manual-testing-playbook/prompt-rendering/` |
| 006 | The `findings_not_enumerated` gate and the `focusAlignment` guard run on real leaf fields | `S/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/` |
| 007 | Source diversity reads derived `quality_class` values | `S/runtime/manual-testing-playbook/coverage-graph/` |
| 008 | Custom review dimensions are tracked and can be covered | `S/deep-review/manual-testing-playbook/initialization-and-state-setup/`, `review-depth-v2-rollout/` |
| 009 | A merged fan-out review keeps its coverage surfaces | `S/deep-review/manual-testing-playbook/fanout/` |
| 012 | Council seat cap of 3 per attempt and one quorum retry per pivot | `S/runtime/manual-testing-playbook/council/` |
| 013 | A landed iteration is not dispatched a second time | `S/runtime/manual-testing-playbook/executor/` |

001 lists "both loop playbooks" as Modify in its Files to Change. Under this decision that entry stays in 001, written through the command rather than by hand.

---

## 2. Now owned by 010 and 011 (nothing for other phases to add)

| Unowned item (X-6) | Owner now |
|--------------------|-----------|
| `depth_mode` binding in `C/deep-research-presentation.txt` | 010 (T006) |
| `depth_mode` binding in `C/deep-review-presentation.txt` | 011 (T007) |
| Init-time seeding of depth-1 frontier nodes (research §9) | 010 `step_frontier_seed` (T012), 011 review seed step (T012) |
| `--depth-mode` passthrough to fan-out lineages (`fanout-run.cjs:31`, `:1658-1680`) | 010 (T021, T022) for research, 011 (T021, T022) for review |
| Merged `frontier` projection | 010 in `mergeResearchRegistries` (T023), 011 in `mergeReviewRegistries` (T023). **009 does not need to add `frontier`**: F009-1's second bullet is answered by this assignment |
| Research and review reference docs for the frontier | 010 (T026), 011 (T025) |
| Changelog entries for `--depth-mode` | 010 (T028), 011 (T027) |
| Compiled-contract regeneration after the frontier changes | 010 (T029), 011 (T028) |
| Agent mirrors for `frontier_proposal` | 010 (T017), 011 (T009) |

---

## 3. What each other phase must add

Each item cites the plan-review finding it comes from. Verify the finding against the code before adding the task: a finding is a hypothesis.

### Presentation assets
- **001** (F001-1): bind the extension in `C/deep-research-presentation.txt` and `C/deep-review-presentation.txt`, beside the existing `lineage_mode: auto|resume|restart` bindings, and add a binding case to `S/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts`.
- **008** (F008-1): the review presentation hard-codes the four dimension names. Add the input surface for a custom dimension there, or narrow REQ-003 as the finding offers.

### Reference docs
- **001** (F001-5): the deferred-wording sites the REQ-010 grep misses: `S/deep-research/README.md`, `S/deep-research/references/guides/capability-matrix.md`, `S/deep-research/feature-catalog/loop-lifecycle/initialization.md`, `S/deep-research/references/protocol/loop-protocol.md`; widen the grep to "not wired", "reserved" and "MUST NOT be exposed".
- **003** (F003-2): the review stop-order line for the new floor in `C/deep-review.yaml`, and the floor sentence in `S/deep-review/README.md`.
- **008** (F008-1): `S/deep-review/assets/review-mode-contract.yaml`, the review strategy and dashboard assets, and the agent lines that name four dimensions.
- Every other phase: update any reference doc, `README.md` or `SKILL.md` that describes the behavior it changes. Phase 014 fixes what the alignment checks still find, but a phase that leaves its own docs stale hands 014 a finding it could have closed.

### Changelog entries (F014-2)
Only 006 plans one today. Each phase that changes default-path behavior or adds a flag adds an entry under the owning changelog folder (`S/deep-research/changelog/`, `S/deep-review/changelog/` or `S/changelog/`), through `/create:changelog`:
- adds a flag: **001**
- changes default-path behavior: **003**, **004**, **005**, **007**, **008**
- fixes a defect an operator can see: **002**, **009**, **012**, **013**
- 004 and 007 currently write the note into `implementation-summary.md` only (their T010).

### Compiled contracts (X-1)
Add "regenerate and commit the contract" as the last implementation task, through `node S/runtime/scripts/compile-command-contracts.cjs --command deep/<research|review> --write`, with `check-contract-drift.vitest.ts` as the check:
- research contract: **001**, **002**, **012**, **013** (005 already plans it)
- review contract: **001**, **008**, **012**, **013**, and **003** if it takes F003-2
- After each merge, regenerate on the merged tree instead of resolving the digest lines by hand.

### Agent mirrors (X-2)
- **001** edits both agent definitions; all ten mirror files carry the `completed-continue` wording it changes. Add a mirror-sync task and run `/doctor:runtime-mirrors`.
- **008**, if it edits `.skilled/agents/deep-review.md`.

### Test command form (X-7)
- **002**, **003** and **013** run `cd S && npx vitest run runtime/tests/...`, which finds no test file. Use `cd S/runtime && npm test -- tests/unit/<file>`.

### Order (X-4, X-5)
- **004** starts after **005** merges: 004 REQ-002 reads a heading the pack emits only after 005.
- **013** and **006**: decide 013's open question (which landed reasons skip redispatch) before either builds, because 006 switches on `findings_not_enumerated`, a reason returned after the delta lands.
- **012** merges before **010** and **011**, which gate the pivot branch 012 rewrites.
- **003** and **004** merge before **011**.
