---
title: "Iteration 3: The search surfaces"
trigger_phrases: []
---
# Iteration 3: The search surfaces

## Focus

For every candidate surface — `git log --grep`, `--all-match`, `--fixed-strings`, `-S`, `-G`, `--format=%(trailers:key=X)`, `git interpret-trailers`, GitHub commit search, and the spec-kit trigger index — establish what it can and cannot match in a subject, body, or trailer, and run the local ones against the live 9,108-commit log.

## What was read

- `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:1-80` — the two retrieval lanes: a keyed lane (generated index at `runtime/data/trigger-index.json`, read by `lookup-trigger-index.mjs`) and a free-text ripgrep lane; "an exact identifier always goes to ripgrep first."
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:1-60` — usage, default index path, `partial` candidate class, exit codes.
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:29-70` — `CORPUS_ROOTS = ['specs', '.opencode/skills', '.opencode/install-guides']`; exclusions include `**/research/lineages/**`.
- `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` — shape: `manifestHash`, `normalization`, `paths` (14,132), `phrases` (author-declared trigger phrases keyed by path), `schemaVersion 2`.

## What was measured

```text
A. git log --grep (default BRE, case-sensitive)
   --grep='Refs:'            -> 363 commits      --grep='refs:'        -> 9
   -i --grep='refs:'         -> 370              --grep='Co-Authored-By' -> 7365
   --grep='Claude-Session: ' -> 3838
B. fixed / anchored
   --fixed-strings 'Refs: specs/' -> 130         -E '^Refs: specs/' -> 128
   -E '^Refs: '                   -> 344
C. boolean composition
   --grep='028' -> 622   --grep='sk-git' -> 162
   --grep='028' --grep='sk-git' (OR)  -> 782     + --all-match (AND) -> 2
D. pickaxe (diff content, not messages)
   -S 'Refs: specs/' -> 0                        -G 'Refs: specs/' -> 0
E. trailer extraction over all 9,108 commits
   %(trailers:key=Refs)            -> 119 non-empty   (vs 349 Refs: lines / 363 grep hits)
   %(trailers:key=refs)            -> 119             (key match is case-insensitive)
   %(trailers:key=Refs,valueonly)  -> 119
   %(trailers:key=Co-Authored-By)  -> 7286
   %(trailers:key=Claude-Session)  -> 3836
   %(trailers:key=Commit-Id)       -> 0
F. real commit 8649953e01: `Refs: specs/hooks/016-...` sits in its own paragraph BEFORE the
   Co-Authored-By/Claude-Session block; %(trailers:key=Refs,valueonly) returns EMPTY for it while
   %(trailers) returns only the final Co-Authored-By/Claude-Session block.
G. git interpret-trailers (stdin -> stdout):
   printf 'feat(...): ...\n\nRefs: specs/sk-git/028-...\nCommit-Id: sk-git-028-0001\n'
     | git interpret-trailers --parse
   -> parses exactly:
      Refs: specs/sk-git/028-crawlable-commit-history
      Commit-Id: sk-git-028-0001
   printf 'fix(...): ...\n\nContext: numeric scopes slipped through.\n'
     | git interpret-trailers --trailer 'Spec=sk-git/028-...' --trailer 'Commit-Id=sk-git-028-0001'
   -> appends both to the Context paragraph (any `Token: value` line is trailer-syntax to git).
H. constructed identifier is not in history today:
   --grep='Commit-Id: sk-git-028' -> 0
I. trigger-index lookup demo (no fetch):
   node lookup-trigger-index.mjs --json -- "crawlable commit history numbered ids"
   -> candidatePhraseCount 175, all `partial` class, score 0; nearest hits are unrelated mcp-click-up
      docs matching "history"; the index does not contain "crawlable".
```

## Findings

1. **`git log --grep` matches plain text anywhere in the message — subject, body, and trailer lines alike — and is the only general message-search surface.** It is a line-oriented regex (BRE by default, `-E` for extended; `^` anchors per line: `^Refs: ` = 344 vs `Refs:` = 363), case-sensitive by default (9 lowercase hits vs 363), literal with `--fixed-strings` (130). Multiple `--grep` flags OR by default (782) and AND only with `--all-match` (2). [SOURCE: command:git log --grep experiments A-C]
2. **The packet query that should be trivial fails today.** `--grep='028' --grep='sk-git' --all-match` finds **2** commits; `028` alone over-matches (622 — issue numbers, hashes, dates, prose). History cannot answer "commits for packet sk-git/028" with any precision. [SOURCE: command:git log --all-match → 2]
3. **Pickaxe is the wrong tool for messages: `-S` and `-G` both returned 0** for `Refs: specs/`, because they search diff content, not commit metadata. Any retrieval design that routes users to pickaxe for commit identifiers is broken by construction. [SOURCE: command:git log -S/-G → 0]
4. **Trailer extraction is a structural parse, not a text scan — and it is lossy today.** `%(trailers:key=Refs)` extracts 119 of the 349 literal `Refs:` lines, because git only treats a **final, contiguous paragraph** as the trailer block: commit `8649953e01` places `Refs:` in its own paragraph before the Co-Authored-By block and its Refs value is invisible to the extraction format. Keys are matched case-insensitively (119 = 119), and `valueonly` returns the bare value. [SOURCE: command:%(trailers:key=Refs) → 119 vs 349; commit 8649953e01]
5. **A new `Commit-Id:` key is already structurally extractable by git today.** The trailer parser is syntactic (`Token: value` in the final paragraph) and does not care about the hook's `TRAILER_RE` whitelist; `%(trailers:key=Commit-Id)` would work the day the first commit carries one (it returns 0 only because none exists yet). This decouples *extraction* from the hook whitelist change in iteration 1's recommendation 2 — the hook change is about the ≥4-path body-gate classification, not about git's ability to parse the key. [SOURCE: command:%(trailers:key=Commit-Id) → 0 in history; `git interpret-trailers --parse` output G]
6. **`git interpret-trailers` is the natural stamping tool.** Piped stdin→stdout, it parses a trailer block and appends `--trailer` values without touching the subject; the demo appended `Spec=` and `Commit-Id=` in one pass. Caution: it treats *any* `Token: value` line in the final paragraph as trailer syntax — including the body template's `Context:` line — so a future `prepare-commit-msg` must append to a clean final trailer paragraph, not to a paragraph that happens to start with `Context:`. [SOURCE: command:git interpret-trailers demo G]
7. **Searchability and structure are independent axes.** `--grep` finds a literal wherever it sits (even mid-prose); `%(trailers:)` finds it only in a valid final block. A grammar should therefore place the identifier where both work: a literal token in a final contiguous trailer block. [SOURCE: findings 1, 4]
8. **The spec-kit trigger index does not index commits at all, and cannot as written.** `CORPUS_ROOTS` is `['specs', '.opencode/skills', '.opencode/install-guides']`; it walks markdown documents and reads author-declared `trigger_phrases`; `**/research/lineages/**` is excluded. A commit grammar cannot make commits enter the keyed lane — only docs can. The demo lookup for the exact topic returned 175 partial candidates, all score 0, none from this packet. [SOURCE: file:.../lib/corpus.mjs:29] [SOURCE: command:lookup-trigger-index demo I]
9. **[UNVERIFIED LOCAL KNOWLEDGE — no fetch] GitHub commit search is token-based over commit-message text** (plus author/committer identities), supports quoted phrases and qualifiers (`author:`, `committer:`, `merge:`), cannot use regex, does not infer trailer semantics, and does not search diffs (that is GitHub code search). A literal `Commit-Id: sk-git-028-0001` token would be matchable as plain text; a `#`-prefixed or punctuation-fragmented form splits into tokens and weakens matching. GitHub renders trailer-shaped lines as text (Co-Authored-By specially). This cannot be validated offline and is flagged accordingly. [SOURCE: UNVERIFIED — local knowledge only]
10. **The 9,108-commit history is exactly the worst case for every surface:** 90% bodies, 80% Co-Authored-By, but only 3.8% Refs — so any new key is absent from history (0 hits) and only useful after the retrofit populates it. [SOURCE: iteration 2 measurements] [SOURCE: command:H]

### Search-surface capability matrix

| Surface | Subject | Body | Trailer (structural) | Regex | Case | Composes | Verdict for identifiers |
|---|---|---|---|---|---|---|---|
| `git log --grep` (BRE) | yes | yes | text only | yes (line-anchored) | sensitive (`-i`) | OR default, AND `--all-match` | primary local query surface |
| `--fixed-strings` | yes | yes | text only | no | sensitive | same | safe for literal ids |
| `-S` / `-G` | no | no | no | `-G` regex | — | — | unusable (diff content only) |
| `%(trailers:key=X)` | no | no | yes, final contiguous paragraph only | no | key-insensitive | per-key | structured access; lossy unless placement is normalized |
| `git interpret-trailers` | no | no | read/write final block | no | — | multi `--trailer` | stamping mechanism for a future hook |
| GitHub commit search | yes | yes | text only | no | insensitive-ish tokens | qualifiers | works on literal tokens; unverifiable offline |
| spec-kit trigger index | n/a (docs only) | n/a | n/a | keyed phrases | normalized | — | commits cannot enter it; doc-side phrases only |

## Recommendations

1. **[implementable today]** Make the identifier a single literal token (letters/digits/hyphens, no `#`, no slashes adjacent to delimiters) so `--grep --fixed-strings` and GitHub token search both hit it; the demo `Commit-Id: sk-git-028-0001` satisfies this and `--grep='Commit-Id: sk-git-028'` already resolves it.
2. **[implementable today]** Require one final contiguous trailer block for machine keys (`Spec:`, `Commit-Id:`, `Refs:` last), because trailer extraction silently loses 66% of today's `Refs:` values to paragraph placement.
3. **[needs a contract decision]** Whether the spec-kit trigger index should gain a commit ingestion path. It has none today, its corpus excludes research lineages, and adding commits is a new pipeline (index build + lookup), not a grammar choice.
4. **[implementable today]** Use `git interpret-trailers` in any future `prepare-commit-msg`; append to an empty final paragraph rather than an existing body paragraph to avoid the `Context:`-as-trailer trap.
5. **[needs a contract decision]** Choose an AND-friendly token pair (packet token + id token) so `--all-match` queries can be precise; today's 2-commit AND result is the failure mode to design away from.

## What this iteration could not settle

- Whether GitHub commit search matches hyphenated tokens exactly as reasoned (no network allowed); must be validated at implementation time.
- Identifier minting and survival (angle 4), and which keys to standardize (angle 5).
- Whether adding commit ingestion to the trigger index is in scope at all — flagged as a contract decision.
