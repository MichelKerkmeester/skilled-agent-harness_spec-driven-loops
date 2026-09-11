# Resource Map — deepseek-research lineage

Evidence-derived inventory of the sources this lineage actually consulted, emitted at synthesis from the converged deltas. Counts are of *consulted items*, not of repository inventory.

---

## READMEs

**0 items.** No README was load-bearing; package READMEs were read only as rename evidence (`runtime/README.md` exists at the renamed package root and was noted for R3).

## Documents

**11 packet documents.** Parent `goal.md` and `spec.md`; `001/goal.md`, `002/goal.md`, `003/goal.md`, `004/goal.md`, `005/goal.md`; `006/implementation-summary.md`, `007/goal.md`, `007/implementation-summary.md`, `008/latency-delta.md`; `010/prompts/research-target.txt`. Plus one sibling-lineage document: `009/review/lineages/deepseek-review/iterations/iteration-001.md`.

*Theme:* phase goal logs carry the failure findings; implementation summaries carry the rename and sweep evidence; the sibling review independently found the live doctor residue.

## Commands

**2 command surfaces.** `.opencode/commands/doctor/scripts/mcp-doctor.sh` (present-tense residue: `servers=(system_skill_advisor code_mode)`, stale `mcp-server/node_modules` messages at `:300,:303,:399`) and `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml` (still enumerates the advisor as a supported MCP server).

*Theme:* the operator-facing diagnostic surfaces are where the residue is both present-tense and consequential.

## Agents

**0 items.** No agent definition was consulted; the study is artifact- and code-based.

## Skills

**3 skill packages.** `system-skill-advisor` (the subject: `hooks/`, `runtime/`, `references/config/`, `references/runtime/`, `feature-catalog/`, `manual-testing-playbook/`), `system-spec-kit` (the cross-package hook path, the retrieval fixture, the trigger index, the shared IPC bridge, the freshness lib), and `system-deep-loop` (the loop contract this lineage executes).

*Theme:* every cross-package class in the study originates in the second package, which the migration did not own.

## Specs

**2 packets.** `system-skill-advisor/025-mcp-decommission-cli-front-door` (the case study, phases 001-010) and this lineage's own packet `010-deep-research-residue`.

*Theme:* the packet's own record is a first-class object of study, not just a source of facts.

## Scripts

**7 executable sources.** `.opencode/bin/skill-advisor.cjs`; `.opencode/bin/system-skill-advisor-launcher.cjs`; `.opencode/bin/lib/launcher-ipc-bridge.cjs`; `.opencode/hooks/shared/hook-flags.cjs`; `.opencode/plugins/system-skill-advisor.js`; `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`; `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs`.

*Theme:* the fallback helper and the bridge owner are the two files that carry the latent-failure class; `hook-flags.cjs` carries the working alias-table mitigation.

## Tests

**9 test surfaces.** `runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`; `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`; `runtime/tests/rename-invariants.vitest.ts`; `runtime/tests/system-skill-advisor-plugin.vitest.ts`; `runtime/tests/skill-advisor-cli-dual-client.vitest.ts`; the deleted `runtime/tests/compat/plugin-bridge.vitest.ts` and `plugin-bridge-smoke.vitest.ts`; the deleted `runtime/tests/parity/cli-vs-mcp-parity.cjs`; `.opencode/skills/system-spec-kit/runtime/tests/launcher-ipc-bridge-probe.vitest.ts`; `.opencode/plugins/tests/system-skill-advisor.test.cjs`; `.opencode/bin/cli-exit-taxonomy-smoke.cjs`.

*Theme:* the coverage boundary is drawn at components, not at the seam; the owner's two-input derivation test exists while the cross-seam equality test does not.

## Config

**7 configuration surfaces.** The five runtime MCP declarations as they existed before deregistration (`opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json`, recovered via `git show eb53802beb`); this lineage's `deep-research-config.json`; the packet's `graph-metadata.json` files as rename evidence.

*Theme:* the deleted blocks carried policy values and documentation keys, not only transport wiring.

## Meta

**History and live state.** 13 commits examined (`1d900a17bf`, `0d19afb4e86`, `19e1ffedaf0`, `e8d564ca98`, `7920288acb`, `3feab865ea`, `eb53802beb`, `077dbf804d`, `f4bf73e682`, `3def6d6c9b`, `91fd9b6226`, `9015d00c79`, `afd10f291f`); the live filesystem at `/tmp/system-skill-advisor/`; and measured greps (603 `mcp-server/` markdown references by area, 3 retired tool ids repo-wide, 6 alias-collapse code sites).

*Theme:* provenance and live state, not the record, are what settled every disputed claim in this study.
