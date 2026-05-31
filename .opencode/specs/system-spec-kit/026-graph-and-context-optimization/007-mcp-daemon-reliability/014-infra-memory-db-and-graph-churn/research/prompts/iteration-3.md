You are the deep-research LEAF agent, iteration 3 of 10, for a root-cause investigation. RESEARCH ONLY — never modify source code, never touch git, never run the memory DB writes. Cite every claim as file:line.

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
  .opencode/specs/system-spec-kit/032-infra-memory-db-and-graph-churn/research/iteration-003.md
Structure:
  # Iteration NNN — <sub-question tackled>
  ## Question
  ## Investigation (commands run + what each showed)
  ## Findings (each: CONFIRMED|HYPOTHESIS | the claim | evidence file:line | confidence 0-1 | tag fullyNew|partiallyNew|known)
  ## Negative knowledge (directions ruled OUT this iteration, with why)
  ## Open questions remaining (which SQ still unanswered)
  ## newInfoRatio self-estimate (0-1) + one-line justification

You MAY write ONLY these two files (nothing else, no source):
  - the iteration-003.md above
  - append ONE compact JSON line to deep-research-state.jsonl of shape:
    {"iteration":3,"newInfoRatio":<0-1>,"findingsCount":<int>,"openQuestions":["SQ#",...],"answered":["SQ#",...]}

Be surgical and evidence-first. If a sub-question is already CONFIRMED in the registry, move to the next unanswered one. End your run after writing the two files.

ITERATION-3 FOCUS (close the loop): 
- SQ4 (P0) — move the common-cause from HYPOTHESIS to CONFIRMED or REFUTE it. Iter-2 established the mechanism: a concurrent second launcher kills the incumbent mk-spec-memory daemon mid-op, which BOTH drops the SQ1 `Connection closed` diagnostic AND skips the graceful DB close that prevents SQ2's unclean-shutdown/WAL-divergence. Prove or disprove the timing: does the launcher single-writer lease actually permit a second launcher to SIGKILL the incumbent without a graceful-close barrier? Trace mk-spec-memory-launcher.cjs lease acquisition + reap path + whether 031/009's fixes (respawn-lock liveness, reap-root, marker-after-close) actually cover the live two-launcher swap or leave a gap.
- SQ3 (P1) — quickly re-verify the graph-metadata churn root cause still holds at HEAD (the committed fix: idempotent last_save_at + last_active_child_id/last_active_at preservation + scoped walk) and whether it shares the daemon-swap lifecycle.
If SQ4 reaches CONFIRMED/REFUTED and SQ3 is re-verified, this can be the final evidence iteration before synthesis.
