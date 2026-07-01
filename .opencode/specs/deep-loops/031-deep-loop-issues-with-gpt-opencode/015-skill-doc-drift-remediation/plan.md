---
title: "Implementation Plan: Skill Documentation Drift Remediation"
description: "Fixes the 6 confirmed drift clusters from phase 014's audit across cli-opencode, 5 deep-loop SKILL.md docs, deep-improvement's scanner code+docs, and plugins/README.md."
trigger_phrases:
  - "implementation"
  - "plan"
  - "skill doc drift remediation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation"
    last_updated_at: "2026-07-01T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All clusters implemented and verified"
    next_safe_action: "None -- packet complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-015-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cluster 4: retire the .toml mirror check entirely (2-mirror model)."
      - "Cluster 6: keep orchestrate's row; narrow cli-opencode's wording instead."
---
# Implementation Plan: Skill Documentation Drift Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (SKILL.md, README.md, references/, assets/, manual_testing_playbook/), one CommonJS script (`scan-integration.cjs`) |
| **Framework** | `.opencode/skills/` skill-doc conventions; `deep-improvement`'s scanner tooling |
| **Storage** | N/A (static doc/config edits) |
| **Testing** | Scoped grep re-scans per cluster; `deep-improvement`'s existing vitest suite for the code change; `validate.sh --strict` per touched phase folder |

### Overview
Patches every confirmed finding from phase 014's audit to match current runtime reality: removes stale direct-`ai-council`-invoke guidance from `cli-opencode`, removes the retired `.opencode/agents/*.toml` mirror requirement from 5 SKILL.md docs and `deep-improvement`'s scanner (code + 6 docs), adds the missing `mk-deep-loop-guard.js` entry to `plugins/README.md`, and resolves the orchestrate/cli-opencode routing tension per a dedicated investigation. No new features — purely bringing docs (and one scanner's hardcoded template list) into agreement with already-shipped, already-verified packet-031 behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 014's 20-iteration audit complete and independently verified (zero fabrications).
- [x] Operator decision recorded for Cluster 4 (retire the TOML check).
- [x] Cluster 6 investigation complete with an operator-confirmed direction.

### Definition of Done
- [x] All 5 non-blocked clusters patched and re-grepped clean.
- [x] Cluster 6 patched per its investigation's confirmed direction.
- [x] `deep-improvement` vitest suite still passes after the scanner code edit.
- [x] `validate.sh --strict` passes for this phase folder and any touched spec-kit phase folders.
<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct, scoped text edits per cluster — no new abstractions, no refactors beyond what each finding names. Each cluster is patched independently and re-verified with its own scoped grep before moving to the next, so a mistake in one cluster doesn't block or contaminate the others.

### Key Components
- **cli-opencode docs** (Cluster 1): `SKILL.md`, `README.md`, `assets/prompt_templates.md`, `manual_testing_playbook.md`, `04--agent-routing/multi-ai-council-multi-strategy.md`.
- **Deep-loop SKILL.md docs** (Clusters 2/3): `deep-research`, `deep-review` (+`loop_protocol.md`), `deep-context`, `deep-loop-runtime`, `deep-ai-council` (+`output_schema.md`).
- **deep-improvement scanner** (Cluster 4): `scan-integration.cjs` (code) + 6 supporting docs.
- **plugins/README.md** (Cluster 5): entrypoint count/table.
- **orchestrate.md / cli-opencode/SKILL.md** (Cluster 6): resolved -- cli-opencode's wording narrowed, orchestrate.md untouched.

### Data Flow
1. Re-confirm current file:line for each citation (files may have shifted slightly since phase 014's audit ran).
2. Edit the doc/code to reflect current reality (no direct-invoke `ai-council`; no `.toml` mirror; correct plugin count; Cluster-6 resolution).
3. Scoped grep re-scan per cluster to confirm zero remaining stale references (excluding intentional historical quotes).
4. Run `deep-improvement`'s vitest suite after the Cluster 4 code edit.
5. Regenerate `description.json`/`graph-metadata.json`, run `validate.sh --strict`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase scaffolded, decisions recorded
- [x] Cluster 6 investigation launched

### Phase 2: Implementation
- [x] Cluster 1: cli-opencode direct-invoke fixes
- [x] Clusters 2/3/4: `.toml` mirror removal (docs + code)
- [x] Cluster 5: plugins/README.md entrypoint fix
- [x] Cluster 6: orchestrate/cli-opencode routing fix (per investigation)

### Phase 3: Verification
- [x] Scoped grep re-scans per cluster
- [x] `deep-improvement` vitest suite
- [x] `validate.sh --strict`
- [x] Commit + push

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Scoped grep re-scan | Each cluster's target strings, post-edit | `rg` |
| Regression | `deep-improvement`'s scanner-related vitest suite | `npx vitest run` |
| Spec-kit validation | This phase + any touched phase folders | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 014's audit findings | Internal | Green (complete, verified) | Would need to re-derive scope from scratch |
| Cluster 6 routing investigation | Internal | Green (resolved) | N/A -- resolved, all clusters complete |
| `deep-improvement` vitest suite | Internal | Green | Would need manual inspection instead of automated regression check |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scoped grep re-scan still finds stale references after an edit, or `deep-improvement`'s vitest suite fails after the scanner code change.
- **Procedure**: `git diff`/`git checkout` the specific affected file(s) individually — each cluster's edits are independent, so no cluster's rollback affects another's.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + Cluster 6 investigation) ──> Phase 2 (Implementation: Clusters 1,2/3/4,5 in parallel; Cluster 6 after its investigation) ──> Phase 3 (Verify + commit)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation (Clusters 1,2/3/4,5) | Setup | Verify |
| Implementation (Cluster 6) | Cluster 6 investigation | Verify |
| Verify | All Implementation clusters | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~10 minutes |
| Implementation (5 clusters, ~20 files) | Medium | ~40-60 minutes |
| Verify (grep re-scans, vitest, validate.sh, commit) | Low-Medium | ~15-20 minutes |
| **Total** | | **~1-1.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production runtime-agent behavior changed (docs + one scanner script only)
- [x] Each cluster's edits are file-independent, allowing per-cluster rollback
- [x] `deep-improvement` has an existing vitest suite to catch a bad scanner-code edit

### Rollback Procedure
1. **Immediate**: If a specific cluster's edit is wrong, `git diff <file>` to inspect, then `git checkout -- <file>` to revert just that file.
2. **Revert code**: For the `scan-integration.cjs` change specifically, re-run its vitest suite before and after to bound the blast radius to that one file.
3. **Verify**: Re-run the scoped grep for the affected cluster after any rollback to confirm the original stale state (or lack thereof) is restored as expected.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — no data, only doc/code text.

<!-- /ANCHOR:enhanced-rollback -->
