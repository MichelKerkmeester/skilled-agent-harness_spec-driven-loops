# Iteration 5: CI/Hooks Wiring (broaden angles) — Trigger Coverage + Pre-push Semantics

## Focus
Broaden angles past the four primary dimensions into spec.md §2.6 (CI/hooks wiring): `.github/workflows/routing-registry-drift.yml` trigger coverage and `.opencode/scripts/git-hooks/pre-push` skill-metadata gate semantics. Cross-cutting recheck of the highest-blast-radius item: whether a `command-metadata.json` regression can reach origin without CI catching it.

## Scorecard
- Dimensions covered: maintainability (cross-cutting CI wiring)
- Files reviewed: 2 (routing-registry-drift.yml, pre-push)
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.70

## Findings

### P0, Blocker
(none)

### P1, Required
- **F009**: CI workflow trigger `paths` omits `command-metadata.json`, so a command-metadata regression on the release line bypasses CI. `.github/workflows/routing-registry-drift.yml` `push.paths` (lines 15-32) and `pull_request.paths` (lines 35-52) enumerate every other class-H/required/generated file (`mode-registry.json`, `hub-router.json`, `SKILL.md`, `leaf-manifest.json`, `leaf-manifest.config.json`, `leaf-aliases.json`, `description.json`, `graph-metadata.json`) but NOT `.opencode/skills/*/command-metadata.json` (grep confirms 0 occurrences). The workflow's final step (lines 101-109) runs `ci-skill-root-metadata.cjs`, which validates every hub's `command-metadata.json` against the core schema — `checkCommandMetadata` (ci-skill-root-metadata.cjs:260-303) checks command-id shape, `ownerMode` against the registry, choreography resource resolution, command-definition-file existence, and duplicate command/owned-signal uniqueness. The program explicitly graduated `command-metadata.json` from a sk-design-only overlay to a class-H requirement once this validating consumer existed (skill-root-metadata-contract.cjs:116-121; doctrine §3 "Why command-metadata.json is hub-required"). Yet editing ONLY a hub's `command-metadata.json` does not trigger this workflow. Release-line pushes to `skilled/v*` land directly with no PR (workflow comment lines 12-13), so CI is the authoritative backstop there; a bad `ownerMode`, an unresolvable choreography resource, or a missing command-definition file introduced via a command-metadata-only edit would not trigger CI. The local pre-push hook (pre-push:178-192) does catch it via the broad `git diff ... -- .opencode/skills` guard, but only when the hooks are installed on the pushing machine. This is a trigger-coverage gap for a file the program made a first-class requirement.

  <!-- CLAIM ADJUDICATION PACKET (required for P1) -->
  ```json
  {
    "findingId": "F009",
    "claim": "Editing only a hub's command-metadata.json does not trigger the routing-registry-drift CI workflow, so the command-metadata core-schema validator the workflow runs would not execute on such an edit.",
    "evidenceRefs": [
      ".github/workflows/routing-registry-drift.yml:15-32",
      ".github/workflows/routing-registry-drift.yml:35-52",
      ".github/workflows/routing-registry-drift.yml:101-109",
      ".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:260-303",
      ".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:355-357"
    ],
    "counterevidenceSought": "Grepped the workflow for 'command-metadata' (0 occurrences). Checked whether another workflow file triggers on command-metadata (no other workflow references it). Checked whether the push trigger's broad 'skilled/v*' branch catch-all without paths would fire — no, `paths` is specified so the filter applies. Checked the pre-push hook: it runs the gate on any `.opencode/skills` diff, so a hooked machine catches it; but release pushes from CI/automation or an unhooked machine do not.",
    "alternativeExplanation": "The omission could be intentional if command-metadata is expected to always change alongside mode-registry.json (ownerMode references a registry mode). But a command-metadata edit can be schema-invalid independently of the registry (bad command id, unresolvable choreography resource, missing command-definition file, duplicate owned signal), so co-change with the registry is not guaranteed.",
    "finalSeverity": "P1",
    "confidence": 0.88,
    "downgradeTrigger": "If a separate workflow or a path-less trigger already covers command-metadata-only edits on skilled/v*, or if release pushes are always made from a machine with the pre-push hook installed and enforced, downgrade to P2.",
    "transitions": [
      { "iteration": 5, "from": null, "to": "P1", "reason": "Initial discovery: CI trigger coverage gap for a class-H required file with a validating consumer." }
    ]
  }
  ```

### P2, Suggestion
- **F010**: Pre-push skill-metadata gate's `HEAD@{push}` diff guard is subtle and underdocumented in the hook itself, `.opencode/scripts/git-hooks/pre-push:180`. `! git -C "$REPO_ROOT" diff --quiet HEAD@{push} HEAD -- .opencode/skills 2>/dev/null` runs the gate only when skills changed between the push destination and HEAD. On the first push of a new branch `HEAD@{push}` is unset → `git diff` errors → `2>/dev/null` + `!` → condition true → gate runs (verified safe). The hook comments the working-tree-vs-diff caveat (lines 175-177) but not the `HEAD@{push}` first-push behavior. The gate also reads the working tree, not the diff, so the diff is a pure skip-optimization — a dirty-tree partial push can skip via `SPECKIT_SKIP_PREPUSH_SKILL_GATE=1` (documented). Recommend a one-line comment noting the first-push fallback so the safe-by-construction behavior is not mistaken for a bug.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | routing-registry-drift.yml:15-32 vs ci-skill-root-metadata.cjs:260-303 | The workflow runs the validator but does not trigger on the file it validates — a real coverage gap (F009). |

## Assessment
- New findings ratio: 0.70 (1 P1 + 1 P2 across 2 files — highest blast-radius iteration)
- Dimensions addressed: maintainability (CI wiring cross-cut)
- Novelty justification: This is the only P1 of the review. The CI trigger gap is the one finding where a regression could plausibly reach origin undetected (release line, no PR, unhooked pusher). All other findings are defensive hardening or test honesty.

## Ruled Out
- "Pre-push hook fail-open on missing validator is a gap": ruled out — pre-push:34-58 deliberately fails open on a missing/broken `worktree-naming.sh` (naming + permission gates) so a broken validator never blocks every push; the skill-metadata gate (line 178) is independently gated and fail-closed (exit 1 on violation). The split is intentional and documented.
- "Pre-push skill gate reads the diff, not the working tree, so uncommitted skill changes escape": ruled out — the hook explicitly reads the working tree (comment lines 175-177); the diff is only the skip-optimization. A dirty-tree partial push can opt out via the documented env var.

## Dead Ends
- Searched for a second CI workflow covering command-metadata; none exists.

## Recommended Next Focus
All 5 iterations complete (max-iterations reached). Proceed to synthesis: dedup findings, replay convergence from JSONL, compile review-report.md, finalize state.

Review verdict: CONDITIONAL
