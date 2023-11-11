<!--
 * @Author: tackchen
 * @Date: 2022-08-03 21:24:33
 * @Description: Coding something
-->
# [qr-camera](https://github.com/theajack/qr-camera)

**[在线体验](https://theajack.gitee.io/qr-camera) | [English](https://github.com/theajack/qr-camera/blob/master/README.md)**

适用于浏览器的二维码扫描方案

## 功能

1. 支持浏览器扫描二维码
2. 支持拍照
3. 支持录像功能
4. 支持二维码解析和生成

## quickstart

```
npm i qr-camera
```

```js
import {QRCamera} from 'qr-camera';

function main(){
    const camera = new QRCamera();
    document.body.appendChild(camera.video);
    console.log(await camera.scanQrcode());
}
main();
```

### CDN

```html
<script src="https://unpkg.com/qr-camera"></script>
<script>
    function main(){
        const camera = new QRCamera();
        document.body.appendChild(camera.video);
        console.log(await camera.scanQrcode());
    }
    main();
</script>
```

## API

### 1. QRCamera

```js
const camera = new QRCamera(options);
```

options:

```ts
interface Options {
    video?: HTMLVideoElement; // 自定义video元素
    size?: { // video 元素宽高
        width: number;
        height: number;
    },
    useAudio?: boolean; // 是否开启音频
    cameraId?: string; // 指定摄像头启动
}
```

### 2. getCameras

获取摄像头列表

```js
const cameras = await camera.getCameras();
```

### 3. switchCamera

切换摄像头

```js
const result = await camera.switchCamera(cameraId); // 指定摄像头
const result = await camera.switchCamera(); // 切换下一个摄像头
```

### 4. scanQrcode

开启识别二维码

```js
const content = await camera.scanQrcode({
    gap: 500 // 识别间隔，单位ms，默认为500ms
});
```

#### stopScanQrcode

停止识别二维码

```js
camera.stopScanQrcode();
```

### 4. photo

拍照

```js
const url = await camera.photo({
    base64: false, // 是否返回base64
    download: false, // 是否自动下载
    name: 'photo', // 下载的文件名
});
```

### 5. record

录像

```js
const url = await camera.record({
    time: undefined, // 录像时长，默认为不限制，直到调用停止录像为止
    download: false, // 是否自动下载
    name: 'video', // 下载的文件名
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

二维码能力请参考 [tc-qrcode](https://github.com/theajack/qrcode)

```js
import {qrcode} from 'qr-camera';
```