# Baseline Queries — NOT RUN

The corpus baseline this file was meant to hold does not exist yet. What follows is the record of why, and the fixture-scale evidence that was collected instead.

---

## 1. WHY THE BASELINE IS MISSING

A full-corpus `index` run was started against this worktree with the default local embedder, `local/nomic-embed-text-v1.5`, in direct mode. The operator killed it: the transformers-js backend pegged the machine at roughly 860% CPU. The run was stopped before it emitted any result, and the partial index it had written (9.6 MB, 344 KB of `files.zvec` and 9.3 MB of `index.zvec`) was deleted so no half-built index could be mistaken for a finished one or extended by a later incremental pass.

Standing instruction from that point: **do not run a full corpus index with any local or CPU embedder.** The baseline is deferred until the fork's `feat/ollama-backend` lane lands, at which point the embedding reference in `.zvec-grep-lane.json` changes and the run becomes affordable.

Nothing in this repository claims a corpus baseline exists. No number below is a corpus number.

---

## 2. WHAT WAS MEASURED INSTEAD

A four-file fixture corpus, indexed and queried end to end through the wrapper. It is far too small to say anything about retrieval quality, and it was never meant to. Its only job was to prove the wrapper's contract against the real tool rather than against a reading of the tool's source — which is exactly where two defects turned up that source-reading had missed.

Fixture shape: two Markdown files under `specs/demo/001-alpha/`, two under `.opencode/skills/demo/`.

| Measurement | Value |
|-------------|-------|
| Index build, cold model load | 6.4 s wall, 82% CPU |
| Index rebuild, warm | 6.7 s wall, 120% CPU |
| Index size on disk | 5.0 MiB for four files |
| Model | `local/nomic-embed-text-v1.5`, provider `local`, 768 dimensions, cosine |
| Model cache | 161 MB, downloaded once, already warm for these runs |
| Coverage after the fix | 4 / 4 files, 12 entities, 0 truncated, 0 pending, 0 failed |
| Query latency | Under a second per query, warm |

The 82% and 120% CPU figures are the reason the fixture scale matters: the same code path against the full corpus is what reached 860%.

---

## 3. TWO DEFECTS THE LIVE RUN EXPOSED

Both were invisible to the stub-backed unit tests, and both read as success.

### 3.1 The entire `.opencode` tree was silently excluded

First fixture index reported **2 / 2 files, 100% coverage**. The fixture had four. The two under `.opencode/skills/` were absent.

zvec-grep's scanner skips every dotted directory unless `--hidden` is passed. The globs naming `.opencode` were accepted without complaint, matched nothing, and the build succeeded. Status then reported full coverage — of the half it had scanned. A concept query for text that exists only in `.opencode/skills/demo/SKILL.md` returned five hits, all from `specs/`, none of them the file that actually answers it.

Fixed by passing `--hidden` at index time. After the fix, the same query returns that file at rank 1, and coverage reads 4 / 4.

This is the finding with the widest blast radius in this packet: had the corpus baseline run to completion without `--hidden`, it would have produced a plausible-looking transcript with every skill, command and script in the repository missing, and nothing in the output would have said so.

### 3.2 The coverage parser read one row's number as another's

The status text prints label-then-number on aligned rows:

```text
  Entities    6
  Truncated   0 fragments
```

The first parser looked for `(\d+)\s+entities`, which never matches that shape, and for `(\d+)\s+truncated`, which matches across the newline and captures the `Entities` value. Live output was reported as `truncated=6` when the true reading is `entities=6, truncated=0`. Both numbers were real; one belonged to the row above.

Fixed by anchoring every count to its own label at line start. The stub fixture was rewritten to the observed shape at the same time, because a tidied-up fixture is what let the defect through.

---

## 4. THE FIVE CONCEPT QUERIES

Not run against the corpus. Recorded here so the deferred run has a fixed target rather than a fresh improvisation:

1. why does the retrofit refuse partial frontmatter blocks
2. how does the advisor decide which embedder to use
3. what stops a fan-out lineage writing outside its directory
4. which rule fails a packet whose completion status contradicts its docs
5. where is the socket path limit on macOS handled

For each, the deferred run should record the top three hits with scores, and whether ripgrep with the obvious keyword reaches the same file. Two of the five (2 and 3) were exercised against the fixture only, where the corpus is four files and the answer is therefore not evidence of anything beyond the plumbing working.

---

## 5. WHAT THE DEFERRED RUN STILL HAS TO ESTABLISH

- Whether the concept lane beats ripgrep on queries where the wording is unknown, which is the entire premise of adding it. Nothing measured so far speaks to this.
- Index build time and size at corpus scale, under Ollama rather than transformers-js.
- Whether the committed scope in `.zvec-grep-lane.json` is the right corpus, in particular whether excluding `.opencode/commands/` and `.opencode/agents/` markdown costs recall on real questions.
- Whether the exclusions carry their weight, measured rather than assumed.
