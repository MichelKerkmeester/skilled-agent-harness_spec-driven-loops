# Iteration 4: Low-Value Boilerplate Scan + Physical-Line Accounting Correction

## Focus
Identify blocks with near-zero decision value for an LLM consumer (header, emoji decoration, dispatch-rule detail, §10 inline mechanics) and correct the savings ledger: compression inside a single physical line saves bytes, not lines.

## Findings

1. **F4-0. Accounting correction — physical vs byte savings.**
F3-2..F3-5, F3-7, F3-8 (L211, L112, L485, L78, L289, L451-455, L463-466) are single physical lines (confirmed by grep anchors); compressing them yields 0 physical-line savings (byte/token savings only). F1-5's range corrected: the ask-first paragraph is L165–167 (Gate 3 tail), restated by VIOLATION RECOVERY L214–216 — overlap confirmed. F1-8's first instance is L204 (Completion Verification step 1). Revised ledger: only whole-line removals/merges count. [SOURCE: command: nl -ba AGENTS.md L168-178; grep anchors]

2. **F4-1. Header architecture block (L7–12) duplicates sk-code SKILL.md.**
The "Universal Framework" paragraph (L9, 3 lines) restates `.opencode/skills/sk-code/SKILL.md` §2 SMART ROUTING (L48+ confirmed iter 2). Compress to 1 line + pointer. Savings: ~2–3 physical lines. [SOURCE: file:AGENTS.md:7-12]

3. **F4-2. Emoji-decorated headings ×10 (L15, L123, L227, L271, L337, L405, L433, L456, L489, L528).**
Each heading carries an emoji prefix (§1 🚨, §2 ⛔, §3 📝, §4 🛠️, §5 🧭, §6 🔄, §7 🧑‍🏫, §8 🗣️, §9 🤖, §10 📋). Zero physical-line savings; ~10–20 tokens and visual noise only. Byte-level candidate, lowest priority. [SOURCE: file:AGENTS.md heading lines]

4. **F4-3. §1 Dispatch Rules table (L65–77, 13 lines) row detail duplicates constitutional/skill contracts.**
4 of 5 rows (CLI dispatch, Small-model, Fable, Open Design) summarize contracts whose authoritative files exist (F1-1: cli-dispatch-skill-preload.md, fable-subagent-model-policy.md confirmed under spec-kit/constitutional/). Row detail compressible to rule + pointer. Savings: ~4–5 physical lines. [SOURCE: file:AGENTS.md:65-77]

5. **F4-4. §10 rows carry inline mechanics duplicating their commands/sections.**
"/memory:manage → stats, health, cleanup, retention..." (L551–552), "Claim completion" (L543–544, restates §2 gates), "End session" (L545–546, restates memory-save), "Save context" (L544–545). Rows can shrink to command + 3-word result. Savings: ~3–4 physical lines. [SOURCE: file:AGENTS.md:543-552]

6. **F4-5. §1 comment-hygiene row (L62–63) duplicates comment-hygiene.md.**
The 2-line rule + pointer ("See constitutional/comment-hygiene.md" — broken path, F1-1) duplicates the authoritative file at `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` (exists, iter-2 ls). Savings: ~1 physical line after fixing the pointer. [SOURCE: file:AGENTS.md:62-63]

7. **F4-6. §6 Directive Capsule (L406–409, 3 lines) restates the hook injection contract.**
The capsule paragraph mirrors `.opencode/hooks/injection-contract.md` (referenced in-file). Compressible to 1 line. Savings: ~1–2 physical lines. [SOURCE: file:AGENTS.md:406-409]

8. **F4-7. §9 "Advisor metadata placement" (L516–527, 12 lines) is deep skill-authoring detail.**
The placement rules, mode-registry routing, and fleet-audit pointer serve skill creation — an infrequent activity at root-doc scope. Compressible to ~6 lines + existing pointer. Savings: ~5–6 physical lines (overlaps F3-6; counted once). [SOURCE: file:AGENTS.md:516-527]

**F4-8. Revised deduped physical-line ledger (whole-line removals/merges only).**
F1-2/F2-2 daemon consolidation ~8–10; F1-3 verification-gate merge ~6–8; F1-4 resume ladder ~2–3; F1-5 ask-first merge ~5–7; F1-6 code-search bullet ~2–4; F1-7 memory note ~1–2; F1-8 validate.sh pointer ~2–3; F2-1 git table rows ~3–4; F2-3 MCP routing ~8–10; F2-4 §3 spec docs ~10–14; F2-5 Gate-3 edges ~3–5; F4-1 header ~2–3; F4-3 dispatch rows ~4–5; F4-4 §10 rows ~3–4; F4-5 comment row ~1; F4-6 capsule ~1–2; F4-7 advisor para ~5–6. **Total ≈ 70–90 physical lines (13–16% of 555)**, plus ~30–40 byte-only lines from F3-* compression. [SOURCE: derived from registry findings with dedupe]

## Sources Consulted
- commands: nl -ba AGENTS.md L1-14, L168-178; grep -n anchors for all F3 blocks
- file:AGENTS.md full read (in-context) for boilerplate judgment
- file:.opencode/skills/sk-code/SKILL.md §2 (iter-2 confirmation)

## Assessment
- **newInfoRatio: 0.45** — 7 new/refined boilerplate findings; F4-0 is the iteration's most valuable output (corrects the savings ledger semantics). Mostly refinement of mapped territory.
- Confidence: high on line anchors; savings estimates are ±2 lines, now explicitly physical-line semantics.

## Reflection
What worked: the physical-vs-byte distinction forced by the advisory makes the final ranking defensible — every listed saving is a whole-line removal/merge.
What failed / ruled out: emoji removal (F4-2) ruled out of the ranked list as byte-only; §10 wholesale removal ruled out (it is the router contract, F2-7).

## Recommended Next Focus
Iteration 5: Final ranking and preserve-set — dedupe all findings by line range, rank by physical-line savings ÷ risk, define the preserve list (normative constraints), and sanity-check the total against the 555-line baseline.
