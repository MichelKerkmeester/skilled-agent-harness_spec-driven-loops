
## Row 75 (ambiguous)
- Doc: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/011-deep-research-swe-2/research/lineages/swe-2-research/iterations/iteration-003.md:33`
- Citation: `acceptance-criteria.md:63`
- Candidates: `.skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md`, `.skilled/skills/system-spec-kit/templates/examples/level-3+/acceptance-criteria.md`, `.skilled/skills/system-spec-kit/templates/examples/level-3/acceptance-criteria.md`, `specs/agents/006-restraint-and-routing-gates/acceptance-criteria.md`, `specs/agents/007-orchestrator-inline-authority/acceptance-criteria.md`, `specs/agents/008-orchestrate-external-cli-delegation/acceptance-criteria.md`, `specs/agents/009-turn-closeout-next-steps/001-deep-research/acceptance-criteria.md`, `specs/agents/009-turn-closeout-next-steps/002-decision-and-design/acceptance-criteria.md` and 471 more

```text
**C7. Generated-artifact residue.** The committed trigger index carried stale paths into the renamed directories until regenerated (`f5c55c7eb8` "regenerate the trigger index after the advisor rename") — a generated artifact has to be regenerated, not edited; hand-editing corrupts it. Verified: the current index's 56 `mcp-server` hits are all other skills'/specs' (mcp-server-dir-and-manifest-closure, mcp-servers feature docs); zero for `system-skill-advisor/mcp-server`. Same class: `dist/` outputs — the launcher resolves `runtime/dist/runtime/advisor-server.js`, so a rename invalidates every r…

…24 historical files keep the old name by design" on the non-specs tree. [SOURCE: command:`git show afd10f291f`] [SOURCE: file:manual-testing-playbook/auto-indexing/sanitizer-boundaries.md:73-110] [SOURCE: command:`git grep -l system-skill-advisor/mcp-server` bucketed by directory] [SOURCE: file:008 acceptance-criteria.md:63]…

**C9. Negative-guard residue — references that must keep the name.** `skill-advisor-route-contract.test.cjs:142` asserts `!read(docPath).includes('mcp__system_skill_advisor__')` — the retired id kept in the test precisely to guard its absence; the three inverted contract tests do the same. Phase 007's own sweep rules list this class as exempt. [SOURCE: file:.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:142] [SOURCE: file:007-docs-and-residue-sweep/spec.md:174-176]
```

