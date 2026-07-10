# figma-cli

The silships figma-cli embedded in the mcp-figma skill. Published to npm as `figma-ds-cli`, it drives Figma Desktop from the terminal (read, author, modify, and export designs, tokens, and components) over a local daemon, with no Figma API key.

## Source

- **GitHub:** https://github.com/silships/figma-cli
- **npm (minimal 1.0.0 build):** https://www.npmjs.com/package/figma-ds-cli

## Naming trap (read first)

The canonical binary is `figma-ds-cli`. The npm package literally named `figma-cli` is an UNRELATED tool (unic/figma-cli, bin `figma`), so **never** `npm i -g figma-cli`. The full surface (safe connect, daemon, extract, the ~130-command set) is the repo build (1.2.0 or newer); npm publishes only the minimal 1.0.0.

## Install

```bash
bash setup.sh                 # auto: npm first, then upgrade from the silships repo when npm is stale
bash setup.sh --source repo   # force the full repo build
```

`setup.sh` delegates to the skill's canonical installer (`../../scripts/install.sh`), which never connects, never patches Figma, and never installs the unrelated figma-cli.

## Verify

```bash
figma-ds-cli --version        # expect >= 1.2.0
figma-ds-cli --help           # full command surface
```

## Requirements

- Node.js >= 18.
- Figma Desktop installed, open with a file at connect or run time.
- macOS is the supported baseline.

Connect modes (safe plugin bridge vs the gated yolo patch), the daemon, and the optional Framelink MCP are covered in `../../INSTALL_GUIDE.md` and `../../references/figma_cli_reference.md`.
