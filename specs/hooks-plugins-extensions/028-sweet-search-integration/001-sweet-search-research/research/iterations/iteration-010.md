# Iteration 10: Phase 2 contents and the growth gate

## Focus

Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later? This pass builds on iterations 1–6 and runs in parallel with Q7–Q9; it does not reopen those questions.

## Actions Taken

- Read the config, state projection, strategy, registry and iterations 5–6 before selecting Q10. Iterations 7–9 were not present under `research/iterations/` at read time (parallel siblings), so this pass builds only on 1–6 and flags that dependency.
- Read the phase-parent and phase-1 handoff criteria, the Level 2 child packet shape, and a recent Level 2 acceptance-criteria example.
- Checked the sk-code hub's version-authority contract and current release files to size the pointer change, and re-read the restraint rule that decides between "build nothing" and the pointer.
- No runtime change, install, index or benchmark was attempted.

## Findings

1. **Phase 2 should be decision-only: record "no integration now" plus a pre-registered growth gate, and change no runtime file.** The restraint rule starts at "build nothing" and permits a costlier move only when a failure exists today; iteration 6 found no demonstrated Skilled user need and no measured gain for markdown, skill or spec work. The optional pointer fixes no current failure, so it is not phase 2 — it is the pre-approved phase 3 move if the gate fires. [SOURCE: .skilled/repo-rules/prevent-overengineering.md:45] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:48] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:60] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md:15]

2. **The phase 2 file list is the standard Level 2 child shape plus the parent map update; no `.skilled/` file changes.** The child carries `spec.md`, `description.json`, `graph-metadata.json`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and a `decision-record.md`. The decision record is the phase's core artifact; a Level 2 packet with one is already precedented in `027-ask-surface-enforcement`, though the structure reference lists `decision-record.md` as Level 3+. The parent needs its Phase Documentation Map and handoff row updated, plus the derived child pointer in its `graph-metadata.json`. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:145] [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:162] [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:163] [SOURCE: specs/hooks-plugins-extensions/027-ask-surface-enforcement/spec.md:13] [SOURCE: specs/hooks-plugins-extensions/024-dispatch-adapter-test-repair/acceptance-criteria.md:54] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/spec.md:95]

3. **The "one-paragraph pointer" is a five-file sk-code hub release, not a one-line edit.** The hub's version authority ties `SKILL.md`'s frontmatter to the newest changelog entry, and the same version sits in `description.json`, `mode-registry.json` and `hub-router.json`. A pointer in `SKILL.md` §2 therefore also needs a new `changelog/v3.11.5.0.md` entry and a version bump in all four files. That is still cheap and reversible, but phase 3 must budget for it and check consistency. [SOURCE: .skilled/skills/sk-code/SKILL.md:20] [SOURCE: .skilled/skills/sk-code/SKILL.md:5] [SOURCE: .skilled/skills/sk-code/description.json:4] [SOURCE: .skilled/skills/sk-code/mode-registry.json:3] [SOURCE: .skilled/skills/sk-code/hub-router.json:3] [SOURCE: .skilled/skills/sk-code/SKILL.md:72]

4. **The growth gate should be two falsifiable triggers plus a measurement protocol, not a date or a hunch.** Trigger A is an observed failure of the existing search path in a real task: a recorded query where `rg`/Grep plus the committed trigger index missed a code location that Sweet Search finds, with the repo and both outcomes. Two independent occurrences in two repos, or one that blocks an external-repo task, open phase 3. Trigger B is an independent, reproducible benchmark on Skilled-style corpora showing a pre-registered reduction in search tool calls or tokens with no correctness drop; vendor eval data alone does not count. Phase 3 is the conditional pointer; phase 4 (doctor install, Code Mode mirror, or a new mcp-tooling mode) opens only if the pointer demonstrably fails to close the measured gap. [SOURCE: .skilled/repo-rules/prevent-overengineering.md:48] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:134] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:167] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md:19] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md:17] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md:19]

5. **Phase 1's own handoff is not met yet: `research/research.md` is absent.** The phase-1 spec requires that synthesis to state a verdict with source tags, and the parent handoff requires a named verdict and one recommended surface before a build phase is planned. Phase 2's entry check must include that file and a passing phase-1 validation. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/spec.md:30] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/spec.md:112] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/spec.md:49]

## Phase 2 Blueprint

### Recommended phase 2: `002-sweet-search-decision/` (Level 2, decision-only)

**File list**

| Path | Change |
|------|--------|
| `specs/hooks-plugins-extensions/028-sweet-search-integration/002-sweet-search-decision/spec.md` | Create — verdict, scope, requirements, entry gate |
| `.../002-sweet-search-decision/description.json` | Create — packet metadata |
| `.../002-sweet-search-decision/graph-metadata.json` | Create — packet graph metadata |
| `.../002-sweet-search-decision/plan.md` | Create — how the decision and gate are recorded |
| `.../002-sweet-search-decision/tasks.md` | Create — decision, gate, validation tasks |
| `.../002-sweet-search-decision/acceptance-criteria.md` | Create — AC-001 to AC-007 below |
| `.../002-sweet-search-decision/decision-record.md` | Create — verdict, rejected surfaces, growth gate |
| `.../002-sweet-search-decision/implementation-summary.md` | Create at close |
| `specs/hooks-plugins-extensions/028-sweet-search-integration/spec.md` | Edit — add phase 2 row and handoff row |
| `specs/hooks-plugins-extensions/028-sweet-search-integration/graph-metadata.json` | Edit — derived child pointer |
| `.skilled/**` | No change |

**Acceptance checks**

- **AC-001 — Verdict recorded.** `decision-record.md` states "no integration now" and every claim cites `research/research.md` or a named iteration. Verify: `rg -n 'verdict|Decision' decision-record.md` and a source tag on each claim.
- **AC-002 — Rejected surfaces carry reasons.** The pointer, Code Mode/UTCP mirror, doctor-owned install, new mcp-tooling mode and system-spec-kit retrieval hook each name their cost and why they are not taken now. Verify: one row or paragraph per surface.
- **AC-003 — Growth gate is falsifiable.** Trigger A, Trigger B and the measurement protocol are written with thresholds and an evidence owner. Verify: the gate names the query, repo, baseline and threshold fields.
- **AC-004 — No runtime change.** `git diff --stat` lists only files under `specs/hooks-plugins-extensions/028-sweet-search-integration/`; `.skilled/` is untouched. Verify: the diff stat shows no `.skilled/` path.
- **AC-005 — Packet validates.** `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase-2-folder> --strict` prints `RESULT: PASSED`, and the parent `--recursive --strict` run passes. Verify: the exact RESULT line.
- **AC-006 — Phase 1 handoff met.** `001-sweet-search-research/research/research.md` exists with a verdict section and `[SOURCE:` tags, and phase 1 validates. Verify: `rg -n -i 'verdict' research/research.md` and a passing phase-1 run.
- **AC-007 — Parent map updated.** The parent Phase Documentation Map lists phase 2 and its status, and the handoff row names phase 2's entry condition. Verify: both rows present in `spec.md`.

**Measurement that would justify growing the integration later**

- **Trigger A — observed retrieval failure.** A real Skilled task where `rg`/Grep plus the committed trigger index missed a code location that Sweet Search found. Record the query, repo, what the existing path returned, what Sweet Search returned, and the task outcome. Threshold: two independent occurrences in two repos, or one that blocks an external-repo task.
- **Trigger B — independent benchmark.** A reproducible, pre-registered comparison on Skilled-style corpora (large markdown/skill trees, spec folders, TypeScript runtime). Protocol: three representative tasks × two conditions (existing path vs Sweet Search MCP), fixed model and prompt, count search tool calls, input/output tokens, wall time and answer correctness; report baseline and delta. Threshold: a pre-registered reduction (for example, at least 20% fewer search tool calls) with no correctness drop. Vendor eval data alone does not count.
- **Trigger C — adoption report (optional).** Three independent external-repo reports asking how to wire Sweet Search into Skilled's code workflow. This is a discoverability signal, not a performance claim.
- **Growth ladder.** Trigger A or C opens phase 3: the conditional pointer. Phase 4 (doctor install, Code Mode mirror, new mcp-tooling mode) opens only if the pointer demonstrably fails to close the measured gap. No trigger means phase 2 closes with the decision record and no runtime change.

### If the operator overrides and makes the pointer phase 2

**File list**

| Path | Change |
|------|--------|
| `.skilled/skills/sk-code/SKILL.md` | Edit — one conditional paragraph in §2, exact wording from Q9 |
| `.skilled/skills/sk-code/changelog/v3.11.5.0.md` | Create — hub release entry |
| `.skilled/skills/sk-code/description.json` | Edit — version `3.11.5.0` |
| `.skilled/skills/sk-code/mode-registry.json` | Edit — version `3.11.5.0` |
| `.skilled/skills/sk-code/hub-router.json` | Edit — version `3.11.5.0` |
| `002-sweet-search-pointer/` packet docs | Create — spec, description, graph metadata, plan, tasks, acceptance criteria, implementation summary |
| `028-sweet-search-integration/spec.md` and `graph-metadata.json` | Edit — phase map and derived pointer |

**Additional acceptance checks:** the pointer is conditional on Sweet Search being installed, names the existing `rg`/Grep fallback, makes no performance claim, adds no script, installer or MCP registration, keeps routing unchanged for sample prompts, and the four version values plus the changelog entry agree.

## Ruled Out

- Making the pointer phase 2 without a demonstrated need: it fixes no current failure and spends attention on every code query.
- Treating the pointer as a one-line change: the hub release cost is five files.
- Running a paid agent benchmark inside phase 2: research non-goals exclude it; the measurement is a protocol for a later phase.

## Dead Ends

- No new dead ends. The Q5/Q6 surface rulings still hold.

## Edge Cases

- Ambiguous input: "phase 2" could mean the next child of the 028 phase parent or a second phase of `001-sweet-search-research`. Selected: the next child of the 028 phase parent, because `001` is a single-phase research child and the parent map has one phase. Deferred: re-reading if the operator meant a second research phase.
- Contradictory evidence: iteration 5 recommends the pointer; iteration 6 finds no demonstrated need. Resolution: keep both; phase 2 records the no-integration decision, and the pointer stays as the pre-approved phase 3 move.
- Missing dependencies: iterations 7–9 were absent at read time (parallel siblings). Q10's answer does not depend on them, but phase 2 entry should fold their answers into the decision record.
- Partial success: none; Q10 is answered from packet and repository evidence.

## SCOPE VIOLATIONS

None. Only the iteration narrative, the delta file and the append-gateway record were written.

## Questions Answered

- Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later?

## Questions Remaining

- Q7, Q8 and Q9 are with the parallel sibling iterations.
- `research/research.md` is still absent; it is the phase 2 entry gate.

## Assessment

- New information ratio: 0.70. One new finding (the five-file hub release cost), one new concrete file list, two partially new phase-design findings, and one redundant restatement yield 0.60 before a 0.10 simplicity bonus for resolving Q10 with a smaller phase model.
- Questions addressed: Q10.
- Questions answered: Q10.

## Reflection

- What worked and why: reading the phase-parent handoff and the hub version contract together turned "phase 2" from a vague next step into a file list and an acceptance gate; the version contract exposed the hidden five-file cost.
- What did not work and why: the parallel siblings' answers were not on disk, so Q10 could not use Q7–Q9. The decision is robust to either outcome, but phase 2 entry must re-check them.
- What I would do differently: if phase 2 is dispatched immediately, read iterations 7–9 first and fold their answers into the decision record.

## Recommended Next Focus

Phase 2 should open with the decision record and the growth gate. Before writing the pointer in phase 3, run the Trigger A observation or a pre-registered Trigger B benchmark.

## Sources Consulted

- specs/hooks-plugins-extensions/028-sweet-search-integration/spec.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/spec.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-config.json
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-state.jsonl
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-strategy.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/findings-registry.json
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md
- specs/hooks-plugins-extensions/024-dispatch-adapter-test-repair/acceptance-criteria.md
- specs/hooks-plugins-extensions/027-ask-surface-enforcement/spec.md
- .skilled/repo-rules/prevent-overengineering.md
- .skilled/skills/sk-code/SKILL.md
- .skilled/skills/sk-code/description.json
- .skilled/skills/sk-code/mode-registry.json
- .skilled/skills/sk-code/hub-router.json
- .skilled/skills/sk-code/changelog/ (release names)
- .skilled/skills/system-spec-kit/references/structure/phase-definitions.md
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs

**Status: complete.** Q10 is answered with a decision-only phase 2, its file list and acceptance checks, and a two-trigger measurement gate for any later growth.
