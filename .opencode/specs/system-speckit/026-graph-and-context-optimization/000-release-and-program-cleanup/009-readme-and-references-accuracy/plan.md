---
title: "Implementation Plan: README & References Accuracy Audit + Remediation"
description: "Three-stage parallel workflow — 10 read-only gpt-5.5-fast audits over the user-facing command READMEs + system-spec-kit references/assets (159 raw findings), 10 adversarial verifiers against the real filesystem (144 confirmed / 13 rejected), and 10 partitioned edit agents applying 142 fixes across 61 files with 0 skipped. Five dominant themes remediated; four highest-risk clusters spot-verified against live source."
trigger_phrases:
  - "readme accuracy plan"
  - "audit verify remediate workflow"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-readme-and-references-accuracy"
    last_updated_at: "2026-06-03T07:32:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified 159 findings (144 confirmed / 13 rejected); applied 142 fixes across 61 files"
    next_safe_action: "Generate metadata, validate --strict, reconcile completion"
    blockers: []
    key_files:
      - ".opencode/install_guides"
      - ".opencode/skills/system-spec-kit/references"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-references-accuracy-session"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Plan: README & References Accuracy Audit + Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Documentation (user-facing command READMEs + `system-spec-kit` references/assets) |
| **Executor** | `opencode run --model openai/gpt-5.5-fast --variant high` (read-only audit + verify); edit agents for remediation |
| **Parallelism** | 10 workflows per stage, partitioned by 10 disjoint areas |
| **Ground truth** | `opencode.json`, `validator-registry.json`, `spec-kit-docs.json`, `recommend-level.sh`, embeddings `registry.ts` |

### Overview
A three-stage parallel pipeline. AUDIT runs 10 read-only gpt-5.5-fast passes over ~33 user-facing command READMEs + 41 references + 4 assets, producing 159 raw findings. VERIFY runs 10 adversarial passes re-checking each finding against the real local filesystem — confirming 144 and rejecting 13 (almost entirely the `dist` build-artifact false-positive class plus a `.mcp.json` analogue). REMEDIATE runs 10 partitioned edit agents (same 10 areas, disjoint files) applying the 144 confirmed fixes: 142 fixes across 61 files, grepClean, 0 skipped.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope fixed: user-facing command READMEs + system-spec-kit references/assets (exclude ~250 nested stubs)
- [x] Canonical sources of truth identified for verification + remediation
- [x] 10-area partition defined so parallel edit agents touch disjoint files

### Definition of Done
- [x] 159 raw findings captured (audit)
- [x] 159 findings adversarially verified → 144 confirmed / 13 rejected
- [x] 142 fixes applied across 61 files, 0 skipped, grepClean
- [x] 4 highest-risk content clusters spot-verified against live source
- [ ] description.json + graph-metadata.json present; validate --strict 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out / fan-in over a fixed 10-area partition, repeated for each of the three stages so audit, verify, and remediate share the same area boundaries and stay disjoint.

### Key Components
- **AUDIT (10x read-only)**: gpt-5.5-fast reads each area's READMEs/references/assets and emits raw findings (file + claim).
- **VERIFY (10x adversarial)**: re-checks each raw finding against the real filesystem; emits CONFIRMED / REJECTED with evidence.
- **REMEDIATE (10x edit)**: partitioned by the same 10 areas with disjoint file sets; applies only confirmed findings.
- **Ground-truth sources**: `opencode.json` (MCP entrypoint), `validator-registry.json` + `spec-kit-docs.json` (validation rules), `recommend-level.sh` (level scoring), `registry.ts` (embedder).

### Data Flow
READMEs + references + assets → AUDIT → 159 raw findings → VERIFY (vs real filesystem) → 144 confirmed / 13 rejected → REMEDIATE (confirmed only) → 142 fixes / 61 files → grepClean + orchestrator spot-verify of 4 clusters.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `install_guides` + `skills/README` | singular `.opencode/skill` typo | fix to `.opencode/skills` (commands, `init_skill.py --path`, links) | grepClean: no remaining singular `.opencode/skill` path token |
| `mcp_server` READMEs | bare `dist/context-server.js` entrypoint | fix to launcher `node .opencode/bin/mk-spec-memory-launcher.cjs` (per opencode.json) | matches opencode.json command |
| Tool-API references | drifted signatures | `memory_embedding_reconcile mode:[dry-run,apply]` (not `dryRun`), Code Mode `call_tool_chain({code})` (not `{typescript}`), `SPECKIT_EMBEDDER`→`EMBEDDINGS_PROVIDER`, plugin `spec-kit-skill-advisor.js`→`mk-skill-advisor.js` | matches live tool schemas + plugin filename |
| `validation_rules.md` / `template_compliance_contract.md` / `path_scoped_rules.md` | drifted from validator | realign to `validator-registry.json` + `spec-kit-docs.json` (WARN→error, `AI_PROTOCOL`→`AI_PROTOCOLS`, L1 add implementation-summary, full validate.sh path) | matches validator-registry.json |
| `level_selection_guide.md §2` | wrong auto-scoring model | document recommend-level.sh's real 4-factor scoring (LOC35/File20/Risk25/Complexity20) | matches recommend-level.sh |
| `embedder_architecture.md` | extra MANIFESTS entries | trim to single nomic-only MANIFESTS entry | matches registry.ts |

Inventories run:
- Scope census: 322 READMEs total; ~250 nested architecture/test stubs deliberately excluded; ~33 user-facing command READMEs in scope + 41 references + 4 assets.
- Confirmed-findings detail: `/tmp/readme-research/AUDIT-REPORT.md` + `confirmed.json` (144 confirmed, 13 rejected).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit (done)
- [x] 10 parallel read-only gpt-5.5-fast audits over ~33 READMEs + 41 references + 4 assets
- [x] 159 raw findings captured

### Phase 2: Verify (done)
- [x] 10 parallel adversarial verifiers re-check all 159 against the real filesystem
- [x] 144 confirmed / 13 rejected (dist build-artifact false-positive class + a `.mcp.json` analogue)

### Phase 3: Remediate (done)
- [x] 10 parallel edit agents partitioned by the same 10 areas (disjoint files)
- [x] 142 fixes across 61 files; grepClean; 0 skipped
- [x] Orchestrator spot-verify of the 4 highest-risk content clusters → all correct

### Phase 4: Ship
- [ ] description.json + graph-metadata.json
- [ ] validate --strict → 0
- [ ] reconcile completion metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Adversarial verification | every raw finding vs the real filesystem | gpt-5.5-fast verifiers + `rg`/`fd` |
| Cross-tool check | "file does not exist" findings | `rg --files` (catch fd false-negatives) |
| grepClean | typo/path/tool-API classes are gone post-edit | `rg` over edited files |
| Spot-verify | 4 highest-risk content clusters vs live source | manual read of validator-registry.json, recommend-level.sh, registry.ts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- gpt-5.5-fast cannot see gitignored `dist/`; the verify stage compensates by checking against the real local filesystem.
- No network/runtime dependency beyond the read-only audit/verify dispatches; remediation is local text edits.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Documentation-only change; rollback is a clean revert of the 61 edited doc files.

- **Revert**: restore the 61 edited READMEs + references/assets to their pre-remediation state.
- **No code/config touched**: source, validator, embedder, and MCP servers are unchanged, so no runtime rollback is required.
- **Findings detail retained**: `/tmp/readme-research/AUDIT-REPORT.md` + `confirmed.json` preserve the confirmed set for re-application if needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit) ──► Phase 2 (Verify) ──► Phase 3 (Remediate) ──► Phase 4 (Ship)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | Verify |
| Verify | Audit (raw findings) | Remediate |
| Remediate | Verify (confirmed set) | Ship |
| Ship | Remediate (grepClean + spot-verify) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit (10 parallel read-only passes) | Med | ~1.5 hours |
| Verify (10 parallel adversarial passes) | Med | ~1.5 hours |
| Remediate (10 partitioned edit agents) | Med | ~2 hours |
| Ship (metadata, validate, reconcile) | Low | ~0.5 hour |
| **Total** | | **~5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved (documentation-only change)
- [x] No feature flag required (no behavioral change)
- [x] No source/config files touched (scope-locked to docs)

### Rollback Procedure
1. Restore the 61 edited READMEs + references/assets from version control.
2. No build, daemon recycle, or DB action required — nothing executable changed.
3. Re-apply from `/tmp/readme-research/confirmed.json` if a re-do is wanted.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — text-only documentation edits.
<!-- /ANCHOR:enhanced-rollback -->
