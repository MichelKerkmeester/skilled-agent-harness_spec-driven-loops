# sk-doc Post-Facade Program Plan

> Single source of truth for the remaining sk-doc hub program so the orchestrating agent forgets nothing.
> Scope authority: spec folder `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent` (in-scope, gate-3 pre-answered — do NOT re-ask).
> Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` · Branch: `system-speckit/028-memory-search-intelligence`.
> Authored: 2026-07-06. This is a PLAN only — nothing here has been executed by the planning pass.

---

## 0. Program in one sentence

Finish the sk-doc parent hub after facade removal: regroup `create-skill` references/assets into a three-way `shared`/`parent_skill`/`skill` layout (R1), bring all 10 sub-skill packets to a uniform contract (inline workflow + creation-guideline reference + initial changelog) (R2/R3), harden and adversarially verify each packet with fresh Opus agents (R4), drive broken links to zero (R5), cleanly resolve the entangled system-spec-kit test files (R6), then land the whole program as one scoped commit pushed to `origin/028` (R7).

---

## 1. Status: Done vs Open

### 1a. Reported DONE (operator narrative — treat as context, VERIFY before building on)

| # | Item | Operator-reported state |
|---|------|-------------------------|
| D1 | **Facade removal** | Hub-root `sk-doc/assets` + `sk-doc/references` deleted; all 43 facade-caused broken links repointed to canonical (child-packet or `shared/`). `parent-skill-check.cjs` passes (0 warnings). NOT committed. |
| D2 | **create-changelog packet** | Built + wired: mode-registry + hub-router + description.json + graph-metadata.json all updated to TEN packets. Verified by Sonnet (3 fidelity defects fixed). |
| D3 | **Concern-#2 references** | Added for `create-command` + `create-flowchart` (they had none); both verified PASS. |
| D4 | **Broken-link cleanup (in progress)** | Repo went 198 → 36 broken. Deterministic drift-fixer (`fix_drift.py`, basename→canonical map) fixed 139 internal links; placeholders re-allowlisted in `check-markdown-links.cjs`. **Remaining 34:** ~21 point at moved/removed `.opencode/specs/**` archives (system-spec-kit playbooks); ~11 other-skill drift (cli-opencode→sk-prompt-models renamed model files, mcp-open-design→sk-design ref, advisor playbook); 2 install-guide-template links. |

### 1b. ⚠️ VERIFICATION-REQUIRED — working-tree divergences observed at plan time

The current checkout **does not reflect D1 or D2**. Before executing anything, the orchestrator MUST reconcile which worktree/branch actually holds the "DONE" work (18 worktrees exist; see `git worktree list`). Do not redo work that lives elsewhere, and do not clobber it.

| Flag | Observation on this checkout (`8ce566304a`, branch 028) | Contradicts |
|------|----------------------------------------------------------|-------------|
| F1 | `sk-doc/assets/`, `sk-doc/references/`, `sk-doc/scripts/` are **real directories, still present** (not deleted, not symlinks). Hub `SKILL.md` §3 still describes them as facade symlinks. | D1 (delete) |
| F2 | **No `create-changelog/` packet exists** anywhere under `sk-doc/` (folder absent; `find` returns nothing). | D2 (built) |
| F3 | `mode-registry.json` contains **nine modes**, zero `create-changelog` occurrences; `hub-router.json` / `description.json` / `graph-metadata.json` do not mention it either. Hub `SKILL.md` says "**nine** workflow packets" in 4 places. | D2 (wired to TEN) |
| F4 | `create-flowchart/SKILL.md` has **no reference mentions and no `references/` dir**; `create-command/SKILL.md` §4 points only at `../shared/references/global/*` (no local `references/`). | D3 (refs added) |
| F5 | Spec `011-create-changelog/spec.md` is titled **"Build-or-fold create-changelog (PROVISIONAL)"** and the changelog template already lives at `shared/assets/changelog_template.md` — consistent with a FOLD outcome, not a built 10th packet. | D2 |

**Reconciliation directive:** Resolve F1–F5 first (locate the branch/worktree with the DONE work, or accept that D1/D2 are still TODO on this tree). The 10-packet requirements below (R2/R3/R4) assume `create-changelog` exists as a real packet; if the build-or-fold ruling was FOLD, adjust the packet count to nine and drop create-changelog from R2/R3/R4 accordingly. **This is a gating decision — escalate to the operator if the ruling is ambiguous.**

### 1c. OPEN requirements (this program)

| ID | Requirement | Blast radius |
|----|-------------|--------------|
| R1 | create-skill references/assets three-way regrouping (structural, path-moving — do EARLY) | High: moves files, breaks paths until repointed |
| R2 | Concern #2 uniform contract across all 10 packets (inline workflow + creation-guideline reference) | Medium: content audit + authoring |
| R3 | Initial-release changelog `changelog/v1.0.0.0.md` in every packet | Low-medium: 10 authored files |
| R4 | Per-packet optimization + fresh-Opus adversarial verification | Medium: 10 verification passes + fixes |
| R5 | Broken links → 0 (or explicitly-flagged genuinely-removed) | Medium: repo-wide, may touch concurrent lanes |
| R6 | Resolve system-spec-kit test entanglement (10 files + failing golden snapshot) | Medium: concurrent-work sensitive |
| R7 | One scoped commit, 0 concurrent-lane leak, push to origin/028 | Low mechanically, high if scope leaks |

---

## 2. Packet inventory (the 10 sub-skills)

Target set is **10** packets. Nine exist on disk today; `create-changelog` is the disputed tenth (see F2/F3/F5).

| # | Packet | On disk? | `references/` today | Has creation-guideline ref? | `changelog/v1.0.0.0.md`? |
|---|--------|----------|---------------------|-----------------------------|--------------------------|
| 1 | `create-skill` | yes | `skill_creation.md` + `skill_creation/` (7 files) | yes (to be regrouped by R1) | no (`.gitkeep` only) |
| 2 | `create-readme` | yes | `readme_creation.md`, `install_guide_creation.md` | yes | no (`.gitkeep` only) |
| 3 | `create-agent` | yes | `agent_creation.md` | yes | no (`.gitkeep` only) |
| 4 | `create-command` | yes | **none** (points to `shared/references/global`) | **GAP — verify/fix in R2** | no (`.gitkeep` only) |
| 5 | `create-feature-catalog` | yes | `feature_catalog_creation.md` | yes | no (`.gitkeep` only) |
| 6 | `create-manual-testing-playbook` | yes | `manual_testing_playbook_creation.md` | yes | no (`.gitkeep` only) |
| 7 | `create-benchmark` | yes | `benchmark_creation.md` | yes | no (`.gitkeep` only) |
| 8 | `create-flowchart` | yes | **none** | **GAP — verify/fix in R2** | no (`.gitkeep` only) |
| 9 | `doc-quality` | yes | `workflows.md`, `optimization.md` | yes | no (`.gitkeep` only) |
| 10 | `create-changelog` | **NO (F2)** | — | — | — |

Shared backbone (consumed by all packets, not a packet): `shared/scripts/`, `shared/references/global/`, `shared/assets/` (holds `changelog_template.md`, `frontmatter_templates.md`, `llmstxt_templates.md`, `template_rules.json`).

---

## 3. Guardrails (apply to every step)

- **Concurrent-lane authorization:** Operator AUTHORIZED touching concurrent lanes (`sk-code`, `sk-design`, `deep-loop`, advisor) **specifically to fix broken links** (R5). For any OTHER change, respect and do not disturb concurrent work.
- **Deterministic moves via scripts, never an LLM:** All `mv`/`cp`/path-repoint operations (R1, R5) run through SCRIPTS (e.g., the existing `fix_drift.py` basename→canonical mapper, or purpose-built move scripts). Never hand an LLM a bulk file-move or link-rewrite job.
- **Authored content via writers + fresh verifiers:** New CONTENT (changelogs, references, SKILL.md rewrites) is authored by GPT-5.5-fast writers and/or verified by fresh Sonnet/Opus agents. R4 verification specifically uses FRESH OPUS agents (one per packet).
- **comment-hygiene [HARD BLOCK]:** Never embed spec paths, packet/phase numbers, or ADR/REQ/task/finding ids in code comments. Keep the durable WHY only. (Applies to any scripts written for R1/R5.)
- **Four Laws:** READ before edit; SCOPE LOCK to this program; VERIFY (link-checker / `parent-skill-check.cjs` / validate.sh) before any completion claim; HALT on path/line mismatch.
- **Registry is source of truth:** Any packet add/remove/rename must update `mode-registry.json` first, then hub-router/description/graph-metadata to match; hub `SKILL.md` narration (packet count) must be reconciled too.

---

## 4. Execution Sequence (dependency-ordered)

> Order is load-bearing: R1 moves paths, so it must precede R2/R3 authoring and R5 link-finalize. Rationale per step below.

```
Step 0  Reconcile working tree (F1–F5)         ── gate: know where DONE work lives; confirm packet count 9 vs 10
Step 1  R1  create-skill regrouping            ── structural moves + repoint (paths stabilize here)
Step 2  R2  Concern-#2 uniform contract        ── audit 10 packets; inline workflow + creation-guideline ref
Step 3  R3  Initial changelogs (v1.0.0.0)      ── one per packet (parallelizable with R2 authoring)
Step 4  R4  Per-packet optimize + fresh-Opus   ── one adversarial Opus verifier per packet; fix findings
Step 5  R5  Broken links → 0                    ── re-run drift-fixer on stabilized paths; fix residual 34
Step 6  R6  Resolve test entanglement          ── snapshot regen or back out; preserve concurrent work
Step 7  R7  One scoped commit → push origin/028 ── 0 concurrent-lane leak
```

---

### Step 0 — Reconcile working tree (prerequisite gate)

Resolve F1–F5 before touching anything. Determine whether D1 (facade delete) and D2 (create-changelog build) already exist on another worktree/branch, or are still TODO here. Lock the packet count (9 vs 10) per the build-or-fold ruling in `011-create-changelog/spec.md`.

**Acceptance:** Written determination of (a) which tree holds the facade-removal + create-changelog work, (b) final packet count, (c) whether D3/D4 are real on the tree we build on. Escalate to operator if the create-changelog build-or-fold outcome is unclear.

---

### Step 1 — R1: create-skill references/assets three-way regrouping

**Why first:** it moves files; every later link-fix (R5) and cross-ref (R2) must see final paths.

**Current →  target:**

`create-skill/references/` (today: `skill_creation.md` + `skill_creation/{common_pitfalls, creation_workflow, examples_and_maintenance, overview, parent_hub_router_schema, parent_skills_nested_packets, validation_and_packaging}.md`) regroups into:
- `references/shared/` — cross-cutting creation guidance (e.g., the `skill_creation.md` dispatcher, `validation_and_packaging`, `common_pitfalls` if generic).
- `references/parent_skill/` — parent-hub-specific docs (`parent_hub_router_schema.md`, `parent_skills_nested_packets.md`).
- `references/skill/` — single-skill creation docs (`overview.md`, `creation_workflow.md`, `examples_and_maintenance.md`).

`create-skill/assets/` (today: only `assets/skill/` holding a mix of `parent_skill_*` and `skill_*` templates) regroups into:
- `assets/shared/` — templates common to both (e.g., `skill_smart_router.md` if shared).
- `assets/parent_skill/` — `parent_skill_hub_template.md`, `parent_skill_registry_template.json`, `parent_skill_hub_router_template.json`, `parent_skill_description_template.json`, `parent_skill_graph_metadata_template.json`.
- `assets/skill/` — `skill_md_template.md`, `skill_readme_template.md`, `skill_reference_template.md`, `skill_asset_template.md`.

The nested `create-skill/references/skill_creation/` folder ("should not be there") is dissolved; its files land in the three new subfolders. Exact file→bucket assignment is decided at execution by reading each file's content (shared vs parent vs skill).

**Mechanics (script-driven):** author a move script that `git mv`s each file to its new bucket, then a repoint script (extend `fix_drift.py`) that rewrites every citation of the old paths.

**Must-update path citations:**
- `mode-registry.json` and hub `SKILL.md` §5 (line ~117 cites `create-skill/references/skill_creation/parent_skills_nested_packets.md`).
- `hub-router.json` if it cites any create-skill reference/asset path.
- All internal cross-refs inside the moved files and inside `create-skill/SKILL.md` + `create-skill/README.md`.
- The `/create:sk-skill` and `/create:sk-skill-parent` command YAMLs that cite these reference/asset paths.

**Acceptance:**
- `create-skill/references/` and `create-skill/assets/` each contain exactly `shared/`, `parent_skill/`, `skill/` subfolders; no residual `skill_creation/` folder.
- Zero broken links introduced (link-checker delta ≤ 0 for create-skill paths).
- `parent-skill-check.cjs` passes with 0 warnings.
- Command YAMLs resolve to the new paths.

---

### Step 2 — R2: Concern #2 uniform contract (all 10 packets)

**Rule:** every sub-skill must (a) have a creation-guidelines reference (`references/<x>_creation.md` or equivalent) AND (b) carry the actual creation workflow INLINE in its `SKILL.md` (the SKILL.md is the primary contract). If inlining would bloat the SKILL.md, split: keep the core workflow in SKILL.md, push depth into smaller references.

**Audit all 10** (including create-changelog + doc-quality). Known gaps from the on-disk scan:
- `create-command` — no local `references/` dir (points to `shared/references/global` only). Add `references/command_creation.md`, confirm inline workflow in SKILL.md. (F4)
- `create-flowchart` — no `references/` and no reference mentions in SKILL.md. Add `references/flowchart_creation.md`, confirm inline workflow. (F4)
- `create-changelog` — depends on Step 0 outcome; if it exists as a packet, ensure it has `references/changelog_creation.md` + inline workflow.
- The other 7 have a `*_creation.md` reference — verify their SKILL.md actually carries the workflow inline (not just a pointer).

**Tooling:** GPT-5.5-fast writers author the missing references and any SKILL.md inline-workflow additions; fresh Sonnet/Opus verifies fidelity (references match SKILL.md, no drift).

**Acceptance (per packet):** creation-guideline reference present; SKILL.md contains the executable workflow inline; reference and SKILL.md are consistent (no contradicting steps); `doc:quality`/validate passes.

---

### Step 3 — R3: Initial-release changelog per packet

Every one of the (9 or 10) packets currently holds only `changelog/.gitkeep`. Author `changelog/v1.0.0.0.md` in each — an initial-release entry following the shared format at `shared/assets/changelog_template.md`.

Per hub RULES: changelogs are **real files**, never symlinked. May be authored in parallel with R2.

**Acceptance:** each packet has a real `changelog/v1.0.0.0.md` matching `changelog_template.md` structure; frontmatter version aligns with the packet's declared version; no symlinks; validate passes.

---

### Step 4 — R4: Per-packet optimization + fresh-Opus adversarial verification

Each sub-skill must be "the most optimized, engineered, tested and verified." Dispatch ONE fresh Opus agent per packet for adversarial verification of:
- SKILL.md quality (clarity, contract completeness, routing correctness),
- workflow completeness (the inline workflow from R2 actually runs end-to-end),
- reference fidelity (references agree with SKILL.md; no orphan/contradiction),
- path integrity (all internal links resolve after R1 moves).

Fix every finding before marking a packet done. Findings are hypotheses (§CLAUDE finding-is-a-hypothesis) — confirm against the real file before acting.

**Acceptance (per packet):** fresh-Opus verdict recorded; all P0/P1 findings resolved with evidence; packet passes `parent-skill-check.cjs` scope + `doc:quality` scoring threshold.

---

### Step 5 — R5: Broken links → 0

**Why after R1:** the drift-fixer must run against FINAL paths, or it re-breaks on R1's moves.

Re-run the deterministic drift-fixer (`fix_drift.py`, extended with any new basename→canonical entries from R1/R2/R3), then hand-resolve the residual 34:
- ~21 → moved/removed `.opencode/specs/**` archives (system-spec-kit playbooks): repoint to the surviving canonical, or flag as genuinely-removed with an explicit note.
- ~11 → other-skill drift: `cli-opencode`→`sk-prompt-models` renamed model files; `mcp-open-design`→`sk-design` ref; advisor playbook. (Concurrent-lane edits AUTHORIZED for link fixes only.)
- 2 → install-guide-template links.

**Acceptance:** `check-markdown-links.cjs` reports **0 broken** across the repo, OR a short explicit list of genuinely-removed links each annotated with why no canonical target exists. Placeholder allowlist in `check-markdown-links.cjs` is intentional and documented.

---

### Step 6 — R6: Resolve system-spec-kit test entanglement

10 system-spec-kit test files (`.tmpl`/`.snap`/fixtures) were touched for a pre-existing `hvr_rules` path fix. They are entangled with (a) an uncommitted concurrent-session `SELF-CHECK` template change and (b) a pre-existing FAILING golden-snapshot test (`scaffold-golden-snapshots.vitest.ts`).

Resolve cleanly WITHOUT destroying concurrent work:
- Determine whether the failing golden snapshot is caused by our `hvr_rules` edits or pre-exists independently (baseline the test on a clean stash first).
- If ours: regenerate the snapshot deterministically and re-run the vitest to green.
- If not ours / entangled with the concurrent `SELF-CHECK` change: back out our edits to those files (leaving the concurrent change intact) rather than committing a fix that overwrites another session's work.
- Name the rollback before any destructive step (stash/patch capture).

**Acceptance:** `scaffold-golden-snapshots.vitest.ts` either passes green (if we own the change) or is left in its pre-existing state with our edits cleanly backed out; the concurrent `SELF-CHECK` template change is untouched; a one-line note records which path was taken and why.

---

### Step 7 — R7: One scoped commit → push origin/028

Operator wants a SINGLE commit for the whole program. Stage only this program's files; **zero leak** into concurrent lanes' unrelated work.

- Enumerate the intended file set explicitly (sk-doc packets, hub configs, shared/, command YAMLs, `check-markdown-links.cjs` allowlist, link repoints). Exclude any concurrent-session file not part of R1–R6 (notably the `SELF-CHECK` change from R6 and unrelated 028 lane edits).
- Run the full gate before claiming done: `check-markdown-links.cjs` (0 broken), `parent-skill-check.cjs` (0 warnings), affected vitests green, `validate.sh <spec-folder> --strict`.
- Conventional commit message; end with the required Co-Authored-By + Claude-Session trailers (per repo git rules).
- Name the rollback (the commit SHA to revert) before pushing; push to `origin/system-speckit/028-memory-search-intelligence`.

**Acceptance:** one commit containing exactly the program's files (verified via `git show --stat`); no concurrent-lane files included; all gates green; pushed to origin/028; commit SHA + push confirmation recorded.

---

## 5. Consolidated acceptance checklist

- [ ] Step 0: F1–F5 reconciled; packet count (9/10) locked; create-changelog build-or-fold resolved.
- [ ] R1: create-skill `references/` and `assets/` each = `{shared, parent_skill, skill}`; no `skill_creation/` folder; all citations (registry, hub SKILL.md, hub-router, command YAMLs, internal) repointed; `parent-skill-check.cjs` 0 warnings.
- [ ] R2: all packets have a creation-guideline reference AND inline SKILL.md workflow; create-command + create-flowchart gaps closed.
- [ ] R3: every packet has real `changelog/v1.0.0.0.md` per shared template; no symlinks.
- [ ] R4: fresh-Opus adversarial verification per packet; all findings resolved with evidence.
- [ ] R5: `check-markdown-links.cjs` = 0 broken (or explicit genuinely-removed list).
- [ ] R6: golden-snapshot test resolved; concurrent `SELF-CHECK` change preserved.
- [ ] R7: single scoped commit; 0 concurrent-lane leak; full gate green; pushed to origin/028.

---

## 6. Key paths (reference)

| Purpose | Path |
|---------|------|
| Hub | `.opencode/skills/sk-doc/SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` |
| create-skill refs (R1 source) | `.opencode/skills/sk-doc/create-skill/references/` (`skill_creation.md` + `skill_creation/`) |
| create-skill assets (R1 source) | `.opencode/skills/sk-doc/create-skill/assets/skill/` |
| Shared backbone | `.opencode/skills/sk-doc/shared/{scripts,references/global,assets}/` |
| Changelog template (R3) | `.opencode/skills/sk-doc/shared/assets/changelog_template.md` |
| Link checker (R5) | `check-markdown-links.cjs` (drift-fixer: scratchpad `fix_drift.py`) |
| Parent-skill validator | `parent-skill-check.cjs` |
| create-changelog spec (F5) | `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/011-create-changelog/spec.md` |
| Spec-folder validator (R7) | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` |
| Entangled test (R6) | system-spec-kit `scaffold-golden-snapshots.vitest.ts` + 10 `.tmpl`/`.snap`/fixture files |
