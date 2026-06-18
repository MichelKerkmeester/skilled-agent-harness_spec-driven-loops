# Deep-Research Iteration 008: Lane C/D adapter boundary and external pilot

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

I’ll keep this read-only and start by loading the required context and routing information, then inspect the specific deep-improvement Lane C/D files before making a recommendation.
Skill Advisor MCP was unavailable (`Connection closed`), so I’m using the project’s fallback advisor script and will keep the rest of the work read-only.
SKILL ROUTING: fallback advisor matched `deep-improvement` at 0.95 and related deep-loop skills; I’m loading `deep-improvement` and `deep-loop-runtime` for the Lane C/D and frozen-runtime boundary rules without launching any workflow or writing artifacts.
I’m now reading the verified context report first, then I’ll inspect the Lane D adapter/docs and Lane C benchmark implementation points the report points to.
The baseline confirms the key risk: Lane D is already documented as an external-loop adapter, while Lane C is diagnostic-only and skill-advisor coupled. I’m reading the concrete adapter/contracts now to decide whether those become first-class modes or an internal boundary.
The concrete files back the baseline: Lane D’s Node file is only an env/argv bridge to `benchmark/_loop/loop.py`, while Lane C writes reports and runs a D5 hard gate plus optional advisor/live probes. I’m checking the shared loop host and command surfaces next to make the recommendation implementable.
I’ve got enough evidence to distinguish Lane C and D boundaries. I’m doing one final targeted check on metadata/command coupling and self-target assumptions before writing the recommendation.
I found the command/YAML migration coupling: the Lane C/D command frontmatter and YAML still point at `deep-improvement`, so the merge must repoint those paths without changing the mode names or output contracts.
The asset filenames use the command’s underscore convention rather than the markdown slug naming, so I’m narrowing the lookup by content instead of relying on the guessed glob.
There may not be separate YAML assets for Lane C/D yet; the markdown commands currently carry the runnable command surface directly. I’m confirming the asset directory names with a read-only directory listing.
The docs name a live Barter Copywriter pilot outside this repo; I’m checking only the referenced contract files to confirm whether a migration requires external coordination.
The documented external Barter path is not present at the referenced location in this environment, so any contract-version recommendation must rely on the in-repo adapter/docs unless the external packaging is mounted later.
The Barter pilot is mounted under `Barter - Copywriter`, not the shorter path in the doc. I’ll read the actual pilot contract files now.
The live pilot confirms the adapter contract and shows no explicit contract-version field in the loop header; I’m checking for any hidden version markers before deciding whether a version bump is necessary.
The live Barter loop uses only env/argv plus canonical reason mapping; it doesn’t appear to import the skill folder. I’m checking for literal `deep-improvement` or old path references in the external pilot to distinguish path-only reorg from contract change.
**Recommendation**
Make Lane C (`skill-benchmark`) a first-class `deep-loop-workflows` mode. Make Lane D (`non-dev-ai-system-refine`) a first-class command/mode entry, but explicitly mark it as an adapter-backed external-contract mode, not an internally owned loop. Do not collapse both under a single opaque “improvement” sub-mode, and do not absorb Lane D’s Python loop into either `deep-loop-workflows` or `deep-loop-runtime`.

The merged public mode set should include `skill-benchmark` and `non-dev-ai-system-refine` alongside the other deep-loop modes. Internally, preserve the current Lane C and Lane D behavior, mode strings, argv/env surfaces, report schemas, journal semantics, and output paths. The only safe structural move is old skill root to new skill root, with path repoints from `.opencode/skills/deep-improvement/...` to `.opencode/skills/deep-loop-workflows/...`.

**Evidence**
The baseline context report already classifies Lane D as the critical boundary because the core loop lives outside the skill and the Node side “owns no loop logic” (`context-report.md:143-149`). It separately flags Lane C as self-referential risk once the merged skill exists (`context-report.md:145-149`).

`deep-improvement/SKILL.md` says the four lanes are co-equal, and specifically states Lane C runs via `loop-host.cjs --mode=skill-benchmark` while Lane D’s guarded loop host lives at `<packaging-root>/benchmark/_loop/loop.py` and loop-host only adapts to it (`.opencode/skills/deep-improvement/SKILL.md:30-41`). The same file defines Lane C as diagnostic and non-mutating (`SKILL.md:73-75`) and Lane D as guarded packaging refine where frozen scoring, derivation, and kill-switch logic live with the packaging (`SKILL.md:77-79`).

Lane D’s adapter confirms the boundary. `run-non-dev-ai-system.cjs` describes itself as a “Thin executor adapter,” says the loop host lives with the packaging, and says it “owns no loop logic” (`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs:7-16`). Its implementation only forwards six env knobs and chooses `--dry-run` vs `--run` before spawning Python (`run-non-dev-ai-system.cjs:39-47`, `run-non-dev-ai-system.cjs:71-79`).

Lane D’s formal contract requires packaging-owned `benchmark/_loop/loop.py`, `_gates/gates.py`, and `_gates/derive.py` (`references/non_dev_ai_system/loop_contract.md:39-46`). It defines argv/env, journal events, stop-reason mapping, kill-switches, lock/resume, and adapter invocation (`loop_contract.md:49-57`, `loop_contract.md:75-97`, `loop_contract.md:100-139`, `loop_contract.md:163-172`).

The live Barter pilot at `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter - Copywriter/benchmark/_loop/loop.py` matches the contract: it runs gates, benchmark, re-grade, gap analysis, worktree propose, guarded promote, and convergence (`loop.py:1-31`). It maps local reasons to canonical deep-improvement stop reasons (`loop.py:94-96`), enforces frozen scoring and derivation gates (`loop.py:220-229`), handles held-out promotion gates (`loop.py:408-436`), and owns convergence/run logic (`loop.py:439-595`).

Lane C is mode-worthy, not just a helper. The operator guide defines D5 hard gate first, deterministic Mode A, optional D1-inter advisor probe, live Mode B, and opt-in D4-R ablation (`references/skill_benchmark/operator_guide.md:21-27`). It defines D1/D2/D3/D4/D5 coverage and verdict bands (`operator_guide.md:64-90`). The orchestrator resolves a target skill, runs D5 first, loads playbook scenarios, dispatches, aggregates, and writes `skill-benchmark-report.{json,md}` (`scripts/skill-benchmark/run-skill-benchmark.cjs:7-20`, `run-skill-benchmark.cjs:177-218`). D5 is a structural hard gate (`d5-connectivity.cjs:7-17`, `d5-connectivity.cjs:64-124`). Advisor probing is deterministic and out-of-band through the Python skill advisor (`advisor-probe.cjs:7-21`, `advisor-probe.cjs:52-72`).

**Rejected Alternatives**
Do not make Lane C and Lane D nested-only under a broad `improvement` mode. That would lose routing granularity and make advisor/command behavior less precise. Lane C benchmarks skills, has its own D1-D5 report schema, and is diagnostic by default; Lane D refines external packagings with worktree promotion and kill-switches. They do not share enough operational semantics to hide behind one “improvement” bucket.

Do not move Lane D loop logic into `deep-loop-workflows`. The real files prove the loop is Python, packaging-owned, and external. Pulling it into the merged skill would violate the established contract and the byte-identical artifact bar.

Do not move Lane C/D into `deep-loop-runtime`. Lane C’s D1-D5 scorer, advisor probe, and report renderer are mode semantics. Lane D’s adapter is workflow-facing, while its backend is external packaging code. `deep-loop-runtime` stays MCP-free shared backend and should not gain these workflow semantics.

Do not exclude `deep-loop-workflows` from Lane C self-benchmarking. The merged skill must be benchmarkable because it becomes the router for all deep loops. Excluding it would hide the highest-risk routing case.

**Self-Reference Decision**
Handle Lane C self-reference with benchmark-by-mode, not exclude-self.

When target skill is `deep-loop-workflows`, a Lane C run should be scoped to exactly one mode family, for example `context`, `research`, `review`, `council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, or `non-dev-ai-system-refine`. The report should identify `targetSkill.id=deep-loop-workflows` plus a mode scope such as `targetMode=skill-benchmark`.

D1-inter can still score whether advisor routes to `deep-loop-workflows`; D1-intra and D2 must carry the mode-specific burden by checking expected intent keys and resources for that mode. This avoids a false pass where every deep-loop prompt merely activates the merged skill but loads the wrong mode resources.

The scenario/playbook corpus for self-benchmark must be mode-scoped and contamination-safe. Public prompts should not leak `deep-loop-workflows`, `deep-improvement`, or internal intent-key vocabulary, because Lane C’s contamination guard builds banned terms from the target skill identity and router terms.

**Contract-Version Decision**
No external Barter loop contract bump is required if the migration only renames/repoints the skill folder and preserves the adapter contract.

The live Barter loop consumes env/argv and canonical stop-reason mapping; it does not import `.opencode/skills/deep-improvement` (`loop.py:94-96`, `loop.py:617-626`). The only external old-name references I found are documentation/comment references: `SYNC.md:32` says “Lane D of deep-improvement,” and `loop.py:94` comments “deep-improvement journal stop-reason taxonomy.”

If implementation changes only comments/docs/templates, treat it as non-breaking coordination, not a contract bump. If implementation changes any of these, then bump the Lane D kit/contract and coordinate with Barter: argv surface, env knob names, journal event names, stop-reason mapping, kill-switch semantics, `CW_ROOT` behavior, worktree retention semantics, or generated template behavior.

If the kit assets are moved but not semantically changed, keep the loop contract stable. A docs-only `kit_version` bump is optional; a behavioral bump is not justified by the merge alone.

**Concrete Path Changes**
Move or repoint these Lane C/D files under the merged skill root, preserving relative behavior first:

| Current path | Target path |
|---|---|
| `.opencode/skills/deep-improvement/SKILL.md` Lane C/D sections | `.opencode/skills/deep-loop-workflows/SKILL.md` mode sections |
| `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs` | `.opencode/skills/deep-loop-workflows/scripts/shared/loop-host.cjs` |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/*` | `.opencode/skills/deep-loop-workflows/scripts/skill-benchmark/*` |
| `.opencode/skills/deep-improvement/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` | `.opencode/skills/deep-loop-workflows/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` |
| `.opencode/skills/deep-improvement/references/skill_benchmark/*` | `.opencode/skills/deep-loop-workflows/references/skill_benchmark/*` |
| `.opencode/skills/deep-improvement/references/non_dev_ai_system/*` | `.opencode/skills/deep-loop-workflows/references/non_dev_ai_system/*` |
| `.opencode/skills/deep-improvement/assets/non_dev_ai_system/*` | `.opencode/skills/deep-loop-workflows/assets/non_dev_ai_system/*` |
| `.opencode/commands/deep/start-skill-benchmark-loop.md` | update `skill: deep-loop-workflows`, prose, and command paths |
| `.opencode/commands/deep/start-non-dev-ai-system-loop.md` | update `skill: deep-loop-workflows`, prose, and command paths |
| `.opencode/skills/deep-improvement/graph-metadata.json` | replace with `.opencode/skills/deep-loop-workflows/graph-metadata.json`, `skill_id=deep-loop-workflows` |

The command asset directory currently has no separate Lane C/D YAML assets; it contains assets for council, agent-improvement, model-benchmark, context, research, and review only. Lane C/D runnable command surfaces are in the markdown command files I read.

External Barter coordination is documentation-only unless the contract changes:

| External path | Change |
|---|---|
| `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter - Copywriter/SYNC.md:32` | rename “Lane D of deep-improvement” to “Lane D of deep-loop-workflows” |
| `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter - Copywriter/benchmark/_loop/loop.py:94` | rename taxonomy comment only, no logic change |

**Risks**
Lane C can falsely pass a merged-skill benchmark if scoring only asks “did advisor select `deep-loop-workflows`?” and does not also assert mode-specific resources/intents.

Lane C contamination lint can reject self-benchmark prompts that mention the merged skill or old mode names too directly.

Lane D can be accidentally broken by “cleaning up” adapter comments into behavior, especially env names, dry-run/live mapping, stop reasons, or kill-switch taxonomy.

The Barter docs have a stale path in the in-repo example (`.../AI_Systems/Barter/Copywriter`) while the actual mounted pilot is `.../AI_Systems/Barter/Barter - Copywriter`; do not rely on the shorter path during migration.

Advisor routing needs alias preservation: old prompts for `deep-improvement`, `skill-benchmark`, and `non-dev-ai-system` must route to `deep-loop-workflows` without losing mode intent.

**Dependencies**
This decision depends on the global Q-ARCH layout choice only for final directory shape. The semantic recommendation is independent: Lane C is first-class, Lane D is first-class adapter-backed, and neither belongs in `deep-loop-runtime`.

This decision depends on Q-ADVISOR for alias-to-one-skill behavior and whether the advisor can expose mode attribution. If not, Lane C must rely on D1-intra/resource checks for mode precision.

This decision depends on Q-GOV for where per-mode manual testing playbooks live. Lane C self-benchmark should use mode-scoped playbooks.

This decision depends on Q-BACKEND only if another angle hoists the frozen stop/journal taxonomy into `deep-loop-runtime`. If that happens, Lane D should map to the new canonical enum but keep its external loop behavior unchanged.
