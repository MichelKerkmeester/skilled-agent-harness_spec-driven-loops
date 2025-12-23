# OpenCode Antigravity Auth Plugin Installation Guide

A comprehensive guide to installing, configuring, and using the OpenCode Antigravity Auth plugin - enabling authentication with Google's Antigravity OAuth to access models like `gemini-3-pro-high` and `claude-opus-4-5-thinking`.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to set up the Antigravity Auth plugin for OpenCode.

Please help me:
1. Add the plugin to my opencode.json config
2. Add the Google provider with Antigravity model configurations
3. Walk me through the authentication process (opencode auth login)
4. Test that I can use the Antigravity models

My opencode.json is located at: [your project path]/opencode.json

Guide me through each step and show me what to add.
```

**What the AI will do:**
- Add the plugin reference to your `opencode.json`
- Configure the Google provider with available Antigravity models
- Guide you through OAuth authentication with Google
- Help you test model access

---

#### 📋 TABLE OF CONTENTS

- [1. 🔎 OVERVIEW](#1--overview)
- [2. 📋 PREREQUISITES](#2--prerequisites)
- [3. 📦 INSTALLATION](#3--installation)
- [4. ⚙️ CONFIGURATION](#4-️-configuration)
- [5. 🔐 AUTHENTICATION](#5--authentication)
- [6. ✅ VERIFICATION](#6--verification)
- [7. 🚀 USAGE](#7--usage)
- [8. 🤖 AVAILABLE MODELS](#8--available-models)
- [9. 🔧 TROUBLESHOOTING](#9--troubleshooting)
- [10. 📚 RESOURCES](#10--resources)

---

## 1. 🔎 OVERVIEW

### What is Antigravity Auth?

**Antigravity Auth** is an OpenCode plugin that enables OAuth authentication with Google's Antigravity service, giving you access to premium AI models through your Google credentials.

[![npm version](https://img.shields.io/npm/v/opencode-antigravity-auth.svg)](https://www.npmjs.com/package/opencode-antigravity-auth)

**Repository**: https://github.com/NoeFabris/opencode-antigravity-auth

### Key Benefits

| Feature | Description |
|---------|-------------|
| **Google OAuth sign-in** | Authenticate with your Google account |
| **Automatic token refresh** | Tokens stay valid without manual intervention |
| **Antigravity API compatibility** | OpenAI-style requests work seamlessly |
| **Access premium models** | Use Gemini 3 Pro, Claude Opus 4.5 Thinking, etc. |
| **Drop-in setup** | OpenCode auto-installs the plugin from config |

### What You Get

Access to models through Antigravity rate limits:
- `gemini-3-pro-high` / `gemini-3-pro-low`
- `claude-sonnet-4-5` / `claude-sonnet-4-5-thinking`
- `claude-opus-4-5-thinking`
- `gpt-oss-120b-medium`

### Google Workspace Accounts

**If you have a Google Workspace (company/organization) account**, you likely already have Antigravity usage quota included. This means you can use premium models like Claude Opus 4.5 Thinking directly inside OpenCode through your company Google account - no additional API keys or subscriptions needed.

Simply authenticate with your `@company.com` Google account during the OAuth flow to access these models with your organization's quota.

---

## 2. 📋 PREREQUISITES

Before installing the Antigravity Auth plugin, ensure you have:

### Required

- **OpenCode CLI** installed and working
  ```bash
  opencode --version
  # Should show version 25.x or higher
  ```

- **Google Account** with access to Antigravity services
  - **Tip**: Google Workspace (company) accounts often have Antigravity quota included

- **opencode.json** configuration file in your project or global config
  ```bash
  # Project config
  ls ./opencode.json
  
  # Or global config
  ls ~/.config/opencode/opencode.json
  ```

### Optional but Recommended

- **Web browser** for OAuth flow (auto-opens during login)

---

## 3. 📦 INSTALLATION

### Quick Start (2 Steps)

**Step 1: Add the plugin to your opencode.json**

Add to your `opencode.json` (project or global):

```json
{
  "plugin": ["opencode-antigravity-auth@1.0.7"]
}
```

Or if you already have plugins:

```json
{
  "plugin": [
    "opencode-skills",
    "opencode-antigravity-auth@1.0.7"
  ]
}
```

**Step 2: Authenticate**

```bash
opencode auth login
```

Select: **Google** → **OAuth with Google (Antigravity)**

Done! OpenCode auto-installs the plugin when you restart.

---

## 4. ⚙️ CONFIGURATION

### Full Configuration Example

Add both the plugin and model definitions to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@1.0.7"],
  "provider": {
    "google": {
      "models": {
        "gemini-3-pro-high": {
          "name": "Gemini 3 Pro High (Antigravity)",
          "limit": {
            "context": 1048576,
            "output": 65535
          }
        },
        "gemini-3-pro-low": {
          "name": "Gemini 3 Pro Low (Antigravity)",
          "limit": {
            "context": 1048576,
            "output": 65535
          }
        },
        "claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": {
            "context": 200000,
            "output": 64000
          }
        },
        "claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": {
            "context": 200000,
            "output": 64000
          }
        },
        "claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": {
            "context": 200000,
            "output": 64000
          }
        },
        "gpt-oss-120b-medium": {
          "name": "GPT-OSS 120B Medium (Antigravity)",
          "limit": {
            "context": 131072,
            "output": 32768
          }
        }
      }
    }
  }
}
```

### Minimal Configuration

If you only need specific models:

```json
{
  "plugin": ["opencode-antigravity-auth@1.0.7"],
  "provider": {
    "google": {
      "models": {
        "gemini-3-pro-high": {
          "name": "Gemini 3 Pro High (Antigravity)",
          "limit": {
            "context": 1048576,
            "output": 65535
          }
        }
      }
    }
  }
}
```

### Configuration Locations

| Location | File Path | Scope |
|----------|-----------|-------|
| **Project** | `./opencode.json` | Current project only |
| **Global** | `~/.config/opencode/opencode.json` | All projects |

Project config takes precedence over global config.

---

## 5. 🔐 AUTHENTICATION

### OAuth Flow

1. **Start login**
   ```bash
   opencode auth login
   ```

2. **Select provider**
   - Choose **Google**

3. **Select login method**
   - Choose **OAuth with Google (Antigravity)**

4. **Browser authentication**
   - Browser opens automatically
   - Sign in with your Google account
   - **Tip**: Use your Google Workspace (company) account if available - it likely has Antigravity quota included, giving you access to models like Claude Opus inside OpenCode
   - Authorize the application
   - Return to terminal

5. **Confirmation**
   - Terminal shows successful authentication
   - Tokens are stored securely

### Manual URL (if browser doesn't open)

If the browser doesn't open automatically, the terminal will display a URL. Copy and paste it into your browser manually.

### Token Management

Tokens are automatically:
- Stored securely by OpenCode
- Refreshed when they expire
- Used for all Antigravity API requests

---

## 6. ✅ VERIFICATION

### Check 1: Plugin Loaded

Restart OpenCode and check for any plugin errors in the output.

### Check 2: Authentication Status

```bash
opencode auth status
```

Should show Google/Antigravity as authenticated.

### Check 3: Model Availability

```bash
opencode run "Hello" --model=google/gemini-3-pro-high
```

Should execute without authentication errors.

### Check 4: List Available Models

In OpenCode, press `Ctrl+X` then `M` (or your configured model list keybind) to see Antigravity models listed.

---

## 7. 🚀 USAGE

### Running with Specific Models

```bash
# Gemini 3 Pro High
opencode run "Explain quantum computing" --model=google/gemini-3-pro-high

# Claude Opus 4.5 Thinking
opencode run "Solve this math problem" --model=google/claude-opus-4-5-thinking

# Claude Sonnet 4.5
opencode run "Write a Python function" --model=google/claude-sonnet-4-5
```

### Interactive Mode

```bash
# Start OpenCode
opencode

# Switch models with keybind (default: Ctrl+X, M)
# Select from list including Antigravity models
```

### Model Selection Syntax

```
google/<model-name>
```

Examples:
- `google/gemini-3-pro-high`
- `google/claude-opus-4-5-thinking`
- `google/gpt-oss-120b-medium`

---

## 8. 🤖 AVAILABLE MODELS

### Gemini Models

| Model | Context | Output | Best For |
|-------|---------|--------|----------|
| `gemini-3-pro-high` | 1M tokens | 65K tokens | Complex reasoning, large context |
| `gemini-3-pro-low` | 1M tokens | 65K tokens | Faster responses, simpler tasks |

### Claude Models

| Model | Context | Output | Best For |
|-------|---------|--------|----------|
| `claude-sonnet-4-5` | 200K tokens | 64K tokens | Balanced performance |
| `claude-sonnet-4-5-thinking` | 200K tokens | 64K tokens | Step-by-step reasoning |
| `claude-opus-4-5-thinking` | 200K tokens | 64K tokens | Complex analysis, deep reasoning |

### GPT Models

| Model | Context | Output | Best For |
|-------|---------|--------|----------|
| `gpt-oss-120b-medium` | 131K tokens | 32K tokens | General purpose |

---

## 9. 🔧 TROUBLESHOOTING

### Authentication Failed

**Problem**: OAuth flow fails or times out

**Solutions**:
1. Check internet connection
2. Try again with a different browser
3. Clear browser cookies for Google accounts
4. Check if Antigravity service is available

### Plugin Not Loading

**Problem**: Plugin errors on startup

**Solutions**:
```bash
# Check JSON syntax
cat opencode.json | jq .

# Verify plugin version exists
npm view opencode-antigravity-auth versions

# Try latest version
"plugin": ["opencode-antigravity-auth@latest"]
```

### Model Not Found

**Problem**: Model returns "not found" error

**Solutions**:
1. Verify model is defined in `provider.google.models`
2. Check model name spelling (case-sensitive)
3. Ensure authentication is complete

### Token Expired

**Problem**: Requests fail with authentication errors

**Solutions**:
```bash
# Re-authenticate
opencode auth logout
opencode auth login
# Select Google → OAuth with Google (Antigravity)
```

### Debug Mode

Enable verbose logging to diagnose issues:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode
```

Logs are written to `antigravity-debug-<timestamp>.log` in the current directory.

---

## 10. 📚 RESOURCES

### Official Links

- **Plugin Repository**: https://github.com/NoeFabris/opencode-antigravity-auth
- **npm Package**: https://www.npmjs.com/package/opencode-antigravity-auth
- **OpenCode Docs**: https://opencode.ai/docs
- **OpenCode Plugins**: https://opencode.ai/docs/plugins/

### Quick Reference Commands

```bash
# Authenticate
opencode auth login
# → Google → OAuth with Google (Antigravity)

# Check auth status
opencode auth status

# Logout
opencode auth logout

# Run with specific model
opencode run "prompt" --model=google/gemini-3-pro-high

# Enable debug logging
export OPENCODE_ANTIGRAVITY_DEBUG=1
```

### Configuration Checklist

```
[ ] Plugin added to opencode.json
[ ] Google provider models configured
[ ] OAuth authentication completed
[ ] Model access verified
```

---

## ⚠️ Warnings and Disclaimers

### Terms of Service Risk

By using this plugin, you acknowledge:

- This approach may violate the Terms of Service of AI model providers (Anthropic, OpenAI, Google, etc.)
- You are solely responsible for ensuring compliance with all applicable terms and policies
- Providers may detect this usage pattern and take action including suspension or ban

### Intended Use

- Personal / internal development only
- Respect internal quotas and data handling policies
- Not for production services or bypassing intended limits

### Not Suitable For

- Production application traffic
- High-volume automated extraction
- Any use that violates Acceptable Use Policies

**Use at your own risk.**

---

## ⚡ Quick Reference

### Essential Setup

```json
{
  "plugin": ["opencode-antigravity-auth@1.0.7"],
  "provider": {
    "google": {
      "models": {
        "gemini-3-pro-high": {
          "name": "Gemini 3 Pro High (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 }
        }
      }
    }
  }
}
```

### Essential Commands

```bash
# Login
opencode auth login

# Use model
opencode run "Hello" --model=google/gemini-3-pro-high

# Debug
export OPENCODE_ANTIGRAVITY_DEBUG=1
```

---

**Installation Complete!**

You now have the Antigravity Auth plugin installed and configured. Access premium AI models through your Google credentials by selecting them in OpenCode or using the `--model` flag.

For more information, see the [plugin repository](https://github.com/NoeFabris/opencode-antigravity-auth).
