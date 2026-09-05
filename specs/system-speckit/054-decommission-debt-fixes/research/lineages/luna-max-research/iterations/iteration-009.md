# Iteration 9: Deferred validator, doctor, and migration debt

## Focus

Trace the deferred 052 debts through the live doctor command and its workflow
assets. Compare the renamed CLI runtime and trigger-index successors with the
remaining update, migration, cleanup, and doctor contracts. No command was
executed; this is source-only research.

## Findings

1. **LUNA-037 — `/doctor:update` still exposes a live retired context-index/memory migration workflow. P1. CONFIRMED.** The active `/doctor:update` router loads `doctor-update.yaml`, whose purpose is still to rebuild “runtime databases” and whose dependency order starts with `context-index`. The YAML retains `mcp-server/database` snapshot and state paths, a `migration-manifest.json` phase, a legacy `memory/*.md` detector that recommends `/memory:save`, and a dependency execution step named `context-index`, while the current `/doctor memory` successor explicitly diagnoses a trigger index with no database or daemon. The old workflow is therefore still reachable configuration, not merely a historical note; it can present or execute obsolete migration/cleanup semantics alongside the successor route. Smallest fix: remove/deprecate `/doctor:update`'s retired context-index and memory phases, then define one current update workflow for trigger-index, advisor, and deep-loop owners with paths validated against the renamed runtime. [SOURCE: .opencode/commands/doctor/update.md:1-8,25-36,69] [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:1-22,87-130,240-328,354-369] [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:21-35,43-55] [INFERENCE: the router's live asset load makes the obsolete phases reachable whenever an operator invokes /doctor:update]

2. **LUNA-038 — Deep-loop doctor policy keeps unqualified retired database patterns in its forbidden-target contract. P2. CONFIRMED stale policy residue.** The deep-loop doctor has current allowed targets under `.opencode/skills/system-deep-loop/runtime/database`, but its forbidden-target list still names bare `mcp-server/database/*context-index*`, `*voyage*`, `*skill*`, `*eval*`, `*causal*`, and `*coco*` patterns. These patterns are not rooted at the current package and preserve the pre-rename database vocabulary inside a live doctor asset; because the YAML is itself an input to the doctor contract, this can keep old paths in audits and confuse path-validation ownership even if no file currently matches. Smallest fix: delete obsolete patterns or replace them with explicit, repository-rooted retired-path assertions tied to the decommission checklist. [SOURCE: .opencode/commands/doctor/assets/doctor-deep-loop.yaml:80-108] [INFERENCE: a forbidden-target pattern is policy data rather than proof of an existing file or write, so the current finding is residue/ownership drift, not confirmed database mutation]

3. **LUNA-039 — The system-spec-kit doctor returns zero in advisory mode after runtime imports fail. P1. CONFIRMED.** `doctor.sh` describes exit 0 as “health checks passed (or advisory mode complete).” If `better-sqlite3` or `zod` cannot be imported, it logs a failure and continues unless `--strict` was supplied; only strict mode exits 26. A caller that invokes the documented default doctor or checks only process success can therefore accept a runtime whose first-use imports are broken. This matters to the decommission successor because the doctor is the installation health boundary for the renamed runtime, even though the retained SQLite dependency itself needs a separate ownership decision. Smallest fix: make dependency failures nonzero by default, or emit an explicit machine-readable advisory/failure status that every completion or install caller must reject unless it requests advisory mode. [SOURCE: .opencode/skills/system-spec-kit/scripts/doctor.sh:5-17,40-72]

4. **LUNA-040 — The successor trigger-index doctor remains branded as `/doctor memory` without an explicit compatibility boundary. P2. CONFIRMED naming/ownership drift.** The route manifest and presentation expose target `memory` and `doctor-memory.yaml`, while that YAML now diagnoses `runtime/data/trigger-index.json`, a lexical lookup, and ripgrep conventions and explicitly says the database and daemon are retired. The name is thus not evidence of a remaining database, but it keeps a retired surface name in the active route, workflow identifiers, report/state filenames, and acceptance path. Smallest fix: rename the active target and asset to `retrieval` or `trigger-index`, or document `/doctor memory` as a time-bounded compatibility alias whose output and ownership are unambiguously successor-only. [SOURCE: .opencode/commands/doctor/_routes.yaml:35-47] [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:1-35,69-73,231-233] [SOURCE: .opencode/commands/doctor/assets/doctor-speckit-presentation.txt:70-96]

## Ruled Out

- The current `validate-command-references.cjs` does not depend on machine-local databases: it resolves concrete command and mirror paths from disk and its self-test uses temporary fixtures. The 052 log row is historical debt evidence, not a current claim about this checker. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:1-23,31-65,230-288]
- `doctor-deep-loop.yaml`'s graph database paths are current and explicitly rooted under `system-deep-loop/runtime/database`; the stale bare patterns are classified separately as forbidden-policy residue. [SOURCE: .opencode/commands/doctor/assets/doctor-deep-loop.yaml:80-108]
- The advisor's `mcp-server/database` paths are not classified as retired system-spec-kit memory storage: the route and current YAML identify the standalone skill-advisor graph as their owner. The finding is limited to the update workflow's mixed context-index/legacy-memory contract. [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:100-114] [SOURCE: .opencode/commands/doctor/assets/doctor-skill-graph-freshness.yaml:40-47]

## Dead Ends

- The requested reading budget excludes running doctor or validator commands because they can write caches, state logs, or generated artifacts outside this lineage. No such command was run.

## Edge Cases

- `/doctor:update` may have been intended as a migration-only compatibility command. Its current description and live workflow still need an explicit retired/no-op boundary if that is the decision; otherwise the operator cannot distinguish migration from ordinary maintenance.
- `doctor.sh`'s `better-sqlite3` probe may be intentional for retained entity/transaction code. This iteration records the advisory exit semantics, not a new dependency-removal claim.
- A stale forbidden glob does not prove a matching file exists. The risk is contract drift and misleading policy coverage, not confirmed mutation of a retired DB.

## Questions Remaining

- Q1/Q2 are partially answered: live doctor/update assets still expose retired context-index and memory migration vocabulary; deep-loop graph targets themselves are current, but policy residue remains.
- Q7 gains a separate doctor false-green path through advisory-mode zero exit.
- Q3-Q6 remain open at the source/test/lineage level. Next focus: zvec, system-plugins, old runtime identities, and exact configuration/ignore residue outside the already-audited paths.

## Sources Consulted

- [SOURCE: .opencode/commands/doctor/update.md:1-8,25-36,69]
- [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:1-22,87-130,240-328,330-386]
- [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:1-35,43-73,231-233]
- [SOURCE: .opencode/commands/doctor/assets/doctor-deep-loop.yaml:80-108]
- [SOURCE: .opencode/commands/doctor/_routes.yaml:35-47]
- [SOURCE: .opencode/commands/doctor/assets/doctor-speckit-presentation.txt:70-96]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/doctor.sh:5-17,40-72]
- [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:1-23,31-65,230-288]
- [SOURCE: .opencode/skills/system-spec-kit/README.md:585-615]
- [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:198-205]

## Assessment

- New information ratio: 0.78
- Questions addressed: Q1, Q2, and Q7 deferred doctor/migration debt
- Questions answered: Q1/Q2 = partial through the live `/doctor:update` and deep-loop policy assets; Q7 = expanded with advisory doctor exit semantics.
- Confidence: high for the reachable YAML, route, and exit-code contracts; medium for whether an operator still invokes `/doctor:update` in practice.

## Reflection

- What worked and why: following the update router into its owned YAML exposed a whole live migration workflow that the successor trigger-index doctor had not replaced.
- What did not work and why: the historical command-reference debt was not reproducible from the current checker source, so it was ruled out rather than carried forward as a duplicate.
- What I would do differently: next, inspect exact old-surface configuration, ignore, and package identity residue for zvec/system-plugins and the retired runtime path.

## Recommended Next Focus

Angle 1: bounded sweep of active config, ignore rules, package manifests, CI workflows, and launchers for zvec, system-plugins, memory MCP tools, spec-memory, and old `system-spec-kit/mcp-server` identities.
