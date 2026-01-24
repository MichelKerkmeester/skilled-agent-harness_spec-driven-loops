# OpenCode VS Code Extension Installation Guide

Complete installation guide for setting up OpenCode in Visual Studio Code and connecting your GitHub Copilot account. Written for non-technical users who want to use AI-powered coding assistance. Covers extension installation (automatic and manual methods), GitHub Copilot authentication, and model selection. Perfect for marketers, content creators, and anyone new to AI coding tools.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install OpenCode in VS Code and connect my GitHub Copilot account.

I'm not very technical, so please guide me step-by-step with simple language.

Please help me:
1. Check if I have VS Code installed
2. Install OpenCode on my computer
3. Set up the OpenCode extension in VS Code
4. Connect my GitHub Copilot subscription to OpenCode
5. Test that everything works

My computer is: [Mac / Windows / Linux]
I [do / don't] have a GitHub Copilot subscription

Guide me through each step and tell me exactly what I should see on my screen.
```

**What the AI will do:**
- Check your computer has the right software
- Install OpenCode using a simple command
- Set up the VS Code extension automatically
- Walk you through connecting GitHub Copilot
- Test everything works with a simple example

**Expected setup time:** 10-15 minutes

---

## 📋 TABLE OF CONTENTS

0. [🤖 AI-FIRST INSTALL GUIDE](#-ai-first-install-guide)
1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-️-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🔧 TROUBLESHOOTING](#7--troubleshooting)
8. [📚 RESOURCES](#8--resources)

---

## 1. 📖 OVERVIEW

### What is OpenCode?

**OpenCode** is like having a super-smart coding assistant right inside your code editor. Think of it as a helpful colleague who can:

- ✨ **Write code for you** - Just describe what you want in plain English
- 🔍 **Explain code** - Don't understand something? Ask and it explains
- 🐛 **Fix problems** - It can spot and fix errors in your code
- 💡 **Suggest improvements** - Get ideas to make your code better

### Why Use OpenCode with GitHub Copilot?

If you already pay for **GitHub Copilot** (the AI coding assistant from GitHub), you can use that same subscription with OpenCode! This means:

- 💰 **No extra cost** - Use your existing Copilot subscription
- 🔄 **Same AI, better interface** - OpenCode gives you more control
- 🎯 **More features** - Plan mode, undo/redo, sharing, and more

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        VS Code                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Your Code Files                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 OpenCode (Terminal)                       │  │
│  │  "Add a button that says Hello"                           │  │
│  │  → OpenCode writes the code for you!                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    GitHub Copilot AI
                   (Your subscription)
```

### Core Principle

> **Install once, verify at each step.** Each phase has a checkpoint - don't move forward until you see the expected result. This prevents frustration!

---

## 2. 📋 PREREQUISITES

**Phase 1** focuses on making sure you have everything you need before we start.

### What You Need

#### 1. Visual Studio Code (VS Code)

This is the code editor where you'll use OpenCode.

**Check if you have it:**
- Look for a blue icon with `><` on your computer
- Or search for "Visual Studio Code" in your applications

**Don't have it?** Download free from: [code.visualstudio.com](https://code.visualstudio.com/)

#### 2. A GitHub Account

You need this to connect GitHub Copilot.

**Check if you have one:**
- Go to [github.com](https://github.com)
- Can you log in? ✅ You're good!

**Don't have one?** Sign up free at: [github.com/signup](https://github.com/signup)

#### 3. GitHub Copilot Subscription (Recommended)

This gives you access to powerful AI models.

| Plan             | Cost      | Best For                  |
| ---------------- | --------- | ------------------------- |
| **Copilot Free** | $0/month  | Trying it out (limited)   |
| **Copilot Pro**  | $10/month | Individual users          |
| **Copilot Pro+** | $39/month | Power users (more models) |

**Check your subscription:**
1. Go to [github.com/settings/copilot](https://github.com/settings/copilot)
2. Look for your current plan

**Don't have Copilot?** You can still use OpenCode with other AI providers (like OpenCode Zen), but this guide focuses on GitHub Copilot.

### Validation: `phase_1_complete`

**Checklist - Can you answer YES to all of these?**

- [ ] I have VS Code installed and can open it
- [ ] I have a GitHub account and can log in
- [ ] I know my GitHub Copilot subscription status

❌ **STOP if validation fails** - Get VS Code and a GitHub account before continuing.

---

## 3. 📥 INSTALLATION

This section covers **Phase 2 (Install OpenCode)** and **Phase 3 (Set up VS Code Extension)**.

### Step 1: Open VS Code

1. Find VS Code on your computer (blue icon with `><`)
2. Double-click to open it
3. You should see the VS Code welcome screen

**What you'll see:** A dark (or light) editor window with a sidebar on the left.

### Step 2: Open the Terminal

The terminal is where you type commands. Don't worry - we'll tell you exactly what to type!

**On Mac:**
- Press `Cmd + J` (hold Command, then press J)
- Or click **View** → **Terminal** in the menu

**On Windows/Linux:**
- Press `Ctrl + J` (hold Control, then press J)
- Or click **View** → **Terminal** in the menu

**What you'll see:** A panel appears at the bottom of VS Code with a blinking cursor. This is the terminal!

### Step 3: Install OpenCode

Copy and paste this command into the terminal, then press **Enter**:

**On Mac/Linux:**
```bash
curl -fsSL https://opencode.ai/install | bash
```

**On Windows (PowerShell):**
```powershell
npm install -g opencode-ai
```

> 💡 **Tip:** To paste in the terminal, use `Cmd+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux)

**What you'll see:** Text will scroll by as OpenCode downloads and installs. Wait until you see a message saying installation is complete (about 30 seconds).

### Step 4: Verify OpenCode Installed

Type this command and press **Enter**:

```bash
opencode --version
```

**What you should see:** A version number like `v1.1.6` (the number might be different, that's okay!)

### Validation: `phase_2_complete`

```bash
opencode --version    # → Should show a version number
```

**Checklist:**
- [ ] `opencode --version` shows a version number?

❌ **STOP if validation fails** - See Troubleshooting section below.

---

### Step 5: Install the VS Code Extension

Here's the magic part - the extension installs **automatically**!

1. Make sure you're in the VS Code terminal
2. Type this command and press **Enter**:

```bash
opencode
```

**What you'll see:** 
- OpenCode starts up with a colorful interface
- A popup appears asking to install the OpenCode extension
- Click **Install** or press Enter to confirm

> 💡 **Note:** If no popup appears, the extension might already be installed, or you can install it manually (see below).

### Alternative: Manual Extension Install

If the automatic install didn't work:

1. Click the **Extensions** icon in VS Code's left sidebar (looks like 4 squares)
2. Type `OpenCode` in the search box
3. Find "OpenCode" by Anomaly
4. Click the blue **Install** button

**What you'll see:** The extension installs and you'll see "OpenCode" in your extensions list.

### Validation: `phase_3_complete`

**Checklist:**
- [ ] OpenCode extension appears in VS Code extensions?
- [ ] Running `opencode` in terminal shows the OpenCode interface?

❌ **STOP if validation fails** - Try the manual installation method above.

---

## 4. ⚙️ CONFIGURATION

Now let's connect your GitHub Copilot account to OpenCode (Phase 4).

### Step 1: Start OpenCode

If OpenCode isn't already running, type in the terminal:

```bash
opencode
```

**What you'll see:** The OpenCode interface with a text input area at the bottom.

### Step 2: Connect GitHub Copilot

Type this command in OpenCode (not the regular terminal):

```
/connect
```

**What you'll see:** A list of AI providers appears.

### Step 3: Select GitHub Copilot

1. Use your **arrow keys** (↑ ↓) to scroll through the list
2. Find **GitHub Copilot**
3. Press **Enter** to select it

**What you'll see:** A message with a code and a link:

```
┌ Login with GitHub Copilot
│
│ https://github.com/login/device
│
│ Enter code: XXXX-XXXX
│
└ Waiting for authorization...
```

### Step 4: Authorize in Your Browser

1. **Copy the code** shown (like `XXXX-XXXX`)
2. Open your web browser
3. Go to: **github.com/login/device**
4. **Paste the code** into the box
5. Click **Continue**
6. Click **Authorize** when asked

**What you'll see in the browser:** "Congratulations, you're all set!"

**What you'll see in OpenCode:** The message changes to show you're connected.

### Step 5: Select a Model

Now let's choose which AI model to use:

```
/models
```

**What you'll see:** A list of available AI models.

**Recommended for beginners:**
- `gpt-4o` - Great all-around model
- `claude-sonnet-4` - Excellent for coding (if available with your plan)

Use arrow keys to select, then press **Enter**.

### Validation: `phase_4_complete`

**Checklist:**
- [ ] `/connect` completed successfully?
- [ ] GitHub authorization worked in browser?
- [ ] `/models` shows available models?
- [ ] You selected a model?

❌ **STOP if validation fails** - Make sure you have an active GitHub Copilot subscription.

---

## 5. ✅ VERIFICATION

Let's make sure everything works! (Phase 5)

### Test 1: Ask a Simple Question

In OpenCode, type:

```
What is 2 + 2?
```

Press **Enter**.

**What you should see:** OpenCode responds with "4" (and probably some friendly explanation).

### Test 2: Ask About Code

Try this:

```
Write a simple HTML button that says "Click Me"
```

**What you should see:** OpenCode writes HTML code for you!

### Test 3: Use the Keyboard Shortcut

1. Press `Cmd+Esc` (Mac) or `Ctrl+Esc` (Windows/Linux)

**What you should see:** OpenCode opens in a split terminal view (or focuses on an existing session).

### Success Criteria (`phase_5_complete`)

- [ ] ✅ OpenCode responds to questions
- [ ] ✅ OpenCode can write code when asked
- [ ] ✅ Keyboard shortcut opens OpenCode
- [ ] ✅ No error messages appear

❌ **STOP if validation fails** - Check Troubleshooting section.

---

## 6. 🚀 USAGE

Congratulations! You're ready to use OpenCode. Here's how to use it day-to-day.

### Opening OpenCode

**Method 1: Keyboard Shortcut (Fastest)**
- Mac: `Cmd + Esc`
- Windows/Linux: `Ctrl + Esc`

**Method 2: Terminal Command**
```bash
opencode
```

**Method 3: New Session**
- Mac: `Cmd + Shift + Esc`
- Windows/Linux: `Ctrl + Shift + Esc`

### Two Modes: Plan vs Build

OpenCode has two modes you can switch between with the **Tab** key:

| Mode                | What It Does                        | When to Use                          |
| ------------------- | ----------------------------------- | ------------------------------------ |
| **Build** (default) | Makes changes to your files         | When you want OpenCode to write code |
| **Plan**            | Only suggests, doesn't change files | When you want to discuss ideas first |

> 💡 **Tip for beginners:** Start in **Plan** mode to see what OpenCode suggests before it makes changes!

### Useful Commands

Type these in OpenCode:

| Command   | What It Does                             |
| --------- | ---------------------------------------- |
| `/help`   | Shows all available commands             |
| `/models` | Change which AI model you're using       |
| `/undo`   | Undo the last change OpenCode made       |
| `/redo`   | Redo something you undid                 |
| `/share`  | Create a link to share your conversation |
| `/init`   | Set up OpenCode for a new project        |

### Example Prompts for Marketers

Here are some things you can ask OpenCode:

**Understanding Code:**
```
Explain what this file does in simple terms
```

**Making Changes:**
```
Change the button color from blue to green
```

**Creating Content:**
```
Add a new section to the homepage with a headline and paragraph
```

**Fixing Problems:**
```
The page isn't loading correctly. Can you help me find the problem?
```

### Referencing Files

Use `@` to reference specific files:

```
Look at @index.html and tell me what it does
```

> 💡 **Tip:** After typing `@`, you can search for files by name!

---

## 7. 🔧 TROUBLESHOOTING

### Common Errors

**❌ "Command not found: opencode"**
- **Cause**: OpenCode isn't in your system's PATH (the list of places your computer looks for programs).
- **Fix**: 
  - Close and reopen VS Code
  - Or restart your computer
  - Or run: `source ~/.bashrc` (Mac/Linux) or restart PowerShell (Windows)

**❌ "Extension failed to install automatically"**
- **Cause**: VS Code couldn't install the extension automatically.
- **Fix**:
  1. Click Extensions icon in VS Code sidebar (4 squares)
  2. Search for "OpenCode"
  3. Click Install manually

**❌ "GitHub Copilot not appearing in /connect"**
- **Cause**: You might not have a Copilot subscription.
- **Fix**:
  1. Go to [github.com/settings/copilot](https://github.com/settings/copilot)
  2. Sign up for Copilot if you haven't
  3. Try `/connect` again

**❌ "Authorization failed" or "Invalid code"**
- **Cause**: The authorization code expired (they only last a few minutes).
- **Fix**:
  1. Run `/connect` again
  2. Get a fresh code
  3. Complete authorization within 5 minutes

**❌ "Model not available"**
- **Cause**: Some models require Copilot Pro+ subscription.
- **Fix**:
  - Try a different model (like `gpt-4o`)
  - Or upgrade your Copilot subscription

**❌ OpenCode is slow or not responding**
- **Cause**: Network issues or high demand.
- **Fix**:
  1. Check your internet connection
  2. Wait a moment and try again
  3. Try a different model with `/models`

### Getting More Help

- **OpenCode Discord**: [opencode.ai/discord](https://opencode.ai/discord) - Friendly community
- **OpenCode Docs**: [opencode.ai/docs](https://opencode.ai/docs) - Official documentation
- **GitHub Issues**: [github.com/anomalyco/opencode/issues](https://github.com/anomalyco/opencode/issues) - Report bugs

---

## 8. 📚 RESOURCES

### Quick Reference Card

| Action            | Mac                 | Windows/Linux        |
| ----------------- | ------------------- | -------------------- |
| Open OpenCode     | `Cmd + Esc`         | `Ctrl + Esc`         |
| New Session       | `Cmd + Shift + Esc` | `Ctrl + Shift + Esc` |
| Switch Plan/Build | `Tab`               | `Tab`                |
| Reference File    | `@filename`         | `@filename`          |

### File Locations

| What              | Where                               |
| ----------------- | ----------------------------------- |
| OpenCode config   | `~/.config/opencode/opencode.json`  |
| Credentials       | `~/.local/share/opencode/auth.json` |
| VS Code Extension | VS Code Extensions folder           |

### Useful Links

- **OpenCode Website**: [opencode.ai](https://opencode.ai)
- **Documentation**: [opencode.ai/docs](https://opencode.ai/docs)
- **GitHub Copilot Settings**: [github.com/settings/copilot](https://github.com/settings/copilot)
- **VS Code Download**: [code.visualstudio.com](https://code.visualstudio.com)

### Alternative AI Providers

If you don't have GitHub Copilot, you can use these instead:

| Provider             | Cost            | How to Connect         |
| -------------------- | --------------- | ---------------------- |
| **OpenCode Zen**     | Pay-as-you-go   | `/connect` → opencode  |
| **Anthropic Claude** | $20/month (Pro) | `/connect` → Anthropic |
| **OpenAI**           | Pay-as-you-go   | `/connect` → OpenAI    |

---

## Quick Start Summary

```bash
# 1. Install OpenCode (Mac/Linux)
curl -fsSL https://opencode.ai/install | bash

# 2. Start OpenCode in VS Code terminal
opencode

# 3. Connect GitHub Copilot
/connect
# → Select "GitHub Copilot"
# → Follow browser authorization

# 4. Select a model
/models
# → Choose gpt-4o or similar

# 5. Start using it!
# Ask anything in plain English
```

---

**Installation Complete!** 🎉

You now have OpenCode installed in VS Code with GitHub Copilot connected. Just open VS Code, press `Cmd+Esc` (Mac) or `Ctrl+Esc` (Windows), and start asking questions in plain English!

**Remember:** You can always type `/help` to see available commands, and don't be afraid to experiment - you can always `/undo` any changes!

---

## 🔗 RELATED RESOURCES

### Other Install Guides
- [MCP - Code Mode](./MCP%20-%20Code%20Mode.md) - Advanced tool orchestration
- [MCP - Narsil](./MCP%20-%20Narsil.md) - Code intelligence and search

### Documentation
- [OpenCode Docs - IDE](https://opencode.ai/docs/ide/) - Official IDE documentation
- [OpenCode Docs - Providers](https://opencode.ai/docs/providers/) - All AI provider options
- [GitHub Copilot Docs](https://docs.github.com/en/copilot) - GitHub's official Copilot documentation


I have a bunch of opencode commands, agents, skills, scripts, etc. Create a symlink of all skills, commands, scripts, agents in /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode in
/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.claude/agents /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.claude/commands /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.claude/scripts
/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.claude/skills ( ultrathink )