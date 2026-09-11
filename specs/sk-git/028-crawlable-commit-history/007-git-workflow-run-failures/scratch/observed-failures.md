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
8. Three concurrent cli-pi children were killed by the operating system for memory pressure with
   no partial output; the runner reported exit and nothing else. Two other sessions and desktop
   apps held most of the memory. Serial dispatch survived.
9. The pre-commit spec-remint gate blocks a commit when a packet has files staged and unstaged at
   once, including derived files a previous gate run or another process left dirty. A
   non-interactive committer that stages exact paths hits this with no way to answer.
10. `git count-objects` reports a leftover `tmp_pack_*` in the main clone's object store, the
    trace of a git process killed mid-write.
11. A dispatched child edited a packet's implementation-summary.md outside its brief because the
    completion-evidence advisory told it the packet claimed done with 0/15 items; the advisory
    reads the whole packet, not the child's deliverable.
12. `git add <several existing paths>` from a linked worktree fires the sk-git advisory
    `add-pathspec-matches-nothing` on every single commit of this session, twenty times so far,
    while every add staged exactly what it named.
13. A research lineage that reproduces git failures leaves throwaway repositories under its own
    scratch directory. Their nested `.git` directories make `git add` of the packet fail with
    "does not have a commit checked out", so the run's own evidence blocks the commit that records it.
14. The fan-out runner reported a `timestamp_anomaly` on the lineage's state records, six of seven
    after its window, because the child stamps local time with a Z suffix.
15. The pre-push routing gate hashes the working tree, so another session's uncommitted edits
    under a hub block a push of a clean commit from the same checkout. Pushing the exact commit
    from a clean worktree lets the gate judge the commit.
16. A refresh of a hub's manifest against a dirty tree attests uncommitted content; it had to be
    reverted before it could be committed by mistake.
17. zsh does not word-split an unquoted variable, so a refspec list built as a string reaches git
    as one argument and the push fails on a nonexistent refspec. Arrays only.
18. The citation remap moved three hashes inside a hub's benchmark reports, which are routing
    inputs, so the same push then needed the hub re-minted and its authored copy resynced.
