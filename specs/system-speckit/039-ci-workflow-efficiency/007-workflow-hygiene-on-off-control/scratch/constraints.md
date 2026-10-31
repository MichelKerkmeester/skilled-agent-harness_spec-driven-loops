# Constraints the passes must respect

Line numbers are those read on the phase's start commit, before any edit of this phase.

CONSTRAINT message-contract: `001-research/research/research.md:189` reads "Never disable message-contract while its ruleset context is required." The switch variable for that workflow exists and the workflows README states the prohibition.

CONSTRAINT skipped-reports-success: a job skipped by its `if:` reports Success, so a switched-off job that a ruleset requires stops blocking instead of failing. Only `message-contract.yml` is required today, which is why its group is documented as never-off. Protected-by-function workflows follow `.skilled/skills/sk-code/sk-code-ci/references/protected-set.md`.

CONSTRAINT job-conditions: four job-level `if:` sites exist, and a switch is ANDed onto the three that stay, never substituted for them. Exact text from `grep -n '^    if:' .github/workflows/*.yml`:
- `dependabot-auto-merge.yml:18`: `if: github.event.pull_request.user.login == 'dependabot[bot]'` (moves to the `metadata` job in the split; carries no switch)
- `skill-doc-frontmatter.yml:62`: `if: github.event_name == 'pull_request'`
- `trigger-index-rebuild.yml:33`: `if: "${{ !endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci') }}"`
- `trigger-index-rebuild.yml:188`: `if: needs.rebuild.outputs.committed == 'true'`

CONSTRAINT loop-guard: the comment above `trigger-index-rebuild.yml:33` reads "The commit carries the skip token, so its push starts no run at all. This guard is the fallback for any run GitHub creates anyway: the trailer the commit step adds must END the message, since a commit that merely quotes it in its body still needs its own rebuild. Suffix matching errs toward running, and a fail-open costs at most one run that finds nothing to commit." Replacing the condition instead of ANDing the switch onto it would let the rebuild run on its own commit.
