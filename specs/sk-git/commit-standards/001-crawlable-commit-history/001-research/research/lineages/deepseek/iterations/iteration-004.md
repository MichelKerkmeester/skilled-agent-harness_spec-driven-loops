---
title: "Iteration 4: Identifier design"
trigger_phrases: []
---
# Iteration 4: Identifier design

## Focus

Design and price five identifier candidates — repository-wide ordinal, per-track counter, packet-derived key, date-based key, content-derived key — for minting (against the worktree allocator precedent), placement and subject-budget cost, and behavior under rebase, cherry-pick, squash, revert, and parallel worktrees. Construct one real message per candidate and run each through the current hook regexes.

## What was read

- `.opencode/skills/sk-git/scripts/worktree-naming.sh:8-32,80-82,209-247,250-309` — the locked allocator precedent: per-namespace high-water file (`$common_dir/$ns-number.highwater`), lock directory (`$common_dir/worktree-number.lock`) with stale-lock reclaim, max scanned from high-water plus every matching ref, `next = max-in-use + 1`, gaps never back-filled, ceiling 999, allocate-only-when-locked.
- `.opencode/skills/sk-git/SKILL.md:400-412` — scope/task-identifier prohibitions and the process-metadata-to-body rule (iteration 1).
- `.opencode/scripts/git-hooks/commit-msg:72,79-81,110-113` — the regexes the candidates must clear (iteration 1).

## What was measured

```text
$ for each candidate message: bash .opencode/scripts/git-hooks/commit-msg <file>
c1-repo-ordinal.txt     "Commit-Id: 000123"            -> exit 0
c2-per-track.txt        "Commit-Id: sk-git-003"        -> exit 0
c3-packet-slash.txt     "Commit-Id: sk-git/028-003"    -> exit 0
c3b-packet-hyphen.txt   "Commit-Id: sk-git-028-0003"   -> exit 0
c4-date.txt             "Commit-Id: 20260911-0001"     -> exit 0
c5-content.txt          "Commit-Id: pid-4f2a9c1e8b30"  -> exit 0
c6-subject-id.txt       "feat(sk-git): implement 028/003 identifier minting" -> exit 0
c7-numeric-scope.txt    "feat(028): add crawlable commit identifiers"
  -> exit 1: Scope '028' is numeric-only; use the stable owning subsystem.
c8-packet-scope.txt     "feat(sk-git-028): add crawlable commit identifiers" -> exit 0
c9-long-subject.txt     subject = 117 chars
  -> exit 1: Subject is 117 characters; maximum is 100.

$ printf '<subject + final block Commit-Id:/Refs:>' | git interpret-trailers --parse
Commit-Id: 000123
Refs: specs/sk-git/028-crawlable-commit-history      # final contiguous block parses cleanly

$ message text is not unique in this history:
duplicated distinct subjects: 413 | commits sharing a duplicated subject: 1002

$ git show 2d356893a8 | git patch-id --stable
90bb5766000c140d335296d8e7b184acb03fb8b0 2d356893a847d5facc8c1ac2a632fcfbc7b02eae
```

## Findings

1. **Trailer placement is the only zero-budget placement that clears the hook.** All five candidate value shapes (`000123`, `sk-git-003`, `sk-git/028-003`, `sk-git-028-0003`, `20260911-0001`, `pid-…`) pass unchanged inside a final contiguous trailer block; git's own parser extracts them (iteration 3). [SOURCE: command:hook runs c1-c5]
2. **Subject placement also passes the hook today but contradicts the documented contract and spends the budget.** `feat(sk-git): implement 028/003 identifier minting` exits 0 — the hook has no rule against a number in the summary — yet SKILL.md:402-404 requires the summary to name behavior, not work process, and the identifier prefix costs ~12-17 character positions against the 80/100 cap. The 117-char subject `c9` shows the cap biting at realistic lengths. [SOURCE: command:hook c6 → 0, c9 → 1] [SOURCE: file:.opencode/skills/sk-git/SKILL.md:402-412]
3. **Scope placement splits into three outcomes, all bad.** Numeric scope `(028)` is a hard block (c7, exit 1); hyphenated packet scope `(sk-git-028)` passes the hook but is exactly what SKILL.md:400-401 forbids ("never a packet, phase, task, or other numeric-only identifier"); slash forms `(sk-git/028)` fail `SUBJECT_RE` outright. [SOURCE: command:hook c7 → 1; c8 → 0] [SOURCE: file:.opencode/skills/sk-git/SKILL.md:400-401]
4. **The minting precedent already exists and is lock-based.** `worktree-naming.sh` allocates numbers from a high-water file plus a ref scan under a lock directory in the shared Git dir, `next = max-in-use + 1`, never back-filling gaps, ceiling 999. A commit identifier in the same shape needs: a high-water source (for the retrofit: the frozen rewrite map; for forward commits: scanned messages or the stored counter) and the same lock for parallel worktrees. [SOURCE: file:.opencode/skills/sk-git/scripts/worktree-naming.sh:8-32,80-82,209-247,250-309]
5. **Message text is demonstrably not unique: 1,002 commits share one of 413 duplicated subjects.** Any message-embedded identifier inherits this property under cherry-pick/squash/duplicate work unless copy operations strip or re-mint it. A hash-derived id would dodge duplication only by changing on every rewrite — the anti-pattern the brief names. [SOURCE: command:uniq -d over %s → 413 / 1002]
6. **Per-candidate survival table:**

| Candidate | Minting (no-collision) | Placement cost | rebase | cherry-pick | squash | amend | revert | parallel worktrees |
|---|---|---|---|---|---|---|---|---|
| Repo ordinal `000123` | locked counter, 6-digit | 0 in trailer | text stable | **duplicates** | collapses unless preserved | stable if kept | quoted, not owned | fine with lock |
| Per-track `sk-git-003` | locked per-track counter | 0 in trailer | stable | duplicates | collapses | stable | quoted | fine with lock; "track" undefined as an object |
| Packet-derived `sk-git-028-0003` | locked per-packet counter | 0 in trailer | stable, most spec-like | duplicates | collapses | stable | quoted | fine with lock; needs a packet for every commit |
| Date-based `20260911-0001` | per-day locked counter | 0 in trailer | text stable, but the minting day comes from committer date, which **changes under rebase** | duplicates | collapses | stable | quoted | races across day/timezone boundaries |
| Content-derived `pid-4f2a…` | none — deterministic from `git patch-id --stable` | 0 in trailer | **stable if content identical** | **stable (same patch)** — answers "which change", not "which commit" | changes (new patch) | changes | new patch, new id | no lock needed; merges/empty commits have no patch id |
| Hash-derived (e.g. first 10 of original SHA) | none | — | **changes with the hash** | changes | changes | changes | changes | — (rejected by the brief's premise) |

7. **No candidate is unique at all times and cheap at all times; choose which failure to accept.** Message-text ids are stable under hash change (the brief's bar) but duplicate under cherry-pick; content ids never duplicate by accident but redefine the address as "patch" and cover no merge commits; ordinals need a lock but are simple to enforce and project the packet-free "crawlable number" the operator asked for. [SOURCE: findings 4-6]
8. **The packet-derived key is the best match to the operator's stated analogy** — "almost like spec folders with numbers" — provided a fallback namespace exists for commits that belong to no packet (repo-wide chores, cross-packet fixes). The hyphen form (`sk-git-028-0003`) survives tokenization better than the slash form. [SOURCE: dispatch brief Task] [SOURCE: iteration 3 finding 9]
9. **Two minting regimes must coexist and they have different guarantees.** The retrofit is a single-writer enumeration over 9,108 frozen commits (deterministic, reproducible from the old→new map, no lock needed). Forward minting is many-writer (28 worktrees) and needs the `worktree-naming.sh` lock + high-water pattern, seeded from the retrofit's terminal counter. [SOURCE: iterations 2-4]
10. **The retrofit's rewrite cannot be re-run without freezing the identifier map.** Because the identifier is minted from an enumeration order that depends on the pre-rewrite commit graph, a second rewrite must reuse the recorded map; otherwise ids shift and old ids dangle. The map (old SHA → new SHA → id) is the durable artifact. [SOURCE: inference from findings 6-7]

## Recommendations

1. **[needs a contract decision]** Adopt the packet-derived key as the primary identifier — `Commit-Id: sk-git-028-0003`, zero subject cost, literal, spec-like — with a reserved fallback namespace (e.g. `misc-NNNN` or a repo prefix) for commits that map to no packet. Ranked above ordinal (loses the packet context), per-track (no such first-class object), date-based (redundant with committer date), and content-derived (changes the question being answered).
2. **[implementable today]** Mint forward ids with the exact `worktree-naming.sh` pattern — lock directory + high-water file in the common Git dir, `next = max + 1`, no back-fill — seeded at the retrofit's terminal values; this is proven on the same 28-worktree contention surface.
3. **[needs a contract decision]** Fix the cherry-pick/squash policy now: either strip `Commit-Id:` on copy and re-mint, or accept duplicates and define the id as "change lineage" rather than a unique commit address. 1,002 duplicated subjects show the default is duplication.
4. **[implementable today]** Keep the id token ≤ 24 characters, hyphen-only (no `/`, no `#`), so `--grep --fixed-strings` and GitHub token search both hit it and no hook charset rule is disturbed.
5. **[needs a contract decision]** Record the retrofit map (old SHA → new SHA → id, frozen) as the durable artifact; a re-run of the rewrite without it is unsound.
6. **[implementable today]** Keep content-derived `patch-id` as a secondary correlation key only (rebase/cherry-pick detection, duplicate-on-copy detection); it is measured and available but must not be the address.

## What this iteration could not settle

- Whether "track" is a real namespace for the operator (the scope taxonomy has 463 distinct historical scopes and no authoritative track registry; the packet grammar has tracks at the `specs/<track>/` level).
- The exact fallback namespace spelling for packet-less commits, and whether every commit must carry an id or only packet-linked ones (angle 10 will propose enforcement).
- How a hook could detect cherry-pick-copied ids cheaply (angle 10), and whether GitHub's tokenization of the hyphen form behaves exactly as reasoned (offline limit).
