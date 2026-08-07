---
title: "Phase Parent: Pi Reasonix-Style Prompt Caching — Research → Build Decision"
description: "Phased packet investigating whether Pi should gain Reasonix-style prompt-cache discipline via a plugin. Phase 1 runs a 20-iteration, non-converging deep-research pass across three GPT-5.6 executors (SOL high fast, TERRA max fast, LUNA max fast) to verify the lumo.md caching claims and scope the real feature gap; Phase 2 synthesizes findings into a NO-GO on a new plugin. Phases 3-5 re-enter under ADR-001's documented contract (a new phase child + superseding ADR) to fork-and-split ownership of two existing packages instead — not the rejected greenfield build."
trigger_phrases:
  - "pi caching reasonix"
  - "pi prompt cache plugin"
  - "reasonix-like pi"
  - "pi cache optimizer"
  - "deepseek prefix cache pi"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix"
    last_updated_at: "2026-08-07T14:44:33Z"
    last_updated_by: "spec-author"
    recent_action: "Core (1-5) closed; phase 6 (deep-pi hardening) drafted, awaiting SOL review"
    next_safe_action: "Dispatch SOL xhigh review of phase 6, then await go-ahead"
    blockers: []
    key_files:
      - "spec.md"
      - "lumo.md"
      - "001-research/research/research.md"
      - "002-synthesis-and-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-cli-039"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Iteration distribution resolved: runtime ran 3 independent lineages x 20 iterations (60 dispatches)."
      - "Go/No-Go: NO-GO on a new plugin; the useful scope already ships as pi-cache-optimizer."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Pi Reasonix-Style Prompt Caching — Research → Build Decision

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete for the core scope (phases 1-5, re-entered and closed 2026-08-07 under ADR-001's documented re-entry contract, live-verified end to end); phase 6 is an optional, separately-scoped hardening pass, currently Draft |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration |
| **Predecessor** | None |
| **Successor** | 003-fork-and-guard-cache-optimizer (re-entry; see Phase Documentation Map) |
| **Handoff Criteria** | Phase 1 logs all research iterations with evidence; Phase 2 records a Go/No-Go decision with cited cost/benefit; phases 3-5 verified end-to-end with a payload-diff harness; parent validates under `validate.sh --recursive --strict` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A captured external-AI conversation (`lumo.md`) claims that Reasonix — a DeepSeek-native CLI agent — is engineered around prefix caching (asserting a ~99.8% cache-hit rate and a single-day cost drop from ~$61 to ~$12), while Pi offers provider-agnostic caching plus a `pi-cache-optimizer` extension. It sketches a "Reasonix-like" Pi plugin and a 10-week roadmap. Both Pi and Reasonix are real CLI agents in this environment, but every load-bearing figure and feature claim in `lumo.md` is an unverified, uncited external assertion — including whether `pi-cache-optimizer` exists and what Pi natively supports. No decision to build anything can rest on that capture as it stands.

### Purpose
Turn the raw capture into an evidence-backed build decision. First establish ground truth on Reasonix's and Pi's actual caching behavior and the real gap between them; then decide, on cost/benefit evidence, whether a Reasonix-style Pi caching plugin is worth building — before any implementation phase is authored.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. `lumo.md` is retained beside this spec as the originating research input.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the `lumo.md` claims about Reasonix caching (hit rate, cost delta, DeepSeek prefix-cache coupling) against primary sources
- Verify Pi's actual caching surface: native `cache_control`/provider-agnostic support, and whether a `pi-cache-optimizer` extension really exists and what it does
- Map the genuine feature gap between Reasonix and Pi (which `lumo.md` "missing in Pi" items are real vs already covered)
- Assess feasibility, complexity, and DeepSeek-API limits of a Reasonix-style Pi plugin
- Produce a Go/No-Go build decision with cited cost/benefit

### Out of Scope
- Implementing any plugin, extension, or caching layer (deferred to build phases, authored only on GO)
- Modifying Pi, Reasonix, the cli-pi skill, or any runtime code
- Provider caching work outside the Pi/Reasonix/DeepSeek/Anthropic scope described in `lumo.md`

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research/research/*` | Create | 001-research | Runtime-owned per-lineage iterations + merged `research/research.md` |
| `002-synthesis-and-decision/decision-record.md` | Create | 002-synthesis-and-decision | Go/No-Go decision with cited cost/benefit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research/` | 20-iteration non-converging deep research (3 GPT-5.6 lineages) verifying the lumo.md claims and scoping the real Pi-vs-Reasonix caching gap | Complete |
| 2 | `002-synthesis-and-decision/` | Synthesize the research into a verified findings set + a Go/No-Go build decision that gates all downstream phases | Complete (NO-GO on a new plugin; conditional GO for an audit/split of the existing packages) |
| 3 | `003-fork-and-guard-cache-optimizer/` | Fork `pi-cache-optimizer` and add a narrow `deepseek-v4-flash`/`deepseek-v4-pro` ownership guard across its 6 model-specific hooks (corrected after review from an earlier 2-hook, broader-match draft), re-entering ADR-001 under its documented "new phase child + superseding ADR" contract | Complete |
| 4 | `004-adopt-deep-pi-deepseek/` | Install `deep-pi` as the exclusive extension for `deepseek-v4-flash`/`deepseek-v4-pro` (cache stability + storm-breaker + hashline edits), self-gated | Complete |
| 5 | `005-verification-and-decision-reconciliation/` | Verify zero overlap live and no non-DeepSeek regression against a fresh A/B baseline; author the superseding decision record (this phase's own ADR-001), honestly grounded in materially increased DeepSeek usage | Complete |
| 6 | `006-fork-and-improve-deep-pi/` | Optional hardening pass on `deep-pi` (phase 004's exclusive DeepSeek-direct extension): fix three source-confirmed gaps found by a full source read (silent failure counter, hardcoded model allowlist with an unused fallback utility, unguarded telemetry cost math) | Draft (planning only; not yet implemented) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit
- **Build gate (original):** phases 3+ were gated on `002-synthesis-and-decision` recording a GO verdict, which did not occur for a new plugin
- **Re-entry (2026-08-07):** phases 3-5 re-entered under ADR-001's own documented contract ("a new phase child and a superseding ADR") for a narrower fork-and-split of the existing packages, not the rejected greenfield plugin — see `005-verification-and-decision-reconciliation/decision-record.md` (this file's own ADR-001, superseding `002-synthesis-and-decision`'s ADR-001; Accepted after live composition verification). A fresh independent review caught a nonexistent-field bug in the original guard proposal and an internal ADR-numbering contradiction before implementation began; both were corrected and independently re-verified live (fork pushed to `github.com/MichelKerkmeester/pi-cache-optimizer`, `deep-pi` installed, both confirmed active on exactly their intended models with zero overlap).
- **Delivery mechanism update (2026-08-07):** at operator request, the patched guard now lives in-repo at `.pi/extensions/pi-cache-optimizer/` (vendored from the `MichelKerkmeester/pi-cache-optimizer` fork commit, patch content unchanged) instead of a separately-hosted git repo. `.pi/settings.json` resolves it via Pi's local package-source type (`extensions/pi-cache-optimizer`, no `git:`/`npm:` prefix), which needs no network and no separate repository to stay in sync — see `003-fork-and-guard-cache-optimizer/spec.md` §OPEN QUESTIONS for the re-verified evidence. The external fork remains published as the historical origin of the patch, but is no longer the operational source.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-synthesis-and-decision | All research iterations logged with per-iteration evidence; no lineage truncated by early convergence | `research/lineages/*/iterations/` show full iteration counts across all three lineages |
| 002-synthesis-and-decision | Build phases (3+) | Go/No-Go decision recorded with cited cost/benefit and verified/refuted status for each lumo.md claim | `decision-record.md` states GO or NO-GO with evidence; on GO, build phases are authored |
| 002-synthesis-and-decision | 003-fork-and-guard-cache-optimizer | Re-entry conditions met: a new phase child exists and a superseding ADR is drafted | `003-fork-and-guard-cache-optimizer/spec.md` exists; `005-verification-and-decision-reconciliation/decision-record.md` (superseding decision record) drafted |
| 003-fork-and-guard-cache-optimizer | 004-adopt-deep-pi-deepseek | Patched fork hosted and active (local Pi install resolves it, not npm) | `003-fork-and-guard-cache-optimizer/checklist.md` CHK-020 passes |
| 004-adopt-deep-pi-deepseek | 005-verification-and-decision-reconciliation | `deep-pi` installed and confirmed self-gated to DeepSeek-matched models | `004-adopt-deep-pi-deepseek/checklist.md` CHK-020/021 pass |
| 005-verification-and-decision-reconciliation | 006-fork-and-improve-deep-pi | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Iteration distribution: does "20 iterations" mean 20 loop iterations each fanning out to all three executors (~60 dispatches), or 20 dispatches total split across the three executors? Authored as fan-out; confirm on review.
- Are SOL / TERRA / LUNA all GPT-5.6 personas dispatched through cli-codex, or does any route through a different runtime? Authored as cli-codex; confirm before the run.
- Does the environment have Reasonix and DeepSeek primary docs reachable for claim verification, or must Phase 1 rely on web sources?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Originating capture**: See `lumo.md` (raw external-AI research input this packet formalizes)
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
