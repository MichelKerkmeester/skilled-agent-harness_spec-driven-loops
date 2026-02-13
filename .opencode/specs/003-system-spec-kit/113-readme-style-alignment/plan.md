# Implementation Plan: README Style Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | N/A |
| **Storage** | File system |
| **Testing** | Manual verification |

### Overview
Apply 7 style rules from readme_template.md to 75 active README.md files using a 3-wave agent delegation strategy. Each wave processes a subset of files with 5 parallel agents for maximum throughput. Final verification via 10-file spot-check ensures ≥90% compliance.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (≥90% compliance)
- [x] Dependencies identified (specs 111 & 112 complete)

### Definition of Done
- [x] All 75 active READMEs processed
- [x] Verification spot-check passes (≥90%)
- [x] All discovered issues fixed
- [x] Spec folder documentation complete

---

## 3. ARCHITECTURE

### Pattern
Batch Processing with Wave Parallelism

### Key Components
- **Wave Controller**: Orchestrates 3 sequential waves of 5 agents each
- **File Processors**: Individual agents applying 7 style rules per file
- **Verification Layer**: 10-file spot-check for quality assurance

### Data Flow
1. Input: 75 README.md file paths grouped into 3 waves
2. Processing: Each wave dispatches 5 agents in parallel
3. Verification: Random 10-file sample checked for compliance
4. Remediation: Fix discovered issues
5. Output: 75 aligned READMEs with ≥90% compliance

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Wave 1 — mcp_server/lib/*
- [x] 25 files in `mcp_server/lib/` subdirectories
- [x] 5 agents processing 5 files each
- [x] Apply all 7 style rules
- [x] Preserve anchors and content

### Phase 2: Wave 2 — mcp_server/ + scripts/ + shared/
- [x] 24 files across `mcp_server/` remaining, `scripts/*`, `shared/*`
- [x] 5 agents processing ~5 files each
- [x] Apply all 7 style rules
- [x] Preserve anchors and content

### Phase 3: Wave 3 — templates/ + skill roots + top-level
- [x] 26 files in `templates/*`, skill roots, top-level directories
- [x] 5 agents processing ~5 files each
- [x] Apply all 7 style rules
- [x] Root README.md does NOT get YAML frontmatter (outside `.opencode/skill/`)

### Phase 4: Verification & Remediation
- [x] Random 10-file spot-check
- [x] Verify 7 rules per file (70 total checks)
- [x] Fix discovered issues (7 items failed, fixed immediately)
- [x] Final compliance: 90% (63/70 checks passing)

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spot-Check | 10 random files (70 rule checks) | Manual review |
| Compliance | ≥90% pass rate (63/70) | Visual inspection |
| Regression | Anchor preservation | Grep for anchor tags |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 111 (Anchor Schema) | Internal | Complete | Anchors must exist before alignment |
| Spec 112 (Memory README) | Internal | Complete | Establishes precedent for style rules |
| readme_template.md | Reference | Available | Source of truth for 7 style rules |

---

## 7. ROLLBACK PLAN

- **Trigger**: >10% compliance failure or widespread anchor destruction
- **Procedure**: Git revert batch commits, re-run waves with corrected rules

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
