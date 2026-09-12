---
iteration: 5
focus: "traceability — the review target's own claims, and the two deferred rows"
dimensions: [traceability, maintainability]
started_at: "2026-09-11T13:10:00Z"
status: complete
---

# Iteration 005 — traceability: the review target's own claims, and the two deferred rows

## Scope

The four earlier iterations reviewed the shipped code. This one turns to the review target itself — the phase-007 packet — and to the closeout of the phase that followed it. It checks each requirement, success criterion and task row against what is on disk now, then judges the two rows phase 008 deferred. The target is a closed Level 1 packet, so its claims are read as evidence, not as in-progress state.

Surfaces read: 007 `spec.md`, `tasks.md`, `implementation-summary.md`, `goal.md`, `plan.md`; `008-hardening-research/implementation-summary.md`; the parent `036-goal-unification/goal.md` log; `002-decisions-and-contract-freeze/decision-record.md` (ADR-002); `.opencode/skills/.state/goal/README.md` and the store's disk state; `008` research lineage `research.md`, `iterations/iteration-004.md`; `.devin/hooks.v1.json` and the three Devin `UserPromptSubmit` emitters; `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs`; `.opencode/hooks/goal/goal-plugin.md`.

## Findings

### F310 — P2 — The recorded Devin limitation names two same-field emitters where the shipped chain has three, so the live check it defers to is scoped to the wrong chain

**Dimension**: traceability | **Bears on**: pass-2 F107 (host merge semantics unrecorded) and the DV-022 live check the phase defers to | **Carry-over**: F107 remains open; this is the accuracy of its recorded scope

**Evidence** (read at the cited lines):

- The recorded limitation: `../008-hardening-research/implementation-summary.md:119` — "two `UserPromptSubmit` hooks write `additionalContext`; which one the host keeps is unrecorded until DV-022 runs live".
- The chain has three entries for that event: `.devin/hooks.v1.json` `UserPromptSubmit[0].hooks` lists `dist/hooks/devin/user-prompt-submit.js`, then `runtime/hooks/devin/spec-gate-classify.mjs`, then `.opencode/hooks/goal/devin/goal-inject.mjs`.
- All three reach the same field: the first normalizes a Claude-shaped `hookSpecificOutput.additionalContext` and re-emits it (`.opencode/skills/system-spec-kit/runtime/dist/hooks/devin/shared.js:95-108` → `:84-93`), the gate shim writes it directly (`.opencode/hooks/spec-gate/devin/spec-gate-classify.mjs:19-21`), and the goal adapter writes the brief plus the resend reminder into it (`.opencode/hooks/goal/devin/goal-inject.mjs:70-78`).
- On a turn where a packet goal is active and the gate has a question, two of them emit a non-empty value in the same event; the first emits whenever the shared shim has context of its own.

**Impact**: whoever runs DV-022 to settle the merge question would test a two-writer chain and conclude from it; a host rule that keeps the *last* writer would then silently drop the spec-gate question, and one that keeps the *first* would drop the goal brief — the failure modes the check exists to find, on a chain the note describes incompletely. P2.

**Recommendation**: restate the limitation as "three `UserPromptSubmit` entries can write `hookSpecificOutput.additionalContext` (the shared shim, the gate question, the goal brief); the host's merge rule is unrecorded", and have DV-022 assert all three. Report only; no fix in this review.

## Verification against the review target's own claims

| Claim | Where | Verdict |
|---|---|---|
| REQ-001 store retired or demoted with a migration note; ADR-2 site matches disk state | `spec.md:104`; `002-decisions-and-contract-freeze/decision-record.md:162-165` | **Holds.** ADR-002 chooses "demote to a per-session index plus liveness and telemetry"; `.opencode/skills/.state/goal/` holds `README.md` and no records; the note covers both key schemes and states that no record was rekeyed (`.opencode/skills/.state/goal/README.md:71`). |
| REQ-002 docs describe the packet-backed model; grep for the old state path finds only the migration note | `spec.md:105` | **Holds under its intent.** Every live hit for `active-goal.json` (`.opencode/hooks/goal/README.md:25,55`, `goal-plugin.md:143`, `injection-contract.md:119`, `bin/goal.cjs:386` region, the adapters' tests, and the spec-kit and cli-external-orchestration catalogs) says legacy, diagnostic-only, never an injection fallback, or is a fixture for that legacy path. No document describes the store as the goal source. |
| REQ-003 every gate green from the final state | `spec.md:111` | **Recorded, not re-run here.** The verification table and the packet log carry the sweep (`implementation-summary.md:104-113`, `goal.md` log). Re-running it is outside this lineage's write surface by instruction; nothing this lineage read contradicts it, and the file-level claims it makes are consistent with the tree. |
| SC-001 recursive `validate.sh --strict` on 036 passes | `spec.md:119` | Not re-run here (same reason). |
| SC-002 goal suites, plugin tests, drift check and hygiene gate pass | `spec.md:120` | Not re-run here (same reason). |
| SC-003 deep review reports no P0 or P1 | `spec.md:121` | **Holds for this lineage too.** Iterations 1-5 produced 0 P0 and 0 P1; pass 1 closed its five P1 and pass 2 reported none. The criterion is satisfied in the final state as "no open P0 or P1". |
| T001-T009 all checked, including "validate.sh --strict recursive on 036" and "Reconcile all implementation-summary.md and the parent goal log" | `tasks.md:37-59` | **Supported.** The parent `036-goal-unification/goal.md` log carries rows for 004, 005, 006, 007 and 008 with evidence, newest first; 007's own log records pass 1, the fixes and pass 2 including "F101-F106 fixed in phase 008, F107 recorded in DV-022". |
| Deliverables: store retirement with a migration note, hook README and plugin doc via sk-create-readme, SKILL/hook-system/catalog deltas via sk-create-skill | `spec.md:48-50` | **Present** at the named paths; the SKILL/catalog deltas and the changelog entry are where the packet says they are. |

The review scope's own prior-lineage sentence (`review/review-scope.md:24`, "every P1 and six of seven pass-2 P2s were fixed in phase 008") is optimistic in two rows: F102 is fixed for closed fences only (F302) and F104 is narrowed but left undecidable (F306). F101, F103, F105 and F106 are fixed as claimed.

## Judgement on the two deferred rows

| Deferred row | Deferral reason recorded | Verdict |
|---|---|---|
| Duplicated envelope aliases (`budget_tokens_used`, `budget_usage_source`) | "a documented compatibility contract" (`008-hardening-research/implementation-summary.md:59`) | **Deferring was right.** The aliases are a documented public surface of `opencode_goal_status` (`goal-plugin.md:103-105`), a current test asserts them (`.opencode/plugins/tests/opencode-goal-supervisor.test.cjs:124,126`), and a prior packet decided explicitly that removing the pair "is a behavior change requiring its own decision" (`specs/system-deep-loop/z_archive/026-goal-opencode-plugin/019-code-refinements/spec.md:118`). Removing them inside a hardening phase would have broken a documented contract to save two lines. |
| Unused plugin timestamp (`lastCheckAtMs`) | "a record-schema change no reader needs" (`008-hardening-research/implementation-summary.md:59`) | **Deferring is defensible; the disposition stays open.** The field is normalized on load (`.opencode/plugins/opencode-goal.js:1244`), initialized (`:1735`) and written on every verifier run (`:2393`), and no surface renders or branches on it — the research reached the same conclusion and offered two exits, "remove, or render it in `show` … pick one; today it is neither" (`008-hardening-research/research/lineages/deepseek/iterations/iteration-004.md:28`). Deferral leaves it neither. Unlike the alias pair this is not a contract: the honest trigger is the next change that already touches the record schema, at which point the field should be removed rather than carried. |

## Ruled out

- The parent goal log missing the later phases: ruled out. It carries rows for 004 through 008 with evidence (`036-goal-unification/goal.md` log, newest first), so T009's reconciliation claim is supported rather than asserted.
- The store's demotion contradicting ADR-002: ruled out. ADR-002 demotes rather than deletes, and the disk state matches the decision text.
- The migration note being one-keyed: ruled out. It documents both key schemes and states that nothing was rekeyed (`.opencode/skills/.state/goal/README.md:71`).
- The alias pair having no reader and therefore no reason to exist: ruled out. A current plugin test asserts both alias fields, which is exactly the compatibility contract the deferral cites.

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | traceability, maintainability |
| Files reviewed | 007 `spec.md:99-122`, `tasks.md:34-70`, `implementation-summary.md:100-124`, `goal.md` log, `review/review-scope.md:24`; `008-hardening-research/implementation-summary.md:52-60,115-120`; parent `goal.md:108-137`; `decision-record.md:162-165`; `.opencode/skills/.state/goal/README.md:71`; `.devin/hooks.v1.json`; three Devin emitters; `goal-plugin.md:103-105`; `opencode-goal-supervisor.test.cjs:124,126`; archived 026 decision `spec.md:118` |
| New findings | 1 (P2) |
| Reproduction fidelity | read-only verification against disk state and the shipped chain; no command was run that could have changed the tree |
| Prior-lineage closure verified | pass-2 F107 (still open, its recorded scope inaccurate) |

Review verdict: PASS
