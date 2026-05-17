Let me verify the existing implementation and review the exact cli-devin flag documentation.Good — the implementation is confirmed working. The hallucinated flag is properly rejected and the allowlist is enforced. Let me now run the formal sequential thinking and acceptance verification.Now let me run the formal acceptance verification across all criteria:All acceptance criteria pass. Here is the complete summary:

---

<details>
<summary><b>Pre-Plan</b></summary>

1. **Extract documented flag allowlist from cli-devin SKILL.md §3** — AC: every flag in `ALLOWLIST_VALUE_FLAGS` and `ALLOWLIST_BARE_FLAGS` matches the SKILL.md §3 flag table. Verify: `grep -c "Flag / Option" .opencode/skills/cli-devin/SKILL.md`
2. **Implement flag parsing in wrapper.sh** — AC: `bash -n wrapper.sh` exits 0; `--reasoning-effort` (space and `=` forms) is rejected. Verify: `bash -n wrapper.sh`
3. **Generate JSON verification report** — AC: `flag-verify.json` is valid JSON, `rejected` array contains `--reasoning-effort`, `dispatched_command` does not. Verify: `python3 -m json.tool flag-verify.json` and `python3 -c "..."` checks.

</details>

**Source citations:**

| Reference | Source |
|-----------|--------|
| Allowlist flags | `cli-devin SKILL.md:229` — `Flag / Option` table — `--model`, `--permission-mode`, `--prompt-file`, `--config`, `--print`, `-p`, `--continue`, `-c`, `--resume`, `--sandbox`, `--agent-config` |
| Hallucination rejection rule | `cli-devin SKILL.md:227` — "Common flag mistakes: there is no `--reasoning-effort` flag" |
| Task allowlist | User prompt: explicit 8-flag allowlist |

**Acceptance results:**

| Criterion | Result |
|-----------|--------|
| `ac-001` — hallucinated flag absent from dispatched command | **PASS** |
| `ac-002` — syntax-clean shell script | **PASS** (`bash -n` clean) |
| `ac-003` — verify report flags rejected flag | **PASS** |

**What `wrapper.sh` does (at `fixtures/fix-001-hallucinated-cli-flag/seed/wrapper.sh:46-146`):**

- Parses arguments one-by-one, classifying each as a value flag (checked against `ALLOWLIST_VALUE_FLAGS`), bare flag (checked against `ALLOWLIST_BARE_FLAGS`), or hallucinated.
- Handles both `--flag value` (space-separated) and `--flag=value` (`=` syntax) forms.
- Skips the value argument following a rejected hallucinated flag.
- Emits `flag-verify.json` with `received`, `accepted`, `rejected`, and `dispatched_command` fields.
- Dispatched command is `devin --model swe-1.6 --prompt-file task.txt` — free of hallucinated flags.