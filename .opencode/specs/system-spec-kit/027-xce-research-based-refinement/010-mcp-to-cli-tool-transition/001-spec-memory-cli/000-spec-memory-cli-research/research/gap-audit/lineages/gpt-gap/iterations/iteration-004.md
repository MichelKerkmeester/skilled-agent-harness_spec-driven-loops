# Iteration 4: Sequencing, Dependencies, and Shared Infrastructure

## Focus

Validate handoff chain and estimates for the spec-memory phases, then look for cross-workstream risks from running three related daemon-backed CLIs on one host.

## Findings

1. The spec-memory estimate arithmetic holds. The phase parent scopes phase 1 at about 5-6 days, phase 2 at about 3-4 days, and phase 3 at about 2-3 days [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md:105] [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md:106] [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md:107]. That sums to the research-confirmed 10-13 day total [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:195].

2. The handoff chain is coherent. Phase 1 must deliver all 37 invocable commands, exit-code contract, and auto-spawn from a dead socket before hardening [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md:121]. Phase 2 must produce green D1/D2/D7 and parity suites with zero orphaned daemons before runtime integration [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md:122]. That sequencing avoids exposing runtimes before daemon-safety tests exist.

3. The live runtime configs already isolate service socket directories, which lowers same-host collision risk. OpenCode pins memory, advisor, and code-index to `/tmp/mk-spec-memory`, `/tmp/mk-skill-advisor`, and `/tmp/mk-code-index` respectively [SOURCE: file:opencode.json:27] [SOURCE: file:opencode.json:55] [SOURCE: file:opencode.json:73]. Codex does the same [SOURCE: file:.codex/config.toml:67] [SOURCE: file:.codex/config.toml:92] [SOURCE: file:.codex/config.toml:109].

4. P2 cross-workstream watch: spec-memory explicitly carries the short-socket-dir default into its shim, but sibling CLI-core specs are less explicit. Spec-memory requires unset socket dir to land under `/tmp/mk-spec-memory` and rejects paths over Darwin's socket limit [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:101]. Code-index names a shim and connect/spawn over `mk-code-index-launcher.cjs` but does not carry the same short-dir acceptance wording in its core scope [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:93] [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:97]. Skill-advisor likewise names IPC connect and auto-spawn but not a short default path [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:94]. Because the shared bridge falls back to the service database directory when `SPECKIT_IPC_SOCKET_DIR` is unset [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:59], each future CLI shim should bake its per-service short socket default, not rely on MCP config env.

5. The shared bridge already handles divergent worktree socket envs better than the old failure mode. It prefers an owner-recorded socket path over recomputing from the current env, exactly to avoid false `no-bridge-socket` under divergent `SPECKIT_IPC_SOCKET_DIR` [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:338]. Phase 2 also includes a divergent `SPECKIT_IPC_SOCKET_DIR` case in D1 [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/tasks.md:57].

## Sources Consulted

- Spec-memory workstream parent and phase docs
- Code-index and skill-advisor sibling phase docs
- Runtime MCP configs for socket dirs
- Shared launcher IPC bridge

## Assessment

`newInfoRatio`: 0.58.

Novelty justification: the spec-memory sequencing was expected; the new value was the sibling-shim socket-default watch item.

Confidence: high for spec-memory sequencing; medium for sibling-workstream watch because this lineage is scoped to spec-memory and should not overreach into sibling implementation packets.

## Reflection

What worked: arithmetic and phase handoffs are direct and verifiable.

What failed: cross-workstream risks need a program-level checklist, not only per-workstream specs.

Ruled out: socket directory collision as an active spec-memory blocker; live configs and the spec-memory D1 test already address it.

## Recommended Next Focus

LENS-5: adversarial residual sweep and final gap register.
