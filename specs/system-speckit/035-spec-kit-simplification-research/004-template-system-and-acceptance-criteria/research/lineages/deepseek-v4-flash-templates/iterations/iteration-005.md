# Iteration 005 — The completion stack (RQ5)

- Angle: the three completion surfaces (tasks.md verification checklist via check-completion.sh; acceptance-criteria.md gates; the retired checklist.md), who reads each, and whether the 010 remediation of this cluster actually changed the code or only the prose.
- Verdict: the READMEs and the discovery list landed; the CODE did not. The completion-evidence sentinel — the "completion Stop hook" the root README now names as an enforcement surface — still keys its entire evaluation path on `statSync(checklist.md)`, which is retired and absent from every packet, so the tasks-checklist verification it describes is unreachable and the Stop hook only ever stats implementation-summary.md. The richest part of the sentinel (P0-evidence, priority-context, P0/P1 incomplete verdicts) is dead code. Round one's f-iter005-002 got the docs fixed; the consumer it cited (sentinel.cjs:7,217) was left behind — and the round-two discovery is worse: it's not just a comment, it's the branch condition.
- Findings: 4 (1×P1, 3×P2). Tool calls: 6/12.

## Findings

### f-iter005-001 [P1] — the sentinel's evaluation path is gated on the retired checklist.md; the tasks-checklist leg is unreachable
- THE CLAIM (now-documented behavior): runtime/lib/hooks/README.md:12 — the sentinel "reads the verification checklist in a spec folder's `tasks.md` via `check-completion.sh --json` (or a Level 1 folder's `implementation-summary.md` via a file stat)". Root README:199 — "The tasks checklist is enforced by `check-completion.sh` and the completion Stop hook".
- WHAT THE CODE DOES: `evaluateCompletionEvidence` in completion-evidence-sentinel.cjs:
  1. `hasChecklist = statSync(join(absoluteSpecFolder, 'checklist.md')).isFile()` → always false (checklist.md is retired; absent from SPEC_DOCUMENT_FILENAMES spec-doc-paths.ts:17-29, absent from every packet — the golden test pins the retirement, scaffold-golden-snapshots.vitest.ts:136-147);
  2. `verdict = hasChecklist ? verdictFromChecklistResult(runCheckCompletion(...)) : verdictFromImplementationSummary(...)` — so check-completion.sh (the tasks.md checklist reader, check-completion.sh:441) is NEVER spawned from the Stop hook, and `verdictFromImplementationSummary` merely stats `implementation-summary.md` (exists → ok).
  3. The entire richer machinery — `gates.p0MissingEvidence`, `p1MissingEvidence`, `priorityContextMissing`, `P0_INCOMPLETE`, `P1_INCOMPLETE` (all inside verdictFromChecklistResult) — is unreachable.
- VERDICT ON 010: the remediation "fixed" the hooks README (f-iter005-002) and the runtime README list (f-iter005-001) but did not touch the sentinel. The docs now describe behavior the code does not have.
- SEVERITY: P1 (wrong-or-unused: the advertised Stop-hook enforcement surface enforces nothing beyond implementation-summary presence; the completion exposer still calls check-completion.sh itself (completion-state.cjs:31,141), so the main gate survives — the sentinel leg is the dead one).
- RECOMMENDATION: fix — gate on `tasks.md`'s verification section (or run check-completion.sh for any folder whose tasks.md carries `<!-- ANCHOR:protocol -->`), keep the impl-summary stat for Level 1, and delete the checklist.md branch (with the stale header comment at the top of the file).

### f-iter005-002 [P2] — sentinel header comment still says "checklist.md via check-completion.sh --json"
- THE CLAIM: file-top comment block of completion-evidence-sentinel.cjs ("a folder's checklist.md via check-completion.sh --json, or a Level 1 folder's implementation-summary.md via a stat").
- WHAT THE CODE DOES: check-completion.sh reads tasks.md (check-completion.sh:132,441); the "checklist.md not found" branch the comment mentions was "pre-checked-away" — the script hardcodes tasks.md and errors without ANCHOR:protocol (:443).
- SEVERITY: P2 (comment-level residue of the same class as f-iter005-001; would mislead the next maintainer repairing the sentinel).
- RECOMMENDATION: fix the comment together with the code (one edit).

### f-iter005-003 [P2] — root README names the Stop hook as a tasks-checklist enforcement surface; it is not one
- THE CLAIM: README.md:199 — "The tasks checklist is enforced by `check-completion.sh` and the completion Stop hook, not by the validator."
- WHAT THE CODE DOES: the Stop-hook sentinel never runs check-completion.sh (f-iter005-001); the tasks-checklist enforcement today is check-completion.sh itself + the completion exposer (completion-state.cjs → system-speckit-completion plugin). The validator leg of the sentence is right (no completion rule in the registry — 39 rules, none for the tasks checklist).
- SEVERITY: P2 (the boundary statement is the right shape; one participant in it is misstated).
- RECOMMENDATION: fix — "enforced by check-completion.sh and the completion exposer; the completion Stop hook advises on implementation-summary presence" (until f-iter005-001 lands).

### f-iter005-004 [P2] — root README says AC_CLOSURE "fails on an unmet criterion"; it fails only on a completion claim
- THE CLAIM: README.md:199 — "`validate.sh` runs `AC_CLOSURE`, which fails on an unmet criterion".
- WHAT THE CODE DOES: check-ac-closure.sh:345-361 — unmet criteria set `RULE_STATUS=fail` ONLY when `_acc_completion_claimed` (spec.md/implementation-summary.md Status cell ∈ complete/done/shipped/delivered/closed); in-progress packets with open criteria get `info` ("still open while the packet is in progress"). A post-cutoff ABSENCE is a hard fail at :262-268 regardless of completion state (that leg the README describes elsewhere and correctly).
- SEVERITY: P2 (comprehension-level imprecision in the boundary paragraph that round one's fix produced; the distinguishing condition is the completion claim).
- RECOMMENDATION: fix — "fails on an unmet criterion when the packet claims completion".

## What worked
- The binary-ish sentinel decode: grep -a + a small python extractor made the dead branch visible without running anything; the hooks README:12 sentence was written to be the counter-evidence, and it is.

## Ruled out (this iteration)
- checklist.md appears anywhere in the discovery canonical list: RULED OUT — spec-doc-paths.ts:17-29 (11 entries) has no checklist.md; runtime/README.md has no checklist mention (the f-iter005-001 fix landed).
- check-completion.sh reads anything but tasks.md: RULED OUT — :132 (`merged_tasks` only for tasks.md) and :441 hardcode tasks.md.
- The completion exposer relies on the sentinel: RULED OUT — completion-state.cjs:31,141 spawns check-completion.sh itself; the sentinel is advisory-only.

## Carried questions
- CQ-007: does the Stop-hook adapter (Claude/Codex/OpenCode plugins) reach the sentinel's evaluateCompletionEvidence, or is there a runtime adapter that bypasses it anyway? (synthesis note; the runtime adapters are outside the lane's cited file set — flag as unverifiable here.)
