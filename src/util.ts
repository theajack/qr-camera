/*
 * @Author: chenzhongsheng
 * @Date: 2023-11-10 09:56:09
 * @Description: Coding something
 */
export function withResolve<T=any> () {
    let resolve: (value?: T|PromiseLike<T>)=>any = () => {}, reject: (error?: any)=>any = () => {};
    const ready = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return {ready, resolve, reject};
}

export function delay (time: number = 1000) {
    const {resolve, ready} = withResolve();
    setTimeout(resolve, time);
    return ready;
}