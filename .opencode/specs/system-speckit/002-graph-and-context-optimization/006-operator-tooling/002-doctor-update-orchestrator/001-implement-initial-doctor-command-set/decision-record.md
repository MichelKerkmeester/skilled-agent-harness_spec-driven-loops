---
title: "Decision Record: 013 Doctor Update Orchestrator"
description: "Architecture Decision Records (ADRs) for the 013 packet — captures the 7 Multi-AI Council questions and the chosen answers for /doctor:update operational safety, plus the memory_index_scan tx-model finding (ADR-001) gating cancel-safety semantics."
trigger_phrases:
  - "013 ADRs"
  - "doctor update decisions"
  - "council 10-line spec"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/001-implement-initial-doctor-command-set"
    last_updated_at: "2026-05-09T11:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored 8 ADRs capturing council 7 questions + tx-model placeholder"
    next_safe_action: "Run generate-context.js → description.json + graph-metadata.json; restore parent manual fields"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "resource-map.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-doctor-update-orchestrator"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "ADR-001 tx-model finding: pending Phase A.1 verification of handlers/memory-index.ts"
      - "ADR-009 (optional): external GPT-5.5 high dispatch waiver vs full second-opinion"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: 013 Doctor Update Orchestrator

<!-- SPECKIT_LEVEL: 2 -->

---

## Index

- [ADR-001: memory_index_scan transaction model](#adr-001-memory_index_scan-transaction-model) — gating cancel-safety contract
- [ADR-002: Pre-rebuild snapshots — full vs delegated (council Q1)](#adr-002-pre-rebuild-snapshots)
- [ADR-003: Lock contention with active MCP clients (council Q2)](#adr-003-lock-contention-with-active-mcp-clients)
- [ADR-004: Partial-failure recovery (council Q3)](#adr-004-partial-failure-recovery)
- [ADR-005: Concurrent dispatch protection (council Q4)](#adr-005-concurrent-dispatch-protection)
- [ADR-006: Tier-aware interactive mode (council Q5; superseded by ADR-010)](#adr-006-tier-aware-interactive-mode-auto-vs-confirm)
- [ADR-007: Cancellation semantics (council Q6)](#adr-007-cancellation-semantics)
- [ADR-008: Version migration legacy files (council Q7)](#adr-008-version-migration-legacy-files)
- [ADR-009: External second-opinion (optional REQ-021)](#adr-009-external-second-opinion-optional)
- [ADR-010: Mode reduction to interactive-only doctor commands](#adr-010-mode-reduction-to-interactive-only-doctor-commands)

---

## ADR-001: memory_index_scan transaction model

**Status**: **CONFIRMED — per-batch (per-file) transactions** (verified 2026-05-09 Phase A.1)

**Context**: The Multi-AI Council's Q3 (partial-failure recovery) and Q6 (cancellation semantics) answers depend on whether `memory_index_scan(incremental=false)` commits per-batch or in a single transaction. The council assumed per-batch and flagged the unknown explicitly.

**Decision**: Verified per-batch. The handler at `mcp_server/handlers/memory-index.ts:296` dispatches a `for (const filePath of mergedFiles)` loop where each `indexMemoryFile()` call opens its own better-sqlite3 transaction (per `lib/storage/incremental-index.ts:394` `db.transaction(() => { ... })` primitive and the inline comment at `memory-index.ts:560`: "indexMemoryFile() sets file_mtime_ms within its DB transaction"). There is no enclosing `BEGIN ... COMMIT` wrapping the whole scan.

**Evidence**:
- `mcp_server/handlers/memory-index.ts:296` — per-file loop dispatch
- `mcp_server/handlers/memory-index.ts:560` — inline comment confirming per-file tx
- `mcp_server/lib/storage/incremental-index.ts:394` — `db.transaction(() => { ... })` per-record primitive
- No grep hit for `db.exec('BEGIN')` or top-level transaction wrapper inside `handleMemoryIndexScan`

**Consequences (council Q3+Q6 answers stand verbatim)**:
- **Q3 (partial-failure)**: snapshot-restore is mandatory. A halt at minute 8 of 12 leaves N-of-M files committed and (M-N) files uncommitted. The SQLite WAL gracefully rolls back the in-flight per-file tx, but the prior committed files persist. To restore consistency relative to the start of the scan, the orchestrator must restore the snapshot.
- **Q6 (cancellation)**: SIGINT graceful — set cancel flag → let current per-file tx commit/abort cleanly (~1 sec, not 30 sec since per-file txs are short-lived) → restore snapshot of in-flight DB. The "30-sec settle window" estimated by the council was overly conservative; revise to "~5 sec settle window" since per-file txs are short.

**Plan revision**: Update §7 Risks in plan.md to note "settle window ~5s, not 30s" for SIGINT cancellation. ADR-007 cancellation contract remains the same shape; only the timing estimate changes.

**Implementation guidance for Phase C**:
- The orchestrator can safely SIGINT `memory_index_scan` at any point; the worst case is one in-flight per-file tx that gets rolled back by SQLite WAL.
- The orchestrator does NOT need to wait minutes for an in-flight scan to commit; per-file commits are second-scale.
- Snapshot-restore IS still the recovery mechanism for cross-file consistency (the prior N committed files would otherwise persist as a partial rebuild).

---

## ADR-002: Pre-rebuild snapshots

**Council question**: Should the orchestrator snapshot every SQLite file before starting, or rely on each subsystem's own snapshot mechanism?

**Status**: Decided.

**Decision**: **Full snapshot via SQLite `VACUUM INTO`** of every `*.sqlite` file before any mutation. Filename format: `<name>.pre-doctor-update.<version>.<timestamp>.bak`. Auto-cleanup snapshots > 30 days unless `--keep-snapshots`. `--no-snapshot` flag opts out for advanced users.

**Rationale**: `VACUUM INTO` is atomic, WAL-safe, and produces a consistent file even if the source has open writers. Raw `cp -p` of an open WAL-mode DB can capture inconsistent state. The cross-DB inconsistency risk during multi-step rebuild dwarfs the disk cost (~600 MB transient). One coherent point-in-time snapshot is the only mental model that recovers cleanly from cross-subsystem partial failures.

**Council convergence**: Lenses A (safety), B (defensive), C (UX), D (migration) all endorsed full snapshot. Lens E (devil's advocate) initially objected ("snapshots are theater") but conceded that WAL handles single-DB crash, not cross-DB inconsistency.

**Implementation**: Phase C T-035 in `assets/doctor_update_*.yaml`.

---

## ADR-003: Lock contention with active MCP clients

**Council question**: How does the orchestrator detect and respond to other MCP clients holding SQLite WAL locks?

**Status**: Decided.

**Decision**: **PID-file lock at `mcp_server/database/.doctor-update.lock`** containing PID + start-timestamp. Brief connection probe via `pragma database_list` + lock-state inspection at start. If active MCP-client detected → **warn-and-prompt** (not refuse); user can override with `--force`. If lock present but PID dead → log warning, remove, proceed. If lock present and timestamp > 2h regardless → assume crashed, prompt to clean up.

**Rationale**: A fully exclusive lock is impractical for SQLite WAL (connections are file-handle-level, not lock-level for readers). Strict refusal (Lens A's initial position) is too restrictive given the user's parallel-session workflow. Warn-and-prompt with `--force` override balances safety with operator workflow.

**Council convergence**: Lens A revised from "refuse" to "warn-and-prompt" after Lens C challenged usability. Lens B's `flock(2)` proposal accepted as primary primitive (cross-platform via `portalocker`).

**Implementation**: Phase C T-033, T-034 in YAML assets.

---

## ADR-004: Partial-failure recovery

**Council question**: If `memory_index_scan` halts at minute 8 of 12, what's the recovery contract?

**Status**: Decided.

**Decision**: **One auto-retry with 5-sec backoff before rollback.** In the single interactive design, prompt user with three recovery options after retry: `(a) retry from start, (b) restore snapshot and exit, (c) leave as-is (DANGEROUS)`.

**Rationale**: Single retry handles transient failures (disk full, OOM, race) without sacrificing safety. Auto-rollback to snapshot was mandatory in the earlier unattended design because the cost of corrupt context-index breaking `memory_save` for a week dwarfs 5-15 min of lost rebuild work. State log enables forensic analysis after the fact.

**Council convergence**: Lens E (devil's advocate) argued "just retry the failed step" — accepted partially as one retry, but with rollback as the floor after retry fails.

**Implementation**: Phase C T-038 in YAML assets.

---

## ADR-005: Concurrent dispatch protection

**Council question**: How do we prevent two `/doctor:update` invocations at the same time?

**Status**: Decided.

**Decision**: **OS-level `flock(2)` (Unix) / `portalocker` (Windows fallback)** on `mcp_server/database/.doctor-update.flock`. PID-file fallback for stale-detection if flock unavailable. Refuse second invocation with helpful message including the holding PID and start timestamp.

**Rationale**: `flock(2)` is OS-enforced and immune to PID-reuse races. PID-file alone is vulnerable to recycled PIDs after a crash. Cross-platform `portalocker` provides the Windows path. The user's parallel-session workflow (per memory `feedback_worktree_cleanliness_not_a_blocker`) makes this a real risk, not a theoretical one.

**Council convergence**: All five lenses agreed. Lens E (devil's advocate) had no objection — concurrent invocations are user error worth refusing loudly.

**Implementation**: Phase C T-033 in YAML assets or via external Python helper.

---

## ADR-006: Tier-aware interactive mode (superseded)

**Council question**: How much prompting should bare `/doctor:update` use?

**Status**: Decided.

**Decision**: **Tier-aware interaction.** `/doctor:update` (no suffix) prompts only for medium and long-pole steps:
- **Quick wins** (skill-graph init, deep-loop-graph init): no prompt, just do
- **Medium** (code-graph rebuild, eval ablation): one combined "proceed?" prompt
- **Long pole** (memory_index_scan 5-15 min): explicit "this will take 5-15 min, proceed?" prompt with ETA
- **Wholesale `--all` flag**: single confirmation up front, then run all without further prompts

This historical ADR was reduced by ADR-010: bare commands keep the tier-aware prompt policy without separate suffix modes.

**Rationale**: The 5-15 min memory rebuild + 2-5 min eval rebuild + cross-DB dependency means a user who doesn't understand the implications could lock their workspace for 20 minutes after typing `/doctor:update` casually. Tier-aware default keeps short rebuilds fast while gating the long pole.

**Council convergence**: Lens C (UX advocate) introduced tiering after Lens A/B initial split between strict-confirm vs match-existing-pattern. Lens E (devil.s advocate) wanted unattended default — rejected because this command is rare-use, not routine.

**Implementation**: Phase C T-028 (`assets/doctor_update.yaml`), T-037 (tier-aware execution).

---

## ADR-007: Cancellation semantics

**Council question**: User Ctrl-Cs at minute 8 of memory rebuild. What's the cancellation contract?

**Status**: Decided.

**Decision**: **Graceful cancellation.** SIGINT caught at orchestrator level. Set "cancel requested" flag. Let current SQLite tx commit/abort cleanly (~30 sec settle window). Restore snapshot of any DB that was being modified mid-step. Log "cancelled by user" to state log. Exit 130.

**Rationale**: SQLite WAL handles single-DB process death (rollback on next open). The cross-DB inconsistency is the real cancellation hazard — restoring snapshot of in-flight DB ensures no half-rebuilt state.

**Council convergence**: Lens A, B, C, D all endorsed graceful cancel. Lens E objected ("just don't allow cancellation") but conceded that 15-min lock-up with no escape is unacceptable UX.

**Implementation**: Phase C T-039 in YAML or external script that wraps the orchestrator process.

**Consequences**: Documents the ~30-sec settle window so users know Ctrl-C isn't instant. The state log captures the cancellation timestamp for forensic clarity.

---

## ADR-008: Version migration legacy files

**Council question**: A user at 3.3.0.0 has `memory.db` (legacy, 0 bytes). Does `/doctor:update` delete it?

**Status**: Decided.

**Decision**: **Detect-and-recommend, never auto-delete.** Maintain `migration-manifest.json` listing per-version deprecated files. Match against the manifest, not heuristics. Empty file at known legacy path → flag for cleanup. Empty file at unknown path → leave alone. `/doctor:update --cleanup-legacy` opts in to deletion. Migration mode (`/doctor:update --migrate`) is distinct from steady-state rebuild.

**Rationale**: User-data-shaped files (even at 0 bytes) are too easy to misidentify as deletable. Manifest-driven recognition + explicit user opt-in is the safe floor.

**Council convergence**: Lens E (devil's advocate) had the strongest position here ("docs page, no deletion engine") — partially accepted as detect-and-recommend rather than detect-and-delete.

**Implementation**: Phase D T-041..T-046 (manifest), Phase C T-027 (`--cleanup-legacy` flag).

---

## ADR-009: External second-opinion (optional)

**Status**: Open.

**Context**: Council deliberation was conducted by simulated personas in a single Claude reasoning context, not externally dispatched AI systems. The user requested **gpt-5.5 high** as anchor lens. Whether to dispatch a literal external GPT-5.5 second opinion before final command authoring is optional (REQ-021 P2).

**Decision**: TBD. Recommend dispatching `cli-codex` with the same 7 council questions during Phase B/C as a sanity check. If divergence from internal council is material (especially on Q3+Q6 where tx-model is the unknown), revise ADRs accordingly. If internal council answers hold, document the dispatch as confirmation.

**Default if not dispatched**: Document waiver here with rationale (e.g., "internal council convergence was strong; external dispatch deferred to follow-on packet if Q3 ADR-001 finding contradicts the council's per-batch assumption").

---

## Cross-cutting Notes

**Council convergence quality**: Genuine. Lens E (devil's advocate) endorsed most of A/B/C/D's positions after challenges, not artificially. Operational-safety-of-database-orchestration is a domain where conservative defaults are objectively correct (asymmetric cost: 5 min annoyance vs hours of data loss).

**Vantage integrity caveat**: All 5 lenses simulated in a single Claude reasoning context. ADR-009 captures the option to dispatch external GPT-5.5 high as a true second opinion.

**Strongest dissent that survived**: Lens E's argument that `migration-manifest.json` is over-engineering for adjacent-version upgrades. Resolution: manifest can be empty/trivial for non-multi-hop cases; only matters for >2-version skips. Implementation can be incremental — Phase D starts with 3.3.0.0 → 3.4.1.0 chain and grows as new versions ship.

**Confidence**: 82/100 per council self-assessment. High consensus across lenses, well-grounded in `/doctor:code-graph` precedent. Risk concentrated in ADR-001 (tx-model unknown) — Phase A.1 resolves this gate before Phase B/C.

---

## ADR-010: Mode reduction to interactive-only doctor commands

**Status**: Decided.

**Context**: The original packet designed five mode-suffixed YAML variants for each mutating doctor command. The implemented runtime now exposes a single bare command per doctor entrypoint. Every command starts with status or diagnostic work, then prompts before mutation using tier-aware confirmation rules.

**Decision**: **Use one interactive YAML per doctor command.** The active asset set is 10 YAML files: 8 doctor command assets plus 2 MCP command variants.

**Rationale**:
- The old autonomous modes created duplicate YAML logic and bypass paths that were hard to keep safe.
- The single interactive mode preserves the important safety properties: status check first, snapshots before mutation, clear ETA prompts for long-pole work, and operator-visible rollback choices.
- Bare invocations match the cleaned Markdown entrypoints and avoid accepting deleted suffixes.

**Consequences**:
- Mode-suffixed doctor invocations are invalid.
- YAML references use bare asset names such as `doctor_memory.yaml` and `doctor_update.yaml`.
- Playbook scenarios that existed only for deleted autonomous or skip-status modes are removed in sibling packet `002-sandbox-testing-playbook` ADR-008.
