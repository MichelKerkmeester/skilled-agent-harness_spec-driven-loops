# Proposal: `/doctor:speckit deep-loop`

Verdict: fix

Inference: keep the route and fix its contract. The route lists live status, query, and convergence scripts, and its route-level validator passes (`.skilled/commands/doctor/_routes.yaml:69-73`; `.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md:22-31`; `doctor-run.log:64-92`). The workflow still invokes retired `deep_loop_graph_*` tools even though the route declares no MCP tools, and the runtime documentation maps those names to direct scripts (`.skilled/commands/doctor/assets/doctor-deep-loop.yaml:167,180,185-191`; `.skilled/commands/doctor/_routes.yaml:69-73`; `.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md:22-31`). The safe probes only reached argument validation; they do not establish that valid invocations are read-only (`doctor-run.log:36-55`).

## Minimal edits to make

These are proposed edits; no source or route files were changed during this audit.

1. **Make the current scripts genuinely read-only before using them in this doctor.** The current status/query/convergence scripts expose no read-only or dry-run flag (`reality-check.md:38`; `.skilled/skills/system-deep-loop/runtime/scripts/status.cjs:61-79,113-120`; `query.cjs:56-106`; `convergence.cjs:98-128,670-699`). Add `--read-only` to each argument parser and pass that mode to the database adapters. In read-only mode, open only an existing database without creating its directory, schema, or migrations, and skip status/convergence observability appends. The current coverage getter creates directories, opens a writable database, applies schema and may update the schema version (`.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:318-359,378-380`); status and convergence append observability events (`status.cjs:93-105,195-196`; `convergence.cjs:275-289,876`). Apply the same existing-file-only read path to `.skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts`, whose getter initializes its database and schema (`council-graph-db.ts:256-274,292-294`).

   Old route invocations (`_routes.yaml:71-73`):

   ```text
   node .skilled/skills/system-deep-loop/runtime/scripts/status.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}"
   node .skilled/skills/system-deep-loop/runtime/scripts/query.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}" --query-type "{query_type}"
   node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}"
   ```

   New route invocations, after the read-only option is implemented:

   ```text
   node .skilled/skills/system-deep-loop/runtime/scripts/status.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}" --read-only
   node .skilled/skills/system-deep-loop/runtime/scripts/query.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}" --query-type "{query_type}" --limit 50 --read-only
   node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}" --iteration "{latest_iteration}" --persist-snapshot false --read-only
   ```

2. **Use those commands in the workflow instead of retired tool names.** In `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:167,180,185-191`, replace calls such as `deep_loop_graph_status({specFolder, loopType, sessionId})` with the read-only status command shown above; replace `deep_loop_graph_query({queryType, limit})` and `deep_loop_graph_convergence({...})` with the matching read-only query and convergence commands above. Keep `deep_loop_graph_upsert` only as a forbidden legacy name in the invariant; do not present it as a callable tool. The route already sets `mcp_tools: []` and lists the three script paths (`_routes.yaml:69-73`), while the script contract documents the replacements (`script-interface-contract.md:22-31`).

3. **Align the workflow’s write boundary with its state-log output.** In `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:5,25-32,54,81-109,220-229,243-255`, keep graph databases and source inputs read-only, and allow only the packet-local state log as an add. Keep the existing database entries and add this exact allowed target:

   ```yaml
   - "<active-spec-folder>/scratch/doctor-deep-loop-state.*.json"
   ```

   The current workflow writes that file in phase 3 (`doctor-deep-loop.yaml:220-229,243-255`), but the current allowlist contains only graph databases and their backups (`doctor-deep-loop.yaml:81-86`). At line 5 replace `No mutations.` with `Graph and source inputs are read-only; the workflow adds one packet-local state log.` At line 25 replace `Deep-loop doctor is read-only by contract.` with `Graph and source reads are read-only; the only write is the packet-local state log.` At line 54 replace `This command is READ-ONLY by contract.` with the same text. Replace the policy with `policy: "Graph databases and source inputs are read-only; only the packet-local state log may be added."` Replace the validator `runs` value with `runs: "Apply these target checks before any write; only the packet-local state log is permitted."` Replace the enforcement sentence that halts on `Any attempted write` with: `Any write outside the allowed packet-local state log halts with STATUS=FAIL and ERROR='confirm-mode-mutation-violation'.` Retain the route’s `add-only` classification (`_routes.yaml:67-68`).

4. **Replace stale local-contract references with existing sources.** In `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:37-46`, replace the absent local files with:

   ```yaml
   contract: "current runtime script interface"
   files:
     script_interface: ".skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md"
   ```

   The replacement exists and documents the current CLI lifecycle (`.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md:22-31`). Remove the trailing source-setting comment so the line reads `minimum_iterations: 3`; the searched system-deep-loop skill tree has no such setting, while the workflow states its local three-iteration threshold (`reality-check.md:40`; `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:44-46,151`). At `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:223`, replace `Compose report following OUTPUT CONTRACT in deep-loop.md.` with `Compose the report using this workflow's output_contract below.` The report contract is already in the same YAML (`doctor-deep-loop.yaml:220-255`), and the referenced `deep-loop.md` was absent from the searched doctor, runtime, and active packet paths (`reality-check.md:56`).

5. **Make scope and presentation wording match.** In `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:25-28`, change `research/review/context` to `research/review`; the user-selectable scopes cover research, review, and council but have no context option (`doctor-deep-loop.yaml:62,71-76`; `_routes.yaml:65-66`). In `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt:15,55-56,97`, replace the menu wording `research/review iteration graphs` with `research/review iteration graphs, council graph`; replace the help wording `deep-research/deep-review iteration graph empty` with `deep-research/deep-review/ai-council graph empty`; and replace the manifest purpose `Diagnose deep-loop coverage graphs for research and review` with `Diagnose deep-loop coverage graphs for research, review, and council`. The route and workflow accept council, while these presentation descriptions mention research/review only (`_routes.yaml:66`; `doctor-deep-loop.yaml:74-76,188-190`). At `doctor-speckit-presentation.txt:123-133`, restrict the existing `stale|missed|bloat|all|excludes` choices to `speckit-retrieval` and add a deep-loop prompt using:

   ```text
   Which graph scope should I inspect?
   1) research
   2) review
   3) council
   4) both (research and review)
   5) all (default)
   ```

   Accept `1-5`; empty defaults to `all` (`_routes.yaml:65-66`; `doctor-deep-loop.yaml:62,68-76`).

6. **Describe the target check as workflow logic, not a missing executable.** In `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:102-109`, remove `name: validate_targets` and replace the `runs` value with `runs: "Apply these target checks inline as workflow steps; no separate helper is invoked."` The searched command and runtime trees contain the YAML declaration but no executable `validate_targets` implementation (`reality-check.md:39`).

7. **Correct the command stored in the state log.** In `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:246`, replace `command: "/doctor deep-loop"` with `command: "/doctor:speckit deep-loop"`. The current value does not match the routed command syntax (`doctor-deep-loop.yaml:246`; `.skilled/commands/doctor/speckit.md:2-3,61`; `reality-check.md:43`).

## FINDINGS

- The subsystem's current database access is not read-only: coverage initialization can create storage, apply schema, and migrate the schema version, coverage query functions call `getDb()`, and the council getter initializes its database/schema (`.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:318-359,378-380`; `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:179-181`; `.skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts:256-274,292-294`). Status and convergence also append telemetry (`.skilled/skills/system-deep-loop/runtime/scripts/status.cjs:93-105,195-196`; `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:275-289,876`). These are findings about the inspected runtime and are not changed by this proposal.
- The coverage database file is absent in this checkout (`doctor-run.log:22-27`); a council database file exists (`doctor-run.log:15-20`), but its SQLite contents remain unknown because the read-only `sqlite3` probe failed to open it (`doctor-run.log:36-41`). The active packet directory scan found only the packet and `scratch/`, and the source-file globs found no matches (`reality-check.md:54`; `doctor-run.log:1-6`). These are checkout observations, not proof of a defect in graph contents.
- The invalid-loop-type script probes returned validation errors before opening a database, so valid read-only runtime behavior remains unverified (`doctor-run.log:36-55,94`). The route validator passed with two informational flag-collision warnings, but that result only confirms its reported route checks (`doctor-run.log:64-92`).
