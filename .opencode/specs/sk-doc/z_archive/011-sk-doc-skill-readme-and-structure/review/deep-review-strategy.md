# Deep Review Strategy

## Review Charter

**Target:** specs/sk-doc/z_archive/011-sk-doc-skill-readme-and-structure
**Type:** spec-folder (phase parent — review ALL 4 child phases plus parent coordination)
**Dimensions:** correctness, security, traceability, maintainability
**Max Iterations:** 10
**Convergence Threshold:** 0.10

## Known Context

### Target Structure
Phase parent containing 4 child phases under `.opencode/specs/sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/`:

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-sk-doc-reference-relocation/` | Active | Move sk-doc references/specific to references root |
| 2 | `002-sk-doc-skill-readme-asset/` | Draft | Create dedicated sk-doc skill README asset |
| 3 | `003-markdown-agent-rename/` | Complete | Rename create agent to @markdown across runtimes |
| 4 | `004-sk-doc-playbook-markdown-agent-coverage/` | Active | Add 06--agent-dispatch playbook scenarios |

### Prior Review Context
- Phase 003 has completed 4-iteration deep review at `003-markdown-agent-rename/review/` — findings from that review are available as cross-reference context
- Known pre-existing findings:
  - F-001 [P1]: cli-codex non-interactive @markdown dispatch ergonomics gap (SD-019 FAIL evidence from 004/implementation-summary.md)
  - F-002 [P2]: opencode --agent general subagent-fallback message
  - F-003 [P2]: sk-doc compact-changelog vs Keep-a-Changelog format mismatch

### resource-map.md Status
resource-map.md not present at parent level; skipping coverage gate.

## Review Scope Files
37 files across parent + 4 child phases (specs, plans, tasks, checklists, implementation summaries, resource maps, metadata, prior review artifacts, evidence files).

## Cross-Reference Targets

### Core Protocols
- **spec_code**: Cross-check each child spec.md requirements against their implementation-summary.md evidence
- **checklist_evidence**: Verify checklist items are marked with evidence

### Overlay Protocols
- **skill_agent**: Verify agent routing references across sk-doc skill and @markdown agent
- **agent_cross_runtime**: Verify @markdown agent consistency across .opencode/, .claude/, .gemini/, .codex/ runtimes
- **feature_catalog_code**: Cross-reference spec feature claims against actual code/artifacts
- **playbook_capability**: Verify playbook scenarios reference the correct agents and CLIs

## Dimension Queue
1. **Iteration 0 (Inventory Pass):** Build artifact map and complexity estimates
2. **Correctness:** Logic, spec/impl alignment, handoff criteria
3. **Security:** No secrets, no credential exposure, agent write-scope boundaries
4. **Traceability:** Spec-to-code cross-referencing, requirement traceability, handoff verification
5. **Maintainability:** Documentation quality, dead code, self-documentation, naming consistency
