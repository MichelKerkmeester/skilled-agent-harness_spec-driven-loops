// ───────────────────────────────────────────────────────────────
// UTILS: PROMPT UTILS
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */
'use strict';

const readline = require('readline');

/* ─────────────────────────────────────────────────────────────
   2. INTERACTIVE MODE DETECTION
──────────────────────────────────────────────────────────────── */

function require_interactive_mode(operation) {
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    console.error('ERROR: This operation requires user input but running in non-interactive mode.');
    console.error(`Operation: ${operation}`);
    console.error('');
    console.error('Please specify the spec folder explicitly using:');
    console.error('  node generate-context.js <spec-folder-path>');
    console.error('');
    console.error('Example:');
    console.error('  node generate-context.js specs/003-memory-and-spec-kit/054-remaining-bugs-remediation');
    process.exit(1);
  }
}

/* ─────────────────────────────────────────────────────────────
   3. USER PROMPTS
──────────────────────────────────────────────────────────────── */

function prompt_user(question, defaultValue = '', requireInteractive = true) {
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    if (requireInteractive && defaultValue === '') {
      require_interactive_mode('user input required');
    }
    console.warn('[generate-context] Non-interactive mode: using default value');
    return Promise.resolve(defaultValue);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });

    rl.on('error', (err) => {
      rl.close();
      reject(err);
    });

    rl.on('SIGINT', () => {
      rl.close();
      reject(new Error('User interrupted input'));
    });
  });
}

async function prompt_user_choice(question, maxChoice, maxAttempts = 3, requireInteractive = true) {
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    if (requireInteractive) {
      require_interactive_mode('spec folder selection');
    }
    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
    return 1;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const answer = await prompt_user(question);
    const choice = parseInt(answer);

    if (!isNaN(choice) && choice >= 1 && choice <= maxChoice) {
      return choice;
    }

    if (attempt < maxAttempts) {
      console.log(`   ❌ Invalid choice. Please enter a number between 1 and ${maxChoice}.\n`);
    }
  }

  throw new Error('Maximum retry attempts exceeded. Please run the command again.');
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  require_interactive_mode,
  prompt_user,
  prompt_user_choice,
  // Backwards compatibility aliases (camelCase)
  requireInteractiveMode: require_interactive_mode,
  promptUser: prompt_user,
  promptUserChoice: prompt_user_choice
};
