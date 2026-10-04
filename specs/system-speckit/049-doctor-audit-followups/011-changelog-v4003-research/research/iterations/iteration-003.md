# Iteration 003

## Focus

Draft the exact entry edit plan with line anchors, resolve the two carried-forward wording questions (section placement and the `cli-jev/003/010` attribution of the existing trigger-lookup paragraph), settle the hook-count wording, and test the last "stated wrongly" candidate in the entry.

## Actions Taken

1. Re-read all 188 numbered lines of `.skilled/changelog/skilled/v4.0.0.3.md`. Confirmed the "Trigger Lookups Handle No Hits" paragraph (lines 134-136) was present in the entry's first commit `10dd46c97a` (2026-10-02), and that the entry has only three commits: `10dd46c97a`, `7877260e26`, `8718f06f89`.
2. Read the house style that governs placement: `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` (step 9 ceilings at line 304, structure at line 275, section jobs upstream) and `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` (section 2 shapes, section 3 drop-by-default, section 4 length ceilings, section 5 format selection).
3. Counted the entry's glance bullets: 16 bullets on lines 32-47 against the checklist's "at most 12 glance bullets" (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:304`).
4. Read `.skilled/changelog/skilled/README.md` section 2 (entry workflow and the exemplar pointer) and grepped prior entries for `cli-jev` references to check whether the trigger-lookup paragraph's originating packet is listed anywhere.
5. Verified the trust mechanism behind the entry's worktree sentence in `.skilled/scripts/git-hooks/README.md` line 32 and `.skilled/scripts/git-hooks/pre-commit` lines 33-44, and checked the levels of the packets to add to the spec-folder line (`049` parent Level 2 at `spec.md:49`, `cli-jev/003/010` Level 2 at `spec.md:25`).

All work was read-only against the research surface; no scope violations occurred. No sub-agents were dispatched.

## Findings

### H1 (P1) - The entry's glance list is already over the checklist ceiling, so doctor coverage must be folded in with merges, not appended

Lines 32-47 carry 16 glance bullets. The house checklist caps the glance list at 12 (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:304`, mirrored in the template's length table). The four doctor/git-hook bullets this research recommends (doctor ownership split, saved hook gates plus `/doctor:git`, updater safety, retrieval doctor) would take the list to 20. To hold the ceiling the entry must merge at least 8 of the existing 16 bullets away before or while the doctor bullets go in. Concrete merge candidates, none of which lose a reader-visible fact:

- Lines 36-37 (Jev hub and Pi transport) describe one routing improvement and merge cleanly into one bullet.
- Lines 43-44 (machine-like prose and plain-language fidelity) describe one communication change and merge cleanly.
- Lines 45 and 47 (workflow security housekeeping and deep-review state) could stay, but lines 32-35 (repository checks) describe one contract family and can carry two or three items in fewer bullets.
- The three route bullets (lines 36-38) can also become two by folding MiMo into the classifier bullet.

If the author prefers to keep all 16 existing bullets, the release cannot tick checklist step 9 and the entry exceeds its own template. The recommendation is to merge to 12 with the doctor bullets included, not to raise the ceiling in prose.

Sources: `.skilled/changelog/skilled/v4.0.0.3.md` (lines 32-47), `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` (line 304), `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` (length table).

### H2 (P1) - Exact edit plan, with line anchors, for the doctor/git-hook coverage

**Header and metadata (lines 1-20).**

- Line 2, title: the title names three themes and doctor/git-hook work appears in none. Add the doctor theme editorially, for example `v4.0.0.3, Stronger Repository Rules, Clearer Routing, Plain Language and One-Job Doctor Commands`. Final wording is the author's.
- Line 3, description: the frontmatter description has a 250-character guard (template section 2). The current text is about 205 characters, so the doctor theme must be folded in by rewriting, not appended. Draft: `v4.0.0.3 aligns repository message checks, improves classifier routing and gives the doctor one-job commands, saved git-hook gates and a safer updater. It adds an offline reader check and removes the standalone communication skill.` (about 237 characters).
- Lines 4-8, trigger phrases: add one or two 2-6-word phrases for the doctor surface, for example `doctor command split` and `saved git hook gates`.
- Lines 14-16, opening narrative: add one sentence naming the doctor and git-hook theme so the release story matches the glance list and the sections.
- Line 20, `> Also:` list: add `specs/system-speckit/049-doctor-audit-followups` (Level 2). Optionally also add `specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes` (Level 2), which is the origin of the existing trigger-lookup paragraph and is not listed in any changelog today.

**New topical H2 section.** Insert `## Doctor Commands` between line 90 (`---`) and line 92 (`## Classifier and Model Routing`), so it follows `## Repository Checks` and leads into the routing sections. Six benefit-led H4 items, each 1-2 paragraphs, each carrying only the reader-facing mechanism:

1. `#### The Doctor Splits Into One-Owner Commands` - phase 008, commit `46ecac338c`, `specs/system-speckit/049-doctor-audit-followups/008-doctor-ownership-split/implementation-summary.md`, `.skilled/commands/doctor/_routes.yaml`. Covers: `/doctor:speckit` reduced to retrieval with no target and a moved-target notice for old target names; `/doctor:skill-advisor` gains `tune` (the old target) and `rebuild` (backs up and restores `skill-graph.sqlite`); `/doctor:deep-loop` and `/doctor:runtime-mirrors` as one-owner routers; `/doctor:rebuild` and the fable-mode target removed with their workflow, script, test, playbook scenarios and migration leg. Mark the removals with an inline `**Breaking:**` or the Upgrade Notes lines.
2. `#### Saved Hook Gates and the Doctor Git Command` - phase 009, commits `e3626413cd` and `d1fe481584`, files `.skilled/scripts/git-hooks/lib/gates.tsv`, `.skilled/scripts/git-hooks/lib/gate-config.sh`, `.skilled/commands/doctor/git.md`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`. Covers: `speckit.hooks.<key>` set to `off`, `false`, `no` or `0` in local or global git config switches that gate off for the run, with one notice line; command-scope values (`git -c`, `GIT_CONFIG_*`) do not count, and only a repository carrying the installed hooks reads settings. `/doctor:git hooks` lists every gate with local/global/effective value and hook install state and edits one gate after approval. `/doctor:git standards` copies the shipped sk-git templates into `.sk-git/` once without overwriting, edits or removes a rules-block setting or a kind's rules section, rechecks with sk-git's own shape check, reports template prose still stating an old rule, and writes nothing under `--dry-run`.
3. `#### The Updater Plans Before It Changes` - phases 002, 005, 006, commits `eb315be211`, `eaa4b79d26`, `b4e02411d3`, `f67263c396`, summaries `002-.../`, `005-.../`, `006-.../`, `.skilled/commands/doctor/scripts/release-update.cjs`. Covers: a `generated` file class where only a `derived`-block-only `graph-metadata.json` change counts as generated; `record-base` writing `.skilled/release/base.json` with `check` reporting `baseRecording`; `--include-prerelease` with numeric segment ordering; alignment-free `apply` that plans from the current check, writes only update and new units, re-reads each file under the lock and records `plan.json`/`rollback.json` in a run directory; refusal of a decisions file with no alignment run; lock owner and stale recovery plus `unlock`; copied-tree base and `--trust-release`; plan-digest binding plus routed rollback and record-base approval gates; rename linking with an engine/router/workflow contract test.
4. `#### The Retrieval Doctor Checks the Index` - phase 001, `specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/implementation-summary.md`, `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`. Covers: the retrieval doctor's phase 0 runs `generate-trigger-index.mjs --check --json` as its verdict; the new `index_content_stale` signal judges content instead of mtime (mtime demoted to low-severity supporting evidence); `folder-token-fallback` counts through the validator's own `packetFolderTokens`. Do not re-describe `--scoring-only` here; that fact stays in lines 134-136 (see H3).
5. `#### Doctor Gates Refuse to Guess` - phase 010, commit `f4485249ed`, `.skilled/commands/doctor/skill-advisor.md`, `.skilled/commands/doctor/mcp.md`. Covers: `/doctor:skill-advisor` and `/doctor:mcp` show their menu and wait when no target is given and never infer a target from the conversation or the repository.
6. `#### Doctor Checks Fail on Real Drift` - phases 003, 004, 007, commits `cc2d4ea5f2`, `119c4ffb07`, summaries `003-.../`, `004-.../`, `007-.../`. Covers: the guard-owned `mcp-mutation-class-manifest.yaml`; the `route-validate` command-owner assertion; scripts fixed against false PASS and crashes; the hub-contract check at 21 commands; the mutation-class guard grown from 7 to 21 rows; removal of `mcp-doctor.sh --fix`; one test runner wired into CI; and the speckit contract gaining a shared workflow for `/speckit:plan`, `/speckit:implement` and `/speckit:complete` with `/speckit:resume` keeping its auto/confirm pair.

**Repository Checks edits (lines 51-88).**

- Correct line 88 (see H3), then add the missing hook fixes after it: a new H4 for commit `9c99983374` (a staged file whose content cannot be read blocks, except a submodule entry, and the pre-commit temp directory is removed on any exit) and a new H4 for commit `d1fe481584` (hook docs match the hooks: `ENV-REFERENCE.md` section 5 documents every git-hook variable, and the hook READMEs correct pre-push to warn rather than block, to check only the commits a push adds, and to say a bare `SPECKIT_ALLOW_REMOTE_PUSH=1` cannot create a branch).
- Fold 032/001's remaining fixes into existing paragraphs: `git -c skgit.contractDir` and `GIT_CONFIG_*` no longer disable the message contract, `prepare-commit-msg` strips only `Co-Authored-By:` and `Claude-Session:` lines, the Commit-Id owner and rebased-copy rule, and the push range counting only the commits a push adds (extends line 63).
- The entry's order and `&nbsp;` separators stay as they are; the two new H4 items follow the worktree paragraph and sit before the `---` at line 90.

**Upgrade Notes (lines 184-188).** Add the doctor and hook lines (H6); the release now carries adopt, repoint and drop items, so the template's lead-ins become available.

**Do not add (template section 3, drop by default).** The index regeneration over 23,056 documents and its three sidecars, the 25-case and 16-case test counts, and any phase or commit identifiers in the entry prose. The entry keeps one spec pointer in its header.

Sources: all files above, plus `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` (sections 2-5) and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`.

### H3 (P1) - Line 88 is the one statement in the entry that later work made wrong

The worktree paragraph ends "Any other repository still never runs its own code at commit time" (line 88). That absolute is contradicted by the shipped mechanism: the hooks keep the selected source root for the checkout they live in, one of its worktrees, or a repository whose local config sets `skilled.trustRepoHooks=true` (`.skilled/scripts/git-hooks/README.md:32`; the same block is carried by `pre-commit` lines 33-44 and the five sibling hooks, and `git -c`/`GIT_CONFIG_*` values do not count). With the opt-in, another repository does run its own code at commit time. Fix: state the default and the opt-in, for example "Any other repository uses the installed checkout's root and runs none of its own scripts unless its local config sets `skilled.trustRepoHooks=true`." This is a correction, not only an extension; it is the answer to the "stated wrongly" half of Q4.

Sources: `.skilled/changelog/skilled/v4.0.0.3.md` (line 88), `.skilled/scripts/git-hooks/README.md` (line 32), `.skilled/scripts/git-hooks/pre-commit` (lines 33-44), `specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes/implementation-summary.md`.

### H4 (P2) - The trigger-lookup paragraph stays byte-identical; attribution belongs on the spec-folder line

Both carried-forward wording questions resolve the same way. Lines 134-136 are accurate for `--scoring-only` and the generator `--check`, and the paragraph entered the entry in its first commit (`10dd46c97a`). The work came from `specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes` (REQ-006), not from the 048 audit and not from 049; 049/001 only adds the doctor-side verdict and content-staleness signal, which go in the new doctor section (H2, item 4). Changelog house style keeps one spec pointer per entry in the header, so no per-sentence origin note belongs inside the paragraph. The attribution fix is to add 049 to the `> Also:` list (required) and optionally the `cli-jev/003/010` packet (accurate but outside the doctor/git scope). Nothing in the paragraph needs editing.

Sources: `.skilled/changelog/skilled/v4.0.0.3.md` (lines 134-136), `specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/spec.md` (line 86, REQ-006), `specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/implementation-summary.md` (lines 59, 67-68).

### H5 (P2) - Count wording is settled: quote the actionable set, never a bare total

`gates.tsv` carries 12 gate rows (10 `SPECKIT_SKIP_*` switches with `persistable=yes`, 2 `SPECKIT_ALLOW_*` approvals with `persistable=no`). `ENV-REFERENCE.md` section 5 carries 14 rows: those 12 gates plus `SPECKIT_COMMIT_SPEC` and `SPECKIT_MASS_DELETION_THRESHOLD`, which are a message input and a threshold knob rather than gates. The entry should quote the actionable number, "ten gate switches can be saved with `speckit.hooks.<key>`, and the two `SPECKIT_ALLOW_*` approvals stay per run", and should not quote "12 gates" or "14 variables" in prose. If the reference-table coverage itself is named, say "the environment reference now documents every git-hook variable" without a total.

Sources: `.skilled/scripts/git-hooks/lib/gates.tsv` (lines 7-18), `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` (lines 213-234), `.skilled/scripts/git-hooks/lib/gate-config.sh` (lines 5-40).

### H6 (P2) - Exact Upgrade Notes lines

The release has adopt, repoint and drop items once the doctor work is covered, so the template's lead-ins fit. Draft lines:

- **Repoint.** `/doctor:rebuild` is gone; rebuild the skill graph with `/doctor:skill-advisor rebuild`. Reach each router by its own name: `/doctor:skill-advisor`, `/doctor:deep-loop`, `/doctor:runtime-mirrors`. `/doctor:speckit` now checks retrieval only and prints a moved-target notice for old target names.
- **Adopt.** `/doctor:git hooks` shows each hook gate's saved value and edits one after approval; `/doctor:git standards` copies the shipped sk-git templates into `.sk-git/` once and keeps their rules in step.
- **Save switches.** Set `speckit.hooks.<key>` to `off`, `false`, `no` or `0` in local or global git config. Ten gate switches can be saved; the two `SPECKIT_ALLOW_*` approvals stay per run.
- **Record a base once.** Run the updater's `record-base` before the first `check` when you want the base written, add `--include-prerelease` to compare against pre-releases, and expect `apply` to change only fully decided units and record its plan and rollback in a run directory.
- **Drop fable-mode.** The fable-mode target is removed; regenerate the trigger index with its generator script when it goes stale.

The drop-by-default rules keep the regeneration counts, sidecar counts and test counts out of these lines.

Sources: `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` (sections 2-4), `.skilled/changelog/skilled/v4.0.0.3.md` (lines 184-188), `specs/system-speckit/049-doctor-audit-followups/004-doctor-scripts-conformance/implementation-summary.md`, `specs/system-speckit/049-doctor-audit-followups/006-doctor-update-fixes/implementation-summary.md`.

## Questions Answered

- Q1-Q4 remain answered from iterations 1 and 2; no key question was newly answered here. This iteration closed the carried-forward wording items:
  - Section placement and wording are now fixed with line anchors (H2, H6).
  - The 14-versus-12 count question is settled and given safe wording (H5).
  - The `cli-jev/003/010` versus 048 versus 049 attribution of the trigger-lookup paragraph is settled: the paragraph is untouched and attribution moves to the header spec line (H4).
  - The last open "stated wrongly" candidate is confirmed and given a correction (H3).

## Questions Remaining

- None. All tracked and carried-forward open questions are resolved; the remaining work is implementing the edits, which the research boundaries exclude.

## Next Focus

- Terminal iteration for this run. The synthesis and follow-up changelog edit can consume H1-H6 directly: merge the glance list while adding up to four doctor bullets, insert the `## Doctor Commands` H2 at line 91, correct line 88, add the two Repository Checks H4 items and the 032/001 fixes, and extend the header and Upgrade Notes. No new research direction remains.
