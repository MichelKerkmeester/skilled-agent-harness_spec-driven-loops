---
title: "Phase Parent: Pi Reasonix-Style Prompt Caching — Research → Build Decision"
description: "Phased packet investigating whether Pi should gain Reasonix-style prompt-cache discipline via a plugin. Phase 1 runs a 20-iteration, non-converging deep-research pass across three GPT-5.6 executors (SOL high fast, TERRA max fast, LUNA max fast) to verify the lumo.md caching claims and scope the real feature gap; Phase 2 synthesizes findings into a NO-GO on a new plugin. Phases 3-5 re-enter under ADR-001's documented contract (a new phase child + superseding ADR) to fork-and-split ownership of two existing packages instead — not the rejected greenfield build. Phase 6 hardens the deep-pi fork; phase 7 runs a 4-executor research pass over both forks; phase 8 turns those findings into a planning-only, sequenced 3-child fix plan that changes no code."
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
    packet_pointer: "hooks/008-pi-caching-like-reasonix"
    last_updated_at: "2026-08-08T07:03:28Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 8 authored as a planning-only 3-child decomposition"
    next_safe_action: "Operator selects which 008 child phase to implement first"
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
      - "Phase 6 (deep-pi hardening) shipped Complete 2026-08-07, including a HANDOFF SOL review whose confirmed findings were all fixed — this doc's own frontmatter was stale about that until this update."
      - "Phase 7 (007-research-fork-improvements) ran a 4-executor, 24-iteration deep-research pass finding concrete improvement opportunities for both forks; research/research.md holds the priority-ranked synthesis."
      - "Phase 8 (008-implement-fork-improvements) turns 7's 13-item action list into 3 planning-only child phases matching its own P0/P1/P2 tiers. It authored specs, not code — zero changes to either fork. Implementing any child is a separate operator decision."
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
| **Status** | Complete through phase 7; phase 8 is Draft by design. Phases 1-5 (research → decision → fork/adopt/verify) closed 2026-08-07 under ADR-001's re-entry contract; phase 6 (deep-pi hardening, including a HANDOFF SOL review round) shipped Complete the same day; phase 7 (4-executor research on further improvements to both forks) shipped Complete 2026-08-08. Phase 8 was authored the same day as a planning-only decomposition of phase 7's action list — its parent and all 3 children are Draft, and they change no code in either fork. Whether any child is implemented is an open operator decision, not a gap |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration |
| **Predecessor** | None |
| **Successor** | 003-fork-and-guard-cache-optimizer (re-entry; see Phase Documentation Map) |
| **Handoff Criteria** | Phase 1 logs all research iterations with evidence; Phase 2 records a Go/No-Go decision with cited cost/benefit; phases 3-5 verified end-to-end with a payload-diff harness; phase 6 hardens deep-pi with a HANDOFF review round closed; phase 7 researches further improvements across a 4-executor fan-out; phase 8 turns those findings into 3 sequenced, planning-only child phases carrying the original file:line evidence; parent validates under `validate.sh --recursive --strict` |
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
| 6 | `006-fork-and-improve-deep-pi/` | Hardening pass on `deep-pi` (phase 004's exclusive DeepSeek-direct extension): fixed three source-confirmed gaps (silent failure counters, hardcoded model allowlist with a warning-only drift signal, unguarded telemetry cost math). A HANDOFF `gpt-5.6-sol` review found 12 findings; 11 confirmed and fixed, 1 was a reviewer-side evidentiary gap. Split into 3 child phases (fix-and-test, vendor-and-repoint, live-verification-and-closeout) | Complete |
| 7 | `007-research-fork-improvements/` | 4-executor, 24-iteration deep-research pass (`gpt-5.6-sol` high and `gpt-5.6-luna` max via cli-codex; Grok 4.5 via cli-cursor; `deepseek-v4-flash` via cli-opencode added afterward to corroborate or refute the first synthesis — 7/7/6/4 iterations, forced to full depth) finding concrete improvement opportunities for both forks across correctness, test coverage, observability, cost-economics, and maintainability. `research/research.md` holds the priority-ranked, cross-executor-validated synthesis, including one correction the 4th lineage issued against the first pass | Complete |
| 8 | `008-implement-fork-improvements/` | Turns phase 7's 13-item priority-ranked action list into 3 sequenced child phases whose boundaries are the research's own tiers: `001-correctness-floor/` (the 4 P0 items — deep-pi's dropped cold-start telemetry turn, a single-sourced DeepSeek ownership boundary plus a combined-host composition test with the test-runner mismatch resolved, hook-level guard tests for pi-cache-optimizer, and the `/deeppi` report command's state mutation), `002-observability-and-economics/` (the 5 P1 items — persistent atomic stats, structured report data, honest cost labeling with cache-write accounting, the stopReason guard, and the hot-path digest investigation), and `003-maintainability-and-provenance/` (the 4 P2 items — staged seam-characterized extraction gated behind 001 and 002, fork provenance and drift checks, a credential-independent boundary fixture, and deep-pi's doubly-broken `benchmark:live` packaging). **Planning only: the parent and all 3 children are Draft and change no code in either fork** | Draft |

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
| 005-verification-and-decision-reconciliation | 006-fork-and-improve-deep-pi | Live-verified split holds with no regression | `005-verification-and-decision-reconciliation/checklist.md` pass |
| 006-fork-and-improve-deep-pi | 007-research-fork-improvements | Hardened fork shipped, committed, and pushed; HANDOFF review's confirmed findings closed | `006-fork-and-improve-deep-pi/003-live-verification-and-closeout/checklist.md` pass; `git log` shows the shipped commits on `origin/skilled/v4.0.0.0` |
| 007-research-fork-improvements | 008-implement-fork-improvements | All 24 iterations logged across 4 lineages; a cross-validated P0/P1/P2 action list produced with real citations, so there is something concrete to decompose | `007-research-fork-improvements/research/research.md` closing section; every P0 citation re-read against the live source while authoring phase 8 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None remaining from the original planning pass — all three resolved during execution: iteration distribution ran as fan-out (3 lineages x 20 iterations = 60 dispatches, phase 1); SOL/TERRA/LUNA all dispatched via cli-codex as GPT-5.6 personas, confirmed; Phase 1 relied on a mix of local source reads and web sources for claim verification, recorded per-claim in `001-research/research/research.md`.

Phase 7's carried-forward question is resolved: its findings did warrant an implementation phase, and `008-implement-fork-improvements/` now holds the sequenced decomposition. What remains open is narrower and belongs there rather than here — which of the three child phases the operator authorizes for implementation, and in what order beyond the P0-before-P1-before-P2 constraint all four research lineages independently agreed on. Phase 8 is planning only until that decision is made, so no code in either fork has changed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Originating capture**: See `lumo.md` (raw external-AI research input this packet formalizes)
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
