# Iteration 2: Doctor Command Family — ROUTER.md Audit Coverage

## Focus

Audit the `.opencode/commands/doctor` family for legacy `shared/references/smart-routing.md`
assumptions and root ROUTER.md two-state contract validation coverage: `_routes.yaml`,
`speckit.md` (router), `doctor-parent-skill.yaml`, `parent-skill-check.cjs` (per-hub audit),
`ci-skill-root-metadata.cjs` (fleet class gate), `doctor-runtime-mirrors.yaml`,
`doctor-update.yaml`, `doctor-mcp*`/`mcp-doctor.sh`, and whether any route audits root
ROUTER.md across the seven hubs fleet-wide.

## Findings

1. **Per-hub root ROUTER.md validation EXISTS via parent-skill-check.cjs check 12 (conformant).**
   `parent-skill-check.cjs:1289-1400` implements the root-router two-state check: it loads the
   shared `sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` library (RRC codes),
   scans `LEGACY_ROUTER_PATHS` for coexistence, reads hub-router.json defaultResource for
   legacy-residue (RRC-008), and runs `validateRootRouter` with a hub-contained resolveOnDisk
   probe. Covered by `parent-skill-check-root-router.test.cjs` (which also fixtures the legacy
   coexistence case at line 274 and the legacy default-residue case at line 324).
   `doctor-parent-skill.yaml` routes to this script (`upstream_assets.audit_script`).
   [SOURCE: file:.opencode/commands/doctor/scripts/parent-skill-check.cjs:1289-1400]
   [SOURCE: file:.opencode/commands/doctor/assets/doctor-parent-skill.yaml:59,100]

2. **The fleet class gate `ci-skill-root-metadata.cjs` has ZERO root ROUTER.md awareness (functional gap).**
   Grep over the script returns no hits for ROUTER.md / router_state / smart-routing / root-router.
   It classifies every skill root against `skill-root-metadata-contract.cjs` and enforces
   required/forbidden files, overlays, one advisor identity, and manifest freshness — but the
   class-H contract (CLASS_HUB = 'H') does not include the root ROUTER.md two-state contract.
   Since `doctor-parent-skill.yaml` runs this fleet gate FIRST (before the per-hub deep audit)
   and it is the ONLY fleet-wide root scan in the doctor family, a hub whose root ROUTER.md is
   missing/malformed/dual-source is not flagged fleet-wide by the doctor route — only the
   per-hub check 12 catches it when an operator names that specific directory.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:15-28]
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:22,59]
   [SOURCE: file:.opencode/commands/doctor/assets/doctor-parent-skill.yaml:150-151]

3. **No doctor route audits root ROUTER.md across all seven hubs in one sweep (functional gap).**
   `_routes.yaml` parent-skill route runs `ci-skill-root-metadata.cjs` (fleet, ROUTER-blind) then
   `parent-skill-check.cjs "{parent_skill_dir}"` (one directory, ROUTER-aware). No route targets
   "all class-H hubs" or "the seven hubs" for the ROUTER.md two-state contract. The research
   brief explicitly asked whether a doctor route should now audit root ROUTER.md across the
   seven hubs — today none does. The minimal fix is either (a) add ROUTER.md contract validation
   to `ci-skill-root-metadata.cjs`'s class-H branch (the fleet gate), or (b) add a doctor
   fleet-ROUTER sweep route that runs root-router-contract.cjs over every discovered hub root.
   [SOURCE: file:.opencode/commands/doctor/_routes.yaml:139-158]

4. **Doctor route markdowns and remaining YAMLs carry no legacy smart-routing references (conformant).**
   `speckit.md`, `update.md`, `mcp.md`, `doctor-runtime-mirrors.yaml`, `doctor-update.yaml`,
   `doctor-skill-advisor.yaml`, `doctor-skill-graph-freshness.yaml`, `doctor-skill-budget.yaml`,
   `mcp-doctor.sh`, `mcp-doctor-lib.sh`, and `skill-graph-freshness.cjs` all return zero hits for
   smart-routing / ROUTER.md / router_state. No diagnostic or repair assumes the legacy path.
   The only doctor-family "smart-routing" string hits are in test fixtures for the root-router
   check (`parent-skill-check-root-router.test.cjs:274,324`), which are legitimate legacy-scenario
   fixtures, not stale authoring.
   [SOURCE: command:grep -n "smart-routing|ROUTER|router_state" over .opencode/commands/doctor]

5. **doctor-runtime-mirrors.yaml correctly excludes skill ROUTER.md from mirror scope (conformant, note).**
   The route mirrors agent/command/prompt/hook surfaces across .claude/.codex/.cursor/.devin.
   Root ROUTER.md lives inside `.opencode/skills/*/` and is not a cross-runtime mirrored surface,
   so its absence from the mirror checkers is correct, not a gap.
   [SOURCE: file:.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:52-60]

## Dead Ends

- **doctor-update.yaml as a ROUTER.md surface:** ruled out — it is a DB rebuild orchestrator
  (context-index, skill-graph, deep-loop-graph, eval) with mutation boundaries explicitly
  forbidding `.opencode/skills/**/SKILL.md` and graph-metadata writes; ROUTER.md is out of its scope.
- **mcp-doctor / mcp.md as ROUTER.md surfaces:** ruled out — they diagnose MCP server
  install/boot, not skill hub structure.

## Assessment

- newInfoRatio: 0.75
- noveltyJustification: Confirmed the per-hub check 12 exists and is robust, but discovered the
  two real gaps the brief predicted: the fleet class gate is ROUTER-blind, and no doctor route
  sweeps the seven hubs' root ROUTER.md contracts. All legacy-string hits in the family are
  legitimate fixtures.
- confidence: HIGH (80%+) — direct script reads + grep sweeps; check 12 code read in full.

## Reflection

- What worked: separating per-hub coverage (check 12, present) from fleet-wide coverage (absent);
  the brief's Q2 "should any doctor route now audit root ROUTER.md across the seven hubs" maps
  exactly to finding 3.
- What failed: the initial grep tool query on a single file returned matches from sibling files
  (tool path quirk), so re-verified with direct `grep -n` on the specific scripts.
- Ruled out: doctor-update and mcp-doctor as ROUTER.md surfaces.

## Recommended Next Focus

Other surfaces: CI scripts (ci-skill-root-metadata.cjs already scanned — now ci-leaf-manifest-freshness.cjs
and ci-skill-derived-freshness.cjs), skill advisor metadata/index, and validators — check each for
legacy smart-routing references and root ROUTER.md awareness; also verify whether the fleet gates
refer to the seven hubs' ROUTER.md.
