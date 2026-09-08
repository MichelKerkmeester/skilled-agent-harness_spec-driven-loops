# Iteration 009 — Round-one kept rows and recorded decisions: new-evidence re-examination

**Focus:** Per the charter, re-list a round-one row only with NEW evidence that its stated reason is wrong. This pass audits each kept/dropped row's stated reason against the post-fix tree, and records where new evidence CONFIRMS, where it ADDS nuance, and where the reason is now unverifiable.

**Method:** Row-by-row walk of confirmed-findings.md dispositions + research.md §3 shortlist + §4 open questions; targeted re-checks (presentation §2 indexHash display, promptSetHash pin, hook-system column, F6.2 source file, README frozen-fixture prose).

## Findings

### REV-1 — L1 FIX VERIFIED; THE FROZEN-PIN REMAINDER IS A RECORDED DECISION, NOT AN INCOMPLETE FIX (no re-list)

- **Path:line:** confirmed-findings L1 disposition ("regenerated together"; README marks five pinned fixtures as frozen acceptance evidence) vs current data: `semantic-probes.json` + `latency-report.json` both pin manifestHash `c0806077f0d2e22ae7b0e9b6f8ab4e17244fac5aef0f6da59c95f7fe0938d370` (old snapshot), whose value no committed artifact carries; README §3 (retrieval/README.md:78-86) says exactly that a mismatch "is expected and is not a staleness signal"
- **Claimed vs actual:** The fix's scope was documentation-of-frozen, not hash-refresh (006 implementation-summary Known Limitation #1 is explicit). The row is NOT incomplete per its own accepted scope. New nuance only: the pins are per-fixture `manifestHash` fields the doctor never reads — the doctor's `committed_pair_mismatch` ignores them BY DOCUMENTED INTENT. No re-list.
- **Severity:** no row; verified decision.

### REV-2 — L9 promptSetHash: NEW EVIDENCE — THE PROBES FIXTURE PINS THE PROMPT-SET HASH, SO THE "PARITY ARM" EXISTS AT FIXTURE LEVEL (nuance, no re-list)

- **Path:line:** `semantic-probes.json` — `promptSetHash: ae629454847b0ad1cb8183de37528af766b21c31d3be1e253921ad4a27daae42` == sha256 of `prompt-set.json` BYTES (computed: `hashlib.sha256` of the raw file matches exactly); manifest `promptSetHash: null` (generator :218); test `trigger-index.vitest.ts:414` asserts null
- **Claimed vs actual:** Round-one reason for keeping the manifest slot: "removing it changes every manifest hash for no reader." Still true for the MANIFEST slot (no consumer reads it). NEW nuance: the acceptance fixture ALREADY carries the value the slot was reserved for — the "parity arm" design lives in `semantic-probes.json`'s `promptSetHash` field, pinned at acceptance time; `prompt-set.json`'s description says "Frozen prompt set for the three-arm retrieval parity harness" and no harness code exists (readers: none outside fixtures). So the manifest slot is a LOADED-but-uncommitted reservation, while the value it would hold is committed in another fixture.
- **Severity:** no re-list (reason not wrong — it is incomplete: the assertion "no reader" also applies to the semantic-probes pin; a parity harness would read one or the other, not both).
- **Recommendation (carry to synthesis):** Either land a tiny parity check (sha256 prompt-set.json → compare against semantic-probes.promptSetHash and/or manifest.promptSetHash) or delete BOTH the manifest slot and the prompt-set/probes hash fields together; the current three-way state (manifest null, probes pinned, harness absent) is the highest-maintenance shape.

### REV-3 — F6.2 SOURCE FILE UNAVAILABLE IN THIS TREE (unverifiable, no re-list)

- **Path:line:** round-one P2 "context agent reads the 3.8 MB index into context (F6.2)" — search this tree for a non-fixture `context.md` or the "3.8 MB" figure: zero hits outside `runtime/cli/test-fixtures/*/memory/context.md`; no `references/context.md` exists
- **Claimed vs actual:** The cited file is not in this tree under that name; the claim may have been about a file that moved or a different path. This is the second candidate for the "worktree artifact" class the charter warned about (alongside the foreign-worktree fixture hash round one already identified). Without the source, the row is unverifiable — NOT re-listed, and NOT dismissed: it becomes an open question for the repo owner.
- **Severity:** no row; flagged unverifiable.

### REV-4 — SHORTLIST ITEM 6 ("derive EXCLUSIONS") STILL NOT DONE BUT NO LONGER THE RIGHT SHAPE (nuance, no re-list)

- **Path:line:** research.md §3 item 6 vs current corpus.mjs:38-45 + test at retrieval-coverage-parity.vitest.ts:222-229 (manifest exclusion record)
- **Claimed vs actual:** The derivation is still not executed, but the risk it addressed (silent drift) is now covered by the test — so the item's RATIONALE is discharged even though the implementation isn't. What the test does NOT cover is V9's redundant row (a row naming a policy the walker never separately applies). The shortlist entry is best re-scoped: "derive, or document row provenance" — the second half is V9.
- **Severity:** no re-list; re-scope note.

### REV-5 — ROUND-ONE RULE-OUTS HOLD (no new contradictory evidence)

- **Path:line:** ruled-outs (repo-rules/retrieval.md rule; stale-index-drops-docs; hook-executed Gate 1; generator nondeterminism)
- **Claimed vs actual:** None of the four has new contradicting evidence in the post-fix tree. NOTE: the repo-rules RULE rule-out (Gate 5 timing) does not extend to the repo-rules DOCUMENTS question (N7) — they are separate surfaces, and N7 is new, not a contradiction.
- **Severity:** no row; confirmed.

## Ruled out this pass

- Re-listing L5 (hook-system column) with the "table is misleading" framing — the column is named `Manual fallback`; the drop's reason holds (V18).

## Open questions

1. Where does F6.2's context.md live in this tree, or what was its actual path? (Owner question; the row is parked.)
2. If the parity harness never lands, delete both the manifest slot AND the probes' promptSetHash+promptSet fixtures — or keep one? (REV-2 carry.)
