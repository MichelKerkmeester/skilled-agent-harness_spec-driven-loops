---
title: "Implementation Summary: design-command-surface-check roster-reconciliation stage"
description: "Post-build record for the additive roster-reconciliation stage in design-command-surface-check.mjs: globs commands/design/, cross-checks the command-metadata.json roster + hub-router.json so the command-doc roster, the metadata roster, and the routing roster must all agree; the STATUS=PASS commands=5 invalid=0 drift=0 acceptance plus the missing-wrapper-DRIFT and orphan-wrapper-DRIFT bites; the R1 -> R7 -> R8 build-on order; the roster-symmetry-enforceable vs surface-taste-advisory split; hubRoute 34/29/5/0 unaffected. Completes Group A."
trigger_phrases:
  - "d6-r8 command surface check implementation summary"
  - "roster reconciliation surface-check record"
  - "design command surface drift PASS 5 0 0 summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/008-command-surface-check"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record roster-reconciliation stage, PASS 5/0/0, and the two DRIFT bites"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-command-surface-check |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` (one file, extended with an additive roster-reconciliation stage) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The command surface checker already proved every *field-level* invariant the spec names — no surviving `<design request>` placeholder, mutation-free modes carry no Write/Edit/Bash, `ownerMode ∈ workflowMode`, aliases unique — but it iterated a hardcoded five-command roster and never reconciled the surface as a *set*. A wrapper file could be deleted, an orphan command doc could be dropped in, or a handoff could point at a recipe that no longer exists, and nothing would bite. This phase closes that gap: the checker now guards the **roster**, so the command docs, the `command-metadata.json` SSOT, and the routable set can no longer silently diverge.

This is the last Group A phase. It builds on D6-R1 (which created the checker and added `argumentGrammar`/`choreography[]`) and D6-R7 (which added the `handoff`/`nextOptions[]` grammar), and it consumes both. The change is a single additive stage in one file: no existing check was removed or weakened, and `command-metadata.json`, the five wrappers, `mode-registry.json`, `hub-router.json`, and the route fixtures were all left untouched.

### The roster-reconciliation stage

`design-command-surface-check.mjs` gained one additive stage that runs after the existing metadata validation and joins the same surface-drift collection, so structural drift and field drift share one sorted `drift[]` and one `SUMMARY` line. The stage:

- **Globs `.opencode/commands/design/`** to build the actual on-disk command-doc roster, instead of trusting the hardcoded list as the sole source of truth for "what exists".
- **Cross-checks three rosters** — command-doc files, `command-metadata.json` records, and the routable set from `hub-router.json` (with `mode-registry.json`) — and asserts all three agree. The command-doc roster, the metadata roster, and the routing roster must reconcile to the same five commands.
- **Resolves every handoff/next target (consumes R7)** against the reconciled roster, so a `nextOptions` target that does not name a real, routable recipe is caught rather than dangling.

### What the stage bites on

The reconciliation stage adds a structural bite set on top of the preserved field-level checks. It fails, with a specific drift locus, on:

- **orphan wrapper** — a command doc on disk with no matching `command-metadata.json` record.
- **missing wrapper** — a metadata record (or routable mode) with no matching command doc on disk.
- **frontmatter ≠ metadata** — the existing field-drift case, still enforced.
- **dead placeholder** — a surviving `<design request>` argument hint, still enforced.
- **alias collision** — a duplicated alias, still reported `INVALID`.
- **route-fixture drift** — a command with no `hub-router.json` route, or a routable mode with no command.
- **dangling handoff** — a `nextOptions`/handoff target that does not resolve to a command in the reconciled roster.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Add one additive roster-reconciliation stage: glob `commands/design/`, three-way roster cross-check (command-doc files ↔ metadata records ↔ `hub-router.json` routable set), and handoff-target resolution against the reconciled roster; merge structural drift into the existing `drift[]` + sort + emit; keep every prior field-level check intact |

`command-metadata.json`, the five `.opencode/commands/design/*.md` wrappers, `mode-registry.json`, `hub-router.json`, and the route fixtures were all left untouched — the stage reads them, never writes them.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 xhigh fast`) extended the one checker file with the additive roster-reconciliation stage, building on the landed R1 and R7 fields and keeping the change isolated to a single file. The orchestrator then verified the result independently, reading exit codes without pipe-masking and restoring the real surface after each temp-corrupt. `node design-command-surface-check.mjs` returned `STATUS=PASS commands=5 invalid=0 drift=0`, exit `0` — the roster reconciles, with the five wrappers, the five metadata records, and the `hub-router.json` routable set all in agreement. Two structural bites confirmed the stage bites rather than passing vacuously: removing a wrapper file from the real surface produced `STATUS=DRIFT` with a `missing-wrapper` locus, and adding an orphan command doc produced `STATUS=DRIFT` with an `orphan-wrapper` locus; restoring the surface returned `STATUS=PASS drift=0` each time. `node --check` on the script passed. `command-metadata.json`, the five wrappers, `mode-registry.json`, `hub-router.json`, and the route fixtures were confirmed untouched; the `hubRoute` lane held at 34/29/5/0, unaffected by this phase; and the evergreen scan was clean. With this phase, Group A is complete. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live skill, command, or script file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Glob `commands/design/` for the real on-disk roster instead of trusting the hardcoded list | The hardcoded list is what the checker *expects*; globbing the directory is what actually *exists*. Comparing the two is the only way an orphan or a deleted wrapper can bite, so the glob is the source of truth for "what exists" |
| Reconcile three rosters as a set, not just field-by-field | Field-level checks already passed; the open gap was that the command-doc set, the metadata set, and the routable set could diverge in count or membership. A three-way symmetric cross-check is the contract that they cannot |
| Build R8 last and consume R7's handoff fields rather than re-implement them | R1 created the checker and R7 added the handoff/`nextOptions` grammar; R8 resolves those targets against the reconciled roster. Building last means the dangling-handoff check has real targets to resolve and nothing is pre-empted |
| Add one additive stage that joins the existing `drift[]` + sort + emit | Reusing the existing drift collection and `SUMMARY` line keeps one deterministic report, keeps the change a single revertible hunk, and leaves every prior field-level invariant intact |
| Prove the roster with a read-only reconciliation, not a generator | No generator binary exists and acceptance does not require one; reconciling the three rosters and biting on any asymmetry is the contract that "the surface is structurally consistent" |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Final surface-check is green | PASS, `node design-command-surface-check.mjs` → `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified, no pipe-masking) |
| Roster reconciles three-way | PASS, five command-doc wrappers ↔ five `command-metadata.json` records ↔ the `hub-router.json` routable set all agree |
| Missing-wrapper bites | PASS (bite), removing a wrapper file from the real surface yields `STATUS=DRIFT` with a `missing-wrapper` locus; restore returns `STATUS=PASS drift=0` |
| Orphan-wrapper bites | PASS (bite), adding an orphan command doc yields `STATUS=DRIFT` with an `orphan-wrapper` locus; restore returns `STATUS=PASS drift=0` |
| Prior field-level invariants preserved | PASS, `<design request>` placeholder, mutation-free tools, `ownerMode ∈ workflowMode`, and alias uniqueness all still enforced; frontmatter ≠ metadata still drifts |
| Route-fixture cross-check | PASS, every command resolves to a `hub-router.json` route and a `mode-registry.json` workflowMode; no routable mode lacks a command |
| Dangling-handoff resolution (consumes R7) | PASS, every `nextOptions`/handoff target resolves to a command in the reconciled roster |
| Script parse | PASS, `node --check` on the `.mjs` clean |
| R1 + R7 fields preserved | PASS, `argumentGrammar`/`choreography[]` and the `handoff`/`nextOptions[]` grammar intact; this stage is additive beside them |
| Inputs untouched | PASS, `command-metadata.json`, the five wrappers, `mode-registry.json`, `hub-router.json`, and the route fixtures all unchanged by this phase |
| No-regression: hubRoute lane | PASS, `hubRoute` 34/29/5/0 unaffected; this phase touches no scorer or router file |
| Evergreen: no spec/packet/phase IDs in edited code | PASS, evergreen scan clean across the one extended file |
| Scope: one file extended | PASS, the change set is exactly `design-command-surface-check.mjs` |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (`description.json` level, `graph-metadata.json` source_fingerprint) | EXPECTED, the orchestrator regenerates these; the level and fingerprint drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Roster symmetry is code-enforced; surface taste is not.** The stage proves the command docs, the metadata SSOT, and the routable set are the same five commands, that every route fixture resolves, and that no handoff dangles. It cannot prove the command surface is *well-designed*, that a wrapper's prose is good, or that live natural-language routing picks the right command outside the static fixture corpus. That judgment stays advisory, and the docs say so.
2. **The contract is a reconciliation, not a generator.** Wrappers and metadata are hand-authored and proven consistent by the three-way cross-check; there is no code path that regenerates a wrapper or a record from the others.
3. **The spec marked the target file "(new)"; it was created by R1 and extended here.** This is the documented R1 -> R7 -> R8 build-on order, not a contradiction — R8 is the last additive stage on a file two siblings already populated.
4. **The hubRoute lane reads as a four-tuple (34/29/5/0).** The lane reading evolved from the earlier three-tuple recorded at plan time after an unrelated relative-advisor scorer change; this phase touches no scorer or router file, so the lane is unaffected either way.
5. **GENERATED_METADATA stays stale until the orchestrator regenerates it.** `description.json` (`level: "1"`) and `graph-metadata.json` (`source_fingerprint`) are generated artifacts; this phase does not hand-write them, so `validate.sh --strict` reports them as an expected residual until a metadata save runs.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Additive roster-reconciliation stage in design-command-surface-check.mjs (one file): glob commands/design/, three-way roster cross-check (command-doc files <-> metadata records <-> hub-router.json routable set), handoff-target resolution against the reconciled roster
- STATUS=PASS commands=5 invalid=0 drift=0, exit 0; missing-wrapper-DRIFT and orphan-wrapper-DRIFT bites both confirmed and restored
- Build-on order R1 -> R7 -> R8 (R8 last); consumes R7 handoff targets; R1/R7 fields preserved; inputs untouched; hubRoute 34/29/5/0 unaffected; evergreen clean; completes Group A
- Honest split: roster symmetry + command<->metadata<->route consistency + dangling-handoff enforceable; surface taste + live NL routing advisory; GENERATED_METADATA regenerated by the orchestrator
-->
