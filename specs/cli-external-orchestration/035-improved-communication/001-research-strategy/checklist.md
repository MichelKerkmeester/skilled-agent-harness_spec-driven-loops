---
title: "Verification Checklist: Portable CLI communication research strategy"
description: "Objective evidence checklist for the six-runtime, provider-neutral, forced-depth research phase."
trigger_phrases:
  - "portable CLI research checklist"
  - "7 plus 3 research verification"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/001-research-strategy"
    last_updated_at: "2026-08-11T08:14:47Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 001 verification."
    next_safe_action: "Scaffold Phase 002 contracts and fixtures."
    blockers: []
    key_files:
      - "checklist.md"
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-research-strategy-checklist-20260811"
      parent_session_id: "001-research-strategy-20260811"
    completion_pct: 100
    open_questions:
      - "Version-pinned implementation fixtures remain Phase 002 work."
    answered_questions:
      - "The isolated worktree was authorized and the exact 7+3 fanout completed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Portable CLI communication research strategy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim phase completion until complete |
| **[P1]** | Required | Must complete or receive explicit user deferral |
| **[P2]** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### Research contract and ground truth

- [x] CHK-001 [P0] Requirements are measurable and synchronized in `spec.md` (REQ-001 through REQ-012).
- [x] CHK-002 [P0] The combined research architecture, evidence flow, executor configuration, evaluation, and rollback are explicit in `plan.md`.
- [x] CHK-003 [P0] The reference inventory cites exact files/lines for hooks, assembly, context, prompt/provider call, render modes, Markdown mutation, and unsafe path assumptions (`spec.md`, Evidence Snapshot).
- [x] CHK-004 [P0] Reference `bash -n`, `jq empty`, executable-bit, and warning-threshold ShellCheck checks exit 0; informational `SC2012` at `rewrite.sh:145` is recorded rather than hidden.
- [x] CHK-005 [P0] All six requested CLIs have a current primary-source-backed safest integration and confirmed/inferred distinction (`plan.md`, Runtime capability snapshot).
- [x] CHK-006 [P0] OpenCode Go, generic hosted protocols, Ollama, llama.cpp, capability discovery, privacy class, cost, and fallback policy are documented (`plan.md`, Provider capability snapshot).
- [x] CHK-007 [P0] The canonical-data-versus-display-projection invariant is stated in parent spec, child spec, and plan. [evidence: `../spec.md`, `spec.md`, and `plan.md` use the same unchanged-canonical-data contract.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Deep-research execution

- [x] CHK-008 [P0] The exact two-lineage executor configuration records model IDs, 7+3 iteration split, high GPT reasoning, live web, prompt frameworks, timeouts, and concurrency (`plan.md`).
- [x] CHK-009 [P0] DeepSeek lineage completes exactly 7 verified iterations without convergence stop. [evidence: `research/lineages/deepseek-go/` contains seven iteration narratives, records, and deltas; stop reason is `maxIterationsReached`.]
- [x] CHK-010 [P0] GPT-5.6 SOL Fast high lineage completes exactly 3 verified iterations without convergence stop. [evidence: `research/lineages/gpt-sol-fast/` contains three iteration narratives, records, and deltas; stop reason is `maxIterationsReached`.]
- [x] CHK-011 [P0] Both lineages pass deep-loop reducer and post-dispatch validation with canonical JSONL, deltas, logs, stop reasons, and final synthesis. [evidence: ten independent `verify-iteration.cjs` checks exit 0; root merge records 97 findings and zero corruption.]
- [x] CHK-012 [P0] The cli-opencode permission-bypass run occurs only in an explicitly authorized isolated worktree with literal banned operations, allowed write paths, clean/recoverable baseline, and copy-back allowlist. [evidence: worktree `.worktrees/0138-system-deep-loop-communication-research`; only phase `spec.md` and `research/**` changed there.]
- [x] CHK-013 [P1] Native, DeepSeek, and GPT findings are triangulated; conflicts, dated claims, unknowns, and inference labels remain visible. [evidence: `research/research.md` uses `[C]`, `[I]`, and `[U]`, plus Divergence Map and Cross-Lineage Triangulation sections.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### Fidelity and failure evaluation

- [x] CHK-020 [P0] Protected literals include code, paths, commands, flags, variables, URLs, hashes, identifiers, quotes, names, and numbers; every mismatch rejects the rewrite (`spec.md`, `plan.md`).
- [x] CHK-021 [P0] Meaning gates cover new facts, omissions, polarity, uncertainty, caveats, requirement strength, priority, and next steps (`plan.md`).
- [x] CHK-022 [P0] Auth, quota, unavailable model, network, timeout, refusal, truncation, empty output, malformed stream, placeholder failure, and cancellation all choose exact original output (`spec.md`).
- [x] CHK-023 [P1] Empty, short, code-only, oversized, concurrent, reordered, duplicated, missing-final, table-heavy, and instruction-like cases are specified (`spec.md`).
- [x] CHK-024 [P1] Human evaluation separates meaning, reference-style/plainness, fluency, and pairwise indistinguishability with at least three repetitions per provider/model/prompt (`plan.md`).
- [x] CHK-025 [P2] SARI, LENS, and semantic similarity are limited to regression signals rather than proof (`plan.md`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

### Matrix and evidence completeness

- [x] CHK-030 [P1] Runtime axes include integration surface, events, ordering, render capability, semantic-mutation risk, emulation burden, version, and confidence (`plan.md`).
- [x] CHK-031 [P1] Provider axes include model, protocol, discovery, reasoning control, streaming, timeout, privacy, cost, capability confidence, and fallback class (`plan.md`).
- [x] CHK-032 [P1] Native subagent findings were treated as hypotheses and key load-bearing claims were reopened in primary sources before inclusion. [evidence: `plan.md` links the reopened official runtime and provider pages.]
- [x] CHK-033 [P1] Deep-loop findings are confirmed against primary sources or bounded probes before final architecture decisions. [evidence: primary links and exact repository evidence are cited inline throughout `research/research.md`; unresolved fixture facts remain `[U]`.]
- [x] CHK-034 [P1] The final downstream phase map names dependencies, handoffs, rollback, inherited gates, and unresolved questions. [evidence: `research/research.md` sections 12 and 15 plus the parent Phase Documentation Map.]
- [x] CHK-035 [P2] Active provider/runtime probes are deferred to a deliberate non-sensitive `doctor` workflow rather than ordinary completion (`plan.md`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

### Privacy and execution containment

- [x] CHK-040 [P0] No secret value is written into the packet; credentials are represented only by environment-variable names and provider policy. [evidence: `spec.md` and `plan.md` contain policy fields but no credential values.]
- [x] CHK-041 [P0] External identifiers must be hashed/encoded and temporary state must be private, locked, bounded, and safe to delete (`spec.md`).
- [x] CHK-042 [P0] No local-to-hosted automatic fallback is allowed without explicit compatible privacy class and user policy (`spec.md`, `plan.md`).
- [x] CHK-043 [P1] OpenCode Go's current DeepSeek privacy claim is dated and the August 31, 2026 ZDR renewal boundary is called out (`plan.md`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

### Packet and metadata

- [x] CHK-050 [P1] Parent spec, child spec, plan, and tasks use the same six runtimes, provider goals, projection invariant, and 7+3 forced-depth contract. [evidence: `../spec.md`, `spec.md`, `plan.md`, and `tasks.md`.]
- [x] CHK-051 [P1] Checklist and implementation summary are reconciled after deep research; no file claims completion while work remains. [evidence: `spec.md`, `tasks.md`, checklist, and `implementation-summary.md` all record Phase 001 complete and Phase 002 next.]
- [x] CHK-052 [P1] Parent and child `description.json` and `graph-metadata.json` are regenerated from final packet state. [evidence: scoped generators/backfills exit 0 and strict metadata-integrity rules pass.]
- [x] CHK-053 [P1] Placeholder/stale-scaffold scan returns no unresolved template content or `scaffold/` continuity path. [evidence: strict `PLACEHOLDER_FILLED` and `SCAFFOLD_NEVER_TOUCHED` pass.]
- [x] CHK-054 [P1] Child strict validation and parent recursive strict validation both exit 0 from final state. [evidence: `validate.sh 001-research-strategy --strict` and `validate.sh 035-improved-communication --recursive --strict` each reported `RESULT: PASSED`, exit 0, with 0 errors and 0 warnings.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Reference files under `../context/claudish-to-english-main/` remain read only.
- [x] CHK-061 [P1] Task-created scaffold backup residue is removed after exact-path inspection. [evidence: packet scan finds no `.bak`, `.orig`, editor-backup, `.tmp`, or `.DS_Store` files.]
- [x] CHK-062 [P1] `scratch/` contains no temporary output and deep-loop artifacts live only in canonical research paths. [evidence: `scratch/` contains only `.gitkeep`; generated evidence is under `research/`.]
- [x] CHK-063 [P1] Final scoped Git status shows no task changes outside parent/phase documentation and workflow-owned research artifacts. [evidence: scoped status is confined to `035-improved-communication/`; the user-supplied reference matches the isolated recovery copy byte-for-byte.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 18 | 18/18 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-08-11. Phase 001 evidence, metadata, and strict validation are complete; remaining unknowns are explicitly handed to Phase 002 fixtures and probes.
<!-- /ANCHOR:summary -->
