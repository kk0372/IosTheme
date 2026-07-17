/**
 * SillyTavern Custom Extension - Apple Dark UI Extension
 * Built automatically via SillyTavern Custom UI Extension Builder
 */

import { extension_settings } from '../../../extensions.js';
import { saveSettingsDebounced } from '../../../../script.js';

const MODULE_NAME = 'sillytavern-apple-dark';

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
function loadSettingsUI() {
  const settingsHtml = \`
    <div class="sillytavern-apple-settings-panel inline-drawer">
      <div class="inline-drawer-toggle inline-drawer-header">
        <b>🍎 Apple Dark UI Settings</b>
        <div class="inline-drawer-icon down"></div>
      </div>
      <div class="inline-drawer-content">
        <p style="font-size: 12px; color: #888; margin-bottom: 10px;">SillyTavern Custom UI Extension Builder로 빌드된 깃허브 호환 테마입니다.</p>
        
        <div class="apple-setting-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <label>Accent Color</label>
          <input type="color" id="apple-accent-picker" value="\${settings.accentColor}">
        </div>

        <div class="apple-setting-row" style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 15px;">
          <label>Frosted Glass Opacity (\${settings.backdropOpacity})</label>
          <input type="range" id="apple-opacity-range" min="0.1" max="1.0" step="0.05" value="\${settings.backdropOpacity}">
        </div>
        
        <small style="color: #888;">Settings are persistently synced in browser state.</small>
      </div>
    </div>
  \`;
  
  const container = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
  if (container) {
    jQuery(container).append(settingsHtml);
  } else {
    console.warn("Could not find SillyTavern extensions settings container.");
  }
  
  // Bind live UI events in SillyTavern
  jQuery('#apple-accent-picker').on('input', function() {
    settings.accentColor = jQuery(this).val();
    document.documentElement.style.setProperty('--apple-accent-color', settings.accentColor);
    saveSettings();
  });

  jQuery('#apple-opacity-range').on('input', function() {
    settings.backdropOpacity = parseFloat(jQuery(this).val());
    jQuery(this).prev('label').text(\`Frosted Glass Opacity (\${settings.backdropOpacity})\`);
    document.documentElement.style.setProperty('--apple-glass-opacity', settings.backdropOpacity);
    saveSettings();
  });
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
