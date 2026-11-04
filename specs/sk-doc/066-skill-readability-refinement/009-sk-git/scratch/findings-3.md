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