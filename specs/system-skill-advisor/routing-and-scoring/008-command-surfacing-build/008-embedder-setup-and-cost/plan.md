---
title: "Implementation Plan: Phase 8: embedder-setup-and-cost"
description: "Make the embedder that meaning matching needs visible, guided and measured for a user who installs Skilled into their own repository. A committed script records its memory and latency, the status and /doctor:setup show its state, one doctor route plans its setup behind a yes and a deadline keeps a slow embedder from costing the brief."
trigger_phrases:
  - "embedder setup and cost plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: embedder-setup-and-cost

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node for the advisor, one Node ESM script, YAML and text assets for the doctor route, Markdown install guides |
| **Framework** | The system-skill-advisor runtime (`ADV` is `.skilled/skills/system-skill-advisor/runtime`) and the doctor command family (`DOC` is `.skilled/commands/doctor`) |
| **Storage** | The skill graph SQLite database, read only by the status probe. The route's scan writes `vec_cmd_<dim>` as it does today |
| **Testing** | Vitest through `npm test` in `ADV`, the doctor contract tests through `bash DOC/scripts/tests/run-all.sh`, the routing captures and the committed measurement script |

### Overview
The change adds one measurement script, two fields in the semantic lane health, one warning, one deadline, one doctor route and one `/doctor:setup` leg. It also rewrites the install guides from the script's output. The state is read where it already lives: the active pointer, the two vector tables and one `/api/tags` call. The proof is the script's JSON, the four degrade tests, the route contract test and unchanged captures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The four planning questions have an operator answer. Answered on 2026-11-12 and recorded in `spec.md` section 10.
- [ ] Phase 005 is merged, so `ADV/handlers/advisor-recommend.ts` and `ADV/scripts/command-bridges/scoring-compatibility.json` are read in their final form.
- [ ] `curl -s localhost:11434/api/tags | jq -r '.models[].name'` lists `nomic-embed-text:v1.5` on the build machine.
- [ ] The before numbers are recorded: the default capture, the real-embedding capture, the scorer floor, the policy rollup and three hook timing runs.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `npx vitest run tests/semantic-prompt-embedding-degrade.vitest.ts tests/handlers/advisor-status.vitest.ts` in `ADV` reports 0 failed, and `bash DOC/scripts/tests/run-all.sh` reports 0 failed.
- [ ] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same numbers and the same answers to the four questions.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Probe, plan, approve. The read paths report state, the route acts only after a yes and the scorer degrades on its own clock.

### Key Components
- **Measurement script** (`ADV/scripts/measure-embedder-cost.mjs`): without it the cost in the install guides is a one-off reading nobody can reproduce, which is what the brief's first reading is today.
- **Backend probe and command coverage** (`readSemanticLaneHealth` in `ADV/handlers/advisor-status.ts`): without them status reads `laneEnabled: true` after the server goes away and never counts the 45 command vectors.
- **Prompt embedding deadline** (`withSemanticShadowPromptEmbedding` in `ADV/lib/scorer/lanes/semantic-shadow.ts`): without it a hung server holds the call for 5,000 ms and the Claude hook drops the brief at 2,500 ms.
- **Warning** (`outputWarnings` in `ADV/handlers/advisor-recommend.ts`): without it a caller cannot tell a phrase-only answer from a full one. The operator chose this surface over a brief line.
- **Doctor route** (`DOC/assets/doctor-skill-advisor-embedder.yaml`): without it no path sets the embedder up, and `rebuild` writes vectors only by side effect.
- **Setup leg** (`DOC/assets/doctor-setup.yaml`): without it `/doctor:setup`, the command `INSTALL-SKILLED.md` sends every new user to, says nothing about the embedder.

### Data Flow
At recommend time the handler embeds the prompt once inside the deadline. A failure or a timeout sets `disabledReason`, the scorer runs on phrases and `outputWarnings` reads the reason into `semantic_lane_off:<reason>`. At status time `readSemanticLaneHealth` reads the pointer and both vector tables and asks `/api/tags` once. `/doctor:setup` and the route read that status. After a yes the route runs the approved steps, then `skill_graph_scan --trusted`, which embeds skills and commands as phase 004 built it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `withSemanticShadowPromptEmbedding` | Embeds the prompt for the cosine lane, waits up to the adapter's 5,000 ms | Update: deadline and distinct reasons | `tests/semantic-prompt-embedding-degrade.vitest.ts` |
| `readSemanticLaneHealth` and its schema | Reports pointer, skill coverage and the last reason | Update: `backend` and `commandVectorCoverage` | `tests/handlers/advisor-status.vitest.ts` |
| `outputWarnings` | Warns on a stale graph or a degraded lane | Update: one more warning | The degrade test's warning case |
| `readEmbeddingsHealth` (`ADV/lib/embedders/embeddings-health.ts`) | Probes the hf-local socket | Unchanged, the guide says what it probes | REQ-011 |
| `OllamaAdapter` and `OLLAMA_QUERY_TIMEOUT_MS` (`system-spec-kit/shared`) | Shared deadline for every query embedding | Unchanged. The deadline lives in the advisor's wrapper so other consumers keep 5,000 ms | `git diff --stat` shows no file under `system-spec-kit/shared` |
| `/doctor:setup` | Five read-only legs | Update: sixth leg | `DOC/scripts/tests/run-all.sh` |
| `/doctor:install` | Five printed steps | Update: the embedder route becomes step 5 and `/doctor:setup` step 6 | `doctor-install-contract.test.cjs` |
| `/doctor:skill-advisor` | Six routes | Update: seventh route | `skill-advisor-route-contract.test.cjs`, `route-validate.sh`, `doctor-phrase-reach.cjs` |
| Command bridge inventory | 45 TypeScript rows with `embeddingText` | Update: the route's bridge becomes active like its six siblings | Both captures and the policy rollup |
| Hook brief (`ADV/lib/render.ts`) | Renders the brief | Unchanged, by the operator's answer of 2026-11-12 | Golden briefs unchanged in `npm test` |

Matrix axes for the degrade test: server reachable or absent, model pulled or missing, answer inside or past the deadline, model warm or cold. The test holds one row per failure value plus a warm row and a cold-inside-deadline row, six rows in total.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the before numbers, the hook timing and the cold-load behaviour after an aborted call. Implementation adds the script, the deadline, the status fields, the warning, the route, the setup leg and the guide text in the waves `tasks.md` lists. Verification reruns the script, both captures, the floor, the rollup, the hook timing and both test suites. The ordered work and each task's check are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The prompt embedding with an injected adapter: warm, cold inside the deadline, absent, model missing, past the deadline and the warning | Vitest, `tests/semantic-prompt-embedding-degrade.vitest.ts` with `VITEST` stubbed off inside the test |
| Unit | Status `backend` states and `commandVectorCoverage` against fixture databases | Vitest, `tests/handlers/advisor-status.vitest.ts` |
| Integration | The route's plan-first contract, the setup leg and the install step | `bash DOC/scripts/tests/run-all.sh`, `bash DOC/scripts/route-validate.sh`, `node DOC/scripts/doctor-phrase-reach.cjs` |
| Integration | Captures, floor and rollup unchanged with the new bridge active | `capture-command-routing-baseline.mjs` with and without `--real-embedding`, `capture-scorer-eval-baseline.mjs` |
| Manual | The script on the build machine, once warm and once after the 5 minute unload | `node ADV/scripts/measure-embedder-cost.mjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Ollama 0.40.15 with `nomic-embed-text:v1.5` | External | Green: running on 2026-11-12 | No measured numbers. The tests still run with an injected adapter |
| Phase 005 merged | Internal | Pending | Two shared files would conflict |
| Phase 004 command vectors and meaning anchor | Internal | Green: Complete | The route would have nothing to embed |
| Operator answers to the four questions | Decision | Green: answered 2026-11-12 | None |
| `../../001-semantic-lane-enablement` | Internal | Draft | Its status work lands on the same object. Whichever comes second builds on the first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a capture, the floor or the rollup moves, the hook leaves its budget, a contract test fails or the route acts before a yes.
- **Procedure**: revert this phase's commits. The route's vector row stays in the local database and is pruned by the next scan once the bridge is inactive, as phase 004 built the prune. Nothing the route installed for a user is undone by a revert. Its plan names each step's own undo, such as `ollama rm nomic-embed-text:v1.5` for the pull.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 005 merged and the embedder running | Implementation |
| Implementation | The before numbers and the cold-load reading | Verification |
| Verification | Every implementation wave | Closing the packet |
<!-- /ANCHOR:phase-deps -->

---
