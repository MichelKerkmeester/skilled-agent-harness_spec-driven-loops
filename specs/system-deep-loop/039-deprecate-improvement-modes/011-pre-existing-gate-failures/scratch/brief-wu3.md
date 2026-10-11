ROLE: You repair one test script, .github/scripts/tests/broken-move-drill.sh. Work only in this git worktree. Do not commit in it.

FACT: the drill was written before the source tree moved. It clones the repo, runs `rm -rf .skilled`, `mv .opencode .skilled`, `ln -s .skilled .opencode`. The move has since landed: .skilled is now the real tree and .opencode is a directory of relative links into ../.skilled. So the setup now builds self-referencing links ("Too many levels of symbolic links" on 18028 paths), SKILL_FILE comes back empty at line 94, and the drill exits 2.

TASK: make the setup work on the current, already-moved tree, so sections 1 and 2 test the gate inputs as the header describes. When the clone is already moved, skip the rm/mv/ln step. For the "move itself" push range (MOVE_LINE), use the real move commit from history: the commit that added the .skilled tree (find it with git log, do not hard-code a hash). Keep the pre-move path working if .skilled is absent. Change nothing else in the drill's expectations unless an expectation is provably about the old layout; list each such change.

ALLOWED WRITES: .github/scripts/tests/broken-move-drill.sh only.

HOW TO TEST (the drill clones committed HEAD, which lacks this branch's staged work):
1. T=$(mktemp -d); git clone -q --local "$PWD" "$T/repo"
2. git diff --cached --binary HEAD | git -C "$T/repo" apply --index   (staged work)
3. git -C "$T/repo" -c user.email=t@t -c user.name=t commit -qm wip
4. bash "$T/repo/.github/scripts/tests/broken-move-drill.sh"; echo "exit=$?"
Repeat steps 1-4 after each edit (copy your edited script into $T/repo before step 3, or redo the clone). Remove $T when done.

DONE WHEN: the drill exits 0 with every expectation PASS, run as above. If some expectation fails for a reason outside the drill script (a real gate defect), stop and report it with the failing output instead of weakening the expectation.

HANDBACK: the diff summary, the final PASS/FAIL count and exit code, and any expectation you changed with its reason.
