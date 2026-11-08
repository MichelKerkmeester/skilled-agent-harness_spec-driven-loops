### V09
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:546-550` runs repository-wide `git status`; `:1136-1143` filters paths by the child artifact directory; `:1888-1898` describes the post-dispatch guard and preserved paths. The manifests at `001-spec-kit-core/.../quarantine/13/manifest.json:5`, `003-cli-and-deep-loop/.../quarantine/14/manifest.json:5`, and `005-doctor-git-ci-runtime/.../quarantine/15/manifest.json:5` each record `cli-classifier.zip`.
COMMAND: read only -> exit 0
CORRECTED CLAIM: -

### V10
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/commands/deep/assets/deep-research-confirm.yaml:304` acquires the lock with a 1,800,000 ms TTL; `:633` refreshes it; `:1109` begins the approval gate. `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:640-643` marks it stale after more than twice the TTL and skips owner-process checks for transient locks.
COMMAND: read only -> exit 0
CORRECTED CLAIM: -

### V11
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2520` selects the last appended iteration row; `:2610` counts iteration rows. The child 004 state log duplicates iterations 15 at lines 20-21 and 19 at lines 27-28; the read-only count returned 22 rows and 20 distinct iterations.
COMMAND: read only -> exit 0
CORRECTED CLAIM: The defect is real, but the reducer path is `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, not `runtime/scripts/reduce-state.cjs` as cited.

### V12
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1656-1663` warns on malformed delta rows and pads the result with nulls. For a required state log, `:1871-1875` refuses corrupted input; `:3314-3321` maps the refusal or corruption error to exit 2.
COMMAND: read only -> exit 0
CORRECTED CLAIM: -

### V13
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/commands/deep/assets/deep-research-auto.yaml:619` extracts `last_focus` from the latest iteration record. All 26 iteration rows in child 003’s state log have the same seven-key shape and omit `focus`, `mode`, and `answeredQuestions`; its delta at `deltas/iter-026.jsonl:1` retains those fields in a 14-key record.
COMMAND: read only -> exit 0
CORRECTED CLAIM: The canonical state-log projection omits those three fields, so `last_focus` cannot read them there. The full leaf record remains in the delta file.

### V14
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/commands/deep/assets/deep-review-auto.yaml:541` initializes `releaseReadinessState` to `in-progress`; `:682-699` has no extraction for `release_readiness_state`; `:2490` passes that variable to closeout. `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:114-120` requires the flag and `:422-446` records its supplied value.
COMMAND: read only -> exit 0
CORRECTED CLAIM: -

### V15
VERDICT: CHANGED
SEVERITY: propose P2 because the confirm path validates its input session hierarchy, and no malformed round output was observed; the missing post-dispatch checks leave a validation gap.
EVIDENCE: `.skilled/commands/deep/assets/deep-ai-council-confirm.yaml:173-182` invokes the orchestrator without a `post_dispatch_validate` block; the auto version at `deep-ai-council-auto.yaml:175-186` declares round-record and route-proof checks. `orchestrate-session.cjs:469-478` validates the session hierarchy before dispatch.
COMMAND: read only -> exit 0
CORRECTED CLAIM: Confirm mode lacks the auto workflow’s post-dispatch checks for emitted round records and route proof, but it does validate the input session hierarchy before dispatch.

### V16
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/commands/deep/assets/deep-research-auto.yaml:615-616` counts iteration rows; `:773` stops at the row cap; `:2036-2040` appends an error iteration when outputs are missing. The cited error rows appear in child 001’s state log at line 7, 002 at line 8, 005 at line 8, and child 003 generation 1’s archived log at line 6. The decision records for those children document Devin `resource_exhausted` errors.
COMMAND: read only -> exit 0
CORRECTED CLAIM: -

BATCH DONE