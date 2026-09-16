---
title: "Deep Research Synthesis: What the .opencode → .skilled Source-Root Move Would Change, and What Would Break"
description: "Five-iteration inventory and blocker list for rooting the shared AI asset library at .skilled/ instead of .opencode/: corrected census (174 external links, 17,766 tracked files), seven runtime contracts, derived-state regeneration map, gate ordering constraints, external-reference table, and the large-reorg mechanics the repo already documents. stopReason: maxIterationsReached."
trigger_phrases:
  - "skilled source-root migration research"
  - "opencode path inventory"
  - "source root move blockers"
  - "runtime symlink retarget research"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Deep Research Synthesis: What the .opencode → .skilled Source-Root Move Would Change, and What Would Break

> **Provenance.** Five iterations completed at the cap (stopPolicy `max-iterations`, `maxIterations` 5; no early convergence claimed — `convergenceThreshold` 3 was configured as telemetry-only). Executor: cli-devin, model deepseek-v4-1-flash-max, lineage `deepseek` (`fanout-deepseek-1789548196115-9qchey`). Every iteration ran inline in the lineage session; per-iteration evidence is `iterations/iteration-001.md`…`iteration-005.md`, structured deltas are `deltas/iter-001.jsonl`…`iter-005.jsonl`, and the reducer state is `findings-registry.json`. **Terminal stop reason: `maxIterationsReached`.**

---

## 1. WHAT THIS DELIVERS

The question was: *if `.skilled/` becomes the directory holding the real skill, command, agent, hook, plugin, bin and runtime files, and every runtime directory — `.opencode/` included — becomes a consumer linking into it, what would actually have to change, and what would break?*

The answer is an inventory with four classes — `mechanical`, `regenerate`, `manual`, `blocker` — over eight surfaces, plus the correction ledger below. It deliberately contains no cutover sequence; that is phase 002's work. What follows is sized to be *used* by that design.

**The one-sentence finding:** the move is mechanically possible — the repository already documents its own large-reorg procedure and has run one — but it is gated by three constraints that no scripted rewrite satisfies alone: (1) the gates that must validate the move are installed from the very path being moved, (2) four live references outside the repository silently keep pointing at the old path, and (3) a set of runtime behaviors (Devin's native skill scan, opencode's plugin glob, a symlinked `.opencode/`) are UNKNOWN and decide whether "`.opencode/` as a consumer" is viable at all.

---

## 2. CORRECTION LEDGER — the brief's starting map, corrected

The brief said "do not re-count; extend and correct." Corrections, all measured on this worktree:

| Brief's claim | Measured | Where |
|---|---|---|
| 200 symlinks point into `.opencode/` | **174** resolve into this repo's `.opencode/`; the brief's own breakdown sums to 177, and `.pytest_cache/` does not exist in this worktree; `specs/` has 3 links, not 4 (the 4th points into a different checkout) | iteration 1, F1.1 |
| `.opencode/` itself: 1 symlink | **208** internal symlinks excluding `node_modules` (203 in-tree, 1 out, 4 broken) — they travel with the directory | iteration 1, F1.1/F1.7 |
| `specs/` (4) | 3 into this repo; the 4th names `.opencode` but resolves to `/Users/…/048-crawlable-commit-history/…` and is broken today | iteration 1, F1.1 |
| "REPO RULES.md names the path" | `REPO RULES.md` contains **0** `.opencode` references; all twelve `repo-rules/*.md` also contain 0 | iteration 5, F5.8 |
| ~3,000 markdown files | **3,035** excluding `specs/` and `node_modules` — confirmed; 27,696 including `specs/` | iteration 5, F5.8 |
| 4 dist trees as build outputs | all four have `tracked=0` — they are **gitignored, untracked** build outputs; `git mv` carries none of them | iteration 5, F5.4 |
| 20 CI workflows | 19 workflow YAML files + a README reference `.opencode` | iteration 4, F4.4 |
| ~/.codex/config.toml "is one" external reference | it is one of **four live** `.opencode`-naming external references (the other three: the git-hook symlinks, `~/.codex/hooks.json`, `~/.hermes/config.yaml`), and it also carries a trust entry keyed on `…/Public/.opencode` itself | iteration 4, F4.7 |

Confirmed from the brief as stated: 4,258 files / 85,769 occurrences (not re-counted, consistent with what iteration 3 found in the data-artifact classes); 3,328 repo-wide symlinks (the 208 + 174 + out-of-scope links are consistent with it); `.skilled/` placeholder; `barter/` out of scope.

---

## 3. THE EIGHT SURFACES

### 3.1 Symlink topology — `mechanical`

174 external links (56 `.claude`, 53 `.cursor`, 22 `.devin`, 19 `.pi`, 19 `.codex`, 2 `.hermes`, 3 `specs` archive), **all relative**, in five shapes: whole-dir links (`.claude/skills`, `.pi/skills`, `.hermes/agents`), filtered per-file commands (33 `.claude` + 33 `.cursor`), hook mirrors (21/18/18/21, discovery-only), per-extension links (`.pi/extensions` 17), nested agent links (`.devin/agents/<n>/AGENT.md`). The `.claude/skills`-link vs `.hermes/skills`-real-copy asymmetry is **deliberate**: Hermes's static security scanner quarantines symlinked skill directories (documented live probe: whole-tree link = ten minutes per session and every hub quarantined; the single `cli-hermes` link quarantined on 37 findings), so Hermes receives generated markdown-only copies [SOURCE: .hermes/SYNC.md:16,24]. `.claude/agents/` is a real fork because the agent dialect is lossy in both directions [SOURCE: .claude/SYNC.md:16,81]; Codex and Pi agent trees are generated dialect translations [SOURCE: .codex/SYNC.md:16,28; .pi/SYNC.md:16,26]. Eight links are broken **today** and must be excluded from any post-move "nothing dangles" gate [SOURCE: iteration-001.md F1.7]. The SYNC.md manifests themselves already drift from disk and cannot seed the retarget [SOURCE: iteration-001.md F1.8].

### 3.2 Runtime resolution contracts — `manual` (accept the constraint)

Seven runtimes, seven contracts, every one keyed to the runtime's own directory name; no repo-visible configuration key relocates any of them (two manifests record live probes where a *documented* alternative path failed) [SOURCE: iteration-002.md F2.1]. The contracts: opencode reads `.opencode/{skills,commands,agents,plugins}` plus the MCP registration in root `opencode.json:15`; Claude reads `.claude/{skills,commands,agents,settings.json}`; Codex reads generated `.codex/{prompts,agents}` plus outbound `~/.codex/hooks.json`; Cursor reads `.cursor/{commands,agents→.claude,rules,hooks.json}`; Devin reads `.devin/agents/<name>/AGENT.md` plus a native `.opencode/skills` scan; Pi reads `.pi/{skills,prompts,extensions}`; Hermes reads `.hermes/{skills,plugins}` behind a trust grant. Generated stubs and TOMLs are **runtime-consumed text** naming `.opencode` paths — regenerate, not rewrite [SOURCE: .codex/prompts/create-agent.md; .pi/prompts/create-agent.md; .codex/agents/context.toml:17,61,418].

### 3.3 What `.opencode/` must keep — `manual` / `blocker-risk` (the q3 partial)

Seven MCP registrations carry the same relative `.opencode/bin/mcp-code-mode-launcher.cjs` string (root `opencode.json:15`, `.codex/config.toml:13`, `.pi/mcp.json:5`, `.devin/mcp_config.json:6`, `.cursor/mcp.json:6`, `.claude/mcp.json:6`, and **`~/.hermes/config.yaml:17` outside the repo**), and the launcher itself computes the repo root from its own location then appends the literal `.opencode/skills/mcp-code-mode/mcp-server` and requires a built `dist/index.js` [SOURCE: .opencode/bin/mcp-code-mode-launcher.cjs:19-28]. A symlink at `.opencode/` satisfies all seven; deleting `.opencode/` breaks all seven. opencode's five reads are all inside `.opencode/` [SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/README.md:47,135; .opencode/plugins/README.md:16]. Whether opencode's flat plugin glob follows a symlinked directory is UNKNOWN (§6).

### 3.4 Derived and generated state — `regenerate` + `mechanical`

The regenerate set, each with a named command: **trigger index** `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` (1,809 `.opencode` refs; `generate-trigger-index.mjs`) [SOURCE: iteration-003.md F3.1]; **compiled routing closure** `.opencode/bin/lib/compiled-routing/**` with `serving-closure.manifest.json` storing both `generatedFrom` and `runtimeRoot` (rebuild via `compiled-route-sync.cjs`; its `--verify` mode already rehearses the spec-tree leg of a relocation) [SOURCE: .opencode/bin/compiled-route-sync.cjs:20-24,39-48]; **four `dist/` trees** (90 compiled files carry `.opencode`; `npm run build` per package, shared before dependents; all four untracked) [SOURCE: iteration-003.md F3.4 + iteration-005.md F5.4]; **spec packet metadata** (`node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <packet> --apply`) [SOURCE: .opencode/scripts/git-hooks/pre-commit:461,503]. The **build attestations** are hash-only and path-independent — they survive a pure move and are invalidated by the rebuild, not the rename [SOURCE: iteration-003.md F3.5]. The rewrite set: **295 code files** constructing `.opencode` paths at runtime, including root-finder probes that throw "repository root could not be resolved" when `.opencode/skills` is absent — the single most ordering-sensitive shape in the migration [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:36-46; .opencode/bin/lib/compiled-route-manifest.cjs:503; .opencode/bin/lib/launcher-ipc-bridge.cjs:98]. Clean (no work): leaf manifests and every `description.json` [SOURCE: iteration-003.md F3.8]. The **absolute-path class** — 517 files, 264 of them JSON — fails differently from the relative class: after the move it still resolves, at the *old* checkout, silently [SOURCE: iteration-003.md F3.9].

### 3.5 The repository's own gates — `blocker` (as written)

Two pre-commit gates would reject a rename commit as written: **mirror parity**, whose `MIRROR_SOURCES` array matches the old side of the rename and then runs six `--check` scripts against moved sources (only `SPECKIT_SKIP_MIRROR_PARITY=1` escapes) [SOURCE: .opencode/scripts/git-hooks/pre-commit:120,133-138,178], and **agent mirror-sync**, whose staged-file filter matches `.opencode/agents/` and which has **no bypass flag** [SOURCE: pre-commit:92; .opencode/scripts/git-hooks/README.md]. Two more silently disengage instead: **comment hygiene** skips entirely if `.opencode/skills/sk-code` is gone [SOURCE: pre-commit:44,49-51], and the **hook-flags resolver** fails open so every per-concern kill-switch stops working [SOURCE: pre-commit:17-28]. The gates are installed as seven symlinks in `~/.config/git/hooks/` pointing into **the main checkout's** `.opencode/scripts/git-hooks/*` — moving the main checkout dangles all seven before any gate can run [SOURCE: iteration-004.md F4.3]. CI: 19 workflows keyed to `.opencode/**` path filters; 12 of 19 skip silently when a guard script is missing, so stale guard paths convert blocking checks into green-but-unchecked [SOURCE: iteration-004.md F4.4; .github/workflows/markdown-link-integrity.yml:26-31]. Ordering constraints (not a sequence): external reinstall around the commit; gate constants updated before gates run against moved sources; CI filters in the same commit; two bypass flags exist and only two [SOURCE: iteration-004.md F4.6]. "skilled" is already the release-branch namespace (`skilled/vA.B.C.D`, allowlist `skilled/v4.0.0.0`, workflow triggers `skilled/**`) — a naming decision, not a functional conflict [SOURCE: iteration-004.md F4.5].

### 3.6 References from outside the repository — `manual` (operator steps)

Four live `.opencode`-naming references, none of which moves with `git mv`: the seven git-hook symlinks; `~/.codex/hooks.json` (18 `.opencode` command strings, installed outbound by `install-codex-hooks.mjs`); `~/.hermes/config.yaml`'s `mcp_servers.code_mode` args; and `~/.codex/config.toml`'s `[projects."…/Public/.opencode"]` trust entry [SOURCE: iteration-004.md F4.7]. The surviving class keys on the checkout root instead: `~/.codex` `[projects."…/Public"]` and `[hooks.state.*]`, `~/.hermes` `trusted_project_dirs`, `~/.claude.json`, `~/.pi/agent/*` → `.pi/*` symlinks, `~/.codex/AGENTS.md`. Clean negatives were checked and named (`~/.claude/settings.json`, `~/.config/devin/*`, `~/.claude/CLAUDE.md`, `~/.claude/plugins/`); `~/.zshrc`'s `$HOME/.opencode/bin` entry is stale (directory absent). **No in-repo validator covers this class** — the inventory is the whole safety net [SOURCE: iteration-004.md F4.8].

### 3.7 Migration mechanics — `mechanical` + the repo's own playbook

17,766 tracked files under `.opencode/` (17,360 regular, 198 executable, 208 symlinks) against a `.skilled/` holding one placeholder `.gitkeep` [SOURCE: iteration-005.md F5.1]. The repository already ships the governing runbook — `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md`, "a step-ordered runbook for a large rename/reorg (hundreds-to-thousands of `git mv`)" — whose rules are: `git mv` over raw `mv`+add; **pure renames in a separate commit from content edits**; verify `R`-status before committing; post-merge sweep for zero tracked files under the old prefix; toolchain and memory/vector reindex run on `main` after merge, because "any strict-validate result obtained from inside the worktree is treated as meaningless" [SOURCE: large-reorg-playbook.md:30-36]. Precedent at smaller scale: the v1.3.2.0 rename of 66 files + 13 directories via `git mv`, "history preserved… `git log --follow` continues to work" [SOURCE: .opencode/skills/sk-git/changelog/v1.3.2.0.md:11,27]. Symlinks across the move: 174 dangle at once, 208 travel intact, the one out-link resolves at the same depth; git stores links as blobs and is blind to dangles [SOURCE: iteration-005.md F5.5]. `git mv .opencode .skilled` would **nest** (destination exists); the placeholder's own name — `move-opencode-contents-to-here-and-relative-symlink-back` — states the intended shape [SOURCE: iteration-005.md F5.6]. `git mv` carries none of the nine ignored entries (5 `node_modules`, 4 untracked `dist/` trees, 1 version marker) [SOURCE: iteration-005.md F5.4].

### 3.8 The documentation surface — `mechanical` bulk + `manual` triage

3,035 files outside `specs/`; **816 carry `.opencode` inside fenced code blocks** (runnable instructions — the rewrite-critical set: 111 `SKILL.md`, 217 `references/**`, 47 `commands/**`, 45 `hooks/**`, 36 `agents/**`) and 2,219 have it inline-only [SOURCE: iteration-005.md F5.8]. 100 generated prompt stubs are regenerate-only. Root documents: `README.md` 52, `PUBLIC-RELEASE.md` 33, `AGENTS.md` 9 (its Gate 1 lookup command among them), `CONTRIBUTING.md` 3, `REPO RULES.md` 0. The 1,710 files of manual-testing-playbook/benchmark/changelog material are historical records of runs at the old path — rewriting them falsifies the record; freeze or cosmetic only. The treatment table with counts is iteration-005.md F5.9.

---

## 4. BLOCKER INVENTORY (what cannot be done as proposed, and why)

| # | Blocker | Why it cannot be done as proposed | Class |
|---|---|---|---|
| B1 | The migration commit cannot pass its own pre-commit gates as written | Mirror parity matches the rename's old paths and then reads moved sources; agent mirror-sync has no bypass flag; both are installed from the moved path | blocker |
| B2 | The installed hooks dangle before the gates can run | Seven home-level symlinks point into the main checkout's `.opencode/scripts/git-hooks/*`; `core.hooksPath` is outside the repo; the reinstall tooling is inside the moved tree | blocker |
| B3 | External references cannot be updated by the migration commit | Four live references outside the repo fail silently or semi-silently at different times (hooks: immediately; MCP registrations: first use; trust entry: as a permission prompt) | blocker |
| B4 | `.opencode/` cannot become a pure consumer unless three runtime behaviors hold | opencode's plugin flat glob through a symlinked dir, Devin's native `.opencode/skills` scan through a symlink, and the repo-root finder probes (`.opencode/skills` existence) are each load-bearing and each UNKNOWN-or-probe-only | blocker-risk |
| B5 | A one-commit move contradicts repo doctrine | The large-reorg playbook requires pure renames separated from content edits; this migration has 17.7k files of rename plus 295 code files of content edit | blocker (process) |

Plus the silent-failure list a design must treat as first-class: comment hygiene skipping when `.opencode/skills/sk-code` vanishes; 12 of 19 CI workflows skipping when a guard path is stale; the pre-push skill-change detector (`-- .opencode/skills`) matching nothing after a move; `prepare-commit-msg` silently leaving commits unstamped when the allocator path moves; and the absolute-path data class that never dangles and never warns.

---

## 5. CONTRADICTIONS FOUND (both citations named, neither resolved by preference)

1. **Codex agent wiring.** `cli-codex/README.md:131` states `.codex/config.toml` declares `[agents.<name>]` entries with `config_file` values pointing at `.codex/agents/<name>.toml`; neither the in-repo `.codex/config.toml` nor `~/.codex/config.toml` contains any `[agents.*]` table or `config_file` key (grep count 0). [SOURCE: iteration-002.md F2.8]
2. **`.claude/SYNC.md` vs disk.** The manifest lists `.claude/specs` and `.claude/changelog` whole-dir symlinks and 18 hook links; disk has neither directory and 21 hook links. Same drift for `.cursor` (15 vs 18) and `.codex` (16 vs 18). [SOURCE: iteration-001.md F1.8]
3. **Devin skill discovery.** `.devin/SYNC.md:21,34` documents a native `.opencode/skills` scan; the live Devin session resolved its skills through `.claude/skills/<name>/SKILL.md` (the symlink chain). Both surfaces are real; the manifest does not mention the second. [SOURCE: iteration-002.md F2.5]
4. **`skill-graph.json` fallback.** The advisor database README names a tracked fallback at `../scripts/skill-graph.json`; the file does not exist on disk. [SOURCE: iteration-003.md F3.6]

---

## 6. UNKNOWNS — with what would settle each

| Unknown | Why it matters | What settles it |
|---|---|---|
| Does opencode's plugin flat glob follow a **symlinked** `.opencode/plugins` (or symlinked `.opencode/`)? | Decides whether `.opencode/` can be a symlink consumer at all | A scratch project with `.opencode` symlinked; opencode loads plugins |
| Does Devin's native `.opencode/skills` discovery traverse a symlinked tree? | Devin is the only runtime with **no mirror fallback** for skills | A probe against a symlinked `.opencode`, or the runtime's discovery source |
| What wires the 12 `.codex/agents/*.toml` files? | Determines whether that tree is a live surface or dormant drift-checked output | The installed Codex version's config docs, or a dispatch probe |
| Does git skip or fail on a dangling hook symlink? | Determines whether B2 degrades silently or loudly | A one-line probe in a scratch repository |
| Location and path-content of the global memory/vector databases | The playbook names a post-merge reindex; this packet did not enumerate them | The system-spec-kit memory subsystem's config |
| Exact behavior of the council-graph rebuild | Whether the tracked `.opencode`-prefixed rows are regenerable | The council-graph writer script's usage |
| Whether other `.opencode/skills`-keyed root finders exist beyond the sampled shapes | The 295-file string-literal class was counted, not all classified | A classifier pass over the 295 files |

---

## 7. COMPLETENESS AND CONVERGENCE REPORT

- **Stop reason**: `maxIterationsReached` (cap 5, configured; convergence was telemetry-only).
- **Iterations**: 5/5 · **Questions**: 7 of 8 fully resolved, 1 partial (q3, with its UNKNOWN named) · **Findings**: 43 (8/9/9/8/9) · **Ruled-out directions**: 2 · **Contradictions**: 4 · **Blockers**: 5 · **UNKNOWNs**: 7.
- **newInfoRatio trend**: 1.0 → 0.85 → 0.9 → 0.9 → 0.9 (no convergence claim; the cap governs).
- **Per-iteration evidence**: `iterations/iteration-001.md`…`iteration-005.md`; deltas `deltas/iter-001.jsonl`…`iter-005.jsonl`; registry `findings-registry.json`; state `deep-research-state.jsonl`; dashboard `deep-research-dashboard.md`.
- **Citation discipline**: every finding in the iteration files carries a `file:line` or measured-command citation; claims that could not be cited are recorded as UNKNOWN (§6) rather than softened.

---

## 8. REFERENCES

- Iterations: `iterations/iteration-001.md` (symlinks), `iteration-002.md` (runtime contracts, residual `.opencode/`), `iteration-003.md` (derived state), `iteration-004.md` (gates, external refs), `iteration-005.md` (mechanics, docs).
- Primary in-repo sources: the six `SYNC.md` manifests; `.opencode/scripts/git-hooks/{pre-commit,pre-push,prepare-commit-msg,README.md}`; `.opencode/bin/{mcp-code-mode-launcher.cjs,compiled-route-sync.cjs}`; `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md`; `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`; the 19 `.github/workflows/*.yml`; root `opencode.json`.
- External sources (read-only): `~/.config/git/hooks/`, `~/.codex/{config.toml,hooks.json,AGENTS.md}`, `~/.hermes/config.yaml`, `~/.claude.json`, `~/.pi/agent/`, `~/.zshrc`.
- Research brief: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/001-deep-research/scratch/topic.txt`.
