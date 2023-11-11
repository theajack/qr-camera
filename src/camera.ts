import {delay, withResolve} from './util';
import qrcode from 'tc-qrcode';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-11-10 09:44:52
 * @Description: Coding something
 */
export class Camera {
    
    video: HTMLVideoElement;

    ready: Promise<any>;

    private _stream: MediaStream;

    private _useAudio: boolean;

    private _mediaRecorder: MediaRecorder|null;

    private _cameraId = '';

    constructor ({
        video,
        size,
        useAudio = false,
        cameraId = '',
    }: {
        video?: HTMLVideoElement
        size?: {
            width: number;
            height: number;
        },
        useAudio?: boolean;
        cameraId?: string;
    } = {}) {
        this._useAudio = useAudio;
        this._cameraId = cameraId;
        if (!video) {
            video = document.createElement('video');
        }
        this.video = video;
        if (size) {
            this.video.style.width = `${size.width}px`;
            this.video.style.height = `${size.height}px`;
        }
        this._init();
    }

    private async _init () {
        const {ready, resolve, reject} = withResolve();
        this.ready = ready;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: this._cameraId ? {
                    deviceId: {exact: this._cameraId}
                } : true,
                audio: this._useAudio
            });
            // 将视频流连接到 <video> 元素
            this.video.srcObject = stream;
            this._stream = stream;
            this.video.play();
            resolve();
        } catch (err) {
            console.error('摄像头访问失败:', err);
            reject(err);
        }
    }

    isScanning = false;
    async scanQrcode ({
        gap = 500
    }: {
        gap?: number;
    } = {}): Promise<string> {
        this.isScanning = true;
        await this.ready;
        let result = '';
        while (!(result = await qrcode.decodeFromVideo(this.video))) {
            if (!this.isScanning) break;
            await delay(gap);
        }
        this.isScanning = false;
        return result;
    }

    stopScanQrcode () {
        this.isScanning = false;
    }

    async photo ({
        name = 'photo',
        download = false,
        base64 = false,
    }: {
        name?: string,
        download?: boolean,
        base64?: boolean,
    } = {}): Promise<string> {
        await this.ready;
        const {resolve, ready, reject} = withResolve<string>();
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(this.video, 0, 0, canvas.width, canvas.height);
      
        // 将 Canvas 图像转换为 Data URL
        let url = '';
        if (base64) {
            url = canvas.toDataURL('image/png');
        } else {
            const blob = await this._canvasToBlob(canvas);
            if (!blob) {reject(); return ready;}
            url = window.URL.createObjectURL(blob);
        }
        if (download) {
            this._download(url, name);
        }
        resolve(url);
        return ready;
    }
    async record ({
        time,
        name = 'video',
        download = false,
    }: {
        time?: number;
        name?: string,
        download?: boolean,
    } = {}) {
        await this.ready;
        const {resolve, ready} = withResolve();
        const recordedBlobs: Blob[] = [];
        const mediaRecorder = new MediaRecorder(this._stream);

        // 监听数据可用事件，将数据添加到记录的 Blob 数组中
        mediaRecorder.ondataavailable = (event) => {
            console;
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        };
  
        // 监听录制结束事件
        mediaRecorder.onstop = () => {
            // 生成录制的视频文件
            const blob = new Blob(recordedBlobs, {type: 'video/webm'});
            const url = window.URL.createObjectURL(blob);
            if (download) {
                this._download(url, `${name}.webm`);
            }
            resolve(url);
        };
        this.recordPaused = false;
        mediaRecorder.start();
        this._mediaRecorder = mediaRecorder;
        if (time) {
            setTimeout(() => {
                this.stopRecord();
            }, time);
        }
        return ready;
    }
    recordPaused = false;
    pauseRecord () {
        if (!this._mediaRecorder) return;
        this.recordPaused = true;
        this._mediaRecorder.pause();
    }
    resumeRecord () {
        if (!this._mediaRecorder) return;
        this.recordPaused = false;
        this._mediaRecorder.resume();
    }
    stopRecord () {
        if (!this._mediaRecorder) return;
        this._mediaRecorder.stop();
        this._mediaRecorder = null;
    }

    private _download (url: string, name: string) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
    private async _canvasToBlob (canvas: HTMLCanvasElement) {
        const {resolve, ready} = withResolve<Blob|null>();
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
        return ready;
    }

    private _currentCameraIndex = 0;
    async switchCamera (cameraId?: string) {
        await this.ready;

        // 过滤出视频输入设备
        const videoDevices = await this.getCameras();
      
        // 检查是否有多个摄像头可用
        if (videoDevices.length < 2) {
            return {
                success: false,
                message: 'No other cameras'
            };
        }

        if (cameraId) {
            this._cameraId = cameraId;
            this._currentCameraIndex = videoDevices.findIndex(item => item.deviceId === cameraId);
        } else {
            this._currentCameraIndex = (this._currentCameraIndex + 1) % videoDevices.length;
            this._cameraId = videoDevices[this._currentCameraIndex].deviceId;
        }

        try {
            await this._init();
        } catch (err) {
            return {
                success: false,
                message: err.toString()
            };
        }
        return {
            success: true,
            message: ''
        };
    }
    async getCameras () {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'videoinput');
    }
}