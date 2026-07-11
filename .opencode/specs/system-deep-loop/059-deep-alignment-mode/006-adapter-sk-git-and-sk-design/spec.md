---
title: "Feature Specification: Phase 6: adapter-sk-git-and-sk-design"
description: "Phase 006 plans two deep-alignment authority adapters: the deterministic sk-git conformance adapter (conventional-commit grammar, worktree/branch naming) and the sk-design static audit-rubric adapter (DESIGN.md structure, design tokens, anti-default dimensions; live-render audits explicitly deferred). This is a planning-only pass against the phase-005 adapter contract; no adapter code ships here."
trigger_phrases:
  - "deep-alignment sk-git adapter"
  - "deep-alignment sk-design adapter"
  - "conventional commit conformance check"
  - "design token audit rubric adapter"
  - "static DESIGN.md conformance"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/006-adapter-sk-git-and-sk-design"
    last_updated_at: "2026-07-11T14:51:52Z"
    last_updated_by: "claude"
    recent_action: "Built and dry-verified both adapters against live data"
    next_safe_action: "Hand off to phase 007 sk-code adapter build"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-design/design-md-generator/references/design_md_format.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "sk-design live-render scope: ADR-009 LOCKED, split into peer phase 010-adapter-sk-design-live-render"
      - "sk-git discover() scope grammar: branchRange for commits, unconditional git branch --list for branch names"
      - "sk-design known-deviation list storage format: Markdown doc with a fenced json block, same shape as phase 005"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: adapter-sk-git-and-sk-design

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `system-deep-loop/059-deep-alignment-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | 005-adapter-sk-doc |
| **Successor** | 007-adapter-sk-code |
| **Handoff Criteria** | A future executor can begin coding both adapters directly from this plan: the phase-005 `{discover, standardSource, check}` contract signature, the sk-git rule sources, the sk-design v1 static boundary, and both known-deviation list locations are all named with real paths. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-alignment` needs one adapter per standard authority so a lane scoped to `authority=sk-git` or `authority=sk-design` can run. The design brief sequences authorities by determinism (sk-doc first, then sk-git, then sk-design, then sk-code); phase 005 ships the sk-doc reference adapter, but sk-git's conventional-commit contract and sk-design's audit rubric have no adapter plan yet, so those two lanes cannot be scoped or discovered.

### Purpose
Produce an evidence-grounded plan for the sk-git adapter (deterministic commit/branch conformance) and the sk-design adapter (v1 static DESIGN.md/token audit), each implementing the phase-005 adapter contract, so a future implementer can build both without re-deriving sk-git's commit grammar or sk-design's audit dimensions from scratch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Phase Context

This is **Phase 6** of the `system-deep-loop/059-deep-alignment-mode` mode-packet specification.

**Scope Boundary**: Plan only. No adapter code, no mode-packet `SKILL.md`, no scripts ship in this phase.

**Dependencies**: The adapter contract shape `{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }` was frozen in phase 002 (ADR-003); phase 005's sk-doc adapter is its reference implementation, whose shape both adapters here MUST match identically. This phase treats that contract as locked per the design brief and does not re-derive it.

**Deliverables**: A named plan for the sk-git adapter's discover/standardSource/check behavior, a named plan for the sk-design adapter's discover/standardSource/check behavior (v1 static-only), and the known-deviation list location for each.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### In Scope
- Plan the sk-git adapter: `discover()` scope resolution over a commit range or branch diff, `standardSource()` reading sk-git's deterministic commit-message grammar and branch-naming rule, `check()` flagging conventional-commit and branch-naming violations.
- Plan the sk-design adapter (v1, static only): `discover()` scope resolution over DESIGN.md/tokens.json-bearing paths, `standardSource()` reading the shared design token vocabulary and audit rubric, `check()` flagging structural and token nonconformance.
- Document the explicit v1 boundary: the sk-design adapter is static-artifact review only; live-render and `chrome-devtools`-driven accessibility/performance audits are OUT for this phase — ADR-009 (now LOCKED) splits that dimension into its own peer phase, `010-adapter-sk-design-live-render`, not phase 007 or 008.
- Document each adapter's known-deviation / accepted-convention list per the alignment contract's suppression invariant.
- Document each adapter's VERIFY-FIRST re-probe step (alignment contract invariant 1).

### Out of Scope
- (gate opened per operator approval 2026-07-11; all 6 Files-to-Change rows below built and dry-verified the same day - see Success Criteria for evidence)
- The sk-doc reference adapter - owned by phase 005.
- The sk-code adapter - owned by phase 007.
- Wiring these adapters into the iterate/converge loop - owned by phase 008.
- Command, agent, and advisor cutover work - owned by phase 009.
- sk-design live-render/`chrome-devtools` audits - split into phase 010 (`010-adapter-sk-design-live-render`, ADR-009 LOCKED), a peer adapter phase, not owned here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_git_adapter.md` | Create | standardSource/check/discover specification for sk-git, following phase 005's proven template |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_git_known_deviations.md` | Create | sk-git known-deviation suppression list |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs` | Create | The real, working sk-git adapter (discover/standardSource/check + CLI) |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_adapter.md` | Create | standardSource/check/discover specification for sk-design (static-only, v1) |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_known_deviations.md` | Create | sk-design known-deviation suppression list |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs` | Create | The real, working sk-design static adapter (discover/standardSource/check + CLI) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Name the sk-git adapter's rule sources with real paths. | `plan.md` cites `.opencode/skills/sk-git/SKILL.md` §"Commit Message Logic" (lines 309-457, especially the type/scope/summary grammar at lines 328-397) and the branch-naming rule at line 298 as the `standardSource()` input. |
| REQ-002 | State the sk-design adapter's v1 static-only boundary explicitly. | `spec.md` Scope names the live-render capability as split into phase 010 (ADR-009 LOCKED) and cites `.opencode/skills/sk-design/design-audit/references/audit_contract.md` and `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md` as the v1 static rule sources. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Define each adapter's known-deviation list location. | `plan.md` Architecture section names where each adapter's accepted-convention list lives (authority-local, per ADR-005's per-authority suppression lists) and how a future authority-owner edits it. |
| REQ-004 | Define each adapter's VERIFY-FIRST re-probe behavior. | `plan.md` states that findings are re-probed against live ground truth (re-run `git log`/`git show` for sk-git; re-read the current `DESIGN.md`/`tokens.json` for sk-design) immediately before a finding is asserted, not cached from an earlier discover pass. |
| REQ-005 | Confirm the sk-git adapter honors sk-git's Git-generated-subject exemption list instead of flagging exempt commits as violations. | `plan.md` names the exemption prefixes (`Merge `, `Revert "`, `fixup! `, `squash! `, `amend! `) cited from `.opencode/skills/sk-git/SKILL.md` §"Classify Special Git Messages" and `tasks.md` includes a dry-run task proving it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future implementer can build the sk-git adapter's `check()` directly from this phase's plan without re-reading `sk-git/SKILL.md` commit rules from scratch. Superseded by an actual build: `scripts/adapters/sk-git.cjs`'s `checkCommitGrammar()` ports `.opencode/scripts/git-hooks/commit-msg`'s structural rules line-for-line (cited inline in code), verified live against real HEAD-range commits (`node sk-git.cjs discover HEAD~15 HEAD`; `check --commit d3ccce15d2` correctly found a genuine 85-char `subject-long` P2) and five synthetic grammar cases (bad subject, vague summary, numeric scope, missing breaking footer, clean message), each producing exactly the expected result.
- **SC-002**: A future implementer can build the sk-design adapter's `check()` against the phase-005 contract with no ambiguity about the v1 static-only boundary. Superseded by an actual build: `scripts/adapters/sk-design.cjs` reads `DESIGN.md`/`tokens.json` only (NFR-S01, no Playwright/chrome-devtools invocation anywhere in the module), verified clean against all 4 real example fixtures under `.opencode/skills/sk-design/design-md-generator/references/examples/` (`vercel`, `linear`, `stripe`, `supabase`) after two real bugs surfaced by that same dry-run were fixed (`sk_design_adapter.md` Section 7: an `extractSection()` multiline-`$` lookahead bug, and an over-broad frequency-dump regex false-positiving on legitimate CSS-value prose).
- **SC-003**: Both adapter plans name a known-deviation list location and a verify-first re-probe step. Superseded by an actual build: `sk_git_known_deviations.md` (4 entries, one evidence-cited to a real hook-installation commit `7ea5cfb7c1` plus two real pre-hook legacy-scope commits) and `sk_design_known_deviations.md` (3 entries, all cited to `design_md_format.md` line ranges) both exist under `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/`, and are parsed live by each adapter's `loadKnownDeviations()` (confirmed via `standard-source` CLI output echoing the parsed list back). All 6 files pass `node --check`; both `.cjs` files expose `discover`/`check`/`standard-source` CLI subcommands independently exercisable with no phase-008 engine wiring, matching phase 005's own precedent.
- **SC-004 (new)**: A genuine false-positive found in `sk-git.cjs` during dry-run (the main checkout's own branch, `skilled/v4.0.0.0`, would have been flagged as a worktree-created branch missing the `wt/` namespace, because `git worktree list --porcelain`'s first block is indistinguishable in shape from a linked worktree) was caught before shipping and fixed by excluding the block whose `worktree` path equals `REPO_ROOT` — re-verified live: `check --branch skilled/v4.0.0.0` and `check --branch main` both return `[]`, with no regression on `check --branch wt/0001-mcp-front-proxy` or `check --branch work/021-graph-preservation`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 adapter contract shape | If the contract signature shifts after phase 005 ships, both plans here need reconciliation before build. | Treat the design brief's locked `{discover, standardSource, check}` contract as canonical at scaffold time; reconcile against phase 005's actual implementation at build time. |
| Risk | sk-design audit rubric is judgment-heavy even in static mode (anti-slop, cognitive laws). | `check()` could over-flag intentional design choices as violations. | Require every finding to cite the specific `audit_contract.md` or `ai_fingerprint_tells.md` dimension violated, plus the known-deviation list check, not a bare "looks off" verdict. |
| Risk | sk-git commit-message enforcement partially duplicates the live `commit-msg` hook. | Adapter logic could drift from the hook's grammar over time. | `check()` should read/parse the same rule source the hook uses (`.opencode/scripts/git-hooks/commit-msg`) rather than reimplementing the type/scope/summary grammar independently. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: sk-git adapter `discover()` over a bounded commit range or branch diff completes without a full-repo `git log` scan by default.

### Security
- **NFR-S01**: sk-design adapter reads `DESIGN.md`/`tokens.json` only; it never invokes the `design-md-generator` Playwright extraction pipeline, which mutates/writes and would violate the default read-only alignment contract.

### Reliability
- **NFR-R01**: Both adapters degrade to a documented "no lane artifacts found" result rather than erroring when scope resolves to zero commits or zero `DESIGN.md` files.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty commit range in scope: sk-git adapter returns zero findings with an explicit "empty scope" note, not a silent PASS claim.
- No `DESIGN.md` in scoped surface: sk-design adapter reports "no DESIGN.md found in scope" as its own finding category rather than skipping silently.

### Error Scenarios
- Merge commit or Git-generated subject (`Merge `, `Revert "`, `fixup! `, `squash! `, `amend! `) in the commit range: the sk-git adapter must apply sk-git's own exemption list (`.opencode/skills/sk-git/SKILL.md` §"Classify Special Git Messages", lines 319-326) and not flag it as a violation.

### State Transitions
- Not applicable to this phase - neither adapter mutates state; both are read-only discover/check passes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two bounded adapter plans, no code shipped. |
| Risk | 8/25 | sk-design rubric judgment-risk and sk-git hook-duplication risk, both mitigated above. |
| Research | 10/20 | Cross-read of `sk-git/SKILL.md`, `sk-design/design-audit/`, `sk-design/design-md-generator/`, and the shared token vocabulary. |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

All three resolved at build time (2026-07-11):

- ~~Exact `discover()` scope grammar for sk-git (commit range vs branch-diff vs path glob)~~ - RESOLVED: `branchRange` (`{from, to}`) for commit enumeration via bounded `git log`; branch enumeration is unconditional (`git branch --list`, not range-scoped, since a branch name has no commit-range-bounded identity) — see `sk_git_adapter.md` Section 3 "Branch Discovery Is Not Range-Scoped."
- ~~The sk-design known-deviation list's storage format~~ - RESOLVED: a Markdown doc with a fenced `json` block, the same shape phase 005's `sk_doc_known_deviations.md` uses (`sk_design_known_deviations.md` Section 6).
- ~~Whether the sk-git adapter should shell out to the actual `commit-msg` hook script for parity, or independently re-read its grammar~~ - RESOLVED: line-cited port, not a shell-out, because the hook's own body-required rule reads the *live* staging index (`git diff --cached`), which is meaningless for an already-made historical commit — shelling out naively would silently mis-score it. See `sk_git_adapter.md` Section 4.1 "Historical vs. Live File-Count Discrepancy."
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
