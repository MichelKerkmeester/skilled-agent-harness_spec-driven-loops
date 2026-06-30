---
title: "Changelog: Implement the improvement-research findings [117-parent-nested-skill-pattern/004-improvement-implementation]"
description: "Chronological changelog for the improvement-research implementation phase."
trigger_phrases:
  - "phase changelog"
  - "improvement implementation"
  - "routing guarantee"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/004-improvement-implementation` (Level 3)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern`

### Summary

The 5-iteration improvement research judged the deep-loop architecture SOUND, so this phase implemented the actionable findings rather than rearchitecting the system. The headline is that the C-plus routing guarantee is now real.

Before this phase, the guarantee existed only as a drift-guard test that nothing ran, so hardcoded advisor projection maps could silently diverge from `mode-registry.json`. The work split into four independent clusters plus the orchestrator and landed across six commits.

### Added

- Cluster A added `/doctor` advisor-sync coverage: check 4b canonical exact-match and 4c non-canonical coverage warning for inert lexical modes in `.opencode/commands/doctor/scripts/parent-skill-check.cjs` at commit `b08346a9bc`.
- Cluster B added the runtime's own `package.json`, force-added past `.opencode/.gitignore`, with pinned `better-sqlite3` `12.10.0`, `zod` `4.4.3` and `tsx` `4.21.0`, plus `package-lock.json`, standalone `vitest.config.ts` and `dependency-seams.vitest.ts` guard under `.opencode/skills/deep-loop-runtime/` at commit `07fda483b8`.
- All actionable findings were implemented. Only deliberately deferred codegen, finding 3, remains as a tracked follow-on.
- `CHK-010 Edits stay invariant-preserving`, with one identity, no mode behavior change beyond added safety and runtime stays MCP-free.
- `CHK-030 No secrets introduced` was recorded.
- `CHK-041 Decision rationale captured`, covering lightweight CI, keep-maps-plus-guard, seam-guard strengthening, force-add manifest and re-anchor benchmark counts.

### Changed

- Read the per-finding research verdict and confirmed SOUND-architecture and no-rearchitecture framing in `../improvement-research/improvement-research.md`.
- Assigned Cluster A to the orchestrator and Clusters B, C and D to worktree agents as independent and reversible work.
- Cluster A authored the PR CI gate at `.github/workflows/routing-registry-drift.yml` at commit `b08346a9bc`.
- Cluster C routed research, review and AI Council through the promoted `loop-lock.cjs`, added race-safe `tryReclaimStaleLoopLock` through atomic rename and added atomic fan-out-merge write under `.opencode/skills/deep-loop-runtime/scripts/` at commit `3b60619fd5`.
- Cluster B replaced 12 `system-spec-kit/node_modules` reach-ins with bare specifiers: 5 `lib` TypeScript `zod` and `better-sqlite3` imports, plus 7 script `tsx-loader` path `resolve(...)` calls changed to `require.resolve('tsx')` under `.opencode/skills/deep-loop-runtime/lib/` and `.opencode/skills/deep-loop-runtime/scripts/` at commit `07fda483b8`.
- Ran the deep-loop-runtime standalone suite with expectation 349 of 349 and system-spec-kit changed-import tests with expectation 17 green.

### Fixed

- Cluster D added lifecycle-taxonomy drift-guard, `userPaused` as the 7th `stopReason`, advisory benchmark mode-precision signal, stale `@deep-ai-council` to `@ai-council` doc fix and runtime_capabilities conformance test under `.opencode/skills/deep-loop-runtime/` at commit `3b60619fd5`.
- CI viability fix rewrote the gate off `npm ci`, because of untracked manifest, file sibling and native or ML deps, onto `npx --yes vitest@4.1.6` plus `actions/setup-python` in `.github/workflows/routing-registry-drift.yml` at commit `71a066c004`.
- Phase-1 rename completion repointed 4 stale runtime references left by the 152 to 155 rename: `graph-metadata` derived edges, `host-driven-improvement`, `prompt-pack` and `runtime-capabilities` vitest fixtures at commit `808b746366`.
- Skill-benchmark Lane C restore fixed the 5-file skills-root depth resolution, `SKILLS_DIR` up-3 to up-4 and `REPO_SKILLS` up-1 to up-2, the deep-improvement e2e `--fixtures-dir agent-improve-001` and 3 stale parser anchors, `sk-code` playbook 24 to 28, at commit `216e9448d8`.
- `CHK-064 P2 hardening landed with guard tests` was recorded.
- `CHK-065 Phase-1 rename completion + Lane C restore land green at HEAD` was recorded.

### Verification

| Check | Result |
|-------|--------|
| Task completion | PASS: 19 completed task item(s) recorded. |
| Research framing | PASS: Per-finding verdict read and SOUND-architecture with no-rearchitecture framing confirmed. |
| Invariant preservation | PASS: `CHK-010` recorded, with one identity, no mode behavior change beyond safety and runtime stays MCP-free. |
| Decision rationale | PASS: `CHK-041` recorded. |
| Runtime standalone suite | PASS: Expected 349 of 349. |
| Changed-import tests | PASS: Expected 17 green. |
| P2 hardening | PASS: `CHK-064` recorded, with guard tests. |
| Rename and Lane C restore | PASS: `CHK-065` recorded, with both green at HEAD. |
| Secret scan discipline | PASS: `CHK-030 No secrets introduced` recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/improvement-research/improvement-research.md` | Read | Per-finding research verdict confirmed SOUND architecture and no rearchitecture. |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Updated | Added advisor-sync coverage checks 4b and 4c. |
| `.github/workflows/routing-registry-drift.yml` | Created/Updated | Added PR CI drift gate and rewrote it onto `npx --yes vitest@4.1.6` plus `actions/setup-python`. |
| `.opencode/skills/deep-loop-runtime/package.json` | Created | Added runtime-local package manifest with pinned `better-sqlite3`, `zod` and `tsx`. |
| `.opencode/skills/deep-loop-runtime/package-lock.json` | Created | Added runtime-local lockfile. |
| `.opencode/skills/deep-loop-runtime/vitest.config.ts` | Created | Added standalone runtime test config. |
| `.opencode/skills/deep-loop-runtime/dependency-seams.vitest.ts` | Created | Added dependency seam guard. |
| `.opencode/skills/deep-loop-runtime/lib/` | Updated | Replaced `system-spec-kit/node_modules` reach-ins with bare specifiers. |
| `.opencode/skills/deep-loop-runtime/scripts/` | Updated | Promoted loop lock routing, added atomic stale-lock reclaim, added atomic fan-out merge write and replaced `tsx-loader` reach-ins. |
| `.opencode/skills/deep-loop-runtime/` | Updated | Added lifecycle taxonomy guard, `userPaused`, benchmark mode-precision signal, doc fix and runtime capabilities conformance test. |
| `.opencode/skills/deep-loop-workflows/graph-metadata.json` | Updated | Repointed stale derived edges left by rename. |
| `.opencode/skills/deep-loop-runtime/` | Updated | Repointed stale `host-driven-improvement`, `prompt-pack` and `runtime-capabilities` vitest fixture references. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/` | Updated | Restored skill-benchmark Lane C path resolution and e2e fixture path. |
| `.opencode/skills/sk-code/` | Updated | Fixed 3 stale parser anchors from playbook 24 to 28. |

### Follow-Ups

- Registry codegen, finding 3 and the i01 top pick, is deferred. The projection maps are still hand-maintained, but CI gate A4 and advisor-sync coverage check A3 make drift reliably caught, so codegen is a low-urgency follow-on rather than a current gap. It must byte-match the current maps, which is why it was staged for careful separate work.
- Advisor-sync coverage for non-canonical lexical modes is a warning, not a failure. A scaffolded second parent skill with a lexical mode whose `legacyAdvisorId` is absent from the advisor map is structurally valid with exit 0 while advisor wiring is pending. Only the canonical skill asserts exact equality.
- CI exercises the routing surface, not the full advisor install. The lightweight gate is justified by that surface being dependency-free, and it does not stand up the `system-skill-advisor` MCP server.
