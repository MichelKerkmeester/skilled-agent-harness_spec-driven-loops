---
title: Deep Research Strategy - git hooks and sk-git scripts inventory (proof lineage)
description: Iterative research tracking for the read-only proof run after the run-failure adjustments.
trigger_phrases:
  - "proof run after run-failure adjustments"
  - "git hook files inventory"
  - "sk-git scripts inventory"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Git Hooks and sk-git Scripts Inventory (proof lineage)

## 1. OVERVIEW

Fan-out lineage `proof` of session `fanout-proof-1789123034382-9ptgi0`. Forced depth: 1 iteration, stop policy `max-iterations` (convergence is telemetry only). The pass is read-only apart from the artifacts it writes inside this lineage directory.

## 2. TOPIC

Proof run after the run-failure adjustments: in one iteration, read `.opencode/scripts/git-hooks/README.md` and `.opencode/skills/sk-git/scripts/commit-id-naming.sh`, list the five hook files and the three sk-git scripts by name with one line each on what they guard, and write the iteration file.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1 (angle 1): Which five hook files and which three sk-git scripts exist today, and what does each guard? -- ANSWERED (iteration 1; five README-declared hooks plus two installed extras named, three executable sk-git scripts named, both README drifts recorded)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing or proposing any behavior fix (documentation drift notes only).
- Network fetching of any kind.
- Running any git command that writes, or any installer or validator that writes.
- Writing anywhere outside this lineage directory, including the packet root and the repository tooling.
- Reproducing hook behavior; this pass is a read-and-list proof, not a failure hunt.

---

## 5. STOP CONDITIONS

- Stop when iteration 1 completes. Convergence before the cap is telemetry only; the runner validates exactly one iteration file and record plus a synthesis record with stopReason `maxIterationsReached`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1 (iteration 1): The five README-declared hook files are `pre-commit`, `post-commit`, `post-merge`, `post-rewrite` and `pre-push`. Two further installed hooks exist on disk (`commit-msg`, `prepare-commit-msg`) and the installer's glob installs them, while the README topology and the installer header omit them. The three executable sk-git scripts are `worktree-naming.sh`, `commit-id-naming.sh` and `stamp-branch.sh`, while the scripts README names only `worktree-naming.sh` and the non-executable `migrate-legacy-branch-names.sh`. Both gaps are documentation-only defects.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the two named sources in full gave every guard one-liner directly from the source text instead of from recollection.
- Listing both directories alongside the READMEs exposed the count drift (five declared versus seven installed hooks, two declared versus four present shell scripts) without any execution.
- Marking the installer inference DERIVED kept the pass honest: the install loop and the matcher were read, but the installer itself was never executed.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Nothing failed. The pass was read-only and every claim in the iteration traces to a file line that was read.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- "The live hook set is verifiable from the README alone": the README topology is not the installed set, so the listing uses the folder contents and the installer matcher instead.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

None. The single iteration answered Q1 and synthesis is complete. The three documentation adjustments are recorded in `research.md` for the packet owner.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Pointers only (no source bodies):

- Hook sources: `.opencode/scripts/git-hooks/` (`pre-commit`, `prepare-commit-msg`, `commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, `pre-push` plus `lib/`).
- Installer: `.opencode/scripts/install-git-hooks.sh` (hook eligibility at 43-48, install loop at 131-147).
- sk-git scripts: `.opencode/skills/sk-git/scripts/` (`worktree-naming.sh`, `commit-id-naming.sh`, `stamp-branch.sh`, `migrate-legacy-branch-names.sh`, `remote-branch-allowlist.txt`).
- Read-only sources named by the brief: `.opencode/scripts/git-hooks/README.md`, `.opencode/skills/sk-git/scripts/commit-id-naming.sh`.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 1
- Convergence threshold: 0.05 (telemetry only; stopPolicy = max-iterations)
- Per-iteration budget: 12 tool calls, 20 minutes
- Progressive synthesis: true
- research.md ownership: this lineage (workflow-owned canonical synthesis output)
- Machine-owned sections: reducer subprocess disabled for this detached lineage; this process maintains them inline
- Canonical pause sentinel: `.deep-research-pause` (unused)
- Current generation: 1
- Started: 2026-09-11T10:39:10Z
