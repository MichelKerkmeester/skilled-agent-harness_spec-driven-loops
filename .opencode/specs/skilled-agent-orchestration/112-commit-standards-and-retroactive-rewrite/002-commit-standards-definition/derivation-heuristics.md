---
title: "Derivation Heuristics: Commit Standard Application"
description: "Algorithmic first-match rules for deriving type / scope / body-policy / trailer-policy / packet-ID handling. Phase 004 cli-devin prompts reference this directly."
trigger_phrases:
  - "derivation-heuristics"
  - "commit derivation rules"
  - "scope derivation"
  - "type derivation"
importance_tier: "important"
contextType: "implementation"
---
# Derivation Heuristics

> Algorithmic, first-match rules for applying `commit-standards.md` to a commit. No "use your judgement" branches — every input produces a deterministic output (with a known set of flagged-for-review cases).

## How to use this document

Phase 004 cli-devin prompts pass each commit through the six numbered rules in order. Each rule is a function from `(old_subject, old_body, diff_metadata)` to either:
- a rewrite mapping update (one field of `{new_subject, new_body, new_trailers, flags}`), or
- a `next_rule` signal (no change at this rule; try the next one).

After Rule 6, every commit has a complete mapping. Convergence requires zero `needs_human_review` entries (or operator-cleared).

---

## Rule 1: Packet-ID Prefix Extraction

**Input**: `old_subject`.

**Pattern match (regex)**:
```
^(?P<spec>\d{3})\s+W(?P<wave>\d+)\.(?P<sub>[A-Z](?:-[A-Z])?)(?P<suffix>(?:-[A-Z])?)?:\s*(?P<rest>.+)$
```

Examples that match:
- `111 W3.A: author phase-parent base files for ...`
- `111 W3.D-B: renumber ...`
- `111 W3.E: cli-devin scorer ...`

**Action when matched**:
1. Set `subject_remainder = <rest>` (everything after the colon).
2. Set `wave_designator = <spec>-W<wave>.<sub><suffix>` (e.g., `111-W3.A`, `111-W3.D-B`).
3. Set `flags.had_packet_id_prefix = true`.
4. Append `Wave: <wave_designator>` to the trailer block (per `commit-standards.md` §3).
5. Continue to Rule 2 with `subject_remainder` as the working subject.

**Action when no match**: continue to Rule 1.5 with `subject_remainder = old_subject`.

---

## Rule 1.5: Type-Prefix Extraction

**Input**: `subject_remainder` (output of Rule 1).

**Pattern match (regex)**:
```
^(?P<existing_type>[a-z][a-z0-9-]*)(?:\((?P<existing_scope>[^)]+)\))?:\s*(?P<rest>.+)$
```

Examples that match:
- `docs(017): T-CPN-01 — amend ...` → existing_type=`docs`, existing_scope=`017`, rest=`T-CPN-01 — amend ...`
- `docs: minor README tweaks` → existing_type=`docs`, existing_scope=None, rest=`minor README tweaks`
- `feat(013/009/008): move skill_graph_* handlers ...` → existing_type=`feat`, existing_scope=`013/009/008`, rest=`move skill_graph_* handlers ...`

**Action when matched AND `existing_type` is in the 13-type taxonomy** (`commit-standards.md §1.1`):
1. Set `subject_remainder = rest`.
2. Set `existing_type_hint = existing_type` (used as preferred type in Rule 3.0).
3. Set `existing_scope_hint = existing_scope` (used as preferred scope in Rule 2.0).
4. Continue to Rule 2.

**Action when matched AND `existing_type` is NOT in the taxonomy** (e.g., a typo or legacy):
1. Treat as if no prefix matched.
2. `subject_remainder = old_subject` (unchanged).
3. Continue to Rule 2 with no hints.

**Action when no match** (subject doesn't start with a type-prefix at all):
1. `subject_remainder = old_subject` (unchanged).
2. Continue to Rule 2 with no hints.

---

## Rule 2: Scope Derivation

**Input**: `diff_metadata.changed_files` (list of paths relative to repo root).

**First-match algorithm**:

```
Let paths = changed_files (paths relative to repo root, sorted)

# Rule 2.0 — Honor existing_scope_hint when present AND well-formed
if existing_scope_hint is set:
    # Lowercase + sanity-check the hint matches one of the shapes below
    candidate = existing_scope_hint.lower()
    if candidate matches Shape 1/2/3/4/5 OR is a valid fallback:
        return scope = candidate
    # else: hint is malformed (e.g., "README" uppercase); fall through

# Shape 1 — Skill scope
if all paths start with ".opencode/skills/<name>/" for the same <name>:
    return scope = <name>

# Shape 2 — Spec scope (single packet)
if all paths start with ".opencode/specs/<track>/<NNN>-<slug>/" for the same NNN AND
   no second-level <MMM>-<slug>/ phase child has changes outside that one phase:
    if exactly one phase child <MMM>-<slug>/ is touched:
        return scope = "<NNN>/<MMM>"             # Shape 3a (one phase child)
    elif multiple phase children touched within same NNN:
        return scope = "<NNN>"                    # Shape 2 (multi-phase-child within one spec)
    else (parent only):
        return scope = "<NNN>"                    # Shape 2

# Shape 3b — Deeper hierarchical (phase grandchild)
if all paths under ".opencode/specs/<track>/<NNN>-<slug>/<MMM>-<phase>/<KKK>-<sub-phase>/":
    return scope = "<NNN>/<MMM>/<KKK>"

# Shape 4 — Multi-spec scope
if paths span multiple <NNN>-<slug> spec folders:
    Let nn = set of distinct NNN values
    if |nn| <= 4:
        return scope = sort(nn).join("/")         # e.g., "008/009/013"
    else:
        flags.scope_split_recommended = true
        return scope = sort(nn).take(3).join("/") + "/..."   # truncated

# Fallback scopes (mutually exclusive — first match wins)
if all paths under ".opencode/agents/" or path == "AGENTS.md":
    return scope = "agents"
if all paths under ".opencode/commands/":
    return scope = "commands"
if all paths in {"opencode.json", ".utcp_config.json"} or under ".opencode/settings/":
    return scope = "config"
if paths == ["README.md"]:
    return scope = "readme"
if all paths end with ".md" AND no non-doc paths:
    return scope = "docs"

# Last resort
return scope = "repo"
```

**Notes**:
- The scope ALWAYS uses the spec folder's `NNN` (zero-padded 3-digit) — not the full slug.
- Skill scope uses the skill name, not the full path.
- `release` type may use `<NNN>.<MMM>` dot form — apply ONLY if Rule 3 selects `release`.

---

## Rule 3: Type Derivation

**Input**: `diff_metadata`, `subject_remainder` (from Rule 1), `old_subject` (raw).

**First-match algorithm** (priority order from `commit-standards.md` §1.1):

```
# Rule 3.0 — Honor existing_type_hint when present
if existing_type_hint is set (from Rule 1.5):
    return type = existing_type_hint              # preserve

# Rule 3.1 — Git-mechanical types (detect from commit metadata, not subject)
if commit is a merge commit (multiple parents):
    return type = "merge"
if old_subject matches "^Revert \"":
    return type = "revert"
if old_subject matches "^fixup! ":
    return type = "fixup"   # preserved exactly per ADR-006; subject untouched

# Rule 3.2 — Detect from subject keywords (case-insensitive)
if subject_remainder matches "^release\b" or contains "version bump":
    return type = "release"
if subject_remainder matches "^scaffold\b" or "create new spec folder" intent:
    return type = "scaffold"
if subject_remainder matches "^remedy\b" or contains "remediation":
    return type = "remedy"
if subject_remainder matches "^iter\b" or "cli-devin SWE-1\." in body:
    return type = "iter"
if subject_remainder matches "^research\b" or "deep-research" in body:
    return type = "research"
if subject_remainder matches "^review\b" or "deep-review" in body:
    return type = "review"

# Rule 3.3 — Detect from diff shape
if all changed paths are under "test/" or end with "*test*.{ts,js,py}":
    return type = "test"
if all changed paths are docs (".md", "README*", "CONTRIBUTING*", "CHANGELOG*"):
    return type = "docs"

# Rule 3.4 — Detect from subject verb (imperative)
if subject_remainder starts with verb in {"fix", "patch", "address"}:
    return type = "fix"
if subject_remainder starts with verb in {"add", "implement", "create", "introduce"}:
    return type = "feat"
if subject_remainder starts with verb in {"refactor", "restructure", "reorganize", "rename", "renumber", "consolidate", "move", "promote", "extract"}:
    return type = "refactor"

# Rule 3.5 — Fallback
return type = "chore"
```

**Notes**:
- Rule 3.0 is the most-common path: existing `feat(026):` style commits keep their type unchanged.
- Rule 3.1 takes precedence over content-based detection — a merge commit is `merge` even if its subject looks like a `feat`.
- Subjects rewritten by Rule 1 (packet-ID stripped) need Rule 3 to pick a type based on the remainder + diff. The `scaffold` / `refactor` / `chore` decision is the most common outcome for W3.x history (since they're scaffolding-and-rename work).

---

## Rule 4: Trailer Normalization

**Input**: `old_body` (full body string including trailers).

**Algorithm**:

```
1. Split body into:
   - body_content (text before the trailer block)
   - trailer_block (last block of consecutive trailer-form lines)

2. A "trailer-form line" is "<Header>: <value>" where:
   - Header is non-empty, no spaces inside
   - colon followed by exactly one space
   - value is non-empty

3. For each trailer line:
   a) Normalize header case:
      - "co-authored-by", "Co-authored-by", "Co-Authored-by" → "Co-Authored-By"
      - "fixes", "FIXES" → "Fixes"
      - "closes", "CLOSES" → "Closes"
      - "refs", "REFS" → "Refs"
      - "see-also", "SEE-ALSO" → "See-Also"
      - (Generic rule: PascalCase-Hyphen-PascalCase)
   b) Collapse multiple spaces after the colon to single space
   c) Strip trailing whitespace on value
   d) Drop the line entirely if value is empty

4. Deduplicate identical normalized trailers (same header + same value).

5. Reassemble:
   - body_content (preserved verbatim)
   - blank line
   - normalized trailer block
   - blank line + Wave: trailer (if Rule 1 added it; appended LAST so it's
     visually distinct as a retroactive-rewrite marker)
```

**Crucially**: do NOT canonicalize the value of `Co-Authored-By` trailers. Model names and emails are preserved verbatim (ADR-003).

---

## Rule 5: Special-Case Recognition

**Input**: type from Rule 3.

**Algorithm**:

```
if type == "merge":
    # Two valid sub-forms
    if old_subject matches "^Merge branch '" or "^Merge remote-tracking branch '":
        new_subject = old_subject                # git-default form preserved
        flags.merge_form = "git-default"
    else:
        new_subject = "merge: " + subject_remainder.lstrip("merge: ").lstrip()
        flags.merge_form = "authored"
    return new_subject (skip Rule 6)

if type == "revert":
    new_subject = old_subject                    # preserve exactly
    flags.is_revert = true
    return new_subject (skip Rule 6)

if type == "fixup":
    new_subject = old_subject                    # preserve exactly
    flags.is_fixup = true
    return new_subject (skip Rule 6)

if type == "release":
    # Two valid sub-forms
    if subject_remainder matches "^v\d+\.\d+\.\d+":
        new_subject = "release: " + subject_remainder
        flags.release_form = "semver"
    elif scope matches "^\d{3}\.\d{3}$":
        new_subject = f"release({scope}): {subject_remainder.lstrip('release: ').lstrip()}"
        flags.release_form = "spec-dot"
    else:
        new_subject = f"release({scope}): {subject_remainder.lstrip('release: ').lstrip()}"
        flags.release_form = "scope-standard"
    return new_subject (skip Rule 6)

# else: continue to Rule 6 with type + scope + subject_remainder
```

---

## Rule 6: Subject Composition + Length Cap

**Input**: type from Rule 3, scope from Rule 2, `subject_remainder` from Rule 1 (or `old_subject` if Rule 1 didn't fire), the original tense.

**Algorithm**:

```
1. Compose: new_subject = f"{type}({scope}): {subject_remainder.lstrip()}"

2. Length check:
   total_length = len(new_subject)
   if total_length <= 72:
       return new_subject
   else:
       # Trim algorithm — try in order:

       # 6a. Move trailing parenthetical refs to body
       if new_subject ends with " (R\d+-P\d+-\d+)" or similar finding-ref:
           ref = extract_trailing_paren()
           new_subject = new_subject.rstrip(" " + ref)
           append to body_content (new line): f"Ref: {ref}"
           if length now <= 72: return new_subject

       # 6b. Truncate em-dash secondary clauses
       if " — " in subject_remainder:
           primary, _, secondary = subject_remainder.partition(" — ")
           append to body_content (new line): f"Detail: {secondary}"
           new_subject = f"{type}({scope}): {primary}"
           if length now <= 72: return new_subject

       # 6c. Hard truncate with ellipsis as last resort
       budget = 72 - len(f"{type}({scope}): ") - 3   # "..." reserved
       trimmed = subject_remainder[:budget].rstrip()
       new_subject = f"{type}({scope}): {trimmed}..."
       flags.subject_hard_truncated = true
       flags.body_augmentation_recommended = true
       return new_subject

3. Tense rule (per ADR-004):
   - Do NOT rewrite verb tense.
   - Examples preserved unchanged: "merged X" stays "merged X" even though "merge X" would be imperative.
```

**Note**: subject_hard_truncated should fire on <2% of commits given the 72-char cap and observed length distribution (median 70, max 101).

---

## Output: Per-commit mapping schema

After all 6 rules, each commit produces one JSONL record:

```json
{
  "old_hash": "<40-hex>",
  "new_subject": "<rewritten>",
  "new_body": "<rewritten with normalized trailers>",
  "new_trailers": ["Co-Authored-By: ...", "Wave: 111-W3.A", ...],
  "justification": "<one-line: type from Rule 3.X, scope from Rule 2 Shape Y>",
  "flags": {
    "had_packet_id_prefix": false,
    "merge_form": null,
    "is_revert": false,
    "is_fixup": false,
    "release_form": null,
    "subject_hard_truncated": false,
    "body_augmentation_recommended": false,
    "scope_split_recommended": false,
    "needs_human_review": false
  }
}
```

`needs_human_review` is set TRUE only when:
- Rule 1 packet-ID prefix matched but Rule 2 couldn't derive a non-`repo` scope (orphaned wave designator), OR
- Rule 3 chose `chore` purely as fallback AND scope is `repo` (no signal at all), OR
- Rule 6 had to hard-truncate AND the truncation removes >50% of the original subject.

Convergence requires zero `needs_human_review` (or operator-cleared).

---

## Decision-record cross-references

| Rule | ADR(s) |
|------|--------|
| Rule 1 (packet-ID extraction) | ADR-002 |
| Rule 2 (scope derivation) | ADR-001 |
| Rule 3 (type derivation) | ADR-001 |
| Rule 4 (trailer normalization) | ADR-003 |
| Rule 5 (special cases) | ADR-006 |
| Rule 6 (subject composition + trimming) | ADR-001, ADR-004, ADR-005, ADR-007 |

If any rule produces a mapping inconsistent with these ADRs, the ADRs win — reopen Phase 002 and update both this document and `commit-standards.md`.
