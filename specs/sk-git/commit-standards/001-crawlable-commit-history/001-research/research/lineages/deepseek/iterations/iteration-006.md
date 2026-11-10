---
title: "Iteration 6: Conventions already in the world"
trigger_phrases: []
---
# Iteration 6: Conventions already in the world

## Focus

Assess, from local knowledge only: Conventional Commits, Gerrit Change-Id, Linux kernel trailers, Jujutsu change ids, GitLab/GitHub issue references, and Fossil — what each solves, what it costs, whether it transfers here — and say plainly which are worse than what sk-git already has.

## What was read

Local grounding (no network fetches):

- `.opencode/skills/sk-git/SKILL.md:333,356,375-495,555` — the repository's Conventional Commits implementation: ALWAYS rule 1, the type priority list, the scope order, the summary construction, the body contract.
- `.opencode/scripts/git-hooks/commit-msg:72` — the 13-type regex: `build|chore|ci|docs|feat|fix|merge|perf|refactor|release|revert|style|test`.
- `.opencode/skills/sk-git/assets/commit-message-template.md:149` and `.opencode/skills/sk-git/assets/pr-template.md:542` — the only external specification the repository references (Conventional Commits).
- `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md`, `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/conventional-commit-from-diff.md` — local workflow/playbook adoptions.
- No local document describes Gerrit, Jujutsu, or Fossil; their analysis below is local knowledge by the brief's instruction.

## What was measured

```text
$ rg -il "gerrit|change-id|jujutsu|fossil|conventional commits" .opencode/skills --glob '*.md'
-> only Conventional Commits material (pr-template, commit-message-template, SKILL.md, README,
   playbooks, references); zero local Gerrit/jj/Fossil documents.

$ grep -o "(build|chore|...|test)" .opencode/scripts/git-hooks/commit-msg
-> (build|chore|ci|docs|feat|fix|merge|perf|refactor|release|revert|style|test)
```

## Findings

1. **Conventional Commits is the base layer and already stricter here than upstream.** The hook requires a type *and* a scope (upstream CC allows scope to be omitted), blocks vague summaries, and caps length — this is a reinforced CC, not a bare one. CC solves subject parseability for changelogs/semver; it deliberately solves nothing about identity. The new grammar is additive: trailer keys do not disturb `type(scope): summary`. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:72] [SOURCE: file:.opencode/skills/sk-git/SKILL.md:375-495]
2. **Gerrit Change-Id is the closest precedent to the requirement "the identifier must survive git."** A `commit-msg` hook stamps `Change-Id: I<40-hex>` into the footer; the id survives amend/rebase so Gerrit can address the *change* across patchsets, while the commit hash changes freely. Cost: it is a review-server identity, minted from the first commit's content, opaque to humans, and it expects duplicate ids when a cherry-pick copies it (same logical change, two commits). That last property is a warning for a *commit* address: Gerrit's id answers "which change under review", not "which commit". The stamping mechanism and survival property transfer; the semantics do not. [SOURCE: local knowledge]
3. **Linux kernel trailers: the provenance pattern transfers; the hash-based `Fixes:` reference is worse for this repository.** `Signed-off-by`/`Acked-by`/`Reviewed-by` chains are exactly the trailer discipline this grammar extends, and `Fixes: <12-hex> ("subject")` is a real-world commit-to-commit citation. But that citation is a hash prefix: it dangles under any rewrite, and the kernel's answer is "never rewrite", which this packet explicitly rejects. A stable `Commit-Id:` is strictly better than a short hash on the survive-git axis. [SOURCE: local knowledge]
4. **Jujutsu's change-id model validates the design but its storage does not transfer.** jj separates the stable change id (survives rewrites/amend) from the commit id (content hash). But the change id lives in jj's own store, invisible to plain git consumers and absent from the commit message; in a git-message-only world the trailer is the only survivable carrier. The model says: keep two identities; the environment says: both must be text. [SOURCE: local knowledge]
5. **GitHub/GitLab issue references are complementary, not competing.** `#123`, `Closes #123` and platform auto-links solve commit↔issue linking at zero infra cost; they say nothing about commits and do not survive as repository-local addressable data. `Refs:` (already whitelisted) is where they belong. [SOURCE: local knowledge] [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:117]
6. **Fossil is the pure opposite stance and is worse here.** Content-addressed artifact ids mean no minting, no collisions, absolute immutability — and no history rewrite at all, because rewriting produces different artifacts. A repository that has decided to rewrite 9,108 commits has already traded that model away. [SOURCE: local knowledge]
7. **Nothing in the prior art provides packet-like addressing.** Gerrit addresses review changes, jj addresses change sets, kernel trailers chain provenance, and platform references address issues; none addresses "the work of packet `sk-git/028`, phase 001". The packet-derived key (iteration 4) has no direct prior art to borrow from — only the *mechanisms* (trailer stamping, id survival, provenance keys) transfer. [SOURCE: local knowledge]
8. **Plainly worse than what sk-git already has (if adopted alone):** a bare `feat: ...` CC set without scope discipline (loses subsystem navigation); any hash-prefix reference to commits (`Fixes: <hash>` style — breaks under the planned rewrite); date-based ids (redundant with committer date, timezone races); content-derived ids as the primary address (redefine the question). None of these should displace the strict CC layer the hook already enforces. [SOURCE: local knowledge] [SOURCE: iterations 4-5]

## Recommendations

1. **[implementable today]** Extend, do not fork: keep `type(scope): summary` and the 13-type list as canonical, and add the trailer taxonomy on top. This is the repo's existing CC± implementation, already enforced machine-wide.
2. **[implementable today]** Copy Gerrit's mechanism, not its semantics: a hook-stamped, message-embedded id that survives rewrites; but define its authority as "packet address" and record the duplicate-on-copy caveat (iteration 4's cherry-pick policy).
3. **[needs a contract decision]** Keep `Refs:` for issue/PR/URL references (platform-style) and use `Spec:` for packet references; do not overload one key for both roles — today's 349 Refs lines are 306 spec paths + 51 free-text, an ambiguity the split removes.
4. **[implementable today]** Treat the kernel trailer set as precedent for whitelisting machine keys in the hook (`Signed-off-by` etc. already are); the new keys join the same family.
5. **[needs a contract decision]** Do not build Change-Id-style content-derived minting; the packet allocator (iteration 4) gives human-legible, packet-grouped ids, which is the operator's stated goal.

## What this iteration could not settle

- Nothing external is verifiable offline; all six assessments are local knowledge and are labeled as such.
- Whether the operator wants an issue-reference convention strengthened (`Closes #N`) alongside `Refs:` — a policy question for phase 002.
