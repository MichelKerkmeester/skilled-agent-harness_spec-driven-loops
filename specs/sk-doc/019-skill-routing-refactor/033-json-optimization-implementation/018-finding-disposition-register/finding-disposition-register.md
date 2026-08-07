# Finding Disposition Register

Every audit finding from the four legs (deep-review lineages `glm-high`,
`grok-high`, `luna-xhigh`, `luna-xhigh-r2`, and the deep-alignment run) carries
exactly one disposition here: **fixed**, **refuted**, **deferred**, or
**accepted**. The four legs produced 60 raw finding rows; cross-leg duplicates
(the same defect reported by more than one lineage) collapse to the audit's
**41 canonical findings**, each listed once below.

---

## 1. FIXED — remediated by a phase in this program

| # | Finding | Fixed by |
|---|---------|----------|
| F01 | Routing regression: holdout top-1 51/72 vs 53 pin, holdout top-3 53/72 vs 55 pin, delegation 8/11 vs 10 — below the 0.725 floor | 013 — stale `sk-prompt/prompt-models` model-profiles path in the delegation scorer, orphaned by a mode-packet rename; one-line path fix restored all three metrics |
| F02 | The scorer-eval baseline ratchet fails 5/7 and is wired into no workflow | 014 — re-pinned to the restored figures, `REVIEW_MIN_N` 32→31, wired into the golden-prompt-gate job, proven by a reverted mutation |
| F03 | 012 rollout checklist: 21 completed items share one evidence blob (rubber-stamp) | 015 — rewritten with per-item evidence, no two rows sharing text |
| F04 | Three checklist items certify absence of a top-1/top-3 regression that was present | 015 — re-opened and restated against 013's measured figures |
| F05 | 011 command-metadata phase self-contradicts: Status Complete over Delivered/Verification "Not yet" | 015 — reconciled to Planned / 0% across its docs |
| F06 | Program marked Complete while its own REQ-007 `validate --recursive --strict` gate is unmet | 015 withdrew the Complete claim; 016 re-established it after regenerating fingerprints made the gate green |
| F07 | Parent Phase Documentation Map lists all 12 phases Planned while children claim Complete | 016 — map corrected to execution truth with an explicit "execution state" note |
| F08 | Systemic stale continuity frontmatter across the parent and 10/12 children | 016 — one generator pass regenerated all continuity/derived metadata |
| F09 | Parent `graph-metadata.json` reports `derived.status: planned` with a null last-active-child pointer | 016 — regenerated; derived status now reflects each child's real state |
| F10 | FRONTMATTER_MEMORY_BLOCK: narrative `recent_action`/`next_safe_action` over the 96-char limit on five children | 015 — compacted the fields on 004/007/008/009/012 |
| F11 | Three audited specs cite `sk-doc/create-skill/...`, a path that does not exist (live is `sk-create-skill`) | 017 — corrected across 15 authority docs |
| F12 | The skill-root metadata contract doc requires `command-metadata.json` for every hub while the module treats it as optional | 017 — doc updated to hub-optional, matching `OPTIONAL_BY_CLASS[CLASS_HUB]` |
| F13 | Committed scratch patched derived block is a confusion / accidental-apply hazard | 017 — labelled non-live with a `scratch/README.md` |
| F14 | Routing workflow leaves token permissions implicit while running registry-fetched tools | 019 — declared least-privilege `permissions: { contents: read }` |
| F15 | Root feature catalog conflates twelve modes with twelve packets | 019 — corrected to twelve modes over eleven packets (one packet backs two modes) |
| F16 | Deprecated TS-only derived-sync writer still advertises a full-object schema path | 019 — `@deprecated` banner; no production caller reaches it |
| F17 | Parent REQ-001 acceptance ("baseline before Phase 1") contradicts the map (baseline is Phase 2) | 019 — wording aligned to the map |
| F18 | Ephemeral packet label ("029") in a code comment, violating the hard comment-hygiene rule | 020 — replaced with the durable reason |
| F19 | CommonJS `'use strict'` directive not immediately after the boxed header | 020 — moved under the header, matching the compliant siblings |
| F20 | Hub manifest generation joins `mode.packet` to `skillDir` without the containment guard the standalone path uses | 020 — guard added to `collectModeEntries`, proven by a supplied escaping-packet test |
| F21 | Exported functions across four `sk-create-skill` modules lack JSDoc | 020 — JSDoc added to the named public entry exports, bounded (no directory-wide sweep) |

---

## 2. REFUTED — with the evidence that refutes them

| # | Finding | Refutation (re-checkable) |
|---|---------|---------------------------|
| F22 | "53/72 is holdout top-1 mislabeled as top-3; this is not evidence of a routing regression" (synthesis §2) | **Backwards.** 53/72 is genuinely the live holdout **top-3**; the pin is 55/72 and the number moved. The regression is real (F01). The capture reports no top-1 row, which is what hid it — not a mislabel. Synthesis §2 is superseded by handover §2. |
| F23 | The live `sk-doc` validator cannot load its rules file before reading the artifact | Instrument error: `validate_document.py` is a symlink every caller resolves, so its rules load; the finding cited line 1 of the very file it claimed absent |
| F24 | The validator resolves `template-rules.json` under an absent hub-root assets directory | Same symlink-resolution instrument error as F23 — the rules resolve through the resolved symlink target |
| F25–F29 | Five further documentation-validator rows (DQI/rules-load variants across the doc lane) | The same symlink instrument error; each row re-derives from a validator run that did not resolve the symlink — eight doc-validator rows in total refuted as one instrument fault |
| F30 | A flagged artifact falls below the adapter's 75-point DQI floor | Refuted: the artifact scores full marks on structure; the deficit is a divider-count heuristic firing on a generated diff table, not a real quality gap |
| F31 | `shadow-diff.md` below the DQI floor (unnumbered/mixed-case H2, missing dividers) | Same generated-artifact heuristic as F30 — a machine-generated diff table is scored as authored prose |
| F32 | Choreography/path-containment: validation joins an authored path to repoRoot without containment (`ci-skill-root-metadata.cjs:324`) | Refuted: the sink at that line is a bare existence check that opens nothing, so there is no traversal to contain |

---

## 3. DEFERRED — parked with an owner

These low-severity code-style findings sit outside this program's remediation
scope (020 fixed the four the audit named as in-scope). They are parked with the
**sk-code quality gate / advisor-code owner** as a code-style backlog rather than
fixed here, so none is closed by omission.

| # | Finding | Parking place |
|---|---------|---------------|
| F33 | Compiler path validation uses `normpath` + string-prefix rather than canonical `realpath` (`skill_graph_compiler.py`) | Advisor-code owner; low severity (in-repo authored input, not attacker-supplied) |
| F34 | Runtime module loading catches broad `Exception` instead of specific exceptions | Advisor-code owner (Python style backlog) |
| F35 | Public Python helpers `canonical_skill_id`/`skill_matches_alias` lack Google-style docstrings | Advisor-code owner (docstring backlog) |
| F36 | Exported lexical-lane functions lack TSDoc | Advisor-code owner (TSDoc backlog) |
| F37 | Exported projection functions lack TSDoc | Advisor-code owner (TSDoc backlog) |
| F38 | Large TypeScript modules omit numbered code-section dividers | sk-code organization-convention backlog |
| F39 | A test file opens section 7 before adding a later section 6b (non-sequential numbered sections) | sk-code organization-convention backlog |
| F40 | A second ephemeral-label instance (`Unit H`, lowercase) in a scorer test comment (`projection-fallback-049-005.vitest.ts:205`) | Comment-hygiene backlog — same class as F18, referred with the doctrine-vs-gate gap (F41) |

---

## 4. ACCEPTED — with rationale

| # | Finding | Rationale |
|---|---------|-----------|
| F41 | The comment-hygiene enforcement tool returns clean on a bare packet number the doctrine forbids (doctrine-vs-gate divergence) | Accepted-and-referred: widening the tool's pattern set is a policy call for the gate owner (`check-comment-hygiene.sh`); recorded in 020 so every other instance is not left undetected |

---

## 5. RETROSPECTIVE

### Severity inversion (REQ-004)

Agreement across lineages tracked **surface visibility, not consequence**. The
findings all four legs converged on were the ones visible in a status table — a
stale phase map, continuity blocks reading zero completion. The single most
consequential defect — a live routing regression below the release floor — was
found by **no leg that read documents**, because every leg read documents and
**none ran the capture command**. Only one lineage compared evidence *content*
across checklist rows. A future audit must treat a claim of measured neutrality
as unverified until it **re-runs the measurement**: had any leg run
`capture-scorer-eval-baseline.mjs`, the −2 would have surfaced immediately.

### Coverage gaps (REQ-005)

No audit leg examined:
- **runtime behaviour** — whether the scorer actually produces the pinned numbers;
- **whether CI gates what it claims** — the ratchet was dead and wired to nothing, and the golden-prompt suite passed straight through the regression;
- **the three scorer diffs** (`executor-delegation.ts`, `lanes/lexical.ts`, `scorer/projection.ts`) that were the only live-code blast radius since the baseline sha.

Audit coverage was the 71 files the original commits touched, not the subsystems
they participate in. A future audit inherits this gap list rather than the blind
spot.

### Run-integrity defects (REQ-006)

Defects in the audit *instrument* itself, recorded because an executor that
fabricates a source path is more serious than most findings it produces:
- **Deleted artifacts** — a concurrent deep-review fanout `rmSync`'d untracked files repo-wide, eating three iterations of the alignment run mid-flight (the reason this work lives in a gitignored worktree).
- **Truncated lane identifiers** — alignment lane ids were emitted as the full comma-joined file list rather than a stable slug.
- **Malformed executor output** — findings registries across lineages carry inconsistent schemas; some lineages recorded zero findings where prose reported several.
- **Citations to files that do not exist** — the symlink instrument error (F23–F29) produced SOURCE citations to a rules file the executor could not resolve, then reported it as absent.

---

## 6. COUNT RECONCILIATION

41 canonical findings, all dispositioned: **21 fixed** (F01–F21), **11 refuted**
(F22–F32, counting the eight doc-validator rows as their distinct SOURCE rows),
**8 deferred** (F33–F40), **1 accepted** (F41). The 60 raw rows across four legs
exceed 41 because each cross-leg duplicate (e.g. the stale-map finding reported
by three lineages) is dispositioned once here. No finding is absent, and none
carries two dispositions.
