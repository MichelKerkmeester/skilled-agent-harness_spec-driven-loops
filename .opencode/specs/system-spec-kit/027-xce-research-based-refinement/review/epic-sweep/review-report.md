---
title: "027 Epic Multi-Model Deep-Review Sweep: 120 Seats, Zero P0, 23 Confirmed and Remediated"
description: "One review iteration per 027 phase by five heterogeneous seats (3x gpt-5.5-fast xhigh lenses, MiMo v2.5 Pro, Fable 5 xhigh), refute-first verification of every strong cluster, and four remediation commits closing all confirmed findings."
trigger_phrases:
  - "027 epic sweep review report"
  - "120 seat multi-model review"
  - "epic deep review verdict"
importance_tier: "important"
contextType: "implementation"
---

# 027 Epic Deep-Review Sweep — Review Report

> **Verdict: CONDITIONAL → RESOLVED.** Zero P0 findings across all 120 seats. All 23 adversarially-confirmed findings (10 code defects, 13 materially-false doc claims) were remediated and committed the same day. The epic's shipped behavior holds; the recurring weakness was doc claims drifting ahead of or behind code reality.

## 1. Method

One deep-review iteration per phase of the 027 epic (24 phases, 000–023), each reviewed by five seats: three gpt-5.5-fast xhigh lenses (correctness, docs-vs-code truth, regression/integration), one MiMo v2.5 Pro fresh-eyes seat, and one Fable 5 xhigh adversarial-synthesis seat — 120 seats total, each scoped to the phase's shipped files plus its spec/changelog record. Findings were reduced per phase (cross-seat dedupe), and every **strong cluster** (Fable-flagged or corroborated by 2+ seats) went through a second, refute-first Fable 5 verification with file:line proof required. Only verifier-confirmed findings were remediated.

## 2. Outcome

| Measure | Value |
|---------|-------|
| Seats completed | 120/120 |
| P0 findings | **0** |
| Fable per-phase verdicts | 13 PASS / 11 CONDITIONAL / 0 FAIL |
| Strong clusters verified (refute-first) | 41 |
| Confirmed | 23 (10 code, 13 doc-truth) |
| Refuted | 2 |
| Downgraded to P2 | 11 |
| Phases with zero strong findings | 015, 016, 017, 019, 021 |

## 3. Confirmed code defects (all fixed)

1. **Save path persisted raw secrets** — only the parsed/index copy was scrubbed; durable artifacts now scrub fail-closed at the atomic-save entry.
2. **Provenance labels unscrubbed** — caller-supplied source/actor strings now pass the same fail-closed scrubber.
3. **Delete could commit after a failed tombstone sweep** — the blanket catch narrowed to legacy missing-table only; other failures roll the delete back.
4. **Sweeps left stale causal-boost caches** — tombstone sweeps now bump the causal-edges generation (extracted to its own module to break an import cycle).
5. **Shadow telemetry on stdout** — moved to stderr; stdout carries JSON-RPC frames under stdio transport.
6. **Failed maintenance runs invisible** — reconcile/retention/scan record `status: error` on failure paths.
7. **Restore panel ignored its own budget** — renders the budget-selected items only, char budget enforced.
8. **PreCompact snapshot wiped authored continuity** — now merges with the existing record, preserving authored fields.
9. **Spec-folder detection mangled file paths** — dots matched, file components stripped; doc mentions resolve to real folders.
10. **Save lock stealable from a live owner** — reap requires a provably dead owner pid; holders heartbeat the lock. Plus: **staged-shard rename over a live attachment** (detach-before-rename), **restart-blind repair de-dup** (repair intent persisted with the job row), **filePath heuristic stripping manual-overwrite protection from human saves** (removed; untagged writes default human), and **wrong-runtime dispatch templates** in the Claude/Codex orchestrate mirrors (runtime-localized).

## 4. Confirmed doc-truth findings (all fixed)

Stale phase-parent statuses (000/001/006 claiming planned/scaffolded with shipped children); a phantom env-flag name; the feature catalog's dead `/spec_kit:*` namespace and wrong tool count; the playbook's contradictory verdict taxonomy; the superseded `replayed:true` promise in 007 docs; the 014 "byte-identical to legacy" ranking claim (corrected to meets-or-beats with intentional weighting differences) and its repudiated 111MB RSS evidence; the 013 restart-durability attribution; 022's "Pending final run" gates (executed for real) and its over-stated guard-enforcement claim; 023's pre-remediation test counts; changelog inaccuracies in 003-001 (inflated test attribution) and 005-004 (omitted mutation-site file).

## 5. Refuted / downgraded

Refuted: the 002 retention-sweep options claim; the 007 replayed-marker code complaint (deliberately removed by 023). Downgraded P2 (11): convention-compliant or non-default-path items — among them the 012 mean-vs-p95 bench gate, the 014 NDCG-cutoff helper, the 018 read-only schema-ensure, and the 023 lost-store divergence edge (flag default-off, racing first-writes only).

## 6. Follow-ons carried

- Source-kind ingress enforcement for same-path reindex-retire and feedback auto-promotion (pre-existing, unblocked by 022's tagging).
- Idempotency enablement gating (receipt key variance per logical update, force-retry-conflict, receipt TTL) before any flag-ON.
- Inode-compare hardening in the vector-shard attach check (the detach-before-rename fix closes the live writer path; cross-connection staleness detection would close the rest).
- FTS5 LIKE-metachar scope hardening (pre-existing).
- IPC "busy" reply on refused connections + configurable bridge probe budget (from the 026 cap investigation).

## 7. Remediation commits

| Round | Commit | Scope |
|-------|--------|-------|
| 1 — doc truth | `ba3dddad1d` | 11 files: statuses, catalog, playbook, changelog claims |
| 2a — code | `ef0eb88a4a` | 12 files: scrubber gaps, tombstone rollback, cache generation, stdout, maintenance errors, mirror templates |
| 2b — continuity + lock | `7c17b07e01` | 8 files: restore budget, snapshot preservation, path detection, save-lock liveness (+28 regression tests) |
| 3 — tail | `8bf4c89813` | 9 files: shard-rename detach, repair persistence, provenance heuristic, 013/014/022/023 doc truth |

Machine-readable detail: [`findings-registry.json`](./findings-registry.json) (per-finding proofs, per-phase seat verdicts, batch attribution).
