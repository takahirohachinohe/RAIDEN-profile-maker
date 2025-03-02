document.addEventListener('DOMContentLoaded', () => {
  const goPreviewBtn = document.getElementById('goPreviewBtn');
  const photoInput   = document.getElementById('photo');
  const statusEl     = document.getElementById('status');

  goPreviewBtn.addEventListener('click', () => {
    statusEl.textContent = "";

    // 1) ユーザークリック直後 -> 空タブ
    const newTab = window.open('', '_blank'); 

    // 2) 全フォーム項目を取得
    const dataObj = gatherFormData();

    // 3) 写真ファイル
    const file = photoInput.files[0];
    if(!file){
      dataObj.photoDataURL = "";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      newTab.location.href = "preview.html";
      return;
    }

    // 4) FileReaderでBase64
    const reader= new FileReader();
    reader.onload= (e)=>{
      const originalDataUrl= e.target.result;
      if(!originalDataUrl){
        dataObj.photoDataURL="";
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        newTab.location.href= "preview.html";
        return;
      }
      // 繰り返し圧縮で5MB以下に
      compressUntilUnder5MB(originalDataUrl, (finalUrl)=>{
        dataObj.photoDataURL= finalUrl;
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        newTab.location.href= "preview.html";
      });
    };
    reader.onerror= ()=>{
      statusEl.textContent= "写真読み込み失敗";
      dataObj.photoDataURL="";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      newTab.location.href= "preview.html";
    };
    reader.readAsDataURL(file);
  });

  // 全フォーム項目をまとめる
  function gatherFormData(){
    return {
      playerSelect : v('playerSelect'),
      photoDataURL : "", // 後で圧縮結果を入れる

      // 推しの好きなところ / 推しの好きになったきっかけ / 推しのここを知ってほしい
      favoriteThing: v('favoriteThing'),
      fanReason    : v('fanReason'),
      highlight    : v('highlight'),

      nickname     : v('nickname'),

      // 性格チャート
      cool   : n('cool'),
      cute   : n('cute'),
      kind   : n('kind'),
      funny  : n('funny'),
      strong : n('strong'),

      // ベストメモリーズ
      memory1: v('memory1'),
      memory2: v('memory2'),

      // ifトーク
      teacher: v('teacher'),
      island : v('island'),
      boss   : v('boss'),
      junior : v('junior'),

      // 家族に例える
      father : v('father'),
      mother : v('mother'),
      brother: v('brother'),
      sister : v('sister'),
      youngerBrother: v('youngerBrother'),
      youngerSister : v('youngerSister'),
      pet    : v('pet'),

      // メッセージ
      message: v('message')
    };
  }
  function v(id){
    const el= document.getElementById(id);
    return el? el.value : "";
  }
  function n(id){
    return parseFloat(v(id)) || 0;
  }

  // 繰り返し圧縮
  function compressUntilUnder5MB(dataUrl, callback){
    const maxBytes= 5*1024*1024;
    if(dataUrl.length <= maxBytes*1.37){
      callback(dataUrl);
      return;
    }
    let qualityStep=9; 
    let current= dataUrl;

    function tryOne(){
      const q= qualityStep/10; 
      compressImage(current,800,q,(newUrl)=>{
        if(!newUrl){
          callback("");
          return;
        }
        if(newUrl.length <= maxBytes*1.37){
          callback(newUrl);
        } else {
          qualityStep--;
          if(qualityStep<=0){
            callback("");
          } else {
            current= newUrl;
            tryOne();
          }
        }
      });
    }
    tryOne();
  }

  // 1回分の圧縮
  function compressImage(originalDataUrl, maxWidth, quality, cb){
    const img= new Image();
    img.onload= ()=>{
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
      const newUrl= canvas.toDataURL('image/jpeg', quality);
      cb(newUrl);
    };
    img.onerror= ()=>{ cb(""); };
    img.src= originalDataUrl;
  }
});
