
TARGET: P/handover.md

STEP 0 (the cited captures moved from scratch/ to evidence/; rewrite their paths)
  sed -i '' -e 's#scratch/dispatch/#evidence/dispatch/#g' -e 's#scratch/pi-#evidence/pi-#g' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/handover.md

EDIT 1
OLD: - **Next safe action**: Finish strict validation. Then commit the phase on the worktree branch after the operator's yes, the first part of T017.
NEW: - **Next safe action**: Commit the phase on the worktree branch after the operator's yes, the first part of T017.

EDIT 2
OLD: Tasks T001 to T012 are done and T013 to T017 are open.
NEW: Tasks T001 to T014 are done and T015 to T017 are open.

EDIT 3 (replace the whole numbered list)
OLD: 1. Finish the packet docs and parent records, then run strict validation until it prints RESULT: PASSED (T013, T014).
2. Commit the phase on the worktree branch after the operator's yes, the first part of T017.
3. Merge main, clear the primary checkout residue with the operator's yes, then re-mint the cli-jev compiled-routing manifest (T015).
4. Re-verify the merged tree with Hermes sync, the scorer ratchet, the link check and the route guard before any push (T016).
5. Push after the operator's yes, watch CI, then remove the worktree (the rest of T017).
NEW: 1. Commit the phase on the worktree branch after the operator's yes, the first part of T017.
2. Merge main, clear the primary checkout residue with the operator's yes, then re-mint the cli-jev compiled-routing manifest (T015).
3. Re-verify the merged tree with Hermes sync, the scorer ratchet, the link check and the route guard before any push (T016).
4. Push after the operator's yes, watch CI, then remove the worktree (the rest of T017).

EDIT 4
OLD: wu6-parent-rows and wu7-048-live-row.
NEW: wu6-parent-rows, wu7-048-live-row and wu8-rev-* for the revision pass over the six documents. The live-proof captures and the dispatch trail first lived in scratch/ and moved to evidence/ before the commit, because the packet docs cite them and the spec-kit folder rules keep cited files out of scratch/.

EDIT 5
OLD: AC-009. Unmet until the orchestrator runs validate.
NEW: AC-009. Met.

EDIT 6
OLD: Task status: T001 to T012 are done. T013 to T017 are open.
NEW: Task status: T001 to T014 are done. T015 to T017 are open.

EDIT 7 (INSERT one line directly after this ANCHOR line)
ANCHOR: - re-score after the cli-jev fix -> 152/195 full corpus, 27/32 memory_save, row 26 routes to system-deep-loop
NEW:
- `validate.sh --strict` on this packet -> RESULT: PASSED, 0 errors, 0 warnings. On 048 -> RESULT: PASSED. The parent's recursive run passes the parent folder and 49 of its 50 phases, and fails only on phase 030, whose goal.md durable slice is 6498 characters against a 4000 limit. This phase did not touch 030

VERIFY - run these, paste each command with its result line
  grep -c 'scratch/pi-\|scratch/dispatch' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/handover.md   # expect 0
  grep -c 'T013 to T017' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/handover.md                   # expect 0
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/handover.md                # expect 14
