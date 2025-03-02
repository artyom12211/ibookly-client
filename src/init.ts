import {
  backButton,
  mainButton,
  secondaryButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
  requestFullscreen,
  retrieveLaunchParams,
  postEvent
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Add Eruda if needed.
  debug && import('eruda')
    .then((lib) => lib.default.init())
    .catch(console.error);

  // Check if all required components are supported.
  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }

  if (!secondaryButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }

  // Mount all components used in the project.
  mainButton.mount();
  secondaryButton.mount();
  backButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();
  void viewport
    .mount()
    .catch(e => {
      console.error('Something went wrong mounting the viewport', e);
    })
    .then(() => {
      viewport.bindCssVars();
      viewport.safeAreaInsets();
      viewport.contentSafeAreaInsets();

      if (requestFullscreen.isSupported()) {
        const platform = retrieveLaunchParams().platform

        if (['android', 'android_x', 'ios'].includes(platform)) {
          requestFullscreen() // request fullscreen only in mobiles
        }
      }
    });

  postEvent("web_app_setup_swipe_behavior", {
    allow_vertical_swipe: false
  })

  // Define components-related CSS variables.
  miniApp.bindCssVars();
  themeParams.bindCssVars();
}