{"timestamp":"2026-09-12T14:17:22.582Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":66,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
All verification complete. Composing the findings — the lineage-assigned attacks (a)(b)(c) are executed, and the hook surface plus refusal registers were checked first-hand.

---

# Iteration 2 — Findings

## 1. DIAGNOSIS

**Reframe test: partially holds; sharpened.** "Read too shallowly" describes #1, #2 and #4 (a real output, read partially). It does not describe #5: both numbers were read at full depth; what was asserted from surface form was the *relation* between them. It does not describe #3: nothing was read at all for the claimed quantity — 233 was inherited. The property common to all five is **zero discriminating power**: the receipt arrives identical in the world where the claim is false. The prefixed-name grep returns zero hits whether or not the bare key exists; a first-line-only read prints "loads ok" whether or not the module was missing; a carried total is invariant under the file's actual length; a line-oriented miss occurs whether the fix is wrapped-applied or unapplied; a digit match fires whether or not the two numbers play the same role. So the brief's question has an answer the corpus never asks: the agent stops when the reading *feels* consistent, because all five standards test receipt *existence, reading, lens and baseline* (`AGENTS.md:243-247`) and none tests receipt *power*.

**#3's difference in kind, and the one-rule answer.** Mechanically, #3 is a provenance failure — a value crossed a step boundary carrying borrowed authority (I1's wording, `specs/hooks/022-smart-rule-injection/003-shallow-evidence-claims/research/iterations/iteration-001.md:10`) — not a mis-read; the other four are instrument failures. Categorically they are the same defect: no observation at the claimed level could have failed. #3 is the degenerate case — zero checks at the total's level, therefore zero possible outcomes. One rule covers both because the criterion is stated on the receipt–claim pair ("could it have come out otherwise"), with the aggregate case as its own shape clause. A "read more carefully" rule misses #3; a "negatives need controls" rule misses #3 and #5.

**Why the standards did not fire — I1's per-incident map verified, one near-miss added.** Every I1 citation I re-checked resolves (`AGENTS.md:122`, `:244`, `:243`, `:246`, `:345`; `evidence-and-proof.md:62-63`, `:81-84`, `:122-123`; `uncertainty-and-honesty.md:91-99`; `AGENTS.md:97`). I1 missed §4, the corpus's single closest doctrine: `evidence-and-proof.md:92-97` THE NEGATIVE CONTROL — "A check that passed before your change and passes after it proves nothing about your change" — scoped by "Before the fix … your change" (four occurrences, `:94-97`) and triggered as "watch it fail first" (`:9`). None of the five incidents was proving a *change*, so the corpus's actual negative-control principle never fired on them, and it lives where read-only turns never load it (`AGENTS.md:122`). The proposal below promotes this existing principle from change-proof to claim-proof; it is not new doctrine. One clause also fails verbatim: §3.2 (`evidence-and-proof.md:81-84`) — "A search that returns nothing is not evidence of absence until you have confirmed it read the file" — is *satisfied* by #1 and #4 (the files were read; the pattern form could not match). A condition that passes while the claim is false cannot own the duty. And §11's "two habits" (`:181-193`) has no slot for #3's actual third habit: your own prior conclusion re-used as data.

## 2. WHERE IT BELONGS

**AGENTS.md §4, as a sixth row. Test 1 decides it (`decision-tests.md:38-41`), and the strongest objection is now closed first-hand, not carried.** I verified the hook/injection surface myself: `check-repo-rules.cjs:5-9` ("nothing else reads it … no hook or workflow touches the router") and the fail-closed CI at `.github/workflows/repo-rules-corpus.yml:21-32` (`:25-26`, `:31`). The hooks track's own ten-iteration research reached the same verdict for claim-shaped content: "LEAVE AT GATE 5 … CHANGE THE RULE INSTEAD" (`specs/hooks/022-smart-rule-injection/001-deep-research/research/iterations/iteration-010.md:55`), every injection candidate refused (`:57`).

**Test 3 part 2 (attack (a)), verbatim:** row 4 (`AGENTS.md:246`) partitions, it does not cover — its operative case is the un-grounded claim ("Ground it, or say it is judgment …"), all five incidents took the grounded path believing themselves covered, and its text holds no vocabulary of contradiction or coverage. §3.2's own condition passes #1/#4, and §6/§11 are trigger-shaped and unreachable. The sixth row is the operational definition of "ground it" for three claim shapes that row 4 lacks — not duplication.

**Precedent upgraded from refusals to a completed edit.** I1 cited only refusals (`specs/agents/010-repo-rule-system-integration/research/synthesis.md:430`, `:437`). The self-lens row was recommended in exactly this form (`001-deep-research … iteration-010.md:59`: "promote … a compressed row beside 'Finding = hypothesis' … one operator decision") and landed (`specs/hooks/022-smart-rule-injection/002-event-triggered-injection/research/iterations/iteration-001.md:83`: "`AGENTS.md:239` now reads 'These five' … with the added row … at `:246`"), count sentence included. The table's growth 4→5→(6) is normal practice. A rule-file section is refused again: reach is unchanged and federation cost stands (`agents-md-integration.md:146-167`: four per-sibling mechanics for rule files; the AGENTS.md text is path-free).

**Register collisions checked across all three corpora:** pre-refused ten (`decision-tests.md:94-97`) — no; `010-synthesis.md:410-461` — nearest `:424`, `:430`, `:437`, `:448`, `:452`, none owns claim–receipt discrimination (for `:448`, the routing rule is positive-direction `skill-hub-routing.md:43` and self-limiting `:31`); hooks-022 refusals (`002-event … iteration-001.md:36-68`) are all injection shapes. No collision.

## 3. THE PROPOSAL

Exact edit — insert after `AGENTS.md:247`, change `AGENTS.md:239` "These five" → "These six":

> | **A check must be able to fail** | An observation settles only what it could have contradicted: a "none found" needs a search that finds a known instance; a total needs a derivation at its own level; a conflict needs both sides shown to be the same kind. |

Deltas from I1's row (`003 … iteration-001.md:37`): opener tightened ("the claim it could have contradicted" → "what"); "query" → "search" (`evidence-and-proof.md:81` vocabulary); "at the total's level" → "at its own level"; **"Otherwise: INFERRED" dropped** — row 1 already owns the label duty (`AGENTS.md:243`), no other substantive row carries its own escape, and the fallback survives via row 1 without advertising itself inside the duty; header renamed from "Evidence covers the claim" to name the mechanism, echoing §4 (`:9`, `:94-96`). Both deltas are one-line reverts.

**Catch table (v2 text → incident):**

- **#1** — clause 1: the prefixed grep cannot find the known bare key; the "none found" is not evidence. **Caught.**
- **#2** — both halves: the single-line "no require found" search cannot find the multi-line known instance (clause 1); "loads ok" is flagged by the opener directly — a truncated read could not have contradicted a module-not-found. v2 catches this half *on its own*; I1 needed row 2 jointly. **Caught.**
- **#3** — clause 2, plus the opener (a prior analysis's total cannot be contradicted by today's file state). **Caught.**
- **#4** — clause 1: a line-oriented search cannot find the wrapped known instance. **Caught.**
- **#5** — clause 3: a digit match does not establish role-kind. **Caught.**

**(c) over-trigger test — passes.** Direct positives resolve in one beat ("file exists" ← ls; "tests pass" ← runner): their falsifier is the shape already looked at. Freshly derived totals (wc output, git-status counts) satisfy clause 2 at their own level; §6's second-derivation duty for computed answers is not duplicated. The only friction class is absence claims with no searchable known instance, whose honest output is row 1's INFERRED label — the intended bite, not a wrong fire. **The row-1 amendment fallback (I1:46) is not needed.**

## 4. WHAT IT COSTS

- **Edit mechanics:** two lines; count-sentence maintenance has a landed precedent (`002-event … iteration-001.md:83`); operator escalation required (`agents-md-integration.md:122-127`). The CI gate covers `REPO RULES.md` and `repo-rules/**` only (`repo-rules-corpus.yml:5-8`), so the count sentence and table have no machine check — promotion discipline governs, as it did for row five.
- **Propagation honesty:** the three AGENTS.md files are currently uniform and the text is path-free (`001-deep-research … iteration-010.md:50-51`), but the maintenance mechanism is contested between two prior verifications — symlink per `010-synthesis.md:13`, "UNKNOWN from a read-only seat" per `iteration-010.md:51`. If synchronization rather than symlink, add the sibling text update; either way no repo-rules federation work.
- **Wrong fires / frequency:** one self-question per load-bearing claim — tens per dense research turn; the newly-blocked classes (false absences, carried totals, look-alike matches) are exactly the observed failure population. False friction = expensive absence proofs → INFERRED label, already required at close-out (`AGENTS.md:501`).
- **Misuse risk:** shape-ritualism on trivia, bounded by the table's claim context; dropping the in-row escape makes the affordable compliant path row 1's honest label rather than a new escape habit.
- **Admission risks pre-cleared:** home (tested), doctrine novelty (it promotes §4), row-4 overlap (partition), count/reach (landed precedent + hook closure).
- **Residual:** unenforceable, skippable; its only reach is the resident layer, which is the only layer present on the turns where the failures happen.

## 5. VERDICT

**Admit — as I1 concluded, with the compressed row; all three assigned attacks resolve.** (a) Test 3 part 2 does not refuse: row 4 partitions by grounded-path, and §3.2 fails the verbatim counter-test. (b) Compression done, with named deltas and a revert path. (c) No over-trigger; the fallback stays untriggered. One refinement carried into the rationale: the common property is zero-discrimination of the receipt, not reading depth — #3 differs mechanically (no probe at the claimed level), not categorically, which is what allows one row.

**Read-only turn; nothing modified.** Next iterations should attack: (1) word-level review of v2 against the table's register — is "contradicted" or §4's "fail" the better verb, and does clause 2's "its own level" cover same-session staleness without a "carried" rider; (2) the rival edit to the confidence table (`AGENTS.md:94`, "Proceed with citable source" → a source that could have said otherwise) as a lower-blast alternative; (3) re-run the catch table against v2 after any wording change; (4) confirm the sibling-repo uniformity mechanism before claiming automatic propagation.
