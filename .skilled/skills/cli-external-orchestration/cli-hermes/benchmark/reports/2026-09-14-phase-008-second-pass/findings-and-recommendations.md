# Findings And Recommendations

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live · claude · glm-5.3-flash (llmgateway, --reasoning none) · phase-008-second-pass

This pass re-verified the four findings the first pass raised. All four are closed. Two smaller observations came out of the re-verification and are recorded below as notes, not as defects.

## Closed: all four first-pass findings

### 1. Exit 0 with an empty response -- CLOSED

- **First pass**: `HERMES-009` exited 0 with zero bytes on stdout, twice, on `-t search,todo`.
- **Fix as landed**: Hermes's `search` toolset is web search; `read_file` and `search_files` live in `file`. The read-only shape is now `-t file,todo`, and the packet's CLI reference documents exit 0 with empty stdout as a failed turn that a caller must detect.
- **Re-verified**: `HERMES-009` returns the two requested lines in 21 s. `HERMES-022` now carries the caller-side gate as a first-class scenario, with the superseded toolset as its control.
- **Residual note, not a defect**: the old shape fails intermittently rather than deterministically. This pass's control returned a 103-byte fragment, not zero bytes, with the same deferred-tool error in the log. The gate must therefore test content, not just length, and `HERMES-022` does.

### 2. The git preflight advisory never reached a Hermes session -- CLOSED

- **First pass**: the plugin forwarded only a `deny` decision, and the core it called was the dispatch preflight, which emits nothing for git shapes.
- **Fix as landed**: the plugin now calls `.opencode/hooks/git-preflight/shared/git-preflight-advisory.mjs` for git-shaped terminal commands and appends its text to the tool result through `transform_tool_result`.
- **Re-verified**: `HERMES-014` shows the session quoting `[commit-scope-drops-untracked]` with the advisory's own closing line, after a `--dry-run` commit that left HEAD unchanged. The direct core probe stays silent for `git status`, so the advisory is rule-driven and not shape-driven.

### 3. The session-context section carried no packet or goal content -- CLOSED

- **First pass**: the section was delivered at 303 characters and named no packet.
- **Fix as landed**: with `HERMES_SPEC_FOLDER` set, the plugin appends `Bound packet: <path>` plus the packet goal's durable slice to the section.
- **Re-verified**: the section is now 3402 characters, and `HERMES-020` has the session quoting both the bound packet path and the packet's Objective line verbatim.
- **Residual note, not a defect**: asked to quote "any" section, a model returns only the leading sub-block, which is why `HERMES-020` asks for two named fields instead. `HERMES-015` proves delivery; `HERMES-020` proves the goal reached the same prompt.

### 4. `--ignore-rules` and `-s` were mutually defeating -- CLOSED

- **First pass**: a preload dispatch had to drop `--ignore-rules`, which read as a hard-rule violation.
- **Fix as landed**: the `ignore-rules-required` hard rule now carves out a dispatch that preloads a project skill with `-s`.
- **Re-verified**: `HERMES-016` passes in 19 s and its evidence now cites the exception rather than recording a deviation.

## Note: the max-turns bound changed shape, and the proof moved

`HERMES-013` behaves differently on the corrected toolset. With the file tools direct rather than deferred, a single iteration completes real work, so the first pass's signal -- a model saying it did nothing -- no longer appears. The bound still holds, and the agent log proves it: `Reached maximum iterations (1). Requesting summary...` followed by `Turn ended: reason=max_iterations_reached(1/1)`. The scenario now keys on that line. The same move was made for `HERMES-012`, which keys on `Run budget wrap-up notice injected`. Host-side log lines are stronger evidence here than model prose, because the model cannot author them.

## Note: the corrected toolset is markedly faster

Four scenarios dropped by more than a factor of four on `-t file,todo` versus `-t search,todo`: `HERMES-008` from 107 s to 23 s, `HERMES-009` from a 114 s non-answer to a 21 s answer, `HERMES-004` from 295 s to 31 s, and `HERMES-002` from 45 s to 23 s. The deferred-catalog round trips the old toolset forced were costing more than they appeared to.

## Nothing contradicts the landed contract

Every one of the six contract points this pass was asked to re-verify held as described. No behavior observed in this pass contradicts them.
