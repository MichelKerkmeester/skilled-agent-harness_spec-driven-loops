# Review Iteration 008

## Dispatcher

- Mode: review, lineage `vibe-2`, session `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`.
- Target: `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`.
- Dimension: maintainability. Focus: the net-new ranking and the skip-list check -- section 5's sixteen candidates and section 6's seven skip rows.
- Iteration 8 of 10. Stop policy `max-iterations`, so convergence is telemetry only.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:468-515` (section 5, candidates and ranked order)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:516-528` (section 6)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:438-467` (section 4, for the crate sizes section 6 quotes)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md:312` (the OpenMausBot licence row)
- `specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:119`, `:190-194`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinybox/README.md:1-5`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/README.md:1-5`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinyhosts/README.md:1-5`
- `specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:6-9`
- `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:166-170`
- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:97-101`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:166-170`
- `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts:1-8`
- `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts:82`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `research.md:468-528`; `C/OpenBot-main/docs/configuration.md:190-194`; `C/openhuman-full/vendor/tinybox/README.md:3`; `C/openhuman-full/vendor/tinycomputer/README.md:3`; `C/openhuman-full/vendor/tinyhosts/README.md:3-4`; `C/OpenMausBot-main/LICENSING.md:6-9`; `S1/research.md:168`; `B/spec.md:99`; `B/002-routine-layer/spec.md:168`; `L/posture.ts:5-6`; `regrade-log.md:312` | The ranked order is a permutation of the sixteen candidates with exactly the two changes it states, and every skip row resolves to the evidence it cites. No defect found. |
| `checklist_evidence` | notApplicable | `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/` holds no `checklist.md` | The packet is Level 1 with no checklist, so there is no checklist evidence to align. |

## Integration Evidence

- **The ranked order is a permutation of the sixteen candidates.** The list runs 1, 2, 3, 11, 4, 5, 7, 6, 8, 9, 10, 12, 13, 14, 15, 16, and each entry names its candidate number in brackets. Every number from 1 to 16 appears exactly once, so no candidate is dropped and none is ranked twice.
- **The two stated changes are the two changes applied.** The paragraph says candidate 11 moves up and candidate 7 moves above candidate 6. Candidate 11 sits at position 4 and candidate 7 sits at position 7 above candidate 6 at position 8. Nothing else moves, so the order is the verifier's order with exactly those two edits.
- **Section 5's candidate 3 reproduces.** `C/OpenBot-main/docs/configuration.md:190-194` describes `AGENT_STALL_TIMEOUT_MS` as watching for the failure nothing else in the trail can see, writing `agent.stream_stalled`, and switching off when unset or `0`, which is the row's claim. The row's plan-side search names `stall`, `stalled`, `no output` and `inactivity`, and its runtime comparison cites `L/definition.ts:82`'s 900 s wall-clock budget.
- **Section 6's three README citations resolve.** `tinybox/README.md:3` is "A workspace containerization runtime: tinybox encapsulates a *box* — an isolated place where code runs"; `tinycomputer/README.md:3` is "**A decision model (Jev) based harness for desktop and browser automation, written in Rust.**"; `tinyhosts/README.md:3-4` is "One API for putting a Next.js application — and the database behind it — on a real hosting provider." Each is the reference form the skip row names.
- **Section 6's sizes match section 4.** It quotes 82,266 and 132,097 own lines for `tinybox` and `tinycomputer`, and section 4's table gives the same two figures.
- **Section 6's "(regrade log)" citation resolves.** The OpenMausBot licence claim is `regrade-log.md:312`, which marks "The skip list's \"OpenMausBot's `enterprise/` is not Apache-2.0\" is a misreading" as `wrong` and cites `C/OpenMausBot-main/LICENSING.md:6-9`.
- **Section 6's last bullet resolves on all four citations.** `S1/research.md:168` is the "A separate action policy engine now" row with the reason "Executor sandboxes and posture enforce today. Per-action hooks are a later packet"; `B/spec.md:99` is the matching out-of-scope line; `L/posture.ts:5-6` says a bot declares its isolation and the runner refuses an unhonourable posture before dispatch; `B/002-routine-layer/spec.md:168` (REQ-001) says `starts` holds exactly one entry in v1.

## Edge Cases

- **Section 5's candidates carry no phase column.** D4 requires every finding to name its 003 phase or go under net-new, and section 5 is the net-new section, so the heading satisfies D4 without a per-row column. Each row does carry a plan-side search and a size, which is what a reader needs to judge the candidate.
- **Section 5's "None of the sixteen is needed for parity with what the plan already promises" is a verdict, not a claim with a citation.** It is consistent with the section's framing and with section 2's bottom line, and it is the kind of statement a reader should read as the orchestrator's judgement, which the ranked-order paragraph says it is.
- **Section 6's "no new evidence" rows are absences.** Six of the seven bullets say no new evidence was found. An absence cannot be proven from a snapshot, and section 1's "Absences" paragraph says a statement that the plan lacks something is always written as a search. These bullets name no search, which is the weaker form, but they are claims about the reference repos rather than about the plan.
- **Section 6's `tinyvoice` licence note is not repeated here.** Section 4's table carries it and section 9 explains it; section 6 does not need it.

## Confirmed-Clean Surfaces

- The ranked order covers all sixteen candidates exactly once and applies exactly the two changes it states.
- Section 5's candidate 3 reference and plan-side claims both reproduce.
- Section 6's seven skip rows each resolve to the evidence they cite, including three crate READMEs, the OpenMausBot licence row and the four citations in the closing bullet.
- Section 6's quoted crate sizes match section 4's table.
- Section 6's pointer to the regrade log resolves to the row that carries the claim.

## Ruled Out

- **The ranked order drops or duplicates a candidate.** Ruled out: the sixteen bracket numbers are a permutation of 1 to 16.
- **The ranked order applies a change it does not state.** Ruled out: only candidate 11 and candidate 7 move, which is what the paragraph says.
- **Section 5's stall-watchdog row misreads the reference.** Ruled out: `configuration.md:190-194` says what the row says.
- **Section 6's crate READMEs do not say what the skip rows claim.** Ruled out: all three READMEs state the mechanism named.
- **Section 6's "(regrade log)" pointer is dangling.** Ruled out: `regrade-log.md:312` carries the claim.
- **Section 6's closing bullet misreads S1 or the build spec.** Ruled out: `S1/research.md:168` and `B/spec.md:99` both say the per-action policy engine is a later packet.

## Next Focus

- Dimension: correctness
- Focus area: phases 009 to 014 and the net-new candidates -- the remaining phase rows read against their reference and plan lines, with attention to the 012 and 014 rows that the regrade log rejected most heavily
- Reason: 009, 010, 012, 013 and 014 hold 20 rows that no correctness pass has read, and the 012-013-014 group rejected 36 of its 38 lineage findings
- Rotation status: third pass of the correctness dimension
- Blocked/productive carry-forward: the reference-side reads stay productive; the `server/`-absent claims stay blocked
- Required evidence: the cited reference line for each lift row, plus the plan line for each differences row

Review verdict: PASS
