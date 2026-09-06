---
title: "Implementation Summary: Phase 8: drift after closure"
description: "Two days after closure the spec-kit scaffolder wrote packets with no documents, a dead routing signal turned out to be a keyword collision, and an advisor parity pin was tracking a live database. All three are fixed at their producers. Both gates reproduce, and an independent review of the phase found and closed the reconciliation errors it had made."
trigger_phrases:
  - "drift after closure summary"
  - "scaffold loader fix"
  - "keyword collision fix"
  - "parity pin deterministic"
  - "gate rerun result"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/008-drift-after-closure"
    last_updated_at: "2026-09-05T19:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Fixed both owned findings, worked through review"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh"
      - ".opencode/skills/system-spec-kit/runtime/cli/tests/inline-gate-renderer.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py"
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/parity/python-ts-parity.vitest.ts"
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-052-008-drift-after-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-drift-after-closure |
| **Status** | Complete |
| **Completed** | 2026-09-05 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A packet that closes on numbers is only as true as its last measurement. This phase took
the measurement again, two days after closure and one runtime nesting later. The routing
numbers held within two rows and one prompt. The tooling underneath them did not: the
scaffolder every packet is created with had stopped writing documents, one declared signal
had died, and a test pin was reading a different number on every run. Each was traced to
its producer and fixed there, and an independent review of this phase then found the places
where its own reconciliation had overstated the tree, which are fixed too.

### The scaffold that wrote nothing

`create.sh --level 3 --with-lazy-addons` produced a folder holding `description.json`,
`graph-metadata.json`, and `scratch/`, and printed a template's text where the created-file
tree belongs. The render wrapper resolves its skill root one directory above itself, which
was correct when the wrapper lived under `scripts/` and stopped being correct when
`b4c2484696` moved it under `runtime/cli/`. With no tsx loader at that root the wrapper falls
into an inline renderer that writes to stdout and honours no output directory, so the batch
render produced text, not files. The same one-level-short spelling sat in the scaffolder's
metadata backfill, in the validator's TypeScript lane, and in the renderer's own test file.

All four now resolve the root three levels up, the spelling their sibling library already
used. The first three landed concurrently in `743e626543`, from
`specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`, while
this phase was open, so this tree carries no diff for them. The fourth is this phase's diff.
A scratch Level 3 packet renders eleven documents. The scaffold suite is 9 of 9 from the
final tree, where it was 1 failed before the fix, and the renderer test is 12 of 12.

### The signal that died of a keyword

`trigger_phrases`, declared by `sk-doc`, resolved at 0.488 on 2026-09-04 and returned
nothing from both scorers on 2026-09-05. A fresh investigation with no write authority found
the chain. Spec-kit's keyword line gained `trigger-phrases` in `cf6a635703`, which reached
this branch through a merge after the sweep tree was measured. The scorer expands a keyword
into its hyphen, space and underscore forms, so spec-kit acquired explicit evidence
byte-identical to sk-doc's. Identical evidence ties the confidence at 0.82, the tie forms an
ambiguity cluster, and for a one-token prompt the scorer looks for a multi-word anchor by
testing whether any evidence string contains a space. None did, so both members were floored
to uncertainty 0.42 and the reply was empty. Relaxing the gate on the live daemon shows the
tied pair.

The keyword is removed from spec-kit, whose own declared signal is `trigger index`. After a
daemon rebuild `trigger_phrases` resolves to `sk-doc` at 0.487, the spaced form is no longer
ambiguous, and Gate A re-run in full reads 344 of 388 with the retired CLI-hub signal as the
only remaining difference.

### The pin that tracked a database

The Python and TypeScript parity suite was pinned at 112 and 107 and read 113 then 114 on two
identical runs. A second fresh investigation found both leaks: the test imported the native
scorer statically, after the scorer had already read the database directory at module load,
and the Python reference resolved its database off its own file and never read the override
the native resolver honours. Under a fully isolated run the number was stable across four
runs at 109 and 102 with seven accepted rows, and the investigation reported the old pin was
unreachable from any committed inputs.

Both producers are fixed. The Python reference now honours the same directory override, and
the test pins the three regime variables before a dynamic import, the way its sibling suites
do. The pins read 109 and 102, the two knife-edge rows join the accepted list with their
margins written beside them, and the suite passes twice in a row with the six sibling suites
green.

### The gates, re-measured

Gate A over the 388 declared signals: 343 resolved before the fixes and 344 after, against
345 on 2026-09-04. `spec kit runtime` is won by `system-spec-kit` at 0.93, which is right,
and is retired from the CLI hub. Gate B over the 180 realistic prompts: 20 landed on the
intended mode as the top pick and 93 returned nothing, against 21 and 95 recorded at
`c328d601d8`. Phase 003's reading stands: the structural cause is untouched, and the
numbers say so within one prompt and two empties.

### The review of this phase

An independent reviewer with no write authority checked every claim these documents made
against the tree. The measurement half held: 20 of 20 re-queried corpus rows reproduced, every
gate and replay returned what the documents said. The reconciliation half did not. The
roadmap claimed a finding recorded in a decision record that did not hold it, an acceptance
row claimed every named path existed while nine continuity paths in phase 007 pointed at
deleted directories, the register still called itself forty findings above five rows
numbered past forty, the verification summary miscounted every priority, the parent spec
said forty and forty-five in one edit, the Gate B artifact stored prompts cut at 80
characters, and the loader-spelling inventory missed a seventh live instance. All of it is
corrected: the paths repointed, the counts recounted, the artifact rebuilt with full
prompts, the seventh spelling fixed, and the validator gap given its own decision record.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh` | Modified, landed in `743e626543` | Skill root three levels up, so the tsx loader is found and the batch render writes files |
| `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified, landed in `743e626543` | Same root for the graph-metadata backfill loader |
| `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modified, landed in `743e626543` | Same root for the TypeScript orchestrator lane |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/inline-gate-renderer.vitest.ts` | Modified | The fourth one-level-short loader spelling, found by the review |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | `trigger-phrases` removed from the keyword line, ending the collision |
| `.opencode/skills/cli-external-orchestration/graph-metadata.json` | Modified | `spec kit runtime` removed from both intent-signal lists |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Modified | Database resolved through the same directory override the native resolver honours |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/python-ts-parity.vitest.ts` | Modified | Regime pinned before a dynamic import, pins 109 and 102, seven accepted rows with reasons |
| `research/gate-a-rerun-2026-09-05.tsv` | Created | 388 rows before the fixes, recorded bucket beside the re-run bucket |
| `research/gate-a-rerun-2026-09-05-after-keyword-fix.tsv` | Created | 388 rows after the keyword fix, one row differing |
| `research/gate-b-rerun-2026-09-05.tsv` | Created | 180 rows with the full prompt, top skill, compiled target, and hit flag |
| `../007-spec-kit-residue/implementation-summary.md`, `tasks.md`, `decision-record.md` | Modified | Fifteen continuity key files repointed or, where 049 deleted the file, dropped |
| `../007-spec-kit-residue/spec.md`, `plan.md` | Modified | Template sections filled from the phase's record, files table repointed under `runtime/cli/` |
| `../spec.md`, `../goal.md`, `../roadmap.md`, `../research/findings-register.md` | Modified | Parent reconciled with what the tree says, five register rows added, its header corrected |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Measurement first. Both gate sweeps ran as throwaway Node scripts in the session scratchpad,
one daemon call per row through `skill-advisor.cjs advisor_recommend`, classified with the
rules phase 002 and phase 003 wrote, and the daemon's generation was read before and after.
The check sweep ran in parallel: the voice-scanner's own checks, the doctor hub check on all
five hubs with the hub path passed, the compiled-route guard, the three skill-root gates, the
advisor's routing suites, and the CLI tests the closed phases had touched.

The scaffold failure was reproduced in scratch before any edit and the same scratch run and
the same suite proved the fix. The two findings first recorded as owned were then handed to
two fresh investigators, each with a frozen scope and no write authority, and every citation
they returned that a fix rests on was opened and read here before the fix was applied. Each
fix was proven by the check that had been red, then by the sibling suites, then by a full
Gate A re-run. A third fresh reviewer checked every claim in these documents against the
tree, and its findings were worked through rather than argued with.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the loader at the wrapper's root, not in the fallback | The fallback is a second renderer for an environment this tree does not have. The wrapper's spelling is the defect and its sibling library already had the right one |
| Remove spec-kit's `trigger-phrases` keyword rather than change the anchor test | Spec-kit's declared signal is `trigger index`. The field name belongs to sk-doc's frontmatter mode. Changing the scorer's anchor test is a scoring change D2 forbids |
| Fix the Python reference's database resolution rather than override it in the test | One scorer honoured the directory override and its reference did not. That seam is what produced the drift, and a test-side override would have left it |
| Re-pin only after the regime was deterministic and the number reproduced twice | A pin captured against a live graph was wrong within minutes. The new pin moves only with a diff |
| Retire `spec kit runtime` from the CLI hub | Spec-kit already wins it at 0.93 and the CLI hub's written boundary is executor dispatch. Phase 004's rule decides collisions by the losing hub's boundary |
| Record the validator gap rather than widen the rule | Widening it is a fleet gate change that would fail every packet still carrying scaffold text, and that blast radius is the operator's to accept |
| Level 3 for this phase | The level script scored it Level 1 on size, but the phase rules on four decisions, and the packet rule is to go higher when judgment and the script differ |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `scaffold-golden-snapshots.vitest.ts` under the CLI workspace config | PASS, 9 of 9. 1 failed before the fix on `before-after.md` |
| `inline-gate-renderer.vitest.ts` with its loader path corrected | PASS, 12 of 12 |
| Scratch `create.sh --level 3 --skip-branch --with-lazy-addons` | PASS, eleven documents rendered |
| `parent-skill-check.cjs` on all five hubs, hub path passed | PASS, `all hard invariants passed` on each |
| `compiled-route-guard.cjs` after the retirement and the keyword removal | PASS, `All hubs fresh or excused` |
| `ci-skill-root-metadata`, `ci-leaf-manifest-freshness`, `ci-skill-derived-freshness` | PASS, 14 of 14 on each |
| `skill_graph_compiler.py --validate-only` after the keyword removal | PASS |
| Live replay `spec kit runtime` | `system-spec-kit` 0.93 first, CLI hub 0.467 second |
| Live replay `delegate to opencode for code generation` | CLI hub 0.811 first with target `cli-opencode` |
| Live replay `trigger_phrases` after the daemon rebuild | `sk-doc` 0.487. `trigger index` still `system-spec-kit` 0.70 |
| `python-ts-parity.vitest.ts` from the final tree, twice | PASS, 2 of 2 each run, report 109 and 102 with seven accepted rows both times |
| Six sibling advisor suites after both advisor changes | PASS, 41 tests |
| Voice-scanner self-checks `test_hvr_scan.py` | PASS, `ALL PASS` over eleven checks |
| Gate A re-run, before and after the keyword fix | 343 then 344 of 388. The one remaining difference is the retired signal |
| Gate B re-run | 20 of 180 intended-mode top picks, 93 empty, 0 errors, full prompts stored |
| Independent review: 20 random corpus rows re-queried live | 20 of 20 reproduce |
| `validate.sh --strict --recursive` on the parent | PASS, `RESULT: PASSED` on all nine folders |
| `check-placeholders.sh` on the parent, phase 007, this phase | PASS, zero patterns on each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The validator's placeholder rule still does not read bracketed template text.** ADR-004 records the mechanism and the owner. Until it changes, run `check-placeholders.sh` beside `validate.sh` before any completion claim.
2. **The scorer's space-keyed anchor test remains.** Two hubs declaring the same underscored token will trip it again. This is the second recorded instance. Changing the test is a scoring change outside this packet.
3. **The inline render fallback still cannot batch.** A tree with no tsx installed anywhere would fail the scaffold the same way. ADR-001 records why it was not widened.
4. **One figure in ADR-002 is the investigation's, not re-run here.** The Python reference reading 107 against the metadata as committed at the pin commit and at HEAD. What was verified here is that the isolated regime reproduces and that 112 is not among its readings.
5. **The phase 007 narrative still names the pre-nesting `scripts/` tree in prose.** Its continuity paths and its files table are current. The body describes the tree as it stood when the phase ran, which is what a record should do.
<!-- /ANCHOR:limitations -->

---
