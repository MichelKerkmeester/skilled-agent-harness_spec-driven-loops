## Edit 1

File: `.skilled/commands/doctor/assets/doctor-update.yaml`

OLD:

~~~~text
          (.skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js does NOT exist),
          (find . -path './.opencode' -prune -o -name 'memory' -type d -print | grep -q .),
          (find specs -mindepth 2 -name 'spec.md' | first-match dirname has no description.json)
~~~~

NEW:

~~~~text
          (.skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js does NOT exist),
          (find . \( -path './.skilled' -o -path './.opencode' \) -prune -o -name 'memory' -type d -print | grep -q .),
          (find specs -mindepth 2 -name 'spec.md' | first-match dirname has no description.json)
~~~~
