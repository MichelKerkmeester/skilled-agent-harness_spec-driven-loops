---
title: "PI-014 -- Extension auto-discovery"
description: "This scenario validates project-local `.pi/extensions/*.ts` auto-discovery without a settings entry and records the isolated live startup evidence for `PI-014`."
version: 1.0.0.0
---

# PI-014 -- Extension auto-discovery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-014`.

---

## 1. OVERVIEW

This scenario checks that the eleven project-local extension factories load from `.pi/extensions/` without an extension path in `.pi/settings.json`. The `lib/` subdirectory is a plain-module boundary: Pi only auto-discovers `*.ts` files at the top level, so `lib/claude-hook-adapter.ts` is imported by bridges, never loaded as a factory.

### Why This Matters

The extension directory is executable project state. Auto-discovery must be visible through successful startup or a precise extension error; a settings omission must not be mistaken for disabled loading.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm project-local extension auto-discovery and distinguish extension loading from provider-backed model execution.
- Real user request: `Start Pi with this project and confirm it loads the local extensions without adding extension paths to settings.`
- Prompt: `List your available tools. Do not modify files.`
- Expected execution process: Count and inspect `.pi/extensions/*.ts` -> inspect `.pi/settings.json` for extension entries -> run Pi and inspect for factory/parse errors.
- Expected signals: Eleven top-level extension files plus `lib/` exist; settings contains packages but no extension path; live startup completes without an extension factory error.
- Desired user-visible outcome: Evidence that project-local extension auto-discovery is active and does not require a settings entry.
- Pass/fail: PASS for the auto-discovery/loadability check. FAIL on any invalid factory or extension-load error. The earlier provider-credentials SKIP is retired: this machine now holds four authenticated providers (`openai-codex`, `deepseek`, `minimax`, `xiaomi`).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Count the extension files and inspect their default exports.
2. Verify `.pi/settings.json` contains no extension path key.
3. Copy only the extensions into a disposable project and run the exact Pi dispatch with a temporary config directory.
4. Inspect output for extension errors before interpreting provider output.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-014 | Extension auto-discovery | Load eleven project extensions without settings registration | `List your available tools. Do not modify files.` | `find .pi/extensions -maxdepth 1 -type f -name '*.ts' -print | sort` -> `jq '{packages,extensions}' .pi/settings.json` -> `pi --offline --approve -p "list your available tools" </dev/null` | Eleven top-level files plus `lib/claude-hook-adapter.ts`; settings has packages and no extension path; no extension factory error | Captured file list (2026-07-28) contains the six guard-core bridges (`dispatch-audit.ts`, `dispatch-preflight-lint.ts`, `mcp-route-guard.ts`, `post-edit-quality.ts`, `spec-gate-classify.ts`, `spec-gate-enforce.ts`) plus the five session-lifecycle bridges (`prompt-advisor.ts`, `session-compact-context.ts`, `session-start-advisories.ts`, `session-start-context.ts`, `session-stop-context.ts`), with `lib/claude-hook-adapter.ts` below the discovery depth. Live startup exits 0 with no extension error, on a machine with four authenticated providers. | PASS for auto-discovery and factory loading. FAIL on extension parse/factory failure. | Inspect the named extension export, rerun in an isolated project, and do not add a settings entry merely to make discovery appear to work. Budget timeouts above 90s: a down `mk-spec-memory` daemon adds ~49s of MCP retries at startup. |

### Optional Supplemental Checks

- Add one deliberately invalid extension to a disposable fixture and confirm Pi fails the whole session with its documented factory error, then remove the fixture.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Extension isolation and evidence rules |
| `../../SKILL.md` | Native extension routing and provider preflight |
| `../../references/native-skills-and-extensions.md` | Extension discovery and failure behavior |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/*.ts` | Eleven project-local extension factories |
| `.pi/extensions/lib/claude-hook-adapter.ts` | Shared plain module below the auto-discovery depth |
| `.pi/settings.json` | Confirms no extension path entry is required |

---

## 5. SOURCE METADATA

- Group: Hook Extension Layer
- Playbook ID: PI-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hook-extension-layer/extension-auto-discovery.md`
