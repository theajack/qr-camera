/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:32:39
 * @Description: Coding something
 */


import {QRCamera} from '../../src/index';
// import {Camera} from '../../npm';
import {tool as $} from 'tacl-ui';

let startBtn: any;

type Ele = ReturnType<typeof $.create>;

function main () {
    startBtn?.remove();
    const camera = new QRCamera({useAudio: true});
    camera.video.style.maxWidth = '100%';
    document.body.append(camera.video);
    let infoEle: Ele;
    const log = (text: string) => {
        infoEle.text(text);
        console.log(text);
    };
    $.query('body').append(
        Box(
            Button('SwitchCamera', async () => {
                const result = await camera.switchCamera();
                log(`SwitchCamera Result: ${JSON.stringify(result)}`);
            }),
            Button('GetCamreas', async () => {
                const camreas = await camera.getCameras();
                console.log(camreas);
                log(`GetCamreas Result: ${camreas.map(item => {
                    return `${item.label}[cameraId=${item.deviceId}]`;
                }).join('\n')}`);
            }),
        ),
        Box(
            Button('ScanQRCode', async () => {
                log('Scanning, please put the QR code into the screen...');
                const result = await camera.scanQrcode();
                if (result) log(`ScanQRCode Result: ${result}`);
            }),
            Button('StopScanQrcode', () => {
                camera.stopScanQrcode();
                log('StopScanQrcode');
            }),
        ),
        Box(
            Button('Photo', async () => {
                const result = await camera.photo({download: true});
                console.log(`Photo：result=${result}`, typeof result);
                if (result) log(`The photo is taken and the photo has been downloaded，blob url=${result}`);
            }),
        ),
        Box(
            Button('Record', async () => {
                log(`Recording is in progress, click StopRecord to end recording`);
                const result = await camera.record({
                    download: true,
                });
                log(`The recording is completed and the video has been downloaded，blob url=${result}`);
            }),
            Button('StopRecord', () => {
                camera.stopRecord();
                log(`Saving video...`);
            }),
            Button('PauseRecord', () => {
                camera.pauseRecord();
                log(`PauseRecord`);
            }),
            Button('ResumeRecord', () => {
                camera.resumeRecord();
                log(`ResumeRecord`);
            }),
        ),
        infoEle = $.create('div').attr('style', 'margin-top:10px;color:#666;')
    );
}

$.query('body').append(
    startBtn = Button('StartCamera', main),
);

function Box (...children: Ele[]) {
    return $.create('div').attr('style', 'margin-top:5px').append(
        children
    );
}
function Button (text: string, onclick: ()=>any) {
    return $.create('button').attr('style', 'margin-right:5px').text(text).click(onclick);
}