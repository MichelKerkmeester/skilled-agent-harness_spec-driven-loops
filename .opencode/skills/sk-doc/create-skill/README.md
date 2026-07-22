---
title: "create-skill"
description: "Scaffold, validate and package standalone OpenCode skills and two-axis parent hubs from vetted templates, for anyone building or repairing a skill under .opencode/skills/."
trigger_phrases:
  - "create skill"
  - "parent hub"
version: 1.1.0.0
---

# create-skill

> Scaffold a validated OpenCode skill or parent hub from real templates, not a blank file and a guess.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Scaffolding, validating and packaging OpenCode skills under `.opencode/skills/`, standalone or parent hub |
| **Invoke with** | `/create:skill`, `/create:skill-parent`, "new skill", "parent hub" |
| **Works on** | New skill folders and existing skill or hub packages that need repair or re-validation |
| **Produces** | `SKILL.md`, `README.md`, `references/`, `assets/`, `scripts/` for a skill, or a full parent-hub router set |

---

## 2. OVERVIEW

### Why This Skill Exists

Hand-rolling a new skill from a blank `SKILL.md` means reinventing frontmatter rules, section order, routing pseudocode and validation gates every single time, and the drift shows up as skills that skip a required field, use the wrong version format or bury routing logic where the advisor can never find it. A parent hub multiplies that risk across a registry, a router and however many nested packets, all of which have to agree with each other or the hub silently misroutes. create-skill exists to scaffold both shapes from vetted templates and then prove the result is valid before anyone calls it done.

### What It Does

create-skill runs one of two workflow modes from a single packet. `create-skill` scaffolds a standalone skill with its own advisor identity, SKILL.md, README.md, references, assets and scripts, built with `scripts/init_skill.py` and normalized to this repo's section order. `create-skill-parent` scaffolds a parent hub that dispatches to nested workflow or surface packets, with one `mode-registry.json`, one `hub-router.json`, and `graph-metadata.json` only at the hub root, never inside a nested packet. Both modes end at the same gate: `scripts/validate_skill_package.py` must exit clean before `scripts/package_skill.py` runs. It does not audit or improve an existing skill's prose quality once the skill already exists and only needs review. That is `create-quality-control`.

---

## 3. QUICK START

**Step 1: Scaffold a standalone skill.**

```bash
# --path is the PARENT directory. init_skill.py creates <path>/my-skill
python3 scripts/init_skill.py my-skill --path .opencode/skills
```

Creates `my-skill/` with `SKILL.md`, `README.md`, `references/`, `assets/` and `scripts/`.

**Step 2: Fill in the real content, then validate.**

```bash
python3 scripts/validate_skill_package.py .opencode/skills/my-skill
```

Expected output ends with `package_skill.py --check: PASS (exit 0)`.

**Step 3: Package only after validation passes.**

```bash
python3 scripts/package_skill.py .opencode/skills/my-skill <output-directory>
```

---

## 4. HOW IT WORKS

The standalone path starts with concrete examples of what the skill needs to do, then clarifies purpose, trigger phrases, output contract and boundaries before any file gets written. From there each piece of reusable content gets a home: deterministic or repeatedly-rewritten code goes in `scripts/`, domain knowledge and detailed workflow guidance goes in `references/` and templates or output resources go in `assets/`. `scripts/init_skill.py` scaffolds the folder. Generated files get normalized to the repo's section order and trimmed of anything unneeded, then `SKILL.md` gets authored as an executable contract with `WHEN TO USE`, `SMART ROUTING`, `HOW IT WORKS`, `RULES` and `SUCCESS CRITERIA`. Validation runs before any completion claim, and packaging only runs after validation passes.

The parent-hub path starts by confirming the target really is one advisor-routable identity, not several skills that happen to be related. `scripts/init_skill.py --kind parent` then scaffolds the hub root (`SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`) and each nested packet gets its own `SKILL.md`, `README.md` and `changelog/`, with no packet-local `graph-metadata.json` anywhere but the root.

### Legacy Versus Ready Is A Choice, Not A Default

`--compiled-routing legacy` and `--compiled-routing ready` produce genuinely different on-disk artifacts for the same hub shape, and the authoring workflow asks which one you want rather than silently picking. Legacy leaves the router directive in place with no canonical manifest, which is backward compatible with every existing call. Ready mints a canonical manifest with `compiled-route-manifest.cjs mint`, then verifies it is fresh and only reports `compiled-ready` when both steps succeed. A failed mint or a stale manifest falls back to legacy rather than ever hand-authoring a manifest or a digest. Either way, a ready manifest stays inert onboarding evidence: it never activates compiled serving or changes the repository default on its own.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-skill when creating a brand-new OpenCode skill, rebuilding an existing one or authoring a parent hub with nested workflow or surface packets. Reach for it too when repairing broken frontmatter, missing required sections or routing metadata in a package that already exists. Choose `create-skill-parent` specifically when one identity needs to dispatch to multiple nested packets, not merely because two skills feel related. Skip it for application code (that belongs to `sk-code`), for auditing or scoring an existing skill without rebuilding it (that belongs to `create-quality-control`) and for a README refresh on a skill that already has one.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-readme` | Writes or refreshes a skill's README once the skill already exists. create-skill writes the first one while scaffolding. |
| `create-quality-control` | Audits, scores or optimizes an existing skill document without rebuilding the package. |
| `create-agent` | Owns agent scaffolding, a separate artifact family from skills. |
| `sk-code` | Owns application code implementation. create-skill only authors the skill package that may describe that work. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `validate_skill_package.py` fails on frontmatter | `name`, `description`, `allowed-tools` or `version` is missing, or `version` is not four-part | Fix `SKILL.md` frontmatter to match the four required fields exactly |
| Parent hub validation reports a stale manifest | `--compiled-routing ready` was chosen, then router inputs changed after minting | Re-run `compiled-route-manifest.cjs mint`, or fall back to legacy |
| Nested packet fails validation over `graph-metadata.json` | A nested workflow or surface packet was given its own `graph-metadata.json` | Delete it. Only the hub root carries `graph-metadata.json` |
| Generated paths flagged as non-kebab-case under `--strict` | A `references/` or `assets/` file used snake_case or another casing | Rename to kebab-case. Python files and tool-mandated names stay exempt |
| `package_skill.py` refuses to package | `validate_skill_package.py` has not run yet, or it failed | Run validation first and fix every hard failure before packaging |

---

## 7. FAQ

**Q: Why two workflow modes in one packet instead of two skills?**

A: Both modes share the same templates, validation gate and packaging helper. Splitting them would duplicate that machinery for what is really one decision: one advisor identity, or many nested packets under one identity.

**Q: When do I choose `create-skill-parent` over adding another standalone skill?**

A: When several packets need to answer to one advisor identity, one router and one registry. Two genuinely unrelated skills should stay two standalone skills, not get merged into a hub for convenience.

**Q: What is the real difference between legacy and ready compiled-routing?**

A: Legacy leaves the router directive in place with no canonical manifest, which is the safe, backward-compatible default. Ready mints and verifies a canonical manifest, but the result stays inert onboarding evidence and never activates compiled serving on its own.

**Q: Do I need `scripts/`, `references/` and `assets/` for every skill?**

A: No. `SKILL.md` is the only required file. Add the others only when the skill genuinely needs deterministic scripts, deep reference material or template assets.

---

## 8. VERIFICATION

| Check | How to run it | Pass looks like |
|---|---|---|
| Package completion | `python3 scripts/validate_skill_package.py <path>` | Ends with `package_skill.py --check: PASS (exit 0)`. Parent hubs also report legacy or compiled-ready state |
| Strict contract check | `python3 scripts/validate_skill_package.py <path> --strict` | Promotes noncanonical generated paths from advisory to blocking |
| Structure extraction | `python3 ../shared/scripts/extract_structure.py <path/to/SKILL.md>` | Prints the parsed section outline for a fast quality read |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime workflow, routing rules and the full standalone and parent-hub contract |
| [`assets/skill/skill-md-template.md`](./assets/skill/skill-md-template.md) | Standalone `SKILL.md` scaffold |
| [`assets/skill/skill-readme-template.md`](./assets/skill/skill-readme-template.md) | Standalone skill README scaffold, the template this file was written from |
| [`assets/parent-skill/parent-skill-hub-template.md`](./assets/parent-skill/parent-skill-hub-template.md) | Parent hub `SKILL.md` scaffold |
| [`references/README.md`](./references/README.md) | Route map into the `skill/` and `parent-skill/` reference groups |
| [`scripts/init_skill.py`](./scripts/init_skill.py) | Scaffold helper for new standalone or parent-hub folders |
| [`scripts/package_skill.py`](./scripts/package_skill.py) | Validation and packaging helper |
