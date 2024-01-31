const url_device_api = "/device";

export const GetIsDeviceActive = async () => {
    const response = await fetch(`${url_device_api}?` + new URLSearchParams({
            param : "isDeviceActive",
        }), {
        method: 'GET',
    });
    
    const resp_data = await response.json();
    return resp_data;
}

export const SendStartRoast = async () => {
    const response = await fetch(`${url_device_api}`, {
        method: 'POST',
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({param : "start-roast"}),
    });
    const status = await response.json();
    return status;
}