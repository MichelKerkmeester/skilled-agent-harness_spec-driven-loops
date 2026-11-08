# Iteration 001 — Router files at v4.0.1.0

## Focus

Verify the v4.0.1.0 promise that every skill and mode routes from its own `ROUTER.md`: a sibling router beside every `SKILL.md`, a one-line link from `SKILL.md`, and agreement between each hub's `mode-registry.json`, `ROUTER.md` and `hub-router.json`.

## Actions Taken

1. Walked `.skilled/skills/**` (excluding `node_modules`) and enumerated every `SKILL.md` and `ROUTER.md`.
2. Parsed all seven `mode-registry.json` files, resolved every `modes[]` entry through its `packet` / `packetSkillName`, and compared the resulting set to the hub's `hub-router.json` `routerPolicy.tieBreak` and to its `ROUTER.md` text.
3. Read the v4.0.1.0 note's `## Skill Routing` section and compared its claims with the tree at tag `v4.0.1.0` via `git ls-tree`.
4. Checked the strict-enforcement claim in `package_skill.py` (RS-004) and the doctor naming invariant (`grandfatheredFolderMismatch`).
5. Hashed the two `package_skill.py` copies and checked hub version alignment across `mode-registry.json`, `SKILL.md` and `hub-router.json`.

## Findings

### P2 — Operator/UX: two fixture routers break the natural "one router per skill" invariant

- Type: operator and AI-user UX
- Evidence: `[SOURCE: .skilled/skills/sk-doc/scripts/tests/skill-router/ROUTER.md:1]` and `[SOURCE: .skilled/skills/sk-doc/scripts/tests/skill-router-no-machine/ROUTER.md:1]` have no sibling `SKILL.md`. The head tree holds 55 `SKILL.md` files and 57 `ROUTER.md` files.
- Why it matters: any operator or audit that asserts the inverse of the release promise ("every `ROUTER.md` belongs to a skill") gets two false failures inside the skills tree. This audit hit exactly that before resolving it.
- Constraint: both files are live test fixtures referenced by `[SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validator.py:128]` and `[SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validator.py:136]`, so deleting them breaks the validator tests. The fix is an explicit `scripts/tests/**` exclusion or moving fixtures outside `.skilled/skills/**`.
- Release introduced: present at tag `v4.0.1.0`; the invariant it violates is the one that release introduced.
- Confidence: high (counted and read both paths).
- Verify: `find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' | wc -l` vs `find .skilled/skills -name ROUTER.md -not -path '*/node_modules/*' | wc -l`.

### P2 — Over-engineering: two byte-identical `package_skill.py` copies

- Type: over-engineering
- Evidence: `[SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:1279]` and `[SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1279]` are both 83,560 bytes with SHA-256 prefix `69a5f164a4a65e8d`.
- What breaks if one is removed: the hub validator tests and the `sk-create-skill` workflow each invoke their local path, so removing one without repointing breaks that caller. A symlink or one shared script with two entry points keeps both callers working.
- Release introduced: UNKNOWN. The duplication is present at the `v4.0.2.0` head; it was not bisected to a release.
- Confidence: high (hash equality).
- Verify: `shasum -a 256 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`.

### P2 — Improvement: a shared-packet mode looks like a missing packet to folder-based tooling

- Type: improvement / extension footgun
- Evidence: `[SOURCE: .skilled/skills/sk-doc/mode-registry.json:53]` declares `workflowMode: sk-create-skill-parent`, but no `sk-create-skill-parent/` directory exists; the entry's `packet` is `sk-create-skill`. The doctor invariant compares the folder leaf to `packetSkillName`, not to `workflowMode` (`[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:586]`), so it passes.
- Why it matters: a resolver that maps `workflowMode` to a folder (as this audit first did) reports a false missing packet. The registry's `packet` field is the only disambiguator.
- Fix: state in the registry that `packet` is authoritative for resolution, or add a schema check that every `modes[]` entry resolves through `packet`.
- Release introduced: documented in v4.0.1.0 (`[SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60]`); the registry entry is present at head.
- Confidence: high (entry read; no folder on disk).
- Verify: `test -d .skilled/skills/sk-doc/sk-create-skill-parent || echo missing`.

## Questions Answered

- Router files (v4.0.1.0): every one of the 55 real `SKILL.md` files has a sibling `ROUTER.md` and at least one markdown link resolving to its own `./ROUTER.md`; every one of the seven hubs' registry mode sets equals its `hub-router.json` `routerPolicy.tieBreak` set and appears in its `ROUTER.md`. The only orphan routers are the two test fixtures above.
- The note's "54 skills and modes" is exact at tag `v4.0.1.0`: 54 `SKILL.md`, 56 `ROUTER.md`, two of them fixtures. The head's 55/57 is explained by post-tag changes: `cli-hermes` removed, `cli-deepseek-harness` and `system-skilled-doctor` added.
- The `package_skill.py --strict` claim holds: RS-004 is wired at `[SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:1446]` and strict promotion runs at `[SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:1774]`.
- Hub version alignment holds: for all seven hubs, `mode-registry.json` version equals `SKILL.md` version equals `hub-router.json` version. `ROUTER.md` versions intentionally lag (`[SOURCE: .skilled/skills/sk-code/SKILL.md:22]`).

## Questions Remaining

- Advisor scoring, transport and parity questions from the strategy (not touched this iteration).
- Whether any consumer outside the doctor and packaging tooling resolves `workflowMode` as a folder.
- Hermes removal references, relaunch and hook questions.

## Next Focus

Advisor scoring: the path-mention rule, the confidence-floor tie rule and the typed-command owner rule, exercised through `node .skilled/bin/skill-advisor.cjs advisor_recommend`.
