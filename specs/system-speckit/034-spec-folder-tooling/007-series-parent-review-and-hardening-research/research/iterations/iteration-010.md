# Iteration 010 — Final: Seeder Baseline Byte-Identity, the CI Cadence, and the Test-Pinned Advisory Boundary

## Focus

Final iteration (10 of 10, max-iterations stop policy). Close the three probes carried from iteration 9 — (a) byte-baseline of the template source against the seeder's perl literal, (b) the mechanical side of the index-regeneration cadence, (c) test pins around the lister/refresh advisory-only returns — and produce the run's synthesis with the corrected drift finding (f-iter009-001) and the sharpened fail-loud boundary (f-iter009-003).

## Actions Taken

1. Re-read the seeder, its guard and its perl block [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:395] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:401] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:420], and its four call sites (phase-one child [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:823], sub-folder [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1028], phase children [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1610], main path [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1816]).
2. Located the template sources and ran a byte-exact literal match using the seeder's own construction — a `qq{}` block of the four lines with real newlines matched by substring — against `templates/core/spec.md.tmpl` and the three packet-type templates, plus a control regex in the inline `\Q...\n...\E` form.
3. Traced the phase-parent path: lean template definition [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1197], existence guard [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1226], render via INLINE_GATE_RENDERER [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1363], and the "parent gets the lean phase-parent trio / each child gets level 1 templates" comment [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1193].
4. Read the lister [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1081] and the full refresh/lister test file [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:115]; searched the CLI tree for `[Trigger phrase N]` replacers; checked the live corpus, the committed index [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:123581] and the golden snapshot suite [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:65].
5. Read the CI freshness step and workflow triggers [SOURCE: .github/workflows/advisory-checks.yml:3] [SOURCE: .github/workflows/advisory-checks.yml:54] [SOURCE: .github/workflows/advisory-checks.yml:68]; grepped all workflows for the generator; checked `trigger-index.vitest.ts` for a freshness assertion [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:147].

## Findings

**f-iter010-001 (P2). The byte baseline any fail-loud drift guard would compare against is exact but single-template: `core/spec.md.tmpl` matches the seeder's perl literal under the seeder's own semantics, while phase parents keep `[Trigger phrase 1]`/`[Trigger phrase 2]` unseeded and those placeholders enter the index as real phrases.**

- Seeder-semantics check (block built with `qq{}`, matched as a literal, mirroring `\Q$block\E`): `core/spec.md.tmpl => MATCH`; phase-parent, research and review packet-type templates => NO-MATCH. The core block is exactly the perl literal — four lines, two-space indent, contiguous [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:16].
- The phase parent never reaches the substitution: the guard tests only `  - "feature specification"` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:401], which only the core template carries; the lean phase-parent template has `[Trigger phrase 1]`/`[Trigger phrase 2]` [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:6] and is the parent's scaffold source [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1363]. No `Trigger phrase` replacer exists anywhere in the CLI tree (repo-wide ripgrep; only template, snapshot and fixture references), and the golden snapshot pins the retained placeholders in rendered output [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap:3242].
- Live evidence: two packets carry the placeholder [SOURCE: specs/sk-design/019-sk-design-diagram-upgrade/spec.md:5] [SOURCE: specs/sk-design/020-chart-and-diagram-review/spec.md:5], and the committed index contains the normalized phrase (`trigger phrase 1`) [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:123581]. The judge's template-default class holds only the four core phrases (established in obs-iter009-001), so the bracket placeholders surface as legitimate search phrases rather than being suppressed.
- Direction (not implemented): seed the parent's two placeholders from the packet name/description at render time, or add the bracket literals to the judge's template-default class. Either change must update the golden snapshot intentionally.

**f-iter010-002 (P2). The index-freshness cadence has a mechanical detector in CI and it is report-only end to end: `advisory-checks.yml` runs `--check` on every PR and on pushes to main/`skilled/**`, with `continue-on-error` and `|| echo`, and no workflow regenerates the artifact.**

- Triggers: push `[main, 'skilled/**']`, every `pull_request` (no path filter), `workflow_dispatch` [SOURCE: .github/workflows/advisory-checks.yml:3]; the workflow header states the design intent — "continue-on-error keeps the job green: a red X nobody is expected to act on is how a gate becomes background noise" [SOURCE: .github/workflows/advisory-checks.yml:14].
- The step fails closed only when the generator file is missing [SOURCE: .github/workflows/advisory-checks.yml:62], then reports drift via `node "$GENERATOR" --check || echo ...` [SOURCE: .github/workflows/advisory-checks.yml:68]. The workflows README describes it as "Reports without gating" [SOURCE: .github/workflows/README.md:26].
- No other workflow references the generator (ripgrep across `.github/workflows/`), and `trigger-index.vitest.ts` covers parser, encoding, scoring and the judge's template-default rejection [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:147] but has no manifest-freshness assertion.
- Consequence, combined with f-iter009-001 (staleness is manifest-level; phrase owner sets are in sync): drift is visible on every PR and never repaired or blocked. The actionable choice: promote this step to gating (it already fails closed for a missing generator), or pair the report with a maintainer-run regeneration lane.

**f-iter010-003 (P2). The advisory-only boundary is now precisely test-mapped: the track-root refresh path's warn-and-continue behavior is pinned by tests; the lister's failure returns and the seeder's status are not pinned by any test.**

- Pinned: lister stderr format `[speckit] Recent packets in specs/tools, last 14 days:` and the row shape [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:155], the 14-day window [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:173], silence on a phase-child append [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:160], single-JSON stdout [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:157], status 0 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:154]; refresh path: warn-and-continue on unreadable metadata [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:115], warn on missing writer [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:125], no-touch when `--track` is absent [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:135].
- Not pinned: the lister's own failure returns `[[ -d "$SPECS_DIR" ]] || return 0` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1082], the node-missing return [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1083], and `node ... || return 0` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1117]; the seeder is exercised by no test.
- Verdict on f-iter009-003: the fail-loud boundary survives with two refinements — (i) a deterministic seeder drift guard that stays silent on healthy fixtures cannot collide with this suite, because the fixtures scaffold from the real templates [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:38] and every pinned expectation keeps status 0 and the listing format; (ii) a fail-loud change to the *refresh* path, or any change to the listing format, does collide and must update the pins; a phase-parent seeding change collides with the golden snapshot [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:73].

**inv-iter010-001.** A drift guard for the template block must reproduce the seeder's construction, not an inline pattern: the seeder builds the block with `qq{...}` (real newlines) and matches `\Q$block\E` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:420]. The control probe — the same four lines written as an inline regex with `\n` inside `\Q...\E` — reports NO-MATCH against `core/spec.md.tmpl`, which the literal construction matches. An inline-regex guard is a false-negative generator; a correct guard compares the `qq{}`-literal (or literal newlines) exactly, and covers all four phrases rather than the one the shell guard greps.

**obs-iter010-001 (real).** The seeder's literal is now confirmed coupled across four surfaces: the judge class (4 phrases), the shell guard (1 phrase), the perl block (4 phrases, fixed order and indentation), and the template side (1 core template matching exactly; 2 packet-type templates with their own conventions; 1 phase-parent template excluded by the guard). Each surface is independently editable, so drift between any two is invisible until a packet misbehaves.

## Questions Answered

- None. Q1–Q7 remain answered; this final iteration broadened with verification and synthesis, per the max-iterations stop policy.

## Questions Remaining

- None tracked. All seven strategy questions are closed; this was the tenth and final iteration.

## Final Synthesis (run level, corrected within this run)

1. **Series-parent affordance (Q1/Q2/Q7, iterations 1–8).** Grouping becomes the default only where the placement decision happens: Gate 3 option C wording plus mechanical sibling evidence. An agent reading stderr from `create.sh` is not a reliable detection channel; the byte-pinned Gate 3 delivery receipts and the frozen runtime arrays remain the hard pre-conditions for any wording change.
2. **create.sh lister (Q3, iterations 2–3, re-tested here).** Keep it advisory; its format and 14-day window are test-pinned, and its failure returns are unpinned, so hardening failure paths is free while format changes must update the pins. Same-artifact matching and packets without `derived.created_at` remain the top defects.
3. **Seeder and template drift (Q6, iterations 2, 9, and this iteration).** Build any drift guard from the seeder's `qq{}` literal, cover all four phrases, and treat phase-parent placeholders as a real defect (seed them or classify them as template-default). Fail loud only on deterministic template drift, per f-iter009-003, and update the golden snapshot deliberately.
4. **Index cadence (Q6, iterations 8–9, re-tested here).** The `--check` detector already runs on every PR but is report-only; freshness is judged by the manifest comparison, never by spot-checking a phrase (inv-iter009-001). Decide between gating the existing step or pairing it with a regeneration lane.
5. **Backfill of older specs (Q6, iteration 2).** Unaffected by the corrected drift finding: it removes placeholder postings from personalized packets, a cause independent of staleness.

## Next Focus

Run complete: 10 of 10 iterations under the max-iterations stop policy. No further iteration.

## Contradictions / Scope

- Self-correction recorded: the first byte check (inline `\Q...\n...\E` pattern) reported NO-EXACT-MATCH for `core/spec.md.tmpl`; the control run showed the inline form quotes `\n` literally, so the first result was a measurement artifact. Corrected here and captured as inv-iter010-001.
- **f-iter009-003 vs. this iteration:** refined, not overturned — the refresh path's advisory-only is test-pinned while the seeder stays free; recorded, no halt (unattended lineage).
- No logic-sync halt items. No scope violations: every researched path was read-only, and writes were limited to this narrative, `deltas/iter-010.jsonl`, and the gateway's run-directory writes; the single-record gateway input lived under `/tmp`.

## Sources (key)

- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` (seeder, guard, perl block, lister, phase-parent path)
- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` (byte-matching block)
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` (unseeded placeholders)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` (pins)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` (placeholder pin)
- `.github/workflows/advisory-checks.yml`, `.github/workflows/README.md` (report-only `--check`)
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` (indexed placeholder)
