# Command Surface Router Awareness — Root ROUTER.md Standard Audit

**Lineage:** `dsflashgo` · **Spec:** `specs/sk-doc/031-command-surface-router-awareness` · **Date:** 2026-08-16
**Executor:** cli-opencode / opencode-go/deepseek-v4-flash · **Iterations:** 5 · **Stop:** maxIterationsReached

---

## 1. EXECUTIVE SUMMARY

The root ROUTER.md parent-skill creation standard has **landed end-to-end** across the OpenCode
command surfaces and tooling. All seven class-H parent hubs carry a conformant root `ROUTER.md`
(`router_state: active`, `skill_pointer: SKILL.md`, four-part `version`), and zero legacy
`smart-routing.md` files remain on disk anywhere under `.opencode`. The create command family
invokes the updated `init_skill.py`, parent-skill templates, and `root-router-contract.cjs` and
presents root ROUTER.md; the per-hub doctor check 12 validates the two-state contract.

The audit found **six actionable gaps**, of which three are functional (CI trigger-path omission,
fleet class-gate blindness, no fleet-wide doctor sweep) and three are stale documentation
citations to the relocated legacy file (sk-code `phase-detection.md` dangling links, deep-alignment
adapter `smart-routing.md §N` citations, deep-review playbook `ANCHOR:smart-routing`). The ten-file
"smart-routing string" lead resolved to **zero stale authoring instructions** — every hit is a
legitimate legacy-rejection list, migration note, template, reference, contract, or test fixture,
with one cosmetic filename residue (`parent-skill-smart-routing-template.md`).

---

## 2. KEY QUESTIONS (with answers)

| # | Question | Answer |
|---|----------|--------|
| Q1 | Do the create-skill / create-skill-parent commands invoke the updated init_skill.py, parent-skill templates, and root-router-contract.cjs, and present root ROUTER.md rather than the legacy path? | **YES (conformant).** Both auto/confirm YAMLs bind the `root_router_contract` six-state classifier, load `parent-skill-smart-routing-template.md` as the root ROUTER.md template, gate on `root-router-contract.cjs` via `parent-skill-check.cjs` check 12, and present ROUTER.md state/action. `init_skill.py` (both copies byte-identical) writes a `stage1-only` root ROUTER.md for fresh parent hubs. Mirrors are in sync. |
| Q2 | Do any doctor routes still assume `shared/references/smart-routing.md` or fail to validate root ROUTER.md; should a route audit the seven hubs fleet-wide? | **Per-hub coverage exists** (parent-skill-check.cjs check 12, RRC codes, full ROUTER.md two-state + dual-source + legacy-default-residue). **Fleet-wide coverage is MISSING:** `ci-skill-root-metadata.cjs` (the fleet class gate) is ROUTER-blind, and no doctor route sweeps all seven hubs' ROUTER.md in one pass. No doctor asset assumes the legacy path. |
| Q3 | Which other surfaces reference the legacy path or lack root ROUTER.md awareness? | CI workflow `routing-registry-drift.yml` runs check 12 fleet-wide via glob-enrollment of the 7 registry hubs BUT omits `ROUTER.md` from its `paths:` triggers. Advisor, validators, compiled-route, and remaining agents are intentionally ROUTER-agnostic (conformant). See ranked list. |
| Q4 | For the ten smart-routing string hits, legit or stale? | **All legitimate** — legacy-rejection lists (auto/confirm must_not, root-router-contract LEGACY_ROUTER_PATHS), migration notes (legacy-migratable classification), templates/references (ROUTER.md authoring template + docs), and test fixtures (parity test, root-router-contract.test). Actual count: 5 under `.opencode/commands` + 8 under `sk-create-skill` (brief said 5+5). |
| Q5 | Complete ranked surface-update list + conformant surfaces? | See §3 (ranked gaps) and §4 (conformant surfaces). |

---

## 3. RANKED SURFACE-UPDATE LIST (FUNCTIONAL FIRST)

### 3.1 Functional gaps

**GAP-1 (HIGH) — CI workflow trigger paths omit `ROUTER.md`.**
- File: `.github/workflows/routing-registry-drift.yml:15-56` (both `push` and `pull_request` `paths:` blocks)
- Gap: The workflow's parent-skill job (`:101-110`) glob-enrolls every hub carrying
  `mode-registry.json` (exactly 7) and runs `parent-skill-check.cjs "$hub"`, which executes the
  root ROUTER.md two-state check 12. But `ROUTER.md` is absent from the trigger path list, so a
  push that edits only a hub's root `ROUTER.md` (e.g., flipping it malformed or dual-source) does
  not trigger the gate — the very file under validation bypasses its only fleet-level check.
- Minimal fix: add `.opencode/skills/*/ROUTER.md` to both `paths:` lists (push + pull_request).

**GAP-2 (HIGH) — Fleet class gate `ci-skill-root-metadata.cjs` is ROUTER-blind.**
- File: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` (whole script; no ROUTER.md reference) and its contract `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs` (CLASS_HUB='H' at :59)
- Gap: This is the "every root, hub or standalone" fleet gate (CI workflow :119). Its class-H
  contract requires graph-metadata/registry/manifest files but not the root ROUTER.md two-state
  contract. A hub with a missing/malformed/dual-source ROUTER.md is invisible to the fleet gate
  and only caught per-hub by check 12 when an operator names that directory.
- Minimal fix: add a class-H ROUTER.md requirement/check to `skill-root-metadata-contract.cjs` and
  wire `root-router-contract.cjs` validation into the class-H branch of `ci-skill-root-metadata.cjs`
  (reuses the frozen RRC codes, no new library).

**GAP-3 (MEDIUM) — No doctor route audits root ROUTER.md across the seven hubs fleet-wide.**
- File: `.opencode/commands/doctor/_routes.yaml:139-158` (parent-skill route) and `.opencode/commands/doctor/assets/doctor-parent-skill.yaml:96-104`
- Gap: `/doctor parent-skill` runs `ci-skill-root-metadata.cjs` (fleet, ROUTER-blind) then
  `parent-skill-check.cjs "{parent_skill_dir}"` (ONE directory). No route targets "all seven hubs"
  for the ROUTER.md contract; the brief's question "should any doctor route now audit root
  ROUTER.md across the seven hubs" is currently answered no.
- Minimal fix: either (a) extend the parent-skill route to loop the per-hub check over every
  `mode-registry.json`-bearing hub (mirrors CI's glob-enrollment), or (b) add a dedicated
  fleet-ROUTER sweep doctor route that runs `root-router-contract.cjs` over every discovered hub.

### 3.2 Stale documentation citations (MEDIUM/LOW)

**GAP-4 (MEDIUM) — `sk-code/shared/references/phase-detection.md` dangling legacy links.**
- File: `.opencode/skills/sk-code/shared/references/phase-detection.md:40` (Key Sources) and `:110` (Related Resources)
- Gap: Both link `[smart-routing.md](./smart-routing.md)`, but `sk-code/shared/references/smart-routing.md`
  no longer exists (relocated to `sk-code/ROUTER.md`). The links are dead.
- Minimal fix: re-point both to `../ROUTER.md` (or drop the rows).

**GAP-5 (MEDIUM) — Deep-alignment adapter docs cite relocated `smart-routing.md §N`.**
- File: `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-code-adapter.md:123,255,263,286` and `sk-code-known-deviations.md:125,230-231`
- Gap: Citations like `"smart-routing.md §5"`, `"smart-routing.md's MOTION_DEV INTENT_SIGNALS"`,
  `"smart-routing.md §6"` name a path that no longer resolves; the content now lives in
  `sk-code/ROUTER.md` (machine block preserved verbatim per ROUTER.md:3).
- Minimal fix: rewrite citations to `sk-code/ROUTER.md §…` (documentation only; no code impact).

**GAP-6 (LOW) — Deep-review playbook references a non-existent anchor.**
- File: `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/invalid-or-contradictory-review-state-halts-for-repair.md:76` and `resume-classification-from-valid-prior-review-state.md:77`
- Gap: Both instruct the tester to use `ANCHOR:smart-routing` in
  `.opencode/skills/system-deep-loop/deep-review/SKILL.md`, but that SKILL.md has no such anchor
  and no `smart-routing` string.
- Minimal fix: replace `ANCHOR:smart-routing` with deep-review's actual SKILL.md anchor or drop it.

### 3.3 Cosmetic naming residue (deferred by brief's priority)

**GAP-7 (LOW/cosmetic) — Template filename `parent-skill-smart-routing-template.md`.**
- File: `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-smart-routing-template.md`
  (referenced at create-skill-parent-auto.yaml:233, confirm.yaml:265, parent-skill-hub-template.md:306,
  parent-hub-router-schema.md:315,346, parent-skills-nested-packets.md:134,247, skill-smart-router.md:166,
  `.opencode/agents/markdown.md:194,296`)
- Gap: The file IS the root ROUTER.md two-state authoring template (own frontmatter declares
  `router_state: active` + `skill_pointer: SKILL.md`), but its filename keeps the legacy term.
- Minimal fix: rename to `parent-skill-root-router-template.md` with a mechanical cross-reference
  update across the seven referencing files. Deferred as cosmetic (no functional impact).

---

## 4. SURFACES CONFIRMED CONFORMANT

| Surface | Evidence |
|---------|----------|
| Create command family (create-skill-parent auto/confirm YAMLs, skill-parent.md router, presentation asset) | Six-state ROUTER.md classification + `ROUTER.md: create\|migrate\|unchanged` action line; root ROUTER.md template; check-12 gating; ROUTER.md state/action presented (auto.yaml:141-188,233,422,455,606; confirm.yaml parity; presentation.txt:124,141-142,151) |
| `init_skill.py` (both copies) | Byte-identical; `init_parent_skill` writes `stage1-only` root ROUTER.md with empty maps (init_skill.py:462-516,737) |
| `.claude/commands/create` mirrors | skill-parent.md and skill.md byte-identical to `.opencode` |
| Doctor per-hub audit (`parent-skill-check.cjs` check 12) | Full ROUTER.md two-state contract via root-router-contract.cjs, RRC codes, dual-source + legacy-default-residue (parent-skill-check.cjs:1289-1400; tests cover legacy cases at :274,:324) |
| Doctor update / runtime-mirrors / mcp / skill-advisor / skill-graph-freshness / fable-mode / skill-budget | Zero smart-routing/ROUTER.md references; scopes correctly exclude ROUTER.md (DB rebuild; mirror parity; MCP install) |
| CI scripts `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs` | ROUTER-blind by design — validate their own generated artifacts; ROUTER.md fleet coverage gap is GAP-1/2, not their defect |
| Skill advisor (system-skill-advisor MCP, scorer, skill_graph_compiler.py) | Zero legacy references; "smart router" prose refers to advisor's own recommendation logic; ROUTER.md intentionally not an advisor input |
| `package_skill.py` SMART ROUTING markers | Validates the FLAT-skill `## SMART ROUTING` section pattern (skill_smart_router.md), a distinct surface; no `shared/references/smart-routing.md` reference |
| Benchmark replay (`router-replay.cjs`, `compiled-routing-parity.cjs`) | `loadSurfaceRouter` probes ROUTER.md first, legacy paths as ordered fallbacks, hub-router.json projection for migrated hubs (router-replay.cjs:546-572,412-433) |
| Remaining agent definitions (.opencode/agents/*, .claude/agents/* except markdown.md) | Zero ROUTER.md/smart-routing references; markdown.md ROUTER.md content correct and mirror-synced |
| The seven hub ROUTER.md files themselves | All `router_state: active` + `skill_pointer: SKILL.md` + four-part version (cli-external-orchestration 1.1.0.0, mcp-tooling 1.1.1.0, sk-code 3.5.0.9, sk-design 1.1.1.0, sk-doc 1.0.1.0, sk-prompt 1.0.1.0, system-deep-loop 1.0.1.0) |
| Legacy file absence | `find .opencode -name smart-routing.md` → zero results |
| Playbook/benchmark "smart-routing" folders (sk-prompt, sk-code, deep-review) | Test content describing router behavior, not authoring instructions to create the legacy path |

---

## 5. METHODOLOGY

Iterative deep-research loop (5 iterations, max-iteration stop). Each iteration used the Grep
tool (ripgrep binary absent from PATH — Grep tool is authoritative), direct Read of workflow
YAMLs/scripts/contracts, disk-level `find`/`ls` for file-existence proof, and `diff` for mirror
parity. Every finding cited `[SOURCE: file:path:line]` or `[SOURCE: command:…]`. The ten-file
string lead was verified against the real tree (found 13 files total across both halves) rather
than taken at face value.

---

## 6. SOURCES

- Standard/contract: `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` (RRC-001..008; LEGACY_ROUTER_PATHS :73-76); template `assets/parent-skill/parent-skill-smart-routing-template.md`
- Create family: `.opencode/commands/create/assets/create-skill-parent-auto.yaml`, `-confirm.yaml`, `skill-parent.md`, `assets/tests/test_skill_parent_router_parity.py`, `.opencode/skills/sk-doc/scripts/init_skill.py`
- Doctor family: `.opencode/commands/doctor/_routes.yaml`, `assets/doctor-parent-skill.yaml`, `scripts/parent-skill-check.cjs`, `scripts/tests/parent-skill-check-root-router.test.cjs`
- CI: `.github/workflows/routing-registry-drift.yml`; scripts `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`
- Advisor/validators: `.opencode/skills/system-skill-advisor/**`, `package_skill.py`, `validate_document.py`, `validate_skill_package.py`, `.opencode/bin/compiled-route*`
- Agents: `.opencode/agents/markdown.md` (+ `.claude` mirror)
- Hubs: `.opencode/skills/*/ROUTER.md` (7 files)
- Iteration evidence: `research/lineages/dsflashgo/iterations/iteration-00{1..5}.md`

---

## 7. LIMITATIONS

- No execution of repo tooling (validate.sh, generate-context.js, CI scripts, or the contract
  validator itself) was performed — this is a detached fan-out lineage with a bound write surface;
  all claims rest on static reads of the files and their cross-references.
- The audit is read-oriented: `parent-skill-check.cjs` check 12 and the contract library were
  read in full but not executed against the live hubs.
- GAP severity ratings are analyst judgment; the minimal fixes are proposed, not applied.

---

## 8. NEXT STEPS (recommended)

1. Add `.opencode/skills/*/ROUTER.md` to `routing-registry-drift.yml` trigger paths (GAP-1).
2. Extend `ci-skill-root-metadata.cjs` class-H branch + contract with root ROUTER.md validation (GAP-2).
3. Optionally add a fleet-ROUTER doctor sweep route or extend parent-skill route to glob all hubs (GAP-3).
4. Fix the three stale doc citations (GAP-4/5/6) in a mechanical documentation pass.
5. Optionally rename `parent-skill-smart-routing-template.md` (GAP-7) as a separate cosmetic pass.

---

## 9. OPEN QUESTIONS

- Whether GAP-3 should be a new doctor route or an extension of the existing parent-skill route
  (recommended: extend the route to mirror CI's glob-enrollment — least new surface).
- Whether `ROUTER.md` should join the advisor's harvest scope at all (current answer: no —
  ROUTER.md is a hub authoring/routing control doc, not advisor-facing metadata).

---

## 10. RESOURCE MAP

- Not emitted — no `{spec_folder}/resource-map.md` present at init; coverage gate skipped.

---

## 11. RECOMMENDATIONS

Ranked by blast radius and functional value: (1) GAP-1 trigger-path fix is a two-line YAML change
that closes a real CI bypass and should land first. (2) GAP-2 makes the fleet gate the single
authoritative ROUTER.md checker, closing the class-H contract hole; medium effort, high value.
(3) GAP-3 folds fleet ROUTER.md auditing into the existing doctor surface with no new command.
(4) GAP-4/5/6 are mechanical documentation repairs with zero functional risk. (5) GAP-7 is
cosmetic and safely deferrable.

---

## 12. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treat flat create-skill flow as a ROUTER.md gap | Flat/standalone skills do not own a root ROUTER.md (class-H parent hubs only); `init_skill()` writing graph-metadata.json without ROUTER.md is correct | file:.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py:272-409 | 1 |
| doctor-update.yaml as a ROUTER.md surface | DB rebuild orchestrator whose mutation boundaries forbid skill body writes; ROUTER.md out of scope | file:.opencode/commands/doctor/assets/doctor-update.yaml:117-129 | 2 |
| mcp-doctor / mcp.md as ROUTER.md surfaces | Diagnose MCP server install/boot, not skill hub structure | file:.opencode/commands/doctor/scripts/mcp-doctor.sh | 2 |
| Skill advisor as a ROUTER.md consumer | Advisor harvesters walk `references/`+`assets/` frontmatter and project mode-registry/leaf-manifest pairs; ROUTER.md not an advisor input by design | file:.opencode/commands/doctor/_routes.yaml:8-14 | 3 |
| package_skill.py SMART ROUTING markers as a legacy hit | They validate the flat-skill `## SMART ROUTING` section pattern (skill_smart_router.md), a distinct surface from the hub root ROUTER.md contract | file:.opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py:641-688 | 3 |
| Renaming parent-skill-smart-routing-template.md now | Cosmetic naming only; rename ripples through create YAMLs, hub template, schema docs, nested-packets doc, skill-smart-router.md, and the markdown agent with no functional gain | file:.opencode/commands/create/assets/create-skill-parent-auto.yaml:233 | 4 |
| A seventh-hub ROUTER.md gap | All seven hubs are `active` with valid skill_pointer and four-part versions; fleet-wide state uniform and conformant | command:grep router_state over .opencode/skills/*/ROUTER.md | 5 |
| router-replay.cjs as a legacy authoring hit | Legacy-path probes are ordered fallbacks behind ROUTER.md and hub-router.json projection; migrated hubs replay correctly | file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:546-572 | 5 |

---

## 13. QUESTION COVERAGE

- Answered: Q1, Q2, Q3, Q4, Q5 (all five key questions closed with evidence).
- Coverage ratio: 5/5.

---

## 14. CONVERGENCE REPORT

- Stop reason: `maxIterationsReached` (5 of 5; convergence treated as telemetry per config).
- Total iterations: 5 · Questions answered: 5/5.
- newInfoRatio trend: 0.85 → 0.75 → 0.70 → 0.45 → 0.60 (avg 0.67). The dip at iteration 4 is
  expected (pure consolidation of an already-confirmed hypothesis); iteration 5 broadened angles
  and recovered novelty by sweeping the hubs and finding the dangling citations.

---

## 15. DEAD ENDS AND RULED-OUT DIRECTIONS

Consolidated in §12 Eliminated Alternatives (8 ruled-out approaches with evidence and iteration
traceability). No ruled-out direction was later re-visited.

---

## 16. KEY FINDINGS

1. The root ROUTER.md standard is functionally live across all seven hubs and the create family
   (iterations 1, 5).
2. The fleet CI gate already validates ROUTER.md on all seven hubs but is bypassed by missing
   `ROUTER.md` trigger paths (iteration 3).
3. The fleet class gate and doctor parent-skill route have no fleet-wide ROUTER.md coverage —
   the two systemic gaps (iterations 2, 3).
4. All thirteen smart-routing string hits across `.opencode/commands` and sk-create-skill are
   legitimate; the only residue is cosmetic (iterations 1, 4).
5. Three stale documentation citations point at the relocated legacy file (iteration 5).

---

## 17. FINAL STATUS

Audit complete — 6 actionable gaps (3 functional, 3 documentation) ranked with exact file+line,
minimal fix, and evidence, separated from 13 conformant surface groups. No implementation was
performed (research-only lineage).
