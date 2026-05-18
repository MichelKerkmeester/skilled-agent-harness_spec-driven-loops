---
title: "Decision Record: Doctor Cutover Phase 2 [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/004-cutover-phase/decision-record]"
description: "Architectural Decision Records for the hard cutover phase: delete strategy, sed strategy, advisor rebuild order, historical annotation scope, and runtime mirror boundaries."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->"
---
# Decision Record: Doctor Cutover Phase 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

---

## ADR-001: Hard delete legacy command files; no shim aliases

**Status:** Accepted (2026-05-11)

**Context:** Phase 1 shipped the router additively, leaving both old and new command forms present for validation. Phase 2 must choose between hard delete, shim alias period, or archive/tombstone files.

**Decision:** Hard delete the 9 old command files. Do not create shim aliases, `.bak`, `.old`, `.deprecated`, `_archive`, or commented-out stubs.

**Rationale:** Memory `feedback_delete_not_archive_or_comment` says legacy code/docs must be deleted, not archived or commented out. The 2026-05-11 user AskUserQuestion answer selected a hard cutover. Keeping alias shims would preserve the surface area the packet is meant to remove.

**Consequences:** Rollback uses source control rather than local backup files. The grep gate must prove stale invocations are gone.

---

## ADR-002: Use in-place sed substitutions instead of regenerating the playbook

**Status:** Accepted (2026-05-11)

**Context:** The manual testing playbook contains 23 scenario files with stable IDs and reviewable evidence structure. Regeneration would create noisy diffs unrelated to the command rename.

**Decision:** Use exact in-place substitutions for old command invocation strings.

**Rationale:** In-place sed preserves scenario IDs, keeps git diff legible, and minimizes accidental content drift.

**Consequences:** Verification relies on a stale invocation grep rather than a regenerated playbook manifest.

---

## ADR-003: Advisor rebuild happens after deletes and reference rewrites

**Status:** Accepted (2026-05-11)

**Context:** Advisor scoring ingests command descriptions and trigger phrases. Running it before deletes could leave stale command surfaces in the scoring context.

**Decision:** Rebuild advisor indices after old files are deleted and references are rewritten.

**Rationale:** The rebuild should see the final command inventory, not the transitional overlap state.

**Consequences:** Advisor rebuild is a late implementation step and a P0 checklist gate.

---

## ADR-004: Historical updates in 013 are minimal annotations, not full rewrites

**Status:** Accepted (2026-05-11)

**Context:** Packet 013 is historical record for the doctor update orchestrator and original command work. Full rewrites would blur archival accuracy.

**Decision:** Add a concise `Superseded By` row and update operational invocation examples only.

**Rationale:** The 013 docs should remain accurate to what they delivered while pointing operators at the superseding 013 phases 004 + 005 router consolidation.

**Consequences:** Requirements and decisions in 013 remain intact; only invocation strings and metadata annotation change.

---

## ADR-005: Exclude `.codex` from the delete sweep

**Status:** Accepted (2026-05-11)

**Context:** `.codex/prompts` symlinks to `.opencode/commands`, so deleting under `.opencode` already affects Codex command discovery.

**Decision:** Do not separately delete `.codex` command files.

**Rationale:** A separate delete would either be redundant or risk following symlinks in a way that obscures the actual source of truth.

**Consequences:** Verification covers `.codex` through the final grep gate, not through a separate file delete step.
