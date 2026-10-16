# Review Iteration 1, Advisor Code Correctness

Mode: review | Dimension: correctness (+ traceability evidence for spec alignment)
Iteration: 1 of 5 | Target: v4.0.0.12 release, advisor code group (steer.md scope group 1)

## Dimension

Correctness of the v4.0.0.12 advisor routing code: doctor bridge generation, doctor bridge
ordering in the TypeScript scorer, the Python fallback re-sort, brief rendering of runnable
doctor lines and the setup hint, the hook/plugin wiring, and the new doctor tests.
Traceability is exercised as supporting evidence (spec REQ alignment, generated-artifact
drift), not as the dimension focus.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` (generated doctor lookup,
  `doctorCommandString`, brief companion line, fallback hint, outage hint)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
  (`requireDoctorPhraseAnchor`, `keepPassingSkillsAboveDoctorBridges`, call site)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` (generated doctor bridges)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (doctor re-sort, generated block)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`
- `.opencode/plugins/lib/skill-advisor-render.js`, `.opencode/plugins/system-skill-advisor.js`
- `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`
- `.skilled/commands/doctor/_routes.yaml` (inventory side of bridge generation)
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-command-bridges.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/doctor-setup-hint.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-ordering.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` (new doctor case)
- `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Confirmed-Clean Surfaces

- **Generated artifacts are drift-free.** `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check`
  exits 0 with `status: fresh`, `changed: []` and counts `doctorRoutes: 16, generated: 43`
  (evidence: `evidence/iter-001-derive-check.txt`). The render lookup block, the TypeScript
  projection, the Python projection and the generated JSON all match the deriver's recomputation.
- **Every admitted doctor phrase reaches its bridge.** `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`
  exits 0 with `STATUS=OK phrases=82 bridges=15` (evidence:
  `evidence/iter-001-doctor-phrase-reach.txt`). The probe recomputes bridge ids from
  `_routes.yaml` and reads the built scorer at `dist/`, which was built 2026-10-16T05:19Z,
  after the last source edit, so the measurement covers the shipped code.
- **The brief renders the doctor string for the whole slice.** A read-only probe over all 40
  `doctor-prompts.jsonl` rows (`evidence/iter-001-render-probe.mjs` +
  `evidence/iter-001-render-probe.txt`) scored each prompt through the built scorer, applied
  `passingRecommendations`-equivalent filtering, the production token cap and
  `renderAdvisorBrief`: `ROWS=40 TOP_MISMATCH=0`, and every row with an expected second doctor
  bridge shows that bridge's runnable string within the first two brief lines, either as
  `ambiguous: <skill> x/y vs <doctor> z/w pass.` or as `Also: <doctor>`. The doctor bridge
  never renders as its raw `command-doctor-*` id.
- **Ordering rule is scoped and order-preserving.** `keepPassingSkillsAboveDoctorBridges`
  only relocates `kind === 'command'` ids with the `command-doctor-` prefix, keeps their
  relative order, returns a copy (input-frozen test passes), and leaves non-doctor commands
  such as `memory:save` untouched [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:675-694].
  `requireDoctorPhraseAnchor` demotes only a passing doctor bridge with no
  `explicit_author` raw-score contribution and never revives a non-passing one
  [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:652-670].
  Both run after every abstention gate and before `passing` is computed
  [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:942-943].
- **Python fallback cannot out-rank a skill.** The native-wrapper sort keys doctor bridges
  behind every non-doctor candidate unless the prompt contains `/doctor:`
  [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:886-890],
  with a matching test at `test_skill_advisor.py` (plain vs typed prompt both asserted).
- **No crash surface on missing lane contributions.** Every recommendation is constructed
  with `laneContributions: contributions` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:800-808],
  so the new `.some(...)` reads cannot hit `undefined`.
- **Hint wiring matches REQ-012 across runtimes.** The hook computes `SETUP_WORDING` once and
  passes the flag [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:51,338];
  the Pi deadline path passes the same exported check
  [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:283-286]; the
  OpenCode plugin renders its own copy, held equal by the parity test
  [SOURCE: .opencode/plugins/lib/skill-advisor-render.js:28,57-61]. The fallback adds the hint
  on the no-match and outage lines only, and `skipped` stays bare
  [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:148,544-550].
- **Inactive doctor bridges are deliberate.** `command-doctor-deep-loop` and the
  `/doctor:mcp` sub-actions have no compatibility entry and stay inactive
  (spec.md REQ-009, `command-bridges/README.md` §4); the probe's admitted set of 15 bridges
  matches `scoring-compatibility.json` exactly (15 TypeScript/15 Python doctor ids, equal sets).
- **skill_agent ownership is consistent.** Each doctor router's `<!-- skill_agent: ... -->`
  tag matches the generated bridge's `skillId`/`ownerMode` for all 16 generated bridges
  (`git.md -> sk-git`, `sk-code.md -> sk-code`, `skill-advisor.md -> system-skill-advisor`,
  `deep-loop.md -> system-deep-loop`, the rest `system-spec-kit`).
- **Doctor tests are purpose-built and non-trivial.** `doctor-command-bridges.vitest.ts`
  recomputes expectations from `_routes.yaml` rather than reading generated output back;
  `doctor-routing-slice.vitest.ts` gates waves on active bridge ids and pins the clock to the
  accuracy baseline; `doctor-brief-render.vitest.ts` covers top/second/unmapped/absent cases;
  the plugin parity test compares the duplicated regex source and flags.
- **Lease stress fix addresses its stated cause.** The `beforeAll` warm-open
  [SOURCE: .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts:22-27]
  moves the first-SQLite-open cost out of the timed race, matching the commit message; the
  timed assertions were not weakened.

## Traceability Checks

- `spec_code`: pass for the reviewed group. REQ-005 ordering and REQ-006 brief rendering are
  implemented at the cited fusion/render sites; REQ-009 wave scoping matches the compatibility
  document; REQ-010 wording rules are visible in `_routes.yaml` trigger phrases; REQ-011 is
  satisfied by `doctor-phrase-reach.cjs`; REQ-012 by the hook flag and fallback branch.
- `checklist_evidence`: partial this iteration, `tasks.md` evidence rows are read in the
  docs/changelog iterations rather than here.
- Overlay protocols: deferred to later iterations (`feature_catalog_code` in iteration 3,
  `playbook_capability` in iteration 3, `skill_agent`/`agent_cross_runtime` in iteration 2/4).

## Edge Cases / Observations

- **Out-of-scope observation (not a finding; spec.md is outside the declared target).**
  `specs/system-skill-advisor/035-doctor-command-routing/spec.md:171` still reads that the Pi
  deadline path prints the outage line "which carries no hint on either runtime". The shipped
  behavior changed in 64f3cbee22: `render.ts` adds the hint to the outage line and the Pi
  deadline path passes the wording flag, so a setup-worded deadline prompt does show the hint.
  The in-scope shipped docs (`hooks/skill-advisor-hook.md:39`,
  `feature-catalog/hooks-and-plugin/claude-hook.md:30`,
  `feature-catalog/scorer-fusion/doctor-command-routing.md:35`) describe the shipped behavior
  correctly. Recorded for the packet owner; no shipped artifact contradicts the code.
- **Ambiguity-render coexistence.** For contested prompts whose confidence gap is within the
  ambiguity margins, the brief's second line is the ambiguity comparison rather than the
  `Also:` form; the probe shows the doctor runnable string is still present in both forms.
  SC-003 ("the brief shows the doctor string as its second line") holds in substance; the
  changelog's worked example ("check my git hooks setup") renders the `Also:` form exactly.
- **Unmapped doctor id behavior.** An unmapped `command-doctor-*` id as top pick suppresses
  the brief (falls back to the fallback directive) rather than rendering a raw id
  [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-482]; the deriver's
  `--check` guarantees every generated id is mapped, so the branch is defensive only.

## Ruled Out

- **"The doctor bridge can out-rank a matching skill."** Ruled out by the slice probe: all 20
  contested/control rows keep the expected top skill or doctor top (typed prompt), and
  `TOP_MISMATCH=0` over all 40 rows.
- **"The Also/companion line is truncated mid-command."** Ruled out by construction: the
  longest reachable line (ambiguous form plus companion at cap 120, or default form plus
  companion at cap 80) stays well below the 4-chars-per-token cap (480 chars at cap 120,
  320 at cap 80); `capText` was not reached in any probe row
  (`evidence/iter-001-render-probe.txt` shows untrimmed lines).
- **"Doctor bridges leak into non-doctor commands."** Ruled out: ordering and anchoring checks
  gate on both `kind === 'command'` and the `command-doctor-` prefix; the `memory:save`
  ordering test passes this.

## Next Dimension

Iteration 2: command and runtime mirrors. Scope group 2 of steer.md: `.skilled/commands/doctor/setup.md`,
`assets/doctor-setup.yaml`, `assets/doctor-setup-presentation.txt`, the `/doctor:setup` and
`/doctor:skill-advisor` routes in `_routes.yaml`, `assets/doctor-router-reach.yaml`,
`assets/doctor-skill-advisor-rebuild.yaml`, and the five runtime mirrors. Dimension:
correctness + standards conformance (command contract), with traceability of mirror parity.

Review verdict: PASS
