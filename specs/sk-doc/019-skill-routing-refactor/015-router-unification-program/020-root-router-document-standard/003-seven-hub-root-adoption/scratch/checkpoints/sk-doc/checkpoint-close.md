# sk-doc (CP5) — checkpoint receipt

- Hub: sk-doc
- Legacy source: `shared/references/smart-routing.md` (deleted after gates passed)
- Root router: `ROUTER.md` (created, `router_state: active`, `skill_pointer: SKILL.md`)

## Machine block

- Legacy SHA-256 == new SHA-256 == Phase 001 baseline:
  `2ad1469cccf36f44a358ed57b891e55dd16adbc7db2d51de853c7e186f92742a`
  (byte-identical move; zero machine-block delta)

## Gates

- Root-router contract (post-deletion state): `state: active, ok: true`
- Parent doctor: `OK: parent-skill-check — all hard invariants passed, 0 warnings`
- Package gate: `package_skill.py --check: PASS`; `compiled routing readiness: FAIL (stale-manifest)`
  — sole failure is the downstream Phase-004 manifest refresh (same as cli-external-orchestration).
- Frozen replay: `loadSurfaceRouter` resolves `sourceRel: ROUTER.md`; intents 14, resources 14, default [].

## Metadata

- `hub-router.json` defaultResource preserved byte-for-byte: `["shared/references/quick-reference.md"]`.
- `leaf-manifest.json` regenerated through the owner tool
  (`generate-leaf-manifest.cjs --write`); delta is the pre-existing staleness fix
  (the generator walks only `references/`/`assets/` leaf roots and the on-disk
  `sk-create-skill` v4 upgrade leaf is now listed). Freshness: OK.
- Versions: ROUTER.md 1.0.1.0, SKILL.md 2.0.1.0, README.md 2.0.1.0, description.json 2.0.1.0;
  changelog entry added at `changelog/v2.0.1.0.md`.

## Legacy deletion and residue

- Legacy file deleted after the root router conformed.
- Live residue scan: zero live matches in the hub's live docs. Remaining mentions are
  classified: dated benchmark reports (immutable history), Phase-002 validator
  tooling constants/tests under `sk-create-skill/scripts/` (contract definition,
  out of scope), and the `parent-skill-smart-routing-template.md` normative
  "never coexist with a legacy smart-routing.md" statement (template contract, out of scope).
