---
title: "Fork Attribution and Changelog"
description: "Make fork provenance explicit in both vendored extensions' READMEs and document each fork's changes against its upstream in a standalone CHANGES-FROM-UPSTREAM.md, using the already-verified evidence from phases 003, 006, and 008."
trigger_phrases:
  - "fork attribution"
  - "changes from upstream"
  - "pi-cache-optimizer fork notice"
  - "deep-pi fork notice"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/009-fork-attribution-and-changelog"
    last_updated_at: "2026-08-08T12:43:31Z"
    last_updated_by: "spec-author"
    recent_action: "Applied fact-checked fork docs; cleaned a stray-artifact gap"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: new child 009 under 039, sibling to 007/008 — distinct workstream, not a reopen of Complete 008."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Fork Attribution and Changelog

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Created** | 2026-08-08 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 008-implement-fork-improvements |
| **Successor** | 010-doc-template-and-code-readme-alignment |

### Phase Context

Sibling to `007-research-fork-improvements` and `008-implement-fork-improvements` under the `039-pi-caching-like-reasonix` phase parent. Neither prior phase disclosed fork provenance in either extension's README or produced a changes-vs-upstream document; both forks' actual patches are already fully documented across `003-fork-and-guard-cache-optimizer`, `006-fork-and-improve-deep-pi/{001,002,003}`, and `008-implement-fork-improvements/{001,002,003}` — this phase surfaces that already-verified evidence to the two README-adjacent audiences (an operator reading the README, and anyone diffing against upstream), not re-derive it.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Both `.pi/extensions/pi-cache-optimizer/README.md` and `.pi/extensions/deep-pi/README.md` read as if they were the unmodified upstream package. `pi-cache-optimizer/README.md` has zero fork disclosure — it links only to the npm package and shows no sign it is a patched fork vendored in-repo. `deep-pi/README.md` already credits its two-hop upstream lineage (`christopherarter/deep-pi` derived from `jrimmer/pi-deepseek-optimized`) but does not disclose that the copy in this repo has since diverged from `christopherarter/deep-pi` via three rounds of local patches, and its own `pi install git:github.com/christopherarter/deep-pi` command installs the unmodified original, not this patched copy. Additionally, `pi-cache-optimizer/README.zh-CN.md` is a stale translated README that was never updated alongside the fork's patch and predates the fork disclosure this phase adds.

### Purpose

Make fork provenance and scope of local changes discoverable directly from each extension's README, backed by a standalone, evidence-grounded changes-vs-upstream document per fork.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Delete `.pi/extensions/pi-cache-optimizer/README.zh-CN.md`.
- Add a "Fork" section to `.pi/extensions/pi-cache-optimizer/README.md` stating it is a fork of `jiangge/pi-cache-optimizer` v2.8.0, vendored in-repo, with a link to the new changes document.
- Add a "Fork" section to `.pi/extensions/deep-pi/README.md` stating the local copy has diverged from `christopherarter/deep-pi` at the vendored commit, that the existing install command installs the unmodified original, with a link to the new changes document. The existing "Attribution" section (upstream-to-upstream lineage) stays unchanged.
- Create `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md`.
- Create `.pi/extensions/deep-pi/CHANGES-FROM-UPSTREAM.md`.

### Out of Scope

- No source/behavior changes to either extension.
- No re-verification of the underlying claims (already verified in 003/006/008); this phase cites that evidence, it does not re-run it.
- No changes to the removed `.pi/extensions/pi-cache-optimizer/README.zh-CN.md`'s content elsewhere (e.g. no replacement translated README).

### Files to Change

- `.pi/extensions/pi-cache-optimizer/README.zh-CN.md` (delete)
- `.pi/extensions/pi-cache-optimizer/README.md` (edit)
- `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` (create)
- `.pi/extensions/deep-pi/README.md` (edit)
- `.pi/extensions/deep-pi/CHANGES-FROM-UPSTREAM.md` (create)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `README.zh-CN.md` removed | File does not exist; `git status` shows it deleted |
| REQ-002 | `pi-cache-optimizer/README.md` discloses the fork | A "Fork" section names the upstream repo/version, the vendored commit, and links to `CHANGES-FROM-UPSTREAM.md` |
| REQ-003 | `deep-pi/README.md` discloses local divergence | A "Fork" section states the local copy has diverged from the vendored `christopherarter/deep-pi` commit, notes the install command installs the unmodified original, and links to `CHANGES-FROM-UPSTREAM.md`; the existing Attribution section is untouched |
| REQ-004 | `pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` exists and is accurate | Every claim traces to phase 003's verified evidence (predicate + 6 guard hooks + 1 test + the later test-runner config change); no unverified claim added |
| REQ-005 | `deep-pi/CHANGES-FROM-UPSTREAM.md` exists and is accurate | Every claim traces to phases 006/{001,002,003} and 008/{001,002,003}'s verified evidence across all three rounds; no unverified claim added |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Both READMEs' internal link/TOC consistency preserved | pi-cache-optimizer's `## Contents` list and any anchor links still resolve after the new section is inserted |
| REQ-007 | No stray files from drafting | `git status --porcelain` on both extension directories shows only the intended additions/edits/deletion |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `README.zh-CN.md` gone; both READMEs carry a factual "Fork" disclosure; both `CHANGES-FROM-UPSTREAM.md` files exist and are cross-checked line-by-line against the verified phase evidence before being accepted.
- `validate.sh --strict` passes for this spec folder; `validate.sh --recursive --strict` still passes for the whole `039` packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk/Dependency | Type | Mitigation |
|---|---|---|
| A GPT-drafted document overstates or invents a claim not in the verified evidence | Quality | Every drafted sentence is checked against the cited phase implementation-summary before being applied; unverifiable phrasing is cut, not softened |
| README section insertion breaks the existing table of contents / anchor links | Regression | Re-read the full README after edit; confirm `## Contents` entries still match section headers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Depends on**: `003-fork-and-guard-cache-optimizer/implementation-summary.md`, `006-fork-and-improve-deep-pi/{001,002,003}/implementation-summary.md`, `008-implement-fork-improvements/{001,002,003}/implementation-summary.md` (source evidence)
- **Related**: `.opencode/scripts/vendored-fork-provenance.json` (recorded upstream identities/commits/hashes)
