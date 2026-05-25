---
title: "Profile-Selection Audit Log for DAI"
description: "Documentation for profile-selection rationale logging in DAI, addressing DAI-004 (dynamic profiling auditability)."
trigger_phrases:
  - "profile-selection"
  - "audit log"
  - "DAI-004"
  - "profiling"
---

# Profile-Selection Audit Log for DAI

This reference documents the profile-selection audit log format and retention policy for deep-agent-improvement, addressing DAI-004 (dynamic profiling auditability).

## 1. OVERVIEW

The profile-selection audit log provides debuggability and auditability for dynamic profile selection in DAI. When a profile is chosen for a candidate, the rationale is logged so operators can understand why a particular profile was selected. The log is append-only and stored in the improvement state directory with per-packet retention.

## 2. Purpose

The profile-selection audit log provides debuggability and auditability for dynamic profile selection in DAI. When a profile is chosen for a candidate, the rationale is logged so operators can understand why a particular profile was selected.

---

## 3. Log Format

### File Location

- **Path**: `<state-dir>/profile-selection.log`
- **State-dir**: Typically `{spec_folder}/improvement/` for a DAI session
- **File mode**: Append-only (creates file if missing)

### Log Entry Shape

Each log entry is a single-line JSON object with the following fields:

```json
{
  "timestamp": "2026-05-23T08:30:00.000Z",
  "candidate_hash": "sha256:abc123...",
  "chosen_profile": "default",
  "rationale": "Candidate matches default profile criteria",
  "alternatives": ["profile-a", "profile-b"]
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 string | When the profile was selected |
| `candidate_hash` | string | SHA256 hash of the candidate content (for dedup/audit) |
| `chosen_profile` | string | The profile ID that was selected |
| `rationale` | string | Human-readable explanation of why this profile was chosen |
| `alternatives` | array of strings | Other profiles that were considered (optional) |

### Example Log Entries

```json
{"timestamp":"2026-05-23T08:30:00.000Z","candidate_hash":"sha256:abc123...","chosen_profile":"default","rationale":"Candidate matches default profile criteria","alternatives":["profile-a","profile-b"]}
{"timestamp":"2026-05-23T08:31:00.000Z","candidate_hash":"sha256:def456...","chosen_profile":"strict","rationale":"Candidate requires strict validation due to high complexity","alternatives":["default"]}
{"timestamp":"2026-05-23T08:32:00.000Z","candidate_hash":"sha256:ghi789...","chosen_profile":"default","rationale":"No special criteria matched, using default","alternatives":[]}
```

---

## 4. Retention Policy

### Retention Duration

- **Policy**: Per-packet retention (same as other DAI state files)
- **Rationale**: Profile-selection logs are session-specific and should be retained with the session state

### When to Delete

- Delete when the improvement session is archived
- Delete when the packet is closed
- Delete when the spec folder is cleaned up

### Backup Considerations

- Profile-selection logs are not critical for replay (unlike `agent-improvement-state.jsonl`)
- They are primarily for debugging and auditability
- No special backup requirements beyond normal spec folder backup

---

## Implementation Details

### Script: generate-profile.cjs

The profile-selection logging is implemented in `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs`.

### Logging Code Pattern

```javascript
// After profile selection, log the rationale
const logEntry = {
  timestamp: new Date().toISOString(),
  candidate_hash: hashContent(candidateContent),
  chosen_profile: selectedProfile.id,
  rationale: selectionRationale,
  alternatives: consideredProfiles.map(p => p.id)
};

try {
  fs.appendFileSync(
    path.join(stateDir, 'profile-selection.log'),
    JSON.stringify(logEntry) + '\n',
    'utf8'
  );
} catch (err) {
  // Silent ignore - logging failure should not crash profile generation
}
```

### Error Handling

- Log write failures are caught and silently ignored
- Logging failure does not crash profile generation
- Uses try/catch around `fs.appendFileSync`

### Dependencies

- Uses existing `fs` and `path` modules (already imported)
- Uses existing typed-error helper from `lib/typed-errors.cjs` (already imported)
- No new dependencies required

---

## Usage for Operators

### Debugging Profile Selection

When debugging why a particular profile was chosen:

1. Locate the `profile-selection.log` in the improvement state directory
2. Search for the candidate hash or timestamp
3. Review the `rationale` field to understand why the profile was chosen
4. Check `alternatives` to see what other profiles were considered

### Auditing Profile Selection

When auditing profile selection across a session:

1. Read the entire `profile-selection.log` file
2. Group entries by `chosen_profile` to see distribution
3. Review `rationale` fields to understand selection patterns
4. Cross-reference with `agent-improvement-state.jsonl` for full context

### Example: Finding All Candidates with a Specific Profile

```bash
# Find all candidates that used the "strict" profile
grep '"chosen_profile":"strict"' improvement/profile-selection.log
```

---

## Related References

- `generate-profile.cjs`: `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs`
- `typed-errors.cjs`: `.opencode/skills/deep-agent-improvement/scripts/lib/typed-errors.cjs`
