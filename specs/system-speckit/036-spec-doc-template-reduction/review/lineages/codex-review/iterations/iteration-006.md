# Review Iteration 006 — Maintainer documentation drift

## Route

Resolved route: mode=review target_agent=deep-review

## Files reviewed

- `.opencode/skills/system-spec-kit/templates/README.md:21-22,62,93,127-137,184-211`
- `.opencode/skills/system-spec-kit/templates/CONTRACT.md:16-25`
- `.opencode/skills/system-spec-kit/templates/MIGRATION.md:14`
- `.opencode/skills/system-spec-kit/changelog/v3.9.0.0.md:42-43`

## Finding

### F007 — P2 — Maintainer guides still describe the removed manifest directory

The template README, contract guide, migration guide, and changelog continue to link or describe `templates/manifest/` and `manifest/*.md.tmpl`, although the current tree uses root contract assets plus `core/`, `addons/`, and `packet-types/`. These stale paths misdirect maintainers and make the completed restructure harder to extend safely.

Disposition: active. Finding class: `documentation-reference-drift`. Scope proof: direct multi-file search and current tree inventory.

## Claim adjudication

Claim F007: accepted P2. Counterevidence sought: root contract and role-folder tree. Alternative explanation: changelog history may intentionally preserve old names, but the README/CONTRACT/MIGRATION entries are present-tense links and paths. Validator fingerprint: `maintainer-reference-sweep-v1`.

## Search coverage

`reviewDepthSchemaVersion: 2`; `graphCoverageMode: graphless_fallback`. Search ledger rows: `template README -> finding:F007`; `contract guide -> finding:F007`; `migration/changelog -> finding:F007`.

Review verdict: CONDITIONAL
