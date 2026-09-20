## TASK

Repository root: the current working directory. All paths below are relative to it.

Ten former top-level spec packets are being moved (2026-09-20) into an existing phase
parent. Each packet's whole tree moves; nothing inside is deleted, and the move happens
once at the end of the census, so everything is still at its ORIGINAL path right now.

Your share of the census: **`041-cli-pi-devpass-glm-route`, `042-deep-loop-test-debt`,
`043-review-leaf-protocol`, `044-cli-pi-devpass-deepseek-route`,
`045-fanout-write-containment-hardening`** — all currently under
`specs/system-deep-loop/`.

For each packet, census every file that mentions ANY of these five packets' path strings,
in any form. The path strings you are looking for are variants of
`system-deep-loop/<packet-slug>` (slug = the folder name, e.g. `045-fanout-write-containment-hardening`):
absolute `specs/system-deep-loop/<slug>`, prefixed `.skilled/specs/system-deep-loop/<slug>`,
legacy `.opencode/specs/system-deep-loop/<slug>`, bare `<slug>` in prose, backticked,
inside code fences, in JSON values, in shell commands, in URLs. Report the variants you
actually find, not the ones you can imagine.

Search the whole repository, but classify results into these scopes:
- **self** — inside the packet's own tree (any depth)
- **sibling** — inside one of the other nine moved packets' trees:
  `041-cli-pi-devpass-glm-route`, `042-deep-loop-test-debt`, `043-review-leaf-protocol`,
  `044-cli-pi-devpass-deepseek-route`, `045-fanout-write-containment-hardening`,
  `046-synthesis-chat-presentation`, `047-deprecate-skill-benchmark`,
  `048-fanout-convergence-mode-flag`, `049-deep-loop-alignment-review`,
  `050-spec-protocol-ledger-events`
- **external** — anywhere else in the repository

Classify every hit-bearing file into exactly one class:
- `md-rewrite` — a markdown file whose path strings the orchestrator will rewrite in place
- `derived-json-regen` — machine-generated JSON derived from disk (`description.json`,
  `graph-metadata.json`, aggregate indexes); regenerated, never hand-edited
- `ledger-artifact-leave` — historical provenance whose bytes must not change: `.jsonl`,
  append-only state logs, ledger frames, research lineage outputs, reports under
  `research/`/`review/`/`review-archive/`, containment snapshots, benchmark run outputs
- `other-exception` — anything else (fixtures, scripts, configs, generated docs indexes);
  name it, do not force it into a class

## RETURN FORMAT (markdown, bounded)

### 1. Reference-form variants
A table: `variant pattern | example file:line | count`. Only variants observed.

### 2. Per packet (five sections, slug-named)

**Self-scope counts**: one line per class with file count (e.g. `md-rewrite: 14 files`).

**Self-scope `md-rewrite` file list**: relative paths, one per line (these get rewritten).

**Self-scope `other-exception` and `ledger-artifact-leave`**: group names with counts and
2–3 `file:line` samples each; do NOT list every ledger artifact file individually.

**Sibling references**: the other nine slugs referenced from this tree, each with count,
classes involved, 1 `file:line` sample.

**External referrers**: every external file, one line each —
`path | class | file:line sample | live-pointer or historical-narrative`.

### 3. Exception list
Everything you could not classify cleanly, with `file:line` and a one-line reason. If the
list is empty, say `none`.

### 4. Method line
One line naming the searches you ran (so the orchestrator can reproduce them).
