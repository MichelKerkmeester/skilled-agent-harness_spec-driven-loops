---
title: "Implementation Plan: Phase 2 — Dual-publish Figma to AI_Systems/Public"
description: "cp + sanitize Barter Figma → Public Figma; cli-codex re-authors README for open-source audience; Claude direct patches Public/README.md §8 anchor + TOC entry; 2 commits."
trigger_phrases:
  - "phase 2 plan"
  - "public figma plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/003-mcp-figma-transfer/002-public-figma-agent"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Plan doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:6d67d07055064da954924c244bf02435df6ac4d370b4906e4e1ebc63e1e73e27"
      session_id: "067-002-plan-2026-05-05"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2 — Dual-publish Figma to AI_Systems/Public

<!-- ANCHOR:summary -->
## 1. SUMMARY

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

Template compliance scaffold for 002-public-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:milestones -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->

---

### 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Operations** | `cp -r`, `rm -rf` (context/), single cli-codex README rewrite, manual README §8 edit, `npm install` |
| **Repos touched** | `AI_Systems/Public` only |
| **Source** | Phase 1 Barter Figma working tree (commit 690b498) |
| **Target** | `AI_Systems/Public/Figma/` (new) + `AI_Systems/Public/README.md` (patch) |

### Overview
Duplicate Phase 1's Barter Figma agent into the open-source `AI_Systems/Public` repo with minimal divergence: drop `context/`, re-author `README.md` for open-source audience, register the new agent in the Public AI Systems index README. Two commits to keep authoring (folder creation) separate from index registration (README §8 patch) for clean rollback.

---

### 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 commit `690b498 Figma MCP` on Barter main verified
- [x] D9 + D10 resolved at parent level
- [x] Spec docs authored

### Definition of Done
- [ ] `Public/Figma/` exists with byte-equivalent AGENTS/INSTALL/knowledge base/mcp servers
- [ ] Public Figma README diverged for open-source audience
- [ ] `Public/Figma/context/` ABSENT
- [ ] `Public/README.md` §8 Figma Agent anchor + TOC entry
- [ ] Badge math reconciled
- [ ] Opus hooks C + D pass
- [ ] 2 commits on AI_Systems/Public main

---

### 3. APPROACH

### Strategy
**Copy-first, sanitize, then rewrite.** Preserves byte-identity for content that should match exactly; only README diverges. Two commits keep folder authoring separate from index registration.

### Phase 2A — Copy + Sanitize
1. `cp -r` Barter Figma → Public Figma
2. `rm -rf` Public/Figma/context/ (per D9)
3. `rm -rf` Public/Figma/mcp servers/figma-mcp-stdio/node_modules/ (rebuild fresh)

### Phase 2B — README rewrite (cli-codex)
Single cli-codex job: re-author `Public/Figma/README.md` for open-source audience. Constraints: preserve sections + diagrams + comparison tables; adjust audience framing only.

### Phase 2C — npm install (local)
`cd Public/Figma/mcp servers/figma-mcp-stdio/ && npm install --no-fund --no-audit`

### Phase 2D — Commit 2
`git -C Public add Figma/` then `git -C Public commit -m "Figma MCP\n\nCo-Authored-By: ..."`

### Phase 2E — Public/README.md §8 patch
1. Investigate D10 baseline (count `ls -d Public/*/`)
2. Edit TOC: add `8. [Figma Agent](#8-figma-agent)`
3. Edit body: add §8 anchor section after §7 ClickUp Agent

### Phase 2F — Commit 3
`git -C Public add README.md` then `git -C Public commit -m "Add Figma to README\n\n..."`

### Phase 2G — Verification (opus subagent)
- **Hook C** (Barter↔Public diff)
- **Hook D** (Public README integrity)

### Branch strategy
Stay on Public main. Don't auto-branch.

---

### 4. ARCHITECTURE

### Public/Figma folder layout (post-sanitization)

```
AI_Systems/Public/Figma/                     # NOT under MCP Agents/ — root level
├── AGENTS.md                                # byte-equivalent
├── README.md                                # diverges (open-source)
├── INSTALL_GUIDE.md                         # byte-equivalent
├── Favicon.jpg                              # text marker
├── knowledge base/                          # byte-equivalent
└── mcp servers/                             # byte-equivalent (minus node_modules)
```

**EXPLICITLY ABSENT:** `context/` folder.

### Public/README.md patch surface

```diff
  Badge: Systems-N_Total (verify N matches reconciled count)

  #### 💬 MCP's Made Easy
  ...
  7. [ClickUp Agent](#7-clickup-agent)
+ 8. [Figma Agent](#8-figma-agent)

  ... (§7 ClickUp ends)
+ ---
+ <a id="8-figma-agent"></a>
+ ### 🎨 8. Figma Agent
+ ... (mirror §7 structure)
```

---

### 5. cli-codex DISPATCH PATTERN

Single dispatch (README rewrite):

```bash
codex exec \
  --dangerously-bypass-approvals-and-sandbox \
  --skip-git-repo-check \
  -c model="gpt-5.5" \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  -C "/Users/.../AI_Systems/Public/Figma" \
  "<README rewrite prompt>"
```

Input pack:
- Source: copied Barter README at output path
- Reference: `Public/ClickUp/README.md`
- Constraints: preserve structure, adjust framing only

---

### 6. VERIFICATION GATES

### Opus subagent hook C (Barter↔Public diff)

| Check | Expected |
|---|---|
| `diff -rq` Barter↔Public Figma | Only context/ absent + README differs |
| md5sum AGENTS/INSTALL/knowledge base/mcp servers files | Match |
| Public/Figma/context/ absent | ✓ |
| Public/Figma/Favicon.jpg text marker | ✓ |
| Public/Figma/.../node_modules/ absent (gitignored) | ✓ |

### Opus subagent hook D (Public README integrity)

| Check | Expected |
|---|---|
| TOC count under "💬 MCP's Made Easy" | 6 (was 5: Media Editor, Webflow, Notion, CapCut, ClickUp + Figma) |
| Total TOC count | 8 (2 Specialized Writer + 6 MCP's Made Easy) |
| Badge `Systems-N_Total` | N = 8 (matches new TOC) |
| §8 anchor `#8-figma-agent` | Resolves |
| §8 structure | Mirror §7 ClickUp Agent |

---

### 7. ROLLBACK

| Trigger | Action |
|---------|--------|
| cp/sanitize fails | `git -C Public restore .` (no commit yet) |
| cli-codex over-strips | Re-dispatch with stricter constraints |
| Hook C unexpected drift | Re-cp from Barter; re-verify |
| Hook D broken TOC | Manual edit; re-verify |

---

### 8. NEXT PHASE HANDOFF

Phase 3 starts when:
1. Commits 2 + 3 land on AI_Systems/Public main
2. Opus hooks C + D pass
3. All Phase 2 P0 requirements green
