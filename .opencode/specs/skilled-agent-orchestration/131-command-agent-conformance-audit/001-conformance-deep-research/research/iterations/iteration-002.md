# Iteration 002: Doctor Route/YAML/Script Conformance

## Focus

Verify `/doctor` route-to-YAML-to-script tri-existence, mutation-class honesty, and executable behavior for read-only targets.

## Actions Taken

1. Compared the ten primary `_routes.yaml` entries with `speckit.md`, `doctor_speckit_presentation.txt`, all doctor YAML assets, and declared local scripts.
2. Read `route-validate.py` and ran `route-validate.sh` to identify which tri-existence and mutation properties are mechanically enforced.
3. Executed representative read-only diagnostics for memory, embeddings, causal graph, code graph, deep loop, skill budget, parent skill, skill-graph freshness, and fable mode.
4. Searched all read-only workflow YAMLs for packet-local writes and mutating-tool declarations.

## Findings

### P1 - Doctor - Four routes classified `read-only` write packet-local artifacts

The canonical manifest labels `memory`, `causal-graph`, `code-graph`, and `deep-loop` as `read-only` [SOURCE: .opencode/commands/doctor/_routes.yaml:27-32] [SOURCE: .opencode/commands/doctor/_routes.yaml:60-65] [SOURCE: .opencode/commands/doctor/_routes.yaml:76-84] [SOURCE: .opencode/commands/doctor/_routes.yaml:100-105]. Their YAML workflows nevertheless require writes:

- Memory writes a report and state log under `<packet_scratch>` [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:202-225].
- Causal graph writes a state log under `<packet_scratch>` [SOURCE: .opencode/commands/doctor/assets/doctor_causal-graph.yaml:210-217].
- Code graph writes a diagnostic report under `{packet_scratch}` [SOURCE: .opencode/commands/doctor/assets/doctor_code-graph.yaml:174-186].
- Deep loop writes a state log under `<packet_scratch>` [SOURCE: .opencode/commands/doctor/assets/doctor_deep-loop.yaml:227-235].

This conflicts with the router contract that `read-only` routes may inspect and report without a write path. **Concrete fix:** either remove the artifact writes and render results to stdout, or reclassify these routes as `add-only` and set `gate3_location` to the exact packet-scratch path. Align the YAML mutation boundaries with that choice.

### P1 - Doctor - Memory read-only route declares a mutating index tool

The `memory` route is `read-only` but its route-specific `mcp_tools` includes `mcp__mk_spec_memory__memory_index_scan` [SOURCE: .opencode/commands/doctor/_routes.yaml:27-39]. The diagnostic YAML calls only health, stats, and drift traversal and frames indexing as a recommendation [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:145-174]. The router frontmatter also grants the mutating tool globally [SOURCE: .opencode/commands/doctor/speckit.md:1-5]. **Concrete fix:** remove `memory_index_scan` from the memory route and `/doctor` router grant; retain it only on the standalone mutating `/doctor:update` command, where it is actually used [SOURCE: .opencode/commands/doctor/assets/doctor_update.yaml:399].

### P1 - Doctor - Route validator does not validate route-to-script existence or mutation honesty

`route-validate.py` claims YAML-asset and mutation-class checks, but the implementation only verifies that each YAML exists and that `mutating` belongs to the allowed enum [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:6-16] [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:181-212]. It does not resolve `script_invocations`, inspect YAML `upstream_assets`, compare router/presentation target inventories, or detect writes inside `read-only` workflows. Consequently, it exits 0 while the findings above remain present. **Concrete fix:** extend the validator with local script-path existence checks, route/router/presentation target-set parity, and a read-only policy check that rejects packet/file/DB writes and mutating MCP tools unless the route is `add-only` or `mutates`.

### P2 - Doctor - `skill-graph-freshness` is unreachable from documented and presented target discovery

The manifest defines the tenth `skill-graph-freshness` route and its YAML/script [SOURCE: .opencode/commands/doctor/_routes.yaml:171-184], but the router workflow table stops at nine targets and then asserts no workflow gap exists [SOURCE: .opencode/commands/doctor/speckit.md:25-41]. The presentation's unknown-target list and subsystem table also omit it [SOURCE: .opencode/commands/doctor/assets/doctor_speckit_presentation.txt:75-105]. **Concrete fix:** add `skill-graph-freshness` to the router table, numbered target menu, valid-target error, and subsystem manifest; derive these displays from `_routes.yaml` where practical.

### P1 - Cross-Surface - Skill graph representations still encode retired topology

The read-only freshness target ran successfully and reported a SQLite zombie `cli-codex-retired`, nine compiled ghost nodes, and family mismatches for `sk-design` and `sk-prompt`. The compiled graph visibly retains the retired standalone topology (`deep-loop-runtime`, `deep-loop-workflows`, `mcp-open-design`, and `sk-prompt-models`) and classifies current hubs under stale families [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:1]. **Concrete fix:** run the operator-gated canonical skill-graph reindex, then verify compiled JSON, SQLite, and the twelve on-disk `graph-metadata.json` records converge with no zombie/ghost/family mismatch output.

## Questions Answered

- All ten primary doctor route YAML assets currently exist.
- Every local script explicitly declared by the ten primary routes exists on disk.
- The read-only diagnostics are executable: memory reported degraded vector consistency, embeddings reported one active ready backend, causal graph reported attention, code graph reported absent, deep-loop returned an empty session-scoped graph after a valid session ID was supplied, parent-skill passed, skill-budget reported budget overflow, skill-graph freshness reported drift, and fable-mode completed.
- The initial deep-loop error `{"status":"error","error":"sessionId is required","code":"INPUT_VALIDATION"}` was an unresolved setup input, not a missing or broken script; the same command succeeded with the lineage session ID from `deep-research-config.json`.
- The current validator proves route-to-YAML existence only. It does not prove full route-to-YAML-to-script existence, target discovery parity, or mutation-class honesty.

## Questions Remaining

- Do all command workflow YAMLs and presentations outside `/doctor` match their command Markdown and compiled contracts field by field?
- Are all 12 Claude/OpenCode agent mirrors body-synced and correctly localized?
- Which remaining router-level allowed tools are unused overgrants after route-specific reconciliation?
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required?

## Next Focus

Audit all 12 Claude/OpenCode agent mirror pairs for body drift, tool-grant coherence, runtime-local path references, and current skill/model references.

Ruled out this iteration: missing primary doctor YAML assets; missing route-declared local scripts; deep-loop script failure after a valid session namespace is supplied.
