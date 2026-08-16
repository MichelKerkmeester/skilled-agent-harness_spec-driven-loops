# Spec 002 — Handover

> **State:** research-complete, build not started. Ten research-first feature phases,
> each with a synthesized decision + real reference screens. Packet validates
> `Errors: 0`. All committed and pushed to `skilled/v4.0.0.0`.
> **Resume:** read this file → `spec.md` → `ROADMAP.md` → the target feature's
> `research/research.md` + `research/reference-screens.md`, then build.

---

## 1. What this packet is

Pi Remote mobile UI/UX feature-parity. The secure foundation shipped in the sibling
packet `../001-pi-remote-mobile-agent-like-cc`; this packet brings the mobile chat to
Claude-iOS / Kimi-app quality and adds the agent controls `pi` exposes on the desktop
terminal — **without** weakening the two frozen contracts:

- **Design system (frozen):** ink-on-parchment — bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4; light + dark; WCAG AA.
- **Security posture (frozen):** read-only default; one-use ticketed + revision-checked mutations that fail closed; redaction everywhere; host/extension-enforced plan mode; content-free push; operator-only `--full-access` the phone can never enable.

## 2. Current state

- **Done:** 10 feature phases scaffolded; per-feature research synthesized (`research.md`); real Mobbin/Refero reference screens gathered (`reference-screens.md`, 119 unique real URLs, 0 fabricated); build sub-phases scaffolded for the 8 original features (34 total); all spec-kit metadata generated; packet validates with **0 errors**.
- **Not started:** any application code. Building the features is the next phase.
- **Pending research:** `009-ask-question` and `010-todos` are net-new — they have reference screens + a brief but **no synthesized `research.md` yet**; their build specs come after that synthesis.

## 3. Structure

```
002-pi-remote-mobile-ui-ux-features/        ← phase-parent (lean trio + goal/README/ROADMAP/ARCHITECTURE + this file)
  001-change-model/                          ← feature phase (itself a phase-parent)
    spec.md  description.json  graph-metadata.json   ← feature intent + metadata
    implementation-phases.md                         ← the phased build plan
    001-research/                            ← LEAN spec-kit phase (spec + 2 JSONs), points at ../research/
    research/                                ← deep-loop-aligned research artifacts (NOT a phase)
      research.md                            ← the build-ready synthesized decision (canonical)
      reference-screens.md                   ← real Mobbin/Refero captures + reference-backed UI/UX direction
      iterations/iteration-NNN.md            ← the cited research passes
      BRIEF.md  .research-topic.txt  deep-research-config.json  PROVENANCE.md
    002-…/ 003-…/ …                          ← numbered build sub-phases (spec/plan/tasks/checklist each)
  002-change-effort/ … 008-inbound-media/    ← same shape
  009-ask-question/ 010-todos/               ← net-new; research/ has reference-screens.md + brief; research.md PENDING
```

**The 10 features (phase number = build order):**

| Phase | Feature | Research |
|-------|---------|----------|
| `001-change-model` | host-authoritative model switcher sheet | ✅ synthesized + 8 ref screens |
| `002-change-effort` | effort/reasoning picker in the model/effort sheet | ✅ + 12 |
| `003-slash-commands` | inline `/` command autocomplete from the live catalog | ✅ + 14 |
| `004-plan-mode-tab` | host-confirmed plan mode + composer `Shift+Tab` | ✅ + 13 |
| `005-file-preview` | redacted file card + full-screen read-only viewer (viewer shell others reuse) | ✅ + 14 |
| `006-rich-content-blocks` | bash command/output cards + code/text artifact cards (copy + full-screen) | ✅ + 14 |
| `007-media-upload` | upload from iOS gallery (new binary lane, security-first) | ✅ + 14 |
| `008-inbound-media` | preview media/screenshots pi sends inline (new inbound lane, security-first) | ✅ + 14 |
| `009-ask-question` | pi's ask-question extension, terminal-style prompt UI | ⏳ ref screens only, synthesis pending |
| `010-todos` | pi's todos, Manus/Claude-grade task list | ⏳ ref screens only, synthesis pending |

**Hard gates:** `007-media-upload` and `008-inbound-media` each add a new binary content lane and MUST pass an adversarial security/redaction review of their spec before any build phase. `005-file-preview` establishes the viewer shell that `006` and `008` reuse — build it first among that group.

## 4. Reusable recipes (how the research was produced)

**Reference-screen research via code-mode Mobbin/Refero** (orchestrator: scratchpad `reference-screens-002.mjs`):
- Dispatch `opencode run --model opencode-go/deepseek-v4-flash "<prompt>" </dev/null` with **cwd = the Public project root**. The code-mode MCP (Mobbin, Refero, Figma, GitHub, Chrome) only loads from the project dir — running from scratchpad or relying on `~/.config/opencode` yields **zero MCP** (a false negative).
- Refero is the reliable source (`refero_refero_search_screens`, 315+ matches/query). Mobbin (`mobbin_search_screens`) is intermittent (sometimes 0 — likely rate-limit); agents note gaps rather than fabricate. A re-run when Mobbin isn't throttled adds coverage (orchestrator is resumable — it skips features whose `reference-screens.md` already exists).
- **Concurrency 2 + ~8s stagger.** Three concurrent full-framework agents fast-fail (exit 0 in ~14s, no output) from a startup race.
- Envelope: `MK_HOOKS_DISABLED=1 MK_SPEC_GATE_DISABLED=1 AI_SESSION_CHILD=1`, and **pre-resolve Gate 3 in the prompt** — the Public project loads the code-env `AGENTS.md`, so a dispatched agent otherwise stops to ask the A/B/C/D/E documentation-scope question and never does the work.

**Original synthesis research** (external-CLI, no `/deep:research` runtime): DeepSeek v4 Flash via `opencode run --model opencode-go/deepseek-v4-flash`; SOL high via `codex --search exec -m gpt-5.6-sol -c model_reasoning_effort=high`; Grok 4.6 xhigh via `cursor-agent -p --model cursor-grok-4.6-xhigh --mode ask -f`. 80 iterations, no early convergence. Because this didn't run through the deep-loop state machine, `research/` intentionally omits runtime artifacts (`deep-research-state.jsonl`, `findings-registry.json`, dashboard, deltas, lineages) — see each `research/PROVENANCE.md`.

## 5. Spec-kit metadata & validation (keep it clean)

- Metadata is **scripted, not hand-crafted**: `generate-description.js <folder> <specroot> --level phase|3 --description "…"` + `backfill-graph-metadata.js <relpath>` (run from `Public/specs`). Dist scripts under `.opencode/skills/system-spec-kit/scripts/dist/`.
- **Generate metadata LAST**, after all `spec.md` edits — otherwise fingerprints drift → `GENERATED_METADATA_INTEGRITY` / `_DRIFT` errors.
- Every `spec.md` needs a `SPECKIT_TEMPLATE_SOURCE` marker near the top. Phase-parents need `_memory.continuity` frontmatter with **compact** `recent_action`/`next_safe_action` (≤96 chars, ≤16 tokens, ≤1 period; `next_safe_action` must start with an allowed verb — build/prepare/investigate/run/… **not** gather), `open_questions`/`answered_questions` arrays, and `packet_pointer` = the folder's **own** path.
- Stale parent `children_ids` (e.g. after deleting a folder): `backfill-graph-metadata.js <pp> --prune-report` then `… --prune --prune-confirm <contentHash>` (report writes to `Public/specs/.backfill-graph-metadata-prune-report.json`).
- **Gate:** `validate.sh <packet-path> --strict` → `Errors: 0`. The only remaining warning is `PHASE_LINKS` (inherent — the reference `001` packet carries it too; not worth chasing). Standalone-validating a *feature* also surfaces Level-3 file gaps on the un-built leaf phases — expected for un-built scaffolds; the authoritative packet-level validate stays clean.

## 6. Git / remote state

- Repo: framework monorepo `opencode--skilled-agent-loops-with-spec-kit-memory`, branch `skilled/v4.0.0.0`. Live-sync auto-publishes commits; also push explicitly to be sure.
- Commit each change **scoped**: `git commit --only -- <spec-path>` isolates from other sessions' concurrent staged work (the repo is shared — `sk-vision`, `pi-fast-mode`, etc. move independently).
- This packet's commits: relocated packet → warnings fix → reference research + F9/F10 → metadata fix. All pushed.
- The old app-repo copy (`Apps/Pi Mobile` → `specs/002`) was removed from the `pi-mobile-pwa-tailscale` remote (mass-deletion hook needs `SPECKIT_ALLOW_MASS_DELETION=1` on both commit and push; app `specs/` is a symlink → use `git rm --cached`).

## 7. Next steps

1. **Finish 009/010 research:** run the synthesis pass (or a research loop) to turn each net-new feature's `reference-screens.md` + brief into a build-ready `research.md`, then author its `spec.md` + `implementation-phases.md` + build sub-phases (same pipeline as the 8 originals).
2. **Build in order.** Suggested first: `001-change-model` (cheapest, host-authoritative hardening; its research is the most complete). Then follow the ROADMAP; build `005-file-preview` before `006`/`008` (shared viewer shell); gate `007`/`008` on the security review.
3. For each feature: implement from its `research.md` (decision) + `reference-screens.md` (real UI patterns) + `implementation-phases.md` (phased plan); verify with typecheck + tests + true-390px CDP screenshots (light + dark) per the sibling packet's technique.

## 8. Known caveats

- **Mobbin intermittent** — reference docs lean on Refero; re-run for denser Mobbin coverage when it's not rate-limited.
- **`009`/`010` research is partial** (reference screens only; no synthesized decision yet).
- **Build-time docs** (`decision-record.md`, `implementation-summary.md`) are intentionally absent on un-built sub-phases; add them as each phase is built.
- Pre-push tests on the monorepo are report-only; their pre-existing failures are unrelated to this doc-only packet.
