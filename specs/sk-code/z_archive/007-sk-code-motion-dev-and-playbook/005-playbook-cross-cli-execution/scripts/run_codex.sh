#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: $0 <SCENARIO_ID> <user_prompt>" >&2
  exit 2
fi

SCENARIO_ID="$1"
USER_PROMPT="$2"
CLI_NAME="codex"
MODEL_NAME="gpt-5.5"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PHASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../../.." && pwd)"
TEMPLATE="${PHASE_DIR}/prompts/universal_test_prompt.md"
RESULT_DIR="${PHASE_DIR}/results"
mkdir -p "${RESULT_DIR}"

RAW_OUT="/tmp/skc-${SCENARIO_ID}-${CLI_NAME}.txt"
RAW_ERR="/tmp/skc-${SCENARIO_ID}-${CLI_NAME}.err"
TIME_OUT="/tmp/skc-${SCENARIO_ID}-${CLI_NAME}.time"
RESULT_YAML="${RESULT_DIR}/${SCENARIO_ID}-${CLI_NAME}.yaml"

PROMPT="$(python3 - "$TEMPLATE" "$SCENARIO_ID" "$USER_PROMPT" <<'PY'
from pathlib import Path
import sys
template, sid, prompt = sys.argv[1:4]
text = Path(template).read_text()
print(text.replace("{SCENARIO_ID}", sid).replace("{USER_PROMPT}", prompt))
PY
)"

cd "$REPO_ROOT"
if [[ -z "${CODEX_HOME:-}" && ! -w "${HOME}/.codex/sessions" ]]; then
  export CODEX_HOME="/private/tmp/skc-codex-home"
  mkdir -p "$CODEX_HOME"
fi
set +e
TIMEFORMAT=%R
{ time codex exec "$PROMPT" --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only --skip-git-repo-check >"$RAW_OUT" 2>"$RAW_ERR"; } 2>"$TIME_OUT"
EXIT_CODE=$?
set -e
DURATION_S="$(tr -d '[:space:]' <"$TIME_OUT" 2>/dev/null || printf '0')"

python3 - "$SCENARIO_ID" "$CLI_NAME" "$MODEL_NAME" "$DURATION_S" "$EXIT_CODE" "$RAW_OUT" "$RAW_ERR" "$RESULT_YAML" <<'PY'
from pathlib import Path
import re, sys

sid, cli, model, duration, exit_code, raw_path, err_path, result_path = sys.argv[1:9]
raw = Path(raw_path).read_text(errors="replace") if Path(raw_path).exists() else ""
err = Path(err_path).read_text(errors="replace") if Path(err_path).exists() else ""
combined = raw + "\n" + err

def extract_yaml(text):
    m = re.search(r"```ya?ml\s*(.*?)```", text, re.S | re.I)
    if m:
        return m.group(1).strip()
    idx = text.find("scenario:")
    return text[idx:].strip() if idx >= 0 else ""

yaml_text = extract_yaml(raw)
quality_flags = []

def scalar(key, default="null"):
    m = re.search(rf"^{re.escape(key)}:\s*(.*?)\s*$", yaml_text, re.M)
    return m.group(1).strip().strip('"').strip("'") if m else default

def block_scalar(key):
    m = re.search(rf"^{re.escape(key)}:\s*[|>]\s*\n((?:[ \t]+.*\n?)*)", yaml_text, re.M)
    if not m:
        return ""
    lines = []
    for line in m.group(1).splitlines():
        if re.match(r"^\S", line):
            break
        lines.append(re.sub(r"^[ \t]{2}", "", line))
    return "\n".join(lines).strip()

def is_directory_placeholder(value):
    normalized = value.strip().strip('"').strip("'")
    return bool(
        normalized.endswith("/")
        or re.fullmatch(r"(?:references|assets)/[^/]+/?", normalized)
    )

def block_list(key):
    m = re.search(rf"^{re.escape(key)}:\s*\n((?:\s+-\s*.*\n?)*)", yaml_text, re.M)
    if not m:
        return []
    vals = []
    for line in m.group(1).splitlines():
        lm = re.match(r"\s+-\s*(.*)", line)
        if lm:
            value = lm.group(1).strip().strip('"').strip("'")
            if is_directory_placeholder(value):
                if key == "references_loaded":
                    quality_flags.append("directory_placeholder_refs")
                else:
                    quality_flags.append("directory_placeholder_assets")
                continue
            vals.append(value)
    return vals

def first_token(patterns):
    for p in patterns:
        m = re.search(p, combined, re.I)
        if m:
            return m.group(1)
    return "null"

def yaml_quote(value):
    if value in {"null", ""}:
        return "null"
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'

refs = block_list("references_loaded")
assets = block_list("assets_loaded")
excerpt_source = block_scalar("user_response") or scalar("user_response", "")
if excerpt_source.strip() in {"", "null", "|", ">"}:
    quality_flags.append("empty_excerpt")
    excerpt = "(no response)"
else:
    excerpt = excerpt_source.replace("\r", "").strip()[:700]
tokens_in = first_token([r"tokens[_ -]?in[:=]\s*(\d+)", r"input tokens[:=]\s*(\d+)"])
tokens_out = first_token([r"tokens[_ -]?out[:=]\s*(\d+)", r"output tokens[:=]\s*(\d+)"])

lines = [
    f"scenario: {yaml_quote(sid)}",
    f"cli: {yaml_quote(cli)}",
    f"model: {yaml_quote(model)}",
    f"duration_s: {duration or '0'}",
    f"exit_code: {exit_code}",
    f"tokens_in: {tokens_in}",
    f"tokens_out: {tokens_out}",
    f"advisor_top_1: {yaml_quote(scalar('advisor_top_1_skill'))}",
    f"surface: {yaml_quote(scalar('detected_surface'))}",
]
if refs:
    lines.append("refs_loaded:")
    lines.extend([f"  - {yaml_quote(v)}" for v in refs])
else:
    lines.append("refs_loaded: []")
if assets:
    lines.append("assets_loaded:")
    lines.extend([f"  - {yaml_quote(v)}" for v in assets])
else:
    lines.append("assets_loaded: []")
unique_flags = []
for flag in quality_flags:
    if flag not in unique_flags:
        unique_flags.append(flag)
flags = "[" + ", ".join(yaml_quote(flag) for flag in unique_flags) + "]"
lines += [
    f"quality_flags: {flags}",
    f"agent: {yaml_quote(scalar('agent_dispatched'))}",
    "response_excerpt: |",
]
lines.extend(["  " + line for line in (excerpt or "NO_RESPONSE").splitlines()])
lines += [
    "verdict: pending",
    f"raw_stdout: {yaml_quote(raw_path)}",
    f"raw_stderr: {yaml_quote(err_path)}",
]
Path(result_path).write_text("\n".join(lines) + "\n")
PY

exit "$EXIT_CODE"
