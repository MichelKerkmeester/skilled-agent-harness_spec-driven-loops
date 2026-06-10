# Iteration 4: LENS-4 Sequencing and Shared Infrastructure

## Focus

Validate the phase handoff chain and hunt cross-workstream risks around three CLI systems sharing launcher, IPC bridge, socket, model-server, and worktree-session infrastructure.

## Findings

1. Sequencing is coherent. The skill-advisor parent gates phase 1 on the completed research record, phase 2 on 9/9 invocable plus fail-closed mutation behavior, and phase 3 on all fixtures green, zero orphans, and measured job semantics [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/spec.md:115]. This matches the three-packet effort shape from feasibility synthesis [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:94].

2. Root runtime socket directories are distinct, so a simple global socket collision is not evidenced. OpenCode pins skill-advisor to `/tmp/mk-skill-advisor` [SOURCE: file:opencode.json:55], Codex does the same [SOURCE: file:.codex/config.toml:109], Claude does the same [SOURCE: file:.claude/mcp.json:43], and Devin does the same [SOURCE: file:.devin/config.json:43]. The bridge helper also resolves socket paths per service name [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:59].

3. P1 GAP: add a cross-daemon stress gate before phase 3. The bin README says three launchers wrap spec-memory, skill-advisor, and code-graph MCP servers, with shared supervision, IPC bridge, and env allowlist behavior [SOURCE: file:.opencode/bin/README.md:14], [SOURCE: file:.opencode/bin/README.md:20]. Worktree-session isolation changes database and socket placement for top-level sessions [SOURCE: file:.opencode/bin/README.md:137]. The skill-advisor phase 2 dual-client test covers MCP + CLI against one daemon [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:126], but no phase acceptance covers simultaneous spec-memory, code-index, and skill-advisor auto-spawn under one worktree/session environment.

4. Skill-advisor launcher reaping parity is correctly phase-owned, but the implementation mechanism must not be left to inference. Spec-memory and code-index have owner leases with ppid/heartbeat classification [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:314], [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:284] and dead-socket owner reaping paths [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:671], [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:537]. Current skill-advisor launcher uses PID lease checks and bridge handoff [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:215], then clears its lease on child/signal/exit paths [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:543]. Phase 2 already demands owner token, process-group reap, stale-socket probe, and idle timeout [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:95]; keep this as a hard pre-phase-3 gate.

## Sources Consulted

- Skill-advisor parent spec
- Feasibility research synthesis
- Root runtime configs
- `.opencode/bin/README.md`
- Shared bridge helper
- Spec-memory, code-index, and skill-advisor launchers
- Phase 2 hardening spec

## Assessment

`newInfoRatio`: 0.64. This pass mostly confirmed existing sequencing, but added one cross-daemon stress recommendation.

Confidence: high on handoff chain and launcher comparison; medium on cross-daemon stress severity because it is a missing acceptance gate, not a proven runtime failure.

## Reflection

What worked: comparing sibling launchers clarified why D6 is important. What failed: no live stress run was possible under the read-only lineage constraint. Ruled out: current socket collision in root configs.

## Recommended Next Focus

LENS-5: adversarial sweep for contradictions, hedges, missing failure modes, and day-one implementer traps.
