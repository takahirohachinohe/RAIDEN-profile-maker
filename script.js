document.addEventListener('DOMContentLoaded', () => {
  const goPreviewBtn = document.getElementById('goPreviewBtn');
  const photoInput   = document.getElementById('photo');
  const statusEl     = document.getElementById('status');

  goPreviewBtn.addEventListener('click', () => {
    statusEl.textContent = "画像圧縮中...";

    const dataObj = gatherFormData();

    const file = photoInput.files[0];
    if(!file){
      dataObj.photoDataURL="";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      window.location.href="preview.html";
      return;
    }

    const reader= new FileReader();
    reader.onload=(e)=>{
      const originalUrl= e.target.result;
      if(!originalUrl){
        dataObj.photoDataURL="";
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        window.location.href="preview.html";
        return;
      }
      compressUntilUnder5MB(originalUrl, (finalUrl)=>{
        dataObj.photoDataURL= finalUrl;
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        window.location.href="preview.html";
      });
    };
    reader.onerror=()=>{
      statusEl.textContent="画像読み込み失敗";
      dataObj.photoDataURL="";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      window.location.href="preview.html";
    };
    reader.readAsDataURL(file);
  });

  function gatherFormData(){
    return {
      playerSelect: val("playerSelect"),
      favoriteThing: val("favoriteThing"),
      fanReason: val("fanReason"),
      highlight: val("highlight"),
      nickname: val("nickname"),
      cool: parseNum("cool"),
      cute: parseNum("cute"),
      kind: parseNum("kind"),
      funny: parseNum("funny"),
      strong: parseNum("strong"),
      memory1: val("memory1"),
      memory2: val("memory2"),
      teacher: val("teacher"),
      island:  val("island"),
      boss:    val("boss"),
      junior:  val("junior"),
      father:  val("father"),
      mother:  val("mother"),
      brother: val("brother"),
      sister:  val("sister"),
      youngerBrother: val("youngerBrother"),
      youngerSister: val("youngerSister"),
      pet: val("pet"),
      message: val("message"),
      photoDataURL:""
    };
  }

  // 全角→半角 -> parseFloat -> 無orNaNなら0
  function parseNum(id){
    const raw= val(id);
    if(!raw) return 0;
    // 全角数字を半角に置換
    const half= raw.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0)-0xFEE0));
    const n= parseFloat(half);
    return isNaN(n)? 0 : n;
  }
  function val(id){
    const el= document.getElementById(id);
    return el? el.value:"";
  }

  // 繰り返し圧縮(5MB以下)
  function compressUntilUnder5MB(dataUrl, callback){
    const maxBytes= 5*1024*1024;
    if(dataUrl.length <= maxBytes*1.37){
      callback(dataUrl);
      return;
    }
    let qStep=9; 
    let current= dataUrl;
    function doOne(){
      const q= qStep/10;
      compressImage(current,800,q,(newUrl)=>{
        if(!newUrl){ callback("");return;}
        if(newUrl.length<=maxBytes*1.37){
          callback(newUrl);
        } else {
          qStep--;
          if(qStep<=0){
            callback("");
          } else {
            current=newUrl;
            doOne();
          }
        }
      });
    }
    doOne();
  }

  function compressImage(originalDataUrl, maxWidth, quality, cb){
    const img= new Image();
    img.onload=()=>{
      const canvas= document.createElement('canvas');
      const ctx= canvas.getContext('2d');
      let w= img.width; 
      let h= img.height;
      if(w> maxWidth){
        const ratio= maxWidth/w;
        w= maxWidth;
        h= h*ratio;
      }
      canvas.width=w; 
      canvas.height=h;
      ctx.drawImage(img,0,0,w,h);
      const newUrl= canvas.toDataURL("image/jpeg",quality);
      cb(newUrl);
    };
    img.onerror=()=> cb("");
    img.src= originalDataUrl;
  }
});
