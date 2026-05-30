You are the deep-research LEAF agent, iteration 2 of 10, for a root-cause investigation. RESEARCH ONLY — never modify source code, never touch git, never run the memory DB writes. Cite every claim as file:line.

REPO ROOT: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

READ FIRST (in this order):
- .opencode/specs/system-spec-kit/032-infra-memory-db-and-graph-churn/research/deep-research-strategy.md  (the charter: sub-questions SQ1-SQ4, non-goals, stop conditions)
- .opencode/specs/system-spec-kit/032-infra-memory-db-and-graph-churn/research/deep-research-findings-registry.json  (accumulated findings — do NOT repeat known ones)
- the two most recent .opencode/specs/system-spec-kit/032-infra-memory-db-and-graph-churn/research/iteration-*.md files if any

YOUR JOB THIS ITERATION:
1. Pick the SINGLE highest-value UNANSWERED sub-question (prefer P0: SQ1 substrate, SQ2 memory-constraint, SQ4 common-cause).
2. Investigate it deeply with Read/Grep/Glob/Bash (read-only) over the evidence sources in the charter. Trace actual code: the substrate harness + its TSV producer/runner; mk-spec-memory-launcher.cjs daemon lifecycle + .unclean-shutdown writer; the memory_fts_insert FTS5 trigger schema + the memory_index insert path; packets 031/009 and 032.
3. Form evidence-backed conclusions. Distinguish CONFIRMED (file:line proof) from HYPOTHESIS.

PRIMARY OUTPUT — write this file (overwrite if exists), iteration number zero-padded to 3 digits:
  .opencode/specs/system-spec-kit/032-infra-memory-db-and-graph-churn/research/iteration-002.md
Structure:
  # Iteration NNN — <sub-question tackled>
  ## Question
  ## Investigation (commands run + what each showed)
  ## Findings (each: CONFIRMED|HYPOTHESIS | the claim | evidence file:line | confidence 0-1 | tag fullyNew|partiallyNew|known)
  ## Negative knowledge (directions ruled OUT this iteration, with why)
  ## Open questions remaining (which SQ still unanswered)
  ## newInfoRatio self-estimate (0-1) + one-line justification

You MAY write ONLY these two files (nothing else, no source):
  - the iteration-002.md above
  - append ONE compact JSON line to deep-research-state.jsonl of shape:
    {"iteration":2,"newInfoRatio":<0-1>,"findingsCount":<int>,"openQuestions":["SQ#",...],"answered":["SQ#",...]}

Be surgical and evidence-first. If a sub-question is already CONFIRMED in the registry, move to the next unanswered one. End your run after writing the two files.

ITERATION-2 FOCUS (highest value): SQ2 — the memory-DB SQLITE_CONSTRAINT_PRIMARYKEY recurrence and unclean-shutdown lifecycle. Iter-1 CONFIRMED SQ1 is a harness-contract bug (shared append-mode TSV; the 5th row is a `runner:mk-spec-memory` connection diagnostic). Note the cross-link: that diagnostic row may tie to SQ2's daemon lifecycle — investigate whether the same `Connection closed`/unclean daemon exit produces both the diagnostic row AND the .unclean-shutdown marker. Trace mk-spec-memory-launcher.cjs exit paths, the .unclean-shutdown writer/remover, and why memory_index insert hits the FTS5 trigger constraint on a healthy-at-rest DB.
