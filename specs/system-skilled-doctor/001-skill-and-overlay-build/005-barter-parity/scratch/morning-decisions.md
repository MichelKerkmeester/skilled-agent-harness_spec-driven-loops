# Morning Decisions

Decisions taken overnight without the operator, and questions left for them. Each row says what was decided, why, and how to undo it.

## Decided overnight

1. **Research executor moved from dsh to pi.** dsh's LLM Gateway route returned `402 Dev Plan credit limit reached` (renews 2026-11-10). The 5 iterations run on pi `opencode-go/deepseek-v4.1-flash` at `--thinking max`, the fallback the operator named. That route serves the undated OpenCode Go build, not the `-1017` release. Failed attempt kept in `research_archive/dsh-max-devpass-402/`.
2. **Worktree not provisioned.** `worktree-naming.sh create … --no-provision`, then main's 28 git-ignored `node_modules` and `dist` folders linked in (same commit, identical code), because provisioning runs `npm ci`, which AGENTS.md §3 holds for a yes. Undo: delete the links listed in the session scratchpad `linked.txt`. They must be removed before any commit.
2a. **Installs approved (operator, 2026-11-07).** Once the research run finishes, the linked folders are replaced by a real `worktree-naming.sh provision`. Not before, because the running lineage loads its dependencies through those links.
2b. **Commit and push approved for Skilled (operator, 2026-11-07), following sk-git.** The branch `worktrees/324-overlay-repin-barter-parity` is not on sk-git's remote allowlist (`validate-remote-allowlist` prints `not-allowlisted`), and the operator's explicit instruction is the go-ahead AGENTS.md §5 requires. Linked `node_modules`/`dist` are removed before the first commit.
2c. **Barter is edited but not committed or pushed.** `barter/ai-speckit` is on `main` of `Barter-BV/ai-speckit`, with the whole `coder/ → skilled/` migration uncommitted and not made in this session. A commit there would sweep that migration into one commit on a company repo's main. See question 1.
3. **dsh OpenCode Go route verified live.** One headless probe on 2026-11-07 exited 0 with `final.reason.kind: completed` against `https://opencode.ai/zen/go/v1`. The cli-deepseek-harness docs still call this route unverified; fixing them is outside this packet.

4. **Barter adopted the upstream engine (applied, uncommitted).** Added `skilled/.skilled-overlays.json` (`{"overlayDir":"barter-overlays"}`), `protectedPaths` on `repo-frontend` (`assets/tokens.css`, `references/barter-design-tokens.md`) and a `repin` block (seven runtime folders including `.dsh`, `exclude: [".opencode/scripts"]`). Result: upstream `overlay-engine.cjs status --root barter/ai-speckit/skilled` went from exit 2 to exit 0, `checked=132 ok=132`, `RESULT: PASSED`; Barter's `replay.cjs --check` still 132/132 and `sync.cjs --status` 468 in-sync. Undo: restore `overlay-manifest.json` from the session scratchpad `barter-backup/` (sha256 prefix `e9c387e148e4af6c`) and delete `.skilled-overlays.json`.
5. **Held for the operator, on a fresh Opus medium second opinion:** the `fork-drifted` state and `outsideCertificate` support (a large change touching every state path), the four regenerate/verify pairs in Barter's manifest (Barter's fork runs them too, so they change Barter's own apply and pre-commit) and retiring Barter's fork. See questions 2–4.

## Questions for the operator

1. **Barter commit.** Should the Barter overlay changes go into a commit of their own after you commit the `coder/ → skilled/` migration, or ride along with it? Until you say, they stay uncommitted in `barter/ai-speckit/skilled/`, with backups in the session scratchpad.

2. **Fork parity (P6/P7).** Build `fork-drifted` and `outsideCertificate` into the upstream engine, so Barter can drop `sync.cjs`/`replay.cjs`? Recommended: yes, as its own phase, reviewed by you. Barter loses nothing by waiting: its fork passes today.
3. **Regenerate pairs in Barter's manifest (M7).** Add dsh skill links, runtime mirrors, trigger-index freshness and advisor-graph checks (`skill-graph-freshness.cjs --strict`, never without `--strict`)? Recommended: yes, after you decide question 1, because they change Barter's own pre-commit.
4. **Retire Barter's fork (M8).** Point `overlay-sync` at the engine guard and delete `sync.cjs`/`replay.cjs`? Recommended: only after 2, and after confirming nothing uses `replay.cjs --apply`.

5. **Spec-kit defect, not fixed here.** `upgrade-level.sh` inserts the Level 2 sections directly above the `## N. OPEN QUESTIONS` heading (`:949`, `:960`), so they land inside the `<!-- ANCHOR:questions -->` line that sits above it, and strict validation then fails `ANCHORS_VALID` on every Level 1 to Level 2 upgrade. The fix: when the line above the heading is `<!-- ANCHOR:questions -->`, insert above that line. Fixed by hand in this packet's `spec.md`. Want it fixed in `upgrade-level.sh` as its own change?

6. **sk-git defect, not fixed here: a provisioned worktree cannot commit.** `worktree-naming.sh provision` links the private `local-*` commands into a new worktree as absolute links into the main checkout. The pre-commit mirror gate then blocks every commit. `sync-prompts-dsh.cjs` walks with `entry.isFile()`, which skips a link, so it calls the tracked `.dsh/prompts/local-skilled-alignment.md` EXTRA. The runtime-mirror sync wants relative links. The Codex sync refuses to write through a link. Worked around in this worktree only: the private command became a copy, and the gate's own generators rewrote the mirrors. All in git-ignored paths, identical to main's bytes. The fix belongs in provisioning: link the private commands the way main holds them, or make the DSH walk follow links. Want it as its own change?

7. **Staged re-pin of Barter onto `c29f26ded8` (read-only, live tree untouched).** Exit 0, `checked=132 ok=132 miss=0`, `RESULT: STAGED`. It found 8 overlays that now equal upstream, which can be dropped from the manifest at the real re-pin, and listed `README.md` as an upstream change it does not copy, to carry over by hand if Barter wants it. Want the 8 entries dropped as part of question 1's commit?

8. **OpenCode workers can write into the main checkout.** During the alignment fix pass a DeepSeek Flash worker started inside the worktree (`cwd` set, `--standalone`) still resolved its file tools to `/Users/michelkerkmeester/MEGA/Development/Skilled`, the main checkout, and wrote four YAML lines there. The patch was moved to the worktree with `git apply` and reversed in main with `git apply -R`, touching only those two files. The next worker was pinned by absolute worktree paths and stayed inside. Want cli-opencode's dispatch shape fixed so a worktree start stays in the worktree, or the preamble to always carry the absolute root?
9. **No changelog entry for this change.** The alignment run flagged that `system-skilled-doctor` changed user-visible behavior with no changelog entry or version bump. A release entry is a version decision, so it waits for you: a `v1.0.1.0` changelog plus a `SKILL.md` version bump, or fold it into the next release?
10. **Pre-existing CI failures on main, not fixed here.** The doctor playbook's `status-without-overlays.md` and `moved-command-contract.md` fail `SKIP_BLOCKER_MISSING`, and the doctor `README.md` points at a missing `runtime/ENV-REFERENCE.md`. Both fail on main `1f2236c027` too. Want them fixed as their own change?

## Operator answers (2026-11-08)

- **Push:** the three alignment commits were pushed on the operator's yes.
- **Q8:** opened as its own packet, `specs/cli-external-orchestration/087-opencode-worktree-confinement`. Rereading the worker logs showed w1 and w2 also read main-checkout paths, though only w3 wrote there. The prompt never named the main path and the inherited `PWD` is not the cause.
- **Q9:** both. `system-skilled-doctor` v1.1.0.0 changelog entry and `SKILL.md` at 1.1.0.0.
- **Q10:** fix all. The six agents-md failures shared one cause, a manifest history the `v4.0.2.0` tag made stale, cleared by `agents-md-manifest.cjs --write`. The two playbook SKIP lines name their blocker, the result-persistence marker is in, and the doctor README links `ENV-REFERENCE.md` by its full path. Doctor suite: 1,069 of 1,069 pass.

_(more appended as they arise)_
