## Focus

Validate process-sweep and rerank-sidecar lifecycle recommendations for safety and operator usability. This pass checks the metadata needed to distinguish active sessions from stale child processes, the dry-run and confirmation gates required before termination, sidecar ownership across PID/port/health/lineage surfaces, unsafe `pkill`/pattern-matching risks, and whether sweep and sidecar lifecycle can share inventory code without becoming one overcoupled controller.

## Actions Taken

- Read the configured research state, strategy, synthesis, iterations 009, 010, and 012, plus deltas 009 and 010 before source inspection.
- Re-read the runtime inventory log from iteration 007 to ground process classifications in measured PID, PPID, RSS, elapsed-time, and command evidence.
- Inspected the cli-codex and cli-claude-code lifecycle guidance for session ownership, self-invocation guards, and cleanup instructions.
- Inspected the Python and Node rerank sidecar ensure helpers, the sidecar `start.sh`, the `/health` handler, sidecar tests, and the manual testing playbook.
- Compared sidecar lifecycle needs with the code-graph and spec-memory launcher lease patterns, especially liveness handling and stale PID semantics.
- Kept this pass research-only: no source edits, no process termination, no new spec folders, no sub-agent or nested CLI dispatch.

## Sources Consulted

- `research/iterations/iteration-009.md:32-33`, `research/iterations/iteration-009.md:58`, and `research/deltas/iter-009.jsonl:2-3` for the final mapping of F-003 to `rerank-sidecar-lifecycle` and F-004/M-007-001 to `mcp-host-session-process-sweep`.
- `research/iterations/iteration-009.md:77`, `research/iterations/iteration-010.md:60-63`, and `research/deltas/iter-010.jsonl:5` for the final ordering and acceptance contract: host process sweep after daemon/code-graph ownership work, sidecar lifecycle as an independent but coordinated packet.
- `research/iterations/iteration-009.md:89-93` and `research/iterations/iteration-010.md:67-70` for the unresolved verification questions around successful-search RSS, sidecar fallback RSS, `ccc mcp` parent-PID classification, and effective code-graph DB-dir identity.
- `research/iterations/iteration-012.md:45-51`, `research/iterations/iteration-012.md:55-59`, and `research/iterations/iteration-012.md:67-72` for the stale/orphan classification constraints: `ESRCH` is stale, `EPERM` is live/unknown, and PPID 1 alone is not stale proof.
- `research/logs/iteration-007-runtime-measurement.json:7-18` and `research/logs/iteration-007-runtime-measurement.json:22-35` for measured process inventory: sidecar, detached `ccc run-daemon`, multiple `ccc mcp` children, code-graph launchers/servers, parent PIDs, RSS, elapsed times, and commands.
- `.opencode/skills/cli-codex/SKILL.md:61-77`, `.opencode/skills/cli-codex/SKILL.md:350`, `.opencode/skills/cli-codex/SKILL.md:357`, `.opencode/skills/cli-claude-code/SKILL.md:64-79`, and `.opencode/skills/cli-claude-code/SKILL.md:350` for session markers, process ancestry, lock-file probes, stdin/background hazards, and current broad kill guidance.
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:49-56`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:98-128`, `.opencode/bin/lib/ensure-rerank-sidecar.cjs:84-113`, and `.opencode/skills/system-rerank-sidecar/scripts/start.sh:24-46` for current sidecar probe, spawn, timeout cleanup, env allowlist, and uvicorn launch behavior.
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:194-206` for the current `/health` response shape.
- `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:139-145`, `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:84-87`, `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:149-180`, and `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:15-37` for existing sidecar stop/restart commands, playbook evidence requirements, broad `pkill` scenarios, and test cleanup behavior.
- `.opencode/bin/mk-code-index-launcher.cjs:157-163`, `.opencode/bin/mk-code-index-launcher.cjs:183-194`, `.opencode/bin/mk-code-index-launcher.cjs:221-225`, `.opencode/bin/mk-code-index-launcher.cjs:471-498`, `.opencode/bin/mk-spec-memory-launcher.cjs:150-160`, and `.opencode/bin/mk-spec-memory-launcher.cjs:188-192` for reusable lease and liveness classification patterns.
- `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:183-195`, `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:239-250`, and `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:312-337` for existing launcher tests that cover live owner, dead PID reclaim, and signal cleanup but not broad process-sweep ownership.

## Findings

1. The process sweep needs an inventory schema before it needs a termination command. Sufficient metadata is: PID, PPID, process group/session ID where available, executable path, argv, cwd, startedAt/elapsed time, non-mutating liveness state, RSS/VSZ as diagnostic only, service kind, effective resource identity (`RERANK_SIDECAR_PORT`, `SPECKIT_CODE_GRAPH_DB_DIR`, daemon socket/root), source launcher, owner token/session ID, parent session ID, current executor metadata, and a relationship label (`current`, `ancestor`, `descendant`, `sibling`, `orphan_candidate`, `unknown`). Iteration 007 proves command and parent data are necessary because it measured multiple unrelated-looking `ccc mcp`, launcher, sidecar, and CLI processes in the same window (`research/logs/iteration-007-runtime-measurement.json:7-35`).

2. Dry-run must be the default and should be structurally impossible to bypass with a glob/pattern. The safe flow is `inventory -> classify -> dry-run report -> explicit confirmation by exact PID/resource identity -> bounded SIGTERM -> post-check -> optional SIGKILL only for confirmed owned descendants`. The report must block termination for the current PID, ancestors of the current process, active dispatchers, lock-file holders, `EPERM`/unknown liveness, healthy sidecars with unknown owner, and any process whose effective resource identity cannot be proven. This refines the final sweep gate from iteration 009 (`research/iterations/iteration-009.md:58`) and iteration 010 (`research/iterations/iteration-010.md:60-63`) into operator-facing acceptance criteria.

3. The existing CLI cleanup guidance is too broad to be used as the implementation model. cli-codex and cli-claude-code currently recommend `pkill -9 -f` patterns for dispatcher/orphan cleanup and include `ccc search`, `gtimeout`, and `rerank_sidecar:app` in the cleanup set (`.opencode/skills/cli-codex/SKILL.md:357`, `.opencode/skills/cli-claude-code/SKILL.md:350`). That can kill another active session, the current deep-flow iteration, or unrelated operator work matching the same argv fragment. It is also one shell-string interpolation away from command-injection if future code builds patterns from user input.

4. The sidecar currently has health and port identity, but not ownership identity. The Python ensure helper returns `ownerPid` only when it spawned the process and returns `ownerPid: None` when a healthy port already exists (`.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:98-128`); the Node helper has the same shape (`.opencode/bin/lib/ensure-rerank-sidecar.cjs:84-113`). The `/health` response exposes model state, queue depth, and uptime, but no PID, startedAt, port, owner token, or consumer/session lineage (`.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:194-206`). A lifecycle packet should add a port-keyed sidecar ledger plus a non-secret owner-token fingerprint or service instance ID so reuse, stale detection, and stop behavior can distinguish "healthy shared service" from "stale previous service".

5. Sidecar ownership should be represented as shared service ownership, not first-caller ownership. The playbook expects mk-spec-memory and mcp-coco-index to share one sidecar process (`.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:169-180`), so the ledger should separate `service_instance` metadata from `consumer_claims`. A PID file can record PID, startedAt, port, start command hash, skill path, process group/session ID, health URL, model revision, and owner token fingerprint; health can expose PID, startedAt/uptime, port, loaded models, and instance ID; consumer claims can record recent clients without giving any one caller authority to terminate a healthy shared service.

6. The code-graph launcher is the best local model for liveness classification, but not for a monolithic kill controller. It keys ownership to the effective DB dir (`.opencode/bin/mk-code-index-launcher.cjs:157-163`), treats `ESRCH` as reclaimable stale and `EPERM` as live/held (`.opencode/bin/mk-code-index-launcher.cjs:183-194`), atomically writes PID lease state (`.opencode/bin/mk-code-index-launcher.cjs:221-225`), and blocks duplicates with `LEASE_HELD_BY` (`.opencode/bin/mk-code-index-launcher.cjs:471-498`). The process-sweep inventory can reuse those classification primitives, but termination must stay service-policy-specific because sidecar port ownership, code-graph DB ownership, CLI dispatcher ancestry, and CocoIndex daemon socket/root identity have different safety rules.

7. Existing sidecar operational docs and model-swap script still use unsafe broad patterns. `use-model.sh` stops the existing sidecar with `pkill -TERM -f "uvicorn scripts.rerank_sidecar"` before starting a fresh one (`.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:139-145`), and the manual playbook repeatedly uses `pkill -f rerank_sidecar` or `pkill -KILL -f rerank_sidecar` (`.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:149-180`). Those are acceptable as manual smoke-test shorthand only if labelled destructive; implementation acceptance should replace them with PID-file/health-instance checks and exact PID termination.

8. Process sweep and sidecar lifecycle can share inventory code if the shared boundary is deliberately small. Share pure collectors and classifiers that return a normalized record with liveness, lineage, resource identity, and risk flags. Do not share a generic reaper. Each service should provide its own policy adapter: sidecar checks port+health+ledger, code-graph checks DB-dir+lease+bridge, CLI dispatch checks current session/ancestry/lock, and CocoIndex checks daemon socket/root plus task lifecycle from prior packets. This avoids duplicating fragile `ps` parsing while preventing a sweeping abstraction from hiding destructive behavior.

## Questions Answered

- What process metadata is sufficient to distinguish active sessions from stale child processes? PID/PPID alone is not enough. The minimum is process identity plus lineage, current-session relationship, effective resource identity, service kind, non-mutating liveness, owner/session token, startedAt/age, and health/lease evidence. PPID 1 is only an orphan candidate; `EPERM` remains live/unknown.
- What dry-run and confirmation gates prevent killing the current session or unrelated work? Always produce a dry-run inventory first, block the current process/ancestors/active locks/unknown liveness, require exact PID plus resource-identity confirmation, use bounded SIGTERM before any SIGKILL, and make broad pattern termination unavailable to normal remediation code.
- How should rerank sidecar ownership be represented across PID files, ports, health endpoints, and parent/session lineage? Use a port-keyed sidecar ledger with PID, startedAt, port, process group/session ID, start command hash, instance ID, skill path, model revision, owner token fingerprint, and consumer claims; mirror non-secret instance/PID/startedAt/port fields in `/health`; treat the port bind as startup atomicity but not as ownership proof.
- Where are command injection or unsafe `pkill`-pattern risks in the proposed process sweep? The risk is in the current guidance and playbooks: `pkill -9 -f "codex exec --model"`, `pkill -9 -f "claude -p"`, `pkill -f rerank_sidecar`, and `pkill -TERM -f "uvicorn scripts.rerank_sidecar"` all match argv text rather than owned PIDs. If any pattern becomes user-derived, it also becomes shell-injection-prone.
- Can process sweep and sidecar lifecycle share inventory code without overcoupling? Yes. Share collectors, normalization, and liveness/resource classifiers. Keep termination policy in per-service adapters and require each adapter to prove ownership before it can emit a terminate action.

## Questions Remaining

- What exact ledger path should the sidecar use: skill-local cache, user cache (`~/.cache/mk-reranker`), temp fallback, or a port-hashed location shared by both Python and Node helpers?
- Should `/health` expose raw PID or only an instance ID plus startedAt, with PID limited to the local ledger? Loopback-only makes raw PID reasonable, but the implementation packet should decide deliberately.
- What is the best cross-platform way to capture process group/session ID on macOS and Linux without making the inventory command itself fragile?
- Should deep-flow kill-between behavior be represented as a pre-authorized confirmation scope, or should every destructive sweep still require a fresh explicit confirmation outside the YAML loop?

## Ruled Out

- Using broad `pkill -f` or `pkill -9 -f` patterns as the process-sweep implementation. They are too coarse for multi-session operator environments.
- Treating a healthy sidecar port as owned by the current session. A healthy port proves service availability, not lineage or termination authority.
- Treating PPID 1 as stale proof. Iteration 012 already established that it proves orphaning, not inactivity or DB/model safety.
- Treating `EPERM` from liveness probes as reclaimable stale. The existing launcher policy is correct: permission denial means live/unknown.
- Building one shared reaper for sidecar, code-graph, CLI dispatchers, and CocoIndex daemon children. Shared inventory is useful; shared termination policy is too risky.

## Dead Ends

- Runtime `ps`/`pgrep` enumeration was not retried. Iteration 007 already captured the needed process inventory, and iteration 012 ruled out retrying sandboxed enumeration for this lane.
- No induced sidecar crash or `pkill` test was run. The point of this pass was to design gates that avoid destructive pattern-based termination.
- No target source files or follow-up packet folders were edited.

## Reflection

- What worked and why: Reading the process inventory log alongside the launcher and sidecar ownership code made the missing metadata obvious: PID and port prove existence, not ownership.
- What did not work and why: The current playbook cleanup commands are useful as shorthand for a human smoke test, but they are not safe enough to translate into remediation code.
- What I would do differently: Pull the sidecar Node helper and manual playbook into the earlier final synthesis, because they contain the clearest evidence for both the shared-service model and the unsafe cleanup patterns.

## Next Focus

Iteration 014 should validate the resident-memory cleanup recommendations that remain after lifecycle safety: adapter lifecycle, `_ADAPTERS` and `httpx.Client` close paths, bundled CrossEncoder fallback behavior, and registry embedder cache eviction. Keep the P2-bound memory framing unless new successful-search or fallback-growth evidence appears.

## Recommended Next Focus

Validate `adapter-lifecycle-management` and `registry-embedder-cache-lifecycle` acceptance tests, especially sidecar failure fallback, cache eviction on config refresh/remove, idempotent close/unload semantics, and the benchmark gate required before any severity escalation.
