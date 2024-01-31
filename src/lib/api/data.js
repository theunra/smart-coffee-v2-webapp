const url_data_api = '/data';

export const GetData = async (dataTracker, get_raw_data) => {
    const response = await fetch(`${url_data_api}?` + new URLSearchParams({
        tracker : dataTracker, 
        get_raw_data : get_raw_data,
      }), {
          method : 'GET',
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
