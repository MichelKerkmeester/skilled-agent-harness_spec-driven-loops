---
title: Parent Skill Hub README Template
description: Template for the human-facing README of a parent hub, covering the hub pitch, the modes and packets table, registry and manifest navigation, changelog conventions, owned scripts and the validation close.
trigger_phrases:
  - "parent skill readme template"
  - "hub readme template"
  - "parent hub readme"
  - "mode registry readme navigation"
  - "hub readme validation"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# Parent Skill Hub README Template

> One template that turns any parent hub folder into a readable front door: the pitch, the packet table, the registry links and the validation close.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | A human-facing README at the root of a parent hub folder |
| **Invoke with** | Copy the fillable scaffold into `[hub-name]/README.md` and fill every placeholder from the hub's real files |
| **Covers** | The six hub surfaces: pitch, modes and packets, navigation, changelog, scripts and commands, verification |
| **Produces** | A numbered ALL-CAPS section README that passes the sk-doc readme validator and the Human Voice Rules |

---

## 2. OVERVIEW

### Why This Template Exists

A parent hub is one advisor identity over several nested packets. The mcp-tooling hub routes seven modes and the system-deep-loop hub routes five deep-loop families. Both hubs keep a README, a mode registry, a leaf manifest and a changelog folder. Without a shared template, every hub author invents a different front door: one lists features, another buries the packet table. A reader then has to reverse-engineer the hub from its folders.

The situation this template fixes: you have a hub folder with packets, a registry and a manifest. You need a README that orients a human in under a minute. This template gives you the section model, the writing rules for each surface and a fillable scaffold with stable relative links.

### What It Does

Every finished hub README covers six surfaces: the pitch and purpose-first overview, the modes and packets table, the navigation to `mode-registry.json` and `leaf-manifest.json`, the changelog convention, the scripts and commands list and the verification close. The template uses `.opencode/skills/mcp-tooling/` and `.opencode/skills/system-deep-loop/` as the structural examples, because both hubs already carry the full surface set this template standardizes.

### When To Write A Hub README

Write one for every parent hub: a folder that carries `mode-registry.json`, `hub-router.json`, `leaf-manifest.json` and nested packet folders with their own SKILL files. Both example hubs show the pattern. `.opencode/skills/mcp-tooling/` routes seven modes across workflow bridges and design transports. `.opencode/skills/system-deep-loop/` routes five workflow families over one shared runtime layer. Read both READMEs and both registries before drafting. Build the packet table from what `mode-registry.json` lists.

---

## 3. SECTION MODEL

A hub README uses numbered ALL-CAPS H2 sections with `---` dividers between them. The default order:

| # | Section | Purpose | Keep When |
|---|---------|---------|-----------|
| 1 | AT A GLANCE | A four-row table a reader scans in five seconds | Always |
| 2 | OVERVIEW | The purpose-first why, then what the hub does | Always, it is the only required section |
| 3 | MODES AND PACKETS | One table row per child packet with a pointer | The hub has two or more packets |
| 4 | NAVIGATION | Stable links to the registry and the manifest | The hub is registry-driven |
| 5 | CHANGELOG | The per-release entry convention | The hub keeps a changelog folder |
| 6 | SCRIPTS AND COMMANDS | One-line usage per owned script or command | The hub owns scripts or commands |
| 7 | VERIFICATION | The validator and HVR checks for the README | Always |

`OVERVIEW` is the one section the validator requires. Every other section is optional, but a hub README without MODES AND PACKETS or NAVIGATION misses its job. Those two are the map a reader comes for.

---

## 4. THE SIX HUB SURFACES

### 4.1 Pitch And Purpose-First Overview

Open with a one-line blockquote pitch right after the H1. The pitch states the whole family outcome in plain words. The two example hubs show the shape: mcp-tooling opens with "One advisor identity, seven modes" and system-deep-loop opens with "One skill that routes to every active deep-loop workflow".

The OVERVIEW starts with a `### Why This Hub Exists` subsection that names the reader's situation before any feature list: the family of problems, what went wrong before the hub unified them and where the reader is now. The `### What It Does` subsection then explains the mechanism: one advisor identity that routes through `mode-registry.json`. The hub holds no packet-local logic.

Write Why This Hub Exists as a short narrative, three to six sentences, not a summary. Put the reader in the situation they hit before the hub existed, when the family of problems lived in scattered places and every author invented a different front door. Let them feel that before you name the unifying identity. You may add a 2 to 3 sentence narrative hook after the blockquote, before AT A GLANCE. You may add an optional `### Why It Matters` value beat with outcome bullets inside OVERVIEW. For a hub with a multi-step routing flow, add a small ASCII diagram of request to registry to packet, modeled on the root README connection diagram.

### 4.2 Modes And Packets

Open MODES AND PACKETS with one or two sentences that frame the family the table lists, so the table reads as a map rather than a raw dump. Then give every child packet or mode one table row. Each row carries the packet folder name, the kind (workflow, surface or transport), a one-line use statement and a relative pointer to the child README or folder. A pointer looks like `[README.md](./[mode-a]/README.md)`. When a packet has no README yet, link the folder itself with a trailing slash.

The registry is the truth for this table. Read `mode-registry.json` and list every entry in `modes[]`. Do not invent rows. The mcp-tooling README lists all seven packet folders with one bullet each and a per-packet README pointer. The system-deep-loop README uses a layout table for the same job, mapping each mode packet to what it holds.

### 4.3 Navigation

Link `mode-registry.json` and `leaf-manifest.json` with stable relative paths from the hub root. A stable path is one a reader resolves without a search: `[mode-registry.json](./mode-registry.json)` and `[leaf-manifest.json](./leaf-manifest.json)`. Say what each file holds in one line. The registry is the single source of truth for modes. The manifest is the generated inventory of the hub's routed leaves. Tell the reader the manifest regenerates when packets change, so it reads as a snapshot.

The system-deep-loop README links `mode-registry.json` from its RELATED DOCUMENTS table with a purpose note per row. The mcp-tooling README names the registry and the router in its AT A GLANCE table, so a reader finds the routing files in the first scan.

### 4.4 Changelog

Keep one file per release inside the hub `changelog/` folder, named `v[version].md`. Every entry opens with the release title and the reason in plain words, then a what-changed list grouped by surface (routing surfaces, advisor and docs, cleanup), then a files-changed table. The mcp-tooling changelog folder holds one file per release from `v1.0.0.0.md` forward. Its newest entry groups the changes exactly this way.

### 4.5 Scripts And Commands

List every script and command the hub owns with a one-line usage line. Each row names the script or command, the exact invocation and the expected output, so a reader can tell success from failure. When the hub owns slash commands, list them with their dispatch target. The system-deep-loop hub runs its modes through `/deep:*` commands. Its README names the command and the mode it resolves.

### 4.6 Verification

Close with the checks that prove the README is real. The sk-doc readme validator enforces the numbered ALL-CAPS `OVERVIEW` section. The HVR grep enforces the voice. Show both commands with their expected results. The mcp-tooling README closes with a VERIFICATION section that runs the parent-skill check and states the expected output.

---

## 5. FILLABLE SCAFFOLD

Copy this into `.opencode/skills/[hub-name]/README.md`, fill every placeholder from the hub's real files, then remove sections that do not fit and renumber.

````markdown
---
title: "[hub-name]"
description: "[One sentence: the hub's family and what it routes.]"
trigger_phrases:
  - "[primary routing phrase]"
  - "[secondary routing phrase]"
version: 1.0.0.0
---

# [hub-name]

> [One line. The outcome the hub delivers for its whole family, in plain words a person would say out loud.]

[Optional narrative hook, two to three sentences. A running start into the hub's story before the scan table. AT A GLANCE stays the first numbered section.]

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | [The family of problems the hub routes, one line.] |
| **Invoke with** | [Keyword routing, slash commands or the manual read path.] |
| **Routes to** | [The nested packets via mode-registry.json and hub-router.json.] |
| **Produces** | [The artifacts or decisions the modes return.] |

---

## 2. OVERVIEW

### Why This Hub Exists

[Two to four sentences, problem-first. State the situation a reader is in and what goes wrong without the hub. Name the family and the nested packets. No feature list here.]

### What It Does

[Two to four sentences. One public advisor identity that routes every request to a nested packet. The hub holds no packet-local logic. Name the registry that resolves modes and the manifest that inventories leaves.]

### Why It Matters

[Optional. Two to four outcome bullets, benefit-first, each naming what a reader of the whole family gets. Drop this subsection when the payoff is already obvious from What It Does.]

- **[Outcome, not feature]:** [the concrete benefit in plain words]
- **[Outcome, not feature]:** [the concrete benefit in plain words]

[Optional connection diagram for a multi-step routing flow. Show request to registry to the packet that owns it, modeled on the root README connection diagram.]

```text
[request]
   |
   v
[mode-registry.json]  -->  [the packet that owns the request]
   |
   v
[the artifact or decision the mode returns]
```

---

## 3. MODES AND PACKETS

[One or two sentences that frame the family this table lists, so the table reads as a map. Then the table.]

| Packet | Kind | Use it for | Pointer |
|---|---|---|---|
| `[mode-a]/` | workflow | [What the mode does, one line.] | [`README.md`](./[mode-a]/README.md) |
| `[mode-b]/` | surface | [What the evidence base covers, one line.] | [`README.md`](./[mode-b]/README.md) |
| `[mode-c]/` | transport | [What external tool it bridges, one line.] | [`README.md`](./[mode-c]/README.md) |

[One row per child packet, copied from mode-registry.json. A packet without a README links its folder with a trailing slash. Add a row for every mode the registry lists.]

---

## 4. NAVIGATION

| File | What it holds | Why it matters |
|---|---|---|
| [`mode-registry.json`](./mode-registry.json) | The single source of truth for every mode | Resolve which packet owns a request |
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the reference and asset files a mode loads |

[Both paths are stable relative links from the hub root. The manifest regenerates when packets change, so read it as a snapshot.]

---

## 5. CHANGELOG

Releases live in `changelog/` with one file per release, named `v[version].md`. Every entry opens with the release title and the reason in plain words, then a what-changed list grouped by surface, then a files-changed table. Link the newest entry:

| Release | Entry |
|---|---|
| [version] | [`changelog/v[version].md`](./changelog/v[version].md) |

---

## 6. SCRIPTS AND COMMANDS

| Script or command | One-line usage | Expected output |
|---|---|---|
| [script path] | [command] | [what a pass looks like] |
| [slash command] | [command] | [what it dispatches to] |

---

## 7. VERIFICATION

Run the sk-doc readme validator on this file:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md --type readme
```

[Expected: zero issues. The validator enforces the numbered ALL-CAPS OVERVIEW section.]

Run the HVR check on this file. Grep for the em dash character and grep for the semicolon character. Both greps return zero matches:

```text
grep for the em dash character in README.md
grep for the semicolon character in README.md
```

[Keep zero Oxford commas, zero banned words and zero setup phrases in the prose as well. Optional extra: run the parent-skill check to prove the whole hub shape.]

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/[hub-name]
```

[Expected: zero invariant failures and zero warnings.]
````

---

## 6. VALIDATION CHECKLIST

- [ ] H1 is followed by a one-line blockquote pitch stating the family outcome.
- [ ] `AT A GLANCE` is the first section and its table is four rows of one-line cells.
- [ ] A numbered `OVERVIEW` section exists and opens with `### Why This Hub Exists`, problem-first, before any feature list.
- [ ] H2 sections are numbered, ALL CAPS and separated by `---` dividers.
- [ ] `MODES AND PACKETS` lists every mode from `mode-registry.json` with a relative pointer per row.
- [ ] `NAVIGATION` links `mode-registry.json` and `leaf-manifest.json` with stable relative paths.
- [ ] `CHANGELOG` follows the per-release convention with one file per version.
- [ ] `SCRIPTS AND COMMANDS` lists every owned script and command with a one-line usage and its expected output.
- [ ] `VERIFICATION` names the sk-doc readme validator and the HVR checks.
- [ ] Every linked path resolves from the hub root.
- [ ] HVR passes: zero em dashes, zero semicolons, zero Oxford commas, zero banned words and zero setup phrases.
- [ ] `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues.

> The script above is a floor, not a proxy for this checklist. It enforces the numbered ALL-CAPS `OVERVIEW` header. It does not check the pitch, the `AT A GLANCE` table, the packet table or HVR. A green run means the file cleared the floor, not that it passed the checks above.

---

## 7. RELATED RESOURCES

- [`parent-skill-hub-template.md`](./parent-skill-hub-template.md) - The hub `SKILL.md` scaffold this README template pairs with.
- [`skill-readme-template.md`](../skill/skill-readme-template.md) - The standalone skill README template this hub template extends.
- [`parent-skill-registry-template.json`](./parent-skill-registry-template.json) - The `mode-registry.json` scaffold the packet table mirrors.
- [`parent-skill-hub-router-template.json`](./parent-skill-hub-router-template.json) - The `hub-router.json` scaffold the hub routes with.
- [`hvr-rules.md`](../../../shared/references/hvr-rules.md) - The Human Voice Rules this template writes in.
