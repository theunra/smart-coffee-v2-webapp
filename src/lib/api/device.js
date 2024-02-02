const url_device_api = "/device";
export const deviceAbortController = new AbortController();

const Get = async (key="", param={}) => {
    const signal = deviceAbortController.signal;
    const response = await fetch(`${url_device_api}?` + new URLSearchParams({
            ...param,
            key : key,
        }), {
        method: 'GET',
        signal: signal,
    });
    
    const resp_data = await response.json();
    return resp_data;
}

export const GetIsDeviceActive = async () => {
    return await Get("is-device-active");
}

export const GetRoastSession = async () => {
    return await Get("roast-session");
}

export const GetAllRoast = async () => {
    return await Get("all-roast");
}

const Send = async (key="", param={}) => {
    const response = await fetch(`${url_device_api}`, {
        method: 'POST',
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({...param, key : key}),
    });
    const status = await response.json();
    return status;
}

export const SendStartRoast = async () => {
    return await Send("start-roast");
}

export const SendStopRoast = async () => {
    return await Send("stop-roast");
}

export const SendCreateSession = async (param) => {
    return await Send("create-session", param);
}

export const SendFinishSession = async () => {
    return await Send("finish-session");
}