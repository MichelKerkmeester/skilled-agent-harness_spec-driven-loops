---
title: "Tasks: Phase 2: hub-surface-removal"
description: "Task Format: T### [P?] Description (file path) · branch · anchor · exact edit · proof command"
trigger_phrases:
  - "hub surface removal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: hub-surface-removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Writer branch.** Every task names its branch: `deepseekpi` for code, config, fixture, test and mixed-tree work, `deepseekpihigh` for Markdown-only edits. A `.md`-only task goes to `deepseekpihigh`; anything touching `.json`, `.cjs`, `.ts`, `.sh`, `.py`, `.txt` or a folder that mixes them goes to `deepseekpi`.

**Anchor convention.** Every anchor below was read on `42b41dd286`. Where a line number is given, read the file first and confirm the quoted text is on that line; when the line has moved, locate the quoted text and edit there. Where a block is given as a start line, its end is its own closing brace — read the file and locate it. Never delete a range you have not read.

**Removed-packet pointer rule.** A pointer, row, bullet or keyword whose target is under `.skilled/skills/sk-code/sk-code-webflow/` or `.skilled/skills/sk-code/sk-code-obsidian/` is deleted, not repointed at an invented path. When the same guidance already exists under `sk-code-skilled/`, repoint to that file. Nothing in this phase writes new guidance.

**Comment hygiene.** No task adds a spec path, packet number or phase number to a code comment. Delete stale comments; do not rewrite them to name this packet.

**Kept tag vocabulary.** Exactly three places keep a bare surface token, and nothing else does. The `WEBFLOW:` platform tag stays: it is the line in `shared/references/universal/code-style-guide.md` that also carries `MOTION:` and `LENIS:` (line 151 today), plus `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md` and the allowed-token list of `sk-code-quality/scripts/check-comment-hygiene.sh`. All three are comment-hygiene tag vocabulary for a code comment, not the removed surface. `changelog/` and `benchmark/reports/` are D6 kept records. No task deletes any of them, and no proof treats them as a violation.

**Phase-wide token proof.** Phase 2 removes the bare `WEBFLOW` / `OBSIDIAN` surface tokens, not only the two packet names, so the closure proofs use the token pattern. `rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code* --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'` prints exactly four lines and nothing under `.hermes/`: two in `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`, one in `shared/references/universal/code-style-guide.md` (the `WEBFLOW:` row that also carries `MOTION:` and `LENIS:`) and one in `sk-code-quality/scripts/check-comment-hygiene.sh` (its allowed-token regex). The file-level form `rg -l` with the same globs therefore lists exactly those three files. Line numbers are deliberately not pinned, because the edits above shift them.

**Task ids.** `T067`-`T070` were added by review and keep their ids so no earlier id moves, and `T071` is the same kind of addition; it sits after T039, the canary task it belongs to. Numeric order is therefore not execution order: run them where they appear in the list, inside the document and consumer passes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the checkout is provisioned and hook-trusted, read-only · branch `deepseekpi`
  - Edit: none. Run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .`, `git config --local skilled.trustRepoHooks true`, `bash .skilled/scripts/install-git-hooks.sh` if the next command does not already print `true`
  - Anchor: the hub README's "Before You Start" steps, `README.md:110-115`
  - Proof: `git config --local --get skilled.trustRepoHooks` prints `true`
- [ ] T002 Confirm the predecessor phase landed, read-only · branch `deepseekpi`
  - Edit: none
  - Anchor: `specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/`
  - Proof: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard --strict` prints `RESULT: PASSED`
- [ ] T003 Record the baseline the phase is measured against, read-only · branch `deepseekpi`
  - Edit: none
  - Anchor: the two packet folders and every consumer listed below
  - Proof: `rg -l "sk-code-webflow|sk-code-obsidian" . --glob '!specs/**' --glob '!**/changelog/**' --glob '!.skilled/changelog/**' --glob '!**/benchmark/reports/**' | wc -l` and `rg -l 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | wc -l` — save both numbers and the file lists to `/tmp/phase2-baseline.txt`, never to `scratch/`: `scratch/` is not gitignored and T061's proof requires an empty `git status --porcelain`. Those two files are the delta this phase must drive to the D6 kept set
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Delete both surface packet folders (`.skilled/skills/sk-code/sk-code-webflow/`, `.skilled/skills/sk-code/sk-code-obsidian/`) · branch `deepseekpi`
  - Edit: `git rm -r .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` (226 files, 1.5M + 504K). A plain `rm` is wrong: the removal must be recorded so the content stays reachable at `42b41dd286`
  - Anchor: the two folders at the hub root
  - Proof: `git ls-files | grep -E "^\.skilled/skills/sk-code/sk-code-(webflow|obsidian)/"` prints nothing and exits 1
- [ ] T005 Reduce the declared surface axis to the shipped surface (`.skilled/skills/sk-code/mode-registry.json`) · branch `deepseekpi`
  - Edit: line 19 `"surfaces": ["sk-code-webflow", "sk-code-skilled", "sk-code-obsidian"]` becomes `"surfaces": ["sk-code-skilled"]`
  - Anchor: line 19, inside `extensions.surface-axis`
  - Proof: `node -e "console.log(JSON.stringify(require('./.skilled/skills/sk-code/mode-registry.json').extensions['surface-axis'].surfaces))"` prints `["sk-code-skilled"]`
- [ ] T006 Delete the `sk-code-webflow` mode entry (`.skilled/skills/sk-code/mode-registry.json`) · branch `deepseekpi`
  - Edit: delete the whole `modes[]` object that starts at line 61 (`"workflowMode": "sk-code-webflow"`) and ends at its own closing `},` (facts.md records 61-77; packet line 70, aliases line 73). Delete the object, not just its keys, and leave the neighbouring entries' commas valid
  - Anchor: `"workflowMode": "sk-code-webflow"` at line 61
  - Proof: `node -e "console.log(require('./.skilled/skills/sk-code/mode-registry.json').modes.map(m=>m.workflowMode).join(','))"` prints `sk-code-quality,sk-code-review,sk-code-skilled`
- [ ] T007 Delete the `sk-code-obsidian` mode entry (`.skilled/skills/sk-code/mode-registry.json`) · branch `deepseekpi`
  - Edit: delete the whole `modes[]` object that starts at line 98 (`"workflowMode": "sk-code-obsidian"`) and ends at its own closing `}` (facts.md records 98-113; packet line 107, aliases line 110). The blank line above it at line 96 goes with it
  - Anchor: `"workflowMode": "sk-code-obsidian"` at line 98
  - Proof: the T006 proof prints the same three ids and `node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-code/mode-registry.json','utf8'))"` exits 0
- [ ] T008 Reduce the tie-break order to the shipped packets (`.skilled/skills/sk-code/hub-router.json`) · branch `deepseekpi`
  - Edit: line 7 `"tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-skilled", "sk-code-obsidian", "sk-code-webflow"]` becomes `"tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-skilled"]`
  - Anchor: line 7, inside `routerPolicy`
  - Proof: `node -e "console.log(JSON.stringify(require('./.skilled/skills/sk-code/hub-router.json').routerPolicy.tieBreak))"` prints `["sk-code-quality","sk-code-review","sk-code-skilled"]`
- [ ] T009 Delete the `sk-code-webflow` router-signals entry (`.skilled/skills/sk-code/hub-router.json`) · branch `deepseekpi`
  - Edit: delete the `routerSignals` object starting at line 31 (`"sk-code-webflow": {`) through its closing `},` at line 35 only. The `sk-code-skilled` entry at lines 36-40 stays untouched, and so does the blank line at 41
  - Anchor: `"sk-code-webflow": {` at line 31
  - Proof: `node -e "console.log(Object.keys(require('./.skilled/skills/sk-code/hub-router.json').routerSignals).join(','))"` names no removed surface
- [ ] T010 Delete the `sk-code-obsidian` router-signals entry (`.skilled/skills/sk-code/hub-router.json`) · branch `deepseekpi`
  - Edit: delete the `routerSignals` object starting at line 42 (`"sk-code-obsidian": {`) through its closing `}` at line 46, and the blank line at 41 with it. Then drop the comma that would dangle after the last surviving entry: line 40's `},` becomes `}`, because `sk-code-skilled` is now the final `routerSignals` entry and `vocabularyClasses` starts at line 48
  - Anchor: `"sk-code-obsidian": {` at line 42
  - Proof: the T009 proof prints only `sk-code-quality,sk-code-review,sk-code-skilled`
- [ ] T011 Delete the two Webflow vocabulary classes (`.skilled/skills/sk-code/hub-router.json`) · branch `deepseekpi`
  - Edit: delete `"code-webflow-aliases": {` at line 73 through its closing `},`, and `"code-webflow-runtime": {` at line 76 through its closing `},`
  - Anchor: `"code-webflow-aliases"` at line 73, `"code-webflow-runtime"` at line 76
  - Proof: `node -e "console.log(Object.keys(require('./.skilled/skills/sk-code/hub-router.json').vocabularyClasses).join(','))"` names no webflow class
- [ ] T012 Delete the two Obsidian vocabulary classes (`.skilled/skills/sk-code/hub-router.json`) · branch `deepseekpi`
  - Edit: delete `"code-obsidian-aliases": {` at line 89 through its closing `},`, and `"code-obsidian-runtime": {` at line 92 through its closing `}` (facts.md records 89 and 92), plus the blank line above line 89
  - Anchor: `"code-obsidian-aliases"` at line 89, `"code-obsidian-runtime"` at line 92
  - Proof: the T011 proof names no obsidian class, and `node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-code/hub-router.json','utf8'))"` exits 0
- [ ] T013 Regenerate the leaf manifest (`.skilled/skills/sk-code/leaf-manifest.json`) · branch `deepseekpi`
  - Edit: run `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code`. Do not hand-edit the file (today lines 18, 35-36 and 166-271 name the surfaces)
  - Anchor: the generator invocation from the hub README, `README.md:123`
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/leaf-manifest.json` prints nothing
- [ ] T014 Strip the removed surfaces from the machine router (`.skilled/skills/sk-code/ROUTER.md`) · branch `deepseekpihigh`
  - Edit: the file carries both packet names and bare surface tokens, so it is stripped whole. §1: the surface lists at lines 26, 30 and 45 become `SKILLED / UNKNOWN`, and line 35's `(OpenCode vs Obsidian vs Webflow vs UNKNOWN)` parenthetical becomes `(SKILLED vs UNKNOWN)`. The "Bundled Evidence Surfaces" paragraph at line 41 is deleted, because no evidence surface remains. §2: line 96's Motion.dev note keeps MOTION_DEV as a peer intent for SKILLED only and drops the Webflow branch; line 100's `**WEBFLOW**` intent-scoring bullet is deleted. §3: line 112's SURFACE row names `sk-code-skilled` only. §4 `WEBFLOW MAP` (line 119) and §5 `MOTION_DEV MAP` (line 155) are deleted whole, including the implementation-trio contract, the language-standards overlay and every animation resource; the Motion overlay leaves the public hub with the Webflow packet. §7: line 250's WEBFLOW verification row is deleted. §8: line 265's canonical-surface sentence names SKILLED only, and line 271's checklist becomes `(SKILLED or UNKNOWN)`. §9: line 283's DO bullet and line 293's DON'T bullet are deleted. §10: line 300's surface-detection description becomes `SKILLED/UNKNOWN`. §11 (starts at line 307, `INTENT_SIGNALS` at 326, `RESOURCE_MAP` at 351): delete the `OBSIDIAN_PLUGIN` intent key at line 346 and its `RESOURCE_MAP` block at 554-559, delete every path under `sk-code-webflow/` or `sk-code-obsidian/`, then delete each key left with no paths from both maps. Leave the surviving section numbers unchanged: `verify-router-sync.cjs` scans from the first `## N. <NAME> MAP` heading to the literal `## 7. VERIFICATION COMMANDS`, so that heading text must survive even though §4 and §5 are gone
  - Anchor: `## 11. MACHINE-READABLE ROUTER` at line 307, `## 4. WEBFLOW MAP` at line 119, `## 5. MOTION_DEV MAP` at line 155
  - Proof: `rg -n "WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/ROUTER.md` prints nothing, and `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes
- [ ] T015 Replace the hub surface table and surface list (`.skilled/skills/sk-code/SKILL.md`) · branch `deepseekpihigh`
  - Edit: delete the `**sk-code-webflow**` table row at line 36 and the `**sk-code-obsidian**` row at line 38, and delete the two surface-packet lines in the layout block at 164 and 166 (`sk-code-webflow/`, `sk-code-obsidian/`) so `sk-code-skilled/` is the only surface line left. Line 40's surface list becomes one sentence: the hub has exactly one surface, `sk-code-skilled`, the native surface for this framework's own code, plus the two workflow modes `sk-code-quality` and `sk-code-review`
  - Anchor: the `| Surface | Carries | Packet |` table at line 34, the layout block's `sk-code-webflow/` line at 164
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/SKILL.md` prints nothing
- [ ] T016 Fix the discriminator and the hint examples in the same file (`.skilled/skills/sk-code/SKILL.md`) · branch `deepseekpihigh`
  - Edit: line 63's `--surface-hint WEBFLOW` example becomes `--surface-hint SKILLED`; line 70's mode/packet key list drops the two removed ids; line 74's worked example and its SKILLED > OBSIDIAN > WEBFLOW precedence sentence become the SKILLED-only form; line 82's `UNKNOWN_FALLBACK_CHECKLIST` entry drops Webflow and Obsidian. Two paragraphs below the layout block carry the bare tokens: line 139's `Surface detection (SKILLED, OBSIDIAN, WEBFLOW, UNKNOWN, at precedence SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` becomes `Surface detection (SKILLED, UNKNOWN, at precedence SKILLED > UNKNOWN)`, and line 173's backend paragraph names SKILLED and `sk-code-skilled/` only, dropping the OBSIDIAN/WEBFLOW detection list and the `sk-code-webflow/` and `sk-code-obsidian/` evidence paths
  - Anchor: `**Session surface hint.**` at line 63, `- **\`workflowMode\`**` at line 70, the `Surface packets are advisor-invisible` paragraph at line 74, the `UNKNOWN_FALLBACK_CHECKLIST` entry at line 82, `Surface detection (\`SKILLED\`, \`OBSIDIAN\`, \`WEBFLOW\`, \`UNKNOWN\`` at line 139, the `\`surface-router\` backend` paragraph at line 173
  - Proof: the T015 proof prints nothing and `rg -n "WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/SKILL.md` prints nothing
- [ ] T017 Strip the surface markers from the detection contract (`.skilled/skills/sk-code/shared/references/stack-detection.md`) · branch `deepseekpihigh`
  - Edit: line 3 frontmatter description drops WEBFLOW/OBSIDIAN; the marker table rows at 28-30 keep SKILLED only; the Motion.dev peer note at 33 stops naming the webflow packet; precedence at 39 and the branch comments at 45 and 53 collapse to SKILLED > UNKNOWN; the why-paragraphs at 65-83 keep only the SKILLED reasoning; the negative-language guard at 87-97 keeps its rule but loses the Webflow wording; the example tables at 103-105 and 133-146 keep only the SKILLED and UNKNOWN rows
  - Anchor: `description: Surface detection (WEBFLOW/SKILLED/OBSIDIAN/UNKNOWN)` at line 3
  - Proof: `rg -n "WEBFLOW|OBSIDIAN|sk-code-(webflow|obsidian)" .skilled/skills/sk-code/shared/references/stack-detection.md` prints nothing
- [ ] T018 Strip the removed packets from the shared index (`.skilled/skills/sk-code/shared/README.md`) · branch `deepseekpihigh`
  - Edit: line 17's packet list keeps `sk-code-skilled` plus the two workflow modes; line 71's "pattern assets are owned by the Webflow packet" paragraph is deleted, because the shared tier still ships no pattern assets and there is no longer a packet that owns them. Two table-row descriptions carry the bare tokens: line 30's `Surface detection (SKILLED / OBSIDIAN / WEBFLOW / UNKNOWN)` becomes `Surface detection (SKILLED / UNKNOWN)`, and line 52's `across WEBFLOW or SKILLED` becomes `across SKILLED`
  - Anchor: the `shared/` holds-the-routing paragraph at line 17, the no-pattern-assets paragraph at line 71, the `references/stack-detection.md` row at line 30, the `references/universal-verification-checklist.md` row at line 52
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/shared/README.md` prints nothing
- [ ] T019 Strip the per-surface phases from the phase contract (`.skilled/skills/sk-code/shared/references/phase-detection.md`) · branch `deepseekpihigh`
  - Edit: the file names both removed surfaces in its headings, so they go whole. Line 16's surface count sentence becomes the one SKILLED surface, and line 28's "When to Use" bullet becomes "When planning work on the SKILLED surface". Delete §3 `WEBFLOW PHASES` (line 57) and §5 `OBSIDIAN PHASES` (line 87) entire, and delete the `### Cross-Stack Motion.dev Resources` subsection at 81-85 whose path lives in the removed packet; the per-surface implementation row at line 62 and the Obsidian rows at 91-95 go with their sections. Renumber the surviving sections so the sequence has no gap. Keep the SKILLED rows
  - Anchor: the surface count sentence at line 16, the "When to Use" bullet at line 28, `## 3. WEBFLOW PHASES` at line 57, the Motion.dev overlay subsection at line 81, `## 5. OBSIDIAN PHASES` at line 87
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN|Motion\.dev overlay" .skilled/skills/sk-code/shared/references/phase-detection.md` prints nothing, and the surface count sentence names one surface
- [ ] T020 Strip the removed rows from the debugging checklist (`.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`) · branch `deepseekpihigh`
  - Edit: delete the `WEBFLOW` row at line 69 and the WEBFLOW deep-dive bullet at line 91, then rewrite the two surface-agnostic claims that still name it: line 16's `across the WEBFLOW and SKILLED surfaces` becomes `across the SKILLED surface`, and line 22's `(Chrome DevTools for WEBFLOW, package/script diagnostics for SKILLED)` becomes `(package/script diagnostics)`
  - Anchor: the `| WEBFLOW |` row at line 69, the deep-dive bullet at line 91, the frontmatter description at line 16, the purpose paragraph at line 22
  - Proof: `rg -n "WEBFLOW|sk-code-webflow" .skilled/skills/sk-code/shared/references/universal-debugging-checklist.md` prints nothing
- [ ] T021 Strip the removed rows from the verification checklist (`.skilled/skills/sk-code/shared/references/universal-verification-checklist.md`) · branch `deepseekpihigh`
  - Edit: delete the `WEBFLOW` row at line 51 and §4 `WEBFLOW BROWSER MATRIX` (line 57) whole, from its heading through the full-matrix pointer paragraph at line 71, then renumber the sections after it and fix the `Section N` cross-references at line 26, which lose `Section 4`. Five more lines still name the surface: line 16's `across WEBFLOW or SKILLED` becomes `across SKILLED`; line 22's parenthetical becomes `(alignment and test commands for SKILLED)`; line 26's `For WEBFLOW, also walk the browser matrix in Section 4` is deleted; line 36's TEST step becomes `for SKILLED: run targeted unit/integration checks where available`; line 38's `VERIFY (WEBFLOW)` step is deleted. Line 90's anti-pattern bullet, line 106's evidence-line and line 120's related-resource bullet go with the deleted section
  - Anchor: the `| WEBFLOW |` row at line 51, the `## 4. WEBFLOW BROWSER MATRIX` heading at line 57, the matrix paragraph at line 71
  - Proof: `rg -n "WEBFLOW|sk-code-webflow" .skilled/skills/sk-code/shared/references/universal-verification-checklist.md` prints nothing
- [ ] T022 Strip the removed pointers from the loading checklist (`.skilled/skills/sk-code/shared/references/performance-loading-checklist.md`) · branch `deepseekpihigh`
  - Edit: delete the three pointer rows at lines 98-100, which target the Webflow packet's performance references and pattern assets
  - Anchor: the `interaction-gated-loading.md` row at line 98
  - Proof: `rg -n "sk-code-webflow" .skilled/skills/sk-code/shared/references/performance-loading-checklist.md` prints nothing
- [ ] T068 Strip the four universal references (`.skilled/skills/sk-code/shared/references/universal/*.md`) · branch `deepseekpihigh`
  - Edit: apply the removed-packet pointer rule to each file. `code-style-guide.md` lines 24, 39, 120, 225, 234, `error-recovery.md` lines 43, 108, 133 and `multi-agent-research.md` lines 50, 216 name a removed packet; repoint a row at `sk-code-skilled/` where the same guidance exists there, otherwise delete it. The bare surface tokens go too. `code-style-guide.md`: line 3's description becomes `for the SKILLED code surface`; line 58's `WEBFLOW (vanilla JS)` row, line 87's `WEBFLOW JS` file-header row and line 204's `WEBFLOW JS` formatter row are deleted; line 139's `both the SKILLED and WEBFLOW surfaces` becomes `the SKILLED surface`; line 194's `(WEBFLOW JS uses three-line file headers ...; SKILLED TypeScript uses ...)` becomes the SKILLED clause only. Line 151 is the kept `WEBFLOW:` platform tag (the line that also carries `MOTION:` and `LENIS:`) and is the one token line in this file that stays. `error-recovery.md`: line 3's description becomes `across SKILLED routes`; line 88's `WEBFLOW (Node tooling)` row and line 89's `WEBFLOW (Wrangler / R2)` row are deleted. `multi-agent-research.md:172`'s `A WEBFLOW project's performance audit` becomes `A frontend performance audit`. `code-quality-standards.md` lines 16, 24, 49, 56, 82 and 118 carry the `WEBFLOW` surface token instead: each becomes SKILLED-only wording, and line 118's table loses its `WEBFLOW` row
  - Anchor: `Surface-agnostic severity tiers used by the Phase 1.5 Code Quality Gate across WEBFLOW and SKILLED.` at `code-quality-standards.md:16`, `.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/` at `code-style-guide.md:24`, the kept tag line `| A platform / library name (\`WEBFLOW:\`, \`MOTION:\`, \`LENIS:\`) |` at `code-style-guide.md:151`
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/shared/references/universal/` prints only `code-style-guide.md:151`, and `rg -l "WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/shared/references/universal/` lists only `code-style-guide.md`
- [ ] T023 Strip the removed keywords from the hub description (`.skilled/skills/sk-code/description.json`) · branch `deepseekpi`
  - Edit: delete exactly four keywords: line 12 (`"webflow"`), line 46 (`"sk-code-webflow"`), line 49 (`"sk-code-obsidian"`) and line 50 (`"obsidian plugin"`). Leave every other keyword unchanged; the motion.dev keywords are not this phase's, because the advisor's lexical vocabulary is phase 3's
  - Anchor: `"webflow"` at line 12, `"sk-code-webflow"` at line 46, `"sk-code-obsidian"` at line 49, `"obsidian plugin"` at line 50
  - Proof: `rg -n "webflow|obsidian" .skilled/skills/sk-code/description.json` prints nothing, and `node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-code/description.json','utf8'))"` exits 0
- [ ] T024 Fix the two adopter-facing surface lines in the root README (`README.md`) · branch `deepseekpihigh`
  - Edit: two edits, both in the root `README.md`, not in the hub README (T067 owns that file). Line 796's bullet ("One native surface and two optional examples ... The Webflow example covers ... and the Obsidian example covers ...") becomes the one native Skilled surface. Line 1481's paragraph ("`sk-code` ships one native surface and two optional examples ... The Webflow and Obsidian surfaces are examples you can remove, keep as models or replace with your own stack.") becomes one sentence naming the Skilled surface only
  - Anchor: `One native surface and two optional examples.` at line 796, `` `sk-code` ships one native surface and two optional examples. `` at line 1481
  - Proof: `rg -n "two optional examples|Webflow example|Obsidian example" README.md` prints nothing
- [ ] T025 Fix the skill index surface line (`.skilled/skills/README.txt`) · branch `deepseekpihigh`
  - Edit: line 60's `sk-code` row lists `sk-code-webflow` and `sk-code-skilled` as the surface packets. It becomes `sk-code-skilled` only
  - Anchor: the `sk-code` table row at line 60
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/README.txt` prints nothing
- [ ] T067 Fix the hub's own README (`.skilled/skills/sk-code/README.md`) · branch `deepseekpihigh`
  - Edit: delete the two surface table rows at lines 55 and 57 and the example routing row at line 69 that names `[sk-code-review, sk-code-webflow]`; rewrite the "ADAPTING TO YOUR STACK" paragraph at line 106 to the one native Skilled surface; line 119's `<mode>` sentence becomes generic ("`<mode>` is the folder name of the surface packet you drop"); delete the two dead link rows at 191 and 193. Two more lines carry the bare tokens: line 23's `Works on` cell (`the native SKILLED surface and the optional example WEBFLOW and OBSIDIAN surfaces, plus the Motion.dev animation overlay`) becomes the one SKILLED surface, and line 90's `Reach for sk-code` paragraph loses the same phrase. Keep "Before You Start" at 110-115 and the removal procedure at 117-129: they are the adopter recipe and still describe how to drop a surface a reader added
  - Anchor: the `sk-code-webflow` table row at line 55 (its second cell begins `Optional example.`), the `Works on` cell at line 23, the `Reach for sk-code` paragraph at line 90, the `The Skilled surface, at` paragraph at line 106, the `<mode>` sentence at line 119
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/README.md` prints nothing
- [ ] T026 [P] Delete the two surface-detection scenarios (`.skilled/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md`, `.../obsidian-detection.md`) · branch `deepseekpihigh`
  - Edit: `git rm` both files. Their whole content is the removed surface
  - Anchor: the two files at `42b41dd286` (facts.md lists their line sets: webflow 2,3,7,11,13,21,31,40-46,52,61,82-83,90-91,95,101-102,111,113; obsidian 2,3,7,11,13,19,23,27,29,33,35,37,53,57,59,66-68,72-73,80,87-90)
  - Proof: `ls .skilled/skills/sk-code/manual-testing-playbook/surface-detection/` lists only `skilled-detection.md` and `unknown-fallback.md`
- [ ] T027 [P] Delete the two Motion.dev cross-stack scenarios (`.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/webflow-plus-motion-dev.md`, `.../cross-stack-routing/non-webflow-plus-motion-dev.md`) · branch `deepseekpihigh`
  - Edit: `git rm` both files. The first is a Webflow task end to end; the second exists only to protect the Webflow-versus-generic guard and its expected references are all under the removed packet, so nothing survives
  - Anchor: the two files at `42b41dd286` (facts.md line sets: webflow-plus-motion-dev 2,3,7,11,19,24,26-28,33,39-43,47-50,55-56,59-60,69,80,88-89,93-94,102-105; non-webflow-plus-motion-dev 2,3,7,11,19,24,33-36,39-41,44,50-51,54-55,64,83-84,88-89,98-100)
  - Proof: `ls .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/` lists only `cwv-gates-animation-heavy.md`, `decision-matrix-routing.md`, `prefers-reduced-motion.md`, `skilled-plus-motion-dev.md` and `snippet-reuse-cross-stack.md`
- [ ] T028 [P] Remove the removed-surface steps from the remaining cross-stack scenarios (`.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/*.md`) · branch `deepseekpihigh`
  - Edit: for each of `cwv-gates-animation-heavy.md`, `decision-matrix-routing.md`, `prefers-reduced-motion.md`, `skilled-plus-motion-dev.md`, `snippet-reuse-cross-stack.md`: delete every prompt, expected reference, expected asset and expected mode that names a removed surface. When a file has no expectation left, `git rm` it. `skilled-plus-motion-dev.md` keeps the case that a SKILLED plus Motion.dev prompt routes to `sk-code-skilled` and loses the motion-overlay paths. The bare surface tokens go too: `skilled-plus-motion-dev.md` 54, 57, 87, 91; `decision-matrix-routing.md` 24, 48, 82; `snippet-reuse-cross-stack.md` 24, 48, 82; `cwv-gates-animation-heavy.md` 24, 33, 53, 54, 78, 86, 87; `prefers-reduced-motion.md` 24, 33, 53, 54, 78, 86, 87. Each `WEBFLOW` surface name becomes `SKILLED` or `UNKNOWN`, a `# 2. WEBFLOW` scenario heading becomes `# 2. SKILLED`, and an `If WEBFLOW wins` triage step is deleted. A scenario whose entire point is Webflow performance is deleted rather than rewritten, because the surface it measures no longer ships
  - Anchor: the files listed by `rg -l "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/`, and the token lines listed above
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/` prints nothing
- [ ] T029 [P] Remove the removed-surface rows from the browser and performance gates (`.skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates/*.md`) · branch `deepseekpihigh`
  - Edit: apply the removed-packet pointer rule to `cross-browser-animate.md`, `cwv-gates.md`, `gpu-compositing.md`; delete a file only when no row survives
  - Anchor: the files listed by `rg -l "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates/`
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates/` prints nothing
- [ ] T030 [P] Remove the removed-surface rows from the motion and animation scenarios (`.skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/*.md`) · branch `deepseekpihigh`
  - Edit: apply the removed-packet pointer rule to `animation-regression-baseline.md`, `cdn-bundle-version-pin.md`, `motion-api-smoke.md`, `prefers-reduced-motion.md`
  - Anchor: the files listed by `rg -l "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/`
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/` prints nothing
- [ ] T031 [P] Remove the removed-surface rows from detection, disambiguation and compiled-routing scenarios (`.skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md`, `.../surface-detection/unknown-fallback.md`, `.../routing-disambiguation/mixed-marker-ambiguity.md`, `.../compiled-routing/surface-bundle-compiled-routing.md`) · branch `deepseekpihigh`
  - Edit: apply the removed-packet pointer rule to each file, and strip the bare tokens. `skilled-detection.md:97`'s `the WEBFLOW markers (motion.dev, GSAP, etc.) MUST NOT match` becomes `a generic library marker (motion.dev, GSAP, etc.) MUST NOT match`. `unknown-fallback.md:11`'s supported-stack sentence becomes `supported stacks are SKILLED`, the framework's own system code, and line 31's `no WEBFLOW or SKILLED markers` becomes `no SKILLED markers`. `mixed-marker-ambiguity.md` loses its premise once one surface remains — `git rm` it and let T032 delete its row at line 221; if a writer keeps it, every one of its tokens at 3, 11, 13, 18, 34, 39, 41, 43 and 76 is reframed as a SKILLED path versus a generic library marker. `surface-bundle-compiled-routing.md` keeps a single-surface bundle case
  - Anchor: the four files listed by `rg -l "sk-code-(webflow|obsidian)"` in those three directories, and `mixed-marker-ambiguity.md`'s token lines 3-76
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/manual-testing-playbook/surface-detection/ .skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/ .skilled/skills/sk-code/manual-testing-playbook/compiled-routing/` prints nothing
- [ ] T069 Fix the two live playbook files outside those globs (`.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md`, `.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md`) · branch `deepseekpihigh`
  - Edit: `design-restraint-ladder.md:13` still states the precedence `SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN`; it becomes `SKILLED > UNKNOWN`. `advisor-probe-battery.md` rows P12-P17 at lines 38-43 are the Webflow and Obsidian probes: delete those six rows, keep the SKILLED rows and the negative controls, and renumber nothing else. Leave `tooling-and-hooks/comment-hygiene-hook.md` untouched; its `WEBFLOW:` mention is the kept tag vocabulary
  - Anchor: `changes neither surface precedence (SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` at `design-restraint-ladder.md:13`, the `| P12 | WEBFLOW |` row at `advisor-probe-battery.md:38`
  - Proof: `rg -n "WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/manual-testing-playbook/design-restraint/ .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/` prints nothing
- [ ] T032 Delete the removed scenarios' rows from the playbook index (`.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`) · branch `deepseekpihigh`
  - Edit: delete every row that links a file removed by T026-T031 and every row or bullet whose expected mode names a removed surface (facts.md line set 28,43,49,51,77,80,83,93,147,187,195,198,221,238,240,242,246-249,251,257,261-263,271,275-281,353-356,370,373,381-384,388-390,394). The line set mixes prose bullets and index rows: the bullets at 43, 83, 93 and 187 are rewritten or deleted, and the index rows at 195 (SD-001), 198 (SD-004), 221 (RD-001), 275 (CS-001), 276 (CS-002), 277 (CS-003) and 281 (CS-007) are deleted or rewritten so no WEBFLOW/OBSIDIAN token survives. Do not assume every hit is a table row
  - Anchor: the scenario index table that starts in the first third of the file; locate each row by its link target, and the prose bullets at lines 43, 83, 93 and 187 by their text
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` prints nothing, and every link in the file resolves
- [ ] T033 Fix the live sk-code setup playbook (`.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md`) · branch `deepseekpihigh`
  - Edit: lines 48, 50 and 52 name the removed surfaces in the expected doctor output. Rewrite the expected output to the three-packet hub. Do not touch `doctor-sk-code-pre-v4-checkout.md`; it is a D6 kept historical record
  - Anchor: `doctor-sk-code-setup.md` lines 48-52
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md` prints nothing
- [ ] T034 [P] Remove the removed-packet pointers from the quality checklists (`.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/*.md`) · branch `deepseekpihigh`
  - Edit: apply the removed-packet pointer rule to every `../../../sk-code-webflow/...` link. `naming-init-formatting-and-css.md` lines 34, 94, 144, 161; `overview-header-and-comments.md` lines 50-54, 62, 105, 166 and the cross-stack motion note at 179; `verification-quick-reference-and-related.md` lines 122-126, 130. Two bare tokens remain in `overview-header-and-comments.md`: line 173's platform-constraint list `(WEBFLOW, MOTION, LENIS, HLS.JS)` becomes `(MOTION, LENIS, HLS.JS)`, and line 193's example comment `// WEBFLOW: Page transitions may re-execute scripts` becomes a Motion-tagged example that states a durable constraint, `// MOTION: Animation runs only when prefers-reduced-motion is not set`
  - Anchor: `**Reference:** [code-style-guide.md Section 2](../../../sk-code-webflow/...)` at `naming-init-formatting-and-css.md:34`, the platform list at `overview-header-and-comments.md:173`, the example comment at `overview-header-and-comments.md:193`
  - Proof: `rg -n "sk-code-webflow|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` prints nothing
- [ ] T035 [P] Fix the quality skill's own surface references (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `.skilled/skills/sk-code/sk-code-quality/README.md`) · branch `deepseekpihigh`
  - Edit: `SKILL.md:15` names the surface skill as `sk-code-webflow` / `sk-code-skilled` / `sk-code-obsidian`; it becomes `sk-code-skilled`. Apply the same rewrite to every remaining mention in both files (facts.md line sets: SKILL.md 11,15,28-29,37,48,68,70,91,93,113,128-132,190,192,196,225,278,289,323-326; README.md 26,47,53,59,61,89,108,133). The bare tokens go with the packet names: line 29's `when the surface resolves to OBSIDIAN` clause, line 68's `WEBFLOW target` branch, line 70's `OBSIDIAN target` branch, line 93's Obsidian checklist paragraph, line 113's CONDITIONAL row and line 192's Obsidian load step are all deleted, leaving SKILLED and the shared universal tier
  - Anchor: `sk-code-webflow` / `sk-code-skilled` / `sk-code-obsidian` at `SKILL.md:15`, the `+- WEBFLOW target` branch at line 68
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md` prints nothing
- [ ] T070 Fix the Skilled surface's sibling references (`.skilled/skills/sk-code/sk-code-skilled/README.md`, `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`) · branch `deepseekpihigh`
  - Edit: `README.md` line 36's "Its sibling `sk-code-webflow` carries frontend and browser evidence instead", line 91's sibling-surface row and line 104's both-surfaces row all describe a packet that no longer exists; apply the removed-packet pointer rule to each. `SKILL.md:55` names the sibling map in a comment; delete the clause. Hermes carries a copy of both files, so T060 must run after this task
  - Anchor: `sk-code-webflow` in the sibling sentence at `README.md:36`, `the sibling sk-code-webflow map` at `SKILL.md:55`
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/sk-code-skilled/README.md .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing
- [ ] T036 [P] Fix the feature catalog's live-surface claim (`.skilled/skills/sk-code/feature-catalog/feature-catalog.md`) · branch `deepseekpihigh`
  - Edit: line 15's surface list becomes `sk-code-skilled`; line 35's `Current Reality` sentence drops the removed packets
  - Anchor: `bundles zero-or-more read-only SURFACE evidence packets` at line 15, `are advisor-invisible SURFACE packets` at line 35
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/feature-catalog/feature-catalog.md` prints nothing
- [ ] T037 [P] Fix the two-axis explainer's worked example (`.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`) · branch `deepseekpihigh`
  - Edit: line 26 names the three surfaces and the worked bundle `[sk-code-review, sk-code-webflow]`. It becomes one surface and a SKILLED bundle
  - Anchor: `The SURFACE axis is read-only domain evidence` at line 26
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/feature-catalog/` prints nothing
- [ ] T038 Fix the compiled-route surface-hint test (`.skilled/bin/tests/compiled-route-surface-hint.test.cjs`) · branch `deepseekpi`
  - Edit: lines 22-112 hold the surface fixtures. `WEBFLOW_TESTING`, `WEBFLOW_LANGUAGE` and `OBSIDIAN_WEBFLOW` become SKILLED or neutral prompts that still exercise the hint, and `REVIEW_TWO_SURFACES` becomes a single-surface review case. The final assertion that expects `['sk-code-webflow', 'sk-code-skilled']` becomes `['sk-code-skilled']`
  - Anchor: `const WEBFLOW_TESTING =` at line 22 (line 24 is `OBSIDIAN_WEBFLOW`); the closing assertion that expects the two-mode array
  - Proof: `node .skilled/bin/tests/compiled-route-surface-hint.test.cjs` exits 0
- [ ] T039 Fix the canary fixture and its authored twin (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`) · branch `deepseekpi`
  - Edit: lines 68-270 name the removed modes in `expectedModes` and `expectedIntents`. Rewrite each affected case to the surviving modes, or delete the case when its only purpose was a removed surface. Then copy the file over its twin at `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
  - Anchor: `"sk-code-webflow"` in an `expectedModes` array at line 68
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` prints nothing, and `diff` against the twin prints nothing
- [ ] T071 Neutralise the canary router's surface-label comment (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs`) · branch `deepseekpi`
  - Edit: line 233's comment reads `// label such as WEBFLOW or as a workflowMode`. It becomes `// label such as SKILLED or as a workflowMode`, because the label is a surface name and the only shipped surface is SKILLED. Change the comment only; `hintedSurface` and every code line stay as they are. No spec path, packet number or phase number enters the comment
  - Anchor: `// label such as WEBFLOW or as a workflowMode` at line 233, in the comment above `function hintedSurface`
  - Proof: `rg -n "WEBFLOW|OBSIDIAN" .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` prints nothing, and `node .skilled/bin/tests/compiled-route-surface-hint.test.cjs` still exits 0
- [ ] T040 Fix the quality typo test's minify case (`.skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh`) · branch `deepseekpi`
  - Edit: line 12 sets `MINIFY_WEBFLOW="$SKILL/sk-code-webflow/assets/scripts/minify-webflow.mjs"`; lines 89-90 run the minify case against it. Delete the variable and the whole minify case
  - Anchor: `MINIFY_WEBFLOW=` at line 12, `run_case "minify-webflow.mjs rejects a misspelled --forse flag"` at line 89
  - Proof: `bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh` exits 0 and `rg -n "WEBFLOW" .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh` prints nothing
- [ ] T041 Fix the replay library's surface prefixes (`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs`) · branch `deepseekpi`
  - Edit: lines 485-516 hold `SURFACE_PREFIXES` (MOTION and WEBFLOW keys) and `detectSurface` (an `opencode`/`webflow` pair). Remove the MOTION and WEBFLOW prefixes, keep `SKILLED`, and collapse `detectSurface` to SKILLED or UNKNOWN. Line 610's `hasSurfaceLayout` check requires a `sk-code-webflow/references/` path; it becomes a SKILLED-only check
  - Anchor: `const SURFACE_PREFIXES = {` at line 485, `const hasSurfaceLayout` at line 610
  - Proof: `rg -n "sk-code-webflow|WEBFLOW" .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` prints nothing, and T043's `verify-router-sync.test.cjs` run passes
- [ ] T042 Fix the router-sync guard's surface lists and prose scan (`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`) · branch `deepseekpi`
  - Edit: lines 33-34 already filter with `onDisk`, so they keep working; remove the now-dead `sk-code-webflow` / `sk-code-obsidian` literals from `SURFACES` and `SURFACE_PACKETS`. Line 135's prose-scan regex matches a `webflow/` resource prefix; drop that alternative
  - Anchor: `const SURFACES = ['sk-code-webflow', 'sk-code-skilled'].filter(onDisk);` at line 33, the prose regex at line 135
  - Proof: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` exits 0 and prints `router-sync: 5/5 checks passed`
- [ ] T043 Fix the router-sync test's expectations (`.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`) · branch `deepseekpi`
  - Edit: lines 102, 109, 153, 162 and 165 build or assert a hub whose surface set includes a removed packet. Rewrite each fixture to the three-packet hub and keep both the passing and failing legs of each case
  - Anchor: the first fixture that names a removed surface; locate it with `rg -n "sk-code-(webflow|obsidian)"` in the file
  - Proof: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` exits 0
- [ ] T044 Fix the doc-claims test's expectations (`.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs`) · branch `deepseekpi`
  - Edit: lines 58, 61-62, 97, 100, 106 and 109 build fixtures that name the removed packets. Rewrite them to the three-packet hub, keeping one case that still proves a stale surface count fails
  - Anchor: the first fixture that names a removed surface; locate it with `rg -n "sk-code-(webflow|obsidian)"` in the file
  - Proof: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs` exits 0
- [ ] T045 [P] Fix the review skill's surface references (`.skilled/skills/sk-code/sk-code-review/SKILL.md`) · branch `deepseekpihigh`
  - Edit: lines 39, 42 and 499 list the three surface packets. Each becomes `sk-code-skilled`. Apply the same rewrite to the remaining mentions in facts.md's line set (39, 42, 58, 224-231, 234, 252-264, 375, 499)
  - Anchor: `load the surface packet (\`sk-code-webflow\`, \`sk-code-skilled\` or \`sk-code-obsidian\`)` at line 39
  - Proof: `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .skilled/skills/sk-code/sk-code-review/SKILL.md` prints nothing. The token lines are 58, 224-231, 234, 252-264 and 375: the `OBSIDIAN_*` and `WEBFLOW_*` marker constants, the `detect_surface_evidence` branches, the precedence sentence and the evidence-used template all collapse to SKILLED or UNKNOWN
- [ ] T046 [P] Fix the review README's surface rows (`.skilled/skills/sk-code/sk-code-review/README.md`) · branch `deepseekpihigh`
  - Edit: line 153's table row and line 188's answer both list the three packets. Each becomes `sk-code-skilled`
  - Anchor: the `| \`sk-code-webflow\` / \`sk-code-skilled\` / \`sk-code-obsidian\` |` row at line 153, the answer at line 188
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-code/sk-code-review/README.md` prints nothing
- [ ] T047 [P] Fix the review core's surface pairings (`.skilled/skills/sk-code/sk-code-review/references/review-core.md`) · branch `deepseekpihigh`
  - Edit: line 68 pairs `SKILLED`, `OBSIDIAN` and `WEBFLOW` with their packets. It becomes the single SKILLED pairing
  - Anchor: `Detected code surface -> \`SKILLED\`, \`OBSIDIAN\` or \`WEBFLOW\`` at line 68
  - Proof: `rg -n "sk-code-(webflow|obsidian)|OBSIDIAN|WEBFLOW" .skilled/skills/sk-code/sk-code-review/references/review-core.md` prints nothing
- [ ] T048 Fix the doctor's example-surface list (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`) · branch `deepseekpi`
  - Edit: line 1229 `const SK_CODE_EXAMPLE_SURFACES = ['sk-code-obsidian', 'sk-code-webflow'];` becomes an empty array, and the comment above it at lines 1223-1228 stops describing "the two shipped example surfaces". The check keeps failing a hand-added surface that sorts after the native one
  - Anchor: `const SK_CODE_EXAMPLE_SURFACES` at line 1229
  - Proof: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` exits 0 and prints `OK: parent-skill-check — all hard invariants passed`, and `rg -n "sk-code-(webflow|obsidian)" .skilled/commands/doctor/scripts/parent-skill-check.cjs` prints nothing
- [ ] T049 Fix the doctor invariants test (`.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`) · branch `deepseekpi`
  - Edit: lines 491-500 build a hub with both examples to prove check 5l passes on the shipped order. Rewrite both cases to the three-packet hub: one case still proves a hand-added `sk-code-acme` after `sk-code-skilled` fails, the other proves the shipped order passes
  - Anchor: `addNamedSurfaces(hub, ['sk-code-skilled', 'sk-code-obsidian', 'sk-code-webflow', 'sk-code-acme'])` at line 491
  - Proof: `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` exits 0
- [ ] T050 Neutralise the leaf-resource fixture surface (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs`) · branch `deepseekpi`
  - Edit: lines 355-392 use `sk-code/sk-code-webflow/sk-code-webflow/surface/evidence-base` as the qualified-id fixture. Rename that fixture surface to `sk-code-acme` everywhere in the file so the test stops depending on a packet the repo no longer ships
  - Anchor: `qualifiedIdToLeaf('sk-code/sk-code-webflow/sk-code-webflow/surface/evidence-base')` at line 355
  - Proof: `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` exits 0 and `rg -n "sk-code-webflow" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` prints nothing
- [ ] T051 Fix the adopter upgrade reference (`.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`) · branch `deepseekpihigh`
  - Edit: line 72 names `sk-code-webflow` and `sk-code-skilled` as the shipped surface packets; it becomes `sk-code-skilled`. Line 134's surface-folder example names `sk-code-webflow`; use a neutral example such as `sk-code-acme`
  - Anchor: `Surface packets \`sk-code-webflow\` and \`sk-code-skilled\` are read-only evidence` at line 72, the surface-folder paragraph at line 134
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` prints nothing
- [ ] T052 Fix the recorded-picks fixture (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl`) · branch `deepseekpi`
  - Edit: lines 28-30 record three picks for row `f020-010` as `sk-code-webflow`. Repoint the row to a surviving mode that still makes the fixture's point, or delete the three rows and the row they belong to. Keep the file valid JSONL
  - Anchor: `{"row_id":"f020-010","order":0,"pick":"sk-code-webflow","status":"measured"}` at line 28
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl` prints nothing, and `python3 -c "import json,sys;[json.loads(l) for l in open('.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl') if l.strip()]"` exits 0
- [ ] T053 Rebuild the README verdict baseline (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`) · branch `deepseekpi`
  - Edit: run `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py --write`, which rebuilds the baseline from every tracked README. Do not hand-edit the file; its own docstring reserves `--write` for a deliberate tree change, which this is
  - Anchor: `BASELINE = TESTS / "code-folder/baseline-readme-verdicts.json"` in `test_readme_verdict_parity.py`
  - Proof: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` prints `PARITY PASS: verdict diff is empty`, and `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` prints nothing
- [ ] T054 Fix the cite-drift redirect rows (`.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json`) · branch `deepseekpi`
  - Edit: line 259 is the redirect whose `to` is `.opencode/skills/sk-code/sk-code-webflow/`; lines 3960-3961 are the redirect from `specs/sk-code/025-sk-code-obsidian-surface/` to `specs/sk-code/007-sk-code-obsidian-surface/`. Delete the two rows. A redirect whose target no longer exists must not stay
  - Anchor: the `"to": ".opencode/skills/sk-code/sk-code-webflow/"` row at line 259, the obsidian spec redirect at 3960-3961
  - Proof: `node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json','utf8'))"` exits 0, and `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json` prints nothing
- [ ] T055 Fix the playbook fail-closed allowlist (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`) · branch `deepseekpi`
  - Edit: line 33 `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook` and line 37 `.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook` name folders that no longer exist. Delete both lines
  - Anchor: line 33 and line 37
  - Proof: `rg -n "sk-code-(webflow|obsidian)" .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` prints nothing, and `git diff --stat` on the file shows 2 deletions and no insertions
- [ ] T056 Fix the markdown-link allowlist row (`.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`) · branch `deepseekpi`
  - Edit: line 73 exempts an illustrative link inside `sk-code-webflow/references/performance/webflow-constraints.md`. The referring file is gone, so delete the row and its comment line at 72 if the comment only describes it
  - Anchor: `.skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md::/specs/005-example.com/...` at line 73
  - Proof: `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` exits 0 and prints `OK — 0 broken markdown links.`
- [ ] T057 Close the doc-claims gate (`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs`) · branch `deepseekpi`
  - Edit: run it and fix every dead path and stale surface count it lists. Do not edit the checker to silence a finding
  - Anchor: `RETIRED_NAMES` at line 37 already covers the retired packet names; the findings come from the hub documents
  - Proof: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` exits 0 and prints `doc-claims: 4/4 checks passed` with no `FAIL` line
- [ ] T058 Regenerate the skill-derived metadata (`.skilled/skills/sk-code/graph-metadata.json`) · branch `deepseekpi`
  - Edit: run `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`. That prunes `key_files`, `source_docs` and `entities`, but it preserves `domains`, `intent_signals` and `derived.trigger_phrases`, so hand-edit those. Delete exactly these entries: in `domains`, `"webflow"` (line 56) and `"obsidian-plugin"` (line 81); in `intent_signals`, `"webflow"` (86), `"obsidian plugin"` (126), `"obsidian plugin source"` (127), `"note database plugin"` (128), `"obsidian plugin design system"` (129) and `"obsidian plugin conventions"` (161); in `derived.trigger_phrases`, `"webflow frontend workflow"` (174) and `"obsidian plugin"` (184); in `derived.key_topics`, `"webflow"` (190) and `"obsidian-plugin"` (206). Then rewrite `causal_summary` at line 282 so it describes two workflow modes and one surface
  - Anchor: `"webflow"` in `domains` at line 56, `"causal_summary": "sk-code is the single public code skill that routes ... one of three read-only surface evidence packets` at line 282
  - Proof: `rg -n -i "webflow|obsidian" .skilled/skills/sk-code/graph-metadata.json` prints nothing. The proof stays case-insensitive on purpose: these keys are lowercase, so a case-sensitive `sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN` grep misses every one of them
- [ ] T059 Freeze the durable directory manifest (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`) · branch `deepseekpi`
  - Edit: run `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write`
  - Anchor: the generator invocation from the hub README, `README.md:128`
  - Proof: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py` prints `manifest=reproducible`, and re-running `--write` produces no further diff
- [ ] T060 Refresh the Hermes copies (`.hermes/skills/sk-code-webflow/`, `.hermes/skills/sk-code-obsidian/`, `.hermes/skills/sk-code*/`) · branch `deepseekpi`
  - Edit: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`
  - Anchor: the sync invocation from the hub README, `README.md:128`
  - Proof: `ls .hermes/skills/ | grep -E "sk-code-(webflow|obsidian)"` prints nothing, `rg -n "sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN" .hermes/skills/sk-code*` prints nothing because the Hermes copies carry only `SKILL.md` and no kept tag line lives there, and `git status --porcelain .hermes` shows the expected updated copies
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and commit

- [ ] T062 Run the hub's four suites, read-only · branch `deepseekpi`
  - Edit: none
  - Anchor: the four files below
  - Proof: `node .skilled/bin/tests/compiled-route-surface-hint.test.cjs`, `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`, `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs` and `bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh` all exit 0
- [ ] T063 Run the cross-skill suites and the live routing probe, read-only · branch `deepseekpi`
  - Edit: none
  - Anchor: the doctor and sk-doc suites, then the advisor CLI
  - Proof: `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true` exits 0 first, because `advisor_recommend` reads the existing graph and never rebuilds, so a probe against a missing or pre-phase database proves nothing. Then `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` exit 0, and `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a typescript script"}' --format json` returns `sk-code` with `sk-code-skilled` among its targets
- [ ] T064 Prove the D6 kept records are untouched, read-only · branch `deepseekpi`
  - Edit: none. The proof covers only the surviving records. T004 deletes 20 `changelog/` and `benchmark/reports/` files inside `sk-code-webflow/` and 5 more inside `sk-code-obsidian/`, and T039 and T061 copy the canary fixture and the activation manifest over their `z_archive` twins, so a whole-tree diff over those four globs cannot be empty
  - Anchor: the kept paths from spec.md's scope boundary, narrowed to the records that survive the two deleted surface folders
  - Proof: `git diff --name-only 42b41dd286 -- '.skilled/skills/sk-code/changelog/**' '.skilled/skills/sk-code/sk-code-quality/changelog/**' '.skilled/skills/sk-code/sk-code-review/changelog/**' '.skilled/skills/sk-code/sk-code-skilled/changelog/**' '.skilled/skills/sk-code/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-quality/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-review/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-skilled/benchmark/reports/**' '.skilled/changelog/**' '.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-*' '.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/**'` prints nothing, and `git diff --name-only 42b41dd286 -- 'specs/**/z_archive/**' | rg -v 'canary-cases\.v1\.json|013-live-activation/activation/sk-code/manifest\.json'` prints nothing, because those two authored twins are the expected diff
- [ ] T065 Reviewer pass: a separate read-only DeepSeek session on branch `deepseekpi`, at most two rounds · branch `deepseekpi`
  - Edit: none. The reviewer reads the phase diff against `42b41dd286`, checks each task's proof command output, and reports findings ranked P0/P1/P2. A P0 finding returns to the owning task; the writer fixes it and the reviewer re-reads once. After the second round, remaining P2 findings are recorded in `implementation-summary.md` as known limitations
  - Anchor: `tasks.md`, `acceptance-criteria.md` and the phase diff
  - Proof: the reviewer's report names each acceptance criterion `Met`, `Unmet` or `Waived` with the command it ran
- [ ] T066 Close the phase gate, read-only · branch `deepseekpi`
  - Edit: none
  - Anchor: this folder
  - Proof: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict` prints `RESULT: PASSED`; record the line in `implementation-summary.md`
- [ ] T061 Commit and push the phase last, with the hooks installed (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`) · branch `deepseekpi`
  - Edit: T061 runs after T062-T066, so the suites, the reviewer and the validator have all seen the final tree and every fix they named is already on disk. Stage the phase's files by name and commit with a prose body. The hook re-mints the compiled-routing manifest and copies it to its authored twin. If the hooks are not active, run `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`, then copy `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` over `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`. Then push the commit to `main`: `git push HEAD:main`. No fix may follow this task; a reviewer finding that arrives after it is fixed and the commit amended before the push, never left uncommitted
  - Anchor: the manifest pair named in the hub README, `README.md:114`
  - Proof: `git status --porcelain` is empty after the commit and the push; `diff` between the manifest and its twin prints nothing; `git rev-parse HEAD` equals `git rev-parse origin/main`; and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict` still prints `RESULT: PASSED` from the committed state
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `verify-doc-claims.cjs` exits 0 with no output
- [ ] Every suite in T062 and T063 exits 0
- [ ] The kept-record proof in T064 shows the D6 records byte-identical
- [ ] The reviewer pass in T065 reports every acceptance criterion `Met` or names the waiver
- [ ] The phase gate in T066 prints `RESULT: PASSED`
- [ ] T061 ran last: the commit is pushed to `main`, `git status --porcelain` is empty, and `git rev-parse HEAD` equals `git rev-parse origin/main`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
- **Predecessor**: See `../001-ignore-and-commit-guard/`
- **Successor**: See `../003-advisor-vocabulary-cleanup/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Baseline file list from T003 captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `mode-registry.json` and `hub-router.json` parse and name only the three shipped packets
- [ ] CHK-011 [P0] No hand edit to a generated file: `leaf-manifest.json`, the derived metadata, the README manifest, the Hermes copies and the compiled-routing manifest
- [ ] CHK-012 [P1] No planned code comment names a spec path, packet number or phase number
- [ ] CHK-013 [P1] `ROUTER.md` section 11 has no key left with an empty path list
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `verify-doc-claims.cjs` exits 0 with no output
- [ ] CHK-022 [P1] Every suite in T062 and T063 exits 0
- [ ] CHK-023 [P1] The D6 kept records are byte-identical to `42b41dd286`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding has a class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: both registries, the leaf manifest, `ROUTER.md` and every hub document that names a surface, grepped with both `sk-code-(webflow|obsidian)` and `WEBFLOW|OBSIDIAN`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: the doctor, the sk-doc fixtures and references, the baselines, the redirects, the allowlists and the README surface lines.
- [ ] CHK-FIX-004 [P0] The router-projection invariant is tested: the parent map equals the union of the remaining surface maps, with no orphan key and no path that fails to resolve.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: two surfaces x six consumer classes, every cell owned by a task.
- [ ] CHK-FIX-006 [P1] Hostile-state variant executed: `git add -f` of a removed-packet path is refused by the phase 001 guard.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase commit SHA, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No private content is written by this phase; the only content movement is a deletion from the tracked tree
- [ ] CHK-032 [P1] The commit guard from phase 001 is present and active before the commit
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [ ] CHK-041 [P1] No planned code comment names this packet or phase
- [ ] CHK-042 [P2] The hub README's own removal procedure still describes what was done
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `/tmp`, never in the repo tree, because `scratch/` is not gitignored and T061's proof requires an empty `git status --porcelain`
- [ ] CHK-051 [P1] `scratch/` holds nothing but its `.gitkeep` before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---

