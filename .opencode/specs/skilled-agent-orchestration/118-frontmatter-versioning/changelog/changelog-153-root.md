---
title: "Changelog: Skill Frontmatter Versioning (Spec 153 Root)"
description: "Root rollup for spec 153: six phases that retroactively versioned the 2,222-doc skill corpus with a 4-part X.Y.Z.W field, built and enforced a deterministic derivation engine and remediated a two-model deep review."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-23

> Spec folder: `.opencode/specs/skilled-agent-orchestration/118-frontmatter-versioning` (Level 2)

### Summary

Spec 153 gave every in-scope skill doc a 4-part `version: X.Y.Z.W` field that is generated, applied and enforced. The corpus is 2,222 in-scope markdown docs. 2,210 carry a version and 12 frontmatter-less docs are skipped by design. The front digit stays low because it anchors to the human-curated skill version and never gets computed from git. Six phases ran the work end to end. Phase 1 wrote the standard into sk-doc and made the field required. Phase 2 built the deterministic compute apply verify gate engine. Phase 3 versioned the 457 core docs and normalized 12 SKILL.md. Phase 4 versioned the 1,753 catalog and playbook docs. Phase 5 flipped the validators to required and added the corpus gate. Phase 6 remediated a two-model deep review that returned CONDITIONAL with zero P0. The closing state is 21 of 21 engine assertions green, the corpus gate exit 0 at 2,222 files and `validate.sh --strict` exit 0 on the parent and all six children.

### Included Phases

| Phase | Folder | Status | Summary |
|-------|--------|--------|---------|
| 1 | `001-versioning-standard` | Complete | Wrote the 4-part `X.Y.Z.W` standard into sk-doc, added `version` to nine templates and promoted it to a format-checked field in the validators. |
| 2 | `002-derivation-engine` | Complete | Built `frontmatter-version.mjs` with compute, apply, verify and gate modes anchored to `max(frontmatter, changelog)` and gated on numstat, plus a 21-assertion suite. |
| 3 | `003-apply-core-skill-docs` | Complete | Versioned 457 core docs from the manifest, normalized 12 SKILL.md including the four pre-existing 3-part files, verified deterministically with a read-only MiMo audit. |
| 4 | `004-apply-catalogs-and-playbooks` | Complete | Versioned the full corpus of 693 feature-catalog and 1,060 testing-playbook docs at 1,753 in all, with verify and gate clean. |
| 5 | `005-verify-and-enforce` | Complete | Flipped the validators to required for skills, added the corpus-wide CI gate and re-versioned sk-doc to dogfood the standard. |
| 6 | `006-fix-deep-review-findings-for-spec-docs` | Complete | Resolved or accepted every deep-review finding: corrected spec counts, refreshed metadata and continuity, populated child plan and tasks, documented the reconcile exception and hardened the engine. |

### Added

- `references/frontmatter_versioning.md`, the single source of truth for the 4-part format, the changelog-anchored derivation, the numstat-gated build segment, the line-wise insertion rule and the staged enforcement rollout.
- `scripts/frontmatter-version.mjs`, the deterministic compute apply verify gate engine that runs from `node` with no build step.
- `scripts/tests/test_frontmatter_version.mjs`, a fixture-based integration suite at 21 assertions.
- `scripts/check-frontmatter-versions.sh`, the corpus-wide CI and pre-commit gate that runs the full 2,222-file corpus in about 0.17s.
- `changelog/v1.8.0.0.md` for sk-doc, recording the versioning-standard release.
- A `version` field on the full in-scope corpus: 422 fresh core inserts, 693 feature-catalog docs and 1,060 testing-playbook docs.
- A node PATH guard in the gate wrapper and a fail-closed path-containment guard in the engine.

### Changed

- `assets/frontmatter_templates.md` lists `version` as required for SKILL.md and skill reference and asset docs with a 4-part format rule, and nine templates carry a `version: 1.0.0.0` example so new docs are born versioned.
- `scripts/quick_validate.py` and `scripts/package_skill.py` first format-check `version` when present, then error on an absent `version` for skills with commands kept optional.
- `scripts/init_skill.py` emits `version` in generated SKILL.md.
- 12 SKILL.md reconciled or normalized, including system-spec-kit `3.4.1.0` to `3.6.0.0`, deep-research at `1.14.0.0` and the four 3-part files for `deep-loop-workflows`, `deep-loop-runtime`, `sk-design-md-generator` plus one mode packet canonicalized to 4-part.
- `.opencode/skills/sk-doc/**` re-versioned to the `1.8.0.0` anchor across 71 docs.
- The git history read buffer in the engine raised from 64 to 256 MB.
- The parent and child spec docs corrected to the engine-gate ground truth, with child `completion_pct` moved from 0 to 100, the phase 2 spec pointed at the `.mjs` engine and the child plan and tasks populated from each implementation-summary.
- `graph-metadata.json` and `description.json` across the tree regenerated last so every source fingerprint matches final content.

### Fixed

- A normalization skip bug in the engine where a 3-part `1.0.0` normalized to `1.0.0.0` and got `skip-equal`'d, leaving the malformed value on disk. apply now compares the raw version, caught by the gate.
- Removed a dead variable from `frontmatter-version.mjs`.

### Verification

- Engine unit suite: PASS at 21 of 21.
- Phase 3 core apply: 457 versioned, 12 skip-no-frontmatter, 4 normalized, with `verify` and `gate` exit 0.
- Phase 4 catalog and playbook apply: 1,753 inserts, with `verify` and `gate` exit 0.
- Full-corpus gate across all classes: PASS, exit 0, ok=2210, 12 skipped.
- Required-flip enforcement: a no-version skill fails with "Missing required 'version'" and a real skill passes.
- Validator suites for 086, package-regressions and validator: PASS, all green.
- Comment hygiene on the engine: PASS, clean.
- spec.md counts versus the engine gate: 2,222 and 457 and 1,753 match.
- `validate.sh --strict` on the parent plus all six children: PASS, exit 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/references/frontmatter_versioning.md` | Created then modified | The versioning standard, with the enforcement section activated and the SKILL.md reconcile exception documented |
| `sk-doc/assets/frontmatter_templates.md` | Modified | version added to field tables, templates and validation rules |
| `sk-doc/assets/skill/*.md`, `assets/feature_catalog/*.md`, `assets/testing_playbook/*.md` (9 files) | Modified | version example in each prescribed frontmatter block |
| `sk-doc/scripts/frontmatter-version.mjs` | Created then modified | The engine, with the normalization fix, dead-var removal, raised maxBuffer and path-containment guard |
| `sk-doc/scripts/tests/test_frontmatter_version.mjs` | Created then modified | The 21-assertion suite with the 3-part-normalization case |
| `sk-doc/scripts/check-frontmatter-versions.sh` | Created then modified | The corpus gate, with the node PATH guard |
| `sk-doc/scripts/quick_validate.py`, `scripts/package_skill.py` | Modified | Format-check then require a 4-part version for skills |
| `sk-doc/scripts/init_skill.py` | Modified | Generated SKILL.md emits version |
| `.opencode/skills/*/{SKILL.md, README.md, references/**, assets/**}` | Modified | Inserted or normalized 4-part version across 457 core docs |
| `.opencode/skills/*/feature_catalog/**/*.md` | Modified | Inserted 4-part version across 693 docs |
| `.opencode/skills/*/manual_testing_playbook/**/*.md` | Modified | Inserted 4-part version across 1,060 docs |
| `sk-doc/changelog/v1.8.0.0.md` | Created | Records the versioning-standard release |
| `153-frontmatter-versioning/**/{spec,plan,tasks}.md` | Modified | Corrected counts, populated child planning docs and continuity |
| `153-frontmatter-versioning/**/{graph-metadata.json, description.json}` | Modified | Regenerated through backfill and generate-context |

### Follow-Ups

- Out-of-scope classes for commands, agents and standalone install_guides are excluded by design. A follow-up packet can bring them under the standard.
- The gate ships as a script. Operators wire `check-frontmatter-versions.sh` into their pre-commit or CI of choice.
- The compute manifest is point-in-time. After sk-doc's re-version the standalone gate of presence plus format is the ongoing check rather than `verify --from-manifest`.
- Two engine advisories were accepted with rationale rather than coded: the anchor-cache concern does not hold because the cache is keyed by skill directory and bounded near 21 entries.
