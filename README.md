<!--
  * @Author: tackchen
  * @Date: 2022-08-03 21:24:33
  * @Description: Coding something
-->
# [qr-camera](https://github.com/theajack/qr-camera)

**[Online Experience](https://theajack.github.io/qr-camera) | [中文](https://github.com/theajack/qr-camera/blob/master/README.cn.md)**

QR code scanning solution for browsers

## Function

1. Support browser scanning QR code
2. Support taking pictures
3. Support video recording function
4. Support QR code parsing and generation

## quickstart

```
npm i qr-camera
```

```js
import {QRCamera} from 'qr-camera';

async function main(){
     const camera = new QRCamera();
     document.body.appendChild(camera.video);
     console.log(await camera.scanQrcode());
}
main();
```

### CDN

```html
<body>
<script src="https://unpkg.com/qr-camera"></script>
<script>
    async function main(){
        const camera = new QRCamera();
        document.body.appendChild(camera.video);
        console.log(await camera.scanQrcode());
    }
    main();
</script>
</body>
```

##API

### 1. QRCamera

```js
const camera = new QRCamera(options);
```

options:

```ts
interface Options {
     video?: HTMLVideoElement; // Custom video element
     size?: { // video element width and height
         width: number;
         height: number;
     },
     useAudio?: boolean; // Whether to enable audio
     cameraId?: string; // Specify camera to start
}
```

### 2.getCameras

Get camera list

```js
const cameras = await camera.getCameras();
```

### 3. switchCamera

Switch camera

```js
const result = await camera.switchCamera(cameraId); //Specify camera
const result = await camera.switchCamera(); // Switch to the next camera
```

### 4. scanQrcode

Turn on QR code recognition

```js
const content = await camera.scanQrcode({
     gap: 500 //Recognition interval, unit ms, default is 500ms
});
```

#### stopScanQrcode

Stop recognizing QR codes

```js
camera.stopScanQrcode();
```

### 4. photo

Photograph

```js
const url = await camera.photo({
     base64: false, // Whether to return base64
     download: false, // Whether to download automatically
     name: 'photo', // Downloaded file name
});
```

### 5. record

Video

```js
const url = await camera.record({
     time: undefined, // recording duration, the default is no limit, until the call is made to stop recording
     download: false, // Whether to download automatically
     name: 'video', // Downloaded file name
});
```

#### pause

```js
camera.pauseRecord();
camera.resumeRecord();
camera.recordPaused;
```

#### stop

```js
camera.stopRecord();
```

### qrcode

Please refer to [tc-qrcode](https://github.com/theajack/qrcode) for QR code capabilities 

```js
import {qrcode} from 'qr-camera';
```