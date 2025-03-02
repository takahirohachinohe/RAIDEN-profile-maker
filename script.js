document.addEventListener('DOMContentLoaded', () => {
  const goPreviewBtn= document.getElementById('goPreviewBtn');
  const photoInput= document.getElementById('photo');
  const statusEl= document.getElementById('status');

  goPreviewBtn.addEventListener('click', () => {
    statusEl.textContent = "";

    // [A] Safari対策: ユーザークリック直後に loading.html を開く
    const loadingTab = window.open('loading.html','_blank');

    // [B] 全フォーム入力まとめ
    const dataObj = gatherForm();

    // [C] 写真ファイル
    const file= photoInput.files[0];
    if(!file){
      dataObj.photoDataURL = "";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      loadingTab.location.href = "preview.html";
      return;
    }

    // FileReader
    const reader= new FileReader();
    reader.onload= (e)=>{
      const originalUrl= e.target.result;
      if(!originalUrl){
        dataObj.photoDataURL="";
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        loadingTab.location.href = "preview.html";
        return;
      }
      // 圧縮
      compressUntilUnder5MB(originalUrl,(finalUrl)=>{
        dataObj.photoDataURL = finalUrl;
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        // 圧縮終わったら loading→ preview
        loadingTab.location.href= "preview.html";
      });
    };
    reader.onerror= ()=>{
      statusEl.textContent= "写真読み込み失敗";
      dataObj.photoDataURL="";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      loadingTab.location.href= "preview.html";
    };
    reader.readAsDataURL(file);
  });

  // 全フォーム項目
  function gatherForm(){
    return {
      // 例: index.htmlにあるIDと対応
      playerSelect  : val('playerSelect'),
      favoriteThing : val('favoriteThing'), //推しの好きなところ
      fanReason     : val('fanReason'),     //推しの好きになったきっかけ
      highlight     : val('highlight'),     //推しのここを知ってほしい
      nickname      : val('nickname'),
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
      photoDataURL: "" //後で入れる
    };
  }
  function val(id){
    const el= document.getElementById(id);
    return el? el.value : "";
  }
  function num(id){
    return parseFloat(val(id))||0;
  }

  // 繰り返し圧縮
  function compressUntilUnder5MB(dataUrl, callback){
    const maxBytes= 5*1024*1024;
    // Base64は実ファイル×1.37程度
    if(dataUrl.length<= maxBytes*1.37){
      callback(dataUrl);
      return;
    }
    let qualityStep=9; 
    let current= dataUrl;
    function doOne(){
      const q= qualityStep/10;
      compressImage(current,800,q,(newUrl)=>{
        if(!newUrl){ callback(""); return; }
        if(newUrl.length <= maxBytes*1.37){
          callback(newUrl);
        } else {
          qualityStep--;
          if(qualityStep<=0){ callback(""); }
          else {
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
    const img= new Image();
    img.onload= ()=>{
      const canvas= document.createElement('canvas');
      const ctx= canvas.getContext('2d');
      let w= img.width;
      let h= img.height;
      if(w> maxWidth){
        const ratio= maxWidth / w;
        w=maxWidth;
        h=h*ratio;
      }
      canvas.width=w; 
      canvas.height=h;
      ctx.drawImage(img,0,0,w,h);
      const newUrl= canvas.toDataURL('image/jpeg', quality);
      cb(newUrl);
    };
    img.onerror=()=>{
      cb("");
    };
    img.src= originalDataUrl;
  }
});
