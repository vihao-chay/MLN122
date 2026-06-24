const fs = require("fs");
const path = require("path");

async function main() {
    const pages = await fetch("http://127.0.0.1:9333/json").then((response) => response.json());
    const page = pages.find((item) => item.type === "page" && item.url === "about:blank")
        || pages.find((item) => item.type === "page");
    const socket = new WebSocket(page.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
        socket.onopen = resolve;
        socket.onerror = reject;
    });

    let id = 0;
    const pending = new Map();
    const events = new Map();

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            const request = pending.get(message.id);
            pending.delete(message.id);
            if (message.error) request.reject(new Error(message.error.message));
            else request.resolve(message.result);
            return;
        }

        if (message.method && events.has(message.method)) {
            for (const callback of events.get(message.method)) callback(message.params);
        }
    };

    const send = (method, params = {}) => new Promise((resolve, reject) => {
        const requestId = ++id;
        pending.set(requestId, { resolve, reject });
        socket.send(JSON.stringify({ id: requestId, method, params }));
    });

    const once = (method) => new Promise((resolve) => {
        const callbacks = events.get(method) || [];
        const callback = (params) => {
            events.set(method, (events.get(method) || []).filter((item) => item !== callback));
            resolve(params);
        };
        callbacks.push(callback);
        events.set(method, callbacks);
    });

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");
    await send("Network.setCacheDisabled", { cacheDisabled: true });
    await send("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true,
        screenWidth: 390,
        screenHeight: 844
    });

    const loaded = once("Page.loadEventFired");
    await send("Page.navigate", {
        url: `http://127.0.0.1:8765/code.html?qa=${Date.now()}`
    });
    await loaded;
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await send("Runtime.evaluate", {
        expression: `(() => {
            const input = document.getElementById("ai-chat-input");
            input.value = "Giá trị thặng dư tuyệt đối là gì?";
            document.getElementById("ai-chat-send").click();
            return true;
        })()`,
        returnByValue: true
    });
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const metrics = await send("Runtime.evaluate", {
        expression: `JSON.stringify({
            innerWidth: window.innerWidth,
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
            heroWidth: document.getElementById("mo-dau").getBoundingClientRect().width,
            titleWidth: document.querySelector(".typewriter h1").getBoundingClientRect().width,
            chatReply: document.getElementById("ai-chat-messages").lastElementChild.textContent
        })`,
        returnByValue: true
    });
    const screenshot = await send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false
    });

    const output = path.join(process.env.TEMP, "mln122-cdp-mobile-390.png");
    fs.writeFileSync(output, Buffer.from(screenshot.data, "base64"));
    console.log(metrics.result.value);
    console.log(output);
    socket.close();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
