---
title: "Implementation Plan: Phase 2: hub-surface-removal"
description: "Ordered removal of the two example surfaces from the sk-code hub: delete the folders, strip the two registries, regenerate every generated artifact, then strip the hand-owned documents and the tracked consumers, with a proof command per step."
trigger_phrases:
  - "hub surface removal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: hub-surface-removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON registries, Markdown documents, Node.js CJS scripts and tests, Python generators |
| **Framework** | The sk-code hub's two-axis router (`mode-registry.json`, `hub-router.json`, `ROUTER.md`) |
| **Storage** | None; git-tracked files only |
| **Testing** | `node --test` suites, `bash` test scripts, `verify-doc-claims.cjs`, `parent-skill-check.cjs`, `validate.sh --strict` |

### Overview
The removal follows the hub's own README procedure (`README.md:105-135`), applied to both surfaces: delete the folders, strip the two registries, regenerate the artifacts that have generators, hand-edit the two files that do not, then remove the example-authored content and the tracked consumers. Every step ends with a command whose output proves it, so a writer can stop after any step and know the state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Every file anchor verified on `42b41dd286`
- [x] Phase 001 landed with `RESULT: PASSED`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `verify-doc-claims.cjs` exits 0 with no output
- [ ] Hub test suites and the doctor invariants test pass
- [ ] `validate.sh --strict` prints `RESULT: PASSED` from the final state
- [ ] One commit with a prose body, pushed to `main` last, after the suites, the reviewer and the validator have passed; nothing staged outside the phase's files
- [ ] `git status --porcelain` is empty and `git rev-parse HEAD` equals `git rev-parse origin/main`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven two-axis hub. `mode-registry.json` declares the packets; `hub-router.json` declares stage-one signals and tie-break order; `ROUTER.md` section 11 is the machine-readable stage-two projection; `leaf-manifest.json` and the skill-derived files are generated from those sources; the doctor and the hub's own scripts assert the invariants.

### Key Components
- **`mode-registry.json`**: the source of truth for which packets exist. `extensions.surface-axis.surfaces` (line 19) and one `modes[]` entry per packet (webflow at line 61, obsidian at line 98) name the removed surfaces.
- **`hub-router.json`**: stage-one routing. `routerPolicy.tieBreak` (line 7), `routerSignals` (webflow at line 31, obsidian at line 42) and `vocabularyClasses` (`code-webflow-aliases` 73, `code-webflow-runtime` 76, `code-obsidian-aliases` 89, `code-obsidian-runtime` 92).
- **`ROUTER.md` section 11**: hand-owned `INTENT_SIGNALS` / `RESOURCE_MAP` projection, starting at line 307; 152 mentions of the removed surfaces today.
- **Generators**: `generate-leaf-manifest.cjs`, `regenerate-skill-derived.cjs`, `test_readme_manifest.py --write`, `sync-skills-hermes.cjs`, `compiled-route-manifest.cjs refresh`.
- **Gates**: `verify-doc-claims.cjs`, `verify-router-sync.cjs`, `parent-skill-check.cjs`, `validate.sh --strict`.

### Data Flow
Registry and router edits flow outward: `mode-registry.json` and `hub-router.json` feed `leaf-manifest.json` and the derived metadata, which feed the README manifest and the Hermes copies; the hook re-mints the compiled-routing manifest at commit time. The hand-owned documents (`ROUTER.md`, `SKILL.md`, the shared references) must be edited in the same direction, because `verify-doc-claims.cjs` compares their claims against the registry and the disk.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a removal, not a bug fix, but it changes a shared routing contract, so the producer/consumer inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | Producer: declares the three surfaces | update, one surface remains | `node -e` print of `modes[].workflowMode` and `extensions.surface-axis.surfaces` |
| `hub-router.json` | Producer: stage-one signals and tie order | update | `node -e` print of `tieBreak`, `routerSignals` keys, `vocabularyClasses` keys |
| `ROUTER.md` §11 | Producer: stage-two projection | update by hand | `rg -c` returns 0 and `verify-router-sync.test.cjs` passes |
| `leaf-manifest.json` | Generated consumer | regenerate | `rg -n` returns nothing |
| `SKILL.md`, `shared/*`, `sk-code-quality/*`, `sk-code-review/*`, `feature-catalog/*` | Consumer documents | update | `rg -n` returns only D6 kept records |
| `verify-doc-claims.cjs`, `verify-router-sync.cjs` | Consumer gates | unchanged code, new expectations | both suites pass |
| `parent-skill-check.cjs:1229` | Consumer: names the two example surfaces as sortable-after-native | update | doctor invariants test passes |
| `.skilled/bin` fixtures and tests | Consumer: compiled routing fixtures | update | `compiled-route-surface-hint.test.cjs` and `verify-router-sync.test.cjs` pass |
| sk-doc fixtures, references, baselines | Consumer: cross-skill test fixtures and redirects | update | the owning suite passes |
| `README.md:796,1481`, `.skilled/skills/README.txt:60` | Consumer: adopter-facing surface lines | update | `rg -n` returns nothing |
| `.skilled/skills/sk-code/README.md`, `shared/references/universal/*.md`, `sk-code-skilled/{README.md,SKILL.md}` | Consumer: hub documents that name the surfaces | update | `rg -n` returns nothing |
| `.hermes/skills/sk-code*/` | Generated consumer | regenerate | `.hermes/skills/sk-code-webflow/` no longer exists |

Required inventories:
- Same-class producers: `rg -n 'sk-code-webflow|sk-code-obsidian|WEBFLOW|OBSIDIAN' .skilled/skills/sk-code --glob '*.json' --glob '*.md'`, because the phase removes the bare surface tokens as well as the packet names.
- Consumers of changed symbols: `rg -n 'sk-code-webflow|sk-code-obsidian' . --glob '*.cjs' --glob '*.ts' --glob '*.py' --glob '*.sh' --glob '*.json' --glob '*.md' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.skilled/changelog/**' --glob '!**/benchmark/reports/**'`.
- Matrix axes: two surfaces x (registry, router, generated, hand-owned doc, example content, external consumer) — every cell is one task in `tasks.md`.
- Algorithm invariant: the hub's parent projection equals the union of the remaining surface maps plus the parent-owned universal/shared tier. Removing a surface removes its map; it must never leave an orphan key or a path that no longer resolves.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The step sequence below is the same order, with the proof command that closes each step.

| Step | Work | Files and anchors | Proof command |
|------|------|-------------------|---------------|
| 1 | Confirm the workspace | README "Before You Start" (`README.md:110-115`) | `git config --local --get skilled.trustRepoHooks` prints `true` |
| 2 | Delete both packets | `git rm -r .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` | `git ls-files \| grep -E "^\.skilled/skills/sk-code/sk-code-(webflow\|obsidian)/"` prints nothing |
| 3 | Strip `mode-registry.json` | line 19 surfaces; entries at 61 (packet 70, aliases 73) and 98 (packet 107, aliases 110) | `node -e "const r=require('./.skilled/skills/sk-code/mode-registry.json');console.log(r.modes.map(m=>m.workflowMode).join(','),JSON.stringify(r.extensions['surface-axis'].surfaces))"` prints `sk-code-quality,sk-code-review,sk-code-skilled ["sk-code-skilled"]` |
| 4 | Strip `hub-router.json` | line 7; signals at 31 and 42; classes at 73, 76, 89, 92 | `node -e "const r=require('./.skilled/skills/sk-code/hub-router.json');console.log(JSON.stringify(r.routerPolicy.tieBreak),Object.keys(r.routerSignals).join(','),Object.keys(r.vocabularyClasses).join(','))"` names no removed surface |
| 5 | Regenerate the leaf manifest | `generate-leaf-manifest.cjs --write .skilled/skills/sk-code` (today lines 18, 35-36, 166-271) | `rg -n "sk-code-(webflow\|obsidian)" .skilled/skills/sk-code/leaf-manifest.json` prints nothing |
| 6 | Hand-edit `ROUTER.md` | §1 lists at 26, 30, 45 and the parenthetical at 35; §4 `WEBFLOW MAP` at 119 and §5 `MOTION_DEV MAP` at 155 deleted whole; §7 row at 250, §8 at 265/271, §9 at 283/293, §10 at 300; §11 starts at 307, `INTENT_SIGNALS` 326, `RESOURCE_MAP` 351, `OBSIDIAN_PLUGIN` key 346 and its map block 554-559 | `rg -n "WEBFLOW\|OBSIDIAN" .skilled/skills/sk-code/ROUTER.md` prints nothing |
| 7 | Strip the hub documents | `SKILL.md` 36, 38, 40, 63, 70, 74, 82, 139, 164, 166, 173; `shared/references/stack-detection.md` 3, 28-30, 33, 39, 45, 53, 65, 77-83, 87, 95-105, 133-146; `shared/README.md` 17, 30, 52, 71; `shared/references/phase-detection.md` 16, 28, 57, 81-85, 87; `universal-debugging-checklist.md` 16, 22, 69, 91; `universal-verification-checklist.md` 16, 22, 26, 36, 38, 51, 57-71, 90, 106, 120; `performance-loading-checklist.md` 98-100; `universal/*.md` (`code-style-guide.md` 3, 24, 39, 58, 87, 120, 139, 194, 204, 225, 234 with 151 kept; `error-recovery.md` 3, 43, 88, 89, 108, 133; `multi-agent-research.md` 50, 172, 216; `code-quality-standards.md` 16, 24, 49, 56, 82, 118); `description.json` 12, 46, 49, 50; `.skilled/skills/sk-code/README.md` 23, 55, 57, 69, 90, 106, 119, 191, 193; `sk-code-skilled/README.md` 36, 91, 104 and `sk-code-skilled/SKILL.md` 55; `README.md:796,1481`; `.skilled/skills/README.txt:60` | the packet-name grep prints nothing, and the phase-wide token grep lists only the three kept tag files |
| 8 | Remove the example content | playbook files listed by `rg -l` under `manual-testing-playbook/`, including `design-restraint/design-restraint-ladder.md` and `skill-advisor-integration/advisor-probe-battery.md`; `manual-testing-playbook.md` rows, `sk-code-quality` checklist pointers, `feature-catalog` claims, the two compiled-routing test files, the canary fixture and its twin, `typo-flags.test.sh`, `router-replay-lib.cjs`, `verify-router-sync.cjs`, `sk-code-review` documents | the file list from `rg -l` shrinks to the D6 kept records |
| 9 | Update the external consumers | `parent-skill-check.cjs:1229`, its invariants test 491-500, `leaf-resource-contract.test.cjs:355-392`, `upgrading-a-skill-to-v4.md:72,134`, `047-020-recorded-picks.jsonl:28-30`, the two `code-folder/` baselines, `cite-drift-redirects.json:259,3960-3961`, `playbook-failclosed-allowlist.txt:33,37`, `check-markdown-links.cjs:73` | each owning suite passes; `rg -n` over those paths prints nothing |
| 10 | Close the doc-claims gate | `verify-doc-claims.cjs`; `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`; hand-edit `graph-metadata.json` `causal_summary` (line 282) and any surface keys left (56-254) | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` exits 0 with no output |
| 11 | Refresh the generated consumers | `test_readme_manifest.py --write`; `sync-skills-hermes.cjs` | `.hermes/skills/sk-code-webflow/` and `.hermes/skills/sk-code-obsidian/` no longer exist; the README manifest diff names only removed rows |
| 11b | Leave the CI-generated retrieval data to CI | `runtime/data/trigger-index.json` (200 mentions today) and `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json`. The trigger-index rebuild that CI runs after the push regenerates them and no step here writes them, so the phase handoff grep excludes both paths and the handoff does not wait on that rebuild; phase 5 proves the zero count | `grep -c -E "sk-code-(webflow\|obsidian)" .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` is still non-zero here by design |
| 12 | Run the phase gate | the hub's suites (T062), the cross-skill suites and probe (T063), the kept-record diff (T064), the reviewer (T065) and `validate.sh --strict` on this folder (T066) | every suite exits 0, the kept-record diff is empty, the reviewer marks each criterion, and the validator prints `RESULT: PASSED` |
| 13 | Commit and push last | stage the phase's files by name, commit with hooks installed, or refresh by hand with `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` and copy `013-live-activation/activation/sk-code/manifest.json` over the `specs/sk-doc/z_archive/.../013-live-activation/...` twin; then `git push HEAD:main` | `git status --porcelain` is empty, the twin `diff` is empty, `git rev-parse HEAD` equals `git rev-parse origin/main`, and the validator still prints `RESULT: PASSED` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `compiled-route-surface-hint.test.cjs`, `verify-router-sync.test.cjs`, `verify-doc-claims.test.cjs`, `typo-flags.test.sh` | `node --test`, `bash` |
| Integration | `parent-skill-check-invariants.test.cjs`, `leaf-resource-contract.test.cjs`, the sk-doc README manifest and verdict parity tests | `node --test`, `python3 -m unittest` |
| Contract | `verify-doc-claims.cjs` over the hub, `verify-router-sync.cjs` over `ROUTER.md` | `node` |
| Manual | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a typescript script"}' --format json` still returns `sk-code` | advisor CLI |
| Phase gate | `validate.sh --strict` on this folder | `bash` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-ignore-and-commit-guard` | Internal | Green | Without the root ignore rules and the commit guard, a later phase can stage a private copy |
| Provisioned, hook-trusted checkout | Internal | Green | Without the hook the compiled-routing manifest is not re-minted and the phase ships a stale one |
| `generate-leaf-manifest.cjs`, `regenerate-skill-derived.cjs`, `test_readme_manifest.py`, `sync-skills-hermes.cjs`, `compiled-route-manifest.cjs` | Internal | Green | A missing generator forces a hand edit, which REQ-003 forbids |
| `node`, `python3`, `bash` | External | Green | Any gate is unrunnable |
| `gh` | External | Not needed here | CI observation belongs to phase 5 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any gate that cannot be repaired in place — a hub suite failing for a reason outside the removal, a router projection that will not reconcile, or a discovered dependency on the removed packets that phase 3 does not cover.
- **Procedure**: the phase lands as one commit, so revert it whole and re-run the gate:
  - `git revert --no-edit <phase-commit-sha>`
  - `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict`
  - `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs`
  - `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` if the reverted commit had re-minted the manifest, then copy the refreshed manifest over its authored twin.
- **Before the commit exists**: restore any single file with `git checkout 42b41dd286 -- <path>`, and restore a deleted folder with `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian`.
- **What this phase does not create**: no ignored folders. `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` are phase 4's, and their rollback is `rm -rf` of those two paths. Deleting them is not part of this phase's rollback.
- **Data**: none. No migration, no persisted state, no private content.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-ignore-and-commit-guard ──► 002-hub-surface-removal ──► 003-advisor-vocabulary-cleanup
                                        │                              │
                                        └──────────────────────────────┴──► 004-private-local-skills ──► 005-leak-and-routing-verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-ignore-and-commit-guard | None | 002 |
| 002-hub-surface-removal | 001 | 003, 004 |
| 003-advisor-vocabulary-cleanup | 002 | 004 |
| 004-private-local-skills | 001, 003 | 005 |
| 005-leak-and-routing-verification | 004 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Med | 3-5 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — not applicable, no data
- [ ] Feature flag configured — not applicable, no runtime flag
- [ ] Monitoring alerts set — not applicable; the gates are the monitoring
- [ ] Phase 001 landed and `RESULT: PASSED`
- [ ] Working tree clean before step 2, so the phase diff is only this phase's work

### Rollback Procedure
1. Stop before committing: `git restore --staged --worktree .` and restore from `42b41dd286`.
2. After committing: `git revert --no-edit <phase-commit-sha>`.
3. Verify: `verify-doc-claims.cjs` exits 0 and `validate.sh --strict` prints `RESULT: PASSED`.
4. Notify: none; the removal has no user-facing runtime behaviour beyond routing vocabulary.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

