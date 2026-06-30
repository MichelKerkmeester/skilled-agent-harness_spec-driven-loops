---
title: "Implementation Plan: DESIGN router intent lane in all 3 CLI dictionaries"
description: "Additive DESIGN intent lane (INTENT_SIGNALS key, weight 4) in the cli-codex / cli-claude-code / cli-opencode provider dictionaries, making design intent a recognized weighted routing signal reconciled with the hub-router vocabulary, resolved INTENT_SIGNALS-only (no RESOURCE_MAP target) because the router same-skill guard rejects cross-skill paths, with zero regression on the existing routes and the sk-design hubRoute scorer."
trigger_phrases:
  - "design router intent lane plan"
  - "DESIGN lane cli provider dictionary"
  - "cross-cli design intent routing"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/004-design-router-intent-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reconcile plan to INTENT_SIGNALS-only DESIGN lane; mark DoR and DoD complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r4-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: DESIGN router intent lane in all 3 CLI dictionaries

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Markdown provider dictionaries inside three cli-* skills (fenced Python literals) |
| **Mutation class** | Additive only — one new `DESIGN` key in `INTENT_SIGNALS` per cli-*; `RESOURCE_MAP` unchanged |
| **Router engine** | Shared smart-router helpers (`shared_smart_router.md`); replayed by `router-replay.cjs` |
| **Verification** | Static read of the three dictionaries + the sk-design `hubRoute` scorer re-run |
| **Enforcement class** | enforceable (P1) |

### Overview
The deterministic cli-* router lowercases the prompt, boundary-matches keywords, scores intents, and conditional-loads `RESOURCE_MAP[intent]`. None of the three cli-* provider dictionaries declared a design intent, so design work dispatched to a child CLI had no keyword-triggered lane — design phrasing scored zero and fell through to the generic fallback. This phase adds a coarse `DESIGN` intent (weight 4, keywords reconciled with the hub-router vocabulary) to `INTENT_SIGNALS` in all three dictionaries, making design intent a recognized, weighted routing signal in each child's provider dictionary so design work routes to sk-design rather than being lost in transport. The lane was resolved INTENT_SIGNALS-only: no `RESOURCE_MAP["DESIGN"]` target was added, because the router same-skill guard rejects cross-skill paths and non-`.md` targets and no skill-local design `.md` exists. The design resource is reached through the always-fires D5-R1 `Design Standards Loading` rule and the D5-R3 dispatch manifest; the lane composes with them rather than duplicating them.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source of truth read (phase `spec.md`) — read before authoring
- [x] Research item located (`research.md` §8, D5-R4 row) — located
- [x] Exact target named and confirmed against the live dictionary — `INTENT_SIGNALS` in the three cli-* SKILLs
- [x] Reconciliation sources identified — hub-router vocabulary; the D5-R1 Design Standards Loading rule
- [x] Precondition resolved: a `RESOURCE_MAP` target is not added — guard rejects cross-skill paths and no skill-local design `.md` exists, so the lane is INTENT_SIGNALS-only (see §6)

### Definition of Done
- [x] `DESIGN` lane defined in all three cli-* `INTENT_SIGNALS` with parallel keyword sets — weight 4, identical keywords in each
- [x] Every `DESIGN` keyword traces to a hub-router vocabulary alias or hub-identity token — reconciled
- [x] No `RESOURCE_MAP["DESIGN"]` entry — `RESOURCE_MAP` unchanged in every cli-*; the guard-violating cross-skill path is avoided
- [x] A WHY comment states the INTENT_SIGNALS-only resolution and where the durable contract lives — present in all three
- [x] No-regression confirmed: existing cli-* routes byte-identical, GLM WIP byte-identical, hubRoute scorer 13 pass / 5 known-gap / 0 regression
- [x] Evergreen: the lane carries no spec/packet/phase/finding IDs or `specs/` paths

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Exact target
The build mutates exactly the provider dictionaries (the "cli reference" option), NOT `hub-router.json` and NOT `router-replay.cjs`:

| File | Block | Change |
|------|-------|--------|
| `.opencode/skills/cli-codex/SKILL.md` | `INTENT_SIGNALS` | Add one `DESIGN` key (weight 4) + a WHY comment; `RESOURCE_MAP` unchanged |
| `.opencode/skills/cli-claude-code/SKILL.md` | `INTENT_SIGNALS` | Add the same `DESIGN` key + WHY comment (parallel); `RESOURCE_MAP` unchanged |
| `.opencode/skills/cli-opencode/SKILL.md` | `INTENT_SIGNALS` | Add the same `DESIGN` key + WHY comment, stacked on GLM WIP; `RESOURCE_MAP` unchanged |

- `hub-router.json` is a **reconciliation source and a no-regression guard only** — never edited here.
- `router-replay.cjs` is the **verification harness only** — it parses any new `INTENT_SIGNALS` key generically, so no engine change is required.

### Lane shape
- `INTENT_SIGNALS["DESIGN"] = { weight: 4, keywords: [...] }` — weight 4 matches every cli-* primary intent and every hub-router design-mode signal weight.
- **No `RESOURCE_MAP["DESIGN"]`** — the router same-skill guard (`_guard_in_skill`) rejects cross-skill paths and any non-`.md` target, and no skill-local design `.md` exists in any cli-* skill root. A `RESOURCE_MAP["DESIGN"]` target would therefore be a guard-violating dangling cross-skill reference. The design resource is reached through the D5-R1 ALWAYS rule and the D5-R3 manifest instead.

### Reconciliation rules
1. **Hub-router vocabulary** — each `DESIGN` keyword is drawn from the hub-router vocabulary alias classes (interface / foundations / motion / audit / md-generator natural-language aliases) or the hub-identity tokens; no net-new design vocabulary is invented in the cli dictionary. The lane is a single coarse design-intent gate, not a per-mode router (mode resolution stays the child's job).
2. **Design Standards Loading ALWAYS rule (D5-R1)** — the keyword-triggered `DESIGN` lane and the always-fires `Design Standards Loading` rule compose: the lane is the fast scored keyword path; the ALWAYS rule remains the phrasing-independent safety net that loads sk-design. The lane issues no competing load instruction — it has no `RESOURCE_MAP` target — so the two cannot contradict.

### Data flow (child dispatch)
1. Parent dispatches design work to a child CLI with the design contract inlined in the prompt (the D5-R3 manifest).
2. Child router lowercases + boundary-matches; a `DESIGN` keyword hit scores the `DESIGN` intent, making design intent a recognized routing signal.
3. The always-fires Design Standards Loading rule independently guarantees the sk-design contract regardless of which intent scored.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions & Baseline
- [x] Confirm no skill-local design `.md` is resolvable inside any cli-* skill root, so a `RESOURCE_MAP` target is not viable; resolve the lane to INTENT_SIGNALS-only — confirmed; resolution recorded in §6 and spec RISKS
- [x] Capture baseline: the existing cli-* intents + resources per dictionary, and the current hubRoute scorer result (13 pass / 5 known-gap / 0 regression) — captured

### Phase 2: Define the lane
- [x] Compose the reconciled `DESIGN` keyword set (every entry traceable to a hub-router alias or hub-identity token) — composed
- [x] Add `DESIGN` to `INTENT_SIGNALS` (weight 4) + a WHY comment in cli-codex — added (line 112; WHY lines 109-111)
- [x] Mirror the identical `DESIGN` lane into cli-claude-code — added (line 113; WHY lines 110-112)
- [x] Mirror the identical `DESIGN` lane into cli-opencode (stacked on GLM WIP) — added (line 127; WHY lines 124-126)

### Phase 3: Verification
- [x] Static read: design intent is a recognized weighted `INTENT_SIGNALS` signal in all three cli-*; no `RESOURCE_MAP["DESIGN"]` exists — verified by grep
- [x] Parity check: all three siblings define the lane with an identical keyword set — verified byte-identical keyword sets
- [x] No-regression: existing routes byte-identical, GLM WIP byte-identical, hubRoute scorer 13 / 5 / 0 — orchestrator-confirmed
- [x] Evergreen scan over the diff: no spec/packet/phase/finding IDs, no `specs/` paths — clean
- [x] Mark checklist items with evidence — done

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Signal presence | `DESIGN` is a weighted `INTENT_SIGNALS` key in all three cli-* | Static grep of the dictionaries |
| Resource policy | No `DESIGN` key in any `RESOURCE_MAP` (guard-safe) | Static grep of the `RESOURCE_MAP` blocks |
| Parity | Lane present + identical across all three cli-* | Cross-sibling diff of the `DESIGN` keyword set |
| No-regression (routes) | The existing intents/resources unchanged | Pre/post diff of the dictionaries |
| No-regression (GLM) | The concurrent GLM WIP in cli-opencode byte-identical | Pre/post diff of the GLM markers |
| No-regression (hub) | sk-design hubRoute scorer 13 / 5 / 0 | sk-design `hubRoute` scorer re-run |
| Evergreen | No ephemeral IDs/paths in the lane | Diff scan |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Hub-router vocabulary (alias classes + hub-identity) | Internal (read-only) | Available | Cannot reconcile keywords; lane would risk vocabulary drift |
| `Design Standards Loading` ALWAYS rule (D5-R1) + D5-R3 manifest | Internal (read-only) | Landed | The durable design loading contract the lane composes with |
| `_guard_in_skill` same-skill path guard | Internal (read-only harness) | Available | Its cross-skill / non-`.md` rejection is the reason no `RESOURCE_MAP` target is added |
| sk-design hubRoute scorer (13 / 5 / 0 baseline) | Internal (read-only harness) | Available | Cannot prove zero hub-route regression |

> **Precondition resolution (INTENT_SIGNALS-only):** `_guard_in_skill` resolves a `RESOURCE_MAP` target against the cli-* skill root and rejects anything escaping it or not ending in `.md`. No skill-local design `.md` exists in any cli-* root, so a `RESOURCE_MAP["DESIGN"]` target would be a guard-violating dangling cross-skill reference that breaks routing. The lane is therefore INTENT_SIGNALS-only; the design resource is reached via the D5-R1 ALWAYS rule + the D5-R3 manifest. This is a sanctioned deviation from the spec scaffold's "INTENT_SIGNALS + RESOURCE_MAP" wording.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An existing route changes behavior, or the hubRoute scorer drops below 13 / 5 / 0.
- **Procedure**: The change is a single additive `DESIGN` key per dictionary — remove the `DESIGN` entry (and its WHY comment) from `INTENT_SIGNALS` in each cli-* to return to the captured baseline.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions+Baseline) ──> Phase 2 (Define lane x3) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions & Baseline | Guard semantics + hub vocabulary | Define lane |
| Define lane | Preconditions, hub vocabulary | Verification |
| Verification | Define lane | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions & Baseline | Low | 20-30 minutes |
| Define lane (x3 dictionaries) | Low | 30-45 minutes |
| Verification (static read + scorer + parity) | Low | 30-45 minutes |
| **Total** | | **~1.5-2 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] Baseline captured (existing routes per dictionary, hubRoute 13 / 5 / 0)
- [x] Precondition resolved: INTENT_SIGNALS-only, no `RESOURCE_MAP` target (guard + no skill-local design `.md`)

### Rollback Procedure
1. **Immediate**: Delete the `DESIGN` entry and its WHY comment from `INTENT_SIGNALS` in the affected cli-*.
2. **Re-verify**: Re-read the dictionary; confirm the existing routes match the captured baseline.
3. **Confirm hub**: Re-run the hubRoute scorer; confirm 13 / 5 / 0 restored.

### Data Reversal
- **Has data migrations?** No — markdown dictionary edits only, no persisted state.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Additive DESIGN intent lane across three cli-* provider dictionaries (INTENT_SIGNALS-only)
- Exact target = cli reference (provider dictionaries); hub-router.json + router-replay.cjs are reconciliation/verification only
- No RESOURCE_MAP["DESIGN"]: guard rejects cross-skill paths, no skill-local design .md exists; lane composes with D5-R1 + D5-R3
- No-regression contract: existing routes unchanged, GLM WIP unchanged, hubRoute 13/5/0
- Evergreen: no IDs/paths in the lane
-->
</content>
