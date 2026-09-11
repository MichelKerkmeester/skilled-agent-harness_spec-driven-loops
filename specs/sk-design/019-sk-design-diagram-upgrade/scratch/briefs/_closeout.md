## Closing out a phase

Gate 3 is pre-resolved: your write authority is YOUR phase folder only. Do not ask the
documentation-scope question. Do NOT edit anything under `.opencode/` — the implementation is done
and committed; your job is to make the packet's record match what actually shipped.

**What to do.**
1. Read your phase's `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md`.
2. Read the commits named in your brief with `git show --stat <sha>` and `git show <sha>` as needed.
3. For each task and each acceptance criterion, decide from EVIDENCE whether it is done:
   - Tick `- [ ]` to `- [x]` only when you can point at the commit, file or command output that
     settles it. Put that evidence inline, briefly.
   - A task the work did not do stays unticked, with one line saying why. Deferred is a fine
     outcome; a false tick is not.
   - A task the work did differently is ticked with the deviation named.
4. Fill `implementation-summary.md`: what was built, the evidence that it works, the deviations from
   plan, and what is left. Cite real paths and real command output.
5. Run the verification commands your phase claims, yourself, and quote what you saw. The skill root
   is `.opencode/skills/sk-design/sk-design-diagram`. Useful ones:
   - `node scripts/check-diagram-corpus.cjs | tail -3`
   - `node --test scripts/tests/`
   - `node scripts/apply-diagram-tokens.cjs --default --all --out /tmp/<you> && diff -rq /tmp/<you> assets/diagrams`
   - `node scripts/apply-design-md.cjs --default --all --out /tmp/<you>2 && diff -rq /tmp/<you>2 assets/diagrams`

**Rules.** Plain prose, no praise, no padding. Never write a spec path, finding id or task id into a
code comment (you are not editing code, but the rule binds anything you author). Do not touch another
phase's folder, the parent goal or the parent spec.

**Finish.** From the repository root, for YOUR folder only:
```
node .opencode/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js <folder> "$PWD"
node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/backfill-graph-metadata.js <folder>
NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/runtime/cli/spec/validate.sh" <folder> --strict --no-recursive
```
Repeat until you see the literal line `RESULT: PASSED`. Report: tasks ticked of total, criteria met of
total, anything left open and why, and the `RESULT:` line you saw.
