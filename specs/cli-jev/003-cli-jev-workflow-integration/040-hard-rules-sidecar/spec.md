---
title: "Feature Specification: Phase 40: hard-rules-sidecar"
description: "Nine skills keep their dispatch hard rules in SKILL.md frontmatter, a field Claude Code ignores and sk-doc's frontmatter contract never names, so only this repo's own hooks read it. This phase moves every rule, unchanged, into a `hard-rules.json` sidecar beside its SKILL.md, repoints every reader and test, and documents where hard rules live, with enforcement identical before and after."
trigger_phrases:
  - "hard rules sidecar"
  - "skill frontmatter hard rules"
  - "dispatch rule checks sidecar"
  - "hard-rules json"
  - "hard rule reader repoint"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 40: hard-rules-sidecar

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-30 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 40 of 40 |
| **Predecessor** | 039-hub-cleanup |
| **Successor** | 041-code-readmes-and-routing-alignment |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: the nine skills hold `hard-rules.json` and a grep for `^hard_rules:` in any SKILL.md finds nothing, the engine and every reader read the sidecar while their suites stay green, the recorded before-and-after run of the engine over a fixed command set matches for every skill, sk-doc's frontmatter contract names the sidecar and `validate_document.py` is VALID on every changed doc, `sync-skills-hermes.cjs --check` passes, and `validate.sh --strict` prints `RESULT: PASSED` for this phase. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 40** of the cli-jev workflow integration specification. The operator raised the question on 2026-09-30: "you have hard rules in skill frontmatter? Thats not supported or something we should do". Asked to choose, the operator picked "Move rules out of frontmatter": "Put the rules in each SKILL.md body or a sidecar file and change the hook to read them there. This is larger and touches sk-git and 7 cli-* skills outside this packet."

The session chose the sidecar, a `hard-rules.json` beside each SKILL.md, for one reason: the rule engine is deliberately dependency-free and fail-open (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:1-7`), and JSON parses with `JSON.parse` without a YAML or markdown parser. The spec may name the file differently if the design finds a reason and records it.

The operator's "2-3 sentences" brief for this phase fixes the outcome: move every rule, unchanged, into the sidecar, repoint every reader and test, and document where hard rules live, with enforcement identical before and after.

Phase 039 renames the Jev packet path first, so `cli-classifier/cli-usage` becomes `cli-classifier/cli-jev` before this phase moves its rules. Phase 039 is still a Draft scaffold in this tree, and the parent phase map lists it as this phase's predecessor.

**Scope Boundary**: the nine sidecar files and the `hard_rules` removal from their nine SKILL.md files, the engine, the 10 reader files of section 3, the five test files of section 3 that read a SKILL.md or assert on the frontmatter text, the sk-doc frontmatter contract and skill template edits of section 3, and this phase's own record. No rule's meaning, id, check or severity changes, no rule is added, and the unrelated `hardRules` field in sk-design is untouched.

**Dependencies**:
- Phase 039 (`039-hub-cleanup`), which renames `cli-classifier/cli-usage` to `cli-classifier/cli-jev` and runs first. UNKNOWN until 039 is built: the exact post-rename path the design reads, and whether 039 changes the `cli-classifier` row of `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` (it reads `packetPath: 'cli-classifier/cli-usage'` in this tree).
- Nine SKILL.md files that declare `hard_rules:` in frontmatter (the list is in section 2).
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` (347 lines) with `parseHardRules` at `:29`, `readHardRules` at `:61`, `CHECKS` at `:164` and `evaluate` at `:318`.
- Node (ESM `.mjs` and `.ts` under the pi and sk-git trees) with the repo's own test runners, `node --test` and the sk-git suites.
- Build roles: parent D5 through this phase's D6. DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews, no Claude worker.
- No install is needed. Every command in the proof plan runs from the repo root.

**Deliverables**:
- `hard-rules.json` beside each of the nine SKILL.md files, holding that skill's rules copied exactly (proposed name and proposed shape, section 4).
- The nine SKILL.md frontmatter blocks with the `hard_rules` key removed and every other byte kept.
- The engine change that reads the sidecar, keeps the fail-open contract and deletes the frontmatter parse (proposed in section 4, fixed by the design).
- Every reader and test of section 3 moved to the sidecar in the same change, with the reader rows of section 3 updated in the inventory table.
- The `before/` and `after/` verdict records of the fixed command set under `scratch/verify/`, one row per skill, compared.
- The sk-doc edits of section 3 that say where hard rules live, each VALID under `validate_document.py`.
- Every gate result and the per-skill rule count recorded in `implementation-summary.md` and `goal.md`'s log.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nine SKILL.md files declare `hard_rules:` in frontmatter: `sk-git`, `cli-classifier/cli-usage` (renamed to `cli-classifier/cli-jev` by phase 039, which runs first) and `cli-external-orchestration/` `cli-opencode`, `cli-cursor`, `cli-codex`, `cli-hermes`, `cli-devin`, `cli-claude-code` and `cli-pi`. A read of this tree on 2026-09-30 counts 50 rules across them, each with `id`, `check`, `message` and `severity`: 17 in `sk-git/SKILL.md`, 8 in `cli-usage/SKILL.md`, 8 in `cli-hermes/SKILL.md`, 5 in `cli-opencode/SKILL.md`, 4 in `cli-pi/SKILL.md`, and 2 each in `cli-claude-code`, `cli-codex`, `cli-cursor` and `cli-devin`.

Claude Code ignores unknown SKILL.md frontmatter keys, so the field works only because this repo's own hooks read it. sk-doc's frontmatter contract (`.skilled/skills/sk-doc/sk-create-frontmatter/`) never mentions `hard_rules`, and a grep under `.skilled/skills/sk-doc/` finds nothing. The engine that reads the field parses YAML by hand, one key deep, because it is deliberately dependency-free (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:1-7`). So the declaration sits in a field the runtime does not support, named by no contract, and read by a hand-rolled parser.

The readers are load-bearing on three runtimes. `.claude/settings.json:47` registers the claude preflight as a PreToolUse hook, `.codex/hooks.json:69` and `.devin/hooks.v1.json:72` register the same adapter on their runtimes, so a regression here silently stops enforcement on three runtimes rather than failing loudly.

### Purpose

Move every rule, unchanged, into a `hard-rules.json` sidecar beside its SKILL.md, repoint every reader and test in the same change, and document where hard rules live, with enforcement identical before and after.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The nine `hard-rules.json` sidecars, one beside each SKILL.md that declares `hard_rules:` today, each holding that skill's rules copied exactly and in order.
- The `hard_rules` key removed from the nine SKILL.md frontmatter blocks, with every other byte of each doc kept.
- The engine: read the sidecar, keep the fail-open contract, and delete the frontmatter parse once every skill has moved, with no dual read left behind (D3).
- The 10 reader files and five test files of the inventory below, all moved in the same change.
- The recorded before-and-after verdict run (D4) under `scratch/verify/`, one fixed command set per skill.
- The sk-doc edits of section 3 that say where hard rules live.
- A Hermes check: `sync-skills-hermes.cjs --check` passes, and the design records whether a Hermes copy needs the sidecar.

### Out of Scope

- Changing any rule's meaning, `id`, `check`, `message` or `severity`, adding a rule, removing a rule or reordering one. The sidecar carries the same rules.
- The unrelated `hardRules` field in `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/schema-v3.ts`. It is a different field on a different schema and is not a reader of SKILL.md frontmatter.
- Changing which command shapes are audited, or the `DISPATCH_SHAPES` registry's patterns. The registry's `packetPath` values are read and repointed only if they name a moved SKILL.md.
- Adding a dependency. The engine stays dependency-free and the sidecar is plain JSON.
- Adding a lock file, a schema validator, a migration script run at install time, or a dual-read compatibility window beyond the single change D3 fixes.

### Reader and Test Inventory (observed 2026-09-30, read-only)

The criterion in `goal.md` names the engine, the four runtime preflight adapters and both sk-git scripts. The inventory below is wider: it holds the two OpenCode plugin copies, the pi twin of the sk-git advisory and the devin permission policy under the system-spec-kit runtime tree, plus the five test files that read a SKILL.md or assert on its frontmatter text. Every row was read in this tree, and each named line is where the file passes a SKILL.md path to `readHardRules` or reads the frontmatter text.

| Reader file | Row | What it passes today |
|-------------|-----|----------------------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | `readHardRules` at `:61`, parse at `:63` | The engine. `parseHardRules` at `:29` finds `^hard_rules:` at `:34` |
| `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | `:70-71` | `path.join(projectDir, '.skilled', 'skills', match.packetPath, 'SKILL.md')` |
| `.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | `:63-64` | The same join, codex root |
| `.skilled/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | `:66-67` | The same join, devin root |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | `:264-265` | `join(ctx.cwd, ".skilled", "skills", shape.packetPath, "SKILL.md")` |
| `.opencode/plugins/cli-dispatch-audit.js` | `:85` | `readHardRules(join(sourceRoot, 'skills', match.packetPath, 'SKILL.md'))`. Also reachable as the symlink `.skilled/hooks/dispatch/opencode/cli-dispatch-audit.js` |
| `.opencode/plugins/sk-git-preflight-advisory.js` | `:109` | The sk-git SKILL.md path |
| `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | `:112` | `path.join(projectDir, '.skilled', 'skills', 'sk-git', 'SKILL.md')` |
| `.skilled/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | `:66` | The pi twin of the row above, on `sk-git/SKILL.md` |
| `.skilled/skills/sk-git/scripts/lib/advisory-noise-audit.mjs` | `:105` | `path.join(repo, '.skilled', 'skills', 'sk-git', 'SKILL.md')` |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | `:136` | `readHardRules(DISPATCH_SKILL_PATH)`, the `cli-opencode/SKILL.md` path set at `:51-54` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | `DISPATCH_SHAPES` at `:28-46` | Not a reader. It holds each `packetPath`, and the cli-classifier row reads `cli-classifier/cli-usage` in this tree |

| Test file | Row | What it asserts |
|-----------|-----|-----------------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | `readHardRules` at `:34`, `:42`, `:96`, `:105`, `:144`, `:157`, `:182`, `:490`, `:503`, `parseHardRules` at `:217-220` | The rule sets of four skills by id, the fail-open parse cases, and that every declared `check` id is implemented in `CHECKS` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | `:133-134` | That every shape resolves to a SKILL.md that exists, because a missing one fails open |
| `.skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` | `:24`, `:345` | The sk-git rules through `readHardRules(SKILL_MD)` |
| `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs` | `:32`, `:67`, `:85` | Copies the real sk-git SKILL.md into a fixture tree so the hook loads the rules it ships |
| `.opencode/plugins/tests/source-root-consumers.test.cjs` | `:29`, `:75-76` | A `hard_rules:` sentinel string, and the real sk-git SKILL.md fed to the consumer loader |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/hard-rules.json` | Create | The 17 sk-git rules, copied exactly. Proposed name |
| `.skilled/skills/cli-classifier/cli-usage/hard-rules.json` (post-039 path `cli-classifier/cli-jev/hard-rules.json`) | Create | The 8 cli-usage rules, copied exactly. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Create | The 5 cli-opencode rules, copied exactly. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-cursor/hard-rules.json` | Create | The 2 cli-cursor rules, copied exactly. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-codex/hard-rules.json` | Create | The 2 cli-codex rules, copied exactly. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-hermes/hard-rules.json` | Create | The 8 cli-hermes rules, copied exactly. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-devin/hard-rules.json` | Create | The 2 cli-devin rules, copied exactly. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/hard-rules.json` | Create | The 2 cli-claude-code rules, copied exactly. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json` | Create | The 4 cli-pi rules, copied exactly. Proposed name |
| The nine `SKILL.md` files named above | Modify | The `hard_rules` frontmatter key removed, every other byte kept |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Read the sidecar, keep fail-open, delete the frontmatter parse |
| The 10 reader files of the inventory above | Modify | Moved to the sidecar in the same change |
| The five test files of the inventory above | Modify | Moved to the sidecar in the same change |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` and its `SKILL.md` | Modify | Name the sidecar and say `hard_rules` is not a frontmatter key, through sk-doc |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | Modify | Say where hard rules live, through sk-doc |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Read only, or modify only if the design proves a Hermes copy needs the sidecar | `listSkillFiles` matches `entry.name === 'SKILL.md'` at `:61` and writes one SKILL.md per skill at `:237` and `:267` |
| This phase folder's six docs, plus `description.json` and `graph-metadata.json` through `repair-derived.cjs` | Modify | The phase record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **Every rule moves, unchanged.** Each of the nine skills gets `hard-rules.json` beside its SKILL.md (proposed name) holding that skill's rules copied exactly, field for field, in order. A mechanical comparison of the pre-change frontmatter objects against the sidecar objects is empty. The rule count stays 50: 17 sk-git, 8 cli-usage, 8 cli-hermes, 5 cli-opencode, 4 cli-pi, 2 each for cli-claude-code, cli-codex, cli-cursor and cli-devin |
| REQ-002 | **The engine reads the sidecar and stays fail-open.** `readHardRules` reads the sidecar, parses it with `JSON.parse` and adds no dependency. A missing, unreadable or malformed sidecar yields no rules and never throws, the contract `dispatch-rule-checks.mjs:61` holds today. The frontmatter parse is deleted in the same change (D2, D3) |
| REQ-003 | **Every reader and test moves in the same change.** The 10 readers and five test files of section 3 read the sidecar, with no dual read of frontmatter left behind. `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` prints nothing, and a grep for `parseHardRules` returns no production reader of SKILL.md text |
| REQ-004 | **Enforcement is proved identical.** A fixed command set per skill runs through `evaluate` before the change and after it, and the verdict sets match row for row: same rule ids, same severities, same block or warn outcome. The recordings sit under `scratch/verify/before/` and `scratch/verify/after/`, and the comparison is recorded in `implementation-summary.md` |
| REQ-005 | **The registered hooks keep firing.** `.claude/settings.json:47`, `.codex/hooks.json:69` and `.devin/hooks.v1.json:72` still resolve their adapters, and each adapter's suite passes at or above its recorded baseline |
| REQ-006 | **Docs through sk-doc.** The frontmatter contract and the skill template say where hard rules live and that `hard_rules` is not a SKILL.md frontmatter key, and `validate_document.py` is VALID on every changed doc |
| REQ-007 | **Hermes stays in sync.** `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` passes. The sync walks `.skilled/skills` and matches `entry.name === 'SKILL.md'` at `:61`, so a sidecar is not copied today. Whether a Hermes copy needs one is the design's to decide and record |
| REQ-008 | **Nothing outside the move changes.** No rule's meaning, id, check or severity changes, no rule is added or removed, the `hardRules` field in sk-design is untouched, and no dependency is added |
| REQ-009 | **Code comments carry the durable why.** No spec path, phase number or requirement id enters a code comment. The engine's existing header comment is rewritten to describe the sidecar rather than the frontmatter key |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | **Executors and scope (parent D5 through D6).** DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews, no Claude worker writes or reviews. P0 and P1 findings are fixed and rechecked, P2 findings are recorded |
| REQ-011 | **The design note fixes the open items first.** Section 10's questions each carry a proposed answer in the note under `scratch/`, and every `UNKNOWN` is named before the first code write |
| REQ-012 | **The reader inventory is reconciled.** Each row of section 3 is either moved or, when the design proves it does not read a SKILL.md, recorded as not a consumer with the evidence |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:sidecar-contract -->
### Sidecar Contract (fixed at spec approval, name and shape fixed by the design)

The contract below is the context's frame, fixed here at spec approval. Changing it after the build starts is an amendment.

**One file per skill.** Each SKILL.md that declares `hard_rules:` today gets `hard-rules.json` beside it (proposed name). The design may name the file differently only by recording the reason in `goal.md`'s log.

**Same rules, same order.** The sidecar carries the same rule objects with `id`, `check`, `message` and `severity`, copied exactly and in their declared order. The shape is a JSON array of those objects (proposed). No rule is renamed, reworded, reordered, added or dropped.

**One reader, one fail-open path.** `readHardRules(skillMdPath)` keeps its parameter and reads the sibling sidecar (proposed). The design may instead give it the skill folder and update every call site, and it must then record which call sites changed. Either way the function keeps the fail-open contract: any read or parse error returns an empty rule list, and no hook crashes on a malformed sidecar.

**No dual read.** Once a skill has moved, no reader reads its frontmatter. The frontmatter parse is deleted in the same change, so a skill that still declared the key would silently lose its rules, which is why REQ-003's grep gates the move.

**What never happens.**
- A gate on one of the three registered runtimes stops firing without a failing suite saying so.
- A malformed or missing sidecar throws, blocks a dispatch or prints a new line the pre-change run did not print.
- A rule's meaning changes, or a rule reaches a different verdict than it did before the move.
- A new dependency, a schema validator or a migration step enters the reader path.
<!-- /ANCHOR:sidecar-contract -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The nine skills each hold `hard-rules.json`, a grep for `^hard_rules:` in any SKILL.md finds nothing, and the rule count per skill matches the counts in REQ-001.
- **SC-002**: The engine, the four preflight adapters, both sk-git scripts and every other reader of section 3 read the sidecar, and each suite passes at or above its recorded baseline.
- **SC-003**: A recorded before-and-after run of the engine over the fixed command set gives identical verdicts for every skill, row for row.
- **SC-004**: sk-doc's frontmatter contract and skill template name the sidecar, `validate_document.py` exits 0 on every changed doc, and no doc claims a result no run printed.
- **SC-005**: `sync-skills-hermes.cjs --check` passes and `validate.sh --strict` prints `RESULT: PASSED` for this phase.

### Proof Plan

Written before the build. `E` is `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, `S` a skill folder, `B` the fixed command set per skill and `V` the recordings under `scratch/verify/`.

1. Rule-for-rule comparison. For each of the nine skills, the rules parsed from the pre-change SKILL.md frontmatter deep-equal the rules parsed from the sidecar. Check: the comparison prints one row per skill with the count and `equal`, and every row reads `equal`. Boundary: a rule whose `message` differs only in whitespace also fails, because the copy is exact and not normalized.
2. Reader inventory. `rg -n 'readHardRules|parseHardRules' --glob '*.mjs' --glob '*.ts' --glob '*.cjs' --glob '*.js' .`, then each row of section 3 opened at its named line. Check: every row resolves to the sidecar path or is recorded as not a consumer with its evidence. Boundary: a row that reaches the engine through a plugin symlink counts once.
3. Before and after verdicts. With the frontier moved only by the engine and the sidecars in place, `B` runs through `evaluate` from the pre-change state and again from the final state. Check: the two verdict sets compare equal, one row per command. Boundary: a command that triggers no rule must print an empty verdict set both times, so the comparison covers the no-verdict case too.
4. Suites. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`, `node --test .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, `node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs`, `node --test .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs` and `node --test .opencode/plugins/tests/source-root-consumers.test.cjs`. Check: each exits 0 with 0 failed, against a baseline captured before the change. Boundary: the run happens from the repo root, since the suites resolve paths relative to it.
5. Docs and Hermes. `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each changed doc, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` passes, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar --strict` prints `RESULT: PASSED`.

**Kill criterion.** A move that changes any rule, leaves a reader on frontmatter, or lets a malformed sidecar throw or block a dispatch closes nothing. A green suite without the before-and-after verdict comparison never substitutes for REQ-004.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 039, which renames `cli-classifier/cli-usage` to `cli-classifier/cli-jev` and runs first | The sidecar path for one of the nine skills is written against a folder that moves | The design reads the post-039 path and the registry row before the move, and the phase builds after 039 is Complete |
| Dependency | The five test files of section 3 name paths inside the repo | A moved path breaks a suite for a reason unrelated to the rules | The baseline capture runs first, and each suite is rerun from the final state |
| Risk | A reader left on frontmatter after the move | Enforcement stops silently on a skill, and a green suite may not notice | REQ-003's grep gates the move, and the reader inventory in section 3 is reconciled row by row |
| Risk | The fail-open contract is widened into a crash on a malformed sidecar | A hook blocks a dispatch or dies mid-tool-call | REQ-002 keeps the empty-list return, and the test file keeps the fail-open cases at `:217-220` in their new form |
| Risk | A rule's text is normalized while copying, for example a quote style or a wrapped message | The rule's meaning drifts with no diff a reviewer reads as a rule change | REQ-001's field-for-field comparison treats whitespace as a difference |
| Risk | The Hermes copies keep a `hard_rules` block that no reader reads | A Hermes session ships a stale declaration | The design reads `sync-skills-hermes.cjs` and records whether the copies need the sidecar. Today `listSkillFiles` matches only `SKILL.md`, and `.hermes/skills/sk-git/SKILL.md` holds the old block |
| Risk | The `hard_rules` key is removed before the sidecar lands for that skill | A skill loses its rules between two commits | The move is one change per skill and the grep gate runs before any reader change lands |
| Risk | The pi and ts twins drift from their `.mjs` counterparts | Two runtimes read different rule sources | The design names each twin in the inventory, and the suites for both are in the proof plan |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The reader path adds no measurable wall time beyond one `readFileSync` and one `JSON.parse` on a file that sits beside the SKILL.md it already read. No new process, network call or directory walk is added.
- **NFR-P02**: The sidecar read stays on the hook's existing timeout budget. The registered hooks run with a 5 second timeout in `.claude/settings.json:48`, `.codex/hooks.json:70` and `.devin/hooks.v1.json:74`.

### Security
- **NFR-S01**: The sidecar holds rule text and no credential, and the reader reads one repo-local file. No key, token, `.env` file or environment value is read, written or printed.
- **NFR-S02**: No new input surface is admitted. The sidecar is authored in this repo, not fetched, and the `check` ids stay the ids `CHECKS` implements.

### Reliability
- **NFR-R01**: The fail-open contract is unchanged. A missing, unreadable or malformed sidecar yields no rules and no throw, the behavior `readHardRules` has today.
- **NFR-R02**: The reader is deterministic. Reading the same tree twice returns the same rule list in the same order.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The sidecar is missing: the reader returns no rules, as a SKILL.md without `hard_rules` does today.
- The sidecar is empty, holds `null` or holds a JSON object rather than an array: the reader returns no rules.
- The sidecar holds malformed JSON: the reader returns no rules and does not throw.
- A rule object is missing `id`, `check`, `message` or `severity`: the design fixes the behavior and records it, and the fail-open contract decides the default.
- A rule names a `check` id that `CHECKS` does not implement: the existing rule-check test's assertion at `:503` decides, and the move keeps that assertion true.
- A skill's SKILL.md path resolves through a symlink, as `.skilled/plugins` does to `../.opencode/plugins`: the sibling sidecar is resolved beside the resolved SKILL.md.

### Error Scenarios
- The file exists but is unreadable through permissions: no rules and no throw.
- The caller passes a folder path rather than a SKILL.md path: the design's signature decision covers it, and the open question in section 10 fixes which it is.
- Phase 039's rename lands between the baseline capture and the move: the recordings are pinned to the pre-move commit, and the phase rebuilds against the post-039 path.
- A hook fires while the tree is mid-move between two commits: the fail-open path returns no rules rather than erroring, which is why the move is gated by the grep before any reader change lands.

### State Transitions
- During the move, one skill has its sidecar and its frontmatter key removed while the readers still parse frontmatter: the grep gate and the single-change rule for each skill keep this window inside one commit.
- After the move, no SKILL.md holds `hard_rules:`, and no reader parses frontmatter.
- An interrupted build leaves either a skill moved and read through the sidecar, or untouched. The design records the rollback as a path-scoped revert.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Nine sidecars, nine frontmatter edits, the engine, 10 readers and five test files, plus two sk-doc surfaces |
| Risk | 12/25 | Three registered runtimes lose enforcement silently if a reader is missed, and the rules themselves must not change |
| Research | 6/20 | The design reads the engine, the readers, the registry and the Hermes sync before the first code write |
| **Total** | **38/70** | **Level 2**, as every build phase of this packet is |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Does `readHardRules` keep the SKILL.md path or take the skill folder?** Proposed: keep the parameter and read `hard-rules.json` as its sibling, so all 10 call sites keep their argument and only the engine changes. The alternative is a folder parameter and 10 call-site edits, which the design chooses only if it proves a reader needs the folder for another reason. UNKNOWN until the design reads each call site's surrounding code.
- **What is the sidecar's shape?** Proposed: a bare JSON array of the same rule objects, so the parse is `JSON.parse` plus an array check and the engine stays dependency-free. Alternatives the design may prefer: an object with a `rules` key and a version field. The design fixes one and records why.
- **Does a Hermes copy need the sidecar?** Observed: `sync-skills-hermes.cjs` walks `.skilled/skills` and matches `entry.name === 'SKILL.md'` at `:61`, writes one `SKILL.md` per skill at `:237` and `:267`, and `.hermes/skills/` holds 72 entries with the old `hard_rules` block inside `.hermes/skills/sk-git/SKILL.md`. UNKNOWN until the design reads whether any Hermes-runtime reader resolves a rule from `.hermes/skills` rather than `.skilled/skills`. Proposed: no sidecar is copied, because every reader path in section 3 resolves under `.skilled/`, and the sync's check is left green.
- **What is the fixed command set for the verdict comparison?** Proposed: the commands the five test files already exercise, plus at least one command per `check` id the nine skills declare, so every implemented check gets a row. UNKNOWN until the design reads the suites' fixtures.
- **Where does the verdict comparison live?** Proposed: `scratch/verify/before/<skill>.txt` and `scratch/verify/after/<skill>.txt`, one verdict per line, written by a small scratch script that imports the engine. The design decides whether the script is committed or stays under `scratch/` and is deleted at closure.
- **Does `parseHardRules` survive as an export?** Proposed: no production reader keeps it. The engine's frontmatter parse is deleted and the test cases at `:217-220` become sidecar-parse cases. UNKNOWN until the design reads whether any consumer outside this repo imports it, since the packet's context names none.
<!-- /ANCHOR:questions -->

---
