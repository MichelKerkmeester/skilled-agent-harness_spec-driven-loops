# Iteration 007: Surface packets (Q7)

## Focus

Q7 Surface packets: how is surface evidence applied in review, does a workflow diff get the CI rules, and could a surface declare the evidence review should read?

## Actions Taken

- Read the review surface precedence and detection contract, the CI and Skilled surface packet maps, the mode registry, the hub router and its second-stage resource map.
- Ran `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "Review .github/workflows/ci.yml diff" --surface-hint UNKNOWN`. Exit 0 returned only `sk-code-review`.
- Ran `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "Review this GitHub Actions workflow diff" --surface-hint UNKNOWN`. Exit 0 returned `sk-code-review` plus `sk-code-ci`.
- No live review-agent run against a workflow diff was performed. The route selection is observed; end-to-end consumption of CI references by a review run remains unverified.

## Findings

### Finding 1 — DERIVED

A path-only GitHub workflow review route does not bundle CI in the compiled route, while an explicit “GitHub Actions workflow” request does. This conflicts with the CI packet's declared path-based bundle trigger and review-time application rule. The two route probes returned the results recorded above. [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:22] `reviews a file under .github/workflows/`; [SOURCE: .skilled/skills/sk-code/hub-router.json:77] `github actions workflow, ci workflow`; [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:109] `sk-code-review applies the rules to a workflow diff`.

### Finding 2 — OBSERVED

Review keeps security and correctness as an unconditional baseline. Detected surface guidance can replace generic style/process advice and provide authoritative verification commands. Surface packets are read-only evidence that the paired workflow mode applies. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:108] `Always enforced; never relaxed by surface guidance`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:109] `Surface guidance overrides baseline generic style/process advice`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:110] `Surface commands are authoritative for the detected surface`; [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] `read-only domain-evidence packets`.

### Finding 3 — DERIVED

A surface can declare its own intent-to-reference map, but its local map alone does not register or route the packet to review. The hub registration and the second-stage resource map must carry it. The current hub lists two surfaces. [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:51] `sk-code-ci owns its intent -> reference routing`; [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:110] `The hub registration lives in`; [SOURCE: .skilled/skills/sk-code/SKILL.md:39] `The hub has exactly two surfaces`; [SOURCE: .skilled/skills/sk-code/ROUTER.md:397] `only the detected surface's slice`.

## Questions Answered

- Q7 Surface packets: how is surface evidence applied in review, does a workflow diff get the CI rules, and could a surface declare the evidence review should read?

## Questions Remaining

- Q8–Q10 remain scheduled for later iterations.
- The dispatch context still carries Q2–Q5 as open despite the strategy marking those questions answered. This iteration leaves reducer-owned state reconciliation untouched.

## Next Focus

Angle 8: Consumers and contracts (Q8).
