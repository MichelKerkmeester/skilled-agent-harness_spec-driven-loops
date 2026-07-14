---
title: "Deep Review Report — track:skilled-agent-orchestration (packets 093-096)"
description: "Architectural cross-phase review of recently shipped 093-096 packets. Verdict FAIL pending P0-001 remediation. 22 active findings across 4 dimensions."
sessionId: "2026-05-07T14:46:56Z"
generation: 1
lineageMode: "new"
stopReason: "maxIterationsReached"
verdict: "FAIL"
hasAdvisories: true
totalIterations: 10
convergenceScore: 1.0
---

<!-- ANCHOR:executive-summary -->
# Deep Review Report — track:skilled-agent-orchestration (packets 093-096)

## 1. Executive Summary

**Verdict: FAIL** (`hasAdvisories=true`)

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 1 |
| P1 (Required) | 12 |
| P2 (Suggestions) | 9 |
| **Total active** | **22** |

The review covered 4 packets shipped in close succession on 2026-05-07:

- **093** — `manual_testing_playbook` for sk-code-review and sk-git (phase parent: 001-sk-code-review-playbook + 002-sk-git-playbook)
- **094** — RCAF naturalization across 16 playbooks + sk-doc template updates (Level 2 with checklist + decision-record)
- **095** — sk-code-review playbook execution via opencode+deepseek
- **096** — Rename `.opencode/{skill,agent,command}/` to plural (phase parent with 001-skills, 002-agents, 003-commands, 004-symlinks; **11,348 files changed, +677,307 / -669,689**)

The dominant risk surface is packet **096**: a single-commit ~670k-occurrence bulk-sed across the entire repo's discovery surface. The review confirmed several rename-induced regressions that the 096 commit message claimed were patched but were either incomplete or only partial. The most consequential is a **silent runtime mismatch in code-graph indexing scope** because `mcp_server/dist/` was not rebuilt as part of 096.

Loop ran 10 iterations across all 4 dimensions with strategy `arch`. The ratio sequence (1.00 → 0.50 → 0.31 → 0.30 → 0.18 → 0.07 → 0.07 → 0.06 → 0.00 → 0.00) converged cleanly. Total cli-codex compute: ~340 minutes (gpt-5.5, high reasoning, fast service tier).

**Why FAIL despite ratio convergence:** The legal-stop p0ResolutionGate veto'd PASS because P0-001 (live runtime stale `dist/`) remains unremediated. The loop hit `maxIterationsReached` at iter-10 with the P0 carrying as a verdict-determining finding. Remediation must land before this track can be released.

**Review scope discipline:** Review target was treated READ-ONLY across all 10 iterations. All file modifications were confined to `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/`. Workflow-resolved spec_folder write authority held throughout.

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:planning-trigger -->
## 2. Planning Trigger

`/speckit:plan` is REQUIRED. Verdict FAIL with active P0 means the track cannot be released without a remediation packet.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 1,
    "P1": 12,
    "P2": 9
  },
  "remediationWorkstreams": [
    {
      "id": "RW-A",
      "title": "Build hygiene + dist rebuild",
      "priority": "P0",
      "findings": ["P0-001", "P2-002", "P2-008"],
      "summary": "Rebuild mcp_server/dist from updated TypeScript source, add release guards for singular root literals in generated runtime outputs, and add a CI grep guard that fails on \\.opencode/(skill|agent|command)/ outside an allowlist.",
      "estLOC": "0 LOC source (rebuild), +20-50 LOC CI guard",
      "blocksRelease": true
    },
    {
      "id": "RW-B",
      "title": "sk-deep-* dead-reference closure",
      "priority": "P1",
      "findings": ["P1-002", "P1-008", "P1-009", "P1-011", "P1-012"],
      "summary": "Replace sk-deep-review/sk-deep-research with deep-review/deep-research across command YAMLs (auto + confirm), agent definitions in .opencode/agents/, .codex/agents/, .gemini/agents/, .claude/agents/, orchestrator routing tables, and command markdown citations. Then dry-run init for both /speckit:deep-review:auto and /speckit:deep-research:auto in both modes.",
      "estLOC": "20-40 file edits, no LOC churn beyond tokens",
      "blocksRelease": false
    },
    {
      "id": "RW-C",
      "title": "Packet 096 narrative + validation repair",
      "priority": "P1",
      "findings": ["P1-004", "P1-010", "P1-013"],
      "summary": "Fix 096 parent + 004-symlinks doc sufficiency to make validate.sh exit 0; restore old-root literals in source-state prose where 096's spec narratives currently say plural-to-plural tautologies; fix smart-router validation script to scan .opencode/skills (plural) and fail when zero top-level skills are found.",
      "estLOC": "50-100 LOC across spec docs + check-smart-router.sh",
      "blocksRelease": false
    },
    {
      "id": "RW-D",
      "title": "Hook precedence + resolver tightening",
      "priority": "P1",
      "findings": ["P1-006", "P1-005 (downgraded P2)"],
      "summary": "Remove production env-script override in Claude Stop hook (or test-only-gate it), and add realpath containment on deep-loop artifact resolver under .opencode/specs/.",
      "estLOC": "30-50 LOC across hooks + resolver",
      "blocksRelease": false
    },
    {
      "id": "RW-E",
      "title": "Checklist evidence backfill + RCAF supersession notes",
      "priority": "P1",
      "findings": ["P1-007", "P2-006"],
      "summary": "Backfill required checklist marks with concrete evidence citations across the completed packets (093/094/095/096), or relabel them as not completion-verified. Add supersession notes to 093 specs pointing to 094's ADR for the RCAF naturalization decision.",
      "estLOC": "Across 4 packets; ~20-50 evidence citations",
      "blocksRelease": false
    },
    {
      "id": "RW-F",
      "title": "Skill advisor + Python tools plural-path migration",
      "priority": "P1",
      "findings": ["P1-003", "P1-014"],
      "summary": "Move skill advisor state from .opencode/skill/.advisor-state to plural or neutral cache path; patch audit_descriptions.py + skill_advisor.py native bridge constants to .opencode/skills/system-spec-kit; add zero-coverage and --force-native smoke guards.",
      "estLOC": "30-80 LOC across 3-4 Python files + advisor source",
      "blocksRelease": false
    },
    {
      "id": "RW-G",
      "title": "P2 doc-only drift sweep",
      "priority": "P2",
      "findings": ["P2-001", "P2-003", "P2-004", "P2-005", "P2-007"],
      "summary": "Update install guides (SET-UP - Opencode Agents.md, SET-UP - AGENTS.md, SET-UP - Code Graph.md) and Barter root README/CONTRIBUTING; remove dead Copilot target-authority guard branch (or implement it); fix nested-backtick prompts in 2 cli-opencode playbooks; reconcile setup guide skill inventory.",
      "estLOC": "10-30 small doc edits",
      "blocksRelease": false
    }
  ],
  "specSeed": [
    "Spec must enumerate the 22 active findings as remediation requirements (REQ-001..REQ-022) with explicit P0/P1/P2 mapping.",
    "Out of scope: re-running the 094 RCAF naturalization or the 096 directory rename; both are baseline.",
    "In scope: dist rebuild, sk-deep-* token replacement, narrative tautology repair, hook tightening, checklist backfill, Python tools plural migration, doc drift sweep, smart-router validation fix.",
    "Risk surface: dist rebuild may surface new test failures unrelated to the rename; resolver tightening may break legitimate edge cases (allow tests).",
    "Success criteria: validate.sh --strict passes recursively across 093/094/095/096; check-smart-router.sh fails on zero coverage; rg case-insensitive pass on \\.opencode/(skill|agent|command)/ returns no live workflow hits."
  ],
  "planSeed": [
    "Phase 1 (P0): Rebuild dist + add CI guard. Owner: maintainer. Blocks: release.",
    "Phase 2 (P1 cluster A — sk-deep-*): Token replacement across 5 surfaces (command YAMLs, agent mirrors, orchestrator tables, command markdown citations, install guides). Verification: dry-run /speckit:deep-review:auto and /speckit:deep-research:auto in both auto and confirm modes.",
    "Phase 3 (P1 cluster B — 096 doc/validation): Fix 096 spec narratives, parent+004-symlinks doc sufficiency, smart-router script. Verification: validate.sh --strict + check-smart-router.sh exit 0.",
    "Phase 4 (P1 cluster C — hooks/resolver): Remove env override; add realpath containment. Verification: malformed spec_folder attack-matrix tests.",
    "Phase 5 (P1 cluster D — checklist + Python): Backfill evidence; patch advisor scripts. Verification: zero-coverage smoke guard fires on stub repo.",
    "Phase 6 (P2 sweep): Doc drift updates. Verification: case-insensitive rg sweep returns only allowlisted hits.",
    "Final: re-run /speckit:deep-review:auto on the same scope to confirm verdict flips PASS (or PASS hasAdvisories=true if P2 deferred)."
  ],
  "findingClasses": {
    "cross-consumer": ["P0-001", "P1-002", "P1-003", "P1-005", "P1-008", "P1-009", "P1-011", "P1-012", "P1-013", "P1-014"],
    "instance-only": ["P1-006"],
    "matrix/evidence": ["P1-004", "P1-007", "P1-010", "P2-001", "P2-003", "P2-004", "P2-005", "P2-006", "P2-007", "P2-008"],
    "test-isolation": ["P2-002"]
  },
  "affectedSurfacesSeed": [
    {
      "surface": "mcp_server/dist (entire generated tree)",
      "currentRole": "live runtime path served via opencode.json/.codex/.gemini/.claude MCP server commands",
      "action": "rebuild from updated TypeScript source",
      "verification": "rg \\.opencode/skill on dist/ returns 0 hits; runtime smoke test"
    },
    {
      "surface": ".opencode/commands/speckit/assets/speckit_deep-review_*.yaml + spec_kit_deep-research_*.yaml",
      "currentRole": "command-owned workflow YAML for /speckit:deep-review and /speckit:deep-research",
      "action": "replace sk-deep-review/sk-deep-research with deep-review/deep-research throughout skill_reference, references, templates, and inline command paths",
      "verification": "rg sk-deep-(review|research) on assets/ returns 0 hits; dry-run init for both commands and modes"
    },
    {
      "surface": ".opencode/agents/{deep-review,deep-research,orchestrate}.md and runtime mirrors (.codex/.gemini/.claude/agents/)",
      "currentRole": "leaf-agent + orchestrator definitions referenced by deep-loop workflows",
      "action": "patch sk-deep-* citations to deep-* and verify cross-runtime mirror parity",
      "verification": "agent definitions are byte-equivalent across runtimes modulo runtime-specific frontmatter"
    },
    {
      "surface": ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/{spec.md,001-skills,002-agents,003-commands,004-symlinks}",
      "currentRole": "shipped rename-packet docs; some narrative was sed-corrupted into plural-to-plural tautologies",
      "action": "restore old-root literals in source-state prose; fix anchor/doc sufficiency in parent + 004-symlinks",
      "verification": "validate.sh --strict exits 0; tautology grep returns 0 narrative hits"
    },
    {
      "surface": ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts + .opencode/skill/.advisor-state",
      "currentRole": "skill advisor state writer; currently writes singular-root path",
      "action": "migrate to plural or neutral cache path; delete root .opencode/skill survivor",
      "verification": "find .opencode -maxdepth 1 -type d -name skill returns nothing"
    },
    {
      "surface": ".opencode/commands/doctor/scripts/audit_descriptions.py + skill_advisor.py native bridge",
      "currentRole": "Python support tools used by doctor commands",
      "action": "patch singular-default arg constants to plural; add zero-coverage smoke guard",
      "verification": "scripts return non-zero on a stub repo lacking expected directories"
    },
    {
      "surface": ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts",
      "currentRole": "Claude Stop hook with env-selectable autosave script",
      "action": "remove production env override or gate to test-only; add realpath containment",
      "verification": "malformed env values cannot trigger script execution outside the test fixture"
    },
    {
      "surface": ".opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:68",
      "currentRole": "rename verification gate; currently scans removed singular skill root",
      "action": "change SKILL_ROOT to .opencode/skills; fail when zero top-level skills found",
      "verification": "script fails on a stub with no skills under plural path"
    }
  ],
  "fixCompletenessRequired": true
}
```

<!-- /ANCHOR:planning-trigger -->

---

<!-- ANCHOR:active-finding-registry -->
## 3. Active Finding Registry

### P0 (1)

#### P0-001 — Live runtime uses stale generated code-graph scope globs after plural rename

| Field | Value |
|-------|-------|
| **Severity** | P0 (upgraded from P1-001 in iter-2) |
| **Dimension** | correctness |
| **File:line** | `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13` |
| **Source counterpart** | `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15` (correctly plural) |
| **Finding class** | cross-consumer |
| **Disposition** | Open / verdict-blocking |

**Evidence**: dist `.js` retains `**/.opencode/skill/**`, `**/.opencode/agent/**`, `**/.opencode/command/**` (singular) globs. Source `.ts` was correctly updated to plural by 096's bulk-sed but `mcp_server/dist` was never rebuilt. Runtime tie: `opencode.json:23`, `.codex/config.toml:11`, `.gemini/settings.json:29`, `.claude/settings.local.json:37`, and `mcp_server/package.json:9` all route the MCP/context server through `dist/context-server.js`, so the stale generated code is on the live path.

**Impact**: After packet 096, the running code graph applies the wrong scope policy to plural `.opencode/skills`, `.opencode/agents`, and `.opencode/commands` paths — silently indexes or skips the wrong surfaces relative to the source `.ts` and the rename spec.

**Fix recommendation**: Rebuild `mcp_server/dist` from the updated TypeScript source. Add a release guard (CI step) that fails on singular root literals in generated runtime outputs.

**Affected surfaces seed**: `mcp_server/dist/code_graph/lib/index-scope-policy.js`, all dependents of code-graph scope policy in dist; CI rebuild step.

**Adjudication packet**: see iteration-001.md §P1-001 (initial) and iteration-002.md §P1-001→P0-001 (escalation).

---

### P1 (12)

#### P1-002 — Command YAML sk-deep-* drift in auto-mode deep-loop workflows

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | correctness/traceability |
| **File:line** | `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56` |
| **Finding class** | cross-consumer |
| **Disposition** | Open |

**Evidence**: `spec_kit_deep-review_auto.yaml:56-64` and `spec_kit_deep-review_confirm.yaml:56-64` reference `sk-deep-review` and `.opencode/skills/sk-deep-review/...`; `spec_kit_deep-research_auto.yaml:67-76` and `spec_kit_deep-research_confirm.yaml:62` do the same for `sk-deep-research`. Plus `deep-review.md:290-296` and `deep-research.md:36`. Actual loaded skill folders are `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/` — the cited paths do not exist.

**Impact**: Fresh `/speckit:deep-review:auto` or `/speckit:deep-research:auto` runs can fail to load templates, reducers, references, or skill metadata from the canonical YAML route. (This review iteration succeeded only because the loop manager substituted the correct path manually each dispatch.)

**Fix recommendation**: Replace `sk-deep-review`/`sk-deep-research` with `deep-review`/`deep-research` across command markdown and YAML assets. Then dry-run init for both commands in both modes.

**Adjudication packet**: see iteration-001.md §P1-002.

---

#### P1-003 — Skill advisor source still writes .opencode/skill/.advisor-state

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | correctness |
| **File:line** | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12` |
| **Finding class** | cross-consumer |
| **Disposition** | Open |

**Evidence**: Source code in `freshness/generation.ts` writes to `.opencode/skill/.advisor-state` (singular). The runtime survivor at `.opencode/skill/.advisor-state/skill-graph-generation.json` records `reason: "post-index-assertion-failed"` and `state: "stale"`.

**Impact**: Advisor state continues to write to the forbidden root singular directory, leaving stale state and breaking the rename's structural-integrity objective.

**Fix recommendation**: Migrate advisor state to a plural or neutral cache path; add a root singular-directory guard to rename validation.

**Adjudication packet**: see iteration-002.md §P1-003.

---

#### P1-004 — Packet 096 validation failure localizes to parent + 004-symlinks

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | correctness |
| **File:line** | `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:117` |
| **Finding class** | matrix/evidence |
| **Disposition** | Open |

**Evidence**: `bash validate.sh ... 096-rename-opencode-dirs-to-plural` exits `2` with `SPEC_DOC_SUFFICIENCY: 1 spec_doc_sufficiency issue(s) found`. `--strict` also exits `2`. Validation passes for 093, 094, 095. Iter-2 localized the gap to parent spec.md anchor sufficiency + 004-symlinks/spec.md doc sufficiency.

**Impact**: The shipped rename packet does not satisfy the framework's own validation gate. Track cannot be claimed verified.

**Fix recommendation**: Repair parent and 004-symlinks doc sufficiency defects, then rerun recursive strict validation.

**Adjudication packet**: see iteration-001.md §P1-004 and iteration-002.md §P1-004 localization.

---

#### P1-006 — Claude Stop hook executes env-selected autosave before canonical path validation

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | security |
| **File:line** | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38` |
| **Finding class** | instance-only |
| **Disposition** | Open |

**Evidence**: Claude Stop hook reads an env-selectable autosave script path and executes before canonical workflow path resolution.

**Impact**: A malformed or hostile env var can redirect autosave script execution before the workflow's spec_folder write authority binds.

**Fix recommendation**: Remove production env script override OR require test-only gating plus realpath containment.

**Adjudication packet**: see iteration-003.md §P1-006.

---

#### P1-007 — Completed packets still have all required checklist evidence unchecked

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability |
| **File:line** | `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/checklist.md:40` (sample) |
| **Finding class** | matrix/evidence |
| **Disposition** | Open |

**Evidence**: 094's checklist.md (Level 2) carries unchecked required CHK-* items despite the packet being marked complete. Pattern repeats across other packets in the track that have checklists.

**Impact**: Completion verification is documentary. Strict validate passes by structure but the `[x]` evidence backfill rule is unmet.

**Fix recommendation**: Backfill checklist marks with concrete evidence citations OR relabel packets as not completion-verified.

**Adjudication packet**: see iteration-004.md §P1-007.

---

#### P1-008 — OpenCode deep-loop leaf-agent mirrors still cite non-existent sk-deep-* skill paths

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability |
| **File:line** | `.opencode/agents/deep-review.md:318` (and parallel in deep-research.md) |
| **Finding class** | cross-consumer |
| **Disposition** | Open |

**Evidence**: Agent body for `deep-review` cites `.opencode/skills/sk-deep-review/...` paths in its leaf-agent contract. Same pattern in `deep-research.md`.

**Impact**: Fresh agent dispatch reading the body for skill citations would resolve to non-existent paths.

**Fix recommendation**: Patch OpenCode deep-review/deep-research agent bodies to `.opencode/skills/deep-*` and verify cross-runtime mirrors (.codex/.gemini/.claude).

**Adjudication packet**: see iteration-004.md §P1-008.

---

#### P1-009 — Codex @review mirror weakens the P1 blocking contract

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability |
| **File:line** | `.codex/agents/review.toml:400` |
| **Finding class** | cross-consumer |
| **Disposition** | Open |

**Evidence**: Codex `@review` mirror weakens the shared doctrine that unresolved P1 fixes block PASS recommendations. Cross-runtime drift introduced or surviving the rename.

**Impact**: Cross-runtime semantic divergence — running review via Codex vs OpenCode produces different verdicts for identical inputs.

**Fix recommendation**: Align Codex `review.toml` with shared doctrine (unresolved P1 blocks PASS unless explicitly deferred).

**Adjudication packet**: see iteration-004.md §P1-009.

---

#### P1-010 — Packet 096 active specs were bulk-rewritten into plural-to-plural requirements

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | maintainability |
| **File:line** | `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:57` |
| **Finding class** | matrix/evidence |
| **Disposition** | Open |

**Evidence**: 096's own spec narrative says things like "rename `.opencode/skills/` to `.opencode/skills/`" — sed running over its own input destroyed the source-state literals. The "rename X to Y" narratives are now tautological.

**Impact**: Future readers cannot reconstruct what was renamed from the spec docs. Maintainability + audit trail damage.

**Fix recommendation**: Restore old-root literals in source-state prose; add a tautology grep guard for future rename packets.

**Adjudication packet**: see iteration-005.md §P1-010.

---

#### P1-011 — Active orchestrator routing table still names non-existent sk-deep-research

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | maintainability |
| **File:line** | `.opencode/agents/orchestrate.md:96` |
| **Finding class** | cross-consumer |
| **Disposition** | Open |

**Evidence**: Orchestrator's routing table cites `sk-deep-research` for the deep research agent route. The actual skill is `deep-research`.

**Impact**: Orchestrator dispatch by-name lookup may fail or fall back to advisory routing.

**Fix recommendation**: Replace `sk-deep-research` with `deep-research` and verify orchestrator mirrors across runtimes.

**Adjudication packet**: see iteration-005.md §P1-011.

---

#### P1-012 — Confirm-mode deep-loop command workflows also invoke retired sk-deep-* paths

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability/maintainability |
| **File:line** | `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56` |
| **Finding class** | cross-consumer |
| **Disposition** | Open (sibling of P1-002) |

**Evidence**: P1-002 covered auto-mode YAMLs; iter-6 confirmed confirm-mode YAMLs (`spec_kit_deep-review_confirm.yaml`, `spec_kit_deep-research_confirm.yaml`) carry the same drift.

**Fix recommendation**: Patch confirm and auto command workflow assets together; dry-run both modes.

**Adjudication packet**: see iteration-006.md §P1-012.

---

#### P1-013 — Smart-router validation scans the removed singular skill root and exits clean with zero coverage

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability/correctness |
| **File:line** | `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:68` |
| **Finding class** | cross-consumer |
| **Disposition** | Open |

**Evidence**: `check-smart-router.sh` sets `SKILL_ROOT=.opencode/skill` (singular). Post-rename that directory contains only `.advisor-state`, so the script's enumeration finds zero skills and exits successfully — vacuous pass. Meta-bug: the rename verification gate itself was checking the now-empty singular path.

**Impact**: The framework's own rename validation exits clean even when the rename is broken.

**Fix recommendation**: Change `SKILL_ROOT` to `.opencode/skills`; fail when zero top-level skills are scanned; add to rename guard set.

**Adjudication packet**: see iteration-007.md §P1-013.

---

#### P1-014 — Python doctor/advisor support scripts still resolve singular OpenCode roots

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability/correctness |
| **File:line** | `.opencode/commands/doctor/scripts/audit_descriptions.py:157` |
| **Finding class** | cross-consumer |
| **Disposition** | Open |

**Evidence**: `audit_descriptions.py` retains singular-root defaults (`.opencode/skill/`, `.opencode/agent/`, `.opencode/command/`) at line 157. `skill_advisor.py` native bridge constants point at `.opencode/skill/system-spec-kit`. The 096 commit message claimed these were patched but iter-8 confirmed the singular defaults remain.

**Impact**: Doctor/advisor support tools silently scan empty paths post-rename, yielding zero-coverage clean exits.

**Fix recommendation**: Patch `audit_descriptions.py` to plural skills/commands/agents; patch `skill_advisor.py` native bridge to `.opencode/skills/system-spec-kit`; add zero-coverage and `--force-native` smoke guards.

**Adjudication packet**: see iteration-008.md §P1-014 and iteration-009.md (narrow re-pass).

<!-- /ANCHOR:active-finding-registry -->

---

<!-- ANCHOR:remediation-workstreams -->
## 4. Remediation Workstreams

Ordered by severity → P0 first, then P1, with P2 advisories separated.

### P0 — Block release

- **RW-A. Build hygiene + dist rebuild** *(P0-001 + supporting P2-002, P2-008)*: Rebuild `mcp_server/dist` from updated TypeScript source. Add CI guard that fails on singular root literals in generated runtime outputs. Add release-time check that source TypeScript and dist JavaScript globs match.

### P1 — Required (release-blocking unless explicitly deferred)

- **RW-B. sk-deep-* dead-reference closure** *(P1-002, P1-008, P1-009, P1-011, P1-012)*: Token replace `sk-deep-review`/`sk-deep-research` → `deep-review`/`deep-research` across command YAMLs (auto+confirm), agent definitions (.opencode/.codex/.gemini/.claude), orchestrator routing table, command markdown.
- **RW-C. Packet 096 narrative + validation repair** *(P1-004, P1-010, P1-013)*: Fix 096 parent + 004-symlinks doc sufficiency. Restore source-state literals in 096 narrative prose. Fix smart-router validation script (`check-smart-router.sh`) to scan plural path and fail on zero coverage.
- **RW-D. Hook precedence + resolver tightening** *(P1-006)*: Remove production env-script override in Claude Stop hook OR test-only-gate it. Add realpath containment.
- **RW-E. Checklist evidence backfill + RCAF supersession** *(P1-007 + P2-006)*: Backfill required `[x]` marks with evidence across 093/094/095/096. Add 094 ADR supersession notes to 093 specs.
- **RW-F. Skill advisor + Python tools plural migration** *(P1-003, P1-014)*: Migrate advisor state to plural/neutral path; patch `audit_descriptions.py` + `skill_advisor.py` native bridge to plural; add zero-coverage smoke guards.

### P2 — Advisory (non-blocking, may defer with documented reason)

- **RW-G. P2 doc-only drift sweep** *(P2-001, P2-003, P2-004, P2-005, P2-007 + downgraded P1-005)*: Update install guides, Barter root README/CONTRIBUTING; remove dead Copilot guard branch (or implement); fix 2 nested-backtick playbook prompts; reconcile setup guide skill inventory.

<!-- /ANCHOR:remediation-workstreams -->

---

<!-- ANCHOR:spec-seed -->
## 5. Spec Seed

For the follow-on `/speckit:plan` packet:

- **Title**: "Remediation: 097 track-review findings — dist rebuild + sk-deep-* dead refs + 096 narrative/validation + hooks/resolver + checklist backfill"
- **Level**: 2 or 3 (22 findings; touches multiple subsystems)
- **In Scope**:
  - Rebuild `mcp_server/dist` from current TypeScript source
  - Token replacement campaign for `sk-deep-review`/`sk-deep-research`
  - Repair 096 spec narrative tautologies + parent/004-symlinks doc sufficiency
  - Tighten Claude Stop hook env handling
  - Add realpath containment to deep-loop artifact resolver
  - Backfill checklist evidence on completed packets
  - Migrate skill advisor state from singular path
  - Patch `audit_descriptions.py` and `skill_advisor.py` native bridge
  - Fix `check-smart-router.sh` to scan plural path and fail on zero coverage
  - P2 doc drift sweep across install guides + Barter root + cli-opencode playbook prompts
- **Out of Scope**:
  - Re-running the 094 RCAF naturalization or 096 directory rename (both are baseline)
  - Auditing `barter/coder/` sibling repo (intentionally separate per project memory)
  - Auditing `z_archive/`, `playbooks-archived/`, `review/iter-archive/` historical content
- **Risks**:
  - Dist rebuild may surface unrelated test failures
  - Resolver tightening may break legitimate edge cases (allow tests)
  - Token replacement across 4 runtime mirrors needs careful cross-runtime verification
- **Success Criteria**:
  - `validate.sh --strict` exits 0 recursively across 093/094/095/096
  - `check-smart-router.sh` fails on a stub repo with zero plural-path skills
  - Case-insensitive `rg '\.opencode/(skill|agent|command)/'` returns only allowlisted hits
  - Re-running `/speckit:deep-review:auto` on the same scope returns PASS (with hasAdvisories=true if P2 deferred)

<!-- /ANCHOR:spec-seed -->

---

<!-- ANCHOR:plan-seed -->
## 6. Plan Seed

Concrete starter tasks for `/speckit:plan`:

| Phase | Task | Verification |
|-------|------|--------------|
| 1 | Rebuild `mcp_server/dist` from current TypeScript | `rg '\.opencode/skill' mcp_server/dist` returns 0 hits |
| 1 | Add CI guard: fail on singular root literals in dist | CI step exits non-zero on a planted singular literal |
| 2 | Token replace sk-deep-* in command YAMLs (auto+confirm) | `rg sk-deep-` on `.opencode/commands/speckit/assets/` returns 0 |
| 2 | Token replace sk-deep-* in agent mirrors (.opencode/.codex/.gemini/.claude) | `rg sk-deep-` on `*/agents/` returns 0 |
| 2 | Token replace sk-deep-* in orchestrate.md routing table | `rg sk-deep-` on `agents/orchestrate.md` returns 0 |
| 2 | Token replace sk-deep-* in command markdown citations | `rg sk-deep-` on `commands/speckit/*.md` returns 0 |
| 2 | Dry-run `/speckit:deep-review:auto` and `:confirm` | Both modes load templates without path errors |
| 3 | Fix 096 parent + 004-symlinks doc sufficiency | `validate.sh --strict 096-rename-opencode-dirs-to-plural` exits 0 |
| 3 | Restore source-state literals in 096 narrative | Tautology grep returns 0 narrative hits |
| 3 | Fix `check-smart-router.sh` SKILL_ROOT + zero-coverage failure | Stub repo without skills makes script exit non-zero |
| 4 | Remove env override in Claude Stop hook + add realpath containment | Malformed env value cannot redirect script execution |
| 4 | Add resolver realpath check (P1-005 follow-up) | Attack matrix tests pass |
| 5 | Backfill checklist evidence on 093/094/095/096 | All required `[x]` marks have file:line citations |
| 5 | Add 094 ADR supersession notes to 093 specs | 093 spec.md cites 094's ADR for RCAF decision |
| 6 | Migrate skill advisor state from `.opencode/skill/.advisor-state` | `find .opencode -maxdepth 1 -type d -name skill` returns nothing |
| 6 | Patch `audit_descriptions.py` to plural defaults | Stub repo with empty plural dirs makes script exit non-zero |
| 6 | Patch `skill_advisor.py` native bridge constants | `--force-native` smoke test passes |
| 7 | P2 doc drift sweep (install guides, Barter root, cli-opencode prompts) | Final case-insensitive rg returns only allowlisted hits |
| 8 | Re-run `/speckit:deep-review:auto` on same 093-096 scope | Verdict PASS (hasAdvisories=true if P2 deferred) |

<!-- /ANCHOR:plan-seed -->

---

<!-- ANCHOR:traceability-status -->
## 7. Traceability Status

### Core Protocols

| Protocol | Status | Iterations | Notes |
|----------|--------|-----------|-------|
| `spec_code` | partial | 1, 2, 4 | Packet 096's spec intent (plural rename) is contradicted by stale dist + command YAML drift. P0-001 + P1-002 + P1-010 are all spec-code traceability failures. |
| `checklist_evidence` | fail | 1, 4 | 096 fails validate.sh entirely (P1-004). Other packets pass structurally but P1-007 surfaced unchecked required `[x]` marks across 093/094/095/096. |

### Overlay Protocols

| Protocol | Status | Iterations | Notes |
|----------|--------|-----------|-------|
| `skill_agent` | partial | 1, 4 | sk-code-review and sk-git playbook samples preserve prompt-equality requirement text. Full 16-playbook equality matrix sampled but not exhaustively verified — 094's RCAF naturalization left ~15% RCAF retention; spot-check passed. |
| `agent_cross_runtime` | partial | 1, 4 | OpenCode/Codex/Gemini/Claude config paths use plural `.opencode/skills`. But P1-008 (OpenCode mirror cites sk-deep-*) and P1-009 (Codex weakens P1 contract) are cross-runtime drift. |
| `feature_catalog_code` | notApplicable | — | Not exercised in this review's scope. |
| `playbook_capability` | partial | 4 | Sampled playbooks preserve prompt-equality. Full 16-playbook equality pass deferred to a follow-on traceability packet. P2-005 + P2-006 surfaced 2 playbook narrative defects. |

<!-- /ANCHOR:traceability-status -->

---

<!-- ANCHOR:deferred-items -->
## 8. Deferred Items

Advisory-only or backlog-worthy follow-ups that do not block the verdict:

- **P1-005 (downgraded to P2)** — Deep-loop artifact resolver accepts malformed `spec_folder` values. Iter-6 attack matrix showed malformed values do not actually exploit (downgrade rationale: defense-in-depth, not active vulnerability). May still be addressed in RW-G hardening.
- **P2-001..P2-008** — Documented above in §3. Doc-only drift; install guides, dist test fixtures, Barter root helpers, dead Copilot guard branch, nested-backtick playbook prompts, setup guide skill inventory, broader dist drift framing. Address in RW-G.
- **Full 16-playbook prompt-equality matrix** — Sampled but not exhaustive. If 094 expects byte-equivalent prompt fields between SKILL.md source and per-feature canonical, a dedicated 048-style traceability packet should run after RW-B closure.
- **Convergence graph** — `graphConvergenceScore` stayed at 0 because graphEvents were not emitted by iterations. Future review packets should populate `graphEvents` arrays so the coverage-graph signal contributes to convergence.

<!-- /ANCHOR:deferred-items -->

---

<!-- ANCHOR:audit-appendix -->
## 9. Audit Appendix

### Convergence Summary

| Iter | Focus | Findings | Sev | New | Ratio | Duration | Status |
|-----:|-------|---------:|-----|----:|-----:|---------:|--------|
| 1 | inventory_correctness | 6 | P0=0 P1=4 P2=2 | 6 | 1.00 | 16 min | complete |
| 2 | correctness_deep_096 | 7 | P0=1 P1=3 P2=3 | 1 | 0.50 | 26 min | complete |
| 3 | security | 10 | P0=1 P1=5 P2=4 | 3 | 0.31 | 82 min | complete |
| 4 | traceability | 15 | P0=1 P1=8 P2=6 | 5 | 0.30 | 41 min | complete |
| 5 | maintainability | 19 | P0=1 P1=10 P2=8 | 4 | 0.18 | 42 min | complete |
| 6 | adversarial_reverification | 20 | P0=1 P1=10 P2=9 | 1 | 0.07 | 40 min | complete |
| 7 | closure_saturation | 21 | P0=1 P1=11 P2=9 | 1 | 0.07 | 63 min | complete |
| 8 | final_saturation | 22 | P0=1 P1=12 P2=9 | 1 | 0.06 | 9 min | complete |
| 9 | python_support_tool_repass | 22 | P0=1 P1=12 P2=9 | 0 | 0.00 | 17 min | complete |
| 10 | final_confirmation | 22 | P0=1 P1=12 P2=9 | 0 | 0.00 | 5 min | complete |

**Total cli-codex compute**: ~340 minutes (gpt-5.5, high reasoning, fast service tier).
**Stop reason**: `maxIterationsReached` (effectively at saturation since iter-9; iter-10 was confirmation-only).
**Convergence score**: 1.00 (composite weighted vote saturated).
**Graph convergence**: 0 (graphEvents not emitted; deferred).
**Legal-stop gates** at iter-10:
- convergenceGate: PASS (score 1.00 ≥ 0.60)
- dimensionCoverageGate: PASS (4/4 covered, age 4)
- p0ResolutionGate: **FAIL** (activeP0=1) → STOP would have been BLOCKED if max not reached
- evidenceDensityGate: PASS (every P0/P1 has file:line)
- hotspotSaturationGate: PASS (sk-deep-* and dist surfaces revisited 2-3 times each)
- claimAdjudicationGate: PASS (every new P0/P1 has typed packet in iteration markdown)
- fixCompletenessReplayGate: PASS (no fix rerun in scope)

### Coverage Summary

| Dimension | Coverage | Iterations Touched |
|-----------|----------|--------------------|
| Correctness | complete | 1, 2 (deep), 6 (re-verify) |
| Security | complete | 3 (deep), 6 (P1-005 attack matrix), 7 (closure) |
| Traceability | complete | 4 (deep), 6 (re-verify), 7 (closure) |
| Maintainability | complete | 5 (deep), 6 (re-verify) |

### Ruled-Out Claims

- **Critical config pluralization for opencode.json/.codex/.gemini/.claude primary MCP paths** — sampled and confirmed plural; no singular primary path found.
- **Broken symlink regression in canonical .opencode/.claude/.codex/.gemini scan** — `find ... -xtype l` returned no broken symlinks.
- **P1-005 exploitable resolver attack** — attack matrix (empty/whitespace/`..`/absolute/symlink/glob/template-placeholder) showed no path escapes the resolved spec_folder; downgraded to P2.
- **Naming consistency drift** — Mixed `sk-*` (sk-code, sk-doc, sk-git, sk-prompt, sk-code-review) vs bare names (cli-*, mcp-*, deep-*, system-spec-kit) is intentional per skill description budget convention; not a finding.
- **barter/coder/.opencode/skill/* survivors** — out of scope per project memory ("AGENTS.md sibling sync canonical + Barter only"); flagged only in P2-003 for the shared root barter/README.md.

### Sources Reviewed

The review touched 80+ files across the four packets and the wider canonical workspace. Highest-confidence file evidence is preserved in the iteration markdowns:

- `iterations/iteration-001.md` — inventory pass (28 files reviewed; 6 findings raised)
- `iterations/iteration-002.md` — correctness deep pass on 096 (P0 escalation)
- `iterations/iteration-003.md` — security deep pass (3 new P1; longest iter at 82 min)
- `iterations/iteration-004.md` — traceability deep pass (5 new findings; cross-runtime drift)
- `iterations/iteration-005.md` — maintainability deep pass (4 new findings; 096 narrative tautology)
- `iterations/iteration-006.md` — adversarial re-verification (P1-005 downgrade after attack matrix; P1-012 added)
- `iterations/iteration-007.md` — closure saturation (P1-013 smart-router meta-bug)
- `iterations/iteration-008.md` — final saturation (P1-014 Python tools)
- `iterations/iteration-009.md` — Python support-tool re-pass (clean)
- `iterations/iteration-010.md` — final confirmation (clean)

### Cross-Reference Appendix

#### Core Protocols

- **spec_code**: `spec.md` claims vs implementation across 093/094/095/096. Failed for 096 (rename narrative is plural-to-plural tautology + dist not rebuilt); partial for 094 (RCAF naturalization claims partially superseded by 094's own ADR but 093 specs not updated).
- **checklist_evidence**: Required `[x]` marks vs cited evidence. Failed: 096 entire validate.sh exits 2; partial: 094 checklist has unchecked items.

#### Overlay Protocols

- **skill_agent**: SKILL.md contracts vs agent files. Partial: deep-review and deep-research SKILL.md exist at `.opencode/skills/deep-*/SKILL.md` but agent definitions cite `sk-deep-*` paths (P1-008).
- **agent_cross_runtime**: Agent definition parity across .claude/.codex/.opencode/.gemini. Partial: P1-008 (OpenCode) + P1-009 (Codex) + P1-011 (orchestrator routing) all cross-runtime drift.
- **feature_catalog_code**: Catalog claims vs implementation. Not applicable in this review.
- **playbook_capability**: Playbook prompt-equality vs capability claims. Partial: sampled OK, full matrix deferred.

<!-- /ANCHOR:audit-appendix -->

---

## End of Report

**Generated**: 2026-05-07T17:30:00Z (synthesis after iter-10 completion)
**Loop Manager**: cli-codex (gpt-5.5, high reasoning, fast service tier) dispatched per-iteration; loop manager (this layer) handled init, convergence, and synthesis.
**Next Action**: User runs `/speckit:plan` against the Planning Packet above to scaffold the 098 (or next available number) remediation packet under `.opencode/specs/skilled-agent-orchestration/`.
