document.addEventListener('DOMContentLoaded', () => {
  const goPreviewBtn = document.getElementById('goPreviewBtn');
  const photoInput   = document.getElementById('photo'); // 写真入力

  goPreviewBtn.addEventListener('click', () => {
    // --- 文字入力 ---
    const playerSelect   = document.getElementById('playerSelect').value;
    const nickname       = document.getElementById('nickname').value;
    const favoriteThing  = document.getElementById('favoriteThing').value;
    const fanReason      = document.getElementById('fanReason').value;
    const highlight      = document.getElementById('highlight').value;
    const oneword        = document.getElementById('oneword').value;
    const feature        = document.getElementById('feature').value;
    const outing         = document.getElementById('outing').value;
    const personality    = document.getElementById('personality').value;
    const cool   = parseFloat(document.getElementById('cool').value)   || 0;
    const cute   = parseFloat(document.getElementById('cute').value)   || 0;
    const kind   = parseFloat(document.getElementById('kind').value)   || 0;
    const funny  = parseFloat(document.getElementById('funny').value)  || 0;
    const strong = parseFloat(document.getElementById('strong').value) || 0;
    const memory1 = document.getElementById('memory1').value;
    const memory2 = document.getElementById('memory2').value;
    const teacher = document.getElementById('teacher').value;
    const island  = document.getElementById('island').value;
    const boss    = document.getElementById('boss').value;
    const junior  = document.getElementById('junior').value;
    const father  = document.getElementById('father').value;
    const mother  = document.getElementById('mother').value;
    const brother = document.getElementById('brother').value;
    const sister  = document.getElementById('sister').value;
    const youngerBrother = document.getElementById('youngerBrother').value;
    const youngerSister  = document.getElementById('youngerSister').value;
    const pet     = document.getElementById('pet').value;
    const message = document.getElementById('message').value;

    // まとめ（写真以外）
    const dataObj = {
      playerSelect,
      nickname,
      favoriteThing,
      fanReason,
      highlight,
      oneword,
      feature,
      outing,
      personality,
      cool, cute, kind, funny, strong,
      memory1, memory2,
      teacher, island, boss, junior,
      father, mother, brother, sister,
      youngerBrother, youngerSister, pet,
      message
    };

    // 写真ファイルをBase64化
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // e.target.result にBase64文字列(DataURL)が入る
        dataObj.photoDataURL = e.target.result;

        // LocalStorageに保存
        localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
        // 2ページ目を開く
        window.open('preview.html','_blank');
      };
      reader.readAsDataURL(file); // ファイルをDataURLとして読み込む
    } else {
      // 写真未選択
      dataObj.photoDataURL = ""; // 空
      localStorage.setItem('raidenProfileData', JSON.stringify(dataObj));
      window.open('preview.html','_blank');
    }
  });
});
