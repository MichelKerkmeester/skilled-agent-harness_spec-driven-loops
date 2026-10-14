# Deep Review Report: Epic Follow-Up (Commit-Id, Pi Fast Mode, v4.0.0.4)

## 1. Executive Summary

- **Verdict:** FAIL
- **hasAdvisories:** true
- **Active findings after adjudication:** P0 1, P1 0, P2 2
- **Why FAIL:** R2-P0-001 lets any cloned repository run its own code through the machine-wide git hooks.
- **Scope:** five iterations by cli-codex `gpt-6-luna` at max reasoning effort and fast tier over the 32 files the 030 review left unread: the Commit-Id hooks and helpers, the Pi Fast Mode extension and the v4.0.0.4 changelog, with leave to open any path the changelog names.
- **Remediation:** all three findings were fixed in `033-follow-up-review-fixes` on 2026-10-14. The search debt remains open.
- **Iteration health:** iteration 1 wrote no iteration file on either attempt and is recorded as an error. Iterations 2 to 5 verified.

## 2. Planning Trigger

`/speckit:plan` is required for the P0. The fixes are small and independent, so they run as one phase.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R2-P0-001", "reviewerSeverity": "P0", "adjudicatedSeverity": "P0", "file": ".skilled/scripts/git-hooks/prepare-commit-msg:78"},
    {"id": "R3-P1-001", "reviewerSeverity": "P1", "adjudicatedSeverity": "P2", "file": ".skilled/scripts/git-hooks/pre-push:311"},
    {"id": "R4-P2-001", "reviewerSeverity": "P2", "adjudicatedSeverity": "P2", "file": ".skilled/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md:32"}
  ],
  "remediationWorkstreams": ["WS1 untrusted source root outside the clone", "WS2 refuse Commit-Id 0000000", "WS3 catalog enrollment wording"],
  "specSeed": ["an untrusted repository's source root is a path no repository can create", "the commit and push checks refuse the all-zero id"],
  "planSeed": ["move the untrusted root under /dev/null in all six trust blocks", "add planted-guard and planted-allocator cases under .skilled-untrusted", "reject 0000000 in the template pattern, commit-id-policy.sh and pre-push"],
  "findingClasses": ["cross-consumer", "instance-only"],
  "affectedSurfacesSeed": ["six global git hooks", "Commit-Id message contract", "sk-git feature catalog"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### R2-P0-001: Untrusted clones can run code through `.skilled-untrusted`


- **Disposition:** fixed in 033: the six trust blocks point an untrusted repository at `/dev/null/.skilled-untrusted`, and two planted-file cases pin it.
- **Dimension:** security. **File:** `.skilled/scripts/git-hooks/prepare-commit-msg:78`, the same line in all six trust blocks.
- **Case:** a cloned repository ships `.skilled-untrusted/skills/sk-git/scripts/commit-id-naming.sh`. The trust block sets `SOURCE_ROOT="$REPO_ROOT/.skilled-untrusted"`, `prepare-commit-msg` finds the planted allocator there and runs it with bash.
- **Re-verified:** the untrusted root is a path inside the clone, so the clone controls it. Beyond the allocator, `pre-commit` sources `hook-flags.sh` from it, `pre-push` sources the mass-deletion guard and runs the route guard and the track-root sweep with node, and the post-* hooks source the autostash guard from it. The existing planted-guard test plants only under `.skilled`, so it never covered this path. Present since `749c0dfe7e` (2026-10-02).
- **Severity kept:** arbitrary code execution from any clone on the machine, with no opt-in.
- **Fix:** point the untrusted root at `/dev/null/.skilled-untrusted`, which can never exist, and test planted files under `.skilled-untrusted`.
- **findingClass:** cross-consumer. **affectedSurfaceHints:** prepare-commit-msg, pre-commit, pre-push, post-commit, post-merge, post-rewrite.

### R3-P1-001, adjudicated P2: The Commit-Id checks accept `0000000`


- **Disposition:** fixed in 033: the template pattern, `cip_message_has_id` and pre-push refuse `0000000`, with a commit-msg case and a validator assertion.
- **Dimension:** correctness. **File:** `.skilled/scripts/git-hooks/pre-push:311`
- **Case:** a hand-written `Commit-Id: 0000000` passes the template pattern `^[0-9]{7}$`, `cip_message_has_id` and the pre-push shape check.
- **Re-verified:** the allocator validates 0000001 to 9999999, and its test rejects 0000000.
- **Why downgraded:** the allocator never mints the zero id, so only a hand-typed trailer reaches it, and the only effect is an id outside the minted range.
- **Fix:** refuse 0000000 at the template pattern, the policy helper and pre-push.

### R4-P2-001: The catalog misstates which repositories get a Commit-Id


- **Disposition:** fixed in 033: the catalog states the enrollment rule and the `skilled.commitId false` opt-out.
- **Dimension:** traceability. **File:** `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md:32`
- **Case:** a repository without the allocator but with `skilled.commitId=true` or ids in its recent history is stamped, while the catalog says it is left alone.
- **Re-verified:** `cip_repo_wants_ids` checks local config, then toolchain markers, then the last 50 commits.
- **Fix:** state the real enrollment rule and the opt-out.

## 4. Remediation Workstreams

- **P0:** WS1, the untrusted source root.
- **P2:** WS2, the zero id. WS3, the catalog wording.

## 5. Spec Seed

- An untrusted repository's hooks read no file from that repository's tree.
- `Commit-Id: 0000000` is refused at commit and at push.

## 6. Plan Seed

- Change the untrusted root identically in the six trust blocks and the pre-commit notice check.
- Add `.skilled-untrusted` planted-guard and planted-allocator cases to `source-root-selection.test.sh`.
- Add zero-id cases to `commit-msg.test.sh` and `message-contract.test.mjs`.

## 7. Traceability Status

### Core Protocols

- **spec_code:** partial. The Commit-Id enrollment and Pi precedence rules match their READMEs, apart from R4.
- **checklist_evidence:** partial. The allocator test and the Pi precedence tests were read, not run.
- **AC_COVERAGE:** advisory-shortfall.

### Overlay Protocols

- **skill_agent:** not applicable to this scope.
- **agent_cross_runtime:** not applicable.
- **feature_catalog_code:** fail on R4.
- **playbook_capability:** pass. No playbook claim contradicts the code.

## 8. Deferred Items

- The Pi project config path through a symlinked parent was not checked (iteration 2).
- The semantic audit of the v4.0.0.4 claims outside Commit-Id and Pi Fast Mode stays open (iterations 4 and 5). Path tokens resolve, but behavior claims were not all confirmed.

## Dimension Expansion Map

- **Saturated directions:** Pi Fast Mode precedence and payload scope, ruled out twice.
- **Pivots and Council artifacts:** none.
- **Remaining frontier:** the two deferred items above.

## 9. Search Ledger

- **hasSearchDebt:** true, 3 deferred obligations. The full list is in `deep-review-dashboard.md`.
- **Ruled out:** Commit-Id enrollment spoofing through config, allocator collisions, Pi state and handoff precedence drift, Pi payload scope overrides, Pi state ownership and playbook contradictions.

## 10. Audit Appendix

- **Convergence:** stop policy max-iterations. New-findings ratios for iterations 2 to 5: 1, 0.33, 0.33, 0.
- **Adjudication:** the orchestrator re-read the P0 and the P1 at their cited lines, traced every `SOURCE_ROOT` consumer in the six hooks, kept the P0 and downgraded the P1.
- **Sources:** `iterations/iteration-002.md` to `iteration-005.md`, the matching deltas, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `resource-map.md` and `driver-log.txt`.
