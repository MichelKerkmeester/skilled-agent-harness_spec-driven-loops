---
name: sk-create-frontmatter
description: Own the YAML frontmatter contract: which fields a document class carries, the description budget, and the 4-part version field.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-frontmatter, frontmatter, YAML frontmatter, frontmatter block, trigger_phrases, importance_tier, contextType, description budget, 4-part version, X.Y.Z.W, frontmatter versioning, document class, frontmatter validation -->

# create-frontmatter

`create-frontmatter` is the frontmatter workflow packet of the `sk-doc` family. It owns
the contract every other mode writes against: which fields a document class carries, what
each field may contain, and how the 4-part `version` field is derived and inserted.

Six sibling modes emit frontmatter. None of them decides what a frontmatter block is.
This mode does, and they cite it.

**This mode owns rules, not enforcement.** The validators and the versioning engine live
in the hub's shared tier because a post-edit hook outside this hub resolves them by path.
This mode is where you find out what the validators are checking for and why.

---

## 1. WHEN TO USE

### Activation Triggers

- A document needs a frontmatter block and you do not know which fields its class carries.
- A validator rejected a frontmatter block and the message names a field rather than a fix.
- A `description` is over budget and needs trimming without losing its routing signal.
- A `version` field needs deriving, inserting or reconciling against a changelog anchor.
- Someone asks what `trigger_phrases`, `importance_tier` or `contextType` are for.
- A document class is being added and needs a frontmatter rule of its own.

Keyword triggers: `yaml frontmatter`, `frontmatter block`, `frontmatter template`, `frontmatter field`, `frontmatter fields`, `trigger_phrases`, `trigger phrases`, `importance_tier`, `contextType`, `description budget`, `4-part version`, `X.Y.Z.W`, `frontmatter versioning`, `frontmatter version`, `version field`, `frontmatter validation`, `missing frontmatter`, `frontmatter contract`.

### When NOT to Use

- **The document itself needs writing.** Frontmatter is the block at the top. The mode that owns the document class owns its body.
- **A validator needs changing.** The scripts live in the shared tier and are enforcement, not contract. Changing what they check starts here. Changing how they check it does not.
- **The question is which skill to route to.** That is the hub router's job.
- **A changelog entry needs writing.** The changelog mode owns that, including the version number that appears in its filename.

---

## 2. SMART ROUTING

### Resource Domains

- `assets/frontmatter-templates.md`. The field reference and the per-class templates. Eleven sections covering every document class, the description budget, validation rules and the common fixes.
- `references/frontmatter-versioning.md`. The 4-part `X.Y.Z.W` standard: scope, format, the changelog-anchored derivation, the numstat gate, and the insertion rule.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | Any frontmatter question | `assets/frontmatter-templates.md` |
| CONDITIONAL | The question is about `version`, its derivation, or the corpus gate | `references/frontmatter-versioning.md` |

### Smart Router Pseudocode

The canonical resilient router discovers resources at call time, guards and loads only
what exists, scores the intents, and returns a disambiguation checklist rather than
silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "assets/frontmatter-templates.md"

INTENT_MODEL = {
    "FIELDS":     {"weight": 5, "keywords": ["frontmatter block", "which fields", "trigger_phrases", "importance_tier", "contexttype", "add frontmatter", "missing frontmatter"]},
    "BUDGET":     {"weight": 4, "keywords": ["description budget", "description too long", "trim the description", "description length"]},
    "VERSION":    {"weight": 5, "keywords": ["4-part version", "x.y.z.w", "version field", "frontmatter version", "changelog anchor", "edit count"]},
    "VALIDATION": {"weight": 4, "keywords": ["frontmatter invalid", "validator rejected", "malformed frontmatter", "frontmatter fix"]},
}
RESOURCE_MAP = {
    "FIELDS":     ["assets/frontmatter-templates.md"],
    "BUDGET":     ["assets/frontmatter-templates.md"],
    "VERSION":    ["references/frontmatter-versioning.md", "assets/frontmatter-templates.md"],
    "VALIDATION": ["assets/frontmatter-templates.md", "references/frontmatter-versioning.md"],
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the document class: skill manifest, readme, reference, asset, command, agent or spec doc",
    "Confirm the operation: author a new block, fix a rejected one, or derive a version",
    "Confirm whether the file is in scope for the version field at all",
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

def route_frontmatter_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()

    # The field reference loads on every path. Every frontmatter question resolves
    # against a document class first, and that is the only place classes are defined.
    load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                       # Tier 1: unclear scope
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

Unknown intent returns the disambiguation checklist with the field reference already
loaded, because "which class is this document" is the first question on every path.

---

## 3. HOW IT WORKS

### Author a block

1. **Name the document class.** Skill manifest, readme, reference, asset, feature catalog, testing playbook, command, agent or spec doc. The class decides the field set, and guessing it is the usual source of a rejected block.
2. **Copy the class template** from the field reference section 4. Do not compose one from memory. Several classes differ by a single field.
3. **Fill `description` against the budget.** It shares a project-wide allowance, and an over-budget description is silently dropped from discovery rather than reported.
4. **Derive `version` last.** It is inserted as the final key before the closing delimiter, which is field-relative and never a fixed line number.
5. **Validate** with the shared-tier validator for the surface you are on.

### Fix a rejected block

Read what the validator named, then read the class row rather than the field row. Most
rejections are a field that is required for one class and forbidden for another, so the
field in isolation looks correct. The common fixes are catalogued in section 6 of the
field reference: missing block, missing field, wrong field name, malformed delimiters.

### Derive a version

The anchor is the higher of the skill's own frontmatter version and its highest changelog
filename version, compared as integer tuples. Major and minor are inherited from it,
patch is reserved and seeded zero, and build is the file's real edit count.

Real edit count is the rule that matters. It counts commits whose own added-plus-deleted
line count for that file is above zero. A naive commit count over-counts, because a
historical repository-wide move left files carrying zero-line "edits" and bulk sweeps
touch siblings without changing the file. Measured across the 1,214 in-scope documents of
`sk-doc` and `system-spec-kit` on 2026-09-02, the ungated count is 1.06 to 1.09 times the
gated one in aggregate and 2.25 times at the worst single file, so the gate changes the
answer often while the gap itself stays small.

---

## 4. RULES

### ✅ ALWAYS

1. Resolve the document class before reading any field rule. The class decides the field set.
2. Insert `version` as the last key before the closing delimiter, field-relative.
3. Edit frontmatter line-wise. A YAML re-serializer reflows multi-line block sequences and corrupts `trigger_phrases`.
4. Gate the edit count through per-file numstat. An ungated count is wrong by a large multiple, not a small one.
5. Keep `description` inside its budget, and keep the routing tokens when trimming.
6. Report a skipped file. A versioning pass that cannot resolve a file says so rather than synthesizing a block.

### ⛔ NEVER

1. Synthesize a frontmatter block for a file that has none during a versioning pass. Skip and report.
2. Overwrite a human-set `version` that differs from the computed one without an explicit update flag. The one exception is a `SKILL.md`, which is the anchor of record.
3. Add `version` to a class the standard puts out of scope. Commands, agents and standalone install guides are governed elsewhere.
4. Left-pad or shift segments when normalizing a 3-part version. Append one zero, once.
5. Change what a validator checks by editing the validator. The contract changes here first.
6. Enumerate stacks or products in a `description` to fill it out. The budget is shared and every character costs another document its discovery.

### ⚠️ ESCALATE IF

1. A document class needs a field the contract does not define for it, which is a contract change rather than a document fix.
2. A computed version conflicts with a human-set one and the correct answer is not obvious from the changelog.
3. Two validators disagree about the same block, which means the contract is ambiguous rather than the document wrong.

---

## 5. SUCCESS CRITERIA

- A block authored from a class template passes the validator for that surface on the first run.
- A rejected block is fixed by reading one class row, not by trying fields until one is accepted.
- A versioning pass over an already-versioned tree is a byte-level no-op.
- A trimmed description keeps the tokens the advisor routes on.

---

## 6. REFERENCES

Routed by `references/README.md`. The field reference in `assets/` loads on every path. The versioning standard is
conditional on the question being about `version`.

---

## 7. INTEGRATION POINTS

- **sk-doc parent hub.** This packet is registered in `../mode-registry.json` and `../hub-router.json`. The advisor scores the hub on `../graph-metadata.json`, so every keyword trigger above is also a stage-one entry there. A trigger present in one of the three and absent from another routes on one stage only.
- **Shared-tier enforcement.** `../shared/scripts/quick_validate.py` reads the description budget from `../shared/assets/skill-contract.json`, `../shared/scripts/frontmatter-version.mjs` implements the versioning standard, and `../shared/scripts/check-frontmatter-versions.sh` wraps its `gate` mode. This mode owns what they check, and never edits how.
- **Post-edit hook.** `.opencode/hooks/post-edit-quality/` resolves the corpus gate by literal path on every qualifying edit. That path is why the scripts stay in the shared tier.
- **Templates that cite this contract.** `sk-create-skill`'s manifest, reference and asset templates, the feature-catalog and playbook templates, and the `/create:skill` and `/create:agent` workflow assets all point at `assets/frontmatter-templates.md`. A rule changed here changes what they emit.
- **Doctor budget audit.** `/doctor skill-budget` and `.opencode/commands/doctor/scripts/audit_descriptions.py` measure the project against the budget this contract documents.

---

## 8. RELATED RESOURCES

- `README.md`: what the mode owns, the silent-budget and numstat-gate concepts, troubleshooting and the verification table.
- `references/README.md`: the reference router. One conditional reference, the versioning standard.
- `assets/frontmatter-templates.md`: the field reference and per-class templates, loaded on every path.
- `assets/fixtures/`: the two fixed inputs the description-budget scenarios read.
- `manual-testing-playbook/manual-testing-playbook.md`: eleven operator scenarios across field resolution, budget and version derivation.
- `changelog/`: the mode's shipped versions, one file per release.
