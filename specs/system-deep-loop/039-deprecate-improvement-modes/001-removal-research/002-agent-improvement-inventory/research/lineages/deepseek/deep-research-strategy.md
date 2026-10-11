---
title: Deep Research Strategy - deepseek lineage agent-improvement inventory
description: Session tracking for the deepseek fan-out lineage inventorying every repository reference to the agent-improvement deep-loop mode outside specs/, for deletion planning.
trigger_phrases:
  - "agent-improvement inventory deepseek"
  - "agent-improvement mode reference inventory"
  - "deep-improvement deletion planning"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - deepseek lineage

## 1. OVERVIEW

### Purpose

Persistent state for this lineage's ten-iteration inventory of every reference to the agent-improvement deep-loop mode across the repository outside `specs/`, so the mode's deletion can be planned. Records the topic, key questions, non-goals, and focus decisions between iterations.

### Usage

- **Init:** Written with the topic, key questions, non-goals, stop conditions, and first focus.
- **Per iteration:** The iteration file carries evidence; the reducer refreshes machine-owned sections after each recorded iteration.
- **Mutability:** Machine-owned sections are rewritten by the workflow reducer; analyst sections are stable.

---

## 2. TOPIC

Inventory every reference to the agent-improvement deep-loop mode (workflowMode `agent-improvement`, command `/deep:agent-improvement`, assets `deep-agent-improvement-*.yaml` and `deep-agent-improvement-presentation.txt`, the `deep-improvement` agent, the deep-improvement packet and its loop host, and the legacy advisor id `deep-improvement` whose default mode is `agent-improvement`) across this whole repository outside `specs/`, so its full deletion can be planned. Every reference is classified DELETE, EDIT, SHARED-WITH-MODEL-BENCHMARK, or KEEP-AS-HISTORY; indirect wiring (registry projections, alias folds, compiled contracts, drift guards, generated mirrors, tests and fixtures) is listed separately; the run closes on tests, validators and doctor checks covering the touched surfaces.

Read-only outside this lineage directory: no repository file is edited, moved, deleted or staged; no git write commands; no installs.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which files across the repository outside specs/ reference the agent-improvement mode (workflowMode agent-improvement, /deep:agent-improvement, deep-agent-improvement-*.yaml, presentation asset, deep-improvement agent, deep-improvement packet, advisor id deep-improvement)?
- [ ] What indirect wiring carries the mode (registry projections, alias groups and folds, compiled contracts, drift guards, generated mirrors, fixtures)?
- [x] Are the runtime mirrors (.claude .opencode .codex .cursor .pi .devin .hermes) symlinks, generated copies or hand-written files for the agent-improvement surfaces (agent, command, prompts, Hermes agent-* skill mirror)?
- [x] Which references are SHARED-WITH-MODEL-BENCHMARK, and which tests, validators and doctor checks cover the touched surfaces?
- [ ] Does anything outside this repository or outside the two improvement modes consume the agent-improvement mode, its agent, or the deep-improvement packet scripts and runtime libraries?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No edits, moves, deletions or staging of any repository file; read-only outside this lineage directory.
- No re-inventory of the model-benchmark mode beyond classifying shared references (a sibling lineage owns that inventory).
- No implementation of the deletion; findings only.
- No git write commands and no installs.

---

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations` with `maxIterations: 10`; convergence below threshold is telemetry only and widens the review angles instead of ending the loop.
- Terminal synthesis records `stopReason: maxIterationsReached`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Are the runtime mirrors (.claude .opencode .codex .cursor .pi .devin .hermes) symlinks, generated copies or hand-written files for the agent-improvement surfaces (agent, command, prompts, Hermes agent-* skill mirror)?
- Which references are SHARED-WITH-MODEL-BENCHMARK, and which tests, validators and doctor checks cover the touched surfaces?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- keyword grep with line numbers over the eight named hub files produced the complete mention set in one call; reading mode-registry.json first anchored the mode's identity fields that other files repeat. (iteration 1)
- counting mentions per file ranked the chassis files immediately; the subtree listing then separated lane-exclusive from shared paths without reading all 354 files. (iteration 2)
- the runtime mention-rank scan surfaces dense lane libraries first, then a targeted grep over the remaining scripts/libs confirmed which shared files carry lane defaults. (iteration 3)
- the runtime mention-rank scan plus the generator's source-path discovery created a precise edit order: command-metadata.json → regeneration → drift guard → fixtures. (iteration 4)
- chasing the packet script name (`check-agent-mirror-sync`) across the whole repo surfaced the hook/CI/cross-skill caller set that a mode-token sweep alone would have missed. (iteration 5)
- `ls -la` symlink inspection settled the symlink-vs-copy question per entry in two calls; the diff then characterized the one real copy precisely. (iteration 6)
- per-directory `ls -la` distinguishes symlinks, hand copies and generated copies in one pass; the generated-file headers then named their generators exactly. (iteration 7)
- the canonical tokens concentrated the doc surfaces quickly; the case-insensitive pass bounded the prose risk without expanding the inventory. (iteration 8)
- the per-script caller sweep caught the retrieval fixtures and the sk-doc guide that a mode-token sweep had missed because the fixture JSON keys differ. (iteration 9)
- reading the CI workflows' run steps turned the test inventory into a gate map, which is what the deletion plan needs (which gates fail when each surface changes). (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed; the rg pattern matched `deep-improvement` liberally, which surfaced the model-benchmark-shared packet surfaces early and is exactly the shared-file boundary the inventory needs. (iteration 1)
- nothing failed; the only `agent-improvement` string inside `assets/model-benchmark/` fixtures was absent, confirming lane purity there. (iteration 2)
- nothing failed; the runtime core's zero-match result is itself decision-relevant. (iteration 3)
- nothing failed; the generated markers in aliases.ts named the generator contract directly. (iteration 4)
- nothing failed; sibling assets were already flagged in iteration 2 and needed only line-level pinning. (iteration 5)
- nothing failed; the `skill-benchmark` fixture value was an unexpected discovery that the token sweep caught. (iteration 6)
- nothing failed; the checker regex reading added the coverage-gap nuance (`.pi` ungoverned). (iteration 7)
- nothing failed; long matching lines required max-columns to read. (iteration 8)
- nothing failed; long single-line JSON fixtures again required max-columns handling. (iteration 9)
- nothing failed; the name-agnostic doctor/validator negatives required explicit recording to avoid false confidence. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.claude/hooks` carries no agent-improvement mentions (verified by the repo-tree rg over `.claude`). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `.claude/hooks` carries no agent-improvement mentions (verified by the repo-tree rg over `.claude`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.claude/hooks` carries no agent-improvement mentions (verified by the repo-tree rg over `.claude`).

### `AGENTS.md` / `CLAUDE.md` at the repository root carry no canonical-token mentions (checked in the same grep). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `AGENTS.md` / `CLAUDE.md` at the repository root carry no canonical-token mentions (checked in the same grep).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `AGENTS.md` / `CLAUDE.md` at the repository root carry no canonical-token mentions (checked in the same grep).

### `system-spec-kit/runtime/cli/dist` as a compiled home of the mode (verified empty of matches). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `system-spec-kit/runtime/cli/dist` as a compiled home of the mode (verified empty of matches).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `system-spec-kit/runtime/cli/dist` as a compiled home of the mode (verified empty of matches).

### Adding new tests or running repo tooling beyond the lineage: research-only run; the suites are inventoried, not executed, and every write stayed inside the lineage directory. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Adding new tests or running repo tooling beyond the lineage: research-only run; the suites are inventoried, not executed, and every write stayed inside the lineage directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding new tests or running repo tooling beyond the lineage: research-only run; the suites are inventoried, not executed, and every write stayed inside the lineage directory.

### Classifying the mirror checker as packet-internal: it has repo-wide callers (commit hooks, CI workflow, CI drill, cross-skill checklist, CROSS-CLI.md), so its removal is a cross-repo edit, not a packet-local delete. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Classifying the mirror checker as packet-internal: it has repo-wide callers (commit hooks, CI workflow, CI drill, cross-skill checklist, CROSS-CLI.md), so its removal is a cross-repo edit, not a packet-local delete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Classifying the mirror checker as packet-internal: it has repo-wide callers (commit hooks, CI workflow, CI drill, cross-skill checklist, CROSS-CLI.md), so its removal is a cross-repo edit, not a packet-local delete.

### Expecting `.cursor`, `.devin` or `.hermes` to hold independent agent bodies: each resolves through a symlink or a generator to a canonical file already inventoried. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Expecting `.cursor`, `.devin` or `.hermes` to hold independent agent bodies: each resolves through a symlink or a generator to a canonical file already inventoried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting `.cursor`, `.devin` or `.hermes` to hold independent agent bodies: each resolves through a symlink or a generator to a canonical file already inventoried.

### Expecting a committed `authority-agent-improvement.json`: the authority directory ships only its README; records are machine-local and git-ignored, and a never-written record simply defaults to `legacy_authoritative`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Expecting a committed `authority-agent-improvement.json`: the authority directory ships only its README; records are machine-local and git-ignored, and a never-written record simply defaults to `legacy_authoritative`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting a committed `authority-agent-improvement.json`: the authority directory ships only its README; records are machine-local and git-ignored, and a never-written record simply defaults to `legacy_authoritative`.

### Expecting mirrored copies under `.opencode/`: every deep-loop surface resolves through directory symlinks to `.skilled`, so `.opencode` needs no per-file edits for the mode. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Expecting mirrored copies under `.opencode/`: every deep-loop surface resolves through directory symlinks to `.skilled`, so `.opencode` needs no per-file edits for the mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting mirrored copies under `.opencode/`: every deep-loop surface resolves through directory symlinks to `.skilled`, so `.opencode` needs no per-file edits for the mode.

### None; the advisor surface resolved into the two projection maps, the fold, the generated bridge pair, the drift guard, and fixture/test updates. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None; the advisor surface resolved into the two projection maps, the fold, the generated bridge pair, the drift guard, and fixture/test updates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the advisor surface resolved into the two projection maps, the fold, the generated bridge pair, the drift guard, and fixture/test updates.

### None; the five trees resolved into three chains (symlink to `.claude`, hand copy in `.pi`, generated in `.hermes`). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: None; the five trees resolved into three chains (symlink to `.claude`, hand copy in `.pi`, generated in `.hermes`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the five trees resolved into three chains (symlink to `.claude`, hand copy in `.pi`, generated in `.hermes`).

### None; the hub surface yielded a complete reference set on the first pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None; the hub surface yielded a complete reference set on the first pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the hub surface yielded a complete reference set on the first pass.

### None; the packet surface resolved into lane-exclusive subtrees (`assets|references|scripts/agent-improvement/`) versus shared chassis (`SKILL.md`, `README.md`, `scripts/shared/`, `references/shared/`, allowlist, tests). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None; the packet surface resolved into lane-exclusive subtrees (`assets|references|scripts/agent-improvement/`) versus shared chassis (`SKILL.md`, `README.md`, `scripts/shared/`, `references/shared/`, allowlist, tests).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the packet surface resolved into lane-exclusive subtrees (`assets|references|scripts/agent-improvement/`) versus shared chassis (`SKILL.md`, `README.md`, `scripts/shared/`, `references/shared/`, allowlist, tests).

### None; the runtime split cleanly into lane-dedicated libraries (delete), lane-shared/common surfaces (edit), and mode-agnostic core (untouched). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None; the runtime split cleanly into lane-dedicated libraries (delete), lane-shared/common surfaces (edit), and mode-agnostic core (untouched).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the runtime split cleanly into lane-dedicated libraries (delete), lane-shared/common surfaces (edit), and mode-agnostic core (untouched).

### None; the test layer resolved into CI gates (workflows), suites (runtime/hooks/plugins/packet), fixtures (retrieval corpus, git-hook fixtures, behavior scenarios) and name-agnostic validators. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: None; the test layer resolved into CI gates (workflows), suites (runtime/hooks/plugins/packet), fixtures (retrieval corpus, git-hook fixtures, behavior scenarios) and name-agnostic validators.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the test layer resolved into CI gates (workflows), suites (runtime/hooks/plugins/packet), fixtures (retrieval corpus, git-hook fixtures, behavior scenarios) and name-agnostic validators.

### Search for additional hook mentions beyond the four files was exhaustive: `rg -l` over `.skilled/hooks/` returns only task-dispatch and git hits. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Search for additional hook mentions beyond the four files was exhaustive: `rg -l` over `.skilled/hooks/` returns only task-dispatch and git hits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Search for additional hook mentions beyond the four files was exhaustive: `rg -l` over `.skilled/hooks/` returns only task-dispatch and git hits.

### Searching for a compiled `deep-agent-improvement` contract under `.skilled/commands/deep/assets/compiled/`: the directory README and file listing show compile coverage is limited to the three compiler-registered commands, so no compiled artifact exists to classify. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a compiled `deep-agent-improvement` contract under `.skilled/commands/deep/assets/compiled/`: the directory README and file listing show compile coverage is limited to the three compiler-registered commands, so no compiled artifact exists to classify.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a compiled `deep-agent-improvement` contract under `.skilled/commands/deep/assets/compiled/`: the directory README and file listing show compile coverage is limited to the three compiler-registered commands, so no compiled artifact exists to classify.

### Searching for a published or externally installed copy of the mode: both manifests are private with no publish path, so there is no package-level external consumer to inventory. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Searching for a published or externally installed copy of the mode: both manifests are private with no publish path, so there is no package-level external consumer to inventory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a published or externally installed copy of the mode: both manifests are private with no publish path, so there is no package-level external consumer to inventory.

### Searching for an agent-improvement branch inside the runtime-loop convergence layer (`runtime/scripts/convergence.cjs`): the mode registry records `runtimeLoopType: null` and `backendKind: improvement-host`, so the lane has no runtime-loop surface to inventory; the loop-host seam is the orchestration owner. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for an agent-improvement branch inside the runtime-loop convergence layer (`runtime/scripts/convergence.cjs`): the mode registry records `runtimeLoopType: null` and `backendKind: improvement-host`, so the lane has no runtime-loop surface to inventory; the loop-host seam is the orchestration owner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for an agent-improvement branch inside the runtime-loop convergence layer (`runtime/scripts/convergence.cjs`): the mode registry records `runtimeLoopType: null` and `backendKind: improvement-host`, so the lane has no runtime-loop surface to inventory; the loop-host seam is the orchestration owner.

### Treating `command-bridges.generated.json` and `scoring-compatibility.json` as hand-editable sources: the derive script discovers them as generated outputs of `{skillId}/command-metadata.json`, so the correct deletion order is source edit then regeneration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating `command-bridges.generated.json` and `scoring-compatibility.json` as hand-editable sources: the derive script discovers them as generated outputs of `{skillId}/command-metadata.json`, so the correct deletion order is source edit then regeneration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `command-bridges.generated.json` and `scoring-compatibility.json` as hand-editable sources: the derive script discovers them as generated outputs of `{skillId}/command-metadata.json`, so the correct deletion order is source edit then regeneration.

### Treating hub `changelog/` and frozen benchmark `reports/` as edit targets: they are historical records; only their README indexes receive edits. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating hub `changelog/` and frozen benchmark `reports/` as edit targets: they are historical records; only their README indexes receive edits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating hub `changelog/` and frozen benchmark `reports/` as edit targets: they are historical records; only their README indexes receive edits.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None; the hub surface yielded a complete reference set on the first pass. (iteration 1)
- Searching for a compiled `deep-agent-improvement` contract under `.skilled/commands/deep/assets/compiled/`: the directory README and file listing show compile coverage is limited to the three compiler-registered commands, so no compiled artifact exists to classify. (iteration 1)
- None; the packet surface resolved into lane-exclusive subtrees (`assets|references|scripts/agent-improvement/`) versus shared chassis (`SKILL.md`, `README.md`, `scripts/shared/`, `references/shared/`, allowlist, tests). (iteration 2)
- Searching for an agent-improvement branch inside the runtime-loop convergence layer (`runtime/scripts/convergence.cjs`): the mode registry records `runtimeLoopType: null` and `backendKind: improvement-host`, so the lane has no runtime-loop surface to inventory; the loop-host seam is the orchestration owner. (iteration 2)
- Expecting a committed `authority-agent-improvement.json`: the authority directory ships only its README; records are machine-local and git-ignored, and a never-written record simply defaults to `legacy_authoritative`. (iteration 3)
- None; the runtime split cleanly into lane-dedicated libraries (delete), lane-shared/common surfaces (edit), and mode-agnostic core (untouched). (iteration 3)
- None; the advisor surface resolved into the two projection maps, the fold, the generated bridge pair, the drift guard, and fixture/test updates. (iteration 4)
- Treating `command-bridges.generated.json` and `scoring-compatibility.json` as hand-editable sources: the derive script discovers them as generated outputs of `{skillId}/command-metadata.json`, so the correct deletion order is source edit then regeneration. (iteration 4)
- Classifying the mirror checker as packet-internal: it has repo-wide callers (commit hooks, CI workflow, CI drill, cross-skill checklist, CROSS-CLI.md), so its removal is a cross-repo edit, not a packet-local delete. (iteration 5)
- Search for additional hook mentions beyond the four files was exhaustive: `rg -l` over `.skilled/hooks/` returns only task-dispatch and git hits. (iteration 5)
- `.claude/hooks` carries no agent-improvement mentions (verified by the repo-tree rg over `.claude`). (iteration 6)
- Expecting mirrored copies under `.opencode/`: every deep-loop surface resolves through directory symlinks to `.skilled`, so `.opencode` needs no per-file edits for the mode. (iteration 6)
- Expecting `.cursor`, `.devin` or `.hermes` to hold independent agent bodies: each resolves through a symlink or a generator to a canonical file already inventoried. (iteration 7)
- None; the five trees resolved into three chains (symlink to `.claude`, hand copy in `.pi`, generated in `.hermes`). (iteration 7)
- `AGENTS.md` / `CLAUDE.md` at the repository root carry no canonical-token mentions (checked in the same grep). (iteration 8)
- Treating hub `changelog/` and frozen benchmark `reports/` as edit targets: they are historical records; only their README indexes receive edits. (iteration 8)
- `system-spec-kit/runtime/cli/dist` as a compiled home of the mode (verified empty of matches). (iteration 9)
- Searching for a published or externally installed copy of the mode: both manifests are private with no publish path, so there is no package-level external consumer to inventory. (iteration 9)
- Adding new tests or running repo tooling beyond the lineage: research-only run; the suites are inventoried, not executed, and every write stayed inside the lineage directory. (iteration 10)
- None; the test layer resolved into CI gates (workflows), suites (runtime/hooks/plugins/packet), fixtures (retrieval corpus, git-hook fixtures, behavior scenarios) and name-agnostic validators. (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **Convergence telemetry** — with iteration 10 recorded, the run reaches its configured cap; the remaining open questions (full reference list closure, indirect-wiring closure) are answered to the depth the cap allows...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Resource map not present; skipping coverage gate. Known starting points are the paths named in the research topic: `.skilled/skills/system-deep-loop/` (registry, routers, manifests, deep-improvement packet, runtime), `.skilled/commands/deep/` (command and YAML assets), `.skilled/agents/` (agent definitions), `.skilled/skills/system-skill-advisor/` (projections and drift guards), `.skilled/skills/sk-doc/`, `.skilled/skills/cli-external-orchestration/`, and the seven runtime mirror directories at the repository root.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/system-deep-loop/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `command-metadata.json`, `leaf-manifest.json`, `leaf-scopes.json`, `graph-metadata.json`; `.skilled/commands/deep/agent-improvement.md` + `assets/`; `.skilled/agents/`; `.skilled/skills/system-deep-loop/deep-improvement/`; `.skilled/skills/system-deep-loop/runtime/`.
- Reuse candidates: prior sibling inspection patterns from the 039 packet lineage directory (`containment/baseline/`) for mirror layouts.
- Integration points: `.skilled/skills/system-skill-advisor/` advisor projections; runtime mirrors `.claude .opencode .codex .cursor .pi .devin .hermes`.
- Constraints and risks: classification must separate model-benchmark-shared references (sibling run) from agent-improvement-exclusive ones; grep hits must be read to classify, not guessed from the match line.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10 (stopPolicy max-iterations; convergence telemetry-only)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls target, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (this lineage's `research.md`)
- Lifecycle branches: `new` (this run); `resume`, `restart` defined but unused
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-10-10T18:39:24Z
