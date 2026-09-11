# Iteration 4: Maintainability and stabilization — doc metadata, README claims, unshipped advisory rule, replay of prior findings

## Focus

- Dimension: D4 Maintainability (primary), plus the stabilization/adversarial replay of prior findings and one residual traceability sweep over the advisory rule engine.
- Files reviewed: `.opencode/skills/sk-git/assets/commit-message-template.md`, `.opencode/skills/sk-git/README.md`, `.opencode/skills/sk-git/references/quick-reference.md`, `.opencode/skills/sk-git/references/commit-workflows.md`, `.opencode/skills/sk-git/feature-catalog/feature-catalog.md`, `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md`, `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs`, `.opencode/skills/sk-git/scripts/hooks/`, parent `spec.md` (§3), `003-contract-and-hook/spec.md` + `tasks.md`, `002-format-decision/decision-record.md`.
- Scope investigated: metadata drift, README claims vs fail-open behavior, template example hygiene, and the parent-spec advisory deliverable.

## Scorecard

- Dimensions covered: maintainability, traceability (residual), correctness replay
- Files reviewed: 12
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 for new items in this iteration; the replay below confirms prior severities with no transitions

## Findings

### P0, Blocker

None.

### P1, Required

- **F013**: The parent spec's in-scope deliverable "the preflight advisory rule and the blocking `commit-msg` hook, each with a test" (`spec.md:86`) and its Files-to-Change row "Modify `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` — Advisory rule for the new shape" (`spec.md:108`) are not shipped, and no child document records a decision to drop them. The rule engine still registers exactly the 17 pre-existing rules (`git-rule-checks.mjs:167-435`; README "17 state-gated rules", `README.md:53`); searching all seven children for `advisory|preflight|git-rule-checks` finds only `001-research/spec.md:91` (the research question) and an unrelated 007 fix — the 002 decision record's five ADRs never mention it, and 003's 60 checked tasks never reference the file. Either implement the advisory (e.g., a rule that names the missing `Spec:`/`Commit-Id:` shape before the command runs) with its test, or record the supersession decision in the packet so the scope row is closed honestly.

**Claim adjudication packet — F013**

```json
{
  "findingId": "F013",
  "claim": "The scoped preflight advisory rule for the new commit shape and its Files-to-Change row were silently dropped between the parent spec and phase execution; no decision record supersedes them.",
  "evidenceRefs": [
    ".opencode/specs/sk-git/028-crawlable-commit-history/spec.md:86",
    ".opencode/specs/sk-git/028-crawlable-commit-history/spec.md:108",
    ".opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs:167-435",
    ".opencode/skills/sk-git/README.md:53"
  ],
  "counterevidenceSought": "Grepped all child spec/tasks/decision documents for advisory/preflight/git-rule-checks (only the 001 research question and an unrelated 007 advisory fix), grepped scripts/hooks and scripts/lib for Commit-Id/trailer/commit-shape (none), counted the hard_rules block and the rule engine (17 rules, none about the new shape), and checked the 003 tasks list (60/60 checked, no mention).",
  "alternativeExplanation": "The team may have judged the blocking hook sufficient and treated the advisory as redundant; rejected because no ADR, checkpoint, or task records that decision, and the parent scope still lists it as an in-scope deliverable.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "A recorded decision that the blocking hook supersedes the advisory, or an implementation of the rule plus its test, downgrades this to P2 housekeeping.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P1", "reason": "Initial discovery during the maintainability/cross-check sweep" }
  ]
}
```

### P2, Suggestion

- **F014**: The README overstates the stamping guarantee in two places — "an always-stamped seven-digit `Commit-Id:` ordinal" (`README.md:28`) and "every commit carries `Commit-Id: NNNNNNN`" (`README.md:155`) — while the stamper is deliberately fail-open (allocator failure leaves the message unstamped, `prepare-commit-msg:191-194`; missing allocator exits silently, `:47-50`) and the `commit-msg` hook never requires the trailer to be present (`commit-msg:149-167` validates only when present). The changelog is precise ("In a repository without the allocator it exits silently", `changelog/v1.6.0.0.md:11`); the README is the one document that promises more than the machine enforces.
- **F015**: `feature-catalog/feature-catalog.md` still carries `last_updated: "2026-07-17"` after this packet's edit (commit `98be1cebc2` added the root catalog sentence at `:131` without touching the field), so the inventory's currency stamp misstates when it was last revised. Same pattern, lower confidence: `references/quick-reference.md` (`version: 1.1.0.12`) and `references/commit-workflows.md` (`version: 1.1.0.9`) were both edited by this packet (search recipes and the Step 5 rewrite) with no version change; if the family convention is bump-on-edit, those stamps are stale too.

## Stabilization / Adversarial Replay

- **F001 replayed against the real tool, confirmed.** Feeding a hook-accepted shape (keys followed by trailing prose) to `git interpret-trailers --parse` returns no key lines; the well-formed final paragraph returns `Spec:` and `Commit-Id:`. The advertised values query therefore silently misses exactly the messages the hook accepts — the failure is real, not inferred.
- **F005 counterevidence re-checked, severity unchanged.** The same repository-controlled-execution pattern exists pre-packet (`pre-commit:16-19` sources repo `hook-flags.sh`; `post-merge:24-27` sources the repo guard) and the global hooks dir currently has no `prepare-commit-msg` symlink; this packet extends an established pattern rather than opening the class. Keeping P2 with the systemic note. If the project wants this treated as a vulnerability, it is a framework-level change (validate the trusted checkout) outside this packet's scope.
- **F009/F010 re-read, severities unchanged.** Neither is a functional contradiction: the `REPO RULES.md` row is superseded documentation, and the hand-written-id claim is stronger wording than the fail-safe implementation but does not change uniqueness behavior.
- **Finding registry consistency**: 15 findings (P0=0, P1=2, P2=13); F001-F012 observed in ≥2 iterations with no severity transitions → `persistentSameSeverity`; no finding has been downgraded, upgraded, resolved or disproved, so `severityChanged`, `resolvedFindings` stay empty.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `spec.md:86`, `:108` vs `git-rule-checks.mjs:167-435` | The advisory-rule scope item (F013) is the one normative deliverable with no shipped behavior; the remaining rows resolve as recorded in iteration 3. |
| checklist_evidence | partial | hard | `006/tasks.md:224-227`, `007/tasks.md:224-227` | Unchanged from iteration 3 (F011). |
| feature_catalog_code | pass | advisory | `feature-catalog/workflow-playbooks/conventional-commit-workflows.md:30-46` | Unchanged; F015 is metadata currency, not a catalog-content mismatch. |
| playbook_capability | partial | advisory | GIT-044 scenario | Unchanged; executable post-install. |

## Assessment

- New findings ratio: 1.0 (three new items this iteration). Severity-weighted new: 5×1(P1) + 1×2(P2) = 7.
- Dimensions addressed: maintainability, residual traceability, correctness replay.
- Novelty justification: F013 is a genuinely unimplemented scoped deliverable — the highest-value finding of the run's second half; F014/F015 are metadata/claims precision issues not previously recorded.

## Ruled Out

- Template example hygiene: worked examples show the no-packet shape (only `Commit-Id:`) and the packet shape (`Spec:` + `Commit-Id:`) with correct blank-line separation (`.opencode/skills/sk-git/assets/commit-message-template.md:95-128`); no intra-document grammar conflict.
- README "17 rules" count vs engine: 17 ids match the README claim; the missing rule is scope (F013), not a count error.
- A drift between `SKILL.md` type list and the hook regex: both allow the same 13 type tokens with `revert`/`merge` present in the hook alternation (`commit-msg:72`).

## Dead Ends

- Looking for a hidden 18th advisory rule under a different file: `scripts/hooks/` and `scripts/lib/` contain no Commit-Id/trailer references at all.
- Checking whether the parent spec's `REPO RULES.md` row and the advisory row were intentional remnants of one edit: they sit in different tables (Files to Change vs Phase Map) with different supersession stories; recorded separately as F009/F012/F013.

## Recommended Next Focus

None — iteration 4 closes the configured ceiling (`stopPolicy=max-iterations`). Proceed to synthesis: dedupe F001-F015, apply the verdict mapping (2 active P1, no P0 → CONDITIONAL), and record `stopReason: maxIterationsReached`.

Review verdict: CONDITIONAL
