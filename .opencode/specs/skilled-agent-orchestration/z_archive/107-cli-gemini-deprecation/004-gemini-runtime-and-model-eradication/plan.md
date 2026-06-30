---
title: "Implementation Plan: Eradicate Gemini as a host runtime and as a model everywhere outside specs"
description: "Plan for removing every Gemini host-runtime and Gemini-model reference from active source, tests, manifests, catalogs, playbooks, docs, and changelogs in four verified waves, while preserving specs and the external Gemini-CLI binary state."
trigger_phrases:
  - "gemini runtime eradication plan"
  - "gemini deprecation phase 4 plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication"
    last_updated_at: "2026-06-08T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 3 plan for Gemini runtime+model eradication"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/**"
      - ".opencode/skills/system-skill-advisor/**"
      - ".opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:54874e70037e22b07f908683893e7b12113d67379b1b50182a2103cde3a4e431"
      session_id: "gemini-deprecation-phase4-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Eradicate Gemini runtime + model refs outside specs in four waves."
      - "Rewrite comparison content, defer 2 files to a concurrent session."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Eradicate Gemini as a host runtime and as a model everywhere outside specs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript (CJS/MJS), Python, JSON, YAML, Markdown, Shell |
| **Framework** | OpenCode skill and command repository, MCP servers |
| **Storage** | No application storage changes |
| **Testing** | Targeted Vitest suites (hooks, runtime-detection, fallback-router, remediation, spec-kit scripts, extractors, promote), `bash -n`, `rg` exact search, JSON parse |

### Overview

Remove Gemini from every active host-runtime surface (hook subsystems in two skills, `RuntimeId` unions and detection in system-spec-kit and system-code-graph, runtime fixtures, cross-runtime fallback, hook re-export parity, the `GEMINI.md` doc convention) and every Gemini-model surface (`gemini-flash` in the deep-loop fallback router, sk-prompt budgets/profiles, cli-devin quota-fallback), plus the system-skill-advisor runtime-VALUE tuple, the spec-kit script/extractor surfaces, ~87 docs, and 43+ release-history changelogs. Work proceeds in four waves: architectural core, code/runtime-value, documentation, and changelogs. Rewrite comparison/example content rather than delete it; defer two system-skill-advisor files to a concurrent `devin`-removal session; preserve the external Gemini-CLI binary state in the user home.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: Gemini runtime + model surfaces remained after phase 003 deferred them.
- [x] Success criteria measurable via global `rg` exclusion, named test counts, and count self-checks.
- [x] Dependencies identified: runtime enums, hook indexes, runtime-value tuple, count self-checks, concurrent same-skill session.

### Definition of Done
- [x] Gemini removed from all runtime enums and hook subsystems deleted in both skills.
- [x] Gemini removed from the system-skill-advisor runtime-VALUE tuple and its consumers.
- [x] `gemini-flash` removed from all active model references.
- [x] Comparison content rewritten; 2 files deferred to the concurrent session.
- [x] Release-history changelogs edited and counts reconciled per operator direction.
- [x] Targeted suites GREEN; `rg "gemini"` excluding specs returns only the 2 deferred files.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Cross-skill runtime + model eradication in four waves with exact-token inventory, delete-vs-rewrite classification, runtime-union narrowing, runtime-value tuple cleanup, count-self-check reconciliation, and targeted regression verification, coordinated with a concurrent same-skill session.

### Key Components
- **Runtime detection + hooks (Wave 1)**: system-spec-kit `mcp_server` (`hooks/gemini/` deleted, `lib/runtime-detection.ts` `RuntimeId`, `hooks/index.ts`, `hooks/README.md`, fixtures, 5 suites); system-code-graph `mcp_server/lib/runtime-detection.ts` + test; system-skill-advisor `hooks/gemini/` + test + 2 docs + catalog/playbook de-index; model refs (`gemini-flash`) in deep-loop fallback router, sk-prompt budgets/profiles, cli-devin quota-fallback.
- **Runtime-VALUE + scripts (Wave 2)**: system-skill-advisor `advisor-runtime-values.ts` tuple, `metrics.ts`, tool schemas, plugin bridge, `skill_advisor.py`, parity/observability/plugin-bridge tests, bench; system-spec-kit `cli-capture-shared.ts`, `gate-3-classifier.ts` (docs-comment only), `source-capabilities.ts`, `input-normalizer.ts`, `extract-from-evidence.cjs`, + 3 test files; deep-loop-runtime `executor-config.ts` comment + SKILL.md + feature_catalog; deep-improvement `promote-candidate.cjs`; sk-doc `validate-doc-model-refs.js`; `session-cleanup.js` plugin; cli-devin budgets.
- **Documentation (Wave 3)**: 4 deleted Gemini-runtime docs + de-index + count self-checks; 14 system-spec-kit top-level/refs/guides; 29 cli-* skill files including the `claude_tools.md` rewrite; 17 misc docs + 3 shell scripts.
- **Changelogs (Wave 4)**: 43 changelog files across 10 components + top-level `PUBLIC_RELEASE.md`, reconciling runtime/mirror counts.

### Data Flow

After the eradication, no active runtime detection resolves Gemini, no hook subsystem registers Gemini, no runtime-value tuple lists Gemini, no model reference names `gemini-flash`, and no doc or changelog advertises Gemini, outside `specs/**` and the two documented deferred files. The external Gemini-CLI binary state in the user home is untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-spec-kit/mcp_server/hooks/gemini/` | Gemini hook subsystem | Delete | hooks suite 59 (1 pre-existing copilot skip), tsc clean. |
| `system-spec-kit/mcp_server/lib/runtime-detection.ts` | `RuntimeId` union + detection | Modify | `runtime-detection` + `cross-runtime-fallback` suites. |
| `system-spec-kit/mcp_server/hooks/index.ts` + README + fixtures | Hook re-export + provenance + fixtures | Modify | `hooks-reexport-parity`, `hooks-shared-provenance`, `hook-session-start`. |
| `system-code-graph/mcp_server/lib/runtime-detection.ts` | Runtime enum | Modify | 14/14 GREEN. |
| `system-skill-advisor/hooks/gemini/` + test + 2 docs | Gemini hook subsystem + docs | Delete + de-index | feature_catalog 37 to 36, playbook 46 to 45; enforcing vitest GREEN. |
| `system-skill-advisor/.../advisor-runtime-values.ts` (+ metrics/schemas/bridge/py) | Canonical runtime-value tuple | Modify | runtime-parity, advisor-observability, plugin-bridge GREEN. |
| `deep-loop-runtime/.../fallback-router` + test | `gemini-flash` model fallback | Modify | fallback-router 8/8. |
| `sk-prompt-models/.../model-profiles.json` + `per-model-budgets.json` + refs | `gemini-flash` model profile | Modify | global `rg` clean. |
| `system-spec-kit/shared/gate-3-classifier.ts` | `GEMINI.md` docs-comment token | Modify (comment only) | No Gate-3 classification change; spec-kit scripts 8/8. |
| `system-spec-kit/scripts/**` + extractors | Capture/source/normalize/extract | Modify | spec-kit scripts 8/8 + 267/267 extractors. |
| 4 Gemini-runtime docs + count self-checks | Catalog/playbook docs | Delete + recount | playbook 391 to 387, catalog 325 to 324; self-check 387==387. |
| `cli-claude-code/references/claude_tools.md` | 3-way comparison | Rewrite to 2-way | doc reads as Claude-vs-Codex; `rg` clean. |
| `.opencode/scripts/orphan-mcp-sweeper.sh` (+ 2 shell scripts) | Session-tree pgrep + operator-preserve case | Modify | `bash -n` OK. |
| `.opencode/changelog/**` + `PUBLIC_RELEASE.md` | Release history + counts | Modify (43 + 1) | global `rg` exclusion clean; counts reconciled. |

Required inventories:
- `rg "gemini"` excluding `specs/**` for the global eradication footprint.
- `rg "gemini-cli|RuntimeId"` across `mcp_server/lib` + `hooks` for the runtime-detection footprint.
- `rg "gemini-flash"` for the model footprint.
- Catalog/playbook count self-checks before/after de-index (37 to 36, 46 to 45, 391 to 387, 325 to 324).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory every Gemini runtime + model reference outside `specs/**`.
- [x] Classify each artifact as delete (pure-Gemini), modify (mixed surface), or rewrite (comparison content).
- [x] Note the concurrent `devin`-removal session and the two files to defer to it.

### Phase 2: Core Implementation
- [x] Wave 1 (architectural core): delete `hooks/gemini/` in 2 skills; remove `gemini-cli` from runtime enums + detection; update hook index/README/fixtures + 5 suites; code-graph runtime enum + test; de-index advisor catalog/playbook; remove `gemini-flash` model refs.
- [x] Wave 2 (code/runtime-value): remove Gemini from the advisor runtime-VALUE tuple + consumers + tests + bench; spec-kit script/extractor surfaces + tests; misc code (deep-loop comment, deep-improvement, sk-doc, session-cleanup plugin, cli-devin).
- [x] Wave 3 (documentation): delete 4 Gemini-runtime docs + recount; 14 top-level/refs/guides; 29 cli-* files incl. the `claude_tools.md` rewrite; 17 misc docs + 3 shell scripts.
- [x] Wave 4 (changelogs): edit 43 changelog files + `PUBLIC_RELEASE.md`; reconcile runtime/mirror counts.

### Phase 3: Verification
- [x] Run all touched suites (hooks 59, code-graph 14, fallback-router 8, remediation 25, spec-kit scripts 8 + 267 extractors, promote 3).
- [x] Confirm count self-checks (playbook 387==387, catalog 324, advisor 36/45).
- [x] Run `bash -n` on 3 shell scripts; parse matrix/JSON.
- [x] Run global `rg "gemini"` excluding `specs/**`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Active Gemini runtime + model references | `rg`, `glob` |
| Unit | hooks, runtime-detection, fallback-router, remediation, spec-kit scripts, extractors, promote | `npx vitest run ...` |
| Syntax | 3 shell scripts | `bash -n` |
| Syntax | Matrix / JSON manifests | `python3 -m json.tool` |
| Behavioral | `gate-3-classifier.ts` neutrality | Confirm Gemini token was docs-comment only; no classification change |
| Inventory close | Global eradication proof | `rg "gemini"` excluding specs (only 2 deferred files) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval for "no Gemini anywhere" + changelog edits | Requirement | Green | Already answered: eradicate everything except `specs/**`. |
| Concurrent `devin`-removal session in system-skill-advisor | Coordination | Green | Coordinate-not-thrash: defer 2 files; merge tuple cleanly. |
| External Gemini-CLI binary state in user home | Boundary | Green | Leave `~/.gemini` and `.geminiignore` intact. |
| Count self-checks in catalog/playbook | Build artifact | Yellow | Reconcile 37 to 36, 46 to 45, 391 to 387, 325 to 324, 387==387. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A targeted suite fails in a way that cannot be repaired safely in scope, a count self-check cannot be reconciled, or a deleted hook subsystem breaks runtime detection irrecoverably.
- **Procedure**: Revert this phase's edits and restore the deleted `hooks/gemini/` subsystems, 4 deleted docs, and runtime-enum members from git. Do not partially recreate Gemini runtime wiring as a shim.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory -> Classify delete/modify/rewrite -> Wave 1 arch core -> Wave 2 code/value -> Wave 3 docs -> Wave 4 changelogs -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Clarified scope | All waves |
| Classify | Inventory | Wave 1 |
| Wave 1 (arch core) | Classify | Wave 2 |
| Wave 2 (code/value) | Wave 1 | Wave 3 |
| Wave 3 (docs) | Wave 2 | Wave 4 |
| Wave 4 (changelogs) | Wave 3 | Verification |
| Verification | All waves | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 45-60 minutes |
| Core Implementation (4 waves) | High | 6-9 hours |
| Verification | Medium | 1.5-2 hours |
| **Total** | | **8-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Record the inventory of Gemini runtime + model references before edits.
- [x] Keep all edits in the working tree for diff review before any commit.
- [x] Run all touched suites, count self-checks, `bash -n`, and global search before claiming completion.

### Rollback Procedure
1. Restore the deleted `hooks/gemini/` subsystems, 4 deleted docs, and runtime-enum members plus all edited files from git if the eradication is cancelled.
2. Re-run the global search to confirm references return only when rollback is intended.
3. Re-run the touched suites and count self-checks for the restored state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git-level file restoration only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Scope clarification
  -> inventory and delete/modify/rewrite classification
  -> Wave 1 architectural core (enums, hooks, fixtures, model refs)
  -> Wave 2 runtime-value + scripts
  -> Wave 3 documentation + count reconciliation
  -> Wave 4 changelogs + count reconciliation
  -> verification and closeout
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Scope clarification | Operator answers | Bound eradication rules | All work |
| Inventory | Scope clarification | Reference list | Waves |
| Wave 1 arch core | Inventory | Narrowed enums / deleted hooks | Wave 2 |
| Wave 2 code/value | Wave 1 | Clean runtime-value tuple | Wave 3 |
| Wave 3 docs | Wave 2 | Clean docs + recount | Wave 4 |
| Wave 4 changelogs | Wave 3 | Clean history + counts | Verification |
| Verification | All waves | Evidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory Gemini runtime + model references and classify delete/modify/rewrite** - CRITICAL.
2. **Wave 1: delete hook subsystems and narrow runtime enums; Wave 2: clean the runtime-value tuple** - CRITICAL.
3. **Run all touched suites, count self-checks, `bash -n`, and global search** - CRITICAL.

**Total Critical Path**: 3 implementation stages over 4 waves.

**Parallel Opportunities**:
- Wave 3 docs and Wave 4 changelogs are separable from Wave 1/2 source edits but were authored in a tight sequence for count consistency.
- The concurrent `devin`-removal session ran in parallel on the same skill; the two deferred files were left to it.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventory complete | All Gemini runtime + model refs classified delete/modify/rewrite | Planning |
| M2 | Architectural core clean | Enums narrowed, hooks deleted, suites GREEN | Wave 1-2 |
| M3 | Repo clean | Global `rg` returns only 2 deferred files; counts reconciled | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Eradicate Gemini as a host runtime entirely

**Status**: Accepted

**Context**: After the executor purge, Gemini still existed as a host runtime: `gemini-cli` in every `RuntimeId` union and detection, `hooks/gemini/**` subsystems in two skills, and the `GEMINI.md` root-doc convention.

**Decision**: Remove `gemini-cli` from all runtime-detection enums, delete the `hooks/gemini/` subsystems in both skills, and drop the `GEMINI.md` doc convention, per the operator's "everything" direction.

**Consequences**:
- Runtime detection and hooks no longer know Gemini as a host.
- A larger blast radius than the executor purge, mitigated by targeted suites and a coordinated concurrent session.

**Alternatives Rejected**:
- Leave the runtime surface deferred: rejected because the operator directed "no Gemini anywhere" outside `specs/**`.

### ADR-002: Swap or rewrite, not gut, for comparison/example content

**Status**: Accepted

**Context**: Some docs compared Claude vs Gemini vs Codex or used Gemini as a sample. Deleting them would lose instructional value.

**Decision**: Rewrite `cli-claude-code/references/claude_tools.md` from a 3-way comparison to a 2-way Claude-vs-Codex comparison, and swap the dashboard sample Gemini to Codex, instead of deleting the content.

**Consequences**:
- Comparison docs stay coherent and useful with one fewer column.
- Slightly more authoring effort than a delete.

**Alternatives Rejected**:
- Delete the comparison pages outright: rejected because it loses the surviving-tool comparison value.

### ADR-003: Coordinate-not-thrash with the concurrent devin-removal session

**Status**: Accepted

**Context**: A concurrent session was independently removing `devin` from `system-skill-advisor`, touching the same runtime-value tuple and hook files.

**Decision**: Merge the Gemini removal cleanly into the shared tuple, and defer two files to that session: the negative-assertion parity test and the historical decisions doc.

**Consequences**:
- The merged result has Gemini fully gone from the tuple/hooks.
- Two files are owned by the concurrent session to avoid edit thrash.

**Alternatives Rejected**:
- Edit all advisor files unilaterally: rejected to avoid clobbering the concurrent session's in-flight `devin` removal.
