const LongPollingTimeout = 20 * 1000; //ms

export async function LongPolling({ doCheck, onTimeout, onFinish }) {	
    let timeout = false;
    setTimeout(()=>{timeout = true;}, LongPollingTimeout)
    
    while(!timeout){
        const check_result = await doCheck();
        if(check_result) break;
        else await new Promise(r => setTimeout(r, 100));
    }

    if(timeout) await onTimeout();
    else await onFinish();
  }
  
