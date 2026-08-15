# Iteration 4: Plan-mode toggle and active-mode visibility

## Focus

Q4: How should a fast plan-mode toggle (`--plan` / plan-mode extension) be presented so active mode is always obvious?

## Actions Taken

1. Read pi plan-mode extension examples (`registerFlag("plan")`, `/plan`, status widget).
2. Read Claude Code permission-mode cycling (Shift+Tab, status bar `⏸ plan mode on`).
3. Read Cursor Plan Mode (Shift+Tab / mode picker; Build to exit).
4. Check Pi Remote session chrome for any mode indicator (none beyond agent running/idle).

## Findings

### F-014: Plan mode is an extension command + status, not a separate RPC verb

- **Source:** [SOURCE: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts] [SOURCE: https://cdn.jsdelivr.net/npm/@oh-my-pi/pi-coding-agent@17.2.12/examples/extensions/plan-mode.ts] [SOURCE: https://pi.dev/docs/latest/extensions]
- **Pattern:** Extension registers `--plan` flag, `/plan` command, optional shortcut; toggles active tools to read-only set; `ctx.ui.setStatus("plan-mode", …)` for footer; persists via `appendEntry`.
- **Why it helps:** Phone can toggle by submitting `/plan` through existing prompt path (F-010) without new mutation RPC — *if* the extension is loaded in the supervised child.
- **Apply:** Confirm plan-mode extension is installed in the relay’s pi child profile for desktop-parity. Expose a dedicated **Plan** toggle that submits `/plan` (or a future allowlisted `extension.invoke` if added). Reflect mode from status/events, not from optimistic UI alone.

### F-015: Always-visible mode chrome — badge beats hidden cycle

- **Source:** [SOURCE: https://code.claude.com/docs/en/permission-modes] (status bar labels like `⏸ plan mode on`) [SOURCE: https://www.learncursor.dev/learn/cursor-agents/agent-plan-mode] [SOURCE: https://handbook.reopt.ai/en/books/claude-code-advanced/plan-mode]
- **Pattern:** Claude Code shows an explicit status badge; Cursor uses a named mode picker. Both use Shift+Tab as accelerator, not as the only signal.
- **Why it helps:** Operators must never wonder whether writes are allowed — especially under full-access desktop-parity where the default is powerful.
- **Apply:** When plan mode is on, session title row shows a persistent pill: `Plan · read-only` using `--warning` token (already in `style.css`). Composer placeholder changes to “Describe what to plan…” vs “Send a prompt or steer…”. Toggle button is pressed/selected via React Aria `ToggleButton`.

### F-016: Touch primary = labeled toggle; keyboard cycle is optional

- **Source:** Same as F-015; Pi extension uses Ctrl+Alt+P / Shift+P variants.
- **Pattern:** Phone cannot depend on Shift+Tab. Prefer a durable control next to model/effort chips.
- **Why it helps:** One-thumb certainty; avoids overshooting multi-mode cycles.
- **Apply:** Composer chrome: `Plan` toggle. Long-press or `/` menu still exposes `/plan` and `/todos`. Do not implement a three-way permission cycle on mobile v1 — binary Plan vs Agent is enough for the pi extension’s model.

### F-017: Exit clarity — returning to agent mode must be as obvious as enter

- **Source:** Claude/Cursor require explicit exit (cycle away / Build). GitHub issues show stuck plan mode when toggled after skip-permissions. [SOURCE: https://automatelab.tech/blog/ai-coding/how-claude-code-plan-mode-works/]
- **Pattern:** Same control turns Plan off; banner remains until host confirms.
- **Why it helps:** Under full-access mode, silent exit would be dangerous; stuck-on is also dangerous.
- **Apply:** Toggle off sends `/plan` again (extension toggle). Keep warning pill until relay/session state confirms tools restored. If confirmation fails, show inline alert — never assume.

### F-018: Ruled out — starting a second session with `--plan` for every plan request

- **Why ruled out:** Pi Remote is single live session; spawning another child breaks the product model. Use in-session `/plan` toggle instead; `--plan` is for cold start only (ops/boot), not per-turn phone UX.

## Assessment

- **newInfoRatio:** 0.81
- **Novelty justification:** Maps pi extension semantics onto PWA toggle+pill chrome with host-confirmed state, rejecting multi-mode cycles and dual-session hacks.
- **Confidence:** High on UX; medium on exact status event field until relay projects extension status entries.

## Recommended Next Focus

Q5: General Claude/GPT chat visual + interaction polish transferable to Pi Remote’s token system, streaming transcript, and compose ergonomics.
