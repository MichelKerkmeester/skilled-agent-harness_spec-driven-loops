# Gap Audit Synthesis - gpt-gap Lineage

- **Date:** 2026-06-06
- **Session:** `fanout-gpt-gap-1780758133910-bbnvan`
- **Loop:** deep-research fan-out lineage, five forced audit lenses
- **Stop reason:** `maxIterationsReached`
- **Verdict:** GAP_REGISTER. No P0 blockers found; seven P1 gaps should be fixed before implementation starts.

## 1. Executive Verdict

The workstream is still viable. The GO verdict for an additive generated 9-tool skill-advisor CLI holds: MCP stays registered, the Python script remains a legacy recommendation facade, hooks stay warm-only, and implementation can remain three packets [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/research.md:11], [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/spec.md:100].

The gap audit found no P0s. It did find P1 packet gaps that would make phase planning brittle: resident daemon-service semantics are under-owned, D7/Devin config traceability is inconsistent, Gemini exclusion is implicit rather than documented, phase 3 lacks concrete runtime file inventory, cross-daemon stress is missing, latency acceptance conflates scenarios, and combined MCP+daemon outage behavior is not pinned.

## 2. Gap Register

| ID | Sev | Gap | Evidence | Fix |
|---|---|---|---|---|
| G1 | P1 | Resident-service semantics are not all explicitly owned by phase requirements/tasks. | Research names watcher, prompt cache, trust-state daemon evidence, telemetry/shadow sink, IPC bridge, and embedder resolution as resident capabilities [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:31]. Phase 2 covers watcher/dual-client [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:96], and phase 3 covers warm hooks [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:93], but telemetry/shadow sink, status trust-state split, and embedder resolution are not requirement-level. | Add explicit phase requirements/tasks for status trust evidence, telemetry/shadow diagnostics preservation, and graph embedder-resolution behavior under CLI scan/rebuild. |
| G2 | P1 | D7 traceability is inconsistent around Devin. | Research D7 acceptance names OpenCode/Codex/Claude configs [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:89]. Phase 3 requires configs unchanged across OpenCode/Codex/Claude/Devin [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:126]. Devin has `mk_skill_advisor` in `.devin/config.json` [SOURCE: file:.devin/config.json:37], while `.devin/config.local.json` carries a narrower MCP set [SOURCE: file:.devin/config.local.json:8]. | Expand D7/phase-3 trace to name Devin, and define whether `.devin/config.local.json` is an overlay, override, or out of scope for unchanged-config verification. |
| G3 | P1 | Gemini exclusion is not explicitly documented in the implementation packet. | Program scope requires Claude Code, Codex, Devin, and OpenCode plugin [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:117]. A Gemini advisor hook exists [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts:3]. Phase 3 names Claude/Codex/Devin only but does not state that Gemini is deliberately excluded [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:93]. | Add an explicit phase-3 out-of-scope note: Gemini hook CLI fallback is deliberately excluded from this workstream and should not block acceptance. |
| G4 | P1 | Phase 3 lacks a concrete configured-file inventory. | Phase 3 names broad surfaces [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:93]. Actual inventory includes Codex settings [SOURCE: file:.codex/settings.json:14], Claude settings [SOURCE: file:.claude/settings.local.json:31], Devin hooks [SOURCE: file:.devin/hooks.v1.json:1], OpenCode plugin [SOURCE: file:.opencode/plugins/mk-skill-advisor.js:710], and advisor bridge [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:276]. | Add a phase-3 inventory table for hook configs, shim paths, target hook implementations, plugin/bridge, MCP configs, doctor YAMLs, allowlists, and docs. |
| G5 | P1 | Missing cross-daemon stress gate for simultaneous CLI auto-spawn. | The bin layer owns three launchers and shared supervision/bridge/allowlist behavior [SOURCE: file:.opencode/bin/README.md:14], [SOURCE: file:.opencode/bin/README.md:20]. Worktree-session rewrites DB/socket placement for isolated sessions [SOURCE: file:.opencode/bin/README.md:137]. Phase 2 only requires MCP + CLI against one daemon [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:126]. | Add a hardening test or drill for simultaneous spec-memory, code-index, and skill-advisor CLI auto-spawn in one runtime/worktree environment. |
| G6 | P1 | Phase-3 latency acceptance conflates cache-hit p95, warm-daemon non-cache, and cold/transport-down fail-open. | Research measured one-shot local 74.9ms and native 824.8ms [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/research.md:22]. It requires warm daemon, in-process compat, or cache for hooks [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/research.md:29]. Phase 3 asks for CLI path with MCP stopped within cache-hit p95 <60ms [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:119]. | Split acceptance into three checks: cache-hit p95 <60ms, warm-daemon non-cache ceiling, and cold/transport-down fail-open behavior. |
| G7 | P1 | Combined outage behavior is not explicitly accepted. | Phase 3 requires plugin CLI fallback with MCP stopped [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:120]. Phase 1 requires auto-spawn from a stopped daemon [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:126]. Hooks fail open on unhandled exceptions [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts:198]. | Add explicit expected behavior for MCP down + daemon auto-spawn failure: hook output, plugin output, diagnostics, exit code, and fail-open/fail-closed boundary. |
| G8 | P2 | Gemini hook docs have source-path drift, increasing confusion around the deliberate exclusion. | Gemini feature catalog points at system-spec-kit hook implementation [SOURCE: file:.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/gemini-hook.md:29], while active implementation is system-skill-advisor [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts:3] and system-spec-kit has a shim [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:5]. | Fix the Gemini catalog/playbook source paths or reference the shim explicitly. |
| G9 | P2 | Phase-2 parity-fixture text has a truncated parenthetical. | Plan row truncates the 10/10 parity phrase [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/plan.md:72], and task row repeats it [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/tasks.md:57]. | Close the parenthetical and keep the acceptance wording exact. |

## 3. Clean Checks

- All nine tools have a phase-1 owner through generated subcommands [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:119].
- Mutating command fail-closed behavior is owned by phase 1 and fixture-locked by phase 2 [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:120], [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:125].
- Core phase sequencing is coherent and phase-gated [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/spec.md:115].
- The OpenCode plugin fallback is in scope [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:94].
- No contradiction was found in the additive dual-stack verdict [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/research.md:11].

## 4. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Mark the workstream NO-GO | No P0 was found; gaps are documentation/acceptance hardening items. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/spec.md:100] | 5 |
| Require Gemini implementation | Operator excluded Gemini from required implementation scope; issue is missing documentation. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/gap-audit/deep-research-strategy.md:22] | 3 |
| Treat planned placeholder file inventory as a blocker | Plans explicitly defer inventory expansion to speckit:plan. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/plan.md:84] | 1 |
| Report MCP removal/reference migration | Program non-goal or deferred 004+ work. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:84], [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:105] | 1-5 |

## 5. Convergence Report

Stop reason: `maxIterationsReached`.

Iterations completed: 5/5.

Questions answered: 5/5.

Average newInfoRatio trend: `[0.88, 0.76, 0.82, 0.64, 0.72]`.

Composite stop score was not used because `convergenceThreshold` was pinned to 0 and the operator requested the forced five-lens cap.

Legal-stop gates: pass for max-iteration synthesis.

Graph gates: not applicable.

## 6. References

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/research.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/{001-cli-core,002-hardening-and-tests,003-runtime-integration}/{spec.md,plan.md,tasks.md}`
- Runtime configs and hooks cited in the gap register
