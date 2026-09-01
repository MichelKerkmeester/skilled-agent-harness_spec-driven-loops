# sk-doc/shared - cross-packet backbone

## 1. OVERVIEW

`shared/` holds the parts of `sk-doc` that more than one workflow packet needs: the document validators and naming guards (`scripts/`), the standards every packet writes against (`references/`), and the templates and machine-readable rule files those validators read (`assets/`).

A resource earns a place here by having consumers in two or more packets. A resource with exactly one consumer belongs inside that packet.

Nothing here is separately discoverable: `shared/` carries no `graph-metadata.json` and no `description.json`, because it is not a skill and the advisor never routes to it. Requests reach these files through the owning packet, or through the hub `ROUTER.md` `RESOURCE_MAP`, which addresses five of them by a `shared/...` disk path declared in `leaf-aliases.json`.

---

## 2. STRUCTURE

| Directory | Contents |
|-----------|----------|
| [`references/`](references/) | Standards: core structural rules, validation and DQI scoring, the kebab-case filesystem canon, the frontmatter versioning standard, the evergreen packet-id rule, and the hub quick reference. The Human Voice Rules are not here: they have one consumer packet and live at [`../sk-create-with-human-voice/references/hvr-rules.md`](../sk-create-with-human-voice/references/hvr-rules.md). |
| [`assets/`](assets/) | Templates and rule data: changelog and frontmatter and llms.txt templates, plus `template-rules.json` and `skill-contract.json`, which are read by code rather than by a reader. |
| [`scripts/`](scripts/README.md) | Validators, naming guards, the frontmatter versioning engine and the semantic rename toolchain. |

---

## 3. HOW PACKETS REACH IT

Packets reference these files by relative path (`../shared/references/core-standards.md`), not by symlink.

The one exception is `scripts/`. Six entries under `sk-doc/scripts/` are facade symlinks into `shared/scripts/`, so a caller can run `scripts/validate_document.py` from the hub root. There is no matching facade for `references/` or `assets/`: the hub has no root-level `references/` or `assets/` directory, so a bare `assets/...` path does not resolve and every reference to these files must be packet-qualified or `shared/`-qualified.

`.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` hard-codes `shared/scripts/check-frontmatter-versions.sh`, and `sk-doc/scripts/` symlinks resolve into `shared/scripts/`. Moving anything under `scripts/` breaks both.

---

## 4. RELATED

- [`../ROUTER.md`](../ROUTER.md) - maps an authoring intent to the leaf resources a mode loads, including the `shared/...` aliases.
- [`../leaf-aliases.json`](../leaf-aliases.json) - the six alias entries the router addresses as packet-local leaves, five of them `shared/` paths.
- [`scripts/README.md`](scripts/README.md) - per-script purpose and the commands to run them.
