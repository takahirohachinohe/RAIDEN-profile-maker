document.addEventListener('DOMContentLoaded', () => {
  const goPreviewBtn = document.getElementById('goPreviewBtn');
  const photoInput   = document.getElementById('photo');
  const statusEl     = document.getElementById('status');

  goPreviewBtn.addEventListener('click', () => {
    statusEl.textContent = "画像を圧縮中...";

    // 1) フォーム項目をまとめ
    const dataObj = gatherFormData();

    // 2) ファイルチェック
    const file = photoInput.files[0];
    if(!file){
      // 写真なし
      dataObj.photoDataURL = "";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      window.location.href = "preview.html";
      return;
    }

    // 3) FileReaderでBase64化
    const reader = new FileReader();
    reader.onload = (e)=>{
      const originalUrl = e.target.result;
      if(!originalUrl){
        dataObj.photoDataURL="";
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        window.location.href="preview.html";
        return;
      }
      // 4) 繰り返し圧縮 (5MB以下)
      compressUntilUnder5MB(originalUrl, (finalUrl)=>{
        dataObj.photoDataURL = finalUrl;
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        window.location.href = "preview.html";
      });
    };
    reader.onerror = ()=>{
      statusEl.textContent="画像の読み込みに失敗しました";
      dataObj.photoDataURL="";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      window.location.href="preview.html";
    };
    reader.readAsDataURL(file);
  });

  // フォームから値を収集
  function gatherFormData(){
    return {
      playerSelect : val('playerSelect'),
      favoriteThing: val('favoriteThing'),
      fanReason    : val('fanReason'),
      highlight    : val('highlight'),
      nickname     : val('nickname'),
      cool   : num('cool'),
      cute   : num('cute'),
      kind   : num('kind'),
      funny  : num('funny'),
      strong : num('strong'),
      memory1: val('memory1'),
      memory2: val('memory2'),
      teacher: val('teacher'),
      island : val('island'),
      boss   : val('boss'),
      junior : val('junior'),
      father : val('father'),
      mother : val('mother'),
      brother: val('brother'),
      sister : val('sister'),
      youngerBrother: val('youngerBrother'),
      youngerSister : val('youngerSister'),
      pet    : val('pet'),
      message: val('message'),
      photoDataURL:"" //あとで入れる
    };
  }
  function val(id){ 
    const el= document.getElementById(id);
    return el? el.value : ""; 
  }
  function num(id){
    return parseFloat(val(id)) || 0;
  }

  // 繰り返し圧縮(5MB以下)
  function compressUntilUnder5MB(dataUrl, callback){
    const maxBytes= 5*1024*1024;
    // Base64はファイルの約1.37倍サイズ
    if(dataUrl.length<= maxBytes*1.37){
      callback(dataUrl);
      return;
    }
    let qualityStep=9; // 0.9 -> 0.1
    let current=dataUrl;
    function doOne(){
      const q= qualityStep/10;
      compressImage(current,800,q,(newUrl)=>{
        if(!newUrl){ callback(""); return; }
        if(newUrl.length<= maxBytes*1.37){
          callback(newUrl);
        } else {
          qualityStep--;
          if(qualityStep<=0){
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

  // 1回の圧縮
  function compressImage(originalDataUrl, maxWidth, quality, cb){
    const img=new Image();
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
      const newUrl= canvas.toDataURL("image/jpeg", quality);
      cb(newUrl);
    };
    img.onerror= ()=> cb("");
    img.src= originalDataUrl;
  }
});
