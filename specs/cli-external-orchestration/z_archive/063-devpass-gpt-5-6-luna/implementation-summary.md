---
title: "Implementation Summary: Luna added, and the DevPass catalog cli-opencode had been missing"
description: "One model on the pi side, a whole catalog section on the opencode side, and ten dispatches so no row claims more than was observed."
trigger_phrases:
  - "implementation"
  - "luna devpass done"
  - "llmgateway opencode catalog"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/063-devpass-gpt-5-6-luna"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped Luna plus the cli-opencode DevPass catalog"
    next_safe_action: "None - work is complete and verified"
    blockers: []
    key_files:
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-063-luna-devpass"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 063-devpass-gpt-5-6-luna |
| **Completed** | 2026-09-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

GPT-5.6 Luna now dispatches through DevPass on both CLIs, and both rosters carry the same five models.

The request sounded symmetric and was not. On cli-pi, Luna was a fifth model object in a provider block that already worked. On cli-opencode there was **no DevPass section at all** — that catalog had never been told the provider exists, even though opencode itself has been authenticated against it and the subscription has been paid for throughout. So "add Luna to the opencode roster" meant creating the roster it would join, which is packet 060's first workstream, delivered here ahead of the rest of that packet.

The new cli-opencode section carries all five models plus three things a reader needs before dispatching: the ids are **bare** and two-segment (the exact inverse of the Cline block a few paragraphs above, which requires slashed ids and 400s a bare one), every model is **Standard** tier so the DevPass weekly Premium cap never applies, and the gateway fronts 183 models of which exactly these five are permitted.

Luna carries two constraints worth stating on its row. It **does not support `temperature`**, and its input cap is 922K against a 1.05M context window. It is also reachable two ways — `openai/gpt-5.6-luna` and now `llmgateway/gpt-5.6-luna` — the same model family on different routes with different billing, so both catalogs say so rather than listing two similar slugs and leaving the reader to guess.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | Luna model object with its own thinking ladder |
| `.pi/settings.json` | Modified | Fifth `enabledModels` entry |
| `.pi/custom-providers.md` | Modified | Luna row, temperature caveat, counts |
| `cli-pi/references/providers-and-models.md` | Modified | Luna row, counts, literal-collision note extended |
| `cli-opencode/references/providers-and-models.md` | Modified | **New** `llmgateway` section, five rows; per-model `--variant` row |
| `cli-opencode/SKILL.md` | Modified | Provider prose names the DevPass routes and the bare-id rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Wire id first, as with every other model on this provider: a direct call returned 200 for the bare `gpt-5.6-luna` and reported `azure/gpt-5.6-luna` upstream. Only then was any config written.

Then ten dispatches, not five. A pi dispatch is not evidence for an opencode catalog row — the two compose the model reference differently and hold separate credentials — so each of the five models was run on each CLI at its own ceiling. The four that already existed on the pi side had never been proven through opencode, and its new rows would otherwise have claimed "dispatch-tested" on someone else's evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the cli-opencode section rather than only add a Luna row | There was no section to add to; the roster had to exist before a model could join it |
| Deliver 060's WS1 here and amend 060 | Better than two packets claiming the same work, or a roster that stays empty while a fifth model waits for it |
| Ten dispatches instead of five | Each catalog claims what its own CLI did; carrying evidence across would have been an overclaim on four rows |
| Luna only, not Sol or Terra | Both are live on the gateway; only Luna was asked for |
| State the two Luna routes on the row itself | Two similar slugs in one hub, different billing — the distinction belongs where the choice is made |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Wire id | PASS — bare `gpt-5.6-luna` → 200, upstream `azure/gpt-5.6-luna` |
| Luna, both CLIs | PASS — `LUNA-PI-OK` at `--thinking max`, `LUNA-OC-OK` at `--variant max` |
| Other four via cli-opencode | PASS — all four markers returned at their own ceilings |
| pi config | PASS — five models, both files parse, operator formatting intact |
| No secret in tracked files | PASS — `apiKey` remains the `${LLMGATEWAY_API_KEY}` reference |
| Independent review | PASS — fresh Gemini 3.8 Flash at `high` via DevPass: 0 P0, 1 P1, 3 P2, all four substantive claims verified |
| Review remediation | PASS — all four findings reproduced and fixed, plus one the review missed |
| Second independent review | PASS — fresh agent on the remediation itself: 0 P0, 2 P1, 2 P2; first round confirmed to have held |
| Second remediation | PASS — all four reproduced and fixed |
| Provider discoverability | PASS — both SKILL.md files now name DevPass; cli-opencode's duplicate model list removed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Vision is still declared, not demonstrated.** Luna and `deepseek-v4-flash-vision-exp` both report `attachment: true` and both completed text-only round-trips. No image has been through either.
2. **The DevPass entries remain unreachable from the deep-loop fan-out.** Their bare literals collide with opencode-go's and openai-codex's in the provider map, so they stay direct-dispatch only.
3. **cli-opencode's roster is discipline, not code.** Nothing rejects an off-catalog `llmgateway` id at runtime — the catalog is the whole enforcement, which is why its bound against the other 178 models is stated explicitly rather than implied.
4. **Only one of the three GPT-5.6 personas is wired.** `gpt-5.6-sol` and `gpt-5.6-terra` are live on the gateway and absent from both rosters by choice.
5. **The Ox Alpha staleness was pre-existing and went unnoticed through two of my own edits.** `.pi/custom-providers.md` had described a model retired well before this session, and I modified two of the very lines carrying it without noticing. An independent reviewer found it in one pass. The lesson is narrow and worth keeping: editing a line is not the same as reading the document it lives in.
6. **Two review rounds were needed, and the second was not redundant.** It found four issues the first missed, two of them P1 — including a doc that instructed a dispatch the cli-pi closed roster forbids, and an exclusivity claim I invalidated myself by adding Luna to the same table an hour later. Both are the same failure as the Ox Alpha one: a sentence that was true when written and was never re-read after the thing it described changed.
7. **The inline model list in `cli-opencode/SKILL.md` was the real defect behind a "not mentioned in cli-pi" report.** cli-pi named no providers, so DevPass was invisible there; cli-opencode named every provider *and* every model id, which is the second copy that drifted twice under review. Both now name providers and cite the roster instead of restating it. The remaining four mode SKILL.md files still name no providers, which is consistent but leaves the same discoverability gap if anyone greps them.
8. **`deepseek-v4-pro` is in a contradictory state that this packet documents rather than resolves.** Its object sits in the pi provider block while being absent from both `enabledModels` and the cli-pi closed roster, so pi accepts it and the skill forbids it. Retiring it is scoped to a different packet; leaving it undocumented was the worse option.
<!-- /ANCHOR:limitations -->
