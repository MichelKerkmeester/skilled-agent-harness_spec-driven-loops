# Iteration 5: LENS-5 Adversarial Residual Sweep

## Focus

Search for contradictions, hedged claims presented as settled, missing failure modes, and day-one traps for implementers.

## Findings

1. P1 GAP: phase-3 latency acceptance conflates three different scenarios. Research measurements show one-shot local at 74.9ms, one-shot native at 824.8ms, health/validate around 50-74ms, and batch startup amortization around 276ms [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/research.md:22]. The same synthesis says prompt-submit hooks must use warm daemon, in-process compat, or cache, never one-shot native bridge [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/research.md:29]. Phase 3 acceptance asks each runtime to demonstrate CLI path once with MCP stopped within the existing cache-hit p95 <60ms bar [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:119]. It should split acceptance into cache-hit p95, warm-daemon non-cache, and cold/transport-down fail-open drills.

2. P1 GAP: the "both MCP and daemon down" failure mode is not explicitly accepted. Phase 3 requires plugin CLI fallback with MCP transport stopped [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:120], and phase 1 requires auto-spawn from a stopped daemon [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:126]. No phase acceptance states the expected user-visible behavior when both MCP transport and daemon auto-spawn fail or time out. The hook adapters are fail-open by design [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts:198], so the packet should codify fail-open output and diagnostics for this combined outage.

3. P2 GAP: docs for Gemini hook assets point at the wrong source tree. The Gemini feature catalog names `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` as implementation [SOURCE: file:.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/gemini-hook.md:29], while the active advisor hook implementation is in `system-skill-advisor` [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts:3] and system-spec-kit contains a shim that delegates to it [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:5]. This is not a required implementation gap because Gemini is excluded, but it increases confusion around the exclusion.

4. P2 GAP: phase-2 task text has a truncated parenthetical that will likely confuse checklist expansion. The plan says "the research measured 10/10" without closing the parenthetical [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/plan.md:72], and the task row repeats the truncation [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/tasks.md:57]. This is not behavioral, but it is a low-cost pre-implementation doc repair.

5. No contradiction found on the core verdict. Parent, phase-000 synthesis, and implementation phases all agree on additive dual-stack, MCP retained, generated 9-tool CLI, Python as facade, and three implementation packets [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/spec.md:100], [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/research.md:11], [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:84].

## Sources Consulted

- Phase-000 research synthesis
- Phase 1 and phase 3 specs
- Devin hook implementation
- Gemini feature catalog, shim, and implementation
- Phase 2 plan and tasks

## Assessment

`newInfoRatio`: 0.72. Residual sweep found concrete acceptance ambiguity and combined-outage behavior not yet pinned.

Confidence: high on latency ambiguity and combined-outage gap; high on minor doc drift.

## Reflection

What worked: comparing acceptance text to measured timings exposed a real ambiguity. What failed: no live cold-start drill was possible under read-only constraints. Ruled out: contradiction in the GO verdict itself.

## Recommended Next Focus

Synthesis: produce final gap register and verdict.
