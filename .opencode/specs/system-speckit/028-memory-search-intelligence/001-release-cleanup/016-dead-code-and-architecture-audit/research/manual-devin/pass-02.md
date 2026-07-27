All evidence confirmed. Here is the audit report.

---

# Dead-Code & Architecture Audit — Pass 016
## Focus: `cli-external-orchestration/` and `mcp-tooling/` hubs

Read-only audit. Every finding below was verified against files on disk. Categories with no confirmed findings are listed explicitly at the end. `.opencode/specs/` content is excluded.

A note on scope: both `.opencode/skills/` and `.claude/skills/` host identical trees; all paths below use the `.opencode/` form. `leaf-manifest.json` is a **live** contract (consumed by `doctor/scripts/parent-skill-check.cjs`), so leaf/disk divergence would be a real defect — none was found: every leaf listed in both hubs' `leaf-manifest.json` exists on disk.

---

### F1 — CAT-5: cli-external-orchestration prose says "three"/"four" modes while the authoritative registry ships five

**Path:** `.opencode/skills/cli-external-orchestration/SKILL.md`, `.opencode/skills/cli-external-orchestration/mode-registry.json`

**Evidence:**
- `SKILL.md:41` — "`mode-registry.json` lists all **three** modes in one `modes[]` array"
- `SKILL.md:161` — "all **three** current modes are; a future mode may not be"
- `mode-registry.json:5` — "All **four** modes route by hub membership"
- `mode-registry.json:14` — "All **four** cli-external-orchestration modes use folder == packetSkillName"
- `mode-registry.json:15` — "None of the **four** executor modes has a dedicated command"
- Contradicted by the authoritative `modes[]` array (`mode-registry.json:17-173`) which lists **five**: `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`
- Also contradicted by the same files' own correct statements: `SKILL.md:3` "five workflow modes" and `SKILL.md:51` "All five modes are primary"

**Verify:**
```bash
rg -n 'three modes|all three current' .opencode/skills/cli-external-orchestration/SKILL.md
rg -n 'All four|None of the four' .opencode/skills/cli-external-orchestration/mode-registry.json
rg -c '"workflowMode"' .opencode/skills/cli-external-orchestration/mode-registry.json   # 5
```

**Blast radius:** low — prose only; routing reads `modes[]`, not the description text. A human auditor reading §2/§4 or the registry description is misled about mode count. The two newest modes (`cli-cursor`, `cli-devin`) are the ones the stale prose silently drops.

---

### F2 — CAT-5: mcp-tooling/mode-registry.json transport description omits mcp-refero and mcp-mobbin; version field lags SKILL.md/changelog

**Path:** `.opencode/skills/mcp-tooling/mode-registry.json`

**Evidence:**
- `mode-registry.json:8` — `packetKind` description: "'transport' for **mcp-figma**, which bridges to Figma Desktop rather than performing design judgment or mutating this workspace." — names only one of three transports
- Contradicted by the same file's `extensions.transport-axis.transports` (`mode-registry.json:20-24`) which correctly lists all three: `mcp-figma`, `mcp-refero`, `mcp-mobbin`
- `mode-registry.json:3` — `"version": "1.0.0.0"` vs `SKILL.md:5` `version: 1.3.0.0` and `changelog/v1.3.0.0.md` (latest). `hub-router.json:3` is `"1.1.0.0"`. Three metadata files carry three different version strings; the registry's is the most stale.

**Verify:**
```bash
rg -n '"version"|transport.*for mcp-figma' .opencode/skills/mcp-tooling/mode-registry.json
rg -n 'version:' .opencode/skills/mcp-tooling/SKILL.md
ls .opencode/skills/mcp-tooling/changelog/
```

**Blast radius:** low — the `extensions` block and `modes[]` are correct, so routing is unaffected. The discriminator description is the field a reader consults to understand the `packetKind` axis, so the omission is a documentation contract drift, not a runtime defect.

---

### F3 — CAT-5: cli-opencode/scripts/hooks/README.md documents the codex/ sibling but omits the live devin/ hook subdir

**Path:** `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md` (vs. `scripts/hooks/devin/` on disk)

**Evidence:**
- `hooks/README.md:53-60` §3 DIRECTORY TREE lists only `dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, and `codex/` — no `devin/`
- `hooks/README.md:64-70` §4 KEY FILES and `:117-122` §6 ENTRYPOINTS likewise omit `devin/`
- `rg -n 'devin/' hooks/README.md` → no matches
- Yet `scripts/hooks/devin/` ships `README.md`, `dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs` (confirmed on disk)
- `scripts/hooks/devin/README.md:25` states "Wired into `.devin/hooks.v1.json` on the `PreToolUse` and `PostToolUse` events for the `^exec$` matcher" and `:14` "STATUS: LIVE"

**Verify:**
```bash
ls .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/devin/
rg -n 'devin/' .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md   # 0 matches
rg -n 'codex/' .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md   # documented
```

**Blast radius:** low — `devin/` carries its own README, so the adapters are documented; the *parent* README's tree/entrypoints are simply incomplete. A reader relying on the parent README for the hook inventory misses the Devin runtime adapters.

---

### F4 — CAT-5: cli-devin/manual-testing-playbook/ is advertised in the hub layout but ships only a .gitkeep and is unreferenced by cli-devin/SKILL.md

**Path:** `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/`

**Evidence:**
- Hub `SKILL.md:119-125` §3 Layout lists `manual-testing-playbook/` under `cli-devin/`
- The directory contains exactly one file: `manual-testing-playbook/.gitkeep` (no `.md` content)
- `rg -n 'manual-testing-playbook' cli-devin/SKILL.md` → no matches (cli-devin's own SKILL.md never references it)
- All four sibling packets ship full playbooks: `cli-claude-code/manual-testing-playbook/manual-testing-playbook.md`, `cli-codex/.../manual-testing-playbook.md`, `cli-cursor/.../manual-testing-playbook.md`, `cli-opencode/.../manual-testing-playbook.md` (each with many scenario `.md` files)

**Verify:**
```bash
ls -la .opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/
rg -n 'manual-testing-playbook' .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md   # 0 matches
ls .opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/*.md            # sibling has content
```

**Blast radius:** low — empty stub, no routing depends on it. The drift is between the hub layout (which implies a populated playbook) and the shipped state (an empty placeholder). The cli-devin playbook was scoped under spec `029-cli-devin-revival/006-devin-manual-testing-playbook` but no content shipped.

---

### F5 — CAT-3: mcp-tooling/benchmark/.gitkeep is redundant — the directory has substantial content

**Path:** `.opencode/skills/mcp-tooling/benchmark/.gitkeep`

**Evidence:**
- `benchmark/.gitkeep` exists on disk
- `benchmark/` already contains `README.md`, `baseline/` (report pair), `after-routing-remediation/` (report pair), and `compiled-routing/` (3 dated run folders) — confirmed via tree listing
- `.gitkeep` is only needed to keep an *empty* directory in git; with content present it is stray residue

**Verify:**
```bash
ls -la .opencode/skills/mcp-tooling/benchmark/
find .opencode/skills/mcp-tooling/benchmark -type f | head -20
```

**Blast radius:** negligible — a stray keepfile. (Note: the cli-external-orchestration counterpart `.gitkeep` was already removed in the working tree — `D .../cli-external-orchestration/benchmark/.gitkeep` in git status — so this is the remaining instance.)

---

### F6 — CAT-5: both hub SKILL.md §3 Layout diagrams omit live contract files that exist on disk and are referenced elsewhere

**Path:** `.opencode/skills/cli-external-orchestration/SKILL.md`, `.opencode/skills/mcp-tooling/SKILL.md`

**Evidence:**
- cli `SKILL.md:80-126` layout tree omits `shared/`, `feature-catalog/`, `leaf-manifest.json`
- mcp `SKILL.md:79-119` layout tree omits `shared/`, `feature-catalog/`, `leaf-manifest.json`
- All three exist on disk at both hub roots (confirmed via `ls`)
- `shared/references/smart-routing.md` is referenced by `hub-router.json:20` `defaultResource` in **both** hubs (`cli hub-router.json:19-22`, `mcp hub-router.json:20-23`)
- `leaf-manifest.json` is consumed by `.opencode/commands/doctor/scripts/parent-skill-check.cjs:224,1063,1065` (and has a test file `tests/parent-skill-check-leaf-manifest.test.cjs`)
- `feature-catalog/` exists at both hub roots and is a repo-wide convention (3900+ referencing files)

**Verify:**
```bash
ls -d .opencode/skills/cli-external-orchestration/{shared,feature-catalog,leaf-manifest.json}
ls -d .opencode/skills/mcp-tooling/{shared,feature-catalog,leaf-manifest.json}
rg -n 'shared/references/smart-routing.md' .opencode/skills/cli-external-orchestration/hub-router.json .opencode/skills/mcp-tooling/hub-router.json
rg -n 'leaf-manifest' .opencode/commands/doctor/scripts/parent-skill-check.cjs | head
```

**Blast radius:** low — the files are correctly placed and live; only the layout *diagram* is incomplete. A reader using §3 as the authoritative inventory would not know `shared/`, `feature-catalog/`, or `leaf-manifest.json` belong to the hub.

---

## Categories with no confirmed findings in this focus

- **CAT-1 (dead code):** No unreferenced symbol/script/flag found. `cli-opencode/scripts/lib/*` is imported by the hooks and covered by tests (`hooks/README.md:131-132`); `scripts/hooks/{codex,devin}/*` are wired into runtime hook configs per their READMEs; `leaf-manifest.json` is consumed by the doctor command; `discovery-fixture-2026-07-16.json` is referenced by `mcp-refero/references/tool-surface.md:115` and `mcp-wiring.md:17` (not just leaf-manifest). No packet-local `graph-metadata.json` files exist (the hub NEVER-rule is honored).
- **CAT-2 (legacy/superseded with live successor):** No file pair found where a live successor already exists. The `cli-devin` empty playbook (F4) has no successor — it is an unwritten stub, reported as CAT-5.
- **CAT-3 (backup/scratch residue):** Only F5 (the redundant `.gitkeep`). No `.bak`/`.old`/`.orig`/`-copy`/`.tmp` files exist in either hub (`find ... -name '*.bak' -o -name '*.old' ...` → none). The dated `benchmark/compiled-routing/<run-label>/` folders are **intentional durable archives** per both `benchmark/README.md` §5 ("a run never overwrites another ... additive sibling folder"), not scratch residue.
- **CAT-4 (misplaced files):** None. `shared/`, `feature-catalog/`, `leaf-manifest.json` are legitimately placed at hub root (referenced by `hub-router.json`/doctor); their omission from the layout *diagram* is reported as F6 (CAT-5), not misplacement.
- **CAT-6 (over-engineering):** None confirmed within this focus. The `cli-opencode/scripts/hooks/{codex,devin}/` sibling adapters share one core in `lib/` (per `hooks/README.md:46` "Dependency direction: hooks/ ───▶ ../lib/ (never the reverse)") — that is deduplication, not over-engineering.

---

**Summary:** 6 findings, all low blast radius. Five are CAT-5 documentation/layout contract drifts (F1, F2, F3, F4, F6) and one is a CAT-3 stray keepfile (F5). No dead code, no layering violations, no backup residue, no over-engineering found within the two hubs. Remediation is a separate approved phase — no files were modified.
