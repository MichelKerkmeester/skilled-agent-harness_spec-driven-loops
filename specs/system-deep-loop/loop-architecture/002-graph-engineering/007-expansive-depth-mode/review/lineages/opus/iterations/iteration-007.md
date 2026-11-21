# Iteration 007 - Frontier node F-1-005: security

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-005 (depth 1), dimension security
- Sources read before work: lineage steer.md (absent), frontier block for F-1-005 security, convergence decision for iteration 6 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:2199-2222 (flag guards, read-only open), recordBlockedStop (temp event file, gateway spawn, env)
- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:392-415 (openReadOnlyDb)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- `recordBlockedStop` writes its event to a fresh `mkdtemp` directory under the OS temp root and removes it in `finally`. It runs the gateway as `process.execPath` with an argv array (no shell) and drops `DEEP_LOOP_TSX_LOADED` so the gateway bootstraps its own loader (convergence.cjs recordBlockedStop). No caller-controlled string reaches a shell.
- `--record-blocked-stop` is refused without `--stop-decision`, with `--read-only`, or without a positive `--iteration` (convergence.cjs:2201-2210). These checks run before any state file is read.
- `openReadOnlyDb` copies a WAL-mode database into memory and patches its header to rollback mode, so a read-only open creates no `-wal`/`-shm` side files (coverage-graph-db.ts:404-410). A dry run leaves the graph store byte-identical.

## Edge Cases
- `readOnly` is `args.readOnly === true` while `recordBlockedStop` goes through `asBoolean` (convergence.cjs:2199-2200). A caller that passed `--read-only=true` as a string would be treated as live. Both workflows pass the bare flag, and the strict form predates the range, so this is recorded only.

## Confirmed-Clean Surfaces
- The blocked-stop event payload is built from gate objects and graph blockers and validated by the ledger schema's `json` and `gate-results` rules before commit.

## Ruled Out
- Shell injection through the blocked-stop gateway spawn: argv array, no shell.
- Dry-run graph side files: in-memory open.

## Next Focus
- Dimension: security
- Focus area: F-2-006 security (attempt logs as untrusted input)
- Reason: frontier round-robin
- Rotation status: F-1-005 correctness and security done
- Required evidence: file:line

Review verdict: PASS
