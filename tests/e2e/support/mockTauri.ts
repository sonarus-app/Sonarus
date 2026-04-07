import type { Page } from "@playwright/test";

const mockedSettings = {
  audio_feedback: false,
  audio_feedback_volume: 0.5,
  bindings: {
    transcribe: {
      current_binding: "Ctrl+Shift+Space",
      default_binding: "Ctrl+Shift+Space",
    },
  },
  selected_microphone: "Default",
  selected_output_device: "Default",
  sound_theme: "marimba",
};

export async function mockTauriBridge(page: Page): Promise<void> {
  await page.addInitScript(
    ({ settings }) => {
      const callbacks = new Map<number, unknown>();
      let nextCallbackId = 1;
      let nextEventListenerId = 1;

      Object.defineProperty(window, "__TAURI_OS_PLUGIN_INTERNALS__", {
        configurable: true,
        value: {
          arch: "x86_64",
          eol: "\n",
          exe_extension: "",
          family: "unix",
          os_type: "linux",
          platform: "linux",
          version: "playwright",
        },
      });

      Object.defineProperty(window, "__TAURI_EVENT_PLUGIN_INTERNALS__", {
        configurable: true,
        value: {
          unregisterListener: () => {},
        },
      });

      Object.defineProperty(window, "__TAURI_INTERNALS__", {
        configurable: true,
        value: {
          metadata: {
            currentWindow: {
              label: "main",
            },
          },
          invoke: async (cmd: string) => {
            switch (cmd) {
              case "get_app_settings":
              case "get_default_settings":
                return settings;
              case "has_any_models_available":
                return true;
              case "get_available_models":
                return [];
              case "get_current_model":
                return "";
              case "get_available_microphones":
              case "get_available_output_devices":
                return [];
              case "check_custom_sounds":
                return { start: false, stop: false };
              case "plugin:event|listen":
                return nextEventListenerId++;
              case "plugin:event|unlisten":
                return null;
              case "plugin:os|locale":
                return "en-US";
              default:
                return null;
            }
          },
          transformCallback: (callback: unknown) => {
            const id = nextCallbackId++;
            callbacks.set(id, callback);
            return id;
          },
          unregisterCallback: (id: number) => {
            callbacks.delete(id);
          },
          convertFileSrc: (filePath: string) => filePath,
        },
      });
    },
    { settings: mockedSettings },
  );
}
