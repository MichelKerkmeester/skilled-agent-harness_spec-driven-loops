---
iteration: 6
timestamp: "2026-05-05T11:42:47+02:00"
focus: "HUNTER PASS — adversarial scan for path-substitution patterns Phase 2 might have missed beyond the 4 fixed substring patterns"
dimensions: ["all"]
executor: "cli-copilot / claude-opus-4.7"
mode: "READ-ONLY"
---

# Iteration 6 — Hunter Pass (Adversarial)

## Mandate

Iter 3 surfaced exactly one P1 (broken `../agents/command_template.md` link in `frontmatter_templates.md:770`) — a relative-path pattern that escaped Phase 2's 4 fixed-string substitutions. Hunter pass asks: **are there OTHER missed patterns of the same shape, anywhere?**

## Adversarial Scans Run

### Scan 1 — Relative `../agents/` and `../documentation/` cross-refs from inside other asset subdirs
```
rg -n "\.\./agents/(agent|command)_template" .opencode/skills/sk-doc/assets/
rg -n "\.\./documentation/(feature_catalog|testing_playbook)" .opencode/skills/sk-doc/assets/
```
- Hits: **1** — `assets/documentation/frontmatter_templates.md:770` (already filed as **P1-003-A**, no new finding).
- `../documentation/...` pattern: **0 hits.**

### Scan 2 — Absolute `/.opencode/skills/sk-doc/assets/agents/...` paths anywhere
```
rg -n --no-ignore-vcs -g '!**/{specs,z_archive,dist,.tmp,barter,node_modules}/**' \
   -g '!**/changelog/v[0-9]*.md' \
   '\.opencode/skills/sk-doc/assets/(agents/(agent|command)_template|documentation/(feature_catalog|testing_playbook))' .
```
- **0 hits.** ✓

### Scan 3 — Path tokens WITHOUT `assets/` prefix in unusual contexts
```
rg -n --no-ignore-vcs -g '!**/{specs,z_archive,dist,.tmp,barter,node_modules,observability}/**' \
   -g '!**/changelog/v[0-9]*.md' \
   'agents/(agent|command)_template|documentation/(feature_catalog|testing_playbook)' \
   .opencode .claude .codex .gemini
```
- Active scope: only the already-known frontmatter_templates.md:770 hit. ✓
- Out-of-scope hit (informational only, locked OOS by strategy): 2 entries in `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` (lines 57, 182) reference old paths `assets/documentation/testing_playbook/...` and `assets/documentation/frontmatter_templates.md` inside captured router-measurement payloads. These are historical experimental records (build artifacts), explicitly in OOS per strategy. Not a finding.

### Scan 4 — JSON/YAML quoted keys
```
rg -n '"agents/(agent|command)_template"|"documentation/(feature_catalog|testing_playbook)"' \
   .opencode .claude .codex .gemini  (excluding OOS)
```
- **0 hits.** ✓

### Scan 5 — Dynamic path construction in TS/JS/PY
```
rg -n -g '*.ts' -g '*.js' -g '*.py' \
   'agents/agent_template|agents/command_template|documentation/feature_catalog|documentation/testing_playbook' \
   .opencode/skills/sk-doc/
```
- **0 hits.** No script constructs old paths at runtime. ✓

### Scan 6 — Flowcharts + skill-creation asset subdirs
```
rg -n '\.\./agents/' .opencode/skills/sk-doc/assets/skill/ .opencode/skills/sk-doc/assets/flowcharts/
```
- **0 hits.** ✓

### Scan 7 — All `(agent|command)_template` tokens in active scope
```
rg -n -g '!**/{specs,z_archive,dist,.tmp,barter,node_modules,observability}/**' \
   -g '!**/changelog/v[0-9]*.md' '(agent|command)_template' .opencode/skills/sk-doc/
```
- 24 hits across SKILL.md, README.md, references/global/{core_standards,quick_reference,workflows,validation,optimization}.md, references/specific/agent_creation.md.
- **All 24 use the new canonical paths** (`assets/command_template.md`, `../../assets/command_template.md`, etc.). Only the 1 already-known P1 link uses the dead `../agents/` form.

### Scan 8 — Cross-runtime mirror byte-identity (defense-in-depth re-check)
```
diff -rq .opencode/commands/create/ .claude/commands/create/   → empty (exit 0)
diff -rq .opencode/commands/create/ .codex/prompts/create/     → empty (exit 0)
```
- Mirrors are inode-identical via the parent symlink (per Iter 2). Re-confirmed.

### Scan 9 — Agent files referencing sk-doc asset paths across all 4 runtimes
```
rg -n 'sk-doc' .opencode/agents/ .claude/agents/ .codex/agents/ .gemini/agents/ \
   | grep -E 'agent_template|command_template|feature_catalog|testing_playbook'
```
- 18 matches across `.opencode/agents/create.md`, `.claude/agents/create.md`, `.codex/agents/create.toml`, `.gemini/agents/create.md`.
- **All 18 use the new canonical paths.** ✓

### Scan 10 — JSON config under sk-doc
- `assets/template_rules.json`: 5 hits all reference the **content field** `feature_catalog_cross_reference` (a logical key inside the catalog template), not a filesystem path. Not a path-ref.
- `graph-metadata.json`: 0 path-relevant hits.

## Findings

### P0 — None

### P1 — None new
The hunter pass found **zero new P1s** beyond the already-known `P1-003-A` (`frontmatter_templates.md:770` `../agents/command_template.md` dead link, filed in Iter 3).

### P2 — 1 advisory (NEW)

**P2-006-A: Stale path strings inside out-of-scope router-measurement JSONL**
- File: `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` lines 57, 182
- Content: captured `predictedRoute` payloads still reference `assets/documentation/testing_playbook/...` and `assets/documentation/frontmatter_templates.md` (the latter is a real, currently-existing file under `documentation/`, but the testing_playbook reference points to the pre-relocation path).
- Status: **explicitly out of scope** per strategy ("Build artifacts (.tmp/, dist/, observability/*.jsonl)") — these are historical experimental records, not a runtime regression and not a broken reference (no consumer reads filesystem paths from these JSONL records).
- Recommendation: **do nothing for this packet.** Optional: when smart-router measurement is re-run (separate concern), the new measurements will naturally reflect post-reorg paths.
- Why filed: hunter-pass transparency only; surfaced so future maintainers don't re-discover and assume it indicates a missed substitution.

## Verdict

**PASS (no new in-scope findings).** Hunter pass exhausted nine adversarial vectors (relative paths, absolute paths, no-prefix tokens, JSON/YAML keys, dynamic script construction, alternate asset subdirs, cross-runtime mirrors, agent files across all 4 runtimes, JSON config) and found **zero new in-scope P0/P1/P2 findings**. The single known P1 (`P1-003-A`) is the only documented gap from Phase 2's substring sweep; no analogous escapes exist elsewhere in the active scope.

The P2-006-A advisory is filed for transparency but is OOS by strategy and requires no action in this packet.

## New Findings This Iteration
- P0: 0
- P1: 0  (P1-003-A is pre-existing, not new)
- P2: 1  (P2-006-A, OOS-locked, no remediation expected)

## Convergence Signal
- **Consecutive iterations with 0 new in-scope P0/P1: this is iteration 6, and Iter 4 + Iter 5 results are not present in the record at the time of this run** (only iter-001..003 .md/.jsonl exist on disk). For the streak post-Iter 3 (which broke the streak), Iter 6 contributes **+1 zero-new-P0/P1** iteration.
- newFindingsRatio (severity-weighted, in-scope only): **0.00** vs. threshold 0.10.
- Recommendation: proceed to Iter 7 (Skeptic, cross-reference verification). After Iter 7, synthesizer should confirm overall verdict pattern — currently `0 P0, 1 P1 (P1-003-A), ≥1 P2` → **CONDITIONAL → REMEDIATE_AND_SHIP** per strategy recommendation logic.
