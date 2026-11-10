# Deep Research Strategy - Session Tracking

## 2. TOPIC

Analyze every change branch 091-consolidate-small-packets made to the spec folder tooling and the spec corpus (the commits in `git log origin/main..HEAD` plus the uncommitted corpus-wide repair of phase 013), then answer: how do we harden it, and how do we automate healing and fixing of specs in old formats, including pre-v4 repos, so external users on older versions are not burdened?

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- [x] What causes each validation failure class at the source, and how do we stop new instances?
- [x] How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- [x] What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- [x] Which checks belong in CI or pre-commit so drift is caught early and cheaply?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing fixes during research; findings and recommendations only.
- Editing anything outside the lineage write surface.
- Judging prose quality of documents; the repair scope is structural and metadata only.

## 5. STOP CONDITIONS

- maxIterations 15 reached under `stopPolicy: max-iterations` (convergence before the cap is telemetry only).
- No operator is present; contradictions are recorded as findings, never escalated interactively.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1: Owned: `fix-specfolder.mjs` (migrate-generated-json), `add-fm-fields.mjs` (fill-frontmatter). Gaps: anchor-structure repair (new pipeline step) and archive post-move re-derive. Reconstruction stays a lane. (iterations 6, 7, 14)
- Q2: Dominant cause is the archive move without re-derive (2,898 baseline occurrences); the template's nested `questions` anchor regenerates in every new packet (and the validator does not enforce the documented no-nesting rule); convention remainders are old documents without frontmatter. (iterations 2, 3, 4, 5, 14)
- Q3: Migration is already built as detect, dry run, apply with the `upgrade-baseline.json` ledger; fix is exposure through the doctor surface plus a per-class census. (iterations 8, 9, 10)
- Q4: Harden the rebuild workflow (stage all four generator outputs, post-commit check, push retry), single-source phrase lists and Gate 3 menus, route cleanup skips, add an applied-state audit. (iterations 11, 12)
- Q5: Use the existing per-change regression gate; add deterministic unit tests to path-filtered suites; corpus sweeps stay report-only; base-revision checks go to pre-push or CI advisory. (iteration 13)
<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading rule implementations before rule documentation: it caught the wrong no-nesting premise in the adversarial pass (iteration 14).
- Reading producer functions end to end: the archive gap was the post-move call sequence, visible only at the end of the function (iteration 3).
- Reading commit bodies and phase implementation summaries for apply evidence: they carry verification detail the docs do not (iterations 5, 12).
- Batched read-only counts with explicit exclusions: exposed the containment double-count (iteration 10).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Citing the validation reference as if it were the implementation: iteration 4's anchor-violation claim was refuted and corrected in iteration 14.
- Generic detail extraction across different rule report shapes: failed until per-rule extraction was used (iteration 5).
- GNU awk syntax on a BSD awk host: replaced with `rg | sort | uniq -c` pipelines (iteration 1).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Version-string detection -- BLOCKED
- What was tried: looking for a single repo version marker to classify pre-v4 trees.
- Why blocked: the corpus holds documents from several template generations at once; headers drift in spelling.
- Do NOT retry: propose a single version verdict.

### Auto-reconstruction -- BLOCKED
- What was tried: checking whether the pipeline could rebuild missing documents.
- Why blocked: reconstruction asserts what a document says; both repair tools refuse authored facts.
- Do NOT retry: propose automated reconstruction.

### Second migration pipeline -- BLOCKED
- What was tried: evaluating a new pipeline beside `upgrade-legacy.mjs`.
- Why blocked: the staged pipeline, dry-run default, grandfather ledger and archive protection already exist.
- Do NOT retry: duplicate the pipeline.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Rules as the defect source; unifying GREP_CONVENTION and ANCHORS_VALID; new path-repair tool; specs as a release-engine unit; `/doctor:speckit` as heal home; deleting author phrases; corpus sweep in pre-commit; weekly report as a gate; treating anchor defects as author error. (iterations 2, 3, 5, 8, 11, 13, 14)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- The anchor doc-versus-code divergence needs a maintainer decision (implement no-nesting, or drop rule 3). (R-039)
- The archive post-move step must be proven to settle both writer paths end to end; a fixture test is the confirmation. (R-040)
- The status-cell alignment exception to the prose boundary needs to be stated in the operator contract. (R-041)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

None: the max-iterations cap was reached; the terminal synthesis (research.md, this strategy, the registry and the synthesis event) carries the closed recommendations. The highest-value follow-up is R-008/R-039 (template anchor fix and contract decision).
<!-- /ANCHOR:next-focus -->

---

## 12. KNOWN CONTEXT

- All 15 iterations and their deltas are in this lineage directory; `research.md` is the synthesis.
- The stop policy was `max-iterations`; the terminal record carries `stopReason: maxIterationsReached`.

## 13. RESEARCH BOUNDARIES

- Max iterations: 15 (reached)
- Convergence threshold: 0.05 (telemetry only under max-iterations)
- Stop policy: max-iterations
- Progressive synthesis: true (synthesis written at iteration 15)
- Machine-owned sections: hand-maintained by this lineage's executor; no external reducer ran against this directory.
