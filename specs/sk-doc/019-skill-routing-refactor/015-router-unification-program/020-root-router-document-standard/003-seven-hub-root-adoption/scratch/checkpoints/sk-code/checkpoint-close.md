# sk-code (CP7) — checkpoint receipt

- Hub: sk-code
- Legacy source: `shared/references/smart-routing.md` (deleted after gates passed)
- Root router: `ROUTER.md` (created, `router_state: active`, `skill_pointer: SKILL.md`)

## Machine block

- Legacy SHA-256 (Phase 001 baseline): `6504f6a359f9aa6f6dd7e8227e12584518faacc313788b8451a2af5aa672ed09`
- New SHA-256: `9a5716cce139b8e33494e6b9c59daf5c8c25ae333fd0fcbcd710df54391ee46d`
- Adjudicated delta (exactly the ratified ADR-002 / ADR-004 repair):
  1. removal of the router self-reference `references/smart-routing.md` from the
     stage-two always-loaded `DEFAULT_RESOURCE`;
  2. ten legacy-file-relative hub-shared paths normalized to explicit contained
     `shared/...` paths;
  3. the eight mapped shared paths declared in `SHARED_CONTROL_RESOURCES`;
  4. no `ROUTER.md` typed leaf pair and no fabricated packet owner added.
- Resource map keys unchanged: 20 keys, original order (re-verified 2026-08-16:
  `IMPLEMENTATION CODE_QUALITY DEBUGGING VERIFICATION TESTING DEPLOYMENT
  PERFORMANCE ANIMATION MOTION_DEV ACCESSIBILITY FORMS VIDEO HOOKS CONFIG
  LANGUAGE_STANDARDS JAVASCRIPT TYPESCRIPT PYTHON SHELL RUST`).

## Gates

- Root-router contract (post-deletion state): `state: active, ok: true`
- Parent doctor: `OK: parent-skill-check — all hard invariants passed, 0 warnings`
- Package gate: `package_skill.py --check: PASS`; compiled routing readiness
  stale-manifest condition is the downstream Phase-004 refresh (out of scope in Phase 003).
- Canary harness: exit 0, GREEN (final re-run in
  `../../004-parity-regression-and-closeout/scratch/closeout/canary-sk-code.json`).
- Frozen replay: `loadSurfaceRouter` resolves `sourceRel: ROUTER.md`; intents 20, resources 20.

## Metadata

- `hub-router.json` defaultResource preserved byte-for-byte: `["shared/README.md"]`.
- `leaf-manifest.json` regenerated through the owner tool; delta adjudicated; freshness OK.
- Versions aligned; one new changelog entry added; historical entries untouched.

## Legacy deletion and residue

- Legacy file deleted after all gates passed; empty `shared/references/` tree removed.
- Live residue scan: zero live matches. Historical mentions remain immutable-history
  class; the ROUTER.md frontmatter provenance note records the relocation.
