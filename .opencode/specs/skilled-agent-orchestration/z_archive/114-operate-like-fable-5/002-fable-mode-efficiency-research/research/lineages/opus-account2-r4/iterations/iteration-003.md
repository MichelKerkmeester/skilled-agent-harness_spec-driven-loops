# Iteration 3: SURFACE MAP — adjustable Public-repo surfaces × read-reliability per runtime

## Focus
Q3 (SURFACE MAP): inventory every adjustable Public-repo surface that could carry a fable-5 delta and rate its **read-reliability per runtime** (OpenCode / Claude / Codex), **repo-verified** rather than taken from the spec's enumeration. Read-reliability = probability the surface is in-context at decision time. Decay = loses salience as context grows (the G2 problem).

## Repo verification (evidence gathered this iteration)
- **AGENTS.md ≡ CLAUDE.md, 424 lines each, byte-identical** — `wc -l` = 424/424; `diff -q AGENTS.md CLAUDE.md` clean. ~76-line headroom under the ~500-line soft budget round-1's changelog references (round-1 left the Public file at 447 then it settled at 424 here — note: the round-1 changelog said 447, the live file is 424; the budget headroom claim holds either way). [SOURCE: wc -l AGENTS.md CLAUDE.md; diff -q]
- **16 constitutional rules + README** in `.opencode/skills/system-spec-kit/constitutional/`: automated-writers-never-overwrite-manual, bash-output-truncation-verdict-visibility, cli-dispatch-skill-preload, code-graph-scope-intent, comment-hygiene, deep-skill-workflow-required, entity-cooccurrence-is-not-causal, finding-is-a-hypothesis, gate-enforcement, gate-tool-routing, main-branch-direct-push, memory-system-spec-kit-only, post-implementation-deep-review, regression-baseline-and-delta, spec-folder-naming, verify-before-completion-claims. [SOURCE: ls constitutional/*.md]
- **The live `UserPromptSubmit` hook is firing on THIS session.** `.claude/settings.json:14-20` registers `node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` (present, 1221 bytes) — a thin shim that delegates to `.opencode/skills/system-skill-advisor/mcp_server/dist/hooks/claude/user-prompt-submit.js` (present, 8069 bytes) [SOURCE: settings.json:14-20; user-prompt-submit.js:5-9]. **Empirical proof:** this very session's injected `UserPromptSubmit hook additional context` carried `Advisor: live; ...` AND the `Comment hygiene [HARD BLOCK]` constitutional reminder. **The thermostat the opus source describes is already running in our repo, and it already carries a constitutional line — the ride-along is proven, not hypothetical.**
- **12 agents × 3 runtime mirrors:** `.opencode/agents/*.md`=12, `.claude/agents/*.md`=12, `.codex/agents/*.toml`=12. The git status shows `.github/workflows/agent-mirror-sync.yml` is itself under edit — i.e. the repo runs an automated mirror-sync, so agent-prompt edits MUST route through it, not be hand-applied to one mirror. [SOURCE: ls .opencode/.claude/.codex agents; git status]
- **Enforcement surfaces exist** in `.opencode/skills/deep-loop-runtime/lib/deep-loop/`: `executor-config.ts`, `prompt-pack.ts` (renderPromptPack), `post-dispatch-validate.*`, `executor-audit.ts` (10 .ts files total). These are where a mechanism/measurement gets *enforced* rather than *advised*. [SOURCE: ls lib/deep-loop/*.ts; grep renderPromptPack/post-dispatch]

## Sharper staleness finding (independent contribution)
The AGENTS.md dead-pointer is **not a never-written doc** — it is a **hyphen/underscore naming-convention drift**. `AGENTS.md:217` cites `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` (HYPHENS), which does not exist; the real files are `skill_advisor_hook.md` and `skill_advisor_hook_validation.md` (UNDERSCORES) [SOURCE: grep skill-advisor-hook.md AGENTS.md:217; ls references/hooks/]. CLAUDE.md, being byte-identical, carries the same dead pointer. This is exactly the rot F6 says to convert into a check — and it is *sharper* than "missing file": the doc exists, the reference is wrong, so a grep-test that asserts every `references/.../*.md` pointer in AGENTS.md resolves would catch it (and the fix is a one-character-class edit, not authoring a doc).

## Read-reliability matrix

| Surface | OpenCode | Claude | Codex | Decay | Subagent-visible | Note |
|---|---|---|---|---|---|---|
| AGENTS.md / CLAUDE.md §1-7 (the setpoint) | HIGH | HIGH | HIGH | **YES** (G2) | partial | 424-line byte-synced twins; ~76-line headroom; loses salience as context grows |
| Live `UserPromptSubmit` hook reminder (the thermostat) | runtime-dep | **HIGHEST** | runtime-dep | **NO** | **NO** (main-session only, G2/reinject.sh:8-9) | already firing on Claude + already carries a constitutional line = proven ride-along |
| Constitutional memories (16) | MED | MED-HIGH | MED | partial | via memory_search | durable auto-surface; any rule wired into the hook → HIGH |
| Agent prompts (12 × 3 mirrors) | HIGH (that agent) | HIGH | HIGH | low | **YES — the only subagent surface** | must route through agent-mirror-sync.yml; 3-mirror drift risk |
| Skills (sk-code, sk-prompt, sk-doc, sk-git, deep-loop-workflows, system-spec-kit, system-skill-advisor) | LOW-MED | LOW-MED | LOW-MED | n/a | when invoked | high leverage, conditional on invocation |
| Commands (deep/*, speckit/*, memory/*) | HIGH when invoked | same | same | n/a | n/a | governs one workflow only when run |
| deep-loop runtime (executor-config / prompt-pack / post-dispatch-validate / executor-audit) | N/A (executable) | N/A | N/A | n/a | applies to every dispatch | where Tier-B/C become ENFORCED not advisory |
| skill-advisor scoring/triggers | N/A | N/A | N/A | n/a | affects what surfaces | indirect leverage on read-reliability itself |

## Conclusions
1. **The per-turn hook is the highest-read-reliability, decay-proof, low-blast surface** — but Claude-only (OpenCode/Codex unverified) and **subagent-blind**. It is the proven ride-along for a compact governor (rec #1).
2. **Subagents are governable only via agent prompts / `renderPromptPack`** (G2 subagent-blindness) — and any agent-prompt edit must route through `agent-mirror-sync.yml`, not be hand-applied.
3. **AGENTS.md is high-read but decays** (G2) — pair any doc-governor with the thermostat; never doc-only (that repeats round-1's advisory-only weakness).
4. **Constitutional rules are the durable, auto-surfacing home for doctrine** — and a rule wired into the hook becomes HIGH read-reliability.
5. **executor-config / prompt-pack / post-dispatch-validate / executor-audit are where Tier-B/C mechanisms+measurement get enforced** rather than advised — and `executor-audit.ts` is the attachment point for the carried codex follow-up (it already records the model; it just doesn't compare/fail-loud — see iter 5).

## Sources Consulted
- `AGENTS.md`, `CLAUDE.md` (wc, diff)
- `.opencode/skills/system-spec-kit/constitutional/*.md` (16 rules + README)
- `.claude/settings.json` (UserPromptSubmit hook config) + `dist/hooks/claude/user-prompt-submit.js` + `system-skill-advisor/.../user-prompt-submit.js`
- `.opencode/agents/`, `.claude/agents/`, `.codex/agents/` (12 each); `.github/workflows/agent-mirror-sync.yml` (git status)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/*.ts` (executor-config, prompt-pack, post-dispatch-validate, executor-audit)
- `references/hooks/` (the underscore/hyphen drift)
- This session's own injected `UserPromptSubmit hook additional context` (empirical thermostat proof)

## Assessment
- **newInfoRatio: 0.58** — Lower than the extraction iterations because some surfaces were pre-named in the 002 spec; but net-new this iteration: the read-reliability matrix itself, the empirical proof the thermostat fires on this session and carries a constitutional line, the agent-mirror-sync routing constraint, and the *sharper* dead-pointer finding (hyphen/underscore drift, not missing file).
- **Novelty justification:** moves from "what techniques exist" (iters 1-2) to "where can they live and be reliably read" — a different axis. The thermostat-is-live and underscore-drift findings are repo-verified facts no source-only read would produce.
- **Confidence:** HIGH for Claude-runtime claims (directly verified); MEDIUM for OpenCode/Codex hook read-reliability (marked runtime-dep; only the Claude wiring was opened).

## Reflection
- **What worked:** Verifying against the real repo not the spec's enumeration; using this session's own injected context as empirical proof the thermostat fires.
- **What failed:** The first verification bash batch was rejected by the shell-safety guard (compound piping); re-running as simpler single-purpose commands worked — tooling friction, not a research failure.
- **Ruled out:** AGENTS.md/CLAUDE.md as the *sole* governor home (decays); hand-editing one agent mirror without routing through agent-mirror-sync.yml (drift risk).

## Recommended Next Focus
Q4 (OPTIMIZE): consolidate F1–F15 + G1–G9 against the surface matrix into a ranked, tiered (A doctrine / B mechanism / C measurement) surface×delta recommendation set, scored leverage/(cost+blast), all deduped vs round 1; identify the efficiency core.
