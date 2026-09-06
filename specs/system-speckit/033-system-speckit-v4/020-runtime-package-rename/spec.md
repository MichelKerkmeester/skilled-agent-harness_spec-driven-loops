---
title: "Feature Specification: spec-kit runtime rename "
description: "The surviving spec-kit package still carries an MCP identity it no longer has: folder and npm name say mcp-server, the MCP SDK and six other dependencies have no importer, and about 140 live files point at the old path; this packet turns it into system-spec-kit/runtime shaped like the deep-loop runtime, drops the dead dependencies, and moves every reference."
trigger_phrases:
  - "runtime package rename"
  - "spec kit runtime rename"
  - "runtime package rename spec"
  - "mcp-server name misleading"
  - "@spec-kit/runtime published"
  - "dependency audit by resolution"
  - "move is not behavior change"
  - "word mcp only where retired"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: spec-kit runtime rename

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: the package becomes `system-spec-kit/runtime` shaped like `system-deep-loop/runtime`; dependencies are kept only when a resolution trace, not an import grep, proves a live consumer; the move lands in one commit with every reference, so no intermediate state serves a broken path

**Critical Dependencies**: the first review loop under packet 052 must finish, because its scope list names the old paths; the operator's live edits under system-deep-loop and cli-external-orchestration must be committed before files they touch are moved

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 20 of 24 |
| **Predecessor** | `../019-memory-decommission-branch-landing/spec.md` |
| **Successor** | `../021-decommission-debt-and-cli-nesting/spec.md` |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The memory decommission deleted the MCP server, its tools and its database, but kept the package that held them because the validation orchestrator, the metadata refresh, the continuity writer and the per-runtime hook adapters live inside it. The package is still named `mcp-server` on disk and as `@spec-kit/mcp-server` in npm, still declares the MCP SDK and six other dependencies nothing imports, and roughly 140 live files, 12 of them importing the npm name, still point at it. A reader takes the name at face value and looks for a server that does not exist.

### Purpose
The engine lives at `system-spec-kit/runtime` with the shape of `system-deep-loop/runtime`, its manifest declares only what resolves to a live consumer, every gate that used the old path passes on the new one, and the word MCP appears in the package only where it describes something retired.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` of the package to `.opencode/skills/system-spec-kit/runtime/` with `lib/`, `scripts/` for CLI entry points, `hooks/` for the runtime adapters, `tests/`, its own `package.json` renamed `@spec-kit/runtime`, `tsconfig`, vitest config and README.
- A dependency audit by resolution: for each declared dependency, the live module that requires it or the removal; the MCP SDK, `zod-to-json-schema`, `sqlite-vec`, `chokidar`, `ignore`, `tree-sitter-wasms` and `web-tree-sitter` are the candidates; `@huggingface/transformers` stays only if the HF model server in `.opencode/bin` resolves it through this package.
- Every reference moved in the same commit: `validate.sh`, `dist-freshness.cjs`'s package table, the five runtime hook registrations (`.claude/settings.json`, `.codex`, `.cursor`, `.pi`, `opencode.json`) and the `.claude/hooks` discovery mirrors, doctor routes and assets, the scripts package's imports and tsconfig paths, the sync scripts, the plugins, AGENTS.md, README files, install guides and the skill's own references.
- The lockfile regenerated for the pruned manifest, the dist rebuilt, and a dist-freshness stamp for the new root.
- A ten-iteration review pass on the renamed tree under this packet.

### Out of Scope
- Changing any behaviour of the validation orchestrator, metadata refresh, continuity writer or hook adapters - this is a move, and behaviour changes would hide inside a 140-file diff.
- The skill advisor's package, which keeps its own `mcp-server` because it still is one - preserved set.
- Historical evidence naming the old path in changelogs, benchmark reports and archived packets - evidence stays as written.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/**` → `.opencode/skills/system-spec-kit/runtime/**` | Move | 328 tracked files, history preserved through `git mv` |
| `.opencode/skills/system-spec-kit/runtime/package.json`, `package-lock.json` | Modify | Name `@spec-kit/runtime`; dead dependencies removed; lockfile regenerated |
| `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` | Modify | Package table entry id, root and rebuild command |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`, `scripts/**/*.ts`, `scripts/tsconfig.json` | Modify | Orchestrator path and package imports |
| `.claude/settings.json`, `.claude/hooks/*`, `.codex/**`, `.cursor/**`, `.pi/**`, `.devin/**`, `opencode.json`, `.opencode/plugins/*.js` | Modify | Hook adapter paths and discovery mirrors |
| `.opencode/commands/doctor/**`, `.opencode/commands/speckit/**`, `.opencode/commands/create/**` | Modify | Asset paths |
| `AGENTS.md`, `README.md`, `.opencode/install-guides/**`, `.opencode/hooks/**`, `.opencode/skills/**/README.md`, `.opencode/skills/**/references/**` | Modify | Prose and path references, about 100 files |

### Review Scope

The review reads a bounded list, never a tree. The change set is the rename commit's diff `0d7586d849..aef7852400` outside `specs/`, with pure renames excluded: the 453 files whose content changed, listed one per line in `scratch/review-scope.txt`, grouped as follows. The 260 files moved without a content change are verified by the commands below, not by reading anything.

| Group in the list | Count | What to verify |
|-------------------|-------|----------------|
| `.opencode/skills/system-spec-kit/runtime/**` outside `tests/` | 36 | The engine package: manifest name and dependencies, entry points, hook adapters, README and env reference; no MCP name, SDK or transport, no import of a dropped dependency |
| `.opencode/skills/system-spec-kit/runtime/tests/**` | 28 | Tests resolve the moved modules and fixtures; no path or package name from the old location |
| `.opencode/skills/system-spec-kit/scripts/**` | 103 | Freshness table, retrieval lane, evals and test helpers point at `runtime/`; the vitest config is found at its new path |
| `.opencode/skills/system-spec-kit/{shared,references,templates,*.md,*.json}` | 75 | Workspace manifests and lockfile, tsconfig, skill docs and references name the runtime package; the shared embedding seam still resolves its providers |
| `.opencode/skills/{system-deep-loop,cli-external-orchestration,system-skill-advisor,sk-doc,sk-code,sk-git,mcp-*}/**` | 86 | Compiled routing and leaf manifests re-minted; instructions name the new path; advisor and model-server behaviour unchanged |
| `.opencode/{hooks,bin,plugins,scripts,install-guides,commands}/**` | 82 | Hook symlinks, launchers, doctor assets and install guides resolve on the new tree; no launcher starts a server |
| `.{claude,pi,codex,cursor,devin}/**`, `.github/**`, `AGENTS.md`, `README.md`, `opencode.json`, `.env.example`, `.gitignore`, `.opencode/logs/README.md` | 43 | Runtime mirrors and CI workflows consistent with the move; ignore rules cover the new dist and database paths |

**Reading budget.** Read only files in the list and the modules they import directly. Never expand a directory with a wildcard, and never read `node_modules`, `dist`, `benchmark`, `changelog`, `z_archive`, `manual-testing-playbook`, `feature-catalog`, or `data/trigger-index.json`. Cover a different group in each iteration so ten iterations cover the list roughly once, and spend any remaining iterations on the findings already raised.

**Repository-wide claims come from commands, not reading:**

```bash
rg -l 'system-spec-kit/mcp-server|@spec-kit/mcp-server' . -g '!**/node_modules/**' -g '!**/dist/**' -g '!**/z_archive/**' -g '!**/changelog/**' -g '!**/benchmark/**' -g '!specs/**'   # no output
node .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs check-all                                                             # every package fresh
node .opencode/bin/compiled-route-guard.cjs                                                                                                # all hubs fresh
node .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs --json                                                    # live must be 0
NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-speckit/033-system-speckit-v4/020-runtime-package-rename --strict
bash .opencode/commands/doctor/scripts/route-validate.sh
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
```

Out of the review's write scope: everything in packet 052's decision D5 preserved set, `node_modules`, `dist`, and any branch other than the one under review.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The package exists only at `system-spec-kit/runtime`, named `@spec-kit/runtime`, with `lib/`, `scripts/`, `hooks/` and `tests/` at its root and no `mcp` in its name, description or entry points |
| REQ-002 | `validate.sh --strict`, the continuity writer, the metadata refresh, every registered hook adapter and the dist-freshness guard work from the new path, proven by running each |
| REQ-003 | Every dependency in the manifest resolves to a live consumer named in the dependency audit; every candidate without one is removed and the lockfile regenerated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No live file outside historical evidence references the old path or the old npm name; the residue sweep, the trigger index, the doctor routes, the skill-root audit and the routing guard pass on the moved tree |
| REQ-005 | A ten-iteration review with gpt-5.6-luna on the moved tree reports no P0 or P1 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg` for `system-spec-kit/mcp-server` and `@spec-kit/mcp-server` over live surfaces returns zero hits; the moved package's test suite and typecheck pass; `validate.sh --strict` passes on 049 recursive, 050, 051, 052 and this packet.
- **SC-002**: The manifest's dependency count drops by the audited number, and a fresh `npm ci` plus build in the new root succeeds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 052's review loop complete | Its scope names the old paths | Wait; the loop is bounded to ten iterations |
| Dependency | Operator's live edits committed | A move under an uncommitted file loses their work | Never move a file that is dirty in the checkout; list them and wait |
| Risk | A hook registration points at a path that no longer exists after the move | High | Every runtime config is updated in the same commit and each adapter is executed once from its new path before the commit |
| Risk | A dependency removed on an import grep is loaded by name at runtime | High | Removal only on a resolution trace, and the HF model server, the hook adapters and the continuity writer are run after `npm ci` in the new root |
| Risk | The dist-freshness guard refuses every shim after the move | Med | The package table entry is updated and the dist rebuilt before the commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `validate.sh --strict` on a Level 3 packet stays within its current budget after the move, measured before and after.

### Security
- **NFR-S01**: The move introduces no new network surface; the HF model server keeps its loopback guard and bearer check.

### Reliability
- **NFR-R01**: The move lands as one commit so no intermediate commit serves a broken path; `git revert` of that commit restores the old layout.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a runtime config with no spec-kit hook registered stays untouched.
- Maximum length: not applicable; the reference list is finite and enumerated in the plan.

### Error Scenarios
- External service failure: `npm ci` failing in the new root blocks the commit; the old lockfile is restored.
- Network timeout: not applicable beyond the install step.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 470 moved or edited, LOC: mostly paths, Systems: five runtimes plus the spec-kit scripts |
| Risk | 18/25 | Auth: N, API: Y (npm name), Breaking: Y for any consumer of the old path |
| Research | 6/20 | Dependency resolution audit |
| Multi-Agent | 8/15 | Workstreams: move, references, dependency audit, review |
| Coordination | 10/15 | Dependencies: the 052 loop and the operator's dirty files |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A registered hook adapter is missed and a runtime silently loses its gate | H | M | Grep every runtime config for the old path after the move; run each adapter from its new path |
| R-002 | A dependency removed by mistake breaks a runtime-only require | H | L | Resolution trace per dependency; run the model server, adapters and writer after `npm ci` |
| R-003 | Moving under the operator's uncommitted edits | H | M | Refuse to move any dirty file; wait for their commit |

---

## 11. USER STORIES

### US-001: The engine has a name that says what it is (Priority: P0)

**As** a maintainer reading `.opencode/skills/system-spec-kit`, **I want** the engine package named `runtime` with `lib/`, `scripts/` and `hooks/` at its root, **so that** I look for CLI entry points and adapters instead of a server that was retired.

**Acceptance:** the folder, the npm name, the README title and the dist-freshness entry all say `runtime`; no file inside names an MCP transport as current.

### US-002: A fresh clone installs only what it uses (Priority: P1)

**As** an operator running `npm ci` in the engine root after a clone, **I want** only dependencies with a live consumer installed, **so that** the install is smaller and no retired capability is implied by the manifest.

**Acceptance:** the dependency audit table names a consumer or a removal for every entry, and the lockfile matches the manifest.

## 12. OPEN QUESTIONS

- Does `@huggingface/transformers` move to a manifest owned by `.opencode/bin` alongside the model server, or stay declared here as its resolution root?
- Do the `.claude/hooks` discovery mirrors keep symlinking into `runtime/dist/hooks`, or does the rename phase collapse them into direct registrations?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
