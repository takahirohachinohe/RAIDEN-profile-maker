document.addEventListener('DOMContentLoaded', ()=>{
  const goPreviewBtn= document.getElementById('goPreviewBtn');
  const photoInput= document.getElementById('photo');
  const statusEl= document.getElementById('status');

  goPreviewBtn.addEventListener('click', ()=>{
    statusEl.textContent="画像圧縮中...";

    const dataObj= gatherFormData();
    // 推し選手の写真(ユーザーアップロード)のみ圧縮
    const file= photoInput.files[0];
    if(!file){
      dataObj.photoDataURL="";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      window.location.href="preview.html";
      return;
    }
    const rdr= new FileReader();
    rdr.onload= e=>{
      const originalUrl= e.target.result;
      if(!originalUrl){
        dataObj.photoDataURL="";
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        window.location.href="preview.html";
        return;
      }
      compressUntilUnder5MB(originalUrl, finalUrl=>{
        dataObj.photoDataURL= finalUrl;
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        window.location.href="preview.html";
      });
    };
    rdr.onerror=()=>{
      statusEl.textContent="画像読み込み失敗";
      dataObj.photoDataURL="";
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      window.location.href="preview.html";
    };
    rdr.readAsDataURL(file);
  });

  function gatherFormData(){
    return {
      playerSelect: val('playerSelect'),
      photoDataURL:"",
      nickname: val('nickname'),
      favoriteThing: val('favoriteThing'),
      fanReason: val('fanReason'),
      highlight: val('highlight'),
      cool: parseNum('cool'),
      cute: parseNum('cute'),
      kind: parseNum('kind'),
      funny: parseNum('funny'),
      strong: parseNum('strong'),
      memory1: val('memory1'),
      memory2: val('memory2'),
      teacher: val('teacher'),
      island: val('island'),
      boss: val('boss'),
      junior: val('junior'),
      // 家族(選手名のみ) => 後でプレビューでmap
      father: val('family-father'),
      mother: val('family-mother'),
      brother: val('family-brother'),
      sister: val('family-sister'),
      youngerBrother: val('family-younger-brother'),
      youngerSister: val('family-younger-sister'),
      pet: val('family-pet'),
      message: val('message')
    };
  }
  function val(id){
    const el= document.getElementById(id);
    return el? el.value.trim():"";
  }
  function parseNum(id){
    const raw= val(id);
    if(!raw)return 0;
    const half= raw.replace(/[０-９]/g, c=> String.fromCharCode(c.charCodeAt(0)-0xFEE0));
    const n= parseFloat(half);
    return isNaN(n)?0:n;
  }

  // 5MB圧縮(繰り返し)
  function compressUntilUnder5MB(dataUrl, callback){
    const maxBytes= 5*1024*1024;
    if(dataUrl.length<= maxBytes*1.37){
      callback(dataUrl);
      return;
    }
    let qStep=9;
    let current= dataUrl;
    function doOne(){
      const q= qStep/10;
      compressImage(current,800,q,newUrl=>{
        if(!newUrl){ callback("");return;}
        if(newUrl.length<= maxBytes*1.37){
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
