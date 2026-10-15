---
title: "Feature Specification: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines"
description: "The skill advisor never surfaces a /doctor:* command today, so plain setup and health prompts return nothing or route only to a skill. This packet generates per-route doctor bridges from _routes.yaml, adds a read-only /doctor:setup umbrella and renders a runnable /doctor:x target line, while every passing routing prompt keeps passing."
trigger_phrases:
  - "doctor command routing"
  - "advisor doctor bridges"
  - "runnable doctor command line"
  - "doctor setup umbrella"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-15 |
| **Branch** | `main` (no branch created at planning, the workspace choice belongs to the implement step) |
| **Related packet** | `specs/system-skill-advisor/034-doctor-command-guidance` (the research this packet implements) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill advisor has no path to the `/doctor:*` commands. The bridge projection holds 27 command entries and none of them is a doctor command, and the `_routes.yaml` header says its own trigger phrases are "inert today" because no harvester reads them [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21]. As a result, "Help me set up skilled" and "check my environment variables" return no recommendation at all, and even a typed `/doctor:git setup` routes to the sk-git skill instead of the command.

### Purpose

A plain setup or health prompt surfaces a runnable `/doctor:<command> <target>` line. When a skill also fits, the skill keeps first place and the doctor line comes second. No routing prompt that passes today stops passing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

All ten ranked recommendations of the 034 research [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/research.md:151-160], verified against the code before planning:

- A doctor routing slice with its own gate, plus a per-prompt baseline of the existing corpora.
- A read-only, single-route `/doctor:setup` command that lists the doctor targets and runs their read-only checks.
- Per-route doctor bridges generated from `_routes.yaml` by `derive-command-bridges.cjs`.
- Activation of those bridges in the TypeScript and Python scorers through `scoring-compatibility.json`.
- Phrase admission in waves, uncontested phrases first.
- Separation of doctor prompts from skills by wording, with no lane weight or threshold change.
- A runnable `/doctor:x target` string in the advisor brief, as the top line or as a second suggestion.
- A doctor reach probe that checks each admitted phrase reaches its bridge.
- One bounded fallback hint naming `/doctor:setup`, shown only when an unmatched prompt uses setup, install, check or configure wording.
- Trigger phrases for `/doctor:env` and plain-word phrases for `/doctor:update`, plus a corrected `_routes.yaml` header.
- An install step for the `yaml` parser in every CI job that runs the bridge generator and lacks it.

### Operator Decision (settled, not reopened)

When a prompt fits both a skill and a doctor command, the skill keeps first place and the advisor adds the runnable `/doctor:x` line as a second suggestion. This also answers the research's first open question, which asked who should win each contested phrase [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/research.md:205].

### Out of Scope

- Lane weights, confidence thresholds and the 0.08 command demotion. The tune workflow's own principle is "Tune the routing surface, never the routing logic" [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml:45].
- Auto-dispatching a doctor command. The brief is advisory and never replaces explicit loading [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21].
- Editing the three pinned corpora. Their hashes are pinned by the baseline and by CI [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:5-7] [SOURCE: .github/workflows/routing-registry-drift.yml:316].
- Hand-written `PHRASE_BOOSTS` for doctor phrases. The research kept these as an optional lowest priority and this packet does not need them.
- Bridges for `/doctor:deep-loop` and the `/doctor:mcp` sub-actions (`install`, `debug`). The operator moved them to a later wave on 2026-10-15, and the research never measured them [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/research.md:207]. The deriver may list them in the inventory, but no compatibility entry activates them in this packet.
- Plain-phrase doctor routing in the Python scorer. The operator kept Python on slash markers only on 2026-10-15, so plain phrases route through TypeScript only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Create | Doctor routing slice: onboarding, diagnostic, contested and skill-shaped control prompts |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts` | Create | Gate that scores the slice under the pinned force-local regime |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | Modify | Third inventory source read from `_routes.yaml`, per-route ids, runnable-string lookup block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | Activation entries for the admitted doctor bridges in both scorers |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerate | Deriver output, never hand-edited |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Regenerate block | Generated command-bridge block only |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Regenerate block | Generated command-bridge block only |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | A doctor bridge never outranks a passing skill unless the prompt names a doctor command |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Modify | Runnable doctor line as top or second line, one bounded no-match hint, generated lookup block |
| `.skilled/skills/system-skill-advisor/runtime/tests/` (render and ranking tests) | Modify or Create | Coverage for the companion line, the ordering rule and the hint |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md` | Modify | Name the `_routes.yaml` source |
| `.skilled/commands/doctor/_routes.yaml` | Modify | `/doctor:setup` route, `/doctor:env` entry with phrases, update phrases, header rewrite |
| `.skilled/commands/doctor/setup.md` | Create | Read-only single-route router |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Create | Workflow that composes the existing read-only batteries |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Create | Presentation contract |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | Create | Doctor reach probe |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | Compute the setup-wording flag from the prompt and pass it in the render options |
| `.github/workflows/*.yml` (only jobs that run the bridge generator without the parser) | Modify | Add `npm --prefix .skilled ci`, or the equivalent install step |
| `.skilled/commands/README.txt` | Modify | Catalog row and the command count |
| `.claude/commands/doctor/setup.md`, `.codex/prompts/doctor-setup.md`, `.pi/prompts/doctor-setup.md`, `.hermes/prompts/doctor-setup.md`, `.cursor/commands/doctor-setup.md` | Generate | Runtime mirrors, produced by the sync scripts, never by hand |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Every evidence cell names a file and line opened during planning.

### P0 - Blockers (MUST complete)

| ID | Requirement | Evidence |
|----|-------------|----------|
| REQ-001 | A doctor routing slice lives in its own file and is scored by its own gate under the pinned force-local regime. The slice gate reads none of the pinned corpora, so the corpus hashes and the holdout-independence declarations stay untouched. The slice baseline is captured before any runtime change. | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:5-7`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:75-83`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:422-446` |
| REQ-002 | Every routing prompt that passes at the start of implementation still passes after every change. The aggregate ratchet holds exact counts, so a per-prompt snapshot of all three corpora is taken first and compared after each wave. | `.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:5-13`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:13-17` |
| REQ-003 | `derive-command-bridges.cjs` gains a third inventory source read from `_routes.yaml`: one bridge per route, plus `/doctor:update`, `/doctor:env` and `/doctor:setup`. Ids take the form `command-doctor-<command>-<target>`, or `command-doctor-<command>` for a single-route command. `skillId` comes from each router's `skill_agent` tag and `ownerMode` equals `skillId`. The existing `bridgeId()` stays unchanged and `--check` stays the drift guard. | `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:56-61`, `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-123`, `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:3-7`, `.skilled/commands/doctor/git.md:6`, `.skilled/commands/doctor/_routes.yaml:12` |
| REQ-004 | Admitted doctor bridges are active in both scorers through `scoring-compatibility.json`, under the same inventory ids. TypeScript keywords and intent signals come from the manifest's trigger phrases. Python carries only the runnable slash markers (operator decision, 2026-10-15), because any Python marker found in a prompt becomes explicit command intent and would put the command above the skill. No Python owner normalization is added, because it rewrites a top command back to its skill. | `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:176-191`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2761-2770`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4404-4407`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2827-2846` |
| REQ-005 | When a skill and a doctor bridge both pass the threshold, the skill ranks first in the TypeScript scorer, which is what the Python sort key already does. A prompt that names a doctor slash command keeps the doctor bridge first. The rule is scoped to doctor bridges, because corpus gold labels include command ids such as `memory:save`. | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4467-4475`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:20` |
| REQ-006 | The advisor brief shows the runnable `/doctor:<command> <target>` string. When the doctor bridge is the top pick it is the top line. When a skill is first and a doctor bridge also passes, the brief adds the doctor string as a second suggestion. The id-to-string lookup is a generated block the renderer reads without importing `projection.ts`, which loads `better-sqlite3`. | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:420-452`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:12`, `.skilled/commands/doctor/git.md:16-18` |
| REQ-007 | A new read-only, single-route `/doctor:setup` lists every doctor target with what it checks, runs the read-only batteries that already exist and prints the runnable repair command for each failing leg. It writes nothing and takes no positional target. | `.skilled/commands/doctor/_routes.yaml:12`, `.skilled/commands/doctor/_routes.yaml:51`, `.skilled/commands/doctor/_routes.yaml:90`, `.skilled/commands/doctor/_routes.yaml:229`, `.skilled/commands/doctor/_routes.yaml:284` |
| REQ-008 | "Help me set up skilled" surfaces `/doctor:setup` and "check my environment variables" surfaces `/doctor:env list`. Both return nothing today. `/doctor:env` with no selector stops at a menu, so its runnable form carries `list`. | `.skilled/commands/doctor/env.md:31-32`, `.skilled/commands/doctor/_routes.yaml:320-354` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Evidence |
|----|-------------|----------|
| REQ-009 | Phrases are admitted in waves. Wave A holds the measured uncontested phrases: the `/doctor:setup` onboarding phrases, the `/doctor:env` phrases, "disable comment hygiene gate", "runtime mirror drift" and "skill budget audit". Wave B admits contested phrases one route at a time, and each route passes the REQ-002 per-prompt check before the next. Wave B covers `/doctor:git setup` and `standards`, `/doctor:sk-code`, the other `/doctor:skill-advisor` targets, `/doctor:speckit` and `/doctor:update`. `/doctor:deep-loop` and the `/doctor:mcp` sub-actions stay inactive. | `.skilled/commands/doctor/_routes.yaml:250`, `.skilled/commands/doctor/_routes.yaml:214`, `.skilled/commands/doctor/_routes.yaml:136`, `specs/system-skill-advisor/034-doctor-command-guidance/research/research.md:155` |
| REQ-010 | Doctor prompts are separated from skills by wording only. Doctor phrases are diagnostic, three or more tokens long and never a bare work verb. No lane weight, threshold or confidence value changes. | `.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml:45`, `specs/system-skill-advisor/034-doctor-command-guidance/research/research.md:145` |
| REQ-011 | A doctor reach probe reads every admitted phrase from `_routes.yaml`, scores it in process under the pinned regime and fails when a phrase reaches neither the top line nor the second line of its declared bridge. The existing probe cannot do this, because it enumerates only hubs that have `mode-registry.json` and `ROUTER.md`. | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:75-82`, `.skilled/commands/doctor/_routes.yaml:179-194` |
| REQ-012 | The no-match fallback adds one bounded sentence naming `/doctor:setup`, but only when the unmatched prompt uses setup, install, check or configure wording, and only after REQ-007 has landed. The hook computes that wording flag and passes it in the render options, because the renderer never reads prompt text. A test proves a plain unrelated prompt gets no hint. The directive block stays unchanged. | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-490`, `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:391-392`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:334-336` |
| REQ-013 | `/doctor:env` gains a manifest entry with trigger phrases, since it has none today. `/doctor:update` gains plain-word phrases next to its existing ones. The `_routes.yaml` header drops "inert today" and the stale `skill_advisor.py:810-871` citation and names the deriver as its consumer. | `.skilled/commands/doctor/_routes.yaml:14-21`, `.skilled/commands/doctor/_routes.yaml:351-354`, `.skilled/commands/doctor/env.md:6` |
| REQ-014 | The command catalog, the bridge README and every runtime mirror stay in sync with the new command and the new bridge source. Mirrors are produced by the sync scripts, never written by hand. | `.skilled/commands/README.txt:46`, `.skilled/commands/README.txt:158`, `.skilled/commands/doctor/_routes.yaml:205-212` |
| REQ-015 | Every CI job that runs the bridge generator, directly or through the Python bridge check, has the `yaml` parser installed. Where a job lacks it, the job gains an install step. The golden-prompt job installs only system-spec-kit and the advisor runtime, while two spec-kit-check jobs already install the `.skilled` packages. | `.skilled/package.json:11`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:616-622`, `.github/workflows/routing-registry-drift.yml:249-253`, `.github/workflows/spec-kit-check.yml:80`, `.github/workflows/spec-kit-check.yml:191` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: "Help me set up skilled" returns `/doctor:setup` and "check my environment variables" returns `/doctor:env list`, measured under the pinned force-local regime.
- **SC-002**: Every row that passed in the starting snapshot still passes. The starting counts were 155 of 195 on the labeled corpus, 49 of 66 on the holdout and 19 of 24 on the ambiguity slice, measured on 2026-10-15.
- **SC-003**: For each contested slice prompt, the skill stays the top pick and the brief shows the doctor string as its second line.
- **SC-004**: `derive-command-bridges.cjs --check`, `route-validate.sh`, the parity gates and the doctor reach probe all pass from the final state.
- **SC-005**: An unmatched prompt with setup, install, check or configure wording shows the `/doctor:setup` hint, and a plain unrelated unmatched prompt shows none.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The deriver must parse YAML. `yaml` 2.9.1 is declared in `.skilled/package.json:11` and resolves locally, but the deriver also runs as a Python subprocess check [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:616-622] | High if any caller lacks `.skilled/node_modules` | Task T010 checks every CI job that runs the generator and adds the install step where it is missing, before the deriver change lands (REQ-015) |
| Risk | A doctor bridge false-fires on a gold-`none` prompt | High: the ratchet counts false fires exactly | The per-prompt snapshot names the row, and the phrase is dropped or reworded |
| Risk | Python reaches doctor bridges only through slash markers, so the Python fallback path will rarely show a plain-phrase doctor line | Med | Accepted by the operator on 2026-10-15 as a known limitation. The TypeScript daemon path is the primary brief path |
| Risk | Constant fallback text would fire on every unmatched prompt, which the research itself flagged as a cost [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/research.md:178] | Med | Resolved 2026-10-15: the hint shows only on setup, install, check or configure wording, and a test proves an unrelated prompt gets none |
| Risk | The Pi hook calls the fallback with no arguments [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:282-283], so it never receives the wording flag | Low | Pi shows no hint. Recorded as a known limitation, since threading the flag through Pi is outside this packet |
| Risk | A spurious skill tie keeps first place. "update skilled to the latest release" ties sk-code, system-deep-loop and sk-git at 0.82 today | Low | Resolved 2026-10-15: the operator kept the rule, so a skill stays first and `/doctor:update` is the second line. The slice records this row with that expectation |
| Risk | The executor drifts on a multi-change brief [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:218] | Med | One change per brief, a diff check and a mutation check after each |
| Dependency | The scorer capture reads `dist`, so a stale build measures old code [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:44] | High | Rebuild before every capture |

### Research Caveats

- The `swe-2-max` lineage stopped after 5 iterations of a 10-iteration budget. The research records it as converged at that point [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/research.md:14].
- Both lineages' iteration records lack the route-proof fields, and the command contract treats that as incomplete delegation [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/research.md:59].
- Planning checked the research against the code and found two claims wrong. The research says `/doctor:update` has no trigger phrases, but it carries three [SOURCE: .skilled/commands/doctor/_routes.yaml:351-354]. The brief's "47 ids" counts every `"id":` line in `command-bridges.generated.json`, while the file holds 27 entries and 31 distinct id strings, none of them a doctor id.
- The research's suggestion to rely on the "existing two-candidate ambiguous render" does not deliver the operator decision. That render only fires above the default token cap and only on an ambiguity signal [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:432], so REQ-006 adds a dedicated second line.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The brief stays inside its token cap. The single-line cap is 80 tokens at 4 characters per token [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:90-93], and the second line counts against it.
- **NFR-P02**: The renderer adds no import heavier than its current ones, so the hook path never loads `better-sqlite3`.

### Security
- **NFR-S01**: Every doctor string passes the existing label sanitizer before it is rendered [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:140-156].
- **NFR-S02**: `/doctor:setup` is read-only and declares `mutating: read-only`, which `route-validate.sh` enforces.

### Reliability
- **NFR-R01**: Every generated file is reproducible from `derive-command-bridges.cjs`, and `--check` reports `fresh`.
- **NFR-R02**: Every gate runs without a live daemon, using the pinned force-local regime the ratchet uses.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A typed bare `/doctor:git` names no target. No per-route marker matches it, and the router itself shows its menu.
- A typed `/doctor:git setup` puts the doctor bridge first, because an explicit command outranks a skill in both scorers.
- A single-route command such as `/doctor:speckit` renders with no target, following the manifest rule.

### Error Scenarios
- A doctor id with no lookup entry renders nothing for that line, and never a raw id.
- A `_routes.yaml` route whose router has no `skill_agent` tag fails the deriver with a named error.
- A duplicate doctor id fails `assertUniqueIds` as any duplicate bridge does today.

### State Transitions
- A wave that breaks one per-prompt row is reverted alone, and earlier waves stay in place.
- A stale `dist` build is caught by rebuilding before every capture.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 24 files including 5 generated mirrors, about 800 LOC |
| Risk | 15/25 | Two scorers, the brief contract and an exact-count ratchet |
| Research | 6/20 | Research done in 034 and verified against the code during planning |
| **Total** | **37/70** | **Level 2** (`recommend-level.sh --loc 800 --files 24 --api` scored 58 of 100) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No question is open. The operator resolved all of them on 2026-10-15.

1. **Q1, resolved 2026-10-15.** Should the Python fallback path reach plain-phrase doctor prompts? No. Python stays on slash markers only, and plain phrases route through TypeScript only (REQ-004).
2. **Q2, resolved 2026-10-15.** Should the no-match hint stay unconditional? No. It shows only when an unmatched prompt uses setup, install, check or configure wording, and a test proves a plain unrelated prompt shows no hint (REQ-012).
3. **Q3, resolved 2026-10-15.** When should `/doctor:deep-loop` and the `/doctor:mcp` sub-actions be admitted? In a later wave, outside this packet. They are recorded as out of scope in section 3.
4. **Q4, resolved 2026-10-15.** Does every CI job that runs the bridge generator have the `yaml` parser? Task T010 checks each one and adds the install step where it is missing (REQ-015).
5. **Q5, resolved 2026-10-15.** Should "update skilled to the latest release" keep a skill in first place? Yes. The operator rule holds, so a skill stays first and `/doctor:update` is the second line.
<!-- /ANCHOR:questions -->

---
