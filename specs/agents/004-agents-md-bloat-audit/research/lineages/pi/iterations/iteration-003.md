# Iteration 3: Prose-Compression Scan + Substitution-Claim Verification

## Focus
Per-block line-efficiency analysis of the largest sections (§1 108L, §2 104L, §4 66L, §5 68L), plus passage-level verification of the F2-1/F2-2/F2-6 substitution claims flagged as size-only evidence.

## Findings

1. **F3-0. Corrections to prior anchors (re-anchored with nl -ba).**
Memory Save Rule is L179–191 (not L158–171); Final-State Verification L193–200; Completion Verification L202–212; freshness paragraph L211; Violation Recovery L214–216. F1-3's range is corrected to L193–212 with revised savings (~6–8 lines: the two gates share a common skeleton — final-state artifact check + authoritative-gate rerun + no-stray-files — but their step-1 mechanics differ). [SOURCE: command: nl -ba AGENTS.md | sed -n '179,219p']

2. **F3-1. §2 Gate 2 fallback line (L138) is a 457-char command monster.**
Line 138 embeds the full `skill-advisor.cjs` invocation inline while §6 L428–429 carries the canonical table. Replace with a 1-line pointer. Savings: ~3 lines (overlaps F1-2; counted once in final ranking). [SOURCE: command: sed -n '138p' | wc -c = 457]

3. **F3-2. §2 Completion Verification freshness paragraph (L211) compresses ~60%.**
The 6-line paragraph (SPECKIT_COMPLETION_FRESHNESS / CONTINUITY_FRESHNESS / exit-2 semantics) can state the rule in ~2 lines: "Under --strict, stale completion metadata blocks (exit 2); SPECKIT_COMPLETION_FRESHNESS_ENFORCE only relabels warn→error." Savings: ~3–4 lines. [SOURCE: file:AGENTS.md:211]

4. **F3-3. §1 Blast-Radius "Sanitize by persistence boundary" bullet (L112) is ~2× too long.**
4-line bullet can halve: "Sanitize by persistence boundary — distinguish working-tree removal from sensitive-data eradication; no history/branch/reflog rewrites without named rollback + operator approval." Savings: ~2 lines. [SOURCE: file:AGENTS.md:112]

5. **F3-4. §8 closing caveat (L485) restates §1 "Two registers".**
"These shape delivery, not rigor..." (3 lines) overlaps the §1 two-registers guidance and §7 honesty rules. Savings: ~2 lines. [SOURCE: file:AGENTS.md:485]

6. **F3-5. §1 "Spend lavishly..." principle (L78) is metaphor-heavy.**
3-line aphorism can compress to ~1 line ("Prioritize verification where skipping it is deceptively cheap"). Savings: ~1–2 lines. [SOURCE: file:AGENTS.md:78]

7. **F3-6. §9 Advisor-metadata final paragraph (L522–527) compresses.**
The last ~3 lines restate the placement rule (parent-hub/standalone root, never mode/packet/shared) that the earlier sentence already gives. Savings: ~2–3 lines. [SOURCE: file:AGENTS.md:522-527]

8. **F3-7. §4 "Do not ask for permission to continue" bullet (L289) is padded.**
4-line bullet → 2 lines. Savings: ~2 lines. [SOURCE: file:AGENTS.md:289]

9. **F3-8. §7 Escalation + §8 Recommendations paragraphs.** Minor tightening, ~2 lines combined. [SOURCE: file:AGENTS.md:451-455, :463-466]

10. **Verification updates (passage-level): F2-1 CONFIRMED, F2-2 CONFIRMED, F2-6 DOWNGRADED.**

**F2-1 CONFIRMED.** AGENTS.md L356 push-row ("Ask before every push... Full contract: remote-branch-policy.md") is a condensed duplicate of `remote-branch-policy.md` L17 ("only a small allowlist of branches reach remote without asking; everything else needs a fresh, explicit yes for every push") and L27–28 (agent behavior + pre-push hook + SPECKIT_ALLOW_REMOTE_PUSH=1). Verbatim semantic match. Savings stands (~6–8 lines for the 6-row table vs sk-git docs). [SOURCE: file:AGENTS.md:352-357; file:.opencode/skills/sk-git/references/remote-branch-policy.md:17,27-30]

**F2-2 CONFIRMED (semantics).** ENV-REFERENCE.md L684 documents warm-only probe + exit 75 "which is the contract prompt-time hooks rely on" — the exact semantics AGENTS.md §5 L361 and §6 L416–431 restate. Flag tables L694–698 add the env-flag surface. The AGENTS.md §6 table's command strings remain the useful quick-reference; merged-row savings revised to ~6–8 lines (not 8–10). [SOURCE: file:.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:684,694-698]

**F2-6 DOWNGRADED — NOT VERIFIED.** `generate-context.js` (824 lines) contains NO "POST-SAVE QUALITY REVIEW" output (grep review|quality|POST-SAVE: 1 unrelated hit — L109 advisory-context note). The AGENTS.md L188–191 Post-Save Review block describes behavior not present in the cited script. This is a STALENESS candidate (4 lines describe a nonexistent output), not a duplication candidate. Savings withdrawn; flagged for the final report as accuracy risk. [SOURCE: command: grep -in "review\|quality\|POST-SAVE" generate-context.js]

## Sources Consulted
- commands: nl -ba AGENTS.md L179–219; grep -n anchors; sed -n '138p' | wc -c; grep ENV-REFERENCE daemon section; grep generate-context.js review/quality
- file:AGENTS.md (in-context full read for compression judgment)

## Assessment
- **newInfoRatio: 0.55** — 8 fresh compression estimates (refinements of known blocks), 2 substitution claims confirmed at passage level, 1 reversed (F2-6). The reversal is valuable negative knowledge.
- Confidence: high on anchors (nl -ba verified); compression estimates are judgment calls ±1 line, flagged as estimates.

## Reflection
What worked: the advisory's line-anchor challenge forced re-verification — three prior citations were wrong (F1-3 range, F2-6 attribution) and are now corrected in this iteration.
What failed / ruled out: F2-6's duplication theory — ruled out by grep; replaced with staleness theory. Full removal of §8 caveat ruled out (it carries the over-constraining-voice guard), reduced to trimming.

## Recommended Next Focus
Iteration 4: Low-value boilerplate scan — evaluate the header block, cross-reference tables, emoji/structure weight, §10 quick-reference density, and the "advisor metadata placement" style passages for decision value; also quantify the emoji-decorated headings cost.
