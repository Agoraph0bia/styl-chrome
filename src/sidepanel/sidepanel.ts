document
  .getElementById('element-picker-button')
  ?.addEventListener('click', async () =>
    createElementPicker().then(closeSidePanel)
  );

async function createElementPicker() {
  let tabs = await chrome.tabs.query({
    highlighted: true,
    currentWindow: true,
  });

  if (!tabs[0].id) return;

  chrome.tabs.sendMessage(tabs[0].id, {
    type: 'elementpicker',
    action: 'start',
    extId: chrome.runtime.id,
  });
}

async function closeSidePanel() {
  window.close();
}
