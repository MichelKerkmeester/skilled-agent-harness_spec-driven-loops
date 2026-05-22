# deep-loop-runtime

`deep-loop-runtime` is the shared runtime home for deep-review and deep-research loop infrastructure. The 118 FULL_ISOLATE_NO_MCP arc moves executor config, prompt-pack rendering, post-dispatch validation, state safety, permissions, Bayesian scoring, fallback routing, coverage-graph logic, script entry points, storage, and runtime tests out of the MCP server surface and into this peer skill.

## Folder Layout

```text
.opencode/skills/deep-loop-runtime/
  SKILL.md
  README.md
  lib/
    deep-loop/
    coverage-graph/
  scripts/
  storage/
  tests/
```

`lib/deep-loop/` is the phase 002 destination for deep-loop runtime libraries.

`lib/coverage-graph/` is the phase 002 destination for coverage-graph runtime helpers and schema ownership under the 118 override.

`scripts/` is the phase 003 destination for `.cjs` entry points that replace the removed deep-loop MCP tools.

`storage/` is the phase 003 destination for runtime-owned SQLite state.

`tests/` is the phase 007 destination for runtime-owned tests.

## Quick Start

To invoke runtime behavior from a workflow YAML, call the relevant `scripts/<name>.cjs` entry point once phase 003 adds it.

Phase 001 only creates the folder skeleton. The library files land in phase 002, script shims and storage ownership land in phase 003, and test migration lands in phase 007.

## References

- 118 phase parent: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/spec.md`
- 117 council ruling: `.opencode/specs/skilled-agent-orchestration/117-deep-loop-core-isolation-deliberation/ai-council/seats/round-001/seat-D-adjudicator.md`
- 118 ADR-001: FULL_ISOLATE_NO_MCP supersedes the 117 SPLIT ruling for this migration arc.
