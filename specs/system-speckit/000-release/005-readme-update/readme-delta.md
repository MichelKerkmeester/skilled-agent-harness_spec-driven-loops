1. **Line 1311:** `- **[→ Latest System Spec-Kit Release Notes](.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md)** - Most recent shipped release notes` -> `- **[→ Latest System Spec-Kit Release Notes](.opencode/skills/system-spec-kit/changelog/v4.0.0.0.md)** - Most recent shipped release notes`
   Why: The only "release notes" link in the anchors still points at v3.6.0.0; it must target the new v4.0.0.0 notes.

## Needs human check

2. **Line 15:** No change proposed. The badge (`img.shields.io/github/v/release/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration`) tracks the `latest` release tag and contains no hardcoded version, so it self-updates on the v4.0.0.0 tag. Only bump it if the team wants to hardcode `?v=4.0.0.0` (e.g. `https://img.shields.io/github/v/release/...?include_prereleases` is unnecessary here).

Note: Lines 1028 and 1037 reference `v3.4.0.0` / `v3.3.0.0 → v3.4.1.0`, but these are historical prose (doctor feature origins and a migration example), not badges or release-notes links — left untouched per the no-prose-rewrite constraint.
