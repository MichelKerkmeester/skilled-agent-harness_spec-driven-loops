# 017 ↔ v4 Reconciliation Inventory

> Where concurrent v4 work has moved **ahead of** the 017 kebab-naming plan, and what the plan
> must drop / re-ground / add before the migration executes. Read-only analysis — no files were
> renamed by producing this.

**Provenance**
- Authoring base (what the 017 specs grounded on): `428dfc2c84` (the structure scaffold).
- Original-pass v4 tip: `099fe25676`. Method: Claude git-delta analysis + GPT-5.6-SOL (xhigh, fast) exhaustive cross-reference, 2026-07-15.
- Delta measured: `git diff --name-status -M 428dfc2c84..099fe25676` over the skill/command/agent/runtime surface = **222 paths: 66 R + 110 M + 46 A + 0 D**.
- **Refresh (this pass):** current v4 tip `65620f2fe6`; branch HEAD `9f94825543` (= v4 + 017 specs + reconciliation). Re-scanned `099fe25676..65620f2fe6` (3 concurrent commits). See the Refresh section below.

## Refresh — 2026-07-15 (v4 `099fe25676` → `65620f2fe6`; reconciliation actions APPLIED)

**The reconciliation actions in this inventory are now APPLIED** — commit `9f94825543` on branch
`sk-doc/0042-017-authoring` (rebased onto v4 `65620f2fe6`, ff-ready). Applied to the *017 spec docs*
(the migration itself is still unexecuted): sk-git `001-003` → verify-only + `005` rebaseline; `006`
BASE re-pin + `.codex/prompts` surface + pending/already-applied dispositions; `004`-guard `.codex/`
exemption; `007/001`-strays `.opencode/bin` family; `013/008`-loose-command-ids `.codex/prompts`
mirror; `008/008/004`-scripts-tree producer note; cli-ext `007` real baselines. All 11 touched nodes
+ 7 affected parents validate at 0 errors.

**Re-scan of the 3 concurrent commits since the original endpoint** (`099fe25676..65620f2fe6`):
- 🟡 **NEW — `sk-doc/create-benchmark/conformance_benchmark` (5 snake files)** added by `65620f2fe6`
  *after* the 017 census. This is the one change that means naming work must be **extended** — see the
  new NEW-UNCOVERED subsection and checklist row for `007-create-benchmark`.
- ⚪ `e3e66e6fd6` "renumber sk-git specs 000-006→007-014" — **naming-neutral**: renames only the
  *number prefixes* of `.opencode/specs/sk-git/**` folders (still kebab); no skill-surface name change.
- ⚪ `87b7cf252b` + the 066 portion of `65620f2fe6` — **naming-neutral**: `system-deep-loop/066-*`
  spec-packet docs on kebab-prefixed phase folders; not a rename surface.

## Bottom line

**The fast-forward merge is safe — there is no file to "override."** Verified: `099fe25676` is an
ancestor of HEAD `a316f4490e`; `git diff 099fe25676..HEAD` = 1,241 paths, **all** under
`.opencode/specs/sk-doc/017-hyphen-naming-convention/`; intersection with the 222-path v4 surface
delta = **zero**. The reconciliation is therefore about **stale *plan content*** (the 017 specs
describe a surface v4 has partly changed), **not** git collisions. "Drop old / adopt v4's newest"
applies to the 017 plan's assumptions, not to the merge.

## Summary

| Surface | Category | Reconciliation action |
|---|---|---|
| **sk-git** | 🔴 SUPERSEDED | v4 already ran the 66 renames. Convert `012-sk-git/{001-references,002-assets,003-manual-testing-playbook}` to **verify-only**; adopt v4's kebab tree as baseline. Parent NOT done — see nuances. |
| **.codex/prompts (37)** | 🟡 NEW-UNCOVERED | Whole generated surface absent from 017. Add to `006-inventory-and-frozen-map`; extend guard + `013-commands`. |
| **.opencode/bin (6)** | 🟡 NEW-UNCOVERED | New wrapper/test family → add to `007/001-root-and-opencode-infra-strays`. |
| **cli-external-orchestration** | 🟡 NEW-UNCOVERED | New changelog baselines (Claude Code `1.3.0.0`, Codex `1.7.1.0`) → fix `008/005/007-changelog-verify`. |
| **system-spec-kit** | 🟡 NEW-UNCOVERED | New `scripts/codex/sync-prompts.cjs` producer → add to `008/008/004-scripts-tree`; re-read `.codex/hooks.json` in `…/003-mcp-server-consumer-rewrites`. |
| **sk-doc/create-benchmark (conformance)** | 🟡 NEW-UNCOVERED *(refresh)* | `65620f2fe6` added `conformance_benchmark/` (5 snake files) after the census → extend `008/003/003/007-create-benchmark` rename map. |
| **sk-doc (22 M), commands (26 M), system-deep-loop (17 M), sk-design (8 M), mcp-tooling (4 M), sk-code (3 M), sk-prompt (3 M), system-code-graph (1 M), mcp-code-mode (1 M)** | 🟠 STALE-GROUNDING | Content mods only — **no renames**. Re-ground each phase's path-consumer/file lists against v4's current content; do **not** rewrite the rename targets. |
| **system-skill-advisor, agents** | 🟢 CLEAN | No name adds/renames. Existing plans (incl. agents verify-only) still fit; re-pin evidence SHA. |
| **Bulk: system-spec-kit (829 snake), sk-code (282), mcp-tooling (198)…** | 🟢 CLEAN | Names untouched by v4 — 017's migration for these is fully valid and still needed. |

## 🔴 SUPERSEDED — sk-git (the one real "already-done" case)

v4 committed the full kebab migration (the "hyphen-case pilot", now authoritative per `AGENTS.md`):
- **9 references** `commit_workflows.md`, `continuous_integration.md`, `finish_workflows.md`, `github_mcp_integration.md`, `gitkraken_mcp_integration.md`, `large_reorg_playbook.md`, `quick_reference.md`, `shared_patterns.md`, `worktree_workflows.md` → kebab.
- **3 assets** `commit_message_template.md`, `pr_template.md`, `worktree_checklist.md` → kebab.
- **12 feature-catalog** `feature_catalog/` → `feature-catalog/` (category + file names).
- **42 manual-playbook** `manual_testing_playbook/` → `manual-testing-playbook/` (root index + 41 scenarios across 7 categories).

Current sk-git trees contain **zero** underscore-bearing paths.

**Actions** (do NOT reverse — `AGENTS.md` forbids it):
- Convert leaves `001-references`, `002-assets`, `003-manual-testing-playbook` → **verify-only** against v4's targets; drop all rename ops.
- **Parent is NOT done.** `004-benchmark` is still actionable: `benchmark/live_glm_5.2_high/` and `benchmark/live_kimi_2.7/` remain snake_case and are explicitly planned for rename. `006-skill-gate` cannot pass until 004 runs.
- Re-ground `005-changelog-verify`: it expects sk-git `1.3.2.0` as a *future* entry, but v4 already shipped `1.3.2.0` (and `1.3.1.0`).
- The migrated `feature-catalog/` has no matching 017 leaf (017 excluded it). Add it as already-compliant verification evidence, not rename work.

## 🟡 NEW-UNCOVERED

### .codex/prompts — a new 37-file generated surface
Absent from 017's exact-path inventory. **35 are already kebab; 2 are new snake_case** (see regressions below). SOL found the producer: **`system-spec-kit/scripts/codex/sync-prompts.cjs`** flattens `.opencode/commands` directory separators into filenames but **preserves the source basenames' underscores**. So `.codex/prompts/*` is downstream of `.opencode/commands/*`.
- Add the surface to `006-inventory-and-frozen-map`.
- Add its producer/output contract to `008/008-system-spec-kit/004-scripts-tree`.
- Extend `013-commands/{008-loose-command-ids, 009-command-assets, 010-commands-gate}` to cover generated mirrors.
- Extend `004-no-new-snake-guard` to scan or explicitly classify this generated output root.

### .opencode/bin — new wrapper/test family
Modified `README.md`, `install-codex-hooks.mjs`, `worktree-reaper.sh`, `worktree-session.sh`, `tests/worktree-reaper.test.sh`; **added** `tests/worktree-session.test.sh` (already kebab). Add the six-path family to `007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays` (the new test path appears nowhere in 017).

### cli-external-orchestration — new changelog baselines
Added `cli-claude-code/changelog/v1.3.0.0.md` and `cli-codex/changelog/v1.7.1.0.md` (both compliant). `008/005/007-changelog-verify` must use the **actual** baselines (Claude Code `1.3.0.0`, Codex `1.7.1.0`), not an unspecified future entry.

### system-spec-kit — new producer + live consumer
Added `scripts/codex/sync-prompts.cjs` (kebab); `.codex/hooks.json` still carries live `system-spec-kit/mcp_server/...` paths → re-read it in `008/008/003-mcp-server-consumer-rewrites`.

### sk-doc/create-benchmark — new `conformance_benchmark` family (post-census, refresh finding)
Commit `65620f2fe6` added a 5th benchmark taxonomy under `sk-doc/create-benchmark/`, all snake_case:
- `assets/conformance_benchmark/conformance_benchmark_{contract,fixture_manifest,lane_config,readme}_template.md`
- `references/conformance_benchmark/conformance_benchmark_authoring_guide.md`

The 017 phase `008/003-sk-doc/003-create-packets/007-create-benchmark` (authored 2026-07-14) enumerates
taxonomies **by name** — `behavior_benchmark`, `model_benchmark`, `skill_benchmark`, `agent_improvement`,
`shared` — and **does not list `conformance_benchmark`**. Its rename map therefore
misses these 5 paths. **Action:** extend that phase's In-Scope + Files-to-Change to add the
`conformance_benchmark/` directory, its 4 asset templates, and its 1 reference guide (kebab targets:
`conformance-benchmark/conformance-benchmark-{contract,fixture-manifest,lane-config,readme}-template.md`,
`conformance-benchmark-authoring-guide.md`). Because the phase enumerates by-name rather than by-sweep,
also re-verify the **full 21-file create-benchmark snake surface** (7 families on v4) against the phase
manifest so no other later-added family is missed.

## 🟠 STALE-GROUNDING (content mods, no renames — re-ground, don't rewrite)

Every mod below changed **content**, not filenames, so the 017 rename targets stay valid; only the
per-phase path-consumer/file lists must be re-read from v4's current versions.

- **sk-doc (22 M):** hub `SKILL.md` + `shared/scripts/validate_document.py`; create-benchmark cluster (README/SKILL + `assets/behavior_benchmark/*_template.md`, model/skill benchmark templates, `references/model_benchmark/*`, `references/skill_benchmark/*`, `changelog/v1.3.0.0.md`); create-{agent,changelog,diff,feature-catalog,flowchart,manual-testing-playbook,quality-control,readme,skill} `SKILL.md`; `create-skill/scripts/package_skill.py`. Re-ground `008/003` leaves 001–003, 005–011 + gate. **Also** program-wide `002-root-name-consumer-migration` (both `validate_document.py` and `package_skill.py` are named consumers there).
- **commands (26 M):** create ×10, design ×5, doctor ×3, memory ×4, `prompt-improve.md`, speckit ×3. Re-ground `013-commands` leaves 001, 003–005, 007, 009, 010 (filenames compliant; bodies are consumers of the underscore assets those leaves rename).
- **system-deep-loop (17 M):** root + `deep-{ai-council,alignment,improvement,research,review}` SKILL.md; `behavior_benchmark/*` + DAB-005..008 scenarios; `assets/skill_benchmark/fixtures/sk_design/*`; `scripts/skill-benchmark/*`; `shared/behavior-benchmark/framework.md`. Re-ground leaves 001, 003–007, 011. Treat old numeric inventories as stale until recounted. (Runtime leaf 002 had no v4 record.)
- **sk-design (8 M + 1 A):** hub + 6 mode SKILL.md + `shared/scripts/design-command-surface-check.mjs`; added `…-check.test.mjs` (kebab). Re-ground leaves 001–007 + gate; add the test as a compliant fixture.
- **mcp-tooling (4 M):** hub + 3 mode SKILL.md. Re-ground leaves 001–004 + gate.
- **sk-code (3 M):** hub + code-quality + code-review SKILL.md. Re-ground `008/001` leaves 001, 003, 004 + gate.
- **sk-prompt (3 M):** hub + prompt-improve + prompt-models SKILL.md. Re-ground leaves 001–003 + gate.
- **system-code-graph (1 M), mcp-code-mode (1 M):** root `SKILL.md` path-consumer only. Re-ground the consumer inventory before the leaves.
- **Runtime/root (3 M):** `.claude/settings.json` (adds `install-codex-hooks.mjs` path → ties to the `.opencode/bin` closure), `.codex/hooks.json` (live `mcp_server` paths), `AGENTS.md` (establishes the sk-git pilot as authoritative — supersedes any 017 instruction that would replay/reverse those moves).

## 🟢 CLEAN
`system-skill-advisor` (0 delta), `agents` (6 content mods, 0 name changes — verify-only design holds; re-pin evidence SHA), and the untouched snake_case bulk (system-spec-kit 829, sk-code 282, mcp-tooling 198, sk-design 269, cli-ext 137, sk-doc 121, commands 111, skill-advisor 90, code-graph 55, sk-prompt 48, mcp-code-mode 32). These phases keep their existing rename plans.

## Structural fix — the frozen map's base assumption is now false

`006-inventory-and-frozen-map` requires *every rename source to exist and every target to be absent*.
For the **66 sk-git mappings that is false** (sources gone, targets exist). The inventory + hash must
be **re-pinned against the post-v4 surface**, not `428dfc2c84`. This is the single highest-leverage
correction: it changes the base SHA the whole program proves itself against.

## New snake_case v4 introduced (regressions vs the kebab goal)

Exactly two added paths carry underscores — both **generated** by `sync-prompts.cjs`:
- `.codex/prompts/agent_router.md`
- `.codex/prompts/goal_opencode.md`

**Classify, do not blind-rename.** `013-commands/008-loose-command-ids` today covers only their
`.opencode/commands/` sources. Whether the `.codex/prompts` copies are renamed or retained as
generated/tool-mandated names is **UNKNOWN** until the Codex prompt loader and the public command-ID
contract are checked — 017 must give them an explicit disposition, and the fix likely belongs at the
**source** (`.opencode/commands/agent_router.md`, `goal_opencode.md`) + regenerate.

## Per-phase action checklist (for the migration phase)

> **Spec-doc reconciliation for the rows below (except the create-benchmark refresh row) was APPLIED in
> commit `9f94825543`.** The rows still describe what the *migration executor* must do at run time; the
> re-pin SHA is now the current tip `65620f2fe6`, not `099fe25676`.

| 017 phase | Action |
|---|---|
| `006-inventory-and-frozen-map` | Re-pin/re-hash against `65620f2fe6` (current tip), not `428dfc2c84`; add `.codex/prompts` surface. |
| `008/003/003/007-create-benchmark` *(refresh)* | Extend the rename map to add the `conformance_benchmark/` family (5 snake files) from `65620f2fe6`; re-verify all 21 create-benchmark snake paths against the manifest. |
| `002-root-name-consumer-migration` | Re-ground: `validate_document.py` + `package_skill.py` bodies changed. |
| `004-no-new-snake-guard` | Extend scan to the `.codex/prompts` generated output root. |
| `007/001-root-and-opencode-infra-strays` | Add the 6-path `.opencode/bin` wrapper/test family. |
| `008/012-sk-git/001,002,003` | → verify-only (adopt v4 kebab); `004-benchmark` stays active; fix `005-changelog-verify` baseline; add `feature-catalog` as compliant evidence. |
| `008/008-system-spec-kit/004-scripts-tree` | Add `sync-prompts.cjs` as producer of `.codex/prompts`. |
| `008/008/003-mcp-server-consumer-rewrites` | Re-read `.codex/hooks.json`. |
| `008/005/007-changelog-verify` (cli-ext) | Use real baselines: Claude Code `1.3.0.0`, Codex `1.7.1.0`. |
| `013-commands/{008,009,010}` | Cover the generated `.codex/prompts` mirror + the 2 snake regressions' disposition. |
| `008/{001,002,003,004,006,007,010,011}` skill phases | Light re-ground against v4 content mods (no rename-target changes). |

## Open / UNKNOWN
- Disposition of `.codex/prompts/agent_router.md` + `goal_opencode.md`: generated-and-follow-source, or tool-mandated. Confirm against the Codex prompt loader + command-ID contract.
- Whether any of the 110 content mods silently changed a file *set* a phase enumerates (spot-checked, none found, but not exhaustively diffed line-by-line).
