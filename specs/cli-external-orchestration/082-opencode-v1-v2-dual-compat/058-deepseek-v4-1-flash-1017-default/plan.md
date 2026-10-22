---
title: "Implementation Plan: Phase 58: deepseek-v4-1-flash-1017-default"
description: "Move the DeepSeek flash default to the 2026-10-17 gateway release by adding one bare literal, mapping it to llmgateway and naming it in the repository defaults, while the older literal keeps its own route and stays pinnable. Then hold every default with assertions that fail on a revert, and prove the result live on Pi, OpenCode 1, OpenCode 2 and Hermes."
trigger_phrases:
  - "deepseek v4 1 flash 1017 default plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 58: deepseek-v4-1-flash-1017-default

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript for the runtime config, Node.js CommonJS for the fan-out script and the cli-opencode test, JSON for the config files, Markdown for the rosters and docs |
| **Framework** | Pi, OpenCode 1.19.3, OpenCode 2.0.32 and Hermes, all through LLM Gateway |
| **Storage** | None; the evidence lands in `scratch/` as the revert proofs and the live run transcripts |
| **Testing** | vitest for the runtime, `node:test` for the cli-opencode test, the revert proofs, and live dispatches on each host |

### Overview
One literal names one model, so the new gateway id gets its own literal rather than resolving through the old one. `deepseek-v4.1-flash-1017` maps to `llmgateway`, becomes the default for cli-pi and cli-hermes, and reaches cli-opencode as `llmgateway/deepseek-v4.1-flash-1017`. The older literal keeps its literal, its route and a non-default roster row, so a run can still pin the 2026-09-10 build. Both literals sit in the max-pin regex, which is what makes an unpinned run land on the top tier. After the first pass the operator widened the scope: the new id also becomes Pi's own `defaultModel` and the pi-blackhole worker model, so a `pi` run that names nothing reaches it directly rather than only through the DeepSeek roster.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a literal-to-route registry. Each model id is a literal, each literal resolves to exactly one provider, and a default is a choice of literal rather than a flag anywhere else.

### Key Components
- **`PI_SUPPORTED_MODELS` and `HERMES_SUPPORTED_MODELS`** in `executor-config.ts`: the closed rosters, at 10 and 7 ids. The new literal joins both; the older literal stays on both.
- **`PI_DEFAULT_MODEL` and `HERMES_DEFAULT_MODEL`**: the two bare-literal defaults, both moved to the new id.
- **`PI_MODEL_PROVIDERS`** in `fanout-run.cjs`: the map that turns a bare literal into `provider/model`. The new literal maps to `llmgateway`, which is also what the older one already did.
- **`OPENCODE_DEFAULT_MODEL` and `opencode.json`**: the OpenCode default in both forms, a provider-qualified literal plus `--variant max` on OpenCode 1 and `#max` on OpenCode 2.
- **`isFlashMaxPinnedModel` and its mirrored plain function**: one regex, written twice because the command builders are synchronous. Both copies carry the new id.
- **`.pi/models.json` and `.pi/settings.json`**: the Pi provider block, which needs an entry per id, and the enabled list, which needs the qualified name. On the operator's widened scope `defaultModel` also moves to the new id and takes the first `enabledModels` slot, every earlier entry kept, while `defaultProvider` stays `llmgateway` and `defaultThinkingLevel` stays `xhigh`.
- **`.pi/pi-blackhole-config.json`**: the pi-blackhole worker model, moved to `llmgateway` / `deepseek-v4.1-flash-1017` / `high`, the same id Pi now defaults to. `high` is a real tier in the -1017 thinking-level map, unlike `xhigh`, which the map marks `null`.
- **The docs and their mirrors**: three CLI skills, the playbooks, the presentations and their compiled contracts, the council seat doc, and the Hermes mirrors generated from the `.skilled` tree.

### Data Flow
A caller names no model. The fan-out takes the default literal for that executor, looks the provider up in the map, composes `llmgateway/deepseek-v4.1-flash-1017`, applies the max pin, and builds the version-specific argument list. OpenCode reads `opencode.json` for the same id when nothing is passed. Because the literal and the map entry are one pair, nothing else has to know which release is current.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Four suites carry the change: the executor-config vitest for the rosters, both defaults, the `.pi/models.json` registration, the max pin, and the widened Pi default and blackhole model; the fan-out vitest for the provider map, both defaults, the pinned argument list and the older literal still building its own selector; the OpenCode dual-dispatch vitest for the built command; and the cli-opencode `node:test` file for `opencode.json` in every model field and the older id as a non-default roster row.

A green suite proves the new value works, not that anything holds it, so each new assertion has a revert proof: revert the value, watch the specific assertion fail, restore it. Twelve proofs are recorded in `scratch/revert-proofs.txt`, four of them for the settings and blackhole assertions.

The live proof runs each host rather than trusting the tests: Pi with no `--model` at all, which is what the widened default changes, and Pi with the blackhole extension active behind a capture proxy so the worker and observer requests are visible; Pi at `--thinking max` and `high` with the qualified id and a JSON reply that names the model, provider and thinking level; OpenCode 1 pinned with `--variant max` and unpinned; OpenCode 2 with `--standalone -m …#max`; and an unpinned fan-out on each of the four kinds. A capture proxy records the request model, which is the only way to see what was actually sent rather than what was built.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The LLM Gateway catalog must list the new id and answer it, and both OpenCode versions must be installed to list models. The `.pi` provider block must be readable by the trials. Hermes must resolve its `llmgateway` provider block from the operator's own config, since the repo cannot carry it. Main must have the Cline and MiMo retirements before the rebase, or the rosters would disagree with it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Every default returns to `deepseek-v4.1-flash` and the new literal leaves both rosters, the provider map and `.pi/models.json`. The older literal, its route and its docs were never removed, so the rollback restores the previous default without a second edit. The cost is that the default goes back to an id whose DeepSeek provider route is listed as deactivating on 2026-10-24, though the `llmgateway` route this repo dispatches is the one that serves it.
<!-- /ANCHOR:rollback -->

---
