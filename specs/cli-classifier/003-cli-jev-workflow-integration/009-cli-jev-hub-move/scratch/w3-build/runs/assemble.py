#!/usr/bin/env python3
"""Wrap a task body in the verbatim shared blocks: PREAMBLE, PERSONA, task, RUN CONTEXT, DON'T, HANDBACK."""
import re, sys
SHARED = "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/shared-blocks.md"
PHASE = "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move"
text = open(SHARED).read()
def block(title):
    m = re.search(r"## " + re.escape(title) + r".*?\n```text\n(.*?)\n```", text, re.S)
    return m.group(1).replace("<phase folder path>", PHASE)
persona_kind, body_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
persona = block("PERSONA: code" if persona_kind == "code" else "PERSONA: markdown")
body = open(body_path).read().rstrip("\n")
parts = [block("PREAMBLE"), persona, body, block("RUN CONTEXT"), block("DON'T"), block("HANDBACK")]
brief = "\n\n".join(parts) + "\n"
open(out_path, "w").write(brief)
n = brief.count("\n")
print(f"{out_path}: {n} lines")
if n >= 90:
    sys.exit(f"TOO LONG: {n} lines")
if "\u2014" in brief:
    sys.exit("EM DASH in brief")
