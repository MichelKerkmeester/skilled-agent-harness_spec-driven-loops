---
title: "sk-create-frontmatter References"
description: "Router for this mode's reference set: the 4-part version standard, and where the field reference lives."
trigger_phrases:
  - "frontmatter references"
  - "which frontmatter reference to load"
  - "frontmatter versioning reference"
importance_tier: normal
contextType: reference
version: 1.0.0.4
---

# sk-create-frontmatter References

Router for the `sk-create-frontmatter` reference set. The packet contract at [../SKILL.md](../SKILL.md) is authoritative for when each resource loads.

---

## 1. OVERVIEW

The field reference is the mode's always-loaded resource and lives in `assets/` rather
than here, because it is a set of copy-paste templates rather than a standard to reason
from. The split follows the hub's own convention. `references/` holds what you read to
decide, and `assets/` holds what you copy.

The enforcement scripts stay in the hub's shared tier: `frontmatter-version.mjs`, its
corpus-gate wrapper, and the fast validator four command workflows call. A post-edit hook
outside this hub resolves one of them by literal path, so moving them would break a live
hook. This mode owns the contract, and the shared tier keeps the enforcement.

---

## 2. REFERENCE MAP

| Load | When |
|------|------|
| [`frontmatter-versioning.md`](frontmatter-versioning.md) | The question is about `version`: its format, its derivation from a changelog anchor, the numstat gate, or the corpus enforcement |
