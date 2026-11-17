---
title: "Implementation Plan: Phase 15: health-default-and-brief-refinements"
description: "Write a prompt-free health record on every hook run with a degraded flag and the newest record time, narrow the needs-a-mode label to prompts that name the hub, let the top hub name its routed command, drop the OpenCode compiled-route line, make the brief-cost script read live heads only and fix two behaviour-arm counts and one DSH session id."
trigger_phrases:
  - "health default and brief refinements plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: health-default-and-brief-refinements

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript for the advisor runtime and its hooks, Node ES modules for the routing-accuracy scripts and the OpenCode plugin, CommonJS for the plugin's node tests, YAML and Markdown for the doctor asset and the guides |
| **Framework** | The skill advisor runtime (`ADV` is `.skilled/skills/system-skill-advisor/runtime`), its hooks (`HK` is `.skilled/skills/system-skill-advisor/hooks`), the OpenCode plugin and the `/doctor:setup` workflow |
| **Storage** | The existing diagnostics JSONL under `$TMPDIR/speckit-skill-advisor-metrics`, capped at 200 records per workspace key. Nothing new |
| **Testing** | Vitest in `ADV`, `node --test` for the plugin, the command capture with its slice test, the transcript scorer on the committed final arm and coordinator-run live hook checks |

### Overview
The diagnostic sink writes a health subset on every hook run and keeps the skill label and the error text behind `SKILL_ADVISOR_DEBUG`. The CLI fallback marks a local-scorer answer as degraded and the hook carries that flag into the record, so the health section and `advisor_status` can report a degraded rate and the newest record time, which the `/doctor:setup` advisor leg prints. On the brief, the needs-mode rule asks whether the prompt named the hub, the top-only guard stops hiding a command the head would have named and the OpenCode transform stops adding a line that repeats the head. The brief-cost script reads live heads only, and the transcript scorer and the behaviour runner answer two counts and one session id they missed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each mechanism is read in code and recorded in `spec.md` section 2 with the probe that measured it.
- [ ] Every coordinator scope decision has an answer in `spec.md` section 10.
- [ ] T001 confirms phase 014 is committed and lists which of this phase's files it changed.
- [ ] T002 recorded the before numbers in `scratch/before.txt`.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] T024 prints the SC-001 values, T031 prints the SC-002 line and T032 holds every floor against `scratch/before.txt`.
- [ ] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One fact, one owner. The fallback owns whether an answer degraded, the sink owns what a record holds, the status handler owns what it reports and the scorer owns every count.

### Key Components
- **`persistAdvisorHookDiagnosticRecord`** (`$ADV/lib/metrics.ts`): writes the full record when `SKILL_ADVISOR_DEBUG` is set and the record without `skillLabel` and `errorDetails` otherwise, both through `writeBoundedJsonl` with `requireDebug: false`.
- **`buildAdvisorHookHealthSection`**: adds `rollingDegradedRate` over the last 30 records and `lastRecordAt`, the newest record's timestamp or `null`.
- **`resultFromCliData`** (`$HK/lib/skill-advisor-cli-fallback.ts`): sets `metrics.degraded` from the local-scorer test it already makes. `emitDiagnostic`'s caller passes it on.
- **`readAdvisorStatus`** (`$ADV/handlers/advisor-status.ts`): maps the two new fields into `hookHealth`, which the strict schema then admits.
- **`routeNeedsMode(skillId, compiledRoute, namedSkills)`** (`$ADV/lib/command-attach.ts`): false unless the hub is among the skills the prompt names. `enrichCompiledRoutes` passes `extractMetalinguisticSkillMentions(prompt)`.
- **`enrichCompiledRoutes`**: under `compiledRouteTopOnly` the top row keeps its routed command even when a lower row carries the same one.
- **OpenCode transform** (`.opencode/plugins/system-skill-advisor.js`): no compiled-route push. The metadata, the render helper and the bounding option stay for status and for any caller of the helper.
- **`measure-brief-cost.mjs`**: per-row `headBytes` and `live`, live-only statistics and a `degraded_brief` refusal.
- **Scorer** (`score-command-transcripts.mjs`): `deliveryUnknown` counted per run line in `summarize`, `unsafeNoChangedPath` in `addScored`.
- **`promptSessionId`** (`command-offer.mjs`) and the runner: the one added DSH session whose first user record equals the prompt.

### Data Flow
A prompt reaches the Claude hook script directly or through the Codex, Cursor, Devin, Pi or DSH adapter. The hook calls the advisor CLI, whose answer `resultFromCliData` turns into a result with `metrics.degraded`. The hook renders the brief and calls `emitDiagnostic`, which builds the record and persists it. `advisor_status` reads the last 30 records into `hookHealth`, which `/doctor:setup` prints under the advisor leg. The recommend handler sets `needsMode` and the top command before the renderer sees the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `metrics.ts` sink and health section | Writes only under the debug variable, no degraded rate, no age | Default subset, `degraded`, `rollingDegradedRate`, `lastRecordAt` | T012, T020, T026 |
| `advisor-validate.ts` `buildTelemetrySummary` | Reads four section fields by name | Unchanged, not a consumer of the new fields | `VALL` |
| Hook adapters (Codex, Cursor, Devin, Pi, DSH) | Reach `emitDiagnostic` through the Claude hook | Unchanged. They gain the default record with no edit | T026 on the Claude script, which they all run |
| OpenCode plugin | Has no diagnostic writer | Unchanged as a writer. Its compiled-route push goes | T004, T028 |
| `doctor-setup.yaml` advisor leg | Prints p95 and fail-open when present | Adds the degraded share, the record time and the absence reason | T007 |
| `routeNeedsMode` callers | `enrichCompiledRoutes` and, from T003, the command capture | Both pass the named skills | T014, T003, T024 |
| `command-brief-golden.vitest.ts`, `render.ts` | Render `(needs a mode)` from the field | Unchanged | `VALL` |
| `deliveryUnknown`, `unsafe` readers | The scorer text and JSON, the routing-accuracy README | Count moves, `unsafe` unchanged, new key added | T006, T015, T025, T031 |
| Docs that state the debug-only rule | `skill-advisor-hook.md:191`, `skill-advisor-hook-validation.md:100` and `:232`, `ARCHITECTURE.md:150`, `claude-hook.md:42` | Rewritten | T008 to T011 |
| Manual playbooks that set `SKILL_ADVISOR_DEBUG=1` | Count records written with the variable | Unchanged, still true | `rg` in T033 |

Same-class producers: `rg -n "requireDebug" $ADV/lib` lists the two sink callers, and only the diagnostic one changes. Consumers of the changed fields: `rg -n "hookHealth|rollingDegradedRate|lastRecordAt|routeNeedsMode|deliveryUnknown|unsafeNoChangedPath" .skilled .opencode --glob '!**/dist/**' --glob '!**/node_modules/**'`. Matrix axes: debug variable (set, unset) by answer source (daemon, local scorer). Label rule: hub tops (yes, no) by prompt names it (yes, no) by route (defer, single mode). Each has one case in T012, T014, T020 or T026.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records every floor, the final-arm counts and phase 014's file list in `scratch/` (T001, T002). Implementation runs the waves in `tasks.md`: the capture, the plugin, the brief-cost script, the first scorer count and the documents first with no runtime source edit, then the sink, the metrics type, the label rule, the second scorer count and the session helper, then the fallback flag, the hook call, the status fields, the top-only guard and the runner, then a rebuild. Wave 4b (T035 to T039) follows the rebuild with the verifier follow-ups: no holdout id in the label list, the missing scorer and `promptSessionId` cases, the sink named in two doc sentences and the consumption case held to the OpenCode change. Then a second capture and the README. Verification runs the live hook checks, the arm summary and every floor, then checks the boundaries and writes the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The default record and its trim, the degraded rate and the record time, the label rule, the top-only command, the brief-cost refusal, `deliveryUnknown` on an unscored line and `unsafeNoChangedPath` | Vitest in `ADV` |
| Integration | The capture and its slice test before and after the rebuild, the scorer summary on `FINAL`, the plugin node tests | `capture-command-routing-baseline.mjs`, `score-command-transcripts.mjs`, `node --test` |
| Manual | One hook run with the debug variable unset, four live heads, the render-entries probe, the DSH store probe and one brief-cost run | Coordinator only, through the hook script and the advisor CLI, no model session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 014 committed | Internal | Done: committed as `b3b5ae8314` before wave 1 | Wave 1 waits. Seven shared files could collide |
| A fresh `ADV` build | Internal | Green at `320e7b64d4` | T003 and T024 refuse to capture |
| The final DSH arena store under the home folder | External | Present on 2026-11-13 | T029 cannot prove the session choice. T029 marks itself `[B]` and no code changes |
| A worktree daemon on the rebuilt dist | Internal | Coordinator's to restart | T027 and T028 read an old build |
| `jq` and `git` on the path | External | Green | The verify commands cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a floor drops below its line in `scratch/before.txt`, the slice test stays red after T024 or a live head loses a command it named before.
- **Procedure**: revert this phase's commit and run `npm run build` in `ADV`. The diagnostics file under the OS temp folder keeps prompt-free records only, so it needs no cleanup. Nothing under the home folder was written.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 014 committed | Implementation |
| Implementation | The before numbers in `scratch/` | Verification |
| Verification | Every implementation task and the rebuild | Rank 6's later phase, which reads the degraded rate this phase starts recording |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## DECISIONS ALREADY MADE

The autonomous answers are in `spec.md` section 10. Four change what the draft asked for and are recorded here so a reader sees them first. The trim test writes 301 records, because 250 leave 250 lines. The floor label count after the rule is 1 of 35, not 0, because one silent prompt names the hub that tops it. The capture's plain tune count stays 23, because it already counts the row the top-only change fixes. The brief-cost test is a vitest file, because the suite never collects a `node:test` file under `runtime/tests`.
<!-- /ANCHOR:decisions -->
