const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" } // อนุญาตให้ GitHub Pages ทุกหน้าต่างเชื่อมต่อเข้ามาได้
});

let onlineTabsCount = 0;

io.on('connection', (socket) => {
    // เพิ่มจำนวนเมื่อมีแท็บเชื่อมต่อเข้ามาใหม่
    onlineTabsCount++;
    io.emit('userCount', onlineTabsCount);

    // ลดจำนวนเมื่อแท็บนั้นถูกปิด หรือกด Refresh
    socket.on('disconnect', () => {
        onlineTabsCount--;
        if (onlineTabsCount < 0) onlineTabsCount = 0;
        io.emit('userCount', onlineTabsCount);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
