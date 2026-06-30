# Iteration 001 - Correctness

## Dimension

Correctness: compare the packet's claimed file scope with the actual implementation diff and status.

## Review Actions

- Ran `git diff --name-status 3c170c46de -- .opencode/skills`.
- Ran `git status --short .opencode/skills`.
- Compared the real file set with the 030 wrapper docs.

## Findings

### F-001 - P1 - Actual skill diff is larger than the packet's 18-file release claim

Hypothesis confirmed. The implementation summary says sk-doc passed on "all 18 files" and that agents touched "exactly the 18 scoped files" at `.opencode/specs/design/008-sk-design-parent/030-design-context-adoption/implementation-summary.md:95` and `.opencode/specs/design/008-sk-design-parent/030-design-context-adoption/implementation-summary.md:99`. The task packet repeats "confirm scope (18 files only)" at `.opencode/specs/design/008-sk-design-parent/030-design-context-adoption/tasks.md:74`.

The command evidence contradicts that: `git diff --name-only 3c170c46de -- .opencode/skills` returned 21 tracked modified files, and `git ls-files --others --exclude-standard .opencode/skills` returned 9 untracked files. Several modified files are not listed in the 18-file adoption summary, including `design-audit/references/anti_patterns_production.md`, `design-interface/references/design-process/real_ui_loop.md`, `design-motion/references/advanced_craft.md`, and `system-spec-kit/changelog/v3.7.0.0.md`.

Fix: reconcile the packet scope with the real diff/status surface, or separate unrelated dirty files before making release claims.

Review verdict: CONDITIONAL
