---
title: "Implementation Plan: create-skill contract unification"
description: "Seven work units in three phases — author one machine-readable contract (keystone), unify validation (strict mode + kind-aware gate + exact parsing), then unify generation (render init from assets + --kind parent + conditional templates) — each mapped to an audit finding with real file:line anchors and a verification gate."
trigger_phrases:
  - "create-skill contract unification plan"
  - "014 sk-doc phase 028 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
    last_updated_at: "2026-07-13T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the seven-work-unit three-phase plan"
    next_safe_action: "Operator resolves the description-budget fork, then execute Phase 1"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/init_skill.py"
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
      - ".opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-skill contract unification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python validators (`package_skill.py`, `quick_validate.py`, `init_skill.py`); Node checker (`parent-skill-check.cjs`); markdown/JSON templates under `assets/` |
| **Framework** | Contract (new, single source) → consumed by templates + initializer + `package_skill.py` + `parent-skill-check.cjs` |
| **Storage** | In-repo edits; one new machine-readable contract file under `create-skill/` |
| **Testing** | New pytest/fixtures (contract load, strict mode, exact parsing, kind-aware dispatch, ZIP edges); `parent-skill-check.cjs` on sk-doc; `validate.sh --strict` |

### Overview
The audit's nine findings share one root: the create-skill contract is declared three times — an embedded `SKILL_TEMPLATE` in `init_skill.py`, the `assets/` templates, and three validators that disagree. The fix is single-source. **Phase 1 authors the keystone contract** (WU1) — section order, description budget, required rules, tool rules, supported packet kinds — plus the fixture scaffolding that every later WU verifies against. **Phase 2 unifies validation**: strict mode (WU2) promotes documented requirements to failures, a kind-aware completion gate (WU3) dispatches `parent-skill-check.cjs` for parents, and exact-structure parsing (WU5) replaces substring/regex checks. **Phase 3 unifies generation**: `init_skill.py` renders from `assets/` and gains `--kind parent` (WU4), and the parent templates render conditionally from declared packet types (WU6). WU7 is the fixture suite that gates the whole program, including the two inferred ZIP edge cases. One operator fork (the description budget) carries a recommended default.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All nine findings verified at file:line against HEAD (source audit + this plan's re-check)
- [x] The single root cause (triplicated contract) identified
- [ ] The description-budget fork resolved (see §6 / ADR-003)

### Definition of Done (the "single-source" bar)
- [ ] One machine-readable contract declares section order, description budget, required rules, tool rules, and packet kinds
- [ ] `init_skill.py` renders from `assets/`; the embedded `SKILL_TEMPLATE` is removed; `--kind parent` produces a valid hub skeleton
- [ ] `package_skill.py --check --strict` fails on the demoted requirements; warning mode stays the default
- [ ] The documented completion gate is kind-aware; a parent hub cannot pass without `parent-skill-check.cjs`
- [ ] Exact-structure parsing replaces substring/regex; `validate.sh --strict` passes on every touched folder; `parent-skill-check.cjs` stays 0/0 on sk-doc
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Each work unit keeps its finding number for traceability. Each: finding → fix → files (real anchors) → gate.

### Phase 1 — the keystone contract

**WU1 — One machine-readable create-skill contract · P0 · findings 2,4,7**
- Author `create-skill/contract.json` (or `.yaml`) declaring: required `SKILL.md` section order (`WHEN TO USE`, `SMART ROUTING`, `HOW IT WORKS`, `RULES`, `REFERENCES`); RULES subsections (`ALWAYS`, `NEVER`, `ESCALATE`); the description budget (one value — see ADR-003); the `allowed-tools` array rule; supported packet kinds (`standalone`, `parent`) and per-kind required files.
- Derive the schema from the UNION of what `package_skill.py`, `quick_validate.py`, and the `assets/` templates currently assert, so nothing is lost.
- **Gate**: a loader test reads the contract from both Python and Node; the `assets/skill/skill_md_template.md` section order matches the contract (no third opinion).

**WU7-PREP — Fixture scaffolding · P1 · findings 3,6,8,9 (PREP in Phase 1)**
- Stand up the fixture dirs the later WUs assert against: valid standalone; invalid frontmatter + scalar `allowed-tools`; warning-only doc; workflow-only parent; parent with surface packets; parent with transport packets; duplicate/extra `tieBreak`; hidden-directory packaging; output-dir-inside-source packaging.
- **Gate**: fixtures exist and the current validators run over them (baseline captured before any fix).

### Phase 2 — unify validation

**WU2 — Strict validation mode · P1 · finding 3**
- `package_skill.py --check` demotes documented requirements to warnings and exits success (`package_skill.py:185-192` description length + TODO are `warnings.append`; missing RULES subsections, resource frontmatter, smart-router markers, placeholder examples, non-standard names are warning-only). Add `--strict` that promotes contract-required items (from WU1) to failures. Keep warning mode as the default for back-compat.
- **Gate**: a warning-only fixture passes `--check`, fails `--check --strict` naming each promoted item.

**WU3 — Kind-aware completion gate · P1 · finding 5**
- The documented gate (`create-skill/SKILL.md:25`, SUCCESS CRITERIA) names `package_skill.py <path> --check` for both kinds, but that validates a standalone folder; parent invariants live in `parent-skill-check.cjs` (`.opencode/commands/doctor/scripts/`), which the create-skill flow never invokes. Add a dispatcher: detect kind (contract), run package validation for standalone; run package validation + `parent-skill-check.cjs` for parent. Rename the documented completion command to the dispatcher.
- **Gate**: a parent-hub fixture fails the dispatcher when a parent invariant is broken; passes when whole; standalone path unchanged.

**WU5 — Exact-structure parsing · P2 · findings 6,8**
- Replace permissive checks with exact parsing: parse frontmatter as YAML (not `'name:' in frontmatter`, `package_skill.py:156`; not `re.search(r'name:…')`, `:159`); require `allowed-tools` to be a real array (`:202` only checks `startswith('[')`); match required H2 headings exactly after stripping numbering/emoji (not substring); validate the nested packet `SKILL.md` frontmatter `name` against `packetSkillName`; require `tieBreak` to be an exact permutation of registered modes (`parent-skill-check.cjs:357-393`, `:727-756`).
- **Gate**: malformed-frontmatter and scalar-`allowed-tools` fixtures fail; a substring-only heading no longer passes; a duplicate `tieBreak` entry reds.

### Phase 3 — unify generation

**WU4 — Render init_skill.py from assets + `--kind parent` · P0 · findings 1,2**
- `init_skill.py:29-160` embeds a `SKILL_TEMPLATE` that has drifted from `assets/skill/skill_md_template.md` (REFERENCES at #3 vs last; OVERVIEW omitted; a smaller router than the canonical resilience pattern). Render from `assets/` instead of the embedded copy. Add `--kind {standalone,parent}`: `parent` scaffolds the hub skeleton (thin `SKILL.md`, `mode-registry.json`, `hub-router.json`, one-identity `graph-metadata.json`, `description.json`, empty packet dirs + `shared/`) from `assets/parent_skill/`.
- **Gate**: a golden-diff fixture asserts generated standalone output equals the canonical template; `--kind parent` output passes `parent-skill-check.cjs`.

**WU6 — Conditional parent-template rendering · P2 · finding 7**
- The parent templates hardcode fields not valid for every parent: `[Read, Write, Edit, Bash, Grep, Glob]` (`parent_skill_hub_template.md:103-123`) though the checker wants the exact packet-tool union; `surfaceBundle` (`parent_skill_hub_router_template.json:12-22`) even with no surface packets; a root `README.md` in the graph template (`parent_skill_graph_metadata_template.json:82-94`) the contract does not require. Render these conditionally from the declared packet types (WU1 contract), computing the tool union from packet surfaces.
- **Gate**: a workflow-only parent fixture generates with no `surfaceBundle` and a computed tool union; a surface-bearing parent includes it.

### Guiding rule
Where a template or validator disagrees with another, move both to read the WU1 contract; make a TEST the single enforcer so a future edit cannot re-introduce a divergent copy. The hub routing architecture is confirmed sound and is not touched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Work Units | Nature |
|---------|------------|--------|
| `create-skill/contract.json` (new) | WU1 | The single source of truth |
| `init_skill.py` | WU4 | Render from assets; drop embedded template; add `--kind parent` |
| `package_skill.py` | WU2, WU5 | Strict mode; exact YAML/array/heading parsing |
| completion-gate dispatcher (new/renamed) | WU3 | Kind-aware: package check ± `parent-skill-check.cjs` |
| `assets/skill/` + `assets/parent_skill/` templates | WU1, WU6 | Read the contract; render conditionally |
| `parent-skill-check.cjs` | WU3, WU5 | Dispatched by the gate; `tieBreak`/name exactness from the contract |
| fixture suite (new) | WU7 | Golden + mutant fixtures incl. ZIP edges |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-verify all file:line anchors against HEAD; capture baseline (`package_skill.py --check` on create-skill + sk-doc; `parent-skill-check.cjs` 0/0)
- [ ] WU1 — author the machine-readable contract from the union of current rules
- [ ] WU7-PREP — stand up the fixture dirs (gate-free)

### Phase 2: Core Implementation
- [ ] WU2 — strict validation mode (opt-in; warning mode default)
- [ ] WU3 — kind-aware completion gate dispatcher
- [ ] WU5 — exact-structure parsing (YAML, array, heading, name, tieBreak)
- [ ] WU4 — render `init_skill.py` from assets + `--kind parent`
- [ ] WU6 — conditional parent-template rendering

### Phase 3: Verification
- [ ] WU7 — full fixture suite green (golden + mutant + ZIP edges)
- [ ] `parent-skill-check.cjs` stays 0/0 on sk-doc after every WU
- [ ] `validate.sh --strict` on every touched spec folder; fleet audit under `--strict` before requiring it
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract load | WU1 | Python + Node both read the one contract; assert asset order matches |
| Strict mode | WU2 | warning-only fixture: passes `--check`, fails `--check --strict` |
| Kind dispatch | WU3 | parent fixture requires `parent-skill-check.cjs`; standalone unchanged |
| Exact parsing | WU5 | malformed frontmatter, scalar `allowed-tools`, substring heading, dup `tieBreak` all red |
| Generation | WU4 | golden-diff of generated standalone vs canonical template; `--kind parent` passes the checker |
| Conditional templates | WU6 | workflow-only vs surface-bearing parent render correctly |
| ZIP edges | WU7 | hidden-ancestor exclusion; output-dir-inside-source not archived |
| Spec validation | Every touched folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### Decision forks (operator resolves before the owning WU executes)

| ID | Fork | Recommended default |
|----|------|---------------------|
| D1 | WU1/WU2 description budget: ≤130 soft (workflow) vs 150-300 (package_skill) | Adopt ≤130 soft target + retained hard cap; retire the 150-300 recommendation; warn-not-fail on legacy descriptions until re-trimmed |

### Other dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Description-budget fork (D1) | Internal | Pending | WU1 contract value + WU2 strict threshold wait |
| `parent-skill-check.cjs` (external to packet) | Internal | Available | WU3 dispatch + WU5 exactness read the shared contract |
| Concurrent branch churn | Internal | Active | 0-leak scoped commits per WU |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a WU reds `parent-skill-check.cjs` on sk-doc, or strict mode reds a valid skill, or generated output diverges from the canonical template.
- **Procedure**: each WU is an isolated commit; `git revert` restores its files. WU1 (the contract) is highest-leverage; land and verify the dual-language loader before any consumer WU. Strict mode ships opt-in, so it cannot block completion until deliberately required.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract + Fixtures) ──> Phase 2 (Validation: WU2,WU3,WU5) ──> Phase 3 (Generation: WU4,WU6) ──> Verify (WU7)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Contract + Fixtures | None | 2, 3 |
| 2 Validation | 1 (contract + fixtures) | Verify |
| 3 Generation | 1 (contract) | Verify |
| Verify | 2, 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Contract + Fixtures (WU1, WU7-PREP) | Medium | ~1.5 days |
| 2 Validation (WU2, WU3, WU5) | Medium | ~2 days |
| 3 Generation (WU4, WU6) | Medium | ~1.5 days |
| Verify (WU7) | Low | ~0.5 day |
| **Total** | | **~5.5 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured: `package_skill.py --check` on create-skill (valid:true, 2 warns) + sk-doc; `parent-skill-check.cjs` 0/0
- [ ] Fleet audited under `--strict` before strict is made a completion requirement

### Rollback Procedure
1. **Immediate**: revert the offending WU commit (each WU is atomic).
2. **Strict mode**: if it reds valid skills, keep it opt-in and widen the grandfather allowlist; do not require it at completion yet.
3. **Generation**: if `init_skill.py` render diverges, revert to the embedded template until the golden-diff fixture is green.
4. **Verify**: re-run `parent-skill-check.cjs` on sk-doc to confirm 0/0.

### Data Reversal
- **Has data migrations?** No — validation/generation only; no data or schema migration.
- **Reversal procedure**: none required; all edits are code/template/fixture.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
        ┌──── Phase 1: WU1 contract + WU7-PREP fixtures ────┐
        ▼                        ▼                          ▼
   WU2 (strict)            WU3 (kind gate)            WU5 (exact parse)
        │                        │                          │
        └────────────┬───────────┴──────────────┬───────────┘
                     ▼                           ▼
              WU4 (render+kind)          WU6 (conditional templates)
                     │                           │
                     └────────────┬──────────────┘
                                  ▼
                          WU7 full fixture suite (verify)
```

### Dependency Matrix

| Work Unit | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| WU1 | Phase 1 | the single contract | every consumer WU |
| WU2 | WU1 | strict mode | strict completion requirement |
| WU3 | WU1 | kind-aware gate | parent-proof completion |
| WU5 | WU1 | exact parsing | trustworthy checks |
| WU4 | WU1 | render-from-assets + `--kind parent` | automated parent scaffold |
| WU6 | WU1 | conditional templates | clean parent generation |
| WU7 | WU1–WU6 | golden+mutant+ZIP fixtures | program sign-off |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **WU1 contract** — CRITICAL (every other WU reads it)
2. **WU7-PREP fixtures** — CRITICAL (every WU verifies against them)
3. **WU2 / WU3 / WU5** — parallelizable once the contract exists
4. **WU4 / WU6** — generation, after the contract stabilizes
5. **WU7 full suite** — final sign-off

**Parallel opportunities**: WU2, WU3, WU5 are independent after WU1; WU4 and WU6 can proceed alongside once the contract is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract + fixtures | one contract loads in Python + Node; fixture dirs baseline-captured | End Phase 1 |
| M2 | Validation unified | strict mode reds warning-only fixture; kind gate proves parent invariants; exact parsing lands | End Phase 2 |
| M3 | Generation unified | `init_skill.py` renders from assets; `--kind parent` passes the checker; templates render conditionally | End Phase 3 |
| M4 | Program sign-off | full fixture suite green; `validate.sh --strict` clean; `parent-skill-check.cjs` 0/0 on sk-doc | End Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | One machine-readable contract as the single source | Dissolves the triplicated-contract root cause behind findings 2, 4, 7 |
| ADR-002 | Strict mode opt-in, then required | Promotes documented requirements to failures without redding the existing fleet on day one |
| ADR-003 | Reconcile the description budget to ≤130 soft (operator fork) | Three authorities disagree; one budget must win |
| ADR-004 | Kind-aware completion gate dispatcher | A parent hub must prove parent invariants, not just the standalone gate |
