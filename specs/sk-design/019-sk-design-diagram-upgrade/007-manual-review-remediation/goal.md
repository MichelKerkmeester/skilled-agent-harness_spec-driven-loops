---
title: "Goal: fix every manual-review finding at its current path"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "manual review remediation"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 7 planning documents from the manual review's 34 numbered findings"
    next_safe_action: "Dispatch T001-T003, then the P1 pair (T004-T005), then the six lanes in order"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/scratch/evidence/manual-review-opus.md"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/color-gates.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/assets/color/diagram-palette.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-007-manual-review-remediation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Goal: fix every manual-review finding at its current path

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every one of the 34 manual-review findings (F1-F34) is fixed in its shipped file
with evidence, or recorded with a reason a reader can check, at today's paths, without touching a
systemic pattern or moving a file.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision
(`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D16 | Every review finding ends as a fix with evidence or a recorded reason; a doc-versus-corpus contradiction (F26) is resolved in one direction and the losing side is edited. This node closes all 34 F-numbered findings; the ten S-numbered systemic patterns stay 008's. |
| D1 | Every colour a fix in this node introduces or changes MUST already be a role value of the file's own skin — no new hex — so `apply-diagram-tokens.cjs --default` and `--default --examples` reproduce every corpus file byte for byte after every fix lands. |
| D15 | Implementation runs on DeepSeek V4.1 Flash at max thinking through cli-pi and llmgateway, one lane per dispatch, each brief carrying the exact file, the exact line and the exact replacement; verification is the conductor's, never the executor's. |
| D12 | Nothing in this node touches `sk-design-chart`; nothing here changes a checker family 005 already shipped — this node fixes corpus content, not tooling. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently. D5 (the 4px exemption list) and D8/D9 (the accent departure and
`#3d4460`'s type-scoped role) are inherited without reopening: every fix in this node stays inside
those signed exemptions rather than re-adjudicating them. D13 (the future one-form-library merge)
is honored by leaving every file at its current path — this node fixes content only.

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every AC-001 through AC-037 row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED`
- [ ] `node scripts/apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>` reproduce every file byte for byte (`diff -rq` empty)
- [ ] `node --test scripts/tests/` passes and `grid-baseline.json`'s per-file counts hold or fall against the pre-remediation snapshot
- [ ] Every file this node touches has a fresh render that was viewed before its task closed
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, goal) | Pending | Drafted in this pass; `validate.sh --strict` and operator review still pending |
| Fact base re-verified on disk before authoring | Done | `template-full.html`'s `viewBox` (`:181`) and legend lines (`:328-332,:359-360`), `example-timeline.html`'s five `cx` values and year tick (`:82-116`), and `example-data-flow.html`'s `.chip-text` rule (`:22,30`) all matched the review exactly |
| T001-onward mechanical execution | Pending | Drafted in `tasks.md`; DeepSeek execution pending operator dispatch |

### Deviations and findings

| Item | Note |
|------|------|
| F1 and F3 share one edit | `template-full.html`'s legend-position fix (F1) is the review's own stated fix for F3 too; F3's task (T015) is sequenced after F1's (T004) and checks the already-landed state rather than making a second edit |
| F26 touches two supporting files, not the example itself | `assets/color/diagram-palette.json` and `derivation-record.md` §1 carry the wrong fact per F26; `example-sequence-oauth-dark.html` itself needs no byte changed — its task's check is that it now gates as a normal file |
| F32's two other dead tokens | `template-full.html`'s `--color-rule-solid` and `--color-accent-tint`, flagged in F32's own body text, are not actioned this phase — F32's stated "Fix:" line names only `--color-link`; reopening the other two would exceed this finding's scope. Left as an open observation for a later phase, not an invented finding number |
| F23's candidate hexes are not usable as written | The review's own suggested fixes (`#8a6a3c`, `#5c6b51`) are not declared roles; T022 instead requires measuring every existing role against each chip fill with `color-gates.cjs` and picking whichever clears 4.5:1, so the byte-for-byte guarantee (D1) survives the fix |
<!-- /ANCHOR:log -->
