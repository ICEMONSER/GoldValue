const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" } // ยอมรับการเชื่อมต่อจาก GitHub Pages ทุกหน้าต่าง
});

// ตัวแปรสำหรับนับจำนวนแท็บที่เปิดอยู่ ณ ปัจจุบัน
let onlineTabsCount = 0;

io.on('connection', (socket) => {
    // เมื่อมีคนเปิดแท็บใหม่ (เกิดการต่อ Socket ใหม่) ให้บวกเพิ่ม 1
    onlineTabsCount++;
    
    // ส่งยอดรวมล่าสุดไปบอกทุกแท็บที่เปิดอยู่
    io.emit('userCount', onlineTabsCount);

    // เมื่อมีคนปิดแท็บ หรือรีเฟรชหน้าเว็บ (เกิดการตัดการเชื่อมต่อ)
    socket.on('disconnect', () => {
        // ให้ลบยอดออก 1
        onlineTabsCount--;
        
        // ป้องกันไม่ให้ตัวเลขติดลบ (เผื่อกรณีฉุกเฉิน)
        if (onlineTabsCount < 0) onlineTabsCount = 0;

        // ส่งยอดที่อัปเดตใหม่ไปบอกทุกแท็บที่เหลืออยู่
        io.emit('userCount', onlineTabsCount);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
