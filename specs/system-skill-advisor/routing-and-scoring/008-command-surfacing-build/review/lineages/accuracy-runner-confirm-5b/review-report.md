# Review Report - Command Surfacing Pass Five confirming round, `accuracy-runner-confirm-5b`

Lineage: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/accuracy-runner-confirm-5b`
Area: `accuracy-runner`. Range: `2a1a42263cc..d21dbc1cafe`. Session:
`fanout-accuracy-runner-confirm-5b-1794780590351-ezt1v0`. Iterations: 3 of 3 (maxIterations reached).
Verdict: PASS with advisories (8 P2, no active P0 or P1).

## 1. Executive Summary

The confirming round read the eight accuracy-runner paths of the pass-five fix commit and the docs
that describe them, against the verification report that raised the findings and against decision
D13 that recorded the limits. The two fixes this area had to confirm hold: an in-place shell edit is
now a write event, and the arena builder refuses a dirty source, a stale build and an escaping or
absolute link before it writes anything, with a JSON line on every failed check. The every-turn
remote guard is wired where D3 says, and the child environment closes the network transports with an
empty credential helper, an empty GitHub CLI config, no prompt and `GIT_ALLOW_PROTOCOL=file`.

No P0 or P1 remains. Eight P2 findings are recorded: four in the new reader code, two on the new
guard surface, and two documentation gaps. None of them hides a write in a case the fix claims, and
none changes the verdict.

## 2. Planning Trigger

A planning pass is not required for the pass/fail decision. The four reader P2s and the two guard
P2s are one-line hardening items inside files this phase already touched; the two documentation P2s
are one-sentence additions to `routing-accuracy/README.md`. If the operator wants them closed, a
light remediation pass over `AR5B-P2-001` to `AR5B-P2-008` is enough; no decision needs to be
reopened, except the writer-list question in `AR5B-P2-004`, which is a scope choice rather than a
bug.

## 3. Active Finding Registry

| Id | Severity | Dimension | File:line | Title |
|----|----------|-----------|-----------|-------|
| AR5B-P2-001 | P2 | correctness | `score-command-transcripts.mjs:1040` | A `--target-directory` copy records the source as the file it changed |
| AR5B-P2-002 | P2 | correctness | `score-command-transcripts.mjs:895-899` | A background `&` is folded into the writer's argument list |
| AR5B-P2-003 | P2 | correctness | `score-command-transcripts.mjs:515` | A three-backtick line closes a four-backtick fence |
| AR5B-P2-004 | P2 | correctness | `score-command-transcripts.mjs:822-831` | In-place editors outside the fix's writer list stay invisible |
| AR5B-P2-005 | P2 | security | `run-command-behaviour.mjs:653` | `turnRefusal` throws where its contract promises a refusal |
| AR5B-P2-006 | P2 | traceability | `run-command-behaviour.mjs:1429` | A mid-arm refusal names no row |
| AR5B-P2-007 | P2 | traceability | `routing-accuracy/README.md:111` | The `symlink_escape` clause names two of the three refusals |
| AR5B-P2-008 | P2 | maintainability | `routing-accuracy/README.md:135` | The scorer row never says an in-place shell edit is a write |

All eight are open; none is resolved and none is contradicted by a later iteration.

## 4. Remediation Workstreams

1. **Reader hardening** (`AR5B-P2-001`, `-002`, `-003`): teach `writtenWords` the long
   `--target-directory` spelling, split a segment on a bare `&` operator, and remember a fence's
   length so a shorter fence cannot close a longer one. Each is a small change in
   `score-command-transcripts.mjs` with one new case in `command-transcript-score.vitest.ts`, and the
   long-target test's assertion should move from "some write" to the destination path.
2. **Writer-list decision** (`AR5B-P2-004`): decide whether `git rm`, `git checkout -- <path>`,
   `install`, `truncate` and `rsync` should count as writes. D1 adopted the verifier's list, so this
   is a decision, not a defect repair.
3. **Guard contract** (`AR5B-P2-005`, `-006`): convert a git read failure inside `turnRefusal` into a
   refusal code, and carry the row id on a mid-arm refusal the way `head_moved` does.
4. **README truth** (`AR5B-P2-007`, `-008`): name the dangling-link refusal beside the other two, and
   say in the scorer row that an in-place shell edit is a write.

## 5. Spec Seed

- The parent spec's phase row (`spec.md:151`) already states the four behaviors this round confirmed;
  no spec change is needed for the shipped code.
- If remediation is taken, add one sentence to the phase row or a follow-up task that names the
  dangling-link refusal, so the spec, the code and the README agree on all three link conditions.

## 6. Plan Seed

- One task per reader P2, test first, in `command-transcript-score.vitest.ts`.
- One task for the guard contract, test first, in `command-behaviour-guards.vitest.ts`.
- One doc task for the two README sentences.
- The writer-list item needs a decision row before a task: name the writers to add and the false
  positives they can create.

## 7. Traceability Status

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | `spec.md:151` matches the four claimed changes; the extra link refusals are stricter, not contrary |
| `checklist_evidence` | notApplicable | the packet has no `checklist.md`; `tasks.md` lane A rows carry a named verifier pass each |
| `skill_agent` | notApplicable | no agent definition changed |
| `agent_cross_runtime` | notApplicable | `copyArgs(platform)` is the only platform branch and its test pins both answers |
| `feature_catalog_code` | notApplicable | no feature page describes the scorer or the arena builder |
| `playbook_capability` | notApplicable | no playbook surface changed |

Dimensions: correctness (iteration 1), security (iteration 2), traceability and maintainability
(iteration 3). All four have one full pass.

## 8. Deferred Items

- The recorded limits of D13 are not re-reported: the wrapper class (`sudo`, `timeout`, `env`,
  `command`, `find -exec`, `xargs`, `ssh`, `watch`), interpreter writes, a document read in the same
  shell call as a write, tracked absolute symlinks that arrive through the clone, `extends`/`files`
  in a tsconfig, and the builder's no-JSON exits for a usage error, a non-repository source and an
  unwritable destination.
- The four-backtick fence behavior follows from T051's "closing only on its own character" wording;
  the finding records it, and a fix would need the task's wording reopened.
- The `cp --target-directory` path is explicitly accepted as "at least one write" in T050c; the
  finding records the consequence (a scratch source path can hide the in-checkout write) rather than
  a task contradiction.

## Dimension Expansion Map

| Dimension | Iteration | Focus | Outcome |
|-----------|-----------|-------|---------|
| correctness | 1 | write reader and COMMAND reader | 4 P2 |
| security | 2 | arena provenance and live-turn guard | 2 P2 |
| traceability | 3 | spec row, task rows, README | 2 P2 (one traceability, one maintainability) |
| maintainability | 3 | README and test coverage | carried in the same pass |

## 9. Search Ledger

- `normalize` probed in memory with 31 shell spellings, through `startState`/`loopInit` for the ask
  row: the ten D1 writer spellings produce writes; the wrapper class produces none (recorded).
- `commandLines` probed in memory with 20 marker spellings: plain, numbered, heading, checkbox,
  bold-wrapped and inline-code forms read; prose, blockquote, three-backtick and tilde fences do not.
- Arena builder read line by line, not executed: a probe writes a temp source repository outside this
  lineage's write surface. Each refusal is pinned by a test in `command-behaviour-guards.vitest.ts`.
- Live-turn guard read line by line; `turnRefusal` and `childEnv` are exported and the tests pin the
  remote, marker, dry-run and protocol cases.
- Docs read against the code: `routing-accuracy/README.md:108-145`, the parent phase row, and the
  lane A task rows with their evidence clauses.

## 10. Audit Appendix

- Three iterations, each recorded through the append gateway (exit 0, ledger sequences 1-3) with a
  delta file and a strategy update; the reducer ran after each and reports 8 open findings, 0
  resolved, convergence score 0.75 at the terminal stop. The synthesis close-out staged
  `deep_review.synthesis_complete` and the gateway recorded it as ledger sequence 4, after which the
  reducer reports `status: COMPLETE`, `stopReason: maxIterationsReached` and full dimension coverage.
- Deviation recorded: the run-opening config row is the `deep-review-config.json` file the reducer
  reads, not a ledger `config` event. The gateway refuses a bare config object ("expected object with
  stem or event_type"), and the canonical `deep_review.run_initialized` payload needs a target
  reference, a convergence policy version and a review-contract digest this process cannot compute
  without fabricating them, so the draft `config.event.json` was left unappended.
- No code, test, config, registry, dashboard or shared doc was modified. Writes stayed inside the
  lineage directory: `deep-review-config.json`, `deep-review-strategy.md`, the three iteration
  narratives, the three delta files, the three record files, the synthesis event file and this report.
- No prompt corpus file was opened; no model session, build or daemon ran.
