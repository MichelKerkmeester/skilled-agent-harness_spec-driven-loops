---
title: "Feature Specification: sk-git Review Remediation Round 2"
description: "Close the two open GPT-5.6-sol review items on sk-git: (1) add a Git Workspace Safety subsection to AGENTS.md (ask-first worktree rule, owner-first grammar, forbidden branch commands, hyphen-pilot guard) plus a quick-ref row update; and (2) five pre-existing findings — a test-harness mktemp guard (cd \"\" returns 0), a >9999 allocator-exhaustion guard, catalog<->references contract reconciliation, SKILL.md NEVER safety refusals, and a cross-skill sk-doc validate_document.py fix (hyphen doc-type detection + CLI --type)."
trigger_phrases:
  - "sk-git review remediation"
  - "git workspace safety agents.md"
  - "worktree naming allocator hardening"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/013-git-review-remediation"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "All six concerns fixed + independently verified"
    next_safe_action: "Scoped commit + push; then reconcile concurrent sk-git spec renumbering before WS2"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-review-remediation-r2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-git Review Remediation Round 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## EXECUTIVE SUMMARY

A fresh independent GPT-5.6-sol review of sk-git (packet 005) surfaced two open items that packet 005 documented but did not itself fix. Item 1 is a governance gap: the repo-root `AGENTS.md` has a Mandatory Tools table with a `Git (sk-git)` row but no explicit **Git Workspace Safety** guidance, so an agent reading only `AGENTS.md` never learns the ask-first worktree rule, the owner-first `{owner}/{NNNN}-{slug}` grammar, or the forbidden direct-branch commands. Item 2 is a set of five pre-existing findings across the allocator scripts, the skill's documentation contracts, `SKILL.md`, and a cross-skill sk-doc validator. This packet closes all of them, each fix gated by its own verifier contract, with `validate.sh --strict` on the packet.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (governance doc + script hardening + contract reconciliation + a cross-skill validator fix) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Track** | `sk-git` |
| **Source** | GPT-5.6-sol review of packet `012-readme-enrichment-and-hyphen-naming` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two open review items remain after packet 005:

1. **AGENTS.md has no Git Workspace Safety guidance.** The Mandatory Tools table names `Git (sk-git)` but an agent that reads only `AGENTS.md` (not the full `SKILL.md`) has no summary of the ask-first worktree-vs-branch rule, the owner-first branch grammar, the allocate-never-count discipline, the forbidden `git branch` / `checkout -b` / `switch -c` commands, or the standing "do not revert the sk-git hyphen pilot to snake_case" guard.

2. **Five pre-existing findings:**
   - **2a — test-harness safety bug.** `worktree-naming.test.sh` guards its `mktemp -d` with `cd "$TMP" || exit 1`, but `cd ""` returns 0 in Bash, so on an `mktemp` failure the guard never fires and the harness could `git init` / create worktrees in the real clone.
   - **2b — allocator exhaustion preview.** `worktree-naming.sh`'s `next` subcommand prints `max + 1` unconditionally, so at exhaustion it previews an unallocatable number `> 9999` that `allocate` would then reject — the preview and the allocator disagree.
   - **2c — catalog<->references contract drift.** The feature-catalog and the references/SKILL.md contracts disagree on three points (worktree lanes; whether CI/CD status routes to GitHub MCP or `gh`; the failing-test-gate override), with no single authoritative source.
   - **2d — README claims unbacked safety refusals.** `README.md` states the skill "refuses" `--no-verify` bypasses, secrets in a diff, amending a published commit, and force-pushing `main`, but `SKILL.md`'s NEVER rules do not enumerate those refusals — the claim has no contract behind it.
   - **2e — cross-skill sk-doc validator.** `sk-doc/shared/scripts/validate_document.py` detects `playbook_feature` / `feature_catalog` doc types only by underscore path tokens (`/manual_testing_playbook/`, `/feature_catalog/`), so after sk-git's hyphen rename those leaves fall through to `readme`; and the CLI `--type` choices omit `playbook`, `playbook_feature`, and `feature_catalog` even though all three are valid `documentTypes`.

### Purpose

Close both review items so sk-git's governance surface, allocator safety, documentation contracts, and the shared sk-doc validator are all self-consistent and correct — leaving no open finding from the packet-005 review.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **`AGENTS.md`** (repo root): add a **Git Workspace Safety** subsection after the Mandatory Tools table; update the Git-workflow quick-ref row.
- **`.opencode/skills/sk-git/scripts/worktree-naming.sh`**: make `next` fail (no output, non-zero) at exhaustion instead of previewing `> 9999`.
- **`.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh`**: replace the unguarded `cd "$TMP"` with a `${TMP:?}` guard; add a regression assertion.
- **`.opencode/skills/sk-git/feature-catalog/**` and `references/**` and `SKILL.md`**: reconcile the three contract-conflict points to ONE authoritative source (references/SKILL.md authoritative; catalog mirrors).
- **`.opencode/skills/sk-git/SKILL.md`**: add the four safety refusals to the NEVER rules (to back the README claim).
- **`.opencode/skills/sk-doc/shared/scripts/validate_document.py`** (cross-skill): teach hyphen + underscore doc-type detection; expose `playbook`/`playbook_feature`/`feature_catalog` via CLI `--type`.

### Out of Scope

- The `template_rules.json` path in `validate_document.py` line 105 — verified already correct (`script_dir.parent / "assets"` resolves to `sk-doc/shared/assets/template_rules.json`, which exists). Verify-only; do NOT change.
- Any allocator behavior beyond the `next` exhaustion guard; the owner-first grammar itself.
- The WS2 spec consolidation / renumber (separate workstream).
- Any file outside the path-scope above.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Git Workspace Safety subsection + quick-ref row |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Modify | `next` fails at exhaustion (no output, non-zero) |
| `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | `${TMP:?}` guard + regression + boundary test |
| `.opencode/skills/sk-git/feature-catalog/**` | Modify | Reconcile contracts to references/SKILL.md |
| `.opencode/skills/sk-git/references/**` | Modify (if needed) | Ensure single authoritative statement |
| `.opencode/skills/sk-git/SKILL.md` | Modify | NEVER safety refusals |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Hyphen detection + CLI `--type` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | AGENTS.md carries a Git Workspace Safety subsection | Subsection appears after the Mandatory Tools table; covers ask-first worktree rule, owner-first `{owner}/{NNNN}-{slug}` grammar, allocate-never-count via `worktree-naming.sh`, forbidden `git branch`/`checkout -b`/`switch -c`, and the hyphen-pilot guard; the Git-workflow quick-ref row is updated to point at it |
| REQ-002 | The allocator `next` never previews an unallocatable number | At exhaustion (`scan-max` == 9999) `next` prints nothing and exits non-zero; a boundary test asserts this; the existing harness stays green |
| REQ-003 | The test harness cannot run in the real clone on an `mktemp` failure | `cd` is guarded by `${TMP:?}` (aborts on empty/unset); a regression assertion proves an empty `TMP` aborts before any `git init`; the harness stays green |
| REQ-004 | The three contract conflicts have ONE authoritative source | worktree-lane grammar, CI GitHub-MCP-vs-`gh` routing, and the failing-test-gate override each read consistently across `feature-catalog`, `references`, and `SKILL.md`; references/SKILL.md are authoritative and the catalog mirrors them |
| REQ-005 | The README safety-refusal claim is backed by a contract | `SKILL.md`'s NEVER rules enumerate the four refusals (`--no-verify` bypass, secrets in a diff, amending a published commit, force-pushing `main`) that `README.md` §Cleanup And Safety Refusals claims |
| REQ-006 | The sk-doc validator classifies hyphen-named playbook/catalog leaves and exposes them via CLI | `detect_document_type` returns `playbook_feature`/`feature_catalog` for both hyphen and underscore dir names; CLI `--type` accepts `playbook`, `playbook_feature`, `feature_catalog`; the `template_rules.json` path is left unchanged (already correct) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: AGENTS.md Git Workspace Safety subsection present + quick-ref row updated.
- **SC-002**: `worktree-naming.sh next` fails silently at exhaustion; boundary test green.
- **SC-003**: Test harness aborts on empty `TMP`; regression green; full harness `FAIL=0`.
- **SC-004**: Three contract conflicts reconciled to one authoritative source.
- **SC-005**: SKILL.md NEVER rules enumerate the four safety refusals.
- **SC-006**: `validate_document.py` detects hyphen-named leaves + CLI `--type` exposes the three types; a hyphen-named playbook/catalog leaf classifies correctly.
- **SC-007**: `validate.sh --strict` on this packet Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing `validate_document.py` (cross-skill, shared by all skills) could regress other doc types | High | Change only the two additive detection lines + the CLI choices; run the sk-doc validator on existing readme/skill/spec docs to confirm no regression; verify a hyphen leaf classifies correctly |
| Risk | Reconciling contracts could delete a genuinely-intended nuance | Medium | Treat references/SKILL.md as authoritative; make the catalog mirror them rather than deleting content; preserve the underlying rule |
| Risk | Shared/dirty tree, concurrent sessions | Medium | Path-scope every edit; scoped staging only (never `git add -A`); target files verified clean before dispatch |
| Dependency | Fresh Sonnet-5 @ xhigh agents apply the fixes | Low | Each agent bound to one concern + its verifier contract; orchestrator verifies independently (finding = hypothesis) before commit |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Documentation Quality
- AGENTS.md subsection is concise and consistent with SKILL.md's grammar; no duplication drift.

### Compatibility
- No script behavior change beyond the `next` exhaustion guard; the allocator grammar is unchanged; the sk-doc validator stays backward-compatible with underscore names.

## 8. EDGE CASES

- `mktemp -d` fails and returns empty → the guard must abort before `git init`.
- `scan-max` returns exactly 9999 → `next` fails; 9998 → `next` prints 9999.
- A hyphen-named `feature-catalog/<category>/<feature>.md` and its underscore historical form must both classify as `feature_catalog`.
- A README safety claim that maps to an existing NEVER rule (avoid duplicating; enumerate the missing refusals only).

## 9. COMPLEXITY ASSESSMENT

Six small, mostly-disjoint fixes across governance docs, two allocator scripts, the skill's doc contracts, `SKILL.md`, and one cross-skill Python validator. Level 2: bounded, ref-integrity-sensitive, gated by per-concern verifier contracts and `validate.sh --strict`. Below the phase-qualification threshold (complexity < 25 / level < 3), so modeled as task-phases in one packet rather than a phase-parent.

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

| # | Question | Resolution |
|---|----------|------------|
| Q1 | Fix the README safety claim by adding NEVER rules, or by dropping the README claim | Resolved — add the four refusals to SKILL.md NEVER rules (the refusals are the intended behavior; the contract should back the claim) |
| Q2 | Is the `template_rules.json` path a bug | Resolved — no; verified it resolves to `sk-doc/shared/assets/template_rules.json` (exists). Verify-only, no change |
| Q3 | Which source is authoritative for the contract conflicts | Resolved — `references/` + `SKILL.md`; the feature-catalog mirrors them |
<!-- /ANCHOR:questions -->

## 11. RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Prior packet: `../012-readme-enrichment-and-hyphen-naming/`
- Skill: `../../../skills/sk-git/`
- Cross-skill validator: `../../../skills/sk-doc/shared/scripts/validate_document.py`
