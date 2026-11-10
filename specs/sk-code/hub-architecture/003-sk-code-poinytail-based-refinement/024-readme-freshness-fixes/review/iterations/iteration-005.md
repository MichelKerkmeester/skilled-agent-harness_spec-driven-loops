# Deep Review Iteration 005 — Security: full-diff credential scan, wording/box/version recheck, adversarial pass

**Dispatcher:** @deep-review, iteration 5 of 5 — run `2026-10-12T16:20:15.273Z-i5`, session `2026-10-12T16:20:15.273Z`, generation 1, lineageMode `new`, mode `review`, executor cli-devin (`deepseek-v4-1-flash-max`). Prior findings: P0=0 P1=0 P2=2.

## Dimension

Security — does any changed line leak a secret, a token value or a private path? Maintainability and an adversarial pass ran alongside it: do the new sentences read worse, contradict a nearby sentence in the same doc, or break a table, tree or ASCII box; did a version line change other than by the commit hook (each changed skill doc should rise one step); is any README claim now true but phrased so it will go stale faster; and can any earlier finding be disproved.

## Files Reviewed

State read first: `review/deep-review-config.json`, `review/deep-review-strategy.md`, `review/deep-review-findings-registry.json`, and iteration narratives 001–004.

The whole product diff, read line by line — all 491 lines of `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch` (base 0725425d46), covering exactly the 15 product files:

| File | Changed anchors (hunk ranges) |
|------|-----------------|
| `README.md` | :24, :66, :80, :98, :122-125, :144-147, :418-426, :782-785, :878-881, :930-933, :1071-1074, :1275-1278, :1432-1435 |
| `.skilled/scripts/git-hooks/README.md` | :17-27, :41-47, :70-76, :121-127 |
| `.skilled/bin/README.md` | :74-77 |
| `.skilled/bin/lib/README.md` | :69-75, :90-97 |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | :1754-1760, :1799-1824, :1862-1868 |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | :407-414, :430-441 |
| `.skilled/skills/cli-external-orchestration/README.md` | :17-23, :91-97 |
| `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` | :1-13 |
| `.skilled/skills/sk-doc/README.md` | :19-25, :217-223 |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | :9-15, :119-125 |
| `.skilled/skills/sk-git/README.md` | :8-14, :201-207, :264-270, :285-291 |
| `.skilled/skills/system-deep-loop/runtime/README.md` | :22-28 |
| `.skilled/skills/system-skill-advisor/README.md` | :7-13, :110-116, :151-157 |
| `.skilled/skills/system-spec-kit/README.md` | :10-16, :46-52 |
| `.skilled/skills/system-spec-kit/runtime/README.md` | :23-29 |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The iteration is clean; no finding was fabricated to fill the section.

## Security Scan (dimension focus)

- **No secret or token value in any changed line.** Every line of the 491-line product diff was read directly. The only credential-adjacent text is the ClickUp auth rewrite at `README.md:1435`: it names the `cupt auth` command and the `pk_` token prefix, and states the MCP path needs "one OAuth approval" — a command, a prefix and a flow, never a value. The same line removes the old "requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`" claim, which contradicted the skill's own reference that the MCP route reads no API key [SOURCE: README.md:1435] [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:52].
- **No absolute private path.** Every path mention in the changed lines is repo-relative (`.skilled/...`, `specs/...`, `.opencode/agents/`, `.hermes/agents/`, `.utcp_config.json`); the cli-hermes line names a config key path (`providers.llmgateway.base_url`), not a filesystem location [SOURCE: .skilled/skills/cli-external-orchestration/README.md:94].
- **No secret material in the code hunks.** The checker and test hunks remove the README-version check and add a negative assertion; the INSTALL-GUIDE hunk bumps the frontmatter version and removes the `> **Version:** 2.0.0` body line — no secret or key material in any of them.

## Maintainability and Adversarial Pass

- **Boxes, trees and tables hold.** The two root README ASCII boxes (:122-125, :144-147) keep column-consistent edges after the count edits (12→11 and 42→41 are same-width swaps); the git-hooks diagram (`8 blocking`→`10 blocking`, padding adjusted) and the changed trees (bin/lib, git-hooks, deep-loop runtime `changelog/`) keep their comment columns [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:405].
- **No contradiction introduced.** The frontmatter-versioning replacement sentence reads coherently and names the check that exists (`ROUTER.md` plus the three JSON files against `SKILL.md`); the advisor sentence and its table row agree on seven options; the git-hooks README's ten/nine text, diagram, tree comment and boundary row are mutually consistent; the spec-kit Node engines line and the runtime hooks-adapter list match their sources as recorded in iterations 2 and 4.
- **Version-line sweep (dispatch question 3).** Exactly seven version raises appear in the diff, each a single step on the third segment with the fourth segment reset: 1.7.3.0→1.7.4.0, 1.0.0.0→1.0.1.0, 2.3.4.0→2.3.5.0, 1.0.2.0→1.0.3.0, 1.8.4.0→1.8.5.0, 0.12.0.54→0.12.1.0, 2.7.0.99→2.7.1.0. The pattern is uniform and matches the bump engine's raise path recorded in iteration 4 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409] (carried evidence; not re-read this iteration). Five changed docs carry no version-line change — recorded as a coverage limit under Edge Cases.
- **Faster-staling check (dispatch question 4).** No changed claim stales faster than the line it replaced: the sk-git fix deliberately drops the unverifiable scenario number, the advisor sentence gained one precisely-scoped option, and the mirror sentence now names the complete runtime set (five mirrored, two linked). Count-style claims keep their original durability.
- **Adversarial recheck of prior findings.** R4-P2-001 (spec.md's "twelve related READMEs" against the eleven-doc fix set) and R4-P2-002 (tasks.md's checked "All tasks marked [x]" with T007/T008 open) were re-examined against the diff and prior evidence; neither is disproved, and both remain active P2 doc-state fixes for remediation. The blocked `stale_mirror_claim` direction stays blocked — the mirror trees are still not materialized in this worktree.

## Traceability Checks

| Protocol | Level | Status | Detail |
|---|---|---|---|
| `spec_code` | core | pass | Carried from iteration 4; the security read added no new spec-row mapping and contradicted none |
| `checklist_evidence` | core | partial | R4-P2-002 remains active (tasks.md completion block) |
| `skill_agent` | overlay | notApplicable | Docs and one doctor checker; no skill-agent mapping surface moved |
| `agent_cross_runtime` | overlay | blocked | Mirror trees absent in this worktree; F11 rests on the orchestrator's readlink evidence |
| `feature_catalog_code` | overlay | pass | Carried from iteration 4 (111/35 counts at README.md:881) |
| `playbook_capability` | overlay | pass | Carried from iteration 4 (sk-git 9 categories) |

## Integration Evidence

No integration surface was executed or re-read this iteration. The surfaces the version-line sweep leans on — `.skilled/scripts/git-hooks/pre-commit` (doc version bump gate) and `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (raise path at :409) — were read in iterations 2–4 and are cited here as carried evidence, not as new reads.

## Edge Cases

- **Five changed docs carry no version-line change** (`.skilled/bin/README.md`, `.skilled/bin/lib/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`). Whether any of them carries a `version:` field that should have been raised was not re-read this iteration — this dispatch runs no shell and the read budget went to the full 491-line diff. Corroborated-only, recorded as a coverage limit, not a finding.
- **No shell in this dispatch** (accept-edits): the security scan is a direct read of every changed line, not a pattern grep; a token value would have to be visible in the diff text to exist in the commit, and none is.
- **Diff read is the canonical changed-line set**: 15 `diff --git` files, matching the ledger's "15 files across six dispatches" (iteration 4) and the review target.
- **Prior-finding state is doc-level**: both active P2s live in the phase's spec docs (spec.md:63, tasks.md:63), not in the product surface; the product diff itself carries no open finding.

## Confirmed-Clean Surfaces

- Root README count fixes (11 agents, 37 commands, 41 rules/seven warn, 20 workflows, 111/35 ClickUp) — consistent across every changed anchor; no counterevidence in this read.
- ClickUp auth rewrite at `README.md:1435` — names only, no values; aligns with the skill reference.
- 13c removal surface (checker, tests, frontmatter-versioning sentence) — unchanged since iterations 2–3 verified it; this read adds no contradiction.
- Version raises (seven) — uniform one-step pattern.
- Boxes, diagram, trees and tables — column-consistent.

## Ruled Out

- Secret or token value in the changed surface — every changed line read; only the `pk_` prefix and `cupt auth`/OAuth wording, no value (iteration 5, evidence: review-diff.patch:1-491; README.md:1435).
- Absolute private path in the changed surface — all path mentions repo-relative (iteration 5, evidence: review-diff.patch:1-491).
- Off-pattern or multi-step version changes — all seven raises are one-step third-segment raises (iteration 5, evidence: review-diff.patch:169-170, 191-192, 211-212, 233-234, 255-256, 307-308, 338-339).
- Box, tree or table breakage from the wording fixes — edges and columns verified on every changed block (iteration 5, evidence: review-diff.patch:137-148, 293-298, 405-422).
- Disproving R4-P2-001 or R4-P2-002 — no counterevidence found; both stay active (iteration 5).

## SCOPE VIOLATIONS

None. No out-of-scope mutation was attempted; writes were confined to this narrative, the delta file and the strategy file.

## Next Focus

- **Dimension:** none — the five-iteration cap is reached (stop policy max-iterations); iteration 5 closed the security dimension and the loop hands off to synthesis.
- **Carry-forward:** (a) `agent_cross_runtime` mirror closure — still blocked; (b) the five non-version-bumped docs — corroborated-only; (c) R4-P2-001 and R4-P2-002 — doc-state fixes for the remediation step, not review blockers.

## Verdict

No new findings; no active P0 or P1. Two P2s remain active from iteration 4 (R4-P2-001, R4-P2-002), both doc-state fixes. PASS with advisories (hasAdvisories=true).

Review verdict: PASS
