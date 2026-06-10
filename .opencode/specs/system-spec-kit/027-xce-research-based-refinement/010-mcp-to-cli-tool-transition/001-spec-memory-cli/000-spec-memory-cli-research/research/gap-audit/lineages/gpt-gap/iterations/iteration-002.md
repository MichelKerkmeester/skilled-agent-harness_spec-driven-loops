# Iteration 2: Delta and Requirement Traceability

## Focus

Trace every phase-000 design delta into the implementation phases and then reverse-check phase requirements against the research/program evidence base.

## Findings

1. All eight spec-memory design deltas have phase owners. The research requires D1 dual-spawn, D2 dual-client, D3 `--session-id`, D4 `--timeout-ms`, D5 exit-69 docs, D6 short socket directory, D7 heartbeat self-shutdown, and DD-001 dist freshness [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:176]. Phase 1 owns D3/D4/D6/DD-001 through `--session-id`, `--timeout-ms`, short-socket-dir default, and dist-freshness guard [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:99] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:101] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:137]. Phase 2 owns D1/D2/D5/D7 through the hardening suites and exit-69 recovery docs [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md:97] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md:101].

2. Phase 1 and phase 2 have no material orphan requirements. Phase 1 requirements map to run-2/run-4 research: generated 37 subcommands, IPC-only, auto-spawn, exit taxonomy, flag wiring, dist freshness, and short socket path [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:127] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:137]. Phase 2 requirements map directly to the acceptance-test deltas and parity lock [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md:128] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md:137].

3. Phase 3's OpenCode plugin requirement traces to the program rule and live inventory. The parent program says the missing spec-memory plugin must be created because memory access is currently MCP-only in OpenCode [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/spec.md:118]. The phase 3 spec and tasks preserve that as a new plugin plus bridge [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:98] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/tasks.md:63]. The plugin README corroborates that only `mk-skill-advisor`, `mk-code-graph`, and `session-cleanup` are current OpenCode entrypoints [SOURCE: file:.opencode/plugins/README.md:40].

4. P2 traceability note: Gemini is the only orphan-ish runtime item. It appears in phase 3 allowlisting scope [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:96], but it is not part of the parent program's runtime-pairing rule [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/spec.md:117]. If Gemini is intentionally excluded, the implementation phase should say so; if not, it needs a real requirement and acceptance criterion.

## Sources Consulted

- Phase-000 research synthesis, especially section 14
- Phase 1/2/3 specs and tasks
- Transition-program parent spec
- OpenCode plugin README

## Assessment

`newInfoRatio`: 0.74.

Novelty justification: the delta mapping itself was expected, but the reverse trace clarified that Gemini is the only runtime item without a clean evidence path.

Confidence: high for D-series coverage; medium for runtime traceability because phase 3 is intentionally still a planned-state scaffold.

## Reflection

What worked: treating deltas as a closed set kept the pass bounded.

What failed: phase 3 mixes hard requirements, rollout guidance, and optional runtime naming in a way that blurs traceability.

Ruled out: OpenCode plugin as an orphan. It has strong program-level evidence and live inventory evidence.

## Recommended Next Focus

LENS-3: compare runtime pairing scope to actual hook/plugin/config files.
