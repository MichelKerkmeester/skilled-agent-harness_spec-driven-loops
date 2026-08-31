---
name: sk-create-with-human-voice
description: Apply the Human Voice Rules to prose, or score prose against them, with a scope gate first and a re-scan after the rewrite.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-with-human-voice, /create:with-human-voice, human voice rules, apply human voice, rewrite in human voice, make this sound human, sounds ai-generated, reads like ai wrote it, remove ai tells, ai writing tells, voice pass, hvr_scan -->

# create-with-human-voice

`create-with-human-voice` is the voice-application workflow packet of the `sk-doc` family.
It takes prose you are writing or have written and brings it up to the Human Voice Rules,
or reports how far off it is without touching a byte.

**The standard is not here.** It lives once at
[`../shared/references/hvr-rules.md`](../shared/references/hvr-rules.md), where hundreds
of files across this repository already point. This packet owns the workflow that applies
it: what may be touched, in what order, with what arithmetic, and how the result is
proved. It never restates a rule the standard already carries.

Keyword triggers: `human voice rules`, `apply human voice`, `rewrite in human voice`, `make this sound human`, `sounds ai-generated`, `reads like ai wrote it`, `remove ai tells`, `ai writing tells`, `voice pass`, `de-ai the writing`.

---

## 1. WHEN TO USE

### Activation Triggers

- Someone says a draft reads like a machine wrote it, and wants it fixed.
- A document is about to ship and needs a voice pass before it does.
- Someone asks how a passage scores against the Human Voice Rules, without wanting edits.
- You are about to write documentation prose and want the standard in force from the first sentence rather than bolted on afterwards.
- A sibling workflow needs the HVR step of its own pipeline actually performed rather than gestured at.

### When NOT to Use

- **The target is a whole document needing structure, DQI and validators.** That is `sk-create-quality-control`, which owns the file-level audit. This mode owns the voice, and the audit calls it for that step.
- **The artifact does not exist yet.** A README, changelog, agent, command, catalog, playbook, benchmark, diagram or repo rule is scaffolded by its own sibling mode, which then applies this standard to the prose it produced.
- **The text is code, output, a quotation or a generated file.** See `references/scope-and-exemptions.md`. A voice edit there is a defect, not an improvement.
- **The request is about brand or product tone.** The Human Voice Rules are a linguistic standard for documentation, not a tone-of-voice guide.

---

## 2. SMART ROUTING

### Family Boundary

This is a nested workflow packet under `sk-doc`. It has no packet-local
`graph-metadata.json`, and the advisor identity lives at the hub root. Two operations
route here: `apply`, which edits, and `score`, which reports and does not.

### Resource Domains

- `references/scope-and-exemptions.md` - which spans the standard governs. Always first.
- `references/scoring-and-verification.md` - pass order, precedence arithmetic, bands, and the re-scan.
- `assets/voice-report-template.md` - the shape of the result.
- `scripts/hvr_scan.py` - the mechanical pass. Parses the standard at run time.
- `../shared/references/hvr-rules.md` - the standard. Referenced, never copied.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | Every invocation | `references/scope-and-exemptions.md` |
| ALWAYS | Every invocation | `../shared/references/hvr-rules.md` |
| CONDITIONAL | A score is being computed or quoted | `references/scoring-and-verification.md` |
| CONDITIONAL | A result is being reported | `assets/voice-report-template.md` |

### Smart Router Pseudocode

The canonical resilient router discovers resources at call time, guards and loads only
what exists, scores the two operations, and returns a disambiguation checklist rather
than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/scope-and-exemptions.md"

INTENT_MODEL = {
    "APPLY": {"weight": 5, "keywords": ["apply human voice", "rewrite in human voice", "make this sound human", "remove ai tells", "de-ai the writing", "voice pass"]},
    "SCORE": {"weight": 4, "keywords": ["sounds ai-generated", "reads like ai wrote it", "ai writing tells", "how does this score", "human voice rules"]},
}
RESOURCE_MAP = {
    "APPLY": ["references/scope-and-exemptions.md", "references/scoring-and-verification.md", "assets/voice-report-template.md"],
    "SCORE": ["references/scope-and-exemptions.md", "references/scoring-and-verification.md"],
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target: a file path, or the passage to work on",
    "Confirm the operation: apply (edits the text) or score (reports only)",
    "Confirm which spans are quoted, generated or otherwise out of scope",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_voice_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()

    # The scope gate loads on every path. Deciding what may be touched comes
    # before deciding what to change, and before quoting any number.
    load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                       # Tier 1: unclear operation
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: happy path
    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```

An unclear operation returns the checklist with the scope gate already loaded, because
the question of what may be touched is worth answering even when the operation is not yet
settled.

---

## 3. HOW IT WORKS

### Score

1. **Gate the scope.** Run `references/scope-and-exemptions.md` over the target. Name every exempt span before reading for findings. A document about the standard scores catastrophically against itself, so confirm the target is not one.
2. **Run the mechanical pass.**

```bash
python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <target>
```

The scanner parses the term lists out of the standard on every run, so it never carries a
stale copy. Exit 0 means no hard blocker, 1 means at least one, 2 means it could not read
the standard and refuses to report a clean scan.

3. **Read the mechanical findings as candidates.** Word sense decides, not spelling. `harness` the noun is fine, `harness` the verb is not, and the scanner reports both.
4. **Run the judgment pass.** Structure, sentence habits, content habits and voice. The scanner prints this list on every run precisely because it cannot check any of it.
5. **Compute the score** under the precedence rule, or report hard blockers and density on a long document. `references/scoring-and-verification.md` carries the arithmetic.
6. **Report** using `assets/voice-report-template.md`. Do not edit.

### Apply

Steps 1 through 5 above, then:

7. **Edit only in-scope spans.** Fix hard blockers first, then soft deductions, then the judgment findings. Leave every exempt span untouched.
8. **Re-run the scanner on the rewritten text.** Rewriting introduces new tells: the sentence that loses `leverage` reaches for `utilise`, and the three-item list becomes a four-item list whose fourth item says nothing.
9. **Report both numbers.** A single after-score proves nothing about what the pass did.

### Draft

Writing new prose is the same workflow with the passes moved earlier. Load the standard
before the first sentence, write, then run steps 2 through 9 on what came out. The order
is what changes, never the checks.

---

## 4. RULES

### ✅ ALWAYS

1. Gate the scope before the first finding, and record every exemption in the report.
2. Run the mechanical pass before the judgment pass.
3. Treat a scanner finding as a candidate. Word sense decides whether it is a defect.
4. Re-run the scanner after any rewrite and report the before and after numbers.
5. State the length basis when quoting a number: an absolute score, or hard blockers plus density.
6. Keep an accepted exception in the report, with the reason it was kept.

### ⛔ NEVER

1. Change what a sentence claims to satisfy a word ban. Accuracy outranks the standard, and the exception gets recorded instead.
2. Edit a quotation, an error string, a command, a generated file, a released changelog entry or a byte-pinned fixture.
3. Score a document that is about the standard, including the standard itself, without saying that is what it is.
4. Copy any part of `hvr-rules.md` into this packet, a sibling packet, a command asset or a repo rule. Reference the path.
5. Report a clean scan the scanner refused to produce. Exit 2 is a failure, not a pass.
6. Quote an absolute score for a document long enough that length alone drove it negative.

### ⚠️ ESCALATE IF

1. The standard and accuracy conflict on something load-bearing, and the right call is the author's rather than yours.
2. The target is frozen, generated or byte-pinned, and the request is to edit it anyway.
3. The scanner exits 2, meaning the standard's shape moved and the parser needs updating before any scan can be trusted.

---

## 5. SUCCESS CRITERIA

- Every exempt span is named in the report rather than silently skipped.
- Both scan numbers appear on any run that edited text.
- No quotation, code sample, generated file or fixture changed.
- The judgment findings are answered by a reader, not implied by a clean mechanical result.
- Nothing from the standard was copied into this packet or anywhere else.

---

## 6. INTEGRATION POINTS

| Consumer | What it takes from here |
|---|---|
| `sk-create-quality-control` | Its HVR review step. The audit owns structure, DQI and validators, this mode owns the voice finding it reports |
| Every `sk-create-*` sibling | The voice pass over the prose their templates produce |
| `sk-communication` | Voice guidance by route rather than by a second copy |

---

## 7. REFERENCES

Routed by [`references/README.md`](references/README.md). Load
`references/scope-and-exemptions.md` first on every path. The standard itself stays at
[`../shared/references/hvr-rules.md`](../shared/references/hvr-rules.md) and is never
copied.

---

## 8. RELATED RESOURCES

| Resource | Purpose |
|---|---|
| [`../shared/references/hvr-rules.md`](../shared/references/hvr-rules.md) | The standard. Voice directives, punctuation bans, structural patterns, term lists, precedence and the pre-publish checklist |
| [`README.md`](README.md) | What the mode does, why the scanner over-reports, and how to verify it |
| [`scripts/hvr_scan.py`](scripts/hvr_scan.py) | The mechanical pass, parsed from the standard at run time |
| [`../sk-create-quality-control/SKILL.md`](../sk-create-quality-control/SKILL.md) | The file-level audit whose HVR step this mode performs |
