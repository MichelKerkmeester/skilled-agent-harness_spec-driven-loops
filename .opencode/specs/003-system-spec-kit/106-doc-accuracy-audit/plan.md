# Implementation Plan: Documentation Accuracy Audit — system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown / documentation audit |
| **Framework** | OpenCode agent dispatch (Task tool) |
| **Storage** | None — output is audit report |

**Overview**: Dispatch 20 parallel audit agents across 4 waves of 5 agents each. Each agent checks a batch of documentation files against filesystem reality, identifying outdated references, stale paths, inaccurate descriptions, and missing documentation resulting from the spec 104-105 JS-to-TS migration and module restructuring.

---

## 2. QUALITY GATES

**Ready When:**
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [ ] Spec 104-105 changes are merged and stable

**Done When:**
- [ ] All 176 files audited
- [ ] Consolidated audit report produced
- [ ] Zero files skipped

---

## 3. IMPLEMENTATION PHASES

### Wave 1: Core + References (Agents 1-5)
- [ ] Agent 1: Core files (SKILL.md, READMEs, package.json docs)
- [ ] Agent 2: Reference docs — memory subsystem
- [ ] Agent 3: Reference docs — spec-kit subsystem
- [ ] Agent 4: Reference docs — validation & scripts
- [ ] Agent 5: Reference docs — templates architecture

### Wave 2: References + Templates (Agents 6-10)
- [ ] Agent 6: Template level_1 files
- [ ] Agent 7: Template level_2 files
- [ ] Agent 8: Template level_3 and level_3+ files
- [ ] Agent 9: Template core and addendum files
- [ ] Agent 10: Constitutional and memory format docs

### Wave 3: Scripts + MCP Server (Agents 11-15)
- [ ] Agent 11: Script documentation (spec/ scripts)
- [ ] Agent 12: Script documentation (memory/ scripts)
- [ ] Agent 13: Script documentation (template/ scripts)
- [ ] Agent 14: MCP server tool documentation
- [ ] Agent 15: MCP server type and config documentation

### Wave 4: Agents + Commands + Guides (Agents 16-20)
- [ ] Agent 16: Agent definition files (.opencode/agent/)
- [ ] Agent 17: Command files (.opencode/command/spec_kit/)
- [ ] Agent 18: Command files (.opencode/command/memory/)
- [ ] Agent 19: Install guides
- [ ] Agent 20: Synthesis — consolidate all findings into final audit report

---

## 4. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Spec 104-105 completion | Green | Audit would find pre-cleanup state |

---

## 5. ROLLBACK

- **Trigger**: Not applicable — this is a READ-ONLY audit
- **Procedure**: No rollback needed; no files are modified
