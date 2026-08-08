# Iteration 2: Authoritative-Source Substitution Scan

## Focus
Quantify AGENTS.md blocks that duplicate content already authoritative in referenced files (skills, references, configs, machine contracts) and could shrink to pointers.

## Findings

1. **F2-1. §5 Git Workspace Safety (L343–357, 15 lines) duplicates sk-git reference docs.**
`sk-git/references/remote-branch-policy.md` (108 lines; 12 hits for allowlist/ask-before) and sibling references (worktree-workflows.md, finish-workflows.md, commit-workflows.md — all present in `ls`) are the authoritative, more detailed contracts. The AGENTS.md block condenses them. Keep the two load-bearing guardrails salient (ask-first worktree choice; push allowlist), but the owner-branch grammar, allocate-never-count, and hyphen-pilot paragraphs can collapse to pointers. Savings: ~6–8 lines. [SOURCE: file:AGENTS.md:343-357; ls .opencode/skills/sk-git/references/; grep -c remote-branch-policy.md]

2. **F2-2. §6 Daemon CLI table (L416–431) duplicates ENV-REFERENCE.md.**
`system-spec-kit/mcp-server/ENV-REFERENCE.md` (799 lines; 9 mentions of spec-memory.cjs/skill-advisor.cjs/warm-only/exit-75) is the authoritative daemon contract. The §6 table (16 lines incl. fence) is a distilled copy; §5 L358–361 already points at it. Merge the two rows into a compact 4-line quick-reference + pointer. Savings: ~8–10 lines (overlaps F1-2 — count once). [SOURCE: file:AGENTS.md:416-431; grep -c ENV-REFERENCE.md]

3. **F2-3. §5 MCP Tool Routing (L383–404, 22 lines) duplicates the runtime configs.**
Verified against actual configs: `opencode.json` (83 lines; sequential_thinking + mk-spec-memory + more), `.claude/mcp.json` (61 lines; mk-spec-memory, mk_skill_advisor, code_mode — no sequential_thinking, matching the claim), `.codex/config.toml` (38 lines; mk-spec-memory, mk-skill-advisor, code-mode), `.utcp_config.json` (258 lines; Code Mode chain). The prose inventory is a readable cross-runtime summary not present in any single file, but the per-runtime registration detail duplicates the configs. Compress to ~10–12 lines: keep the two-system split + one compact registration table + pointers. Savings: ~10 lines. [SOURCE: file:AGENTS.md:383-404; head opencode.json; grep .claude/mcp.json; grep .codex/config.toml]

4. **F2-4. §3 Spec Folder Documentation (L227–270, 44 lines) duplicates system-spec-kit SKILL.md.**
`system-spec-kit/SKILL.md` (538 lines; 5 hits for Documentation-Levels/spec.md-plan.md-tasks.md content) owns the full contract: §1 When to Use, §3 How it Works, §4 Rules, plus templates directory. The doc-levels table, phase-parent mode, mandatory-metadata, rules-and-paths, and naming-convention sections in AGENTS.md are condensed copies. Keep the level table (needed at decision time) + one pointer; phase-parent and naming subsections shrink to 2–3 lines each. Savings: ~12–15 lines. [SOURCE: file:AGENTS.md:227-270; grep -c system-spec-kit/SKILL.md]

5. **F2-5. §2 Gate 3 prose (L142–202, 60 lines) partially duplicates gate-3-classifier.ts.**
`system-spec-kit/shared/gate-3-classifier.ts` (887 lines; classifyPrompt present) is the authoritative machine contract — AGENTS.md already says so at L142. The prose is the prompt-time human companion and must largely stay; the most compressible parts are the "Router commands" paragraph (L197–199) and the "Autonomous child-dispatch exemption" (L200–202), which restate routing rules documented in the classifier's spec. Savings: ~6–10 lines. [SOURCE: file:AGENTS.md:142-202; grep -c gate-3-classifier.ts]

6. **F2-6. §2 Memory Save Rule "Post-Save Review" (L166–171) duplicates generate-context.js behavior.**
`system-spec-kit/scripts/dist/memory/generate-context.js` (824 lines) owns save mechanics and emits its own post-save quality review. The AGENTS.md HIGH/MEDIUM/PASSED remediation table restates script behavior. Compress to 1–2 lines. Savings: ~3–4 lines. [SOURCE: file:AGENTS.md:158-171; wc -l generate-context.js]

7. **F2-7. §10 Quick Reference rows are valid pointers, NOT bloat.**
Every row target exists: `commands/deep/research.md` (179 lines; maxIterations/convergenceThreshold confirmed), sk-code, sk-git, sk-prompt, sk-doc, system-deep-loop, system-spec-kit, sk-design, memory MCP. This table is high-value routing — no savings recommended. [SOURCE: grep -c .opencode/commands/deep/research.md]

8. **F2-8. §9 Agent Routing table pointers valid.**
All four runtime agent dirs exist (.opencode/agents, .claude/agents, .codex/agents, .pi/agents — confirmed). Table is compact and accurate; no savings. [SOURCE: ls of the four agent dirs]

## Sources Consulted
- bash: existence+size sweep of 16 referenced paths; grep coverage counts (ENV-REFERENCE, remote-branch-policy, classifier, SKILL.md, deep/research.md); head opencode.json; grep .claude/mcp.json + .codex/config.toml server names
- file:AGENTS.md (re-read §3, §5, §6, §9, §10 for line-precise claims)

## Assessment
- **newInfoRatio: 0.8** — 6 new substitution findings (F2-1..F2-6); F2-7/F2-8 refine the pointer-validity theme from iteration 1.
- Confidence: high; every authoritative file's existence and coverage verified by command output.
- Caveat: F2-2/F2-5 savings overlap partially with F1-2/F1-8 — final ranking must dedupe by line range.

## Reflection
What worked: verifying each substitution candidate against the actual authoritative file's size/content before claiming duplication — three claims were validated as non-duplicates (F2-7, F2-8, classifier companion role).
What failed / ruled out: "replace Gate 3 prose entirely with classifier pointer" — ruled out: the classifier is a TS module, not human-readable; prompt-time prose is the companion contract (F2-5 keeps it, shrinks edges only).

## Recommended Next Focus
Iteration 3: Prose-compression scan — quantify over-long prose blocks per section (paragraph-level line efficiency), targeting the largest sections (§1 108 lines, §2 104, §4 66, §5 68) with per-block compression estimates.
