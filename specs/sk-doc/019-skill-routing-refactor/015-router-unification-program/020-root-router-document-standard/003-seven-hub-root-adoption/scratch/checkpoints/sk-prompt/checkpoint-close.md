# sk-prompt (CP4) — checkpoint receipt

- Hub: sk-prompt
- Legacy source: `shared/references/smart-routing.md` (deleted after gates passed)
- Root router: `ROUTER.md` (created, `router_state: active`, `skill_pointer: SKILL.md`)

## Machine block

- Legacy SHA-256 (Phase 001 baseline): `f3212fb827ceb840ad2fdb4849aa4d0d388158f0fd85aac1eeb3eb40ea0216d0`
- New SHA-256: `7d8288504a36c9f311ecf091e936eef638c85c2adb3437b39c31391ea3ddd75a`
- Adjudicated delta: exactly one `RESOURCE_MAP` value —
  `DESIGN_PROMPT` changed from `sk-prompt-improve/references/design-generation-patterns.md`
  (deleted upstream) to the live typed leaf `sk-prompt-improve/references/patterns-evaluation.md`.
- Parsed-map delta: intent keys equal, resource keys equal, stage-two default equal;
  1 resource-map delta (the DESIGN_PROMPT value above).

## Gates

- Root-router contract (post-deletion state): `state: active, ok: true`
- Parent doctor: `OK: parent-skill-check — all hard invariants passed, 0 warnings`
- Package gate: `package_skill.py --check: PASS`; `compiled routing readiness: FAIL (stale-manifest)`
  — sole failure is the downstream Phase-004 manifest refresh (same condition as the already-migrated
  cli-external-orchestration hub; manifest refresh is out of scope in Phase 003).
- Canary harness: authored-source digest pins are stale relative to the working tree (pre-existing,
  identical for the golden cli-external hub); classified downstream (Phase-004 / harness owner refresh).
- Frozen replay: `loadSurfaceRouter` resolves `sourceRel: ROUTER.md`; intents 13, resources 13, default [].

## Metadata

- `hub-router.json` defaultResource preserved byte-for-byte: `["sk-prompt-improve/SKILL.md"]`.
- `leaf-manifest.json` regenerated through the owner tool
  (`generate-leaf-manifest.cjs --write`); sole delta: removal of the deleted
  `references/design-generation-patterns.md` leaf. Freshness: OK.
- Versions: ROUTER.md 1.0.1.0, SKILL.md 1.0.1.0, README.md 1.1.1.0, description.json 1.0.1.0;
  changelog entry added at `changelog/v1.1.1.0.md`.

## Legacy deletion and residue

- Legacy file deleted after the root router conformed; empty `shared/` tree removed.
- Live residue scan: zero live matches. The only remaining mention is the provenance note
  in `ROUTER.md` frontmatter ("Relocated verbatim from shared/references/smart-routing.md ..."),
  matching the golden cli-external pattern. Historical changelog/benchmark mentions are
  immutable-history class.
