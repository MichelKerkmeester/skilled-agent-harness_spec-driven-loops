# Review Iteration 001 — D1 Correctness

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness
BINDING: specFolder=specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes

- Dispatcher: /deep:review loop, iteration 1 of 5. Mode=review, target_agent=deep-review, run=1.
- Lineage: sessionId=dr-githooks-20261002T103712Z, parentSessionId=null, generation=1, lineageMode=new.
- Budget profile: verify. Target files cite absolute paths under /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/ (main checkout). The worktree-075 fix set was read only as context; every finding is proven from main-target lines, and R1-P1-002 was reproduced in a scratch repository. The target was not modified.
- Untrusted-content guard: no reviewed artifact carried directive-like text aimed at the reviewer; all content was treated as data.

## Dimension

D1 Correctness: logic, state transitions, invariants, edge cases, behavior against observable intent. 5 P1 + 3 P2 raised; no D1 P0 (one P0-class trust-boundary candidate deferred to D2 Security).

## Files Reviewed

14/14 declared scope files, fully read: pre-commit, prepare-commit-msg, commit-msg, post-commit, post-merge, post-rewrite, pre-push, lib/autostash-orphan-guard.sh, lib/mass-deletion-guard.sh, lib/message-contract-gate.sh, install-git-hooks.sh, hooks/git/pre-commit, validate-message.mjs, lib/message-contract.mjs (all under /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/).

## Findings by Severity

### P0 Findings

None raised this iteration. One P0-class candidate deferred to D2 Security (dimension ownership, next iteration): the global hooks source code from the repository they fire in via the `_in_toolchain_repo` sentinel, so an untrusted clone that ships `hooks/shared/hook-flags.sh` or `scripts/git-hooks/lib/*` executes its code on commit/merge/rewrite. Evidence pointers: pre-commit:22-33, post-commit:23-35, post-merge:23-37, post-rewrite:25-38, pre-push:46-70. Deferred, not dismissed.

### P1 Findings

1. **R1-P1-001 — Subject line deleted when it matches a forbidden attribution key** — prepare-commit-msg:189 (drop loop 183-197; key regex 107; matcher 124-133; writer 290-329).
   - Evidence: the drop loop starts at index 0 and `line_is_forbidden_attribution` matches `^(Co-Authored-By|Claude-Session):` with no position guard; the subject can be dropped, and as the only line leaves just `Commit-Id: N`.
   - Scenario: `git commit -m 'Co-Authored-By: correct the trailer parser'` → subject stripped → commit-msg reports `subject.format` (message-contract.mjs:397-433) for a subject the author never wrote; commit blocked. With a passthrough subject match, the subject would be silently lost.
   - Finding class: instance-only. Scope proof: only call site of the matcher is line 189; no index guard exists.
   - Affected surface hints: ["prepare-commit-msg stamper","commit-msg subject.format gate","attribution policy"]
   - Claim adjudication: type=correctness/input-loss; claim=the attribution filter applies to the authored subject; evidenceRefs=[prepare-commit-msg:107,124-133,183-197,290-329]; counterevidenceSought=searched for subject exemption, none; consumer blocks rather than recovers; alternativeExplanation=header defines dropped lines as runtime-appended attribution, not subjects; finalSeverity=P1; confidence=high; downgradeTrigger=if such subjects are impossible here → P2.

2. **R1-P1-002 — Clean/continued cherry-picks keep the copied Commit-Id** — prepare-commit-msg:83-88 (detection), 68-73 (merge/squash exit), 185-188 (drop condition).
   - Evidence: `CHERRY_PICK=1` only when `$SOURCE = "commit"`; scratch experiment recorded `source=[message]` for a clean `git cherry-pick`; a continued pick arrives as `merge` and main exits on line 71. The copied id is not dropped, contradicting the file header (lines 5-9: "a cherry-pick re-mints a fresh one").
   - Scenario: `git cherry-pick <sha>` whose message has `Commit-Id: 42`; the new commit keeps 42. If the original is an ancestor of HEAD, `git log --all --not HEAD` (message-contract.mjs:654-662) cannot see it, so commit-msg passes and a duplicate id lands; pre-push rangeContext (message-contract.mjs:687-714) then blocks the later push.
   - Finding class: cross-consumer. Scope proof: detection read at 83-88; id drop only under CHERRY_PICK at 185.
   - Affected surface hints: ["prepare-commit-msg CHERRY_PICK detection","commit-msg uniqueness","pre-push uniqueness"]
   - Claim adjudication: type=correctness/contract-mismatch; claim=documented re-mint is not implemented; evidenceRefs=[prepare-commit-msg:5-9,68-73,83-88,177-197, scratch experiment]; counterevidenceSought=commit-msg catches it only when the original is outside HEAD history; alternativeExplanation=none; finalSeverity=P1; confidence=high; downgradeTrigger=if trailers.commitId.unique is off → P2.

3. **R1-P1-003 — Comment stripping ignores commit.cleanup; `#`-leading `-m`/`-F` lines misclassified** — message-contract.mjs:279-291 (validator) and prepare-commit-msg:151-159 (stamper).
   - Evidence: `stripCommitMessage` and the stamper's `COMMENT_START` walk-back drop every `#`-leading line unconditionally; git strips comments only with an editor (or cleanup=strip). validate-message.mjs:136 passes commentChar but no cleanup mode; revListMode reads stored messages with `alreadyClean: true` (line 158), so the mismatch is structural.
   - Scenario A (false block): `git commit -m '#123 resolve the flaky test'` → git stores it as subject; commit-msg sees an empty message → `message.empty` → valid commit blocked.
   - Scenario B (mis-ordering): `git commit -m 'feat(a): x' -m '#include cleanup required'` → stamper writes Commit-Id above the body line; commit-msg passes after stripping it, pre-push reads the stored message raw and can report `trailer.final-paragraph`.
   - Finding class: cross-consumer. Scope proof: the two stripping sites are the only ones in the target.
   - Affected surface hints: ["stripCommitMessage","prepare-commit-msg comment walk-back","commit-msg gate","pre-push gate"]
   - Claim adjudication: type=correctness/contract-mismatch; claim=enforcement strips lines git keeps and mis-orders trailers; evidenceRefs=[message-contract.mjs:279-291, validate-message.mjs:136,158, prepare-commit-msg:151-159,264-326]; counterevidenceSought=editor-mode behavior is correct, so the code is only wrong for its unconditional application; alternativeExplanation=policy cleanup=strip, not enforced anywhere; finalSeverity=P1; confidence=high; downgradeTrigger=`#`-leading body lines impossible → P2.

4. **R1-P1-004 — Comment-hygiene gate validates the working tree, not the staged blob** — pre-commit:74-94 (checker runs on `$full_path` at line 79); same pattern at hooks/git/pre-commit:43-45.
   - Evidence: the gate iterates `git diff --cached` names but runs the checker on the filesystem path; no `git show :$file` anywhere.
   - Scenario (bypass): edit `src.js` to add an ephemeral pointer, `git add src.js`, then restore the working tree (`git show HEAD:src.js > src.js`). The hook checks the clean worktree and passes; the commit carries the staged violating blob. The inverse (clean index, dirty worktree) falsely blocks.
   - Finding class: class-of-bug. Scope proof: both scope hook copies use the filesystem path; no pre-push hygiene re-check exists.
   - Affected surface hints: ["check-comment-hygiene.sh","pre-commit",".skilled/hooks/git/pre-commit legacy copy","staged index"]
   - Claim adjudication: type=correctness/gate-bypass; claim=the verdict covers uncommitted content, not history content; evidenceRefs=[pre-commit:74-94, hooks/git/pre-commit:41-50]; counterevidenceSought=no later hygiene gate found; alternativeExplanation=none; finalSeverity=P1; confidence=high; downgradeTrigger=CI enforces the checker on protected branches → P2.

5. **R1-P1-005 — New-branch contract range uses argv remote; URL pushes re-check published history** — pre-push:107 (`REMOTE_NAME="${1:-origin}"`), 202-208.
   - Evidence: for `is_new=1` the range is `"$local_sha --not --remotes=$REMOTE_NAME"`; `--remotes=<value>` matches refs by name. When `$1` is a URL (`git push git@host:org/repo.git branch`), it matches nothing, `--not` excludes nothing, and revListMode (validate-message.mjs:143-144) walks the whole reachable history; legacy commits that predate the contract block creating the branch. Same for a named remote with no local remote-tracking refs.
   - Scenario: `git push git@github.com:acme/repo.git feature-x` based on origin/main with one legacy-violating ancestor → blocked with "commits pushed ... break the commit rules above" although only new commits are added.
   - Finding class: algorithmic. Scope proof: the only construction of the new-branch exclusion; split verbatim by revListMode.
   - Affected surface hints: ["pre-push range","validate-message revListMode","remote argv semantics"]
   - Claim adjudication: type=correctness/over-restriction; claim=published commits are re-validated whenever argv is not a fetched remote name; evidenceRefs=[pre-push:107,202-208, validate-message.mjs:143-144]; counterevidenceSought=named fetched remote works as intended; URL pushes are standard; alternativeExplanation=fail-closed defense, but the stated contract is "commits the push adds"; finalSeverity=P1; confidence=medium-high; downgradeTrigger=URL pushes operate outside policy → P2.

### P2 Findings

6. **R1-P2-006 — Validator failure reported as a rule violation in pre-push** — pre-push:207-213. `if ! node ...` maps every non-zero exit to "commits ... break the commit rules above" + "Reword them", but exit 2 means broken contract/user error (validate-message.mjs:15-18,204-209). Scenario: force-push over an unfetched remote tip → `remote_sha..local_sha` (line 205) fails rev-list → exit 2 → blocked with reword advice despite no faulty commit. Class: instance-only. Recommendation: separate exit 1 from other exits.

7. **R1-P2-007 — Commit-Id uniqueness flags legitimate rebase/amend copies** — message-contract.mjs:654-662 (worktreeContext), 687-714 (rangeContext owners). `git log --all --not HEAD` has no author/date discrimination. Scenario: `git branch keep` at the tip, then rebase/amend the branch; `keep` holds the pre-rebase copy with the same id → commit blocked with `trailer.commit-id-unique`. Class: algorithmic. Recommendation: match author+author-date copies before reporting a collision.

8. **R1-P2-008 — Command-scope skgit.contractDir disables commit-time enforcement** — message-contract.mjs:239 and message-contract-gate.sh:38 both read `git config --get`, which includes `command` scope (`git -c`, GIT_CONFIG_*). Scenario: `git -c skgit.contractDir=/tmp/empty-rules commit ...` → commit-msg enforces nothing, pre-push (no `-c`) rejects the same commit → the gates disagree. Class: cross-consumer. Recommendation: honor only file-scoped config.

## Traceability Checks

- spec_code (core): partial — prepare-commit-msg header contract (lines 5-9) vs implementation checked; mismatch recorded as R1-P1-002. Full spec.md alignment is D3's.
- checklist_evidence (core): deferred to D3 (checklist not in this iteration's read set).
- Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not checked this iteration; D3.

## Integration Evidence

- pre-push → validate-message.mjs `--rev-list` (pre-push:207-208; validate-message.mjs:140-161) for R1-P1-005/R1-P2-006.
- commit-msg → validator via mcg_validator_path (commit-msg:57; message-contract-gate.sh:30-32) for R1-P1-003.
- prepare-commit-msg → sk-git allocator commit-id-naming.sh (prepare-commit-msg:60) for the id-mint contract.
- Scratch experiment (no scope file modified) recorded `prepare source=[message]` for a clean cherry-pick.

## Edge Cases / Ambiguities

- Cherry-pick source strings observed empirically on this machine; the continued-pick `merge` path is corroborated by main's `case merge|squash) exit 0` (line 71).
- R1-P2-007 impact depends on the contract enabling `trailers.commitId.unique`; the enforcement code exists in the reviewed library regardless.
- The iteration record timestamp is approximate (run start 10:37:12Z); no clock call was within budget.
- The run's raised budget was consumed (30 tool calls, orchestrator target 20 / hard max 30).

## Confirmed-Clean Surfaces

- mass-deletion-guard.sh:24-61 — counts digit-sanitized, verdict guarded, fail-open.
- autostash-orphan-guard.sh:50-79 — sequencer autostash anchored before stash-list; best-effort paths guarded.
- install-git-hooks.sh:83-94, 168-183 — only owned symlinks replaced; foreign hooks skipped with warning.
- post-commit:67-78 — live-sync restricted to linked worktrees (git-dir != common-dir).

## Ruled Out

- Shell injection via stamped trailer values: SPEC value is regex-constrained (prepare-commit-msg:239); validator only path-joins (message-contract.mjs:476-490); no exec/eval sink.
- Path traversal via skgit.contractDir: resolved against repo root and existence-checked (message-contract.mjs:239-245; message-contract-gate.sh:38-49).
- Mass-deletion arithmetic/injection: digit-sanitized counts and guarded comparisons (mass-deletion-guard.sh:24-39,54-61).
- Installer overwriting foreign hooks: is_our_symlink scopes replacement to owned source dirs (install-git-hooks.sh:83-94).

## Verdict

No P0 raised in D1; 5 active P1 → CONDITIONAL, per the severity mapping. See strategy §12 for the D2 handoff.

## Next Dimension

D2 Security — lead with the deferred P0 candidate (repo-controlled hook sourcing) and the `skgit.contractDir` command-scope bypass; then trailer/attribution trust surfaces.

Review verdict: CONDITIONAL
