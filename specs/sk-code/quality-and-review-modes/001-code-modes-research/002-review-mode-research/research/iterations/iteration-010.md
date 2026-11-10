# Iteration 10 — Repo-local policy and floors

## Focus

Angle 10: Repo-local policy and floors (Q10). Where a repository could keep severity overrides, mandatory checks, and ignore paths without forking the hub; which floors no recommendation may relax; and how a later change should be proven through both routing stages.

## Actions Taken

- Read the lineage config, state log, strategy, and registry. Q10 was unchecked at the start of this iteration.
- Read the named private-surface spec, `sk-code-review` section 4, and `check-rule-copies.js`; then inspected the hub-routing rule and the current `sk-code` router config for the two-stage proof path.
- This was a documentation and code reading pass. I did not inspect a review-policy loader or run a live routing scenario.

## Findings

- **OBSERVED — Repository policy can live outside the shared hub.** The private-surface spec places repo-specific ignore rules and a blocking staged-path guard at repository level. That is a useful placement precedent for a review policy file owned by the checkout. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:101] `Four slash-less root ignore rules cover`

- **OBSERVED — Review and evidence floors are binding.** Review requires baseline security and correctness regardless of surface, and it forbids approval with an unaddressed P0. The universal quality standard says restraint cannot cut P0 items or user-requested work. Actionable findings still need file-and-line evidence, and the copy checker pins the evidence labels for confirmed versus inferred claims, observed command output, findings as hypotheses, and the limits of one reviewer’s read. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:418] `Enforce baseline security/correctness minimums regardless of surface`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:426] `Approve code with unaddressed P0 security/correctness defects`; [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:54] `Restraint never cuts a P0 item`; [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:54] `or anything the user asked for`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:419] `Include file:line evidence for actionable findings`; [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:74] `**Confirmed vs inferred**`; [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:75] `**Observed command evidence**`; [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:76] `**Finding = hypothesis**`; [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:77] `**Your own read is also one lens**`

- **OBSERVED — The copy checker protects shared wording, not repo overrides.** It describes itself as a canary rather than a generator and says it locks wording rather than paths; the inspected checker contains fixed shared invariants, not a repository policy loader. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:19] `It is a canary, not a generator`; [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:20] `It locks wording, not file paths`

- **INFERRED — Add one repo-owned policy file and let the shared mode consume it.** A candidate location is `.skilled/repo-rules/code-review-policy.json`, with bounded `severityOverrides`, additive `mandatoryChecks`, and `ignorePaths` fields. The shared review mode would validate and read this file so repositories keep their own values without copying or forking the hub. Overrides may raise severity or adjust non-floor rules; mandatory checks only add obligations; ignore paths may filter optional checks but cannot skip baseline security/correctness review or files explicitly in the requested scope. The docs read here do not establish that this loader already exists. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:101] `Four slash-less root ignore rules cover`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:108] `Always enforced; never relaxed by surface guidance`

- **DERIVED — Prove a routing change at both stages with a real request.** Stage one is the advisor selecting the `sk-code` hub from its `graph-metadata.json`; stage two is `hub-router.json` plus `ROUTER.md` selecting `sk-code-review` and its resources. For a later policy-loader or routing change, run the representative request through the real advisor, then replay it through the hub router and assert the review mode and local policy resource are reached. Run the per-hub gate with the changed hub path, read its subject line, and use an out-of-domain prompt as a negative control; registry presence or a green gate alone does not prove reachability. [SOURCE: .skilled/repo-rules/skill-hub-routing.md:58] `the advisor, reading the hub's graph-metadata.json`; [SOURCE: .skilled/repo-rules/skill-hub-routing.md:59] `the hub's hub-router.json and root ROUTER.md`; [SOURCE: .skilled/repo-rules/skill-hub-routing.md:87] `Then replay both stages with a real request`; [SOURCE: .skilled/repo-rules/skill-hub-routing.md:121] `I replayed a real request through both stages`; [SOURCE: .skilled/skills/sk-code/hub-router.json:29] `resources": ["sk-code-review/SKILL.md"]`

## Questions Answered

- Q10 Repo-local policy and floors: where could a repository keep severity overrides, mandatory checks and ignore paths without forking the hub, which floors may no recommendation relax, and how would a later change be proven through both routing stages?

## Questions Remaining

- **UNKNOWN:** Does the live review runtime already load any repository-owned policy file? Resolve by tracing the review-mode loader and running a focused scenario with a policy file, including floor-preservation and ignored-path cases.
- The dispatch context still carries Q2–Q9 as open while the strategy marks earlier questions answered. This iteration leaves that reducer/dispatch state discrepancy untouched.

## Next Focus

No scheduled key question remains after Q10. The next useful check is to confirm the repo-policy loader behavior in a live review scenario and replay both routing stages with a representative request and a negative control.
