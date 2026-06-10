# Gap Audit: spec-memory CLI Workstream - gpt-gap

## Executive Verdict

**NUMBERED GAP REGISTER.** No P0 implementation blocker was found. The CLI core and hardening phases are coherent enough to open normal planning. Two P1 gaps should be fixed before phase 3 runtime-integration planning proceeds:

1. Codex live hook registration is misaligned with the phase-3 Codex adapter target.
2. Gemini exclusion is undocumented and contradicted by phase-3 allowlist wording.

## Gap Register

| ID | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| GAP-001 | P1 | Codex phase-3 scope names `hooks/codex/session-start`, but the live workspace `.codex/hooks.json` invokes Claude hook scripts. | Phase 3 names Codex `hooks/codex/session-start` [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:97]. Codex readiness requires live hooks registration [SOURCE: file:.opencode/skills/system-spec-kit/references/config/hook_system.md:35], and the Codex startup entrypoint is `hooks/codex/session-start.ts` [SOURCE: file:.opencode/skills/system-spec-kit/references/config/hook_system.md:130]. The template points at Codex hooks [SOURCE: file:.codex/settings.json:8], but `.codex/hooks.json` points at Claude `compact-inject`, `session-prime`, and `user-prompt-submit` [SOURCE: file:.codex/hooks.json:9] [SOURCE: file:.codex/hooks.json:21] [SOURCE: file:.codex/hooks.json:32]. | Add `.codex/hooks.json` rewiring/verification to phase 3, or explicitly state that live hook registration is separately owned and name that owner. Smoke the CLI-backed path against the live hook file, not only the template. |
| GAP-002 | P1 | Gemini exclusion is not documented; phase 3 currently includes Gemini in scope. | Program-wide runtime pairing names Claude Code, Codex, Devin, and OpenCode plugin surfaces [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/spec.md:117] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/spec.md:118]. Phase 3 lists Gemini settings as a dependency and Gemini allowlisting in scope [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:66] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:96]. | Either remove Gemini from phase 3 and document it as a deliberate non-goal, or promote Gemini to a real requirement with concrete files and acceptance criteria. |
| NOTE-001 | P2 | Phase 3 should enumerate live runtime config paths during planning. | Claude live hooks are in `.claude/settings.local.json` [SOURCE: file:.claude/settings.local.json:31]. Devin live hooks are in `.devin/hooks.v1.json` [SOURCE: file:.devin/hooks.v1.json:1]. OpenCode plugin entrypoints are under `.opencode/plugins/` [SOURCE: file:.opencode/plugins/README.md:40]. | Add a concrete runtime-config checklist to phase 3 planning: `.claude/settings.local.json`, `.codex/hooks.json`, `.codex/settings.json`, `.devin/hooks.v1.json`, `.opencode/plugins/`, and the spec-memory plugin bridge path. |
| NOTE-002 | P2 | Cross-workstream socket-default parity should be tracked at the program level. | Spec-memory explicitly requires an unset socket dir to default under `/tmp/mk-spec-memory` and reject overlong Darwin socket paths [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:101]. The shared bridge otherwise falls back to the service DB dir when `SPECKIT_IPC_SOCKET_DIR` is unset [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:59]. Sibling code-index and skill-advisor core specs name connect/auto-spawn but do not carry equivalent short-default acceptance wording [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:97] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:94]. | Track as a program-level checklist item so every future CLI shim has a per-service short socket default outside MCP-config env. Spec-memory itself is already covered. |

## Clean Findings

- The 37-tool CLI surface is owned by phase 1, and phase 2 owns the all-37 parity suite [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:127] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md:136].
- All D-series deltas are owned. Research lists D1-D7 and DD-001 [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:176]; phase 1 owns flag/socket/dist-freshness deltas [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:137], while phase 2 owns the race/coexistence/lifecycle/parity/doc suites [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/tasks.md:57].
- The OpenCode spec-memory plugin is not an unowned gap. The program parent says to create it [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/spec.md:118], and phase 3 tasks own the new plugin plus bridge [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/tasks.md:63].
- Estimate arithmetic holds: phase 1 5-6d, phase 2 3-4d, phase 3 2-3d totals 10-13d [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md:105] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md:106] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md:107].
- Major failure modes are covered: phase 1 auto-spawn from a dead socket [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:129], phase 2 divergent socket race coverage [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/tasks.md:57], and phase 3 transport-down fallback verification [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:131].

## Convergence

The lineage ran the forced five iterations:

| Iteration | Lens | newInfoRatio |
|---|---|---:|
| 1 | Coverage cross-check | 0.82 |
| 2 | Delta/requirement traceability | 0.74 |
| 3 | Runtime pairing completeness | 0.90 |
| 4 | Sequencing/shared infra | 0.58 |
| 5 | Residual sweep | 0.62 |

Stop reason: `maxIterationsReached`.

## References

- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`
- `iterations/iteration-004.md`
- `iterations/iteration-005.md`
- `deep-research-state.jsonl`
- `deep-research-findings-registry.json`
