---
title: "Phase 002: Commit Standards Definition"
description: "Use Sequential Thinking MCP to lock the canonical commit-message standard for this repo: subject format, body policy, trailer policy, packet-ID handling, special cases, and length caps. Validate against 20 random HEAD commits before closing."
trigger_phrases:
  - "112-commit-standards-definition"
  - "commit standards"
  - "conventional commits standard"
  - "Sequential Thinking commit standards"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/091-commit-standards-and-retroactive-rewrite/002-commit-standards-definition"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase 002 docs and 7-ADR decision-record"
    next_safe_action: "Invoke sequential_thinking MCP for the 7 standards decisions"
    blockers:
      - "Phase 001 (prerequisites) should complete first so baseline-log is available for 20-sample selection."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "commit-standards.md"
      - "derivation-heuristics.md"
      - "hand-sample-validation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Packet-ID prefix policy (strip / scope / body)?"
      - "Co-Authored-By merge rule for the ~3,498 existing trailers?"
      - "Imperative-mood enforcement on retroactive rewrites?"
      - "Body-required-or-optional when diff is unrecoverable?"
      - "Special-case rules for merge / revert / fixup / release commits?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 002: Commit Standards Definition

<!-- SPECKIT_LEVEL: 1 -->
<!-- NOTE: Upgrade to Level 3 (decision-record.md addendum) on activation. Pre-staged decision-record.md template exists in this folder. -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (upgrade to 3 on activation — decision-record.md pre-staged) |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-prerequisites-and-baseline |
| **Successor** | 003-sk-git-skill-update |
| **Handoff Criteria** | `commit-standards.md`, `derivation-heuristics.md`, `hand-sample-validation.md` exist; 20/20 random commits show deterministic rewrite; `decision-record.md` ADRs cover the 7 lock-in decisions; `validate.sh --strict` exits 0 |
> **Status note:** This archived packet retains its differing historical status fields as a record of the states captured at separate points in the original work.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the 112 packet — and the **current user focus**. The user invoked this packet specifically to "first define the standards" using deep thought, before any downstream work (sk-git update, cli-devin prompt authoring, retroactive rewrite execution).

**Scope Boundary**: Standards content only. No skill files modified, no commit history touched, no cli-devin prompts authored. Outputs are markdown deliverables under this phase's folder.

**Tool mandate**: `sequential_thinking` MCP server, **≥5 thoughts** per decision (the SWE-1.6 Prompt-Quality Contract in cli-devin SKILL.md §4 references the same ≥5 minimum and we mirror it here even though we're not dispatching cli-devin yet). `sk-prompt` is invoked only if auxiliary prompts are authored for downstream phases (none planned here — those belong to Phase 004).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo has standards on paper but no decisions locked in for the cases that actually matter for a retroactive rewrite. Specifically: the `sk-git` template at `assets/commit_message_template.md` covers happy-path conventional-commit subjects but says nothing about (a) how to handle packet-ID-prefixed history like `111 W3.D-A: …`, (b) how to merge or canonicalize the ~3,498 Co-Authored-By trailers already present in old commits, (c) whether retroactive rewrites preserve original tense or canonicalize to imperative mood, (d) what to do when the diff is too thin to write a useful body, or (e) special-case formats for merge / revert / fixup / release commits. Without these decisions, Phase 004's cli-devin prompts cannot be deterministic — every interpretive call becomes a per-commit roll of the dice, which makes the rewrite non-reproducible and the adversarial-sample gate meaningless.

### Purpose
Use Sequential Thinking MCP to deliberately reason through each of the seven decisions, lock them in `decision-record.md` ADRs, codify the result in a single canonical `commit-standards.md`, and prove via `hand-sample-validation.md` that the standard produces a deterministic rewrite for 20 random HEAD commits. If any of the 20 is underspecified, the standard reopens — that's the gate that keeps Phase 003 from churning.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**The 7 decisions to lock (Sequential Thinking):**

1. **Subject format** — Keep the existing `type(scope): subject` from `sk-git`? Refine the type taxonomy (currently: merge → release → docs → fix → feat → refactor → test → chore — is that complete?). Refine the scope-derivation rules (currently: skill name from `.opencode/skills/<name>/...`, etc.).
2. **Packet-ID prefix policy** — `111 W3.C:` / `111 W3.D-A:` etc. Three candidate policies: (a) strip entirely, (b) fold into scope (`feat(111-w3c): …`), (c) preserve in body as a `Packet:` trailer. Decision affects nearly every HEAD commit. **This is the single most consequential standard decision** for Phase 004's rewrite-vs-mechanical balance.
3. **Existing Co-Authored-By policy** — ~3,498 historical commits already carry Claude trailers in various forms (different model names, different formatting). Lock: preserve verbatim, canonicalize to the GIT-007 expected string, or merge multi-co-author cases.
4. **Imperative-mood enforcement on retroactive rewrites** — Original subjects are past-tense or noun-phrase. Lock: rewrite to imperative (cleaner log, but more interpretive work for the rewriter) or preserve original tense (mechanical but inconsistent with new commits going forward).
5. **Body policy when diff is unrecoverable** — Squashed merges, file-only-renames, content-less commits. Lock: skip body, emit minimal stock body (e.g., "rename N files"), or flag as `needs_human_review` and let the operator clear.
6. **Special cases** — Per-type rules for: merge commits (24 in HEAD), reverts, fixups, releases. The current `sk-git` template's type priority puts `merge` and `release` first but doesn't specify message structure for those types.
7. **Length caps** — Subject (current: <50). Body wrap (current: 72). Lock a max body length too (or accept unbounded with wrap). State whether the cap is a hard rule or guidance.

**Artifacts produced:**

- `commit-standards.md` — the canonical standard, one document. Replaces the de facto authority that's currently split between `sk-git` SKILL.md §3 and `assets/commit_message_template.md`.
- `derivation-heuristics.md` — algorithmic rules for type/scope inference from diff + file paths. Phase 004 prompts will reference this directly.
- `hand-sample-validation.md` — 20 random HEAD commits with their proposed rewrite under the standard. Shows the standard is deterministic.
- `decision-record.md` — 7 ADRs (one per decision above) with alternatives considered and rationale.

### Out of Scope

- Updating `sk-git` itself (Phase 003).
- Authoring the cli-devin dispatch prompts (Phase 004).
- Touching any commit history (Phase 005).
- Designing a `commit-msg` hook (deferred; explicitly out of scope unless user asks).
- Changes to AGENTS.md or root README.md.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `commit-standards.md` | Create | Canonical standard document |
| `derivation-heuristics.md` | Create | Algorithmic type/scope derivation rules |
| `hand-sample-validation.md` | Create | 20-sample deterministic-rewrite proof |
| `decision-record.md` | Create | 7 ADRs (pre-staged at L3 upgrade time) |
| `implementation-summary.md` | Update | Fill at phase close with Sequential Thinking session links + sample results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Sequential Thinking session for each of the 7 decisions | Each ADR in `decision-record.md` references at least one Sequential Thinking run with ≥5 thoughts; reasoning visible in the ADR's "Alternatives considered" + "Rationale" sections |
| REQ-002 | `commit-standards.md` is self-contained | A new contributor can read it and write a compliant commit without referring to other files; covers subject format, body format, trailers, all 7 decision outcomes, and 5+ worked examples (including one merge, one revert, one packet-ID legacy rewrite, one unrecoverable-diff case, one happy-path) |
| REQ-003 | `derivation-heuristics.md` is algorithmic | Type and scope derivation rules expressed as ordered first-match rules a Phase 004 prompt can mechanically apply. No "use your judgement" branches |
| REQ-004 | 20-sample deterministic-rewrite proof | `hand-sample-validation.md` shows 20 random HEAD commits (selected via `git log --pretty=%H | shuf -n 20 --random-source=evidence/baseline-log.txt` for reproducibility, or any deterministic seed) and their rewrite under the standard. Zero entries flagged underspecified |
| REQ-005 | ADRs cover all 7 decisions | One ADR per decision; status = Accepted; date = 2026-05-16 (or later if phase runs across days); alternatives considered include the non-chosen options from spec.md §3 |
| REQ-006 | `validate.sh --strict` passes | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ./002-commit-standards-definition --strict` exits 0 |
| REQ-007 | Continuity updated | `_memory.continuity` block in `implementation-summary.md` reflects phase-close state with `completion_pct: 100` and `next_safe_action` pointing at Phase 003 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 7 REQs above pass.
- The 20-sample validation document shows zero "this is ambiguous" calls. If any one of the 20 commits exposes a gap, the gap is closed in `commit-standards.md` and the sample is re-run.
- `decision-record.md` ADRs can be cited from Phase 003's sk-git update and Phase 004's cli-devin prompts without further interpretation.
- The standard explicitly addresses the packet-ID prefix problem (which affects ~all HEAD commits).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Sequential Thinking drift**: 7 decisions in one session may compress thinking. Mitigation — split into 2 or 3 sessions across decisions if needed. Each ADR records its own session reference.
- **Underspecified standard surviving the 20-sample gate**: 20 commits is a small N. Mitigation — pick the sample so it includes at least 1 merge, 1 revert, 1 fixup, 1 packet-ID-prefixed, 1 docs-only, 1 multi-skill, 1 rename-heavy. Stratify rather than pure random if needed.
- **Decision churn in Phase 003**: if Phase 003 implementation reveals a gap, this phase reopens. That's by design — the order is 001 → 002 → 003 → 004 → 005, and any standards reopening blocks 003+. Accept the cost as the price of catching gaps early.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These map 1:1 to the 7 decisions and are answered DURING this phase (Sequential Thinking), not before:

- Q1 — Subject format details (type taxonomy, scope derivation)?
- Q2 — Packet-ID prefix policy?
- Q3 — Existing Co-Authored-By trailer merge rule?
- Q4 — Imperative-mood enforcement on retroactive rewrites?
- Q5 — Body policy when diff is unrecoverable?
- Q6 — Special-case rules (merge/revert/fixup/release)?
- Q7 — Length caps (subject hard cap, body wrap, body max)?

Each resolution is captured as one ADR in `decision-record.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessor: `../001-prerequisites-and-baseline/spec.md`
- Successor: `../003-sk-git-skill-update/spec.md`
- Existing standards (inputs to deliberation):
  - `.opencode/skills/sk-git/SKILL.md` §3 (type/scope priority, lines 177–196)
  - `.opencode/skills/sk-git/assets/commit_message_template.md` (lines 53–95)
  - `.opencode/skills/sk-git/references/commit_workflows.md`
  - `CONTRIBUTING.md` lines 82–98 (conventional-commits spec reference)
- Outputs (this phase): `commit-standards.md`, `derivation-heuristics.md`, `hand-sample-validation.md`, `decision-record.md`
