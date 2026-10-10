---
title: "Deep Review Report: specs/system-speckit/034-spec-folder-tooling (phases 016 to 019)"
description: "Ten-iteration deep review of phases 016 to 019. Verdict CONDITIONAL: 0 P0, 9 P1, 2 P2 after deduplication and adversarial replay."
---

# Deep Review Report: 034-spec-folder-tooling, phases 016 to 019

## 1. Executive Summary

- **Verdict: CONDITIONAL.** No P0. Nine P1 findings need remediation before the work counts as release-ready.
- **hasAdvisories:** false (the verdict is not PASS; the two P2 items are listed as advisories in section 4).
- **Active findings (deduplicated):** P0=0, P1=9, P2=2.
- **Scope:** 229 files from goal-file-manifest.txt, every file the commits of phases 016 (and its 16 children), 017, 018 and 019 touched, minus bulk fixtures and generated indexes, plus the phase spec docs.
- **Run:** 10 of 10 iterations, executor cli-codex gpt-6-luna, reasoning max, service tier fast. Stop reason: maxIterationsReached (stop policy max-iterations, so convergence was telemetry only).
- **All four dimensions covered:** correctness, security, traceability, maintainability. Iteration 10 replayed all eleven findings against their cited lines and reconfirmed each at its original severity.
- **Fix first:** WS-1, starting with R2-P1-003. A symlinked z_archive lets archive.sh copy a packet outside specs/ and then delete the source, so it is the one finding that can lose data. This ordering is orchestrator judgment from the findings as written, not a reviewer output.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL with nine active P1 findings.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "R2-P1-001",
      "severity": "P1",
      "title": "Default healer writes through symlinked packet documents",
      "dimension": "security",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1415",
      "findingClass": "class-of-bug",
      "confidence": 0.9
    },
    {
      "id": "R2-P1-002",
      "severity": "P1",
      "title": "Leaf walker follows a symlinked scope root outside the skill",
      "dimension": "security",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:97",
      "findingClass": "class-of-bug",
      "confidence": 0.88
    },
    {
      "id": "R2-P1-003",
      "severity": "P1",
      "title": "Archive destination symlink can move packets outside specs",
      "dimension": "security",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:276",
      "findingClass": "instance-only",
      "confidence": 0.9
    },
    {
      "id": "R2-P1-004",
      "severity": "P1",
      "title": "Write token is available to dependency installation scripts",
      "dimension": "security",
      "location": ".github/workflows/trigger-index-rebuild.yml:34",
      "findingClass": "cross-consumer",
      "confidence": 0.83
    },
    {
      "id": "R3-P1-001",
      "severity": "P1",
      "title": "Completed phase transitions still have TBD handoff criteria",
      "dimension": "traceability",
      "location": "specs/system-speckit/034-spec-folder-tooling/spec.md:160",
      "findingClass": "matrix/evidence",
      "confidence": 0.96
    },
    {
      "id": "R3-P1-002",
      "severity": "P1",
      "title": "Phase 019 is complete while its post-push CI criterion is unverified",
      "dimension": "traceability",
      "location": "specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/spec.md:120",
      "findingClass": "matrix/evidence",
      "confidence": 0.94
    },
    {
      "id": "R5-P1-001",
      "severity": "P1",
      "title": "Phrase cleanup can rewrite authored eight-token spec triggers",
      "dimension": "correctness",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:300",
      "findingClass": "class-of-bug",
      "confidence": 0.88
    },
    {
      "id": "R7-P1-001",
      "severity": "P1",
      "title": "Child-dispatch Gate 3 exception is missing from the skill and implementation command",
      "dimension": "traceability",
      "location": ".skilled/skills/system-spec-kit/SKILL.md:499",
      "findingClass": "cross-consumer",
      "confidence": 0.97
    },
    {
      "id": "R8-P1-001",
      "severity": "P1",
      "title": "Retry ignores a failed generator before its index-only check",
      "dimension": "correctness",
      "location": ".github/workflows/trigger-index-rebuild.yml:138",
      "findingClass": "instance-only",
      "confidence": 0.82
    },
    {
      "id": "R4-P2-001",
      "severity": "P2",
      "title": "Healer CLI target selection is duplicated across three entrypoints",
      "dimension": "maintainability",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:643",
      "findingClass": "instance-only",
      "confidence": 0.92
    },
    {
      "id": "R7-P2-001",
      "severity": "P2",
      "title": "Repository-era catalog overstates the no-specs case",
      "dimension": "correctness",
      "location": ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/repo-era-report.md:28",
      "findingClass": "instance-only",
      "confidence": 0.94
    }
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "title": "Path containment before write, read or move (symlink escapes)",
      "findingIds": [
        "R2-P1-003",
        "R2-P1-001",
        "R2-P1-002"
      ]
    },
    {
      "id": "WS-2",
      "title": "Trigger-index CI workflow hardening",
      "findingIds": [
        "R2-P1-004",
        "R8-P1-001"
      ]
    },
    {
      "id": "WS-3",
      "title": "Phase-closure evidence in the parent and phase 019",
      "findingIds": [
        "R3-P1-001",
        "R3-P1-002"
      ]
    },
    {
      "id": "WS-4",
      "title": "Child-dispatch Gate 3 exception in routed contracts",
      "findingIds": [
        "R7-P1-001"
      ]
    },
    {
      "id": "WS-5",
      "title": "Phrase cleanup provenance",
      "findingIds": [
        "R5-P1-001"
      ]
    },
    {
      "id": "ADV",
      "title": "Advisories",
      "findingIds": [
        "R4-P2-001",
        "R7-P2-001"
      ]
    }
  ],
  "specSeed": [
    "Confine symlinked targets in heal-spec-docs.cjs default --apply, generate-leaf-manifest.cjs start scopes and archive.sh archive_root",
    "Harden trigger-index-rebuild.yml credential persistence and retry exit handling",
    "Close parent handoff rows 017->018 and 018->019 and phase 019 SC-002 evidence",
    "Add the child-dispatch Gate 3 exception to system-spec-kit SKILL.md, its Hermes mirror and speckit-implement.yaml",
    "Restrict template-phrase-cleanup.mjs trimming to generated phrases"
  ],
  "planSeed": [
    "T1 archive.sh: canonicalize archive_root below specs before copy and source removal, plus outside-symlink test",
    "T2 heal-spec-docs.cjs: reject or confine symlinked documents before writeFileSync, plus test under --apply",
    "T3 generate-leaf-manifest.cjs: realpath-confine each starting scope, plus default and declared-root tests",
    "T4 trigger-index-rebuild.yml: persist-credentials false and least-privilege push token; fail on nonzero retry generation",
    "T5 parent spec.md and 019 docs: real handoff criteria and CI receipt or waiver",
    "T6 SKILL.md, Hermes mirror, speckit-implement.yaml: child-dispatch branch",
    "T7 template-phrase-cleanup.mjs: provenance guard and authored-phrase regression test"
  ],
  "findingClasses": [
    "class-of-bug",
    "cross-consumer",
    "instance-only",
    "matrix/evidence"
  ],
  "affectedSurfacesSeed": [
    "--apply document write",
    "Hermes mirror",
    "anchor-repair CLI",
    "archive destination",
    "autonomous child dispatch",
    "checkout credential",
    "declared leaf scopes",
    "default document healer",
    "default healer CLI",
    "default leaf roots",
    "generated-description seeding",
    "lane-modes CLI",
    "layout classifier",
    "manifest consumers",
    "no-root repositories",
    "non-fast-forward retry",
    "npm lifecycle scripts",
    "packet source removal",
    "parent phase map",
    "parent phase status",
    "phase 019 success criteria",
    "phase handoff evidence",
    "phrase cleanup --apply",
    "post-push CI receipt",
    "repo-era feature catalog",
    "spec trigger lists",
    "speckit implementation command",
    "system-spec-kit skill",
    "trigger-index sidecars",
    "trigger-index workflow"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Source: the iteration-10 replay rows (each finding re-emitted under its original id with typed claim-adjudication fields), cross-checked against the reducer registry. Section 10 explains why the reducer's own count (21 P1, 5 P2) is higher.

### R2-P1-001 (P1): Default healer writes through symlinked packet documents

- **Dimension:** security | **findingClass:** class-of-bug | **Confidence:** 0.9 | **Disposition:** active
- **Location:** `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1415`
- **Claim:** The default healer can follow a symlinked packet document and write repair text to its external target.
- **Evidence:** Discovery accepts a spec.md entry by name, then the default --apply path writes with fs.writeFileSync without rejecting a symlink or confining the target.
- **Evidence refs:** `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:747`, `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1403`, `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1415`, `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:856`
- **Counterevidence sought:** Compared the default healer with the separate anchor-repair and lane-mode paths, which use separate helpers; no symlink guard appears before the default write.
- **Alternative explanation:** The write requires --apply, and callers may intentionally select custom roots, but that does not prevent a packet document symlink from redirecting the write.
- **Impact / scopeProof:** The default discovery and write path are separate from anchor repair and lane modes; both the selected file name and the actual write target need a symlink boundary check.
- **Fix recommendation:** Reject symlinked packet documents or resolve and confine each target before writing, then test an external symlink under --apply.
- **Downgrade trigger:** A realpath or lstat guard confines every default-healer document to its intended root, with a regression test proving an external symlink target stays unchanged under --apply.
- **affectedSurfaceHints:** default document healer, --apply document write

### R2-P1-002 (P1): Leaf walker follows a symlinked scope root outside the skill

- **Dimension:** security | **findingClass:** class-of-bug | **Confidence:** 0.88 | **Disposition:** active
- **Location:** `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:97`
- **Claim:** The leaf walker can enumerate a starting scope directory through a symlink before its nested-entry confinement checks run.
- **Evidence:** walkLeafFiles pushes packetRoot/rootName directly and calls readdirSync on that start; its symlink target confinement applies only to entries encountered inside the walk.
- **Evidence refs:** `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:96`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:97`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:104`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:115`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:124`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:268`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:272`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:184`
- **Counterevidence sought:** Checked the nested-entry realpath guard and the scope test for lexical traversal; those do not exercise a symlink at the initial directory.
- **Alternative explanation:** The manifest records resource paths rather than file contents, but downstream consumers can follow the same symlink and treat external files as skill resources.
- **Impact / scopeProof:** The initial default root and declared scopes feed the same walker; nested-entry checks occur only after the root directory has already been opened.
- **Fix recommendation:** Resolve and confine each starting scope before reading it, and add an outside-symlink test for default and declared roots.
- **Downgrade trigger:** Canonicalize and confine every starting scope before readdirSync, with tests for both default roots and declared directory scopes symlinked outside the skill.
- **affectedSurfaceHints:** default leaf roots, declared leaf scopes, manifest consumers

### R2-P1-003 (P1): Archive destination symlink can move packets outside specs

- **Dimension:** security | **findingClass:** instance-only | **Confidence:** 0.9 | **Disposition:** active
- **Location:** `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:276`
- **Claim:** archive_spec confines the source packet but can copy it through a symlinked z_archive destination and then remove the source.
- **Evidence:** The script checks the canonical source against specs, then assigns parent/z_archive and copies, renames, and deletes through that unchecked destination.
- **Evidence refs:** `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:230`, `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:235`, `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:276`, `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:277`, `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:295`, `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:302`, `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:309`, `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:136`
- **Counterevidence sought:** Verified the source realpath check and existing test that omits symlinked tracks; neither resolves or rejects the z_archive destination.
- **Alternative explanation:** Normal archives target a directory under the packet home and the command is operator-invoked, but a destination symlink changes the write target after the source check.
- **Impact / scopeProof:** The source path is checked at lines 230-235 while the destination is constructed and used separately at lines 276-309.
- **Fix recommendation:** Canonicalize and confine archive_root before copy or removal, and test a z_archive symlink to an outside directory.
- **Downgrade trigger:** Resolve and prove the archive root stays below specs before any copy or source removal, with a test using an outside-target z_archive symlink.
- **affectedSurfaceHints:** archive destination, packet source removal

### R2-P1-004 (P1): Write token is available to dependency installation scripts

- **Dimension:** security | **findingClass:** cross-consumer | **Confidence:** 0.83 | **Disposition:** active
- **Location:** `.github/workflows/trigger-index-rebuild.yml:34`
- **Claim:** The privileged workflow stores a write-capable checkout credential before running npm lifecycle scripts.
- **Evidence:** The job grants contents:write, checks out with TRIGGER_INDEX_PUSH_TOKEN or github.token without disabling credential persistence, then runs npm ci.
- **Evidence refs:** `.github/workflows/trigger-index-rebuild.yml:11`, `.github/workflows/trigger-index-rebuild.yml:31`, `.github/workflows/trigger-index-rebuild.yml:34`, `.github/workflows/trigger-index-rebuild.yml:43`, `.github/workflows/trigger-index-rebuild.yml:46`
- **Counterevidence sought:** Checked the workflow triggers and install order; it is not a pull_request workflow, and the lockfile does not prevent lifecycle scripts from running while credentials are present.
- **Alternative explanation:** The workflow may use a tightly scoped token on trusted integration branches, but the checked-out credential remains available to install scripts unless persistence is disabled or it is removed.
- **Impact / scopeProof:** Checkout places the credential before the npm ci step; workflow-level contents:write and the checkout token are both visible in the same job.
- **Fix recommendation:** Set persist-credentials:false or install without the privileged checkout credential, and use the least-privileged token only for the push step.
- **Downgrade trigger:** Show that the pinned checkout action does not persist credentials, or remove credentials before lifecycle scripts and prove the token is restricted to non-sensitive index writes.
- **affectedSurfaceHints:** checkout credential, npm lifecycle scripts, trigger-index workflow

### R3-P1-001 (P1): Completed phase transitions still have TBD handoff criteria

- **Dimension:** traceability | **findingClass:** matrix/evidence | **Confidence:** 0.96 | **Disposition:** active
- **Location:** `specs/system-speckit/034-spec-folder-tooling/spec.md:160`
- **Claim:** The parent marks phases 18 and 19 complete while the handoff rows into both phases retain TBD criteria and verification.
- **Evidence:** The phase map marks 18 and 19 Complete; the parent requires phase validation and defines handoff criteria as part of its progress map, yet transitions 17→18 and 18→19 remain TBD.
- **Evidence refs:** `specs/system-speckit/034-spec-folder-tooling/spec.md:130`, `specs/system-speckit/034-spec-folder-tooling/spec.md:131`, `specs/system-speckit/034-spec-folder-tooling/spec.md:135`, `specs/system-speckit/034-spec-folder-tooling/spec.md:138`, `specs/system-speckit/034-spec-folder-tooling/spec.md:160`, `specs/system-speckit/034-spec-folder-tooling/spec.md:161`
- **Counterevidence sought:** Looked for transition-specific criteria or verification after the placeholder rows; child validation records exist, but the parent rows do not point to them.
- **Alternative explanation:** The generic strict-validation requirement may have been intended as sufficient handoff evidence, with child-level records serving as the proof.
- **Impact / scopeProof:** The parent itself defines the completion map and handoff table, and the two rows remain explicit placeholders in the current source.
- **Fix recommendation:** Replace both TBD cells with the actual criteria and verification evidence, or document an explicit replacement gate.
- **Downgrade trigger:** Add the actual transition criteria and evidence, or mark the rows not applicable and identify the replacement gate.
- **affectedSurfaceHints:** parent phase map, phase handoff evidence

### R3-P1-002 (P1): Phase 019 is complete while its post-push CI criterion is unverified

- **Dimension:** traceability | **findingClass:** matrix/evidence | **Confidence:** 0.94 | **Disposition:** active
- **Location:** `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/spec.md:120`
- **Claim:** Phase 019 is marked complete although its explicit success criterion says main CI after the push was not checked.
- **Evidence:** SC-002 requires main CI to be green after the push and records that it was not checked; the parent nevertheless marks phase 19 Complete, and the cited push receipt does not prove CI status.
- **Evidence refs:** `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/spec.md:120`, `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/acceptance-criteria.md:64`, `specs/system-speckit/034-spec-folder-tooling/spec.md:131`, `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/implementation-summary.md:51`
- **Counterevidence sought:** Checked the acceptance push receipt and implementation summary; neither records the post-push CI result named in SC-002.
- **Alternative explanation:** CI may have been checked after the closeout note, or SC-002 may have been intended as advisory, but no waiver or later receipt is recorded in the cited packet.
- **Impact / scopeProof:** The success criterion, acceptance evidence, implementation summary and parent status are all present and make the missing CI receipt observable.
- **Fix recommendation:** Verify the post-push CI result and record it, or explicitly waive/supersede SC-002 and align the phase completion state.
- **Downgrade trigger:** A receipt proves main was green after the push, or the packet records a superseding waiver and aligns completion metadata.
- **affectedSurfaceHints:** phase 019 success criteria, parent phase status, post-push CI receipt

### R5-P1-001 (P1): Phrase cleanup can rewrite authored eight-token spec triggers

- **Dimension:** correctness | **findingClass:** class-of-bug | **Confidence:** 0.88 | **Disposition:** active
- **Location:** `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:300`
- **Claim:** The cleanup transform can trim an authored trigger phrase solely because it has eight normalized words and ends in a configured stop word.
- **Evidence:** The cleanup selects matching spec trigger phrases without proving they came from the description seeder, applies the edits to spec lists even when no template block was found, and writes the result under --apply.
- **Evidence refs:** `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:300`, `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:304`, `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:341`, `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:374`, `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:456`, `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts:63`
- **Counterevidence sought:** Checked the seed/cleanup relationship and the integration test; the cleanup predicate does not record provenance, and the cited test does not protect an authored phrase matching the same shape.
- **Alternative explanation:** The eight-token pattern originated from generated descriptions, so an authored phrase with the same shape may be uncommon, but the predicate cannot distinguish it.
- **Impact / scopeProof:** The same cleanup predicate processes every spec trigger list and the write path persists its planned edits; no provenance check gates that path.
- **Fix recommendation:** Limit the transform to phrases with known template provenance or preserve authored phrase text and test that boundary.
- **Downgrade trigger:** Preserve provenance for generated phrases or add a regression test proving an authored matching phrase remains byte-identical under --apply.
- **affectedSurfaceHints:** spec trigger lists, phrase cleanup --apply, generated-description seeding

### R7-P1-001 (P1): Child-dispatch Gate 3 exception is missing from the skill and implementation command

- **Dimension:** traceability | **findingClass:** cross-consumer | **Confidence:** 0.97 | **Disposition:** active
- **Location:** `.skilled/skills/system-spec-kit/SKILL.md:499`
- **Claim:** The child-dispatch exemption in root instructions conflicts with unconditional spec-folder ask-and-wait rules in the skill and implementation command.
- **Evidence:** The root instructions pre-resolve Gate 3 for AI_SESSION_CHILD=1, while the skill and Hermes mirror require A/B/C/D on file modifications and the implementation YAML says to stop and wait.
- **Evidence refs:** `AGENTS.md:86`, `.skilled/skills/system-spec-kit/SKILL.md:499`, `.skilled/skills/system-spec-kit/SKILL.md:526`, `.hermes/skills/system-spec-kit/SKILL.md:504`, `.hermes/skills/system-spec-kit/SKILL.md:531`, `.skilled/commands/speckit/assets/speckit-implement.yaml:56`, `.skilled/commands/speckit/assets/speckit-implement.yaml:59`
- **Counterevidence sought:** Compared the root child-dispatch exception with the canonical skill, Hermes mirror, and implementation command; none of the latter three expresses the exception.
- **Alternative explanation:** The skill may be written for interactive sessions, but the implementation command presents the ask-and-wait behavior as unconditional and does not gate it by runtime mode.
- **Impact / scopeProof:** The root, canonical skill, Hermes mirror, and implementation YAML are the four cited rule surfaces; the same ask-and-wait requirement appears in the latter three.
- **Fix recommendation:** Make the child-dispatch pre-resolution explicit in each routed contract so unattended workers do not wait for an unavailable answer.
- **Downgrade trigger:** Add an explicit non-interactive child-dispatch branch to the skill, mirror, and implementation contract, then verify the contracts remain aligned.
- **affectedSurfaceHints:** system-spec-kit skill, Hermes mirror, speckit implementation command, autonomous child dispatch

### R8-P1-001 (P1): Retry ignores a failed generator before its index-only check

- **Dimension:** correctness | **findingClass:** instance-only | **Confidence:** 0.82 | **Disposition:** active
- **Location:** `.github/workflows/trigger-index-rebuild.yml:138`
- **Claim:** A nonzero retry-generation exit can be ignored, allowing a partial rebuild to pass the index-only check while an existing sidecar remains stale.
- **Evidence:** The retry shell uses set -uo pipefail without -e, invokes the generator without checking its status, then checks only the main index and sidecar existence. A partial write can leave stale sidecar content.
- **Evidence refs:** `.github/workflows/trigger-index-rebuild.yml:54`, `.github/workflows/trigger-index-rebuild.yml:138`, `.github/workflows/trigger-index-rebuild.yml:139`, `.github/workflows/trigger-index-rebuild.yml:143`, `.github/workflows/trigger-index-rebuild.yml:151`
- **Counterevidence sought:** The later --check verifies the index only and the sidecar loop verifies -f; the generator transaction and output write order were not in the assigned file set.
- **Alternative explanation:** The generator may stage all outputs atomically or fail before changing the index, which would make the partial-write case unreachable; that behavior remains unverified.
- **Impact / scopeProof:** The retry invocation is unguarded, the following check is explicitly index-only, and the sidecar validation tests existence rather than content or freshness.
- **Fix recommendation:** Fail immediately when retry generation returns nonzero and validate the contents or freshness of all four outputs before committing.
- **Downgrade trigger:** Show that generation is atomic and leaves no partial sidecar state on every nonzero exit.
- **affectedSurfaceHints:** non-fast-forward retry, trigger-index sidecars

### R4-P2-001 (P2): Healer CLI target selection is duplicated across three entrypoints

- **Dimension:** maintainability | **findingClass:** instance-only | **Confidence:** 0.92 | **Disposition:** active
- **Location:** `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:643`
- **Claim:** Three healer CLI entrypoints duplicate the same --folder, --roots, and default specs-root target selection.
- **Evidence:** runAnchorRepair, runLaneModesCli, and main each resolve the same folder/root options; upgrade-legacy reuses exported repair helpers rather than repeating those algorithms.
- **Evidence refs:** `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:643`, `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360`, `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1390`, `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:835`, `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:881`
- **Counterevidence sought:** Checked whether the upgrade fold-in repeats the algorithms and whether the three wrappers need different target-selection rules; the helper paths are reused and the option resolution is repeated.
- **Alternative explanation:** The wrappers are short and may intentionally keep selection logic local because they serve different repair surfaces.
- **Impact / scopeProof:** Only the three CLI wrappers repeat target selection; the upgrade caller delegates to shared helpers.
- **Fix recommendation:** Consider a shared target-selection helper if these entrypoints need future behavioral changes, with parity tests for their options.
- **Downgrade trigger:** If the entrypoints are intentionally independent and tests pin their selection parity, retain this as an optional duplication advisory.
- **affectedSurfaceHints:** anchor-repair CLI, lane-modes CLI, default healer CLI

### R7-P2-001 (P2): Repository-era catalog overstates the no-specs case

- **Dimension:** correctness | **findingClass:** instance-only | **Confidence:** 0.94 | **Disposition:** active
- **Location:** `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/repo-era-report.md:28`
- **Claim:** The catalog says a repository with no specs folder reads as v3, while the classifier returns unknown when neither the v4 nor legacy root exists.
- **Evidence:** The classifier sets v3 from a legacy root or description residue and returns unknown when both v3 and v4 are false; the catalog sentence says no specs folder means v3.
- **Evidence refs:** `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/repo-era-report.md:28`, `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:421`, `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:442`, `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:448`, `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:283`
- **Counterevidence sought:** Compared the catalog sentence with the root-detection conditions and an existing test for legacy-root classification; the test does not cover a repository with neither root.
- **Alternative explanation:** The catalog may assume the report is run only in a recognized repository layout, but the CLI classifier explicitly has an unknown result for neither root.
- **Impact / scopeProof:** The feature-catalog statement and classifier return are direct counterparts; the classifier has a distinct unknown branch when neither root is present.
- **Fix recommendation:** Correct the catalog wording to describe the unknown no-roots case or state its layout precondition.
- **Downgrade trigger:** Clarify that the catalog sentence assumes a legacy root, or add a no-roots case proving the documented classification.
- **affectedSurfaceHints:** repo-era feature catalog, layout classifier, no-root repositories

## 4. Remediation Workstreams

P1 workstreams in recommended order, then the P2 advisories.

### WS-1: Path containment before write, read or move (symlink escapes)

- Findings: R2-P1-003, R2-P1-001, R2-P1-002
- One bug class in three tools: each confines a path by name, then follows a symlink at the step that writes, reads or moves. Canonicalize and confine the real target first, and add an outside-symlink regression test per tool.

### WS-2: Trigger-index CI workflow hardening

- Findings: R2-P1-004, R8-P1-001
- Both sit in .github/workflows/trigger-index-rebuild.yml: drop the persisted write credential before npm lifecycle scripts, and fail the retry path when the generator exits nonzero.

### WS-3: Phase-closure evidence in the parent and phase 019

- Findings: R3-P1-001, R3-P1-002
- Replace the TBD handoff rows for 017->018 and 018->019, and record the post-push CI result for phase 019 SC-002 or waive it explicitly.

### WS-4: Child-dispatch Gate 3 exception in routed contracts

- Findings: R7-P1-001
- State the AI_SESSION_CHILD pre-resolution in system-spec-kit SKILL.md, its .hermes mirror and speckit-implement.yaml.

### WS-5: Phrase cleanup provenance

- Findings: R5-P1-001
- Limit the eight-token trim to phrases with known generated provenance, and pin an authored matching phrase as byte-identical under --apply.

### Advisories (P2, do not block)

- R4-P2-001: healer CLI target selection is duplicated across three entrypoints in heal-spec-docs.cjs. Extract a shared helper if the entrypoints change again.
- R7-P2-001: the repo-era feature catalog says a repository with no specs folder reads as v3; the classifier returns unknown. Fix the catalog wording.

## 5. Spec Seed

- Confine symlinked targets in heal-spec-docs.cjs default --apply, generate-leaf-manifest.cjs start scopes and archive.sh archive_root
- Harden trigger-index-rebuild.yml credential persistence and retry exit handling
- Close parent handoff rows 017->018 and 018->019 and phase 019 SC-002 evidence
- Add the child-dispatch Gate 3 exception to system-spec-kit SKILL.md, its Hermes mirror and speckit-implement.yaml
- Restrict template-phrase-cleanup.mjs trimming to generated phrases

## 6. Plan Seed

- T1 archive.sh: canonicalize archive_root below specs before copy and source removal, plus outside-symlink test
- T2 heal-spec-docs.cjs: reject or confine symlinked documents before writeFileSync, plus test under --apply
- T3 generate-leaf-manifest.cjs: realpath-confine each starting scope, plus default and declared-root tests
- T4 trigger-index-rebuild.yml: persist-credentials false and least-privilege push token; fail on nonzero retry generation
- T5 parent spec.md and 019 docs: real handoff criteria and CI receipt or waiver
- T6 SKILL.md, Hermes mirror, speckit-implement.yaml: child-dispatch branch
- T7 template-phrase-cleanup.mjs: provenance guard and authored-phrase regression test

## 7. Traceability Status

### Core protocols

- **spec_code: finding.** Iteration 3 compared the 016 children and 017 to 019 spec claims with the shipped code and docs; iterations 8 and 9 extended it to 016/001 to 007, 009, 013, 014 and 017. Drift found: R3-P1-001 (parent handoff rows still TBD) and R7-P1-001 (child-dispatch exception missing from routed contracts).
- **checklist_evidence: finding.** acceptance-criteria.md and implementation-summary.md claims were read against cited files and commands; tests were inspected, never run. Drift found: R3-P1-002 (phase 019 SC-002 post-push CI unverified while the phase is marked Complete).

### Overlay protocols

- **feature_catalog_code: finding.** Iteration 7: R7-P2-001 (repo-era catalog versus classifier). Anchor-integrity, anchor-repair and lane-mode catalog entries matched.
- **playbook_capability: partial.** Doctor-commands and healer playbook scenarios were compared with command support but not executed.
- **skill_agent: finding.** Iteration 7: R7-P1-001 spans the canonical system-spec-kit SKILL.md, the .hermes mirror and speckit-implement.yaml. The canonical and Hermes SKILL.md files differ by byte content; the difference beyond R7-P1-001 was not adjudicated.
- **agent_cross_runtime: deferred.** Not exercised in this run.
- **Changelog claims (v4.0.0.4, v2.7.1.0): checked** in iteration 7 against shipped files, no separate finding.

**AC_COVERAGE:** exempt. The target is a phase parent that holds only spec.md, timeline.md and metadata (no checklist.md or implementation-summary.md at the parent).

Resource Map Coverage Gate: skipped, resource-map.md was not present in the spec folder at init.

## 8. Deferred Items

- Tests were inspected as contracts but never executed in any iteration (the codex sandbox blocks tsx IPC). Run the CLI and doctor suites before closing remediation.
- agent_cross_runtime overlay was not exercised.
- Full byte diff of .skilled/skills/system-spec-kit/SKILL.md against .hermes/skills/system-spec-kit/SKILL.md beyond R7-P1-001.
- Six reducer search-debt rows remain open (section 9).
- Parent spec.md phase 010 still reads In Progress; outside 016 to 019 scope, noted only.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0. No Council artifacts.
- Saturated directions: none recorded by the reducer.
- Breadth under the max-iterations policy: iterations 1 to 4 took the risk-ordered first pass (correctness, security, traceability, maintainability); iterations 5 to 10 broadened to lane-transform edge cases, a security replay plus the unreached workflows and hooks, the overlay protocols, 016 children 001 to 004, the unreached 016 children plus 017, and a final adversarial replay.
- Remaining frontier: agent_cross_runtime, test execution, and the search-debt rows below.
- This section records breadth only and does not alter the verdict.

## 9. Search Ledger

hasSearchDebt: true. The debt carries the verdict as CONDITIONAL independently of the P1 findings (no active P0).

- graphCoverageMode: graphless_fallback
- searchCoverage.requiredBugClasses (11): all covered. healer_symlink_write, leaf_scope_root_symlink, archive_destination_symlink, workflow_install_credential_exposure, completed_phase_handoff_evidence, phase_completion_unverified_ci, authored_trigger_phrase_rewrite, gate3_child_dispatch_contract, trigger_retry_generation_failure, healer_target_selection_duplication, repo_era_no_roots_documentation
- candidateCoverage.covered: 36 bug classes. archive_destination_escape, archive_destination_symlink, authored_trigger_phrase_rewrite, cli_argument_and_path_boundary, comment_hygiene_ephemeral_labels, completed_phase_handoff_evidence, credential_exposure_during_install, duplicated_heal_cli_target_resolution, feature_catalog_code_drift, gate3_child_dispatch_contract, git_hook_gate_inventory_drift, healer_cli_documentation_drift, healer_symlink_write, healer_target_selection_duplication, hook_trust_boundary, leaf_scope_root_symlink, literal_secret_exposure, manifest_scope_symlink_escape, parent_handoff_gap, phase_completion_evidence_gap, phase_completion_unverified_ci, planned_surface_or_evidence_pointer_gap, repo_era_catalog_overstatement, repo_era_no_roots_documentation, skill_agent_gate_exemption_mismatch, skill_agent_policy_mismatch, spec_code_claim_drift, symlink_scope_root_escape, symlink_write_escape, symlink_write_through, test_fixture_isolation, transform_data_preservation, trigger_retry_generation_failure, workflow_credential_exposure, workflow_install_credential_exposure, workflow_shell_injection
- ruledOutCandidates: 42; cleanSearchProof: 42 rows (manifest scope drift, dispatcher lane order and dry-run writes, upgrade before-image ordering, doctor approval and logging, leaf-scope traversal, CI skipped commands and others).
- searchDebt:
  - SL-007 (iteration 1, correctness): individual_lane_transform_edge_cases. Review individual transform boundary behavior in a later correctness pass.
  - SL-SEC-008 (iteration 2, security): upgrade_apply_symlink_containment. Continue the upgrade apply/move symlink boundary in a later security pass before treating it as closed.
  - SL-005-006 (iteration 5, correctness): runtime_test_execution. Tests were inspected for claimed coverage but not run.
  - SL-006-010 (iteration 6, security): workflow_command_log_injection. Trace the report producer and determine whether packet-controlled newlines can reach Actions workflow-command parsing.
  - SL-007-009 (iteration 7, traceability): spec_code. Core spec-to-code remains pending for a later traceability pass.
  - SL-007-010 (iteration 7, traceability): checklist_evidence. Checklist evidence remains pending for a later traceability pass.

Note: the two iteration-7 debt rows (spec_code, checklist_evidence pending) were later exercised by iterations 8 to 10, but the reducer keeps them open because no later row closes them by id.

## 10. Audit Appendix

### Convergence summary

- Stop reason: maxIterationsReached after 10 of 10 iterations. stop_policy max-iterations made every convergence signal telemetry only.
- Graph convergence: STOP_BLOCKED at iterations 1 to 4 (dimension coverage below threshold), STOP_ALLOWED at iterations 5 to 7 (score 0.95), STOP_BLOCKED from iteration 8 to the final check (score 0.917). Reducer convergenceScore 1.0.
- Claim adjudication: passed every iteration; every new or replayed P0/P1 carried a typed packet.

### Iterations

| # | Focus | Dimensions | Leaf P0/P1/P2 | newFindingsRatio | Status |
|---|-------|-----------|---------------|------------------|--------|
| 1 | correctness | correctness | 0/0/0 | 0 | complete |
| 2 | security | security | 0/4/0 | 1 | complete |
| 3 | traceability | traceability | 0/2/0 | 1 | complete |
| 4 | maintainability | maintainability | 0/6/1 | 1 | complete |
| 5 | correctness | correctness | 0/7/1 | 1 | complete |
| 6 | security (broadened second pass) | security | 0/7/1 | 0 | complete |
| 7 | traceability (broadened: overlay protocols) | traceability | 0/1/1 | 1 | complete |
| 8 | correctness (phase 016 children 001-004) | correctness | 0/1/0 | 1 | complete |
| 9 | correctness (phase 016 children 005-007, 009, 013-014 and phase 017 simplifications) | correctness | 0/0/0 | 0 | complete |
| 10 | correctness (final adversarial replay across all dimensions) | correctness, security, traceability, maintainability | 0/9/2 | 0 | complete |

The leaf P0/P1/P2 column is what each leaf reported; several leaves reported run totals rather than per-pass counts.

Redispatches (YAML redispatch_once): iteration 7 first attempt wrote its narrative and delta but the gateway append failed (`EBADF` reading `/dev/fd/63` from a process substitution inside the codex sandbox); iteration 8 first attempt used all 13 tool calls reading and wrote nothing. Both passed post-dispatch validation on the single redispatch. No iteration was recorded as error.

### Registry reconciliation

The reducer registry reports 21 P1 and 5 P2 open. The deduplicated active set is 9 P1 and 2 P2:
- SUMMARY-P1-005, SUMMARY-P1-006, SUMMARY-P1-007 and SUMMARY-P2-001 are summary-only placeholders (no file, no line, no evidence). reduce-state.cjs creates them when an iteration's findingsSummary exceeds the findings seen in that run; the iteration-6 leaf reported run totals while emitting detail rows only for the four replayed findings. Classified resolved_false_positive here: no evidence, and every real finding is accounted for by id.
- Each of the eleven real findings appears twice in openFindings after the iteration-10 replay (same id, two entries). Deduplicated by id; severities agree.

### Adversarial self-check

- Iteration 10 (the leaf) re-read every cited line, sought counterevidence and reconfirmed all eleven findings at their original severities. Iteration 6 had independently reconfirmed the four security P1 findings.
- Orchestrator mechanical check: all 63 evidence refs across the eleven findings resolve to an existing file with the cited line in range. No P0 exists, so no P0 replay was required.

### Cross-reference appendix

#### Core Protocols

| Protocol | Status | Findings |
|----------|--------|----------|
| spec_code | finding | R3-P1-001, R7-P1-001 |
| checklist_evidence | finding | R3-P1-002 |

#### Overlay Protocols

| Protocol | Status | Findings |
|----------|--------|----------|
| feature_catalog_code | finding | R7-P2-001 |
| playbook_capability | partial | none |
| skill_agent | finding | R7-P1-001 |
| agent_cross_runtime | deferred | none |

### Sources reviewed

- Scope: specs/system-speckit/034-spec-folder-tooling/goal-file-manifest.txt (229 files). Per-iteration file lists: iterations/iteration-001.md to iteration-010.md and deltas/iter-001.jsonl to iter-010.jsonl.
- State: deep-review-config.json, deep-review-state.jsonl (ledger-backed), deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md, resource-map.md.
- Ruled-out claims: 42 cleanSearchProof rows in the registry.
