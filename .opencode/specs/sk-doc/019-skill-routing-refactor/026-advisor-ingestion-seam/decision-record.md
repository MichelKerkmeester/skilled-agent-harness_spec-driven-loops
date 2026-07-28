---
title: "Decision Record: Advisor Ingestion Seam"
description: "The closure-mechanism decision: the daemon watcher additionally watches the skills root directory (depth zero, directories only) so a new top-level skill root triggers target refresh and ingestion, with the documented manual refresh kept as fallback."
trigger_phrases:
  - "ingestion seam decision"
  - "watcher watches skills root decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/026-advisor-ingestion-seam"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the mechanism decision from live watcher-source evidence"
    next_safe_action: "Implement per the accepted decision"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-advisor-ingestion-seam"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "chokidar watches explicit file targets and refreshTargets() runs only at the tail of an event-triggered reindex, so a new root can never self-announce"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Advisor Ingestion Seam

---

## ADR-001: The Watcher Watches the Skills Root for New Top-Level Directories

**Status**: Accepted
**Date**: 2026-07-28

### Context

Verified at source on the execution tip: `discoverWatchTargets` enumerates skill directories once and returns explicit file targets (`SKILL.md`, `graph-metadata.json`, derived key files); chokidar watches exactly those paths, and `refreshTargets()` executes only at the tail of `processSkill` — i.e. after an event on an already-watched file. A brand-new sibling directory therefore produces no event, no refresh, and no ingestion until a rebuild, restart, or unrelated watched-file change. The creation journey ends at "gates pass" with the advisor never informed.

Three candidate mechanisms were weighed:

1. **Watcher learns new roots** — additionally watch the skills root directory itself (depth zero, directory events only) and treat a new/removed top-level directory as a refresh trigger.
2. **Gate/scaffolder triggers a scan** — `ci-skill-root-metadata.cjs --fix` or `init_skill.py` calls into the daemon (IPC or CLI front door) on success.
3. **Documented manual step only** — no code change; both journeys instruct the author to run a refresh command.

### Decision

Option 1, with option 3's manual command documented as the fallback for a cold or absent daemon. The watcher gains one additional chokidar target — the skills root, depth zero, filtered to directory add/remove — whose events route into the existing debounce and end in `refreshTargets()` plus ingestion of the new slug.

### Rationale

The watcher already owns exactly the machinery this needs: dynamic `add`/`unwatch` of targets (built when derived key files began changing at runtime), debounce timers, and a refresh entry point. Watching one directory at depth zero adds a single fd and fires only on top-level create/delete — the storm scenario (worktree churn) lives under `.worktrees/`, not under `.opencode/skills/`, and depth-zero scoping ignores everything below a root. Option 2 was rejected because it couples authoring tooling to daemon transport: the gate runs in contexts where no daemon exists (CI, cold shells, other checkouts), so every caller needs presence-probing and the failure mode reintroduces silence — precisely the class of conditional behavior the metadata program just spent three packets eliminating. Option 3 alone keeps a permanent manual step for the most easily forgotten moment in the journey.

### Consequences

- A conforming new root becomes advisor-visible on a warm daemon without restart; the integration test proves scaffold → event → resolve.
- Deletion of a root flows through the same path, retiring stale targets instead of leaking them.
- The manual fallback (documented in both journeys) covers cold-daemon creation; the daemon's next start ingests via normal discovery.
- Watcher unit tests gain directory-event cases; latency on existing file targets is unchanged because the new target adds no per-file watches by itself.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| Gate/scaffolder triggers a daemon scan | Couples always-available tooling to a sometimes-present daemon; conditional-on-daemon behavior recreates the silent-when-absent failure mode |
| Documented manual refresh only | Leaves a permanent, forgettable manual step exactly where authors are least likely to know it exists |
| Watch the whole skills tree recursively for new files | Orders of magnitude more fds and events for no additional signal; the per-root file set is already derived precisely by discovery |
