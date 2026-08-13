---
title: "Implementation Plan: Fork Attribution and Changelog"
description: "Dispatch gpt-5.6-sol (via cli-codex) to draft both READMEs' fork-notice sections and both CHANGES-FROM-UPSTREAM.md documents from already-verified phase evidence; apply only after checking every drafted claim against that evidence."
trigger_phrases:
  - "fork attribution plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/009-fork-attribution-and-changelog"
    last_updated_at: "2026-08-08T12:43:31Z"
    last_updated_by: "spec-author"
    recent_action: "Applied fact-checked fork docs; validated clean"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Fork Attribution and Changelog

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation only; no source changes |
| **Framework** | None — plain README + standalone changelog documents |
| **Storage** | None new |
| **Testing** | No automated tests; verification is manual fact-checking against cited phase evidence plus `validate.sh --strict` |

### Overview

Every fact this phase needs is already verified and recorded in phase 003 (pi-cache-optimizer's guard patch), phase 006's three children (deep-pi's Round 1 diagnostics fixes and vendoring), and phase 008's three children (deep-pi's Round 2/3 correctness/observability/maintainability work). This phase does no new investigation — it packages that evidence into two README-facing disclosures and two standalone changelog documents, using GPT (gpt-5.6-sol via cli-codex) to draft the prose from a fact sheet assembled from those phases, then verifying every drafted claim before applying it.

### Why GPT drafting

The user directed using GPT for this work. Drafting from a supplied fact sheet is a good fit for delegation (batch documentation generation, per cli-codex's own routing table) precisely because the facts are already fixed and verified — the drafting model cannot introduce a factual error the verification pass won't catch, since every sentence is checked against the same fact sheet before being applied.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Both current READMEs read in full to confirm insertion points and existing structure
- [x] `.opencode/scripts/vendored-fork-provenance.json` read to confirm upstream identities/commits/hashes
- [x] All four relevant phase implementation-summary.md files read to extract the verified change list per fork

### Definition of Done

- [x] `README.zh-CN.md` deleted
- [x] Both READMEs carry a fact-checked "Fork" section
- [x] Both `CHANGES-FROM-UPSTREAM.md` files exist, fact-checked against the source phase evidence
- [x] `validate.sh --strict` passes this folder; `validate.sh --recursive --strict` still passes the whole `039` packet
- [x] `git status --porcelain` on both extension directories shows only the intended changes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Dispatch-then-verify, matching this session's established discipline: a GPT dispatch drafts from a supplied, pre-verified fact sheet into scratch files; every claim in the draft is checked against the cited phase evidence before being copied into the real README/changelog locations. Nothing from the dispatch is trusted at face value.

### Key Components

**REQ-001 — delete the stale translated README.** A plain `rm`; no replacement is in scope.

**REQ-002/REQ-004 — pi-cache-optimizer fork disclosure + changelog.** Fact sheet: fork identity (`jiangge/pi-cache-optimizer` v2.8.0 → `MichelKerkmeester/pi-cache-optimizer`, vendored commit `5132d137ce28cb91ec12a5475832df4d5154085a`), the single patch (`isDeepPiOwned` predicate + 6 hook guards + 1 test, `index.ts` +11/`tests/review-findings.test.ts` +9), and the later test-runner `package.json` change from phase 008/001. Insert the "Fork" section into `README.md` near the top (after the language-link line, before "## What it does"), matching existing tone. `CHANGES-FROM-UPSTREAM.md` is a new standalone file at the extension root.

**REQ-003/REQ-005 — deep-pi fork disclosure + changelog.** Fact sheet: vendored `christopherarter/deep-pi` commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549` (itself derived from `jrimmer/pi-deepseek-optimized`, already credited in the existing Attribution section — left untouched), plus three rounds of local changes: Round 1 (three diagnostics fixes, phase 006/001), Round 2 (correctness floor, phase 008/001), Round 3 (observability/economics/maintainability, phase 008/002+003). Insert the new "Fork" section directly after the existing "## Attribution" section, explicitly noting the install command installs the unmodified upstream. `CHANGES-FROM-UPSTREAM.md` is a new standalone file at the extension root, with one subsection per round.

### Data Flow

Phase implementation-summaries (source of truth) → condensed fact sheet (written into the dispatch prompt) → gpt-5.6-sol draft (scratch files) → line-by-line fact-check against the phase implementation-summaries → applied to the real README/changelog files → `validate.sh --strict`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read both current READMEs and the provenance JSON
- [x] Read all four source phases' implementation-summary.md files for the verified change list
- [x] Assemble the fact sheet and dispatch gpt-5.6-sol (cli-codex, high reasoning, fast tier, workspace-write sandbox scoped to a scratch directory)

### Phase 2: Implementation

- [x] Fact-check every sentence in the four drafted documents against the source phase evidence; cut or correct anything unverifiable
- [x] Delete `README.zh-CN.md`
- [x] Splice the fact-checked "Fork" section into `pi-cache-optimizer/README.md`; write the fact-checked `CHANGES-FROM-UPSTREAM.md`
- [x] Splice the fact-checked "Fork" section into `deep-pi/README.md` after its existing Attribution section; write the fact-checked `CHANGES-FROM-UPSTREAM.md`

### Phase 3: Verification

- [x] Re-read both final READMEs in full; confirm `## Contents`/anchor consistency (pi-cache-optimizer) and that the existing Attribution section is untouched (deep-pi)
- [x] `git status --porcelain` on both extension directories: only the intended 5 file changes present
- [x] `validate.sh --strict` on this spec folder; `validate.sh --recursive --strict` on the whole `039` packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No automated tests apply to documentation-only changes. Verification is: (1) manual line-by-line fact-check of drafted prose against the cited phase implementation-summaries, (2) a real `git status`/`git diff` scope check, (3) `validate.sh --strict`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|---|---|---|
| Phase 003/006/008 implementation-summaries | Internal | Complete, already verified — this phase cites, does not re-derive |
| `codex` CLI, ChatGPT OAuth | External tooling | Confirmed available and authenticated before dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Working-tree revert of the five touched files (`git checkout -- <path>` for edits, `git status` shows deletions/additions as untracked/removed — restore `README.zh-CN.md` from `git show HEAD:<path>` if the deletion needs reverting). No production behavior changes, so rollback carries no runtime risk.
<!-- /ANCHOR:rollback -->
