---
title: "Plan: sk-design consolidation remediation"
description: "Retrospective implementation plan for the nine verified fixes closing the deep-review and deep-research findings after the /interface:audit and /interface:foundations retirement."
trigger_phrases:
  - "sk-design consolidation remediation plan"
  - "post-consolidation fixes plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/007-consolidation-remediation"
    last_updated_at: "2026-07-27T08:07:00.762Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored L2 plan recording the nine shipped fixes"
    next_safe_action: "Run the deferred styles checksum and a regenerated design benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/description.json"
      - ".opencode/skills/sk-design/design-mcp-open-design/grounding-receipt.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-007-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Restore the eleven AI-tell fixture pairs, the only mechanism proving a detector fires?"
    answered_questions: []
---
# Plan: sk-design consolidation remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown contracts, JSON registries, one MJS module, one TS backend script — no application logic added |
| **Consumers** | `sk-design` hub router, `/interface:*` command choreography, Open Design transport, `design-md-generator` backend |
| **Testing** | `procedure-card-schema-check.mjs`, `interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs` + `.mjs`, `parent-skill-check.cjs`, Open Design transport suite, md-generator backend suite, `styles build --check` |

### Overview
This packet was originally scaffolded as five phased children (`001`–`005`); it was collapsed into this single leaf packet because the scaffold was larger than the work it described. The nine fixes were executed directly against the live tree, each verified by re-running its owning gate before moving to the next, rather than through five separate per-child worktree cycles. This plan documents the approach taken, after the fact.

Each fix targets one verified finding from the fresh-context Opus pass over the prior deep-review and deep-research output (see `spec.md` §2). No fix adds a mode, command, schema, alias, adapter, or template — per REQ-006, every change is a deletion, a correction, or a guard on an existing path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All nine findings re-verified against the live tree by a fresh-context pass before any edit (spec.md §2)
- [x] Evidence base identified: `006-design-mode-consolidation/review/review-report.md`, `.../research/research.md`, `.../research/research-opus-synthesis.md`
- [x] Out-of-scope alternatives enumerated and recorded (spec.md §3) so they are not re-litigated mid-fix

### Definition of Done
- [x] All nine fixes applied and independently verified (see §4 below)
- [x] `procedure-card-schema-check.mjs`: fail (3 cards) → pass (12/12, 0 failures)
- [x] `interface-command-contract.test.mjs`: 8/8 pass, unchanged
- [x] `design-command-surface-check.test.mjs`: 7/7 pass, unchanged; `design-command-surface-check.mjs`: `invalid=0 drift=0`, unchanged
- [x] `parent-skill-check.cjs`: OK, 0 warnings
- [x] Open Design transport: 37/37 pass
- [x] md-generator backend: 173/173 pass, build clean, including two new negative tests
- [x] All sk-design suites: 260/260 passing
- [x] `styles build --check`: `ok:true`, `recordCount:1290`, empty diff (previously MODULE_NOT_FOUND)
- [ ] Design benchmark suite re-run — not run; route gold still encodes the retired six-mode topology
- [ ] Styles SHA-256 equality check against `006/scratch/styles.sha256.before` — not run
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Nine independent deletion/correction/guard fixes against existing live contracts and one existing script. No shared abstraction, schema, or new file introduced.

### Key Components
- **Advisor identity** (`description.json`, `graph-metadata.json`, `SKILL.md`): removed the `design-quality-score` keyword and its trigger example; kept `design-audit`/`accessibility-audit`/`performance-audit` and the anti-slop example, which the preflight card genuinely performs.
- **Styles paths** (`SKILL.md`, `README.md`, `manual-testing-playbook.md`, two `styles-library-utilization/*.md`): thirteen paths corrected by a three-way mapping (engine → `lib/engine`, tests → `tests/engine`, database → `lib/database`/`database`), not a blind substitution.
- **Styles README**: shrunk from 165,030 bytes / 1,314 lines to 1,928 bytes / 26 lines by deleting a 1,290-row inventory table whose links all resolved to a nonexistent path; two broken references at line 8 fixed.
- **Retired vocabulary** (15 live contract files): one pass removing `foundations`/`audit` mode-identity references, including a row rename in the three foundations procedure cards (`Owning subworkflow` → `Owning mode | design-interface`).
- **Paired severity deletion**: `sk-code-handoff.md`'s Audit Backlog Handoff Card and `creation-contract.md`'s audit deterministic-minimum row deleted together, so scored design QA is accepted-lost rather than accidentally-lost.
- **`PAIRED_MODES`** (`grounding-receipt.mjs:26-31`): corrected from two deleted modes + one omitted live mode to `['design-interface','design-motion','design-md-generator']`, matching `mode-registry.json`'s three `packetKind:"workflow"` modes exactly.
- **Unsupported proof claims**: four measurement claims deleted from `commands/interface/design.md:24`, `motion.md:24`, and two presentation assets — the preflight card is strictly binary and measures nothing.
- **Duplicate lane enum**: `interface-design-auto.yaml:157`'s `build` lane deleted rather than synchronised with the command's `handoff` lane, removing the drift trap instead of resetting it.
- **`--design-md` write guard** (`guided-run.ts:170`): routed through the same `resolveOutputPath()` contract as `--output`, failing closed via a `design-md-path` preflight check; two negative tests added, one proving a file outside the allowlist is byte-identical after a blocked run.

### Data Flow
1. Take each verified finding from the Opus synthesis pass.
2. Re-confirm the defect against the current live file, not the finding text alone.
3. Apply the smallest fix that closes it.
4. Re-run the specific gate that finding named.
5. After all nine, re-run the full sk-design suite set and the styles build check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-verify all nine findings against the live tree (fresh-context Opus pass, spec.md §2)
- [x] Enumerate out-of-scope alternatives to prevent re-litigation mid-fix (spec.md §3)

### Phase 2: Core Implementation
- [x] Fix 1 — advisor score overclaim removed
- [x] Fix 2 — thirteen styles paths corrected
- [x] Fix 3 — styles README shrunk, two broken refs fixed
- [x] Fix 4 — retired vocabulary removed from 15 live contract files
- [x] Fix 5 — paired severity deletion
- [x] Fix 6 — `PAIRED_MODES` corrected to the live three-mode set
- [x] Fix 7 — four unsupported proof claims deleted
- [x] Fix 8 — duplicate lane enum deleted
- [x] Fix 9 — `--design-md` guarded, two negative tests added
- [x] Sibling reconciliation in `006-design-mode-consolidation` (not this packet): `spec.md:157` NFR-S01 marked superseded, `checklist.md:3` frontmatter corrected

### Phase 3: Verification
- [x] Full gate re-run (see §2 Definition of Done)
- [ ] Design benchmark suite — not run, route gold stale
- [ ] Styles SHA-256 equality check — not run
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | Procedure-card required-field lint | `procedure-card-schema-check.mjs` |
| Contract | Stable command-to-mode mapping | `interface-command-contract.test.mjs` |
| Surface | Command-surface drift | `design-command-surface-check.test.mjs`, `design-command-surface-check.mjs` |
| Structural | Parent-hub invariants | `parent-skill-check.cjs` |
| Transport | Open Design MCP transport | Open Design transport suite (37 tests) |
| Backend | md-generator write-path guard, negative tests | md-generator backend suite (173 tests) |
| Full suite | Regression across the hub | All sk-design suites (260 tests) |
| Data | Styles corpus build correctness | `styles build --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `procedure-card-schema-check.mjs` | Internal | Green (was failing) | Cannot confirm the last severity-schema hit is gone |
| `interface-command-contract.test.mjs` | Internal | Green | Cannot confirm choreography still intact |
| Open Design transport suite | Internal | Green | Cannot confirm `PAIRED_MODES` fix is safe |
| md-generator backend suite | Internal | Green | Cannot confirm the `--design-md` guard holds |
| Design benchmark suite | Internal | Not run | Route gold still encodes retired topology — would fail for the wrong reason |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any gate in §2 regresses on a future change touching these files.
- **Procedure**: Each fix is independently `git`-revertible per file, except Fix 5 (paired severity deletion), which must be reverted as a pair to avoid reintroducing a contract that demands data no surviving mode produces.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Re-verify findings) ──> Phase 2 (Nine fixes) ──> Phase 3 (Full gate re-run)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Packet closeout |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

Not tracked — this plan was authored after delivery to document work already executed and verified; no pre-work estimate exists to report against.
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every fix verified against its owning gate before being considered closed
- [x] Fix 5's paired deletion recorded as a single revertible unit

### Rollback Procedure
1. **Immediate**: `git checkout -- <file>` per affected file (per fix pair for Fix 5).
2. **Verify**: re-run the gate that fix's finding named.
3. **Confirm**: full sk-design suite still green.

### Data Reversal
- **Has data migrations?** No — contract/prose/code edits only, fully reversible by `git checkout`.
<!-- /ANCHOR:l2-rollback -->
