# Deep Review — Iteration 005

- Run: 2026-10-13T07:13:05.484Z (generation 1, lineage new)
- Dimension: correctness — adversarial re-check of all four changes and re-adjudication of every open finding
- Target: commits `9d1168bf3a` and `95698b591b`, diff `455f2a2d8c..95698b591b`
- Mode: single_review_iteration, externalized state (terminal iteration, 5 of 5)

## Dimension

Correctness, terminal pass, three attacks:

1. **Per-change re-verification at HEAD.** Each of the four changes is re-read against its spec leg (VP-1..VP-4) rather than against prior iterations' summaries.
2. **Falsification attempts on the two claims most likely to break them.** (a) that some consumer other than 13a still compares a `ROUTER.md` version with `SKILL.md`, which would make the docs' new "no gate compares it" sentence false; (b) that the new T1 test's fixture mutation is a no-op, which would make the negative assertion vacuous.
3. **Re-adjudication of both open P1 findings against HEAD's actual claim inventory**, not against the iteration-1/3 site lists, then the correct severity for whatever the inventory currently shows.

## Files Reviewed

| File | What was checked |
|------|------------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1839-1868` | 13a comment, JSON-only follower list, both failure branches, pass message, `checkChangelogVersion` call and 13b/13d bodies |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:39, 100-120, 441-449` | `VERSION` constant, `stage1Router()` fixture mutation target, new T1 test assertions |
| `.skilled/commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml` | Remaining `ROUTER.md` occurrences in either twin (searched) and the surviving copy list |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30, 122, 124` | Enforcement paragraph, own-edition sentence, Section 1 table row |
| `.skilled/skills/sk-code/SKILL.md:17`, `.skilled/skills/system-deep-loop/SKILL.md:14`, `.skilled/skills/cli-external-orchestration/SKILL.md:17`, `.skilled/skills/sk-doc/SKILL.md:17` | Version-authority paragraphs (open-finding re-adjudication) |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261`, `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:181` | Global version-carrier instructions (open-finding re-adjudication) |
| `spec.md:84` | Same-class inventory requirement that governs the open findings |
| `scratch/review-diff.patch` | Exact hunks; no change outside the five files |

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required (no new findings; both open findings re-adjudicated at HEAD)

#### R1-P1-001 [P1] Same-class inventory incomplete: live sk-doc docs still list ROUTER.md as a release version carrier

- Case: a maintainer following the sk-doc changelog instructions sets `next_version` on a hub `ROUTER.md`, reintroducing exactly the drift this change removed, then trusts the doctor re-run to catch it.
- File: `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261`
- Evidence: the instruction still reads "set `next_version` in every version carrier the component's skill root already has (`SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` …)" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261]; the companion instruction still says the carrier set includes `ROUTER.md` and that `parent-skill-check.cjs` "then confirms every copy matches" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:181]. Both contradict the revised standard [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124] and the reviewed checker [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850].
- counterevidenceSought: grep for an explicit note in either file that `ROUTER.md` is no longer a carrier — none; both statements are unconditional.
- alternativeExplanation: the lines could describe a legacy flow kept for older hubs; nothing in the text conditions them, and the referenced doctor no longer confirms that copy.
- finalSeverity: P1 — the spec's scope makes the same-class inventory mandatory ("every other claim … is corrected or listed with its reason") [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/spec.md:84].
- confidence: 0.9.
- downgradeTrigger: P2 if the spec's inventory bullet is amended to exempt instruction docs, or resolved when T002 corrects both sites.
- User impact: future hub changelog runs keep stamping `ROUTER.md` with the release version, which the doctor no longer flags — silent version drift.
- Finding class: class-of-bug
- Recommendation: fold both sites into the T002 inventory correction; drop `ROUTER.md` from the carrier lists and from the "confirms every copy" sentence.

#### R3-P1-001 [P1] Four hub SKILL.md version-authority paragraphs still claim ROUTER.md carries the release version

- Case: a reader of any hub's version authority block propagates the old rule (ROUTER.md = release copy) to a new hub or an audit, while the standard and the checker now say the opposite ("A hub `ROUTER.md` is not a release copy" [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124]).
- File: `.skilled/skills/sk-code/SKILL.md:17`
- Evidence: the four hub paragraphs each list `ROUTER.md` among the files that "carry the same value" so "every hub-root artifact states the same release": sk-code [SOURCE: .skilled/skills/sk-code/SKILL.md:17], system-deep-loop [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:14], cli-external-orchestration [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:17], sk-doc [SOURCE: .skilled/skills/sk-doc/SKILL.md:17]. The sk-code paragraph additionally lists `README.md`, whose own-edition status the standard already states [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30].
- counterevidenceSought: checked `mcp-tooling/SKILL.md:19`, the only other version-authority paragraph, for the same claim — it says "hub metadata files carry the same value" without naming `ROUTER.md`, so it is not counted; checked `.skilled/skills` SKILL.md files for any doc already carrying a correction — none.
- alternativeExplanation: the paragraphs could be read as describing the pre-change release flow. They are present-tense and prescriptive ("carry the same value"), so a reader cannot tell they are stale.
- finalSeverity: P1 — same mandatory inventory bullet [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/spec.md:84]; this iteration broadens the site list from the three registered at iteration 3 to four hubs.
- confidence: 0.9.
- downgradeTrigger: P2 if the release-flow definition is reversed to keep ROUTER.md in lockstep, or resolved when T002 corrects the four paragraphs.
- User impact: the release-versioning story a hub tells its own authors now contradicts the standard it points to; future bumps re-add ROUTER.md to the release set.
- Finding class: class-of-bug
- Recommendation: correct all four paragraphs to name only the three JSON files as release copies, and remove `README.md` from the sk-code list.

### P2 — Suggestions

None new. The adversarial passes (second consumer, test vacuity, twin residue, doc/code drift) all came back clean; no advisory is manufactured to fill the bucket.

## Adversarial Re-Check of the Four Changes

1. **VP-1 / 13a follower removal — holds.** At HEAD the follower array contains exactly `description.json`, `hub-router.json`, `mode-registry.json` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850]; no `ROUTER.md` comparison remains in the function; the comment's new clause "ROUTER.md is not compared … raised by the per-doc bump" [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1841] is implemented by the follower set, and the pass message names "all JSON routing files" [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1866]. 13b reads the changelog, not `ROUTER.md`, and 13d reads packet `SKILL.md`s, so the removal does not silently shift those checks.
2. **VP-2 / T1 test — holds and is live.** `VERSION` is `1.0.0.0` [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:39], the `stage1Router()` fixture emits a `version:` line built from that constant [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:107], and the test rewrites it to `1.0.0.9` before running [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441]. `1.0.0.9` is four-part, so 12a's format rule still passes and the `status === 0` assertion is coherent, not contradictory.
3. **VP-3 / YAML twins — holds.** A grep for `ROUTER.md` over both `create-changelog-*.yaml` assets returns no matches; the surviving copy list and README exclusion are the four carriers only.
4. **VP-4 / standard paragraph — holds.** The paragraph now names the three JSON files as the doctor's comparison set [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122], the new own-edition sentence matches the Section 1 table row [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], and the `1.0.4.0` raise conforms to the Section 4 body-change rule.

## Ruled Out This Iteration

- **Second version-comparison consumer.** Exact search over `.skilled` `*.cjs`/`*.mjs`/`*.js` finds no other `ROUTER.md` version comparison: 12a is presence/format, the new 13a comment is prose, and the root-router contract's presence/format rule is explicitly out of scope in the spec. The standard's "no gate compares it" sentence is accurate.
- **T1 test vacuity.** The mutation is a real change (`1.0.0.0` → `1.0.0.9`), the replaced string exists in the fixture, and the replacement keeps 12a green.
- **YAML twin residue / divergence.** Neither twin retains a `ROUTER.md` mention; both carry the same surviving list and README note.
- **Doc/code drift in the standard.** Paragraph and checker agree on the JSON-only follower set.
- **New stale-claim sites of a different class.** The six live sites found all belong to R1-P1-001/R3-P1-001 or their fixed sibling; no seventh class member appeared (mcp-tooling's generic metadata sentence does not name `ROUTER.md`).

## Traceability Checks

| Protocol / Check | Status | Evidence |
|------------------|--------|----------|
| `spec_code` core | partial | REQ-001..REQ-004 map to the reviewed revision; the same-class inventory requirement remains open (R1-P1-001/R3-P1-001, six sites); REQ-005 is runtime-deferred |
| `checklist_evidence` core | partial | `tasks.md` T002 and CHK-FIX-002 remain open; VP/T1 ledger rows and closure sync remain with tasks T007-T009 |
| `skill_agent` overlay | partial | Four hub `SKILL.md` version-authority paragraphs still carry the stale release-copy claim (R3-P1-001) |
| `agent_cross_runtime` overlay | notApplicable | No agent definition in the diff or the reviewed files |
| `feature_catalog_code` overlay | notApplicable | No feature-catalog claim about ROUTER.md version parity |
| `playbook_capability` overlay | notApplicable | Playbooks mention ROUTER.md routing reach only, not versions |

## Scope Violations

None. All writes landed in the review run directory; the reviewed revision was read-only.

## Next Dimension

None — this is the terminal iteration (5 of 5). Residual session obligations: correct the six stale sites through T002, then run the closure-gate runtime acceptance (goal criteria 3, 5, 6, 7); the deferred runtime claim for the new invariants test (SL-408/SL-505) executes there.

## Verdict

The reviewed revision survives the adversarial correctness pass: all four changes are present at HEAD, internally consistent, and no new defect was found. The iteration verdict stays **CONDITIONAL** because R1-P1-001 and R3-P1-001 remain active P1 findings — re-confirmed this iteration at six live sites — and the release decision is recomputed downstream from the findings registry.

Review verdict: CONDITIONAL
