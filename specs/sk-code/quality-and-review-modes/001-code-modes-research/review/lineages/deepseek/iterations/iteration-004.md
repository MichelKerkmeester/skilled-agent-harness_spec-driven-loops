# Review Iteration 4 — Security

## Dimension

Security. This pass asks whether the packet's write-authority claim held, whether the executor that ran the second pass was bounded by a control that worked, whether any recommendation weakens a security floor without saying so, and whether the reviewed artifacts carry credentials or obeyed instruction-like text embedded in the files they read.

## Files Reviewed

- `specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:69,81,85-86,99,123-129`
- `specs/sk-code/014-code-modes-research/001-quality-mode-research/implementation-summary.md` (executor and containment rows)
- `specs/sk-code/014-code-modes-research/002-review-mode-research/spec.md:91-95,144-152` (fixed inputs and risks)
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/research.md:19,84-101`
- `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md:196-214`
- Secret scan over every `.md`, `.json` and `.jsonl` in the packet outside `review/lineages/`

## Findings

### P0 Findings

None. No credential is exposed, no authentication or authorization surface is touched, and nothing was destroyed: the only deletion was a set of quarantine copies, made with the operator's approval and recorded.

### P1 Findings

None. Nothing in the packet changes shipped behaviour, because the packet is findings-only and no file under `.skilled/` was edited by it.

### P2 Findings

1. **The second pass ran an executor with sandboxing disabled while the control that bounded it had already failed** -- `specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:86` -- Iterations 11 to 15 ran through the `if_cli_devin` branch with `--permission-mode dangerous` (`implementation-summary.md:86`). The run's write authority is asserted by NFR-S01 (`spec.md:163`) and enforced only by the post-dispatch write-containment guard. That guard is recorded as defective in the same document: it "does not exempt a sibling single-executor run's `research/` folder, so the first run's quarantine held the sibling's files" (`implementation-summary.md:127`), which is why `research/containment/` existed and was later deleted (`:69`). A permission mode that disables the sandbox therefore ran five iterations while the compensating control was known to be wrong in exactly the sibling-folder case it had just mishandled. No unauthorized write is claimed and none is visible, so this is a control gap rather than a realized exposure; the risk is that the same pairing is reused by the next packet that reads this summary as a recipe.
   Finding class: control-gap
   Scope proof: executor and containment rows in the reviewed implementation summaries; no claim about `.skilled/` behaviour is made from this finding.
   Affected surface hints: `implementation-summary.md` How It Was Delivered and Known Limitations; the `/deep:research` auto workflow's `if_cli_devin` branch; any later packet that copies this executor recipe.
   Case: a later run repeats the pairing on a worktree where a sibling loop is writing at the same time, and the guard moves that sibling's files into the wrong packet with no operator watching.

2. **The only artifact of the containment failure was deleted, leaving the write-authority claim verifiable only by prose** -- `specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:69` -- The Files Changed table records `research/containment/` as "Deleted by the operator" and gives no manifest, hash or file list of what it held. NFR-S01 (`spec.md:163`) asserts the run had no write authority outside `research/`; the single piece of evidence that would test that assertion was the quarantine directory, and it is gone. The packet's account of the failure is now the only record, and a reader cannot distinguish a guard that copied two files from one that copied forty.
   Finding class: evidence-retention
   Scope proof: Files Changed row and Known Limitations row in the reviewed child; no file outside the packet read for this finding.
   Affected surface hints: `implementation-summary.md` Files Changed; NFR-S01 in `spec.md`; the runtime defect that a later packet would fix.
   Case: the runtime owner wants to reproduce the containment defect and has no list of which sibling paths were captured, so the fix cannot be regression-tested against the observed case.

### Confirmed clean

- No credential, token or private key appears anywhere in the packet: a scan for `sk-`, `ghp_`, `AKIA`, private-key headers and `password=` patterns over every `.md`, `.json` and `.jsonl` outside the review lineage returned no match. The `llmgateway` credential is named as a dependency (`spec.md:148`) and never printed.
- No recommendation relaxes a fixed input without saying so. Child 002 states the monotonicity rule outright: the repo-owned profile "may only add or raise, never relax, plus an explicit list of the floors no extension may change" (`research/research.md:19`), and the never-skip sensitive-path extension is additive-only. Child 001's checklist split is marked `Needs decision: the P0 floor` rather than ranked as ready.
- No reviewed artifact contains a directive that the run obeyed. The instruction-like lines the syntheses quote — the "never skip when diff touches" table and the envelope's "never let it stand in for the handoff" note — are cited as evidence, and no recommendation depends on treating them as commands to the reviewer.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Carried from iteration 2; not re-sampled here. |
| `checklist_evidence` | core | fail | Carried from iteration 3; the security-adjacent rows (AC-009 boundary, AC-010 validation) are part of that finding. |

## Verdict

Two P2 advisories and no P0/P1. The packet discloses both the privileged executor and the guard defect; what it does not do is retain the evidence that would let either be re-tested.

Review verdict: PASS
