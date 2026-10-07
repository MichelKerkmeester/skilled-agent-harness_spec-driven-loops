# Deep Review — Iteration 001: inventory + correctness

**Target:** `specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing` (Level 2, Status Complete)
**Run:** run-001 · generation 1 · session `2026-10-07T05:11:34.566Z`
**Dimension:** inventory + correctness (D1), with the iteration-1 inventory pass
**Method:** read-only. Commit diffs for the four 006 commits plus the trigger-index rebuild were compared against current file state; test claims were checked by reading the assertions, not by executing the suite (the dispatch bans builds/tests).

---

## 1. INVENTORY

What the packet shipped, by commit:

| Commit | Subject | Surfaces |
|---|---|---|
| `839e5ec61d3` | Packet docs scaffolded | 006 spec/plan/tasks/acceptance-criteria/implementation-summary |
| `6a21c6b5311` | Series parent as a second qualification path; stale Option D/E labels corrected; `mkdir` step replaced by `create.sh` | 7 rule docs + `AGENTS.md`, `speckit-plan.yaml`, `speckit-complete.yaml` |
| `bff396f481e` | Trigger phrases seeded from packet name and description; `template-default` judge class | `create.sh`, `phrase-judge.mjs`, 2 test files |
| `f53d63e4615` | Recent sibling listing on stderr before top-level numbering | `create.sh`, 1 test file |
| `a3bec035edc` | Close-out: authoring-checklist fix, AC/tasks/summary completion edits | checklist + packet docs |
| `5d4efec89a4` | Trigger index rebuilt | `runtime/data/trigger-index.json` + fixtures |

Scope additions not in the spec's Files-to-Change table but present in the commits: `spec-folder-authoring-checklist.md` (found by the fix sweep) and the packet's own close-out docs. No unlisted source file changed.

---

## 2. FILES REVIEWED

Rule docs and command assets:
- `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:66` (series-parent section), `:78` (creation recipe), `:227` (§4 exception)
- `.skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md:183` (trigger row, version-vs-series paragraph)
- `.skilled/skills/system-spec-kit/references/structure/phase-system.md:36` (exception pointer)
- `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md:243` (§8 checklist), `:269` (Option C label), `:272` (priority line)
- `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:44`
- `.skilled/skills/system-spec-kit/SKILL.md:511` (rule 16)
- `AGENTS.md:81` (Gate 3 Option C), `:82` (Option D)
- `.skilled/commands/speckit/assets/speckit-plan.yaml:133`, `.skilled/commands/speckit/assets/speckit-complete.yaml:191` (Option C rename)
- `.skilled/skills/system-spec-kit/README.md:173-183` (Gate 3 flow diagram)
- `.skilled/skills/system-spec-kit/references/templates/level-selection-guide.md:83`, `references/templates/level-specifications.md:789` (threshold restatements)
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:251` (judge class list)

Runtime:
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:62` (PHASE_COUNT default), `:98` (`--level phase-parent`), `:217` (`--parent` value required), `:395-424` (seeding), `:1081-1118` (listing), `:1123` (`resolve_branch_name`), `:1192` (phase branch), `:1245`, `:1318-1347` (child loops), `:1609`, `:1815`, `:1825`, `:1862-1863` (parent-mode description + validation child)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:26` (class set), `:89` (template-default branch)
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-composition-system.md:52` (canonical `--level phase-parent` invocation)

Tests (read, not executed):
- `create-root-numbering.vitest.ts:126-149` (seeded phrases, punctuation)
- `create-track-refresh.vitest.ts:146-183` (listing, phase-child silence, 14-day window)
- `trigger-index.vitest.ts:147-155` (template-default judge)

Packet docs:
- `spec.md:113-124` (REQ-001..007), `acceptance-criteria.md:57-63` (AC-001..007), `tasks.md:176-180`, `implementation-summary.md:96-104`

---

## 3. FINDINGS BY SEVERITY

### P0 — none

### P1 — 3

---

#### R1-P1-001 — The series-parent creation recipe names a scaffold command that produces the wrong structure, and an append command that fails

- **File:** `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:78`
- **Claim:** The operative how-to for creating a series parent ("scaffold the parent with `create.sh --phase`") selects create.sh's *phased-packet* mode, which scaffolds a parent plus `PHASE_COUNT` children (default 3). The follow-on steps ("move the existing packet in as child `001`", "add the new work as child `002`") therefore collide with scaffolded children, and the second command `create.sh --phase --parent` omits the required `<path>` value. The parent-focused scaffold mode used elsewhere in the codebase is `--level phase-parent`.
- **evidenceRefs:**
  - `[SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:78]` — recipe text.
  - `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:62]` — `PHASE_COUNT=3` default.
  - `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1192]` — "Phase mode creates: parent spec folder + N child phase folders".
  - `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1318]` — child creation loops run `PHASE_COUNT` times.
  - `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:98]` — `--level phase-parent` sets `DOC_LEVEL="phase"`, the parent scaffold mode.
  - `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1862]` — that mode scaffolds a deliberate placeholder child `001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG` (definition at `create.sh:748-752`), which the recipe also must address but does not.
  - `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:217-228]` — `--parent` requires a value; `--phase --parent` without a path exits with an error.
  - `[SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-composition-system.md:52]` — canonical parent scaffold invocation uses `--level phase-parent`.
  - Secondary: the recipe's `repair-derived.cjs --apply` omits the required `--folder <packet>` selection (`create.sh:715` documents it; `repair-derived.cjs:117` usage), and `refresh-track-roots.mjs --apply` omits `--track <name>` (`refresh-track-roots.mjs:20`).
- **Counterevidence sought:** searched create.sh for any mode where `--phase` without `--phases`/`--phase-names` yields a parent-only scaffold — none exists (default is 3 children). Checked whether `--level phase-parent` yields a childless parent — it yields parent + one placeholder child. Checked whether another doc provides a corrected recipe for series parents — none found.
- **Alternative explanation:** the sentence may be read as prose shorthand for "scaffold however a phase parent is scaffolded", and an operator can delete scaffolded children by hand. But the named flag selects a different mode, and the placeholder child of the parent-only mode still needs the unstated replacement step.
- **Final severity:** P1 (a rule doc's primary new procedure does not execute as written).
- **Confidence:** 0.8
- **Downgrade trigger:** if maintainers accept §2 as an informal outline and the command is fixed separately, or the scaffold semantics are documented as "adapt to the scaffold's children", downgrade to P2.
- **Finding class:** class-of-bug (command drift between new prose and CLI; the same class could exist in other new prose — a diff sweep of the four 006 commits found no other new command invocations).
- **Affected surface hints:** ["phase-definitions.md §2 recipe", "create.sh --phase mode", "create.sh --level phase-parent mode", "series-parent creation flow"]
- **Recommendation:** name `create.sh --level phase-parent` for the parent scaffold (or `--phase --phases 1 --phase-names <slug>` when a real first child is intended), state how the scaffold's placeholder child is replaced by the moved packet, and pass the explicit arguments on the remaining commands (`--parent <parent-path>`, `repair-derived.cjs --folder <packet> --apply`, `refresh-track-roots.mjs --track <track> --apply`).

---

#### R1-P1-002 — REQ-002's "no doc still says … Option E skips" is not met: the skill README still teaches Option E

- **File:** `.skilled/skills/system-spec-kit/README.md:178`
- **Claim:** The Gate 3 flow diagram in the system-spec-kit README still shows "Option E: Skip documentation". Commit `6a21c6b5311` renamed the skip option to D everywhere it edited, and `AGENTS.md:82` defines the stable labels as A/B/C/D with D = Skip. REQ-002 says "no doc still says Option D adds a phase or Option E skips"; AC-002's evidence quietly narrows the search to "the edited docs".
- **evidenceRefs:**
  - `[SOURCE: .skilled/skills/system-spec-kit/README.md:178]` — "└─► Option E: Skip documentation".
  - `[SOURCE: AGENTS.md:82]` — "D) Skip — Explicitly skip documentation…".
  - `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/acceptance-criteria.md:58]` — AC-002 evidence: "A search over the edited docs…".
  - `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md:114]` — REQ-002 text.
- **Counterevidence sought:** swept `.skilled` (excluding changelogs) for "Option E": remaining hits are the README diagram, historical changelog entries, a benchmark log, and test OR-conditions that also accept 'phase child'/'Phase folder'. Checked the spec's Out of Scope: only the global `~/.claude/CLAUDE.md` is exempted, the README is not. Checked whether the README is generated — no generator reference found; it is hand-maintained.
- **Alternative explanation:** the diagram is a simplified intro (it never listed C or D) and the requirement's practical target may have been the rule docs enumerated in the packet. That does not satisfy the unconditional "no doc" wording.
- **Final severity:** P1 (unmet condition of a P0-table requirement; same stale-label class the phase set out to erase).
- **Confidence:** 0.7
- **Downgrade trigger:** if the maintainers define the requirement's doc set as the edited docs (AC-002's reading), downgrade to P2 and fix the requirement wording instead.
- **Finding class:** class-of-bug (stale label; same-class inventory incomplete).
- **Affected surface hints:** ["system-spec-kit README Gate 3 diagram", "AGENTS.md stable labels"]
- **Recommendation:** change the diagram label to "Option D: Skip documentation" (or drop the option from the simplified diagram and point at the AGENTS.md gate), then rerun a repo-wide search for "Option E".

---

#### R1-P1-003 — REQ-003's "every doc that restates the phase thresholds" is not met: two reference docs restate both thresholds with no series-parent exception

- **Files:** `.skilled/skills/system-spec-kit/references/templates/level-selection-guide.md:83`, `.skilled/skills/system-spec-kit/references/templates/level-specifications.md:786-790`
- **Claim:** The threshold sweep for REQ-003 covered the seven rule docs named in AC-003, but at least two more in-repo docs restate the qualification rule without the exception:
  - level-selection-guide.md: "Phases are recommended when phase score >= 25 (threshold) AND recommended level >= 3."
  - level-specifications.md §Phase Detection Thresholds: "Phase decomposition is suggested when BOTH conditions are met: Complexity score >= 25 … Documentation level >= 3".
  Both have zero mentions of the series parent. A reader of either doc reaches the pre-006 answer for "second small change to the same artifact".
- **evidenceRefs:**
  - `[SOURCE: .skilled/skills/system-spec-kit/references/templates/level-selection-guide.md:83]`
  - `[SOURCE: .skilled/skills/system-spec-kit/references/templates/level-specifications.md:789]`
  - `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md:115]` — REQ-003 text ("Every doc that restates the phase thresholds names the series parent exception").
  - `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/acceptance-criteria.md:59]` — AC-003 evidence ("All seven docs that state the thresholds…").
  - Cross-check: the seven updated docs each contain the exception (phase-definitions 7 mentions, quick-reference 4, sub-folder-versioning 2, SKILL/phase-system/checklist/AGENTS 1 each).
- **Counterevidence sought:** verified both matched lines are qualification restatements, not scoring tables; verified neither file is in the spec's Files-to-Change table (so the sweep was scoped there); verified the phase's own history fixed exactly this class when the authoring checklist was found late and treated as must-fix.
- **Alternative explanation:** the requirement's intended doc set may be the seven enumerated rule docs; the two files are template-reference docs. If so, the correct fix is to narrow REQ-003/AC-003, not to add text.
- **Final severity:** P1
- **Confidence:** 0.75
- **Downgrade trigger:** requirement scope clarified to the seven rule docs → P2.
- **Finding class:** class-of-bug (same-class producer inventory incomplete).
- **Affected surface hints:** ["level-selection-guide.md threshold line", "level-specifications.md phase detection section", "REQ-003/AC-003 wording"]
- **Recommendation:** add the one-line exception beside both restatements (as was done in phase-system.md), or explicitly scope REQ-003 to the rule docs in both REQ and AC text.

---

### P2 — 3

#### R1-P2-001 — quick-reference §9 Option C label description omits the series parent that AGENTS.md's Option C includes
- **File:** `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md:269` (vs `:272` and `AGENTS.md:81`)
- **Evidence:** §9's Option C describes "another existing packet — a related spec…, a specific child…, or a related standard packet decomposed into phases…" but not the series parent, while the §9 priority line (`:272`) and §8 checklist (`:243`) both name it and AGENTS.md:81 includes it in the same label. AGENTS.md's "Which to choose" pointer sends readers to quick-reference §8/§9.
- **Impact:** an agent quoting §9 verbatim presents an incomplete Option C description. Low: the doc's other two mentions still surface the rule.
- **Recommendation:** mirror the series-parent clause into the §9 Option C line.

#### R1-P2-002 — the new judge class `template-default` is missing from the retrieval conventions' class list
- **File:** `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:249-256`
- **Evidence:** the "Warn On" list enumerates `generic-workflow-word`, `stop-word-only`, `prose-sentence`, `oversized`, `editor-fallback`, `folder-token-fallback`, `single-token`, `numeric-only`; `template-default` exists only in `phrase-judge.mjs:89`, its test, and fixtures. Line 263 states the judge is the one place these rules live and the `GREP_CONVENTION` validator reports each rejected phrase as a warning.
- **Impact:** low; behavior works (verified by read of judge + test), documentation lags one class.
- **Recommendation:** add the class to the "Warn On" list with its meaning (template placeholder phrases).

#### R1-P2-003 — tasks.md Verification Summary still holds literal template placeholders
- **File:** `specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/tasks.md:176-180`
- **Evidence:** the summary table rows read `| P0 Items | [X] | [ ]/[X] |` etc. — unreplaced placeholders — while the packet is marked Complete in `spec.md:26`, `acceptance-criteria.md:44` and `implementation-summary.md`. The table carries no information as written.
- **Impact:** low; completion quality/traceability.
- **Recommendation:** fill the counts or remove the placeholder table.

---

## 4. TRACEABILITY CHECKS

Core `spec_code` (status: partial):
- REQ-001 (series-parent definition): met — `phase-definitions.md:66-80`; correction → Option A stated at `:74`.
- REQ-002 (labels; §4 first-child allowance): partially unmet — finding R1-P1-002; §4 allowance present at `phase-definitions.md:227`; Option C rename verified in both command assets.
- REQ-003 (every threshold restatement names the exception): unmet for two docs — finding R1-P1-003.
- REQ-004 (listing): met by read — `create.sh:1081-1118` (stderr only, before numbering at `:1123-1125`), silence for phase children verified by test assertions (`create-track-refresh.vitest.ts:160-183`).
- REQ-005 (seeded phrases): met by read — `create.sh:395-424` called from all four copy paths (`:822`, `:1027`, `:1609`, `:1815`); assertions at `create-root-numbering.vitest.ts:126-149`.
- REQ-006 (GREP_CONVENTION warn): met by read — `phrase-judge.mjs:89-94`; assertion at `trigger-index.vitest.ts:147-155`; class wiring consistent with `retrieval-conventions.md:263` (doc list gap = R1-P2-002).
- REQ-007 (tests pass; golden snapshot): tests were not executed in this read-only review; the committed test definitions match the implemented behavior. The plan's "golden snapshot changed only for the seeded phrases" vs summary's "snapshot unchanged because it does not capture trigger phrases" is a vacuous contradiction, not a defect (not re-raised as a finding).

Core `checklist_evidence` (status: partial):
- AC-001, AC-004, AC-005, AC-006: evidence cells name observable artifacts that exist as described.
- AC-002, AC-003: evidence cells under-scope REQ-002/REQ-003 (findings above).
- AC-007: as above.

Overlay:
- `skill_agent`: checked — SKILL.md rule 16 names the exception at `:511`; no agent definitions changed by 006.
- `agent_cross_runtime`: not applicable — no agent definitions or runtime mirrors changed by 006.
- `feature_catalog_code`: not applicable — no catalog changed.
- `playbook_capability`: checked — the manual-testing-playbook documents `--level phase-parent` as the parent scaffold (`:52`); it was used as evidence for R1-P1-001, no change made.

## 5. RULED OUT / NOT REPRODUCED

- Listing boundary cases (empty track, missing track folder, missing `node`, packet without `created_at`, >10 results, 14-day cutoff): guards and cap verified by read at `create.sh:1082-1112`; test assertions cover the 14-day window and phase-child silence (`create-track-refresh.vitest.ts:146-183`). Not a finding.
- `--json` stdout purity: listing writes only to stderr (`create.sh:1116`); test parses stdout (`create-track-refresh.vitest.ts:158-159`).
- Injection through slug/description into YAML or the perl replacement: inputs are reduced to `[a-z0-9 ]` before building the block (`create.sh:403-410`) and inserted through an env var into `s/\Q…\E/…/` (`create.sh:420-423`). Not a finding.
- NFR-P01 (≤1 node call per run): listing is a single `node -e` invocation; `resolve_branch_name` has exactly two call sites (`create.sh:1286`, `:1768`) and one executes per run. Not a finding.
- NFR-S01 (reads only description.json + graph-metadata.json inside the target track): read confirms exactly those two files per packet under `$SPECS_DIR` (`create.sh:1099-1102`). Not a finding.
- Seeding coverage for phase children, sub-folders and roots: all four copy paths call the seeding function; the phase-parent template ships its own non-default phrases, so no seeding is required for it (`templates/packet-types/phase-parent.spec.md.tmpl:5-7`). Not a finding.
- Golden-snapshot wording in AC-007 vs plan DoD: contradiction is vacuous (snapshot does not capture trigger phrases). Not a finding.
- Trigger-index rebuild (`5d4efec89a4`): spot-checked through the committed index lookup (006 spec found by "series parent rule", score 0.88); the ~2,200-line generated diff was not line-reviewed (recorded as an omitted high-risk target in the iteration record). Not a finding at this coverage level.

## 6. SCOPE VIOLATIONS

None. No out-of-scope read produced a would-be mutation, and all writes went to the bound review state paths only.

## 7. VERDICT

**CONDITIONAL** — three P1 findings, no P0:
1. R1-P1-001 (series-parent creation recipe does not execute as written),
2. R1-P1-002 (REQ-002 stale Option E in the skill README),
3. R1-P1-003 (REQ-003 missed threshold restatements in two reference docs).

R1-P1-002 and R1-P1-003 are requirement-scope-sensitive; each carries a downgrade trigger in case maintainers intentionally scoped the searches to the edited/rule docs, in which case the REQ/AC wording is what needs correcting. R1-P1-001 is text-vs-CLI drift and stands independently.

## 8. NEXT DIMENSION

Security (D2): the seed path's input handling, the listing's filesystem reads, command-asset changes, and any secret/injection surface touched by the six commits; then traceability (D3) and maintainability (D4) in iterations 2–3.

Review verdict: CONDITIONAL
