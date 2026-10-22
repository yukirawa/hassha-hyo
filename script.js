"use strict";
// --- 1. 型定義（インターフェース） ---
// --- 2. モックデータ（本来はサーバーから取得するデータ） ---
const mockApiResponse = {
    updatedAt: "2026-10-22T21:45:00+09:00",
    departures: [
        {
            id: "jr-001",
            time: "21:55",
            type: "JR",
            lineName: "函館本線",
            destination: "特急カムイ 44号 札幌", // 行先と列車名をくっつけて表示する例
            platform: "5",
            remarks: "停車駅: 深川、滝川、砂川、美唄、岩見沢、札幌",
            status: "NORMAL",
            delayMinutes: 0
        },
        {
            id: "bus-001",
            time: "22:05",
            type: "BUS",
            company: "旭川電気軌道",
            lineName: "55番",
            destination: "春光台4条4丁目",
            platform: "2",
            remarks: "定刻通り運行中",
            status: "NORMAL",
            delayMinutes: 0
        },
        {
            id: "jr-002",
            time: "22:10",
            type: "JR",
            lineName: "宗谷本線",
            destination: "普通 名寄",
            platform: "3",
            remarks: "約5分遅れで運転",
            status: "DELAY",
            delayMinutes: 5
        },
        {
            id: "bus-002",
            time: "22:15",
            type: "BUS",
            company: "道北バス",
            lineName: "80番",
            destination: "春光台",
            platform: "14",
            remarks: "定刻通り運行中",
            status: "NORMAL",
            delayMinutes: 0
        }
    ]
};
// --- 3. DOM操作・描画ロジック ---
// 全枠（4枠）のDOM要素をキャッシュする配列
const wakuElementsList = [];
const MAX_WAKU_COUNT = 4;
/**
 * 初回実行時：HTMLから4枠分の要素を取得してキャッシュする
 */
function initDomCache() {
    for (let i = 1; i <= MAX_WAKU_COUNT; i++) {
        const root = document.getElementById(`waku-${i}`);
        if (!root) {
            console.error(`waku-${i} が見つかりません。`);
            continue;
        }
        // 各パーツの要素を取得して保存
        // （querySelector の戻り値が null にならない前提（非nullアサーション `!`）で処理）
        wakuElementsList.push({
            root: root,
            time: root.querySelector('.time'),
            badge: root.querySelector('.badge'),
            line: root.querySelector('.line'),
            destination: root.querySelector('.destination'),
            platform: root.querySelector('.platform'),
            remarks: root.querySelector('.remarks')
        });
    }
}
/**
 * データを画面に反映させる関数
 * @param apiData サーバーから受け取ったデータ
 */
function renderBoard(apiData) {
    const list = apiData.departures;
    // 4枠分ループしてデータを上書き
    for (let i = 0; i < MAX_WAKU_COUNT; i++) {
        const elements = wakuElementsList[i];
        const item = list[i];
        if (item) {
            // データが存在する場合：テキストを反映
            elements.time.textContent = item.time;
            // バッジの色とテキスト設定
            elements.badge.textContent = item.type;
            if (item.type === 'JR') {
                elements.badge.style.backgroundColor = '#d97706'; // JRカラー(オレンジ)
            }
            else {
                elements.badge.style.backgroundColor = '#059669'; // バスカラー(緑)
            }
            elements.line.textContent = item.lineName;
            elements.destination.textContent = item.destination;
            elements.platform.textContent = item.platform + 'のりば';
            elements.remarks.textContent = item.remarks;
            // 枠の表示をオンにする
            elements.root.style.display = 'flex';
        }
        else {
            // 表示するデータが足りない場合：その枠自体を隠す
            elements.root.style.display = 'none';
        }
    }
}
// --- 4. 実行 ---
// ページ読み込み完了時に初期化と描画を行う
document.addEventListener('DOMContentLoaded', () => {
    initDomCache();
    // 最初はモックデータを表示する
    renderBoard(mockApiResponse);
});
