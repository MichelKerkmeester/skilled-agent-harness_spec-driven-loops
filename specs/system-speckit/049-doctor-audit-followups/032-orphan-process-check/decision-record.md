---
title: "Decision Record: Phase 32: orphan-process-check"
description: "Why the orphan scan is tested on a representative fixture rather than the 2026-10-21 process table, and why /doctor:setup reports but never reaps."
trigger_phrases:
  - "orphan process check decision"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 32: orphan-process-check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Test on a representative fixture, not the 2026-10-21 table

<!-- ANCHOR:adr-001-context -->
### Context

AC-001 asked for a fixture of the 22 orphans cleaned up by hand on 2026-10-21. That cleanup killed processes by PID from `ps` listings read in the session; no raw `ps` output was saved, so the exact table cannot be replayed.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

AC-001 is superseded by AC-005. The tests use fixture rows built from the same process kinds the cleanup found, at least one per helper kind, plus a live daemon, a stale launcher, a young row, a non-orphan and another user's process. A live run on this machine then proved detection and the reap against a real orphaned process.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

1. **Reconstruct the 22 rows from memory**: rejected. Invented rows would look like evidence without being it.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- A helper kind that appeared on 2026-10-21 but has no fixture row would go unnoticed. Each kind named in the spec has at least one row.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: /doctor:setup reports, the operator reaps

<!-- ANCHOR:adr-002-context -->
### Context

A reap signals processes. `/doctor:setup` is a health report that runs every leg and should change nothing.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

`/doctor:setup` runs the scan with `--summary` and prints the reap command. Only the operator runs `--reap --yes`. Without `--yes`, `--reap` lists the processes and the command to confirm, and signals nothing.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

1. **Offer the reap inside /doctor:setup**: rejected. A health report that can stop processes is no longer read-only.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- Cleanup takes one extra command, which the doctor line prints in full.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->

---
