---
title: "Resource Map: 026/011 cocoindex-daemon-resilience research packet"
description: "Path ledger for the 5-iteration deep-research loop. Lists all artifacts read, written, and referenced across iterations 1-5."
trigger_phrases:
  - "026/011 daemon research resource map"
  - "cocoindex daemon research resources"
importance_tier: "important"
contextType: "research"
---

# Resource Map: 026/011 cocoindex-daemon-resilience research packet

Lean path ledger for the deep-research loop. All paths are absolute or repo-relative as documented at the time of the loop.

---

## READMEs

(none touched)

---

## Documents

### Authored by this loop (writes)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/research.md` (iter 5 synthesis)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/resource-map.md` (this file)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deep-research-strategy.md` (reducer-owned, refreshed iters 1-5)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deep-research-state.jsonl` (append-only, 6 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deltas/iter-001.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deltas/iter-002.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deltas/iter-003.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deltas/iter-004.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deltas/iter-005.jsonl`

### Read-only references (target packet)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/spec.md` (Level 2 draft, 23 corrections proposed in iter 4)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deep-research-config.json`

---

## Commands

(none invoked — this loop dispatched only `@deep-research` per iteration via `/spec_kit:deep-research`)

---

## Agents

- `.opencode/agents/deep-research.md` — sole executor across iters 1-5

---

## Skills

- `.opencode/skills/deep-research/SKILL.md` — workflow author
- `.opencode/skills/deep-research/references/loop_protocol.md` — lifecycle branch reference
- `.opencode/skills/system-spec-kit/SKILL.md` — distributed-governance source for the packet research-write exception

---

## Specs

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/` (target packet)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (parent phase folder)

---

## Scripts

(none ran — research phase is read-only on source. The orchestrator's reducer ran between iterations to refresh strategy.md, but no packet-local scripts were authored.)

External commands invoked (read-only forensics):

- `grep -rn 'start_daemon\|ensure_daemon\|stop_daemon' tests/`
- `grep -cE BrokenPipeError /Users/michelkerkmeester/.cocoindex_code/daemon.log`
- `grep -lE 'lmdb|LMDB|Environment\(' .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`
- `python3 -c 'import inspect, multiprocessing.connection as mc; print(inspect.getsource(mc.Listener.__init__))'`
- `lsof /Users/michelkerkmeester/.cocoindex_code/daemon.sock`
- `wc -l /Users/michelkerkmeester/.cocoindex_code/daemon.log`

---

## Tests

- `.opencode/skills/mcp-coco-index/mcp_server/tests/` (read-only inspection — confirmed empty of daemon-lifecycle tests, P1-4)

Test files referenced but NOT yet existing (must be CREATED in Phase 2 per P1-4):

- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_e2e_daemon.py`

---

## Config

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/research/deep-research-config.json` (read-only, owns lifecycle mode and budgets)

---

## Meta

### Source files investigated (READ-ONLY)

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` (start_daemon, _pid_alive, _cleanup_stale_files, stop_daemon, ensure_daemon)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` (handle_connection, _accept_loop, _async_daemon_main, signal handlers, FileHandler init)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` (subprocess.Popen entry points)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/project.py` (sole "LMDB" docstring reference)

### Runtime evidence (READ-ONLY)

- `/Users/michelkerkmeester/.cocoindex_code/daemon.log` (23 MB, 250485 lines, 564 BrokenPipeError, 2293 traceback frames)
- `/Users/michelkerkmeester/.cocoindex_code/daemon.pid` (content: 24938)
- `/Users/michelkerkmeester/.cocoindex_code/daemon.sock` (mtime May 1 17:27; PID 24938 bound)

### CPython stdlib references (read via `inspect.getsource`)

- `multiprocessing.connection.Listener.__init__` (default backlog=1)
- `multiprocessing.connection.SocketListener.__init__` (`self._socket.listen(backlog)`)
- `multiprocessing.connection.PipeListener.__init__` (family-uniform backlog kwarg)
