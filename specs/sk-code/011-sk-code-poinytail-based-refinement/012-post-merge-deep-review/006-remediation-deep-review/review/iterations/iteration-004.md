# Review Iteration 004: Maintainability and the version, changelog and comment hygiene passes

## Dispatcher
- Mode: review; target agent: @deep-review; iteration 4 of 5; stop policy max-iterations; run rvw-012-006-remediation-20261010T211804Z.
- Assigned focus: version and changelog hygiene plus comment hygiene across the six commits in 1d078f3356^..d1741a28f7, covering sk-git 1.8.1.0, sk-vision 0.3.1.0, sk-code-webflow 1.1.3.0, sk-code-skilled 1.2.2.0, sk-code 2.2.8.0, deep-improvement 1.19.2.0, the Hermes mirrors, the sk-code activation manifest and the d1741a28f7 trigger-index rebuild.
- Agent definition loaded: .skilled/agents/deep-review.md.
- Setup bindings (agent contract section 0b; emitted in this artifact rather than on stdout, as iteration 3 also recorded):

```
BINDING: target=commits 1d078f3356..d1741a28f7 (T1 remediation, five fix phases plus trigger-index rebuild)
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/006-remediation-deep-review
```

## Dimension
Maintainability: whether every version-bearing artifact moved with its release, whether each changelog validates and describes its own commit, whether the Hermes mirrors stay in sync, and whether any changed code comment carries an ephemeral label.

## Files Reviewed
- Release carriers: sk-git [SOURCE: .skilled/skills/sk-git/SKILL.md:6] and [SOURCE: .skilled/skills/sk-git/README.md:11]; sk-vision [SOURCE: .skilled/skills/sk-vision/SKILL.md:5] and [SOURCE: .skilled/skills/sk-vision/README.md:10]; hub root [SOURCE: .skilled/skills/sk-code/SKILL.md:5], [SOURCE: .skilled/skills/sk-code/ROUTER.md:12], [SOURCE: .skilled/skills/sk-code/description.json:4], [SOURCE: .skilled/skills/sk-code/hub-router.json:3], [SOURCE: .skilled/skills/sk-code/mode-registry.json:3]; modes [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:5], [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:5], [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:5].
- Hermes mirrors: [SOURCE: .hermes/skills/sk-code/SKILL.md:5], [SOURCE: .hermes/skills/sk-git/SKILL.md:6], [SOURCE: .hermes/skills/deep-improvement/SKILL.md:5].
- Changelogs: [SOURCE: .skilled/skills/sk-git/changelog/v1.8.1.0.md:10], [SOURCE: .skilled/skills/sk-vision/changelog/v0.3.1.0.md:10], [SOURCE: .skilled/skills/sk-code/changelog/v2.2.8.0.md:10], [SOURCE: .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.3.0.md:10], [SOURCE: .skilled/skills/sk-code/sk-code-skilled/changelog/v1.2.2.0.md:10], [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/changelog/v1.19.2.0.md:10].
- Changed code: [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:40], [SOURCE: .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:26], [SOURCE: .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:31], [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:442], [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:47], [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:6].
- Compiled routing and index: [SOURCE: .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1], [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1].

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None. The two open P2s from earlier iterations (R2-P2-001, R3-P2-001) were not re-reported; this iteration added no new evidence for either.

## Focus Evidence (confirmed clean)
- Hub version parity: SKILL.md, README.md, ROUTER.md, description.json, hub-router.json and mode-registry.json each read 2.2.8.0, the newest changelog entry is v2.2.8.0.md, and the Hermes copy reads 2.2.8.0. The single-skill packages moved together too: sk-git SKILL and README read 1.8.1.0 with changelog v1.8.1.0.md; sk-vision reads 0.3.1.0 with changelog v0.3.1.0.md; sk-code-webflow reads 1.1.3.0, sk-code-skilled 1.2.2.0, deep-improvement 1.19.2.0, each with its own changelog entry. sk-git and sk-vision ship no description.json or activation manifest, which matches the earlier per-package inventory.
- Changelog validation: python3 .skilled/skills/sk-doc/scripts/validate_document.py on each of the six files printed Document type: changelog and Total issues: 0, six for six.
- Changelog describes its own diff: the webflow entry describes the depth-cap warning printed at test-minified-runtime.mjs:442 with MAX_SYNC_CALLBACK_DEPTH = 20 at line 30; the opencode entry describes the per-guard PASS line and the summary at run-all-drift-guards.sh:47 and line 86; the sk-git entry's 4.5 second bound matches LATEST_EXIT_MS = 4500 at stdin-deadline.test.mjs:26; the deep-improvement entry says the checker header now names both mirrors, and the f4f678328b diff for check-agent-mirror-sync.cjs changes only comment lines (the script body and its 'use strict' line are untouched), so No code changed holds.
- Hermes mirror sync: node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check printed PASS: 70 Hermes skill copies in sync and exited 0.
- Comment hygiene: git diff 1d078f3356^..d1741a28f7 over the eight changed code files, filtered to added lines, matches nothing for spec paths, 0NN-folder numbers, REQ/CHK/ADR ids, finding ids of the form RNN-XXX-NNN, or the word phase.
- Activation manifest: the 019b94a403 diff changes only effectivePolicyHash, from 81eff7ed to af2a000a; no .json file in the repository outside .git and node_modules still carries the old hash; only one live sk-code activation manifest exists (the other manifest.json files under an activation path sit in specs/sk-doc/z_archive and are archive records, not in the change range). The read-only probe node .skilled/bin/compiled-route-status.cjs --hub sk-code --pretty returns causeCode compiled-serving, manifestFreshness.manifestValid true, manifestFreshness.fresh true, and currentPolicyHash equal to the manifest hash af2a000a, exit 0. The re-mint is current, and there is no second live copy left stale.
- Trigger index: node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check exits 1 with stale documents: 6. All six are the 006-remediation packet's own docs plus review/deep-review-strategy.md; git ls-files over that packet returns 0 tracked files, and their mtimes (23:17 to 23:37 local) are later than commit d1741a28f7 (2026-10-10T22:54:19+02:00). Nothing tracked is stale, and obsolete paths and untrusted docs are both 0. The check cannot report current while this run's packet docs remain untracked; that is a property of the run, not a defect in d1741a28f7. See Not Proven below.

## Traceability Checks
- spec_code: the version-carrier and changelog claims of phases 001 through 005 were rerun against the tree at HEAD; all 19 release/carrier version lines read the intended values, and all six changelogs validate with Total issues: 0.
- checklist_evidence: the phase 004 and 005 criteria previously closed remain closed; this iteration re-verified the carrier parity, the manifest freshness and the mirror sync that those criteria depend on.

## Integration Evidence
- Hermes cross-runtime copies: 70 in sync, exit 0.
- Compiled routing: sk-code serves compiled with a fresh manifest; fenceEpoch 4 in the manifest directory's fence-state.json.
- Trigger index: no tracked document is stale; the six stale documents are this run's untracked artifacts.

## Edge Cases
- Mode READMEs carry derived child-doc versions, not release versions: sk-code-webflow README 1.1.0.0, sk-code-skilled README 1.0.0.5, deep-improvement README 1.17.0.38, each a valid X.Y.0.W child version under the frontmatter-versioning standard. A corpus scan of all 57 SKILL/README pairs found 41 differing, including the standard's own example (system-spec-kit README 3.6.0.41 against SKILL 3.6.0.0), and the standard states that verify mismatches are expected and that version parity is enforced only across a hub's own root artifacts.
- The comment-hygiene scan reads added lines of changed code files only; unchanged comments and doc files were outside this focus and are covered by the hooks that already run on edits.

## Confirmed-Clean Surfaces
- All six release versions, their changelogs, and their Hermes mirrors.
- Hub-root parity across the six sk-code carriers and ROUTER.md.
- The sk-code activation manifest re-mint and its freshness probe.
- Added-line hygiene of all eight changed code files.
- Hermes mirror sync, 70 copies.

## Ruled Out
- Mode README version lag: by design under the frontmatter-versioning standard (README is a derived child doc); 41 of 57 corpus pairs differ the same way.
- Trigger-index rebuild defect: the six stale documents are the run's own untracked, post-commit packet docs; every tracked document matches the committed index.
- Missing or stale second activation manifest: only one live sk-code manifest exists, it moved, and no live .json retains the old policy hash.
- Ephemeral ids in changed code comments: no match in any added line.

## Not Proven
- That generate-trigger-index.mjs --check would pass on the committed tree is inferred, not observed: the six stale documents are untracked and postdate the commit, and the check output names nothing else, but the check was not rerun at the commit state (that would require a separate checkout, and review targets are read-only). A fresh clone of d1741a28f7, or rerunning the check before the 006 packet docs are created, would confirm it.

## Verdict
P0=0, P1=0, P2=0 new. Every assigned maintainability check passes; the only non-zero exit is the trigger-index check, explained above by this run's own untracked documents.

## Next Dimension
- Security, the final pass: hook fail-open paths and the stdin deadline behavior under adversarial input (sk-git hooks, the Devin hook), carrying forward iteration 3's open items R2-P2-001 and R3-P2-001.

Review verdict: PASS