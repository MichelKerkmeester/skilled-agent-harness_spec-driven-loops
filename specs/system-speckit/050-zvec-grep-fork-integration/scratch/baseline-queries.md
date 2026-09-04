# Baseline Queries

The corpus baseline for the zvec lane, built through the fork's Ollama backend on 2026-09-04. Section 6 keeps the earlier fixture-scale findings that shaped the wrapper.

---

## 1. INDEX BUILD

| Measurement | Value |
|-------------|-------|
| Corpus | 24,304 files matched by `.zvec-grep-lane.json` (13,552 spec markdown, 8,283 skill markdown, 2,481 code and script files) |
| Embedder | `ollama/nomic-embed-text-v1.5`, 768 dimensions, cosine, context 2048 |
| Build | two runs: the first killed by the wrapper's one-hour ceiling at 16,349 files; the resume finished the remaining 7,920 in 22 m 50 s. Total roughly 83 minutes, about 270 files a minute |
| Entities | 117,845 created by the resume pass; the collection reports 347,584 indexed entities and 359,042 documents in total |
| Index on disk | 2.1 GB: 1.2 GB vector index, 501 MB full-text store, 6 scalar segments of 64 MB, 40 MB file metadata |
| Coverage | 24,304 / 24,304 indexed, 0 pending, 0 failed, 0 truncated |
| Machine load | Ollama's llama-server at 120 to 175 percent CPU; the wrapper and the fork binary under 1 percent |

The one-hour ceiling was a wrapper defect. It is now three hours by default and overridable through `SPECKIT_ZVEC_INDEX_TIMEOUT_MS`.

---

## 2. THE FIVE CONCEPT QUERIES

Run through `zvec-lane.mjs search`, top three hits with score. The ripgrep column is the obvious keyword through the ripgrep lane's recipe with the same exclusions, reported as file count because ripgrep does not rank.

| # | Query | Top hit | Score | Second | Third | Verdict | ripgrep keyword and file count |
|---|-------|---------|-------|--------|-------|---------|-------------------------------|
| 1 | why does the retrofit refuse partial frontmatter blocks | `system-spec-kit/references/structure/grep-convention.md` 76-81 | 0.0265 | `sk-doc/sk-create-agent/README.md` 77-82 | `grep-convention.md` 113-132 | correct: the refusal rule is in the convention | `partial block`: 27 files, the convention not in the first three |
| 2 | how does the advisor decide which embedder to use | `system-skill-advisor/README.md` 146-149 | 0.0230 | `system-skill-advisor/INSTALL-GUIDE.md` 293-296 | `system-spec-kit/references/memory/embedder-pluggability.md` 17-24 | correct: the README section documents the auto order | `embedding provider`: 290 files |
| 3 | what stops a fan-out lineage writing outside its directory | `system-deep-loop/changelog/v2.2.4.0.md` 15-19 | 0.0215 | `specs/system-deep-loop/040-cli-lineage-nesting-and-containment-guard/implementation-summary.md` 55-58 | `system-spec-kit/changelog/v3.5.0.0.md` 49-56 | correct: the containment guard packet is second, its changelog first | `write containment`: 136 files |
| 4 | which rule fails a packet whose completion status contradicts its docs | `specs/sk-doc/040-create-repo-rules/007-validation-and-changelog/acceptance-criteria.md` 70-78 | 0.0164 | `specs/mcp-tooling/008-mcp-aside/004-validation-and-handoff/plan.md` 32-45 | a verify batch report under `specs/system-speckit/027` | weak: packets that mention the rule, not the validator or its reference | `STATUS_CROSS_DOC`: 24 files, mostly research logs |
| 5 | where is the socket path limit on macOS handled | `.opencode/bin/lib/model-server-supervision.cjs` 510-520 | 0.0315 | `specs/system-speckit/026/.../011-sun-path-and-stale-lease-followups/implementation-summary.md` 36-51 | the same packet's `spec.md` 31-40 | exact: the function `assertSunPathLimit` at line 510 | `socket path`: 203 files |

Four of five land on the right document at rank one or two from wording that shares no key term with the answer. Query 4 is the failure case: the validator source and the rule's reference are code and a registry entry, and the corpus scope indexes code only under `.opencode`, so the packets that talk about the rule outrank the rule itself.

---

## 3. LATENCY

| Measurement | Value |
|-------------|-------|
| Query wall clock through the lane | 38.7 to 44.9 s per query, all five |
| Of which search | 72 ms (`search_total`), 355 ms timed in total, 53 ms of that the Ollama embed |
| Raw collection open from the binding | 124 ms; a vector query 12 ms; the file metadata scan 101 ms |
| `zg status` | 41.4 s |
| `--refresh off` / `background` / `wait` | 37.9 s / 39.8 s / 76.5 s |
| Process boot alone | 361 ms |

A CPU profile of the query attributes 34 of 39 seconds to the fork's scanner walking all 24,304 paths and matching every ignore rule, compiling each glob into a regular expression for every path. Direct-mode queries run that walk to compute a status the CLI only uses for a stale-index hint, regardless of the refresh flag. Both are fork defects, fixed on the branch `perf/direct-query-scan`; post-fix numbers are recorded below when that lane reports.

---

## 4. POST-FIX LATENCY

Pending the perf lane.

---

## 5. WHAT THIS BASELINE ESTABLISHES

- The concept lane reaches the right document from unknown wording on four of five queries, where ripgrep with the obvious keyword returns 24 to 290 unranked files.
- Build cost at corpus scale under Ollama: about 83 minutes and 2.1 GB, on the GPU-backed model server rather than every CPU core.
- The committed scope is right for prose questions and wrong for "which rule" questions; indexing the validator registry and rule references would close query 4 and is a scope decision, not a code change.
- Until the perf branch lands, the lane is usable interactively and unusable from a prompt-time hook.

---

## 6. FIXTURE FINDINGS THAT SHAPED THE WRAPPER

Kept from the fixture-scale run that preceded this baseline.

- Without `--hidden`, zvec-grep silently skips every dotted directory, accepts globs naming `.opencode`, and reports full coverage of the half it scanned. The wrapper forces the flag.
- The status text prints label-then-number on aligned rows, and a regex that did not anchor each count to its label read the Entities value as Truncated. The wrapper anchors every count.
- The transformers backend pegged the machine at 860 percent CPU on the first corpus attempt; that run was killed and its partial index deleted. The lane never selects that backend by default.
