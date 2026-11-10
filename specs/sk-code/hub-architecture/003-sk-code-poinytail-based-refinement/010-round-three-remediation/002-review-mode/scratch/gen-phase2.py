"""Print the Phase 2 task lines for tasks.md from dispatch-units.json.

Run from the repository root, before any Phase 2 edit, so line numbers match:
    python3 -I <this file>
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
EDIT = re.compile(r"^In (\S+), replace the exact text <<<OLD\n(.*)\nOLD>>> with <<<NEW\n(.*)\nNEW>>>$", re.S)
PACKET = ".skilled/skills/sk-code/sk-code-review/"


def code(text):
    return f"`` {text} ``" if "`" in text else f"`{text}`"


def trim(text, limit=60):
    """Cut a quote short without leaving an inline-code span open."""
    cut = text[:limit]
    if cut.count("`") % 2:
        end = text.find("`", limit)
        cut = text[: end + 1] if end != -1 else text
    return cut


def main():
    units = json.loads((HERE / "dispatch-units.json").read_text(encoding="utf-8"))
    state = {}
    for unit in units:
        file = unit["files"][0]
        short = file.replace(PACKET, "")
        check = f"Check: {code(unit['check'])} prints {code(unit['expect'])}."
        if unit["kind"] == "create":
            source = unit["instruction"].split("content of ", 1)[1]
            print(f"- [ ] {unit['task']} Create `{short}` as an exact copy of `{source.split('/scratch/', 1)[1] if '/scratch/' in source else source}` in this folder's `scratch/` (use `cp`). {check} (`{file}`)")
            continue
        _, old, new = EDIT.match(unit["instruction"]).groups()
        text = state.setdefault(file, Path(file).read_text(encoding="utf-8"))
        line = text[: text.index(old)].count("\n") + 1
        state[file] = text.replace(old, new, 1)
        old_body = old.rstrip("\n")
        if "](" in old or "](" in new:
            # Spec validators read a quoted Markdown link as a live link, so these units are described, not quoted.
            first = old_body.split("\n")[0]
            anchor = first.split("](")[0] if "](" in first else first
            body = (
                f"Apply unit {unit['task']} of `scratch/dispatch-units.json` to `{short}`: its OLD text is the line at line {line} "
                f"that begins {code(trim(anchor))}; replace it with the unit's NEW text "
                f"({len(new.rstrip(chr(10)).split(chr(10)))} line{'s' if chr(10) in new.rstrip(chr(10)) else ''}), copied exactly. Both texts contain Markdown links, so they are not repeated here."
            )
        elif "\n" not in old_body and new.endswith(old) and new != old:
            added = new[: -len(old)].rstrip("\n")
            n = added.count("\n") + 1
            if n == 1 and "\n" not in added:
                body = f"In `{short}`, insert this line directly above the line {code(old_body)} (line {line}): {code(added)}."
            else:
                body = (
                    f"Apply unit {unit['task']} of `scratch/dispatch-units.json` to `{short}`: insert {n} new lines directly above the line "
                    f"{code(old_body)} (line {line}). The unit's NEW text is those lines followed by that unchanged line; copy them exactly."
                )
        elif "\n" not in old_body and new.startswith(old_body + "\n"):
            added = new[len(old_body) + 1 :]
            if "\n" not in added.strip("\n"):
                body = f"In `{short}`, after the line {code(old_body)} (line {line}), insert {'one blank line and then ' if added.startswith(chr(10)) else ''}this line: {code(added.strip(chr(10)))}."
            else:
                body = (
                    f"Apply unit {unit['task']} of `scratch/dispatch-units.json` to `{short}`: after the line {code(old_body)} (line {line}), "
                    f"insert the {added.count(chr(10)) + 1} lines that follow it in the unit's NEW text, copied exactly."
                )
        elif "\n" not in old_body:
            body = (
                f"Apply unit {unit['task']} of `scratch/dispatch-units.json` to `{short}`: replace the text {code(old_body)} on line {line} "
                f"with the unit's NEW text, which spans {len(new.split(chr(10)))} lines, copied exactly."
            )
        elif "\n" in old or "\n" in new:
            old_lines = old.split("\n")
            body = (
                f"Apply unit {unit['task']} of `scratch/dispatch-units.json` to `{short}`: replace the {len(old.rstrip(chr(10)).split(chr(10)))}-line block at line {line} "
                f"that starts {code(old_lines[0])} and ends {code(old.rstrip(chr(10)).split(chr(10))[-1])} with the unit's NEW text "
                f"({len(new.split(chr(10)))} lines), copied exactly."
            )
        else:
            body = f"In `{short}` line {line}, replace {code(old)} with {code(new)}."
        print(f"- [ ] {unit['task']} {body} {check} (`{file}`)")


if __name__ == "__main__":
    main()
