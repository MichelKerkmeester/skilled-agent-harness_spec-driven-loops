# Observed in this packet, 2026-09-11

Running list of git and dispatch behaviors that failed, nearly failed, or misled an automated run.
Phase 007 starts from these, reproduces each, and adjusts the producer.

1. fanout-run write containment reverted the ORCHESTRATOR's own planning-doc edits made while a
   lineage was live, and marked the lineage failed after it had completed all ten iterations.
   Producer: fanout-run.cjs containment snapshot attributes every out-of-lineage dirty path to the
   lineage. Candidate adjustment: exclude paths the orchestrator declares, or diff against a
   snapshot taken per iteration, or document the freeze rule (ADR-005 chose the rule).
2. A `nohup pi -p ... &` launched from the Bash tool died silently mid-task with an empty log.
   Producer: process detachment from the tool shell. Adjustment: the attached background runner
   works; document the dispatch shape in cli-pi.
3. sk-git preflight advisory `add-pathspec-matches-nothing` fires on every `git add` of several
   existing paths from a linked worktree. Advisory only, but wrong. Producer:
   scripts/lib/git-rule-checks.mjs pathspec check under a worktree cwd.
4. The fanout stall watchdog reports `stall_detected` after five quiet minutes on a cli-pi
   lineage whose print mode buffers output until completion. Advisory, but it reads as a hang.
5. Git hooks are installed machine-wide through global `core.hooksPath` pointing at the main
   clone, so a hook edited in a linked worktree does not run there until merged. A worktree's
   hook harness runs the file by path, which hides this.
6. The live branch advanced by six commits during a research run from another session, so
   counts measured at the start were stale by the end. Any retrofit must pin a SHA with writers
   stopped.
7. The commit-msg hook warned "consider revising the message" on a message that only carried a
   spec path in Refs. Check which clarity rule fired and whether it should.
