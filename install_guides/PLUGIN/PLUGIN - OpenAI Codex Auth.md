# OpenCode OpenAI Codex Auth Plugin Installation Guide

A comprehensive guide to installing, configuring, and using the OpenCode OpenAI Codex Auth plugin - enabling OAuth authentication with your ChatGPT Plus/Pro subscription to access GPT-5.x models including GPT 5.2, GPT 5.1 Codex, Codex Max, and Codex Mini.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Package**: `opencode-openai-codex-auth`

---

## TABLE OF CONTENTS

0. [🤖 AI Install Guide](#0--ai-install-guide)
1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-️-configuration)
5. [🔐 AUTHENTICATION](#5--authentication)
6. [✅ VERIFICATION](#6--verification)
7. [🚀 USAGE](#7--usage)
8. [🎯 FEATURES](#8--features)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)
11. [⚠️ TERMS OF SERVICE](#11-️-terms-of-service)

---

## 0. 🤖 AI INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the OpenCode OpenAI Codex Auth plugin to access GPT-5.x models with my ChatGPT Plus/Pro subscription.

Please help me:
1. Verify I have OpenCode CLI installed (version 25.x+)
2. Add the plugin to my opencode.json with the correct version pinning
3. Configure the OpenAI provider models I want to use
4. Walk me through the OAuth authentication flow
5. Verify the installation is working with a test command
6. Show me how to use different GPT-5.x models

My ChatGPT subscription tier is: [Plus / Pro]
My preferred model family is: [GPT 5.2 / GPT 5.1 Codex / GPT 5.1 Codex Max / GPT 5.1 General]

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify OpenCode CLI is installed and up to date
- Add plugin to opencode.json with proper version pinning (@4.1.1 or later)
- Configure model definitions for your selected GPT-5.x models
- Guide you through the OAuth authentication process
- Check for port conflicts (port 1455) and resolve them
- Test model access with a sample command
- Show you model selection syntax and usage patterns

**Expected setup time:** 5-10 minutes

---

## 1. 📖 OVERVIEW

### What is OpenAI Codex Auth?

**OpenAI Codex Auth** is an OpenCode plugin that enables OAuth authentication with your ChatGPT Plus/Pro subscription, giving you access to GPT-5.x models through your existing subscription instead of requiring separate OpenAI Platform API credits.

[![npm version](https://img.shields.io/npm/v/opencode-openai-codex-auth.svg)](https://www.npmjs.com/package/opencode-openai-codex-auth)

**Repository**: https://github.com/numman-ali/opencode-openai-codex-auth

### Key Benefits

| Feature                        | Description                                             |
| ------------------------------ | ------------------------------------------------------- |
| **ChatGPT Plus/Pro OAuth**     | Use your existing subscription                          |
| **18 pre-configured models**   | GPT 5.2, GPT 5.1, Codex, Codex Max, Codex Mini variants |
| **Full image input support**   | All models support multimodal (text + image) input      |
| **Auto-refreshing tokens**     | Tokens stay valid without manual intervention           |
| **Prompt caching**             | Reuses responses across turns for efficiency            |
| **Zero external dependencies** | Lightweight plugin                                      |
| **Drop-in setup**              | OpenCode auto-installs the plugin from config           |

### What You Get

Access to GPT-5.x models through your ChatGPT Plus/Pro subscription:

**GPT 5.2 Family:**
- `gpt-5.2-none` / `gpt-5.2-low` / `gpt-5.2-medium` / `gpt-5.2-high` / `gpt-5.2-xhigh`

**GPT 5.1 Codex Max Family:**
- `gpt-5.1-codex-max-low` / `gpt-5.1-codex-max-medium` / `gpt-5.1-codex-max-high` / `gpt-5.1-codex-max-xhigh`

**GPT 5.1 Codex Family:**
- `gpt-5.1-codex-low` / `gpt-5.1-codex-medium` / `gpt-5.1-codex-high`

**GPT 5.1 Codex Mini Family:**
- `gpt-5.1-codex-mini-medium` / `gpt-5.1-codex-mini-high`

**GPT 5.1 General Family:**
- `gpt-5.1-none` / `gpt-5.1-low` / `gpt-5.1-medium` / `gpt-5.1-high`

### ChatGPT Plus/Pro Subscriptions

If you have a **ChatGPT Plus** ($20/month) or **ChatGPT Pro** ($200/month) subscription, you can use these models directly inside OpenCode - no additional API keys or credits needed.

Simply authenticate with your ChatGPT account during the OAuth flow to access these models with your subscription's quota.

---

## 2. 📋 PREREQUISITES

Before installing the OpenAI Codex Auth plugin, ensure you have:

### Required

- **OpenCode CLI** installed and working
  ```bash
  opencode --version
  # Should show version 25.x or higher
  ```

- **ChatGPT Plus or Pro subscription**
  - Plus: $20/month
  - Pro: $200/month (higher limits)

- **opencode.json** configuration file in your project or global config
  ```bash
  # Project config
  ls ./opencode.json
  
  # Or global config
  ls ~/.config/opencode/opencode.json
  ```

### Optional but Recommended

- **Web browser** for OAuth flow (auto-opens during login)

**Validation Checkpoint**
- [ ] OpenCode CLI installed (`opencode --version` returns 25.x+)
- [ ] ChatGPT Plus or Pro subscription active
- [ ] opencode.json file exists (project or global)

---

## 3. 📥 INSTALLATION

### Quick Start (2 Steps)

**Step 1: Add the plugin to your opencode.json**

Add to your `opencode.json` (project or global):

```json
{
  "plugin": ["opencode-openai-codex-auth@4.1.1"]
}
```

Or if you already have plugins:

```json
{
  "plugin": [
    "opencode-skills",
    "opencode-openai-codex-auth@4.1.1"
  ]
}
```

**Step 2: Authenticate**

```bash
opencode auth login
```

Select: **OpenAI** -> **ChatGPT Plus/Pro (Codex Subscription)**

Done! OpenCode auto-installs the plugin when you restart.

### Version Pinning (Required)

**OpenCode does NOT auto-update plugins.** Always pin versions for reliable updates:

**Correct** - pinned version:
```json
"plugin": ["opencode-openai-codex-auth@4.1.1"]
```

**Wrong** - won't auto-update:
```json
"plugin": ["opencode-openai-codex-auth"]
```

**Check for latest version:**
```bash
npm view opencode-openai-codex-auth version
```

### Upgrading to a New Version

Simply change the version in your config and restart OpenCode:

**Change from:**
```json
"plugin": ["opencode-openai-codex-auth@4.0.0"]
```

**To:**
```json
"plugin": ["opencode-openai-codex-auth@4.1.1"]
```

### If Stuck on an Old Version

Clear the cache:

```bash
rm -rf ~/.cache/opencode/node_modules ~/.cache/opencode/bun.lock
```

Then restart OpenCode with a pinned version.

**Validation Checkpoint**
- [ ] Plugin added to opencode.json with pinned version (@4.1.1 or later)
- [ ] Version number is explicit (not unpinned)
- [ ] OpenCode restarted after config change

---

## 4. ⚙️ CONFIGURATION

### Full Configuration (Recommended)

Add both the plugin and all model definitions to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-openai-codex-auth@4.1.1"],
  "provider": {
    "openai": {
      "options": {
        "reasoningEffort": "medium",
        "reasoningSummary": "auto",
        "textVerbosity": "medium",
        "include": ["reasoning.encrypted_content"],
        "store": false
      },
      "models": {
        "gpt-5.2-none": {
          "name": "GPT 5.2 None (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "none",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.2-low": {
          "name": "GPT 5.2 Low (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "low",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.2-medium": {
          "name": "GPT 5.2 Medium (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "medium",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.2-high": {
          "name": "GPT 5.2 High (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "high",
            "reasoningSummary": "detailed",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.2-xhigh": {
          "name": "GPT 5.2 Extra High (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "xhigh",
            "reasoningSummary": "detailed",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-max-low": {
          "name": "GPT 5.1 Codex Max Low (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "low",
            "reasoningSummary": "detailed",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-max-medium": {
          "name": "GPT 5.1 Codex Max Medium (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "medium",
            "reasoningSummary": "detailed",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-max-high": {
          "name": "GPT 5.1 Codex Max High (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "high",
            "reasoningSummary": "detailed",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-max-xhigh": {
          "name": "GPT 5.1 Codex Max Extra High (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "xhigh",
            "reasoningSummary": "detailed",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-low": {
          "name": "GPT 5.1 Codex Low (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "low",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-medium": {
          "name": "GPT 5.1 Codex Medium (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "medium",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-high": {
          "name": "GPT 5.1 Codex High (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "high",
            "reasoningSummary": "detailed",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-mini-medium": {
          "name": "GPT 5.1 Codex Mini Medium (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "medium",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-codex-mini-high": {
          "name": "GPT 5.1 Codex Mini High (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "high",
            "reasoningSummary": "detailed",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-none": {
          "name": "GPT 5.1 None (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "none",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-low": {
          "name": "GPT 5.1 Low (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "low",
            "reasoningSummary": "auto",
            "textVerbosity": "low",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-medium": {
          "name": "GPT 5.1 Medium (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "medium",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        },
        "gpt-5.1-high": {
          "name": "GPT 5.1 High (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "high",
            "reasoningSummary": "detailed",
            "textVerbosity": "high",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        }
      }
    }
  }
}
```

### Minimal Configuration

If you only need a specific model:

```json
{
  "plugin": ["opencode-openai-codex-auth@4.1.1"],
  "provider": {
    "openai": {
      "models": {
        "gpt-5.1-codex-medium": {
          "name": "GPT 5.1 Codex Medium (OAuth)",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "options": {
            "reasoningEffort": "medium",
            "reasoningSummary": "auto",
            "textVerbosity": "medium",
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        }
      }
    }
  }
}
```

### Configuration Locations

| Location    | File Path                          | Scope                |
| ----------- | ---------------------------------- | -------------------- |
| **Project** | `./opencode.json`                  | Current project only |
| **Global**  | `~/.config/opencode/opencode.json` | All projects         |

Project config takes precedence over global config.

### Configuration Options

| Setting            | Values                                     | Description                              |
| ------------------ | ------------------------------------------ | ---------------------------------------- |
| `reasoningEffort`  | `none`, `low`, `medium`, `high`, `xhigh`   | Reasoning depth (varies by model family) |
| `reasoningSummary` | `auto`, `concise`, `detailed`, `off`, `on` | Summary verbosity                        |
| `textVerbosity`    | `low`, `medium`, `high`                    | Output length                            |
| `include`          | Array of strings                           | Additional response fields               |
| `store`            | boolean                                    | Store conversation history               |

**Notes:**
- GPT 5.2 and GPT 5.1 support `none` reasoning
- Codex variants do NOT support `none` (auto-converts to `low`)
- Only GPT 5.2 and Codex Max support `xhigh` reasoning
- Codex Mini is limited to `medium`/`high`

**Validation Checkpoint**
- [ ] Plugin version pinned in config
- [ ] At least one model defined in `provider.openai.models`
- [ ] JSON syntax valid (`cat opencode.json | jq .`)

---

## 5. 🔐 AUTHENTICATION

### Critical Security Warnings

#### Port 1455 Conflict

Both OpenCode and external Codex CLI use port 1455 for OAuth callbacks. **This must be resolved before authentication.**

#### Token Storage Security

**Location:** `~/.opencode/tokens/` (encrypted)

**Security measures:**
- Tokens are encrypted at rest
- Never commit tokens to git
- Rotate tokens periodically

#### Debug Logging Risk

Debug logs may contain sensitive data including credentials.

**Log location:** `~/.opencode/logs/codex-plugin/`  
**Risk:** Credentials may be logged  
**Recommendation:** Only enable for troubleshooting, delete logs after

### Security Risk Summary

| Risk               | Mitigation                             |
| ------------------ | -------------------------------------- |
| ToS violation      | Use official APIs for production       |
| Token leakage      | Never commit `~/.opencode/tokens/`     |
| Port conflict      | Stop Codex CLI before auth             |
| Debug logging      | Delete logs after troubleshooting      |
| Subscription abuse | Personal use only, respect rate limits |

### Pre-Authentication Checklist

Before starting OAuth:

```bash
# 1. Check if port 1455 is in use
lsof -i :1455

# 2. Stop Codex CLI if running
pkill -f codex

# 3. Ensure no other OAuth flows are active
```

### OAuth Flow

1. **Start login**
   ```bash
   opencode auth login
   ```

2. **Select provider**
   - Choose **OpenAI**

3. **Select login method**
   - Choose **ChatGPT Plus/Pro (Codex Subscription)**

4. **Browser authentication**
   - Browser opens automatically
   - Sign in with your ChatGPT account
   - Authorize the application
   - Return to terminal

5. **Confirmation**
   - Terminal shows successful authentication
   - Tokens are stored securely

### Manual URL (if browser doesn't open)

If the browser doesn't open automatically, the terminal will display a URL. Copy and paste it into your browser manually.

### Token Storage

**Location:** `~/.opencode/tokens/`

**Security measures:**
- Tokens are encrypted at rest
- Auto-refresh before expiration
- Never commit to version control

**Add to `.gitignore`:**
```
~/.opencode/tokens/
```

**Token cleanup (if needed):**
```bash
# Remove all stored tokens
rm -rf ~/.opencode/tokens/

# Then re-authenticate
opencode auth login
```

**Validation Checkpoint**
- [ ] Port 1455 is free before auth
- [ ] OAuth flow completed successfully
- [ ] `opencode auth status` shows authenticated
- [ ] `~/.opencode/tokens/` exists with token files

---

## 6. ✅ VERIFICATION

### Check 1: Plugin Loaded

Restart OpenCode and check for any plugin errors in the output.

### Check 2: Authentication Status

```bash
opencode auth status
```

Should show OpenAI/ChatGPT as authenticated.

### Check 3: Model Availability

```bash
opencode run "Hello" --model=openai/gpt-5.1-codex-medium
```

Should execute without authentication errors.

### Check 4: List Available Models

In OpenCode, press `Ctrl+X` then `M` (or your configured model list keybind) to see GPT-5.x models listed with "(OAuth)" suffix.

**Validation Checkpoint**
- [ ] Plugin loads without errors on startup
- [ ] `opencode auth status` shows OpenAI authenticated
- [ ] Test command executes successfully
- [ ] OAuth models appear in model list

---

## 7. 🚀 USAGE

### Running with Specific Models

```bash
# GPT 5.2 variants
opencode run "Quick question" --model=openai/gpt-5.2-low
opencode run "Complex analysis" --model=openai/gpt-5.2-high
opencode run "Research-grade reasoning" --model=openai/gpt-5.2-xhigh

# GPT 5.1 Codex Max variants (large context, deep reasoning)
opencode run "Large refactor" --model=openai/gpt-5.1-codex-max-high
opencode run "Multi-hour agent loop" --model=openai/gpt-5.1-codex-max-xhigh

# GPT 5.1 Codex variants (code-focused)
opencode run "Fast code generation" --model=openai/gpt-5.1-codex-low
opencode run "Complex code with tools" --model=openai/gpt-5.1-codex-high

# GPT 5.1 Codex Mini variants (lightweight)
opencode run "Balanced task" --model=openai/gpt-5.1-codex-mini-medium

# GPT 5.1 General variants
opencode run "Quick response" --model=openai/gpt-5.1-low
opencode run "Deep analysis" --model=openai/gpt-5.1-high
```

### Interactive Mode

```bash
# Start OpenCode
opencode

# Switch models with keybind (default: Ctrl+X, M)
# Select from list including OAuth models
```

### Model Selection Syntax

```
openai/<model-name>
```

Examples:
- `openai/gpt-5.2-high`
- `openai/gpt-5.1-codex-max-xhigh`
- `openai/gpt-5.1-codex-medium`

### Using in Custom Commands

**Important**: Always include the `openai/` prefix:

```yaml
# Correct
model: openai/gpt-5.1-codex-low

# Wrong - will fail
model: gpt-5.1-codex-low
```

---

## 8. 🎯 FEATURES

### Available Models

#### GPT 5.2 Models

| CLI Model ID     | Display Name               | Reasoning | Best For          |
| ---------------- | -------------------------- | --------- | ----------------- |
| `gpt-5.2-none`   | GPT 5.2 None (OAuth)       | None      | Fastest responses |
| `gpt-5.2-low`    | GPT 5.2 Low (OAuth)        | Low       | Quick tasks       |
| `gpt-5.2-medium` | GPT 5.2 Medium (OAuth)     | Medium    | Balanced          |
| `gpt-5.2-high`   | GPT 5.2 High (OAuth)       | High      | Complex reasoning |
| `gpt-5.2-xhigh`  | GPT 5.2 Extra High (OAuth) | xHigh     | Deep analysis     |

#### GPT 5.1 Codex Max Models

| CLI Model ID               | Display Name                         | Reasoning | Best For                |
| -------------------------- | ------------------------------------ | --------- | ----------------------- |
| `gpt-5.1-codex-max-low`    | GPT 5.1 Codex Max Low (OAuth)        | Low       | Fast large-context work |
| `gpt-5.1-codex-max-medium` | GPT 5.1 Codex Max Medium (OAuth)     | Medium    | Balanced large builds   |
| `gpt-5.1-codex-max-high`   | GPT 5.1 Codex Max High (OAuth)       | High      | Large refactors         |
| `gpt-5.1-codex-max-xhigh`  | GPT 5.1 Codex Max Extra High (OAuth) | xHigh     | Multi-hour agent loops  |

#### GPT 5.1 Codex Models

| CLI Model ID           | Display Name                 | Reasoning | Best For             |
| ---------------------- | ---------------------------- | --------- | -------------------- |
| `gpt-5.1-codex-low`    | GPT 5.1 Codex Low (OAuth)    | Low       | Fast code generation |
| `gpt-5.1-codex-medium` | GPT 5.1 Codex Medium (OAuth) | Medium    | Balanced code tasks  |
| `gpt-5.1-codex-high`   | GPT 5.1 Codex High (OAuth)   | High      | Complex code & tools |

#### GPT 5.1 Codex Mini Models

| CLI Model ID                | Display Name                      | Reasoning | Best For                |
| --------------------------- | --------------------------------- | --------- | ----------------------- |
| `gpt-5.1-codex-mini-medium` | GPT 5.1 Codex Mini Medium (OAuth) | Medium    | Lightweight Codex       |
| `gpt-5.1-codex-mini-high`   | GPT 5.1 Codex Mini High (OAuth)   | High      | Mini with max reasoning |

#### GPT 5.1 General Models

| CLI Model ID     | Display Name           | Reasoning | Best For        |
| ---------------- | ---------------------- | --------- | --------------- |
| `gpt-5.1-none`   | GPT 5.1 None (OAuth)   | None      | Fastest         |
| `gpt-5.1-low`    | GPT 5.1 Low (OAuth)    | Low       | Quick responses |
| `gpt-5.1-medium` | GPT 5.1 Medium (OAuth) | Medium    | General purpose |
| `gpt-5.1-high`   | GPT 5.1 High (OAuth)   | High      | Deep reasoning  |

#### Model Limits

All models share:
- **Context**: 272,000 tokens
- **Output**: 128,000 tokens
- **Input Modalities**: Text + Image

---

## 9. 🔧 TROUBLESHOOTING

### Authentication Failed

**Problem**: OAuth flow fails or times out

**Solutions**:
1. Stop Codex CLI if running (uses same port 1455)
   ```bash
   pkill -f codex
   lsof -i :1455  # Verify port is free
   ```
2. Check internet connection
3. Try again with a different browser
4. Clear browser cookies for OpenAI/ChatGPT

### Plugin Not Loading

**Problem**: Plugin errors on startup

**Solutions**:
```bash
# Check JSON syntax
cat opencode.json | jq .

# Verify plugin version exists
npm view opencode-openai-codex-auth versions

# Clear plugin cache
rm -rf ~/.cache/opencode/node_modules ~/.cache/opencode/bun.lock

# Use latest version
"plugin": ["opencode-openai-codex-auth@4.1.1"]
```

### Model Not Found

**Problem**: Model returns "not found" error

**Solutions**:
1. Verify model is defined in `provider.openai.models`
2. Check model name spelling (case-sensitive)
3. Include `openai/` prefix (e.g., `--model=openai/gpt-5.1-codex-medium`)
4. Ensure authentication is complete

### 401 Unauthorized

**Problem**: Requests fail with authentication errors

**Solutions**:
```bash
# Re-authenticate
opencode auth logout
opencode auth login
# Select OpenAI -> ChatGPT Plus/Pro (Codex Subscription)
```

### Rate Limits Reached

**Problem**: "Rate limit exceeded" or similar errors

**Solutions**:
- Wait for the rate limit window to reset (shown in error message)
- ChatGPT Plus has lower limits than Pro
- Consider upgrading to ChatGPT Pro for higher limits

### "Item not found" Errors

**Problem**: Generic API errors

**Solutions**:
- Update to latest plugin version
- GPT 5.0 models are deprecated - use 5.1 or 5.2

### Debug Mode

Enable detailed logging to diagnose issues:

```bash
DEBUG_CODEX_PLUGIN=1 opencode run "your prompt"
```

For full request/response logs:

```bash
ENABLE_PLUGIN_REQUEST_LOGGING=1 opencode run "your prompt"
```

**Log location:** `~/.opencode/logs/codex-plugin/`

> **Security Warning**: Debug logs may contain sensitive data including credentials. Delete logs after troubleshooting.
> ```bash
> rm -rf ~/.opencode/logs/codex-plugin/
> ```

---

## 10. 📚 RESOURCES

### Official Links

- **Plugin Repository**: https://github.com/numman-ali/opencode-openai-codex-auth
- **npm Package**: https://www.npmjs.com/package/opencode-openai-codex-auth
- **Plugin Documentation**: https://numman-ali.github.io/opencode-openai-codex-auth/
- **OpenCode Docs**: https://opencode.ai/docs
- **OpenCode Plugins**: https://opencode.ai/docs/plugins/

### Quick Reference Commands

```bash
# Authenticate
opencode auth login
# -> OpenAI -> ChatGPT Plus/Pro (Codex Subscription)

# Check auth status
opencode auth status

# Logout
opencode auth logout

# Run with specific model
opencode run "prompt" --model=openai/gpt-5.1-codex-medium

# Enable debug logging
DEBUG_CODEX_PLUGIN=1 opencode

# Full request logging (contains sensitive data)
ENABLE_PLUGIN_REQUEST_LOGGING=1 opencode

# Clear plugin cache
rm -rf ~/.cache/opencode/node_modules ~/.cache/opencode/bun.lock

# Clear tokens
rm -rf ~/.opencode/tokens/

# Clear debug logs
rm -rf ~/.opencode/logs/codex-plugin/
```

### Configuration Checklist

**Validation Checkpoint**
- [ ] Plugin added to opencode.json with pinned version
- [ ] OpenAI provider models configured
- [ ] OAuth authentication completed
- [ ] Model access verified
- [ ] Token storage secured (not in git)
- [ ] Debug logs cleaned up after troubleshooting

---

## 11. ⚠️ TERMS OF SERVICE

### Acknowledgement

By using this plugin, you acknowledge:

- This plugin uses **OpenAI's official OAuth authentication** (same as official Codex CLI)
- You are responsible for ensuring compliance with OpenAI's Terms of Use
- Your usage should align with your ChatGPT subscription's intended purpose

### Intended Use

- **Personal development** and coding assistance
- **Individual productivity** with your own subscription
- Respecting OpenAI's rate limits and usage policies

### Not Suitable For

- Commercial API resale or white-labeling
- High-volume automated extraction beyond personal use
- Applications serving multiple users with one subscription
- Any use that violates OpenAI's acceptable use policies

**For production applications or commercial use, use the [OpenAI Platform API](https://platform.openai.com/) with proper API keys.**

### Rate Limits

Rate limits are determined by:
- Your subscription tier (Plus vs Pro)
- Enforced server-side through OAuth tokens
- The plugin cannot and does not bypass these limits

**Use at your own risk and responsibility.**

---

**Installation Complete!**

You now have the OpenAI Codex Auth plugin installed and configured. Access GPT-5.x models through your ChatGPT Plus/Pro subscription by selecting them in OpenCode or using the `--model` flag.

For more information, see the [plugin repository](https://github.com/numman-ali/opencode-openai-codex-auth).