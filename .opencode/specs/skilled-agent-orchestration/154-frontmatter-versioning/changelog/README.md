# Spec 154 Changelog Index

Spec 154 retroactively versioned the skill-doc corpus and then remediated a deep review. Six phases ran the work. The first five wrote a 4-part `version: X.Y.Z.W` standard into sk-doc, built a deterministic derivation engine, applied versions to all 2,222 in-scope docs at 2,210 versioned and 12 frontmatter-less skipped and enforced the field with a corpus gate. The sixth phase reconciled the documentation and metadata findings from a two-model deep review. This folder holds one leaf changelog per phase plus a root rollup across the whole spec.

## Included Phases

| Phase | Changelog | Summary |
|-------|-----------|---------|
| 1 | [changelog-154-001-versioning-standard.md](./changelog-154-001-versioning-standard.md) | Wrote the 4-part standard into sk-doc and made `version` a format-checked field in the templates and validators. |
| 2 | [changelog-154-002-derivation-engine.md](./changelog-154-002-derivation-engine.md) | Built `frontmatter-version.mjs` with compute, apply, verify and gate modes plus a 21-assertion suite. |
| 3 | [changelog-154-003-apply-core-skill-docs.md](./changelog-154-003-apply-core-skill-docs.md) | Versioned 457 core docs and normalized 12 SKILL.md including the four pre-existing 3-part files. |
| 4 | [changelog-154-004-apply-catalogs-and-playbooks.md](./changelog-154-004-apply-catalogs-and-playbooks.md) | Versioned 1,753 catalog and playbook docs at 693 feature-catalog and 1,060 testing-playbook. |
| 5 | [changelog-154-005-verify-and-enforce.md](./changelog-154-005-verify-and-enforce.md) | Flipped the validators to required and added the corpus-wide CI gate. |
| 6 | [changelog-154-006-fix-deep-review-findings-for-spec-docs.md](./changelog-154-006-fix-deep-review-findings-for-spec-docs.md) | Resolved or accepted every deep-review finding and hardened the engine. |

## Root Rollup

The aggregate view across all six phases lives in [changelog-154-root.md](./changelog-154-root.md).

## Related Documents

- Chronological view: [`../timeline.md`](../timeline.md)
- Before-and-after narrative: [`../before-vs-after.md`](../before-vs-after.md)

## Conventions

- One leaf changelog per phase, named `changelog-154-00N-<phase-slug>.md`, sourced from that phase's `implementation-summary.md`.
- Leaf files follow the spec-kit phase template and the root follows the spec-kit root template, both under `.opencode/skills/system-spec-kit/templates/changelog/`.
- Each entry is dated `2026-06-23` and scoped to its spec folder with a parent-packet pointer.
- Voice rules for changelogs: active voice, specific and evidence-backed, with no em-dashes, no semicolons and no Oxford commas.
- Counts are the engine-gate ground truth: 2,222 in-scope docs at 2,210 versioned and 12 frontmatter-less skipped.
