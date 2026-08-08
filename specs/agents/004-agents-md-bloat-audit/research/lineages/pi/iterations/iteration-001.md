# Iteration 1: Structural Inventory & Cross-Section Redundancy Scan

## Focus
Baseline the document's section map and locate near-duplicate blocks across the 10 sections with exact line ranges and overlap quantification.

## Findings

1. **F1-1. All 7 `constitutional/*.md` references are dangling — authoritative copies live under system-spec-kit.**
AGENTS.md cites `constitutional/comment-hygiene.md` (L63), `constitutional/cli-dispatch-skill-preload.md` (L66), `constitutional/fable-subagent-model-policy.md` (L70), `constitutional/regression-baseline-and-delta.md` (L176), `constitutional/finding-is-a-hypothesis.md` (L181), `constitutional/gate-tool-routing.md` (L363), `constitutional/main-branch-direct-push.md` (L354). None exist at repo root (confirmed: no `constitutional/` dir). All 7 exist at `.opencode/skills/system-spec-kit/constitutional/` (confirmed by `ls`: cli-dispatch-skill-preload.md, comment-hygiene.md, fable-subagent-model-policy.md, finding-is-a-hypothesis.md, gate-tool-routing.md, main-branch-direct-push.md, regression-baseline-and-delta.md). Impact: every offload pointer is broken; the "content already authoritative elsewhere" pattern fails in practice. Line count: ~7 pointer lines affected (no savings from fixing, but it unblocks candidates F3-*).

2. **F1-2. Daemon CLI fallback guidance appears 3×.**
L138 (Gate 2) embeds the full `skill-advisor.cjs` command inline; L358–361 (§5 "Daemon-Backed CLI Fallbacks") restates warm-only semantics + exit 75; L416–431 (§6 "Daemon CLI Transport Fallback") carries the canonical table with both commands. L138's inline command and L358–361's 4-line teaser duplicate §6. Savings: ~10–12 lines by keeping only §6 + one pointer. [SOURCE: file:AGENTS.md:138, :358-361, :416-431]

3. **F1-3. Final-State Verification vs Completion Verification Rule overlap (~10 lines).**
§2 Final-State Verification (L172–185, 14 lines: artifact exists at exact path → rerun authoritative gate → inspect scoped diff/no stray files) and §2 Completion Verification Rule (L187–197, 11 lines: validate.sh --strict → checklist → reconcile metadata) are two adjacent verification gates with overlapping step-1 semantics. Merge into one gate with two check lists. Savings: ~8–10 lines. [SOURCE: file:AGENTS.md:172-197]

4. **F1-4. Resume ladder duplicated across §6 and §10.**
§6 Recovery Flow step 1 (L414: `/speckit:resume` → `handover.md` → `_memory.continuity` → canonical spec docs) is restated verbatim as §10 Quick Reference row 1 (L531). Savings: ~3–4 lines. [SOURCE: file:AGENTS.md:414, :531]

5. **F1-5. Gate 3 "ask first" stated twice.**
L199–201 ("Ask first, then act... The answer applies for the ENTIRE session") vs L204–209 (VIOLATION RECOVERY: "Before I proceed, I need to ask about documentation:" → ask → wait). Same rule, two adjacent blocks. Savings: ~6–8 lines by merging. [SOURCE: file:AGENTS.md:199-209]

6. **F1-6. Code-search routing guidance appears 3×.**
§5 decision tree table (L364–372: Grep exact/Glob known path/Concept→grep→glob→read/Bug→grep), §5 Terminal Command Discipline bullet (L375: "Follow the Grep, Glob, and Read routes above"), §4 research-first (L283: "Read the actual code, docs, and local instructions first"). The §5 bullet duplicates the table's intent. Savings: ~4 lines. [SOURCE: file:AGENTS.md:283, :364-372, :375]

7. **F1-7. `memory_search` scope caveat duplicated.**
L340 ("Note: `memory_search` indexes spec docs and saved memory, not arbitrary code.") appears again at L373 in the decision tree note. 2 lines, one of them removable. [SOURCE: file:AGENTS.md:340, :373]

8. **F1-8. `validate.sh <spec-folder> --strict` command duplicated.**
L191 (Completion Verification Rule) and L499–501 (§9 Template & Validation Requirements) both mandate the identical strict-validation invocation. Savings: ~2–3 lines by pointing from §9 to §2. [SOURCE: file:AGENTS.md:191, :499-501]

9. **F1-9. Baseline section map (for savings math in later iterations).**
Header L1–14 (14 lines); §1 L15–122 (108); §2 L123–226 (104); §3 L227–270 (44); §4 L271–336 (66); §5 L337–404 (68); §6 L405–432 (28); §7 L433–455 (23); §8 L456–488 (33); §9 L489–527 (39); §10 L528–555 (28). Total 555 lines / 47,110 bytes. [SOURCE: command: awk section scan]

## Sources Consulted
- file:AGENTS.md (full read, 555 lines)
- bash: awk section-line scan; grep -c phrase counts; ls .opencode/skills/{sk-code,sk-git,sk-git/references}; ls .opencode/skills/system-spec-kit/constitutional/; find for constitutional files
- file:.opencode/skills/sk-code/SKILL.md (heading scan: §2 SMART ROUTING at L48 — pointer valid)
- file:.opencode/skills/sk-git/references/remote-branch-policy.md (108 lines — exists, pointer valid)

## Assessment
- **newInfoRatio: 1.0** — first pass; the section map, dangling-reference discovery, and 9 structural findings are all new to this packet.
- Confidence: high (all line ranges verified by awk/grep output).

## Reflection
What worked: line-anchored phrase counting surfaced duplication quickly; verifying referenced-file existence flipped two "pointer to authoritative" assumptions (constitutional paths broken; sk-code/sk-git pointers valid).
What failed / ruled out: nothing ruled out yet. Word-level diffing of §6 vs §5 daemon text not needed — line ranges + phrase overlap suffice for savings estimates.

## Recommended Next Focus
Iteration 2: Authoritative-source substitution scan — for each AGENTS.md block that summarizes an existing skill/reference/constitutional file, quantify the lines replaceable by corrected pointers (candidates: Git Workspace Safety → sk-git, Gate 3 → spec-kit classifier, Memory Save → generate-context contract, daemon tables → ENV-REFERENCE).
