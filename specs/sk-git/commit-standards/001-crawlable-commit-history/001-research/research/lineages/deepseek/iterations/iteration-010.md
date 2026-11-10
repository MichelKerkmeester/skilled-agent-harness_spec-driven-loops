---
title: "Iteration 10: Enforcement, tooling and the phase plan"
trigger_phrases: []
---
# Iteration 10: Enforcement, tooling and the phase plan

## Focus

What `commit-msg`, a new `prepare-commit-msg` that stamps the identifier, `git-rule-checks.mjs`, the template asset, and the skill docs must change — and how each is tested. Then sort every finding from angles 1-9 into [implementable today] versus [needs a contract decision], rank them, and propose what phases 002-006 of this packet should each decide or build, in order, with the gate each ends on.

## What was read

- `.opencode/scripts/git-hooks/commit-msg:117,127-129,153-155` — the trailer whitelist and body gate that new keys touch.
- `.opencode/scripts/install-git-hooks.sh:69-107` — installs **every** hook-named file as a symlink, including into the machine-wide global `core.hooksPath` (iteration 1 finding 9).
- `.opencode/scripts/git-hooks/tests/` — the existing test inventory: `pre-commit.test.sh`, `pre-push.test.sh`, `mass-deletion-guard.test.sh`, `install-git-hooks-worktree-harness.sh`; no `commit-msg` test (iteration 1 finding 10).
- `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/` — four behavior playbooks, including `co-authored-by-footer.md` (the existing pattern for testing trailer behavior).
- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs:91-349` — 17 command-safety checks, none message-related.
- `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` (referenced by `worktree-naming.sh:42`) — the allocator test precedent.

## What was measured

No new commands this iteration; this is the synthesis-of-enforcement pass over measured evidence from iterations 1-9. Key enforcement-relevant measurements: the trailer whitelist is closed (iteration 1), `%(trailers:key=Commit-Id)` is already parseable (iteration 3), the allocator precedent is lock+high-water (iterations 4), all candidate messages pass the hook in trailer position (iteration 4), and one machine-wide hooks path is symlinked to the main clone's hook sources (iteration 1).

## Findings

1. **`commit-msg` needs one narrow, testable change: extend `TRAILER_RE` with the new keys.** Today `Spec:`/`Phase:`/`Commit-Id:` count as explanatory body (hook:117,127-129), which makes a machine block satisfy the ≥4-path body gate and muddies "explanatory". Adding the keys is a one-line regex change with zero effect on subjects, plus fixture tests. Whether the hook additionally *validates* `Commit-Id` shape is a separate, optional rule. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:117,127-129] [SOURCE: iteration 4 hook runs]
2. **A new `prepare-commit-msg` must be repo-identity-aware, because the install is machine-wide.** `install-git-hooks.sh` symlinks every hook-named file into the global hooks directory; a naive stamper would run in every repository on this machine. The stamper must detect the host repo (for example the `.opencode/skills/sk-git` tree or the remote URL) and no-op elsewhere. [SOURCE: file:.opencode/scripts/install-git-hooks.sh:69-107] [SOURCE: iteration 1 finding 9]
3. **The stamper's state machine is bounded by git's own `$2` source argument.** `prepare-commit-msg <file> <source> [<sha>]`: stamp only `message`/`template` sources; preserve an existing `Commit-Id:` verbatim on `commit` (amend) and on rebase/cherry-pick replays; skip `merge` unless merges are policy-stamped; never touch a message that already carries an id (idempotence is the whole game). [SOURCE: local knowledge of the hook contract] [SOURCE: iteration 4 survival table]
4. **Allocation can reuse `worktree-naming.sh` verbatim in shape.** Lock directory + per-namespace high-water file in the common Git dir, `next = max + 1`, no back-fill, ceiling. The retrofit phase seeds the per-packet counters; forward allocation reads the counter file in O(1) and never scans 9k messages under lock. [SOURCE: file:.opencode/skills/sk-git/scripts/worktree-naming.sh:8-32,209-247,250-309] [SOURCE: iteration 4 finding 4]
5. **`git-rule-checks.mjs` needs no message-format check; at most one advisory.** Its 17 checks are command-shape safety (force-push-without-lease already exists). A new advisory could cover "resume a rewrite window without checking the backup" or "commit during a frozen window", but both are policy-gated, not silently dangerous; recommend deferring until phase 005 defines the window. [SOURCE: file:.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs:91-349]
6. **Testing gaps are the real blocker: none of the new behavior has a test harness today.** `commit-msg` regexes are untested; there is no `prepare-commit-msg`; the allocator's commit-side variant would be new. The existing fixtures and harness patterns (pre-commit/pre-push tests; `worktree-naming.test.sh`) show the house style; phase 003 should ship `commit-msg.test.sh`, `prepare-commit-msg.test.sh`, and `commit-id-naming.test.sh` with the nine message fixtures already constructed in iteration 4. [SOURCE: command:tests inventory] [SOURCE: iteration 4 candidates]
7. **Docs must change in exactly five places, and they are all cheap:** SKILL.md §6 body contract (trailer block + placement law), the template asset (`assets/commit-message-template.md`), `references/commit-workflows.md` Step 5, `references/quick-reference.md` (the three canonical queries), and the `manual-testing-playbook/commit-formation/` suite (one playbook for a message with the full trailer block). [SOURCE: iterations 1,5 read set]
8. **Enforcement level is the one genuinely hard decision.** Blocking `Commit-Id` on every commit forces every contributor/session to run the stamper; warning-only keeps the hook backward-compatible while the retrofit lands; requiring an id only when a `Spec:` key is present is a middle option that binds packet work without breaking unrelated commits. [SOURCE: iteration 1 trailer/body findings]
9. **Squash and cherry-pick behavior must be encoded, not assumed.** With 1,002 duplicated-subject commits in history, copy duplication is the default; the stamper can strip `Commit-Id:` when `$2` indicates `commit` with multiple `squash!`/`fixup!` sources (the squashed message arrives through `commit`), but cherry-pick replays arrive as an ordinary `message` with the id already present — detectable only by policy (strip-on-copy hook) or accepted duplication. [SOURCE: iteration 4 findings 5-6]
10. **Phase ordering is determined by the dependency graph measured across angles:** contract → tooling → mapping → rewrite → convergence. The rewrite (005) cannot start before the map (004) freezes; the map cannot be built before the id shape (002) is fixed; forward stamping (003) can run in parallel with mapping because it depends only on 002. [SOURCE: iterations 4,7,8,9]

### Consolidated ranking — every angle's output sorted by class

| # | Finding / decision | Class | Angle |
|---|---|---|---|
| 1 | Key set + placement law (final trailer block; `Spec`/`Phase`/`Commit-Id`/`Refs` roles) | needs a contract decision | 5 |
| 2 | Identifier shape + fallback namespace + which commits get ids | needs a contract decision | 4,7 |
| 3 | Trailer whitelist extension in `commit-msg` (one line + tests) | implementable today | 1,10 |
| 4 | `prepare-commit-msg` stamper + allocator, repo-identity-aware | needs a contract decision (scope) then implementable | 4,10 |
| 5 | Mapping cascade + tie-breaks + frozen map artifact | implementable today | 7 |
| 6 | Remap script + dry-run verification + residue scan | implementable today | 9 |
| 7 | Rewrite mechanics: mirror + backup + `--commit-callback` + invariants | implementable today (after 1-2) | 8 |
| 8 | Cherry-pick/squash duplication policy | needs a contract decision | 4,10 |
| 9 | Message-internal citation second pass (460 messages) | needs a contract decision | 9 |
| 10 | Push set + window freeze + live-sync handling + rollback | needs a contract decision (authorization) then implementable | 9 |
| 11 | Docs and template updates + query documentation | implementable today | 5,10 |
| 12 | Hook tests, stamper tests, allocator tests, remap tests | implementable today | 1,10 |
| 13 | Signature-loss acceptance (11 signed commits, 98 annotated tags) | needs a contract decision | 8 |
| 14 | `git-rule-checks.mjs` advisory for the rewrite window | needs a contract decision (defer) | 10 |
| 15 | Trigger-index commit ingestion | needs a contract decision (recommend not building) | 3 |
| 16 | Multi-valued `Spec:` for multi-packet commits | needs a contract decision | 7 |

### Proposed phase plan 002-006

| Phase | Decides / builds | Ends on gate |
|---|---|---|
| **002 — Contract freeze** | Decide the key set, placement law, id shape, fallback namespace, cherry-pick policy, enforcement level; write the decision record; update SKILL.md/template/quick-reference wording (no code) | Operator approves the frozen contract; doc lint passes; no hook behavior changed yet |
| **003 — Forward tooling** | Extend `TRAILER_RE`; add `prepare-commit-msg` stamper + `commit-id-naming.sh` allocator (repo-identity-aware); ship `commit-msg.test.sh`, `prepare-commit-msg.test.sh`, `commit-id-naming.test.sh`; validate against the nine fixtures + legacy-pass regression (existing valid commits still pass) | Full hook suite green on fixtures and on a sample of real history messages; install procedure reviewed for machine-wide effect |
| **004 — Mapping** | Build the frozen SHA's old→packet→id plan with the cascade; adjudicate 41 ties + disputed dominants; publish coverage report (~66% packet / 34% misc); hash and freeze the map | Reviewer signs the map (100% commits assigned, 0 unresolved); freeze manifest recorded |
| **005 — Rewrite execution** | Rehearse on a throwaway mirror; run the real rewrite with `--commit-callback`; verify invariants (trees, authors, counts, id presence); remap citations (+ optional second message pass); rewrite tags; operator go/no-go; force-push `main` + `skilled/v4.0.0.0` + tags; rollback armed | Invariant checklist passes on the mirror; CI green after push; citation residue 0; operator authorizes/confirms each push |
| **006 — Convergence** | Reset live branch; rebase/archive worktrees and non-rewritten branches; handle dependabot; run query acceptance (packet/phase/id from a fresh clone and GitHub); update docs with migration notes; close backup retention | Acceptance evidence recorded; fresh clone resolves all three query axes; backup retention decision closed |

## Recommendations

1. **[needs a contract decision]** Freeze phase 002 first; nothing downstream is safe to build until the key set, id shape, fallback, and enforcement level are fixed. This is the single blocking decision.
2. **[implementable today]** Write the test harnesses before touching the hook (iteration 4's nine fixture messages are ready; the house style exists).
3. **[needs a contract decision]** Choose the enforcement level deliberately: recommended sequence is warn-only at 003, blocking scoped to commits carrying `Spec:` after 005 lands, full enforcement only after the retrofit is published.
4. **[implementable today]** Build the mapping generator and remap script as offline tools in phase 004; they have no runtime risk and their outputs are reviewable artifacts.
5. **[needs a contract decision]** Keep the trigger-index question closed unless the operator wants a new ingestion pipeline; commits cannot enter the keyed lane as it stands.
6. **[implementable today]** Treat the backup, the freeze window, and the rollback sentence as part of phase 005's definition of done, not as emergency measures.

## What this iteration could not settle

- The operator's enforcement preference (warn vs block vs scoped-block) — all three are viable; the phase plan is stable under any of them.
- Whether the stamper is installed machine-wide (as the current installer would do) or scoped to this repository via a repo-local hooks path — an install decision for phase 003.
- Final wording of the decision record (phase 002 deliverable).
