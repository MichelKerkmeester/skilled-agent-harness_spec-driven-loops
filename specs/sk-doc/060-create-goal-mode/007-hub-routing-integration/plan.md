---
title: "Implementation Plan: Phase 7: hub-routing-integration"
description: "Register sk-create-goal across the sk-doc mode registry, hub router and surface router, then update advisor and human-facing hub metadata. Prove both routing stages with positive, out-of-domain and fixed ten-prompt newcomer replays, and regenerate the leaf manifest from its owner script."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: hub-routing-integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON routing metadata and Markdown router documents |
| **Framework** | sk-doc's advisor-to-hub two-stage workflow routing (.skilled/skills/sk-doc/SKILL.md:50-64) |
| **Storage** | None; the leaf manifest is generated from the registry and on-disk packet leaves (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:232) |
| **Testing** | Advisor CLI, compiled-route CLI, leaf-manifest generator/check and explicit-path parent-skill check |

### Overview
This phase plans how sk-create-goal will connect to every named sk-doc hub routing surface after phases 002-006 produce its packet, without implementing the mode or command. It records a ten-prompt baseline, wires both routing stages, regenerates the leaf manifest and replays positive and negative requests before handoff to phase 008 (specs/sk-doc/060-create-goal-mode/spec.md:100-109,127-149).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and the seven-file hub boundary are defined in spec.md.
- [x] Success criteria are observable as command exits, route targets and ten-prompt counts.
- [x] Dependencies and the unresolved leaf-path timing are recorded in spec.md and this plan.

### Definition of Done
- [ ] Every acceptance criterion is verified in acceptance-criteria.md.
- [ ] The advisor and compiled-route replays, generator check and explicit-path parent-skill check pass.
- [ ] The phase's routing evidence is recorded in implementation-summary.md.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-stage metadata routing with separate stage-one hub selection and stage-two mode/leaf selection (.skilled/skills/sk-doc/SKILL.md:50-64).

### Key Components
- **Stage one**: `graph-metadata.json` makes goal-authoring vocabulary visible to the single sk-doc advisor identity; `mode-registry.json` and `hub-router.json` resolve that request to `sk-create-goal` (.skilled/skills/sk-doc/graph-metadata.json:54-69; .skilled/skills/sk-doc/mode-registry.json:17-18; .skilled/skills/sk-doc/hub-router.json:49-50).
- **Stage two**: root `ROUTER.md` selects the mode's real packet leaves, `leaf-manifest.json` supplies generated typed inventory, and `SKILL.md` plus `description.json` expose the mode to readers and hub tooling (.skilled/skills/sk-doc/ROUTER.md:136-164,166-373; .skilled/skills/sk-doc/SKILL.md:25-39; .skilled/skills/sk-doc/description.json:2-50).

### Data Flow
A goal-authoring prompt first reaches the sk-doc identity through advisor vocabulary. The hub then uses `mode-registry.json` and `hub-router.json` to select `sk-create-goal`, after which `ROUTER.md` maps the request to existing packet leaves. The advisor chooses the hub and the hub router chooses the mode; neither stage substitutes for the other (.skilled/skills/sk-doc/SKILL.md:50-64; .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:53-60).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-doc/mode-registry.json` | Mode source of truth | Add one workflow entry with template-scaffold backend, tool surface, `/create:goal`, aliases and metadata class | JSON parse; explicit-path parent-skill check; read the exact mode row. |
| `.skilled/skills/sk-doc/hub-router.json` | Stage-one signal, vocabulary and tie-break | Add the mode's signal/class and exact tie-break position | Parent-skill check; positive and negative compiled-route replays. |
| `.skilled/skills/sk-doc/ROUTER.md` | Stage-two intent and leaf selection | Add matching `INTENT_SIGNALS`, `RESOURCE_MAP` and `FULL_INVENTORY` entries | Both maps parse with equal keys; every named leaf resolves; positive route selects the expected mode. |
| `.skilled/skills/sk-doc/graph-metadata.json` | Advisor vocabulary for the single sk-doc identity | Add narrowly qualified goal-document authoring signals | Advisor CLI returns sk-doc for a positive prompt; session-goal probes do not select sk-create-goal. |
| `.skilled/skills/sk-doc/SKILL.md` | Human-facing fallback discovery and mode/packet count | Add the mode row and update the count from 14 modes across 13 packets to 15 across 14 | Explicit-path parent-skill check; read back the row and count (.skilled/skills/sk-doc/SKILL.md:15,25-39). |
| `.skilled/skills/sk-doc/description.json` | Hub doctor metadata and advertised keywords | Add the workflow and narrow keywords; update the mode summary/count | JSON parse and read-back comparison with the registry. |
| `.skilled/skills/sk-doc/leaf-manifest.json` | Generated typed leaf inventory | Regenerate after registry and packet-leaf state are final | `generate-leaf-manifest.cjs --check` exits 0; no hand edit. |

The seven surfaces and their failure modes follow the hub checklist (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:222-233).

Required inventories:
- Same-class producers: inspect the existing aliases in `.skilled/skills/sk-doc/mode-registry.json` and every vocabulary class in `.skilled/skills/sk-doc/hub-router.json`; compare candidate terms against `.skilled/skills/sk-doc/ROUTER.md` intent keywords before writing. Keep aliases lower-case and unique, and follow sk-doc's existing compositional vocabulary strategy (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:287-289). A prior hub-wiring phase caught keyed-object registry shapes by reading sibling entries first (specs/sk-doc/z_archive/040-create-repo-rules/006-command-and-hub-wiring/implementation-summary.md:95-101).
- Consumers of changed surfaces: `.skilled/skills/sk-doc/ROUTER.md`, `graph-metadata.json`, `description.json`, `SKILL.md`, the generated `leaf-manifest.json`, advisor CLI and compiled-route CLI.
- Matrix axes: every retained authoring alias x both routing stages x six session-goal/host-command probes, plus the same ten newcomer prompts before and after. Record each command result and exit status in the existing `implementation-summary.md`.
- Routing invariant: at least one positive prompt reaches `sk-doc` then `sk-create-goal`; none of the six out-of-domain prompts reaches `sk-create-goal`; each routed leaf exists in the completed packet and in the regenerated manifest.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state. Phase 1 records the exact ten-prompt baseline and checks candidate wording against the mode packet's existing `Keyword triggers:` source line. If that line does not already support the chosen aliases, stop before routing writes and resolve the phase boundary rather than edit an out-of-scope packet file. Phase 2 edits only the seven hub surfaces in spec.md, then regenerates the manifest. Phase 3 repeats the same prompts, runs six out-of-domain probes and both routing stages, runs the parent-skill check with the sk-doc path, and validates this packet. The mode packet's exact leaf paths remain UNKNOWN until phases 002-006 materialize them; read the completed packet and do not invent paths (specs/sk-doc/060-create-goal-mode/spec.md:100-109,122-127; .skilled/skills/sk-doc/SKILL.md:50-52).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Metadata | Parse the authored JSON files and confirm mode fields and count | `python3 -m json.tool .skilled/skills/sk-doc/mode-registry.json`; `python3 -m json.tool .skilled/skills/sk-doc/hub-router.json`; `python3 -m json.tool .skilled/skills/sk-doc/graph-metadata.json`; `python3 -m json.tool .skilled/skills/sk-doc/description.json`; then exact read-back |
| Stage one | Does a goal-authoring phrase reach the sk-doc advisor identity? | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Write the goal document for this spec packet and make its completion checks testable."}' --format json`, repeated for each listed prompt |
| Stage two | Does the hub route a real prompt to sk-create-goal and avoid it for out-of-domain prompts? | `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "Write the goal document for this spec packet and make its completion checks testable."`, repeated for each listed prompt |
| Hub invariant | Do registrations, tie-break and generated inventory pass for the touched hub? | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` |
| Generated inventory | Does the manifest match the current registry and packet leaves? | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` |
| Packet docs | Do the planning documents meet the strict spec contract? | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/007-hub-routing-integration --strict` |

Run the advisor and compiled-route commands once for each of the following ten newcomer prompts before any routing edits, then repeat the exact same strings after regeneration:

1. `Write the goal document for this spec packet and make its completion checks testable.`
2. `Turn this feature spec into a durable objective and three to seven standalone completion checks.`
3. `Draft the phase parent's directive and a complete list of phase-child goal files.`
4. `Create a phase-child goal from this phase specification.`
5. `Our packet has no goal document. Write one that states purpose and measurable criteria.`
6. `Make the goal criteria checkable without inspecting other files.`
7. `Write an objective for a packet that will author new documentation.`
8. `Create the parent objective for this phase plan with a complete child-phase goal list.`
9. `Write the goal document for a nested sub-phase.`
10. `Derive a concise phase objective and exit criteria from its spec.`

The initial baseline is an observation, not an assumed result. A prior frontmatter mode moved from zero of ten newcomer prompts at its initial measurement and repeated the same corpus after routing changes (specs/sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing/spec.md:20-31; specs/sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing/implementation-summary.md:89-92).

Replay every retained alias against a plausible out-of-domain request, then replay these six fixed out-of-domain prompts through both CLIs and require zero `sk-create-goal` targets (.skilled/repo-rules/skill-hub-routing.md:92-96): `Set the goal for this session.`; `Bind the goal to this session.`; `Update the goal for the current session.`; `Resend the goal.`; `How do I use /goal-opencode?`; `Read a packet with /goal-cursor.` These are hook/host surfaces rather than packet-goal authoring (.skilled/skills/system-spec-kit/SKILL.md:160,483-485; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:24-31).

Also replay two sibling-owned controls before and after: `Create an OpenCode agent with agent frontmatter and a permission object.` and `Write release notes since the last version.` Each must retain its existing non-goal mode route; the frontmatter integration used these types of sibling checks to detect keyword capture (specs/sk-doc/049-sk-create-frontmatter/004-routing-integration/implementation-summary.md:74-89). A previous hub-routing guardrail required a negative control because its first table-presence check still passed after the mode row was removed (specs/sk-doc/z_archive/040-create-repo-rules/009-hub-routing-guardrails/implementation-summary.md:87-89,115-124).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 conformance gate | Internal, predecessor handoff | Pending at planning time; must pass before integration | A broken or incomplete check leaves claimed defects unguarded (specs/sk-doc/060-create-goal-mode/spec.md:147). |
| Phases 002-006 mode packet | Internal, predecessor work | Pending at planning time; must be present at execution | The final stage-two leaf paths cannot be verified or added to the resource map. |
| Advisor and compiled-route CLIs | Internal tooling | Available in the documented command contract; live result not yet measured | No stage-one or compiled hub-route proof can be claimed (.skilled/skills/sk-doc/SKILL.md:54-58; .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:250-255). |
| Parent-skill check | Internal tooling | Available; run with `.skilled/skills/sk-doc` explicitly | A no-argument result may describe the wrong hub (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:240-248). |
| Leaf-manifest generator | Internal tooling | Available; run after registry and leaves are final | Hand-edited or stale generated inventory blocks verified routing (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:232). |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A positive phrase fails either routing stage, an out-of-domain probe selects `sk-create-goal`, a sibling route regresses, the explicit-path parent-skill check fails or the generated manifest check is stale.
- **Procedure**: Before editing, copy the seven named hub files with `cp -p` into a `mktemp -d` directory outside the repository and record that directory in the existing implementation-summary.md. Retain the backup until every replay and gate passes. To roll back, copy only those seven files back with `cp -p`, rerun the manifest `--check`, the captured baseline prompts and the six negative probes, then run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`. Remove the temporary backup only after the final state is verified. Do not overwrite unrelated working-tree files.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup and baseline) ──► Phase 2 (Hub wiring and manifest generation) ──► Phase 3 (Replay and validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Completed mode packet and routing baseline | Hub wiring |
| Hub wiring | Setup and verified on-disk mode leaves | Verification |
| Verification | Hub wiring and regenerated manifest | Phase 008 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Not estimated; task-count driven |
| Hub wiring | Medium | Not estimated; depends on actual completed packet leaves |
| Verification | Medium | Not estimated; ten positive prompts and six negative prompts are fixed |
| **Total** | | **Not estimated** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Record the pre-change state of all seven hub surfaces and the ten-prompt route baseline.
- [ ] Confirm the completed mode packet's actual leaf files before writing `RESOURCE_MAP` entries.
- [ ] No deployment or session-state mutation is in scope.

### Rollback Procedure
1. Restore only the seven hub surfaces from the retained `cp -p` backup outside the repository.
2. Run the leaf-manifest `--check` against the restored registry and current packet leaves.
3. Rerun the explicit-path parent-skill check, positive requests and six out-of-domain probes; compare with the captured baseline.
4. Keep the phase blocked if any check does not return to its captured baseline; remove the backup after the final gate passes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Regenerate the derived leaf manifest after restoring authored routing metadata; no data migration is involved.
<!-- /ANCHOR:enhanced-rollback -->

---

