# Iteration 2 — Wave 1 (generate) — seat gpt-1 (openai/gpt-5.5-fast, variant high)

- Lens: hook-architecture-parity
- Status: complete | exit=0 | duration=174s | findings=5 | newInfoRatio=0.64
- Focus: Which ponytail hook points could sk-code / sk-code-review adopt; map onto existing hook surface.
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only)
- EVIDENCE CAVEAT: external/ponytail-main is gitignored, so this seat's ponytail evidence is from prompt-described behavior; local sk-code hook evidence is from on-disk files (hooks.md, claude-posttooluse.sh). Cross-verify in round 2 reads the actual ponytail hooks.

## Seat output

**Evidence Caveat**
The requested `external/ponytail-main/...` files were not present in this checkout; narrow `**/*ponytail*` lookup also found no matches. Ponytail evidence below is therefore from the prompt-supplied behavior, while local hook evidence is from `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh`, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`, and `.opencode/skills/sk-code/references/opencode/shared/hooks.md`.

**Hook Mapping**
1. Ponytail `SessionStart` mode activation + flag file
Opportunity: `sk-code` can prime the session with detected surface, language, and verification commands before first edit.
New behavior: model-visible startup context like `SURFACE=OPENCODE`, language route, mandatory commands, comment-hygiene reminder.
Target: `.opencode/skills/sk-code/scripts/hooks/sk-code-session-prime.sh`, wired from `.claude/settings.local.json` `SessionStart`, `.codex/settings.json` `SessionStart`, and optionally `.opencode/plugins/sk-code.mjs` for OpenCode.
Additive: yes. Current `claude-posttooluse.sh` only reacts after `Write|Edit` and only warns on comment hygiene (`claude-posttooluse.sh:34-89`). Existing runtime hook surface has `SessionStart` entrypoints, but owned by system-spec-kit, not sk-code behavior (`hooks.md:72-82`, `hooks.md:106-115`).

2. Ponytail flag file for persistent mode
Opportunity: remember `sk-code` verification intensity or selected surface for the session.
New behavior: prompt turns can reuse “strict verification”, “review-only”, or “surface locked to OPENCODE” without re-detecting every time.
Target: `.opencode/skills/sk-code/scripts/hooks/sk-code-mode-tracker.sh`, state under a runtime cache path, not a repo-visible dirty flag if avoidable.
Additive: medium. Existing review cache in `sk-code-review` already persists PR review signatures, but not runtime mode. Existing PostToolUse hygiene has no session state.
Risk: high if it writes a repo flag every session; prefer cache/tmp or managed `.opencode/.sk-code-runtime-state.json` only if explicitly accepted.

3. Ponytail `UserPromptSubmit` rule injection
Opportunity: inject matched surface standards just-in-time from prompt/target path.
New behavior: if the prompt says “edit `.opencode/skills/.../*.ts`”, inject OPENCODE TypeScript standards and verification; if “review”, inject findings-first baseline.
Targets: `.opencode/skills/sk-code/scripts/hooks/sk-code-user-prompt-submit.sh`; `.opencode/skills/sk-code-review/scripts/hooks/sk-code-review-user-prompt-submit.sh`; wiring via `.claude/settings.local.json` and `.codex/settings.json` `UserPromptSubmit`.
Additive: partly. The event is already wired for system-spec-kit (`hooks.md:76-79`, `hooks.md:110-114`), but not for these skills. It is not redundant with comment hygiene because that is post-write only and non-blocking.

4. Ponytail OpenCode plugin per-turn system-prompt injection
Opportunity: OpenCode-native parity where `.opencode/plugins/sk-code.mjs` injects a compact ruleset every turn.
New behavior: OpenCode receives persistent `sk-code`/`sk-code-review` guidance even when Claude/Codex settings hooks do not apply.
Target: `.opencode/plugins/sk-code.mjs` delegating to `.opencode/skills/sk-code/scripts/hooks/sk-code-context.mjs`; optional `.opencode/plugins/sk-code-review.mjs`.
Additive: high for OpenCode. Local `hooks.md` documents Claude/Codex/Copilot runtime hook wiring, not OpenCode plugin parity (`hooks.md:54-59`, `hooks.md:199-208`).
Risk: token bloat and drift from SKILL.md unless injected content is short and generated from one source.

**Integration Risk**
Hooks are dynamic-only: reachability lives in settings, not imports (`hooks.md:23-28`, `hooks.md:62-68`). Any new hook must update source, compiled/dist or executable path, and runtime wiring. Cross-runtime parity is manual; adding Claude does not add Codex/OpenCode (`hooks.md:199-208`). Maintenance cost is real across `.opencode/.claude/.codex`: OpenCode plugin shape differs from Claude/Codex settings, and local evidence currently documents Claude/Codex/Copilot rather than OpenCode plugin wiring.

```json
{
  "seat": "gpt-1",
  "lens": "hook-architecture-parity",
  "findings": [
    {
      "id": "F1",
      "title": "Session-start surface priming",
      "ponytail_source": "external/ponytail-main/hooks/ponytail-activate.js",
      "target": "sk-code:.opencode/skills/sk-code/scripts/hooks/sk-code-session-prime.sh",
      "mechanism": "Ponytail activates mode at SessionStart and injects the active ruleset before work begins.",
      "recommendation": "Add a sk-code SessionStart hook that detects surface/language and returns compact verification commands; wire it in .claude/settings.local.json hooks.SessionStart, .codex/settings.json hooks.SessionStart, and OpenCode via .opencode/plugins/sk-code.mjs if plugin parity is required.",
      "value": "high",
      "effort": "M",
      "integration_risk": "Medium: hook source is runtime-loaded via settings/plugin wiring, not imports; must maintain Claude, Codex, and OpenCode entries separately.",
      "redundant_with": "none",
      "confidence": "medium"
    },
    {
      "id": "F2",
      "title": "Prompt-time standards injection",
      "ponytail_source": "external/ponytail-main/hooks/ponytail-mode-tracker.js",
      "target": "sk-code:.opencode/skills/sk-code/scripts/hooks/sk-code-user-prompt-submit.sh",
      "mechanism": "Ponytail handles UserPromptSubmit to detect commands/mode and persist prompt-relevant mode.",
      "recommendation": "Add a UserPromptSubmit hook that injects only the matched sk-code surface standards and verification checklist for the current prompt/target path; wire through .claude/settings.local.json and .codex/settings.json UserPromptSubmit.",
      "value": "high",
      "effort": "M",
      "integration_risk": "Medium: event exists in Claude/Codex settings, but behavior would be skill-specific and must fail open without blocking prompts.",
      "redundant_with": "system-spec-kit user-prompt-submit entrypoint exists, but does not provide sk-code surface standards",
      "confidence": "medium"
    },
    {
      "id": "F3",
      "title": "Review-intent prompt hook",
      "ponytail_source": "external/ponytail-main/hooks/hooks.json",
      "target": "sk-code-review:.opencode/skills/sk-code-review/scripts/hooks/sk-code-review-user-prompt-submit.sh",
      "mechanism": "Ponytail maps prompt events to mode-specific context injection.",
      "recommendation": "Add a sk-code-review UserPromptSubmit hook that only fires on review/audit/PR-review intent and injects the findings-first final-line contract plus baseline security/correctness minimums; wire in Claude and Codex UserPromptSubmit settings.",
      "value": "medium",
      "effort": "S",
      "integration_risk": "Medium: useful only when review intent is reliably classified; false positives could pollute implementation prompts across runtimes.",
      "redundant_with": "none",
      "confidence": "medium"
    },
    {
      "id": "F4",
      "title": "OpenCode plugin parity",
      "ponytail_source": "external/ponytail-main/.opencode/plugins/ponytail.mjs",
      "target": "sk-code:.opencode/plugins/sk-code.mjs",
      "mechanism": "Ponytail injects its ruleset into the OpenCode system prompt every turn through a plugin.",
      "recommendation": "Add a small OpenCode plugin that injects a bounded sk-code/sk-code-review context block and delegates rule text generation to skill-local scripts; keep Claude/Codex hook wiring separate.",
      "value": "high",
      "effort": "M",
      "integration_risk": "High: OpenCode plugin architecture is a separate runtime surface from .claude/.codex settings, so parity requires a third implementation and drift tests.",
      "redundant_with": "none",
      "confidence": "medium"
    },
    {
      "id": "F5",
      "title": "Avoid repo-dirty active flag",
      "ponytail_source": "external/ponytail-main/hooks/ponytail-config.js",
      "target": "sk-code:.opencode/skills/sk-code/scripts/hooks/sk-code-mode-tracker.sh",
      "mechanism": "Ponytail writes an active flag file to remember mode/state.",
      "recommendation": "Do not adopt a repo-visible .sk-code-active flag by default; if mode persistence is needed, use a managed runtime cache for verification intensity or review-only mode.",
      "value": "medium",
      "effort": "S",
      "integration_risk": "High: session-start writes can dirty the repo and must be replicated or intentionally omitted across OpenCode, Claude, and Codex.",
      "redundant_with": "none",
      "confidence": "medium"
    }
  ],
  "newInfoRatio": 0.64,
  "negative_knowledge": [
    "Do not treat the existing PostToolUse comment-hygiene hook as hook-architecture parity; it is post-edit, warn-only, and scoped to comments.",
    "Do not duplicate full SKILL.md content into every prompt turn; inject compact, generated summaries to avoid token bloat and drift.",
    "Do not add Claude-only hooks and call parity complete; hooks.md states runtime wiring is explicit per runtime.",
    "Do not adopt a repo-visible active flag unless the team accepts session-start file churn."
  ]
}
```