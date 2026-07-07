---
title: "Implementation Plan: Parent-hub remediation program"
description: "Nine ordered work units fixing all 18 review findings — P0 transport canonization first, then the P1 enforcement/contract fixes, then the P2 doctrine/checker/metadata sweeps — with six operator decision forks and a 4/4-canon-clean done-bar."
trigger_phrases:
  - "parent hub remediation plan detail"
  - "999 sk-doc phase 023 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/023-parent-hub-remediation"
    last_updated_at: "2026-07-07T15:55:58.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the nine-work-unit remediation plan"
    next_safe_action: "Resolve the 6 decision forks; execute WU1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Parent-hub remediation program

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Hub config (SKILL.md, mode-registry.json, hub-router.json, graph-metadata.json, description.json); doctrine markdown + JSON templates; `parent-skill-check.cjs` (Node); advisor scorer (TS + Python) + skill-graph (TS + Python) |
| **Framework** | create-skill doctrine ↔ `parent-skill-check.cjs` ↔ four hubs ↔ system-skill-advisor |
| **Storage** | In-repo edits; `git mv` only if `feature_catalog/` relocates (WU1 fork) |
| **Testing** | `parent-skill-check.cjs` (all 4 hubs), advisor drift-guard + parity vitests, `skill-graph` ingestion, `validate.sh --strict` |

### Overview
Fix all 18 findings by moving each toward ONE canonical definition, in priority + dependency order. The guiding rule the review established: **where doctrine, checker, and practice disagree, move toward the checker + majority practice** (they embody the sane contract) EXCEPT where a deliberate new capability (the transport axis) is right and the doctrine simply never caught up — there, extend the canon. Nine work units; the P0 unblocks the fleet, the four P1 units close the real correctness/enforcement gaps, and the P2 sweeps reconcile the remaining doctrine/checker/metadata drift. Six forks need an operator call; each has a recommended default so the P2 work can start immediately on defaults.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 18 findings mapped to a work unit (022 review-report.md)
- [ ] The six decision forks resolved (see §6 Dependencies)

### Definition of Done (the "perfect" bar)
- [ ] `parent-skill-check.cjs` exits 0 on all four hubs under default strict mode (today: sk-design fails)
- [ ] One-identity is enforced at ingestion (a nested skill-shaped graph-metadata is rejected, not silently split)
- [ ] Every advisor command-bridge references a live command id and is covered by a registry↔advisor drift guard; TS/Python parity reconciled
- [ ] Doctrine, checker, and templates agree on: packetKind enum, surfaceBundle rule, surface naming, extension shapes, the 4-hub matrix
- [ ] Advisor drift-guard + parity vitests green; `validate.sh --strict` exit 0 for every touched spec folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### The nine work units (each: findings → fix → files → gate)

**WU1 — Canonize the transport axis · P0 · [PS-01]** — the only current hard failure.
- Extend `packetKind` enum to `workflow | surface | transport`: doctrine `parent_skills_nested_packets.md:53`, hub template `parent_skill_hub_template.md:58-61`, registry template (add a sixth mode example), checker `parent-skill-check.cjs:14,338`.
- Add a `transport-axis` row to the doctrine extension table and a `3g`-style checker constraint: a `transport` mode must be `mutatesWorkspace:false`, `routingClass:"metadata"`, carry a mandatory pairing contract, and sort last in tieBreak (sk-design already does).
- Resolve `feature_catalog/` at the sk-design hub root — **DECISION D1**.
- **Gate:** `parent-skill-check.cjs` exits 0 on sk-design AND still 0 on the other three (no enum regression). Restores 4/4 canon-clean.

**WU2 — surfaceBundle → conditional + base-outcome check · P1 · [PS-02, part PS-14]**
- Rewrite the unconditional `surfaceBundle` requirement to conditional (required iff any `packetKind:"surface"` mode; analogous transport rule) in `parent_hub_router_schema.md:88,307`, `create-skill/SKILL.md:245`, hub template checklist `parent_skill_hub_template.md:277`.
- Add checker assertions that `single`/`orderedBundle`/`defer` are present (today unchecked).
- **Gate:** all four routers pass; a synthetic surface-less hub with `surfaceBundle` no longer required.

**WU3 — Close the one-identity ingestion hole · P1 · [PS-03]**
- Teach `discoverGraphMetadataFiles` (`skill-graph-db.ts:610-635`) the hub boundary: stop descending once a directory has `graph-metadata.json`, OR hard-error on a second skill-shaped file beneath an identified skill root (naming the invariant). Skip `node_modules` in the walk.
- Optional: Python compiler emits a warning if a nested skill-shaped file exists.
- **Gate:** a planted `sk-x/<packet>/graph-metadata.json` with a valid `skill_id` is rejected (not indexed) by the TS scanner; existing 4 hubs still ingest to exactly one identity each.

**WU4 — Repair sk-code tool contracts · P1 · [PS-04, PS-05]**
- code-review `Write` vs `mutatesWorkspace:false` — **DECISION D2**; then encode.
- Remove `Task` from `sk-code/SKILL.md:4` (no mode grants it) — deterministic.
- Add two checker rules: `Write∈allowed ⇒ mutatesWorkspace:true unless annotated`; `hub allowed-tools == union of mode tool surfaces`.
- **Gate:** checker's new rules pass on all four hubs; sk-code frontmatter == its registry union.

**WU5 — Put the command-bridge lane under contract · P1 · [PS-06, PS-07]** — coordinate with the advisor track.
- `deep-model-benchmark` — **DECISION D3**; refresh the dead ids `/deep:start-model-benchmark-loop`→`/deep:model-benchmark` and `/deep:start-research/review-loop` in `projection.ts:66,140-141`.
- sk-doc `create:*` bridges — **DECISION D4**; reconcile TS(2)/Python(6)/registry(11) coverage; give the four orphan py bridges an owner or delete; document the deliberately-unbridged commands.
- Write the guard (mirror `routing-registry-drift-guard.vitest.ts`): no `BASE_ALIAS_GROUPS`/`INLINE_COMMAND_PROJECTIONS` entry may cite a command id lacking a file under `.opencode/commands/`; for each bridged sk-doc mode, advisor inline id + phrases + alias group must agree with the registry `command` field.
- **Gate:** new guard green; advisor drift-guard + parity vitests green; every bridge id resolves to a live command file.

**WU6 — sk-design one-file truth pass · P1+P2 · [PS-08, PS-09, PS-10, PS-17-case]** — depends on WU1.
- Rewrite `advisorRoutingContract` prose to the shipped state (prefixed folders, `folder==packetSkillName`, six modes, transport `command:null` by pairing) — `sk-design/mode-registry.json:12-14`.
- Delete scaffold prose (`sk-design/SKILL.md:195`, and sk-doc `mode-registry.json:4` SCAFFOLD STATE — PS-09).
- Align versions to 1.4.0.0 across router/SKILL/description (PS-10); add the transport row to the §1 mode table + `packetKind`/transport lines to the §2 discriminator.
- Lowercase the two non-lowercase aliases (`mode-registry.json:96,117`, PS-17).
- **Gate:** version lockstep; discriminator lists all six modes; checker still 0/0.

**WU7 — Doctrine refresh sweep · P2 · [PS-11, PS-12, PS-13, PS-17, PS-18]**
- Bare-noun surface naming → live hub-prefixed convention; drop stale `animation` (PS-11).
- Rebuild the extension matrix to four hubs (add sk-doc; fix the false deep-loop deprecated-modes cell; sk-design +transport-axis) and re-sync the router-schema worked examples to live, or mark "illustrative" (PS-12).
- Regenerate the registry template's `extensions` block from live shapes; add `driftGuard` to the template contract; add `deprecatedModes` location decision (**part of D5**) (PS-13).
- Document N:1 mode-multiplexing (allowed when the packet SKILL.md declares each workflowMode) + soften deep-loop's `== deep-<mode>` claim; document the two vocabulary strategies (mirrored vs compositional) (PS-17).
- Unify sk-code's "never process" vs "owns the workflow doctrine" into one formula; bless the shared-doctrine symlink mechanism in the references (PS-18).
- **Gate:** a fresh scaffold from the refreshed templates passes the checker; doctrine self-consistent (no doc contradicts another).

**WU8 — Checker hardening batch · P2 · [PS-14]**
- Add: `folder==packetSkillName` cross-checked against `grandfatheredFolderMismatch`; alias uniqueness; base-outcome presence (with WU2); `defaultMode` valid-mode-or-null; packet companion files (SKILL/README/changelog); tie-break workflow-first ordering (once WU1 settles transport placement). Delete stale `'context'` from `VALID_RUNTIME_LOOP_TYPES` (`parent-skill-check.cjs:53`). Optional `--vocab` flag shelling into `parent-hub-vocab-sync.cjs`.
- **Gate:** all four hubs still 0/0 under the hardened checker; each new rule has a red/green fixture.

**WU9 — Metadata dialect convergence · P2 · [PS-15, PS-16]**
- Guard-or-drop the description.json `modes[]`/`backend_kinds` duplicate (add a vitest asserting it equals the registry projection, or remove it).
- Add a `design` (or generic `sk-hub`) family to `ALLOWED_FAMILIES` in all three mirrors (`skill_graph_compiler.py:38`, `skill-graph-db.ts:141`, `parent-skill-check.cjs:43`) and migrate sk-design off the `sk-code` shoehorn — **DECISION D6**; standardize `metadata.family` to the graph family.
- Strip `packet_id` from deep-loop's skill graph-metadata; delete the orphan `mutating` (or set it on all four lanes); standardize `deprecated`/`importance_tier` via the graph-metadata template.
- Register `command-metadata.json` in the doctrine as a declared surface with a registry-sync rule (and feed it into WU5's guard); add the doctrine "optional per-mode fields" table (PS-15).
- **Gate:** family reasoning treats sk-design as a design hub; description.json guarded or dropped; checker/doctrine know `command-metadata.json`.

### Execution mechanics
- Deterministic edits for config/renames (never an LLM for `git mv`); scoped 0-leak commits (the branch has heavy concurrent churn). Doctrine/prose refactors may use a Fable-5/GPT-5.5 agent, each output verified by a fresh reviewer + the checker.
- Each WU is a commit (or a small commit cluster) gated on `parent-skill-check.cjs` (4 hubs) + the WU-specific tests; advisor WUs also run the drift-guard + parity vitests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Extract all 18 findings + recommendations from the 022 review
- [ ] Operator resolves decision forks D1–D6

### Phase 2: Implementation (ordered)
- [ ] WU1 (P0) — canonize transport; restore 4/4 canon-clean
- [ ] WU2, WU3, WU4, WU5 (P1) — surfaceBundle rule, ingestion guard, sk-code contracts, command-bridge contract+guard
- [ ] WU6 (P1+P2) — sk-design truth pass (after WU1)
- [ ] WU7, WU8, WU9 (P2) — doctrine sweep, checker hardening, metadata convergence

### Phase 3: Verification
- [ ] 4/4 `parent-skill-check` clean; advisor + parity vitests green; ingestion guard proven with a fixture
- [ ] `validate.sh --strict` on every touched spec folder; each WU's done-bar met
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Canon check | All 4 hubs, after each WU | `parent-skill-check.cjs` (default strict) |
| Advisor integrity | WU5 | `routing-registry-drift-guard.vitest.ts` + parity suite + new create:*/bridge guard |
| Ingestion | WU3 | planted-fixture red test → TS scanner rejects; 4 hubs still 1 identity |
| Checker fixtures | WU8 | red/green fixture per new rule |
| Spec validation | Every touched folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### Decision forks (operator resolves before the owning WU executes)

| ID | Fork | Recommended default |
|----|------|---------------------|
| D1 | PS-01 `feature_catalog/` at sk-design hub root | Relocate under a packet or `shared/` (consistency with deep-loop) over allowlisting |
| D1b | PS-01 transport shape | Canonize `transport` (preserve the documented semantics) over remodel-as-surface |
| D2 | PS-04 code-review mutation | If review artifacts land in-repo → `mutatesWorkspace:true` (scope=report artifacts); else keep false + annotate the `Write` grant |
| D3 | PS-06 `deep-model-benchmark` advisor lane | Registry is right → delete the TS NL lanes, keep literal slash-marker only (simplest, matches "not an advisor entry") |
| D4 | PS-07 sk-doc `create:*` bridges | Declare them: mark the bridged modes, add a sk-doc advisor-projection + drift guard; reconcile coverage |
| D5 | PS-13 `deprecatedModes` location | Move under `extensions["deprecated-modes"]` to match the template (or bless top-level once, in doctrine) |
| D6 | PS-16 family | Add generic `sk-hub` family (future-proofs non-code/design hubs) over a design-only family |

### Other dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Advisor scorer track quiet for WU5 | Internal | Coordinate | WU5 pauses if the advisor lane is actively editing scorer files |
| Concurrent branch churn | Internal | Active | 0-leak scoped commits per WU |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a WU makes a hub fail the checker or a doctrine edit contradicts another.
- **Procedure**: each WU is an isolated commit; `git revert` the WU restores its files. WU1 is highest-blast (touches the enum in five places) — land + verify 4/4 before any dependent WU. The advisor WU5 is one atomic commit + flags the pending 193-row re-baseline, so it reverts cleanly.
<!-- /ANCHOR:rollback -->
