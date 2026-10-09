// Known-good control for polling a late element.
// Run: cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good && node ../../test-minified-runtime.mjs
(function () {
  const poll = () => {
    const late_element = document.querySelector('[data-late]');
    if (!late_element) {
      window.setTimeout(poll, 100);
      return;
    }

    late_element.classList.add('is-ready');
  };

  window.Webflow.push(poll);
})();
