<div align="center">

<table frame="none" border="0">
  <tr>
    <td align="center" style="border: none;">
      <img src="public/icon.png" width="100" height="100" alt="eQet Logo">
    </td>
    <td style="border: none;">
      <h1 align="left">eQet — 地震早期警戒システム</h1>
      <p align="left"><b>Precision Seismic Visualization & Early Warning Dashboard</b></p>
    </td>
  </tr>
</table>

[![Deploy Web and Windows](https://github.com/qweew-eq/eQet/actions/workflows/set.yaml/badge.svg)](https://github.com/qweew-eq/eQet/actions/workflows/set.yaml)

[![Build](https://img.shields.io/badge/Build-Tauri-blueviolet?style=flat-square)](https://github.com/qweew-eq/eQet/actions)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Web-blue?style=flat-square)](https://github.com/qweew-eq/eQet/releases)
[![Version](https://img.shields.io/badge/Version-0.1.0-orange?style=flat-square)](https://github.com/qweew-eq/eQet/releases)

---

### 「一秒でも早く、正確な情報を。」
*Because every second counts in seismic safety.* ¯\\\_(ツ)_/¯

</div>

## 🇯🇵 概要 / Overview
**eQet** (イー・クウェト) は、Wolfxおよび気象庁（JMA）のデータを活用した、次世代のリアルタイム地震早期警戒（EEW）可視化ツールです。MapLibre GLの描画性能を最大限に活かし、P波・S波の到達予想範囲を正確にシミュレートします。

**eQet** is a high-performance EEW visualizer. It bridges the gap between raw seismic data and human-readable mapping, providing real-time wave propagation using MapLibre GL.

---

## ✨ 機能 / Features
- **⚡ リアルタイム速報 (Real-time Feed):** Wolfx WebSocket経由での即時データ取得。
- **🌊 波状伝播 (Wave Animation):** P波（疎密波）およびS波（横波）の物理的な到達範囲を地図上に描画。
- **🖥️ ネイティブ体験 (Native Performance):** Rust + Tauriによる超軽量・低負荷なWindowsアプリ。
- **🔊 マルチアラート (Audio Alerts):** 推定震度やマグニチュードに基づいた緊急警報音。

---

## 🛠️ 技術スタック / Tech Stack
| Component | Technology |
| :--- | :--- |
| **GUI Framework** | `Vite / JavaScript` |
| **Map Engine** | `MapLibre GL JS` |
| **Native Bridge** | `Rust / Tauri` |
| **Data Protocol** | `WebSocket / Wolfx API` |

---

## 📥 導入方法 / Installation

### **Windows Desktop**
1. [**Releases**](https://github.com/qweew-eq/eQet/releases) タブから最新の `.msi` ファイルをダウンロードします。
2. インストーラーを実行してアプリをインストールしてください。

### **Web Version**
[**Cloudflare Pages Deployment**](https://eqet-eew.pages.dev) にアクセスして、ブラウザでリアルタイムマップを確認できます。

---

<div align="center">
  <sub>Developed by <b>CurrentEEW</b>. Data provided by Wolfx.</sub>
  <br />
  <small>※本ソフトウェアは、地震による被害の軽減を目的としていますが、情報の正確性を保証するものではありません。実際の避難の際は気象庁の指示に従ってください。</small>
</div>
