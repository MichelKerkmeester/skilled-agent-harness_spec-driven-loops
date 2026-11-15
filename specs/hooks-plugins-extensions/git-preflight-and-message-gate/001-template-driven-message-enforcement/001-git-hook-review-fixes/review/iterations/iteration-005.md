# Review Iteration 005 — D5 Correctness+Security (Adversarial Re-verification)

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security
BINDING: specFolder=specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes

- Dispatcher: /deep:review loop, iteration 5 of 5 (terminal under stopPolicy=max-iterations). Mode=review, target_agent=deep-review, run=5.
- Lineage: sessionId=dr-githooks-20261002T103712Z, parentSessionId=null, generation=1, lineageMode=new.
- Budget profile: adjudicate, raised ceiling (orchestrator target 20, hard max 30).
- Target revision: main checkout HEAD `03afeb4552bbfa8ebeb54dc296d19c9981e6d091` re-observed at iteration start; every citation below is a main-checkout absolute path. The worktree-075 copies were read only as diff context (the dispatch names them a different, modified version) and are never cited as target.
- Machine-wide premise re-observed 2026-10-02T11:24Z: `git config --global core.hooksPath` = `/Users/michelkerkmeester/.config/git/hooks`, and all seven hooks there (pre-commit, prepare-commit-msg, commit-msg, post-commit, post-merge, post-rewrite, pre-push) symlink into the main checkout's `.skilled/scripts/git-hooks/`.
- Agent definition loaded: `.skilled/agents/deep-review.md` read before review actions.
- Untrusted-content guard: no reviewed artifact carried directive-like text aimed at the reviewer; all content was treated as data.
- Swept directions not re-entered: shell injection via stamped trailers, contractDir path traversal, mass-deletion arithmetic, installer overwrite, spec-trailer traversal, secrets in logs, JS shell interpolation, CLI surface drift, `--status` reporting, native-hook runtime parity, prologue drift, dead mass-deletion surface, installer legacy-helper install.

## Dimension

D5 adversarial correctness+security: re-verify every active P0/P1 (R2-P0-001, R1-P1-001..005) against live main-tree code, attempt falsification of each, and hunt for missed defects in post-commit, post-merge, post-rewrite, commit-msg, the three `lib/*.sh` guards and `validate-message.mjs`. Outcome: all six active findings re-confirmed against live lines, none falsified, no severity changes; one new P2 (R5-P2-001). The active P0 remains → FAIL.

## Files Reviewed

13 of the 14 scope files re-read this iteration from the main checkout (absolute paths under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`):
- `.skilled/scripts/git-hooks/pre-commit` (16-104, 231-285, 479-636)
- `.skilled/scripts/git-hooks/prepare-commit-msg` (47-133, 135-197, 229-247, 288-337)
- `.skilled/scripts/git-hooks/commit-msg` (44-78)
- `.skilled/scripts/git-hooks/post-commit` (17-81)
- `.skilled/scripts/git-hooks/post-merge` (18-39)
- `.skilled/scripts/git-hooks/post-rewrite` (19-40)
- `.skilled/scripts/git-hooks/pre-push` (40-129, 136-220)
- `.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh` (18-80)
- `.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh` (23-81)
- `.skilled/scripts/git-hooks/lib/message-contract-gate.sh` (16-60)
- `.skilled/hooks/git/pre-commit` (1-85)
- `.skilled/skills/sk-git/scripts/validate-message.mjs` (111-210)
- `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` (238-272, 278-316)
- `.skilled/scripts/install-git-hooks.sh` — NOT re-read this iteration; it anchors no active P0/P1 and its active P2s are carried from iterations 3-4.

Context-only evidence: `diff -U1` of main vs worktree-075 over the hunt surface; one scratch-repository experiment for the prepare-commit-msg `$2` source; the global hooksPath symlink listing.

## Findings by Severity

### P0 Findings

1. **R2-P0-001 (carried; re-verified; not falsified) — Machine-wide hooks source and execute repository-controlled code from the repository being committed to** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-commit:30` (full site list below).
   - Live sites re-read at main: `pre-commit:22-33` selects `SOURCE_ROOT` from `$REPO_ROOT` (`.skilled`, fallback `.opencode`) and unconditionally sources `$SOURCE_ROOT/hooks/shared/hook-flags.sh` when readable; `hooks/git/pre-commit:16-27` the same without the `set +e` guard; `post-commit:23-35`, `post-merge:24-33`, `post-rewrite:25-34` source `$SOURCE_ROOT/scripts/git-hooks/lib/autostash-orphan-guard.sh` when the file exists; `pre-push:46-63` sources `$SOURCE_ROOT/scripts/git-hooks/lib/mass-deletion-guard.sh` and `pre-push:75-91` sources `$SOURCE_ROOT/skills/sk-git/scripts/worktree-naming.sh`. Repo-resolved executables follow the same root (`pre-commit:60,79,110,124,237,247,266,276,305-324,427,518,579`; `pre-push:319,329,364,372,444,454`).
   - Falsification attempts this iteration: (a) searched main for any ownership, signature or allowlist check on `SOURCE_ROOT` — none exists; the only trust check in the repository is an uncommitted `hook trust` block visible in the worktree-075 diff, absent from the target; (b) checked whether `_in_toolchain_repo` gates the source sites — it does not: `pre-commit:30` requires only readability and the post-* sites only file existence; (c) confirmed the attacker does not need the sentinel: the `.opencode` fallback is reached whenever the clone omits `.skilled/skills/system-spec-kit/SKILL.md`, and a clone can ship either tree; (d) re-observed the machine-wide symlinks, so a commit in any repository on this machine executes the target scripts.
   - Concrete failure scenario (unchanged and now fully live-verified): `git clone <hostile> && cd <hostile> && git commit --allow-empty -m 'chore: x'`; the hostile repo ships `.opencode/hooks/shared/hook-flags.sh` and `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh`; `post-commit:33-36` sources the latter and runs attacker shell as the operator. No sentinel is required.
   - Result: not falsified; remains P0 and remains the FAIL basis.
   - Claim adjudication (re-verification delta): type=security/trust-boundary; counterevidenceSought=`_in_toolchain_repo` gating and any guard added since iteration 2; alternativeExplanation=the per-repo toolchain model is intended, but nothing verifies the checkout is the toolchain's; finalSeverity=P0; confidence=high; downgradeTrigger=if hooks source only from the global install dir or verify SOURCE_ROOT against a user-owned allowlist → P1.

### P1 Findings

1. **R1-P1-001 (carried; re-verified; not falsified) — Subject line deleted when it matches a forbidden attribution key** — `prepare-commit-msg:189`, with matcher at 124-133 and key regex at 107.
   - Live: the drop loop at 183-197 starts `index=0`, and `line_is_forbidden_attribution` first tests `^(Co-Authored-By|Claude-Session):` with no position guard, so a subject line that is trailer-shaped and begins with a forbidden key is removed. With no other body lines, `REAL_COUNT` reaches 0, `REQUIRE_ID` is 1 (229-231), and the rewrite emits only `Commit-Id: <n>` (312-314).
   - Falsification attempt: looked for a subject-exemption index or a `REAL_END` guard that would preserve line 0 — none; the empty-after-drop path still mints an id, so the subject is replaced rather than recovered.
   - Scenario: `git commit -m 'Claude-Session: fix the parser'` loses its subject and then a subject-format error (or `message.empty`) blocks the commit that the author wrote legitimately.
   - Severity unchanged (P1). downgradeTrigger unchanged: if such subjects are impossible in this workflow → P2.

2. **R1-P1-002 (carried; re-verified empirically; not falsified) — Clean/continued cherry-picks keep the copied Commit-Id** — `prepare-commit-msg:83-88` (detection), 185-188 (drop).
   - Live: `CHERRY_PICK=1` only when `$SOURCE = "commit"`; the drop runs only under `CHERRY_PICK`. This iteration re-ran the scratch-repository experiment: a clean `git cherry-pick` invoked `prepare-commit-msg` three times with `source=[message]` in every invocation, so the detection branch at 83 never fires for a real cherry-pick and the copied `Commit-Id` is retained (`HAS_COMMIT_ID=1` → `REQUIRE_ID=0`, no re-mint).
   - Falsification attempt ruled out the remaining empirical uncertainty from iteration 1; the code path and the observed source agree.
   - Scenario unchanged: the picked message's `Commit-Id: 42` is kept; when the original is an ancestor of HEAD, `git log --all --not HEAD` (message-contract.mjs:658) cannot see it, the duplicate lands, and pre-push later blocks the push.
   - Severity unchanged (P1).

3. **R1-P1-003 (carried; re-verified; not falsified) — Comment stripping ignores `commit.cleanup`** — `message-contract.mjs:279-291`, consumed at `validate-message.mjs:136`.
   - Live: `stripCommitMessage` drops every `commentChar`-leading line unconditionally; main's `commitMode` (validate-message.mjs:128-137) reads only `core.commentChar` and passes no cleanup mode, while `revListMode` reads stored messages with `alreadyClean: true` (line 158). The worktree-075 diff adds a `commit.cleanup` read at this exact call site — corroborating the defect shape and confirming the fix is absent from the target.
   - Scenario unchanged: `git commit -m '#123 resolve the flaky test'` stores the `#` line as the subject, the gate strips it, and a valid commit is blocked with `message.empty`.
   - Severity unchanged (P1).

4. **R1-P1-004 (carried; re-verified; not falsified) — Comment-hygiene gate validates the working tree, not the staged blob** — `pre-commit:74-94` (checker runs on `$full_path` at :79); legacy copy `hooks/git/pre-commit:41-50`.
   - Live: names come from `git diff --cached --name-only --diff-filter=ACM` (pre-commit:94) but the checker receives the filesystem path (pre-commit:75,79); no `git show :<path>` or index-blob materialization exists anywhere in either copy or in any later gate.
   - Scenario unchanged: stage a violating edit, restore the worktree (`git show HEAD:<file> > <file>`), commit — the hook checks clean content and the index carries the violation. The inverse falsely blocks.
   - Severity unchanged (P1).

5. **R1-P1-005 (carried; re-verified; not falsified) — URL new-branch push re-checks published history** — `pre-push:107,202-208`.
   - Live: `REMOTE_NAME="${1:-origin}"`; git's documented pre-push contract sets both parameters to the URL when no named remote is used; for `is_new=1` the range is `"$local_sha --not --remotes=$REMOTE_NAME"`. `--remotes=<URL>` matches no remote-tracking ref, `--not` excludes nothing, and `validate-message.mjs:143-144` walks every commit reachable from the new tip. The companion `--exclude-ref "refs/remotes/$REMOTE_NAME/$branch_name"` (pre-push:208) likewise matches nothing for a URL.
   - Falsification attempt: checked whether any branch of `revListMode` re-derives a bounded range for URL pushes — none; the only inputs are the split range argv.
   - Scenario unchanged: `git push git@github.com:acme/repo.git feature-x` on top of a legacy-violating ancestor is blocked although it adds only new commits.
   - Severity unchanged (P1); downgradeTrigger unchanged: URL pushes explicitly outside policy → P2.

### P2 Findings

1. **R5-P2-001 (new) — The node-free "declares rules" probe diverges from the validator's own heading parser and resolution order; with node missing it can silently disable enforcement or block a repository the validator would pass** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/lib/message-contract-gate.sh:47` vs `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:40,246-254,265-266` (callers: `commit-msg:61-68`, `pre-push:120-129`).
   - Evidence: the helper decides "this repository declares rules" with `grep -qiE '^#{1,6} .*Enforced rules'` (gate:47), while the validator's heading regex is `/^#{1,6}\s+.*\bEnforced rules\b/i` (message-contract.mjs:40, used at :123-124). A tab after the hashes satisfies `\s+` but not the probe's literal space; only the validator requires the trailing word boundary. The probe also scans every candidate directory and returns on any hit (gate:43-48), while `resolveContractDir` pins to the first existing directory and `loadContract` then requires the template inside that one (message-contract.mjs:246-254, 265-266).
   - Scenario A (silent pass): a template whose heading is `##\tEnforced rules` is enforced by the validator on this machine; with `node` absent, `mcg_repo_declares_rules` returns false, `commit-msg:62-68` takes the "declares no rules" exit 0 instead of the promised block, and commits land unvalidated. Scenario B (false block): a `## Enforced ruleset` heading makes the probe say yes while the validator enforces nothing, so a node-less machine blocks every commit with an install message that cannot help.
   - Finding class: contract drift (probe vs parser). Scope proof: these two are the only rules-heading detectors in the target; the probe is used exactly on the node-unavailable branch. Recommendation: mirror the exact regex and resolution order, or call the validator when it exists.
   - Note: the directory-shadowing half (`empty .sk-git/` hiding `.skilled/.../assets` rules) is not live in the main checkout — `.sk-git/` does not exist there — so it is recorded here as a resolution-order risk, not a separate finding.

2. Carry-forward: the 15 prior P2 findings (R1-P2-006..008, R2-P2-002, R3-P2-001..005, R4-P2-001..006) remain active and were not re-raised. Of these, R2-P2-002 (regex backtracking, message-contract.mjs:31/375 etc.) and R4-P2-002 (attribution policy split, prepare-commit-msg:107 vs message-contract.mjs:308-316) were visible on the live lines re-read this iteration; the rest are carried from iterations 3-4.

## Traceability Checks

- spec_code (core): **pass — carried from iteration 3, not re-run.** No new spec drift found on the live lines read this iteration.
- checklist_evidence (core): **fail — carried from iteration 3, not re-run.** R3-P2-001, R3-P2-002 and R3-P2-005 remain active.
- skill_agent (overlay): **pass — carried.**
- agent_cross_runtime (overlay): **notApplicable — carried.** Native git hooks have no per-runtime adapters (`hooks/git/README.md:52`).
- feature_catalog_code (overlay): **partial — carried.** R3-P2-003 remains active.
- playbook_capability (overlay): **deferred — carried; not executed, never a pass.**

## Integration Evidence

- Global `core.hooksPath` listing and symlink resolution re-observed 2026-10-02T11:24Z — the machine-wide blast radius of R2-P0-001 is evidence, not assumption.
- Scratch repository (temp dir, no target write): a logging `prepare-commit-msg` hook recorded `source=[message]` on all three cherry-pick hook invocations — the empirical basis for R1-P1-002.
- Worktree-075 `diff -U1` over the hunt surface (context only): confirms the trusted-hook block, the `commit.cleanup` read and the command-scope `contractDir` fix exist only uncommitted in the worktree, not in the reviewed target.
- `commit-msg:44-57` and `pre-push:108-129` resolve helpers/validator beside the real symlinked hook (HOOK_DIR), not from the repo — the correct trust shape that R2-P0-001's remediation should extend.

## Edge Cases / Ambiguities

- R1-P1-002's empirical premise was remeasured this iteration (3/3 `source=[message]`), so the finding no longer rests on iteration 1's single observation.
- R5-P2-001 is formatting-contingent: it needs a tab-formatted heading (silent pass) or a heading-suffix variant (false block) plus a missing node. It is filed P2 on that basis, not as a live regression in the main checkout.
- `.sk-git/` does not exist in the main checkout, so the directory-shadowing scenario is config-contingent; recorded under R5-P2-001 rather than filed separately.
- `install-git-hooks.sh` was not re-read this iteration; its active P2s (R4-P2-003) are carried unverified here and were last verified against live lines in iteration 4.
- Iteration timestamp 2026-10-02T11:24:24Z was captured by `date -u`; durationMs is approximate.

## Confirmed-Clean Surfaces

- `commit-msg:44-57` and `pre-push:108-129`: helper and validator resolution follow the symlink chain beside the global hook and never load from the repository under validation.
- `mass-deletion-guard.sh:24-61`: threshold and count digit-sanitized; verdict fail-open; every substitution guarded (re-confirmed live).
- `autostash-orphan-guard.sh:21-47,50-79`: anchors are idempotent ref writes under `refs/autostash-rescue/<sha>`, sequencer entries checked before stash-list, all failure paths suppress with `|| true` (re-confirmed live).
- `validate-message.mjs:70,77` and `message-contract.mjs:217`: all child processes use `execFileSync` with argv arrays; no shell string is built from message or config content (swept direction re-confirmed, not re-entered).
- `post-rewrite:6-7`: the rewritten pairs git sends on stdin are deliberately unread and the sourced guard touches only `git stash list` and sequencer files — no data loss path.

## Ruled Out

- `validate-message.mjs` record splitting on `0x1e` (`revListMode:149-153`): a commit message containing the record separator cannot cause a violating commit to skip validation — a mis-keyed fragment misses the exact-SHA map and line 156 re-reads that commit individually.
- `post-rewrite` stdin non-consumption: verified clean (see Confirmed-Clean Surfaces).
- Empty `.sk-git/` shadowing committed assets rules: not live in the main checkout (no `.sk-git/` directory); folded into R5-P2-001 as a resolution-order note instead of a standalone finding.
- The four swept security/correctness directions were not re-entered (see sweep list above).

## Verdict

1 active P0 (R2-P0-001) plus 5 active P1 (R1-P1-001..005) → **FAIL** per the severity mapping. The adversarial pass re-confirmed all six live sites and falsified none; one new P2 (R5-P2-001) was filed. newFindingsRatio = 0.02 (weighted new 1 / accumulated 51; P0=10, P1=5, P2=1). Novelty justification: the single new finding is a probe-versus-parser contract drift not previously filed; no new P0/P1, no severity changes, and all six carried findings keep their prior severity with fresh live-line evidence.

## Next Dimension

None — iteration 5 of 5 under `stopPolicy=max-iterations`; all four dimensions covered. Terminal synthesis is the orchestrator's step. The active set for release-readiness is R2-P0-001 (FAIL basis), R1-P1-001..005, R5-P2-001 and the carried P2s.

Review verdict: FAIL
