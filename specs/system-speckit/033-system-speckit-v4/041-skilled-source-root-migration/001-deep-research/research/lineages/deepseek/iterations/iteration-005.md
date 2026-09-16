---
title: "Iteration 5: Migration Mechanics and the Documentation Surface"
trigger_phrases: []
---
# Iteration 5: Migration Mechanics and the Documentation Surface

## Focus
Surface 7 (whether `git mv` preserves history at this size; what happens to existing symlinks whose targets traverse the moved directory; whether the change can land as one commit or must be staged; whether any tooling caches an absolute path that survives the move) plus surface 8 (the ~3,000 tracked markdown files naming the path — load-bearing instructions versus stale prose, with counts).

## Findings

### F5.1 — The move's size: 17,766 tracked files under `.opencode/`, against a `.skilled/` that holds one placeholder

`git ls-files .opencode` counts **17,766** tracked files: 17,360 regular (mode 100644), 198 executable (100755), and **208 symlinks** (mode 120000 — exactly the internal link count from iteration 1). `.skilled/` tracks one file: `future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep` [SOURCE: `git ls-files -s .opencode`; `git ls-files .skilled`].

- **Classification**: mechanical
- **Consequence for the cutover**: the move is a 17.7k-file rename wave, not a directory flip; every verification step the design lists must be sized to that (rename-status checks, old-prefix sweep, mirror regeneration).

### F5.2 — The repository already ships a purpose-built runbook for exactly this shape of move

`.opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md` is "a step-ordered runbook for a large rename/reorg (hundreds-to-thousands of `git mv`)". Its normative statements, verbatim:

- "Renames are performed with `git mv` (not raw `mv` + `git add`, which can register as delete+add and lose blame continuity), and the wave is verified to have landed as `R`-status before committing — **content edits are kept in separate commits from pure renames so rename detection stays reliable**." [SOURCE: .opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md:32]
- "After merging back to `main`, the tree is sanity-checked for **zero tracked files under the old path prefix**, confirming the rename moved rather than copied." [SOURCE: large-reorg-playbook.md:32]
- "`git mv` leaves gitignored cruft (`.DS_Store`, `*.log`, `*.pyc`, build caches) behind in old source directories; a scan finds directories with disk files but zero tracked files and nothing committable, and those are removed." [SOURCE: large-reorg-playbook.md:36]
- "A fresh worktree is a clean checkout of tracked files only, so it does not contain gitignored build dependencies (`node_modules`, `dist`). Toolchains that import from those directories break silently inside a bare worktree… **any strict-validate result obtained from inside the worktree is treated as meaningless**." [SOURCE: large-reorg-playbook.md:30,36]
- The global memory/vector databases are snapshotted before the wave because "`git revert`/`git reset` cannot restore a gitignored directory" [SOURCE: large-reorg-playbook.md:32,34].

- **Classification**: manual (follow the existing runbook; do not invent a new one)
- **Consequence for the cutover**: q7's "one commit or staged" question is answered by repo doctrine: **pure-rename commit first, content edits separate**. The migration's own size (17.7k files) sits squarely in the runbook's stated range. The runbook also names the reindex class (memory/vector DB) as a single global instance — a database this packet has not separately enumerated (see UNKNOWN below).

### F5.3 — History at this size: the mechanism is proven in-repo, and the risk is content edits in the rename commit

Precedent: the sk-git v1.3.2.0 release moved "66 files and 13 directories… via `git mv` (history preserved), and every path reference… was repointed to the new names", with the changelog stating "History is preserved, so `git log --follow` continues to work across the rename" [SOURCE: .opencode/skills/sk-git/changelog/v1.3.2.0.md:11,27]. Nothing in the mechanism scales with file count; rename detection runs per-file at diff time. What degrades detection is rewriting file contents in the same commit — which this migration must do for 295 code files (F3.3) and the generated trees — hence the playbook's separation rule.

- **Classification**: mechanical (pure-rename commit) + manual (commit splitting)
- **Consequence for the cutover**: the design's commit plan is constrained: rename-only commit, then content-edit commits, then regeneration commits. A single "move + rewrite everything" commit would technically land but blur `R`-status and make the old-prefix sweep and blame continuity unreliable.

### F5.4 — What `git mv` will not carry: nine ignored entries, including all four `dist/` trees and five `node_modules/`

`git status --ignored` under `.opencode` lists nine ignored entries: `.opencode/node_modules/`, four `skills/**/node_modules/`, all four `dist/` trees (`.opencode/skills/system-spec-kit/{runtime/dist,runtime/cli/dist,shared/dist}`, `.opencode/skills/system-skill-advisor/runtime/dist`), and `.opencode/skills/system-spec-kit/.node-version-marker` [SOURCE: `git status --ignored --porcelain .opencode`]. Crucially, **all four dist trees have `tracked=0`** — they are build outputs, not versioned files, and the `.dist-freshness-*.json` attestations live inside them (untracked) [SOURCE: `git ls-files <dist>` for each tree].

- **Classification**: regenerate (on main, after merge — per the playbook)
- **Consequence for the cutover**: this corrects iteration 3's dist accounting: the 90 `.opencode`-carrying compiled files are *untracked build outputs* in a worktree that was built; a fresh worktree has none, and after the rename they must be rebuilt on main, not moved. The migration's validation plan cannot run the toolchain from the rename worktree and call the result meaningful (F5.2).

### F5.5 — Symlinks across the move: 174 dangle at once, 208 travel intact, 1 still resolves

- The 174 external relative links (`../.opencode/...`) resolve against their own directory and point at a path that no longer exists after the rename → all dangle simultaneously; git records each as a mode-120000 blob and is blind to the dangle [SOURCE: iteration 1 census; `git ls-files -s` mode histogram].
- The 208 internal links move with the tree; their relative targets are unchanged, so they keep resolving (203 in-tree; the one out-link `.opencode/specs -> ../specs` resolves at the same depth from `.skilled/`) [SOURCE: iteration 1, F1.7].
- The whole-dir links `.claude/skills` and `.pi/skills` dangle exactly like the per-file ones — no special case.

- **Classification**: mechanical (retarget script) 
- **Consequence for the cutover**: a rename commit that moves the tree without retargeting leaves 174 dangling links and no gate that fails on it (link integrity checks read files, not link resolution). The retarget must be part of the same wave, and the post-wave check should assert every link resolves except the 8 pre-existing broken ones (F1.7).

### F5.6 — Destination mechanics: `.skilled/` already exists, so the naive move nests

`.skilled/` exists with a placeholder directory and a tracked `.gitkeep` (F5.1). `git mv .opencode .skilled` would place the tree at `.skilled/.opencode/` — a nesting, not a move. The mechanics must either remove the placeholder first or move the contents (`git mv .opencode/* .skilled/` misses dotfiles; a scripted per-path move is the reliable form).

- **Classification**: mechanical (with a manual placeholder decision)
- **Consequence for the cutover**: the placeholder directory's own name — "move-opencode-contents-to-here-and-relative-symlink-back" — states the intended shape (contents move, relative links point back), which is a design statement already committed to the tree.

### F5.7 — Cached absolute paths that survive the move: enumerated, and one new class

Survivors identified across this packet: SQLite rows with old absolute paths (`council-graph.sqlite`, F3.6); the `~/.codex` `[projects."…/Public/.opencode"]` trust entry (F4.7); the checked-in launchd plist template (F3.9); `~/.claude.json` prompt prose (F4.7). One additional class verified here: this worktree's `.git` file points at the **main checkout's** gitdir (`gitdir: /Users/…/Public/.git/worktrees/055-skilled-source-root-migration`) — unaffected by the move (it references `.git`, not `.opencode`) [SOURCE: `.git` file]. The playbook adds the class this packet has not separately measured: the global memory/vector databases, which "index paths" and are reindexed once on main after merge [SOURCE: large-reorg-playbook.md:34].

- **Classification**: manual (checklist item) / regenerate (reindex)
- **Consequence for the cutover**: the reindex is the one cached-path consumer with a named procedure in-repo; the rest are the F3/F4 lists. **UNKNOWN**: the memory/vector database's exact location and whether it stores `.opencode` paths — what would settle it: the system-spec-kit memory subsystem's config (out of this packet's scan).

### F5.8 — The documentation surface: 3,035 files outside `specs/`; 816 carry runnable (fenced-block) references

Measured on tracked markdown: **3,035** files contain `.opencode` excluding `specs/` and `node_modules` (27,696 including `specs/`). Of the 3,035, **816 have the string inside fenced code blocks** (runnable instructions: commands, config snippets, verification steps) and **2,219 have it only in inline prose or links**. Distribution by first structural segment: `.opencode/skills/**` 2,731, `.hermes/skills` 68, `.opencode/commands` 45, `.pi/prompts` 34, `.codex/prompts` 33, `.hermes/prompts` 33, `.opencode/hooks` 21, `.opencode/agents`/`.claude/agents`/`.pi/agents` 12 each, remainder in `.opencode/{bin,scripts,plugins,install-guides}` and mirror manifests [SOURCE: python census over `git grep -l`, 2026-09-16].

Root documents, by reference count: `README.md` 52, `PUBLIC-RELEASE.md` 33, `AGENTS.md` 9 (and its symlink `CLAUDE.md` 9), `CONTRIBUTING.md` 3, and **`REPO RULES.md` 0 — the brief names it as a file that "names the path"; it does not.** All twelve `repo-rules/*.md` files: 0 references each [SOURCE: per-file counts].

- **Classification**: mechanical (bulk rewrite) with a manual triage for the instructional subset
- **Consequence for the cutover**: the 3,035 number is dominated by material where a stale mention is cosmetic; the cutover's correctness depends on the 816 fenced-ref files plus the root documents.

### F5.9 — Load-bearing versus prose, with counts and different treatments

| Class | Count | Treatment |
|---|---|---|
| Fenced-block refs (runnable instructions) | 816 files, incl. 111 `SKILL.md`, 217 `references/**`, 47 `commands/**`, 45 `hooks/**`, 36 `agents/**` | **Rewrite** — these instruct an agent or human to execute a path; a stale one is a wrong instruction, not a stale sentence |
| Generated prompt stubs | 100 files (`.codex/prompts` 33, `.pi/prompts` 34, `.hermes/prompts` 33) | **Regenerate** — text rewrite is undone by the next generator run (F2.4) |
| Root/gate documents | `AGENTS.md` 9, `README.md` 52, `PUBLIC-RELEASE.md` 33, `CONTRIBUTING.md` 3 | **Rewrite** — `AGENTS.md` carries the Gate 1 lookup command; `PUBLIC-RELEASE.md` carries release procedure |
| Mirror manifests | 6 × `SYNC.md` (already drifted, F1.8) | **Rewrite** — they are the documentation of record for the mechanism split |
| Evidence/prose | 1,710 files: `manual-testing-playbook` 1,054, `benchmark` 368, `changelog` 288 | **Freeze or cosmetic** — historical records of runs that happened at the old path; rewriting them falsifies the record |
| Mixed | `feature-catalog` 270, `assets` 60 | **Triage per file** — catalogs route, assets instruct |
| Specs corpus | 24,661 files under `specs/` | **Out of the migration's rewrite scope** — research records; noted so the 27,696 total is not mistaken for the work |

- **Classification**: manual (the triage decision) / mechanical (the rewrite itself)
- **Consequence for the cutover**: the design can state the doc work as three numbers — 816 rewrite-critical files, 100 regenerate-only stubs, ~2,000 cosmetic/frozen — instead of the unusable "3,000 files". The brief's "load-bearing instructions that would become wrong" is precisely the fenced-ref set plus the root documents.

## Sources Consulted
- `git ls-files -s .opencode`, `git ls-files .skilled`, `git status --ignored --porcelain .opencode`
- `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md`; `.opencode/skills/sk-git/changelog/v1.3.2.0.md`; `.opencode/skills/sk-git/feature-catalog/feature-catalog.md`
- Python census over `git grep -l '.opencode' -- '*.md'` (fenced-block detection, area segmentation)
- Root-document reference counts; `repo-rules/*.md` counts
- `.git` worktree pointer file

## Assessment
- **newInfoRatio**: 0.9
- **Novelty justification**: the repo's own large-reorg runbook as the authoritative answer to q7; the 17,766-file size; the ignored-content list and the dist-trees-are-untracked correction; the 816/2,219 fenced-vs-inline split; the REPO RULES.md correction; the treatment table — all new to the packet.
- **Confidence**: High on counts and playbook text (measured and read directly). Medium on history-preservation at scale (mechanism reasoning plus one in-repo precedent at 1/270th the size; the playbook itself is the repo's claim). UNKNOWN: memory/vector DB location and path content.

## Reflection
- **What worked**: searching for the repo's own doctrine before reasoning from first principles — the large-reorg playbook answered most of q7 with citations, and its "content edits separate from renames" rule directly contradicts the naive one-commit plan.
- **What failed**: the first pass at the doc census used `head`-truncated greps and produced unreliable counts; the python census replaced it. Also corrected iteration 3's implication that dist trees are versioned.
- **Ruled out**: nothing new this iteration.

## Recommended Next Focus
None — iteration cap reached. Proceed to synthesis: consolidate all five iterations into `research.md`, with the correction ledger, the UNKNOWN list, and the blocker inventory.
