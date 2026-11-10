# Review Iteration 002 — D2 Security

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=security
BINDING: specFolder=specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes

- Dispatcher: /deep:review loop, iteration 2 of 5. Mode=review, target_agent=deep-review, run=2.
- Lineage: sessionId=dr-githooks-20261002T103712Z, parentSessionId=null, generation=1, lineageMode=new.
- Budget profile: verify (dispatch raised the ceiling: target 20, hard max 30).
- Machine-wide premise observed: `git config --global core.hooksPath` = `/Users/michelkerkmeester/.config/git/hooks`, and every entry there symlinks into the main checkout's `.skilled/scripts/git-hooks/` (checked 2026-10-02); target HEAD is `03afeb4552`.
- Untrusted-content guard: no reviewed artifact carried directive-like text aimed at the reviewer; all content was treated as data.
- The worktree-075 copies were not read as target; every finding below is proven from the absolute main-checkout paths.

## Dimension

D2 Security: trust boundaries, input handling, secrets exposure, exploit paths. Re-confirmed D1's deferred P0-class candidate as **R2-P0-001 (P0)** and raised one new **R2-P2-002 (P2)**. The four swept directions from iteration 1 were not re-entered.

## Files Reviewed

14/14 declared scope files, fully read from the main checkout (absolute paths under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/`): pre-commit, prepare-commit-msg, commit-msg, post-commit, post-merge, post-rewrite, pre-push, lib/autostash-orphan-guard.sh, lib/mass-deletion-guard.sh, lib/message-contract-gate.sh, install-git-hooks.sh, hooks/git/pre-commit, validate-message.mjs, lib/message-contract.mjs.

## Findings by Severity

### P0 Findings

1. **R2-P0-001 — Machine-wide hooks source and execute repository-controlled code from the repository being committed to** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-commit:30` (full site list below).
   - Evidence:
     - Source-root selection trusts repository content: `SOURCE_ROOT="$REPO_ROOT/.skilled"` falling back to `$REPO_ROOT/.opencode` whenever `.skilled/skills/system-spec-kit/SKILL.md` is absent (pre-commit:22-23; identical blocks post-commit:23-27, post-merge:24-28, post-rewrite:25-29, pre-push:46-50, hooks/git/pre-commit:16-20).
     - Unconditional sourcing from that root, gated only on the file existing or being readable:
       - pre-commit:30-33 `. "$SOURCE_ROOT/hooks/shared/hook-flags.sh"` — runs on every `git commit`.
       - hooks/git/pre-commit:24-27 the same source, without the `set +e` guard.
       - post-commit:33-36, post-merge:31-34, post-rewrite:32-35 `. "$SOURCE_ROOT/scripts/git-hooks/lib/autostash-orphan-guard.sh"` — runs on every `git commit`, `git merge`, `git rebase`.
       - pre-push:58-64 `. "$SOURCE_ROOT/scripts/git-hooks/lib/mass-deletion-guard.sh"` and pre-push:75-91 `source "$SOURCE_ROOT/skills/sk-git/scripts/worktree-naming.sh"` — run on every `git push`.
     - Repo-controlled executables run during normal operations: pre-commit:79 (`"$COMMENT_CHECKER"`), :124 (`node "$MIRROR_CHECKER"`), :247 (`bash "$CARD_GUARD"`), :276 (`bash "$MUTCLASS_GUARD"`), :324-342 and :427 (`node` on `$ROUTE_GUARD`/`$ROUTE_LAYOUT`/`$ROUTE_MINT`), :579 (`node "$SPEC_TOOL"`); pre-push:329 (`node "$SKILL_GATE"`), :372 (`node "$ROUTE_GUARD"`), :454 (`node "$TRACK_SWEEP"`); post-commit:71-73 (`bash "$_as_sync"`, env-gated).
     - Related write path in the same trust model: pre-commit:438 `cp "$ROUTE_RUNTIME_FILE" "$ROUTE_AUTHORED_FILE"` follows a repo-committed symlink at the authored path, an arbitrary-file overwrite reachable from the same staged-input trigger.
   - Concrete failure scenario: a hostile repo ships `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh` (arbitrary shell) and no `.skilled` sentinel. `git clone <hostile> && cd <hostile> && git commit --allow-empty -m 'chore: x'` makes post-commit:33-36 source it; the attacker's shell runs as the user. No sentinel is needed because SOURCE_ROOT falls back to the clone's own `.opencode`. The same clone can ship `.opencode/hooks/shared/hook-flags.sh` (pre-commit:30-33) and `.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh` (pre-push:58-64). A repo that does ship `.skilled/skills/system-spec-kit/SKILL.md` selects its own `.skilled` tree instead; the sentinel is a file the attacker controls.
   - Finding class: class-of-bug (trust boundary / code execution). Scope proof: every source/exec site among the 14 scope files resolves through the repo-selected SOURCE_ROOT; the one resolver that does not is HOOK_DIR beside the real global hook (commit-msg:44-49, pre-push:108-113), which is the correct shape.
   - Affected surface hints: ["machine-wide core.hooksPath","SOURCE_ROOT selection","hook-flags.sh","autostash-orphan-guard.sh","mass-deletion-guard.sh","worktree-naming.sh","comment-hygiene checker","route/spec re-mint node execution","remote-push allowlist function"]
   - Claim adjudication: type=security/trust-boundary; claim=the machine-wide hooks execute shell and JS resolved from the repository being committed to, so cloning and running ordinary git commands in a hostile repo executes attacker code with the user's privileges; evidenceRefs=[pre-commit:22-23,30-33,79,124,247,276,324-342,427,438,579; hooks/git/pre-commit:16-20,24-27; post-commit:23-27,33-36,71-73; post-merge:24-28,31-34; post-rewrite:25-29,32-35; pre-push:46-50,58-64,75-91,329,372,454; global core.hooksPath listing observed 2026-10-02]; counterevidenceSought=the `_in_toolchain_repo` sentinel and its warnings — the sentinel only gates warning/block paths and is itself repo content; the autostash and hook-flags source sites do not require it; no signature, allowlist, ownership check or confirmation exists in any scope file; git itself does not execute repo-local code when hooksPath is global; alternativeExplanation=per-repo toolchain code is intended for the toolchain checkout — but nothing verifies the checkout is the toolchain's, and the no-sentinel `.opencode` fallback widens it to any clone; finalSeverity=P0; confidence=high; downgradeTrigger=if SOURCE_ROOT is verified against a user-owned allowlist outside the repo (or hooks source only from the global install dir), downgrade to P1.

### P1 Findings

None new. The five D1 P1 findings remain active and were not re-raised: R1-P1-001 (prepare-commit-msg:189), R1-P1-002 (prepare-commit-msg:83), R1-P1-003 (message-contract.mjs:279), R1-P1-004 (pre-commit:79), R1-P1-005 (pre-push:203).

### P2 Findings

2. **R2-P2-002 — Contract-supplied regexes run without a timeout; a hostile template can hang the validator** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:31` (cap at :362; pattern call sites :375, :401, :415, :421, :428, :443, :579).
   - Evidence: the module states "JavaScript regexes have no timeout. The input is capped instead" (:29-31) and truncates to `MAX_INPUT_CHARS = 200_000` (:31, :362), but exponential backtracking is not bounded by input length. Contract patterns come from the committed-to repository: `resolveContractDir` accepts `.sk-git/`, `.skilled/skills/sk-git/assets` and `.opencode/skills/sk-git/assets` (:238-255), and the compiled patterns run at :375 (passthroughSubjects), :401 (scopePattern), :415 (summaryStart), :421 (forbidTrailingPattern), :428 (warnPatterns), :443 (breakingFooterPattern), :579 (forbiddenPatterns).
   - Scenario: a hostile repo ships `.sk-git/commit-message-template.md` whose rules block sets `"passthroughSubjects": ["(a+)+$"]`; `git commit -m "chore: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"` makes the commit-msg hook's node process backtrack exponentially and never return — a local DoS requiring Ctrl-C or `--no-verify`. About 30 subject characters suffice; the 200K cap is irrelevant.
   - Finding class: instance-only. Scope proof: all contract-regex compilation in the target goes through these call sites; no worker or timeout guard exists. Affected surface hints: ["message-contract.mjs regex call sites","commit-msg hook","pre-push hook","repo-supplied contract templates"].
   - Impact: local denial of service in the same untrusted-clone model as R2-P0-001; no data loss; user-recoverable. Recommendation: bound regex execution (worker with timeout, or reject nested quantifiers), not just input length.

## Traceability Checks

- spec_code (core): pending — D3 owns full spec.md alignment; this iteration did not re-run it.
- checklist_evidence (core): deferred to D3.
- Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): deferred to D3.

## Edge Cases / Ambiguities

- Sentinel asymmetry: with `.skilled/skills/system-spec-kit/SKILL.md` present (as in the main checkout), SOURCE_ROOT is `.skilled`; without it, the fallback is the clone's own `.opencode`. Both are repository content, so the P0 does not depend on which tree an attacker ships — only on one of them existing.
- Trusted resolver boundary: commit-msg:44-49 and pre-push:108-113 resolve the real script behind the symlink chain and load helpers/validators from the global install directory; that path is not repo-controlled and is the model the P0 recommends extending.
- R2-P2-002 severity: the pattern source is repo-controlled in the same clone scenario as the P0; incremental impact over RCE is a hang, so it stays P2.
- The worktree-075 fix set was not read as target this iteration; all cited lines are main-target lines at 03afeb4552.
- Iteration timestamp is approximate (run start 10:37:12Z); no clock call was within budget.

## Confirmed-Clean Surfaces

- commit-msg:44-57 and pre-push:108-129 — helper/validator resolution beside the real global hook, not the repo.
- validate-message.mjs:70,77 and message-contract.mjs:217 — every child process is `execFileSync` with an argv array; no shell string is built from message or config content.
- message-contract.mjs:239-245 — `skgit.contractDir` resolution stays read-only and existence-checked (re-confirmed; the swept traversal direction was not re-entered).
- install-git-hooks.sh:83-94 — ownership check scopes replacement to this repo's hook source dirs (swept direction re-confirmed clean).
- mass-deletion-guard.sh:24-61 — digit-sanitized counts and fail-open verdict (swept direction re-confirmed clean).

## Ruled Out

- Spec-trailer path traversal (distinct from the swept `skgit.contractDir` path): `path.posix.join` then `fs.existsSync` only, no read/write sink (message-contract.mjs:485-488).
- Secrets exposure through hook logs: autostash and mass-deletion logs carry SHAs, timestamps and source labels only (autostash-orphan-guard.sh:39-46; mass-deletion-guard.sh:77-80).
- Shell interpolation in the Node validator layer: `execFileSync` argv arrays only (validate-message.mjs:70,77; message-contract.mjs:217).

## Verdict

1 active P0 (R2-P0-001) → FAIL, per the severity mapping. The D1 P1 findings remain active; the new P2 does not change the verdict. newFindingsRatio=0.50 (P0 floor: weighted new 11 vs accumulated 39 ≈ 0.28, raised by the new-P0 rule). Novelty justification: one P0 re-confirmed from the deferred D1 candidate SL-009 (never previously a finding id) plus one new P2; no new P1.

## Next Dimension

D3 Traceability — lead with spec_code and checklist_evidence, then the overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability).

Review verdict: FAIL
