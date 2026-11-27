# Review Report — vibe-2 lineage

Review of the finished reference evidence research in `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/`: the synthesis `research.md`, its `regrade-log.md` and the 40 iteration records under `research/lineages/`.

## 1. Verdict

**PASS.** Nine active P2 findings, no P0 and no P1. Every recommendation the synthesis makes is backed by the reference and plan lines it cites, the grades are right, the sampled rejections were rightly rejected, and no well-supported finding was missed. The nine findings are internal-consistency defects in the synthesis's own prose: a summary sentence that overstates or understates the table beneath it, a count that does not close, an undefined outcome vocabulary, and one guard that leaves a lift decision open. None of them changes what a builder should lift or mirror.

## 2. Scope and Method

Ten iterations, one dimension per iteration, against a fixed 42-file scope. The target was read-only throughout; the only writes are inside this lineage directory.

| Iteration | Dimension | Focus | Findings |
|---|---|---|---|
| 1 | correctness | sections 1-2 and the 003 section | 2 P2 |
| 2 | correctness | 008 and the vault surfaces | 1 P2 |
| 3 | correctness | the regrade log's outcome vocabulary and sampled rejections | 1 P2 |
| 4 | correctness | sections 11-13, the divergence map and the open questions | 1 P2 |
| 5 | correctness | 005 and 006 | 1 P2 |
| 6 | correctness | 006 and 011 | 1 P2 |
| 7 | traceability | all 947 source tags | 0 |
| 8 | maintainability | sections 5, 6, 8 and 9 | 0 |
| 9 | correctness | 009-014 and the sixteen net-new candidates | 1 P2 |
| 10 | traceability | the packet decisions, the licence rule and the cross-cutting counts | 1 P2 |

The method was the same in every iteration: read the section, then open the exact line or range each row cites and check that it says what the row claims. Where a row states a count, the count was recomputed from the surface it summarises. Where a row states a size, the size was measured.

## 3. Findings Summary

| # | Id | Severity | Where | What |
|---|---|---|---|---|
| 1 | `V2-R1-P2-001` | P2 | `research.md:186` | The 003 lift row says the full checkout adds a build log, but the log sits outside the checkout |
| 2 | `V2-R1-P2-002` | P2 | `research.md:196` | The 002 lift row names contracts/prompt-sections.md as the owner of the prompt order, and that file says phase 005 owns it |
| 3 | `V2-R2-P2-001` | P2 | `research.md:305` | The 008 pitfall 1 guard does not say whether lib/secrets-guard.ts is still lifted, so T013 and AC-012 lose their file |
| 4 | `V2-R3-P2-001` | P2 | `regrade-log.md:3` | The regrade log's outcome vocabulary is never defined, and `wrong` covers both a false fact and a true fact with a false implication |
| 5 | `V2-R4-P2-001` | P2 | `research.md:707` | Section 12's table is described as covering the thirteen registry questions but holds twelve rows, and the four resolved questions are named only in section 11 |
| 6 | `V2-R5-P2-001` | P2 | `research.md:175` | The 005 opening says the references add two design checks and one test while the section carries six rows, and the three it omits include a confirmed plan defect |
| 7 | `V2-R6-P2-001` | P2 | `research.md:206` | The 006 kind-list row catches the plan kind order but not its kind count, so the plan OpenBot six kinds stands against a reference type that declares seven |
| 8 | `V2-R9-P2-001` | P2 | `research.md:286` | The 009 opening counts the name-and-description list among what is worth taking, but no lift row takes it and the differences table defers it |
| 9 | `V2-R10-P2-001` | P2 | `research.md:34` | The Bottom Line calls 303 raw findings and partitions them into 121 kept plus a 332-row remainder, which cannot close |

## 4. Findings in Detail

### 1. `V2-R1-P2-001` — P2

**Where:** `research.md:186`

**What:** The 003 lift row says the full checkout adds a build log, but the log sits outside the checkout

**Dimension:** correctness. **First seen:** iteration 1. **Status:** active.

### 2. `V2-R1-P2-002` — P2

**Where:** `research.md:196`

**What:** The 002 lift row names contracts/prompt-sections.md as the owner of the prompt order, and that file says phase 005 owns it

**Dimension:** correctness. **First seen:** iteration 1. **Status:** active.

### 3. `V2-R2-P2-001` — P2

**Where:** `research.md:305`

**What:** The 008 pitfall 1 guard does not say whether lib/secrets-guard.ts is still lifted, so T013 and AC-012 lose their file

**Dimension:** security. **First seen:** iteration 2. **Status:** active.

### 4. `V2-R3-P2-001` — P2

**Where:** `regrade-log.md:3`

**What:** The regrade log's outcome vocabulary is never defined, and `wrong` covers both a false fact and a true fact with a false implication

**Dimension:** traceability. **First seen:** iteration 3. **Status:** active.

### 5. `V2-R4-P2-001` — P2

**Where:** `research.md:707`

**What:** Section 12's table is described as covering the thirteen registry questions but holds twelve rows, and the four resolved questions are named only in section 11

**Dimension:** maintainability. **First seen:** iteration 4. **Status:** active.

### 6. `V2-R5-P2-001` — P2

**Where:** `research.md:175`

**What:** The 005 opening says the references add two design checks and one test while the section carries six rows, and the three it omits include a confirmed plan defect

**Dimension:** correctness. **First seen:** iteration 5. **Status:** active.

### 7. `V2-R6-P2-001` — P2

**Where:** `research.md:206`

**What:** The 006 kind-list row catches the plan kind order but not its kind count, so the plan OpenBot six kinds stands against a reference type that declares seven

**Dimension:** security. **First seen:** iteration 6. **Status:** active.

### 8. `V2-R9-P2-001` — P2

**Where:** `research.md:286`

**What:** The 009 opening counts the name-and-description list among what is worth taking, but no lift row takes it and the differences table defers it

**Dimension:** correctness. **First seen:** iteration 9. **Status:** active.

### 9. `V2-R10-P2-001` — P2

**Where:** `research.md:34`

**What:** The Bottom Line calls 303 raw findings and partitions them into 121 kept plus a 332-row remainder, which cannot close

**Dimension:** traceability. **First seen:** iteration 10. **Status:** active.

## 5. Confirmed-Clean Surfaces

These were checked and held. They are recorded so the merge does not re-spend effort on them.

- **All 947 source tags resolve.** 616 in `research.md` and 331 in `regrade-log.md`: the path exists and the line or range falls inside the file.
- **Section 8's counts are exact.** 332 log rows (106 wrong, 112 out of scope, 43 downgraded, 38 corrected, 32 duplicate, 1 not verified) and 121 kept rows (90 confirmed, 31 weak), recomputed from section 3's 84 rows, section 4's 21 and section 5's 16.
- **Section 9's licence map is exact.** 20 vendor manifests carry a `license` line, 18 `GPL-3.0-only` and 2 `GPL-3.0-or-later`; `tinyvoice` has no manifest key but its `LICENSE` says GPL-3.0, which the row records. Both `openhuman-tui` copies hold 55 files, 9,601 `.rs` lines and 9,526 under `src/`.
- **Section 13's question counts reconcile.** 8 answered, 3 partly answered and 5 open, against 13 registry questions plus 3 pruned.
- **All fourteen phase headings match the 003 folder names character for character.**
- **Section 5's ranked order is a permutation of 1-16** with exactly the two changes its intro states.
- **Section 5's size column is exact on all nine stated sizes**, recomputed with `wc -l` and `find`.
- **Section 6's seven skip rows all resolve**, including the OpenMausBot licence claim at `regrade-log.md:312`.
- **The repeated origin ids are correct.** `V1-10-1/2/3` map to three distinct sub-points of one compound finding in `vibe-1/iterations/iteration-010.md:18-42`.
- **The sampled rejections hold.** Nine rows re-read against their cited lines, all nine rightly rejected.
- **The licence rule holds across all 20 lift rows.** Every row names a licence and every licence traces to a line, either in the row or in its section opening.
- **D3 holds.** The working tree's only change is this packet's own `review/` directory.
- **D4 and D5 hold.** Every row sits under a phase or under net-new and carries a source tag; section 7 states the citation rule and names the 32 duplicate rows.

## 6. Ruled Out

Directions that were tried and closed, so a later pass does not retry them. The full list is in the strategy's exhausted-approaches section; these are the ones a reader of this report would otherwise wonder about.

- **A source tag pointing at a missing path or a range past the end of its file.** All 947 resolve.
- **A phase heading missing or misspelled.** All fourteen match.
- **A sampled rejection that is itself wrong.** Nine re-read, all nine hold.
- **Section 8's counts or kept/confirmed/weak columns being wrong.** Recomputed, exact.
- **Section 9's licence count or `openhuman-tui` counts being wrong.** Recomputed, exact.
- **Section 5's stall-watchdog row misreading the reference.** `configuration.md:190-194` says what the row says.
- **Section 6's crate READMEs not saying what the skip rows claim.** All three state the mechanism named.
- **Section 7 misquoting S3 on 004 or 012.** `S3/research.md:111` and `:221` say what section 7 quotes.
- **The Bottom Line's four lifts undercounting section 3's twenty rows.** "Worth taking" is evaluative, so the list reads as a selection.
- **The licence rule being broken by the nine rows with no per-row source tag.** Each traces to its section opening or to row 1 of the same table.
- **303 being a typo for 453.** Section 13 uses 303 independently as the merged registry's key-findings count, so the number is deliberate and the label is the defect.

## 7. Edge Cases and Limits

- **Three claims rest on inference and say so in their rows.** That models skip a skill under the current label, that the bots CLI dies on a closed pipe, and that a shared memory can leak a private fact into a wider chat. Each row is graded `weak` and states the inference. They were not converted into passes and not raised as findings.
- **The crossterm citations point outside the repository.** The orchestrator opened both places in the local cargo registry copy and they say what the row claims, but a citation checker cannot follow them. This is a limit of the target, not a defect in it.
- **`pi-2`'s state log holds two iteration-7 records.** That is outside this review's target (the 40 `iteration-*.md` records), so it is context evidence for `V2-R10-P2-001` and not a finding of its own. It does mean the raw findings count cannot be read off the logs without deduping.
- **The grades rest on one verification pass per phase group and a hand check of 20 citations.** A second verifier could regrade a row. The synthesis says so itself in section 2.
- **The reference repos are gitignored and exist only in the primary checkout.** Every `C/` citation was read there.

## 8. Dimension Coverage and Convergence

- **Dimensions:** correctness, security, traceability and maintainability all covered. `dimensionCoverage` is 1.0 in the registry.
- **Traceability protocols:** `spec_code` executed and passed. `checklist_evidence` is `notApplicable` because the packet has no `checklist.md` at Level 1.
- **Stop reason:** `maxIterationsReached` at 10 of 10, as the dispatch requires. Convergence was telemetry only.
- **Convergence:** the reducer reports a convergence score of 0 and 9 open findings. The run did not converge on the threshold, and it was not meant to: the stop policy is max iterations.
- **Iterations 7 and 8 produced no findings.** Those are honest clean results, not skipped work: iteration 7 resolved all 947 tags and iteration 8 recomputed sections 5, 6, 8 and 9.

## 9. Release Readiness

**Converged, with advisories.** No active P0 and no active P1, so nothing blocks release. The nine P2 findings are prose-consistency defects in the synthesis: each is a one-sentence or one-cell edit, and each is anchored to a line the same document already carries the correct evidence on. A builder can act on the synthesis as it stands; fixing the nine would make the document's own summaries match its tables.

The recommended follow-on is `/speckit:plan` against the nine findings if the packet is to be amended, or `/create:changelog` if the synthesis is to be shipped as-is with the advisories recorded.

## Planning Packet

```json
{
  "verdict": "PASS",
  "activeP0": 0,
  "activeP1": 0,
  "activeP2": 9,
  "dimensionCoverage": 1,
  "releaseReadinessState": "converged",
  "stopReason": "maxIterationsReached",
  "sessionId": "fanout-vibe-2-1795770902266-zziqbr",
  "generation": 1,
  "lineageMode": "new",
  "findings": [
    {
      "id": "V2-R1-P2-001",
      "severity": "P2",
      "file": "research.md",
      "line": 186,
      "dimension": "correctness",
      "title": "The 003 lift row says the full checkout adds a build log, but the log sits outside the checkout",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    },
    {
      "id": "V2-R1-P2-002",
      "severity": "P2",
      "file": "research.md",
      "line": 196,
      "dimension": "correctness",
      "title": "The 002 lift row names contracts/prompt-sections.md as the owner of the prompt order, and that file says phase 005 owns it",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    },
    {
      "id": "V2-R2-P2-001",
      "severity": "P2",
      "file": "research.md",
      "line": 305,
      "dimension": "security",
      "title": "The 008 pitfall 1 guard does not say whether lib/secrets-guard.ts is still lifted, so T013 and AC-012 lose their file",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    },
    {
      "id": "V2-R3-P2-001",
      "severity": "P2",
      "file": "regrade-log.md",
      "line": 3,
      "dimension": "traceability",
      "title": "The regrade log's outcome vocabulary is never defined, and `wrong` covers both a false fact and a true fact with a false implication",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    },
    {
      "id": "V2-R4-P2-001",
      "severity": "P2",
      "file": "research.md",
      "line": 707,
      "dimension": "maintainability",
      "title": "Section 12's table is described as covering the thirteen registry questions but holds twelve rows, and the four resolved questions are named only in section 11",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    },
    {
      "id": "V2-R5-P2-001",
      "severity": "P2",
      "file": "research.md",
      "line": 175,
      "dimension": "correctness",
      "title": "The 005 opening says the references add two design checks and one test while the section carries six rows, and the three it omits include a confirmed plan defect",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    },
    {
      "id": "V2-R6-P2-001",
      "severity": "P2",
      "file": "research.md",
      "line": 206,
      "dimension": "security",
      "title": "The 006 kind-list row catches the plan kind order but not its kind count, so the plan OpenBot six kinds stands against a reference type that declares seven",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    },
    {
      "id": "V2-R9-P2-001",
      "severity": "P2",
      "file": "research.md",
      "line": 286,
      "dimension": "correctness",
      "title": "The 009 opening counts the name-and-description list among what is worth taking, but no lift row takes it and the differences table defers it",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    },
    {
      "id": "V2-R10-P2-001",
      "severity": "P2",
      "file": "research.md",
      "line": 34,
      "dimension": "traceability",
      "title": "The Bottom Line calls 303 raw findings and partitions them into 121 kept plus a 332-row remainder, which cannot close",
      "fixShape": "edit the cited sentence or table so it matches the evidence the same document already carries"
    }
  ]
}
```
