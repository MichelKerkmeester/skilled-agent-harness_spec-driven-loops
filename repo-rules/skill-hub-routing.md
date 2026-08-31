---
title: "Rule: Skill hub routing"
description: "A parent hub projects one advisor identity and routes in two stages. A nested mode registered on one surface is not reachable, and a per-hub gate run without its hub argument reports on a hub you did not touch."
trigger_phrases:
  - "hub routing"
  - "parent hub"
  - "nested mode"
  - "one advisor identity"
  - "two-stage routing"
  - "stage one and stage two"
  - "adding a mode to a hub"
  - "mode registry"
  - "routerSignals"
  - "tieBreak"
  - "hub SKILL.md"
  - "is it wired"
  - "did it actually route"
  - "the mode is registered but nothing routes"
  - "advisor does not surface"
  - "routing class metadata"
  - "refactoring a skill"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Rule: Skill hub routing

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load it before wiring, rewiring or removing a mode in a parent-hub skill, or before reporting that one routes. It sits in the routing carve-out of section 4: verifying wiring you changed is In, selecting a route is not.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.
> Tier `normal`, unlike its peers: they fire on everyday work, this one only while creating or maintaining a skill.

## Fires when

- Adding, renaming or removing a mode in a hub that carries `mode-registry.json` and `hub-router.json`.
- Creating a new skill that will live under a hub, or refactoring one that already does.
- Editing `graph-metadata.json`, `hub-router.json`, a root `ROUTER.md`, or a hub's `SKILL.md` mode table.
- Reporting that a mode is registered, routed, reachable or integrated.
- Running a per-hub gate and quoting its result.

## The rule

**Report a mode as routed only after checking both stages against the hub you actually changed.**

A mode is routable only when every surface carries it, and registration is the first surface rather than the only one. The failure is quiet: the entry exists, every validator is green, and nothing reaches the mode.

---

## 1. THE TWO STAGES

The advisor scores the **hub**. Most nested modes are `routingClass: "metadata"`, resolved by hub membership, with no advisor entry of their own, and a second skill-shaped `graph-metadata.json` below the root is rejected. A minority are not: `lexical` and `alias-fold` modes carry their own advisor entries and projection maps, and `command-bridge` modes route by command surface. **Read the class before assuming which path applies** because the surfaces differ.

So routing runs in two stages, and each can pass while the other is broken:

| Stage | Owner | Picks |
|-------|-------|-------|
| One | the advisor, reading the hub's `graph-metadata.json` | the hub |
| Two | the hub's `hub-router.json` and root `ROUTER.md` | the mode, then its leaves |

Two consequences follow. A `metadata` mode's vocabulary reaches the advisor **only** through the hub's `graph-metadata.json`; a `lexical` or `alias-fold` mode also needs its projection maps and scorer entries. And a stage-one hit with no stage-two intent, or the reverse, means the two disagree about the same phrasing, fix both sides, not the one that happens to be failing.

**The failure this prevents:** concluding the advisor is broken because it does not surface a nested mode by name. It is not broken. It was never going to.

---

## 2. REGISTERED IS NOT ROUTED

Before saying a mode is integrated, confirm every surface carries it. The authoritative list, with what each one breaks, is section 7 of [`parent-skills-nested-packets.md`](../.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md).

The two most often missed are the two nothing used to enforce:

- The hub's own `SKILL.md` mode table. It is the discovery surface a runtime shows when the advisor is unreachable, and a mode absent from it is invisible to a reader.
- The runtime command mirrors. A command present in one runtime tree and absent from three is unreachable from those three.

**A green gate is not integration.** The per-hub gate covers some surfaces and asserts only presence, never reachability. Several surfaces have no gate at all.

**The failure this prevents:** reporting "the registries are correct" after checking that entries exist rather than that the policy is complete, or reading a green gate as proof a request can reach the mode.

---

## 3. CHECK THE HUB YOU CHANGED

A per-hub gate run without its hub argument reports on whichever hub it defaults to. The output is green, detailed and about something else.

Pass the hub path explicitly, and read the subject line before the verdict:

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/<hub>
```

Then replay both stages with a real request for the mode, rather than trusting either gate alone. The commands are in the reference above.

**The failure this prevents:** a green run that certifies a hub you never touched. This is the green-run-lies case from [`evidence-and-proof.md`](evidence-and-proof.md) with a specific, repeatable shape.

---

## 4. KEEP THE ALIAS NARROW

An alias earns its place by catching a request for **this** mode. A term that also matches unrelated work (`rule file`, `config`, `template`) captures traffic the hub cannot serve, and the misroute surfaces only when someone types it.

Replay each new alias against a plausible out-of-domain phrase before shipping it.

---

## 5. WHERE THE DETAIL LIVES

This rule is a pointer, deliberately. It carries the discipline; the mechanics belong to the skills that own them. That split is what keeps it inside the carve-out, a section here telling you which route to pick would put the rule out of bounds.

| Question | Read |
|----------|------|
| What must a new mode land on, and in what order | `parent-skills-nested-packets.md` §7 |
| Hub doctrine, one identity, the `routingClass` table | `parent-skills-nested-packets.md` §1-2 |
| Which metadata file is required or forbidden at which root | `skill-root-metadata-contract.md` |
| How the advisor scores, and its regression corpus | `.opencode/skills/system-skill-advisor/` |
| Authoring or repairing a hub | `sk-doc` → `sk-create-skill` |

---

## 6. SELF-CHECK

- [ ] I know which stage I changed, and I checked the other one.
- [ ] Every surface in the reference list carries the mode, not just the registry.
- [ ] The hub's own `SKILL.md` names the mode.
- [ ] I passed the hub path to the per-hub gate and read its subject line.
- [ ] I replayed a real request through both stages, not just a validator.
- [ ] Each new alias was replayed against an out-of-domain phrase.
- [ ] Nothing I reported as routed was inferred from a registry entry alone.
