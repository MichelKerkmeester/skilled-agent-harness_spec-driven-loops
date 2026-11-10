# Iteration 9 - Internal consistency of the v2.3 template contract

## Focus

Maintainability of the artifacts a weak model actually reads: are the five v2.3 templates stamped and guided consistently, do their level markers and optional-section headings agree with each other, and was the remediation for the `L3+:` misreading applied everywhere the same heading appears or only where the failure was observed?

## Files Reviewed

- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl` (heading counts, `FILL:` counts, stamp lines, `## L3+:` sections)
- `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:31` (stamp, section and fill counts)
- `.skilled/skills/system-spec-kit/templates/packet-types/*.tmpl` (stamp lines for the four packet-type templates)
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:330-407` (three `## L3+:` sections and their fill notes)
- `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:229-243` (the clarifier sentence as shipped)
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:18` (the fix-completeness note fix described as the cause)

## Findings

### P0 Findings

None.

### P1 Findings

None. Nothing shipped is wrong today: every template a packet is scaffolded from is stamped, guided and anchored consistently, and the drift guard proves the examples still match.

### P2 Findings

1. **The `L3+:` clarifier was added to all six `tasks.md` sections and to none of the three `plan.md` sections that carry the same heading** -- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:330` -- `tasks.md.tmpl` opens each of its six `## L3+:` fill notes with "L3+ means Level 3 and above, so this section stays at Level 3" (6 of 6 headings, 6 occurrences). `plan.md.tmpl` has three `## L3+:` sections — `AI EXECUTION FRAMEWORK` (`:330`), `WORKSTREAM COORDINATION` (`:378`) and `COMMUNICATION PLAN` (`:405`) — and zero occurrences of the clarifier; their fill notes instead say "Name the workers, their files and the order" and the like. The packet's own diagnosis of the benchmark failures is the heading prefix: "The run's reply says 'L3+ optional sections dropped (this is Level 3, not 3+)', so it read the `## L3+:` heading prefix as meaning Level 3+ only" (`report README:34`), and the follow-up it opened was "make the L3+ heading label unambiguous for Level 3 authors". That remedy reached the template where the failure was seen and not the sibling template that uses the identical prefix, so a run that infers "L3+ means Level 3 and above only" from `plan.md`'s headings still gets no correction inside the document.

## Traceability Checks

- **Stamp coverage**: exactly five templates carry a `v2.3` `SPECKIT_TEMPLATE_SOURCE` stamp — the four core templates plus the acceptance-criteria addon — which matches phase 003's "seven stamp lines and five manifest entries read v2.3" once the three level-variant lines inside `spec.md.tmpl` are counted.
- **Fill-guidance coverage**: every `##` section of every v2.3 template carries one `FILL:` comment with a GOOD and a WEAK example — `spec.md.tmpl` 24/24, `plan.md.tmpl` 18/18, `tasks.md.tmpl` 22/22, `implementation-summary.md.tmpl` 6/6, `acceptance-criteria.md.tmpl` 3/3. Phase 004's claim holds at the section level.
- **Anchor contract**: the example drift guard compares each hand-written example's anchor set to the template's contract and exits 0, so the v2.3 headings did not desynchronise the anchors; the packet's own `missing_anchors` metric is 0 on the deciding set.
- **Packet-type templates deliberately stay on their older stamps**: `phase-parent-spec`, `research-record` and `review-record` read `v2.2` and `review-report` reads `v1.0`. That is consistent with D2, which freezes the token gate to v2.3 documents so no existing packet changes verdict; none of the four is on the weak-model authoring path.
- **Goal documents** are produced from `sk-create-goal` assets in `sk-doc`, not from a system-spec-kit template, so they are outside this packet's template surface and are not counted as a gap.
- Overlay protocols: closed in iterations 6 and 7.

## Confirmed-Clean Surfaces

- The three `plan.md` `L3+:` fill notes do not invite deletion, unlike the `tasks.md` notes that say "or delete the section when the packet records no ADR". That is why the missing clarifier is advisory rather than a live regression: a run has no instruction to drop those sections, and the anchor rule counts any missing `plan.md` anchor unconditionally, so a deletion there would fail the metric rather than pass it.
- The heading prefix itself is consistent across templates — the same `## L3+:` spelling everywhere — so a reader who learns the meaning in one template carries it to the other; the defect is the absence of the in-document correction, not a divergent label.
- `spec.md.tmpl` carries three stamp lines because it holds the Level 2 and Level 3 variants inline; all three read v2.3, so no level can be scaffolded at an older stamp through that file.

## Assessment

Dimensions addressed: maintainability

One P2 finding, and it is the same shape as the packet's own history: a remedy applied at the site of the observed failure rather than at every site that shares the cause. The v2.3 contract is otherwise internally consistent — five stamped templates, one fill instruction per section with a good and a weak example, anchors that match the examples, and packet-type templates left deliberately on their old stamps.

## Next Focus

Iteration 10 (security and traceability residuals): what the first nine passes did not claim — the new gate and guard scripts' own comment hygiene, whether any shipped doc still tells a reader to run a command that does not exist, whether the packet's phase-status surfaces agree with the parent after the closeout, and whether the review packet's own artifacts were written inside their owner folders only.

Review verdict: PASS
