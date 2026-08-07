---
title: "Feature Specification: sk-design consolidation remediation"
description: "Nine verified fixes closing the deep-review and deep-research findings after the /interface:audit and /interface:foundations retirement: advisor overclaim, broken styles paths, retired vocabulary, a stale runtime enum, unsupported proof claims, a duplicate lane enum, a write-target guard, an oversized README, and two packet contradictions."
trigger_phrases:
  - "sk-design consolidation remediation"
  - "post-consolidation fixes"
  - "design advisor overclaim"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/007-consolidation-remediation"
    last_updated_at: "2026-07-27T08:07:00.762Z"
    last_updated_by: "orchestrator"
    recent_action: "Shipped nine remediation fixes; full gate set green"
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

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-design consolidation remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Leaf packet |
| **Priority** | P1 |
| **Status** | Complete — nine fixes shipped, full gate set green |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/012-sk-design-program` |
| **Evidence Base** | `006-design-mode-consolidation/review/review-report.md`, `.../research/research.md`, `.../research/research-opus-synthesis.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After `/interface:audit` and `/interface:foundations` were retired, a five-iteration deep-review returned CONDITIONAL (P0=0, P1=4, P2=3) and a five-iteration deep-research returned five ranked recommendations. A fresh-context Opus pass then verified both against the live tree and materially corrected them: it re-severed two findings, showed the prescribed styles-path fix would have created four *new* broken paths, and surfaced two defects neither automated pass caught.

The most serious was invisible to both. The advisor identity still advertised `design-quality-score` and the trigger example "score the design quality and list P0/P1 findings" after the scoring apparatus was deleted, so a user asking for a design score was routed to a surface whose only verdict is SHIP/FIX. Both passes checked whether the parts agreed with each other; neither checked whether the front door still described what was inside.

A hub-owned checker, `procedure-card-schema-check.mjs`, was also failing and is not wired into the package validator, so no routine gate surfaced it.

### Purpose
Close every verified finding with the smallest change that fixes it, and prove each one by execution rather than assertion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Nine verified fixes: the advisor score overclaim; thirteen broken `styles/_engine` and `styles/_db` documentation paths; retired `foundations` and `audit` vocabulary across fifteen live contract files; the stale `PAIRED_MODES` runtime enum; four unsupported measurement claims; the duplicate `user_inputs.mode` lane enum; the unguarded `--design-md` write target; the 165 KB styles README inventory table; and two contradictory lines in the consolidation packet.

### Out of Scope
Alternatives the research eliminated, recorded so they are not re-litigated: restoring audit or foundations in any form; restoring the `/20` rubric or the P0–P3 severity model; adding severity, confidence, or evidence schema to the mechanical preflight card; any replacement construct for the three foundations procedure cards; granting `interface` Bash or browser tools; merging the auto and confirm workflow YAMLs; deleting presentation assets; rebuilding the hub or registry; removing the Open Design transport or the styles storage facade; migrating to a database-only corpus; further `commandSubworkflows` cleanup, since no active machinery remains; deleting `auditFrame`, which has no code consumer and names a live routing distinction; and scrubbing historical references, since history is provenance rather than runtime authority.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/description.json`, `graph-metadata.json`, `SKILL.md` | Modify | Remove the unbacked scoring promise |
| `sk-design/styles/**`, `manual-testing-playbook/**` | Modify | Correct thirteen paths; shrink the root README |
| `sk-design/shared/**`, `design-interface/**` | Modify | One retired-vocabulary pass |
| `design-mcp-open-design/grounding-receipt.mjs` | Modify | Replace the stale paired-mode enum |
| `commands/interface/**` | Modify | Delete four proof claims and one duplicate enum |
| `design-md-generator/backend/**` | Modify | Guard the secondary write target; add negative tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** The advisor must not promise a capability the hub cannot deliver. Accessibility and anti-slop vocabulary stays, because the preflight card genuinely performs that pass; only the score and severity promise is removed.
- **REQ-002** Every documented styles command must execute. Paths are corrected by a three-way mapping, not a substitution: engine code to `lib/engine`, tests to `tests/engine`, and database references to `lib/database` or `database` by kind.
- **REQ-003** No live contract on the command path may name a retired mode as a valid owner, and `procedure-card-schema-check.mjs` must pass.
- **REQ-004** The severity-demanding handoff card and the last severity vocabulary must be deleted together, so no contract demands data no surviving mode produces.
- **REQ-005** `--design-md` must resolve through the same output policy as `--output` and fail closed, proven by a test showing the retry branch cannot delete a file outside the boundary.
- **REQ-006** No fix may add a mode, command, schema, alias, adapter, template, or abstraction.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `procedure-card-schema-check.mjs` passes, having failed before this work.
- Command contract 8/8, command surface 7/7, surface checker `invalid=0 drift=0`, parent-hub invariants clean with zero warnings.
- Open Design transport 37/37; md-generator backend 173/173 including two new negative tests.
- Both documented styles commands execute, with `build --check` reporting 1,290 records and an empty diff.
- Strict validation of the consolidation packet reports zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `procedure-card-schema-check.mjs`, `interface-command-contract.test.mjs`, `design-command-surface-check.*`, `parent-skill-check.cjs`, Open Design transport suite, md-generator backend suite | Each fix's correctness claim rests on its owning gate | Every fix was verified by re-running its named gate before moving to the next |
| Dependency | Fix 9's guard depends on `resolveOutputPath()` already enforcing the `--output` boundary | If that contract changes, `--design-md` silently loses its guard | Two negative tests pin the boundary behavior, not just the call site |
| Risk | Fix 5 (paired severity deletion) is a two-file, single-unit change | Reverting only one half reintroduces a contract demanding data no surviving mode produces | Rollback plan (`plan.md` §7) treats the pair as one revertible unit |
| Risk | Design benchmark suite not re-run | Route gold still encodes the retired six-mode topology | Documented as not run rather than run against stale gold (`implementation-summary.md`) |
| Risk | Styles SHA-256 equality check against `006/scratch/styles.sha256.before` not run | No byte-for-byte proof the styles corpus is unchanged beyond `build --check`'s record count and diff | Documented as not run; `build --check`'s empty diff is the interim evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The eleven `clean.html` and `tell.html` fixture pairs deleted with the audit surface were the only mechanism proving an AI-tell detector actually fires. Several preflight card rows are mechanically decidable and were fixture-backed; they are now honour-system prose. Restoring the fixtures without the rubric is the cheaper half and the only half that produces evidence. This is a capability decision, not a defect.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Consolidation packet this remediates:** `../006-design-mode-consolidation/`.
- **Verified evidence base:** that packet's `review/review-report.md`, `research/research.md`, and `research/research-opus-synthesis.md`.
- **Outcome and gate evidence:** `implementation-summary.md`.
