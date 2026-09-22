---
title: "Tasks: MiMo v2.5 to v2.6 cutover across skills settings and deep-loop allowlists"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mimo v2.6 cutover tasks"
  - "roster rename task breakdown"
  - "allowlist rename verification checklist"
  - "mimo task dependencies"
importance_tier: "normal"
contextType: "general"
---
# Tasks: MiMo v2.5 to v2.6 cutover across skills settings and deep-loop allowlists

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture baselines: the 070 trio ran 259/259, exit 0, 203.82 s, and `npm run typecheck` exited 0 (`.skilled/skills/system-deep-loop/runtime`); working-tree state recorded — one modified tracked file (`.pi/settings.json`, the `lastChangelogVersion` 0.86.1→0.87.0 rider) and one untracked other-track spec directory, neither this packet's
- [x] T002 Confirm the full `npm test` wedges on the lineage integration tests (timed out once at 300 s, once at 600 s, log at `/tmp/deep-loop-baseline.log`); adopt the 070 trio as the track precedent's scope and record the deviation in `plan.md` §5
- [x] T003 Workspace: current branch `main`, operator-selected; no new branch; rider hunk recorded, not absorbed silently
- [x] T004 Scaffold the packet with the spec-kit's `create.sh` (Level 1: recommend-level scored 29/100, confidence 80, no risk factors, phase score 10 < 25), then reconcile the tool's `.opencode/specs` placement with the track's validated location — moved and renumbered `001-` → `076-` to follow 071/072/073/075; 075 still validates `RESULT: PASSED` at that root, which is the evidence for the placement
- [x] T005 Fill `spec.md`, `plan.md` and `tasks.md` from the approved plan scope (this file)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] Token rename in the three skills' living surfaces (13 `.md` files: cli-opencode ×7, cli-pi references ×1, cli-hermes ×5) and the two `enabledModels` lines in `.pi/settings.json` — case-preserving `mimo-v2.5`→`mimo-v2.6` and `MiMo-V2.5-Pro`→`MiMo-V2.6-Pro`; historical changelog bodies and the PI-017 evidence cell excluded
- [x] T007 [P] Token rename in the deep-ai-council example surfaces (`deep-ai-council/SKILL.md` line 357; `references/patterns/seat-diversity-patterns.md` lines 138 and 240)
- [x] T008 Token rename in the enforcement set: `runtime/lib/deep-loop/executor-config.ts` (`PI_SUPPORTED_MODELS` lines 226-227, `HERMES_SUPPORTED_MODELS` line 266) and `runtime/scripts/fanout-run.cjs` (Pi allowlist copy 2305-2306, `PI_MODEL_PROVIDERS` 2526-2527, `HERMES_ALLOWED_MODELS` 2626) — both halves of the HerMeS-equals-Pi-minus-one pairing in the same pass
- [x] T009 Token rename in the paired test expectations: `runtime/tests/unit/executor-config.vitest.ts` lines 953-954, 984 (comment: durable WHY stays, only the model token inside changes), 989, 991, 1015; `runtime/tests/unit/fanout-run.vitest.ts` lines 1884-1885
- [x] T010 Version bumps in frontmatter: cli-opencode `1.4.6.0`→`1.4.7.0`, cli-pi `1.5.4.0`→`1.5.5.0`, cli-hermes `1.0.0.0`→`1.0.1.0`
- [x] T010a [P] Wire the official-`xiaomi` definitions in `.pi/models.json` (operator: "in cli pi please use official xiaomi provider for mimo 2.6"): `providers.xiaomi.models` gains `mimo-v2.6-pro` and `mimo-v2.6-pro-ultraspeed`, each field inherited verbatim from its official v2.5 predecessor's store definition (the upstream xiaomi catalog still publishes no v2.6 metadata — the inheritance is labeled INFERRED in the packet); no `baseUrl`/`api`/`apiKey`, because the built-in registration supplies them. Resolution proof: `pi --list-models` on the real agent dir lists both ids at 1.0M/131.1K while the built-in v2.5 trio survives untouched — a throwaway `PI_CODING_AGENT_DIR` probe proved the models array MERGES rather than replaces, and that omitted context fields would have shown the 128K/16.4K defaults
- [x] T011 [P] Write one changelog entry per affected skill (`changelog/v1.4.7.0.md`, `v1.5.5.0.md`, `v1.0.1.0.md`), each carrying `version` in its YAML frontmatter — the repository frontmatter gate's requirement — with bodies that narrate the why, not task or requirement ids
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Scoped residue scan: ripgrep `mimo[- ]?v2\.5` (case-insensitive) across `.pi/settings.json`, `.pi/models.json`, the three skills and the four deep-loop enforcement/test files plus the two council files — the only permitted survivors are `changelog/` bodies and the dated PI-017 evidence cell; the four enforcement/test files and the two council files must return zero
- [x] T013 Settings and behavior gates: `node -e "JSON.parse(...)"` on `.pi/settings.json` and `.pi/models.json`; `npm run typecheck` and the 070 trio re-run from the final state, at or above the 259-test baseline; `pi --list-models` on the real agent dir showing both `xiaomi` v2.6 ids at 1.0M/131.1K beside the untouched v2.5 trio
- [x] T014 Bookkeeping gates: `check-frontmatter-versions.sh` across the repository, zero failures; `validate.sh` on this packet with `--strict` printing `RESULT: PASSED`
- [x] T015 Write `implementation-summary.md` (what shipped, the untouched-rationale, the rider hunk, the installed-pi-serves-v2.5 fact and the operator's resolution check) and refresh `graph-metadata.json` through the kit's derivation so its fingerprints match the final docs; reconcile completion metadata across the packet
- [x] T016 Final-state proof: `git diff --stat` reviewed — only this packet's recorded paths plus the rider hunk changed; no scratch residue; report the receipts and what only the operator can verify
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
