### .skilled/skills/sk-git/README.md

- [P2] .skilled/skills/sk-git/README.md:40 | 7 | One paragraph combines setup, commit hygiene, completion and routing. | Replace it with the opening sentence followed by four bullets: `Setup creates an isolated worktree or keeps the current branch`; `Commit hygiene turns staged changes into deterministic Conventional Commit subjects with artifact filtering`; `Completion opens a PR, merges or discards, then cleans up`; `Smart routing loads only the reference for the current phase, so the agent reads focused guidance instead of the whole library`.
- [P2] .skilled/skills/sk-git/README.md:42 | 7 | The paragraph packs four distinct rules and their rationale together. | Replace it with `What makes sk-git different from raw git is the rule set it holds:` followed by bullets for branch ownership, locked number allocation, asking before workspace changes and deterministic commits; keep `Each rule exists to stop a specific quiet failure before it compounds.` after the list.
- [P2] .skilled/skills/sk-git/README.md:125 | 7 | The paragraph combines base relocation, tool behavior, legacy layout support and number allocation. | Split the existing sentences into bullets covering the `.worktrees` default and relocation, allocator and reaper base resolution, legacy layout validation, and location-independent numbering.
- [P2] .skilled/skills/sk-git/README.md:129 | 7 | The allocator paragraph combines its lock, seed data, scans, concurrency guarantee and commands. | Split the existing claims into bullets for allocation under lock, high-water/ref/worktree scans, the no-reissue guarantee and the commands to use.
- [P2] .skilled/skills/sk-git/README.md:155 | 7 | One paragraph combines trailer rules, amend/cherry-pick behavior and three lookup commands. | Split it into bullets for trailer contents, amend and cherry-pick behavior, the unstamped fallback, and each lookup command.
- [P2] .skilled/skills/sk-git/README.md:155 | 9 | The packet-specific `sk-git/028` example also appears at line 262. | Replace `sk-git/028` in both query examples with `your-track/your-packet`.

### .skilled/skills/sk-git/ROUTER.md

- [P2] .skilled/skills/sk-git/ROUTER.md:23 | 7 | The paragraph packs matching requests, resource selection, excluded domains and fallback behavior together. | Split the existing sentences into four bullets, one for each routing rule, preserving their wording.

### .skilled/skills/sk-git/SKILL.md

- [P2] .skilled/skills/sk-git/SKILL.md:40 | 1 | SMART ROUTING has six non-blank prose lines, below the template’s eight-line minimum. | Insert source line breaks after `lands here,` on line 41 and `GitLens,` on line 44; this brings the section to eight lines without changing wording.
- [P2] .skilled/skills/sk-git/SKILL.md:87 | 7 | The advisory paragraph combines execution, state checks, output and hook enforcement. | Split it into bullets for the `hard-rules.json` advisory, state-based evaluation, printed advice and non-blocking behavior, and enforcement by the three hooks.
- [P2] .skilled/skills/sk-git/SKILL.md:153 | 7 | The paragraph combines type inference, scope inference and the resulting history guarantee. | Split it into bullets for the fixed type priority, scope priority and consistent commit subjects.
- [P2] .skilled/skills/sk-git/SKILL.md:155 | 7 | The paragraph combines trailer requirements, stamping behavior, amend/cherry-pick behavior and three queries. | Split the existing claims into bullets for trailer contents, amend/cherry-pick behavior, fail-open stamping and each query.
- [P2] .skilled/skills/sk-git/SKILL.md:155 | 9 | The query uses the specific packet path `sk-git/028`. | Replace that query value with `your-track/your-packet`.

### .skilled/skills/sk-git/assets/commit-message-template.md

- [P2] .skilled/skills/sk-git/assets/commit-message-template.md:15 | 3 | No hook appears between the H1 and the overview. | Insert after line 15: `Use this template before \`git commit\` to check that an authored message follows the repository's contract.`
- [P2] .skilled/skills/sk-git/assets/commit-message-template.md:19 | 4 | The overview has no Purpose and Usage headings, as required by the asset template. | Split the paragraph under `### Purpose` and `### Usage`; put the enforced commit shape under Purpose, and put the `SKILL.md` pointer, procedure, examples, self-check and Section 7 enforcement block under Usage.
- [P2] .skilled/skills/sk-git/assets/commit-message-template.md:149 | 9 | The paragraph includes authoring history and three commit hashes. | Replace it with: `These examples show repository-specific commit patterns rather than generic auth/API scaffolding.`

### .skilled/skills/sk-git/assets/pr-template.md

- [P2] .skilled/skills/sk-git/assets/pr-template.md:17 | 3 | The intro restates the Purpose instead of telling readers when to use the file. | Replace it with: `Choose the template that matches the PR type before drafting its description.`
- [P2] .skilled/skills/sk-git/assets/pr-template.md:443 | 2 | The zero-feature validator reports `render_section_order` because “RELATED ISSUES GUIDELINES” is followed by another H2, although the actual Related Resources section is last. | Replace `## 13. RELATED ISSUES GUIDELINES` with `## 13. ISSUE LINKING GUIDELINES` to avoid the false related-section match while keeping the section number and position.

### .skilled/skills/sk-git/assets/worktree-checklist.md

- [P2] .skilled/skills/sk-git/assets/worktree-checklist.md:17 | 3 | The intro repeats the Purpose’s description of a safe worktree checklist. | Replace it with: `Open this checklist before selecting a location and creating a named worktree.`

### .skilled/skills/sk-git/references/commit-workflows.md

- [P2] .skilled/skills/sk-git/references/commit-workflows.md:18 | 3 | The intro repeats the overview’s description of commit workflow guidance. | Replace it with: `Use this reference when changed files need filtering, grouping and a commit message before committing.`
- [P2] .skilled/skills/sk-git/references/commit-workflows.md:24 | 4 | The overview lacks the Purpose and When to Use structure required by the reference template. | Replace the opening paragraph with `### Purpose` and `Ensure commits are atomic, well-documented and exclude internal development artifacts.`; follow it with `### When to Use` and bullets for analyzing and filtering changes, choosing a commit strategy, and writing and checking commit messages.
- [P1] .skilled/skills/sk-git/references/commit-workflows.md:220 | 5 | Scoped-staging safeguards appear after the final-readiness step and its commit commands, so the dirty-tree gate comes after the action it governs. | Within H2 Section 3, move lines 220–274 before the current Step 6 at line 189; rename the moved block Step 6 and the current Step 6 Step 7, then update the in-file Step 7 references.
- [P2] .skilled/skills/sk-git/references/commit-workflows.md:181 | 7 | One paragraph combines trailer order, environment setup, stamping behavior and lookup commands. | Split the existing claims into bullets for trailer contents, setting `SPECKIT_COMMIT_SPEC`, the no-hand-typed-ID rule and the lookup commands.
- [P2] .skilled/skills/sk-git/references/commit-workflows.md:224 | 9 | The rationale includes authoring history and the ephemeral `026 wave-4` identifier. | Replace it with: `**Why this matters**: A broad \`git add\` on a dirty tree can sweep unrelated files from another packet and install guides into the commit, requiring a mixed reset and precise restaging. See \`shared-patterns.md\` §10 for the corresponding rename-heavy merge recovery.`

### .skilled/skills/sk-git/references/continuous-integration.md

- [P2] .skilled/skills/sk-git/references/continuous-integration.md:18 | 3 | The intro repeats the overview’s Purpose. | Replace it with: `Open this reference when you need to trace how a session commit reaches the operator's IDE.`
- [P2] .skilled/skills/sk-git/references/continuous-integration.md:24 | 4 | The overview lacks the Purpose and When to Use structure required by the reference template. | Add `### Purpose` before the overview explanation and `### When to Use` before the three behavior bullets; use the existing isolation and IDE-visibility claims for the Purpose and the concurrent-session scenario for When to Use.
- [P2] .skilled/skills/sk-git/references/continuous-integration.md:73 | 7 | One paragraph combines fast-forward behavior, rebase conditions, foreign-rebase refusal, conflict recovery and rejected-push handling. | Split it into five bullets in the existing order: behind-only fast-forward, clean-tree rebase, pre-existing rebase-state refusal, conflict abort and restore, rejected-push classification.
- [P2] .skilled/skills/sk-git/references/continuous-integration.md:75 | 7 | One paragraph combines lock behavior, time-bounded operations, logging and exit behavior. | Split it into bullets for the single-flight lock and stale-lock rule, fetch/push bounds, outcome logging and zero exits.
### .skilled/skills/sk-git/references/finish-workflows.md

- [P1] .skilled/skills/sk-git/references/finish-workflows.md:234 | 2 | The two bold labels run together in one paragraph. | Replace lines 233–234 with: `- **If user chooses 'n'**: Proceed to Step 5 (Cleanup Worktree)` and `- **If user chooses 'y'**: Skip Step 5, report worktree location`.
- [P2] .skilled/skills/sk-git/references/finish-workflows.md:20 | 3 | The intro repeats the description, while the allocator assumption does not tell readers when to open the reference. | Replace lines 20–22 with: “Use this reference when a branch created through the numbered-worktree naming allocator is ready for final test verification and an integration choice.”
- [P2] .skilled/skills/sk-git/references/finish-workflows.md:28 | 4 | The overview starts with an unlabeled purpose and has no When to Use section. | Add `### Purpose` before line 28. After the purpose paragraph, add `### When to Use` with the bullet `- A branch created through the numbered-worktree naming allocator is ready for final test verification and an integration choice.` Keep Core Principle after both.
- [P2] .skilled/skills/sk-git/references/finish-workflows.md:32 | 7 | The CI note packs autosync, checkout-following, reconciliation, and manual publishing into one paragraph. | Reformat it as a list covering: commits autosynced to the live branch; the primary checkout following it and Step 5b normally being complete; the final PR or merge decision; and the `git-sync.sh` command for publishing outside a commit.
- [P2] .skilled/skills/sk-git/references/finish-workflows.md:873 | 7 | The wrong-account explanation packs the 403 symptom, read access, account switching, and nested-repository behavior into one paragraph. | Split it into four bullets covering: how `gh auth status` identifies the active account and how a wrong account causes a 403; why fetch may still work and re-login will not fix the mismatch; recording and restoring the prior account when switching; and checking each nested repository’s remote.

### .skilled/skills/sk-git/references/github-mcp-integration.md

- [P2] .skilled/skills/sk-git/references/github-mcp-integration.md:17 | 3 | The intro describes the subject and repeats the overview purpose rather than giving a use-case hook. | Replace it with: “Open this reference when a workflow needs remote GitHub PR, issue, or repository operations through Code Mode.”
- [P2] .skilled/skills/sk-git/references/github-mcp-integration.md:23 | 4 | The overview has no Purpose or When to Use headings. | Add `### Purpose` before the existing paragraph. After it, add `### When to Use` with the bullet `- A workflow needs remote GitHub PR, issue, or repository operations through Code Mode.` Label the existing prerequisites paragraph `### Prerequisites`.

### .skilled/skills/sk-git/references/gitkraken-mcp-integration.md

- [P2] .skilled/skills/sk-git/references/gitkraken-mcp-integration.md:17 | 3 | The intro describes access and registration instead of telling readers when to open the reference. | Move the existing sentence unchanged into §1 to preserve its Code Mode and `.utcp_config.json` details. Replace the intro with: “Open this reference when a repository uses a non-GitHub provider or the task benefits from GitLens AI workflows.”
- [P2] .skilled/skills/sk-git/references/gitkraken-mcp-integration.md:23 | 4 | The overview lacks Purpose and When to Use headings. | Split the paragraph under `### Purpose` for server capabilities and `### When to Use` for the existing provider and GitLens use cases. Keep Prerequisites and Public preview after those sections.
- [P2] .skilled/skills/sk-git/references/gitkraken-mcp-integration.md:23 | 7 | The paragraph combines server capabilities, a tool-surface verification instruction, and use-case guidance. | Move the `gk mcp --list-tools` instruction and verification date into a separate Tool Surface check section. Keep the capability description under Purpose and the provider comparison under When to Use.

### .skilled/skills/sk-git/references/large-reorg-playbook.md

- [P2] .skilled/skills/sk-git/references/large-reorg-playbook.md:18 | 3 | The intro describes the runbook but does not tell readers when to open it. | Replace it with: “Open this playbook when a large rename or reorg needs isolated file moves and post-merge validation.”
- [P2] .skilled/skills/sk-git/references/large-reorg-playbook.md:24 | 4 | The overview opens with When to Use but has no preceding Purpose. | Insert before line 24: `### Purpose` followed by `Complete a large rename or renumber reorganization with file moves isolated in a worktree and validation on main after the merge.`
- [P2] .skilled/skills/sk-git/references/large-reorg-playbook.md:43 | 9 | The Origin section records a specific incident and phase counts as authoring history. | Replace lines 41–44 with `### Failure Modes Addressed` and: `This runbook addresses ignored leftovers, toolchain checks against a bare worktree, metadata paths recorded before merge, and renames registered as delete/add pairs.`

### .skilled/skills/sk-git/references/quick-reference.md

- [P2] .skilled/skills/sk-git/references/quick-reference.md:17 | 3 | The intro repeats the description and does not say when to use the sheet. | Replace it with: “Open this sheet when you need to choose or run a worktree, commit, or finish workflow.”
- [P2] .skilled/skills/sk-git/references/quick-reference.md:23 | 4 | The overview has no Purpose or When to Use headings. | Split the sentence into `### Purpose` with `Provide a one-page lookup for the worktree, commit, and finish workflows.` and `### When to Use` with `- Choose a workflow or look up its essential commands.`
- [P2] .skilled/skills/sk-git/references/quick-reference.md:109 | 9 | The command example contains a specific spec-folder path. | Replace `sk-git/028-crawlable-commit-history/003-contract-and-hook` with `<spec-folder>`.
- [P2] .skilled/skills/sk-git/references/quick-reference.md:117 | 9 | The search example embeds a specific packet identifier. | Replace `sk-git/028` with `<spec-folder>` in the grep pattern.
- [P2] .skilled/skills/sk-git/references/quick-reference.md:120 | 9 | The example uses a specific commit ID. | Replace `0009113` with `<commit-id>`.
- [P2] .skilled/skills/sk-git/references/quick-reference.md:426 | 9 | The bad-message example contains a numbered task ID. | Replace `TASK-123` with `TASK-<id>`.

### .skilled/skills/sk-git/references/remote-branch-policy.md

- [P2] .skilled/skills/sk-git/references/remote-branch-policy.md:23 | 4 | The overview has no Purpose or When to Use headings. | Add `### Purpose` before the paragraph. After it, add `### When to Use` with the bullet `- Before pushing to origin or deciding whether a branch belongs on the allowlist.`
- [P2] .skilled/skills/sk-git/references/remote-branch-policy.md:30 | 7 | The safety limitation paragraph combines separate fail-closed, fail-open, and remaining-gate behaviors. | Convert it to four bullets: missing script blocks non-allowlisted pushes until approval; an unsourceable script, missing validators, or internal error makes naming and permission concerns warn and fail open; mass-deletion, metadata, and test gates still run; naming and permission are advisory unless validation and hook installation are healthy.
- [P2] .skilled/skills/sk-git/references/remote-branch-policy.md:74 | 7 | The paragraph packs four distinct gate and logging behaviors. | Convert it to bullets covering the mass-deletion ceiling; metadata warnings and CI enforcement; blocking test failures; and `git-sync.sh` capturing, classifying, printing, and logging hook messages.
- [P2] .skilled/skills/sk-git/references/remote-branch-policy.md:87 | 9 | The paragraph explains the removed gate’s design history. | Replace it with: `` `SPECKIT_SKIP_PREPUSH_NAMING` has no effect on the current hook. Remove it from any environment configuration. ``
- [P2] .skilled/skills/sk-git/references/remote-branch-policy.md:106 | 7 | The paragraph packs publisher-record fields, two gate examples, and retry behavior. | Split it into bullets for the stale-metadata record and fix command, the mass-deletion record and audit log, and the rule that known gate blocks stop without retrying or becoming generic `pending` races.

### .skilled/skills/sk-git/references/shared-patterns.md

- [P2] .skilled/skills/sk-git/references/shared-patterns.md:18 | 3 | The intro repeats the document description and does not tell readers when to use the reference. | Replace it with: “Use this reference when a task spans worktree, commit, or finish workflows and needs a shared command or error pattern.”
- [P2] .skilled/skills/sk-git/references/shared-patterns.md:24 | 4 | The overview combines purpose and use without labeling either. | Split it into `### Purpose` with `Consolidate common patterns, commands, and conventions across the worktree, commit, and finish workflows.` and `### When to Use` with `- Use this as a quick lookup for branch naming, Git commands, Conventional Commits, or error handling patterns.`
- [P2] .skilled/skills/sk-git/references/shared-patterns.md:794 | 7 | The paragraph packs two failure modes and the scoped-staging cross-reference together. | Put the two risks in separate bullets: “The tree can be correct while ignored leftovers make the working directory look broken.” and “Git rename detection can give up at scale.” Keep the scoped-staging cross-reference as a separate closing sentence.
- [P2] .skilled/skills/sk-git/references/shared-patterns.md:794 | 9 | The reference to the `026 wave-4` reorg records a specific historical phase incident. | Replace the historical sentence with: `This section codifies rename-heavy merge verification. Scoped staging for that operation lives in [commit-workflows.md](./commit-workflows.md) §3 Step 7.`

### .skilled/skills/sk-git/references/unstick-dirty-worktree.md

- [P1] .skilled/skills/sk-git/references/unstick-dirty-worktree.md:115 | 5 | The stop-and-ask gate for an unclear tree appears after the commit and push phases it governs. | Move line 115 to after the Phase 3 validation at line 78 and before Phase 4.
- [P2] .skilled/skills/sk-git/references/unstick-dirty-worktree.md:24 | 4 | The overview puts Core Principle before When to Use and has no Purpose section. | Insert `### Purpose` with `Restore files missing from a stale checkout while preserving intended local changes.` before the existing When to Use block, then move that block before Core Principle.
- [P2] .skilled/skills/sk-git/references/unstick-dirty-worktree.md:187 | 9 | The related-resources bullet contains a specific spec-folder path. | Replace the line with: `- Mass-deletion guard: \`.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh\`.`
### .skilled/skills/sk-git/references/worktree-workflows.md

- [P2] .skilled/skills/sk-git/references/worktree-workflows.md:19 | 3 | The intro repeats the frontmatter description instead of telling readers when to open the file or what its workflow helps them do. | Replace with: `Follow the numbered steps to create a named or detached worktree, prepare it, and check its baseline.`
- [P2] .skilled/skills/sk-git/references/worktree-workflows.md:25 | 4 | The overview starts with an unlabeled description and core principle; it has no Purpose or When to Use sections. | Replace lines 25–27 with:
  ```markdown
  ### Purpose

  Git worktrees create isolated working directories sharing the same repository database. Each worktree can have a different branch checked out, allowing parallel work without context switching.

  ### When to Use

  - After the user explicitly chooses "Create a git worktree" (Option A).
  - When parallel work needs separate branches in isolated directories.

  ### Core Principle

  Systematic directory selection + safety verification = reliable isolation
  ```
- [P1] .skilled/skills/sk-git/references/worktree-workflows.md:522 | 5 | The large-reorg restriction appears after the complete workflow and examples, which include setup and baseline steps; readers may run those steps in a bare reorg worktree before seeing the restriction. | Insert after line 67 and before Step 1: `For a large rename/reorg, use the worktree for file/rename ops only; defer all toolchain + DB work to main after merge. See §8b.`
- [P2] .skilled/skills/sk-git/references/worktree-workflows.md:58 | 7 | One paragraph combines branch and directory grammar, counter rules, and lifecycle behavior. | Reformat as:
  ```markdown
  **Branch namespace**:
  - Every named feature worktree uses the `worktrees/{NNN}-{slug}` branch and the `.worktrees/{NNN}-{slug}` directory (see Naming Convention below).
  - `{NNN}` is a 3-digit zero-padded per-namespace counter (001..999) issued by the allocator; `worktrees/` and `branches/` each number independently, strictly sequential, never skipped or reused.
  - The lifecycle strategy only changes *how the branch is managed after creation*, not how it is named.
  ```
- [P2] .skilled/skills/sk-git/references/worktree-workflows.md:159 | 7 | The allocator explanation packs the lock, scan sources, safety guarantee, and manual-allocation prohibition into one paragraph. | Split after “which:” into bullets for the shared common git-dir lock and the sources used to seed each namespace’s maximum; keep “so a partial scan can never reissue a live number” and “Never hand-compute `{NNN}`” as the concluding sentence.
- [P2] .skilled/skills/sk-git/references/worktree-workflows.md:535 | 7 | The paragraph describes two separate failure mechanisms for wholesale dependency links, then adds the safe-sharing conditions. | Turn the workspace self-link and compiled-entry-point explanations into two bullets; keep the safe-sharing conditions as the paragraph after the list.
- [P2] .skilled/skills/sk-git/references/worktree-workflows.md:626 | 7 | The paragraph combines OpenCode 2’s ancestor-folder loading, its effect on worktree plugin changes, and OpenCode 1’s different behavior. | Split into a cause sentence followed by two bullets: OpenCode 2 uses the main checkout’s plugin code; OpenCode 1 stops at the worktree root and is unaffected. Preserve the version and date observation.
- [P2] .skilled/skills/sk-git/references/worktree-workflows.md:657 | 7 | The paragraph combines the wholesale-link cause, its two consequences, the reason for running generators on `main`, and the deep-loop exception. | Make the two consequences separate bullets, then keep the `main` rationale and deep-loop provisioner description as separate paragraphs.
- [P2] .skilled/skills/sk-git/references/worktree-workflows.md:518 | 10 | The `8b.` H2 suffix triggers the validator’s `render_h2_numbering` warning. | Keep the heading unchanged while the inbound `#8b-large-reorg-in-a-worktree---caveats` reference is frozen.
