---
title: "Implementation Plan: D2-R13 — description role projection (hub-keyword, not auto-trigger)"
description: "Add descriptionRole + autoTriggerEligible:false + hubKeywordProjection to every command-metadata.json record, formalize one description grammar (<role/output clause>. sk-design <ownerMode> mode.) reconciled across the wrapper frontmatter description and the metadata description, and extend design-command-surface-check.mjs to enforce the role fields + grammar while preserving the existing description drift parity at zero."
trigger_phrases:
  - "d2-r13 description role plan"
  - "design description hub-keyword projection plan"
  - "auto-trigger eligible false command plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/013-description-role-projection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all phases [x] with checker PASS invalid=0 drift=0 evidence; status complete"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r13-description-role-projection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Descriptions are a hub-keyword projection (autoTriggerEligible:false), not a per-command auto-trigger"
      - "The grammar suffix sk-design <ownerMode> mode. binds every description back to the parent + mode"
---
# Implementation Plan: D2-R13 — description role projection (hub-keyword, not auto-trigger)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON data + Markdown command wrappers + Node.js ESM (`.mjs`) validator |
| **Runtime** | `node` (project default), no new dependencies |
| **Inputs (read-only)** | `sk-design/mode-registry.json` (workflowModes), the five wrapper frontmatter `description` values |
| **Mutated artifacts** | `sk-design/command-metadata.json`, `sk-design/shared/scripts/design-command-surface-check.mjs`, and the five `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md` **only if** a description needs grammar tightening (lockstep with metadata) |
| **Validation** | `node design-command-surface-check.mjs` — deterministic, exit-coded; `node --check` on the edited checker |

### Overview
Today a command `description` is treated as if it were auto-trigger text for that specific command, yet natural-language prompts collapse to the `sk-design` hub rather than auto-selecting one `/design:*` command. The descriptions carry no declared **role**: nothing in the metadata says a description is a hub-routing keyword surface, not a per-command auto-trigger. This phase gives every description a defined role. It adds three metadata fields per record — `descriptionRole` (a fixed-vocabulary role token), `autoTriggerEligible` (boolean, always `false`), and `hubKeywordProjection` (the description keywords that route to the hub) — and formalizes one **description grammar** that the surface-check enforces: a succinct role/output clause followed by the `sk-design <ownerMode> mode.` suffix that binds the description back to the parent skill and its mode.

The work is strictly **additive and parity-preserving**. The existing `description` field already lives in both the wrapper frontmatter and `command-metadata.json`, and the surface-check already drift-checks `description` (frontmatter must equal metadata). This phase does **not** loosen that channel — it tightens the **grammar** the description must follow while keeping the frontmatter↔metadata `description` drift at `0`. The three new fields are **metadata-only**: they describe the role of the description and are never projected into the frontmatter, so they add no new drift channel. `mode-registry.json` is read-only and never mutated.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R13 framing confirmed from `spec.md`: descriptions are a hub-keyword projection (`autoTriggerEligible:false`), not a per-command auto-trigger; the description role is declared in metadata and grammar-checked; NL collapses to the hub by design — spec.md §1 Objective / §2 Why
- [x] The five `workflowMode` keys (`interface`, `foundations`, `motion`, `audit`, `md-generator`) read from `mode-registry.json` — the `ownerMode` allow-set the grammar suffix binds to
- [x] Each wrapper frontmatter `description` read as the parity counterpart to the metadata `description` (the existing drift channel that must stay `0`)
- [x] Scope frozen: `command-metadata.json` + `design-command-surface-check.mjs`, plus the five wrappers **only** if a description string needs grammar tightening (then edited in lockstep with metadata); `mode-registry.json` read-only

### Definition of Done
- [x] Every record in `command-metadata.json` carries `descriptionRole` (∈ the role allow-set), `autoTriggerEligible: false`, and a non-empty `hubKeywordProjection` string array whose every token is a substring of that record's `description`
- [x] Every record's `description` satisfies the grammar: a non-empty role/output clause ending in `sk-design <ownerMode> mode.` (suffix binds description → parent + mode)
- [x] The frontmatter↔metadata `description` drift channel is still `0` (parity preserved); any description tightening was applied to both surfaces in lockstep
- [x] `node design-command-surface-check.mjs` exits 0 with `invalid=0 drift=0`
- [x] `node --check design-command-surface-check.mjs` passes (checker was edited) — NODE_CHECK=OK, exit 0
- [x] A synthetic break (flip one `autoTriggerEligible` to `true`, or break one grammar suffix, or add an ungrounded `hubKeywordProjection` token) makes the checker FAIL; restoring returns `invalid=0 drift=0`
- [x] `mode-registry.json` is byte-unchanged; no spec / packet / phase ID or spec path embedded in any mutated runtime artifact (evergreen [HARD])

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT + stateless drift-gate, extended. The description-role content is authored once per record in `command-metadata.json` (the existing command-surface SSOT) and gate-enforced by the existing `design-command-surface-check.mjs`. This reuses the SSOT contract — frontmatter `description` must equal metadata `description` — and adds a role-field + grammar channel on the metadata side without adding any new frontmatter drift field.

### Key Components
- **`command-metadata.json`** — each record gains `descriptionRole`, `autoTriggerEligible`, `hubKeywordProjection` (metadata-only), and its existing `description` is held to the grammar.
- **`design-command-surface-check.mjs`** — extended: Stage 1 validates the three new fields' shape + fixed vocabulary + grounding, and validates the `description` grammar suffix per record. The existing `description` frontmatter drift check is untouched.
- **The five wrappers** — read-only for the new fields; touched only if a `description` string is tightened, and then edited in lockstep with metadata so the drift channel stays `0`.
- **`mode-registry.json`** — read-only `workflowMode` source; the `ownerMode` allow-set the grammar suffix binds to; never mutated.

### Description-role data shape (added to every `command-metadata.json` record)
```json
"descriptionRole": "hub-keyword-projection",
"autoTriggerEligible": false,
"hubKeywordProjection": ["<keyword drawn from this record's description>", "..."]
```
- `descriptionRole` — fixed-vocabulary token from the role allow-set (this phase ships exactly one value, `"hub-keyword-projection"`): the description is a keyword surface the hub routes on, not a per-command auto-trigger.
- `autoTriggerEligible` — boolean, must be strictly `false`: declares the description does **not** auto-select this command; NL collapses to the hub.
- `hubKeywordProjection` — the description keywords the hub projects to select a mode; every token must be a (case-insensitive) substring of this record's `description`, so the projection is grounded in real description text, never invented.

### Description grammar (formalized, enforced)
Every `description` is: **`<succinct role/output clause>. sk-design <ownerMode> mode.`**
- The leading clause states the command's role/output succinctly — it is the keyword surface that `hubKeywordProjection` draws from.
- The trailing `sk-design <ownerMode> mode.` suffix binds the description back to the parent skill and the record's `ownerMode`, so any generated/pinned description resolves to the parent + mode.

The five current descriptions already conform; this phase **formalizes and enforces** the grammar rather than rewriting prose. If any description is found off-grammar, it is tightened on **both** the frontmatter and the metadata in lockstep (parity-preserving), never on one surface alone.

### Hub-keyword projection matrix (grounded in each current description)
Provenance — every token below is a literal substring of the record's current `description`; the checker enforces grounding, not this exact list.

| Command (`ownerMode`) | Grammar suffix (must end with) | `hubKeywordProjection` (substrings of `description`) |
|---|---|---|
| **audit** | `sk-design audit mode.` | accessibility, performance, responsive, anti-slop, scoring, hardening |
| **foundations** | `sk-design foundations mode.` | color, typography, layout, spacing, tokens, theming |
| **interface** | `sk-design interface mode.` | direction, palette, type, layout, motion |
| **md-generator** | `sk-design md-generator mode.` | CSS, Style Reference, DESIGN.md, extract |
| **motion** | `sk-design motion mode.` | animation, transitions, micro-interactions, reduced motion |

### Checker rules (added; FAIL conditions)
Stage 1 — metadata validation (violation → exit 2, INVALID):
1. `descriptionRole` missing, not a non-empty string, or not in the role allow-set (`hub-keyword-projection`).
2. `autoTriggerEligible` missing or not strictly the boolean `false`.
3. `hubKeywordProjection` not a non-empty string array.
4. Any `hubKeywordProjection` token is not a case-insensitive substring of the record's `description` (ungrounded projection).
5. `description` does not end with `sk-design <ownerMode> mode.` (grammar suffix violation), where `<ownerMode>` is the record's own `ownerMode`.

No new drift channel is added. The existing `description` frontmatter drift check (frontmatter `description` must equal metadata `description`) is preserved unchanged. PASS (exit 0) only when metadata is valid AND `drift=0` (frontmatter `description`/`argument-hint`/`allowed-tools` + all prior D2 channels).

#### Scope decision — the spec's "4-lane replay"
`spec.md` §4/§5 names a **4-lane replay** (advisor→hub, hub→mode, direct-command→packet, generated-pin→parent). The real targets named for this phase are `command-metadata.json`, the five wrappers, `mode-registry.json`, and `design-command-surface-check.mjs` — **none is a router-replay / gold-corpus harness** (live NL routing replay belongs to dimension D3 and its own phases). This plan therefore realizes each lane **deterministically on the named targets**:
- **advisor→hub** — `autoTriggerEligible:false` on every record declares descriptions are not direct-command auto-triggers, so a description-keyword match routes to the hub. Checker rule 2 enforces `false`.
- **hub→mode** — `hubKeywordProjection` lists the grounded keywords the hub uses to pick a mode. Checker rule 4 enforces grounding in the real description.
- **direct-command→packet** — the existing `ownerMode → workflowMode` invariant (a direct `/design:X` binds to its packet mode) is already checker-enforced and is preserved.
- **generated-pin→parent** — the `sk-design <ownerMode> mode.` grammar suffix binds any generated/pinned description back to the parent skill + mode. Checker rule 5 enforces the suffix.

**Open decision (flagged for the operator):** if the spec intends a literal live 4-lane NL routing replay corpus, that is a follow-on coupled to the D3 routing build, not this phase's named targets.

### Data Flow
1. Author `descriptionRole` + `autoTriggerEligible:false` + `hubKeywordProjection` on all five records in `command-metadata.json`; confirm each `description` is on-grammar (tighten in lockstep with frontmatter only if needed).
2. Extend the checker: Stage 1 role-field shape + fixed vocabulary + grounding + grammar-suffix rules.
3. Run the checker → `invalid=0 drift=0`; run a synthetic break to prove the gate bites; restore.
4. `node --check` the checker; confirm `mode-registry.json` byte-unchanged.

#### Expected transient state
After Phase 1 (metadata only), the not-yet-extended checker still passes (extra fields are ignored). After the checker is extended, a record missing any of the three fields or violating the grammar reports INVALID (exit 2) — the correct intermediate state, cleared once all five records carry the fields and conform.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the description-role fields (`command-metadata.json`)
- [x] Read each record's current `description`; confirm it ends with `sk-design <ownerMode> mode.` (grammar suffix)
- [x] Add `descriptionRole: "hub-keyword-projection"` and `autoTriggerEligible: false` to all five records
- [x] Add a non-empty `hubKeywordProjection` array per record, each token a literal substring of that record's `description` (use the §3 matrix as the grounded source)
- [x] If any `description` is off-grammar, tighten it on both the frontmatter and the metadata in lockstep (parity-preserving); otherwise leave descriptions byte-unchanged
- [x] Confirm valid JSON; no embedded spec/packet/phase ID or path (evergreen [HARD])

### Phase 2: Extend the checker
- [x] Add `descriptionRole`, `autoTriggerEligible`, `hubKeywordProjection` to the required-field set
- [x] Add a role allow-set (`hub-keyword-projection`); validate `descriptionRole` ∈ allow-set, `autoTriggerEligible === false`, `hubKeywordProjection` non-empty string array (rules 1–3)
- [x] Validate each `hubKeywordProjection` token is a case-insensitive substring of the record's `description` (rule 4 — grounding)
- [x] Validate each `description` ends with `sk-design ${ownerMode} mode.` (rule 5 — grammar suffix)
- [x] Preserve the existing `description` frontmatter drift check unchanged (no new drift channel); preserve the exit-code contract (0/1/2)
- [x] `node --check` the edited checker; confirm no spec/packet/phase ID or path embedded (evergreen [HARD])

### Phase 3: Verification
- [x] Run `node design-command-surface-check.mjs` → `invalid=0 drift=0`, exit 0
- [x] Confirm the frontmatter `description` drift channel is still 0 (no regression) and all prior D2 channels stay clean
- [x] Synthetic break: flip one `autoTriggerEligible` to `true` (and separately, break one grammar suffix and add one ungrounded keyword) → checker FAIL each time; restore → `invalid=0 drift=0`
- [x] Confirm `mode-registry.json` byte-unchanged; re-read mutated artifacts for evergreen; mark `checklist.md` with evidence

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `descriptionRole` / `autoTriggerEligible` / `hubKeywordProjection` present + well-formed on all 5 records | `node` + checker Stage 1 |
| Fixed vocabulary | `descriptionRole ∈ {hub-keyword-projection}`; `autoTriggerEligible === false` | checker Stage 1 |
| Grounding | every `hubKeywordProjection` token is a substring of the record's `description` | checker Stage 1 |
| Grammar | every `description` ends with `sk-design <ownerMode> mode.` | checker Stage 1 |
| No-regression | frontmatter `description` drift channel stays 0; prior D2 channels clean | checker drift report |
| Synthetic break | flip `autoTriggerEligible`, break the suffix, add an ungrounded keyword | checker exit 2 each, restore → 0 |
| Determinism | two runs produce byte-identical output | `diff` of two `--json` runs |
| Syntax | edited checker parses | `node --check design-command-surface-check.mjs` |
| Non-mutation | `mode-registry.json` unchanged | `git diff` / sha compare |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (D2-R3 SSOT) | Internal | Green | host for the three new fields; must exist with the prior-field records |
| `design-command-surface-check.mjs` (D2-R3 checker) | Internal | Green | the gate being extended; its `description` frontmatter channel must stay intact |
| `mode-registry.json` | Internal (read-only) | Green | `ownerMode` allow-set for the grammar suffix; never mutated |
| `commands/design/*.md` frontmatter `description` | Internal | Green | parity counterpart; touched only on lockstep grammar tightening |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** `descriptionRole` / `autoTriggerEligible` / `hubKeywordProjection` are metadata-only by contract. Projecting any of them into the frontmatter later would add a new drift channel and is out of scope; this phase keeps them metadata-only so the existing `description` parity stays the single description drift channel.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the role-field shape proves wrong, the grammar suffix proves too strict for a legitimate description, or the frontmatter `description` drift channel regresses.
- **Procedure**: revert the mutated files — remove `descriptionRole` / `autoTriggerEligible` / `hubKeywordProjection` from `command-metadata.json`, revert the checker to its pre-D2-R13 state, and (only if a description was tightened) restore the original `description` on both surfaces. `mode-registry.json` was never touched, so removal fully restores the prior D2 baseline (`invalid=0 drift=0`).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author description-role fields) ──> Phase 2 (Extend checker) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author description-role fields | None | Extend checker |
| Extend checker | Author description-role fields | Verify |
| Verify | Extend checker | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author description-role fields (5 records) | Low | 30–45 minutes |
| Extend checker (role fields + grammar) | Medium | 1–1.5 hours |
| Verification (incl. synthetic break) | Low | 30–45 minutes |
| **Total** | | **~2–2.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `mode-registry.json` sha captured before any work (proves non-mutation after)
- [x] Prior D2 baseline captured: `node design-command-surface-check.mjs` → `invalid=0 drift=0` before edits
- [x] Confirmed the mutated set: `command-metadata.json` + the checker (+ wrappers only on lockstep grammar tightening)

### Rollback Procedure
1. Remove `descriptionRole` / `autoTriggerEligible` / `hubKeywordProjection` from all five `command-metadata.json` records
2. Revert `design-command-surface-check.mjs` to its pre-D2-R13 state
3. If a `description` was tightened, restore the original on both the frontmatter and the metadata
4. Verify `git status` shows no other change; `mode-registry.json` sha matches pre-work capture; checker returns to `invalid=0 drift=0`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds descriptionRole + autoTriggerEligible:false + hubKeywordProjection (metadata-only) to command-metadata.json
- Formalizes the description grammar (<role/output clause>. sk-design <ownerMode> mode.) and enforces it in the checker
- Frontmatter description drift parity stays 0 (additive, no-regression); 4-lane replay realized on the named targets
-->
