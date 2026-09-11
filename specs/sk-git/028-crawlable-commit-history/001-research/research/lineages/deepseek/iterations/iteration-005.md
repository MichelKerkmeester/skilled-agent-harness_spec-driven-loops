---
title: "Iteration 5: Body and trailer shape"
trigger_phrases: []
---
# Iteration 5: Body and trailer shape

## Focus

Design the body and trailer shape for search: which trailer keys (`Spec:`, `Phase:`, `Commit-Id:`, `Refs:`, others), what `git log --format=%(trailers:key=…)` extracts from each, how `git interpret-trailers` would add them, what that means for GitHub rendering, and what word budget keeps the body readable. Show one complete proposed message plus the queries that resolve it by packet, phase, and identifier.

## What was read

- `.opencode/skills/sk-git/SKILL.md:463-495` — the body contract (Context / Changes / Verification / Refs; body required for 4+ paths, regressions, non-obvious reasons, or cross-area changes).
- `.opencode/skills/sk-git/assets/commit-message-template.md:60-70` — the body template's trailer position and the `Refs:` example.
- `.opencode/scripts/git-hooks/commit-msg:117,127-129,153-155` — the closed trailer whitelist and the explanatory-body gate (iteration 1).

## What was measured

```text
=== candidate/related keys already present in history (skilled/v4.0.0.0) ===
grep -E '^Spec: '       -> 81 commits     %(trailers:key=Spec)       -> 2
grep -E '^Phase: '      -> 0              %(trailers:key=Phase)      -> 0
grep -E '^Commit-Id: '  -> 0              %(trailers:key=Commit-Id)  -> 0
grep -E '^Related: '    -> 0              %(trailers:key=Related)    -> 0
grep -E '^Change-Id: '  -> 0              %(trailers:key=Change-Id)  -> 0
grep -E '^Issue: '      -> 0

Example of the 81-vs-2 gap (74cf0154ed, a system-speckit commit):
  ...prose...
  Spec: specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement

  Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_...
  -> %(trailers:key=Spec) for this commit returns EMPTY (Spec is not in the final paragraph).

=== a live packet query, for query mechanics ===
$ git log --format='%h %s | %(trailers:key=Refs,valueonly)' --grep='Refs: specs/hooks/016' skilled/v4.0.0.0
2d356893a8 chore(pi): retire ... |
79b3a616a1 feat(pi-cache): refuse an edit ... |
91a0929852 feat(pi-cache): stop a failing turn ... |
12fa8c335d feat(pi-cache): cover every model ... |
# four grep hits, all with EMPTY trailer extraction: search and structure diverge.

=== body word budget baseline over 8,205 non-empty bodies ===
mean 121.5 words | median 101 | p90 239 | max 861

=== interpret-trailers behavior on placement ===
$ printf 'feat(sk-git): ...\n\nContext: ...\n\nSpec: ...\nPhase: ...\nCommit-Id: ...\nRefs: ...\n' \
    | git interpret-trailers --parse
Spec: sk-git/028-crawlable-commit-history
Phase: 001-research
Commit-Id: sk-git-028-0003
Refs: specs/sk-git/028-crawlable-commit-history        # round-trips cleanly

prose-final-line body  -> --trailer appends a NEW final paragraph (blank line inserted):
  fix(sk-git): repair the scope checks

  Some prose without a colon

  Spec: sk-git/028-crawlable-commit-history
  Commit-Id: sk-git-028-0003

'Context: ...' as the last line -> trailers MERGE into that paragraph (Context becomes a trailer key)

--if-exists=addIfDifferent with an identical Refs -> output unchanged (no duplicate)
```

## Findings

1. **`Spec:` already exists organically in 81 commits — and 79 of them are structurally invisible.** The commits sit under `system-speckit` and place `Spec: specs/.../NNN-.../NNN-...` as their own paragraph *before* the Co-Authored-By/Claude-Session block, so `%(trailers:key=Spec)` extracts only 2 of 81. Presence in a commit is not usable structure unless the final-block rule is enforced. [SOURCE: command:Spec grep vs trailer extraction]
2. **`Phase:`, `Commit-Id:`, `Related:`, `Change-Id:`, `Issue:` are greenfield (0 commits, 0 extractions): adding them collides with nothing.** `Commit-Id` also passes the hook in all candidate shapes (iteration 4) and is parseable by git today (iteration 3). [SOURCE: command:key usage counts]
3. **A live packet query already shows the search/structure split.** `--grep='Refs: specs/hooks/016'` returns 4 commits; `%(trailers:key=Refs,valueonly)` returns nothing for all four. The query works because `--grep` reads text; the extraction fails because the lines are not in final trailer blocks. [SOURCE: command:live Refs query]
4. **Body budget: the measured norm is ~100 words (median 101, mean 121.5, p90 239).** A readable target of ≤120 words with Context ≤40 words matches the history's own center of mass; bodies already exist in 90% of commits, so the grammar adds keys rather than replacing prose. [SOURCE: command:body word stats]
5. **Proposed complete shape (trailer block is the address of record):**

```text
feat(sk-git): add crawlable commit identifiers

Context: Commits are not addressable the way spec packets are, so readers
need a stable handle that survives rebases, cherry-picks, and rewrites.

Changes:
- Mint a packet-derived identifier from a locked high-water counter.
- Stamp it as a final-block trailer at commit time.

Verification:
- `bash .opencode/scripts/git-hooks/commit-msg <msg>` -> exit 0

Spec: sk-git/028-crawlable-commit-history
Phase: 001-research
Commit-Id: sk-git-028-0003
Refs: specs/sk-git/028-crawlable-commit-history
```

   Key roles: `Spec:` = packet (track/packet name, the spec-folder analogue); `Phase:` = child folder when the work belongs to one; `Commit-Id:` = the minted address; `Refs:` = external links (issues/PRs/URLs) with spec paths retained for backward compatibility. `git interpret-trailers` round-trips the block, and `%(trailers:key=…,valueonly)` extracts each independently. [SOURCE: command:interpret-trailers demos]
6. **Placement rules are non-negotiable and tool-checkable.** (a) The trailer block must be the final contiguous paragraph; (b) each machine key is one line; (c) the block should be separated from prose by a blank line. `interpret-trailers` appends a fresh paragraph automatically when the last paragraph is prose, but **merges into a `Token:`-shaped last line** — so a body ending on `Context: …` must not be stamped blindly. [SOURCE: command:interpret-trailers placement tests]
7. **The canonical queries resolve by each axis, with no new tooling:**

```text
by packet:     git log -E --grep='^Spec: sk-git/028'            # line-anchored regex (iteration 3)
by phase:      git log -E --grep='^Phase: 001-research'
by identifier: git log --fixed-strings --grep='Commit-Id: sk-git-028-0003'
extraction:    git log --format='%h %(trailers:key=Commit-Id,valueonly) %(trailers:key=Spec,valueonly)'
combined:      git log -E --grep='^Spec: sk-git/028' --format='%h %(trailers:key=Commit-Id,valueonly)'
```

   All three are 0-result today (the keys do not exist yet) and become the resolvers once the grammar and retrofit land. [SOURCE: iteration 3 semantics] [SOURCE: command:key counts]
8. **The hook currently classifies all four proposed keys as explanatory body.** None is in `TRAILER_RE` (117); conversely the human template's `Context:`/`Changes:`/`Verification:` lines are trailer-syntax to git but not to the hook. If the ≥4-path body gate is meant to demand human rationale, the machine keys should be whitelisted; otherwise a machine-only block satisfies it. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:117,127-129,153-155]
9. **[UNVERIFIED LOCAL KNOWLEDGE] GitHub rendering:** trailer-shaped lines render as plain text; `Co-Authored-By` gets avatar treatment; `#123` autolinks while `Spec:`/`Commit-Id:` values do not; all four keys remain token-searchable as text. Not verifiable offline. [SOURCE: local knowledge only]
10. **Word budget that keeps the block readable: ≤4-5 trailer lines, each ≤100 characters** (the hook already warns on >100-character body lines), and no prose inside the block — prose stays in Context/Changes/Verification above it. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:123-125] [SOURCE: command:body word stats]

## Recommendations

1. **[needs a contract decision]** Adopt the four-key set as the canonical body taxonomy with the exact placement rules of finding 6; keep `Refs:` for external references and accept legacy `Refs: specs/...` for compatibility.
2. **[needs a contract decision]** Normalize the 81 historical `Spec:` commits during the same message pass (79 are unextractable today); leaving them means the extraction surface starts inconsistent.
3. **[implementable today]** Any stamping tool must append to a fresh final paragraph — require either a blank line before the block or prose as the body's last line; never stamp when the last line is `Context:`/`Changes:`-shaped.
4. **[needs a contract decision]** Extend `TRAILER_RE` with the new keys so the hook's "explanatory body" means human prose, closing the machine-body loophole for 4+ path commits.
5. **[implementable today]** Document the three canonical queries plus the value-extraction format in `references/quick-reference.md`; they need no script, and the 0-result demos prove the mechanism is already in git.
6. **[implementable today]** Set the documented body budget to ≤120 words with Context ≤40 words, grounded in the measured median (101); this is a documentation sentence, not a hook rule.

## What this iteration could not settle

- Whether `Phase:` is worth carrying when `Spec:` already names the packet (child phase names appear in `Refs:` paths today); flagged for the operator's key-minimalism choice.
- GitHub's exact rendering/tokenization of the hyphen forms (offline limit).
- Whether merge commits carry the full trailer block (angle 7's mapping rule decides their treatment).
