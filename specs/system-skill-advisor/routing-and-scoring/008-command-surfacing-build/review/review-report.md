# Review Report: Command Surfacing Build, Pass Seven (three lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the seventh review pass. It read the code this branch changed after pass six (`85550ee946e..1c3d62def5a`, phases 037 and 038 and the test pin) and this branch's net change to the root README against origin/main (`review/review-scope-7.txt`, three areas).
- Executor for every lineage: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, three iterations each, convergence threshold 0.10, run through `fanout-run.cjs` (exit 0).
- Brief: `review/review-brief-7.txt`. Config: `review/deep-review-fanout-config-pass-7.json`. Pass six's report is kept as `review-report-pass-6.md`.

---

## 1. Executive Summary

- **Verdict: PASS.** P0 0, P1 0, P2 6. All six P2 are fixed as task T013 of phase 038.
- **Convergence:** last new-findings ratios scorer-7 0.25, attach-config-7 0.5 and docs-7 0. The two above 0.10 found P2 only, which the rule passes five and six applied counts as converged.
- **No stored number moved:** the four stored sets rescored after the fixes equal the phase 038 rescore (`038-alignment-p1-remediation/scratch/after-pass-seven.txt`).

---

## 2. Findings and Dispositions

| Lineage | Severity | Location | Finding | Disposition |
|---------|----------|----------|---------|-------------|
| scorer-7 | P2 | `score-command-transcripts.mjs` guarded write | A `~/` write read as scratch, so a guarded row writing into the home folder was safe | Fixed: a home path counts, with a test |
| scorer-7 | P2 | same | A scratch prefix with a `..` step hid a write into a real folder | Fixed: the path is normalised first, with a test |
| scorer-7 | P2 | same | One helper answered both "inside the checkout" and "outside scratch" | Fixed: `guardedWriteCounts` names the rule and tests the scratch folders itself |
| scorer-7 | P2 | `routing-accuracy/README.md` | The README did not state the guarded-write boundary | Fixed: the scorer row states it, with the `:auto` case |
| attach-config-7 | P2 | `score-command-transcripts.mjs` `MODE_SUFFIX` | The scorer's command parser kept the old suffix list | Fixed: the same chain as the matcher, with a test |
| attach-config-7 | P2 | `command-attach.ts` comment | The comment said the hints define where a modifier applies, while the matcher reads it after any command | Fixed: the comment says a modifier on any tracked command still names it |

docs-7 found nothing: every command the README names exists under `.skilled/commands`.

---

## 3. Verification

| Check | Result |
|-------|--------|
| New cases | The home path, `..` and chained-suffix cases fail on the previous scorer and pass now |
| Advisor suite | See `038-alignment-p1-remediation/scratch/after-pass-seven.txt` |
| Stored numbers | Unchanged from the phase 038 rescore |
