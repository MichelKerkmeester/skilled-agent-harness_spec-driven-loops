# Iteration 5 - F-1-005 security: reducer, gateway-facing state, upsert and dispatch trust boundaries

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-005, dimension security. Node scope: `reduce-state.cjs` (review and research), `upsert.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `dispatch-iteration.cjs` and the five `runtime/lib` ledger, projection and reducer folders.
- Operator review focus covered in this iteration: overengineering (the two reducers' path/state helpers compared), operator UX (reducer warnings and refusal text for corrupt state), cross-CLI/OS parity (POSIX-only path classification in the new source-quality classifier, and the temp-dir fallback in dispatch).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` -- state/delta readers, source-quality classifier, finding-id folding, orphan-edge skip, namespace writes.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` -- delta loader, frontier store reader, registry/dashboard/strategy writers, lineage and extension state.
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` -- question merge, frontier store reader, path handling.
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` -- stop facts read from the registry, graph and state rows.
- `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` -- route-proof sources and delta fallback.
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` -- prompt-file reads, temp-dir creation, flag validation and env pass-through.
- Traceability sources: `007-source-diversity-quality-class` REQ-001..REQ-005, `001-completed-run-extension` REQ-002, `006-state-log-leaf-fields` REQ-001..REQ-004.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Source-quality classification assumes POSIX separators, so Windows-separated paths lose their spec and test classes** -- .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:330 -- `classifySourceLocation` strips a leading `./` and splits the path on `/` only, then tests `segments[0] === 'specs'` and `segments.some(segment => TEST_DIR_NAMES.has(segment))`. A path written with backslashes, as a Windows leaf would cite it (`specs\\foo\\spec.md` or `src\\tests\\fixture.ts`), becomes a single segment; `specs\\...` then falls through to `SKILL_DOC` because of `.md`, and a test-directory file falls through to `REPO_CODE`. The graph's source-diversity signal then reads a different class set for the same repository on Windows than on macOS or Linux, and the REQ-002 class table is only pinned for POSIX paths.
Finding class: class-of-bug
Scope proof: the only separator handling in the function is `split('/')` (`:330`); `path.extname` still finds the extension because it accepts both separators, so the function returns a class rather than failing, and no test in the REQ-002 case uses a backslash path.
Affected surface hints: ["upsert.cjs classifySourceLocation", "coverage-graph-signals sourceDiversity", "007 REQ-002 class table", "Windows leaf citation form"]
Case: a research leaf on Windows cites `specs\\system-deep-loop\\...\\spec.md` and `src\\tests\\fixture.ts`; the upsert stores `skill-doc` and `repo-code` where a macOS run of the same files stores `repo-spec` and `repo-test`, so a question that cites both a spec and a test can score 2.0 on one host and 1.0 on another.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `007` REQ-001..REQ-005, `001` REQ-002 and `006` REQ-001..REQ-004 match the code on POSIX paths and on the extension ledger shape. The iteration 3 REQ-007 admission gap remains the only partial; this iteration adds the Windows path-shape gap above as an advisory. |
| `checklist_evidence` | partial | `007` REQ-002's class table is met for the POSIX fixtures it names; AC-008 remains the outstanding partial. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:383-410` reads the state log and delta only when the review pipeline passes `--state-log`/`--delta-dir`, and rejects those flags for research; the namespace it writes is `{ specFolder, loopType, sessionId }`.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2840-2860` loads every delta file under the packet's `deltas/` directory and hands the flattened rows to one registry build; a malformed delta can only affect derived output inside the packet.
- `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:552-570` prefers the projected route proof and falls back to the delta only when the state row fails it, with the fallback named on stderr.
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:273-300` reads the prompt file the workflow staged and never interpolates argv values into a shell; the executor command is built from an argv array.

## Edge Cases

- `dispatch-iteration.cjs:835` creates its review baseline directory under `process.env.TMPDIR || '/tmp'` rather than `os.tmpdir()`; the line predates this range, and on a host without `/tmp` it would fail rather than escape the packet, so it is recorded as a portability observation, not a finding.
- The reducer writes registry, dashboard and strategy through `fs.writeFileSync` without an lstat symlink guard; a leaf-writable lineage directory could hold a symlink at one of those names. The write helpers predate the range, and the orchestrator's containment snapshot covers outside-lineage effects, so this is recorded as a residual hardening item rather than a range finding.
- A corrupt lineage state log aborts the whole merge rather than degrading that lineage; the merge's own per-lineage reconstruction path documents why that is undesirable, but the throwing readers predate the range.

## Confirmed-Clean Surfaces

- The upsert never trusts a leaf-supplied `quality_class` for research SOURCE nodes; the derived class overwrites it, and the closed vocabulary is imported from the graph query module.
- Finding evidence is derived only from a `file:line` ref, and an edge whose endpoint neither the batch nor the stored graph declares is skipped with a stderr notice instead of failing the batch.
- The review and research reducers read all state under the packet's own artifact directory; no flag can redirect the registry or dashboard path.
- `convergence.cjs` reads stop facts from the registry and state rows only; no new external input reaches the stop decision.
- No range-introduced script in this node invokes a shell or a GNU-only tool; the new code uses Node `fs`/`path` and JSON parsing.

## Ruled Out

- A symlink-following write through the reducer outputs as a range finding: the writers predate the range and the effect stays inside or is caught by containment.
- A corrupt-lineage merge abort as a range finding: the readers predate the range and fail closed.
- The `/tmp` fallback as a range finding: the line predates the range; recorded as a portability observation.
- Treating leaf-authored finding paths as an injection boundary: they are already rendered as untrusted prose in every review artifact, and no new evaluator consumes them.

## Next Focus

- Dimension: security on F-1-007 (pivot and coverage-graph trust boundaries).
- Reason: F-1-005 security is clear apart from the Windows advisory; F-1-007 is the last node without security coverage and its pivot state, paths and graph signals are the remaining untrusted-input surface.
- Required evidence: `divergent-pivot.ts` persisted-config parsing and path containment, `divergent-pivot.cjs` argv parsing, `frontier-admit.cjs graph` output and `coverage-graph` metadata filtering.
- Rotation status: correctness covered on all nodes; security covered on F-1-003 and F-1-005.

Review verdict: CONDITIONAL
