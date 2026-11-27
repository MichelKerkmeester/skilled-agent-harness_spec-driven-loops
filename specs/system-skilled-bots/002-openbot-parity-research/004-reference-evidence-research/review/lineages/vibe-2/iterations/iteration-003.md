# Review Iteration 003

## Dispatcher

- Mode: review, lineage `vibe-2`, session `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`.
- Target: `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`.
- Dimension: traceability. Focus: the regrade log's rejection outcomes, read against the plan or reference line each cites.
- Iteration 3 of 10. Stop policy `max-iterations`, so convergence is telemetry only.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md:1-120`, `:200-215`, `:240-250`, `:310-372` (all 332 rows parsed by script; the seven group tables and their outcome columns)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:5-32` (section 1, the origin-id and grade scheme), `:621-644` (section 8), `:731-740` (section 13)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-010.md:16-42`, `:134-146`
- `specs/system-skilled-bots/context/openhuman-main/vendor/` (21 folders, each empty)
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates` and `vendor` (`.rs` line counts)
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/crates/tinymcp/src/lib.rs:1-30`, `README.md:1-12`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tiny-artifacts/README.md:1-4`
- `specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:19-23`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:15-28`
- `specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:40-75`
- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:150-156`, `tasks.md:78-82`
- `specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/plan.md:125-129`
- `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:113-118`
- `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` (absent)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The regrade log's outcome vocabulary is never defined, and `wrong` covers both a false fact and a true fact with a false implication, so an auditor re-checking a `wrong` row can reach the opposite conclusion** -- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md:3` -- The intro lists the six outcomes and defines none of them. Section 1 of `research.md` defines the two grades, `confirmed` and `weak`, and says only that "a finding graded `wrong` or `not verified` is not in this document" (`research.md:20`). The rows then use `wrong` for at least two different things. `regrade-log.md:29` marks "`THIRD_PARTY_NOTICES.md` does not exist" as `wrong`, and the file genuinely does not exist: `ls .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints "No such file or directory". The rejection is right for a different reason — the file is a `Create` row in a Draft phase (`B/001-activity-and-actor/spec.md:153`) written by T028 (`B/001-activity-and-actor/tasks.md:80`) — so `wrong` there means "the finding's conclusion is wrong", not "the finding's fact is false". Other rows use `wrong` for a fact that is false outright: `regrade-log.md:338` marks "`openhuman-main/vendor/` does not exist" as `wrong`, and the folder holds 21 empty directories.
   Finding class: documentation
   Scope proof: the outcome list is at `regrade-log.md:3`; the two `wrong` rows are `:29` and `:338`; the grade definitions are `research.md:18-20`; the plan lines that make `:29` right are `B/001-activity-and-actor/spec.md:153` and `tasks.md:80`, both read directly.
   Affected surface hints: `research/regrade-log.md` intro and every `wrong` row; `research/research.md` section 1 grade paragraph and section 8's "about a third" sentence.
   Case: an auditor picks `regrade-log.md:29`, runs `ls .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`, gets "No such file or directory", and records the rejection as wrong — because nothing in the log says `wrong` judges the finding's conclusion rather than its stated fact.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `regrade-log.md:29`, `:338`, `:339`, `:341`, `:343`, `:344`, `:362`; `B/001-activity-and-actor/spec.md:153`; `B/001-activity-and-actor/tasks.md:80`; `B/012-manual-testing-scenarios/plan.md:127`; `C/OpenMausBot-main/evals/README.md:21`; `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:19-26`; `C/OpenBot-main/app/src/lib/routines/plan.ts:54-60`; `S1/research.md:115-116` | Seven rejection rows were re-read against the line each cites and all seven hold. The defect is in the outcome label, not the rejection (P2 finding 1). |
| `checklist_evidence` | notApplicable | `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/` holds no `checklist.md` | The packet is Level 1 with no checklist, so there is no checklist evidence to align. |

## Integration Evidence

- **Section 8's counts recompute exactly.** All 332 rows were parsed by script and grouped by their seven table headings. Every cell matches: 001-002 44 rows / 14 wrong / 11 out of scope / 6 downgraded / 4 corrected / 9 duplicate; 003-004 40 / 16 / 9 / 6 / 6 / 3; 005-009-010 45 / 19 / 9 / 3 / 6 / 8; 006-007-008 69 / 21 / 29 / 10 / 6 / 2 plus the single `not verified`; 011 34 / 12 / 5 / 11 / 3 / 3; 012-013-014 38 / 17 / 19 / 0 / 1 / 1; net-new 62 / 7 / 30 / 7 / 12 / 6. The totals row (332 / 106 / 112 / 43 / 38 / 32 / 1) is the sum of the seven. The kept-rows column also sums: 121 rows, 90 confirmed, 31 weak.
- **The four errors of fact in section 8 all reproduce.** `openhuman-main/vendor/` holds 21 folders and every one is empty. `tinyeventqueues` is 89,431 `.rs` lines in total, of which `crates/` is exactly 15,495 and `vendor/` is 73,936. `tinymcp/crates/tinymcp/src/lib.rs:1-6` is "A Model Context Protocol client, packaged as an installable `TinyBus` module … It dials them over Streamable HTTP or as a subprocess, browses the upstream registries", while `README.md:1` is still "# Rust Template". `OpenMausBot-main/LICENSING.md:6-9` confirms the skip-list row's licence note, as section 6 says.
- **The repeated origin ids are correct, not a defect.** `V1-10-1`, `V1-10-2` and `V1-10-3` each appear in up to seven tables with different outcomes, and each maps to one finding of `vibe-1/iterations/iteration-010.md`: `F-10-1` is a compound finding with three sub-points, `F-10-2` is "the licence table, applied per phase" and `F-10-3` is a twenty-row failure table. The claim column names the slice each row judges ("Licence rows for 005, 009 and 010", "Row 6: …", "Rows 7 and 8: …"), so the per-slice outcomes are the honest treatment of a per-phase finding.
- **The sampled rejections hold.** `regrade-log.md:338` is right because the 21 folders exist; `:339` is right because `tiny-artifacts/README.md` exists; `:341` is right because `tinywallet` is recorded at `research.md:464` as "No phase … Not a candidate"; `:343` is right because `B/012-manual-testing-scenarios/plan.md:127` ships the stub executor; `:344` is right because the scorer line is `evals/README.md:21`; `:362` is right because `cron_refuses` sits at `host_tool.rs:19-26`; `:13` and `:31` are both right because `plan.ts:54-60` records an empty subject matched server-side.
- **The single `not verified` row is honest.** `regrade-log.md:210` keeps the encoded-forms half as 008 pitfall 2 and says the ceiling half needs the executor audit module, which was not read. That is the correct outcome for evidence that was never opened.

## Edge Cases

- **The "about a third" figure has no stated denominator.** `research.md:638` and `:739` both say about a third of what the lineages reported was wrong. Over the 332 log rows, 106 wrong is 31.9%; over the 241 distinct origin ids the log names, it is 44%; over the 362 findings the document judges (121 kept rows plus 241 log ids), it is 29.3%. All three readings are near a third or above it, and the conclusion the figure supports — that more iterations would add claims faster than verified rows — holds under every one, so the missing denominator is recorded here rather than raised.
- **`V1-10-3` row 1 is rejected as `wrong` for restating `V1-1-5`.** A restatement is a duplicate, not an error, so the label is arguably the wrong one of the six. Not raised: the row's other two sub-points are genuinely wrong, and the outcome column has no per-sub-point granularity.
- **`V2-2-12`'s citation covers four of the six crates it names.** The reason cites `S1/research.md:115-116`, which carry the PostgreSQL/Compose and OAuth rows, and then says "the first table names the row per crate", which `research.md:464` does. The citation is partial but the reason routes the reader to the complete table.
- **The log's intro describes one direction of grouping only.** It says "a row can group several origins" and never says one origin can span several rows. The claim column makes the slice visible in every case checked, so the omission costs a reader nothing in practice.

## Confirmed-Clean Surfaces

- Section 8's seven group rows and its totals row are arithmetically exact against the log, in all six outcome columns and in the kept/confirmed/weak columns.
- The four errors of fact named in section 8 are each reproducible from the reference tree.
- The origin-id scheme in section 1 resolves: every id checked maps to the finding its iteration file holds under that number.
- The `citation corrected` rows sampled point at lines that do carry the corrected fact.
- The `not verified` outcome is used once, for evidence that was genuinely not opened.

## Ruled Out

- **The repeated origin ids are a defect.** Ruled out: `F-10-1`, `F-10-2` and `F-10-3` are compound or per-phase findings, and each row's claim column names the slice it judges.
- **Section 8's counts are wrong.** Ruled out: all 332 rows were parsed and every cell matches.
- **The `tinyeventqueues` line count in section 8 is wrong.** Ruled out: `crates/` is exactly 15,495 `.rs` lines and the tree totals 89,431.
- **The `tinymcp` claim in section 8 is wrong.** Ruled out: `lib.rs:1-6` is an MCP client and only `README.md:1` is the template header.
- **A sampled rejection is itself wrong.** Ruled out: seven rows re-read against their cited lines, all seven hold.
- **The `not verified` row hides a rejection.** Ruled out: it names the unread module and keeps the verified half as 008 pitfall 2.

## Next Focus

- Dimension: maintainability
- Focus area: the document's structure and completeness -- section 8's counts against section 3's rows, section 12's open questions against section 13's answered count, and whether a well-supported finding is missing from the fourteen phase sections
- Reason: the counts and the rejection outcomes are now verified, so the remaining structural claim is that the document is complete
- Rotation status: first pass of the maintainability dimension
- Blocked/productive carry-forward: the reference-side reads stay productive; the `server/`-absent claims stay blocked
- Required evidence: the section 3 row count per phase, the section 12 question list, and the section 13 answered/partly/open split

Review verdict: PASS
