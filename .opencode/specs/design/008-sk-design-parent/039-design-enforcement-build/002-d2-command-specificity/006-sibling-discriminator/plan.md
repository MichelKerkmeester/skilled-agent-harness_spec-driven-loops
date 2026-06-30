---
title: "Implementation Plan: D2-R6 — sibling discriminator + deferToHubWhen at the command layer"
description: "complete. Add a discriminator{whenToUse,preferSiblingWhen,pairWithHubWhen,sequence} block to command-metadata.json, derive each command's use-this-NOT-that-sibling lines from the child Use-when/When-NOT, generate an anchor-delimited discriminator section into the five wrappers, and extend the surface-check to enforce presence + reconciliation while keeping frontmatter drift at zero."
trigger_phrases:
  - "d2-r6 sibling discriminator plan"
  - "design command discriminator plan"
  - "deferToHubWhen command layer plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/006-sibling-discriminator"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify D2-R6 build and mark plan items complete with evidence"
    next_safe_action: "Run D2-R7 preconditions-and-failure-modes phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r6-sibling-discriminator"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Per-pair assertion home: checker-level sibling-coverage matrix on named targets (this plan) vs a D3 router-replay gold corpus (different dimension, not a named target here)"
    answered_questions: []
---
# Implementation Plan: D2-R6 — sibling discriminator + deferToHubWhen at the command layer

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
| **Inputs (read-only)** | `sk-design/mode-registry.json` (workflowModes), the five child packet `SKILL.md` Use-when / When-NOT blocks |
| **Mutated artifacts** | `sk-design/command-metadata.json`, `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`, `sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node design-command-surface-check.mjs` — deterministic, exit-coded; `node --check` on the edited checker |

### Overview
Today a caller reading any `/design:*` command cannot tell when a **sibling** command or the **hub** is the better entry — the wrapper carries no discriminator (`commands/design/interface.md:13`). This phase makes each command state, in one line per sibling, when to use **this** command and when to prefer a sibling or defer to the `sk-design` hub. The authoritative content lives in `command-metadata.json` as a new `discriminator{whenToUse, preferSiblingWhen, pairWithHubWhen, sequence}` block (one per record), derived from each child packet's `Use when` / `When NOT to Use` lines. A generator projects an anchor-delimited discriminator section into the five wrappers, and `design-command-surface-check.mjs` is **extended** to enforce the discriminator's shape, its reconciliation with the existing `deferToHubWhen` / `next` fields and the registry workflowModes, and its presence (per-sibling coverage) in each wrapper body.

The work is strictly **additive**: it adds one metadata field, one wrapper body section, and one checker stage. It does **not** touch the four frontmatter drift fields (`description`, `argument-hint`, `aliases`, `allowed-tools`), so the existing frontmatter drift channel stays at `0`. `mode-registry.json` is read-only and never mutated. The discriminator **wording stays advisory** — the checker proves the lines *exist and reconcile*, never that they read well.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R6 framing confirmed from `spec.md`: each command states a one-line "use this NOT that sibling when…" discriminator, reconciled with `deferToHubWhen` and the registry, presence checker-enforced, wording advisory — spec.md §2 Purpose
- [x] The five `workflowMode` keys (`interface`, `foundations`, `motion`, `audit`, `md-generator`) read from `mode-registry.json` — the sibling allow-set; checker reports `workflowModes=audit,foundations,interface,md-generator,motion`
- [x] Each child packet's `Use when` / `When NOT to Use` block read as the derivation source for `whenToUse` / `preferSiblingWhen` — §3 matrix transcribed
- [x] Scope frozen: only `command-metadata.json` + the five wrappers + `design-command-surface-check.mjs`; `mode-registry.json` read-only — `git status` shows seven files, registry diff empty

### Definition of Done
- [x] Every record in `command-metadata.json` carries a well-formed `discriminator` block; `discriminator.pairWithHubWhen === deferToHubWhen`; `preferSiblingWhen` covers exactly the other four design commands; `sequence.typicallyBefore ⊆ next` — Stage 1 invalid=0; independent node check confirms hub_eq_defer=true, sibling set = other four, seqBefore ⊆ next on all five
- [x] Each wrapper carries an anchor-delimited discriminator section naming all four siblings + a hub-defer line — e.g. interface.md:17-26 (four `/design:*` Prefer lines + `sk-design` hub line)
- [x] `node design-command-surface-check.mjs` exits 0 with `invalid=0 drift=0` (frontmatter + discriminator channels both clean) — STATUS=PASS invalid=0 drift=0
- [x] `node --check design-command-surface-check.mjs` passes (checker was edited) — NODE_CHECK=OK, exit 0
- [x] `mode-registry.json` is byte-unchanged — `git diff --stat` empty
- [x] No spec / packet / phase ID or spec path embedded in any mutated runtime artifact (evergreen [HARD]) — re-read of the three artifact classes clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT + stateless drift-gate, extended. The discriminator content is authored once in `command-metadata.json` (the existing command-surface SSOT), projected into the wrappers, and gate-enforced by the existing `design-command-surface-check.mjs`. This reuses the D2-R3 contract — frontmatter must equal metadata — and adds a body-presence + reconciliation channel for the discriminator.

### Key Components
- **`command-metadata.json`** — gains a `discriminator` object per record (the new authoritative content).
- **The five wrappers** — gain an anchor-delimited `sibling-discriminator` section (the `sibling-discriminator` anchor pair is the deterministic extraction handle) carrying the projected lines.
- **`design-command-surface-check.mjs`** — extended: Stage 1 validates the discriminator shape + reconciliation; a new discriminator-presence channel parses each wrapper body and confirms per-sibling coverage + a hub line.
- **`mode-registry.json`** — read-only `workflowMode` source; the sibling allow-set; never mutated.

### Discriminator data shape (added to every `command-metadata.json` record)
```json
"discriminator": {
  "whenToUse": "<one line: pick THIS command when …>",
  "preferSiblingWhen": [
    { "sibling": "/design:<other-mode>", "when": "<one line: prefer that sibling when …>" }
  ],
  "pairWithHubWhen": "<must equal this record's top-level deferToHubWhen>",
  "sequence": { "typicallyAfter": ["/design:…"], "typicallyBefore": ["/design:…"] }
}
```
Reconciliation rules the checker enforces:
- `pairWithHubWhen` is byte-equal to the record's existing top-level `deferToHubWhen` (one authored source, copied once into the discriminator).
- `preferSiblingWhen[].sibling` resolves to `/design:<workflowMode>` with `workflowMode ∈ mode-registry.json` workflowModes, and is never the record's own command.
- The **set** of `preferSiblingWhen[].sibling` equals exactly the other four design commands (full per-pair coverage — see §3 scope decision).
- `sequence.typicallyBefore ⊆ next`; every `sequence` entry is a real `/design:*` command and never self.

### Authored discriminator matrix (derived from the child Use-when / When-NOT)
Provenance — `explicit` = stated in the child's `When NOT to Use`; `boundary` = derived from the child's Family Boundary (md-generator captures vs siblings create). Wording is advisory; provenance is recorded so the implementer authors faithfully.

| Command (`whenToUse`) | Prefer `interface` | Prefer `foundations` | Prefer `motion` | Prefer `audit` | Prefer `md-generator` |
|---|---|---|---|---|---|
| **interface** — invent or reshape a distinctive interface direction | — | static token system: color/OKLCH, type, layout, spacing (explicit) | animation / transition choreography / reduced-motion (explicit) | findings-first review, a11y, performance, anti-slop scoring (explicit) | extracting a live site's measured CSS into `DESIGN.md` (explicit) |
| **foundations** — build or correct the static visual system | invent the overall interface direction / signature concept first (explicit) | — | animation, micro-interactions, reduced-motion (explicit) | review, score, a11y audit, hardening report (explicit) | extracting measured tokens from a live site into `DESIGN.md` (explicit) |
| **motion** — design purposeful animation / transitions / reduced-motion | invent the full visual direction or interface concept first (explicit) | static color, type, layout, responsive, theme-token work (explicit) | — | findings-first quality or motion-performance review (explicit) | capturing measured CSS / tokens from a live site (boundary) |
| **audit** — findings-first design QA, scoring, hardening | invent a new visual direction (explicit) | a static token system, palette, typography, layout plan (explicit) | create motion choreography (explicit) | — | extract measured CSS from a live site into `DESIGN.md` (boundary) |
| **md-generator** — extract a live site's real measured CSS into `DESIGN.md` | invent a new design direction — create, not capture (explicit) | author a static token / visual system from judgment, not measurement (boundary) | design animation / transition behavior (boundary) | review or score an existing design rather than extract it (boundary) | — |

Hub-defer line per command (`pairWithHubWhen`) is the existing `deferToHubWhen` string already in each record (e.g. interface: "the request is primarily static tokens, motion behavior, audit findings, or measured CSS extraction").

**Out of scope for the command-layer discriminator:** transport routing (`mcp-figma`, `mcp-open-design`, `mcp-chrome-devtools`) that appears in `md-generator`'s When-NOT — those are transports, not `/design:*` siblings. They stay in the child packet's When-NOT and are NOT encoded as siblings here.

### Wrapper section shape (projected into each `.opencode/commands/design/*.md`)
Each wrapper carries the `sibling-discriminator` anchor pair (the deterministic extraction handle) wrapping a `## WHEN TO USE THIS, NOT A SIBLING` heading:

```md
## WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** <whenToUse>.
- **Prefer `/design:<sibling>` when** <preferSiblingWhen line> (×4, one per sibling).
- **Defer to the `sk-design` hub when** <pairWithHubWhen>.
```

The anchor pair is the deterministic extraction handle. The existing PURPOSE / INSTRUCTIONS / Return-Status sections are preserved; the discriminator is inserted between PURPOSE and INSTRUCTIONS — the checker keys on the anchor, not the heading number.

### Checker rules (added; FAIL conditions)
Stage 1 — metadata validation (violation → exit 2, INVALID):
1. `discriminator` missing or not an object on any record.
2. `whenToUse` / `pairWithHubWhen` not a non-empty string.
3. `pairWithHubWhen !== deferToHubWhen`.
4. `preferSiblingWhen` not a non-empty array of `{sibling, when}`, any `sibling` not a `/design:*` command in the expected set, any `sibling` equal to self, or the sibling set ≠ the other four commands.
5. `sequence` malformed, any entry not a `/design:*` command, any self-reference, or `typicallyBefore ⊄ next`.

Discriminator-presence channel — wrapper body (violation → drift, exit 1):
6. The `sibling-discriminator` anchor block is absent from a wrapper.
7. The block does not name all four sibling command tokens (`/design:<sibling>`).
8. The block carries no hub-defer line (no `sk-design` / hub token).

Presence and coverage are diffed; **wording is not** (advisory). Discriminator-presence failures report on a distinct `kind=discriminator` line but count toward the single `drift` total. PASS (exit 0) only when metadata is valid AND `drift=0` across frontmatter + discriminator.

#### Scope decision — the spec's "per-pair replay fixtures"
`spec.md` §4/§5 names "per-pair replay fixtures asserting the right sibling/hub choice." The real targets named for this phase are the five wrappers, `command-metadata.json`, `mode-registry.json`, and `design-command-surface-check.mjs` — **none is a router-replay / gold-corpus harness** (that machinery belongs to dimension D3 and its own phases). This plan therefore realizes the per-pair assertion **deterministically on the named targets**: the checker's rule 4 requires each command's `preferSiblingWhen` to cover *exactly the other four commands* (the full per-pair matrix), and rule 3 binds the hub choice to `deferToHubWhen`. That gives a per-pair "right sibling / right hub" guarantee at the command layer without standing up cross-dimension D3 fixtures. **Open decision (flagged for the operator):** if the spec intends literal router-replay fixtures, that is a follow-on coupled to the D3 routing build, not this phase's named targets.

### Data Flow
1. Author the `discriminator` block on all five records in `command-metadata.json`, sourced from the §3 matrix.
2. Extend the checker: Stage 1 discriminator shape + reconciliation; new body-presence channel.
3. Generate the anchor-delimited discriminator section into the five wrappers from the metadata.
4. Run the checker → `invalid=0 drift=0`; `node --check` the checker; confirm `mode-registry.json` byte-unchanged.

#### Expected transient state
After Phase 1 (metadata only), the not-yet-extended checker still passes (extra fields are ignored). After the checker is extended but before the wrappers carry the section, the checker reports discriminator drift (exit 1) — the correct intermediate state, cleared when Phase 2 generates the wrapper sections.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the discriminator SSOT (`command-metadata.json`)
- [x] Read each child packet's `Use when` / `When NOT to Use` block; transcribe the §3 matrix lines per command
- [x] Add a `discriminator{whenToUse, preferSiblingWhen[], pairWithHubWhen, sequence}` block to all five records
- [x] Set `pairWithHubWhen` byte-equal to each record's existing `deferToHubWhen` — hub_eq_defer=true on all five
- [x] Cover exactly the other four commands in each `preferSiblingWhen`; set `sequence.typicallyBefore ⊆ next` — verified per record
- [x] Confirm valid JSON; no embedded spec/packet/phase ID or path (evergreen [HARD]) — `node -e require()` parses; grep clean

### Phase 2: Extend the checker + generate the wrapper sections
- [x] Add `discriminator` to required fields; implement Stage 1 shape + reconciliation rules (3, 4, 5) — checker lines 227-319
- [x] Implement the body-presence channel: extract the `sibling-discriminator` anchor block, assert four sibling tokens + a hub line; report `kind=discriminator` drift — checker lines 471-510
- [x] `node --check` the edited checker; confirm exit-code contract (0/1/2) preserved — NODE_CHECK=OK
- [x] Generate the anchor-delimited discriminator section into all five wrappers from the metadata (siblings + hub line) — five wrappers carry the section
- [x] Confirm no spec/packet/phase ID or path embedded in the checker or any wrapper (evergreen [HARD]) — re-read clean

### Phase 3: Verification
- [x] Run `node design-command-surface-check.mjs` → `invalid=0 drift=0`, exit 0 — STATUS=PASS
- [x] Confirm the frontmatter drift channel is still 0 (no regression on `description` / `argument-hint` / `aliases` / `allowed-tools`) — drift=0
- [x] Confirm `mode-registry.json` byte-unchanged (sha / `git diff`) — `git diff` empty
- [x] Re-read the three mutated runtime artifacts for evergreen; mark `checklist.md` with evidence — done

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `discriminator` present + well-formed on all 5 records | `node` + checker Stage 1 |
| Reconciliation | `pairWithHubWhen == deferToHubWhen`; siblings ∈ registry; full per-pair coverage; `typicallyBefore ⊆ next` | checker Stage 1 |
| Body presence | each wrapper's anchor block names 4 siblings + a hub line | checker discriminator channel |
| No-regression | frontmatter drift channel stays 0 | checker drift report (frontmatter `kind`) |
| Determinism | two runs produce byte-identical output | `diff` of two `--json` runs |
| Syntax | edited checker parses | `node --check design-command-surface-check.mjs` |
| Non-mutation | `mode-registry.json` unchanged | `git diff` / sha compare |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (D2-R3 SSOT) | Internal | Green | the host for the new `discriminator` block; must exist with the prior-field records |
| `design-command-surface-check.mjs` (D2-R3 checker) | Internal | Green | the gate being extended; its frontmatter channel must stay intact |
| `mode-registry.json` | Internal (read-only) | Green | sibling allow-set (workflowModes); unreadable → Stage 1 cannot reconcile |
| Child packet `SKILL.md` × 5 | Internal (read-only) | Green | derivation source for the discriminator lines |
| `commands/design/*.md` | Internal | Green | the wrappers that receive the generated section |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** the `discriminator` field shape is a contract the wrapper generator and the checker share. Renaming `preferSiblingWhen` / `pairWithHubWhen` / `sequence` later is a breaking change to both; this phase freezes that shape.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the discriminator shape proves wrong, the body-presence channel proves non-deterministic, or the frontmatter drift channel regresses.
- **Procedure**: revert the three mutated files — remove the `discriminator` block from `command-metadata.json`, remove the anchor-delimited section from the five wrappers, and revert the checker to its pre-D2-R6 state. `mode-registry.json` was never touched, so removal fully restores the D2-R5 baseline (`invalid=0 drift=0`).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author discriminator SSOT) ──> Phase 2 (Extend checker + generate wrappers) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author discriminator SSOT | None | Extend checker + generate wrappers |
| Extend checker + generate wrappers | Author discriminator SSOT | Verify |
| Verify | Extend checker + generate wrappers | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author discriminator SSOT (5 records) | Low | 45–60 minutes |
| Extend checker + generate 5 wrapper sections | Medium | 1.5–2 hours |
| Verification | Low | 30–45 minutes |
| **Total** | | **~3–3.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `mode-registry.json` sha captured before any work (proves non-mutation after) — `git diff` empty post-build
- [x] Confirmed exactly three runtime targets will be mutated (metadata, checker, five wrappers) — `git status` lists the seven files
- [x] D2-R5 baseline captured: `node design-command-surface-check.mjs` → `invalid=0 drift=0` before edits — additive change held it

### Rollback Procedure
1. Remove the `discriminator` block from all five `command-metadata.json` records
2. Remove the `sibling-discriminator` anchor section from the five wrappers
3. Revert `design-command-surface-check.mjs` to its pre-D2-R6 state
4. Verify `git status` shows no other change; `mode-registry.json` sha matches pre-work capture; checker returns to `invalid=0 drift=0`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds discriminator{whenToUse,preferSiblingWhen,pairWithHubWhen,sequence} to command-metadata.json
- Generates an anchor-delimited discriminator section into the five wrappers
- Extends design-command-surface-check.mjs (presence + reconciliation); frontmatter drift stays 0
-->
