# Second rc.3 probe run

A second session repinned dsh to 0.2.2-rc.3 on 2026-11-14 on branch `worktrees/376-dsh-single-executor-loop`, before this phase reached main. Its folder was folded into this phase when the two branches merged. Its raw probes repeat the ones under `probes/`, so only the facts they lack are kept here.

## Results That Agree With This Phase

- T004 LLM Gateway: exit 0, `completed`, empty stderr.
- T005 OpenCode Go: exit 0, `completed`.
- T006: the cwd write and `echo ok` completed. The home write was denied and left no file. The OS temp write completed and was removed after.
- T007: no `UNSUPPORTED_REASONING_EFFORT` in stderr.
- T008: exit 0, `"succeeded":1`, `completed_with_containment_advisory` 0, 262.7 s. The lineage log ends with a `completed` final event and `FANOUT_LINEAGE_COMPLETE:dsh-rc3`. No `dsh-home-*` folder newer than the run start was left in the temp folder.

## Facts This Phase Lacks

- The `find ~/.dsh` listing with mtimes and sizes was identical before and after the probes, at 480 entries. A scan of the 110 files in that folder for both key values found 0 hits.
- rc.3 adds an escalation hint to a sandbox denial. The home write error says escalation is available with `sandbox_permissions`. Under `--approval-policy never` the run took no wider mode. A prompt that asks the model to retry with it is untested.
- The installed binary is shared between sessions. A downgrade in another session makes every dispatch refuse until the pin moves again.
- The first vitest run after the pin edits failed one test in `tests/unit/fanout-run.vitest.ts`. Its regex held an escaped `rc\.1` that a literal search missed. That line was fixed and the run passed.
