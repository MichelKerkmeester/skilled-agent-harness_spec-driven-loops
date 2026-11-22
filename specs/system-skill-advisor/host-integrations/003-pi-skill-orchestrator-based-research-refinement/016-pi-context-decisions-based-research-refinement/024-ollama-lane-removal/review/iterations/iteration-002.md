# Iteration 002: Security (apply mode delete, signal and network paths)

## Dispatcher
- Iteration 2 of 10, mode review, dimension security, lineage new, generation 1. JSONL-derived iteration number (1 prior record + 1) matches the dispatch.
- BINDING: target=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal
- BINDING: maxIterations=10
- BINDING: convergence=0.1
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal

## Files Reviewed
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` lines 190-281 (constants, dotenv CLI, fixed names), 826-960 (host normalizer, machine context, model server folders), 1170-1190 (M3 copy classification), 1222-1345 (process list, ownership, M4), 1466-1507 (M7 dotenv), 1620-1990 (apply mode)
- `.skilled/hooks/env-secret-guard/cli/env-secret.cjs` (the `keys` action)
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` lines 18-88 and 217-235 (write boundary, phase 7 lane cleanup)
- `.github/workflows/advisory-checks.yml` lines 21-33 and 138-159 (lane-residue job)
- `.env.example` diff from the merge base
- `008-cleanup-wiring-and-gating/acceptance-criteria.md` AC-007 and `tasks.md` T006, T012
- Live probe: `resolveModelServerDirs` plus `checkModelServer` with `HF_EMBED_SERVER_URL=<tmp>/notes.txt` (a regular text file) and an empty process list.

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Apply deletes whatever regular file `HF_EMBED_SERVER_URL` names, with no check that it is a socket** -- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:949` -- `resolveModelServerDirs` turns any non-`tcp`/`http` value into a path (`unixSocketPathOf`, line 917-922, accepts a bare path with no `unix://` prefix) and adds its basename as an extra file to probe. `checkModelServer` lists any existing entry under that name as `kind: 'server-file'` (line 1319), and apply's `deleteServerFile` passes it to `deleteContained` (lines 1934-1936), which refuses only symlinks and directories and never checks `isSocket()` (no `isSocket` call exists in the file). Probed: with `HF_EMBED_SERVER_URL=<tmp>/notes.txt` holding text, M4 reports `{"kind":"server-file","path":"<tmp>/notes.txt"}`, status `found`, and `resolveContainedTarget` returns `status: ok`, so with no model server running apply would `rmSync` the file. The four fixed names are owned by the server, but this one name is chosen by a variable whose lane no longer exists, so a stale or mistyped value (for example a path meant for another tool) turns a user file into "residue". Under `/doctor:update apply` the delete is covered by the one startup approval and is not asked about separately. P2 because it needs a misconfigured environment value and the file is listed in the machine report before apply runs.
   Finding class: destructive-path hardening gap
   Scope proof: M4 explicit-address probe (`sweep-lane-residue.mjs:917-922`, `949`, `1319`) and the M4 apply branch (`1925-1940`); the fixed-name probes and the `--socket-dir` folder removal are not affected.
   Affected surface hints: `unixSocketPathOf`, `resolveModelServerDirs`, `checkModelServer`, `deleteServerFile` in `cleanOwnedLeftovers`, sweep-lane-residue.vitest.ts AC-007 case, 008 AC-007
   Case: an operator still has `HF_EMBED_SERVER_URL=/Users/x/notes/todo.md` exported from an old experiment; `/doctor:update apply` reaches lane cleanup with no model server running and the tool deletes `todo.md` as a model server file.

## Traceability Checks
- spec_code (partial): 008 AC-007 asks apply to delete the exact socket file a unix `HF_EMBED_SERVER_URL` names, and the code does (`sweep-lane-residue.mjs:949`, `1934-1936`); the AC fixture's `custom.sock` is a plain file, so the AC itself never pins the file type, which is why the gap above passes its test. The shared-model gate matches the doctor contract: non-interactive apply deletes only on `--shared-model delete` (`sweep-lane-residue.mjs:1958-1966`, `doctor-update-apply.yaml:222-230`).
- checklist_evidence (partial): 008 CHK-FIX-006 (hostile environment scrub of `HF_EMBED_SERVER_URL`) is evidenced in tasks.md; other children's checklists still not walked.

## Integration Evidence
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` phase_7_lane_cleanup: runs `machine --json`, asks the shared-model question only when `askFirst` is non-empty, passes the answer only to the next `apply --json ... </dev/null`, and declares that it passes no path to the tool (line 85).
- `.github/workflows/advisory-checks.yml` lane-residue job: top-level `permissions: contents: read`, actions pinned by SHA, runs `repo` mode only; never `machine` or `apply`.
- `.skilled/hooks/env-secret-guard/cli/env-secret.cjs`: the `keys` action returns key names through `core.listKeys`; M7 records key and path only.

## Edge Cases
- PID reuse between the `ps` read in the before-check and `SIGTERM` in `stopProcess` is a small window; only same-user processes can be signalled, and a failed signal is recorded as `failed`, not stopped. Not raised.
- `SYSTEM_SKILL_ADVISOR_DB_DIR` can point M3 deletes at another checkout's database folder; only fixed names and pattern-matched copies holding lane objects go, and the database is derived state. Recorded for the maintainability pass, not a security finding.
- `.env.example` drops the launcher RSS watchdog and crash-loop rows; `rg` finds no live reader of `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` or `SPECKIT_LAUNCHER_CRASH_LOOP_MAX_DEATHS` outside `node_modules`/`dist`, so the removal is consistent.

## Confirmed-Clean Surfaces
- `resolveContainedTarget` and `deleteContained`: fixed segments only, symlink target refused, real parent must stay under the real root, a directory goes only where the fixed name is a folder.
- `removeEmptyDir`: `rmdirSync` only, refuses a symlink or non-directory, keeps a non-empty folder.
- `stopProcess`: SIGTERM only, never SIGKILL; only processes whose real script folder equals this checkout's `.skilled/bin` are signalled (`isOwnedModelServer`), and files are kept when any server is unowned, still alive, or the process list is unreadable.
- `deleteOllamaModel`: fixed model name in a JSON body, host reduced to a URL origin by `normalizeOllamaHost`, 10 s timeout; runs only on `--shared-model delete` or an explicit terminal yes; closed stdin counts as no.
- `keepForLaneSource`: a checkout still holding a lane source deletes, stops and asks nothing.
- M7 never reads dotenv values.

## Ruled Out
- Symlink redirection of any apply delete: refused at the target and, for server files, at the folder (`isSymlink(dir)`).
- SIGTERM to another checkout's or another user's model server: ownership compares real script folders; another user's process yields EPERM and is recorded as failed.
- Secret exposure through M7: only key names leave the dotenv CLI.
- CI privilege or supply-chain exposure in the lane-residue job: read-only token, SHA-pinned actions, no install.

## Next Focus
- Dimension: traceability
- Focus area: walk every child's acceptance-criteria rows against code and tests (002 doctor surface, 003 feeders, 005 shared embeddings, 006 prose docs and changelogs, 007 generated surfaces), plus the overlay protocols feature_catalog_code (`lane-residue-gate-and-cleanup.md`) and playbook_capability (`doctor-update-apply*.md`).
- Reason: correctness and security are covered; spec_code and checklist_evidence are still partial.
- Rotation status: correctness and security done (first pass); traceability, maintainability remain.
- Carry-forward: R1-P2-001, R1-P2-002, R2-P2-001; 008 AC-007 does not pin the socket file type.
- Required evidence: file:line for each Met row checked; name the exact catalog and playbook files compared.

Review verdict: PASS
