# Iteration 5: General chat UI/UX and visual polish patterns

## Focus

Q5: Which Claude/GPT (and peer) chat UI/UX visual patterns transfer to Pi Remote’s restrained-token, one-accent, light/dark, prefers-reduced-motion design?

## Actions Taken

1. Re-read Pi Remote `style.css` token system and compose/transcript styles.
2. Cross-walk 044 transcript/compose findings with Claude/GPT mobile chat ergonomics.
3. Extract transferable layout, streaming feel, empty states, and motion rules that fit React Aria + one accent.

## Findings

### F-019: Composer as a sticky bottom dock with control strip

- **Source:** Claude/ChatGPT mobile keep input docked above the home indicator; controls sit in a thin strip by Send. [SOURCE: https://usingclaude.com/en/guides/features/claude-app-model-effort-thinking-settings] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1232-1295] [SOURCE: 044 research compose Send/Steer]
- **Pattern:** Safe-area padded dock; growing textarea; trailing primary Send; leading/secondary chips for model/effort/plan.
- **Why it helps:** One-thumb reach; matches modern AI apps without dashboard chrome.
- **Apply:** Extend `.prompt-composer-footer` into a two-row strip on narrow widths: row1 = model/effort/plan chips; row2 = hint + Send. Keep `--radius-control`, `--accent` for Send only.

### F-020: Turn hierarchy + calm streaming, not neon tokens

- **Source:** [SOURCE: file:specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md] (turn-oriented typed blocks; two-state live edge) [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1119-1170] [SOURCE: style.css thinking/plan block styles]
- **Pattern:** Claude/GPT show user bubbles vs assistant prose; Pi Remote should keep typed-block semantics but borrow spacing rhythm: more air between turns, denser inside tool disclosures.
- **Why it helps:** Long agent transcripts need scannability without party-colored cards.
- **Apply:** Increase inter-turn gap via `--space-6`; keep tool/usage collapsed defaults from 044; live edge = following vs “N new · Jump to latest” (044 F). Streaming caret/opacity pulse only under `@media (prefers-reduced-motion: no-preference)` using `--duration-fast`.

### F-021: Empty state as capability runway, not a blank void

- **Source:** Claude/GPT empty chats offer starter prompts; Claude Code mobile requests quick-action chips. [SOURCE: iteration-003 F-011] [SOURCE: App.tsx empty-transcript]
- **Pattern:** Replace “No transcript blocks…” with short guidance + 3 chips: e.g. Plan this task, Review last change, What’s the agent doing — chips only fill drafts or send allowlisted `/` commands.
- **Why it helps:** First-run teachability for model/effort/plan controls.
- **Apply:** `empty-transcript` becomes a quiet card on `--surface` with kicker + chips; no illustrations that fight the one-accent system.

### F-022: Typography and color — deepen hierarchy without new accents

- **Source:** [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1-66] — already has canvas/surface/ink/accent OKLCH tokens, light/dark, mono for code.
- **Pattern:** GPT/Claude use clear user vs assistant contrast; Pi can use weight/size, not a second brand color.
- **Why it helps:** Feels “app-like” while staying restrained.
- **Apply:** User text blocks: slightly raised `--surface-raised` + stronger weight; assistant: flat surface; meta (usage/tool): `--ink-muted`. Keep single `--accent` for focus, Send, and active Plan/Model selection rings only.

### F-023: Motion — presence, not decoration

- **Source:** style.css `--duration-fast`/`--duration-state`; 044 reduced-motion guidance; React Aria disclosures.
- **Pattern:** 2–3 intentional motions: (1) composer focus ring, (2) plan-pill appear/disappear, (3) jump-to-latest button fade. No continuous glow, no purple gradients, no emoji.
- **Why it helps:** Matches “modern AI app” feel without violating prefers-reduced-motion or design constraints.
- **Apply:** CSS transitions on opacity/transform only; `@media (prefers-reduced-motion: reduce)` → instant state swaps.

### F-024: Ruled out — multi-color message bubbles / glassmorphism / floating promo chips

- **Why ruled out:** Conflicts with one-accent token system and 044 anti-clutter; would make tool/plan/thinking blocks harder to parse.

## Assessment

- **newInfoRatio:** 0.72
- **Novelty justification:** Concrete dock layout + empty-state chips + token-preserving hierarchy/motion rules bridging Claude/GPT feel to existing Pi Remote CSS — without re-litigating 044 IA.
- **Confidence:** High on apply steps; visual claims about Claude/GPT are pattern-level (not pixel audits of private app binaries).

## Recommended Next Focus

Synthesis — consolidate Q1–Q5 into adoption-ordered recommendations for the lineage `research.md`.
