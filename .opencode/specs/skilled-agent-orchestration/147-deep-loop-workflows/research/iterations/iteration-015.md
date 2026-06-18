# Deep-Research Iteration 015: External best-practice applied architecture

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

Low-blast, read-only synthesis. I’ll surface relevant memory and skill routing, then read the established context report and loop-host precedent before making the architecture recommendation.
SKILL ROUTING: advisor ranked `sk-code` above threshold, with `deep-research` also above threshold; I’m using them only as read-only guidance because the user’s explicit constraint forbids workflow/file writes. Next I’m reading the required baseline artifacts in full.
I’m treating the prior pass-1 decisions as the default architecture and will only amend them if the repo evidence or architecture stress-test reveals a concrete flaw.
The baseline confirms the decisive stress point is not the five original workflows; it is `deep-improvement` becoming several workflow modes while one lane remains an external-loop adapter. I’m reading that boundary and the runtime loop-type discriminator before finalizing amendments.
The in-repo precedent strongly supports a registry/dispatcher seam: `loop-host.cjs` is already a pure planner plus mode-to-script resolver, and Lane D is explicitly an adapter to a packaging-owned Python loop rather than in-skill loop logic.
**Synthesis Recommendation**
Confirm the converged plan: use one public skill, `deep-loop-workflows`, with internal mode packets and the existing frozen `deep-loop-runtime` backend. Do not create a public skill-family of sibling mode-skills. The best-practice shape here is “one package, many subcommands/plugins”: a thin authoritative hub, a declarative mode registry, per-mode implementation packets, and backend adapters. Amend pass-1 only to make the mode registry mandatory and explicit about each mode’s execution backend.

**Why This Is The Right Architecture**
The repo already has the split best-practice frameworks usually evolve toward: public workflow surface separated from backend runtime primitives. The context report calls the current state a “partially-realized two-skill split” with `deep-loop-runtime` as the backend and five workflow skills as persona surfaces, all via `/deep:*` commands (`context-report.md:5-16`). Mature CLI/plugin systems usually consolidate this exact shape as one user-facing package with multiple subcommands when the modes share lifecycle, distribution, command namespace, and runtime primitives.

A public skill-family would be worse here. The advisor `skill_id` is hard-bound to folder name, so sibling mode-skills would become separate rankable public identities again (`context-report.md:100-105`). That directly conflicts with the target two-skill architecture and would keep the migration’s hardest routing problem alive instead of solving it.

The internal plugin/registry pattern gives the benefits of a family without public skill fragmentation. Keep physical packet boundaries under `deep-loop-workflows/<mode-or-packet>/`, but expose only one advisor skill identity. The hub routes by command and explicit mode first, not generic keywords.

**Thin Hub, Not Fat SKILL.md**
Use a thin `deep-loop-workflows/SKILL.md` as an authoritative router, not a merged mega-manual. A fat SKILL.md would combine five high-entropy routers, all improvement lanes, and broad trigger vocabulary into one untestable prompt blob. The context report already identifies keyword/trigger union as the largest routing-quality risk, with 50 keywords and 63 trigger phrases collapsing onto one advisor node (`context-report.md:105`).

The root hub should own only:

- Public skill identity: `deep-loop-workflows`
- Command-to-mode mapping for all `/deep:*` commands
- Alias-to-mode mapping for old skill names
- Per-mode permission gates
- Mode registry loading
- Collision handling and disambiguation
- Runtime backend selection
- Byte-identical parity invariant
- Pointers to mode packet entry docs

Per-mode behavior should remain in mode packets. This preserves the pass-1 direct-packet decision while avoiding a “god skill” anti-pattern.

**Mode Registry Contract**
Make the optional manifest idea mandatory. This is the main amendment I recommend.

A registry should distinguish public workflow identity from backend execution identity:

| Public `workflowMode` | Packet | Backend kind | `runtimeLoopType` |
|---|---|---|---|
| `context` | `context/` | `runtime-graph` | `context` |
| `research` | `research/` | `runtime-graph` | `research` |
| `review` | `review/` | `runtime-graph` | `review` |
| `council` | `ai-council/` | `runtime-council` | `council` |
| `agent-improvement` | `improvement/` | `improvement-host` | `null` |
| `model-benchmark` | `improvement/` | `improvement-host` | `null` |
| `skill-benchmark` | `improvement/` | `improvement-host` | `null` |
| `non-dev-ai-system-refine` | `improvement/` | `external-adapter` | `null` |

This preserves iter-1’s low-churn physical layout while honoring iter-7 and iter-8 that improvement lanes are first-class logical modes.

**Two-Tier Contract**
Confirm iter-7 strongly. `workflowMode` and `runtimeLoopType` must remain separate.

`deep-loop-runtime/scripts/convergence.cjs` explicitly accepts only `research`, `review`, `council`, and `context` as `loopType` (`convergence.cjs:305-312`). That is the correct backend boundary. Improvement lanes are public workflow modes, not runtime graph loop types.

Do not add `improvement`, `model-benchmark`, `skill-benchmark`, or `non-dev-ai-system-refine` to runtime convergence for this migration. That would change architecture and likely artifact behavior.

**Deep-Improvement Precedent**
`loop-host.cjs` is already the in-repo proof that multi-mode dispatch works when implemented as a pure registry/planner seam. It defines four valid modes (`loop-host.cjs:44-46`), keeps default `agent-improvement` behavior byte-identical (`loop-host.cjs:13-15`), and separates planning from execution (`loop-host.cjs:180-188`). That is exactly the pattern the merged workflow hub should copy at the skill level.

Do not extend `loop-host.cjs` to context/research/review/council. Those modes already consume `deep-loop-runtime` through command YAML and runtime CLI scripts. A universal host would flatten mode semantics and risk breaking byte-identical artifacts.

**Lane D Belongs Inside, But Only As An Adapter**
Lane D should remain inside `deep-loop-workflows` as a public workflow mode and command entry, but not as in-skill loop logic.

The adapter says the loop host lives with the packaging under test and that this script “owns no loop logic” (`run-non-dev-ai-system.cjs:7-16`). It validates `<packaging-root>/benchmark/_loop/loop.py`, maps flags/env, and spawns `python3` (`run-non-dev-ai-system.cjs:39-47`, `run-non-dev-ai-system.cjs:56-79`). Best practice calls this an external provider adapter, not a package-owned plugin implementation.

So Lane D belongs in the merged skill for routing, operator UX, templates, and contract validation. The Python loop, kill-switches, scoring surface, and promotion mechanics stay owned by each external packaging.

**Applied Architecture**
Recommended tree shape:

- `.opencode/skills/deep-loop-workflows/SKILL.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/context/**`
- `.opencode/skills/deep-loop-workflows/research/**`
- `.opencode/skills/deep-loop-workflows/review/**`
- `.opencode/skills/deep-loop-workflows/ai-council/**`
- `.opencode/skills/deep-loop-workflows/improvement/**`
- `.opencode/skills/deep-loop-workflows/shared/**`
- `.opencode/skills/deep-loop-workflows/feature_catalog/{context,research,review,improvement,council}/**`
- `.opencode/skills/deep-loop-workflows/manual_testing_playbook/{context,research,review,improvement,council}/**`

The registry, not directory depth, makes modes first-class.

**Explicit Amendments To Pass-1**
- Amend iter-1 and iter-3: the mode/asset manifest should be mandatory, not optional. It should be the single source for `workflowMode`, aliases, packet path, permissions, command names, artifact roots, backend kind, and `runtimeLoopType`.
- Amend iter-7 and iter-8: add an explicit `backendKind` or equivalent discriminator with values like `runtime-graph`, `runtime-council`, `improvement-host`, and `external-adapter`. This prevents future contributors from treating every public mode as a runtime loop type.
- Clarify iter-8: Lane D is inside `deep-loop-workflows` only as an adapter mode. The merged skill must not vendor, reimplement, or own the external Python loop beyond contract/schema/templates and dry-run command wiring.
