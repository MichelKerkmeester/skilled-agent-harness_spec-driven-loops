---
title: "Frontier Initialization"
description: "Classifies the context session (fresh, resume, restart, invalid) and creates all canonical state files before the first parallel sweep runs."
trigger_phrases:
  - "frontier initialization"
  - "session classification"
  - "fresh context session"
  - "resume deep-context"
  - "restart context loop"
  - "create context state files"
---

# Frontier Initialization

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Classifies the context session and creates all canonical state files before the first parallel sweep runs.

Initialization is the workflow-owned entry into a context session. It reads existing state artifacts to decide whether the run is fresh, a resume, a restart, or an invalid state before writing anything. Fresh runs create `deep-context-config.json`, `deep-context-state.jsonl`, `deep-context-strategy.md`, and `findings-registry.json`. Resume detects complete, consistent prior state and appends a typed `resumed` event, then skips directly to `phase_loop`. Restart archives the current packet under the local `context_archive/` tree, mints a fresh `sessionId`, and increments `generation`.

---

## 2. HOW IT WORKS

### Session Classification

`step_classify_session` inspects three canonical artifacts — `{artifact_dir}/deep-context-config.json`, `deep-context-state.jsonl`, and `deep-context-strategy.md` — and produces one of four outcomes:

- **fresh**: none of the three exist; proceed with a new session
- **resume**: all three exist and agree on `scope` and `specFolder`; append a `resumed` event and skip to `phase_loop`
- **completed-session**: artifacts exist and `config.status == "complete"`; halt with a message to archive or replace before a new session
- **invalid-state**: any partial, missing, or contradictory combination; halt for repair

### State File Creation

Fresh runs call `step_create_config`, `step_create_state_log`, `step_create_strategy`, and `step_create_registry` in sequence. The config is written from the `deep_context_config.json` template with all resolved setup bindings. The JSONL log is seeded with one typed config record. The strategy file is populated with the seeded frontier, executor pool roster, and known context from memory. The findings registry is initialized with empty buckets and zeroed metrics.

### Lock and Directory Management

`step_acquire_lock` opens an advisory lock on `{artifact_dir}/.deep-context.lock` before session classification. `step_create_directories` creates `prompts/`, `iterations/`, `deltas/`, and `seats/` subdirectories. The lock is released at the end of `phase_save` or on any terminal halt branch.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `phase_init` steps: classify, create directories, acquire lock, seed frontier, create state files, enrich strategy |
| `.opencode/commands/deep/assets/deep_context_confirm.yaml` | Workflow | Mirrors the init path with confirm-mode gates before each phase |
| `.opencode/commands/deep/context.md` | Command | Setup phase that resolves scope, spec_folder, executor_pool before YAML loads |
| `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` | Asset | Default config template written at initialization |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/01--frontier-seeding/frontier-initialization.md` | Manual playbook | Verifies session classification, state file creation, and lock lifecycle |

---

## 4. SOURCE METADATA

- Group: Frontier Seeding
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--frontier-seeding/frontier-initialization.md`

Related references:
- [scope-binding-and-code-graph-seeding.md](scope-binding-and-code-graph-seeding.md) — Code-graph frontier seeding that follows initialization
- [config-shape-and-default-pool.md](config-shape-and-default-pool.md) — Config template and default executor pool
