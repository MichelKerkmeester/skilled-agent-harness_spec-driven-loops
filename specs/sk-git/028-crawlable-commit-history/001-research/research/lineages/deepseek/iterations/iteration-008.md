---
title: "Iteration 8: Rewrite mechanics and alternatives"
trigger_phrases: []
---
# Iteration 8: Rewrite mechanics and alternatives

## Focus

`git filter-repo --message-callback` / `--commit-callback` on a mirror clone: what is preserved, what is lost, how tags are rewritten, what the commit-map output looks like. Then the alternatives that do not rewrite — `git notes` and `git replace` — and whether `git log --notes --grep` and GitHub make them searchable. Give a verdict with reasons.

## What was read

- `git filter-repo --help` (installed at `/Users/michelkerkmeester/Library/Python/3.9/bin/git-filter-repo`) — the authoritative local contract for the tool's behavior: callbacks, replace-refs modes, fresh-clone check, dry-run, commit-map format, signatures, tags.
- Local repo state: `git notes list` = 0, `git replace -l` = 0, `git config --get-all remote.origin.fetch` = `+refs/heads/*:refs/remotes/origin/*`, tag object types, signature status counts.

## What was measured

```text
git filter-repo --help (verbatim excerpts):
  --message-callback <function_body>   "Python code body for processing messages
       (both commit messages and tag messages)"
  --commit-callback <function_body>    "Python code body for processing commit objects"
  --dry-run                            "Do not change the repository. Run git fast-export and
       filter its output ... This also disables rewriting commit messages due to not knowing new
       commit IDs and disables filtering of some empty commits"
  --replace-refs {delete-no-add, delete-and-add, update-no-add, update-or-add, update-and-add,
       old-default}  "default is update-no-add"
  "abort if run from a repo that is not a fresh clone (to prevent accidental data loss from
       rewriting local history that doesn't exist anywhere else)"
  "--force ... Ignore fresh clone checks and rewrite history (an irreversible operation,
       especially since it by default ends with an immediate pruning of reflogs and old objects)"
  commit-map: "A header is the first line with the text 'old' and 'new'"; "Commit mappings are
       in no particular order"; "All commits in range of the rewrite will be listed, even commits
       that are unchanged"; "An all-zeros hash ... in the 'new' column ... means the commit was
       removed entirely"; later runs update commit-map/ref-map with cumulative chaining (A C
       rather than B C).
  signatures: "extended commit headers, if any, are stripped"; "commits get rewritten meaning
       they will have new hashes; therefore, signatures on commits and tags cannot continue to
       work and instead are just removed (thus signed tags become annotated tags)"

Local repo:
  signature status: 11 B (signed, unverifiable here — gpg is absent), 9102 N (unsigned)
  tags: 51 lightweight (objecttype commit) + 98 annotated (objecttype tag) = 149
  notes: 0 | replace refs: 0
  fetch refspec: +refs/heads/*:refs/remotes/origin/*   (notes/replace refs not fetched by default)
```

## Findings

1. **filter-repo is a message-preserving, stream-based rewrite with strong safety rails.** It round-trips commit/tree/blob objects through fast-export/fast-import, rewrites hashes, **prunes reflogs and old objects by default**, refuses non-fresh clones, and fetches from origin by default (which "may discard" local-only changes). The rewrite plan must therefore run on a mirror clone with `--no-fetch`/`--force` where appropriate and never on the primary working clone. [SOURCE: `git filter-repo --help` excerpts]
2. **Message callback is the stamping surface — and it also receives tag messages.** `--message-callback` processes "both commit messages and tag messages", so a naive stamping function would inject `Commit-Id:` into tag messages too; the guard is to use `--commit-callback` against `commit.message` (or detect and skip tag messages) and leave tag messages untouched. [SOURCE: `git filter-repo --help` callbacks]
3. **What is lost: signatures and extended headers.** Rewrites make old signatures invalid, so they "are just removed"; signed tags degrade to annotated tags. Measured: 11 signed commits (status `B` — unverifiable locally because gpg is missing) and 98 annotated tags must be treated as acceptable losses. [SOURCE: `git filter-repo --help`; command:signature counts]
4. **`--dry-run` cannot rehearse the identifier work.** It "disables rewriting commit messages due to not knowing new commit IDs" — structure/refs can be rehearsed, but the message-callback output cannot. The real rehearsal has to be a full rewrite on a throwaway mirror, then compare invariants. [SOURCE: `git filter-repo --help` dry-run]
5. **The commit-map is exactly the remap source angle 9 needs.** Header line with `old`/`new`, every commit in range listed (including unchanged ones with identical hashes), null SHA in `new` means removed, and later runs chain cumulatively (A→C). One caution: it does not carry the *identifier* assignment — the id plan must be keyed by old SHA and joined to the map. [SOURCE: `git filter-repo --help` commit-map]
6. **Replace refs do not publish by themselves.** Default mode `update-no-add`; even when created, they only help users who explicitly fetch `refs/replace/*` — this clone's fetch refspec is heads-only. Pushing them is a manual, per-clone opt-in and GitHub does not serve replace objects. [SOURCE: `git filter-repo --help` replace-refs; command:refspec]
7. **`git notes` fails the two stated search requirements.** Notes live in `refs/notes/*` (0 today), are not fetched/pushed by default (same refspec evidence), `git log --grep` searches messages, not notes, so a note-only id is invisible to normal message queries, and GitHub renders nothing for notes. A notes layer can be an internal audit ledger at best. [SOURCE: command:fetch refspec, notes count] [SOURCE: local knowledge of git notes]
8. **`git replace` fails publishing.** Replace objects are local-only, not transferred by default, and not understood by GitHub; the tool itself documents using them only as an old-ID compatibility shim ("if manually pushed and fetched"). [SOURCE: `git filter-repo --help` replacing-replace-refs section] [SOURCE: command:replace count 0]
9. **The rewrite is the only mechanism that puts the identifier into the commit message — the only surface both `git log --grep` and GitHub index.** Iterations 3-5 established message text as the common denominator; notes/replace hold data *beside* commits, not in them, so they cannot satisfy "searchable means a real query returns it" on both surfaces. [SOURCE: iterations 3-5] [SOURCE: findings 7-8]
10. **Rollback is a restore-from-backup operation, not an undo.** Because the mirror prunes reflogs and old objects at the end of a run, the canonical rollback is: keep a bare clone (or the untouched primary) of the pre-rewrite state, and restore refs from it; re-running filter-repo cannot recover deleted objects. [SOURCE: `git filter-repo --help` `--force` note]

## Recommendations

1. **[implementable today]** Mirror-clone rewrite with an untouched bare backup: `git clone --mirror`, run without `--force` only after de-initializing the fresh-clone check per the documented multi-run flow (`--force` on reruns), keep the backup until verification passes. Rollback = restore refs from the backup.
2. **[needs a contract decision]** Replace-refs policy: recommended `delete-no-add` (no `refs/replace` clutter, no accidental publication); the default `update-no-add` adds compatibility refs only if the operator wants local old-ID resolution.
3. **[implementable today]** Use `--commit-callback` (not bare `--message-callback`) for id stamping so tag messages are untouched; guard explicitly and test on the mirror.
4. **[needs a contract decision]** Accept the losses: 11 signed commits lose signatures; 98 annotated tags remain annotated after rewrite; extended headers stripped. If any signed artifact must survive, it needs re-signing after the rewrite.
5. **[implementable today]** Rehearsal before the real run: full rewrite on a throwaway mirror, then verify (a) tree hashes unchanged per mapped commit, (b) author name/email/date preserved, (c) `Commit-Id:` present in every target message, (d) tag objects present, (e) commit-map row count equals commit range, (f) `--grep` counts for the new keys match the plan.
6. **[implementable today]** Join the id plan to the commit-map by old SHA; never mint ids inside the callback — the callback only formats values already decided.

## What this iteration could not settle

- Whether filter-repo's round-trip preserves committer timestamps exactly (verify on the first mirror rehearsal; the help does not state a date option in the sections read).
- Whether the operator will accept signature loss on the 11 signed commits and re-sign selected tags later.
- Exact ref list to rewrite and their force-push order (angle 9).
