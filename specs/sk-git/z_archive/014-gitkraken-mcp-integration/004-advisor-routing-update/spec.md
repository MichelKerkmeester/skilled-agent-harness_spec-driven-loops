---
title: "Feature Specification: Phase 4: advisor-routing-update"
description: "Update sk-git's graph-metadata.json domains/intent_signals/trigger_phrases and add a GitKraken explicit-lane phrase boost so the skill advisor routes GitKraken-MCP-shaped prompts to sk-git without the user naming the skill."
trigger_phrases:
  - "gitkraken advisor routing"
  - "sk-git graph metadata gitkraken"
  - "explicit lane gitkraken boost"
  - "phase 004 advisor-routing-update"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/014-gitkraken-mcp-integration/004-advisor-routing-update"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase spec ahead of implementation"
    next_safe_action: "Update graph-metadata.json, then add the explicit-lane boost"
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
    answered_questions:
      - "Advisor routing is NOT a separate hand-maintained vocab list — it's compiled from graph-metadata.json (domains/intent_signals/derived.trigger_phrases feed the graph_causal + derived_generated lanes) plus curated TOKEN_BOOSTS/PHRASE_BOOSTS in explicit.ts (the explicit_author lane, highest weight at 0.42 live) — both need updating for reliable routing"
      - "explicit.ts already has precedent single-token boosts for this exact pattern: git->sk-git 1.0, github->sk-git 0.95, 'chrome devtools'->mcp-chrome-devtools 1.0"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: advisor-routing-update

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-sk-git-integration-doc-and-router |
| **Successor** | 005-verify-and-rollout |
| **Handoff Criteria** | `graph-metadata.json` updated; `explicit.ts` boost added; the advisor's vocabulary-agreement vitest suite still passes (no vocab drift introduced) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Even with phase 003's doc and router in place, the skill advisor — the system that decides WHETHER to invoke sk-git at all before its own in-skill router ever runs — has no GitKraken vocabulary. Its routing corpus is compiled from `graph-metadata.json` plus a separate curated `explicit.ts` boost table, neither of which mentions GitKraken.

### Purpose
Extend both routing surfaces additively so GitKraken-MCP-shaped prompts (cross-platform PR/issue triage, GitLens AI workflows) route to sk-git automatically, and verify the change live against the real advisor — not just by editing config.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-git/graph-metadata.json`: `domains`, `intent_signals`, `derived.trigger_phrases`, `derived.key_topics`, `derived.intent_signals`, `derived.key_files`/`entities`/`source_docs`.
- `explicit.ts`: one new token boost, one new phrase boost — additive only.
- Live verification: vitest suites + real `advisor_recommend` smoke tests.

### Out of Scope
- Any other skill's routing data in `explicit.ts` — this is a shared file but only the two new GitKraken-specific entries are touched.
- The heavy repo-wide `advisor_validate` regression bundle — deferred to phase 005 as a terminal gate, not phase-004-specific.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/graph-metadata.json` | Modify | Add gitkraken/gitlens vocabulary, additive only |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modify | Add `gitkraken` token boost + `'gitlens launchpad'` phrase boost |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### REQ-001: Update `sk-git/graph-metadata.json`
Add to `domains`: `"gitkraken"`. Add to `intent_signals`: `"gitkraken"`, `"gitlens"`, `"cross-platform pr"`, `"multi-provider issue"`. These feed the `graph_causal` and `derived_generated` scorer lanes.

### REQ-002: Add an explicit-lane token boost
`TOKEN_BOOSTS.gitkraken = [['sk-git', 0.9]]` — one tier below `git`'s 1.0 (git is the strongest possible single-token signal for this skill; gitkraken is strong but slightly more specific/rare).

### REQ-003: Add an explicit-lane phrase boost
`PHRASE_BOOSTS['gitlens launchpad'] = [['sk-git', 0.85]]`, matching the existing `'chrome devtools'` precedent's weight tier for named-product phrases.

### REQ-004: Do not regress the vocabulary-agreement test suite
`explicit.ts` participates in `vocabulary-agreement.vitest.ts`'s cross-language dialect checks (family/edge-type/routing-class vocab, not token boosts directly — but the boost *format* — `[['<skill-id>', <weight>]]` — must match existing entries exactly, since `sk-git` must remain a recognized skill id everywhere it's asserted).

### REQ-005: Rebuild and validate the advisor index
Run `advisor_rebuild` (or the equivalent CLI) after the metadata edits so the compiled routing corpus reflects the new trigger phrases, then run `advisor_validate` to confirm no schema/consistency errors were introduced.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A GitKraken-cross-platform-shaped prompt routes to sk-git unambiguously with confidence ≥ 0.8, verified via a live `advisor_recommend` call, not just static config review.
- **SC-002**: Zero regression — the vocabulary-agreement suite, the scorer-eval baseline ratchet, and a plain `git commit` regression smoke test all behave exactly as before the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003's new reference doc | Without it, the `derived_generated` lane has no doc to point at | Phase 003 completed first |
| Risk | `explicit.ts` is shared across every skill's routing; a concurrent live session (packet 056, benchmark-validity remediation) was actively editing sibling files in the same `scorer/` directory during this phase | A bad edit or timing collision could corrupt routing for unrelated skills or contaminate a live benchmark | Checked `git status` on the scorer directory before editing — confirmed `explicit.ts` itself was clean and the live session's dirty files (`executor-delegation.ts`, deep-improvement grader cache) were a different subsystem; kept the edit to 2 purely additive lines; ran the full vitest/typecheck/ratchet suite afterward |
| Risk | Advisor daemon could be mid-repair (a `.pre-fix-a-b-backup` sqlite file was present from the concurrent session) | A manual `advisor_rebuild` against contended DB state could produce confusing results or interfere with the other session | Checked `advisor_status` first (read-only); it reported `freshness: "live"` already auto-refreshed by the file watcher, so no manual rebuild was attempted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:testing -->
## 8. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Vocabulary agreement | Cross-dialect vocab consistency | `vocabulary-agreement.vitest.ts` |
| Scorer-eval baseline ratchet | Routing regression | `scorer-eval-baseline-ratchet.vitest.ts` |
| Typecheck | `explicit.ts` compiles cleanly | `npm run typecheck` |
| Routing smoke test | GitKraken-shaped prompt routes to sk-git | `advisor_recommend` (live MCP tool) |
<!-- /ANCHOR:testing -->

---

## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: See `../003-sk-git-integration-doc-and-router/spec.md`
