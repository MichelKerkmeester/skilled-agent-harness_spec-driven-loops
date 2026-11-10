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