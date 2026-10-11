# Iteration 7: The external-user lens, first half — setup, artifacts and recovery

## Focus

Part 3's first half: what a person who clones or forks this framework actually does to set it up, which generated artifacts they must regenerate and how they learn that, and how they recover from a half-applied state. Read from the front-door README's Quick Start, the doctor command routes, the git-hooks installer and the hook trust block, and the upgrade/rollback changelogs.

## Actions Taken

1. Read README sections 4 (Quick Start, Verify, Git Hooks, First Use, Adapting) and the FAQ, and the operations table around line 1500.
2. Read the runtime requirements against the package engines and lockfile floors.
3. Read the git-hooks trust block in `pre-commit` and the check hook's README to see what surfaces when a clone is untrusted.
4. Read the doctor route summaries and the v2.7.1.0/v2.7.2.0 changelog entries for update, rollback and refusal behavior.

## Findings

1. **The setup path is three package-manager commands plus one verification command, and the README states it plainly.** Clone, `npm --prefix .skilled/skills/system-spec-kit install`, then install and build the advisor runtime, then `node .skilled/bin/skill-advisor.cjs list-tools --format json` to verify; the same section documents git hooks, first use (`/speckit:complete`) and the adaptation path for a fork. [SOURCE: README.md:154] [SOURCE: README.md:179] [SOURCE: README.md:189] [SOURCE: README.md:228] — **CONFIRMED** (read). **P2**. **Smallest fix**: none — the path is already minimal and verified by one command.

2. **The stated Node floor is below what a dependency requires, and the two package files disagree with the README.** The README says "Node.js 20.11+ (22.12+ for the spec-kit runtime CLI)". `.skilled/skills/system-spec-kit/package.json` declares `"node": ">=20.11.0"`, while the lockfile entries that npm actually enforces declare `"node": "^20.19.0 || >=22.12.0"`. A user on Node 20.11 through 20.18 satisfies both the README's parenthetical-free reading and the package engines, then installs dependencies that declare them unsupported (npm warns by default and continues). [SOURCE: README.md:160] [SOURCE: .skilled/skills/system-spec-kit/package.json:11] [SOURCE: .skilled/package-lock.json:200] — **CONFIRMED** (read the three declarations; the runtime consequence on 20.x is **INFERRED** since this machine runs Node 26). **P2**: the first command in an adopter's session can fail or warn confusingly. **Smallest fix**: change both `engines.node` values and the README line to the dependency's own floor, `^20.19.0 || >=22.12.0` — three text edits, no code.

3. **The git-hooks trust gate is silent by design, so a second clone gets no gate and no warning.** The hooks are installed once machine-wide; in a repository that neither shares a git common dir with the checkout that installed them nor sets `skilled.trustRepoHooks true`, the hook rewrites `SOURCE_ROOT` to a nonexistent `.skilled-untrusted` path and runs nothing. The script comments state the intent ("Other repositories run none of these gates, so they read no setting and print nothing") and the README documents the trust command in one paragraph, but nothing surfaces at the moment a toolchain checkout is detected and skipped. An adopter with two clones on one machine, or a teammate's clone, commits with no checks and no sign that they are off. [SOURCE: .skilled/scripts/git-hooks/pre-commit:44] [SOURCE: .skilled/scripts/git-hooks/pre-commit:70] [SOURCE: README.md:197] [SOURCE: .skilled/scripts/install-git-hooks.sh:188] — **CONFIRMED** (read the trust block and its comments). **P1 by external-user impact**: silent enforcement loss on a toolchain repository. **Smallest fix**: in the untrusted branch, if the repository carries its own `.skilled/scripts/install-git-hooks.sh`, print one stderr line naming `git config --local skilled.trustRepoHooks true`; unrelated repositories keep the current silence — a few lines in one hook file.

4. **Generated-artifact recovery is unevenly discoverable, and one family is absent from the front-door docs.** `/doctor:speckit` names the trigger-index regeneration command when the index is stale, `/doctor:runtime-mirrors` names the repair command for drifted mirrors, and the pre-commit gate auto-re-mints and stages the compiled-route manifests so a normal commit cannot leave them stale. But the README never names the compiled-route family at all: an adopter who edits a hub's `SKILL.md` or routers meets it first through a gate message or a CI failure. That message does carry the recovery (`Re-mint: sk-code`), so the gap is documentation depth, not a dead end. [SOURCE: README.md:1254] [SOURCE: README.md:1269] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/005-router-sync-guard/tasks.md:71] — **CONFIRMED** (read; the "absent from README" claim is a repo-wide grep for `compiled` in the README that returns no manifest/regeneration content). **P2**. **Smallest fix**: one row beside the trigger-index line in the operations table naming the compiled-route guard and its re-mint command; no new tool.

5. **Half-applied recovery is designed and documented for the operations that can half-apply.** `/doctor:update` exposes `check`, `align`, `apply`, `rollback`, `record-base` and `compat`, the upgrade write keeps before-images of dirty files in the git directory so an apply can be undone, a stale manifest stops the apply instead of being overwritten, and every refusal is recorded per packet under `refusals` in `upgrade-baseline.json`. The archive/restore round trip is test-covered. [SOURCE: README.md:1283] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:58] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:184] — **CONFIRMED** (read). **P2**. **Smallest fix**: none for this half; the remaining question — whether a user can find the rollback route after a failed apply — is the second half's error-message work.

## Ruled Out

- **A guided installer that runs the three commands and the trust step for the user.** Rejected under `.skilled/repo-rules/prevent-overengineering.md`: the README's commands are idempotent and already copy-pasteable, and a wrapper would duplicate npm behavior and add a failure surface with no caller today. The trust warning (finding 3) is the one missing surface and lives where it runs.

## Dead Ends

- The runtime consequence of Node 20.11-20.18 cannot be observed on this machine (Node 26); the mismatch is confirmed at the declaration level and marked inferred past it.

## Edge Cases

- Ambiguous input: "setup and install steps" could mean the framework's own checkout or an adopter's fork; the fork is the heavier path and the one the README addresses under "Adapting to Your Stack", so both were read.
- Contradictory evidence: the README's "(22.12+ for the spec-kit runtime CLI)" note partly anticipates the dependency floor while the package engines do not; recorded as a three-way disagreement rather than a contradiction.
- Missing dependencies: none.
- Partial success: the setup, artifacts and recovery halves are confirmed; the Node behavior past the declaration is inferred. `Status: complete`.

## Questions Answered

- Q9 (first half): What breaks or confuses an external user who clones or installs this framework: setup, generated artifacts, version numbering, hook timing, routing surprises, error messages and recovery from a half-applied state? — setup, generated artifacts and half-applied recovery answered; version numbering, hook timing, routing surprises and error messages are the second half.

## Questions Remaining

- Q9 (second half), Q10.

## Sources Consulted

- README.md:154,160,179,189,197,228,1254,1269,1283,1500,1580
- .skilled/skills/system-spec-kit/package.json:11
- .skilled/package-lock.json:200
- .skilled/scripts/git-hooks/pre-commit:28-75
- .skilled/scripts/install-git-hooks.sh:188
- .skilled/hooks/git-hooks-check/README.md:20
- .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:58,184
- specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/005-router-sync-guard/tasks.md:71

## Assessment

- New information ratio: 0.82
- Questions addressed: Q9 (first half)
- Questions answered: none fully; the sub-questions are recorded

## Reflection

- What worked and why: reading the trust block's comments before the README showed the silence is intentional, which moved the finding from "bug" to "missing surface at the moment of enforcement loss".
- What did not work and why: the Node mismatch cannot be exercised across versions here; the declaration-level evidence is still decisive for the documentation fix.
- What I would do differently: for external-user claims, start at the front door and only then open internals — the README told me which paths the user actually walks.

## Recommended Next Focus

Iteration 8: the external-user lens, second half — version numbering and changelog collisions from a fork's perspective, hook timing on slower hosts (the measured-latency question), routing surprises a user meets (the surface order and advisor outcomes already traced), and error messages that do not say what to do, including one observed live during this run: the pi dispatch denial line "the command does not prove one direct executor".
