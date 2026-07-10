---
title: "Implementation Plan: /doctor + Install-Guide Alignment"
description: "Five parallel subsystem-cluster sweeps correct ~148 stale references across the /doctor command surface, three install guides, and subsystem READMEs, each agent re-verifying against live source and preserving legitimate historical references."
trigger_phrases:
  - "doctor alignment plan"
  - "install guide sweep"
  - "subsystem cluster partition"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment"
    last_updated_at: "2026-06-02T20:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Five clusters + orchestrator fix-ups shipped; re-grep clean"
    next_safe_action: "Validate --strict and commit"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-remediation-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: /doctor + Install-Guide Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Markdown docs + YAML command config + `opencode.json` + shell install scripts |
| **Subsystems** | system-spec-kit, system-code-graph, system-skill-advisor; `/doctor` command router |
| **Source of truth** | `opencode.json`, `tool-schemas.ts`, `core/config.ts`, `lane-registry.ts`, `factory.ts`, the launchers, the four `doctor.sh` scripts |
| **Verification** | `validate.sh --strict`, `rg` anchor checks |

### Overview
Correct ~148 cited misalignments (round-2 verified, 0 false positives) by partitioning strictly by **subsystem** into five disjoint file clusters, then dispatching one edit agent per cluster in parallel. Each agent re-verifies every finding against live source before editing and preserves legitimate historical/migration references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Audit complete + round-2 verified (`/tmp/doctor-research/`)
- [x] R1 ground truth re-confirmed (code-graph DB is skill-local; old shared path superseded 2026-05-29)
- [x] R2 scope decided (align to read-only reality; do not build apply-paths)
- [x] Partition is strictly disjoint by subsystem

### Definition of Done
- [x] All five clusters return verified edit summaries
- [x] `rg "\.opencode/\.spec-kit/code-graph"` returns only historical/superseded refs
- [x] Counts/versions match source (36 tools, 5 servers, Node ≥20.11, no v1.8.1)
- [ ] `validate.sh --strict` → Errors 0; comment hygiene clean
- [ ] Committed to main with explicit pathspec (no `-A`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Disjoint-partition parallel sweep — orchestrator owns scaffolding, reconciliation, validation, and all git writes; five LEAF edit agents own disjoint subsystem file sets.

### Key Components
- **Cluster A** — `.opencode/commands/doctor/**` (router `_routes.yaml`, `speckit.md`, per-target YAMLs, `mcp.md`/`update.md` + their assets, `scripts/*.sh`). Themes R1 (Gate-3 target path), R2 (mutation classes), R3 (`code_graph`→`code-graph`, server count), R4 (colon-form retire), R6 (rebuild targets).
- **Cluster B** — system-spec-kit docs: `README.md`, `mcp_server/README.md`, `mcp_server/ENV_REFERENCE.md`, `mcp_server/INSTALL_GUIDE.md`, `feature_catalog/**`, `manual_testing_playbook/**`, `opencode.json`, env-var reference. Themes R1, R3 (35→36, Node, v1.8.1, "6 servers", 41/54-tool), R4, R5, R6. **Preserve 014/003 additions.**
- **Cluster C** — system-code-graph docs: `README.md`, `INSTALL_GUIDE.md`, `references/**`. Themes R1 (current-presenting refs only — **preserve** `config.ts` comment + `database_path_policy.md` migration log), R6.
- **Cluster D** — system-skill-advisor docs: `README.md`, `INSTALL_GUIDE.md`, scorer/tuning references. Themes R5 (Python→Node hf-local), R6 (lane ids `explicit_author, lexical, graph_causal, derived_generated, semantic_shadow`; `semantic_shadow` now live; "8 public + 1 internal").
- **Cluster E** — top-level install: `scripts/setup/install.sh`, `install_guides/README.md`. Themes R1, R3, R5.

### Data Flow
Audit findings → per-cluster verify-then-edit → structured edit summary → orchestrator reconcile + validate + commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `core/config.ts` (code-graph) | Resolves DB to skill-local default; comment documents supersession | unchanged (preserve) | `rg "spec-kit/code-graph" config.ts` → only the supersession comment |
| `database_path_policy.md` | Canonical policy + migration history | unchanged (preserve historical) | migration entries intact |
| `_routes.yaml` | Doctor router manifest (mutation classes) | update (R2 align to read-only) | each route class matches its `doctor.sh` |
| `opencode.json` | Declares mk-spec-memory tool count | update (35→36) | `TOOL_DEFINITIONS.length` = 36 |
| 3× `INSTALL_GUIDE.md` | Operator install instructions | update (R1/R3/R5/R6) | launcher cmd present; counts correct |
| 014/003 README additions | SPECKIT_BACKEND_ONLY + schema narrative | unchanged (preserve) | additions still present post-edit |

Required inventories (run per cluster):
- Old DB path: `rg -n "\.opencode/\.spec-kit/code-graph" <cluster files>` → classify each hit current-vs-historical.
- Counts: `rg -n "35.tool|35 tool|all 6|6 MCP|Node 18|v1\.8\.1|41.tool|54.tool"`.
- Colon-form: `rg -n "/doctor:(mcp|update)|:apply|code_graph "`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold (orchestrator)
- [x] Packet created; spec.md + plan.md authored
- [ ] description.json + graph-metadata.json generated

### Phase 2: Parallel sweeps (5 LEAF agents, disjoint clusters)
- [x] Cluster A — /doctor command surface (12 files)
- [x] Cluster B — system-spec-kit docs (+ opencode.json) (7 files)
- [x] Cluster C — system-code-graph docs (0 edits — refs already canonical)
- [x] Cluster D — system-skill-advisor docs (4 files)
- [x] Cluster E — top-level install (2 files)

### Phase 3: Reconcile + verify (orchestrator)
- [x] Collect edit summaries; spot-verify anchors + grep guards
- [x] Orchestrator fix-ups (install_guides README Ollama-default; mcp-doctor.sh inverted-logic bug)
- [x] Author tasks.md + checklist.md + implementation-summary.md
- [ ] `validate.sh --strict` → 0; commit explicit paths to main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep guard | Old DB path / counts / colon-form gone where required | `rg` |
| Anchor resolve | Every cited current source anchor still exists | `rg` / Read |
| Spec validate | Packet doc integrity | `validate.sh --strict` |
| Preserve check | 014/003 additions + historical refs intact | `rg` before/after |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Audit deliverable `/tmp/doctor-research/` (ALIGNMENT-REPORT + out-R*.md / out-V*.md).
- Live source of truth files (read-only) for re-verification.
- No external/network dependency.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Docs/config-doc-only change across 25 files; rollback is a clean per-file revert.

- **Revert**: restore the 25 edited files to their pre-sweep state (`git checkout -- <pathspec>`); no build or migration is involved.
- **Selective revert**: each cluster touched a disjoint file set, so a single subsystem can be reverted without affecting the others.
- **Code-doc bug fix**: the `mcp-doctor.sh` inverted-logic correction is an independent fix; if reverted, the code-graph health-check resumes pointing auto-migrate at the wrong (old shared) path — keep it unless re-introducing the bug is intended.
- **No runtime impact**: nothing here changes shipped binaries or daemon state; `opencode.json` stays valid JSON and `mcp-doctor.sh` stays `bash -n` clean either way.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Scaffold) ──► Phase 2 (Parallel sweeps A-E) ──► Phase 3 (Reconcile + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scaffold | None | Parallel sweeps |
| Parallel sweeps | Scaffold, disjoint partition | Reconcile |
| Reconcile + verify | All five sweeps returned | None |

The five sweeps are mutually independent (disjoint subsystem file sets) and ran in parallel within Phase 2.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scaffold (spec + plan + metadata) | Low | ~0.5 hour |
| Parallel sweeps (5 clusters, ~148 fixes across 25 files) | Med | ~2 hours (parallel) |
| Reconcile + fix-ups + verify (adversarial verifiers, install-README + mcp-doctor.sh fixes, re-grep) | Med | ~1.5 hours |
| **Total** | | **~4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved (docs/config-doc only)
- [x] No feature flag required (no runtime behavior change)
- [x] Partition disjoint (each cluster independently revertible)

### Rollback Procedure
1. Identify the cluster(s) to revert (A-E) and their disjoint file set.
2. `git checkout -- <cluster pathspec>` to restore pre-sweep content.
3. Re-validate: `opencode.json` parses; `bash -n mcp-doctor.sh` clean; re-grep for any re-introduced stale refs.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Documentation/config-doc only; no persisted state is written by this packet.
<!-- /ANCHOR:enhanced-rollback -->
