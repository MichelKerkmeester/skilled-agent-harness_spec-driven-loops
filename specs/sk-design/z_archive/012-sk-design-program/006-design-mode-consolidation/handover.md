---
title: "Session Handover: sk-design mode consolidation"
description: "Continuation state after ADR-002 retired /interface:audit and /interface:foundations entirely: four-mode/three-command sk-design topology shipped and verified for command/corpus/checker gates, with styles equality, the design benchmark, and validate.sh --strict remaining."
trigger_phrases:
  - "sk-design consolidation handover"
  - "resume design mode consolidation"
  - "four mode implementation state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-27T04:33:25.494Z"
    last_updated_by: "claude"
    recent_action: "Rewrote handover for the ADR-002 retirement outcome; three gates remain unrun"
    next_safe_action: "Orchestrator runs validate.sh --strict, styles SHA-256 equality, and the design benchmark suite"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Foundations and audit are retired entirely, not preserved as permanent interface subworkflows (ADR-002 supersedes ADR-001)."
---
# Session Handover: sk-design Mode Consolidation

Resume from the ADR-002 retirement outcome (four modes, three commands, `commandSubworkflows` deleted) and run the three remaining gates: styles SHA-256 equality, the design benchmark suite, and `validate.sh --strict`.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## Current Status

**Status:** `in_progress`

**Scope changed mid-packet.** The original plan (ADR-001) embedded foundations and audit as permanent `interface` command subworkflows via a new `commandSubworkflows` array. That violated the create-skill parent-hub doctrine's one-entry-per-packet rule and was not implementable as designed. **ADR-002 supersedes ADR-001**: the operator retired `/interface:audit` and `/interface:foundations` entirely.

Shipped and verified: `mode-registry.json` has exactly 4 modes; 3 commands remain; the audit surface (70 files/6,202 lines) and two dead AI-fingerprint parity scripts (915 lines) are deleted; foundations is flattened into `design-interface/` with its `contract.md`/`README.md`/`changelog/` deleted; 7 anti-slop checks are folded into `interface-preflight-card.md` section 11; `polish-gate-orchestration.md` is rewritten for its five live consumers; 6 unfixable playbook scenarios are deleted; a pre-existing dangling `command-metadata.json` reference is fixed; live old-path references are confirmed at 0 (down from 152). Command-contract, command-surface, corpus, and parent-hub gates all pass (see gate table below).

**Not run**, and must not be claimed as passing: the design benchmark suite, the final styles SHA-256 equality check, and `validate.sh --strict`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** Claude documentation-reconciliation pass, 2026-07-27
- **To Session:** Whoever runs the three remaining gates and closes the packet
- **Phase Completed:** Baseline capture; scope reversal to retirement (ADR-002); audit deletion; foundations flattening; anti-slop-check folding; registry/command cleanup to 4 modes/3 commands; command-contract, command-surface, corpus, and parent-hub gates all green
- **Handover Time:** 2026-07-27
- **Recent action**: Rewrote `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (added ADR-002), `implementation-summary.md`, and this handover to match the verified retirement outcome instead of the superseded ADR-001 relocation plan
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision     | Rationale | Impact                 |
| ------------ | --------- | ---------------------- |
| Keep exactly four registered modes: `interface`, `motion`, `md-generator`, `design-mcp-open-design` | Separates top-level identity from command capability | `mode-registry.json`, `hub-router.json` |
| **Retire `/interface:audit` and `/interface:foundations` entirely (ADR-002, supersedes ADR-001)** | `commandSubworkflows` violated the create-skill one-entry-per-packet doctrine rule; embedding was not implementable | `mode-registry.json`, `command-metadata.json`, three commands remain |
| Do not extract audit as a standalone skill (research rec 3, reconsidered and rejected again) | Avoids reopening a second advisor identity ADR-001 had already closed | `decision-record.md` ADR-002 |
| Delete the audit surface and two dead AI-fingerprint parity scripts | No replacement gate needed; scripts had no other consumer once audit was retired | `design-interface/audit/`, `assets/audit/`, `references/audit/` (70 files/6,202 lines); 2 scripts (915 lines) |
| Flatten foundations into `design-interface/`; delete its `contract.md`/`README.md`/`changelog/` | Judged packet-mimicking ceremony once foundations was no longer a subworkflow identity | `design-interface/foundations/` no longer exists as a subtree |
| Fold 7 anti-slop checks into `interface-preflight-card.md`, drop the scoring apparatus | Keeps checks with real evidence value without maintaining unused severity/reporting ceremony | `design-interface/assets/interface-preflight-card.md` section 11 (204 -> 211 lines) |
| Keep `styles/` byte-identical | The topology change does not justify data/retrieval/visual-style migration | Frozen 7,812-row SHA-256 manifest under `scratch/`; final equality still pending |
| Leave historical benchmark reports and archived evidence unchanged | Historical paths remain evidence, not live consumers | Live grep classified rather than rewrote historical records (152 -> 0 live) |

### 2.2 Blockers Encountered
**Blockers**: No product or architecture decision is blocked. Three gates remain unrun.

| Blocker     | Status          | Resolution/Workaround |
| ----------- | --------------- | --------------------- |
| `commandSubworkflows` violates the create-skill one-entry-per-packet doctrine rule | Resolved | ADR-002 retires both commands instead of embedding them |
| Styles SHA-256 final equality not yet run | Open | Compare a fresh manifest against `scratch/styles.sha256.before` (7,812 rows) |
| Design benchmark suite not yet run | Open | Pre-change route gold encoded the retired topology; needs a fresh baseline, not a rerun against stale gold |
| `validate.sh --strict` not yet run against this packet | Open | Orchestrator-owned next step, immediately after this documentation reconciliation |

### 2.3 Files Modified
**Key files**: `.opencode/skills/sk-design/mode-registry.json`, `.opencode/skills/sk-design/hub-router.json`, `.opencode/skills/sk-design/command-metadata.json`, `.opencode/skills/sk-design/design-interface/` (audit/references/audit/assets/audit deleted; foundations flattened), `.opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md`, `.opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md`, `.opencode/commands/interface/`

| File / Path        | Change Summary | Status                 |
| ----------- | -------------- | ---------------------- |
| `mode-registry.json` | Reduced to four mode rows; `commandSubworkflows` and related fields deleted (not added) | Complete, `design-command-surface-check.mjs` final `commands=3 aliases=9 invalid=0 drift=0` |
| `hub-router.json` | Reduced mode signals to four; no subworkflow signals | Complete, parent checker green |
| `command-metadata.json` | Reduced to 3 commands; fixed a pre-existing dangling reference to a nonexistent `design-audit/references/transform-remediation.md` | Complete |
| `design-interface/audit/`, `assets/audit/`, `references/audit/` | Deleted entirely (70 files / 6,202 lines) | Complete |
| `shared/scripts/ai-fingerprint-{registry,fixture}-check.mjs` | Deleted as dead code (915 lines) | Complete |
| `design-interface/foundations/` | Flattened: `contract.md`/`README.md`/`changelog/` deleted; `procedures/`, `corpus/`, `scripts/` moved flat into `design-interface/` | Complete |
| `design-interface/assets/interface-preflight-card.md` | 7 anti-slop checks folded into section 11 (204 -> 211 lines) | Complete |
| `shared/procedures/polish-gate-orchestration.md` | Rewritten around the interface preflight card for its five live consumers | Complete |
| 6 playbook scenarios (`mode-routing/audit-mode.md` and 5 others) | Deleted as unfixable | Complete |
| `.opencode/commands/interface/` | 3 commands remain: `/interface:design`, `/interface:motion`, `/interface:design-reference` | Complete, `interface-command-contract.test.mjs` 8/8 green |
| `shared/scripts/design-command-surface-check.mjs` | Verified at final state | Complete, 7/7 tests green |
| `parent-skill-check.cjs` | Verified at final state | Complete, OK, 0 warnings |

### 2.4 Traps & Scar Tissue
Carry only what the next reader cannot re-derive: where a trap bit, what triggers it, and whether the guard is load-bearing or defensive. A green tree does not erase a trap.

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| ----------------- | -------------------- | -------------------------- | ------------------------- |
| `commandSubworkflows` looks like the obvious embed-and-preserve design | Adding a second per-packet ownership array (`commandSubworkflows`, `extensions["command-subworkflows"]`, signals, bundles, excludedAliases) | Load-bearing | The create-skill doctrine is one entry per packet in `modes[]` — full stop. Any subworkflow-style ownership layer needs a different pattern or a genuine standalone skill, not a second array |
| Assuming ADR-001's "audit stays embedded" framing is still current | Reading only `decision-record.md` ADR-001 without checking its Status line | Load-bearing | ADR-001 is Superseded by ADR-002 — always read ADR-002 for the actual final decision |
| Pre-change benchmark route gold encodes the retired six-mode/subworkflow topology | Rerunning the benchmark without first updating route gold | Load-bearing | Treat the old route gold as stale; establish a fresh baseline against the four-mode/three-command topology before comparing |
| Grep across all benchmark reports overflows output | Searching all historical JSON reports for old paths | Defensive | Search live authored trees separately and exclude benchmark reports, changelogs, archived specs, and frozen before-snapshots |
| Marking a checklist/task item `[x]` because the *original* (superseded) requirement text sounds satisfied | Skimming `checklist.md`/`tasks.md` without checking whether the item was struck N/A under ADR-002 | Defensive | Read the bracketed evidence/N-A note on each item before trusting its checkbox |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** `implementation-summary.md`, Verification section — the exact gate table this handover is derived from
- **Next safe action**: Run the three remaining gates: (1) fresh styles SHA-256 manifest compared byte-for-byte against `scratch/styles.sha256.before` (7,812 rows), (2) design benchmark suite against the four-mode/three-command topology (do not reuse the pre-change route gold as-is), (3) `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation --strict`
- **Cold-read order**: 1. this `handover.md` -> 2. `implementation-summary.md` -> 3. `decision-record.md` ADR-002 -> 4. `spec.md` Requirements -> 5. `checklist.md` P0 items
- **Context:** Command/corpus/checker gates are already green (see gate table). The remaining work is exactly the three gates above, not another topology change.

### 3.2 Priority Tasks Remaining
1. Run styles SHA-256 equality comparison; halt and scoped-rollback per `plan.md` Rollback Plan if any tracked file differs.
2. Run the design benchmark suite fresh; do not compare against the pre-change route gold, which encoded the retired six-mode/subworkflow topology.
3. Run `validate.sh --strict` on this packet and resolve any findings.

### 3.3 Critical Context to Load
- [x] Continuity target: this `handover.md` and the `_memory.continuity` block in `implementation-summary.md`
- [x] Spec file: `spec.md` Requirements (REQ-002/003/006/008/010 are marked superseded by ADR-002)
- [x] Plan file: `plan.md` Overview (states the ADR-001 -> ADR-002 supersession up front) and Rollback Plan
- [x] Architecture source: `decision-record.md` — read ADR-002, not just ADR-001
- [x] Baseline evidence: `scratch/foundations-files.before.txt`, `scratch/audit-files.before.txt`, `scratch/styles.sha256.before`, `scratch/benchmark-before/`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before handover, verify:
- [ ] All in-progress work committed or stashed. Intentionally false: no commit or push was requested for this documentation-reconciliation pass.
- [x] Current context saved in this handover and `_memory.continuity` in `implementation-summary.md`.
- [x] No breaking changes left mid-implementation from this pass — only spec-folder docs were touched, not skill/command source.
- [ ] Tests passing. Command-contract/command-surface/corpus/parent-hub gates pass; design benchmark, styles equality, and `validate.sh --strict` remain pending.
- [x] This handover document is complete for the current boundary.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### Confirmed Evidence

- Baseline: `scratch/foundations-files.before.txt` (48 files), `scratch/audit-files.before.txt` (70 files), `scratch/styles.sha256.before` (7,812 rows), `scratch/routing.sha256.before`, `scratch/benchmark-before/`.
- Final state (per orchestrator verification): 4 registered modes (`interface`, `motion`, `md-generator`, `design-mcp-open-design`), 3 commands (`/interface:design`, `/interface:motion`, `/interface:design-reference`).
- `interface-command-contract.test.mjs`: 8/8 pass (baseline and final).
- `design-command-surface-check.test.mjs`: 7/7 pass (baseline and final).
- `design-command-surface-check.mjs`: baseline `commands=5 aliases=15 invalid=0 drift=0`; final `commands=3 aliases=9 invalid=0 drift=0`.
- `parent-skill-check.cjs`: `OK — 0 warnings` (baseline and final).
- Corpus tests (interface + motion): 70 passing, 0 failing.
- Live `design-audit/`/`design-foundations/` reference grep: 152 (baseline) -> 0 (final).

### Unfinished Evidence

- Final styles SHA-256 equality comparison against the 7,812-row baseline has not run.
- The design benchmark suite has not been rerun; pre-change route gold encoded the retired topology and cannot be reused as-is.
- `validate.sh --strict` has not run against this packet — the orchestrator runs this immediately after this reconciliation pass.

### Session Boundary

This pass (2026-07-27) touched only this packet's spec-folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, this `handover.md`), to correct overclaiming against the verified gate evidence and the ADR-002 scope reversal. It did not touch `.opencode/skills/` or `.opencode/commands/` — that implementation work is finished and verified separately.
<!-- /ANCHOR:session-notes -->

---
