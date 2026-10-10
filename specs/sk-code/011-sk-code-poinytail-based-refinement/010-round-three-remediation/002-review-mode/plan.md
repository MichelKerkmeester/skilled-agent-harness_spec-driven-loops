---
title: "Implementation Plan: Phase 2: review-mode"
description: "The review mode's detector is rewritten to restate the shared sk-code detection contract and gains an OBSIDIAN branch, the findings checker learns the heading shape with a four-file fixture behind it, and a set of one-line doc edits fixes the cache location, the deep-review ownership, the status vocabulary, the playbook range and validator, and the pre-rename names."
trigger_phrases:
  - "review mode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: review-mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill, README, reference, asset, playbook and changelog docs), Python pseudocode inside SKILL.md, Node.js ES modules (checkers), Bash (harness) |
| **Framework** | None. Node built-ins `fs` and `url`, Python standard library for the probe |
| **Storage** | None |
| **Testing** | `scratch/detect-probe.py` (runs the SKILL.md detector on six inputs), `check-rule-copies.test.sh` (54 PASS lines today, 68 after), `check-rule-copies.js`, the two review-output checkers on the new fixture, `validate_document.py`, the drift guards, the leaf-manifest and compiled-route checks, and the agent mirror checks |

### Overview
Every edit is planned as one exact find-and-replace unit in `scratch/dispatch-units.json`, 69 units in all (64 edits and 5 file creations), each with a check command. All 69 were applied to a copy of the packet on 2026-10-10 before this plan was written: every OLD text matched exactly once, every unit check printed its expected value, the detector probe printed the target surfaces, the harness printed 68 PASS lines and exited 0, the canary printed `6 exact-string file(s)`, and every edited doc kept its validator result. Phase 1 records the baselines and reproduces each defect, Phase 2 applies the units in order, and Phase 3 proves each requirement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place edits of one mode packet: a pseudocode detector restated from a shared contract, two small checker changes proved by a fixture, and doc edits pinned by the existing rule-copy canary.

### Key Components
- **Detector (`SKILL.md` section 2, `detect_surface_evidence`, lines 220-230)**: replaced by marker constants and a function that applies `stack-detection.md` section 2 in its precedence. OPENCODE when a resolved path sits under `.skilled/`. OBSIDIAN on `esbuild.config.mjs`, a `manifest.json` carrying `"minAppVersion"`, a `styles.css` carrying `.db-`, a `from "obsidian"` import under `src/`, or a prompt naming the plugin. UNKNOWN on the contract's explicit non-Webflow wording. WEBFLOW on `src/2_javascript/`, `*.webflow.js`, `wrangler.toml` or the contract's content markers. UNKNOWN otherwise. A new optional `read_text` argument supplies file contents for the content markers, and the existing callers keep working without it.
- **Shared pointer**: one line in SKILL.md section 2 and one sentence in `review-core.md` section 5 name `stack-detection.md` section 2 as the owner of the markers. This closes f-iter011-001.
- **Findings checker (`check-review-findings.js:19-20`, `:47`)**: a second pattern, `/^### (\d+) \[P[0-2]\] \S/`, for the `review-core.md` heading shape, and a Case pattern that also accepts a Case line at column 0, which is how that shape writes it (`review-core.md:110-111`).
- **Final-line checker (`check-review-final-line.js:81`)**: `/^Not checked: +\S/` instead of `/^Not checked: \S/`.
- **Review-output fixture (`scripts/review-output-fixture/`)**: `list-shape-valid.md`, `heading-shape-valid.md`, `heading-shape-missing-case.md`, `heading-shape-restart.md`. All four are complete reviews that pass the final-line checker. The two bad files fail the findings checker. Today the three heading-shape files print `OK: no numbered findings to check` (checked 2026-10-10), which is the defect the harness now catches.
- **Canary (`check-rule-copies.js`)**: SKILL.md's entry gains `**Overall assessment**: [APPROVED / REQUESTED_CHANGES / COMMENTED]` and `../shared/references/stack-detection.md`, and a new entry pins `` `APPROVED`, `REQUESTED_CHANGES` or `COMMENTED` `` in `review-ux-single-pass.md`. The OK line then reads `6 exact-string file(s)`.
- **Harness (`check-rule-copies.test.sh`)**: `TARGETS` gains `review-ux-single-pass.md` so seeded trees stay complete. Three new blocks go before the line `# Seeded examples ensure the canary rejects content after status and missing context.`: a two-space `Not checked:` case (1 PASS), the fixture loop (11 PASS), and a drifted-token tamper case (2 PASS). 54 + 14 = 68.

### Data Flow
A review output passes through `check-review-findings.js` (numbering and Case lines under `## Findings`, either shape) and `check-review-final-line.js` (the closing lines). The canary reads the packet docs and runs the final-line checker on the two documented examples. The harness drives all three and the fixture.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | Surface tokens are the contract's surface names: `OPENCODE`, `OBSIDIAN`, `WEBFLOW`, `UNKNOWN` | The detector restates the contract, so its output uses the contract's words; the old `sk-code:code-*` tokens carried pre-rename names and had no consumer outside the packet and its Hermes copy (rg over the repo, 2026-10-10) |
| D2 | The detector is file-marker based. Prompt words count only for the hub router's `OBSIDIAN_PLUGIN` keywords (`ROUTER.md:346`) and the contract's non-Webflow guard. The old `frontend`, `web`, `css`, `dom`, `browser`, `jsonc` and `mcp` prompt promotions and the literal `.opencode/` test are dropped | The contract names no prompt words as surface markers and its symlink guard rejects a literal `.opencode/` match (`stack-detection.md:67-75`, `:83`) |
| D3 | The M-1 cache moves to `${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/<repo-ref>.jsonl` | The key is the remote URL hash, so a per-user cache works across clones and writes nothing into the reviewed repository |
| D4 | One status vocabulary: `APPROVED`, `REQUESTED_CHANGES`, `COMMENTED`, the set `check-review-final-line.js:18` enforces | The brief's rule; the README example already used it |
| D5 | The final-line checker accepts one or more spaces after `Not checked:` | Only the status line is machine-parsed, and the scripts README describes the rule as "followed by text" |
| D6 | The heading shape is `### <n> [P0|P1|P2] <title>` and its Case line may start at column 0 | That is the shape `review-core.md:110-111` prints |
| D7 | The fixture lives in `scripts/review-output-fixture/` and is driven by the existing harness | The leaf manifest walks only `references/` and `assets/`, and the alignment-drift scan reads code files, so Markdown fixtures under `scripts/` change neither |
| D8 | The canary pins the assessment tokens, the gate-recommendation tokens and the shared pointer, and nothing else new | Those are the new invariants this fix creates (f-iter011-002) |
| D9 | No agent file is edited, so no Codex or Pi generator runs | No finding names the agent; its PR-review `Recommendation: APPROVE/REQUEST CHANGES/BLOCK` (`.skilled/agents/review.md:281`) is a separate three-way scale with `BLOCK`, outside the packet the status rule covers. The mirror checks still run as regression checks |
| D10 | The frontmatter `description` (`SKILL.md:3`), the `Keywords` comment (`SKILL.md:11`) and the trigger phrase `code-review` (`README.md:10`) stay | They are routing inputs and a user phrase, not mode-name references; changing them can move advisor scores |
| D11 | Version 1.7.0.0 (minor) in SKILL.md and README.md, changelog at `changelog/v1.7.0.0.md` in the compact shape | A new surface branch and checker behavior are a feature addition per `sk-create-changelog/SKILL.md` section 4; the packet's changelog folder is the global target `.skilled/changelog/sk-code/code-review` links to |
| D12 | The pre-rename SKILL.md rows (f-iter006-003 family: `SKILL.md:13`, `:21`, `:39`, `:41`, `:42`, `:43`, `:56`, `:65`, `:107`, `:293`, `:338`, `:453`, `:463`, `:473`) are renamed with the README rows | Same file family as f-iter019-003, owned here, and child 005's name checker will read these files |
| D13 | The README's "21 pre-rename rows" (f-iter019-003) resolve to 13 prose edits | The research count matched paths, file names (`code-quality-checklist.md`), the cache folder and the trigger phrase too; those are not mode-name references |
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Phase 2 tasks T014 to T082 match the units of `scratch/dispatch-units.json` one to one, in the same order.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Detector**: `scratch/detect-probe.py` extracts the python block under `### Smart Router Pseudocode` from SKILL.md and runs `detect_surface_evidence` on the three research inputs (generic Node `src/api/client.ts`, a `package.json` bump, the `code review my obsidian plugin` prompt) and three controls. Before: `sk-code:code-webflow`, `sk-code:code-webflow`, `sk-code:unknown`, `sk-code:code-opencode`, `sk-code:code-webflow`, `sk-code:code-webflow`. After: `UNKNOWN`, `UNKNOWN`, `OBSIDIAN`, `OPENCODE`, `WEBFLOW`, `OBSIDIAN`.
- **Checkers**: direct runs on the four fixture files, a two-space `Not checked:` sample, and the harness (68 PASS lines).
- **Canary**: the clean run prints `6 exact-string file(s)`; the harness tamper case proves the new UX pin can fail.
- **Docs**: `validate_document.py --blocking-only` on every edited doc must give the baseline result (all `Total issues: 0`, except `pr-state-dedup.md`, which already fails with one `missing_required_section: overview` error and keeps it); the playbook under `--type playbook` and the changelog must give `Total issues: 0`.
- **Ripple**: drift guards (`all 3 guards PASSED`), leaf manifest (`checked=14 fresh=14 failed=0`), compiled-route guard (`sk-code fresh`), agent mirror checks (`12 agent(s) checked`, Codex and Pi `PASS: 12 agents are in sync.`), Hermes `--check` (the `sk-code-review` copy is expected stale until the orchestrator regenerates).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js, Python 3 (3.9 observed), `rg` with PCRE2 (10.45 observed), Bash. No network.
- Parallel siblings: child 001 edits two shared files the canary pins. A canary failure that names only `shared/references/universal/code-quality-standards.md` or `shared/references/workflow-verify.md` is the sibling's and is recorded, not fixed.

### Handoffs

| To | Item |
|----|------|
| Child 001 (owns `mode-registry.json`) | `.skilled/skills/sk-code/mode-registry.json:50` `writeScopeNote` names `.skilled/.code-review-cache/<repo-ref>.jsonl`; replace with `${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/<repo-ref>.jsonl` and say the cache sits outside the reviewed repository. That edit needs the compiled sk-code re-mint |
| Orchestrator | Run `sync-skills-hermes.cjs` once after the builds; `.hermes/skills/sk-code-review/SKILL.md` will be stale until then |
| Orchestrator | If `compiled-route-guard.cjs` reports sk-code stale after this build, re-mint once all children land |
| Child 005 (name checker) | The pre-rename search will still match `code-review` in `sk-code-review/SKILL.md:3`, `:11` and `README.md:10` (kept by D10), plus file names such as `code-quality-checklist.md` and old changelog text; the checker needs those exclusions |
| Child 006 (deep-loop follow-ups) | `review-mode-contract.yaml:1-4` calls itself the "single source of truth for review-mode taxonomy"; the review side now states that `review-core.md` owns severity ids and meanings and the YAML owns the loop. A header sentence in the YAML pointing back would close the loop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the 13 modified files: `git restore -- .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/sk-code-review/README.md .skilled/skills/sk-code/sk-code-review/references .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/sk-code-review/scripts`.
- Delete the new paths `.skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/` and `.skilled/skills/sk-code/sk-code-review/changelog/v1.7.0.0.md`. Nothing outside the packet depends on them.
<!-- /ANCHOR:rollback -->

---
