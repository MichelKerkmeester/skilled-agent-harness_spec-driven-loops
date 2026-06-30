---
title: "Session Handover Document"
description: "Handover for Anobel bento-visuals (004): the visual set is complete and pushed to Open Design; the open thread is the deferred MiniMax-M3 'improve all visuals, adopt-if-better' sweep, now upgradeable to run behind the sk-design context-loading contract built in 029-038."
trigger_phrases:
  - "anobel bento visuals handover"
  - "resume 004 bento visuals"
  - "anobel open design continue"
  - "minimax improve visuals sweep"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "anobel.com/004-bento-visuals"
    last_updated_at: "2026-06-28T09:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored handover; visual set complete + pushed, improvement sweep deferred"
    next_safe_action: "Run the contract-backed improve-if-better sweep; re-push winners to OD"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "scratch/faithful-import/dist/bento-canvas.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "handover-anobel-004-bento-visuals"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Session Handover Document

Handover for Anobel bento-visuals (`anobel.com/004-bento-visuals`) so the next session can continue the Open Design work without re-deriving the operational mechanics.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

> **⚠️ WORKING METHOD — NON-NEGOTIABLE.** Every visual/UI change on this packet MUST be driven by `sk-design` and its sub-skills, properly paired with the transports. Never freehand a card. This pairing is the whole reason the `154-sk-design-parent/029-038` contract arc exists — it was skipped earlier in this session and produced wrong-style, contrast-failing output. Do not repeat that.
>
> - **`sk-design` = the design judgment (REQUIRED, loads first).** Before any design decision, load the right mode bundle: `interface` (direction + pre-flight) + `foundations` (color/contrast/tokens) + `audit` (evidence/scoring). Set the **register/dials first**, then apply the context-loading contract `.opencode/skills/sk-design/shared/context_loading_contract.md` — contrast-pair inventory computed with `design-foundations/scripts/contrast_check.py` (not eyeballed), the interface pre-flight card, and a filled proof-of-application card gated by `shared/scripts/proof_check.py`.
> - **`cli-opencode` = the dispatch transport (does NOT decide taste).** When dispatching a small model (MiniMax-M3 / Kimi K2.7) to generate or improve a visual, the prompt MUST carry the sk-design context manifest — use Template 16 in `cli-opencode/assets/prompt_templates.md` + the contract + the model's Design-Task variant — so the child loads `sk-design` and returns proof fields. Consult `sk-prompt-models` for the per-model recipe FIRST.
> - **`mcp-open-design` = the Open Design transport (does NOT decide taste).** It only moves artifacts in/out of OD. Any UI/design work through OD co-loads `sk-design`. Transport ≠ taste.
>
> Pairing in one line: **`sk-design` decides; `cli-opencode` dispatches; `mcp-open-design` ships** — and the contract + `proof_check.py` gate keep the dispatch honest.

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Continuing the Anobel bento-visuals Open Design work in a future session.

**Status:** in_progress (visual set complete + pushed; one improvement sweep deferred)
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-06-28 (SK DESIGN session)
- **To Session:** next Anobel/OD session
- **Phase Completed:** IMPLEMENTATION (faithful set complete + pushed); one improvement sweep DEFERRED
- **Handover Time:** 2026-06-28
- **Recent action:** Confirmed the visual set state; the design-production work was paused mid-session when the focus pivoted to the sk-design context-loading contract arc (separate packets `154-sk-design-parent/029-038`, now complete + on remote `028`).
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision | Rationale | Impact |
| --- | --- | --- |
| House style = "dashboard-fragment" card (560×480, page `#eceef0`, white card radius 22 NO border + soft 2-layer shadow, floating widget + title/desc + circular ghost ↗) | The earlier navy line-art was rejected as "wrong/bad style"; the high-end dashboard-fragment look is the approved direction | All cards; title weight normalized to 700, orange reserved (target 0), tabular-nums |
| Source HTML lives in repo, renders pushed to Open Design | OD is the deliverable surface; HTML is the editable source | `scratch/faithful-import/dist/*.html` → OD project artifacts |
| MiniMax-M3 used for parallel visual generation | Pay-per-token cart cards (`slimme-winkelwagen-mm-*`) proved viable with a tuned recipe | See §5 for the proven dispatch recipe |
| Improvement sweep DEFERRED, not abandoned | Session pivoted to building the sk-design contract; the sweep should now run behind that contract | The one open task (§3.2) |

### 2.2 Blockers Encountered
**Blockers:** none open. Operational gotchas resolved — see §2.4.

### 2.3 Files Modified
**Key files:** `scratch/faithful-import/dist/*.html` (the visuals), `implementation-summary.md` (state)

| File | Change Summary | Status |
| --- | --- | --- |
| `scratch/faithful-import/dist/` | 114 HTML files: the visual set + contact sheets (budgetteren ramp/dash, slimme-winkelwagen 1-5 + mm-1..6, smart-shopping 1-5 + dash, spot-*, *-dash feature cards, v1-v4 faithful, bento-canvas) | Complete |
| Open Design project `2078899e-aa23-41a8-a0ef-6bfcef9bebc5` | 39 artifacts pushed (Anobel — Faithful Prototypes) | Pushed |
| `implementation-summary.md` | Records the faithful set as Complete, browser-verified, `--strict` | Complete |

### 2.4 Traps & Scar Tissue
Carry these — they cost trial-and-error to nail.

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| --- | --- | --- | --- |
| OD `files write` "false FAIL" | Checking for `"ok":true` in output | load-bearing | `od files write` prints `[files] wrote X`, NOT `"ok":true`. Verify with a diff/read-back, not a string grep. |
| OD HTTP 413 on large pushes | Pushing a PNG/canvas > ~4MB via `files write` | load-bearing | Downscale PNGs with `sips -Z` (cards 620-780px, ramp 1000-1200px) to land under ~4MB. JPEG made flat-UI WORSE — stay PNG. |
| `od artifacts create --json` rejected | Passing `--json` | defensive | The flag doesn't exist; omit it. |
| MiniMax-M3 truncation / 0 writes | Generic frontier-style prompt | load-bearing | Use the recipe in §5: TIDD-EC + DENSE pre-plan, FORCE the Write tool, INLINE the shell, BAN inline-HTML, demand brevity. Without it: 5 reads / 0 writes / output truncated at 32k. |
| zsh word-splitting on file lists | `for f in $VAR` under zsh | defensive | Inline the file list directly in the loop, don't rely on `$VAR` splitting. |
| D-shackle reads as letter "U" | Drawing a maritime shackle glyph | defensive | Tilt it (omega/horseshoe bow + screw-pin + hex head, `rotate(-14 ...)`). |
| Register skipped / late contrast (the misses that spawned 029-038) | Doing design work without the contract | load-bearing | Now fixed at the skill level — see §5; route design dispatch through the new contract. |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** `scratch/faithful-import/dist/bento-canvas.html` (the consolidation board — shows the current set at a glance)
- **Next safe action:** run the deferred improvement sweep (§3.2 task 1) behind the new sk-design contract; write `-v2` candidates, never overwrite; A/B verify; promote only clear wins; re-push to OD.
- **Cold-read order:** 1. this `handover.md` → 2. `implementation-summary.md` (state + OD project id) → 3. `scratch/faithful-import/dist/bento-canvas.html` (the set) → 4. `.opencode/skills/sk-design/shared/context_loading_contract.md` (the contract the sweep now runs behind).
- **Context:** the visual set is DONE and pushed; the only open work is making selected visuals better, contract-backed.

### 3.2 Priority Tasks Remaining
1. **DEFERRED SWEEP — improve the existing visuals, adopt-if-better.** Operator authorized "All ~25". Run MiniMax-M3 (and/or Kimi K2.7) per-visual: produce a `-v2` candidate, score it against the original on the proof rubric, adopt only clear wins, re-push winners to OD. **Now contract-backed** (see §5) — each candidate returns proof fields + a verdict, A/B-checkable, instead of the thin dispatch originally planned.
2. Refresh `bento-canvas.html` after any adopted changes (downscale per §2.4).
3. Re-push adopted winners to OD project `2078899e-aa23-41a8-a0ef-6bfcef9bebc5` and re-verify (browser render + palette QA).

### 3.3 Critical Context to Load
- [ ] **MANDATORY working method — read §5.1 first.** All visual work runs the `sk-design` → `cli-opencode` → `mcp-open-design` loop; never freehand a card.
- [ ] **`sk-design` + sub-skills** — load the `interface + foundations + audit` bundle + `shared/context_loading_contract.md` (register/dials, contrast, pre-flight, proof) BEFORE any design decision (§5.1 Step 1).
- [ ] `implementation-summary.md` — `_memory.continuity` + OD project id + the faithful-set state.
- [ ] `spec.md` / `plan.md` — the bento-visual scope + the approved dashboard-fragment house style.
- [ ] `.opencode/skills/sk-design/shared/context_loading_contract.md` + the design dispatch template (cli-opencode `assets/prompt_templates.md` Template 16) + `sk-prompt-models/references/models/minimax-m3.md` (Design-Task Variant).
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Visual set complete + pushed to OD (39 artifacts)
- [x] Source HTML preserved in `scratch/faithful-import/dist/`
- [x] Operational mechanics captured (§2.4, §5)
- [x] Deferred task documented with the contract-backed upgrade path (§3.2, §5)
- [ ] Improvement sweep run (next session)
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes — operational playbook

### 5.1 The working loop — sk-design → cli-opencode → mcp-open-design (REQUIRED, run per visual)

This is the mandatory procedure for the improve-if-better sweep and for any new/edited visual. Roles never blur: **sk-design decides, cli-opencode dispatches, mcp-open-design ships.** Do every step; skipping the sk-design load is exactly the failure the `029-038` arc was built to prevent.

**Step 1 — Load `sk-design` + the mode bundle (BEFORE any design decision).** Read, in order:
- `.opencode/skills/sk-design/SKILL.md` — the hub router; it picks the bundle. For these dashboard tiles the bundle is `interface + foundations + audit`.
- `.../sk-design/shared/register.md` and `.../sk-design/shared/context_loading_contract.md` — the register + the contract (the routers now auto-load the contract via `DEFAULT_RESOURCE`, but load it explicitly when reading by hand).
- interface mode: `.../design-interface/SKILL.md`, `.../design-interface/references/design-process/brief_to_dials.md`, `.../design-interface/assets/interface_preflight_card.md`.
- foundations mode: `.../design-foundations/SKILL.md`, `.../design-foundations/references/color/oklch_workflow.md`, `.../design-foundations/assets/contrast_pair_inventory.md`.
- audit mode: `.../design-audit/SKILL.md`, `.../design-audit/references/audit_contract.md`, `.../design-audit/assets/audit_evidence_worksheet.md`.

**Step 2 — Set the REGISTER + DIALS first, and fill the context-loaded card.** These are in-app financial dashboard tiles → register = **Product**. Pick variance/motion/density (the existing set runs ~V4 / M2 / D6). The register gates palette dosage, density, motion budget, copy register, and anti-slop strictness — everything downstream inherits it. Write the filled `context_loaded_card.md` into the candidate's notes before any pixel.

**Step 3 — Dispatch the candidate via `cli-opencode`** (for MiniMax-M3 / Kimi K2.7 generation). Consult the model's profile in `sk-prompt-models/references/models/<model>.md` FIRST, then compose the prompt from `cli-opencode/assets/prompt_templates.md` **Template 16 (Design/UI dispatch)** + the contract manifest + the model's **Design-Task variant**. Exact invocation (no `--agent`, no `--variant`):
```bash
REPO="$(git rev-parse --show-toplevel)"
opencode run --model minimax/MiniMax-M3 --format json --dir "$REPO" "$PROMPT" </dev/null
# brand-illustration alternative: --model kimi-for-coding/k2p7  (COSTAR, hard read-cap, 1200s+ timeout)
```
The child MUST: set register/dials, run the contrast inventory, fill the pre-flight + proof-of-application cards, and **write `<visual>-v2.html` + `<visual>-v2.notes.md` to `scratch/faithful-import/dist/` — never touching the original.**

**Step 4 — Verify contrast deterministically** (a calculator, not eyeballs):
```bash
python3 .opencode/skills/sk-design/design-foundations/scripts/contrast_check.py "#0a1a2f" "#ffffff" "#787878" "#ffffff"   # exits non-zero on any body (<4.5:1) fail; also reports APCA Lc
```
Run it for every foreground/background pair the candidate uses. `#787878` fails body on white (4.42:1) — move body text to `#043367` (12.54:1).

**Step 5 — Gate the candidate:**
```bash
python3 .opencode/skills/sk-design/shared/scripts/proof_check.py scratch/faithful-import/dist/<visual>-v2.notes.md   # must exit 0 (all 4 proof fields present + verdict READY)
```
A non-zero exit means the candidate is NOT ready — do not adopt it.

**Step 6 — Render + QA both versions** (headless Chrome, see 5.3) and compare on the rubric in 5.6 (register honored / all contrast pairs pass / pre-flight SHIP / audit evidence labeled / on-brand palette / zero AI-tell).

**Step 7 — Adopt-if-better.** Only if the `-v2` clearly beats the original on the rubric: promote it (replace the original, keep the `-v2` as the record). Otherwise discard `-v2` and keep the original. Log the A/B verdict either way — no silent swaps.

**Step 8 — Ship via `mcp-open-design`** (transport only; see 5.2 for the `od` CLI). Push only adopted winners to OD project `2078899e-aa23-41a8-a0ef-6bfcef9bebc5`.

**Step 9 — Refresh `bento-canvas.html`** after the batch (downscale per 5.4) and re-push it.

### 5.2 Open Design (OD) transport
Proper route is the `mcp-open-design` skill (co-load `sk-design` — transport ≠ taste). Raw CLI used this session:
```bash
OD="node \"/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs\""
export OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock
PROJ=2078899e-aa23-41a8-a0ef-6bfcef9bebc5            # Anobel — Faithful Prototypes
# create (rejects existing path): od artifacts create --name X --input <file> --project $PROJ
# overwrite (prints "[files] wrote", NOT ok:true): od files write $PROJ <relpath> < <file>
# delete: od files delete $PROJ <name>
# ~4MB HTTP 413 limit on writes — downscale PNGs with sips -Z (see §2.4)
```

### 5.3 Headless render / QA
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --force-device-scale-factor=2 --window-size=560,480 \
  --screenshot=out.png --default-background-color=00000000 card.html
```

### 5.4 MiniMax-M3 / Kimi dispatch recipe (contract-backed)
- Invocation: `opencode run --model minimax/MiniMax-M3 --format json --dir <repo-root> "$PROMPT" </dev/null` (NO `--agent`, NO `--variant`).
- Prompt recipe (proven): TIDD-EC + DENSE pre-plan, FORCE the Write tool, INLINE any shell, BAN inline-HTML, demand brevity.
- **NEW (from 029-038):** wrap the dispatch in the design dispatch template (cli-opencode `assets/prompt_templates.md` Template 16) + the MiniMax-M3 Design-Task Variant + the context manifest. Require the agent to set REGISTER/DIALS first, run the contrast-pair inventory via `.opencode/skills/sk-design/design-foundations/scripts/contrast_check.py`, and emit a filled proof-of-application card. Gate each candidate with `.opencode/skills/sk-design/shared/scripts/proof_check.py <notes>.md` (exits non-zero unless complete + READY).
- Kimi K2.7 is a strong brand-illustration alternative (`kimi-for-coding/k2p7`, COSTAR, read-cap, 1200s+ timeout).

### 5.5 House style (the approved look)
Card 560×480, page `#eceef0`, white card radius 22 NO border + `box-shadow:0 1px 2px rgba(20,28,46,.04),0 26px 52px -22px rgba(20,28,46,.20)`; `.panel` white `#fefefe` + 1px `#ececec` border + ≤14px-blur shadow; `.title` 21px/700/`#0a1a2f`; floating widget on top, title/desc below, circular ghost ↗ bottom-right; `font-variant-numeric:tabular-nums`. Anobel palette: brand blue `#06458c` (deeper `#053b77`/`#043367`), green `#367e39`, red `#c9140f` (alerts only), gold `#dbab00` (rare), orange RESERVED (target 0), text `#0a1a2f` / muted `#787878`. Font: Hanken Grotesk.

### 5.6 Adopt-if-better rubric
Score `-v2` against the original; **promote only a clear win on every applicable row** (a tie or a regression on any row = keep the original):

| # | Criterion | Pass = |
| --- | --- | --- |
| 1 | Register honored | Product posture; density/motion/color dosage match the register, not louder |
| 2 | Contrast | every fg/bg pair passes `contrast_check.py` body 4.5:1 (or 3:1 large/UI), zero fails |
| 3 | Interface pre-flight | the binary card verdict is SHIP (no failing box) |
| 4 | Audit evidence | the five dimensions carry confirmed/inferred/not-assessed labels (no unsupported a11y/ready claim) |
| 5 | On-brand palette | brand blue carries weight; red alerts-only; gold rare; **orange count = 0**; out-of-palette hex = 0 |
| 6 | No AI-tell | no over-round (radius ≥24 on cards), no ghost-card tell (1px border + ≥16px-blur shadow on one element), no eyebrow-spam, no gradient/glass, title weight 700 not 800 |
| 7 | Proof gate | `proof_check.py <v2>.notes.md` exits 0 |

**Discipline:** write `-v2` candidates, never overwrite originals; record the per-row verdict; promote only clear wins; re-push winners to OD; refresh `bento-canvas.html`. No silent swaps, no silent caps — if you only sweep a subset, say which and why.
<!-- /ANCHOR:session-notes -->
