# Source snapshot storage research

**Historical research:** the subsequently selected design retains assertion maps
and file hashes, and uses matching current project files. The snapshot
recommendation below was not adopted. See [the current map reference](assertion-maps.md).

Research and local measurements on 2026-09-12, using Supercov code `bf956b4`
and Supergateway run `run_1d377c69729e4e0d`. This document proposes storage
policy; it does not implement a new archive format or source provider.

## What is stored today

The numbered source view is presentation. Supercov reads the full saved file,
selects the requested lines and adds the left margin. The `--json` line/text
objects are also generated at query time, not stored individually.

Inside each run's `evidence.raw.gz`, the `assertion-inputs.json` entry contains
`files`, a map from project-relative paths to complete UTF-8 file strings. It
also holds the language, context digest, recognized assertion sites and capture
limitations. For example, schematically:

```json
{
  "schemaVersion": 1,
  "language": "javascript",
  "files": {
    "src/example.ts": "export const answer = 42;\n",
    "tests/example.test.ts": "import { answer } from '../src/example.js';\nassert.equal(answer, 42);\n"
  }
}
```

The example omits other metadata. It illustrates the string representation,
not a complete valid input artifact. The agent-authored `assertions.json` is a
separate, editable file beside the evidence archive. Assertion and statement
anchors additionally retain exact snippets; some text therefore also occurs
in the map and coverage evidence.

JavaScript capture selects discovered source files, non-generated source-scope
entries, recognized test files, package manifests, root dependency lockfiles
and configuration. It happens before the test/build execution. It does not
copy the entire working directory, `.git` history, installed dependencies or
ordinary generated output. Non-UTF-8 selected files are omitted with a
limitation. Environment values are hashed, not saved in this payload.

This selection does not guarantee capture of arbitrary JSON fixtures,
templates, binary inputs, external packages, service state or generated inputs.
A source snapshot supports later inspection; it is not a hermetic replay of
the test run.

Implementation: `assertion_inputs.rs` captures full strings and appends compact
JSON; `integrity.rs::javascript_assertion_paths` selects paths;
`evidence_archive.rs` writes framed entries in one gzip stream. There is no
cross-run source deduplication. `assertion_store.rs::load_optional_inputs`
currently loads the whole archive and parses the input payload even for a
four-line source query. Paging limits output and model context, not archive I/O.

## Measured costs

Sizes below use decimal KB (1,000 bytes). Compression comparisons use Python
gzip level 6. They estimate alternatives; the production Rust compressor gives
slightly different results. All Git-tracked comparisons use the current files
on disk, not a reconstruction of the historical checkout. The 61 captured
tracked files were byte-identical to their current counterparts.

| File set | Files | Original file contents | Compressed path-to-text JSON |
| --- | ---: | ---: | ---: |
| Actual captured files | 107 | 391.3 KB | 85.7 KB |
| Captured files excluding the unrelated nested worktree | 61 | 278.2 KB | 61.9 KB |
| All current Git-tracked UTF-8 text files | 77 | 345.9 KB | 84.3 KB |

All 78 tracked files, including one 191 KB PNG, contain 536.9 KB. Compressing
their concatenated paths and bytes produces 276.8 KB. This last measurement
uses a different representation to accommodate binary data. It excludes Git
history, untracked files, installed dependencies and filesystem metadata.

The actual run's full input entry is 538,554 bytes, including assertion-site
metadata, or 97,614 bytes compressed on its own. Recompressing the whole archive
with and without the full-file text gives an incremental estimate of 85,277
bytes for the stored file contents. Cross-entry compression means there is no
exact standalone on-disk size for one entry of a gzip stream.

The actual evidence archive occupies **145,580 bytes**. Its editable, currently
unmapped `assertions.json` occupies **192,304 bytes**. The four run files total
339,939 bytes. The assertion map itself is already larger than the compressed
source payload in this example.

Keeping 1,000 identical-sized runs would use roughly 340 MB for these run files,
of which about 85 MB is the estimated full-file source contribution. This is a
linear projection from this small project, not a large-repository benchmark.

Seven retained archives contain source inputs: 749 file occurrences but only
74 distinct file contents by SHA-256. Raw repeated file text totals 2,739,233
bytes; unique text totals 307,871 bytes. Independently compressing those unique
files totals 95,949 bytes, excluding per-run manifests/inventories, indexes and
filesystem overhead. These runs are unusually similar and include nested
worktree duplicates; this is evidence of reuse opportunity, not a promised
compression ratio for other projects.

The release CLI's complete four-line source command had a median of **67.6 ms**
over seven invocations on this machine (range 67.4–353.8 ms; the first call was
the slowest). This includes process startup, archive loading, checkout
fingerprinting and formatting. It is not an estimate of added test-run time.
An isolated Python compression of the input entry took about 5 ms; the Rust
capture path, parsing and end-to-end run overhead were not isolated here.

Saving source does not call a model or consume model tokens. Only source
returned to the agent consumes context; returning full files remains an
explicit choice through paging. Disk storage and model context size are
separate costs.

## Capture issue found during measurement

The 107-file archive includes **46 files from an unrelated nested Claude
worktree**, contributing 113,126 bytes of original file text and 299 of the 544
recognized assertion sites. Excluding those paths leaves 245 recognized sites;
that is an offline filtering result, not a newly verified test run.

The recursive test/configuration discovery skips known output directories but
does not establish a sufficient boundary around unrelated nested checkouts.
This pollutes the assertion inventory and completeness counts, beyond adding
storage. It must be fixed and covered by a regression before release. Real
workspace packages and explicitly selected inputs must remain supported.
Historical run evidence should remain immutable; verify the fix with a new run.

## Alternatives and their consequences

| Policy | Benefit | Cost or limitation |
| --- | --- | --- |
| Save only assertion snippets or claimed flows | Small artifact | Loses setup, helpers, guards, absence-check context and overlooked dependencies; cannot reliably investigate what the first map missed |
| Save full selected files per run, as now | Simple, local and portable; old code remains inspectable after edits | Selection can miss context; identical contents are copied across runs; whole-archive queries scale with archive size |
| Save all project text plus declared fixtures per run | Broader context for agent reasoning and review; less dependence on predicting relevant files | More storage and capture I/O; requires clear project boundaries and input policy; still not executable replay |
| Full logical snapshot with shared content-addressed files | Same historical context, storing unchanged file contents once | Requires durable references, atomic publication, safe garbage collection and portable export/import |
| Git revision plus saved dirty/untracked overlay | Reuses existing Git objects; small additional payload for clean runs | Requires retaining/resolving the objects and capturing all actual working-tree differences; repository access can disappear |
| Paths/hashes only, source resolved from the checkout | Least additional source storage | Works only while exact contents remain available elsewhere; hashes detect mismatches but cannot recover missing source |

For the absence assertion `assert.equal(received.length, 0)`, the agent needs
the listener setup, which events append to `received`, the action under test,
the protocol barrier and the production guard. Saving only the assertion or
the four nearby lines would discard part of that reasoning. The initial map
cannot safely decide all the context future agents will need.

Source availability is distinct from map freshness. A hash can show that a
watched file changed without storing its old contents. Exact old contents are
needed to inspect the previous reasoning context and support relocation or
selective re-review. Keeping source makes those operations possible; it does
not prove the agent listed every dependency or that the map is semantically
complete.

## Relevant existing designs

These are storage precedents, not implementations of LLM assertion coverage:

- **ECMA-426 source maps** allow source URLs and optional full `sourcesContent`
  strings, including a mix of embedded and externally resolved sources. This
  provides a directly relevant JS/TS example of separating locations from
  source availability. [Current specification](https://tc39.es/ecma426/#sec-source-map-format)
- **Playwright tracing** has an explicit `sources` option for including source
  files for trace actions. This supports source preservation alongside test
  evidence. Its broader tracing overhead should not be attributed to source
  capture alone. [Tracing API](https://playwright.dev/docs/api/class-tracing#tracing-start-option-sources)
- **Source Link** embeds source-control metadata and supports embedding
  untracked source files. It demonstrates a hybrid rather than relying on
  repository identity alone. [Source Link](https://github.com/dotnet/sourcelink#using-source-link-in-net-projects)
- **Git bundles** preserve reachable Git objects, not arbitrary working-tree
  and index state. Therefore a commit or bundle alone does not necessarily
  identify the dirty files the test actually used.
  [Git bundle documentation](https://git-scm.com/docs/git-bundle)
- **Bazel's remote execution protocol** identifies an input directory tree
  and its file contents through digests, requiring referenced blobs to exist
  in content-addressed storage. The same representation could give each run
  a full logical snapshot without copying unchanged contents.
  [Remote execution protocol](https://github.com/bazelbuild/remote-apis/blob/main/build/bazel/remote/execution/v2/remote_execution.proto)
- **restic** combines snapshots, content hashes and shared data blobs. Its
  publication and deletion invariants are relevant if Supercov adds shared
  storage: a retained snapshot must not reference deleted content. We would
  not need its entire backup system or chunking algorithm initially.
  [Repository design](https://restic.readthedocs.io/en/stable/100_references.html)

## Recommendation

Keep complete source files available for every retained run. For a project the
size of Supergateway, preserve broad first-party text context and declared
fixtures; the measured cost difference is small. Do not limit capture to lines
already executed or referenced by the first version of the assertion map.

First fix capture boundaries, document which files are included, and provide
explicit inclusion for otherwise missed inputs. Treat code/fixtures as inputs
and optional documentation as agent context; expanding context must not
silently expand the measured-statement denominator or discover assertions in
unrelated projects. Avoid copying dependencies, build caches, nested worktrees
and arbitrary machine configuration. The existing `assertions files` view
already exposes captured paths and sizes.

Keep the current compressed per-run format for the first release unless
larger-repository measurements justify a migration. If retention grows, use
one shared compressed object per full-file content hash, with a run-owned
path-to-hash manifest. Run A and run B reference the same object when contents
match. A run still owns a complete logical snapshot; its `source` command and
agent-authored `assertions.json` do not need to change. Start with file-level
deduplication; evaluate packed objects or chunking only if scale warrants it.

Shared objects must remain pinned while any retained run references them.
Write/verify objects before publishing the run manifest, delete only
unreferenced objects, and include all referenced content in a portable export.
An ordinary evictable cache would be insufficient for historical evidence.
The storage mechanism can operate on paths, bytes and digests in Rust without
depending on the language-specific assertion collector or a model.

A future no-embedded-source mode could resolve exact contents from a verified
checkout or retained Git objects and a dirty overlay. If resolution fails,
show source as unavailable; never label current, changed code as historical
source. Already recorded structural coverage can remain available. Assertion
assessment and carry should report their missing-source limitation instead
of accepting unverified text. Current assertion queries and carry expect
embedded inputs, so simply deleting this payload is not a supported mode.

None of these storage choices reconstructs assertion flows mechanically.
The agent-authored map remains the semantic assessment. Source storage keeps
the evidence needed to inspect, revise and reuse that assessment.
