### Spec Kit & Memory

- **Spec folders moved** to a top-level `specs/` directory (from `.opencode/specs/`), with the old path kept as a compatibility symlink so existing references keep working.
- **Context now survives compaction and restarts automatically** — it's precomputed before compaction, auto-injected into new sessions, and auto-primes across startup, resume, clear, and compact events (including hookless runtimes like OpenCode), plus a new `session_health` tool reports traffic-light session status.
- **Memory search actually returns relevant results** — hybrid retrieval fuses vector, BM25, and graph signals with confidence-based truncation, fixes the "always zero results" bug, and adds caching and dedup for faster repeat lookups.
- **Safer memory tooling** — deleting a single record now requires confirmation, and full scans/reindexes no longer rewrite your tracked source `.md` documents; `memory_index_scan` also runs in the background by default.
- **Split any spec into phases** using the `:with-phases` suffix and `--phase-folder` argument on existing plan/complete commands, with phases recommended, scaffolded, and validated automatically.
- **Current and consistent docs** — the rewritten root README documents the full workflow, and skill/command/env docs now match shipped behavior; the spec tree is organized into six themed tracks instead of a flat list.
- **Leaner templates and tighter checks** — Level 1 research templates scaffold ~175 lines instead of 944, the four core templates were consolidated into one shared core, and a new advisory scope-adherence check catches out-of-scope edits before review.
- **Nested changelog generation** for packet roots and child phases via `/create:changelog`, written to the parent's centralized `changelog/` directory.
- **Daemon and MCP hardening** — MCP tools reject unapproved arguments before running, the daemon gained startup reliability and ownership-safety fixes, and memory health reports actual index consistency.
