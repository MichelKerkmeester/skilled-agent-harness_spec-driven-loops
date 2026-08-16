# system-deep-loop (CP6) — checkpoint receipt

- Hub: system-deep-loop
- Legacy source: `shared/references/smart-routing.md` (deleted after gates passed)
- Root router: `ROUTER.md` (created, `router_state: active`, `skill_pointer: SKILL.md`)

## Machine block

- Legacy SHA-256 == new SHA-256 == Phase 001 baseline:
  `f9f410c1e3d0e70c7db23d952041811dab95be478237fdd2bf5e3523e7f9d274`
  (byte-identical move; zero machine-block delta; re-verified 2026-08-16).
- Parsed-map delta: intent keys 7, resource keys 7, stage-two default equal — zero map delta.

## Gates

- Root-router contract (post-deletion state): `state: active, ok: true`
- Parent doctor: `OK: parent-skill-check — all hard invariants passed, 0 warnings`
- Package gate: `package_skill.py --check: PASS`; compiled routing readiness
  stale-manifest condition is the downstream Phase-004 refresh (out of scope in Phase 003).
- Canary harness: exit 0, GREEN (final re-run in
  `../../004-parity-regression-and-closeout/scratch/closeout/canary-system-deep-loop.json`).
- Frozen replay: `loadSurfaceRouter` resolves `sourceRel: ROUTER.md`; intents 7, resources 7.

## Metadata

- `hub-router.json` defaultResource repointed (only the literal legacy path):
  `["shared/references/smart-routing.md", "mode-registry.json"]` ->
  `["ROUTER.md", "mode-registry.json"]`; registry entry kept.
- `leaf-manifest.json` regenerated through the owner tool; delta adjudicated; freshness OK.
- Versions aligned; one new changelog entry added; historical entries untouched.

## Legacy deletion and residue

- Legacy file deleted after all gates passed; empty `shared/references/` tree removed.
- Live residue scan: zero live matches. Historical mentions remain immutable-history
  class; the ROUTER.md frontmatter provenance note records the relocation.
- Note: the authored rollout compiler `sourceBytes()` root-first compatibility repair
  (ADR-009 in phase 004) was required before this hub could rebuild; it is a
  Phase-004 bounded repair, recorded and adjudicated there.
