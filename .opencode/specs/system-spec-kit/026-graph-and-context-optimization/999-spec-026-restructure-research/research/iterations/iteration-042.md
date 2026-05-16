# Iter 042 — Track 11: adversarial review of phase-parent classifications

## Per-parent adversarial findings

### 014-local-llama-cpp (iter 007-010)
- Catalog completeness check: miss-3-children
- Classification accuracy check: flags
- Overlap detection check: missed-overlap
- Phase-list quality: weak
- Evidence per flag: directory-state check found 63 direct `NNN-*` children, while SWE reports "58 NNN-name directories + 2 placeholders" and later "Current: 60 children" (`iteration-007.md:5`, `iteration-010.md:87`, `iteration-010.md:105`). The classification is explicitly partial for packets 019-059, then still feeds final dispositions (`iteration-008.md:130`, `iteration-008.md:318`). Several "load-bearing" calls are surface-level heuristics, using "typically load-bearing" rather than packet evidence (`iteration-008.md:181-188`, `iteration-008.md:193-215`). The proposed list double-assigns `058-skill-md-realignment` to both Phase 9 and Phase 10 (`iteration-010.md:47-48`, `iteration-010.md:82`) and omits/underspecifies actual children visible in the directory listing such as `028-local-llm-feature-test-suite`, `029-post-027-findings-remediation`, `036-failed-embedding-cleanup-retry`, and `045-shared-daemon-suite-runner` from the phase accounting (`iteration-010.md:37-48`, `iteration-010.md:87-94`).

### 013-doctor-update-orchestrator (iter 011-014)
- Catalog completeness check: pass
- Classification accuracy check: flags
- Overlap detection check: pass
- Phase-list quality: weak
- Evidence per flag: directory-state check found 5 direct `NNN-*` children, matching SWE's 5-child catalog (`iteration-011.md:17`, `iteration-011.md:41-49`). The weak spot is the proposal's value: it reduces only 5 NNN packets to 4, while counting deletion/movement of non-NNN `review/` and `review_archive/` as part of the reduction (`iteration-014.md:49-60`, `iteration-014.md:64-77`). Classification also leaves an unresolved load-bearing ambiguity: `002` is "not load-bearing" because it targets old invocation forms, but SWE separately asks whether the sandbox should be updated before becoming load-bearing again (`iteration-012.md:73`, `iteration-013.md:118`). That should be a review flag, not a settled archival classification.

### 007-code-graph (iter 015-018)
- Catalog completeness check: pass
- Classification accuracy check: flags
- Overlap detection check: missed-overlap
- Phase-list quality: shuffles-problems
- Evidence per flag: directory-state check found 40 direct `NNN-*` children, matching SWE's direct catalog (`iteration-015.md:15`, `iteration-018.md:164-166`). Classification accuracy is not consistently grounded: SWE declares an evidence standard of at least 2 file-line references per classification (`iteration-016.md:20`), but classifies `037` and `038` as delete candidates while saying they were "Not directly read" (`iteration-016.md:321-331`). There is also an internal contradiction for `036`: it is classified load-bearing (`iteration-016.md:314`), then archived under Phase 007 as part of comprehensive review (`iteration-018.md:153-157`, `iteration-018.md:286-296`). The phase list says "No consolidation opportunity" for distinct load-bearing early packets, then consolidates eight of them into one broad "Foundational Code Graph Capability" phase (`iteration-018.md:111-116`, `iteration-018.md:186-188`). That reduces count, but increases recall ambiguity.

### 009-hook-parity (iter 019-022)
- Catalog completeness check: pass
- Classification accuracy check: flags
- Overlap detection check: pass
- Phase-list quality: shuffles-problems
- Evidence per flag: directory-state check found 8 direct `NNN-*` children, matching SWE's catalog (`iteration-019.md:15-26`, `iteration-022.md:85-88`). Classification needs review because SWE first catalogs `002` and `005` as `in_progress`, then later asserts both are complete and instructs metadata correction (`iteration-019.md:20`, `iteration-019.md:23`, `iteration-020.md:45`, `iteration-020.md:87`, `iteration-022.md:141-143`). The phase-list quality is weak for Phase 001: SWE says runtime-specific packets have "distinct runtime-specific contracts" and "no consolidation opportunity", but still collapses `001-005` into one phase (`iteration-022.md:54-60`, `iteration-022.md:107-110`). That risks hiding the very runtime-specific recall path SWE says must remain visible.

## Summary
- Phase parents reviewed: 4
- Per-parent verdict: 014-local-llama-cpp override; 013-doctor-update-orchestrator flag-for-review; 007-code-graph override; 009-hook-parity flag-for-review
- Highest-impact corrections needed: fix 014 child accounting from 60 to 63 and re-run phase mapping; reverse or re-justify 007 archive/delete decisions for unread or internally contradictory packets, especially 036-038; make phase lists preserve retrieval keys instead of creating broad buckets that hide runtime or subsystem-specific recall paths.

## JSONL delta row
{"iter_id": "042", "timestamp_utc": "2026-05-16T03:46:46Z", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "findings_count": 11, "overrides_count": 2, "primary_evidence_files": ["iter-007..022"]}