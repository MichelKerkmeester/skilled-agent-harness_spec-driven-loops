---
title: "Feature Specification: validate.sh Dist Freshness + Repo-Wide Remediation"
description: "Closes the root cause behind a repo-wide validate.sh regression discovered during packet 030's follow-up remediation: dist/ builds silently going stale, plus the resulting backlog across all non-028 spec-kit packets."
trigger_phrases:
  - "dist freshness enforcement"
  - "validate.sh stale dist"
  - "repo-wide validate.sh remediation"
  - "stale dist prevention hook plugin"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/013-validate-sh-dist-freshness-and-repo-remediation"
    last_updated_at: "2026-07-02T02:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Packet scaffolded with 2 children"
    next_safe_action: "Dispatch child 001 dist-freshness enforcement build"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/bin/spec-memory.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-030-dist-freshness-remediation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "User confirmed: fix everything reachable now via a parallel GPT-5.5-fast agent swarm, plus build permanent dist-staleness prevention (hook + plugin)."
      - "system-speckit/028-* is explicitly out of scope -- owned by a different, concurrently active session."
---
# Feature Specification: validate.sh Dist Freshness + Repo-Wide Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-02 |
| **Parent Spec** | `../description.json` |
| **Parent Packet** | `system-speckit/028-memory-search-intelligence` |
| **Phase** | 013 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Both children complete; `validate.sh --recursive` passes 0 errors across every non-028 packet root except deliberately-deferred bucket-3 folders, which are explicitly enumerated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
While closing packet `030-agent-loops-improved` phase 011's child 006 (a `validate.sh` registry bridge), a rebuild of `system-spec-kit/mcp_server`'s compiled `dist/` output (required because `validate.sh` executes compiled JS, not TypeScript source directly) revealed two compounding problems: (1) `validate.sh`'s default path (`run_node_orchestrator()`, `scripts/spec/validate.sh:975-989`) only checks that the compiled orchestrator file exists, never whether it is fresh relative to its source -- `dist/` had silently been ~2 weeks stale, meaning several already-committed, already-graduated validator checks (from packet 028's own prior work) had never actually run anywhere; (2) once dist caught up to source, `validate.sh --strict --recursive` began failing on all 43 packet roots repo-wide (257 folders), not just packet 030 -- a real, repo-wide validation debt that predates this packet, simply never previously exercised.

### Purpose
Build a permanent dist-freshness enforcement layer (a shared detector, a `validate.sh` backstop, a Claude Code hook, and an OpenCode plugin) so this class of silent staleness cannot recur, then remediate the repo-wide backlog it exposed wherever it can be safely and accurately fixed -- explicitly excluding `system-speckit/028-*`, which is owned by a different, concurrently active session.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Child | Name | Scope |
|-------|------|-------|
| 001 | `001-dist-freshness-enforcement` | Shared freshness-check utility, `validate.sh` hard backstop, Claude Code PostToolUse hook, OpenCode plugin, tests |
| 002 | `002-repo-wide-remediation-sweep` | Triage + fix swarm across the 41 non-028, non-030 packet roots; bucket-3 (ungroundable) report and grandfather-mechanism recommendation |

### Phase Transition Rules
Child 002's fix wave depends on child 001 being complete and verified -- remediation must be measured against a trustworthy, freshness-enforced `validate.sh`, not the same stale-dist conditions that caused the confusion in the first place. Packet `deep-loops/030-agent-loops-improved`'s own fix (phase 011 child 006's remaining scope) is tracked in that packet, not here; this packet only owns the shared infra and the *other* packets' remediation.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:constraints -->
## 4. CONSTRAINTS

- **Hard exclusion**: `system-speckit/028-*` is never written to by this packet's work -- it is owned by a different, concurrently active Claude Code session. Triage may read it for context only, never modify it.
- **No silent auto-rebuild**: the `validate.sh` backstop fails closed with a clear rebuild instruction rather than auto-running a build, because auto-rebuilding a shared, gitignored `dist/` risks compiling in other concurrent sessions' unrelated uncommitted TypeScript changes (observed directly during this incident).
- **No fabricated content**: packets in bucket 3 (missing or unreliable grounding truth) are reported, not auto-authored.
<!-- /ANCHOR:constraints -->
