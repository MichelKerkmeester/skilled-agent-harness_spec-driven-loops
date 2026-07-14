---
title: "Implementation Plan: Phase 4: advisor-routing-update"
description: "Plan for updating sk-git's graph-metadata.json and the advisor's explicit-lane boosts so GitKraken-MCP-shaped prompts route to sk-git."
trigger_phrases:
  - "gitkraken advisor routing plan"
  - "phase 004 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/128-gitkraken-mcp-integration/004-advisor-routing-update"
    last_updated_at: "2026-07-10T06:21:30Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase plan ahead of implementation"
    next_safe_action: "Apply the graph-metadata.json and explicit.ts edits"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-advisor-routing-update"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: advisor-routing-update

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON graph metadata + TypeScript scorer lane (skill advisor) |
| **Framework** | Skill advisor 5-lane fusion scorer (`explicit_author`, `lexical`, `graph_causal`, `derived_generated`, `semantic_shadow`) |
| **Storage** | `sk-git/graph-metadata.json`; `mcp_server/lib/scorer/lanes/explicit.ts` |
| **Testing** | `vocabulary-agreement.vitest.ts`, `advisor_validate`, `advisor_recommend` smoke test |

### Overview
Two additive, minimal edits: extend sk-git's own graph metadata with GitKraken vocabulary (feeds `graph_causal`/`derived_generated`), and add one token boost plus one phrase boost to the advisor's curated explicit-author lane (highest-weight lane at 0.42 live) — matching the exact precedent already set for `git`/`github`/`chrome devtools`. Rebuild and validate the advisor index afterward.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Advisor lane architecture understood (`advisor_scorer.md` §2-7)
- [x] Existing boost precedent identified (`git`, `github`, `'chrome devtools'` in `explicit.ts`)

### Definition of Done
- [x] `graph-metadata.json` updated per REQ-001
- [x] `explicit.ts` boosts added per REQ-002/003
- [x] Vocabulary-agreement vitest still passes
- [x] `advisor_rebuild` + `advisor_validate` clean (advisor was already `live`/auto-fresh via the file watcher; no manual rebuild needed — see REQ-005 note in implementation-summary.md)
- [x] `advisor_recommend` smoke test routes a GitKraken-shaped prompt to sk-git
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-site additive vocabulary extension, matching the repo's existing dual-site routing pattern (graph metadata feeds passive/derived lanes; `explicit.ts` feeds the highest-weight curated lane).

### Key Components
- **`graph-metadata.json` `domains`/`intent_signals`/`derived.trigger_phrases`**: read by the skill graph compiler and the derived-generated lane.
- **`explicit.ts` `TOKEN_BOOSTS`/`PHRASE_BOOSTS`**: curated, hand-maintained high-confidence routing table; `sk-git` already has 6 entries (`branch`, `commit`, `git`, `github`, `pr` (shared with sk-code), `rebase`, `worktree`, `'pull request'` (shared with sk-code)).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

`explicit.ts` is shared across every skill's routing, not sk-git-local — any edit here has repo-wide blast radius even though the specific addition (`gitkraken` token, `'gitlens launchpad'` phrase) is scoped to sk-git only.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `explicit.ts` `TOKEN_BOOSTS`/`PHRASE_BOOSTS` | Curated explicit-author lane routing table for ALL skills | Additive: 2 new entries, 0 modified/removed | `git diff` shows only additions; `vocabulary-agreement.vitest.ts` still passes |
| `vocabulary-agreement.vitest.ts` | Cross-dialect vocab consistency guard | Read-only consumer; must still pass unmodified | Run the vitest suite after the edit |

Required inventories:
- Existing sk-git-related boost entries: `rg -n "sk-git" .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- Confirm no other skill already claims `gitkraken`/`gitlens` tokens: `rg -n "gitkraken\|gitlens" .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read `explicit.ts`'s `TOKEN_BOOSTS`/`PHRASE_BOOSTS` sections and confirm no existing `gitkraken`/`gitlens` claim (Four Laws: READ FIRST)

### Phase 2: Core Implementation
- [x] Update `sk-git/graph-metadata.json` `domains`, `intent_signals`, `derived.trigger_phrases` (REQ-001)
- [x] Add `TOKEN_BOOSTS.gitkraken` (REQ-002)
- [x] Add `PHRASE_BOOSTS['gitlens launchpad']` (REQ-003)

### Phase 3: Verification
- [x] Run the vocabulary-agreement vitest suite (REQ-004)
- [x] Confirm advisor freshness via `advisor_status` (already `live`, auto-refreshed by the file watcher — REQ-005)
- [x] Run an `advisor_recommend` smoke test with a GitKraken-shaped prompt
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Vocabulary agreement | Cross-dialect vocab sets | vitest |
| Advisor validation | Compiled routing corpus | `advisor_validate` |
| Routing smoke test | End-to-end recommendation | `advisor_recommend` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 reference doc + router entries | Internal | Green | `derived_generated` lane would have no doc to point at |
| Advisor daemon reachable for rebuild/validate | Internal | Unknown until run | Falls back to documenting the edit and flagging rebuild as a follow-up if the daemon is unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `vocabulary-agreement.vitest.ts` fails, or `advisor_validate` reports a new error, or the smoke test misroutes an unrelated skill.
- **Procedure**: Revert the two new `explicit.ts` entries and the `graph-metadata.json` additions via `git diff`/`git checkout -- <file>` (uncommitted); re-run the vitest suite to confirm the pre-existing baseline is restored.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
