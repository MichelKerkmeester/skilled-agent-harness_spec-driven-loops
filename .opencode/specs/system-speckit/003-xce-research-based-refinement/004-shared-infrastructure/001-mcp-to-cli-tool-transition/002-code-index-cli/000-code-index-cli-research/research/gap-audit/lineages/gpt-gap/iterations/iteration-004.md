# Iteration 4: LENS-4 Sequencing and Shared Infrastructure

## Focus

Validate phase ordering, estimate arithmetic, and cross-workstream shared-infrastructure risks: socket dirs, simultaneous daemon auto-spawn, naming, idle/reap policies, and prompt-time hook failure modes.

## Findings

- Estimate arithmetic is coherent. The code-index phase map says phase 1 is about 3.5-4.5d, phase 2 is about 1.5-2d, and phase 3 is about 1.5-2d, totaling about 6.5-8.5d. That fits the research estimate of 6-9d. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:101] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:102] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:103] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/research/research.md:39]

- P1 gap: prompt-time dual failure is not explicitly accepted. Phase 1 says a stopped daemon should auto-spawn; phase 3 says hook paths are warm-only and fail-open when MCP transport is down; phase 3 REQ-001 only requires demonstration with MCP stopped, not with MCP stopped and daemon absent/dead. The missing acceptance case is: hook calls CLI warm path with MCP down and daemon down, does not cold-spawn, returns fail-open within the runtime hook timeout. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:126] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:94] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:119]

- Hook timeout evidence makes that acceptance case material. Current Claude, Codex, and Devin hook registrations use 3-second timeouts; a prompt-time fallback must fail open inside those ceilings and avoid cold-spawn work on the prompt path. [SOURCE: file:.claude/settings.local.json:61] [SOURCE: file:.codex/settings.json:7] [SOURCE: file:.devin/hooks.v1.json:19]

- Literal socket-dir collision is not a gap. Runtime configs pin memory to `/tmp/mk-spec-memory`, code-index to `/tmp/mk-code-index`, and skill-advisor to `/tmp/mk-skill-advisor`. The HF embed socket is intentionally shared only by memory and skill-advisor. [SOURCE: file:.codex/config.toml:67] [SOURCE: file:.codex/config.toml:92] [SOURCE: file:.codex/config.toml:109] [SOURCE: file:.codex/config.toml:69]

## Sources Consulted

- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:117]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:118]
- [SOURCE: file:opencode.json:27]
- [SOURCE: file:opencode.json:55]
- [SOURCE: file:opencode.json:73]
- [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:328]
- [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:537]

## Assessment

- newInfoRatio: 0.52
- Novelty justification: Estimate reconciliation was confirmatory; prompt-time daemon-down acceptance was new.
- Confidence: High that the dual-failure acceptance test is missing; medium on severity because it can be added to phase 3 or phase 2.

## Reflection

- What worked and why: Checking hook registration timeouts turned a theoretical failure mode into a concrete acceptance gap.
- What did not work and why: Cross-workstream socket searches were noisy because older research logs mention many legacy sockets.
- What I would do differently: Add a shared-infra checklist to phase 3 when the phase opens.

## Ruled Out

- Literal socket collision across the three MCP services.

## Dead Ends

- Cross-workstream simultaneous multi-daemon auto-spawn is not fully modeled in the code-index phase, but no line-level evidence showed a current collision. Treat as P2 watchlist, not P1.

## Recommended Next Focus

LENS-5: adversarial residual sweep for contradictions, stale notes, and day-one implementation traps.
