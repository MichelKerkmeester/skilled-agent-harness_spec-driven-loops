# Iteration 001 — create/doctor/skill-advisor alignment

## Focus

Trace the current `/create:skill` and `/create:skill-parent` lifecycle, compare its required artifacts with the live skill-advisor graph/index contracts, and identify which `/doctor` routes diagnose or repair the resulting state.

## Actions Taken

- Read the thin command routers, their auto/confirm workflow assets, the `sk-create-skill` packet, its creation and parent-hub references, and the lifecycle/metadata scripts.
- Read the doctor route manifest, `doctor-skill-advisor`, `doctor-parent-skill`, `doctor-skill-graph-freshness`, and the supporting scripts.
- Read the advisor compiler/CLI contracts and live `sk-doc` metadata: `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `leaf-manifest.json`, and `command-metadata.json`.
- Ran `parent-skill-check.cjs .opencode/skills/sk-doc`: exit 0; all hard invariants passed, including 12 registered modes, 113 unique aliases, manifest byte freshness, reachability, and class H root metadata.
- Ran `skill-graph-freshness.cjs`: exit 0, but reported compiled graph 11 skills, SQLite absent, and on-disk graph metadata 11 skills. This is an informational diagnostic, not a reindex.
- Ran the required Codex hook installer check. The linked-worktree guard failed without `--allow-worktree`; with that flag the real check reported global hook drift (`missing=8`, `command=8`, `orphaned=7`).

## Findings

### F-001 — The creation guides document advisor refresh, but the create workflows do not make it a postcondition

`sk-create-skill/SKILL.md:198-203` and `:281-284` require root-metadata regeneration, `skill_graph_scan --trusted`, and an `advisor_recommend` smoke test. The parent workflow also requires one hub identity, one registry, one router, one hub graph metadata file, a generated leaf manifest, and a second scan/smoke test. The `/create:*` Markdown files are thin routers into YAML, and a repository search found no `advisor_rebuild` or `skill_graph_scan` execution in the create YAML assets themselves.

That leaves a new skill in a structurally valid but potentially stale advisor state unless the author follows a manual command embedded in the guide. The workflow has no machine-readable handoff from “metadata generated” to “advisor generation observed live.”

### F-002 — The advisor graph and the parent-hub routing contract have different sources of truth

`skill_graph_compiler.py:7-15` and `:161-180` discover and compile top-level `graph-metadata.json`; absent files are skipped, and nested packet identities are intentionally excluded. The runtime advisor also reads per-root graph metadata for conflicts and derived phrases (`skill_advisor.py:1051-1053`, `:1081-1106`).

By contrast, `mode-registry.json`, `hub-router.json`, `command-metadata.json`, `description.json`, and `leaf-manifest.json` are validated by the parent-skill structural checks. They are not all ingested by the graph compiler. `description.json` and `graph-metadata.json` therefore carry overlapping natural-language vocabulary in two schemas, while registry/router/manifest files carry packet topology and resource reachability. A creator can pass the hub audit while the advisor graph remains stale or unavailable.

The live `sk-doc` result demonstrates the distinction: the hub audit is fully green, its registry contains 12 modes, and its generated manifest is fresh; the graph freshness panel still sees no SQLite database. The current `leaf-manifest.json` has zero leaf entries because this hub is workflow-only, which is valid and should not be treated as an empty-index failure.

### F-003 — Doctor coverage is split across good diagnostics, but no route owns the complete create-to-index repair loop

`/doctor:parent-skill` runs the fleet root-metadata class gate and `parent-skill-check.cjs`; it covers one hub identity, registry/router alignment, packet shape, command metadata, and leaf-manifest freshness. `/doctor:skill-graph-freshness` is a read-only three-way comparison of compiled JSON, SQLite, and on-disk graph metadata (`doctor-skill-graph-freshness.yaml:24-36`). It explicitly never reindexes and always reports informationally.

`/doctor:skill-advisor` is a scorer-calibration workflow. Its health probe is warm-only `advisor_status` (`doctor-skill-advisor.yaml:35-42`), while `advisor_rebuild` appears as an operator choice after mutations (`:151-153`), not as a dedicated index-maintenance phase for a newly created skill. The actual CLI exposes trusted `advisor_rebuild` and `skill_graph_scan` (`skill-advisor-cli-manifest.ts:47-66`, `:102-103`; `skill-advisor-cli.ts:767-774`), but the doctor route does not present a single, explicit “validate metadata → scan/rebuild → validate generation → smoke-test recommendation” contract.

This is deliberate for safety—the mutation tools require trusted authority—but it increases friction and makes “doctor says structurally healthy” different from “advisor can route the new skill.”

### F-004 — Structural checks do not prove semantic parity across all live routing surfaces

The parent audit verifies presence, schema, path resolution, uniqueness, and byte freshness. It does not appear to compare `mode-registry.json` aliases and router vocabulary against `description.json` keywords, `graph-metadata.json` domains/intent signals, or the advisor’s effective projection. For `sk-doc`, all modes use `advisorRouting.routingClass: metadata`, so there is correctly no lexical projection drift guard; that also means mode aliases are hub-router vocabulary, not independently discoverable advisor entries.

The authoring guidance says to replace slug-only defaults in graph metadata, description keywords, and per-mode aliases (`sk-create-skill/SKILL.md:199-200`, `:282-283`), but no one check proves those three surfaces remain mutually useful after later edits. This is the main documentation/index drift seam.

### O-001 — The requested Codex hook check is independently drifting

`/doctor:runtime-mirrors` correctly maps to `.opencode/bin/install-codex-hooks.mjs --check` (`_routes.yaml:189-201`). In this linked worktree the check requires `--allow-worktree`; with that diagnostic override it found eight missing command entries, eight command mismatches, and seven orphaned entries in the user-global hooks file. This does not prove a skill-advisor defect, but it can prevent the runtime hooks that surface advisor context and route gates from being trustworthy.

## Questions Answered

1. **Creation path:** `/create:skill` and `/create:skill-parent` route through presentation contracts and YAML workflows; `sk-create-skill` supplies the canonical templates, root metadata, parent-hub registry/router rules, validation, and manual advisor refresh/smoke-test instructions. The divergence is that advisor refresh is documented as a manual tail step rather than a workflow postcondition.
2. **Doctor routes:** `skill-advisor` tunes/validates scoring with approval gates; `parent-skill` audits hub structure; `skill-graph-freshness` reports compiled/SQLite/disk drift; `runtime-mirrors` checks hook parity. They cover pieces of the lifecycle but do not form one explicit index-repair route.
3. **Author obligations:** standalone roots need `graph-metadata.json` plus `leaf-manifest.config.json` and generated projections; parent hubs need one hub graph identity, `mode-registry.json`, `hub-router.json`, `description.json`, `command-metadata.json`, generated `leaf-manifest.json`, and nested packets without packet-local graph/description metadata.
4. **Under-automation:** graph compilation is operator-gated and keyed to graph metadata, while parent topology and descriptive metadata are checked separately. The freshness doctor is read-only and treats absent SQLite as reportable state rather than repairing it.
5. **Highest-value alignment:** add a create completion handoff that records root/manifest validation, checks advisor status, and offers the trusted scan/rebuild plus recommendation smoke test; add a doctor index-maintenance route with before/after generation evidence; and add semantic parity checks across registry/router, description, graph metadata, and effective advisor projections.

## Questions Remaining

- Whether the intended contract is to auto-run trusted `skill_graph_scan` after `/create:*`, or to keep mutation operator-owned and make the handoff an explicit confirmation step.
- Whether `description.json` should remain a descriptive projection or become a generated/validated projection of registry and graph vocabulary.
- Whether the hook drift is expected for this worktree/runtime generation or should be repaired in the separate runtime-mirror workstream.

## Next Focus

Map the exact create-workflow phase boundaries and propose the smallest machine-readable handoff/doctor route contract that preserves trusted mutation boundaries while eliminating the manual advisor-refresh gap.
