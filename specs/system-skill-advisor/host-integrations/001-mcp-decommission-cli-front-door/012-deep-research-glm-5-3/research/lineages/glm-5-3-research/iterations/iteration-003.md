# Iteration 003 — KQ3: The repeatable, cost-ordered migration checklist

**Focus:** What a repeatable checklist for the next transport-to-CLI migration would contain, ordered so the steps preventing the most expensive failures come first — each step's cost-justification grounded in this packet.
**Status:** insight · **newInfoRatio:** 0.55
**Novelty justification (1 sentence):** The packet's phases recorded WHAT they did; no record had consolidated those acts into an ordered, pass-conditioned, transferable procedure whose ordering is itself justified by the packet's own cost statements (006:62, 008/AC:91-96, 009-report:94).

## The ordering principle, from the packet's own costs

Four cost tiers, each stated by the packet itself:

- **T1 — door-down** (total loss of the migration's product): 006:60-62 — the missed references were "the CLI's own entry point and the module that computes the freshness signature, and each one alone was enough to break the front door."
- **T2 — criterion-down** (the packet cannot prove its own success): 008/AC:91 — "The residue criterion carried this packet: it was the only one that failed when first measured, at 87 live files."
- **T3 — discovery-latency** (failures that cost 4–5 adversarial iterations to even SEE): 009-report:94 — "F005/F006/F007 iteration 4; F008 iteration 5."
- **T4 — trust-erosion** (the record stops being evidence): 009-F003 (the packet "cannot fully present its completion"), 009-F006 (limitations contradicting the tree), the nine-vs-eight arithmetic (iteration 2).

The order below is T1 → T2 → T3 → T4, with the sequencing skeleton inherited from the packet's own load-bearing rule, D6: "prove the replacement, rewire callers, delete, rename, retrofit docs. Nothing goes before its replacement" (goal.md).

## The checklist

### 0. Freeze the contract before touching anything — degradation semantics included
- **Action:** Write down, as testable assertions, every operator-visible behavior: outputs, exit taxonomy, AND the degraded/route-line behavior of every failure mode. Permission to skip: none; this is the vocabulary every later step asserts in.
- **Prevents (T1+):** undeclared drift. This packet's preservation bar (D2: "Preservation is the bar... A behavior change is a failure, not a trade-off") makes the freeze load-1: without it, "no loss of capability" is unas- sertable.
- **Precedent:** 003/parity/verdict.md §2 — "Allowlisted, with the exit taxonomy as the contract. What must hold after the transport goes is that the CLI's error behavior stays what it is today" — the taxonomy was consciously pre-frozen while the CLI was still secondary; 003 also allowlisted the two difference classes (error envelope, volatile fields) so the unavoidable divergence was adjudicated BEFORE it existed.
- **Pass condition:** the frozen contract enumerates: the nine capabilities, the brief, the exit taxonomy (0/64/75…), the degraded answer (`Advisor: stale`-style route line, D9), and the parity allowlist with its "not a divergence" argument per class.

### 1. Build the verification for the WORLD YOU'RE ENTERING, not the world you're leaving: warm, cold, AND unreachable — recorded as output+exit, judged against a pre-change baseline
- **Action:** Before the flip, capture the harness evidence in all three daemon states; require brief-text equality (byte-identical where volatile fields are stripped), not exit-status equality.
- **Prevents (T1):** LF1's whole class. In the MCP-primary world the cold start is rare; in the CLI-primary world it is "the cold path real sessions hit first" (006:83). A warm-only harness verifies the dying world.
- **Precedent:** 003's parity ran "against the live daemon" (epigraph) — warm by construction — and its blindness is exactly what 006 had to discover and 008 had to institutionalize: "Brief arrives in three daemon states | PASS. Warm and cold both render a route; unreachable renders a degraded line" (008:115) and "a command whose output and exit status were read, never an exit code alone" (008:84-85). Baseline: 008:100/:118 ("all 5 fail identically on the pre-change baseline, which fails 8").
- **Pass condition:** for every command: one recorded (output, exit) triple per daemon state, taken from the final state, diffed against pre-change captures; any green WITHOUT a read output is recorded as UNVERIFIED (the charter's own rule, learned: 008:84-85).

### 2. Exercise the door cold BEFORE the removal, and EXECUTE — don't grep — the reference graph
- **Action:** With the replacement proven (D6 step 1), run every caller through the NEW front door with the daemon stopped. Search-based reference enumeration is necessary but insufficient: split string-joins and bare literals "survive[d] in forms no path-shaped search finds" (006:60-62).
- **Prevents (T1):** LF2 + LF3 — "each one alone was enough to break the front door" (006:62). 006's two cold-start discoveries were found exactly this way: "Two failures surfaced only because the daemon was stopped before the hook ran" (006:83).
- **Precedent:** 006's verification — "Renamed package hook, cold daemon | PASS" + "byte-identical to the pre-rename baseline".
- **Pass condition:** every caller recorded executing the new door cold, once, with its brief captured; the reference inventory (grep-based) exists AND its gap against the executed set is explained.

### 3. Treat every compiled/derived artifact as a suspect: know what runs, and rebuild CLEAN
- **Action:** After any move/rename: delete the pre-change build output, rebuild from the final sources, and re-run step 1's captures against the rebuilt tree. Record which artifacts are DERIVED (dist, retrieval corpus, indexes, trigger fixtures) and their regeneration blast radius BEFORE deciding to skip regeneration.
- **Prevents (T1+T3):** LF3's both directions — the source-edit no-op ("the hook runs from `dist`, so the source edit alone had no effect") and the surviving-tree mask ("a surviving `dist/mcp-server/` would keep a missed reference working, and the failure would only appear after a later clean build", 006:99).
- **Precedent:** 006's decisions — "Delete the pre-rename `dist/` and rebuild clean"; "Rebuild `system-spec-kit` after editing its hook source"; the waiver's blast radius, recorded: 006:95 (18,966 lines, one generator run writes all four files as a pair) and 006:139 (deferred by decision, "needs its own task and review").
- **Pass condition:** a derived-artifact inventory (artifact → generator → regeneration cost → skipped-or-done decision); a clean rebuild performed and the step-1 captures re-taken; any waiver carries owner + date + blast radius (feeds step 8).

### 4. Delete-with-its-tests: every retired capability takes its tests, retired or INVERTED, in the same change
- **Action:** For each capability the transport removal orphans: decide retire vs invert per test, execute the decision in the SAME change as the capability's deletion, and reconcile the test inventory (no case naming a thing that no longer exists).
- **Prevents (T2+T3):** LF4 — the exit-taxonomy guardian lied (orphaned case: "spawnSync runs `node undefined` and exits 1 instead of 64", 006 limitations item 1) because the shim set collapsed while the case survived; the retire happened two phases later ("3/3, after removing a case that named a shim deleted from the lookup table", 008:119). Also the R4 mirror — a green test asserting a mechanism that is no longer the documented one (launcher-bootstrap:107-119, iteration 2). The inversion precedent is the OTHER, deliberate half: `rename-invariants.vitest.ts:50-51` asserts the server names' ABSENCE — the removed capability stays guarded, just from the far side.
- **Pass condition:** per retired capability: tests retired (list) + tests inverted (list, each inverted test's pass = the removal proof) + zero tests referencing deleted identifiers (the 006 limitations item 1 miss, mechanized).

### 5. Run the residue criterion BOTH ways — every survivor classified, every departed capability's checker accounted
- **Action:** (a) Survivors: grep the retired names; CLASSIFY each hit before editing into: rewrite (live prose), historical-keep (changelogs, dated reports, frozen fixtures — "none describes the advisor as currently shipping an MCP server", 007:132), different-subject (007:85). (b) Absence: for EVERY capability the dying transport performed, name its CURRENT checker (which doctor/doctor-asset/test/monitor now exercises it); a capability whose checker answer is "nobody" is a finding, because "absence has no grep" (iteration 2, R5). (c) Claims: every documented mechanism-claim ("set in X", "pinned in Y") is re-verified by running ITS rg against the tree — 009-F001's verification form: "both claims fail `rg` over the five configs".
- **Prevents (T2+T3):** the criterion-failure class. This packet's residue criterion "carried this packet" — it was the only criterion that FAILED (008/AC:91) — and it still missed the absence half: 008's criterion (AC-007) is present-tense existence, so F005's vanished advisor-coverage and F006's record-contradictions survived BOTH the 007 sweep and the 008 criterion, until the defect hunt's 4th and 5th iterations (009-report:94).
- **Precedent:** 007:85 (the classify-before-edit discipline), 008:117 (87→0 live, 24 historical, by design), 008/AC:91-96 (the consciously-left: operator-frozen names + the stress-tree), 009-F005 (the doctor's narrowed coverage), 009-F001 (the claim-verification).
- **Pass condition:** a residue record where EVERY hit carries a bucket, PLUS a coverage-continuity table (capability → current checker → evidence), PLUS a claim-verification list where each documented mechanism reference resolves by search.

### 6. Enumerate the operator-frozen names BEFORE the sweep, as a conscious third disposition
- **Action:** List every name an operator (or a search) might have locked in — env vars, config keys, trigger aliases, CLIs — and mark them untouchable-or-migratable BEFORE deciding what the sweep may rewrite.
- **Prevents (T2):** late discovery of what cannot be renamed. This packet had to INVENT the disposition mid-criterion: "Left out consciously: the P2 naming residue in the plugin's timeout variable, because it is operator-set and renaming it would change operator-visible behaviour that this packet's second decision forbids" (008/AC:91-96); 007:149's trigger-aliases "kept as search aliases" are the same disposition applied to searches.
- **Pass condition:** the frozen-name list exists, each entry: who sets it, what breaks if renamed, disposition. (D2 answers the why: preservation is the bar.)

### 7. Records are part of the product: no phase ships with a scaffold, and the counts reconcile
- **Action:** Every phase's implementation-summary, acceptance-criteria and machine-read metadata (description.json) is filled or explicitly waived-with-reason; the loop's/phase's correction counts are reconciled against the finding registry before the packet closes.
- **Prevents (T4):** R6 — 004's end-to-end unfilled record (004/implementation-summary.md:55,77-90; description.json:3 carrying the template's own description) survived a defect hunt that caught 009's OWN scaffolds (009-F003); and the arithmetic: "nine required corrections, eight advisories" (009/implementation-summary.md:3) against an eight-finding active registry — one correction without an F-number.
- **Precedent:** 009-F003 (P1: "Packet cannot fully present its completion") — the packet's own trust-erosion finding.
- **Pass condition:** zero unfilled template placeholders in shipped records; every count (findings, corrections, advisories) reconciles 1:1 with a registry row or a named waiver.

### 8. Waived residue needs an owner, a date, and a blast radius — recorded where the NEXT session trips over it
- **Action:** Any residue deliberately not fixed gets: the reason, the regeneration cost (the blast radius), an owner, and a workstream (not just a limitation-paragraph and a frontmatter note).
- **Prevents (T3):** R7's ownerless deferral — 006:139/95 recorded the 47-path waiver beautifully (three places!), yet its discharge arrived unowned ("the trigger index and its fixtures were regenerated as one set", 009-report:16) — the packet cannot SAY the 47 paths cleared.
- **Precedent:** 006:95, :139, :31; 008/AC:92; 009-report:16.
- **Pass condition:** every waiver: reason + blast radius + owner + the workstream ID that will discharge it; at close, discharged-or-still-owned, never silent.

### 9. The repair's own diff is the next residue candidate: re-scan the fix, not just the feature
- **Action:** After applying remediation, run the SAME residue criterion over the fix's diff before closing.
- **Prevents (T3):** the fix-echo — "The regression scan still found residue on three live surfaces, one of them inside the repair's own `.gitignore` edit (F007)" (009-report:16) — the packet's remediation left a stale underscore-name in the very file it edited.
- **Pass condition:** the criterion (step 5) run once more, scoped to the remediation diff, PASS recorded.

### 10. Close the loop on the loop: re-verify the frozen contract at the FINAL state, never citing an earlier phase's proof
- **Action:** The final gate re-runs steps 1–2 from the final tree; every earlier PASS is treated as a hypothesis.
- **Prevents:** the drift between what phases proved and what the final tree does — "Re-measure rather than cite the phase that first proved it — a claim proven in phase 3 says nothing about the tree after phases 5 through 7 moved it" (008:98). 007's limitations lost exactly this race (009-F006: items 2 and 4 contradicted the later tree).
- **Precedent:** 008:98, :100, :115-119 (the whole final-state discipline) — and the packet's charter rule, which this study obeys too: a green test proves nothing until its output and exit status are read.
- **Pass condition:** step 1's evidence regenerated from the final tree; zero citations of earlier-phase passes without re-measurement; the handful of deviations (if any) named as consciously-left (008/AC:91-96's precedent).

## How the order maps onto D6's skeleton

| D6 stage | Checklist steps that MUST be inside it |
|---|---|
| prove the replacement | 0, 1, 2 (contract; three-state evidence; cold-door exercise) |
| rewire callers | 2, 3 (per-caller cold execution; derived-artifact inventory) |
| delete | 4, 5a (delete-with-tests; survivor classification starts) |
| rename | 3, 4, 5a (clean rebuild; inventory reconciliation; the forms-no-grep-finds sweep) |
| retrofit docs | 5b, 5c, 6, 7 (absence half; claim verification; frozen names; record completeness) |
| (close) | 8, 9, 10 (waiver ownership; fix-echo; final re-verification) |

The additions D6 does not name are exactly this study's it1/it2 yield: the lifecycle dimension (steps 1–2), the derived-artifact suspicion (3), the retire-or-invert decision (4), the criterion's absence half (5b), the frozen-name enumeration (6), the records (7), the waiver ownership (8), the fix-echo (9), and the re-measurement close (10).

## Questions Answered

- **KQ3: ANSWERED.** Ten steps, cost-ordered T1→T4 with the D6 skeleton; each step: action, prevented failure, precedent citation, observable pass condition. Steps 1–3 prevent the door-down failures (006:62); steps 4–6 prevent the criterion-down failures (008/AC:91); steps 7–9 prevent the discovery-latency and trust-erosion failures (009-report:94, 009-F003); step 10 binds the packet's own 008:98 lesson.

## Questions Remaining

- KQ4 (iteration 4): does this checklist, applied to the packet's actual debris, catch LF1–LF5 and R1–R7 — and what does it still miss?

## SCOPE VIOLATIONS

None. Reads: none this iteration (pure synthesis from iterations 1–2 evidence); writes inside the lineage.

## Negative knowledge

- The checklist deliberately does NOT include: model/routing-quality steps (D7: out of scope), benchmarking procedure (D3: decided by the packet, its latency criterion already recorded — 008:116: "CLI warm 736 ms against 1,100; hook warm 819 ms against 2,096; cold 1,566 to 1,812 against 3,500" — a DONE question), and any SDK-vs-protocol latitude (D1 froze it: framing survives, vocabulary goes).
