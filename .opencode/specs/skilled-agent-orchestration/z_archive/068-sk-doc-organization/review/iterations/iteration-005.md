---
iteration: 5
timestamp: "2026-05-05T11:42:00+02:00"
focus: "Git history integrity (4 commits on main, no surviving feature branch, rename detection) + out-of-scope respect (barter/, z_archive/, .opencode/specs/**/{iterations,research,logs,review}/**, sk-doc changelog history NOT touched)"
dimensions: ["traceability", "correctness"]
executor: "cli-copilot"
model: "claude-opus-4.7"
---

# Iteration 5 — Git History Integrity + Out-of-Scope Respect

## Deterministic Checks Run

### 1. Branch state
```
git branch --show-current                                  → main
git branch | grep -E "068|sk-doc|agents-relocate" | wc -l  → 0
git branch -a | head -20                                   → no surviving 068/sk-doc feature branch
```
Active branches: `main`, `opencode-env`, `system-speckit/{023,024,026}` (all unrelated to 068). ✅ No orphan/feature branch from the 068 work; all phases landed directly on `main`.

### 2. Commit lineage on main (068 packet only)
```
git log --oneline ccd73ef55^..98cc6b59c4
98cc6b59c4 feat(sk-doc): verify and ship sk-doc reorg (068/003)        ← Phase 3
8513365189 feat(sk-doc): update path references to assets/ root layout + mirror across 4 runtimes (068/002)  ← Phase 2
c59679ea75 docs(068): scaffold parent + 001-relocate child docs for sk-doc reorg
ccd73ef557 feat(sk-doc): relocate feature_catalog/testing_playbook/templates to assets/ root (068/001)        ← Phase 1
```

| Expected | Observed SHA | Subject match | Result |
|----------|--------------|---------------|--------|
| Phase 1 relocate (`ccd73ef55`) | `ccd73ef5573a5eff8c0ba1b33749ce8c805d0258` | feat(sk-doc): relocate feature_catalog/testing_playbook/templates… | ✅ |
| 068 + 001 docs (`c59679ea7`) | `c59679ea75f1248e1f0cef714fb163695345eae7` | docs(068): scaffold parent + 001-relocate child docs… | ✅ |
| Phase 2 update-and-mirror (`851336518`) | `851336518983c4b36e37c743071c10ffed913ebd` | feat(sk-doc): update path references…+ mirror across 4 runtimes (068/002) | ✅ |
| Phase 3 verify-and-ship (`98cc6b59c`) | `98cc6b59c4d2c5c7a6f3ede30cfb87a2ef8fa711` | feat(sk-doc): verify and ship sk-doc reorg (068/003) | ✅ |

Exactly 4 commits, in expected order, with conventional-commit subjects matching the phase plan. ✅

> Note: HEAD has since advanced 5 unrelated commits (mcp-figma removal, 067 transfer spec, session sync) past `98cc6b59c4`. These are **outside the 068 scope** and not reviewed here.

### 3. Rename detection traceability (`git log --follow`)

| Path | Pre-Phase-1 history surfaced | Result |
|------|------------------------------|--------|
| `assets/agent_template.md` | `c783645545` (rename @create-doc→@create), `52f23c692f`, `dde19822df`, `4d3dee5ae4` | ✅ |
| `assets/command_template.md` | `4d3dee5ae4`, `35cdd5f02e`, `6eb3aefc78`, `b1ee4ea572` | ✅ |
| `assets/feature_catalog/feature_catalog_template.md` | `e738386898`, `35cdd5f02e`, `8ee0511e37`, `6eb3aefc78` | ✅ |
| `assets/testing_playbook/manual_testing_playbook_template.md` | `e738386898`, `fe2472077a`, `4576ebc945`, `853e574aa9` | ✅ |

All 4 relocated files trace cleanly through `ccd73ef557` (Phase 1) into pre-Phase-1 ancestry. Git rename detection is operating correctly — Phase 1 was committed as a true rename (mode `R`), preserving file identity for blame/log/follow. ✅

### 4. Out-of-scope respect (068 commit range `ccd73ef55^..98cc6b59c4`)

| Locked path glob | Files touched | Result |
|------------------|---------------|--------|
| `barter/coder/**` | 0 | ✅ |
| `.opencode/specs/**/z_archive/**` | 0 | ✅ |
| `.opencode/specs/**/iterations/**` | 0 | ✅ |
| `.opencode/specs/**/research/**` | 0 | ✅ |
| `.opencode/specs/**/logs/**` | 0 | ✅ |
| `.opencode/specs/**/review/**` | 0 | ✅ |
| `.opencode/skills/sk-doc/changelog/v1.1.3.0.md` | 0 | ✅ |
| `.opencode/skills/sk-doc/changelog/v1.4.0.0.md` | 0 | ✅ |
| `.opencode/skills/sk-doc/changelog/**` (entire dir) | 0 | ✅ |
| `.opencode/skills/system-spec-kit/mcp_server/dist/**` | 0 | ✅ |
| `.opencode/skills/system-spec-kit/scripts/observability/**` | 0 | ✅ |
| `.tmp/**` | 0 | ✅ |

Earlier broad `ccd73ef55^..HEAD` sweep returned 15 hits in `iterations/` and 1 in `dist/` — these are **post-068 commits** (`9f7b3c6d48`, `a4cb4e0a1c`, `7307e056d7`, `b03bf75630`, `bdb739d973`, all unrelated mcp-figma/067/sync work). Re-scoped to the 068 range, **all locked globs are zero hits**. ✅

> Sub-finding: 068 did NOT add a new sk-doc changelog entry. Strategy line 53 only locks _historical_ changelog accuracy (no edit to existing files), which is satisfied. Whether a new `v1.x.y.z.md` entry SHOULD have been added is outside this iteration's dimensions (covered by Iter 4 documentation alignment, which did not flag it). Not a finding here.

### 5. In-scope edits (sanity check)

`git diff ccd73ef55^..98cc6b59c4 --name-only` produces exactly 60 paths, all confined to:

- `.opencode/skills/sk-doc/{SKILL.md,assets/**,references/global/**,references/specific/**}` (15 paths)
- `.opencode/commands/create/**` (10 paths)
- `.opencode/agents/create.md` + `.opencode/install_guides/SET-UP - Opencode Agents.md` (2 paths)
- Mirrors: `.claude/agents/create.md`, `.codex/agents/create.toml`, `.gemini/{commands/create/*.toml, agents/create.md}` (6 paths)
- 068 spec packet: parent (3 lean-trio files) + 001/002/003 children (each 6 Level-1 files + 1 scratch) (24 paths)

No path leaks outside active scope. ✅

### 6. Phase 1 deletion confirmation

`.opencode/skills/sk-doc/assets/agents/` no longer exists on disk; `assets/` root contains the 2 relocated `*_template.md` files plus `documentation/`, `feature_catalog/`, `testing_playbook/`, `flowcharts/`, `skill/`, `template_rules.json`. ✅ Matches the plan (rmdir `agents/` after `git mv`).

## Findings

### P0 — None
### P1 — None (NEW)
### P2 — None (NEW)

This iteration produced **zero new findings**. The git history is clean, immutable on `main`, conventionally-commit-titled, rename-traceable, and out-of-scope locks were respected by every commit in the 068 range.

## Verdict
**PASS** for dimensions 8 (git history integrity) and 9 (out-of-scope respect). Carrying forward only the prior P1-003-A (broken cross-link in `frontmatter_templates.md`) from iteration 3, which is independent of this iteration's scope.

## Convergence Signal
- New P0: 0
- New P1: 0
- New P2: 0
- Convergence streak (consecutive iterations with 0 new P0/P1): **1** (iteration 4 also had 0 new P0/P1 per its delta record). One more clean iteration would trigger early stop per strategy (`2 consecutive iterations with 0 new P0/P1`). Continue to iteration 6 (Hunter, adversarial).
