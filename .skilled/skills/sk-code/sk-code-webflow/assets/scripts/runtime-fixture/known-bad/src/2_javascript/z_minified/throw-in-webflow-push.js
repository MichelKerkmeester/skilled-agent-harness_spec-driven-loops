// Exercises the Webflow.push callback error path.
// Run: cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node ../../test-minified-runtime.mjs
window.Webflow.push(function () { throw new TypeError('push callback failed'); });
