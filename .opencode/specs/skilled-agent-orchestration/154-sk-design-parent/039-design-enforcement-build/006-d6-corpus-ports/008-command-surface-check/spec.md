---
title: "D6-R8 — design-command-surface-check roster-reconciliation drift audit"
description: "Extend the existing /design:* command surface checker with one additive roster-reconciliation stage: glob commands/design/ and cross-check the command-metadata.json roster + hub-router.json so the command-doc roster, the metadata roster, and the routing roster must all agree. Bites on orphan wrapper, missing wrapper, frontmatter != metadata, dead placeholder, alias collision, route-fixture drift, and dangling handoff. Holds STATUS=PASS commands=5 invalid=0 drift=0 and hubRoute 34/29/5/0. Last Group A phase."
trigger_phrases:
  - "d6-r8 command surface check"
  - "command surface drift design build"
  - "roster reconciliation design command surface-check"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/008-command-surface-check"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record R1->R7->R8 order and enforceable/advisory split"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D6-R8 — design-command-surface-check roster-reconciliation drift audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D2 / D3 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The command surface checker already enforces every *field-level* invariant the spec names — no surviving `<design request>` placeholder, mutation-free modes carry no Write/Edit/Bash, `ownerMode ∈ workflowMode`, aliases unique — by iterating a hardcoded five-command roster and drift-checking each wrapper against `command-metadata.json`. What it never did was reconcile the surface as a *set*: it did not glob `commands/design/*.md`, so an orphan or deleted wrapper file was invisible, and it did not cross-check the `hub-router.json` route fixtures, so the command roster and the routing corpus could silently diverge. A deleted wrapper, an orphan doc, or a handoff pointing at a vanished recipe would all slip through.

### Purpose
Add one additive **roster-reconciliation stage** that reconciles three rosters — on-disk command-doc files, `command-metadata.json` records, and the routable set (`hub-router.json` + `mode-registry.json`) — flags any asymmetry with a specific drift locus, and resolves R7's handoff/next targets against the reconciled roster. After this phase the command docs, the metadata SSOT, and the routable set can no longer silently diverge. Every existing field-level check is preserved unchanged; the established `STATUS=PASS ... drift=0` baseline and the `mode-registry.json`/`hub-router.json` identity are held. This is the last Group A phase and builds on D6-R1 (which created the checker and added `argumentGrammar`/`choreography[]`) and D6-R7 (which added the `handoff`/`nextOptions[]` grammar this stage consumes).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `design-command-surface-check.mjs` additively with one roster-reconciliation stage that runs after metadata validation and joins the existing surface-drift collection
- Glob `.opencode/commands/design/*.md` into the actual on-disk command-doc roster (instead of trusting the hardcoded list as the sole source of truth for "what exists")
- Three-way roster reconciliation: command-doc files ↔ `command-metadata.json` records ↔ the `hub-router.json` routable set (with `mode-registry.json`); emit `orphan-wrapper`, `missing-wrapper`, `unroutable-command`, and `uncommanded-mode` drift loci
- Route-fixture cross-check: every metadata `ownerMode` resolves to a `hub-router.json` route and a `mode-registry.json` workflowMode, and no routable mode lacks a command
- Handoff resolution (consumes R7): every `nextOptions`/handoff target resolves to a command in the reconciled roster — no dangling handoff

### Out of Scope
- The recipe **projection layer** (`argumentGrammar` + `choreography[]`) — owned by sibling phase 001 (D6-R1); this stage builds on it
- The recipe **scorer cap** — owned by sibling phase 002
- The **handoff grammar** (`handoff`/`nextOptions[]`) authoring itself — owned by sibling phase 007 (D6-R7); this stage consumes it
- Any runtime generator binary — acceptance requires a reconciliation gate, not regeneration
- Editing `command-metadata.json`, the five wrappers, `mode-registry.json`, `hub-router.json`, or the route fixtures — the stage reads them, never writes them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add one additive roster-reconciliation stage: glob `commands/design/`, three-way roster cross-check, route-fixture cross-check, and handoff-target resolution against the reconciled roster; merge structural drift into the existing `drift[]` + sort + emit; keep every prior field-level check intact |
| `.opencode/skills/sk-design/command-metadata.json` | Unchanged | Read as the metadata roster; not edited |
| `.opencode/skills/sk-design/hub-router.json` | Unchanged | Read as the routing roster; not edited |
| `.opencode/skills/sk-design/mode-registry.json` | Unchanged | Read for workflowMode identity; not edited |
| `.opencode/commands/design/*.md` | Unchanged | Globbed as the on-disk command-doc roster; not edited |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Source the command-doc roster from a real glob | The stage globs `.opencode/commands/design/*.md` into the on-disk command set, not only the hardcoded list |
| REQ-002 | Reconcile three rosters | Command-doc files ↔ `command-metadata.json` records ↔ the `hub-router.json` routable set are cross-checked; an asymmetry emits a named drift locus (`orphan-wrapper`, `missing-wrapper`, `unroutable-command`, `uncommanded-mode`) |
| REQ-003 | Cross-check route fixtures | Every `ownerMode` resolves to a `hub-router.json` route and a `mode-registry.json` workflowMode; no routable mode lacks a command |
| REQ-004 | Resolve handoff targets against the reconciled roster | Every `nextOptions`/handoff target resolves to a command in the reconciled roster; a dangling handoff fails |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve every prior field-level check | `<design request>` placeholder, mutation-free tools, `ownerMode ∈ workflowMode`, alias uniqueness, and frontmatter-vs-metadata drift all stay enforced and unweakened |
| REQ-006 | Stay additive, single-file, and evergreen | The change is one isolated stage in `design-command-surface-check.mjs`; inputs are untouched; structural drift carries a greppable `kind`; no spec/packet/phase IDs in the edited code |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` returns `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 — the roster reconciles, with the five command-doc wrappers, the five `command-metadata.json` records, and the `hub-router.json` routable set all in agreement.
- **SC-002**: The stage bites — removing a wrapper file from the real surface yields `STATUS=DRIFT` with a `missing-wrapper` locus, and adding an orphan command doc yields `STATUS=DRIFT` with an `orphan-wrapper` locus; restoring the surface returns `STATUS=PASS drift=0` each time (temp-corrupt-restore on the real surface).
- **SC-003**: Every prior field-level invariant still bites; R1's `argumentGrammar`/`choreography[]` and R7's `handoff`/`nextOptions[]` stay intact; `command-metadata.json`, the five wrappers, `mode-registry.json`, `hub-router.json`, and the route fixtures are untouched; `hubRoute` holds 34/29/5/0; the evergreen scan is clean; and the change set is exactly the one extended file.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Sequencing | This stage is the last of three additive layers on one file: R1 (grammar/choreography) -> R7 (handoff/nextOptions) -> R8 (this: roster reconciliation) | If R8 had landed before R7, the dangling-handoff clause would have nothing to resolve | **Resolved: R8 built last.** R1 created the checker, R7 added the handoff grammar, R8 reconciles the roster and resolves R7's targets against it; both prior layers verified present and `drift=0` holds |
| Logic-sync | Spec §3 originally marked the target file "(new)" | A reader could think R8 creates the file while R1 already did | **Resolved: documented build-on order.** R1 created the file; R7 and R8 extend it additively. This spec records the file as Modify, not new |
| Risk | The audit proves structure, never taste | The gate can prove the surface is structurally consistent, never that it is well-designed or that live NL routes to the right command outside the fixture corpus | Documented honesty: roster symmetry, command↔metadata↔route-fixture consistency, and dangling-handoff detection are enforceable; surface taste and live-NL routing stay advisory |
| Risk | A false-positive on the clean surface would break the green baseline | The stage must not flag drift on the unmodified surface | Verified: `STATUS=PASS commands=5 invalid=0 drift=0` on the clean surface; the two structural bites confirm it bites only on real asymmetry |
| Dependency | Node runtime for the ESM surface-check | Green | Required to run the gate; no new packages |
| Dependency | `command-metadata.json` SSOT, `hub-router.json`, `mode-registry.json`, and the five wrappers | Green | Read as the three rosters; already built and enforced; left untouched |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The stage is read-only over its inputs — it globs and parses the command docs, metadata, router, and registry but never writes them, and removes or weakens no prior field-level check.
- **NFR-I02**: Structural drift and field drift share one `drift[]`, one sort, and one `SUMMARY` line, so the report stays a single deterministic surface.

### Consistency
- **NFR-C01**: The three rosters — command-doc files, metadata records, and the routable set — are reconciled to the same five commands, so the command surface, the SSOT, and the routing corpus cannot diverge in count or membership without biting.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Roster asymmetry
- **Orphan wrapper**: a command doc on disk with no `command-metadata.json` record is reported `DRIFT` with an `orphan-wrapper` locus.
- **Missing wrapper**: a metadata record (or routable mode) with no command doc on disk is reported `DRIFT` with a `missing-wrapper` locus.
- **Unroutable command**: a command with no `hub-router.json` route is reported `DRIFT`.
- **Uncommanded mode**: a routable mode with no command is reported `DRIFT`.

### Field validity (preserved)
- **Frontmatter ≠ metadata**: the existing field-drift case still fires.
- **Dead placeholder**: a surviving `<design request>` argument hint still drifts.
- **Alias collision**: a duplicated alias is still reported `INVALID`.

### Handoff
- **Dangling handoff**: a `nextOptions`/handoff target that does not resolve to a command in the reconciled roster fails.
- **No-regression**: on the clean surface every roster agrees, every prior check holds, and the summary stays `invalid=0 drift=0`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One artifact — a single additive stage in one ESM checker (`design-command-surface-check.mjs`). Its inputs are five command docs, one metadata SSOT, one router, and one registry, all read-only.
- **Risk concentration**: The only judgment-bearing surface is whether the command surface is *tasteful* and whether live NL routes correctly outside the fixture corpus; everything else (roster symmetry, route-fixture consistency, dangling-handoff, and all prior field-level invariants) is structural and the stage bites on it. The blast radius is the one extended file; the rosters it reads stay untouched.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the roster be sourced from the hardcoded list or a real glob? **RESOLVED: a real glob.** The hardcoded list is what the checker expects; globbing `commands/design/*.md` is what actually exists. Comparing the two is the only way an orphan or a deleted wrapper can bite, so the glob is the source of truth for "what exists".
- Should R8 land before or after R7? **RESOLVED: after — R8 is last.** R1 created the checker and R7 added the handoff/`nextOptions[]` grammar; R8 reconciles the roster and resolves R7's targets against it. Building last means the dangling-handoff clause has real targets and nothing is pre-empted; R1 and R7 fields are verified intact with `drift=0`.
- Does the gate certify the surface is *well-designed*? **RESOLVED: No.** The stage proves roster symmetry (no orphan/missing wrapper), command↔metadata↔route-fixture consistency, and dangling-handoff detection — the surface is structurally consistent. Whether the surface is tasteful, whether a wrapper's prose is good, and whether live NL routes to the right command outside the fixture corpus stay advisory.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Additive roster-reconciliation stage in design-command-surface-check.mjs (one file): glob commands/design/, three-way roster cross-check (command-doc files <-> metadata records <-> hub-router.json routable set), route-fixture cross-check, handoff-target resolution against the reconciled roster
- STATUS=PASS commands=5 invalid=0 drift=0; missing-wrapper-DRIFT and orphan-wrapper-DRIFT bites both confirmed and restored
- Build-on order R1 -> R7 -> R8 (R8 last) recorded in RISKS/OPEN QUESTIONS; consumes R7 handoff targets; R1/R7 fields preserved; inputs untouched; hubRoute 34/29/5/0; completes Group A
- Enforcement split: roster symmetry + command<->metadata<->route consistency + dangling-handoff enforceable, surface taste + live NL routing advisory; GENERATED_METADATA regenerated by the orchestrator
-->
