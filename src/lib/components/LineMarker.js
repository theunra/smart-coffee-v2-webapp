export default class LineMarker{
    CreateLineMarker(id, color){
      const lineMarker = {
        id: id,
        linePos: -1,
        isShow: false,
        beforeDatasetsDraw: (chart, args, plugins) => {
            const {ctx, chartArea : {top, bottom}, scales: { x }} = chart;
            
            ctx.save();

            if(!lineMarker.isShow) return;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.moveTo(x.getPixelForValue(lineMarker.linePos), top);
            ctx.lineTo(x.getPixelForValue(lineMarker.linePos), bottom);
            ctx.stroke();
          },
      };  
      return lineMarker;
    }
  }