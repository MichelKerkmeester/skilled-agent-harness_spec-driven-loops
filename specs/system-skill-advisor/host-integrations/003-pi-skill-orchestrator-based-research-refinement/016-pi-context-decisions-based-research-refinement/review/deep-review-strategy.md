---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - Advisor Logic, Generation 5

Live strategy for the three native Opus passes that follow the DeepSeek generation.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
The system-skill-advisor logic: 154 source files under `.skilled/skills/system-skill-advisor/runtime/` and `hooks/` (tests, fixtures, benches and dist excluded), at HEAD `82af76f6754`. Target type: skill. Focus: The advisor's logic: runtime/ (lib, scorer, handlers, scripts including the Python fallback skill_advisor.py) and hooks/. Prose docs are out of scope unless code contradicts them.

Generation 4 (five DeepSeek passes, report archived at `review-archive/2026-11-23T21-41-09Z/review-report.md`) returned FAIL: one P1 (R2-P1-001, the launcher sets SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT=trusted while `advisor-server.ts:324-326` says a call without caller metadata stays untrusted), 14 P2s, failed scope and coverage gates and four deferred search rows (socket_hijack, python_ts_parity, duplication, lifecycle_and_derived_defect_scan). This generation starts a fresh registry: a finding that still holds is recorded again with its full repo-relative path.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Prose docs, except where code contradicts them.
- Test files as review targets; read them only to judge expected behaviour, and run them when a parity claim needs settling.
- No fixes: the review target is read-only.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: all 3 iterations run; convergence is telemetry only.
- Halt on a P0 that needs operator attention before more passes.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 22

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Running the parity suites instead of reading them settled python_ts_parity in two calls: vitest 206/206 in 9 files, python 130/0 (iteration 2)
- Comparing the client socket checks with the shared server's own threat comment exposed the missing owner check (iteration 2)
- One batched sed over every cited line rechecked all eight open findings in a single call (iteration 3)
- A path sweep over the catalog (123 paths, none missing) plus a caller grep found the claims that are false, not the paths (iteration 3)
- A caller sweep split the lifecycle and derived exports into three live callers and stress-test-only code, which cleared that scan without chasing dead code (iteration 4)
- Reading prompt-cache.ts settled the publish-after-commit gap: the cache keys on sourceSignature, not the generation (iteration 4)
- A probe on the built dist/ scorer with two constructed holders settled R1-P2-005 in one call: gen-4's literal case is clean, a withheld lower holder misfires (iteration 5)
- A name-existence sweep over all 55 playbook scenarios, then triage of the 10 hits, ran playbook_capability inside budget (iteration 5)
- Grepping every temp-dir writer and comparing each with the owner check route-receipt.ts:282-290 already holds isolated metrics.ts as the outlier; a dist probe with a planted symlink confirmed the append and the chmod follow it (iteration 6)
- Reading each fix at its own line instead of trusting the change summary closed 18 of 19 findings in one pass, and surfaced the one regression the summary hid: the Python fallback now depends on a data file at import (iteration 8)
- A diff sweep for `G5-I`, `specs/`, `ADR-`, `REQ-` and `CHK-` over the added lines proved no ephemeral label entered a comment (iteration 8)
- Running the fallback against a missing policy (`SPECKIT_ADVISOR_PROMPT_POLICY_PATH=/nonexistent/... --force-local`) settled G5-I8-P2-001 in one call: exit 0, one stderr warning, a normal `sk-code` payload (iteration 9)
- `git check-ignore -v` named the exact `.gitignore` lines (212, 214) for the default path and its rotations, which closed G5-I2-P2-002 without reading the sink again; a `git status` cross-check then exposed the un-staged `owned-private-dir.ts` (iteration 9)
- Running each finding's own probe command instead of re-reading its fix closed all four remaining P2s in four calls, and the `resolvedFindings` field on the record is what makes the reducer retire them (iteration 10)
- Reading the HEAD diff at the cause on the three hunks whose failure modes point opposite ways (the scoped graph delete, the shared ownership predicate, the metrics append) showed each correct in both directions; two candidate defects died at the second direction test (iteration 10)
- Running the four acceptance-criteria command families instead of describing them closed the last traceability gap in one pass: six commands, six exit 0 at HEAD `5c5b9fe3e5b`, and `spec_code` moved `partial` to `pass` on observed output (iteration 11)

---

## 9. WHAT FAILED
- Capturing the vitest exit through PIPESTATUS inside a subshell printed empty; only the summary line is evidence (iteration 2)
- The 24-call budget did not reach handlers/skill-graph/status.ts and validate.ts (iteration 2)
- The 24-call budget left playbook_capability unrun; INTENT_BOOSTERS against PHRASE_BOOSTS was compared only through the shared corpus, not table by table (iteration 3)
- The 24-call budget covered advisor-validate.ts, query.ts and the other skill-graph handlers only through an error-site grep, not line by line (iteration 4)
- The playbook sweep's tool-name regex matched substrings of script names and shell functions; 6 of 10 hits were false positives (iteration 5)
- A single-uid probe cannot show the cross-user chmod failure; that step of G5-I6-P1-001 rests on metrics.ts:263-265 (iteration 6)
- The 24-call budget covered the five largest uncited files by header, catch-site and function-length scans only; derive-command-bridges.cjs and skill_graph_compiler.py still lack a line-by-line read, and 90 further scope files remain uncited (iteration 7)
- What worked (iteration 7): a diff of the two shared-payload.ts copies plus `git log` on the workflow it names exposed a removed drift watcher in two calls; reading the divergence ratchet settled the seed-bound parity question without a probe
- The RRF fix could not be settled from the scorer files alone: `fuseRankedLists`' own score construction lives outside them, so the rank-versus-score-order question stayed an edge case rather than a finding (iteration 8)
- G5-I2-P2-002's gitignore half was left unverified because the budget went to the 19 code sites; it stays open rather than resolved (iteration 8)
- macOS has no `timeout` binary, so the first policy probe died with exit 127 and cost a call before the rerun produced evidence (iteration 9)
- The win32 claim (G5-I9-P2-001) rests on Node's documented mode reporting, not on a win32 run; no platform support statement exists in the target to settle it either way (iteration 9)
- The final pass still could not execute a foreign-uid write or a Windows run, so four of the six closed findings rest on code plus in-repo tests rather than on a reproduction (iteration 10)
- `runtime/advisor-server.ts`, `runtime/lib/freshness/generation.ts` and `runtime/skill-advisor-cli.ts` went into the omitted-high-risk list: the budget went to the probed findings and the four largest behavioural hunks (iteration 10)
- A named test path is not a guard: `tests/sk-git-worktree-sweep-vocabulary.vitest.ts` does not exist (the file is under `tests/scorer/`), and `vitest run` treated the unmatched argument as a filter, ran one file and exited 0. Only the file count in the summary line exposed it (iteration 11)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`checkIpcSocketOwnership` accepting a world-writable trusted parent:** the parent is checked through the same `ownershipProblem` predicate, including the `(stat.mode & 0o022) !== 0` refusal. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **`checkIpcSocketOwnership` accepting a world-writable trusted parent:** the parent is checked through the same `ownershipProblem` predicate, including the `(stat.mode & 0o022) !== 0` refusal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`checkIpcSocketOwnership` accepting a world-writable trusted parent:** the parent is checked through the same `ownershipProblem` predicate, including the `(stat.mode & 0o022) !== 0` refusal.

### **`deleteMissingNodesUnderRoot` leaving a stale row after a skill-id rename:** the old row's stored path is still under the scan root, so it is deleted; the case is covered by the plain relative test, not only the canonical one. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **`deleteMissingNodesUnderRoot` leaving a stale row after a skill-id rename:** the old row's stored path is still under the scan root, so it is deleted; the case is covered by the plain relative test, not only the canonical one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`deleteMissingNodesUnderRoot` leaving a stale row after a skill-id rename:** the old row's stored path is still under the scan root, so it is deleted; the case is covered by the plain relative test, not only the canonical one.

### **`spec_code` staying `partial`:** rejected by observation. The four command families ran and exited 0; keeping `partial` after running them would report an evidence gap that no longer exists. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **`spec_code` staying `partial`:** rejected by observation. The four command families ran and exited 0; keeping `partial` after running them would report an evidence gap that no longer exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`spec_code` staying `partial`:** rejected by observation. The four command families ran and exited 0; keeping `partial` after running them would report an evidence gap that no longer exists.

### **A `P2` for the stale AC-006 path:** rejected as a code finding. The defect is in the packet's evidence command, AC-006's claim survives a run at the correct path, and no reviewed file carries the wrong path. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **A `P2` for the stale AC-006 path:** rejected as a code finding. The defect is in the packet's evidence command, AC-006's claim survives a run at the correct path, and no reviewed file carries the wrong path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `P2` for the stale AC-006 path:** rejected as a code finding. The defect is in the packet's evidence command, AC-006's claim survives a run at the correct path, and no reviewed file carries the wrong path.

### **A defect in `realpathOfNearestAncestor` for a path with no existing ancestor:** `dirname` of a filesystem root returns itself, and that root exists, so the loop terminates. Not reachable as a hang. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A defect in `realpathOfNearestAncestor` for a path with no existing ancestor:** `dirname` of a filesystem root returns itself, and that root exists, so the loop terminates. Not reachable as a hang.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A defect in `realpathOfNearestAncestor` for a path with no existing ancestor:** `dirname` of a filesystem root returns itself, and that root exists, so the loop terminates. Not reachable as a hang.

### **A regression from recomputing `knownSkillIds` out of the database:** deletions precede it inside the same transaction, so it cannot contain a node that no longer exists. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A regression from recomputing `knownSkillIds` out of the database:** deletions precede it inside the same transaction, so it cannot contain a node that no longer exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A regression from recomputing `knownSkillIds` out of the database:** deletions precede it inside the same transaction, so it cannot contain a node that no longer exists.

### **An AC-014 regression:** ruled out. `Unmet` is the criterion's authored state, not a drift the code introduced; this pass supplies one of the two PASS verdicts it asks for. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **An AC-014 regression:** ruled out. `Unmet` is the criterion's authored state, not a drift the code introduced; this pass supplies one of the two PASS verdicts it asks for.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An AC-014 regression:** ruled out. `Unmet` is the criterion's authored state, not a drift the code introduced; this pass supplies one of the two PASS verdicts it asks for.

### **Multiple-directory aliasing breaking `metrics.ts`'s `dirReady` cache:** one root, one path builder (`:324`), so the process-wide flag describes exactly one directory. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Multiple-directory aliasing breaking `metrics.ts`'s `dirReady` cache:** one root, one path builder (`:324`), so the process-wide flag describes exactly one directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Multiple-directory aliasing breaking `metrics.ts`'s `dirReady` cache:** one root, one path builder (`:324`), so the process-wide flag describes exactly one directory.

### **Skipped tests masking an acceptance gate:** ruled out by the skip probe; the four skips are named spec-folder lineage cases and one conditional guard, none of them on an AC-006..AC-013 path. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Skipped tests masking an acceptance gate:** ruled out by the skip probe; the four skips are named spec-folder lineage cases and one conditional guard, none of them on an AC-006..AC-013 path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Skipped tests masking an acceptance gate:** ruled out by the skip probe; the four skips are named spec-folder lineage cases and one conditional guard, none of them on an AC-006..AC-013 path.

### `generation.ts`'s corrupt-lock reclaim does not introduce a delete-before-read race: the mtime and the token are both re-read immediately before `rmSync`, and a lock that gained a token between observations fails both re-reads. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `generation.ts`'s corrupt-lock reclaim does not introduce a delete-before-read race: the mtime and the token are both re-read immediately before `rmSync`, and a lock that gained a token between observations fails both re-reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `generation.ts`'s corrupt-lock reclaim does not introduce a delete-before-read race: the mtime and the token are both re-read immediately before `rmSync`, and a lock that gained a token between observations fails both re-reads.

### `isOwnedPrivateDir` throwing on `ENOENT` is not reachable from the four callers: each calls it after `mkdirSync` on the same path. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `isOwnedPrivateDir` throwing on `ENOENT` is not reachable from the four callers: each calls it after `mkdirSync` on the same path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `isOwnedPrivateDir` throwing on `ENOENT` is not reachable from the four callers: each calls it after `mkdirSync` on the same path.

### `policy-plan.ts`'s two-candidate require list does not mask a load failure: both candidates are tried, and the failure is reported with the last path and message; a module that loads without `GATE_3_QUESTION` legitimately returns `undefined`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `policy-plan.ts`'s two-candidate require list does not mask a load failure: both candidates are tried, and the failure is reported with the last path and message; a module that loads without `GATE_3_QUESTION` legitimately returns `undefined`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `policy-plan.ts`'s two-candidate require list does not mask a load failure: both candidates are tried, and the failure is reported with the last path and message; a module that loads without `GATE_3_QUESTION` legitimately returns `undefined`.

### A downgrade of G5-I6-P1-001 to P2: the reach is named on Linux, and the default prompt-free record weakens only the disclosure half. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A downgrade of G5-I6-P1-001 to P2: the reach is named on Linux, and the default prompt-free record weakens only the disclosure half.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A downgrade of G5-I6-P1-001 to P2: the reach is named on Linux, and the default prompt-free record weakens only the disclosure half.

### A missing prompt policy crashing the TypeScript runtime: `runtime/lib/prompt-policy.ts:46` reads without a guard, but that is pre-existing, out of this fix batch, and separate from the Python degradation the fix introduced on purpose. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A missing prompt policy crashing the TypeScript runtime: `runtime/lib/prompt-policy.ts:46` reads without a guard, but that is pre-existing, out of this fix batch, and separate from the Python degradation the fix introduced on purpose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing prompt policy crashing the TypeScript runtime: `runtime/lib/prompt-policy.ts:46` reads without a guard, but that is pre-existing, out of this fix batch, and separate from the Python degradation the fix introduced on purpose.

### Command strings built from prompt text: no `shell: true`, `exec(` or `execSync` with prompt data in runtime/ or hooks/ outside tests and benches. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Command strings built from prompt text: no `shell: true`, `exec(` or `execSync` with prompt data in runtime/ or hooks/ outside tests and benches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command strings built from prompt text: no `shell: true`, `exec(` or `execSync` with prompt data in runtime/ or hooks/ outside tests and benches.

### handler_defect_scan, searched-clean. Every handler either parses its input through Zod or returns through a catch that reports an error. No handler reports success on a failed step. The one half-write is the publish-after-commit gap under Edge Cases, shown harmless to the cache. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: handler_defect_scan, searched-clean. Every handler either parses its input through Zod or returns through a catch that reports an error. No handler reports success on a failed step. The one half-write is the publish-after-commit gap under Edge Cases, shown harmless to the cache.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: handler_defect_scan, searched-clean. Every handler either parses its input through Zod or returns through a catch that reports an error. No handler reports success on a failed step. The one half-write is the publish-after-commit gap under Edge Cases, shown harmless to the cache.

### heldBelow naming one holder (fusion.ts:545-558): the named binding is the lowest-scored holder, which is the one whose ceiling (min) set the final score, as the comment at :542-544 states. Not a defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: heldBelow naming one holder (fusion.ts:545-558): the named binding is the lowest-scored holder, which is the one whose ceiling (min) set the final score, as the comment at :542-544 states. Not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: heldBelow naming one holder (fusion.ts:545-558): the named binding is the lowest-scored holder, which is the one whose ceiling (min) set the final score, as the comment at :542-544 states. Not a defect.

### isError loss in toMCP: the skill-graph handlers never set isError. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: isError loss in toMCP: the skill-graph handlers never set isError.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: isError loss in toMCP: the skill-graph handlers never set isError.

### lifecycle_and_derived_defect_scan, searched-clean on the serving path. Two weak spots sit in code that only `runtime/stress-test/` calls: the all-or-nothing reject at `.skilled/skills/system-skill-advisor/runtime/lib/derived/anti-stuffing.ts:58-67`, where one instruction-shaped n-gram such as "run tool" empties every derived value of a skill, and the substring match at `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:33-37`, where a prompt naming `sk-code-review` counts as naming `sk-code`. Neither reaches a live route, so they belong under the existing dead-feature finding G5-I3-P2-002 and do not need their own. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: lifecycle_and_derived_defect_scan, searched-clean on the serving path. Two weak spots sit in code that only `runtime/stress-test/` calls: the all-or-nothing reject at `.skilled/skills/system-skill-advisor/runtime/lib/derived/anti-stuffing.ts:58-67`, where one instruction-shaped n-gram such as "run tool" empties every derived value of a skill, and the substring match at `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:33-37`, where a prompt naming `sk-code-review` counts as naming `sk-code`. Neither reaches a live route, so they belong under the existing dead-feature finding G5-I3-P2-002 and do not need their own.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: lifecycle_and_derived_defect_scan, searched-clean on the serving path. Two weak spots sit in code that only `runtime/stress-test/` calls: the all-or-nothing reject at `.skilled/skills/system-skill-advisor/runtime/lib/derived/anti-stuffing.ts:58-67`, where one instruction-shaped n-gram such as "run tool" empties every derived value of a skill, and the substring match at `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:33-37`, where a prompt naming `sk-code-review` counts as naming `sk-code`. Neither reaches a live route, so they belong under the existing dead-feature finding G5-I3-P2-002 and do not need their own.

### Mode-bit loss on `skill_advisor.py` (`100755` -> `100644`): every in-repo entry point passes the interpreter explicitly (`runtime/lib/subprocess.ts:367` sets `command = options.pythonBin ?? 'python3'`, `runtime/scripts/init-skill-graph.sh:86` runs `python3 ...`, `runtime/scripts/routing-accuracy/score-routing-corpus.py:33` loads it as a module), so no caller executes it by shebang. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Mode-bit loss on `skill_advisor.py` (`100755` -> `100644`): every in-repo entry point passes the interpreter explicitly (`runtime/lib/subprocess.ts:367` sets `command = options.pythonBin ?? 'python3'`, `runtime/scripts/init-skill-graph.sh:86` runs `python3 ...`, `runtime/scripts/routing-accuracy/score-routing-corpus.py:33` loads it as a module), so no caller executes it by shebang.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mode-bit loss on `skill_advisor.py` (`100755` -> `100644`): every in-repo entry point passes the interpreter explicitly (`runtime/lib/subprocess.ts:367` sets `command = options.pythonBin ?? 'python3'`, `runtime/scripts/init-skill-graph.sh:86` runs `python3 ...`, `runtime/scripts/routing-accuracy/score-routing-corpus.py:33` loads it as a module), so no caller executes it by shebang.

### NaN from age-haircut.ts:37-40 on a malformed timestamp: the only live caller passes `derivedGeneratedAt` validated through isoTimestampOrNull (projection.ts:1334). Not reachable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: NaN from age-haircut.ts:37-40 on a malformed timestamp: the only live caller passes `derivedGeneratedAt` validated through isoTimestampOrNull (projection.ts:1334). Not reachable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: NaN from age-haircut.ts:37-40 on a malformed timestamp: the only live caller passes `derivedGeneratedAt` validated through isoTimestampOrNull (projection.ts:1334). Not reachable.

### Prompt-time refusal as a separate finding: folded into P2-001 as defence-in-depth evidence, because hooks reach the daemon only through the CLI. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt-time refusal as a separate finding: folded into P2-001 as defence-in-depth evidence, because hooks reach the daemon only through the CLI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-time refusal as a separate finding: folded into P2-001 as defence-in-depth evidence, because hooks reach the daemon only through the CLI.

### Propagate-apply trust predicate mismatch: fails closed; no write path is reachable without trust. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Propagate-apply trust predicate mismatch: fails closed; no write path is reachable without trust.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Propagate-apply trust predicate mismatch: fails closed; no write path is reachable without trust.

### Python twin of G5-I5-P2-001: no seed bound and no capped withheld holder in skill_advisor.py (see job 2). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Python twin of G5-I5-P2-001: no seed bound and no capped withheld holder in skill_advisor.py (see job 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Python twin of G5-I5-P2-001: no seed bound and no capped withheld holder in skill_advisor.py (see job 2).

### python_ts_parity disagreement: both suites pass (206/206 vitest, 130/0 Python); no divergent case within the shared corpus. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: python_ts_parity disagreement: both suites pass (206/206 vitest, 130/0 Python); no divergent case within the shared corpus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: python_ts_parity disagreement: both suites pass (206/206 vitest, 130/0 Python); no divergent case within the shared corpus.

### R1-P2-005 as generation 4 stated it: whenever the target clusters on score, the lower holder is already in the cluster, so the ambiguity flag is unchanged. Probe rows C1 and C4 show this. The defect that remains is narrower and is recorded as G5-I5-P2-001. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: R1-P2-005 as generation 4 stated it: whenever the target clusters on score, the lower holder is already in the cluster, so the ambiguity flag is unchanged. Probe rows C1 and C4 show this. The defect that remains is narrower and is recorded as G5-I5-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R1-P2-005 as generation 4 stated it: whenever the target clusters on score, the lower holder is already in the cluster, so the ambiguity flag is unchanged. Probe rows C1 and C4 show this. The defect that remains is narrower and is recorded as G5-I5-P2-001.

### STOP_WORDS as a duplicated vocabulary: the Python and TypeScript sets serve different roles and are not meant to agree. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: STOP_WORDS as a duplicated vocabulary: the Python and TypeScript sets serve different roles and are not meant to agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: STOP_WORDS as a duplicated vocabulary: the Python and TypeScript sets serve different roles and are not meant to agree.

### Symlink escape through cross-skill-edges apply: discovery skips symlinks, and the apply guard receives the root. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Symlink escape through cross-skill-edges apply: discovery skips symlinks, and the apply guard receives the root.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Symlink escape through cross-skill-edges apply: discovery skips symlinks, and the apply guard receives the root.

### The `heldBelow`/`heldBy` pair does not double-count the ambiguity exception: `clustersWithTop` returns early on a holder match before the score-gap test, so a held member is never clustered by score. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The `heldBelow`/`heldBy` pair does not double-count the ambiguity exception: `clustersWithTop` returns early on a holder match before the score-gap test, so a held member is never clustered by score.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `heldBelow`/`heldBy` pair does not double-count the ambiguity exception: `clustersWithTop` returns early on a holder match before the score-gap test, so a held member is never clustered by score.

### The `playbook_capability` drift: no scenario names a runtime or hooks capability that the code no longer provides. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The `playbook_capability` drift: no scenario names a runtime or hooks capability that the code no longer provides.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `playbook_capability` drift: no scenario names a runtime or hooks capability that the code no longer provides.

### The missing Python seed bound as its own parity finding: the divergence ratchet catches any routed effect on the corpus, and the leftover test-coverage gap belongs under G5-I3-P2-001. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The missing Python seed bound as its own parity finding: the divergence ratchet catches any routed effect on the corpus, and the leftover test-coverage gap belongs under G5-I3-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The missing Python seed bound as its own parity finding: the divergence ratchet catches any routed effect on the corpus, and the leftover test-coverage gap belongs under G5-I3-P2-001.

### The P1 fixes are not cosmetic: each removes the reachable path, not just the reported one. The owned-dir module replaces four copies; the IPC check is required by the CLI's bridge contract; the root scope is computed from the scan argument rather than a global. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The P1 fixes are not cosmetic: each removes the reachable path, not just the reported one. The owned-dir module replaces four copies; the IPC check is required by the CLI's bridge contract; the root scope is computed from the scan argument rather than a global.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The P1 fixes are not cosmetic: each removes the reachable path, not just the reported one. The owned-dir module replaces four copies; the IPC check is required by the CLI's bridge contract; the root scope is computed from the scan argument rather than a global.

### The tiny-skill deletion edge (a skill nested inside the scanned root) is the intended semantics of a root-scoped scan, not a regression. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The tiny-skill deletion edge (a skill nested inside the scanned root) is the intended semantics of a root-scoped scan, not a regression.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The tiny-skill deletion edge (a skill nested inside the scanned root) is the intended semantics of a root-scoped scan, not a regression.

### TOCTOU between the ownership check and the connect: the checked directory is private and owned, so nobody else can swap the socket inside the window; the connect uses the same resolved path. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: TOCTOU between the ownership check and the connect: the checked directory is private and owned, so nobody else can swap the socket inside the window; the connect uses the same resolved path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: TOCTOU between the ownership check and the connect: the checked directory is private and owned, so nobody else can swap the socket inside the window; the connect uses the same resolved path.

### Unused-import build break from the fix batch: `existsSync`, `statSync`-successor `lstatSync`, `chmodSync` and `realpathSync` are all still referenced in `shadow-sink.ts` (`:73`, `:94`, `:101`, `:156`, `:214`), and `lstatSync` is still used twice in `route-receipt.ts` (`:233`, `:296`). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Unused-import build break from the fix batch: `existsSync`, `statSync`-successor `lstatSync`, `chmodSync` and `realpathSync` are all still referenced in `shadow-sink.ts` (`:73`, `:94`, `:101`, `:156`, `:214`), and `lstatSync` is still used twice in `route-receipt.ts` (`:233`, `:296`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unused-import build break from the fix batch: `existsSync`, `statSync`-successor `lstatSync`, `chmodSync` and `realpathSync` are all still referenced in `shadow-sink.ts` (`:73`, `:94`, `:101`, `:156`, `:214`), and `lstatSync` is still used twice in `route-receipt.ts` (`:233`, `:296`).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none. Final iteration of a `max-iterations` run; all four dimensions are complete (4/4). - Focus area: synthesis. - Reason: the last outstanding traceability gap is closed. `spec_code` moves `partial` to `pass` on six observed command runs at HEAD `5c5b9fe3e5b`, `checklist_evidence` re-confirmed, and the registry holds no active P0, P1 or P2. - Rotation status: complete (4/4). - Blocked/productive carry-forward: `SL-004` (`state_transition`) remains the single deferred search row. Nothing is blocked. - Required evidence: synthesis should recompute the registry from the deltas and confirm the merged verdict is PASS with `hasAdvisories=false`, and the packet owner should apply the AC-006 path amendment named in Edge Case 3. - Recovery note: not applicable. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
