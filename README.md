# l-plx

Player data encoding methods and values.

## Setup

Install dependencies and build. See `package.json` scripts.

### `build`

Build the library. The output code will appear in the `dist` folder. It should work on the web in browsers, and on Node without changes or further configuration.

### `test`

Test the code. Run this if you make any changes to ensure your changes will respect the existing functionality. These tests will need updated if you want to keep your work consistent if you happen to change the return types or parameter shapes.

## Usage

TODO: This section is to be improved.

### Example

```ts
import { decodeFromString } from './decodeFromString';

const audioElement = document.getElementById('audio') as HTMLAudioElement;

async function playDecryptedAudio(encryptedData: string, options: EncoderOptions) {
  const decryptedData = await decodeFromString(encryptedData, options);

  const audioBlob = new Blob([decryptedData], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);

  audioElement.src = audioUrl;
  audioElement.play();
}

const encryptedData = 'eW91bGxmaW5kd2hhdGV2ZXJ5b3Vnb2xvb2tpbmdmb3I...';
const options = {
  secretKey: '...',
  iv: '...',
  encoding: 'base64',
};

playDecryptedAudio(encryptedData, options);
```

---
This software is provided as-is. Do not use this for security-critical applications.

&copy; 2022 Burns Recording Company
