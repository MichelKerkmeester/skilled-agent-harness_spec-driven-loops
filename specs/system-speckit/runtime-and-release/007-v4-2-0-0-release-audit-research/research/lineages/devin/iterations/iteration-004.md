# Iteration 4: Defects in Window Code

## Focus

Work Q4: hunt for defects in code changed in the window, on the highest-risk new surfaces — the freshly cut Python fallback offer gate, the fan-out stop and survivor path, frontier admission and band budgeting, the pass-evidence judge, the convergence blocked-stop path, and the residue sweep's socket handling. Selected interpretation: a BUG needs a defect demonstrable by reading the code, with the commit that introduced it and a `file:line`; a claim the notes get wrong is DRIFT, not BUG.

## Actions Taken

1. Read the Python fallback's new offer gate, typed-command regex, hub-lift and ordering helpers, and the bridge-normalization function they feed.
2. Read the fan-out `classifyLineagesForStop`, `stoppingLineageAnswers`, `lineagesStillAnsweringAfterGrace` and `stopLiveFanoutRun`.
3. Read `expansiveBudget`, `seedBudget` and `applyBandBudget` in `frontier-admit.cjs`, and the admission check order in `checkProposal`.
4. Read `passEvidence` in `fanout-salvage.cjs` and `buildStopDecision` in `convergence.cjs`.
5. Checked the cli-orca removal across every runtime mirror and the tracked tree.

## Findings

1. **BUG (P2) — the `typed` mark is dropped when the run row is normalized onto an existing owner row.** `_apply_deep_loop_offer_gate` sets `rec["typed"] = True` on a run row whose command the reader typed (`skill_advisor.py:4624`), and the comment above the row tables states that "the renamed row carries the typed mark on to the owning skill" (`skill_advisor.py:4562`). `normalize_command_bridge_recommendations` then builds `normalized = dict(owner or top)` and copies `confidence`, `uncertainty`, `passes_threshold`, `_kind_priority` and `_explicit_skill_match` from the top row — but never `typed` (`skill_advisor.py:3338-3362`). When the owning skill row is already present, `normalized` starts from that row and the typed mark is lost; when it is absent, `dict(top)` keeps it. No in-repo consumer reads the field, so the impact is output fidelity and a comment that states a behavior the code does not have. Introduced by `73d98332fff`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3338] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:494]

## Verified Claims (not findings)

- **Frontier admission order matches the notes.** `checkProposal` checks relevance, dedupe, depth, fan-out, node cap, budget and cycle in that order (`frontier-admit.cjs:735-793`), and each prune records its own reason.
- **Band budget rolls down, never up.** `applyBandBudget` carries an unused allotment only when the band has no open node left (`frontier-admit.cjs:386-393`).
- **The budget formula matches the protocol.** `expansiveBudget` computes `min(24, max(floor, 2 * perNode * (seeded + maxDepth - 1)))` and returns the floor on a zero seed (`frontier-admit.cjs:470-477`).
- **Pass evidence matches the three flag rules.** `passEvidence` flags `future_stamp` on `skewMs > 0`, `no_reads_no_findings` on zero reads and zero findings, and `batched_commit` under the gap with no call, leaving an undecidable pass at `null` (`fanout-salvage.cjs:293-300`).
- **The blocked-stop streak matches the notes.** `blocked()` extends the streak only on the same blocker-set key and emits `STOP` at the threshold, `BLOCKED` before it (`convergence.cjs:1172-1180`).
- **The quality guard blocks only a stop candidate.** `failedGuards` turns a chosen candidate into `BLOCKED` with `qualityGuardFailed`; with no candidate the pass stays `CONTINUE` with `noStopCandidate` (`convergence.cjs:1288-1291`), which the notes' "Repeated Blockers" section describes in the context of a stop candidate.
- **The stop and survivor path matches the notes.** A stop signals the runner first, then each lineage's group; `survivors` are the lineages that still answer after the 2.5 s grace; `spared` members are listed separately; a row is written only for a lineage the ledger still holds open (`fanout-run.cjs:1395-1412,1497-1540`).
- **The single-executor artifact paths exist.** `iterations/iteration-NNN.out` and `iterations/iteration-NNN.cost.json` are both produced by `dispatch-iteration.cjs:380-390,451`.
- **The cli-orca removal is complete.** No `.opencode`, `.claude`, `.codex`, `.pi`, `.vibe` or `.dsh` mirror holds a `cli-orca` folder, and no live tracked path names one; only spec scratch artifacts mention it.

## Ruled Out

- **A gate that reads rows by the wrong id.** `_DEEP_LOOP_RUN_ROWS` maps only the bridge id, but the gate runs before `normalize_command_bridge_recommendations`, so that is the id the rows carry at that point; the ordering helper runs after and accepts both ids.
- **A fan-out stop that records a live lineage as stopped.** The confirmation loop re-reads the process table and filters survivors on every pass until the grace expires.
- **A band budget that carries upward.** `carry` is set from the current band's remainder and applied to the next band only.
- **A pass-evidence off-by-one on a same-millisecond commit.** The window uses an exclusive start and an inclusive end, which is correct for sequential commits; a same-millisecond pair yields an empty window, not a misattributed call.
- **An incomplete cli-orca removal.** All runtime mirrors and live trees are clean.

## Dead Ends

- **Running the advisor suite or the Python fallback to observe the gate.** Both would write outside the lineage directory (a test artifact or a SQLite file), which the dispatch forbids. The gate's behavior was established by reading the code instead.

## Edge Cases

- Ambiguous input: the Python gate's behavior is both a DRIFT (the notes' claim) and arguably a deliberate fallback narrowing. It is recorded once as DRIFT in iteration 1 and not re-counted here; this iteration's finding is the separate `typed`-mark defect.
- Contradictory evidence: the code comment and the normalization function disagree about the `typed` mark; the finding cites both sides.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4562,4576-4624,4662-4686,3317-3367,538-555,2932-2938`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1395-1412,1440-1540`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:350-393,470-530,735-793`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:235-320`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:902-954,1090-1300`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:380-390,451`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`
- Runtime mirror trees under `.opencode`, `.claude`, `.codex`, `.pi`, `.vibe`, `.dsh`
- `git show 73d98332fff`

## Assessment

- New information ratio: 1.00
- Questions addressed: Q4 (partially: one defect confirmed, five high-risk surfaces cleared)
- Questions answered: none in full

## Reflection

- What worked and why: reading the new gate together with the function it feeds exposed the `typed`-mark drop, because the comment above the row tables states the invariant the normalization breaks. Checking the admission order and the band-budget carry against the notes' sentences cleared four surfaces cheaply.
- What did not work and why: hunting for a fan-out or frontier defect by inspection produced no finding; those paths carry dense invariant comments and their tests pin the behavior, so a defect there would need a run, which the write boundary forbids.
- What I would do differently: start from the functions whose comments state an invariant (the `typed` case) rather than from the largest new file, because a comment that claims an invariant is the cheapest place to find code that does not hold it.

## Recommended Next Focus

Finish Q3: verify the remaining concrete DRIFT candidates the earlier iterations deferred — the "Advisor runtime suite" totals, the deep-loop suite total, and the cost and duration figures — and state each as confirmed, contradicted or UNKNOWN with the evidence that would settle it.
