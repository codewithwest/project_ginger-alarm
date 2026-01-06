import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    // 1. Pack everything into an archive for better performance/security
    asar: true,

    // 2. The name used for the generated .app or .exe (no extension)
    executableName: 'ginger-alarm',

    // 3. Path to your icon (Forge handles the extension based on platform)
    icon: './assets/ginger-alarm-128x128.png',
    ignore: (path: string) => {
      // If the path is empty (root) or contains electron-updater, do NOT ignore it
      if (!path || path.includes('node_modules/electron-updater')) {
        return false;
      }
      // You can add other specific modules here if they fail too
      return false;
    },


    // 4. Don't set ignore - let Electron Forge Vite plugin handle it automatically
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({
      options: {
        bin: 'ginger-alarm',
      },
    }),
    new MakerDeb({
      options: {
        bin: 'ginger-alarm',
        icon: './assets/ginger-alarm-128x128.png',
        depends: [
          'libnss3',
          'libatk1.0-0',
          'libatk-bridge2.0-0',
          'libcups2',
          'libgtk-3-0',
          'libgbm1',
          'libasound2'
        ],
        categories: ['Utility'],
        genericName: 'Ginger Alarm',
        productName: 'Ginger Alarm',
        section: 'utils',
        mimeType: ['x-scheme-handler/ginger-alarm'],
      },
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
