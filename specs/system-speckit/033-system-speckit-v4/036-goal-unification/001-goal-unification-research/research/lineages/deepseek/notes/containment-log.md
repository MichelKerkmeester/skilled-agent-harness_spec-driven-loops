# Containment and deviation log — lineage `deepseek`

Recorded for the runner's audit. Nothing here is a finding about the research topic; it is the lineage's own
audit trail.

## Authorized write surface

`specs/system-speckit/033-system-speckit-v4/036-goal-unification/001-goal-unification-research/research/lineages/deepseek`
(bound from the `config.fanout_lineage_artifact_dir` override; the `resolveArtifactRoot` node command was not
run, as instructed).

## Files written (all inside the surface)

| Group | Files |
|-------|-------|
| Init | `deep-research-config.json`, `deep-research-strategy.md` |
| Iterations | `iterations/iteration-001.md` … `iteration-010.md` |
| Deltas | `deltas/iter-001.jsonl` … `iter-010.jsonl` |
| Event records (gateway input) | `notes/iter-001-event.json` … `notes/iter-010-event.json`, `notes/probe-event.json` |
| Ledger-backed state | `deep-research-state.jsonl`, `deep-research-ledger/**`, `deep-research-audit-ledger/**`, `deep-research-effect-ledger/**`, `.legacy-projection-watermarks/research-state.json`, `locks-and-fencing-v1/**`, `state-events.jsonl` (gateway-owned) |
| Synthesis | `research.md`, `convergence-report.md`, `synthesis.json`, `findings-registry.json`, `deep-research-dashboard.md` |
| Audit | this file, `notes/containment-log.md` |

## Commands run

- Read-only inspection: `sed`, `grep`, `rg`, `find`, `ls`, `wc`, `git status --porcelain` (read-only).
- `node .opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs --mode research --run-directory
  <lineage dir> --event-json <notes file>`: run 11 times (1 probe + 10 iterations). All gateway writes land
  under the lineage directory because the run directory *is* the lineage directory.
- No `generate-context.js`, no `validate.sh`, no git write/checkout/commit, no repo build or test run.

## Disclosed deviation

1. **One shell temporary file outside the surface.** During iteration 2 the event record was composed with
   `head -1 <delta> > /tmp/iter002-event.json` before being copied into `notes/`. `/tmp` is outside the repo
   and outside the lineage; the file is a transient copy of a JSON line, contains no repo data beyond the
   event record, and was not used as a write path for any repo file. Iterations 3-10 wrote the event record
   directly into `notes/` with no temp hop.
2. **Terminal synthesis record is a plain artifact, not a gateway append.** `synthesis_complete` is a pinned
   legacy event in the ledger schema
   (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:53`),
   so the append gateway refuses it by design. `synthesis.json` therefore carries `stopReason:
   "maxIterationsReached"` as a file artifact; all ten *iteration* records were appended through the
   gateway with receipts (ledger sequences 2-11).
3. **No executor dispatch.** Every iteration was performed inline in this session, per the fan-out
   execution-mode instruction; no nested CLI, agent, or subprocess was spawned. A first probe command using a
   shell variable was refused by the harness guard ("Pi dispatch denied"), after which all commands used
   literal paths.

## Evidence discipline applied

- Every behavioural claim carries a `file:line` citation that was read.
- Two citation defects found in source documents are recorded as findings rather than silently worked
  around: the charter's `.opencode/hooks/hooks/injection-contract.md` path (real file one level up) and the
  playbook's budget-rule reference to `validation-rules.md` (no `goal` match there).
- One errata row records five off-by-one constant citations from iteration 3 (`deltas/iter-004.jsonl`).
- Unknowns are marked UNKNOWN (host injection caps for five runtimes) rather than inferred into the design.
