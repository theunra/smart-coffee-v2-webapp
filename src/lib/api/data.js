const url_data_api = '/data';

export let GetDataAbort;
export const GetData = async (param) => {
    GetDataAbort = new AbortController();
    const signal = GetDataAbort.signal;
    try{
    const response = await fetch(`${url_data_api}?` + new URLSearchParams(param), {
          method : 'GET',
          signal : signal,
    });
    
    const status = response.status;

    if(status != 200){
        //failed
        return false;
    } else {
        const datas = await response.json();
        return datas;
    }

    }
    catch(err){
      console.log(err);
      return false;
    }
}
