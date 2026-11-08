# Iteration 001 — Hub Routers, Mode Registries, and Release-Note Alignment

## Focus

Key questions 1 and 2:

- Q1: Does every mode listed in the `ROUTER.md` and `mode-registry.json` of sk-doc, sk-code, sk-design and sk-prompt resolve to a file that exists, as the parent-hub canon requires?
- Q2: Does each hub's `SKILL.md` and `README` match what the v4.0.0.0 and v4.0.1.0 notes say it ships, including the sk-design consolidation and the Retired Surfaces section?

## Actions Taken

1. Read the run config, strategy, and the four hub roots (`ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`).
2. Enumerated every `modes[]` entry in sk-doc (15), sk-code (5) and sk-design (3) and tested `<hub>/<packet>/SKILL.md` on disk. All 23 resolve.
3. Enumerated every `leaf-manifest.json` leaf, resolved packet-relative, and tested existence: sk-doc 132 leaves / 5 missing, sk-code 119 / 0, sk-design 178 / 0, sk-prompt 35 / 0.
4. Read the v4.0.0.0 sections "One Code Skill", "The Design Surface", "Documentation as a System" and the v4.0.1.0 "Retired Surfaces" section, then compared their claims with the hub `SKILL.md` files and with the v4.0.0.0 tag registry.
5. Searched the four hubs for retired names (`sk-code-webflow`, `sk-code-obsidian`, `sk-design-fundamentals`, `sk-vision`, `mcp-magicpath`).

## Findings

### F1 — sk-doc leaf manifest points at five leaves that do not exist (bug, P1)

`leaf-manifest.json` lists five `sk-create-quality-control` leaves as packet-local paths, but none exists under that packet. The files live in `sk-doc/shared/` (three of them) and the root `ROUTER.md` `RESOURCE_MAP` already spells them with the `shared/` alias, so the manifest and the router disagree about the same resources.

- Type: bug
- Severity: P1
- Release: v4.0.0.0 (hub/shared-backbone split; still present at v4.0.2.0)
- Confidence: high that the five paths are missing; medium that v4.0.0.0 is the exact introducing release
- Evidence:
  - [SOURCE: .skilled/skills/sk-doc/leaf-manifest.json:125] `"assets/llmstxt-templates.md"`
  - [SOURCE: .skilled/skills/sk-doc/leaf-manifest.json:127] `"references/core-standards.md"`
  - [SOURCE: .skilled/skills/sk-doc/leaf-manifest.json:128] `"references/evergreen-packet-id-rule.md"`
  - [SOURCE: .skilled/skills/sk-doc/leaf-manifest.json:129] `"references/hvr-rules.md"`
  - [SOURCE: .skilled/skills/sk-doc/leaf-manifest.json:133] `"references/validation.md"`
  - [SOURCE: .skilled/skills/sk-doc/ROUTER.md:194] `"shared/references/validation.md"`
  - [SOURCE: .skilled/skills/sk-doc/ROUTER.md:196] `"shared/references/core-standards.md"`
  - [SOURCE: .skilled/skills/sk-doc/ROUTER.md:197] `"shared/references/evergreen-packet-id-rule.md"`
  - [SOURCE: .skilled/skills/sk-doc/ROUTER.md:201] `"shared/assets/llmstxt-templates.md"`
- Verify:
  ```bash
  node -e 'const fs=require("fs"),p=require("path"),r=".skilled/skills/sk-doc",j=require("./.skilled/skills/sk-doc/leaf-manifest.json");for(const m of j.modes)for(const l of m.leaves)if(!fs.existsSync(p.join(r,m.packet,l)))console.log(m.packet+"/"+l)'
  ```
  Expected: five lines, all prefixed `sk-create-quality-control/`.

### F2 — v4.0.0.0 note names a surface the tag did not ship (drift, P2)

The note names sk-code's three read-only surfaces as `sk-code-webflow`, `sk-code-skilled` and `sk-code-obsidian`. The v4.0.0.0 tag registry ships `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian`; the tag directory listing confirms `sk-code-opencode/` and no `sk-code-skilled/`. The note's middle name is the later rename, not what shipped.

- Type: drift
- Severity: P2
- Release: v4.0.0.0
- Confidence: high
- Evidence: [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:278] `- **read-only surface packets that inform:** sk-code-webflow, sk-code-skilled and sk-code-obsidian`
- Verify:
  ```bash
  git show 3fed08373e:.skilled/skills/sk-code/mode-registry.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).modes.map(m=>m.workflowMode).join(" ")))'
  ```
  Expected: `sk-code-quality sk-code-review sk-code-webflow sk-code-opencode sk-code-obsidian`.

### F3 — sk-doc render fixture still links the retired sk-design-fundamentals (drift, P2)

The v4.0.1.0 Retired Surfaces section says `sk-design-fundamentals` is gone and that a link to `sk-design/sk-design-fundamentals/` no longer resolves. A sk-doc render-test fixture still carries seven such links. No script consumer of the fixture name was found by a direct filename search, so the gate impact is unproven; the dangling links themselves are confirmed.

- Type: drift
- Severity: P2
- Release: v4.0.1.0 (Retired Surfaces)
- Confidence: high that the links dangle; medium that a gate consumes the fixture
- Evidence: [SOURCE: .skilled/skills/sk-doc/scripts/tests/render/web-markup-and-css.md:25] links `../../../sk-design/sk-design-fundamentals/SKILL.md`; the same target appears at lines 26, 29, 51, 97, 124 and 180.
- Verify:
  ```bash
  test -e .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md || echo MISSING
  ```
  Expected: `MISSING`.

### F4 — sk-design is the only one of the four hubs with no README (improvement, P2)

sk-doc, sk-code and sk-prompt each ship a hub-root `README.md`; sk-design has never had one in git history. The parent-hub companion-file policy requires a README for every packet, not for the hub root, so this is not a canon violation and nothing breaks. It does leave a reader at the hub root without a non-AI-facing overview.

- Type: improvement
- Severity: P2
- Release: v4.0.0.0 (hub creation; never added through v4.0.2.0)
- Confidence: high for the absence; the canon reading is at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:327]
- Verify:
  ```bash
  test -f .skilled/skills/sk-design/README.md || echo MISSING
  ```
  Expected: `MISSING`.

## Questions Answered

- Q1: **Yes for mode entries.** All 15 sk-doc, 5 sk-code and 3 sk-design `workflowMode` values resolve to `<packet>/SKILL.md`. sk-prompt is a standalone skill, not a parent hub, so it has no mode registry; its 35 manifest leaves all resolve. The one failure in this layer is the sk-doc leaf manifest (F1), which is a leaf-level artifact rather than a mode entry.
- Q2: **Yes for `SKILL.md`; not applicable for sk-design `README` because none exists.** sk-code `SKILL.md` states exactly three surfaces and matches the v4.0.1.0 frontend addition; sk-design `SKILL.md` states three modes and matches the v4.0.1.0 retirement of `sk-design-fundamentals`; sk-doc `SKILL.md` states fifteen modes across fourteen packets, matching its registry. Residual drift is F2 (release note vs tag) and F3 (stale fixture links).

## Questions Remaining

- Q3: Do the sk-doc authoring validators from v4.0.0.9 pass on sk-code, sk-design and sk-prompt themselves?
- Q4: Does the sk-code quality-config and review flow from v4.0.0.6 and v4.0.0.16 work from its documented commands?
- Q5: Do the `/create:*` commands match the sk-doc mode contracts (flags, defaults, outputs)?
- Q6: Do the `/design:*` commands and sk-design modes match the stated 29 chart forms and 27 diagram types?
- Q7: Does sk-prompt match its v4.0.0.0 note, and do the cli-* skills consume `cli-prompt-quality-card.md` consistently?
- Q8: Did the v4.0.0.16 changelog move leave stale changelog paths in these hubs?
- Q9: Do the v4.0.1.0 manual-testing playbooks point at existing files and commands?
- Q10: Which templates, references, assets or modes have no inbound route or duplicate another?
- Q11: What friction do the operator and AI user hit?
- Q12: What concrete extensions would let the hubs share validators, routing tests or templates?

## Next Focus

Iteration 2 should take Q3 and Q4: run the sk-doc authoring validators against the three other hubs and trace the sk-code quality/review commands. Also follow F1 into the generator that writes `leaf-manifest.json`, to identify whether the `shared/` alias is dropped at generation time or at contract conversion.

## SCOPE VIOLATIONS

None. All reads were read-only; writes were limited to this iteration's narrative, its delta file, and the append gateway.
