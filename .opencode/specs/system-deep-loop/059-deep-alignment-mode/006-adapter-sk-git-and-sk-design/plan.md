---
title: "Implementation Plan: Phase 6: adapter-sk-git-and-sk-design"
description: "Plan the sk-git deterministic conformance adapter and the sk-design v1 static audit-rubric adapter for deep-alignment, both implementing the phase-005 discover/standardSource/check contract. The approach is documentation-first: name real rule sources, bound the sk-design v1 static scope, and define known-deviation list ownership before any code is written."
trigger_phrases:
  - "phase 006 implementation plan"
  - "sk-git conformance adapter plan"
  - "sk-design audit adapter plan"
  - "adapter contract sk-git sk-design"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/006-adapter-sk-git-and-sk-design"
    last_updated_at: "2026-07-11T14:51:52Z"
    last_updated_by: "claude"
    recent_action: "Executed Phase 2-3: built and dry-verified both adapters"
    next_safe_action: "Hand off to phase 007 sk-code adapter build"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_git_adapter.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_adapter.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 005 contract signature confirmed compatible: both new adapters export discover/standardSource/check matching sk-doc.cjs's exact shape"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: adapter-sk-git-and-sk-design

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/CJS (matching `system-deep-loop/runtime/scripts/*.cjs`), Markdown planning docs |
| **Framework** | `deep-alignment` mode-packet (planned, not yet scaffolded) over the `system-deep-loop` runtime |
| **Storage** | None in this phase - future adapters read git history and repo files, write no state of their own (loop state lives in the bound spec folder's `alignment/` subdir, owned by phase 008) |
| **Testing** | None runnable in this phase - future adapter unit tests plan named for phase 007/008 build-out |

### Overview
This phase plans, not builds, two `deep-alignment` authority adapters against the phase-005 `{discover, standardSource, check}` contract: a deterministic sk-git adapter over conventional-commit and branch-naming conformance, and a v1 static-only sk-design adapter over `DESIGN.md`/token conformance. The plan is documentation-first - every rule source is named by real path so a future implementer writes `check()` logic against confirmed sk-git/sk-design contracts instead of re-deriving them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 005's adapter contract shape is stated (even if not yet built) and this phase's two adapter plans match its signature. Evidence: `sk-git.cjs`/`sk-design.cjs` both export `{discover, standardSource, check, ...}`, matching `sk-doc.cjs`'s exact module shape (`module.exports` block in each file).
- [x] sk-git's commit-message grammar and branch-naming rule are cited by real path and line range. Evidence: `.opencode/skills/sk-git/SKILL.md:310-457` (grammar), `:298` (branch naming), `:319-326` (exemption list) — re-verified by direct Read, cited in `sk_git_adapter.md` Section 1 and `sk-git.cjs`'s `standardSource()`.
- [x] sk-design's v1 static boundary (no live-render) is explicit in both `spec.md` and this plan. Evidence: `sk_design_adapter.md` Section 1 "Static-Only v1 Boundary — HARD SCOPE LIMIT"; `sk-design.cjs`'s `standardSource()` returns `scopeBoundary: 'static-only-v1'`.

### Definition of Done
- [x] Both adapter plans name `discover()`, `standardSource()`, and `check()` behavior concretely enough to code from. Superseded: both are coded and dry-verified, not merely named.
- [x] Both adapter plans name their known-deviation list location. Evidence: `sk_git_known_deviations.md`, `sk_design_known_deviations.md`, both under `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/`, both parsed live by each adapter's `loadKnownDeviations()`.
- [x] `checklist.md` items are reviewed and either checked with evidence or explicitly deferred. See `checklist.md` for the item-by-item evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pluggable adapter, per the design brief's locked contract: `{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }`. Each authority gets one adapter implementing this contract; the deep-alignment engine (phase 008) is authority-agnostic and calls whichever adapter a lane resolves to.

### Key Components
- **sk-git adapter `discover()`**: resolves a lane's scope (commit range, branch diff, or path glob - exact grammar TBD, see Open Questions) into a list of commit/branch artifacts.
- **sk-git adapter `standardSource()`**: reads `.opencode/skills/sk-git/SKILL.md` §"Commit Message Logic" (lines 309-457) for the type/scope/summary grammar and line 298 for the `wt/{NNNN}-{name}` branch-naming rule; also reads `.opencode/scripts/git-hooks/commit-msg` so the adapter's grammar stays in parity with the live enforcement hook rather than forking a second copy.
- **sk-git adapter `check()`**: flags conventional-commit violations (missing type/scope, vague summary, oversized subject) and branch-naming violations, while honoring the "Classify Special Git Messages" exemption list (`Merge `, `Revert "`, `fixup! `, `squash! `, `amend! ` prefixes, lines 319-326).
- **sk-design adapter `discover()`**: resolves a lane's scope into `DESIGN.md` / `tokens.json` artifact paths (v1 static-only; no live URL crawling — the live-render dimension is ADR-009's LOCKED peer phase 010, not this adapter).
- **sk-design adapter `standardSource()`**: reads `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md` for structural conformance, `.opencode/skills/sk-design/shared/design_token_vocabulary.md` for token vocabulary, and `.opencode/skills/sk-design/design-audit/references/audit_contract.md` plus `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` for anti-default/audit dimensions.
- **sk-design adapter `check()`**: flags structural and token nonconformance against the sources above; every finding cites the specific dimension violated rather than a bare critique.

### Data Flow
A lane resolved to `authority=sk-git` or `authority=sk-design` calls that authority's `discover(scope)` to enumerate artifacts, then `standardSource(authority)` to load the rule set once per lane, then `check(artifact, rules)` per artifact to emit findings. Findings flow into the phase-008 alignment-report reducer; no adapter here writes report state directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the fix-bug sense - this phase plans net-new adapters and modifies no existing runtime behavior. Recorded for template completeness:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/sk-git/SKILL.md` | Owns the live conventional-commit grammar and branch-naming rule | Read-only source for the adapter's `standardSource()`; not modified | Cited by path/line above |
| `.opencode/skills/sk-design/design-audit/`, `design-md-generator/` | Own the live audit rubric and DESIGN.md format contract | Read-only source for the adapter's `standardSource()`; not modified | Cited by path above |

Required inventories:
- Same-class producers: not applicable - no existing adapter code exists yet to inventory against.
- Consumers of changed symbols: not applicable - no symbols change in this phase.
- Matrix axes: authority (sk-git, sk-design) x lifecycle stage (discover, standardSource, check) = 6 planned behaviors, all named above.
- Algorithm invariant: not applicable - no parser/resolver/security code ships in this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 005's adapter contract signature is available (or use the design brief's locked contract if 005 has not yet landed). Evidence: `sk-doc.cjs` read in full; both new adapters copy its exact module shape.
- [x] Re-read `.opencode/skills/sk-git/SKILL.md` §"Commit Message Logic" and confirm the type/scope/summary grammar has not changed since this plan was authored. Evidence: re-read 2026-07-11, grammar at lines 310-457 confirmed current, cross-checked against `.opencode/scripts/git-hooks/commit-msg`'s live regex.
- [x] Re-read `.opencode/skills/sk-design/design-audit/references/audit_contract.md` and `design-md-generator/references/design_md_format.md` and confirm the v1 static rule set is unchanged. Evidence: both re-read 2026-07-11 in full; `accessibility_performance.md` and `anti_patterns_production.md` also read (not originally named here, added as additional real static rubric inputs).

### Phase 2: Core Implementation
- [x] Implement the sk-git adapter's `discover()`, `standardSource()`, and `check()` per the Architecture section above. Evidence: `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs`, `node --check` clean.
- [x] Implement the sk-design adapter's `discover()`, `standardSource()`, and `check()` per the Architecture section above, enforcing the v1 static-only boundary. Evidence: `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs`, `node --check` clean, `scopeBoundary: 'static-only-v1'` in `standardSource()` output.
- [x] Author each adapter's known-deviation/accepted-convention list (per-authority per ADR-005; default to an authority-local JSON/Markdown file colocated with the adapter, format settled at build time). Evidence: `sk_git_known_deviations.md` (4 entries), `sk_design_known_deviations.md` (3 entries), both Markdown-with-fenced-json, matching phase 005's `sk_doc_known_deviations.md` shape.
- [x] Wire each adapter's VERIFY-FIRST re-probe: re-run `git log`/`git show` for sk-git findings, re-read the current `DESIGN.md`/`tokens.json` for sk-design findings, immediately before a finding is written. Evidence: `sk-git.cjs`'s `checkCommit()`/`checkBranch()` open with a live existence re-confirmation before reading any content; `sk-design.cjs`'s `checkDesignDoc()` reads file content fresh on every call (no discover-time cache exists to go stale).

### Phase 3: Verification
- [x] Dry-run the sk-git adapter against a known commit range and confirm it does not flag exempt Git-generated subjects. Evidence: `node sk-git.cjs discover HEAD~15 HEAD` enumerated real commits; `isExemptSubject("Merge remote-tracking branch origin/main")` returns `true`; `check --commit fd9fc599be...` (a real pre-hook legacy-scope commit) correctly suppressed to `[]`.
- [x] Dry-run the sk-design adapter against a repo `DESIGN.md` and confirm findings cite a real rubric dimension, not a generic critique. Evidence: all 4 real example `DESIGN.md` fixtures pass clean after two real bugs found via this exact dry-run were fixed (see `sk_design_adapter.md` Section 7); `checkAuditRubric()` unit-verified to reject an uncited finding and accept a cited one.
- [x] Confirm both adapters return the documented "empty scope" result instead of erroring on zero artifacts. Evidence: `sk-git.cjs discover({type:'paths', ...})` (off-label scope for this authority) returns `{artifacts:[], nodes:[]}`; `sk-design.cjs discover({type:'branchRange', ...})` (off-label scope) returns the same empty shape.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Status |
|-----------|-------|-------|--------|
| Unit | `discover()`/`check()` per adapter | vitest (matching `system-deep-loop/deep-review/scripts/tests/` convention) | **Not built.** No committed vitest suite exists for either adapter — an accepted, named limitation, not a silent gap. This phase's scope lock (`spec.md` Files to Change) names exactly 6 files, none of them a test file; extensive manual/CLI dry-run verification substitutes for it in this phase (see Manual row). A future phase adding a vitest suite can lift the exact fixture cases already exercised below directly. |
| Integration | Adapter output feeding the phase-008 alignment-report reducer | Manual dry-run against a real commit range and a real `DESIGN.md` | **Not applicable yet** — the phase-008 reducer does not exist. Both adapters' output shape was verified structurally against `discover_contract.md` §4 instead. |
| Manual | Known-deviation suppression behaves as documented | Review adapter output against a deliberately non-conventional but exempted commit | **Done.** `check --commit fd9fc599be...` (real, pre-hook-installation, legacy packet-path scope) correctly suppressed to `[]`; `check --branch work/021-graph-preservation` and 8 real `work/opencode/*` branches correctly exempt. Plus 2 real bugs found and fixed via this same dry-run discipline — see `sk_git_adapter.md` Section 4.2 and `sk_design_adapter.md` Section 7. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 adapter contract | Internal | Planned in parallel | If the signature shifts, both adapter plans need reconciliation before build; low risk since the contract is design-brief-locked. |
| `.opencode/skills/sk-git/SKILL.md` commit-message grammar | Internal | Stable, live | If the grammar changes, `standardSource()` must be re-read before implementation. |
| `.opencode/skills/sk-design/design-audit/` and `design-md-generator/` rule sources | Internal | Stable, live | If the rubric changes, `standardSource()` must be re-read before implementation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future build finds the phase-005 adapter contract signature is incompatible with the plan here, or sk-git/sk-design rule sources have materially changed.
- **Procedure**: Re-open this phase's plan, re-cite the current rule sources, and update `spec.md`/`plan.md` before resuming implementation; do not silently code around a stale plan.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (n/a) ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 005 contract available | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 007 (sk-code adapter, independent authority but same contract precedent) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Re-read 2-3 reference files |
| Core Implementation | Medium | Two adapters x 3 contract methods each |
| Verification | Low | Dry-run against real commit range + real DESIGN.md |
| **Total** | | **Medium (bounded by two well-sourced adapters)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migrations - adapters are read-only in v1.
- [ ] Known-deviation list format agreed before first `check()` run ships.

### Rollback Procedure
1. Disable the affected adapter's lane resolution (a lane scoped to that authority simply cannot run) rather than shipping a broken `check()`.
2. Revert the adapter code via normal version control.
3. Re-verify against the dry-run cases in Testing Strategy before re-enabling.
4. No user-facing notification needed - this is an internal deep-loop mode, not a shipped user surface, in v1.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
