# Validation Log

## Artifact Validation

Command:

```bash
python3 - <<'PY'
...
PY
```

Result:

```text
artifact validation passed
json_files=2 jsonl_files=6 iterations=5 state_events=7
```

Checks performed:

- Parsed `deep-review-config.json`.
- Parsed `deep-review-findings-registry.json`.
- Parsed `deep-review-state.jsonl`.
- Parsed all `deltas/iter-*.jsonl` files.
- Verified all five iteration files end with a `Review verdict:` line.
- Verified the state starts with a config event and ends with a synthesis event.
- Verified final verdict is `CONDITIONAL`.

## Skill Document Validation

Command:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type skill .opencode/skills/sk-doc/SKILL.md
```

Result:

```text
VALID: .opencode/skills/sk-doc/SKILL.md
Document type: skill
Total issues: 0
```

Command:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type skill .opencode/skills/sk-code/SKILL.md
```

Result:

```text
VALID: .opencode/skills/sk-code/SKILL.md
Document type: skill
Total issues: 0
```
