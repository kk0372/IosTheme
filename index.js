/**
 * SillyTavern Custom Extension - Apple Dark UI Extension
 * Built automatically via SillyTavern Custom UI Extension Builder
 */

import { extension_settings } from '../../../extensions.js';
import { saveSettingsDebounced } from '../../../../script.js';

const MODULE_NAME = 'sillytavern-apple-dark';
const extensionFolderPath = \`scripts/extensions/third-party/\${MODULE_NAME}\`;

// Local Extension Settings holding theme variables
let settings = {
  accentColor: '#007aff',
  borderRadius: '12px',
  backdropOpacity: 0.85,
  quickActions: {
    regenerate: true,
    tts: true,
    translate: true
  }
};

// Add extension HTML to SillyTavern Settings Panel
async function loadSettingsUI() {
  try {
    const settingsHtml = await $.get(\`\${extensionFolderPath}/index.html\`);
    
    const container = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (container) {
      jQuery(container).append(settingsHtml);
    } else {
      console.warn("Could not find SillyTavern extensions settings container.");
    }
    
    // Initialize values in UI
    jQuery('#apple-accent-picker').val(settings.accentColor);
    jQuery('#apple-opacity-range').val(settings.backdropOpacity);
    jQuery('#apple-opacity-label').text(\`Frosted Glass Opacity (\${settings.backdropOpacity})\`);
    
    // Bind live UI events in SillyTavern
    jQuery('#apple-accent-picker').on('input', function() {
      settings.accentColor = jQuery(this).val();
      document.documentElement.style.setProperty('--apple-accent-color', settings.accentColor);
      saveSettings();
    });

    jQuery('#apple-opacity-range').on('input', function() {
      settings.backdropOpacity = parseFloat(jQuery(this).val());
      jQuery('#apple-opacity-label').text(\`Frosted Glass Opacity (\${settings.backdropOpacity})\`);
      document.documentElement.style.setProperty('--apple-glass-opacity', settings.backdropOpacity);
      saveSettings();
    });
  } catch (err) {
    console.error("Failed to load settings UI for Apple Dark UI", err);
  }
}

function saveSettings() {
  extension_settings[MODULE_NAME] = settings;
  if (typeof saveSettingsDebounced === 'function') {
    saveSettingsDebounced();
  }
}

// Register custom Slash commands selected by the user
function registerCommands() {
  if (!window.SillyTavern || !SillyTavern.getContext) return;
  const context = SillyTavern.getContext();
  const { SlashCommandParser, SlashCommand } = context;
  if (!SlashCommandParser || !SlashCommand) return;

  SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'reroll',
    callback: (args, value) => {
      toastr.info('Simulates custom bubble regeneration 이(가) 실행되었습니다.');
      console.log('Custom Slash Command [/reroll] triggered with:', value);
      return '';
    },
    helpString: 'Simulates custom bubble regeneration'
  }));
  SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'translate',
    callback: (args, value) => {
      toastr.info('Translates selected text to Korean 이(가) 실행되었습니다.');
      console.log('Custom Slash Command [/translate] triggered with:', value);
      return '';
    },
    helpString: 'Translates selected text to Korean'
  }));
}

// On document load
jQuery(async () => {
  // Add a slight delay to ensure SillyTavern UI is fully initialized before injecting our settings
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Initialize settings
  extension_settings[MODULE_NAME] = extension_settings[MODULE_NAME] || {};
  if (Object.keys(extension_settings[MODULE_NAME]).length === 0) {
    Object.assign(extension_settings[MODULE_NAME], settings);
  }
  settings = { ...settings, ...extension_settings[MODULE_NAME] };
  
  loadSettingsUI();
  registerCommands();
  
  // CSS Custom variable bindings
  document.documentElement.style.setProperty('--apple-accent-color', settings.accentColor);
  document.documentElement.style.setProperty('--apple-glass-opacity', settings.backdropOpacity);

  toastr.success('Apple Dark UI Extension Loaded Successfully! 🍎');
});
