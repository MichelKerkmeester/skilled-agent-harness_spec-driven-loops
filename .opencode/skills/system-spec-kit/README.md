---
title: "System Spec Kit"
description: "Makes AI development continuity durable: every file change gets a templated spec folder that records the reasoning. Every new session resumes that reasoning from the packet's own committed documents."
trigger_phrases:
  - "spec kit"
  - "spec folder"
  - "continuity system"
  - "hybrid search"
  - "context preservation"
  - "documentation levels"
  - "memory save"
  - "spec folder workflow"
version: 3.8.0.0
---

# System Spec Kit

> Every file change gets a documented why. Every new session picks up where the last one ended.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Capturing why code changed and resuming that reasoning across sessions |
| **Invoke with** | "spec kit", "spec folder", "memory save", "/speckit:resume" or automatic Gate 3 routing |
| **Works on** | File-modifying AI conversations that need a documentation trail and cross-session continuity |
| **Produces** | Templated spec folders at four levels, a validated file structure and entries in the committed trigger index |

---

## 2. OVERVIEW

### Why This Skill Exists

AI conversations that modify files leave no reasoning trail. The session ends and the why behind every decision vanishes. A new session starts from a blank slate, so the architecture you explained on Monday is gone by Wednesday. Without enforced documentation and durable continuity, one session cannot build on another.

### What It Does

System Spec Kit captures every file-modifying conversation in a templated spec folder at one of four documentation levels matched to task complexity. Those decisions stay findable across sessions because they are committed files: a generated trigger index matches a prompt against author-declared phrases, and ripgrep finds anything else. `/speckit:resume` rebuilds the active context from packet-local sources. `/memory:save` routes session updates into canonical documentation surfaces so the next session picks up where the last one stopped, on any model or tool.

### How This Compares

Manual documentation is ad hoc and inconsistent. Basic RAG offers vector similarity over a stateless index. System Spec Kit replaces both with templated folders at four levels, validated structure, and retrieval that reads the committed tree rather than a shadow copy of it. Context survives across sessions in the packet's own documents rather than in copy-pasted notes or a store that can drift from them. Nothing decays: a decision stays exactly as legible on its four-hundredth day as on its first, and a phrase nobody wrote is a clean no-hit rather than a confident wrong answer.

### Requirements

- Node.js 20.11 or newer
- TypeScript 5.0 or newer
- Bash 4.0 or newer

Embeddings are local-first. The runtime probes Ollama first with the default `nomic-embed-text` model at 768 dimensions, falls through to the pure-Node hf-local tier and only escalates to OpenAI or Voyage when an API key is set and no local tier is available. The recommended new-user setup is installing Ollama and running `ollama pull nomic-embed-text:v1.5`. The cascade auto-detects it, no API keys are required and all embeddings stay on-device.

### The Spec Folder System

| Capability | What the skill knows how to operate |
|---|---|
| **Documentation levels** | four levels matched to task complexity, from the Level 1 baseline up to the Level 3+ governance set |
| **Phase parents** | lean parent folders with the control-file trio and named child phase folders |
| **Packet-local changelogs** | `changelog/` history written beside packet roots and direct child phases at closeout |
| **Validation** | the 46-rule registry with four strict-only rules gated behind `--strict` |

### Continuity and Retrieval

| Capability | What the skill knows how to operate |
|---|---|
| **Gate 1 trigger lookup** | a committed index over author-declared `trigger_phrases`, answered from a cold Node process with no service running |
| **Free-text retrieval** | literal ripgrep recipes scoped by track and packet, ordered by a caller-side ranking tuple |
| **Continuity** | the `handover.md` then `_memory.continuity` then packet-docs ladder, written by `generate-context.js` |
| **Declared loss** | semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup and causal traversal are retired with no successor |

The retrieval contract is `references/retrieval/retrieval-conventions.md`, and the corpus convention those recipes depend on is `references/structure/grep-convention.md`. A lookup that matches nothing returns nothing; nothing degrades to an approximate answer.

---

## 3. QUICK START

**Step 1: Create your first spec folder.**

When an AI assistant asks "Which spec folder?" at Gate 3, choose Option B (New):

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh 042-my-feature
```

The script creates `specs/042-my-feature/` with the Level 1 starters, initializes `description.json` and prepares the packet docs plus a `scratch/` workspace:

- `spec.md`: what the feature is and why it exists
- `plan.md`: how to implement it
- `tasks.md`: the step-by-step task breakdown
- `implementation-summary.md`: written after implementation completes

Continuity no longer writes to `[spec]/memory/*.md`. Use `/memory:save` to route updates into the canonical packet docs:

- `implementation-summary.md`
- `decision-record.md`
- `handover.md`

**Step 2: Save context at the end of a session.**

```bash
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"042-my-feature","user_prompts":["Implement login form validation"],"observations":["Added client-side validation for empty email and password"],"recent_context":["Touched auth form schema and submit handler"],"toolCalls":["npm test -- auth"],"exchanges":["Verified the error states render before submit"]}' \
  specs/042-my-feature/
```

The command updates the canonical continuity surfaces for the target folder, refreshes `description.json.lastUpdated` and rewrites the derived fields in `graph-metadata.json`. The `/memory:save 042-my-feature` shorthand does the same. There is no second save lane: the continuity writer is the only path that touches those files, so a save either went through it or did not happen.

**Step 3: Resume work from a previous session.**

```text
/speckit:resume
```

The system resolves the requested folder first. For a phase parent it follows the valid `derived.last_active_child_id` pointer into the active child. It then compares folder-local `handover.md` and `_memory.continuity` freshness and falls back to the packet's canonical spec docs. It presents the current state, prior decisions, touched files and next steps before you start.

**Step 4: Search for context.**

```text
/memory:search "how did we decide on the auth architecture?"
```

The system reads the question, classifies the task intent and routes to the right search strategy automatically.

**Step 5: Validate a spec folder.**

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  specs/[project]/042-my-feature/
```

The default validation set runs the non-strict rules from the 46-rule registry. Exit 0 means all rules pass, exit 1 is a user error, exit 2 is a validation error and exit 3 is a system error.

**Step 6: Verify retrieval works.**

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs \
  --json -- "spec folder"; echo "exit=$?"
```

Exit `0` means the index resolved candidates, `1` means a clean miss and `2` means a bad invocation or an unreadable index. There is nothing to start and nothing to keep warm: the index is a committed file, and a fresh clone answers on the first call.

If the index is missing, rebuild it:

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs
```

### Common Patterns

| Pattern | Command or script | When to use |
|---|---|---|
| New feature, small scope | `create.sh NNN-name` | under 100 LOC, single file |
| New feature, needs QA | `create.sh NNN-name` at Level 2 | 100 to 499 LOC |
| Architecture change | `create.sh NNN-name` at Level 3 | 500+ LOC, multiple systems |
| Multi-phase work | `create.sh NNN-name --phase` | large features, multiple sessions |
| Save session progress | `/memory:save [folder]` | before ending any session |
| Recover after crash | `/speckit:resume` | session interrupted unexpectedly |
| Check prior decisions | `/memory:search "query"` | starting a related task |
| Upgrade documentation level | `upgrade-level.sh [folder] [level]` | scope grew beyond the original level |
| Validate before claiming done | `validate.sh [folder]` | before any completion claim |

---

## 4. HOW IT WORKS

### The Packet Lifecycle

Every conversation that modifies files gets a spec folder. Gate 3 in AGENTS.md enforces this by asking "Which spec folder?" before any file modification begins. The only exemptions are single-file fixes under 5 characters, typo or whitespace corrections.

```text
Session starts
  └─► Gate 3 asks: "Which spec folder?"
       ├─► Option A: Use existing folder
       ├─► Option B: Create new folder (create.sh)
       └─► Option E: Skip documentation
            │
            ▼
  AI modifies files, tracks tasks in tasks.md
            │
            ▼
  Session ends
  └─► generate-context.js updates canonical continuity surfaces
       └─► regenerate the trigger index when frontmatter changed
            │
            ▼
  Next session starts
  └─► /speckit:resume compares handover.md and _memory.continuity freshness, then falls back to packet docs
       └─► the ripgrep context recipe deepens retrieval when needed
       └─► AI resumes with context + health + structural readiness
```

### Spec Folder Structure

```text
specs/<###-feature-name>/
├── description.json             # Spec identity and continuity metadata
├── spec.md                      # What the feature is and why it exists
├── plan.md                      # How to implement it
├── tasks.md                     # Step-by-step task breakdown
├── acceptance-criteria.md       # Criteria that gate packet closure (Level 2+)
├── checklist.md                 # QA validation gates (Level 2+)
├── decision-record.md           # Architecture decisions (Level 3+)
├── implementation-summary.md    # Post-implementation summary (all levels)
├── handover.md                  # Operator-facing session handoff for /speckit:resume
├── resource-map.md              # Optional lean path catalog (any level)
├── changelog/                   # Packet-local changelog history for packet roots and phase parents
└── scratch/                     # Temporary workspace files (gitignored)
```

`implementation-summary.md` is required at all levels but created after implementation completes, not at folder creation time. `generate-context.js` updates the packet continuity state for `/speckit:resume`, refreshes `description.json.lastUpdated` and rewrites the derived fields in `graph-metadata.json` on every run. It is the only writer of those files, so metadata cannot lag behind a save that went through it.

### Documentation Levels

Not every change needs the same amount of paperwork. A one-line bug fix does not need an architecture decision record. A multi-system refactor does. Four levels match documentation depth to task complexity:

| Level | LOC guidance | Required files | When to use |
|---|---|---|---|
| **1** | under 100 | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | small features, bug fixes, single-file changes |
| **2** | 100 to 499 | Level 1 plus `acceptance-criteria.md`; `checklist.md` optional | features needing QA verification, multi-file changes |
| **3** | 500 and up | Level 2 plus `decision-record.md` | architecture changes, complex refactors |
| **3+** | complexity 80 and up | Level 3 plus approval workflow, compliance and stakeholders | high-complexity work needing review tracking |
| **Phase Parent** | control files only | `spec.md`, `description.json`, `graph-metadata.json` | folder contains phase children with their own spec docs |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

### Checklist Priority System

Level 2 and up uses a priority system so reviewers know what blocks shipping:

| Priority | Meaning | Deferral |
|---|---|---|
| **P0** | hard blocker, cannot ship without this | cannot defer |
| **P1** | required, must complete or get user approval to defer | needs explicit approval to skip |
| **P2** | optional, nice to have | can defer without approval |

### Phase Parents

A folder is a phase parent when it has at least one direct child that matches `[0-9]{3}-[a-z0-9-]+` with its own `spec.md` or `description.json`. The parent then needs only the lean control trio. Heavy docs live exclusively in the children where they stay accurate to that phase's actual work. The parent `spec.md` carries a Phase Documentation Map. `graph-metadata.json` carries `derived.last_active_child_id` and `derived.last_active_at` pointer fields that the generator updates atomically on every save. Parent saves write `null` and child saves bubble up the child's `packet_id`.

`/speckit:resume` reads the pointer first when the target is a phase parent and follows valid bare child ids or track-relative child paths under the parent. The redirect is bounded and escape-safe. Missing, malformed, stale-to-missing-child or non-child pointers leave resume on the requested folder instead of escaping the packet tree. Detection is a single source of truth: `is_phase_parent()` in shell and `isPhaseParent()` in ESM JavaScript MUST agree.

### Phase Decomposition

When a feature is too large for a single spec folder, split it into a parent folder and child folders. The parent holds the overall specification. Each child holds one phase of the work.

```text
specs/022-big-feature/             # Parent spec folder
├── spec.md                        # Overall specification
├── 001-data-model/                # Phase 1 child
│   ├── spec.md
│   └── ...
├── 002-api-endpoints/             # Phase 2 child
│   ├── spec.md
│   └── ...
└── 003-frontend/                  # Phase 3 child
    ├── spec.md
    └── ...
```

Use `create.sh --phase` to create a parent with its first child in one step. Run `validate.sh --recursive` to validate the parent and all children together. The validator's phase-parent branch skips Level-N expectations on the lean parent: `check-files.sh`, `check-level-match.sh`, `check-anchors.sh`, `check-section-counts.sh` and `check-template-headers.sh`. Tolerant migration policy: legacy phase parents that retain heavy docs continue to validate without churn.

### Packet-Local Changelogs

The `/speckit:implement` and `/speckit:complete` commands plus the nested changelog workflow can write packet history into a local `changelog/` directory when the target is a packet root or a direct child phase, using the canonical root and phase naming rules. Packet-local changelogs are additive, not a replacement for `implementation-summary.md`.

### Template Rendering

Templates live in one manifest source and render through the Level contract resolver. `create.sh` asks the resolver which files belong to each level, then the inline renderer expands only the sections allowed for that level.

```text
Level 1:  spec.md, plan.md, tasks.md, implementation-summary.md
Level 2:  Level 1 + acceptance-criteria.md (checklist.md optional)
Level 3:  Level 2 + decision-record.md
Level 3+: Level 3 + extended governance sections
Phase:    lean parent trio plus child phase folders
```

Optional support documents such as `handover.md`, `debug-delegation.md`, `research.md` and `resource-map.md` render through the workflow that owns them. Templates use ANCHOR markers to mark logical sections. Validation checks required anchors, section ordering, template version alignment and cross-reference consistency. The `template-compliance-contract.md` reference defines which anchors are required at each level.

`create.sh` rejects `--path` values that traverse outside the repository with a clear error before any write. Set `SPECKIT_POST_VALIDATE=1` when a strict workflow should run full validation immediately after scaffolding. A mkdir-based advisory lock protects `description.json` and `graph-metadata.json` writes during canonical save so two parallel `/memory:save` calls for the same packet do not race.

The memory MCP server that used to sit here is gone. It held the search pipeline, query
intelligence, the memory lifecycle, save scoring, the causal graph, index self-maintenance and
the evaluation harness, and none of that came back in another form.

Retrieval is now two lexical lanes over committed files. `lookup-trigger-index.mjs` matches a
prompt against author-declared `trigger_phrases` through the generated index, and the ripgrep
recipes in `references/retrieval/retrieval-conventions.md` find a phrase anywhere in the corpus.
Continuity is written by `scripts/dist/memory/generate-context.js` into the packet itself and read
back through the ladder `/speckit:resume` walks. Semantic paraphrase, ranking fusion, decay,
access tracking, session dedup and graph traversal have no successor: a phrase nobody wrote is a
clean no-hit.

---

## 5. COMMANDS

### Spec Kit Commands

| Command | Steps | Purpose |
|---|---|---|
| `/speckit:plan --intake-only` | none | standalone intake interview that publishes `spec.md`, `description.json` and `graph-metadata.json` |
| `/speckit:plan` | 7 | planning only, spec through plan, no implementation |
| `/speckit:implement` | 9 | execute pre-planned work, requires an existing `plan.md` |
| `/speckit:complete` | 14 | full end-to-end workflow from spec through implementation, verification and closeout |
| `/speckit:resume` | 4 | resume a previous session on an existing spec folder |
| `/deep:research` | none | autonomous research loop with convergence detection |
| `/deep:review` | none | autonomous review loop with convergence detection |

When intake is still needed, `/speckit:plan` and `/speckit:complete` use the shared intake contract from `references/workflows/intake-contract.md`. Downstream callers consume the returned `start_state` as the canonical intake enum.

### Mode Suffixes

| Suffix | Behavior |
|---|---|
| `:auto` | execute without approval gates |
| `:autopilot`, `:unattended` or `--unattended` | run the branch-preserved unattended lifecycle and emit `SPECKIT_AUTOPILOT_RESULT` on terminal exits |
| `:confirm` | pause at each step for approval |
| `:with-phases` | phase decomposition mode on planning or completion flows |
| `:with-research` | dispatch deep research before verification, `/speckit:complete` only |

Autopilot is distinct from `:auto`. It requires unattended task metadata during planning, preserves the branch on hard failure, skips merge unless verification is clean and limits terminal reasons to `no_eligible_tasks`, `retry_exhausted`, `verification_failed` and `uncertainty_blocked`.

Command source files: `.opencode/commands/speckit/`.

### Memory Commands

| Command | Purpose |
|---|---|
| `/memory:save` | update packet continuity surfaces through `generate-context.js`; no indexing hand-off |
| `/memory:search` | retrieval over spec docs using the ripgrep recipes, scoped by track and packet |

The tool counts these commands used to carry were counts of memory MCP tools. They are gone, so the column is too.

Command source files: `.opencode/commands/memory/`.

---

## 6. CONFIGURATION

### Embedding Providers

The shared embedding client, whose only live consumer is the skill advisor, converts text to numerical embeddings. Four providers are supported. The default cascade when `EMBEDDINGS_PROVIDER=auto` or unset is local-first: Ollama, then hf-local, then OpenAI, then Voyage.

| Tier | Provider | Dimensions | Notes |
|---|---|---|---|
| 1 | Ollama | 768 | default. Probes `/api/tags` and uses `nomic-embed-text-v1.5`. Recommended new-user setup |
| 2 | HuggingFace local | 768 | pure-Node `@huggingface/transformers` model server, same model family as the Ollama default |
| 3 | OpenAI | 1536 | cloud opt-in, requires `OPENAI_API_KEY` |
| 4 | Voyage AI | 1024 | cloud opt-in, requires `VOYAGE_API_KEY`, gated by the egress guard |

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `EMBEDDINGS_PROVIDER` | no | `auto` follows the local-first cascade. Set to `ollama`, `hf-local`, `openai` or `voyage` to pin a tier |
| `VOYAGE_API_KEY` | no | Voyage AI cloud embeddings, opt-in |
| `OPENAI_API_KEY` | no | OpenAI cloud embeddings, opt-in |
| `OLLAMA_EMBEDDINGS_MODEL` | no | override the Ollama model, listed defaults derive dimensions at runtime |
| `HF_EMBEDDINGS_MODEL` | no | override the hf-local model, listed defaults derive dimensions at runtime |
| `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` | no | directory override for the skill advisor's database, the one SQLite store the shared client still serves |
| `MEMORY_DB_PATH` | no | explicit file override for that same database; the name predates the advisor being its only owner |
| `LOG_LEVEL` | no | log verbosity: `debug`, `info`, `warn` or `error` |
| `SPECKIT_LAUNCHER_RSS_SELF_EXIT` | no | set `1` to enable the RSS-ceiling watchdog in the shared model-server supervisor, default off |

The full environment variable reference, including evaluation and telemetry overrides plus the feature flag table, lives in `references/config/environment-variables.md`.

Note: in a restricted or read-only repo context, point `SPEC_KIT_DB_DIR` at a writable directory such as one under your home folder or `/tmp`. Use `MEMORY_DB_PATH` only when you intentionally need one fixed sqlite file for the advisor.

### MCP Server Configuration

This skill registers no MCP server of its own. Retrieval runs from two committed scripts under `scripts/retrieval/`, and continuity is written by `scripts/dist/memory/generate-context.js`. There is nothing to add to `mcpServers` for a generic MCP client, and nothing to keep warm.

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"
node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs
```

### Feature Flags

The engine resolves feature flags at call time rather than at import, so a long-lived process picks up an environment change without a restart. The flags that survive the retirement of the search store govern the shared embedding client and the runtime hook adapters:

| Group | Controls |
|---|---|
| Embedding and API | startup provider resolution, fail-fast dimension checks, structured fallback metadata |
| Hooks and Completion | completion-evidence stop hook, directive-lifecycle cadence, spec-gate enforcement |

For the full flag reference and rollback procedures, see `references/workflows/rollback-runbook.md`.

---

## 7. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for System Spec Kit whenever a conversation is about to modify files, when a session ends and context should survive or when a new session needs to pick up prior work.

- Gate 3 asks "Which spec folder?" and the work needs a new or existing packet
- A session ends and the reasoning behind the changes should survive
- A new session starts on work from a previous one
- A feature is large enough to split into phases
- A spec folder needs validation before completion

### Boundaries

System Spec Kit owns four surfaces: the spec folder workflow, the validation surface, the continuity writer and the commands that drive them. It does not own the other disciplines a working session touches. `sk-code` owns application-code standards. `sk-git` owns git workflow orchestration. `sk-doc` owns documentation quality and DQI scoring. Retrieval reaches spec and skill docs, not arbitrary application code.

### Files and Folders

```
.opencode/skills/system-spec-kit/
├── SKILL.md                    # AI workflow instructions (when to use, gates, rules)
├── README.md                   # This file (what it does, how to use it)
├── ARCHITECTURE.md             # Boundary contract: scripts/ vs runtime/
├── templates/                  # Manifest template source
│   └── manifest/               # Rendered by Level contract resolver + inline renderer
├── scripts/                    # CLI tools (TypeScript source + Bash)
│   ├── spec/                   # Spec folder management scripts
│   ├── memory/                 # Continuity scripts
│   ├── templates/              # Template composition (manifest renderer)
│   ├── core/                   # Core library (17 modules)
│   ├── extractors/             # Session data extractors (12 extractors)
│   ├── utils/                  # Utility modules (20 utilities)
│   └── dist/                   # Compiled JavaScript output
├── runtime/                 # Spec Kit engine (TypeScript), consumed as a library
│   ├── api/                    # Public barrel imported by the scripts workspace
│   ├── handlers/               # Spec-document discovery, save-path folder mutex
│   ├── lib/                    # Validation, graph metadata, description, continuity
│   ├── hooks/                  # Per-runtime hook adapters and the spec-gate core
│   ├── stress-test/            # Opt-in load and contention suites
│   ├── tests/                  # Engine test suite
│   └── README.md               # Engine reference (API surface, build, validation)
├── shared/                     # Shared workspace (@spec-kit/shared)
│   ├── algorithms/             # Fusion, reranking, lab algorithms
│   ├── contracts/              # Typed trace/envelope contracts
│   ├── embeddings/             # Provider implementations
│   └── ...                     # Chunker, scoring, parsing, utilities
├── references/                 # Reference documentation (27 files)
├── assets/                     # Decision matrices, YAML configs
├── constitutional/             # Always-surface rules (never decay)
├── feature-catalog/            # Feature documentation catalog
└── manual-testing-playbook/    # Manual validation scenarios
```

### Key Files

| File | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | AI agent instructions: routing rules, gates, validation procedures, template application |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | API boundary contract between `scripts/` and `runtime/` |
| [`runtime/README.md`](./runtime/README.md) | engine architecture, the public API surface, build and validation commands |
| [`scripts/spec/create.sh`](./scripts/spec/create.sh) | create spec folders with level-appropriate template files |
| [`scripts/spec/validate.sh`](./scripts/spec/validate.sh) | run the validation set from the 46-rule registry on any spec folder |
| `scripts/dist/memory/generate-context.js` | update packet continuity state from structured JSON |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | complete catalog of implemented features |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | manual scenarios that validate the catalog |

### Related Skills

| Skill | Relationship |
|---|---|
| [`sk-doc`](../sk-doc/SKILL.md) | owns documentation quality, DQI scoring and HVR compliance |
| [`sk-code`](../sk-code/SKILL.md) | owns application-code standards and stack-aware workflows |
| [`sk-git`](../sk-git/SKILL.md) | owns git workflow orchestration, worktrees and PRs |
| [`system-skill-advisor`](../system-skill-advisor/SKILL.md) | owns prompt-time skill routing, including the advisor hook this skill uses |
| [`system-deep-loop`](../system-deep-loop/SKILL.md) | owns the `/deep:*` loop commands that anchor into spec folders |

---

## 8. TROUBLESHOOTING

### Trigger Lookup Fails

The Gate 1 lookup exits `2`. That is a bad invocation or an unreadable index, never a clean miss.

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs --json -- "spec folder"; echo "exit=$?"
ls -l .opencode/skills/system-spec-kit/data/trigger-index.json
```

Exit `0` means candidates were found and `1` means none were. If the index file is missing or truncated, regenerate it with `scripts/retrieval/generate-trigger-index.mjs`.

### Continuity Save Fails or Creates an Empty File

`generate-context.js` runs but the output file is empty or the script exits with an error. Invalid structured JSON input, a missing explicit spec-folder target or TypeScript sources not compiled to `dist/` cause this.

```bash
cd .opencode/skills/system-spec-kit && npm run build
```

Rebuild the scripts, then retry with a valid structured payload and an explicit spec-folder target.

### Continuity Save Rejected by Quality Gate

The save runs but the payload is rejected by the sufficiency gate or the structure gate. The content is too thin or missing required structure. Read the post-save quality review output for the specific issue, then add a real `sessionSummary`, meaningful `recent_context` entries and described `FILES` rows before retrying.

### Validation Fails With "Missing Required Files"

`validate.sh` reports missing files such as `spec.md` or `plan.md`. This happens when the folder was created manually without `create.sh` or when wrong level templates were applied.

```bash
ls -la specs/[project]/NNN-feature/
bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh specs/[project]/NNN-feature/
bash .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh specs/[project]/NNN-feature/ [target-level]
```

### Retrieval Misses Content You Know Exists

The trigger index only knows what an author declared in `trigger_phrases`. A phrase that was never declared cannot be matched, and no amount of rephrasing will surface it — that is a corpus gap, not a lookup failure. Regenerate the index if frontmatter changed, then fall back to the free-text lane, which scans prose rather than declared phrases:

```bash
rg --no-config --fixed-strings --ignore-case --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

There is no paraphrase matching to fall back to. Retrieval is lexical.

### Quick Fixes

| Problem | Fix |
|---|---|
| `generate-context.js` not found | run `npm run build` in `system-spec-kit/` |
| Spec folder fails validation | run `validate.sh --verbose` and read each failing rule |
| Retrieval seems wrong | rerun the lookup and read the exit status: `0` hit, `1` clean miss, `2` broken |
| Session context lost after crash | use `/speckit:resume` to select the fresher folder-local source |
| Placeholder check fails | run `check-placeholders.sh` and replace all `[PLACEHOLDER]` values |
| Stale results after save | rerun `scripts/retrieval/generate-trigger-index.mjs` |
| Too many near-duplicate results | check that the interference penalty is active in feature flags |
| Trigger index absent in a fresh clone | it is committed at `data/trigger-index.json`; a missing file means a bad checkout, not a build step |

### Diagnostic Commands

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh specs/[project]/NNN-feature/
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/[project]/NNN-feature/ --verbose
bash .opencode/skills/system-spec-kit/scripts/check-api-boundary.sh
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs --json -- "spec folder"
```

---

## 9. FAQ

**Q: Is System Spec Kit mandatory for every file change?**

A: Yes, for any conversation that modifies files. The only exemption is single-file fixes under 5 characters, typo or whitespace corrections. Gate 3 in AGENTS.md enforces this by asking "Which spec folder?" before any file modification begins.

**Q: When do I need Level 2 instead of Level 1?**

A: Level 2 adds a `checklist.md` for QA verification. Use it when the change touches multiple files, needs testing verification or has edge cases worth documenting. The LOC guidance is 100 to 499, but risk and complexity matter more than line count.

**Q: When do I need Level 3?**

A: Level 3 adds a `decision-record.md` for architecture decisions. Use it for changes that affect system architecture, involve trade-offs between alternatives or touch 500+ lines across multiple systems. If future developers will ask why, Level 3 captures the answer.

**Q: How do spec folders and continuity work together?**

A: Spec folders capture what happened in structured documentation. `generate-context.js` updates the packet's canonical continuity surfaces. `/speckit:resume` rebuilds the next session from those sources, comparing folder-local `handover.md` and `_memory.continuity` freshness before falling back to packet docs. Deeper retrieval reads the same files directly: the trigger index for a declared phrase, the ripgrep recipes for anything else. One side captures, the recovery surfaces retrieve, and both work with nothing running.

**Q: Can I use retrieval without spec folders?**

A: Yes. The index and the ripgrep recipes read any Markdown under `specs` and `.opencode`, not only packet docs. For implementation work the canonical continuity path is still the spec folder itself, and Gate 3 asks about one before any file modification regardless.

**Q: What is the difference between this README and the MCP server README?**

A: This README covers the whole skill: spec folders, documentation levels, commands, templates and scripts. The MCP server README documents the retired store, and packet 049 removes it; read it as a record of what the engine did, not as an interface you can call.

**Q: What is the difference between SKILL.md and this README?**

A: SKILL.md contains instructions for AI agents: when to activate, routing rules, gate procedures and validation workflows. This README is for humans and AI alike: what the skill does, how to use it, where to find things and which commands drive it. SKILL.md is the employee handbook, this README is the product brochure.

**Q: How do I upgrade a Level 1 folder to Level 2 after the fact?**

A: Run `upgrade-level.sh` with the target level. It renders and injects the additional Level contract sections into the existing folder. Then run `check-placeholders.sh` to find new placeholder values that need filling.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh specs/[project]/NNN-feature/ 2
```

---

## 10. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/README.md --type readme` reports zero issues |
| Human Voice Rules | the em dash, semicolon and Oxford comma greps return zero prose hits |
| Link resolution | the link guard reports no failures in this README |
| Spec folder validation | `validate.sh` on a spec folder exits 0 |
| Retrieval health | the trigger lookup exits `0` for a known phrase, and `data/trigger-index.json` parses |

### Scripts That Manage Spec Folders

| Script | Purpose |
|---|---|
| `create.sh` | create spec folders with level-appropriate templates, `--phase` for parent plus child folders |
| `validate.sh` | run the validation set from the 46-rule registry, `--strict` for strict-only rules, `--recursive` for phase folders, `--verbose` for details |
| `upgrade-level.sh` | render additional Level contract sections for a higher level |
| `recommend-level.sh` | analyze scope and risk to recommend the right level |
| `calculate-completeness.sh` | calculate spec folder completeness as a percentage |
| `check-completion.sh` | verify all completion criteria are met |
| `check-placeholders.sh` | find remaining `[PLACEHOLDER]` values after a level upgrade |
| `check-template-staleness.sh` | detect templates that need regeneration |
| `progressive-validate.sh` | progressive validation for in-progress work |
| `quality-audit.sh` | run a quality audit on spec folder content |
| `archive.sh` | archive completed spec folders |
| `test-validation.sh` | test the validation rules themselves |

### Scripts That Maintain Continuity

| Script | Purpose |
|---|---|
| `generate-context.ts` | source for the runtime entry point `scripts/dist/memory/generate-context.js` |
| `backfill-frontmatter.ts` | add missing frontmatter to generated context artifacts |
| `backfill-research-metadata.ts` | backfill missing metadata files under `research/*/iterations/` |
| `rank-memories.ts` | rank continuity records by relevance for a query |
| `validate-memory-quality.ts` | run quality checks on continuity content |
| `ast-parser.ts` | parse markdown AST for section extraction |
| `fix-memory-h1.mjs` | fix heading levels in older generated artifacts |

TypeScript sources compile to `scripts/dist/`.

### Validation Helper Scripts

| Script | Purpose |
|---|---|
| `continuity-freshness.ts` | warn when `_memory.continuity.last_updated_at` lags `graph-metadata.json` |
| `evidence-marker-audit.ts` | bracket-depth audit and optional rewrap pass for malformed `EVIDENCE` markers |
| `evidence-marker-lint.ts` | strict wrapper that fails on malformed or unclosed markers |

The manual testing playbook runs every scenario behind these checks.

---

## 11. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | AI agent instructions, routing, gates and validation |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | API boundary contract between `scripts/` and `runtime/` |
| [`runtime/README.md`](./runtime/README.md) | engine architecture, the public API surface, build and validation commands |
| [`references/memory/memory-system.md`](./references/memory/memory-system.md) | detailed retrieval and continuity reference |
| [`references/workflows/intake-contract.md`](./references/workflows/intake-contract.md) | shared spec-folder intake contract for plan, complete and resume re-entry |
| [`references/workflows/rename-pattern.md`](./references/workflows/rename-pattern.md) | mechanical rename workflow and live-vs-historical surface discipline |
| [`references/workflows/spec-folder-write-recipe.md`](./references/workflows/spec-folder-write-recipe.md) | step-by-step recipe for a spec folder that passes strict validation on the first try |
| [`references/workflows/spec-folder-authoring-checklist.md`](./references/workflows/spec-folder-authoring-checklist.md) | companion checklist for the Level contract, continuity frontmatter and metadata files |
| [`references/workflows/rollback-runbook.md`](./references/workflows/rollback-runbook.md) | feature-flag rollback and smoke-test procedures |
| [`references/validation/validation-rules.md`](./references/validation/validation-rules.md) | validation rule reference, the 46-rule registry is authoritative |
| [`references/templates/template-guide.md`](./references/templates/template-guide.md) | template usage and composition rules |
| [`references/config/environment-variables.md`](./references/config/environment-variables.md) | full environment variable reference |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | complete catalog of implemented features |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | manual scenarios that validate the catalog |

### Cross-Skill Alignment

| Skill | Purpose |
|---|---|
| [`sk-doc`](../sk-doc/SKILL.md) | documentation quality standard, DQI scoring and HVR compliance |
| [`sk-code`](../sk-code/SKILL.md) | stack-aware code workflow and quality standard |
| [`sk-git`](../sk-git/SKILL.md) | git workflow orchestration, conventional commits and PRs |
| [`system-skill-advisor`](../system-skill-advisor/SKILL.md) | prompt-time skill routing and the advisor hook contract |
| [`system-deep-loop`](../system-deep-loop/SKILL.md) | deep research and review loops that anchor into spec folders |

### Project-Level References

| Resource | Purpose |
|---|---|
| `AGENTS.md` (project root) | gate definitions, AI behavior framework and mandatory workflow rules |
| `specs/` | all spec folders created by Spec Kit (`.opencode/specs` is a compat symlink to this same tree) |
| `.opencode/commands/speckit/` | speckit command definitions |
| `.opencode/commands/memory/` | continuity save and search command definitions |

### External Resources

| Resource | Purpose |
|---|---|
| [ripgrep](https://github.com/BurntSushi/ripgrep) | The free-text retrieval lane's search engine |
| [Ollama](https://ollama.com/) | Local embedding server used by the shared embedding client |
