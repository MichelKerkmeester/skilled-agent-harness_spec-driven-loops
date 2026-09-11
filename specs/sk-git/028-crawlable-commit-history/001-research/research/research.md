---
title: "Research: Crawlable Commit History"
description: "Conductor synthesis over ten DeepSeek V4.1 Flash iterations: keep the subject grammar, make the final trailer block the commit's address, retrofit 9,100 commits from a measured mapping cascade with filter-repo on a mirror."
trigger_phrases:
  - "crawlable commit research"
  - "commit-id trailer"
  - "commit identifier minting"
  - "retrofit mapping cascade"
  - "filter-repo commit callback"
importance_tier: "important"
contextType: "research"
---
# Research: Crawlable Commit History

Ten iterations ran on one cli-pi lineage (DeepSeek V4.1 Flash, max thinking, stop policy max-iterations). The lineage's own progressive synthesis is `lineages/deepseek/research.md`, and each angle's full evidence is in `lineages/deepseek/iterations/`. This document is the conductor's reduction: what was verified independently, what the evidence supports, and what phase 002 must decide.

---

## 1. WHAT THE CONDUCTOR VERIFIED

Every load-bearing number below was re-measured in this session against `skilled/v4.0.0.0`, not taken from the lineage's report.

| Claim from the lineage | Conductor measurement | Verdict |
|---|---|---|
| `Refs:` appears in about 349 messages but git extracts only 119 as trailers | 357 literal lines, 119 extracted with `%(trailers:key=Refs)` | Confirmed, count drifted with new commits |
| `Spec:` appears 81 times, 2 extractable | 81 and 2 | Confirmed |
| The packet query `028` AND `sk-git` returns 2 commits | 2 | Confirmed |
| A trailer-block `Commit-Id:` passes today's hook at zero subject cost | hook exit 0 on a constructed message | Confirmed |
| A numeric scope is hard-blocked | hook exit 1 on `feat(028): ...` | Confirmed |
| 11 signed commits would lose signatures | 11 non-`N` signature statuses | Confirmed |
| Zero 10-hex prefix collisions among commits | 0 duplicates | Confirmed |
| Citations in iterations 1 to 3 resolve | SKILL.md:405, commit-msg:72 and the global `core.hooksPath` matched | Confirmed |

Corrections the lineage made to the brief, all confirmed: 149 tags rather than 5, 28 worktrees rather than 20, 60 branches rather than 59, and a commit count that moved from 9,106 to 9,112 while the run was measuring. The retrofit baseline has to be pinned by SHA with writers stopped.

---

## 2. WHAT THE EVIDENCE SUPPORTS

**Keep the subject grammar. Make the final trailer block the address.** Scope placement is blocked by the hook and forbidden by the skill. Subject placement passes the hook but spends 12 to 17 characters of an 80-character target that a third of history already exceeds. A final contiguous trailer paragraph collides with nothing, is the only place git's structural extraction reads, and is plain text for `git log --grep` and GitHub search alike.

**The candidate grammar** (lineage section S2, reproduced so phase 002 can vote on it):

```text
type(scope): imperative summary

Context: <problem, at most 40 words>

Changes:
- <observable change>

Verification:
- `<command>` -> <result>

Spec: sk-git/028-crawlable-commit-history
Phase: 001-research
Commit-Id: sk-git-028-0003
Refs: specs/sk-git/028-crawlable-commit-history
```

**The identifier** is packet-derived and hyphen-only, `sk-git-028-0003`, minted by the same lock-and-high-water allocator sk-git already uses for worktree numbers. It survives rebase, amend and a filter-repo rewrite because it is message text. It does not survive copy: cherry-pick duplicates it, and 1,002 commits already share a subject with another commit. That is a policy decision, not a design flaw.

**The retrofit mapping** resolves 6,036 of 9,111 commits to a packet through a four-rule cascade (trailer path, numeric scope plus matching touched packet, single touched packet, dominant touched packet) and assigns the remaining 3,075 to a deterministic `misc` namespace. Numeric scopes alone cannot resolve a track: the number 80 spans 13 tracks.

**The rewrite** runs `git filter-repo --commit-callback` on a mirror clone. Messages, authors and dates survive. Eleven signatures and 98 annotated-tag signatures do not. The emitted commit map is the join key for the citation remap: 1,700 prefix citations and 294 full-SHA citations across `specs/`, with 5,560 decoy tokens (epoch timestamps, digests) that must stay byte-identical. Commit messages themselves cite 551 hashes in 460 commits, which a first pass cannot remap because the new SHAs do not exist yet.

**Rejected on evidence:** `git notes` and `git replace` (not searched by `--grep`, not pushed by default, not rendered by GitHub), pickaxe (searches diffs), the spec-kit trigger index (indexes documents only), hash-derived and date-derived identifiers.

---

## 3. RANKED RECOMMENDATIONS

Implementable today, in order:

1. Extend `TRAILER_RE` in the commit-msg hook with `Spec`, `Phase` and `Commit-Id`, and add the hook's first test file. [implementable today]
2. Add a `prepare-commit-msg` stamper that appends the trailer block through `git interpret-trailers` to a fresh final paragraph, is idempotent, and preserves an existing id on amend, rebase and cherry-pick. It must detect the repository, because the global hooks path runs it for every repository on the machine. [implementable today]
3. Add a commit-id allocator beside `worktree-naming.sh` with the same lock and high-water mechanics and a mirrored test. [implementable today]
4. Update SKILL.md section 6, the template asset, the commit workflow step 5, the quick-reference queries and one commit-formation playbook scenario. [implementable today]
5. Write the mapping script that produces the frozen old-SHA to packet-and-id table from the cascade, with the 41 dominance ties listed for adjudication. [implementable today]
6. Write the citation remapper against the filter-repo commit map with a dry run and a residue scan. [implementable today]

Needs a contract decision first (phase 002):

7. The exact key set, the placement law and the identifier shape.
8. Which commits receive an id: merges and git-generated subjects included or exempt.
9. Cherry-pick and squash policy: strip and re-mint, or accept duplicates.
10. One `Spec:` per touched packet, or one dominant owner.
11. What happens to the 551 hash citations inside commit messages: a second rewrite pass, or accepted dangling.
12. Enforcement rollout: warn first, then block.
13. Whether the stamper installs machine-wide like the other hooks, or repository-scoped.
14. Acceptance of signature loss on 11 commits and 98 tags.

---

## 4. WHAT PHASE 002 MUST DO

Take decisions 7 to 14 above into a decision record, with a second model lens on the grammar before the operator approves it. Two answers the conductor already leans toward, stated so the second lens can disagree: keep the four-key block as proposed, and strip-and-re-mint on cherry-pick using `git patch-id` to detect the copy.

---

## 5. RUN RECORD

- Lineage: `lineages/deepseek`, session `fanout-deepseek-1789111510857-0nqzvk`
- Iterations: 10 of 10, stop reason `maxIterationsReached`, 37 minutes wall clock
- Runner verdict: failed on write containment after the synthesis completed, because the conductor edited planning documents outside the lineage while it ran. The research artifacts were not touched by the revert. Every later dispatch in this packet runs with the repository untouched until it settles.
