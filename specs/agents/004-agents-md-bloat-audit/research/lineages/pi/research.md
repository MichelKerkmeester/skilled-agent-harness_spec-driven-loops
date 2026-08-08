# Deep Research: AGENTS.md Bloat Audit — Ranked Findings Report

Lineage: `pi` (fan-out) | Session: `fanout-pi-1786112914544-75cprl` | Spec: `specs/agents/004-agents-md-bloat-audit` | Stop: maxIterations (5)

## 1. Executive Summary

Root `AGENTS.md` (555 lines, 47,110 bytes) carries **~75 removable physical lines (≈13.5%)** through deduplication and pointer substitution, plus **~35–40 line-equivalents of byte-only compression** and ~20 tokens of emoji decoration. The dominant bloat pattern is **internal redundancy** (same rule stated in 2–3 places) and **distilled duplication of authoritative files** whose pointers are broken or verbose. The top 7 candidates (Tier 1) deliver ~54 of the 75 lines with low risk. All normative constraints (Four Laws, gates, verification standards) are preserve-set; no candidate removes a unique rule.

## 2. Methodology

Read-only audit over 5 iterations: (1) structural inventory + redundancy scan; (2) authoritative-source substitution scan with file-existence verification of all 16 referenced paths; (3) prose-compression scan + passage-level verification of substitution claims; (4) low-value boilerplate scan + physical-vs-byte savings correction; (5) final ranking with recounted line arithmetic (50+44+33+22+51 = 200 lines audited via `nl -ba`). Savings ledger uses **physical lines only** (whole-line removals/merges); paragraph shortening counts as byte-only.

## 3. Baseline

| Section | Lines | Content |
|---|---|---|
| Header + Multi-Repo | 1–14 | title, architecture, Iron Law |
| §1 CRITICAL RULES | 15–122 (108) | laws, locks, mandates, operating discipline |
| §2 MANDATORY GATES | 123–226 (104) | gates 1–4, post-execution gates |
| §3 SPEC FOLDER DOC | 227–270 (44) | levels, phase parent, naming |
| §4 EXECUTION & QUALITY | 271–336 (66) | behavior, anti-patterns, lenses |
| §5 TOOLS & MCP ROUTING | 337–404 (68) | tools, git safety, search, MCP |
| §6 STARTUP & RESUME | 405–432 (28) | recovery, daemon CLI table |
| §7 CONFIDENCE | 433–455 (23) | thresholds, escalation |
| §8 COMMUNICATION | 456–488 (33) | writing, honesty, turn framing |
| §9 AGENT & SKILL ROUTING | 489–527 (39) | agent dirs, skill contracts |
| §10 QUICK REFERENCE | 528–555 (28) | workflow table |

## 4. Ranked Findings (the deliverable)

### Tier 1 — internal dedup / pointer substitution (low risk, ~54 lines)

| # | ID | Candidate | Span | Savings | Rationale |
|---|---|---|---|---|---|
| 1 | F2-4 | §3 Spec Folder Documentation → pointer to system-spec-kit SKILL.md | L227–270 | ~14 | Level table + phase-parent + naming rules are condensed copies of SKILL.md (538L, 5 content hits). Keep level table, collapse the rest to pointers. |
| 2 | F1-2/F2-2 | Daemon CLI guidance consolidated | L138, L358–361, L416–431 | ~11 | Same warm-only/exit-75 semantics in 3 places; ENV-REFERENCE.md L684/694–698 is authoritative. Keep one merged table. L138 is a 457-char command monster. |
| 3 | F2-3 | §5 MCP Tool Routing → compact table + config pointers | L383–404 | ~10 | 22 lines restate registrations already in opencode.json/.claude/mcp.json/.codex/config.toml (verified). |
| 4 | F1-3 | Final-State + Completion Verification gates merged | L193–212 | ~7 | Both gates mandate final-state artifact check + authoritative-gate rerun + no stray files; merge skeletons, keep distinct step-1 mechanics. |
| 5 | F4-7/F3-6 | §9 advisor-metadata paragraph compressed | L516–527 | ~5 | 12 lines of skill-authoring detail (placement, mode routing, fleet audit); keep ~6 lines + existing pointer. |
| 6 | F4-3 | §1 Dispatch Rules rows → rule + pointer each | L65–77 | ~4 | 4 of 5 rows summarize contracts whose authoritative files exist (with corrected paths per F1-1). |
| 7 | F4-4 | §10 rows drop inline mechanics | L543–552 | ~4 | "/memory:manage → stats, health..." etc. restate the commands themselves; keep command + outcome. |

### Tier 2 — cross-file duplication, keep salience (moderate risk, ~17 lines)

| # | ID | Candidate | Span | Savings | Rationale |
|---|---|---|---|---|---|
| 8 | F1-5 | Ask-first rule merged with VIOLATION RECOVERY | L165–167 + L214–216 | ~3 | Same "ask, don't act" rule in two adjacent gate blocks. |
| 9 | F2-1 | Git Workspace Safety 6 rows → 3 | L352–357 | ~3 | Row content passage-verified as condensed from sk-git docs (rbp.md L17/27–30); keep worktree-choice + push-allowlist. |
| 10 | F2-5 | Gate 3 edge paragraphs | L181–187 | ~3 | Router-commands + child-dispatch-exemption restate classifier contract (TS, 887L). |
| 11 | F4-1 | Header routing prose (L7–9) → 1 line + pointer; Iron Law L11 untouched | L7–12 | ~2 | The Universal-Framework paragraph duplicates sk-code SKILL.md §2 SMART ROUTING (L48); the Iron Law (L11) is unique and preserve-set. |
| 12 | F1-6 | Code-search bullet L375 removed | L375 | ~2 | "Follow the Grep, Glob, and Read routes above" duplicates the decision-tree table L364–372. |
| 13 | F1-8 | §9 validate.sh block → pointer | L499–501 | ~2 | Same `validate.sh --strict` command as §2 L204. |
| 14 | F4-6 | Directive Capsule → 2 lines | L406–409 | ~2 | Restates the hook injection contract it points to. |

### Tier 3 — small fixes (~4 lines)

| # | ID | Candidate | Span | Savings |
|---|---|---|---|---|
| 15 | F1-7 | memory_search scope note L373 (dup of L340) | L373 | ~1 |
| 16 | F1-4 | Resume-ladder row L531 (dup of L414) | L531 | ~1 |
| 17 | F4-5 | Comment-hygiene row → pointer with fixed path | L62–63 | ~1 |

### Byte-only (0 physical lines)

- F3-1..F3-8: paragraph compression of L78, L112, L138, L211, L289, L451–455, L463–466, L485 (~35–40 line-equivalents of tokens).
- F4-2: emoji prefixes on 10 headings (~20 tokens).

## 5. Eliminated Alternatives (negative knowledge)

| Approach | Reason Eliminated | Evidence | Iteration |
|---|---|---|---|
| Replace Gate 3 prose entirely with classifier pointer | gate-3-classifier.ts is a TS module, not human-readable; prose is the prompt-time companion contract | file:.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts | 2 |
| Treat §2 Post-Save Review (L188–191) as duplication of generate-context.js | script emits no POST-SAVE QUALITY REVIEW (grep: 1 unrelated hit); staleness, not duplication | command: grep generate-context.js | 3 |
| Count F3-* paragraph compression as line savings | single physical lines; compressing saves bytes/tokens only | command: grep anchors L78,112,211,289,485 | 4 |
| Remove emoji headings as a ranked line-saving candidate | zero physical-line savings | file:AGENTS.md headings | 4 |
| Treat §10 Quick Reference / §9 agent table as bloat | all targets verified to exist; high-value router (0 savings) | commands/deep/research.md, four agent dirs | 2 |

## 6. Preserve Set (do NOT remove)

- Four Laws (L22–30), PLAN-WORKFLOW LOCK (L32–39), Halt Conditions (L41–46) — unique normative hard blockers.
- Gate 1–4 prose (L127–170) — prompt-time companion contract.
- §1 Verification Standards + Task-specific proof tables (L90–108) — high decision value, unique.
- §4 Anti-Patterns + Analysis Lenses (L305–335) — unique normative content.
- §7 Confidence Framework (L433–455), §8 Communication Quality (L456–488).
- §10 rows as pointers (F2-7).
- All content whose referenced files are broken (F1-1) gets pointer FIXES, never deletion.

## 7. Open Questions / Risks

- **F2-6 staleness (flagged, not resolved):** §2 Post-Save Review (L188–191) describes output generate-context.js does not emit. If the MCP `memory_save` path emits it, keep and re-anchor; else remove — needs human verification. 4 lines at risk.
- **Pointer-following reliability:** compressing guardrail detail into pointers assumes consumers read pointers. Mitigation: keep rule headlines salient (Tier 2 keeps the two most load-bearing git rows).
- **F1-1 must be fixed in the same pass** as F4-3/F4-5: all 7 `constitutional/*.md` paths are broken; authoritative copies live at `.opencode/skills/system-spec-kit/constitutional/`.

## 8. Convergence Report

```
CONVERGENCE REPORT
------------------
Stop reason: maxIterationsReached (policy: max-iterations; convergence treated as telemetry)
Iterations completed: 5
Questions answered: 5/5
Average newInfoRatio trend: 1.00 → 0.80 → 0.55 → 0.45 → 0.15 (monotonic decline; territory exhausted)
Composite stop score: n/a (telemetry-only lineage)
Signals: Rolling Avg n/a (threshold never applied); ratios declined below 0.05 threshold at run 5 — would have stopped at run 5 anyway
Legal-stop gates: not applied (fan-out contract)
Graph gates: not_applicable
```

## 9. References

- file:AGENTS.md (audit target, full read; all line anchors)
- file:.opencode/skills/system-spec-kit/SKILL.md; file:.opencode/skills/sk-code/SKILL.md §2; file:.opencode/skills/sk-git/references/remote-branch-policy.md
- file:.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md L684/694–698; file:.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts; file:.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js
- config: opencode.json, .claude/mcp.json, .codex/config.toml, .utcp_config.json
- commands: awk/nl -ba/grep/sed/wc/find/ls evidence recorded per finding in iterations/iteration-00N.md
