---
title: "Implementation Plan: Phase 8: agent-mirror-parity"
description: "Document the six-tree translation contract in one crosswalk the agent READMEs cite, give each workflow mode its own leaf set with a collision refusal in the shared generator, and remove the state keys two agent bodies demanded but no consumer reads."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: agent-mirror-parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS scripts), Markdown agent definitions, TOML (Codex dialect) |
| **Framework** | Self-running Node test scripts for the shared generator; vitest for the deep-loop runtime |
| **Storage** | Committed JSON manifests (`leaf-manifest.json`, `leaf-scopes.json`) |
| **Testing** | `node <test>.test.cjs` fixture suites, generator `--check` modes, mirror and freshness gates, `npx vitest run --no-coverage` |

### Overview
Two changes, one theme: make the translations between mirrored surfaces explicit. The agent-tree half measures what each runtime dialect can carry and writes the result down as a crosswalk the trees cite, then removes the one demand that no consumer could honour. The leaf-manifest half stops the shared generator from handing two workflow modes the same packet-wide leaf set and teaches the router-contract reachability check that a leaf belongs to the mode that declares it, not necessarily to the first mode that names the packet.
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
Single-writer, generated-mirror topology: each agent declaration is authored once per tier and every derived tree is compiler output.

### Key Components
- **Authored trees**: `.opencode/agents/` (canonical source) and `.claude/agents/` (the Claude dialect fork the `.cursor` and `.devin` symlinks resolve to).
- **Generated trees**: `.pi/agents/` and `.codex/agents/`, each owned by its sync script; write mode prunes output the canonical tree no longer justifies.
- **Gates**: `check-agent-mirror-sync.cjs` (body and tool-surface comparison), `agent-roster-mirror-check.cjs` (coverage and symlink resolution), both generators' `--check` modes.
- **Leaf scoping**: an authored `leaf-scopes.json` at a hub root maps a workflow mode to packet-relative subpaths; the generator walks only those and refuses two modes that receive the same normalised leaf set.

### Data Flow
A canonical edit flows from `.opencode/agents/<name>.md` outward: the `.claude` twin is edited in the same change, the two generators re-emit `.pi` and `.codex`, and the gates compare the results. A manifest build reads `mode-registry.json`, `leaf-aliases.json` and now `leaf-scopes.json`, walks each packet once per mode, and refuses to write a manifest whose modes collide.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Shared leaf-manifest generator for every hub that carries a registry | update: read optional scopes, refuse colliding mode leaf sets | `node ... --check <hub>` exit 0 for all hubs; fixture test |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs` | Pure identity/conversion boundary | update: add `modeLeafSetDigest` and `findCollidingModeLeafSets` | `leaf-resource-contract.test.cjs` |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | ROUTER.md reachability check over the manifest | update: a mapped path is reachable when a mode of the same packet owns the leaf | `root-router-contract.test.cjs` and `parent-skill-check.cjs` exit 0 |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | CI freshness gate over committed manifests | unchanged: consumes the generator, so it inherits the scoping and the refusal | `checked=13 fresh=13 failed=0` |
| `.opencode/agents/`, `.claude/agents/` | Authored agent trees | update: one body loses two state keys; one `.claude` body regains its tier's path references | `check-agent-mirror-sync.cjs --all` exit 0 |
| `.pi/agents/`, `.codex/agents/` | Generated agent trees | update: regenerated from the canonical body | both `--check` modes exit 0 |

Required inventories:
- Same-class producers: `rg -n "budgetProfile|edgeCases" .opencode/agents .claude/agents .pi/agents .codex/agents` - empty after the change; the vendored `barter/ai-speckit/coder/` copy and archived candidate specs are outside the six trees.
- Consumers of changed symbols: `rg -n "modeLeafSetDigest|findCollidingModeLeafSets|manifestLeafOwners|manifestOwnsLeafForPacket"` - the generator, the router contract and their tests.
- Matrix axes: hub (system-deep-loop, sk-doc, and the five scoping-free hubs) x mode x scope shape (directory, single file, absent, orphan, missing target).
- Algorithm invariant: a manifest is written only when every mode's normalised leaf set is distinct; a mapped ROUTER.md path must resolve to a mode that owns it inside the packet.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Leaf-set digest and collision helpers; scope normalisation and collection | `leaf-resource-contract.test.cjs`, `generate-leaf-manifest-scopes.test.cjs` |
| Integration | Real hubs: manifest freshness, router reachability, skill-root metadata | `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs`, `ci-skill-root-metadata.cjs` |
| Manual | Six-tree translation rules checked against the generators' source | generator reads plus `--check` runs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sync-agents-pi.cjs` / `sync-agents.cjs` | Internal | Green | The derived trees could only be hand-edited, which their next run would revert |
| `check-agent-mirror-sync.cjs` | Internal | Green | Body drift between the two authored trees would go unchecked |
| The `.pi` `PERMISSION_TOOL_MAP` | Internal | Green | The `# Unmapped` rule could not be stated as a contract |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A mirror gate or the deep-loop suite fails in a way the change caused.
- **Procedure**: Revert the canonical and `.claude` bodies together, regenerate both derived trees, and drop the two `leaf-scopes.json` files; the generator's fallback walk restores the previous manifests byte-for-byte for the scoping-free hubs.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Scopes + collision check ──┐
                           ├──► Manifest regeneration ──► Router reachability ──► Crosswalk and README pointers ──► Verification
Contract licensing ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scopes + collision check | None | Manifest regeneration |
| Contract licensing | None | Manifest regeneration (regenerated trees) |
| Manifest regeneration | Scopes, licensing | Router reachability |
| Router reachability | Manifest regeneration | Verification |
| Crosswalk and README pointers | None | Verification |
| Verification | All | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scopes + collision check | High | 3-4 hours |
| Contract licensing | Low | 1 hour |
| Manifest regeneration | Low | 1 hour |
| Router reachability | Med | 1-2 hours |
| Crosswalk and README pointers | Med | 1-2 hours |
| Verification | Med | 1 hour |
| **Total** | | **8-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the change set: the two agent bodies and the two regenerated trees, the crosswalk, its README pointers, and the two `leaf-scopes.json` files
2. Regenerate both manifests; the generator's fallback walk reproduces the pre-scoping bytes for every hub
3. Re-run the mirror gates, the freshness gate and the deep-loop suite
4. No stakeholder notification is needed; the affected surfaces are developer-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
