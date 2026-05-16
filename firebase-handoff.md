# 能量補給站 — Firebase 串接說明
給 Claude Code 的交接文件

---

## 專案背景

一個「能量補給站」的單頁 HTML app。
朋友之間共享正能量內容（圖片、GIF、影片連結、語錄），
加上個人私密收藏。

目前是單一 HTML 檔，所有資料存在 localStorage。
目標：把公開內容改存 Firebase，讓朋友能真正共享。

---

## 目前檔案

`energy-station-v5.html` — 單一 HTML 檔，包含所有 CSS 和 JS。

---

## 需要做的事

1. 帶我申請 Firebase 專案（Firestore + Storage）
2. 把公開內容的讀寫改成 Firebase
3. 私密內容繼續留在 localStorage，不上傳
4. 把 app 部署到網路（Firebase Hosting 或其他），朋友可以用同一個連結開啟

---

## 資料邏輯

### 目前的 localStorage key
- `universe_items` — 所有內容（公開＋私密混在一起）
- `my_heart` — 使用者身份（💚🧡💛🩶💙 其中一個）

### 每筆 item 的欄位
```json
{
  "id": 1234567890,
  "type": "image | gif | video | quote",
  "data": "base64字串（圖片和GIF用）",
  "url": "影片連結（影片用）",
  "title": "影片標題（影片用）",
  "text": "語錄內容（語錄用）",
  "source": "語錄來源（語錄用）",
  "heart": "💛",
  "msg": "留言",
  "priv": true
}
```

### 分流邏輯
- `priv: true` → 繼續存 localStorage，絕對不上傳
- `priv: false` → 存到 Firebase，所有人共享

---

## Firebase 建議架構

### Firestore
公開的文字類內容（語錄、影片連結）直接存 Firestore：
```
collection: items
document fields: id, type, url, title, text, source, heart, msg, createdAt
```

### Firebase Storage
圖片和 GIF 改用 Storage 存檔案本體，Firestore 只存下載 URL：
```
storage path: images/{id}
firestore field: url (Storage 下載連結)
```

> ⚠️ 目前圖片是 base64，直接存 Firestore 會超過單筆 1MB 限制，
> 所以圖片一定要改走 Storage。

---

## 注意事項

- 不需要帳號登入系統，身份（myHeart）只存本機
- 朋友透過同一個網址加入，不需要任何帳號
- 私密內容對任何人都不可見，包括 Firebase 後台
- 現有 localStorage 的公開資料，串接後可以考慮做一次性遷移
- Firebase 免費方案（Spark）對小圈子夠用，注意圖片 Storage 免費額度是 5GB

---

## 部署目標

Firebase Hosting 最方便（跟 Firestore 同專案）。
部署完成後朋友用同一個網址開啟，即可共享公開內容。

---

## 使用者體驗重點

- 上傳時選「公開」→ 存 Firebase，所有人看得到
- 上傳時選「私密」→ 存 localStorage，只有自己這台裝置看得到
- 扭蛋機「混合」機台 → 抽公開＋自己的私密
- 扭蛋機「個人」機台 → 只抽自己上傳的公開內容＋私密
- 扭蛋機「自訂」機台 → 自己勾選來源和類型
