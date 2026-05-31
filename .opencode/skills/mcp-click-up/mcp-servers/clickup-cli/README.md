# clickup-cli

cupt CLI embedded in the mcp-click-up skill. cupt (ClickUP Terminal) is the primary tool for daily ClickUp task operations.

## Source

- **GitHub:** https://github.com/newz2000/cupt
- **PyPI:** https://pypi.org/project/cupt/

## Install

**Recommended — isolated environment via pipx:**
```bash
bash setup.sh
```

Or manually:
```bash
# macOS / Linux (recommended)
pipx install cupt

# Fallback
pip install --user cupt
```

**Verify:**
```bash
cupt --version   # → cupt 0.7.1
cupt status      # → workspace name + user
```

## Requirements

- Python 3.8+
- pipx (recommended) or pip

`requirements.txt` pins `cupt>=0.7.1` for use with `pip install -r requirements.txt`.

## Authenticate

```bash
cupt auth                          # Interactive wizard (OAuth or Personal API Token)
# OR:
cupt config --api-token pk_YOUR_TOKEN_HERE
```

Get your Personal API Token at https://app.clickup.com/settings/apps

See `../../INSTALL_GUIDE.md §3-§4` for full authentication and MCP config steps.
