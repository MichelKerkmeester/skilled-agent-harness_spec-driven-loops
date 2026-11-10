# Iteration 005: PR-state efficiency gates

## Focus

Angle 5 — Q5 PR-state efficiency gates: how portable and configurable are the content-hash dedup, the minimum-evidence gate and the depth alias for a repository with no remote, a monorepo or other file naming?

## Actions Taken

- Read the review skill’s PR-state gate section and the content-hash dedup reference.
- Searched the review-skill package for the gate variables and signature fields. Matches were in the skill, README, playbook, changelog, and reference docs; the skill describes the gates as reviewer-applied guidance.
- Checked the findings registry for an existing Q5 answer and confirmed Q5 is still listed as unanswered in the strategy.
- Did not run a live review scenario. Runtime behavior for a repository without an origin remote or with custom path names remains unverified.

## Findings

1. **INFERRED — M-1 requires an `origin` remote as documented.** The cache namespace hashes the output of `git remote get-url origin`; no fallback is specified for a repository without that remote. A live no-origin review would confirm whether another layer supplies a fallback. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:503] `sha256(git remote get-url origin).slice(0, 12)`

2. **DERIVED — M-1 is repository-scoped rather than package-scoped.** The signature hashes the full base-ref-to-HEAD diff, while the cache key uses the origin URL. Packages in one monorepo therefore share a cache namespace, and unrelated package changes can invalidate a package-scoped review. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:496] `sha256(git diff <base-ref>...HEAD)` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:503] `sha256(git remote get-url origin).slice(0, 12)`

3. **OBSERVED — M-2 makes the line threshold configurable but keeps path protection fixed.** `SK_CODE_REVIEW_MIN_CHANGED_LINES` enables the threshold, with zero as the disabled default. The sensitive-path list names common patterns, but the reviewed docs do not define a repository-specific pattern extension; alternate names may therefore fall outside the skip protection. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:522] `# >0 enables; default 0 = disabled` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:530] `NEVER skip when diff touches` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:534] `Security / Authentication / Authorization`

4. **OBSERVED — the depth alias is configurable, but advisory.** It resolves environment over config over default and is read by the reviewer in-loop. `lite` maps to M-2 and preserves the stated ALWAYS, security/correctness, and severity floors. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:552] `reviewer reads and applies in-loop` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:556] `it NEVER lowers the ALWAYS tier`

5. **OBSERVED — carried-forward question state conflicts with the strategy.** The strategy currently marks Q2–Q4 answered, while the dispatch context carries them forward as open. This iteration leaves reducer-owned state unchanged. [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-strategy.md:28] `- [x] Q2 UNKNOWN-surface path`

## Questions Answered

- Q5 PR-state efficiency gates: how portable and configurable are the content-hash dedup, the minimum-evidence gate and the depth alias for a repository with no remote, a monorepo or other file naming?
- Summary: M-1 is portable for a conventional PR with an origin remote, but the documented key has no no-remote fallback or package scoping. M-2 can tune its numeric cutoff, not its sensitive-path taxonomy. The depth alias is environment/configurable but depends on the reviewer honoring it.

## Questions Remaining

- Q6–Q10 remain unchecked in the strategy.
- Q2–Q4 are carried forward as open by the dispatch context despite being checked in the strategy; that state discrepancy was not reconciled here.
- Whether the live review runtime follows the documented gates for a no-remote repository or nonstandard sensitive-path naming remains UNKNOWN; confirming it requires a live scenario run.

## Next Focus

Angle 6: Review and quality boundary (Q6).
