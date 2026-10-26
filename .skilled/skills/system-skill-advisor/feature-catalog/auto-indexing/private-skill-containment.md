---
title: "Private Skill Containment"
description: "Local advisor scans follow a top-level local-* skill link only when its real path resolves inside the skills root or a root named in SPECKIT_PRIVATE_SKILL_ROOTS, while tracked-output writers skip it by name."
trigger_phrases:
  - "private skill containment"
  - "local skill link"
  - "SPECKIT_PRIVATE_SKILL_ROOTS"
  - "trusted private skill roots"
version: 1.0.1.0
---

# Private Skill Containment

## 1. OVERVIEW

A skill whose folder name starts with `local-` belongs to one checkout, usually as a gitignored symlink to a folder in another repository. The local advisor must route it, and no tracked artifact may ever name it. Containment decides which links a scan may follow, so a link's name alone never grants trust.

---

## 2. HOW IT WORKS

Each scan that reads the top level of `.skilled/skills/` meets a `local-*` entry and asks the containment check whether to follow it. The check resolves the whole link chain with `realpathSync` and accepts the entry only when the target is a directory inside a trusted root. The trusted roots are the skills root itself and each absolute path in `SPECKIT_PRIVATE_SKILL_ROOTS`, joined by the platform path delimiter. A link that points straight at the skills root is refused, because the scan would re-enter its own tree. The per-scan check that `private-skill-target.ts` exports resolves the trusted roots at most once per scan, and only when a `local-*` link is actually met. The Python compatibility runtime mirrors the same rule.

The launcher forwards `SPECKIT_PRIVATE_SKILL_ROOTS` to the daemon child through `CHILD_ENV_ALLOWLIST`, so a daemon started without it skips every private skill whose link points outside the skills root. Every tracked-output writer, such as the graph compiler, the Hermes sync and the CI metadata gates, skips a `local-*` name before its first filesystem probe instead of calling this check.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts` | Library | Trusted roots, realpath containment and the per-scan check |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py` | Compat | Python mirror of the containment rule for the compatibility scans |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Launcher | `SPECKIT_PRIVATE_SKILL_ROOTS` in `CHILD_ENV_ALLOWLIST` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts` | Automated test | Trusted and untrusted links, the self-root refusal and the declared roots |
| `.skilled/bin/launcher-private-skill-roots.vitest.ts` | Automated test | The launcher forwards the variable to the daemon child |

---

## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `auto-indexing/private-skill-containment.md`

Related references:

- [sync.md](../../feature-catalog/auto-indexing/sync.md).
- [`daemon-and-freshness/watcher.md`](../../feature-catalog/daemon-and-freshness/watcher.md).
